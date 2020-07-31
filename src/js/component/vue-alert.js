(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueAlert = definition(context.Vue);
    delete context.VueAlert;
  }
})(this, function(Vue) {
  'use strict';
  var VueAlert = {
    template: '<div :class="[\'vue-alert\', typeClass]" v-if="visible"><i :class="[\'vue-alert__icon\', iconClass, \'is-big\']" v-if="showIcon"></i><div class="vue-alert__content"><span class="vue-alert__title is-bold" v-if="title">{{title}}</span><div class="vue-alert__description"><slot></slot></div><i :class="[\'vue-alert__closebtn\', {\'is-customed\': closeText !== \'\', \'vue-icon-close\': closeText === \'\'}]" v-if="closable" @click="close()">{{closeText}}</i></div></div>',
    name: 'VueAlert',
    props: {
      title: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'info'
      },
      closable: {
        type: Boolean,
        default: true
      },
      closeText: {
        type: String,
        default: ''
      },
      showIcon: Boolean,
      dark: Boolean
    },
    data: function() {
      return {
        visible: true
      };
    },
    methods: {
      close: function() {
        this.visible = false;
        this.$emit('close');
      }
    },
    computed: {
      typeClass: function() {
        if (this.dark) {
          return 'vue-alert--' + this.type + '-dark';
        }
        return 'vue-alert--' + this.type;
      },
      iconClass: function() {
        var TYPE_CLASSES_MAP = {
          'success': 'vue-icon-success',
          'warning': 'vue-icon-warning',
          'error': 'vue-icon-error'
        };
        return TYPE_CLASSES_MAP[this.type] || 'vue-icon-information';
      }
    }
  };
  Vue.component(VueAlert.name, VueAlert);
});
