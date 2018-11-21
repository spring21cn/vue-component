(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueTabs = definition(context.Vue, context.VueUtil);
    delete context.VueTabs;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueTabNav = {
    props: {
      panes: Array,
      currentName: String,
      editable: Boolean,
      onTabClick: {
        type: Function,
        default: function() {}
      },
      onTabRemove: {
        type: Function,
        default: function() {}
      },
      type: String,
      router: Boolean
    },
    data: function() {
      return {
        scrollable: false,
        navStyle: {
          transform: ''
        }
      };
    },
    methods: {
      routeToItem: function(item) {
        var route = item.name;
        this.$router && this.$router.push(route);
      },
      scrollPrev: function() {
        var currentOffset = this.getCurrentScrollOffset();
        if (!currentOffset) return;
        var tabWidth = this.$refs.tabs[0].offsetWidth;
        var newOffset = currentOffset > tabWidth ? currentOffset - tabWidth : 0;
        this.setOffset(newOffset);
      },
      scrollNext: function() {
        var navWidth = this.$refs.nav.offsetWidth;
        var containerWidth = this.$refs.navScroll.offsetWidth;
        var currentOffset = this.getCurrentScrollOffset();
        if (navWidth - currentOffset <= containerWidth) return;
        var tabWidth = this.$refs.tabs[0].offsetWidth;
        var newOffset = navWidth - currentOffset > tabWidth ? currentOffset + tabWidth : (navWidth - tabWidth);
        this.setOffset(newOffset);
      },
      scrollToActiveTab: function() {
        if (!this.scrollable) return;
        var nav = this.$refs.nav;
        var activeTab = this.$el.querySelector('.is-active');
        var navScroll = this.$refs.navScroll;
        var activeTabBounding = activeTab.getBoundingClientRect();
        var navScrollBounding = navScroll.getBoundingClientRect();
        var navBounding = nav.getBoundingClientRect();
        var currentOffset = this.getCurrentScrollOffset();
        var newOffset = currentOffset;
        if (activeTabBounding.left < navScrollBounding.left) {
          newOffset = currentOffset - (navScrollBounding.left - activeTabBounding.left);
        }
        if (activeTabBounding.right > navScrollBounding.right) {
          newOffset = currentOffset + activeTabBounding.right - navScrollBounding.right;
        }
        if (navBounding.right < navScrollBounding.right) {
          newOffset = nav.offsetWidth - navScrollBounding.width;
        }
        this.setOffset(Math.max(newOffset, 0));
      },
      getCurrentScrollOffset: function() {
        var navStyle = this.navStyle;
        return navStyle.transform ? Number(navStyle.transform.match(/translateX\(-(\d+(\.\d+)*)px\)/)[1]) : 0;
      },
      setOffset: function(value) {
        this.navStyle.transform = 'translateX(-' + value + 'px)';
      },
      update: function() {
        if (this.$refs.nav && this.$refs.navScroll) {
          var navWidth = this.$refs.nav.offsetWidth;
          var containerWidth = this.$refs.navScroll.offsetWidth;
          var currentOffset = this.getCurrentScrollOffset();
          if (containerWidth < navWidth) {
            this.scrollable = this.scrollable || {};
            this.scrollable.prev = currentOffset;
            this.scrollable.next = currentOffset + containerWidth < navWidth;
            if (navWidth - currentOffset < containerWidth) {
              this.setOffset(navWidth - containerWidth);
            }
          } else {
            this.scrollable = false;
            if (currentOffset > 0) {
              this.setOffset(0);
            }
          }
        }
      },
      scrollYMouseWheel: function(event) {
        if (this.scrollable) {
          event.preventDefault();
          var wheelDelta = event.wheelDelta || -event.detail;
          if (wheelDelta < 0) {
            this.scrollNext();
          } else {
            this.scrollPrev();
          }
        }
      }
    },
    updated: function() {
      this.$nextTick(this.update);
    },
    render: function(createElement) {
      var type = this.type;
      var panes = this.panes;
      var editable = this.editable;
      var onTabClick = this.onTabClick;
      var onTabRemove = this.onTabRemove;
      var navStyle = this.navStyle;
      var scrollable = this.scrollable;
      var scrollNext = this.scrollNext;
      var scrollPrev = this.scrollPrev;
      var router = this.router;
      var routeToItem = this.routeToItem;
      var scrollBtn = scrollable ? [createElement('span', {
        'class': ['vue-tabs__nav-prev', scrollable.prev ? '' : 'is-disabled'],
        on: {
          'click': scrollPrev
        }
      }, [createElement('i', {
        'class': 'vue-icon-arrow-left'
      }, [])]), createElement('span', {
        'class': ['vue-tabs__nav-next', scrollable.next ? '' : 'is-disabled'],
        on: {
          'click': scrollNext
        }
      }, [createElement('i', {
        'class': 'vue-icon-arrow-right'
      }, [])])] : null;
      var tabs = this._l(panes, function(pane, index) {
        var tabName = pane.name || pane.index || index;
        var closable = pane.isClosable || editable;
        pane.index = '' + index;
        var btnClose = closable ? createElement('span', {'class': 'vue-icon-close', on: {'click': function click(ev) {onTabRemove(pane, ev);}}}, []) : null;
        var tabLabelContent = pane.$slots.label || pane.label;
        return createElement('div', {
          key: index,
          'class': {
            'vue-tabs__item': true,
            'is-active': pane.active,
            'is-disabled': pane.disabled,
            'is-closable': closable
          },
          ref: 'tabs',
          refInFor: true,
          on: {
            'click': function click(ev) {
              router && routeToItem(pane);
              onTabClick(pane, tabName, ev);
            }
          }
        }, [tabLabelContent, btnClose]);
      });
      return createElement('div', {
        'class': ['vue-tabs__nav-wrap', scrollable ? 'is-scrollable' : '']
      }, [scrollBtn, createElement('div', {
        'class': ['vue-tabs__nav-scroll'],
        ref: 'navScroll'
      }, [createElement('div', {
        'class': 'vue-tabs__nav',
        ref: 'nav',
        style: navStyle
      }, [tabs])])]);
    },
    computed: {
      mouseWheel: function() {
        return VueUtil.isFirefox ? 'DOMMouseScroll' : 'mousewheel';
      }
    },
    mounted: function() {
      VueUtil.on(this.$refs.navScroll, this.mouseWheel, this.scrollYMouseWheel);
      VueUtil.addResizeListener(this.$el, this.update);
    },
    beforeDestroy: function() {
      VueUtil.off(this.$refs.navScroll, this.mouseWheel, this.scrollYMouseWheel);
      VueUtil.removeResizeListener(this.$el, this.update);
    }
  };
  var VueTabs = {
    name: 'VueTabs',
    components: {
      TabNav: VueTabNav
    },
    props: {
      type: String,
      closable: Boolean,
      addable: Boolean,
      value: {},
      editable: Boolean,
      tabBottom: Boolean,
      router: Boolean
    },
    data: function() {
      return {
        currentName: this.value,
        panes: []
      };
    },
    watch: {
      value: function(value) {
        this.setCurrentName(value);
      },
      currentName: function(value) {
        var self = this;
        if (self.$refs.nav) {
          self.$nextTick(function() {
            self.$refs.nav.scrollToActiveTab();
          });
        }
      }
    },
    methods: {
      handleTabClick: function(tab, tabName, event) {
        if (tab.disabled)
          return;
        this.setCurrentName(tabName);
        this.$emit('tab-click', tab, event);
      },
      handleTabRemove: function(pane, ev) {
        if (pane.disabled)
          return;
        ev.stopPropagation();
        this.$emit('edit', pane.name, 'remove');
        this.$emit('tab-remove', pane.name);
      },
      handleTabAdd: function() {
        this.$emit('edit', null, 'add');
        this.$emit('tab-add');
      },
      setCurrentName: function(value) {
        this.currentName = value;
        this.$emit('input', value);
      },
      addPanes: function(item) {
        var index = this.$slots.default.indexOf(item.$vnode);
        this.panes.splice(index, 0, item);
      },
      removePanes: function(item) {
        var panes = this.panes;
        var index = panes.indexOf(item);
        if (index !== -1) {
          panes.splice(index, 1);
        }
      }
    },
    render: function(createElement) {
      var type = this.type;
      var handleTabClick = this.handleTabClick;
      var handleTabRemove = this.handleTabRemove;
      var handleTabAdd = this.handleTabAdd;
      var currentName = this.currentName;
      var panes = this.panes;
      var editable = this.editable;
      var addable = this.addable;
      var tabBottom = this.tabBottom;
      var router = this.router;
      var newButton = editable || addable ? createElement('vue-button', {
        'class': 'vue-tabs__new-tab',
        attrs: {
          type: 'text',
          icon: 'vue-icon-plus'
        },
        on: {
          'click': handleTabAdd
        }
      }, []) : null;
      var navData = {
        props: {
          currentName: currentName,
          onTabClick: handleTabClick,
          onTabRemove: handleTabRemove,
          editable: editable,
          type: type,
          panes: panes,
          router: router
        },
        ref: 'nav'
      };
      var header = createElement('div', {
        'class': 'vue-tabs__header'
      }, [newButton, createElement('tab-nav', navData, [])]);
      var panels = createElement('div', {
        'class': 'vue-tabs__content'
      }, [this.$slots.default]);
      return createElement('div', {
        'class': {
          'vue-tabs': true,
          'vue-tabs--card': type === 'card',
          'vue-tabs--border-card': type === 'border-card',
          'header-bottom': tabBottom
        }
      }, [tabBottom ? [panels, header] : [header, panels]]);
    },
    created: function() {
      if (!this.currentName) {
        this.setCurrentName('0');
      }
    }
  };
  Vue.component(VueTabs.name, VueTabs);
});
