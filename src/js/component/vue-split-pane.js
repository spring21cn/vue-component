(function (context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueSplitPane = definition(context.Vue);
    delete context.VueSplitPane;
  }
})(this, function (Vue) {
  'use strict';

  var VueSplitPane = {
    template: '<div class="vue-split-panes__pane vue-split-pane" @click="onPaneClick($event, _uid)" :style="style">\
    <slot/>\
  </div>',
    name: 'VueSplitPane',
    inject: ['requestUpdate', 'onPaneAdd', 'onPaneRemove', 'onPaneClick'],
    props: {
      size: {
        type: [Number, String],
        default: null
      },
      minSize: {
        type: [Number, String],
        default: 0
      },
      maxSize: {
        type: [Number, String],
        default: 100
      }
    },
    data: function() {
      return {
        style: {}
      };
    },
    mounted: function() {
      this.onPaneAdd(this);
    },
    beforeDestroy: function() {
      this.onPaneRemove(this);
    },
    methods: {
      // Called from the splitpanes component.
      update: function(style) {
        this.style = style;
      }
    },
    computed: {
      sizeNumber: function() {
        return this.size || this.size === 0 ? parseFloat(this.size) : null;
      },
      minSizeNumber: function() {
        return parseFloat(this.minSize);
      },
      maxSizeNumber: function() {
        return parseFloat(this.maxSize);
      }
    },
    watch: {
      sizeNumber: function(size) {
        this.requestUpdate({
          target: this,
          size: size
        });
      },
      minSizeNumber: function(min) {
        this.requestUpdate({
          target: this,
          min: min
        });
      },
      maxSizeNumber: function(max) {
        this.requestUpdate({
          target: this,
          max: max
        });
      }
    }
  };
  Vue.component(VueSplitPane.name, VueSplitPane);
});

