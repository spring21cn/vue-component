!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'Cleave'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['Cleave']);
	}
})('VueInput', this, function(Vue, VueUtil, Cleave) {
	'use strict';
	var calculateNodeStylingFn = function(node) {
		var CONTEXT_STYLE = ['letter-spacing', 'line-height', 'padding-top', 'padding-bottom', 'font-family', 'font-weight', 'font-size', 'text-rendering', 'text-transform', 'width', 'text-indent', 'padding-left', 'padding-right', 'border-width', 'box-sizing'];
		var style = window.getComputedStyle(node);
		var boxSizing = style.getPropertyValue('box-sizing');
		var paddingSize = (parseFloat(style.getPropertyValue('padding-bottom')) + parseFloat(style.getPropertyValue('padding-top')));
		var borderSize = (parseFloat(style.getPropertyValue('border-bottom-width')) + parseFloat(style.getPropertyValue('border-top-width')));
		var contextStyle = CONTEXT_STYLE.map(function(name) {
			return name + ':' + style.getPropertyValue(name)
		}).join(';');
		var calculateNodeStylingObj = {};
		calculateNodeStylingObj.contextStyle = contextStyle;
		calculateNodeStylingObj.paddingSize = paddingSize;
		calculateNodeStylingObj.borderSize = borderSize;
		calculateNodeStylingObj.boxSizing = boxSizing;
		return calculateNodeStylingObj;
	};
	var calcTextareaHeight = function(targetNode, minRows, maxRows, options) {
		var HIDDEN_STYLE = '\n height:0 !important;\n visibility:hidden !important;\n overflow:hidden !important;\n position:absolute !important;\n z-index:-1000 !important;\n top:0 !important;\n right:0 !important\n';
		var hiddenTextarea = document.createElement('textarea');
		document.body.appendChild(hiddenTextarea);
		var calculateNodeStyling = calculateNodeStylingFn(targetNode);
		hiddenTextarea.setAttribute('style', calculateNodeStyling.contextStyle + ';' + HIDDEN_STYLE);
		hiddenTextarea.value = targetNode.value || targetNode.placeholder || '';
		var height = hiddenTextarea.scrollHeight;
		if (calculateNodeStyling.boxSizing === 'border-box') {
			height = height + calculateNodeStyling.borderSize;
		} else if (calculateNodeStyling.boxSizing === 'content-box') {
			height = height - calculateNodeStyling.paddingSize;
		}
		hiddenTextarea.value = '';
		var singleRowHeight = hiddenTextarea.scrollHeight - calculateNodeStyling.paddingSize;
		if (minRows !== null) {
			var minHeight = singleRowHeight * minRows;
			if (calculateNodeStyling.boxSizing === 'border-box') {
				minHeight = minHeight + calculateNodeStyling.paddingSize + calculateNodeStyling.borderSize;
			}
			height = Math.max(minHeight, height);
		}
		if (maxRows !== null) {
			var maxHeight = singleRowHeight * maxRows;
			if (calculateNodeStyling.boxSizing === 'border-box') {
				maxHeight = maxHeight + calculateNodeStyling.paddingSize + calculateNodeStyling.borderSize;
			}
			height = Math.min(maxHeight, height);
		}
		document.body.removeChild(hiddenTextarea);
		return VueUtil.merge({height: height + 'px'}, options);
	};
	var VueInput = {
		template: '<div :class="[ type === \'textarea\' ? \'vue-textarea\' : \'vue-input\', size ? \'vue-input--\' + size : \'\', { \'is-disabled\': disabled, \'vue-input-group\': $slots.prepend || $slots.append, \'vue-input-group--append\': $slots.append, \'vue-input-group--prepend\': $slots.prepend, \'is-readonly\': readonly } ]"><template v-if="type !== \'textarea\'"><div class="vue-input-group__prepend" v-if="$slots.prepend"><slot name="prepend"></slot></div><slot name="icon"><i class="vue-input__icon" :class="[ icon, onIconClick ? \'is-clickable\' : \'\' ]" v-if="icon" @click="handleIconClick"></i></slot><input v-if="type !== \'textarea\'" class="vue-input__inner" :type="type" :name="name" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :maxlength="maxlength" :minlength="minlength" :autocomplete="autoComplete" :autofocus="autofocus" :min="min" :max="max" :form="form" :value="currentValue" ref="input" @input="handleInput" @focus="handleFocus" @blur="handleBlur" ><i class="vue-input__icon vue-icon-loading" v-if="validating"></i><div class="vue-input-group__append" v-if="$slots.append"><slot name="append"></slot></div></template><textarea v-else class="vue-textarea__inner" :value="currentValue" @input="handleInput" ref="textarea" :name="name" :placeholder="placeholder" :disabled="disabled" :style="textareaStyle" :readonly="readonly" :rows="rows" :form="form" :autofocus="autofocus" :maxlength="maxlength" :minlength="minlength" @focus="handleFocus" @blur="handleBlur"></textarea></div>',
		name: 'VueInput',
		componentName: 'VueInput',
		mixins: [VueUtil.component.emitter],
		data: function() {
			return {
				currentValue: this.value,
				textareaStyle: {}
			};
		},
		props: {
			value: [String, Number],
			placeholder: String,
			size: String,
			resize: String,
			readonly: Boolean,
			autofocus: Boolean,
			icon: String,
			disabled: Boolean,
			type: {
				type: String,
				default: 'text'
			},
			name: String,
			autosize: {
				type: [Boolean, Object],
				default: false
			},
			rows: {
				type: Number,
				default: 2
			},
			autoComplete: {
				type: String,
				default: 'off'
			},
			form: String,
			maxlength: Number,
			minlength: Number,
			max: {},
			min: {},
			cleave: {
				type: Object,
				default: function(){return null}
			},
			validateEvent: {
				type: Boolean,
				default: true
			},
			onIconClick: Function
		},
		computed: {
			validating: function() {
				return this.$parent.validateState === 'validating';
			}
		},
		watch: {
			'value': function(val, oldValue) {
				this.setCurrentValue(val, true);
			}
		},
		methods: {
			handleBlur: function(event) {
				this.$emit('blur', event);
				if (this.validateEvent) {
					this.dispatch('VueFormItem', 'vue.form.blur', [this.currentValue]);
				}
			},
			inputSelect: function() {
				this.$refs.input.select();
			},
			resizeTextarea: function() {
				if (this.$isServer)
					return;
				if (!this.autosize || this.type !== 'textarea')
					return;
				var minRows = this.autosize.minRows;
				var maxRows = this.autosize.maxRows;
				var options = {
					resize: this.resize
				};
				this.textareaStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows, options);
			},
			handleFocus: function(event) {
				this.$emit('focus', event);
			},
			handleInput: function(event) {
				this.setCurrentValue(event.target.value);
			},
			handleIconClick: function(event) {
				if (this.onIconClick) {
					this.onIconClick(event);
				}
				this.$emit('click', event);
			},
			setCurrentValue: function(value, watchFlg) {
				if (typeof value === "undefined") value = "";
				var self = this;
				if (value === self.currentValue && !watchFlg)
					return;
				self.$nextTick(function() {
					self.resizeTextarea();
				});
				if (self.type !== 'textarea' && self.cleave !== null) {
					self.$el.querySelector('input').value = value;
					var cleaveObj = new Cleave(self.$el.querySelector('input'), self.cleave);
					self.currentValue = cleaveObj.getFormattedValue();
					if (cleaveObj.getFormattedValue().length >= value.length && !watchFlg) {
						self.currentValue = value;
					}
					value = cleaveObj.getRawValue()
					cleaveObj.destroy && cleaveObj.destroy();
				} else {
					self.currentValue = value;
				}
				self.$emit('input', value);
				self.$emit('change', value);
				if (self.validateEvent) {
					self.dispatch('VueFormItem', 'vue.form.change', [value]);
				}
			}
		},
		created: function() {
			this.$on('inputSelect', this.inputSelect);
		},
		mounted: function() {
			this.setCurrentValue(this.currentValue, true);
			this.resizeTextarea();
		}
	};
	Vue.component(VueInput.name, VueInput);
	return function() {
		return VueInput;
	}
});
