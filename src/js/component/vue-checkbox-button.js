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
    template: '<label :class="[\'vue-checkbox-button\', size ? \'vue-checkbox-button--\' + size : \'\', {\'is-disabled\': isDisabled}, {\'is-checked\': isChecked}, {\'is-focus\': focus}]"><input v-if="trueLabel || falseLabel" class="vue-checkbox-button__original" type="checkbox" :name="name" :disabled="isDisabled" :true-value="trueLabel" :false-value="falseLabel" v-model="model" @change="handleChange" @focus="focus = true" @blur="focus = false"><input v-else class="vue-checkbox-button__original" type="checkbox" :name="name" :disabled="disabled" :value="label" v-model="model" @change="handleChange" @focus="focus = true" @blur="focus = false"><span class="vue-checkbox-button__inner" v-if="$slots.default || label" :style="isChecked ? activeStyle : null"><slot>{{label}}</slot></span></label>',
    name: 'VueCheckboxButton',
    mixins: [VueUtil.component.emitter],
    data: function() {
      return {
        selfModel: false,
        focus: false
      };
    },
    props: {
      value: {},
      label: {},
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number]
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
      isDisabled: function() {
        return this.disabled || this._checkboxGroup.disabled;
      },
      store: function() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      },
      activeStyle: function() {
        return {
          backgroundColor: this._checkboxGroup.fill || '',
          borderColor: this._checkboxGroup.fill || '',
          color: this._checkboxGroup.textColor || '',
          'box-shadow': '-1px 0 0 0 ' + this._checkboxGroup.fill
        };
      },
      size: function() {
        return this._checkboxGroup.size;
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
      }
    },
    created: function() {
      this.checked && this.addToStore();
    }
  };
  Vue.component(VueCheckboxButton.name, VueCheckboxButton);
});
