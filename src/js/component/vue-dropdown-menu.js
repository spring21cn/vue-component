(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePopper'], definition);
  } else {
    context.VueDropdownMenu = definition(context.Vue, context.VuePopper);
    delete context.VueDropdownMenu;
  }
})(this, function(Vue, VuePopper) {
  'use strict';
  var VueDropdownMenu = {
    template: '<transition @after-leave="destroyPopper"><div class="vue-dropdown-menu" v-show="showPopper"><ul class="vue-dropdown-menu__view"><slot></slot></ul></div></transition>',
    name: 'VueDropdownMenu',
    mixins: [VuePopper],
    created: function() {
      var self = this;
      self.$on('updatePopper', self.updatePopper);
      self.$on('visible', function(val) {
        self.showPopper = val;
      });
    },
    mounted: function() {
      this.$parent.popperElm = this.popperElm = this.$el;
      this.referenceElm = this.$parent.$el;
    },
    watch: {
      '$parent.menuAlign': {
        immediate: true,
        handler: function(val) {
          this.currentPlacement = 'bottom-' + val;
        }
      }
    }
  };
  Vue.component(VueDropdownMenu.name, VueDropdownMenu);
});
