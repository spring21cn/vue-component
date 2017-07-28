!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueCollapse', this, function(Vue) {
	'use strict';
	var VueCollapse = {
		template: '<div class="vue-collapse"><slot></slot></div>',
		name: 'VueCollapse',
		componentName: 'VueCollapse',
		props: {
			accordion: Boolean,
			value: {
				type: [Array, String, Number],
				default: function() {
					return [];
				}
			}
		},
		data: function() {
			return {
				activeNames: [].concat(this.value)
			};
		},
		watch: {
			value: function(value) {
				this.activeNames = [].concat(value);
			}
		},
		methods: {
			setActiveNames: function(activeNames) {
				activeNames = [].concat(activeNames);
				var value = this.accordion ? activeNames[0] : activeNames;
				this.activeNames = activeNames;
				this.$emit('input', value);
				this.$emit('change', value);
			},
			handleItemClick: function(item) {
				if (this.accordion) {
					this.setActiveNames(
						this.activeNames[0] &&
						this.activeNames[0] === item.name
						? '' : item.name
					);
				} else {
					var activeNames = this.activeNames.slice(0);
					var index = activeNames.indexOf(item.name);
					if (index > -1) {
						activeNames.splice(index, 1);
					} else {
						activeNames.push(item.name);
					}
					this.setActiveNames(activeNames);
				}
			}
		},
		created: function() {
			this.$on('item-click', this.handleItemClick);
		}
	};
	Vue.component(VueCollapse.name, VueCollapse);
});
