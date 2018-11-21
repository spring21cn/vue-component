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
    'Safari': ua.indexOf('Safari') !== -1,
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
    'Mac OS': ua.indexOf('Macintosh') !== -1,
    'Android': ua.indexOf('Android') !== -1 || ua.indexOf('Adr') !== -1,
    'Ubuntu': ua.indexOf('Ubuntu') !== -1,
    'FreeBSD': ua.indexOf('FreeBSD') !== -1,
    'Debian': ua.indexOf('Debian') !== -1,
    'Windows Phone': ua.indexOf('IEMobile') !== -1 || ua.indexOf('Windows Phone') !== -1,
    'BlackBerry': ua.indexOf('BlackBerry') !== -1 || ua.indexOf('RIM') !== -1,
    'MeeGo': ua.indexOf('MeeGo') !== -1,
    'Symbian': ua.indexOf('Symbian') !== -1,
    'iOS': ua.indexOf('like Mac OS X') !== -1,
    'Chrome OS': ua.indexOf('CrOS') !== -1,
    'WebOS': ua.indexOf('hpwOS') !== -1,
    'Mobile': ua.indexOf('Mobi') !== -1 || ua.indexOf('iPh') !== -1 || ua.indexOf('480') !== -1,
    'Tablet': ua.indexOf('Tablet') !== -1 || ua.indexOf('Pad') !== -1 || ua.indexOf('Nexus 7') !== -1
  };
  if (match['Mobile']) {
    match['Mobile'] = !(ua.indexOf('iPad') !== -1);
  } else if (win.showModalDialog && win.chrome) {
    match['360'] = true;
  }
  var hash = {
    engine: ['WebKit', 'Trident', 'Gecko', 'Presto'],
    browser: ['Safari', 'Chrome', 'Edge', 'IE', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Kindle', '360', 'UC', 'QQBrowser', 'QQ', 'Baidu', 'Maxthon', 'Sogou', 'LBBROWSER', '2345Explorer', 'TheWorld', 'XiaoMi', 'Quark', 'Qiyu', 'Wechat', 'Taobao', 'Alipay', 'Weibo', 'Douban', 'Suning', 'iQiYi'],
    os: ['Windows', 'Linux', 'Mac OS', 'Android', 'Ubuntu', 'FreeBSD', 'Debian', 'iOS', 'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'Chrome OS', 'WebOS'],
    device: ['Mobile', 'Tablet']
  };
  self.device = 'PC';
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
      return ua.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.');
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
    browser: self.browser,
    version: self.version,
    language: self.language,
  };
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(definition);
  } else {
    context.DateUtil = definition();
  }
})(this, function() {
  'use strict';
  var fecha = {};
  var token = /d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
  var twoDigits = /\d\d?/;
  var threeDigits = /\d{3}/;
  var fourDigits = /\d{4}/;
  var word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
  var noop = function() {};
  var shorten = function(arr, sLen) {
    var newArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      newArr.push(arr[i].substr(0, sLen));
    }
    return newArr;
  };
  var monthUpdate = function(arrName) {
    return function(d, v, i18n) {
      var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
      if (~index) {
        d.month = index;
      }
    };
  };
  var pad = function(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
      val = '0' + val;
    }
    return val;
  };
  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthNamesShort = shorten(monthNames, 3);
  var dayNamesShort = shorten(dayNames, 3);
  var formatFlags = {
    D: function(dateObj) {
      return dateObj.getDay();
    },
    DD: function(dateObj) {
      return pad(dateObj.getDay());
    },
    Do: function(dateObj, i18n) {
      return i18n.DoFn(dateObj.getDate());
    },
    d: function(dateObj) {
      return dateObj.getDate();
    },
    dd: function(dateObj) {
      return pad(dateObj.getDate());
    },
    ddd: function(dateObj, i18n) {
      return i18n.dayNamesShort[dateObj.getDay()];
    },
    dddd: function(dateObj, i18n) {
      return i18n.dayNames[dateObj.getDay()];
    },
    M: function(dateObj) {
      return dateObj.getMonth() + 1;
    },
    MM: function(dateObj) {
      return pad(dateObj.getMonth() + 1);
    },
    MMM: function(dateObj, i18n) {
      return i18n.monthNamesShort[dateObj.getMonth()];
    },
    MMMM: function(dateObj, i18n) {
      return i18n.monthNames[dateObj.getMonth()];
    },
    yy: function(dateObj) {
      return String(dateObj.getFullYear()).substr(2);
    },
    yyyy: function(dateObj) {
      return dateObj.getFullYear();
    },
    h: function(dateObj) {
      return dateObj.getHours() % 12 || 12;
    },
    hh: function(dateObj) {
      return pad(dateObj.getHours() % 12 || 12);
    },
    H: function(dateObj) {
      return dateObj.getHours();
    },
    HH: function(dateObj) {
      return pad(dateObj.getHours());
    },
    m: function(dateObj) {
      return dateObj.getMinutes();
    },
    mm: function(dateObj) {
      return pad(dateObj.getMinutes());
    },
    s: function(dateObj) {
      return dateObj.getSeconds();
    },
    ss: function(dateObj) {
      return pad(dateObj.getSeconds());
    },
    S: function(dateObj) {
      return Math.round(dateObj.getMilliseconds() / 100);
    },
    SS: function(dateObj) {
      return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
    },
    SSS: function(dateObj) {
      return pad(dateObj.getMilliseconds(), 3);
    },
    a: function(dateObj, i18n) {
      return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
    },
    A: function(dateObj, i18n) {
      return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
    },
    ZZ: function(dateObj) {
      var o = dateObj.getTimezoneOffset();
      return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4);
    }
  };
  var parseFlags = {
    d: [twoDigits, function(d, v) {
      d.day = v;
    }],
    M: [twoDigits, function(d, v) {
      d.month = v - 1;
    }],
    yy: [twoDigits, function(d, v) {
      var da = new Date()
        , cent = +('' + da.getFullYear()).substr(0, 2);
      d.year = '' + (v > 68 ? cent - 1 : cent) + v;
    }],
    h: [twoDigits, function(d, v) {
      d.hour = v;
    }],
    m: [twoDigits, function(d, v) {
      d.minute = v;
    }],
    s: [twoDigits, function(d, v) {
      d.second = v;
    }],
    yyyy: [fourDigits, function(d, v) {
      d.year = v;
    }],
    S: [/\d/, function(d, v) {
      d.millisecond = v * 100;
    }],
    SS: [/\d{2}/, function(d, v) {
      d.millisecond = v * 10;
    }],
    SSS: [threeDigits, function(d, v) {
      d.millisecond = v;
    }],
    D: [twoDigits, noop],
    ddd: [word, noop],
    MMM: [word, monthUpdate('monthNamesShort')],
    MMMM: [word, monthUpdate('monthNames')],
    a: [word, function(d, v, i18n) {
      var val = v.toLowerCase();
      if (val === i18n.amPm[0]) {
        d.isPm = false;
      } else if (val === i18n.amPm[1]) {
        d.isPm = true;
      }
    }],
    ZZ: [/[\+\-]\d\d:?\d\d/, function(d, v) {
      var parts = (v + '').match(/([\+\-]|\d\d)/gi), minutes;
      if (parts) {
        minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
        d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
      }
    }]
  };
  parseFlags.DD = parseFlags.D;
  parseFlags.dddd = parseFlags.ddd;
  parseFlags.Do = parseFlags.dd = parseFlags.d;
  parseFlags.mm = parseFlags.m;
  parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
  parseFlags.MM = parseFlags.M;
  parseFlags.ss = parseFlags.s;
  parseFlags.A = parseFlags.a;
  fecha.i18n = {
    dayNamesShort: dayNamesShort,
    dayNames: dayNames,
    monthNamesShort: monthNamesShort,
    monthNames: monthNames,
    amPm: ['am', 'pm'],
    DoFn: function DoFn(D) {
      return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
    }
  };
  fecha.masks = {
    'default': 'ddd MMM dd yyyy HH:mm:ss',
    shortDate: 'M/D/yy',
    mediumDate: 'MMM d, yyyy',
    longDate: 'MMMM d, yyyy',
    fullDate: 'dddd, MMMM d, yyyy',
    shortTime: 'HH:mm',
    mediumTime: 'HH:mm:ss',
    longTime: 'HH:mm:ss.SSS'
  };
  fecha.format = function(dateObj, mask, i18nSettings) {
    var i18n = i18nSettings || fecha.i18n;
    if (typeof dateObj === 'number') {
      dateObj = new Date(dateObj);
    }
    if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
      throw 'Invalid Date in fecha.format';
    }
    mask = fecha.masks[mask] || mask || fecha.masks['default'];
    return mask.replace(token, function($0) {
      return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
    });
  };
  fecha.parse = function(dateStr, format, i18nSettings) {
    var i18n = i18nSettings || fecha.i18n;
    if (typeof format !== 'string') {
      throw 'Invalid format in fecha.parse';
    }
    format = fecha.masks[format] || format;
    if (dateStr.length > 1000) {
      return null;
    }
    var isValid = true;
    var dateInfo = {};
    format.replace(token, function($0) {
      if (parseFlags[$0]) {
        var info = parseFlags[$0];
        var index = dateStr.search(info[0]);
        if (!~index) {
          isValid = false;
        } else {
          dateStr.replace(info[0], function(result) {
            info[1](dateInfo, result, i18n);
            dateStr = dateStr.substr(index + result.length);
            return result;
          });
        }
      }
      return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
    });
    if (!isValid) {
      return null;
    }
    var today = new Date();
    if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
      dateInfo.hour = +dateInfo.hour + 12;
    } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
      dateInfo.hour = 0;
    }
    var date;
    if (dateInfo.timezoneOffset != null) {
      dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
      date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1, dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
    } else {
      date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1, dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
    }
    return date;
  };
  return fecha;
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'SystemInfo', 'DateUtil', 'VueI18n', 'VueResource'], definition);
  } else {
    context.VueUtil = definition(context.Vue, context.SystemInfo, context.DateUtil);
    delete context.SystemInfo;
    delete context.DateUtil;
    delete context.VueResource;
    delete context.VueI18n;
  }
})(this, function(Vue, SystemInfo, DateUtil) {
  'use strict';
  var version = '1.50.180920';
  var _toString = Object.prototype.toString;
  var _map = Array.prototype.map;
  var _filter = Array.prototype.filter;
  var isDef = function(v) {
    return v !== undefined && v !== null;
  };
  var objType = function(obj) {
    return _toString.call(obj).slice(8, -1);
  };
  var isString = function(obj) {
    return objType(obj) === 'String';
  };
  var isNumber = function(obj) {
    return objType(obj) === 'Number' && obj === obj;
  };
  var isBoolean = function(obj) {
    return objType(obj) === 'Boolean';
  };
  var isFile = function(obj) {
    return objType(obj) === 'File';
  };
  var isObject = function(obj) {
    return objType(obj) === 'Object';
  };
  var isArray = function(obj) {
    return objType(obj) === 'Array';
  };
  var isFunction = function(obj) {
    return objType(obj) === 'Function';
  };
  var isDate = function(obj) {
    return objType(obj) === 'Date';
  };
  var isNodeList = function(obj) {
    return objType(obj) === 'NodeList';
  };
  var isElement = function(obj) {
    return objType(obj).indexOf('Element') !== -1;
  };
  var isVNode = function(node) {
    return isObject(node) && node.hasOwnProperty('componentOptions');
  };
  var isVueComponent = function(node) {
    return isObject(node) && node.hasOwnProperty('$root');
  };
  var toString = function(val) {
    return !isDef(val) ? '' : typeof val === 'object' ? JSON.stringify(val) : String(val);
  };
  var toDate = function(date) {
    return (!isDef(date) || isNaN(new Date(date).getTime())) ? null : new Date(date);
  };
  var formatNumber = function(number, dec, dsep, tsep) {
    isDef(number) && (number = number*1);
    if (!isNumber(number)) return null;
    isDef(dec) && (dec = dec*1);
    if (!isNumber(dec)) dec = 2;
    number = number.toFixed(dec);
    if (!isString(dsep)) dsep = '.';
    if (!isString(tsep)) tsep = ',';
    var parts = number.split('.');
    var fnums = parts[0];
    var decimals = parts[1] ? dsep + parts[1] : '';
    return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
  };
  var formatDate = function(date, format) {
    date = toDate(date);
    if (!isDef(date)) return null;
    return DateUtil.format(date, format || 'yyyy-MM-dd');
  };
  var parseDate = function(string, format) {
    var str = formatDate(string, format);
    if (!isDef(str)) str = string;
    return DateUtil.parse(str, format || 'yyyy-MM-dd');
  };
  var getDayCountOfMonth = function(year, month) {
    isDef(year) && (year = year*1);
    isDef(month) && (month = month*1);
    if (!isNumber(year) || !isNumber(month)) return null;
    month--;
    if (month === 3 || month === 5 || month === 8 || month === 10) {
      return 30;
    }
    if (month === 1) {
      if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
        return 29;
      } else {
        return 28;
      }
    }
    return 31;
  };
  var getFirstDayOfMonth = function(date) {
    var temp = toDate(date);
    if (!isDate(temp)) return null;
    temp.setDate(1);
    return temp.getDay();
  };
  var getWeekNumber = function(date) {
    date = toDate(date);
    if (!isDate(date)) return null;
    date.setHours(0, 0, 0, 0);
    date.setTime((date.getTime() + (6 - date.getDay()) * 86400000));
    var firstDate = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.getTime() - firstDate.getTime()) / 86400000) / 7);
  };
  var addDate = function(src, num, type) {
    src = toDate(src);
    isDef(num) && (num = num*1);
    if (!isDate(src) || !isNumber(num)) return null;
    if (type !== 'week' && type !== 'day' && type !== 'month' && type !== 'year') type = 'day';
    var result = new Date();
    switch (type.toLowerCase()) {
      case 'week':
        var week = 7;
        break;
      case 'day':
        result.setTime(src.getTime() + 86400000 * num * (week || 1));
        break;
      case 'month':
        var year = src.getFullYear();
        var month = src.getMonth();
        var date = src.getDate();
        var addMonth = 1;
        if (num < 0) {
          addMonth = -1;
          num = -num;
        }
        while (num--) {
          if (addMonth > 0) {
            year = month === 11 ? year + addMonth : year;
            month = month === 11 ? 0 : month + addMonth;
          } else {
            year = month === 0 ? year + addMonth : year;
            month = month === 0 ? 11 : month + addMonth;
          }
        }
        var newMonthDayCount = getDayCountOfMonth(year, month);
        if (newMonthDayCount < date) {
          src.setDate(newMonthDayCount);
        }
        src.setMonth(month);
        src.setFullYear(year);
        result.setTime(src.getTime());
        break;
      case 'year':
        src.setFullYear(src.getFullYear() + num);
        result.setTime(src.getTime());
        break;
    }
    return result;
  };
  var loop = function(arr, fn) {
    if (isDef(arr) && isNumber(arr.length) && isFunction(fn)) {
      for (var i=0, j=arr.length; i<j; i++) {
        if (fn(arr[i], i) === false) break;
      }
    }
  };
  var ownPropertyLoop = function (obj, fn) {
    isDef(obj) && loop(Object.keys(obj), fn);
  };
  var map = function(arr, fn) {
    if (isArray(arr) && isFunction(fn)) {
      return _map.call(arr, fn);
    }
    return [];
  };
  var filter = function(arr, fn) {
    if (isArray(arr) && isFunction(fn)) {
      return _filter.call(arr, fn);
    }
    return [];
  };
  var trim = function(str) {
    if (!isString(str)) str = '';
    return str.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
  };
  var deepCopy = function(obj, parent) {
    if (!isDef(parent)) parent = null;
    var result = {};
    if (isArray(obj)) result = [];
    var _parent = parent;
    while (_parent) {
      if (_parent.originalParent === obj) {
        return _parent.currentParent;
      }
      _parent = _parent.parent;
    }
    ownPropertyLoop(obj, function(key) {
      var temp = obj[key];
      if (temp && typeof temp === 'object') {
        result[key] = deepCopy(temp, {
          originalParent: obj,
          currentParent: result,
          parent: parent
        });
      } else {
        result[key] = temp;
      }
    });
    return result;
  };
  var merge = function(target) {
    loop(arguments, function(source, index) {
      if (index === 0) return;
      ownPropertyLoop(source, function(prop) {
        if (isObject(target[prop]) && isObject(source[prop])) {
          target[prop] = merge({}, target[prop], source[prop]);
        } else {
          isDef(source[prop]) && (target[prop] = source[prop]);
        }
      });
    });
    return target;
  };
  var mergeArray = function(target) {
    if (!isArray(target)) target = [];
    loop(arguments, function(array, index) {
      if (index === 0 || !isDef(array)) return;
      if (!isArray(array)) {
        target.push(array);
      } else {
        loop(array, function(item) {
          if (isArray(item)) item = mergeArray([], item);
          target.push(item);
        });
      }
    });
    return target;
  };
  var createUuid = function() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };
  var on = function(el, event, handler, options) {
    if (el && event && handler) {
      if (!isDef(options)) options = {passive: false};
      el.addEventListener(event, handler, options);
    }
  };
  var off = function(el, event, handler, options) {
    if (el && event) {
      if (!isDef(options)) options = {passive: false};
      el.removeEventListener(event, handler, options);
    }
  };
  var once = function(el, event, handler, options) {
    var listener = function() {
      isFunction(handler) && handler.apply(this, arguments);
      off(el, event, listener, options);
    };
    on(el, event, listener, options);
  };
  var removeNode = function(node) {
    node && node.parentElement && node.parentElement.removeChild(node);
  };
  var insertNodeAt = function(fatherNode, node, position) {
    isDef(position) && (position = position*1);
    if (!isNumber(position)) position = 0;
    var refNode = (position === 0) ? fatherNode.firstElementChild : fatherNode.children[position - 1].nextElementSibling;
    fatherNode.insertBefore(node, refNode);
  };
  var scrollBarWidth = function() {
    if (!isNumber(document.__scrollBarWidth__)) {
      var inner = document.createElement('div');
      inner.style.width = '100%';
      var outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.width = '100px';
      outer.style.overflow = 'scroll';
      outer.appendChild(inner);
      document.body.appendChild(outer);
      document.__scrollBarWidth__ = outer.offsetWidth - inner.offsetWidth;
      removeNode(inner);
      removeNode(outer);
    }
    return document.__scrollBarWidth__;
  };
  var hasClass = function(el, clazz) {
    if (!isElement(el) || !isString(clazz)) return false;
    return el.classList.contains(clazz);
  };
  var addClass = function(el, clazz) {
    if (isElement(el) && isString(clazz)) el.classList.add(clazz);
  };
  var removeClass = function(el, clazz) {
    if (isElement(el) && isString(clazz)) el.classList.remove(clazz);
  };
  var getStyle = function(el, styleName) {
    if (!isElement(el) || !isString(styleName)) return null;
    if (styleName === 'float') {
      styleName = 'cssFloat';
    }
    return el.style[styleName] || getComputedStyle(el, null)[styleName];
  };
  var setStyle = function(el, styleName, value) {
    if (!isElement(el) || !isString(styleName)) return;
    el.style[styleName] = value;
  };
  var getCookie = function(name) {
    var arr = document.cookie.replace(/\s/g, '').split(';');
    for (var i = 0, j = arr.length; i < j; i++) {
      var tempArr = arr[i].split('=');
      if (tempArr[0] === name) return decodeURIComponent(tempArr[1]);
    }
    return null;
  };
  var setCookie = function(name, value, days) {
    isDef(days) && (days = days*1);
    if (!isNumber(days)) days = 1;
    var date = addDate((new Date), days);
    document.cookie = name + '=' + value + ';expires=' + date;
  };
  var removeCookie = function(name) {
    var val = getCookie(name);
    setCookie(name, val, -1);
  };
  var performance = function(delay, callback, throttleflg) {
    if (!isFunction(callback)) {
      callback = delay;
      delay = null;
    }
    if (!isFunction(callback)) return function() {};
    var defaultTimer = Object.create(null);
    var setTimer = requestAnimationFrame;
    var clearTimer = cancelAnimationFrame;
    if (isNumber(delay)) {
      setTimer = setTimeout;
      clearTimer = clearTimeout;
    }
    return function() {
      var self = this;
      var timer = null;
      if (!isDef(self)) {
        timer = defaultTimer;
      } else {
        if (!isDef(self[callback])) self[callback] = Object.create(null);
        timer = self[callback];
      }
      var args = arguments;
      if (throttleflg) {
        if (isDef(timer.__timer__)) return false;
      } else {
        clearTimer(timer.__timer__);
      }
      timer.__timer__ = setTimer(function() {
        callback.apply(self, args);
        clearTimer(timer.__timer__);
        timer.__timer__ = null;
      }, delay);
    };
  };
  var throttle = function(delay, callback) {
    return performance(delay, callback, true);
  };
  var debounce = function(delay, callback) {
    return performance(delay, callback);
  };
  var resizeListener = function(el, fn, removeFlg) {
    if (!isFunction(fn)) {
      fn = el;
      el = document.body;
    }
    if (!isArray(el.__resizeListeners__)) {
      var resetTrigger = function(el) {
        var trigger = el.__resizeTrigger__;
        var expand = trigger.firstElementChild;
        var contract = trigger.lastElementChild;
        var expandChild = expand.firstElementChild;
        contract.scrollLeft = contract.scrollWidth;
        contract.scrollTop = contract.scrollHeight;
        expandChild.style.width = expand.offsetWidth + 1 + 'px';
        expandChild.style.height = expand.offsetHeight + 1 + 'px';
        expand.scrollLeft = expand.scrollWidth;
        expand.scrollTop = expand.scrollHeight;
      };
      var resizeListeners = function(el, event) {
        if (el.offsetWidth !== el.__resizeLast__.width || el.offsetHeight !== el.__resizeLast__.height) {
          el.__resizeLast__.width = el.offsetWidth;
          el.__resizeLast__.height = el.offsetHeight;
          loop(el.__resizeListeners__, function(resizeListener) {
            resizeListener.call(el, event);
          });
        }
      };
      var scrollListener = debounce(function(event) {
        resetTrigger(el);
        resizeListeners(el, event);
      });
      var resizeStart = function(event) {
        if (event.animationName === 'resizeanim') {
          resetTrigger(el);
        }
      };
      if (getStyle(el, 'position') === 'static') {
        setStyle(el, 'position', 'relative');
      }
      var resizeTrigger = el.__resizeTrigger__ = document.createElement('div');
      resizeTrigger.className = 'resize-triggers';
      resizeTrigger.innerHTML = '<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>';
      on(resizeTrigger, 'animationstart', resizeStart);
      el.__resizeLast__ = {};
      el.__resizeListeners__ = [];
      el.appendChild(resizeTrigger);
      on(el, 'scroll', scrollListener, true);
    }
    if (removeFlg) {
      var index = el.__resizeListeners__.indexOf(fn);
      index !== -1 && el.__resizeListeners__.splice(index, 1);
    } else {
      isFunction(fn) && el.__resizeListeners__.push(fn);
    }
  };
  var addResizeListener = function(el, fn) {
    resizeListener(el, fn);
  };
  var removeResizeListener = function(el, fn) {
    resizeListener(el, fn, true);
  };
  var addHoverListener = function(el, inFn, outFn) {
    if (!isFunction(inFn)) return;
    on(el, 'mouseenter', inFn);
    if (!isFunction(outFn)) outFn = inFn;
    on(el, 'mouseleave', outFn);
  };
  var removeHoverListener = function(el, inFn, outFn) {
    if (!isFunction(inFn)) return;
    off(el, 'mouseenter', inFn);
    if (!isFunction(outFn)) outFn = inFn;
    off(el, 'mouseleave', outFn);
  };
  var addTouchStart = function(el, fn) {
    on(el, 'mousedown', fn);
    on(el, 'touchstart', fn);
  };
  var removeTouchStart = function(el, fn) {
    off(el, 'mousedown', fn);
    off(el, 'touchstart', fn);
  };
  var addTouchMove = function(el, fn) {
    on(el, 'mousemove', fn);
    on(el, 'touchmove', fn);
  };
  var removeTouchMove = function(el, fn) {
    off(el, 'mousemove', fn);
    off(el, 'touchmove', fn);
  };
  var addTouchEnd = function(el, fn) {
    on(el, 'mouseup', fn);
    on(el, 'touchend', fn);
  };
  var removeTouchEnd = function(el, fn) {
    off(el, 'mouseup', fn);
    off(el, 'touchend', fn);
  };
  var screenfull = function() {
    var fn = (function() {
      var fnMap = [['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror']
            , ['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitFullscreenEnabled', 'webkitfullscreenchange', 'webkitfullscreenerror']
            , ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitfullscreenerror']
            , ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror']
            , ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError']];
      var ret = {};
      for (var i = 0, l = fnMap.length; i < l; i++) {
        var val = fnMap[i];
        if (val[1] in document) {
          for (i = 0; i < val.length; i++) {
            ret[fnMap[0][i]] = val[i];
          }
          return ret;
        }
      }
      return null;
    })();
    if (!isDef(fn)) {
      Vue.notify.warning({message: Vue.t('vue.screenfull.canot')});
      return false;
    }
    var screenfull = {
      request: function(elem) {
        var request = fn.requestFullscreen;
        elem = elem || document.documentElement;
        if (/5\.1[.\d]* Safari/.test(navigator.userAgent)) {
          elem[request]();
        } else {
          elem[request]('ALLOW_KEYBOARD_INPUT' in Element && Element.ALLOW_KEYBOARD_INPUT);
        }
      },
      exit: function() {
        document[fn.exitFullscreen]();
      },
      toggle: function(elem) {
        if (this.isFullscreen) {
          this.exit();
        } else {
          this.request(elem);
        }
      },
      onchange: function(callback) {
        on(document, fn.fullscreenchange, callback);
      },
      onerror: function(callback) {
        on(document, fn.fullscreenerror, callback);
      },
      raw: fn
    };
    Object.defineProperties(screenfull, {
      isFullscreen: {
        get: function() {
          return Boolean(document[fn.fullscreenElement]);
        }
      },
      element: {
        enumerable: true,
        get: function() {
          return document[fn.fullscreenElement];
        }
      },
      enabled: {
        enumerable: true,
        get: function() {
          return Boolean(document[fn.fullscreenEnabled]);
        }
      }
    });
    if (!isDef(screenfull.enabled)) {
      Vue.notify.warning({message: Vue.t('vue.screenfull.canot')});
      return false;
    }
    screenfull.toggle();
  };
  var getSystemInfo = function() {
    return SystemInfo;
  };
  var setLang = function(lang) {
    if (isString(lang)) Vue.config.lang = lang;
  };
  var setLocale = function(lang, langObjs) {
    Vue.locale(lang, merge({}, Vue.locale(lang), langObjs));
  };
  var popupManager = {
    instances: {},
    zIndex: 2000,
    getInstance: function(id) {
      return popupManager.instances[id];
    },
    register: function(id, instance) {
      if (id && instance) {
        popupManager.instances[id] = instance;
      }
    },
    deregister: function(id) {
      if (id) {
        popupManager.instances[id] = null;
        delete popupManager.instances[id];
      }
    },
    setZindex: function(value) {
        return popupManager.zIndex = value;
    },
    nextZIndex: function() {
      return popupManager.zIndex++;
    },
    modalStack: [],
    openModal: function(id, zIndex) {
      if (!isDef(id) || !isDef(zIndex)) return;
      var modalStack = this.modalStack;
      for (var i = 0, j = modalStack.length; i < j; i++) {
        var item = modalStack[i];
        if (item.id === id) return;
      }
      this.modalStack.push({
        id: id,
        zIndex: zIndex
      });
    },
    closeModal: function(id) {
      var modalStack = this.modalStack;
      if (modalStack.length > 0) {
        var topItem = modalStack[modalStack.length - 1];
        if (topItem.id === id) {
          modalStack.pop();
        } else {
          for (var i = modalStack.length - 1; i >= 0; i--) {
            if (modalStack[i].id === id) {
              modalStack.splice(i, 1);
              break;
            }
          }
        }
      }
    }
  };
  var emitter = {
    methods: {
      dispatch: function(componentName, eventName, params) {
        var parent = this.$parent || this.$root;
        var name = parent.$options.name;
        while (parent && (!isDef(name) || name !== componentName)) {
          parent = parent.$parent;
          if (parent) {
            name = parent.$options.name;
          }
        }
        if (parent) {
          parent.$emit.apply(parent, mergeArray([eventName], params));
        }
      },
      broadcast: function(componentName, eventName, params) {
        var broadcast = function(componentName, eventName, params) {
          loop(this.$children, function(child) {
            var name = child.$options.name;
            if (name === componentName) {
              child.$emit.apply(child, mergeArray([eventName], params));
            } else {
              broadcast.apply(child, mergeArray([componentName, eventName], [params]));
            }
          });
        };
        broadcast.call(this, componentName, eventName, params);
      }
    }
  };
  var menumixin = {
    computed: {
      indexPath: function() {
        var path = [this.index];
        var parent = this.$parent;
        while (parent.$options.name !== 'VueMenu') {
          if (parent.index) {
            path.unshift(parent.index);
          }
          parent = parent.$parent;
        }
        return path;
      },
      rootMenu: function() {
        var parent = this.$parent;
        while (parent && parent.$options.name !== 'VueMenu') {
          parent = parent.$parent;
        }
        return parent;
      },
      parentMenu: function() {
        var parent = this.$parent;
        while (parent && ['VueMenu', 'VueSubmenu'].indexOf(parent.$options.name) === -1) {
          parent = parent.$parent;
        }
        return parent;
      },
      paddingStyle: function() {
        if (this.rootMenu.mode !== 'vertical') return {};
        var padding = 20;
        var parent = this.$parent;
        while (parent && parent.$options.name !== 'VueMenu') {
          if (parent.$options.name === 'VueSubmenu') {
            padding += 20;
          }
          parent = parent.$parent;
        }
        return {
          paddingLeft: padding + 'px'
        };
      }
    }
  };
  var collapseTransition = {
    functional: true,
    render: function(createElement, obj) {
      var vueComponent = obj.parent;
      var children = obj.children;
      var data = {
        on: {
          'beforeEnter': function(el) {
            if (!isDef(el.dataset)) el.dataset = {};
            el.dataset.oldPaddingTop = el.style.paddingTop;
            el.dataset.oldPaddingBottom = el.style.paddingBottom;
            el.style.height = '0';
            el.style.paddingTop = 0;
            el.style.paddingBottom = 0;
            if (isFunction(vueComponent.collapseBeforeEnter)) {
              vueComponent.collapseBeforeEnter();
            }
          },
          'enter': function(el) {
            el.dataset.oldOverflow = el.style.overflow;
            if (el.scrollHeight !== 0) {
              el.style.height = el.scrollHeight + 'px';
              el.style.paddingTop = el.dataset.oldPaddingTop;
              el.style.paddingBottom = el.dataset.oldPaddingBottom;
            } else {
              el.style.height = '';
              el.style.paddingTop = el.dataset.oldPaddingTop;
              el.style.paddingBottom = el.dataset.oldPaddingBottom;
            }
            el.style.overflow = 'hidden';
            if (isFunction(vueComponent.collapseEnter)) {
              vueComponent.collapseEnter();
            }
          },
          'afterEnter': function(el) {
            el.style.height = '';
            el.style.overflow = el.dataset.oldOverflow;
            if (isFunction(vueComponent.collapseAfterEnter)) {
              vueComponent.collapseAfterEnter();
            }
          },
          'beforeLeave': function(el) {
            if (!isDef(el.dataset)) el.dataset = {};
            el.dataset.oldPaddingTop = el.style.paddingTop;
            el.dataset.oldPaddingBottom = el.style.paddingBottom;
            el.dataset.oldOverflow = el.style.overflow;
            el.style.height = el.scrollHeight + 'px';
            el.style.overflow = 'hidden';
            if (isFunction(vueComponent.collapseBeforeLeave)) {
              vueComponent.collapseBeforeLeave();
            }
          },
          'leave': function(el) {
            if (el.scrollHeight !== 0) {
              el.style.height = 0;
              el.style.paddingTop = 0;
              el.style.paddingBottom = 0;
            }
            if (isFunction(vueComponent.collapseLeave)) {
              vueComponent.collapseLeave();
            }
          },
          'afterLeave': function(el) {
            el.style.height = '';
            el.style.overflow = el.dataset.oldOverflow;
            el.style.paddingTop = el.dataset.oldPaddingTop;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
            if (isFunction(vueComponent.collapseAfterLeave)) {
              vueComponent.collapseAfterLeave();
            }
          }
        }
      };
      loop(children, function(child) {
        child.data.class = ['collapse-transition'];
      });
      return createElement('transition', data, children);
    }
  };
  var clickoutside = function() {
    var nodes = document.__clickoutsideNodes__;
    var CTX = '__clickoutsideContext__';
    if (!isArray(nodes)) {
      nodes = document.__clickoutsideNodes__ = [];
      var clickOutSideFn = function(e) {
        loop(nodes, function(node) {
          var vnode = node[CTX].vnode;
          var binding = node[CTX].binding;
          if (!isDef(vnode) || !isDef(vnode.context) || !isDef(e.target) || node.contains(e.target) || node === e.target || (isDef(vnode.context.popperElm) && vnode.context.popperElm.contains(e.target))) return;
          if (isDef(binding.expression) && isFunction(vnode.context[binding.expression])) {
            vnode.context[binding.expression]();
          } else {
            isFunction(binding.value) && binding.value();
          }
        });
      };
      on(document, 'click', clickOutSideFn);
    }
    return {
      bind: function(el, binding, vnode) {
        el[CTX] = {
          id: createUuid(),
          vnode: vnode,
          binding: binding
        };
        nodes.push(el);
      },
      update: function(el, binding, vnode) {
        el[CTX].binding = binding;
        el[CTX].vnode = vnode;
      },
      unbind: function(el) {
        var id = el[CTX].id;
        loop(nodes, function(node, i) {
          if (node[CTX].id === id) {
            nodes.splice(i, 1);
            delete el[CTX];
            return false;
          }
        });
      }
    };
  };
  var getScrollParent = function(el) {
    var parent = el.parentNode;
    if (!isDef(parent)) {
      return el;
    }
    if (parent === document) {
      if (document.body.scrollTop) {
        return document.body;
      } else {
        return document.documentElement;
      }
    }
    if ((['scroll', 'auto'].indexOf(getStyle(parent, 'overflowX')) !== -1 && parent.scrollWidth > parent.clientWidth)
     || (['scroll', 'auto'].indexOf(getStyle(parent, 'overflowY')) !== -1 && parent.scrollHeight > parent.clientHeight)
     || hasClass(parent, 'vue-scrollbar__wrap')) {
      return parent;
    }
    return getScrollParent(el.parentNode);
  };
  var config = new Vue({
    data: function() {
      return {
        notifyStack: false,
        produceModel: false
      };
    },
    watch: {
      produceModel: function(val) {
        Vue.config.productionTip = !val;
        Vue.config.devtools = !val;
        Vue.config.silent = val;
      }
    }
  });
  var VueUtil = {
    isDef: isDef,
    isString: isString,
    isNumber: isNumber,
    isBoolean: isBoolean,
    isFile: isFile,
    isObject: isObject,
    isArray: isArray,
    isFunction: isFunction,
    isDate: isDate,
    isNodeList: isNodeList,
    isElement: isElement,
    isVNode: isVNode,
    isVueComponent: isVueComponent,
    toString: toString,
    toDate: toDate,
    formatNumber: formatNumber,
    formatDate: formatDate,
    parseDate: parseDate,
    getDayCountOfMonth: getDayCountOfMonth,
    getFirstDayOfMonth: getFirstDayOfMonth,
    getWeekNumber: getWeekNumber,
    addDate: addDate,
    loop: loop,
    ownPropertyLoop: ownPropertyLoop,
    map: map,
    filter: filter,
    trim: trim,
    deepCopy: deepCopy,
    merge: merge,
    mergeArray: mergeArray,
    createUuid: createUuid,
    on: on,
    off: off,
    once: once,
    removeNode: removeNode,
    insertNodeAt: insertNodeAt,
    scrollBarWidth: scrollBarWidth,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    getStyle: getStyle,
    setStyle: setStyle,
    getCookie: getCookie,
    setCookie: setCookie,
    removeCookie: removeCookie,
    throttle: throttle,
    debounce: debounce,
    addResizeListener: addResizeListener,
    removeResizeListener: removeResizeListener,
    addHoverListener: addHoverListener,
    removeHoverListener: removeHoverListener,
    addTouchStart: addTouchStart,
    addTouchMove: addTouchMove,
    addTouchEnd: addTouchEnd,
    removeTouchStart: removeTouchStart,
    removeTouchMove: removeTouchMove,
    removeTouchEnd: removeTouchEnd,
    screenfull: screenfull,
    getSystemInfo: getSystemInfo,
    setLang: setLang,
    setLocale: setLocale,
    config: config,
    nextZIndex: popupManager.nextZIndex,
    setZIndex: popupManager.setZindex,
    version: version,
    isIE: SystemInfo.browser.toLowerCase() === 'ie',
    isFirefox: SystemInfo.browser.toLowerCase() === 'firefox',
    isChrome: SystemInfo.browser.toLowerCase() === 'chrome',
    component: {
      menumixin: menumixin,
      emitter: emitter,
      collapseTransition: collapseTransition,
      clickoutside: clickoutside,
      popupManager: popupManager,
      getScrollParent: getScrollParent
    }
  };
   Vue.prototype.$vu = VueUtil;
  return VueUtil;
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(definition);
  } else {
    context.Sortable = definition();
  }
})(this, function() {
  'use strict';
  var dragEl;
  var parentEl;
  var ghostEl;
  var cloneEl;
  var rootEl;
  var nextEl;
  var lastDownEl;
  var scrollEl;
  var scrollParentEl;
  var scrollCustomFn;
  var lastEl;
  var lastCSS;
  var lastParentCSS;
  var oldIndex;
  var newIndex;
  var activeGroup;
  var putSortable;
  var autoScroll = {};
  var tapEvt;
  var touchEvt;
  var moved;
  var R_SPACE = /\s+/g;
  var R_FLOAT = /left|right|inline/;
  var expando = 'Sortable' + (new Date).getTime();
  var win = window;
  var document = win.document;
  var parseInt = win.parseInt;
  var requestAnimationFrame = win.requestAnimationFrame;
  var cancelAnimationFrame = win.cancelAnimationFrame;
  var Polymer = win.Polymer;
  var captureMode = false;
  var passiveMode = false;
  var supportDraggable = ('draggable' in document.createElement('div'));
  var supportCssPointerEvents = (function(el) {
    if (navigator.userAgent.match(/(?:Trident.*rv[ :]?11\.|msie)/i)) {
      return false;
    }
    el = document.createElement('x');
    el.style.cssText = 'pointer-events:auto';
    return el.style.pointerEvents === 'auto';
  })();
  var _silent = false;
  var abs = Math.abs;
  var min = Math.min;
  var savedInputChecked = [];
  var touchDragOverListeners = [];
  var _autoScroll = _throttle(function(evt, options, rootEl) {
    if (rootEl && options.scroll) {
      var _this = rootEl[expando], el, rect, sens = options.scrollSensitivity, speed = options.scrollSpeed, x = evt.clientX, y = evt.clientY, winWidth = innerWidth, winHeight = innerHeight, vx, vy, scrollOffsetX, scrollOffsetY;
      if (scrollParentEl !== rootEl) {
        scrollEl = options.scroll;
        scrollParentEl = rootEl;
        scrollCustomFn = options.scrollFn;
        if (scrollEl === true) {
          scrollEl = rootEl;
          do {
            if ((scrollEl.offsetWidth < scrollEl.scrollWidth) || (scrollEl.offsetHeight < scrollEl.scrollHeight)) {
              break;
            }
          } while (scrollEl = scrollEl.parentNode);
        }
      }
      if (scrollEl) {
        el = scrollEl;
        rect = scrollEl.getBoundingClientRect();
        vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
        vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
      }
      if (!(vx || vy)) {
        vx = (winWidth - x <= sens) - (x <= sens);
        vy = (winHeight - y <= sens) - (y <= sens);
        (vx || vy) && (el = win);
      }
      if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {
        autoScroll.el = el;
        autoScroll.vx = vx;
        autoScroll.vy = vy;
        clearInterval(autoScroll.pid);
        if (el) {
          autoScroll.pid = setInterval(function() {
            scrollOffsetY = vy ? vy * speed : 0;
            scrollOffsetX = vx ? vx * speed : 0;
            if ('function' === typeof (scrollCustomFn)) {
              return scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt);
            }
            if (el === win) {
              win.scrollTo(win.pageXOffset + scrollOffsetX, win.pageYOffset + scrollOffsetY);
            } else {
              el.scrollTop += scrollOffsetY;
              el.scrollLeft += scrollOffsetX;
            }
          }, 24);
        }
      }
    }
  });
  var _prepareGroup = function(options) {
    function toFn(value, pull) {
      if (value === void 0 || value === true) {
        value = group.name;
      }
      if (typeof value === 'function') {
        return value;
      } else {
        return function(to, from) {
          var fromGroup = from.options.group.name;
          return pull ? value : value && (value.join ? value.indexOf(fromGroup) !== -1 : (fromGroup == value));
        };
      }
    }
    var group = {};
    var originalGroup = options.group;
    if (!originalGroup || typeof originalGroup != 'object') {
      originalGroup = {
        name: originalGroup
      };
    }
    group.name = originalGroup.name;
    group.checkPull = toFn(originalGroup.pull, true);
    group.checkPut = toFn(originalGroup.put);
    group.revertClone = originalGroup.revertClone;
    options.group = group;
  };
  try {
    addEventListener('test', null, Object.defineProperty({}, 'passive', {
      get: function() {
        passiveMode = false;
        captureMode = {
          capture: false,
          passive: passiveMode
        };
      }
    }));
  } catch (e) {
    throw e;
  }
  function Sortable(el, options) {
    if (!(el && el.nodeType && el.nodeType === 1)) {
      throw 'Sortable: ' + el + ' must be HTMLElement, and not ' + Object.prototype.toString.call(el);
    }
    this.el = el;
    this.options = options = _extend({}, options);
    el[expando] = this;
    var defaults = {
      group: Math.random(),
      sort: true,
      disabled: false,
      store: null,
      handle: null,
      scroll: true,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      ignore: 'a, img',
      filter: null,
      preventOnFilter: true,
      setData: function(dataTransfer, dragEl) {
        dataTransfer.setData('Text', dragEl.textContent);
      },
      dropBubble: false,
      dragoverBubble: false,
      dataIdAttr: 'data-id',
      forceFallback: false,
      fallbackClass: 'sortable-fallback',
      fallbackOnBody: false,
      fallbackTolerance: 0,
      fallbackOffset: {
        x: 0,
        y: 0
      },
      supportPointer: Sortable.supportPointer !== false
    };
    for (var name in defaults) {
      !(name in options) && (options[name] = defaults[name]);
    }
    _prepareGroup(options);
    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }
    this.nativeDraggable = options.forceFallback ? false : supportDraggable;
    _on(el, 'mousedown', this._onTapStart);
    _on(el, 'touchstart', this._onTapStart);
    options.supportPointer && _on(el, 'pointerdown', this._onTapStart);
    if (this.nativeDraggable) {
      _on(el, 'dragover', this);
      _on(el, 'dragenter', this);
    }
    touchDragOverListeners.push(this._onDragOver);
    options.store && this.sort(options.store.get(this));
  }
  Sortable.prototype = {
    constructor: Sortable,
    _onTapStart: function(evt) {
      var _this = this, el = this.el, options = this.options, preventOnFilter = options.preventOnFilter, type = evt.type, touch = evt.touches && evt.touches[0], target = (touch || evt).target, originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0]) || target, filter = options.filter, startIndex;
      _saveInputCheckedState(el);
      if (dragEl) {
        return;
      }
      if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
        return;
      }
      if (originalTarget.isContentEditable) {
        return;
      }
      target = _closest(target, options.draggable, el);
      if (!target) {
        return;
      }
      if (lastDownEl === target) {
        return;
      }
      startIndex = _index(target, options.draggable);
      if (typeof filter === 'function') {
        if (filter.call(this, evt, target, this)) {
          _dispatchEvent(_this, originalTarget, 'filter', target, el, el, startIndex);
          preventOnFilter && evt.preventDefault();
          return;
        }
      } else if (filter) {
        filter = filter.split(',').some(function(criteria) {
          criteria = _closest(originalTarget, criteria.trim(), el);
          if (criteria) {
            _dispatchEvent(_this, criteria, 'filter', target, el, el, startIndex);
            return true;
          }
        });
        if (filter) {
          preventOnFilter && evt.preventDefault();
          return;
        }
      }
      if (options.handle && !_closest(originalTarget, options.handle, el)) {
        return;
      }
      this._prepareDragStart(evt, touch, target, startIndex);
    },
    _prepareDragStart: function(evt, touch, target, startIndex) {
      var _this = this, el = _this.el, options = _this.options, ownerDocument = el.ownerDocument, dragStartFn;
      if (target && !dragEl && (target.parentNode === el)) {
        tapEvt = evt;
        rootEl = el;
        dragEl = target;
        parentEl = dragEl.parentNode;
        nextEl = dragEl.nextSibling;
        lastDownEl = target;
        activeGroup = options.group;
        oldIndex = startIndex;
        this._lastX = (touch || evt).clientX;
        this._lastY = (touch || evt).clientY;
        dragEl.style['will-change'] = 'all';
        dragStartFn = function() {
          _this._disableDelayedDrag();
          dragEl.draggable = _this.nativeDraggable;
          _toggleClass(dragEl, options.chosenClass, true);
          _this._triggerDragStart(evt, touch);
          _dispatchEvent(_this, rootEl, 'choose', dragEl, rootEl, rootEl, oldIndex);
        };
        options.ignore.split(',').forEach(function(criteria) {
          _find(dragEl, criteria.trim(), _disableDraggable);
        });
        _on(ownerDocument, 'mouseup', _this._onDrop);
        _on(ownerDocument, 'touchend', _this._onDrop);
        _on(ownerDocument, 'touchcancel', _this._onDrop);
        _on(ownerDocument, 'selectstart', _this);
        options.supportPointer && _on(ownerDocument, 'pointercancel', _this._onDrop);
        dragStartFn();
      }
    },
    _disableDelayedDrag: function() {
      var ownerDocument = this.el.ownerDocument;
      _off(ownerDocument, 'mouseup', this._disableDelayedDrag);
      _off(ownerDocument, 'touchend', this._disableDelayedDrag);
      _off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
      _off(ownerDocument, 'mousemove', this._disableDelayedDrag);
      _off(ownerDocument, 'touchmove', this._disableDelayedDrag);
      _off(ownerDocument, 'pointermove', this._disableDelayedDrag);
    },
    _triggerDragStart: function(evt, touch) {
      touch = touch || (evt.pointerType == 'touch' ? evt : null);
      if (touch) {
        tapEvt = {
          target: dragEl,
          clientX: touch.clientX,
          clientY: touch.clientY
        };
        this._onDragStart(tapEvt, 'touch');
      } else if (!this.nativeDraggable) {
        this._onDragStart(tapEvt, true);
      } else {
        _on(dragEl, 'dragend', this);
        _on(rootEl, 'dragstart', this._onDragStart);
      }
      try {
        if (document.selection) {
          var emptyTimer = requestAnimationFrame(function() {
            document.selection.empty();
            cancelAnimationFrame(emptyTimer);
          });
        } else {
          getSelection().removeAllRanges();
        }
      } catch (e) {
        throw e;
      }
    },
    _dragStarted: function() {
      if (rootEl && dragEl) {
        var options = this.options;
        _toggleClass(dragEl, options.ghostClass, true);
        _toggleClass(dragEl, options.dragClass, false);
        Sortable.active = this;
        _dispatchEvent(this, rootEl, 'start', dragEl, rootEl, rootEl, oldIndex);
      } else {
        this._nulling();
      }
    },
    _emulateDragOver: function() {
      if (touchEvt) {
        if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY) {
          return;
        }
        this._lastX = touchEvt.clientX;
        this._lastY = touchEvt.clientY;
        if (!supportCssPointerEvents) {
          _css(ghostEl, 'display', 'none');
        }
        var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        var parent = target;
        var i = touchDragOverListeners.length;
        if (target && target.shadowRoot) {
          target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
          parent = target;
        }
        if (parent) {
          do {
            if (parent[expando]) {
              while (i--) {
                touchDragOverListeners[i]({
                  clientX: touchEvt.clientX,
                  clientY: touchEvt.clientY,
                  target: target,
                  rootEl: parent
                });
              }
              break;
            }
            target = parent;
          } while (parent = parent.parentNode);
        }
        if (!supportCssPointerEvents) {
          _css(ghostEl, 'display', '');
        }
      }
    },
    _onTouchMove: function(evt) {
      if (tapEvt) {
        var options = this.options;
        var fallbackTolerance = options.fallbackTolerance;
        var fallbackOffset = options.fallbackOffset;
        var touch = evt.touches ? evt.touches[0] : evt;
        var dx = (touch.clientX - tapEvt.clientX) + fallbackOffset.x;
        var dy = (touch.clientY - tapEvt.clientY) + fallbackOffset.y;
        var translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';
        if (!Sortable.active) {
          if (fallbackTolerance && min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY)) < fallbackTolerance) {
            return;
          }
          this._dragStarted();
        }
        this._appendGhost();
        moved = true;
        touchEvt = touch;
        _css(ghostEl, 'webkitTransform', translate3d);
        _css(ghostEl, 'mozTransform', translate3d);
        _css(ghostEl, 'msTransform', translate3d);
        _css(ghostEl, 'transform', translate3d);
        evt.preventDefault();
      }
    },
    _appendGhost: function() {
      if (!ghostEl) {
        var rect = dragEl.getBoundingClientRect(), css = _css(dragEl), options = this.options, ghostRect;
        ghostEl = dragEl.cloneNode(true);
        _toggleClass(ghostEl, options.ghostClass, false);
        _toggleClass(ghostEl, options.fallbackClass, true);
        _toggleClass(ghostEl, options.dragClass, true);
        _css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
        _css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
        _css(ghostEl, 'width', rect.width);
        _css(ghostEl, 'height', rect.height);
        _css(ghostEl, 'opacity', '0.8');
        _css(ghostEl, 'position', 'fixed');
        _css(ghostEl, 'zIndex', '100000');
        _css(ghostEl, 'pointerEvents', 'none');
        options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);
        ghostRect = ghostEl.getBoundingClientRect();
        _css(ghostEl, 'width', rect.width * 2 - ghostRect.width);
        _css(ghostEl, 'height', rect.height * 2 - ghostRect.height);
      }
    },
    _onDragStart: function(evt, useFallback) {
      var _this = this;
      var dataTransfer = evt.dataTransfer;
      var options = _this.options;
      _this._offUpEvents();
      if (activeGroup.checkPull(_this, _this, dragEl, evt)) {
        cloneEl = _clone(dragEl);
        cloneEl.draggable = false;
        cloneEl.style['will-change'] = '';
        _css(cloneEl, 'display', 'none');
        _toggleClass(cloneEl, _this.options.chosenClass, false);
        _this._cloneId = _nextTick(function() {
          rootEl.insertBefore(cloneEl, dragEl);
          _dispatchEvent(_this, rootEl, 'clone', dragEl);
        });
      }
      _toggleClass(dragEl, options.dragClass, true);
      if (useFallback) {
        if (useFallback === 'touch') {
          _on(document, 'touchmove', _this._onTouchMove);
          _on(document, 'touchend', _this._onDrop);
          _on(document, 'touchcancel', _this._onDrop);
          if (options.supportPointer) {
            _on(document, 'pointermove', _this._onTouchMove);
            _on(document, 'pointerup', _this._onDrop);
          }
        } else {
          _on(document, 'mousemove', _this._onTouchMove);
          _on(document, 'mouseup', _this._onDrop);
        }
        _this._loopId = setInterval(_this._emulateDragOver, 50);
      } else {
        if (dataTransfer) {
          dataTransfer.effectAllowed = 'move';
          options.setData && options.setData.call(_this, dataTransfer, dragEl);
        }
        _on(document, 'drop', _this);
        _this._dragStartId = _nextTick(_this._dragStarted);
      }
    },
    _onDragOver: function(evt) {
      var el = this.el, target, dragRect, targetRect, revert, options = this.options, group = options.group, activeSortable = Sortable.active, isOwner = (activeGroup === group), isMovingBetweenSortable = false, canSort = options.sort;
      if (evt.preventDefault !== void 0) {
        evt.preventDefault();
        !options.dragoverBubble && evt.stopPropagation();
      }
      if (dragEl.animated) {
        return;
      }
      moved = true;
      if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = !rootEl.contains(dragEl)) : (putSortable === this || ((activeSortable.lastPullMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt)))) && (evt.rootEl === void 0 || evt.rootEl === this.el)) {
        _autoScroll(evt, options, this.el);
        if (_silent) {
          return;
        }
        target = _closest(evt.target, options.draggable, el);
        dragRect = dragEl.getBoundingClientRect();
        if (putSortable !== this) {
          putSortable = this;
          isMovingBetweenSortable = true;
        }
        if (revert) {
          _cloneHide(activeSortable, true);
          parentEl = rootEl;
          if (cloneEl || nextEl) {
            rootEl.insertBefore(dragEl, cloneEl || nextEl);
          } else if (!canSort) {
            rootEl.appendChild(dragEl);
          }
          return;
        }
        if ((el.children.length === 0) || (el.children[0] === ghostEl) || (el === evt.target) && (_ghostIsLast(el, evt))) {
          if (el.children.length !== 0 && el.children[0] !== ghostEl && el === evt.target) {
            target = el.lastElementChild;
          }
          if (target) {
            if (target.animated) {
              return;
            }
            targetRect = target.getBoundingClientRect();
          }
          _cloneHide(activeSortable, isOwner);
          if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt) !== false) {
            if (!dragEl.contains(el)) {
              el.appendChild(dragEl);
              parentEl = el;
            }
          }
        } else if (target && !target.animated && target !== dragEl && (target.parentNode[expando] !== void 0)) {
          if (lastEl !== target) {
            lastEl = target;
            lastCSS = _css(target);
            lastParentCSS = _css(target.parentNode);
          }
          targetRect = target.getBoundingClientRect();
          var width = targetRect.right - targetRect.left;
          var height = targetRect.bottom - targetRect.top;
          var floating = R_FLOAT.test(lastCSS.cssFloat + lastCSS.display) || (lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0);
          var isWide = (target.offsetWidth > dragEl.offsetWidth);
          var isLong = (target.offsetHeight > dragEl.offsetHeight);
          var halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5;
          var nextSibling = target.nextElementSibling;
          var after = false;
          if (floating) {
            var elTop = dragEl.offsetTop;
            var tgTop = target.offsetTop;
            if (elTop === tgTop) {
              after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;
            } else if (target.previousElementSibling === dragEl || dragEl.previousElementSibling === target) {
              after = (evt.clientY - targetRect.top) / height > 0.5;
            } else {
              after = tgTop > elTop;
            }
          } else if (!isMovingBetweenSortable) {
            after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
          }
          var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
          if (moveVector !== false) {
            if (moveVector === 1 || moveVector === -1) {
              after = (moveVector === 1);
            }
            _silent = true;
            var unsilentTimer = requestAnimationFrame(function() {
              _unsilent();
              cancelAnimationFrame(unsilentTimer);
            });
            _cloneHide(activeSortable, isOwner);
            if (!dragEl.contains(el)) {
              if (after && !nextSibling) {
                el.appendChild(dragEl);
              } else {
                target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
              }
            }
            parentEl = dragEl.parentNode;
          }
        }
      }
    },
    _offUpEvents: function() {
      var ownerDocument = this.el.ownerDocument;
      _off(document, 'touchmove', this._onTouchMove);
      _off(document, 'pointermove', this._onTouchMove);
      _off(ownerDocument, 'mouseup', this._onDrop);
      _off(ownerDocument, 'touchend', this._onDrop);
      _off(ownerDocument, 'pointerup', this._onDrop);
      _off(ownerDocument, 'touchcancel', this._onDrop);
      _off(ownerDocument, 'pointercancel', this._onDrop);
      _off(ownerDocument, 'selectstart', this);
    },
    _onDrop: function(evt) {
      var el = this.el;
      var options = this.options;
      clearInterval(this._loopId);
      clearInterval(autoScroll.pid);
      _cancelNextTick(this._cloneId);
      _cancelNextTick(this._dragStartId);
      _off(document, 'mouseover', this);
      _off(document, 'mousemove', this._onTouchMove);
      if (this.nativeDraggable) {
        _off(document, 'drop', this);
        _off(el, 'dragstart', this._onDragStart);
      }
      this._offUpEvents();
      if (evt) {
        if (moved) {
          evt.preventDefault();
          !options.dropBubble && evt.stopPropagation();
        }
        ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
        if (rootEl === parentEl || Sortable.active.lastPullMode !== 'clone') {
          cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
        }
        if (dragEl) {
          if (this.nativeDraggable) {
            _off(dragEl, 'dragend', this);
          }
          _disableDraggable(dragEl);
          dragEl.style['will-change'] = '';
          _toggleClass(dragEl, this.options.ghostClass, false);
          _toggleClass(dragEl, this.options.chosenClass, false);
          _dispatchEvent(this, rootEl, 'unchoose', dragEl, parentEl, rootEl, oldIndex);
          if (rootEl !== parentEl) {
            newIndex = _index(dragEl, options.draggable);
            if (newIndex >= 0) {
              _dispatchEvent(null, parentEl, 'add', dragEl, parentEl, rootEl, oldIndex, newIndex);
              _dispatchEvent(this, rootEl, 'remove', dragEl, parentEl, rootEl, oldIndex, newIndex);
              _dispatchEvent(null, parentEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex);
              _dispatchEvent(this, rootEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex);
            }
          } else {
            if (dragEl.nextSibling !== nextEl) {
              newIndex = _index(dragEl, options.draggable);
              if (newIndex >= 0) {
                _dispatchEvent(this, rootEl, 'update', dragEl, parentEl, rootEl, oldIndex, newIndex);
                _dispatchEvent(this, rootEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex);
              }
            }
          }
          if (Sortable.active) {
            if (newIndex == null || newIndex === -1) {
              newIndex = oldIndex;
            }
            _dispatchEvent(this, rootEl, 'end', dragEl, parentEl, rootEl, oldIndex, newIndex);
            this.save();
          }
        }
      }
      this._nulling();
    },
    _nulling: function() {
      rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = scrollEl = scrollParentEl = tapEvt = touchEvt = moved = newIndex = lastEl = lastCSS = putSortable = activeGroup = Sortable.active = null;
      savedInputChecked.forEach(function(el) {
        el.checked = true;
      });
      savedInputChecked.length = 0;
    },
    handleEvent: function(evt) {
      switch (evt.type) {
        case 'drop':
        case 'dragend':
          this._onDrop(evt);
          break;
        case 'dragover':
        case 'dragenter':
          if (dragEl) {
            this._onDragOver(evt);
            _globalDragOver(evt);
          }
          break;
        case 'mouseover':
          this._onDrop(evt);
          break;
        case 'selectstart':
          evt.preventDefault();
          break;
      }
    },
    toArray: function() {
      var order = [], el, children = this.el.children, i = 0, n = children.length, options = this.options;
      for (; i < n; i++) {
        el = children[i];
        if (_closest(el, options.draggable, this.el)) {
          order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
        }
      }
      return order;
    },
    sort: function(order) {
      var items = {};
      var rootEl = this.el;
      this.toArray().forEach(function(id, i) {
        var el = rootEl.children[i];
        if (_closest(el, this.options.draggable, rootEl)) {
          items[id] = el;
        }
      }, this);
      order.forEach(function(id) {
        if (items[id]) {
          rootEl.removeChild(items[id]);
          rootEl.appendChild(items[id]);
        }
      });
    },
    save: function() {
      var store = this.options.store;
      store && store.set(this);
    },
    closest: function(el, selector) {
      return _closest(el, selector || this.options.draggable, this.el);
    },
    option: function(name, value) {
      var options = this.options;
      if (value === void 0) {
        return options[name];
      } else {
        options[name] = value;
        if (name === 'group') {
          _prepareGroup(options);
        }
      }
    },
    destroy: function() {
      var el = this.el;
      el[expando] = null;
      _off(el, 'mousedown', this._onTapStart);
      _off(el, 'touchstart', this._onTapStart);
      _off(el, 'pointerdown', this._onTapStart);
      if (this.nativeDraggable) {
        _off(el, 'dragover', this);
        _off(el, 'dragenter', this);
      }
      [].forEach.call(el.querySelectorAll('[draggable]'), function(el) {
        el.removeAttribute('draggable');
      });
      touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);
      this._onDrop();
      this.el = el = null;
    }
  };
  function _cloneHide(sortable, state) {
    if (sortable.lastPullMode !== 'clone') {
      state = true;
    }
    if (cloneEl && (cloneEl.state !== state)) {
      _css(cloneEl, 'display', state ? 'none' : '');
      if (!state) {
        if (cloneEl.state) {
          if (sortable.options.group.revertClone) {
            rootEl.insertBefore(cloneEl, nextEl);
          } else {
            rootEl.insertBefore(cloneEl, dragEl);
          }
        }
      }
      cloneEl.state = state;
    }
  }
  function _closest(el, selector, ctx) {
    if (el) {
      ctx = ctx || document;
      do {
        if ((selector === '>*' && el.parentNode === ctx) || _matches(el, selector)) {
          return el;
        }
      } while (el = _getParentOrHost(el));
    }
    return null;
  }
  function _getParentOrHost(el) {
    var parent = el.host;
    return (parent && parent.nodeType) ? parent : el.parentNode;
  }
  function _globalDragOver(evt) {
    if (evt.dataTransfer) {
      evt.dataTransfer.dropEffect = 'move';
    }
    evt.preventDefault();
  }
  function _on(el, event, fn) {
    el.addEventListener(event, fn, captureMode);
  }
  function _off(el, event, fn) {
    el.removeEventListener(event, fn, captureMode);
  }
  function _toggleClass(el, name, state) {
    if (el) {
      if (el.classList) {
        el.classList[state ? 'add' : 'remove'](name);
      } else {
        var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
        el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
      }
    }
  }
  function _css(el, prop, val) {
    var style = el && el.style;
    if (style) {
      if (val === void 0) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
          val = document.defaultView.getComputedStyle(el, '');
        } else if (el.currentStyle) {
          val = el.currentStyle;
        }
        return prop === void 0 ? val : val[prop];
      } else {
        if (!(prop in style)) {
          prop = '-webkit-' + prop;
        }
        style[prop] = val + (typeof val === 'string' ? '' : 'px');
      }
    }
  }
  function _find(ctx, tagName, iterator) {
    if (ctx) {
      var list = ctx.getElementsByTagName(tagName);
      var i = 0;
      var n = list.length;
      if (iterator) {
        for (; i < n; i++) {
          iterator(list[i], i);
        }
      }
      return list;
    }
    return [];
  }
  function _dispatchEvent(sortable, rootEl, name, targetEl, toEl, fromEl, startIndex, newIndex) {
    sortable = (sortable || rootEl[expando]);
    var evt = document.createEvent('Event');
    var options = sortable.options;
    var onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
    evt.initEvent(name, true, true);
    evt.to = toEl || rootEl;
    evt.from = fromEl || rootEl;
    evt.item = targetEl || rootEl;
    evt.clone = cloneEl;
    evt.oldIndex = startIndex;
    evt.newIndex = newIndex;
    rootEl.dispatchEvent(evt);
    if (options[onName]) {
      options[onName].call(sortable, evt);
    }
  }
  function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt, willInsertAfter) {
    var evt, sortable = fromEl[expando], onMoveFn = sortable.options.onMove, retVal;
    evt = document.createEvent('Event');
    evt.initEvent('move', true, true);
    evt.to = toEl;
    evt.from = fromEl;
    evt.dragged = dragEl;
    evt.draggedRect = dragRect;
    evt.related = targetEl || toEl;
    evt.relatedRect = targetRect || toEl.getBoundingClientRect();
    evt.willInsertAfter = willInsertAfter;
    fromEl.dispatchEvent(evt);
    if (onMoveFn) {
      retVal = onMoveFn.call(sortable, evt, originalEvt);
    }
    return retVal;
  }
  function _disableDraggable(el) {
    el.draggable = false;
  }
  function _unsilent() {
    _silent = false;
  }
  function _ghostIsLast(el, evt) {
    var lastEl = el.lastElementChild;
    var rect = lastEl.getBoundingClientRect();
    return (evt.clientY - (rect.top + rect.height) > 5) || (evt.clientX - (rect.left + rect.width) > 5);
  }
  function _generateId(el) {
    var str = el.tagName + el.className + el.src + el.href + el.textContent;
    var i = str.length;
    var sum = 0;
    while (i--) {
      sum += str.charCodeAt(i);
    }
    return sum + '';
  }
  function _index(el, selector) {
    var index = 0;
    if (!el || !el.parentNode) {
      return -1;
    }
    while (el && (el = el.previousElementSibling)) {
      if ((el.nodeName.toUpperCase() !== 'TEMPLATE') && (selector === '>*' || _matches(el, selector))) {
        index++;
      }
    }
    return index;
  }
  function _matches(el, selector) {
    if (el) {
      selector = selector.split('.');
      var tag = selector.shift().toUpperCase();
      var re = new RegExp('\\s(' + selector.join('|') + ')(?=\\s)', 'g');
      return ((tag === '' || el.nodeName.toUpperCase() == tag) && (!selector.length || ((' ' + el.className + ' ').match(re) || []).length == selector.length));
    }
    return false;
  }
  function _throttle(callback) {
    var args, _this;
    return function() {
      if (args === void 0) {
        args = arguments;
        _this = this;
        var timer = requestAnimationFrame(function() {
          if (args.length === 1) {
            callback.call(_this, args[0]);
          } else {
            callback.apply(_this, args);
          }
          args = void 0;
          cancelAnimationFrame(timer);
        });
      }
    };
  }
  function _extend(dst, src) {
    if (dst && src) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          dst[key] = src[key];
        }
      }
    }
    return dst;
  }
  function _clone(el) {
    if (Polymer && Polymer.dom) {
      return Polymer.dom(el).cloneNode(true);
    } else {
      return el.cloneNode(true);
    }
  }
  function _saveInputCheckedState(root) {
    var inputs = root.getElementsByTagName('input');
    var idx = inputs.length;
    while (idx--) {
      var el = inputs[idx];
      el.checked && savedInputChecked.push(el);
    }
  }
  function _nextTick(fn) {
    return requestAnimationFrame(fn);
  }
  function _cancelNextTick(id) {
    return cancelAnimationFrame(id);
  }
  _on(document, 'touchmove', function(evt) {
    if (Sortable.active) {
      evt.preventDefault();
    }
  });
  Sortable.utils = {
    on: _on,
    off: _off,
    css: _css,
    find: _find,
    is: function(el, selector) {
      return !!_closest(el, selector, el);
    },
    extend: _extend,
    throttle: _throttle,
    closest: _closest,
    toggleClass: _toggleClass,
    clone: _clone,
    index: _index,
    nextTick: _nextTick,
    cancelNextTick: _cancelNextTick
  };
  Sortable.create = function(el, options) {
    return new Sortable(el, options);
  };
  return Sortable;
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'Sortable', 'VueUtil'], definition);
  } else {
    context.VueSortable = definition(context.Vue, context.Sortable, context.VueUtil);
    delete context.VueSortable;
    delete context.Sortable;
  }
})(this, function(Vue, Sortable, VueUtil) {
  'use strict';
  var toConsumableArray = function(arr) {
    if (VueUtil.isArray(arr)) {
      return arr;
    } else {
      var arrayfrom = function(arr) {
        var from = function(arrayLike) {
          if (!VueUtil.isDef(arrayLike)) return [];
          var items = Object(arrayLike);
          var mapFn = arguments.length > 1 ? arguments[1] : null;
          var T = null;
          if (VueUtil.isDef(mapFn)) {
            if (!VueUtil.isFunction(mapFn)) return [];
            if (arguments.length > 2) {
              T = arguments[2];
            }
          }
          var toLength = function(value) {
            var toInteger = function(value) {
              var number = Number(value);
              if (isNaN(number)) return 0;
              if (number === 0 || !isFinite(number)) return number;
              return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
            };
            var maxSafeInteger = Math.pow(2, 53) - 1;
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
          };
          var len = toLength(items.length);
          var A = [];
          var k = 0;
          var kValue = null;
          while (k < len) {
            kValue = items[k];
            if (mapFn) {
              A.push(!VueUtil.isDef(T) ? mapFn(kValue, k) : mapFn.call(T, kValue, k));
            } else {
              A.push(kValue);
            }
            k += 1;
          }
          return A;
        };
        return from(arr);
      };
      return arrayfrom(arr);
    }
  };
  var emit = function(evtName, evtData) {
    var self = this;
    self.$nextTick(function() {
      self.$emit(evtName.toLowerCase(), evtData);
    });
  };
  var delegateAndEmit = function(evtName) {
    var self = this;
    return function(evtData) {
      if (self.realList !== null) {
        self['onDrag' + evtName](evtData);
      }
      emit.call(self, evtName, evtData);
    };
  };
  var eventsListened = ['Start', 'Add', 'Remove', 'Update', 'End'];
  var eventsToEmit = ['Choose', 'Sort', 'Filter', 'Clone'];
  var draggingElement = null;
  var VueSortable = {
    name: 'VueSortable',
    props: {
      options: Object,
      value: {
        type: Array,
        default: null
      },
      clone: {
        type: Function,
        default: function(original) {
          return original;
        }
      },
      element: {
        type: String,
        default: 'div'
      },
      move: {
        type: Function,
        default: null
      }
    },
    data: function() {
      return {
        componentMode: false
      };
    },
    render: function(createElement) {
      return createElement(this.element, null, this.$slots.default);
    },
    mounted: function() {
      var self = this;
      self.componentMode = self.element.toLowerCase() !== self.$el.nodeName.toLowerCase();
      var optionsAdded = {};
      VueUtil.loop(eventsListened, function(elt) {
        optionsAdded['on' + elt] = delegateAndEmit.call(self, elt);
      });
      VueUtil.loop(eventsToEmit, function(elt) {
        optionsAdded['on' + elt] = emit.bind(self, elt);
      });
      var options = VueUtil.merge({}, self.options, optionsAdded, {
        onMove: function(evt, originalEvent) {
          return self.onDragMove(evt, originalEvent);
        }
      });
      !VueUtil.isDef(options.draggable) && (options.draggable = '>*');
      self._sortable = new Sortable(self.rootContainer, options);
      self.computeIndexes();
    },
    beforeDestroy: function() {
      this._sortable.destroy();
    },
    computed: {
      rootContainer: function() {
        return this.$el;
      },
      isCloning: function() {
        return !!this.options && !!this.options.group && this.options.group.pull === 'clone';
      },
      realList: function() {
        return this.value;
      }
    },
    watch: {
      options: {
        handler: function(newOptionValue) {
          var readonlyProperties = VueUtil.map(VueUtil.mergeArray(['Move'], eventsListened, eventsToEmit), function(evt) {
            return 'on' + evt;
          });
          var sortable = this._sortable;
          VueUtil.ownPropertyLoop(newOptionValue, function(property) {
            if (readonlyProperties.indexOf(property) === -1) {
              sortable.option(property, newOptionValue[property]);
            }
          });
        },
        deep: true
      },
      realList: function() {
        this.computeIndexes();
      }
    },
    methods: {
      getChildrenNodes: function() {
        if (this.componentMode) {
          return this.$children[0].$slots.default;
        }
        return this.$slots.default;
      },
      computeIndexes: function() {
        var computeIndexes = function(slots, children) {
          if (!VueUtil.isArray(slots)) return [];
          var elmFromNodes = VueUtil.map(slots, function(elt) {
            return elt.elm;
          });
          var rawIndexes = VueUtil.map(VueUtil.mergeArray([], toConsumableArray(children)), function(elt) {
            return elmFromNodes.indexOf(elt);
          });
          return VueUtil.filter(rawIndexes, function(index) {
            return index !== -1;
          });
        };
        var self = this;
        self.$nextTick(function() {
          self.visibleIndexes = computeIndexes(self.getChildrenNodes(), self.rootContainer.children);
        });
      },
      getUnderlyingVm: function(htmlElt) {
        var computeVmIndex = function(vnodes, element) {
          if (VueUtil.isArray(vnodes)) {
            return VueUtil.map(vnodes, function(elt) {
              return elt.elm;
            }).indexOf(element);
          } else {
            return -1;
          }
        };
        var index = computeVmIndex(this.getChildrenNodes(), htmlElt);
        if (index === -1)
          return null;
        var element = this.realList[index];
        return {
          index: index,
          element: element
        };
      },
      getUnderlyingPotencialDraggableComponent: function(ref) {
        return ref.__vue__;
      },
      emitChanges: function(evt) {
        var self = this;
        self.$nextTick(function() {
          self.$emit('change', evt);
        });
      },
      alterList: function(onList) {
        var newList = VueUtil.mergeArray([], toConsumableArray(this.value));
        onList(newList);
        this.$emit('input', newList);
      },
      spliceList: function() {
        var _arguments = arguments;
        var spliceList = function(list) {
          return list.splice.apply(list, _arguments);
        };
        this.alterList(spliceList);
      },
      updatePosition: function(oldIndex, newIndex) {
        var updatePosition = function(list) {
          return list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
        };
        this.alterList(updatePosition);
      },
      getRelatedContextFromMoveEvent: function(ref) {
        var to = ref.to;
        var related = ref.related;
        var component = this.getUnderlyingPotencialDraggableComponent(to);
        if (!component) {
          return {
            component: component
          };
        }
        var list = component.realList;
        var context = {
          list: list,
          component: component
        };
        if (to !== related && list && component.getUnderlyingVm) {
          var destination = component.getUnderlyingVm(related);
          if (destination) {
            return VueUtil.merge(destination, context);
          }
        }
        return context;
      },
      getVmIndex: function(domIndex) {
        var indexes = this.visibleIndexes;
        var numberIndexes = indexes.length;
        return (domIndex > numberIndexes - 1) ? numberIndexes : indexes[domIndex];
      },
      getComponent: function() {
        return this.$slots.default[0].componentInstance;
      },
      onDragStart: function(evt) {
        this.context = this.getUnderlyingVm(evt.item);
        evt.item._underlying_vm_ = this.context.element;
        draggingElement = evt.item;
      },
      onDragAdd: function(evt) {
        var element = evt.item._underlying_vm_;
        if (this.isCloning) {
          element = this.clone(evt.item._underlying_vm_);
        }
        if (!VueUtil.isDef(element)) return;
        VueUtil.removeNode(evt.item);
        var newIndex = this.getVmIndex(evt.newIndex);
        this.spliceList(newIndex, 0, element);
        this.computeIndexes();
        var added = {
          element: element,
          newIndex: newIndex
        };
        this.emitChanges({
          added: added
        });
      },
      onDragRemove: function(evt) {
        VueUtil.insertNodeAt(this.rootContainer, evt.item, evt.oldIndex);
        if (this.isCloning) {
          VueUtil.removeNode(evt.clone);
          return;
        }
        var oldIndex = this.context.index;
        this.spliceList(oldIndex, 1);
        var removed = {
          element: this.context.element,
          oldIndex: oldIndex
        };
        this.emitChanges({
          removed: removed
        });
      },
      onDragUpdate: function(evt) {
        var oldIndex = this.context.index;
        var newIndex = this.getVmIndex(evt.newIndex);
        VueUtil.removeNode(evt.item);
        VueUtil.insertNodeAt(evt.from, evt.item, evt.oldIndex);
        this.updatePosition(oldIndex, newIndex);
        var moved = {
          element: this.context.element,
          oldIndex: oldIndex,
          newIndex: newIndex
        };
        this.emitChanges({
          moved: moved
        });
      },
      computeFutureIndex: function(relatedContext, evt) {
        if (!relatedContext.element) {
          return 0;
        }
        var domChildren = VueUtil.filter(VueUtil.mergeArray([], toConsumableArray(evt.to.children)), function(el) {
          return el.style['display'] !== 'none';
        });
        var currentDOMIndex = domChildren.indexOf(evt.related);
        var currentIndex = relatedContext.component.getVmIndex(currentDOMIndex);
        var draggedInList = domChildren.indexOf(draggingElement) != -1;
        return (draggedInList || !evt.willInsertAfter) ? currentIndex : currentIndex + 1;
      },
      onDragMove: function(evt) {
        var onMove = this.move;
        if (!onMove || !this.realList) {
          return true;
        }
        var relatedContext = this.getRelatedContextFromMoveEvent(evt);
        var draggedContext = this.context;
        var futureIndex = this.computeFutureIndex(relatedContext, evt);
        VueUtil.merge(draggedContext, {futureIndex: futureIndex});
        VueUtil.merge(evt, {relatedContext: relatedContext, draggedContext: draggedContext});
        return onMove(evt);
      },
      onDragEnd: function(evt) {
        this.computeIndexes();
        draggingElement = null;
      }
    }
  };
  Vue.component(VueSortable.name, VueSortable);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VuePopup = definition(context.Vue, context.VueUtil);
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var PopupManager = VueUtil.component.popupManager;
  VueUtil.on(document, 'keydown', function(event) {
    if (event.keyCode === 27) {
      if (PopupManager.modalStack.length > 0) {
        var topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1];
        if (!topItem) return;
        var instance = PopupManager.getInstance(topItem.id);
        if (instance.closeOnPressEscape) {
          instance.$emit('visible-change', false);
        }
      }
    }
  });
  var idSeed = 1;
  var VuePopup = {};
  VuePopup.model = {
    prop: 'visible',
    event: 'visible-change'
  };
  VuePopup.props = {
    visible: Boolean,
    openDelay: {},
    closeDelay: {},
    zIndex: {},
    closeOnPressEscape: {
      type: Boolean,
      default: true
    }
  };
  VuePopup.beforeMount = function() {
    this._popupId = 'popup-' + idSeed++;
    PopupManager.register(this._popupId, this);
  };
  VuePopup.beforeDestroy = function() {
    PopupManager.deregister(this._popupId);
    PopupManager.closeModal(this._popupId);
  };
  VuePopup.data = function() {
    return {
      opened: false
    };
  };
  VuePopup.watch = {
    visible: function(val) {
      var getDOM = function(dom) {
        if (dom.nodeType === 3) {
          dom = dom.nextElementSibling || dom.nextSibling;
          getDOM(dom);
        }
        return dom;
      };
      var self = this;
      if (val) {
        if (!self.opened) {
          self.$nextTick(function() {
            var dom = getDOM(self.$el);
            if (VueUtil.getStyle(dom, 'position') === 'static') {
              VueUtil.setStyle(dom, 'position', 'absolute');
            }
            dom.style.zIndex = PopupManager.nextZIndex();
            if (self.closeOnPressEscape)
              PopupManager.openModal(self._popupId, dom.style.zIndex);
          });
        }
      } else {
        PopupManager.closeModal(self._popupId);
        self.$nextTick(function() {
          if (self.opened && self.closeOnPressEscape) {
            var dom = getDOM(self.$el);
            PopupManager.openModal(self._popupId, dom.style.zIndex);
          }
        });
      }
    }
  };
  return VuePopup;
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VuePopper = definition(context.Vue, context.VueUtil);
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var getOuterSizes = function(element) {
    var _display = element.style.display;
    var _visibility = element.style.visibility;
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    var calcWidthToForceRepaint = element.offsetWidth;
    var styles = getComputedStyle(element);
    var x = element.offsetHeight + parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    var y = element.offsetWidth + parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
    var result = {
      width: y,
      height: x
    };
    element.style.display = _display;
    element.style.visibility = _visibility;
    return result;
  };
  var getPopperClientRect = function(popperOffsets) {
    var offsets = VueUtil.merge({}, popperOffsets);
    offsets.right = offsets.left + offsets.width;
    offsets.bottom = offsets.top + offsets.height;
    return offsets;
  };
  var getArrayKeyIndex = function(arr, keyToFind) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === keyToFind) {
        return i;
      }
    }
    return null;
  };
  var getOffsetParent = function(element) {
    var offsetParent = element.offsetParent;
    return offsetParent === document.body || !offsetParent ? document.documentElement : offsetParent;
  };
  var setStyle = function(element, styles) {
    function is_numeric(n) {
      return (n !== '' && !isNaN(parseFloat(n)) && isFinite(n));
    }
    VueUtil.ownPropertyLoop(styles, function(prop) {
      var unit = '';
      if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && is_numeric(styles[prop])) {
        unit = 'px';
      }
      element.style[prop] = styles[prop] + unit;
    });
  };
  var Popper = function(reference, popper, options) {
    var DEFAULTS = {
      placement: 'bottom',
      gpuAcceleration: true,
      offset: 0,
      boundariesElement: 'viewport',
      boundariesPadding: 5,
      preventOverflowOrder: ['left', 'right', 'top', 'bottom'],
      flipBehavior: 'flip',
      arrowElement: '[x-arrow]',
      modifiers: ['shift', 'offset', 'preventOverflow', 'keepTogether', 'arrow', 'flip', 'applyStyle'],
      modifiersIgnored: [],
      forceAbsolute: false,
      removeOnDestroy: true
    };
    this._reference = reference.jquery ? reference[0] : reference;
    this.state = {};
    var isNotDefined = !VueUtil.isDef(popper);
    var isConfig = VueUtil.isObject(popper);
    if (isNotDefined || isConfig) {
      this._popper = this.parse(isConfig ? popper : {});
    } else {
      this._popper = popper.jquery ? popper[0] : popper;
    }
    this._options = VueUtil.merge({}, DEFAULTS, options);
    this._options.modifiers = VueUtil.map(this._options.modifiers, function(modifier) {
      if (this._options.modifiersIgnored.indexOf(modifier) !== -1)
        return;
      if (modifier === 'applyStyle') {
        this._popper.setAttribute('x-placement', this._options.placement);
      }
      return this.modifiers[modifier] || modifier;
    }.bind(this));
    this.state.position = this._getPosition(this._popper, this._reference);
    setStyle(this._popper, {
      position: this.state.position,
      top: 0
    });
    this._setupEventListeners();
    return this;
  };
  Popper.prototype.destroy = function() {
    this._popper.removeAttribute('x-placement');
    this._popper.style.left = '';
    this._popper.style.position = '';
    this._popper.style.top = '';
    this._popper.style.transform = '';
    this._removeEventListeners();
    if (this._options.removeOnDestroy) {
      VueUtil.removeNode(this._popper);
    }
    return this;
  };
  Popper.prototype.update = function() {
    var data = {
      instance: this,
      styles: {}
    };
    data.placement = this._options.placement;
    data._originalPlacement = this._options.placement;
    this._options.autoWidth && setStyle(this._popper, {'width': this._reference.offsetWidth});
    data.offsets = this._getOffsets(this._popper, this._reference, data.placement);
    data.boundaries = this._getBoundaries(data, this._options.boundariesPadding, this._options.boundariesElement);
    data = this.runModifiers(data, this._options.modifiers);
    if (VueUtil.isFunction(this.state.updateCallback)) {
      this.state.updateCallback(data);
    }
  };
  Popper.prototype.onCreate = function(callback) {
    callback(this);
    return this;
  };
  Popper.prototype.onUpdate = function(callback) {
    this.state.updateCallback = callback;
    return this;
  };
  Popper.prototype.parse = function(config) {
    var defaultConfig = {
      tagName: 'div',
      classNames: ['popper'],
      attributes: [],
      parent: document.body,
      content: '',
      contentType: 'text',
      arrowTagName: 'div',
      arrowClassNames: ['popper__arrow'],
      arrowAttributes: ['x-arrow']
    };
    config = VueUtil.merge({}, defaultConfig, config);
    var d = document;
    var popper = d.createElement(config.tagName);
    addClassNames(popper, config.classNames);
    addAttributes(popper, config.attributes);
    if (config.contentType === 'node') {
      popper.appendChild(config.content.jquery ? config.content[0] : config.content);
    } else if (config.contentType === 'html') {
      popper.innerHTML = config.content;
    } else {
      popper.textContent = config.content;
    }
    if (config.arrowTagName) {
      var arrow = d.createElement(config.arrowTagName);
      addClassNames(arrow, config.arrowClassNames);
      addAttributes(arrow, config.arrowAttributes);
      popper.appendChild(arrow);
    }
    var parent = config.parent.jquery ? config.parent[0] : config.parent;
    if (VueUtil.isString(parent)) {
      parent = d.querySelector(config.parent);
      if (!VueUtil.isDef(parent)) {
        throw 'ERROR: the given \'parent\' doesn\'t exists!';
      }
    }
    if (VueUtil.isNodeList(parent)) {
      parent = parent[0];
    }
    parent.appendChild(popper);
    return popper;
    function addClassNames(element, classNames) {
      VueUtil.loop(classNames, function(className) {
        element.classList.add(className);
      });
    }
    function addAttributes(element, attributes) {
      VueUtil.loop(attributes, function(attribute) {
        element.setAttribute(attribute.split(':')[0], attribute.split(':')[1] || '');
      });
    }
  };
  Popper.prototype._getPosition = function(popper, reference) {
    if (this._options.forceAbsolute) {
      return 'absolute';
    }
    var isFixed = function(element) {
      if (element === document.body) return false;
      var elementPosition = VueUtil.getStyle(element, 'position');
      if (elementPosition === 'fixed' || elementPosition === 'relative') return true;
      return element.parentNode ? isFixed(element.parentNode) : element;
    };
    var isParentFixed = isFixed(reference);
    return isParentFixed ? 'fixed' : 'absolute';
  };
  Popper.prototype._getOffsets = function(popper, reference, placement) {
    placement = placement.split('-')[0];
    var popperOffsets = {};
    popperOffsets.position = this.state.position;
    var getBoundingClientRect = function(element) {
      var rect = element.getBoundingClientRect();
      var isIE = navigator.userAgent.indexOf('MSIE') != -1;
      var rectTop = isIE && element.tagName === 'HTML' ? -element.scrollTop : rect.top;
      return {
        left: rect.left,
        top: rectTop,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.right - rect.left,
        height: rect.bottom - rectTop
      };
    };
    var getOffsetRectRelativeToCustomParent = function(element, parent, fixed) {
      var elementRect = getBoundingClientRect(element);
      var parentRect = getBoundingClientRect(parent);
      if (fixed) {
        var scrollParent = VueUtil.component.getScrollParent(parent);
        parentRect.top += scrollParent.scrollTop;
        parentRect.bottom += scrollParent.scrollTop;
        parentRect.left += scrollParent.scrollLeft;
        parentRect.right += scrollParent.scrollLeft;
      }
      var rect = {
        top: elementRect.top - parentRect.top,
        left: elementRect.left - parentRect.left,
        bottom: (elementRect.top - parentRect.top) + elementRect.height,
        right: (elementRect.left - parentRect.left) + elementRect.width,
        width: elementRect.width,
        height: elementRect.height
      };
      return rect;
    };
    var isParentFixed = popperOffsets.position === 'fixed';
    var referenceOffsets = getOffsetRectRelativeToCustomParent(reference, getOffsetParent(popper), isParentFixed);
    var popperRect = getOuterSizes(popper);
    if (['right', 'left'].indexOf(placement) !== -1) {
      popperOffsets.top = referenceOffsets.top + referenceOffsets.height / 2 - popperRect.height / 2;
      if (placement === 'left') {
        popperOffsets.left = referenceOffsets.left - popperRect.width;
      } else {
        popperOffsets.left = referenceOffsets.right;
      }
    } else {
      popperOffsets.left = referenceOffsets.left + referenceOffsets.width / 2 - popperRect.width / 2;
      if (placement === 'top') {
        popperOffsets.top = referenceOffsets.top - popperRect.height;
      } else {
        popperOffsets.top = referenceOffsets.bottom;
      }
    }
    popperOffsets.width = popperRect.width;
    popperOffsets.height = popperRect.height;
    return {
      popper: popperOffsets,
      reference: referenceOffsets
    };
  };
  Popper.prototype._setupEventListeners = function() {
    this.state.updateBound = this.update.bind(this);
    VueUtil.addResizeListener(this.state.updateBound);
    if (this._options.boundariesElement !== 'window') {
      var target = VueUtil.component.getScrollParent(this._reference);
      if (target === document.body || target === document.documentElement) {
        target = document;
      }
      VueUtil.on(target, 'scroll', this.state.updateBound);
    }
  };
  Popper.prototype._removeEventListeners = function() {
    VueUtil.removeResizeListener(this.state.updateBound);
    if (this._options.boundariesElement !== 'window') {
      var target = VueUtil.component.getScrollParent(this._reference);
      if (target === document.body || target === document.documentElement) {
        target = document;
      }
      VueUtil.off(target, 'scroll', this.state.updateBound);
    }
    this.state.updateBound = null;
  };
  Popper.prototype._getBoundaries = function(data, padding, boundariesElement) {
    var getOffsetRect = function(element) {
      var elementRect = {
        width: element.offsetWidth,
        height: element.offsetHeight,
        left: element.offsetLeft,
        top: element.offsetTop
      };
      elementRect.right = elementRect.left + elementRect.width;
      elementRect.bottom = elementRect.top + elementRect.height;
      return elementRect;
    };
    var boundaries = {};
    var width, height;
    if (boundariesElement === 'window') {
      var body = document.body;
      var html = document.documentElement;
      height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
      boundaries = {
        top: 0,
        right: width,
        bottom: height,
        left: 0
      };
    } else if (boundariesElement === 'viewport') {
      var offsetParent = getOffsetParent(this._popper);
      var scrollParent = VueUtil.component.getScrollParent(this._popper);
      var offsetParentRect = getOffsetRect(offsetParent);
      var getScrollTopValue = function(element) {
        return element == document.body ? Math.max(document.documentElement.scrollTop, document.body.scrollTop) : element.scrollTop;
      };
      var getScrollLeftValue = function(element) {
        return element == document.body ? Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) : element.scrollLeft;
      };
      var scrollTop = data.offsets.popper.position === 'fixed' ? 0 : getScrollTopValue(scrollParent);
      var scrollLeft = data.offsets.popper.position === 'fixed' ? 0 : getScrollLeftValue(scrollParent);
      boundaries = {
        top: 0 - (offsetParentRect.top - scrollTop),
        right: document.documentElement.clientWidth - (offsetParentRect.left - scrollLeft),
        bottom: document.documentElement.clientHeight - (offsetParentRect.top - scrollTop),
        left: 0 - (offsetParentRect.left - scrollLeft)
      };
    } else {
      if (getOffsetParent(this._popper) === boundariesElement) {
        boundaries = {
          top: 0,
          left: 0,
          right: boundariesElement.clientWidth,
          bottom: boundariesElement.clientHeight
        };
      } else {
        boundaries = getOffsetRect(boundariesElement);
      }
    }
    boundaries.left += padding;
    boundaries.right -= padding;
    boundaries.top = boundaries.top + padding;
    boundaries.bottom = boundaries.bottom - padding;
    return boundaries;
  };
  Popper.prototype.runModifiers = function(data, modifiers, ends) {
    var modifiersToRun = VueUtil.mergeArray([], modifiers);
    if (VueUtil.isDef(ends)) {
      modifiersToRun = this._options.modifiers.slice(0, getArrayKeyIndex(this._options.modifiers, ends));
    }
    VueUtil.loop(modifiersToRun, function(modifier) {
      if (VueUtil.isFunction(modifier)) {
        data = modifier.call(this, data);
      }
    }
      .bind(this));
    return data;
  };
  Popper.prototype.isModifierRequired = function(requesting, requested) {
    var index = getArrayKeyIndex(this._options.modifiers, requesting);
    return !!VueUtil.filter(this._options.modifiers.slice(0, index), function(modifier) {
      return modifier === requested;
    }).length;
  };
  Popper.prototype.modifiers = {};
  Popper.prototype.modifiers.applyStyle = function(data) {
    var styles = {
      position: data.offsets.popper.position
    };
    var left = Math.round(data.offsets.popper.left);
    var top = Math.round(data.offsets.popper.top);
    var prefixedProperty;
    if (this._options.gpuAcceleration && (prefixedProperty = 'transform')) {
      styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
      styles.top = 0;
      styles.left = 0;
    } else {
      styles.left = left;
      styles.top = top;
    }
    VueUtil.merge(styles, data.styles);
    setStyle(this._popper, styles);
    this._popper.setAttribute('x-placement', data.placement);
    if (this.isModifierRequired(this.modifiers.applyStyle, this.modifiers.arrow) && data.offsets.arrow) {
      setStyle(data.arrowElement, data.offsets.arrow);
    }
    return data;
  };
  Popper.prototype.modifiers.shift = function(data) {
    var placement = data.placement;
    var basePlacement = placement.split('-')[0];
    var shiftVariation = placement.split('-')[1];
    if (shiftVariation) {
      var reference = data.offsets.reference;
      var popper = getPopperClientRect(data.offsets.popper);
      var shiftOffsets = {
        y: {
          start: {
            top: reference.top
          },
          end: {
            top: reference.top + reference.height - popper.height
          }
        },
        x: {
          start: {
            left: reference.left
          },
          end: {
            left: reference.left + reference.width - popper.width
          }
        }
      };
      var axis = ['bottom', 'top'].indexOf(basePlacement) !== -1 ? 'x' : 'y';
      data.offsets.popper = VueUtil.merge(popper, shiftOffsets[axis][shiftVariation]);
    }
    return data;
  };
  Popper.prototype.modifiers.preventOverflow = function(data) {
    var order = this._options.preventOverflowOrder;
    var popper = getPopperClientRect(data.offsets.popper);
    var check = {
      left: function() {
        var left = popper.left;
        if (popper.left < data.boundaries.left) {
          left = Math.max(popper.left, data.boundaries.left);
        }
        return {
          left: left
        };
      },
      right: function() {
        var left = popper.left;
        if (popper.right > data.boundaries.right) {
          left = Math.min(popper.left, data.boundaries.right - popper.width);
        }
        return {
          left: left
        };
      },
      top: function() {
        var top = popper.top;
        if (popper.top < data.boundaries.top) {
          top = Math.max(popper.top, data.boundaries.top);
        }
        return {
          top: top
        };
      },
      bottom: function() {
        var top = popper.top;
        if (popper.bottom > data.boundaries.bottom) {
          top = Math.min(popper.top, data.boundaries.bottom - popper.height);
        }
        return {
          top: top
        };
      }
    };
    VueUtil.loop(order, function(direction) {
      data.offsets.popper = VueUtil.merge(popper, check[direction]());
    });
    return data;
  };
  Popper.prototype.modifiers.keepTogether = function(data) {
    var popper = getPopperClientRect(data.offsets.popper);
    var reference = data.offsets.reference;
    var f = Math.floor;
    if (popper.right < f(reference.left)) {
      data.offsets.popper.left = f(reference.left) - popper.width;
    }
    if (popper.left > f(reference.right)) {
      data.offsets.popper.left = f(reference.right);
    }
    if (popper.bottom < f(reference.top)) {
      data.offsets.popper.top = f(reference.top) - popper.height;
    }
    if (popper.top > f(reference.bottom)) {
      data.offsets.popper.top = f(reference.bottom);
    }
    return data;
  };
  Popper.prototype.modifiers.flip = function(data) {
    if (!this.isModifierRequired(this.modifiers.flip, this.modifiers.preventOverflow)) {
      return data;
    }
    if (data.flipped && data.placement === data._originalPlacement) {
      return data;
    }
    var getOppositePlacement = function(placement) {
      var hash = {
        left: 'right',
        right: 'left',
        bottom: 'top',
        top: 'bottom'
      };
      return placement.replace(/left|right|bottom|top/g, function(matched) {
        return hash[matched];
      });
    };
    var placement = data.placement.split('-')[0];
    var placementOpposite = getOppositePlacement(placement);
    var variation = data.placement.split('-')[1] || '';
    var flipOrder = [];
    if (this._options.flipBehavior === 'flip') {
      flipOrder = [placement, placementOpposite];
    } else {
      flipOrder = this._options.flipBehavior;
    }
    VueUtil.loop(flipOrder, function(step, index) {
      if (placement !== step || flipOrder.length === index + 1) {
        return;
      }
      placement = data.placement.split('-')[0];
      placementOpposite = getOppositePlacement(placement);
      var popperOffsets = getPopperClientRect(data.offsets.popper);
      var a = ['right', 'bottom'].indexOf(placement) !== -1;
      if (a && Math.floor(data.offsets.reference[placement]) > Math.floor(popperOffsets[placementOpposite]) || !a && Math.floor(data.offsets.reference[placement]) < Math.floor(popperOffsets[placementOpposite])) {
        data.flipped = true;
        data.placement = flipOrder[index + 1];
        if (variation) {
          data.placement += '-' + variation;
        }
        data.offsets.popper = this._getOffsets(this._popper, this._reference, data.placement).popper;
        data = this.runModifiers(data, this._options.modifiers, this._flip);
      }
    }.bind(this));
    return data;
  };
  Popper.prototype.modifiers.offset = function(data) {
    var offset = this._options.offset;
    var popper = data.offsets.popper;
    if (data.placement.indexOf('left') !== -1) {
      popper.top -= offset;
    } else if (data.placement.indexOf('right') !== -1) {
      popper.top += offset;
    } else if (data.placement.indexOf('top') !== -1) {
      popper.left -= offset;
    } else if (data.placement.indexOf('bottom') !== -1) {
      popper.left += offset;
    }
    return data;
  };
  Popper.prototype.modifiers.arrow = function(data) {
    var arrow = this._options.arrowElement;
    if (VueUtil.isString(arrow)) {
      arrow = this._popper.querySelector(arrow);
    }
    if (!arrow || !this._popper.contains(arrow) || !this.isModifierRequired(this.modifiers.arrow, this.modifiers.keepTogether)) {
      return data;
    }
    var arrowStyle = {};
    var placement = data.placement.split('-')[0];
    var popper = getPopperClientRect(data.offsets.popper);
    var reference = data.offsets.reference;
    var isVertical = ['left', 'right'].indexOf(placement) !== -1;
    var len = isVertical ? 'height' : 'width';
    var side = isVertical ? 'top' : 'left';
    var altSide = isVertical ? 'left' : 'top';
    var opSide = isVertical ? 'bottom' : 'right';
    var arrowSize = getOuterSizes(arrow)[len];
    if (reference[opSide] - arrowSize < popper[side]) {
      data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowSize);
    }
    if (reference[side] + arrowSize > popper[opSide]) {
      data.offsets.popper[side] += (reference[side] + arrowSize) - popper[opSide];
    }
    var center = reference[side] + (reference[len] / 2) - (arrowSize / 2);
    var sideValue = center - popper[side];
    sideValue = Math.max(Math.min(popper[len] - arrowSize, sideValue), 0);
    arrowStyle[side] = sideValue;
    arrowStyle[altSide] = '';
    data.offsets.arrow = arrowStyle;
    data.arrowElement = arrow;
    return data;
  };
  var VuePopper = {
    props: {
      placement: {
        type: String,
        default: 'bottom'
      },
      reference: {},
      popper: {},
      offset: {
        default: 0
      },
      value: Boolean,
      visibleArrow: Boolean,
      autoWidth: Boolean,
      transition: String,
      append: {},
      popperOptions: {
        type: Object,
        default: function() {
          return {
            boundariesPadding: 5,
            gpuAcceleration: false
          };
        }
      }
    },
    data: function() {
      return {
        showPopper: false
      };
    },
    watch: {
      value: {
        immediate: true,
        handler: function(val) {
          this.showPopper = val;
        }
      },
      showPopper: function(val) {
        if (val) this.$nextTick(this.updatePopper);
        this.$emit('input', val);
      }
    },
    methods: {
      stop: function(e) {
        e.stopPropagation();
      },
      findeAbsoluteParent: function(element) {
        if (element === document.body) return;
        var elementPosition = VueUtil.getStyle(element, 'position');
        if (elementPosition === 'absolute' && element.parentNode) this.appendElement = element.parentNode;
        this.findeAbsoluteParent(element.parentNode);
      },
      createPopper: function() {
        var self = this;
        self.currentPlacement = self.currentPlacement || self.placement;
        if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(self.currentPlacement)) return;
        var options = self.popperOptions || {};
        var popper = self.popperElm = self.popperElm || self.popper || self.$refs.popper;
        var reference = self.referenceElm = self.referenceElm || self.reference || self.$refs.reference;
        if (!reference && self.$slots.reference && self.$slots.reference[0]) reference = self.referenceElm = self.$slots.reference[0].elm;
        if (!popper || !reference) return;
        if (self.visibleArrow) self.appendArrow(popper);
        if (VueUtil.isElement(self.append)) {
          self.appendElement = self.append;
        } else {
          self.appendElement = self.referenceElm.parentNode;
          self.findeAbsoluteParent(self.referenceElm);
        }
        self.appendElement.appendChild(self.popperElm);
        if (self.popperJS && self.popperJS.destroy) self.popperJS.destroy();
        options.placement = self.currentPlacement;
        options.offset = self.offset;
        options.autoWidth = self.autoWidth;
        self.popperJS = new Popper(reference, popper, options);
        self.popperJS.onCreate(function() {
          self.$emit('created', self);
          self.resetTransformOrigin();
          self.$nextTick(self.updatePopper);
        });
        if (VueUtil.isFunction(options.onUpdate)) {
          self.popperJS.onUpdate(options.onUpdate);
        }
        self.popperJS._popper.style.zIndex = VueUtil.nextZIndex();
        !VueUtil.isIE && VueUtil.on(self.popperElm, 'click', self.stop);
      },
      updatePopper: function() {
        this.popperJS ? this.popperJS.update() : this.createPopper();
      },
      destroyPopper: function() {
        if (this.showPopper || !this.popperJS) return;
        this.popperJS.destroy();
        this.popperJS = null;
      },
      resetTransformOrigin: function() {
        var placementMap = {
          top: 'bottom',
          bottom: 'top',
          left: 'right',
          right: 'left'
        };
        var placement = this.popperJS._popper.getAttribute('x-placement').split('-')[0];
        var origin = placementMap[placement];
        this.popperJS._popper.style.transformOrigin = ['top', 'bottom'].indexOf(placement) !== -1 ? 'center ' + origin : origin + ' center';
      },
      appendArrow: function(element) {
        if (this.appended) return;
        this.appended = true;
        var arrow = document.createElement('div');
        arrow.setAttribute('x-arrow', '');
        arrow.className = 'popper__arrow';
        element.appendChild(arrow);
      }
    },
    beforeDestroy: function() {
      !VueUtil.isIE && VueUtil.off(this.popperElm, 'click', this.stop);
      this.destroyPopper();
    }
  };
  return VuePopper;
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueScrollbar = definition(context.Vue, context.VueUtil);
    delete context.VueScrollbar;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var Bar = {
    name: 'Bar',
    props: {
      vertical: Boolean,
      size: Number,
      move: Number,
      disSize: Number
    },
    computed: {
      bar: function() {
        var BAR_MAP = {
          vertical: {
            offset: 'offsetHeight',
            scroll: 'scrollTop',
            scrollSize: 'scrollHeight',
            size: 'height',
            key: 'vertical',
            axis: 'Y',
            client: 'clientY',
            direction: 'top'
          },
          horizontal: {
            offset: 'offsetWidth',
            scroll: 'scrollLeft',
            scrollSize: 'scrollWidth',
            size: 'width',
            key: 'horizontal',
            axis: 'X',
            client: 'clientX',
            direction: 'left'
          }
        };
        return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
      },
      wrap: function() {
        return this.$parent.wrap;
      }
    },
    render: function(createElement) {
      var self = this;
      var move = self.move;
      var size = self.size;
      var bar = self.bar;
      var renderThumbStyle = function(obj) {
        var move = obj.move;
        var size = obj.size;
        var bar = obj.bar;
        if (size === 0) move = 0;
        var style = {};
        if (bar.axis === 'Y') {
          style.marginTop = move + 'px';
        }
        if (bar.axis === 'X') {
          style.marginLeft = move + 'px';
        }
        style[bar.size] = size + 'px';
        return style;
      };
      return createElement('div', {
        class: ['vue-scrollbar__bar', 'is-' + bar.key],
        on: {
          mousedown: self.clickTrackHandler
        }
      }, [createElement('div', {
        ref: 'thumb',
        class: 'vue-scrollbar__thumb',
        on: {
          mousedown: self.clickThumbHandler,
          touchstart: self.clickThumbHandler,
        },
        style: renderThumbStyle({
          size: size,
          move: move,
          bar: bar
        })
      }, [])]);
    },
    methods: {
      clickThumbHandler: function(e) {
        this[this.bar.axis] = e.currentTarget[this.bar.offset] - ((e[this.bar.client] || e.touches[0][this.bar.client]) - e.currentTarget.getBoundingClientRect()[this.bar.direction]);
        this.startDrag(e);
      },
      clickTrackHandler: function(e) {
        var offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
        var thumbHalf = this.$refs.thumb[this.bar.offset] / 2;
        this.wrap[this.bar.scroll] = (offset - thumbHalf) / (this.$el[this.bar.offset] + this.disSize) * this.wrap[this.bar.scrollSize];
      },
      startDrag: function(e) {
        e.stopImmediatePropagation();
        VueUtil.addTouchMove(document, this.mouseMoveDocumentHandler);
        VueUtil.addTouchEnd(document, this.mouseUpDocumentHandler);
        document.onselectstart = function() {
          return false;
        };
      },
      mouseMoveDocumentHandler: function(e) {
        var prevPage = this[this.bar.axis];
        if (!prevPage) return;
        var offset = (this.$el.getBoundingClientRect()[this.bar.direction] - (e[this.bar.client] || e.touches[0][this.bar.client])) * -1;
        var thumbClickPosition = this.$refs.thumb[this.bar.offset] - prevPage;
        this.wrap[this.bar.scroll] = (offset - thumbClickPosition) / (this.$el[this.bar.offset] + this.disSize) * this.wrap[this.bar.scrollSize];
      },
      mouseUpDocumentHandler: function(e) {
        this[this.bar.axis] = 0;
        VueUtil.removeTouchMove(document, this.mouseMoveDocumentHandler);
        VueUtil.removeTouchEnd(document, this.mouseUpDocumentHandler);
        document.onselectstart = null;
      }
    }
  };
  var VueScrollbar = {
    name: 'VueScrollbar',
    components: {
      Bar: Bar
    },
    props: {
      wrapClass: {},
      viewClass: {},
      height: Number,
      width: Number,
      noresize: Boolean,
      tag: {
        type: String,
        default: 'div'
      }
    },
    data: function() {
      return {
        sizeWidth: 0,
        sizeHeight: 0,
        moveX: 0,
        moveY: 0,
        disSizeX: 0,
        disSizeY: 0
      };
    },
    computed: {
      wrap: function() {
        return this.$refs.wrap;
      },
      resizeElement: function() {
        var view = this.$refs.resize;
        if (VueUtil.isDef(view) && VueUtil.isElement(view.$el)) {
          return view.$el;
        }
        return view;
      },
      mouseWheelEvent: function() {
        return VueUtil.isFirefox ? 'DOMMouseScroll' : 'mousewheel';
      },
    },
    render: function(createElement) {
      var self = this;
      var viewHeight = null;
      var viewWidth = null;
      if (VueUtil.isNumber(self.height)) {
        viewHeight =  self.height + 'px';
      }
      if (VueUtil.isNumber(self.width)) {
        viewWidth =  self.width + 'px';
      }
      var view = createElement(self.tag, {
        class: ['vue-scrollbar__view', self.viewClass],
        ref: 'resize'
      }, [self.$slots.default]);
      var wrap = createElement('div', {
        ref: 'wrap',
        style: {height: viewHeight, width: viewWidth},
        on: {
          scroll: self.handleScroll
        },
        class: [self.wrapClass, 'vue-scrollbar__wrap']
      }, [view]);
      var nodes = [wrap, createElement(Bar, {
        style: {width: viewWidth},
        attrs: {
          move: self.moveX,
          size: self.sizeWidth,
          disSize: self.disSizeX
        }
      }, []), createElement(Bar, {
        style: {height: viewHeight},
        attrs: {
          vertical: true,
          move: self.moveY,
          size: self.sizeHeight,
          disSize: self.disSizeY
        }
      }, [])];
      return createElement('div', {
        class: 'vue-scrollbar'
      }, nodes);
    },
    methods: {
      isScrollCancel: function(el) {
        if (el === this.wrap) return false;
        var overflowY = VueUtil.getStyle(el, 'overflowY');
        if (['auto', 'scroll'].indexOf(overflowY) !== -1 && el.scrollHeight > el.clientHeight) return true;
        return this.isScrollCancel(el.parentElement);
      },
      scrollMouseWheel: function(e) {
        if (this.isScrollCancel(e.target)) return;
        e.stopPropagation();
        e.preventDefault();
        var wheelDelta = e.wheelDelta || -e.detail;
        var scrollTop = this.wrap.scrollTop;
        var wheel = 90;
        if (wheelDelta < 0) {
          scrollTop += wheel;
        } else {
          scrollTop -= wheel;
        }
        this.wrap.scrollTop = scrollTop;
      },
      touchStart: function(e) {
        if (this.isScrollCancel(e.target)) return;
        e.stopImmediatePropagation();
        VueUtil.addClass(this.$el, 'is-touch');
        var wrap = this.wrap;
        var touches = e.touches[0];
        var tocuhPlace = this.tocuhPlace;
        if (!VueUtil.isDef(tocuhPlace)) {
          tocuhPlace = this.tocuhPlace = {};
        }
        tocuhPlace.startTime = e.timeStamp;
        tocuhPlace.startY = wrap.scrollTop;
        tocuhPlace.tocuhX = touches.pageX;
        tocuhPlace.tocuhY = touches.pageY;
        clearInterval(tocuhPlace.timer);
        VueUtil.on(document, 'touchmove', this.touchMove);
        VueUtil.on(document, 'touchend', this.touchEnd);
      },
      touchMove: function(e) {
        VueUtil.addClass(this.$el, 'touching');
        var touches = e.touches[0];
        var wrap = this.wrap;
        var tocuhPlace = this.tocuhPlace;
        var scrollLeft = tocuhPlace.tocuhX - touches.pageX;
        var scrollTop = tocuhPlace.tocuhY - touches.pageY;
        wrap.scrollLeft = wrap.scrollLeft + scrollLeft;
        wrap.scrollTop = wrap.scrollTop + scrollTop;
        tocuhPlace.tocuhX = touches.pageX;
        tocuhPlace.tocuhY = touches.pageY;
      },
      touchEnd: function(e) {
        var self = this;
        var wrap = this.wrap;
        var tocuhPlace = this.tocuhPlace;
        var timeStamp = e.timeStamp - tocuhPlace.startTime;
        if (timeStamp <= 200) {
          var moveY = Math.floor(((wrap.scrollTop - tocuhPlace.startY) * 100 / timeStamp) / 4);
          tocuhPlace.timer = setInterval(function() {
            var tmpScrollTop = wrap.scrollTop;
            wrap.scrollTop = wrap.scrollTop + moveY;
            moveY > 0 ? moveY-- : moveY++;
            if (moveY === 0 || wrap.scrollTop === tmpScrollTop) {
              VueUtil.removeClass(self.$el, 'touching');
              clearInterval(tocuhPlace.timer);
            }
          }, 66);
        } else {
          VueUtil.removeClass(this.$el, 'touching');
        }
        VueUtil.off(document, 'touchmove',this.touchMove);
        VueUtil.off(document, 'touchend', this.touchEnd);
      },
      handleScroll: VueUtil.throttle(function(e) {
        if (!VueUtil.isDef(e.touches)) VueUtil.removeClass(this.$el, 'is-touch');
        this.update();
        var wrap = this.wrap;
        var moveY = wrap.scrollTop / wrap.scrollHeight * wrap.clientHeight;
        var moveX = wrap.scrollLeft / wrap.scrollWidth * wrap.clientWidth;
        var sizeHeight = this.sizeHeight;
        var sizeWidth = this.sizeWidth;
        var minHeight = wrap.clientHeight * 0.1;
        var minWidth = wrap.clientWidth * 0.1;
        if (sizeHeight < minHeight && sizeHeight !== 0) {
          moveY = wrap.scrollTop / wrap.scrollHeight * (wrap.clientHeight - minHeight + sizeHeight);
          this.sizeHeight = minHeight;
          this.disSizeY = sizeHeight - minHeight;
        }
        if (sizeWidth < minWidth && sizeWidth !== 0) {
          moveX = wrap.scrollLeft / wrap.scrollWidth * (wrap.clientHeight - minWidth + sizeWidth);
          this.sizeWidth = minWidth;
          this.disSizeX = sizeWidth - minWidth;
        }
        if (this.moveY !== moveY) {
          this.moveY = moveY;
          var isTop = (wrap.scrollTop === 0);
          var isBottom = (wrap.scrollHeight - wrap.scrollTop === wrap.clientHeight);
          this.$emit('scrollY', e, wrap.scrollTop, isTop, isBottom);
        }
        if (this.moveX !== moveX) {
          this.moveX = moveX;
          var isLeft = (wrap.scrollLeft === 0);
          var isRight = (wrap.scrollWidth - wrap.scrollLeft === wrap.clientWidth);
          this.$emit('scrollX', e, wrap.scrollLeft, isLeft, isRight);
        }
      }),
      update: function() {
        var wrap = this.wrap;
        var heightPercentage = wrap.clientHeight * 100 / wrap.scrollHeight;
        var widthPercentage = wrap.clientWidth * 100 / wrap.scrollWidth;
        var sizeHeight = heightPercentage < 100 ? wrap.clientHeight * heightPercentage / 100 : 0;
        var sizeWidth = widthPercentage < 100 ? wrap.clientWidth * widthPercentage / 100 : 0;
        this.sizeHeight = sizeHeight;
        this.sizeWidth = sizeWidth;
        this.disSizeX = 0;
        this.disSizeY = 0;
      },
      goTop: function() {
        this.wrap.scrollTop = 0;
      }
    },
    mounted: function() {
      VueUtil.on(this.wrap, this.mouseWheelEvent, this.scrollMouseWheel);
      VueUtil.on(this.wrap, 'touchstart', this.touchStart);
      VueUtil.addHoverListener(this.wrap, this.handleScroll);
      !this.noresize && this.resizeElement && VueUtil.addResizeListener(this.resizeElement, this.update);
    },
    beforeDestroy: function() {
      VueUtil.off(this.wrap, this.mouseWheelEvent, this.scrollMouseWheel);
      VueUtil.off(this.wrap, 'touchstart', this.touchStart);
      VueUtil.removeHoverListener(this.wrap, this.handleScroll);
      !this.noresize && this.resizeElement && VueUtil.removeResizeListener(this.resizeElement, this.update);
    }
  };
  Vue.component(VueScrollbar.name, VueScrollbar);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueRow = definition(context.Vue);
    delete context.VueRow;
  }
})(this, function(Vue) {
  'use strict';
  var VueRow = {
    template: '<div :style="style" :class="[\'vue-row\', justify !== \'start\' ? \'is-justify-\' + justify : \'\', align !== \'top\' ? \'is-align-\' + align : \'\', {\'vue-row--flex\': type === \'flex\'}]"><slot></slot></div>',
    name: 'VueRow',
    props: {
      gutter: Number,
      type: String,
      justify: {
        type: String,
        default: 'start'
      },
      align: {
        type: String,
        default: 'top'
      }
    },
    computed: {
      style: function() {
        var ret = {};
        if (this.gutter) {
          ret.marginLeft = this.gutter / 2 + 'px';
          ret.marginRight = ret.marginLeft;
        }
        return ret;
      }
    }
  };
  Vue.component(VueRow.name, VueRow);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueCol = definition(context.Vue, context.VueUtil);
    delete context.VueCol;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueCol = {
    name: 'VueCol',
    props: {
      span: {
        type: Number,
        default: 24
      },
      offset: Number,
      pull: Number,
      push: Number,
      xs: [Number, Object],
      sm: [Number, Object],
      md: [Number, Object],
      lg: [Number, Object]
    },
    computed: {
      gutter: function() {
        return this.$parent.gutter;
      },
      style: function() {
        var ret = {};
        if (this.gutter) {
          ret.paddingLeft = this.gutter / 2 + 'px';
          ret.paddingRight = ret.paddingLeft;
        }
        return ret;
      }
    },
    render: function(createElement) {
      var self = this;
      var classList = [];
      VueUtil.loop(['span', 'offset', 'pull', 'push'], function(prop) {
        if (VueUtil.isDef(self[prop])) {
          classList.push(prop !== 'span' ? 'vue-col-' + prop + '-' + self[prop] : 'vue-col-' + self[prop]);
        }
      });
      VueUtil.loop(['xs', 'sm', 'md', 'lg'], function(size) {
        if (VueUtil.isNumber(self[size])) {
          classList.push('vue-col-' + size + '-' + self[size]);
        } else if (VueUtil.isObject(self[size])) {
          var props = self[size];
          VueUtil.ownPropertyLoop(props, function(prop) {
            classList.push(prop !== 'span' ? 'vue-col-' + size + '-' + prop + '-' + props[prop] : 'vue-col-' + size + '-' + props[prop]);
          });
        }
      });
      return createElement('div', {
        class: ['vue-col', classList],
        style: self.style
      }, [this.$slots.default]);
    }
  };
  Vue.component(VueCol.name, VueCol);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['VueUtil'], definition);
  } else {
    context.VueValidator = definition(context.VueUtil);
  }
})(this, function(VueUtil) {
  'use strict';
  var newMessages = function() {
    return {
      default: 'Validation Error'
    };
  };
  var isEmptyValue = function(value, type) {
    if (!VueUtil.isDef(value)) {
      return true;
    }
    if (type === 'array' && VueUtil.isArray(value) && !value.length) {
      return true;
    }
    var isNativeStringType = function(type) {
      return type === 'string' || type === 'url' || type === 'hex' || type === 'email' || type === 'pattern' || type === 'ipv4';
    };
    if (isNativeStringType(type) && VueUtil.isString(value) && !value) {
      return true;
    }
    return false;
  };
  var rulesEnumerable = function(rule, value, source, errors, options) {
    var ENUM = 'enum';
    rule[ENUM] = VueUtil.isArray(rule[ENUM]) ? rule[ENUM] : [];
    if (rule[ENUM].indexOf(value) === -1) {
      errors.push(options.messages.default);
    }
  };
  var rulesPattern = function(rule, value, source, errors, options) {
    if (rule.pattern) {
      if (rule.pattern instanceof RegExp) {
        if (!rule.pattern.test(value)) {
          errors.push(options.messages.default);
        }
      } else if (VueUtil.isString(rule.pattern)) {
        var _pattern = new RegExp(rule.pattern);
        if (!_pattern.test(value)) {
          errors.push(options.messages.default);
        }
      }
    }
  };
  var rulesRange = function(rule, value, source, errors, options) {
    var len = VueUtil.isNumber(rule.len);
    var min = VueUtil.isNumber(rule.min);
    var max = VueUtil.isNumber(rule.max);
    var val = value;
    var key = null;
    var num = VueUtil.isNumber(value);
    var str = VueUtil.isString(value);
    var arr = VueUtil.isArray(value);
    if (num) {
      key = 'number';
    } else if (str) {
      key = 'string';
    } else if (arr) {
      key = 'array';
    }
    if (!key) {
      return false;
    }
    if (str || arr) {
      val = value.length;
    }
    if (len) {
      if (val !== rule.len) {
        errors.push(options.messages.default);
      }
    } else if (min && !max && val < rule.min) {
      errors.push(options.messages.default);
    } else if (max && !min && val > rule.max) {
      errors.push(options.messages.default);
    } else if (min && max && (val < rule.min || val > rule.max)) {
      errors.push(options.messages.default);
    }
  };
  var rulesRequired = function(rule, value, source, errors, options, type) {
    if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type || rule.type))) {
      errors.push(options.messages.default);
    }
  };
  var rulesType = function(rule, value, source, errors, options) {
    var pattern = {
      email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      url: new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i'),
      hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i,
      ipv4: new RegExp('\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b'),
    };
    var types = {
      integer: function(value) {
        return types.number(value) && parseInt(value, 10) === value;
      },
      float: function(value) {
        return types.number(value) && !types.integer(value);
      },
      array: function(value) {
        return VueUtil.isArray(value);
      },
      regexp: function(value) {
        if (value instanceof RegExp) {
          return true;
        }
        try {
          return !!new RegExp(value);
        } catch (e) {
          throw e;
        }
      },
      date: function(value) {
        return VueUtil.isFunction(value.getTime) && VueUtil.isFunction(value.getMonth) && VueUtil.isFunction(value.getYear);
      },
      number: function(value) {
        return VueUtil.isNumber(value);
      },
      object: function(value) {
        return VueUtil.isObject(value);
      },
      method: function(value) {
        return VueUtil.isFunction(value);
      },
      email: function(value) {
        return VueUtil.isString(value) && !!value.match(pattern.email) && value.length < 255;
      },
      url: function(value) {
        return VueUtil.isString(value) && !!value.match(pattern.url);
      },
      hex: function(value) {
        return VueUtil.isString(value) && !!value.match(pattern.hex);
      },
      ipv4: function(value) {
        return VueUtil.isString(value) && !!value.match(pattern.ipv4);
      }
    };
    if (rule.required && !VueUtil.isDef(value)) {
      rulesRequired(rule, value, source, errors, options);
      return;
    }
    var custom = ['integer', 'float', 'array', 'regexp', 'object', 'method', 'email', 'number', 'date', 'url', 'hex', 'ipv4'];
    var ruleType = rule.type;
    if (custom.indexOf(ruleType) !== -1) {
      if (!types[ruleType](value)) {
        errors.push(options.messages.default);
      }
    } else if (ruleType && typeof (value) !== ruleType) {
      errors.push(options.messages.default);
    }
  };
  var rulesWhitespace = function(rule, value, source, errors, options) {
    if (/^\s+$/.test(value) || value === '') {
      errors.push(options.messages.default);
    }
  };
  var rules = {
    enum: rulesEnumerable,
    pattern: rulesPattern,
    range: rulesRange,
    required: rulesRequired,
    type: rulesType,
    whitespace: rulesWhitespace
  };
  var validtorDate = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value)) {
        rules.type(rule, value, source, errors, options);
        if (value) {
          rules.range(rule, value.getTime(), source, errors, options);
        }
      }
    }
    callback(errors);
  };
  var validtorBoolean = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (VueUtil.isDef(value)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorArray = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value, 'array') && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, 'array');
      if (!isEmptyValue(value, 'array')) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorType = function(rule, value, callback, source, options) {
    var ruleType = rule.type;
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value, ruleType) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, ruleType);
      if (!isEmptyValue(value, ruleType)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorString = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value, 'string') && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, 'string');
      if (!isEmptyValue(value, 'string')) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
        rules.pattern(rule, value, source, errors, options);
        if (rule.whitespace === true) {
          rules.whitespace(rule, value, source, errors, options);
        }
      }
    }
    callback(errors);
  };
  var validtorRequired = function(rule, value, callback, source, options) {
    var errors = [];
    var type = VueUtil.isArray(value) ? 'array' : typeof value;
    rules.required(rule, value, source, errors, options, type);
    callback(errors);
  };
  var validtorRegexp = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorPattern = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value, 'string') && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value, 'string')) {
        rules.pattern(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorObject = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (VueUtil.isDef(value)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorNumber = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (VueUtil.isDef(value)) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorMethod = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (VueUtil.isDef(value)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorEnumerable = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value) {
        rules['enum'](rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validators = {
    string: validtorString,
    method: validtorMethod,
    number: validtorNumber,
    boolean: validtorBoolean,
    regexp: validtorRegexp,
    integer: validtorNumber,
    float: validtorNumber,
    array: validtorArray,
    object: validtorObject,
    enum: validtorEnumerable,
    pattern: validtorPattern,
    email: validtorType,
    url: validtorType,
    date: validtorDate,
    hex: validtorType,
    ipv4: validtorType,
    required: validtorRequired
  };
  var Schema = function(descriptor) {
    this.rules = null;
    this._messages = newMessages();
    this.define(descriptor);
  };
  Schema.prototype = {
    messages: function(messages) {
      return VueUtil.merge(this._messages, messages);
    },
    define: function(rules) {
      if (!rules) {
        throw 'No rules';
      }
      if (!VueUtil.isObject(rules)) {
        throw 'Rules must be an object';
      }
      var self = this;
      self.rules = {};
      VueUtil.ownPropertyLoop(rules, function(z) {
        var item = rules[z];
        self.rules[z] = VueUtil.isArray(item) ? item : [item];
      });
    },
    validate: function(source_, o, oc) {
      var source = source_;
      var options = o || {};
      var callback = oc;
      if (VueUtil.isFunction(options)) {
        callback = options;
        options = {};
      }
      if (!this.rules || Object.keys(this.rules).length === 0) {
        if (callback) {
          callback();
        }
        return;
      }
      function complete(results) {
        var i;
        var field;
        var errors = [];
        var fields = {};
        function add(e) {
          if (VueUtil.isArray(e)) {
            errors = errors.concat.apply(errors, e);
          } else {
            errors.push(e);
          }
        }
        i = results.length;
        while (i--) {
          add(results[i]);
        }
        if (!errors.length) {
          errors = null;
          fields = null;
        } else {
          i = errors.length;
          while (i--) {
            field = errors[i].field;
            fields[field] = fields[field] || [];
            fields[field].push(errors[i]);
          }
        }
        callback(errors, fields);
      }
      options.messages = VueUtil.merge(this.messages(), options.messages);
      var self = this;
      var arr;
      var value;
      var series = {};
      var keys = options.keys || Object.keys(self.rules);
      VueUtil.loop(keys, function(z) {
        arr = self.rules[z];
        value = source[z];
        VueUtil.loop(arr, function(r) {
          var rule = r;
          if (VueUtil.isFunction(rule.transform)) {
            if (source === source_) {
              source = VueUtil.merge({}, source);
            }
            value = source[z] = rule.transform(value);
          }
          if (VueUtil.isFunction(rule)) {
            rule = {
              validator: rule,
            };
          } else {
            rule = VueUtil.merge({}, rule);
          }
          rule.validator = self.getValidationMethod(rule);
          rule.field = z;
          rule.fullField = rule.fullField || z;
          rule.type = self.getType(rule);
          if (!rule.validator) {
            return;
          }
          series[z] = series[z] || [];
          series[z].push({
            rule: rule,
            value: value,
            source: source,
            field: z,
          });
        });
      });
      var errorFields = {};
      var asyncMap = function(objArr, option, func, callback) {
        var flattenObjArr = function(objArr) {
          var ret = [];
          VueUtil.ownPropertyLoop(objArr, function(k) {
            ret.push.apply(ret, objArr[k]);
          });
          return ret;
        };
        var asyncSerialArray = function(arr, func, callback) {
          var index = 0;
          var arrLength = arr.length;
          function next(errors) {
            if (errors && errors.length) {
              callback(errors);
              return;
            }
            var original = index;
            index = index + 1;
            if (original < arrLength) {
              func(arr[original], next);
            } else {
              callback([]);
            }
          }
          next([]);
        };
        if (option.first) {
          var flattenArr = flattenObjArr(objArr);
          return asyncSerialArray(flattenArr, func, callback);
        }
        var firstFields = option.firstFields || [];
        if (firstFields === true) {
          firstFields = Object.keys(objArr);
        }
        var objArrKeys = Object.keys(objArr);
        var objArrLength = objArrKeys.length;
        var total = 0;
        var results = [];
        var next = function(errors) {
          results.push.apply(results, errors);
          total++;
          if (total === objArrLength) {
            callback(results);
          }
        };
        VueUtil.loop(objArrKeys, function(key) {
          var arr = objArr[key];
          if (firstFields.indexOf(key) !== -1) {
            asyncSerialArray(arr, func, next);
          } else {
            var asyncParallelArray = function(arr, func, callback) {
              var results = [];
              var total = 0;
              var arrLength = arr.length;
              function count(errors) {
                results.push.apply(results, errors);
                total++;
                if (total === arrLength) {
                  callback(results);
                }
              }
              VueUtil.loop(arr, function(a) {
                func(a, count);
              });
            };
            asyncParallelArray(arr, func, next);
          }
        });
      };
      asyncMap(series, options, function(data, doIt) {
        var rule = data.rule;
        var deep = (VueUtil.isObject(rule.type) || VueUtil.isArray(rule.type)) && (VueUtil.isObject(rule.fields) || VueUtil.isObject(rule.defaultField));
        deep = deep && (rule.required || (!rule.required && data.value));
        rule.field = data.field;
        function addFullfield(key, schema) {
          return VueUtil.merge({}, schema, {
            fullField: rule.fullField + '.' + key
          });
        }
        function cb() {
          var errors = arguments.length > 0 && VueUtil.isDef(arguments[0]) ? arguments[0] : [];
          var complementError = function(rule) {
            return function(oe) {
              if (oe && oe.message) {
                oe.field = oe.field || rule.fullField;
                return oe;
              }
              return {
                message: oe,
                field: oe.field || rule.fullField,
              };
            };
          };
          if (!VueUtil.isArray(errors)) {
            errors = [errors];
          }
          if (errors.length && rule.message) {
            errors = VueUtil.mergeArray([], rule.message);
          }
          errors = VueUtil.map(errors, complementError(rule));
          if (options.first && errors.length) {
            errorFields[rule.field] = 1;
            return doIt(errors);
          }
          if (!deep) {
            doIt(errors);
          } else {
            if (rule.required && !data.value) {
              if (rule.message) {
                errors = VueUtil.map(VueUtil.mergeArray([], rule.message), complementError(rule));
              } else if (options.error) {
                errors = [options.error(rule, options.messages.default)];
              } else {
                errors = [];
              }
              return doIt(errors);
            }
            var fieldsSchema = {};
            if (rule.defaultField) {
              VueUtil.ownPropertyLoop(data.value, function(k) {
                fieldsSchema[k] = rule.defaultField;
              });
            }
            fieldsSchema = VueUtil.merge({}, fieldsSchema, data.rule.fields);
            VueUtil.ownPropertyLoop(fieldsSchema, function(f) {
              var fieldSchema = VueUtil.isArray(fieldsSchema[f]) ? fieldsSchema[f] : [fieldsSchema[f]];
              fieldsSchema[f] = VueUtil.map(fieldSchema, addFullfield.bind(null, f));
            });
            var schema = new Schema(fieldsSchema);
            schema.messages(options.messages);
            if (data.rule.options) {
              data.rule.options.messages = options.messages;
              data.rule.options.error = options.error;
            }
            schema.validate(data.value, data.rule.options || options, function(errs) {
              doIt(errs && errs.length ? VueUtil.mergeArray(errors, errs) : errs);
            });
          }
        }
        var res = rule.validator(rule, data.value, cb, data.source, options);
        if (res && res.then) {
          res.then(function() {cb();}, function(e) {cb(e);});
        }
      }, function(results) {
        complete(results);
      });
    },
    getType: function(rule) {
      if (!VueUtil.isDef(rule.type) && (rule.pattern instanceof RegExp)) {
        rule.type = 'pattern';
      }
      if (!VueUtil.isFunction(rule.validator) && (rule.type && !validators.hasOwnProperty(rule.type))) {
        throw 'Unknown rule type ' + rule.type;
      }
      return rule.type || 'string';
    },
    getValidationMethod: function(rule) {
      if (VueUtil.isFunction(rule.validator)) {
        return rule.validator;
      }
      var keys = Object.keys(rule);
      var messageIndex = keys.indexOf('message');
      if (messageIndex !== -1) {
        keys.splice(messageIndex, 1);
      }
      if (keys.length === 1 && keys[0] === 'required') {
        return validators.required;
      }
      return validators[this.getType(rule)] || false;
    },
  };
  Schema.register = function register(type, validator) {
    if (!VueUtil.isFunction(validator)) {
      throw 'Cannot register a validator by type, validator is not a function';
    }
    validators[type] = validator;
  };
  Schema.messages = newMessages();
  return Schema;
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueForm = definition(context.Vue, context.VueUtil);
    delete context.VueForm;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueForm = {
    template: '<form :class="[\'vue-form\', labelPosition ? \'vue-form--label-\' + labelPosition : \'\', {\'vue-form--inline\': inline}]"><slot></slot><input style="display:none" /></form>',
    name: 'VueForm',
    props: {
      model: Object,
      rules: Object,
      labelPosition: String,
      labelWidth: String,
      labelSuffix: {
        type: String,
        default: ''
      },
      inline: Boolean,
      showMessage: {
        type: Boolean,
        default: true
      },
      labelResponsive: {
        type: Boolean,
        default: true
      },
      notifyMessage: Boolean,
      customMessageMethod: Function
    },
    watch: {
      rules: function() {
        this.validate();
      }
    },
    data: function() {
      return {
        fields: []
      };
    },
    created: function() {
      this.$on('vue.form.addField', function(field) {
        if (field) {
          this.fields.push(field);
        }
      });
      this.$on('vue.form.removeField', function(field) {
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1);
        }
      });
    },
    methods: {
      initValue: function() {
        VueUtil.loop(this.fields, function(field) {
          field.initValue();
        });
      },
      isModify: function() {
        var modifyFLg = false;
        VueUtil.loop(this.fields, function(field) {
          if (modifyFLg) return;
          modifyFLg = field.isModify();
        });
        return modifyFLg;
      },
      resetFields: function() {
        VueUtil.loop(this.fields, function(field) {
          field.resetField();
        });
      },
      validate: function(callback) {
        var self = this;
        self.$nextTick(function(){
          var valid = true;
          var count = 0;
          var errorMsgs = [];
          VueUtil.loop(self.fields, function(field, index) {
            field.validate('', function(errors) {
              if (errors) {
                valid = false;
                errorMsgs.push(errors);
              }
              if (VueUtil.isFunction(callback) && ++count === self.fields.length) {
                callback(valid);
              }
            });
          });
          if (errorMsgs.length > 0) {
            if (VueUtil.isFunction(self.customMessageMethod)) {
              self.customMessageMethod(errorMsgs);
            } else if (self.notifyMessage) {
              var createElement = self.$createElement;
              self.$notify.error({
                message: createElement('div', null, [self._l(errorMsgs, function(errorMsg, errorIndex) {
                  return [createElement('span', {key: errorIndex}, [errorMsg]), createElement('br', null, [])];
                })]),
                duration: 0
              });
            }
          }
        });
      },
      validateField: function(prop, cb) {
        var field = VueUtil.filter(this.fields, function(field) {
          return (field.prop === prop);
        })[0];
        if (!field) {
          throw 'must call validateField with valid prop string!';
        }
        field.validate('', cb);
      }
    }
  };
  Vue.component(VueForm.name, VueForm);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VueValidator'], definition);
  } else {
    context.VueFormItem = definition(context.Vue, context.VueUtil, context.VueValidator);
    delete context.VueFormItem;
    delete context.VueValidator;
  }
})(this, function(Vue, VueUtil, VueValidator) {
  'use strict';
  var VueFormItem = {
    template: '<div :class="[\'vue-form-item\', {\'is-notify\': form.notifyMessage || form.customMessageMethod,\'is-error\': validateState === \'error\',\'is-validating\': validateState === \'validating\',\'is-required\': isRequired || required}]"><label :for="prop" :class="[\'vue-form-item__label\', {\'is-responsive\': form.labelResponsive}]" :style="labelStyle" v-if="label" ref="label">{{label + form.labelSuffix}}</label><div class="vue-form-item__content" :style="contentStyle" ref="content"><slot></slot><div class="vue-form-item__error" v-if="validateState === \'error\' && showMessage && form.showMessage && !form.notifyMessage && !form.customMessageMethod">{{validateMessage}}</div></div></div>',
    name: 'VueFormItem',
    mixins: [VueUtil.component.emitter],
    props: {
      label: String,
      labelWidth: String,
      prop: String,
      required: Boolean,
      rules: [Object, Array],
      error: String,
      validateStatus: String,
      showMessage: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      error: function(value) {
        this.validateMessage = value;
        this.validateState = 'error';
      },
      validateStatus: function(value) {
        this.validateState = value;
      },
      label: {
        immediate: true,
        handler: function(val) {
          var self = this;
          if (VueUtil.isDef(val)) {
            self.$nextTick(function() {
              VueUtil.removeResizeListener(self.form.$el, self.resetLabelWidth);
              VueUtil.addResizeListener(self.form.$el, self.resetLabelWidth);
            });
          } else {
            self.$nextTick(function() {
              VueUtil.removeResizeListener(self.form.$el, self.resetLabelWidth);
            });
          }
        }
      }
    },
    computed: {
      labelStyle: function() {
        var ret = {};
        var labelStyleWidth = this.labelStyleWidth();
        if (labelStyleWidth) {
          ret.width = labelStyleWidth;
        }
        return ret;
      },
      contentStyle: function() {
        var ret = {};
        var labelStyleWidth = this.labelStyleWidth();
        if (labelStyleWidth) {
          ret.marginLeft = labelStyleWidth;
        }
        return ret;
      },
      form: function() {
        var parent = this.$parent;
        while (parent.$options.name !== 'VueForm') {
          parent = parent.$parent;
        }
        return parent;
      },
      fieldValue: {
        cache: false,
        get: function() {
          var model = this.form.model;
          if (!model || !this.prop) {
            return;
          }
          var path = this.prop;
          if (path.indexOf(':') !== -1) {
            path = path.replace(/:/, '.');
          }
          return this.getPropByPath(model, path).v;
        }
      }
    },
    data: function() {
      return {
        validateState: '',
        validateMessage: '',
        validateDisabled: false,
        validator: {},
        isRequired: false,
        initialValue: null
      };
    },
    methods: {
      getPropByPath: function(obj, path) {
        var tempObj = obj;
        path = path.replace(/\[(\w+)\]/g, '.$1');
        path = path.replace(/^\./, '');
        var keyArr = path.split('.');
        for (var i = 0, len = keyArr.length; i < len - 1; ++i) {
          var key = keyArr[i];
          tempObj = tempObj[key];
          if (!VueUtil.isDef(tempObj)) {
            throw 'please transfer a valid prop path to form item!';
          }
        }
        return {
          o: tempObj,
          k: keyArr[i],
          v: tempObj[keyArr[i]]
        };
      },
      labelStyleWidth: function() {
        if (this.form.labelPosition === 'top' || (this.form.labelResponsive && VueUtil.getStyle(this.$refs.label, 'display') === 'inline-block')) return '';
        var labelWidth = this.labelWidth || this.form.labelWidth;
        return labelWidth;
      },
      resetLabelWidth: function() {
        var labelStyleWidth = this.labelStyleWidth();
        this.$refs.label.style.width = labelStyleWidth;
        this.$refs.content.style.marginLeft = labelStyleWidth;
      },
      validate: function(trigger, callback) {
        var self = this;
        var noop = function() {};
        if (VueUtil.isFunction(self.form.customMessageMethod)) {
          noop = self.form.customMessageMethod;
        } else if (self.form.notifyMessage) {
          noop = function(errorMsg) {
            if (errorMsg) {
              self.$notify.error({message: errorMsg});
            }
          };
        }
        callback = callback || noop;
        var rules = self.getFilteredRule(trigger);
        if (!rules || rules.length === 0) {
          callback();
          return true;
        }
        self.validateState = 'validating';
        var descriptor = {};
        descriptor[self.prop] = rules;
        var validator = new VueValidator(descriptor);
        var model = {};
        model[self.prop] = self.fieldValue;
        validator.validate(model, {
          firstFields: true
        }, function(errors, fields) {
          self.validateState = !errors ? 'success' : 'error';
          self.validateMessage = errors ? errors[0].message : '';
          callback(self.validateMessage);
        });
      },
      resetField: function() {
        this.validateState = '';
        this.validateMessage = '';
        var model = this.form.model;
        var value = this.fieldValue;
        var path = this.prop;
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }
        var prop = this.getPropByPath(model, path);
        if (VueUtil.isArray(value) && value.length > 0) {
          this.validateDisabled = true;
          prop.o[prop.k] = [];
        } else if (value) {
          this.validateDisabled = true;
          prop.o[prop.k] = this.initialValue;
        }
      },
      isModify: function() {
        this.validateState = '';
        this.validateMessage = '';
        var model = this.form.model;
        var value = this.fieldValue;
        var path = this.prop;
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }
        var prop = this.getPropByPath(model, path);
        return (prop.o[prop.k] !== this.initialValue);
      },
      initValue: function() {
        this.initialValue = this.fieldValue;
      },
      getRules: function() {
        var formRules = this.form.rules;
        var selfRuels = this.rules;
        formRules = formRules ? formRules[this.prop] : [];
        return VueUtil.mergeArray([], (selfRuels || formRules || []));
      },
      getFilteredRule: function(trigger) {
        var rules = this.getRules();
        return VueUtil.filter(rules, function(rule) {
          return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
        });
      },
      onFieldBlur: function() {
        this.validate('blur');
      },
      onFieldChange: function() {
        if (this.validateDisabled) {
          this.validateDisabled = false;
          return;
        }
        this.validate('change');
      }
    },
    mounted: function() {
      var self = this;
      if (self.prop) {
        self.dispatch('VueForm', 'vue.form.addField', [self]);
        self.initValue();
        var rules = self.getRules();
        if (rules.length) {
          VueUtil.loop(rules, function(rule) {
            if (rule.required) {
              self.isRequired = true;
              return false;
            }
          });
          self.$on('vue.form.blur', self.onFieldBlur);
          self.$on('vue.form.change', self.onFieldChange);
        }
      }
    },
    beforeDestroy: function() {
      this.dispatch('VueForm', 'vue.form.removeField', [this]);
      VueUtil.removeResizeListener(this.form.$el, this.resetLabelWidth);
    }
  };
  Vue.component(VueFormItem.name, VueFormItem);
});

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports['Cleave'] = factory();
	else
		root['Cleave'] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = '';

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	/**
	 * Construct a new Cleave instance by passing the configuration object
	 *
	 * @param {String | HTMLElement} element
	 * @param {Object} opts
	 */
	var Cleave = function (element, opts) {
	    var owner = this;

	    if (typeof element === 'string') {
	        owner.element = document.querySelector(element);
	    } else {
	        owner.element = ((typeof element.length !== 'undefined') && element.length > 0) ? element[0] : element;
	    }

	    if (!owner.element) {
	        throw new Error('[cleave.js] Please check the element');
	    }

	    opts.initValue = owner.element.value;

	    owner.properties = Cleave.DefaultProperties.assign({}, opts);

	    owner.init();
	};

	Cleave.prototype = {
	    init: function () {
	        var owner = this, pps = owner.properties;

	        // no need to use this lib
	        if (!pps.numeral && !pps.phone && !pps.creditCard && !pps.time && !pps.date && (pps.blocksLength === 0 && !pps.prefix)) {
	            owner.onInput(pps.initValue);

	            return;
	        }

	        pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);

	        owner.isAndroid = Cleave.Util.isAndroid();
	        owner.lastInputValue = '';

	        owner.onChangeListener = owner.onChange.bind(owner);
	        owner.onKeyDownListener = owner.onKeyDown.bind(owner);
	        owner.onFocusListener = owner.onFocus.bind(owner);
	        owner.onCutListener = owner.onCut.bind(owner);
	        owner.onCopyListener = owner.onCopy.bind(owner);

	        owner.element.addEventListener('input', owner.onChangeListener);
	        owner.element.addEventListener('keydown', owner.onKeyDownListener);
	        owner.element.addEventListener('focus', owner.onFocusListener);
	        owner.element.addEventListener('cut', owner.onCutListener);
	        owner.element.addEventListener('copy', owner.onCopyListener);


	        owner.initPhoneFormatter();
	        owner.initDateFormatter();
	        owner.initTimeFormatter();
	        owner.initNumeralFormatter();

	        // avoid touch input field if value is null
	        // otherwise Firefox will add red box-shadow for <input required />
	        if (pps.initValue || (pps.prefix && !pps.noImmediatePrefix)) {
	            owner.onInput(pps.initValue);
	        }
	    },

	    initNumeralFormatter: function () {
	        var owner = this, pps = owner.properties;

	        if (!pps.numeral) {
	            return;
	        }

	        pps.numeralFormatter = new Cleave.NumeralFormatter(
	            pps.numeralDecimalMark,
	            pps.numeralIntegerScale,
	            pps.numeralDecimalScale,
	            pps.numeralThousandsGroupStyle,
	            pps.numeralPositiveOnly,
	            pps.stripLeadingZeroes,
	            pps.delimiter
	        );
	    },

	    initTimeFormatter: function() {
	        var owner = this, pps = owner.properties;

	        if (!pps.time) {
	            return;
	        }

	        pps.timeFormatter = new Cleave.TimeFormatter(pps.timePattern);
	        pps.blocks = pps.timeFormatter.getBlocks();
	        pps.blocksLength = pps.blocks.length;
	        pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
	    },

	    initDateFormatter: function () {
	        var owner = this, pps = owner.properties;

	        if (!pps.date) {
	            return;
	        }

	        pps.dateFormatter = new Cleave.DateFormatter(pps.datePattern);
	        pps.blocks = pps.dateFormatter.getBlocks();
	        pps.blocksLength = pps.blocks.length;
	        pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
	    },

	    initPhoneFormatter: function () {
	        var owner = this, pps = owner.properties;

	        if (!pps.phone) {
	            return;
	        }

	        // Cleave.AsYouTypeFormatter should be provided by
	        // external google closure lib
	        try {
	            pps.phoneFormatter = new Cleave.PhoneFormatter(
	                new pps.root.Cleave.AsYouTypeFormatter(pps.phoneRegionCode),
	                pps.delimiter
	            );
	        } catch (ex) {
	            throw new Error('[cleave.js] Please include phone-type-formatter.{country}.js lib');
	        }
	    },

	    onKeyDown: function (event) {
	        var owner = this, pps = owner.properties,
	            charCode = event.which || event.keyCode,
	            Util = Cleave.Util,
	            currentValue = owner.element.value;

	        if (charCode === 229
	            && Util.isAndroidBackspaceKeydown(owner.lastInputValue, currentValue)
	        ) {
	            charCode = 8;
	        }

	        owner.lastInputValue = currentValue;

	        // hit backspace when last character is delimiter
	        if (charCode === 8 && Util.isDelimiter(currentValue.slice(-pps.delimiterLength), pps.delimiter, pps.delimiters)) {
	            pps.backspace = true;

	            return;
	        }

	        pps.backspace = false;
	    },

	    onChange: function () {
	        this.onInput(this.element.value);
	    },

	    onFocus: function () {
	        var owner = this,
	            pps = owner.properties;

	        Cleave.Util.fixPrefixCursor(owner.element, pps.prefix, pps.delimiter, pps.delimiters);
	    },

	    onCut: function (e) {
	        this.copyClipboardData(e);
	        this.onInput('');
	    },

	    onCopy: function (e) {
	        this.copyClipboardData(e);
	    },

	    copyClipboardData: function (e) {
	        var owner = this,
	            pps = owner.properties,
	            Util = Cleave.Util,
	            inputValue = owner.element.value,
	            textToCopy = '';

	        if (!pps.copyDelimiter) {
	            textToCopy = Util.stripDelimiters(inputValue, pps.delimiter, pps.delimiters);
	        } else {
	            textToCopy = inputValue;
	        }

	        try {
	            if (e.clipboardData) {
	                e.clipboardData.setData('Text', textToCopy);
	            } else {
	                window.clipboardData.setData('Text', textToCopy);
	            }

	            e.preventDefault();
	        } catch (ex) {
	            //  empty
	        }
	    },

	    onInput: function (value) {
	        var owner = this, pps = owner.properties,
	            Util = Cleave.Util;

	        // case 1: delete one more character "4"
	        // 1234*| -> hit backspace -> 123|
	        // case 2: last character is not delimiter which is:
	        // 12|34* -> hit backspace -> 1|34*
	        // note: no need to apply this for numeral mode
	        if (!pps.numeral && pps.backspace && !Util.isDelimiter(value.slice(-pps.delimiterLength), pps.delimiter, pps.delimiters)) {
	            value = Util.headStr(value, value.length - pps.delimiterLength);
	        }

	        // phone formatter
	        if (pps.phone) {
	            if (pps.prefix && (!pps.noImmediatePrefix || value.length)) {
	                pps.result = pps.prefix + pps.phoneFormatter.format(value).slice(pps.prefix.length);
	            } else {
	                pps.result = pps.phoneFormatter.format(value);
	            }
	            owner.updateValueState();

	            return;
	        }

	        // numeral formatter
	        if (pps.numeral) {
	            if (pps.prefix && (!pps.noImmediatePrefix || value.length)) {
	                pps.result = pps.prefix + pps.numeralFormatter.format(value);
	            } else {
	                pps.result = pps.numeralFormatter.format(value);
	            }
	            owner.updateValueState();

	            return;
	        }

	        // date
	        if (pps.date) {
	            value = pps.dateFormatter.getValidatedDate(value);
	        }

	        // time
	        if (pps.time) {
	            value = pps.timeFormatter.getValidatedTime(value);
	        }

	        // strip delimiters
	        value = Util.stripDelimiters(value, pps.delimiter, pps.delimiters);

	        // strip prefix
	        value = Util.getPrefixStrippedValue(value, pps.prefix, pps.prefixLength, pps.result);

	        // strip non-numeric characters
	        value = pps.numericOnly ? Util.strip(value, /[^\d]/g) : value;

	        // convert case
	        value = pps.uppercase ? value.toUpperCase() : value;
	        value = pps.lowercase ? value.toLowerCase() : value;

	        // prefix
	        if (pps.prefix && (!pps.noImmediatePrefix || value.length)) {
	            value = pps.prefix + value;

	            // no blocks specified, no need to do formatting
	            if (pps.blocksLength === 0) {
	                pps.result = value;
	                owner.updateValueState();

	                return;
	            }
	        }

	        // update credit card props
	        if (pps.creditCard) {
	            owner.updateCreditCardPropsByValue(value);
	        }

	        // strip over length characters
	        value = Util.headStr(value, pps.maxLength);

	        // apply blocks
	        pps.result = Util.getFormattedValue(
	            value,
	            pps.blocks, pps.blocksLength,
	            pps.delimiter, pps.delimiters, pps.delimiterLazyShow
	        );

	        owner.updateValueState();
	    },

	    updateCreditCardPropsByValue: function (value) {
	        var owner = this, pps = owner.properties,
	            Util = Cleave.Util,
	            creditCardInfo;

	        // At least one of the first 4 characters has changed
	        if (Util.headStr(pps.result, 4) === Util.headStr(value, 4)) {
	            return;
	        }

	        creditCardInfo = Cleave.CreditCardDetector.getInfo(value, pps.creditCardStrictMode);

	        pps.blocks = creditCardInfo.blocks;
	        pps.blocksLength = pps.blocks.length;
	        pps.maxLength = Util.getMaxLength(pps.blocks);

	        // credit card type changed
	        if (pps.creditCardType !== creditCardInfo.type) {
	            pps.creditCardType = creditCardInfo.type;

	            pps.onCreditCardTypeChanged.call(owner, pps.creditCardType);
	        }
	    },

	    updateValueState: function () {
	        var owner = this,
	            Util = Cleave.Util,
	            pps = owner.properties;

	        if (!owner.element) {
	            return;
	        }

	        var endPos = owner.element.selectionEnd;
	        var oldValue = owner.element.value;
	        var newValue = pps.result;

	        endPos = Util.getNextCursorPosition(endPos, oldValue, newValue, pps.delimiter, pps.delimiters);

	        // fix Android browser type="text" input field
	        // cursor not jumping issue
	        if (owner.isAndroid) {
	            window.setTimeout(function () {
	                owner.element.value = newValue;
	                Util.setSelection(owner.element, endPos, pps.document, false);
	                owner.callOnValueChanged();
	            }, 1);

	            return;
	        }

	        owner.element.value = newValue;
	        Util.setSelection(owner.element, endPos, pps.document, false);
	        owner.callOnValueChanged();
	    },

	    callOnValueChanged: function () {
	        var owner = this,
	            pps = owner.properties;

	        pps.onValueChanged.call(owner, {
	            target: {
	                value: pps.result,
	                rawValue: owner.getRawValue()
	            }
	        });
	    },

	    setPhoneRegionCode: function (phoneRegionCode) {
	        var owner = this, pps = owner.properties;

	        pps.phoneRegionCode = phoneRegionCode;
	        owner.initPhoneFormatter();
	        owner.onChange();
	    },

	    setRawValue: function (value) {
	        var owner = this, pps = owner.properties;

	        value = value !== undefined && value !== null ? value.toString() : '';

	        if (pps.numeral) {
	            value = value.replace('.', pps.numeralDecimalMark);
	        }

	        pps.backspace = false;

	        owner.element.value = value;
	        owner.onInput(value);
	    },

	    getRawValue: function () {
	        var owner = this,
	            pps = owner.properties,
	            Util = Cleave.Util,
	            rawValue = owner.element.value;

	        if (pps.rawValueTrimPrefix) {
	            rawValue = Util.getPrefixStrippedValue(rawValue, pps.prefix, pps.prefixLength, pps.result);
	        }

	        if (pps.numeral) {
	            rawValue = pps.numeralFormatter.getRawValue(rawValue);
	        } else {
	            rawValue = Util.stripDelimiters(rawValue, pps.delimiter, pps.delimiters);
	        }

	        return rawValue;
	    },

	    getISOFormatDate: function () {
	        var owner = this,
	            pps = owner.properties;

	        return pps.date ? pps.dateFormatter.getISOFormatDate() : '';
	    },

	    getFormattedValue: function () {
	        return this.element.value;
	    },

	    destroy: function () {
	        var owner = this;

	        owner.element.removeEventListener('input', owner.onChangeListener);
	        owner.element.removeEventListener('keydown', owner.onKeyDownListener);
	        owner.element.removeEventListener('focus', owner.onFocusListener);
	        owner.element.removeEventListener('cut', owner.onCutListener);
	        owner.element.removeEventListener('copy', owner.onCopyListener);
	    },

	    toString: function () {
	        return '[Cleave Object]';
	    }
	};

	Cleave.NumeralFormatter = __webpack_require__(1);
	Cleave.DateFormatter = __webpack_require__(2);
	Cleave.TimeFormatter = __webpack_require__(3);
	Cleave.PhoneFormatter = __webpack_require__(4);
	Cleave.CreditCardDetector = __webpack_require__(5);
	Cleave.Util = __webpack_require__(6);
	Cleave.DefaultProperties = __webpack_require__(7);

	// for angular directive
	((typeof global === 'object' && global) ? global : window)['Cleave'] = Cleave;

	// CommonJS
	module.exports = Cleave;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())));

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	var NumeralFormatter = function (numeralDecimalMark,
	                                 numeralIntegerScale,
	                                 numeralDecimalScale,
	                                 numeralThousandsGroupStyle,
	                                 numeralPositiveOnly,
	                                 stripLeadingZeroes,
	                                 delimiter) {
	    var owner = this;

	    owner.numeralDecimalMark = numeralDecimalMark || '.';
	    owner.numeralIntegerScale = numeralIntegerScale > 0 ? numeralIntegerScale : 0;
	    owner.numeralDecimalScale = numeralDecimalScale >= 0 ? numeralDecimalScale : 2;
	    owner.numeralThousandsGroupStyle = numeralThousandsGroupStyle || NumeralFormatter.groupStyle.thousand;
	    owner.numeralPositiveOnly = !!numeralPositiveOnly;
	    owner.stripLeadingZeroes = stripLeadingZeroes !== false;
	    owner.delimiter = (delimiter || delimiter === '') ? delimiter : ',';
	    owner.delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';
	};

	NumeralFormatter.groupStyle = {
	    thousand: 'thousand',
	    lakh:     'lakh',
	    wan:      'wan',
	    none:     'none'    
	};

	NumeralFormatter.prototype = {
	    getRawValue: function (value) {
	        return value.replace(this.delimiterRE, '').replace(this.numeralDecimalMark, '.');
	    },

	    format: function (value) {
	        var owner = this, parts, partInteger, partDecimal = '';

	        // strip alphabet letters
	        value = value.replace(/[A-Za-z]/g, '')
	            // replace the first decimal mark with reserved placeholder
	            .replace(owner.numeralDecimalMark, 'M')

	            // strip non numeric letters except minus and "M"
	            // this is to ensure prefix has been stripped
	            .replace(/[^\dM-]/g, '')

	            // replace the leading minus with reserved placeholder
	            .replace(/^\-/, 'N')

	            // strip the other minus sign (if present)
	            .replace(/\-/g, '')

	            // replace the minus sign (if present)
	            .replace('N', owner.numeralPositiveOnly ? '' : '-')

	            // replace decimal mark
	            .replace('M', owner.numeralDecimalMark);

	        // strip any leading zeros
	        if (owner.stripLeadingZeroes) {
	            value = value.replace(/^(-)?0+(?=\d)/, '$1');
	        }

	        partInteger = value;

	        if (value.indexOf(owner.numeralDecimalMark) >= 0) {
	            parts = value.split(owner.numeralDecimalMark);
	            partInteger = parts[0];
	            partDecimal = owner.numeralDecimalMark + parts[1].slice(0, owner.numeralDecimalScale);
	        }

	        if (owner.numeralIntegerScale > 0) {
	          partInteger = partInteger.slice(0, owner.numeralIntegerScale + (value.slice(0, 1) === '-' ? 1 : 0));
	        }

	        switch (owner.numeralThousandsGroupStyle) {
	        case NumeralFormatter.groupStyle.lakh:
	            partInteger = partInteger.replace(/(\d)(?=(\d\d)+\d$)/g, '$1' + owner.delimiter);

	            break;

	        case NumeralFormatter.groupStyle.wan:
	            partInteger = partInteger.replace(/(\d)(?=(\d{4})+$)/g, '$1' + owner.delimiter);

	            break;

	        case NumeralFormatter.groupStyle.thousand:
	            partInteger = partInteger.replace(/(\d)(?=(\d{3})+$)/g, '$1' + owner.delimiter);

	            break;
	        }

	        return partInteger.toString() + (owner.numeralDecimalScale > 0 ? partDecimal.toString() : '');
	    }
	};

	module.exports = NumeralFormatter;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	var DateFormatter = function (datePattern) {
	    var owner = this;

	    owner.date = [];
	    owner.blocks = [];
	    owner.datePattern = datePattern;
	    owner.initBlocks();
	};

	DateFormatter.prototype = {
	    initBlocks: function () {
	        var owner = this;
	        owner.datePattern.forEach(function (value) {
	            if (value === 'Y') {
	                owner.blocks.push(4);
	            } else {
	                owner.blocks.push(2);
	            }
	        });
	    },

	    getISOFormatDate: function () {
	        var owner = this,
	            date = owner.date;

	        return date[2] ? (
	            date[2] + '-' + owner.addLeadingZero(date[1]) + '-' + owner.addLeadingZero(date[0])
	        ) : '';
	    },

	    getBlocks: function () {
	        return this.blocks;
	    },

	    getValidatedDate: function (value) {
	        var owner = this, result = '';

	        value = value.replace(/[^\d]/g, '');

	        owner.blocks.forEach(function (length, index) {
	            if (value.length > 0) {
	                var sub = value.slice(0, length),
	                    sub0 = sub.slice(0, 1),
	                    rest = value.slice(length);

	                switch (owner.datePattern[index]) {
	                case 'd':
	                    if (sub === '00') {
	                        sub = '01';
	                    } else if (parseInt(sub0, 10) > 3) {
	                        sub = '0' + sub0;
	                    } else if (parseInt(sub, 10) > 31) {
	                        sub = '31';
	                    }

	                    break;

	                case 'm':
	                    if (sub === '00') {
	                        sub = '01';
	                    } else if (parseInt(sub0, 10) > 1) {
	                        sub = '0' + sub0;
	                    } else if (parseInt(sub, 10) > 12) {
	                        sub = '12';
	                    }

	                    break;
	                }

	                result += sub;

	                // update remaining string
	                value = rest;
	            }
	        });

	        return this.getFixedDateString(result);
	    },

	    getFixedDateString: function (value) {
	        var owner = this, datePattern = owner.datePattern, date = [],
	            dayIndex = 0, monthIndex = 0, yearIndex = 0,
	            dayStartIndex = 0, monthStartIndex = 0, yearStartIndex = 0,
	            day, month, year, fullYearDone = false;

	        // mm-dd || dd-mm
	        if (value.length === 4 && datePattern[0].toLowerCase() !== 'y' && datePattern[1].toLowerCase() !== 'y') {
	            dayStartIndex = datePattern[0] === 'd' ? 0 : 2;
	            monthStartIndex = 2 - dayStartIndex;
	            day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
	            month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);

	            date = this.getFixedDate(day, month, 0);
	        }

	        // yyyy-mm-dd || yyyy-dd-mm || mm-dd-yyyy || dd-mm-yyyy || dd-yyyy-mm || mm-yyyy-dd
	        if (value.length === 8) {
	            datePattern.forEach(function (type, index) {
	                switch (type) {
	                case 'd':
	                    dayIndex = index;
	                    break;
	                case 'm':
	                    monthIndex = index;
	                    break;
	                default:
	                    yearIndex = index;
	                    break;
	                }
	            });

	            yearStartIndex = yearIndex * 2;
	            dayStartIndex = (dayIndex <= yearIndex) ? dayIndex * 2 : (dayIndex * 2 + 2);
	            monthStartIndex = (monthIndex <= yearIndex) ? monthIndex * 2 : (monthIndex * 2 + 2);

	            day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
	            month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
	            year = parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10);

	            fullYearDone = value.slice(yearStartIndex, yearStartIndex + 4).length === 4;

	            date = this.getFixedDate(day, month, year);
	        }

	        owner.date = date;

	        return date.length === 0 ? value : datePattern.reduce(function (previous, current) {
	            switch (current) {
	            case 'd':
	                return previous + owner.addLeadingZero(date[0]);
	            case 'm':
	                return previous + owner.addLeadingZero(date[1]);
	            default:
	                return previous + (fullYearDone ? owner.addLeadingZeroForYear(date[2]) : '');
	            }
	        }, '');
	    },

	    getFixedDate: function (day, month, year) {
	        day = Math.min(day, 31);
	        month = Math.min(month, 12);
	        year = parseInt((year || 0), 10);

	        if ((month < 7 && month % 2 === 0) || (month > 8 && month % 2 === 1)) {
	            day = Math.min(day, month === 2 ? (this.isLeapYear(year) ? 29 : 28) : 30);
	        }

	        return [day, month, year];
	    },

	    isLeapYear: function (year) {
	        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
	    },

	    addLeadingZero: function (number) {
	        return (number < 10 ? '0' : '') + number;
	    },

	    addLeadingZeroForYear: function (number) {
	        return (number < 10 ? '000' : (number < 100 ? '00' : (number < 1000 ? '0' : ''))) + number;
	    }
	};

	module.exports = DateFormatter;



/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	var TimeFormatter = function (timePattern) {
	    var owner = this;

	    owner.time = [];
	    owner.blocks = [];
	    owner.timePattern = timePattern;
	    owner.initBlocks();
	};

	TimeFormatter.prototype = {
	    initBlocks: function () {
	        var owner = this;
	        owner.timePattern.forEach(function () {
	            owner.blocks.push(2);
	        });
	    },

	    getISOFormatTime: function () {
	        var owner = this,
	            time = owner.time;

	        return time[2] ? (
	            owner.addLeadingZero(time[0]) + ':' + owner.addLeadingZero(time[1]) + ':' + owner.addLeadingZero(time[2])
	        ) : '';
	    },

	    getBlocks: function () {
	        return this.blocks;
	    },

	    getValidatedTime: function (value) {
	        var owner = this, result = '';

	        value = value.replace(/[^\d]/g, '');

	        owner.blocks.forEach(function (length, index) {
	            if (value.length > 0) {
	                var sub = value.slice(0, length),
	                    sub0 = sub.slice(0, 1),
	                    rest = value.slice(length);

	                switch (owner.timePattern[index]) {

	                case 'h':
	                    if (parseInt(sub0, 10) > 2) {
	                        sub = '0' + sub0;
	                    } else if (parseInt(sub, 10) > 23) {
	                        sub = '23';
	                    }

	                    break;

	                case 'm':
	                case 's':
	                    if (parseInt(sub0, 10) > 5) {
	                        sub = '0' + sub0;
	                    } else if (parseInt(sub, 10) > 60) {
	                        sub = '60';
	                    }
	                    break;
	                }

	                result += sub;

	                // update remaining string
	                value = rest;
	            }
	        });

	        return this.getFixedTimeString(result);
	    },

	    getFixedTimeString: function (value) {
	        var owner = this, timePattern = owner.timePattern, time = [],
	            secondIndex = 0, minuteIndex = 0, hourIndex = 0,
	            secondStartIndex = 0, minuteStartIndex = 0, hourStartIndex = 0,
	            second, minute, hour;

	        if (value.length === 6) {
	            timePattern.forEach(function (type, index) {
	                switch (type) {
	                case 's':
	                    secondIndex = index * 2;
	                    break;
	                case 'm':
	                    minuteIndex = index * 2;
	                    break;
	                case 'h':
	                    hourIndex = index * 2;
	                    break;
	                }
	            });

	            hourStartIndex = hourIndex;
	            minuteStartIndex = minuteIndex;
	            secondStartIndex = secondIndex;

	            second = parseInt(value.slice(secondStartIndex, secondStartIndex + 2), 10);
	            minute = parseInt(value.slice(minuteStartIndex, minuteStartIndex + 2), 10);
	            hour = parseInt(value.slice(hourStartIndex, hourStartIndex + 2), 10);

	            time = this.getFixedTime(hour, minute, second);
	        }

	        if (value.length === 4 && owner.timePattern.indexOf('s') < 0) {
	            timePattern.forEach(function (type, index) {
	                switch (type) {
	                case 'm':
	                    minuteIndex = index * 2;
	                    break;
	                case 'h':
	                    hourIndex = index * 2;
	                    break;
	                }
	            });

	            hourStartIndex = hourIndex;
	            minuteStartIndex = minuteIndex;

	            second = 0;
	            minute = parseInt(value.slice(minuteStartIndex, minuteStartIndex + 2), 10);
	            hour = parseInt(value.slice(hourStartIndex, hourStartIndex + 2), 10);

	            time = this.getFixedTime(hour, minute, second);
	        }

	        owner.time = time;

	        return time.length === 0 ? value : timePattern.reduce(function (previous, current) {
	            switch (current) {
	            case 's':
	                return previous + owner.addLeadingZero(time[2]);
	            case 'm':
	                return previous + owner.addLeadingZero(time[1]);
	            case 'h':
	                return previous + owner.addLeadingZero(time[0]);
	            }
	        }, '');
	    },

	    getFixedTime: function (hour, minute, second) {
	        second = Math.min(parseInt(second || 0, 10), 60);
	        minute = Math.min(minute, 60);
	        hour = Math.min(hour, 60);

	        return [hour, minute, second];
	    },

	    addLeadingZero: function (number) {
	        return (number < 10 ? '0' : '') + number;
	    }
	};

	module.exports = TimeFormatter;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	var PhoneFormatter = function (formatter, delimiter) {
	    var owner = this;

	    owner.delimiter = (delimiter || delimiter === '') ? delimiter : ' ';
	    owner.delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';

	    owner.formatter = formatter;
	};

	PhoneFormatter.prototype = {
	    setFormatter: function (formatter) {
	        this.formatter = formatter;
	    },

	    format: function (phoneNumber) {
	        var owner = this;

	        owner.formatter.clear();

	        // only keep number and +
	        phoneNumber = phoneNumber.replace(/[^\d+]/g, '');

	        // strip non-leading +
	        phoneNumber = phoneNumber.replace(/^\+/, 'B').replace(/\+/g, '').replace('B', '+');

	        // strip delimiter
	        phoneNumber = phoneNumber.replace(owner.delimiterRE, '');

	        var result = '', current, validated = false;

	        for (var i = 0, iMax = phoneNumber.length; i < iMax; i++) {
	            current = owner.formatter.inputDigit(phoneNumber.charAt(i));

	            // has ()- or space inside
	            if (/[\s()-]/g.test(current)) {
	                result = current;

	                validated = true;
	            } else {
	                if (!validated) {
	                    result = current;
	                }
	                // else: over length input
	                // it turns to invalid number again
	            }
	        }

	        // strip ()
	        // e.g. US: 7161234567 returns (716) 123-4567
	        result = result.replace(/[()]/g, '');
	        // replace library delimiter with user customized delimiter
	        result = result.replace(/[\s-]/g, owner.delimiter);

	        return result;
	    }
	};

	module.exports = PhoneFormatter;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	var CreditCardDetector = {
	    blocks: {
	        uatp:          [4, 5, 6],
	        amex:          [4, 6, 5],
	        diners:        [4, 6, 4],
	        discover:      [4, 4, 4, 4],
	        mastercard:    [4, 4, 4, 4],
	        dankort:       [4, 4, 4, 4],
	        instapayment:  [4, 4, 4, 4],
	        jcb15:         [4, 6, 5],
	        jcb:           [4, 4, 4, 4],
	        maestro:       [4, 4, 4, 4],
	        visa:          [4, 4, 4, 4],
	        mir:           [4, 4, 4, 4],
	        unionPay:      [4, 4, 4, 4],
	        general:       [4, 4, 4, 4],
	        generalStrict: [4, 4, 4, 7]
	    },

	    re: {
	        // starts with 1; 15 digits, not starts with 1800 (jcb card)
	        uatp: /^(?!1800)1\d{0,14}/,

	        // starts with 34/37; 15 digits
	        amex: /^3[47]\d{0,13}/,

	        // starts with 6011/65/644-649; 16 digits
	        discover: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,

	        // starts with 300-305/309 or 36/38/39; 14 digits
	        diners: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,

	        // starts with 51-55/2221–2720; 16 digits
	        mastercard: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,

	        // starts with 5019/4175/4571; 16 digits
	        dankort: /^(5019|4175|4571)\d{0,12}/,

	        // starts with 637-639; 16 digits
	        instapayment: /^63[7-9]\d{0,13}/,

	        // starts with 2131/1800; 15 digits
	        jcb15: /^(?:2131|1800)\d{0,11}/,

	        // starts with 2131/1800/35; 16 digits
	        jcb: /^(?:35\d{0,2})\d{0,12}/,

	        // starts with 50/56-58/6304/67; 16 digits
	        maestro: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,

	        // starts with 22; 16 digits
	        mir: /^220[0-4]\d{0,12}/,

	        // starts with 4; 16 digits
	        visa: /^4\d{0,15}/,

	        // starts with 62; 16 digits
	        unionPay: /^62\d{0,14}/
	    },

	    getInfo: function (value, strictMode) {
	        var blocks = CreditCardDetector.blocks,
	            re = CreditCardDetector.re;

	        // Some credit card can have up to 19 digits number.
	        // Set strictMode to true will remove the 16 max-length restrain,
	        // however, I never found any website validate card number like
	        // this, hence probably you don't want to enable this option.
	        strictMode = !!strictMode;

	        for (var key in re) {
	            if (re[key].test(value)) {
	                var block;

	                if (strictMode) {
	                    block = blocks.generalStrict;
	                } else {
	                    block = blocks[key];
	                }

	                return {
	                    type: key,
	                    blocks: block
	                };
	            }
	        }

	        return {
	            type:   'unknown',
	            blocks: strictMode ? blocks.generalStrict : blocks.general
	        };
	    }
	};

	module.exports = CreditCardDetector;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	var Util = {
	    noop: function () {
	    },

	    strip: function (value, re) {
	        return value.replace(re, '');
	    },

	    isDelimiter: function (letter, delimiter, delimiters) {
	        // single delimiter
	        if (delimiters.length === 0) {
	            return letter === delimiter;
	        }

	        // multiple delimiters
	        return delimiters.some(function (current) {
	            if (letter === current) {
	                return true;
	            }
	        });
	    },

	    getDelimiterREByDelimiter: function (delimiter) {
	        return new RegExp(delimiter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g');
	    },

	    getNextCursorPosition: function (prevPos, oldValue, newValue, delimiter, delimiters) {
	      // If cursor was at the end of value, just place it back.
	      // Because new value could contain additional chars.
	      if (oldValue.length === prevPos) {
	          return newValue.length;
	      }

	      return prevPos + this.getPositionOffset(prevPos, oldValue, newValue, delimiter ,delimiters);
	    },

	    getPositionOffset: function (prevPos, oldValue, newValue, delimiter, delimiters) {
	        var oldRawValue, newRawValue, lengthOffset;

	        oldRawValue = this.stripDelimiters(oldValue.slice(0, prevPos), delimiter, delimiters);
	        newRawValue = this.stripDelimiters(newValue.slice(0, prevPos), delimiter, delimiters);
	        lengthOffset = oldRawValue.length - newRawValue.length;

	        return (lengthOffset !== 0) ? (lengthOffset / Math.abs(lengthOffset)) : 0;
	    },

	    stripDelimiters: function (value, delimiter, delimiters) {
	        var owner = this;

	        // single delimiter
	        if (delimiters.length === 0) {
	            var delimiterRE = delimiter ? owner.getDelimiterREByDelimiter(delimiter) : '';

	            return value.replace(delimiterRE, '');
	        }

	        // multiple delimiters
	        delimiters.forEach(function (current) {
	            value = value.replace(owner.getDelimiterREByDelimiter(current), '');
	        });

	        return value;
	    },

	    headStr: function (str, length) {
	        return str.slice(0, length);
	    },

	    getMaxLength: function (blocks) {
	        return blocks.reduce(function (previous, current) {
	            return previous + current;
	        }, 0);
	    },

	    // strip value by prefix length
	    // for prefix: PRE
	    // (PRE123, 3) -> 123
	    // (PR123, 3) -> 23 this happens when user hits backspace in front of "PRE"
	    getPrefixStrippedValue: function (value, prefix, prefixLength, prevValue) {
	        if (value.slice(0, prefixLength) !== prefix) {

	            // Check whether if it is a deletion
	            if (value.length < prevValue.length) {
	                value = value.length > prefixLength ? prevValue : prefix;
	            } else {
	                var diffIndex = this.getFirstDiffIndex(prefix, value.slice(0, prefixLength));
	                value = prefix + value.slice(diffIndex, diffIndex + 1) + value.slice(prefixLength + 1);
	            }
	        }

	        return value.slice(prefixLength);
	    },

	    getFirstDiffIndex: function (prev, current) {
	        var index = 0;

	        while (prev.charAt(index) === current.charAt(index)) {
	            if (prev.charAt(index++) === '') {
	                return -1;
	            }
	        }

	        return index;
	    },

	    getFormattedValue: function (value, blocks, blocksLength, delimiter, delimiters, delimiterLazyShow) {
	        var result = '',
	            multipleDelimiters = delimiters.length > 0,
	            currentDelimiter;

	        // no options, normal input
	        if (blocksLength === 0) {
	            return value;
	        }

	        blocks.forEach(function (length, index) {
	            if (value.length > 0) {
	                var sub = value.slice(0, length),
	                    rest = value.slice(length);

	                if (multipleDelimiters) {
	                    currentDelimiter = delimiters[delimiterLazyShow ? (index - 1) : index] || currentDelimiter;
	                } else {
	                    currentDelimiter = delimiter;
	                }

	                if (delimiterLazyShow) {
	                    if (index > 0) {
	                        result += currentDelimiter;
	                    }

	                    result += sub;
	                } else {
	                    result += sub;

	                    if (sub.length === length && index < blocksLength - 1) {
	                        result += currentDelimiter;
	                    }
	                }

	                // update remaining string
	                value = rest;
	            }
	        });

	        return result;
	    },

	    // move cursor to the end
	    // the first time user focuses on an input with prefix
	    fixPrefixCursor: function (el, prefix, delimiter, delimiters) {
	        if (!el) {
	            return;
	        }

	        var val = el.value,
	            appendix = delimiter || (delimiters[0] || ' ');

	        if (!el.setSelectionRange || !prefix || (prefix.length + appendix.length) < val.length) {
	            return;
	        }

	        var len = val.length * 2;

	        // set timeout to avoid blink
	        setTimeout(function () {
	            el.setSelectionRange(len, len);
	        }, 1);
	    },

	    setSelection: function (element, position, doc) {
	        if (element !== this.getActiveElement(doc)) {
	            return;
	        }

	        // cursor is already in the end
	        if (element && element.value.length <= position) {
	          return;
	        }

	        if (element.createTextRange) {
	            var range = element.createTextRange();

	            range.move('character', position);
	            range.select();
	        } else {
	            try {
	                element.setSelectionRange(position, position);
	            } catch (e) {
	                // eslint-disable-next-line
	                console.warn('The input element type does not support selection');
	            }
	        }
	    },
	    
	    getActiveElement: function(parent) {
	        var activeElement = parent.activeElement;
	        if (activeElement && activeElement.shadowRoot) {
	            return this.getActiveElement(activeElement.shadowRoot);
	        }
	        return activeElement;
	    },

	    isAndroid: function () {
	        return navigator && /android/i.test(navigator.userAgent);
	    },

	    // On Android chrome, the keyup and keydown events
	    // always return key code 229 as a composition that
	    // buffers the user’s keystrokes
	    // see https://github.com/nosir/cleave.js/issues/147
	    isAndroidBackspaceKeydown: function (lastInputValue, currentInputValue) {
	        if (!this.isAndroid() || !lastInputValue || !currentInputValue) {
	            return false;
	        }

	        return currentInputValue === lastInputValue.slice(0, -1);
	    }
	};

	module.exports = Util;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	/**
	 * Props Assignment
	 *
	 * Separate this, so react module can share the usage
	 */
	var DefaultProperties = {
	    // Maybe change to object-assign
	    // for now just keep it as simple
	    assign: function (target, opts) {
	        target = target || {};
	        opts = opts || {};

	        // credit card
	        target.creditCard = !!opts.creditCard;
	        target.creditCardStrictMode = !!opts.creditCardStrictMode;
	        target.creditCardType = '';
	        target.onCreditCardTypeChanged = opts.onCreditCardTypeChanged || (function () {});

	        // phone
	        target.phone = !!opts.phone;
	        target.phoneRegionCode = opts.phoneRegionCode || 'AU';
	        target.phoneFormatter = {};

	        // time
	        target.time = !!opts.time;
	        target.timePattern = opts.timePattern || ['h', 'm', 's'];
	        target.timeFormatter = {};

	        // date
	        target.date = !!opts.date;
	        target.datePattern = opts.datePattern || ['d', 'm', 'Y'];
	        target.dateFormatter = {};

	        // numeral
	        target.numeral = !!opts.numeral;
	        target.numeralIntegerScale = opts.numeralIntegerScale > 0 ? opts.numeralIntegerScale : 0;
	        target.numeralDecimalScale = opts.numeralDecimalScale >= 0 ? opts.numeralDecimalScale : 2;
	        target.numeralDecimalMark = opts.numeralDecimalMark || '.';
	        target.numeralThousandsGroupStyle = opts.numeralThousandsGroupStyle || 'thousand';
	        target.numeralPositiveOnly = !!opts.numeralPositiveOnly;
	        target.stripLeadingZeroes = opts.stripLeadingZeroes !== false;

	        // others
	        target.numericOnly = target.creditCard || target.date || !!opts.numericOnly;

	        target.uppercase = !!opts.uppercase;
	        target.lowercase = !!opts.lowercase;

	        target.prefix = (target.creditCard || target.date) ? '' : (opts.prefix || '');
	        target.noImmediatePrefix = !!opts.noImmediatePrefix;
	        target.prefixLength = target.prefix.length;
	        target.rawValueTrimPrefix = !!opts.rawValueTrimPrefix;
	        target.copyDelimiter = !!opts.copyDelimiter;

	        target.initValue = (opts.initValue !== undefined && opts.initValue !== null) ? opts.initValue.toString() : '';

	        target.delimiter =
	            (opts.delimiter || opts.delimiter === '') ? opts.delimiter :
	                (opts.date ? '/' :
	                    (opts.time ? ':' :
	                        (opts.numeral ? ',' :
	                            (opts.phone ? ' ' :
	                                ' '))));
	        target.delimiterLength = target.delimiter.length;
	        target.delimiterLazyShow = !!opts.delimiterLazyShow;
	        target.delimiters = opts.delimiters || [];

	        target.blocks = opts.blocks || [];
	        target.blocksLength = target.blocks.length;

	        target.root = (typeof global === 'object' && global) ? global : window;
	        target.document = opts.document || target.root.document;

	        target.maxLength = 0;

	        target.backspace = false;
	        target.result = '';

	        target.onValueChanged = opts.onValueChanged || (function () {});

	        return target;
	    }
	};

	module.exports = DefaultProperties;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())));

/***/ })
/******/ ]);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'Cleave'], definition);
  } else {
    context.VueInput = definition(context.Vue, context.VueUtil, context.Cleave);
    delete context.VueInput;
    delete context.Cleave;
  }
})(this, function(Vue, VueUtil, Cleave) {
  'use strict';
  var VueInput = {
    template: '<div :class="[type === \'textarea\' ? \'vue-textarea\' : \'vue-input\', size ? \'vue-input--\' + size : \'\', {\'is-disabled\': disabled, \'vue-input-group\': $slots.prepend || $slots.append, \'vue-input-group--append\': $slots.append, \'vue-input-group--prepend\': $slots.prepend, \'is-readonly\': readonly}]"><template v-if="type !== \'textarea\'"><div class="vue-input-group__prepend" v-if="$slots.prepend"><slot name="prepend"></slot></div><slot name="icon"><i :class="[\'vue-input__icon\', icon, onIconClick ? \'is-clickable\' : \'\']" v-if="icon" @click="handleIconClick" ref="icon"></i></slot><input :style="inputStyle" v-if="type !== \'textarea\'" class="vue-input__inner" :type="type" :name="name" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :maxlength="maxlength" :minlength="minlength" :autocomplete="autoComplete" :autofocus="autofocus" :tabindex="tabindex" :min="min" :max="max" :form="form" :value="currentValue" ref="input" @input="handleInput" @focus="handleFocus" @blur="handleBlur"><i class="vue-input__icon vue-icon-loading" v-if="validating"></i><div class="vue-input-group__append" v-if="$slots.append"><slot name="append"></slot></div></template><textarea v-else class="vue-textarea__inner" :value="currentValue" @input="handleInput" ref="textarea" :name="name" :placeholder="placeholder" :disabled="disabled" :style="textareaStyle" :readonly="readonly" :rows="rows" :form="form" :autofocus="autofocus" :tabindex="tabindex" :maxlength="maxlength" :minlength="minlength" @focus="handleFocus" @blur="handleBlur"></textarea></div>',
    name: 'VueInput',
    mixins: [VueUtil.component.emitter],
    data: function() {
      return {
        currentValue: this.value,
        textareaStyle: {}
      };
    },
    props: {
      value: [String, Number],
      placeholder: String,
      size: String,
      resize: String,
      readonly: Boolean,
      autofocus: Boolean,
      icon: String,
      tabindex: Number,
      disabled: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      name: String,
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      rows: {
        type: Number,
        default: 2
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      form: String,
      maxlength: Number,
      minlength: Number,
      max: {},
      min: {},
      cleave: {
        type: Object,
        default: function() {return null;}
      },
      validateEvent: {
        type: Boolean,
        default: true
      },
      onIconClick: Function,
      textAlign: String
    },
    computed: {
      validating: function() {
        return this.$parent.validateState === 'validating';
      },
      inputStyle: function() {
        var style={};
        if (['center', 'right'].indexOf(this.textAlign) !== -1) {
          style.textAlign = this.textAlign;
        }
        return style;
      }
    },
    watch: {
      'value': function(val) {
        this.setCurrentValue(val, true);
      }
    },
    methods: {
      focus: function() {
        if (this.type !== 'textarea') {
          this.$refs.input.focus();
        } else {
          this.$refs.textarea.focus();
        }
      },
      handleBlur: function(event) {
        this.$emit('blur', event);
        if (this.validateEvent) {
          this.dispatch('VueFormItem', 'vue.form.blur', [this.currentValue]);
        }
      },
      inputSelect: function() {
        this.$refs.input.select();
      },
      resizeTextarea: function() {
        if (!this.autosize || this.type !== 'textarea') return;
        var minRows = this.autosize.minRows;
        var maxRows = this.autosize.maxRows;
        var options = {resize: this.resize};
        var calcTextareaHeight = function(targetNode, minRows, maxRows, options) {
          var HIDDEN_STYLE = '\n height:0 !important;\n visibility:hidden !important;\n overflow:hidden !important;\n position:absolute !important;\n z-index:-1000 !important;\n top:0 !important;\n right:0 !important\n';
          var hiddenTextarea = document.createElement('textarea');
          document.body.appendChild(hiddenTextarea);
          var calculateNodeStylingFn = function(node) {
            var CONTEXT_STYLE = ['letter-spacing', 'line-height', 'padding-top', 'padding-bottom', 'font-family', 'font-weight', 'font-size', 'text-rendering', 'text-transform', 'width', 'text-indent', 'padding-left', 'padding-right', 'border-width', 'box-sizing'];
            var style = getComputedStyle(node);
            var boxSizing = style.getPropertyValue('box-sizing');
            var paddingSize = (parseFloat(style.getPropertyValue('padding-bottom')) + parseFloat(style.getPropertyValue('padding-top')));
            var borderSize = (parseFloat(style.getPropertyValue('border-bottom-width')) + parseFloat(style.getPropertyValue('border-top-width')));
            var contextStyle = VueUtil.map(CONTEXT_STYLE, function(name) {
              return name + ':' + style.getPropertyValue(name);
            }).join(';');
            var calculateNodeStylingObj = {};
            calculateNodeStylingObj.contextStyle = contextStyle;
            calculateNodeStylingObj.paddingSize = paddingSize;
            calculateNodeStylingObj.borderSize = borderSize;
            calculateNodeStylingObj.boxSizing = boxSizing;
            return calculateNodeStylingObj;
          };
          var calculateNodeStyling = calculateNodeStylingFn(targetNode);
          hiddenTextarea.setAttribute('style', calculateNodeStyling.contextStyle + ';' + HIDDEN_STYLE);
          hiddenTextarea.value = targetNode.value || targetNode.placeholder || '';
          var height = hiddenTextarea.scrollHeight;
          if (calculateNodeStyling.boxSizing === 'border-box') {
            height = height + calculateNodeStyling.borderSize;
          } else if (calculateNodeStyling.boxSizing === 'content-box') {
            height = height - calculateNodeStyling.paddingSize;
          }
          hiddenTextarea.value = '';
          var singleRowHeight = hiddenTextarea.scrollHeight - calculateNodeStyling.paddingSize;
          if (minRows !== null) {
            var minHeight = singleRowHeight * minRows;
            if (calculateNodeStyling.boxSizing === 'border-box') {
              minHeight = minHeight + calculateNodeStyling.paddingSize + calculateNodeStyling.borderSize;
            }
            height = Math.max(minHeight, height);
          }
          if (maxRows !== null) {
            var maxHeight = singleRowHeight * maxRows;
            if (calculateNodeStyling.boxSizing === 'border-box') {
              maxHeight = maxHeight + calculateNodeStyling.paddingSize + calculateNodeStyling.borderSize;
            }
            height = Math.min(maxHeight, height);
          }
          document.body.removeChild(hiddenTextarea);
          return VueUtil.merge({height: height + 'px'}, options);
        };
        this.textareaStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows, options);
      },
      handleFocus: function(event) {
        this.$emit('focus', event);
      },
      handleInput: function(event) {
        this.setCurrentValue(event.target.value);
      },
      handleIconClick: function(event) {
        if (this.onIconClick) {
          this.onIconClick(event);
        }
        this.$emit('click', event);
      },
      setCurrentValue: function(value, watchFlg) {
        if (!VueUtil.isDef(value)) value = '';
        var self = this;
        if (value === self.currentValue && !watchFlg)
          return;
        self.$nextTick(function() {
          self.resizeTextarea();
        });
        if (self.type !== 'textarea' && self.cleave !== null) {
          self.$refs.input.value = value;
          var cleaveObj = new Cleave(self.$refs.input, self.cleave);
          self.currentValue = cleaveObj.getFormattedValue();
          if (cleaveObj.getFormattedValue().length >= value.length && !watchFlg) {
            self.currentValue = value;
          }
          value = cleaveObj.getRawValue();
          cleaveObj.destroy && cleaveObj.destroy();
        } else {
          self.currentValue = value;
        }
        if (!watchFlg) {
          self.$emit('input', value);
          self.$emit('change', value);
        }
        if (self.validateEvent) {
          self.dispatch('VueFormItem', 'vue.form.change', [value]);
        }
      }
    },
    created: function() {
      this.$on('inputSelect', this.inputSelect);
    },
    mounted: function() {
      this.setCurrentValue(this.currentValue, true);
      this.resizeTextarea();
    }
  };
  Vue.component(VueInput.name, VueInput);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueAlert = definition(context.Vue);
    delete context.VueAlert;
  }
})(this, function(Vue) {
  'use strict';
  var VueAlert = {
    template: '<div :class="[\'vue-alert\', typeClass]" v-if="visible"><i :class="[\'vue-alert__icon\', iconClass, \'is-big\']" v-if="showIcon"></i><div class="vue-alert__content"><span class="vue-alert__title is-bold" v-if="title">{{title}}</span><div class="vue-alert__description"><slot></slot></div><i :class="[\'vue-alert__closebtn\', {\'is-customed\': closeText !== \'\', \'vue-icon-close\': closeText === \'\'}]" v-if="closable" @click="close()">{{closeText}}</i></div></div>',
    name: 'VueAlert',
    props: {
      title: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'info'
      },
      closable: {
        type: Boolean,
        default: true
      },
      closeText: {
        type: String,
        default: ''
      },
      showIcon: Boolean,
      dark: Boolean
    },
    data: function() {
      return {
        visible: true
      };
    },
    methods: {
      close: function() {
        this.visible = false;
        this.$emit('close');
      }
    },
    computed: {
      typeClass: function() {
        if (this.dark) {
          return 'vue-alert--' + this.type + '-dark';
        }
        return 'vue-alert--' + this.type;
      },
      iconClass: function() {
        var TYPE_CLASSES_MAP = {
          'success': 'vue-icon-success',
          'warning': 'vue-icon-warning',
          'error': 'vue-icon-error'
        };
        return TYPE_CLASSES_MAP[this.type] || 'vue-icon-information';
      }
    }
  };
  Vue.component(VueAlert.name, VueAlert);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePopup', 'VueUtil'], definition);
  } else {
    context.VueAside = definition(context.Vue, context.VuePopup, context.VueUtil);
    delete context.VueAside;
  }
})(this, function(Vue, VuePopup, VueUtil) {
  'use strict';
  var VueAside = {
    template: '<div :class="[{\'vue-aside__static\':relative}]"><div v-show="visibleaside" :class="[\'vue-aside__wrapper\', {\'vue-aside__absolute\':relative}, {\'is-cleanness\': cleannessModal}]" @click.self="handleWrapperClick"></div><transition :name="transitionName"><div v-show="visibleaside" :class="[\'vue-aside\', {\'vue-aside__absolute\':relative}, sizeClass, customClass, positionClass]" ref="aside"><div class="vue-aside__header"><span class="vue-aside__title" v-if="showTitle && !$slots.header">{{title}}</span><slot name="header"></slot><div v-if="showClose" class="vue-aside__headerbtn"><i class="vue-aside__close vue-icon-close" @click=\'handleClose\'></i></div></div><div class="vue-aside__body"><slot></slot></div><div class="vue-aside__footer" v-if="$slots.footer"><slot name="footer"></slot></div></div></transition></div>',
    name: 'VueAside',
    mixins: [VuePopup],
    data: function() {
      return {
        visibleaside: false
      };
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      closeOnClickModal: Boolean,
      closeOnPressEscape: {
        type: Boolean,
        default: true
      },
      showClose: Boolean,
      size: {
        type: String,
        default: 'small'
      },
      position: {
        type: String,
        default: 'right'
      },
      relative: Boolean,
      customClass: {
        type: String,
        default: ''
      },
      cleannessModal: Boolean,
      beforeClose: Function
    },
    watch: {
      visibleaside: function(val) {
        if (val) {
          this.opened = true;
          this.$emit('open');
          VueUtil.on(this.$el, 'scroll', this.updatePopper);
          var refsAside = this.$refs.aside;
          this.$nextTick(function() {
            refsAside.scrollTop = 0;
          });
        } else {
          this.opened = false;
          VueUtil.off(this.$el, 'scroll', this.updatePopper);
          this.$emit('close');
        }
      },
      visible: function(val) {
        if (val) {
          this.visibleaside = val;
        } else {
          if (VueUtil.isFunction(this.beforeClose)) {
            var self = this;
            var done = function(resolve) {
              if (!VueUtil.isDef(resolve)) resolve = true;
              if (resolve) {
                self.$nextTick(function() {
                  self.visibleaside = val;
                });
              } else {
                self.$emit('visible-change', true);
              }
            };
            self.beforeClose(done);
          } else {
            this.visibleaside = val;
          }
        }
      }
    },
    computed: {
      showTitle: function() {
        return VueUtil.trim(this.title) === '' ? false : true;
      },
      sizeClass: function() {
        return 'vue-aside--' + this.size;
      },
      positionClass: function() {
        var position = this.position;
        if (['left','right','top','bottom'].indexOf(position) === -1) {
          position = 'right';
        }
        return 'vue-aside-' + position;
      },
      transitionName: function() {
        var position = this.position;
        if (['left','right','top','bottom'].indexOf(position) === -1) {
          position = 'right';
        }
        return 'aside-' + position;
      }
    },
    methods: {
      handleWrapperClick: function() {
        if (!this.closeOnClickModal) return;
        this.handleClose();
      },
      handleClose: function() {
        this.$emit('visible-change', false);
      }
    }
  };
  Vue.component(VueAside.name, VueAside);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VuePopper'], definition);
  } else {
    context.VueAutocomplete = definition(context.Vue, context.VueUtil, context.VuePopper);
    delete context.VueAutocomplete;
  }
})(this, function(Vue, VueUtil, VuePopper) {
  'use strict';
  var VueAutocompleteSuggestions = {
    template: '<transition @after-leave="destroyPopper"><div v-show="showPopper" :class="[\'vue-autocomplete-suggestion\', {\'is-loading\': $parent.loading}]" :style="{width: dropdownWidth}"><ul class="vue-autocomplete-suggestion__wrap" ref="suggestion"><li v-if="$parent.loading"><i class="vue-icon-loading"></i></li><template v-for="(item, index) in suggestions" v-else><li ref="suggestionList" v-if="!$parent.customItem" :class="{\'highlighted\': $parent.highlightedIndex === index}" @click="select(item)">{{item[props.label]}}</li><component v-else :class="{\'highlighted\': $parent.highlightedIndex === index}" @click="select(item)" :is="$parent.customItem" :item="item" :index="index"></component></template></ul></div></transition>',
    mixins: [VuePopper, VueUtil.component.emitter],
    name: 'VueAutocompleteSuggestions',
    data: function() {
      return {
        dropdownWidth: ''
      };
    },
    props: {
      props: Object,
      suggestions: Array
    },
    methods: {
      select: function(item) {
        this.dispatch('VueAutocomplete', 'item-click', item);
      }
    },
    updated: function() {
      var self = this;
      self.$nextTick(function() {
        self.updatePopper();
      });
    },
    mounted: function() {
      this.popperElm = this.$el;
      this.referenceElm = this.$parent.$refs.input.$refs.input;
    },
    created: function() {
      var self = this;
      self.$on('visible', function(val, inputWidth) {
        self.dropdownWidth = inputWidth + 'px';
        self.showPopper = val;
      });
    }
  };
  var VueAutocomplete = {
    template: '<div class="vue-autocomplete" v-clickoutside="close"><vue-input :text-align="textAlign" :autofocus="autofocus" :tabindex="tabindex" ref="input" v-bind="$props" @compositionstart.native="handleComposition" @compositionupdate.native="handleComposition" @compositionend.native="handleComposition" @change="handleChange" @focus="handleFocus" @keydown.up.native.prevent="highlight(highlightedIndex - 1)" @keydown.down.native.prevent="highlight(highlightedIndex + 1)" @keydown.enter.native.prevent="handleKeyEnter" @keydown.native.tab="close"><template slot="prepend" v-if="$slots.prepend"><slot name="prepend"></slot></template><template slot="append" v-if="$slots.append"><slot name="append"></slot></template></vue-input><vue-autocomplete-suggestions :props="props" :class="[popperClass ? popperClass : \'\']" ref="suggestions" :suggestions="suggestions" v-if="suggestionVisible"></vue-autocomplete-suggestions></div>',
    name: 'VueAutocomplete',
    mixins: [VueUtil.component.emitter],
    components: {
      VueAutocompleteSuggestions: VueAutocompleteSuggestions
    },
    directives: {
      Clickoutside: VueUtil.component.clickoutside()
    },
    props: {
      props: {
        type: Object,
        default: function() {
          return {
            label: 'value',
            value: 'value'
          };
        }
      },
      popperClass: String,
      placeholder: String,
      disabled: Boolean,
      name: String,
      size: String,
      value: String,
      autofocus: Boolean,
      tabindex: Number,
      textAlign: String,
      fetchSuggestions: Function,
      triggerOnFocus: {
        type: Boolean,
        default: true
      },
      customItem: String,
      icon: String,
      onIconClick: Function
    },
    data: function() {
      return {
        suggestions: [],
        loading: false,
        highlightedIndex: -1,
        activated: false
      };
    },
    computed: {
      suggestionVisible: function() {
        var suggestions = this.suggestions;
        var isValidData = VueUtil.isArray(suggestions) && suggestions.length > 0;
        return (isValidData || this.loading) && this.activated;
      }
    },
    watch: {
      suggestionVisible: function(val) {
        var self = this;
        self.$nextTick(function() {
          self.broadcast('VueAutocompleteSuggestions', 'visible', [val, self.$refs.input.$refs.input.offsetWidth]);
        });
      }
    },
    methods: {
      focus: function() {
        this.$refs.input.focus();
      },
      getData: function(queryString) {
        var self = this;
        self.loading = true;
        self.fetchSuggestions && self.fetchSuggestions(queryString, function(suggestions) {
          self.loading = false;
          if (VueUtil.isArray(suggestions)) {
            self.suggestions = suggestions;
          } else {
            throw 'autocomplete suggestions must be an array';
          }
        });
      },
      handleComposition: function(event) {
        if (event.type === 'compositionend') {
          this.isOnComposition = false;
          this.handleChange(event.data);
        } else {
          this.isOnComposition = true;
        }
      },
      handleChange: function(value) {
        this.$emit('input', value);
        if (this.isOnComposition || (!this.triggerOnFocus && !value)) {
          this.suggestions = [];
          return;
        }
        this.getData(value);
      },
      handleFocus: function() {
        this.activated = true;
        if (this.triggerOnFocus) {
          this.getData(this.value);
        }
      },
      close: function() {
        this.activated = false;
      },
      handleKeyEnter: function() {
        if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
          this.select(this.suggestions[this.highlightedIndex]);
        }
      },
      select: function(item) {
        var self = this;
        self.$emit('input', item[self.props.value]);
        self.$emit('select', item);
        self.$nextTick(function() {
          self.suggestions = [];
          self.focus();
        });
      },
      highlight: function(index) {
        if (!this.suggestionVisible || this.loading) return;
        if (index < 0) index = 0;
        if (index >= this.suggestions.length) {
          index = this.suggestions.length - 1;
        }
        var suggestion = this.$refs.suggestions.$refs.suggestion;
        var suggestionList = this.$refs.suggestions.$refs.suggestionList;
        var highlightItem = suggestionList[index];
        var scrollTop = suggestion.scrollTop;
        var offsetTop = highlightItem.offsetTop;
        if (offsetTop + highlightItem.scrollHeight > (scrollTop + suggestion.clientHeight)) {
          suggestion.scrollTop += highlightItem.scrollHeight;
        }
        if (offsetTop < scrollTop) {
          suggestion.scrollTop -= highlightItem.scrollHeight;
        }
        this.highlightedIndex = index;
      }
    },
    mounted: function() {
      var self = this;
      self.isOnComposition = false;
      self.$on('item-click', function(item) {
        self.select(item);
      });
    },
    beforeDestroy: function() {
      this.$refs.suggestions && this.$refs.suggestions.$destroy();
    }
  };
  Vue.component(VueAutocomplete.name, VueAutocomplete);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueButtonGroup = definition(context.Vue);
    delete context.VueButtonGroup;
  }
})(this, function(Vue) {
  'use strict';
  var VueButtonGroup = {
    template: '<div class="vue-button-group"><slot></slot></div>',
    name: 'VueButtonGroup'
  };
  Vue.component(VueButtonGroup.name, VueButtonGroup);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueButton = definition(context.Vue);
    delete context.VueButton;
  }
})(this, function(Vue) {
  'use strict';
  var VueButton = {
    template: '<button @dblclick.stop :disabled="disabled || loading" @click="handleClick" :autofocus="autofocus" :tabindex="tabindex" :type="nativeType" :class="[\'vue-button\', type ? \'vue-button--\' + type : \'\', size ? \'vue-button--\' + size : \'\', {\'is-disabled\': disabled, \'is-loading\': loading, \'is-plain\': plain, \'is-circle\': circle}]"><i class="vue-icon-loading" v-if="loading"></i><i :class="icon" v-if="icon && !loading"></i><span v-if="$slots.default"><slot></slot></span></button>',
    name: 'VueButton',
    props: {
      type: {
        type: String,
        default: 'default'
      },
      size: String,
      icon: {
        type: String,
        default: ''
      },
      nativeType: {
        type: String,
        default: 'button'
      },
      loading: Boolean,
      disabled: Boolean,
      plain: Boolean,
      circle: Boolean,
      autofocus: Boolean,
      tabindex: Number
    },
    methods: {
      focus: function() {
        this.$el.focus();
      },
      handleClick: function(evt) {
        this.$emit('click', evt);
      }
    }
  };
  Vue.component(VueButton.name, VueButton);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueCheckboxGroup = definition(context.Vue, context.VueUtil);
    delete context.VueCheckboxGroup;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueCheckboxGroup = {
    template: '<div class="vue-checkbox-group"><slot></slot></div>',
    name: 'VueCheckboxGroup',
    mixins: [VueUtil.component.emitter],
    props: {
      value: {},
      min: Number,
      max: Number,
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean
    },
    watch: {
      value: function(value) {
        this.dispatch('VueFormItem', 'vue.form.change', [value]);
      }
    }
  };
  Vue.component(VueCheckboxGroup.name, VueCheckboxGroup);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueCheckboxButton = definition(context.Vue, context.VueUtil);
    delete context.VueCheckboxButton;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueCheckboxButton = {
    template: '<label :class="[\'vue-checkbox-button\', size ? \'vue-checkbox-button--\' + size : \'\', {\'is-disabled\': isDisabled}, {\'is-checked\': isChecked}, {\'is-focus\': focus}]"><input v-if="trueLabel || falseLabel" class="vue-checkbox-button__original" type="checkbox" :name="name" :disabled="isDisabled" :true-value="trueLabel" :false-value="falseLabel" v-model="model" @change="handleChange" @focus="focus = true" @blur="focus = false"><input v-else class="vue-checkbox-button__original" type="checkbox" :name="name" :disabled="disabled" :value="label" v-model="model" @change="handleChange" @focus="focus = true" @blur="focus = false"><span class="vue-checkbox-button__inner" v-if="$slots.default || label" :style="isChecked ? activeStyle : null"><slot>{{label}}</slot></span></label>',
    name: 'VueCheckboxButton',
    mixins: [VueUtil.component.emitter],
    data: function() {
      return {
        selfModel: false,
        focus: false
      };
    },
    props: {
      value: {},
      label: {},
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number]
    },
    computed: {
      model: {
        get: function() {
          return this._checkboxGroup ? this.store : VueUtil.isDef(this.value) ? this.value : this.selfModel;
        },
        set: function(val) {
          if (this._checkboxGroup) {
            var isLimitExceeded = false;
            (VueUtil.isDef(this._checkboxGroup.min) && val.length < this._checkboxGroup.min && (isLimitExceeded = true));
            (VueUtil.isDef(this._checkboxGroup.max) && val.length > this._checkboxGroup.max && (isLimitExceeded = true));
            isLimitExceeded === false && this.dispatch('VueCheckboxGroup', 'input', [val]);
          } else if (VueUtil.isDef(this.value)) {
            this.$emit('input', val);
          } else {
            this.selfModel = val;
          }
        }
      },
      isChecked: function() {
        if (VueUtil.isBoolean(this.model)) {
          return this.model;
        } else if (VueUtil.isArray(this.model)) {
          return this.model.indexOf(this.label) !== -1;
        } else if (VueUtil.isDef(this.model)) {
          return this.model === this.trueLabel;
        }
      },
      _checkboxGroup: function() {
        var parent = this.$parent;
        while (parent) {
          if (parent.$options.name !== 'VueCheckboxGroup') {
            parent = parent.$parent;
          } else {
            return parent;
          }
        }
        return false;
      },
      isDisabled: function() {
        return this.disabled || this._checkboxGroup.disabled;
      },
      store: function() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      },
      activeStyle: function() {
        return {
          backgroundColor: this._checkboxGroup.fill || '',
          borderColor: this._checkboxGroup.fill || '',
          color: this._checkboxGroup.textColor || '',
          'box-shadow': '-1px 0 0 0 ' + this._checkboxGroup.fill
        };
      },
      size: function() {
        return this._checkboxGroup.size;
      }
    },
    methods: {
      addToStore: function() {
        if (VueUtil.isArray(this.model)
          && this.model.indexOf(this.label) === -1) {
          this.model.push(this.label);
        } else {
          this.model = this.trueLabel || true;
        }
      },
      handleChange: function(ev) {
        var self = this;
        self.$emit('change', ev);
        if (self._checkboxGroup) {
          self.$nextTick(function() {
            self.dispatch('VueCheckboxGroup', 'change', [self._checkboxGroup.value]);
          });
        }
      }
    },
    created: function() {
      this.checked && this.addToStore();
    }
  };
  Vue.component(VueCheckboxButton.name, VueCheckboxButton);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueCheckbox = definition(context.Vue, context.VueUtil);
    delete context.VueCheckbox;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueCheckbox = {
    template: '<label class="vue-checkbox"><span :class="[\'vue-checkbox__input\', {\'is-disabled\': disabled, \'is-checked\': isChecked, \'is-indeterminate\': indeterminate, \'is-focus\': focus}]"><span class="vue-checkbox__inner"></span><input v-if="trueLabel || falseLabel" class="vue-checkbox__original" type="checkbox" :name="name" :disabled="disabled" :true-value="trueLabel" :false-value="falseLabel" v-model="model" @change="handleChange" @focus="focus = true" @blur="focus = false"><input v-else class="vue-checkbox__original" type="checkbox" :disabled="disabled" :value="label" :name="name" v-model="model" @change="handleChange" @focus="focus = true" @blur="focus = false"></span><span class="vue-checkbox__label" v-if="$slots.default || label"><slot></slot><template v-if="!$slots.default">{{label}}</template></span></label>',
    name: 'VueCheckbox',
    mixins: [VueUtil.component.emitter],
    data: function() {
      return {
        selfModel: false,
        focus: false
      };
    },
    computed: {
      model: {
        get: function() {
          return this.isGroup ? this.store : VueUtil.isDef(this.value) ? this.value : this.selfModel;
        },
        set: function(val) {
          if (this.isGroup) {
            var isLimitExceeded = false;
            (VueUtil.isDef(this._checkboxGroup.min) && val.length < this._checkboxGroup.min && (isLimitExceeded = true));
            (VueUtil.isDef(this._checkboxGroup.max) && val.length > this._checkboxGroup.max && (isLimitExceeded = true));
            isLimitExceeded === false && this.dispatch('VueCheckboxGroup', 'input', [val]);
          } else {
            this.$emit('input', val);
            this.selfModel = val;
          }
        }
      },
      isChecked: function() {
        if (VueUtil.isBoolean(this.model)) {
          return this.model;
        } else if (VueUtil.isArray(this.model)) {
          return this.model.indexOf(this.label) !== -1;
        } else if (VueUtil.isDef(this.model)) {
          return this.model === this.trueLabel;
        }
      },
      isGroup: function() {
        var parent = this.$parent;
        while (parent) {
          if (parent.$options.name !== 'VueCheckboxGroup') {
            parent = parent.$parent;
          } else {
            this._checkboxGroup = parent;
            return true;
          }
        }
        return false;
      },
      store: function() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      }
    },
    props: {
      value: {},
      label: {},
      indeterminate: Boolean,
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number]
    },
    methods: {
      addToStore: function() {
        if (VueUtil.isArray(this.model) && this.model.indexOf(this.label) === -1) {
          this.model.push(this.label);
        } else {
          this.model = this.trueLabel || true;
        }
      },
      handleChange: function(ev) {
        var self = this;
        self.$emit('change', ev);
        if (self.isGroup) {
          self.$nextTick(function(ev) {
            self.dispatch('VueCheckboxGroup', 'change', [self._checkboxGroup.value]);
          });
        }
      }
    },
    created: function() {
      this.checked && this.addToStore();
    }
  };
  Vue.component(VueCheckbox.name, VueCheckbox);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePopup', 'VueUtil'], definition);
  } else {
    context.VueDialog = definition(context.Vue, context.VuePopup, context.VueUtil);
    delete context.VueDialog;
  }
})(this, function(Vue, VuePopup, VueUtil) {
  'use strict';
  var VueDialog = {
    template: '<div><div :class="[\'vue-dialog__wrapper\', {\'is-cleanness\': cleannessModal}]" v-show="visibledialog&&size!==\'full\'" @click.self="handleWrapperClick"></div><transition name="dialog-fade"><div v-draggable v-show="visibledialog" :draggable-cancel-selector="draggableCancelSelector" :class="[\'vue-dialog\', sizeClass, customClass]" ref="dialog" :style="style"><div class="vue-dialog__header"><span class="vue-dialog__title" v-if="showTitle && !$slots.header">{{title}}</span><slot name="header"></slot><div class="vue-dialog__headerbtn" v-if="showClose"><i class="vue-dialog__close vue-icon-close" @click=\'handleClose\'></i></div></div><div class="vue-dialog__body"><slot></slot></div><div class="vue-dialog__footer" v-if="$slots.footer"><slot name="footer"></slot></div></div></transition></div>',
    name: 'VueDialog',
    mixins: [VuePopup],
    data: function() {
      return {
        visibledialog: false
      };
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      closeOnClickModal: Boolean,
      closeOnPressEscape: {
        type: Boolean,
        default: true
      },
      showClose: Boolean,
      size: {
        type: String,
        default: 'small'
      },
      customClass: {
        type: String,
        default: ''
      },
      top: {
        type: String,
        default: '15%'
      },
      cleannessModal: Boolean,
      beforeClose: Function,
      draggable: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      visibledialog: function(val) {
        if (val) {
          this.opened = true;
          this.$emit('open');
          VueUtil.on(this.$el, 'scroll', this.updatePopper);
          var refsDialog = this.$refs.dialog;
          this.$nextTick(function() {
            refsDialog.scrollTop = 0;
          });
        } else {
          this.opened = false;
          VueUtil.off(this.$el, 'scroll', this.updatePopper);
          this.$emit('close');
        }
      },
      visible: function(val) {
        if (val) {
          this.visibledialog = val;
        } else {
          if (VueUtil.isFunction(this.beforeClose)) {
            var self = this;
            var done = function(resolve) {
              if (!VueUtil.isDef(resolve)) resolve = true;
              if (resolve) {
                self.$nextTick(function() {
                  self.visibledialog = val;
                });
              } else {
                self.$emit('visible-change', true);
              }
            };
            self.beforeClose(done);
          } else {
            this.visibledialog = val;
          }
        }
      }
    },
    computed: {
      showTitle: function() {
        return VueUtil.trim(this.title) === '' ? false : true;
      },
      sizeClass: function() {
        return 'vue-dialog--' + this.size;
      },
      style: function() {
        return this.size === 'full' ? {} : {'top': this.top};
      },
      draggableCancelSelector: function() {
        return (this.size === 'full' || this.draggable === false) ? '.vue-dialog' : '.vue-dialog__headerbtn, .vue-dialog__body, .vue-dialog__footer';
      }
    },
    methods: {
      handleWrapperClick: function() {
        if (!this.closeOnClickModal) return;
        this.handleClose();
      },
      handleClose: function() {
        this.$emit('visible-change', false);
      }
    }
  };
  Vue.component(VueDialog.name, VueDialog);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueLoading = definition(context.Vue, context.VueUtil);
    delete context.VueLoading;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var directive = function() {
    var VueLoading = Vue.extend({
      template: '<transition @after-leave="handleAfterLeave"><div v-show="visible" :class="[\'vue-loading-mask\', customClass, {\'is-fullscreen\': fullscreen}]"><div class="vue-loading-spinner"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none"/></svg><p v-if="text" class="vue-loading-text">{{text}}</p></div></div></transition>',
      data: function() {
        return {
          text: null,
          fullscreen: true,
          visible: false,
          customClass: ''
        };
      },
      methods: {
        handleAfterLeave: function() {
          this.$emit('after-leave');
        }
      }
    });
    var insertDom = function(parent, el, binding) {
      if (!el.domVisible) {
        VueUtil.ownPropertyLoop(el.maskStyle, function(property) {
          el.mask.style[property] = el.maskStyle[property];
        });
        if (el.originalPosition !== 'absolute') {
          parent.style.position = 'relative';
        }
        if (binding.modifiers.fullscreen && binding.modifiers.lock) {
          parent.style.overflow = 'hidden';
        }
        parent.appendChild(el.mask);
        el.domVisible = true;
        el.instance.visible = true;
        el.domInserted = true;
        Vue.nextTick(function() {
          if (binding.modifiers.fullscreen) {
            el.instance.$el.focus();
          }
        });
      }
    };
    var toggleLoading = function(el, binding) {
      if (binding.value) {
        if (binding.modifiers.fullscreen) {
          el.originalPosition = document.body.style.position;
          el.originalOverflow = document.body.style.overflow;
          VueUtil.addClass(el.mask, 'is-fullscreen');
          insertDom(document.body, el, binding);
        } else {
          VueUtil.removeClass(el.mask, 'is-fullscreen');
          if (binding.modifiers.body) {
            el.originalPosition = document.body.style.position;
            VueUtil.loop(['top', 'left'], function(property) {
              var scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
              el.maskStyle[property] = el.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] + 'px';
            });
            VueUtil.loop(['height', 'width'], function(property) {
              el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px';
            });
            insertDom(document.body, el, binding);
          } else {
            el.originalPosition = el.style.position;
            insertDom(el, el, binding);
          }
        }
      } else {
        if (el.domVisible) {
          el.instance.$once('after-leave', function() {
            el.domVisible = false;
            if (binding.modifiers.fullscreen && el.originalOverflow !== 'hidden') {
              document.body.style.overflow = el.originalOverflow;
            }
            if (binding.modifiers.fullscreen || binding.modifiers.body) {
              document.body.style.position = el.originalPosition;
            } else {
              el.style.position = el.originalPosition;
            }
          });
          el.instance.visible = false;
        }
      }
    };
    var doKeyDown = function(e) {
      document.querySelector('.vue-loading-mask.is-fullscreen').focus();
      e.preventDefault();
      return false;
    };
    var bindEvent = function(binding) {
      if (binding.modifiers.fullscreen) {
        if (binding.value) {
          VueUtil.on(document, 'keydown', doKeyDown);
        } else {
          VueUtil.off(document, 'keydown', doKeyDown);
        }
      }
    };
    Vue.directive('loading', {
      bind: function(el, binding) {
        var mask = new VueLoading({
          el: document.createElement('div'),
          data: {
            text: el.getAttribute('vue-loading-text'),
            fullscreen: !!binding.modifiers.fullscreen,
            customClass: el.getAttribute('vue-loading-class'),
          }
        });
        el.instance = mask;
        el.mask = mask.$el;
        el.maskStyle = {};
        toggleLoading(el, binding);
      },
      update: function(el, binding) {
        if (binding.oldValue !== binding.value) {
          toggleLoading(el, binding);
          bindEvent(binding);
        }
      },
      unbind: function(el, binding) {
        if (el.domInserted) {
          el.instance.$destroy();
          VueUtil.off(document, 'keydown', doKeyDown);
        }
      }
    });
  };
  Vue.use(directive);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueMenuItemGroup = definition(context.Vue, context.VueUtil);
    delete context.VueMenuItemGroup;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueMenuItemGroup = {
    template: '<li class="vue-menu-item-group"><div class="vue-menu-item-group__title" :style="{paddingLeft: levelPadding + \'px\'}" v-if="showTitle"><template v-if="!$slots.title">{{title}}</template><slot v-else name="title"></slot></div><ul><slot></slot></ul></li>',
    name: 'VueMenuItemGroup',
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    data: function() {
      return {
        paddingLeft: 20
      };
    },
    computed: {
      showTitle: function() {
        if (VueUtil.trim(this.title) === '' && !this.$slots.title) {
          return false;
        }
        return true;
      },
      levelPadding: function() {
        var padding = 10;
        var parent = this.$parent;
        while (parent && parent.$options.name !== 'VueMenu') {
          if (parent.$options.name === 'VueSubmenu') {
            padding += 20;
          }
          parent = parent.$parent;
        }
        padding === 10 && (padding = 20);
        return padding;
      }
    }
  };
  Vue.component(VueMenuItemGroup.name, VueMenuItemGroup);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueMenuItem = definition(context.Vue, context.VueUtil);
    delete context.VueMenuItem;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueMenuItem = {
    template: '<li :style="paddingStyle" @click="handleClick" :class="[\'vue-menu-item\', {\'is-active\': active, \'is-disabled\': disabled}]"><slot></slot></li>',
    name: 'VueMenuItem',
    mixins: [VueUtil.component.menumixin, VueUtil.component.emitter],
    props: {
      index: {
        type: String,
        required: true
      },
      route: {
        type: Object,
        required: false
      },
      disabled: Boolean
    },
    computed: {
      active: function() {
        return this.index === this.rootMenu.activedIndex;
      }
    },
    methods: {
      handleClick: function() {
        this.dispatch('VueMenu', 'item-click', this);
      }
    },
    created: function() {
      this.parentMenu.addItem(this);
      this.rootMenu.addItem(this);
    },
    beforeDestroy: function() {
      this.parentMenu.removeItem(this);
      this.rootMenu.removeItem(this);
    }
  };
  Vue.component(VueMenuItem.name, VueMenuItem);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueMenu = definition(context.Vue, context.VueUtil);
    delete context.VueMenu;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueMenu = {
    template: '<ul :class="[\'vue-menu\', {\'vue-menu--horizontal\': mode === \'horizontal\', \'vue-menu--dark\': theme === \'dark\'}]"><slot></slot></ul>',
    name: 'VueMenu',
    mixins: [VueUtil.component.emitter],
    props: {
      mode: {
        type: String,
        default: 'vertical'
      },
      defaultActive: {
        type: String,
        default: ''
      },
      defaultOpeneds: Array,
      theme: {
        type: String,
        default: 'light'
      },
      uniqueOpened: Boolean,
      router: Boolean,
      menuTrigger: {
        type: String,
        default: 'hover'
      }
    },
    data: function() {
      return {
        activedIndex: this.defaultActive,
        openedMenus: VueUtil.mergeArray([], this.defaultOpeneds),
        items: {},
        submenus: {}
      };
    },
    watch: {
      defaultActive: function(value) {
        var item = this.items[value];
        if (!item) return;
        this.activedIndex = value;
        this.initOpenedMenu();
      },
      defaultOpeneds: function(value) {
        this.openedMenus = value;
      },
      '$route': {
        immediate: true,
        handler: function(value) {
          if (this.router) {
            var item = this.items[value.path];
            if (!item) return;
            this.activedIndex = value.path;
            this.initOpenedMenu();
          }
        }
      }
    },
    methods: {
      addItem: function(item) {
        this.items[item.index] = item;
      },
      removeItem: function(item) {
        delete this.items[item.index];
      },
      addSubmenu: function(item) {
        this.submenus[item.index] = item;
      },
      removeSubmenu: function(item) {
        delete this.submenus[item.index];
      },
      openMenu: function(index, indexPath) {
        var openedMenus = this.openedMenus;
        if (openedMenus.indexOf(index) !== -1)
          return;
        if (this.uniqueOpened) {
          this.openedMenus = VueUtil.filter(openedMenus, function(index) {
            return indexPath.indexOf(index) !== -1;
          });
        }
        this.openedMenus.push(index);
      },
      closeMenu: function(index, indexPath) {
        this.openedMenus.splice(this.openedMenus.indexOf(index), 1);
      },
      handleSubmenuClick: function(submenu) {
        var isOpened = this.openedMenus.indexOf(submenu.index) !== -1;
        if (isOpened) {
          this.closeMenu(submenu.index, submenu.indexPath);
          this.$emit('close', submenu.index, submenu.indexPath);
        } else {
          this.openMenu(submenu.index, submenu.indexPath);
          this.$emit('open', submenu.index, submenu.indexPath);
        }
      },
      handleItemClick: function(item) {
        this.$emit('select', item.index, item.indexPath, item);
        if (this.mode === 'horizontal') {
          this.openedMenus = [];
        }
        if (this.router) {
          this.routeToItem(item);
        } else {
          this.activedIndex = item.index;
        }
      },
      initOpenedMenu: function() {
        var self = this;
        var index = self.activedIndex;
        var activeItem = self.items[index];
        if (!activeItem || self.mode === 'horizontal') return;
        var indexPath = activeItem.indexPath;
        VueUtil.loop(indexPath, function(index) {
          var submenu = self.submenus[index];
          submenu && self.openMenu(index, submenu.indexPath);
        });
      },
      routeToItem: function(item) {
        var route = item.route || item.index;
        try {
          this.$router.push(route);
        } catch (e) {
          throw e;
        }
      }
    },
    mounted: function() {
      this.initOpenedMenu();
      this.$on('item-click', this.handleItemClick);
      this.$on('submenu-click', this.handleSubmenuClick);
    }
  };
  Vue.component(VueMenu.name, VueMenu);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueRadioGroup = definition(context.Vue, context.VueUtil);
    delete context.VueRadioGroup;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueRadioGroup = {
    template: '<div class="vue-radio-group"><slot></slot></div>',
    name: 'VueRadioGroup',
    mixins: [VueUtil.component.emitter],
    props: {
      value: {},
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean
    },
    watch: {
      value: function(value) {
        this.$emit('change', value);
        this.dispatch('VueFormItem', 'vue.form.change', [this.value]);
      }
    }
  };
  Vue.component(VueRadioGroup.name, VueRadioGroup);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueRadioButton = definition(context.Vue);
    delete context.VueRadioButton;
  }
})(this, function(Vue) {
  'use strict';
  var VueRadioButton = {
    template: '<label :class="[\'vue-radio-button\', size ? \'vue-radio-button--\' + size : \'\', {\'is-active\': value === label}, {\'is-disabled\': isDisabled}]"><input class="vue-radio-button__original" :value="label" type="radio" v-model="value" :name="name" :disabled="isDisabled"><span class="vue-radio-button__inner" :style="value === label ? activeStyle : null"><slot></slot><template v-if="!$slots.default">{{label}}</template></span></label>',
    name: 'VueRadioButton',
    props: {
      label: {},
      disabled: Boolean,
      name: String
    },
    computed: {
      value: {
        get: function() {
          return this._radioGroup.value;
        },
        set: function(value) {
          this._radioGroup.$emit('input', value);
        }
      },
      _radioGroup: function() {
        var parent = this.$parent;
        while (parent) {
          if (parent.$options.name !== 'VueRadioGroup') {
            parent = parent.$parent;
          } else {
            return parent;
          }
        }
        return false;
      },
      activeStyle: function() {
        return {
          backgroundColor: this._radioGroup.fill || '',
          borderColor: this._radioGroup.fill || '',
          boxShadow: this._radioGroup.fill ? '-1px 0 0 0 ' + this._radioGroup.fill : '',
          color: this._radioGroup.textColor || ''
        };
      },
      size: function() {
        return this._radioGroup.size;
      },
      isDisabled: function() {
        return this.disabled || this._radioGroup.disabled;
      }
    }
  };
  Vue.component(VueRadioButton.name, VueRadioButton);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePopper', 'VueUtil'], definition);
  } else {
    context.VueTooltip = definition(context.Vue, context.VuePopper, context.VueUtil);
    delete context.VueTooltip;
  }
})(this, function(Vue, VuePopper, VueUtil) {
  'use strict';
  var VueTooltip = {
    name: 'VueTooltip',
    mixins: [VuePopper],
    props: {
      disabled: Boolean,
      effect: String,
      popperClass: String,
      content: String,
      visibleArrow: {
        default: true
      },
      options: {
        default: function() {
          return {
            boundariesPadding: 10,
            gpuAcceleration: false
          };
        }
      },
      enterable: Boolean
    },
    beforeCreate: function() {
      var self = this;
      self.popperVM = new Vue({
        data: {node: ''},
        render: function(createElement) {
          return this.node;
        }
      }).$mount();
    },
    beforeDestroy: function() {
      this.popperVM.$destroy();
    },
    render: function(createElement) {
      var self = this;
      var effect = self.effect === 'light' ? 'light' : 'dark';
      if (self.popperVM) {
        self.popperVM.node = createElement('transition', {
          attrs: {
            name: 'tooltip-fade'
          },
          on: {
            afterLeave: self.destroyPopper
          }
        }, [createElement('div', {
          on: {
            mouseleave: function() {
              self.setExpectedState(false);
              self.debounceClose();
            },
            mouseenter: function() {
              self.setExpectedState(true);
            }
          },
          ref: 'popper',
          directives: [{
            name: 'show',
            value: !self.disabled && self.showPopper
          }],
          class: ['vue-tooltip__popper', 'is-' + effect, self.popperClass]
        }, [self.$slots.content || self.content])]);
      }
      if (!self.$slots.default || !self.$slots.default.length) return self.$slots.default;
      var getFirstComponentChild = function(children) {
        return VueUtil.filter(children, function(c) {
          return c && c.tag;
        })[0];
      };
      var vnode = getFirstComponentChild(self.$slots.default);
      if (!vnode) return vnode;
      var data = vnode.data = vnode.data || {};
      var on = vnode.data.on = vnode.data.on || {};
      on.mouseenter = self.addEventHandle(on.mouseenter, function() {self.setExpectedState(true); self.handleShowPopper();});
      on.mouseleave = self.addEventHandle(on.mouseleave, function() {self.setExpectedState(false); self.debounceClose();});
      data.staticClass = self.concatClass(data.staticClass, 'vue-tooltip');
      return vnode;
    },
    mounted: function() {
      this.referenceElm = this.$el;
    },
    methods: {
      debounceClose: VueUtil.debounce(function() {
        this.handleClosePopper();
      }),
      addEventHandle: function(old, fn) {
        return old ? VueUtil.isArray(old) ? VueUtil.mergeArray(old, fn) : [old, fn] : fn;
      },
      concatClass: function(a, b) {
        if (a && a.indexOf(b) !== -1) return a;
        return a ? b ? (a + ' ' + b) : a : (b || '');
      },
      handleShowPopper: function() {
        var self = this;
        if (!self.expectedState) return;
        self.showPopper = true;
      },
      handleClosePopper: function() {
        if (this.enterable && this.expectedState) return;
        this.showPopper = false;
      },
      setExpectedState: function(expectedState) {
        this.expectedState = expectedState;
      }
    }
  };
  Vue.component(VueTooltip.name, VueTooltip);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueRadio = definition(context.Vue, context.VueUtil);
    delete context.VueRadio;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueRadio = {
    template: '<label class="vue-radio"><span :class="[\'vue-radio__input\', {\'is-disabled\': isDisabled, \'is-checked\': model === label, \'is-focus\': focus}]"><span class="vue-radio__inner"></span><input class="vue-radio__original" :value="label" type="radio" v-model="model" @focus="focus=true" @blur="focus=false" :name="name" :disabled="isDisabled"></span><span class="vue-radio__label"><slot></slot><template v-if="!$slots.default">{{label}}</template></span></label>',
    name: 'VueRadio',
    mixins: [VueUtil.component.emitter],
    props: {
      value: {},
      label: {},
      disabled: Boolean,
      name: String
    },
    data: function() {
      return {
        focus: false
      };
    },
    computed: {
      isGroup: function() {
        var parent = this.$parent;
        while (parent) {
          if (parent.$options.name !== 'VueRadioGroup') {
            parent = parent.$parent;
          } else {
            this._radioGroup = parent;
            return true;
          }
        }
        return false;
      },
      model: {
        get: function() {
          return this.isGroup ? this._radioGroup.value : this.value;
        },
        set: function(val) {
          if (this.isGroup) {
            this.dispatch('VueRadioGroup', 'input', [val]);
          } else {
            this.$emit('input', val);
          }
        }
      },
      isDisabled: function() {
        return this.isGroup ? this._radioGroup.disabled || this.disabled : this.disabled;
      }
    }
  };
  Vue.component(VueRadio.name, VueRadio);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueSubmenu = definition(context.Vue, context.VueUtil);
    delete context.VueSubmenu;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueSubMenu = {
    template: '<li :class="{\'vue-submenu\': true, \'is-active\': active, \'is-opened\': opened}"><div class="vue-submenu__title" ref="submenu-title" :style="paddingStyle"><slot name="title"></slot><i :class="[\'vue-icon-arrow-down\', {\'vue-submenu__icon-arrow\': true}]"></i></div><template v-if="rootMenu.mode === \'horizontal\'"><ul class="vue-menu" v-show="opened"><slot></slot></ul></template><collapse-transition v-else><ul class="vue-menu" v-show="opened"><slot></slot></ul></collapse-transition></li>',
    name: 'VueSubmenu',
    mixins: [VueUtil.component.menumixin, VueUtil.component.emitter],
    components: {
      CollapseTransition: VueUtil.component.collapseTransition
    },
    props: {
      index: {
        type: String,
        required: true
      }
    },
    data: function() {
      return {
        items: {},
        submenus: {}
      };
    },
    computed: {
      opened: function() {
        return (this.rootMenu.openedMenus.indexOf(this.index) !== -1);
      },
      active: {
        cache: false,
        get: function() {
          var isActive = false;
          var submenus = this.submenus;
          var items = this.items;
          VueUtil.ownPropertyLoop(items, function(index) {
            if (items[index].active) {
              isActive = true;
            }
          });
          VueUtil.ownPropertyLoop(submenus, function(index) {
            if (submenus[index].active) {
              isActive = true;
            }
          });
          return isActive;
        }
      }
    },
    methods: {
      addItem: function(item) {
        this.items[item.index] = item;
      },
      removeItem: function(item) {
        delete this.items[item.index];
      },
      addSubmenu: function(item) {
        this.submenus[item.index] = item;
      },
      removeSubmenu: function(item) {
        delete this.submenus[item.index];
      },
      handleClick: function() {
        this.dispatch('VueMenu', 'submenu-click', this);
      },
      mouseToggle: VueUtil.debounce(300, function(val) {
        if (val) {
          this.rootMenu.openMenu(this.index, this.indexPath);
        } else {
          this.rootMenu.closeMenu(this.index, this.indexPath);
        }
      }),
      mouseEnter: function() {
        this.mouseToggle(true);
      },
      mouseLeave: function() {
        this.mouseToggle(false);
      },
      bindEvents: function() {
        var triggerElm;
        if (this.rootMenu.mode === 'horizontal' && this.rootMenu.menuTrigger === 'hover') {
          triggerElm = this.$el;
          VueUtil.on(triggerElm, 'mouseenter', this.mouseEnter);
          VueUtil.on(triggerElm, 'mouseleave', this.mouseLeave);
        } else {
          triggerElm = this.$refs['submenu-title'];
          VueUtil.on(triggerElm, 'click', this.handleClick);
        }
      },
      unBindEvents: function() {
        var triggerElm;
        if (this.rootMenu.mode === 'horizontal' && this.rootMenu.menuTrigger === 'hover') {
          triggerElm = this.$el;
          VueUtil.off(triggerElm, 'mouseenter', this.mouseEnter);
          VueUtil.off(triggerElm, 'mouseleave', this.mouseLeave);
        } else {
          triggerElm = this.$refs['submenu-title'];
          VueUtil.off(triggerElm, 'click', this.handleClick);
        }
      }
    },
    created: function() {
      this.parentMenu.addSubmenu(this);
      this.rootMenu.addSubmenu(this);
    },
    beforeDestroy: function() {
      this.parentMenu.removeSubmenu(this);
      this.rootMenu.removeSubmenu(this);
      this.unBindEvents();
    },
    mounted: function() {
      this.bindEvents();
    }
  };
  Vue.component(VueSubMenu.name, VueSubMenu);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueSwitch = definition(context.Vue);
    delete context.VueSwitch;
  }
})(this, function(Vue) {
  'use strict';
  var VueSwitch = {
    template: '<label :class="[\'vue-switch\', {\'is-disabled\': disabled, \'vue-switch--wide\': hasText}]"><div class="vue-switch__mask" v-show="disabled"></div><input class="vue-switch__input" type="checkbox" @change="handleChange" v-model="_value" :name="name" :disabled="disabled"><span class="vue-switch__core" ref="core" :style="{\'width\': coreWidth + \'px\'}"><span class="vue-switch__button" :style="buttonStyle"></span></span><transition name="label-fade"><div class="vue-switch__label vue-switch__label--left" v-show="value" :style="{\'width\': coreWidth + \'px\'}"><i :class="[onIconClass]" v-if="onIconClass"></i><span v-if="!onIconClass && onText">{{onText}}</span></div></transition><transition name="label-fade"><div class="vue-switch__label vue-switch__label--right" v-show="!value" :style="{\'width\': coreWidth + \'px\'}"><i :class="[offIconClass]" v-if="offIconClass"></i><span v-if="!offIconClass && offText">{{offText}}</span></div></transition></label>',
    name: 'VueSwitch',
    props: {
      value: {
        type: Boolean,
        default: true
      },
      disabled: Boolean,
      width: {
        type: Number,
        default: 0
      },
      onIconClass: {
        type: String,
        default: ''
      },
      offIconClass: {
        type: String,
        default: ''
      },
      onText: {
        type: String,
        default: 'ON'
      },
      offText: {
        type: String,
        default: 'OFF'
      },
      onColor: {
        type: String,
        default: ''
      },
      offColor: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      }
    },
    data: function() {
      return {
        coreWidth: this.width,
        buttonStyle: {
          transform: ''
        }
      };
    },
    computed: {
      hasText: function() {
        return this.onText || this.offText;
      },
      _value: {
        get: function() {
          return this.value;
        },
        set: function(val) {
          this.$emit('input', val);
        }
      }
    },
    watch: {
      value: function() {
        if (this.onColor || this.offColor) {
          this.setBackgroundColor();
        }
        this.handleButtonTransform();
      },
      width: function() {
          this.coreWidth = this.width;
      }
    },
    methods: {
      handleChange: function(event) {
        this.$emit('change', event.currentTarget.checked);
      },
      handleButtonTransform: function() {
        this.buttonStyle.transform = this.value ? 'translate(' + (this.coreWidth - 20) + 'px, 2px)' : 'translate(2px, 2px)';
      },
      setBackgroundColor: function() {
        var newColor = this.value ? this.onColor : this.offColor;
        this.$refs.core.style.borderColor = newColor;
        this.$refs.core.style.backgroundColor = newColor;
      }
    },
    mounted: function() {
      if (this.width === 0) {
        this.coreWidth = this.hasText ? 58 : 46;
      }
      this.handleButtonTransform();
      if (this.onColor || this.offColor) {
        this.setBackgroundColor();
      }
    }
  };
  Vue.component(VueSwitch.name, VueSwitch);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueTabPane = definition(context.Vue, context.VueUtil);
    delete context.VueTabPane;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueTabPane = {
    template: '<div class="vue-tab-pane" v-show="active"><keep-alive><router-view v-if="router && active && $route.meta.keepAlive"></router-view></keep-alive><router-view v-if="router && active && !$route.meta.keepAlive"></router-view><slot v-if="!router"></slot></div>',
    name: 'VueTabPane',
    props: {
      label: String,
      labelContent: Function,
      name: String,
      closable: Boolean,
      disabled: Boolean
    },
    data: function() {
      return {
        index: null
      };
    },
    computed: {
      isClosable: function() {
        return this.closable || this.$parent.closable;
      },
      active: function() {
        return this.$parent.currentName === (this.name || this.index);
      },
      router: function() {
        return this.$parent.router;
      }
    },
    mounted: function() {
      this.$parent.addPanes(this);
    },
    destroyed: function() {
      this.$parent.removePanes(this);
    },
    watch: {
      label: function() {
        this.$parent.$forceUpdate();
      }
    }
  };
  Vue.component(VueTabPane.name, VueTabPane);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueTabs = definition(context.Vue, context.VueUtil);
    delete context.VueTabs;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueTabNav = {
    props: {
      panes: Array,
      currentName: String,
      editable: Boolean,
      onTabClick: {
        type: Function,
        default: function() {}
      },
      onTabRemove: {
        type: Function,
        default: function() {}
      },
      type: String,
      router: Boolean
    },
    data: function() {
      return {
        scrollable: false,
        navStyle: {
          transform: ''
        }
      };
    },
    methods: {
      routeToItem: function(item) {
        var route = item.name;
        this.$router && this.$router.push(route);
      },
      scrollPrev: function() {
        var currentOffset = this.getCurrentScrollOffset();
        if (!currentOffset) return;
        var tabWidth = this.$refs.tabs[0].offsetWidth;
        var newOffset = currentOffset > tabWidth ? currentOffset - tabWidth : 0;
        this.setOffset(newOffset);
      },
      scrollNext: function() {
        var navWidth = this.$refs.nav.offsetWidth;
        var containerWidth = this.$refs.navScroll.offsetWidth;
        var currentOffset = this.getCurrentScrollOffset();
        if (navWidth - currentOffset <= containerWidth) return;
        var tabWidth = this.$refs.tabs[0].offsetWidth;
        var newOffset = navWidth - currentOffset > tabWidth ? currentOffset + tabWidth : (navWidth - tabWidth);
        this.setOffset(newOffset);
      },
      scrollToActiveTab: function() {
        if (!this.scrollable) return;
        var nav = this.$refs.nav;
        var activeTab = this.$el.querySelector('.is-active');
        var navScroll = this.$refs.navScroll;
        var activeTabBounding = activeTab.getBoundingClientRect();
        var navScrollBounding = navScroll.getBoundingClientRect();
        var navBounding = nav.getBoundingClientRect();
        var currentOffset = this.getCurrentScrollOffset();
        var newOffset = currentOffset;
        if (activeTabBounding.left < navScrollBounding.left) {
          newOffset = currentOffset - (navScrollBounding.left - activeTabBounding.left);
        }
        if (activeTabBounding.right > navScrollBounding.right) {
          newOffset = currentOffset + activeTabBounding.right - navScrollBounding.right;
        }
        if (navBounding.right < navScrollBounding.right) {
          newOffset = nav.offsetWidth - navScrollBounding.width;
        }
        this.setOffset(Math.max(newOffset, 0));
      },
      getCurrentScrollOffset: function() {
        var navStyle = this.navStyle;
        return navStyle.transform ? Number(navStyle.transform.match(/translateX\(-(\d+(\.\d+)*)px\)/)[1]) : 0;
      },
      setOffset: function(value) {
        this.navStyle.transform = 'translateX(-' + value + 'px)';
      },
      update: function() {
        if (this.$refs.nav && this.$refs.navScroll) {
          var navWidth = this.$refs.nav.offsetWidth;
          var containerWidth = this.$refs.navScroll.offsetWidth;
          var currentOffset = this.getCurrentScrollOffset();
          if (containerWidth < navWidth) {
            this.scrollable = this.scrollable || {};
            this.scrollable.prev = currentOffset;
            this.scrollable.next = currentOffset + containerWidth < navWidth;
            if (navWidth - currentOffset < containerWidth) {
              this.setOffset(navWidth - containerWidth);
            }
          } else {
            this.scrollable = false;
            if (currentOffset > 0) {
              this.setOffset(0);
            }
          }
        }
      },
      scrollYMouseWheel: function(event) {
        if (this.scrollable) {
          event.preventDefault();
          var wheelDelta = event.wheelDelta || -event.detail;
          if (wheelDelta < 0) {
            this.scrollNext();
          } else {
            this.scrollPrev();
          }
        }
      }
    },
    updated: function() {
      this.$nextTick(this.update);
    },
    render: function(createElement) {
      var type = this.type;
      var panes = this.panes;
      var editable = this.editable;
      var onTabClick = this.onTabClick;
      var onTabRemove = this.onTabRemove;
      var navStyle = this.navStyle;
      var scrollable = this.scrollable;
      var scrollNext = this.scrollNext;
      var scrollPrev = this.scrollPrev;
      var router = this.router;
      var routeToItem = this.routeToItem;
      var scrollBtn = scrollable ? [createElement('span', {
        'class': ['vue-tabs__nav-prev', scrollable.prev ? '' : 'is-disabled'],
        on: {
          'click': scrollPrev
        }
      }, [createElement('i', {
        'class': 'vue-icon-arrow-left'
      }, [])]), createElement('span', {
        'class': ['vue-tabs__nav-next', scrollable.next ? '' : 'is-disabled'],
        on: {
          'click': scrollNext
        }
      }, [createElement('i', {
        'class': 'vue-icon-arrow-right'
      }, [])])] : null;
      var tabs = this._l(panes, function(pane, index) {
        var tabName = pane.name || pane.index || index;
        var closable = pane.isClosable || editable;
        pane.index = '' + index;
        var btnClose = closable ? createElement('span', {'class': 'vue-icon-close', on: {'click': function click(ev) {onTabRemove(pane, ev);}}}, []) : null;
        var tabLabelContent = pane.$slots.label || pane.label;
        return createElement('div', {
          key: index,
          'class': {
            'vue-tabs__item': true,
            'is-active': pane.active,
            'is-disabled': pane.disabled,
            'is-closable': closable
          },
          ref: 'tabs',
          refInFor: true,
          on: {
            'click': function click(ev) {
              router && routeToItem(pane);
              onTabClick(pane, tabName, ev);
            }
          }
        }, [tabLabelContent, btnClose]);
      });
      return createElement('div', {
        'class': ['vue-tabs__nav-wrap', scrollable ? 'is-scrollable' : '']
      }, [scrollBtn, createElement('div', {
        'class': ['vue-tabs__nav-scroll'],
        ref: 'navScroll'
      }, [createElement('div', {
        'class': 'vue-tabs__nav',
        ref: 'nav',
        style: navStyle
      }, [tabs])])]);
    },
    computed: {
      mouseWheel: function() {
        return VueUtil.isFirefox ? 'DOMMouseScroll' : 'mousewheel';
      }
    },
    mounted: function() {
      VueUtil.on(this.$refs.navScroll, this.mouseWheel, this.scrollYMouseWheel);
      VueUtil.addResizeListener(this.$el, this.update);
    },
    beforeDestroy: function() {
      VueUtil.off(this.$refs.navScroll, this.mouseWheel, this.scrollYMouseWheel);
      VueUtil.removeResizeListener(this.$el, this.update);
    }
  };
  var VueTabs = {
    name: 'VueTabs',
    components: {
      TabNav: VueTabNav
    },
    props: {
      type: String,
      closable: Boolean,
      addable: Boolean,
      value: {},
      editable: Boolean,
      tabBottom: Boolean,
      router: Boolean
    },
    data: function() {
      return {
        currentName: this.value,
        panes: []
      };
    },
    watch: {
      value: function(value) {
        this.setCurrentName(value);
      },
      currentName: function(value) {
        var self = this;
        if (self.$refs.nav) {
          self.$nextTick(function() {
            self.$refs.nav.scrollToActiveTab();
          });
        }
      }
    },
    methods: {
      handleTabClick: function(tab, tabName, event) {
        if (tab.disabled)
          return;
        this.setCurrentName(tabName);
        this.$emit('tab-click', tab, event);
      },
      handleTabRemove: function(pane, ev) {
        if (pane.disabled)
          return;
        ev.stopPropagation();
        this.$emit('edit', pane.name, 'remove');
        this.$emit('tab-remove', pane.name);
      },
      handleTabAdd: function() {
        this.$emit('edit', null, 'add');
        this.$emit('tab-add');
      },
      setCurrentName: function(value) {
        this.currentName = value;
        this.$emit('input', value);
      },
      addPanes: function(item) {
        var index = this.$slots.default.indexOf(item.$vnode);
        this.panes.splice(index, 0, item);
      },
      removePanes: function(item) {
        var panes = this.panes;
        var index = panes.indexOf(item);
        if (index !== -1) {
          panes.splice(index, 1);
        }
      }
    },
    render: function(createElement) {
      var type = this.type;
      var handleTabClick = this.handleTabClick;
      var handleTabRemove = this.handleTabRemove;
      var handleTabAdd = this.handleTabAdd;
      var currentName = this.currentName;
      var panes = this.panes;
      var editable = this.editable;
      var addable = this.addable;
      var tabBottom = this.tabBottom;
      var router = this.router;
      var newButton = editable || addable ? createElement('vue-button', {
        'class': 'vue-tabs__new-tab',
        attrs: {
          type: 'text',
          icon: 'vue-icon-plus'
        },
        on: {
          'click': handleTabAdd
        }
      }, []) : null;
      var navData = {
        props: {
          currentName: currentName,
          onTabClick: handleTabClick,
          onTabRemove: handleTabRemove,
          editable: editable,
          type: type,
          panes: panes,
          router: router
        },
        ref: 'nav'
      };
      var header = createElement('div', {
        'class': 'vue-tabs__header'
      }, [newButton, createElement('tab-nav', navData, [])]);
      var panels = createElement('div', {
        'class': 'vue-tabs__content'
      }, [this.$slots.default]);
      return createElement('div', {
        'class': {
          'vue-tabs': true,
          'vue-tabs--card': type === 'card',
          'vue-tabs--border-card': type === 'border-card',
          'header-bottom': tabBottom
        }
      }, [tabBottom ? [panels, header] : [header, panels]]);
    },
    created: function() {
      if (!this.currentName) {
        this.setCurrentName('0');
      }
    }
  };
  Vue.component(VueTabs.name, VueTabs);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueTag = definition(context.Vue);
    delete context.VueTag;
  }
})(this, function(Vue) {
  'use strict';
  var VueTag = {
    template: '<div :class="[\'vue-tag\', type ? \'vue-tag--\' + type : \'\', {\'is-hit\': hit}]" :style="{width: closable ? width+32+\'px\' : width+13+\'px\'}"><span :style="{width: width+\'px\', float: \'left\'}" ref="span"><slot></slot></span><i class="vue-tag__close vue-icon-close" v-if="closable" @click="handleClose"></i></div>',
    name: 'VueTag',
    props: {
      text: String,
      closable: Boolean,
      type: String,
      hit: Boolean,
      width: Number
    },
    methods: {
      handleClose: function(event) {
        this.$emit('close', event);
      }
    },
    mounted: function() {
      var el = this.$el;
      var spanNode = this.$refs.span;
      if (this.width && this.width < spanNode.scrollWidth) {
        el.setAttribute('title', el.innerText);
      }
    }
  };
  Vue.component(VueTag.name, VueTag);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueTableColumn = definition(context.Vue, context.VueUtil);
    delete context.VueTableColumn;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var columnIdSeed = 1;
  var defaults = {
    default: {
      order: ''
    },
    selection: {
      width: 53,
      minWidth: 53,
      realWidth: 53,
      order: '',
      className: 'vue-table-column--selection'
    },
    expand: {
      width: 53,
      minWidth: 53,
      realWidth: 53,
      order: ''
    },
    index: {
      width: 53,
      minWidth: 53,
      realWidth: 53,
      order: ''
    }
  };
  var forced = {
    selection: {
      property: 'selectionColumn',
      renderHeader: function(createElement) {
        var states = this.store.states;
        return createElement('vue-checkbox', {
          on: {
            change: this.toggleAllSelection
          },
          attrs: {
            value: states.isAllSelected,
            indeterminate: states.selection.length > 0 && !states.isAllSelected
          }
        }, []);
      },
      renderCell: function(createElement, data) {
        var row = data.row;
        var column = data.column;
        var store = data.store;
        var index = data.$index;
        return createElement('vue-checkbox', {
          attrs: {
            disabled: !!column.selectable && !column.selectable.call(null, row, index),
            value: store.isSelected(row)
          },
          on: {
            input: function() {
              store.commit('rowSelectedChanged', row);
            }
          }
        }, []);
      },
      sortable: false,
      resizable: false
    },
    index: {
      property: 'indexColumn',
      renderHeader: function(createElement) {
        return '#';
      },
      renderCell: function(createElement, data) {
        var n = data.$index;
        return createElement('div', null, [n + 1]);
      },
      sortable: false
    },
    expand: {
      property: 'expandColumn',
      renderHeader: function(createElement) {
        return '';
      },
      renderCell: function(createElement, data, proxy) {
        var row = data.row;
        var store = data.store;
        var expanded = store.states.expandRows.indexOf(row) !== -1;
        return createElement('div', {
          class: 'vue-table__expand-icon ' + (expanded ? 'vue-table__expand-icon--expanded' : ''),
          on: {
            click: function() {
              return proxy.handleExpandClick(row);
            }
          }
        }, [createElement('i', {
          class: 'vue-icon vue-icon-arrow-right'
        }, [])]);
      },
      sortable: false,
      resizable: false,
      className: 'vue-table__expand-column'
    }
  };
  var VueTableColumn = {
    name: 'VueTableColumn',
    render: function(createElement) {
      var slots = this.$slots.default;
      return createElement('div', slots);
    },
    props: {
      type: {
        type: String,
        default: 'default'
      },
      label: String,
      printLabel: String,
      className: [String, Function],
      labelClassName: String,
      property: String,
      prop: String,
      width: {},
      minWidth: {},
      sortable: Boolean,
      sortMethod: Function,
      resizable: {
        type: Boolean,
        default: true
      },
      context: {},
      align: String,
      headerAlign: String,
      showOverflowTooltip: Boolean,
      fixed: [Boolean, String],
      formatter: Function,
      selectable: Function,
      visible: {
        type: Boolean,
        default: true
      },
      filterable: Boolean,
      filterMethod: Function,
      filteredValue: Array,
      filters: Array,
      aggregate: {
        type: String,
        default: ''
      },
      aggregateLabel: String,
      labelColspan: Boolean,
      colspan: Boolean,
      rowspan: Boolean
    },
    beforeCreate: function() {
      this.row = {};
      this.column = {};
      this.$index = 0;
    },
    computed: {
      owner: function() {
        var parent = this.$parent;
        while (parent && !parent.tableId) {
          parent = parent.$parent;
        }
        return parent;
      }
    },
    created: function() {
      var self = this;
      var columnId = self.columnId = ((self.$parent.tableId || (self.$parent.columnId + '_')) + 'column_' + columnIdSeed++);
      var parent = self.$parent;
      var owner = self.owner;
      var type = self.type;
      var width = self.width;
      if (VueUtil.isDef(width)) {
        width = parseInt(width, 10);
        if (isNaN(width)) {
          width = null;
        }
      }
      var minWidth = self.minWidth;
      if (VueUtil.isDef(minWidth)) {
        minWidth = parseInt(minWidth, 10);
        if (isNaN(minWidth)) {
          minWidth = 80;
        }
      }
      var getDefaultColumn = function(type, options) {
        var column = {};
        VueUtil.merge(column, defaults[type || 'default'], options);
        column.realWidth = column.width || column.minWidth;
        return column;
      };
      var column = getDefaultColumn(type, {
        id: columnId,
        label: self.label,
        printLabel: self.printLabel,
        className: self.className,
        labelClassName: self.labelClassName,
        property: self.prop || self.property,
        type: type,
        renderCell: null,
        renderHeader: self.renderHeader,
        minWidth: minWidth,
        width: width,
        visible: self.visible,
        context: self.context,
        align: self.align ? 'is-' + self.align : null,
        headerAlign: self.headerAlign ? 'is-' + self.headerAlign : 'is-center',
        sortable: self.sortable,
        sortMethod: self.sortMethod,
        resizable: self.resizable,
        showOverflowTooltip: self.showOverflowTooltip,
        formatter: self.formatter,
        selectable: self.selectable,
        fixed: self.fixed === '' ? true : self.fixed,
        fixedIndex: -1,
        filterMethod: self.filterMethod,
        filterable: self.filterable,
        filterOpened: false,
        filteredValue: self.filteredValue || [],
        filters: self.filters || [],
        aggregate: self.aggregate,
        aggregateLabel: self.aggregateLabel,
        labelColspan: self.labelColspan,
        rowspan: self.rowspan,
        getCellClass: function(rowIndex, cellIndex, rowData) {
          var classes = [];
          var className = self.className;
          if (VueUtil.isString(className)) {
            classes.push(className);
          } else if (VueUtil.isFunction(className)) {
            classes.push(className.call(null, rowIndex, cellIndex, rowData) || '');
          }
          return classes.join(' ');
        }
      });
      VueUtil.merge(column, forced[type] || {});
      self.columnConfig = column;
      var renderCell = column.renderCell;
      var renderHeader = column.renderHeader;
      column.renderHeader = function() {
        if (self.$scopedSlots.header) {
          column.renderHeader = function() {
            return self.$scopedSlots.header();
          };
        } else {
          column.renderHeader = renderHeader;
        }
      };
      if (type === 'expand') {
        owner.renderExpanded = function(createElement, data) {
          return self.$scopedSlots.default ? self.$scopedSlots.default(data) : self.$slots.default;
        };
        column.renderCell = function(createElement, data) {
          return createElement('div', {
            class: 'cell'
          }, [renderCell(createElement, data, this._renderProxy)]);
        };
        return;
      }
      column.renderCell = function(createElement, data) {
        if (self.$scopedSlots.default) {
          renderCell = function() {
            return self.$scopedSlots.default(data);
          };
        }
        if (!renderCell) {
          renderCell = function(createElement, data) {
            var row = data.row;
            var column = data.column;
            var property = column.property;
            var value = row[property];
            if (property && property.indexOf('.') !== -1) {
              var getValueByPath = function(object, prop) {
                prop = prop || '';
                var paths = prop.split('.');
                var current = object;
                var result = null;
                VueUtil.loop(paths, function(path, i) {
                  if (!current) return false;
                  if (i === paths.length - 1) {
                    result = current[path];
                    return false;
                  }
                  current = current[path];
                });
                return result;
              };
              value = getValueByPath(row, property);
            }
            if (VueUtil.isFunction(column.formatter)) {
              return column.formatter(row, column, value);
            }
            return value;
          };
        }
        return self.showOverflowTooltip ? createElement('div',
            {class: 'cell vue-tooltip'},
          [renderCell(createElement, data)]) : createElement('div', {
            class: 'cell'
          }, [renderCell(createElement, data)]);
      };
    },
    destroyed: function() {
      if (!this.$parent) return;
      this.owner.store.commit('removeColumn', this.columnConfig);
    },
    watch: {
      label: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.label = newVal;
          this.owner.doLayout();
        }
      },
      prop: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.property = newVal;
        }
      },
      property: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.property = newVal;
        }
      },
      align: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.align = newVal ? 'is-' + newVal : null;
          if (!this.headerAlign) {
            this.columnConfig.headerAlign = newVal ? 'is-' + newVal : null;
          }
        }
      },
      headerAlign: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.headerAlign = 'is-' + (newVal ? newVal : this.align);
        }
      },
      width: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.width = newVal;
          this.owner.doLayout();
        }
      },
      minWidth: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.minWidth = newVal;
          this.owner.doLayout();
        }
      },
      fixed: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.fixed = newVal;
          this.owner.doLayout();
        }
      },
      sortable: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.sortable = newVal;
        }
      },
      visible: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.visible = newVal;
          this.owner.doLayout();
        }
      },
      labelColspan: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.labelColspan = newVal;
          this.owner.doLayout();
        }
      },
      rowspan: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.rowspan = newVal;
          this.owner.doLayout();
        }
      }
    },
    mounted: function() {
      var owner = this.owner;
      var columnIndex;
      columnIndex = [].indexOf.call(owner.$refs.hiddenColumns.children, this.$el);

      if (columnIndex == -1) {
        columnIndex = [].indexOf.call(owner.$refs.hiddenColumns.children,this.$parent.$el);
      }
      owner.store.commit('insertColumn', this.columnConfig, columnIndex);
    }
  };
  Vue.component(VueTableColumn.name, VueTableColumn);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VuePopper'], definition);
  } else {
    context.VueTable = definition(context.Vue, context.VueUtil, context.VuePopper);
    delete context.VueTable;
  }
})(this, function(Vue, VueUtil, VuePopper) {
  'use strict';
  var TableStore = function(table, initialState) {
    this.table = table;
    this.states = {
      _columns: [],
      columns: [],
      labelColumns: [],
      fixedColumns: [],
      rightFixedColumns: [],
      _data: null,
      filteredData: null,
      data: null,
      sortingColumns: [],
      isAllSelected: false,
      selection: [],
      selectable: null,
      currentRow: null,
      hoverRow: null,
      filters: {},
      expandRows: [],
      aggregates: [],
      defaultExpandAll: false
    };
    VueUtil.merge(this.states, initialState);
  };
  TableStore.prototype.mutations = {
    setData: function(states, data) {
      var table = this.table;
      var dataInstanceChanged = states._data !== data;
      states._data = data;
      states.data = this.sortData((data || []), states);
      VueUtil.loop(states.data, function(data, index) {
        data.$index = index;
      });
      var oldCurrentRow = states.currentRow;
      if (states.data.indexOf(oldCurrentRow) === -1) {
        states.currentRow = null;
        if (states.currentRow !== oldCurrentRow) {
          table.$emit('current-change', null, oldCurrentRow);
        }
      }
      if (dataInstanceChanged) {
        this.clearSelection();
      } else {
        var selection = states.selection || [];
        var deleted = VueUtil.filter(selection, function(item) {
          return states.data.indexOf(item) === -1;
        });
        VueUtil.loop(deleted, function(deletedItem) {
          selection.splice(selection.indexOf(deletedItem), 1);
        });
        if (deleted.length) {
          table.$emit('selection-change', selection);
        }
      }
      this.updateAllSelected();
      if (states.defaultExpandAll) {
        states.expandRows = VueUtil.mergeArray([], states.data);
      }
      VueUtil.isVueComponent(table.$refs.tableBody) && table.$refs.tableBody.resetDelta(data.length);
      Vue.nextTick(function() {
        table.updateScrollY();
        table.resizeZone();
      });
    },
    changeSortCondition: function(states) {
      var self = this;
      states.data = self.sortData((states.filteredData || states._data || []), states);
      self.table.$emit('sort-change', self.states.sortingColumns);
      Vue.nextTick(function() {
        self.table.updateScrollY();
        self.table.resizeZone();
      });
    },
    filterChange: function(states, options) {
      var self = this;
      var values = options.values;
      var column = options.column;
      var silent = options.silent;
      if (values && !VueUtil.isArray(values)) {
        values = [values];
      }
      var prop = column.property;
      if (prop) {
        states.filters[column.id] = values;
      }
      var data = states._data;
      var filters = states.filters;
      VueUtil.ownPropertyLoop(filters, function(columnId) {
        var values = filters[columnId];
        if (!values || values.length === 0) return;
        var column = self.getColumnById(columnId);
        if (column) {
          if (column.filterMethod) {
            data = VueUtil.filter(data, function(row) {
              return values.some(function(value) {
                return column.filterMethod.call(null, value, row);
              });
            });
          } else {
            var columnKey = column.property;
            data = VueUtil.filter(data, function(row) {
              return values.some(function(value) {
                return row[columnKey] === value;
              });
            });
          }
        }
      });
      states.filteredData = data;
      states.data = self.sortData(data, states);
      if (!silent) {
        self.table.$emit('filter-change', filters);
      }
      self.table.$refs.tableBody.resetDelta(data.length);
      Vue.nextTick(function() {
        self.table.updateScrollY();
        self.table.resizeZone();
      });
    },
    insertColumn: function(states, column, index) {
      var array = states._columns;
      if (VueUtil.isDef(index)) {
        array.splice(index, 0, column);
      } else {
        array.push(column);
      }
      if (column.type === 'selection') {
        states.selectable = column.selectable;
      }
      this.updateColumns();
    },
    removeColumn: function(states, column) {
      var _columns = states._columns;
      if (_columns.length) {
        _columns.splice(_columns.indexOf(column), 1);
      }
      this.updateColumns();
    },
    setHoverRow: function(states, row) {
      states.hoverRow = row;
    },
    setCurrentRow: function(states, row) {
      var oldCurrentRow = states.currentRow;
      states.currentRow = row;
      if (oldCurrentRow !== row) {
        this.table.$emit('current-change', row, oldCurrentRow);
      }
    },
    rowSelectedChanged: function(states, row) {
      var changed = this.toggleRowSelection(row);
      var selection = states.selection;
      if (changed) {
        var table = this.table;
        table.$emit('selection-change', selection);
        table.$emit('select', selection, row);
      }
      this.updateAllSelected();
    },
    toggleRowExpanded: function(states, row, expanded) {
      var expandRows = states.expandRows;
      if (VueUtil.isDef(expanded)) {
        var index = expandRows.indexOf(row);
        if (expanded) {
          if (index === -1)
            expandRows.push(row);
        } else {
          if (index !== -1)
            expandRows.splice(index, 1);
        }
      } else {
        var index = expandRows.indexOf(row);
        if (index === -1) {
          expandRows.push(row);
        } else {
          expandRows.splice(index, 1);
        }
      }
      var table = this.table;
      Vue.nextTick(function(){
        table.$emit('expand', row, expandRows.indexOf(row) !== -1);
      });
    },
    toggleAllSelection: function(states) {
      var data = states.data || [];
      var value = !states.isAllSelected;
      var selection = this.states.selection;
      var selectionChanged = false;
      var self = this;
      VueUtil.loop(data, function(item, index) {
        if (states.selectable) {
          if (states.selectable.call(null, item, index) && self.toggleRowSelection(item, value)) {
            selectionChanged = true;
          }
        } else {
          if (self.toggleRowSelection(item, value)) {
            selectionChanged = true;
          }
        }
      });
      var table = this.table;
      if (selectionChanged) {
        table.$emit('selection-change', selection);
      }
      table.$emit('select-all', selection);
      states.isAllSelected = value;
    }
  };
  TableStore.prototype.getAggregate = function(columns, data) {
    var labelMap = {
      'sum': Vue.t('vue.table.sumText'),
      'count': Vue.t('vue.table.countText'),
      'average': Vue.t('vue.table.averageText'),
      'min': Vue.t('vue.table.minText'),
      'max': Vue.t('vue.table.maxText'),
    };
    var aggregates = this.states.aggregates = [];
    if (data.length === 0) return;
    VueUtil.loop(columns, function(column) {
      var aggregate = '';
      var resultMap = {};
      resultMap.max = '';
      resultMap.min = '';
      resultMap.sum = '';
      resultMap.average = '';
      resultMap.label = '';
      resultMap.property = column.property;
      var aggregateType = column.aggregate.toLowerCase();
      var aggregateLabel = labelMap[aggregateType];
      if (VueUtil.isDef(column.aggregateLabel)) aggregateLabel = column.aggregateLabel;
      if (VueUtil.isDef(aggregateLabel)) {
        var max = null;
        var min = null;
        var sum = null;
        var precision = 0;
        var valueCount = 0;
        resultMap.count = data.length;
        VueUtil.loop(data, function(row) {
          var value = Number(row[column.property]);
          if (VueUtil.isNumber(value)) {
            var decimal = ('' + value).split('.')[1];
            decimal && decimal.length > precision ? precision = decimal.length : null;
            VueUtil.isDef(max) ? value > max ? max = value : null : max = value;
            VueUtil.isDef(min) ? value < min ? min = value : null : min = value;
            VueUtil.isDef(sum) ? sum = sum + value : sum = value;
            valueCount++;
          }
        });
        if (valueCount > 0) {
          resultMap.max = max;
          resultMap.min = min;
          resultMap.sum = sum;
          resultMap.average = (sum / valueCount);
        }
        var columnAggregate = resultMap[aggregateType];
        if (!VueUtil.isNumber(columnAggregate)) {
          aggregate = aggregateLabel;
        } else {
          if (aggregateType === 'count') precision = 0;
          columnAggregate = VueUtil.formatNumber(columnAggregate, precision); 
          aggregateLabel ? aggregate = aggregateLabel + ': ' + columnAggregate : aggregate = columnAggregate;
        }
        resultMap.label = aggregate;
      }
      aggregates.push(resultMap);
    });
  };
  TableStore.prototype.updateLabelColumns = function() {
    var states = this.states;
    var labelColumns = [];
    var colColumns = [];
    var tableColumns = states._columns;
    var i = tableColumns.length;
    while (i--) {
      var column = tableColumns[i];
      if (column.labelColspan) {
        colColumns.push(column);
      } else {
        if (colColumns.length > 0) {
          colColumns.reverse();
          column.colColumns = VueUtil.mergeArray([], colColumns);
          colColumns = [];
        }
        labelColumns.push(column);
      }
    }
    labelColumns.reverse();
    states.labelColumns = labelColumns;
  };
  TableStore.prototype.updateColumns = function() {
    var states = this.states;
    var columns = [];
    states.fixedColumns = [];
    states.rightFixedColumns = [];
    VueUtil.loop(VueUtil.mergeArray([], states._columns), function(column) {
      if (column.visible) {
        columns.push(column);
        if (column.fixed === true || column.fixed === 'left') {
          if (column.type === 'selection') {
            column.fixed = false;
          } else {
            states.fixedColumns.push(column);
          }
        }
        if (column.fixed === 'right') {
          if (column.type === 'selection') {
            column.fixed = false;
          } else {
            states.rightFixedColumns.push(column);
          }
        }
      }
    });
    states.fixedColumns.sort(function(a, b) {
      return a.fixedIndex > b.fixedIndex;
    });
    states.rightFixedColumns.sort(function(a, b) {
      return a.fixedIndex < b.fixedIndex;
    });
    if (states.fixedColumns.length > 0 && columns[0] && columns[0].type === 'selection' && !columns[0].fixed) {
      columns[0].fixed = true;
      states.fixedColumns.unshift(columns[0]);
    }
    states.columns = VueUtil.mergeArray([], states.fixedColumns, VueUtil.filter(columns, function(column) {
      return !column.fixed;
    }), states.rightFixedColumns);
    this.updateLabelColumns();
  };
  TableStore.prototype.rowspanData = function(data) {
    var columns = this.states.columns;
    VueUtil.loop(columns, function(column) {
      if (column.rowspan) {
        var val1 = null;
        var val2 = null;
        var startIndex = null;
        column.rowspanAry = [];
        column.rowspanStartAry = [];
        VueUtil.loop(data, function(row, index) {
          val1 = row[column.property];
          if (val1 === val2) {
            column.rowspanAry.push(index);
          }
          val2 = val1;
        });
        var spanItem = null;
        VueUtil.loop(column.rowspanAry, function(rowspan, index) {
          var startSpan = rowspan - 1;
          if (column.rowspanAry.indexOf(startSpan) === -1) {
            spanItem = {};
            spanItem.start = startSpan;
            spanItem.spanNum = 2;
            column.rowspanStartAry.push(spanItem);
          } else {
            spanItem.spanNum++;
          }
        });
      }
    });
  };
  TableStore.prototype.sortData = function(data, states) {
    var sortingColumns = states.sortingColumns;
    if (sortingColumns.length !== 0) {
      var orderBy = function(data, sortList) {
        return VueUtil.mergeArray([], data).sort(function(data1, data2) {
          var index = 0;
          var column = sortList[index];
          index++;
          var sortBy = function() {
            var value1 = data1[column.property];
            var value2 = data2[column.property];
            var sortOrder = 1;
            if (column.order === 'descending') {
              sortOrder = -1;
            }
            if (value1 === value2) {
              if (index === sortList.length) return;
              column = sortList[index];
              index++;
              return sortBy();
            }
            if (VueUtil.isFunction(column.sortMethod)) {
              return column.sortMethod(value1, value2) ? sortOrder : -sortOrder;
            } else {
              return value1 > value2 ? sortOrder : -sortOrder;
            }
          };
          return sortBy();
        });
      };
      data = orderBy(data, sortingColumns);
    }
    return data;
  };
  TableStore.prototype.getColumnById = function(columnId) {
    var column = null;
    var columns = this.states._columns;
    var i = columns.length;
    while (i--) {
      var item = columns[i];
      if (item.id === columnId) {
        column = item;
        break;
      }
    }
    return column;
  };
  TableStore.prototype.isSelected = function(row) {
    return (this.states.selection || []).indexOf(row) !== -1;
  };
  TableStore.prototype.clearSelection = function() {
    var states = this.states;
    states.isAllSelected = false;
    var oldSelection = states.selection;
    states.selection = [];
    if (oldSelection.length > 0) {
      this.table.$emit('selection-change', states.selection);
    }
  };
  TableStore.prototype.toggleRowSelection = function(row, selected) {
    var changed = false;
    var selection = this.states.selection;
    var index = selection.indexOf(row);
    if (!VueUtil.isDef(selected)) {
      if (index === -1) {
        selection.push(row);
        changed = true;
      } else {
        selection.splice(index, 1);
        changed = true;
      }
    } else {
      if (selected && index === -1) {
        selection.push(row);
        changed = true;
      } else if (!selected && index !== -1) {
        selection.splice(index, 1);
        changed = true;
      }
    }
    return changed;
  };
  TableStore.prototype.updateAllSelected = function() {
    var states = this.states;
    var selection = states.selection;
    var selectable = states.selectable;
    var data = states.data;
    if (!data || data.length === 0) {
      states.isAllSelected = false;
      return;
    }
    var selectedMap;
    var isSelected = function(row) {
      return selection.indexOf(row) !== -1;
    };
    var isAllSelected = true;
    var selectedCount = 0;
    var i = data.length;
    while (i--) {
      var item = data[i];
      if (selectable) {
        var isRowSelectable = selectable.call(null, item, i);
        if (isRowSelectable) {
          if (!isSelected(item)) {
            isAllSelected = false;
            break;
          } else {
            selectedCount++;
          }
        }
      } else {
        if (!isSelected(item)) {
          isAllSelected = false;
          break;
        } else {
          selectedCount++;
        }
      }
    }
    if (selectedCount === 0) isAllSelected = false;
    states.isAllSelected = isAllSelected;
  };
  TableStore.prototype.commit = function(name) {
    var mutations = this.mutations;
    var args = [];
    VueUtil.loop(arguments, function(arg, index) {
      if (index === 0) return;
      args.push(arg);
    });
    if (mutations[name]) {
      mutations[name].apply(this, VueUtil.mergeArray([this.states], args));
    } else {
      throw 'Action not found: ' + name;
    }
  };
  var TableLayout = function(options) {
    this.table = null;
    this.store = null;
    this.fit = true;
    this.showHeader = true;
    this.height = null;
    this.scrollX = false;
    this.scrollY = false;
    this.bodyWidth = null;
    this.fixedWidth = null;
    this.rightFixedWidth = null;
    this.headerHeight = 44;
    this.viewportHeight = null;
    this.bodyHeight = null;
    this.fixedBodyHeight = null;
    this.gutterWidth = VueUtil.scrollBarWidth();
    VueUtil.merge(this, options);
  };
  TableLayout.prototype.updateScrollY = function() {
    var refs = this.table.$refs;
    if (!refs.tableBody || !refs.bodyWrapper) return;
    this.scrollY = false;
    var tbody = refs.tableBody.$refs.tbody;
    if (VueUtil.isNumber(this.height) && VueUtil.isElement(tbody)) {
      var bodyWrapper = refs.bodyWrapper;
      if (tbody.offsetHeight > bodyWrapper.offsetHeight) this.scrollY = true;
    }
  };
  TableLayout.prototype.setHeight = function(value) {
    var el = this.table.$el;
    if (!el) return;
    if (VueUtil.isString(value) && /^\d+$/.test(value)) {
      value = Number(value);
    }
    if (VueUtil.isNumber(value)) {
      this.height = value;
      el.style.height = value + 'px';
    } else if (VueUtil.isString(value)) {
      if (value === '') {
        el.style.height = '';
      }
    }
    this.updateHeight();
  };
  TableLayout.prototype.updateHeight = function() {
    var height = 0;
    var el = this.table.$el;
    if (VueUtil.isElement(el)) height = el.clientHeight;
    this.headerHeight = 0;
    if (!this.showHeader) {
      if (VueUtil.isNumber(this.height)) {
        this.bodyHeight = height;
      }
      this.fixedBodyHeight = this.scrollX ? height - this.gutterWidth : height;
    } else {
      var headerWrapper = this.table.$refs.headerWrapper;
      if (VueUtil.isDef(headerWrapper)) {
        this.headerHeight = headerWrapper.offsetHeight;
      }
      var headerHeight = this.headerHeight;
      var footerHeight = 0;
      var footerWrapper = this.table.$refs.footerWrapper;
      if (this.table.showFooter && footerWrapper) {
        footerHeight = footerWrapper.clientHeight;
      }
      var hfHeight = headerHeight + footerHeight;
      var bodyHeight = height - hfHeight;
      if (VueUtil.isNumber(this.height)) {
        this.bodyHeight = bodyHeight;
      }
      this.fixedBodyHeight = this.scrollX ? bodyHeight - this.gutterWidth : bodyHeight;
    }
    this.viewportHeight = this.scrollX ? height - this.gutterWidth : height;
    if (this.table.showFooter) this.viewportHeight = height;
  };
  TableLayout.prototype.update = function() {
    var fit = this.fit;
    var columns = this.store.states.columns;
    var bodyWidth = 0;
    var el = this.table.$el;
    if (VueUtil.isElement(el)) bodyWidth = el.clientWidth;
    var bodyMinWidth = 0;
    var flexColumns = [];
    var allColumnsWidth = 0;
    VueUtil.loop(columns, function(column) {
      if (!VueUtil.isNumber(column.width)) {
        flexColumns.push(column);
        allColumnsWidth = allColumnsWidth + (column.minWidth || 80);
      }
      bodyMinWidth += column.width || column.minWidth || 80;
    });
    this.scrollX = bodyMinWidth > bodyWidth;
    this.bodyWidth = bodyMinWidth;
    var flexColumnLen = flexColumns.length;
    if (flexColumnLen > 0 && fit) {
      if (bodyMinWidth <= bodyWidth - this.gutterWidth) {
        this.scrollX = false;
        var totalFlexWidth = bodyWidth - this.gutterWidth - bodyMinWidth;
        var noneFirstWidth = 0;
        var flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
        while (flexColumnLen--) {
          if (flexColumnLen === 0) break;
          var column = flexColumns[flexColumnLen];
          var flexWidth = Math.floor((column.minWidth || 80) * flexWidthPerPixel);
          noneFirstWidth += flexWidth;
          column.realWidth = (column.minWidth || 80) + flexWidth;
        }
        flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth;
      } else {
        this.scrollX = true;
        VueUtil.loop(flexColumns, function(column) {
          column.realWidth = column.minWidth || 80;
        });
      }
      this.bodyWidth = Math.max(bodyMinWidth, bodyWidth);
    }
    var fixedColumns = this.store.states.fixedColumns;
    var fixedWidth = 0;
    VueUtil.loop(fixedColumns, function(column) {
      fixedWidth += column.realWidth || 80;
    });
    this.fixedWidth = fixedWidth;
    var rightFixedColumns = this.store.states.rightFixedColumns;
    var rightFixedWidth = 0;
    VueUtil.loop(rightFixedColumns, function(column) {
      rightFixedWidth += column.realWidth || 80;
    });
    this.rightFixedWidth = rightFixedWidth;
  };
  var TableBody = {
    props: {
      fixed: String
    },
    render: function(createElement) {
      var self = this;
      if (!VueUtil.isDef(self.delta)) this.createDelta();
      var delta = self.delta;
      var columns = self.store.states.columns;
      var storeData = self.store.states.data;
      if (self.fixed) {
        if (((self.fixed === 'left') && self.store.states.fixedColumns.length > 0)
        || (self.fixed === 'right' && self.store.states.rightFixedColumns.length > 0)) {
          delta = self.tableBody.delta;
          self.$nextTick(self.doResetCurrentRow);
        } else {
          return null;
        }
      } else {
        self.scrollFilter(storeData, delta);
      }
      if (delta.data.length === 0) return null;
      self.store.rowspanData(delta.data);
      return createElement('table', {
        class: 'vue-table__body',
        attrs: {
          cellspacing: '0',
          cellpadding: '0',
          border: '0'
        },
        style: {
          'margin-top': delta.marginTop + 'px',
          'margin-bottom': delta.marginBottom + 'px'
        }
      }, [createElement('colgroup', null, [self._l(columns, function(column, columnIndex) {
        return createElement('col', {
          key: columnIndex,
          attrs: {
            name: column.id,
            width: column.realWidth || column.width || 80
          }
        }, []);
      }), !self.fixed && (self.layout.scrollX || self.layout.scrollY) && self.layout.gutterWidth ? createElement('col', {
        attrs: {
          name: 'gutter',
          width: 0
        }
      }, []) : '']), createElement('tbody', {ref: 'tbody'}, [VueUtil.mergeArray(self._l(delta.data, function(row, index) {
        var $index = row.$index;
        return [createElement('tr', {
          style: self.rowStyle ? self.getRowStyle(row, $index) : null,
          key: $index,
          ref: 'trow'+$index,
          on: {
            dblclick: function(e) {
              return self.handleDoubleClick(e, row);
            },
            contextmenu: function(e) {
              return self.handleContextMenu(e, row);
            },
            mouseenter: function(e) {
              return self.handleMouseEnter(row);
            },
            mouseleave: function(e) {
              return self.handleMouseLeave();
            }
          },
          class: ['vue-table__row', self.getRowClass(row, $index)]
        }, [self._l(columns, function(column, cellIndex) {
          if (column.rowspan && column.rowspanAry.indexOf(index) !== -1) {
            return null;
          } else {
            var rowspanNum = null;
            if (column.rowspan) {
              VueUtil.loop(column.rowspanStartAry, function(rowspan) {
                if (rowspan.start === index) {
                  rowspanNum = rowspan.spanNum;
                }
              });
            }
            return createElement('td', {
              key: cellIndex,
              attrs: {
                rowspan: rowspanNum
              },
              class: ['vue-table__cell', $index % 2 === 1 ? 'grey' : '', column.align, column.getCellClass($index, cellIndex, row) || '', self.$parent.isCellHidden(cellIndex, self.fixed) ? 'is-hidden' : ''],
              on: {
                click: function(e) {
                  return self.handleClick(e, row, column);
                },
                mouseenter: function(e) {
                  return self.handleCellMouseEnter(e, row, column);
                },
                mouseleave: function(e) {
                  return self.handleCellMouseLeave(e, row, column);
                }
              }
            }, [column.renderCell.call(self._renderProxy, createElement, {
              row: row,
              column: column,
              $index: $index,
              store: self.store,
              _self: self.$parent.$vnode.context
            }), column.showOverflowTooltip ? createElement('vue-tooltip', {
              attrs: {
                effect: self.$parent.tooltipEffect,
                placement: 'top',
                content: self.tooltipContent,
                append: self.$parent.$el
              },
              ref: 'tooltip'+column.property+$index
            }, []) : null]);
          }
        }), !self.fixed && (self.layout.scrollX || self.layout.scrollY) && self.layout.gutterWidth ? createElement('td', {
          class: 'vue-table__cell gutter'
        }, []) : '']), self.store.states.expandRows.indexOf(row) !== -1 ? createElement('tr', {class: ['vue-table__row', 'vue-table__expanded-row']}, [createElement('td', {
          attrs: {
            colspan: columns.length
          },
          class: ['vue-table__cell', 'vue-table__expanded-cell', self.getExpandClass(row, $index)]
        }, [self.$parent.renderExpanded ? self.$parent.renderExpanded(createElement, {
          row: row,
          $index: $index,
          store: self.store
        }) : ''])]) : null];
      }), self._self.$parent.$slots.append)])]);
    },
    watch: {
      'store.states.hoverRow': function(newVal) {
        this.doResetHoverRow(newVal);
      },
      'store.states.currentRow': function(newVal) {
        this.doResetCurrentRow(newVal);
      }
    },
    computed: {
      store: function() {
        return this.$parent.store;
      },
      layout: function() {
        return this.$parent.layout;
      },
      rowClassName: function() {
        return this.$parent.rowClassName;
      },
      rowStyle: function() {
        return this.$parent.rowStyle;
      },
      expandClassName: function() {
        return this.$parent.expandClassName;
      },
      highlightCurrent: function() {
        return this.$parent.highlightCurrentRow;
      },
      highlightHover: function() {
        return this.$parent.highlightHoverRow;
      },
      tableBody: function() {
        return this.$parent.$refs.tableBody;
      },
      fixedTableBody: function() {
        return this.$parent.$refs.fixedTableBody;
      },
      rightFixedTableBody: function() {
        return this.$parent.$refs.rightFixedTableBody;
      }
    },
    data: function() {
      return {
        tooltipContent: ''
      };
    },
    methods: {
      createDelta: function() {
        if (this.fixed) return;
        var delta = this.delta = Object.create(null);
        delta.start = 0;
        delta.end = 0;
        delta.total = 0;
        delta.keeps = 0;
        delta.marginTop = 0;
        delta.marginBottom = 0;
        delta.size = 0;
        delta.remain = 0;
        delta.data = [];
        var table = this.$parent;
        if (table.height && table.lazyload) {
          delta.remain = Math.floor(table.height * 1 / delta.size) + 10;
          delta.end = delta.remain;
          delta.keeps = delta.remain;
        }
      },
      resetDelta: function(dataLen) {
        if (this.fixed) return;
        var delta = this.delta;
        if (delta.keeps === 0) return;
        delta.start = 0;
        if (dataLen <= delta.remain) {
          delta.end = dataLen;
          //delta.keeps = dataLen;
        } else {
          delta.end = delta.remain;
          delta.keeps = delta.remain;
        }
      },
      scrollFilter: function(storeData, delta) {
        delta.data = [];
        if (delta.keeps === 0 || storeData.length <= delta.keeps) {
          delta.marginTop = 0;
          delta.marginBottom = 0;
          delta.data = storeData;
        } else {
          delta.total = storeData.length;
          delta.marginTop = delta.size * delta.start;
          delta.marginBottom = delta.size * (delta.total - delta.keeps - delta.start);
          for (var i = delta.start, j = delta.end; i < j; i++) {
            delta.data.push(storeData[i]);
          }
        }
      },
      updateZone: function(offset) {
        if (this.fixed) return;
        var delta = this.delta;
        if (delta.keeps === 0) return;
        delta.size = 40;
        if (VueUtil.isElement(this.$refs.tbody)) delta.size = this.$refs.tbody.firstElementChild.offsetHeight;
        delta.remain = Math.floor(this.$parent.height * 1 / delta.size) + 11;
        delta.keeps = delta.remain;
        if (delta.total <= delta.keeps) return;
        var overs = Math.floor(offset / delta.size) - 6;
        overs < 0 && (overs = 0);
        var start = overs;
        var end = overs + delta.keeps;
        if (overs + delta.keeps >= delta.total) {
          end = delta.total;
          start = delta.total - delta.keeps;
        }
        delta.end = end;
        delta.start = start;
        this.forceUpdate();
        this.$nextTick(this.doResetCurrentRow);
      },
      forceUpdate: VueUtil.throttle(function() {
        this.tableBody.$forceUpdate();
        this.fixedTableBody.$forceUpdate();
        this.rightFixedTableBody.$forceUpdate();
      }),
      doResetCurrentRow: VueUtil.throttle(function(currentRow) {
        this.tableBody.resetCurrentRow(currentRow);
        this.fixedTableBody.resetCurrentRow(currentRow);
        this.rightFixedTableBody.resetCurrentRow(currentRow);
      }),
      doResetHoverRow: VueUtil.throttle(function(hoverRow) {
        this.tableBody.resetHoverRow(hoverRow);
        this.fixedTableBody.resetHoverRow(hoverRow);
        this.rightFixedTableBody.resetHoverRow(hoverRow);
      }),
      resetCurrentRow: function(currentRowObj) {
        if (!this.highlightCurrent) return;
        var oldCurrentRow = this.currentRow;
        oldCurrentRow && oldCurrentRow.classList.remove('current-row');
        if (!VueUtil.isDef(currentRowObj)) currentRowObj = this.store.states.currentRow;
        if (!VueUtil.isDef(currentRowObj)) return;
        var currentRow = this.$refs['trow'+currentRowObj.$index];
        currentRow && currentRow.classList.add('current-row');
        this.currentRow = currentRow;
      },
      resetHoverRow: function(hoverRowObj) {
        if (!this.highlightHover) return;
        var oldHoverRow = this.hoverRow;
        oldHoverRow && oldHoverRow.classList.remove('hover-row');
        if (!VueUtil.isDef(hoverRowObj)) return;
        var hoverRow = this.$refs['trow'+hoverRowObj.$index];
        hoverRow && hoverRow.classList.add('hover-row');
        this.hoverRow = hoverRow;
      },
      getCell: function(event) {
        var cell = event.target;
        while (cell && cell.tagName.toUpperCase() !== 'HTML') {
          if (cell.tagName.toUpperCase() === 'TD') {
            return cell;
          }
          cell = cell.parentNode;
        }
        return null;
      },
      getRowStyle: function(row, index) {
        var rowStyle = this.rowStyle;
        if (VueUtil.isFunction(rowStyle)) {
          return rowStyle.call(null, row, index);
        }
        return rowStyle;
      },
      getRowClass: function(row, index) {
        var classes = [];
        var rowClassName = this.rowClassName;
        if (VueUtil.isString(rowClassName)) {
          classes.push(rowClassName);
        } else if (VueUtil.isFunction(rowClassName)) {
          classes.push(rowClassName.call(null, row, index) || '');
        }
        return classes.join(' ');
      },
      getExpandClass: function(row, index) {
        var classes = [];
        var expandClassName = this.expandClassName;
        if (VueUtil.isString(expandClassName)) {
          classes.push(expandClassName);
        } else if (VueUtil.isFunction(expandClassName)) {
          classes.push(expandClassName.call(null, row, index) || '');
        }
        return classes.join(' ');
      },
      handleCellMouseEnter: function(event, row, column) {
        var cell = this.getCell(event);
        if (!cell) return;
        var table = this.$parent;
        var hoverState = table.hoverState = {cell: cell, column: column, row: row};
        table.$emit('cell-mouse-enter', hoverState.row, hoverState.column, hoverState.cell, event);
        var cellChild = event.target.querySelector('.cell');
        if (column.showOverflowTooltip && cellChild.scrollWidth > cellChild.offsetWidth) {
          var tooltip = this.$refs['tooltip'+column.property+this.store.states.data.indexOf(row)];
          this.tooltipContent = cell.innerText;
          tooltip.referenceElm = cell;
          tooltip.setExpectedState(true);
          tooltip.handleShowPopper();
        }
      },
      handleCellMouseLeave: function(event, row, column) {
        var cell = this.getCell(event);
        if (!cell) return;
        var table = this.$parent;
        var oldHoverState = table.hoverState;
        table.$emit('cell-mouse-leave', oldHoverState.row, oldHoverState.column, oldHoverState.cell, event);
        var cellChild = event.target.querySelector('.cell');
        if (column.showOverflowTooltip && cellChild.scrollWidth > cellChild.offsetWidth) {
          var tooltip = this.$refs['tooltip'+column.property+this.store.states.data.indexOf(row)];
          tooltip.setExpectedState(false);
          tooltip.handleClosePopper();
        }
      },
      handleMouseEnter: function(row) {
        this.store.commit('setHoverRow', row);
      },
      handleMouseLeave: function() {
        this.store.commit('setHoverRow', null);
      },
      handleContextMenu: function(event, row) {
        this.$parent.$emit('row-contextmenu', row, event);
      },
      handleDoubleClick: function(event, row) {
        this.$parent.$emit('row-dblclick', row, event);
      },
      handleClick: function(event, row, column) {
        var table = this.$parent;
        var cell = this.getCell(event);
        if (cell) {
          table.$emit('cell-click', row, column, cell, event);
        }
        this.store.commit('setCurrentRow', row);
        table.$emit('row-click', row, event, column);
      },
      handleExpandClick: function(row) {
        this.store.commit('toggleRowExpanded', row);
      }
    }
  };
  var VueTableFilterPanel = {
    template: '<transition @after-leave="destroyPopper"> \
    <div class="vue-table-filter" v-show="showPopper" v-clickoutside="handleOutsideClick"> \
      <div class="vue-table-filter__content"> \
        <vue-checkbox-group v-model="filteredValue"> \
          <vue-list scrollbar :height="150" ref="list" class="vue-table-filter__list"> \
            <vue-list-item v-for="(filter, index) in filters" :key="index" class="vue-table-filter__list-item"> \
              <vue-checkbox :label="filter.value">{{filter.text}}</vue-checkbox> \
            </vue-list-item> \
          </vue-list> \
        </vue-checkbox-group> \
      </div> \
      <div class="vue-table-filter__bottom"> \
        <vue-button @click="handleConfirm" type="text" :disabled="filteredValue.length === 0">{{$t(\'vue.table.confirmFilter\')}}</vue-button> \
        <vue-button type="text" @click="handleReset">{{$t(\'vue.table.resetFilter\')}}</vue-button> \
      </div> \
    </div> \
  </transition>',
    name: 'VueTableFilterPanel',
    mixins: [VuePopper],
    directives: {
      Clickoutside: VueUtil.component.clickoutside()
    },
    props: {
      placement: {
        type: String,
        default: 'bottom'
      }
    },
    methods: {
      handleOutsideClick: function() {
        this.showPopper = false;
      },
      handleConfirm: function() {
        this.confirmFilter(this.filteredValue);
        this.handleOutsideClick();
      },
      handleReset: function() {
        this.filteredValue = [];
        this.handleConfirm();
      },
      confirmFilter: function(filteredValue) {
        this.column.filtered = false;
        if (filteredValue.length > 0) {
          this.column.filtered = true;
        }
        this.table.store.commit('filterChange', {
          column: this.column,
          values: filteredValue
        });
      }
    },
    computed: {
      filters: function() {
        if (this.column && this.column.filters.length > 0) return this.column.filters;
        var filterList = [];
        var column = this.column;
        VueUtil.loop(this.table.store.states._data, function(row) {
          var columnData = {};
          columnData.value = row[column.property];
          columnData.text = row[column.property];
          if (filterList.indexOf(columnData) === -1) {
            filterList.push(columnData);
          }
        });
        return filterList;
      },
      filteredValue: {
        get: function() {
          if (this.column) {
            return this.column.filteredValue || [];
          }
          return [];
        },
        set: function(value) {
          if (this.column) {
            this.column.filteredValue = value;
          }
        }
      }
    },
    mounted: function() {
      var self = this;
      self.popperElm = self.$el;
      self.referenceElm = self.cell;
      self.dropdown = Object.create(null);
      self.dropdown.dropdowns = [];
      self.dropdown.open = function(instance) {
        if (instance) {
          this.dropdowns.push(instance);
        }
      };
      self.dropdown.close = function(instance) {
        var index = this.dropdowns.indexOf(instance);
        if (index !== -1) {
          this.dropdowns.splice(instance, 1);
        }
      };
      self.$watch('showPopper', function(value) {
        if (self.column)
          self.column.filterOpened = value;
        if (value) {
          self.dropdown.open(self);
          self.$nextTick(self.$refs.list.updateZone);
        } else {
          self.dropdown.close(self);
        }
      });
    }
  };
  var TableHeader = {
    render: function(createElement) {
      if (!this.$parent.showHeader
        || ((this.fixed === 'left') && this.store.states.fixedColumns.length === 0)
        || (this.fixed === 'right' && this.store.states.rightFixedColumns.length === 0)) return null;
      var self = this;
      var columns = self.store.states.columns;
      var columnRows = self.convertToRows(columns);
      return createElement('table', {
        class: 'vue-table__header',
        attrs: {
          cellspacing: '0',
          cellpadding: '0',
          border: '0'
        }
      }, [createElement('colgroup', null, [self._l(columns, function(column, columnIndex) {
        return createElement('col', {
          key: columnIndex,
          attrs: {
            name: column.id,
            width: column.realWidth || column.width || 80
          }
        }, []);
      }), !self.fixed && (self.layout.scrollX || self.layout.scrollY) && self.layout.gutterWidth ? createElement('col', {
        attrs: {
          name: 'gutter',
          width: self.layout.gutterWidth
        }
      }, []) : '']), createElement('thead', null, [self._l(columnRows, function(columns, rowIndex) {
        return createElement('tr', {class: ['vue-table__row'], key:rowIndex}, [self._l(columns, function(column, cellIndex) {
          return column.labelColspan ? null : createElement('th', {
            key: cellIndex,
            attrs: {
              colspan: column.labelColspanNum
            },
            on: {
              mousemove: function(e) {
                return self.handleMouseMove(e, column);
              },
              mouseout: self.handleMouseOut,
              mousedown: function(e) {
                return self.handleMouseDown(e, column);
              },
              touchstart: function(e) {
                return self.handleMouseDown(e, column);
              },
              click: function(e) {
                return self.handleHeaderClick(e, column);
              }
            },
            class: ['vue-table__column', column.order, column.headerAlign, rowIndex === 0 && self.$parent.isCellHidden(cellIndex, self.fixed) ? 'is-hidden' : '', 'is-leaf', column.labelClassName]
          }, [createElement('div', {
            class: ['cell', column.filtered || column.order ? 'highlight' : ''],
            style: {'width': column.renderHeader ? '100%' : '', 'padding': column.renderHeader ? 0 : ''},
          }, [column.renderHeader ? column.renderHeader.call(self._renderProxy, createElement) : column.label,
            column.sortable && !column.renderHeader ? createElement('span', {
            class: 'vue-table__sort-wrapper',
            on: {
              click: function(e) {
                return self.handleSortClick(e, column);
              }
            }
          }, [createElement('i', {
            class: ['is-sort', column.order === 'descending' ? 'vue-icon-sort-desc' : 'vue-icon-sort-asc'],
          }, [])]) : '', column.filterable && !column.renderHeader ? createElement('span', {
            class: 'vue-table__column-filter-trigger',
            on: {
              click: function(e) {
                return self.handleFilterClick(e, column);
              }
            }
          }, [createElement('i', {
            class: ['vue-icon-filter', column.filtered ? 'is-filtered' : '']
          }, [])]) : ''])]);
        }), !self.fixed && (self.layout.scrollX || self.layout.scrollY) && self.layout.gutterWidth ? createElement('th', {
          class: 'vue-table__column gutter'
        }, []) : '']);
      })])]);
    },
    props: {
      fixed: String
    },
    computed: {
      store: function() {
        return this.$parent.store;
      },
      layout: function() {
        return this.$parent.layout;
      },
      border: function() {
        return this.$parent.border;
      },
      defaultSort: function() {
        return this.$parent.defaultSort;
      }
    },
    created: function() {
      this.filterPanels = {};
    },
    mounted: function() {
      this.draggingColumn = null;
      this.dragging = false;
      this.dragState = {};
      this.setDefaultSortColumn();
    },
    beforeDestroy: function() {
      var panels = this.filterPanels;
      VueUtil.ownPropertyLoop(panels, function(prop) {
        if (VueUtil.isVueComponent(panels[prop])) {
          panels[prop].$destroy();
        }
      });
    },
    methods: {
      setDefaultSortColumn: function() {
        if (this.fixed) return;
        var self = this;
        var sortingColumns = self.store.states.sortingColumns;
        VueUtil.loop(self.defaultSort, function(sort) {
          VueUtil.loop(self.store.states.columns, function(column) {
            if (column.property === sort.prop) {
              column.order = sort.order;
              sortingColumns.push(column);
            }
          });
        });
      },
      convertToRows: function(columns) {
        var rows = [[]];
        var colspan = 1;
        var i = columns.length;
        while (i--) {
          var column = columns[i];
          column.labelColspanNum = 1;
          if (!column.labelColspan) {
            column.labelColspanNum = colspan;
            colspan = 1;
          } else {
            colspan++;
          }
          rows[0].push(column);
        }
        rows[0].reverse();
        return rows;
      },
      toggleAllSelection: function() {
        this.store.commit('toggleAllSelection');
      },
      handleFilterClick: function(event, column) {
        event.stopPropagation();
        var target = event.target;
        var cell = target.parentNode;
        var filterPanel = this.filterPanels[column.id];
        if (filterPanel && column.filterOpened) {
          filterPanel.showPopper = false;
          return;
        }
        if (!filterPanel) {
          filterPanel = new Vue(VueTableFilterPanel);
          this.filterPanels[column.id] = filterPanel;
          filterPanel.table = this.$parent;
          filterPanel.cell = cell;
          filterPanel.column = column;
          filterPanel.$mount(document.createElement('div'));
        }
        this.$nextTick(function() {
          filterPanel.showPopper = true;
        });
      },
      handleHeaderClick: function(event, column) {
        this.$parent.$emit('header-click', column, event);
      },
      handleMouseDown: function(event, column) {
        var self = this;
        if (event.touches) {
          self.handleMouseMove(event, column);
        }
        if (self.draggingColumn && self.border) {
          self.dragging = true;
          self.$parent.resizeProxyVisible = true;
          var tableEl = self.$parent.$el;
          var tableLeft = tableEl.getBoundingClientRect().left;
          var columnEl = event.currentTarget;
          var columnRect = columnEl.getBoundingClientRect();
          var minLeft = columnRect.left - tableLeft + 30;
          columnEl.classList.add('noclick');
          self.dragState = {
            startMouseLeft: event.clientX || event.touches[0].clientX,
            startLeft: columnRect.right - tableLeft,
            startColumnLeft: columnRect.left - tableLeft,
            tableLeft: tableLeft
          };
          var resizeProxy = self.$parent.$refs.resizeProxy;
          resizeProxy.style.left = self.dragState.startLeft + 'px';
          document.onselectstart = function() {
            return false;
          };
          document.ondragstart = function() {
            return false;
          };
          var handleMouseMove = function(event) {
            var deltaLeft = (event.clientX || event.touches[0].clientX) - self.dragState.startMouseLeft;
            var proxyLeft = self.dragState.startLeft + deltaLeft;
            resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px';
          };
          var handleMouseUp = function() {
            if (self.dragging) {
              var finalLeft = parseInt(resizeProxy.style.left, 10);
              var startLeft = self.dragState.startLeft;
              var startColumnLeft = self.dragState.startColumnLeft;
              var draggingColumnNum = 1;
              if (VueUtil.isArray(column.colColumns)) {
                draggingColumnNum = draggingColumnNum + column.colColumns.length;
              }
              var columnWidth = parseInt((finalLeft - startColumnLeft) / draggingColumnNum);
              column.width = column.realWidth = columnWidth;
              VueUtil.loop(column.colColumns, function(colColumn){
                colColumn.width = colColumn.realWidth = columnWidth;
              });
              self.$parent.$emit('header-dragend', finalLeft - startColumnLeft, startLeft - startColumnLeft, column, event);
              document.body.style.cursor = '';
              self.dragging = false;
              self.draggingColumn = null;
              self.dragState = {};
              self.$parent.resizeProxyVisible = false;
              self.$parent.doLayout();
            }
            VueUtil.removeTouchMove(document, handleMouseMove);
            VueUtil.removeTouchEnd(document, handleMouseUp);
            document.onselectstart = null;
            document.ondragstart = null;
            self.$nextTick(function() {
              columnEl.classList.remove('noclick');
            });
          };
          VueUtil.addTouchMove(document, handleMouseMove);
          VueUtil.addTouchEnd(document, handleMouseUp);
        }
      },
      handleMouseMove: function(event, column) {
        var target = event.target;
        while (target && !VueUtil.hasClass(target, 'vue-table__column')) {
          target = target.parentNode;
        }
        if (!column || !column.resizable) return;
        if (!this.dragging && this.border) {
          var rect = target.getBoundingClientRect();
          var bodyStyle = document.body.style;
          if (rect.width > 12 && rect.right - (event.pageX || event.touches[0].pageX) < 8) {
            bodyStyle.cursor = 'col-resize';
            this.draggingColumn = column;
          } else if (!this.dragging) {
            bodyStyle.cursor = '';
            this.draggingColumn = null;
          }
        }
      },
      handleMouseOut: function() {
        document.body.style.cursor = '';
      },
      toggleOrder: function(order) {
        return !order ? 'ascending' : order === 'ascending' ? 'descending' : null;
      },
      handleSortClick: function(event, column) {
        event.stopPropagation();
        var target = event.target;
        while (target && !VueUtil.hasClass(target, 'vue-table__column')) {
          target = target.parentNode;
        }
        if (target && VueUtil.hasClass(target, 'vue-table__column')) {
          if (target.classList.contains('noclick')) {
            target.classList.remove('noclick');
            return;
          }
        }
        var states = this.store.states;
        var sortingColumns = states.sortingColumns;
        column.order = this.toggleOrder(column.order);
        var sortIndex = sortingColumns.indexOf(column);
        if (sortIndex === -1) {
          sortingColumns.push(column);
        } else if (column.order === null) {
          sortingColumns.splice(sortIndex, 1);
        }
        this.store.commit('changeSortCondition');
      }
    }
  };
  var TableFooter = {
    render: function(createElement) {
      if (!this.$parent.showFooter
        || ((this.fixed === 'left') && this.store.states.fixedColumns.length === 0)
        || (this.fixed === 'right' && this.store.states.rightFixedColumns.length === 0)) return null;
      var self = this;
      var aggregates = self.fixed ? self.$parent.$refs.tableFooter.aggregates : self.aggregates;
      var columns = self.store.states.columns;
      return createElement('table', {
        class: 'vue-table__footer',
        attrs: {
          cellspacing: '0',
          cellpadding: '0',
          border: '0'
        }
      }, [createElement('colgroup', null, [self._l(columns, function(column, columnIndex) {
        return createElement('col', {
          key: columnIndex,
          attrs: {
            name: column.id,
            width: column.realWidth || column.width || 80
          }
        }, []);
      }), !self.fixed && (self.layout.scrollX || self.layout.scrollY) && self.layout.gutterWidth ? createElement('col', {
        attrs: {
          name: 'gutter',
          width: self.layout.gutterWidth
        }
      }, []) : '']), createElement('tfoot', null, [createElement('tr', {class: ['vue-table__row']}, [self._l(columns, function(column, cellIndex) {
        return createElement('th', {
          key: cellIndex,
          attrs: {
            colspan: column.colSpan,
            rowspan: column.rowSpan
          },
          class: ['vue-table__column', column.align, column.className || '', self.$parent.isCellHidden(cellIndex, self.fixed) ? 'is-hidden' : '', 'is-leaf', column.labelClassName]
        }, [createElement('div', {
          class: ['cell', column.labelClassName]
        }, [aggregates[cellIndex] ? aggregates[cellIndex].label : ''])]);
      }), !self.fixed && (self.layout.scrollX || self.layout.scrollY) && self.layout.gutterWidth ? createElement('th', {
        class: 'vue-table__column gutter'
      }, []) : ''])])]);
    },
    props: {
      fixed: String,
    },
    data: function() {
      return {
        aggregates: []
      };
    },
    computed: {
      store: function() {
        return this.$parent.store;
      },
      layout: function() {
        return this.$parent.layout;
      }
    },
    watch: {
      '$parent.emptyLabel': function() {
        if (this.$parent.showFooter && !this.fixed) {
          this.store.getAggregate(this.store.states.columns, this.store.states.data);
          this.aggregates = this.store.states.aggregates;
        }
      }
    }
  };
  var TableContextMenu = {
    template: '<vue-dialog v-model="dialogVisible" custom-class="vue-table-context-menu" :title="$t(\'vue.table.contextMenu\')" show-close @close="closeHandle"><vue-tabs><vue-tab-pane :label="$t(\'vue.table.pin\')"><vue-form label-width="100px"><vue-form-item :label="$t(\'vue.table.leftPin\')"><vue-select clearable v-model="pinForm.leftPin" multiple @change="leftPin" @remove-tag="noPin"><vue-option v-for="(column, index) in labelColumns" :key="index" :label="column.label" :value="column"></vue-option></vue-select></vue-form-item><vue-form-item :label="$t(\'vue.table.rightPin\')"><vue-select clearable v-model="pinForm.rightPin" multiple @change="rightPin" @remove-tag="noPin"><vue-option v-for="(column, index) in labelColumns" :key="index" :label="column.label" :value="column"></vue-option></vue-select></vue-form-item></vue-form></vue-tab-pane><vue-tab-pane :label="$t(\'vue.table.sort\')"><vue-list scrollbar :height="150" :default-selected="false"><vue-list-item v-for="(column, index) in labelColumns" :key="index"><vue-button type="text" style="padding-left:15px" @click="removeSortColumn(column, true)">{{column.label}}</vue-button><div style="float:right;"><vue-button style="padding:10px 0 0 0;" :style="{color: column.order === \'ascending\' ? \'#eb9e05\' : \'rgb(151, 168, 190)\'}" icon="vue-icon-caret-top" type="text" @click="sortColumn(column)"></vue-button><vue-button style="padding:10px 15px 0 0;" :style="{color: column.order === \'descending\' ? \'#eb9e05\' : \'rgb(151, 168, 190)\'}" icon="vue-icon-caret-bottom" type="text" @click="sortColumn(column, true)"></vue-button></div><vue-divider v-if="index!==labelColumns.length-1"></vue-divider></vue-list-item></vue-list><vue-form label-width="70px"><vue-form-item :label="$t(\'vue.table.sortBy\')"><vue-tag hit style="margin:5px 5px 0 0;" v-for="(column, index) in sortList" :key="index" closable type="info" @close="removeSortColumn(column)">{{column.label}}<i style="padding:5px 0 0 5px;" :class="[{\'vue-icon-caret-top\': column.order === \'ascending\'}, {\'vue-icon-caret-bottom\': column.order === \'descending\'}]"></i></vue-tag></vue-form-item></vue-form></vue-tab-pane><vue-tab-pane :label="$t(\'vue.table.filter\')"><vue-form label-width="100px" :model="filterForm"><vue-form-item :label="$t(\'vue.table.column\')"><vue-select v-model="filterForm.filterColumn"><vue-option v-for="(column, index) in labelColumns" :key="index" :label="column.label" :value="column"></vue-option></vue-select></vue-form-item><vue-form-item :label="$t(\'vue.table.conditions\')"><vue-input icon="vue-icon-search" v-model="filterForm.conditions" :on-icon-click="filterColumn" @keydown.enter.native="filterColumn" ref="filterInput"><vue-select slot="prepend" v-model="filterForm.operations" style="width:80px;font-size:21px;" @change="operationsChange"><vue-option v-for="(item, index) in operations" :key="index" :label="item" :value="item"></vue-option></vue-select></vue-input></vue-form-item></vue-form><vue-divider></vue-divider><vue-form label-width="100px"><vue-form-item :label="$t(\'vue.table.filterBy\')"><vue-tag hit style="margin:5px 5px 0 0;" v-for="(column, index) in filterList" :key="index" closable type="info" @close="removeFilterColumn(column)">{{column.label}} {{column.operations}} {{column.conditions}}</vue-tag></vue-form-item></vue-form></vue-tab-pane><vue-tab-pane :label="$t(\'vue.table.display\')"><vue-list scrollbar :height="150" :default-selected="false"><vue-list-item v-for="(column, index) in labelColumns" :key="index" @select="displayColumn(column)" style="cursor:pointer;"><vue-button type="text" style="padding-left:15px">{{column.label}}</vue-button><div style="float:right;"><vue-button style="padding:10px 15px 0 0;" :style="{color: column.visible ? \'#13ce66\' : \'#a94442\'}" :icon="column.visible ? \'vue-icon-success\' : \'vue-icon-error\'" type="text"></vue-button></div><vue-divider v-if="index!==labelColumns.length-1"></vue-divider></vue-list-item></vue-list></vue-tab-pane><vue-tab-pane :label="$t(\'vue.table.exportData\')"><vue-form label-width="100px"><vue-form-item :label="$t(\'vue.table.fileName\')"><vue-input v-model="fileName"></vue-input></vue-form-item></vue-form><div style="text-align:right"><vue-button @click="exportData(true)" plain type="info" icon="vue-icon-download2">{{$t(\'vue.table.exportOrgData\')}}</vue-button><vue-button @click="exportData(false)" type="primary" icon="vue-icon-download2">{{$t(\'vue.table.exportHandleData\')}}</vue-button></div></vue-tab-pane></vue-tabs></vue-dialog>',
    data: function() {
      return {
        tableColumns: [],
        pinForm: {
          leftPin: [],
          rightPin: []
        },
        filterForm: {
          filterColumn: null,
          conditions: null,
          operations: '='
        },
        operations: ['=', '<', '>', '<=', '>=', '<>', '%'],
        sortList: [],
        filterList: [],
        dialogVisible: false,
        fileName: ''
      };
    },
    props: {
      visible: Boolean,
    },
    model: {
      prop: 'visible'
    },
    watch: {
      visible: function(val) {
        this.dialogVisible = val;
      }
    },
    computed: {
      store: function() {
        return this.$parent.store;
      },
      labelColumns: function() {
        return this.$parent.store.states.labelColumns;
      }
    },
    methods: {
      closeHandle: function() {
        this.$parent.showContextMenu = false;
      },
      operationsChange: function() {
        this.$nextTick(this.$refs.filterInput.focus);
      },
      exportData: function(flg) {
        var params = {};
        params.fileName = this.fileName;
        params.original = flg;
        this.$parent.exportCsv(params);
      },
      noPin: function(tag) {
        this.removePin(tag.value);
      },
      removePin: function(column) {
        column.fixed = false;
        this.$parent.doLayout();
      },
      leftPin: function(columns) {
        if (columns.length <= 0) {
          var layoutFLg = false;
          VueUtil.loop(this.tableColumns, function(column) {
            if (column.fixed === true || column.fixed === 'left') {
              column.fixed = false;
              layoutFLg = true;
            }
          });
          if (layoutFLg) this.$parent.doLayout();
          return;
        }
        var self = this;
        VueUtil.loop(columns, function(column, index) {
          var rightIndex = self.pinForm.rightPin.indexOf(column);
          if (rightIndex !== -1) self.pinForm.rightPin.splice(rightIndex, 1);
          column.fixed = 'left';
          column.fixedIndex = index;
          VueUtil.loop(column.colColumns, function(colColumn) {
            colColumn.fixed = 'left';
            colColumn.fixedIndex = index;
          });
        });
        this.$parent.doLayout();
      },
      rightPin: function(columns) {
        if (columns.length <= 0) {
          var layoutFLg = false;
          VueUtil.loop(this.tableColumns, function(column) {
            if (column.fixed === 'right') {
              column.fixed = false;
              layoutFLg = true;
            }
          });
          if (layoutFLg) this.$parent.doLayout();
          return;
        }
        var self = this;
        VueUtil.loop(columns, function(column, index) {
          var leftIndex = self.pinForm.leftPin.indexOf(column);
          if (leftIndex !== -1) self.pinForm.leftPin.splice(leftIndex, 1);
          column.fixed = 'right';
          column.fixedIndex = index;
          VueUtil.loop(column.colColumns, function(colColumn) {
            colColumn.fixed = 'right';
            colColumn.fixedIndex = index;
          });
        });
        this.$parent.doLayout();
      },
      sortColumn: function(column, descFlg) {
        column.sortable = true;
        if (descFlg) {
          column.order = 'descending';
        } else {
          column.order = 'ascending';
        }
        var sortIndex = this.sortList.indexOf(column);
        if (sortIndex === -1) {
          this.sortList.push(column);
        }
        this.doSort();
      },
      removeSortColumn: function(column, flg) {
        if (flg) column.sortable = false;
        var sortIndex = this.sortList.indexOf(column);
        if (sortIndex === -1) return;
        column.order = '';
        this.sortList.splice(sortIndex, 1);
        this.doSort();
      },
      doSort: function() {
        this.store.commit('changeSortCondition');
      },
      filterColumn: function() {
        var filterColumn = this.filterForm.filterColumn;
        if (!VueUtil.isDef(filterColumn)) return;
        filterColumn.conditions = this.filterForm.conditions;
        filterColumn.operations = this.filterForm.operations;
        if (VueUtil.isFunction(filterColumn.filterMethod) && !VueUtil.isDef(filterColumn.orgFilterMethod)) {
          filterColumn.orgFilterMethod = filterColumn.filterMethod;
        }
        filterColumn.filterMethod = function(value, row) {
          switch (filterColumn.operations) {
            case '=':
              return row[filterColumn.property] === filterColumn.conditions;
            case '>':
              return row[filterColumn.property] > filterColumn.conditions;
            case '<':
              return row[filterColumn.property] < filterColumn.conditions;
            case '<=':
              return row[filterColumn.property] <= filterColumn.conditions;
            case '>=':
              return row[filterColumn.property] >= filterColumn.conditions;
            case '<>':
              return row[filterColumn.property] !== filterColumn.conditions;
            case '%':
              return row[filterColumn.property].indexOf(filterColumn.conditions) !== -1;
          }
        };
        var existflg = false;
        VueUtil.loop(this.filterList, function(filterObj) {
          if (filterColumn.property === filterObj.property) {
            existflg = true;
          }
        });
        if (filterColumn && !existflg) {
          this.filterList.push(filterColumn);
        }
        this.doFilter();
      },
      removeFilterColumn: function(column) {
        var store = this.store;
        store.commit('filterChange', {
          column: column,
          values: []
        });
        if (column.orgFilterMethod) {
          column.filterMethod = column.orgFilterMethod;
          column.orgFilterMethod = null;
        }
        this.filterList.splice(this.filterList.indexOf(column), 1);
      },
      doFilter: function() {
        var store = this.store;
        var filterList = this.filterList;
        VueUtil.loop(filterList, function(filterColumn) {
          store.commit('filterChange', {
            column: filterColumn,
            values: 'filter'
          });
        });
        this.doSort();
        this.$forceUpdate();
      },
      displayColumn: function(column) {
        column.visible = !column.visible;
        VueUtil.loop(column.colColumns, function(colColumn) {
          colColumn.visible = !colColumn.visible;
        });
        this.$parent.doLayout();
      }
    },
    mounted: function() {
      if (this.store) {
        var tableColumns = this.tableColumns;
        VueUtil.loop(this.store.states._columns, function(column) {
          if (column.property !== 'selectionColumn'
            && column.property !== 'indexColumn'
            && column.property !== 'expandColumn') {
            tableColumns.push(column);
          }
        });
        this.pinForm.leftPin = this.store.states.fixedColumns;
        this.pinForm.rightPin = this.store.states.rightFixedColumns;
        this.sortList = this.store.states.sortingColumns;
      }
    }
  };
  var VueTable = {
    template: '<div :class="[\'vue-table\', {\'vue-table--fit\': fit, \'vue-table--striped\': stripe, \'vue-table--border\': border}]" @mouseleave="handleMouseLeave($event)" :style="{width: layout.bodyWidth <= 0 ? \'0px\' : \'\'}"><div class="hidden-columns" ref="hiddenColumns"><slot></slot></div><div class="vue-table__main"><div class="vue-table__header-wrapper" ref="headerWrapper" v-show="showHeader"><table-header ref="tableHeader" :style="{width: layout.bodyWidth ? layout.bodyWidth + \'px\' : \'\'}"></table-header></div><div class="vue-table__body-wrapper" ref="bodyWrapper" :style="[bodyHeight]"><table-body ref="tableBody" :style="{width: bodyWidth}"></table-body><div :style="{width: bodyWidth}" class="vue-table__empty-block" v-show="!data || data.length === 0"><span class="vue-table__empty-text"><slot name="empty">{{emptyText || emptyLabel}}</slot></span></div></div><div class="vue-table__footer-wrapper" ref="footerWrapper" v-show="showFooter"><table-footer ref="tableFooter" :style="{width: layout.bodyWidth ? layout.bodyWidth + \'px\' : \'\'}"></table-footer></div></div><div class="vue-table__fixed" v-show="leftFixedCount > 0" :style="[{width: layout.fixedWidth ? layout.fixedWidth + \'px\' : \'\'}, fixedHeight]"><div class="vue-table__fixed-header-wrapper" ref="fixedHeaderWrapper" v-show="showHeader"><table-header fixed="left" :style="{width: layout.fixedWidth ? layout.fixedWidth + \'px\' : \'\'}"></table-header></div><div class="vue-table__fixed-body-wrapper" ref="fixedBodyWrapper" :style="[{top: layout.headerHeight + \'px\'}, fixedBodyHeight]"><table-body ref="fixedTableBody" fixed="left" :style="{width: layout.fixedWidth ? layout.fixedWidth + \'px\' : \'\'}"></table-body></div><div class="vue-table__fixed-footer-wrapper" ref="fixedFooterWrapper" v-show="showFooter"><table-footer fixed="left" :style="{width: layout.fixedWidth ? layout.fixedWidth + \'px\' : \'\'}"></table-footer></div></div><div class="vue-table__fixed-right" v-show="rightFixedCount > 0" :style="[{width: layout.rightFixedWidth ? layout.rightFixedWidth + \'px\' : \'\'}, {right: layout.scrollY ? (border ? layout.gutterWidth : (layout.gutterWidth || 1)) + \'px\' : \'\'}, fixedHeight]"><div class="vue-table__fixed-header-wrapper" ref="rightFixedHeaderWrapper" v-show="showHeader"><table-header fixed="right" :style="{width: layout.rightFixedWidth ? layout.rightFixedWidth + \'px\' : \'\'}"></table-header></div><div class="vue-table__fixed-body-wrapper" ref="rightFixedBodyWrapper" :style="[{top: layout.headerHeight + \'px\'}, fixedBodyHeight]"><table-body ref="rightFixedTableBody" fixed="right" :style="{width: layout.rightFixedWidth ? layout.rightFixedWidth + \'px\' : \'\'}"></table-body></div><div class="vue-table__fixed-footer-wrapper" ref="rightFixedFooterWrapper" v-show="showFooter"><table-footer fixed="right" :style="{width: layout.rightFixedWidth ? layout.rightFixedWidth + \'px\' : \'\'}"></table-footer></div></div><div class="vue-table__fixed-right-patch" v-show="rightFixedCount > 0" :style="{width: layout.scrollY ? layout.gutterWidth + \'px\' : \'0\', height: layout.headerHeight + \'px\'}"></div><div class="vue-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div><table-context-menu v-if="contextMenu" v-model="showContextMenu""></table-context-menu></div>',
    name: 'VueTable',
    props: {
      data: {
        type: Array,
        default: function() {
          return [];
        }
      },
      lazyload: Boolean,
      height: [String, Number],
      fit: {
        type: Boolean,
        default: true
      },
      stripe: Boolean,
      border: Boolean,
      context: {},
      showHeader: {
        type: Boolean,
        default: true
      },
      showFooter: Boolean,
      contextMenu: Boolean,
      rowClassName: [String, Function],
      rowStyle: [Object, Function],
      highlightCurrentRow: Boolean,
      highlightHoverRow: {
        type: Boolean,
        default: true
      },
      emptyText: String,
      defaultExpandAll: Boolean,
      defaultSort: {
        type: Array,
        default: function() {
          return [];
        }
      },
      tooltipEffect: {
        type: String,
        default: 'light'
      },
      expandClassName: [String, Function]
    },
    components: {
      TableHeader: TableHeader,
      TableBody: TableBody,
      TableFooter: TableFooter,
      TableContextMenu: TableContextMenu
    },
    methods: {
      exportCsv: function(params) {
        if (!VueUtil.isObject(params)) params = {};
        if (params.fileName) {
          if (params.fileName.indexOf('.csv') === -1) {
            params.fileName += '.csv';
          }
        } else {
          params.fileName = 'table.csv';
        }
        if (!VueUtil.isDef(params.original)) params.original = true;
        var columns = params.original ? this.store.states._columns : this.store.states.columns;
        columns = VueUtil.filter(columns, function(column) {
          return (column.property !== 'selectionColumn'
            && column.property !== 'indexColumn'
            && column.property !== 'expandColumn');
        });
        var datas = params.original ? this.store.states._data : this.store.states.data;
        var footer = [];
        if (this.showFooter) {
          footer = VueUtil.map(VueUtil.filter(this.store.states.aggregates, function(aggregate) {
            return (aggregate.property !== 'selectionColumn'
              && aggregate.property !== 'indexColumn'
              && aggregate.property !== 'expandColumn');
          }), function(aggregate) {
            return aggregate.label;
          });
        }
        var appendLine = function(content, row, options) {
          var separator = options.separator;
          var line = VueUtil.map(row, function(data) {
            return '"' + VueUtil.toString(data).replace(/"/g, '""') + '"';
          });
          content.push(line.join(separator));
        };
        var tableDataToCsv = function(columns, datas, footer, options) {
          options = VueUtil.merge({}, {separator: ','}, options);
          var columnOrder;
          var content = [];
          var column = [];
          if (columns) {
            columnOrder = VueUtil.map(columns, function(v) {
              if (VueUtil.isString(v)) return v;
              column.push(VueUtil.isDef(v.printLabel) ? v.printLabel : VueUtil.isDef(v.label) ? v.label : v.property);
              return v.property;
            });
            if (column.length > 0) appendLine(content, column, options);
          } else {
            columnOrder = [];
            VueUtil.loop(datas, function(v) {
              if (!VueUtil.isArray(v)) {
                VueUtil.mergeArray(columnOrder, Object.keys(v));
              }
            });
            if (columnOrder.length > 0) {
              columnOrder = VueUtil.filter(columnOrder, function(value, index, self) {return self.indexOf(value) === index;});
              appendLine(content, columnOrder, options);
            }
          }
          VueUtil.loop(datas, function(row) {
            if (!VueUtil.isArray(row)) {
              row = VueUtil.map(columnOrder, function(k) {return VueUtil.isDef(row[k]) ? row[k] : '';});
            }
            appendLine(content, row, options);
          });
          if (VueUtil.isArray(footer)) {
            appendLine(content, footer, options);
          }
          return content.join('\r\n');
        };
        var data = tableDataToCsv(columns, datas, footer, params);
        var getDownloadUrl = function(text) {
          var BOM = '\uFEFF';
          if (Blob && URL && URL.createObjectURL) {
            var csvData = new Blob([BOM + text], {type: 'text/csv'});
            return URL.createObjectURL(csvData);
          } else {
            return 'data:attachment/csv;charset=utf-8,' + BOM + encodeURIComponent(text);
          }
        };
        var exportFile = function(fileName, text) {
          if (navigator.msSaveBlob) {
            var BOM = '\uFEFF';
            var csvData = new Blob([BOM + text], {type: 'text/csv'});
            navigator.msSaveBlob(csvData, fileName);
          } else {
            try {
              var link = document.createElement('a');
              link.download = fileName;
              link.href = getDownloadUrl(text);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } catch (e) {
              Vue.notify.warning({message: Vue.t('vue.screenfull.canot')});
              throw e;
            }
          }
        };
        exportFile(params.fileName, data);
      },
      columnFilter: function(columnProp, value) {
        var filterColumn = null;
        if (VueUtil.isString(columnProp)) {
          VueUtil.loop(this.store.states._columns, function(column){
            if (VueUtil.isDef(filterColumn)) return;
            if (column.property === columnProp) filterColumn = column;
          });
        } else {
          filterColumn = columnProp;
        }
        this.store.commit('filterChange', {
          column: filterColumn,
          values: value
        });
      },
      multipleColumnSort: function(sortList) {
        this.store.states.sortingColumns = sortList || [];
        this.store.commit('changeSortCondition');
      },
      toggleContextMenu: function() {
        if (this.contextMenu) this.showContextMenu = !this.showContextMenu;
      },
      setCurrentRow: function(row) {
        this.store.commit('setCurrentRow', row);
      },
      getCurrentRow: function() {
        return this.store.states.currentRow;
      },
      toggleRowSelection: function(row, selected) {
        if (this.store.toggleRowSelection(row, selected)) {
          this.$emit('selection-change', this.store.states.selection);
        }
        this.store.updateAllSelected();
      },
      clearSelection: function() {
        this.store.clearSelection();
      },
      handleMouseLeave: function() {
        this.store.commit('setHoverRow', null);
        if (this.hoverState) this.hoverState = null;
      },
      updateScrollY: function() {
        this.layout.updateScrollY();
        var refs = this.$refs;
        refs.fixedBodyWrapper && (refs.fixedBodyWrapper.scrollTop = this.bodyScroll.top);
        refs.rightFixedBodyWrapper && (refs.rightFixedBodyWrapper.scrollTop = this.bodyScroll.top);
      },
      isCellHidden: function(index, fixed) {
        if (fixed === 'left') {
          return index >= this.leftFixedCount;
        }
        if (fixed === 'right') {
          return index < this.store.states.columns.length - this.rightFixedCount;
        }
        return (index < this.leftFixedCount) || (index >= this.store.states.columns.length - this.rightFixedCount);
      },
      bodyScrollFn: function(event) {
        var refs = this.$refs;
        var scrollLeft = refs.bodyWrapper.scrollLeft;
        var scrollTop = refs.bodyWrapper.scrollTop;
        if (this.bodyScroll.left !== scrollLeft) {
          this.bodyScroll.left = scrollLeft;
          refs.headerWrapper.scrollLeft = scrollLeft;
          refs.footerWrapper.scrollLeft = scrollLeft;
          if (scrollLeft === 0) {
            this.$emit('scroll-left');
          }
          if (scrollLeft === refs.bodyWrapper.scrollWidth - refs.bodyWrapper.clientWidth) {
            this.$emit('scroll-right');
          }
        }
        if (this.bodyScroll.top !== scrollTop) {
          refs.tableBody.updateZone(scrollTop);
          this.bodyScroll.top = scrollTop;
          refs.fixedBodyWrapper.scrollTop = scrollTop;
          refs.rightFixedBodyWrapper.scrollTop = scrollTop;
          if (scrollTop === 0) {
            this.$emit('scroll-top');
          }
          if (scrollTop === refs.bodyWrapper.scrollHeight - refs.bodyWrapper.clientHeight) {
            this.$emit('scroll-bottom');
          }
        }
      },
      scrollYMouseWheel: function(event) {
        var refs = this.$refs;
        if (this.layout.scrollY) {
          event.preventDefault();
          var wheelDelta = event.wheelDelta || -event.detail;
          var scrollTop = this.bodyScroll.top;
          var wheel = 40;
          if (VueUtil.isElement(refs.tableBody.$refs.tbody)) wheel = refs.tableBody.$refs.tbody.firstElementChild.offsetHeight;
          wheel = wheel * 3;
          if (wheelDelta < 0) {
            scrollTop += wheel;
          } else {
            scrollTop -= wheel;
          }
          var scrollBottom = refs.bodyWrapper.scrollHeight - refs.bodyWrapper.clientHeight;
          scrollTop < 0 ? scrollTop = 0 : null;
          scrollTop > scrollBottom ? scrollTop = scrollBottom : null;
          refs.bodyWrapper.scrollTop = scrollTop;
          refs.fixedBodyWrapper.scrollTop = scrollTop;
          refs.rightFixedBodyWrapper.scrollTop = scrollTop;
        }
      },
      scrollXMouseWheel: function(event) {
        var refs = this.$refs;
        if (this.layout.scrollX) {
          event.preventDefault();
          var wheelDelta = event.wheelDelta || -event.detail;
          var scrollLeft = this.bodyScroll.left;
          if (wheelDelta < 0) {
            scrollLeft += 80;
          } else {
            scrollLeft -= 80;
          }
          var scrollRight = refs.bodyWrapper.scrollWidth - refs.bodyWrapper.clientWidth;
          scrollLeft < 0 ? scrollLeft = 0 : null;
          scrollLeft > scrollRight ? scrollLeft = scrollRight : null;
          refs.bodyWrapper.scrollLeft = scrollLeft;
          refs.headerWrapper.scrollLeft = scrollLeft;
          refs.footerWrapper.scrollLeft = scrollLeft;
        }
      },
      bindEvents: function() {
        var refs = this.$refs;
        var mouseWheel = VueUtil.isFirefox ? 'DOMMouseScroll' : 'mousewheel';
        VueUtil.on(refs.bodyWrapper, 'scroll', this.bodyScrollFn);
        VueUtil.on(refs.bodyWrapper, mouseWheel, this.scrollYMouseWheel);
        VueUtil.on(refs.fixedBodyWrapper, mouseWheel, this.scrollYMouseWheel);
        VueUtil.on(refs.rightFixedBodyWrapper, mouseWheel, this.scrollYMouseWheel);
        VueUtil.on(refs.headerWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.on(refs.fixedHeaderWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.on(refs.rightFixedHeaderWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.on(refs.footerWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.on(refs.fixedFooterWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.on(refs.rightFixedFooterWrapper, mouseWheel, this.scrollXMouseWheel);
        if (this.fit) {
          VueUtil.addResizeListener(this.$el, this.doLayout);
        }
      },
      unBindEvents: function() {
        var refs = this.$refs;
        var mouseWheel = VueUtil.isFirefox ? 'DOMMouseScroll' : 'mousewheel';
        VueUtil.off(refs.bodyWrapper, 'scroll', this.bodyScrollFn);
        VueUtil.off(refs.bodyWrapper, mouseWheel, this.scrollYMouseWheel);
        VueUtil.off(refs.fixedBodyWrapper, mouseWheel, this.scrollYMouseWheel);
        VueUtil.off(refs.rightFixedBodyWrapper, mouseWheel, this.scrollYMouseWheel);
        VueUtil.off(refs.headerWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.off(refs.fixedHeaderWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.off(refs.rightFixedHeaderWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.off(refs.footerWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.off(refs.fixedFooterWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.off(refs.rightFixedFooterWrapper, mouseWheel, this.scrollXMouseWheel);
        if (this.fit) {
          VueUtil.removeResizeListener(this.$el, this.doLayout);
        }
      },
      resizeZone: function() {
        var refs = this.$refs;
        refs.tableBody && refs.tableBody.updateZone(this.bodyScroll.top);
        if (this.showFooter) {
          this.store.getAggregate(this.store.states.columns, this.store.states.data);
          refs.tableFooter.aggregates = this.store.states.aggregates;
        }
      },
      doLayout: function() {
        var self = this;
        self.store.updateColumns();
        self.$nextTick(function() {
          self.layout.update();
          self.layout.updateHeight();
          self.updateScrollY();
          self.resizeZone();
        });
      }
    },
    created: function() {
      this.tableId = 'vue-table_';
    },
    computed: {
      emptyLabel: function() {
        return this.$t('vue.table.emptyText');
      },
      leftFixedCount: function() {
        return this.store.states.fixedColumns.length;
      },
      rightFixedCount: function() {
        return this.store.states.rightFixedColumns.length;
      },
      bodyHeight: function() {
        var style = {};
        style = {
          height: this.layout.bodyHeight ? this.layout.bodyHeight + 'px' : ''
        };
        return style;
      },
      bodyWidth: function() {
        var layout = this.layout;
        return layout.bodyWidth ? layout.bodyWidth - (layout.scrollY ? layout.gutterWidth : 0) + 'px' : '';
      },
      fixedBodyHeight: function() {
        var style = {};
        var layout = this.layout;
        if (this.height) {
          style = {
            height: layout.fixedBodyHeight ? layout.fixedBodyHeight + 'px' : ''
          };
        }
        return style;
      },
      fixedHeight: function() {
        var style = {};
        var layout = this.layout;
        style = {
          height: layout.viewportHeight ? layout.viewportHeight + 'px' : ''
        };
        return style;
      }
    },
    watch: {
      height: function(val) {
        this.layout.setHeight(val);
      },
      data: {
        immediate: true,
        handler: function(val) {
          var store = this.store;
          store.commit('setData', val);
          if (store.states.sortingColumns.length > 0) {
            this.$nextTick(function() {
              VueUtil.loop(store.states.columns, function(column) {
                if (column.filteredValue && column.filteredValue.length) {
                  store.commit('filterChange', {
                    column: cloumn,
                    values: column.filteredValue,
                    silent: true
                  });
                }
              });
              store.commit('changeSortCondition');
            });
          }
        }
      },
      showHeader: function() {
        this.doLayout();
      },
      showFooter: function() {
        this.doLayout();
      },
      lazyload: function(val) {
        if (this.height) {
          var delta = this.$refs.tableBody.delta;
          if (val) {
            delta.keeps = this.height * 1;
          } else {
            delta.keeps = 0;
          }
          this.doLayout();
        }
      }
    },
    beforeDestroy: function() {
      this.unBindEvents();
    },
    mounted: function() {
      this.layout.setHeight(this.height);
      this.bindEvents();
      this.doLayout();
    },
    data: function() {
      var store = new TableStore(this, {defaultExpandAll: self.defaultExpandAll});
      var layout = new TableLayout({
        store: store,
        table: this,
        fit: this.fit,
        showHeader: self.showHeader
      });
      return {
        store: store,
        layout: layout,
        renderExpanded: null,
        resizeProxyVisible: false,
        showContextMenu: false,
        bodyScroll: {left: 0, top: 0}
      };
    }
  };
  Vue.component(VueTable.name, VueTable);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueOption = definition(context.Vue, context.VueUtil);
    delete context.VueOption;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueOption = {
    template: '<li @mouseenter="hoverItem" @click.stop="selectOptionClick" v-show="visible" :class="[\'vue-select-dropdown__item\', {\'selected\': itemSelected, \'is-disabled\': disabled || groupDisabled || limitReached, \'hover\': itemHover}]"><slot><span>{{currentLabel}}</span></slot></li>',
    name: 'VueOption',
    mixins: [VueUtil.component.emitter],
    props: {
      value: {
        required: true
      },
      label: [String, Number],
      selected: Boolean,
      created: Boolean,
      disabled: Boolean
    },
    data: function() {
      return {
        index: -1,
        groupDisabled: false,
        visible: true,
        hitState: false
      };
    },
    computed: {
      currentLabel: function() {
        return this.label || ((VueUtil.isString(this.value) || VueUtil.isNumber(this.value)) ? this.value : '');
      },
      currentValue: function() {
        return this.value || this.label || '';
      },
      parent: function() {
        var result = this.$parent;
        while (!result.isSelect) {
          result = result.$parent;
        }
        return result;
      },
      itemSelected: function() {
        if (!this.parent.multiple) {
          return this.value === this.parent.value;
        } else {
          return this.parent.value.indexOf(this.value) !== -1;
        }
      },
      itemHover: function() {
        return this.parent.hoverIndex === this.parent.options.indexOf(this);
      },
      limitReached: function() {
        if (this.parent.multiple) {
          return !this.itemSelected && this.parent.value.length >= this.parent.multipleLimit && this.parent.multipleLimit > 0;
        } else {
          return false;
        }
      }
    },
    watch: {
      currentLabel: function() {
        if (!this.created && !this.parent.remote)
          this.dispatch('VueSelect', 'setSelected');
      },
      value: function() {
        if (!this.created && !this.parent.remote)
          this.dispatch('VueSelect', 'setSelected');
      }
    },
    methods: {
      handleGroupDisabled: function(val) {
        this.groupDisabled = val;
      },
      hoverItem: function() {
        if (!this.disabled && !this.groupDisabled) {
          this.parent.hoverIndex = this.parent.options.indexOf(this);
        }
      },
      selectOptionClick: function() {
        if (this.disabled !== true && this.groupDisabled !== true) {
          this.dispatch('VueSelect', 'handleOptionClick', this);
        }
      },
      queryChange: function(query) {
        var parsedQuery = String(query).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
        this.visible = new RegExp(parsedQuery, 'i').test(this.currentLabel) || this.created;
        if (!this.visible) {
          this.parent.filteredOptionsCount--;
        }
      },
      resetIndex: function() {
        var self = this;
        self.$nextTick(function() {
          self.index = self.parent.options.indexOf(self);
        });
      }
    },
    created: function() {
      this.parent.options.push(this);
      this.parent.cachedOptions.push(this);
      this.parent.optionsCount++;
      this.parent.filteredOptionsCount++;
      this.index = this.parent.options.indexOf(this);
      this.$on('queryChange', this.queryChange);
      this.$on('handleGroupDisabled', this.handleGroupDisabled);
      this.$on('resetIndex', this.resetIndex);
    },
    beforeDestroy: function() {
      this.dispatch('VueSelect', 'onOptionDestroy', this);
    }
  };
  Vue.component(VueOption.name, VueOption);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueOptionGroup = definition(context.Vue, context.VueUtil);
    delete context.VueOptionGroup;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueOptionGroup = {
    template: '<ul class="vue-select-group__wrap"><li class="vue-select-group__title" v-show="visible">{{label}}</li><li><ul class="vue-select-group"><slot></slot></ul></li></ul>',
    name: 'VueOptionGroup',
    mixins: [VueUtil.component.emitter],
    props: {
      label: String,
      disabled: Boolean
    },
    data: function() {
      return {
        visible: true
      };
    },
    watch: {
      disabled: function(val) {
        this.broadcast('VueOption', 'handleGroupDisabled', val);
      }
    },
    methods: {
      queryChange: function() {
        this.visible = this.$children && VueUtil.isArray(this.$children) && this.$children.some(function(option) {
          return option.visible === true;
        });
      }
    },
    created: function() {
      this.$on('queryChange', this.queryChange);
    },
    mounted: function() {
      if (this.disabled) {
        this.broadcast('VueOption', 'handleGroupDisabled', this.disabled);
      }
    }
  };
  Vue.component(VueOptionGroup.name, VueOptionGroup);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePopper'], definition);
  } else {
    context.VueSelectDropdown = definition(context.Vue, context.VuePopper);
    delete context.VueSelectDropdown;
  }
})(this, function(Vue, VuePopper) {
  'use strict';
  var VueSelectDropdown = {
    template: '<div :class="[\'vue-select-dropdown\', {\'is-multiple\': $parent.multiple}, popperClass]"><slot></slot></div>',
    name: 'VueSelectDropdown',
    mixins: [VuePopper],
    props: {
      placement: {
        type: String,
        default: 'bottom-start',
      },
      autoWidth: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      popperClass: function() {
        return this.$parent.popperClass;
      }
    },
    mounted: function() {
      this.referenceElm = this.$parent.$refs.reference.$el;
      this.$parent.popperElm = this.popperElm = this.$el;
      this.$on('updatePopper', this.updatePopper);
      this.$on('destroyPopper', this.destroyPopper);
    }
  };
  Vue.component(VueSelectDropdown.name, VueSelectDropdown);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueSelect = definition(context.Vue, context.VueUtil);
    delete context.VueSelect;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueSelect = {
    template: 
    '<div class="vue-select" v-clickoutside="handleClose"> \
      <div :class="[\'vue-select__tags\', {\'no-reset-height\': !autoHeight}]" v-if="multiple" @click.stop="toggleMenu" \
        ref="tags" :style="{\'max-width\': inputWidth - 32 + \'px\'}"> \
        <transition-group @after-leave="resetInputHeight"> \
          <vue-tag v-for="(item, index) in selected" :key="index" :closable="!disabled" hit :type="disabled ? \'\' : \'info\'" \
            @close="deleteTag($event, item)"><span class="vue-select__tags-text">{{item.currentLabel}}</span></vue-tag> \
        </transition-group><input type="text" :class="[\'vue-select__input\', {\'is-mini\': size===\'mini\'}]" @focus="visible = true" \
          :disabled="disabled" @keyup="managePlaceholder" @keydown="resetInputState" @keydown.down.prevent="navigateOptions(\'next\')" \
          @keydown.up.prevent="navigateOptions(\'prev\')" @keydown.enter.prevent="selectOption" @keydown.esc.prevent="visible = false" \
          @keydown.delete="deletePrevTag" v-model="query" v-if="filterable" :style="{width: inputLength + \'px\', \'max-width\': inputWidth - 42 + \'px\'}" \
          ref="input"></div> \
      <vue-input ref="reference" v-model="selectedLabel" type="text" :text-align="textAlign" \
        :placeholder="placeholderLang" :autofocus="autofocus" :tabindex="tabindex" :name="name" :size="size" \
        :disabled="disabled" :readonly="!filterable || multiple" :validate-event="false" @click="handleIconClick" \
        @mousedown.native="handleMouseDown" @keyup.native="debouncedOnInputChange" @input="keepMenu" @keydown.native.down.prevent="navigateOptions(\'next\')" \
        @keydown.native.up.prevent="navigateOptions(\'prev\')" @keydown.native.enter.prevent="selectOption" \
        @keydown.native.esc.prevent="visible = false" @keydown.native.tab="visible = false" @paste.native="debouncedOnInputChange" \
        @mouseenter.native="inputHovering = true" @mouseleave.native="inputHovering = false" :icon="iconClass"></vue-input> \
      <transition @after-leave="destroyPopper" @after-enter="handleMenuEnter"> \
        <vue-select-dropdown ref="popper" v-show="visible && emptyText !== false"> \
          <ul :class="[\'vue-select-dropdown__list\', {\'is-empty\': !allowCreate && filteredOptionsCount === 0}]" \
            v-show="options.length > 0 && !loading"> \
            <vue-option :value="query" created v-if="showNewOption"></vue-option> \
            <slot></slot> \
          </ul> \
          <p class="vue-select-dropdown__empty" v-if="emptyText && !allowCreate">{{emptyText}}</p> \
        </vue-select-dropdown> \
      </transition> \
    </div>',
    mixins: [VueUtil.component.emitter],
    name: 'VueSelect',
    computed: {
      iconClass: function() {
        var criteria; 
        if (this.multiple) {
          if (this.visible) {
            criteria = this.clearable && !this.disabled && this.inputHovering;
            return criteria ? 'vue-icon-success is-show-check' : (this.remote && this.filterable ? '' : 'vue-icon-arrow-up is-reverse');
          } else {
            criteria = this.clearable && !this.disabled && this.inputHovering && VueUtil.isDef(this.value) && this.value.length > 0;
            return criteria ? 'vue-icon-error is-show-close' : (this.remote && this.filterable ? '' : 'vue-icon-arrow-up');
          }
        } else {
          criteria = this.clearable && !this.disabled && this.inputHovering && VueUtil.isDef(this.value) && this.value !== '';
          return criteria ? 'vue-icon-error is-show-close' : (this.remote && this.filterable ? '' : 'vue-icon-arrow-up');
        }
      },
      emptyText: function() {
        if (this.loading) {
          return this.loadingText || this.$t('vue.select.loading');
        } else {
          if (this.remote && this.query === '' && this.options.length === 0)
            return false;
          if (this.filterable && this.options.length > 0 && this.filteredOptionsCount === 0) {
            return this.noMatchText || this.$t('vue.select.noMatch');
          }
          if (this.options.length === 0) {
            return this.noDataText || this.$t('vue.select.noData');
          }
        }
        return null;
      },
      showNewOption: function() {
        var self = this;
        var hasExistingOption = VueUtil.filter(self.options, function(option) {
          return !option.created;
        }).some(function(option) {
          return option.currentLabel === self.query;
        });
        return self.filterable && self.allowCreate && self.query !== '' && !hasExistingOption;
      },
      placeholderLang: function() {
        if (this.multiple) {
          if (VueUtil.isArray(this.value) && this.value.length > 0) {
            return '';
          } else {
            if (!this.currentPlaceholder) {
              return this.$t('vue.select.placeholder');
            }
            return this.currentPlaceholder;
          }
        }
        if (!this.placeholder)
          return this.$t('vue.select.placeholder');
        return this.placeholder;
      }
    },
    directives: {
      Clickoutside: VueUtil.component.clickoutside()
    },
    props: {
      name: String,
      value: {required: true},
      size: String,
      disabled: Boolean,
      clearable: Boolean,
      filterable: Boolean,
      allowCreate: Boolean,
      loading: Boolean,
      popperClass: String,
      remote: Boolean,
      loadingText: String,
      noMatchText: String,
      noDataText: String,
      autofocus: Boolean,
      textAlign: String,
      tabindex: Number,
      remoteMethod: Function,
      filterMethod: Function,
      multiple: Boolean,
      multipleLimit: {
        type: Number,
        default: 0
      },
      placeholder: String,
      autoHeight: {
        type: Boolean,
        default: true
      }
    },
    data: function() {
      return {
        options: [],
        cachedOptions: [],
        createdLabel: null,
        createdSelected: false,
        selected: this.multiple ? [] : {},
        isSelect: true,
        inputLength: 20,
        inputWidth: 0,
        cachedPlaceHolder: '',
        optionsCount: 0,
        filteredOptionsCount: 0,
        dropdownUl: null,
        visible: false,
        selectedLabel: '',
        hoverIndex: -1,
        query: '',
        bottomOverflowBeforeHidden: 0,
        topOverflowBeforeHidden: 0,
        optionsAllDisabled: false,
        inputHovering: false,
        currentPlaceholder: ''
      };
    },
    watch: {
      multiple: function(val) {
        var self = this;
        if (self.$refs.reference) {
          self.$refs.reference.setCurrentValue('');
        }
        if (val) {
          self.selected = [];
          self.$nextTick(function() {
            self.$emit('input', []);
          });
        } else {
          self.selected = {};
          self.$nextTick(function() {
            self.$emit('input', '');
          });
        }
      },
      value: function(val) {
        if (this.multiple) {
          this.resetInputHeight();
          if (val.length > 0 || (this.$refs.input && this.query !== '')) {
            this.currentPlaceholder = '';
          } else {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        }
        this.setSelected();
        if (this.filterable && !this.multiple) {
          this.inputLength = 20;
        }
        this.$emit('change', val);
        this.dispatch('VueFormItem', 'vue.form.change', val);
      },
      query: function(val) {
        var self = this;
        self.$nextTick(function() {
          self.broadcast('VueSelectDropdown', 'updatePopper');
        });
        self.hoverIndex = -1;
        if (self.multiple && self.filterable) {
          self.resetInputHeight();
        }
        if (self.remote && VueUtil.isFunction(self.remoteMethod)) {
          self.hoverIndex = -1;
          self.remoteMethod(val);
          self.broadcast('VueOption', 'resetIndex');
        } else if (VueUtil.isFunction(self.filterMethod)) {
          self.filterMethod(val);
          self.broadcast('VueOptionGroup', 'queryChange');
        } else {
          self.filteredOptionsCount = self.optionsCount;
          self.broadcast('VueOption', 'queryChange', val);
          self.broadcast('VueOptionGroup', 'queryChange');
        }
      },
      visible: function(val) {
        var self = this;
        if (!val) {
          self.$refs.reference.$refs.input.blur();
          self.handleIconHide();
          self.broadcast('VueSelectDropdown', 'destroyPopper');
          if (self.$refs.input) {
            self.$refs.input.blur();
          }
          self.query = '';
          self.selectedLabel = '';
          self.inputLength = 20;
          self.resetHoverIndex();
          self.$nextTick(function() {
            if (self.$refs.input && self.$refs.input.value === '' && self.selected.length === 0) {
              self.currentPlaceholder = self.cachedPlaceHolder;
            }
          });
          if (!self.multiple) {
            self.getOverflows();
            if (self.selected) {
              if (self.filterable && self.allowCreate && self.createdSelected && self.createdOption) {
                self.selectedLabel = self.createdLabel;
              } else {
                self.selectedLabel = self.selected.currentLabel;
              }
              if (self.filterable)
                self.query = self.selectedLabel;
            }
          }
        } else {
          self.handleIconShow();
          self.broadcast('VueSelectDropdown', 'updatePopper');
          if (self.filterable) {
            self.query = self.selectedLabel;
            if (self.multiple) {
              self.$refs.input.focus();
            } else {
              if (!self.remote) {
                self.broadcast('VueOption', 'queryChange', '');
                self.broadcast('VueOptionGroup', 'queryChange');
              }
              //self.broadcast('VueInput', 'inputSelect');
            }
          }
        }
        self.$emit('visible-change', val);
      },
      options: function(val) {
        var self = this;
        self.optionsAllDisabled = val.length === VueUtil.filter(val, function(item) {
          return item.disabled === true;
        }).length;
        if (self.multiple) {
          self.resetInputHeight();
        }
        var inputs = self.$el.querySelectorAll('input');
        if ([].indexOf.call(inputs, document.activeElement) === -1) {
          self.setSelected();
        }
      }
    },
    methods: {
      focus: function() {
        this.$refs.reference && this.$nextTick(this.$refs.reference.focus);
      },
      handleIconHide: function() {
        var icon = this.$refs.reference.$refs.icon;
        if (icon) {
          VueUtil.removeClass(icon, 'is-reverse');
        }
      },
      handleIconShow: function() {
        var icon = this.$refs.reference.$refs.icon;
        if (icon && !VueUtil.hasClass(icon, 'vue-icon-error')) {
          VueUtil.addClass(icon, 'is-reverse');
        }
      },
      handleMenuEnter: function() {
        if (!this.dropdownUl) {
          this.dropdownUl = this.$refs.popper.$el;
          this.getOverflows();
        }
      },
      getOverflows: function() {
        if (this.dropdownUl && this.selected && this.selected.$el) {
          var selectedRect = this.selected.$el.getBoundingClientRect();
          var popperRect = this.$refs.popper.$el.getBoundingClientRect();
          this.bottomOverflowBeforeHidden = selectedRect.bottom - popperRect.bottom;
          this.topOverflowBeforeHidden = selectedRect.top - popperRect.top;
        }
      },
      getOption: function(value) {
        var option = VueUtil.filter(this.cachedOptions, function(option) {
          return option.value === value;
        })[0];
        if (option)
          return option;
        var label = VueUtil.isString(value) || VueUtil.isNumber(value) ? value : '';
        var newOption = {
          value: value,
          currentLabel: label
        };
        return newOption;
      },
      setSelected: function() {
        var self = this;
        if (!self.multiple) {
          var option = self.getOption(self.value);
          if (option.created) {
            self.createdLabel = option.currentLabel;
            self.createdSelected = true;
          } else {
            self.createdSelected = false;
          }
          self.selectedLabel = option.currentLabel;
          self.selected = option;
          if (self.filterable)
            self.query = self.selectedLabel;
          return;
        }
        var result = [];
        VueUtil.loop(self.value, function(value) {
          result.push(self.getOption(value));
        });
        self.selected = result;
        self.$nextTick(function() {
          self.resetInputHeight();
        });
      },
      handleIconClick: function(event) {
        if (this.iconClass.indexOf('vue-icon-error') !== -1) {
          this.deleteSelected(event);
        } else if (this.iconClass.indexOf('vue-icon-success') !== -1) {
          var value = [];
          VueUtil.loop(this.options, function(option) {
            if (!option.disabled) {
              value.push(option.value);
            }
          });
          this.$emit('input', value);
        } else {
          this.toggleMenu();
        }
      },
      handleMouseDown: function(event) {
        if (event.target.tagName !== 'INPUT')
          return;
        if (this.visible) {
          this.handleClose();
          this.focus();
          event.preventDefault();
        } else {
          this.toggleMenu();
        }
      },
      destroyPopper: function() {
        this.$refs.popper.destroyPopper();
      },
      handleClose: function() {
        this.visible = false;
      },
      deletePrevTag: function(e) {
        if (e.target.value.length <= 0) {
          var value = VueUtil.mergeArray([], this.value);
          value.pop();
          this.$emit('input', value);
        }
      },
      managePlaceholder: function() {
        if (this.currentPlaceholder !== '') {
          this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
        }
      },
      resetInputState: function(e) {
        if (e.keyCode !== 8) {
          this.inputLength = this.$refs.input.value.length * 15 + 20;
          this.resetInputHeight();
        }
      },
      resetInputHeight: function() {
        var self = this;
        if (!this.autoHeight) return;
        self.$nextTick(function() {
          var sizeMap = {'large': 42, 'small': 30, 'mini': 22};
          var input = self.$refs.reference.$refs.input;
          var icon = self.$refs.reference.$refs.icon;
          var size = sizeMap[self.size] || 36;
          var newHeight = (parseInt(self.$refs.tags.children[0].offsetHeight / size, 10) + 1) * size + 'px';
          input.style.height = newHeight;
          icon.style.lineHeight = newHeight;
          if (self.visible && self.emptyText !== false) {
            self.broadcast('VueSelectDropdown', 'updatePopper');
          }
        });
      },
      resetHoverIndex: function() {
        var self = this;
        self.$nextTick(function() {
          if (!self.multiple) {
            self.hoverIndex = self.options.indexOf(self.selected);
          } else {
            if (self.selected.length > 0) {
              self.hoverIndex = Math.min.apply(null, VueUtil.map(self.selected, function(item) {
                return self.options.indexOf(item);
              }));
            } else {
              self.hoverIndex = -1;
            }
          }
        });
      },
      handleOptionSelect: function(option) {
        if (this.multiple) {
          var value = VueUtil.mergeArray([], this.value);
          var optionIndex = value.indexOf(option.value);
          if (optionIndex !== -1) {
            value.splice(optionIndex, 1);
          } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
            value.push(option.value);
          }
          this.$emit('input', value);
          if (option.created) {
            this.query = '';
            this.inputLength = 20;
          }
          if (this.filterable) {
            this.$refs.input.focus();
          } else {
            this.focus();
          }
        } else {
          this.$emit('input', option.value);
          this.visible = false;
          this.focus();
        }
      },
      toggleMenu: function() {
        if (this.filterable && this.query === '' && this.visible) {
          return;
        }
        if (!this.disabled) {
          this.visible = !this.visible;
        }
      },
      keepMenu: function() {
        if (!this.visible) {
          this.visible = true;
        }
      },
      navigateOptions: function(direction) {
        if (!this.visible) {
          this.visible = true;
          return;
        }
        if (this.options.length === 0 || this.filteredOptionsCount === 0)
          return;
        this.optionsAllDisabled = this.options.length === VueUtil.filter(this.options, function(item) {return item.disabled === true;}).length;
        if (!this.optionsAllDisabled) {
          if (direction === 'next') {
            this.hoverIndex++;
            if (this.hoverIndex === this.options.length) {
              this.hoverIndex = 0;
            }
            this.resetScrollTop();
            if (this.options[this.hoverIndex].disabled === true || this.options[this.hoverIndex].groupDisabled === true || !this.options[this.hoverIndex].visible) {
              this.navigateOptions('next');
            }
          }
          if (direction === 'prev') {
            this.hoverIndex--;
            if (this.hoverIndex < 0) {
              this.hoverIndex = this.options.length - 1;
            }
            this.resetScrollTop();
            if (this.options[this.hoverIndex].disabled === true || this.options[this.hoverIndex].groupDisabled === true || !this.options[this.hoverIndex].visible) {
              this.navigateOptions('prev');
            }
          }
        }
      },
      resetScrollTop: function() {
        var bottomOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().bottom - this.$refs.popper.$el.getBoundingClientRect().bottom;
        var topOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().top - this.$refs.popper.$el.getBoundingClientRect().top;
        if (bottomOverflowDistance > 0) {
          this.dropdownUl.scrollTop += bottomOverflowDistance;
        }
        if (topOverflowDistance < 0) {
          this.dropdownUl.scrollTop += topOverflowDistance;
        }
      },
      selectOption: function() {
        if (this.options[this.hoverIndex]) {
          this.handleOptionSelect(this.options[this.hoverIndex]);
        }
      },
      deleteSelected: function(event) {
        event && event.stopPropagation();
        if (this.multiple) {
          this.$emit('input', []);
        } else {
          this.$emit('input', '');
        }
        this.visible = false;
      },
      deleteTag: function(event, tag) {
        var index = this.selected.indexOf(tag);
        if (index !== -1 && !this.disabled) {
          var value = VueUtil.mergeArray([], this.value);
          value.splice(index, 1);
          this.$emit('input', value);
          this.$emit('remove-tag', tag);
        }
        event.stopPropagation();
      },
      onInputChange: function() {
        if (this.filterable) {
          this.query = this.selectedLabel;
        }
      },
      onOptionDestroy: function(option) {
        this.optionsCount--;
        this.filteredOptionsCount--;
        var index = this.options.indexOf(option);
        if (index !== -1) {
          this.options.splice(index, 1);
        }
        this.broadcast('VueOption', 'resetIndex');
      },
      resetInputWidth: function() {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      },
      handleResize: function() {
        this.resetInputWidth();
        if (this.multiple) this.resetInputHeight();
      },
      debouncedOnInputChange: VueUtil.debounce(function() {
        this.onInputChange();
      })
    },
    created: function() {
      this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
      if (this.multiple && !VueUtil.isArray(this.value)) this.$emit('input', []);
      if (!this.multiple && VueUtil.isArray(this.value)) this.$emit('input', '');
      this.setSelected();
      this.$on('handleOptionClick', this.handleOptionSelect);
      this.$on('onOptionDestroy', this.onOptionDestroy);
      this.$on('setSelected', this.setSelected);
    },
    mounted: function() {
      VueUtil.addResizeListener(this.$el, this.handleResize);
      if (this.remote && this.multiple) {
        this.resetInputHeight();
      }
      this.$nextTick(function() {
        if (this.$refs.reference.$el) {
          this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
        }
      });
    },
    beforeDestroy: function() {
      VueUtil.removeResizeListener(this.$el, this.handleResize);
    }
  };
  Vue.component(VueSelect.name, VueSelect);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueTree = definition(context.Vue, context.VueUtil);
    delete context.VueTree;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var NODE_KEY = '$treeNodeId';
  var getChildState = function(node) {
    var all = true;
    var none = true;
    var allWithoutDisable = true;
    VueUtil.loop(node, function(n) {
      if (n.checked !== true || n.indeterminate) {
        all = false;
        if (!n.disabled) {
          allWithoutDisable = false;
        }
      }
      if (n.checked !== false || n.indeterminate) {
        none = false;
      }
    });
    return {
      all: all,
      none: none,
      allWithoutDisable: allWithoutDisable,
      half: !all && !none
    };
  };
  var reInitChecked = function(node) {
    var childState = getChildState(node.childNodes);
    var all = childState.all;
    var none = childState.none;
    var half = childState.half;
    if (all) {
      node.checked = true;
      node.indeterminate = false;
    } else if (half) {
      node.checked = false;
      node.indeterminate = true;
    } else if (none) {
      node.checked = false;
      node.indeterminate = false;
    }
    var parent = node.parent;
    if (!parent || parent.level === 0) return;
    if (!node.store.checkStrictly) {
      reInitChecked(parent);
    }
  };
  var getPropertyFromData = function(node, prop) {
    var props = node.store.props;
    var data = node.data || {};
    var config = props[prop];
    if (VueUtil.isFunction(config)) {
      return config(data, node);
    }
    if (VueUtil.isString(config)) {
      return data[config];
    }
    if (!VueUtil.isDef(config)) {
      return '';
    }
  };
  var nodeIdSeed = 0;
  var Node = function(options) {
    var self = this;
    self.id = nodeIdSeed++;
    self.text = null;
    self.checked = false;
    self.indeterminate = false;
    self.data = null;
    self.expanded = false;
    self.parent = null;
    self.visible = true;
    VueUtil.ownPropertyLoop(options, function(name) {
      self[name] = options[name];
    });
    self.level = 0;
    self.loaded = false;
    self.childNodes = [];
    self.loading = false;
    self.label = self.getLabel();
    self.icon = self.getIcon();
    self.key = self.getKey();
    self.disabled = self.getDisabled();
    if (self.parent) {
      self.level = self.parent.level + 1;
    }
    var store = self.store;
    if (!store) throw 'store is required!';
    store.registerNode(self);
    var props = store.props;
    if (props && VueUtil.isDef(props.isLeaf)) {
      var isLeaf = getPropertyFromData(self, 'isLeaf');
      if (VueUtil.isBoolean(isLeaf)) {
        self.isLeafByUser = isLeaf;
      }
    }
    if (store.lazy !== true && self.data) {
      self.setData(self.data);
      if (store.defaultExpandAll) {
        self.expanded = true;
      }
    } else if (self.level > 0 && store.lazy && store.defaultExpandAll) {
      self.expand();
    }
    if (!self.data) return;
    var defaultExpandedKeys = store.defaultExpandedKeys;
    var key = store.key;
    if (key && defaultExpandedKeys && defaultExpandedKeys.indexOf(self.key) !== -1) {
      self.expand(null, store.autoExpandParent);
    }
    if (key && store.currentNodeKey && self.key === store.currentNodeKey) {
      store.currentNode = self;
    }
    if (store.lazy) {
      store._initDefaultCheckedNode(self);
    }
    self.updateLeafState();
  };
  Node.prototype.setData = function(data) {
    var self = this;
    if (!VueUtil.isArray(data)) {
      var markNodeData = function(node, data) {
        if (data[NODE_KEY]) return;
        Object.defineProperty(data, NODE_KEY, {
          value: node.id,
          enumerable: false,
          configurable: false,
          writable: false
        });
      };
      markNodeData(self, data);
    }
    self.data = data;
    self.childNodes = [];
    var children;
    if (self.level === 0 && self.data instanceof Array) {
      children = self.data;
    } else {
      children = getPropertyFromData(self, 'children') || [];
    }
    VueUtil.loop(children, function(child) {
      self.insertChild({
        data: child
      });
    });
  };
  Node.prototype.getLabel = function() {
    return getPropertyFromData(this, 'label');
  };
  Node.prototype.getIcon = function(node) {
    return getPropertyFromData(this, 'icon');
  };
  Node.prototype.getDisabled = function() {
    return getPropertyFromData(this, 'disabled');
  };
  Node.prototype.getKey = function() {
    var self = this;
    var nodeKey = self.store.key;
    if (self.data)
      return self.data[nodeKey];
    return null;
  };
  Node.prototype.insertChild = function(child, index) {
    if (!child) throw 'insertChild error: child is required.';
    var self = this;
    if (!(child instanceof Node)) {
      VueUtil.merge(child, {parent: self, store: self.store});
      child = new Node(child);
    }
    child.level = self.level + 1;
    if (!VueUtil.isDef(index) || index < 0) {
      self.childNodes.push(child);
    } else {
      self.childNodes.splice(index, 0, child);
    }
    self.updateLeafState();
  };
  Node.prototype.insertBefore = function(child, ref) {
    var self = this;
    var index;
    if (ref) {
      index = self.childNodes.indexOf(ref);
    }
    self.insertChild(child, index);
  };
  Node.prototype.insertAfter = function(child, ref) {
    var self = this;
    var index;
    if (ref) {
      index = self.childNodes.indexOf(ref);
      if (index !== -1)
        index += 1;
    }
    self.insertChild(child, index);
  };
  Node.prototype.removeChild = function(child) {
    var self = this;
    var index = self.childNodes.indexOf(child);
    if (index !== -1) {
      self.store && self.store.deregisterNode(child);
      child.parent = null;
      self.childNodes.splice(index, 1);
    }
    self.updateLeafState();
  };
  Node.prototype.removeChildByData = function(data) {
    var self = this;
    var targetNode = null;
    VueUtil.loop(self.childNodes, function(node) {
      if (node.data === data) {
        targetNode = node;
      }
    });
    if (targetNode) {
      self.removeChild(targetNode);
    }
  };
  Node.prototype.expand = function(callback, expandParent) {
    var self = this;
    var done = function() {
      if (expandParent) {
        var parent = self.parent;
        while (parent.level > 0) {
          parent.expanded = true;
          parent = parent.parent;
        }
      }
      self.expanded = true;
      if (callback)
        callback();
    };
    if (self.shouldLoadData()) {
      self.loadData(function(data) {
        if (VueUtil.isArray(data)) {
          var initLazyLoadChild = function(node) {
            if (node.checked) {
              var childNodes = node.childNodes;
              VueUtil.loop(childNodes, function(child) {
                if (!child.disabled) {
                  child.checked = true;
                }
              });
            }
            var parent = node.parent;
            if (!parent || parent.level === 0) return;
            reInitChecked(parent);
          };
          initLazyLoadChild(self);
          done();
        }
      });
    } else {
      done();
    }
  };
  Node.prototype.doCreateChildren = function(array, defaultProps) {
    var self = this;
    defaultProps = defaultProps || {};
    VueUtil.loop(array, function(item) {
      self.insertChild(VueUtil.merge({
        data: item
      }, defaultProps));
    });
  };
  Node.prototype.collapse = function() {
    this.expanded = false;
  };
  Node.prototype.shouldLoadData = function() {
    return this.store.lazy === true && this.store.load && !this.loaded;
  };
  Node.prototype.updateLeafState = function() {
    var self = this;
    if (self.store.lazy === true && self.loaded !== true && VueUtil.isDef(self.isLeafByUser)) {
      self.isLeaf = selfk.isLeafByUser;
      return;
    }
    var childNodes = self.childNodes;
    if (!self.store.lazy || (self.store.lazy === true && self.loaded === true)) {
      self.isLeaf = !childNodes || childNodes.length === 0;
      return;
    }
    self.isLeaf = false;
  };
  Node.prototype.setChecked = function(value, deep, recursion, passValue) {
    var self = this;
    self.indeterminate = value === 'half';
    self.checked = value === true;
    var selfChildState = getChildState(self);
    var all = selfChildState.all;
    var allWithoutDisable = selfChildState.allWithoutDisable;
    if (self.childNodes.length && !all && allWithoutDisable) {
      self.checked = false;
      value = false;
    }
    var handleDescendants = function(lazy) {
      if (deep && !lazy) {
        var childNodes = self.childNodes;
        VueUtil.loop(childNodes, function(child) {
          passValue = passValue || value !== false;
          var isCheck = child.disabled ? child.checked : passValue;
          child.setChecked(isCheck, deep, true, passValue);
        });
        var childState = getChildState(childNodes);
        var half = childState.half;
        var all = childState.all;
        if (!all) {
          self.checked = all;
          self.indeterminate = half;
        }
      }
    };
    if (!self.store.checkStrictly && self.shouldLoadData()) {
      self.loadData(function() {
        handleDescendants(true);
      }, {
          checked: value !== false
        });
    } else {
      handleDescendants();
    }
    var parent = self.parent;
    if (!parent || parent.level === 0) return;
    if (!self.store.checkStrictly && !recursion) {
      reInitChecked(parent);
    }
  };
  Node.prototype.getChildren = function() {
    var self = this;
    var data = self.data;
    if (!data) return null;
    var props = self.store.props;
    var children = 'children';
    if (props) {
      children = props.children || 'children';
    }
    if (!VueUtil.isDef(data[children])) {
      data[children] = null;
    }
    return data[children];
  };
  Node.prototype.updateChildren = function() {
    var self = this;
    var newData = self.getChildren() || [];
    var oldData = VueUtil.map(self.childNodes, function(node) {
      return node.data;
    });
    var newDataMap = {};
    var newNodes = [];
    VueUtil.loop(newData, function(item, index) {
      if (item[NODE_KEY]) {
        newDataMap[item[NODE_KEY]] = {
          index: index,
          data: item
        };
      } else {
        newNodes.push({
          index: index,
          data: item
        });
      }
    });
    VueUtil.loop(oldData, function(item) {
      if (!newDataMap[item[NODE_KEY]])
        self.removeChildByData(item);
    });
    VueUtil.loop(newNodes, function(args) {
      var index = args.index;
      var data = args.data;
      self.insertChild({
        data: data
      }, index);
    });
    self.updateLeafState();
  };
  Node.prototype.loadData = function(callback, defaultProps) {
    var self = this;
    defaultProps = defaultProps || {};
    if (self.store.lazy === true && self.store.load && !self.loaded && (!self.loading || Object.keys(defaultProps).length)) {
      self.loading = true;
      var resolve = function(children) {
        self.loaded = true;
        self.loading = false;
        self.childNodes = [];
        self.doCreateChildren(children, defaultProps);
        self.updateLeafState();
        if (callback) {
          callback.call(self, children);
        }
      };
      self.store.load(self, resolve);
    } else {
      if (callback) {
        callback.call(self);
      }
    }
  };
  var TreeStore = function(options) {
    var self = this;
    self.currentNode = null;
    self.currentNodeKey = null;
    VueUtil.ownPropertyLoop(options, function(option) {
      self[option] = options[option];
    });
    self.nodesMap = {};
    self.root = new Node({
      data: self.data,
      store: self
    });
    if (self.lazy && self.load) {
      var loadFn = self.load;
      loadFn(self.root, function(data) {
        self.root.doCreateChildren(data);
        self._initDefaultCheckedNodes();
      });
    } else {
      self._initDefaultCheckedNodes();
    }
  };
  TreeStore.prototype.filter = function(value) {
    var self = this;
    var filterNodeMethod = self.filterNodeMethod;
    var traverse = function(node) {
      var childNodes = node.root ? node.root.childNodes : node.childNodes;
      VueUtil.loop(childNodes, function(child) {
        child.visible = filterNodeMethod.call(child, value, child.data, child);
        traverse(child);
      });
      if (!node.visible && childNodes.length) {
        var allHidden = true;
        VueUtil.loop(childNodes, function(child) {
          if (child.visible)
            allHidden = false;
        });
        if (node.root) {
          node.root.visible = allHidden === false;
        } else {
          node.visible = allHidden === false;
        }
      }
      if (node.visible && !node.isLeaf)
        node.expand();
    };
    traverse(self);
  };
  TreeStore.prototype.setData = function(newVal) {
    var self = this;
    var instanceChanged = newVal !== self.root.data;
    self.root.setData(newVal);
    if (instanceChanged) {
      self._initDefaultCheckedNodes();
    }
  };
  TreeStore.prototype.getNode = function(data) {
    var getNodeKey = function(key, data) {
      if (!key)
        return data[NODE_KEY];
      return data[key];
    };
    var key = VueUtil.isObject(data) ? getNodeKey(this.key, data) : data;
    return this.nodesMap[key];
  };
  TreeStore.prototype.insertBefore = function(data, refData) {
    var self = this;
    var refNode = self.getNode(refData);
    refNode.parent.insertBefore({
      data: data
    }, refNode);
  };
  TreeStore.prototype.insertAfter = function(data, refData) {
    var self = this;
    var refNode = self.getNode(refData);
    refNode.parent.insertAfter({
      data: data
    }, refNode);
  };
  TreeStore.prototype.remove = function(data) {
    var self = this;
    var node = self.getNode(data);
    if (node && node.parent) {
      node.parent.removeChild(node);
    }
  };
  TreeStore.prototype.append = function(data, parentData) {
    var self = this;
    var parentNode = parentData ? self.getNode(parentData) : self.root;
    if (parentNode) {
      parentNode.insertChild({
        data: data
      });
    }
  };
  TreeStore.prototype._initDefaultCheckedNodes = function() {
    var self = this;
    var defaultCheckedKeys = self.defaultCheckedKeys || [];
    var nodesMap = self.nodesMap;
    VueUtil.loop(defaultCheckedKeys, function(checkedKey) {
      var node = nodesMap[checkedKey];
      if (node) {
        node.setChecked(true, !self.checkStrictly);
      }
    });
  };
  TreeStore.prototype._initDefaultCheckedNode = function(node) {
    var self = this;
    var defaultCheckedKeys = self.defaultCheckedKeys || [];
    var nodeKey = node.key || node.getKey();
    if (defaultCheckedKeys.indexOf(nodeKey) !== -1) {
      node.setChecked(true, !self.checkStrictly);
    }
  };
  TreeStore.prototype.setDefaultCheckedKey = function(newVal) {
    var self = this;
    if (newVal !== self.defaultCheckedKeys) {
      self.defaultCheckedKeys = newVal;
      self._initDefaultCheckedNodes();
    }
  };
  TreeStore.prototype.registerNode = function(node) {
    var self = this;
    var key = self.key;
    if (!key || !node || !node.data)
      return;
    var nodeKey = node.key || node.getKey();
    if (nodeKey)
      self.nodesMap[nodeKey] = node;
  };
  TreeStore.prototype.deregisterNode = function(node) {
    var self = this;
    var key = self.key;
    if (!key || !node || !node.data)
      return;
    var nodeKey = node.key || node.getKey();
    delete self.nodesMap[nodeKey];
  };
  TreeStore.prototype.getCheckedNodes = function() {
    var self = this;
    var leafOnly = arguments.length > 0 && VueUtil.isDef(arguments[0]) ? arguments[0] : false;
    var indeterminate = arguments.length > 1 && VueUtil.isDef(arguments[1]) ? arguments[1] : false;
    var checkedNodes = [];
    var traverse = function(node) {
      var childNodes = node.root ? node.root.childNodes : node.childNodes;
      VueUtil.loop(childNodes, function(child) {
        if ((!leafOnly && (child.checked || (indeterminate && child.indeterminate)) ) || (leafOnly && child.isLeaf && child.checked)) {
          checkedNodes.push(child.data);
        }
        traverse(child);
      });
    };
    traverse(self);
    return checkedNodes;
  };
  TreeStore.prototype.getCheckedKeys = function() {
    var self = this;
    var leafOnly = arguments.length > 0 && VueUtil.isDef(arguments[0]) ? arguments[0] : false;
    var indeterminate = arguments.length > 1 && VueUtil.isDef(arguments[1]) ? arguments[1] : false;
    var key = self.key;
    var allNodes = self._getAllNodes();
    var keys = [];
    VueUtil.loop(allNodes, function(node) {
      if (!leafOnly || (leafOnly && node.isLeaf)) {
        if (node.checked || (indeterminate && node.indeterminate)) {
          keys.push((node.data || {})[key]);
        }
      }
    });
    return keys;
  };
  TreeStore.prototype._getAllNodes = function() {
    var self = this;
    var allNodes = [];
    var nodesMap = self.nodesMap;
    VueUtil.ownPropertyLoop(nodesMap, function(nodeKey) {
      allNodes.push(nodesMap[nodeKey]);
    });
    return allNodes;
  };
  TreeStore.prototype._setCheckedKeys = function(key) {
    var self = this;
    var leafOnly = arguments.length > 1 && VueUtil.isDef(arguments[1]) ? arguments[1] : false;
    var checkedKeys = arguments[2];
    var allNodes = self._getAllNodes().sort(function(a, b) {return b.level - a.level;});
    var cache = {};
    var keys = Object.keys(checkedKeys);
    VueUtil.loop(allNodes, function(node) {
      node.setChecked(false, false);
    });
    VueUtil.loop(allNodes, function(node) {
      var nodeKey = node.data[key] + '';
      var checked = keys.indexOf(nodeKey) !== -1;
      if (!checked) {
        if (node.checked && !cache[nodeKey]) {
          node.setChecked(false, false);
        }
        return;
      }
      var parent = node.parent;
      while (parent && parent.level > 0) {
        cache[parent.data[key]] = true;
        parent = parent.parent;
      }
      if (node.isLeaf || self.checkStrictly) {
        node.setChecked(true, false);
        return;
      }
      node.setChecked(true, true);
      if (leafOnly) {
        node.setChecked(false, false);
        var traverse = function(node) {
          var childNodes = node.childNodes || [];
          VueUtil.loop(childNodes, function(child) {
            if (!child.isLeaf) {
              child.setChecked(false, false);
            }
            traverse(child);
          });
        };
        traverse(node);
      }
    });
  };
  TreeStore.prototype.setCheckedNodes = function(array) {
    var self = this;
    var leafOnly = arguments.length > 1 && VueUtil.isDef(arguments[1]) ? arguments[1] : false;
    var key = self.key;
    var checkedKeys = {};
    VueUtil.loop(array, function(item) {
      checkedKeys[(item || {})[key]] = true;
    });
    self._setCheckedKeys(key, leafOnly, checkedKeys);
  };
  TreeStore.prototype.setCheckedKeys = function(keys, leafonly) {
    var self = this;
    var leafOnly = arguments.length > 1 && VueUtil.isDef(arguments[1]) ? arguments[1] : false;
    self.defaultCheckedKeys = keys;
    var key = self.key;
    var checkedKeys = {};
    VueUtil.loop(keys, function(key) {
      checkedKeys[key] = true;
    });
    self._setCheckedKeys(key, leafOnly, checkedKeys);
  };
  TreeStore.prototype.setDefaultExpandedKeys = function(keys) {
    var self = this;
    keys = keys || [];
    self.defaultExpandedKeys = keys;
    VueUtil.loop(keys, function(key) {
      var node = self.getNode(key);
      if (node) node.expand(null, self.autoExpandParent);
    });
  };
  TreeStore.prototype.setChecked = function(data, checked, deep) {
    var self = this;
    var node = self.getNode(data);
    if (node) {
      node.setChecked(!!checked, deep);
    }
  };
  TreeStore.prototype.getCurrentNode = function() {
    return this.currentNode;
  };
  TreeStore.prototype.setCurrentNode = function(node) {
    this.currentNode = node;
  };
  TreeStore.prototype.setCurrentNodeKey = function(key) {
    var self = this;
    if (!key) {
      self.currentNode = null;
    } else {
      var node = self.getNode(key);
      if (node) {
        self.currentNode = node;
      }
    }
  };
  var VueTreeNode = {
    template: '<div @click.stop="handleClick" v-show="node.visible" :class="[\'vue-tree-node\', {\'is-expanded\': childNodeRendered && expanded,\'is-current\': tree.store.currentNode === node,\'is-hidden\': !node.visible}]"><div class="vue-tree-node__content" :style="{\'padding-left\': (node.level - 1) * tree.indent + \'px\'}"><span @click.stop="handleExpandIconClick" :class="[\'vue-tree-node__expand-icon\', {\'is-leaf\': node.isLeaf, expanded: !node.isLeaf && expanded}]"></span><vue-checkbox v-if="showCheckbox" v-model="node.checked" :indeterminate="node.indeterminate" :disabled="!!node.disabled" @change="handleCheckChange"></vue-checkbox><span v-if="node.loading" class="vue-tree-node__loading-icon vue-icon-loading"></span><node-content :node="node"></node-content></div><collapse-transition><div class="vue-tree-node__children" v-show="expanded"><vue-tree-node :render-content="renderContent" v-for="child in node.childNodes" :key="getNodeKey(child)" :node="child" @node-expand="handleChildNodeExpand"></vue-tree-node></div></collapse-transition></div>',
    name: 'VueTreeNode',
    mixins: [VueUtil.component.emitter],
    props: {
      node: {
        default: function() {
          return {};
        }
      },
      props: {},
      renderContent: Function
    },
    components: {
      CollapseTransition: VueUtil.component.collapseTransition,
      NodeContent: {
        props: {
          node: {
            required: true
          }
        },
        render: function(createElement) {
          var parent = this.$parent;
          var node = this.node;
          var data = node.data;
          var store = node.store;
          return (parent.renderContent ? parent.renderContent.call(parent._renderProxy, createElement, {
            _self: parent.tree.$vnode.context,
            node: node,
            data: data,
            store: store
          }) : createElement('span', {
            class: 'vue-tree-node__label'
          }, [this.node.label]));
        }
      }
    },
    data: function() {
      return {
        tree: null,
        expanded: false,
        childNodeRendered: false,
        showCheckbox: false,
        oldChecked: null,
        oldIndeterminate: null
      };
    },
    watch: {
      'node.indeterminate': function(val) {
        this.handleSelectChange(this.node.checked, val);
      },
      'node.checked': function(val) {
        this.handleSelectChange(val, this.node.indeterminate);
      },
      'node.expanded': function(val) {
        this.expanded = val;
        if (val) {
          this.childNodeRendered = true;
        }
      }
    },
    methods: {
      getNodeKey: function(node, index) {
        var nodeKey = this.tree.nodeKey;
        if (nodeKey && node) {
          return node.data[nodeKey];
        }
        return index;
      },
      handleSelectChange: function(checked, indeterminate) {
        if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
          this.tree.$emit('check-change', this.node.data, checked, indeterminate);
        }
        this.oldChecked = checked;
        this.indeterminate = indeterminate;
      },
      handleClick: function() {
        var store = this.tree.store;
        store.setCurrentNode(this.node);
        this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
        this.tree.currentNode = this;
        if (this.tree.expandOnClickNode) {
          this.handleExpandIconClick();
        }
        this.tree.$emit('node-click', this.node.data, this.node, this);
      },
      handleExpandIconClick: function() {
        if (this.node.isLeaf)
          return;
        if (this.expanded) {
          this.tree.$emit('node-collapse', this.node.data, this.node, this);
          this.node.collapse();
        } else {
          this.node.expand();
          this.$emit('node-expand', this.node.data, this.node, this);
        }
      },
      handleCheckChange: function(ev) {
        this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
      },
      handleChildNodeExpand: function(nodeData, node, instance) {
        this.broadcast('VueTreeNode', 'tree-node-expand', node);
        this.tree.$emit('node-expand', nodeData, node, instance);
      }
    },
    created: function() {
      var self = this;
      var parent = self.$parent;
      if (parent.isTree) {
        self.tree = parent;
      } else {
        self.tree = parent.tree;
      }
      var tree = self.tree;
      if (!tree) {
        throw 'Can not find node\'s tree.';
      }
      var props = tree.props || {};
      var childrenKey = props['children'] || 'children';
      self.$watch('node.data.' + childrenKey, function() {
        self.node.updateChildren();
      });
      self.showCheckbox = tree.showCheckbox;
      if (self.node.expanded) {
        self.expanded = true;
        self.childNodeRendered = true;
      }
      if (self.tree.accordion) {
        self.$on('tree-node-expand', function(node) {
          if (self.node !== node) {
            self.node.collapse();
          }
        });
      }
    }
  };
  var VueTree = {
    template: 
    '<div :class="[\'vue-tree\', {\'vue-tree--highlight-current\': highlightCurrent}]"> \
      <vue-tree-node v-for="child in root.childNodes" :node="child" :props="props" :key="getNodeKey(child)" \
        :render-content="renderContent" @node-expand="handleNodeExpand"></vue-tree-node> \
      <div class="vue-tree__empty-block" v-if="!root.childNodes || root.childNodes.length === 0"><span class="vue-tree__empty-text">{{$t(\'vue.tree.emptyText\')}}</span></div> \
    </div>',
    name: 'VueTree',
    mixins: [VueUtil.component.emitter],
    components: {
      VueTreeNode: VueTreeNode
    },
    data: function() {
      return {
        store: null,
        root: null,
        currentNode: null
      };
    },
    props: {
      data: {
        type: Array
      },
      nodeKey: String,
      checkStrictly: Boolean,
      defaultExpandAll: Boolean,
      expandOnClickNode: {
        type: Boolean,
        default: true
      },
      autoExpandParent: {
        type: Boolean,
        default: true
      },
      defaultCheckedKeys: Array,
      defaultExpandedKeys: Array,
      renderContent: Function,
      showCheckbox: Boolean,
      props: {
        default: function() {
          return {
            children: 'children',
            label: 'label',
            icon: 'icon',
            disabled: 'disabled'
          };
        }
      },
      lazy: Boolean,
      highlightCurrent: Boolean,
      currentNodeKey: [String, Number],
      load: Function,
      filterNodeMethod: Function,
      accordion: Boolean,
      indent: {
        type: Number,
        default: 16
      }
    },
    computed: {
      children: {
        set: function(value) {
          this.data = value;
        },
        get: function() {
          return this.data;
        }
      }
    },
    watch: {
      defaultCheckedKeys: function(newVal) {
        this.store.defaultCheckedKeys = newVal;
        this.store.setDefaultCheckedKey(newVal);
      },
      defaultExpandedKeys: function(newVal) {
        this.store.defaultExpandedKeys = newVal;
        this.store.setDefaultExpandedKeys(newVal);
      },
      currentNodeKey: function(newVal) {
        this.store.setCurrentNodeKey(newVal);
        this.store.currentNodeKey = newVal;
      },
      data: function(newVal) {
        this.store.setData(newVal);
      }
    },
    methods: {
      filter: function(value) {
        if (!this.filterNodeMethod) throw 'filterNodeMethod is required when filter';
        this.store.filter(value);
      },
      getNodeKey: function(node, index) {
        var nodeKey = this.nodeKey;
        if (nodeKey && node) {
          return node.data[nodeKey];
        }
        return index;
      },
      getCurrentNode: function() {
        var currentNode = this.store.getCurrentNode();
        return currentNode ? currentNode.data : null;
      },
      getCurrentKey: function() {
        if (!this.nodeKey) return null;
        var currentNode = this.store.getCurrentNode();
        return currentNode ? currentNode.data[this.nodeKey] : null;
      },
      setCurrentNode: function(node) {
        if (!this.nodeKey) throw 'nodeKey is required in setCheckedNodes';
        if (!node) return this.store.setCurrentNodeKey(null);
        var key = node[this.nodeKey];
        return this.store.setCurrentNodeKey(key);
      },
      setCurrentKey: function(key) {
        if (!this.nodeKey) throw 'nodeKey is required in setCheckedNodes';
        return this.store.setCurrentNodeKey(key);
      },
      getCheckedNodes: function(leafOnly, indeterminate) {
        return this.store.getCheckedNodes(leafOnly, indeterminate);
      },
      getCheckedKeys: function(leafOnly, indeterminate) {
        return this.store.getCheckedKeys(leafOnly, indeterminate);
      },
      setCheckedNodes: function(nodes, leafOnly) {
        if (!this.nodeKey) throw 'nodeKey is required in setCheckedNodes';
        this.store.setCheckedNodes(nodes, leafOnly);
      },
      setCheckedKeys: function(keys, leafOnly) {
        if (!this.nodeKey) throw 'nodeKey is required in setCheckedNodes';
        this.store.setCheckedKeys(keys, leafOnly);
      },
      setChecked: function(data, checked, deep) {
        this.store.setChecked(data, checked, deep);
      },
      handleNodeExpand: function(nodeData, node, instance) {
        this.broadcast('VueTreeNode', 'tree-node-expand', node);
        this.$emit('node-expand', nodeData, node, instance);
      }
    },
    created: function() {
      var self = this;
      self.isTree = true;
      self.store = new TreeStore({
        key: self.nodeKey,
        data: self.data,
        lazy: self.lazy,
        props: self.props,
        load: self.load,
        currentNodeKey: self.currentNodeKey,
        checkStrictly: self.checkStrictly,
        defaultCheckedKeys: self.defaultCheckedKeys,
        defaultExpandedKeys: self.defaultExpandedKeys,
        autoExpandParent: self.autoExpandParent,
        defaultExpandAll: self.defaultExpandAll,
        filterNodeMethod: self.filterNodeMethod
      });
      self.root = self.store.root;
    }
  };
  Vue.component(VueTree.name, VueTree);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueCarousel = definition(context.Vue, context.VueUtil);
    delete context.VueCarousel;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueCarousel = {
    template: '<div :class="[\'vue-carousel\', {\'vue-carousvue--card\': type === \'card\'}]" @mouseenter.stop="handleMouseEnter" @mouseleave.stop="handleMouseLeave" @touchstart.stop="handleTouchStart"><div class="vue-carousel__container" :style="{height: height}"><transition name="carousel-arrow-left"><button type="button" v-if="arrow !== \'never\'" v-show="arrow === \'always\' || hover" @mouseenter="handleButtonEnter(\'left\')" @mouseleave="handleButtonLeave" @click.stop="throttledArrowClick(activeIndex - 1)" class="vue-carousel__arrow vue-carousel__arrow--left"><i class="vue-icon-arrow-left"></i></button></transition><transition name="carousel-arrow-right"><button type="button" v-if="arrow !== \'never\'" v-show="arrow === \'always\' || hover" @mouseenter="handleButtonEnter(\'right\')" @mouseleave="handleButtonLeave" @click.stop="throttledArrowClick(activeIndex + 1)" class="vue-carousel__arrow vue-carousel__arrow--right"><i class="vue-icon-arrow-right"></i></button></transition><slot></slot></div><ul v-if="indicatorPosition !== \'none\'" :class="[\'vue-carousel__indicators\', {\'vue-carousel__indicators--outside\': indicatorPosition === \'outside\' || type === \'card\'}]"><li v-for="(item, index) in items" :class="[\'vue-carousel__indicator\', {\'is-active\': index === activeIndex}]" @mouseenter="throttledIndicatorHover(index)" @click.stop="handleIndicatorClick(index)"><button type="button" class="vue-carousel__button"></button></li></ul></div>',
    name: 'VueCarousel',
    props: {
      initialIndex: {
        type: Number,
        default: 0
      },
      height: String,
      trigger: {
        type: String,
        default: 'hover'
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 3000
      },
      indicatorPosition: String,
      indicator: {
        type: Boolean,
        default: true
      },
      arrow: {
        type: String,
        default: 'hover'
      },
      hoverStop: {
        type: Boolean,
        default: true
      },
      type: String
    },
    data: function() {
      return {
        items: [],
        activeIndex: -1,
        hover: false
      };
    },
    watch: {
      items: function(val) {
        if (val.length > 0)
          this.setActiveItem(0);
      },
      activeIndex: function(val, oldVal) {
        this.resetItemPosition();
        this.$emit('change', val, oldVal);
      }
    },
    methods: {
      handleMouseEnter: function() {
        this.hover = true;
        if (this.hoverStop) this.pauseTimer();
      },
      handleMouseLeave: function() {
        this.hover = false;
        if (this.hoverStop) this.startTimer();
      },
      handleTouchStart: function(e) {
        e.stopImmediatePropagation();
        var tocuhPlace = this.tocuhPlace;
        if (!VueUtil.isDef(tocuhPlace)) {
          tocuhPlace = this.tocuhPlace = {};
        }
        var touches = e.touches[0];
        tocuhPlace.tocuhX = touches.pageX;
        VueUtil.on(document, 'touchmove', this.handleTouchMove);
        VueUtil.on(document, 'touchend', this.handleTouchEnd);
      },
      handleTouchMove: function(e) {
        var touches = e.touches[0];
        var tocuhPlace = this.tocuhPlace;
        tocuhPlace.touchMove = tocuhPlace.tocuhX - touches.pageX;
      },
      handleTouchEnd: function(e) {
        var tocuhPlace = this.tocuhPlace;
        if (tocuhPlace.touchMove > 0) {
          this.throttledArrowClick(this.activeIndex + 1);
        }
        if (tocuhPlace.touchMove < 0) {
          this.throttledArrowClick(this.activeIndex - 1);
        }
        VueUtil.off(document, 'touchmove',this.handleTouchMove);
        VueUtil.off(document, 'touchend', this.handleTouchEnd);
      },
      itemInStage: function(item, index) {
        var length = this.items.length;
        if (index === length - 1 && item.inStage && this.items[0].active || (item.inStage && this.items[index + 1] && this.items[index + 1].active)) {
          return 'left';
        } else if (index === 0 && item.inStage && this.items[length - 1].active || (item.inStage && this.items[index - 1] && this.items[index - 1].active)) {
          return 'right';
        }
        return false;
      },
      handleButtonEnter: function(arrow) {
        var self = this;
        VueUtil.loop(self.items, function(item, index) {
          if (arrow === self.itemInStage(item, index)) {
            item.hover = true;
          }
        });
      },
      handleButtonLeave: function() {
        var self = this;
        VueUtil.loop(self.items, function(item) {
          item.hover = false;
        });
      },
      updateItems: function() {
        this.items = VueUtil.filter(this.$children, function(child) {
          return child.$options.name === 'VueCarouselItem';
        });
      },
      resetItemPosition: function() {
        var self = this;
        VueUtil.loop(self.items, function(item, index) {
          item.translateItem(index, self.activeIndex);
        });
      },
      playSlides: function() {
        if (this.activeIndex < this.items.length - 1) {
          this.activeIndex++;
        } else {
          this.activeIndex = 0;
        }
      },
      pauseTimer: function() {
        clearInterval(this.timer);
      },
      startTimer: function() {
        if (this.interval <= 0 || !this.autoplay) return;
        this.timer = setInterval(this.playSlides, this.interval);
      },
      setActiveItem: function(index) {
        if (VueUtil.isString(index)) {
          var filteredItems = VueUtil.filter(this.items, function(item) {
            return item.name === index;
          });
          if (filteredItems.length > 0) {
            index = this.items.indexOf(filteredItems[0]);
          }
        }
        index = Number(index);
        if (isNaN(index) || index !== Math.floor(index)) {
          return;
        }
        var length = this.items.length;
        if (index < 0) {
          this.activeIndex = length - 1;
        } else if (index >= length) {
          this.activeIndex = 0;
        } else {
          this.activeIndex = index;
        }
      },
      prev: function() {
        this.setActiveItem(this.activeIndex - 1);
      },
      next: function() {
        this.setActiveItem(this.activeIndex + 1);
      },
      handleIndicatorClick: function(index) {
        this.activeIndex = index;
      },
      handleIndicatorHover: function(index) {
        if (this.trigger === 'hover' && index !== this.activeIndex) {
          this.activeIndex = index;
        }
      }
    },
    created: function() {
      var self = this;
      self.timer = null;
      self.throttledArrowClick = function(index) {
        self.setActiveItem(index);
      };
      self.throttledIndicatorHover = function(index) {
        self.handleIndicatorHover(index);
      };
    },
    mounted: function() {
      var self = this;
      self.updateItems();
      self.$nextTick(function() {
        VueUtil.addResizeListener(self.$el, self.resetItemPosition);
        if (self.initialIndex < self.items.length && self.initialIndex >= 0) {
          self.activeIndex = self.initialIndex;
        }
        self.startTimer();
      });
    },
    beforeDestroy: function() {
      this.pauseTimer();
      this.$el && VueUtil.removeResizeListener(this.$el, this.resetItemPosition);
    }
  };
  Vue.component(VueCarousel.name, VueCarousel);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueCarouselItem = definition(context.Vue);
    delete context.VueCarouselItem;
  }
})(this, function(Vue) {
  'use strict';
  var VueCarouselItem = {
    template: '<div v-show="ready" :class="[\'vue-carousel__item\', {\'is-active\': active, \'vue-carousel__item--card\': $parent.type === \'card\', \'is-in-stage\': inStage, \'is-hover\': hover}]" @click="handleItemClick" :style=\'{msTransform: "translateX(" + translate + "px) scale(" + scale + ")", webkitTransform: "translateX(" + translate + "px) scale(" + scale + ")", transform: "translateX(" + translate + "px) scale(" + scale + ")"}\'><div v-if="$parent.type === \'card\'" v-show="!active" class="vue-carousel__mask"></div><slot></slot></div>',
    name: 'VueCarouselItem',
    props: {
      name: String
    },
    data: function() {
      return {
        hover: false,
        translate: 0,
        scale: 1,
        active: false,
        ready: false,
        inStage: false
      };
    },
    methods: {
      processIndex: function(index, activeIndex, length) {
        if (activeIndex === 0 && index === length - 1) {
          return -1;
        } else if (activeIndex === length - 1 && index === 0) {
          return length;
        } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
          return length + 1;
        } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
          return -2;
        }
        return index;
      },
      calculateTranslate: function(index, activeIndex, parentWidth) {
        if (this.inStage) {
          return parentWidth * ((2 - this.cardScale) * (index - activeIndex) + 1) / 4;
        } else if (index < activeIndex) {
          return -(1 + this.cardScale) * parentWidth / 4;
        } else {
          return (3 + this.cardScale) * parentWidth / 4;
        }
      },
      translateItem: function(index, activeIndex) {
        var parentWidth = this.$parent.$el.offsetWidth;
        var length = this.$parent.items.length;
        if (index !== activeIndex && length > 2) {
          index = this.processIndex(index, activeIndex, length);
        }
        if (this.$parent.type === 'card') {
          this.inStage = Math.round(Math.abs(index - activeIndex)) <= 1;
          this.active = index === activeIndex;
          this.translate = this.calculateTranslate(index, activeIndex, parentWidth);
          this.scale = this.active ? 1 : this.cardScale;
        } else {
          this.active = index === activeIndex;
          this.translate = parentWidth * (index - activeIndex);
        }
        this.ready = true;
      },
      handleItemClick: function() {
        var parent = this.$parent;
        if (parent && parent.type === 'card') {
          var index = parent.items.indexOf(this);
          parent.setActiveItem(index);
        }
      }
    },
    created: function() {
      this.$parent && this.$parent.updateItems();
      this.cardScale = 0.83;
    },
    destroyed: function() {
      this.$parent && this.$parent.updateItems();
    }
  };
  Vue.component(VueCarouselItem.name, VueCarouselItem);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueCard = definition(context.Vue);
    delete context.VueCard;
  }
})(this, function(Vue) {
  'use strict';
  var VueCard = {
    template: '<div  :class="[shadow ? \'is-\' + shadow + \'-shadow\' : \'is-hover-shadow\', \'vue-card\']"><div class="vue-card__header" v-if="$slots.header || header"><slot name="header">{{header}}</slot></div><div class="vue-card__body" :style="bodyStyle"><slot></slot></div></div>',
    name: 'VueCard',
    props: {
      header: {},
      bodyStyle: {},
      shadow: String
    }
  };
  Vue.component(VueCard.name, VueCard);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VuePopper'], definition);
  } else {
    context.VuePopover = definition(context.Vue, context.VueUtil, context.VuePopper);
    delete context.VuePopover;
  }
})(this, function(Vue, VueUtil, VuePopper) {
  'use strict';
  var VuePopover = {
    template: '<span><transition @after-leave="destroyPopper"><div :class="[\'vue-popover\', popperClass, {\'no-arrow\': !visibleArrow}]" ref="popper" v-show="!disabled && showPopper" :style="{width: popoverWidth + \'px\' \}"><div class="vue-popover__title" v-if="title" v-text="title"></div><slot>{{content}}</slot></div></transition><slot name="reference"></slot></span>',
    name: 'VuePopover',
    mixins: [VuePopper],
    props: {
      trigger: {
        type: String,
        default: 'click',
        validator: function(value) {
          return ['click', 'focus', 'hover', 'manual'].indexOf(value) !== -1;
        }
      },
      title: String,
      disabled: Boolean,
      content: String,
      reference: {},
      popperClass: String,
      width: [String, Number],
      visibleArrow: {
        type: Boolean,
        default: true
      }
    },
    data: function() {
      return {
        popoverWidth: null
      };
    },
    watch: {
      showPopper: function(newVal, oldVal) {
        if (newVal) {
          this.popoverWidth = this.width;
          if (!this.popoverWidth) {
            var reference = this.reference || this.$refs.reference;
            this.popoverWidth = parseInt(VueUtil.getStyle(reference, 'width'));
          }
          this.$emit('show');
        } else {
          this.$emit('hide');
        }
      }
    },
    methods: {
      bindEvents: function() {
        var self = this;
        var reference = self.reference || self.$refs.reference;
        var popper = self.popper || self.$refs.popper;
        if (!reference && self.$slots.reference && self.$slots.reference[0]) {
          reference = self.referenceElm = self.$slots.reference[0].elm;
        }
        if (self.trigger === 'click') {
          VueUtil.on(reference, 'click', self.doToggle);
          VueUtil.on(document, 'click', self.documentClick);
        } else if (self.trigger === 'hover') {
          VueUtil.on(reference, 'mouseenter', self.mouseEnter);
          VueUtil.on(popper, 'mouseenter', self.mouseEnter);
          VueUtil.on(reference, 'mouseleave', self.mouseLeave);
          VueUtil.on(popper, 'mouseleave', self.mouseLeave);
        } else if (self.trigger === 'focus') {
          var found = false;
          if ([].slice.call(reference.children).length) {
            VueUtil.loop(reference.childNodes, function(child) {
              if (child.nodeName === 'INPUT' || child.nodeName === 'TEXTAREA') {
                VueUtil.on(child, 'focus', self.doShow);
                VueUtil.on(child, 'blur', self.doClose);
                found = true;
                return false;
              }
            });
          }
          if (found) return;
          if (reference.nodeName === 'INPUT' || reference.nodeName === 'TEXTAREA') {
            VueUtil.on(reference, 'focus', self.doShow);
            VueUtil.on(reference, 'blur', self.doClose);
          } else {
            VueUtil.on(reference, 'mousedown', self.doShow);
            VueUtil.on(reference, 'mouseup', self.doClose);
          }
        }
      },
      unBindEvents: function() {
        var self = this;
        var reference = self.reference || self.$refs.reference;
        var popper = self.popper || self.$refs.popper;
        if (!reference && self.$slots.reference && self.$slots.reference[0]) {
          reference = self.referenceElm = self.$slots.reference[0].elm;
        }
        if (self.trigger === 'click') {
          VueUtil.off(reference, 'click', self.doToggle);
          VueUtil.off(document, 'click', self.documentClick);
        } else if (self.trigger === 'hover') {
          VueUtil.off(reference, 'mouseenter', self.mouseEnter);
          VueUtil.off(popper, 'mouseenter', self.mouseEnter);
          VueUtil.off(reference, 'mouseleave', self.mouseLeave);
          VueUtil.off(popper, 'mouseleave', self.mouseLeave);
        } else if (self.trigger === 'focus') {
          var found = false;
          if ([].slice.call(reference.children).length) {
            VueUtil.loop(reference.childNodes, function(child) {
              if (child.nodeName === 'INPUT' || child.nodeName === 'TEXTAREA') {
                VueUtil.off(child, 'focus', self.doShow);
                VueUtil.off(child, 'blur', self.doClose);
                found = true;
                return false;
              }
            });
          }
          if (found) return;
          if (reference.nodeName === 'INPUT' || reference.nodeName === 'TEXTAREA') {
            VueUtil.off(reference, 'focus', self.doShow);
            VueUtil.off(reference, 'blur', self.doClose);
          } else {
            VueUtil.off(reference, 'mousedown', self.doShow);
            VueUtil.off(reference, 'mouseup', self.doClose);
          }
        }
      },
      doToggle: function() {
        this.showPopper = !this.showPopper;
      },
      doShow: function() {
        this.showPopper = true;
      },
      doClose: function() {
        this.showPopper = false;
      },
      mouseToggle: VueUtil.debounce(300, function(showPopper) {
        this.showPopper = showPopper;
      }),
      mouseEnter: function() {
        this.mouseToggle(true);
      },
      mouseLeave: function() {
        this.mouseToggle(false);
      },
      documentClick: function(e) {
        var reference = this.reference || this.$refs.reference;
        var popper = this.popper || this.$refs.popper;
        if (!reference && this.$slots.reference && this.$slots.reference[0]) {
          reference = this.referenceElm = this.$slots.reference[0].elm;
        }
        if (!this.$el || !reference || this.$el.contains(e.target) || reference.contains(e.target) || !popper || popper.contains(e.target))
          return;
        this.showPopper = false;
      }
    },
    mounted: function() {
      this.bindEvents();
    },
    destroyed: function() {
      this.unBindEvents();
    }
  };
  var directive = function(el, binding, vnode) {
    vnode.context.$refs[binding.arg].$refs.reference = el;
  };
  Vue.directive('popover', directive);
  VuePopover.directive = directive;
  Vue.component(VuePopover.name, VuePopover);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePopper', 'VueUtil'], definition);
  } else {
    context.VueCascader = definition(context.Vue, context.VuePopper, context.VueUtil);
    delete context.VueCascader;
  }
})(this, function(Vue, VuePopper, VueUtil) {
  'use strict';
  var VueCascaderMenu = {
    name: 'VueCascaderMenu',
    data: function() {
      return {
        inputWidth: 0,
        options: [],
        props: {},
        visible: false,
        activeValue: [],
        value: [],
        expandTrigger: 'click',
        changeOnSelect: false,
        popperClass: ''
      };
    },
    watch: {
      visible: function(value) {
        if (value) {
          this.activeValue = this.value;
        }
      },
      value: {
        immediate: true,
        handler: function(value) {
          this.activeValue = value;
        }
      }
    },
    computed: {
      activeOptions: {
        cache: false,
        get: function() {
          var self = this;
          var activeValue = self.activeValue;
          var configurableProps = ['label', 'value', 'children', 'disabled'];
          var formatOptions = function(options) {
            VueUtil.loop(options, function(option) {
              if (option.__IS__FLAT__OPTIONS) return;
              VueUtil.loop(configurableProps, function(prop) {
                var value = option[self.props[prop] || prop];
                if (value)
                  option[prop] = value;
              });
              if (VueUtil.isArray(option.children)) {
                formatOptions(option.children);
              }
            });
          };
          var loadActiveOptions = function(options, activeOptions) {
            options = options || [];
            activeOptions = activeOptions || [];
            var level = activeOptions.length;
            activeOptions[level] = options;
            var active = activeValue[level];
            if (active) {
              options = VueUtil.filter(options, function(option) {
                return option.value === active;
              })[0];
              if (options && options.children) {
                loadActiveOptions(options.children, activeOptions);
              }
            }
            return activeOptions;
          };
          formatOptions(self.options);
          return loadActiveOptions(self.options);
        }
      }
    },
    methods: {
      select: function(item, menuIndex) {
        if (item.__IS__FLAT__OPTIONS) {
          this.activeValue = item.value;
        } else if (menuIndex) {
          this.activeValue.splice(menuIndex, this.activeValue.length - 1, item.value);
        } else {
          this.activeValue = [item.value];
        }
        this.$emit('pick', this.activeValue);
      },
      handleMenuLeave: function() {
        this.$emit('menuLeave');
      },
      activeItem: function(item, menuIndex) {
        var len = this.activeOptions.length;
        this.activeValue.splice(menuIndex, len, item.value);
        this.activeOptions.splice(menuIndex + 1, len, item.children);
        if (this.changeOnSelect) {
          this.$emit('pick', this.activeValue, false);
        } else {
          this.$emit('activeItemChange', this.activeValue);
        }
      }
    },
    render: function(createElement) {
      var self = this;
      var activeValue = self.activeValue
        , activeOptions = self.activeOptions
        , visible = self.visible
        , expandTrigger = self.expandTrigger
        , popperClass = self.popperClass;
      var menus = self._l(activeOptions, function(menu, menuIndex) {
        var isFlat = false;
        var items = self._l(menu, function(item, itemIndex) {
          var events = {
            on: {}
          };
          if (item.__IS__FLAT__OPTIONS)
            isFlat = true;
          if (!item.disabled) {
            if (item.children) {
              var triggerEvent = {
                click: 'click',
                hover: 'mouseenter'
              }[expandTrigger];
              events.on[triggerEvent] = function() {
                self.activeItem(item, menuIndex);
              };
            } else {
              events.on.click = function() {
                self.select(item, menuIndex);
              };
            }
          }
          return createElement('li', {
            key: itemIndex,
            class: {
              'vue-cascader-menu__item': !0,
              'vue-cascader-menu__item--extensible': item.children,
              'is-active': item.value === activeValue[menuIndex],
              'is-disabled': item.disabled
            },
            on: events.on
          }, [item.label]);
        });
        var menuStyle = {};
        if (isFlat) {
          menuStyle.minWidth = self.inputWidth + 'px';
        }
        return createElement('ul', {
          key: menuIndex,
          class: {
            'vue-cascader-menu': true,
            'vue-cascader-menu--flexible': isFlat
          },
          style: menuStyle
        }, [items]);
      });
      return createElement('transition', {
        on: {
          'after-leave': self.handleMenuLeave
        }
      }, [createElement('div', {
        directives: [{
          name: 'show',
          value: visible
        }],
        class: ['vue-cascader-menus', popperClass]
      }, [menus])]);
    }
  };
  var popperMixin = {
    props: {
      placement: {
        type: String,
        default: 'bottom-start'
      },
      offset: VuePopper.props.offset,
      popperOptions: VuePopper.props.options
    },
    methods: VuePopper.methods,
    data: VuePopper.data,
    beforeDestroy: VuePopper.beforeDestroy
  };
  var VueCascader = {
    template: '<span :class="[\'vue-cascader\', {\'is-opened\': menuVisible, \'is-disabled\': disabled},size ? \'vue-cascader--\' + size : \'\']" @click="handleClick" @mouseenter="inputHover = true" @mouseleave="inputHover = false" ref="reference" v-clickoutside="handleClickoutside"><vue-input :text-align="textAlign" ref="input" :autofocus="autofocus" :tabindex="tabindex" :readonly="!filterable" :placeholder="currentLabels.length ? \'\' : placeholderLang" v-model="inputValue" @change="debouncedInputChange" :validate-event="false" :size="size" :disabled="disabled"><template slot="icon"><i key="1" v-if="clearable && inputHover && currentLabels.length" class="vue-input__icon vue-icon-error vue-cascader__clearIcon" @click="clearValue"></i><i key="2" v-else :class="[\'vue-input__icon vue-icon-arrow-up\', {\'is-reverse\': menuVisible}]"></i></template></vue-input><span class="vue-cascader__label" v-show="inputValue === \'\'"><template v-if="showAllLevels"><template v-for="(label, index) in currentLabels">{{label}}<span v-if="index < currentLabels.length - 1"> / </span></template></template><template v-else>{{currentLabels[currentLabels.length - 1]}}</template></span></span>',
    name: 'VueCascader',
    directives: {
      Clickoutside: VueUtil.component.clickoutside()
    },
    mixins: [popperMixin, VueUtil.component.emitter],
    props: {
      options: {
        type: Array,
        required: true
      },
      props: {
        type: Object,
        default: function() {
          return {
            children: 'children',
            label: 'label',
            value: 'value',
            disabled: 'disabled'
          };
        }
      },
      value: {
        type: Array,
        default: function() {
          return [];
        }
      },
      placeholder: String,
      disabled: Boolean,
      clearable: Boolean,
      changeOnSelect: Boolean,
      popperClass: String,
      expandTrigger: {
        type: String,
        default: 'click'
      },
      filterable: Boolean,
      size: String,
      autofocus: Boolean,
      textAlign: String,
      tabindex: Number,
      showAllLevels: {
        type: Boolean,
        default: true
      }
    },
    data: function() {
      return {
        currentValue: this.value,
        menu: null,
        menuVisible: false,
        inputHover: false,
        inputValue: '',
        flatOptions: null
      };
    },
    computed: {
      placeholderLang: function() {
        if (!this.placeholder)
          return this.$t('vue.cascader.placeholder');
        return this.placeholder;
      },
      labelKey: function() {
        return this.props.label || 'label';
      },
      valueKey: function() {
        return this.props.value || 'value';
      },
      childrenKey: function() {
        return this.props.children || 'children';
      },
      currentLabels: function() {
        var self = this;
        var options = self.options || [];
        var labels = [];
        VueUtil.loop(self.currentValue, function(value) {
          var targetOption = VueUtil.filter(options, function(option) {
            return option[self.valueKey] === value;
          })[0];
          if (targetOption) {
            labels.push(targetOption[self.labelKey]);
            options = targetOption[self.childrenKey];
          }
        });
        return labels;
      }
    },
    watch: {
      menuVisible: function(value) {
        value ? this.showMenu() : this.hideMenu();
      },
      value: function(value) {
        this.currentValue = value;
      },
      currentValue: function(value) {
        this.dispatch('VueFormItem', 'vue.form.change', [value]);
      },
      options: {
        deep: true,
        handler: function(value) {
          if (!this.menu) {
            this.initMenu();
          }
          this.flatOptions = this.flattenOptions(this.options);
          this.menu.options = value;
        }
      }
    },
    methods: {
      focus: function() {
        this.$refs.input.focus();
      },
      initMenu: function() {
        this.menu = new Vue(VueCascaderMenu).$mount();
        this.menu.options = this.options;
        this.menu.props = this.props;
        this.menu.expandTrigger = this.expandTrigger;
        this.menu.changeOnSelect = this.changeOnSelect;
        this.menu.popperClass = this.popperClass;
        this.popperElm = this.menu.$el;
        this.menu.$on('pick', this.handlePick);
        this.menu.$on('activeItemChange', this.handleActiveItemChange);
        this.menu.$on('menuLeave', this.destroyPopper);
      },
      showMenu: function() {
        var self = this;
        if (!self.menu) {
          self.initMenu();
        }
        self.menu.value = VueUtil.mergeArray([], self.currentValue);
        self.menu.visible = true;
        self.menu.options = self.options;
        self.$nextTick(function() {
          self.updatePopper();
          self.menu.inputWidth = self.$refs.input.$el.offsetWidth - 2;
        });
      },
      hideMenu: function() {
        this.inputValue = '';
        this.menu.visible = false;
      },
      handleActiveItemChange: function(value) {
        var self = this;
        self.$nextTick(function() {
          self.updatePopper();
        });
        self.$emit('active-item-change', value);
      },
      handlePick: function(value, close) {
        if (!VueUtil.isDef(close)) close = true;
        this.currentValue = value;
        this.$emit('input', value);
        this.$emit('change', value);
        if (close) {
          this.menuVisible = false;
        }
        this.$nextTick(this.focus);
      },
      handleInputChange: function(value) {
        var self = this;
        if (!self.menuVisible)
          return;
        var flatOptions = self.flatOptions;
        if (!value) {
          self.menu.options = self.options;
          return;
        }
        var filteredFlatOptions = VueUtil.filter(flatOptions, function(optionsStack) {
          return optionsStack.some(function(option) {
            return new RegExp(value, 'i').test(option[self.labelKey]);
          });
        });
        if (filteredFlatOptions.length > 0) {
          filteredFlatOptions = VueUtil.map(filteredFlatOptions, function(optionStack) {
            return {
              __IS__FLAT__OPTIONS: true,
              value:  VueUtil.map(optionStack, function(item) {
                return item[self.valueKey];
              }),
              label: self.renderFilteredOptionLabel(value, optionStack)
            };
          });
        } else {
          filteredFlatOptions = [{
            __IS__FLAT__OPTIONS: true,
            label: self.$t('vue.cascader.noMatch'),
            value: '',
            disabled: true
          }];
        }
        self.menu.options = filteredFlatOptions;
      },
      renderFilteredOptionLabel: function(inputValue, optionsStack) {
        var self = this;
        return  VueUtil.map(optionsStack, function(option, index) {
          var label = option[self.labelKey];
          var keywordIndex = label.toLowerCase().indexOf(inputValue.toLowerCase());
          var labelPart = label.slice(keywordIndex, inputValue.length + keywordIndex);
          var node = keywordIndex !== -1 ? self.highlightKeyword(label, labelPart) : label;
          return index === 0 ? node : [' / ', node];
        });
      },
      highlightKeyword: function(label, keyword) {
        var self = this;
        var h = self._c;
        return  VueUtil.map(label.split(keyword), function(node, index) {
          return index === 0 ? node : [h('span', {
            class: {
              'vue-cascader-menu__item__keyword': true
            }
          }, [self._v(keyword)]), node];
        });
      },
      flattenOptions: function(options, ancestor) {
        options = options || [];
        ancestor = ancestor || [];
        var self = this;
        var flatOptions = [];
        VueUtil.loop(options, function(option) {
          var optionsStack = VueUtil.mergeArray(ancestor, option);
          if (!option[self.childrenKey]) {
            flatOptions.push(optionsStack);
          } else {
            if (self.changeOnSelect) {
              flatOptions.push(optionsStack);
            }
            VueUtil.mergeArray(flatOptions, self.flattenOptions(option[self.childrenKey], optionsStack));
          }
        });
        return flatOptions;
      },
      clearValue: function(ev) {
        ev.stopPropagation();
        this.handlePick([], true);
      },
      handleClickoutside: function() {
        this.menuVisible = false;
      },
      handleClick: function() {
        if (this.disabled)
          return;
        if (this.filterable) {
          this.menuVisible = true;
          return;
        }
        this.menuVisible = !this.menuVisible;
      },
      debouncedInputChange: VueUtil.debounce(function(value) {
        this.handleInputChange(value);
      })
    },
    mounted: function() {
      this.flatOptions = this.flattenOptions(this.options);
    },
    beforeDestroy: function() {
      if (this.menu) {
        this.menu.$destroy();
      }
    }
  };
  Vue.component(VueCascader.name, VueCascader);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueStep = definition(context.Vue, context.VueUtil);
    delete context.VueStep;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueStep = {
    template: '<div :style="[style, isLast ? \'\' : {marginRight: - $parent.stepOffset + \'px\'}]" :class="[\'vue-step\', \'is-\' + $parent.direction]"><div :class="[\'vue-step__head\', \'is-\' + currentStatus, {\'is-text\': !icon}]"><div :style="isLast ? \'\' : {marginRight: $parent.stepOffset + \'px\'}" :class="[\'vue-step__line\', \'is-\' + $parent.direction, {\'is-icon\': icon}]"><i class="vue-step__line-inner" :style="lineStyle"></i></div><span class="vue-step__icon"><slot v-if="currentStatus !== \'success\' && currentStatus !== \'error\'" name="icon"><i v-if="icon" :class="icon"></i><div v-else>{{index + 1}}</div></slot><i v-else :class="[\'vue-icon-\' + (currentStatus === \'success\' ? \'check\' : \'close\')]"></i></span></div><div class="vue-step__main" :style="{marginLeft: mainOffset}"><div ref="title" :class="[\'vue-step__title\', \'is-\' + currentStatus]"><slot name="title">{{title}}</slot></div><div :class="[\'vue-step__description\', \'is-\' + currentStatus]"><slot></slot></div></div></div>',
    name: 'VueStep',
    props: {
      title: String,
      icon: String,
      status: String
    },
    data: function() {
      return {
        index: -1,
        lineStyle: {},
        mainOffset: 0,
        internalStatus: ''
      };
    },
    beforeCreate: function() {
      this.$parent.steps.push(this);
    },
    computed: {
      currentStatus: function() {
        return this.status || this.internalStatus;
      },
      isLast: function() {
        var parent = this.$parent;
        return parent.steps[parent.steps.length - 1] === this;
      },
      style: function() {
        var parent = this.$parent;
        var isCenter = parent.center;
        var len = parent.steps.length;
        if (isCenter && this.isLast) {
          return {};
        }
        var space = (VueUtil.isNumber(parent.space) ? parent.space + 'px' : parent.space ? parent.space : 100 / (isCenter ? len - 1 : len) + '%');
        if (parent.direction === 'horizontal') {
          return {
            width: space
          };
        } else {
          if (!this.isLast) {
            return {
              height: space
            };
          }
        }
      }
    },
    methods: {
      updateStatus: function(val) {
        var prevChild = this.$parent.$children[this.index - 1];
        if (val > this.index) {
          this.internalStatus = this.$parent.finishStatus;
        } else if (val === this.index) {
          this.internalStatus = this.$parent.processStatus;
        } else {
          this.internalStatus = 'wait';
        }
        if (prevChild)
          prevChild.calcProgress(this.internalStatus);
      },
      calcProgress: function(status) {
        var step = 100;
        var style = {};
        style.transitionDelay = 150 * this.index + 'ms';
        if (status === this.$parent.processStatus) {
          step = 50;
        } else if (status === 'wait') {
          step = 0;
          style.transitionDelay = (-150 * this.index) + 'ms';
        }
        style.borderWidth = step ? '1px' : 0;
        this.$parent.direction === 'vertical' ? style.height = step + '%' : style.width = step + '%';
        this.lineStyle = style;
      }
    },
    mounted: function() {
      var self = this;
      var parent = self.$parent;
      if (parent.direction === 'horizontal') {
        if (parent.alignCenter) {
          self.mainOffset = -self.$refs.title.getBoundingClientRect().width / 2 + 16 + 'px';
        }
      }
      var unwatch = self.$watch('index', function(val) {
        self.$watch('$parent.active', self.updateStatus, {
          immediate: true
        });
        unwatch();
      });

      self.$watch('$parent.alignCenter', function(value) {
        if(value) {
            self.mainOffset = -self.$refs.title.getBoundingClientRect().width / 2 + 16 + 'px';
        } else {
            self.mainOffset = 0;
        }
      });
    }
  };
  Vue.component(VueStep.name, VueStep);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueSteps = definition(context.Vue, context.VueUtil);
    delete context.VueSteps;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueSteps = {
    template: '<div :class="[\'vue-steps\', \'is-\' + direction, center ? \'is-center\' : \'\']"><slot></slot></div>',
    name: 'VueSteps',
    props: {
      space: [Number, String],
      active: Number,
      direction: {
        type: String,
        default: 'horizontal'
      },
      alignCenter: Boolean,
      center: Boolean,
      finishStatus: {
        type: String,
        default: 'finish'
      },
      processStatus: {
        type: String,
        default: 'process'
      }
    },
    data: function() {
      return {
        steps: [],
        stepOffset: 0
      };
    },
    watch: {
      active: function(newVal, oldVal) {
        this.$emit('change', newVal, oldVal);
      },
      steps: function(steps) {
        var self = this;
        VueUtil.loop(steps, function(child, index) {
          child.index = index;
        });
        if (self.center) {
          var len = steps.length;
          self.$nextTick(function() {
            self.stepOffset = steps[len - 1].$el.getBoundingClientRect().width / (len - 1);
          });
        }
      }
    }
  };
  Vue.component(VueSteps.name, VueSteps);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueDropdown = definition(context.Vue, context.VueUtil);
    delete context.VueDropdown;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueDropdown = {
    template: '',
    name: 'VueDropdown',
    mixins: [VueUtil.component.emitter],
    directives: {
      Clickoutside: VueUtil.component.clickoutside()
    },
    props: {
      trigger: {
        type: String,
        default: 'hover'
      },
      menuAlign: {
        type: String,
        default: 'end'
      },
      type: String,
      size: String,
      splitButton: Boolean,
      hideOnClick: {
        type: Boolean,
        default: true
      }
    },
    data: function() {
      return {
        visible: false
      };
    },
    beforeDestroy: function() {
      this.unBindEvents();
    },
    mounted: function() {
      this.$on('menu-item-click', this.handleMenuItemClick);
      this.bindEvents();
    },
    watch: {
      visible: function(val) {
        this.broadcast('VueDropdownMenu', 'visible', val);
        this.$emit('visible-change', val);
      }
    },
    methods: {
      toggle: VueUtil.debounce(300, function(visible) {
        this.visible = visible;
      }),
      show: function() {
        this.toggle(true);
      },
      hide: function() {
        this.toggle(false);
      },
      handleClick: function() {
        this.visible = !this.visible;
      },
      bindEvents: function() {
        var trigger = this.trigger;
        var show = this.show;
        var hide = this.hide;
        var handleClick = this.handleClick;
        var splitButton = this.splitButton;
        var triggerElm = splitButton ? this.$refs.trigger.$el : this.$slots.default[0].elm;
        if (trigger === 'hover') {
          VueUtil.on(triggerElm, 'mouseenter', show);
          VueUtil.on(triggerElm, 'mouseleave', hide);
          var dropdownElm = this.$slots.dropdown[0].elm;
          VueUtil.on(dropdownElm, 'mouseenter', show);
          VueUtil.on(dropdownElm, 'mouseleave', hide);
        } else if (trigger === 'click') {
          VueUtil.on(triggerElm, 'click', handleClick);
        }
      },
      unBindEvents: function() {
        var trigger = this.trigger;
        var show = this.show;
        var hide = this.hide;
        var handleClick = this.handleClick;
        var splitButton = this.splitButton;
        var triggerElm = splitButton ? this.$refs.trigger.$el : this.$slots.default[0].elm;
        if (trigger === 'hover') {
          VueUtil.off(triggerElm, 'mouseenter', show);
          VueUtil.off(triggerElm, 'mouseleave', hide);
          var dropdownElm = this.$slots.dropdown[0].elm;
          VueUtil.off(dropdownElm, 'mouseenter', show);
          VueUtil.off(dropdownElm, 'mouseleave', hide);
        } else if (trigger === 'click') {
          VueUtil.off(triggerElm, 'click', handleClick);
        }
        
      },
      handleMenuItemClick: function(command, instance) {
        if (this.hideOnClick) {
          this.visible = false;
        }
        this.$emit('command', command, instance);
      }
    },
    render: function(createElement) {
      var self = this;
      var hide = self.hide
        , splitButton = self.splitButton
        , type = self.type
        , size = self.size;
      var handleClick = function() {
        self.$emit('click');
      };
      var triggerElm = !splitButton ? self.$slots.default : createElement('vue-button-group', null, [createElement('vue-button', {
        attrs: {
          type: type,
          size: size
        },
        nativeOn: {
          click: handleClick
        }
      }, [self.$slots.default]), createElement('vue-button', {
        ref: 'trigger',
        attrs: {
          type: type,
          size: size
        },
        class: 'vue-dropdown__caret-button'
      }, [createElement('i', {
        class: 'vue-dropdown__icon vue-icon-arrow-down'
      }, [])])]);
      return createElement('div', {
        class: 'vue-dropdown',
        directives: [{
          name: 'clickoutside',
          value: hide
        }]
      }, [triggerElm, self.$slots.dropdown]);
    }
  };
  Vue.component(VueDropdown.name, VueDropdown);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueDropdownItem = definition(context.Vue, context.VueUtil);
    delete context.VueDropdownItem;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueDropdownItem = {
    template: '<li :class="[\'vue-dropdown-menu__item\', {\'is-disabled\': disabled, \'vue-dropdown-menu__item--divided\': divided}]" @click="handleClick"><slot></slot></li>',
    name: 'VueDropdownItem',
    mixins: [VueUtil.component.emitter],
    props: {
      command: String,
      disabled: Boolean,
      divided: Boolean
    },
    methods: {
      handleClick: function(e) {
        this.dispatch('VueDropdown', 'menu-item-click', [this.command, this]);
      }
    }
  };
  Vue.component(VueDropdownItem.name, VueDropdownItem);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePopper'], definition);
  } else {
    context.VueDropdownMenu = definition(context.Vue, context.VuePopper);
    delete context.VueDropdownMenu;
  }
})(this, function(Vue, VuePopper) {
  'use strict';
  var VueDropdownMenu = {
    template: '<transition @after-leave="destroyPopper"><div class="vue-dropdown-menu" v-show="showPopper"><ul class="vue-dropdown-menu__view"><slot></slot></ul></div></transition>',
    name: 'VueDropdownMenu',
    mixins: [VuePopper],
    created: function() {
      var self = this;
      self.$on('updatePopper', self.updatePopper);
      self.$on('visible', function(val) {
        self.showPopper = val;
      });
    },
    mounted: function() {
      this.$parent.popperElm = this.popperElm = this.$el;
      this.referenceElm = this.$parent.$el;
    },
    watch: {
      '$parent.menuAlign': {
        immediate: true,
        handler: function(val) {
          this.currentPlacement = 'bottom-' + val;
        }
      }
    }
  };
  Vue.component(VueDropdownMenu.name, VueDropdownMenu);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueCollapse = definition(context.Vue, context.VueUtil);
    delete context.VueCollapse;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueCollapse = {
    template: '<div class="vue-collapse"><slot></slot></div>',
    name: 'VueCollapse',
    props: {
      accordion: Boolean,
      value: {
        type: [Array, String, Number],
        default: function() {
          return [];
        }
      },
      expandOnClickHeader: {
        type: Boolean,
        default: true
      }
    },
    data: function() {
      return {
        activeNames: VueUtil.mergeArray([], this.value)
      };
    },
    watch: {
      value: function(value) {
        this.activeNames = VueUtil.mergeArray([], value);
      }
    },
    methods: {
      setActiveNames: function(activeNames) {
        activeNames = VueUtil.mergeArray([], activeNames);
        var value = this.accordion ? activeNames[0] : activeNames;
        this.activeNames = activeNames;
        this.$emit('input', value);
      },
      handleItemClick: function(item) {
        if (this.accordion) {
          this.setActiveNames(
            this.activeNames[0] &&
              this.activeNames[0] === item.name
              ? '' : item.name
          );
        } else {
          var activeNames = VueUtil.mergeArray([], this.activeNames);
          var index = activeNames.indexOf(item.name);
          if (index !== -1) {
            activeNames.splice(index, 1);
          } else {
            activeNames.push(item.name);
          }
          this.setActiveNames(activeNames);
        }
      }
    },
    created: function() {
      this.$on('item-click', this.handleItemClick);
    }
  };
  Vue.component(VueCollapse.name, VueCollapse);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueCollapseItem = definition(context.Vue, context.VueUtil);
    delete context.VueCollapseItem;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueCollapseItem = {
    template: '<div :class="[\'vue-collapse-item\', {\'is-active\': isActive}]"><div :class="[\'vue-collapse-item__header\', {\'header-expand\': headerExpand}]" @click="handleHeaderClick"><i class="vue-collapse-item__header__arrow vue-icon-arrow-right" @click="handleIconClick" v-show="expandOnClick"></i><slot name="title">{{title}}</slot></div><collapse-transition><div class="vue-collapse-item__wrap" v-show="isActive"><div class="vue-collapse-item__content"><slot></slot></div></div></collapse-transition></div>',
    name: 'VueCollapseItem',
    mixins: [VueUtil.component.emitter],
    components: {
      CollapseTransition: VueUtil.component.collapseTransition
    },
    data: function() {
      return {
        contentWrapStyle: {
          height: 'auto',
          display: 'block'
        },
        contentHeight: 0
      };
    },
    props: {
      title: String,
      expandOnClick: {
        type: Boolean,
        default: true
      },
      name: {
        type: [String, Number],
        default: function() {
          return this._uid;
        }
      }
    },
    computed: {
      isActive: function() {
        return this.$parent.activeNames.indexOf(this.name) !== -1;
      },
      headerExpand: function() {
        return this.$parent.expandOnClickHeader;
      }
    },
    methods: {
      handleIconClick: function() {
        if (!this.headerExpand && this.expandOnClick) {
          this.dispatch('VueCollapse', 'item-click', this);
        }
      },
      handleHeaderClick: function() {
        if (this.headerExpand && this.expandOnClick) {
          this.dispatch('VueCollapse', 'item-click', this);
        }
      },
      collapseAfterEnter: function() {
        this.$parent.$emit('change', this.$parent.activeNames);
      },
      collapseAfterLeave: function() {
        this.$parent.$emit('change', this.$parent.activeNames);
      }
    }
  };
  Vue.component(VueCollapseItem.name, VueCollapseItem);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueBadge = definition(context.Vue, context.VueUtil);
    delete context.VueBadge;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueBadge = {
    template: '<div class="vue-badge"><slot></slot><sup v-show="!hidden && ( content || isDot )" v-text="content" :class="[\'vue-badge__content\', {\'is-fixed\': $slots.default, \'is-dot\': isDot }]"></sup></div>',
    name: 'VueBadge',
    props: {
      value: {},
      max: Number,
      isDot: Boolean,
      hidden: Boolean
    },
    computed: {
      content: function() {
        if (this.isDot) return;
        var value = this.value;
        var max = this.max;
        if (VueUtil.isNumber(value) && VueUtil.isNumber(max)) {
          return max < value ? max + '+' : value;
        }
        return value;
      }
    }
  };
  Vue.component(VueBadge.name, VueBadge);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueBreadcrumb = definition(context.Vue);
    delete context.VueBreadcrumb;
  }
})(this, function(Vue) {
  'use strict';
  var VueBreadcrumb = {
    template: '<div class="vue-breadcrumb"><slot></slot></div>',
    name: 'VueBreadcrumb',
    props: {
      separator: {
        type: String,
        default: '/'
      }
    }
  };
  Vue.component(VueBreadcrumb.name, VueBreadcrumb);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueBreadcrumbItem = definition(context.Vue, context.VueUtil);
    delete context.VueBreadcrumbItem;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueBreadcrumbItem = {
    template: '<span class="vue-breadcrumb__item"><span class="vue-breadcrumb__item__inner" ref="link"><slot></slot></span><span class="vue-breadcrumb__separator">{{$parent.separator}}</span></span>',
    name: 'VueBreadcrumbItem',
    props: {
      to: {},
      replace: Boolean
    },
    methods: {
      linkToDo: function() {
        var to = this.to;
        if (to && this.$router) {
          this.replace ? this.$router.replace(to) : this.$router.push(to);
        } else {
          this.$emit('click');
        }
      }
    },
    mounted: function() {
      VueUtil.on(this.$refs.link, 'click', this.linkToDo);
    },
    beforeDestroy: function() {
      VueUtil.off(this.$refs.link, 'click', this.linkToDo);
    }
  };
  Vue.component(VueBreadcrumbItem.name, VueBreadcrumbItem);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VuePopper'], definition);
  } else {
    context.VuePicker = definition(context.Vue, context.VueUtil, context.VuePopper);
  }
})(this, function(Vue, VueUtil, VuePopper) {
  'use strict';
  var NewPopper = {
    props: {
      appendToBody: VuePopper.props.appendToBody,
      offset: VuePopper.props.offset,
      boundariesPadding: VuePopper.props.boundariesPadding,
      autoWidth:VuePopper.props.autoWidth
    },
    methods: VuePopper.methods,
    data: VuePopper.data,
    beforeDestroy: VuePopper.beforeDestroy
  };
  var DEFAULT_FORMATS = {
    date: 'yyyy-MM-dd',
    month: 'yyyy-MM',
    datetime: 'yyyy-MM-dd HH:mm:ss',
    time: 'HH:mm:ss',
    timerange: 'HH:mm:ss',
    week: 'yyyywWW',
    daterange: 'yyyy-MM-dd',
    datetimerange: 'yyyy-MM-dd HH:mm:ss',
    year: 'yyyy'
  };
  var HAVE_TRIGGER_TYPES = ['date', 'datetime', 'time', 'time-select', 'week', 'month', 'year', 'daterange', 'timerange', 'datetimerange'];
  var DATE_FORMATTER = function(value, format) {
    return VueUtil.formatDate(value, format);
  };
  var DATE_PARSER = function(text, format) {
    return VueUtil.parseDate(text, format);
  };
  var RANGE_FORMATTER = function(value, format, separator) {
    if (VueUtil.isArray(value) && value.length === 2) {
      var start = value[0];
      var end = value[1];
      if (start && end) {
        return VueUtil.formatDate(start, format) + separator + VueUtil.formatDate(end, format);
      }
    }
    return '';
  };
  var RANGE_PARSER = function(text, format, separator) {
    var array = text.split(separator);
    if (array.length === 2) {
      var range1 = array[0];
      var range2 = array[1];
      return [VueUtil.parseDate(range1, format), VueUtil.parseDate(range2, format)];
    }
    return [];
  };
  var TYPE_VALUE_RESOLVER_MAP = {
    default: {
      formatter: function(value) {
        if (!value)
          return '';
        return '' + value;
      },
      parser: function(text) {
        if (!VueUtil.isDef(text) || text === '') return null;
        return text;
      }
    },
    week: {
      formatter: function(value, format) {
        var date = VueUtil.formatDate(value, format);
        var week = VueUtil.getWeekNumber(value);
        date = /WW/.test(date) ? date.replace(/WW/, week < 10 ? '0' + week : week) : date.replace(/W/, week);
        return date;
      },
      parser: function(text) {
        var array = (text || '').split('w');
        if (array.length === 2) {
          var year = Number(array[0]);
          var month = Number(array[1]);
          if (!isNaN(year) && !isNaN(month) && month < 54) {
            return text;
          }
        }
        return null;
      }
    },
    date: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    datetime: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    daterange: {
      formatter: RANGE_FORMATTER,
      parser: RANGE_PARSER
    },
    datetimerange: {
      formatter: RANGE_FORMATTER,
      parser: RANGE_PARSER
    },
    timerange: {
      formatter: RANGE_FORMATTER,
      parser: RANGE_PARSER
    },
    time: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    month: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    year: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    number: {
      formatter: function(value) {
        if (!value)
          return '';
        return '' + value;
      },
      parser: function(text) {
        var result = Number(text);
        if (!isNaN(text)) {
          return result;
        } else {
          return null;
        }
      }
    }
  };
  var VuePicker = {
    template: '<vue-input :class="[\'vue-date-editor\', \'vue-date-editor--\' + type]" :readonly="readonly" :text-align="textAlign" :autofocus="autofocus" :tabindex="tabindex" :disabled="disabled" :size="size" v-clickoutside="handleClose" :placeholder="placeholder" @mousedown.native="handleMouseDown" @blur="handleBlur" @keydown.native="handleKeydown" :value="displayValue" @change.native="displayValue = $event.target.value" :validateEvent="false" ref="reference"><i slot="icon" @click="handleClickIcon" :class="[\'vue-input__icon\', showClose ? \'vue-icon-close\' : triggerClass]" @mouseenter="handleMouseEnterIcon" @mouseleave="showClose = false" v-if="haveTrigger"></i></vue-input>',
    mixins: [VueUtil.component.emitter, NewPopper],
    props: {
      size: String,
      format: String,
      readonly: {
        type: Boolean,
        default: true
      },
      placeholder: String,
      disabled: Boolean,
      autofocus: Boolean,
      textAlign: String,
      tabindex: Number,
      clearable: {
        type: Boolean,
        default: true
      },
      popperClass: String,
      align: {
        type: String,
        default: 'left'
      },
      value: {},
      defaultValue: {},
      rangeSeparator: {
        default: ' - '
      },
      autoWidth: {
        type: Boolean,
        default: true
      },
      pickerOptions: {}
    },
    directives: {
      Clickoutside: VueUtil.component.clickoutside()
    },
    data: function() {
      return {
        pickerVisible: false,
        showClose: false,
        currentValue: '',
        unwatchPickerOptions: null
      };
    },
    watch: {
      pickerVisible: function(val) {
        if (!val)
          this.dispatch('VueFormItem', 'vue.form.blur');
        if (this.disabled)
          return;
        val ? this.showPicker() : this.hidePicker();
      },
      currentValue: function(val) {
        if (val)
          return;
        if (this.picker && VueUtil.isFunction(this.picker.handleClear)) {
          this.picker.handleClear();
        } else {
          this.$emit('input');
        }
      },
      value: {
        immediate: true,
        handler: function(val) {
          var dateVal = VueUtil.toDate(val);
          this.currentValue = dateVal || val;
        }
      },
      displayValue: function(val) {
        this.$emit('change', val);
        this.dispatch('VueFormItem', 'vue.form.change');
      }
    },
    computed: {
      reference: function() {
        return this.$refs.reference.$el;
      },
      refInput: function() {
        if (this.reference)
          return this.$refs.reference.$refs.input;
        return {};
      },
      valueIsEmpty: function() {
        var val = this.currentValue;
        if (VueUtil.isArray(val)) {
          for (var i = 0, len = val.length; i < len; i++) {
            if (val[i]) {
              return false;
            }
          }
        } else {
          if (val) {
            return false;
          }
        }
        return true;
      },
      triggerClass: function() {
        return this.type.indexOf('time') !== -1 ? 'vue-icon-time' : 'vue-icon-date';
      },
      selectionMode: function() {
        if (this.type === 'week') {
          return 'week';
        } else if (this.type === 'month') {
          return 'month';
        } else if (this.type === 'year') {
          return 'year';
        }
        return 'day';
      },
      haveTrigger: function() {
        if (VueUtil.isDef(this.showTrigger)) {
          return this.showTrigger;
        }
        return HAVE_TRIGGER_TYPES.indexOf(this.type) !== -1;
      },
      displayValue: {
        get: function() {
          var value = this.currentValue;
          if (!value)
            return;
          var formatter = (TYPE_VALUE_RESOLVER_MAP[this.type] || TYPE_VALUE_RESOLVER_MAP['default']).formatter;
          var format = DEFAULT_FORMATS[this.type];
          return formatter(value, this.format || format, this.rangeSeparator);
        },
        set: function(value) {
          if (value) {
            var type = this.type;
            var parser = (TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP['default']).parser;
            var parsedValue = parser(value, this.format || DEFAULT_FORMATS[type], this.rangeSeparator);
            if (parsedValue && this.picker) {
              this.picker.value = parsedValue;
            }
          } else {
            this.$emit('input', value);
            this.picker.value = value;
          }
          this.$forceUpdate();
        }
      }
    },
    created: function() {
      var PLACEMENT_MAP = {
        left: 'bottom-start',
        center: 'bottom-center',
        right: 'bottom-end'
      };
      this.popperOptions = {
        boundariesPadding: 0,
        gpuAcceleration: false
      };
      this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left;
    },
    methods: {
      focus: function() {
        this.refInput.focus();
      },
      handleMouseEnterIcon: function() {
        if (this.disabled)
          return;
        if (!this.valueIsEmpty && this.clearable) {
          this.showClose = true;
        }
      },
      handleMouseDown: function(event) {
        if (event.target.tagName !== 'INPUT')
          return;
        if (this.pickerVisible) {
          this.handleClose();
          event.preventDefault();
        } else {
          this.pickerVisible = true;
        }
      },
      handleClickIcon: function() {
        if (this.disabled)
          return;
        if (this.showClose) {
          this.currentValue = this.defaultValue || '';
          this.showClose = false;
        } else {
          this.pickerVisible = !this.pickerVisible;
        }
      },
      dateChanged: function(dateA, dateB) {
        var equalDate = function(dateA, dateB) {
          return dateA === dateB || new Date(dateA).getTime() === new Date(dateB).getTime();
        };
        if (VueUtil.isArray(dateA)) {
          var len = dateA.length;
          if (!dateB) return true;
          while (len--) {
            if (!equalDate(dateA[len], dateB[len])) return true;
          }
        } else {
          if (!equalDate(dateA, dateB)) return true;
        }
        return false;
      },
      handleClose: function() {
        this.pickerVisible = false;
      },
      handleFocus: function() {
        var type = this.type;
        if (HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible) {
          this.pickerVisible = true;
        }
        this.$emit('focus', this);
      },
      handleBlur: function() {
        this.$emit('blur', this);
      },
      handleKeydown: function(event) {
        var keyCode = event.keyCode;
        if (keyCode === 9) {
          this.pickerVisible = false;
        }
      },
      hidePicker: function() {
        if (this.picker) {
          this.picker.resetView && this.picker.resetView();
          this.pickerVisible = this.picker.visible = false;
        }
      },
      showPicker: function() {
        var self = this;
        if (!self.picker) {
          self.mountPicker();
        }
        self.pickerVisible = self.picker.visible = true;
        self.updatePopper();
        if (self.currentValue instanceof Date) {
          self.picker.date = new Date(self.currentValue.getTime());
        } else {
          self.picker.value = self.currentValue;
        }
        self.picker.resetView && self.picker.resetView();
        self.$nextTick(function() {
          self.picker.ajustScrollTop && self.picker.ajustScrollTop();
        });
      },
      mountPicker: function() {
        var self = this;
        self.panel.defaultValue = self.defaultValue || self.currentValue;
        self.picker = new Vue(self.panel).$mount();
        self.picker.popperClass = self.popperClass;
        self.popperElm = self.picker.$el;
        self.picker.showTime = self.type === 'datetime' || self.type === 'datetimerange';
        self.picker.selectionMode = self.selectionMode;
        if (self.format) {
          self.picker.format = self.format;
        }
        var updateOptions = function() {
          var options = self.pickerOptions;
          if (options && options.selectableRange) {
            var ranges = options.selectableRange;
            var parser = TYPE_VALUE_RESOLVER_MAP.datetimerange.parser;
            var format = DEFAULT_FORMATS.timerange;
            ranges = VueUtil.isArray(ranges) ? ranges : [ranges];
            self.picker.selectableRange = VueUtil.map(ranges, function(range) {return parser(range, format, self.rangeSeparator);});
          }
          VueUtil.ownPropertyLoop(options, function(option) {
            if (option !== 'selectableRange') {
              self.picker[option] = options[option];
            }
          });
        };
        updateOptions();
        self.unwatchPickerOptions = self.$watch('pickerOptions', function() {updateOptions();}, {deep: true});
        self.$el.appendChild(self.picker.$el);
        self.picker.resetView && self.picker.resetView();
        self.picker.$on('destroyPopper', self.destroyPopper);
        self.picker.$on('pick', function(date, visible) {
          date = date || '';
          visible = visible || false;
          self.$emit('input', date);
          self.pickerVisible = self.picker.visible = visible;
          self.picker.resetView && self.picker.resetView();
          self.focus();
        });
        self.picker.$on('select-range', function(start, end) {
          self.refInput.setSelectionRange(start, end);
          self.focus();
        });
      },
      unmountPicker: function() {
        if (this.picker) {
          this.picker.$destroy();
          if (VueUtil.isFunction(this.unwatchPickerOptions)) {
            this.unwatchPickerOptions();
          }
        }
      }
    }
  };
  return VuePicker;
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePicker'], definition);
  } else {
    context.VueTimeSelect = definition(context.Vue, context.VuePicker);
    delete context.VueTimeSelect;
  }
})(this, function(Vue, VuePicker) {
  'use strict';
  var TimeSelect = {
    template: '<transition @after-leave="$emit(\'destroyPopper\')"><div v-show="visible" :style="{width: width + \'px\'}" :class="[\'vue-picker-panel time-select\', popperClass]"><div class="vue-picker-panel__content"><div v-for="item in items" :class="[\'time-select-item\', {selected: value === item.value, disabled: item.disabled}]" :disabled="item.disabled" @click="handleClick(item)">{{item.value}}</div></div></div></transition>',
    watch: {
      value: function(val) {
        if (!val) return;
        if (this.minTime && this.compareTime(val, this.minTime) < 0) {
          this.$emit('pick');
        } else if (this.maxTime && this.compareTime(val, this.maxTime) > 0) {
          this.$emit('pick');
        }
      }
    },
    methods: {
      handleClick: function(item) {
        if (!item.disabled) {
          this.$emit('pick', item.value);
        }
      },
      handleClear: function() {
        this.$emit('pick');
      },
      parseTime: function(time) {
        var values = ('' || time).split(':');
        if (values.length >= 2) {
          var hours = parseInt(values[0], 10);
          var minutes = parseInt(values[1], 10);
          return {
            hours: hours,
            minutes: minutes
          };
        }
        return null;
      },
      compareTime: function(time1, time2) {
        var value1 = this.parseTime(time1);
        var value2 = this.parseTime(time2);
        var minutes1 = value1.minutes + value1.hours * 60;
        var minutes2 = value2.minutes + value2.hours * 60;
        if (minutes1 === minutes2) {
          return 0;
        }
        return minutes1 > minutes2 ? 1 : -1;
      },
      nextTime: function(time, step) {
        var timeValue = this.parseTime(time);
        var stepValue = this.parseTime(step);
        var next = {
          hours: timeValue.hours,
          minutes: timeValue.minutes
        };
        next.minutes += stepValue.minutes;
        next.hours += stepValue.hours;
        next.hours += Math.floor(next.minutes / 60);
        next.minutes = next.minutes % 60;
        return (next.hours < 10 ? '0' + next.hours : next.hours) + ':' + (next.minutes < 10 ? '0' + next.minutes : next.minutes);
      }
    },
    data: function() {
      return {
        popperClass: '',
        start: '09:00',
        end: '18:00',
        step: '00:30',
        value: '',
        visible: false,
        minTime: '',
        maxTime: '',
        width: 0
      };
    },
    computed: {
      items: function() {
        var start = this.start;
        var end = this.end;
        var step = this.step;
        var result = [];
        if (start && end && step) {
          var current = start;
          while (this.compareTime(current, end) <= 0) {
            result.push({
              value: current,
              disabled: this.compareTime(current, this.minTime || '-1:-1') <= 0 || this.compareTime(current, this.maxTime || '100:100') >= 0
            });
            current = this.nextTime(current, step);
          }
        }
        return result;
      }
    }
  };
  var VueTimeSelect = {
    mixins: [VuePicker],
    name: 'VueTimeSelect',
    beforeCreate: function() {
      this.type = 'time-select';
      this.panel = TimeSelect;
    }
  };
  Vue.component(VueTimeSelect.name, VueTimeSelect);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePicker', 'VueUtil'], definition);
  } else {
    context.VueTimePicker = definition(context.Vue, context.VuePicker, context.VueUtil);
  }
})(this, function(Vue, VuePicker, VueUtil) {
  'use strict';
  var limitRange = function(date, ranges, format) {
    format = format || 'yyyy-MM-dd HH:mm:ss';
    if (!ranges || !ranges.length) return date;
    var len = ranges.length;
    date = VueUtil.parseDate(date, format);
    while (len--) {
      var range = ranges[len];
      if (date >= range[0] && date <= range[1]) {
        return date;
      }
    }
    var maxDate = ranges[0][0];
    var minDate = ranges[0][0];
    VueUtil.loop(ranges, function(range) {
      minDate = new Date(Math.min(range[0], minDate));
      maxDate = new Date(Math.max(range[1], maxDate));
    });
    return date < minDate ? minDate : maxDate;
  };
  var TimeSpinner = {
    template: '<div :class="[\'vue-time-spinner\', {\'has-seconds\': showSeconds}]"><vue-scrollbar :height="190" @mouseenter.native="emitSelectRange(\'hours\')" class="vue-time-spinner__wrapper" view-class="vue-time-spinner__list" noresize tag="ul" ref="hour"><li @click="handleClick(\'hours\', {value: hour, disabled: disabled}, true)" v-for="(disabled, hour) in hoursList" track-by="hour" :class="[\'vue-time-spinner__item\', {\'active\': hour === hours, \'disabled\': disabled}]" v-text="hour"></li></vue-scrollbar><vue-scrollbar :height="190" @mouseenter.native="emitSelectRange(\'minutes\')" class="vue-time-spinner__wrapper" view-class="vue-time-spinner__list" noresize tag="ul" ref="minute"><li @click="handleClick(\'minutes\', key, true)" v-for="(minute, key) in 60" :class="[\'vue-time-spinner__item\', {\'active\': key === minutes}]" v-text="key"></li></vue-scrollbar><vue-scrollbar :height="190" v-show="showSeconds" @mouseenter.native="emitSelectRange(\'seconds\')" class="vue-time-spinner__wrapper" view-class="vue-time-spinner__list" noresize tag="ul" ref="second"><li @click="handleClick(\'seconds\', key, true)" v-for="(second, key) in 60" :class="[\'vue-time-spinner__item\', {\'active\': key === seconds}]" v-text="key"></li></vue-scrollbar></div>',
    props: {
      hours: {
        type: Number,
        default: 0
      },
      minutes: {
        type: Number,
        default: 0
      },
      seconds: {
        type: Number,
        default: 0
      },
      showSeconds: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      hoursPrivate: function(newVal, oldVal) {
        if (!(newVal >= 0 && newVal <= 23)) {
          this.hoursPrivate = oldVal;
        }
        this.ajustElTop('hour', newVal);
        this.$emit('change', {hours: newVal});
      },
      minutesPrivate: function(newVal, oldVal) {
        if (!(newVal >= 0 && newVal <= 59)) {
          this.minutesPrivate = oldVal;
        }
        this.ajustElTop('minute', newVal);
        this.$emit('change', {minutes: newVal});
      },
      secondsPrivate: function(newVal, oldVal) {
        if (!(newVal >= 0 && newVal <= 59)) {
          this.secondsPrivate = oldVal;
        }
        this.ajustElTop('second', newVal);
        this.$emit('change', {seconds: newVal});
      }
    },
    computed: {
      hoursList: function() {
        var getRangeHours = function(ranges) {
          var hours = [];
          var disabledHours = [];
          VueUtil.loop(ranges, function(range) {
            var value = VueUtil.map(range, function(date) {
              return VueUtil.toDate(date).getHours();
            });
            var newArray = function(start, end) {
              var result = [];
              for (var i = start; i <= end; i++) {
                result.push(i);
              }
              return result;
            };
            VueUtil.mergeArray(disabledHours, newArray(value[0], value[1]));
          });
          var i = 24;
          while (i--) {
            hours[i] = disabledHours.length ? disabledHours.indexOf(i) === -1 : false;
          }
          return hours;
        };
        return getRangeHours(this.selectableRange);
      },
      hourVue: function() {
        return this.$refs.hour.wrap;
      },
      minuteVue: function() {
        return this.$refs.minute.wrap;
      },
      secondVue: function() {
        return this.$refs.second.wrap;
      }
    },
    data: function() {
      return {
        hoursPrivate: 0,
        minutesPrivate: 0,
        secondsPrivate: 0,
        selectableRange: []
      };
    },
    mounted: function() {
      var self = this;
      self.$nextTick(function() {
        self.bindScrollEvent();
      });
    },
    methods: {
      debounceAjustElTop: VueUtil.debounce(100, function(type) {
        this.ajustElTop(type, this[type + 's']);
      }),
      handleClick: function(type, value, disabled) {
        if (value.disabled) {
          return;
        }
        this[type + 'Private'] = value.value >= 0 ? value.value : value;
        this.emitSelectRange(type);
      },
      emitSelectRange: function(type) {
        if (type === 'hours') {
          this.$emit('select-range', 0, 2);
        } else if (type === 'minutes') {
          this.$emit('select-range', 3, 5);
        } else if (type === 'seconds') {
          this.$emit('select-range', 6, 8);
        }
      },
      bindScrollEvent: function() {
        var self = this;
        var bindFuntion = function(type) {
          self[type + 'Vue'].onscroll = function(e) {self.handleScroll(type, e);};
        };
        bindFuntion('hour');
        bindFuntion('minute');
        bindFuntion('second');
      },
      handleScroll: function(type) {
        var ajust = {};
        ajust[type + 's'] = Math.min(Math.floor((this[type + 'Vue'].scrollTop - 80) / 32 + 3), 59);
        this.debounceAjustElTop(type);
        this.$emit('change', ajust);
      },
      ajustScrollTop: function() {
        this.ajustElTop('hour', this.hours);
        this.ajustElTop('minute', this.minutes);
        this.ajustElTop('second', this.seconds);
      },
      ajustElTop: function(type, value) {
        this[type + 'Vue'].scrollTop = Math.max(0, (value - 2.5) * 32 + 80);
      }
    }
  };
  var TimePanel = {
    template: '<transition @after-leave="$emit(\'destroyPopper\')"><div v-show="currentVisible" :class="[\'vue-time-panel\', popperClass]"><div class="vue-time-panel__content" :class="{\'has-seconds\': showSeconds}"><time-spinner ref="spinner" @change="handleChange" :show-seconds="showSeconds" @select-range="setSelectionRange" :hours="hours" :minutes="minutes" :seconds="seconds"></time-spinner></div><div class="vue-time-panel__footer"><button type="button" class="vue-time-panel__btn cancel" @click="handleCancel">{{cancelLabel}}</button><button type="button" class="vue-time-panel__btn confirm" @click="handleConfirm()">{{confirmLabel}}</button></div></div></transition>',
    components: {
      TimeSpinner: TimeSpinner
    },
    props: {
      pickerWidth: {},
      date: {
        default: function() {
          return new Date();
        }
      },
      visible: Boolean
    },
    watch: {
      visible: function(val) {
        this.currentVisible = val;
      },
      pickerWidth: function(val) {
        this.width = val;
      },
      value: function(newVal) {
        var self = this;
        var date;
        if (newVal instanceof Date) {
          date = limitRange(newVal, self.selectableRange);
        } else if (!newVal) {
          date = new Date();
        }
        self.handleChange({
          hours: date.getHours(),
          minutes: date.getMinutes(),
          seconds: date.getSeconds()
        });
        self.$nextTick(function() {self.ajustScrollTop();});
      },
      selectableRange: function(val) {
        this.$refs.spinner.selectableRange = val;
      }
    },
    data: function() {
      return {
        popperClass: '',
        format: 'HH:mm:ss',
        value: '',
        hours: 0,
        minutes: 0,
        seconds: 0,
        selectableRange: [],
        currentDate: this.defaultValue || this.date || new Date(),
        currentVisible: this.visible || false
      };
    },
    computed: {
      showSeconds: function() {
        return (this.format || '').indexOf('ss') !== -1;
      },
      confirmLabel: function() {
        return this.$t('vue.datepicker.confirm');
      },
      cancelLabel: function() {
        return this.$t('vue.datepicker.cancel');
      }
    },
    methods: {
      handleClear: function() {
        this.$emit('pick');
      },
      handleCancel: function() {
        this.$emit('pick');
      },
      handleChange: function(date) {
        if (VueUtil.isDef(date.hours)) {
          this.currentDate.setHours(date.hours);
          this.hours = this.currentDate.getHours();
        }
        if (VueUtil.isDef(date.minutes)) {
          this.currentDate.setMinutes(date.minutes);
          this.minutes = this.currentDate.getMinutes();
        }
        if (VueUtil.isDef(date.seconds)) {
          this.currentDate.setSeconds(date.seconds);
          this.seconds = this.currentDate.getSeconds();
        }
        this.handleConfirm(true);
      },
      setSelectionRange: function(start, end) {
        this.$emit('select-range', start, end);
      },
      handleConfirm: function(visible, first) {
        visible = visible || false;
        if (first) return;
        var date = new Date(limitRange(this.currentDate, this.selectableRange, 'HH:mm:ss'));
        this.$emit('pick', date, visible, first);
      },
      ajustScrollTop: function() {
        return this.$refs.spinner.ajustScrollTop();
      }
    },
    created: function() {
      this.hours = this.currentDate.getHours();
      this.minutes = this.currentDate.getMinutes();
      this.seconds = this.currentDate.getSeconds();
    },
    mounted: function() {
      var self = this;
      self.$nextTick(function() {self.handleConfirm(true, true);});
      self.$emit('mounted');
    }
  };
  var TimeRangePanel = {
    template: '<transition @before-enter="panelCreated" @after-leave="$emit(\'destroyPopper\')"><div v-show="visible" :class="[\'vue-time-range-picker vue-picker-panel\', popperClass]"><div class="vue-time-range-picker__content"><div class="vue-time-range-picker__cell"><div class="vue-time-range-picker__header">{{$t(\'vue.datepicker.startTime\')}}</div><div :class="[\'vue-time-range-picker__body vue-time-panel__content\', {\'has-seconds\': showSeconds}]"><time-spinner ref="minSpinner" :show-seconds="showSeconds" @change="handleMinChange" @select-range="setMinSelectionRange" :hours="minHours" :minutes="minMinutes" :seconds="minSeconds"></time-spinner></div></div><div class="vue-time-range-picker__cell"><div class="vue-time-range-picker__header">{{$t(\'vue.datepicker.endTime\')}}</div><div :class="[\'vue-time-range-picker__body vue-time-panel__content\', {\'has-seconds\': showSeconds}]"><time-spinner ref="maxSpinner" :show-seconds="showSeconds" @change="handleMaxChange" @select-range="setMaxSelectionRange" :hours="maxHours" :minutes="maxMinutes" :seconds="maxSeconds"></time-spinner></div></div></div><div class="vue-time-panel__footer"><button type="button" class="vue-time-panel__btn cancel" @click="handleCancel()">{{cancelLabel}}</button><button type="button" class="vue-time-panel__btn confirm" @click="handleConfirm()" :disabled="btnDisabled">{{confirmLabel}}</button></div></div></transition>',
    components: {
      TimeSpinner: TimeSpinner
    },
    computed: {
      showSeconds: function() {
        return (this.format || '').indexOf('ss') !== -1;
      },
      confirmLabel: function() {
        return this.$t('vue.datepicker.confirm');
      },
      cancelLabel: function() {
        return this.$t('vue.datepicker.cancel');
      }
    },
    props: ['value'],
    data: function() {
      var time = this.clacTime(this.defaultValue);
      var isDisabled = function(minTime, maxTime) {
        var minValue = minTime.getHours() * 3600 + minTime.getMinutes() * 60 + minTime.getSeconds();
        var maxValue = maxTime.getHours() * 3600 + maxTime.getMinutes() * 60 + maxTime.getSeconds();
        return minValue > maxValue;
      };
      return {
        popperClass: '',
        minTime: time.minTime,
        maxTime: time.maxTime,
        btnDisabled: isDisabled(time.minTime, time.maxTime),
        maxHours: time.maxTime.getHours(),
        maxMinutes: time.maxTime.getMinutes(),
        maxSeconds: time.maxTime.getSeconds(),
        minHours: time.minTime.getHours(),
        minMinutes: time.minTime.getMinutes(),
        minSeconds: time.minTime.getSeconds(),
        format: 'HH:mm:ss',
        visible: false
      };
    },
    watch: {
      value: function(newVal) {
        var self = this;
        self.panelCreated();
        self.$nextTick(function() {self.ajustScrollTop();});
      }
    },
    methods: {
      clacTime: function(time) {
        time = VueUtil.isArray(time) ? time : [time];
        var minTime = time[0] || new Date();
        var date = new Date();
        date.setHours(date.getHours() + 1);
        var maxTime = time[1] || date;
        if (minTime > maxTime) return this.clacTime();
        return {minTime: minTime, maxTime: maxTime};
      },
      panelCreated: function() {
        var time = this.clacTime(this.value);
        if (time.minTime === this.minTime && time.maxTime === this.maxTime) {
          return;
        }
        this.handleMinChange({
          hours: time.minTime.getHours(),
          minutes: time.minTime.getMinutes(),
          seconds: time.minTime.getSeconds()
        });
        this.handleMaxChange({
          hours: time.maxTime.getHours(),
          minutes: time.maxTime.getMinutes(),
          seconds: time.maxTime.getSeconds()
        });
      },
      handleClear: function() {
        this.handleCancel();
      },
      handleCancel: function() {
        this.$emit('pick');
      },
      handleChange: function() {
        if (this.minTime > this.maxTime) return;
        var MIN_TIME = VueUtil.parseDate('00:00:00', 'HH:mm:ss');
        var MAX_TIME = VueUtil.parseDate('23:59:59', 'HH:mm:ss');
        MIN_TIME.setFullYear(this.minTime.getFullYear());
        MIN_TIME.setMonth(this.minTime.getMonth(), this.minTime.getDate());
        MAX_TIME.setFullYear(this.maxTime.getFullYear());
        MAX_TIME.setMonth(this.maxTime.getMonth(), this.maxTime.getDate());
        this.$refs.minSpinner.selectableRange = [[MIN_TIME, this.maxTime]];
        this.$refs.maxSpinner.selectableRange = [[this.minTime, MAX_TIME]];
        this.handleConfirm(true);
      },
      handleMaxChange: function(date) {
        if (VueUtil.isDef(date.hours)) {
          this.maxTime.setHours(date.hours);
          this.maxHours = this.maxTime.getHours();
        }
        if (VueUtil.isDef(date.minutes)) {
          this.maxTime.setMinutes(date.minutes);
          this.maxMinutes = this.maxTime.getMinutes();
        }
        if (VueUtil.isDef(date.seconds)) {
          this.maxTime.setSeconds(date.seconds);
          this.maxSeconds = this.maxTime.getSeconds();
        }
        this.handleChange();
      },
      handleMinChange: function(date) {
        if (VueUtil.isDef(date.hours)) {
          this.minTime.setHours(date.hours);
          this.minHours = this.minTime.getHours();
        }
        if (VueUtil.isDef(date.minutes)) {
          this.minTime.setMinutes(date.minutes);
          this.minMinutes = this.minTime.getMinutes();
        }
        if (VueUtil.isDef(date.seconds)) {
          this.minTime.setSeconds(date.seconds);
          this.minSeconds = this.minTime.getSeconds();
        }
        this.handleChange();
      },
      setMinSelectionRange: function(start, end) {
        this.$emit('select-range', start, end);
      },
      setMaxSelectionRange: function(start, end) {
        this.$emit('select-range', start + 11, end + 11);
      },
      handleConfirm: function(visible, first) {
        visible = visible || false;
        first = first || false;
        var minSelectableRange = this.$refs.minSpinner.selectableRange;
        var maxSelectableRange = this.$refs.maxSpinner.selectableRange;
        this.minTime = limitRange(this.minTime, minSelectableRange);
        this.maxTime = limitRange(this.maxTime, maxSelectableRange);
        if (first) return;
        this.$emit('pick', [this.minTime, this.maxTime], visible, first);
      },
      ajustScrollTop: function() {
        this.$refs.minSpinner.ajustScrollTop();
        this.$refs.maxSpinner.ajustScrollTop();
      }
    },
    mounted: function() {
      var self = this;
      self.$nextTick(function() {self.handleConfirm(true, true);});
    }
  };
  var VueTimePicker = {
    mixins: [VuePicker],
    name: 'VueTimePicker',
    props: {
      isRange: Boolean
    },
    data: function() {
      return {
        type: ''
      };
    },
    watch: {
      isRange: function(isRange) {
        if (this.picker) {
          this.unmountPicker();
          this.type = isRange ? 'timerange' : 'time';
          this.panel = isRange ? TimeRangePanel : TimePanel;
          this.mountPicker();
        } else {
          this.type = isRange ? 'timerange' : 'time';
          this.panel = isRange ? TimeRangePanel : TimePanel;
        }
      }
    },
    created: function() {
      this.type = this.isRange ? 'timerange' : 'time';
      this.panel = this.isRange ? TimeRangePanel : TimePanel;
    }
  };
  Vue.component(VueTimePicker.name, VueTimePicker);
  return TimePanel;
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePicker', 'VueUtil', 'VueTimePicker'], definition);
  } else {
    context.VueDatePicker = definition(context.Vue, context.VuePicker, context.VueUtil, context.VueTimePicker);
    delete context.VueTimePicker;
  }
})(this, function(Vue, VuePicker, VueUtil, VueTimePicker) {
  'use strict';
  var YearTable = {
    template: '<table @click="handleYearTableClick" class="vue-year-table"><tbody><tr><td class="available" :style="getCellStyle(startYear + 0)"><a class="cell">{{startYear}}</a></td><td class="available" :style="getCellStyle(startYear + 1)"><a class="cell">{{startYear + 1}}</a></td><td class="available" :style="getCellStyle(startYear + 2)"><a class="cell">{{startYear + 2}}</a></td><td class="available" :style="getCellStyle(startYear + 3)"><a class="cell">{{startYear + 3}}</a></td></tr><tr><td class="available" :style="getCellStyle(startYear + 4)"><a class="cell">{{startYear + 4}}</a></td><td class="available" :style="getCellStyle(startYear + 5)"><a class="cell">{{startYear + 5}}</a></td><td class="available" :style="getCellStyle(startYear + 6)"><a class="cell">{{startYear + 6}}</a></td><td class="available" :style="getCellStyle(startYear + 7)"><a class="cell">{{startYear + 7}}</a></td></tr><tr><td class="available" :style="getCellStyle(startYear + 8)"><a class="cell">{{startYear + 8}}</a></td><td class="available" :style="getCellStyle(startYear + 9)"><a class="cell">{{startYear + 9}}</a></td><td></td><td></td></tr></tbody></table>',
    props: {
      disabledDate: {},
      date: {},
      year: {}
    },
    computed: {
      startYear: function() {
        return Math.floor(this.year / 10) * 10;
      }
    },
    methods: {
      getCellStyle: function(year) {
        var style = {};
        var date = new Date(this.date);
        date.setFullYear(year);
        style.disabled = VueUtil.isFunction(this.disabledDate) && this.disabledDate(date);
        style.current = Number(this.year) === year;
        return style;
      },
      nextTenYear: function() {
        this.$emit('pick', Number(this.year) + 10, false);
      },
      prevTenYear: function() {
        this.$emit('pick', Number(this.year) - 10, false);
      },
      handleYearTableClick: function(event) {
        var target = event.target;
        if (target.tagName === 'A') {
          if (VueUtil.hasClass(target.parentNode, 'disabled'))
            return;
          var year = target.textContent || target.innerText;
          this.$emit('pick', year);
        }
      }
    }
  };
  var MonthTable = {
    template: '<table @click="handleMonthTableClick" class="vue-month-table"><tbody><tr><td :style="getCellStyle(0)"><a class="cell">{{$t(\'vue.datepicker.months.jan\')}}</a></td><td :style="getCellStyle(1)"><a class="cell">{{$t(\'vue.datepicker.months.feb\')}}</a></td><td :style="getCellStyle(2)"><a class="cell">{{$t(\'vue.datepicker.months.mar\')}}</a></td><td :style="getCellStyle(3)"><a class="cell">{{$t(\'vue.datepicker.months.apr\')}}</a></td></tr><tr><td :style="getCellStyle(4)"><a class="cell">{{$t(\'vue.datepicker.months.may\')}}</a></td><td :style="getCellStyle(5)"><a class="cell">{{$t(\'vue.datepicker.months.jun\')}}</a></td><td :style="getCellStyle(6)"><a class="cell">{{$t(\'vue.datepicker.months.jul\')}}</a></td><td :style="getCellStyle(7)"><a class="cell">{{$t(\'vue.datepicker.months.aug\')}}</a></td></tr><tr><td :style="getCellStyle(8)"><a class="cell">{{$t(\'vue.datepicker.months.sep\')}}</a></td><td :style="getCellStyle(9)"><a class="cell">{{$t(\'vue.datepicker.months.oct\')}}</a></td><td :style="getCellStyle(10)"><a class="cell">{{$t(\'vue.datepicker.months.nov\')}}</a></td><td :style="getCellStyle(11)"><a class="cell">{{$t(\'vue.datepicker.months.dec\')}}</a></td></tr></tbody></table>',
    props: {
      disabledDate: {},
      date: {},
      month: {
        type: Number
      }
    },
    methods: {
      getCellStyle: function(month) {
        var style = {};
        var date = new Date(this.date);
        date.setMonth(month);
        style.disabled = VueUtil.isFunction(this.disabledDate) && this.disabledDate(date);
        style.current = this.month === month;
        return style;
      },
      handleMonthTableClick: function(event) {
        var target = event.target;
        if (target.tagName !== 'A')
          return;
        if (VueUtil.hasClass(target.parentNode, 'disabled'))
          return;
        var column = target.parentNode.cellIndex;
        var row = target.parentNode.parentNode.rowIndex;
        var month = row * 4 + column;
        this.$emit('pick', month);
      }
    }
  };
  var DateTable = {
    template: '<table cellspacing="0" cellpadding="0" @click="handleClick" @mousemove="handleMouseMove" :class="[\'vue-date-table\', {\'is-week-mode\': selectionMode === \'week\'}]"><tbody><tr><th v-if="showWeekNumber">{{$t(\'vue.datepicker.week\')}}</th><th v-for="week in WEEKS">{{$t(\'vue.datepicker.weeks.\'+week)}}</th></tr><tr v-for="row in rows" :class="[\'vue-date-table__row\', {current: isWeekActive(row[1])}]"><td v-for="cell in row" :class="getCellClasses(cell)" v-text="cell.text"></td></tr></tbody></table>',
    props: {
      firstDayOfWeek: {
        default: 0,
        type: Number,
        validator: function(val) {
          return val >= 0 && val <= 6;
        }
      },
      date: {},
      year: {},
      month: {},
      week: {},
      events: Array,
      selectionMode: {
        default: 'day'
      },
      showWeekNumber: Boolean,
      disabledDate: {},
      minDate: {},
      maxDate: {},
      rangeState: {
        default: function() {
          return {
            endDate: null,
            selecting: false,
            row: null,
            column: null
          };
        }
      }
    },
    computed: {
      offsetDay: function() {
        var week = this.firstDayOfWeek;
        return week > 2 ? 6 - week : -week;
      },
      WEEKS: function() {
        var WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        var week = this.firstDayOfWeek;
        return VueUtil.mergeArray(WEEKS, WEEKS).slice(week, week + 7);
      },
      monthDate: function() {
        return this.date.getDate();
      },
      startDate: function() {
        var result = new Date(this.year, this.month, 1);
        var day = result.getDay();
        if (day === 0) day = 7;
        result.setTime(result.getTime() - this.dayDuration * day);
        return result;
      },
      rows: function() {
        var date = new Date(this.year, this.month, 1);
        var day = VueUtil.getFirstDayOfMonth(date);
        var rows = this.tableRows;
        var startDate = this.startDate;
        var disabledDate = this.disabledDate;
        var now = this.clearHours(new Date());
        for (var i = 0; i < 6; i++) {
          var row = rows[i];
          for (var j = 0; j < 7; j++) {
            var index = i * 7 + j;
            var time = startDate.getTime() + this.dayDuration * (index - this.offsetDay);
            var nowDate = VueUtil.addDate(startDate, index);
            var minClearHoursDate = this.clearHours(this.minDate);
            var maxClearHoursDate = this.clearHours(this.maxDate);
            if (this.showWeekNumber && j === 0) {
              row[j] = {
                type: 'week',
                text: VueUtil.getWeekNumber(nowDate)
              };
            }
            var cell = row[this.showWeekNumber ? j + 1 : j];
            if (!cell) {
              cell = {
                row: i,
                column: j,
                type: 'normal',
                inRange: false,
                start: false,
                end: false
              };
            }
            cell.type = 'normal';
            cell.inRange = time >= minClearHoursDate && time <= maxClearHoursDate;
            cell.start = this.minDate && time === minClearHoursDate;
            cell.end = this.maxDate && time === maxClearHoursDate;
            var isToday = time === now;
            if (isToday) {
              cell.type = 'today';
            }
            if (nowDate.getMonth() < date.getMonth()) {
              cell.type = 'prev-month';
            }
            if (nowDate.getMonth() > date.getMonth()) {
              cell.type = 'next-month';
            }
            cell.text = nowDate.getDate();
            cell.disabled = VueUtil.isFunction(disabledDate) && disabledDate(new Date(time));
            cell.event = false;
            if (cell.type === 'today' || cell.type === 'normal') {
              if (this.events && this.events.length > 0) {
                var cellDate = new Date(this.year, this.month, cell.text);
                VueUtil.loop(this.events, function(event) {
                  var st = VueUtil.parseDate(event.start).getTime();
                  var ed = VueUtil.parseDate(event.end ? event.end : st).getTime();
                  var de = VueUtil.parseDate(cellDate).getTime();
                  if (de >= st && de <= ed) {
                    cell.event = true;
                  }
                });
              }
            }
            row.splice(this.showWeekNumber ? j + 1 : j, 1, cell);
          }
          if (this.selectionMode === 'week') {
            var start = this.showWeekNumber ? 1 : 0;
            var end = this.showWeekNumber ? 7 : 6;
            var isWeekActive = this.isWeekActive(row[start + 1]);
            row[start].inRange = isWeekActive;
            row[start].start = isWeekActive;
            row[end].inRange = isWeekActive;
            row[end].end = isWeekActive;
          }
        }
        return rows;
      }
    },
    watch: {
      'rangeState.endDate': function(newVal) {
        this.markRange(newVal);
      },
      minDate: function(newVal, oldVal) {
        if (newVal && !oldVal) {
          this.rangeState.selecting = true;
          this.markRange(newVal);
        } else if (!newVal) {
          this.rangeState.selecting = false;
          this.markRange(newVal);
        } else {
          this.markRange();
        }
      },
      maxDate: function(newVal, oldVal) {
        if (newVal && !oldVal) {
          this.rangeState.selecting = false;
          this.markRange(newVal);
          this.$emit('pick', {
            minDate: this.minDate,
            maxDate: this.maxDate
          });
        }
      }
    },
    data: function() {
      return {
        tableRows: [[], [], [], [], [], []],
        dayDuration: 86400000
      };
    },
    methods: {
      getCellClasses: function(cell) {
        var selectionMode = this.selectionMode;
        var monthDate = this.monthDate;
        var classes = [];
        if ((cell.type === 'normal' || cell.type === 'today') && !cell.disabled) {
          classes.push('available');
          if (cell.type === 'today') {
            classes.push('today');
          }
        } else {
          classes.push(cell.type);
        }
        if (selectionMode === 'day' && (cell.type === 'normal' || cell.type === 'today') && Number(this.year) === this.date.getFullYear() && this.month === this.date.getMonth() && monthDate === Number(cell.text)) {
          classes.push('current');
        }
        if (cell.inRange && ((cell.type === 'normal' || cell.type === 'today') || this.selectionMode === 'week')) {
          classes.push('in-range');
          if (cell.start) {
            classes.push('start-date');
          }
          if (cell.end) {
            classes.push('end-date');
          }
        }
        if (cell.disabled) {
          classes.push('disabled');
        }
        if (cell.event) {
          classes.push('event-date');
        }
        return classes.join(' ');
      },
      getDateOfCell: function(row, column) {
        var startDate = this.startDate;
        return new Date(startDate.getTime() + (row * 7 + (column - (this.showWeekNumber ? 1 : 0)) - this.offsetDay) * this.dayDuration);
      },
      getCellByDate: function(date) {
        var startDate = this.startDate;
        var rows = this.rows;
        var index = (date - startDate) / this.dayDuration;
        var row = rows[Math.floor(index / 7)];
        if (this.showWeekNumber) {
          return row[index % 7 + 1];
        } else {
          return row[index % 7];
        }
      },
      isWeekActive: function(cell) {
        if (this.selectionMode !== 'week')
          return false;
        var newDate = new Date(this.year, this.month, 1);
        var year = newDate.getFullYear();
        var month = newDate.getMonth();
        if (cell.type === 'prev-month') {
          newDate.setMonth(month === 0 ? 11 : month - 1);
          newDate.setFullYear(month === 0 ? year - 1 : year);
        }
        if (cell.type === 'next-month') {
          newDate.setMonth(month === 11 ? 0 : month + 1);
          newDate.setFullYear(month === 11 ? year + 1 : year);
        }
        newDate.setDate(parseInt(cell.text, 10));
        return VueUtil.getWeekNumber(newDate) === this.week;
      },
      clearHours: function(time) {
        var cloneDate = new Date(time);
        cloneDate.setHours(0, 0, 0, 0);
        return cloneDate.getTime();
      },
      markRange: function(maxDate) {
        var startDate = this.startDate;
        if (!maxDate) {
          maxDate = this.maxDate;
        }
        var rows = this.rows;
        var minDate = this.minDate;
        for (var i = 0, k = rows.length; i < k; i++) {
          var row = rows[i];
          for (var j = 0, l = row.length; j < l; j++) {
            if (this.showWeekNumber && j === 0)
              continue;
            var cell = row[j];
            var index = i * 7 + j + (this.showWeekNumber ? -1 : 0);
            var time = startDate.getTime() + this.dayDuration * (index - this.offsetDay);
            var minClearHoursDate = this.clearHours(minDate);
            var maxClearHoursDate = this.clearHours(maxDate);
            cell.inRange = minDate && time >= minClearHoursDate && time <= maxClearHoursDate;
            cell.start = minDate && time === minClearHoursDate;
            cell.end = maxDate && time === maxClearHoursDate;
          }
        }
      },
      handleMouseMove: function(event) {
        if (!this.rangeState.selecting)
          return;
        this.$emit('changerange', {
          minDate: this.minDate,
          maxDate: this.maxDate,
          rangeState: this.rangeState
        });
        var target = event.target;
        if (target.tagName !== 'TD') return;
        var column = target.cellIndex;
        var row = target.parentNode.rowIndex - 1;
        var oldRow = this.rangeState.row;
        var oldColumn = this.rangeState.column;
        if (oldRow !== row || oldColumn !== column) {
          this.rangeState.row = row;
          this.rangeState.column = column;
          this.rangeState.endDate = this.getDateOfCell(row, column);
        }
      },
      handleClick: function(event) {
        var target = event.target;
        if (target.tagName !== 'TD')
          return;
        if (VueUtil.hasClass(target, 'disabled') || VueUtil.hasClass(target, 'week'))
          return;
        var selectionMode = this.selectionMode;
        if (selectionMode === 'week') {
          target = target.parentNode.cells[1];
        }
        var year = Number(this.year);
        var month = Number(this.month);
        var cellIndex = target.cellIndex;
        var rowIndex = target.parentNode.rowIndex;
        var cell = this.rows[rowIndex - 1][cellIndex];
        var text = cell.text;
        var className = target.className;
        var newDate = new Date(year, month, 1);
        if (className.indexOf('prev') !== -1) {
          if (month === 0) {
            year = year - 1;
            month = 11;
          } else {
            month = month - 1;
          }
          newDate.setFullYear(year);
          newDate.setMonth(month);
        } else if (className.indexOf('next') !== -1) {
          if (month === 11) {
            year = year + 1;
            month = 0;
          } else {
            month = month + 1;
          }
          newDate.setFullYear(year);
          newDate.setMonth(month);
        }
        newDate.setDate(parseInt(text, 10));
        if (this.selectionMode === 'range') {
          if (this.minDate && this.maxDate) {
            var minDate = new Date(newDate.getTime());
            var maxDate = null;
            this.$emit('pick', {
              minDate: minDate,
              maxDate: maxDate
            }, false);
            this.rangeState.selecting = true;
            this.markRange(this.minDate);
          } else if (this.minDate && !this.maxDate) {
            if (newDate >= this.minDate) {
              var maxDate = new Date(newDate.getTime());
              this.rangeState.selecting = false;
              this.$emit('pick', {
                minDate: this.minDate,
                maxDate: maxDate
              });
            } else {
              var minDate = new Date(newDate.getTime());
              this.$emit('pick', {
                minDate: minDate,
                maxDate: this.maxDate
              }, false);
            }
          } else if (!this.minDate) {
            var minDate = new Date(newDate.getTime());
            this.$emit('pick', {
              minDate: minDate,
              maxDate: this.maxDate
            }, false);
            this.rangeState.selecting = true;
            this.markRange(this.minDate);
          }
        } else if (selectionMode === 'day') {
          this.$emit('pick', newDate);
        } else if (selectionMode === 'week') {
          var weekNumber = VueUtil.getWeekNumber(newDate);
          var value = newDate.getFullYear() + 'w' + weekNumber;
          this.$emit('pick', {
            year: newDate.getFullYear(),
            week: weekNumber,
            value: value,
            date: newDate
          });
        }
      }
    }
  };
  var DatePanel = {
    template: 
    '<transition @after-leave="$emit(\'destroyPopper\')"> \
    <div v-show="visible" :class="[\'vue-picker-panel vue-date-picker\', {\'has-sidebar\': $slots.sidebar || shortcuts,\'has-time\': showTime}, popperClass]" ref="dpp"> \
      <div class="vue-picker-panel__body-wrapper"> \
        <slot name="sidebar" class="vue-picker-panel__sidebar"></slot> \
        <div class="vue-picker-panel__sidebar" v-if="shortcuts"><button type="button" class="vue-picker-panel__shortcut" v-for="shortcut in shortcuts" @click="handleShortcutClick(shortcut)">{{shortcut.text}}</button></div> \
        <div \
          class="vue-picker-panel__body"> \
          <div class="vue-date-picker__time-header" v-if="showTime"><span class="vue-date-picker__editor-wrap"><vue-input :placeholder="$t(\'vue.datepicker.selectDate\')" :value="visibleDate" size="small" @change.native="visibleDate = $event.target.value" /></span> \
            <span \
              class="vue-date-picker__editor-wrap"> \
              <vue-input ref="input" @focus="timePickerVisible = !timePickerVisible" :placeholder="$t(\'vue.datepicker.selectTime\')" \
                :value="visibleTime" size="small" @change.native="visibleTime = $event.target.value" /> \
              <time-picker ref="timepicker" :date="date" :picker-width="pickerWidth" @pick="handleTimePick" \
                :visible="timePickerVisible" @mounted="$refs.timepicker.format=timeFormat"></time-picker> \
              </span> \
          </div> \
          <div class="vue-date-picker__header" v-show="currentView !== \'time\'"><button type="button" @click="prevYear" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-d-arrow-left"></button> \
            <button \
              type="button" @click="prevMonth" v-show="currentView === \'date\'" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-arrow-left"></button><span @click="showYearPicker" class="vue-date-picker__header-label">{{yearLabel}}</span> \
              <span \
                @click="showMonthPicker" v-show="currentView === \'date\'" :class="[\'vue-date-picker__header-label\', {active: currentView === \'month\'}]">{{monthLabel}}</span><button type="button" @click="nextYear" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-d-arrow-right"></button> \
                <button \
                  type="button" @click="nextMonth" v-show="currentView === \'date\'" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-arrow-right"></button> \
          </div> \
          <div class="vue-picker-panel__content"> \
            <date-table v-show="currentView === \'date\'" @pick="handleDatePick" :show-week-number="showWeekNumber" \
              :year="year" :month="month" :date="date" :week="week" :selection-mode="selectionMode" :first-day-of-week="firstDayOfWeek" \
              :disabled-date="disabledDate"></date-table> \
            <year-table ref="yearTable" :year="year" :date="date" v-show="currentView === \'year\'" \
              @pick="handleYearPick" :disabled-date="disabledDate"></year-table> \
            <month-table :month="month" :date="date" v-show="currentView === \'month\'" @pick="handleMonthPick" \
              :disabled-date="disabledDate"></month-table> \
          </div> \
      </div> \
    </div> \
    <div class="vue-picker-panel__footer" v-show="footerVisible && currentView === \'date\'"><a href="JavaScript:" class="vue-picker-panel__link-btn" @click="changeToNow">{{nowLabel}}</a> \
      <button \
        type="button" class="vue-picker-panel__btn" @click="confirm">{{confirmLabel}}</button> \
    </div> \
    </div> \
  </transition>',
    watch: {
      showTime: function(val) {
        var self = this;
        if (!val)
          return;
        self.$nextTick(function() {
          var inputElm = self.$refs.input.$el;
          if (inputElm) {
            self.pickerWidth = inputElm.getBoundingClientRect().width + 10;
          }
        });
      },
      value: function(newVal) {
        if (!newVal)
          return;
        newVal = new Date(newVal);
        if (!isNaN(newVal)) {
          if (VueUtil.isFunction(this.disabledDate) && this.disabledDate(new Date(newVal))) {
            return;
          }
          this.date = newVal;
          this.year = newVal.getFullYear();
          this.month = newVal.getMonth();
          this.$emit('pick', newVal, true);
        }
      },
      timePickerVisible: function(val) {
        var self = this;
        if (val)
          self.$nextTick(function() {
            self.$refs.timepicker.ajustScrollTop();
          });
      },
      selectionMode: function(newVal) {
        if (newVal === 'month') {
          if (this.currentView !== 'year' || this.currentView !== 'month') {
            this.currentView = 'month';
          }
        } else if (newVal === 'week') {
          this.week = VueUtil.getWeekNumber(this.date);
        }
      },
      date: function(newVal) {
        this.year = newVal.getFullYear();
        this.month = newVal.getMonth();
      }
    },
    methods: {
      handleClear: function() {
        this.date = this.defaultValue ? new Date(this.defaultValue) : new Date();
        this.$emit('pick');
      },
      resetDate: function() {
        this.date = new Date(this.date);
      },
      showMonthPicker: function() {
        this.currentView = 'month';
      },
      showYearPicker: function() {
        this.currentView = 'year';
      },
      prevMonth: function() {
        // this.date = VueUtil.addDate(this.date, -1, 'month');
        // this.resetDate();
        var month = this.month - 1;
        if (month < 0) {
          this.month = 11;
          this.year = this.year - 1;
        } else {
          this.month = month;
        }
      },
      nextMonth: function() {
        // this.date = VueUtil.addDate(this.date, 1, 'month');
        // this.resetDate();
        var month = this.month + 1;
        if (month > 11) {
          this.month = 0;
          this.year = this.year + 1;
        } else {
          this.month = month;
        }
      },
      nextYear: function() {
        if (this.currentView === 'year') {
          this.$refs.yearTable.nextTenYear();
        } else {
          this.year = this.year + 1;
          //this.resetDate();
        }
      },
      prevYear: function() {
        if (this.currentView === 'year') {
          this.$refs.yearTable.prevTenYear();
        } else {
          this.year = this.year - 1;
          //this.resetDate();
        }
      },
      handleShortcutClick: function(shortcut) {
        if (shortcut.onClick) {
          shortcut.onClick(this);
        }
      },
      handleTimePick: function(picker, visible, first) {
        if (picker) {
          var oldDate = new Date(this.date.getTime());
          var hour = picker.getHours();
          var minute = picker.getMinutes();
          var second = picker.getSeconds();
          oldDate.setHours(hour);
          oldDate.setMinutes(minute);
          oldDate.setSeconds(second);
          this.date = new Date(oldDate.getTime());
        }
        if (!first) {
          this.timePickerVisible = visible;
        }
      },
      handleMonthPick: function(month) {
        this.month = month;
        var selectionMode = this.selectionMode;
        if (selectionMode !== 'month') {
          //this.date.setMonth(month);
          this.currentView = 'date';
          //this.resetDate();
        } else {
          this.date.setMonth(month);
          this.year && this.date.setFullYear(this.year);
          this.resetDate();
          var value = new Date(this.date.getFullYear(), month, 1);
          this.$emit('pick', value);
        }
      },
      handleDatePick: function(value) {
        if (this.selectionMode === 'day') {
          if (!this.showTime) {
            this.$emit('pick', new Date(value.getTime()));
          }
          this.date.setFullYear(value.getFullYear());
          this.date.setMonth(value.getMonth(), value.getDate());
        } else if (this.selectionMode === 'week') {
          this.week = value.week;
          this.$emit('pick', value.date);
        }
        this.resetDate();
      },
      handleYearPick: function(year, close) {
        if (!VueUtil.isDef(close)) close = true;
        this.year = year;
        if (!close) return;
        this.date.setFullYear(year);
        if (this.selectionMode === 'year') {
          this.$emit('pick', new Date(year));
        } else {
          this.currentView = 'month';
        }
        this.resetDate();
      },
      changeToNow: function() {
        this.date.setTime(+new Date());
        this.$emit('pick', new Date(this.date.getTime()));
        this.resetDate();
      },
      confirm: function() {
        this.$emit('pick', this.date);
      },
      resetView: function() {
        if (this.selectionMode === 'month') {
          this.currentView = 'month';
        } else if (this.selectionMode === 'year') {
          this.currentView = 'year';
        } else {
          this.currentView = 'date';
        }
        if (this.selectionMode !== 'week') {
          this.year = this.date.getFullYear();
          this.month = this.date.getMonth();
        }
      }
    },
    components: {
      TimePicker: VueTimePicker,
      YearTable: YearTable,
      MonthTable: MonthTable,
      DateTable: DateTable
    },
    mounted: function() {
      if (this.date && !this.year) {
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
      }
    },
    data: function() {
      return {
        popperClass: '',
        pickerWidth: 0,
        date: this.defaultValue ? new Date(this.defaultValue) : new Date(),
        value: '',
        showTime: false,
        selectionMode: 'day',
        shortcuts: '',
        visible: false,
        currentView: 'date',
        disabledDate: '',
        firstDayOfWeek: 0,
        year: null,
        month: null,
        week: null,
        showWeekNumber: false,
        timePickerVisible: false,
        format: ''
      };
    },
    computed: {
      footerVisible: function() {
        return this.showTime;
      },
      visibleTime: {
        get: function() {
          return VueUtil.formatDate(this.date, this.timeFormat);
        },
        set: function(val) {
          if (val) {
            var date = VueUtil.parseDate(val, this.timeFormat);
            if (date) {
              date.setFullYear(this.date.getFullYear());
              date.setMonth(this.date.getMonth());
              date.setDate(this.date.getDate());
              this.date = date;
              this.$refs.timepicker.value = date;
              this.timePickerVisible = false;
            }
          }
        }
      },
      visibleDate: {
        get: function() {
          return VueUtil.formatDate(this.date);
        },
        set: function(val) {
          var date = VueUtil.parseDate(val, 'yyyy-MM-dd');
          if (!date) return;
          if (VueUtil.isFunction(this.disabledDate) && this.disabledDate(date)) return;
          date.setHours(this.date.getHours());
          date.setMinutes(this.date.getMinutes());
          date.setSeconds(this.date.getSeconds());
          this.date = date;
          this.resetView();
        }
      },
      yearLabel: function() {
        var year = this.year;
        if (!year)
          return '';
        var yearTranslation = this.$t('vue.datepicker.year');
        if (this.currentView === 'year') {
          var startYear = Math.floor(year / 10) * 10;
          if (yearTranslation) {
            return startYear + ' ' + yearTranslation + ' - ' + (startYear + 9) + ' ' + yearTranslation;
          }
          return startYear + ' - ' + (startYear + 9);
        }
        return this.year + ' ' + yearTranslation;
      },
      timeFormat: function() {
        if (this.format && this.format.indexOf('ss') === -1) {
          return 'HH:mm';
        } else {
          return 'HH:mm:ss';
        }
      },
      monthLabel: function() {
        return this.$t('vue.datepicker.month' + (this.month + 1));
      },
      nowLabel: function() {
        return this.$t('vue.datepicker.now');
      },
      confirmLabel: function() {
        return this.$t('vue.datepicker.confirm');
      }
    }
  };
  var DateRangePanel = {
    template: '<transition @after-leave="$emit(\'destroyPopper\')"><div v-show="visible" :class="[\'vue-picker-panel vue-date-range-picker\', {\'has-sidebar\': $slots.sidebar || shortcuts,\'has-time\': showTime}, popperClass]"><div class="vue-picker-panel__body-wrapper"><slot name="sidebar" class="vue-picker-panel__sidebar"></slot><div class="vue-picker-panel__sidebar" v-if="shortcuts"><button type="button" class="vue-picker-panel__shortcut" v-for="shortcut in shortcuts" @click="handleShortcutClick(shortcut)">{{shortcut.text}}</button></div><div class="vue-picker-panel__body"><div class="vue-date-range-picker__time-header" v-if="showTime"><span class="vue-date-range-picker__editors-wrap"><span class="vue-date-range-picker__time-picker-wrap"><vue-input size="small" :placeholder="$t(\'vue.datepicker.startDate\')" ref="minInput" class="vue-date-range-picker__editor" :value="minVisibleDate" @input.native="handleDateInput($event, \'min\')" @change.native="handleDateChange($event, \'min\')" /></span><span class="vue-date-range-picker__time-picker-wrap"><vue-input size="small" :placeholder="$t(\'vue.datepicker.startTime\')" class="vue-date-range-picker__editor" :value="minVisibleTime" @focus="minTimePickerVisible = !minTimePickerVisible" @change.native="handleTimeChange($event, \'min\')" /><time-picker :picker-width="minPickerWidth" ref="minTimePicker" :date="minDate" @pick="handleMinTimePick" :visible="minTimePickerVisible"></time-picker></span></span><span class="vue-icon-arrow-right"></span><span class="vue-date-range-picker__editors-wrap is-right"><span class="vue-date-range-picker__time-picker-wrap"><vue-input size="small" :placeholder="$t(\'vue.datepicker.endDate\')" class="vue-date-range-picker__editor" :value="maxVisibleDate" :readonly="!minDate" @input.native="handleDateInput($event, \'max\')" @change.native="handleDateChange($event, \'max\')" /></span><span class="vue-date-range-picker__time-picker-wrap"><vue-input size="small" :placeholder="$t(\'vue.datepicker.endTime\')" ref="maxInput" class="vue-date-range-picker__editor" :value="maxVisibleTime" @focus="minDate && (maxTimePickerVisible = !maxTimePickerVisible)" :readonly="!minDate" @change.native="handleTimeChange($event, \'max\')" /><time-picker :picker-width="maxPickerWidth" ref="maxTimePicker" :date="maxDate" @pick="handleMaxTimePick" :visible="maxTimePickerVisible"></time-picker></span></span></div><div class="vue-picker-panel__content vue-date-range-picker__content is-left"><div class="vue-date-range-picker__header"><button type="button" @click="prevYear" class="vue-picker-panel__icon-btn vue-icon-d-arrow-left"></button><button type="button" @click="prevMonth" class="vue-picker-panel__icon-btn vue-icon-arrow-left"></button><div>{{leftLabel}}</div></div><date-table selection-mode="range" :date="date" :year="leftYear" :month="leftMonth" :min-date="minDate" :max-date="maxDate" :range-state="rangeState" :disabled-date="disabledDate" @changerange="handleChangeRange" :first-day-of-week="firstDayOfWeek" @pick="handleRangePick"></date-table></div><div class="vue-picker-panel__content vue-date-range-picker__content is-right"><div class="vue-date-range-picker__header"><button type="button" @click="nextYear" class="vue-picker-panel__icon-btn vue-icon-d-arrow-right"></button><button type="button" @click="nextMonth" class="vue-picker-panel__icon-btn vue-icon-arrow-right"></button><div>{{rightLabel}}</div></div><date-table selection-mode="range" :date="rightDate" :year="rightYear" :month="rightMonth" :min-date="minDate" :max-date="maxDate" :range-state="rangeState" :disabled-date="disabledDate" @changerange="handleChangeRange" :first-day-of-week="firstDayOfWeek" @pick="handleRangePick"></date-table></div></div></div><div class="vue-picker-panel__footer" v-if="showTime"><a class="vue-picker-panel__link-btn" @click="handleClear">{{clearLabel}}</a><button type="button" class="vue-picker-panel__btn" @click="handleConfirm()" :disabled="btnDisabled">{{confirmLabel}}</button></div></div></transition>',
    components: {
      TimePicker: VueTimePicker,
      DateTable: DateTable
    },
    computed: {
      btnDisabled: function() {
        return !(this.minDate && this.maxDate && !this.selecting);
      },
      leftLabel: function() {
        return this.date.getFullYear() + ' ' + this.$t('vue.datepicker.year') + ' ' + this.$t('vue.datepicker.month' + (this.date.getMonth() + 1));
      },
      rightLabel: function() {
        return this.rightDate.getFullYear() + ' ' + this.$t('vue.datepicker.year') + ' ' + this.$t('vue.datepicker.month' + (this.rightDate.getMonth() + 1));
      },
      clearLabel: function() {
        return this.$t('vue.datepicker.clear');
      },
      confirmLabel: function() {
        return this.$t('vue.datepicker.confirm');
      },
      leftYear: function() {
        return this.date.getFullYear();
      },
      leftMonth: function() {
        return this.date.getMonth();
      },
      rightYear: function() {
        return this.rightDate.getFullYear();
      },
      rightMonth: function() {
        return this.rightDate.getMonth();
      },
      minVisibleDate: function() {
        return this.minDate ? VueUtil.formatDate(this.minDate) : '';
      },
      maxVisibleDate: function() {
        return (this.maxDate || this.minDate) ? VueUtil.formatDate(this.maxDate || this.minDate) : '';
      },
      minVisibleTime: function() {
        return this.minDate ? VueUtil.formatDate(this.minDate, 'HH:mm:ss') : '';
      },
      maxVisibleTime: function() {
        return (this.maxDate || this.minDate) ? VueUtil.formatDate(this.maxDate || this.minDate, 'HH:mm:ss') : '';
      },
      rightDate: function() {
        var newDate = new Date(this.date);
        var month = newDate.getMonth();
        newDate.setDate(1);
        if (month === 11) {
          newDate.setFullYear(newDate.getFullYear() + 1);
          newDate.setMonth(0);
        } else {
          newDate.setMonth(month + 1);
        }
        return newDate;
      }
    },
    data: function() {
      return {
        popperClass: '',
        minPickerWidth: 0,
        maxPickerWidth: 0,
        date: new Date(),
        minDate: '',
        maxDate: '',
        rangeState: {
          endDate: null,
          selecting: false,
          row: null,
          column: null
        },
        showTime: false,
        shortcuts: '',
        value: '',
        visible: '',
        disabledDate: '',
        firstDayOfWeek: 0,
        minTimePickerVisible: false,
        maxTimePickerVisible: false
      };
    },
    watch: {
      showTime: function(val) {
        if (!val)
          return;
        var self = this;
        self.$nextTick(function() {
          var minInputElm = self.$refs.minInput.$el;
          var maxInputElm = self.$refs.maxInput.$el;
          if (minInputElm) {
            self.minPickerWidth = minInputElm.getBoundingClientRect().width + 10;
          }
          if (maxInputElm) {
            self.maxPickerWidth = maxInputElm.getBoundingClientRect().width + 10;
          }
        });
      },
      minDate: function() {
        var self = this;
        self.$nextTick(function() {
          if (self.maxDate && this.maxDate < this.minDate) {
            var format = 'HH:mm:ss';
            self.$refs.maxTimePicker.selectableRange = [[VueUtil.parseDate(VueUtil.formatDate(self.minDate, format), format), VueUtil.parseDate('23:59:59', format)]];
          }
        });
      },
      minTimePickerVisible: function(val) {
        var self = this;
        if (val)
          self.$nextTick(function() {
            self.$refs.minTimePicker.ajustScrollTop();
          });
      },
      maxTimePickerVisible: function(val) {
        var self = this;
        if (val)
          self.$nextTick(function() {
            self.$refs.maxTimePicker.ajustScrollTop();
          });
      },
      value: function(newVal) {
        if (!newVal) {
          this.minDate = null;
          this.maxDate = null;
        } else if (VueUtil.isArray(newVal)) {
          this.minDate = VueUtil.toDate(newVal[0]);
          this.maxDate = VueUtil.toDate(newVal[1]);
          if (this.minDate) this.date = new Date(this.minDate);
          this.handleConfirm(true);
        }
      }
    },
    methods: {
      handleClear: function() {
        this.minDate = null;
        this.maxDate = null;
        this.handleConfirm(false);
      },
      handleDateInput: function(event, type) {
        var value = event.target.value;
        var parsedValue = VueUtil.parseDate(value, 'yyyy-MM-dd');
        if (parsedValue) {
          if (VueUtil.isFunction(this.disabledDate) && this.disabledDate(new Date(parsedValue))) {
            return;
          }
          var target = new Date(type === 'min' ? this.minDate : this.maxDate);
          if (target) {
            target.setFullYear(parsedValue.getFullYear());
            target.setMonth(parsedValue.getMonth(), parsedValue.getDate());
          }
        }
      },
      handleChangeRange: function(val) {
        this.minDate = val.minDate;
        this.maxDate = val.maxDate;
        this.rangeState = val.rangeState;
      },
      handleDateChange: function(event, type) {
        var value = event.target.value;
        var parsedValue = VueUtil.parseDate(value, 'yyyy-MM-dd');
        if (parsedValue) {
          var target = new Date(type === 'min' ? this.minDate : this.maxDate);
          if (target) {
            target.setFullYear(parsedValue.getFullYear());
            target.setMonth(parsedValue.getMonth(), parsedValue.getDate());
          }
          if (type === 'min') {
            if (target < this.maxDate) {
              this.minDate = new Date(target.getTime());
            }
          } else {
            if (target > this.minDate) {
              this.maxDate = new Date(target.getTime());
              if (this.minDate && this.minDate > this.maxDate) {
                this.minDate = null;
              }
            }
          }
        }
      },
      handleTimeChange: function(event, type) {
        var value = event.target.value;
        var parsedValue = VueUtil.parseDate(value, 'HH:mm:ss');
        if (parsedValue) {
          var target = new Date(type === 'min' ? this.minDate : this.maxDate);
          if (target) {
            target.setHours(parsedValue.getHours());
            target.setMinutes(parsedValue.getMinutes());
            target.setSeconds(parsedValue.getSeconds());
          }
          if (type === 'min') {
            if (target < this.maxDate) {
              this.minDate = new Date(target.getTime());
            }
          } else {
            if (target > this.minDate) {
              this.maxDate = new Date(target.getTime());
            }
          }
          this.$refs[type + 'TimePicker'].value = target;
          this[type + 'TimePickerVisible'] = false;
        }
      },
      handleRangePick: function(val, close) {
        if (!VueUtil.isDef(close)) close = true;
        if (this.maxDate === val.maxDate && this.minDate === val.minDate) return;
        this.onPick && this.onPick(val);
        this.maxDate = val.maxDate;
        this.minDate = val.minDate;
        if (!close || this.showTime) return;
        this.handleConfirm();
      },
      changeToToday: function() {
        this.date = new Date();
      },
      handleShortcutClick: function(shortcut) {
        if (shortcut.onClick) {
          shortcut.onClick(this);
        }
      },
      resetView: function() {
        this.minTimePickerVisible = false;
        this.maxTimePickerVisible = false;
      },
      setTime: function(date, value) {
        var oldDate = new Date(date.getTime());
        var hour = value.getHours();
        var minute = value.getMinutes();
        var second = value.getSeconds();
        oldDate.setHours(hour);
        oldDate.setMinutes(minute);
        oldDate.setSeconds(second);
        return new Date(oldDate.getTime());
      },
      handleMinTimePick: function(value, visible, first) {
        this.minDate = this.minDate || new Date();
        if (value) {
          this.minDate = this.setTime(this.minDate, value);
        }
        if (!first) {
          this.minTimePickerVisible = visible;
        }
      },
      handleMaxTimePick: function(value, visible, first) {
        if (!this.maxDate) {
          var now = new Date();
          if (now >= this.minDate) {
            this.maxDate = new Date();
          }
        }
        if (this.maxDate && value) {
          this.maxDate = this.setTime(this.maxDate, value);
        }
        if (!first) {
          this.maxTimePickerVisible = visible;
        }
      },
      prevMonth: function() {
        this.date = VueUtil.addDate(this.date, -1, 'month');
      },
      nextMonth: function() {
        this.date = VueUtil.addDate(this.date, 1, 'month');
      },
      nextYear: function() {
        var date = this.date;
        date.setFullYear(date.getFullYear() + 1);
        this.resetDate();
      },
      prevYear: function() {
        var date = this.date;
        date.setFullYear(date.getFullYear() - 1);
        this.resetDate();
      },
      handleConfirm: function(visible) {
        visible = visible || false;
        this.$emit('pick', [this.minDate, this.maxDate], visible);
      },
      resetDate: function() {
        this.date = new Date(this.date);
      }
    }
  };
  var VueDatePicker = {
    mixins: [VuePicker],
    name: 'VueDatePicker',
    props: {
      type: {
        type: String,
        default: 'date'
      }
    },
    methods: {
      getPanel: function(type) {
        if (type === 'daterange' || type === 'datetimerange') {
          return DateRangePanel;
        }
        return DatePanel;
      }
    },
    watch: {
      type: function(type) {
        if (this.picker) {
          this.unmountPicker();
          this.panel = this.getPanel(type);
          this.mountPicker();
        } else {
          this.panel = this.getPanel(type);
        }
      }
    },
    created: function() {
      this.panel = this.getPanel(this.type);
    }
  };
  Vue.component(VueDatePicker.name, VueDatePicker);
  return function() {
    return {
      DatePanel: DatePanel,
      YearTable: YearTable,
      MonthTable: MonthTable
    };
  };
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VuePopup'], definition);
  } else {
    context.VueMessageBox = definition(context.Vue, context.VueUtil, context.VuePopup);
    delete context.VueMessageBox;
  }
})(this, function(Vue, VueUtil, VuePopup) {
  'use strict';
  var VueMessageBox = {
    template: '<div><div class="vue-message-box__wrapper" v-show="visible"></div><transition name="msgbox-fade" @after-leave="doDestroy"><div :class="[\'vue-message-box\', customClass]" v-show="visible"><div class="vue-message-box__header" v-if="title !== null"><div class="vue-message-box__title">{{title || $t(\'vue.messagebox.title\')}}</div></div><div class="vue-message-box__content" v-if="message !== \'\'"><div :class="[\'vue-message-box__status\', typeClass]"></div><div class="vue-message-box__message" :style="{\'margin-left\': typeClass ? \'50px\' : \'0\'}"><slot><p>{{message}}</p></slot></div></div><div class="vue-message-box__btns"><vue-button :loading="cancelButtonLoading" :class="[cancelButtonClasses]" v-if="showCancelButton" @click.native="handleAction(\'cancel\')">{{cancelButtonText || $t(\'vue.messagebox.cancel\')}}</vue-button><vue-button :loading="confirmButtonLoading" ref="confirm" :class="[confirmButtonClasses]" @click.native="handleAction(\'confirm\')">{{confirmButtonText || $t(\'vue.messagebox.confirm\')}}</vue-button></div></div></transition></div>',
    mixins: [VuePopup],
    computed: {
      typeClass: function() {
        var typeMap = {
          success: 'success',
          info: 'information',
          warning: 'warning',
          error: 'error'
        };
        return this.type && typeMap[this.type.toLowerCase()] ? 'vue-icon-' + typeMap[this.type.toLowerCase()] : '';
      },
      confirmButtonClasses: function() {
        return 'vue-button--primary ' + this.confirmButtonClass;
      },
      cancelButtonClasses: function() {
        return this.cancelButtonClass;
      }
    },
    methods: {
      getSafeClose: function() {
        var self = this;
        var currentId = self.uid;
        return function() {
          self.$nextTick(function() {
            if (currentId === self.uid) self.doClose();
          });
        };
      },
      doClose: function() {
        var self = this;
        if (!self.visible) return;
        self.visible = false;
        self.opened = false;
        if (self.action) self.callback(self.action, self);
      },
      handleAction: function(action) {
        this.action = action;
        if (VueUtil.isFunction(this.beforeClose)) {
          this.close = this.getSafeClose();
          this.beforeClose(action, this, this.close);
        } else {
          this.doClose();
        }
      },
      doDestroy: function() {
        this.$destroy();
      }
    },
    watch: {
      visible: function(val) {
        var self = this;
        if (val) {
          self.uid++;
          self.$nextTick(function() {
            self.$refs.confirm.$el.focus();
          });
        }
      }
    },
    data: function() {
      return {
        uid: 1,
        title: null,
        message: '',
        type: '',
        customClass: '',
        showCancelButton: false,
        action: '',
        confirmButtonText: '',
        cancelButtonText: '',
        confirmButtonLoading: false,
        cancelButtonLoading: false,
        confirmButtonClass: '',
        cancelButtonClass: '',
        callback: null,
        beforeClose: null
      };
    }
  };
  var MessageBoxConstructor = Vue.extend(VueMessageBox);
  var currentMsg, instance;
  var msgQueue = [];
  var defaultCallback = function(action) {
    if (currentMsg) {
      if (action === 'confirm') {
        currentMsg.resolve(action);
      }
      if (action === 'cancel') {
        currentMsg.reject(action);
      }
    }
  };
  var initInstance = function() {
    instance = new MessageBoxConstructor({
      el: document.createElement('div')
    });
    instance.callback = defaultCallback;
  };
  var showNextMsg = function() {
    initInstance();
    instance.action = '';
    if (!instance.visible) {
      if (msgQueue.length > 0) {
        currentMsg = msgQueue.shift();
        var options = currentMsg.options;
        VueUtil.ownPropertyLoop(options, function(prop) {
          instance[prop] = options[prop];
        });
        if (!VueUtil.isDef(options.callback)) {
          instance.callback = defaultCallback;
        }
        var oldCb = instance.callback;
        instance.callback = function(action, instance) {
          oldCb(action, instance);
          showNextMsg();
        };
        if (VueUtil.isVNode(instance.message)) {
          instance.$slots.default = [instance.message];
          instance.message = null;
        }
        document.body.appendChild(instance.$el);
        Vue.nextTick(function() {
          instance.visible = true;
        });
      }
    }
  };
  var MessageBox = function(options) {
    var callback;
    if (options.callback) {
      callback = options.callback;
    }
    return new Promise(function(resolve, reject) {
      msgQueue.push({
        options: VueUtil.merge({}, options, {closeOnPressEscape: false}),
        callback: callback,
        resolve: resolve,
        reject: reject
      });
      showNextMsg();
    });
  };
  var messageBoxAlert = function(options) {
    return new MessageBox(VueUtil.merge({}, options, {showCancelButton: false}));
  };
  var messageBoxConfirm = function(options) {
    return new MessageBox(VueUtil.merge({}, options, {showCancelButton: true}));
  };
  Vue.prototype.$alert = messageBoxAlert;
  Vue.prototype.$confirm = messageBoxConfirm;
  Vue.alert = messageBoxAlert;
  Vue.confirm = messageBoxConfirm;
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueNotification = definition(context.Vue, context.VueUtil);
    delete context.VueNotification;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueNotification = {
    template: '<transition :name="isLeft ? \'notify-left\' : isTop ? \'notify-top\' : isBottom ? \'notify-bottom\' : isCenter? \'notify-center\' : \'notify-right\'" @after-leave="doDestroy"><div :class="[\'vue-notification\', {\'vue-notification-translateX\':centerX, \'vue-notification-translateY\':centerY},customClass]" v-show="visible" :style="{top: top ? top + \'px\' : \'auto\', bottom: bottom ? bottom + \'px\' : \'auto\', left: left ? left + \'px\' : \'auto\', right: right ? right + \'px\' : \'auto\'}"><i :class="[\'vue-notification__icon\', typeClass, iconClass]" v-if="type || iconClass"></i><div class="vue-notification__group"><h2 class="vue-notification__title" v-text="title" v-if="showTitle"></h2><div class="vue-notification__content" v-if="showMessage" :style="{\'margin-top\':showTitle?\'10px\':\'\'}"><slot>{{message}}</slot></div><div class="vue-notification__closeBtn vue-icon-close" @click="close" v-if="duration===0 || showClose"></div></div></div></transition>',
    data: function() {
      return {
        visible: false,
        title: '',
        message: '',
        duration: 3000,
        type: '',
        customClass: '',
        iconClass: '',
        onClose: null,
        closed: false,
        top: null,
        bottom: null,
        left: null,
        right: null,
        centerX: false,
        centerY: false,
        position: 'top-right',
        isLeft: false,
        isTop: false,
        isBottom: false,
        isCenter: false,
        showClose: false
      };
    },
    computed: {
      showTitle: function() {
        if (VueUtil.trim(this.title) === '') {
          return false;
        }
        return true;
      },
      showMessage: function() {
        if (VueUtil.trim(this.message) === '' && !this.$slots.default) {
          return false;
        }
        return true;
      },
      typeClass: function() {
        var typeMap = {
          success: 'success',
          info: 'information',
          warning: 'warning',
          error: 'error'
        };
        return this.type && typeMap[this.type.toLowerCase()] ? 'vue-icon-' + typeMap[this.type.toLowerCase()] : '';
      }
    },
    methods: {
      close: function() {
        this.closed = true;
        if (VueUtil.isFunction(this.onClose)) {
          this.onClose();
        }
      },
      doDestroy: function() {
        this.$destroy();
      }
    },
    mounted: function() {
      if (this.duration > 0) {
        VueUtil.debounce(this.duration, function() {
          !this.closed && this.close();
        }).call(this);
      }
    }
  };
  var NotificationConstructor = Vue.extend(VueNotification);
  var instances = [];
  var leftTopInstances = [];
  var leftBottomInstances = [];
  var rightTopInstances = [];
  var rightBottomInstances = [];
  var centerTopInstances = [];
  var centerBottomInstances = [];
  var insertIns = function(insertInstances, instance, position) {
    var distHeight = 8;
    instance[position] = distHeight;
    if (!VueUtil.config.notifyStack) {
      VueUtil.loop(insertInstances, function(insertInstance) {
        distHeight += insertInstance.dom.offsetHeight + 8;
      });
      instance[position] = distHeight;
    }
    insertInstances.push(instance);
  };
  var removeIns = function(removeInstances, instance, position) {
    var removedHeight = instance.dom.offsetHeight + 8;
    var removeIndex = removeInstances.indexOf(instance);
    removeInstances.splice(removeIndex, 1);
    if (!VueUtil.config.notifyStack) {
      VueUtil.loop(removeInstances, function(removeInstance, index) {
        if (index < removeIndex) return;
        removeInstance.dom.style[position] = parseInt(removeInstance.dom.style[position], 10) - removedHeight + 'px';
      });
    }
  };
  var getinsPos = function(instance) {
    var instancePosition = instance.position.split('-');
    var positionX = instancePosition[1];
    var positionY = instancePosition[0];
    var insPos = {};
    insPos.isLeft = (positionX.indexOf('left') !== -1);
    insPos.isCenterX = (positionX.indexOf('center') !== -1);
    insPos.isRight = (positionX.indexOf('right') !== -1);
    insPos.isTop = (positionY.indexOf('top') !== -1);
    insPos.isCenterY = (positionY.indexOf('center') !== -1);
    insPos.isBottom = (positionY.indexOf('bottom') !== -1);
    return insPos;
  };
  var Notification = function(options) {
    options = options || {};
    var userOnClose = options.onClose;
    var id = 'notification-' + VueUtil.createUuid();
    options.onClose = function() {
      Notification.close(id, userOnClose);
    };
    var instance = new NotificationConstructor({
      data: options
    });
    if (VueUtil.isVNode(options.message)) {
      instance.$slots.default = [options.message];
      options.message = '';
    }
    instance.id = id;
    instance.vm = instance.$mount();
    instance.dom = instance.vm.$el;
    instance.dom.style.zIndex = VueUtil.nextZIndex();
    var insPos = getinsPos(instance);
    if ((!insPos.isLeft && !insPos.isCenterX && !insPos.isRight) || (!insPos.isTop && !insPos.isCenterY && !insPos.isBottom)) {
      instance.$destroy();
      return;
    }
    instance.isLeft = false;
    instance.isBottom = false;
    instance.top = false;
    instance.isCenter = false;
    if (insPos.isCenterY) {
      instance.centerY = true;
    }
    if (insPos.isLeft) {
      instance.left = 8;
      instance.isLeft = true;
    }
    if (insPos.isCenterX) {
      instance.centerX = true;
      instance.isCenter = true;
      insPos.isBottom && (instance.isBottom = true);
      insPos.isTop && (instance.isTop = true);
    }
    if (insPos.isRight) {
      instance.right = 8;
    }
    if (insPos.isBottom) {
      var position = 'bottom';
      insPos.isLeft && insertIns(leftBottomInstances, instance, position);
      insPos.isCenterX && insertIns(centerBottomInstances, instance, position);
      insPos.isRight && insertIns(rightBottomInstances, instance, position);
    }
    if (insPos.isTop) {
      var position = 'top';
      insPos.isLeft && insertIns(leftTopInstances, instance, position);
      insPos.isCenterX && insertIns(centerTopInstances, instance, position);
      insPos.isRight && insertIns(rightTopInstances, instance, position);
    }
    instance.dom.style.display = '';
    instance.dom.style.opacity = 0;
    instances.push(instance);
    document.body.appendChild(instance.vm.$el);
    Vue.nextTick(function() {
      instance.vm.visible = true;
      instance.dom.style.opacity = 1;
    });
  };
  VueUtil.loop(['success', 'warning', 'info', 'error'], function(type) {
    Notification[type] = function(options) {
      options.type = type;
      Notification(options);
    };
  });
  Notification.close = function(id, userOnClose) {
    VueUtil.loop(instances, function(instance, i) {
      if (id === instance.id) {
        if (VueUtil.isFunction(userOnClose)) {
          userOnClose(instance);
        }
        var insPos = getinsPos(instance);
        if (insPos.isBottom) {
          var position = 'bottom';
          insPos.isLeft && removeIns(leftBottomInstances, instance, position);
          insPos.isCenterX && removeIns(centerBottomInstances, instance, position);
          insPos.isRight && removeIns(rightBottomInstances, instance, position);
        }
        if (insPos.isTop) {
          var position = 'top';
          insPos.isLeft && removeIns(leftTopInstances, instance, position);
          insPos.isCenterX && removeIns(centerTopInstances, instance, position);
          insPos.isRight && removeIns(rightTopInstances, instance, position);
        }
        instance.vm.visible = false;
        instances.splice(i, 1);
        return false;
      }
    });
  };
  Vue.prototype.$notify = Notification;
  Vue.notify = Notification;
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VuePagination = definition(context.Vue, context.VueUtil);
    delete context.VuePagination;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VuePager = {
    template: '<ul @click="onPagerClick" class="vue-pager"><li :class="{active: currentPage === 1}" v-if="pageCount > 0" class="number">1</li><li :class="[\'vue-icon more btn-quickprev\', quickprevIconClass]" v-if="showPrevMore" @mouseenter="quickprevIconClass = \'vue-icon-d-arrow-left\'" @mouseleave="quickprevIconClass = \'vue-icon-more\'"></li><li v-for="pager in pagers" :class="[\'number\', {active: currentPage === pager}]">{{pager}}</li><li :class="[\'vue-icon more btn-quicknext\', quicknextIconClass]" v-if="showNextMore" @mouseenter="quicknextIconClass = \'vue-icon-d-arrow-right\'" @mouseleave="quicknextIconClass = \'vue-icon-more\'"></li><li :class="[\'number\', {active: currentPage === pageCount}]" v-if="pageCount > 1">{{pageCount}}</li></ul>',
    name: 'VuePager',
    props: {
      currentPage: Number,
      pageCount: Number
    },
    watch: {
      showPrevMore: function(val) {
        if (!val) this.quickprevIconClass = 'vue-icon-more';
      },
      showNextMore: function(val) {
        if (!val) this.quicknextIconClass = 'vue-icon-more';
      }
    },
    methods: {
      onPagerClick: function(event) {
        var target = event.target;
        if (target.tagName === 'UL') {
          return;
        }
        var newPage = Number(event.target.textContent);
        var pageCount = this.pageCount;
        var currentPage = this.currentPage;
        if (target.className.indexOf('more') !== -1) {
          if (target.className.indexOf('quickprev') !== -1) {
            newPage = currentPage - 5;
          } else if (target.className.indexOf('quicknext') !== -1) {
            newPage = currentPage + 5;
          }
        }
        if (!isNaN(newPage)) {
          if (newPage < 1) {
            newPage = 1;
          }
          if (newPage > pageCount) {
            newPage = pageCount;
          }
        }
        if (newPage !== currentPage) {
          this.$emit('change', newPage);
        }
      }
    },
    computed: {
      pagers: function() {
        var pagerCount = 7;
        var currentPage = Number(this.currentPage);
        var pageCount = Number(this.pageCount);
        var showPrevMore = false;
        var showNextMore = false;
        if (pageCount > pagerCount) {
          if (currentPage > pagerCount - 2) {
            showPrevMore = true;
          }
          if (currentPage < pageCount - 2) {
            showNextMore = true;
          }
        }
        var array = [];
        if (showPrevMore && !showNextMore) {
          var startPage = pageCount - (pagerCount - 2);
          for (var i = startPage; i < pageCount; i++) {
            array.push(i);
          }
        } else if (!showPrevMore && showNextMore) {
          for (var i = 2; i < pagerCount; i++) {
            array.push(i);
          }
        } else if (showPrevMore && showNextMore) {
          var offset = Math.floor(pagerCount / 2) - 1;
          for (var i = currentPage - offset; i <= currentPage + offset; i++) {
            array.push(i);
          }
        } else {
          for (var i = 2; i < pageCount; i++) {
            array.push(i);
          }
        }
        this.showPrevMore = showPrevMore;
        this.showNextMore = showNextMore;
        return array;
      }
    },
    data: function() {
      return {
        current: null,
        showPrevMore: false,
        showNextMore: false,
        quicknextIconClass: 'vue-icon-more',
        quickprevIconClass: 'vue-icon-more'
      };
    }
  };
  var VuePagination = {
    name: 'VuePagination',
    props: {
      pageSize: {
        type: Number,
        default: 10
      },
      small: Boolean,
      total: Number,
      pageCount: Number,
      currentPage: {
        type: Number,
        default: 1
      },
      layout: {
        default: 'prev, pager, next, jumper, ->, total'
      },
      pageSizes: {
        type: Array,
        default: function() {
          return [10, 20, 30, 40, 50, 100];
        }
      }
    },
    data: function() {
      return {
        internalCurrentPage: 1,
        internalPageSize: 0
      };
    },
    render: function(createElement) {
      var self = this;
      var template = createElement('div', {class: 'vue-pagination'}, []);
      var layout = self.layout || '';
      if (!layout) return;
      var TEMPLATE_MAP = {
        prev: createElement('prev', null, []),
        jumper: createElement('jumper', null, []),
        pager: createElement('pager', {attrs: {currentPage: self.internalCurrentPage, pageCount: self.internalPageCount}, on: {change: self.handleCurrentChange}}, []),
        next: createElement('next', null, []),
        sizes: createElement('sizes', {attrs: {pageSizes: self.pageSizes}}, []),
        slot: createElement('my-slot', null, []),
        total: createElement('total', null, [])
      };
      var components = VueUtil.map(layout.split(','), function(item) {return item.trim();});
      var rightWrapper = createElement('div', {class: 'vue-pagination__rightwrapper'}, []);
      var haveRightWrapper = false;
      if (self.small) {
        template.data.class += ' vue-pagination--small';
      }
      VueUtil.loop(components, function(compo) {
        if (compo === '->') {
          haveRightWrapper = true;
          return;
        }
        if (!haveRightWrapper) {
          template.children.push(TEMPLATE_MAP[compo]);
        } else {
          rightWrapper.children.push(TEMPLATE_MAP[compo]);
        }
      });
      if (haveRightWrapper) {
        template.children.push(rightWrapper);
      }
      return template;
    },
    components: {
      MySlot: {
        render: function(createElement) {
          return this.$parent.$slots.default ? this.$parent.$slots.default[0] : '';
        }
      },
      Prev: {
        render: function(createElement) {
          return createElement('button', {attrs: {type: 'button'}, class: ['btn-prev', {disabled: this.$parent.internalCurrentPage <= 1}], on: {click: this.$parent.prev}}, [createElement('i', {class: 'vue-icon vue-icon-arrow-left'}, [])]);
        }
      },
      Next: {
        render: function(createElement) {
          return createElement('button', {attrs: {type: 'button'}, class: ['btn-next', {disabled: this.$parent.internalCurrentPage === this.$parent.internalPageCount || 0 === this.$parent.internalPageCount}], on: {click: this.$parent.next}}, [createElement('i', {class: 'vue-icon vue-icon-arrow-right'}, [])]);
        }
      },
      Sizes: {
        props: {
          pageSizes: Array
        },
        watch: {
          pageSizes: {
            immediate: true,
            handler: function(value) {
              if (VueUtil.isArray(value)) {
                this.$parent.internalPageSize = value.indexOf(this.$parent.pageSize) !== -1 ? this.$parent.pageSize : this.pageSizes[0];
              }
            }
          }
        },
        render: function(createElement) {
          var self = this;
          return createElement('span', {class: 'vue-pagination__sizes'}, [createElement('vue-select', {attrs: {value: this.$parent.internalPageSize}, on: {input: this.handleChange}}, [VueUtil.map(this.pageSizes, function(item) {return createElement('vue-option', {attrs: {value: item, label: item + ' ' + self.$t('vue.pagination.pagesize')}}, []);})])]);
        },
        methods: {
          handleChange: function(val) {
            if (val !== this.$parent.internalPageSize) {
              this.$parent.internalPageSize = val = parseInt(val, 10);
              this.$parent.$emit('size-change', val);
            }
          }
        }
      },
      Jumper: {
        data: function() {
          return {
            oldValue: null
          };
        },
        methods: {
          handleFocus: function(event) {
            this.oldValue = event.target.value;
          },
          handleChange: function(event) {
            this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(event.target.value);
            this.oldValue = null;
          }
        },
        render: function(createElement) {
          return createElement('span', {class: 'vue-pagination__jump'}, [this.$t('vue.pagination.goto'), createElement('input', {class: 'vue-pagination__editor', attrs: {type: 'number', min: 1, max: this.$parent.internalPageCount, number: !0}, domProps: {value: this.$parent.internalCurrentPage}, on: {change: this.handleChange, focus: this.handleFocus}, style: {width: '30px'}}, []), this.$t('vue.pagination.pageClassifier')]);
        }
      },
      Total: {
        render: function(createElement) {
          return VueUtil.isNumber(this.$parent.total) ? createElement('span', {class: 'vue-pagination__total'}, [this.$t('vue.pagination.total', {total: this.$parent.total})]) : '';
        }
      },
      Pager: VuePager
    },
    methods: {
      handleCurrentChange: function(val) {
        this.internalCurrentPage = this.getValidCurrentPage(val);
      },
      prev: function() {
        var newVal = this.internalCurrentPage - 1;
        this.internalCurrentPage = this.getValidCurrentPage(newVal);
      },
      next: function() {
        var newVal = this.internalCurrentPage + 1;
        this.internalCurrentPage = this.getValidCurrentPage(newVal);
      },
      getValidCurrentPage: function(value) {
        value = parseInt(value, 10);
        var havePageCount = VueUtil.isNumber(this.internalPageCount);
        var resetValue;
        if (!havePageCount) {
          if (isNaN(value) || value < 1) resetValue = 1;
        } else {
          if (value < 1) {
            resetValue = 1;
          } else if (value > this.internalPageCount) {
            resetValue = this.internalPageCount;
          }
        }
        if (!VueUtil.isDef(resetValue) && isNaN(value)) {
          resetValue = 1;
        } else if (resetValue === 0) {
          resetValue = 1;
        }
        return !VueUtil.isDef(resetValue) ? value : resetValue;
      }
    },
    computed: {
      internalPageCount: function() {
        if (VueUtil.isNumber(this.total)) {
          return Math.ceil(this.total / this.internalPageSize);
        } else if (VueUtil.isNumber(this.pageCount)) {
          return this.pageCount;
        }
        return null;
      }
    },
    watch: {
      currentPage: {
        immediate: true,
        handler: function(val) {
          this.internalCurrentPage = val;
        }
      },
      pageSize: {
        immediate: true,
        handler: function(val) {
          this.internalPageSize = val;
        }
      },
      internalCurrentPage: function(newVal, oldVal) {
        var self = this;
        newVal = parseInt(newVal, 10);
        if (isNaN(newVal)) {
          newVal = oldVal || 1;
        } else {
          newVal = self.getValidCurrentPage(newVal);
        }
        if (VueUtil.isDef(newVal)) {
          self.$nextTick(function() {
            self.internalCurrentPage = newVal;
            if (oldVal !== newVal) {
              self.$emit('current-change', self.internalCurrentPage);
            }
          });
        } else {
          self.$emit('current-change', self.internalCurrentPage);
        }
      },
      internalPageCount: function(newVal) {
        var oldPage = this.internalCurrentPage;
        if (newVal > 0 && oldPage === 0) {
          this.internalCurrentPage = 1;
        } else if (oldPage > newVal) {
          this.internalCurrentPage = newVal === 0 ? 1 : newVal;
        }
      }
    }
  };
  Vue.component(VuePagination.name, VuePagination);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueProgress = definition(context.Vue);
    delete context.VueProgress;
  }
})(this, function(Vue) {
  'use strict';
  var VueProgress = {
    template: '<div :class="[\'vue-progress\', \'vue-progress--\' + type, status ? \'is-\' + status : \'\',{\'vue-progress--without-text\': !showText,\'vue-progress--text-inside\': textInside,}]"><div class="vue-progress-bar" v-if="type === \'line\'"><div class="vue-progress-bar__outer" :style="{height: strokeWidth + \'px\'}"><div class="vue-progress-bar__inner" :style="barStyle"><div class="vue-progress-bar__innerText" v-if="showText && textInside">{{percentage}}%</div></div></div></div><div class="vue-progress-circle" :style="{height: width + \'px\', width: width + \'px\'}" v-else><svg viewBox="0 0 100 100"><path class="vue-progress-circle__track" :d="trackPath" stroke="#e5e9f2" :stroke-width="relativeStrokeWidth" fill="none"></path><path class="vue-progress-circle__path" :d="trackPath" stroke-linecap="round" :stroke="stroke" :stroke-width="relativeStrokeWidth" fill="none" :style="circlePathStyle"></path></svg></div><div class="vue-progress__text" v-if="showText && !textInside" :style="{fontSize: progressTextSize + \'px\'}"><template v-if="!status">{{percentage}}%</template><i v-else :class="iconClass"></i></div></div>',
    name: 'VueProgress',
    props: {
      type: {
        type: String,
        default: 'line',
        validator: function(val) {return ['line', 'circle'].indexOf(val) !== -1;}
      },
      percentage: {
        type: Number,
        default: 0,
        validator: function(val) {return val >= 0 && val <= 100;}
      },
      status: {
        type: String
      },
      strokeWidth: {
        type: Number,
        default: 6
      },
      textInside: Boolean,
      width: {
        type: Number,
        default: 126
      },
      showText: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      barStyle: function() {
        var style = {};
        style.width = this.percentage + '%';
        return style;
      },
      relativeStrokeWidth: function() {
        return (this.strokeWidth / this.width * 100).toFixed(1);
      },
      trackPath: function() {
        var radius = parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10);
        return 'M 50 50 m 0 -' + radius + ' a ' + radius + ' ' + radius + ' 0 1 1 0 ' + 2 * radius + ' a ' + radius + ' ' + radius + ' 0 1 1 0 -' + 2 * radius;
      },
      perimeter: function() {
        var radius = 50 - parseFloat(this.relativeStrokeWidth) / 2;
        return 2 * Math.PI * radius;
      },
      circlePathStyle: function() {
        var perimeter = this.perimeter;
        return {
          strokeDasharray: perimeter + 'px,' + perimeter + 'px',
          strokeDashoffset: (1 - this.percentage / 100) * perimeter + 'px',
          transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
        };
      },
      stroke: function() {
        var ret;
        switch (this.status) {
          case 'success':
            ret = '#67c23a';
            break;
          case 'exception':
            ret = '#fb5555';
            break;
          default:
            ret = '#409eff';
        }
        return ret;
      },
      iconClass: function() {
        if (this.type === 'line') {
          return this.status === 'success' ? 'vue-icon-success' : 'vue-icon-error';
        } else {
          return this.status === 'success' ? 'vue-icon-check' : 'vue-icon-close';
        }
      },
      progressTextSize: function() {
        return this.type === 'line' ? 12 + this.strokeWidth * 0.4 : this.width * 0.25 + 6;
      }
    }
  };
  Vue.component(VueProgress.name, VueProgress);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueSlider = definition(context.Vue, context.VueUtil);
    delete context.VueSlider;
  }
})(this, function(Vue, VueUtil, VueTooltip) {
  'use strict';
  var VueSliderButton = {
    template: '<div @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @mousedown="onButtonDown" @touchstart="onButtonDown" :class="[\'vue-slider__button-wrapper\', {\'hover\': hovering, \'dragging\': dragging}]" :style="wrapperStyle" ref="button"><vue-tooltip placement="top" ref="tooltip" :disabled="!showTooltip"><span slot="content">{{formatValue}}</span><div :class="[\'vue-slider__button\', {\'hover\': hovering, \'dragging\': dragging}]"></div></vue-tooltip></div>',
    name: 'VueSliderButton',
    props: {
      value: {
        type: Number,
        default: 0
      },
      vertical: Boolean
    },
    data: function() {
      return {
        hovering: false,
        dragging: false,
        startX: 0,
        currentX: 0,
        startY: 0,
        currentY: 0,
        startPosition: 0,
        newPosition: null,
        oldValue: this.value
      };
    },
    computed: {
      disabled: function() {
        return this.$parent.disabled;
      },
      max: function() {
        return this.$parent.max;
      },
      min: function() {
        return this.$parent.min;
      },
      step: function() {
        return this.$parent.step;
      },
      showTooltip: function() {
        return this.$parent.showTooltip;
      },
      precision: function() {
        return this.$parent.precision;
      },
      currentPosition: function() {
        return (this.value - this.min) / (this.max - this.min) * 100 + '%';
      },
      enableFormat: function() {
        return this.$parent.formatTooltip instanceof Function;
      },
      formatValue: function() {
        return this.enableFormat && this.$parent.formatTooltip(this.value) || this.value;
      },
      wrapperStyle: function() {
        return this.vertical ? {bottom: this.currentPosition} : {left: this.currentPosition};
      }
    },
    watch: {
      dragging: function(val) {
        this.$parent.dragging = val;
      }
    },
    methods: {
      displayTooltip: function() {
        this.$refs.tooltip && (this.$refs.tooltip.showPopper = true);
      },
      hideTooltip: function() {
        this.$refs.tooltip && (this.$refs.tooltip.showPopper = false);
      },
      handleMouseEnter: function() {
        this.hovering = true;
        this.displayTooltip();
      },
      handleMouseLeave: function() {
        this.hovering = false;
        this.hideTooltip();
      },
      onButtonDown: function(event) {
        if (this.disabled) return;
        event.preventDefault();
        this.displayTooltip();
        this.onDragStart(event);
        VueUtil.addTouchMove(document, this.onDragging);
        VueUtil.addTouchEnd(document, this.onDragEnd);
        VueUtil.on(document, 'contextmenu', this.onDragEnd);
      },
      onDragStart: function(event) {
        this.dragging = true;
        if (this.vertical) {
          this.startY = event.clientY || event.touches[0].clientY;
        } else {
          this.startX = event.clientX || event.touches[0].clientX;
        }
        this.startPosition = parseFloat(this.currentPosition);
      },
      onDragging: function(event) {
        if (this.dragging) {
          this.displayTooltip();
          var diff = 0;
          var sliderSize = 1;
          var parentObj = this.$parent;
          if (parentObj.$refs.slider) {
            sliderSize = parentObj.$refs.slider['client' + (parentObj.vertical ? 'Height' : 'Width')];
          }
          if (this.vertical) {
            this.currentY = event.clientY || event.touches[0].clientY;
            diff = (this.startY - this.currentY) / sliderSize * 100;
          } else {
            this.currentX = event.clientX || event.touches[0].clientX;
            diff = (this.currentX - this.startX) / sliderSize * 100;
          }
          this.newPosition = this.startPosition + diff;
          this.setPosition(this.newPosition);
        }
      },
      onDragEnd: function() {
        if (this.dragging) {
          VueUtil.debounce(function() {
            this.dragging = false;
            this.hideTooltip();
            this.setPosition(this.newPosition);
          }).call(this);
          VueUtil.removeTouchMove(document, this.onDragging);
          VueUtil.removeTouchEnd(document, this.onDragEnd);
          VueUtil.off(document, 'contextmenu', this.onDragEnd);
        }
      },
      setPosition: function(newPosition) {
        if (newPosition === null) return;
        if (newPosition < 0) {
          newPosition = 0;
        } else if (newPosition > 100) {
          newPosition = 100;
        }
        var lengthPerStep = 100 / ((this.max - this.min) / this.step);
        var steps = Math.round(newPosition / lengthPerStep);
        var value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min;
        value = parseFloat(value.toFixed(this.precision));
        this.$emit('input', value);
        this.$refs.tooltip && this.$refs.tooltip.updatePopper();
        if (!this.dragging && this.value !== this.oldValue) {
          this.oldValue = this.value;
        }
      }
    }
  };
  var VueSlider = {
    template: '<div class="vue-slider" :class="{\'is-vertical\': vertical}"><div :class="[\'vue-slider__runway\', {\'disabled\': disabled}]" :style="runwayStyle" @click="onSliderClick" ref="slider"><div class="vue-slider__bar" :style="barStyle"></div><slider-button :vertical="vertical" v-model="firstValue" ref="button1"></slider-button><slider-button :vertical="vertical" v-model="secondValue" ref="button2" v-if="range"></slider-button><div class="vue-slider__stop" v-for="item in stops" :style="vertical ? {\'bottom\': item + \'%\'} : {\'left\': item + \'%\'}" v-if="showStops"></div></div></div>',
    name: 'VueSlider',
    mixins: [VueUtil.component.emitter],
    props: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      step: {
        type: Number,
        default: 1
      },
      value: {
        type: [Number, Array],
        default: 0
      },
      showStops: Boolean,
      showTooltip: {
        type: Boolean,
        default: true
      },
      formatTooltip: Function,
      disabled: Boolean,
      range: Boolean,
      vertical: Boolean,
      height: {
        type: Number,
        default: 200
      }
    },
    components: {
      SliderButton: VueSliderButton
    },
    data: function() {
      return {
        firstValue: null,
        secondValue: null,
        oldValue: null,
        dragging: false
      };
    },
    watch: {
      value: function(val, oldVal) {
        if (this.dragging ||
          VueUtil.isArray(val) &&
          VueUtil.isArray(oldVal) &&
          val.every(function(item, index) {return item === oldVal[index];})) {
          return;
        }
        this.setValues();
      },
      dragging: function(val) {
        if (!val) {
          this.setValues();
        }
      },
      firstValue: function(val) {
        if (this.range) {
          this.$emit('input', [this.minValue, this.maxValue]);
        } else {
          this.$emit('input', val);
        }
      },
      secondValue: function() {
        if (this.range) {
          this.$emit('input', [this.minValue, this.maxValue]);
        }
      },
      min: function() {
        this.setValues();
      },
      max: function() {
        this.setValues();
      }
    },
    methods: {
      valueChanged: function() {
        var self = this;
        if (self.range) {
          return ![self.minValue, self.maxValue]
            .every(function(item, index) {return item === self.oldValue[index];});
        } else {
          return self.value !== self.oldValue;
        }
      },
      setValues: function() {
        var val = this.value;
        if (this.range && VueUtil.isArray(val)) {
          if (val[1] < this.min) {
            this.$emit('input', [this.min, this.min]);
          } else if (val[0] > this.max) {
            this.$emit('input', [this.max, this.max]);
          } else if (val[0] < this.min) {
            this.$emit('input', [this.min, val[1]]);
          } else if (val[1] > this.max) {
            this.$emit('input', [val[0], this.max]);
          } else {
            this.firstValue = val[0];
            this.secondValue = val[1];
            if (this.valueChanged()) {
              this.$emit('change', [this.minValue, this.maxValue]);
              this.dispatch('VueFormItem', 'vue.form.change', [this.minValue, this.maxValue]);
              this.oldValue = VueUtil.mergeArray([], val);
            }
          }
        } else if (!this.range && VueUtil.isNumber(val)) {
          if (val < this.min) {
            this.$emit('input', this.min);
          } else if (val > this.max) {
            this.$emit('input', this.max);
          } else {
            this.firstValue = val;
            if (this.valueChanged()) {
              this.$emit('change', val);
              this.dispatch('VueFormItem', 'vue.form.change', val);
              this.oldValue = val;
            }
          }
        }
      },
      setPosition: function(percent) {
        var targetValue = this.min + percent * (this.max - this.min) / 100;
        if (!this.range) {
          this.$refs.button1.setPosition(percent);
          return;
        }
        var button;
        if (Math.abs(this.minValue - targetValue) < Math.abs(this.maxValue - targetValue)) {
          button = this.firstValue < this.secondValue ? 'button1' : 'button2';
        } else {
          button = this.firstValue > this.secondValue ? 'button1' : 'button2';
        }
        this.$refs[button].setPosition(percent);
      },
      onSliderClick: function(event) {
        if (this.disabled || this.dragging) return;
        var sliderSize = 1;
        if (this.$refs.slider) {
          sliderSize = this.$refs.slider['client' + (this.vertical ? 'Height' : 'Width')];
        }
        if (this.vertical) {
          var sliderOffsetBottom = this.$refs.slider.getBoundingClientRect().bottom;
          this.setPosition((sliderOffsetBottom - (event.clientY || event.touches[0].clientY)) / sliderSize * 100);
        } else {
          var sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
          this.setPosition(((event.clientX || event.touches[0].clientX) - sliderOffsetLeft) / sliderSize * 100);
        }
      }
    },
    computed: {
      stops: function() {
        var self = this;
        var stopCount = (self.max - self.min) / self.step;
        var stepWidth = 100 * self.step / (self.max - self.min);
        var result = [];
        for (var i = 1; i < stopCount; i++) {
          result.push(i * stepWidth);
        }
        if (self.range) {
          return VueUtil.filter(result, function(step) {
            return step < 100 * (self.minValue - self.min) / (self.max - self.min) ||
              step > 100 * (self.maxValue - self.min) / (self.max - self.min);
          });
        } else {
          return VueUtil.filter(result, function(step) {return step > 100 * (self.firstValue - self.min) / (self.max - self.min);});
        }
      },
      minValue: function() {
        return Math.min(this.firstValue, this.secondValue);
      },
      maxValue: function() {
        return Math.max(this.firstValue, this.secondValue);
      },
      barSize: function() {
        return this.range ? 100 * (this.maxValue - this.minValue) / (this.max - this.min) + '%' : 100 * (this.firstValue - this.min) / (this.max - this.min) + '%';
      },
      barStart: function() {
        return this.range ? 100 * (this.minValue - this.min) / (this.max - this.min) + '%' : '0%';
      },
      precision: function() {
        var precisions = VueUtil.map([this.min, this.max, this.step], function(item) {
          var decimal = ('' + item).split('.')[1];
          return decimal ? decimal.length : 0;
        });
        return Math.max.apply(null, precisions);
      },
      runwayStyle: function() {
        return this.vertical ? {height: this.height + 'px'} : {};
      },
      barStyle: function() {
        return this.vertical ? {height: this.barSize, bottom: this.barStart} : {width: this.barSize, left: this.barStart};
      }
    },
    mounted: function() {
      if (this.range) {
        if (VueUtil.isArray(this.value)) {
          this.firstValue = Math.max(this.min, this.value[0]);
          this.secondValue = Math.min(this.max, this.value[1]);
        } else {
          this.firstValue = this.min;
          this.secondValue = this.max;
        }
        this.oldValue = [this.firstValue, this.secondValue];
      } else {
        if (!VueUtil.isNumber(this.value)) {
          this.firstValue = this.min;
        } else {
          this.firstValue = Math.min(this.max, Math.max(this.min, this.value));
        }
        this.oldValue = this.firstValue;
      }
    }
  };
  Vue.component(VueSlider.name, VueSlider);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueRate = definition(context.Vue, context.VueUtil);
    delete context.VueRate;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueRate = {
    template: '<div class="vue-rate"><span v-for="item in max" class="vue-rate__item" @mousemove="setCurrentValue(item, $event)" @mouseleave="resetCurrentValue" @click="selectValue(item)" :style="{cursor: disabled ? \'auto\' : \'pointer\'}"><i :class="[\'vue-rate__icon\', classes[item - 1], {\'hover\': hoverIndex === item}]" :style="getIconStyle(item)"><i v-if="showDecimalIcon(item)" :class="[\'vue-rate__decimal\', decimalIconClass]" :style="decimalStyle"></i></i></span><span v-if="showText" class="vue-rate__text" :style="{color: textColor}">{{text}}</span></div>',
    name: 'VueRate',
    data: function() {
      return {
        classMap: {},
        colorMap: {},
        pointerAtLeftHalf: false,
        currentValue: this.value,
        hoverIndex: -1
      };
    },
    props: {
      value: {
        type: Number,
        default: 0
      },
      lowThreshold: {
        type: Number,
        default: 2
      },
      highThreshold: {
        type: Number,
        default: 4
      },
      max: {
        type: Number,
        default: 5
      },
      colors: {
        type: Array,
        default: function() {
          return ['#F7BA2A', '#F7BA2A', '#F7BA2A'];
        }
      },
      voidColor: {
        type: String,
        default: '#C6D1DE'
      },
      disabledVoidColor: {
        type: String,
        default: '#EFF2F7'
      },
      iconClasses: {
        type: Array,
        default: function() {
          return ['vue-icon-star-on', 'vue-icon-star-on', 'vue-icon-star-on'];
        }
      },
      voidIconClass: {
        type: String,
        default: 'vue-icon-star-off'
      },
      disabledVoidIconClass: {
        type: String,
        default: 'vue-icon-star-on'
      },
      disabled: Boolean,
      allowHalf: Boolean,
      showText: Boolean,
      textColor: {
        type: String,
        default: '1f2d3d'
      },
      texts: {
        type: Array,
        default: function() {
          return [];
        }
      },
      textTemplate: {
        type: String,
        default: '{value}'
      }
    },
    computed: {
      text: function() {
        var result = '';
        if (this.disabled) {
          result = this.textTemplate.replace(/\{\s*value\s*\}/, this.value);
        } else {
          result = this.texts[Math.ceil(this.currentValue) - 1];
        }
        return result;
      },
      decimalStyle: function() {
        var width = '';
        if (this.disabled) {
          width = (this.valueDecimal < 50 ? 0 : 50) + '%';
        }
        if (this.allowHalf) {
          width = '50%';
        }
        return {
          color: this.activeColor,
          width: width
        };
      },
      valueDecimal: function() {
        return this.value * 100 - Math.floor(this.value) * 100;
      },
      decimalIconClass: function() {
        return this.getValueFromMap(this.value, this.classMap);
      },
      voidClass: function() {
        return this.disabled ? this.classMap.disabledVoidClass : this.classMap.voidClass;
      },
      activeClass: function() {
        return this.getValueFromMap(this.currentValue, this.classMap);
      },
      activeColor: function() {
        return this.getValueFromMap(this.currentValue, this.colorMap);
      },
      classes: function() {
        var result = [];
        var i = 0;
        var threshold = this.currentValue;
        if (this.allowHalf && this.currentValue !== Math.floor(this.currentValue)) {
          threshold--;
        }
        for (; i < threshold; i++) {
          result.push(this.activeClass);
        }
        for (; i < this.max; i++) {
          result.push(this.voidClass);
        }
        return result;
      }
    },
    watch: {
      value: function(val) {
        this.$emit('change', val);
        this.currentValue = val;
      },
      colors: function(val) {
        this.colorMap.lowColor = val[0];
        this.colorMap.mediumColor = val[1];
        this.colorMap.highColor = val[2];
      },
      voidColor: function(val) {
        this.colorMap.voidColor = val;
      },
      disabledVoidColor: function(val) {
        this.colorMap.disabledVoidColor = val;
      },
      iconClasses: function(val) {
        this.classMap.lowClass = val[0];
        this.classMap.mediumClass = val[1];
        this.classMap.highClass = val[2];
      },
      voidClass: function(val) {
        this.classMap.voidClass = val;
      },
      disabledVoidClass: function(val) {
        this.classMap.disabledVoidClass = val;
      }
    },
    methods: {
      getValueFromMap: function(value, map) {
        var result = '';
        if (value <= this.lowThreshold) {
          result = map.lowColor || map.lowClass;
        } else if (value >= this.highThreshold) {
          result = map.highColor || map.highClass;
        } else {
          result = map.mediumColor || map.mediumClass;
        }
        return result;
      },
      showDecimalIcon: function(item) {
        var showWhenDisabled = this.disabled && this.valueDecimal > 0 && item - 1 < this.value && item > this.value;
        var showWhenAllowHalf = this.allowHalf && this.pointerAtLeftHalf && ((item - 0.5).toFixed(1) === this.currentValue.toFixed(1));
        return showWhenDisabled || showWhenAllowHalf;
      },
      getIconStyle: function(item) {
        var voidColor = this.disabled ? this.colorMap.disabledVoidColor : this.colorMap.voidColor;
        return {
          color: item <= this.currentValue ? this.activeColor : voidColor
        };
      },
      selectValue: function(value) {
        if (this.disabled) {
          return;
        }
        if (this.allowHalf && this.pointerAtLeftHalf) {
          this.$emit('input', this.currentValue);
        } else {
          this.$emit('input', value);
        }
      },
      setCurrentValue: function(value, event) {
        if (this.disabled) {
          return;
        }
        if (this.allowHalf) {
          var target = event.target;
          if (VueUtil.hasClass(target, 'vue-rate__item')) {
            target = target.querySelector('.vue-rate__icon');
          }
          if (VueUtil.hasClass(target, 'vue-rate__decimal')) {
            target = target.parentNode;
          }
          this.pointerAtLeftHalf = event.offsetX * 2 <= target.clientWidth;
          this.currentValue = this.pointerAtLeftHalf ? value - 0.5 : value;
        } else {
          this.currentValue = value;
        }
        this.hoverIndex = value;
      },
      resetCurrentValue: function() {
        if (this.disabled) {
          return;
        }
        if (this.allowHalf) {
          this.pointerAtLeftHalf = this.value !== Math.floor(this.value);
        }
        this.currentValue = this.value;
        this.hoverIndex = -1;
      }
    },
    created: function() {
      if (!this.value) {
        this.$emit('input', 0);
      }
      this.classMap = {
        lowClass: this.iconClasses[0],
        mediumClass: this.iconClasses[1],
        highClass: this.iconClasses[2],
        voidClass: this.voidIconClass,
        disabledVoidClass: this.disabledVoidIconClass
      };
      this.colorMap = {
        lowColor: this.colors[0],
        mediumColor: this.colors[1],
        highColor: this.colors[2],
        voidColor: this.voidColor,
        disabledVoidColor: this.disabledVoidColor
      };
    }
  };
  Vue.component(VueRate.name, VueRate);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VueResource'], definition);
  } else {
    context.VueUpload = definition(context.Vue, context.VueUtil);
    delete context.VueUpload;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var UploadDragger = {
    template: '<div :class="[\'vue-upload-dragger\', {\'is-dragover\': dragover}]" @drop.prevent="onDrop" @dragover.prevent="onDragover" @dragleave.prevent="dragover = false"><slot></slot></div>',
    name: 'VueUploadDrag',
    props: {
      disabled: Boolean
    },
    data: function() {
      return {
        dragover: false
      };
    },
    methods: {
      onDragover: function() {
        if (!this.disabled) {
          this.dragover = true;
        }
      },
      onDrop: function(e) {
        if (!this.disabled) {
          this.dragover = false;
          this.$emit('file', e.dataTransfer.files);
        }
      }
    }
  };
  var UploadList = {
    template: '<transition-group tag="ul" :class="[\'vue-upload-list\', \'vue-upload-list--\' + listType, {\'is-disabled\': disabled}]" name="vue-list"><li v-for="(file, index) in files" :class="[\'vue-upload-list__item\', \'is-\' + file.status]" :key="index"><img class="vue-upload-list__item-thumbnail" v-if="file.status !== \'uploading\' && [\'picture-card\', \'picture\'].indexOf(listType) !== -1" :src="file.url" :alt="file.name"><a class="vue-upload-list__item-name" @click="handleClick(file)"><i class="vue-icon-document"></i>{{file.name}}</a><label class="vue-upload-list__item-status-label"><i :class="{\'vue-icon-upload-success\': true, \'vue-icon-success\': listType === \'text\', \'vue-icon-check\': [\'picture-card\', \'picture\'].indexOf(listType) !== -1}"></i></label><i class="vue-icon-close" v-if="!disabled" @click="$emit(\'remove\', file)"></i><vue-progress v-if="file.status === \'uploading\'" :type="listType === \'picture-card\' ? \'circle\' : \'line\'" :stroke-width="listType === \'picture-card\' ? 6 : 2" :percentage="parsePercentage(file.percentage)"></vue-progress><span class="vue-upload-list__item-actions" v-if="listType === \'picture-card\'"><span class="vue-upload-list__item-preview" v-if="handlePreview && listType === \'picture-card\'" @click="handlePreview(file)"><i class="vue-icon-view"></i></span><span v-if="!disabled" class="vue-upload-list__item-delete" @click="$emit(\'remove\', file)"><i class="vue-icon-delete2"></i></span></span></li></transition-group>',
    props: {
      files: {
        type: Array,
        default: function() {
          return [];
        }
      },
      disabled: Boolean,
      handlePreview: Function,
      listType: String
    },
    methods: {
      parsePercentage: function(val) {
        return parseInt(val, 10);
      },
      handleClick: function(file) {
        this.handlePreview && this.handlePreview(file);
      }
    }
  };
  var Upload = {
    inject: ['uploader'],
    components: {
      UploadDragger: UploadDragger
    },
    props: {
      type: String,
      action: {
        type: String,
        default: location.href
      },
      name: {
        type: String,
        default: 'file'
      },
      data: Object,
      headers: Object,
      withCredentials: Boolean,
      multiple: Boolean,
      accept: String,
      onStart: Function,
      onProgress: Function,
      onSuccess: Function,
      onError: Function,
      beforeUpload: Function,
      drag: Boolean,
      onPreview: {
        type: Function,
        default: function() {}
      },
      onRemove: {
        type: Function,
        default: function() {}
      },
      fileList: Array,
      autoUpload: Boolean,
      listType: String,
      httpRequest: {
        type: Function,
        default: function(option) {
          if (!VueUtil.isDef(this.$http)) return;
          var httpOption = {};
          httpOption.headers = option.headers;
          httpOption.progress = function progress(e) {
            if (e.total > 0) {
              e.percent = e.loaded / e.total * 100;
            }
            option.onProgress(e);
          };
          if (option.withCredentials) {
            httpOption.emulateJSON = true;
          }
          var formData = new FormData();
          if (option.data) {
            VueUtil.ownPropertyLoop(option.data, function(key) {
              formData.append(key, option.data[key]);
            });
          }
          formData.append(option.filename, option.file);
          this.$http.post(option.action, formData, httpOption).then(function(reqponse) {
            option.onSuccess(reqponse);
          }, function(reqponse) {
            option.onError(reqponse);
          });
        }
      },
      disabled: Boolean
    },
    data: function() {
      return {
        mouseover: false,
        reqs: {}
      };
    },
    methods: {
      isImage: function(str) {
        return str.indexOf('image') !== -1;
      },
      handleChange: function(ev) {
        var files = ev.target.files;
        if (!files) return;
        this.uploadFiles(files);
      },
      uploadFiles: function(files) {
        var self = this;
        var postFiles = [].slice.call(files);
        if (!self.multiple) {
          postFiles = postFiles.slice(0, 1);
        }
        if (postFiles.length === 0) return;
        VueUtil.loop(postFiles, function(rawFile) {
          self.onStart(rawFile);
          if (self.autoUpload) self.upload(rawFile);
        });
      },
      upload: function(rawFile) {
        var self = this;
        self.$refs.input.value = null;
        if (!self.beforeUpload) {
          return self.post(rawFile);
        }
        var before = self.beforeUpload(rawFile);
        if (before && before.then) {
          before.then(function(processedFile) {
            if (VueUtil.isFile(processedFile)) {
              self.post(processedFile);
            } else {
              self.post(rawFile);
            }
          }, function() {
            self.onRemove(rawFile, true);
          });
        } else if (before !== false) {
          self.post(rawFile);
        } else {
          self.onRemove(rawFile, true);
        }
      },
      abort: function(rawFile) {
        var reqs = this.reqs;
        if (rawFile) {
          var uid = rawFile;
          if (rawFile.uid) uid = rawFile.uid;
          if (reqs[uid]) {
            reqs[uid].abort();
          }
        } else {
          VueUtil.ownPropertyLoop(reqs, function(uid) {
            if (reqs[uid]) reqs[uid].abort();
            delete reqs[uid];
          });
        }
      },
      post: function(rawFile) {
        var self = this;
        var uid = rawFile.uid;
        var options = {
          headers: self.headers,
          withCredentials: self.withCredentials,
          file: rawFile,
          data: self.data,
          filename: self.name,
          action: self.action,
          onProgress: function onProgress(e) {
            self.onProgress(e, rawFile);
          },
          onSuccess: function onSuccess(res) {
            self.onSuccess(res, rawFile);
            delete self.reqs[uid];
          },
          onError: function onError(err) {
            self.onError(err, rawFile);
            delete self.reqs[uid];
          }
        };
        var req = self.httpRequest(options);
        self.reqs[uid] = req;
        if (req && req.then) {
          req.then(options.onSuccess, options.onError);
        }
      },
      handleClick: function() {
        if (!this.disabled) {
          this.$refs.input.value = null;
          this.$refs.input.click();
        }
      }
    },
    render: function(createElement) {
      var handleClick = this.handleClick;
      var drag = this.drag;
      var handleChange = this.handleChange;
      var multiple = this.multiple;
      var accept = this.accept;
      var listType = this.listType;
      var uploadFiles = this.uploadFiles;
      var disabled = this.disabled;
      var data = {
        class: {
          'vue-upload': true,
          'is-disabled': disabled
        },
        on: {
          click: handleClick
        }
      };
      data.class['vue-upload--' + listType] = true;
      return createElement('div', data, [drag ? createElement('upload-dragger', {attrs: {disabled: disabled}, on: {'file': uploadFiles}}, [this.$slots.default]) : this.$slots.default, createElement('input', {class: 'vue-upload__input', attrs: {type: 'file', name: name, multiple: multiple, accept: accept}, ref: 'input', on: {'change': handleChange}}, [])]);
    }
  };
  var IframeUpload = {
    components: {
      UploadDragger: UploadDragger
    },
    props: {
      type: String,
      data: {},
      action: {
        type: String,
        default: location.href
      },
      name: {
        type: String,
        default: 'file'
      },
      withCredentials: Boolean,
      accept: String,
      onStart: Function,
      onProgress: Function,
      onSuccess: Function,
      onError: Function,
      beforeUpload: Function,
      onPreview: {
        type: Function,
        default: function() {}
      },
      onRemove: {
        type: Function,
        default: function() {}
      },
      drag: Boolean,
      listType: String,
      disabled: Boolean
    },
    data: function() {
      return {
        mouseover: false,
        domain: '',
        file: null,
        submitting: false
      };
    },
    methods: {
      isImage: function(str) {
        return str.indexOf('image') !== -1;
      },
      handleClick: function() {
        if (!this.disabled) {
          this.$refs.input.click();
        }
      },
      handleChange: function(ev) {
        var file = ev.target.value;
        if (file) {
          this.uploadFiles(file);
        }
      },
      uploadFiles: function(file) {
        if (this.submitting) return;
        this.submitting = true;
        this.file = file;
        this.onStart(file);
        var formNode = this.getFormNode();
        var dataSpan = this.getFormDataNode();
        var data = this.data;
        if (VueUtil.isFunction(data)) {
          data = data(file);
        }
        var inputs = [];
        VueUtil.ownPropertyLoop(data, function(key) {
          inputs.push('<input name="' + key + '" value="' + data[key] + '"/>');
        });
        dataSpan.innerHTML = inputs.join('');
        formNode.submit();
        dataSpan.innerHTML = '';
      },
      getFormNode: function() {
        return this.$refs.form;
      },
      getFormDataNode: function() {
        return this.$refs.data;
      },
      messageHandle: function(event) {
        if (!this.file) return;
        var targetOrigin = new URL(this.action).origin;
        if (event.origin !== targetOrigin) return;
        var response = event.data;
        if (response.result === 'success') {
          this.onSuccess(response, this.file);
        } else if (response.result === 'failed') {
          this.onError(response, this.file);
        }
        this.submitting = false;
        this.file = null;
      }
    },
    created: function() {
      this.frameName = 'frame-' + Date.now();
    },
    mounted: function() {
      var self = this;
      VueUtil.on(document, 'message', this.messageHandle);
    },
    beforeDestroy: function() {
      VueUtil.off(document, 'message', this.messageHandle);
    },
    render: function(createElement) {
      var drag = this.drag;
      var uploadFiles = this.uploadFiles;
      var listType = this.listType;
      var frameName = this.frameName;
      var disabled = this.disabled;
      var oClass = {'vue-upload': true};
      oClass['vue-upload--' + listType] = true;
      return createElement('div', {'class': oClass, on: {'click': this.handleClick}, nativeOn: {'drop': this.onDrop, 'dragover': this.handleDragover, 'dragleave': this.handleDragleave}}, [createElement('iframe', {on: {'load': this.onload}, ref: 'iframe', attrs: {name: frameName}}, []), createElement('form', {ref: 'form', attrs: {action: this.action, target: frameName, enctype: 'multipart/form-data', method: 'POST'}}, [createElement('input', {'class': 'vue-upload__input', attrs: {type: 'file', name: 'file', accept: this.accept}, ref: 'input', on: {'change': this.handleChange}}, []), createElement('input', {attrs: {type: 'hidden', name: 'documentDomain', value: document.domain}}, []), createElement('span', {ref: 'data'}, [])]), drag ? createElement('upload-dragger', {on: {'file': uploadFiles}, attrs: {disabled: disabled}}, [this.$slots.default]) : this.$slots.default]);
    }
  };
  var migrating = {
    mounted: function() {
      if (!this.$vnode) return;
    },
    methods: {
      getMigratingConfig: function() {
        return {
          props: {},
          events: {}
        };
      }
    }
  };
  var VueUpload = {
    name: 'VueUpload',
    mixins: [migrating],
    components: {
      UploadList: UploadList,
      Upload: Upload,
      IframeUpload: IframeUpload
    },
    provide: {
      uploader: null
    },
    props: {
      action: {
        type: String,
        default: location.href
      },
      headers: {
        type: Object,
        default: function() {
          return {};
        }
      },
      data: Object,
      multiple: Boolean,
      name: {
        type: String,
        default: 'file'
      },
      drag: Boolean,
      dragger: Boolean,
      withCredentials: Boolean,
      showFileList: {
        type: Boolean,
        default: true
      },
      accept: String,
      type: {
        type: String,
        default: 'select'
      },
      beforeUpload: Function,
      onRemove: {
        type: Function,
        default: function() {}
      },
      onChange: {
        type: Function,
        default: function() {}
      },
      onPreview: {
        type: Function
      },
      onSuccess: {
        type: Function,
        default: function() {}
      },
      onProgress: {
        type: Function,
        default: function() {}
      },
      onError: {
        type: Function,
        default: function() {}
      },
      fileList: {
        type: Array,
        default: function() {
          return [];
        }
      },
      autoUpload: {
        type: Boolean,
        default: true
      },
      listType: {
        type: String,
        default: 'text'
      },
      httpRequest: Function,
      disabled: Boolean
    },
    data: function() {
      return {
        uploadFiles: [],
        dragOver: false,
        draging: false,
        tempIndex: 1
      };
    },
    watch: {
      fileList: {
        immediate: true,
        handler: function(fileList) {
          var self = this;
          self.uploadFiles = VueUtil.map(fileList, function(item) {
            item.uid = item.uid || (Date.now() + self.tempIndex++);
            item.status = self.autoUpload ? 'success' : 'ready';
            return item;
          });
        }
      }
    },
    methods: {
      handleStart: function(rawFile) {
        rawFile.uid = Date.now() + this.tempIndex++;
        var file = {
          status: 'ready',
          name: rawFile.name,
          size: rawFile.size,
          percentage: 0,
          uid: rawFile.uid,
          raw: rawFile
        };
        try {
          file.url = URL.createObjectURL(rawFile);
        } catch (e) {
          throw e;
        }
        this.uploadFiles.push(file);
        this.onChange(file, this.uploadFiles);
      },
      handleProgress: function(ev, rawFile) {
        var file = this.getFile(rawFile);
        this.onProgress(ev, file, this.uploadFiles);
        file.status = 'uploading';
        file.percentage = ev.percent || 0;
      },
      handleSuccess: function(res, rawFile) {
        var file = this.getFile(rawFile);
        if (file) {
          file.status = 'success';
          file.response = res;
          this.onSuccess(res, file, this.uploadFiles);
          this.onChange(file, this.uploadFiles);
        }
      },
      handleError: function(err, rawFile) {
        var file = this.getFile(rawFile);
        var fileList = this.uploadFiles;
        file.status = 'fail';
        fileList.splice(fileList.indexOf(file), 1);
        this.onError(err, file, this.uploadFiles);
        this.onChange(file, this.uploadFiles);
      },
      handleRemove: function(file, raw) {
        if (raw) {
          file = this.getFile(raw);
        }
        this.abort(file);
        var fileList = this.uploadFiles;
        fileList.splice(fileList.indexOf(file), 1);
        this.onRemove(file, fileList);
      },
      getFile: function(rawFile) {
        var fileList = this.uploadFiles;
        var target;
        fileList.every(function(item) {
          target = rawFile.uid === item.uid ? item : null;
          return !target;
        });
        return target;
      },
      abort: function(file) {
        this.$refs['upload-inner'].abort(file);
      },
      clearFiles: function() {
        this.uploadFiles = [];
      },
      submit: function() {
        var self = this;
        VueUtil.loop(VueUtil.filter(self.uploadFiles, function(file) {
          return file.status === 'ready';
        }), function(file) {
          self.$refs['upload-inner'].upload(file.raw);
        });
      },
      getMigratingConfig: function() {
        return {
          props: {
            'default-file-list': 'default-file-list is renamed to file-list.',
            'show-upload-list': 'show-file-list is renamed to show-file-list.',
            'thumbnail-mode': 'thumbnail-mode has been deprecated.'
          }
        };
      }
    },
    render: function(createElement) {
      var uploadList;
      if (this.showFileList) {
        uploadList = createElement('UploadList', {attrs: {disabled: this.disabled, listType: this.listType, files: this.uploadFiles, handlePreview: this.onPreview}, on: {'remove': this.handleRemove}}, []);
      }
      var uploadData = {
        props: {
          type: this.type,
          drag: this.drag,
          action: this.action,
          multiple: this.multiple,
          'before-upload': this.beforeUpload,
          'with-credentials': this.withCredentials,
          headers: this.headers,
          name: this.name,
          data: this.data,
          accept: this.accept,
          fileList: this.uploadFiles,
          autoUpload: this.autoUpload,
          listType: this.listType,
          disabled: this.disabled,
          'on-start': this.handleStart,
          'on-progress': this.handleProgress,
          'on-success': this.handleSuccess,
          'on-error': this.handleError,
          'on-preview': this.onPreview,
          'on-remove': this.handleRemove,
          'http-request': this.httpRequest
        },
        ref: 'upload-inner'
      };
      var trigger = this.$slots.trigger || this.$slots.default;
      var uploadComponent = (VueUtil.isDef(FormData)) ? createElement('upload', uploadData, [trigger]) : createElement('iframeUpload', uploadData, [trigger]);
      return createElement('div', null, ['picture-card' === this.listType ? uploadList : '', this.$slots.trigger ? [uploadComponent, this.$slots.default] : uploadComponent, this.$slots.tip, 'picture-card' !== this.listType ? uploadList : '']);
    },
    mounted: function() {
      if (this.disabled) {
        VueUtil.loop(this.$el.querySelectorAll('button'), function(buttonNote) {
          VueUtil.addClass(buttonNote, 'is-disabled');
        });
      }
    }
  };
  Vue.component(VueUpload.name, VueUpload);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueLoadingBar = definition(context.Vue, context.VueUtil);
    delete context.VueLoadingBar;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var loadingBar = null;
  var intervaler = null;
  var newInstance = function() {
    var loadingBar = document.createElement('div');
    loadingBar.className = 'vue-loading-bar';
    loadingBar.style.display = 'none';
    var innerDiv = document.createElement('div');
    VueUtil.addClass(innerDiv, 'vue-loading-bar-inner');
    VueUtil.addClass(innerDiv, 'vue-loading-bar-inner-color-primary');
    loadingBar.appendChild(innerDiv);
    document.body.appendChild(loadingBar);
    return {
      show: function(options) {
        if (loadingBar.style.display === 'none') {
          loadingBar.style.display = '';
          loadingBar.style.zIndex = VueUtil.nextZIndex();
        }
        if (options.error) {
          VueUtil.addClass(innerDiv, 'vue-loading-bar-inner-color-error');
        } else {
          VueUtil.removeClass(innerDiv, 'vue-loading-bar-inner-color-error');
        }
        if (VueUtil.isDef(options.percent)) {
          innerDiv.style.width = options.percent + '%';
        }
      },
      hide: function() {
        loadingBar.style.display = 'none';
      },
      isShow: function() {
        return (loadingBar.style.display !== 'none');
      }
    };
  };
  var initLoadingBar = function() {
    if (!VueUtil.isDef(loadingBar)) loadingBar = newInstance();
  };
  var hideInstance = VueUtil.debounce(500, function(fn) {
    if (VueUtil.isFunction(fn)) fn();
    loadingBar.hide();
  });
  var VueLoadingBar = {
    start: function(fn) {
      initLoadingBar();
      if (loadingBar.isShow()) return;
      var percent = 0;
      loadingBar.show({percent: percent});
      intervaler = setInterval(function() {
        percent += 6;
        if (percent > 95) {
          clearInterval(intervaler);
          percent = 96;
        }
        loadingBar.show({percent: percent});
      }, 250);
      if (VueUtil.isFunction(fn)) fn();
    },
    update: function(percent, fn) {
      initLoadingBar();
      clearInterval(intervaler);
      loadingBar.show({percent: percent});
      if (VueUtil.isFunction(fn)) fn();
    },
    finish: VueUtil.debounce(function(fn) {
      initLoadingBar();
      clearInterval(intervaler);
      loadingBar.show({percent: 100});
      hideInstance(fn);
    }),
    error: VueUtil.debounce(function(fn) {
      initLoadingBar();
      clearInterval(intervaler);
      loadingBar.show({percent: 100, error: true});
      hideInstance(fn);
    })
  };
  Vue.loadingBar = VueLoadingBar;
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueNote = definition(context.Vue);
    delete context.VueNote;
  }
})(this, function(Vue) {
  'use strict';
  var VueNote = {
    template: '<div :class="[\'vue-note\', typeClass, typeBox]"><div class="vue-note__content"><span class="vue-note__title is-bold" v-if="title">{{title}}</span><div class="vue-note__description"><slot></slot></div></div></div>',
    name: 'VueNote',
    props: {
      title: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'info'
      },
      plain: Boolean
    },
    computed: {
      typeClass: function() {
        return 'vue-note--' + this.type;
      },
      typeBox: function() {
        if (this.plain) {
          return 'vue-note--plain';
        }
      }
    }
  };
  Vue.component(VueNote.name, VueNote);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueList = definition(context.Vue, context.VueUtil);
    delete context.VueList;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueList = {
    name: 'VueList',
    data: function() {
      return {
        defaultSlotLen: 0,
        activedIndex: null,
      };
    },
    props: {
      height: {
        type: Number,
        default: 200
      },
      onScroll: Function,
      defaultActivedIndex: {
        type: Number,
        default: 0
      },
      defaultSelected: {
        type: Boolean,
        default: true
      },
      scrollbar: Boolean
    },
    methods: {
      setItemIndex: function(item) {
        item.index = this.$slots.default.indexOf(item.$vnode);
      },
      handleItemClick: function(itemObj) {
        this.activedIndex = itemObj.index;
      },
      handleScroll: function(e, scrollTop, isTop, isBottom) {
        if (!VueUtil.isDef(scrollTop)) {
          scrollTop = this.$el.scrollTop;
          isTop = (scrollTop === 0);
          isBottom = (scrollTop === this.$el.scrollHeight - this.$el.clientHeight);
        }
        this.updateZone(scrollTop);
        this.$emit('scroll', e, scrollTop, isTop, isBottom);
      },
      updateZone: function(offset) {
        var delta = this.delta;
        if (!VueUtil.isDef(delta)) return;
        if (delta.total <= delta.keeps) return;
        offset = offset || 0;
        var overs = Math.floor(offset / delta.size);
        overs < 0 && (overs = 0);
        var start = overs;
        var end = overs + delta.keeps;
        if (overs + delta.keeps >= delta.total) {
          end = delta.total;
          start = delta.total - delta.keeps;
        }
        delta.end = end;
        delta.start = start;
        this.$forceUpdate();
      },
      filter: function(slots) {
        var delta = this.delta;
        if (delta.keeps === 0 || slots.length <= delta.keeps) {
          delta.marginTop = 0;
          delta.marginBottom = 0;
          return slots;
        }
        delta.total = slots.length;
        delta.marginTop = delta.size * delta.start;
        delta.marginBottom = delta.size * (delta.total - delta.keeps - delta.start);
        var result = [];
        for (var i = delta.start, j = delta.end; i < j; i++) {
          result.push(slots[i]);
        }
        return result;
      },
      createDelta: function(slots) {
        var delta = this.delta = Object.create(null);
        delta.start = 0;
        delta.total = 0;
        delta.marginTop = 0;
        delta.marginBottom = 0;
        delta.size = 20;
        delta.remain = Math.floor(this.height * 1 / delta.size);
        delta.end = delta.remain;
        delta.keeps = delta.remain;
        if (slots.length <= delta.remain) {
          delta.end = slots.length;
          delta.keeps = slots.length;
        }
      }
    },
    render: function(createElement) {
      var slots = this.$slots.default;
      if (!VueUtil.isArray(slots)) return null;
      if (!VueUtil.isDef(this.delta) || this.defaultSlotLen !== slots.length) {
        this.createDelta(slots);
        this.defaultSlotLen = slots.length;
      }
      var delta = this.delta;
      var showList = this.filter(slots);
      var style = {
        'margin-top': delta.marginTop + 'px',
        'margin-bottom':  delta.marginBottom + 'px'
      };
      if (VueUtil.isChrome) {
        style = {
          'padding-top': delta.marginTop + 'px',
          'padding-bottom':  delta.marginBottom + 'px'
        };
      }
      var list = null;
      if (this.scrollbar) {
        list = createElement('div', {
          'class': ['vue-list'],
          'style': {
            'height': this.height * 1 + 'px'
          }
        }, [createElement('vue-scrollbar', {
            props: {
              height: this.height * 1
            },
            'on': {
              'scrollY': this.handleScroll
            },
            ref: 'scrollbar'
          }, [createElement('div', {
            'style': style
          }, showList)])
        ]);
      } else {
        list = createElement('div', {
          'class': ['vue-list'],
          'style': {
            'height': this.height * 1 + 'px',
            'overflow': 'auto'
          },
          'on': {
            'scroll': this.handleScroll
          }
        }, [createElement('div', {
            'style': {
              'margin-top': delta.marginTop + 'px',
              'margin-bottom':  delta.marginBottom + 'px'
            }
          }, showList)
        ]);
      }
      return list;
    },
    mounted: function() {
      var self = this;
      self.$on('item-click', self.handleItemClick);
      if (self.defaultSelected && self.$slots.default) {
        self.$nextTick(function() {
          var defaultSlot = self.$slots.default[self.defaultActivedIndex];
          defaultSlot && defaultSlot.componentInstance && defaultSlot.componentInstance.handleClick();
        });
      }
    }
  };
  Vue.component(VueList.name, VueList);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueListItem = definition(context.Vue, context.VueUtil);
    delete context.VueListItem;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueListItem = {
    template: '<div :class="[\'vue-list-item\', {\'is-active\': isActive}]" @click="handleClick"><slot></slot></div>',
    name: 'VueListItem',
    mixins: [VueUtil.component.emitter],
    data: function() {
      return {
        index: null
      };
    },
    methods: {
      handleClick: function() {
        this.dispatch('VueList', 'item-click', this);
        this.$emit('select', this);
      }
    },
    computed: {
      list: function() {
        var parent = this.$parent;
        while (parent.$options.name !== 'VueList') {
          parent = parent.$parent;
        }
        return parent;
      },
      isActive: function() {
        return this.list.activedIndex === this.index;
      }
    },
    mounted: function() {
      this.list.setItemIndex(this);
    }
  };
  Vue.component(VueListItem.name, VueListItem);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueDivider = definition(context.Vue);
    delete context.VueDivider;
  }
})(this, function(Vue) {
  'use strict';
  var VueDivider = {
    template: '<div class="vue-divider"><legend class="vue-divider__content" v-if="$slots.default"><slot></slot></legend></div>',
    name: 'VueDivider'
  };
  Vue.component(VueDivider.name, VueDivider);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VuePopper'], definition);
  } else {
    context.VueColorPicker = definition(context.Vue, context.VueUtil, context.VuePopper);
    delete context.VueColorPicker;
  }
})(this, function(Vue, VueUtil, VuePopper) {
  'use strict';
  var bound01 = function(value, max) {
    var isOnePointZero = function(n) {
      return VueUtil.isString(n) && n.indexOf('.') !== -1 && parseFloat(n) === 1;
    };
    var isPercentage = function(n) {
      return VueUtil.isString(n) && n.indexOf('%') !== -1;
    };
    if (isOnePointZero(value)) value = '100%';
    var processPercent = isPercentage(value);
    value = Math.min(max, Math.max(0, parseFloat(value)));
    if (processPercent) {
      value = parseInt(value * max, 10) / 100;
    }
    if ((Math.abs(value - max) < 0.000001)) {
      return 1;
    }
    return (value % max) / parseFloat(max);
  };
  var rgb2hsv = function(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h,
      s;
    var v = max;
    var d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {
      h: h * 360,
      s: s * 100,
      v: v * 100
    };
  };
  var hsv2rgb = function(h, s, v) {
    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    var i = Math.floor(h);
    var f = h - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var mod = i % 6;
    var r = [v, q, p, p, t, v][mod];
    var g = [t, v, v, q, p, p][mod];
    var b = [p, p, t, v, v, q][mod];
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };
  var Color = function(options) {
    var self = this;
    self._hue = 0;
    self._saturation = 100;
    self._value = 100;
    self._alpha = 100;
    self.enableAlpha = false;
    self.format = 'hex';
    self.value = '';
    options = options || {};
    VueUtil.ownPropertyLoop(options, function(option) {
      self[option] = options[option];
    });
    self.doOnChange();
  };
  Color.prototype.set = function(prop, value) {
    var self = this;
    if (arguments.length === 1 && VueUtil.isObject(prop)) {
      VueUtil.ownPropertyLoop(prop, function(p) {
        self.set(p, prop[p]);
      });
      return;
    }
    self['_' + prop] = value;
    self.doOnChange();
  };
  Color.prototype.get = function(prop) {
    return this['_' + prop];
  };
  Color.prototype.toRgb = function() {
    return hsv2rgb(this._hue, this._saturation, this._value);
  };
  Color.prototype.fromString = function(value) {
    var self = this;
    if (!value) {
      this._hue = 0;
      this._saturation = 100;
      this._value = 100;
      this.doOnChange();
      return;
    }
    var fromHSV = function(h, s, v) {
      self._hue = h;
      self._saturation = s;
      self._value = v;
      self.doOnChange();
    };
    if (value.indexOf('hsl') !== -1) {
      var parts = VueUtil.map(VueUtil.filter(value.replace(/hsla|hsl|\(|\)/gm, '').split(/\s|,/g), function(val) {return val !== '';}), function(val, index) {return index > 2 ? parseFloat(val) : parseInt(val, 10);});
      if (parts.length === 4) {
        this._alpha = Math.floor(parseFloat(parts[3]) * 100);
      }
      if (parts.length >= 3) {
        var hsl2hsv = function(hue, sat, light) {
          sat = sat / 100;
          light = light / 100;
          var smin = sat;
          var lmin = Math.max(light, 0.01);
          var sv;
          var v;
          light *= 2;
          sat *= (light <= 1) ? light : 2 - light;
          smin *= lmin <= 1 ? lmin : 2 - lmin;
          v = (light + sat) / 2;
          sv = light === 0 ? (2 * smin) / (lmin + smin) : (2 * sat) / (light + sat);
          return {
            h: hue,
            s: sv * 100,
            v: v * 100
          };
        };
        var _hsl2hsv = hsl2hsv(parts[0], parts[1], parts[2]);
        var h = _hsl2hsv.h;
        var s = _hsl2hsv.s;
        var v = _hsl2hsv.v;
        fromHSV(h, s, v);
      }
    } else if (value.indexOf('hsv') !== -1) {
      var parts = VueUtil.map(VueUtil.filter(value.replace(/hsva|hsv|\(|\)/gm, '').split(/\s|,/g), function(val) {return val !== '';}), function(val, index) {return index > 2 ? parseFloat(val) : parseInt(val, 10);});
      if (parts.length === 4) {
        this._alpha = Math.floor(parseFloat(parts[3]) * 100);
      }
      if (parts.length >= 3) {
        fromHSV(parts[0], parts[1], parts[2]);
      }
    } else if (value.indexOf('rgb') !== -1) {
      var parts = VueUtil.map(VueUtil.filter(value.replace(/rgba|rgb|\(|\)/gm, '').split(/\s|,/g), function(val) {return val !== '';}), function(val, index) {return index > 2 ? parseFloat(val) : parseInt(val, 10);});
      if (parts.length === 4) {
        this._alpha = Math.floor(parseFloat(parts[3]) * 100);
      }
      if (parts.length >= 3) {
        var _rgb2hsv = rgb2hsv(parts[0], parts[1], parts[2]);
        var h = _rgb2hsv.h;
        var s = _rgb2hsv.s;
        var v = _rgb2hsv.v;
        fromHSV(h, s, v);
      }
    } else if (value.indexOf('#') !== -1) {
      var hex = value.replace('#', '').trim();
      var r, g, b;
      var parseHexChannel = function(hex) {
        var HEX_INT_MAP = {A: 10, B: 11, C: 12, D: 13, E: 14, F: 15};
        if (hex.length === 2) {
          return (HEX_INT_MAP[hex[0].toUpperCase()] || +hex[0]) * 16 + (HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1]);
        }
        return HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1];
      };
      if (hex.length === 3) {
        r = parseHexChannel(hex[0] + hex[0]);
        g = parseHexChannel(hex[1] + hex[1]);
        b = parseHexChannel(hex[2] + hex[2]);
      } else if (hex.length === 6) {
        r = parseHexChannel(hex.substring(0, 2));
        g = parseHexChannel(hex.substring(2, 4));
        b = parseHexChannel(hex.substring(4));
      }
      var _rgb2hsv = rgb2hsv(r, g, b);
      var h = _rgb2hsv.h;
      var s = _rgb2hsv.s;
      var v = _rgb2hsv.v;
      fromHSV(h, s, v);
    }
  };
  Color.prototype.doOnChange = function() {
    var _hue = this._hue;
    var _saturation = this._saturation;
    var _value = this._value;
    var _alpha = this._alpha;
    var format = this.format;
    var hsv2hsl = function(hue, sat, val) {
      return [hue, (sat * val / ((hue = (2 - sat) * val) < 1 ? hue : 2 - hue)) || 0, hue / 2];
    };
    if (this.enableAlpha) {
      switch (format) {
        case 'hsl':
          var hsl = hsv2hsl(_hue, _saturation / 100, _value / 100);
          this.value = 'hsla(' + _hue + ', ' + Math.round(hsl[1] * 100) + '%, ' + Math.round(hsl[2] * 100) + '%, ' + _alpha / 100 + ')';
          break;
        case 'hsv':
          this.value = 'hsva(' + _hue + ', ' + Math.round(_saturation) + '%, ' + Math.round(_value) + '%, ' + _alpha / 100 + ')';
          break;
        default:
          var _hsv2rgb = hsv2rgb(_hue, _saturation, _value);
          var r = _hsv2rgb.r;
          var g = _hsv2rgb.g;
          var b = _hsv2rgb.b;
          this.value = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + _alpha / 100 + ')';
      }
    } else {
      switch (format) {
        case 'hsl':
          var hsl = hsv2hsl(_hue, _saturation / 100, _value / 100);
          this.value = 'hsl(' + _hue + ', ' + Math.round(_hsl[1] * 100) + '%, ' + Math.round(_hsl[2] * 100) + '%)';
          break;
        case 'hsv':
          this.value = 'hsv(' + _hue + ', ' + Math.round(_saturation) + '%, ' + Math.round(_value) + '%)';
          break;
        case 'rgb':
          var _hsv2rgb2 = hsv2rgb(_hue, _saturation, _value);
          var r = _hsv2rgb2.r;
          var g = _hsv2rgb2.g;
          var b = _hsv2rgb2.b;
          this.value = 'rgb(' + r + ', ' + g + ', ' + b + ')';
          break;
        default:
          var toHex = function(ref) {
            var r = ref.r;
            var g = ref.g;
            var b = ref.b;
            var INT_HEX_MAP = {10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F'};
            var hexOne = function(value) {
              value = Math.min(Math.round(value), 255);
              var high = Math.floor(value / 16);
              var low = value % 16;
              return '' + (INT_HEX_MAP[high] || high) + (INT_HEX_MAP[low] || low);
            };
            if (isNaN(r) || isNaN(g) || isNaN(b)) return '';
            return '#' + hexOne(r) + hexOne(g) + hexOne(b);
          };
          this.value = toHex(hsv2rgb(_hue, _saturation, _value));
      }
    }
  };
  var draggable = function(element, options) {
    var isDragging = false;
    var moveFn = function(event) {
      if (options.drag) {
        options.drag(event);
      }
    };
    var upFn = function(event) {
      if (options.end) {
        options.end(event);
      }
      VueUtil.removeTouchMove(document, moveFn);
      VueUtil.removeTouchEnd(document, upFn);
      document.onselectstart = null;
      document.ondragstart = null;
      isDragging = false;
    };
    var downFn = function(event) {
      if (isDragging) return;
      if (options.start) {
        options.start(event);
      }
      VueUtil.addTouchMove(document, moveFn);
      VueUtil.addTouchEnd(document, upFn);
      document.onselectstart = function() {return false;};
      document.ondragstart = function() {return false;};
      isDragging = true;
    };
    VueUtil.addTouchStart(element, downFn);
  };
  var SvPanel = {
    template: '<div class="vue-color-svpanel" :style="{backgroundColor: background}"><div class="vue-color-svpanel__white"></div><div class="vue-color-svpanel__black"></div><div class="vue-color-svpanel__cursor" :style="{top: cursorTop + \'px\', left: cursorLeft + \'px\'}"><div></div></div></div>',
    props: {
      color: {
        required: true,
      }
    },
    computed: {
      colorValue: function() {
        var hue = this.color.get('hue');
        var value = this.color.get('value');
        return {hue: hue, value: value};
      }
    },
    watch: {
      colorValue: function() {
        this.update();
      }
    },
    methods: {
      update: function() {
        var saturation = this.color.get('saturation');
        var value = this.color.get('value');
        var el = this.$el;
        var boundingClientRect = el.getBoundingClientRect();
        var width = boundingClientRect.width;
        var height = boundingClientRect.height;
        if (!height) height = width * 3 / 4;
        this.cursorLeft = saturation * width / 100;
        this.cursorTop = (100 - value) * height / 100;
        this.background = 'hsl(' + this.color.get('hue') + ', 100%, 50%)';
      },
      handleDrag: function(event) {
        if (!VueUtil.isDef(event.clientX) && event.touches.length === 0) return;
        var el = this.$el;
        var rect = el.getBoundingClientRect();
        var left = (event.clientX || event.touches[0].clientX) - rect.left;
        var top = (event.clientY || event.touches[0].clientY) - rect.top;
        left = Math.max(0, left);
        left = Math.min(left, rect.width);
        top = Math.max(0, top);
        top = Math.min(top, rect.height);
        this.cursorLeft = left;
        this.cursorTop = top;
        this.color.set({
          saturation: left / rect.width * 100,
          value: 100 - top / rect.height * 100
        });
      }
    },
    mounted: function() {
      var self = this;
      draggable(self.$el, {
        start: function(event) {
          self.handleDrag(event);
        },
        drag: function(event) {
          self.handleDrag(event);
        },
        end: function(event) {
          self.handleDrag(event);
        }
      });
      self.update();
    },
    data: function() {
      return {
        cursorTop: 0,
        cursorLeft: 0,
        background: 'hsl(0, 100%, 50%)'
      };
    }
  };
  var HueSlider = {
    template: '<div :class="[\'vue-color-hue-slider\', {\'is-vertical\': vertical}]"><div class="vue-color-hue-slider__bar" @click="handleClick" ref="bar"></div><div class="vue-color-hue-slider__thumb" :style="{left: thumbLeft + \'px\', top: thumbTop + \'px\'}" ref="thumb"></div></div>',
    props: {
      color: {
        required: true
      },
      vertical: Boolean
    },
    data: function() {
      return {
        thumbLeft: 0,
        thumbTop: 0
      };
    },
    computed: {
      hueValue: function() {
        var hue = this.color.get('hue');
        return hue;
      }
    },
    watch: {
      hueValue: function() {
        this.update();
      }
    },
    methods: {
      handleClick: function(event) {
        var thumb = this.$refs.thumb;
        var target = event.target;
        if (target !== thumb) {
          this.handleDrag(event);
        }
      },
      handleDrag: function(event) {
        if (!VueUtil.isDef(event.clientX) && event.touches.length === 0) return;
        var rect = this.$el.getBoundingClientRect();
        var thumb = this.$refs.thumb;
        var hue;
        if (!this.vertical) {
          var thumbWidth = thumb.offsetWidth;
          var left = (event.clientX || event.touches[0].clientX) - rect.left;
          left = Math.min(left, rect.width - thumbWidth / 2);
          left = Math.max(thumbWidth / 2, left);
          hue = Math.round((left - thumbWidth / 2) / (rect.width - thumbWidth) * 360);
        } else {
          var thumbHeight = thumb.offsetHeight;
          var top = (event.clientY || event.touches[0].clientY) - rect.top;
          top = Math.min(top, rect.height - thumbHeight / 2);
          top = Math.max(thumbHeight / 2, top);
          hue = Math.round((top - thumbHeight / 2) / (rect.height - thumbHeight) * 360);
        }
        this.color.set('hue', hue);
      },
      getThumbLeft: function() {
        if (this.vertical) return 0;
        var el = this.$el;
        var hue = this.color.get('hue');
        if (!el) return 0;
        var thumb = this.$refs.thumb;
        return Math.round(hue * (el.offsetWidth - thumb.offsetWidth / 2) / 360);
      },
      getThumbTop: function() {
        if (!this.vertical) return 0;
        var el = this.$el;
        var hue = this.color.get('hue');
        if (!el) return 0;
        var thumb = this.$refs.thumb;
        return Math.round(hue * (el.offsetHeight - thumb.offsetHeight / 2) / 360);
      },
      update: function() {
        this.thumbLeft = this.getThumbLeft();
        this.thumbTop = this.getThumbTop();
      }
    },
    mounted: function() {
      var self = this;
      var _$refs = self.$refs;
      var bar = _$refs.bar;
      var thumb = _$refs.thumb;
      var dragConfig = {
        start: function(event) {
          self.handleDrag(event);
        },
        drag: function(event) {
          self.handleDrag(event);
        },
        end: function(event) {
          self.handleDrag(event);
        }
      };
      draggable(bar, dragConfig);
      draggable(thumb, dragConfig);
      self.update();
    }
  };
  var AlphaSlider = {
    template: '<div :class="[\'vue-color-alpha-slider\', {\'is-vertical\': vertical}]"><div class="vue-color-alpha-slider__bar" @click="handleClick" ref="bar" :style="{background: background}"></div><div class="vue-color-alpha-slider__thumb" ref="thumb" :style="{left: thumbLeft + \'px\', top: thumbTop + \'px\'}"></div></div>',
    props: {
      color: {
        required: true
      },
      vertical: Boolean
    },
    watch: {
      'color._alpha': function() {
        this.update();
      },
      'color.value': function() {
        this.update();
      }
    },
    methods: {
      handleClick: function(event) {
        var thumb = this.$refs.thumb;
        var target = event.target;
        if (target !== thumb) {
          this.handleDrag(event);
        }
      },
      handleDrag: function(event) {
        if (!VueUtil.isDef(event.clientX) && event.touches.length === 0) return;
        var rect = this.$el.getBoundingClientRect();
        var thumb = this.$refs.thumb;
        if (!this.vertical) {
          var thumbWidth = thumb.offsetWidth;
          var left = (event.clientX || event.touches[0].clientX) - rect.left;
          left = Math.max(thumbWidth / 2, left);
          left = Math.min(left, rect.width - thumbWidth / 2);
          this.color.set('alpha', Math.round((left - thumbWidth / 2) / (rect.width - thumbWidth) * 100));
        } else {
          var thumbHeight = thumb.offsetHeight;
          var top = (event.clientY || event.touches[0].clientY) - rect.top;
          top = Math.max(thumbHeight / 2, top);
          top = Math.min(top, rect.height - thumbHeight / 2);
          this.color.set('alpha', Math.round((top - thumbHeight / 2) / (rect.height - thumbHeight) * 100));
        }
      },
      getThumbLeft: function() {
        if (this.vertical) return 0;
        var el = this.$el;
        var alpha = this.color._alpha;
        if (!el) return 0;
        var thumb = this.$refs.thumb;
        return Math.round(alpha * (el.offsetWidth - thumb.offsetWidth / 2) / 100);
      },
      getThumbTop: function() {
        if (!this.vertical) return 0;
        var el = this.$el;
        var alpha = this.color._alpha;
        if (!el) return 0;
        var thumb = this.$refs.thumb;
        return Math.round(alpha * (el.offsetHeight - thumb.offsetHeight / 2) / 100);
      },
      getBackground: function() {
        if (this.color && this.color.value) {
          var colorToRgb = this.color.toRgb();
          var r = colorToRgb.r;
          var g = colorToRgb.g;
          var b = colorToRgb.b;
          return 'linear-gradient(to right, rgba(' + r + ', ' + g + ', ' + b + ', 0) 0%, rgba(' + r + ', ' + g + ', ' + b + ', 1) 100%)';
        }
        return null;
      },
      update: function() {
        this.thumbLeft = this.getThumbLeft();
        this.thumbTop = this.getThumbTop();
        this.background = this.getBackground();
      }
    },
    data: function() {
      return {
        thumbLeft: 0,
        thumbTop: 0,
        background: null
      };
    },
    mounted: function() {
      var self = this;
      var _$refs = self.$refs;
      var bar = _$refs.bar;
      var thumb = _$refs.thumb;
      var dragConfig = {
        start: function(event) {
          self.handleDrag(event);
        },
        drag: function(event) {
          self.handleDrag(event);
        },
        end: function(event) {
          self.handleDrag(event);
        }
      };
      draggable(bar, dragConfig);
      draggable(thumb, dragConfig);
      self.update();
    }
  };
  var PickerDropdown = {
    template: '<transition @after-leave="destroyPopper"><div class="vue-color-dropdown" v-show="showPopper"><div class="vue-color-dropdown__main-wrapper"><hue-slider ref="hue" :color="color" vertical style="float: right;"></hue-slider><sv-panel ref="sl" :color="color"></sv-panel></div><alpha-slider v-if="showAlpha" ref="alpha" :color="color"></alpha-slider><div class="vue-color-dropdown__btns"><vue-row type="flex" justify="space-between"><vue-col :span="14"><vue-input size="small" class="vue-color-dropdown__value" v-model="currentColor" @blur="formatColor"></vue-input></vue-col><vue-col :span="8"><vue-button type="text" @click="$emit(\'clear\')">{{$t(\'vue.colorpicker.clear\')}}</vue-button><vue-button @click="confirmValue">{{$t(\'vue.colorpicker.confirm\')}}</vue-button></vue-col></vue-row></div></div></transition>',
    mixins: [VuePopper],
    components: {
      SvPanel: SvPanel,
      HueSlider: HueSlider,
      AlphaSlider: AlphaSlider
    },
    props: {
      color: {
        required: true
      },
      showAlpha: Boolean
    },
    data: function() {
      return {
        currentColor: null
      };
    },
    methods: {
      confirmValue: function() {
        this.$emit('pick');
      },
      formatColor: function() {
        this.$parent.color.fromString(this.currentColor);
      }
    },
    mounted: function() {
      this.$parent.popperElm = this.popperElm = this.$el;
      this.referenceElm = this.$parent.$el;
    },
    watch: {
      '$parent.color.value': function(val) {
        this.currentColor = val;
      },
      showPopper: function(val) {
        var self = this;
        if (val === true) {
          self.$nextTick(function() {
            var _$refs = self.$refs;
            var sl = _$refs.sl;
            var hue = _$refs.hue;
            var alpha = _$refs.alpha;
            sl && sl.update();
            hue && hue.update();
            alpha && alpha.update();
          });
        }
      }
    }
  };
  var VueColorPicker = {
    template: '<div class="vue-color-picker" :class="[disabled ? \'is-disabled\' : \'\']" v-clickoutside="hide"><div class="vue-color-picker__mask" v-if="disabled"></div><div class="vue-color-picker__trigger" @click="handleTrigger"><span :class="[\'vue-color-picker__color\', {\'is-alpha\': showAlpha}]"><span class="vue-color-picker__color-inner" :style="{backgroundColor: displayedColor}"></span><span class="vue-color-picker__empty vue-icon-close" v-if="!value && !showPanelColor"></span></span><span class="vue-color-picker__icon vue-icon-arrow-down"></span></div><picker-dropdown ref="dropdown" class="vue-color-picker__panel" v-model="showPicker" @pick="confirmValue" @clear="clearValue" :color="color" :show-alpha="showAlpha"></picker-dropdown></div>',
    name: 'VueColorPicker',
    props: {
      value: String,
      showAlpha: Boolean,
      colorFormat: String,
      disabled: Boolean
    },
    directives: {
      Clickoutside: VueUtil.component.clickoutside()
    },
    computed: {
      displayedColor: function() {
        if (!this.value && !this.showPanelColor) {
          return 'transparent';
        } else {
          var colorToRgb = this.color.toRgb();
          var r = colorToRgb.r;
          var g = colorToRgb.g;
          var b = colorToRgb.b;
          return this.showAlpha ? 'rgba(' + r + ', ' + g + ', ' + b + ', ' + this.color.get('alpha') / 100 + ')' : 'rgb(' + r + ', ' + g + ', ' + b + ')';
        }
      }
    },
    watch: {
      value: function(val) {
        if (!val) {
          this.showPanelColor = false;
        } else if (val !== this.color.value) {
          this.color.fromString(val);
        }
      },
      color: {
        deep: true,
        handler: function() {
          this.showPanelColor = true;
        }
      },
      disabled: function(val) {
        if(val === true) {
          this.showPicker = false;
        }
      }
    },
    methods: {
      handleTrigger: function() {
        if (this.disabled) return;
        this.showPicker = !this.showPicker;
      },
      confirmValue: function(value) {
        this.$emit('input', this.color.value);
        this.$emit('change', this.color.value);
        this.showPicker = false;
      },
      clearValue: function() {
        this.$emit('input', null);
        this.$emit('change', null);
        this.showPanelColor = false;
        this.showPicker = false;
        this.resetColor();
      },
      hide: function() {
        this.showPicker = false;
        this.resetColor();
      },
      resetColor: function() {
        var self = this;
        self.$nextTick(function() {
          if (self.value) {
            self.color.fromString(self.value);
          } else {
            self.showPanelColor = false;
          }
        });
      }
    },
    mounted: function() {
      var value = this.value;
      if (value) {
        this.color.fromString(value);
      }
      this.popperElm = this.$refs.dropdown.$el;
    },
    data: function() {
      var color = new Color({
        enableAlpha: this.showAlpha,
        format: this.colorFormat
      });
      return {
        color: color,
        showPicker: false,
        showPanelColor: false
      };
    },
    components: {
      PickerDropdown: PickerDropdown
    }
  };
  Vue.component(VueColorPicker.name, VueColorPicker);
});

(function(context, definition) {
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VueDatePicker'], definition);
  } else {
    context.VueCalendar = definition(context.Vue, context.VueUtil, context.VueDatePicker);
    delete context.VueCalendar;
    delete context.VueDatePicker;
    delete context.VuePicker;
  }
})(this, function(Vue, VueUtil, VueDatePicker) {
  'use strict';
  var EventCard = {
    props: {
      date: Date,
      firstDay: Number,
      event: Object
    },
    data: function() {
      return {
        defaultWidth: 0
      };
    },
    render: function(createElement) {
      if (this.defaultWidth === 0) return;
      var self = this;
      var event = self.event;
      var start = VueUtil.parseDate(event.start);
      var end = VueUtil.parseDate(event.end);
      var showTitile = (self.date.getDay() === self.firstDay || VueUtil.formatDate(start) === VueUtil.formatDate(self.date));
      var eventItem = createElement('div', {class: ['vue-full-calendar__event-item', 'is-opacity']}, []);
      if (showTitile) {
        var dateCount = Math.floor((end.getTime() - self.date.getTime()) / 86400000) + 1;
        var lastDayCount = 7 - self.date.getDay();
        var defaultWidth = self.defaultWidth;
        var isEnd = false;
        if (lastDayCount >= dateCount) {
          defaultWidth = defaultWidth * dateCount;
          isEnd = true;
        } else {
          defaultWidth = defaultWidth * lastDayCount;
        }
        if (isEnd) defaultWidth = defaultWidth - 4;
        var eventClass = [];
        var customClass = event.customClass;
        if (VueUtil.isDef(customClass)) {
          VueUtil.mergeArray(eventClass, customClass);
        }
        if (VueUtil.formatDate(start) === VueUtil.formatDate(self.date)) {
          eventClass.push('is-start');
          defaultWidth = defaultWidth - 4;
        }
        eventClass = eventClass.join(' ');
        var mouseenterItem = function(eventCards, event) {
          VueUtil.loop(eventCards, function(card) {
            if (card.event.cellIndex === event.cellIndex
              && VueUtil.formatDate(event.start) === VueUtil.formatDate(card.event.start)
              && VueUtil.formatDate(event.end) === VueUtil.formatDate(card.event.end)) {
              card.$refs.eventItem && card.$refs.eventItem.classList.add('hover');
            }
          });
        };
        var mouseleaveItem = function(eventCards, event) {
          VueUtil.loop(eventCards, function(card) {
            if (card.event.cellIndex === event.cellIndex
              && VueUtil.formatDate(event.start) === VueUtil.formatDate(card.event.start)
              && VueUtil.formatDate(event.end) === VueUtil.formatDate(card.event.end)) {
              card.$refs.eventItem && card.$refs.eventItem.classList.remove('hover');
            }
          });
        };
        var eventCards = self.$parent.$refs.eventCard;
        eventItem = createElement('div', null, [createElement('div', {
          class: ['vue-full-calendar__event-item', eventClass, {'is-opacity': !event.isShow}],
          style: {'position': 'absolute', 'width': defaultWidth + 'px'},
          ref: 'eventItem',
          attrs: {title: event.title},
          on: {
            click: function(e) {
              self.$emit('click', event, e);
            },
            mouseenter: function(e) {mouseenterItem(eventCards, event);},
            mouseleave: function(e) {mouseleaveItem(eventCards, event);}
          },
        }, [event.title]), createElement('div', {class: ['vue-full-calendar__event-item', 'is-opacity']}, [])]);
      }
      return eventItem;
    }
  };
  var FcHeader = {
    template: '<div class="vue-full-calendar-header"><div class="vue-full-calendar-header__left"><slot name="fcLeftHeader"></slot></div><div class="vue-full-calendar-header__center"><button type="button" @click="changeMonth(-1 , \'year\')" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-d-arrow-left"></button><button type="button" @click="changeMonth(-1, \'month\')" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-arrow-left"></button><vue-popover trigger="click"><year-table @pick="handleYearPick" :year="currentMonth.getFullYear()"></year-table><span slot="reference" class="vue-date-picker__header-label">{{yearLabel}}</span></vue-popover><vue-popover trigger="click"><month-table @pick="handleMonthPick" :month="currentMonth.getMonth()"></month-table><span slot="reference" :class="[\'vue-date-picker__header-label\']">{{monthLabel}}</span></vue-popover><button type="button" @click="changeMonth(1 , \'year\')" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-d-arrow-right"></button><button type="button" @click="changeMonth(1 , \'month\')" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-arrow-right"></button></div><div class="vue-full-calendar-header__right"><slot name="fcRightHeader"></slot><span class="thisMonth" @click="changeToNow" v-if="!$slots.fcRightHeader">{{$t(\'vue.datepicker.thisMonth\')}}</span></div></div>',
    props: {
      currentMonth: Date,
      firstDay: Number
    },
    components: {
      YearTable: VueDatePicker().YearTable,
      MonthTable: VueDatePicker().MonthTable
    },
    computed: {
      monthLabel: function() {
        var month = this.currentMonth.getMonth() + 1;
        return this.$t('vue.datepicker.month' + month);
      },
      yearLabel: function() {
        var year = this.currentMonth.getFullYear();
        if (!year) return '';
        var yearTranslation = this.$t('vue.datepicker.year');
        return year + ' ' + yearTranslation;
      }
    },
    methods: {
      handleYearPick: function(year) {
        var result = new Date();
        this.currentMonth.setFullYear(year);
        result.setTime(this.currentMonth.getTime());
        this.$emit('change', result);
      },
      handleMonthPick: function(month) {
        var result = new Date();
        this.currentMonth.setMonth(month);
        result.setTime(this.currentMonth.getTime());
        this.$emit('change', result);
      },
      changeMonth: function(num, type) {
        var newMonth = VueUtil.addDate(this.currentMonth, num, type);
        this.$emit('change', newMonth);
      },
      changeToNow: function() {
        this.$emit('change', new Date);
      }
    }
  };
  var FullCalendar = {
    template: '<div class="vue-full-calendar" :style="compStyle"><fc-header :current-month="currentMonth" :first-day="firstDay" @change="emitChangeMonth"><slot slot="fcLeftHeader" name="fcHeaderLeft"></slot><slot slot="fcRightHeader" name="fcHeaderRight"></slot></fc-header><div class="vue-full-calendar-body"><div v-if="weekLabel" class="vue-full-calendar__weeks"><div class="vue-full-calendar__week" v-for="(week, weekIndex) in WEEKS" :key="weekIndex">{{$t(weekLabel[week])}}</div></div><div v-else class="vue-full-calendar__weeks"><div class="vue-full-calendar__week" v-for="(week, weekIndex) in WEEKS" :key="weekIndex">{{$t(\'vue.datepicker.weeks.\'+week)}}</div></div><div class="vue-full-calendar__dates"><div class="vue-full-calendar__dates-events"><div class="vue-full-calendar__events-week" v-for="(week,weekIndex) in currentDates" :key="weekIndex"><div v-for="(day, dayIndex) in week" :style="eventDayStyle" :key="dayIndex" :class="[\'vue-full-calendar__events-day\', {\'today\': day.isToday}, day.dayClass]" ref="eventsDay"><div :class="[\'day-number\']" @mouseenter="mouseenterDay" @mouseleave="mouseleaveDay" @click="dayclick(day.date, $event)">{{day.monthDay}}</div><div class="vue-full-calendar__event-box"><event-card ref="eventCard" :event="event" :date="day.date" :firstDay="firstDay" v-for="(event, eventIndex) in day.events" :key="eventIndex" v-show="event.cellIndex <= eventLimit" @click="eventclick"></event-card><vue-popover trigger="click" v-if="day.events.length > eventLimit && showMore"><div class="vue-full-calendar__more-events"><ul class="events-list"><li v-for="(event, eventIndex) in selectDay.showEvents" :key="eventIndex" :class="[\'vue-full-calendar__event-item\', event.customClass]" @click="eventclick(event, $event)" @mouseenter="mouseenterEvent(event, $event)" @mouseleave="mouseleaveEvent(event, $event)" :title="event.title">{{event.title}}</li></ul></div><div slot="reference" class="more-link" @click="moreclick(day, $event)">+ {{day.moreCount}}</div></vue-popover><div v-if="day.events.length > eventLimit && !showMore" class="more-link" @click="moreclick(day, $event)">+{{day.moreCount}}</div></div></div></div></div></div></div></div>',
    props: {
      events: Array,
      eventLimit: Number,
      showMore: Boolean,
      dateClass: Array,
      weekClass: Array,
      weekLabel: Object
    },
    components: {
      EventCard: EventCard,
      FcHeader: FcHeader
    },
    mounted: function() {
      this.emitChangeMonth(this.currentMonth);
      VueUtil.addResizeListener(this.$el, this.changeEventCardWidth);
    },
    beforeDestroy: function() {
      this.$el && VueUtil.removeResizeListener(this.$el, this.changeEventCardWidth);
    },
    data: function() {
      return {
        currentMonth: new Date,
        firstDay: 0,
        selectDay: {}
      };
    },
    computed: {
      currentDates: function() {
        return this.getCalendar();
      },
      WEEKS: function() {
        var WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        var week = this.firstDay;
        return VueUtil.mergeArray(WEEKS, WEEKS).slice(week, week + 7);
      },
      eventDayStyle: function() {
        var style = {};
        var height = (this.eventLimit + 2) * 20;
        style.height = height + 'px';
        return style;
      },
      compStyle: function() {
        var style = {};
        var width = (this.eventLimit + 2) * 20 * 7 + 43;
        var height = (this.eventLimit + 2) * 20 * 7 + 63 - this.eventLimit * 20;
        style.width = width + 'px';
        style.height = height + 'px';
        return style;
      }
    },
    watch: {
      events: function(val) {
        this.$nextTick(this.changeEventCardWidth);
      }
    },
    methods: {
      changeEventCardWidth: function() {
        var eventCard = this.$refs.eventCard;
        var defaultWidth = parseFloat(VueUtil.getStyle(this.$refs.eventsDay[0], 'width'));
        if (VueUtil.isArray(eventCard)) {
          VueUtil.loop(eventCard, function(card) {
            card.defaultWidth = defaultWidth;
          });
        } else if(VueUtil.isDef(eventCard)) {
          eventCard.defaultWidth = defaultWidth;
        }
      },
      getStartDateOfMonth: function(year, month) {
        var result = new Date(year, month, 1);
        var day = result.getDay();
        if (day === 0) day = 7;
        result.setTime(result.getTime() - 86400000 * day);
        return result;
      },
      emitChangeMonth: function(firstDayOfMonth) {
        this.currentMonth = firstDayOfMonth;
        var start = this.getStartDateOfMonth(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth());
        var end = VueUtil.addDate(start, 6, 'week');
        this.$emit('changemonth', start, end, firstDayOfMonth);
        this.$nextTick(this.changeEventCardWidth);
      },
      getCalendar: function() {
        var monthViewStartDate = this.getStartDateOfMonth(this.currentMonth.getFullYear(), this.currentMonth.getMonth());
        var calendar = [];
        var dateClassAry = this.dateClass;
        var weekClassAry = this.weekClass;
        for (var perWeek = 0; perWeek < 6; perWeek++) {
          var week = [];
          for (var perDay = 0; perDay < 7; perDay++) {
            var dayClass = [];
            VueUtil.loop(dateClassAry, function(dateClass) {
              if (VueUtil.formatDate(dateClass.date) === VueUtil.formatDate(monthViewStartDate)) {
                VueUtil.mergeArray(dayClass, dateClass.customClass);
              }
            });
            VueUtil.loop(weekClassAry, function(weekClass) {
              if (weekClass.week === perDay) {
                VueUtil.mergeArray(dayClass, weekClass.customClass);
              }
            });
            week.push({
              monthDay: monthViewStartDate.getDate(),
              isToday: (VueUtil.formatDate(monthViewStartDate) === VueUtil.formatDate(new Date)),
              weekDay: perDay,
              date: monthViewStartDate,
              events: this.slotEvents(monthViewStartDate),
              dayClass: dayClass
            });
            monthViewStartDate = VueUtil.addDate(monthViewStartDate, 1);
          }
          var self = this;
          VueUtil.loop(week, function(day) {
            day.showEvents = VueUtil.filter(day.events, function(event) {
              return event.isShow === true;
            });
            day.moreCount = 0;
            VueUtil.loop(day.showEvents, function(event) {
              if (event.cellIndex > self.eventLimit) {
                day.moreCount++;
              }
            });
          });
          calendar.push(week);
        }
        return calendar;
      },
      slotEvents: function(date) {
        var cellIndexArr = [];
        var events = VueUtil.mergeArray([], this.events);
        var thisDayEvents = VueUtil.filter(events, function(day) {
          var st = VueUtil.parseDate(day.start).getTime();
          var ed = VueUtil.parseDate(day.end ? day.end : st).getTime();
          var de = VueUtil.parseDate(date).getTime();
          return (de >= st && de <= ed);
        });
        thisDayEvents.sort(function(a, b) {
          if (!a.cellIndex) return 1;
          if (!b.cellIndex) return -1;
          return a.cellIndex - b.cellIndex;
        });
        for (var i = 0; i < thisDayEvents.length; i++) {
          thisDayEvents[i].cellIndex = thisDayEvents[i].cellIndex || (i + 1);
          thisDayEvents[i].isShow = true;
          if (thisDayEvents[i].cellIndex === i + 1 || i > this.eventLimit) continue;
          var formatDate = VueUtil.formatDate(date);
          thisDayEvents.splice(i, 0, {
            cellIndex: i + 1,
            start: formatDate,
            end: formatDate,
            isShow: false
          });
        }
        return thisDayEvents;
      },
      findEventsByDate: function(date, events) {
        var findEvents = [];
        VueUtil.loop(events, function(event) {
          var st = VueUtil.parseDate(event.start).getTime();
          var ed = VueUtil.parseDate(event.end ? event.end : st).getTime();
          var de = VueUtil.parseDate(date).getTime();
          if (de >= st && de <= ed) {
            findEvents.push(event);
          }
        });
        return findEvents;
      },
      mouseenterDay: function(e) {
        e.target.parentElement.classList.add('hover');
      },
      mouseleaveDay: function(e) {
        e.target.parentElement.classList.remove('hover');
      },
      mouseenterEvent: function(event, e) {
        VueUtil.loop(this.$refs.eventCard, function(card) {
          if (card.event.cellIndex === event.cellIndex
            && VueUtil.formatDate(event.start) === VueUtil.formatDate(card.event.start)
            && VueUtil.formatDate(event.end) === VueUtil.formatDate(card.event.end)) {
            card.$refs.eventItem && card.$refs.eventItem.classList.add('hover');
          }
        });
        e.target.classList.add('hover');
      },
      mouseleaveEvent: function(event, e) {
        VueUtil.loop(this.$refs.eventCard, function(card) {
          if (card.event.cellIndex === event.cellIndex
            && VueUtil.formatDate(event.start) === VueUtil.formatDate(card.event.start)
            && VueUtil.formatDate(event.end) === VueUtil.formatDate(card.event.end)) {
            card.$refs.eventItem && card.$refs.eventItem.classList.remove('hover');
          }
        });
        e.target.classList.remove('hover');
      },
      moreclick: function(day, jsEvent) {
        this.selectDay = day;
        var dateEvents = this.findEventsByDate(day.date, this.events);
        this.$emit('moreclick', day.date, dateEvents, jsEvent);
      },
      dayclick: function(date, jsEvent) {
        var dateEvents = this.findEventsByDate(date, this.events);
        this.$emit('dayclick', date, dateEvents, jsEvent);
      },
      eventclick: function(event, jsEvent) {
        if (!event.isShow) return;
        jsEvent.stopPropagation();
        this.$emit('eventclick', event, jsEvent);
      }
    }
  };
  var DefaultCalendar = {
    template: '<div :style="{width: width + \'px\'}" class="vue-picker-panel vue-date-picker has-time"><div class="vue-picker-panel__body-wrapper"><div class="vue-picker-panel__body"><div class="vue-date-picker__header" v-show="currentView !== \'time\'"><button type="button" @click="prevYear" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-d-arrow-left"></button><button type="button" @click="prevMonth" v-show="currentView === \'date\'" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-arrow-left"></button><span @click="showYearPicker" class="vue-date-picker__header-label">{{yearLabel}}</span><span @click="showMonthPicker" v-show="currentView === \'date\'" :class="[\'vue-date-picker__header-label\', {active: currentView === \'month\'}]">{{monthLabel}}</span><button type="button" @click="nextYear" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-d-arrow-right"></button><button type="button" @click="nextMonth" v-show="currentView === \'date\'" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-arrow-right"></button></div><div class="vue-picker-panel__content"><date-table v-show="currentView === \'date\'" @pick="handleDatePick" :year="year" :month="month" :date="date" :week="week" :selection-mode="selectionMode" :first-day-of-week="firstDayOfWeek" :disabled-date="disabledDate" :events="events"></date-table><year-table ref="yearTable" :year="year" :date="date" v-show="currentView === \'year\'" @pick="handleYearPick" :disabled-date="disabledDate"></year-table><month-table :month="month" :date="date" v-show="currentView === \'month\'" @pick="handleMonthPick" :disabled-date="disabledDate"></month-table></div></div></div><div class="vue-picker-panel__footer"><a href="JavaScript:" class="vue-picker-panel__link-btn" @click="changeToNow">{{nowLabel}}</a></div></div>',
    mixins: [VueDatePicker().DatePanel],
    data: function() {
      return {
        date: new Date(),
        selectionMode: 'day',
        currentView: 'date',
        disabledDate: {},
        firstDayOfWeek: 0,
        year: null,
        month: null,
        week: null,
        width: 0
      };
    },
    props: {
      events: Array
    },
    computed: {
      yearLabel: function() {
        var year = this.year;
        if (!year)
          return '';
        var yearTranslation = this.$t('vue.datepicker.year');
        if (this.currentView === 'year') {
          var startYear = Math.floor(year / 10) * 10;
          if (yearTranslation) {
            return startYear + ' ' + yearTranslation + ' - ' + (startYear + 9) + ' ' + yearTranslation;
          }
          return startYear + ' - ' + (startYear + 9);
        }
        return this.year + ' ' + yearTranslation;
      },
      monthLabel: function() {
        return this.$t('vue.datepicker.month' + (this.month + 1));
      },
      nowLabel: function() {
        return this.$t('vue.datepicker.today');
      }
    },
    mounted: function() {
      if (this.date && !this.year) {
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
      }
      this.$emit('pick', this.date);
    },
    created: function() {
      this.$on('pick', function(date) {
        var findEventsByDate = function(date, events) {
          if (events && events.length > 0) {
            var findEvents = [];
            VueUtil.loop(events, function(event) {
              var st = VueUtil.parseDate(event.start).getTime();
              var ed = VueUtil.parseDate(event.end ? event.end : st).getTime();
              var de = VueUtil.parseDate(date).getTime();
              if (de >= st && de <= ed) {
                findEvents.push(event);
              }
            });
            return findEvents;
          }
        };
        var dateEvents = findEventsByDate(date, this.events);
        this.$emit('dayclick', date, dateEvents);
      });
    }
  };
  var VueCalendar = {
    template: '<full-calendar v-if="full" ref="fullCalendar" :date-class="dateClass" :week-class="weekClass" :week-label="weekLabel" :events="events" :event-limit="eventLimit" :show-more="showMore" @dayclick="dayclick" @eventclick="eventclick" @moreclick="moreclick"><slot name="headerLeft" slot="fcHeaderLeft"></slot><slot name="headerRight" slot="fcHeaderRight"></slot></full-calendar><calendar v-else :events="events" @dayclick="dayclick" ref="calendar"></calendar>',
    name: 'VueCalendar',
    components: {
      calendar: DefaultCalendar,
      FullCalendar: FullCalendar
    },
    props: {
      events: {
        type: Array,
        default: function() {
          return [];
        }
      },
      eventLimit: {
        type: Number,
        default: 2
      },
      showMore: {
        type: Boolean,
        default: true
      },
      dateClass: {
        type: Array,
        default: function() {
          return [];
        }
      },
      weekClass: {
        type: Array,
        default: function() {
          return [];
        }
      },
      weekLabel: {
        type: Object,
        default: function() {
          return null;
        }
      },
      full: Boolean
    },
    methods: {
      changeToNow: function () {
        if (this.$refs.fullCalendar && this.$refs.fullCalendar.emitChangeMonth) {
          this.$refs.fullCalendar.emitChangeMonth(new Date);
        }
      },
      getDate: function () {
        if (this.$refs.fullCalendar) {
          return this.$refs.fullCalendar.currentMonth;
        }
      },
      dayclick: function(day, events, jsEvent) {
        this.$emit('dayclick', day, events, jsEvent);
      },
      eventclick: function(event, jsEvent) {
        this.$emit('eventclick', event, jsEvent);
      },
      moreclick: function(day, events, jsEvent) {
        this.$emit('moreclick', day, events, jsEvent);
      },
    }
  };
  Vue.component(VueCalendar.name, VueCalendar);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VuePin = definition(context.Vue, context.VueUtil);
    delete context.VuePin;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VuePin = {
    template: '<div><div :style="styles"><slot></slot></div></div>',
    name: 'VuePin',
    props: {
      offsetTop: {
        type: Number,
        default: 0
      },
      offsetBottom: {
        type: Number
      },
      fixed: Boolean
    },
    data: function() {
      return {
        pin: false,
        styles: {}
      };
    },
    computed: {
      offsetType: function() {
        var type = 'top';
        if (this.offsetBottom >= 0) {
          type = 'bottom';
        }
        return type;
      }
    },
    mounted: function() {
      var self = this;
      self.$nextTick(function() {
        if (self.fixed) {
          self.pin = true;
          var elOffset = self.getOffset(self.$el);
          if (self.offsetType == 'bottom') {
            self.styles = {
              bottom: self.offsetBottom + 'px',
              left: elOffset.left + 'px',
              width: self.$el.offsetWidth + 'px',
              position: 'fixed',
              zIndex: VueUtil.nextZIndex()
            };
          } else {
            self.styles = {
              top: self.offsetTop + 'px',
              left: elOffset.left + 'px',
              width: self.$el.offsetWidth + 'px',
              position: 'fixed',
              zIndex: VueUtil.nextZIndex()
            };
          }
        } else {
          self.scrollParent = VueUtil.component.getScrollParent(self.$el);
          VueUtil.on(self.scrollParent, 'scroll', self.handleScroll);
          VueUtil.addResizeListener(self.handleScroll);
        }
      });
    },
    beforeDestroy: function() {
      if (!this.fixed) {
        VueUtil.off(this.scrollParent, 'scroll', this.handleScroll);
        VueUtil.removeResizeListener(this.handleScroll);
      }
    },
    methods: {
      getScroll: function(top) {
        var ret = null;
        if (VueUtil.isDef(top)) {
          ret = pageYOffset;
          if (!VueUtil.isNumber(ret)) ret = document.documentElement.scrollTop;
        } else {
          ret = pageXOffset;
          if (!VueUtil.isNumber(ret)) ret = document.documentElement.scrollLeft;
        }
        return ret;
      },
      getOffset: function(element) {
        var rect = element.getBoundingClientRect();
        var scrollTop = this.getScroll(true);
        var scrollLeft = this.getScroll();
        var clientTop = document.body.clientTop || 0;
        var clientLeft = document.body.clientLeft || 0;
        return {
          top: rect.top + scrollTop - clientTop,
          left: rect.left + scrollLeft - clientLeft
        };
      },
      handleScroll: function() {
        var pin = this.pin;
        var scrollTop = this.getScroll(true);
        var elOffset = this.getOffset(this.$el);
        var windowHeight = innerHeight;
        var elHeight = this.$el.getElementsByTagName('div')[0].offsetHeight;
        if ((elOffset.top - this.offsetTop) < scrollTop && this.offsetType == 'top' && !pin) {
          this.pin = true;
          this.styles = {
            top: this.offsetTop + 'px',
            left: elOffset.left + 'px',
            width: this.$el.offsetWidth + 'px',
            position: 'fixed',
            zIndex: VueUtil.nextZIndex()
          };
          this.$emit('change', true);
        } else if ((elOffset.top - this.offsetTop) > scrollTop && this.offsetType == 'top' && pin) {
          this.pin = false;
          this.styles = null;
          this.$emit('change', false);
        }
        if ((elOffset.top + this.offsetBottom + elHeight) > (scrollTop + windowHeight) && this.offsetType == 'bottom' && !pin) {
          this.pin = true;
          this.styles = {
            bottom: this.offsetBottom + 'px',
            left: elOffset.left + 'px',
            width: this.$el.offsetWidth + 'px',
            position: 'fixed',
            zIndex: VueUtil.nextZIndex()
          };
          this.$emit('change', true);
        } else if ((elOffset.top + this.offsetBottom + elHeight) < (scrollTop + windowHeight) && this.offsetType == 'bottom' && pin) {
          this.pin = false;
          this.styles = null;
          this.$emit('change', false);
        }
      }
    }
  };
  Vue.component(VuePin.name, VuePin);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueDraggable = definition(context.Vue, context.VueUtil);
    delete context.VueDraggable;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var directive = function() {
    var Bind = function(object, fun, args) {
      return function() {
        return fun.apply(object, args || []);
      };
    };
    var BindAsEventListener = function(object, fun) {
      var args = [].slice.call(arguments).slice(2);
      return function(e) {
        return fun.apply(object, VueUtil.mergeArray([e || event], args));
      };
    };
    var Class = function(properties) {
      var _class = function() {
        return (arguments[0] !== null && VueUtil.isFunction(this.initialize)) ? this.initialize.apply(this, arguments) : this;
      };
      _class.prototype = properties;
      return _class;
    };
    var dragEl = new Class({
      initialize: function(el, cancelObj, resizeObj, offsetLeft, offsetTop) {
        this._dragobj = el;
        this._body = cancelObj;
        this._resize = resizeObj;
        this._x = 0;
        this._y = 0;
        this._fM = BindAsEventListener(this, this.Move);
        this._fS = Bind(this, this.Stop);
        this._isdrag = null;
        this._Css = null;
        this.offsetLeft = offsetLeft;
        this.offsetTop = offsetTop;
        this.Minwidth = parseInt(VueUtil.getStyle(el, 'minWidth'));
        this.Minheight = parseInt(VueUtil.getStyle(el, 'minHeight'));
        VueUtil.addTouchStart(this._dragobj, BindAsEventListener(this, this.Start, true));
        VueUtil.addTouchStart(this._resize, BindAsEventListener(this, this.Start, false));
      },
      isCancel: function(el) {
        if (this._body.indexOf(el) !== -1) return true;
        if (this._dragobj === el) return false;
        return this.isCancel(el.parentElement);
      },
      Cancelbubble: function(e) {
        VueUtil.isBoolean(e.cancelBubble) && (e.cancelBubble = true);
        VueUtil.isFunction(e.stopPropagation) && e.stopPropagation();
      },
      Changebg: function(o, x1, x2) {
        o.style.backgroundPosition = (o.style.backgroundPosition == x1) ? x2 : x1;
      },
      Start: function(e, isdrag) {
        var clientX = e.clientX;
        var clientY = e.clientY;
        if (e.touches && e.touches[0]) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        }
        if (!VueUtil.isDef(clientX) || !VueUtil.isDef(clientY) || this.isCancel(e.target)) return;
        if (!isdrag) this.Cancelbubble(e);
        this._Css = isdrag ? {
          x: 'left',
          y: 'top'
        } : {
            x: 'width',
            y: 'height'
          };
        this._isdrag = isdrag;
        this._x = isdrag ? (clientX - this._dragobj.offsetLeft + this.offsetLeft) : (this._dragobj.offsetLeft || 0);
        this._y = isdrag ? (clientY - this._dragobj.offsetTop + this.offsetTop) : (this._dragobj.offsetTop || 0);
        if (document.all) {
          VueUtil.on(this._dragobj, 'losecapture', this._fS);
          this._dragobj.setCapture();
        } else {
          e.preventDefault();
          VueUtil.on(document, 'blur', this._fS);
        }
        VueUtil.addTouchMove(document, this._fM);
        VueUtil.addTouchEnd(document, this._fS);
      },
      Move: function(e) {
        var clientX = e.clientX;
        var clientY = e.clientY;
        if (e.touches && e.touches[0]) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        }
        if (!VueUtil.isDef(clientX) || !VueUtil.isDef(clientY)) return;
        getSelection ? getSelection().removeAllRanges() : document.selection.empty();
        var i_x = clientX - this._x;
        var i_y = clientY - this._y;
        this._dragobj.style[this._Css.x] = (this._isdrag ? i_x : Math.max(i_x, this.Minwidth)) + 'px';
        this._dragobj.style[this._Css.y] = (this._isdrag ? i_y : Math.max(i_y, this.Minheight)) + 'px';
        if (!this._isdrag) {
          VueUtil.setStyle(this._dragobj, 'height', Math.max(i_y, this.Minheight) - 2 * parseInt(VueUtil.getStyle(this._dragobj, 'paddingLeft')) + 'px');
        }
      },
      Stop: function() {
        VueUtil.removeTouchMove(document, this._fM);
        VueUtil.removeTouchEnd(document, this._fS);
        if (document.all) {
          VueUtil.off(this._dragobj, 'losecapture', this._fS);
          this._dragobj.releaseCapture();
        } else {
          VueUtil.off(document, 'blur', this._fS);
        }
      }
    });
    Vue.directive('draggable', {
      inserted: function(el, binding) {
        var cancelObj = [];
        var cancelSelectors = el.getAttribute('draggable-cancel-selector');
        if (cancelSelectors) {
          VueUtil.loop(cancelSelectors.split(','), function(cancelSelector) {
            if (VueUtil.hasClass(el, cancelSelector.split('.')[1])) {
              cancelObj.push(el);
              return false;
            }
            cancelObj.push(el.querySelector(cancelSelector));
          });
        }
        if (cancelObj.indexOf(el) !== -1) return;
        var resizeObj = null;
        var resizeFlg = el.getAttribute('draggable-resize');
        if (resizeFlg) {
          resizeObj = document.createElement('DIV');
          var resizeStyle = {
            bottom: '1px',
            right: '1px',
            cursor: 'nw-resize',
            position: 'absolute',
            width: '10px',
            height: '10px',
            fontSize: 0
          };
          VueUtil.merge(resizeObj.style, resizeStyle);
          el.appendChild(resizeObj);
        }
        Vue.nextTick(function() {
          var positionStyle = VueUtil.getStyle(el, 'position');
          var offsetLeft = el.offsetLeft;
          var offsetTop = el.offsetTop;
          if (positionStyle !== 'fixed') {
            var displayStyle = VueUtil.getStyle(el, 'display');
            VueUtil.setStyle(el, 'display', 'block');
            offsetLeft = el.offsetLeft;
            offsetTop = el.offsetTop;
            VueUtil.setStyle(el, 'display', displayStyle);
            VueUtil.setStyle(el, 'position', 'relative');
            VueUtil.setStyle(el, 'zIndex', VueUtil.nextZIndex());
          }
          new dragEl(el, cancelObj, resizeObj, offsetLeft, offsetTop);
        });
      }
    });
  };
  Vue.use(directive);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VueRouter', 'Vuex'], definition);
  } else {
    context.VueLoader = definition(context.Vue, context.VueUtil, context.VueRouter, context.Vuex);
  }
})(this, function(Vue, VueUtil, VueRouter, Vuex) {
  'use strict';
  var promiseLoop = function(arr, cb) {
    var realResult = [];
    var result = Promise.resolve();
    arr.reverse();
    arr.forEach(function(a) {
      result = result.then(function() {
        return cb(a).then(function(res) {
          realResult.push(res);
        });
      });
    });
    return result.then(function() {
      return realResult;
    });
  };
  var scriptCache = [];
  var scriptScopedCache = [];
  var identity = function(value) {
    return value;
  };
  var resolveURL = function(baseURL, url) {
    if (url.substr(0, 2) === './' || url.substr(0, 3) === '../') {
      return baseURL + url;
    }
    return url;
  };
  var StyleContext = function(component, elt) {
    this.component = component;
    this.elt = elt;
  };
  StyleContext.prototype = {
    withBase: function(callback) {
      var tmpBaseElt;
      if (this.component.baseURI) {
        tmpBaseElt = document.createElement('base');
        tmpBaseElt.href = this.component.baseURI;
        var headElt = this.component.getHead();
        headElt.insertBefore(tmpBaseElt, headElt.firstChild);
      }
      callback.call(this);
      if (tmpBaseElt)
        this.component.getHead().removeChild(tmpBaseElt);
    },
    scopeStyles: function(styleElt, scopeName) {

      function process() {

        var sheet = styleElt.sheet;
        var rules = sheet.cssRules;

        for ( var i = 0; i < rules.length; ++i ) {
          var rule = rules[i];
          if ( rule.type !== 1 )
            continue;

          var scopedSelectors = [];

          rule.selectorText.split(/\s*,\s*/).forEach(function(sel) {

            scopedSelectors.push(scopeName+' '+sel);
            var segments = sel.match(/([^ :]+)(.+)?/);
            scopedSelectors.push(segments[1] + scopeName + (segments[2]||''));
          });

          var scopedRule = scopedSelectors.join(',') + rule.cssText.substr(rule.selectorText.length);
          sheet.deleteRule(i);
          sheet.insertRule(scopedRule, i);
        }
      }

      try {
        process();
      } catch (ex) {

        if ( ex instanceof DOMException && ex.code === DOMException.INVALID_ACCESS_ERR ) {

          styleElt.sheet.disabled = true;
          styleElt.addEventListener('load', function onStyleLoaded() {

            styleElt.removeEventListener('load', onStyleLoaded);
            setTimeout(function() {
              process();
              styleElt.sheet.disabled = false;
            });
          });
          return;
        }
        throw ex;
      }
    },
    compile: function() {
      var hasTemplate = this.template !== null;
      var scoped = this.elt.hasAttribute('scoped');
      if (scoped) {
        if (!hasTemplate) return;
        this.elt.removeAttribute('scoped');
      }
      this.withBase(function() {
        this.component.getHead().appendChild(this.elt);
      });
      if (scoped) this.scopeStyles(this.elt, '[' + this.component.getScopeId() + ']');
      return Promise.resolve();
    },
    getContent: function() {
      return this.elt.textContent;
    },
    setContent: function(content) {
      this.withBase(function() {
        this.elt.textContent = content;
      });
    }
  };
  var ScriptContext = function(component, elt) {
    this.component = component;
    this.elt = elt;
    this.module = {
      exports: {}
    };
  };
  ScriptContext.prototype = {
    getContent: function() {
      return this.elt.textContent;
    },
    setContent: function(content) {
      this.elt.textContent = content;
    },
    addContent: function(content) {
      this.elt.textContent = content + this.elt.textContent;
    },
    asynReadContent: function(url) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(url).then(function(reqponse) {
          resolve(reqponse.bodyText);
        }, function(reqponse) {
          reject(reqponse.status);
        });
      });
    },
    compile: function() {
      var childModuleRequire = function(childURL) {
        return httpVueLoader.require(resolveURL(this.component.baseURI, childURL));
      }.bind(this);
      var childLoader = function(childURL) {
        return VueLoader(resolveURL(this.component.baseURI, childURL));
      }.bind(this);
      try {
        Vue.config.devtools && this.addContent('debugger');
        Function('exports', 'require', 'Vue', 'VueUtil', 'VueRouter', 'Vuex', 'VueLoader', 'module', this.getContent()).call(this.module.exports, this.module.exports, childModuleRequire, Vue, VueUtil, VueRouter, Vuex, childLoader, this.module);
      } catch (ex) {
        Vue.config.productionTip && console.error('[VueLoader error]: in \'' + this.component.url + '\'\n\n' + ex);
      }
      return Promise.resolve(this.module.exports);
    }
  };
  var TemplateContext = function(component, elt) {
    this.component = component;
    this.elt = elt;
  };
  TemplateContext.prototype = {
    getContent: function() {
      return this.elt.innerHTML;
    },
    setContent: function(content) {
      this.elt.innerHTML = content;
    },
    getRootElt: function() {
      var tplElt = this.elt.content || this.elt;
      var firstElt = tplElt.firstElementChild;
      if (VueUtil.isElement(firstElt)) return firstElt;
      for (tplElt = tplElt.firstChild; tplElt !== null; tplElt = tplElt.nextSibling) {
        if (VueUtil.isElement(tplElt)) return tplElt;
      }
      return null;
    },
    compile: function() {
      return Promise.resolve();
    }
  };
  var Component = function() {
    this.template = null;
    this.script = null;
    this.styles = [];
    this._scopeId = '';
    this.url = null;
  };
  Component.prototype = {
    getHead: function() {
      return document.head || document.getElementsByTagName('head')[0];
    },
    getScopeId: function() {
      if (this._scopeId === '') {
        this._scopeId = 'scope-' + VueUtil.createUuid();
        this.template.getRootElt().setAttribute(this._scopeId, '');
      }
      return this._scopeId;
    },
    load: function(componentURL) {
      this.url = componentURL;
      return httpVueLoader.httpRequest(componentURL).then(function(responseText) {
        scriptScopedCache = [];
        this.baseURI = componentURL.substr(0, componentURL.lastIndexOf('/') + 1);
        var doc = document.implementation.createHTMLDocument('');
        doc.body.innerHTML = (this.baseURI ? '<base href="' + this.baseURI + '">' : '') + responseText;
        for (var it = doc.body.firstChild; it; it = it.nextSibling) {
          switch (it.nodeName) {
          case 'TEMPLATE':
            this.template = new TemplateContext(this,it);
            break;
          case 'SCRIPT':
            var srcStr = it.getAttribute('src');
            var scoped = it.getAttribute('scoped');
            if (srcStr) {
              if (VueUtil.isDef(scoped)) {
                if (scriptScopedCache.indexOf(srcStr) === -1) scriptScopedCache.push(srcStr);
              } else {
                if (scriptCache.indexOf(srcStr) === -1) {
                  var newScript = document.createElement('script');
                  newScript.setAttribute('src', srcStr);
                  this.getHead().appendChild(newScript);
                  scriptCache.push(srcStr);
                }
              }
            } else {
              this.script = new ScriptContext(this, it);
            }
            break;
          case 'STYLE':
            this.styles.push(new StyleContext(this,it));
            break;
          }
        }
        return this;
      }.bind(this));
    },
    _normalizeSection: function(eltCx) {
      var p;
      if (eltCx === null || !eltCx.elt.hasAttribute('src')) {
        p = Promise.resolve(null);
      } else {
        p = httpVueLoader.httpRequest(eltCx.elt.getAttribute('src')).then(function(content) {
          eltCx.elt.removeAttribute('src');
          return content;
        });
      }
      return p.then(function(content) {
        if (eltCx !== null && eltCx.elt.hasAttribute('lang')) {
          var lang = eltCx.elt.getAttribute('lang');
          eltCx.elt.removeAttribute('lang');
          return httpVueLoader.langProcessor[lang.toLowerCase()](content === null ? eltCx.getContent() : content);
        }
        return content;
      }).then(function(content) {
        if (content !== null)
          eltCx.setContent(content);
      });
    },
    normalize: function() {
      return Promise.all(VueUtil.mergeArray(this._normalizeSection(this.template), this._normalizeSection(this.script), VueUtil.map(this.styles, this._normalizeSection))).then(function() {
        return this;
      }.bind(this));
    },
    compile: function() {
      return Promise.all(VueUtil.mergeArray(this.template && this.template.compile(), this.script && this.script.compile(), VueUtil.map(this.styles, function(style) {
        return style.compile();
      }))).then(function() {
        return this;
      }.bind(this));
    }
  };
  var httpVueLoader = {
    load: function(url) {
      return function() {
        return new Component().load(url).then(function(component) {
          if (VueUtil.isDef(component.script)) {
            return promiseLoop(scriptScopedCache, component.script.asynReadContent).then(function(responseText){
              component.script.addContent(responseText);
              return component;
            });
          } else {
            return component;
          }
        }).then(function(component) {
          return component.normalize();
        }).then(function(component) {
          return component.compile();
        }).then(function(component) {
          var exports = component.script !== null ? component.script.module.exports : {};
          if (component.template !== null)
            exports.template = component.template.getContent();
          exports._baseURI = component.baseURI;
          return exports;
        });
      };
    },
    require: function(moduleName) {
      return window[moduleName];
    },
    httpRequest: function(url) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(url).then(function(reqponse) {
          resolve(reqponse.bodyText);
        }, function(reqponse) {
          reject(reqponse.status);
        });
      });
    },
    langProcessor: {
      html: identity,
      js: identity,
      css: identity
    }
  };
  var VueLoader = function(url) {
    return httpVueLoader.load(url);
  };
  return VueLoader;
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueImgLoad = definition(context.Vue);
    delete context.VueImgLoad;
  }
})(this, function(Vue) {
  'use strict';
  var imgload = function() {
    var loadImg = function(el, binding) {
      if (el.tagName === 'IMG') {
        var img = new Image();
        img.src = binding.value;
        img.onload = function() {
          el.src = img.src;
        };
      }
    };
    Vue.directive('imgload', {
      bind: function(el, binding) {
        el._src_ = el.src;
        loadImg(el, binding);
      },
      update: function(el, binding) {
        el.src = el._src_;
        loadImg(el, binding);
      }
    });
  };
  Vue.use(imgload);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueRipple = definition(context.Vue, context.VueUtil);
    delete context.VueRipple;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var directive = function() {
    var doRipple = VueUtil.throttle(function(e) {
      var clientX = e.clientX;
      var clientY = e.clientY;
      var el = this;
      el.style.position = 'relative';
      var ripple = el.querySelector('.vue-ripple__container');
      var animation = el.querySelector('.vue-ripple__animation');
      var size = el.clientWidth > el.clientHeight ? el.clientWidth : el.clientHeight;
      animation.style.height = animation.style.width = size + 'px';
      var offset = el.getBoundingClientRect();
      var x = clientX - offset.left + 'px';
      var y = clientY - offset.top + 'px';
      animation.style.left = x;
      animation.style.top = y;
      animation.style.display = '';
      ripple.style.display = '';
      VueUtil.debounce(500, function() {
        animation.style.display = 'none';
        ripple.style.display = 'none';
        el.style.position = el.__originalPosition__;
      }).call();
    });
    Vue.directive('ripple', {
      bind: function(el, binding) {
        VueUtil.debounce(function() {
          el.__originalPosition__ = el.style.position;
          var ripple = el.__ripple__ = document.createElement('div');
          ripple.className = 'vue-ripple__container';
          ripple.style.display = 'none';
          var animation = document.createElement('div');
          animation.style.display = 'none';
          animation.className = 'vue-ripple__animation';
          ripple.appendChild(animation);
          el.appendChild(ripple);
          VueUtil.on(el, 'mousedown', doRipple);
        }).call();
      },
      unbind: function(el) {
        VueUtil.off(el, 'mousedown', doRipple);
      }
    });
  };
  Vue.use(directive);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueAdaptiveGroup = definition(context.Vue, context.VueUtil);
    delete context.VueAdaptiveGroup;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueAdaptiveGroup = {
    template: '<div class="vue-adaptive-group"><div v-if="adaptiveType" :class="[customClass, liClass]"><slot></slot><slot v-for="index in slotLen" :name="\'li\' + index"></slot></div><div v-else><slot></slot><vue-dropdown trigger="click" :class="[customClass]"><vue-button :icon="iconClass" type="text" style="transform: rotate3d(0,0,1,-90deg);"></vue-button><vue-dropdown-menu slot="dropdown" :class="[liClass]"><vue-dropdown-item v-for="index in slotLen" :key="index"><slot :name="\'li\' + index"></slot></vue-dropdown-item></vue-dropdown-menu></vue-dropdown></div></div>',
    name: 'VueAdaptiveGroup',
    props: {
      size: {
        type: String,
        default: 'md'
      },
      customClass: String,
      liClass: String,
      iconClass: {
        type: String,
        default: 'vue-icon-more'
      }
    },
    data: function() {
      return {
        adaptiveType: true
      };
    },
    methods: {
      resetType: function() {
        var size = this.size;
        var sizeMap = Object.create(null);
        sizeMap.lg = 1200;
        sizeMap.md = 992;
        sizeMap.sm = 768;
        var sizeValue = sizeMap[size];
        if (!VueUtil.isDef(sizeValue)) {
          size = 'md';
          sizeValue = sizeMap[size];
        }
        this.adaptiveType = sizeValue <= innerWidth;
      }
    },
    computed: {
      slotLen: function() {
        var soltLiLen = 0;
        VueUtil.ownPropertyLoop(this.$slots, function(prop) {
          var propAry = prop.split('li');
          if (propAry[0] === '' && VueUtil.isNumber(propAry[1]*1))
            soltLiLen++;
        });
        return soltLiLen;
      }
    },
    mounted: function() {
      VueUtil.addResizeListener(this.resetType);
    },
    beforeDestroy: function() {
      VueUtil.removeResizeListener(this.resetType);
    }
  };
  Vue.component(VueAdaptiveGroup.name, VueAdaptiveGroup);
});

(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueLang = definition(context.Vue, context.VueUtil);
    delete context.VueLang;
    delete context.VuePopper;
    delete context.VuePopup;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueLang = {
    zh: {
      vue: {
        colorpicker: {
          confirm: '确定',
          clear: '清空'
        },
        datepicker: {
          now: '此刻',
          today: '今天',
          thisMonth: '本月',
          cancel: '取消',
          clear: '清空',
          confirm: '确定',
          selectDate: '选择日期',
          selectTime: '选择时间',
          startDate: '开始日期',
          startTime: '开始时间',
          endDate: '结束日期',
          endTime: '结束时间',
          year: '年',
          month1: '1 月',
          month2: '2 月',
          month3: '3 月',
          month4: '4 月',
          month5: '5 月',
          month6: '6 月',
          month7: '7 月',
          month8: '8 月',
          month9: '9 月',
          month10: '10 月',
          month11: '11 月',
          month12: '12 月',
          week: '周',
          weeks: {
            sun: '日',
            mon: '一',
            tue: '二',
            wed: '三',
            thu: '四',
            fri: '五',
            sat: '六'
          },
          months: {
            jan: '一月',
            feb: '二月',
            mar: '三月',
            apr: '四月',
            may: '五月',
            jun: '六月',
            jul: '七月',
            aug: '八月',
            sep: '九月',
            oct: '十月',
            nov: '十一月',
            dec: '十二月'
          }
        },
        select: {
          loading: '加载中',
          noMatch: '无匹配数据',
          noData: '无数据',
          placeholder: '请选择'
        },
        cascader: {
          noMatch: '无匹配数据',
          placeholder: '请选择'
        },
        pagination: {
          goto: '前往',
          pagesize: '条/页',
          total: '共 {total} 条',
          pageClassifier: '页'
        },
        messagebox: {
          title: '提示',
          confirm: '确定',
          cancel: '取消',
          error: '输入的数据不合法!'
        },
        upload: {
          delete: '删除',
          preview: '查看图片',
          continue: '继续上传'
        },
        table: {
          emptyText: '暂无数据',
          confirmFilter: '筛选',
          resetFilter: '重置',
          clearFilter: '全部',
          sumText: '合计',
          countText: '总数',
          averageText: '平均值',
          minText: '最小值',
          maxText: '最大值',
          contextMenu: '快捷菜单',
          pin: '固定列',
          leftPin: '固定至左边',
          rightPin: '固定至右边',
          sort: '排序',
          sortBy: '排序集',
          filter: '过滤',
          column: '字段',
          conditions: '条件',
          filterBy: '过滤集',
          display: '列显示',
          exportData: '数据导出',
          fileName: '文件名',
          exportOrgData: '导出原始数据',
          exportHandleData: '导出数据'
        },
        tree: {
          emptyText: '暂无数据'
        },
        screenfull: {
          canot: '不兼容您的浏览器!'
        }
      }
    },
    ja: {
      vue: {
        colorpicker: {
          confirm: 'はい',
          clear: 'クリア'
        },
        datepicker: {
          now: '現在',
          today: '今日',
          thisMonth: '今月',
          cancel: 'キャンセル',
          clear: 'クリア',
          confirm: 'はい',
          selectDate: '日付を選択',
          selectTime: '時間を選択',
          startDate: '開始日',
          startTime: '開始時間',
          endDate: '終了日',
          endTime: '終了時間',
          year: '年',
          week: '週',
          month1: '一月',
          month2: '二月',
          month3: '三月',
          month4: '四月',
          month5: '五月',
          month6: '六月',
          month7: '七月',
          month8: '八月',
          month9: '九月',
          month10: '十月',
          month11: '十一月',
          month12: '十二月',
          weeks: {
            sun: '日',
            mon: '月',
            tue: '火',
            wed: '水',
            thu: '木',
            fri: '金',
            sat: '土'
          },
          months: {
            jan: '一月',
            feb: '二月',
            mar: '三月',
            apr: '四月',
            may: '五月',
            jun: '六月',
            jul: '七月',
            aug: '八月',
            sep: '九月',
            oct: '十月',
            nov: '十一月',
            dec: '十二月'
          }
        },
        select: {
          loading: 'ロード中',
          noMatch: 'データなし',
          noData: 'データなし',
          placeholder: '選択してください'
        },
        cascader: {
          noMatch: 'データなし',
          placeholder: '選択してください'
        },
        pagination: {
          goto: '',
          pagesize: '件/ページ',
          total: '総計 {total} 件',
          pageClassifier: 'ページ目へ'
        },
        messagebox: {
          title: 'メッセージ',
          confirm: 'はい',
          cancel: 'キャンセル',
          error: '正しくない入力'
        },
        upload: {
          delete: '削除する',
          preview: 'プレビュー',
          continue: '続行する'
        },
        table: {
          emptyText: 'データなし',
          confirmFilter: '確認',
          resetFilter: '初期化',
          clearFilter: 'すべて',
          sumText: '合計',
          countText: '総数',
          averageText: '平均値',
          minText: '最小値',
          maxText: '最大値',
          contextMenu: 'コンテキスト・メニュー',
          pin: '固定列',
          leftPin: '左に固定',
          rightPin: '右に固定',
          sort: 'ソート',
          sortBy: 'ソート集',
          filter: 'フィルター',
          column: 'カラム',
          conditions: '条件',
          filterBy: 'フィルター集',
          display: '列表示',
          exportData: 'データ出力',
          fileName: 'ファイル名',
          exportOrgData: '元データ出力',
          exportHandleData: 'データ出力'
        },
        tree: {
          emptyText: 'データなし'
        },
        screenfull: {
          canot: 'ブラウザは実行できません!'
        }
      }
    },
    en: {
      vue: {
        colorpicker: {
          confirm: 'OK',
          clear: 'Clear'
        },
        datepicker: {
          now: 'Now',
          today: 'Today',
          thisMonth: 'This Month',
          cancel: 'Cancel',
          clear: 'Clear',
          confirm: 'OK',
          selectDate: 'Select date',
          selectTime: 'Select time',
          startDate: 'Start Date',
          startTime: 'Start Time',
          endDate: 'End Date',
          endTime: 'End Time',
          year: '',
          week: 'Wk',
          month1: 'Jan',
          month2: 'Feb',
          month3: 'Mar',
          month4: 'Apr',
          month5: 'May',
          month6: 'Jun',
          month7: 'Jul',
          month8: 'Aug',
          month9: 'Sep',
          month10: 'Oct',
          month11: 'Nov',
          month12: 'Dec',
          weeks: {
            sun: 'Sun',
            mon: 'Mon',
            tue: 'Tue',
            wed: 'Wed',
            thu: 'Thu',
            fri: 'Fri',
            sat: 'Sat'
          },
          months: {
            jan: 'Jan',
            feb: 'Feb',
            mar: 'Mar',
            apr: 'Apr',
            may: 'May',
            jun: 'Jun',
            jul: 'Jul',
            aug: 'Aug',
            sep: 'Sep',
            oct: 'Oct',
            nov: 'Nov',
            dec: 'Dec'
          }
        },
        select: {
          loading: 'Loading',
          noMatch: 'No matching data',
          noData: 'No data',
          placeholder: 'Select'
        },
        cascader: {
          noMatch: 'No matching data',
          placeholder: 'Select'
        },
        pagination: {
          goto: 'Go to',
          pagesize: '/page',
          total: 'Total {total}',
          pageClassifier: ''
        },
        messagebox: {
          title: 'Message',
          confirm: 'OK',
          cancel: 'Cancel',
          error: 'Illegal input'
        },
        upload: {
          delete: 'Delete',
          preview: 'Preview',
          continue: 'Continue'
        },
        table: {
          emptyText: 'No Data',
          confirmFilter: 'Confirm',
          resetFilter: 'Reset',
          clearFilter: 'All',
          sumText: 'Sum',
          countText: 'Count',
          averageText: 'Average',
          minText: 'Mix',
          maxText: 'Max',
          contextMenu: 'Context Menu',
          pin: 'Pin',
          leftPin: 'Left Pin',
          rightPin: 'Right Pin',
          sort: 'Sort',
          sortBy: 'Sort By',
          filter: 'Filter',
          column: 'Column',
          conditions: 'Conditions',
          filterBy: 'Filter By',
          display: 'Display',
          exportData: 'Data Export',
          fileName: 'File Name',
          exportOrgData: 'Original Data Export',
          exportHandleData: 'Data Export'
        },
        tree: {
          emptyText: 'No Data'
        },
        screenfull: {
          canot: 'You browser can\'t work!'
        }
      }
    }
  };
  VueUtil.setLocale('zh', VueLang.zh);
  VueUtil.setLocale('ja', VueLang.ja);
  VueUtil.setLocale('en', VueLang.en);
  VueUtil.setLang('zh');
});
