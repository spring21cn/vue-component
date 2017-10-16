!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueTabPane', this, function(Vue, VueUtil) {
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
			VueUtil.removeNode(this.$el);
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
