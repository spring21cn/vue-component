!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VuePopup', 'VueInput', 'VueButton'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VuePopup'], context['VueInput'], context['VueButton']);
		delete context[name];
	}
})('VueMessageBox', this, function(Vue, VueUtil, VuePopup, VueInput, VueButton) {
	'use strict';
	var isVNode = function(node) {
		return typeof node === 'object' && Object.prototype.hasOwnProperty.call(node, 'componentOptions');
	};
	var typeMap = {
		success: 'circle-check',
		info: 'information',
		warning: 'warning',
		error: 'circle-cross'
	};
	var VueMessageBox = {
		template: '<transition name="msgbox-fade"><div class="vue-message-box__wrapper" v-show="visible" @click.self="handleWrapperClick"><div class="vue-message-box" :class="customClass"><div class="vue-message-box__header" v-if="title !== undefined"><div class="vue-message-box__title">{{ title || $t(\'vue.messagebox.title\') }}</div><i class="vue-message-box__close vue-icon-close" @click="handleAction(\'cancel\')" v-if="showClose"></i></div><div class="vue-message-box__content" v-if="message !== \'\'"><div class="vue-message-box__status" :class="[ typeClass ]"></div><div class="vue-message-box__message" :style="{ \'margin-left\': typeClass ? \'50px\' : \'0\' }"><slot><p>{{ message }}</p></slot></div><div class="vue-message-box__input" v-show="showInput"><vue-input v-model="inputValue" @keyup.enter.native="handleAction(\'confirm\')" :placeholder="inputPlaceholder" ref="input"></vue-input><div class="vue-message-box__errormsg" :style="{ visibility: !!editorErrorMessage ? \'visible\' : \'hidden\' }">{{ editorErrorMessage }}</div></div></div><div class="vue-message-box__btns"><vue-button :loading="cancelButtonLoading" :class="[ cancelButtonClasses ]" v-show="showCancelButton" @click.native="handleAction(\'cancel\')"> {{ cancelButtonText || $t(\'vue.messagebox.cancel\') }}</vue-button><vue-button :loading="confirmButtonLoading" ref="confirm" :class="[ confirmButtonClasses ]" v-show="showConfirmButton" @click.native="handleAction(\'confirm\')"> {{ confirmButtonText || $t(\'vue.messagebox.confirm\') }}</vue-button></div></div></div></transition>',
		mixins: [VuePopup().VuePopup],
		props: {
			lockScroll: {
				type: Boolean,
				default: true
			},
			showClose: {
				type: Boolean,
				default: false
			},
			closeOnClickModal: {
				type: Boolean,
				default: false
			},
			closeOnPressEscape: {
				type: Boolean,
				default: true
			}
		},
		components: {
			VueInput: VueInput(),
			VueButton: VueButton()
		},
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
				if (self.action) self.callback(self.action, self);
			},
			handleWrapperClick: function() {
				if (this.closeOnClickModal) {
					this.action = '';
					this.doClose();
				}
			},
			handleAction: function(action) {
				if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
					return;
				}
				this.action = action;
				if (typeof this.beforeClose === 'function') {
					this.close = this.getSafeClose();
					this.beforeClose(action, this, this.close);
				} else {
					this.doClose();
				}
			},
			validate: function() {
				if (this.$type === 'prompt') {
					var inputPattern = this.inputPattern;
					if (inputPattern && !inputPattern.test(this.inputValue || '')) {
						this.editorErrorMessage = this.inputErrorMessage || this.$t('vue.messagebox.error');
						VueUtil.addClass(this.$refs.input.$el.querySelector('input'), 'invalid');
						return false;
					}
					var inputValidator = this.inputValidator;
					if (typeof inputValidator === 'function') {
						var validateResult = inputValidator(this.inputValue);
						if (validateResult === false) {
							this.editorErrorMessage = this.inputErrorMessage || this.$t('vue.messagebox.error');
							VueUtil.addClass(this.$refs.input.$el.querySelector('input'), 'invalid');
							return false;
						}
						if (typeof validateResult === 'string') {
							this.editorErrorMessage = validateResult;
							return false;
						}
					}
				}
				this.editorErrorMessage = '';
				VueUtil.removeClass(this.$refs.input.$el.querySelector('input'), 'invalid');
				return true;
			}
		},
		watch: {
			inputValue: {
				immediate: true,
				handler: function(val) {
					var self = this;
					self.$nextTick(function() {
						if (self.$type === 'prompt' && val !== null) {
							self.validate();
						}
					});
				}
			},
			visible: function(val) {
				var self = this;
				if (val) {
					self.uid++;
					self.$el.addEventListener('touchmove', function(event) {
						event.preventDefault();
						event.stopPropagation();
					});
				} else {
					self.$el.removeEventListener('touchmove', function(event) {
						event.preventDefault();
						event.stopPropagation();
					});
				}
				if (self.$type === 'alert' || self.$type === 'confirm') {
					self.$nextTick(function() {
						self.$refs.confirm.$el.focus();
					});
				}
				if (self.$type !== 'prompt') return;
				if (val) {
					setTimeout(function() {
						if (self.$refs.input && self.$refs.input.$el) {
							self.$refs.input.$el.querySelector('input').focus();
						}
					}, 500);
				} else {
					self.editorErrorMessage = '';
					VueUtil.removeClass(self.$refs.input.$el.querySelector('input'), 'invalid');
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
				showInput: false,
				inputValue: null,
				inputPlaceholder: '',
				inputPattern: null,
				inputValidator: null,
				inputErrorMessage: '',
				showConfirmButton: true,
				showCancelButton: false,
				action: '',
				confirmButtonText: '',
				cancelButtonText: '',
				confirmButtonLoading: false,
				cancelButtonLoading: false,
				confirmButtonClass: '',
				confirmButtonDisabled: false,
				cancelButtonClass: '',
				editorErrorMessage: null,
				callback: null
			};
		}
	};
	var defaults = {
		title: undefined,
		message: '',
		type: '',
		showInput: false,
		showClose: false,
		lockScroll: true,
		closeOnClickModal: false,
		closeOnPressEscape: true,
		inputValue: null,
		inputPlaceholder: '',
		inputPattern: null,
		inputValidator: null,
		inputErrorMessage: '',
		showConfirmButton: true,
		showCancelButton: false,
		confirmButtonPosition: 'right',
		confirmButtonHighlight: false,
		cancelButtonHighlight: false,
		confirmButtonText: '',
		cancelButtonText: '',
		confirmButtonClass: '',
		cancelButtonClass: '',
		customClass: '',
		beforeClose: null
	};
	var MessageBoxConstructor = Vue.extend(VueMessageBox);
	var currentMsg, instance;
	var msgQueue = [];
	var defaultCallback = function(action) {
		if (currentMsg) {
			var callback = currentMsg.callback;
			if (typeof callback === 'function') {
				if (instance.showInput) {
					callback(instance.inputValue, action);
				} else {
					callback(action);
				}
			}
			if (currentMsg.resolve) {
				var $type = currentMsg.options.$type;
				if ($type === 'confirm' || $type === 'prompt') {
					if (action === 'confirm') {
						if (instance.showInput) {
							currentMsg.resolve({ value: instance.inputValue, action: action });
						} else {
							currentMsg.resolve(action);
						}
					} else if (action === 'cancel' && currentMsg.reject) {
						currentMsg.reject(action);
					}
				} else {
					currentMsg.resolve(action);
				}
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
		if (!instance) {
			initInstance();
		}
		instance.action = '';
		if (!instance.visible || instance.closeTimer) {
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
				if (isVNode(instance.message)) {
					instance.$slots.default = [instance.message];
					instance.message = null;
				}
				['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape'].forEach(function(prop) {
					if (instance[prop] === undefined) {
						instance[prop] = true;
					}
				});
				document.body.appendChild(instance.$el);
				Vue.nextTick(function() {
					instance.visible = true;
				});
			}
		}
	};
	var MessageBox = function(options, callback) {
		if (Vue.prototype.$isServer) return;
		if (typeof options === 'string') {
			options = {
				message: options
			};
			if (arguments[1]) {
				options.title = arguments[1];
			}
			if (arguments[2]) {
				options.type = arguments[2];
			}
		} else if (options.callback && !callback) {
			callback = options.callback;
		}
		if (typeof Promise !== 'undefined') {
			return new Promise(function(resolve, reject) {
				msgQueue.push({
					options: VueUtil.merge({}, defaults, MessageBox.defaults, options),
					callback: callback,
					resolve: resolve,
					reject: reject
				});
				showNextMsg();
			});
		} else {
			msgQueue.push({
				options: VueUtil.merge({}, defaults, MessageBox.defaults, options),
				callback: callback
			});
			showNextMsg();
		}
	};
	MessageBox.setDefaults = function(defaults) {
		MessageBox.defaults = defaults;
	};
	MessageBox.alert = function(message, title, options) {
		if (typeof title === 'object') {
			options = title;
			title = '';
		}
		return MessageBox(VueUtil.merge({
			title: title,
			message: message,
			$type: 'alert'
		}, options));
	};
	MessageBox.confirm = function(message, title, options) {
		if (typeof title === 'object') {
			options = title;
			title = '';
		}
		return MessageBox(VueUtil.merge({
			title: title,
			message: message,
			$type: 'confirm',
			closeOnPressEscape: false,
			showCancelButton: true
		}, options));
	};
	MessageBox.prompt = function(message, title, options) {
		if (typeof title === 'object') {
			options = title;
			title = '';
		}
		return MessageBox(VueUtil.merge({
			title: title,
			message: message,
			showCancelButton: true,
			showInput: true,
			$type: 'prompt'
		}, options));
	};
	MessageBox.close = function() {
		instance.visible = false;
		msgQueue = [];
		currentMsg = null;
	};
	Vue.prototype.$msgbox = MessageBox;
	Vue.prototype.$alert = MessageBox.alert;
	Vue.prototype.$confirm = MessageBox.confirm;
	Vue.prototype.$prompt = MessageBox.prompt;
});
