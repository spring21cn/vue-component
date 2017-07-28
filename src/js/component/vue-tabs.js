!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueTabs', this, function(Vue) {
	'use strict';
	var VueTabBar = {
		template: '<div class="vue-tabs__active-bar" :style="barStyle"></div>',
		props: {
			tabs: Array
		},
		computed: {
			barStyle: {
				cache: false,
				get: function() {
					var self = this;
					if (!self.$parent.$refs.tabs)
						return {};
					var style = {};
					var offset = 0;
					var tabWidth = 0;
					self.tabs.every(function(tab, index) {
						var $el = self.$parent.$refs.tabs[index];
						if (!$el) {
							return false;
						}
						if (!tab.active) {
							offset += $el.clientWidth;
							return true;
						} else {
							tabWidth = $el.clientWidth;
							return false;
						}
					});
					var transform = 'translateX(' + offset + 'px)';
					style.width = tabWidth + 'px';
					style.transform = transform;
					style.msTransform = transform;
					style.webkitTransform = transform;
					return style;
				}
			}
		}
	};
	var VueTabs = {
		name: 'VueTabs',
		components: {
			TabBar: VueTabBar
		},
		props: {
			type: String,
			activeName: String,
			closable: {
				type: Boolean,
				default: false
			},
			value: {}
		},
		data: function() {
			return {
				children: null,
				currentName: this.value || this.activeName,
				panes: []
			};
		},
		watch: {
			activeName: function(value) {
				this.setCurrentName(value);
			},
			value: function(value) {
				this.setCurrentName(value);
			}
		},
		computed: {
			currentTab: function() {
				var self = this;
				var result;
				self.panes.forEach(function(tab) {
					if (self.currentName === (tab.name || tab.index)) {
						result = tab;
					}
				});
				return result;
			}
		},
		methods: {
			handleTabRemove: function(pane, event) {
				var self = this;
				event.stopPropagation();
				var panes = self.panes;
				var currentTab = self.currentTab;
				var index = panes.indexOf(pane);
				if (index === -1)
					return;
				panes.splice(index, 1);
				pane.$destroy();
				self.$emit('tab-remove', pane);
				self.$nextTick(function() {
					if (pane.active) {
						var panes = self.panes;
						var nextChild = panes[index];
						var prevChild = panes[index - 1];
						var nextActiveTab = nextChild || prevChild || null;
						if (nextActiveTab) {
							self.setCurrentName(nextActiveTab.name || nextActiveTab.index);
						}
						return;
					} else {
						self.setCurrentName(currentTab.name || currentTab.index);
					}
				});
			},
			handleTabClick: function(tab, tabName, event) {
				if (tab.disabled)
					return;
				this.setCurrentName(tabName);
				this.$emit('tab-click', tab, event);
			},
			setCurrentName: function(value) {
				this.currentName = value;
				this.$emit('input', value);
			},
			addPanes: function(item) {
				this.panes.push(item);
			},
			removePanes: function(item) {
				var panes = this.panes;
				var index = panes.indexOf(item);
				if (index > -1) {
					panes.splice(index, 1);
				}
			}
		},
		render: function(createElement) {
			var self = this;
			var type = self.type
			 , handleTabRemove = self.handleTabRemove
			 , handleTabClick = self.handleTabClick
			 , currentName = self.currentName
			 , panes = self.panes;
			var tabs = self._l(panes, function(pane, index) {
				var tabName = pane.name || pane.index || index;
				if (currentName === undefined && index === 0) {
					self.setCurrentName(tabName);
				}
				pane.index = index;
				var btnClose = pane.isClosable ? createElement('span', {
					class: 'vue-icon-close',
					on: {
						click: function(ev) {
							handleTabRemove(pane, ev);
						}
					}
				}, []) : null;
				var tabLabelContent = pane.$slots.label || pane.label;
				return createElement('div', {
					class: {
						'vue-tabs__item': true,
						'is-active': pane.active,
						'is-disabled': pane.disabled,
						'is-closable': pane.isClosable
					},
					ref: 'tabs',
					refInFor: true,
					on: {
						click: function(ev) {
							handleTabClick(pane, tabName, ev);
						}
					}
				}, [tabLabelContent, btnClose]);
			});
			return createElement('div', {
				class: {
					'vue-tabs': true,
					'vue-tabs--card': type === 'card',
					'vue-tabs--border-card': type === 'border-card'
				}
			}, [createElement('div', {
				class: 'vue-tabs__header'
			}, [type ? null : createElement('tab-bar', {
				attrs: {
					tabs: panes
				}
			}, []), tabs]), createElement('div', {
				class: 'vue-tabs__content'
			}, [this.$slots.default])]);
		}
	};
	Vue.component(VueTabs.name, VueTabs);
});
