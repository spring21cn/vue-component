(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueNumberInput = definition(context.Vue, context.VueUtil);
    delete context.VueNumberInput;
  }
})(this, function(Vue, VueUtil) {
  'use strict';

  var VueNumberInput = {
    template: 
'<div \
  @dragstart.prevent \
  :class="[ \
    \'vue-number-input\', \
    inputNumberSize ? \'vue-number-input--\' + inputNumberSize : \'\', \
    { \'is-disabled\': inputNumberDisabled }, \
    { \'is-without-controls\': !controls }, \
    { \'is-controls-right\': controlsAtRight } \
  ]"> \
  <span \
    class="vue-number-input__decrease" \
    role="button" \
    v-if="controls" \
    v-repeat-click="decrease" \
    :class="{\'is-disabled\': minDisabled}" \
    @keydown.enter="decrease"> \
    <i :class="\'vue-icon-\' + (controlsAtRight ? \'arrow-down\' : \'minus\')"></i> \
  </span> \
  <span \
    class="vue-number-input__increase" \
    role="button" \
    v-if="controls" \
    v-repeat-click="increase" \
    :class="{\'is-disabled\': maxDisabled}" \
    @keydown.enter="increase"> \
    <i :class="\'vue-icon-\' + (controlsAtRight ? \'arrow-up\' : \'plus\')"></i> \
  </span> \
  <vue-input \
    ref="input" \
    :value="displayValue" \
    :placeholder="placeholder" \
    :disabled="inputNumberDisabled" \
    :size="inputNumberSize" \
    :max="max" \
    :min="min" \
    :name="name" \
    :label="label" \
    @keydown.up.native.prevent="increase" \
    @keydown.down.native.prevent="decrease" \
    @blur="handleBlur" \
    @focus="handleFocus" \
    @input="handleInput" \
    @change="handleInputChange"> \
  </vue-input> \
</div>',
    name: 'VueNumberInput',
    directives: {
      repeatClick: VueUtil.component.repeatClick
    },
    inject: {
      vueForm: {
        default: ''
      },
      vueFormItem: {
        default: ''
      },
    },
    props: {
      step: {
        type: Number,
        default: 1
      },
      stepStrictly: {
        type: Boolean,
        default: false
      },
      max: {
        type: Number,
        default: 99999999999
      },
      min: {
        type: Number,
        default: -99999999999
      },
      value: {},
      disabled: Boolean,
      size: String,
      controls: {
        type: Boolean,
        default: true
      },
      controlsPosition: {
        type: String,
        default: ''
      },
      name: String,
      label: String,
      placeholder: String,
      precision: {
        type: Number,
        validator: function (val) {
          return val >= 0 && val === parseInt(val, 10);
        }
      },
      allowEmpty: {
        type: Boolean,
        default: true,
      },
      useSeparator: {
        type: Boolean,
        default: false,
      },
      formatter: {
        type: Function,
        default: null,
      },
    },
    data: function() {
      return {
        currentValue: 0,
        userInput: null,
        focusing: false,
      };
    },
    watch: {
      value: {
        immediate: true,
        handler: function handler(value) {
          var newVal = value === undefined ? value : Number(value);
  
          if (newVal !== undefined) {
            if (isNaN(newVal)) {
              return;
            }
  
            if (this.stepStrictly) {
              var stepPrecision = this.getPrecision(this.step);
              var precisionFactor = Math.pow(10, stepPrecision);
              newVal = Math.round(newVal / this.step) * precisionFactor * this.step / precisionFactor;
            }
  
            if (this.precision !== undefined) {
              newVal = this.toPrecision(newVal, this.precision);
            }
          } else {
            if (this.allowEmpty === false) {
              newVal = this.min !== -Infinity ? this.min : 0;
            }
          }
  
          if (newVal >= this.max) newVal = this.max;
          if (newVal <= this.min) newVal = this.min;
          this.currentValue = newVal;
          this.userInput = null;
          this.$emit('input', newVal);
        }
      }
    },
    computed: {
      minDisabled: function minDisabled() {
        return this._decrease(this.value, this.step) < this.min;
      },
      maxDisabled: function maxDisabled() {
        return this._increase(this.value, this.step) > this.max;
      },
      numPrecision: function numPrecision() {
        var value = this.value,
            step = this.step,
            getPrecision = this.getPrecision,
            precision = this.precision;
        var stepPrecision = getPrecision(step);
  
        if (precision !== undefined) {
          if (stepPrecision > precision) {
            console.warn('[vue-number-input]precision should not be less than the decimal places of step');
          }
  
          return precision;
        } else {
          return Math.max(getPrecision(value), stepPrecision);
        }
      },
      controlsAtRight: function controlsAtRight() {
        return this.controls && this.controlsPosition === 'right';
      },
      inputNumberSize: function() {
        return this.size || (this.vueFormItem || {}).vueFormItemSize || (this.$VIY || {}).size;
      },
      inputNumberDisabled: function inputNumberDisabled() {
        return this.disabled || !!(this.vueForm || {}).disabled;
      },
      displayValue: function displayValue() {
        if (this.userInput !== null) {
          return this.userInput;
        }
  
        var currentValue = this.currentValue;
  
        if (typeof currentValue === 'number') {
          if (this.stepStrictly) {
            var stepPrecision = this.getPrecision(this.step);
            var precisionFactor = Math.pow(10, stepPrecision);
            currentValue = Math.round(currentValue / this.step) * precisionFactor * this.step / precisionFactor;
          }
  
          if (this.precision !== undefined) {
            currentValue = currentValue.toFixed(this.precision);
          }

          if (this.useSeparator && !this.focusing) {
            currentValue = VueUtil.numberWithCommas(currentValue);
          }

          if (this.formatter) {
            currentValue = this.formatter(currentValue, this.focusing);
          }
        }
  
        return currentValue;
      }
    },
    methods: {
      toPrecision: function toPrecision(num, precision) {
        if (precision === undefined) precision = this.numPrecision;
        return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision));
      },
      getPrecision: function getPrecision(value) {
        if (value === undefined) return 0;
        var valueString = value.toString();
        var dotPosition = valueString.indexOf('.');
        var precision = 0;
  
        if (dotPosition !== -1) {
          precision = valueString.length - dotPosition - 1;
        }
  
        return precision;
      },
      _increase: function _increase(val, step) {
        if (typeof val !== 'number' && val !== undefined) return this.currentValue;
        var precisionFactor = Math.pow(10, this.numPrecision); // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
  
        return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor);
      },
      _decrease: function _decrease(val, step) {
        if (typeof val !== 'number' && val !== undefined) return this.currentValue;
        var precisionFactor = Math.pow(10, this.numPrecision);
        return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor);
      },
      increase: function increase() {
        if (this.inputNumberDisabled || this.maxDisabled) return;
        var value = this.value || 0;
  
        var newVal = this._increase(value, this.step);
  
        this.setCurrentValue(newVal);
      },
      decrease: function decrease() {
        if (this.inputNumberDisabled || this.minDisabled) return;
        var value = this.value || 0;
  
        var newVal = this._decrease(value, this.step);
  
        this.setCurrentValue(newVal);
      },
      handleBlur: function handleBlur(event) {
        this.focusing = false;
        this.$emit('blur', event);
      },
      handleFocus: function handleFocus(event) {
        this.focusing = true;
        this.$emit('focus', event);
      },
      setCurrentValue: function setCurrentValue(newVal) {
        var oldVal = this.currentValue;
  
        if (typeof newVal === 'number' && this.precision !== undefined) {
          newVal = this.toPrecision(newVal, this.precision);
        }
  
        if (newVal >= this.max) newVal = this.max;
        if (newVal <= this.min) newVal = this.min;
        if (oldVal === newVal) return;
        this.userInput = null;
        this.$emit('input', newVal);
        this.$emit('change', newVal, oldVal);
        this.currentValue = newVal;
      },
      handleInput: function handleInput(value) {
        this.userInput = value;
      },
      handleInputChange: function handleInputChange(value) {
        var newVal = value === '' ? undefined : Number(value);
  
        if (!isNaN(newVal) || value === '') {
          this.setCurrentValue(newVal);
        }
  
        this.userInput = null;
      },
      // select: function select() {
      //   this.$refs.input.select();
      // },
      focus: function() {
        this.$refs.input.focus();
      }
    },
    mounted: function mounted() {
      var innerInput = this.$refs.input.$refs.input;
      innerInput.setAttribute('role', 'spinbutton');
      innerInput.setAttribute('aria-valuemax', this.max);
      innerInput.setAttribute('aria-valuemin', this.min);
      innerInput.setAttribute('aria-valuenow', this.currentValue);
      innerInput.setAttribute('aria-disabled', this.inputNumberDisabled);
    },
    updated: function updated() {
      if (!this.$refs || !this.$refs.input) return;
      var innerInput = this.$refs.input.$refs.input;
      innerInput.setAttribute('aria-valuenow', this.currentValue);
    }
  };
  Vue.component(VueNumberInput.name, VueNumberInput);
});
