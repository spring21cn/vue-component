!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueSlider', this, function(Vue, VueUtil, VueTooltip) {
	'use strict';
	var mouseEvents = VueUtil.component.mouseEvents;
	var VueSliderButton = {
		template: '<div class="vue-slider__button-wrapper" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @mousedown="onButtonDown" @touchstart="onButtonDown" :class="{ \'hover\': hovering, \'dragging\': dragging }" :style="wrapperStyle" ref="button"><vue-tooltip placement="top" ref="tooltip" :disabled="!showTooltip"><span slot="content">{{ formatValue }}</span><div class="vue-slider__button" :class="{ \'hover\': hovering, \'dragging\': dragging }"></div></vue-tooltip></div>',
		name: 'VueSliderButton',
		props: {
			value: {
				type: Number,
				default: 0
			},
			vertical: {
				type: Boolean,
				default: false
			}
		},
		data: function() {
			return {
				hovering: false,
				dragging: false,
				startX: 0,
				currentX: 0,
				startY: 0,
				currentY: 0,
				startPosition: 0,
				newPosition: null,
				oldValue: this.value
			};
		},
		computed: {
			disabled: function() {
				return this.$parent.disabled;
			},
			max: function() {
				return this.$parent.max;
			},
			min: function() {
				return this.$parent.min;
			},
			step: function() {
				return this.$parent.step;
			},
			showTooltip: function() {
				return this.$parent.showTooltip;
			},
			precision: function() {
				return this.$parent.precision;
			},
			currentPosition: function() {
				return (this.value - this.min) / (this.max - this.min) * 100 + '%'
			},
			enableFormat: function() {
				return this.$parent.formatTooltip instanceof Function;
			},
			formatValue: function() {
				return this.enableFormat && this.$parent.formatTooltip(this.value) || this.value;
			},
			wrapperStyle: function() {
				return this.vertical ? { bottom: this.currentPosition } : { left: this.currentPosition };
			}
		},
		watch: {
			dragging: function(val) {
				this.$parent.dragging = val;
			}
		},
		methods: {
			displayTooltip: function() {
				this.$refs.tooltip && (this.$refs.tooltip.showPopper = true);
			},
			hideTooltip: function() {
				this.$refs.tooltip && (this.$refs.tooltip.showPopper = false);
			},
			handleMouseEnter: function() {
				this.hovering = true;
				this.displayTooltip();
			},
			handleMouseLeave: function() {
				this.hovering = false;
				this.hideTooltip();
			},
			onButtonDown: function(event) {
				if (this.disabled) return;
				event.preventDefault();
				this.displayTooltip();
				this.onDragStart(event);
				window.addEventListener(mouseEvents.move, this.onDragging);
				window.addEventListener(mouseEvents.up, this.onDragEnd);
				window.addEventListener('contextmenu', this.onDragEnd);
			},
			onDragStart: function(event) {
				this.dragging = true;
				if (this.vertical) {
					this.startY = event.clientY || event.touches[0].clientY;
				} else {
					this.startX = event.clientX || event.touches[0].clientX;
				}
				this.startPosition = parseFloat(this.currentPosition);
			},
			onDragging: function(event) {
				if (this.dragging) {
					this.displayTooltip();
					var diff = 0;
					var sliderSize = 1;
					var parentObj = this.$parent;
					if (parentObj.$refs.slider) {
						sliderSize = parentObj.$refs.slider['client' + (parentObj.vertical ? 'Height' : 'Width')];
					}
					if (this.vertical) {
						this.currentY = event.clientY || event.touches[0].clientY;
						diff = (this.startY - this.currentY) / sliderSize * 100;
					} else {
						this.currentX = event.clientX || event.touches[0].clientX;
						diff = (this.currentX - this.startX) / sliderSize * 100;
					}
					this.newPosition = this.startPosition + diff;
					this.setPosition(this.newPosition);
				}
			},
			onDragEnd: function() {
				var self = this;
				if (self.dragging) {
					setTimeout(function() {
						self.dragging = false;
						self.hideTooltip();
						self.setPosition(self.newPosition);
					}, 0);
					window.removeEventListener(mouseEvents.move, self.onDragging);
					window.removeEventListener(mouseEvents.up, self.onDragEnd);
					window.removeEventListener('contextmenu', self.onDragEnd);
				}
			},
			setPosition: function(newPosition) {
				if (newPosition === null) return;
				if (newPosition < 0) {
					newPosition = 0;
				} else if (newPosition > 100) {
					newPosition = 100;
				}
				var lengthPerStep = 100 / ((this.max - this.min) / this.step);
				var steps = Math.round(newPosition / lengthPerStep);
				var value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min;
				value = parseFloat(value.toFixed(this.precision));
				this.$emit('input', value);
				this.$refs.tooltip && this.$refs.tooltip.updatePopper();
				if (!this.dragging && this.value !== this.oldValue) {
					this.oldValue = this.value;
				}
			}
		}
	};
	var VueSlider = {
		template: '<div class="vue-slider" :class="{ \'is-vertical\': vertical}"><div class="vue-slider__runway" :class="{ \'disabled\': disabled }" :style="runwayStyle" @click="onSliderClick" ref="slider"><div class="vue-slider__bar" :style="barStyle"></div><slider-button :vertical="vertical" v-model="firstValue" ref="button1"></slider-button><slider-button :vertical="vertical" v-model="secondValue" ref="button2" v-if="range"></slider-button><div class="vue-slider__stop" v-for="item in stops" :style="vertical ? { \'bottom\': item + \'%\' } : { \'left\': item + \'%\' }" v-if="showStops"></div></div></div>',
		name: 'VueSlider',
		mixins: [VueUtil.component.emitter],
		props: {
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			value: {
				type: [Number, Array],
				default: 0
			},
			showStops: {
				type: Boolean,
				default: false
			},
			showTooltip: {
				type: Boolean,
				default: true
			},
			formatTooltip: Function,
			disabled: {
				type: Boolean,
				default: false
			},
			range: {
				type: Boolean,
				default: false
			},
			vertical: {
				type: Boolean,
				default: false
			},
			height: {
				type: Number,
				default: 200
			}
		},
		components: {
			SliderButton: VueSliderButton
		},
		data: function() {
			return {
				firstValue: null,
				secondValue: null,
				oldValue: null,
				dragging: false
			};
		},
		watch: {
			value: function(val, oldVal) {
				if (this.dragging ||
					Array.isArray(val) &&
					Array.isArray(oldVal) &&
					val.every(function(item, index) {return item === oldVal[index];})) {
					return;
				}
				this.setValues();
			},
			dragging: function(val) {
				if (!val) {
					this.setValues();
				}
			},
			firstValue: function(val) {
				if (this.range) {
					this.$emit('input', [this.minValue, this.maxValue]);
				} else {
					this.$emit('input', val);
				}
			},
			secondValue: function() {
				if (this.range) {
					this.$emit('input', [this.minValue, this.maxValue]);
				}
			},
			min: function() {
				this.setValues();
			},
			max: function() {
				this.setValues();
			}
		},
		methods: {
			valueChanged: function() {
				var self = this;
				if (self.range) {
					return ![self.minValue, self.maxValue]
						.every(function(item, index) {return item === self.oldValue[index];});
				} else {
					return self.value !== self.oldValue;
				}
			},
			setValues: function() {
				var val = this.value;
				if (this.range && Array.isArray(val)) {
					if (val[1] < this.min) {
						this.$emit('input', [this.min, this.min]);
					} else if (val[0] > this.max) {
						this.$emit('input', [this.max, this.max]);
					} else if (val[0] < this.min) {
						this.$emit('input', [this.min, val[1]]);
					} else if (val[1] > this.max) {
						this.$emit('input', [val[0], this.max]);
					} else {
						this.firstValue = val[0];
						this.secondValue = val[1];
						if (this.valueChanged()) {
							this.$emit('change', [this.minValue, this.maxValue]);
							this.dispatch('VueFormItem', 'vue.form.change', [this.minValue, this.maxValue]);
							this.oldValue = val.slice();
						}
					}
				} else if (!this.range && typeof val === 'number' && !isNaN(val)) {
					if (val < this.min) {
						this.$emit('input', this.min);
					} else if (val > this.max) {
						this.$emit('input', this.max);
					} else {
						this.firstValue = val;
						if (this.valueChanged()) {
							this.$emit('change', val);
							this.dispatch('VueFormItem', 'vue.form.change', val);
							this.oldValue = val;
						}
					}
				}
			},
			setPosition: function(percent) {
				var targetValue = this.min + percent * (this.max - this.min) / 100;
				if (!this.range) {
					this.$refs.button1.setPosition(percent);
					return;
				}
				var button;
				if (Math.abs(this.minValue - targetValue) < Math.abs(this.maxValue - targetValue)) {
					button = this.firstValue < this.secondValue ? 'button1' : 'button2';
				} else {
					button = this.firstValue > this.secondValue ? 'button1' : 'button2';
				}
				this.$refs[button].setPosition(percent);
			},
			onSliderClick: function(event) {
				if (this.disabled || this.dragging) return;
				var sliderSize = 1;
				if (this.$refs.slider) {
					sliderSize = this.$refs.slider['client' + (this.vertical ? 'Height' : 'Width')];
				}
				if (this.vertical) {
					var sliderOffsetBottom = this.$refs.slider.getBoundingClientRect().bottom;
					this.setPosition((sliderOffsetBottom - (event.clientY || event.touches[0].clientY)) / sliderSize * 100);
				} else {
					var sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
					this.setPosition(((event.clientX || event.touches[0].clientX) - sliderOffsetLeft) / sliderSize * 100);
				}
			}
		},
		computed: {
			stops: function() {
				var self = this;
				var stopCount = (self.max - self.min) / self.step;
				var stepWidth = 100 * self.step / (self.max - self.min);
				var result = [];
				for (var i = 1; i < stopCount; i++) {
					result.push(i * stepWidth);
				}
				if (self.range) {
					return result.filter(function(step) {
						return step < 100 * (self.minValue - self.min) / (self.max - self.min) ||
							step > 100 * (self.maxValue - self.min) / (self.max - self.min);
					});
				} else {
					return result.filter(function(step) {return step > 100 * (self.firstValue - self.min) / (self.max - self.min);});
				}
			},
			minValue: function() {
				return Math.min(this.firstValue, this.secondValue);
			},
			maxValue: function() {
				return Math.max(this.firstValue, this.secondValue);
			},
			barSize: function() {
				return this.range ? 100 * (this.maxValue - this.minValue) / (this.max - this.min) + '%' : 100 * (this.firstValue - this.min) / (this.max - this.min) + '%'
			},
			barStart: function() {
				return this.range ? 100 * (this.minValue - this.min) / (this.max - this.min) + '%' : '0%'
			},
			precision: function() {
				var precisions = [this.min, this.max, this.step].map(function(item) {
					var decimal = ('' + item).split('.')[1];
					return decimal ? decimal.length : 0;
				});
				return Math.max.apply(null, precisions);
			},
			runwayStyle: function() {
				return this.vertical ? { height: this.height + 'px' } : {};
			},
			barStyle: function() {
				return this.vertical ? {height: this.barSize, bottom: this.barStart} : {width: this.barSize, left: this.barStart};
			}
		},
		mounted: function() {
			if (this.range) {
				if (Array.isArray(this.value)) {
					this.firstValue = Math.max(this.min, this.value[0]);
					this.secondValue = Math.min(this.max, this.value[1]);
				} else {
					this.firstValue = this.min;
					this.secondValue = this.max;
				}
				this.oldValue = [this.firstValue, this.secondValue];
			} else {
				if (typeof this.value !== 'number' || isNaN(this.value)) {
					this.firstValue = this.min;
				} else {
					this.firstValue = Math.min(this.max, Math.max(this.min, this.value));
				}
				this.oldValue = this.firstValue;
			}
		}
	};
	Vue.component(VueSlider.name, VueSlider);
});
