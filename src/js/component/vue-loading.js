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
					Vue.nextTick(function() {
						if (binding.modifiers.fullscreen) {
							el.instance.$el.tabIndex = -1;
							el.instance.$el.focus();
						}
					});
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
		var doKeyDown = function(e) {
			document.querySelector('.vue-loading-mask.is-fullscreen').focus();
			e.preventDefault();
			return false;
		}
		var attachEvent = function(binding) {
			if (binding.modifiers.fullscreen) {
				if (binding.value) {
					VueUtil.on(document.body, 'keydown', doKeyDown);
				} else {
					VueUtil.off(document.body, 'keydown', doKeyDown);
				}
			}
		};
		Vue.directive('loading', {
			bind: function(el, binding) {
				var mask = new VueLoading({
					el: document.createElement('div'),
					data: {
						text: el.getAttribute('vue-loading-text'),
						fullscreen: !!binding.modifiers.fullscreen,
						customClass: el.getAttribute('vue-loading-class'),
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
					attachEvent(binding);
				}
			},
			unbind: function(el, binding) {
				if (el.domInserted) {
					if (binding.modifiers.fullscreen || binding.modifiers.body) {
						document.body.removeChild(el.mask);
					} else {
						VueUtil.removeNode(el.mask);
					}
				}
			}
		});
	};
	Vue.use(directive);
});
