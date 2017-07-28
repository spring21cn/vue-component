!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
	}
})('VuePopup', this, function(Vue, VueUtil) {
	'use strict';
	var instances = {};
	var PopupManager = {
		zIndex: 2000,
		getInstance: function(id) {
			return instances[id];
		},
		register: function(id, instance) {
			if (id && instance) {
				instances[id] = instance;
			}
		},
		deregister: function(id) {
			if (id) {
				instances[id] = null;
				delete instances[id];
			}
		},
		nextZIndex: function() {
			return PopupManager.zIndex++;
		},
		modalStack: [],
		doOnModalClick: function() {
			var topItem = this.modalStack[this.modalStack.length - 1];
			if (!topItem)
				return;
			var instance = this.getInstance(topItem.id);
			if (instance && instance.closeOnClickModal) {
				instance.close();
			}
		},
		openModal: function(id, zIndex, dom, modalClass) {
			if (Vue.prototype.$isServer)
				return;
			if (!id || zIndex === undefined)
				return;
			var modalStack = this.modalStack;
			for (var i = 0, j = modalStack.length; i < j; i++) {
				var item = modalStack[i];
				if (item.id === id) {
					return;
				}
			}
			this.modalStack.push({
				id: id,
				zIndex: zIndex,
				modalClass: modalClass
			});
		},
		closeModal: function(id) {
			var modalStack = this.modalStack;
			if (modalStack.length > 0) {
				var topItem = modalStack[modalStack.length - 1];
				if (topItem.id === id) {
					modalStack.pop();
				} else {
					for (var i = modalStack.length - 1; i >= 0; i--) {
						if (modalStack[i].id === id) {
							modalStack.splice(i, 1);
							break;
						}
					}
				}
			}
		}
	};
	!Vue.prototype.$isServer && window.addEventListener('keydown', function(event) {
		if (event.keyCode === 27) {
			if (PopupManager.modalStack.length > 0) {
				var topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1];
				if (!topItem)
					return;
				var instance = PopupManager.getInstance(topItem.id);
				if (instance.closeOnPressEscape) {
					instance.close();
				}
			}
		}
	});
	var idSeed = 1;
	var transitions = [];
	var hookTransition = function(transition) {
		if (transitions.indexOf(transition) !== -1)
			return;
		var getVueInstance = function(element) {
			var instance = element.__vue__;
			if (!instance) {
				var textNode = element.previousSibling;
				if (textNode.__vue__) {
					instance = textNode.__vue__;
				}
			}
			return instance;
		};
		Vue.transition(transition, {
			afterEnter: function(el) {
				var instance = getVueInstance(el);
				if (instance) {
					instance.doAfterOpen && instance.doAfterOpen();
				}
			},
			afterLeave: function(el) {
				var instance = getVueInstance(el);
				if (instance) {
					instance.doAfterClose && instance.doAfterClose();
				}
			}
		});
	};
	var scrollBarWidth;
	var getDOM = function(dom) {
		if (dom.nodeType === 3) {
			dom = dom.nextElementSibling || dom.nextSibling;
			getDOM(dom);
		}
		return dom;
	};
	var VuePopup = {};
	VuePopup.model = {
		prop: 'visible',
		event: 'visible-change'
	};
	VuePopup.props = {
		visible: {
			type: Boolean,
			default: false
		},
		transition: {
			type: String,
			default: ''
		},
		openDelay: {},
		closeDelay: {},
		zIndex: {},
		modal: {
			type: Boolean,
			default: true
		},
		modalClass: {},
		modalAppendToBody: {
			type: Boolean,
			default: false
		},
		lockScroll: {
			type: Boolean,
			default: true
		},
		closeOnPressEscape: {
			type: Boolean,
			default: true
		},
		closeOnClickModal: {
			type: Boolean,
			default: false
		}
	};
	VuePopup.created = function() {
		if (this.transition) {
			hookTransition(this.transition);
		}
	}
	VuePopup.beforeMount = function() {
		this._popupId = 'popup-' + idSeed++;
		PopupManager.register(this._popupId, this);
	}
	VuePopup.beforeDestroy = function() {
		PopupManager.deregister(this._popupId);
		PopupManager.closeModal(this._popupId);
		if (this.modal && this.bodyOverflow !== null && this.bodyOverflow !== 'hidden') {
			document.body.style.overflow = this.bodyOverflow;
			document.body.style.paddingRight = this.bodyPaddingRight;
		}
		this.bodyOverflow = null;
		this.bodyPaddingRight = null;
	}
	VuePopup.data = function() {
		return {
			opened: false,
			bodyOverflow: null,
			bodyPaddingRight: null,
			rendered: false
		};
	}
	VuePopup.watch = {
		visible: function(val) {
			if (val) {
				if (this._opening)
					return;
				if (!this.rendered) {
					var self = this;
					this.rendered = true;
					Vue.nextTick(function() {
						self.open();
					});
				} else {
					this.open();
				}
			} else {
				this.close();
			}
		}
	};
	VuePopup.methods = {
		open: function(options) {
			var self = this;
			if (!self.rendered) {
				self.rendered = true;
				self.$emit('visible-change', true);
			}
			var props = VueUtil.merge({}, self, options);
			if (self._closeTimer) {
				clearTimeout(self._closeTimer);
				self._closeTimer = null;
			}
			clearTimeout(self._openTimer);
			var openDelay = Number(props.openDelay);
			if (openDelay > 0) {
				self._openTimer = setTimeout(function() {
					self._openTimer = null;
					self.doOpen(props);
				}, openDelay);
			} else {
				self.doOpen(props);
			}
		},
		doOpen: function(props) {
			if (this.$isServer)
				return;
			if (this.willOpen && !this.willOpen())
				return;
			if (this.opened)
				return;
			this._opening = true;
			this.$emit('visible-change', true);
			var dom = getDOM(this.$el);
			var modal = props.modal;
			var zIndex = props.zIndex;
			if (zIndex) {
				PopupManager.zIndex = zIndex;
			}
			if (modal) {
				if (this._closing) {
					PopupManager.closeModal(this._popupId);
					this._closing = false;
				}
				PopupManager.openModal(this._popupId, PopupManager.nextZIndex(), dom, props.modalClass);
				if (props.lockScroll) {
					if (!this.bodyOverflow) {
						this.bodyPaddingRight = document.body.style.paddingRight;
						this.bodyOverflow = document.body.style.overflow;
					}
					scrollBarWidth = VueUtil.component.scrollBarWidth();
					var bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
					if (scrollBarWidth > 0 && bodyHasOverflow) {
						document.body.style.paddingRight = scrollBarWidth + 'px';
					}
					document.body.style.overflow = 'hidden';
				}
			}
			if (getComputedStyle(dom).position === 'static') {
				dom.style.position = 'absolute';
			}
			dom.style.zIndex = PopupManager.nextZIndex();
			this.opened = true;
			this.onOpen && this.onOpen();
			if (!this.transition) {
				this.doAfterOpen();
			}
		},
		doAfterOpen: function() {
			this._opening = false;
		},
		close: function() {
			var self = this;
			if (self.willClose && !self.willClose())
				return;
			if (self._openTimer !== null) {
				clearTimeout(self._openTimer);
				self._openTimer = null;
			}
			clearTimeout(self._closeTimer);
			var closeDelay = Number(self.closeDelay);
			if (closeDelay > 0) {
				self._closeTimer = setTimeout(function() {
					self._closeTimer = null;
					self.doClose();
				}, closeDelay);
			} else {
				self.doClose();
			}
		},
		doClose: function() {
			var self = this;
			self.$emit('visible-change', false);
			self._closing = true;
			self.onClose && self.onClose();
			if (self.lockScroll) {
				setTimeout(function() {
					if (self.modal && self.bodyOverflow !== 'hidden') {
						document.body.style.overflow = self.bodyOverflow;
						document.body.style.paddingRight = self.bodyPaddingRight;
					}
					self.bodyOverflow = null;
					self.bodyPaddingRight = null;
				}, 200);
			}
			self.opened = false;
			if (!self.transition) {
				self.doAfterClose();
			}
		},
		doAfterClose: function() {
			PopupManager.closeModal(this._popupId);
			this._closing = false;
		}
	};
	return function() {
		return {
			VuePopup: VuePopup,
			PopupManager: PopupManager
		};
	}
});
