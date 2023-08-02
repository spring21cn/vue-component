(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueScrollbar = definition(context.Vue, context.VueUtil);
    delete context.VueScrollbar;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var Bar = {
    name: 'Bar',
    props: {
      vertical: Boolean,
      size: Number,
      move: Number,
      disSize: Number
    },
    computed: {
      bar: function() {
        var BAR_MAP = {
          vertical: {
            offset: 'offsetHeight',
            scroll: 'scrollTop',
            scrollSize: 'scrollHeight',
            size: 'height',
            key: 'vertical',
            axis: 'Y',
            client: 'clientY',
            direction: 'top'
          },
          horizontal: {
            offset: 'offsetWidth',
            scroll: 'scrollLeft',
            scrollSize: 'scrollWidth',
            size: 'width',
            key: 'horizontal',
            axis: 'X',
            client: 'clientX',
            direction: 'left'
          }
        };
        return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
      },
      wrap: function() {
        return this.$parent.wrap;
      }
    },
    render: function(createElement) {
      var self = this;
      var move = self.move;
      var size = self.size;
      var bar = self.bar;
      var renderThumbStyle = function(obj) {
        var move = obj.move;
        var size = obj.size;
        var bar = obj.bar;
        if (size === 0) move = 0;
        var style = {};
        if (bar.axis === 'Y') {
          style.marginTop = move + 'px';
        }
        if (bar.axis === 'X') {
          style.marginLeft = move + 'px';
        }
        style[bar.size] = size + 'px';
        return style;
      };
      return createElement('div', {
        class: ['vue-scrollbar__bar', 'is-' + bar.key],
        on: {
          mousedown: self.clickTrackHandler
        }
      }, [createElement('div', {
        ref: 'thumb',
        class: 'vue-scrollbar__thumb',
        on: {
          mousedown: self.clickThumbHandler,
          touchstart: self.clickThumbHandler,
        },
        style: renderThumbStyle({
          size: size,
          move: move,
          bar: bar
        })
      }, [])]);
    },
    methods: {
      clickThumbHandler: function(e) {
        this[this.bar.axis] = e.currentTarget[this.bar.offset] - ((e[this.bar.client] || e.touches[0][this.bar.client]) - e.currentTarget.getBoundingClientRect()[this.bar.direction]);
        this.startDrag(e);
      },
      clickTrackHandler: function(e) {
        var offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
        var thumbHalf = this.$refs.thumb[this.bar.offset] / 2;
        this.wrap[this.bar.scroll] = (offset - thumbHalf) / (this.$el[this.bar.offset] + this.disSize) * this.wrap[this.bar.scrollSize];
      },
      startDrag: function(e) {
        e.stopImmediatePropagation();
        VueUtil.addTouchMove(document, this.mouseMoveDocumentHandler);
        VueUtil.addTouchEnd(document, this.mouseUpDocumentHandler);
        document.onselectstart = function() {
          return false;
        };
      },
      mouseMoveDocumentHandler: function(e) {
        var prevPage = this[this.bar.axis];
        if (!prevPage) return;
        var offset = (this.$el.getBoundingClientRect()[this.bar.direction] - (e[this.bar.client] || e.touches[0][this.bar.client])) * -1;
        var thumbClickPosition = this.$refs.thumb[this.bar.offset] - prevPage;
        this.wrap[this.bar.scroll] = (offset - thumbClickPosition) / (this.$el[this.bar.offset] + this.disSize) * this.wrap[this.bar.scrollSize];
      },
      mouseUpDocumentHandler: function(e) {
        this[this.bar.axis] = 0;
        VueUtil.removeTouchMove(document, this.mouseMoveDocumentHandler);
        VueUtil.removeTouchEnd(document, this.mouseUpDocumentHandler);
        document.onselectstart = null;
      }
    }
  };
  var VueScrollbar = {
    name: 'VueScrollbar',
    components: {
      Bar: Bar
    },
    props: {
      wrapClass: {},
      viewClass: {},
      height: Number,
      width: Number,
      noresize: Boolean,
      doScroll: {
        type: Boolean,
        default: true
      },
      tag: {
        type: String,
        default: 'div'
      }
    },
    data: function() {
      return {
        sizeWidth: 0,
        sizeHeight: 0,
        moveX: 0,
        moveY: 0,
        disSizeX: 0,
        disSizeY: 0
      };
    },
    computed: {
      wrap: function() {
        return this.$refs.wrap;
      },
      resizeElement: function() {
        var view = this.$refs.resize;
        if (VueUtil.isDef(view) && VueUtil.isElement(view.$el)) {
          return view.$el;
        }
        return view;
      },
      mouseWheelEvent: function() {
        return VueUtil.isFirefox ? 'DOMMouseScroll' : 'mousewheel';
      },
    },
    render: function(createElement) {
      var self = this;
      var viewHeight = null;
      var viewWidth = null;
      if (VueUtil.isNumber(self.height)) {
        viewHeight =  self.height + 'px';
      }
      if (VueUtil.isNumber(self.width)) {
        viewWidth =  self.width + 'px';
      }
      var view = createElement(self.tag, {
        class: ['vue-scrollbar__view', self.viewClass],
        ref: 'resize'
      }, [self.$slots.default]);
      var wrap = createElement('div', {
        ref: 'wrap',
        style: {height: viewHeight, width: viewWidth},
        on: {
          scroll: self.handleScroll
        },
        class: [self.wrapClass, 'vue-scrollbar__wrap']
      }, [view]);
      var nodes = [wrap, createElement(Bar, {
        style: {width: viewWidth},
        attrs: {
          move: self.moveX,
          size: self.sizeWidth,
          disSize: self.disSizeX
        }
      }, []), createElement(Bar, {
        style: {height: viewHeight},
        attrs: {
          vertical: true,
          move: self.moveY,
          size: self.sizeHeight,
          disSize: self.disSizeY
        }
      }, [])];
      return createElement('div', {
        class: 'vue-scrollbar'
      }, nodes);
    },
    methods: {
      isScrollCancel: function(el) {
        if (el === this.wrap) return false;
        var overflowY = VueUtil.getStyle(el, 'overflowY');
        if (['auto', 'scroll'].indexOf(overflowY) !== -1 && el.scrollHeight > el.clientHeight) return true;
        return this.isScrollCancel(el.parentElement);
      },
      scrollMouseWheel: function(e) {
        if (!this.doScroll) return;
        if (this.isScrollCancel(e.target)) return;
        e.stopPropagation();
        e.preventDefault();
        var wheelDelta = e.wheelDelta || -e.detail;
        var scrollTop = this.wrap.scrollTop;
        var wheel = 90;
        if (wheelDelta < 0) {
          scrollTop += wheel;
        } else {
          scrollTop -= wheel;
        }
        this.wrap.scrollTop = scrollTop;
      },
      touchStart: function(e) {
        if (this.isScrollCancel(e.target)) return;
        e.stopImmediatePropagation();
        VueUtil.addClass(this.$el, 'is-touch');
        var wrap = this.wrap;
        var touches = e.touches[0];
        var tocuhPlace = this.tocuhPlace;
        if (!VueUtil.isDef(tocuhPlace)) {
          tocuhPlace = this.tocuhPlace = {};
        }
        tocuhPlace.startTime = e.timeStamp;
        tocuhPlace.startY = wrap.scrollTop;
        tocuhPlace.tocuhX = touches.pageX;
        tocuhPlace.tocuhY = touches.pageY;
        clearInterval(tocuhPlace.timer);
        VueUtil.on(document, 'touchmove', this.touchMove);
        VueUtil.on(document, 'touchend', this.touchEnd);
      },
      touchMove: function(e) {
        VueUtil.addClass(this.$el, 'touching');
        var touches = e.touches[0];
        var wrap = this.wrap;
        var tocuhPlace = this.tocuhPlace;
        var scrollLeft = tocuhPlace.tocuhX - touches.pageX;
        var scrollTop = tocuhPlace.tocuhY - touches.pageY;
        wrap.scrollLeft = wrap.scrollLeft + scrollLeft;
        wrap.scrollTop = wrap.scrollTop + scrollTop;
        tocuhPlace.tocuhX = touches.pageX;
        tocuhPlace.tocuhY = touches.pageY;
      },
      touchEnd: function(e) {
        var self = this;
        var wrap = this.wrap;
        var tocuhPlace = this.tocuhPlace;
        var timeStamp = e.timeStamp - tocuhPlace.startTime;
        if (timeStamp <= 200) {
          var moveY = Math.floor(((wrap.scrollTop - tocuhPlace.startY) * 100 / timeStamp) / 4);
          tocuhPlace.timer = setInterval(function() {
            var tmpScrollTop = wrap.scrollTop;
            wrap.scrollTop = wrap.scrollTop + moveY;
            moveY > 0 ? moveY-- : moveY++;
            if (moveY === 0 || wrap.scrollTop === tmpScrollTop) {
              VueUtil.removeClass(self.$el, 'touching');
              clearInterval(tocuhPlace.timer);
            }
          }, 66);
        } else {
          VueUtil.removeClass(this.$el, 'touching');
        }
        VueUtil.off(document, 'touchmove',this.touchMove);
        VueUtil.off(document, 'touchend', this.touchEnd);
      },
      handleScroll: VueUtil.throttle(function(e) {
        if (!VueUtil.isDef(e.touches)) VueUtil.removeClass(this.$el, 'is-touch');
        this.update();
        var wrap = this.wrap;
        var moveY = wrap.scrollTop / wrap.scrollHeight * wrap.clientHeight;
        var moveX = wrap.scrollLeft / wrap.scrollWidth * wrap.clientWidth;
        var sizeHeight = this.sizeHeight;
        var sizeWidth = this.sizeWidth;
        var minHeight = wrap.clientHeight * 0.1;
        var minWidth = wrap.clientWidth * 0.1;
        if (sizeHeight < minHeight && sizeHeight !== 0) {
          moveY = wrap.scrollTop / wrap.scrollHeight * (wrap.clientHeight - minHeight + sizeHeight);
          this.sizeHeight = minHeight;
          this.disSizeY = sizeHeight - minHeight;
        }
        if (sizeWidth < minWidth && sizeWidth !== 0) {
          moveX = wrap.scrollLeft / wrap.scrollWidth * (wrap.clientHeight - minWidth + sizeWidth);
          this.sizeWidth = minWidth;
          this.disSizeX = sizeWidth - minWidth;
        }
        if (this.moveY !== moveY) {
          this.moveY = moveY;
          var isTop = (wrap.scrollTop === 0);
          var isBottom = (wrap.scrollHeight - wrap.scrollTop === wrap.clientHeight);
          this.$emit('scrollY', e, wrap.scrollTop, isTop, isBottom);
        }
        if (this.moveX !== moveX) {
          this.moveX = moveX;
          var isLeft = (wrap.scrollLeft === 0);
          var isRight = (wrap.scrollWidth - wrap.scrollLeft === wrap.clientWidth);
          this.$emit('scrollX', e, wrap.scrollLeft, isLeft, isRight);
        }
      }),
      update: function() {
        var wrap = this.wrap;
        var heightPercentage = wrap.clientHeight * 100 / wrap.scrollHeight;
        var widthPercentage = wrap.clientWidth * 100 / wrap.scrollWidth;
        var sizeHeight = heightPercentage < 100 ? wrap.clientHeight * heightPercentage / 100 : 0;
        var sizeWidth = widthPercentage < 100 ? wrap.clientWidth * widthPercentage / 100 : 0;
        this.sizeHeight = sizeHeight;
        this.sizeWidth = sizeWidth;
        this.disSizeX = 0;
        this.disSizeY = 0;
      },
      goTop: function() {
        this.wrap.scrollTop = 0;
      }
    },
    mounted: function() {
      VueUtil.on(this.wrap, this.mouseWheelEvent, this.scrollMouseWheel);
      VueUtil.on(this.wrap, 'touchstart', this.touchStart);
      VueUtil.addHoverListener(this.wrap, this.handleScroll);
      !this.noresize && this.resizeElement && VueUtil.addResizeListener(this.resizeElement, this.update);
    },
    beforeDestroy: function() {
      VueUtil.off(this.wrap, this.mouseWheelEvent, this.scrollMouseWheel);
      VueUtil.off(this.wrap, 'touchstart', this.touchStart);
      VueUtil.removeHoverListener(this.wrap, this.handleScroll);
      !this.noresize && this.resizeElement && VueUtil.removeResizeListener(this.resizeElement, this.update);
    }
  };
  Vue.component(VueScrollbar.name, VueScrollbar);
});
