!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueTabPane', this, function(Vue) {
	'use strict';
	var VueTabPane = {
		template: '<div class="vue-tab-pane" v-show="active"><slot></slot></div>',
		name: 'VueTabPane',
		componentName: 'VueTabPane',
		props: {
			label: String,
			labelContent: Function,
			name: String,
			closable: Boolean,
			disabled: Boolean
		},
		data: function() {
			return {
				index: null
			};
		},
		computed: {
			isClosable: function() {
				return this.closable || this.$parent.closable;
			},
			active: function() {
				return this.$parent.currentName === (this.name || this.index);
			}
		},
		mounted: function() {
			this.$parent.addPanes(this);
		},
		destroyed: function() {
			if (this.$el && this.$el.parentNode) {
				this.$el.parentNode.removeChild(this.$el);
			}
			this.$parent.removePanes(this);
		},
		watch: {
			label: function() {
				this.$parent.$forceUpdate();
			}
		}
	};
	Vue.component(VueTabPane.name, VueTabPane);
});
