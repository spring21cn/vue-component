(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueListItem = definition(context.Vue, context.VueUtil);
    delete context.VueListItem;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueListItem = {
    template: '<div :class="[\'vue-list-item\', {\'is-active\': isActive}]" @click="handleClick"><slot></slot></div>',
    name: 'VueListItem',
    mixins: [VueUtil.component.emitter],
    data: function() {
      return {
        index: null
      };
    },
    methods: {
      handleClick: function() {
        this.dispatch('VueList', 'item-click', this);
        this.$emit('select', this);
      }
    },
    computed: {
      list: function() {
        var parent = this.$parent;
        while (parent.$options.name !== 'VueList') {
          parent = parent.$parent;
        }
        return parent;
      },
      isActive: function() {
        return this.list.activedIndex === this.index;
      }
    },
    mounted: function() {
      this.list.setItemIndex(this);
    }
  };
  Vue.component(VueListItem.name, VueListItem);
});
