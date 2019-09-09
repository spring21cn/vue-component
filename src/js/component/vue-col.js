(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueCol = definition(context.Vue, context.VueUtil);
    delete context.VueCol;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueCol = {
    name: 'VueCol',
    props: {
      span: {
        type: Number,
        default: 24
      },
      offset: Number,
      pull: Number,
      push: Number,
      xs: [Number, Object],
      sm: [Number, Object],
      md: [Number, Object],
      lg: [Number, Object]
    },
    computed: {
      gutter: function() {
        return this.$parent.gutter;
      },
      style: function() {
        var ret = {};
        if (this.gutter) {
          ret.paddingLeft = this.gutter / 2 + 'px';
          ret.paddingRight = ret.paddingLeft;
        }
        return ret;
      }
    },
    render: function(createElement) {
      var self = this;
      var classList = [];
      VueUtil.loop(['span', 'offset', 'pull', 'push'], function(prop) {
        if (VueUtil.isDef(self[prop])) {
          classList.push(prop !== 'span' ? 'vue-col-' + prop + '-' + self[prop] : 'vue-col-' + self[prop]);
        }
      });
      VueUtil.loop(['xs', 'sm', 'md', 'lg'], function(size) {
        if (VueUtil.isNumber(self[size])) {
          classList.push('vue-col-' + size + '-' + self[size]);
        } else if (VueUtil.isObject(self[size])) {
          var props = self[size];
          VueUtil.ownPropertyLoop(props, function(prop) {
            classList.push(prop !== 'span' ? 'vue-col-' + size + '-' + prop + '-' + props[prop] : 'vue-col-' + size + '-' + props[prop]);
          });
        }
      });
      return createElement('div', {
        class: ['vue-col', classList],
        style: self.style
      }, [this.$slots.default]);
    }
  };
  Vue.component(VueCol.name, VueCol);
});
