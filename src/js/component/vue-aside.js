!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePopup'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePopup']);
		delete context[name];
	}
})('VueAside', this, function(Vue, VuePopup) {
	'use strict';
	var VueAside = {
		template: '<div :class="[{\'vue-aside__initial\':relative}]"><div v-show="visible" class="vue-aside__wrapper" :class="[{\'vue-aside__absolute\':relative}]" @click.self="handleWrapperClick"></div><transition :name="left ? \'vue-aside-left\' : \'vue-aside-right\'"><div v-show="visible" class="vue-aside" :class="[{\'vue-aside-left\':left, \'vue-aside__absolute\':relative},sizeClass,setClass]" ref="dialog" :style="setStyle"><div v-if="showClose" class="vue-aside__headerbtn"><i class="vue-aside__close vue-icon vue-icon-close" @click=\'handleClose\'></i></div><div class="vue-aside__header"><span class="vue-aside__title" v-if="showTitle && !$slots.header">{{title}}</span><slot name="header"></slot></div><div class="vue-aside__body"><slot></slot></div><div class="vue-aside__footer" v-if="$slots.footer"><slot name="footer"></slot></div></div></transition></div>',
		name: 'VueAside',
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
			left: {
				type: Boolean,
				default: false
			},
			relative: {
				type: Boolean,
				default: false
			},
			asideClass: {
				type: String,
				default: ""
			},
			asideStyle: {
				type: String,
				default: ""
			}
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
				return 'vue-aside--' + this.size;
			},
			setClass: function() {
				return this.asideClass;
			},
			setStyle: function() {
				return this.asideStyle;
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
	Vue.component(VueAside.name, VueAside);
});
