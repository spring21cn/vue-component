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