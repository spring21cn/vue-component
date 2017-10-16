!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueTabs', this, function(Vue, VueUtil) {
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
	var VueTabNav = {
		components: {
			TabBar: VueTabBar
		},
		props: {
			panes: Array,
			currentName: String,
			editable: Boolean,
			onTabClick: {
				type: Function,
				default: function() {}
			},
			onTabRemove: {
				type: Function,
				default: function() {}
			},
			type: String
		},
		data: function() {
			return {
				scrollable: false,
				navStyle: {
					transform: ''
				}
			};
		},
		methods: {
			scrollPrev: function() {
				var containerWidth = this.$refs.navScroll.offsetWidth;
				var currentOffset = this.getCurrentScrollOffset();
				if (!currentOffset)
					return;
				var newOffset = currentOffset > containerWidth ? currentOffset - containerWidth : 0;
				this.setOffset(newOffset);
			},
			scrollNext: function() {
				var navWidth = this.$refs.nav.offsetWidth;
				var containerWidth = this.$refs.navScroll.offsetWidth;
				var currentOffset = this.getCurrentScrollOffset();
				if (navWidth - currentOffset <= containerWidth)
					return;
				var newOffset = navWidth - currentOffset > containerWidth * 2 ? currentOffset + containerWidth : (navWidth - containerWidth);
				this.setOffset(newOffset);
			},
			scrollToActiveTab: function() {
				if (!this.scrollable)
					return;
				var nav = this.$refs.nav;
				var activeTab = this.$el.querySelector('.is-active');
				var navScroll = this.$refs.navScroll;
				var activeTabBounding = activeTab.getBoundingClientRect();
				var navScrollBounding = navScroll.getBoundingClientRect();
				var navBounding = nav.getBoundingClientRect();
				var currentOffset = this.getCurrentScrollOffset();
				var newOffset = currentOffset;
				if (activeTabBounding.left < navScrollBounding.left) {
					newOffset = currentOffset - (navScrollBounding.left - activeTabBounding.left);
				}
				if (activeTabBounding.right > navScrollBounding.right) {
					newOffset = currentOffset + activeTabBounding.right - navScrollBounding.right;
				}
				if (navBounding.right < navScrollBounding.right) {
					newOffset = nav.offsetWidth - navScrollBounding.width;
				}
				this.setOffset(Math.max(newOffset, 0));
			},
			getCurrentScrollOffset: function() {
				var navStyle = this.navStyle;
				return navStyle.transform ? Number(navStyle.transform.match(/translateX\(-(\d+(\.\d+)*)px\)/)[1]) : 0;
			},
			setOffset: function(value) {
				this.navStyle.transform = 'translateX(-' + value + 'px)';
			},
			update: function() {
				if (this.$refs.nav && this.$refs.navScroll) {
					var navWidth = this.$refs.nav.offsetWidth;
					var containerWidth = this.$refs.navScroll.offsetWidth;
					var currentOffset = this.getCurrentScrollOffset();
					if (containerWidth < navWidth) {
						this.scrollable = this.scrollable || {};
						this.scrollable.prev = currentOffset;
						this.scrollable.next = currentOffset + containerWidth < navWidth;
						if (navWidth - currentOffset < containerWidth) {
							this.setOffset(navWidth - containerWidth);
						}
					} else {
						this.scrollable = false;
						if (currentOffset > 0) {
							this.setOffset(0);
						}
					}
				}
			}
		},
		updated: function() {
			this.update();
		},
		render: function(createElement) {
			var type = this.type;
			var panes = this.panes;
			var editable = this.editable;
			var onTabClick = this.onTabClick;
			var onTabRemove = this.onTabRemove;
			var navStyle = this.navStyle;
			var scrollable = this.scrollable;
			var scrollNext = this.scrollNext;
			var scrollPrev = this.scrollPrev;
			var scrollBtn = scrollable ? [createElement('span', {
				'class': ['vue-tabs__nav-prev', scrollable.prev ? '' : 'is-disabled'],
				on: {
					'click': scrollPrev
				}
			}, [createElement('i', {
				'class': 'vue-icon-arrow-left'
			}, [])]), createElement('span', {
				'class': ['vue-tabs__nav-next', scrollable.next ? '' : 'is-disabled'],
				on: {
					'click': scrollNext
				}
			}, [createElement('i', {
				'class': 'vue-icon-arrow-right'
			}, [])])] : null;
			var tabs = this._l(panes, function(pane, index) {
				var tabName = pane.name || pane.index || index;
				var closable = pane.isClosable || editable;
				pane.index = '' + index;
				var btnClose = closable ? createElement('span', {'class': 'vue-icon-close',on: {'click': function click(ev) {onTabRemove(pane, ev);}}}, []) : null;
				var tabLabelContent = pane.$slots.label || pane.label;
				return createElement('div', {
					'class': {
						'vue-tabs__item': true,
						'is-active': pane.active,
						'is-disabled': pane.disabled,
						'is-closable': closable
					},
					ref: 'tabs',
					refInFor: true,
					on: {
						'click': function click(ev) {
							onTabClick(pane, tabName, ev);
						}
					}
				}, [tabLabelContent, btnClose]);
			});
			return createElement('div', {
					'class': ['vue-tabs__nav-wrap', scrollable ? 'is-scrollable' : '']
				}, [scrollBtn, createElement('div', {
					'class': ['vue-tabs__nav-scroll'],
					ref: 'navScroll'
				}, [createElement('div', {
					'class': 'vue-tabs__nav',
					ref: 'nav',
					style: navStyle
				}, [!type ? createElement('tab-bar', {
					attrs: {
						tabs: panes
					}
				}, []) : null, tabs])])]);
		},
		mounted: function() {
			VueUtil.addResizeListener(this.$el, this.update);
		},
		beforeDestroy: function() {
			if (this.$el && this.update)
				VueUtil.removeResizeListener(this.$el, this.update);
		}
	};
	var VueTabs = {
		name: 'VueTabs',
		components: {
			TabNav: VueTabNav
		},
		props: {
			type: String,
			closable: Boolean,
			addable: Boolean,
			value: {},
			editable: Boolean,
			tabBottom: Boolean
		},
		data: function() {
			return {
				currentName: this.value,
				panes: []
			};
		},
		watch: {
			value: function(value) {
				this.setCurrentName(value);
			},
			currentName: function(value) {
				var self = this;
				if (self.$refs.nav) {
					self.$nextTick(function() {
						self.$refs.nav.scrollToActiveTab();
					});
				}
			}
		},
		methods: {
			handleTabClick: function(tab, tabName, event) {
				if (tab.disabled)
					return;
				this.setCurrentName(tabName);
				this.$emit('tab-click', tab, event);
			},
			handleTabRemove: function(pane, ev) {
				if (pane.disabled)
					return;
				ev.stopPropagation();
				this.$emit('edit', pane.name, 'remove');
				this.$emit('tab-remove', pane.name);
			},
			handleTabAdd: function() {
				this.$emit('edit', null, 'add');
				this.$emit('tab-add');
			},
			setCurrentName: function(value) {
				this.currentName = value;
				this.$emit('input', value);
			},
			addPanes: function(item) {
				var index = this.$slots.default.indexOf(item.$vnode);
				this.panes.splice(index, 0, item);
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
			var type = this.type;
			var handleTabClick = this.handleTabClick;
			var handleTabRemove = this.handleTabRemove;
			var handleTabAdd = this.handleTabAdd;
			var currentName = this.currentName;
			var panes = this.panes;
			var editable = this.editable;
			var addable = this.addable;
			var tabBottom = this.tabBottom;
			var newButton = editable || addable ? createElement('span', {
				'class': 'vue-tabs__new-tab',
				on: {
					'click': handleTabAdd
				}
			}, [createElement('i', {
				'class': 'vue-icon-plus'
			}, [])]) : null;
			var navData = {
				props: {
					currentName: currentName,
					onTabClick: handleTabClick,
					onTabRemove: handleTabRemove,
					editable: editable,
					type: type,
					panes: panes
				},
				ref: 'nav'
			};
			var header = createElement('div', {
				'class': 'vue-tabs__header'
			}, [newButton, createElement('tab-nav', navData, [])]);
			var panels = createElement('div', {
				'class': 'vue-tabs__content'
			}, [this.$slots.default])
			return createElement('div', {
				'class': {
					'vue-tabs': true,
					'vue-tabs--card': type === 'card',
					'vue-tabs--border-card': type === 'border-card',
					'header-bottom': tabBottom
				}
			}, [tabBottom ? [panels, header] : [header, panels]]);
		},
		created: function() {
			if (!this.currentName) {
				this.setCurrentName('0');
			}
		}
	};
	Vue.component(VueTabs.name, VueTabs);
});
