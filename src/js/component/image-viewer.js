(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.ImageViewer = definition(context.Vue, context.VueUtil);
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var isServer = Vue.prototype.$isServer;
  var template= '\
    <transition name="viewer-fade"> \
      <div class="vue-image-viewer__wrapper" :style="{ \'z-index\': zIndex }"> \
        <div class="vue-image-viewer__mask"></div> \
        <!-- CLOSE --> \
        <span class="vue-image-viewer__btn vue-image-viewer__close" @click="hide"> \
          <i class="vue-icon-close"></i> \
        </span> \
        <!-- ARROW --> \
        <template v-if="!isSingle"> \
          <span class="vue-image-viewer__btn vue-image-viewer__prev" :class="{ \'is-disabled\': !infinite && isFirst }" \
            @click="prev"> \
            <i class="vue-icon-arrow-left"/> \
          </span> \
          <span class="vue-image-viewer__btn vue-image-viewer__next" \
            :class="{ \'is-disabled\': !infinite && isLast }" @click="next"> \
            <i class="vue-icon-arrow-right"/> \
          </span> \
        </template> \
        <!-- ACTIONS --> \
        <div class="vue-image-viewer__btn vue-image-viewer__actions"> \
          <div class="vue-image-viewer__actions__inner"> \
            <i class="vue-icon-zoom-out" @click="handleActions(\'zoomOut\')"></i> \
            <i class="vue-icon-zoom-in" @click="handleActions(\'zoomIn\')"></i> \
            <i class="vue-image-viewer__actions__divider"></i> \
            <i :class="mode.icon" @click="toggleMode"></i> \
            <i class="vue-image-viewer__actions__divider"></i> \
            <i class="vue-icon-rotate-left" @click="handleActions(\'anticlocelise\')"></i> \
            <i class="vue-icon-rotate-right" @click="handleActions(\'clocelise\')"></i> \
          </div> \
        </div> \
        <!-- CANVAS --> \
        <div class="vue-image-viewer__canvas"> \
          <img v-for="(url, i) in urlList" \
            v-if="i === index" ref="img" class="vue-image-viewer__img" \
            :key="url" :src="currentImg" :style="imgStyle" @load="handleImgLoad" \
            @error="handleImgError" @mousedown="handleMouseDown"> \
        </div> \
      </div> \
    </transition>';

  var on = VueUtil.on,off=VueUtil.off;
  var rafThrottle = function(fn) {
    var locked = false;
    return function() {
     var args = [];
     for(var i=0;i<arguments.length;i++){
         args.push(arguments[i]);
     }
     if (locked) return;
       locked = true;
        var self = this;
        window.requestAnimationFrame(function(){
        fn.apply(self, args);
        locked = false;
        });
    };
  },
  isFirefox = function() {
    return !Vue.prototype.$isServer && !!window.navigator.userAgent.match(/firefox/i);
  };
  
  
  var Mode = {
    CONTAIN: {
      name: 'contain',
      icon: 'vue-icon-enlarge'
    },
    ORIGINAL: {
      name: 'original',
      icon: 'vue-icon-shrink'
    }
  };
  
  var mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel';
  
  //export default {
  var ImageViewer = {
    template: template,
    name: 'ImageViewer',
  
    props: {
      urlList: {
        type: Array,
        default: function(){ return [];}
      },
      zIndex: {
        type: Number,
        default: 2000
      },
      onSwitch: {
        type: Function,
        default: function(){ return {};}
      },
      onClose: {
        type: Function,
        default: function(){ return {};}
      }
    },
  
    data: function() {
      return {
        index: 0,
        isShow: false,
        infinite: true,
        loading: false,
        mode: Mode.CONTAIN,
        transform: {
          scale: 1,
          deg: 0,
          offsetX: 0,
          offsetY: 0,
          enableTransition: false
        }
      };
    },
    computed: {
      isSingle: function() {
        return this.urlList.length <= 1;
      },
      isFirst: function() {
        return this.index === 0;
      },
      isLast: function() {
        return this.index === this.urlList.length - 1;
      },
      currentImg: function() {
        return this.urlList[this.index];
      },
      imgStyle: function() {
        var transform = this.transform;
        var scale = transform['scale'],
            deg = transform['deg'],
            offsetX = transform['offsetX'],
            offsetY = transform['offsetY'],
            enableTransition = transform['enableTransition'];
        var style = {
          transform: 'scale('+scale+') rotate('+deg+'deg)',
          transition: enableTransition ? 'transform .3s' : '',
          'margin-left': offsetX+'px',
          'margin-top': offsetY+'px'
        };
        if (this.mode === Mode.CONTAIN) {
          style.maxWidth = style.maxHeight = '100%';
        }
        return style;
      }
    },
    watch: {
      index: {
        handler: function(val) {
          this.reset();
          this.onSwitch(val);
        }
      },
      currentImg: function(val) {
        var self = this;
        this.$nextTick(function(){
          var $img = self.$refs.img[0];
          if (!$img.complete) {
            self.loading = true;
          }
        });
      }
    },
    methods: {
      hide: function() {
        this.deviceSupportUninstall();
        this.onClose();
      },
      deviceSupportInstall: function() {
        var self = this;
        this._keyDownHandler = rafThrottle(function(e) {
          var keyCode = e.keyCode;
          switch (keyCode) {
            // ESC
            case 27:
              self.hide();
              break;
            // SPACE
            case 32:
              self.toggleMode();
              break;
            // LEFT_ARROW
            case 37:
              self.prev();
              break;
            // UP_ARROW
            case 38:
              self.handleActions('zoomIn');
              break;
            // RIGHT_ARROW
            case 39:
              self.next();
              break;
            // DOWN_ARROW
            case 40:
              self.handleActions('zoomOut');
              break;
          }
        });
        self._mouseWheelHandler = rafThrottle(function(e){
          var delta = e.wheelDelta ? e.wheelDelta : -e.detail;
          if (delta > 0) {
            self.handleActions('zoomIn', {
              zoomRate: 0.015,
              enableTransition: false
            });
          } else {
            self.handleActions('zoomOut', {
              zoomRate: 0.015,
              enableTransition: false
            });
          }
        });
        on(document, 'keydown', self._keyDownHandler);
        on(document, mousewheelEventName, self._mouseWheelHandler);
      },
      deviceSupportUninstall: function() {
        off(document, 'keydown', this._keyDownHandler);
        off(document, mousewheelEventName, this._mouseWheelHandler);
        this._keyDownHandler = null;
        this._mouseWheelHandler = null;
      },
      handleImgLoad: function(e) {
        this.loading = false;
      },
      handleImgError: function(e) {
        this.loading = false;
        e.target.alt = '加载失败';
      },
      handleMouseDown: function(e) {
        var self = this;
        if (self.loading || e.button !== 0) return;
  
        var offsetX = self.transform['offsetX'],
            offsetY = self.transform['offsetY'];
        var startX = e.pageX;
        var startY = e.pageY;
        self._dragHandler = rafThrottle(function(ev){
          self.transform.offsetX = offsetX + ev.pageX - startX;
          self.transform.offsetY = offsetY + ev.pageY - startY;
        });
        on(document, 'mousemove', self._dragHandler);
        on(document, 'mouseup', function(ev) {
          off(document, 'mousemove', self._dragHandler);
        });

        e.preventDefault();
      },
      reset: function() {
        this.transform = {
          scale: 1,
          deg: 0,
          offsetX: 0,
          offsetY: 0,
          enableTransition: false
        };
      },
      toggleMode: function() {
        if (this.loading) return;

        var modeNames = Object.keys(Mode);
        //var modeValues = Object.values(Mode);
        var modeValues = [];
        for(var i=0;i<modeNames.length;i++){
            modeValues.push(Mode[modeNames[i]]);
        }
        var index = modeValues.indexOf(this.mode);
        var nextIndex = (index + 1) % modeNames.length;
        this.mode = Mode[modeNames[nextIndex]];
        this.reset();
      },
      prev: function() {
        if (this.isFirst && !this.infinite) return;
        var len = this.urlList.length;
        this.index = (this.index - 1 + len) % len;
      },
      next: function() {
        if (this.isLast && !this.infinite) return;
        var len = this.urlList.length;
        this.index = (this.index + 1) % len;
      },
      handleActions: function(action, options) {
        if(!VueUtil.isDef(options)){
            options = {};
        }
        if (this.loading) return;
        var temp = {
          zoomRate: 0.2,
          rotateDeg: 90,
          enableTransition: true,
          options:options
        }
        var zoomRate = temp.zoomRate,
        rotateDeg = temp.rotateDeg,
        enableTransition = temp.enableTransition;
        var transform = this.transform;
        switch (action) {
          case 'zoomOut':
            if (transform.scale > 0.2) {
              transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3));
            }
            break;
          case 'zoomIn':
            transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
            break;
          case 'clocelise':
            transform.deg += rotateDeg;
            break;
          case 'anticlocelise':
            transform.deg -= rotateDeg;
            break;
        }
        transform.enableTransition = enableTransition;
      }
    },
    mounted: function() {
      this.deviceSupportInstall();
    }
  };
  //Vue.component(ImageViewer.name, ImageViewer);
  return ImageViewer;
});