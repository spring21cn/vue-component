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
    // template: '<li :style="paddingStyle" @click="handleClick" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" :class="[\'vue-menu-item\', {\'is-active\': active, \'is-disabled\': disabled}]"><template v-else><slot></slot></template></li>',
    template: '<li class="vue-menu-item"'
    + '    :style="[paddingStyle]"'
    + '    :class="{'
    + '      \'is-active\': active,'
    + '      \'is-disabled\': disabled'
    + '    }"'
    + '    @click="handleClick"'
    + '  >'
    + '    <vue-tooltip'
    + '      v-if="parentMenu.$options.name === \'VueMenu\' && rootMenu.collapse && $slots.title"'
    + '      effect="dark"'
    + '      placement="right">'
    + '      <div slot="content"><slot name="title"></slot></div>'
    + '      <div style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;display: inline-block;box-sizing: border-box;padding: 0 20px;">'
    + '        <slot></slot>'
    + '      </div>'
    + '    </vue-tooltip>'
    + '    <template v-else>'
    + '      <slot></slot>'
    + '      <slot name="title"></slot>'
    + '    </template>'
    + '  </li>',
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
