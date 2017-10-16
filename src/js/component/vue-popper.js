!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'Popper', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['Popper'], context['VueUtil']);
	}
})('VuePopper', this, function(Vue, Popper, VueUtil) {
	'use strict';
	var PopperJS = Vue.prototype.$isServer ? function() {} : Popper;
	var stop = function(e) {
		e.stopPropagation()
	};
	var VuePopper = {
		props: {
			placement: {
				type: String,
				default: 'bottom'
			},
			boundariesPadding: {
				type: Number,
				default: 5
			},
			reference: {},
			popper: {},
			offset: {
				default: 0
			},
			value: Boolean,
			visibleArrow: Boolean,
			transition: String,
			appendToBody: {
				type: Boolean,
				default: true
			},
			options: {
				type: Object,
				default: function() {
					return {
						gpuAcceleration: false
					};
				}
			}
		},
		data: function() {
			return {
				showPopper: false,
				currentPlacement: ''
			};
		},
		watch: {
			value: {
				immediate: true,
				handler: function(val) {
					this.showPopper = val;
					this.$emit('input', val);
				}
			},
			showPopper: function(val) {
				val ? this.updatePopper() : this.destroyPopper();
				this.$emit('input', val);
			}
		},
		methods: {
			createPopper: function() {
				var self = this;
				if (self.$isServer)
					return;
				self.currentPlacement = self.currentPlacement || self.placement;
				if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(self.currentPlacement)) {
					return;
				}
				var options = self.options || {};
				var popper = self.popperElm = self.popperElm || self.popper || self.$refs.popper;
				var reference = self.referenceElm = self.referenceElm || self.reference || self.$refs.reference;
				if (!reference && self.$slots.reference && self.$slots.reference[0]) {
					reference = self.referenceElm = self.$slots.reference[0].elm;
				}
				if (!popper || !reference)
					return;
				if (self.visibleArrow)
					self.appendArrow(popper);
				if (self.appendToBody)
					document.body.appendChild(self.popperElm);
				if (self.popperJS && self.popperJS.destroy) {
					self.popperJS.destroy();
				}
				options.placement = self.currentPlacement;
				options.offset = self.offset;
				self.popperJS = new PopperJS(reference,popper,options);
				self.popperJS.onCreate(function() {
					self.$emit('created', self);
					self.resetTransformOrigin();
					self.$nextTick(self.updatePopper);
				});
				if (typeof options.onUpdate === 'function') {
					self.popperJS.onUpdate(options.onUpdate);
				}
				self.popperJS._popper.style.zIndex = VueUtil.component.popupManager.nextZIndex();
				self.popperElm.addEventListener('click', stop);
			},
			updatePopper: function() {
				this.popperJS ? this.popperJS.update() : this.createPopper();
			},
			doDestroy: function() {
				if (this.showPopper || !this.popperJS)
					return;
				this.popperJS.destroy();
				this.popperJS = null;
			},
			destroyPopper: function() {
				if (this.popperJS) {
					this.resetTransformOrigin();
				}
			},
			resetTransformOrigin: function() {
				var placementMap = {
					top: 'bottom',
					bottom: 'top',
					left: 'right',
					right: 'left'
				};
				var placement = this.popperJS._popper.getAttribute('x-placement').split('-')[0];
				var origin = placementMap[placement];
				this.popperJS._popper.style.transformOrigin = ['top', 'bottom'].indexOf(placement) > -1 ? 'center ' + origin : origin + ' center';
			},
			appendArrow: function(element) {
				var hash;
				if (this.appended) {
					return;
				}
				this.appended = true;
				for (var item in element.attributes) {
					if (/^_v-/.test(element.attributes[item].name)) {
						hash = element.attributes[item].name;
						break;
					}
				}
				var arrow = document.createElement('div');
				if (hash) {
					arrow.setAttribute(hash, '');
				}
				arrow.setAttribute('x-arrow', '');
				arrow.className = 'popper__arrow';
				element.appendChild(arrow);
			}
		},
		beforeDestroy: function() {
			this.doDestroy();
			if (this.popperElm && this.popperElm.parentNode === document.body) {
				this.popperElm.removeEventListener('click', stop);
				document.body.removeChild(this.popperElm);
			}
		},
		deactivated: function() {
			this.$options.beforeDestroy[0].call(this);
		}
	};
	return VuePopper;
});
