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