(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePopper'], definition);
  } else {
    context.VueSelectDropdown = definition(context.Vue, context.VuePopper);
    delete context.VueSelectDropdown;
  }
})(this, function(Vue, VuePopper) {
  'use strict';
  var VueSelectDropdown = {
    template: '<div :class="[\'vue-select-dropdown\', {\'is-multiple\': $parent.multiple}, popperClass]"><slot></slot></div>',
    name: 'VueSelectDropdown',
    mixins: [VuePopper],
    props: {
      placement: {
        type: String,
        default: 'bottom-start',
      },
      autoWidth: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      popperClass: function() {
        return this.$parent.popperClass;
      }
    },
    mounted: function() {
      this.referenceElm = this.$parent.$refs.reference.$el;
      this.$parent.popperElm = this.popperElm = this.$el;
      this.$on('updatePopper', this.updatePopper);
      this.$on('destroyPopper', this.destroyPopper);
    }
  };
  Vue.component(VueSelectDropdown.name, VueSelectDropdown);
});
