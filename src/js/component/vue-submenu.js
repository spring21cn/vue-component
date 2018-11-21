(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueSubmenu = definition(context.Vue, context.VueUtil);
    delete context.VueSubmenu;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueSubMenu = {
    template: '<li :class="{\'vue-submenu\': true, \'is-active\': active, \'is-opened\': opened}"><div class="vue-submenu__title" ref="submenu-title" :style="paddingStyle"><slot name="title"></slot><i :class="[\'vue-icon-arrow-down\', {\'vue-submenu__icon-arrow\': true}]"></i></div><template v-if="rootMenu.mode === \'horizontal\'"><ul class="vue-menu" v-show="opened"><slot></slot></ul></template><collapse-transition v-else><ul class="vue-menu" v-show="opened"><slot></slot></ul></collapse-transition></li>',
    name: 'VueSubmenu',
    mixins: [VueUtil.component.menumixin, VueUtil.component.emitter],
    components: {
      CollapseTransition: VueUtil.component.collapseTransition
    },
    props: {
      index: {
        type: String,
        required: true
      }
    },
    data: function() {
      return {
        items: {},
        submenus: {}
      };
    },
    computed: {
      opened: function() {
        return (this.rootMenu.openedMenus.indexOf(this.index) !== -1);
      },
      active: {
        cache: false,
        get: function() {
          var isActive = false;
          var submenus = this.submenus;
          var items = this.items;
          VueUtil.ownPropertyLoop(items, function(index) {
            if (items[index].active) {
              isActive = true;
            }
          });
          VueUtil.ownPropertyLoop(submenus, function(index) {
            if (submenus[index].active) {
              isActive = true;
            }
          });
          return isActive;
        }
      }
    },
    methods: {
      addItem: function(item) {
        this.items[item.index] = item;
      },
      removeItem: function(item) {
        delete this.items[item.index];
      },
      addSubmenu: function(item) {
        this.submenus[item.index] = item;
      },
      removeSubmenu: function(item) {
        delete this.submenus[item.index];
      },
      handleClick: function() {
        this.dispatch('VueMenu', 'submenu-click', this);
      },
      mouseToggle: VueUtil.debounce(300, function(val) {
        if (val) {
          this.rootMenu.openMenu(this.index, this.indexPath);
        } else {
          this.rootMenu.closeMenu(this.index, this.indexPath);
        }
      }),
      mouseEnter: function() {
        this.mouseToggle(true);
      },
      mouseLeave: function() {
        this.mouseToggle(false);
      },
      bindEvents: function() {
        var triggerElm;
        if (this.rootMenu.mode === 'horizontal' && this.rootMenu.menuTrigger === 'hover') {
          triggerElm = this.$el;
          VueUtil.on(triggerElm, 'mouseenter', this.mouseEnter);
          VueUtil.on(triggerElm, 'mouseleave', this.mouseLeave);
        } else {
          triggerElm = this.$refs['submenu-title'];
          VueUtil.on(triggerElm, 'click', this.handleClick);
        }
      },
      unBindEvents: function() {
        var triggerElm;
        if (this.rootMenu.mode === 'horizontal' && this.rootMenu.menuTrigger === 'hover') {
          triggerElm = this.$el;
          VueUtil.off(triggerElm, 'mouseenter', this.mouseEnter);
          VueUtil.off(triggerElm, 'mouseleave', this.mouseLeave);
        } else {
          triggerElm = this.$refs['submenu-title'];
          VueUtil.off(triggerElm, 'click', this.handleClick);
        }
      }
    },
    created: function() {
      this.parentMenu.addSubmenu(this);
      this.rootMenu.addSubmenu(this);
    },
    beforeDestroy: function() {
      this.parentMenu.removeSubmenu(this);
      this.rootMenu.removeSubmenu(this);
      this.unBindEvents();
    },
    mounted: function() {
      this.bindEvents();
    }
  };
  Vue.component(VueSubMenu.name, VueSubMenu);
});
