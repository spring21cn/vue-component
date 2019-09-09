(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueRow = definition(context.Vue);
    delete context.VueRow;
  }
})(this, function(Vue) {
  'use strict';
  var VueRow = {
    template: '<div :style="style" :class="[\'vue-row\', justify !== \'start\' ? \'is-justify-\' + justify : \'\', align !== \'top\' ? \'is-align-\' + align : \'\', {\'vue-row--flex\': type === \'flex\'}]"><slot></slot></div>',
    name: 'VueRow',
    props: {
      gutter: Number,
      type: String,
      justify: {
        type: String,
        default: 'start'
      },
      align: {
        type: String,
        default: 'top'
      }
    },
    computed: {
      style: function() {
        var ret = {};
        if (this.gutter) {
          ret.marginLeft = this.gutter / 2 + 'px';
          ret.marginRight = ret.marginLeft;
        }
        return ret;
      }
    }
  };
  Vue.component(VueRow.name, VueRow);
});
