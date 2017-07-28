!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueListItem', this, function(Vue, VueUtil) {
	'use strict';
	var VueListItem = {
		template: '<div class="vue-list-item" :class="{ \'is-active\': isActive }" @click="handleClick"><slot></slot></div>',
		name: 'VueListItem',
		mixins: [VueUtil.component.emitter],
		data: function(){
			return {
				isActive: false
			}
		},
		methods: {
			handleClick: function() {
				this.dispatch('VueList', 'item-click', this);
				this.$emit('select');
			}
		}
	};
	Vue.component(VueListItem.name, VueListItem);
});
