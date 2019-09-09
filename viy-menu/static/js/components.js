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
        levelList: null,
        dashboardTitle: '',
        dashboardPath: '',
      };
    },
    watch: {
      $route: function() {
        this.getBreadcrumb();
      }
    },
    created: function() {
      this.getDashboardTitle();
      this.getBreadcrumb();
    },
    methods: {
      generateTitle: MenuUtils.generateTitle,
      getDashboardTitle: function() {
        if(this.dashboardTitle) {
          return;
        }
        var dashboard;
        MenuStore.state.permission.routers.forEach(function(route) { 
          if (route.name && route.name == homePageCode) {
            dashboard = route;
            return false;
          }
          if (route.children && route.children.length > 0) {
            route.children.forEach(function(routeChildren) {
              if (routeChildren.name == homePageCode) {
                dashboard = routeChildren;
                return false;
              }
            })
            if (dashboard) {
              return false;
            }
          } 
        })
        this.dashboardTitle = dashboard && dashboard.meta ? dashboard.meta.title : 'dashboard';
        this.dashboardPath = dashboard ? dashboard.path : '/dashboard';
      },
      getBreadcrumb: function() {
        var params = this.$route.params;
        var self = this;

        var menuLevel = this.$route.path.split('/');
        var matched = [];
        menuLevel.forEach(function(value) {
          if(!value) return;
          var parentLevelMenuData = (matched[matched.length - 1] && matched[matched.length - 1].children) || self.menuData;
          if(!parentLevelMenuData) return false;
          var match = VueUtil.arrayFind(parentLevelMenuData, function(data) {
            if(!data.name && data.children && data.children.length > 0) {
              return data.children[0].name === value;
            }
            return data.name === value;
          })
          if(match) {
            if(!match.name) {
              matched.push(match.children[0]);
            } else {
              matched.push(match);
            }
          }
        })

        if(matched.length == 0 && (this.$route.meta && this.$route.meta.dynamic)) {
          matched.push(this.$route);
        }
        // var matched = this.$route.matched.filter(function (item) {
        //   self
        //   if (item.name) {
        //     var toPath = pathToRegexp.compile(item.path);
        //     item.path = toPath(params);
        //     return true;
        //   }
        // });
        var first = matched[0];
        if (first && first.name.trim().toLocaleLowerCase() !== homePageCode) {
          matched = (Vue.config.menu.breadcrumbFromDashboard === false ? [] : [{ path: this.dashboardPath, meta: { title: this.dashboardTitle } }]).concat(matched);
        }
        this.levelList = matched;
      }
    },
    computed: {
      menuData: function() {
        return MenuStore.getters.menuData;
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
    +         '<span class="vue-icon-close" :style="{display: closeBtnDisplay(tag)}" @click.prevent.stop="closeSelectedTag(tag)" />'
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
        selectedTag: {},
        addedTag: [],
      };
    },
    computed: {
      visitedViews: function() {
        return MenuStore.state.tagsView.visitedViews;
      },
      closeTag: function() {
        return MenuStore.state.tagsView.closeTag;
      },
      addTag: function() {
        return MenuStore.state.tagsView.addTag;
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
      },
      closeTag: function (closeTag) {
        this.closeSelectedTagByName(closeTag.name);
      },
      addTag: function (addTag) {
        this.dynamicAddTag(addTag);
      }
    },
    mounted: function() {
      this.addViewTags();
      MenuStore.dispatch('initTagsView');
    },
    methods: {
      closeBtnDisplay: function(tag) {
        if ((Vue.config.menu.homePageCloseable === false && tag.name == homePageCode) || (Array.isArray(this.visitedViews) && this.visitedViews.length == 1 && this.visitedViews[0].name == homePageCode)) {
          return 'none'
        }
        return 'inline-block'
      },
      generateTitle: MenuUtils.generateTitle,
      isActive: function(route) {
        return route.path === this.$route.path;
      },
      addViewTags: function() {
        var name = this.$route.name;
        if (name && name != 'router-error') {
          MenuStore.dispatch('addView', this.$route);
        }
        return false;
      },
      moveToCurrentTag: function() {
        var self = this;
        this.$nextTick(function () {
          var tags = this.$refs.tag;
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
      dynamicAddTag: function (addTag) {

        if (this.addedTag.indexOf(addTag.code) === -1) {
          this.addedTag.push(addTag.code);
          this.$router.addRoutes([{
            path: '/dynamicAddRouter',
            component: Layout,
            children: [{
              path: '/'+ addTag.code,
              name: addTag.code,
              component: addTag.type === undefined ? VueLoader(addTag.url) : undefined,
              meta: {
                dynamic: true,
                noCache: addTag.noCache,
                title: addTag.title,
                type: addTag.type,
                url: addTag.type === undefined ? undefined : addTag.url,
                breadcrumb: addTag.breadcrumb
              }
            }]
          }]);
        }

        this.$router.push('/'+ addTag.code);
      },
      closeSelectedTagByName: function(name) {
        var view = VueUtil.arrayFind(this.visitedViews, function(view) {
          return view.name == name
        });
        if(view) {
          this.closeSelectedTag(view);
        }
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
    +   '<vue-dropdown-menu>'
    +     '<slot name="dropdown"></slot>'
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
        }).catch(function(error) {
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
    +       '<iframe v-for="view in iframeViews" :id="\'app-main-iframe-\' + view.name" class="app-main-iframe" :src="iframeUrl(view)" v-show="$router.currentRoute.name === view.name"></iframe>'
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
        var hasTags = MenuStore.getters.initTagsView;
        if (hasTags) {
          return MenuStore.state.tagsView.visitedViews.filter(function(view) {
              return view.meta && view.meta.type === 'iframe';
          })
        } else {
          var view = this.$route;
          if(view && view.meta && view.meta.type == 'iframe') {
            return [VueUtil.merge({}, view, {
              title: view.meta.title
            })]
          } else {
            return [];
          }
        }
      },
    },
    methods: {
      iframeUrl: function(view) {
        var params = view.params;
        var query = "";

        for (var key in params) {
            if (query != "") {
              query += "&";
            }
            query += key + "=" + encodeURIComponent(params[key]);
        }

        if(query) query = "?" + query; 
        return view.meta.url + query
      }
    }
  };
  Vue.component(AppMain.name, AppMain);

  var SidebarItem = {
    name: 'SidebarItem',
    template: '<div v-if="!item.hidden&&item.children" class="menu-wrapper">'
    +     '<template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">'
    +       '<app-link :to="resolvePath(onlyOneChild.path)" :link-route="onlyOneChild">'
    +         '<vue-menu-item :index="resolvePath(onlyOneChild.path)" :class="{\'submenu-title-noDropdown\':!isNest}">'
    +           '<i v-if="onlyOneChild.meta" :class="(onlyOneChild.meta.icon||(item.meta && item.meta.icon))"></i> '
    +           '<span v-if="onlyOneChild.meta" slot="title">{{generateTitle(onlyOneChild.meta.title)}}</span>'
    +         '</vue-menu-item>'
    +       '</app-link>'
    +     '</template>'
    +     '<vue-submenu v-else ref="submenu" :index="resolvePath(item.path)">'
    +       '<template slot="title">'
    +           '<i  v-if="item.meta" :class="item.meta.icon"></i> '
    +           '<span  v-if="item.meta" slot="title">{{generateTitle(item.meta.title)}}</span>'
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
    +           '<i v-if="child.meta" :class="child.meta.icon"></i> '
    +           '<span v-if="child.meta" slot="title">{{generateTitle(child.meta.title)}}</span>'
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

        if (this.linkRoute.meta) {
          if (this.linkRoute.meta.target === 'blank') {
            res.target = '_blank';
          } else if (this.linkRoute.meta.target === 'window') {
            res.target = '_blank';
            res.onclick= 'return MenuUtils.openMenuItemInWindow(this)'
            res.features = this.linkRoute.meta.features;
          }
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

  var MainMenu = {
    name: 'MainMenu',
    template:  '    <component :is="needScroll" :height="menuHeight">   '
    + '    <vue-menu '
    + '      mode="vertical" '
    + '      :show-timeout="200" '
    + '      :collapse="isCollapse" '
    + '      :default-active="$route.path" '
    + '      theme="dark"'
    + '    >'
    + '      <sidebar-item v-for="item in menuData" :key="item.path" :item="item" :base-path="item.path"/>'
    + '    </vue-menu>'
    + '  </component>',
    computed: {
      menuData: function() {
        return MenuStore.getters.menuData;
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
    },
    props: {
      menuHeight: Number
    },
  }
  Vue.component(MainMenu.name, MainMenu);

  var Sidebar = {
    name: 'Sidebar',
    template: '  <div class="sidebar-container">'
       + ' <slot></slot>'
    + ' </div>',
  };
  Vue.component(Sidebar.name, Sidebar);
});