(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueRipple = definition(context.Vue, context.VueUtil);
    delete context.VueRipple;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var directive = function() {
    var doRipple = VueUtil.throttle(function(e) {
      var clientX = e.clientX;
      var clientY = e.clientY;
      var el = this;
      el.style.position = 'relative';
      var ripple = el.querySelector('.vue-ripple__container');
      var animation = el.querySelector('.vue-ripple__animation');
      var size = el.clientWidth > el.clientHeight ? el.clientWidth : el.clientHeight;
      animation.style.height = animation.style.width = size + 'px';
      var offset = el.getBoundingClientRect();
      var x = clientX - offset.left + 'px';
      var y = clientY - offset.top + 'px';
      animation.style.left = x;
      animation.style.top = y;
      animation.style.display = '';
      ripple.style.display = '';
      VueUtil.debounce(500, function() {
        animation.style.display = 'none';
        ripple.style.display = 'none';
        el.style.position = el.__originalPosition__;
      }).call();
    });
    Vue.directive('ripple', {
      bind: function(el, binding) {
        VueUtil.debounce(function() {
          el.__originalPosition__ = el.style.position;
          var ripple = el.__ripple__ = document.createElement('div');
          ripple.className = 'vue-ripple__container';
          ripple.style.display = 'none';
          var animation = document.createElement('div');
          animation.style.display = 'none';
          animation.className = 'vue-ripple__animation';
          ripple.appendChild(animation);
          el.appendChild(ripple);
          VueUtil.on(el, 'mousedown', doRipple);
        }).call();
      },
      unbind: function(el) {
        VueUtil.off(el, 'mousedown', doRipple);
      }
    });
  };
  Vue.use(directive);
});
