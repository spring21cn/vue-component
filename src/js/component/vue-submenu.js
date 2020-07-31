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
    //template: '<li :class="{\'vue-submenu\': true, \'is-active\': active, \'is-opened\': opened}"><div class="vue-submenu__title" ref="submenu-title" :style="[paddingStyle, titleStyle, { backgroundColor: backgroundColor }]"><slot name="title"></slot><i :class="[\'vue-submenu__icon-arrow\', submenuTitleIcon]"></i></div><template v-if="rootMenu.mode === \'horizontal\'"><ul class="vue-menu" v-show="opened"><slot></slot></ul></template><collapse-transition v-else><ul class="vue-menu" v-show="opened"><slot></slot></ul></collapse-transition></li>',
    render: function(h) {
      var active = this.active,
      opened = this.opened,
      paddingStyle = this.paddingStyle,
      rootMenu = this.rootMenu,
      mode = this.mode,
      disabled = this.disabled,
      $slots = this.$slots,
      isFirstLevel = this.isFirstLevel;

      var popupMenu = h(
        'transition',
        {},
        [h(
          'div',
          {
            ref: 'menu',
            directives: [{
              name: 'show',
              value: opened
            }],
            'class': ['vue-menu--' + mode]
          },
          [h(
            'ul',
            {
              attrs: {
                role: 'menu'
              },
              'class': ['vue-menu vue-menu--popup']
            },
            [$slots.default]
          )]
        )]
      );

      var inlineMenu = h('collapse-transition', [h(
        'ul',
        {
          attrs: {
            role: 'menu'
          },
          'class': 'vue-menu vue-menu--inline',
          directives: [{
            name: 'show',
            value: opened
          }]
        },
        [$slots.default]
      )]);


      var submenuTitleIcon = (
          rootMenu.mode === 'horizontal' && isFirstLevel ||
          rootMenu.mode === 'vertical' && !rootMenu.collapse
        ) ? 'vue-icon-arrow-down' : 'vue-icon-arrow-right';
      
      
      return h(
        'li',
        {
          'class': {
            'vue-submenu': true,
            'is-active': active,
            'is-opened': opened,
            'is-disabled': disabled
          },
          attrs: { role: 'menuitem',
            'aria-haspopup': 'true',
            'aria-expanded': opened
          },
          on: {
            'mouseenter': this.handleMouseenter,
            'mouseleave': this.handleMouseleave,
            'focus': this.handleMouseenter
          }
        },
        [h(
          'div',
          {
            'class': 'vue-submenu__title',
            ref: 'submenu-title',
            on: {
              'click': this.handleClick
            },
      
            style: [paddingStyle]
          },
          [$slots.title, h('i', { 'class': [submenuTitleIcon, 'vue-submenu__icon-arrow'] })]
        ), this.isMenuPopup ? popupMenu : inlineMenu]
      );
    },
    name: 'VueSubmenu',
    mixins: [VueUtil.component.menumixin, VueUtil.component.emitter],
    components: {
      CollapseTransition: VueUtil.component.collapseTransition
    },
    props: {
      index: {
        type: String,
        required: true
      },
      showTimeout: {
        type: Number,
        default: 300
      },
      hideTimeout: {
        type: Number,
        default: 300
      },
      disabled: Boolean
    },
    data: function() {
      return {
        timeout: null,
        items: {},
        submenus: {},
        mouseInChild: false
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
      },
      mode: function() {
        return this.rootMenu.mode;
      },
      isMenuPopup: function() {
        return this.rootMenu.isMenuPopup;
      },
      isFirstLevel: function() {
        var isFirstLevel = true;
        var parent = this.$parent;
        while (parent && parent !== this.rootMenu) {
          if (['VueSubmenu', 'VueMenuItemGroup'].indexOf(parent.$options.name) > -1) {
            isFirstLevel = false;
            break;
          } else {
            parent = parent.$parent;
          }
        }
        return isFirstLevel;
      }
    },
    watch: {
      opened: function(val) {
        if (this.isMenuPopup) {
          this.$nextTick(function (_) {
            this.updatePopper();
          });
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

        var rootMenu = this.rootMenu;
        var disabled = this.disabled;

        if (rootMenu.menuTrigger === 'hover' && rootMenu.mode === 'horizontal' || rootMenu.collapse && rootMenu.mode === 'vertical' || disabled) {
          return;
        }
        this.dispatch('VueMenu', 'submenu-click', this);
      },

      handleMouseenter: function () {
        var self = this;
    
        var rootMenu = this.rootMenu,
            disabled = this.disabled;

        if (rootMenu.menuTrigger === 'click' && rootMenu.mode === 'horizontal' || !rootMenu.collapse && rootMenu.mode === 'vertical' || disabled) {
          return;
        }
        this.dispatch('VueSubmenu', 'mouse-enter-child');
        
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
          self.rootMenu.openMenu(self.index, self.indexPath);
        }, this.showTimeout);
      },
      handleMouseleave: function () {
        var self = this;
        var rootMenu = this.rootMenu;
    
        if (rootMenu.menuTrigger === 'click' && rootMenu.mode === 'horizontal' || !rootMenu.collapse && rootMenu.mode === 'vertical') {
          return;
        }
        this.dispatch('VueSubmenu', 'mouse-leave-child');
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
          !self.mouseInChild && self.rootMenu.closeMenu(self.index);
        }, this.hideTimeout);
      },
      updatePopper: function () {
        var menu = VueUtil.closest(this.$el, '.vue-menu');
        var submenu = this.$el.querySelector('.vue-menu');
        var verticalMenu = submenu.parentNode;
        var hoverItem = verticalMenu.parentNode;

        if(!this.opened) {
          setTimeout(function() {
            submenu.style.height = '';
            submenu.style.overflow = '';
          }, 0);
          return;
        }
        
        if(this.rootMenu.collapse) {
          submenu.style.position = 'static';
        }

        verticalMenu.style.left = menu.offsetWidth + 5 + 'px';
        verticalMenu.style.top = hoverItem.offsetTop - VueUtil.closest(hoverItem, '.vue-menu').scrollTop + 'px';

        var rect = submenu.getBoundingClientRect();

        if (rect.bottom > window.innerHeight) {
          var over = rect.bottom - window.innerHeight;
          if (over > rect.top) {
            verticalMenu.style.top = verticalMenu.offsetTop - rect.top + 'px';
            submenu.style.height = window.innerHeight + 'px';
            submenu.style.overflow = 'auto';
          } else {
            verticalMenu.style.top = verticalMenu.offsetTop - over + 'px';
          }
        }
      }


      // mouseToggle: VueUtil.debounce(300, function(val) {
      //   if (val) {
      //     this.rootMenu.openMenu(this.index, this.indexPath);
      //   } else {
      //     this.rootMenu.closeMenu(this.index, this.indexPath);
      //   }
      // }),
      // mouseEnter: function() {
      //   this.mouseToggle(true);
      // },
      // mouseLeave: function() {
      //   this.mouseToggle(false);
      // },
      // bindEvents: function() {
      //   var triggerElm;
      //   if (this.rootMenu.mode === 'horizontal' && this.rootMenu.menuTrigger === 'hover') {
      //     triggerElm = this.$el;
      //     VueUtil.on(triggerElm, 'mouseenter', this.mouseEnter);
      //     VueUtil.on(triggerElm, 'mouseleave', this.mouseLeave);
      //   } else {
      //     triggerElm = this.$refs['submenu-title'];
      //     VueUtil.on(triggerElm, 'click', this.handleClick);
      //   }
      // },
      // unBindEvents: function() {
      //   var triggerElm;
      //   if (this.rootMenu.mode === 'horizontal' && this.rootMenu.menuTrigger === 'hover') {
      //     triggerElm = this.$el;
      //     VueUtil.off(triggerElm, 'mouseenter', this.mouseEnter);
      //     VueUtil.off(triggerElm, 'mouseleave', this.mouseLeave);
      //   } else {
      //     triggerElm = this.$refs['submenu-title'];
      //     VueUtil.off(triggerElm, 'click', this.handleClick);
      //   }
      // }
    },
    created: function() {
      this.parentMenu.addSubmenu(this);
      this.rootMenu.addSubmenu(this);
      var self = this;
      this.$on('mouse-enter-child', function() {
        self.mouseInChild = true;
        clearTimeout(self.timeout);
      });
      this.$on('mouse-leave-child', function() {
        self.mouseInChild = false;
        clearTimeout(self.timeout);
      });

    },
    beforeDestroy: function() {
      this.parentMenu.removeSubmenu(this);
      this.rootMenu.removeSubmenu(this);
      // this.unBindEvents();
    },
    mounted: function() {
      // this.bindEvents();
    }
  };
  Vue.component(VueSubMenu.name, VueSubMenu);
});


