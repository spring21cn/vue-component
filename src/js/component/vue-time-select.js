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
  
  var parseTime = function (time) {
    var values = (time || '').split(':');
  
    if (values.length >= 2) {
      var hours = parseInt(values[0], 10);
      var minutes = parseInt(values[1], 10);
      return {
        hours: hours,
        minutes: minutes
      };
    }
    /* istanbul ignore next */
    return null;
  };
  
  var compareTime = function (time1, time2) {
    var value1 = parseTime(time1);
    var value2 = parseTime(time2);
    var minutes1 = value1.minutes + value1.hours * 60;
    var minutes2 = value2.minutes + value2.hours * 60;
  
    if (minutes1 === minutes2) {
      return 0;
    }
  
    return minutes1 > minutes2 ? 1 : -1;
  };
  
  var formatTime = function (time) {
    return (time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes);
  };
  
  var nextTime = function (time, step) {
    var timeValue = parseTime(time);
    var stepValue = parseTime(step);
    var next = {
      hours: timeValue.hours,
      minutes: timeValue.minutes
    };
    next.minutes += stepValue.minutes;
    next.hours += stepValue.hours;
    next.hours += Math.floor(next.minutes / 60);
    next.minutes = next.minutes % 60;
    return formatTime(next);
  };
  
  function scrollIntoView(container, selected) {
    if (Vue.prototype.$isServer) return;
  
    if (!selected) {
      container.scrollTop = 0;
      return;
    }
  
    var offsetParents = [];
    var pointer = selected.offsetParent;
  
    while (pointer && container !== pointer && container.contains(pointer)) {
      offsetParents.push(pointer);
      pointer = pointer.offsetParent;
    }
  
    var top = selected.offsetTop + offsetParents.reduce(function (prev, curr) {
      return prev + curr.offsetTop;
    }, 0);
    var bottom = top + selected.offsetHeight;
    var viewRectTop = container.scrollTop;
    var viewRectBottom = viewRectTop + container.clientHeight;
  
    if (top < viewRectTop) {
      container.scrollTop = top;
    } else if (bottom > viewRectBottom) {
      container.scrollTop = bottom - container.clientHeight;
    }
  }

  var TimeSelect = {
    template: '  <transition name="vue-zoom-in-top" @before-enter="handleMenuEnter" @after-leave="$emit(\'destroyPopper\')">'+
    '    <div'+
    '      ref="popper"'+
    '      v-show="visible"'+
    '      :style="{ width: width + \'px\' }"'+
    '      :class="popperClass"'+
    '      class="vue-picker-panel time-select vue-popper">'+
    '      <vue-scrollbar noresize wrap-class="vue-picker-panel__content">'+
    '        <div class="time-select-item"'+
    '          v-for="item in items"'+
    '          :class="{ selected: value === item.value, disabled: item.disabled, default: item.value === defaultValue }"'+
    '          :disabled="item.disabled"'+
    '          :key="item.value"'+
    '          @click="handleClick(item)">{{ item.value }}</div>'+
    '      </vue-scrollbar>'+
    '    </div>'+
    '  </transition>',
    watch: {
      value: function (val) {
        var self = this;
  
        if (!val) return;
        this.$nextTick(function () {
          return self.scrollToOption();
        });
      }
    },
    methods: {
      handleClick: function (item) {
        if (!item.disabled) {
          this.$emit('pick', item.value);
        }
      },
      handleClear: function () {
        this.$emit('pick', null);
      },
      scrollToOption: function () {
        var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.selected';
        var menu = this.$refs.popper.querySelector('.vue-picker-panel__content');
        scrollIntoView(menu, menu.querySelector(selector));
      },
      handleMenuEnter: function () {
        var self = this;
  
        var selected = this.items.map(function (item) {
          return item.value;
        }).indexOf(this.value) !== -1;
        var hasDefault = this.items.map(function (item) {
          return item.value;
        }).indexOf(this.defaultValue) !== -1;
        var option = selected && '.selected' || hasDefault && '.default' || '.time-select-item:not(.disabled)';
        this.$nextTick(function () {
          return self.scrollToOption(option);
        });
      },
      scrollDown: function (step) {
        var items = this.items;
        var length = items.length;
        var total = items.length;
        var index = items.map(function (item) {
          return item.value;
        }).indexOf(this.value);
  
        while (total--) {
          index = (index + step + length) % length;
  
          if (!items[index].disabled) {
            this.$emit('pick', items[index].value, true);
            return;
          }
        }
      },
      isValidValue: function (date) {
        return this.items.filter(function (item) {
          return !item.disabled;
        }).map(function (item) {
          return item.value;
        }).indexOf(date) !== -1;
      },
      handleKeydown: function (event) {
        var keyCode = event.keyCode;
  
        if (keyCode === 38 || keyCode === 40) {
          var mapping = {
            40: 1,
            38: -1
          };
          var offset = mapping[keyCode.toString()];
          this.scrollDown(offset);
          event.stopPropagation();
          return;
        }
      }
    },
    data: function () {
      return {
        popperClass: '',
        start: '09:00',
        end: '18:00',
        step: '00:30',
        value: '',
        defaultValue: '',
        visible: false,
        minTime: '',
        maxTime: '',
        width: 0
      };
    },
    computed: {
      items: function () {
        var start = this.start;
        var end = this.end;
        var step = this.step;
        var result = [];
  
        if (start && end && step) {
          var current = start;
  
          while (compareTime(current, end) <= 0) {
            result.push({
              value: current,
              disabled: compareTime(current, this.minTime || '-1:-1') <= 0 || compareTime(current, this.maxTime || '100:100') >= 0
            });
            current = nextTime(current, step);
          }
        }
  
        return result;
      }
    }
  };
  var VueTimeSelect = {
    mixins: [VuePicker],
    name: 'VueTimeSelect',
    props: {
      type: {
        type: String,
        default: 'time-select'
      }
    },
    beforeCreate: function() {
      this.panel = TimeSelect;
    }
  };
  Vue.component(VueTimeSelect.name, VueTimeSelect);
});
