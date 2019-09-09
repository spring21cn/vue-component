(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueLoadingBar = definition(context.Vue, context.VueUtil);
    delete context.VueLoadingBar;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var loadingBar = null;
  var intervaler = null;
  var newInstance = function() {
    var loadingBar = document.createElement('div');
    loadingBar.className = 'vue-loading-bar';
    loadingBar.style.display = 'none';
    var innerDiv = document.createElement('div');
    VueUtil.addClass(innerDiv, 'vue-loading-bar-inner');
    VueUtil.addClass(innerDiv, 'vue-loading-bar-inner-color-primary');
    loadingBar.appendChild(innerDiv);
    document.body.appendChild(loadingBar);
    return {
      show: function(options) {
        if (loadingBar.style.display === 'none') {
          loadingBar.style.display = '';
          loadingBar.style.zIndex = VueUtil.nextZIndex();
        }
        if (options.error) {
          VueUtil.addClass(innerDiv, 'vue-loading-bar-inner-color-error');
        } else {
          VueUtil.removeClass(innerDiv, 'vue-loading-bar-inner-color-error');
        }
        if (VueUtil.isDef(options.percent)) {
          innerDiv.style.width = options.percent + '%';
        }
      },
      hide: function() {
        loadingBar.style.display = 'none';
      },
      isShow: function() {
        return (loadingBar.style.display !== 'none');
      }
    };
  };
  var initLoadingBar = function() {
    if (!VueUtil.isDef(loadingBar)) loadingBar = newInstance();
  };
  var hideInstance = VueUtil.debounce(500, function(fn) {
    if (VueUtil.isFunction(fn)) fn();
    loadingBar.hide();
  });
  var VueLoadingBar = {
    start: function(fn) {
      initLoadingBar();
      if (loadingBar.isShow()) return;
      var percent = 0;
      loadingBar.show({percent: percent});
      intervaler = setInterval(function() {
        percent += 6;
        if (percent > 95) {
          clearInterval(intervaler);
          percent = 96;
        }
        loadingBar.show({percent: percent});
      }, 250);
      if (VueUtil.isFunction(fn)) fn();
    },
    update: function(percent, fn) {
      initLoadingBar();
      clearInterval(intervaler);
      loadingBar.show({percent: percent});
      if (VueUtil.isFunction(fn)) fn();
    },
    finish: VueUtil.debounce(function(fn) {
      initLoadingBar();
      clearInterval(intervaler);
      loadingBar.show({percent: 100});
      hideInstance(fn);
    }),
    error: VueUtil.debounce(function(fn) {
      initLoadingBar();
      clearInterval(intervaler);
      loadingBar.show({percent: 100, error: true});
      hideInstance(fn);
    })
  };
  Vue.loadingBar = VueLoadingBar;
});
