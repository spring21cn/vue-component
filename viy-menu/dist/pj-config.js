/**

Vue.config.menu = {
  data: 菜单数据，下方有详细说明。
  logOut: 登出函数。点击navbar右上角头像下拉框的登出按钮触发。
  getUserInfo: 获取用户数据接口，首次进入路由触发。
  viewsPath: 画面HTML的URL在contextpath后的路径，默认views，如： 需要被load的HTML路径为 http://xxx/a1-escort/screen/xxx.html 则viewsPath为screen
  breadcrumbFromDashboard: 面包屑导航是否默认从首页开始。默认true
  layoutPageCode: 画面外框HTML的code，会在views目录下寻找对应的文件名作为画面外框组件
  homePageCode: 画面首页HTML的code，会在views目录下寻找对应的文件名作为画面首页
  homePageCloseable: 默认true，画面首页的tab页，是否可以关闭。
  generateTitle：自定义菜单获取方式。
}

关于菜单路由配置方式：实现Vue.config.menu.data方法
如需要ajax取得的后台数据，建议返回一个Promise对象（参考下面例子），程序可以异步加载。否则也可以直接返回数组类型。

数据格式如下：
code           唯一code，将会被作为url，会与父菜单叠加
title          设置该路由在侧边栏和面包屑中展示的名字
icon           设置该菜单的图标
type           菜单类型分为 link超链接，iframe，不填则为默认值vue，vue三段文件动态加载模式
target         如设置为blank，会在新的浏览器tab打开、设置window以窗口模式打开
features       target = window时生效设定窗口属性，参考标准HTML Window Features
url            需要加载的文件地址，如果type为link或iframe则为跳转的地址
hidden         当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
redirect       重定向当设置， noredirect 的时候该路由在面包屑导航中不可被点击
alwaysShow     当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
               只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
               若你想不管路由下面的 children 声明的个数都显示你的根路由
               你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
roles          设置该路由进入的权限，支持多个权限叠加
noCache        如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
breadcrumb     如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
props          参数传递 { key: value }, 对应的画面html中需要预先定义参数，如props: ['name', 'id']
children       子菜单
*/

Vue.config.menu = VueUtil.merge({
  data: function (username, roles) {
    //例
    // return new Promise(function(resolve, reject) {
    //   Vue.http.post(
    //     '/auth/menu'
    //   ).then(function(response) {
    //     // 处理数据，返回
    //     resolve(response.data);
    //   }, function(error) {
    //     // 错误处理
    //     console.log(error)
    //   })
    // });

    //mock
    var data = [{
      code: 'dashboard',
      title: 'title.dashboard',
      icon: 'vue-icon-desktop',
      url: 'views/dashboard.html'
    }, {
      code: 'demo',
      title: 'title.demo',
      icon: 'vue-icon-lock',
      alwaysShow: true,
      breadcrumb: false,
      children: [{
        code: 'demo01',
        title: 'title.demo01',
        icon: 'vue-icon-desktop',
        url: 'views/demo/demo01.html',
      }, {
        code: 'demo02',
        title: 'title.demo02',
        icon: 'vue-icon-desktop',
        url: 'views/demo/demo02.html'
      }],
    }, {
      code: 'more',
      title: 'title.more',
      icon: 'vue-icon-lock',
      children: [{
        code: 'demo03',
        title: 'title.demo03',
        icon: 'vue-icon-desktop',
        url: 'views/demo/demo03.html',
      },{
        code: 'demo04',
        title: 'title.demo04',
        icon: 'vue-icon-desktop',
        url: 'views/demo/demo04.html',
      }, {
        code: 'more2',
        title: 'title.more',
        icon: 'vue-icon-lock',
        children: [{
          code: 'demo05',
          title: 'title.demo05',
          icon: 'vue-icon-desktop',
          url: 'views/demo/demo05.html'
        }, {
          code: 'demo06',
          title: 'title.demo06',
          icon: 'vue-icon-desktop',
          url: 'views/demo/demo06.html'
        }, {
          code: 'demo07',
          title: 'title.demo07',
          icon: 'vue-icon-desktop',
          url: 'views/demo/demo07.html'
        }, {
          code: 'externalLink2',
          title: 'title.externalLink',
          type: 'link',
          icon: 'vue-icon-share',
          url: 'https://www.baidu.com/s?wd=2'
        },{
          code: 'iframe2',
          title: 'title.iframePage',
          type: 'iframe',
          icon: 'vue-icon-share',
          url: 'https://www.baidu.com/s?wd=3'
        }],
      },],
    }, {
      code: 'externalLink',
      title: 'title.externalLink', 
      icon: 'vue-icon-share', 
      children: [
        {
          code: 'iframe3',
          title: 'title.iframePage22S',
          type: 'iframe',
          icon: 'vue-icon-share',
          url: 'https://www.baidu.com/s?wd=5'
        },
        {
          code: 'iframe4',
          title: 'title.iframePage4',
          type: 'iframe',
          icon: 'vue-icon-share',
          url: 'https://www.baidu.com/s?wd=6'
        }
      ]
    }, {
      code: 'iframe',
      title: 'title.iframePage',
      type: 'iframe',
      icon: 'vue-icon-share',
      alwaysShow:true,
      url: 'https://www.baidu.com/s?wd=7'
    }, {
      code: 'mobiledemo',
      title: 'mobile demo', 
      icon: 'vue-icon-share',
      type: 'link',
      target: 'blank',   
      url: location.origin + '/vue-mobile/#'
    }
    ];

    return new Promise(function(resolve, reject) {
        resolve(data);
    });
  },

  /**
   * 请求后端登出
   */
  logOut: function () {
    // 例
    // return Vue.http.post(
    //   '/login/logout'
    // )

    //mock
    location.href = 'login.html'
  },

  /**
   * 获取用户信息
   * @param {string} token 
   */
  getUserInfo: function(token) {
    // 例
    // return Vue.http.post(
    //   '/user/info',
    //   {token: token}
    // )

    //mock
    return new Promise(function(resolve, reject) {
      resolve(userMap['admin']);
    })
  },
  generateTitle: function(title) {
    if (!title) {
    title = 'noName'
    }
    var translatedTitle = Vue.t(title);
    if (router.currentRoute.meta.title == title && router.currentRoute.query.action =='r') {
        translatedTitle += '(ReadOnly)'
    }
    return translatedTitle;
  }
}, Vue.config.menu)

//demo测试用户数据
var userMap = {
  admin: {
    avatar: './static/img/avatar/1.png',
    name: 'Super Admin'
  }
}