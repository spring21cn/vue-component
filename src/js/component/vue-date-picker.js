(function(context, definition) {
  'use strict';
  
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePicker', 'VueUtil', 'VueTimePicker'], definition);
  } else {
    context.VueDatePicker = definition(context.Vue, context.VuePicker, context.VueUtil, context.VueTimePicker);
    delete context.VueTimePicker;
  }
})(this, function(Vue, VuePicker, VueUtil, VueTimePicker) {
  'use strict';

  var _util = VueUtil,
  getFirstDayOfMonth = _util.getFirstDayOfMonth,
  getDayCountOfMonth = _util.getDayCountOfMonth,
  getWeekNumber = _util.getWeekNumber,
  getStartDateOfMonth = _util.getStartDateOfMonth,
  prevDate = _util.prevDate,
  nextDate = _util.nextDate,
  isDate = _util.isDate,
  clearTime = _util.clearTime,
  arrayFindIndex = _util.arrayFindIndex,
  arrayFind = _util.arrayFind,
  coerceTruthyValueToArray = _util.coerceTruthyValueToArray,
  getDayCountOfYear = _util.getDayCountOfYear,
  range = _util.range,
  hasClass = _util.hasClass,
  formatDate = _util.formatDate,
  parseDate = _util.parseDate,
  modifyDate = _util.modifyDate,
  modifyTime = _util.modifyTime,
  modifyWithTimeString = _util.modifyWithTimeString,
  clearMilliseconds = _util.clearMilliseconds,
  prevYear = _util.prevYear,
  nextYear = _util.nextYear,
  prevMonth = _util.prevMonth,
  nextMonth = _util.nextMonth,
  changeYearMonthAndClampDate = _util.changeYearMonthAndClampDate,
  extractDateFormat = _util.extractDateFormat,
  extractTimeFormat = _util.extractTimeFormat,
  timeWithinRange = _util.timeWithinRange;
    
  var datesInYear = function (year) {
    var numOfDays = getDayCountOfYear(year);
    var firstDay = new Date(year, 0, 1);
    return range(numOfDays).map(function (n) {
      return nextDate(firstDay, n);
    });
  };
  var datesInMonth = function (year, month) {
    var numOfDays = getDayCountOfMonth(year, month);
    var firstDay = new Date(year, month, 1);
    return range(numOfDays).map(function (n) {
      return nextDate(firstDay, n);
    });
  };

  var clearDate = function (date) {
    return new Date(date.getFullYear(), date.getMonth());
  };

  var getMonthTimestamp = function (time) {
    if (typeof time === 'number' || typeof time === 'string') {
      return clearDate(new Date(time)).getTime();
    } else if (time instanceof Date) {
      return clearDate(time).getTime();
    } else {
      return NaN;
    }
  };
  var WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var getDateTimestamp = function (time) {
    if (typeof time === 'number' || typeof time === 'string') {
      return clearTime(new Date(time)).getTime();
    } else if (time instanceof Date) {
      return clearTime(time).getTime();
    } else {
      return NaN;
    }
  };
  var removeFromArray = function (arr, pred) {
    var idx = typeof pred === 'function' ? arrayFindIndex(arr, pred) : arr.indexOf(pred);
    return idx >= 0 ? [].concat(arr.slice(0, idx), arr.slice(idx + 1)) : arr;
  };

  var calcDefaultValue = function (defaultValue) {
    if (Array.isArray(defaultValue)) {
      return [new Date(defaultValue[0]), new Date(defaultValue[1])];
    } else if (defaultValue) {
      return [new Date(defaultValue), nextDate(new Date(defaultValue), 1)];
    } else {
      return [new Date(), nextDate(new Date(), 1)];
    }
  };
  var YearTable = {
    template: 
    '  <table @click="handleYearTableClick" class="vue-year-table">'+
    '    <tbody>'+
    '    <tr>'+
    '      <td class="available" :class="getCellStyle(startYear + 0)">'+
    '        <a class="cell">{{ startYear }}</a>'+
    '      </td>'+
    '      <td class="available" :class="getCellStyle(startYear + 1)">'+
    '        <a class="cell">{{ startYear + 1 }}</a>'+
    '      </td>'+
    '      <td class="available" :class="getCellStyle(startYear + 2)">'+
    '        <a class="cell">{{ startYear + 2 }}</a>'+
    '      </td>'+
    '      <td class="available" :class="getCellStyle(startYear + 3)">'+
    '        <a class="cell">{{ startYear + 3 }}</a>'+
    '      </td>'+
    '    </tr>'+
    '    <tr>'+
    '      <td class="available" :class="getCellStyle(startYear + 4)">'+
    '        <a class="cell">{{ startYear + 4 }}</a>'+
    '      </td>'+
    '      <td class="available" :class="getCellStyle(startYear + 5)">'+
    '        <a class="cell">{{ startYear + 5 }}</a>'+
    '      </td>'+
    '      <td class="available" :class="getCellStyle(startYear + 6)">'+
    '        <a class="cell">{{ startYear + 6 }}</a>'+
    '      </td>'+
    '      <td class="available" :class="getCellStyle(startYear + 7)">'+
    '        <a class="cell">{{ startYear + 7 }}</a>'+
    '      </td>'+
    '    </tr>'+
    '    <tr>'+
    '      <td class="available" :class="getCellStyle(startYear + 8)">'+
    '        <a class="cell">{{ startYear + 8 }}</a>'+
    '      </td>'+
    '      <td class="available" :class="getCellStyle(startYear + 9)">'+
    '        <a class="cell">{{ startYear + 9 }}</a>'+
    '      </td>'+
    '      <td></td>'+
    '      <td></td>'+
    '    </tr>'+
    '    </tbody>'+
    '  </table>',
    props: {
      disabledDate: {},
      value: {},
      defaultValue:  {
        validator: function(val) {
          return val === null || (val instanceof Date && isDate(val));
        }
      },
      date: {
        default: function() {
          return new Date();
        }
      }
    },
    computed: {
      startYear: function() {
        return Math.floor(this.date.getFullYear() / 10) * 10;
      }
    },
    methods: {
      getCellStyle: function (year) {
        var style = {};
        var today = new Date();
        style.disabled = typeof this.disabledDate === 'function' ? datesInYear(year).every(this.disabledDate) : false;
        style.current = arrayFindIndex(coerceTruthyValueToArray(this.value), function (date) {
          return date.getFullYear() === year;
        }) >= 0;
        style.today = today.getFullYear() === year;
        style.default = this.defaultValue && this.defaultValue.getFullYear() === year;
        return style;
      },
      handleYearTableClick: function (event) {
        var target = event.target;
  
        if (target.tagName === 'A') {
          if (hasClass(target.parentNode, 'disabled')) return;
          var year = target.textContent || target.innerText;
          this.$emit('pick', Number(year));
        }
      }
    }
  };
  var MonthTable = {
    template: 
    '  <table @click="handleMonthTableClick" @mousemove="handleMouseMove" class="vue-month-table">'+
    '    <tbody>'+
    '    <tr v-for="(row, key) in rows" :key="key">'+
    '      <td :class="getCellStyle(cell)" v-for="(cell, key) in row" :key="key">'+
    '        <div>'+
    '          <a class="cell">{{ $t(\'vue.datepicker.months.\' + months[cell.text]) }}</a>'+
    '        </div>'+
    '      </td>'+
    '    </tr>'+
    '    </tbody>'+
    '  </table>',
    props: {
      disabledDate: {},
      value: {},
      selectionMode: {
        default: 'month'
      },
      minDate: {},
      maxDate: {},
      defaultValue: {
        validator: function (val) {
          return val === null || isDate(val) || Array.isArray(val) && val.every(isDate);
        }
      },
      date: {
        default: function() {
          return new Date();
        }
      },
      rangeState: {
        default: function () {
          return {
            endDate: null,
            selecting: false
          };
        }
      }
    },
    watch: {
      'rangeState.endDate': function (newVal) {
        this.markRange(this.minDate, newVal);
      },
      minDate: function (newVal, oldVal) {
        if (getMonthTimestamp(newVal) !== getMonthTimestamp(oldVal)) {
          this.markRange(this.minDate, this.maxDate);
        }
      },
      maxDate: function (newVal, oldVal) {
        if (getMonthTimestamp(newVal) !== getMonthTimestamp(oldVal)) {
          this.markRange(this.minDate, this.maxDate);
        }
      }
    },
    data: function () {
      return {
        months: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
        tableRows: [[], [], []],
        lastRow: null,
        lastColumn: null
      };
    },
    methods: {
      cellMatchesDate: function (cell, date) {
        var value = new Date(date);
        return this.date.getFullYear() === value.getFullYear() && Number(cell.text) === value.getMonth();
      },
      getCellStyle: function (cell) {
        var self = this;
  
        var style = {};
        var year = this.date.getFullYear();
        var today = new Date();
        var month = cell.text;
        var defaultValue = this.defaultValue ? Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue] : [];
        style.disabled = typeof this.disabledDate === 'function' ? datesInMonth(year, month).every(this.disabledDate) : false;
        style.current = arrayFindIndex(coerceTruthyValueToArray(this.value), function (date) {
          return date.getFullYear() === year && date.getMonth() === month;
        }) >= 0;
        style.today = today.getFullYear() === year && today.getMonth() === month;
        style.default = defaultValue.some(function (date) {
          return self.cellMatchesDate(cell, date);
        });
  
        if (cell.inRange) {
          style['in-range'] = true;
  
          if (cell.start) {
            style['start-date'] = true;
          }
  
          if (cell.end) {
            style['end-date'] = true;
          }
        }
  
        return style;
      },
      getMonthOfCell: function (month) {
        var year = this.date.getFullYear();
        return new Date(year, month, 1);
      },
      markRange: function (minDate, maxDate) {
        minDate = getMonthTimestamp(minDate);
        maxDate = getMonthTimestamp(maxDate) || minDate;
        var _ref = [Math.min(minDate, maxDate), Math.max(minDate, maxDate)];
        minDate = _ref[0];
        maxDate = _ref[1];
        var rows = this.rows;
  
        for (var i = 0, k = rows.length; i < k; i++) {
          var row = rows[i];
  
          for (var j = 0, l = row.length; j < l; j++) {
            var cell = row[j];
            var index = i * 4 + j;
            var time = new Date(this.date.getFullYear(), index).getTime();
            cell.inRange = minDate && time >= minDate && time <= maxDate;
            cell.start = minDate && time === minDate;
            cell.end = maxDate && time === maxDate;
          }
        }
      },
      handleMouseMove: function (event) {
        if (!this.rangeState.selecting) return;
        var target = event.target;
  
        if (target.tagName === 'A') {
          target = target.parentNode.parentNode;
        }
  
        if (target.tagName === 'DIV') {
          target = target.parentNode;
        }
  
        if (target.tagName !== 'TD') return;
        var row = target.parentNode.rowIndex;
        var column = target.cellIndex; // can not select disabled date
  
        if (this.rows[row][column].disabled) return; // only update rangeState when mouse moves to a new cell
        // this avoids frequent Date object creation and improves performance
  
        if (row !== this.lastRow || column !== this.lastColumn) {
          this.lastRow = row;
          this.lastColumn = column;
          this.$emit('changerange', {
            minDate: this.minDate,
            maxDate: this.maxDate,
            rangeState: {
              selecting: true,
              endDate: this.getMonthOfCell(row * 4 + column)
            }
          });
        }
      },
      handleMonthTableClick: function (event) {
        var target = event.target;
  
        if (target.tagName === 'A') {
          target = target.parentNode.parentNode;
        }
  
        if (target.tagName === 'DIV') {
          target = target.parentNode;
        }
  
        if (target.tagName !== 'TD') return;
        if (hasClass(target, 'disabled')) return;
        var column = target.cellIndex;
        var row = target.parentNode.rowIndex;
        var month = row * 4 + column;
        var newDate = this.getMonthOfCell(month);
  
        if (this.selectionMode === 'range') {
          if (!this.rangeState.selecting) {
            this.$emit('pick', {
              minDate: newDate,
              maxDate: null
            });
            this.rangeState.selecting = true;
          } else {
            if (newDate >= this.minDate) {
              this.$emit('pick', {
                minDate: this.minDate,
                maxDate: newDate
              });
            } else {
              this.$emit('pick', {
                minDate: newDate,
                maxDate: this.minDate
              });
            }
  
            this.rangeState.selecting = false;
          }
        } else {
          this.$emit('pick', month);
        }
      }
    },
    computed: {
      rows: function () {
        var self = this;
  
        var rows = this.tableRows;
        var disabledDate = this.disabledDate;
        var selectedDate = [];
        var now = getMonthTimestamp(new Date());
  
        for (var i = 0; i < 3; i++) {
          var row = rows[i];
  
          var _loop = function _loop(j) {
            var cell = row[j];
  
            if (!cell) {
              cell = {
                row: i,
                column: j,
                type: 'normal',
                inRange: false,
                start: false,
                end: false
              };
            }
  
            cell.type = 'normal';
            var index = i * 4 + j;
            var time = new Date(self.date.getFullYear(), index).getTime();
            cell.inRange = time >= getMonthTimestamp(self.minDate) && time <= getMonthTimestamp(self.maxDate);
            cell.start = self.minDate && time === getMonthTimestamp(self.minDate);
            cell.end = self.maxDate && time === getMonthTimestamp(self.maxDate);
            var isToday = time === now;
  
            if (isToday) {
              cell.type = 'today';
            }
  
            cell.text = index;
            var cellDate = new Date(time);
            cell.disabled = typeof disabledDate === 'function' && disabledDate(cellDate);
            cell.selected = arrayFind(selectedDate, function (date) {
              return date.getTime() === cellDate.getTime();
            });
  
            self.$set(row, j, cell);
          };
  
          for (var j = 0; j < 4; j++) {
            _loop(j);
          }
        }
  
        return rows;
      }
    }
  };
  var DateTable = {
    template: 
    '  <table'+
    '    cellspacing="0"'+
    '    cellpadding="0"'+
    '    class="vue-date-table"'+
    '    @click="handleClick"'+
    '    @mousemove="handleMouseMove"'+
    '    :class="{ \'is-week-mode\': selectionMode === \'week\' }">'+
    '    <tbody>'+
    '    <tr>'+
    '      <th v-if="showWeekNumber">{{ $t(\'vue.datepicker.week\') }}</th>'+
    '      <th v-for="(week, key) in WEEKS" :key="key">{{ $t(\'vue.datepicker.weeks.\' + week) }}</th>'+
    '    </tr>'+
    '    <tr'+
    '      class="vue-date-table__row"'+
    '      v-for="(row, key) in rows"'+
    '      :class="{ current: isWeekActive(row[1]) }"'+
    '      :key="key">'+
    '      <td'+
    '        v-for="(cell, key) in row"'+
    '        :class="getCellClasses(cell)"'+
    '        :key="key">'+
    '        <div>'+
    '          <span>'+
    '            {{ cell.text }}'+
    '          </span>'+
    '        </div>'+
    '      </td>'+
    '    </tr>'+
    '    </tbody>'+
    '  </table>',
    props: {
      firstDayOfWeek: {
        default: 7,
        type: Number,
        validator: function (val) {
          return val >= 1 && val <= 7;
        }
      },
      events: Array,
      dateClass: Array,
      value: {},
      defaultValue: {
        validator: function (val) {
          // either: null, valid Date object, Array of valid Date objects
          return val === null || isDate(val) || Array.isArray(val) && val.every(isDate);
        }
      },
      date: {},
      selectionMode: {
        default: 'day'
      },
      showWeekNumber: {
        type: Boolean,
        default: false
      },
      disabledDate: {},
      minDate: {},
      maxDate: {},
      rangeState: {
        default: function _default() {
          return {
            endDate: null,
            selecting: false
          };
        }
      }
    },
    computed: {
      offsetDay: function () {
        var week = this.firstDayOfWeek; // 周日为界限，左右偏移的天数，3217654 例如周一就是 -1，目的是调整前两行日期的位置
    
        return week > 3 ? 7 - week : -week;
      },
      WEEKS: function (_WEEKS) {
        function WEEKS() {
          return _WEEKS.apply(this, arguments);
        }
    
        WEEKS.toString = function () {
          return _WEEKS.toString();
        };
    
        return WEEKS;
      }(function () {
        var week = this.firstDayOfWeek;
        return WEEKS.concat(WEEKS).slice(week, week + 7);
      }),
      year: function () {
        return this.date.getFullYear();
      },
      month: function () {
        return this.date.getMonth();
      },
      startDate: function () {
        return getStartDateOfMonth(this.year, this.month);
      },
      rows: function () {
        var self = this;
    
        // TODO: refactory rows / getCellClasses
        var date = new Date(this.year, this.month, 1);
        var day = getFirstDayOfMonth(date); // day of first day
    
        var dateCountOfMonth = getDayCountOfMonth(date.getFullYear(), date.getMonth());
        var dateCountOfLastMonth = getDayCountOfMonth(date.getFullYear(), date.getMonth() === 0 ? 11 : date.getMonth() - 1);
        day = day === 0 ? 7 : day;
        var offset = this.offsetDay;
        var rows = this.tableRows;
        var count = 1;
        var startDate = this.startDate;
        var disabledDate = this.disabledDate;
        var selectedDate = this.selectionMode === 'dates' ? coerceTruthyValueToArray(this.value) : [];
        var now = getDateTimestamp(new Date());
    
        for (var i = 0; i < 6; i++) {
          var row = rows[i];
    
          if (this.showWeekNumber) {
            if (!row[0]) {
              row[0] = {
                type: 'week',
                text: getWeekNumber(nextDate(startDate, i * 7 + 1))
              };
            }
          }
    
          var _loop = function _loop(j) {
            var cell = row[self.showWeekNumber ? j + 1 : j];
    
            if (!cell) {
              cell = {
                row: i,
                column: j,
                type: 'normal',
                inRange: false,
                start: false,
                end: false
              };
            }
    
            cell.type = 'normal';
            var index = i * 7 + j;
            var time = nextDate(startDate, index - offset).getTime();
            cell.inRange = time >= getDateTimestamp(self.minDate) && time <= getDateTimestamp(self.maxDate);
            cell.start = self.minDate && time === getDateTimestamp(self.minDate);
            cell.end = self.maxDate && time === getDateTimestamp(self.maxDate);
            var isToday = time === now;
    
            if (isToday) {
              cell.type = 'today';
            }
    
            if (i >= 0 && i <= 1) {
              var numberOfDaysFromPreviousMonth = day + offset < 0 ? 7 + day + offset : day + offset;
    
              if (j + i * 7 >= numberOfDaysFromPreviousMonth) {
                cell.text = count++;
              } else {
                cell.text = dateCountOfLastMonth - (numberOfDaysFromPreviousMonth - j % 7) + 1 + i * 7;
                cell.type = 'prev-month';
              }
            } else {
              if (count <= dateCountOfMonth) {
                cell.text = count++;
              } else {
                cell.text = count++ - dateCountOfMonth;
                cell.type = 'next-month';
              }
            }
    
            var cellDate = new Date(time);
            cell.disabled = typeof disabledDate === 'function' && disabledDate(cellDate);
            cell.selected = arrayFind(selectedDate, function (date) {
              return VueUtil.formatDate(date, 'yyyyMMdd') === VueUtil.formatDate(cellDate, 'yyyyMMdd');
            });
    
            cell.event = false;
            cell.dateClass = '';

            if (cell.type === 'today' || cell.type === 'normal') {
              if (self.events && self.events.length > 0) {
                VueUtil.loop(self.events, function(event) {
                  var st = VueUtil.parseDate(event.start).getTime();
                  var ed = VueUtil.parseDate(event.end ? event.end : st).getTime();
                  if (time >= st && time <= ed) {
                    cell.event = true;
                  }
                });
              }
            }

            if (self.dateClass && self.dateClass.length > 0) {
              VueUtil.loop(self.dateClass, function(dateClass) {
                var st;
                var ed;
                if(dateClass.date) {
                  st = VueUtil.parseDate(dateClass.date).getTime();
                  ed = st;
                } else {
                  st = VueUtil.parseDate(dateClass.start).getTime();
                  ed = VueUtil.parseDate(dateClass.end ? dateClass.end : st).getTime();
                }

                if (time >= st && time <= ed) {
                  cell.dateClass += (dateClass.customClass + ' ');
                }
              });
            }
            self.$set(row, self.showWeekNumber ? j + 1 : j, cell);
          };
    
          for (var j = 0; j < 7; j++) {
            _loop(j);
          }
    
          if (this.selectionMode === 'week') {
            var start = this.showWeekNumber ? 1 : 0;
            var end = this.showWeekNumber ? 7 : 6;
            var isWeekActive = this.isWeekActive(row[start + 1]);
            row[start].inRange = isWeekActive;
            row[start].start = isWeekActive;
            row[end].inRange = isWeekActive;
            row[end].end = isWeekActive;
          }
        }
        return rows;
      }
    },
    watch: {
      'rangeState.endDate': function (newVal) {
        this.markRange(this.minDate, newVal);
      },

      minDate: function (newVal, oldVal) {
        if (getDateTimestamp(newVal) !== getDateTimestamp(oldVal)) {
          this.markRange(this.minDate, this.maxDate);
        }
      },

      maxDate: function (newVal, oldVal) {
        if (getDateTimestamp(newVal) !== getDateTimestamp(oldVal)) {
          this.markRange(this.minDate, this.maxDate);
        }
      }
    },
    data: function() {
      return {
        tableRows: [ [], [], [], [], [], [] ],
        lastRow: null,
        lastColumn: null,
        lastClick: null,
      };
    },
    methods: {
      cellMatchesDate: function (cell, date) {
        var value = new Date(date);
        return this.year === value.getFullYear() && this.month === value.getMonth() && Number(cell.text) === value.getDate();
      },
      getCellClasses: function (cell) {
        var selectionMode = this.selectionMode;
        var defaultValue = this.defaultValue ? Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue] : [];
        var classes = [];

        if ((cell.type === 'normal' || cell.type === 'today') && !cell.disabled) {
          classes.push('available');
    
          if (cell.type === 'today') {
            classes.push('today');
          }
        } else {
          classes.push(cell.type);
        }
    
        var self = this;
    
        if (cell.type === 'normal' && defaultValue.some(function (date) {
          return self.cellMatchesDate(cell, date);
        })) {
          classes.push('default');
        }

        if (selectionMode === 'day' && (cell.type === 'normal' || cell.type === 'today') && this.cellMatchesDate(cell, this.value)) {
          classes.push('current');
        }
    
        if (cell.inRange && (cell.type === 'normal' || cell.type === 'today' || this.selectionMode === 'week')) {
          classes.push('in-range');
    
          if (cell.start) {
            classes.push('start-date');
          }
    
          if (cell.end) {
            classes.push('end-date');
          }
        }
    
        if (cell.disabled) {
          classes.push('disabled');
        }

        if (cell.selected) {
          classes.push('selected');
        }
        if (cell.event) {
          classes.push('event-date');
        }

        if (cell.dateClass) {
          classes.push(cell.dateClass.trim());
        }
        return classes.join(' ');
      },
      getDateOfCell: function (row, column) {
        var offsetFromStart = row * 7 + (column - (this.showWeekNumber ? 1 : 0)) - this.offsetDay;
        return nextDate(this.startDate, offsetFromStart);
      },
      isWeekActive: function (cell) {
        if (this.selectionMode !== 'week') return false;
        var newDate = new Date(this.year, this.month, 1);
        var year = newDate.getFullYear();
        var month = newDate.getMonth();
    
        if (cell.type === 'prev-month') {
          newDate.setMonth(month === 0 ? 11 : month - 1);
          newDate.setFullYear(month === 0 ? year - 1 : year);
        }
    
        if (cell.type === 'next-month') {
          newDate.setMonth(month === 11 ? 0 : month + 1);
          newDate.setFullYear(month === 11 ? year + 1 : year);
        }
    
        newDate.setDate(parseInt(cell.text, 10));
    
        if (isDate(this.value)) {
          var dayOffset = (this.value.getDay() - this.firstDayOfWeek + 7) % 7 - 1;
          var weekDate = prevDate(this.value, dayOffset);
          return weekDate.getTime() === newDate.getTime();
        }
    
        return false;
      },
      markRange: function (minDate, maxDate) {
        minDate = getDateTimestamp(minDate);
        maxDate = getDateTimestamp(maxDate) || minDate;
        var _ref = [Math.min(minDate, maxDate), Math.max(minDate, maxDate)];
        minDate = _ref[0];
        maxDate = _ref[1];
        var startDate = this.startDate;
        var rows = this.rows;
    
        for (var i = 0, k = rows.length; i < k; i++) {
          var row = rows[i];
    
          for (var j = 0, l = row.length; j < l; j++) {
            if (this.showWeekNumber && j === 0) continue;
            var cell = row[j];
            var index = i * 7 + j + (this.showWeekNumber ? -1 : 0);
            var time = nextDate(startDate, index - this.offsetDay).getTime();
            cell.inRange = minDate && time >= minDate && time <= maxDate;
            cell.start = minDate && time === minDate;
            cell.end = maxDate && time === maxDate;
          }
        }
      },
      handleMouseMove: function (event) {
        
        if (!this.rangeState.selecting) return;
        var target = event.target;
    
        if (target.tagName === 'SPAN') {
          target = target.parentNode.parentNode;
        }
    
        if (target.tagName === 'DIV') {
          target = target.parentNode;
        }
    
        if (target.tagName !== 'TD') return;
        var row = target.parentNode.rowIndex - 1;
        var column = target.cellIndex; // can not select disabled date
    
        if (this.rows[row][column].disabled) return; // only update rangeState when mouse moves to a new cell
        // this avoids frequent Date object creation and improves performance
    
        if (row !== this.lastRow || column !== this.lastColumn) {
          this.lastRow = row;
          this.lastColumn = column;
          this.$emit('changerange', {
            minDate: this.minDate,
            maxDate: this.maxDate,
            rangeState: {
              selecting: true,
              endDate: this.getDateOfCell(row, column)
            }
          });
        }
      },
      handleClick: function (event) {
        var target = event.target;
        var self = this;
        if (target.tagName === 'SPAN') {
          target = target.parentNode.parentNode;
        }
    
        if (target.tagName === 'DIV') {
          target = target.parentNode;
        }
    
        if (target.tagName !== 'TD') return;
        var row = target.parentNode.rowIndex - 1;
        var column = this.selectionMode === 'week' ? 1 : target.cellIndex;
        var cell = this.rows[row][column];
        if (cell.disabled || cell.type === 'week') return;
        var newDate = this.getDateOfCell(row, column);
        this.lastClick = {date: newDate, jsEvent: event};
        if (this.selectionMode === 'range') {

          if (!this.rangeState.selecting) {
            this.$emit('pick', {
              minDate: newDate,
              maxDate: null
            });
            this.rangeState.selecting = true;
          } else {
            if (newDate >= this.minDate) {
              this.$emit('pick', {
                minDate: this.minDate,
                maxDate: newDate
              });
            } else {
              this.$emit('pick', {
                minDate: newDate,
                maxDate: this.minDate
              });
            }
            setTimeout(function() {
              self.rangeState.selecting = false;
            }, 100);
           
          }
        } else if (this.selectionMode === 'day') {
          this.$emit('pick', newDate);
        } else if (this.selectionMode === 'week') {
          var weekNumber = getWeekNumber(newDate);
          var value = newDate.getFullYear() + 'w' + weekNumber;
          this.$emit('pick', {
            year: newDate.getFullYear(),
            week: weekNumber,
            value: value,
            date: newDate
          });
        } else if (this.selectionMode === 'dates') {
          var _value = this.value || [];
    
          var newValue = cell.selected ? removeFromArray(_value, function (date) {
            return date.getTime() === newDate.getTime();
          }) : [].concat(_value, [newDate]);
          this.$emit('pick', newValue);
        }
      }
    }
  };

  var DatePanel = {
    template: 
    '  <transition name="vue-zoom-in-top" @after-enter="handleEnter" @after-leave="handleLeave">'+
    '    <div tabindex="-1" style="outline:none;" ref="datePanelDiv"><div class="vue-aside__wrapper" v-if="isMobile"></div>'+
    '    <div'+
    '      v-show="visible"'+
    '      class="vue-picker-panel vue-date-picker vue-popper"'+
    '      :class="[{'+
    '        \'has-sidebar\': $slots.sidebar || shortcuts,'+
    '        \'has-time\': showTime'+
    '      }, popperClass]">'+
    '      <div class="vue-picker-panel__body-wrapper" style="position:relative">'+
    '        <slot name="sidebar" class="vue-picker-panel__sidebar" ></slot>'+
    '        <div class="vue-picker-panel__sidebar"   v-if="shortcuts">'+
    '          <button'+
    '            type="button"'+
    '            class="vue-picker-panel__shortcut"'+
    '            v-for="(shortcut, key) in shortcuts"'+
    '            :key="key"'+
    '            @click="handleShortcutClick(shortcut)">{{ shortcut.text }}</button>'+
    '        </div>'+
    '        <div class="vue-picker-panel__body">'+
    '          <div class="vue-date-picker__time-header" v-if="showTime">'+
    '            <span class="vue-date-picker__editor-wrap">'+
    '              <vue-input'+
    '                :placeholder="$t(\'vue.datepicker.selectDate\')"'+
    '                :value="visibleDate"'+
    '                size="small"'+
    '                @input="function (val) { return userInputDate = val;}"'+
    '                @change="handleVisibleDateChange" />'+
    '            </span>'+
    '            <span class="vue-date-picker__editor-wrap" v-clickoutside="handleTimePickClose" v-scrolling="handleTimePickClose">'+
    '              <vue-input'+
    '                ref="input"'+
    '                @focus="timePickerVisible = true"'+
    '                :placeholder="$t(\'vue.datepicker.selectTime\')"'+
    '                :value="visibleTime"'+
    '                size="small"'+
    '                @input="function (val) { return userInputTime = val;}"'+
    '               :readonly="isMobile"'+
    '                @change="handleVisibleTimeChange" />'+
    '              <time-picker'+
    '                ref="timepicker"'+
    '                :time-arrow-control="arrowControl"'+
    '                @pick="handleTimePick"'+
    '                :visible="timePickerVisible"'+
    '                @mounted="proxyTimePickerDataProperties">'+
    '              </time-picker>'+
    '            </span>'+
    '          </div>'+
    '          <div style="padding:6px;12px;margin:0;"'+
    '            class="vue-date-picker__header"'+
    '            :class="{ \'vue-date-picker__header--bordered\': currentView === \'year\' || currentView === \'month\' }"'+
    '            v-show="currentView !== \'time\'">'+
    '            <button'+
    '              type="button"'+
    '              @click="prevYear"'+
    '              class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-d-arrow-left">'+
    '            </button>'+
    '            <button'+
    '              type="button"'+
    '              @click="prevMonth"'+
    '              v-show="currentView === \'date\'"'+
    '              class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-arrow-left">'+
    '            </button>'+
    '            <span'+
    '              @click="showYearPicker"'+
    '              role="button"'+
    '              class="vue-date-picker__header-label">{{ yearLabel }}</span>'+
    '            <span'+
    '              @click="showMonthPicker"'+
    '              v-show="currentView === \'date\'"'+
    '              role="button"'+
    '              class="vue-date-picker__header-label"'+
    '              :class="{ active: currentView === \'month\' }">{{$t(\'vue.datepicker.month\' + (month + 1))}}</span>'+
    '            <button'+
    '              type="button"'+
    '              @click="nextYear"'+
    '              class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-d-arrow-right">'+
    '            </button>'+
    '            <button'+
    '              type="button"'+
    '              @click="nextMonth"'+
    '              v-show="currentView === \'date\'"'+
    '              class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-arrow-right">'+
    '            </button>'+
    '          </div>'+
    '          <div class="vue-picker-panel__content">'+
    '            <date-table'+
    '              v-show="currentView === \'date\'"'+
    '              @pick="handleDatePick"'+
    '              :selection-mode="selectionMode"'+
    '              :first-day-of-week="firstDayOfWeek"'+
    '              :value="value"'+
    '              :default-value="defaultValue ? new Date(defaultValue) : null"'+
    '              :date="date"'+
    '              :disabled-date="disabledDate">'+
    '            </date-table>'+
    '            <year-table'+
    '              v-show="currentView === \'year\'"'+
    '              @pick="handleYearPick"'+
    '              :value="value"'+
    '              :default-value="defaultValue ? new Date(defaultValue) : null"'+
    '              :date="date"'+
    '              :disabled-date="disabledDate">'+
    '            </year-table>'+
    '            <month-table'+
    '              v-show="currentView === \'month\'"'+
    '              @pick="handleMonthPick"'+
    '              :value="value"'+
    '              :default-value="defaultValue ? new Date(defaultValue) : null"'+
    '              :date="date"'+
    '              :disabled-date="disabledDate">'+
    '            </month-table>'+
    '          </div>'+
    '        </div>'+
    '      </div>'+
    '      <div'+
    '        class="vue-picker-panel__footer"'+
    '        v-show="footerVisible && currentView === \'date\'">'+
    '        <vue-button'+
    '          size="mini"'+
    '          type="text"'+
    '          class="vue-picker-panel__link-btn"'+
    '          @click="changeToNow"'+
    '          v-show="selectionMode !== \'dates\'">'+
    '          {{ $t(\'vue.datepicker.now\') }}'+
    '        </vue-button>'+
    '        <vue-button'+
    '          plain'+
    '          size="mini"'+
    '          class="vue-picker-panel__link-btn"'+
    '          @click="confirm">'+
    '          {{ $t(\'vue.datepicker.confirm\') }}'+
    '        </vue-button>'+
    '      </div>'+
    '    </div>'+
    '</div>'+
    '  </transition>',
    directives: {
      Clickoutside: VueUtil.component.clickoutside(),
      Scrolling: VueUtil.component.scrolling
    },
    watch: {
      date: function(val, oldVal) {
        if(val.getFullYear() !== oldVal.getFullYear() || val.getMonth() !== oldVal.getMonth()) {
          this.$emit('view-month-change', val);
        }
      },
      visible: function (val) {
        var self = this;
        
        if(val){
          this.$nextTick(function () {
            // self.$refs.datePanelDiv.focus();
          });
        }
        
      },
      showTime: function (val) {
        var self = this;
  
        /* istanbul ignore if */
        if (!val) return;
        this.$nextTick(function (_) {
          var inputElm = self.$refs.input.$el;
  
          if (inputElm) {
            self.pickerWidth = inputElm.getBoundingClientRect().width + 10;
          }
        });
      },
      value: function (val) {
        if (this.selectionMode === 'dates' && this.value) return;
  
        if (isDate(val)) {
          this.date = new Date(val);
        } else {
          this.date = this.getDefaultValue();
        }
      },
      defaultValue: function (val) {
        if (!isDate(this.value)) {
          this.date = val ? new Date(val) : new Date();
        }
      },
      timePickerVisible: function (val) {
        var self = this;
  
        if (val) this.$nextTick(function () {
          return self.$refs.timepicker.adjustSpinners();
        });
      },
      selectionMode: function (newVal) {
        if (newVal === 'month') {
          /* istanbul ignore next */
          if (this.currentView !== 'year' || this.currentView !== 'month') {
            this.currentView = 'month';
          }
        } else if (newVal === 'dates') {
          this.currentView = 'date';
        }
      }
    },
    methods: {
      proxyTimePickerDataProperties: function () {
        var self = this;
  
        var format = function (timeFormat) {
          self.$refs.timepicker.format = timeFormat;
        };
  
        var value = function (_value) {
          self.$refs.timepicker.value = _value;
        };
  
        var date = function (_date) {
          self.$refs.timepicker.date = _date;
        };
  
        var selectableRange = function (_selectableRange) {
          self.$refs.timepicker.selectableRange = _selectableRange;
        };
  
        this.$watch('value', value);
        this.$watch('date', date);
        this.$watch('selectableRange', selectableRange);
        format(this.timeFormat);
        value(this.value);
        date(this.date);
        selectableRange(this.selectableRange);
      },
      handleClear: function () {
        this.date = this.getDefaultValue();
        this.$emit('pick', null);
      },
      emit: function (value) {
        var self = this;
  
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
  
        if (!value) {
          this.$emit.apply(this, ['pick', value].concat(args));
        } else if (Array.isArray(value)) {
          var dates = value.map(function (date) {
            return self.showTime ? clearMilliseconds(date) : clearTime(date);
          });
          this.$emit.apply(this, ['pick', dates].concat(args));
        } else {
          this.$emit.apply(this, ['pick', this.showTime ? clearMilliseconds(value) : clearTime(value)].concat(args));
        }
  
        this.userInputDate = null;
        this.userInputTime = null;
      },
      resetDate: function() {
        this.date = new Date(this.date);
      },
      showMonthPicker: function () {
        this.currentView = 'month';
      },
      showYearPicker: function () {
        this.currentView = 'year';
      },
      // XXX: 没用到
      // handleLabelClick() {
      //   if (this.currentView === 'date') {
      //     this.showMonthPicker();
      //   } else if (this.currentView === 'month') {
      //     this.showYearPicker();
      //   }
      // },
      prevMonth: function (_prevMonth) {
        function prevMonth() {
          return _prevMonth.apply(this, arguments);
        }
  
        prevMonth.toString = function () {
          return _prevMonth.toString();
        };
  
        return prevMonth;
      }(function () {
        this.date = prevMonth(this.date);
      }),
      nextMonth: function (_nextMonth) {
        function nextMonth() {
          return _nextMonth.apply(this, arguments);
        }
  
        nextMonth.toString = function () {
          return _nextMonth.toString();
        };
  
        return nextMonth;
      }(function () {
        this.date = nextMonth(this.date);
      }),
      prevYear: function (_prevYear) {
        function prevYear() {
          return _prevYear.apply(this, arguments);
        }
  
        prevYear.toString = function () {
          return _prevYear.toString();
        };
  
        return prevYear;
      }(function () {
        if (this.currentView === 'year') {
          this.date = prevYear(this.date, 10);
        } else {
          this.date = prevYear(this.date);
        }
      }),
      nextYear: function (_nextYear) {
        function nextYear() {
          return _nextYear.apply(this, arguments);
        }
  
        nextYear.toString = function () {
          return _nextYear.toString();
        };
  
        return nextYear;
      }(function () {
        if (this.currentView === 'year') {
          this.date = nextYear(this.date, 10);
        } else {
          this.date = nextYear(this.date);
        }
      }),
      handleShortcutClick: function (shortcut) {
        if (shortcut.onClick) {
          shortcut.onClick(this);
        }
      },
      handleTimePick: function (value, visible, first) {
        if (isDate(value)) {
          var newDate = this.value ? modifyTime(this.value, value.getHours(), value.getMinutes(), value.getSeconds()) : modifyWithTimeString(this.getDefaultValue(), this.defaultTime);
          this.date = newDate;
          this.emit(this.date, true);
        } else {
          this.emit(value, true);
        }
  
        if (!first) {
          this.timePickerVisible = visible;
        }
      },
      handleTimePickClose: function () {
        this.timePickerVisible = false;
      },
      handleMonthPick: function (month) {
        if (this.selectionMode === 'month') {
          this.date = modifyDate(this.date, this.year, month, 1);
          this.emit(this.date);
        } else {
          this.date = changeYearMonthAndClampDate(this.date, this.year, month); // TODO: should emit intermediate value ??
          // this.emit(this.date);
  
          this.currentView = 'date';
        }
      },
      handleDatePick: function (value) {
        if (this.selectionMode === 'day') {
          var newDate = this.value ? modifyDate(this.value, value.getFullYear(), value.getMonth(), value.getDate()) : modifyWithTimeString(value, this.defaultTime); // change default time while out of selectableRange
  
          if (!this.checkDateWithinRange(newDate)) {
            newDate = modifyDate(this.selectableRange[0][0], value.getFullYear(), value.getMonth(), value.getDate());
          }
  
          this.date = newDate;
          this.emit(this.date, this.showTime);
        } else if (this.selectionMode === 'week') {
          this.emit(value.date);
        } else if (this.selectionMode === 'dates') {
          this.emit(value, true); // set false to keep panel open
        }
      },
      handleYearPick: function (year) {
        if (this.selectionMode === 'year') {
          this.date = modifyDate(this.date, year, 0, 1);
          this.emit(this.date);
        } else {
          this.date = changeYearMonthAndClampDate(this.date, year, this.month); // TODO: should emit intermediate value ??
          // this.emit(this.date, true);
  
          this.currentView = 'month';
        }
      },
      changeToNow: function () {
        // NOTE: not a permanent solution
        //       consider disable "now" button in the future
        if ((!this.disabledDate || !this.disabledDate(new Date())) && this.checkDateWithinRange(new Date())) {
          this.date = new Date();
          this.emit(this.date);
        }
      },
      confirm: function () {
        if (this.selectionMode === 'dates') {
          this.emit(this.value);
        } else {
          // value were emitted in handle{Date,Time}Pick, nothing to update here
          // deal with the scenario where: user opens the picker, then confirm without doing anything
          var value = this.value ? this.value : modifyWithTimeString(this.getDefaultValue(), this.defaultTime);
          this.date = new Date(value); // refresh date
  
          this.emit(value);
        }
      },
      resetView: function () {
        if (this.selectionMode === 'month') {
          this.currentView = 'month';
        } else if (this.selectionMode === 'year') {
          this.currentView = 'year';
        } else {
          this.currentView = 'date';
        }
      },
      handleEnter: function () {
        document.body.addEventListener('keydown', this.handleKeydown);
      },
      handleLeave: function () {
        this.$emit('destroyPopper');
        document.body.removeEventListener('keydown', this.handleKeydown);
      },
      handleKeydown: function (event) {
        var keyCode = event.keyCode;
        var list = [38, 40, 37, 39];
  
        if (this.visible && !this.timePickerVisible) {
          if (list.indexOf(keyCode) !== -1) {
            this.handleKeyControl(keyCode);
            event.stopPropagation();
            event.preventDefault();
          }
  
          if (keyCode === 13 && this.userInputDate === null && this.userInputTime === null) {
            // Enter
            this.emit(this.date, false);
          }
        }
      },
      handleKeyControl: function (keyCode) {
        var mapping = {
          'year': {
            38: -4,
            40: 4,
            37: -1,
            39: 1,
            offset: function (date, step) {
              return date.setFullYear(date.getFullYear() + step);
            }
          },
          'month': {
            38: -4,
            40: 4,
            37: -1,
            39: 1,
            offset: function (date, step) {
              return date.setMonth(date.getMonth() + step);
            }
          },
          'week': {
            38: -1,
            40: 1,
            37: -1,
            39: 1,
            offset: function (date, step) {
              return date.setDate(date.getDate() + step * 7);
            }
          },
          'day': {
            38: -7,
            40: 7,
            37: -1,
            39: 1,
            offset: function (date, step) {
              return date.setDate(date.getDate() + step);
            }
          }
        };
        var mode = this.selectionMode;
        var year = 3.1536e10;
        var now = this.date.getTime();
        var newDate = new Date(this.date.getTime());
  
        while (Math.abs(now - newDate.getTime()) <= year) {
          var map = mapping[mode];
          map.offset(newDate, map[keyCode]);
  
          if (typeof this.disabledDate === 'function' && this.disabledDate(newDate)) {
            continue;
          }
  
          this.date = newDate;
          this.$emit('pick', newDate, true);
          break;
        }
      },
      handleVisibleTimeChange: function (value) {
        var time = parseDate(value, this.timeFormat);
  
        if (time && this.checkDateWithinRange(time)) {
          this.date = modifyDate(time, this.year, this.month, this.monthDate);
          this.userInputTime = null;
          this.$refs.timepicker.value = this.date;
          this.timePickerVisible = false;
          this.emit(this.date, true);
        }
      },
      handleVisibleDateChange: function (value) {
        var date = parseDate(value, this.dateFormat);
  
        if (date) {
          if (typeof this.disabledDate === 'function' && this.disabledDate(date)) {
            return;
          }
  
          this.date = modifyTime(date, this.date.getHours(), this.date.getMinutes(), this.date.getSeconds());
          this.userInputDate = null;
          this.resetView();
          this.emit(this.date, true);
        }
      },
      isValidValue: function (value) {
        return value && !isNaN(value) && (typeof this.disabledDate === 'function' ? !this.disabledDate(value) : true) && this.checkDateWithinRange(value);
      },
      getDefaultValue: function () {
        // if default-value is set, return it
        // otherwise, return now (the moment this method gets called)
        return this.defaultValue ? new Date(this.defaultValue) : new Date();
      },
      checkDateWithinRange: function (date) {
        return this.selectableRange.length > 0 ? timeWithinRange(date, this.selectableRange, this.format || 'HH:mm:ss') : true;
      }
    },
    components: {
      TimePicker: VueTimePicker,
      YearTable: YearTable,
      MonthTable: MonthTable,
      DateTable: DateTable
    },
    data: function () {
      return {
        popperClass: '',
        date: new Date(),
        value: null,
        defaultValue: null,
        // use getDefaultValue() for time computation
        defaultTime: null,
        showTime: false,
        selectionMode: 'day',
        shortcuts: '',
        visible: false,
        currentView: 'date',
        disabledDate: '',
        selectableRange: [],
        firstDayOfWeek: 7,
        showWeekNumber: false,
        timePickerVisible: false,
        format: '',
        arrowControl: false,
        userInputDate: null,
        userInputTime: null,
        isMobile: VueUtil.getSystemInfo().device == 'Mobile' && VueUtil.getSystemInfo().isLoadMobileJs ? true : false,
      };
    },
    computed: {
      year: function () {
        return this.date.getFullYear();
      },
      month: function () {
        return this.date.getMonth();
      },
      week: function () {
        return getWeekNumber(this.date);
      },
      monthDate: function () {
        return this.date.getDate();
      },
      footerVisible: function () {
        return this.showTime || this.selectionMode === 'dates';
      },
      visibleTime: function () {
        if (this.userInputTime !== null) {
          return this.userInputTime;
        } else {
          return formatDate(this.value || this.defaultValue, this.timeFormat);
        }
      },
      visibleDate: function () {
        if (this.userInputDate !== null) {
          return this.userInputDate;
        } else {
          return formatDate(this.value || this.defaultValue, this.dateFormat);
        }
      },
      yearLabel: function () {
        var yearTranslation = this.$t('vue.datepicker.year');
  
        if (this.currentView === 'year') {
          var startYear = Math.floor(this.year / 10) * 10;
  
          if (yearTranslation) {
            return startYear + ' ' + yearTranslation + ' - ' + (startYear + 9) + ' ' + yearTranslation;
          }
  
          return startYear + ' - ' + (startYear + 9);
        }
  
        return this.year + ' ' + yearTranslation;
      },
      timeFormat: function () {
        if (this.format) {
          return extractTimeFormat(this.format);
        } else {
          return 'HH:mm:ss';
        }
      },
      dateFormat: function () {
        if (this.format) {
          return extractDateFormat(this.format);
        } else {
          return 'yyyy-MM-dd';
        }
      }
    }
  };
  var DateRangePanel = {
    template: 
    '  <transition name="vue-zoom-in-top" @after-leave="$emit(\'destroyPopper\')">'+
    '    <div><div class="vue-aside__wrapper" v-if="isMobile"></div>'+
    '    <div'+
    '      v-show="visible"'+
    '      class="vue-picker-panel vue-date-range-picker vue-popper"'+
    '      :class="[{'+
    '        \'has-sidebar\': $slots.sidebar || shortcuts,'+
    '        \'has-time\': showTime'+
    '      }, popperClass]">'+
    '      <div class="vue-picker-panel__body-wrapper" style="position:relative">'+
    '        <slot name="sidebar" class="vue-picker-panel__sidebar"></slot>'+
    '        <div class="vue-picker-panel__sidebar" v-if="shortcuts">'+
    '          <button'+
    '            type="button"'+
    '            class="vue-picker-panel__shortcut"'+
    '            v-for="(shortcut, key) in shortcuts"'+
    '            :key="key"'+
    '            @click="handleShortcutClick(shortcut)">{{shortcut.text}}</button>'+
    '        </div>'+
    '        <div class="vue-picker-panel__body">'+
    '          <div class="vue-date-range-picker__time-header" v-if="showTime">'+
    '            <span class="vue-date-range-picker__editors-wrap">'+
    '              <span class="vue-date-range-picker__time-picker-wrap">'+
    '                <vue-input'+
    '                  size="small"'+
    '                  :disabled="rangeState.selecting"'+
    '                  ref="minInput"'+
    '                  :placeholder="$t(\'vue.datepicker.startDate\')"'+
    '                  class="vue-date-range-picker__editor"'+
    '                  :readonly="isMobile"'+
    '                  :value="minVisibleDate"'+
    '                  @input="function (val) {return handleDateInput(val, \'min\');}"'+
    '                  @change="function (val) {return handleDateChange(val, \'min\');}" />'+
    '              </span>'+
    '              <span class="vue-date-range-picker__time-picker-wrap" v-clickoutside="handleMinTimeClose" v-scrolling="handleMinTimeClose">'+
    '                <vue-input'+
    '                  size="small"'+
    '                  class="vue-date-range-picker__editor"'+
    '                  :disabled="rangeState.selecting"'+
    '                  :placeholder="$t(\'vue.datepicker.startTime\')"'+
    '                  :value="minVisibleTime"'+
    '                  :readonly="isMobile"'+
    '                  @focus="minTimePickerVisible = true"'+
    '                  @input="function (val) {return handleTimeInput(val, \'min\');}"'+
    '                  @change="function (val) {return handleTimeChange(val, \'min\');}" />'+
    '                <time-picker'+
    '                  ref="minTimePicker"'+
    '                  @pick="handleMinTimePick"'+
    '                  :time-arrow-control="arrowControl"'+
    '                  :visible="minTimePickerVisible"'+
    '                  @mounted="$refs.minTimePicker.format=timeFormat">'+
    '                </time-picker>'+
    '              </span>'+
    '            </span>'+
    
                //移动端时分行显示
    '            <span v-if="!isMobile" class="vue-icon-arrow-right"></span>'+
    '            <span v-if="!isMobile" class="vue-date-range-picker__editors-wrap is-right">'+
    '              <span class="vue-date-range-picker__time-picker-wrap">'+
    '                <vue-input'+
    '                  size="small"'+
    '                  class="vue-date-range-picker__editor"'+
    '                  :disabled="rangeState.selecting"'+
    '                  :placeholder="$t(\'vue.datepicker.endDate\')"'+
    '                  :value="maxVisibleDate"'+
    '                  :readonly="!minDate || isMobile"'+
    '                  @input="function (val) {return handleDateInput(val, \'max\');}"'+
    '                  @change="function (val) {return handleDateChange(val, \'max\');}" />'+
    '              </span>'+
    '              <span class="vue-date-range-picker__time-picker-wrap" v-clickoutside="handleMaxTimeClose" v-scrolling="handleMaxTimeClose">'+
    '                <vue-input'+
    '                  size="small"'+
    '                  class="vue-date-range-picker__editor"'+
    '                  :disabled="rangeState.selecting"'+
    '                  :placeholder="$t(\'vue.datepicker.endTime\')"'+
    '                  :value="maxVisibleTime"'+
    '                  :readonly="!minDate || isMobile"'+
    '                  @focus="minDate && (maxTimePickerVisible = true)"'+
    '                  @input="function (val) {return handleTimeInput(val, \'max\');}"'+
    '                  @change="function (val) {return handleTimeChange(val, \'max\');}" />'+
    '                <time-picker'+
    '                  ref="maxTimePicker"'+
    '                  @pick="handleMaxTimePick"'+
    '                  :time-arrow-control="arrowControl"'+
    '                  :visible="maxTimePickerVisible"'+
    '                  @mounted="$refs.maxTimePicker.format=timeFormat">'+
    '                </time-picker>'+
    '              </span>'+
    '            </span>'+

    '          </div>'+
    '          <div class="vue-picker-panel__content vue-date-range-picker__content is-left">'+
    '            <div class="vue-date-range-picker__header">'+
    '              <button'+
    '                type="button"'+
    '                @click="leftPrevYear"'+
    '                class="vue-picker-panel__icon-btn vue-icon-d-arrow-left"></button>'+
    '              <button'+
    '                type="button"'+
    '                @click="leftPrevMonth"'+
    '                class="vue-picker-panel__icon-btn vue-icon-arrow-left"></button>'+
    '              <button'+
    '                type="button"'+
    '                @click="leftNextYear"'+
    '                v-if="unlinkPanels"'+
    '                :disabled="!enableYearArrow"'+
    '                :class="{ \'is-disabled\': !enableYearArrow }"'+
    '                class="vue-picker-panel__icon-btn vue-icon-d-arrow-right"></button>'+
    '              <button'+
    '                type="button"'+
    '                @click="leftNextMonth"'+
    '                v-if="unlinkPanels"'+
    '                :disabled="!enableMonthArrow"'+
    '                :class="{ \'is-disabled\': !enableMonthArrow }"'+
    '                class="vue-picker-panel__icon-btn vue-icon-arrow-right"></button>'+
    '              <div>{{ leftLabel }}</div>'+
    '            </div>'+
    '            <date-table'+
    '              selection-mode="range"'+
    '              :date="leftDate"'+
    '              :default-value="defaultValue"'+
    '              :min-date="minDate"'+
    '              :max-date="maxDate"'+
    '              :range-state="rangeState"'+
    '              :disabled-date="disabledDate"'+
    '              @changerange="handleChangeRange"'+
    '              :first-day-of-week="firstDayOfWeek"'+
    '              @pick="handleRangePick">'+
    '            </date-table>'+
    '          </div>'+

              //移动端时分行显示
 //   '          <div class="vue-date-range-picker__time-header" style="text-align: center;" v-if="showTime&&isMobile">'+
 //   '            <span class="vue-icon-arrow-right"></span>'+
//  '          </div>'+
    '          <div class="vue-date-range-picker__time-header" v-if="showTime && isMobile">'+
    '            <span  class="vue-date-range-picker__editors-wrap is-right">'+
    '              <span class="vue-date-range-picker__time-picker-wrap">'+
    '                <vue-input'+
    '                  size="small"'+
    '                  class="vue-date-range-picker__editor"'+
    '                  :disabled="rangeState.selecting"'+
    '                  :placeholder="$t(\'vue.datepicker.endDate\')"'+
    '                  :value="maxVisibleDate"'+
    '                  :readonly="!minDate || isMobile"'+
    '                  @input="function (val) {return handleDateInput(val, \'max\');}"'+
    '                  @change="function (val) {return handleDateChange(val, \'max\');}" />'+
    '              </span>'+
    '              <span class="vue-date-range-picker__time-picker-wrap" v-clickoutside="handleMaxTimeClose" v-scrolling="handleMaxTimeClose">>'+
    '                <vue-input'+
    '                  size="small"'+
    '                  class="vue-date-range-picker__editor"'+
    '                  :disabled="rangeState.selecting"'+
    '                  :placeholder="$t(\'vue.datepicker.endTime\')"'+
    '                  :value="maxVisibleTime"'+
    '                  :readonly="!minDate || isMobile"'+
    '                  @focus="minDate && (maxTimePickerVisible = true)"'+
    '                  @input="function (val) {return handleTimeInput(val, \'max\');}"'+
    '                  @change="function (val) {return handleTimeChange(val, \'max\');}" />'+
    '                <time-picker'+
    '                  ref="maxTimePicker"'+
    '                  @pick="handleMaxTimePick"'+
    '                  :time-arrow-control="arrowControl"'+
    '                  :visible="maxTimePickerVisible"'+
    '                  @mounted="$refs.maxTimePicker.format=timeFormat">'+
    '                </time-picker>'+
    '              </span>'+
    '            </span>'+
    '          </div>'+

    '          <div class="vue-picker-panel__content vue-date-range-picker__content is-right">'+
    '            <div class="vue-date-range-picker__header">'+
    '              <button'+
    '                type="button"'+
    '                @click="rightPrevYear"'+
    '                v-if="unlinkPanels"'+
    '                :disabled="!enableYearArrow"'+
    '                :class="{ \'is-disabled\': !enableYearArrow }"'+
    '                class="vue-picker-panel__icon-btn vue-icon-d-arrow-left"></button>'+
    '              <button'+
    '                type="button"'+
    '                @click="rightPrevMonth"'+
    '                v-if="unlinkPanels"'+
    '                :disabled="!enableMonthArrow"'+
    '                :class="{ \'is-disabled\': !enableMonthArrow }"'+
    '                class="vue-picker-panel__icon-btn vue-icon-arrow-left"></button>'+
    '              <button'+
    '                type="button"'+
    '                @click="rightNextYear"'+
    '                class="vue-picker-panel__icon-btn vue-icon-d-arrow-right"></button>'+
    '              <button'+
    '                type="button"'+
    '                @click="rightNextMonth"'+
    '                class="vue-picker-panel__icon-btn vue-icon-arrow-right"></button>'+
    '              <div>{{ rightLabel }}</div>'+
    '            </div>'+
    '            <date-table'+
    '              selection-mode="range"'+
    '              :date="rightDate"'+
    '              :default-value="defaultValue"'+
    '              :min-date="minDate"'+
    '              :max-date="maxDate"'+
    '              :range-state="rangeState"'+
    '              :disabled-date="disabledDate"'+
    '              @changerange="handleChangeRange"'+
    '              :first-day-of-week="firstDayOfWeek"'+
    '              @pick="handleRangePick">'+
    '            </date-table>'+
    '          </div>'+
    '        </div>'+
    '      </div>'+
    '      <div class="vue-picker-panel__footer" v-if="showTime">'+
    '        <vue-button'+
    '          size="mini"'+
    '          type="text"'+
    '          class="vue-picker-panel__link-btn"'+
    '          @click="handleClear">'+
    '          {{ $t(\'vue.datepicker.clear\') }}'+
    '        </vue-button>'+
    '        <vue-button'+
    '          plain'+
    '          size="mini"'+
    '          class="vue-picker-panel__link-btn"'+
    '          :disabled="btnDisabled"'+
    '          @click="handleConfirm(false)">'+
    '          {{ $t(\'vue.datepicker.confirm\') }}'+
    '        </vue-button>'+
    '      </div>'+
    '    </div>'+
    '   </div>'+
    '  </transition>',
    components: {
      TimePicker: VueTimePicker,
      DateTable: DateTable
    },
    directives: {
      Clickoutside: VueUtil.component.clickoutside(),
      Scrolling: VueUtil.component.scrolling
    },
    computed: {
      btnDisabled: function () {
        return !(this.minDate && this.maxDate && !this.selecting && this.isValidValue([this.minDate, this.maxDate]));
      },
      leftLabel: function () {
        return this.leftDate.getFullYear() + ' ' + this.$t('vue.datepicker.year') + ' ' + this.$t('vue.datepicker.month'.concat(this.leftDate.getMonth() + 1));
      },
      rightLabel: function () {
        return this.rightDate.getFullYear() + ' ' + this.$t('vue.datepicker.year') + ' ' + this.$t('vue.datepicker.month'.concat(this.rightDate.getMonth() + 1));
      },
      leftYear: function () {
        return this.leftDate.getFullYear();
      },
      leftMonth: function () {
        return this.leftDate.getMonth();
      },
      leftMonthDate: function () {
        return this.leftDate.getDate();
      },
      rightYear: function () {
        return this.rightDate.getFullYear();
      },
      rightMonth: function () {
        return this.rightDate.getMonth();
      },
      rightMonthDate: function () {
        return this.rightDate.getDate();
      },
      minVisibleDate: function () {
        if (this.dateUserInput.min !== null) return this.dateUserInput.min;
        if (this.minDate) return formatDate(this.minDate, this.dateFormat);
        return '';
      },
      maxVisibleDate: function () {
        if (this.dateUserInput.max !== null) return this.dateUserInput.max;
        if (this.maxDate || this.minDate) return formatDate(this.maxDate || this.minDate, this.dateFormat);
        return '';
      },
      minVisibleTime: function () {
        if (this.timeUserInput.min !== null) return this.timeUserInput.min;
        if (this.minDate) return formatDate(this.minDate, this.timeFormat);
        return '';
      },
      maxVisibleTime: function () {
        if (this.timeUserInput.max !== null) return this.timeUserInput.max;
        if (this.maxDate || this.minDate){
          var tmpDate = this.maxDate ? this.maxDate : new Date(this.minDate);
          if(!this.maxDate && this.minDate)
            tmpDate.setHours(23,59,59);
          return formatDate(tmpDate, this.timeFormat);
        }
        return '';
      },
      timeFormat: function () {
        if (this.format) {
          return extractTimeFormat(this.format);
        } else {
          return 'HH:mm:ss';
        }
      },
      dateFormat: function () {
        if (this.format) {
          return extractDateFormat(this.format);
        } else {
          return 'yyyy-MM-dd';
        }
      },
      enableMonthArrow: function () {
        var nextMonth = (this.leftMonth + 1) % 12;
        var yearOffset = this.leftMonth + 1 >= 12 ? 1 : 0;
        return this.unlinkPanels && new Date(this.leftYear + yearOffset, nextMonth) < new Date(this.rightYear, this.rightMonth);
      },
      enableYearArrow: function () {
        return this.unlinkPanels && this.rightYear * 12 + this.rightMonth - (this.leftYear * 12 + this.leftMonth + 1) >= 12;
      }
    },
    data: function () {
      return {
        popperClass: '',
        value: [],
        defaultValue: null,
        defaultTime: null,
        minDate: '',
        maxDate: '',
        leftDate: new Date(),
        rightDate: nextMonth(new Date()),
        rangeState: {
          endDate: null,
          selecting: false,
          row: null,
          column: null
        },
        showTime: false,
        shortcuts: '',
        visible: '',
        disabledDate: '',
        firstDayOfWeek: 7,
        minTimePickerVisible: false,
        maxTimePickerVisible: false,
        format: '',
        arrowControl: false,
        unlinkPanels: false,
        dateUserInput: {
          min: null,
          max: null
        },
        timeUserInput: {
          min: null,
          max: null
        },
        isMobile: VueUtil.getSystemInfo().device == 'Mobile' && VueUtil.getSystemInfo().isLoadMobileJs ? true : false,
      };
    },
    watch: {
      visible: function (val) {
        var self = this;
        if(val){
         
          this.$nextTick(function () {
            if(self.$refs.minInput){
              self.$refs.minInput.focus();
            }
          
          });
        }
        
      },
      minDate: function (val) {
        var self = this;
        this.dateUserInput.min = null;
        this.timeUserInput.min = null;
        this.$nextTick(function () {
          if (self.$refs.maxTimePicker && self.maxDate && self.maxDate < self.minDate) {
            var format = 'HH:mm:ss';
            self.$refs.maxTimePicker.selectableRange = [[parseDate(formatDate(self.minDate, format), format), parseDate('23:59:59', format)]];
          }
        });
  
        if (val && this.$refs.minTimePicker) {
          this.$refs.minTimePicker.date = val;
          this.$refs.minTimePicker.value = val;
        }
      },
      maxDate: function (val) {
        this.dateUserInput.max = null;
        this.timeUserInput.max = null;
  
        if (val && this.$refs.maxTimePicker) {
          this.$refs.maxTimePicker.date = val;
          this.$refs.maxTimePicker.value = val;
        }
      },
      minTimePickerVisible: function (val) {
        var self = this;
         
        if (val) {
          this.$nextTick(function () {
            self.$refs.minTimePicker.date = self.minDate;
            self.$refs.minTimePicker.value = self.minDate;
  
            self.$refs.minTimePicker.adjustSpinners();
          });
        }
      },
      maxTimePickerVisible: function (val) {
        var self = this;
        if (val) {
          this.$nextTick(function () {
            self.$refs.maxTimePicker.date = self.maxDate;
            self.$refs.maxTimePicker.value = self.maxDate;
  
            self.$refs.maxTimePicker.adjustSpinners();
          });
        }
      },
      value: function (newVal) {
        if (!newVal) {
          this.minDate = null;
          this.maxDate = null;
        } else if (Array.isArray(newVal)) {
          this.minDate = isDate(newVal[0]) ? new Date(newVal[0]) : null;
          this.maxDate = isDate(newVal[1]) ? new Date(newVal[1]) : null;
          if (this.minDate) {
            this.leftDate = this.minDate;
  
            var minDateYear;
            var minDateMonth;
            var maxDateYear;
            var maxDateMonth;

            if (this.unlinkPanels && this.maxDate) {
              minDateYear = this.minDate.getFullYear();
              minDateMonth = this.minDate.getMonth();
              maxDateYear = this.maxDate.getFullYear();
              maxDateMonth = this.maxDate.getMonth();
              this.rightDate = minDateYear === maxDateYear && minDateMonth === maxDateMonth ? nextMonth(this.maxDate) : this.maxDate;
            } else {
              this.rightDate = nextMonth(this.leftDate);
            }
          } else if (this.maxDate) {
            this.rightDate = this.maxDate;
  
            if (this.unlinkPanels && this.minDate) {
              minDateYear = this.minDate.getFullYear();
              minDateMonth = this.minDate.getMonth();
              maxDateYear = this.maxDate.getFullYear();
              maxDateMonth = this.maxDate.getMonth();
              this.leftDate = minDateYear === maxDateYear && minDateMonth === maxDateMonth ? prevMonth(this.minDate) : this.minDate;
            } else {
              this.leftDate = prevMonth(this.rightDate);
            }
          } else {
            this.leftDate = calcDefaultValue(this.defaultValue)[0];
            this.rightDate = nextMonth(this.leftDate);
          }
        }
      },

      defaultValue: function (val) {
        if (!Array.isArray(this.value)) {
          var _calcDefaultValue = calcDefaultValue(val),
              left = _calcDefaultValue[0],
              right = _calcDefaultValue[1];
  
          this.leftDate = left;
          this.rightDate = val && val[1] && this.unlinkPanels ? right : nextMonth(this.leftDate);
        }
      }
    },
    methods: {
      handleClear: function () {
        this.minDate = null;
        this.maxDate = null;
        this.leftDate = calcDefaultValue(this.defaultValue)[0];
        this.rightDate = nextMonth(this.leftDate);
        this.$emit('pick', null);
      },
      handleChangeRange: function (val) {
        this.minDate = val.minDate;
        this.maxDate = val.maxDate;
        this.rangeState = val.rangeState;
      },
      handleDateInput: function (value, type) {
        this.dateUserInput[type] = value;
        if (value.length !== this.dateFormat.length) return;
        var parsedValue = parseDate(value, this.dateFormat);
  
        if (parsedValue) {
          if (typeof this.disabledDate === 'function' && this.disabledDate(new Date(parsedValue))) {
            return;
          }
  
          if (type === 'min') {
            this.minDate = modifyDate(this.minDate || new Date(), parsedValue.getFullYear(), parsedValue.getMonth(), parsedValue.getDate());
            this.leftDate = new Date(parsedValue);
  
            if (!this.unlinkPanels) {
              this.rightDate = nextMonth(this.leftDate);
            }
          } else {
            this.maxDate = modifyDate(this.maxDate || new Date(), parsedValue.getFullYear(), parsedValue.getMonth(), parsedValue.getDate());
            this.rightDate = new Date(parsedValue);
  
            if (!this.unlinkPanels) {
              this.leftDate = prevMonth(parsedValue);
            }
          }
        }
      },
      handleDateChange: function (value, type) {
        var parsedValue = parseDate(value, this.dateFormat);
        if (parsedValue) {
          if (type === 'min') {
            this.minDate = modifyDate(this.minDate, parsedValue.getFullYear(), parsedValue.getMonth(), parsedValue.getDate());
  
            if (this.minDate > this.maxDate) {
              this.maxDate = this.minDate;
            }
          } else {
            this.maxDate = modifyDate(this.maxDate, parsedValue.getFullYear(), parsedValue.getMonth(), parsedValue.getDate());
  
            if (this.maxDate < this.minDate) {
              this.minDate = this.maxDate;
            }
          }
        }
      },
      handleTimeInput: function (value, type) {
        var self = this;
        this.timeUserInput[type] = value;
        if (value.length !== this.timeFormat.length) return;
        var parsedValue = parseDate(value, this.timeFormat);
  
        if (parsedValue) {
          if (type === 'min') {
            this.minDate = modifyTime(this.minDate, parsedValue.getHours(), parsedValue.getMinutes(), parsedValue.getSeconds());
            this.$nextTick(function (_) {
              return self.$refs.minTimePicker.adjustSpinners();
            });
          } else {
            this.maxDate = modifyTime(this.maxDate, parsedValue.getHours(), parsedValue.getMinutes(), parsedValue.getSeconds());
            this.$nextTick(function (_) {
              return self.$refs.maxTimePicker.adjustSpinners();
            });
          }
        }
      },
      handleTimeChange: function (value, type) {
        var parsedValue = parseDate(value, this.timeFormat);
  
        if (parsedValue) {
          if (type === 'min') {
            this.minDate = modifyTime(this.minDate, parsedValue.getHours(), parsedValue.getMinutes(), parsedValue.getSeconds());
  
            if (this.minDate > this.maxDate) {
              this.maxDate = this.minDate;
            }
  
            this.$refs.minTimePicker.value = this.minDate;
            this.minTimePickerVisible = false;
          } else {
            this.maxDate = modifyTime(this.maxDate, parsedValue.getHours(), parsedValue.getMinutes(), parsedValue.getSeconds());
  
            if (this.maxDate < this.minDate) {
              this.minDate = this.maxDate;
            }
  
            this.$refs.maxTimePicker.value = this.minDate;
            this.maxTimePickerVisible = false;
          }
        }
      },
      handleRangePick: function (val) {
        var self = this;
        var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var defaultTime = this.defaultTime || [];
        var minDate = modifyWithTimeString(val.minDate, defaultTime[0]);
        var maxDate = modifyWithTimeString(val.maxDate, defaultTime[1]);
        if (this.maxDate === maxDate && this.minDate === minDate) {
          return;
        }
  
        this.onPick && this.onPick(val);
  
        if(maxDate){
          maxDate.setHours(23,59,59);
        }
        self.maxDate = maxDate;
        self.minDate = minDate;
        if (!close || this.showTime) return;
        this.handleConfirm();
      },
      handleShortcutClick: function (shortcut) {
        if (shortcut.onClick) {
          shortcut.onClick(this);
        }
      },
      handleMinTimePick: function (value, visible, first) {
        this.minDate = this.minDate || new Date();
  
        if (value) {
          this.minDate = modifyTime(this.minDate, value.getHours(), value.getMinutes(), value.getSeconds());
        }
  
        if (!first) {
          this.minTimePickerVisible = visible;
        }
  
        if (!this.maxDate || this.maxDate && this.maxDate.getTime() < this.minDate.getTime()) {
          this.maxDate = new Date(this.minDate);
        }
      },
      handleMinTimeClose: function () {
        this.minTimePickerVisible = false;
      },
      handleMaxTimePick: function (value, visible, first) {

        if (this.maxDate && value) {
          this.maxDate = modifyTime(this.maxDate, value.getHours(), value.getMinutes(), value.getSeconds());
        }
  
        if (!first) {
          this.maxTimePickerVisible = visible;
        }
  
        if (this.maxDate && this.minDate && this.minDate.getTime() > this.maxDate.getTime()) {
          this.minDate = new Date(this.maxDate);
        }
      },
      handleMaxTimeClose: function () {
        this.maxTimePickerVisible = false;
      },
      // leftPrev*, rightNext* need to take care of `unlinkPanels`
      leftPrevYear: function () {
        this.leftDate = prevYear(this.leftDate);
  
        if (!this.unlinkPanels) {
          this.rightDate = nextMonth(this.leftDate);
        }
      },
      leftPrevMonth: function () {
        this.leftDate = prevMonth(this.leftDate);
  
        if (!this.unlinkPanels) {
          this.rightDate = nextMonth(this.leftDate);
        }
      },
      rightNextYear: function () {
        if (!this.unlinkPanels) {
          this.leftDate = nextYear(this.leftDate);
          this.rightDate = nextMonth(this.leftDate);
        } else {
          this.rightDate = nextYear(this.rightDate);
        }
      },
      rightNextMonth: function () {
        if (!this.unlinkPanels) {
          this.leftDate = nextMonth(this.leftDate);
          this.rightDate = nextMonth(this.leftDate);
        } else {
          this.rightDate = nextMonth(this.rightDate);
        }
      },
      // leftNext*, rightPrev* are called when `unlinkPanels` is true
      leftNextYear: function () {
        this.leftDate = nextYear(this.leftDate);
      },
      leftNextMonth: function () {
        this.leftDate = nextMonth(this.leftDate);
      },
      rightPrevYear: function () {
        this.rightDate = prevYear(this.rightDate);
      },
      rightPrevMonth: function () {
        this.rightDate = prevMonth(this.rightDate);
      },
      handleConfirm: function () {
        var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  
        if (this.isValidValue([this.minDate, this.maxDate])) {
          this.$emit('pick', [this.minDate, this.maxDate], visible);
        }
      },
      isValidValue: function (value) {
        return Array.isArray(value) && value && value[0] && value[1] && isDate(value[0]) && isDate(value[1]) && value[0].getTime() <= value[1].getTime() && (typeof this.disabledDate === 'function' ? !this.disabledDate(value[0]) && !this.disabledDate(value[1]) : true);
      },
      resetView: function () {
        // NOTE: this is a hack to reset {min, max}Date on picker open.
        // TODO: correct way of doing so is to refactor {min, max}Date to be dependent on value and internal selection state
        //       an alternative would be resetView whenever picker becomes visible, should also investigate date-panel's resetView
        this.minDate = this.value && isDate(this.value[0]) ? new Date(this.value[0]) : null;
        this.maxDate = this.value && isDate(this.value[0]) ? new Date(this.value[1]) : null;
      }
    }
  };

  var MonthRangePanel = {
    template: ' <transition name="vue-zoom-in-top" @after-leave="$emit(\'destroyPopper\')"> '
    + '   <div '
    + '     v-show="visible" '
    + '     class="vue-picker-panel vue-date-range-picker vue-popper" '
    + '     :class="[{ '
    + '       \'has-sidebar\': $slots.sidebar || shortcuts '
    + '     }, popperClass]"> '
    + '     <div class="vue-picker-panel__body-wrapper"> ' //style="position:relative"
    + '       <slot name="sidebar" class="vue-picker-panel__sidebar"></slot> ' 
    + '       <div class="vue-picker-panel__sidebar" v-if="shortcuts"> '
    + '         <button '
    + '           type="button" '
    + '           class="vue-picker-panel__shortcut" '
    + '           v-for="(shortcut, key) in shortcuts" '
    + '           :key="key" '
    + '           @click="handleShortcutClick(shortcut)">{{shortcut.text}}</button> '
    + '       </div> '
    + '       <div class="vue-picker-panel__body"> '
    + '         <div class="vue-picker-panel__content vue-date-range-picker__content is-left"> '
    + '           <div class="vue-date-range-picker__header"> '
    + '             <button '
    + '               type="button" '
    + '               @click="leftPrevYear" '
    + '               class="vue-picker-panel__icon-btn vue-icon-d-arrow-left"></button> '
    + '             <button '
    + '               type="button" '
    + '               v-if="unlinkPanels" '
    + '               @click="leftNextYear" '
    + '               :disabled="!enableYearArrow" '
    + '               :class="{ \'is-disabled\': !enableYearArrow }" '
    + '               class="vue-picker-panel__icon-btn vue-icon-d-arrow-right"></button> '
    + '             <div>{{ leftLabel }}</div> '
    + '           </div> '
    + '           <month-table '
    + '             selection-mode="range" '
    + '             :date="leftDate" '
    + '             :default-value="defaultValue" '
    + '             :min-date="minDate" '
    + '             :max-date="maxDate" '
    + '             :range-state="rangeState" '
    + '             :disabled-date="disabledDate" '
    + '             @changerange="handleChangeRange" '
    + '             @pick="handleRangePick"> '
    + '           </month-table> '
    + '         </div> '
    + '         <div class="vue-picker-panel__content vue-date-range-picker__content is-right"> '
    + '           <div class="vue-date-range-picker__header"> '
    + '             <button '
    + '               type="button" '
    + '               v-if="unlinkPanels" '
    + '               @click="rightPrevYear" '
    + '               :disabled="!enableYearArrow" '
    + '               :class="{ \'is-disabled\': !enableYearArrow }" '
    + '               class="vue-picker-panel__icon-btn vue-icon-d-arrow-left"></button> '
    + '             <button '
    + '               type="button" '
    + '               @click="rightNextYear" '
    + '               class="vue-picker-panel__icon-btn vue-icon-d-arrow-right"></button> '
    + '             <div>{{ rightLabel }}</div> '
    + '           </div> '
    + '           <month-table '
    + '             selection-mode="range" '
    + '             :date="rightDate" '
    + '             :default-value="defaultValue" '
    + '             :min-date="minDate" '
    + '             :max-date="maxDate" '
    + '             :range-state="rangeState" '
    + '             :disabled-date="disabledDate" '
    + '             @changerange="handleChangeRange" '
    + '             @pick="handleRangePick"> '
    + '           </month-table> '
    + '         </div> '
    + '       </div> '
    + '     </div> '
    + '   </div> '
    + ' </transition> ',
    components: {
      MonthTable:MonthTable
    },
    directives: {
      Clickoutside: VueUtil.component.clickoutside()
    },
    computed: {
      btnDisabled: function () {
        return !(this.minDate && this.maxDate && !this.selecting && this.isValidValue([this.minDate, this.maxDate]));
      },

      leftLabel: function () {
        return this.leftDate.getFullYear() + ' ' + this.$t('vue.datepicker.year');
      },

      rightLabel: function () {
        return this.rightDate.getFullYear() + ' ' + this.$t('vue.datepicker.year');
      },

      leftYear: function () {
        return this.leftDate.getFullYear();
      },

      rightYear: function () {
        return this.rightDate.getFullYear() === this.leftDate.getFullYear() ? this.leftDate.getFullYear() + 1 : this.rightDate.getFullYear();
      },

      enableYearArrow: function () {
        return this.unlinkPanels && this.rightYear > this.leftYear + 1;
      }
    },
    data: function () {
      return {
        popperClass: '',
        value: [],
        defaultValue: null,
        defaultTime: null,
        minDate: '',
        maxDate: '',
        leftDate: new Date(),
        rightDate: nextYear(new Date()),
        rangeState: {
          endDate: null,
          selecting: false,
          row: null,
          column: null
        },
        shortcuts: '',
        visible: '',
        disabledDate: '',
        format: '',
        arrowControl: false,
        unlinkPanels: false
      };
    },

    watch: {
      value: function(newVal) {
        if (!newVal) {
          this.minDate = null;
          this.maxDate = null;
        } else if (Array.isArray(newVal)) {
          this.minDate = isDate(newVal[0]) ? new Date(newVal[0]) : null;
          this.maxDate = isDate(newVal[1]) ? new Date(newVal[1]) : null;
          if (this.minDate) {
            this.leftDate = this.minDate;
            if (this.unlinkPanels && this.maxDate) {
              var minDateYear = this.minDate.getFullYear();
              var maxDateYear = this.maxDate.getFullYear();
              this.rightDate = minDateYear === maxDateYear
                ? nextYear(this.maxDate)
                : this.maxDate;
            } else {
              this.rightDate = nextYear(this.leftDate);
            }
          } else {
            this.leftDate = calcDefaultValue(this.defaultValue)[0];
            this.rightDate = nextYear(this.leftDate);
          }
        }
      },

      defaultValue: function(val) {
        if (!Array.isArray(this.value)) {
          var defaultVal = calcDefaultValue(val);
          var left= defaultVal[0];
          var right = defaultVal[1];
          this.leftDate = left;
          this.rightDate = val && val[1] && left.getFullYear() !== right.getFullYear() && this.unlinkPanels
            ? right
            : nextYear(this.leftDate);
        }
      }
    },
    methods: {
      handleClear: function () {
        this.minDate = null;
        this.maxDate = null;
        this.leftDate = calcDefaultValue(this.defaultValue)[0];
        this.rightDate = nextYear(this.leftDate);
        this.$emit('pick', null);
      },
      handleChangeRange: function (val) {
        this.minDate = val.minDate;
        this.maxDate = val.maxDate;
        this.rangeState = val.rangeState;
      },
      handleRangePick: function (val) {
        var self = this;
  
        var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var defaultTime = this.defaultTime || [];
        var minDate = modifyWithTimeString(val.minDate, defaultTime[0]);
        var maxDate = modifyWithTimeString(val.maxDate, defaultTime[1]);
  
        if (this.maxDate === maxDate && this.minDate === minDate) {
          return;
        }
  
        this.onPick && this.onPick(val);
        this.maxDate = maxDate;
        this.minDate = minDate;
  
        setTimeout(function () {
          self.maxDate = maxDate;
          self.minDate = minDate;
        }, 10);
        if (!close) return;
        this.handleConfirm();
      },
      handleShortcutClick: function (shortcut) {
        if (shortcut.onClick) {
          shortcut.onClick(this);
        }
      },
      // leftPrev*, rightNext* need to take care of `unlinkPanels`
      leftPrevYear: function leftPrevYear() {
        this.leftDate = prevYear(this.leftDate);
  
        if (!this.unlinkPanels) {
          this.rightDate = prevYear(this.rightDate);
        }
      },
      rightNextYear: function () {
        if (!this.unlinkPanels) {
          this.leftDate = nextYear(this.leftDate);
        }
  
        this.rightDate = nextYear(this.rightDate);
      },
      // leftNext*, rightPrev* are called when `unlinkPanels` is true
      leftNextYear: function () {
        this.leftDate = nextYear(this.leftDate);
      },
      rightPrevYear: function () {
        this.rightDate = prevYear(this.rightDate);
      },
      handleConfirm: function () {
        var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  
        if (this.isValidValue([this.minDate, this.maxDate])) {
          this.$emit('pick', [this.minDate, this.maxDate], visible);
        }
      },
      isValidValue: function (value) {
        return Array.isArray(value) && value && value[0] && value[1] && isDate(value[0]) && isDate(value[1]) && value[0].getTime() <= value[1].getTime() && (typeof this.disabledDate === 'function' ? !this.disabledDate(value[0]) && !this.disabledDate(value[1]) : true);
      },
      resetView: function () {
        // NOTE: this is a hack to reset {min, max}Date on picker open.
        // TODO: correct way of doing so is to refactor {min, max}Date to be dependent on value and internal selection state
        //       an alternative would be resetView whenever picker becomes visible, should also investigate date-panel's resetView
        this.minDate = this.value && isDate(this.value[0]) ? new Date(this.value[0]) : null;
        this.maxDate = this.value && isDate(this.value[0]) ? new Date(this.value[1]) : null;
      }
    },
  };

  var getPanel = function (type) {
    
    if (type === 'daterange' || type === 'datetimerange') {
      return DateRangePanel;
    } else if (type === 'monthrange') {
      return MonthRangePanel;
    }
  
    return DatePanel;
  };
  var VueDatePicker = {
    mixins: [VuePicker],
    name: 'VueDatePicker',
    props: {
      type: {
        type: String,
        default: 'date'
      },
      timeArrowControl: Boolean,
      appendToSelf: Boolean
    },
    watch: {
      type: function (_type) {
        if (this.picker) {
          this.unmountPicker();
          this.panel = getPanel(_type);
          this.mountPicker();
        } else {
          this.panel = getPanel(_type);
        }
      }
    },
    created: function () {
      this.panel = getPanel(this.type);
    },
    mounted: function () {
      this.appendToSelf && (this.append = this.$el);
    }
  };
  Vue.component(VueDatePicker.name, VueDatePicker);
  return function() {
    return {
      DatePanel: DatePanel,
      YearTable: YearTable,
      MonthTable: MonthTable
    };
  };
});
