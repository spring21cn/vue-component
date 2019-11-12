(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueSwitch = definition(context.Vue);
    delete context.VueSwitch;
  }
})(this, function(Vue) {
  'use strict';
  var VueSwitch = {
    template: '<label :tabindex="disabled ? -1 : tabindex" @keydown.space.stop.prevent="toggleCheck" :class="[\'vue-switch\', {\'is-disabled\': disabled, \'vue-switch--wide\': hasText}]">\
      <div class="vue-switch__mask" v-show="disabled"></div>\
      <input ref="check" class="vue-switch__input" type="checkbox" @change="handleChange" v-model="_value" :name="name" :disabled="disabled">\
      <span class="vue-switch__core" ref="core" :style="{\'width\': coreWidth + \'px\'}">\
        <span class="vue-switch__button" :style="buttonStyle"></span>\
      </span>\
      <transition name="label-fade"><div class="vue-switch__label vue-switch__label--left" v-show="_value" :style="{\'width\': coreWidth + \'px\'}">\
        <i :class="[onIconClass]" v-if="onIconClass"></i><span v-if="!onIconClass && onText">{{onText}}</span></div>\
      </transition>\
      <transition name="label-fade"><div class="vue-switch__label vue-switch__label--right" v-show="!_value" :style="{\'width\': coreWidth + \'px\'}">\
      <i :class="[offIconClass]" v-if="offIconClass"></i>\
      <span v-if="!offIconClass && offText">{{offText}}</span>\
      </div>\
      </transition>\
    </label>',
    name: 'VueSwitch',
    props: {
      value: {
        type: [Boolean, String, Number],
        default: true
      },
      onValue: {
        type: [Boolean, String, Number],
        default: true
      },
      offValue: {
        type: [Boolean, String, Number],
        default: false
      },
      disabled: Boolean,
      width: {
        type: Number,
        default: 0
      },
      onIconClass: {
        type: String,
        default: ''
      },
      offIconClass: {
        type: String,
        default: ''
      },
      onText: {
        type: String,
        default: 'ON'
      },
      offText: {
        type: String,
        default: 'OFF'
      },
      onColor: {
        type: String,
        default: ''
      },
      offColor: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      tabindex: {
        type: Number,
        default: 0
      }
    },
    data: function() {
      return {
        coreWidth: this.width,
        buttonStyle: {
          transform: ''
        }
      };
    },
    computed: {
      hasText: function() {
        return this.onText || this.offText;
      },
      _value: {
        get: function() {
          return this.value === this.onValue;
        },
        set: function(val) {
          this.$emit('input', val ? this.onValue : this.offValue);
        }
      }
    },
    watch: {
      value: function() {
        if (this.onColor || this.offColor) {
          this.setBackgroundColor();
        }
        this.handleButtonTransform();
      },
      width: function() {
          this.coreWidth = this.width;
          this.handleButtonTransform();
      }
    },
    methods: {
      handleChange: function(event) {
        this.$emit('change', event.currentTarget.checked ? this.onValue : this.offValue);
      },
      toggleCheck: function() {
        this.$refs.check.click();
      },
      handleButtonTransform: function() {
        this.buttonStyle.transform = this._value ? 'translate(' + (this.coreWidth - 20) + 'px, 2px)' : 'translate(2px, 2px)';
      },
      setBackgroundColor: function() {
        var newColor = this._value ? this.onColor : this.offColor;
        this.$refs.core.style.borderColor = newColor;
        this.$refs.core.style.backgroundColor = newColor;
      }
    },
    mounted: function() {
      if (this.width === 0) {
        this.coreWidth = this.hasText ? 58 : 46;
      }
      this.handleButtonTransform();
      if (this.onColor || this.offColor) {
        this.setBackgroundColor();
      }
    }
  };
  Vue.component(VueSwitch.name, VueSwitch);
});
