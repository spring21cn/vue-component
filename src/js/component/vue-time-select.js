(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePicker'], definition);
  } else {
    context.VueTimeSelect = definition(context.Vue, context.VuePicker);
    delete context.VueTimeSelect;
  }
})(this, function(Vue, VuePicker) {
  'use strict';
  var TimeSelect = {
    template: '<transition @after-leave="$emit(\'destroyPopper\')"><div v-show="visible" :style="{width: width + \'px\'}" :class="[\'vue-picker-panel time-select\', popperClass]"><div class="vue-picker-panel__content"><div v-for="item in items" :class="[\'time-select-item\', {selected: value === item.value, disabled: item.disabled}]" :disabled="item.disabled" @click="handleClick(item)">{{item.value}}</div></div></div></transition>',
    watch: {
      value: function(val) {
        if (!val) return;
        if (this.minTime && this.compareTime(val, this.minTime) < 0) {
          this.$emit('pick');
        } else if (this.maxTime && this.compareTime(val, this.maxTime) > 0) {
          this.$emit('pick');
        }
      }
    },
    methods: {
      handleClick: function(item) {
        if (!item.disabled) {
          this.$emit('pick', item.value);
        }
      },
      handleClear: function() {
        this.$emit('pick');
      },
      parseTime: function(time) {
        var values = ('' || time).split(':');
        if (values.length >= 2) {
          var hours = parseInt(values[0], 10);
          var minutes = parseInt(values[1], 10);
          return {
            hours: hours,
            minutes: minutes
          };
        }
        return null;
      },
      compareTime: function(time1, time2) {
        var value1 = this.parseTime(time1);
        var value2 = this.parseTime(time2);
        var minutes1 = value1.minutes + value1.hours * 60;
        var minutes2 = value2.minutes + value2.hours * 60;
        if (minutes1 === minutes2) {
          return 0;
        }
        return minutes1 > minutes2 ? 1 : -1;
      },
      nextTime: function(time, step) {
        var timeValue = this.parseTime(time);
        var stepValue = this.parseTime(step);
        var next = {
          hours: timeValue.hours,
          minutes: timeValue.minutes
        };
        next.minutes += stepValue.minutes;
        next.hours += stepValue.hours;
        next.hours += Math.floor(next.minutes / 60);
        next.minutes = next.minutes % 60;
        return (next.hours < 10 ? '0' + next.hours : next.hours) + ':' + (next.minutes < 10 ? '0' + next.minutes : next.minutes);
      }
    },
    data: function() {
      return {
        popperClass: '',
        start: '09:00',
        end: '18:00',
        step: '00:30',
        value: '',
        visible: false,
        minTime: '',
        maxTime: '',
        width: 0
      };
    },
    computed: {
      items: function() {
        var start = this.start;
        var end = this.end;
        var step = this.step;
        var result = [];
        if (start && end && step) {
          var current = start;
          while (this.compareTime(current, end) <= 0) {
            result.push({
              value: current,
              disabled: this.compareTime(current, this.minTime || '-1:-1') <= 0 || this.compareTime(current, this.maxTime || '100:100') >= 0
            });
            current = this.nextTime(current, step);
          }
        }
        return result;
      }
    }
  };
  var VueTimeSelect = {
    mixins: [VuePicker],
    name: 'VueTimeSelect',
    beforeCreate: function() {
      this.type = 'time-select';
      this.panel = TimeSelect;
    }
  };
  Vue.component(VueTimeSelect.name, VueTimeSelect);
});
