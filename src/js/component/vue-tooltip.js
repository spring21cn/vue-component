(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePopper', 'VueUtil'], definition);
  } else {
    context.VueTooltip = definition(context.Vue, context.VuePopper, context.VueUtil);
    delete context.VueTooltip;
  }
})(this, function(Vue, VuePopper, VueUtil) {
  'use strict';
  var VueTooltip = {
    name: 'VueTooltip',
    mixins: [VuePopper],
    props: {
      disabled: Boolean,
      effect: String,
      popperClass: String,
      content: String,
      visibleArrow: {
        default: true
      },
      options: {
        default: function() {
          return {
            boundariesPadding: 10,
            gpuAcceleration: false
          };
        }
      },
      enterable: Boolean
    },
    beforeCreate: function() {
      var self = this;
      self.popperVM = new Vue({
        data: {node: ''},
        render: function(createElement) {
          return this.node;
        }
      }).$mount();
    },
    beforeDestroy: function() {
      this.popperVM.$destroy();
    },
    render: function(createElement) {
      var self = this;
      var effect = self.effect === 'light' ? 'light' : 'dark';
      if (self.popperVM) {
        self.popperVM.node = createElement('transition', {
          attrs: {
            name: 'tooltip-fade'
          },
          on: {
            afterLeave: self.destroyPopper
          }
        }, [createElement('div', {
          on: {
            mouseleave: function() {
              self.setExpectedState(false);
              self.debounceClose();
            },
            mouseenter: function() {
              self.setExpectedState(true);
            }
          },
          ref: 'popper',
          directives: [{
            name: 'show',
            value: !self.disabled && self.showPopper
          }],
          class: ['vue-tooltip__popper', 'is-' + effect, self.popperClass]
        }, [self.$slots.content || self.content])]);
      }
      if (!self.$slots.default || !self.$slots.default.length) return self.$slots.default;
      var getFirstComponentChild = function(children) {
        return VueUtil.filter(children, function(c) {
          return c && c.tag;
        })[0];
      };
      var vnode = getFirstComponentChild(self.$slots.default);
      if (!vnode) return vnode;
      var data = vnode.data = vnode.data || {};
      var on = vnode.data.on = vnode.data.on || {};
      on.mouseenter = self.addEventHandle(on.mouseenter, function() {self.setExpectedState(true); self.handleShowPopper();});
      on.mouseleave = self.addEventHandle(on.mouseleave, function() {self.setExpectedState(false); self.debounceClose();});
      data.staticClass = self.concatClass(data.staticClass, 'vue-tooltip');
      return vnode;
    },
    mounted: function() {
      this.referenceElm = this.$el;
    },
    methods: {
      debounceClose: VueUtil.debounce(function() {
        this.handleClosePopper();
      }),
      addEventHandle: function(old, fn) {
        return old ? VueUtil.isArray(old) ? VueUtil.mergeArray(old, fn) : [old, fn] : fn;
      },
      concatClass: function(a, b) {
        if (a && a.indexOf(b) !== -1) return a;
        return a ? b ? (a + ' ' + b) : a : (b || '');
      },
      handleShowPopper: function() {
        var self = this;
        if (!self.expectedState) return;
        self.showPopper = true;
      },
      handleClosePopper: function() {
        if (this.enterable && this.expectedState) return;
        this.showPopper = false;
      },
      setExpectedState: function(expectedState) {
        this.expectedState = expectedState;
      }
    }
  };
  Vue.component(VueTooltip.name, VueTooltip);
});
