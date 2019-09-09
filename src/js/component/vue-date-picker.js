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
        lastColumn: null
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
    '    <div tabindex="-1" style="outline:none;" ref="datePanelDiv"><div class="vue-aside__wrapper" v-if="isMobile()"></div>'+
    '    <div'+
    '      v-show="visible"'+
    '      class="vue-picker-panel vue-date-picker vue-popper"'+
    '      :class="[{'+
    '        \'has-sidebar\': $slots.sidebar || shortcuts,'+
    '        \'has-time\': showTime'+
    '      }, popperClass]">'+
    '      <div class="vue-picker-panel__body-wrapper">'+
    '        <slot name="sidebar" class="vue-picker-panel__sidebar"></slot>'+
    '        <div class="vue-picker-panel__sidebar" v-if="shortcuts">'+
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
    '            <span class="vue-date-picker__editor-wrap" v-clickoutside="handleTimePickClose">'+
    '              <vue-input'+
    '                ref="input"'+
    '                @focus="timePickerVisible = true"'+
    '                :placeholder="$t(\'vue.datepicker.selectTime\')"'+
    '                :value="visibleTime"'+
    '                size="small"'+
    '                @input="function (val) { return userInputTime = val;}"'+
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
    '          <div'+
    '            class="vue-date-picker__header"'+
    '            :class="{ \'vue-date-picker__header--bordered\': currentView === \'year\' || currentView === \'month\' }"'+
    '            v-show="currentView !== \'time\'">'+
    '            <button'+
    '              type="button"'+
    '              @click="prevYear"'+
    '              :aria-label="$t(\'vue.datepicker.prevYear\')"'+
    '              class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-d-arrow-left">'+
    '            </button>'+
    '            <button'+
    '              type="button"'+
    '              @click="prevMonth"'+
    '              v-show="currentView === \'date\'"'+
    '              :aria-label="$t(\'vue.datepicker.prevMonth\')"'+
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
    '              :aria-label="$t(\'vue.datepicker.nextYear\')"'+
    '              class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-d-arrow-right">'+
    '            </button>'+
    '            <button'+
    '              type="button"'+
    '              @click="nextMonth"'+
    '              v-show="currentView === \'date\'"'+
    '              :aria-label="$t(\'vue.datepicker.nextMonth\')"'+
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
      Clickoutside: VueUtil.component.clickoutside()
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
           
            self.$refs.datePanelDiv.focus();
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
      isMobile:function(){
        return _isMobile();
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
        userInputTime: null
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
    '    <div><div class="vue-aside__wrapper" v-if="isMobile()"></div>'+
    '    <div'+
    '      v-show="visible"'+
    '      class="vue-picker-panel vue-date-range-picker vue-popper"'+
    '      :class="[{'+
    '        \'has-sidebar\': $slots.sidebar || shortcuts,'+
    '        \'has-time\': showTime'+
    '      }, popperClass]">'+
    '      <div class="vue-picker-panel__body-wrapper">'+
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
    '                  :value="minVisibleDate"'+
    '                  @input="function (val) {return handleDateInput(val, \'min\');}"'+
    '                  @change="function (val) {return handleDateChange(val, \'min\');}" />'+
    '              </span>'+
    '              <span class="vue-date-range-picker__time-picker-wrap" v-clickoutside="handleMinTimeClose">'+
    '                <vue-input'+
    '                  size="small"'+
    '                  class="vue-date-range-picker__editor"'+
    '                  :disabled="rangeState.selecting"'+
    '                  :placeholder="$t(\'vue.datepicker.startTime\')"'+
    '                  :value="minVisibleTime"'+
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
    '            <span v-if="!isMobile()" class="vue-icon-arrow-right"></span>'+
    '            <span v-if="!isMobile()" class="vue-date-range-picker__editors-wrap is-right">'+
    '              <span class="vue-date-range-picker__time-picker-wrap">'+
    '                <vue-input'+
    '                  size="small"'+
    '                  class="vue-date-range-picker__editor"'+
    '                  :disabled="rangeState.selecting"'+
    '                  :placeholder="$t(\'vue.datepicker.endDate\')"'+
    '                  :value="maxVisibleDate"'+
    '                  :readonly="!minDate"'+
    '                  @input="function (val) {return handleDateInput(val, \'max\');}"'+
    '                  @change="function (val) {return handleDateChange(val, \'max\');}" />'+
    '              </span>'+
    '              <span class="vue-date-range-picker__time-picker-wrap" v-clickoutside="handleMaxTimeClose">'+
    '                <vue-input'+
    '                  size="small"'+
    '                  class="vue-date-range-picker__editor"'+
    '                  :disabled="rangeState.selecting"'+
    '                  :placeholder="$t(\'vue.datepicker.endTime\')"'+
    '                  :value="maxVisibleTime"'+
    '                  :readonly="!minDate"'+
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
 //   '          <div class="vue-date-range-picker__time-header" style="text-align: center;" v-if="showTime&&isMobile()">'+
 //   '            <span class="vue-icon-arrow-right"></span>'+
//  '          </div>'+
    '          <div class="vue-date-range-picker__time-header" v-if="showTime&&isMobile()">'+
    '            <span  class="vue-date-range-picker__editors-wrap is-right">'+
    '              <span class="vue-date-range-picker__time-picker-wrap">'+
    '                <vue-input'+
    '                  size="small"'+
    '                  class="vue-date-range-picker__editor"'+
    '                  :disabled="rangeState.selecting"'+
    '                  :placeholder="$t(\'vue.datepicker.endDate\')"'+
    '                  :value="maxVisibleDate"'+
    '                  :readonly="!minDate"'+
    '                  @input="function (val) {return handleDateInput(val, \'max\');}"'+
    '                  @change="function (val) {return handleDateChange(val, \'max\');}" />'+
    '              </span>'+
    '              <span class="vue-date-range-picker__time-picker-wrap" v-clickoutside="handleMaxTimeClose">'+
    '                <vue-input'+
    '                  size="small"'+
    '                  class="vue-date-range-picker__editor"'+
    '                  :disabled="rangeState.selecting"'+
    '                  :placeholder="$t(\'vue.datepicker.endTime\')"'+
    '                  :value="maxVisibleTime"'+
    '                  :readonly="!minDate"'+
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
      Clickoutside: VueUtil.component.clickoutside()
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
        if (this.maxDate || this.minDate) return formatDate(this.maxDate || this.minDate, this.timeFormat);
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
        }
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
  
            if (this.unlinkPanels && this.maxDate) {
              var minDateYear = this.minDate.getFullYear();
              var minDateMonth = this.minDate.getMonth();
              var maxDateYear = this.maxDate.getFullYear();
              var maxDateMonth = this.maxDate.getMonth();
              this.rightDate = minDateYear === maxDateYear && minDateMonth === maxDateMonth ? nextMonth(this.maxDate) : this.maxDate;
            } else {
              this.rightDate = nextMonth(this.leftDate);
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
      isMobile:function(){
        return _isMobile();
      },handleClear: function () {
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
  
//  alert('handleRangePick..');
//  alert(JSON.stringify(arguments))
        var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var defaultTime = this.defaultTime || [];
        var minDate = modifyWithTimeString(val.minDate, defaultTime[0]);
        var maxDate = modifyWithTimeString(val.maxDate, defaultTime[1]);
  
        if (this.maxDate === maxDate && this.minDate === minDate) {
          return;
        }
  
        this.onPick && this.onPick(val);
        this.maxDate = maxDate;
        this.minDate = minDate; // workaround for https://github.com/ElemeFE/element/issues/7539, should remove this block when we don't have to care about Chromium 55 - 57
  
        setTimeout(function () {
          self.maxDate = maxDate;
          self.minDate = minDate;
        }, 10);
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

  

  /***********add by huangyw at 2019-10-18 for mobile datepicker ***** start ***********/

  var MASK_TEMPLATE = '<div class="dp-mask"></div>';

  var TEMPLATE = '<div class="dp-container" >'+
    '<div class="dp-header">'+
    '  <div class="dp-item dp-left vux-datetime-cancel" data-role="cancel">cancel</div>'+
    //' <div class="dp-item vux-datetime-clear" data-role="clear"></div>'+
    ' <div class="dp-item dp-right vux-datetime-confirm" data-role="confirm">ok</div>'+
    '</div>'+
    '<div class="dp-content">'+
    ' <div class="dp-item" data-role="year"></div>'+
    ' <div class="dp-item" data-role="month"></div>'+
    ' <div class="dp-item" data-role="day" style="flex:1.2;"></div>'+
    ' <div class="dp-item" data-role="hour"></div>'+
    ' <div class="dp-item" data-role="minute"></div>'+
    ' <div class="dp-item" data-role="second"></div>'+
    '</div>'+
    '</div>';
  
  var SHOW_ANIMATION_TIME = 100; // ms
  var SHOW_CONTAINER_TIME = 300;
  
  var TYPE_MAP = {
    year: ['YYYY'],
    month: ['MM', 'M'],
    day: ['DD', 'D'],
    hour: ['HH', 'H'],
    minute: ['mm', 'm'],
    second: ['ss', 's']
  };
  
  var MASK = null;
  
  var CURRENT_PICKER;
  
  var NOW = new Date();
  
  var DEFAULT_CONFIG = {
    template: TEMPLATE,
    trigger: null,
    output: null,
    currentYear: NOW.getFullYear(),
    currentMonth: NOW.getMonth() + 1,
    minYear: 2000,
    maxYear: 2099,
    minHour: 0,
    maxHour: 23,
    hourList: null,
    minuteList: null,
    startDate: null,
    endDate: null,
    yearRow: '{value}',
    monthRow: '{value}',
    dayRow: '{value}',
    hourRow: '{value}',
    minuteRow: '{value}',
    secondRow: '{value}',
    format: 'YYYY-MM-DD',
    value: NOW.getFullYear() + '-' + (NOW.getMonth() + 1) + '-' + NOW.getDate(),
    onSelect:function () {},
    onConfirm:function () {},
    onClear:function () {},
    onShow:function () {},
    onHide:function () {},
    confirmText: 'ok',
    clearText: 'clear',
    cancelText: 'cancel',
    destroyOnHide: false,
    renderInline: false
  };
  
  var jim = {// 添加星期
    currentYear: NOW.getFullYear(),
    currentMonth: NOW.getMonth() + 1,    
  };
  
  function renderScroller (el, data, value, fn) {
    // console.log("renderScroller",value);
    var cloneData = [];
    for(var i=0;i<data.length;i++){
       var c = {};
       c.name = data[i].name;
       c.value = data[i].value + '';
       cloneData.push(c);
    }
    
    data = cloneData;
   /* data = data.map(function(one) {
      one.value = one.value + '';
      return one;
    });*/
  
    return new Scroller(el, {
      data:data,
      defaultValue: value + '',
      onSelect: fn
    });
  }
  
  function showMask () {
    if (!MASK) {
      MASK = toElement(MASK_TEMPLATE);
      document.body.appendChild(MASK);
  
      MASK.addEventListener('click', function () {
        CURRENT_PICKER && CURRENT_PICKER.hide()
      }, false);
    }
  
    MASK.style.display = 'block'
  
    setTimeout(function () {
      MASK && (MASK.style.opacity = 0.5)
    }, 0);
  }
  
  function hideMask () {
    if (!MASK) {
      return;
    }
  
    MASK.style.opacity = 0;
  
    setTimeout(function () {
      MASK && (MASK.style.display = 'none');
    }, SHOW_ANIMATION_TIME);
  }

  function each (obj, fn) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (fn.call(obj[key], key, obj[key]) === false) {
          break;
        }
      }
    }
  }
  function trimZero (val) {
    val = String(val);
    val = val ? parseFloat(val.replace(/^0+/g, '')) : '';
    val = val || 0;
    val = val + '';
    return val;
  }
  function addZero (val) {
    val = String(val);
    return val.length < 2 ? '0' + val : val;
  }
  function getMaxDay (year, month) {
    year = parseFloat(year);
    month = parseFloat(month);
    if (month === 2) {
      return isLeapYear(year) ? 29 : 28;
    }
    return [4, 6, 9, 11].indexOf(month) >= 0 ? 30 : 31;
  }

  function formater(date, fmt ) {
    fmt = fmt || 'YYYY-MM-DD HH:mm:ss';
    var o = {
      'M+': date.getMonth() + 1,
      'D+': date.getDate(),
      'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    }
    var week = {
      '0': '\u65e5',
      '1': '\u4e00',
      '2': '\u4e8c',
      '3': '\u4e09',
      '4': '\u56db',
      '5': '\u4e94',
      '6': '\u516d'
    }
    if (/(Y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + '']);
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return fmt
  }
  
  
  function parseRow (tmpl, value) {
    return tmpl.replace(/\{value\}/g, value);
  }
  // parse Date String
  function pickerParseDate (format, value) {
    var formatParts = format.split(/[^A-Za-z]+/);
    
    if(value instanceof Date){
      value =  formater(value, format);
      //valueParts = value.split(/\D+/)
    }
    
    var valueParts = value.replace(/\s/g, '-').replace(/:/g, '-').replace(/\//g, '-').split('-');



    if (formatParts.length !== valueParts.length) {
      // if it is error date, use current date
      var date = formater(new Date(), format);
      valueParts = date.split(/\D+/);
    }


    var result = {};

    for (var i = 0; i < formatParts.length; i++) {
      if (formatParts[i]) {
        result[formatParts[i]] = valueParts[i];
      }
    }
    return result;
  } 
  function getElement (expr) {
    return (typeof expr === 'string') ? document.querySelector(expr) : expr;
  }
  function toElement (html) {
    var tempContainer = document.createElement('div');
    tempContainer.innerHTML = html;
    return tempContainer.firstElementChild;
  }
  function removeElement (el) {
    el && el.parentNode.removeChild(el);
  }

  function isLeapYear (year) {
    return year % 100 !== 0 && year % 4 === 0 || year % 400 === 0;
  }
  function getMaxDay (year, month) {
    year = parseFloat(year);
    month = parseFloat(month);
    if (month === 2) {
      return isLeapYear(year) ? 29 : 28;
    }
    return [4, 6, 9, 11].indexOf(month) >= 0 ? 30 : 31;
  }
  function getYears (startDate, endDate) {
    var startYear = startDate.getFullYear();
    var endYear = endDate.getFullYear();
    var rs = [];
    while (startYear <= endYear) {
      rs.push(startYear);
      startYear++;
    }
    return {
      minYear: rs[0],
      maxYear: rs[rs.length - 1]
    };
  }
  function getMonths (startDate, endDate, year) {
    var startYear = startDate.getFullYear();
    var endYear = endDate.getFullYear();
    var startMonth = startDate.getMonth() + 1;
    var endMonth = endDate.getMonth() + 1;
    var start = 1;
    var end = 12;
    if (year === startYear) {
      start = startMonth;
    }
    if (year === endYear) {
      end = endMonth;
    }
    return {
      minMonth: start,
      maxMonth: end
    };
  }
  
  function getDays (startDate, endDate, year, month) {
    var startYear = startDate.getFullYear()
    var endYear = endDate.getFullYear()
    var startMonth = startDate.getMonth() + 1
    var endMonth = endDate.getMonth() + 1
    var startDay = startDate.getDate()
    var endDay = endDate.getDate()
  
    var start = 1;
    var end = getMaxDay(year, month);
  
    if (year === startYear && month === startMonth) {
      start = startDay
    }
    if (year === endYear && month === endMonth) {
      end = endDay
    }
    return {
      minDay: start,
      maxDay: end
    };
  } 

  
  function getComputedStyle (el, key) {
    var computedStyle = window.getComputedStyle(el);
    return computedStyle[key] || '';
  }
  function easeOutCubic (pos) {
    return (Math.pow((pos - 1), 3) + 1);
  }

  function easeInOutCubic (pos) {
    if ((pos /= 0.5) < 1) {
      return 0.5 * Math.pow(pos, 3);
    }
    return 0.5 * (Math.pow((pos - 2), 3) + 2);
  }

  var passiveSupported = function passiveSupported(){
    var passiveSupported = false;
    try {
      var options = Object.defineProperty({}, 'passive', {
        get: function () {
          passiveSupported = true;
        }
      })
      window.addEventListener('test', null, options);
    } catch (err) {console.log(err);}
    return passiveSupported;
  }

var time = Date.now || function () {
  return +new Date();
}

var running = {};
var counter = 1;
var desiredFrames = 60;
var millisecondsPerSecond = 1000;

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
  function requestAnimation(){
    if (typeof window !== 'undefined') {
      (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
          window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
          window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
    
        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
              callback(currTime + timeToCall);
            }, timeToCall)
            lastTime = currTime + timeToCall;
            return id;
          }
        }
        if (!window.cancelAnimationFrame) {
          window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
          }
        }
      }())
    }
  }

  requestAnimation();
   //an
   var Animate  = (function (){
     
    var running = {};
    var counter = 1;
    var desiredFrames = 60;
    var millisecondsPerSecond = 1000;
    
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    
    // requestAnimationFrame polyfill by Erik Möller
    // fixes from Paul Irish and Tino Zijdel
    /*if (typeof window !== 'undefined') {
      ;(function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
          window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
          window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
    
        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
              callback(currTime + timeToCall);
            }, timeToCall)
            lastTime = currTime + timeToCall;
            return id;
          }
        }
        if (!window.cancelAnimationFrame) {
          window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
          }
        }
      }())
    }*/
    requestAnimation();
    
    return {
    
      // A requestAnimationFrame wrapper / polyfill.
      requestAnimationFrame: (function () {
        if (typeof window !== 'undefined') {
          var requestFrame = window.requestAnimationFrame;
          return function (callback, root) {
            requestFrame(callback, root);
          }
        }
      })(),
    
      // Stops the given animation.
      stop: function(id) {
        var cleared = running[id] != null;
        if (cleared) {
          running[id] = null;
        }
        return cleared;
      },
    
      // Whether the given animation is still running.
      isRunning: function(id) {
        return running[id] != null;
      },
    
      // Start the animation.
      start: function(stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {
        var _this = this;
        var start = time();
        var lastFrame = start;
        var percent = 0;
        var dropCounter = 0;
        var id = counter++;
    
        if (!root) {
          root = document.body;
        }
    
        // Compacting running db automatically every few new animations
        if (id % 20 === 0) {
          var newRunning = {};
          for (var usedId in running) {
            newRunning[usedId] = true;
          }
          running = newRunning;
        }
    
        // This is the internal step method which is called every few milliseconds
        var step = function (virtual) {
          // Normalize virtual value
          var render = virtual !== true;
          // Get current time
          var now = time();
    
          // Verification is executed before next animation step
          if (!running[id] || (verifyCallback && !verifyCallback(id))) {
            running[id] = null;
            completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, false);
            return;
          }
    
          // For the current rendering to apply let's update omitted steps in memory.
          // This is important to bring internal state variables up-to-date with progress in time.
          if (render) {
            var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
            for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
              step(true);
              dropCounter++;
            }
          }
    
          // Compute percent value
          if (duration) {
            percent = (now - start) / duration;
            if (percent > 1) {
              percent = 1;
            }
          }
    
          // Execute step callback, then...
          var value = easingMethod ? easingMethod(percent) : percent;
          if ((stepCallback(value, now, render) === false || percent === 1) && render) {
            running[id] = null;
            completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, percent === 1 || duration == null);
          } else if (render) {
            lastFrame = now;
            _this.requestAnimationFrame(step, root);
          }
        }
    
        // Mark as running
        running[id] = true;
        // Init first step
        _this.requestAnimationFrame(step, root);
        // Return unique animation ID
        return id;
      }
    }
    
   })();

  function DatetimePicker (config) {
    var self = this;
    self.config = {};
    self.value = config.value || '';
    
    each(DEFAULT_CONFIG, function (key, val) {
      self.config[key] = config[key] || val;
    })
  
    this.renderInline = self.config.renderInline;
  
    if (config.defaultSelectedValue && !config.value) {
      self.config.value = config.defaultSelectedValue;
    }
  
    if (typeof this.config.startDate === 'string') {
      this.config.startDate = new Date(this.config.startDate.replace(/-/g, '/'));
    }
  
    if (typeof this.config.endDate === 'string') {
      this.config.endDate = new Date(this.config.endDate.replace(/-/g, '/'));
    }
  
    if (this.config.startDate && !this.config.endDate) {
      this.config.endDate = new Date('2099-12-31');
    }
  
    this.reMakeData = !!this.config.startDate && !!this.config.endDate;
  
    if (!this.renderInline) {
      var trigger = self.config.trigger;
  
      this.triggerHandler = function (e) {
        e.preventDefault();
        self.show(self.value);
      }
      if (trigger) {
        trigger = self.trigger = getElement(trigger);
        this.trigger = trigger;
        this.trigger.addEventListener('click', this.triggerHandler, false);
      }
    }
  }
  
  DatetimePicker.prototype = {
  
    _show:function (newValueMap) {
      var self = this;
  
      self.container.style.display = 'block';
  
      if (this.renderInline) {
        self.container.classList.add('vux-datetime-view');
      }
  
      each(TYPE_MAP, function (type) {
        self[type + 'Scroller'] && self[type + 'Scroller'].select(trimZero(newValueMap[type]), false);
      })
  
      setTimeout(function () {
        self.container.style['-webkit-transform'] = 'translateY(0)';
        self.container.style.transform = 'translateY(0)';
      }, 0)
    },
    show:function (value,popperClass) {
      
      var self = this;
      var config = self.config;
      CURRENT_PICKER = self;
      var valueMap = self.valueMap = pickerParseDate(config.format, value || config.value);
      var newValueMap = {};
  
      each(TYPE_MAP, function (type, list) {
          // console.log(type, list)
        newValueMap[type] = list.length === 1 ? valueMap[list[0]] : (valueMap[list[0]] || valueMap[list[1]]);
      })
  
      if (self.container) {
        self._show(newValueMap);
      } else {
        var container = self.container = toElement(config.template);
        if (!self.renderInline) {
          //覆盖clickOutside
          document.body.addEventListener('mouseup', function(e) {  
            e.stopPropagation();     
           // self.hide()         
          });
          
          document.body.appendChild(container);
          if(popperClass){
            self.container.classList.add(popperClass);
          }
          
          self.container.style.display = 'block';
        } else {
          document.querySelector(self.config.trigger).appendChild(container);
        }
  
        each(TYPE_MAP, function (type) {
          var div = self.find('[data-role=' + type + ']');
          if (newValueMap[type] === undefined) {
            removeElement(div);
            return;
          }
          
          var data;
          if (type === 'day') {
            data = self._makeData(type, trimZero(newValueMap.year), trimZero(newValueMap.month));
            //console.log("001","type === 'day'");
          } else {
            data = self._makeData(type);
            //console.log("001","type !== 'day'");
          }
  
          //滚动日期转盘
          self[type + 'Scroller'] = renderScroller(div, data, trimZero(newValueMap[type]), function (currentValue) {
            //console.log('currentValue:',newValueMap)
            //console.log("大转盘年&&时&&分", trimZero(newValueMap[type]),currentValue)
            config.onSelect.call(self, type, currentValue, self.getValue());
            var currentDay;
            if (type === 'year') {
              //console.log("001","type === 'year'");
              var currentMonth = self.monthScroller ? self.monthScroller.value : config.currentMonth;
              self._setMonthScroller(currentValue, currentMonth);
              if (self.dayScroller) {
                currentDay = self.dayScroller.value;
                self._setDayScroller(currentValue, currentMonth, currentDay);
              }
            } else if (type === 'month') {
              //console.log("001","type === 'month'");
              var currentYear = self.yearScroller ? self.yearScroller.value : config.currentYear;
              if (self.dayScroller) {
                currentDay = self.dayScroller.value;
                self._setDayScroller(currentYear, currentValue, currentDay);
              }
            }
          })
        })
  
        if (!self.renderText && !self.renderInline) {
          if (self.config.confirmText) {
            self.find('[data-role=confirm]').innerText = self.config.confirmText;
          }
  
          if (self.config.cancelText) {
            self.find('[data-role=cancel]').innerText = self.config.cancelText;
          }
          if (self.config.clearText) {
            //self.find('[data-role=clear]').innerText = self.config.clearText
          }
          self.renderText = true;
        }
  
        this._show(newValueMap);
  
        self.find('[data-role=cancel]').addEventListener('click', function (e) {
          e.preventDefault();
          self.hide();
        }, false)
  
        self.find('[data-role=confirm]').addEventListener('click', function (e) {
          
          e.preventDefault();
          self.confirm();
        }, false)
  
       /* if (self.config.clearText) {
          self.find('[data-role=clear]').addEventListener('click', function (e) {
            e.preventDefault()
            self.clear()
          }, false)
        }*/
      }
  
      if (!this.renderInline) {
        showMask();
        config.onShow.call(self);
      }
    },
  
    _makeData:function (type, year, month) {
      var config = this.config;
      var valueMap = this.valueMap;
      var list = TYPE_MAP[type];
      var data = [];
      var min;
      var max;
  
      if (type === 'year') {
        min = config.minYear;
        max = config.maxYear;
        if (this.reMakeData) {
          //console.log("002","type === 'year'");
        //  var { minYear, maxYear } = getYears(this.config.startDate, this.config.endDate);
          var yearsObj = getYears(this.config.startDate, this.config.endDate);
          min = yearsObj[minYear];
          max = yearsObj[maxYear];
        }
      } else if (type === 'month') {
        min = 1;
        max = 12;
        if (this.reMakeData) {
          //console.log("002","type === 'month'");
         // var { minMonth, maxMonth } = getMonths(this.config.startDate, this.config.endDate, this.yearScroller.value * 1);
         var monthObj = getMonths(this.config.startDate, this.config.endDate, this.yearScroller.value * 1);
          min = Math.max(min, monthObj[minMonth]);
          max = Math.min(max, monthObj[maxMonth]);
        }
      } else if (type === 'day') {
        min = 1;
        max = getMaxDay(year, month);
        if (this.reMakeData) {
          //console.log("002","type === 'day'");
        //  var { minDay, maxDay } = getDays(this.config.startDate, this.config.endDate, this.yearScroller.value * 1, this.monthScroller.value * 1);
          var dayObj = getDays(this.config.startDate, this.config.endDate, this.yearScroller.value * 1, this.monthScroller.value * 1);
          min = Math.max(min, dayObj[minDay]);
          max = Math.min(max, dayObj[maxDay]);
        }
      } else if (type === 'hour') {
        
        min = this.config.minHour;
        max = this.config.maxHour;
      } else if (type === 'minute') {
        min = 0;
        max = 59;
      } else if (type === 'second') {
        min = 0;
        max = 59;
      }
      for (var i = min; i <= max; i++) {
        var name;
        if (type === 'year') {
          name = parseRow(config.yearRow, i);
        } else {
          var val = valueMap[list[0]] ? addZero(i) : i;
          
          if(type === 'day'){// 添加星期begin
              var isIos = (/mmp|iphone|ipad|ipod\sce|palm/i.test(navigator.userAgent.toLowerCase()));
              var weekdays = [
                Vue.t('vue.datepicker.weeks.sun'),
                Vue.t('vue.datepicker.weeks.mon'),
                Vue.t('vue.datepicker.weeks.tue'),
                Vue.t('vue.datepicker.weeks.wed'),
                Vue.t('vue.datepicker.weeks.thu'),
                Vue.t('vue.datepicker.weeks.fri'),
                Vue.t('vue.datepicker.weeks.sat')
              ];

              if(isIos){
                var week = new Date(jim.currentYear+'/'+jim.currentMonth+'/'+val).getDay();
                name = parseRow(config[type + 'Row'], val) + " "+ weekdays[week];
              }else{
                var week = new Date(jim.currentYear+'-'+jim.currentMonth+'-'+val).getDay();
                name = parseRow(config[type + 'Row'], val) + " "+weekdays[week];
              }
          }else{
              name = parseRow(config[type + 'Row'], val);
          }
          // console.log(jim.currentYear,jim.currentMonth,type,val,name)
        }
        data.push({
          name: name,
          value: i
        });
      }
  
      if (type === 'hour' && this.config.hourList) {
        /*data = this.config.hourList.map(hour => {
          return {
            name: parseRow(config['hourRow'], hour),
            value: addZero(hour)
          }
        })*/
        var cloneHourData = [];
        for(var h =0;h<this.config.hourList.length;h++){
           var hd = {};
           hd.name =  parseRow(config['hourRow'], this.config.hourList(h));
           hd.value = addZero(this.config.hourList(h));
           cloneHourData.push(hd);
        }
        data = cloneHourData;
      }

      if (type === 'minute' && this.config.minuteList) {
        /*data = this.config.minuteList.map(minute => {
          return {
            name: parseRow(config['minuteRow'], minute),
            value: addZero(minute)
          }
        })*/
        var cloneMinuteData = [];
        for(var m =0;h<this.config.minuteList.length;m++){
           var md = {};
           md.name =  parseRow(config['minuteRow'], this.config.minuteList(h));
           md.value = addZero(this.config.minuteList(h));
           cloneMinuteData.push(md);
        }
        data = cloneMinuteData;

      }
      // console.log("_makeData",type, year, month);
      return data
    },
  
    // after year change
    _setMonthScroller:function (currentValue, month) {
      //console.log("_setMonthScroller|滚年换月",currentValue, month);
      var self = this;
      if(!self.monthScroller){
        return;
      }
      self.monthScroller.destroy();
      var div = self.find('[data-role=month]');
      self.monthScroller = renderScroller(div, self._makeData('month'), month, function (currentValue) {
        self.config.onSelect.call(self, 'month', currentValue, self.getValue());
        var currentYear = self.yearScroller ? self.yearScroller.value : self.config.currentYear;
        if (self.dayScroller) {
          var currentDay = self.dayScroller.value;
          self._setDayScroller(currentYear, currentValue, currentDay);
        }
      })
    },
  
    _setDayScroller:function (year, month, day) {
      //console.log("_setDayScroller|滚月换日",year, month, day);
      {// 添加星期begin
          jim.currentYear = year;
          jim.currentMonth = month;
      }// 添加星期end
      var self = this;
      var maxDay = getMaxDay(year, month);
      if (day > maxDay) {
        day = maxDay;
      }
      self.dayScroller.destroy();
      var div = self.find('[data-role=day]');
      self.dayScroller = renderScroller(div, self._makeData('day', year, month), day, function (currentValue) {
        //console.log("dayScroller|滚日",day)
        self.config.onSelect.call(self, 'day', currentValue, self.getValue());
      })
    },
  
    find:function (selector) {
      return this.container.querySelector(selector);
    },
  
    hide:function () {
      if (!this.container) {
        return;
      }
      var self = this;
      self.container.style.removeProperty('transform');
      self.container.style.removeProperty('-webkit-transform');
  
      setTimeout(function () {
        self.container && (self.container.style.display = 'none');
      }, SHOW_CONTAINER_TIME)
  
      hideMask();
  
      self.config.onHide.call(self);
      if (self.config.destroyOnHide) {
        setTimeout(function(){
          self.destroy()
        }, 500)
      }
    },
  
    select:function (type, value) {
      this[type + 'Scroller'].select(value, false);
    },
  
    destroy:function () {
      var self = this;
      this.trigger && this.trigger.removeEventListener('click', this.triggerHandler, false);
      removeElement(MASK);
      removeElement(self.container);
      MASK = null;
      self.container = null;
    },
  
    getValue:function () {
      var self = this;
      var config = self.config;
  
      var value = config.format;
  
      function formatValue (scroller, expr1, expr2) {
        if (scroller) {
          var val = scroller.value;
          if (expr1) {
            value = value.replace(new RegExp(expr1, 'g'), addZero(val));
          }
          if (expr2) {
            value = value.replace(new RegExp(expr2, 'g'), trimZero(val));
          }
        }
      }
  
      each(TYPE_MAP, function (key, list) {
        formatValue(self[key + 'Scroller'], list[0], list[1]);
      })
  
      return value;
    },

    confirm:function () {
      
      var value = this.getValue();
      this.value = value;
      
      if (this.config.onConfirm.call(this, value) === false) {
        return;
      }     
      this.hide();
    },
  
    clear:function () {
      var value = this.getValue();
  
      if (this.config.onClear.call(this, value) === false) {
        return;
      }
  
      this.hide();
    }
  }


  //scroller.js
  var isBrowser = typeof window === 'object';

  var SCROLLER_TEMPLATE = '<div class="scroller-component" data-role="component">'+
    '<div class="scroller-mask" data-role="mask"></div>'+
    '<div class="scroller-indicator" data-role="indicator"></div>'+
    '<div class="scroller-content" data-role="content"></div>'+
  '</div>';
  
  //import Animate from './animate'
  /*import {
    getElement,
    getComputedStyle,
    easeOutCubic,
    easeInOutCubic
  } from './util'
  import passiveSupported from '../../libs/passive_supported'*/
  
  var getDpr = function () {
    var dpr = 1;
    if (isBrowser) {
      if (window.VUX_CONFIG && window.VUX_CONFIG.$picker && window.VUX_CONFIG.$picker.respectHtmlDataDpr) {
        dpr = document.documentElement.getAttribute('data-dpr') || 1;
      }
    }
    return dpr;
  }
  
  var Scroller = function (container, options) {
    var self = this;
  
    self.isDestroy = false;
  
    self.dpr = getDpr();
  
    options = options || {};
  
    self.options = {
      itemClass: 'scroller-item',
      onSelect:function () {},
      defaultValue: 0,
      data: []
    };
  
    for (var key in options) {
      if (options[key] !== undefined) {
        self.options[key] = options[key];
      }
    }
  
    self.__container = getElement(container);
  
    var tempContainer = document.createElement('div');
    tempContainer.innerHTML = options.template || SCROLLER_TEMPLATE;
  
    var component = self.__component = tempContainer.querySelector('[data-role=component]');
    var content = self.__content = component.querySelector('[data-role=content]');
    var indicator = component.querySelector('[data-role=indicator]');
  
    var data = self.options.data;
    var html = '';
    if (data.length && data[0].constructor === Object) {   
      for(var k=0;k<data.length;k++){
        html += '<div class="' + self.options.itemClass + '" data-value=' + JSON.stringify({
          value: encodeURI(data[k].value)
        }) + '>' + data[k].name + '</div>';
      }
    } else {
      for(var k=0;k<data.length;k++){
        html += '<div class="' + self.options.itemClass + '" data-value=' + JSON.stringify({
          value: encodeURI(val)
        }) + '>' + val + '</div>';
      }

    }
    content.innerHTML = html;
  
    self.__container.appendChild(component);
  
    self.__itemHeight = parseFloat(getComputedStyle(indicator, 'height'), 10);
  
    self.__callback = options.callback || function (top) {
      var distance = -top * self.dpr;
      content.style.webkitTransform = 'translate3d(0, ' + distance + 'px, 0)';
      content.style.transform = 'translate3d(0, ' + distance + 'px, 0)';
    }
  
    var rect = component.getBoundingClientRect();
  
    self.__clientTop = (rect.top + component.clientTop) || 0;
  
    self.__setDimensions(component.clientHeight, content.offsetHeight);
  
    if (component.clientHeight === 0) {
      self.__setDimensions(parseFloat(getComputedStyle(component, 'height'), 10), 204);
    }
    self.select(self.options.defaultValue, false);
  
    var touchStartHandler = function (e) {
      if (e.target.tagName.match(/input|textarea|select/i)) {
        return;
      }
      e.preventDefault();
      self.__doTouchStart(e, e.timeStamp);
    };
  
    var touchMoveHandler = function (e) {
      self.__doTouchMove(e, e.timeStamp);
    };
  
    var touchEndHandler = function (e) {
      self.__doTouchEnd(e.timeStamp);
    };
  
    var willPreventDefault = passiveSupported ? {
      passive: false
    } : false;
    var willNotPreventDefault = passiveSupported ? {
      passive: true
    } : false;
  
    component.addEventListener('touchstart', touchStartHandler, willPreventDefault);
    component.addEventListener('mousedown', touchStartHandler, willPreventDefault);
  
    component.addEventListener('touchmove', touchMoveHandler, willNotPreventDefault);
    component.addEventListener('mousemove', touchMoveHandler, willNotPreventDefault);
  
    component.addEventListener('touchend', touchEndHandler, willNotPreventDefault);
    component.addEventListener('mouseup', touchEndHandler, willNotPreventDefault);
  }
  
  var members = {
    value: null,
    __prevValue: null,
    __isSingleTouch: false,
    __isTracking: false,
    __didDecelerationComplete: false,
    __isGesturing: false,
    __isDragging: false,
    __isDecelerating: false,
    __isAnimating: false,
    __clientTop: 0,
    __clientHeight: 0,
    __contentHeight: 0,
    __itemHeight: 0,
    __scrollTop: 0,
    __minScrollTop: 0,
    __maxScrollTop: 0,
    __scheduledTop: 0,
    __lastTouchTop: null,
    __lastTouchMove: null,
    __positions: null,
    __minDecelerationScrollTop: null,
    __maxDecelerationScrollTop: null,
    __decelerationVelocityY: null,
  
    __setDimensions:function (clientHeight, contentHeight) {
      var self = this;
  
      self.__clientHeight = clientHeight;
      self.__contentHeight = contentHeight;
  
      var totalItemCount = self.options.data.length;
      var clientItemCount = Math.round(self.__clientHeight / self.__itemHeight);
  
      self.__minScrollTop = -self.__itemHeight * (clientItemCount / 2);
      self.__maxScrollTop = self.__minScrollTop + totalItemCount * self.__itemHeight - 0.1;
    },
  
    selectByIndex:function (index, animate) {
      var self = this;
      if (index < 0 || index > self.__content.childElementCount - 1) {
        return;
      }
      self.__scrollTop = self.__minScrollTop + index * self.__itemHeight;
  
      self.scrollTo(self.__scrollTop, animate);
  
      self.__selectItem(self.__content.children[index]);
    },
  
    select:function (value, animate) {
      var self = this;
  
      var children = self.__content.children;
      for (var i = 0, len = children.length; i < len; i++) {
        if (decodeURI(JSON.parse(children[i].dataset.value).value) === value) {
          self.selectByIndex(i, animate);
          return;
        }
      }
  
      self.selectByIndex(0, animate);
    },
  
    getValue:function () {
      return this.value;
    },
  
    scrollTo:function (top, animate) {
      var self = this;
  
      animate = (animate === undefined) ? true : animate;
  
      if (self.__isDecelerating) {
        Animate.stop(self.__isDecelerating);
        self.__isDecelerating = false;
      }
  
      top = Math.round((top / self.__itemHeight).toFixed(5)) * self.__itemHeight;
      top = Math.max(Math.min(self.__maxScrollTop, top), self.__minScrollTop);
  
      if (top === self.__scrollTop || !animate) {
        self.__publish(top);
        self.__scrollingComplete();
        return;
      }
      self.__publish(top, 250);
    },
  
    destroy:function () {
      this.isDestroy = true;
      this.__component.parentNode && this.__component.parentNode.removeChild(this.__component);
    },
  
    __selectItem:function (selectedItem) {
      var self = this;
  
      var selectedItemClass = self.options.itemClass + '-selected';
      var lastSelectedElem = self.__content.querySelector('.' + selectedItemClass);
      if (lastSelectedElem) {
        lastSelectedElem.classList.remove(selectedItemClass);
      }
      selectedItem.classList.add(selectedItemClass);
  
      if (self.value !== null) {
        self.__prevValue = self.value;
      }
  
      self.value = decodeURI(JSON.parse(selectedItem.dataset.value).value);
    },
  
    __scrollingComplete:function () {
      var self = this;
  
      var index = Math.round((self.__scrollTop - self.__minScrollTop - self.__itemHeight / 2) / self.__itemHeight);
  
      self.__selectItem(self.__content.children[index]);
  
      if (self.__prevValue !== null && self.__prevValue !== self.value && !self.isDestroy) {
        self.options.onSelect(self.value);
      }
    },
  
    __doTouchStart:function (ev, timeStamp) {
      var touches = ev.touches;
      var self = this;
      var target = ev.touches ? ev.touches[0] : ev;
      
      var isMobile = !!ev.touches;
  
      if (ev.touches && touches.length == null) {
        throw new Error('Invalid touch list: ' + touches);
      }
      if (timeStamp instanceof Date) {
        timeStamp = timeStamp.valueOf();
      }
      if (typeof timeStamp !== 'number') {
        throw new Error('Invalid timestamp value: ' + timeStamp);
      }
  
      self.__interruptedAnimation = true;
  
      if (self.__isDecelerating) {
        Animate.stop(self.__isDecelerating);
        self.__isDecelerating = false;
        self.__interruptedAnimation = true;
      }
  
      if (self.__isAnimating) {
        Animate.stop(self.__isAnimating);
        self.__isAnimating = false;
        self.__interruptedAnimation = true;
      }
  
      // Use center point when dealing with two fingers
      var currentTouchTop;
      var isSingleTouch = (isMobile && touches.length === 1) || !isMobile;
      if (isSingleTouch) {
        currentTouchTop = target.pageY;
      } else {
        currentTouchTop = Math.abs(target.pageY + touches[1].pageY) / 2;
      }
  
      self.__initialTouchTop = currentTouchTop;
      self.__lastTouchTop = currentTouchTop;
      self.__lastTouchMove = timeStamp;
      self.__lastScale = 1;
      self.__enableScrollY = !isSingleTouch;
      self.__isTracking = true;
      self.__didDecelerationComplete = false;
      self.__isDragging = !isSingleTouch;
      self.__isSingleTouch = isSingleTouch;
      self.__positions = [];
    },
  
    __doTouchMove:function (ev, timeStamp, scale) {
      var self = this;
      var touches = ev.touches;
      var target = ev.touches ? ev.touches[0] : ev;
      var isMobile = !!ev.touches;
  
      if (touches && touches.length == null) {
        throw new Error('Invalid touch list: ' + touches);
      }
      if (timeStamp instanceof Date) {
        timeStamp = timeStamp.valueOf();
      }
      if (typeof timeStamp !== 'number') {
        throw new Error('Invalid timestamp value: ' + timeStamp);
      }
  
      // Ignore event when tracking is not enabled (event might be outside of element)
      if (!self.__isTracking) {
        return;
      }
  
      var currentTouchTop;
  
      // Compute move based around of center of fingers
      if (isMobile && touches.length === 2) {
        currentTouchTop = Math.abs(target.pageY + touches[1].pageY) / 2;
      } else {
        currentTouchTop = target.pageY;
      }
  
      var positions = self.__positions;
  
      // Are we already is dragging mode?
      if (self.__isDragging) {
        var moveY = currentTouchTop - self.__lastTouchTop;
        var scrollTop = self.__scrollTop;
  
        if (self.__enableScrollY) {
          scrollTop -= moveY;
  
          var minScrollTop = self.__minScrollTop;
          var maxScrollTop = self.__maxScrollTop;
  
          if (scrollTop > maxScrollTop || scrollTop < minScrollTop) {
            // Slow down on the edges
            if (scrollTop > maxScrollTop) {
              scrollTop = maxScrollTop;
            } else {
              scrollTop = minScrollTop;
            }
          }
        }
  
        // Keep list from growing infinitely (holding min 10, max 20 measure points)
        if (positions.length > 40) {
          positions.splice(0, 20);
        }
  
        // Track scroll movement for decleration
        positions.push(scrollTop, timeStamp);
  
        // Sync scroll position
        self.__publish(scrollTop);
  
        // Otherwise figure out whether we are switching into dragging mode now.
      } else {
        var minimumTrackingForScroll = 0;
        var minimumTrackingForDrag = 5;
  
        var distanceY = Math.abs(currentTouchTop - self.__initialTouchTop);
  
        self.__enableScrollY = distanceY >= minimumTrackingForScroll;
  
        positions.push(self.__scrollTop, timeStamp);
  
        self.__isDragging = self.__enableScrollY && (distanceY >= minimumTrackingForDrag);
  
        if (self.__isDragging) {
          self.__interruptedAnimation = false;
        }
      }
  
      // Update last touch positions and time stamp for next event
      self.__lastTouchTop = currentTouchTop;
      self.__lastTouchMove = timeStamp;
      self.__lastScale = scale;
    },
  
    __doTouchEnd:function (timeStamp) {
      var self = this;
  
      if (timeStamp instanceof Date) {
        timeStamp = timeStamp.valueOf();
      }
      if (typeof timeStamp !== 'number') {
        throw new Error('Invalid timestamp value: ' + timeStamp);
      }
  
      // Ignore event when tracking is not enabled (no touchstart event on element)
      // This is required as this listener ('touchmove') sits on the document and not on the element itself.
      if (!self.__isTracking) {
        return;
      }
  
      // Not touching anymore (when two finger hit the screen there are two touch end events)
      self.__isTracking = false;
  
      // Be sure to reset the dragging flag now. Here we also detect whether
      // the finger has moved fast enough to switch into a deceleration animation.
      if (self.__isDragging) {
        // Reset dragging flag
        self.__isDragging = false;
  
        // Start deceleration
        // Verify that the last move detected was in some relevant time frame
        if (self.__isSingleTouch && (timeStamp - self.__lastTouchMove) <= 100) {
          // Then figure out what the scroll position was about 100ms ago
          var positions = self.__positions;
          var endPos = positions.length - 1;
          var startPos = endPos;
  
          // Move pointer to position measured 100ms ago
          for (var i = endPos; i > 0 && positions[i] > (self.__lastTouchMove - 100); i -= 2) {
            startPos = i;
          }
  
          // If start and stop position is identical in a 100ms timeframe,
          // we cannot compute any useful deceleration.
          if (startPos !== endPos) {
            // Compute relative movement between these two points
            var timeOffset = positions[endPos] - positions[startPos];
            var movedTop = self.__scrollTop - positions[startPos - 1];
  
            // Based on 50ms compute the movement to apply for each render step
            self.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60);
  
            // How much velocity is required to start the deceleration
            var minVelocityToStartDeceleration = 4;
  
            // Verify that we have enough velocity to start deceleration
            if (Math.abs(self.__decelerationVelocityY) > minVelocityToStartDeceleration) {
              self.__startDeceleration(timeStamp);
            }
          }
        }
      }
  
      if (!self.__isDecelerating) {
        self.scrollTo(self.__scrollTop);
      }
  
      // Fully cleanup list
      self.__positions.length = 0;
    },
  
    // Applies the scroll position to the content element
    __publish:function (top, animationDuration) {
      var self = this;
  
      // Remember whether we had an animation, then we try to continue based on the current "drive" of the animation
      var wasAnimating = self.__isAnimating;
      if (wasAnimating) {
        Animate.stop(wasAnimating);
        self.__isAnimating = false;
      }
  
      if (animationDuration) {
        // Keep scheduled positions for scrollBy functionality
        self.__scheduledTop = top;
  
        var oldTop = self.__scrollTop;
        var diffTop = top - oldTop;
  
        var step = function (percent, now, render) {
          self.__scrollTop = oldTop + (diffTop * percent);
          // Push values out
          if (self.__callback) {
            self.__callback(self.__scrollTop);
          }
        }
  
        var verify = function (id) {
          return self.__isAnimating === id;
        }
  
        var completed = function (renderedFramesPerSecond, animationId, wasFinished) {
          if (animationId === self.__isAnimating) {
            self.__isAnimating = false;
          }
          if (self.__didDecelerationComplete || wasFinished) {
            self.__scrollingComplete();
          }
        }
  
        // When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
        self.__isAnimating = Animate.start(step, verify, completed, animationDuration, wasAnimating ? easeOutCubic : easeInOutCubic);
      } else {
        self.__scheduledTop = self.__scrollTop = top;
        // Push values out
        if (self.__callback) {
          self.__callback(top);
        }
      }
    },
  
    // Called when a touch sequence end and the speed of the finger was high enough to switch into deceleration mode.
    __startDeceleration:function (timeStamp) {
      var self = this;
  
      self.__minDecelerationScrollTop = self.__minScrollTop;
      self.__maxDecelerationScrollTop = self.__maxScrollTop;
  
      // Wrap class method
      var step = function (percent, now, render) {
        self.__stepThroughDeceleration(render);
      }
  
      // How much velocity is required to keep the deceleration running
      var minVelocityToKeepDecelerating = 0.5;
  
      // Detect whether it's still worth to continue animating steps
      // If we are already slow enough to not being user perceivable anymore, we stop the whole process here.
      var verify = function () {
        var shouldContinue = Math.abs(self.__decelerationVelocityY) >= minVelocityToKeepDecelerating;
        if (!shouldContinue) {
          self.__didDecelerationComplete = true;
        }
        return shouldContinue;
      }
  
      var completed = function (renderedFramesPerSecond, animationId, wasFinished) {
        self.__isDecelerating = false;
        if (self.__scrollTop <= self.__minScrollTop || self.__scrollTop >= self.__maxScrollTop) {
          self.scrollTo(self.__scrollTop);
          return;
        }
        if (self.__didDecelerationComplete) {
          self.__scrollingComplete();
        }
      }
  
      // Start animation and switch on flag
      self.__isDecelerating = Animate.start(step, verify, completed);
    },
  
    // Called on every step of the animation
    __stepThroughDeceleration:function (render) {
      var self = this;
  
      var scrollTop = self.__scrollTop + self.__decelerationVelocityY;
  
      var scrollTopFixed = Math.max(Math.min(self.__maxDecelerationScrollTop, scrollTop), self.__minDecelerationScrollTop);
      if (scrollTopFixed !== scrollTop) {
        scrollTop = scrollTopFixed;
        self.__decelerationVelocityY = 0;
      }
  
      if (Math.abs(self.__decelerationVelocityY) <= 1) {
        if (Math.abs(scrollTop % self.__itemHeight) < 1) {
          self.__decelerationVelocityY = 0;
        }
      } else {
        self.__decelerationVelocityY *= 0.95;
      }
  
      self.__publish(scrollTop);
    }
  }
  
  // Copy over members to prototype
  for (var key in members) {
    Scroller.prototype[key] = members[key];
  }


  var MobileDatePanel = function(_type){
    

    return {
   
        template:'<transition name="vue-zoom-in-top" @after-enter="handleEnter" @after-leave="handleLeave">'+
        ' <a'+ 
        ' :class="[{\'weui-cell_access\': !readonly},\'vux-datetime\',\'weui-cell\']"'+
        ' v-show="visible"'+
        ' :data-cancel-text="$t(\'vue.datepicker.cancel\')"'+
        ' :data-confirm-text="$t(\'vue.datepicker.confirm\')"'+
        ' :data-clear-text="$t(\'vue.datepicker.clear\')"'+
        ' href="javascript:">'+
        ' <slot>'+
        '   <div>'+
        '     <slot name="title">'+
        '       <p'+
        '         :style="styles"'+
        '         :class="labelClass"'+
        '         v-html="title"></p>'+
        '     </slot>'+
        '     <inline-desc v-if="inlineDesc">{{ inlineDesc }}</inline-desc>'+
        '   </div>'+
      /* '   <div'+
        '     class="weui-cell__ft vux-cell-primary vux-datetime-value"'+
        '     :style="{'+
        '       textAlign: valueTextAlign'+
        '     }">'+
        '     <span'+
        '       class="vux-cell-placeholder"'+
        '       v-if="!currentValue && placeholder">{{ placeholder }}</span>'+
        '     <span'+
        '       class="vux-cell-value"'+
        '       v-if="currentValue">{{ displayFormat ? displayFormat(currentValue) : currentValue }}</span>'+
        '   </div>'+*/
        ' </slot>'+
        '</a> </transition>',  
        //mixins: [Uuid],
        components: {
        // Group,
        // InlineDesc,
        //  Icon
        },
        props: {
          format: {
            type: String,
            default: 'YYYY-MM-DD',
            validator:function (val) {
              /* istanbul ignore if */
              //if (process.env.NODE_ENV === 'development' && val && /A/.test(val) && val !== 'YYYY-MM-DD A') {
                //return console.error('[VUX] Datetime prop:format 使用 A 时只允许的值为： YYYY-MM-DD A')
              //}
              return true
            }
          },
          title: String,
          value: {
            type: String,
            default: ''
          },
          popperClass: '',
          inlineDesc: String,
          placeholder: String,
          minYear: Number,
          maxYear: Number,
          confirmText: String,
          cancelText: String,
          clearText: String,
          yearRow: {
            type: String,
            default: '{value}'
          },
          monthRow: {
            type: String,
            default: '{value}'
          },
          dayRow: {
            type: String,
            default: '{value}'
          },
          hourRow: {
            type: String,
            default: '{value}'
          },
          minuteRow: {
            type: String,
            default: '{value}'
          },
          secondRow: {
            type: String,
            default: '{value}'
          },
          required: {
            type: Boolean,
            default: false
          },
          minHour: {
            type: Number,
            default: 0
          },
          maxHour: {
            type: Number,
            default: 23
          },
          startDate: {
            type: String,
            validator:function (val) {
              /* istanbul ignore if */
            // if (process.env.NODE_ENV === 'development' && val && val.length !== 10) {
              //  console.error('[VUX] Datetime prop:start-date 必须为 YYYY-MM-DD 格式')
            // }
              return val ? val.length === 10 : true
            }
          },
          endDate: {
            type: String,
            validator:function (val) {
              /* istanbul ignore if */
            // if (process.env.NODE_ENV === 'development' && val && val.length !== 10) {
            //   console.error('[VUX] Datetime prop:end-date 必须为 YYYY-MM-DD 格式')
            //  }
              return val ? val.length === 10 : true
            }
          },
          valueTextAlign: String,
          displayFormat: Function,
          readonly: Boolean,
          hourList: Array,
          minuteList: Array,
          show: Boolean,
          defaultSelectedValue: String,
          computeHoursFunction: Function,
          computeDaysFunction: Function,
          orderMap: Object
        },
        created: function () {
          this.isFirstSetValue = false
          this.currentValue = this.value

          this.uuid = Math.random().toString(36).substring(3, 8)
        },
        data: function () {
          return {
            currentShow: false,
            currentValue: null,
            valid: true,
            visible: false,
            errors: {}
          }
        },
        mounted: function () {
          
          var uuid = this.uuid;
          this.$el.setAttribute('id', 'vux-datetime-'+uuid)
          if (!this.readonly) {
            this.$nextTick(function() {
              this.render();
              //if (this.show) {
                if(this.visible){
                this.$nextTick(function(){
                  this.picker && this.picker.show(this.currentValue,this.popperClass);
                })
              }
            })
          }
        },
        computed: {
          styles: function () {
            if (!this.$parent) {
              return {};
            }
            return {
              width: this.$parent.labelWidth,
              textAlign: this.$parent.labelAlign,
              marginRight: this.$parent.labelMarginRight
            }
          },
          pickerOptions: function () {
            var _this = this
            var xtype={
              year:'YYYY',
              month:'YYYY-MM',
              date:'YYYY-MM-DD',
              datetime:'YYYY-MM-DD HH:mm:ss'
            };
            var dtFormat ;
            if (xtype.hasOwnProperty(_type)) {
              dtFormat = xtype[_type];
            }
            var options = {
              trigger: '#vux-datetime-' + this.uuid,
              format: dtFormat||this.format,
              value: this.currentValue,
              output: '.vux-datetime-value',
              confirmText: _this.getButtonText('confirm'),
              cancelText: _this.getButtonText('cancel'),
              clearText: _this.getButtonText('clear'),
              yearRow: this.yearRow,
              monthRow: this.monthRow,
              dayRow: this.dayRow,
              hourRow: this.hourRow,
              minuteRow: this.minuteRow,
              secondRow: this.secondRow,
              minHour: this.minHour,
              maxHour: this.maxHour,
              startDate: this.startDate,
              endDate: this.endDate,
              hourList: this.hourList,
              minuteList: this.minuteList,
              defaultSelectedValue: this.defaultSelectedValue,
              computeHoursFunction: this.computeHoursFunction,
              computeDaysFunction: this.computeDaysFunction,
              orderMap: this.orderMap || {},
             /* clickOutside: function(){
                if (!this.visible) return;
                this.visible = false;
              },*/
              onSelect:function (type, val, wholeValue) {
                if (_this.picker && _this.picker.config.renderInline) {
                  _this.$emit('input', wholeValue);
                  _this.$emit('on-change', wholeValue);
                }
              },
              onConfirm:function (value) {                      
                _this.currentValue = value;  
              },
              onClear:function (value) {
                _this.currentValue = null;
                _this.$emit('on-clear', value);
              },
              onHide:function (type) {
                
                _this.currentShow = false;
                _this.$emit('update:show', false);
                _this.validate();
                _this.$emit('on-hide', type);
                if (type === 'cancel') {
                  _this.$emit('on-cancel');
                }
                if (type === 'confirm') {
                  setTimeout(function(){
                    _this.$nextTick(function() {
                      _this.$emit('on-confirm', _this.value);
                    });
                  })
                }
              
                if(_this.currentValue){   
                  var f =_this.pickerOptions.format.replace('YYYY','yyyy').replace('DD','dd');
                  var d = VueUtil.parseDate(_this.currentValue,f);
                  _this.$emit('pick', d , false);
                 // _this.$emit('show-close-icon', true);
                 }else{
                   _this.$emit('pick', null, false);
                  // _this.$emit('show-close-icon', false);
                 }
               
                //_this.$destroy();
              },
              onShow:function () {
                _this.currentShow = true;
                _this.$emit('update:show', true);
                _this.$emit('on-show');
              }
            };
            if (this.minYear) {
              options.minYear = this.minYear;
            }
            if (this.maxYear) {
              options.maxYear = this.maxYear;
            }
            return options;
          },
          firstError:function () {
            var key = Object.keys(this.errors)[0];
            return this.errors[key];
          },
          labelClass:function () {
            if (!this.$parent) {
              return {};
            }
            return {
              'vux-cell-justify': this.$parent.labelAlign === 'justify' || this.$parent.$parent.labelAlign === 'justify'
            }
          }
        },
        methods: {
          getButtonText:function (type) {
            if (type === 'cancel' && this.cancelText) {
              return this.cancelText;
            } else if (type === 'confirm' && this.confirmText) {
              return this.confirmText;
            } else if (type === 'clear' && this.confirmText) {
              return this.clearText;
            }
            return this.$el.getAttribute('data-'+type+'-text');
          },          
          handleEnter: function () {
            document.body.addEventListener('keydown', this.handleKeydown);
          },
          handleLeave: function () {
            this.$emit('destroyPopper');
            document.body.removeEventListener('keydown', this.handleKeydown);
          },   
          render:function() {
            this.$nextTick(function (){
              if(!this.picker){
                this.picker && this.picker.destroy();
                //this.picker = new Picker(this.pickerOptions)
                this.picker = new DatetimePicker(this.pickerOptions);
              }                        
            })
          },
          validate:function () {
            if (!this.currentValue && this.required) {
              this.valid = false;
              this.errors.required = 'required';
              return;
            }
            this.valid = true;
            this.errors = {};
          }
        },
        watch: {
          readonly:function (val) {
            if (val) {
              this.picker && this.picker.destroy();
            } else {
              this.render();
            }
          },
          visible:function (val) {
            if (val === this.currentShow){
               return;
            }
            if (val) {
              this.picker && this.picker.show(this.currentValue);
            } else {
              this.picker && this.picker.hide(this.currentValue);
            }
          },
          currentValue:function (val, oldVal) {
          // this.$emit('input', val)
            if (!this.isFirstSetValue) {
              this.isFirstSetValue = true;
              oldVal && this.$emit('on-change', val);
            } else {
              this.$emit('on-change', val);
            }
            this.validate();
          },
          startDate:function () {
            this.render();
          },
          endDate:function () {
            this.render();
          },
          format:function (val) {
            if (this.currentValue) {
              this.currentValue = format(this.currentValue, val);
            }
            this.render();
          }, 
          value:function (val) {
            // do not force render when renderInline is true
            var v = val;
            if(VueUtil.isDate(val)){
              var f = this.pickerOptions.format.replace('YYYY','yyyy').replace('DD','dd');
              v =VueUtil.formatDate(val,f);
            }

            if (this.readonly || (this.picker && this.picker.config.renderInline)) {
              this.currentValue = v;
              return;
            }

            if (this.currentValue !== v) {
              this.currentValue = v;
              this.render();
            }
          }
        },
        beforeDestroy:function () {
          this.picker && this.picker.destroy();
        }
 
    }
  };

  function _isMobile() {
    return VueUtil.getSystemInfo().device == 'Mobile';
  }
 /***********add by huangyw at 2019-10-18 for mobile datepicker ***** end ***********/


  var getPanel = function (type,showMobileui) {
    
    if(_isMobile()&&showMobileui){
      return MobileDatePanel(type);
    }
    
    if (type === 'daterange' || type === 'datetimerange') {
      return DateRangePanel;
    } else if (type === 'monthrange') {
      return MonthRangePanel;
    } else if (type === 'monthrange') {}
  
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
      //在mobile模式下，控件下拉框是否要显示手机端页面样式
      showMobileui: {
        type: Boolean,
        default: false
      },
      timeArrowControl: Boolean
    },
    watch: {
      type: function (_type) {
        if (this.picker) {
          this.unmountPicker();
          this.panel = getPanel(_type,this.showMobileui);
          this.mountPicker();
        } else {
          this.panel = getPanel(_type,this.showMobileui);
        }
      }
    },
    created: function () {
      this.panel = getPanel(this.type,this.showMobileui);
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
