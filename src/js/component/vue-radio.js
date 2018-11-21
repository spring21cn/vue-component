(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueRadio = definition(context.Vue, context.VueUtil);
    delete context.VueRadio;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueRadio = {
    template: '<label class="vue-radio"><span :class="[\'vue-radio__input\', {\'is-disabled\': isDisabled, \'is-checked\': model === label, \'is-focus\': focus}]"><span class="vue-radio__inner"></span><input class="vue-radio__original" :value="label" type="radio" v-model="model" @focus="focus=true" @blur="focus=false" :name="name" :disabled="isDisabled"></span><span class="vue-radio__label"><slot></slot><template v-if="!$slots.default">{{label}}</template></span></label>',
    name: 'VueRadio',
    mixins: [VueUtil.component.emitter],
    props: {
      value: {},
      label: {},
      disabled: Boolean,
      name: String
    },
    data: function() {
      return {
        focus: false
      };
    },
    computed: {
      isGroup: function() {
        var parent = this.$parent;
        while (parent) {
          if (parent.$options.name !== 'VueRadioGroup') {
            parent = parent.$parent;
          } else {
            this._radioGroup = parent;
            return true;
          }
        }
        return false;
      },
      model: {
        get: function() {
          return this.isGroup ? this._radioGroup.value : this.value;
        },
        set: function(val) {
          if (this.isGroup) {
            this.dispatch('VueRadioGroup', 'input', [val]);
          } else {
            this.$emit('input', val);
          }
        }
      },
      isDisabled: function() {
        return this.isGroup ? this._radioGroup.disabled || this.disabled : this.disabled;
      }
    }
  };
  Vue.component(VueRadio.name, VueRadio);
});
