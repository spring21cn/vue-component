var locales = {
  zh: {
    menu: {
      login: {
        title: '系统登录',
        logIn: '登录',
        username: '账号',
        password: '密码',
        any: '随便填',
      },
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
      login: {
        title: 'Login Form',
        logIn: 'Log in',
        username: 'Username',
        password: 'Password',
        any: 'any'
      },
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
      login: {
        title: 'システムログイン',
        logIn: 'ログイン',
        username: 'ユーザー',
        password: 'パスワード',
        any: 'Any',
      },
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

VueUtil.setLang(VueUtil.getCookie('language') || (typeof clientLang !== "undefined" ? clientLang : 'zh'));