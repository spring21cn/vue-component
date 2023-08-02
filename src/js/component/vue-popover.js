(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VuePopper'], definition);
  } else {
    context.VuePopover = definition(context.Vue, context.VueUtil, context.VuePopper);
    delete context.VuePopover;
  }
})(this, function(Vue, VueUtil, VuePopper) {
  'use strict';
  var VuePopover = {
    template: '<span><transition :name="transition" @after-leave="destroyPopper"><div :class="[\'vue-popover\', popperClass, {\'no-arrow\': !visibleArrow}]" ref="popper" v-show="!disabled && showPopper" :style="{width: popoverWidth + \'px\', height: popoverHeight}"><div class="vue-popover__title" v-if="title" v-text="title"></div><slot>{{content}}</slot></div></transition><slot name="reference"></slot></span>',
    name: 'VuePopover',
    mixins: [VuePopper],
    props: {
      trigger: {
        type: String,
        default: 'click',
        validator: function(value) {
          return ['click', 'focus', 'hover', 'manual'].indexOf(value) !== -1;
        }
      },
      title: String,
      disabled: Boolean,
      content: String,
      reference: {},
      popperClass: String,
      width: [String, Number],
      height: [String, Number],
      visibleArrow: {
        type: Boolean,
        default: true
      },
      autoClose: Boolean
    },
    data: function() {
      return {
        popoverWidth: null,
        popoverHeight: null
      };
    },
    watch: {
      showPopper: function(newVal, oldVal) {
        if (newVal) {
          this.popoverWidth = this.width;
          var reference = this.reference || this.$refs.reference;
          if (!this.popoverWidth) {
            this.popoverWidth = parseInt(VueUtil.getStyle(reference, 'width'));
          }
          
          if (this.height === 'auto-max') {
            var placement = this.placement.split('-')[0];
            var totalHeight = window.innerHeight;
            if (['top', 'bottom'].indexOf(placement) !== -1) {
              var rect = reference.getBoundingClientRect();
              
              var bottomRemain = totalHeight - rect.bottom;
              var topRemain = rect.top;
              var height = Math.max(bottomRemain, topRemain);
  
              this.popoverHeight = (height - (this.visibleArrow ? 25 : 20)) + 'px';
            } else {
              this.popoverHeight = (totalHeight - 20) + 'px';
            }

          } else if (this.height) {
            this.popoverHeight = this.height + 'px';
          } else {
            this.popoverHeight = null;
          }
          this.$emit('show');
        } else {
          this.$emit('hide');
        }
      }
    },
    methods: {
      bindEvents: function() {
        var self = this;
        var reference = self.reference || self.$refs.reference;
        var popper = self.popper || self.$refs.popper;
        if (!reference && self.$slots.reference && self.$slots.reference[0]) {
          reference = self.referenceElm = self.$slots.reference[0].elm;
        }
        if (self.trigger === 'click') {
          VueUtil.on(reference, 'click', self.doToggle);
          VueUtil.on(document, 'click', self.documentClick);
        } else if (self.trigger === 'hover') {
          VueUtil.on(reference, 'mouseenter', self.mouseEnter);
          VueUtil.on(popper, 'mouseenter', self.mouseEnter);
          VueUtil.on(reference, 'mouseleave', self.mouseLeave);
          VueUtil.on(popper, 'mouseleave', self.mouseLeave);
        } else if (self.trigger === 'focus') {
          var found = false;
          if ([].slice.call(reference.children).length) {
            VueUtil.loop(reference.childNodes, function(child) {
              if (child.nodeName === 'INPUT' || child.nodeName === 'TEXTAREA') {
                VueUtil.on(child, 'focus', self.doShow);
                VueUtil.on(child, 'blur', self.doClose);
                found = true;
                return false;
              }
            });
          }
          if (found) return;
          if (reference.nodeName === 'INPUT' || reference.nodeName === 'TEXTAREA') {
            VueUtil.on(reference, 'focus', self.doShow);
            VueUtil.on(reference, 'blur', self.doClose);
          } else {
            VueUtil.on(reference, 'mousedown', self.doShow);
            VueUtil.on(reference, 'mouseup', self.doClose);
          }
        } else if (self.trigger === 'manual' && this.autoClose) {
          VueUtil.on(document, 'click', self.documentClick);
        }
      },
      unBindEvents: function() {
        var self = this;
        var reference = self.reference || self.$refs.reference;
        var popper = self.popper || self.$refs.popper;
        if (!reference && self.$slots.reference && self.$slots.reference[0]) {
          reference = self.referenceElm = self.$slots.reference[0].elm;
        }
        if (self.trigger === 'click') {
          VueUtil.off(reference, 'click', self.doToggle);
          VueUtil.off(document, 'click', self.documentClick);
        } else if (self.trigger === 'hover') {
          VueUtil.off(reference, 'mouseenter', self.mouseEnter);
          VueUtil.off(popper, 'mouseenter', self.mouseEnter);
          VueUtil.off(reference, 'mouseleave', self.mouseLeave);
          VueUtil.off(popper, 'mouseleave', self.mouseLeave);
        } else if (self.trigger === 'focus') {
          var found = false;
          if ([].slice.call(reference.children).length) {
            VueUtil.loop(reference.childNodes, function(child) {
              if (child.nodeName === 'INPUT' || child.nodeName === 'TEXTAREA') {
                VueUtil.off(child, 'focus', self.doShow);
                VueUtil.off(child, 'blur', self.doClose);
                found = true;
                return false;
              }
            });
          }
          if (found) return;
          if (reference.nodeName === 'INPUT' || reference.nodeName === 'TEXTAREA') {
            VueUtil.off(reference, 'focus', self.doShow);
            VueUtil.off(reference, 'blur', self.doClose);
          } else {
            VueUtil.off(reference, 'mousedown', self.doShow);
            VueUtil.off(reference, 'mouseup', self.doClose);
          }
        } else if (self.trigger === 'manual' && this.autoClose) {
          VueUtil.off(document, 'click', self.documentClick);
        }
      },
      doToggle: function() {
        this.showPopper = !this.showPopper;
      },
      doShow: function() {
        this.showPopper = true;
      },
      doClose: function() {
        this.showPopper = false;
      },
      mouseToggle: VueUtil.debounce(30, function(showPopper) {
        this.showPopper = showPopper;
      }),
      mouseEnter: function() {
        this.mouseToggle(true);
      },
      mouseLeave: function() {
        this.mouseToggle(false);
      },
      documentClick: function(e) {
        var reference = this.reference || this.$refs.reference;
        var popper = this.popper || this.$refs.popper;
        if (!reference && this.$slots.reference && this.$slots.reference[0]) {
          reference = this.referenceElm = this.$slots.reference[0].elm;
        }
        if (!this.$el || !reference || this.$el.contains(e.target) || reference.contains(e.target) || !popper || popper.contains(e.target))
          return;
        this.showPopper = false;
      }
    },
    mounted: function() {
      this.bindEvents();
    },
    destroyed: function() {
      this.$refs.popper && this.$refs.popper.parentElement && this.$refs.popper.parentElement.removeChild(this.$refs.popper);
      this.unBindEvents();
    }
  };
  var directive = function(el, binding, vnode) {
    vnode.context.$refs[binding.arg].$refs.reference = el;
  };
  Vue.directive('popover', directive);
  VuePopover.directive = directive;
  Vue.component(VuePopover.name, VuePopover);
});
