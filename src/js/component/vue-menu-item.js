!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueMenuItem', this, function(Vue, VueUtil) {
	'use strict';
	var VueMenuItem = {
		template: '<li class="vue-menu-item" :style="paddingStyle" @click="handleClick" :class="{ \'is-active\': active, \'is-disabled\': disabled }"><slot></slot></li>',
		name: 'VueMenuItem',
		componentName: 'VueMenuItem',
		mixins: [VueUtil.component.menumixin, VueUtil.component.emitter],
		props: {
			index: {
				type: String,
				required: true
			},
			route: {
				type: Object,
				required: false
			},
			disabled: {
				type: Boolean,
				required: false
			}
		},
		computed: {
			active: function() {
				return this.index === this.rootMenu.activedIndex;
			}
		},
		methods: {
			handleClick: function() {
				this.dispatch('VueMenu', 'item-click', this);
			}
		},
		created: function() {
			this.parentMenu.addItem(this);
			this.rootMenu.addItem(this);
		},
		beforeDestroy: function() {
			this.parentMenu.removeItem(this);
			this.rootMenu.removeItem(this);
		}
	};
	Vue.component(VueMenuItem.name, VueMenuItem);
});
