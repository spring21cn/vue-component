(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueRadioGroup = definition(context.Vue, context.VueUtil);
    delete context.VueRadioGroup;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var keyCode = Object.freeze({
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  });

  var VueRadioGroup = {
    template: '<div class="vue-radio-group" role="radiogroup" @keydown="handleKeydown"><slot></slot></div>',
    name: 'VueRadioGroup',
    mixins: [VueUtil.component.emitter],
    props: {
      value: {},
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean,
      tabindex: {
        type: Number,
        default: 0
      }
    },
    watch: {
      value: function(value) {
        this.$emit('change', value);
        this.dispatch('VueFormItem', 'vue.form.change', [this.value]);
      }
    },
    methods: {
      handleKeydown: function handleKeydown(e) {
        // 左右上下按键 可以在radio组内切换不同选项
        var target = e.target;
        var className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]:not(.is-disabled)';
        var radios = this.$el.querySelectorAll(className);
        var length = radios.length;
        var index = [].indexOf.call(radios, target);
        var roleRadios = this.$el.querySelectorAll('[role=radio]:not(.is-disabled)');
    
        switch (e.keyCode) {
          case keyCode.LEFT:
          case keyCode.UP:
            e.stopPropagation();
            e.preventDefault();
    
            if (index === 0) {
              roleRadios[length - 1].click();
              roleRadios[length - 1].focus();
            } else {
              roleRadios[index - 1].click();
              roleRadios[index - 1].focus();
            }
    
            break;
    
          case keyCode.RIGHT:
          case keyCode.DOWN:
            e.stopPropagation();
            e.preventDefault();

            if (index === length - 1) {
              roleRadios[0].click();
              roleRadios[0].focus();
            } else {
              roleRadios[index + 1].click();
              roleRadios[index + 1].focus();
            }
    
            break;
    
          default:
            break;
        }
      },
      handleTabindex: function() {
        var radios = this.$el.querySelectorAll('[type=radio]');
        var firstLabel = this.$el.querySelectorAll('[role=radio]')[0];

        if (![].some.call(radios, function (radio) {
          return radio.checked;
        }) && firstLabel) {
          firstLabel.tabIndex = this.tabindex;
        }
      },
      focus: function() {
        var radio = this.$el.querySelector('label:not([style*="display:none"]):not([style*="display: none"]):not([tabindex="-1"]) input[type="radio"]:not([disabled=disabled])');
        if(radio) {
          radio.focus();
        }
      }
    },
    mounted: function() {
      this.handleTabindex();
      this.$on('radioChange', this.handleTabindex);
    }
  };
  Vue.component(VueRadioGroup.name, VueRadioGroup);
});
