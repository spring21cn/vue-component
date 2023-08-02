(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VuePopup'], definition);
  } else {
    context.VueMessageBox = definition(context.Vue, context.VueUtil, context.VuePopup);
    delete context.VueMessageBox;
  }
})(this, function(Vue, VueUtil, VuePopup) {
  'use strict';
  var VueMessageBox = {
    template: '<div><div class="vue-message-box__wrapper" v-show="visible"></div><transition name="msgbox-fade" @after-leave="doDestroy"><div :class="[\'vue-message-box\', customClass]" v-show="visible"><div class="vue-message-box__header" v-if="title !== null"><div class="vue-message-box__title">{{title || $t(\'vue.messagebox.title\')}}</div></div><div class="vue-message-box__content" v-if="message !== \'\'"><div :class="[\'vue-message-box__status\', typeClass]"></div><div class="vue-message-box__message" :style="{\'margin-left\': typeClass ? \'50px\' : \'0\'}"><slot><p>{{message}}</p></slot></div></div><div class="vue-message-box__btns">'
    +'<vue-button :loading="confirmButtonLoading" ref="confirm" :class="[confirmButtonClasses]" @click.native="handleAction(\'confirm\')" v-if="reverseButton">{{confirmButtonText || $t(\'vue.messagebox.confirm\')}}</vue-button>'
    +'<vue-button :loading="cancelButtonLoading"  ref="cancel"  :class="[cancelButtonClasses]"  @click.native="handleAction(\'cancel\')" v-if="showCancelButton">{{cancelButtonText || $t(\'vue.messagebox.cancel\')}}</vue-button>'
    +'<vue-button :loading="confirmButtonLoading" ref="confirm" :class="[confirmButtonClasses]" @click.native="handleAction(\'confirm\')"  v-if="!reverseButton">{{confirmButtonText || $t(\'vue.messagebox.confirm\')}}</vue-button>'
    +'</div></div></transition></div>',
    mixins: [VuePopup],
    computed: {
      typeClass: function() {
        var typeMap = {
          success: 'success',
          info: 'information',
          warning: 'warning',
          error: 'error'
        };
        return this.type && typeMap[this.type.toLowerCase()] ? 'vue-icon-' + typeMap[this.type.toLowerCase()] : '';
      },
      confirmButtonClasses: function() {
        return 'vue-button--primary ' + this.confirmButtonClass;
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
        self.opened = false;
        if (self.action) self.callback(self.action, self);

        this.$nextTick(function() {
          self.$destroy();
          setTimeout(function() {
            if(self.$el) {
              self.focusTriggerOnClose && self.triggerElm && self.triggerElm.focus();
              document.body.removeChild(self.$el);
            }
          }, 200);
        });
      },
      handleAction: function(action) {
        this.action = action;
        if (VueUtil.isFunction(this.beforeClose)) {
          this.close = this.getSafeClose();
          this.beforeClose(action, this, this.close);
        } else {
          this.doClose();
        }
      },
      doDestroy: function() {
        this.$destroy();
      }
    },
    watch: {
      visible: function(val) {
        var self = this;
        if (val) {
          self.uid++;
          self.$nextTick(function() {
            if (this.focusCancel === true) {
              self.$refs.cancel && self.$refs.cancel.$el.focus();
            } else {
              self.$refs.confirm.$el.focus();
            }
          });
        }
      }
    },
    data: function() {
      return {
        uid: 1,
        title: null,
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
        beforeClose: null,
        focusCancel: false,
        reverseButton: false,
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
    var propsData;
    if (msgQueue.length > 0) {
      propsData = {
        trapFocus: msgQueue[0].options.trapFocus,
        focusTriggerOnClose: msgQueue[0].options.focusTriggerOnClose,
      };
    }
    instance = new MessageBoxConstructor({
      i18n: Vue.i18n,
      el: document.createElement('div'),
      propsData: propsData
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
        VueUtil.ownPropertyLoop(options, function(prop) {
          instance[prop] = options[prop];
        });
        if (!VueUtil.isDef(options.callback)) {
          instance.callback = defaultCallback;
        }
        var oldCb = instance.callback;
        instance.callback = function(action, instance) {
          oldCb(action, instance);
          showNextMsg();
        };
        if (VueUtil.isVNode(instance.message)) {
          instance.$slots.default = [instance.message];
          instance.message = null;
        }
        document.body.appendChild(instance.$el);
        Vue.nextTick(function() {
          instance.visible = true;
        });
      }
    }
  };
  var MessageBox = function(options) {
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
