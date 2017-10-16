!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePopper'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePopper']);
		delete context[name];
	}
})('VueDropdownMenu', this, function(Vue, VuePopper) {
	'use strict';
	var VueDropdownMenu = {
		template: '<transition name="vue-zoom-in-top" @after-leave="doDestroy"><div class="vue-dropdown-menu" v-show="showPopper"><ul class="vue-dropdown-menu__view"><slot></slot></ul></div></transition>',
		name: 'VueDropdownMenu',
		componentName: 'VueDropdownMenu',
		mixins: [VuePopper],
		created: function() {
			var self = this;
			self.$on('updatePopper', self.updatePopper);
			self.$on('visible', function(val) {
				self.showPopper = val;
			});
		},
		mounted: function() {
			this.$parent.popperElm = this.popperElm = this.$el;
			this.referenceElm = this.$parent.$el;
		},
		watch: {
			'$parent.menuAlign': {
				immediate: true,
				handler: function(val) {
					this.currentPlacement = 'bottom-' + val;
				}
			}
		}
	};
	Vue.component(VueDropdownMenu.name, VueDropdownMenu);
});
