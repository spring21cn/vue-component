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
  var version = '1.1.4';
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
  var isNumberStr = function(num) {
    if (typeof num === 'number') {
      return num - num === 0;
    }
    if (typeof num === 'string' && num.trim() !== '') {
      return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
    }
    return false;
  };
  var newArray = function (start, end) {
    var result = [];
  
    for (var i = start; i <= end; i++) {
      result.push(i);
    }
  
    return result;
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
  var isDateObject = function(val) {
    return val instanceof Date;
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
  var range = function a(n) {
    // see https://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
    return Array.apply(null, {
      length: n
    }).map(function (_, n) {
      return n;
    });
  };

  var modifyDate = function (date, y, m, d) {
    return new Date(y, m, d, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  };
  
  var modifyTime = function (date, h, m, s) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s, date.getMilliseconds());
  };
  
  var modifyWithTimeString = function (date, time) {
    if (date == null || !time) {
      return date;
    }
  
    time = parseDate(time, 'HH:mm:ss');
    return modifyTime(date, time.getHours(), time.getMinutes(), time.getSeconds());
  };
  
  var clearTime = function (date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };
  
  var clearMilliseconds = function (date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);
  };
  
  var limitTimeRange = function (date, ranges) {
    var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'HH:mm:ss';
    if (ranges.length === 0) return date;
  
    var normalizeDate = function (date) {
      return DateUtil.parse(DateUtil.format(date, format), format);
    };
  
    var ndate = normalizeDate(date);
    var nranges = ranges.map(function (range) {
      return range.map(normalizeDate);
    });
    if (nranges.some(function (nrange) {
      return ndate >= nrange[0] && ndate <= nrange[1];
    })) return date;
    var minDate = nranges[0][0];
    var maxDate = nranges[0][0];
    nranges.forEach(function (nrange) {
      minDate = new Date(Math.min(nrange[0], minDate));
      maxDate = new Date(Math.max(nrange[1], minDate));
    });
    var ret = ndate < minDate ? minDate : maxDate; // preserve Year/Month/Date
  
    return modifyDate(ret, date.getFullYear(), date.getMonth(), date.getDate());
  };
  var parseDate = function(string, format) {
    // 对应timepicker选中值不会改变问题  string=1730 format=HHmm 结果20190101 08:05
    // var str = formatDate(string, format);
    // if (!isDef(str)) str = string;
    var str;
    if(typeof string != 'string') {
      str = formatDate(string, format);
    }
    if (!isDef(str)) str = string;
    return DateUtil.parse(str, format || 'yyyy-MM-dd');
  };
  var getDayCountOfMonth = function(year, month) {
    isDef(year) && (year = year*1);
    isDef(month) && (month = month*1);
    if (!isNumber(year) || !isNumber(month)) return null;
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
  var getDayCountOfYear = function(year) {
    var isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    return isLeapYear ? 366 : 365;
  };
  var getFirstDayOfMonth = function(date) {
    var temp = toDate(date);
    if (!isDate(temp)) return null;
    temp.setDate(1);
    return temp.getDay();
  };
  var getStartDateOfMonth = function (year, month) {
    var result = new Date(year, month, 1);
    var day = result.getDay();
  
    if (day === 0) {
      return prevDate(result, 7);
    } else {
      return prevDate(result, day);
    }
  };
  
  var prevDate = function (date) {
    var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - amount);
  };
  
  var nextDate = function (date) {
    var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
  };
  
  var timeWithinRange = function (date, selectableRange, format) {
    var limitedDate = limitTimeRange(date, selectableRange, format);
    return limitedDate.getTime() === date.getTime();
  };
  
  var changeYearMonthAndClampDate = function (date, year, month) {
    var monthDate = Math.min(date.getDate(), getDayCountOfMonth(year, month));
    return modifyDate(date, year, month, monthDate);
  };
  
  var prevMonth = function (date) {
    var year = date.getFullYear();
    var month = date.getMonth();
    return month === 0 ? changeYearMonthAndClampDate(date, year - 1, 11) : changeYearMonthAndClampDate(date, year, month - 1);
  };
  
  var nextMonth = function (date) {
    var year = date.getFullYear();
    var month = date.getMonth();
    return month === 11 ? changeYearMonthAndClampDate(date, year + 1, 0) : changeYearMonthAndClampDate(date, year, month + 1);
  };
  
  var prevYear = function (date) {
    var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var year = date.getFullYear();
    var month = date.getMonth();
    return changeYearMonthAndClampDate(date, year - amount, month);
  };
  
  var nextYear = function (date) {
    var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var year = date.getFullYear();
    var month = date.getMonth();
    return changeYearMonthAndClampDate(date, year + amount, month);
  };
  var getWeekNumber = function(date) {
    date = toDate(date);
    if (!isDate(date)) return null;
    date.setHours(0, 0, 0, 0);
    date.setTime((date.getTime() + (6 - date.getDay()) * 86400000));
    var firstDate = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.getTime() - firstDate.getTime()) / 86400000) / 7);
  };

  var getRangeHours = function (ranges) {
    var hours = [];
    var disabledHours = [];
    (ranges || []).forEach(function (range) {
      var value = range.map(function (date) {
        return date.getHours();
      });
      disabledHours = disabledHours.concat(newArray(value[0], value[1]));
    });
  
    if (disabledHours.length) {
      for (var i = 0; i < 24; i++) {
        hours[i] = disabledHours.indexOf(i) === -1;
      }
    } else {
      for (var _i = 0; _i < 24; _i++) {
        hours[_i] = false;
      }
    }
  
    return hours;
  };
  
  var setRangeData = function (arr, start, end, value) {
    for (var i = start; i < end; i++) {
      arr[i] = value;
    }
  };
  
  var getRangeMinutes = function (ranges, hour) {
    var minutes = new Array(60);
  
    if (ranges.length > 0) {
      ranges.forEach(function (range) {
        var start = range[0];
        var end = range[1];
        var startHour = start.getHours();
        var startMinute = start.getMinutes();
        var endHour = end.getHours();
        var endMinute = end.getMinutes();
  
        if (startHour === hour && endHour !== hour) {
          setRangeData(minutes, startMinute, 60, true);
        } else if (startHour === hour && endHour === hour) {
          setRangeData(minutes, startMinute, endMinute + 1, true);
        } else if (startHour !== hour && endHour === hour) {
          setRangeData(minutes, 0, endMinute + 1, true);
        } else if (startHour < hour && endHour > hour) {
          setRangeData(minutes, 0, 60, true);
        }
      });
    } else {
      setRangeData(minutes, 0, 60, true);
    }
  
    return minutes;
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
        result.setTime(src.getTime() + 86400000 * num * (week || 1));
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

  var extractDateFormat = function (format) {
    return format.replace(/\W?m{1,2}|\W?ZZ/g, '').replace(/\W?h{1,2}|\W?s{1,3}|\W?a/gi, '').trim();
  };

  var extractTimeFormat = function (format) {
    return format.replace(/\W?D{1,2}|\W?Do|\W?d{1,4}|\W?M{1,4}|\W?y{2,4}/g, '').trim();
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
  var arrayFindIndex = function (arr, pred) {
    for (var i = 0; i !== arr.length; ++i) {
      if (pred(arr[i])) {
        return i;
      }
    }
  
    return -1;
  };
  
  var arrayFind = function (arr, pred) {
    var idx = arrayFindIndex(arr, pred);
    return idx !== -1 ? arr[idx] : undefined;
  }; // coerce truthy value to array
  
  
  var coerceTruthyValueToArray = function (val) {
    if (Array.isArray(val)) {
      return val;
    } else if (val) {
      return [val];
    } else {
      return [];
    }
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
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + date;
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
          elem[request]((typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element) ? Element.ALLOW_KEYBOARD_INPUT : {});
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

        if (this.rootMenu.collapse) {
          return {
            paddingLeft: '20px',
            paddingRight: '20px'
          };
        } else {
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
            addClass(el, 'collapse-transition');
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
            removeClass(el, 'collapse-transition');
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
              addClass(el, 'collapse-transition');
              el.style.height = 0;
              el.style.paddingTop = 0;
              el.style.paddingBottom = 0;
            }
            if (isFunction(vueComponent.collapseLeave)) {
              vueComponent.collapseLeave();
            }
          },
          'afterLeave': function(el) {
            removeClass(el, 'collapse-transition');
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
      return createElement('transition', data, children);
    }
  };
  var clickoutside = function() {
    var startClick;
    var nodes = document.__clickoutsideNodes__;
    var CTX = '__clickoutsideContext__';
    if (!isArray(nodes)) {
      nodes = document.__clickoutsideNodes__ = [];
      var clickOutSideFn = function(mouseup, mousedown) {
        mouseup = mouseup || {};
        mousedown = mousedown || {};
        loop(nodes, function(node) {
          var vnode = node[CTX].vnode;
          var binding = node[CTX].binding;
          if (!vnode ||
            !vnode.context ||
            !mouseup.target ||
            !mousedown.target ||
            node.contains(mouseup.target) ||
            node.contains(mousedown.target) ||
            node === mouseup.target ||
            (vnode.context.popperElm &&
            (vnode.context.popperElm.contains(mouseup.target) ||
            vnode.context.popperElm.contains(mousedown.target)))) return;
            
          if (isDef(binding.expression) && isFunction(vnode.context[binding.expression])) {
            vnode.context[binding.expression]();
          } else {
            isFunction(binding.value) && binding.value();
          }
        });
      };
      on(document, 'mousedown', function(e) {
        startClick = e;
      });
      on(document, 'mouseup', function(e) {
        clickOutSideFn(e, startClick);
      });
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
  var repeatClick = {
    bind: function bind(el, binding, vnode) {
      var interval = null;
      var startTime;
  
      var handler = function () {
        return vnode.context[binding.expression].apply();
      };
  
      var clear = function () {
        if (Date.now() - startTime < 100) {
          handler();
        }
  
        clearInterval(interval);
        interval = null;
      };
  
      on(el, 'mousedown', function (e) {
        if (e.button !== 0) return;
        startTime = Date.now();
        once(document, 'mouseup', clear);
        clearInterval(interval);
        interval = setInterval(handler, 100);
      });
    }
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

  var keyCode = function keyCode(searchInput) {
    // Keyboard Events
    if (searchInput && typeof searchInput === 'object') {
      var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode;
  
      if (hasKeyCode) {
        searchInput = hasKeyCode;
      }
    }
  
  
    var search = String(searchInput); // check codes
  
    var foundNamedKeyCodes = codes[search.toLowerCase()];
  
    if (foundNamedKeyCodes) {
      return foundNamedKeyCodes;
    } // check aliases
  
  
    var foundNamedKeyAliases = aliases[search.toLowerCase()];
  
    if (foundNamedKeyAliases) {
      return foundNamedKeyAliases;
    } // weird character?
  
  
    if (search.length === 1) {
      return search.charCodeAt(0);
    }
  
    return undefined;
  };
  
  var codes = {
    'backspace': 8,
    'tab': 9,
    'enter': 13,
    'shift': 16,
    'ctrl': 17,
    'alt': 18,
    'pause/break': 19,
    'caps lock': 20,
    'esc': 27,
    'space': 32,
    'page up': 33,
    'page down': 34,
    'end': 35,
    'home': 36,
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    // 'add': 43,
    'insert': 45,
    'delete': 46,
    'command': 91,
    'left command': 91,
    'right command': 93,
    'numpad *': 106,
    // 'numpad +': 107,
    'numpad +': 43,
    'numpad add': 43,
    // as a trick
    'numpad -': 109,
    'numpad .': 110,
    'numpad /': 111,
    'num lock': 144,
    'scroll lock': 145,
    'my computer': 182,
    'my calculator': 183,
    ';': 186,
    '=': 187,
    ',': 188,
    '-': 189,
    '.': 190,
    '/': 191,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221,
    '\'': 222 // Helper aliases
  
  };
  var aliases = {
    'windows': 91,
    '⇧': 16,
    '⌥': 18,
    '⌃': 17,
    '⌘': 91,
    'ctl': 17,
    'control': 17,
    'option': 18,
    'pause': 19,
    'break': 19,
    'caps': 20,
    'return': 13,
    'escape': 27,
    'spc': 32,
    'pgup': 33,
    'pgdn': 34,
    'ins': 45,
    'del': 46,
    'cmd': 91
    /*!
     * Programatically add the following
     */
    // lower case chars
  
  };
  
  for (var i = 97; i < 123; i++) {
    codes[String.fromCharCode(i)] = i - 32;
  } // numbers
  
  
  for (var _i = 48; _i < 58; _i++) {
    codes[_i - 48] = _i;
  } // function keys
  
  
  for (var _i2 = 1; _i2 < 13; _i2++) {
    codes['f' + _i2] = _i2 + 111;
  } // numpad keys
  
  
  for (var _i3 = 0; _i3 < 10; _i3++) {
    codes['numpad ' + _i3] = _i3 + 96;
  }
  
  var noop = function noop() {};
  
  var getKeyMap = function getKeyMap(key, bind) {
      var result = {};
      var keyup = bind.keyup;
      var keydown = bind.keydown;
      key.replace('numpad +', 'numpad add').split('+').forEach(function (keyName) {
        switch (keyName.toLowerCase()) {
          case 'ctrl':
          case 'alt':
          case 'shift':
          case 'meta':
            result[keyName] = true;
            break;
  
          default:
            result.keyCode = keyCode(keyName);
        }
      });
      result.callback = {
        keydown: keydown || (keyup ? noop : bind),
        keyup: keyup || noop
      };
      return result;
  };

  function isElementTopLayer(el) {
    var elPos = el.getBoundingClientRect();
    var x = Math.ceil(elPos.left);
    var y = Math.ceil(elPos.top);

    var offset = 3;//为了防止点击不到，加上3像素
    var topElementXY = document.elementFromPoint(x + offset, y + offset);
    if(topElementXY == el || el.contains(topElementXY)) {
      return true;
    }
    return false;
  }

  var hotkeyHandlers = {
    click: function (e, el) {
      if(isElementTopLayer(el)) {
        setTimeout(function() {
          el.click();
        }, 0);
      }
    },

    focus: function (e, el) {
      if(isElementTopLayer(el)) {
        setTimeout(function() {
          var vueObj = el.__vue__;
          if(vueObj) {
            if(vueObj.focus) {
              vueObj.focus();
              return;
            } else if(vueObj.$refs.input) {
              vueObj.$refs.input.focus && vueObj.$refs.input.focus();
              return;
            }
          }
          el.focus();
        }, 0);
      }
    },
  };
  function bindEvent(el, binding) {
    var key = binding.arg;
    var handler = binding.value || 'click';
    
    if (typeof handler === 'string') {
      handler = hotkeyHandlers[handler];
    }
    if(!handler) return;

    el._keymap = getKeyMap(key, handler);
    var allow = binding.modifiers.allow || false;

    el._keyHandler = function (e) {
        var hotkey = el._keymap;
        var callback = hotkey.keyCode === e.keyCode &&
          !!hotkey.ctrl === e.ctrlKey &&
          !!hotkey.alt === e.altKey &&
          !!hotkey.shift === e.shiftKey &&
          !!hotkey.meta === e.metaKey &&
          hotkey.callback[e.type];

        if(callback && !allow) {
          e.preventDefault();

          //ie11 f1 problem
          if ( 'onhelp' in window && e.keyCode == 112) {
            window.onhelp = function () {
              return false;
            };
          }
        }
        callback && callback(e, el);
    };
  
    document.addEventListener('keydown', el._keyHandler);
    document.addEventListener('keyup', el._keyHandler);
  }
  
  function unbindEvent(el) {
    document.removeEventListener('keydown', el._keyHandler);
    document.removeEventListener('keyup', el._keyHandler);
  }
  
  Vue.directive('hotkey', {
    bind: function (el, binding) {
      bindEvent.call(this, el, binding);
    },
    componentUpdated: function (el, binding) {
      if (binding.value !== binding.oldValue) {
        unbindEvent.call(this, arguments);
        bindEvent.apply(this, el, binding);
      }
    },
    unbind: unbindEvent
  });
  
  var VueUtil = {
    isDef: isDef,
    isString: isString,
    isNumber: isNumber,
    isNumberStr: isNumberStr,
    isBoolean: isBoolean,
    isFile: isFile,
    isObject: isObject,
    isArray: isArray,
    isFunction: isFunction,
    isDate: isDate,
    isDateObject: isDateObject,
    isNodeList: isNodeList,
    isElement: isElement,
    isVNode: isVNode,
    isVueComponent: isVueComponent,
    toString: toString,
    toDate: toDate,
    formatNumber: formatNumber,
    formatDate: formatDate,
    range: range,
    modifyDate: modifyDate,
    modifyTime: modifyTime,
    modifyWithTimeString: modifyWithTimeString,
    clearTime: clearTime,
    clearMilliseconds: clearMilliseconds,
    limitTimeRange: limitTimeRange,
    parseDate: parseDate,
    prevDate: prevDate,
    nextDate: nextDate,
    timeWithinRange: timeWithinRange,
    changeYearMonthAndClampDate:changeYearMonthAndClampDate,
    prevMonth: prevMonth,
    nextMonth: nextMonth,
    prevYear: prevYear,
    nextYear: nextYear,
    getDayCountOfMonth: getDayCountOfMonth,
    getDayCountOfYear: getDayCountOfYear,
    getFirstDayOfMonth: getFirstDayOfMonth,
    getStartDateOfMonth: getStartDateOfMonth,
    getWeekNumber: getWeekNumber,
    getRangeHours: getRangeHours,
    setRangeData: setRangeData,
    getRangeMinutes: getRangeMinutes,
    addDate: addDate,
    extractDateFormat: extractDateFormat,
    extractTimeFormat: extractTimeFormat,
    loop: loop,
    ownPropertyLoop: ownPropertyLoop,
    map: map,
    filter: filter,
    trim: trim,
    deepCopy: deepCopy,
    merge: merge,
    mergeArray: mergeArray,
    arrayFindIndex: arrayFindIndex,
    arrayFind: arrayFind,
    coerceTruthyValueToArray: coerceTruthyValueToArray,
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
      repeatClick: repeatClick,
      popupManager: popupManager,
      getScrollParent: getScrollParent
    },
    hotkeyHandlers: hotkeyHandlers,
  };

  Object.keys(lodash).forEach(function(funcName) {
    if(VueUtil[funcName] === undefined) {
      VueUtil[funcName] = lodash[funcName];
    }
  });
  VueUtil._throttle = lodash.throttle;
  VueUtil._debounce = lodash.debounce;
  VueUtil._filter = lodash.filter;

   Vue.prototype.$vu = VueUtil;
  return VueUtil;
});
