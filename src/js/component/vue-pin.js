(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VuePin = definition(context.Vue, context.VueUtil);
    delete context.VuePin;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VuePin = {
    template: '<div class="vue-pin" :class="pinClass"><div :style="styles"><slot></slot></div></div>',
    name: 'VuePin',
    props: {
      offsetTop: {
        type: Number,
        default: 0
      },
      offsetBottom: {
        type: Number
      },
      fixed: Boolean
    },
    data: function() {
      return {
        pin: false,
        styles: {}
      };
    },
    computed: {
      offsetType: function() {
        var type = 'top';
        if (this.offsetBottom >= 0) {
          type = 'bottom';
        }
        return type;
      },
      pinClass: function() {
        return {
          'vue-pin-pined': this.pin,
        };
      }
    },
    mounted: function() {
      var self = this;
      self.$nextTick(function() {
        if (self.fixed) {
          self.pin = true;
          var elOffset = self.getOffset(self.$el);
          if (self.offsetType == 'bottom') {
            self.styles = {
              bottom: self.offsetBottom + 'px',
              left: elOffset.left + 'px',
              width: self.$el.offsetWidth + 'px',
              position: 'fixed',
              zIndex: VueUtil.nextZIndex()
            };
          } else {
            self.styles = {
              top: self.offsetTop + 'px',
              left: elOffset.left + 'px',
              width: self.$el.offsetWidth + 'px',
              position: 'fixed',
              zIndex: VueUtil.nextZIndex()
            };
          }
        } else {
          self.scrollParent = VueUtil.component.getScrollParent(self.$el);
          VueUtil.on(self.scrollParent, 'scroll', self.handleScroll);
          VueUtil.addResizeListener(self.handleScroll);
        }
      });
    },
    beforeDestroy: function() {
      if (!this.fixed) {
        VueUtil.off(this.scrollParent, 'scroll', this.handleScroll);
        VueUtil.removeResizeListener(this.handleScroll);
      }
    },
    methods: {
      getScroll: function(top) {
        var ret = null;
        if (VueUtil.isDef(top)) {
          ret = pageYOffset;
          if (!VueUtil.isNumber(ret)) ret = document.documentElement.scrollTop;
        } else {
          ret = pageXOffset;
          if (!VueUtil.isNumber(ret)) ret = document.documentElement.scrollLeft;
        }
        return ret;
      },
      getOffset: function(element) {
        var rect = element.getBoundingClientRect();
        var scrollTop = this.getScroll(true);
        var scrollLeft = this.getScroll();
        var clientTop = document.body.clientTop || 0;
        var clientLeft = document.body.clientLeft || 0;
        return {
          top: rect.top + scrollTop - clientTop,
          left: rect.left + scrollLeft - clientLeft
        };
      },
      handleScroll: function() {
        var pin = this.pin;
        var scrollTop = this.getScroll(true);
        var elOffset = this.getOffset(this.$el);
        var windowHeight = innerHeight;
        var elHeight = this.$el.getElementsByTagName('div')[0].offsetHeight;
        if ((elOffset.top - this.offsetTop) < scrollTop && this.offsetType == 'top' && !pin) {
          this.pin = true;
          this.styles = {
            top: this.offsetTop + 'px',
            left: elOffset.left + 'px',
            width: this.$el.offsetWidth + 'px',
            position: 'fixed',
            zIndex: VueUtil.nextZIndex()
          };
          this.$emit('change', true);
        } else if ((elOffset.top - this.offsetTop) > scrollTop && this.offsetType == 'top' && pin) {
          this.pin = false;
          this.styles = null;
          this.$emit('change', false);
        }
        if ((elOffset.top + this.offsetBottom + elHeight) > (scrollTop + windowHeight) && this.offsetType == 'bottom' && !pin) {
          this.pin = true;
          this.styles = {
            bottom: this.offsetBottom + 'px',
            left: elOffset.left + 'px',
            width: this.$el.offsetWidth + 'px',
            position: 'fixed',
            zIndex: VueUtil.nextZIndex()
          };
          this.$emit('change', true);
        } else if ((elOffset.top + this.offsetBottom + elHeight) < (scrollTop + windowHeight) && this.offsetType == 'bottom' && pin) {
          this.pin = false;
          this.styles = null;
          this.$emit('change', false);
        }
      }
    }
  };
  Vue.component(VuePin.name, VuePin);
});
