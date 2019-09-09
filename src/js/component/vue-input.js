(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'Cleave'], definition);
  } else {
    context.VueInput = definition(context.Vue, context.VueUtil, context.Cleave);
    delete context.VueInput;
    delete context.Cleave;
  }
})(this, function(Vue, VueUtil, Cleave) {
  'use strict';

  var hiddenTextarea;
  var HIDDEN_STYLE = '\n  height:0 !important;\n  visibility:hidden !important;\n  overflow:hidden !important;\n  position:absolute !important;\n  z-index:-1000 !important;\n  top:0 !important;\n  right:0 !important\n';
  var CONTEXT_STYLE = ['letter-spacing', 'line-height', 'padding-top', 'padding-bottom', 'font-family', 'font-weight', 'font-size', 'text-rendering', 'text-transform', 'width', 'text-indent', 'padding-left', 'padding-right', 'border-width', 'box-sizing'];

  function calculateNodeStyling(targetElement) {
    var style = window.getComputedStyle(targetElement);
    var boxSizing = style.getPropertyValue('box-sizing');
    var paddingSize = parseFloat(style.getPropertyValue('padding-bottom')) + parseFloat(style.getPropertyValue('padding-top'));
    var borderSize = parseFloat(style.getPropertyValue('border-bottom-width')) + parseFloat(style.getPropertyValue('border-top-width'));
    var contextStyle = CONTEXT_STYLE.map(function (name) {
      return ''.concat(name, ':').concat(style.getPropertyValue(name));
    }).join(';');
    return {
      contextStyle: contextStyle,
      paddingSize: paddingSize,
      borderSize: borderSize,
      boxSizing: boxSizing
    };
  }

  function calcTextareaHeight(targetElement) {
    var minRows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var maxRows = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (!hiddenTextarea) {
      hiddenTextarea = document.createElement('textarea');
      document.body.appendChild(hiddenTextarea);
    }

    var _calculateNodeStyling = calculateNodeStyling(targetElement),
        paddingSize = _calculateNodeStyling.paddingSize,
        borderSize = _calculateNodeStyling.borderSize,
        boxSizing = _calculateNodeStyling.boxSizing,
        contextStyle = _calculateNodeStyling.contextStyle;

    hiddenTextarea.setAttribute('style', ''.concat(contextStyle, ';').concat(HIDDEN_STYLE));
    hiddenTextarea.value = targetElement.value || targetElement.placeholder || '';
    var height = hiddenTextarea.scrollHeight;
    var result = {};

    if (boxSizing === 'border-box') {
      height = height + borderSize;
    } else if (boxSizing === 'content-box') {
      height = height - paddingSize;
    }

    hiddenTextarea.value = '';
    var singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

    if (minRows !== null) {
      var minHeight = singleRowHeight * minRows;

      if (boxSizing === 'border-box') {
        minHeight = minHeight + paddingSize + borderSize;
      }

      height = Math.max(minHeight, height);
      result.minHeight = ''.concat(minHeight, 'px');
    }

    if (maxRows !== null) {
      var maxHeight = singleRowHeight * maxRows;

      if (boxSizing === 'border-box') {
        maxHeight = maxHeight + paddingSize + borderSize;
      }

      height = Math.min(maxHeight, height);
    }

    result.height = ''.concat(height, 'px');
    hiddenTextarea.parentNode && hiddenTextarea.parentNode.removeChild(hiddenTextarea);
    hiddenTextarea = null;
    return result;
  }

  var VueInput = {
    template: 
    '<div :class="[type === \'textarea\' ? \'vue-textarea\' : \'vue-input\', size ? \'vue-input--\' + size : \'\', {\'is-disabled\': disabled, '+
    '     \'vue-input-group\': $slots.prepend || $slots.append, \'vue-input-group--append\': $slots.append, \'vue-input-group--prepend\': $slots.prepend,'+
    '     \'is-readonly\': readonly, \'vue-input--prefix\': $slots.prefix || prefixIcon, '+
    '     }]" >'+

    '    <template v-if="type !== \'textarea\'">'+
    '        <div class="vue-input-group__prepend" v-if="$slots.prepend">'+
    '            <slot name="prepend"></slot>'+
    '        </div>'+
    '        <slot name="icon">'+
    '            <i :class="[\'vue-input__icon\', icon, onIconClick ? \'is-clickable\' : \'\']" v-if="icon" @click="handleIconClick" ref="icon"></i>'+
    '        </slot>'+
    '        <input :style="inputStyle" v-if="type !== \'textarea\'" class="vue-input__inner" :type="type==\'number\'?\'input\':type" :name="name" '+
    '               :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :maxlength="maxlength" '+
    '               :minlength="minlength" :autocomplete="autoComplete" :autofocus="autofocus" :tabindex="tabindex" '+
    '               :min="min" :max="max" :form="form" :value="currentValue" ref="input" @input="handleInput" '+
    '               @focus="handleFocus" @blur="handleBlur" @change="handleChange" @compositionstart="handleComposition" '+
    '               @compositionupdate="handleComposition" @compositionend="handleComposition">'+
    
    '        <span class="vue-input__prefix" v-if="$slots.prefix || prefixIcon"> '+
    '          <slot name="prefix"></slot> '+
    '          <i class="vue-input__icon" '+
    '             v-if="prefixIcon" '+
    '             :class="prefixIcon"> '+
    '          </i> '+
    '        </span> '+

    '        <i class="vue-input__icon vue-icon-loading" v-if="validating"></i>'+
    '        <div class="vue-input-group__append" v-if="$slots.append">'+
    '            <slot name="append"></slot>'+
    '        </div>'+
    '    </template>'+
    '    <textarea v-else class="vue-textarea__inner" :value="currentValue" @input="handleInput" ref="textarea" '+
    '             :name="name" :placeholder="placeholder" :disabled="disabled" :style="textareaStyle" :readonly="readonly" '+
    '             :rows="rows" :form="form" :autofocus="autofocus" :tabindex="tabindex" :maxlength="maxlength" :minlength="minlength" '+
    '             @focus="handleFocus" @blur="handleBlur" @change="handleChange" @compositionstart="handleComposition" @compositionupdate="handleComposition" '+
    '             @compositionend="handleComposition"></textarea>'+
    '</div>',
    name: 'VueInput',
    mixins: [VueUtil.component.emitter],
    data: function() {
      return {
        currentValue: this.value,
        textareaCalcStyle: {}
      };
    },
    props: {
      prefixIcon: String,
      value: [String, Number],
      placeholder: String,
      size: String,
      resize: String,
      readonly: Boolean,
      autofocus: Boolean,
      icon: String,
      tabindex: Number,
      disabled: Boolean,
      noime: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      name: String,
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      rows: {
        type: Number,
        default: 2
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      form: String,
      maxlength: Number,
      minlength: Number,
      max: {},
      min: {},
      cleave: {
        type: Object,
        default: function() {return null;}
      },
      validateEvent: {
        type: Boolean,
        default: true
      },
      onIconClick: Function,
      textAlign: String
    },
    computed: {
      textareaStyle: function () {
        return VueUtil.merge({}, this.textareaCalcStyle, {
          resize: this.resize
        });
      },
      validating: function() {
        return this.$parent.validateState === 'validating';
      },
      inputStyle: function() {
        var style={};
        if (['center', 'right'].indexOf(this.textAlign) !== -1) {
          style.textAlign = this.textAlign;
        }
        return style;
      }
    },
    watch: {
      'value': function(val) {
        this.setCurrentValue(val, true);
      }
    },
    methods: {
      focus: function() {
        if (this.type !== 'textarea') {
          this.$refs.input.focus();
        } else {
          this.$refs.textarea.focus();
        }
      },
      handleChange: function(event) {
        this.$emit('change', event.target.value);
      },
      handleBlur: function(event) {
        this.$emit('blur', event);
        if (this.validateEvent) {
          this.dispatch('VueFormItem', 'vue.form.blur', [this.currentValue]);
        }
      },
      inputSelect: function() {
        this.$refs.input.select();
      },
      resizeTextarea: function () {
        var autosize = this.autosize,
            type = this.type;
        if (type !== 'textarea') return;
    
        if (!autosize) {
          this.textareaCalcStyle = {
            minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
          };
          return;
        }
    
        var minRows = autosize.minRows;
        var maxRows = autosize.maxRows;
        this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
      },
      handleFocus: function(event) {
        this.$emit('focus', event);
      },
      handleComposition: function(event) {
        if (event.type === 'compositionend') {
          this.handleInput(event);
        }
      },
      handleInput: function(event) {
        if (this.noime) {
          if(!event.isComposing) {
            this.setCurrentValue(event.target.value);
          } else {
            this.setCurrentValue(this.currentValue,true);
          }
        } else {
          this.setCurrentValue(event.target.value);
        }
      },
      handleIconClick: function(event) {
        if (this.onIconClick) {
          this.onIconClick(event);
        }
        this.$emit('click', event);
      },
      setCurrentValue: function(value, watchFlg) {
        if (!VueUtil.isDef(value)) value = '';
        var self = this;
        if (value === self.currentValue && !watchFlg)
          return;
        self.$nextTick(function() {
          self.resizeTextarea();
        });
        if (self.type !== 'textarea' && self.cleave !== null) {
          var endPos = self.$refs.input.selectionEnd;
          self.$refs.input.value = value;
          var cleaveObj = new Cleave(self.$refs.input, self.cleave);
          self.currentValue = cleaveObj.getFormattedValue();
          if (cleaveObj.getFormattedValue().length >= value.length && !watchFlg) { 
            self.currentValue = value;
          }
          value = cleaveObj.getRawValue();
          cleaveObj.destroy && cleaveObj.destroy();

          var pos = Cleave.Util.getNextCursorPosition(endPos, self.currentValue, cleaveObj.properties.result, cleaveObj.properties.delimiter, cleaveObj.properties.delimiters);
          if (document.activeElement == self.$refs.input) {
            self.$refs.input.setSelectionRange(pos, pos);
          }
          
        } else {
          self.currentValue = value;
        }
        if (self.type == 'number' && VueUtil.isNumberStr(value)) {
          value = parseFloat(value);
        }
        if (!watchFlg) {
          self.$emit('input', value);
        }
        if (self.validateEvent) {
          self.dispatch('VueFormItem', 'vue.form.change', [value]);
        }
      }
    },
    created: function() {
      this.$on('inputSelect', this.inputSelect);
    },
    mounted: function() {
      this.setCurrentValue(this.currentValue, true);
      this.resizeTextarea();
    }
  };
  Vue.component(VueInput.name, VueInput);
});
