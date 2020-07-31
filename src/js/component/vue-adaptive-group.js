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
    template: '<div class="vue-adaptive-group">\
                <div v-if="adaptiveType" :class="[customClass, liClass]"><slot></slot><slot v-for="index in slotLen" :name="\'li\' + index"></slot></div>\
                <div v-else><slot></slot>\
                  <vue-dropdown trigger="click" :class="[customClass]">\
                    <vue-button :icon="iconClass" type="text" style="transform: rotate3d(0,0,1,-90deg);"></vue-button>\
                    <vue-dropdown-menu slot="dropdown" :class="[{\'default_dropdown_menu_view\':isMobile},liClass]">\
                      <vue-dropdown-item v-for="index in slotLen" :key="index"><slot :name="\'li\' + index"></slot></vue-dropdown-item>\
                      <span v-if="isMobile" class="dropdown_menu_top"></span>\
                    </vue-dropdown-menu>\
                  </vue-dropdown></div></div>',
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
      },
      isForceActive:{
        type:Boolean,
        default: false
      }
    },
    data: function() {
      return {
        adaptiveType: true,
        soltLiLen: 0,
        isMobile: VueUtil.getSystemInfo().device == 'Mobile' && VueUtil.getSystemInfo().isLoadMobileJs ? true : false,
      };
    },
    methods: {
      resetType: function() {
        if(this.isForceActive){
          this.adaptiveType = false;
        }else{
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
        this.adaptiveType = sizeValue <= innerWidth;
      },
      refresh: function() {
        this.soltLiLen = this.soltLiLen + 1;
      }
    },
    computed: {
      slotLen: function() {
        this.soltLiLen = 0;
        var soltLiLen = this.soltLiLen;
        VueUtil.ownPropertyLoop(this.$slots, function(prop) {
          var propAry = prop.split('li');
          if (propAry[0] === '' && VueUtil.isNumber(propAry[1]*1))
            soltLiLen++;
        });
        return soltLiLen;
      },
    },
    mounted: function() {
      VueUtil.addResizeListener(this.$el, this.resetType);
    },
    beforeDestroy: function() {
      VueUtil.removeResizeListener(this.$el, this.resetType);
    }
  };
  Vue.component(VueAdaptiveGroup.name, VueAdaptiveGroup);
});
