(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueRadioButton = definition(context.Vue);
    delete context.VueRadioButton;
  }
})(this, function(Vue) {
  'use strict';
  var VueRadioButton = {
    template: '<label role="radio" :class="[\'vue-radio-button\', size ? \'vue-radio-button--\' + size : \'\', {\'is-active\': value === label}, {\'is-disabled\': isDisabled}, {\'is-focus\': isFocus}]" :tabindex="tabIndex"><input class="vue-radio-button__original" :value="label" type="radio" v-model="value" :name="name" :tabindex="-1" @focus="isFocus = true" @blur="isFocus = false" :disabled="isDisabled"><span class="vue-radio-button__inner" :style="value === label ? activeStyle : null"><slot></slot><template v-if="!$slots.default">{{label}}</template></span></label>',
    name: 'VueRadioButton',
    inject: {
      vueForm: {
        default: ''
      },
    },
    data: function() {
      return {
        isFocus: false
      };
    },
    props: {
      label: {},
      disabled: Boolean,
      name: String,
      tabindex: {
        type: Number,
        default: 0
      }
    },
    computed: {
      value: {
        get: function() {
          return this._radioGroup.value;
        },
        set: function(value) {
          this._radioGroup.$emit('input', value);
        }
      },
      _radioGroup: function() {
        var parent = this.$parent;
        while (parent) {
          if (parent.$options.name !== 'VueRadioGroup') {
            parent = parent.$parent;
          } else {
            return parent;
          }
        }
        return false;
      },
      checkStyle: function() {
        return this._radioGroup.checkStyle;
      },
      activeStyle: function() {
        return {
          backgroundColor: this._radioGroup.fill || '',
          borderColor: (this.checkStyle ? this._radioGroup.textColor : this._radioGroup.fill) || '',
          boxShadow: this.checkStyle ? '' : (this._radioGroup.fill ? '-1px 0 0 0 ' + this._radioGroup.fill : ''),
          color: this._radioGroup.textColor || ''
        };
      },
      size: function() {
        return this._radioGroup.finalSize;
      },
      isDisabled: function() {
        return this.disabled || this._radioGroup.disabled || (this.vueForm || {}).disabled;
      },
      tabIndex: function() {
        return (this.isDisabled || (this._radioGroup && this.value !== this.label)) ? -1 : this.isGroup ? this._radioGroup.tabindex : this.tabindex;
      }
    }
  };
  Vue.component(VueRadioButton.name, VueRadioButton);
});
