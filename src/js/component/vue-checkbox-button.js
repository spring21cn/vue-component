(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueCheckboxButton = definition(context.Vue, context.VueUtil);
    delete context.VueCheckboxButton;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueCheckboxButton = {
    template: '<label :class="[\'vue-checkbox-button\', size ? \'vue-checkbox-button--\' + size : \'\', {\'is-disabled\': isDisabled}, {\'is-checked\': isChecked}, {\'is-focus\': isFocus}]"><input v-if="trueLabel || falseLabel" class="vue-checkbox-button__original" type="checkbox" :name="name" :disabled="isDisabled" :true-value="trueLabel" :false-value="falseLabel" v-model="model" @change="handleChange" :tabindex="tabIndex" @focus="isFocus = true" @blur="isFocus = false"><input v-else class="vue-checkbox-button__original" type="checkbox" :name="name" :disabled="isDisabled" :value="label" v-model="model" @change="handleChange" :tabindex="tabIndex" @focus="isFocus = true" @blur="isFocus = false"><span class="vue-checkbox-button__inner" v-if="$slots.default || label" :style="isChecked ? activeStyle : null"><slot>{{label}}</slot></span></label>',
    name: 'VueCheckboxButton',
    mixins: [VueUtil.component.emitter],
    inject: {
      vueForm: {
        default: ''
      },
    },
    data: function() {
      return {
        selfModel: false,
        isFocus: false
      };
    },
    props: {
      value: {},
      label: {},
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number],
      tabindex: {
        type: Number,
        default: 0
      }
    },
    computed: {
      model: {
        get: function() {
          return this._checkboxGroup ? this.store : VueUtil.isDef(this.value) ? this.value : this.selfModel;
        },
        set: function(val) {
          if (this._checkboxGroup) {
            var isLimitExceeded = false;
            (VueUtil.isDef(this._checkboxGroup.min) && val.length < this._checkboxGroup.min && (isLimitExceeded = true));
            (VueUtil.isDef(this._checkboxGroup.max) && val.length > this._checkboxGroup.max && (isLimitExceeded = true));
            isLimitExceeded === false && this.dispatch('VueCheckboxGroup', 'input', [val]);
          } else if (VueUtil.isDef(this.value)) {
            this.$emit('input', val);
          } else {
            this.selfModel = val;
          }
        }
      },
      isChecked: function() {
        if (VueUtil.isBoolean(this.model)) {
          return this.model;
        } else if (VueUtil.isArray(this.model)) {
          return this.model.indexOf(this.label) !== -1;
        } else if (VueUtil.isDef(this.model)) {
          return this.model === this.trueLabel;
        }
      },
      _checkboxGroup: function() {
        var parent = this.$parent;
        while (parent) {
          if (parent.$options.name !== 'VueCheckboxGroup') {
            parent = parent.$parent;
          } else {
            return parent;
          }
        }
        return false;
      },
      isLimitDisabled: function isLimitDisabled() {
        var max = this._checkboxGroup.max;
        var min = this._checkboxGroup.min;
        return !!(max || min) && this.model.length >= max && !this.isChecked || this.model.length <= min && this.isChecked;
      },
      isDisabled: function() {

        return this._checkboxGroup
          ? this._checkboxGroup.disabled || this.disabled || (this.vueForm || {}).disabled || this.isLimitDisabled
          : this.disabled || (this.vueForm || {}).disabled;

      },
      store: function() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      },
      checkStyle: function() {
        return this._checkboxGroup.checkStyle;
      },
      activeStyle: function() {
        return {
          backgroundColor: this._checkboxGroup.fill || '',
          borderColor: (this.checkStyle ? this._checkboxGroup.textColor : this._checkboxGroup.fill) || '',
          color: this._checkboxGroup.textColor || '',
          'box-shadow': this.checkStyle? '' : '-1px 0 0 0 ' + this._checkboxGroup.fill
        };
      },
      size: function() {
        return this._checkboxGroup.finalSize;
      },
      tabIndex: function() {
        return this._checkboxGroup ? this._checkboxGroup.tabindex : this.tabindex;
      }
    },
    methods: {
      addToStore: function() {
        if (VueUtil.isArray(this.model)
          && this.model.indexOf(this.label) === -1) {
          this.model.push(this.label);
        } else {
          this.model = this.trueLabel || true;
        }
      },
      handleChange: function(ev) {
        var self = this;
        self.$emit('change', ev);
        if (self._checkboxGroup) {
          self.$nextTick(function() {
            self.dispatch('VueCheckboxGroup', 'change', [self._checkboxGroup.value]);
          });
        }
      },
      focus: function() {
        this.$el.querySelector('input').focus();
      }
    },
    created: function() {
      this.checked && this.addToStore();
    }
  };
  Vue.component(VueCheckboxButton.name, VueCheckboxButton);
});
