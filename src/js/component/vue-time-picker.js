(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePicker', 'VueUtil'], definition);
  } else {
    context.VueTimePicker = definition(context.Vue, context.VuePicker, context.VueUtil);
  }
})(this, function(Vue, VuePicker, VueUtil) {
  'use strict';

  var limitTimeRange = VueUtil.limitTimeRange,
    isDate = VueUtil.isDate,
    clearMilliseconds = VueUtil.clearMilliseconds,
    timeWithinRange = VueUtil.timeWithinRange,
    getRangeHours = VueUtil.getRangeHours,
    getRangeMinutes = VueUtil.getRangeMinutes,
    modifyTime = VueUtil.modifyTime,
    parseDate = VueUtil.parseDate,
    modifyDate = VueUtil.modifyDate;

  var MIN_TIME = parseDate('00:00:00', 'HH:mm:ss');
  var MAX_TIME = parseDate('23:59:59', 'HH:mm:ss');
  
  var minTimeOfDay = function (date) {
    return modifyDate(MIN_TIME, date.getFullYear(), date.getMonth(), date.getDate());
  };
  
  var maxTimeOfDay = function (date) {
    return modifyDate(MAX_TIME, date.getFullYear(), date.getMonth(), date.getDate());
  };
  
  var advanceTime = function (date, amount) {
    return new Date(Math.min(date.getTime() + amount, maxTimeOfDay(date).getTime()));
  };

  var TimeSpinner = {
    template: 
    //'  <div>    <div class="vue-aside__wrapper" v-if="isMobile()"></div>'+
   // ' <div style="position: fixed;width: 100%;background-color: #ffffff;bottom: 0;"> '+
    '  <div class="vue-time-spinner" :class="{ \'has-seconds\': showSeconds }">'+
    '    <template v-if="!arrowControl">'+
    '      <vue-scrollbar'+
    '        @mouseenter.native="emitSelectRange(\'hours\')"'+
    '        @mousemove.native="adjustCurrentSpinner(\'hours\')"'+
    '        class="vue-time-spinner__wrapper"'+
    '        wrap-style="max-height: inherit;"'+
    '        view-class="vue-time-spinner__list"'+
    '        noresize'+
    '        tag="ul"'+
    '        ref="hours">'+
    '        <li'+
    '          @click="handleClick(\'hours\', { value: hour, disabled: disabled })"'+
    '          v-for="(disabled, hour) in hoursList"'+
    '          class="vue-time-spinner__item"'+
    '          :key="hour"'+
    '          :class="{ \'active\': hour === hours, \'disabled\': disabled }">{{ (\'0\' + (amPmMode ? (hour % 12 || 12) : hour )).slice(-2) }}{{ amPm(hour) }}</li>'+
    '      </vue-scrollbar>'+
    '      <vue-scrollbar'+
    '        @mouseenter.native="emitSelectRange(\'minutes\')"'+
    '        @mousemove.native="adjustCurrentSpinner(\'minutes\')"'+
    '        class="vue-time-spinner__wrapper"'+
    '        wrap-style="max-height: inherit;"'+
    '        view-class="vue-time-spinner__list"'+
    '        noresize'+
    '        tag="ul"'+
    '        ref="minutes">'+
    '        <li'+
    '          @click="handleClick(\'minutes\', { value: key, disabled: false })"'+
    '          v-for="(enabled, key) in minutesList"'+
    '          :key="key"'+
    '          class="vue-time-spinner__item"'+
    '          :class="{ \'active\': key === minutes, disabled: !enabled }">{{ (\'0\' + key).slice(-2) }}</li>'+
    '      </vue-scrollbar>'+
    '      <vue-scrollbar'+
    '        v-show="showSeconds"'+
    '        @mouseenter.native="emitSelectRange(\'seconds\')"'+
    '        @mousemove.native="adjustCurrentSpinner(\'seconds\')"'+
    '        class="vue-time-spinner__wrapper"'+
    '        wrap-style="max-height: inherit;"'+
    '        view-class="vue-time-spinner__list"'+
    '        noresize'+
    '        tag="ul"'+
    '        ref="seconds">'+
    '        <li'+
    '          @click="handleClick(\'seconds\', { value: key, disabled: false })"'+
    '          v-for="(second, key) in 60"'+
    '          class="vue-time-spinner__item"'+
    '          :class="{ \'active\': key === seconds }"'+
    '          :key="key">{{ (\'0\' + key).slice(-2) }}</li>'+
    '      </vue-scrollbar>'+
    '    </template>'+
    '    <template v-if="arrowControl">'+
    '      <div'+
    '        @mouseenter="emitSelectRange(\'hours\')"'+
    '        class="vue-time-spinner__wrapper is-arrow">'+
    '        <i v-repeat-click="decrease" class="vue-time-spinner__arrow vue-icon-arrow-up"></i>'+
    '        <i v-repeat-click="increase" class="vue-time-spinner__arrow vue-icon-arrow-down"></i>'+
    '        <ul class="vue-time-spinner__list" ref="hours">'+
    '          <li'+
    '            class="vue-time-spinner__item"'+
    '            :class="{ \'active\': hour === hours, \'disabled\': hoursList[hour] }"'+
    '            v-for="(hour, key) in arrowHourList"'+
    '            :key="key">{{ hour === undefined ? \'\' : (\'0\' + (amPmMode ? (hour % 12 || 12) : hour )).slice(-2) + amPm(hour) }}</li>'+
    '        </ul>'+
    '      </div>'+
    '      <div'+
    '        @mouseenter="emitSelectRange(\'minutes\')"'+
    '        class="vue-time-spinner__wrapper is-arrow">'+
    '        <i v-repeat-click="decrease" class="vue-time-spinner__arrow vue-icon-arrow-up"></i>'+
    '        <i v-repeat-click="increase" class="vue-time-spinner__arrow vue-icon-arrow-down"></i>'+
    '        <ul class="vue-time-spinner__list" ref="minutes">'+
    '          <li'+
    '            class="vue-time-spinner__item"'+
    '            :class="{ \'active\': minute === minutes }"'+
    '            v-for="(minute, key) in arrowMinuteList"'+
    '            :key="key">'+
    '            {{ minute === undefined ? \'\' : (\'0\' + minute).slice(-2) }}'+
    '          </li>'+
    '        </ul>'+
    '      </div>'+
    '      <div'+
    '        @mouseenter="emitSelectRange(\'seconds\')"'+
    '        class="vue-time-spinner__wrapper is-arrow"'+
    '        v-if="showSeconds">'+
    '        <i v-repeat-click="decrease" class="vue-time-spinner__arrow vue-icon-arrow-up"></i>'+
    '        <i v-repeat-click="increase" class="vue-time-spinner__arrow vue-icon-arrow-down"></i>'+
    '        <ul class="vue-time-spinner__list" ref="seconds">'+
    '          <li'+
    '            v-for="(second, key) in arrowSecondList"'+
    '            class="vue-time-spinner__item"'+
    '            :class="{ \'active\': second === seconds }"'+
    '            :key="key">'+
    '            {{ second === undefined ? \'\' : (\'0\' + second).slice(-2) }}'+
    '          </li>'+
    '        </ul>'+
    '      </div>'+
    '    </template>'+
   // '  </div>'+
    '  </div>',
    directives: {
      repeatClick: VueUtil.component.repeatClick
    },
    props: {
      date: {},
      defaultValue: {},
      // reserved for future use
      showSeconds: {
        type: Boolean,
        default: true
      },
      arrowControl: Boolean,
      amPmMode: {
        type: String,
        default: '' // 'a': am/pm; 'A': AM/PM
  
      }
    },
    computed: {
      hours: function () {
        return this.date.getHours();
      },
      minutes: function () {
        return this.date.getMinutes();
      },
      seconds: function () {
        return this.date.getSeconds();
      },
      hoursList: function () {
        return getRangeHours(this.selectableRange);
      },
      minutesList: function () {
        return getRangeMinutes(this.selectableRange, this.hours);
      },
      arrowHourList: function () {
        var hours = this.hours;
        return [hours > 0 ? hours - 1 : undefined, hours, hours < 23 ? hours + 1 : undefined];
      },
      arrowMinuteList: function () {
        var minutes = this.minutes;
        return [minutes > 0 ? minutes - 1 : undefined, minutes, minutes < 59 ? minutes + 1 : undefined];
      },
      arrowSecondList: function () {
        var seconds = this.seconds;
        return [seconds > 0 ? seconds - 1 : undefined, seconds, seconds < 59 ? seconds + 1 : undefined];
      }
    },
    data: function () {
      return {
        selectableRange: [],
        currentScrollbar: null
      };
    },
    mounted: function () {
      var self = this;
  
      this.$nextTick(function () {
        !self.arrowControl && self.bindScrollEvent();
      });
    },
    methods: {
      
      increase: function () {
        this.scrollDown(1);
      },
      decrease: function () {
        this.scrollDown(-1);
      },
      modifyDateField: function (type, value) {
        switch (type) {
          case 'hours':
            this.$emit('change', modifyTime(this.date, value, this.minutes, this.seconds));
            break;
  
          case 'minutes':
            this.$emit('change', modifyTime(this.date, this.hours, value, this.seconds));
            break;
  
          case 'seconds':
            this.$emit('change', modifyTime(this.date, this.hours, this.minutes, value));
            break;
        }
      },
      handleClick: function (type, _ref) {
        var value = _ref.value,
            disabled = _ref.disabled;
  
        if (!disabled) {
          this.modifyDateField(type, value);
          this.emitSelectRange(type);
          this.adjustSpinner(type, value);
        }
      },
      emitSelectRange: function (type) {
        if (type === 'hours') {
          this.$emit('select-range', 0, 2);
        } else if (type === 'minutes') {
          this.$emit('select-range', 3, 5);
        } else if (type === 'seconds') {
          this.$emit('select-range', 6, 8);
        }
  
        this.currentScrollbar = type;
      },
      bindScrollEvent: function () {
        var self = this;
  
        var bindFuntion = function (type) {
          if(self.$refs[type]){
            self.$refs[type].wrap.onscroll = function (e) {
              self.handleScroll(type, e);
            };
          }
         
        };
  
        bindFuntion('hours');
        bindFuntion('minutes');
        bindFuntion('seconds');
      },
      handleScroll: function (type) {
        var value = Math.min(Math.floor((this.$refs[type].wrap.scrollTop - (this.scrollBarHeight(type) * 0.5 - 10) / this.typeItemHeight(type) + 3) / this.typeItemHeight(type)), type === 'hours' ? 23 : 59);
        this.modifyDateField(type, value);
      },
      // NOTE: used by datetime / date-range panel
      //       renamed from adjustScrollTop
      //       should try to refactory it
      adjustSpinners: function () {
        this.adjustSpinner('hours', this.hours);
        this.adjustSpinner('minutes', this.minutes);
        this.adjustSpinner('seconds', this.seconds);
      },
      adjustCurrentSpinner: function (type) {
        this.adjustSpinner(type, this[type]);
      },
      adjustSpinner: function (type, value) {
        if (this.arrowControl) return;
        var el = this.$refs[type].wrap;
  
        if (el) {
          el.scrollTop = Math.max(0, value * this.typeItemHeight(type));
        }
      },
      scrollDown: function (step) {
        if (!this.currentScrollbar) {
          this.emitSelectRange('hours');
        }
  
        var label = this.currentScrollbar;
        var hoursList = this.hoursList;
        var now = this[label];
  
        if (this.currentScrollbar === 'hours') {
          var total = Math.abs(step);
          step = step > 0 ? 1 : -1;
          var length = hoursList.length;
  
          while (length-- && total) {
            now = (now + step + hoursList.length) % hoursList.length;
  
            if (hoursList[now]) {
              continue;
            }
  
            total--;
          }
  
          if (hoursList[now]) return;
        } else {
          now = (now + step + 60) % 60;
        }
  
        this.modifyDateField(label, now);
        this.adjustSpinner(label, now);
      },
      amPm: function (hour) {
        var shouldShowAmPm = this.amPmMode.toLowerCase() === 'a';
        if (!shouldShowAmPm) return '';
        var isCapital = this.amPmMode === 'A';
        var content = hour < 12 ? ' am' : ' pm';
        if (isCapital) content = content.toUpperCase();
        return content;
      },
      typeItemHeight: function (type) {
        return this.$refs[type].$el.querySelector('li').offsetHeight;
      },
      scrollBarHeight: function (type) {
        return this.$refs[type].$el.offsetHeight;
      }
    }

  };
  var TimePanel = {
    template: '  <transition name="vue-zoom-in-top" @after-leave="$emit(\'destroyPopper\')">'+
    '     <div v-if="!isMobile()&&visible" '+
    '      v-show="visible"'+
    '      class="vue-time-panel vue-popper"'+
    '      :class="popperClass">'+
    '      <div class="vue-time-panel__content" :class="{ \'has-seconds\': showSeconds }">'+
    '        <time-spinner'+
    '          ref="spinner"'+
    '          @change="handleChange"'+
    '          :arrow-control="useArrow"'+
    '          :show-seconds="showSeconds"'+
    '          :am-pm-mode="amPmMode"'+
    '          @select-range="setSelectionRange"'+
    '          :date="date">'+
    '        </time-spinner>'+
    '      </div>'+
    '      <div class="vue-time-panel__footer">'+
    '        <button'+
    '          type="button"'+
    '          class="vue-time-panel__btn cancel"'+
    '          @click="handleCancel">{{ $t(\'vue.datepicker.cancel\') }}</button>'+
    '        <button'+
    '          type="button"'+
    '          class="vue-time-panel__btn"'+
    '          :class="{confirm: !disabled}"'+
    '          @click="handleConfirm()">{{ $t(\'vue.datepicker.confirm\') }}</button>'+
    '      </div>'+
    '    </div>'+




    '   <div v-else tabindex="-1" ref="timePanelDiv" style="width:100%;outline:none;" >'+

    '     <div style="z-index:1000;" v-if="isMobile()&&visible"  class="vue-aside__wrapper" ></div>'+
    '     <div'+
    '      v-show="visible"'+
    '      class="vue-time-panel vue-popper"'+
    '      :class="popperClass">'+
    '      <div class="vue-time-panel__content" :class="{ \'has-seconds\': showSeconds }">'+
    '        <time-spinner'+
    '          ref="spinner"'+
    '          @change="handleChange"'+
    '          :arrow-control="useArrow"'+
    '          :show-seconds="showSeconds"'+
    '          :am-pm-mode="amPmMode"'+
    '          @select-range="setSelectionRange"'+
    '          :date="date">'+
    '        </time-spinner>'+
    '      </div>'+
    '      <div class="vue-time-panel__footer">'+
    '        <button'+
    '          type="button"'+
    '          class="vue-time-panel__btn cancel"'+
    '          @click="handleCancel">{{ $t(\'vue.datepicker.cancel\') }}</button>'+
    '        <button'+
    '          type="button"'+
    '          class="vue-time-panel__btn"'+
    '          :class="{confirm: !disabled}"'+
    '          @click="handleConfirm()">{{ $t(\'vue.datepicker.confirm\') }}</button>'+
    '      </div>'+
    '    </div>'+
    

    '  </div> '+
    
    '  </transition>',

    components: {
      TimeSpinner: TimeSpinner
    },
    props: {
      visible: Boolean,
      timeArrowControl: Boolean
    },
    watch: {
      visible: function (val) {
        var self = this;
        
        if (val) {
          this.oldValue = this.value;
          this.$nextTick(function () {
           
             var rt = self.$refs.spinner.emitSelectRange('hours');

             if(self.$refs.timePanelDiv){
              self.$refs.timePanelDiv.focus();
             }
             return rt;
                        
          });
        } else {
          this.needInitAdjust = true;
        }
      },
      value: function (newVal) {
        var self = this;
  
        var date;
  
        if (newVal instanceof Date) {
          date = limitTimeRange(newVal, this.selectableRange, this.format);
        } else if (!newVal) {
          date = this.defaultValue ? new Date(this.defaultValue) : new Date();
        }
  
        this.date = date;
  
        if (this.visible && this.needInitAdjust) {
          this.$nextTick(function (_) {
            return self.adjustSpinners();
          });
          this.needInitAdjust = false;
        }
      },
      selectableRange: function (val) {
        this.$refs.spinner.selectableRange = val;
      },
      defaultValue: function (val) {
        if (!isDate(this.value)) {
          this.date = val ? new Date(val) : new Date();
        }
      }
    },
    data: function () {
      return {
        popperClass: '',
        format: 'HH:mm:ss',
        value: '',
        defaultValue: null,
        date: new Date(),
        oldValue: new Date(),
        selectableRange: [],
        selectionRange: [0, 2],
        disabled: false,
        arrowControl: false,
        needInitAdjust: true
      };
    },
    computed: {
      showSeconds: function () {
        return (this.format || '').indexOf('ss') !== -1;
      },
      useArrow: function () {
        return this.arrowControl || this.timeArrowControl || false;
      },
      amPmMode: function () {
        if ((this.format || '').indexOf('A') !== -1) return 'A';
        if ((this.format || '').indexOf('a') !== -1) return 'a';
        return '';
      }
    },
    methods: {
      isMobile:function() {
        return VueUtil.getSystemInfo().device == 'Mobile';
      },
      handleCancel: function () {
        this.$emit('pick', this.oldValue, false);
      },
      handleChange: function (date) {
        // this.visible avoids edge cases, when use scrolls during panel closing animation
        if (this.visible) {
          this.date = clearMilliseconds(date); // if date is out of range, do not emit
          if (this.isValidValue(this.date)) {
            this.$emit('pick', this.date, true);
          }
        }
      },
      setSelectionRange: function (start, end) {
        this.$emit('select-range', start, end);
        this.selectionRange = [start, end];
      },
      handleConfirm: function () {
        var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var first = arguments.length > 1 ? arguments[1] : undefined;
        if (first) return;
        var date = clearMilliseconds(limitTimeRange(this.date, this.selectableRange, this.format));
        this.$emit('pick', date, visible, first);
      },
      handleKeydown: function (event) {
        var keyCode = event.keyCode;
        var mapping = {
          38: -1,
          40: 1,
          37: -1,
          39: 1
        }; // Left or Right
  
        if (keyCode === 37 || keyCode === 39) {
          var step = mapping[keyCode];
          this.changeSelectionRange(step);
          event.preventDefault();
          return;
        } // Up or Down
  
  
        if (keyCode === 38 || keyCode === 40) {
          var _step = mapping[keyCode];
          this.$refs.spinner.scrollDown(_step);
          event.preventDefault();
          return;
        }
      },
      isValidValue: function (date) {
        return timeWithinRange(date, this.selectableRange, this.format);
      },
      adjustSpinners: function () {
        return this.$refs.spinner.adjustSpinners();
      },
      changeSelectionRange: function (step) {
        var list = [0, 3].concat(this.showSeconds ? [6] : []);
        var mapping = ['hours', 'minutes'].concat(this.showSeconds ? ['seconds'] : []);
        var index = list.indexOf(this.selectionRange[0]);
        var next = (index + step + list.length) % list.length;
        this.$refs.spinner.emitSelectRange(mapping[next]);
      }
    },
    mounted: function () {
      var self = this;
  
      this.$nextTick(function () {
        return self.handleConfirm(true, true);
      });
      this.$emit('mounted');
    }
  };
  var TimeRangePanel = {
    template: '  <transition'+
    '    name="vue-zoom-in-top"'+
    '    @after-leave="$emit(\'destroyPopper\')">'+
    '    <div'+
    '      v-show="visible"'+
    '      class="vue-time-range-picker vue-picker-panel vue-popper"'+
    '      :class="popperClass">'+
    '      <div class="vue-time-range-picker__content">'+
    '        <div class="vue-time-range-picker__cell">'+
    '          <div class="vue-time-range-picker__header">{{ $t(\'vue.datepicker.startTime\') }}</div>'+
    '          <div'+
    '            :class="{ \'has-seconds\': showSeconds, \'is-arrow\': arrowControl }"'+
    '            class="vue-time-range-picker__body vue-time-panel__content">'+
    '            <time-spinner'+
    '              ref="minSpinner"'+
    '              :show-seconds="showSeconds"'+
    '              :am-pm-mode="amPmMode"'+
    '              @change="handleMinChange"'+
    '              :arrow-control="arrowControl"'+
    '              @select-range="setMinSelectionRange"'+
    '              :date="minDate">'+
    '            </time-spinner>'+
    '          </div>'+
    '        </div>'+
    '        <div class="vue-time-range-picker__cell">'+
    '          <div class="vue-time-range-picker__header">{{ $t(\'vue.datepicker.endTime\') }}</div>'+
    '          <div'+
    '            :class="{ \'has-seconds\': showSeconds, \'is-arrow\': arrowControl }"'+
    '            class="vue-time-range-picker__body vue-time-panel__content">'+
    '            <time-spinner'+
    '              ref="maxSpinner"'+
    '              :show-seconds="showSeconds"'+
    '              :am-pm-mode="amPmMode"'+
    '              @change="handleMaxChange"'+
    '              :arrow-control="arrowControl"'+
    '              @select-range="setMaxSelectionRange"'+
    '              :date="maxDate">'+
    '            </time-spinner>'+
    '          </div>'+
    '        </div>'+
    '      </div>'+
    '      <div class="vue-time-panel__footer">'+
    '        <button'+
    '          type="button"'+
    '          class="vue-time-panel__btn cancel"'+
    '          @click="handleCancel()">{{ $t(\'vue.datepicker.cancel\') }}</button>'+
    '        <button'+
    '          type="button"'+
    '          class="vue-time-panel__btn confirm"'+
    '          @click="handleConfirm()"'+
    '          :disabled="btnDisabled">{{ $t(\'vue.datepicker.confirm\') }}</button>'+
    '      </div>'+
    '    </div>'+
    '  </transition>',
    components: {
      TimeSpinner: TimeSpinner
    },
  
    computed: {
      showSeconds: function () {
        return (this.format || '').indexOf('ss') !== -1;
      },
      offset: function () {
        return this.showSeconds ? 11 : 8;
      },
      spinner: function () {
        return this.selectionRange[0] < this.offset ? this.$refs.minSpinner : this.$refs.maxSpinner;
      },
      btnDisabled: function () {
        return this.minDate.getTime() > this.maxDate.getTime();
      },
      amPmMode: function () {
        if ((this.format || '').indexOf('A') !== -1) return 'A';
        if ((this.format || '').indexOf('a') !== -1) return 'a';
        return '';
      }
    },
    data: function () {
      return {
        popperClass: '',
        minDate: new Date(),
        maxDate: new Date(),
        value: [],
        oldValue: [new Date(), new Date()],
        defaultValue: null,
        format: 'HH:mm:ss',
        visible: false,
        selectionRange: [0, 2],
        arrowControl: false
      };
    },
    watch: {
      value: function (_value) {
        if (Array.isArray(_value)) {
          this.minDate = new Date(_value[0]);
          this.maxDate = new Date(_value[1]);
        } else {
          if (Array.isArray(this.defaultValue)) {
            this.minDate = new Date(this.defaultValue[0]);
            this.maxDate = new Date(this.defaultValue[1]);
          } else if (this.defaultValue) {
            this.minDate = new Date(this.defaultValue);
            this.maxDate = advanceTime(new Date(this.defaultValue), 60 * 60 * 1000);
          } else {
            this.minDate = new Date();
            this.maxDate = advanceTime(new Date(), 60 * 60 * 1000);
          }
        }
      },
      visible: function (val) {
        var self = this;
  
        if (val) {
          this.oldValue = this.value;
          this.$nextTick(function () {
            return self.$refs.minSpinner.emitSelectRange('hours');
          });
        }
      }
    },
    methods: {
      handleClear: function () {
        this.$emit('pick', null);
      },
      handleCancel: function () {
        this.$emit('pick', this.oldValue);
      },
      handleMinChange: function (date) {
        this.minDate = clearMilliseconds(date);
        this.handleChange();
      },
      handleMaxChange: function (date) {
        this.maxDate = clearMilliseconds(date);
        this.handleChange();
      },
      handleChange: function () {
        if (this.isValidValue([this.minDate, this.maxDate])) {
          this.$refs.minSpinner.selectableRange = [[minTimeOfDay(this.minDate), this.maxDate]];
          this.$refs.maxSpinner.selectableRange = [[this.minDate, maxTimeOfDay(this.maxDate)]];
          this.$emit('pick', [this.minDate, this.maxDate], true);
        }
      },
      setMinSelectionRange: function (start, end) {
        this.$emit('select-range', start, end, 'min');
        this.selectionRange = [start, end];
      },
      setMaxSelectionRange: function (start, end) {
        this.$emit('select-range', start, end, 'max');
        this.selectionRange = [start + this.offset, end + this.offset];
      },
      handleConfirm: function () {
        var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var minSelectableRange = this.$refs.minSpinner.selectableRange;
        var maxSelectableRange = this.$refs.maxSpinner.selectableRange;
        this.minDate = limitTimeRange(this.minDate, minSelectableRange, this.format);
        this.maxDate = limitTimeRange(this.maxDate, maxSelectableRange, this.format);
        this.$emit('pick', [this.minDate, this.maxDate], visible);
      },
      adjustSpinners: function () {
        this.$refs.minSpinner.adjustSpinners();
        this.$refs.maxSpinner.adjustSpinners();
      },
      changeSelectionRange: function (step) {
        var list = this.showSeconds ? [0, 3, 6, 11, 14, 17] : [0, 3, 8, 11];
        var mapping = ['hours', 'minutes'].concat(this.showSeconds ? ['seconds'] : []);
        var index = list.indexOf(this.selectionRange[0]);
        var next = (index + step + list.length) % list.length;
        var half = list.length / 2;
  
        if (next < half) {
          this.$refs.minSpinner.emitSelectRange(mapping[next]);
        } else {
          this.$refs.maxSpinner.emitSelectRange(mapping[next - half]);
        }
      },
      isValidValue: function (date) {
        return Array.isArray(date) && timeWithinRange(this.minDate, this.$refs.minSpinner.selectableRange) && timeWithinRange(this.maxDate, this.$refs.maxSpinner.selectableRange);
      },
      handleKeydown: function (event) {
        var keyCode = event.keyCode;
        var mapping = {
          38: -1,
          40: 1,
          37: -1,
          39: 1
        }; // Left or Right
  
        if (keyCode === 37 || keyCode === 39) {
          var step = mapping[keyCode];
          this.changeSelectionRange(step);
          event.preventDefault();
          return;
        } // Up or Down
  
  
        if (keyCode === 38 || keyCode === 40) {
          var _step = mapping[keyCode];
          this.spinner.scrollDown(_step);
          event.preventDefault();
          return;
        }
      }
    }
  };
  var VueTimePicker = {
    mixins: [VuePicker],
    name: 'VueTimePicker',
    props: {
      isRange: Boolean,
      arrowControl: Boolean
    },
    data: function () {
      return {
        type: ''
      };
    },
    watch: {
      isRange: function (_isRange) {
        if (this.picker) {
          this.unmountPicker();
          this.type = _isRange ? 'timerange' : 'time';
          this.panel = _isRange ? TimeRangePanel : TimePanel;
          this.mountPicker();
        } else {
          this.type = _isRange ? 'timerange' : 'time';
          this.panel = _isRange ? TimeRangePanel : TimePanel;
        }
      }
    },
    created: function () {
      this.type = this.isRange ? 'timerange' : 'time';
      this.panel = this.isRange ? TimeRangePanel : TimePanel;
    }
  };
  Vue.component(VueTimePicker.name, VueTimePicker);
  return TimePanel;
});
