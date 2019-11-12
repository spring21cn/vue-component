(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.MenuUtils = factory();
    root.viewsPath = Vue.config.menu && Vue.config.menu.viewsPath || 'views'
    root.homePageCode = Vue.config.menu && Vue.config.menu.homePageCode || 'dashboard'
    root.layoutPageCode = Vue.config.menu && Vue.config.menu.layoutPageCode || 'layout'
}
}(this, function () {
  function generateTitle(title) {
    if (!title) {
      title = 'noName'
    }
    var translatedTitle = Vue.t(title);
    return translatedTitle;
  }
  
  function isExternal(path) {
    return (/^(https?:|mailto:|tel:)/.test(path));
  }
  
  var TokenKey = 'Admin-Token';
  
  function getToken() {
    return VueUtil.getCookie(TokenKey);
  }
  
  function setToken(token) {
    return VueUtil.setCookie(TokenKey, token);
  }
  
  function removeToken() {
    return VueUtil.removeCookie(TokenKey);
  }
  
  
  function toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    } else {
        return Array.from(arr);
    }
  }

  function openMenuItemInWindow(link) {
    window.open(link.getAttribute('href'),'',link.getAttribute('features'))
    return false;
  }

  Vue.menu = {
    push: function(location, onComplete, onAbort) {
      router.push(location, onComplete, onAbort);
      var match = MenuStore.getters.visitedViews.filter(function(v) {
        return v.path === router.currentRoute.path;
      })
      
      match.length > 0 && (match[0].params = location.params)
    }
  }

  return {
    generateTitle: (Vue.config.menu && Vue.config.menu.generateTitle) || generateTitle,
    isExternal: isExternal,
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    toConsumableArray: toConsumableArray,
    openMenuItemInWindow: openMenuItemInWindow
  }
}));