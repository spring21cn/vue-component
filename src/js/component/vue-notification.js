!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueNotification', this, function(Vue, VueUtil) {
	'use strict';
	var typeMap = {
		success: 'circle-check',
		info: 'information',
		warning: 'warning',
		error: 'circle-cross'
	};
	var VueNotification = {
		template: '<transition :name="isLeft ? \'vue-notification-fade-left\' : isTop ? \'vue-notification-fade-top\' : isBottom ? \'vue-notification-fade-bottom\' : isCenter? \'vue-notification-fade-center\' : \'vue-notification-fade\'"><div class="vue-notification" :class="[{\'vue-notification-translateX\':centerX, \'vue-notification-translateY\':centerY},customClass]" v-show="visible" :style="{ top: top ? top + \'px\' : \'auto\', bottom: bottom ? bottom + \'px\' : \'auto\', left: left ? left + \'px\' : \'auto\', right: right ? right + \'px\' : \'auto\' }"><i class="vue-notification__icon" :class="[ typeClass, iconClass ]" v-if="type || iconClass"></i><div class="vue-notification__group"><h2 class="vue-notification__title" v-text="title" v-if="showTitle"></h2><div class="vue-notification__content" v-if="showMessage" :style="{\'margin-top\':showTitle?\'10px\':\'\'}"><slot>{{ message }}</slot></div><div class="vue-notification__closeBtn vue-icon-close" @click="close" v-if="duration===0"></div></div></div></transition>',
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
				position: 'top-right',
				timer: null,
				isLeft: false,
				isTop: false,
				isBottom: false,
				isCenter: false
			};
		},
		computed: {
			showTitle: function() {
				if (VueUtil.trim(this.title) === "") {
					return false;
				}
				return true;
			},
			showMessage: function() {
				if (VueUtil.trim(this.message) === "" && !this.$slots.default) {
					return false;
				}
				return true;
			},
			typeClass: function() {
				return this.type && typeMap[this.type.toLowerCase()] ? 'vue-icon-' + typeMap[this.type.toLowerCase()] : '';
			}
		},
		methods: {
			close: function() {
				this.closed = true;
				if (typeof this.onClose === 'function') {
					this.onClose();
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
	var NotificationConstructor = Vue.extend(VueNotification);
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
		var instance = new NotificationConstructor({
			data: options
		});
		if (VueUtil.component.isVNode(options.message)) {
			instance.$slots.default = [options.message];
			options.message = '';
		}
		instance.id = id;
		instance.vm = instance.$mount();
		instance.vm.visible = true;
		instance.dom = instance.vm.$el;
		instance.dom.style.zIndex = VueUtil.component.popupManager.nextZIndex();
		var instancePosition = instance.position.split("-");
		var positionX = instancePosition[1];
		var positionY = instancePosition[0];
		var isLeft = positionX.indexOf('left')!==-1;
		var isCenterX = positionX.indexOf('center')!==-1;
		var isRight = positionX.indexOf('right')!==-1;
		var isTop = positionY.indexOf('top')!==-1;
		var isCenterY = positionY.indexOf('center')!==-1;
		var isBottom = positionY.indexOf('bottom')!==-1;
		if ((!isLeft && !isCenterX && !isRight) || (!isTop && !isCenterY && !isBottom)) {
			VueUtil.removeNode(instance.dom);
			instance.$destroy();
			return;
		}
		instance.isLeft = false;
		instance.isBottom = false;
		instance.top = false;
		instance.isCenter = false;
		if (isCenterY) {
			instance.centerY = true;
		}
		if (isLeft) {
			instance.left = 8;
			instance.isLeft = true;
		}
		if (isCenterX) {
			instance.centerX = true;
			instance.isCenter = true;
		}
		if (isRight) {
			instance.right = 8;
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
		try {
			top.document.body.appendChild(instance.vm.$el);
		} catch (e) {
			document.body.appendChild(instance.vm.$el);
		}
	};
	['success', 'warning', 'info', 'error'].forEach(function(type) {
		Notification[type] = function(options) {
			options.type = type;
			Notification(options);
		};
	});
	Notification.close = function(id, userOnClose) {
		for (var i = 0, len = instances.length; i < len; i++) {
			var instance = instances[i];
			if (id === instance.id) {
				if (typeof userOnClose === 'function') {
					userOnClose(instance);
				}
				var removedHeight = instance.dom.offsetHeight + offHeight;
				var instancesPosition = instance.position.split("-");
				var positionX = instancesPosition[1];
				var positionY = instancesPosition[0];
				var isLeft = positionX.indexOf('left')!==-1;
				var isCenterX = positionX.indexOf('center')!==-1;
				var isRight = positionX.indexOf('right')!==-1;
				var isTop = positionY.indexOf('top')!==-1;
				var isBottom = positionY.indexOf('bottom')!==-1;
				if (isBottom) {
					if (isLeft) {
						var lbi = leftBottomInstances.indexOf(instance);
						leftBottomInstances.splice(lbi, 1);
						for (var lbj = leftBottomInstances.length; lbi < lbj ; lbi++) {
							leftBottomInstances[lbi].dom.style.bottom = parseInt(leftBottomInstances[lbi].dom.style.bottom, 10) - removedHeight + 'px';
						}
					}
					if (isCenterX) {
						var cbi = centerBottomInstances.indexOf(instance);
						centerBottomInstances.splice(cbi, 1);
						for (var cbj = centerBottomInstances.length; cbi < cbj ; cbi++) {
							centerBottomInstances[cbi].dom.style.bottom = parseInt(centerBottomInstances[cbi].dom.style.bottom, 10) - removedHeight + 'px';
						}
					}
					if (isRight) {
						var rbi = rightBottomInstances.indexOf(instance);
						rightBottomInstances.splice(rbi, 1);
						for (var rbj = rightBottomInstances.length; rbi < rbj ; rbi++) {
							rightBottomInstances[rbi].dom.style.bottom = parseInt(rightBottomInstances[rbi].dom.style.bottom, 10) - removedHeight + 'px';
						}
					}
				}
				if (isTop) {
					if (isLeft) {
						var lti = leftTopInstances.indexOf(instance);
						leftTopInstances.splice(lti, 1);
						for (var ltj = leftTopInstances.length; lti < ltj ; lti++) {
							leftTopInstances[lti].dom.style.top = parseInt(leftTopInstances[lti].dom.style.top, 10) - removedHeight + 'px';
						}
					}
					if (isCenterX) {
						var cti = centerTopInstances.indexOf(instance);
						centerTopInstances.splice(cti, 1);
						for (var ctj = centerTopInstances.length; cti < ctj ; cti++) {
							centerTopInstances[cti].dom.style.top = parseInt(centerTopInstances[cti].dom.style.top, 10) - removedHeight + 'px';
						}
					
					}
					if (isRight) {
						var rti = rightTopInstances.indexOf(instance);
						rightTopInstances.splice(rti, 1);
						for (var rtj = rightTopInstances.length; rti < rtj ; rti++) {
							rightTopInstances[rti].dom.style.top = parseInt(rightTopInstances[rti].dom.style.top, 10) - removedHeight + 'px';
						}
					}
				}
				VueUtil.removeNode(instance.dom);
				instance.$destroy();
				instances.splice(i, 1);
				break;
			}
		}
	};
	Vue.prototype.$notify = Notification;
	Vue.notify = Notification;
});
