!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueOptionGroup', this, function(Vue, VueUtil) {
	'use strict';
	var VueOptionGroup = {
		template: '<ul class="vue-select-group__wrap"><li class="vue-select-group__title" v-show="visible">{{ label }}</li><li><ul class="vue-select-group"><slot></slot></ul></li></ul>',
		name: 'VueOptionGroup',
		componentName: 'VueOptionGroup',
		mixins: [VueUtil.component.emitter],
		props: {
			label: String,
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data: function() {
			return {
				visible: true
			};
		},
		watch: {
			disabled: function(val) {
				this.broadcast('VueOption', 'handleGroupDisabled', val);
			}
		},
		methods: {
			queryChange: function() {
				this.visible = this.$children && Array.isArray(this.$children) && this.$children.some(function(option) {
					return option.visible === true;
				});
			}
		},
		created: function() {
			this.$on('queryChange', this.queryChange);
		},
		mounted: function() {
			if (this.disabled) {
				this.broadcast('VueOption', 'handleGroupDisabled', this.disabled);
			}
		}
	};
	Vue.component(VueOptionGroup.name, VueOptionGroup);
});
