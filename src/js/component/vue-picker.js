(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VuePopper'], definition);
  } else {
    context.VuePicker = definition(context.Vue, context.VueUtil, context.VuePopper);
  }
})(this, function(Vue, VueUtil, VuePopper) {
  'use strict';
  var NewPopper = {
    props: {
      appendToBody: VuePopper.props.appendToBody,
      offset: VuePopper.props.offset,
      boundariesPadding: VuePopper.props.boundariesPadding,
      autoWidth:VuePopper.props.autoWidth
    },
    methods: VuePopper.methods,
    data: function() {return VueUtil.merge({ visibleArrow: false }, VuePopper.data);},
    beforeDestroy: VuePopper.beforeDestroy
  };
  var formatDate = VueUtil.formatDate,
      parseDate = VueUtil.parseDate,
      isDateObject = VueUtil.isDateObject,
      getWeekNumber = VueUtil.getWeekNumber;

  
  var DEFAULT_FORMATS = {
    date: 'yyyy-MM-dd',
    month: 'yyyy-MM',
    datetime: 'yyyy-MM-dd HH:mm:ss',
    time: 'HH:mm:ss',
    week: 'yyyywWW',
    timerange: 'HH:mm:ss',
    daterange: 'yyyy-MM-dd',
    monthrange: 'yyyy-MM',
    datetimerange: 'yyyy-MM-dd HH:mm:ss',
    year: 'yyyy'
  };
  var HAVE_TRIGGER_TYPES = [
    'date',
    'datetime',
    'time',
    'time-select',
    'week',
    'month',
    'year',
    'daterange',
    'monthrange',
    'timerange',
    'datetimerange',
    'dates'
  ];
  var DATE_FORMATTER = function(value, format) {
    if (format === 'timestamp') return value.getTime();
    return formatDate(value, format);
  };
  var DATE_PARSER = function(text, format) {
    if (format === 'timestamp') return new Date(Number(text));
    return parseDate(text, format);
  };
  var RANGE_FORMATTER = function(value, format) {
    if (Array.isArray(value) && value.length === 2) {
      var start = value[0];
      var end = value[1];

      if (start && end) {
        return [DATE_FORMATTER(start, format), DATE_FORMATTER(end, format)];
      }
    }
    return '';
  };
  var RANGE_PARSER = function(array, format, separator) {
    if (!Array.isArray(array)) {
      array = array.split(separator);
    }
    if (array.length === 2) {
      var range1 = array[0];
      var range2 = array[1];

      return [DATE_PARSER(range1, format), DATE_PARSER(range2, format)];
    }
    return [];
  };
  var TYPE_VALUE_RESOLVER_MAP = {
    default: {
      formatter: function (value) {
        if (!value) return '';
        return '' + value;
      },
      parser: function (text) {
        if (text === undefined || text === '') return null;
        return text;
      }
    },
    week: {
      formatter: function (value, format) {
        var week = getWeekNumber(value);
        var month = value.getMonth();
        var trueDate = new Date(value);
  
        if (week === 1 && month === 11) {
          trueDate.setHours(0, 0, 0, 0);
          trueDate.setDate(trueDate.getDate() + 3 - (trueDate.getDay() + 6) % 7);
        }
  
        var date = formatDate(trueDate, format);
        date = /WW/.test(date) ? date.replace(/WW/, week < 10 ? '0' + week : week) : date.replace(/W/, week);
        return date;
      },
      parser: function (text, format) {
        // parse as if a normal date
        return TYPE_VALUE_RESOLVER_MAP.date.parser(text, format);
      }
    },
    date: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    datetime: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    daterange: {
      formatter: RANGE_FORMATTER,
      parser: RANGE_PARSER
    },
    monthrange: {
      formatter: RANGE_FORMATTER,
      parser: RANGE_PARSER
    },
    datetimerange: {
      formatter: RANGE_FORMATTER,
      parser: RANGE_PARSER
    },
    timerange: {
      formatter: RANGE_FORMATTER,
      parser: RANGE_PARSER
    },
    time: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    month: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    year: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    number: {
      formatter: function (value) {
        if (!value) return '';
        return '' + value;
      },
      parser: function (text) {
        var result = Number(text);
  
        if (!isNaN(text)) {
          return result;
        } else {
          return null;
        }
      }
    },
    dates: {
      formatter: function (value, format) {
        return value.map(function (date) {
          return DATE_FORMATTER(date, format);
        });
      },
      parser: function (value, format) {
        return (typeof value === 'string' ? value.split(', ') : value).map(function (date) {
          return date instanceof Date ? date : DATE_PARSER(date, format);
        });
      }
    }
  };
  var PLACEMENT_MAP = {
    left: 'bottom-start',
    center: 'bottom',
    right: 'bottom-end'
  };

  var parseAsFormatAndType = function (value, customFormat, type) {
    var rangeSeparator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '-';
    if (!value) return null;
    var parser = (TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP['default']).parser;
    var format = customFormat || DEFAULT_FORMATS[type];
    return parser(value, format, rangeSeparator);
  };
  
  var formatAsFormatAndType = function (value, customFormat, type) {
    if (!value) return null;
    var formatter = (TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP['default']).formatter;
    var format = customFormat || DEFAULT_FORMATS[type];
    return formatter(value, format);
  };
  /*
  * Considers:
  *   1. Date object
  *   2. date string
  *   3. array of 1 or 2
  */
  
  
  var valueEquals = function (a, b) {
    // considers Date object and string
    var dateEquals = function (a, b) {
      var aIsDate = a instanceof Date;
      var bIsDate = b instanceof Date;
  
      if (aIsDate && bIsDate) {
        return a.getTime() === b.getTime();
      }
  
      if (!aIsDate && !bIsDate) {
        return a === b;
      }
  
      return false;
    };
  
    var aIsArray = a instanceof Array;
    var bIsArray = b instanceof Array;
  
    if (aIsArray && bIsArray) {
      if (a.length !== b.length) {
        return false;
      }
  
      return a.every(function (item, index) {
        return dateEquals(item, b[index]);
      });
    }
  
    if (!aIsArray && !bIsArray) {
      return dateEquals(a, b);
    }
  
    return false;
  };
  
  var isString = function (val) {
    return typeof val === 'string' || val instanceof String;
  };
  
  var validator = function (val) {
    // either: String, Array of String, null / undefined
    return val === null || val === undefined || isString(val) || Array.isArray(val) && val.length === 2 && val.every(isString);
  };

  var VuePicker = {
    template: 
    '  <vue-input'+
    '    class="vue-date-editor"'+
    '    :class="\'vue-date-editor--\' + type"'+
    '    :readonly="isMobile()||!editable || readonly || type === \'dates\' || type === \'week\'"'+
    '    :disabled="pickerDisabled"'+
    '    :size="pickerSize"'+
    '    :name="name"'+
    '    v-bind="firstInputId"'+
    '    v-if="!ranged"'+
    '    v-clickoutside="handleClose"'+
    '    :placeholder="placeholder"'+
    '    @focus="handleFocus"'+
    '    @keydown.native="handleKeydown"'+
    '    :value="displayValue"'+
    '    @input="function (value) {return userInput = value;}"'+
    '    @change="handleChange"'+
    '    @mouseenter.native="handleMouseEnter"'+
   // '    @mouseleave.native="showClose = false"'+
    '    :validateEvent="false"'+
    '    :icon="showClose ? \'\' + clearIcon : \'\'"'+
    '    :on-icon-click="handleClickIcon"'+
    '    ref="reference">'+
    '    <i slot="prefix"'+
    '      class="vue-input__icon"'+
    '      :class="triggerClass"'+
    '      @click="handleFocus">'+
    '    </i>'+
    // '    <i slot="suffix"'+
    // '      class="vue-input__icon"'+
    // '      @click="handleClickIcon"'+
    // '      :class="[showClose ? \'\' + clearIcon : \'\']"'+
    // '      v-if="haveTrigger">'+
    // '    </i>'+
    '  </vue-input>'+
    '  <div'+
    '    class="vue-date-editor vue-range-editor vue-input__inner"'+
    '    :class="['+
    '      \'vue-date-editor--\' + type,'+
    '      pickerSize ? \'vue-range-editor--\' + pickerSize  : \'\','+
    '      pickerDisabled ? \'is-disabled\' : \'\','+
    '      pickerVisible ? \'is-active\' : \'\''+
    '    ]"'+
    '    @click="handleRangeClick"'+
    '    @mouseenter="handleMouseEnter"'+
   // '    @mouseleave="showClose = false"'+
    '    @keydown="handleKeydown"'+
    '    ref="reference"'+
    '    v-clickoutside="handleClose"'+
    '    v-else>'+
    '    <i :class="[\'vue-input__icon\', \'vue-range__icon\', triggerClass]"></i>'+
    '    <input'+
    '      autocompvare="off"'+
    '      :placeholder="startPlaceholder"'+
    '      :value="displayValue && displayValue[0]"'+
    '      :disabled="pickerDisabled"'+
    '      v-bind="firstInputId"'+
    '      :readonly="!editable || readonly"'+
    '      :name="name && name[0]"'+
    '      @input="handleStartInput"'+
    '      @change="handleStartChange"'+
    '      @focus="handleFocus"'+
    '      class="vue-range-input">'+
    '    <slot name="range-separator">'+
    '      <span class="vue-range-separator">{{ rangeSeparator }}</span>'+
    '    </slot>'+
    '    <input'+
    '      autocompvare="off"'+
    '      :placeholder="endPlaceholder"'+
    '      :value="displayValue && displayValue[1]"'+
    '      :disabled="pickerDisabled"'+
    '      v-bind="secondInputId"'+
    '      :readonly="!editable || readonly"'+
    '      :name="name && name[1]"'+
    '      @input="handleEndInput"'+
    '      @change="handleEndChange"'+
    '      @focus="handleFocus"'+
    '      class="vue-range-input">'+
    '    <i'+
    '      @click="handleClickIcon"'+
    '      v-if="haveTrigger"'+
    '      :class="[showClose ? \'\' + clearIcon : \'\']"'+
    '      class="vue-input__icon vue-range__close-icon">'+
    '    </i>'+
    '  </div>',
    mixins: [VueUtil.component.emitter, NewPopper],
    directives: {
      Clickoutside: VueUtil.component.clickoutside()
    },
    props: {
      size: String,
      format: String,
      valueFormat: String,
      readonly: Boolean,
      placeholder: String,
      startPlaceholder: String,
      endPlaceholder: String,
      prefixIcon: String,
      clearIcon: {
        type: String,
        default: 'vue-icon-close'
      },
      name: {
        default: '',
        validator: validator
      },
      disabled: Boolean,
      clearable: {
        type: Boolean,
        default: true
      },
      id: {
        default: '',
        validator: validator
      },
      popperClass: String,
      editable: {
        type: Boolean,
        default: true
      },
      align: {
        type: String,
        default: 'left'
      },
      value: {},
      defaultValue: {},
      defaultTime: {},
      rangeSeparator: {
        default: '-'
      },
      pickerOptions: {},
      unlinkPanels: Boolean,
      validateEvent: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        pickerVisible: false,
        showClose: false,
        userInput: null,
        valueOnOpen: null,
        // value when picker opens, used to determine whether to emit change
        unwatchPickerOptions: null
      };
    },
    watch: {
      pickerVisible: function (val) {
        if (this.readonly || this.pickerDisabled) return;
        if (val) {
          this.showPicker();
          this.valueOnOpen = Array.isArray(this.value) ?  this.value.slice() : this.value;
        } else {
          this.hidePicker();
          this.emitChange(this.value);
          this.userInput = null;
  
          if (this.validateEvent) {
            this.dispatch('VueFormItem', 'vue.form.blur');
          }
  
          this.$emit('blur', this);
          this.blur();
        }
       

      },
      parsedValue: {
        immediate: true,
        handler: function (val) {
          if (this.picker) {
            this.picker.value = val;
          }
        }
      },
      defaultValue: function (val) {
        // NOTE: should eventually move to jsx style picker + panel ?
        if (this.picker) {
          this.picker.defaultValue = val;
        }
      },
      value: function (val, oldVal) {
        if (!valueEquals(val, oldVal) && !this.pickerVisible && this.validateEvent) {
          this.dispatch('VueFormItem', 'vue.form.change', val);
        }
 
        if(val){
          this.showClose = true;        
        }else{
          this.showClose = false;
        }
        
      }
    },
    computed: {
      ranged: function () {
        return this.type.indexOf('range') > -1;
      },
      reference: function () {
        var reference = this.$refs.reference;
        return reference.$el || reference;
      },
      refInput: function () {
        if (this.reference) {
          return [].slice.call(this.reference.querySelectorAll('input'));
        }
  
        return [];
      },
      valueIsEmpty: function () {
        var val = this.value;
  
        if (Array.isArray(val)) {
          for (var i = 0, len = val.length; i < len; i++) {
            if (val[i]) {
              return false;
            }
          }
        } else {
          if (val) {
            return false;
          }
        }
  
        return true;
      },
      triggerClass: function () {
        return this.prefixIcon || (this.type.indexOf('time') !== -1 ? 'vue-icon-time' : 'vue-icon-date');
      },
      selectionMode: function () {
        if (this.type === 'week') {
          return 'week';
        } else if (this.type === 'month') {
          return 'month';
        } else if (this.type === 'year') {
          return 'year';
        } else if (this.type === 'dates') {
          return 'dates';
        }
  
        return 'day';
      },
      haveTrigger: function () {
        if (typeof this.showTrigger !== 'undefined') {
          return this.showTrigger;
        }
  
        return HAVE_TRIGGER_TYPES.indexOf(this.type) !== -1;
      },
      displayValue: function () {
        var formattedValue = formatAsFormatAndType(this.parsedValue, this.format, this.type, this.rangeSeparator);
  
        if (Array.isArray(this.userInput)) {
          return [this.userInput[0] || formattedValue && formattedValue[0] || '', this.userInput[1] || formattedValue && formattedValue[1] || ''];
        } else if (this.userInput !== null) {
          return this.userInput;
        } else if (formattedValue) {
          return this.type === 'dates' ? formattedValue.join(', ') : formattedValue;
        } else {
          return '';
        }
      },
      parsedValue: function () {
        if (!this.value) return this.value; // component value is not set
  
        if (this.type === 'time-select') return this.value; // time-select does not require parsing, this might change in next major version
  
        var valueIsDateObject = isDateObject(this.value) || Array.isArray(this.value) && this.value.every(isDateObject);
  
        if (valueIsDateObject) {
          return this.value;
        }
  
        if (this.valueFormat) {
          return parseAsFormatAndType(this.value, this.valueFormat, this.type, this.rangeSeparator) || this.value;
        } // NOTE: deal with common but incorrect usage, should remove in next major version
        // user might provide string / timestamp without value-format, coerce them into date (or array of date)
  
        return Array.isArray(this.value) ? this.value.map(function (val) {
          return new Date(val);
        }) : new Date(this.value);
      },
      _elFormItemSize: function _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      pickerSize: function () {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      pickerDisabled: function () {
        return this.disabled || (this.elForm || {}).disabled;
      },
      firstInputId: function () {
        var obj = {};
        var id;
  
        if (this.ranged) {
          id = this.id && this.id[0];
        } else {
          id = this.id;
        }
  
        if (id) obj.id = id;
        return obj;
      },
      secondInputId: function () {
        var obj = {};
        var id;
  
        if (this.ranged) {
          id = this.id && this.id[1];
        }
  
        if (id) obj.id = id;
        return obj;
      }
    },
    created: function () {
      // vue-popper
      this.popperOptions = {
        boundariesPadding: 0,
        gpuAcceleration: false
      };
      this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left;
      this.$on('fieldReset', this.handleFieldReset);
    },
    methods: {
      focus: function () {
        if (!this.ranged) {
          this.$refs.reference.focus();
        } else {
          this.handleFocus();
        }
      },
      blur: function () {
        this.refInput.forEach(function (input) {
          return input.blur();
        });
      },
      // {parse, formatTo} Value deals maps component value with internal Date
      parseValue: function (value) {
        var isParsed = isDateObject(value) || Array.isArray(value) && value.every(isDateObject);
  
        if (this.valueFormat && !isParsed) {
          return parseAsFormatAndType(value, this.valueFormat, this.type, this.rangeSeparator) || value;
        } else {
          return value;
        }
      },
      isMobile: function () {
        return VueUtil.getSystemInfo().device == 'Mobile'
      },
      formatToValue: function (date) {
        var isFormattable = isDateObject(date) || Array.isArray(date) && date.every(isDateObject);
  
        if (this.valueFormat && isFormattable) {
          return formatAsFormatAndType(date, this.valueFormat, this.type, this.rangeSeparator);
        } else {
          return date;
        }
      },
      // {parse, formatTo} String deals with user input
      parseString: function (value) {
        var type = Array.isArray(value) ? this.type : this.type.replace('range', '');
        return parseAsFormatAndType(value, this.format, type);
      },
      formatToString: function (value) {
        var type = Array.isArray(value) ? this.type : this.type.replace('range', '');
        return formatAsFormatAndType(value, this.format, type);
      },
      handleMouseEnter: function () {
        if (this.readonly || this.pickerDisabled) return;
  
        if (!this.valueIsEmpty && this.clearable) {
          this.showClose = true;
        }
      },
      handleChange: function () {
        if (this.userInput) {
          var value = this.parseString(this.displayValue);
  
          if (value) {
            this.picker.value = value;
  
            if (this.isValidValue(value)) {
              this.emitInput(value);
              this.userInput = null;
            }
          }
        }
  
        if (this.userInput === '') {
          this.emitInput(null);
          this.emitChange(null);
          this.userInput = null;
        }
      },
      handleStartInput: function (event) {
        if (this.userInput) {
          this.userInput = [event.target.value, this.userInput[1]];
        } else {
          this.userInput = [event.target.value, null];
        }
      },
      handleEndInput: function (event) {
        if (this.userInput) {
          this.userInput = [this.userInput[0], event.target.value];
        } else {
          this.userInput = [null, event.target.value];
        }
      },
      handleStartChange: function (event) {
        var value = this.parseString(this.userInput && this.userInput[0]);
  
        if (value) {
          this.userInput = [this.formatToString(value), this.displayValue[1]];
          var newValue = [value, this.picker.value && this.picker.value[1]];
          this.picker.value = newValue;
  
          if (this.isValidValue(newValue)) {
            this.emitInput(newValue);
            this.userInput = null;
          }
        }
      },
      handleEndChange: function (event) {
        var value = this.parseString(this.userInput && this.userInput[1]);
  
        if (value) {
          this.userInput = [this.displayValue[0], this.formatToString(value)];
          var newValue = [this.picker.value && this.picker.value[0], value];
          this.picker.value = newValue;
  
          if (this.isValidValue(newValue)) {
            this.emitInput(newValue);
            this.userInput = null;
          }
        }
      },
      handleClickIcon: function (event) {
        if (this.readonly || this.pickerDisabled) return;
  
        if (this.showClose) {
          this.valueOnOpen = this.value;
          event.stopPropagation();
          this.emitInput(null);
          this.emitChange(null);
          this.showClose = false;
  
          if (this.picker && typeof this.picker.handleClear === 'function') {
            this.picker.handleClear();
          }
        } else {
          this.pickerVisible = !this.pickerVisible;
        }
      },
      handleClose: function () {
        if (!this.pickerVisible) return;
        this.pickerVisible = false;
  
        if (this.type === 'dates') {
          // restore to former value
          var oldValue = parseAsFormatAndType(this.valueOnOpen, this.valueFormat, this.type, this.rangeSeparator) || this.valueOnOpen;
          this.emitInput(oldValue);
        }
        

      },
      handleFieldReset: function (initialValue) {
        this.userInput = initialValue === '' ? null : initialValue;
      },
      handleFocus: function () {
        var type = this.type;
  
        if (HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible) {
          this.pickerVisible = true;
        }
  
        this.$emit('focus', this);
      },
      handleKeydown: function (event) {
        var self = this;
        var keyCode = event.keyCode; // ESC
  
        if (keyCode === 27) {
          this.pickerVisible = false;
          event.stopPropagation();
          return;
        } // Tab
  
  
        if (keyCode === 9) {
          if (!this.ranged) {
            this.handleChange();
            this.pickerVisible = this.picker.visible = false;
            this.blur();
            event.stopPropagation();
          } else {
            // user may change focus between two input
            setTimeout(function () {
              if (self.refInput.indexOf(document.activeElement) === -1) {
                self.pickerVisible = false;
  
                self.blur();
  
                event.stopPropagation();
              }
            }, 0);
          }
  
          return;
        } // Enter
  
  
        if (keyCode === 13) {
          if (this.userInput === '' || this.isValidValue(this.parseString(this.displayValue))) {
            this.handleChange();
            this.pickerVisible = this.picker.visible = false;
            this.blur();
          }
  
          event.stopPropagation();
          return;
        } // if user is typing, do not let picker handle key input
  
  
        if (this.userInput) {
          event.stopPropagation();
          return;
        } // delegate other keys to panel
  
  
        if (this.picker && this.picker.handleKeydown) {
          this.picker.handleKeydown(event);
        }
      },
      handleRangeClick: function () {
        var type = this.type;
  
        if (HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible) {
          this.pickerVisible = true;
        }
  
        this.$emit('focus', this);
      },
      hidePicker: function () {
        if (this.picker) {
          this.picker.resetView && this.picker.resetView();
          this.pickerVisible = this.picker.visible = false;
          this.destroyPopper();
        }
      },
      showPicker: function () {
        var self = this;
        if (this.$isServer) return;
  
        if (!this.picker) {
          this.mountPicker();
        }
  
        this.pickerVisible = this.picker.visible = true;
        this.updatePopper();
        this.picker.value = this.parsedValue;
        this.picker.resetView && this.picker.resetView();
        this.$nextTick(function () {
          self.picker.adjustSpinners && self.picker.adjustSpinners();
        });
      },
      mountPicker: function () {
        var self = this;
  
        this.picker = new Vue(this.panel).$mount();
        this.picker.defaultValue = this.defaultValue;
        this.picker.defaultTime = this.defaultTime;
        this.picker.popperClass = this.popperClass;
        this.popperElm = this.picker.$el;
        this.picker.width = this.reference.getBoundingClientRect().width;
        this.picker.showTime = this.type === 'datetime' || this.type === 'datetimerange';
        this.picker.selectionMode = this.selectionMode;
        this.picker.unlinkPanels = this.unlinkPanels;
        this.picker.arrowControl = this.arrowControl || this.timeArrowControl || false;
        this.$watch('format', function (format) {
          self.picker.format = format;
        });
  
        var updateOptions = function () {
          var options = self.pickerOptions;
  
          if (options && options.selectableRange) {
            var ranges = options.selectableRange;
            var parser = TYPE_VALUE_RESOLVER_MAP.datetimerange.parser;
            var format = DEFAULT_FORMATS.timerange;
            ranges = Array.isArray(ranges) ? ranges : [ranges];
            self.picker.selectableRange = ranges.map(function (range) {
              return parser(range, format, self.rangeSeparator);
            });
          }
  
          for (var option in options) {
            if (options.hasOwnProperty(option) && // 忽略 time-picker 的该配置项
            option !== 'selectableRange') {
              self.picker[option] = options[option];
            }
          } // main format must prevail over undocumented pickerOptions.format
  
  
          if (self.format) {
            self.picker.format = self.format;
          }
        };
  
        updateOptions();
        this.unwatchPickerOptions = this.$watch('pickerOptions', function () {
          return updateOptions();
        }, {
          deep: true
        });
        this.$el.appendChild(this.picker.$el);
        this.picker.resetView && this.picker.resetView();
        this.picker.$on('dodestroy', this.doDestroy);      
        this.picker.$on('pick', function () {
          var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
          var visible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          self.userInput = null;
          self.pickerVisible = self.picker.visible = visible;
  
          self.emitInput(date);
  
          self.picker.resetView && self.picker.resetView();
        });
        this.picker.$on('select-range', function (start, end, pos) {
          if (self.refInput.length === 0) return;
  
          if (!pos || pos === 'min') {
            self.refInput[0].setSelectionRange(start, end);
  
            self.refInput[0].focus();
          } else if (pos === 'max') {
            self.refInput[1].setSelectionRange(start, end);
  
            self.refInput[1].focus();
          }
        });
      },
      unmountPicker: function () {
        if (this.picker) {
          this.picker.$destroy();
          this.picker.$off();
  
          if (typeof this.unwatchPickerOptions === 'function') {
            this.unwatchPickerOptions();
          }
  
          this.picker.$el.parentNode.removeChild(this.picker.$el);
        }
      },
      emitChange: function (val) {
        // determine user real change only
        if (!valueEquals(val, this.valueOnOpen)) {
          this.$emit('change', val);
          this.valueOnOpen = val;
  
          if (this.validateEvent) {
            this.dispatch('VueFormItem', 'vue.form.change', val);
          }
        }
      },
      emitInput: function (val) {
        var formatted = this.formatToValue(val);
        if (!valueEquals(this.value, formatted)) {
          this.$emit('input', formatted);
        }
      },
      isValidValue: function (value) {
        if (!this.picker) {
          this.mountPicker();
        }
  
        if (this.picker.isValidValue) {
          return value && this.picker.isValidValue(value);
        } else {
          return true;
        }
      }
    }
  };
  return VuePicker;
});
