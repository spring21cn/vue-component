!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueRate', this, function(Vue, VueUtil) {
	'use strict';
	var VueRate = {
		template: '<div class="vue-rate"><span v-for="item in max" class="vue-rate__item" @mousemove="setCurrentValue(item, $event)" @mouseleave="resetCurrentValue" @click="selectValue(item)" :style="{ cursor: disabled ? \'auto\' : \'pointer\' }"><i :class="[classes[item - 1], { \'hover\': hoverIndex === item }]" class="vue-rate__icon" :style="getIconStyle(item)"><i v-if="showDecimalIcon(item)" :class="decimalIconClass" :style="decimalStyle" class="vue-rate__decimal"></i></i></span><span v-if="showText" class="vue-rate__text" :style="{ color: textColor }">{{ text }}</span></div>',
			name: 'VueRate',
			data: function() {
				return {
					classMap: {},
					colorMap: {},
					pointerAtLeftHalf: false,
					currentValue: this.value,
					hoverIndex: -1
				};
			},
			props: {
				value: {
					type: Number,
					default: 0
				},
				lowThreshold: {
					type: Number,
					default: 2
				},
				highThreshold: {
					type: Number,
					default: 4
				},
				max: {
					type: Number,
					default: 5
				},
				colors: {
					type: Array,
					default: function() {
						return ['#F7BA2A', '#F7BA2A', '#F7BA2A'];
					}
				},
				voidColor: {
					type: String,
					default: '#C6D1DE'
				},
				disabledVoidColor: {
					type: String,
					default: '#EFF2F7'
				},
				iconClasses: {
					type: Array,
					default: function() {
						return ['vue-icon-star-on', 'vue-icon-star-on', 'vue-icon-star-on'];
					}
				},
				voidIconClass: {
					type: String,
					default: 'vue-icon-star-off'
				},
				disabledVoidIconClass: {
					type: String,
					default: 'vue-icon-star-on'
				},
				disabled: {
					type: Boolean,
					default: false
				},
				allowHalf: {
					type: Boolean,
					default: false
				},
				showText: {
					type: Boolean,
					default: false
				},
				textColor: {
					type: String,
					default: '1f2d3d'
				},
				texts: {
					type: Array,
					default: function() {
						return ['极差', '失望', '一般', '满意', '惊喜'];
					}
				},
				textTemplate: {
					type: String,
					default: '{value}'
				}
			},
			computed: {
				text: function() {
					var result = '';
					if (this.disabled) {
						result = this.textTemplate.replace(/\{\s*value\s*\}/, this.value);
					} else {
						result = this.texts[Math.ceil(this.currentValue) - 1];
					}
					return result;
				},
				decimalStyle: function() {
					var width = '';
					if (this.disabled) {
						width = (this.valueDecimal < 50 ? 0 : 50) + '%';
					}
					if (this.allowHalf) {
						width = '50%';
					}
					return {
						color: this.activeColor,
						width: width
					};
				},
				valueDecimal: function() {
					return this.value * 100 - Math.floor(this.value) * 100;
				},
				decimalIconClass: function() {
					return this.getValueFromMap(this.value, this.classMap);
				},
				voidClass: function() {
					return this.disabled ? this.classMap.disabledVoidClass : this.classMap.voidClass;
				},
				activeClass: function() {
					return this.getValueFromMap(this.currentValue, this.classMap);
				},
				activeColor: function() {
					return this.getValueFromMap(this.currentValue, this.colorMap);
				},
				classes: function() {
					var result = [];
					var i = 0;
					var threshold = this.currentValue;
					if (this.allowHalf && this.currentValue !== Math.floor(this.currentValue)) {
						threshold--;
					}
					for (; i < threshold; i++) {
						result.push(this.activeClass);
					}
					for (; i < this.max; i++) {
						result.push(this.voidClass);
					}
					return result;
				}
			},
			watch: {
				value: function(val) {
					this.$emit('change', val);
					this.currentValue = val;
				}
			},
			methods: {
				getValueFromMap: function(value, map) {
					var result = '';
					if (value <= this.lowThreshold) {
						result = map.lowColor || map.lowClass;
					} else if (value >= this.highThreshold) {
						result = map.highColor || map.highClass;
					} else {
						result = map.mediumColor || map.mediumClass;
					}
					return result;
				},
				showDecimalIcon: function(item) {
					var showWhenDisabled = this.disabled && this.valueDecimal > 0 && item - 1 < this.value && item > this.value;
					var showWhenAllowHalf = this.allowHalf && this.pointerAtLeftHalf && ((item - 0.5).toFixed(1) === this.currentValue.toFixed(1));
					return showWhenDisabled || showWhenAllowHalf;
				},
				getIconStyle: function(item) {
					var voidColor = this.disabled ? this.colorMap.disabledVoidColor : this.colorMap.voidColor;
					return {
						color: item <= this.currentValue ? this.activeColor : voidColor
					};
				},
				selectValue: function(value) {
					if (this.disabled) {
						return;
					}
					if (this.allowHalf && this.pointerAtLeftHalf) {
						this.$emit('input', this.currentValue);
					} else {
						this.$emit('input', value);
					}
				},
				setCurrentValue: function(value, event) {
					if (this.disabled) {
						return;
					}
					if (this.allowHalf) {
						var target = event.target;
						if (VueUtil.hasClass(target, 'vue-rate__item')) {
							target = target.querySelector('.vue-rate__icon');
						}
						if (VueUtil.hasClass(target, 'vue-rate__decimal')) {
							target = target.parentNode;
						}
						this.pointerAtLeftHalf = event.offsetX * 2 <= target.clientWidth;
						this.currentValue = this.pointerAtLeftHalf ? value - 0.5 : value;
					} else {
						this.currentValue = value;
					}
					this.hoverIndex = value;
				},
				resetCurrentValue: function() {
					if (this.disabled) {
						return;
					}
					if (this.allowHalf) {
						this.pointerAtLeftHalf = this.value !== Math.floor(this.value);
					}
					this.currentValue = this.value;
					this.hoverIndex = -1;
				}
			},
			created: function() {
				if (!this.value) {
					this.$emit('input', 0);
				}
				this.classMap = {
					lowClass: this.iconClasses[0],
					mediumClass: this.iconClasses[1],
					highClass: this.iconClasses[2],
					voidClass: this.voidIconClass,
					disabledVoidClass: this.disabledVoidIconClass
				};
				this.colorMap = {
					lowColor: this.colors[0],
					mediumColor: this.colors[1],
					highColor: this.colors[2],
					voidColor: this.voidColor,
					disabledVoidColor: this.disabledVoidColor
				};
			}
	};
	Vue.component(VueRate.name, VueRate);
});
