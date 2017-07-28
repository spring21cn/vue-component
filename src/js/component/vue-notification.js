!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VuePopup'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VuePopup']);
		delete context[name];
	}
})('VueNotification', this, function(Vue, VueUtil, VuePopup) {
	'use strict';
	var typeMap = {
		success: 'circle-check',
		info: 'information',
		warning: 'warning',
		error: 'circle-cross'
	};
	var VueNotification = {
		template: '<transition :name="isLeft ? \'vue-notification-fade-left\' : isTop ? \'vue-notification-fade-top\' : isBottom ? \'vue-notification-fade-bottom\' : isCenter? \'vue-notification-fade-center\' : \'vue-notification-fade\'"><div class="vue-notification" :class="[{\'vue-notification-translateX\':centerX, \'vue-notification-translateY\':centerY},customClass]" v-show="visible" :style="{ top: top ? top + \'px\' : \'auto\', bottom: bottom ? bottom + \'px\' : \'auto\', left: left ? left + \'px\' : \'auto\', right: right ? right + \'px\' : \'auto\' }" @mouseenter="clearTimer()" @mouseleave="startTimer()"><i class="vue-notification__icon" :class="[ typeClass, iconClass ]" v-if="type || iconClass"></i><div class="vue-notification__group" :class="{ \'is-with-icon\': typeClass || iconClass }"><h2 class="vue-notification__title" v-text="title"></h2><div class="vue-notification__content"><slot>{{ message }}</slot></div><div class="vue-notification__closeBtn vue-icon-close" @click="close"></div></div></div></transition>',
		data: function() {
			return {
				visible: false,
				title: '',
				message: '',
				duration: 3000,
				type: '',
				customClass: '',
				iconClass: '',
				onClose: null,
				closed: false,
				top: null,
				bottom: null,
				left: null,
				right: null,
				centerX: false,
				centerY: false,
				position: 'right-top',
				timer: null,
				isLeft: false,
				isTop: false,
				isBottom: false,
				isCenter: false
			};
		},
		computed: {
			typeClass: function() {
				return this.type && typeMap[this.type] ? 'vue-icon-' + typeMap[this.type] : '';
			}
		},
		watch: {
			closed: function(newVal) {
				if (newVal) {
					this.visible = false;
					this.$el.addEventListener('transitionend', this.destroyElement);
				}
			}
		},
		methods: {
			destroyElement: function() {
				this.$el.removeEventListener('transitionend', this.destroyElement);
				this.$destroy(true);
				this.$el.parentNode.removeChild(this.$el);
			},
			close: function() {
				this.closed = true;
				if (typeof this.onClose === 'function') {
					this.onClose();
				}
			},
			clearTimer: function() {
				clearTimeout(this.timer);
			},
			startTimer: function() {
				var self = this;
				if (self.duration > 0) {
					self.timer = setTimeout(function() {
						if (!self.closed) {
							self.close();
						}
					}, self.duration);
				}
			}
		},
		mounted: function() {
			var self = this;
			if (self.duration > 0) {
				self.timer = setTimeout(function() {
					if (!self.closed) {
						self.close();
					}
				}, self.duration);
			}
		}
	};
	var isVNode = function(node) {
		return typeof node === 'object' && Object.prototype.hasOwnProperty.call(node, 'componentOptions');
	};
	var NotificationConstructor = Vue.extend(VueNotification);
	var instance;
	var instances = [];
	var leftTopInstances = [];
	var leftBottomInstances = [];
	var rightTopInstances = [];
	var rightBottomInstances = [];
	var centerTopInstances = [];
	var centerBottomInstances = [];
	var seed = 1;
	var offHeight = 8;
	var Notification = function(options) {
		if (Vue.prototype.$isServer) return;
		options = options || {};
		var userOnClose = options.onClose;
		var id = 'notification_' + seed++;
		options.onClose = function() {
			Notification.close(id, userOnClose);
		};
		instance = new NotificationConstructor({
			data: options
		});
		if (isVNode(options.message)) {
			instance.$slots.default = [options.message];
			options.message = '';
		}
		instance.id = id;
		instance.vm = instance.$mount();
		document.body.appendChild(instance.vm.$el);
		instance.vm.visible = true;
		instance.dom = instance.vm.$el;
		instance.dom.style.zIndex = VuePopup().PopupManager.nextZIndex();
		var positionX = instance.position.split("-")[0];
		var positionY = instance.position.split("-")[1];
		if (!positionX || !positionY) {
			positionX = 'right';
			positionY = 'top'
		}
		var isLeft = positionX.indexOf('left')!==-1;
		var isCenterX = positionX.indexOf('center')!==-1;
		var isRight = positionX.indexOf('right')!==-1;
		var isTop = positionY.indexOf('top')!==-1;
		var isCenterY = positionY.indexOf('center')!==-1;
		var isBottom = positionY.indexOf('bottom')!==-1;
		instance.isLeft = false;
		instance.isBottom = false;
		instance.top = false;
		instance.isCenter = false;
		if (isCenterY) {
			instance.centerY = true;
		}
		if (isLeft) {
			instance.left = 0;
			instance.isLeft = true;
		}
		if (isCenterX) {
			instance.centerX = true;
			instance.isCenter = true;
		}
		if (isRight) {
			instance.right = 16;
		}
		if (isBottom) {
			if (isLeft) {
				var leftBottomDist = offHeight;
				for (var i = 0, len = leftBottomInstances.length; i < len; i++) {
					leftBottomDist += leftBottomInstances[i].$el.offsetHeight + offHeight;
				}
				instance.bottom = leftBottomDist;
				leftBottomInstances.push(instance);
			}
			if (isCenterX) {
				instance.isBottom = true;
				var centerBottomDist = offHeight;
				for (var i = 0, len = centerBottomInstances.length; i < len; i++) {
					centerBottomDist += centerBottomInstances[i].$el.offsetHeight + offHeight;
				}
				instance.bottom = centerBottomDist;
				centerBottomInstances.push(instance);
			}
			if (isRight) {
				var rightBottomDist = offHeight;
				for (var i = 0, len = rightBottomInstances.length; i < len; i++) {
					rightBottomDist += rightBottomInstances[i].$el.offsetHeight + offHeight;
				}
				instance.bottom = rightBottomDist;
				rightBottomInstances.push(instance);
			}
		}
		if (isTop) {
			if (isLeft) {
				var leftTopDist = offHeight;
				for (var i = 0, len = leftTopInstances.length; i < len; i++) {
					leftTopDist += leftTopInstances[i].$el.offsetHeight + offHeight;
				}
				instance.top = leftTopDist;
				leftTopInstances.push(instance);
			}
			if (isCenterX) {
				instance.isTop = true;
				var centerTopDist = offHeight;
				for (var i = 0, len = centerTopInstances.length; i < len; i++) {
					centerTopDist += centerTopInstances[i].$el.offsetHeight + offHeight;
				}
				instance.top = centerTopDist;
				centerTopInstances.push(instance);
			}
			if (isRight) {
				var rightTopDist = offHeight;
				for (var i = 0, len = rightTopInstances.length; i < len; i++) {
					rightTopDist += rightTopInstances[i].$el.offsetHeight + offHeight;
				}
				instance.top = rightTopDist;
				rightTopInstances.push(instance);
			}
		}
		instance.dom.style.display = "";
		instances.push(instance);
		return instance.vm;
	};
	['success', 'warning', 'info', 'error'].forEach(function(type) {
		Notification[type] = function(options) {
			if (typeof options === 'string' || isVNode(options)) {
				options = {
					message: options
				};
			}
			options.type = type;
			return Notification(options);
		};
	});
	Notification.close = function(id, userOnClose) {
		for (var i = 0, len = instances.length; i < len; i++) {
			if (id === instances[i].id) {
				if (typeof userOnClose === 'function') {
					userOnClose(instances[i]);
				}
				var removedHeight = instances[i].dom.offsetHeight + offHeight;
				var positionX = instances[i].position.split("-")[0]||"right";
				var positionY = instances[i].position.split("-")[1]||"top";
				var isLeft = positionX.indexOf('left')!==-1;
				var isCenterX = positionX.indexOf('center')!==-1;
				var isRight = positionX.indexOf('right')!==-1;
				var isTop = positionY.indexOf('top')!==-1;
				var isBottom = positionY.indexOf('bottom')!==-1;
				if (isBottom) {
					if (isLeft) {
						leftBottomInstances.splice(i, 1);
						for (var lbi = i, lbj = leftBottomInstances.length; lbi < lbj ; lbi++) {
							leftBottomInstances[lbi].dom.style.bottom = parseInt(leftBottomInstances[lbi].dom.style.bottom, 10) - removedHeight + 'px';
						}
					}
					if (isCenterX) {
						centerBottomInstances.splice(i, 1);
						for (var cbi = i, cbj = centerBottomInstances.length; cbi < cbj ; cbi++) {
							centerBottomInstances[cbi].dom.style.bottom = parseInt(centerBottomInstances[cbi].dom.style.bottom, 10) - removedHeight + 'px';
						}
					}
					if (isRight) {
						rightBottomInstances.splice(i, 1);
						for (var rbi = i, rbj = rightBottomInstances.length; rbi < rbj ; rbi++) {
							rightBottomInstances[rbi].dom.style.bottom = parseInt(rightBottomInstances[rbi].dom.style.bottom, 10) - removedHeight + 'px';
						}
					}
				}
				if (isTop) {
					if (isLeft) {
						leftTopInstances.splice(i, 1);
						for (var lti = i, ltj = leftTopInstances.length; lti < ltj ; lti++) {
							leftTopInstances[lti].dom.style.top = parseInt(leftTopInstances[lti].dom.style.top, 10) - removedHeight + 'px';
						}
					}
					if (isCenterX) {
						centerTopInstances.splice(i, 1);
						for (var cti = i, ctj = centerTopInstances.length; cti < ctj ; cti++) {
							centerTopInstances[cti].dom.style.top = parseInt(centerTopInstances[cti].dom.style.top, 10) - removedHeight + 'px';
						}
					
					}
					if (isRight) {
						rightTopInstances.splice(i, 1);
						for (var rti = i, rtj = rightTopInstances.length; rti < rtj ; rti++) {
							rightTopInstances[rti].dom.style.top = parseInt(rightTopInstances[rti].dom.style.top, 10) - removedHeight + 'px';
						}
					}
				}
				instances[i].dom.parentElement.removeChild(instances[i].dom);
				instances.splice(i, 1);
				break;
			}
		}
	};
	Vue.prototype.$notify = Notification;
});
