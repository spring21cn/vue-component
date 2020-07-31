var locales = {
  zh: {
    title: {
      dashboard: '首页',
      demo: '测试',
      demo01: '测试01',
      demo02: '测试02',
      demo03: '测试03',
      demo04: '测试04',
      demo05: '测试05',
      demo06: '测试06',
      demo07: '测试07',
      more: '更多',
      externalLink: '外部链接',
      iframePage: 'iframe页面',
    },
    menu: {
      login: {
        title: '系统登录',
        logIn: '登录',
        siteCode: '据点代码',
        username: '账号',
        password: '密码',
        any: '随便填',
      }
    }
  },
  en: {
    title: {
      dashboard: 'Dashboard',
      demo: 'Demo',
      demo01: 'Demo01',
      demo02: 'Demo02',
      externalLink: 'External Link',
      iframePage: 'iframe Link',
    },
    menu: {
      login: {
        title: 'Login Form',
        logIn: 'Log in',
        siteCode: 'Site Code',
        username: 'Username',
        password: 'Password',
        any: 'any'
      },
    }
  },
  ja: {
    title: {
      dashboard: 'ダッシュボード',
      demo: 'デモ',
      demo01: 'デモ01',
      demo02: 'デモ02',
      externalLink: '外部リンク',
      iframePage: 'iframe画面',
    },
    menu: {
      login: {
        title: 'システムログイン',
        logIn: 'ログイン',
        siteCode: 'サイトコード',
        username: 'ユーザー',
        password: 'パスワード',
        any: 'Any',
      }
    }
  }
};
VueUtil.setLocale("zh", locales.zh);
VueUtil.setLocale("en", locales.en);
VueUtil.setLocale("ja", locales.ja);

VueUtil.setLang(VueUtil.getCookie('language') || (typeof clientLang !== "undefined" ? clientLang : 'zh'));