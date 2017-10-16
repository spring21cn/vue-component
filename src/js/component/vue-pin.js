!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VuePin', this, function(Vue, VueUtil) {
	'use strict';
	var root = window;
	var getScroll = function(target, top) {
		var prop = top ? 'pageYOffset' : 'pageXOffset';
		var method = top ? 'scrollTop' : 'scrollLeft';
		var ret = target[prop];
		if (typeof ret !== 'number') {
			ret = root.document.documentElement[method];
		}
		return ret;
	};
	var getOffset = function(element) {
		var rect = element.getBoundingClientRect();
		var scrollTop = getScroll(root, true);
		var scrollLeft = getScroll(root);
		var docEl = root.document.body;
		var clientTop = docEl.clientTop || 0;
		var clientLeft = docEl.clientLeft || 0;
		return {
			top: rect.top + scrollTop - clientTop,
			left: rect.left + scrollLeft - clientLeft
		};
	};
	var getStyleComputedProperty = function(element, property) {
		var css = root.getComputedStyle(element, null);
		return css[property];
	};
	var getScrollParent = function(element) {
		var parent = element.parentNode;
		if (!parent) {
			return element;
		}
		if (parent === root.document) {
			if (root.document.body.scrollTop) {
				return root.document.body;
			} else {
				return root.document.documentElement;
			}
		}
		if (['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow')) !== -1 || ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-x')) !== -1 || ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-y')) !== -1) {
			return parent;
		}
		return getScrollParent(element.parentNode);
	};
	var VuePin = {
		template: '<div><div :style="styles"><slot></slot></div></div>',
		name: 'VuePin',
		props: {
			offsetTop: {
				type: Number,
				default: 0
			},
			offsetBottom: {
				type: Number
			},
			fixed: Boolean
		},
		data: function() {
			return {
				pin: false,
				scrollParent: null,
				styles: {}
			};
		},
		computed: {
			offsetType: function() {
				var type = 'top';
				if (this.offsetBottom >= 0) {
					type = 'bottom';
				}
				return type;
			}
		},
		mounted: function() {
			var self = this;
			self.$nextTick(function(){
				if (self.fixed) {
					self.pin = true;
					var elOffset = getOffset(self.$el);
					if (self.offsetType == 'bottom') {
						self.styles = {
							bottom: self.offsetBottom + 'px',
							left: elOffset.left + 'px',
							width: self.$el.offsetWidth + 'px',
							position: 'fixed',
							zIndex: VueUtil.component.popupManager.nextZIndex()
						};
					} else {
						self.styles = {
							top: self.offsetTop + 'px',
							left: elOffset.left + 'px',
							width: self.$el.offsetWidth + 'px',
							position: 'fixed',
							zIndex: VueUtil.component.popupManager.nextZIndex()
						};
					}
				} else {
					self.scrollParent = getScrollParent(self.$el);
					VueUtil.on(self.scrollParent,'scroll', self.handleScroll);
					VueUtil.addResizeListener(self.$el, self.handleScroll);
				}
			});
		},
		beforeDestroy: function() {
			if (!this.fixed) {
				VueUtil.off(this.scrollParent, 'scroll', this.handleScroll);
				VueUtil.removeResizeListener(this.$el, this.handleScroll);
			}
		},
		methods: {
			handleScroll: function() {
				var pin = this.pin;
				var scrollTop = getScroll(root, true);
				var elOffset = getOffset(this.$el);
				var windowHeight = root.innerHeight;
				var elHeight = this.$el.getElementsByTagName('div')[0].offsetHeight;
				if ((elOffset.top - this.offsetTop) < scrollTop && this.offsetType == 'top' && !pin) {
					this.pin = true;
					this.styles = {
						top: this.offsetTop + 'px',
						left: elOffset.left + 'px',
						width: this.$el.offsetWidth + 'px',
						position: 'fixed',
						zIndex: VueUtil.component.popupManager.nextZIndex()
					};
					this.$emit('change', true);
				} else if ((elOffset.top - this.offsetTop) > scrollTop && this.offsetType == 'top' && pin) {
					this.pin = false;
					this.styles = null;
					this.$emit('change', false);
				}
				if ((elOffset.top + this.offsetBottom + elHeight) > (scrollTop + windowHeight) && this.offsetType == 'bottom' && !pin) {
					this.pin = true;
					this.styles = {
						bottom: this.offsetBottom + 'px',
						left: elOffset.left + 'px',
						width: this.$el.offsetWidth + 'px',
						position: 'fixed',
						zIndex: VueUtil.component.popupManager.nextZIndex()
					};
					this.$emit('change', true);
				} else if ((elOffset.top + this.offsetBottom + elHeight) < (scrollTop + windowHeight) && this.offsetType == 'bottom' && pin) {
					this.pin = false;
					this.styles = null;
					this.$emit('change', false);
				}
			}
		}
	}
	Vue.component(VuePin.name, VuePin);
});
