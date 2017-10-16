!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueSwitch', this, function(Vue) {
	'use strict';
	var VueSwitch = {
		template: '<label class="vue-switch" :class="{ \'is-disabled\': disabled, \'vue-switch--wide\': hasText }"><div class="vue-switch__mask" v-show="disabled"></div><input class="vue-switch__input" type="checkbox" @change="handleChange" v-model="_value" :name="name" :disabled="disabled"><span class="vue-switch__core" ref="core" :style="{ \'width\': coreWidth + \'px\' }"><span class="vue-switch__button" :style="buttonStyle"></span></span><transition name="label-fade"><div class="vue-switch__label vue-switch__label--left" v-show="value" :style="{ \'width\': coreWidth + \'px\' }"><i :class="[onIconClass]" v-if="onIconClass"></i><span v-if="!onIconClass && onText">{{ onText }}</span></div></transition><transition name="label-fade"><div class="vue-switch__label vue-switch__label--right" v-show="!value" :style="{ \'width\': coreWidth + \'px\' }"><i :class="[offIconClass]" v-if="offIconClass"></i><span v-if="!offIconClass && offText">{{ offText }}</span></div></transition></label>',
		name: 'VueSwitch',
		props: {
			value: {
				type: Boolean,
				default: true
			},
			disabled: {
				type: Boolean,
				default: false
			},
			width: {
				type: Number,
				default: 0
			},
			onIconClass: {
				type: String,
				default: ''
			},
			offIconClass: {
				type: String,
				default: ''
			},
			onText: {
				type: String,
				default: 'ON'
			},
			offText: {
				type: String,
				default: 'OFF'
			},
			onColor: {
				type: String,
				default: ''
			},
			offColor: {
				type: String,
				default: ''
			},
			name: {
				type: String,
				default: ''
			}
		},
		data: function() {
			return {
				coreWidth: this.width,
				buttonStyle: {
					transform: ''
				}
			};
		},
		computed: {
			hasText: function() {
				return this.onText || this.offText;
			},
			_value: {
				get: function() {
					return this.value;
				},
				set: function(val) {
					this.$emit('input', val);
				}
			}
		},
		watch: {
			value: function() {
				if (this.onColor || this.offColor) {
					this.setBackgroundColor();
				}
				this.handleButtonTransform();
			}
		},
		methods: {
			handleChange: function(event) {
				this.$emit('change', event.currentTarget.checked);
			},
			handleButtonTransform: function() {
				this.buttonStyle.transform = this.value ? 'translate(' + (this.coreWidth - 20) + 'px, 2px)' : 'translate(2px, 2px)';
			},
			setBackgroundColor: function() {
				var newColor = this.value ? this.onColor : this.offColor;
				this.$refs.core.style.borderColor = newColor;
				this.$refs.core.style.backgroundColor = newColor;
			}
		},
		mounted: function() {
			if (this.width === 0) {
				this.coreWidth = this.hasText ? 58 : 46;
			}
			this.handleButtonTransform();
			if (this.onColor || this.offColor) {
				this.setBackgroundColor();
			}
		}
	};
	Vue.component(VueSwitch.name, VueSwitch);
});
