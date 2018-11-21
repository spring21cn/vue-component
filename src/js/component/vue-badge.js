(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueBadge = definition(context.Vue, context.VueUtil);
    delete context.VueBadge;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueBadge = {
    template: '<div class="vue-badge"><slot></slot><sup v-show="!hidden && ( content || isDot )" v-text="content" :class="[\'vue-badge__content\', {\'is-fixed\': $slots.default, \'is-dot\': isDot }]"></sup></div>',
    name: 'VueBadge',
    props: {
      value: {},
      max: Number,
      isDot: Boolean,
      hidden: Boolean
    },
    computed: {
      content: function() {
        if (this.isDot) return;
        var value = this.value;
        var max = this.max;
        if (VueUtil.isNumber(value) && VueUtil.isNumber(max)) {
          return max < value ? max + '+' : value;
        }
        return value;
      }
    }
  };
  Vue.component(VueBadge.name, VueBadge);
});
