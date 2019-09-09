(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueAdaptiveGroup = definition(context.Vue, context.VueUtil);
    delete context.VueAdaptiveGroup;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueAdaptiveGroup = {
    template: '<div class="vue-adaptive-group"><div v-if="adaptiveType" :class="[customClass, liClass]"><slot></slot><slot v-for="index in slotLen" :name="\'li\' + index"></slot></div><div v-else><slot></slot><vue-dropdown trigger="click" :class="[customClass]"><vue-button :icon="iconClass" type="text" style="transform: rotate3d(0,0,1,-90deg);"></vue-button><vue-dropdown-menu slot="dropdown" :class="[liClass]"><vue-dropdown-item v-for="index in slotLen" :key="index"><slot :name="\'li\' + index"></slot></vue-dropdown-item></vue-dropdown-menu></vue-dropdown></div></div>',
    name: 'VueAdaptiveGroup',
    props: {
      size: {
        type: String,
        default: 'md'
      },
      customClass: String,
      liClass: String,
      iconClass: {
        type: String,
        default: 'vue-icon-more'
      }
    },
    data: function() {
      return {
        adaptiveType: true
      };
    },
    methods: {
      resetType: function() {
        var size = this.size;
        var sizeMap = Object.create(null);
        sizeMap.lg = 1200;
        sizeMap.md = 992;
        sizeMap.sm = 768;
        var sizeValue = sizeMap[size];
        if (!VueUtil.isDef(sizeValue)) {
          size = 'md';
          sizeValue = sizeMap[size];
        }
        this.adaptiveType = sizeValue <= innerWidth;
      }
    },
    computed: {
      slotLen: function() {
        var soltLiLen = 0;
        VueUtil.ownPropertyLoop(this.$slots, function(prop) {
          var propAry = prop.split('li');
          if (propAry[0] === '' && VueUtil.isNumber(propAry[1]*1))
            soltLiLen++;
        });
        return soltLiLen;
      }
    },
    mounted: function() {
      VueUtil.addResizeListener(this.resetType);
    },
    beforeDestroy: function() {
      VueUtil.removeResizeListener(this.resetType);
    }
  };
  Vue.component(VueAdaptiveGroup.name, VueAdaptiveGroup);
});
