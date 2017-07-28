!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VueValidator'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VueValidator']);
		delete context[name];
	}
})('VueFormItem', this, function(Vue, VueUtil, VueValidator) {
	'use strict';
	var noop = function() {}
	var getPropByPath = function(obj, path) {
		var tempObj = obj;
		path = path.replace(/\[(\w+)\]/g, '.$1');
		path = path.replace(/^\./, '');
		var keyArr = path.split('.');
		var i = 0;
		for (var len = keyArr.length; i < len - 1; ++i) {
			var key = keyArr[i];
			if (key in tempObj) {
				tempObj = tempObj[key];
			} else {
				throw new Error('please transfer a valid prop path to form item!');
			}
		}
		return {
			o: tempObj,
			k: keyArr[i],
			v: tempObj[keyArr[i]]
		};
	}
	var VueFormItem = {
		template: '<div class="vue-form-item" :class="{\'is-error\': validateState === \'error\',\'is-validating\': validateState === \'validating\',\'is-required\': isRequired || required}"><label :for="prop" class="vue-form-item__label" v-bind:style="labelStyle" v-if="label">{{label + form.labelSuffix}}</label><div class="vue-form-item__content" v-bind:style="contentStyle"><slot></slot><transition name="vue-zoom-in-top"><div class="vue-form-item__error" v-if="validateState === \'error\' && showMessage && form.showMessage">{{validateMessage}}</div></transition></div></div>',
		name: 'VueFormItem',
		componentName: 'VueFormItem',
		mixins: [VueUtil.component.emitter],
		props: {
			label: String,
			labelWidth: String,
			prop: String,
			required: Boolean,
			rules: [Object, Array],
			error: String,
			validateStatus: String,
			showMessage: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			error: function(value) {
				this.validateMessage = value;
				this.validateState = 'error';
			},
			validateStatus: function(value) {
				this.validateState = value;
			}
		},
		computed: {
			labelStyle: function() {
				var ret = {};
				if (this.form.labelPosition === 'top')
					return ret;
				var labelWidth = this.labelWidth || this.form.labelWidth;
				if (labelWidth) {
					ret.width = labelWidth;
				}
				return ret;
			},
			contentStyle: function() {
				var ret = {};
				if (this.form.labelPosition === 'top')
					return ret;
				var labelWidth = this.labelWidth || this.form.labelWidth;
				if (labelWidth) {
					ret.marginLeft = labelWidth;
				}
				return ret;
			},
			form: function() {
				var parent = this.$parent;
				while (parent.$options.componentName !== 'VueForm') {
					parent = parent.$parent;
				}
				return parent;
			},
			fieldValue: {
				cache: false,
				get: function() {
					var model = this.form.model;
					if (!model || !this.prop) {
						return;
					}
					var path = this.prop;
					if (path.indexOf(':') !== -1) {
						path = path.replace(/:/, '.');
					}
					return getPropByPath(model, path).v;
				}
			}
		},
		data: function() {
			return {
				validateState: '',
				validateMessage: '',
				validateDisabled: false,
				validator: {},
				isRequired: false
			};
		},
		methods: {
			validate: function(trigger, callback) {
				var self = this;
				callback = callback || noop;
				var rules = self.getFilteredRule(trigger);
				if (!rules || rules.length === 0) {
					callback();
					return true;
				}
				self.validateState = 'validating';
				var descriptor = {};
				descriptor[self.prop] = rules;
				var validator = new VueValidator(descriptor);
				var model = {};
				model[self.prop] = self.fieldValue;
				validator.validate(model, {
					firstFields: true
				}, function(errors, fields) {
					self.validateState = !errors ? 'success' : 'error';
					self.validateMessage = errors ? errors[0].message : '';
					callback(self.validateMessage);
				});
			},
			resetField: function() {
				this.validateState = '';
				this.validateMessage = '';
				var model = this.form.model;
				var value = this.fieldValue;
				var path = this.prop;
				if (path.indexOf(':') !== -1) {
					path = path.replace(/:/, '.');
				}
				var prop = getPropByPath(model, path);
				if (Array.isArray(value) && value.length > 0) {
					this.validateDisabled = true;
					prop.o[prop.k] = [];
				} else if (value) {
					this.validateDisabled = true;
					prop.o[prop.k] = this.initialValue;
				}
			},
			getRules: function() {
				var formRules = this.form.rules;
				var selfRuels = this.rules;
				formRules = formRules ? formRules[this.prop] : [];
				return [].concat(selfRuels || formRules || []);
			},
			getFilteredRule: function(trigger) {
				var rules = this.getRules();
				return rules.filter(function(rule) {
					return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
				});
			},
			onFieldBlur: function() {
				this.validate('blur');
			},
			onFieldChange: function() {
				if (this.validateDisabled) {
					this.validateDisabled = false;
					return;
				}
				this.validate('change');
			}
		},
		mounted: function() {
			var self = this;
			if (self.prop) {
				self.dispatch('VueForm', 'vue.form.addField', [self]);
				Object.defineProperty(self, 'initialValue', {
					value: self.fieldValue
				});
				var rules = self.getRules();
				if (rules.length) {
					rules.every(function(rule) {
						if (rule.required) {
							self.isRequired = true;
							return false;
						}
					});
					self.$on('vue.form.blur', self.onFieldBlur);
					self.$on('vue.form.change', self.onFieldChange);
				}
			}
		},
		beforeDestroy: function() {
			this.dispatch('VueForm', 'vue.form.removeField', [this]);
		}
	};
	Vue.component(VueFormItem.name, VueFormItem);
});
