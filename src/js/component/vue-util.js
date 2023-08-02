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
  var version = '';//replace by package.json
  var _toString = Object.prototype.toString;
  var _map = Array.prototype.map;
  var _filter = Array.prototype.filter;
  var isNull = function(v) {
    return v === null;
  };
  var isUndefined = function(v) {
    return typeof v === 'undefined';
  };
  var isRegExp = function(v) {
    return '[object RegExp]' === Object.prototype.toString.call(v);
  };
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

  function DoFn(D) {
    return D;
  }
  var dateI18n = {};

  function getDateI18n() {
    var lang = Vue.config.lang;
    if (dateI18n.hasOwnProperty(lang)) {
      return dateI18n[lang];
    } else {
      var i18n = {
        dayNamesShort: Vue.t('vue.dateformat.dayNamesShort').split('_'),
        dayNames: Vue.t('vue.dateformat.dayNames').split('_'),
        monthNamesShort: Vue.t('vue.dateformat.monthNamesShort').split('_'),
        monthNames: Vue.t('vue.dateformat.monthNames').split('_'),
        amPm: Vue.t('vue.dateformat.amPm').split('_'),
        DoFn: window.DoFn || DoFn,
      };

      // 当取到星期长度不为7，证明多语言中没取到，返回undefined，按照英文显示
      if (i18n.dayNames.length != 7) {
        i18n = undefined;
      }
      dateI18n[lang] = i18n;
      return i18n;
    }
  }
  
  var formatDate = function(date, format) {
    date = toDate(date);
    if (!isDef(date)) return null;

    if(format == 'timestamp'){
      return date.getTime();
    }
    return DateUtil.format(date, format || 'yyyy-MM-dd', getDateI18n());
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

    if (typeof string === 'number' && format === 'timestamp') {
      return new Date(string);
    }

    if(typeof string != 'string') {
      str = formatDate(string, format);
    } else if(!format && string.indexOf('GMT') > -1) {
      return new Date(string);
    } else if (!format && /\d{4}-\d{2}-\d{2}T/.test(string)) {
      return new Date(string);
    }

    if (!isDef(str)) str = string;
    return DateUtil.parse(str, format || 'yyyy-MM-dd', getDateI18n());
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
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
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
  var destructuring = function (destination, sources) {
    if (destination && sources) {
      var rest = VueUtil.assign.apply(this, [{}].concat(VueUtil.slice(arguments, 1)));
      var restKeys = Object.keys(rest);
      VueUtil.loop(Object.keys(destination), function (key) {
        if (restKeys.indexOf(key) > -1) {
          destination[key] = rest[key];
        }
      });
    }
    return destination;
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

  function arrayIndexOfVal (obj, val) {
    if (obj.indexOf) {
      return obj.indexOf(val);
    }
    for (var index = 0, len = obj.length; index < len; index++) {
      if (val === obj[index]) {
        return index;
      }
    }
  }

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
  
  function findTreeItem (parent, obj, iterate, context, path, node, parseChildren, opts) {
    if (obj) {
      var item, index, len, paths, nodes, match;
      for (index = 0, len = obj.length; index < len; index++) {
        item = obj[index];
        paths = path.concat(['' + index]);
        nodes = node.concat([item]);
        if (iterate.call(context, item, index, obj, paths, parent, nodes)) {
          return { index: index, item: item, path: paths, items: obj, parent: parent, nodes: nodes };
        }
        if (parseChildren && item) {
          match = findTreeItem(item, item[parseChildren], iterate, context, paths.concat([parseChildren]), nodes, parseChildren, opts);
          if (match) {
            return match;
          }
        }
      }
    }
  }

  function eachTreeItem (parent, obj, iterate, context, path, node, parseChildren, opts) {
    var paths, nodes;
    VueUtil.forEach(obj, function (item, index) {
      paths = path.concat(['' + index]);
      nodes = node.concat([item]);
      iterate.call(context, item, index, obj, paths, parent, nodes);
      if (item && parseChildren) {
        paths.push(parseChildren);
        eachTreeItem(item, item[parseChildren], iterate, context, paths, nodes, parseChildren, opts);
      }
    });
  }

  function helperCreateTreeFunc (handle) {
    return function (obj, iterate, options, context) {
      var opts = options || {};
      var optChildren = opts.children || 'children';
      return handle(null, obj, iterate, context, [], [], optChildren, opts);
    };
  }

  function mapTreeItem (parent, obj, iterate, context, path, node, parseChildren, opts) {
    var paths, nodes, rest;
    var mapChildren = opts.mapChildren || parseChildren;
    return VueUtil.map(obj, function (item, index) {
      paths = path.concat(['' + index]);
      nodes = node.concat([item]);
      rest = iterate.call(context, item, index, obj, paths, parent, nodes);
      if (rest && item && parseChildren && item[parseChildren]) {
        rest[mapChildren] = mapTreeItem(item, item[parseChildren], iterate, context, paths, nodes, parseChildren, opts);
      }
      return rest;
    });
  }

  function searchTreeItem (parentAllow, parent, obj, iterate, context, path, node, parseChildren, opts) {
    var paths, nodes, rest, isAllow, hasChild;
    var rests = [];
    var hasOriginal = opts.original;
    var mapChildren = opts.mapChildren || parseChildren;
    VueUtil.forEach(obj, function (item, index) {
      paths = path.concat(['' + index]);
      nodes = node.concat([item]);
      isAllow = parentAllow || iterate.call(context, item, index, obj, paths, parent, nodes);
      hasChild = parseChildren && item[parseChildren];
      if (isAllow || hasChild) {
        rest = hasOriginal ? item : VueUtil.assign({}, item);
      }
      if (isAllow || hasChild) {
        rest[mapChildren] = searchTreeItem(isAllow, item, item[parseChildren], iterate, context, paths, nodes, parseChildren, opts);
        if (isAllow || rest[mapChildren].length) {
          rests.push(rest);
        }
      } else if (isAllow) {
        rests.push(rest);
      }
    });
    return rests;
  }

  function unTreeList (result, array, opts) {
    var children;
    var optChildren = opts.children;
    var optData = opts.data;
    VueUtil.forEach(array, function (item) {
      children = item[optChildren];
      if (optData) {
        item = item[optData];
      }
      result.push(item);
      if (children) {
        unTreeList(result, children, opts);
      }
    });
    return result;
  }

  function toTreeArray (array, options) {
    return unTreeList([], array, VueUtil.assign({},  {
      parentKey: 'parentId',
      key: 'id',
      children: 'children'
    }, options));
  }

  
function strictTree (array, optChildren) {
  VueUtil.each(array, function (item) {
    if (item.children && !item.children.length) {
      VueUtil.remove(item, optChildren);
    }
  });
}

/**
  * 将一个带层级的数据列表转成树结构
  *
  * @param {Array} array 数组
  * @param {Object} options {strict: false, parentKey: 'parentId', key: 'id', children: 'children', data: 'data'}
  * @return {Array}
  */
function toArrayTree (array, options) {
  var opts = VueUtil.assign({}, {
    parentKey: 'parentId',
    key: 'id',
    children: 'children'
  }, options);

  var optStrict = opts.strict;
  var optKey = opts.key;
  var optParentKey = opts.parentKey;
  var optChildren = opts.children;
  var optSortKey = opts.sortKey;
  var optReverse = opts.reverse;
  var optData = opts.data;
  var result = [];
  var treeMap = {};
  var idList, id, treeData, parentId;

  if (optSortKey) {
    array = VueUtil.sortBy(VueUtil.clone(array), optSortKey);
    if (optReverse) {
      array = array.reverse();
    }
  }

  idList = VueUtil.map(array, function (item) {
    return item[optKey];
  });

  VueUtil.each(array, function (item) {
    id = item[optKey];

    if (optData) {
      treeData = {};
      treeData[optData] = item;
    } else {
      treeData = item;
    }

    parentId = item[optParentKey];
    treeMap[id] = treeMap[id] || [];
    treeMap[parentId] = treeMap[parentId] || [];
    treeMap[parentId].push(treeData);
    treeData[optKey] = id;
    treeData[optParentKey] = parentId;
    treeData[optChildren] = treeMap[id];

    if (!optStrict || (optStrict && !parentId)) {
      if (!VueUtil.includes(idList, parentId)) {
        result.push(treeData);
      }
    }
  });

  if (optStrict) {
    strictTree(array, optChildren);
  }

  return result;
}

  var findTree = helperCreateTreeFunc(findTreeItem);
  var eachTree = helperCreateTreeFunc(eachTreeItem);
  var mapTree = helperCreateTreeFunc(mapTreeItem);
  var searchTree = helperCreateTreeFunc(function (parent, obj, iterate, context, path, nodes, parseChildren, opts) {
    return searchTreeItem(0, parent, obj, iterate, context, path, nodes, parseChildren, opts);
  });
  
  function filterTree (obj, iterate, options, context) {
    var result = [];
    if (obj && iterate) {
      eachTree(obj, function (item, index, items, path, parent, nodes) {
        if (iterate.call(context, item, index, items, path, parent, nodes)) {
          result.push(item);
        }
      }, options);
    }
    return result;
  }
  
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
        // 对应win10 ie11 遮罩层无法正常遮罩的问题
        el != document.body && setStyle(el, 'position', 'relative');
        // setStyle(el, 'position', 'relative');
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
    if (Vue.i18n) {
      if (isString(lang)) Vue.i18n.locale = lang;
    } else {
      if (isString(lang)) Vue.config.lang = lang;
    }
  };
  var setLocale = function(lang, langObjs) {
    if(Vue.i18n) {
      Vue.i18n.setLocaleMessage(lang, merge({}, Vue.i18n.getLocaleMessage(lang), langObjs));
    } else {
      Vue.locale && Vue.locale(lang, merge({}, Vue.locale(lang), langObjs));
    }
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
      level: function() {
        var parent = this.$parent;
        var level = 1;
      
        while (parent && parent.$options.name !== 'VueMenu') {
          if (parent.$options.name === 'VueSubmenu') {
            level++;
          }
          parent = parent.$parent;
        }

        return level;
      },
      paddingStyle: function() {
        if (this.rootMenu.mode !== 'vertical') return {};
        var paddingSize = this.parentMenu.indentSizeVal || 20;
        var padding = paddingSize;

        if (this.rootMenu.collapse) {
          return {
            paddingLeft: '20px',
            paddingRight: '20px'
          };
        } else {
          return {
            paddingLeft: this.rootMenu.indentMethod? this.rootMenu.indentMethod(this.level) + 'px' : padding * this.level + 'px'
          };
        }
      },
      indentSizeVal: function() {
        return this.indentSize || this.parentMenu.indentSizeVal;
      }
    }
  };
  var collapseTransition = {
    functional: true,
    render: function(createElement, obj) {
      var vueComponent = obj.parent;
      var children = obj.children;
      if (obj.props && obj.props.disabled === true) {
        return createElement('transition',{}, children);
      }
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
  var clickoutside = function(fn) {
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
            vnode.context.popperElm.contains(mousedown.target)))) {
              var validFn = node[CTX].fn;
              if(typeof validFn =='function'){
                if(!validFn(vnode,mouseup,mousedown)) return ;
              }else{
                return;
              }
              
            }
            
          if (isDef(binding.expression) && isFunction(vnode.context[binding.expression])) {
            vnode.context[binding.expression](mouseup,mousedown);
          } else {
            isFunction(binding.value) && binding.value();
          }
        });
      };

      var isMobile = VueUtil.getSystemInfo().device == 'Mobile';
      var startEvent = isMobile ? 'touchstart' : 'mousedown';
      var endEvent = isMobile ? 'touchend' : 'mouseup';
      on(document, startEvent, function(e) {
        startClick = e;
      });
      on(document, endEvent, function(e) {
        clickOutSideFn(e, startClick);
      });
    }
    return {
      bind: function(el, binding, vnode) {
        el[CTX] = {
          id: createUuid(),
          vnode: vnode,
          fn:fn,
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

  var scrollingMethods = [];
  document.addEventListener('scroll', lodash.debounce(function(e) {

    var className = e.target.className || '';
    if(className.indexOf('contract-trigger') > -1 || className.indexOf('expand-trigger') > -1) return;

    scrollingMethods.forEach(function(obj) {
      if (!obj.force) {
        if (VueUtil.getSystemInfo().device == 'Mobile' && (VueUtil.getSystemInfo().isLoadMobileJs || VueUtil.disableScrollDirective) ) return;
      }


      if (e.target !== obj.el && e.target.contains(obj.el)) {
        if(typeof obj.method == 'function') {
          var method = obj.method;
          method();
        }
      }
        
    });
  },200, {
    'leading': true,
    'trailing': true
  }),true);

  var scrolling = {
    bind: function(el, binding) {
      var bindingObj = {
        el: el,
      };
      el.__scrollingNodes__ = bindingObj;
      bindingObj.method = binding.value;
      bindingObj.force = binding.modifiers.force;
      if(scrollingMethods.indexOf(bindingObj) == -1) {
        scrollingMethods.push(bindingObj);
      }
    },
    unbind: function(el) {
      var bindingObj = el.__scrollingNodes__;
      var index = scrollingMethods.indexOf(bindingObj);
      if(index > -1) {
        scrollingMethods.splice(index, 1);
      }
      el.__scrollingNodes__ = null;
      bindingObj = null;
    }
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
  
  var getKeyMap = function getKeyMap(key, bind, original) {
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
            result.keyName = keyName;
            result.keyCode = keyCode(keyName);
        }
      });
      result.callback = {
        keydown: keydown || (keyup ? noop : bind),
        keyup: keyup || noop
      };

      if(original) {
        original.push(result);
        return original;
      } else {
        return [result];
      }
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
    focusClick: function (e, el) {
      if(isElementTopLayer(el)) {
        hotkeyHandlers.focus(e, el); // 点击动作执行前，先focus到对应的位置
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
  function bindEvent(el, binding, vnode) {
    var key = binding.arg;
    var handler = binding.value || 'click';
    
    if (typeof handler === 'string') {
      handler = hotkeyHandlers[handler];
    }
    if(!handler) return;

    el._keymap = getKeyMap(key, handler, el._keymap);
    if (el._binded) return;

    el._binded = true;
    var allow = binding.modifiers.allow || false;

    el._keyHandler = function (e) {
        var hotkey = VueUtil.find(el._keymap, function(hotkey) {
          return hotkey.keyCode === e.keyCode;
        }) || {};
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

        if(!callback || callback === noop) return;
        
        // 获取最顶层容器，如aside,dialog等等
        var topContainer = Array.prototype.filter.call(document.querySelectorAll('.vue-dialog, .vue-aside, .vue-message-box'), function(container) {
          return isElementTopLayer(container);
        });

        // 如果存在顶层容器，且当前元素不在最顶层的容器里，结束
        if (topContainer.length > 0 && !(topContainer[topContainer.length - 1].contains(el) )) {
          var vm = el.__vue__;
          //VueDropdownItem下拉展开后，下次展开会append到aside外层的div，所以找到对应的父VueDropdown，判断它的el是不是在顶层aside下,如果不是，就跳过
          if(vm && vm.$options && vm.$options.name == 'VueDropdownItem') { 
            var parentVueDropdown = getParentComp(vm, 'VueDropdown');
            if (parentVueDropdown && !(topContainer[topContainer.length - 1].contains(parentVueDropdown.$el) )) {
              return;
            }
          } else {
            return;
          }
        }
        
        var currentElm = el;
        while(!currentElm.__vue__ && currentElm.parentElement) {
          currentElm = currentElm.parentElement;
        }

        if(!currentElm.__vue__ || currentElm.__vue__._inactive) {
          return;
        }

        var parent = getNearestParent(el.__vue__, function(parent){
          return VueUtil.isFunction(parent.beforeHotkeyHandler);
        });

        if (parent && parent.beforeHotkeyHandler(hotkey) === false) {
          return;
        }

        if (callback.prototype) {
          callback.call(vnode.context, e, el);
        } else {
          callback(e, el);
        }
    };
  
    document.addEventListener('keydown', el._keyHandler);
    document.addEventListener('keyup', el._keyHandler);
  }
  
  function unbindEvent(el) {
    document.removeEventListener('keydown', el._keyHandler);
    document.removeEventListener('keyup', el._keyHandler);
    el._binded = undefined;
    el._keyHandler = undefined;
    el._keymap = undefined;
  }

  function getParentComp(vm, names){

    if(!vm) {
      return;
    }

    if (!names) names = [];
    if (typeof names == 'string') {
      names = [names];
    }

    if((!vm.$parent) || (!vm.$parent.$options.name)){
     return null;
    }else if(names.indexOf(vm.$parent.$options.name) > -1){
        return vm.$parent;
    }else {
        return getParentComp(vm.$parent, names);
    }
  }

  Vue.directive('hotkey', {
    bind: function (el, binding, vnode) {
      bindEvent.call(this, el, binding, vnode);
    },
    componentUpdated: function (el, binding) {
      if (binding.value !== binding.oldValue) {
        unbindEvent.call(this, arguments);
        bindEvent.apply(this, el, binding);
      }
    },
    unbind: unbindEvent
  });

  var clipboard = (function() {
    var doc = window.document;
    var $elem = doc.createElement('textarea');
  
    function handleText(content) {
      var styles = $elem.style;
      $elem.id = '$VueCopy';
      styles.width = '48px';
      styles.height = '24px';
      styles.position = 'fixed';
      styles.zIndex = '0';
      styles.left = '-500px';
      styles.top = '-500px';
      $elem.value = content === null || content === undefined ? '' : '' + content;
  
      if (!$elem.parentNode) {
        doc.body.appendChild($elem);
      }
    }
  
    function copyText() {
      $elem.focus();
      $elem.select();
      $elem.setSelectionRange(0, $elem.value.length);
      return doc.execCommand('copy');
    }
    /**
     * 复制内容到剪贴板
     *
     * @param {String} content Text 内容
     */
  
  
    function clipboard(content) {
      var result = false;
  
      try {
        handleText(content);
        result = copyText();
      } catch (e) {}
  
      return result;
    }

    clipboard.copy = clipboard;
    return clipboard;
  })();

  function pluckProperty (name) {
    return function (obj, key) {
      return key === name;
    };
  }

  var remove = function (obj, iterate, context) {
    if (obj) {
      if (!isNull(iterate)) {
        var removeKeys = [];
        var rest = [];
        if (!isFunction(iterate)) {
          iterate = pluckProperty(iterate);
        }
        VueUtil.each(obj, function (item, index, rest) {
          if (iterate.call(context, item, index, rest)) {
            removeKeys.push(index);
          }
        });
        if (isArray(obj)) {
          VueUtil.eachRight(removeKeys, function (item, key) {
            rest.push(obj[item]);
            obj.splice(item, 1);
          });
        } else {
          rest = {};
          VueUtil.each(removeKeys, function (key) {
            rest[key] = obj[key];
            delete obj[key];
          });
        }
        return rest;
      }
      return {};
    }
    return obj;
  };

  var ElementPrototype = window.Element.prototype;
  if (typeof ElementPrototype.matches !== 'function') {
    ElementPrototype.matches = ElementPrototype.msMatchesSelector || ElementPrototype.mozMatchesSelector || ElementPrototype.webkitMatchesSelector;
  }

  var closest = function (element, selector) {
    if (element.closest) {
      return element.closest(selector);
    }
    while (element && element.nodeType === 1) {
      if (element.matches(selector)) {
        return element;
      }
      element = element.parentNode;
    }

    return null;
  };

  // 多列排序方法 github.com/Teun/thenBy.js
  var firstBy = (function () {
    function identity(v) { return v; }

    function ignoreCase(v) { return typeof (v) === 'string' ? v.toLowerCase() : v; }

    function makeCompareFunction(f, opt) {
      opt = typeof (opt) === 'number' ? { direction: opt } : opt || {};
      if (typeof (f) != 'function') {
        var prop = f;
        // make unary function
        f = function (v1) { var value = VueUtil.get(v1, prop); return value ? value : ''; };
      }
      if (f.length === 1) {
        // f is a unary function mapping a single item to its sort score
        var uf = f;
        var preprocess = opt.ignoreCase ? ignoreCase : identity;
        var cmp = opt.cmp || function (v1, v2) { return v1 < v2 ? -1 : v1 > v2 ? 1 : 0; };
        f = function (v1, v2) { return cmp(preprocess(uf(v1)), preprocess(uf(v2))); };
      }
      if (opt.direction === -1) return function (v1, v2) { return -f(v1, v2); };
      return f;
    }
    function tb(func, opt) {
      var x = (typeof (this) == 'function' && !this.firstBy) ? this : false;
      var y = makeCompareFunction(func, opt);
      var f = x ? function (a, b) {
        return x(a, b) || y(a, b);
      }
        : y;
      f.thenBy = tb;
      return f;
    }
    tb.firstBy = tb;
    return tb;
  })();

  function sortByKeys(sortAry, data) {
    if (!sortAry || sortAry.length === 0) {
      return data;
    }
    var sortFunc = firstBy(sortAry[0].prop || sortAry[0].property, sortAry[0].order === 'desc' ? -1 : undefined);
    for (var index = 1; index < sortAry.length; index++) {
      sortFunc = sortFunc.thenBy(sortAry[index].prop || sortAry[index].property, sortAry[index].order === 'desc' ? -1 : undefined);
    }
    data = data.sort(sortFunc);
    return data;
  }

  function getNearestParent(vm, func) {
    if (!vm) return;
    var parent = vm.$parent || vm.$root;
    while (parent) {
      if(func(parent)){
        return parent;
      }
      parent = parent.$parent;
    }
  }

  function compressImage(file, option) {
    return new Promise(function(res, rej) {

      var opts = {
        strict: false,
        checkOrientation: false,
        success: function(result) {
          if (file.uid) {
            result.uid = file.uid;
          }
          res(result);
        },
        err: rej
      };
      new ImgCompressor(file, VueUtil.merge(opts, option));
    });
  }

function containItem(containers, item) {
  for (var i = 0; i < containers.length; i++) {
    var container = containers[i];
    if (container.contains(item)) {
      return true;
    }
  }
  return false;
}
function trapFocus(element, options) {
  var KEYCODE_TAB = 9;

  element.addEventListener('keydown', function(e) {
    var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

    if (!isTabPressed) { 
      return; 
    }

    var focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
    var offsetPanels = Array.prototype.slice.call(element.querySelectorAll('.vue-tab-pane-no-hide'));
    
    options = (options && typeof options === 'object') ? options : {};

    focusableEls = Array.prototype.slice.call(focusableEls).filter(options.filterFunc || function (item) {
      return item.offsetParent !== null && !containItem(offsetPanels, item);
    });

    options.filter && (focusableEls = focusableEls.filter(options.filter));

    var firstFocusableEl = options.first ? element.querySelector(options.first) : focusableEls[0];
    var lastFocusableEl = options.last ? element.querySelector(options.last) : focusableEls[focusableEls.length - 1];

    if ( e.shiftKey ) /* shift + tab */ {
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
          e.preventDefault();
        }
      } else /* tab */ {
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
          e.preventDefault();
        }
      }
  });
}

function numberWithCommas(x) {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function download (url, name, opts) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    saveAs(xhr.response, name, opts);
  };
  xhr.onerror = function () {
    console.error('could not download file');
  };
  xhr.send();
}

function click (node) {
  try {
    node.dispatchEvent(new MouseEvent('click'));
  } catch (e) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
                          20, false, false, false, false, 0, null);
    node.dispatchEvent(evt);
  }
}
function saveAs (blob, name, opts) {

  var URL = window.URL || window.webkitURL;
  // Namespace is used to prevent conflict w/ Chrome Poper Blocker extension (Issue #561)
  var a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  name = name || blob.name || 'download';

  a.download = name;
  a.rel = 'noopener'; // tabnabbing

  // TODO: detect chrome extensions & packaged apps
  // a.target = '_blank'

  if (typeof blob === 'string') {
    // Support regular links
    a.href = blob;
    if (a.origin !== location.origin && opts && opts.corsEnabled === false) {
      click(a, a.target = '_blank');
    } else if (a.origin !== location.origin || !('download' in HTMLAnchorElement.prototype)) {
      download(blob, name, opts);
    } else {
      click(a);
    }
  } else {
    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, name);
      return;
    }
    // Support blobs
    a.href = URL.createObjectURL(blob);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4E4); // 40s
    setTimeout(function () { a.click(); }, 0);
  }
}

function getUrlVars(search) {
    var vars = {};
    search = search || window.location.search;
    var hashes = search.slice(search.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        var hash = hashes[i].split('=');
        var key = hash[0];
        var value = hash[1];
        if (key) {
          vars[key] = value ? decodeURIComponent(value) : value;
        }
    }
    return vars;
}

  var VueUtil = {
    isNull: isNull,
    isUndefined: isUndefined,
    isRegExp: isRegExp,
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
    destructuring: destructuring,
    merge: merge,
    mergeArray: mergeArray,
    arrayIndexOfVal:arrayIndexOfVal,
    arrayFindIndex: arrayFindIndex,
    arrayFind: arrayFind,
    findTree: findTree,
    eachTree: eachTree,
    filterTree: filterTree,
    searchTree: searchTree,
    mapTree: mapTree,
    toTreeArray: toTreeArray,
    toArrayTree: toArrayTree,
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
    getParentComp:getParentComp,
    config: config,
    nextZIndex: popupManager.nextZIndex,
    setZIndex: popupManager.setZindex,
    version: version,
    isIE: SystemInfo.browser.toLowerCase() === 'ie',
    isFirefox: SystemInfo.browser.toLowerCase() === 'firefox',
    isChrome: SystemInfo.browser.toLowerCase() === 'chrome',
    isEdge: SystemInfo.browser.toLowerCase() === 'edge',
    isSafari: SystemInfo.browser.toLowerCase() === 'safari',
    remove: remove,
    closest: closest,
    component: {
      menumixin: menumixin,
      emitter: emitter,
      collapseTransition: collapseTransition,
      clickoutside: clickoutside,
      scrolling: scrolling,
      repeatClick: repeatClick,
      popupManager: popupManager,
      getScrollParent: getScrollParent
    },
    hotkeyHandlers: hotkeyHandlers,
    clipboard: clipboard,
    sortByKeys:sortByKeys,
    firstBy: firstBy,
    getNearestParent: getNearestParent,
    compressImage: compressImage,
    trapFocus:trapFocus,
    numberWithCommas:numberWithCommas,
    saveAs:saveAs,
    getUrlVars:getUrlVars,
  };

  Object.keys(lodash).forEach(function(funcName) {
    if(typeof lodash[funcName] == 'function' && VueUtil[funcName] === undefined) {
      VueUtil[funcName] = lodash[funcName];
    }
  });
  VueUtil._throttle = lodash.throttle;
  VueUtil._debounce = lodash.debounce;
  VueUtil._filter = lodash.filter;

   Vue.prototype.$vu = VueUtil;
  return VueUtil;
});
