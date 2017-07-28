!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueBreadcrumb', this, function(Vue) {
	'use strict';
	var VueBreadcrumb = {
		template: '<div class="vue-breadcrumb"><slot></slot></div>',
		name: 'VueBreadcrumb',
		props: {
			separator: {
				type: String,
				default: '/'
			}
		}
	};
	Vue.component(VueBreadcrumb.name, VueBreadcrumb);
});
