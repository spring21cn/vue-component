(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    definition(context.Vue);
  }
})(this, function(Vue) {
  'use strict';
  var VueSvgIcon = {
    name: 'VueSvgIcon',
    template: '  <div v-if="isExternal" :style="styleExternalIcon" class="vue-svg-external-icon vue-svg-icon" v-on="$listeners" />\
    <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">\
      <use :xlink:href="iconName" />\
    </svg>',
    props: {
      iconClass: {
        type: String,
        required: true
      },
      className: {
        type: String,
        default: ''
      },
      customClass: {
        type: String,
        default: ''
      }
    },
    computed: {
      isExternal: function() {
        return this.iconClass.indexOf('.svg') > -1;
      },
      iconName: function() {
        return '#icon-' + this.iconClass;
      },
      svgClass: function() {
        if (this.customClass) {
          return this.customClass;
        }

        if (this.className) {
          return 'vue-svg-icon ' + this.className;
        } else {
          return 'vue-svg-icon';
        }
      },
      styleExternalIcon: function() {
        return {
          mask: 'url(' + this.iconClass + ') no-repeat 50% 50%',
          '-webkit-mask': 'url(' + this.iconClass + ') no-repeat 50% 50%'
        };
      }
    }
  };
  Vue.component(VueSvgIcon.name, VueSvgIcon);
});
