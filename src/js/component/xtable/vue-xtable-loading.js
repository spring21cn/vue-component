(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    context.VueXtableLoading = definition(context.tools);
  }
})(this, function(tools) {
  var VueXtableLoading = {
    name: 'VueXtableLoading',
    props: {
      visible: Boolean
    },
    render: function render(h) {
      return h('div', {
        class: 'vue-xtable-table--loading',
        style: {
          display: this.visible ? 'block' : 'none'
        }
      }, [h('div', {
        class: 'vue-xtable-table--spinner'
      })]);
    }
  };
  return VueXtableLoading;
});