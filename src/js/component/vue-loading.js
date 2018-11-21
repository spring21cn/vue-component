(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueLoading = definition(context.Vue, context.VueUtil);
    delete context.VueLoading;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var directive = function() {
    var VueLoading = Vue.extend({
      template: '<transition @after-leave="handleAfterLeave"><div v-show="visible" :class="[\'vue-loading-mask\', customClass, {\'is-fullscreen\': fullscreen}]"><div class="vue-loading-spinner"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none"/></svg><p v-if="text" class="vue-loading-text">{{text}}</p></div></div></transition>',
      data: function() {
        return {
          text: null,
          fullscreen: true,
          visible: false,
          customClass: ''
        };
      },
      methods: {
        handleAfterLeave: function() {
          this.$emit('after-leave');
        }
      }
    });
    var insertDom = function(parent, el, binding) {
      if (!el.domVisible) {
        VueUtil.ownPropertyLoop(el.maskStyle, function(property) {
          el.mask.style[property] = el.maskStyle[property];
        });
        if (el.originalPosition !== 'absolute') {
          parent.style.position = 'relative';
        }
        if (binding.modifiers.fullscreen && binding.modifiers.lock) {
          parent.style.overflow = 'hidden';
        }
        parent.appendChild(el.mask);
        el.domVisible = true;
        el.instance.visible = true;
        el.domInserted = true;
        Vue.nextTick(function() {
          if (binding.modifiers.fullscreen) {
            el.instance.$el.focus();
          }
        });
      }
    };
    var toggleLoading = function(el, binding) {
      if (binding.value) {
        if (binding.modifiers.fullscreen) {
          el.originalPosition = document.body.style.position;
          el.originalOverflow = document.body.style.overflow;
          VueUtil.addClass(el.mask, 'is-fullscreen');
          insertDom(document.body, el, binding);
        } else {
          VueUtil.removeClass(el.mask, 'is-fullscreen');
          if (binding.modifiers.body) {
            el.originalPosition = document.body.style.position;
            VueUtil.loop(['top', 'left'], function(property) {
              var scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
              el.maskStyle[property] = el.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] + 'px';
            });
            VueUtil.loop(['height', 'width'], function(property) {
              el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px';
            });
            insertDom(document.body, el, binding);
          } else {
            el.originalPosition = el.style.position;
            insertDom(el, el, binding);
          }
        }
      } else {
        if (el.domVisible) {
          el.instance.$once('after-leave', function() {
            el.domVisible = false;
            if (binding.modifiers.fullscreen && el.originalOverflow !== 'hidden') {
              document.body.style.overflow = el.originalOverflow;
            }
            if (binding.modifiers.fullscreen || binding.modifiers.body) {
              document.body.style.position = el.originalPosition;
            } else {
              el.style.position = el.originalPosition;
            }
          });
          el.instance.visible = false;
        }
      }
    };
    var doKeyDown = function(e) {
      document.querySelector('.vue-loading-mask.is-fullscreen').focus();
      e.preventDefault();
      return false;
    };
    var bindEvent = function(binding) {
      if (binding.modifiers.fullscreen) {
        if (binding.value) {
          VueUtil.on(document, 'keydown', doKeyDown);
        } else {
          VueUtil.off(document, 'keydown', doKeyDown);
        }
      }
    };
    Vue.directive('loading', {
      bind: function(el, binding) {
        var mask = new VueLoading({
          el: document.createElement('div'),
          data: {
            text: el.getAttribute('vue-loading-text'),
            fullscreen: !!binding.modifiers.fullscreen,
            customClass: el.getAttribute('vue-loading-class'),
          }
        });
        el.instance = mask;
        el.mask = mask.$el;
        el.maskStyle = {};
        toggleLoading(el, binding);
      },
      update: function(el, binding) {
        if (binding.oldValue !== binding.value) {
          toggleLoading(el, binding);
          bindEvent(binding);
        }
      },
      unbind: function(el, binding) {
        if (el.domInserted) {
          el.instance.$destroy();
          VueUtil.off(document, 'keydown', doKeyDown);
        }
      }
    });
  };
  Vue.use(directive);
});
