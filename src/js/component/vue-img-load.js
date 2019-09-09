(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueImgLoad = definition(context.Vue);
    delete context.VueImgLoad;
  }
})(this, function(Vue) {
  'use strict';
  var imgload = function() {
    var loadImg = function(el, binding) {
      if (el.tagName === 'IMG') {
        var img = new Image();
        img.src = binding.value;
        img.onload = function() {
          el.src = img.src;
        };
      }
    };
    Vue.directive('imgload', {
      bind: function(el, binding) {
        el._src_ = el.src;
        loadImg(el, binding);
      },
      update: function(el, binding) {
        el.src = el._src_;
        loadImg(el, binding);
      }
    });
  };
  Vue.use(imgload);
});
