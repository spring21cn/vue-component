!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePicker', 'VueUtil', 'VueTimePicker', 'VueInput'], definition);
	} else {
		context['VueDatePicker'] = definition(context['Vue'], context['VuePicker'], context['VueUtil'], context['VueTimePicker'], context['VueInput']);
	}
})('VueDatePicker', this, function(Vue, VuePicker, VueUtil, VueTimePicker, VueInput) {
	'use strict';
	var DAY_DURATION = 86400000;
	var WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
	var clearHours = function(time) {
		var cloneDate = new Date(time);
		cloneDate.setHours(0, 0, 0, 0);
		return cloneDate.getTime();
	};
	var YearTable = {
		template: '<table @click="handleYearTableClick" class="vue-year-table"><tbody><tr><td class="available" :class="getCellStyle(startYear + 0)"><a class="cell">{{ startYear }}</a></td><td class="available" :class="getCellStyle(startYear + 1)"><a class="cell">{{ startYear + 1 }}</a></td><td class="available" :class="getCellStyle(startYear + 2)"><a class="cell">{{ startYear + 2 }}</a></td><td class="available" :class="getCellStyle(startYear + 3)"><a class="cell">{{ startYear + 3 }}</a></td></tr><tr><td class="available" :class="getCellStyle(startYear + 4)"><a class="cell">{{ startYear + 4 }}</a></td><td class="available" :class="getCellStyle(startYear + 5)"><a class="cell">{{ startYear + 5 }}</a></td><td class="available" :class="getCellStyle(startYear + 6)"><a class="cell">{{ startYear + 6 }}</a></td><td class="available" :class="getCellStyle(startYear + 7)"><a class="cell">{{ startYear + 7 }}</a></td></tr><tr><td class="available" :class="getCellStyle(startYear + 8)"><a class="cell">{{ startYear + 8 }}</a></td><td class="available" :class="getCellStyle(startYear + 9)"><a class="cell">{{ startYear + 9 }}</a></td><td></td><td></td></tr></tbody></table>',
		props: {
			disabledDate: {},
			date: {},
			year: {}
		},
		computed: {
			startYear: function() {
				return Math.floor(this.year / 10) * 10;
			}
		},
		methods: {
			getCellStyle: function(year) {
				var style = {};
				var date = new Date(this.date);
				date.setFullYear(year);
				style.disabled = typeof this.disabledDate === 'function' && this.disabledDate(date);
				style.current = Number(this.year) === year;
				return style;
			},
			nextTenYear: function() {
				this.$emit('pick', Number(this.year) + 10, false);
			},
			prevTenYear: function() {
				this.$emit('pick', Number(this.year) - 10, false);
			},
			handleYearTableClick: function(event) {
				var target = event.target;
				if (target.tagName === 'A') {
					if (VueUtil.hasClass(target.parentNode, 'disabled'))
						return;
					var year = target.textContent || target.innerText;
					this.$emit('pick', year);
				}
			}
		}
	};
	var MonthTable = {
		template: '<table @click="handleMonthTableClick" class="vue-month-table"><tbody><tr><td :class="getCellStyle(0)"><a class="cell">{{ $t(\'vue.datepicker.months.jan\') }}</a></td><td :class="getCellStyle(1)"><a class="cell">{{ $t(\'vue.datepicker.months.feb\') }}</a></td><td :class="getCellStyle(2)"><a class="cell">{{ $t(\'vue.datepicker.months.mar\') }}</a></td><td :class="getCellStyle(3)"><a class="cell">{{ $t(\'vue.datepicker.months.apr\') }}</a></td></tr><tr><td :class="getCellStyle(4)"><a class="cell">{{ $t(\'vue.datepicker.months.may\') }}</a></td><td :class="getCellStyle(5)"><a class="cell">{{ $t(\'vue.datepicker.months.jun\') }}</a></td><td :class="getCellStyle(6)"><a class="cell">{{ $t(\'vue.datepicker.months.jul\') }}</a></td><td :class="getCellStyle(7)"><a class="cell">{{ $t(\'vue.datepicker.months.aug\') }}</a></td></tr><tr><td :class="getCellStyle(8)"><a class="cell">{{ $t(\'vue.datepicker.months.sep\') }}</a></td><td :class="getCellStyle(9)"><a class="cell">{{ $t(\'vue.datepicker.months.oct\') }}</a></td><td :class="getCellStyle(10)"><a class="cell">{{ $t(\'vue.datepicker.months.nov\') }}</a></td><td :class="getCellStyle(11)"><a class="cell">{{ $t(\'vue.datepicker.months.dec\') }}</a></td></tr></tbody></table>',
		props: {
			disabledDate: {},
			date: {},
			month: {
				type: Number
			}
		},
		methods: {
			getCellStyle: function(month) {
				var style = {};
				var date = new Date(this.date);
				date.setMonth(month);
				style.disabled = typeof this.disabledDate === 'function' && this.disabledDate(date);
				style.current = this.month === month;
				return style;
			},
			handleMonthTableClick: function(event) {
				var target = event.target;
				if (target.tagName !== 'A')
					return;
				if (VueUtil.hasClass(target.parentNode, 'disabled'))
					return;
				var column = target.parentNode.cellIndex;
				var row = target.parentNode.parentNode.rowIndex;
				var month = row * 4 + column;
				this.$emit('pick', month);
			}
		}
	};
	var DateTable = {
		template: '<table cellspacing="0" cellpadding="0" class="vue-date-table" @click="handleClick" @mousemove="handleMouseMove" :class="{ \'is-week-mode\': selectionMode === \'week\' }"><tbody><tr><th v-if="showWeekNumber">{{ $t(\'vue.datepicker.week\') }}</th><th v-for="week in WEEKS">{{ $t(\'vue.datepicker.weeks.\'+week) }}</th></tr><tr class="vue-date-table__row" v-for="row in rows" :class="{ current: isWeekActive(row[1]) }"><td v-for="cell in row" :class="getCellClasses(cell)" v-text="cell.text"></td></tr></tbody></table>',
		props: {
			firstDayOfWeek: {
				default: 7,
				type: Number,
				validator: function(val) {
					return val >= 1 && val <= 7
				}
			},
			date: {},
			year: {},
			month: {},
			week: {},
			events: {
				type: Array,
				default: function() {
					return [];
				}
			},
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
				default: function() {
					return {
						endDate: null,
						selecting: false,
						row: null,
						column: null
					};
				}
			}
		},
		computed: {
			offsetDay: function() {
				var week = this.firstDayOfWeek;
				return week > 3 ? 7 - week : -week;
			},
			WEEKS: function() {
				var week = this.firstDayOfWeek;
				return WEEKS.concat(WEEKS).slice(week, week + 7);
			},
			monthDate: function() {
				return this.date.getDate();
			},
			startDate: function() {
				return VueUtil.component.getStartDateOfMonth(this.year, this.month);
			},
			rows: function() {
				var date = new Date(this.year,this.month,1);
				var day = VueUtil.component.getFirstDayOfMonth(date);
				var dateCountOfMonth = VueUtil.component.getDayCountOfMonth(date.getFullYear(), date.getMonth());
				var dateCountOfLastMonth = VueUtil.component.getDayCountOfMonth(date.getFullYear(), (date.getMonth() === 0 ? 11 : date.getMonth() - 1));
				day = (day === 0 ? 7 : day);
				var offset = this.offsetDay;
				var rows = this.tableRows;
				var count = 1;
				var firstDayPosition;
				var startDate = this.startDate;
				var disabledDate = this.disabledDate;
				var now = clearHours(new Date());
				for (var i = 0; i < 6; i++) {
					var row = rows[i];
					if (this.showWeekNumber) {
						if (!row[0]) {
							row[0] = {
								type: 'week',
								text: VueUtil.component.getWeekNumber(new Date(startDate.getTime() + DAY_DURATION * (i * 7 + 1)))
							};
						}
					}
					for (var j = 0; j < 7; j++) {
						var cell = row[this.showWeekNumber ? j + 1 : j];
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
						var time = startDate.getTime() + DAY_DURATION * (index - offset);
						cell.inRange = time >= clearHours(this.minDate) && time <= clearHours(this.maxDate);
						cell.start = this.minDate && time === clearHours(this.minDate);
						cell.end = this.maxDate && time === clearHours(this.maxDate);
						var isToday = time === now;
						if (isToday) {
							cell.type = 'today';
						}
						if (i >= 0 && i <= 1) {
							if (j + i * 7 >= (day + offset)) {
								cell.text = count++;
								if (count === 2) {
									firstDayPosition = i * 7 + j;
								}
							} else {
								cell.text = dateCountOfLastMonth - (day + offset - j % 7) + 1 + i * 7;
								cell.type = 'prev-month';
							}
						} else {
							if (count <= dateCountOfMonth) {
								cell.text = count++;
								if (count === 2) {
									firstDayPosition = i * 7 + j;
								}
							} else {
								cell.text = count++ - dateCountOfMonth;
								cell.type = 'next-month';
							}
						}
						cell.disabled = typeof disabledDate === 'function' && disabledDate(new Date(time));
						cell.event = false;
						if (cell.type === 'today' || cell.type === 'normal') {
							if (this.events && this.events.length>0) {
								var cellDate = new Date(this.year, this.month, cell.text);
								this.events.forEach(function(event){
									if (event.date
									 && VueUtil.formatDate(event.date) === VueUtil.formatDate(cellDate)) {
										cell.event = true;
									}
								});
							}
						}
						this.$set(row, this.showWeekNumber ? j + 1 : j, cell);
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
				rows.firstDayPosition = firstDayPosition;
				return rows;
			}
		},
		watch: {
			'rangeState.endDate': function(newVal) {
				this.markRange(newVal);
			},
			minDate: function(newVal, oldVal) {
				if (newVal && !oldVal) {
					this.rangeState.selecting = true;
					this.markRange(newVal);
				} else if (!newVal) {
					this.rangeState.selecting = false;
					this.markRange(newVal);
				} else {
					this.markRange();
				}
			},
			maxDate: function(newVal, oldVal) {
				if (newVal && !oldVal) {
					this.rangeState.selecting = false;
					this.markRange(newVal);
					this.$emit('pick', {
						minDate: this.minDate,
						maxDate: this.maxDate
					});
				}
			}
		},
		data: function() {
			return {
				tableRows: [[], [], [], [], [], []]
			};
		},
		methods: {
			getCellClasses: function(cell) {
				var selectionMode = this.selectionMode;
				var monthDate = this.monthDate;
				var classes = [];
				if ((cell.type === 'normal' || cell.type === 'today') && !cell.disabled) {
					classes.push('available');
					if (cell.type === 'today') {
						classes.push('today');
					}
				} else {
					classes.push(cell.type);
				}
				if (selectionMode === 'day' && (cell.type === 'normal' || cell.type === 'today') && Number(this.year) === this.date.getFullYear() && this.month === this.date.getMonth() && monthDate === Number(cell.text)) {
					classes.push('current');
				}
				if (cell.inRange && ((cell.type === 'normal' || cell.type === 'today') || this.selectionMode === 'week')) {
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
				if (cell.event) {
					classes.push('event-date');
				}
				return classes.join(' ');
			},
			getDateOfCell: function(row, column) {
				var startDate = this.startDate;
				return new Date(startDate.getTime() + (row * 7 + (column - (this.showWeekNumber ? 1 : 0)) - this.offsetDay) * DAY_DURATION);
			},
			getCellByDate: function(date) {
				var startDate = this.startDate;
				var rows = this.rows;
				var index = (date - startDate) / DAY_DURATION;
				var row = rows[Math.floor(index / 7)];
				if (this.showWeekNumber) {
					return row[index % 7 + 1];
				} else {
					return row[index % 7];
				}
			},
			isWeekActive: function(cell) {
				if (this.selectionMode !== 'week')
					return false;
				var newDate = new Date(this.year,this.month,1);
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
				return VueUtil.component.getWeekNumber(newDate) === this.week;
			},
			markRange: function(maxDate) {
				var startDate = this.startDate;
				if (!maxDate) {
					maxDate = this.maxDate;
				}
				var rows = this.rows;
				var minDate = this.minDate;
				for (var i = 0, k = rows.length; i < k; i++) {
					var row = rows[i];
					for (var j = 0, l = row.length; j < l; j++) {
						if (this.showWeekNumber && j === 0)
							continue;
						var cell = row[j];
						var index = i * 7 + j + (this.showWeekNumber ? -1 : 0);
						var time = startDate.getTime() + DAY_DURATION * (index - this.offsetDay);
						cell.inRange = minDate && time >= clearHours(minDate) && time <= clearHours(maxDate);
						cell.start = minDate && time === clearHours(minDate.getTime());
						cell.end = maxDate && time === clearHours(maxDate.getTime());
					}
				}
			},
			handleMouseMove: function(event) {
				if (!this.rangeState.selecting)
					return;
				this.$emit('changerange', {
					minDate: this.minDate,
					maxDate: this.maxDate,
					rangeState: this.rangeState
				});
				var target = event.target;
				if (target.tagName !== 'TD') return;
				var column = target.cellIndex;
				var row = target.parentNode.rowIndex - 1;
				var oldRow = this.rangeState.row
				var oldColumn = this.rangeState.column;
				if (oldRow !== row || oldColumn !== column) {
					this.rangeState.row = row;
					this.rangeState.column = column;
					this.rangeState.endDate = this.getDateOfCell(row, column);
				}
			},
			handleClick: function(event) {
				var target = event.target;
				if (target.tagName !== 'TD')
					return;
				if (VueUtil.hasClass(target, 'disabled') || VueUtil.hasClass(target, 'week'))
					return;
				var selectionMode = this.selectionMode;
				if (selectionMode === 'week') {
					target = target.parentNode.cells[1];
				}
				var year = Number(this.year);
				var month = Number(this.month);
				var cellIndex = target.cellIndex;
				var rowIndex = target.parentNode.rowIndex;
				var cell = this.rows[rowIndex - 1][cellIndex];
				var text = cell.text;
				var className = target.className;
				var newDate = new Date(year,month,1);
				if (className.indexOf('prev') !== -1) {
					if (month === 0) {
						year = year - 1;
						month = 11;
					} else {
						month = month - 1;
					}
					newDate.setFullYear(year);
					newDate.setMonth(month);
				} else if (className.indexOf('next') !== -1) {
					if (month === 11) {
						year = year + 1;
						month = 0;
					} else {
						month = month + 1;
					}
					newDate.setFullYear(year);
					newDate.setMonth(month);
				}
				newDate.setDate(parseInt(text, 10));
				if (this.selectionMode === 'range') {
					if (this.minDate && this.maxDate) {
						var minDate = new Date(newDate.getTime());
						var maxDate = null;
						this.$emit('pick', {
							minDate: minDate,
							maxDate: maxDate
						}, false);
						this.rangeState.selecting = true;
						this.markRange(this.minDate);
					} else if (this.minDate && !this.maxDate) {
						if (newDate >= this.minDate) {
							var maxDate = new Date(newDate.getTime());
							this.rangeState.selecting = false;
							this.$emit('pick', {
								minDate: this.minDate,
								maxDate: maxDate
							});
						} else {
							var minDate = new Date(newDate.getTime());
							this.$emit('pick', {
								minDate: minDate,
								maxDate: this.maxDate
							}, false);
						}
					} else if (!this.minDate) {
						var minDate = new Date(newDate.getTime());
						this.$emit('pick', {
							minDate: minDate,
							maxDate: this.maxDate
						}, false);
						this.rangeState.selecting = true;
						this.markRange(this.minDate);
					}
				} else if (selectionMode === 'day') {
					this.$emit('pick', newDate);
				} else if (selectionMode === 'week') {
					var weekNumber = VueUtil.component.getWeekNumber(newDate);
					var value = newDate.getFullYear() + 'w' + weekNumber;
					this.$emit('pick', {
						year: newDate.getFullYear(),
						week: weekNumber,
						value: value,
						date: newDate
					});
				}
			}
		}
	};
	var DatePanel = {
		template: '<transition name="vue-zoom-in-top" @after-leave="$emit(\'dodestroy\')"><div v-show="visible" :style="{width: width + \'px\'}" class="vue-picker-panel vue-date-picker" :class="[{\'has-sidebar\': $slots.sidebar || shortcuts,\'has-time\': showTime}, popperClass]"><div class="vue-picker-panel__body-wrapper"><slot name="sidebar" class="vue-picker-panel__sidebar"></slot><div class="vue-picker-panel__sidebar" v-if="shortcuts"><button type="button" class="vue-picker-panel__shortcut" v-for="shortcut in shortcuts" @click="handleShortcutClick(shortcut)">{{ shortcut.text }}</button></div><div class="vue-picker-panel__body"><div class="vue-date-picker__time-header" v-if="showTime"><span class="vue-date-picker__editor-wrap"><vue-input :placeholder="$t(\'vue.datepicker.selectDate\')" :value="visibleDate" size="small" @change.native="visibleDate = $event.target.value" /></span><span class="vue-date-picker__editor-wrap"><vue-input ref="input" @focus="timePickerVisible = !timePickerVisible" :placeholder="$t(\'vue.datepicker.selectTime\')" :value="visibleTime" size="small" @change.native="visibleTime = $event.target.value" /><time-picker ref="timepicker" :date="date" :picker-width="pickerWidth" @pick="handleTimePick" :visible="timePickerVisible" @mounted="$refs.timepicker.format=timeFormat"></time-picker></span></div><div class="vue-date-picker__header" v-show="currentView !== \'time\'"><button type="button" @click="prevYear" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-d-arrow-left"></button><button type="button" @click="prevMonth" v-show="currentView === \'date\'" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-arrow-left"></button><span @click="showYearPicker" class="vue-date-picker__header-label">{{ yearLabel }}</span><span @click="showMonthPicker" v-show="currentView === \'date\'" class="vue-date-picker__header-label" :class="{ active: currentView === \'month\' }">{{ monthLabel }}</span><button type="button" @click="nextYear" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-d-arrow-right"></button><button type="button" @click="nextMonth" v-show="currentView === \'date\'" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-arrow-right"></button></div><div class="vue-picker-panel__content"><date-table v-show="currentView === \'date\'" @pick="handleDatePick" :year="year" :month="month" :date="date" :week="week" :selection-mode="selectionMode" :first-day-of-week="firstDayOfWeek" :disabled-date="disabledDate"></date-table><year-table ref="yearTable" :year="year" :date="date" v-show="currentView === \'year\'" @pick="handleYearPick" :disabled-date="disabledDate"></year-table><month-table :month="month" :date="date" v-show="currentView === \'month\'" @pick="handleMonthPick" :disabled-date="disabledDate"></month-table></div></div></div><div class="vue-picker-panel__footer" v-show="footerVisible && currentView === \'date\'"><a href="JavaScript:" class="vue-picker-panel__link-btn" @click="changeToNow">{{ nowLabel }}</a><button type="button" class="vue-picker-panel__btn" @click="confirm">{{ confirmLabel }}</button></div></div></transition>',
		watch: {
			showTime: function(val) {
				var self = this;
				if (!val)
					return;
				self.$nextTick(function() {
					var inputElm = self.$refs.input.$el;
					if (inputElm) {
						self.pickerWidth = inputElm.getBoundingClientRect().width + 10;
					}
				});
			},
			value: function(newVal) {
				if (!newVal)
					return;
				newVal = new Date(newVal);
				if (!isNaN(newVal)) {
					if (typeof this.disabledDate === 'function' && this.disabledDate(new Date(newVal))) {
						return;
					}
					this.date = newVal;
					this.year = newVal.getFullYear();
					this.month = newVal.getMonth();
					this.$emit('pick', newVal, true);
				}
			},
			timePickerVisible: function(val) {
				var self = this;
				if (val)
					self.$nextTick(function() {
						self.$refs.timepicker.ajustScrollTop();
					});
			},
			selectionMode: function(newVal) {
				if (newVal === 'month') {
					if (this.currentView !== 'year' || this.currentView !== 'month') {
						this.currentView = 'month';
					}
				} else if (newVal === 'week') {
					this.week = VueUtil.component.getWeekNumber(this.date);
				}
			},
			date: function(newVal) {
				this.year = newVal.getFullYear();
				this.month = newVal.getMonth();
			}
		},
		methods: {
			handleClear: function() {
				this.date = this.$options.defaultValue ? new Date(this.$options.defaultValue) : new Date();
				this.$emit('pick');
			},
			resetDate: function() {
				this.date = new Date(this.date);
			},
			showMonthPicker: function() {
				this.currentView = 'month';
			},
			showYearPicker: function() {
				this.currentView = 'year';
			},
			prevMonth: function() {
				this.month--;
				if (this.month < 0) {
					this.month = 11;
					this.year--;
				}
			},
			nextMonth: function() {
				this.month++;
				if (this.month > 11) {
					this.month = 0;
					this.year++;
				}
			},
			nextYear: function() {
				if (this.currentView === 'year') {
					this.$refs.yearTable.nextTenYear();
				} else {
					this.year++;
					this.date.setFullYear(this.year);
					this.resetDate();
				}
			},
			prevYear: function() {
				if (this.currentView === 'year') {
					this.$refs.yearTable.prevTenYear();
				} else {
					this.year--;
					this.date.setFullYear(this.year);
					this.resetDate();
				}
			},
			handleShortcutClick: function(shortcut) {
				if (shortcut.onClick) {
					shortcut.onClick(this);
				}
			},
			handleTimePick: function(picker, visible, first) {
				if (picker) {
					var oldDate = new Date(this.date.getTime());
					var hour = picker.getHours();
					var minute = picker.getMinutes();
					var second = picker.getSeconds();
					oldDate.setHours(hour);
					oldDate.setMinutes(minute);
					oldDate.setSeconds(second);
					this.date = new Date(oldDate.getTime());
				}
				if (!first) {
					this.timePickerVisible = visible;
				}
			},
			handleMonthPick: function(month) {
				this.month = month;
				var selectionMode = this.selectionMode;
				if (selectionMode !== 'month') {
					this.date.setMonth(month);
					this.currentView = 'date';
					this.resetDate();
				} else {
					this.date.setMonth(month);
					this.year && this.date.setFullYear(this.year);
					this.resetDate();
					var value = new Date(this.date.getFullYear(),month,1);
					this.$emit('pick', value);
				}
			},
			handleDatePick: function(value) {
				if (this.selectionMode === 'day') {
					if (!this.showTime) {
						this.$emit('pick', new Date(value.getTime()));
					}
					this.date.setFullYear(value.getFullYear());
					this.date.setMonth(value.getMonth(), value.getDate());
				} else if (this.selectionMode === 'week') {
					this.week = value.week;
					this.$emit('pick', value.date);
				}
				this.resetDate();
			},
			handleYearPick: function(year, close) {
				if (typeof close === 'undefined') close = true;
				this.year = year;
				if (!close)
					return;
				this.date.setFullYear(year);
				if (this.selectionMode === 'year') {
					this.$emit('pick', new Date(year));
				} else {
					this.currentView = 'month';
				}
				this.resetDate();
			},
			changeToNow: function() {
				this.date.setTime(+new Date());
				this.$emit('pick', new Date(this.date.getTime()));
				this.resetDate();
			},
			confirm: function() {
				this.$emit('pick', this.date);
			},
			resetView: function() {
				if (this.selectionMode === 'month') {
					this.currentView = 'month';
				} else if (this.selectionMode === 'year') {
					this.currentView = 'year';
				} else {
					this.currentView = 'date';
				}
				if (this.selectionMode !== 'week') {
					this.year = this.date.getFullYear();
					this.month = this.date.getMonth();
				}
			}
		},
		components: {
			TimePicker: VueTimePicker().TimePicker,
			YearTable: YearTable,
			MonthTable: MonthTable,
			DateTable: DateTable,
			VueInput: VueInput()
		},
		mounted: function() {
			if (this.date && !this.year) {
				this.year = this.date.getFullYear();
				this.month = this.date.getMonth();
			}
		},
		data: function() {
			return {
				popperClass: '',
				pickerWidth: 0,
				date: this.$options.defaultValue ? new Date(this.$options.defaultValue) : new Date(),
				value: '',
				showTime: false,
				selectionMode: 'day',
				shortcuts: '',
				visible: false,
				currentView: 'date',
				disabledDate: '',
				firstDayOfWeek: 7,
				year: null,
				month: null,
				week: null,
				showWeekNumber: false,
				timePickerVisible: false,
				width: 0,
				format: ''
			};
		},
		computed: {
			footerVisible: function() {
				return this.showTime;
			},
			visibleTime: {
				get: function() {
					return VueUtil.formatDate(this.date, this.timeFormat);
				},
				set: function(val) {
					if (val) {
						var date = VueUtil.parseDate(val, this.timeFormat);
						if (date) {
							date.setFullYear(this.date.getFullYear());
							date.setMonth(this.date.getMonth());
							date.setDate(this.date.getDate());
							this.date = date;
							this.$refs.timepicker.value = date;
							this.timePickerVisible = false;
						}
					}
				}
			},
			visibleDate: {
				get: function() {
					return VueUtil.formatDate(this.date);
				},
				set: function(val) {
					var date = VueUtil.parseDate(val, 'yyyy-MM-dd');
					if (!date) return;
					if (typeof this.disabledDate === 'function' && this.disabledDate(date)) return;
					date.setHours(this.date.getHours());
					date.setMinutes(this.date.getMinutes());
					date.setSeconds(this.date.getSeconds());
					this.date = date;
					this.resetView();
				}
			},
			yearLabel: function() {
				var year = this.year;
				if (!year)
					return '';
				var yearTranslation = this.$t('vue.datepicker.year');
				if (this.currentView === 'year') {
					var startYear = Math.floor(year / 10) * 10;
					if (yearTranslation) {
						return startYear + ' ' + yearTranslation + ' - ' + (startYear + 9) + ' ' + yearTranslation;
					}
					return startYear + ' - ' + (startYear + 9);
				}
				return this.year + ' ' + yearTranslation;
			},
			timeFormat: function() {
				if (this.format && this.format.indexOf('ss') === -1) {
					return 'HH:mm';
				} else {
					return 'HH:mm:ss';
				}
			},
			monthLabel: function() {
				return this.$t('vue.datepicker.month' + (this.month + 1));
			},
			nowLabel: function() {
				return this.$t('vue.datepicker.now');
			},
			confirmLabel: function() {
				return this.$t('vue.datepicker.confirm');
			}
		}
	};
	var DateRangePanel = {
		template: '<transition name="vue-zoom-in-top" @after-leave="$emit(\'dodestroy\')"><div v-show="visible" :style="{ width: width + \'px\' }" class="vue-picker-panel vue-date-range-picker" :class="[{\'has-sidebar\': $slots.sidebar || shortcuts,\'has-time\': showTime}, popperClass]"><div class="vue-picker-panel__body-wrapper"><slot name="sidebar" class="vue-picker-panel__sidebar"></slot><div class="vue-picker-panel__sidebar" v-if="shortcuts"><button type="button" class="vue-picker-panel__shortcut" v-for="shortcut in shortcuts" @click="handleShortcutClick(shortcut)">{{ shortcut.text }}</button></div><div class="vue-picker-panel__body"><div class="vue-date-range-picker__time-header" v-if="showTime"><span class="vue-date-range-picker__editors-wrap"><span class="vue-date-range-picker__time-picker-wrap"><vue-input size="small" :placeholder="$t(\'vue.datepicker.startDate\')" ref="minInput" class="vue-date-range-picker__editor" :value="minVisibleDate" @input.native="handleDateInput($event, \'min\')" @change.native="handleDateChange($event, \'min\')" /></span><span class="vue-date-range-picker__time-picker-wrap"><vue-input size="small" :placeholder="$t(\'vue.datepicker.startTime\')" class="vue-date-range-picker__editor" :value="minVisibleTime" @focus="minTimePickerVisible = !minTimePickerVisible" @change.native="handleTimeChange($event, \'min\')" /><time-picker :picker-width="minPickerWidth" ref="minTimePicker" :date="minDate" @pick="handleMinTimePick" :visible="minTimePickerVisible"></time-picker></span></span><span class="vue-icon-arrow-right"></span><span class="vue-date-range-picker__editors-wrap is-right"><span class="vue-date-range-picker__time-picker-wrap"><vue-input size="small" :placeholder="$t(\'vue.datepicker.endDate\')" class="vue-date-range-picker__editor" :value="maxVisibleDate" :readonly="!minDate" @input.native="handleDateInput($event, \'max\')" @change.native="handleDateChange($event, \'max\')" /></span><span class="vue-date-range-picker__time-picker-wrap"><vue-input size="small" :placeholder="$t(\'vue.datepicker.endTime\')" ref="maxInput" class="vue-date-range-picker__editor" :value="maxVisibleTime" @focus="minDate && (maxTimePickerVisible = !maxTimePickerVisible)" :readonly="!minDate" @change.native="handleTimeChange($event, \'max\')" /><time-picker :picker-width="maxPickerWidth" ref="maxTimePicker" :date="maxDate" @pick="handleMaxTimePick" :visible="maxTimePickerVisible"></time-picker></span></span></div><div class="vue-picker-panel__content vue-date-range-picker__content is-left"><div class="vue-date-range-picker__header"><button type="button" @click="prevYear" class="vue-picker-panel__icon-btn vue-icon-d-arrow-left"></button><button type="button" @click="prevMonth" class="vue-picker-panel__icon-btn vue-icon-arrow-left"></button><div>{{ leftLabel }}</div></div><date-table selection-mode="range" :date="date" :year="leftYear" :month="leftMonth" :min-date="minDate" :max-date="maxDate" :range-state="rangeState" :disabled-date="disabledDate" @changerange="handleChangeRange" :first-day-of-week="firstDayOfWeek" @pick="handleRangePick"></date-table></div><div class="vue-picker-panel__content vue-date-range-picker__content is-right"><div class="vue-date-range-picker__header"><button type="button" @click="nextYear" class="vue-picker-panel__icon-btn vue-icon-d-arrow-right"></button><button type="button" @click="nextMonth" class="vue-picker-panel__icon-btn vue-icon-arrow-right"></button><div>{{ rightLabel }}</div></div><date-table selection-mode="range" :date="rightDate" :year="rightYear" :month="rightMonth" :min-date="minDate" :max-date="maxDate" :range-state="rangeState" :disabled-date="disabledDate" @changerange="handleChangeRange" :first-day-of-week="firstDayOfWeek" @pick="handleRangePick"></date-table></div></div></div><div class="vue-picker-panel__footer" v-if="showTime"><a class="vue-picker-panel__link-btn" @click="handleClear">{{ clearLabel }}</a><button type="button" class="vue-picker-panel__btn" @click="handleConfirm()" :disabled="btnDisabled">{{ confirmLabel }}</button></div></div></transition>',
		components: {
			TimePicker: VueTimePicker().TimePicker,
			DateTable: DateTable,
			VueInput: VueInput()
		},
		computed: {
			btnDisabled: function() {
				return !(this.minDate && this.maxDate && !this.selecting);
			},
			leftLabel: function() {
				return this.date.getFullYear() + ' ' + this.$t('vue.datepicker.year') + ' ' + this.$t('vue.datepicker.month' + (this.date.getMonth() + 1));
			},
			rightLabel: function() {
				return this.rightDate.getFullYear() + ' ' + this.$t('vue.datepicker.year') + ' ' + this.$t('vue.datepicker.month' + (this.rightDate.getMonth() + 1));
			},
			clearLabel: function() {
				return this.$t('vue.datepicker.clear');
			},
			confirmLabel: function() {
				return this.$t('vue.datepicker.confirm');
			},
			leftYear: function() {
				return this.date.getFullYear();
			},
			leftMonth: function() {
				return this.date.getMonth();
			},
			rightYear: function() {
				return this.rightDate.getFullYear();
			},
			rightMonth: function() {
				return this.rightDate.getMonth();
			},
			minVisibleDate: function() {
				return this.minDate ? VueUtil.formatDate(this.minDate) : '';
			},
			maxVisibleDate: function() {
				return (this.maxDate || this.minDate) ? VueUtil.formatDate(this.maxDate || this.minDate) : '';
			},
			minVisibleTime: function() {
				return this.minDate ? VueUtil.formatDate(this.minDate, 'HH:mm:ss') : '';
			},
			maxVisibleTime: function() {
				return (this.maxDate || this.minDate) ? VueUtil.formatDate(this.maxDate || this.minDate, 'HH:mm:ss') : '';
			},
			rightDate: function() {
				var newDate = new Date(this.date);
				var month = newDate.getMonth();
				newDate.setDate(1);
				if (month === 11) {
					newDate.setFullYear(newDate.getFullYear() + 1);
					newDate.setMonth(0);
				} else {
					newDate.setMonth(month + 1);
				}
				return newDate;
			}
		},
		data: function() {
			return {
				popperClass: '',
				minPickerWidth: 0,
				maxPickerWidth: 0,
				date: new Date(),
				minDate: '',
				maxDate: '',
				rangeState: {
					endDate: null,
					selecting: false,
					row: null,
					column: null
				},
				showTime: false,
				shortcuts: '',
				value: '',
				visible: '',
				disabledDate: '',
				firstDayOfWeek: 7,
				minTimePickerVisible: false,
				maxTimePickerVisible: false,
				width: 0
			};
		},
		watch: {
			showTime: function(val) {
				if (!val)
					return;
				var self = this;
				self.$nextTick(function() {
					var minInputElm = self.$refs.minInput.$el;
					var maxInputElm = self.$refs.maxInput.$el;
					if (minInputElm) {
						self.minPickerWidth = minInputElm.getBoundingClientRect().width + 10;
					}
					if (maxInputElm) {
						self.maxPickerWidth = maxInputElm.getBoundingClientRect().width + 10;
					}
				});
			},
			minDate: function() {
				var self = this;
				self.$nextTick(function() {
					if (self.maxDate && this.maxDate < this.minDate) {
						var format = 'HH:mm:ss';
						self.$refs.maxTimePicker.selectableRange = [[VueUtil.parseDate(VueUtil.formatDate(self.minDate, format), format), VueUtil.parseDate('23:59:59', format)]];
					}
				});
			},
			minTimePickerVisible: function(val) {
				var self = this;
				if (val)
					self.$nextTick(function() {
						self.$refs.minTimePicker.ajustScrollTop();
					});
			},
			maxTimePickerVisible: function(val) {
				var self = this;
				if (val)
					self.$nextTick(function() {
						self.$refs.maxTimePicker.ajustScrollTop();
					});
			},
			value: function(newVal) {
				if (!newVal) {
					this.minDate = null;
					this.maxDate = null;
				} else if (Array.isArray(newVal)) {
					this.minDate = newVal[0] ? VueUtil.toDate(newVal[0]) : null;
					this.maxDate = newVal[1] ? VueUtil.toDate(newVal[1]) : null;
					if (this.minDate)
						this.date = new Date(this.minDate);
					this.handleConfirm(true);
				}
			}
		},
		methods: {
			handleClear: function() {
				this.minDate = null;
				this.maxDate = null;
				this.handleConfirm(false);
			},
			handleDateInput: function(event, type) {
				var value = event.target.value;
				var parsedValue = VueUtil.parseDate(value, 'yyyy-MM-dd');
				if (parsedValue) {
					if (typeof this.disabledDate === 'function' && this.disabledDate(new Date(parsedValue))) {
						return;
					}
					var target = new Date(type === 'min' ? this.minDate : this.maxDate);
					if (target) {
						target.setFullYear(parsedValue.getFullYear());
						target.setMonth(parsedValue.getMonth(), parsedValue.getDate());
					}
				}
			},
			handleChangeRange: function(val) {
				this.minDate = val.minDate;
				this.maxDate = val.maxDate;
				this.rangeState = val.rangeState;
			},
			handleDateChange: function(event, type) {
				var value = event.target.value;
				var parsedValue = VueUtil.parseDate(value, 'yyyy-MM-dd');
				if (parsedValue) {
					var target = new Date(type === 'min' ? this.minDate : this.maxDate);
					if (target) {
						target.setFullYear(parsedValue.getFullYear());
						target.setMonth(parsedValue.getMonth(), parsedValue.getDate());
					}
					if (type === 'min') {
						if (target < this.maxDate) {
							this.minDate = new Date(target.getTime());
						}
					} else {
						if (target > this.minDate) {
							this.maxDate = new Date(target.getTime());
							if (this.minDate && this.minDate > this.maxDate) {
								this.minDate = null;
							}
						}
					}
				}
			},
			handleTimeChange: function(event, type) {
				var value = event.target.value;
				var parsedValue = VueUtil.parseDate(value, 'HH:mm:ss');
				if (parsedValue) {
					var target = new Date(type === 'min' ? this.minDate : this.maxDate);
					if (target) {
						target.setHours(parsedValue.getHours());
						target.setMinutes(parsedValue.getMinutes());
						target.setSeconds(parsedValue.getSeconds());
					}
					if (type === 'min') {
						if (target < this.maxDate) {
							this.minDate = new Date(target.getTime());
						}
					} else {
						if (target > this.minDate) {
							this.maxDate = new Date(target.getTime());
						}
					}
					this.$refs[type + 'TimePicker'].value = target;
					this[type + 'TimePickerVisible'] = false;
				}
			},
			handleRangePick: function(val, close) {
				if (typeof close === 'undefined') close = true;
				if (this.maxDate === val.maxDate && this.minDate === val.minDate) {
					return;
				}
				this.onPick && this.onPick(val);
				this.maxDate = val.maxDate;
				this.minDate = val.minDate;
				if (!close || this.showTime) return;
				this.handleConfirm();
			},
			changeToToday: function() {
				this.date = new Date();
			},
			handleShortcutClick: function(shortcut) {
				if (shortcut.onClick) {
					shortcut.onClick(this);
				}
			},
			resetView: function() {
				this.minTimePickerVisible = false;
				this.maxTimePickerVisible = false;
			},
			setTime: function(date, value) {
				var oldDate = new Date(date.getTime());
				var hour = value.getHours();
				var minute = value.getMinutes();
				var second = value.getSeconds();
				oldDate.setHours(hour);
				oldDate.setMinutes(minute);
				oldDate.setSeconds(second);
				return new Date(oldDate.getTime());
			},
			handleMinTimePick: function(value, visible, first) {
				this.minDate = this.minDate || new Date();
				if (value) {
					this.minDate = this.setTime(this.minDate, value);
				}
				if (!first) {
					this.minTimePickerVisible = visible;
				}
			},
			handleMaxTimePick: function(value, visible, first) {
				if (!this.maxDate) {
					var now = new Date();
					if (now >= this.minDate) {
						this.maxDate = new Date();
					}
				}
				if (this.maxDate && value) {
					this.maxDate = this.setTime(this.maxDate, value);
				}
				if (!first) {
					this.maxTimePickerVisible = visible;
				}
			},
			prevMonth: function() {
				this.date = VueUtil.component.prevMonth(this.date);
			},
			nextMonth: function() {
				this.date = VueUtil.component.nextMonth(this.date);
			},
			nextYear: function() {
				var date = this.date;
				date.setFullYear(date.getFullYear() + 1);
				this.resetDate();
			},
			prevYear: function() {
				var date = this.date;
				date.setFullYear(date.getFullYear() - 1);
				this.resetDate();
			},
			handleConfirm: function(visible) {
				visible = visible || false
				this.$emit('pick', [this.minDate, this.maxDate], visible);
			},
			resetDate: function() {
				this.date = new Date(this.date);
			}
		}
	};
	var getPanel = function(type) {
		if (type === 'daterange' || type === 'datetimerange') {
			return DateRangePanel;
		}
		return DatePanel;
	};
	var VueDatePicker = {
		mixins: [VuePicker()],
		name: 'VueDatePicker',
		props: {
			type: {
				type: String,
				default: 'date'
			}
		},
		watch: {
			type: function(type) {
				if (this.picker) {
					this.unmountPicker();
					this.panel = getPanel(type);
					this.mountPicker();
				} else {
					this.panel = getPanel(type);
				}
			}
		},
		created: function() {
			this.panel = getPanel(this.type);
		}
	};
	Vue.component(VueDatePicker.name, VueDatePicker);
	return function() {
		return {
			DatePanel: DatePanel
		}
	}
});
