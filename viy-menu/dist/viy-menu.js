//https://github.com/pillarjs/path-to-regexp
//2.4.0
!function(a,b){"function"==typeof define&&define.amd?define([],b):"object"==typeof exports?module.exports=b():a.pathToRegexp=b()}(this,function(){function c(a,c){for(var k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,d=[],e=0,f=0,g="",j=c&&c.delimiter||"/";null!=(k=b.exec(a));)l=k[0],m=k[1],n=k.index,g+=a.slice(f,n),f=n+l.length,m?g+=m[1]:(o=a[f],p=k[2],q=k[3],r=k[4],s=k[5],t=k[6],u=k[7],g&&(d.push(g),g=""),v=null!=p&&null!=o&&o!==p,w="+"===t||"*"===t,x="?"===t||"*"===t,y=k[2]||j,z=r||s,d.push({name:q||e++,prefix:p||"",delimiter:y,optional:x,repeat:w,partial:v,asterisk:!!u,pattern:z?i(z):u?".*":"[^"+h(y)+"]+?"}));return f<a.length&&(g+=a.substr(f)),g&&d.push(g),d}function d(a,b){return g(c(a,b))}function e(a){return encodeURI(a).replace(/[\/?#]/g,function(a){return"%"+a.charCodeAt(0).toString(16).toUpperCase()})}function f(a){return encodeURI(a).replace(/[?#]/g,function(a){return"%"+a.charCodeAt(0).toString(16).toUpperCase()})}function g(b){var d,c=new Array(b.length);for(d=0;d<b.length;d++)"object"==typeof b[d]&&(c[d]=new RegExp("^(?:"+b[d].pattern+")$"));return function(d,g){var l,m,n,o,p,h="",i=d||{},j=g||{},k=j.pretty?e:encodeURIComponent;for(l=0;l<b.length;l++)if(m=b[l],"string"!=typeof m){if(n=i[m.name],null==n){if(m.optional){m.partial&&(h+=m.prefix);continue}throw new TypeError('Expected "'+m.name+'" to be defined')}if(a(n)){if(!m.repeat)throw new TypeError('Expected "'+m.name+'" to not repeat, but received `'+JSON.stringify(n)+"`");if(0===n.length){if(m.optional)continue;throw new TypeError('Expected "'+m.name+'" to not be empty')}for(p=0;p<n.length;p++){if(o=k(n[p]),!c[l].test(o))throw new TypeError('Expected all "'+m.name+'" to match "'+m.pattern+'", but received `'+JSON.stringify(o)+"`");h+=(0===p?m.prefix:m.delimiter)+o}}else{if(o=m.asterisk?f(n):k(n),!c[l].test(o))throw new TypeError('Expected "'+m.name+'" to match "'+m.pattern+'", but received "'+o+'"');h+=m.prefix+o}}else h+=m;return h}}function h(a){return a.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function i(a){return a.replace(/([=!:$\/()])/g,"\\$1")}function j(a,b){return a.keys=b,a}function k(a){return a.sensitive?"":"i"}function l(a,b){var d,c=a.source.match(/\((?!\?)/g);if(c)for(d=0;d<c.length;d++)b.push({name:d,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return j(a,b)}function m(a,b,c){var e,f,d=[];for(e=0;e<a.length;e++)d.push(p(a[e],b,c).source);return f=new RegExp("(?:"+d.join("|")+")",k(c)),j(f,b)}function n(a,b,d){return o(c(a,d),b,d)}function o(b,c,d){var e,f,g,i,l,m,n,o,p;for(a(c)||(d=c||d,c=[]),d=d||{},e=d.strict,f=d.end!==!1,g="",i=0;i<b.length;i++)l=b[i],"string"==typeof l?g+=h(l):(m=h(l.prefix),n="(?:"+l.pattern+")",c.push(l),l.repeat&&(n+="(?:"+m+n+")*"),n=l.optional?l.partial?m+"("+n+")?":"(?:"+m+"("+n+"))?":m+"("+n+")",g+=n);return o=h(d.delimiter||"/"),p=g.slice(-o.length)===o,e||(g=(p?g.slice(0,-o.length):g)+"(?:"+o+"(?=$))?"),g+=f?"$":e&&p?"":"(?="+o+"|$)",j(new RegExp("^"+g,k(d)),c)}function p(b,c,d){return a(c)||(d=c||d,c=[]),d=d||{},b instanceof RegExp?l(b,c):a(b)?m(b,c,d):n(b,c,d)}var a=Array.isArray||function(a){return"[object Array]"==Object.prototype.toString.call(a)},b=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g");return p.parse=c,p.compile=d,p.tokensToFunction=g,p.tokensToRegExp=o,p});

//path.resolve
//https://github.com/browserify/path-browserify
!function(a,b){"function"==typeof define&&define.amd?define([],b):"object"==typeof exports?module.exports=b():a.path=b()}(this,function(){function a(a){if("string"!=typeof a)throw new TypeError("Path must be a string. Received "+JSON.stringify(a))}function b(){var e,f,g,b="",d=!1;for(f=arguments.length-1;f>=-1&&!d;f--)f>=0?g=arguments[f]:(void 0===e&&(e="/"),g=e),a(g),0!==g.length&&(b=g+"/"+b,d=47===g.charCodeAt(0));return b=c(b,!d),d?b.length>0?"/"+b:"/":b.length>0?b:"."}function c(a,b){var g,h,i,c="",d=0,e=-1,f=0;for(h=0;h<=a.length;++h){if(h<a.length)g=a.charCodeAt(h);else{if(47===g)break;g=47}if(47===g){if(e===h-1||1===f);else if(e!==h-1&&2===f){if(c.length<2||2!==d||46!==c.charCodeAt(c.length-1)||46!==c.charCodeAt(c.length-2))if(c.length>2){if(i=c.lastIndexOf("/"),i!==c.length-1){-1===i?(c="",d=0):(c=c.slice(0,i),d=c.length-1-c.lastIndexOf("/")),e=h,f=0;continue}}else if(2===c.length||1===c.length){c="",d=0,e=h,f=0;continue}b&&(c.length>0?c+="/..":c="..",d=2)}else c.length>0?c+="/"+a.slice(e+1,h):c=a.slice(e+1,h),d=h-e-1;e=h,f=0}else 46===g&&-1!==f?++f:f=-1}return c}return{resolve:b}});

// NProgress
!function(a,b){"function"==typeof define&&define.amd?define(b):"object"==typeof exports?module.exports=b():a.NProgress=b()}(this,function(){function c(a,b,c){return b>a?b:a>c?c:a}function d(a){return 100*(-1+a)}function e(a,c,e){var f;return f="translate3d"===b.positionUsing?{transform:"translate3d("+d(a)+"%,0,0)"}:"translate"===b.positionUsing?{transform:"translate("+d(a)+"%,0)"}:{"margin-left":d(a)+"%"},f.transition="all "+c+"ms "+e,f}function h(a,b){var c="string"==typeof a?a:k(a);return c.indexOf(" "+b+" ")>=0}function i(a,b){var c=k(a),d=c+b;h(c,b)||(a.className=d.substring(1))}function j(a,b){var d,c=k(a);h(a,b)&&(d=c.replace(" "+b+" "," "),a.className=d.substring(1,d.length-1))}function k(a){return(" "+(a.className||"")+" ").replace(/\s+/gi," ")}function l(a){a&&a.parentNode&&a.parentNode.removeChild(a)}var b,f,g,a={};return a.version="0.2.0",b=a.settings={minimum:.08,easing:"ease",positionUsing:"",speed:200,trickle:!0,trickleRate:.02,trickleSpeed:800,showSpinner:!0,barSelector:'[role="bar"]',spinnerSelector:'[role="spinner"]',parent:"body",template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'},a.configure=function(a){var c,d;for(c in a)d=a[c],void 0!==d&&a.hasOwnProperty(c)&&(b[c]=d);return this},a.status=null,a.set=function(d){var i,j,k,l,h=a.isStarted();return d=c(d,b.minimum,1),a.status=1===d?null:d,i=a.render(!h),j=i.querySelector(b.barSelector),k=b.speed,l=b.easing,i.offsetWidth,f(function(c){""===b.positionUsing&&(b.positionUsing=a.getPositioningCSS()),g(j,e(d,k,l)),1===d?(g(i,{transition:"none",opacity:1}),i.offsetWidth,setTimeout(function(){g(i,{transition:"all "+k+"ms linear",opacity:0}),setTimeout(function(){a.remove(),c()},k)},k)):setTimeout(c,k)}),this},a.isStarted=function(){return"number"==typeof a.status},a.start=function(){a.status||a.set(0);var c=function(){setTimeout(function(){a.status&&(a.trickle(),c())},b.trickleSpeed)};return b.trickle&&c(),this},a.done=function(b){return b||a.status?a.inc(.3+.5*Math.random()).set(1):this},a.inc=function(b){var d=a.status;return d?("number"!=typeof b&&(b=(1-d)*c(Math.random()*d,.1,.95)),d=c(d+b,0,.994),a.set(d)):a.start()},a.trickle=function(){return a.inc(Math.random()*b.trickleRate)},function(){var b=0,c=0;a.promise=function(d){return d&&"resolved"!==d.state()?(0===c&&a.start(),b++,c++,d.always(function(){c--,0===c?(b=0,a.done()):a.set((b-c)/b)}),this):this}}(),a.render=function(c){var e,k,f,h,j;return a.isRendered()?document.getElementById("nprogress"):(i(document.documentElement,"nprogress-busy"),e=document.createElement("div"),e.id="nprogress",e.innerHTML=b.template,f=e.querySelector(b.barSelector),h=c?"-100":d(a.status||0),j=document.querySelector(b.parent),g(f,{transition:"all 0 linear",transform:"translate3d("+h+"%,0,0)"}),b.showSpinner||(k=e.querySelector(b.spinnerSelector),k&&l(k)),j!=document.body&&i(j,"nprogress-custom-parent"),j.appendChild(e),e)},a.remove=function(){j(document.documentElement,"nprogress-busy"),j(document.querySelector(b.parent),"nprogress-custom-parent");var a=document.getElementById("nprogress");a&&l(a)},a.isRendered=function(){return!!document.getElementById("nprogress")},a.getPositioningCSS=function(){var a=document.body.style,b="WebkitTransform"in a?"Webkit":"MozTransform"in a?"Moz":"msTransform"in a?"ms":"OTransform"in a?"O":"";return b+"Perspective"in a?"translate3d":b+"Transform"in a?"translate":"margin"},f=function(){function b(){var c=a.shift();c&&c(b)}var a=[];return function(c){a.push(c),1==a.length&&b()}}(),g=function(){function c(a){return a.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(a,b){return b.toUpperCase()})}function d(b){var f,d,e,c=document.body.style;if(b in c)return b;for(d=a.length,e=b.charAt(0).toUpperCase()+b.slice(1);d--;)if(f=a[d]+e,f in c)return f;return b}function e(a){return a=c(a),b[a]||(b[a]=d(a))}function f(a,b,c){b=e(b),a.style[b]=c}var a=["Webkit","O","Moz","ms"],b={};return function(a,b){var d,e,c=arguments;if(2==c.length)for(d in b)e=b[d],void 0!==e&&b.hasOwnProperty(d)&&f(a,d,e);else f(a,c[1],c[2])}}(),a});

var locales = {
  zh: {
    menu: {
      tagsView: {
        refresh: '刷新',
        close: '关闭',
        closeOthers: '关闭其它',
        closeAll: '关闭所有'
      },
      navbar: {
        logOut: '退出登录',
        dashboard: '首页',
        screenfull: '全屏',
      }
    },
    title: {
      noName:'未命名'
    }
  },
  en: {
    menu: {
      tagsView: {
        refresh: 'Refresh',
        close: 'Close',
        closeOthers: 'Close Others',
        closeAll: 'Close All'
      },
      navbar: {
        logOut: 'Log Out',
        dashboard: 'Dashboard',
        screenfull: 'Full Screen',
      }
    },
    title: {
      noName:'Untitled'
    }
  },
  ja: {
    menu: {
      tagsView: {
        refresh: 'リフレッシュ',
        close: '閉じる',
        closeOthers: 'その他を閉じる',
        closeAll: 'すべて閉じる'
      },
      navbar: {
        logOut: 'ログアウト',
        dashboard: 'ダッシュボード',
        screenfull: 'フルスクリーン',
      }
    },
    title: {
      noName:'Untitled'
    }
  }
};
VueUtil.setLocale("zh", locales.zh);
VueUtil.setLocale("en", locales.en);
VueUtil.setLocale("ja", locales.ja);
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.MenuUtils = factory();
}
}(this, function () {
  function generateTitle(title) {
    if (!title) {
      title = 'noName'
    }
    var translatedTitle = Vue.t(title);
    return translatedTitle;
  }
  
  function isExternal(path) {
    return (/^(https?:|mailto:|tel:)/.test(path));
  }
  
  var TokenKey = 'Admin-Token';
  
  function getToken() {
    return VueUtil.getCookie(TokenKey);
  }
  
  function setToken(token) {
    return VueUtil.setCookie(TokenKey, token);
  }
  
  function removeToken() {
    return VueUtil.removeCookie(TokenKey);
  }
  
  
  function toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    } else {
        return Array.from(arr);
    }
  }

  function openMenuItemInWindow(link) {
    window.open(link.getAttribute('href'),'',link.getAttribute('features'))
    return false;
  }

  Vue.menu = {
    push: function(location, onComplete, onAbort) {
      router.push(location, onComplete, onAbort);
      var match = MenuStore.getters.visitedViews.filter(function(v) {
        return v.path === router.currentRoute.path;
      })
      
      match.length > 0 && (match[0].params = location.params)
    }
  }

  return {
    generateTitle: generateTitle,
    isExternal: isExternal,
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    toConsumableArray: toConsumableArray,
    openMenuItemInWindow: openMenuItemInWindow
  }
}));
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
        dashboardTitle: ''
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
        MenuStore.state.permission.routers.forEach(function(r) { 
          if (r.children && r.children.length == 1 && r.children[0].path.toLocaleLowerCase() == '/dashboard') {
            dashboard = r;
            return false;
          }
        })
        this.dashboardTitle = dashboard && dashboard.children[0].meta ? dashboard.children[0].meta.title : 'dashboard';
      },
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
          matched = (Vue.config.menu.breadcrumbFromDashboard === false ? [] : [{ path: '/dashboard', meta: { title: this.dashboardTitle } }]).concat(matched);
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
    +         '<span class="vue-icon-close" :style="{display: closeBtnDisplay}" @click.prevent.stop="closeSelectedTag(tag)" />'
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
      },
      closeBtnDisplay: function() {
        var homePageCode = Vue.config.menu && Vue.config.menu.homePageCode || 'dashboard'
        if (Array.isArray(this.visitedViews) && this.visitedViews.length == 1 && this.visitedViews[0].name == homePageCode) {
          return 'none'
        }
        return 'inline-block'
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
      MenuStore.dispatch('initTagsView');
    },
    methods: {
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

  var Sidebar = {
    name: 'Sidebar',
    // template: '  <component :is="needScroll" :height="menuHeight">'
    // + '    <div v-if="$slots.logo" class="sidebar-logo"><slot v-if="!isCollapse || !$slots.miniLogo" name="logo"></slot><slot v-else="isCollapse" name="mini-logo"></slot></div>'
    // + '    <vue-menu '
    // + '      mode="vertical" '
    // + '      :show-timeout="200" '
    // + '      :collapse="isCollapse" '
    // + '      :default-active="$route.path" '
    // + '      theme="dark"'
    // + '    >'
    // + '      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>'
    // + '    </vue-menu>'
    // + '  </component>',
    template: '  <div class="sidebar-container">'
    + '    <div ref="logoContainer" v-if="$slots.logo" class="sidebar-logo">'
    + '        <slot v-if="!isCollapse || !$slots.miniLogo" name="logo"></slot>'
    + '        <slot v-else name="miniLogo"></slot>'
    + '    </div>'
    + '    <component :is="needScroll" :height="menuHeight">   '
    + '       '
    + '       '
    + '    <vue-menu '
    + '      mode="vertical" '
    + '      :show-timeout="200" '
    + '      :collapse="isCollapse" '
    + '      :default-active="$route.path" '
    + '      theme="dark"'
    + '    >'
    + '      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>'
    + '    </vue-menu>'
    + '  </component></div>',
    data: function() {
      return {
        logoHeight: 0
      }
    },
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
        return MenuStore.getters.height - this.logoHeight;
      }
    },
    mounted: function() {
      this.logoHeight = this.$refs.logoContainer ? this.$refs.logoContainer.offsetHeight : 0;
    }
  };
  Vue.component(Sidebar.name, Sidebar);
});
var viewsPath = Vue.config.menu && Vue.config.menu.viewsPath || 'views'
var homePageCode = Vue.config.menu && Vue.config.menu.homePageCode || 'dashboard'
var layoutPageCode = Vue.config.menu && Vue.config.menu.layoutPageCode || 'layout'

var Layout = { template: '<layout></layout>', components: { layout: VueLoader(viewsPath+'/' + layoutPageCode + '.html') } };
var Error404 = VueLoader(viewsPath+'/errorPage/404.html');
var Error401 = VueLoader(viewsPath+'/errorPage/401.html');

var Redirect = {
  beforeCreate: function () {
    var params = this.$route.params;
    var query = this.$route.query;
    var path = params.path;

    this.$router.replace({ path: '/' + path, query: query });
  },

  render: function(h) {
    return h(); // avoid warning message
  }
};

var constantRouterMap = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: Redirect
  }]
}, {
  path: '/',
  component: Layout,
  hidden: true,
  redirect: homePageCode,
  children: [
    {
      path: '/404',
      component: Error404,
      hidden: true
    },
    {
      path: '/401',
      component: Error401,
      hidden: true
    },{
      name: 'router-error',
      path: '/router-error',
      hidden: true,
      component: {template: '<pre>{{$route.params.error}}</pre>'}
    }
  ]
}];

window.router = new VueRouter({
  mode: Vue.config.routerMode || 'hash',
  scrollBehavior: function() {
    return { y: 0 };
  },
  routes: constantRouterMap
});

NProgress.configure({ showSpinner: false }); // NProgress Configuration

router.onError(function(error) {
  var msg = typeof error == 'string' ? error : error.message ? (error.message + '\r\n' + (error.stack || '')) : 'Router System Error!';
  router.push({ name: 'router-error', params: { error: msg }})
  NProgress.done();
});

router.beforeEach(function (to, from, next) {
  NProgress.start(); // start progress bar
  if (MenuStore.getters.name.length === 0) {// 判断当前用户是否已拉取完user_info信息
    MenuStore.dispatch('GetUserInfo').then(function (data) {
      // 拉取user_info
      MenuStore.dispatch('GenerateRoutes').then(function () {
        // 根据roles权限生成可访问的路由表
        router.addRoutes(MenuStore.getters.addRouters); // 动态添加可访问路由表
        next(VueUtil.merge({}, to, { replace: true })); // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      });
    }).catch(function (err) {
      MenuStore._vm.$notify({
        message: (typeof err == 'string' ? err : err.message) || 'Verification failed, please login again',
        type: 'error',
        position: "top-center"
      });
      next({ path: '/' });
    });
  } else {
    // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
      next();
  }
});

router.afterEach(function () {
  NProgress.done(); // finish progress bar
});