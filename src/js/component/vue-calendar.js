(function (name, context, definition) {
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VueDatePicker'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VueDatePicker']);
		delete context['VueDatePicker'];
		delete context[name];
	}
})('VueCalendar', this, function (Vue, VueUtil, VueDatePicker) {
	'use strict';
	var findEventsByDate = function(date, events){
		if (events && events.length>0) {
			var findEvents = [];
			events.forEach(function(event){
				if (event.date && VueUtil.formatDate(date) === VueUtil.formatDate(event.date)) {
					findEvents.push(event);
				}
			});
			return findEvents;
		}
	};
	var VueCalendar = VueUtil.merge({}, VueDatePicker().DatePanel, {
		template: '<div :style="{width: width + \'px\'}" class="vue-picker-panel vue-date-picker has-time"><div class="vue-picker-panel__body-wrapper"><div class="vue-picker-panel__body"><div class="vue-date-picker__header" v-show="currentView !== \'time\'"><button type="button" @click="prevYear" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-d-arrow-left"></button><button type="button" @click="prevMonth" v-show="currentView === \'date\'" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-arrow-left"></button><span @click="showYearPicker" class="vue-date-picker__header-label">{{ yearLabel }}</span><span @click="showMonthPicker" v-show="currentView === \'date\'" class="vue-date-picker__header-label" :class="{ active: currentView === \'month\' }">{{ monthLabel }}</span><button type="button" @click="nextYear" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-d-arrow-right"></button><button type="button" @click="nextMonth" v-show="currentView === \'date\'" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-arrow-right"></button></div><div class="vue-picker-panel__content"><date-table v-show="currentView === \'date\'" @pick="handleDatePick" :year="year" :month="month" :date="date" :week="week" :selection-mode="selectionMode" :first-day-of-week="firstDayOfWeek" :disabled-date="disabledDate" :events="events"></date-table><year-table ref="yearTable" :year="year" :date="date" v-show="currentView === \'year\'" @pick="handleYearPick" :disabled-date="disabledDate"></year-table><month-table :month="month" :date="date" v-show="currentView === \'month\'" @pick="handleMonthPick" :disabled-date="disabledDate"></month-table></div></div></div><div class="vue-picker-panel__footer"><a href="JavaScript:" class="vue-picker-panel__link-btn" @click="changeToNow">{{ nowLabel }}</a></div></div>',
		data: function() {
			return {
				date: new Date(),
				selectionMode: 'day',
				currentView: 'date',
				disabledDate: {},
				firstDayOfWeek: 1,
				year: null,
				month: null,
				week: null,
				width: 0
			};
		},
		props: {
			events: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		computed: {
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
			monthLabel: function() {
				return this.$t('vue.datepicker.month' + (this.month + 1));
			},
			nowLabel: function() {
				return this.$t('vue.datepicker.today');
			}
		},
		created: function() {
			this.$on('pick', function(date) {
				var dateEvents = findEventsByDate(date, this.events);
				this.$emit('dayclick', date, dateEvents);
			});
		}
	});
	Vue.component('VueCalendar', VueCalendar);
});
