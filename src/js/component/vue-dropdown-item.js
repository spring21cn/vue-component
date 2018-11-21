(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueDropdownItem = definition(context.Vue, context.VueUtil);
    delete context.VueDropdownItem;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueDropdownItem = {
    template: '<li :class="[\'vue-dropdown-menu__item\', {\'is-disabled\': disabled, \'vue-dropdown-menu__item--divided\': divided}]" @click="handleClick"><slot></slot></li>',
    name: 'VueDropdownItem',
    mixins: [VueUtil.component.emitter],
    props: {
      command: String,
      disabled: Boolean,
      divided: Boolean
    },
    methods: {
      handleClick: function(e) {
        this.dispatch('VueDropdown', 'menu-item-click', [this.command, this]);
      }
    }
  };
  Vue.component(VueDropdownItem.name, VueDropdownItem);
});
