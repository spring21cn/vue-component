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
    token: function(state) {
        return state.user.token;
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
    roles: function(state) {
        return state.user.roles;
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
  //permission.js
  /**
   * 通过meta.role判断是否与当前用户权限匹配
   * @param roles
   * @param route
   */
  function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
      return roles.some(function (role) {
        return route.meta.roles.indexOf(role) > -1;
      });
    } else {
      return true;
    }
  }
  
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
        var roles = VueUtil.merge([], MenuStore.getters.roles);
  
        var res = data(username, roles);
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
        roles: data.roles,
        features: data.features,
        title: data.title,
        target: data.target,
        icon: data.icon,
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
            route.component = VueLoader(contextPath + data.url);
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

  /**
   * 递归过滤异步路由表，返回符合用户角色权限的路由表
   * @param routes asyncRouterMap
   * @param roles
   */
  function filterAsyncRouter(routes, roles) {
    var res = [];
  
    routes.forEach(function (route) {
      var tmp = VueUtil.merge({}, route);
      if (hasPermission(roles, tmp)) {
        if (tmp.children) {
          tmp.children = filterAsyncRouter(tmp.children, roles);
        }
        res.push(tmp);
      }
    });
  
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
          var roles = data.roles;
          processMenuData().then(function(asyncRouterMap) {
            asyncRouterMap.push({
              path: '*',
              redirect: '/404', 
              hidden: true 
            })
  
            if (roles.indexOf('admin') > -1) {
              accessedRouters = asyncRouterMap;
            } else {
              accessedRouters = filterAsyncRouter(asyncRouterMap, roles);
            }
            commit('SET_ROUTERS', accessedRouters);
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
      cachedViews: []
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
      }
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
      }
    }
  };
  
  var user = {
    state: {
      user: '',
      status: '',
      code: '',
      token: MenuUtils.getToken(),
      name: '',
      avatar: '',
      introduction: '',
      roles: [],
      setting: {
        articlePlatform: []
      }
    },
  
    mutations: {
      SET_CODE: function(state, code) {
        state.code = code;
      },
      SET_TOKEN: function(state, token) {
        state.token = token;
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
      SET_ROLES: function(state, roles) {
        state.roles = roles;
      }
    },
  
    actions: {
      // 用户名登录
      LoginByUsername: function(context, userInfo) {
        var commit = context.commit;
        var username = userInfo.username.trim();

        return new Promise(function (resolve, reject) {
          Vue.config.menu.loginByUsername(username, userInfo.password).then(function(response) {
            var data = response.data;
            commit('SET_TOKEN', data.token);
            MenuUtils.setToken(data.token);
            resolve();
          }).catch(function(error) {
            reject(error)
          })
        });
      },
  
  
      // 获取用户信息
      GetUserInfo: function(context) {
        var commit = context.commit,
            state = context.state;
  
        return new Promise(function (resolve, reject) {
          Vue.config.menu.getUserInfo(state.token).then(function(response) {
            if (!response.data) {
              reject('Verification failed, please login again.')
            }

            var data = response.data;

            if (data.roles && data.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', data.roles);
            } else {
              reject('getInfo: roles must be a non-null array !');
            }
    
            commit('SET_NAME', data.name);
            commit('SET_AVATAR', data.avatar);
            commit('SET_INTRODUCTION', data.introduction);
            resolve(data);
          })
        });
      },
  
  
      // 登出
      LogOut: function(context) {
        var commit = context.commit,
            state = context.state;
  
        return new Promise(function (resolve, reject) {
          Vue.config.menu.logOut().then(function() {
            commit('SET_TOKEN', '');
            commit('SET_ROLES', []);
            MenuUtils.removeToken();
            resolve();
          })
        });
      },
  
  
      // 前端 登出
      FedLogOut: function(context) {
        var commit = context.commit;
  
        return new Promise(function (resolve) {
          commit('SET_TOKEN', '');
          MenuUtils.removeToken();
          resolve();
        });
      },
  
  
      // 动态修改权限
      ChangeRoles: function(context, token) {
        var commit = context.commit,
            dispatch = context.dispatch;
  
        return new Promise(function (resolve) {
          commit('SET_TOKEN', token);
          MenuUtils.setToken(token);
          Vue.config.menu.getUserInfo(token).then(function(response) {
            var data = response.data;
            commit('SET_ROLES', data.roles);
            commit('SET_NAME', data.name);
            commit('SET_AVATAR', data.avatar);
            commit('SET_INTRODUCTION', data.introduction);
            dispatch('GenerateRoutes', data); // 动态修改权限后 重绘侧边菜单
            resolve();
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