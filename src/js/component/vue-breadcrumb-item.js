(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueBreadcrumbItem = definition(context.Vue, context.VueUtil);
    delete context.VueBreadcrumbItem;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueBreadcrumbItem = {
    template: '<span class="vue-breadcrumb__item"><span class="vue-breadcrumb__item__inner" ref="link"><slot></slot></span><span class="vue-breadcrumb__separator">{{$parent.separator}}</span></span>',
    name: 'VueBreadcrumbItem',
    props: {
      to: {},
      replace: Boolean
    },
    methods: {
      linkToDo: function() {
        var to = this.to;
        if (to && this.$router) {
          this.replace ? this.$router.replace(to) : this.$router.push(to);
        } else {
          this.$emit('click');
        }
      }
    },
    mounted: function() {
      VueUtil.on(this.$refs.link, 'click', this.linkToDo);
    },
    beforeDestroy: function() {
      VueUtil.off(this.$refs.link, 'click', this.linkToDo);
    }
  };
  Vue.component(VueBreadcrumbItem.name, VueBreadcrumbItem);
});
