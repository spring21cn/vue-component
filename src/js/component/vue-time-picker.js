!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePicker', 'VueUtil', 'VueScrollbar'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePicker'], context['VueUtil'], context['VueScrollbar']);
	}
})('VueTimePicker', this, function(Vue, VuePicker, VueUtil, VueScrollbar) {
	'use strict';
	var MIN_TIME = VueUtil.parseDate('00:00:00', 'HH:mm:ss');
	var MAX_TIME = VueUtil.parseDate('23:59:59', 'HH:mm:ss');
	var isDisabled = function(minTime, maxTime) {
		var minValue = minTime.getHours() * 3600 + minTime.getMinutes() * 60 + minTime.getSeconds();
		var maxValue = maxTime.getHours() * 3600 + maxTime.getMinutes() * 60 + maxTime.getSeconds();
		return minValue > maxValue;
	};
	var clacTime = function(time) {
		time = Array.isArray(time) ? time : [time];
		var minTime = time[0] || new Date();
		var date = new Date();
		date.setHours(date.getHours() + 1);
		var maxTime = time[1] || date;
		if (minTime > maxTime) return clacTime();
		return { minTime: minTime, maxTime: maxTime };
	};
	var TimeSpinner = {
		template: '<div class="vue-time-spinner" :class="{ \'has-seconds\': showSeconds }"><vue-scrollbar noresize @mouseenter.native="emitSelectRange(\'hours\')" class="vue-time-spinner__wrapper" wrap-style="max-height: inherit;" view-class="vue-time-spinner__list" noresize tag="ul" ref="hour"><li @click="handleClick(\'hours\', { value: hour, disabled: disabled }, true)" v-for="(disabled, hour) in hoursList" track-by="hour" class="vue-time-spinner__item" :class="{ \'active\': hour === hours, \'disabled\': disabled }" v-text="hour"></li></vue-scrollbar><vue-scrollbar @mouseenter.native="emitSelectRange(\'minutes\')" class="vue-time-spinner__wrapper" wrap-style="max-height: inherit;" view-class="vue-time-spinner__list" noresize tag="ul" ref="minute"><li @click="handleClick(\'minutes\', key, true)" v-for="(minute, key) in 60" class="vue-time-spinner__item" :class="{ \'active\': key === minutes }" v-text="key"></li></vue-scrollbar><vue-scrollbar v-show="showSeconds" @mouseenter.native="emitSelectRange(\'seconds\')" class="vue-time-spinner__wrapper" wrap-style="max-height: inherit;" view-class="vue-time-spinner__list" noresize tag="ul" ref="second"><li @click="handleClick(\'seconds\', key, true)" v-for="(second, key) in 60" class="vue-time-spinner__item" :class="{ \'active\': key === seconds }" v-text="key"></li></vue-scrollbar></div>',
		components: {
			VueScrollbar: VueScrollbar()
		},
		props: {
			hours: {
				type: Number,
				default: 0
			},
			minutes: {
				type: Number,
				default: 0
			},
			seconds: {
				type: Number,
				default: 0
			},
			showSeconds: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			hoursPrivate: function(newVal, oldVal) {
				if (!(newVal >= 0 && newVal <= 23)) {
					this.hoursPrivate = oldVal;
				}
				this.ajustElTop('hour', newVal);
				this.$emit('change', { hours: newVal });
			},
			minutesPrivate: function(newVal, oldVal) {
				if (!(newVal >= 0 && newVal <= 59)) {
					this.minutesPrivate = oldVal;
				}
				this.ajustElTop('minute', newVal);
				this.$emit('change', { minutes: newVal });
			},
			secondsPrivate: function(newVal, oldVal) {
				if (!(newVal >= 0 && newVal <= 59)) {
					this.secondsPrivate = oldVal;
				}
				this.ajustElTop('second', newVal);
				this.$emit('change', { seconds: newVal });
			}
		},
		computed: {
			hoursList: function() {
				return VueUtil.component.getRangeHours(this.selectableRange);
			},
			hourVue: function() {
				return this.$refs.hour.wrap;
			},
			minuteVue: function() {
				return this.$refs.minute.wrap;
			},
			secondVue: function() {
				return this.$refs.second.wrap;
			}
		},
		data: function() {
			return {
				hoursPrivate: 0,
				minutesPrivate: 0,
				secondsPrivate: 0,
				selectableRange: []
			};
		},
		created: function() {
			var self = this;
			self.debounceAjustElTop = VueUtil.component.debounce(100, function(type) {self.ajustElTop(type, self[type + 's']);});
		},
		mounted: function() {
			var self = this;
			self.$nextTick(function() {
				self.bindScrollEvent();
			});
		},
		methods: {
			handleClick: function(type, value, disabled) {
				if (value.disabled) {
					return;
				}
				this[type + 'Private'] = value.value >= 0 ? value.value : value;
				this.emitSelectRange(type);
			},
			emitSelectRange: function(type) {
				if (type === 'hours') {
					this.$emit('select-range', 0, 2);
				} else if (type === 'minutes') {
					this.$emit('select-range', 3, 5);
				} else if (type === 'seconds') {
					this.$emit('select-range', 6, 8);
				}
			},
			bindScrollEvent: function() {
				var self = this;
				var bindFuntion = function(type) {
					self[type + 'Vue'].onscroll = function(e) {self.handleScroll(type, e);}
				};
				bindFuntion('hour');
				bindFuntion('minute');
				bindFuntion('second');
			},
			handleScroll: function(type) {
				var ajust = {};
				ajust[type + 's'] = Math.min(Math.floor((this[type + 'Vue'].scrollTop - 80) / 32 + 3), 59);
				this.debounceAjustElTop(type);
				this.$emit('change', ajust);
			},
			ajustScrollTop: function() {
				this.ajustElTop('hour', this.hours);
				this.ajustElTop('minute', this.minutes);
				this.ajustElTop('second', this.seconds);
			},
			ajustElTop: function(type, value) {
				this[type + 'Vue'].scrollTop = Math.max(0, (value - 2.5) * 32 + 80);
			}
		}
	};
	var TimePanel = {
		template: '<transition name="vue-zoom-in-top" @after-leave="$emit(\'dodestroy\')"><div v-show="currentVisible" :style="{width: width + \'px\'}" class="vue-time-panel" :class="popperClass"><div class="vue-time-panel__content" :class="{ \'has-seconds\': showSeconds }"><time-spinner ref="spinner" @change="handleChange" :show-seconds="showSeconds" @select-range="setSelectionRange" :hours="hours" :minutes="minutes" :seconds="seconds"></time-spinner></div><div class="vue-time-panel__footer"><button type="button" class="vue-time-panel__btn cancel" @click="handleCancel">{{ cancelLabel }}</button><button type="button" class="vue-time-panel__btn confirm" @click="handleConfirm()">{{ confirmLabel }}</button></div></div></transition>',
		components: {
			TimeSpinner: TimeSpinner
		},
		props: {
			pickerWidth: {},
			date: {
				default: function() {
					return new Date();
				}
			},
			visible: Boolean
		},
		watch: {
			visible: function(val) {
				this.currentVisible = val;
			},
			pickerWidth: function(val) {
				this.width = val;
			},
			value: function(newVal) {
				var self = this;
				var date;
				if (newVal instanceof Date) {
					date = VueUtil.component.limitRange(newVal, self.selectableRange);
				} else if (!newVal) {
					date = new Date();
				}
				self.handleChange({
					hours: date.getHours(),
					minutes: date.getMinutes(),
					seconds: date.getSeconds()
				});
				self.$nextTick(function() {self.ajustScrollTop();});
			},
			selectableRange: function(val) {
				this.$refs.spinner.selectableRange = val;
			}
		},
		data: function() {
			return {
				popperClass: '',
				format: 'HH:mm:ss',
				value: '',
				hours: 0,
				minutes: 0,
				seconds: 0,
				selectableRange: [],
				currentDate: this.$options.defaultValue || this.date || new Date(),
				currentVisible: this.visible || false,
				width: this.pickerWidth || 0
			};
		},
		computed: {
			showSeconds: function() {
				return (this.format || '').indexOf('ss') !== -1;
			},
			confirmLabel: function() {
				return this.$t('vue.datepicker.confirm');
			},
			cancelLabel: function() {
				return this.$t('vue.datepicker.cancel');
			}
		},
		methods: {
			handleClear: function() {
				this.$emit('pick');
			},
			handleCancel: function() {
				this.$emit('pick');
			},
			handleChange: function(date) {
				if (date.hours !== undefined) {
					this.currentDate.setHours(date.hours);
					this.hours = this.currentDate.getHours();
				}
				if (date.minutes !== undefined) {
					this.currentDate.setMinutes(date.minutes);
					this.minutes = this.currentDate.getMinutes();
				}
				if (date.seconds !== undefined) {
					this.currentDate.setSeconds(date.seconds);
					this.seconds = this.currentDate.getSeconds();
				}
				this.handleConfirm(true);
			},
			setSelectionRange: function(start, end) {
				this.$emit('select-range', start, end);
			},
			handleConfirm: function(visible, first) {
				visible = visible||false;
				if (first) return;
				var date = new Date(VueUtil.component.limitRange(this.currentDate, this.selectableRange, 'HH:mm:ss'));
				this.$emit('pick', date, visible, first);
			},
			ajustScrollTop: function() {
				return this.$refs.spinner.ajustScrollTop();
			}
		},
		created: function() {
			this.hours = this.currentDate.getHours();
			this.minutes = this.currentDate.getMinutes();
			this.seconds = this.currentDate.getSeconds();
		},
		mounted: function() {
			var self = this;
			self.$nextTick(function() {self.handleConfirm(true, true);});
			self.$emit('mounted');
		}
	};
	var TimeRangePanel = {
		template: '<transition name="vue-zoom-in-top" @before-enter="panelCreated" @after-leave="$emit(\'dodestroy\')"><div v-show="visible" :style="{ width: width + \'px\' }" class="vue-time-range-picker vue-picker-panel" :class="popperClass"><div class="vue-time-range-picker__content"><div class="vue-time-range-picker__cell"><div class="vue-time-range-picker__header">{{ $t(\'vue.datepicker.startTime\') }}</div><div :class="{ \'has-seconds\': showSeconds }" class="vue-time-range-picker__body vue-time-panel__content"><time-spinner ref="minSpinner" :show-seconds="showSeconds" @change="handleMinChange" @select-range="setMinSelectionRange" :hours="minHours" :minutes="minMinutes" :seconds="minSeconds"></time-spinner></div></div><div class="vue-time-range-picker__cell"><div class="vue-time-range-picker__header">{{ $t(\'vue.datepicker.endTime\') }}</div><div :class="{ \'has-seconds\': showSeconds }" class="vue-time-range-picker__body vue-time-panel__content"><time-spinner ref="maxSpinner" :show-seconds="showSeconds" @change="handleMaxChange" @select-range="setMaxSelectionRange" :hours="maxHours" :minutes="maxMinutes" :seconds="maxSeconds"></time-spinner></div></div></div><div class="vue-time-panel__footer"><button type="button" class="vue-time-panel__btn cancel" @click="handleCancel()">{{ cancelLabel }}</button><button type="button" class="vue-time-panel__btn confirm" @click="handleConfirm()" :disabled="btnDisabled">{{ confirmLabel }}</button></div></div></transition>',
		components: {
			TimeSpinner: TimeSpinner
		},
		computed: {
			showSeconds: function() {
				return (this.format || '').indexOf('ss') !== -1;
			},
			confirmLabel: function() {
				return this.$t('vue.datepicker.confirm');
			},
			cancelLabel: function() {
				return this.$t('vue.datepicker.cancel');
			}
		},
		props: ['value'],
		data: function() {
			var time = clacTime(this.$options.defaultValue);
			return {
				popperClass: '',
				minTime: time.minTime,
				maxTime: time.maxTime,
				btnDisabled: isDisabled(time.minTime, time.maxTime),
				maxHours: time.maxTime.getHours(),
				maxMinutes: time.maxTime.getMinutes(),
				maxSeconds: time.maxTime.getSeconds(),
				minHours: time.minTime.getHours(),
				minMinutes: time.minTime.getMinutes(),
				minSeconds: time.minTime.getSeconds(),
				format: 'HH:mm:ss',
				visible: false,
				width: 0
			};
		},
		watch: {
			value: function(newVal) {
				var self = this;
				self.panelCreated();
				self.$nextTick(function() {self.ajustScrollTop();});
			}
		},
		methods: {
			panelCreated: function() {
				var time = clacTime(this.value);
				if (time.minTime === this.minTime && time.maxTime === this.maxTime) {
					return;
				}
				this.handleMinChange({
					hours: time.minTime.getHours(),
					minutes: time.minTime.getMinutes(),
					seconds: time.minTime.getSeconds()
				});
				this.handleMaxChange({
					hours: time.maxTime.getHours(),
					minutes: time.maxTime.getMinutes(),
					seconds: time.maxTime.getSeconds()
				});
			},
			handleClear: function() {
				this.handleCancel();
			},
			handleCancel: function() {
				this.$emit('pick');
			},
			handleChange: function() {
				if (this.minTime > this.maxTime) return;
				MIN_TIME.setFullYear(this.minTime.getFullYear());
				MIN_TIME.setMonth(this.minTime.getMonth(), this.minTime.getDate());
				MAX_TIME.setFullYear(this.maxTime.getFullYear());
				MAX_TIME.setMonth(this.maxTime.getMonth(), this.maxTime.getDate());
				this.$refs.minSpinner.selectableRange = [[MIN_TIME, this.maxTime]];
				this.$refs.maxSpinner.selectableRange = [[this.minTime, MAX_TIME]];
				this.handleConfirm(true);
			},
			handleMaxChange: function(date) {
				if (date.hours !== undefined) {
					this.maxTime.setHours(date.hours);
					this.maxHours = this.maxTime.getHours();
				}
				if (date.minutes !== undefined) {
					this.maxTime.setMinutes(date.minutes);
					this.maxMinutes = this.maxTime.getMinutes();
				}
				if (date.seconds !== undefined) {
					this.maxTime.setSeconds(date.seconds);
					this.maxSeconds = this.maxTime.getSeconds();
				}
				this.handleChange();
			},
			handleMinChange: function(date) {
				if (date.hours !== undefined) {
					this.minTime.setHours(date.hours);
					this.minHours = this.minTime.getHours();
				}
				if (date.minutes !== undefined) {
					this.minTime.setMinutes(date.minutes);
					this.minMinutes = this.minTime.getMinutes();
				}
				if (date.seconds !== undefined) {
					this.minTime.setSeconds(date.seconds);
					this.minSeconds = this.minTime.getSeconds();
				}
				this.handleChange();
			},
			setMinSelectionRange: function(start, end) {
				this.$emit('select-range', start, end);
			},
			setMaxSelectionRange: function(start, end) {
				this.$emit('select-range', start + 11, end + 11);
			},
			handleConfirm: function(visible, first) {
				visible = visible||false;
				first = first||false;
				var minSelectableRange = this.$refs.minSpinner.selectableRange;
				var maxSelectableRange = this.$refs.maxSpinner.selectableRange;
				this.minTime = VueUtil.component.limitRange(this.minTime, minSelectableRange);
				this.maxTime = VueUtil.component.limitRange(this.maxTime, maxSelectableRange);
				if (first) return;
				this.$emit('pick', [this.minTime, this.maxTime], visible, first);
			},
			ajustScrollTop: function() {
				this.$refs.minSpinner.ajustScrollTop();
				this.$refs.maxSpinner.ajustScrollTop();
			}
		},
		mounted: function() {
			var self = this;
			self.$nextTick(function() {self.handleConfirm(true, true);});
		}
	};
	var VueTimePicker = {
		mixins: [VuePicker()],
		name: 'VueTimePicker',
		props: {
			isRange: Boolean
		},
		data: function() {
			return {
				type: ''
			};
		},
		watch: {
			isRange: function(isRange) {
				if (this.picker) {
					this.unmountPicker();
					this.type = isRange ? 'timerange' : 'time';
					this.panel = isRange ? TimeRangePanel : TimePanel;
					this.mountPicker();
				} else {
					this.type = isRange ? 'timerange' : 'time';
					this.panel = isRange ? TimeRangePanel : TimePanel;
				}
			}
		},
		created: function() {
			this.type = this.isRange ? 'timerange' : 'time';
			this.panel = this.isRange ? TimeRangePanel : TimePanel;
		}
	};
	Vue.component(VueTimePicker.name, VueTimePicker);
	return function() {
		return {
			VueTimePicker: VueTimePicker,
			TimePicker: TimePanel
		}
	}
});
