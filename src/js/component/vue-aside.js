(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePopup', 'VueUtil'], definition);
  } else {
    context.VueAside = definition(context.Vue, context.VuePopup, context.VueUtil);
    delete context.VueAside;
  }
})(this, function(Vue, VuePopup, VueUtil) {
  'use strict';
  var VueAside = {
    template: '<div v-show="visibleaside" :class="[{\'vue-aside-outter\': true, \'vue-aside__static\':relative}]"><div v-show="visibleaside" :class="[\'vue-aside__wrapper\', {\'vue-aside__absolute\':relative}, {\'is-cleanness\': cleannessModal}]" @click.self="handleWrapperClick"></div><transition :name="transitionName"><div v-show="visibleaside" :class="[\'vue-aside\', {\'vue-aside__absolute\':relative}, sizeClass, customClass, positionClass]" ref="aside"><div class="vue-aside__header"><span class="vue-aside__title" v-if="showTitle && !$slots.header">{{title}}</span><slot name="header"></slot><div v-if="showClose" class="vue-aside__headerbtn"><i class="vue-aside__close vue-icon-close" @click=\'handleClose\'></i></div></div><div class="vue-aside__body"><slot></slot></div><div class="vue-aside__footer" v-if="$slots.footer"><slot name="footer"></slot></div></div></transition></div>',
    name: 'VueAside',
    mixins: [VuePopup],
    data: function() {
      return {
        visibleaside: false
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
      position: {
        type: String,
        default: 'right'
      },
      relative: Boolean,
      transition: {
        type: Boolean,
        default: true
      },
      customClass: {
        type: String,
        default: ''
      },
      cleannessModal: Boolean,
      beforeClose: Function
    },
    watch: {
      visibleaside: function(val) {
        if (val) {
          this.opened = true;
          this.$emit('open');
          VueUtil.on(this.$el, 'scroll', this.updatePopper);
          var refsAside = this.$refs.aside;
          this.$nextTick(function() {
            refsAside.scrollTop = 0;
          });
        } else {
          this.opened = false;
          VueUtil.off(this.$el, 'scroll', this.updatePopper);
          this.$emit('close');
        }
      },
      visible: function(val) {
        if (val) {
          this.visibleaside = val;
        } else {
          if (VueUtil.isFunction(this.beforeClose)) {
            var self = this;
            var done = function(resolve) {
              if (!VueUtil.isDef(resolve)) resolve = true;
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
            this.visibleaside = val;
          }
        }
      }
    },
    computed: {
      showTitle: function() {
        return VueUtil.trim(this.title) === '' ? false : true;
      },
      sizeClass: function() {
        return 'vue-aside--' + this.size;
      },
      positionClass: function() {
        var position = this.position;
        if (['left','right','top','bottom'].indexOf(position) === -1) {
          position = 'right';
        }
        return 'vue-aside-' + position;
      },
      transitionName: function() {
        if (!this.transition) return '';
        var position = this.position;
        if (['left','right','top','bottom'].indexOf(position) === -1) {
          position = 'right';
        }
        return 'aside-' + position;
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
