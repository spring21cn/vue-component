(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.directives = factory();
}
}(this, function () {

  var permission = {
    inserted: function(el, binding, vnode) {
      var value = binding.value;
    
      var roles = MenuStore.getters && MenuStore.getters.roles;
    
      if (value && value instanceof Array && value.length > 0) {
        var permissionRoles = value;
    
        var hasPermission = roles.some(function (role) {
          return permissionRoles.indexOf(role) > -1;
        });
    
        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      } else {
        throw new Error("need roles! Like v-permission=\"['admin','editor']\"");
      }
    }
  }
  Vue.directive('permission', permission);

}));