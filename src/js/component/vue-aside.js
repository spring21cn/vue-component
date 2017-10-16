!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePopup', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePopup'], context['VueUtil']);
		delete context[name];
	}
})('VueAside', this, function(Vue, VuePopup, VueUtil) {
	'use strict';
	var VueAside = {
		template: '<div :class="[{\'vue-aside__static\':relative}]"><div v-show="visibleaside" class="vue-aside__wrapper" :class="[{\'vue-aside__absolute\':relative}, {\'is-clear\': clearModal}]" @click.self="handleWrapperClick"></div><transition :name="left ? \'vue-aside-left\' : \'vue-aside-right\'"><div v-show="visibleaside" class="vue-aside" :class="[{\'vue-aside-left\':left, \'vue-aside__absolute\':relative},sizeClass,customClass]" ref="aside"><div v-if="showClose" class="vue-aside__headerbtn"><i class="vue-aside__close vue-icon vue-icon-close" @click=\'handleClose\'></i></div><div class="vue-aside__header"><span class="vue-aside__title" v-if="showTitle && !$slots.header">{{title}}</span><slot name="header"></slot></div><div class="vue-aside__body"><slot></slot></div><div class="vue-aside__footer" v-if="$slots.footer"><slot name="footer"></slot></div></div></transition></div>',
		name: 'VueAside',
		mixins: [VuePopup],
		data: function(){
			return {
				visibleaside: false
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
			left: {
				type: Boolean,
				default: false
			},
			relative: {
				type: Boolean,
				default: false
			},
			customClass: {
				type: String,
				default: ""
			},
			clearModal: {
				type: Boolean,
				default: false
			},
			beforeClose: Function
		},
		watch: {
			visibleaside: function(val){
				if (val) {
					this.opened = true;
					this.$emit('open');
					this.$el.addEventListener('scroll', this.updatePopper);
					var refsAside = this.$refs.aside;
					this.$nextTick(function() {
						refsAside.scrollTop = 0;
					});
				} else {
					this.opened = false;
					this.$el.removeEventListener('scroll', this.updatePopper);
					this.$emit('close');
				}
			},
			visible: function(val) {
				if (val) {
					this.visibleaside = val;
				} else {
					if (typeof this.beforeClose === 'function') {
						var self = this;
						var done = function(resolve) {
							if (resolve === undefined) resolve = true;
							if (resolve) {
								self.$nextTick(function() {
									self.visibleaside = val;
								});
							} else {
								self.$emit('visible-change', true);
							}
						};
						self.beforeClose(done);
					} else {
						this.visibleaside = val
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
				return 'vue-aside--' + this.size;
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
	Vue.component(VueAside.name, VueAside);
});
