!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VueButton', 'VueButtonGroup'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VueButton'], context['VueButtonGroup']);
		delete context[name];
	}
})('VueDropdown', this, function(Vue, VueUtil, VueButton, VueButtonGroup) {
	'use strict';
	var VueDropdown = {
		template: '',
		name: 'VueDropdown',
		componentName: 'VueDropdown',
		mixins: [VueUtil.component.emitter],
		directives: {
			Clickoutside: VueUtil.component.clickoutside()
		},
		components: {
			VueButton: VueButton(),
			VueButtonGroup: VueButtonGroup()
		},
		props: {
			trigger: {
				type: String,
				default: 'hover'
			},
			menuAlign: {
				type: String,
				default: 'end'
			},
			type: String,
			size: String,
			splitButton: Boolean,
			hideOnClick: {
				type: Boolean,
				default: true
			}
		},
		data: function() {
			return {
				timeout: null,
				visible: false
			};
		},
		mounted: function() {
			this.$on('menu-item-click', this.handleMenuItemClick);
			this.initEvent();
		},
		watch: {
			visible: function(val) {
				this.broadcast('VueDropdownMenu', 'visible', val);
			}
		},
		methods: {
			show: function() {
				var self = this;
				clearTimeout(self.timeout);
				self.timeout = setTimeout(function() {
					self.visible = true;
				}, 250);
			},
			hide: function() {
				var self = this;
				clearTimeout(self.timeout);
				self.timeout = setTimeout(function() {
					self.visible = false;
				}, 150);
			},
			handleClick: function() {
				this.visible = !this.visible;
			},
			initEvent: function() {
				var trigger = this.trigger
				 , show = this.show
				 , hide = this.hide
				 , handleClick = this.handleClick
				 , splitButton = this.splitButton;
				var triggerElm = splitButton ? this.$refs.trigger.$el : this.$slots.default[0].elm;
				if (trigger === 'hover') {
					triggerElm.addEventListener('mouseenter', show);
					triggerElm.addEventListener('mouseleave', hide);
					var dropdownElm = this.$slots.dropdown[0].elm;
					dropdownElm.addEventListener('mouseenter', show);
					dropdownElm.addEventListener('mouseleave', hide);
				} else if (trigger === 'click') {
					triggerElm.addEventListener('click', handleClick);
				}
			},
			handleMenuItemClick: function(command, instance) {
				if (this.hideOnClick) {
					this.visible = false;
				}
				this.$emit('command', command, instance);
			}
		},
		render: function(createElement) {
			var self = this;
			var hide = self.hide
			 , splitButton = self.splitButton
			 , type = self.type
			 , size = self.size;
			var handleClick = function() {
				self.$emit('click');
			};
			var triggerElm = !splitButton ? self.$slots.default : createElement('vue-button-group', null, [createElement('vue-button', {
				attrs: {
					type: type,
					size: size
				},
				nativeOn: {
					click: handleClick
				}
			}, [self.$slots.default]), createElement('vue-button', {
				ref: 'trigger',
				attrs: {
					type: type,
					size: size
				},
				class: 'vue-dropdown__caret-button'
			}, [createElement('i', {
				class: 'vue-dropdown__icon vue-icon-caret-bottom'
			}, [])])]);
			return createElement('div', {
				class: 'vue-dropdown',
				directives: [{
					name: 'clickoutside',
					value: hide
				}]
			}, [triggerElm, self.$slots.dropdown]);
		}
	};
	Vue.component(VueDropdown.name, VueDropdown);
});
