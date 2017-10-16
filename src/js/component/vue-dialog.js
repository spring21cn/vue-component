!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePopup', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePopup'], context['VueUtil']);
		delete context[name];
	}
})('VueDialog', this, function(Vue, VuePopup, VueUtil) {
	'use strict';
	var VueDialog = {
		template: '<transition name="dialog-fade"><div class="vue-dialog__wrapper" :class="{\'is-clear\': clearModal}" v-show="visibledialog" @click.self="handleWrapperClick"><div v-draggable :draggable-cancel-selector="draggableCancelSelector" class="vue-dialog" :class="[sizeClass, customClass]" ref="dialog" :style="style"><div class="vue-dialog__header"><span class="vue-dialog__title" v-if="showTitle && !$slots.header">{{title}}</span><slot name="header"></slot><div class="vue-dialog__headerbtn" v-if="showClose" ><i class="vue-dialog__close vue-icon vue-icon-close" @click=\'handleClose\'></i></div></div><div class="vue-dialog__body"><slot></slot></div><div class="vue-dialog__footer" v-if="$slots.footer"><slot name="footer"></slot></div></div></div></transition>',
		name: 'VueDialog',
		mixins: [VuePopup],
		data: function(){
			return {
				visibledialog: false
			}
		},
		props: {
			title: {
				type: String,
				default: ''
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
			clearModal: {
				type: Boolean,
				default: false
			},
			beforeClose: Function
		},
		watch: {
			visibledialog: function(val){
				if (val) {
					this.opened = true;
					this.$emit('open');
					this.$el.addEventListener('scroll', this.updatePopper);
					var refsDialog = this.$refs.dialog;
					this.$nextTick(function() {
						refsDialog.scrollTop = 0;
					});
				} else {
					this.opened = false;
					this.$el.removeEventListener('scroll', this.updatePopper);
					this.$emit('close');
				}
			},
			visible: function(val) {
				if (val) {
					this.visibledialog = val;
				} else {
					if (typeof this.beforeClose === 'function') {
						var self = this;
						var done = function(resolve) {
							if (resolve === undefined) resolve = true;
							if (resolve) {
								self.$nextTick(function() {
									self.visibledialog = val;
								});
							} else {
								self.$emit('visible-change', true);
							}
						};
						self.beforeClose(done);
					} else {
						this.visibledialog = val
					}
				} 
			}
		},
		computed: {
			showTitle: function() {
				if (VueUtil.trim(this.title) === "") {
					return false;
				}
				return true;
			},
			sizeClass: function() {
				return 'vue-dialog--' + this.size;
			},
			style: function() {
				return this.size === 'full' ? {} : { 'top': this.top };
			},
			draggableCancelSelector: function() {
				return this.size === 'full' ? '.vue-dialog__header, .vue-dialog__body, .vue-dialog__footer' : '.vue-dialog__headerbtn, .vue-dialog__body, .vue-dialog__footer';
			}
		},
		methods: {
			handleWrapperClick: function() {
				if (!this.closeOnClickModal) return;
				this.handleClose();
			},
			handleClose: function() {
				this.$emit('visible-change', false);
			}
		}
	};
	Vue.component(VueDialog.name, VueDialog);
});
