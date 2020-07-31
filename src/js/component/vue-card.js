(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueCard = definition(context.Vue);
    delete context.VueCard;
  }
})(this, function(Vue) {
  'use strict';
  var VueCard = {
    template: '<div  :class="[shadow ? \'is-\' + shadow + \'-shadow\' : \'is-hover-shadow\', \'vue-card\']"><div class="vue-card__header" v-if="$slots.header || header"><slot name="header">{{header}}</slot></div><div class="vue-card__body" :style="bodyStyle"><slot></slot></div></div>',
    name: 'VueCard',
    props: {
      header: {},
      bodyStyle: {},
      shadow: String
    }
  };
  Vue.component(VueCard.name, VueCard);
});
