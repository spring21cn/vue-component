(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueTabPane = definition(context.Vue, context.VueUtil);
    delete context.VueTabPane;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueTabPane = {
    template: '<div class="vue-tab-pane" v-show="active"><keep-alive><router-view v-if="router && active && $route.meta.keepAlive"></router-view></keep-alive><router-view v-if="router && active && !$route.meta.keepAlive"></router-view><slot v-if="!router"></slot></div>',
    name: 'VueTabPane',
    props: {
      label: String,
      labelContent: Function,
      name: String,
      closable: Boolean,
      disabled: Boolean
    },
    data: function() {
      return {
        index: null
      };
    },
    computed: {
      isClosable: function() {
        return this.closable || this.$parent.closable;
      },
      active: function() {
        return this.$parent.currentName === (this.name || this.index);
      },
      router: function() {
        return this.$parent.router;
      }
    },
    mounted: function() {
      this.$parent.addPanes(this);
    },
    destroyed: function() {
      this.$parent.removePanes(this);
    },
    watch: {
      label: function() {
        this.$parent.$forceUpdate();
      }
    }
  };
  Vue.component(VueTabPane.name, VueTabPane);
});
