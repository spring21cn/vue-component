(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueNote = definition(context.Vue);
    delete context.VueNote;
  }
})(this, function(Vue) {
  'use strict';
  var VueNote = {
    template: '<div :class="[\'vue-note\', typeClass, typeBox]"><div class="vue-note__content"><span class="vue-note__title is-bold" v-if="title">{{title}}</span><div class="vue-note__description"><slot></slot></div></div></div>',
    name: 'VueNote',
    props: {
      title: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'info'
      },
      plain: Boolean
    },
    computed: {
      typeClass: function() {
        return 'vue-note--' + this.type;
      },
      typeBox: function() {
        if (this.plain) {
          return 'vue-note--plain';
        }
      }
    }
  };
  Vue.component(VueNote.name, VueNote);
});
