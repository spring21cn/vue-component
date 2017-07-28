!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueCollapseItem', this, function(Vue, VueUtil) {
	'use strict';
	var VueCollapseItem = {
		template: '<div class="vue-collapse-item" :class="{\'is-active\': isActive}"><div class="vue-collapse-item__header" @click="handleHeaderClick"><i class="vue-collapse-item__header__arrow vue-icon-arrow-right"></i><slot name="title">{{title}}</slot></div><collapse-transition><div class="vue-collapse-item__wrap" v-show="isActive"><div class="vue-collapse-item__content"><slot></slot></div></div></collapse-transition></div>',
		name: 'VueCollapseItem',
		componentName: 'VueCollapseItem',
		mixins: [VueUtil.component.emitter],
		components: {
			CollapseTransition: VueUtil.component.collapseTransition
		},
		data: function() {
			return {
				contentWrapStyle: {
					height: 'auto',
					display: 'block'
				},
				contentHeight: 0
			};
		},
		props: {
			title: String,
			name: {
				type: [String, Number],
				default: function() {
					return this._uid;
				}
			}
		},
		computed: {
			isActive: function() {
				return this.$parent.activeNames.indexOf(this.name) > -1;
			}
		},
		watch: {
			'isActive': function(value) {
			}
		},
		methods: {
			handleHeaderClick: function() {
				this.dispatch('VueCollapse', 'item-click', this);
			}
		},
		mounted: function() {
		}
	};
	Vue.component(VueCollapseItem.name, VueCollapseItem);
});
