!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueMenuItemGroup', this, function(Vue, VueUtil) {
	'use strict';
	var VueMenuItemGroup = {
		template: '<li class="vue-menu-item-group"><div class="vue-menu-item-group__title" :style="{paddingLeft: levelPadding + \'px\'}" v-if="showTitle"><template v-if="!$slots.title">{{title}}</template><slot v-else name="title"></slot></div><ul><slot></slot></ul></li>',
		name: 'VueMenuItemGroup',
		componentName: 'VueMenuItemGroup',
		props: {
			title: {
				type: String,
				default: ''
			}
		},
		data: function() {
			return {
				paddingLeft: 20
			};
		},
		computed: {
			showTitle: function() {
				if (VueUtil.trim(this.title) === "" && !this.$slots.title) {
					return false;
				}
				return true;
			},
			levelPadding: function() {
				var padding = 10;
				var parent = this.$parent;
				while (parent && parent.$options.componentName !== 'VueMenu') {
					if (parent.$options.componentName === 'VueSubmenu') {
						padding += 20;
					}
					parent = parent.$parent;
				}
				padding === 10 && (padding = 20);
				return padding;
			}
		}
	};
	Vue.component(VueMenuItemGroup.name, VueMenuItemGroup);
});
