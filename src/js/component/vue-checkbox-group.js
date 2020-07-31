(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueCheckboxGroup = definition(context.Vue, context.VueUtil);
    delete context.VueCheckboxGroup;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueCheckboxGroup = {
    template: '<div class="vue-checkbox-group"><slot></slot></div>',
    name: 'VueCheckboxGroup',
    mixins: [VueUtil.component.emitter],
    props: {
      value: {},
      min: Number,
      max: Number,
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean,
      tabindex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      focus: function() {
        var check = this.$el.querySelector('label:not([style*="display:none"]):not([style*="display: none"]) input[type="checkbox"]:not([disabled=disabled])');
        if(check) {
          check.focus();
        }
      }
    },
    watch: {
      value: function(value) {
        this.dispatch('VueFormItem', 'vue.form.change', [value]);
      }
    }
  };
  Vue.component(VueCheckboxGroup.name, VueCheckboxGroup);
});
