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
      if (!el.instance.visible) {
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
        el.instance.visible = true;
        el.instance.hiding && ( el.instance.hiding = false ); // 上一个隐藏动作执行过程中进入 insertDom，此时，需要中断隐藏动作
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
        if (el.instance.visible) {
          el.instance.$once('after-leave', function() {
            if (!el.instance.hiding) {
              return; // 隐藏被中断，不执行后续处理
            }
            if (binding.modifiers.fullscreen && el.originalOverflow !== 'hidden') {
              document.body.style.overflow = el.originalOverflow;
            }
            if (binding.modifiers.fullscreen || binding.modifiers.body) {
              document.body.style.position = el.originalPosition;
            } else {
              el.style.position = el.originalPosition;
            }
            el.instance.hiding = false; // 隐藏动作未被中断，隐藏动作正常执行完
          });
          el.instance.visible = false;
          // 用于标记隐藏动作是否有被中断（即还没执行到 after-leave ，马上又触发了一个显示的动作，进入了 insertDom 方法）
          // 如果有被中断，则进入 after-leave 时，不执行后续隐藏动作
          el.instance.hiding = true;
        }
      }
    };
    var doKeyDown = function(e) {
      document.querySelector('.vue-loading-mask').focus();
      e.preventDefault();
      return false;
    };
    
    var bindEvent = function(el, binding) {
      if (binding.value) {
        VueUtil.on(el, 'keydown', doKeyDown);
      } else {
        VueUtil.off(el, 'keydown', doKeyDown);
      }
    };
    Vue.directive('loading', {
      bind: function(el, binding) {
        var mask = new VueLoading({
          i18n: Vue.i18n,
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
          bindEvent(el, binding);
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
