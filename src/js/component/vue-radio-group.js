(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueRadioGroup = definition(context.Vue, context.VueUtil);
    delete context.VueRadioGroup;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueRadioGroup = {
    template: '<div class="vue-radio-group"><slot></slot></div>',
    name: 'VueRadioGroup',
    mixins: [VueUtil.component.emitter],
    props: {
      value: {},
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean
    },
    watch: {
      value: function(value) {
        this.$emit('change', value);
        this.dispatch('VueFormItem', 'vue.form.change', [this.value]);
      }
    }
  };
  Vue.component(VueRadioGroup.name, VueRadioGroup);
});
