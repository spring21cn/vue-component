(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueCheckbox = definition(context.Vue, context.VueUtil);
    delete context.VueCheckbox;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueCheckbox = {
    template: '<label class="vue-checkbox"><span :class="[\'vue-checkbox__input\', {\'is-disabled\': disabled, \'is-checked\': isChecked, \'is-indeterminate\': indeterminate, \'is-focus\': focus}]"><span class="vue-checkbox__inner"></span><input v-if="trueLabel || falseLabel" class="vue-checkbox__original" type="checkbox" :name="name" :disabled="disabled" :true-value="trueLabel" :false-value="falseLabel" v-model="model" @change="handleChange" @focus="focus = true" @blur="focus = false"><input v-else class="vue-checkbox__original" type="checkbox" :disabled="disabled" :value="label" :name="name" v-model="model" @change="handleChange" @focus="focus = true" @blur="focus = false"></span><span class="vue-checkbox__label" v-if="$slots.default || label"><slot></slot><template v-if="!$slots.default">{{label}}</template></span></label>',
    name: 'VueCheckbox',
    mixins: [VueUtil.component.emitter],
    data: function() {
      return {
        selfModel: false,
        focus: false
      };
    },
    computed: {
      model: {
        get: function() {
          return this.isGroup ? this.store : VueUtil.isDef(this.value) ? this.value : this.selfModel;
        },
        set: function(val) {
          if (this.isGroup) {
            var isLimitExceeded = false;
            (VueUtil.isDef(this._checkboxGroup.min) && val.length < this._checkboxGroup.min && (isLimitExceeded = true));
            (VueUtil.isDef(this._checkboxGroup.max) && val.length > this._checkboxGroup.max && (isLimitExceeded = true));
            isLimitExceeded === false && this.dispatch('VueCheckboxGroup', 'input', [val]);
          } else {
            this.$emit('input', val);
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
      isGroup: function() {
        var parent = this.$parent;
        while (parent) {
          if (parent.$options.name !== 'VueCheckboxGroup') {
            parent = parent.$parent;
          } else {
            this._checkboxGroup = parent;
            return true;
          }
        }
        return false;
      },
      store: function() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      }
    },
    props: {
      value: {},
      label: {},
      indeterminate: Boolean,
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number]
    },
    methods: {
      addToStore: function() {
        if (VueUtil.isArray(this.model) && this.model.indexOf(this.label) === -1) {
          this.model.push(this.label);
        } else {
          this.model = this.trueLabel || true;
        }
      },
      handleChange: function(ev) {
        var self = this;
        self.$emit('change', ev);
        if (self.isGroup) {
          self.$nextTick(function(ev) {
            self.dispatch('VueCheckboxGroup', 'change', [self._checkboxGroup.value]);
          });
        }
      }
    },
    created: function() {
      this.checked && this.addToStore();
    }
  };
  Vue.component(VueCheckbox.name, VueCheckbox);
});
