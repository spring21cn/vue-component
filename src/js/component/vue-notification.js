(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueNotification = definition(context.Vue, context.VueUtil);
    delete context.VueNotification;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueNotification = {
    template: '<transition :name="isLeft ? \'notify-left\' : isTop ? \'notify-top\' : isBottom ? \'notify-bottom\' : isCenter? \'notify-center\' : \'notify-right\'" @after-leave="doDestroy"><div :class="[\'vue-notification\', {\'vue-notification-translateX\':centerX, \'vue-notification-translateY\':centerY, \'vue-notification-center\':centerX&&centerY},customClass]" v-show="visible" :style="{top: top ? top + \'px\' : \'auto\', bottom: bottom ? bottom + \'px\' : \'auto\', left: left ? left + \'px\' : \'auto\', right: right ? right + \'px\' : \'auto\'}"><i :class="[\'vue-notification__icon\', typeClass, iconClass]" v-if="type || iconClass"></i><div :class="[\'vue-notification__group\', {\'content_margin\':centerX&&centerY&&(type || iconClass)}]"><h2 class="vue-notification__title" v-text="title" v-if="showTitle"></h2><div class="vue-notification__content" v-if="showMessage" :style="{\'margin-top\':showTitle?\'10px\':\'\'}"><slot>{{message}}</slot></div><div class="vue-notification__closeBtn vue-icon-close" @click="close" v-if="duration===0 || showClose"></div></div></div></transition>',
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
        position: VueUtil.getSystemInfo().device == 'Mobile'? 'center-center':'top-right',
        isLeft: false,
        isTop: false,
        isBottom: false,
        isCenter: false,
        showClose: false
      };
    },
    computed: {
      showTitle: function() {
        if (VueUtil.trim(this.title) === '') {
          return false;
        }
        return true;
      },
      showMessage: function() {
        if (VueUtil.trim(this.message) === '' && !this.$slots.default) {
          return false;
        }
        return true;
      },
      typeClass: function() {
        var typeMap = {
          success: 'success',
          info: 'information',
          warning: 'warning',
          error: 'error'
        };
        return this.type && typeMap[this.type.toLowerCase()] ? 'vue-icon-' + typeMap[this.type.toLowerCase()] : '';
      }
    },
    methods: {
      close: function() {
        this.closed = true;
        if (VueUtil.isFunction(this.onClose)) {
          this.onClose();
        }
      },
      doDestroy: function() {
        this.$destroy();
      }
    },
    mounted: function() {
      if (this.duration > 0) {
        VueUtil.debounce(this.duration, function() {
          !this.closed && this.close();
        }).call(this);
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
  var insertIns = function(insertInstances, instance, position) {
    var distHeight = 8;
    instance[position] = distHeight;
    if (!VueUtil.config.notifyStack) {
      VueUtil.loop(insertInstances, function(insertInstance) {
        distHeight += insertInstance.dom.offsetHeight + 8;
      });
      instance[position] = distHeight;
    }
    insertInstances.push(instance);
  };
  var removeIns = function(removeInstances, instance, position) {
    var removedHeight = instance.dom.offsetHeight + 8;
    var removeIndex = removeInstances.indexOf(instance);
    removeInstances.splice(removeIndex, 1);
    if (!VueUtil.config.notifyStack) {
      VueUtil.loop(removeInstances, function(removeInstance, index) {
        if (index < removeIndex) return;
        removeInstance.dom.style[position] = parseInt(removeInstance.dom.style[position], 10) - removedHeight + 'px';
      });
    }
  };
  var getinsPos = function(instance) {
    var instancePosition = instance.position.split('-');
    var positionX = instancePosition[1];
    var positionY = instancePosition[0];
    var insPos = {};
    insPos.isLeft = (positionX.indexOf('left') !== -1);
    insPos.isCenterX = (positionX.indexOf('center') !== -1);
    insPos.isRight = (positionX.indexOf('right') !== -1);
    insPos.isTop = (positionY.indexOf('top') !== -1);
    insPos.isCenterY = (positionY.indexOf('center') !== -1);
    insPos.isBottom = (positionY.indexOf('bottom') !== -1);
    return insPos;
  };
  var Notification = function(options) {
    options = options || {};
    var userOnClose = options.onClose;
    var id = 'notification-' + VueUtil.createUuid();
    options.onClose = function() {
      Notification.close(id, userOnClose);
    };
    var instance = new NotificationConstructor({
      data: options
    });
    if (VueUtil.isVNode(options.message)) {
      instance.$slots.default = [options.message];
      options.message = '';
    }
    instance.id = id;
    instance.vm = instance.$mount();
    instance.dom = instance.vm.$el;
    instance.dom.style.zIndex = VueUtil.nextZIndex();
    var insPos = getinsPos(instance);
    if ((!insPos.isLeft && !insPos.isCenterX && !insPos.isRight) || (!insPos.isTop && !insPos.isCenterY && !insPos.isBottom)) {
      instance.$destroy();
      return;
    }
    instance.isLeft = false;
    instance.isBottom = false;
    instance.top = false;
    instance.isCenter = false;
    if (insPos.isCenterY) {
      instance.centerY = true;
    }
    if (insPos.isLeft) {
      instance.left = 8;
      instance.isLeft = true;
    }
    if (insPos.isCenterX) {
      instance.centerX = true;
      instance.isCenter = true;
      insPos.isBottom && (instance.isBottom = true);
      insPos.isTop && (instance.isTop = true);
    }
    if (insPos.isRight) {
      instance.right = 8;
    }
    if (insPos.isBottom) {
      var position = 'bottom';
      insPos.isLeft && insertIns(leftBottomInstances, instance, position);
      insPos.isCenterX && insertIns(centerBottomInstances, instance, position);
      insPos.isRight && insertIns(rightBottomInstances, instance, position);
    }
    if (insPos.isTop) {
      var position = 'top';
      insPos.isLeft && insertIns(leftTopInstances, instance, position);
      insPos.isCenterX && insertIns(centerTopInstances, instance, position);
      insPos.isRight && insertIns(rightTopInstances, instance, position);
    }
    instance.dom.style.display = '';
    instance.dom.style.opacity = 0;
    instances.push(instance);
    document.body.appendChild(instance.vm.$el);
    Vue.nextTick(function() {
      instance.vm.visible = true;
      instance.dom.style.opacity = 1;
    });
  };
  VueUtil.loop(['success', 'warning', 'info', 'error'], function(type) {
    Notification[type] = function(options) {
      options.type = type;
      Notification(options);
    };
  });
  Notification.close = function(id, userOnClose) {
    VueUtil.loop(instances, function(instance, i) {
      if (id === instance.id) {
        if (VueUtil.isFunction(userOnClose)) {
          userOnClose(instance);
        }
        var insPos = getinsPos(instance);
        if (insPos.isBottom) {
          var position = 'bottom';
          insPos.isLeft && removeIns(leftBottomInstances, instance, position);
          insPos.isCenterX && removeIns(centerBottomInstances, instance, position);
          insPos.isRight && removeIns(rightBottomInstances, instance, position);
        }
        if (insPos.isTop) {
          var position = 'top';
          insPos.isLeft && removeIns(leftTopInstances, instance, position);
          insPos.isCenterX && removeIns(centerTopInstances, instance, position);
          insPos.isRight && removeIns(rightTopInstances, instance, position);
        }
        instance.vm.visible = false;
        instances.splice(i, 1);
        return false;
      }
    });
  };
  Vue.prototype.$notify = Notification;
  Vue.notify = Notification;
});
