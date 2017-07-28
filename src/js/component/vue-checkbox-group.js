!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
	}
})('VueCheckboxGroup', this, function(Vue, VueUtil) {
	'use strict';
	var VueCheckboxGroup = {
		template: '<div class="vue-checkbox-group"><slot></slot></div>',
		name: 'VueCheckboxGroup',
		componentName: 'VueCheckboxGroup',
		mixins: [VueUtil.component.emitter],
		props: {
			value: {},
			min: Number,
			max: Number,
			size: String,
			fill: String,
			textColor: String,
			disabled: Boolean
		},
		watch: {
			value: function(value) {
				this.dispatch('VueFormItem', 'vue.form.change', [value]);
			}
		}
	};
	Vue.component(VueCheckboxGroup.name, VueCheckboxGroup);
	return function() {
		return VueCheckboxGroup;
	}
});
