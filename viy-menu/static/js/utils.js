(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.MenuUtils = factory();
}
}(this, function () {
  function generateTitle(title) {
    if (!title) {
      title = 'noName'
    }
    var translatedTitle = Vue.t('title.' + title);
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
  
  function checkPermission(value) {
    if (value && value instanceof Array && value.length > 0) {
      var roles = MenuStore.getters && MenuStore.getters.roles;
      var permissionRoles = value;
  
      var hasPermission = roles.some(function (role) {
        return permissionRoles.indexOf(role) > -1
      });
  
      if (!hasPermission) {
        return false;
      }
      return true;
    } else {
      console.error('need roles!');
      return false;
    }
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

  return {
    generateTitle: generateTitle,
    isExternal: isExternal,
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    checkPermission: checkPermission,
    toConsumableArray: toConsumableArray,
    openMenuItemInWindow: openMenuItemInWindow
  }
}));