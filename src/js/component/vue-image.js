(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil','ImageViewer'], definition);
  } else {
    context.VueImage = definition(context.Vue, context.VueUtil,context.ImageViewer);
    delete context.VueImage;
    delete context.ImageViewer;
  }
})(this, function(Vue, VueUtil,ImageViewer) {
  'use strict';
  var template = ' \
    <div :class="{\'vue-image\':true,\'vue-image__lazy\':lazy,\'vue-image__round\':round}"> \
      <div v-html="svgContent" v-if="isTextSvg" v-show="false"></div>\
      <span v-if="showText" class="vue-image__label"\
        v-bind="$attrs" v-on="$listeners" \
        @click="clickHandler" :class="{\'vue-image__preview\': preview }">{{imgLabel}}</span>\
      <slot v-else-if="loading" name="placeholder"> \
        <div class="vue-image__placeholder"></div> \
      </slot> \
      <slot v-else-if="error" name="error"> \
        <div class="vue-image__error">{{$t("vue.image.error")}}</div> \
      </slot> \
      <svg v-else-if="isTextSvg" @click="clickHandler" class="vue-image__inner" :viewBox="[0,0,imageWidth,imageHeight].join(\' \')"\
      v-bind="$attrs" v-on="$listeners" :style="imageStyle" :class="{ \'vue-image__inner--center\': alignCenter, \'vue-image__preview\': preview }"><use :xlink:href="\'#\'+id"/></svg>\
      <img \
        v-else \
        class="vue-image__inner" \
        v-bind="$attrs" \
        v-on="$listeners" \
        @click="clickHandler" \
        :src="src" \
        :style="imageStyle" \
        :class="{ \'vue-image__inner--center\': alignCenter, \'vue-image__preview\': preview }"> \
      <vue-image-viewer :z-index="zIndex" v-if="preview && showViewer" :on-close="closeViewer" :url-list="previewSrcList" :active-index="previewActiveIndex"/> \
    </div>';
    
  var isServer = Vue.prototype.$isServer;
  var Locale  = {};
  var on = VueUtil.on,off=VueUtil.off;
  var getStyle = VueUtil.getStyle,
  isScroll = function(el, vertical){
    if (isServer) return;
    var determinedDirection = vertical !== null || vertical !== undefined;
    var overflow = determinedDirection
      ? vertical ? getStyle(el, 'overflow-y') : getStyle(el, 'overflow-x')
      : getStyle(el, 'overflow');
    return overflow.match(/(scroll|auto)/);
  },
  getScrollContainer = function(el, vertical){
    if (isServer) return;
    var parent = el;
    while (parent) {
      //if ([window, document, document.documentElement].includes(parent)) {
      if ([window, document, document.documentElement].indexOf(parent)>-1) {
        return window;
      }
      if (isScroll(parent, vertical)) {
        return parent;
      }
      parent = parent.parentNode;
    }
    return parent;
  },
  isInContainer = function(el, container){
    if (isServer || !el || !container) return false;
  
    var elRect = el.getBoundingClientRect();
    var containerRect;

    //if ([window, document, document.documentElement, null, undefined].includes(container)) {
    if ([window, document, document.documentElement, null, undefined].indexOf(container)>-1) {
      containerRect = {
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
        left: 0
      };
    } else {
      containerRect = container.getBoundingClientRect();
    }
  
    return elRect.top < containerRect.bottom &&
      elRect.bottom > containerRect.top &&
      elRect.right > containerRect.left &&
      elRect.left < containerRect.right;
  };
  var isString = VueUtil.isString,
      isHtmlElement = function(node) { return node && node.nodeType === Node.ELEMENT_NODE; };

  var isSupportObjectFit = function(){
      return document.documentElement.style.objectFit !== undefined;
  };

  var ObjectFit = {
    NONE: 'none',
    CONTAIN: 'contain',
    COVER: 'cover',
    FILL: 'fill',
    SCALE_DOWN: 'scale-down'
  };

  //export default {
  var VueImage = {
    template:template,
    name: 'VueImage',

    mixins: [Locale],
    inheritAttrs: false,

    components: {
      ImageViewer:ImageViewer
    },

    props: {
      download:Boolean,
      src: String,
      fit: String,
      lazy: Boolean,
      textSvg: Boolean,
      scrollContainer: {},
      previewSrcList: {
        type: Array,
        default: function(){return [];}
      },
      zIndex: {
        type: Number,
        default: 2000
      },
      imgLabel: String,
      round: Boolean,
      previewActiveIndex: Number
    },

    data:function() {
      return {
        loading: true,
        error: false,
        show: !this.lazy,
        imageWidth: 0,
        imageHeight: 0,
        showViewer: false,
        svgContent: '',
        id: 'svg'+VueUtil.createUuid(),
      };
    },

    computed: {
      imageStyle: function() {
        var fit = this.fit;
        if (!this.$isServer && fit) {
          return isSupportObjectFit()
            ? { 'object-fit': fit }
            : this.getImageStyle(fit);
        }
        return {};
      },
      alignCenter: function() {
        return !this.$isServer && !isSupportObjectFit() && this.fit !== ObjectFit.FILL;
      },
      preview: function() {
        var previewSrcList = this.previewSrcList;
        return Array.isArray(previewSrcList) && previewSrcList.length > 0;
      },
      showText: function() {
        return (typeof this.imgLabel != 'undefined' && this.imgLabel != '');
      },
      isTextSvg: function() {
        return this.textSvg && this.src && this.src.indexOf('.svg') > 0;
      }
    },

    watch: {
      src:function(val) {
        this.show && this.loadImage();
      },
      show:function(val) {
        val && this.loadImage();
      }
    },

    mounted: function() {
      if (this.lazy) {
        this.addLazyLoadListener();
      } else {
        this.loadImage();
      }
    },

    beforeDestroy: function() {
      this.lazy && this.removeLazyLoadListener();
    },

    methods: {
      loadImage: function() {
        if (this.$isServer) return;
        var self = this;
        // reset status
        this.loading = true;
        this.error = false;

        if (this.isTextSvg) {
          Vue.http.get(self.src).then(function(resp) {
            var content = resp.body;
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            var svgEle = tempDiv.querySelector('svg');
            svgEle.setAttribute('id', self.id);
            var width = svgEle.getAttribute('width');
            var height = svgEle.getAttribute('height');

            self.svgContent = svgEle.outerHTML;
            self.handleLoad(null, {width: width, height: height});
          }).catch(self.handleError);
        } else {
          var img = new Image();

          img.onload = function(e){self.handleLoad(e, img);};
          img.onerror = self.handleError.bind(self);
  
          // bind html attrs
          // so it can behave consistently
          Object.keys(self.$attrs)
            .forEach(function(key){
              var value = self.$attrs[key];
              img.setAttribute(key, value);
            });
          img.src = self.src;
        }
      },
      handleLoad: function(e, img) {
        this.error = false;
        this.imageWidth = img.width;
        this.imageHeight = img.height;
        this.loading = false;
        this.$emit('load', e);
      },
      handleError: function(e) {
        this.loading = false;
        this.error = true;
        this.$emit('error', e);
      },
      handleLazyLoad: function() {
        if (isInContainer(this.$el, this._scrollContainer)) {
          this.show = true;
          this.$emit('lazyload');
          this.removeLazyLoadListener();
        }
      },
      addLazyLoadListener: function() {
        if (this.$isServer) return;

        var scrollContainer = this.scrollContainer;
        var _scrollContainer = null;

        if (isHtmlElement(scrollContainer)) {
          _scrollContainer = scrollContainer;
        } else if (isString(scrollContainer)) {
          _scrollContainer = document.querySelector(scrollContainer);
        } else {
          _scrollContainer = getScrollContainer(this.$el);
        }

        if (_scrollContainer) {
          this._scrollContainer = _scrollContainer;
          this._lazyLoadHandler = VueUtil._throttle(this.handleLazyLoad, 200, {
            trailing: true
          });
          on(_scrollContainer, 'scroll', this._lazyLoadHandler);
          this.handleLazyLoad();
        }
      },
      removeLazyLoadListener: function() {
        var _scrollContainer = this._scrollContainer,
        _lazyLoadHandler = this._lazyLoadHandler;

        if (this.$isServer || !_scrollContainer || !_lazyLoadHandler) return;

        off(_scrollContainer, 'scroll', _lazyLoadHandler);
        this._scrollContainer = null;
        this._lazyLoadHandler = null;
      },
      /**
       * simulate object-fit behavior to compatible with IE11 and other browsers which not support object-fit
       */
      getImageStyle: function(fit) {
        var imageWidth = this.imageWidth,
            imageHeight = this.imageHeight;
        var containerWidth = this.$el.clientWidth,
            containerHeight = this.$el.clientHeight;

        if (!imageWidth || !imageHeight || !containerWidth || !containerHeight) return {};

        var vertical = imageWidth / imageHeight < 1;

        if (fit === ObjectFit.SCALE_DOWN) {
          var isSmaller = imageWidth < containerWidth && imageHeight < containerHeight;
          fit = isSmaller ? ObjectFit.NONE : ObjectFit.CONTAIN;
        }

        switch (fit) {
          case ObjectFit.NONE:
            return { width: 'auto', height: 'auto' };
          case ObjectFit.CONTAIN:
            return vertical ? { width: 'auto' } : { height: 'auto' };
          case ObjectFit.COVER:
            return vertical ? { height: 'auto' } : { width: 'auto' };
          default:
            return {};
        }
      },
  clickDownload: function(){
		var src = this.src,
      imgLabel = this.imgLabel;
		if(typeof src == 'undefined' || src == '') return;
		
		var a = document.createElement('a');
        var event = new MouseEvent('click');
        a.download = imgLabel;
        a.href = src;
        a.dispatchEvent(event);    
    },
      clickHandler: function() {
		if(this.download){
			this.clickDownload();
		}else{
			this.showViewer = true;
		}
      },
      closeViewer: function() {
        this.showViewer = false;
      }
    }
  };
  Vue.component(VueImage.name, VueImage);
});