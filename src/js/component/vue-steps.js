(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueSteps = definition(context.Vue, context.VueUtil);
    delete context.VueSteps;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueSteps = {
    template: '<div :class="[\'vue-steps\', \'is-\' + direction, center ? \'is-center\' : \'\']"><slot></slot></div>',
    name: 'VueSteps',
    props: {
      space: [Number, String],
      active: Number,
      direction: {
        type: String,
        default: 'horizontal'
      },
      alignCenter: Boolean,
      center: Boolean,
      finishStatus: {
        type: String,
        default: 'finish'
      },
      processStatus: {
        type: String,
        default: 'process'
      }
    },
    data: function() {
      return {
        steps: [],
        stepOffset: 0
      };
    },
    watch: {
      active: function(newVal, oldVal) {
        this.$emit('change', newVal, oldVal);
      },
      steps: function(steps) {
        var self = this;
        VueUtil.loop(steps, function(child, index) {
          child.index = index;
        });
        if (self.center) {
          var len = steps.length;
          self.$nextTick(function() {
            self.stepOffset = steps[len - 1].$el.getBoundingClientRect().width / (len - 1);
          });
        }
      }
    }
  };
  Vue.component(VueSteps.name, VueSteps);
});
