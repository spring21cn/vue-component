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
    template: '<label role="radio" @keydown.space.stop.prevent="model = isDisabled ? model : label" :tabindex="tabIndex" class="vue-radio" :class="[{\'is-disabled\': isDisabled}]"><span :class="[\'vue-radio__input\', {\'is-disabled\': isDisabled, \'is-checked\': model === label, \'is-focus\': isFocus}]"><span class="vue-radio__inner"></span><input class="vue-radio__original" :value="label" type="radio" v-model="model" @focus="isFocus=true" @blur="isFocus=false" :name="name" :disabled="isDisabled" tabindex="-1"></span><span class="vue-radio__label"><slot></slot><template v-if="!$slots.default">{{label}}</template></span></label>',
    name: 'VueRadio',
    mixins: [VueUtil.component.emitter],
    props: {
      value: {},
      label: {},
      disabled: Boolean,
      name: String,
      tabindex: {
        type: Number,
        default: 0
      }
    },
    data: function() {
      return {
        isFocus: false
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
      },
      tabIndex: function() {
        return (this.isDisabled || (this.isGroup && this.model !== this.label)) ? -1 : this.isGroup ? this._radioGroup.tabindex : this.tabindex;
      }
    }, 
    destroyed: function() {
      this.isGroup && this._radioGroup.$emit('radioChange');
    },
    mounted: function() {
      this.isGroup && this._radioGroup.$emit('radioChange');
    },
    methods: {
      focus: function() {
        this.$el.querySelector('input').focus();
      }
    }
  };
  Vue.component(VueRadio.name, VueRadio);
});
