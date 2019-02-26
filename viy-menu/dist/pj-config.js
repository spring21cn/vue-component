/**
关于菜单路由配置方式：实现Vue.config.menu.data方法
如需要ajax取得的后台数据，建议返回一个Promise对象（参考下面例子），程序可以异步加载。否则也可以直接返回数组类型。

数据格式如下：
code           唯一code，将会被作为url，会与父菜单叠加
title          设置该路由在侧边栏和面包屑中展示的名字
icon           设置该菜单的图标
type           菜单类型分为 link超链接，iframe，不填则为vue动态加载模式
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
props          参数传递 { key: value }, 对应的画面中需要预先定义参数
children       子菜单
*/

Vue.config.menu = {
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
      title: 'dashboard',
      icon: 'desktop',
      url: '/views/dashboard.html'
    }, {
      code: 'permission',
      title: 'permission',
      icon: 'lock',
      alwaysShow: true,
      breadcrumb: false,
      children: [{
        code: 'PagePermission',
        title: 'pagePermission',
        icon: 'desktop',
        roles: ['admin'],
        url: '/views/permission/page.html'
      }, {
        code: 'DirectivePermission',
        title: 'directivePermission',
        icon: 'desktop',
        url: '/views/permission/directive.html'
      }],
    }, {
      code: 'externalLink',
      title: 'externalLink',
      type: 'link',
      icon: 'share',
      url: 'http://www.baidu.com'
    }, {
      code: 'iframe',
      title: 'iframePage',
      type: 'iframe',
      icon: 'share',
      url: 'http://www.baidu.com'
    }
    ];

    return new Promise(function(resolve, reject) {
        resolve(data);
    });
  },

  /**
   * 调用登录接口，返回一个promise且resolve的值为后端token {data: {token: 'token'}}
   * @param {string} username 
   * @param {string} password 
   * @returns {promise} 
   */
  loginByUsername: function (username, password) {
    // 例
    // return Vue.http.post(
    //   '/login/login',
    //   {
    //     username: username,
    //     password: password
    //   }
    // )

    //mock
    return new Promise(function(resolve, reject) {
      if(userMap.hasOwnProperty(username)) {
        resolve({data: {token: username}});
      } else {
        reject('no such user!');
      }
    })
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
    return new Promise(function(resolve, reject) {
      resolve();
    })
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
      resolve({data: userMap[token]});
    })
  }
}

//demo测试用户数据
var userMap = {
  admin: {
    roles: ['admin'],
    avatar: './static/img/avatar/1.jpg',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    avatar: './static/img/avatar/2.jpg',
    name: 'Normal Editor'
  }
}