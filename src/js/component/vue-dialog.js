(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePopup', 'VueUtil'], definition);
  } else {
    context.VueDialog = definition(context.Vue, context.VuePopup, context.VueUtil);
    delete context.VueDialog;
  }
})(this, function(Vue, VuePopup, VueUtil) {
  'use strict';
  var VueDialog = {
    template: '<div><div :class="[\'vue-dialog__wrapper\', {\'is-cleanness\': cleannessModal}]" v-show="visibledialog&&size!==\'full\'" @click.self="handleWrapperClick"></div><transition name="dialog-fade"><div v-draggable v-show="visibledialog" :draggable-cancel-selector="draggableCancelSelector" :class="[\'vue-dialog\', sizeClass, customClass]" ref="dialog" :style="style"><div class="vue-dialog__header"><span class="vue-dialog__title" v-if="showTitle && !$slots.header">{{title}}</span><slot name="header"></slot><div class="vue-dialog__headerbtn" v-if="showClose"><i class="vue-dialog__close vue-icon-close" @click=\'handleClose\'></i></div></div><div class="vue-dialog__body"><slot></slot></div><div class="vue-dialog__footer" v-if="$slots.footer"><slot name="footer"></slot></div></div></transition></div>',
    name: 'VueDialog',
    mixins: [VuePopup],
    data: function() {
      return {
        visibledialog: false
      };
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      closeOnClickModal: Boolean,
      closeOnPressEscape: {
        type: Boolean,
        default: true
      },
      showClose: Boolean,
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
      cleannessModal: Boolean,
      beforeClose: Function,
      draggable: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      visibledialog: function(val) {
        if (val) {
          this.opened = true;
          this.$emit('open');
          VueUtil.on(this.$el, 'scroll', this.updatePopper);
          var refsDialog = this.$refs.dialog;
          this.$nextTick(function() {
            refsDialog.scrollTop = 0;
          });
        } else {
          this.opened = false;
          VueUtil.off(this.$el, 'scroll', this.updatePopper);
          this.$emit('close');
        }
      },
      visible: function(val) {
        if (val) {
          this.visibledialog = val;
        } else {
          if (VueUtil.isFunction(this.beforeClose)) {
            var self = this;
            var done = function(resolve) {
              if (!VueUtil.isDef(resolve)) resolve = true;
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
            this.visibledialog = val;
          }
        }
      }
    },
    computed: {
      showTitle: function() {
        return VueUtil.trim(this.title) === '' ? false : true;
      },
      sizeClass: function() {
        return 'vue-dialog--' + this.size;
      },
      style: function() {
        return this.size === 'full' ? {} : {'top': this.top};
      },
      draggableCancelSelector: function() {
        return (this.size === 'full' || this.draggable === false) ? '.vue-dialog' : '.vue-dialog__headerbtn, .vue-dialog__body, .vue-dialog__footer';
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
