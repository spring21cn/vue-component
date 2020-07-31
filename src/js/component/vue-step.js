(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueStep = definition(context.Vue, context.VueUtil);
    delete context.VueStep;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueStep = {
    template: '<div :style="[style, isLast ? \'\' : {marginRight: - $parent.stepOffset + \'px\'}]" :class="[\'vue-step\', \'is-\' + $parent.direction]"><div :class="[\'vue-step__head\', \'is-\' + currentStatus, {\'is-text\': !icon}]"><div :style="isLast ? \'\' : {marginRight: $parent.stepOffset + \'px\'}" :class="[\'vue-step__line\', \'is-\' + $parent.direction, {\'is-icon\': icon}]"><i class="vue-step__line-inner" :style="lineStyle"></i></div><span class="vue-step__icon"><slot v-if="currentStatus !== \'success\' && currentStatus !== \'error\'" name="icon"><i v-if="icon" :class="icon"></i><div v-else>{{index + 1}}</div></slot><i v-else :class="[\'vue-icon-\' + (currentStatus === \'success\' ? \'check\' : \'close\')]"></i></span></div><div class="vue-step__main" :style="{marginLeft: mainOffset}"><div ref="title" :class="[\'vue-step__title\', \'is-\' + currentStatus]"><slot name="title">{{title}}</slot></div><div :class="[\'vue-step__description\', \'is-\' + currentStatus]"><slot></slot></div></div></div>',
    name: 'VueStep',
    props: {
      title: String,
      icon: String,
      status: String
    },
    data: function() {
      return {
        index: -1,
        lineStyle: {},
        mainOffset: 0,
        internalStatus: ''
      };
    },
    beforeCreate: function() {
      this.$parent.steps.push(this);
    },
    computed: {
      currentStatus: function() {
        return this.status || this.internalStatus;
      },
      isLast: function() {
        var parent = this.$parent;
        return parent.steps[parent.steps.length - 1] === this;
      },
      style: function() {
        var parent = this.$parent;
        var isCenter = parent.center;
        var len = parent.steps.length;
        if (isCenter && this.isLast) {
          return {};
        }
        var space = (VueUtil.isNumber(parent.space) ? parent.space + 'px' : parent.space ? parent.space : 100 / (isCenter ? len - 1 : len) + '%');
        if (parent.direction === 'horizontal') {
          return {
            width: space
          };
        } else {
          if (!this.isLast) {
            return {
              height: space
            };
          }
        }
      }
    },
    methods: {
      updateStatus: function(val) {
        var prevChild = this.$parent.$children[this.index - 1];
        if (val > this.index) {
          this.internalStatus = this.$parent.finishStatus;
        } else if (val === this.index) {
          this.internalStatus = this.$parent.processStatus;
        } else {
          this.internalStatus = 'wait';
        }
        if (prevChild)
          prevChild.calcProgress(this.internalStatus);
      },
      calcProgress: function(status) {
        var step = 100;
        var style = {};
        style.transitionDelay = 150 * this.index + 'ms';
        if (status === this.$parent.processStatus) {
          step = 50;
        } else if (status === 'wait') {
          step = 0;
          style.transitionDelay = (-150 * this.index) + 'ms';
        }
        style.borderWidth = step ? '1px' : 0;
        this.$parent.direction === 'vertical' ? style.height = step + '%' : style.width = step + '%';
        this.lineStyle = style;
      }
    },
    mounted: function() {
      var self = this;
      var parent = self.$parent;
      if (parent.direction === 'horizontal') {
        if (parent.alignCenter) {
          self.mainOffset = -self.$refs.title.getBoundingClientRect().width / 2 + 16 + 'px';
        }
      }
      var unwatch = self.$watch('index', function(val) {
        self.$watch('$parent.active', self.updateStatus, {
          immediate: true
        });
        unwatch();
      });

      self.$watch('$parent.alignCenter', function(value) {
        if(value) {
            self.mainOffset = -self.$refs.title.getBoundingClientRect().width / 2 + 16 + 'px';
        } else {
            self.mainOffset = 0;
        }
      });
    }
  };
  Vue.component(VueStep.name, VueStep);
});
