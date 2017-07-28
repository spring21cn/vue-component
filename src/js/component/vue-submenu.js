!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueSubmenu', this, function(Vue, VueUtil) {
	'use strict';
	var VueSubMenu = {
		template: '<li :class="{ \'vue-submenu\': true, \'is-active\': active, \'is-opened\': opened }" ><div class="vue-submenu__title" ref="submenu-title" :style="paddingStyle"><slot name="title"></slot><i :class="{ \'vue-submenu__icon-arrow\': true, \'vue-icon-arrow-down\': rootMenu.mode === \'vertical\', \'vue-icon-caret-bottom\': rootMenu.mode === \'horizontal\' }"></i></div><template v-if="rootMenu.mode === \'horizontal\'"><transition name="vue-zoom-in-top"><ul class="vue-menu" v-show="opened"><slot></slot></ul></transition></template><collapse-transition v-else><ul class="vue-menu" v-show="opened"><slot></slot></ul></collapse-transition></li>',
		name: 'VueSubmenu',
		componentName: 'VueSubmenu',
		mixins: [VueUtil.component.menumixin, VueUtil.component.emitter],
		components: {
			CollapseTransition: VueUtil.component.collapseTransition
		},
		props: {
			index: {
				type: String,
				required: true
			}
		},
		data: function() {
			return {
				timeout: null,
				items: {},
				submenus: {}
			};
		},
		computed: {
			opened: function() {
				return ( this.rootMenu.openedMenus.indexOf(this.index) > -1) ;
			},
			active: {
				cache: false,
				get: function() {
					var isActive = false;
					var submenus = this.submenus;
					var items = this.items;
					Object.keys(items).forEach(function(index) {
						if (items[index].active) {
							isActive = true;
						}
					});
					Object.keys(submenus).forEach(function(index) {
						if (submenus[index].active) {
							isActive = true;
						}
					});
					return isActive;
				}
			}
		},
		methods: {
			addItem: function(item) {
				this.$set(this.items, item.index, item);
			},
			removeItem: function(item) {
				delete this.items[item.index];
			},
			addSubmenu: function(item) {
				this.$set(this.submenus, item.index, item);
			},
			removeSubmenu: function(item) {
				delete this.submenus[item.index];
			},
			handleClick: function() {
				this.dispatch('VueMenu', 'submenu-click', this);
			},
			handleMouseenter: function() {
				var self = this;
				clearTimeout(self.timeout);
				self.timeout = setTimeout(function() {
					self.rootMenu.openMenu(self.index, self.indexPath);
				}, 300);
			},
			handleMouseleave: function() {
				var self = this;
				clearTimeout(self.timeout);
				self.timeout = setTimeout(function() {
					self.rootMenu.closeMenu(self.index, self.indexPath);
				}, 300);
			},
			initEvents: function() {
				var triggerElm;
				if (this.rootMenu.mode === 'horizontal' && this.rootMenu.menuTrigger === 'hover') {
					triggerElm = this.$el;
					triggerElm.addEventListener('mouseenter', this.handleMouseenter);
					triggerElm.addEventListener('mouseleave', this.handleMouseleave);
				} else {
					triggerElm = this.$refs['submenu-title'];
					triggerElm.addEventListener('click', this.handleClick);
				}
			}
		},
		created: function() {
			this.parentMenu.addSubmenu(this);
			this.rootMenu.addSubmenu(this);
		},
		beforeDestroy: function() {
			this.parentMenu.removeSubmenu(this);
			this.rootMenu.removeSubmenu(this);
		},
		mounted: function() {
			this.initEvents();
		}
	};
	Vue.component(VueSubMenu.name, VueSubMenu);
});
