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
    template: '<div class="vue-checkbox-group" :class="{\'check-style\': checkStyle, \'is-split\': realSplit}"><slot></slot></div>',
    name: 'VueCheckboxGroup',
    mixins: [VueUtil.component.emitter],
    inject: {
      vueFormItem: {
        default: ''
      },
    },
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
      },
      checkStyle: Boolean,
      split: {
        type: Boolean,
        default: null,
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
    },
    computed: {
      finalSize: function() {
        return this.size || (this.vueFormItem || {}).vueFormItemSize || (this.$VIY || {}).size;
      },
      realSplit: function() {
        return this.split == undefined ? this.checkStyle : this.split;
      }
    }
  };
  Vue.component(VueCheckboxGroup.name, VueCheckboxGroup);
});
