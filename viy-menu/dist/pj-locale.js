var locales = {
  zh: {
    title: {
      dashboard: '首页',
      permission: '权限测试页',
      pagePermission: '页面权限',
      directivePermission: '指令权限',
      externalLink: '外部链接',
      iframePage: 'iframe页面',
    },
    permission: {
      roles: '当前权限',
      switchRoles: '切换权限'
    }
  },
  en: {

  },
  ja: {

  }
};
VueUtil.setLocale("zh", locales.zh);
VueUtil.setLocale("en", locales.en);
VueUtil.setLocale("ja", locales.ja);

VueUtil.setLang(VueUtil.getCookie('language') || 'zh');