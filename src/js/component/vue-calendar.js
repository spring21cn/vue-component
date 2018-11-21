(function(context, definition) {
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VueDatePicker'], definition);
  } else {
    context.VueCalendar = definition(context.Vue, context.VueUtil, context.VueDatePicker);
    delete context.VueCalendar;
    delete context.VueDatePicker;
    delete context.VuePicker;
  }
})(this, function(Vue, VueUtil, VueDatePicker) {
  'use strict';
  var EventCard = {
    props: {
      date: Date,
      firstDay: Number,
      event: Object
    },
    data: function() {
      return {
        defaultWidth: 0
      };
    },
    render: function(createElement) {
      if (this.defaultWidth === 0) return;
      var self = this;
      var event = self.event;
      var start = VueUtil.parseDate(event.start);
      var end = VueUtil.parseDate(event.end);
      var showTitile = (self.date.getDay() === self.firstDay || VueUtil.formatDate(start) === VueUtil.formatDate(self.date));
      var eventItem = createElement('div', {class: ['vue-full-calendar__event-item', 'is-opacity']}, []);
      if (showTitile) {
        var dateCount = Math.floor((end.getTime() - self.date.getTime()) / 86400000) + 1;
        var lastDayCount = 7 - self.date.getDay();
        var defaultWidth = self.defaultWidth;
        var isEnd = false;
        if (lastDayCount >= dateCount) {
          defaultWidth = defaultWidth * dateCount;
          isEnd = true;
        } else {
          defaultWidth = defaultWidth * lastDayCount;
        }
        if (isEnd) defaultWidth = defaultWidth - 4;
        var eventClass = [];
        var customClass = event.customClass;
        if (VueUtil.isDef(customClass)) {
          VueUtil.mergeArray(eventClass, customClass);
        }
        if (VueUtil.formatDate(start) === VueUtil.formatDate(self.date)) {
          eventClass.push('is-start');
          defaultWidth = defaultWidth - 4;
        }
        eventClass = eventClass.join(' ');
        var mouseenterItem = function(eventCards, event) {
          VueUtil.loop(eventCards, function(card) {
            if (card.event.cellIndex === event.cellIndex
              && VueUtil.formatDate(event.start) === VueUtil.formatDate(card.event.start)
              && VueUtil.formatDate(event.end) === VueUtil.formatDate(card.event.end)) {
              card.$refs.eventItem && card.$refs.eventItem.classList.add('hover');
            }
          });
        };
        var mouseleaveItem = function(eventCards, event) {
          VueUtil.loop(eventCards, function(card) {
            if (card.event.cellIndex === event.cellIndex
              && VueUtil.formatDate(event.start) === VueUtil.formatDate(card.event.start)
              && VueUtil.formatDate(event.end) === VueUtil.formatDate(card.event.end)) {
              card.$refs.eventItem && card.$refs.eventItem.classList.remove('hover');
            }
          });
        };
        var eventCards = self.$parent.$refs.eventCard;
        eventItem = createElement('div', null, [createElement('div', {
          class: ['vue-full-calendar__event-item', eventClass, {'is-opacity': !event.isShow}],
          style: {'position': 'absolute', 'width': defaultWidth + 'px'},
          ref: 'eventItem',
          attrs: {title: event.title},
          on: {
            click: function(e) {
              self.$emit('click', event, e);
            },
            mouseenter: function(e) {mouseenterItem(eventCards, event);},
            mouseleave: function(e) {mouseleaveItem(eventCards, event);}
          },
        }, [event.title]), createElement('div', {class: ['vue-full-calendar__event-item', 'is-opacity']}, [])]);
      }
      return eventItem;
    }
  };
  var FcHeader = {
    template: '<div class="vue-full-calendar-header"><div class="vue-full-calendar-header__left"><slot name="fcLeftHeader"></slot></div><div class="vue-full-calendar-header__center"><button type="button" @click="changeMonth(-1 , \'year\')" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-d-arrow-left"></button><button type="button" @click="changeMonth(-1, \'month\')" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-arrow-left"></button><vue-popover trigger="click"><year-table @pick="handleYearPick" :year="currentMonth.getFullYear()"></year-table><span slot="reference" class="vue-date-picker__header-label">{{yearLabel}}</span></vue-popover><vue-popover trigger="click"><month-table @pick="handleMonthPick" :month="currentMonth.getMonth()"></month-table><span slot="reference" :class="[\'vue-date-picker__header-label\']">{{monthLabel}}</span></vue-popover><button type="button" @click="changeMonth(1 , \'year\')" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-d-arrow-right"></button><button type="button" @click="changeMonth(1 , \'month\')" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-arrow-right"></button></div><div class="vue-full-calendar-header__right"><slot name="fcRightHeader"></slot><span class="thisMonth" @click="changeToNow" v-if="!$slots.fcRightHeader">{{$t(\'vue.datepicker.thisMonth\')}}</span></div></div>',
    props: {
      currentMonth: Date,
      firstDay: Number
    },
    components: {
      YearTable: VueDatePicker().YearTable,
      MonthTable: VueDatePicker().MonthTable
    },
    computed: {
      monthLabel: function() {
        var month = this.currentMonth.getMonth() + 1;
        return this.$t('vue.datepicker.month' + month);
      },
      yearLabel: function() {
        var year = this.currentMonth.getFullYear();
        if (!year) return '';
        var yearTranslation = this.$t('vue.datepicker.year');
        return year + ' ' + yearTranslation;
      }
    },
    methods: {
      handleYearPick: function(year) {
        var result = new Date();
        this.currentMonth.setFullYear(year);
        result.setTime(this.currentMonth.getTime());
        this.$emit('change', result);
      },
      handleMonthPick: function(month) {
        var result = new Date();
        this.currentMonth.setMonth(month);
        result.setTime(this.currentMonth.getTime());
        this.$emit('change', result);
      },
      changeMonth: function(num, type) {
        var newMonth = VueUtil.addDate(this.currentMonth, num, type);
        this.$emit('change', newMonth);
      },
      changeToNow: function() {
        this.$emit('change', new Date);
      }
    }
  };
  var FullCalendar = {
    template: '<div class="vue-full-calendar" :style="compStyle"><fc-header :current-month="currentMonth" :first-day="firstDay" @change="emitChangeMonth"><slot slot="fcLeftHeader" name="fcHeaderLeft"></slot><slot slot="fcRightHeader" name="fcHeaderRight"></slot></fc-header><div class="vue-full-calendar-body"><div v-if="weekLabel" class="vue-full-calendar__weeks"><div class="vue-full-calendar__week" v-for="(week, weekIndex) in WEEKS" :key="weekIndex">{{$t(weekLabel[week])}}</div></div><div v-else class="vue-full-calendar__weeks"><div class="vue-full-calendar__week" v-for="(week, weekIndex) in WEEKS" :key="weekIndex">{{$t(\'vue.datepicker.weeks.\'+week)}}</div></div><div class="vue-full-calendar__dates"><div class="vue-full-calendar__dates-events"><div class="vue-full-calendar__events-week" v-for="(week,weekIndex) in currentDates" :key="weekIndex"><div v-for="(day, dayIndex) in week" :style="eventDayStyle" :key="dayIndex" :class="[\'vue-full-calendar__events-day\', {\'today\': day.isToday}, day.dayClass]" ref="eventsDay"><div :class="[\'day-number\']" @mouseenter="mouseenterDay" @mouseleave="mouseleaveDay" @click="dayclick(day.date, $event)">{{day.monthDay}}</div><div class="vue-full-calendar__event-box"><event-card ref="eventCard" :event="event" :date="day.date" :firstDay="firstDay" v-for="(event, eventIndex) in day.events" :key="eventIndex" v-show="event.cellIndex <= eventLimit" @click="eventclick"></event-card><vue-popover trigger="click" v-if="day.events.length > eventLimit && showMore"><div class="vue-full-calendar__more-events"><ul class="events-list"><li v-for="(event, eventIndex) in selectDay.showEvents" :key="eventIndex" :class="[\'vue-full-calendar__event-item\', event.customClass]" @click="eventclick(event, $event)" @mouseenter="mouseenterEvent(event, $event)" @mouseleave="mouseleaveEvent(event, $event)" :title="event.title">{{event.title}}</li></ul></div><div slot="reference" class="more-link" @click="moreclick(day, $event)">+ {{day.moreCount}}</div></vue-popover><div v-if="day.events.length > eventLimit && !showMore" class="more-link" @click="moreclick(day, $event)">+{{day.moreCount}}</div></div></div></div></div></div></div></div>',
    props: {
      events: Array,
      eventLimit: Number,
      showMore: Boolean,
      dateClass: Array,
      weekClass: Array,
      weekLabel: Object
    },
    components: {
      EventCard: EventCard,
      FcHeader: FcHeader
    },
    mounted: function() {
      this.emitChangeMonth(this.currentMonth);
      VueUtil.addResizeListener(this.$el, this.changeEventCardWidth);
    },
    beforeDestroy: function() {
      this.$el && VueUtil.removeResizeListener(this.$el, this.changeEventCardWidth);
    },
    data: function() {
      return {
        currentMonth: new Date,
        firstDay: 0,
        selectDay: {}
      };
    },
    computed: {
      currentDates: function() {
        return this.getCalendar();
      },
      WEEKS: function() {
        var WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        var week = this.firstDay;
        return VueUtil.mergeArray(WEEKS, WEEKS).slice(week, week + 7);
      },
      eventDayStyle: function() {
        var style = {};
        var height = (this.eventLimit + 2) * 20;
        style.height = height + 'px';
        return style;
      },
      compStyle: function() {
        var style = {};
        var width = (this.eventLimit + 2) * 20 * 7 + 43;
        var height = (this.eventLimit + 2) * 20 * 7 + 63 - this.eventLimit * 20;
        style.width = width + 'px';
        style.height = height + 'px';
        return style;
      }
    },
    watch: {
      events: function(val) {
        this.$nextTick(this.changeEventCardWidth);
      }
    },
    methods: {
      changeEventCardWidth: function() {
        var eventCard = this.$refs.eventCard;
        var defaultWidth = parseFloat(VueUtil.getStyle(this.$refs.eventsDay[0], 'width'));
        if (VueUtil.isArray(eventCard)) {
          VueUtil.loop(eventCard, function(card) {
            card.defaultWidth = defaultWidth;
          });
        } else if(VueUtil.isDef(eventCard)) {
          eventCard.defaultWidth = defaultWidth;
        }
      },
      getStartDateOfMonth: function(year, month) {
        var result = new Date(year, month, 1);
        var day = result.getDay();
        if (day === 0) day = 7;
        result.setTime(result.getTime() - 86400000 * day);
        return result;
      },
      emitChangeMonth: function(firstDayOfMonth) {
        this.currentMonth = firstDayOfMonth;
        var start = this.getStartDateOfMonth(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth());
        var end = VueUtil.addDate(start, 6, 'week');
        this.$emit('changemonth', start, end, firstDayOfMonth);
        this.$nextTick(this.changeEventCardWidth);
      },
      getCalendar: function() {
        var monthViewStartDate = this.getStartDateOfMonth(this.currentMonth.getFullYear(), this.currentMonth.getMonth());
        var calendar = [];
        var dateClassAry = this.dateClass;
        var weekClassAry = this.weekClass;
        for (var perWeek = 0; perWeek < 6; perWeek++) {
          var week = [];
          for (var perDay = 0; perDay < 7; perDay++) {
            var dayClass = [];
            VueUtil.loop(dateClassAry, function(dateClass) {
              if (VueUtil.formatDate(dateClass.date) === VueUtil.formatDate(monthViewStartDate)) {
                VueUtil.mergeArray(dayClass, dateClass.customClass);
              }
            });
            VueUtil.loop(weekClassAry, function(weekClass) {
              if (weekClass.week === perDay) {
                VueUtil.mergeArray(dayClass, weekClass.customClass);
              }
            });
            week.push({
              monthDay: monthViewStartDate.getDate(),
              isToday: (VueUtil.formatDate(monthViewStartDate) === VueUtil.formatDate(new Date)),
              weekDay: perDay,
              date: monthViewStartDate,
              events: this.slotEvents(monthViewStartDate),
              dayClass: dayClass
            });
            monthViewStartDate = VueUtil.addDate(monthViewStartDate, 1);
          }
          var self = this;
          VueUtil.loop(week, function(day) {
            day.showEvents = VueUtil.filter(day.events, function(event) {
              return event.isShow === true;
            });
            day.moreCount = 0;
            VueUtil.loop(day.showEvents, function(event) {
              if (event.cellIndex > self.eventLimit) {
                day.moreCount++;
              }
            });
          });
          calendar.push(week);
        }
        return calendar;
      },
      slotEvents: function(date) {
        var cellIndexArr = [];
        var events = VueUtil.mergeArray([], this.events);
        var thisDayEvents = VueUtil.filter(events, function(day) {
          var st = VueUtil.parseDate(day.start).getTime();
          var ed = VueUtil.parseDate(day.end ? day.end : st).getTime();
          var de = VueUtil.parseDate(date).getTime();
          return (de >= st && de <= ed);
        });
        thisDayEvents.sort(function(a, b) {
          if (!a.cellIndex) return 1;
          if (!b.cellIndex) return -1;
          return a.cellIndex - b.cellIndex;
        });
        for (var i = 0; i < thisDayEvents.length; i++) {
          thisDayEvents[i].cellIndex = thisDayEvents[i].cellIndex || (i + 1);
          thisDayEvents[i].isShow = true;
          if (thisDayEvents[i].cellIndex === i + 1 || i > this.eventLimit) continue;
          var formatDate = VueUtil.formatDate(date);
          thisDayEvents.splice(i, 0, {
            cellIndex: i + 1,
            start: formatDate,
            end: formatDate,
            isShow: false
          });
        }
        return thisDayEvents;
      },
      findEventsByDate: function(date, events) {
        var findEvents = [];
        VueUtil.loop(events, function(event) {
          var st = VueUtil.parseDate(event.start).getTime();
          var ed = VueUtil.parseDate(event.end ? event.end : st).getTime();
          var de = VueUtil.parseDate(date).getTime();
          if (de >= st && de <= ed) {
            findEvents.push(event);
          }
        });
        return findEvents;
      },
      mouseenterDay: function(e) {
        e.target.parentElement.classList.add('hover');
      },
      mouseleaveDay: function(e) {
        e.target.parentElement.classList.remove('hover');
      },
      mouseenterEvent: function(event, e) {
        VueUtil.loop(this.$refs.eventCard, function(card) {
          if (card.event.cellIndex === event.cellIndex
            && VueUtil.formatDate(event.start) === VueUtil.formatDate(card.event.start)
            && VueUtil.formatDate(event.end) === VueUtil.formatDate(card.event.end)) {
            card.$refs.eventItem && card.$refs.eventItem.classList.add('hover');
          }
        });
        e.target.classList.add('hover');
      },
      mouseleaveEvent: function(event, e) {
        VueUtil.loop(this.$refs.eventCard, function(card) {
          if (card.event.cellIndex === event.cellIndex
            && VueUtil.formatDate(event.start) === VueUtil.formatDate(card.event.start)
            && VueUtil.formatDate(event.end) === VueUtil.formatDate(card.event.end)) {
            card.$refs.eventItem && card.$refs.eventItem.classList.remove('hover');
          }
        });
        e.target.classList.remove('hover');
      },
      moreclick: function(day, jsEvent) {
        this.selectDay = day;
        var dateEvents = this.findEventsByDate(day.date, this.events);
        this.$emit('moreclick', day.date, dateEvents, jsEvent);
      },
      dayclick: function(date, jsEvent) {
        var dateEvents = this.findEventsByDate(date, this.events);
        this.$emit('dayclick', date, dateEvents, jsEvent);
      },
      eventclick: function(event, jsEvent) {
        if (!event.isShow) return;
        jsEvent.stopPropagation();
        this.$emit('eventclick', event, jsEvent);
      }
    }
  };
  var DefaultCalendar = {
    template: '<div :style="{width: width + \'px\'}" class="vue-picker-panel vue-date-picker has-time"><div class="vue-picker-panel__body-wrapper"><div class="vue-picker-panel__body"><div class="vue-date-picker__header" v-show="currentView !== \'time\'"><button type="button" @click="prevYear" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-d-arrow-left"></button><button type="button" @click="prevMonth" v-show="currentView === \'date\'" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-arrow-left"></button><span @click="showYearPicker" class="vue-date-picker__header-label">{{yearLabel}}</span><span @click="showMonthPicker" v-show="currentView === \'date\'" :class="[\'vue-date-picker__header-label\', {active: currentView === \'month\'}]">{{monthLabel}}</span><button type="button" @click="nextYear" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-d-arrow-right"></button><button type="button" @click="nextMonth" v-show="currentView === \'date\'" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-arrow-right"></button></div><div class="vue-picker-panel__content"><date-table v-show="currentView === \'date\'" @pick="handleDatePick" :year="year" :month="month" :date="date" :week="week" :selection-mode="selectionMode" :first-day-of-week="firstDayOfWeek" :disabled-date="disabledDate" :events="events"></date-table><year-table ref="yearTable" :year="year" :date="date" v-show="currentView === \'year\'" @pick="handleYearPick" :disabled-date="disabledDate"></year-table><month-table :month="month" :date="date" v-show="currentView === \'month\'" @pick="handleMonthPick" :disabled-date="disabledDate"></month-table></div></div></div><div class="vue-picker-panel__footer"><a href="JavaScript:" class="vue-picker-panel__link-btn" @click="changeToNow">{{nowLabel}}</a></div></div>',
    mixins: [VueDatePicker().DatePanel],
    data: function() {
      return {
        date: new Date(),
        selectionMode: 'day',
        currentView: 'date',
        disabledDate: {},
        firstDayOfWeek: 0,
        year: null,
        month: null,
        week: null,
        width: 0
      };
    },
    props: {
      events: Array
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
    mounted: function() {
      if (this.date && !this.year) {
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
      }
      this.$emit('pick', this.date);
    },
    created: function() {
      this.$on('pick', function(date) {
        var findEventsByDate = function(date, events) {
          if (events && events.length > 0) {
            var findEvents = [];
            VueUtil.loop(events, function(event) {
              var st = VueUtil.parseDate(event.start).getTime();
              var ed = VueUtil.parseDate(event.end ? event.end : st).getTime();
              var de = VueUtil.parseDate(date).getTime();
              if (de >= st && de <= ed) {
                findEvents.push(event);
              }
            });
            return findEvents;
          }
        };
        var dateEvents = findEventsByDate(date, this.events);
        this.$emit('dayclick', date, dateEvents);
      });
    }
  };
  var VueCalendar = {
    template: '<full-calendar v-if="full" ref="fullCalendar" :date-class="dateClass" :week-class="weekClass" :week-label="weekLabel" :events="events" :event-limit="eventLimit" :show-more="showMore" @dayclick="dayclick" @eventclick="eventclick" @moreclick="moreclick"><slot name="headerLeft" slot="fcHeaderLeft"></slot><slot name="headerRight" slot="fcHeaderRight"></slot></full-calendar><calendar v-else :events="events" @dayclick="dayclick" ref="calendar"></calendar>',
    name: 'VueCalendar',
    components: {
      calendar: DefaultCalendar,
      FullCalendar: FullCalendar
    },
    props: {
      events: {
        type: Array,
        default: function() {
          return [];
        }
      },
      eventLimit: {
        type: Number,
        default: 2
      },
      showMore: {
        type: Boolean,
        default: true
      },
      dateClass: {
        type: Array,
        default: function() {
          return [];
        }
      },
      weekClass: {
        type: Array,
        default: function() {
          return [];
        }
      },
      weekLabel: {
        type: Object,
        default: function() {
          return null;
        }
      },
      full: Boolean
    },
    methods: {
      changeToNow: function () {
        if (this.$refs.fullCalendar && this.$refs.fullCalendar.emitChangeMonth) {
          this.$refs.fullCalendar.emitChangeMonth(new Date);
        }
      },
      getDate: function () {
        if (this.$refs.fullCalendar) {
          return this.$refs.fullCalendar.currentMonth;
        }
      },
      dayclick: function(day, events, jsEvent) {
        this.$emit('dayclick', day, events, jsEvent);
      },
      eventclick: function(event, jsEvent) {
        this.$emit('eventclick', event, jsEvent);
      },
      moreclick: function(day, events, jsEvent) {
        this.$emit('moreclick', day, events, jsEvent);
      },
    }
  };
  Vue.component(VueCalendar.name, VueCalendar);
});
