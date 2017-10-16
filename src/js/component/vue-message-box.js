!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VuePopup'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VuePopup']);
		delete context[name];
	}
})('VueMessageBox', this, function(Vue, VueUtil, VuePopup) {
	'use strict';
	var typeMap = {
		success: 'circle-check',
		info: 'information',
		warning: 'warning',
		error: 'circle-cross'
	};
	var VueMessageBox = {
		template: '<transition name="msgbox-fade" @after-leave="$emit(\'doDestroy\')"><div class="vue-message-box__wrapper" v-if="visible"><div class="vue-message-box" :class="customClass"><div class="vue-message-box__header" v-if="title !== undefined"><div class="vue-message-box__title">{{ title || $t(\'vue.messagebox.title\') }}</div></div><div class="vue-message-box__content" v-if="message !== \'\'"><div class="vue-message-box__status" :class="[ typeClass ]"></div><div class="vue-message-box__message" :style="{ \'margin-left\': typeClass ? \'50px\' : \'0\' }"><slot><p>{{ message }}</p></slot></div></div><div class="vue-message-box__btns"><vue-button :loading="cancelButtonLoading" :class="[ cancelButtonClasses ]" v-if="showCancelButton" @click.native="handleAction(\'cancel\')">{{ cancelButtonText || $t(\'vue.messagebox.cancel\') }}</vue-button><vue-button :loading="confirmButtonLoading" ref="confirm" :class="[ confirmButtonClasses ]" @click.native="handleAction(\'confirm\')">{{ confirmButtonText || $t(\'vue.messagebox.confirm\') }}</vue-button></div></div></div></transition>',
		mixins: [VuePopup],
		computed: {
			typeClass: function() {
				return this.type && typeMap[this.type] ? 'vue-icon-' + typeMap[this.type] : '';
			},
			confirmButtonClasses: function() {
				return 'vue-button--primary '+ this.confirmButtonClass;
			},
			cancelButtonClasses: function() {
				return this.cancelButtonClass;
			}
		},
		mounted: function(){
			var self = this;
			self.$on('doDestroy', function() {
				VueUtil.removeNode(self.$el);
				self.$destroy();
			});
		},
		methods: {
			getSafeClose: function() {
				var self = this;
				var currentId = self.uid;
				return function() {
					self.$nextTick(function() {
						if (currentId === self.uid) self.doClose();
					});
				};
			},
			doClose: function() {
				var self = this;
				if (!self.visible) return;
				self.visible = false;
				self.opened = false;
				if (self.action) self.callback(self.action, self);
			},
			handleAction: function(action) {
				this.action = action;
				if (typeof this.beforeClose === 'function') {
					this.close = this.getSafeClose();
					this.beforeClose(action, this, this.close);
				} else {
					this.doClose();
				}
			},
		},
		watch: {
			visible: function(val) {
				var self = this;
				if (val) {
					self.uid++;
					self.$nextTick(function() {
						self.$refs.confirm.$el.focus();
					});
				}
			}
		},
		data: function() {
			return {
				uid: 1,
				title: undefined,
				message: '',
				type: '',
				customClass: '',
				showCancelButton: false,
				action: '',
				confirmButtonText: '',
				cancelButtonText: '',
				confirmButtonLoading: false,
				cancelButtonLoading: false,
				confirmButtonClass: '',
				cancelButtonClass: '',
				callback: null,
				beforeClose: null
			};
		}
	};
	var MessageBoxConstructor = Vue.extend(VueMessageBox);
	var currentMsg, instance;
	var msgQueue = [];
	var defaultCallback = function(action) {
		if (currentMsg) {
			if (action === 'confirm') {
				currentMsg.resolve(action);
			}
			if (action === 'cancel') {
				currentMsg.reject(action);
			}
		}
	};
	var initInstance = function() {
		instance = new MessageBoxConstructor({
			el: document.createElement('div')
		});
		instance.callback = defaultCallback;
	};
	var showNextMsg = function() {
		initInstance();
		instance.action = '';
		if (!instance.visible) {
			if (msgQueue.length > 0) {
				currentMsg = msgQueue.shift();
				var options = currentMsg.options;
				for (var prop in options) {
					if (options.hasOwnProperty(prop)) {
						instance[prop] = options[prop];
					}
				}
				if (options.callback === undefined) {
					instance.callback = defaultCallback;
				}
				var oldCb = instance.callback;
				instance.callback = function(action, instance) {
					oldCb(action, instance);
					showNextMsg();
				};
				if (VueUtil.component.isVNode(instance.message)) {
					instance.$slots.default = [instance.message];
					instance.message = null;
				}
				try {
					top.document.body.appendChild(instance.$el);
				} catch (e) {
					document.body.appendChild(instance.$el);
				}
				Vue.nextTick(function() {
					instance.visible = true;
				});
			}
		}
	};
	var MessageBox = function(options) {
		if (Vue.prototype.$isServer) return;
		var callback;
		if (options.callback) {
			callback = options.callback;
		}
		return new Promise(function(resolve, reject) {
			msgQueue.push({
				options: VueUtil.merge({}, options, {closeOnPressEscape: false}),
				callback: callback,
				resolve: resolve,
				reject: reject
			});
			showNextMsg();
		});
	};
	var messageBoxAlert = function(options) {
		return new MessageBox(VueUtil.merge({}, options, {showCancelButton: false}));
	};
	var messageBoxConfirm = function(options) {
		return new MessageBox(VueUtil.merge({}, options, {showCancelButton: true}));
	};
	Vue.prototype.$alert = messageBoxAlert;
	Vue.prototype.$confirm = messageBoxConfirm;
	Vue.alert = messageBoxAlert;
	Vue.confirm = messageBoxConfirm;
});
