!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueBreadcrumbItem', this, function(Vue) {
	'use strict';
	var VueBreadcrumbItem = {
		template: '<span class="vue-breadcrumb__item"><span class="vue-breadcrumb__item__inner" ref="link"><slot></slot></span><span class="vue-breadcrumb__separator">{{separator}}</span></span>',
		name: 'VueBreadcrumbItem',
		props: {
			to: {},
			replace: Boolean
		},
		data: function() {
			return {
				separator: ''
			};
		},
		mounted: function() {
			this.separator = this.$parent.separator;
			var self = this;
			var link = self.$refs.link;
			if (self.to) {
				link.addEventListener('click', function() {
					var to = self.to;
					if (self.$router) {
						self.replace ? self.$router.replace(to) : self.$router.push(to);
					}
				});
			} else {
				link.addEventListener('click', function() {
					self.$emit('click');
				});
			}
		}
	};
	Vue.component(VueBreadcrumbItem.name, VueBreadcrumbItem);
});
