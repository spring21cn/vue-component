var Layout = { template: '<layout></layout>', components: { layout: VueLoader(contextPath + '/views/layout.html') } };
var Login = VueLoader(contextPath + '/views/login.html');
var Error404 = VueLoader(contextPath + '/views/errorPage/404.html');
var Error401 = VueLoader(contextPath + '/views/errorPage/401.html');
var Dashboard = VueLoader(contextPath + '/views/dashboard.html');

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

var Aauthredirect = {
  created: function() {
    var hash = window.location.search.slice(1);
    window.opener.location.href = window.location.origin + '/login#' + hash;
    window.close();
  }
};

//TODO
var PermissionPage = VueLoader(contextPath + '/views/permission/page.html');
var PermissionDirective = VueLoader(contextPath + '/views/permission/directive.html');

Vue.config.menu = VueUtil.merge({}, {
  data:[]
}, Vue.config.menu);

var constantRouterMap = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: Redirect
  }]
}, {
  path: '/login',
  component: Login,
  hidden: true
}, {
  path: '/auth-redirect',
  component: Aauthredirect,
  hidden: true
}, {
  path: '/',
  component: Layout,
  hidden: true,
  redirect: 'dashboard',
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

// permission.js
NProgress.configure({ showSpinner: false }); // NProgress Configuration

// permission judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true; // admin permission passed directly
  if (!permissionRoles) return true;
  return roles.some(function (role) {
    return permissionRoles.indexOf(role) >= 0;
  });
}

var whiteList = ['/login', '/auth-redirect']; // no redirect whitelist

router.beforeEach(function (to, from, next) {
  NProgress.start(); // start progress bar
  if (MenuUtils.getToken()) {
    // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (MenuStore.getters.roles.length === 0) {// 判断当前用户是否已拉取完user_info信息
        MenuStore.dispatch('GetUserInfo').then(function (data) {
          // 拉取user_info
          var roles = data.roles; // note: roles must be a array! such as: ['editor','develop']
          MenuStore.dispatch('GenerateRoutes', { roles: roles }).then(function () {
            // 根据roles权限生成可访问的路由表
            router.addRoutes(MenuStore.getters.addRouters); // 动态添加可访问路由表
            next(VueUtil.merge({}, to, { replace: true })); // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          });
        }).catch(function (err) {
          MenuStore.dispatch('FedLogOut').then(function () {
            MenuStore._vm.$notify({
              message: (typeof err == 'string' ? err : err.message) || 'Verification failed, please login again',
              type: 'error',
              position: "top-center"
            });
            next({ path: '/' });
          });
        });
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(MenuStore.getters.roles, to.meta.roles)) {
          next();
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true } });
        }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next('/login?redirect=' + to.path); // 否则全部重定向到登录页
      NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
});

router.afterEach(function () {
  NProgress.done(); // finish progress bar
});