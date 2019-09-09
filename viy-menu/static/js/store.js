(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.MenuStore = factory();
}
}(this, function () {
  var toConsumableArray = MenuUtils.toConsumableArray;
  var getters = {
    sidebar: function(state) {
        return state.app.sidebar;
    },
    language: function(state) {
        return state.app.language;
    },
    device: function(state) {
        return state.app.device;
    },
    visitedViews: function(state) {
        return state.tagsView.visitedViews;
    },
    cachedViews: function(state) {
        return state.tagsView.cachedViews;
    },
    initTagsView: function(state) {
      return state.tagsView.init;
    },
    avatar: function(state) {
        return state.user.avatar;
    },
    name: function(state) {
        return state.user.name;
    },
    introduction: function(state) {
        return state.user.introduction;
    },
    status: function(state) {
        return state.user.status;
    },
    setting: function(state) {
        return state.user.setting;
    },
    permission_routers: function(state) {
        return state.permission.routers;
    },
    addRouters: function(state) {
        return state.permission.addRouters;
    },
    height: function(state) {
        return state.app.height;
    }
  };
  
  //app.js
  var app = {
    state: {
      sidebar: {
        opened: !+VueUtil.getCookie('sidebarStatus'),
        withoutAnimation: false
      },
      device: 'desktop',
      language: VueUtil.getCookie('language') || 'zh',
      height: window.innerHeight
    },
    mutations: {
      TOGGLE_SIDEBAR: function(state) {
        if (state.sidebar.opened) {
          VueUtil.setCookie('sidebarStatus', 1);
        } else {
          VueUtil.setCookie('sidebarStatus', 0);
        }
        state.sidebar.opened = !state.sidebar.opened;
        state.sidebar.withoutAnimation = false;
      },
      CLOSE_SIDEBAR: function(state, withoutAnimation) {
        VueUtil.setCookie('sidebarStatus', 1);
        state.sidebar.opened = false;
        state.sidebar.withoutAnimation = withoutAnimation;
      },
      TOGGLE_DEVICE: function(state, device) {
        state.device = device;
      },
      SET_LANGUAGE: function(state, language) {
        state.language = language;
        VueUtil.setCookie('language', language);
      },
      SET_HEIGHT: function(state, height) {
        state.height = height;
      }
    },
    actions: {
      toggleSideBar: function(state) {
        var commit = state.commit;
        commit('TOGGLE_SIDEBAR');
      },
      closeSideBar: function(state, value) {
        var commit = state.commit;
        var withoutAnimation = value.withoutAnimation;
        commit('CLOSE_SIDEBAR', withoutAnimation);
      },
      toggleDevice: function(state, device) {
        var commit = state.commit;
        commit('TOGGLE_DEVICE', device);
      },
      setLanguage: function(state, language) {
        var commit = state.commit;
        commit('SET_LANGUAGE', language);
      },
      setHeight: function(state, height) {
        var commit = state.commit;
        commit('SET_HEIGHT', height);
      }
    }
  };

  /**
   * 处理vue.config.menu配置项传回的菜单JSON数据
   */
  function processMenuData() {
    return new Promise (function(resolve, reject) {
      var data = Vue.config.menu.data;
      if(!data) {
        resolve([]);
        return;
      }
      if (typeof data === "function") {
        var username = MenuStore.getters.name
  
        var res = data(username);
        if(typeof res.then == 'function') {
          res.then(function(data) {
            resolve(dataToRoute(data));
            return;
          }).catch(function(error) {
            console.error('vue.config.menu.data error! \r\n\r\n' + error);
          })
        } else {
          resolve(dataToRoute(res));
          return;
        }
      } else {
        resolve(dataToRoute(data));
        return;
      }
    })
  }
  
  /**
   * 将菜单数组转化为路由
   * @param data 处理后的菜单数组 
   */
  function dataToRoute (menuData, hasParent) {
    var res = [];

    menuData.forEach(function(data) {
      var route = {};

      route.path = !hasParent ? '/' + data.code : data.code;
      route.name = data.code;
      route.hidden = data.hidden;
      route.alwaysShow = data.alwaysShow;
      route.redirect = data.redirect;
      route.props = data.props;
      route.meta = {
        features: data.features,
        title: data.title,
        target: data.target,
        icon: data.icon,
        id: data.id,
        iconColor: data.iconColor,
        noCache: data.noCache,
        breadcrumb: data.breadcrumb,
        type: data.type
      }

      if (data.children) {
        data.url = '';
      }

      if(data.url) {
        var dummyParent = {
          path: route.path,
          component: Layout,
          children: []
        }
        if(route.meta.type === 'link') {
          dummyParent.children.push({
            path: data.url,
            meta: route.meta,
          })
          res.push(dummyParent);
          return true;
        } else {
          if (route.meta.type !== 'iframe') {
            route.component = VueLoader(data.url);
          } else {
            route.meta.url = data.url;
          }
          if (!hasParent && !data.children) {
            dummyParent.path += 'Parent'
            dummyParent.children.push(route);
            res.push(dummyParent);
            return true;
          }
        }
      } else if (hasParent && data.children) {
        route.component = {template: '<router-view></router-view>', name: route.name }
      } else {
        route.component = Layout;
      }

      if (data.children) {
        route.children = dataToRoute(data.children, true);
      }

      res.push(route);
    })
    return res;
  }

  
  var permission = {
    state: {
      routers: constantRouterMap,
      addRouters: []
    },
    mutations: {
      SET_ROUTERS: function(state, routers) {
        state.addRouters = routers;
        state.routers = constantRouterMap.concat(routers);
      }
    },
    actions: {
      GenerateRoutes: function(state, data) {
        var commit = state.commit;
  
        return new Promise(function (resolve) {
          processMenuData().then(function(asyncRouterMap) {
            asyncRouterMap.push({
              path: '*',
              redirect: '/404', 
              hidden: true 
            })
  
            commit('SET_ROUTERS', asyncRouterMap);
            resolve();
          });
        });
      }
    }
  };
  
  //tagsView.js
  var tagsView = {
    state: {
      visitedViews: [],
      cachedViews: [],
      init: false
    },
    mutations: {
      ADD_VISITED_VIEW: function(state, view) {
        if (state.visitedViews.some(function (v) {
          return v.path === view.path;
        })) return;
        state.visitedViews.push(VueUtil.merge({}, view, {
          title: view.meta.title
        }));
      },
      ADD_CACHED_VIEW: function(state, view) {
        if (state.cachedViews.indexOf(view.name) > -1) return;
        if (!view.meta.noCache) {
          state.cachedViews.push(view.name);
        }
      },
  
      DEL_VISITED_VIEW: function(state, view) {
        for (var i = 0; i < state.visitedViews.length; i++) {
          var v = state.visitedViews[i];
          if (v.path === view.path) {
            state.visitedViews.splice(i, 1);
            break;
          }
        }
      },
      DEL_CACHED_VIEW: function(state, view) {
        for (var i = 0; i < state.cachedViews.length; i++) {
          if (state.cachedViews[i] === view.name) {
            state.cachedViews.splice(i, 1);
            break;
          }
        }
      },
  
      DEL_OTHERS_VISITED_VIEWS: function(state, view) {
        var visitedViews = state.visitedViews;
        for (var i = 0; i < visitedViews.length; i++) {
          var v = visitedViews[i];
          if (v.path === view.path) {
            state.visitedViews = state.visitedViews.slice(i, i + 1);
            break;
          }
        }
      },
      DEL_OTHERS_CACHED_VIEWS: function(state, view) {
        for (var i = 0; i < state.cachedViews.length; i++) {
          if (state.cachedViews[i] === view.name) {
            state.cachedViews = state.cachedViews.slice(i, i + 1);
            break;
          }
        }
      },
  
      DEL_ALL_VISITED_VIEWS: function(state) {
        state.visitedViews = [];
      },
      DEL_ALL_CACHED_VIEWS: function(state) {
        state.cachedViews = [];
      },
  
      UPDATE_VISITED_VIEW: function(state, view) {
        for (var i = 0; i < state.visitedViews.length; i++) {
          var v = state.visitedViews[i];
          if (v.path === view.path) {
            v = VueUtil.merge(v, view);
            break;
          }
        }
      },

      INIT_TAGSVIEW: function(state) {
        state.init = true;
      },
    },
    actions: {
      addView: function(context, view) {
        var dispatch = context.dispatch;
        dispatch('addVisitedView', view);
        dispatch('addCachedView', view);
      },
      addVisitedView: function(context, view) {
        var commit = context.commit;
        commit('ADD_VISITED_VIEW', view);
      },
      addCachedView: function(context , view) {
        var commit = context.commit;
        commit('ADD_CACHED_VIEW', view);
      },
      delView: function delView(context, view) {
        var dispatch = context.dispatch,
            state = context.state;
  
        return new Promise(function (resolve) {
          dispatch('delVisitedView', view);
          dispatch('delCachedView', view);
          resolve({
            visitedViews: [].concat(toConsumableArray(state.visitedViews)),
            cachedViews: [].concat(toConsumableArray(state.cachedViews))
          });
        });
      },
      delVisitedView: function(context, view) {
        var commit = context.commit,
            state = context.state;
  
        return new Promise(function (resolve) {
          commit('DEL_VISITED_VIEW', view);
          resolve([].concat(toConsumableArray(state.visitedViews)));
        });
      },
      delCachedView: function(context, view) {
        var commit = context.commit,
            state = context.state;
  
        return new Promise(function (resolve) {
          commit('DEL_CACHED_VIEW', view);
          resolve([].concat(toConsumableArray(state.cachedViews)));
        });
      },
      delOthersViews: function(context, view) {
        var dispatch = context.dispatch,
            state = context.state;
  
        return new Promise(function (resolve) {
          dispatch('delOthersVisitedViews', view);
          dispatch('delOthersCachedViews', view);
          resolve({
            visitedViews: [].concat(toConsumableArray(state.visitedViews)),
            cachedViews: [].concat(toConsumableArray(state.cachedViews))
          });
        });
      },
      delOthersVisitedViews: function(context, view) {
        var commit = context.commit,
            state = context.state;
  
        return new Promise(function (resolve) {
          commit('DEL_OTHERS_VISITED_VIEWS', view);
          resolve([].concat(toConsumableArray(state.visitedViews)));
        });
      },
      delOthersCachedViews: function(context, view) {
        var commit = context.commit,
            state = context.state;
  
        return new Promise(function (resolve) {
          commit('DEL_OTHERS_CACHED_VIEWS', view);
          resolve([].concat(toConsumableArray(state.cachedViews)));
        });
      },
      delAllViews: function (context, view) {
        var dispatch = context.dispatch,
            state = context.state;
  
        return new Promise(function (resolve) {
          dispatch('delAllVisitedViews', view);
          dispatch('delAllCachedViews', view);
          resolve({
            visitedViews: [].concat(toConsumableArray(state.visitedViews)),
            cachedViews: [].concat(toConsumableArray(state.cachedViews))
          });
        });
      },
      delAllVisitedViews: function(context) {
        var commit = context.commit,
            state = context.state;
  
        return new Promise(function (resolve) {
          commit('DEL_ALL_VISITED_VIEWS');
          resolve([].concat(toConsumableArray(state.visitedViews)));
        });
      },
      delAllCachedViews: function(context) {
        var commit = context.commit,
            state = context.state;
  
        return new Promise(function (resolve) {
          commit('DEL_ALL_CACHED_VIEWS');
          resolve([].concat(toConsumableArray(state.cachedViews)));
        });
      },
      updateVisitedView: function(context, view) {
        var commit = context.commit;
        commit('UPDATE_VISITED_VIEW', view);
      },
      initTagsView: function(context) {
        var commit = context.commit;
        commit('INIT_TAGSVIEW');
      }
      
    }
  };
  
  var user = {
    state: {
      user: '',
      status: '',
      code: '',
      name: '',
      avatar: '',
      introduction: '',
      setting: {
      }
    },
  
    mutations: {
      SET_CODE: function(state, code) {
        state.code = code;
      },
      SET_INTRODUCTION: function(state, introduction) {
        state.introduction = introduction;
      },
      SET_SETTING: function(state, setting) {
        state.setting = setting;
      },
      SET_STATUS: function(state, status) {
        state.status = status;
      },
      SET_NAME: function(state, name) {
        state.name = name;
      },
      SET_AVATAR: function(state, avatar) {
        state.avatar = avatar;
      },
    },
  
    actions: {
      // 获取用户信息
      GetUserInfo: function(context) {
        var commit = context.commit,
            state = context.state;
  
        return new Promise(function (resolve, reject) {
          Vue.config.menu.getUserInfo().then(function(data) {
            if (!data) {
              reject('Verification failed, please login again.')
            }

            commit('SET_NAME', data.name);
            commit('SET_AVATAR', data.avatar);
            commit('SET_INTRODUCTION', data.introduction);
            resolve(data);
          })
        }).catch(function() {
            commit('SET_NAME', 'Null');
        });
      },
  
  
      // 登出
      LogOut: function(context) {
        return new Promise(function (resolve, reject) {
          Vue.config.menu.logOut().then(function() {
            resolve();
          }).catch(function() {
            reject()
          })
        });
      }
    }
  };
  var store = new Vuex.Store({
    modules: {
      app: app,
      permission: permission,
      tagsView: tagsView,
      user: user
    },
    getters: getters
  });
  return store;
}));