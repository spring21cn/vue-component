(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(definition);
  } else {
    context.SystemInfo = definition();
  }
})(this, function() {
  'use strict';
  var win = window || {};
  var nav = navigator || {};
  var ua = nav.userAgent;
  var self = {};
  var match = {
    'Trident': ua.indexOf('Trident') !== -1 || ua.indexOf('NET CLR') !== -1,
    'Presto': ua.indexOf('Presto') !== -1,
    'WebKit': ua.indexOf('AppleWebKit') !== -1,
    'Gecko': ua.indexOf('Gecko/') !== -1,
    'Safari': ua.indexOf('Safari') !== -1 || ua.indexOf('iPhone') !== -1 || (ua.indexOf('Macintosh') !== -1 && ua.indexOf('Mobile') !== -1),
    'Chrome': ua.indexOf('Chrome') !== -1 || ua.indexOf('CriOS') !== -1,
    'IE': ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident') !== -1,
    'Edge': ua.indexOf('Edge') !== -1,
    'Firefox': ua.indexOf('Firefox') !== -1 || ua.indexOf('FxiOS') !== -1,
    'Firefox Focus': ua.indexOf('Focus') !== -1,
    'Chromium': ua.indexOf('Chromium') !== -1,
    'Opera': ua.indexOf('Opera') !== -1 || ua.indexOf('OPR') !== -1,
    'Vivaldi': ua.indexOf('Vivaldi') !== -1,
    'Yandex': ua.indexOf('YaBrowser') !== -1,
    'Kindle': ua.indexOf('Kindle') !== -1 || ua.indexOf('Silk/') !== -1,
    '360': ua.indexOf('360EE') !== -1 || ua.indexOf('360SE') !== -1,
    'UC': ua.indexOf('UC') !== -1 || ua.indexOf(' UBrowser') !== -1,
    'QQBrowser': ua.indexOf('QQBrowser') !== -1,
    'QQ': ua.indexOf('QQ/') !== -1,
    'Baidu': ua.indexOf('Baidu') !== -1 || ua.indexOf('BIDUBrowser') !== -1,
    'Maxthon': ua.indexOf('Maxthon') !== -1,
    'Sogou': ua.indexOf('MetaSr') !== -1 || ua.indexOf('Sogou') !== -1,
    'LBBROWSER': ua.indexOf('LBBROWSER') !== -1,
    '2345Explorer': ua.indexOf('2345Explorer') !== -1,
    'TheWorld': ua.indexOf('TheWorld') !== -1,
    'XiaoMi': ua.indexOf('MiuiBrowser') !== -1,
    'Quark': ua.indexOf('Quark') !== -1,
    'Qiyu': ua.indexOf('Qiyu') !== -1,
    'Wechat': ua.indexOf('MicroMessenger') !== -1,
    'Taobao': ua.indexOf('AliApp(TB') !== -1,
    'Alipay': ua.indexOf('AliApp(AP') !== -1,
    'Weibo': ua.indexOf('Weibo') !== -1,
    'Douban': ua.indexOf('com.douban.frodo') !== -1,
    'Suning': ua.indexOf('SNEBUY-APP') !== -1,
    'iQiYi': ua.indexOf('IqiyiApp') !== -1,
    'Windows': ua.indexOf('Windows') !== -1,
    'Linux': ua.indexOf('Linux') !== -1 || ua.indexOf('X11') !== -1,
    'Mac OS': ua.indexOf('Macintosh') !== -1 && navigator.maxTouchPoints && navigator.maxTouchPoints == 0,
    'Android': ua.indexOf('Android') !== -1 || ua.indexOf('Adr') !== -1,
    'Ubuntu': ua.indexOf('Ubuntu') !== -1,
    'FreeBSD': ua.indexOf('FreeBSD') !== -1,
    'Debian': ua.indexOf('Debian') !== -1,
    'Windows Phone': ua.indexOf('IEMobile') !== -1 || ua.indexOf('Windows Phone') !== -1,
    'BlackBerry': ua.indexOf('BlackBerry') !== -1 || ua.indexOf('RIM') !== -1,
    'MeeGo': ua.indexOf('MeeGo') !== -1,
    'Symbian': ua.indexOf('Symbian') !== -1,
    'iOS': ua.indexOf('like Mac OS X') !== -1 || (ua.indexOf('Macintosh') !== -1 && navigator.maxTouchPoints && navigator.maxTouchPoints > 0),
    'Chrome OS': ua.indexOf('CrOS') !== -1,
    'WebOS': ua.indexOf('hpwOS') !== -1,
    'Mobile': ua.indexOf('Android') !== -1 || ua.indexOf('Adr') !== -1 ||  ua.indexOf('Mobile') !== -1 || ua.indexOf('Ios') !== -1 || ua.indexOf('like Mac OS X') !== -1 || ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1 || ua.indexOf('iPod') !== -1  || (ua.indexOf('Trident') === -1 && ua.indexOf('Tablet') !== -1) || (ua.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2)
  };
  if (match['Mobile']) {
    // match['Mobile'] = !(ua.indexOf('iPad') !== -1);
  } else if (win.showModalDialog && win.chrome) {
    match['360'] = true;
  }
  var hash = {
    engine: ['WebKit', 'Trident', 'Gecko', 'Presto'],
    browser: ['Safari', 'Chrome', 'Edge', 'IE', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Kindle', '360', 'UC', 'QQBrowser', 'QQ', 'Baidu', 'Maxthon', 'Sogou', 'LBBROWSER', '2345Explorer', 'TheWorld', 'XiaoMi', 'Quark', 'Qiyu', 'Wechat', 'Taobao', 'Alipay', 'Weibo', 'Douban', 'Suning', 'iQiYi'],
    os: ['Windows', 'Linux', 'Mac OS', 'Android', 'Ubuntu', 'FreeBSD', 'Debian', 'iOS', 'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'Chrome OS', 'WebOS'],
    device: ['Mobile']
  };
  self.device = 'PC';
  if(window.isForceMobile){
    self.device = 'Mobile';
  }
  self.language = (function() {
    var g = (nav.browserLanguage || nav.language);
    var arr = g.split('-');
    if (arr[1]) {
      arr[1] = arr[1].toUpperCase();
    }
    return arr.join('_');
  })();
  for (var s in hash) {
    for (var i = 0; i < hash[s].length; i++) {
      var value = hash[s][i];
      if (match[value]) {
        self[s] = value;
      }
    }
  }
  var osVersion = {
    'Windows': function() {
      var v = ua.replace(/^.*Windows NT ([\d.]+);.*$/, '$1');
      var hash = {
        '6.4': '10',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': '7',
        '6.0': 'Vista',
        '5.2': 'XP',
        '5.1': 'XP',
        '5.0': '2000'
      };
      return hash[v] || v;
    },
    'Android': function() {
      return ua.replace(/^.*Android ([\d.]+);.*$/, '$1');
    },
    'iOS': function() {
      return ua.indexOf('Macintosh') > -1 ? ua.replace(/^.*Version\/([\d.]+).*$/, '$1') : ua.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.');
    },
    'Debian': function() {
      return ua.replace(/^.*Debian\/([\d.]+).*$/, '$1');
    },
    'Windows Phone': function() {
      return ua.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2');
    },
    'Mac OS': function() {
      return ua.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.');
    },
    'WebOS': function() {
      return ua.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1');
    }
  };
  self.osVersion = '';
  if (osVersion[self.os]) {
    self.osVersion = osVersion[self.os]();
    if (self.osVersion == ua) {
      self.osVersion = '';
    }
  }
  var version = {
    'Safari': function() {
      return ua.replace(/^.*Version\/([\d.]+).*$/, '$1');
    },
    'Chrome': function() {
      return ua.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1');
    },
    'IE': function() {
      return ua.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1');
    },
    'Edge': function() {
      return ua.replace(/^.*Edge\/([\d.]+).*$/, '$1');
    },
    'Firefox': function() {
      return ua.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1');
    },
    'Firefox Focus': function() {
      return ua.replace(/^.*Focus\/([\d.]+).*$/, '$1');
    },
    'Chromium': function() {
      return ua.replace(/^.*Chromium\/([\d.]+).*$/, '$1');
    },
    'Opera': function() {
      return ua.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1');
    },
    'Vivaldi': function() {
      return ua.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1');
    },
    'Yandex': function() {
      return ua.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1');
    },
    'Kindle': function() {
      return ua.replace(/^.*Version\/([\d.]+).*$/, '$1');
    },
    'Maxthon': function() {
      return ua.replace(/^.*Maxthon\/([\d.]+).*$/, '$1');
    },
    'QQBrowser': function() {
      return ua.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1');
    },
    'QQ': function() {
      return ua.replace(/^.*QQ\/([\d.]+).*$/, '$1');
    },
    'Baidu': function() {
      return ua.replace(/^.*BIDUBrowser[\s\/]([\d.]+).*$/, '$1');
    },
    'UC': function() {
      return ua.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1');
    },
    'Sogou': function() {
      return ua.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1');
    },
    '2345Explorer': function() {
      return ua.replace(/^.*2345Explorer\/([\d.]+).*$/, '$1');
    },
    'TheWorld': function() {
      return ua.replace(/^.*TheWorld ([\d.]+).*$/, '$1');
    },
    'XiaoMi': function() {
      return ua.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1');
    },
    'Quark': function() {
      return ua.replace(/^.*Quark\/([\d.]+).*$/, '$1');
    },
    'Qiyu': function() {
      return ua.replace(/^.*Qiyu\/([\d.]+).*$/, '$1');
    },
    'Wechat': function() {
      return ua.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1');
    },
    'Taobao': function() {
      return ua.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1');
    },
    'Alipay': function() {
      return ua.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1');
    },
    'Weibo': function() {
      return ua.replace(/^.*weibo__([\d.]+).*$/, '$1');
    },
    'Douban': function() {
      return ua.replace(/^.*com.douban.frodo\/([\d.]+).*$/, '$1');
    },
    'Suning': function() {
      return ua.replace(/^.*SNEBUY-APP([\d.]+).*$/, '$1');
    },
    'iQiYi': function() {
      return ua.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1');
    }
  };
  self.version = '';
  if (version[self.browser]) {
    self.version = version[self.browser]();
    if (self.version == ua) {
      self.version = '';
    }
  }
  return {
    device: self.device,
    os: self.os,
    osVersion: self.osVersion,
    browser: self.browser || '',
    version: self.version || '',
    language: self.language,
  };
});




