!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VuePopper'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VuePopper']);
		delete context[name];
	}
})('VuePopover', this, function(Vue, VueUtil, VuePopper) {
	'use strict';
	var VuePopover = {
		template: '<span><transition :name="transition" @after-leave="doDestroy"><div class="vue-popover" :class="[popperClass, {\'no-arrow\': !visibleArrow}]" ref="popper" v-show="!disabled && showPopper" :style="{ width: popoverWidth + \'px\' }"><div class="vue-popover__title" v-if="title" v-text="title"></div><slot>{{ content }}</slot></div></transition><slot name="reference"></slot></span>',
		name: 'VuePopover',
		mixins: [VuePopper],
		props: {
			openDelay: {
				type: Number,
				default: 0
			},
			trigger: {
				type: String,
				default: 'click',
				validator: function(value) {
					return ['click', 'focus', 'hover', 'manual'].indexOf(value) > -1
				}
			},
			title: String,
			disabled: Boolean,
			content: String,
			reference: {},
			popperClass: String,
			width: [String, Number],
			visibleArrow: {
				default: true
			},
			transition: {
				type: String,
				default: 'fade-in-linear'
			}
		},
		data: function() {
			return {
				popoverWidth: null
			}
		},
		watch: {
			showPopper: function(newVal, oldVal) {
				if (newVal) {
					this.popoverWidth = this.width;
					if (!this.popoverWidth) {
						var reference = this.reference || this.$refs.reference;
						this.popoverWidth = parseInt(VueUtil.getStyle(reference, 'width'));
					}
					this.$emit('show');
				} else {
					this.$emit('hide');
				}
			}
		},
		mounted: function() {
			var self = this;
			var reference = self.reference || self.$refs.reference;
			var popper = self.popper || self.$refs.popper;
			if (!reference && self.$slots.reference && self.$slots.reference[0]) {
				reference = self.referenceElm = self.$slots.reference[0].elm;
			}
			if (self.trigger === 'click') {
				VueUtil.on(reference, 'click', self.doToggle);
				VueUtil.on(document, 'click', self.handleDocumentClick);
			} else if (self.trigger === 'hover') {
				VueUtil.on(reference, 'mouseenter', self.handleMouseEnter);
				VueUtil.on(popper, 'mouseenter', self.handleMouseEnter);
				VueUtil.on(reference, 'mouseleave', self.handleMouseLeave);
				VueUtil.on(popper, 'mouseleave', self.handleMouseLeave);
			} else if (self.trigger === 'focus') {
				var found = false;
				if ([].slice.call(reference.children).length) {
					var children = reference.childNodes;
					var len = children.length;
					for (var i = 0; i < len; i++) {
						if (children[i].nodeName === 'INPUT' || children[i].nodeName === 'TEXTAREA') {
							VueUtil.on(children[i], 'focus', self.doShow);
							VueUtil.on(children[i], 'blur', self.doClose);
							found = true;
							break;
						}
					}
				}
				if (found)
					return;
				if (reference.nodeName === 'INPUT' || reference.nodeName === 'TEXTAREA') {
					VueUtil.on(reference, 'focus', self.doShow);
					VueUtil.on(reference, 'blur', self.doClose);
				} else {
					VueUtil.on(reference, 'mousedown', self.doShow);
					VueUtil.on(reference, 'mouseup', self.doClose);
				}
			}
		},
		methods: {
			doToggle: function() {
				this.showPopper = !this.showPopper;
			},
			doShow: function() {
				this.showPopper = true;
			},
			doClose: function() {
				this.showPopper = false;
			},
			handleMouseEnter: function() {
				var self = this;
				self._timer = setTimeout(function() {
					self.showPopper = true;
					clearTimeout(self._timer);
				}, self.openDelay);
			},
			handleMouseLeave: function() {
				this.showPopper = false;
			},
			handleDocumentClick: function(e) {
				var reference = this.reference || this.$refs.reference;
				var popper = this.popper || this.$refs.popper;
				if (!reference && this.$slots.reference && this.$slots.reference[0]) {
					reference = this.referenceElm = this.$slots.reference[0].elm;
				}
				if (!this.$el || !reference || this.$el.contains(e.target) || reference.contains(e.target) || !popper || popper.contains(e.target))
					return;
				this.showPopper = false;
			}
		},
		destroyed: function() {
			var reference = this.reference;
			VueUtil.off(reference, 'click', this.doToggle);
			VueUtil.off(reference, 'mouseup', this.doClose);
			VueUtil.off(reference, 'mousedown', this.doShow);
			VueUtil.off(reference, 'focus', this.doShow);
			VueUtil.off(reference, 'blur', this.doClose);
			VueUtil.off(reference, 'mouseleave', this.handleMouseLeave);
			VueUtil.off(reference, 'mouseenter', this.handleMouseEnter);
			VueUtil.off(document, 'click', this.handleDocumentClick);
		}
	};
	var directive = function(el, binding, vnode) {
		vnode.context.$refs[binding.arg].$refs.reference = el;
	};
	Vue.directive('popover', directive);
	VuePopover.directive = directive;
	Vue.component(VuePopover.name, VuePopover);
});
