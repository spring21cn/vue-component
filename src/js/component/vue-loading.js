!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueLoading', this, function(Vue, VueUtil) {
	'use strict';
	var VueLoading = Vue.extend({
		template: '<transition name="vue-loading-fade" @after-leave="handleAfterLeave"><div v-show="visible" class="vue-loading-mask" :class="[customClass, { \'is-fullscreen\': fullscreen }]"><div class="vue-loading-spinner"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none"/></svg><p v-if="text" class="vue-loading-text">{{ text }}</p></div></div></transition>',
		data: function() {
			return {
				text: null,
				fullscreen: true,
				visible: false,
				customClass: ''
			};
		},
		methods: {
			handleAfterLeave: function() {
				this.$emit('after-leave');
			}
		}
	});
	var directive = function(Vue) {
		if (Vue.prototype.$isServer) return;
		var insertDom = function(parent, el, binding) {
			if (!el.domVisible) {
				Object.keys(el.maskStyle).forEach(function(property) {
					el.mask.style[property] = el.maskStyle[property];
				});
				if (el.originalPosition !== 'absolute') {
					parent.style.position = 'relative';
				}
				if (binding.modifiers.fullscreen && binding.modifiers.lock) {
					parent.style.overflow = 'hidden';
				}
				el.domVisible = true;
				parent.appendChild(el.mask);
				Vue.nextTick(function() {
					el.instance.visible = true;
				});
				el.domInserted = true;
			}
		};
		var toggleLoading = function(el, binding) {
			if (binding.value) {
				Vue.nextTick(function() {
					if (binding.modifiers.fullscreen) {
						el.originalPosition = document.body.style.position;
						el.originalOverflow = document.body.style.overflow;
						VueUtil.addClass(el.mask, 'is-fullscreen');
						insertDom(document.body, el, binding);
					} else {
						VueUtil.removeClass(el.mask, 'is-fullscreen');
						if (binding.modifiers.body) {
							el.originalPosition = document.body.style.position;
							['top', 'left'].forEach(function(property) {
								var scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
								el.maskStyle[property] = el.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] + 'px';
							});
							['height', 'width'].forEach(function(property) {
								el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px';
							});
							insertDom(document.body, el, binding);
						} else {
							el.originalPosition = el.style.position;
							insertDom(el, el, binding);
						}
					}
				});
			} else {
				if (el.domVisible) {
					el.instance.$on('after-leave', function() {
						el.domVisible = false;
						if (binding.modifiers.fullscreen && el.originalOverflow !== 'hidden') {
							document.body.style.overflow = el.originalOverflow;
						}
						if (binding.modifiers.fullscreen || binding.modifiers.body) {
							document.body.style.position = el.originalPosition;
						} else {
							el.style.position = el.originalPosition;
						}
					});
					el.instance.visible = false;
				}
			}
		};
		Vue.directive('loading', {
			bind: function(el, binding) {
				var mask = new VueLoading({
					el: document.createElement('div'),
					data: {
						text: el.getAttribute('vue-loading-text'),
						fullscreen: !!binding.modifiers.fullscreen
					}
				});
				el.instance = mask;
				el.mask = mask.$el;
				el.maskStyle = {};
				toggleLoading(el, binding);
			},
			update: function(el, binding) {
				if (binding.oldValue !== binding.value) {
					toggleLoading(el, binding);
				}
			},
			unbind: function(el, binding) {
				if (el.domInserted) {
					if (binding.modifiers.fullscreen || binding.modifiers.body) {
						document.body.removeChild(el.mask);
					} else {
						el.mask && el.mask.parentNode && el.mask.parentNode.removeChild(el.mask);
					}
				}
			}
		});
	};
	var defaults = {
		text: null,
		fullscreen: true,
		body: false,
		lock: false,
		customClass: ''
	};
	var fullscreenLoading;
	VueLoading.prototype.originalPosition = '';
	VueLoading.prototype.originalOverflow = '';
	VueLoading.prototype.close = function() {
		if (this.fullscreen && this.originalOverflow !== 'hidden') {
			document.body.style.overflow = this.originalOverflow;
		}
		if (this.fullscreen || this.body) {
			document.body.style.position = this.originalPosition;
		} else {
			this.target.style.position = this.originalPosition;
		}
		if (this.fullscreen) {
			fullscreenLoading = undefined;
		}
		this.$on('after-leave', function() {
			this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el);
			this.$destroy();
		});
		this.visible = false;
	}
	var addStyle = function(options, parent, instance) {
		var maskStyle = {};
		if (options.fullscreen) {
			instance.originalPosition = document.body.style.position;
			instance.originalOverflow = document.body.style.overflow;
		} else if (options.body) {
			instance.originalPosition = document.body.style.position;
			['top', 'left'].forEach(function(property) {
				var scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
				maskStyle[property] = options.target.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] + 'px';
			});
			['height', 'width'].forEach(function(property) {
				maskStyle[property] = options.target.getBoundingClientRect()[property] + 'px';
			});
		} else {
			instance.originalPosition = parent.style.position;
		}
		Object.keys(maskStyle).forEach(function(property) {
			instance.$el.style[property] = maskStyle[property];
		});
	};
	var service = function() {
		var options = {};
		if (Vue.prototype.$isServer)
			return;
		options = VueUtil.merge({}, defaults, options);
		if (typeof options.target === 'string') {
			options.target = document.querySelector(options.target);
		}
		options.target = options.target || document.body;
		if (options.target !== document.body) {
			options.fullscreen = false;
		} else {
			options.body = true;
		}
		if (options.fullscreen && fullscreenLoading) {
			return fullscreenLoading;
		}
		var parent = options.body ? document.body : options.target;
		var instance = new VueLoading({
			el: document.createElement('div'),
			data: options
		});
		addStyle(options, parent, instance);
		if (instance.originalPosition !== 'absolute') {
			parent.style.position = 'relative';
		}
		if (options.fullscreen && options.lock) {
			parent.style.overflow = 'hidden';
		}
		parent.appendChild(instance.$el);
		Vue.nextTick(function() {
			instance.visible = true;
		});
		if (options.fullscreen) {
			fullscreenLoading = instance;
		}
		return instance;
	};
	Vue.use(directive);
	Vue.prototype.$loading = service;
});
