(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueMenuItem = definition(context.Vue, context.VueUtil);
    delete context.VueMenuItem;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueMenuItem = {
    template: '<li :style="paddingStyle" @click="handleClick" :class="[\'vue-menu-item\', {\'is-active\': active, \'is-disabled\': disabled}]"><slot></slot></li>',
    name: 'VueMenuItem',
    mixins: [VueUtil.component.menumixin, VueUtil.component.emitter],
    props: {
      index: {
        type: String,
        required: true
      },
      route: {
        type: Object,
        required: false
      },
      disabled: Boolean
    },
    computed: {
      active: function() {
        return this.index === this.rootMenu.activedIndex;
      }
    },
    methods: {
      handleClick: function() {
        this.dispatch('VueMenu', 'item-click', this);
      }
    },
    created: function() {
      this.parentMenu.addItem(this);
      this.rootMenu.addItem(this);
    },
    beforeDestroy: function() {
      this.parentMenu.removeItem(this);
      this.rootMenu.removeItem(this);
    }
  };
  Vue.component(VueMenuItem.name, VueMenuItem);
});
