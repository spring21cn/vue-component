(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueMenu = definition(context.Vue, context.VueUtil);
    delete context.VueMenu;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueMenu = {
    template: '<ul :class="[\'vue-menu\', {\'vue-menu--horizontal\': mode === \'horizontal\', \'vue-menu--dark\': theme === \'dark\'}]"><slot></slot></ul>',
    name: 'VueMenu',
    mixins: [VueUtil.component.emitter],
    props: {
      mode: {
        type: String,
        default: 'vertical'
      },
      defaultActive: {
        type: String,
        default: ''
      },
      defaultOpeneds: Array,
      theme: {
        type: String,
        default: 'light'
      },
      uniqueOpened: Boolean,
      router: Boolean,
      menuTrigger: {
        type: String,
        default: 'hover'
      }
    },
    data: function() {
      return {
        activedIndex: this.defaultActive,
        openedMenus: VueUtil.mergeArray([], this.defaultOpeneds),
        items: {},
        submenus: {}
      };
    },
    watch: {
      defaultActive: function(value) {
        var item = this.items[value];
        if (!item) return;
        this.activedIndex = value;
        this.initOpenedMenu();
      },
      defaultOpeneds: function(value) {
        this.openedMenus = value;
      },
      '$route': {
        immediate: true,
        handler: function(value) {
          if (this.router) {
            var item = this.items[value.path];
            if (!item) return;
            this.activedIndex = value.path;
            this.initOpenedMenu();
          }
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
      openMenu: function(index, indexPath) {
        var openedMenus = this.openedMenus;
        if (openedMenus.indexOf(index) !== -1)
          return;
        if (this.uniqueOpened) {
          this.openedMenus = VueUtil.filter(openedMenus, function(index) {
            return indexPath.indexOf(index) !== -1;
          });
        }
        this.openedMenus.push(index);
      },
      closeMenu: function(index, indexPath) {
        this.openedMenus.splice(this.openedMenus.indexOf(index), 1);
      },
      handleSubmenuClick: function(submenu) {
        var isOpened = this.openedMenus.indexOf(submenu.index) !== -1;
        if (isOpened) {
          this.closeMenu(submenu.index, submenu.indexPath);
          this.$emit('close', submenu.index, submenu.indexPath);
        } else {
          this.openMenu(submenu.index, submenu.indexPath);
          this.$emit('open', submenu.index, submenu.indexPath);
        }
      },
      handleItemClick: function(item) {
        this.$emit('select', item.index, item.indexPath, item);
        if (this.mode === 'horizontal') {
          this.openedMenus = [];
        }
        if (this.router) {
          this.routeToItem(item);
        } else {
          this.activedIndex = item.index;
        }
      },
      initOpenedMenu: function() {
        var self = this;
        var index = self.activedIndex;
        var activeItem = self.items[index];
        if (!activeItem || self.mode === 'horizontal') return;
        var indexPath = activeItem.indexPath;
        VueUtil.loop(indexPath, function(index) {
          var submenu = self.submenus[index];
          submenu && self.openMenu(index, submenu.indexPath);
        });
      },
      routeToItem: function(item) {
        var route = item.route || item.index;
        try {
          this.$router.push(route);
        } catch (e) {
          throw e;
        }
      }
    },
    mounted: function() {
      this.initOpenedMenu();
      this.$on('item-click', this.handleItemClick);
      this.$on('submenu-click', this.handleSubmenuClick);
    }
  };
  Vue.component(VueMenu.name, VueMenu);
});
