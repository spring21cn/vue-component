!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueButtonGroup', this, function(Vue) {
	'use strict';
	var VueButtonGroup = {
		template: '<div class="vue-button-group"><slot></slot></div>',
		name: 'VueButtonGroup'
	};
	Vue.component(VueButtonGroup.name, VueButtonGroup);
});
