(function(context, definition) {
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    definition(context.Vue);
  }
})(this, function(Vue) {
  var Breadcrumb = {
    name: 'Breadcrumb',
    template: '<vue-breadcrumb class="app-breadcrumb breadcrumb-container" separator="/">'
    +       '<vue-breadcrumb-item v-for="(item,index) in levelList" v-if="item.meta.title&&item.meta.breadcrumb!==false" :key="item.path">'
    +         '<span v-if="item.redirect===\'noredirect\'||index==levelList.length-1" class="no-redirect">{{ generateTitle(item.meta.title) }}</span>'
    +         '<router-link v-else :to="item.redirect||item.path">{{ generateTitle(item.meta.title) }}</router-link>'
    +       '</vue-breadcrumb-item>'
    +   '</vue-breadcrumb>',
    data: function() {
      return {
        levelList: null
      };
    },
    watch: {
      $route: function() {
        this.getBreadcrumb();
      }
    },
    created: function() {
      this.getBreadcrumb();
    },
    methods: {
      generateTitle: MenuUtils.generateTitle,
      getBreadcrumb: function() {
        var params = this.$route.params;
  
        var matched = this.$route.matched.filter(function (item) {
          if (item.name) {
            var toPath = pathToRegexp.compile(item.path);
            item.path = toPath(params);
            return true;
          }
        });
        var first = matched[0];
        if (first && first.name.trim().toLocaleLowerCase() !== 'Dashboard'.toLocaleLowerCase()) {
          matched = [{ path: '/dashboard', meta: { title: 'dashboard' } }].concat(matched);
        }
        this.levelList = matched;
      }
    }
  };
  Vue.component(Breadcrumb.name, Breadcrumb);

  var Hamburger = {
    name: 'Hamburger',
    template: '<div class="hamburger-container">'
    +           '<i :class="{\'is-active\':sidebar.opened}" class="hamburger vue-icon-menu" @click="toggleClick"></i>'
    +         '</div>',
    computed: {
      sidebar: function() {
        return MenuStore.getters.sidebar;
      }
    },
    methods: {
      toggleClick: function() {
        MenuStore.dispatch('toggleSideBar');
      }
    }
  };
  Vue.component(Hamburger.name, Hamburger);

  var LangSelect = {
    name: 'LangSelect',
    template: '<vue-dropdown trigger="click" class="international" @command="handleSetLanguage">'
    +     '<div>'
    +       '<i class="right-menu-icon international-icon vue-icon-language"></i>'
    +     '</div>'
    +     '<vue-dropdown-menu slot="dropdown">'
    +       '<vue-dropdown-item v-for="lang in languages" :key="lang.code" :disabled="language===lang.code" :command="lang.code">{{lang.name}}</vue-dropdown-item>'
    +     '</vue-dropdown-menu>'
    +   '</vue-dropdown>',
    computed: {
      language: function() {
        return MenuStore.getters.language;
      }
    },
    props: {
      languages: {
        type: Array,
        required: true
      }
    },
    methods: {
      handleSetLanguage: function(lang) {
        VueUtil.setLang(lang);
        MenuStore.dispatch('setLanguage', lang);
        this.$notify({
          message: 'Switch Language Success',
          type: 'success',
          position: "top-center"
        });
      }
    }
  };
  Vue.component(LangSelect.name, LangSelect);

  var Screenfull = {
    name: 'Screenfull',
    template: '<vue-tooltip :content="$t(\'menu.navbar.screenfull\')" effect="dark" placement="bottom"><div>'
    //:class="{\'is-active\':isActive}"
    +    '<i  class="right-menu-icon vue-icon-enlarge" @click="click"></i>'
    +   '</div></vue-tooltip>',
    data: function() {
      return {
        isFullscreen: false
      }
    },
    methods: {
      click: function() {
        VueUtil.screenfull();
      }
    }
  };
  Vue.component(Screenfull.name, Screenfull);

  var tagAndTagSpacing = 4
  var ScrollPane = {
    name: 'ScrollPane',
    template: '<vue-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll">'
    +     '<slot/>'
    +   '</vue-scrollbar>',
    data: function() {
      return {
        left: 0
      }
    },
    methods: {
      handleScroll: function(e) {
        var eventDelta = e.wheelDelta || -e.deltaY * 40;
        var $scrollWrapper = this.$refs.scrollContainer.$refs.wrap;
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft - eventDelta / 4;
      },
      moveToTarget: function(currentTag) {
        var $container = this.$refs.scrollContainer.$el;
        var $containerWidth = $container.offsetWidth;
        var $scrollWrapper = this.$refs.scrollContainer.$refs.wrap;
        var tagList = this.$parent.$refs.tag;
  
        var firstTag = null;
        var lastTag = null;
        var prevTag = null;
        var nextTag = null;
  
        // find first tag and last tag
        if (tagList.length > 0) {
          firstTag = tagList[0];
          lastTag = tagList[tagList.length - 1];
        }
  
        // find preTag and nextTag
        for (var i = 0; i < tagList.length; i++) {
          if (tagList[i] === currentTag) {
            if (i === 0) {
              nextTag = tagList[i].length > 1 && tagList[i + 1];
            } else if (i === tagList.length - 1) {
              prevTag = tagList[i].length > 1 && tagList[i - 1];
            } else {
              prevTag = tagList[i - 1];
              nextTag = tagList[i + 1];
            }
            break;
          }
        }
  
        if (firstTag === currentTag) {
          $scrollWrapper.scrollLeft = 0;
        } else if (lastTag === currentTag) {
          $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth;
        } else {
          // the tag's offsetLeft after of nextTag
          var afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing;
  
          // the tag's offsetLeft before of prevTag
          var beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing;
  
          if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
            $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth;
          } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
            $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
          }
        }
      }
    },
    mounted: function() {
      var scrollContainer = this.$refs.scrollContainer;
      scrollContainer.$refs.wrap.removeEventListener(scrollContainer.mouseWheelEvent, scrollContainer.scrollMouseWheel);
    }
  };
  Vue.component(ScrollPane.name, ScrollPane);

  var TagsView = {
    name: 'TagsView',
    template: '<div class="tags-view-container">'
    +     '<scroll-pane ref="scrollPane" class="tags-view-wrapper">'
    +       '<router-link '
    +         'v-for="tag in visitedViews" '
    +         'ref="tag" '
    +         ':class="isActive(tag)?\'active\':\'\'" '
    +         ':to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" '
    +         ':key="tag.path" '
    +         'tag="span" '
    +         'class="tags-view-item" '
    +         '@click.middle.native="closeSelectedTag(tag)" '
    +         '@contextmenu.prevent.native="openMenu(tag,$event)">'
    +         ' {{ generateTitle(tag.title) }} '
    +         '<span class="vue-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />'
    +       '      </router-link>'
    +     '</scroll-pane>'
    +     '<ul v-show="visible" :style="{left:left+\'px\',top:top+\'px\'}" class="contextmenu">'
    +       '<li @click="refreshSelectedTag(selectedTag)">{{ $t(\'menu.tagsView.refresh\') }}</li>'
    +       '<li @click="closeSelectedTag(selectedTag)">{{ $t(\'menu.tagsView.close\') }}</li>'
    +       '<li @click="closeOthersTags">{{ $t(\'menu.tagsView.closeOthers\') }}</li>'
    +       '<li @click="closeAllTags">{{ $t(\'menu.tagsView.closeAll\') }}</li>'
    +     '</ul>'
    +   '</div>',
    data: function() {
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {}
      };
    },
    computed: {
      visitedViews: function() {
        return MenuStore.state.tagsView.visitedViews;
      }
    },
    watch: {
      $route: function() {
        this.addViewTags();
        this.moveToCurrentTag();
      },
      visible: function(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu);
        } else {
          document.body.removeEventListener('click', this.closeMenu);
        }
      }
    },
    mounted: function() {
      this.addViewTags();
    },
    methods: {
      generateTitle: MenuUtils.generateTitle,
      isActive: function(route) {
        return route.path === this.$route.path;
      },
      addViewTags: function() {
        var name = this.$route.name;
        if (name) {
          MenuStore.dispatch('addView', this.$route);
        }
        return false;
      },
      moveToCurrentTag: function() {
        var self = this;
        var tags = this.$refs.tag;
        this.$nextTick(function () {
          for (var index = 0; index < tags.length; index++) {
            var tag = tags[index];
            if (tag.to.path === self.$route.path) {
              self.$refs.scrollPane.moveToTarget(tag);
              // when query is different then update
              if (tag.to.fullPath !== self.$route.fullPath) {
                MenuStore.dispatch('updateVisitedView', self.$route);
              }
              break;
            }
          }
        });
      },
      refreshSelectedTag: function(view) {
        if (view.meta.type == 'iframe') {
          var iframeId = 'app-main-iframe-' + view.name;
          document.getElementById(iframeId).src = document.getElementById(iframeId).src
        }
        var self = this;
        MenuStore.dispatch('delCachedView', view).then(function () {
          var fullPath = view.fullPath;
          self.$nextTick(function () {
            self.$router.replace({
              path: '/redirect' + fullPath
            });
          });
        });
      },
      closeSelectedTag: function(view) {
        var self = this;
  
        MenuStore.dispatch('delView', view).then(function (state) {
          var visitedViews = state.visitedViews;
  
          if (self.isActive(view)) {
            var latestView = visitedViews.slice(-1)[0];
            if (latestView) {
              self.$router.push(latestView);
            } else {
              self.$router.push('/');
            }
          }
        });
      },
      closeOthersTags: function() {
        var self = this;
        this.$router.push(this.selectedTag);
        MenuStore.dispatch('delOthersViews', this.selectedTag).then(function () {
          self.moveToCurrentTag();
        });
      },
      closeAllTags: function() {
        MenuStore.dispatch('delAllViews');
        this.$router.push('/');
      },
      openMenu: function(tag, e) {
        var menuMinWidth = 105;
        var offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
        var offsetWidth = this.$el.offsetWidth; // container width
        var maxLeft = offsetWidth - menuMinWidth; // left boundary
        var left = e.clientX - offsetLeft + 15; // 15: margin right
  
        if (left > maxLeft) {
          this.left = maxLeft;
        } else {
          this.left = left;
        }
        this.top = e.clientY;
  
        this.visible = true;
        this.selectedTag = tag;
      },
      closeMenu: function() {
        this.visible = false;
      }
    }
  };
  Vue.component(TagsView.name, TagsView);

  var Avatar = {
    name: 'Avatar',
    template: '<vue-dropdown class="avatar-container right-menu-item" trigger="click">'
    +   '<div class="avatar-wrapper">'
    +     '<img :src="avatar" class="user-avatar">'
    +   '</div>'
    +   '<vue-dropdown-menu slot="dropdown">'
    +     '<router-link to="/">'
    +       '<vue-dropdown-item>'
    +         '{{ $t(\'menu.navbar.dashboard\') }}'
    +       '</vue-dropdown-item>'
    +     '</router-link>'
    +     '<vue-dropdown-item divided>'
    +       '<span style="display:block;" @click="logout">{{ $t(\'menu.navbar.logOut\') }}</span>'
    +     '</vue-dropdown-item>'
    +   '</vue-dropdown-menu>'
    + '</vue-dropdown>',
    computed: {
      avatar: function() {
        return MenuStore.getters.avatar;
      }
    },
    methods: {
      logout: function() {
        MenuStore.dispatch('LogOut').then(function () {
          location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
        });
      }
    }
  };
  Vue.component(Avatar.name, Avatar);

  var AppMain = {
    name: 'AppMain',
    template: '<section class="app-main">'
    // +     '<transition name="fade-transform" mode="out-in">'
    +       '<keep-alive :include="cachedViews">'
    +         '<router-view :key="key"></router-view>'
    +       '</keep-alive>'
    +       '<iframe v-for="view in iframeViews" :id="\'app-main-iframe-\' + view.name" class="app-main-iframe" :src="view.meta.url" v-show="$router.currentRoute.name === view.name"></iframe>'
    // +     '</transition>'
    + '  </section>',
    computed: {
      cachedViews: function() {
        return MenuStore.state.tagsView.cachedViews;
      },
      key: function() {
        return this.$route.fullPath;
      },
      iframeViews: function() {
        return MenuStore.state.tagsView.visitedViews.filter(function(view) {
            return view.meta && view.meta.type === 'iframe';
        })
      },
    }
  };
  Vue.component(AppMain.name, AppMain);

  var SidebarItem = {
    name: 'SidebarItem',
    template: '<div v-if="!item.hidden&&item.children" class="menu-wrapper">'
    +     '<template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">'
    +       '<app-link :to="resolvePath(onlyOneChild.path)" :link-route="onlyOneChild">'
    +         '<vue-menu-item :index="resolvePath(onlyOneChild.path)" :class="{\'submenu-title-noDropdown\':!isNest}">'
    +           '<i v-if="onlyOneChild.meta" :class="\'vue-icon-\' + (onlyOneChild.meta.icon||item.meta.icon)"></i> '
    +           '<span v-if="onlyOneChild.meta" slot="title">{{generateTitle(onlyOneChild.meta.title)}}</span>'
    // +           '<menu-item v-if="onlyOneChild.meta" :icon="onlyOneChild.meta.icon||item.meta.icon" :title="generateTitle(onlyOneChild.meta.title)" />'
    +         '</vue-menu-item>'
    +       '</app-link>'
    +     '</template>'
    +     '<vue-submenu v-else ref="submenu" :index="resolvePath(item.path)">'
    +       '<template slot="title">'
    +           '<i  v-if="item.meta" :class="\'vue-icon-\' + item.meta.icon"></i> '
    +           '<span  v-if="item.meta" slot="title">{{generateTitle(item.meta.title)}}</span>'
    // +         '<menu-item v-if="item.meta" :icon="item.meta.icon" :title="generateTitle(item.meta.title)" />'
    +       '</template>'
    +       '<template v-for="child in item.children" v-if="!child.hidden">'
    +         '<sidebar-item '
    +           'v-if="child.children&&child.children.length>0" '
    +           ':is-nest="true" '
    +           ':item="child" '
    +           ':key="child.path" '
    +           ':base-path="resolvePath(child.path)" '
    +           'class="nest-menu" />'
    +         '<app-link v-else :to="resolvePath(child.path)" :link-route="child" :key="child.name">'
    +           '<vue-menu-item :index="resolvePath(child.path)">'
    +           '<i v-if="child.meta" :class="\'vue-icon-\' + child.meta.icon"></i> '
    +           '<span v-if="child.meta" slot="title">{{generateTitle(child.meta.title)}}</span>'
    // +             '<menu-item v-if="child.meta" :icon="child.meta.icon" :title="generateTitle(child.meta.title)" />'
    +           '</vue-menu-item>'
    +         '</app-link>'
    +       '</template>'
    +     '</vue-submenu>'
    +   '</div>',
    props: {
      // route object
      item: {
        type: Object,
        required: true
      },
      isNest: {
        type: Boolean,
        default: false
      },
      basePath: {
        type: String,
        default: ''
      }
    },
    data: function() {
      return {
        onlyOneChild: null
      };
    },
  
    computed: {
      device: function() {
        return MenuStore.state.app.device;
      }
    },
    mounted: function() {
      this.fixBugIniOS();
    },
  
    methods: {
      hasOneShowingChild: function(children, parent) {
        var self = this;
  
        var showingChildren = children.filter(function (item) {
          if (item.hidden) {
            return false;
          } else {
            // Temp set(will be used if only has one showing child)
            self.onlyOneChild = item;
            return true;
          }
        });
  
        // When there is only one child router, the child router is displayed by default
        if (showingChildren.length === 1) {
          return true;
        }
  
        // Show parent if there are no child router to display
        if (showingChildren.length === 0) {
          this.onlyOneChild = VueUtil.merge({}, parent, { path: '', noShowingChildren: true });
          return true;
        }
  
        return false;
      },
      resolvePath: function(routePath) {
        if (this.isExternalLink(routePath)) {
          return routePath;
        }
        return path.resolve(this.basePath, routePath);
      },
      isExternalLink: function(routePath) {
        return MenuUtils.isExternal(routePath);
      },
      fixBugIniOS: function() {
        var self = this;
        var $submenu = this.$refs.submenu;
        if ($submenu) {
          var handleMouseleave = $submenu.handleMouseleave;
          $submenu.handleMouseleave = function (e) {
            if (self.device === 'mobile') {
              return;
            }
            handleMouseleave(e);
          };
        }
      },
  
      generateTitle: MenuUtils.generateTitle
    }
  };
  Vue.component(SidebarItem.name, SidebarItem);

  var AppLink = {
    name: 'AppLink',
    template: '<component v-bind="linkProps(to)">'
    +     '<slot/>'
    +   '</component>',
    props: {
      to: {
        type: String,
        required: true
      },
      linkRoute: {
        type: Object,
        required: true
      }
    },
    methods: {
      isExternalLink: function(routePath) {
        return MenuUtils.isExternal(routePath);
      },
      linkProps: function(url) {
        var res;
        if (this.isExternalLink(url)) {
          res = {
            is: 'a',
            href: url,
            target: '_blank',
            rel: 'noopener'
          };
        } else {
          res = {
            is: 'router-link',
            to: url
          };
        }

        if (this.linkRoute.meta.target === 'blank') {
          res.target = '_blank';
        } else if (this.linkRoute.meta.target === 'window') {
          res.target = '_blank';
          res.onclick= 'return MenuUtils.openMenuItemInWindow(this)'
          res.features = this.linkRoute.meta.features;
        }
        
        return res;
      }
    }
  };
  Vue.component(AppLink.name, AppLink);

  var MenuItem = {
    name: 'MenuItem',
    functional: true,
    props: {
      icon: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      }
    },
    render: function(h, context) {
      var icon = context.props.icon;
      var title = context.props.title;
      var vnodes = [];
  
      if (icon) {
        vnodes.push(h('i', {
          'class': 'vue-icon-' + icon
        }));
      }
  
      if (title) {
        vnodes.push(h('span', {
          attrs: {
            slot: 'title'
          }
        }, title));
      }
      return vnodes;
    }
  };
  Vue.component(MenuItem.name, MenuItem);

  var Sidebar = {
    name: 'Sidebar',
    template: '  <component :is="needScroll" :height="menuHeight">'
    + '    <vue-menu '
    + '      mode="vertical" '
    + '      :show-timeout="200" '
    + '      :collapse="isCollapse" '
    + '      :default-active="$route.path" '
    + '      theme="dark"'
    + '    >'
    + '      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>'
    + '    </vue-menu>'
    + '  </component>',
    computed: {
      'permission_routers': function() {
        return MenuStore.getters.permission_routers;
      },
      sidebar: function() {
        return MenuStore.getters.sidebar;
      },
      isCollapse: function() {
        return !this.sidebar.opened;
      },
      needScroll: function() {
        return this.isCollapse ? 'div' : 'vueScrollbar';
      },
  
      menuHeight: function() {
        return MenuStore.getters.height;
      }
    }
  };
  Vue.component(Sidebar.name, Sidebar);
});