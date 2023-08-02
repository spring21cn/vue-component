(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueCollapseItem = definition(context.Vue, context.VueUtil);
    delete context.VueCollapseItem;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueCollapseItem = {
    template: '<div :class="[\'vue-collapse-item\', {\'is-active\': isActive}]"><div :class="[\'vue-collapse-item__header\', {\'header-expand\': headerExpand}]" @click="handleHeaderClick"><i class="vue-collapse-item__header__arrow vue-icon-arrow-right" @click="handleIconClick" v-show="expandOnClick"></i><slot name="title">{{title}}</slot></div><collapse-transition><div class="vue-collapse-item__wrap" v-show="noHide || isActive" :style="itemStyle"><div class="vue-collapse-item__content"><slot v-if="!initAfterOpen || firstActive"></slot></div></div></collapse-transition></div>',
    name: 'VueCollapseItem',
    mixins: [VueUtil.component.emitter],
    components: {
      CollapseTransition: VueUtil.component.collapseTransition
    },
    data: function() {
      return {
        contentWrapStyle: {
          height: 'auto',
          display: 'block'
        },
        contentHeight: 0,
        firstActive: false,
      };
    },
    props: {
      title: String,
      expandOnClick: {
        type: Boolean,
        default: true
      },
      name: {
        type: [String, Number],
        default: function() {
          return this._uid;
        }
      }
    },
    computed: {
      isActive: function() {
        return this.$parent.activeNames.indexOf(this.name) !== -1;
      },
      headerExpand: function() {
        return this.$parent.expandOnClickHeader;
      },
      noHide: function() {
        return this.$parent.noHide;
      },
      itemStyle: function() {
        if (this.noHide && !this.isActive) {
          return {
            position: 'absolute',
            top: '-100000px',
            visibility: 'hidden'
          };
        }

        return undefined;
      },
      initAfterOpen: function() {
        return this.$parent.initAfterOpen;
      },
    },
    watch: {
      isActive: [{
        immediate: true,
        handler: function(val) {
          this.$parent.$emit(val ? 'open' : 'close', this.$parent.activeNames, this.name);
          if (val) {
            this.firstActive = true;
          }
        }
      }, function(val) {
        this.$parent.$emit('state-change', this.$parent.activeNames, this.name, val ? 'open' : 'close');
      }]
    },
    methods: {
      handleIconClick: function() {
        if (!this.headerExpand && this.expandOnClick) {
          this.dispatch('VueCollapse', 'item-click', this);
        }
      },
      handleHeaderClick: function() {
        if (this.headerExpand && this.expandOnClick) {
          this.dispatch('VueCollapse', 'item-click', this);
        }
      },
      collapseAfterEnter: function() {
        this.$parent.$emit('change', this.$parent.activeNames, this.name, 'enter');
      },
      collapseAfterLeave: function() {
        this.$parent.$emit('change', this.$parent.activeNames, this.name, 'leave');
      }
    }
  };
  Vue.component(VueCollapseItem.name, VueCollapseItem);
});
