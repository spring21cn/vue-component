!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueForm', this, function(Vue) {
	'use strict';
	var VueForm = {
		template: '<form class="vue-form" :class="[ labelPosition ? \'vue-form--label-\' + labelPosition : \'\', { \'vue-form--inline\': inline } ]"><slot></slot></form>',
		name: 'VueForm',
		componentName: 'VueForm',
		props: {
			model: Object,
			rules: Object,
			labelPosition: String,
			labelWidth: String,
			labelSuffix: {
				type: String,
				default: ''
			},
			inline: Boolean,
			showMessage: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			rules: function() {
				this.validate();
			}
		},
		data: function() {
			return {
				fields: []
			};
		},
		created: function() {
			this.$on('vue.form.addField', function(field) {
				if (field) {
					this.fields.push(field);
				}
			});
			this.$on('vue.form.removeField', function(field) {
				if (field.prop) {
					this.fields.splice(this.fields.indexOf(field), 1);
				}
			});
		},
		methods: {
			resetFields: function() {
				this.fields.forEach(function(field) {
					field.resetField();
				});
			},
			validate: function(callback) {
				var self = this;
				var valid = true;
				var count = 0;
				this.fields.forEach(function(field, index) {
					field.validate('', function(errors) {
						if (errors) {
							valid = false;
						}
						if (typeof callback === 'function' && ++count === self.fields.length) {
							callback(valid);
						}
					});
				});
			},
			validateField: function(prop, cb) {
				var field = this.fields.filter(function(field) {
					return ( field.prop === prop)
				})[0];
				if (!field) {
					throw new Error('must call validateField with valid prop string!');
				}
				field.validate('', cb);
			}
		}
	};
	Vue.component(VueForm.name, VueForm);
});
