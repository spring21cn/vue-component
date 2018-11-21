(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueTag = definition(context.Vue);
    delete context.VueTag;
  }
})(this, function(Vue) {
  'use strict';
  var VueTag = {
    template: '<div :class="[\'vue-tag\', type ? \'vue-tag--\' + type : \'\', {\'is-hit\': hit}]" :style="{width: closable ? width+32+\'px\' : width+13+\'px\'}"><span :style="{width: width+\'px\', float: \'left\'}" ref="span"><slot></slot></span><i class="vue-tag__close vue-icon-close" v-if="closable" @click="handleClose"></i></div>',
    name: 'VueTag',
    props: {
      text: String,
      closable: Boolean,
      type: String,
      hit: Boolean,
      width: Number
    },
    methods: {
      handleClose: function(event) {
        this.$emit('close', event);
      }
    },
    mounted: function() {
      var el = this.$el;
      var spanNode = this.$refs.span;
      if (this.width && this.width < spanNode.scrollWidth) {
        el.setAttribute('title', el.innerText);
      }
    }
  };
  Vue.component(VueTag.name, VueTag);
});
