(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueBreadcrumb = definition(context.Vue);
    delete context.VueBreadcrumb;
  }
})(this, function(Vue) {
  'use strict';
  var VueBreadcrumb = {
    template: '<div class="vue-breadcrumb"><slot></slot></div>',
    name: 'VueBreadcrumb',
    props: {
      separator: {
        type: String,
        default: '/'
      }
    }
  };
  Vue.component(VueBreadcrumb.name, VueBreadcrumb);
});
