(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueButton = definition(context.Vue);
    delete context.VueButton;
  }
})(this, function(Vue) {
  'use strict';
  var VueButton = {
    template: '<button @dblclick.stop :disabled="buttonDisabled || loading" @click="handleClick" :autofocus="autofocus" :tabindex="tabindex" :type="nativeType" :class="[\'vue-button\', type ? \'vue-button--\' + type : \'\', finalSize ? \'vue-button--\' + finalSize : \'\', {\'is-disabled\': buttonDisabled, \'is-loading\': loading, \'is-plain\': plain, \'is-circle\': circle}]"><i class="vue-icon-loading" v-if="loading"></i><i :class="icon" v-if="icon && !loading"></i><span v-if="$slots.default"><slot></slot></span></button>',
    name: 'VueButton',
    inject: {
      vueForm: {
        default: ''
      },
      vueFormItem: {
        default: ''
      },
    },
    props: {
      type: {
        type: String,
        default: 'default'
      },
      size: String,
      icon: {
        type: String,
        default: ''
      },
      nativeType: {
        type: String,
        default: 'button'
      },
      loading: Boolean,
      disabled: {
        type: Boolean,
        default: null
      },
      plain: Boolean,
      circle: Boolean,
      autofocus: Boolean,
      tabindex: Number
    },
    methods: {
      focus: function() {
        this.$el.focus();
      },
      handleClick: function(evt) {
        this.$emit('click', evt);
      }
    },
    computed: {
      buttonDisabled: function() {
        return this.disabled != undefined ? this.disabled : (this.vueForm || {}).disabled;
      },
      finalSize: function() {
        return this.size || (this.vueFormItem || {}).vueFormItemSize || (this.$VIY || {}).size;
      },
    }
  };
  Vue.component(VueButton.name, VueButton);
});
