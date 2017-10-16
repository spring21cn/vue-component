!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePicker'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePicker']);
		delete context[name];
	}
})('VueTimeSelect', this, function(Vue, VuePicker) {
	'use strict';
	var parseTime = function(time) {
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
	};
	var compareTime = function(time1, time2) {
		var value1 = parseTime(time1);
		var value2 = parseTime(time2);
		var minutes1 = value1.minutes + value1.hours * 60;
		var minutes2 = value2.minutes + value2.hours * 60;
		if (minutes1 === minutes2) {
			return 0;
		}
		return minutes1 > minutes2 ? 1 : -1;
	};
	var formatTime = function(time) {
		return (time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes);
	};
	var nextTime = function(time, step) {
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
	var TimeSelect = {
		template: '<transition name="vue-zoom-in-top" @after-leave="$emit(\'dodestroy\')"><div v-show="visible" :style="{ width: width + \'px\' }" :class="popperClass" class="vue-picker-panel time-select"><div class="vue-picker-panel__content"><div class="time-select-item" v-for="item in items" :class="{ selected: value === item.value, disabled: item.disabled }" :disabled="item.disabled" @click="handleClick(item)">{{ item.value }}</div></div></div></transition>',
		watch: {
			value: function(val) {
				if (!val) return;
				if (this.minTime && compareTime(val, this.minTime) < 0) {
					this.$emit('pick');
				} else if (this.maxTime && compareTime(val, this.maxTime) > 0) {
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
					while (compareTime(current, end) <= 0) {
						result.push({
							value: current,
							disabled: compareTime(current, this.minTime || '-1:-1') <= 0 ||
								compareTime(current, this.maxTime || '100:100') >= 0
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
		beforeCreate: function() {
			this.type = 'time-select';
			this.panel = TimeSelect;
		}
	};
	Vue.component(VueTimeSelect.name, VueTimeSelect);
});
