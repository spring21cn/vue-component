!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePopup'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePopup']);
		delete context[name];
	}
})('VueDialog', this, function(Vue, VuePopup) {
	'use strict';
	var VueDialog = {
		template: '<transition name="dialog-fade"><div class="vue-dialog__wrapper" v-show="visible" @click.self="handleWrapperClick"><div class="vue-dialog" :class="[sizeClass, customClass]" ref="dialog" :style="style"><div class="vue-dialog__header"><span class="vue-dialog__title" v-if="showTitle && !$slots.header">{{title}}</span><slot name="header"></slot><div class="vue-dialog__headerbtn" v-if="showClose" ><i class="vue-dialog__close vue-icon vue-icon-close" @click=\'handleClose\'></i></div></div><div class="vue-dialog__body"><slot></slot></div><div class="vue-dialog__footer" v-if="$slots.footer"><slot name="footer"></slot></div></div></div></transition>',
		name: 'VueDialog',
		mixins: [VuePopup().VuePopup],
		props: {
			title: {
				type: String,
				default: ''
			},
			lockScroll: {
				type: Boolean,
				default: true
			},
			closeOnClickModal: {
				type: Boolean,
				default: false
			},
			closeOnPressEscape: {
				type: Boolean,
				default: true
			},
			showClose: {
				type: Boolean,
				default: false
			},
			size: {
				type: String,
				default: 'small'
			},
			customClass: {
				type: String,
				default: ''
			},
			top: {
				type: String,
				default: '15%'
			},
			beforeClose: Function
		},
		watch: {
			visible: function(val) {
				if (val) {
					this.$emit('open');
					this.$el.addEventListener('scroll', this.updatePopper);
					this.$el.firstElementChild.addEventListener('touchmove', function(event) {
						event.preventDefault();
						event.stopPropagation();
					});
					var refsDialog = this.$refs.dialog;
					this.$nextTick(function() {
						refsDialog.scrollTop = 0;
					});
				} else {
					this.$el.removeEventListener('scroll', this.updatePopper);
					this.$el.firstElementChild.removeEventListener('touchmove', function(event) {
						event.preventDefault();
						event.stopPropagation();
					});
					this.$emit('close');
				}
			}
		},
		computed: {
			showTitle: function() {
				if (this.title.replace(/^\s+|\s+$/g, "") === "") {
					return false;
				}
				return true;
			},
			sizeClass: function() {
				return 'vue-dialog--' + this.size;
			},
			style: function() {
				return this.size === 'full' ? {} : { 'top': this.top };
			}
		},
		methods: {
			handleWrapperClick: function() {
				if (!this.closeOnClickModal) return;
				this.handleClose();
			},
			handleClose: function() {
				if (typeof this.beforeClose === 'function') {
					this.beforeClose();
				}
				this.$emit('visible-change', false);
			}
		}
	};
	Vue.component(VueDialog.name, VueDialog);
});
