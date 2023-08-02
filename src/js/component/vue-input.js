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
    '<div :class="[type === \'textarea\' ? \'vue-textarea\' : \'vue-input\', finalSize ? \'vue-input--\' + finalSize : \'\', {\'is-disabled\': inputDisabled, '+
    '     \'vue-input-group\': $slots.prepend || $slots.append, \'vue-input-group--append\': $slots.append, \'vue-input-group--prepend\': $slots.prepend,'+
    '     \'is-readonly\': readonly, \'vue-input--prefix\': $slots.prefix || prefixIcon'+
    '     }, finalSize&& ($slots.prefix || prefixIcon) ? \'vue-input--prefix--\' + finalSize : \'\']" >'+

    '    <template v-if="type !== \'textarea\'">'+
    '        <div class="vue-input-group__prepend" v-if="$slots.prepend">'+
    '            <slot name="prepend"></slot>'+
    '        </div>'+
    '        <slot name="icon">'+
    '            <i :class="[\'vue-input__icon\', icon, finalSize ? \'vue-icon--\' + finalSize : \'\', onIconClick ? \'is-clickable\' : \'\']" v-if="icon" @click="handleIconClick" ref="icon"></i>'+
    '        </slot>'+
    '        <input :style="inputStyle" v-if="type !== \'textarea\'" class="vue-input__inner" :pattern="isMobile && keyBoardType==\'onlynumber\' ? \'[0-9]*\' : null" :type="isMobile && keyBoardType ? keyBoardType==\'onlynumber\'?\'number\':keyBoardType : type==\'number\' ? \'input\' : type" :name="name" '+
    '               :placeholder="placeholder" :disabled="inputDisabled" :readonly="readonly" :maxlength="maxlength" '+
    '               :minlength="minlength" :autocomplete="autoComplete" :autofocus="autofocus" :tabindex="tabindex" '+
    '               :min="min" :max="max" :form="form" :value="currentValue" ref="input" @input="handleInput" '+
    '               @focus="handleFocus" @blur="handleBlur" @change="handleChange" @compositionstart="handleComposition" '+
    '               @compositionupdate="handleComposition" @compositionend="handleComposition">'+
    
    '        <span class="vue-input__prefix" v-if="$slots.prefix || prefixIcon"> '+
    '          <slot name="prefix"></slot> '+
    '          <i class="vue-input__icon" '+
    '             v-if="prefixIcon" '+
    '             :class="[prefixIcon,finalSize ? \'vue-icon--\' + finalSize : \'\']"> '+
    '          </i> '+
    '        </span> '+

    '        <i class="vue-input__icon vue-icon-loading" v-if="validating"></i>'+
    '        <div class="vue-input-group__append" v-if="$slots.append">'+
    '            <slot name="append"></slot>'+
    '        </div>'+
    '    </template>'+
    '    <textarea v-else class="vue-textarea__inner" :value="currentValue" @input="handleInput" ref="textarea" '+
    '             :name="name" :placeholder="placeholder" :disabled="inputDisabled" :style="textareaStyle" :readonly="readonly" '+
    '             :rows="rows" :form="form" :autofocus="autofocus" :tabindex="tabindex" :maxlength="maxlength" :minlength="minlength" '+
    '             @focus="handleFocus" @blur="handleBlur" @change="handleChange" @compositionstart="handleComposition" @compositionupdate="handleComposition" '+
    '             @compositionend="handleComposition"></textarea>'+
    '</div>',
    name: 'VueInput',
    mixins: [VueUtil.component.emitter],
    inject: {
      vueForm: {
        default: ''
      },
      vueFormItem: {
        default: ''
      },
    },
    data: function() {
      return {
        currentValue: this.value,
        textareaCalcStyle: {},
        isMobile: VueUtil.getSystemInfo().device == 'Mobile' && VueUtil.getSystemInfo().isLoadMobileJs ? true : false,
        isComposing: false, //for IE, event.isComposing is not working in IE, record composing state with isComposing
        focusValue: '',
        inputFlag: false,
      };
    },
    props: {
      type: {
        type: String,
        default: 'text'
      },
      value: [String, Number],
      maxlength: Number,
      minlength: Number,
      placeholder: String,
      disabled: Boolean,
      size: String,
      prefixIcon: String,
      icon: String,
      rows: {
        type: Number,
        default: 2
      },
      cleave: {
        type: Object,
        default: function() {return null;}
      },
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      name: String,
      readonly: Boolean,
      max: {},
      min: {},
      resize: String,
      autofocus: Boolean,
      textAlign: String,
      form: String,
      onIconClick: Function,
      tabindex: Number, //tabindex 的最大值不应超过 32767。如果没有指定，它的默认值为 0。
      noime: Boolean,
      validateEvent: {
        type: Boolean,
        default: true
      },
      keyBoardType:String
    },
    computed: {
      textareaStyle: function () {
        return VueUtil.merge({}, this.textareaCalcStyle, {
          resize: this.resize
        });
      },
      finalSize: function() {
        return this.size || (this.vueFormItem || {}).vueFormItemSize || (this.$VIY || {}).size;
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
      },
      inputDisabled: function() {
        return this.disabled || (this.vueForm || {}).disabled;
      },
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
        if (!VueUtil.isIE && !(VueUtil.getSystemInfo().os === 'iOS')) {
          this.$emit('change', event.target.value);
        }
      },
      handleBlur: function(event) {

        if (this.inputFlag && (VueUtil.isIE || (VueUtil.getSystemInfo().os === 'iOS')) && this.focusValue != event.target.value) {
          this.$emit('change', event.target.value);
        }
        this.inputFlag = false;
        
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
            minHeight: '33px'
          };
          return;
        }
    
        var minRows = autosize.minRows;
        var maxRows = autosize.maxRows;
        this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
      },
      handleFocus: function(event) {
        this.$emit('focus', event);

        this.focusValue = event.target.value;
        this.inputFlag = false;

      },
      handleComposition: function(event) {
        if (!VueUtil.isDef(event.isComposing) && event.type === 'compositionstart') {
          this.isComposing = true;// for IE
        }
        
        if (!VueUtil.isDef(event.isComposing) && event.type === 'compositionend') {
          this.isComposing = false;// for IE
          !(VueUtil.getSystemInfo().os === "iOS" && VueUtil.getSystemInfo().osVersion < '10.3') && this.setCurrentValue(event.target.value);
        }
      },
      handleInput: function(event) {
        /* triggered except compositionstart, compositionupdate and compositionend */
        if((VueUtil.isDef(event.isComposing) && !event.isComposing) || (!this.isComposing /* for IE */ && this.currentValue !== event.target.value /* for IE AND Microsoft Pinyin, input event triggered after compositionend event*/)) {
          this.setCurrentValue(event.target.value);
        }

        this.inputFlag = true;
      },
      handleIconClick: function(event) {
        if (this.onIconClick) {
          this.onIconClick(event);
        }
        this.$emit('click', event);
      },
      setCurrentValue: function(inputValue, watchFlg) {
        if (!VueUtil.isDef(inputValue)) inputValue = '';
        var originInputValue = inputValue;
        var self = this;
        if (inputValue === self.currentValue && !watchFlg)
          return;
        self.$nextTick(function() {
          self.resizeTextarea();
        });

        var rawValue = inputValue;
        if (self.type !== 'textarea' && self.cleave !== null && self.keyBoardType !== 'onlynumber') {
          var endPos = self.$refs.input.selectionEnd;

          if (watchFlg && self.cleave.numeral &&
             (self.cleave.numeralDecimalMark && self.cleave.numeralDecimalMark != '.')) {
            if (typeof inputValue === 'number') inputValue = inputValue + '';
            inputValue = inputValue.replace('.', self.cleave.numeralDecimalMark);
          }
          var inputValueBeforeFormat = self.$refs.input.value;
          self.$refs.input.value = inputValue;
          var cleaveObj = new Cleave(self.$refs.input, self.cleave);
          var cleavePps = cleaveObj.properties;
          var formattedValue;
          if(cleaveObj.isAndroid){
            formattedValue = cleaveObj.properties.result;
          }else {
            formattedValue = cleaveObj.getFormattedValue();
          }

          // 旧值比当前输入框上的值多一个分割符，表示刚刚删除掉一个分割符，此时新值应该取输入框上的值
          // 此时如果取格式化后的值的话，删掉的分割符又会重新出现，造成分割符没法删除的问题
          if(self.currentValue && self.currentValue.length > inputValueBeforeFormat.length && self.currentValue.replace(inputValueBeforeFormat, '') === self.cleave.delimiter){
            self.currentValue = inputValueBeforeFormat;
          }else {
            self.currentValue = formattedValue;
          }

          if(cleaveObj.isAndroid){
            if (cleavePps.rawValueTrimPrefix) {
              rawValue = Cleave.Util.getPrefixStrippedValue(self.currentValue, cleavePps.prefix, cleavePps.prefixLength, cleavePps.result);
            }

            if (cleavePps.numeral) {
              rawValue = cleavePps.numeralFormatter.getRawValue(self.currentValue);
            } else {
              rawValue = Cleave.Util.stripDelimiters(self.currentValue, cleavePps.delimiter, cleavePps.delimiters);
            }
          }else {
            rawValue = cleaveObj.getRawValue();
          }
          cleaveObj.destroy && cleaveObj.destroy();

          var pos = Cleave.Util.getNextCursorPosition(endPos, !watchFlg ? originInputValue : formattedValue, formattedValue, cleaveObj.properties.delimiter, cleaveObj.properties.delimiters);
          if (document.activeElement == self.$refs.input) {
            self.$refs.input.setSelectionRange(pos, pos);
          }
          
        } else {
          self.currentValue = inputValue;
        }

        if (self.type == 'number' && VueUtil.isNumberStr(rawValue)) {
          rawValue = parseFloat(rawValue);
        }
        if (!watchFlg) {
          self.$emit('input', rawValue);
        }
        if (self.validateEvent) {
          self.dispatch('VueFormItem', 'vue.form.change', [rawValue]);
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
