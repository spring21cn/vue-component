(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueCollapse = definition(context.Vue, context.VueUtil);
    delete context.VueCollapse;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueCollapse = {
    template: '<div class="vue-collapse"><slot></slot></div>',
    name: 'VueCollapse',
    props: {
      accordion: Boolean,
      value: {
        type: [Array, String, Number],
        default: function() {
          return [];
        }
      },
      expandOnClickHeader: {
        type: Boolean,
        default: true
      }
    },
    data: function() {
      return {
        activeNames: VueUtil.mergeArray([], this.value)
      };
    },
    watch: {
      value: function(value) {
        this.activeNames = VueUtil.mergeArray([], value);
      }
    },
    methods: {
      setActiveNames: function(activeNames) {
        activeNames = VueUtil.mergeArray([], activeNames);
        var value = this.accordion ? activeNames[0] : activeNames;
        this.activeNames = activeNames;
        this.$emit('input', value);
      },
      handleItemClick: function(item) {
        if (this.accordion) {
          this.setActiveNames(
            this.activeNames[0] &&
              this.activeNames[0] === item.name
              ? '' : item.name
          );
        } else {
          var activeNames = VueUtil.mergeArray([], this.activeNames);
          var index = activeNames.indexOf(item.name);
          if (index !== -1) {
            activeNames.splice(index, 1);
          } else {
            activeNames.push(item.name);
          }
          this.setActiveNames(activeNames);
        }
      }
    },
    created: function() {
      this.$on('item-click', this.handleItemClick);
    }
  };
  Vue.component(VueCollapse.name, VueCollapse);
});
