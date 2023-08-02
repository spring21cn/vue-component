(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Vue"));
	else if(typeof define === 'function' && define.amd)
		define(["Vue"], factory);
	else if(typeof exports === 'object')
		exports["vue-mobile"] = factory(require("Vue"));
	else
		root["vue-mobile"] = factory(root["Vue"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__8bbf__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "02c7":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-tabs{background-color:#fff}.vue-tabs__header{border-bottom:.01rem solid #ebedf0;padding:0;position:relative;margin-bottom:2px}.vue-tabs__nav-scroll{overflow-x:scroll}.vue-tabs__nav{display:-webkit-flex;display:flex;float:none;text-align:center}.vue-tabs__item{flex:1 1 auto}.vue-tab-pane{width:100%;height:100%}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "0580":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "0ae8":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "1601":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-image-viewer__canvas{position:absolute;top:12%;left:5%;width:90%;height:76%}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "164e":
/***/ (function(module, exports) {

/* eslint-disable */

/**
 * Emulate touch event
 * Source：https://github.com/hammerjs/touchemulator
 */
var eventTarget;
var supportTouch = ('ontouchstart' in window); // polyfills

if (!document.createTouch) {
  document.createTouch = function (view, target, identifier, pageX, pageY, screenX, screenY) {
    // auto set
    return new Touch(target, identifier, {
      pageX: pageX,
      pageY: pageY,
      screenX: screenX,
      screenY: screenY,
      clientX: pageX - window.pageXOffset,
      clientY: pageY - window.pageYOffset
    }, 0, 0);
  };
}

if (!document.createTouchList) {
  document.createTouchList = function () {
    var touchList = MyTouchList();

    for (var i = 0; i < arguments.length; i++) {
      touchList[i] = arguments[i];
    }

    touchList.length = arguments.length;
    return touchList;
  };
}
/**
 * create an touch point
 * @constructor
 * @param target
 * @param identifier
 * @param pos
 * @param deltaX
 * @param deltaY
 * @returns {Object} touchPoint
 */


var Touch = function Touch(target, identifier, pos, deltaX, deltaY) {
  deltaX = deltaX || 0;
  deltaY = deltaY || 0;
  this.identifier = identifier;
  this.target = target;
  this.clientX = pos.clientX + deltaX;
  this.clientY = pos.clientY + deltaY;
  this.screenX = pos.screenX + deltaX;
  this.screenY = pos.screenY + deltaY;
  this.pageX = pos.pageX + deltaX;
  this.pageY = pos.pageY + deltaY;
};
/**
 * create empty touchlist with the methods
 * @constructor
 * @returns touchList
 */


function MyTouchList() {
  var touchList = [];

  touchList['item'] = function (index) {
    return this[index] || null;
  }; // specified by Mozilla


  touchList['identifiedTouch'] = function (id) {
    return this[id + 1] || null;
  };

  return touchList;
}
/**
 * only trigger touches when the left mousebutton has been pressed
 * @param touchType
 * @returns {Function}
 */


var initiated = false;

function onMouse(touchType) {
  return function (ev) {
    // prevent mouse events
    if (ev.type === 'mousedown') {
      initiated = true;
    }

    if (ev.type === 'mouseup') {
      initiated = false;
    }

    if (ev.type === 'mousemove' && !initiated) {
      return;
    } // The EventTarget on which the touch point started when it was first placed on the surface,
    // even if the touch point has since moved outside the interactive area of that element.
    // also, when the target doesnt exist anymore, we update it


    if (ev.type === 'mousedown' || !eventTarget || eventTarget && !eventTarget.dispatchEvent) {
      eventTarget = ev.target;
    }

    triggerTouch(touchType, ev); // reset

    if (ev.type === 'mouseup') {
      eventTarget = null;
    }
  };
}
/**
 * trigger a touch event
 * @param eventName
 * @param mouseEv
 */


function triggerTouch(eventName, mouseEv) {
  var touchEvent = document.createEvent('Event');
  touchEvent.initEvent(eventName, true, true);
  touchEvent.altKey = mouseEv.altKey;
  touchEvent.ctrlKey = mouseEv.ctrlKey;
  touchEvent.metaKey = mouseEv.metaKey;
  touchEvent.shiftKey = mouseEv.shiftKey;
  touchEvent.touches = getActiveTouches(mouseEv);
  touchEvent.targetTouches = getActiveTouches(mouseEv);
  touchEvent.changedTouches = createTouchList(mouseEv);
  eventTarget.dispatchEvent(touchEvent);
}
/**
 * create a touchList based on the mouse event
 * @param mouseEv
 * @returns {TouchList}
 */


function createTouchList(mouseEv) {
  var touchList = MyTouchList();
  touchList.push(new Touch(eventTarget, 1, mouseEv, 0, 0));
  return touchList;
}
/**
 * receive all active touches
 * @param mouseEv
 * @returns {TouchList}
 */


function getActiveTouches(mouseEv) {
  // empty list
  if (mouseEv.type === 'mouseup') {
    return MyTouchList();
  }

  return createTouchList(mouseEv);
}
/**
 * TouchEmulator initializer
 */


function TouchEmulator() {
  window.addEventListener('mousedown', onMouse('touchstart'), true);
  window.addEventListener('mousemove', onMouse('touchmove'), true);
  window.addEventListener('mouseup', onMouse('touchend'), true);
} // start distance when entering the multitouch mode


TouchEmulator['multiTouchOffset'] = 75;

if (!supportTouch) {
  new TouchEmulator();
}

/***/ }),

/***/ "1929":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "1c57":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "24fb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ "2638":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _extends(){return _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},_extends.apply(this,arguments)}var normalMerge=["attrs","props","domProps"],toArrayMerge=["class","style","directives"],functionalMerge=["on","nativeOn"],mergeJsxProps=function(a){return a.reduce(function(c,a){for(var b in a)if(!c[b])c[b]=a[b];else if(-1!==normalMerge.indexOf(b))c[b]=_extends({},c[b],a[b]);else if(-1!==toArrayMerge.indexOf(b)){var d=c[b]instanceof Array?c[b]:[c[b]],e=a[b]instanceof Array?a[b]:[a[b]];c[b]=d.concat(e)}else if(-1!==functionalMerge.indexOf(b)){for(var f in a[b])if(c[b][f]){var g=c[b][f]instanceof Array?c[b][f]:[c[b][f]],h=a[b][f]instanceof Array?a[b][f]:[a[b][f]];c[b][f]=g.concat(h)}else c[b][f]=a[b][f];}else if("hook"==b)for(var i in a[b])c[b][i]=c[b][i]?mergeFn(c[b][i],a[b][i]):a[b][i];else c[b]=a[b];return c},{})},mergeFn=function(a,b){return function(){a&&a.apply(this,arguments),b&&b.apply(this,arguments)}};module.exports=mergeJsxProps;


/***/ }),

/***/ "2dba":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "4543":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
var ___CSS_LOADER_AT_RULE_IMPORT_0___ = __webpack_require__("8316");
var ___CSS_LOADER_AT_RULE_IMPORT_1___ = __webpack_require__("d4cf");
var ___CSS_LOADER_AT_RULE_IMPORT_2___ = __webpack_require__("c7bf");
var ___CSS_LOADER_AT_RULE_IMPORT_3___ = __webpack_require__("daf0");
var ___CSS_LOADER_AT_RULE_IMPORT_4___ = __webpack_require__("722e");
var ___CSS_LOADER_AT_RULE_IMPORT_5___ = __webpack_require__("ea12");
var ___CSS_LOADER_AT_RULE_IMPORT_6___ = __webpack_require__("02c7");
var ___CSS_LOADER_AT_RULE_IMPORT_7___ = __webpack_require__("cc7f");
var ___CSS_LOADER_AT_RULE_IMPORT_8___ = __webpack_require__("7849");
var ___CSS_LOADER_AT_RULE_IMPORT_9___ = __webpack_require__("7347");
var ___CSS_LOADER_AT_RULE_IMPORT_10___ = __webpack_require__("8aae");
var ___CSS_LOADER_AT_RULE_IMPORT_11___ = __webpack_require__("5c5e");
var ___CSS_LOADER_AT_RULE_IMPORT_12___ = __webpack_require__("66eb");
var ___CSS_LOADER_AT_RULE_IMPORT_13___ = __webpack_require__("1601");
var ___CSS_LOADER_AT_RULE_IMPORT_14___ = __webpack_require__("5580");
var ___CSS_LOADER_AT_RULE_IMPORT_15___ = __webpack_require__("6b74");
exports = ___CSS_LOADER_API_IMPORT___(false);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_0___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_1___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_2___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_3___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_4___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_5___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_6___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_7___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_8___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_9___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_10___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_11___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_12___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_13___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_14___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_15___);
// Module
exports.push([module.i, "", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "4c93":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "5078":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_refresh_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("b8f1");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_refresh_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_refresh_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_refresh_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "5580":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "@media (width:100vw){.vue-date-picker{width:100vw;position:fixed;bottom:0;left:0}.vue-date-picker .vue-picker-panel__content{width:100%;margin:auto}.vue-date-range-picker__content{width:100%}.vue-date-range-picker{position:fixed;bottom:0;width:100vw;left:0}.vue-date-editor .vue-range-input{width:48%}.vue-date-range-picker .vue-picker-panel__body-wrapper{max-height:70vh;overflow:auto;-webkit-overflow-scrolling:touch}.vue-date-range-picker .vue-picker-panel__body{min-width:100%}.resize-triggers{height:0}.vue-date-editor--datetimerange.vue-input,.vue-date-editor--datetimerange.vue-input__inner{max-width:100%}.vue-picker-panel__footer .vue-button--mini{padding:11px 19px;font-size:16px}}.vue-time-range-picker{position:fixed;width:100vw;top:auto!important;bottom:0}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "5909":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "598a":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "5c5e":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-dialog__wrapper{background-color:rgba(0,0,0,.8)}.vue-dialog__body{max-height:90vh;overflow-y:auto}@media screen and (max-width:767px){.vue-dialog--large,.vue-dialog--small,.vue-dialog--tiny{width:80%;left:10%}}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "66eb":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".color_dropdown_mask_view{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2;background:rgba(0,0,0,.8)}.vue-color-dropdown{bottom:0;top:auto!important;left:0!important;width:100%!important;min-height:265px;border-radius:6px}.vue-color-dropdown__main-wrapper{margin-bottom:15px}.vue-color-hue-slider.is-vertical{width:25px;height:250px;padding:2px 0;margin-right:4px}.vue-color-svpanel{position:relative;width:calc(100% - 35px);height:250px}.vue-color-alpha-slider{height:25px}.vue-color-dropdown__btns .vue-input--small{font-size:14px;margin-top:4px}.vue-color-dropdown__btns{margin-bottom:15px}.vue-color-dropdown__btns button{margin-right:10px;font-size:16px}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "6b74":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-collapse-item__header__arrow{float:right;margin-right:12px;margin-top:15px}.vue-collapse-item>.vue-collapse-item__header .vue-collapse-item__header__arrow{transform:rotate(90deg)}.vue-collapse-item.is-active>.vue-collapse-item__header .vue-collapse-item__header__arrow{transform:rotate(-90deg)}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "722e":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-select{width:100%}.vue-select-dropdown{position:absolute!important;width:100%!important;border:0;text-align:center;margin:0;top:0;right:0;bottom:0;left:0;box-shadow:0 0 0 0;background-color:transparent;-webkit-overflow-scrolling:touch;touch-action:pan-y;z-index:unset!important}.vue-select-dropdown_list_main,.vue-select-dropdown_main{width:100%;list-style:none;bottom:0;left:0;background-color:#fff}.vue-select-dropdown_main{max-height:90vh;position:static!important}.vue-select-dropdown .vue-aside-bottom{z-index:9999}.vue-select-dropdown .vue-aside__wrapper{z-index:9998}.vue-select-dropdown_main .vue-aside.vue-aside-bottom{border-radius:4px 4px 0 0}.vue-select-dropdown_list_main{overflow:hidden;max-height:40vh;min-height:40vh;padding:10px 5px}.vue-select-dropdown__list{max-height:calc(40vh - 10px)}.vue-select-dropdown__item{font-size:16px;padding:8px 10px;position:relative;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#48576a;height:40px;line-height:1.5;cursor:pointer;border-bottom:1px solid hsla(0,0%,88.2%,.6)}.vue-select-group__title{text-align:left;padding-left:20px;padding-top:10px;font-size:15px;color:#999;height:30px;line-height:30px;font-weight:700;margin-bottom:6px}.vue-select-group__wrap{list-style:none;margin:0;padding:0;border-bottom:1px solid rgba(25,137,250,.3)}.vue-select-dropdown_main .vue-input{background-color:#fff;padding:10px}.vue-select-dropdown_main input{border:1px solid rgba(25,137,250,.5);padding:6px;border-radius:4px}.vue-select-dropdown .vue-input__icon{height:40px;right:10px;top:10px;padding:3px}.vue-select-dropdown .is-all-select{color:#409eff}.vue-select:hover .vue-select-dropdown .vue-input__inner{border:1px solid rgba(25,137,250,.5)}.vue-select-dropdown .vue-input__inner:focus,.vue-select-dropdown .vue-input__inner:hover{border:1px solid rgba(25,137,250,.8)}.tag_view{overflow:auto;-webkit-overflow-scrolling:touch;width:calc(100% - 20px);min-height:0;max-height:90px;text-align:left;margin:10px}.tag_view .vue-tag{margin:3px}.vue-select__input.filter-vue-input{margin-left:auto;height:50px;margin:5px 0}.vue-select-dropdown.is-multiple .vue-select-dropdown__item.selected:after{right:22px}.vue-select-dropdown .vue-recycle-scroller{max-height:calc(40vh - 10px)}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "7347":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".default_dropdown_menu_view{box-shadow:0 2px 4px 0 rgba(0,0,0,.12),0 0 6px 0 rgba(0,0,0,.04);min-width:120px;overflow:visible;background-color:rgba(0,0,0,.7);color:#fff;border-radius:6px}.dropdown_menu_top{position:absolute;width:0;height:0;line-height:0;border-bottom:10px solid rgba(0,0,0,.7);border-left:10px solid transparent;border-right:6px solid transparent;right:20px;top:-10px}.default_dropdown_menu_view .vue-dropdown-menu__item{width:100%;padding:0}.default_dropdown_menu_view .vue-dropdown-menu__item:not(.is-disabled):hover{background-color:rgba(0,0,0,.72);color:#fff}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "7849":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-upload--picture-card{width:100px;height:100px;line-height:106px}.vue-upload--picture-card i{font-size:20px;color:#8c939d}.vue-upload-list--picture-card .vue-upload-list__item{width:100px;height:100px}.vue-upload-dragger{width:220px;height:160px}.vue-upload-list__item .vue-icon-error{position:absolute;top:0;right:0;font-size:22px;background-color:#fff;color:#969799;border-radius:100%;font-weight:700;text-align:right;border:1px solid #fff}.vue-upload-list--picture-card .vue-upload-list__item .vue-icon-error{top:-12px;right:-10px}.vue-upload-list__item.is-success .vue-upload-list__item-name{margin-left:20px}.vue-upload-list__item-status-label{right:auto;left:5px}.vue-upload-list--picture-card .vue-upload-list__item{overflow:visible;margin:0 15px 15px 0}.vue-upload-list--picture-card .vue-upload-list__item-status-label{right:auto;left:-15px;top:-6px;transform:rotate(-45deg)}.vue-upload-list--picture .vue-upload-list__item{padding:0;height:70px}.vue-upload-list--picture .vue-upload-list__item-thumbnail{width:70px;height:70px;margin-left:auto;border-radius:4px 0}.vue-upload-list--picture .vue-upload-list__item-name{margin-top:18px;padding-left:15px}.vue-upload-list--picture .vue-upload-list__item-name .vue-icon-document{display:none}.vue-upload-list--picture .vue-upload-list__item-status-label{right:auto;left:-17px;transform:rotate(-45deg);z-index:2}.vue-upload-list--picture-card .vue-upload-list__item-status-label i,.vue-upload-list--picture .vue-upload-list__item-status-label i{transform:rotate(45deg) scale3d(.8,.8,.8)}.vue-upload-list__item.vue-list-leave-active{transition:all .5s}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "8316":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-notification{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;min-width:120px;width:fit-content;padding:15px;border-radius:6px;position:fixed;border:0;background-color:rgba(0,0,0,.7);box-shadow:0 2px 4px 0 rgba(0,0,0,.12),0 0 6px 0 rgba(0,0,0,.04);overflow:hidden;transition:top .3s,bottom .3s}.vue-notification__group{padding:0 10px;align-items:center}.vue-notification__title{font-weight:400;font-size:18px;color:#fff;margin:0;min-width:90px;max-width:278px}.vue-notification__content{font-size:16px;line-height:21px;color:#fff;min-width:90px;max-width:278px}.vue-notification__closeBtn{top:12px;right:12px;position:absolute;cursor:pointer;color:#fff;font-size:14px}.vue-notification-center{display:flex;flex-direction:column;flex-wrap:nowrap;align-items:center;justify-content:space-around;text-align:center;min-width:100px;width:fit-content;padding:15px;border-radius:6px;position:fixed;border:0;background-color:rgba(0,0,0,.7);box-shadow:0 2px 4px 0 rgba(0,0,0,.12),0 0 6px 0 rgba(0,0,0,.04);overflow:hidden;transition:top .3s,bottom .3s;margin-top:15px}.content_margin{margin-top:15px}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "85c2":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "8875":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    if (document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ "8aae":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-message-box__wrapper{background-color:rgba(0,0,0,.8)}.vue-message-box{max-width:80%;top:35%;border-radius:6px;-webkit-transform:translate3d(-50%,0,0);left:50%}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__8bbf__;

/***/ }),

/***/ "8d8d":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "923d":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "926d":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "9f5b":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "ac62":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_roller_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("efa5");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_roller_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_roller_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_roller_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "aec8":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "af92":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_more_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("eab8");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_more_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_more_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_more_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "b44f":
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__("2dba");
            var content = __webpack_require__("4543");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var refs = 0;
var update;
var options = {"injectType":"lazySingletonStyleTag"};

options.insert = "head";
options.singleton = true;

var exported = {};

exported.locals = content.locals || {};
exported.use = function() {
  if (!(refs++)) {
    update = api(content, options);
  }

  return exported;
};
exported.unuse = function() {
  if (refs > 0 && !--refs) {
    update();
    update = null;
  }
};



module.exports = exported;

/***/ }),

/***/ "b8f1":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "c593":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "c7bf":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-switch__button{box-shadow:0 3px 1px 0 rgba(0,0,0,.05),0 2px 2px 0 rgba(0,0,0,.1),0 3px 3px 0 rgba(0,0,0,.05)}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "c8ba":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "cc7f":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-list{width:100%;border-radius:0;border:0}.vue-list-item{min-height:42px;padding:10px 15px;border-bottom:1px solid hsla(0,0%,89.4%,.4)}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "cfe9":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return inBrowser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return root; });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8bbf");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
 // Browser environment sniffing

var inBrowser = !vue__WEBPACK_IMPORTED_MODULE_0___default.a.prototype.$isServer || typeof window !== 'undefined';
var root = typeof window !== 'undefined' ? window : global;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("c8ba")))

/***/ }),

/***/ "d4cf":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-input__inner{border:0;border-radius:0;display:inline-block;height:40px;padding:2px 10px;line-height:normal}.vue-input__icon{position:absolute;width:36px;height:100%;right:0;top:0;text-align:center;color:#bfcbd9;line-height:36px;font-size:14px}.vue-input--mini .vue-input__inner{height:25px}.vue-icon--20{font-size:20px}.vue-icon--30{font-size:30px}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "dac7":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "daf0":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-checkbox-group{display:inline-block;line-height:1;font-size:0;padding:10px}.vue-checkbox-group .vue-checkbox{font-size:14px;margin-left:0;margin-right:15px;padding:6px}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "dc76":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "e8a5":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ec9f");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "ea12":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vue-form-item{background-color:#fff;border-bottom:1px solid #ebedf0;width:100%;padding:6px 0}.vue-form-item+.vue-form-item{margin-top:-10px}.vue-form-item__label{line-height:1.5;padding:10px;text-align:left}.vue-form--label-left .vue-form-item__label{padding-left:10px}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "eab8":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "ec9f":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "efa5":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "f7e1":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "f93f":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "fa23":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__("8875")
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./packages/style/base.less
var base = __webpack_require__("1929");

// EXTERNAL MODULE: ./packages/popup/index.less
var popup = __webpack_require__("dac7");

// EXTERNAL MODULE: ./packages/overlay/index.less
var overlay = __webpack_require__("f7e1");

// EXTERNAL MODULE: ./packages/icon/index.less
var icon = __webpack_require__("f93f");

// EXTERNAL MODULE: ./packages/info/index.less
var packages_info = __webpack_require__("926d");

// EXTERNAL MODULE: ./node_modules/@vue/babel-helper-vue-jsx-merge-props/dist/helper.js
var helper = __webpack_require__("2638");
var helper_default = /*#__PURE__*/__webpack_require__.n(helper);

// EXTERNAL MODULE: external "Vue"
var external_Vue_ = __webpack_require__("8bbf");
var external_Vue_default = /*#__PURE__*/__webpack_require__.n(external_Vue_);

// CONCATENATED MODULE: ./packages/utils/create/bem.ts
/**
 * bem helper
 * b() // 'button'
 * b('text') // 'button__text'
 * b({ disabled }) // 'button button--disabled'
 * b('text', { disabled }) // 'button__text button__text--disabled'
 * b(['disabled', 'primary']) // 'button button--disabled button--primary'
 */
function gen(name, mods) {
  if (!mods) {
    return '';
  }

  if (typeof mods === 'string') {
    return " ".concat(name, "--").concat(mods);
  }

  if (Array.isArray(mods)) {
    return mods.reduce(function (ret, item) {
      return ret + gen(name, item);
    }, '');
  }

  return Object.keys(mods).reduce(function (ret, key) {
    return ret + (mods[key] ? gen(name, key) : '');
  }, '');
}

function createBEM(name) {
  return function (el, mods) {
    if (el && typeof el !== 'string') {
      mods = el;
      el = '';
    }

    el = el ? "".concat(name, "__").concat(el) : name;
    return "".concat(el).concat(gen(el, mods));
  };
}
// CONCATENATED MODULE: ./packages/utils/format/string.ts
var camelizeRE = /-(\w)/g;
function camelize(str) {
  return str.replace(camelizeRE, function (_, c) {
    return c.toUpperCase();
  });
}
function padZero(num) {
  var targetLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var str = num + '';

  while (str.length < targetLength) {
    str = '0' + str;
  }

  return str;
}
// CONCATENATED MODULE: ./packages/mixins/slots.ts
/**
 * Use scopedSlots in Vue 2.6+
 * downgrade to slots in lower version
 */

var SlotsMixin = external_Vue_default.a.extend({
  methods: {
    slots: function slots() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
      var props = arguments.length > 1 ? arguments[1] : undefined;
      var $slots = this.$slots,
          $scopedSlots = this.$scopedSlots;
      var scopedSlot = $scopedSlots[name];

      if (scopedSlot) {
        return scopedSlot(props);
      }

      return $slots[name];
    }
  }
});
// CONCATENATED MODULE: ./packages/utils/create/component.ts
/**
 * Create a basic component with common options
 */




function component_install(Vue) {
  var name = this.name;
  Vue.component(name, this);
  Vue.component(camelize("-".concat(name)), this);
} // unify slots & scopedSlots


function unifySlots(context) {
  // use data.scopedSlots in lower Vue version
  var scopedSlots = context.scopedSlots || context.data.scopedSlots || {};
  var slots = context.slots();
  Object.keys(slots).forEach(function (key) {
    if (!scopedSlots[key]) {
      scopedSlots[key] = function () {
        return slots[key];
      };
    }
  });
  return scopedSlots;
} // should be removed after Vue 3

function transformFunctionComponent(pure) {
  return {
    functional: true,
    props: pure.props,
    model: pure.model,
    render: function render(h, context) {
      return pure(h, context.props, unifySlots(context), context);
    }
  };
}

function createComponent(name) {
  return function (sfc) {
    if (isFunction(sfc)) {
      sfc = transformFunctionComponent(sfc);
    }

    if (!sfc.functional) {
      sfc.mixins = sfc.mixins || [];
      sfc.mixins.push(SlotsMixin);
    }

    sfc.name = name;
    sfc.install = component_install;
    return sfc;
  };
}
// CONCATENATED MODULE: ./packages/utils/create/index.ts


function createNamespace(name) {
  name = 'vue-' + name;
  return [createComponent(name), createBEM(name)];
}
// CONCATENATED MODULE: ./packages/utils/validate/number.ts
function isNumeric(val) {
  return /^\d+(\.\d+)?$/.test(val);
}
function number_isNaN(val) {
  if (Number.isNaN) {
    return Number.isNaN(val);
  } // eslint-disable-next-line no-self-compare


  return val !== val;
}
// CONCATENATED MODULE: ./packages/utils/format/unit.ts


function addUnit(value) {
  if (!isDef(value)) {
    return undefined;
  }

  value = String(value);
  return isNumeric(value) ? "".concat(value, "px") : value;
}
// CONCATENATED MODULE: ./packages/utils/index.ts
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }




var isServer = external_Vue_default.a.prototype.$isServer; // eslint-disable-next-line @typescript-eslint/no-empty-function

function noop() {}
function isDef(val) {
  return val !== undefined && val !== null;
}
function isFunction(val) {
  return typeof val === 'function';
}
function isObject(val) {
  return val !== null && _typeof(val) === 'object';
}
function isPromise(val) {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}
function get(object, path) {
  var keys = path.split('.');
  var result = object;
  keys.forEach(function (key) {
    result = isDef(result[key]) ? result[key] : '';
  });
  return result;
}
// CONCATENATED MODULE: ./packages/utils/functional.ts
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var inheritKey = ['ref', 'style', 'class', 'attrs', 'nativeOn', 'directives', 'staticClass', 'staticStyle'];
var mapInheritKey = {
  nativeOn: 'on'
}; // inherit partial context, map nativeOn to on

function inherit(context, inheritListeners) {
  var result = inheritKey.reduce(function (obj, key) {
    if (context.data[key]) {
      obj[mapInheritKey[key] || key] = context.data[key];
    }

    return obj;
  }, {});

  if (inheritListeners) {
    result.on = result.on || {};
    Object.assign(result.on, context.data.on);
  }

  return result;
} // emit event

function emit(context, eventName) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var listeners = context.listeners[eventName];

  if (listeners) {
    if (Array.isArray(listeners)) {
      listeners.forEach(function (listener) {
        listener.apply(void 0, args);
      });
    } else {
      listeners.apply(void 0, args);
    }
  }
} // mount functional component

function mount(Component, data) {
  var instance = new external_Vue_default.a({
    el: document.createElement('div'),
    props: Component.props,
    render: function render(h) {
      return h(Component, _objectSpread({
        props: this.$props
      }, data));
    }
  });
  document.body.appendChild(instance.$el);
  return instance;
}
// CONCATENATED MODULE: ./packages/loading/index.tsx


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Utils



var _createNamespace = createNamespace('loading'),
    _createNamespace2 = _slicedToArray(_createNamespace, 2),
    loading_createComponent = _createNamespace2[0],
    bem = _createNamespace2[1];

function LoadingIcon(h, props) {
  if (props.type === 'spinner') {
    var Spin = [];

    for (var i = 0; i < 12; i++) {
      Spin.push(h("i"));
    }

    return Spin;
  }

  return h("svg", {
    "class": bem('circular'),
    "attrs": {
      "viewBox": "25 25 50 50"
    }
  }, [h("circle", {
    "attrs": {
      "cx": "50",
      "cy": "50",
      "r": "20",
      "fill": "none"
    }
  })]);
}

function LoadingText(h, props, slots) {
  if (slots.default) {
    var style = props.textSize && {
      fontSize: addUnit(props.textSize)
    };
    return h("span", {
      "class": bem('text'),
      "style": style
    }, [slots.default()]);
  }
}

function Loading(h, props, slots, ctx) {
  var color = props.color,
      size = props.size,
      type = props.type;
  var style = {
    color: color
  };

  if (size) {
    var iconSize = addUnit(size);
    style.width = iconSize;
    style.height = iconSize;
  }

  return h("div", helper_default()([{
    "class": bem([type, {
      vertical: props.vertical
    }])
  }, inherit(ctx, true)]), [h("span", {
    "class": bem('spinner', type),
    "style": style
  }, [LoadingIcon(h, props)]), LoadingText(h, props, slots)]);
}

Loading.props = {
  color: String,
  size: [Number, String],
  vertical: Boolean,
  textSize: [Number, String],
  type: {
    type: String,
    default: 'circular'
  }
};
/* harmony default export */ var packages_loading = (loading_createComponent(Loading));
// EXTERNAL MODULE: ./packages/loading/index.less
var packages_loading_0 = __webpack_require__("5909");

// CONCATENATED MODULE: ./packages/utils/dom/event.ts

var supportsPassive = false;

if (!isServer) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', {
      // eslint-disable-next-line getter-return
      get: function get() {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    });
    window.addEventListener('test-passive', null, opts); // eslint-disable-next-line no-empty
  } catch (e) {}
}

function on(target, event, handler) {
  var passive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (!isServer) {
    target.addEventListener(event, handler, supportsPassive ? {
      capture: false,
      passive: passive
    } : false);
  }
}
function off(target, event, handler) {
  if (!isServer) {
    target.removeEventListener(event, handler);
  }
}
function stopPropagation(event) {
  event.stopPropagation();
}
function preventDefault(event, isStopPropagation) {
  /* istanbul ignore else */
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
  }

  if (isStopPropagation) {
    stopPropagation(event);
  }
}
// CONCATENATED MODULE: ./packages/utils/constant.ts
// color
var RED = '#ee0a24';
var BLUE = '#1989fa';
var GREEN = '#07c160';
var WHITE = '#fff'; // border

var BORDER = 'vue-hairline';
var BORDER_TOP = "".concat(BORDER, "--top");
var BORDER_LEFT = "".concat(BORDER, "--left");
var BORDER_BOTTOM = "".concat(BORDER, "--bottom");
var BORDER_SURROUND = "".concat(BORDER, "--surround");
var BORDER_TOP_BOTTOM = "".concat(BORDER, "--top-bottom");
var BORDER_UNSET_TOP_BOTTOM = "".concat(BORDER, "-unset--top-bottom");
// CONCATENATED MODULE: ./packages/picker/shared.ts
var pickerProps = {
  title: String,
  loading: Boolean,
  showToolbar: Boolean,
  cancelButtonText: String,
  confirmButtonText: String,
  allowHtml: {
    type: Boolean,
    default: true
  },
  visibleItemCount: {
    type: [Number, String],
    default: 5
  },
  itemHeight: {
    type: [Number, String],
    default: 44
  },
  swipeDuration: {
    type: [Number, String],
    default: 1000
  }
};
// CONCATENATED MODULE: ./packages/utils/deep-assign.ts

var deep_assign_hasOwnProperty = Object.prototype.hasOwnProperty;

function assignKey(to, from, key) {
  var val = from[key];

  if (!isDef(val)) {
    return;
  }

  if (!deep_assign_hasOwnProperty.call(to, key) || !isObject(val)) {
    to[key] = val;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    to[key] = deepAssign(Object(to[key]), from[key]);
  }
}

function deepAssign(to, from) {
  Object.keys(from).forEach(function (key) {
    assignKey(to, from, key);
  });
  return to;
}
// CONCATENATED MODULE: ./packages/utils/deep-clone.ts
function deep_clone_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { deep_clone_typeof = function _typeof(obj) { return typeof obj; }; } else { deep_clone_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return deep_clone_typeof(obj); }


function deepClone(obj) {
  if (Array.isArray(obj)) {
    return obj.map(function (item) {
      return deepClone(item);
    });
  }

  if (deep_clone_typeof(obj) === 'object') {
    return deepAssign({}, obj);
  }

  return obj;
}
// CONCATENATED MODULE: ./packages/utils/format/number.ts
function range(num, min, max) {
  return Math.min(Math.max(num, min), max);
}
// CONCATENATED MODULE: ./packages/mixins/touch.ts


var MIN_DISTANCE = 10;

function getDirection(x, y) {
  if (x > y && x > MIN_DISTANCE) {
    return 'horizontal';
  }

  if (y > x && y > MIN_DISTANCE) {
    return 'vertical';
  }

  return '';
}

var TouchMixin = external_Vue_default.a.extend({
  data: function data() {
    return {
      direction: ''
    };
  },
  methods: {
    touchStart: function touchStart(event) {
      this.resetTouchStatus();
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    },
    touchMove: function touchMove(event) {
      var touch = event.touches[0];
      this.deltaX = touch.clientX - this.startX;
      this.deltaY = touch.clientY - this.startY;
      this.offsetX = Math.abs(this.deltaX);
      this.offsetY = Math.abs(this.deltaY);
      this.direction = this.direction || getDirection(this.offsetX, this.offsetY);
    },
    resetTouchStatus: function resetTouchStatus() {
      this.direction = '';
      this.deltaX = 0;
      this.deltaY = 0;
      this.offsetX = 0;
      this.offsetY = 0;
    },
    // avoid Vue 2.6 event bubble issues by manually binding events
    // https://github.com/youzan/vant/issues/3015
    bindTouchEvent: function bindTouchEvent(el) {
      var onTouchStart = this.onTouchStart,
          onTouchMove = this.onTouchMove,
          onTouchEnd = this.onTouchEnd;
      on(el, 'touchstart', onTouchStart);
      on(el, 'touchmove', onTouchMove);

      if (onTouchEnd) {
        on(el, 'touchend', onTouchEnd);
        on(el, 'touchcancel', onTouchEnd);
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/picker/PickerColumn.js


function PickerColumn_slicedToArray(arr, i) {
  return PickerColumn_arrayWithHoles(arr) || PickerColumn_iterableToArrayLimit(arr, i) || PickerColumn_unsupportedIterableToArray(arr, i) || PickerColumn_nonIterableRest();
}

function PickerColumn_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function PickerColumn_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return PickerColumn_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return PickerColumn_arrayLikeToArray(o, minLen);
}

function PickerColumn_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function PickerColumn_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function PickerColumn_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}






var DEFAULT_DURATION = 200; // 惯性滑动思路:
// 在手指离开屏幕时，如果和上一次 move 时的间隔小于 `MOMENTUM_LIMIT_TIME` 且 move
// 距离大于 `MOMENTUM_LIMIT_DISTANCE` 时，执行惯性滑动

var MOMENTUM_LIMIT_TIME = 300;
var MOMENTUM_LIMIT_DISTANCE = 15;

var PickerColumn_createNamespace = createNamespace('picker-column'),
    PickerColumn_createNamespace2 = PickerColumn_slicedToArray(PickerColumn_createNamespace, 2),
    PickerColumn_createComponent = PickerColumn_createNamespace2[0],
    PickerColumn_bem = PickerColumn_createNamespace2[1];

function getElementTranslateY(element) {
  var style = window.getComputedStyle(element);
  var transform = style.transform || style.webkitTransform;
  var translateY = transform.slice(7, transform.length - 1).split(', ')[5];
  return Number(translateY);
}

function isOptionDisabled(option) {
  return isObject(option) && option.disabled;
}

/* harmony default export */ var PickerColumn = (PickerColumn_createComponent({
  mixins: [TouchMixin],
  props: {
    valueKey: String,
    allowHtml: Boolean,
    className: String,
    itemHeight: [Number, String],
    defaultIndex: Number,
    swipeDuration: [Number, String],
    visibleItemCount: [Number, String],
    initialOptions: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  data: function data() {
    return {
      offset: 0,
      duration: 0,
      options: deepClone(this.initialOptions),
      currentIndex: this.defaultIndex
    };
  },
  created: function created() {
    if (this.$parent.children) {
      this.$parent.children.push(this);
    }

    this.setIndex(this.currentIndex);
  },
  mounted: function mounted() {
    this.bindTouchEvent(this.$el);
  },
  destroyed: function destroyed() {
    var children = this.$parent.children;

    if (children) {
      children.splice(children.indexOf(this), 1);
    }
  },
  watch: {
    initialOptions: 'setOptions',
    defaultIndex: function defaultIndex(val) {
      this.setIndex(val);
    }
  },
  computed: {
    count: function count() {
      return this.options.length;
    },
    baseOffset: function baseOffset() {
      return this.itemHeight * (this.visibleItemCount - 1) / 2;
    }
  },
  methods: {
    setOptions: function setOptions(options) {
      if (JSON.stringify(options) !== JSON.stringify(this.options)) {
        this.options = deepClone(options);
        this.setIndex(this.defaultIndex);
      }
    },
    onTouchStart: function onTouchStart(event) {
      this.touchStart(event);

      if (this.moving) {
        var translateY = getElementTranslateY(this.$refs.wrapper);
        this.offset = Math.min(0, translateY - this.baseOffset);
        this.startOffset = this.offset;
      } else {
        this.startOffset = this.offset;
      }

      this.duration = 0;
      this.transitionEndTrigger = null;
      this.touchStartTime = Date.now();
      this.momentumOffset = this.startOffset;
    },
    onTouchMove: function onTouchMove(event) {
      this.touchMove(event);

      if (this.direction === 'vertical') {
        this.moving = true;
        preventDefault(event, true);
      }

      this.offset = range(this.startOffset + this.deltaY, -(this.count * this.itemHeight), this.itemHeight);
      var now = Date.now();

      if (now - this.touchStartTime > MOMENTUM_LIMIT_TIME) {
        this.touchStartTime = now;
        this.momentumOffset = this.offset;
      }
    },
    onTouchEnd: function onTouchEnd() {
      var _this = this;

      var distance = this.offset - this.momentumOffset;
      var duration = Date.now() - this.touchStartTime;
      var allowMomentum = duration < MOMENTUM_LIMIT_TIME && Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE;

      if (allowMomentum) {
        this.momentum(distance, duration);
        return;
      }

      var index = this.getIndexByOffset(this.offset);
      this.duration = DEFAULT_DURATION;
      this.setIndex(index, true); // compatible with desktop scenario
      // use setTimeout to skip the click event triggered after touchstart

      setTimeout(function () {
        _this.moving = false;
      }, 0);
    },
    onTransitionEnd: function onTransitionEnd() {
      this.stopMomentum();
    },
    onClickItem: function onClickItem(index) {
      if (this.moving) {
        return;
      }

      this.duration = DEFAULT_DURATION;
      this.setIndex(index, true);
    },
    adjustIndex: function adjustIndex(index) {
      index = range(index, 0, this.count);

      for (var i = index; i < this.count; i++) {
        if (!isOptionDisabled(this.options[i])) return i;
      }

      for (var _i2 = index - 1; _i2 >= 0; _i2--) {
        if (!isOptionDisabled(this.options[_i2])) return _i2;
      }
    },
    getOptionText: function getOptionText(option) {
      if (isObject(option) && this.valueKey in option) {
        return option[this.valueKey];
      }

      return option;
    },
    setIndex: function setIndex(index, emitChange) {
      var _this2 = this;

      index = this.adjustIndex(index) || 0;
      var offset = -index * this.itemHeight;

      var trigger = function trigger() {
        if (index !== _this2.currentIndex) {
          _this2.currentIndex = index;

          if (emitChange) {
            _this2.$emit('change', index);
          }
        }
      }; // trigger the change event after transitionend when moving


      if (this.moving && offset !== this.offset) {
        this.transitionEndTrigger = trigger;
      } else {
        trigger();
      }

      this.offset = offset;
    },
    setValue: function setValue(value) {
      var options = this.options;

      for (var i = 0; i < options.length; i++) {
        if (this.getOptionText(options[i]) === value) {
          return this.setIndex(i);
        }
      }
    },
    getValue: function getValue() {
      if (this.dataType === 'cascade') {
        return this.options[this.currentIndex][this.valueProp];
      }

      return this.options[this.currentIndex];
    },
    getIndexByOffset: function getIndexByOffset(offset) {
      return range(Math.round(-offset / this.itemHeight), 0, this.count - 1);
    },
    momentum: function momentum(distance, duration) {
      var speed = Math.abs(distance / duration);
      distance = this.offset + speed / 0.003 * (distance < 0 ? -1 : 1);
      var index = this.getIndexByOffset(distance);
      this.duration = +this.swipeDuration;
      this.setIndex(index, true);
    },
    stopMomentum: function stopMomentum() {
      this.moving = false;
      this.duration = 0;

      if (this.transitionEndTrigger) {
        this.transitionEndTrigger();
        this.transitionEndTrigger = null;
      }
    },
    genOptions: function genOptions() {
      var _this3 = this;

      var h = this.$createElement;
      var optionStyle = {
        height: "".concat(this.itemHeight, "px")
      };
      return this.options.map(function (option, index) {
        var text = _this3.getOptionText(option);

        var disabled = isOptionDisabled(option);
        var data = {
          style: optionStyle,
          attrs: {
            role: 'button',
            tabindex: disabled ? -1 : 0
          },
          class: ['vue-ellipsis', PickerColumn_bem('item', {
            disabled: disabled,
            selected: index === _this3.currentIndex
          })],
          on: {
            click: function click() {
              _this3.onClickItem(index);
            }
          }
        };

        if (_this3.allowHtml) {
          data.domProps = {
            innerHTML: text
          };
        }

        return h("li", helper_default()([{}, data]), [_this3.allowHtml ? '' : text]);
      });
    }
  },
  render: function render() {
    var h = arguments[0];
    var wrapperStyle = {
      transform: "translate3d(0, ".concat(this.offset + this.baseOffset, "px, 0)"),
      transitionDuration: "".concat(this.duration, "ms"),
      transitionProperty: this.duration ? 'all' : 'none',
      lineHeight: "".concat(this.itemHeight, "px")
    };
    return h("div", {
      "class": [PickerColumn_bem(), this.className]
    }, [h("ul", {
      "ref": "wrapper",
      "style": wrapperStyle,
      "class": PickerColumn_bem('wrapper'),
      "on": {
        "transitionend": this.onTransitionEnd
      }
    }, [this.genOptions()])]);
  }
}));
// CONCATENATED MODULE: ./packages/picker/index.js
function picker_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function picker_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      picker_ownKeys(Object(source), true).forEach(function (key) {
        picker_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      picker_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function picker_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function picker_slicedToArray(arr, i) {
  return picker_arrayWithHoles(arr) || picker_iterableToArrayLimit(arr, i) || picker_unsupportedIterableToArray(arr, i) || picker_nonIterableRest();
}

function picker_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function picker_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return picker_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return picker_arrayLikeToArray(o, minLen);
}

function picker_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function picker_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function picker_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
} // Utils





 // Components




var picker_createNamespace = createNamespace('picker'),
    picker_createNamespace2 = picker_slicedToArray(picker_createNamespace, 2),
    picker_createComponent = picker_createNamespace2[0],
    picker_bem = picker_createNamespace2[1];

/* harmony default export */ var picker = (picker_createComponent({
  props: picker_objectSpread({}, pickerProps, {
    valueProp: {
      // 选项value值对应option里的属性名称
      type: String
    },
    valueDisabled: {
      // 选项禁用对应option里的属性名称
      type: String
    },
    defaultIndex: {
      type: [Number, String],
      default: 0
    },
    columns: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    toolbarPosition: {
      type: String,
      default: 'top'
    },
    valueKey: {
      type: String,
      default: 'text'
    }
  }),
  data: function data() {
    return {
      children: [],
      formattedColumns: []
    };
  },
  computed: {
    dataType: function dataType() {
      var columns = this.columns;
      var firstColumn = columns[0] || {};

      if (firstColumn.children) {
        return 'cascade';
      }

      if (firstColumn.values) {
        return 'object';
      }

      return 'text';
    }
  },
  watch: {
    columns: {
      handler: 'format',
      immediate: true
    }
  },
  methods: {
    format: function format() {
      var columns = this.columns,
          dataType = this.dataType;

      if (dataType === 'text') {
        this.formattedColumns = [{
          values: columns
        }];
      } else if (dataType === 'cascade') {
        this.formatCascade();
      } else {
        this.formattedColumns = columns;
      }
    },
    formatCascade: function formatCascade() {
      var _this = this;

      var formatted = [];
      var cursor = {
        children: this.columns
      };

      while (cursor && cursor.children) {
        var defaultIndex = cursor.defaultIndex || +this.defaultIndex;
        formatted.push({
          values: cursor.children.map(function (item) {
            var rt = {};
            rt[_this.valueKey] = item[_this.valueKey];
            rt[_this.valueProp] = item[_this.valueProp];
            rt[_this.valueDisabled] = item[_this.valueDisabled];
            return rt;
          }),
          className: cursor.className,
          defaultIndex: defaultIndex
        });
        cursor = cursor.children[defaultIndex];
      }

      this.formattedColumns = formatted;
    },
    emit: function emit(event) {
      if (this.dataType === 'text') {
        this.$emit(event, this.getColumnValue(0), this.getColumnIndex(0));
      } else {
        this.$emit(event, this.getValues(), this.getIndexes());
      }
    },
    onCascadeChange: function onCascadeChange(columnIndex) {
      var cursor = {
        children: this.columns
      };
      var indexes = this.getIndexes();

      for (var i = 0; i <= columnIndex; i++) {
        cursor = cursor.children[indexes[i]];
      }

      while (cursor && cursor.children) {
        columnIndex++;
        this.setColumnValues(columnIndex, cursor.children);
        cursor = cursor.children[cursor.defaultIndex || 0];
      }
    },
    onChange: function onChange(columnIndex) {
      if (this.dataType === 'cascade') {
        this.onCascadeChange(columnIndex);
      }

      if (this.dataType === 'text') {
        this.$emit('change', this, this.getColumnValue(0), this.getColumnIndex(0));
      } else {
        this.$emit('change', this, this.getValues(), columnIndex);
      }
    },
    // get column instance by index
    getColumn: function getColumn(index) {
      return this.children[index];
    },
    // @exposed-api
    // get column value by index
    getColumnValue: function getColumnValue(index) {
      var column = this.getColumn(index);
      return column && column.getValue();
    },
    // @exposed-api
    // set column value by index
    setColumnValue: function setColumnValue(index, value) {
      var column = this.getColumn(index);

      if (column) {
        // column.setValue(value);
        if (this.dataType === 'cascade') {
          var options = column.options;

          for (var i = 0; i < options.length; i += 1) {
            if (options[i][this.valueProp] === value) {
              column.setValue(options[i][this.valueKey]);
            }
          }

          this.onCascadeChange(index);
        } else {
          column.setValue(value);
        }
      }
    },
    // @exposed-api
    // get column option index by column index
    getColumnIndex: function getColumnIndex(columnIndex) {
      return (this.getColumn(columnIndex) || {}).currentIndex;
    },
    // @exposed-api
    // set column option index by column index
    setColumnIndex: function setColumnIndex(columnIndex, optionIndex) {
      var column = this.getColumn(columnIndex);

      if (column) {
        column.setIndex(optionIndex);

        if (this.dataType === 'cascade') {
          this.onCascadeChange(columnIndex);
        }
      }
    },
    // @exposed-api
    // get options of column by index
    getColumnValues: function getColumnValues(index) {
      return (this.children[index] || {}).options;
    },
    // @exposed-api
    // set options of column by index
    setColumnValues: function setColumnValues(index, options) {
      var column = this.children[index];

      if (column) {
        if (this.dataType === 'cascade') {
          // map should be removed in next major version

          /* column.setOptions(
            options.map((item) => (isObject(item) ? item[this.valueKey] : item))
          ); */
          column.setOptions(options);
        } else {
          column.setOptions(options);
        }
      }
    },
    // @exposed-api
    // get values of all columns
    getValues: function getValues() {
      var _this2 = this;

      if (this.dataType === 'cascade') {
        return this.children.map(function (child) {
          var v = child.getValue();
          return v[_this2.valueProp];
        });
      }

      return this.children.map(function (child) {
        return child.getValue();
      });
    },
    // @exposed-api
    // set values of all columns
    setValues: function setValues(values) {
      var _this3 = this;

      values.forEach(function (value, index) {
        _this3.setColumnValue(index, value);
      });
    },
    // @exposed-api
    // get indexes of all columns
    getIndexes: function getIndexes() {
      return this.children.map(function (child) {
        return child.currentIndex;
      });
    },
    // @exposed-api
    // set indexes of all columns
    setIndexes: function setIndexes(indexes) {
      var _this4 = this;

      indexes.forEach(function (optionIndex, columnIndex) {
        _this4.setColumnIndex(columnIndex, optionIndex);
      });
    },
    // @exposed-api
    confirm: function confirm() {
      this.children.forEach(function (child) {
        return child.stopMomentum();
      });
      this.emit('confirm');
    },
    cancel: function cancel() {
      this.emit('cancel');
    },
    genTitle: function genTitle() {
      var h = this.$createElement;
      var titleSlot = this.slots('title');

      if (titleSlot) {
        return titleSlot;
      }

      if (this.title) {
        return h("div", {
          "class": ['vue-ellipsis', picker_bem('title')]
        }, [this.title]);
      }
    },
    genToolbar: function genToolbar() {
      var h = this.$createElement;

      if (this.showToolbar) {
        return h("div", {
          "class": [BORDER_TOP_BOTTOM, picker_bem('toolbar')]
        }, [this.slots() || [h("button", {
          "attrs": {
            "type": "button"
          },
          "class": picker_bem('cancel'),
          "on": {
            "click": this.cancel
          }
        }, [this.cancelButtonText || this.$t('vue.picker.cancel')]), this.genTitle(), h("button", {
          "attrs": {
            "type": "button"
          },
          "class": picker_bem('confirm'),
          "on": {
            "click": this.confirm
          }
        }, [this.confirmButtonText || this.$t('vue.picker.confirm')])]]);
      }
    },
    genColumns: function genColumns() {
      var _this5 = this;

      var h = this.$createElement;
      return this.formattedColumns.map(function (item, columnIndex) {
        return h(PickerColumn, {
          "attrs": {
            "valueKey": _this5.valueKey,
            "allowHtml": _this5.allowHtml,
            "className": item.className,
            "itemHeight": _this5.itemHeight,
            "defaultIndex": item.defaultIndex || +_this5.defaultIndex,
            "swipeDuration": _this5.swipeDuration,
            "visibleItemCount": _this5.visibleItemCount,
            "initialOptions": item.values
          },
          "on": {
            "change": function change() {
              _this5.onChange(columnIndex);
            }
          }
        });
      });
    }
  },
  render: function render(h) {
    var itemHeight = +this.itemHeight;
    var wrapHeight = itemHeight * this.visibleItemCount;
    var frameStyle = {
      height: "".concat(itemHeight, "px")
    };
    var columnsStyle = {
      height: "".concat(wrapHeight, "px")
    };
    var maskStyle = {
      backgroundSize: "100% ".concat((wrapHeight - itemHeight) / 2, "px")
    };
    return h("div", {
      "class": picker_bem()
    }, [this.toolbarPosition === 'top' ? this.genToolbar() : h(), this.loading ? h(packages_loading, {
      "class": picker_bem('loading')
    }) : h(), this.slots('columns-top'), h("div", {
      "class": picker_bem('columns'),
      "style": columnsStyle,
      "on": {
        "touchmove": preventDefault
      }
    }, [this.genColumns(), h("div", {
      "class": picker_bem('mask'),
      "style": maskStyle
    }), h("div", {
      "class": [BORDER_UNSET_TOP_BOTTOM, picker_bem('frame')],
      "style": frameStyle
    })]), this.slots('columns-bottom'), this.toolbarPosition === 'bottom' ? this.genToolbar() : h()]);
  }
}));
// EXTERNAL MODULE: ./packages/picker/index.less
var packages_picker = __webpack_require__("4c93");

// CONCATENATED MODULE: ./packages/mixins/popup/context.ts
var context = {
  zIndex: 2000,
  lockCount: 0,
  stack: [],

  get top() {
    return this.stack[this.stack.length - 1];
  }

};
// CONCATENATED MODULE: ./packages/overlay/index.tsx


function overlay_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function overlay_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { overlay_ownKeys(Object(source), true).forEach(function (key) { overlay_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { overlay_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function overlay_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function overlay_slicedToArray(arr, i) { return overlay_arrayWithHoles(arr) || overlay_iterableToArrayLimit(arr, i) || overlay_unsupportedIterableToArray(arr, i) || overlay_nonIterableRest(); }

function overlay_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function overlay_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return overlay_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return overlay_arrayLikeToArray(o, minLen); }

function overlay_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function overlay_iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function overlay_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Utils




var overlay_createNamespace = createNamespace('overlay'),
    overlay_createNamespace2 = overlay_slicedToArray(overlay_createNamespace, 2),
    overlay_createComponent = overlay_createNamespace2[0],
    overlay_bem = overlay_createNamespace2[1];

function preventTouchMove(event) {
  preventDefault(event, true);
}

function Overlay(h, props, slots, ctx) {
  var _slots$default;

  var style = overlay_objectSpread({
    zIndex: props.zIndex
  }, props.customStyle);

  if (isDef(props.duration)) {
    style.animationDuration = "".concat(props.duration, "s");
  }

  return h("transition", {
    "attrs": {
      "name": "vue-fade"
    }
  }, [h("div", helper_default()([{
    "directives": [{
      name: "show",
      value: props.show
    }],
    "style": style,
    "class": [overlay_bem(), props.className],
    "on": {
      "touchmove": props.lockScroll ? preventTouchMove : noop
    }
  }, inherit(ctx, true)]), [(_slots$default = slots.default) === null || _slots$default === void 0 ? void 0 : _slots$default.call(slots)])]);
}

Overlay.props = {
  show: Boolean,
  zIndex: [Number, String],
  duration: [Number, String],
  className: null,
  customStyle: Object,
  lockScroll: {
    type: Boolean,
    default: true
  }
};
/* harmony default export */ var packages_overlay = (overlay_createComponent(Overlay));
// CONCATENATED MODULE: ./packages/mixins/popup/overlay.ts



var defaultConfig = {
  className: '',
  customStyle: {}
};
var overlay_overlay; // close popup when click overlay && closeOnClickOverlay is true

function onClickOverlay() {
  if (context.top) {
    var vm = context.top.vm;
    vm.$emit('click-overlay');

    if (vm.closeOnClickOverlay) {
      if (vm.onClickOverlay) {
        vm.onClickOverlay();
      } else {
        vm.close();
      }
    }
  }
}

function mountOverlay() {
  overlay_overlay = mount(packages_overlay, {
    on: {
      click: onClickOverlay
    }
  });
}

function updateOverlay() {
  if (!overlay_overlay) {
    mountOverlay();
  }

  if (context.top) {
    var _context$top = context.top,
        vm = _context$top.vm,
        config = _context$top.config;
    var el = vm.$el;

    if (el && el.parentNode) {
      el.parentNode.insertBefore(overlay_overlay.$el, el);
    } else {
      document.body.appendChild(overlay_overlay.$el);
    }

    Object.assign(overlay_overlay, defaultConfig, config, {
      show: true
    });
  } else {
    overlay_overlay.show = false;
  }
}
function openOverlay(vm, config) {
  if (!context.stack.some(function (item) {
    return item.vm === vm;
  })) {
    context.stack.push({
      vm: vm,
      config: config
    });
    updateOverlay();
  }
}
function closeOverlay(vm) {
  var stack = context.stack;

  if (stack.length) {
    if (context.top.vm === vm) {
      stack.pop();
      updateOverlay();
    } else {
      context.stack = stack.filter(function (item) {
        return item.vm !== vm;
      });
    }
  }
}
// CONCATENATED MODULE: ./packages/utils/dom/node.ts
function removeNode(el) {
  var parent = el.parentNode;

  if (parent) {
    parent.removeChild(el);
  }
}
// CONCATENATED MODULE: ./packages/utils/dom/scroll.ts
function isWindow(val) {
  return val === window;
} // get nearest scroll element
// http://w3help.org/zh-cn/causes/SD9013
// http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome


var overflowScrollReg = /scroll|auto/i;
function getScroller(el) {
  var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var node = el;

  while (node && node.tagName !== 'HTML' && node.nodeType === 1 && node !== root) {
    var _window$getComputedSt = window.getComputedStyle(node),
        overflowY = _window$getComputedSt.overflowY;

    if (overflowScrollReg.test(overflowY)) {
      if (node.tagName !== 'BODY') {
        return node;
      } // see: https://github.com/youzan/vant/issues/3823


      var _window$getComputedSt2 = window.getComputedStyle(node.parentNode),
          htmlOverflowY = _window$getComputedSt2.overflowY;

      if (overflowScrollReg.test(htmlOverflowY)) {
        return node;
      }
    }

    node = node.parentNode;
  }

  return root;
}
function getScrollTop(el) {
  return 'scrollTop' in el ? el.scrollTop : el.pageYOffset;
}
function setScrollTop(el, value) {
  if ('scrollTop' in el) {
    el.scrollTop = value;
  } else {
    el.scrollTo(el.scrollX, value);
  }
}
function getRootScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}
function setRootScrollTop(value) {
  setScrollTop(window, value);
  setScrollTop(document.body, value);
} // get distance from element top to page top or scroller top

function scroll_getElementTop(el, scroller) {
  if (isWindow(el)) {
    return 0;
  }

  var scrollTop = scroller ? getScrollTop(scroller) : getRootScrollTop();
  return el.getBoundingClientRect().top + scrollTop;
}
function getVisibleHeight(el) {
  if (isWindow(el)) {
    return el.innerHeight;
  }

  return el.getBoundingClientRect().height;
}
function getVisibleTop(el) {
  if (isWindow(el)) {
    return 0;
  }

  return el.getBoundingClientRect().top;
}
// CONCATENATED MODULE: ./packages/mixins/portal.ts


function getElement(selector) {
  if (typeof selector === 'string') {
    return document.querySelector(selector);
  }

  return selector();
}

function PortalMixin(_ref) {
  var ref = _ref.ref,
      afterPortal = _ref.afterPortal;
  return external_Vue_default.a.extend({
    props: {
      getContainer: [String, Function]
    },
    watch: {
      getContainer: 'portal'
    },
    mounted: function mounted() {
      if (this.getContainer) {
        this.portal();
      }
    },
    methods: {
      portal: function portal() {
        var getContainer = this.getContainer;
        var el = ref ? this.$refs[ref] : this.$el;
        var container;

        if (getContainer) {
          container = getElement(getContainer);
        } else if (this.$parent) {
          container = this.$parent.$el;
        }

        if (container && container !== el.parentNode) {
          container.appendChild(el);
        }

        if (afterPortal) {
          afterPortal.call(this);
        }
      }
    }
  });
}
// CONCATENATED MODULE: ./packages/mixins/bind-event.ts
/**
 * Bind event when mounted or activated
 */

function BindEventMixin(handler) {
  function bind() {
    if (!this.binded) {
      handler.call(this, on, true);
      this.binded = true;
    }
  }

  function unbind() {
    if (this.binded) {
      handler.call(this, off, false);
      this.binded = false;
    }
  }

  return {
    mounted: bind,
    activated: bind,
    deactivated: unbind,
    beforeDestroy: unbind
  };
}
// CONCATENATED MODULE: ./packages/mixins/close-on-popstate.js


var CloseOnPopstateMixin = {
  mixins: [BindEventMixin(function (bind, isBind) {
    this.handlePopstate(isBind && this.closeOnPopstate);
  })],
  props: {
    closeOnPopstate: Boolean
  },
  data: function data() {
    return {
      bindStatus: false
    };
  },
  watch: {
    closeOnPopstate: function closeOnPopstate(val) {
      this.handlePopstate(val);
    }
  },
  methods: {
    handlePopstate: function handlePopstate(bind) {
      var _this = this;
      /* istanbul ignore if */


      if (this.$isServer) {
        return;
      }

      if (this.bindStatus !== bind) {
        this.bindStatus = bind;
        var action = bind ? on : off;
        action(window, 'popstate', function () {
          _this.close();

          _this.shouldReopen = false;
        });
      }
    }
  }
};
// CONCATENATED MODULE: ./packages/mixins/popup/index.js
// Context

 // Utils



 // Mixins




var popupMixinProps = {
  // whether to show popup
  value: Boolean,
  // whether to show overlay
  overlay: Boolean,
  // overlay custom style
  overlayStyle: Object,
  // overlay custom class name
  overlayClass: String,
  // whether to close popup when click overlay
  closeOnClickOverlay: Boolean,
  // z-index
  zIndex: [Number, String],
  // prevent body scroll
  lockScroll: {
    type: Boolean,
    default: true
  },
  // whether to lazy render
  lazyRender: {
    type: Boolean,
    default: true
  }
};
function PopupMixin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    mixins: [TouchMixin, CloseOnPopstateMixin, PortalMixin({
      afterPortal: function afterPortal() {
        if (this.overlay) {
          updateOverlay();
        }
      }
    })],
    props: popupMixinProps,
    data: function data() {
      return {
        inited: this.value
      };
    },
    computed: {
      shouldRender: function shouldRender() {
        return this.inited || !this.lazyRender;
      }
    },
    watch: {
      value: function value(val) {
        var type = val ? 'open' : 'close';
        this.inited = this.inited || this.value;
        this[type]();

        if (!options.skipToggleEvent) {
          this.$emit(type);
        }
      },
      overlay: 'renderOverlay'
    },
    mounted: function mounted() {
      if (this.value) {
        this.open();
      }
    },

    /* istanbul ignore next */
    activated: function activated() {
      if (this.shouldReopen) {
        this.$emit('input', true);
        this.shouldReopen = false;
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.close();

      if (this.getContainer) {
        removeNode(this.$el);
      }
    },

    /* istanbul ignore next */
    deactivated: function deactivated() {
      if (this.value) {
        this.close();
        this.shouldReopen = true;
      }
    },
    methods: {
      open: function open() {
        /* istanbul ignore next */
        if (this.$isServer || this.opened) {
          return;
        } // cover default zIndex


        if (this.zIndex !== undefined) {
          context.zIndex = this.zIndex;
        }

        this.opened = true;
        this.renderOverlay();

        if (this.lockScroll) {
          on(document, 'touchstart', this.touchStart);
          on(document, 'touchmove', this.onTouchMove);

          if (!context.lockCount) {
            document.body.classList.add('vue-overflow-hidden');
          }

          context.lockCount++;
        }
      },
      close: function close() {
        if (!this.opened) {
          return;
        }

        if (this.lockScroll) {
          context.lockCount--;
          off(document, 'touchstart', this.touchStart);
          off(document, 'touchmove', this.onTouchMove);

          if (!context.lockCount) {
            document.body.classList.remove('vue-overflow-hidden');
          }
        }

        this.opened = false;
        closeOverlay(this);
        this.$emit('input', false);
      },
      onTouchMove: function onTouchMove(event) {
        this.touchMove(event);
        var direction = this.deltaY > 0 ? '10' : '01';
        var el = getScroller(event.target, this.$el);
        var scrollHeight = el.scrollHeight,
            offsetHeight = el.offsetHeight,
            scrollTop = el.scrollTop;
        var status = '11';
        /* istanbul ignore next */

        if (scrollTop === 0) {
          status = offsetHeight >= scrollHeight ? '00' : '01';
        } else if (scrollTop + offsetHeight >= scrollHeight) {
          status = '10';
        }
        /* istanbul ignore next */


        if (status !== '11' && this.direction === 'vertical' && !(parseInt(status, 2) & parseInt(direction, 2))) {
          preventDefault(event, true);
        }
      },
      renderOverlay: function renderOverlay() {
        var _this = this;

        if (this.$isServer || !this.value) {
          return;
        }

        this.$nextTick(function () {
          _this.updateZIndex(_this.overlay ? 1 : 0);

          if (_this.overlay) {
            openOverlay(_this, {
              zIndex: context.zIndex++,
              duration: _this.duration,
              className: _this.overlayClass,
              customStyle: _this.overlayStyle
            });
          } else {
            closeOverlay(_this);
          }
        });
      },
      updateZIndex: function updateZIndex() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        this.$el.style.zIndex = ++context.zIndex + value;
      }
    }
  };
}
// CONCATENATED MODULE: ./packages/info/index.tsx


function info_slicedToArray(arr, i) { return info_arrayWithHoles(arr) || info_iterableToArrayLimit(arr, i) || info_unsupportedIterableToArray(arr, i) || info_nonIterableRest(); }

function info_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function info_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return info_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return info_arrayLikeToArray(o, minLen); }

function info_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function info_iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function info_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Utils



var info_createNamespace = createNamespace('info'),
    info_createNamespace2 = info_slicedToArray(info_createNamespace, 2),
    info_createComponent = info_createNamespace2[0],
    info_bem = info_createNamespace2[1];

function Info(h, props, slots, ctx) {
  var dot = props.dot,
      info = props.info;
  var showInfo = isDef(info) && info !== '';

  if (!dot && !showInfo) {
    return;
  }

  return h("div", helper_default()([{
    "class": info_bem({
      dot: dot
    })
  }, inherit(ctx, true)]), [dot ? '' : props.info]);
}

Info.props = {
  dot: Boolean,
  info: [Number, String]
};
/* harmony default export */ var packages_info_0 = (info_createComponent(Info));
// CONCATENATED MODULE: ./packages/icon/index.tsx


function icon_slicedToArray(arr, i) { return icon_arrayWithHoles(arr) || icon_iterableToArrayLimit(arr, i) || icon_unsupportedIterableToArray(arr, i) || icon_nonIterableRest(); }

function icon_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function icon_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return icon_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return icon_arrayLikeToArray(o, minLen); }

function icon_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function icon_iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function icon_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Utils

 // Components



var icon_createNamespace = createNamespace('icon'),
    icon_createNamespace2 = icon_slicedToArray(icon_createNamespace, 2),
    icon_createComponent = icon_createNamespace2[0],
    icon_bem = icon_createNamespace2[1];

function isImage(name) {
  return name ? name.indexOf('/') !== -1 : false;
} // compatible with legacy usage, should be removed in next major version


var LEGACY_MAP = {
  medel: 'medal',
  'medel-o': 'medal-o'
};

function correctName(name) {
  return name && LEGACY_MAP[name] || name;
}

function Icon(h, props, slots, ctx) {
  var name = correctName(props.name);
  var imageIcon = isImage(name);
  return h(props.tag, helper_default()([{
    "class": ['vue-icon', imageIcon ? '' : "".concat(name)],
    "style": {
      color: props.color,
      fontSize: addUnit(props.size)
    }
  }, inherit(ctx, true)]), [slots.default && slots.default(), imageIcon && h("img", {
    "class": icon_bem('image'),
    "attrs": {
      "src": name
    }
  }), h(packages_info_0, {
    "attrs": {
      "dot": props.dot,
      "info": isDef(props.badge) ? props.badge : props.info
    }
  })]);
}

Icon.props = {
  dot: Boolean,
  name: String,
  size: [Number, String],
  // @deprecated
  // should be removed in next major version
  info: [Number, String],
  badge: [Number, String],
  color: String,
  tag: {
    type: String,
    default: 'i'
  }
};
/* harmony default export */ var packages_icon = (icon_createComponent(Icon));
// CONCATENATED MODULE: ./packages/popup/index.js
function popup_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function popup_slicedToArray(arr, i) {
  return popup_arrayWithHoles(arr) || popup_iterableToArrayLimit(arr, i) || popup_unsupportedIterableToArray(arr, i) || popup_nonIterableRest();
}

function popup_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function popup_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return popup_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return popup_arrayLikeToArray(o, minLen);
}

function popup_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function popup_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function popup_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}





var popup_createNamespace = createNamespace('popup'),
    popup_createNamespace2 = popup_slicedToArray(popup_createNamespace, 2),
    popup_createComponent = popup_createNamespace2[0],
    popup_bem = popup_createNamespace2[1];

/* harmony default export */ var packages_popup = (popup_createComponent({
  mixins: [PopupMixin()],
  props: {
    round: Boolean,
    duration: [Number, String],
    closeable: Boolean,
    transition: String,
    safeAreaInsetBottom: Boolean,
    closeIcon: {
      type: String,
      default: 'cross'
    },
    closeIconPosition: {
      type: String,
      default: 'top-right'
    },
    position: {
      type: String,
      default: 'center'
    },
    overlay: {
      type: Boolean,
      default: true
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    }
  },
  beforeCreate: function beforeCreate() {
    var _this = this;

    var createEmitter = function createEmitter(eventName) {
      return function (event) {
        return _this.$emit(eventName, event);
      };
    };

    this.onClick = createEmitter('click');
    this.onOpened = createEmitter('opened');
    this.onClosed = createEmitter('closed');
  },
  render: function render() {
    var _bem;

    var h = arguments[0];

    if (!this.shouldRender) {
      return;
    }

    var round = this.round,
        position = this.position,
        duration = this.duration;
    var isCenter = position === 'center';
    var transitionName = this.transition || (isCenter ? 'vue-fade' : "vue-popup-slide-".concat(position));
    var style = {};

    if (isDef(duration)) {
      var key = isCenter ? 'animationDuration' : 'transitionDuration';
      style[key] = "".concat(duration, "s");
    }

    return h("transition", {
      "attrs": {
        "name": transitionName
      },
      "on": {
        "afterEnter": this.onOpened,
        "afterLeave": this.onClosed
      }
    }, [h("div", {
      "directives": [{
        name: "show",
        value: this.value
      }],
      "style": style,
      "class": popup_bem((_bem = {
        round: round
      }, popup_defineProperty(_bem, position, position), popup_defineProperty(_bem, 'safe-area-inset-bottom', this.safeAreaInsetBottom), _bem)),
      "on": {
        "click": this.onClick
      }
    }, [this.slots(), this.closeable && h(packages_icon, {
      "attrs": {
        "role": "button",
        "tabindex": "0",
        "name": this.closeIcon
      },
      "class": popup_bem('close-icon', this.closeIconPosition),
      "on": {
        "click": this.close
      }
    })])]);
  }
}));
// CONCATENATED MODULE: ./packages/action-sheet/index.tsx


function action_sheet_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function action_sheet_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { action_sheet_ownKeys(Object(source), true).forEach(function (key) { action_sheet_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { action_sheet_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function action_sheet_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function action_sheet_slicedToArray(arr, i) { return action_sheet_arrayWithHoles(arr) || action_sheet_iterableToArrayLimit(arr, i) || action_sheet_unsupportedIterableToArray(arr, i) || action_sheet_nonIterableRest(); }

function action_sheet_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function action_sheet_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return action_sheet_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return action_sheet_arrayLikeToArray(o, minLen); }

function action_sheet_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function action_sheet_iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function action_sheet_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Utils


 // Mixins

 // Components





var action_sheet_createNamespace = createNamespace('action-sheet'),
    action_sheet_createNamespace2 = action_sheet_slicedToArray(action_sheet_createNamespace, 2),
    action_sheet_createComponent = action_sheet_createNamespace2[0],
    action_sheet_bem = action_sheet_createNamespace2[1];

function ActionSheet(h, props, slots, ctx) {
  var title = props.title,
      cancelText = props.cancelText;

  function onCancel() {
    emit(ctx, 'input', false);
    emit(ctx, 'cancel');
  }

  function Header() {
    if (title) {
      return h("div", {
        "class": action_sheet_bem('header')
      }, [title, h(packages_icon, {
        "attrs": {
          "name": props.closeIcon
        },
        "class": action_sheet_bem('close'),
        "on": {
          "click": onCancel
        }
      })]);
    }
  }

  function Content() {
    if (slots.default) {
      return h("div", {
        "class": action_sheet_bem('content')
      }, [slots.default()]);
    }
  }

  function Option(item, index) {
    var disabled = item.disabled,
        loading = item.loading,
        callback = item.callback;

    function onClickOption(event) {
      event.stopPropagation();

      if (disabled || loading) {
        return;
      }

      if (callback) {
        callback(item);
      }

      emit(ctx, 'select', item, index);

      if (props.closeOnClickAction) {
        emit(ctx, 'input', false);
      }
    }

    function OptionContent() {
      if (loading) {
        return h(packages_loading, {
          "attrs": {
            "size": "20px"
          }
        });
      }

      return [h("span", {
        "class": action_sheet_bem('name')
      }, [item.name]), item.subname && h("span", {
        "class": action_sheet_bem('subname')
      }, [item.subname])];
    }

    return h("button", {
      "attrs": {
        "type": "button"
      },
      "class": [action_sheet_bem('item', {
        disabled: disabled,
        loading: loading
      }), item.className, BORDER_TOP],
      "style": {
        color: item.color
      },
      "on": {
        "click": onClickOption
      }
    }, [OptionContent()]);
  }

  function CancelText() {
    if (cancelText) {
      return h("button", {
        "attrs": {
          "type": "button"
        },
        "class": action_sheet_bem('cancel'),
        "on": {
          "click": onCancel
        }
      }, [cancelText]);
    }
  }

  var Description = props.description && h("div", {
    "class": action_sheet_bem('description')
  }, [props.description]);
  return h(packages_popup, helper_default()([{
    "class": action_sheet_bem(),
    "attrs": {
      "position": "bottom",
      "round": props.round,
      "value": props.value,
      "overlay": props.overlay,
      "duration": props.duration,
      "lazyRender": props.lazyRender,
      "lockScroll": props.lockScroll,
      "getContainer": props.getContainer,
      "closeOnPopstate": props.closeOnPopstate,
      "closeOnClickOverlay": props.closeOnClickOverlay,
      "safeAreaInsetBottom": props.safeAreaInsetBottom
    }
  }, inherit(ctx, true)]), [Header(), Description, props.actions && props.actions.map(Option), Content(), CancelText()]);
}

ActionSheet.props = action_sheet_objectSpread({}, popupMixinProps, {
  actions: Array,
  title: String,
  cancelText: String,
  description: String,
  closeIcon: {
    type: String,
    default: 'cross'
  },
  duration: [Number, String],
  round: {
    type: Boolean,
    default: true
  },
  overlay: {
    type: Boolean,
    default: true
  },
  closeOnPopstate: Boolean,
  closeOnClickAction: Boolean,
  closeOnClickOverlay: {
    type: Boolean,
    default: true
  },
  safeAreaInsetBottom: {
    type: Boolean,
    default: true
  },
  getContainer: [String, Function]
});
/* harmony default export */ var action_sheet = (action_sheet_createComponent(ActionSheet));
// EXTERNAL MODULE: ./packages/action-sheet/index.less
var packages_action_sheet = __webpack_require__("c593");

// CONCATENATED MODULE: ./packages/nav-bar/index.js
function nav_bar_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function nav_bar_slicedToArray(arr, i) {
  return nav_bar_arrayWithHoles(arr) || nav_bar_iterableToArrayLimit(arr, i) || nav_bar_unsupportedIterableToArray(arr, i) || nav_bar_nonIterableRest();
}

function nav_bar_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function nav_bar_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return nav_bar_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return nav_bar_arrayLikeToArray(o, minLen);
}

function nav_bar_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function nav_bar_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function nav_bar_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
} // Utils



 // Components



var nav_bar_createNamespace = createNamespace('nav-bar'),
    nav_bar_createNamespace2 = nav_bar_slicedToArray(nav_bar_createNamespace, 2),
    nav_bar_createComponent = nav_bar_createNamespace2[0],
    nav_bar_bem = nav_bar_createNamespace2[1];

/* harmony default export */ var nav_bar = (nav_bar_createComponent({
  props: {
    title: String,
    leftText: String,
    rightText: String,
    leftArrow: Boolean,
    border: {
      type: Boolean,
      default: true
    },
    fixed: Boolean,
    placeholder: Boolean,
    zIndex: [Number, String]
  },
  data: function data() {
    return {
      height: null
    };
  },
  mounted: function mounted() {
    if (this.placeholder && this.fixed) {
      this.height = this.$refs.navBar.getBoundingClientRect().height;
    }
  },
  methods: {
    genLeft: function genLeft() {
      var h = this.$createElement;
      var leftSlot = this.slots('left');

      if (leftSlot) {
        return leftSlot;
      }

      return [this.leftArrow && h(packages_icon, {
        "class": nav_bar_bem('arrow'),
        "attrs": {
          "name": "vue-icon-arrow-left"
        }
      }), this.leftText && h("span", {
        "class": nav_bar_bem('text')
      }, [this.leftText])];
    },
    genRight: function genRight() {
      var h = this.$createElement;
      var rightSlot = this.slots('right');

      if (rightSlot) {
        return rightSlot;
      }

      if (this.rightText) {
        return h("span", {
          "class": nav_bar_bem('text')
        }, [this.rightText]);
      }
    },
    genNavBar: function genNavBar() {
      var h = this.$createElement;
      return h("div", {
        "ref": "navBar",
        "style": {
          zIndex: this.zIndex
        },
        "class": [nav_bar_bem({
          fixed: this.fixed
        }), nav_bar_defineProperty({}, BORDER_BOTTOM, this.border)]
      }, [h("div", {
        "class": nav_bar_bem('left'),
        "on": {
          "click": this.onClickLeft
        }
      }, [this.genLeft()]), h("div", {
        "class": [nav_bar_bem('title'), 'vue-ellipsis']
      }, [this.slots('title') || this.title]), h("div", {
        "class": nav_bar_bem('right'),
        "on": {
          "click": this.onClickRight
        }
      }, [this.genRight()])]);
    },
    onClickLeft: function onClickLeft(event) {
      this.$emit('click-left', event);
    },
    onClickRight: function onClickRight(event) {
      this.$emit('click-right', event);
    }
  },
  render: function render() {
    var h = arguments[0];

    if (this.placeholder && this.fixed) {
      return h("div", {
        "class": nav_bar_bem('placeholder'),
        "style": {
          height: "".concat(this.height, "px")
        }
      }, [this.genNavBar()]);
    }

    return this.genNavBar();
  }
}));
// EXTERNAL MODULE: ./packages/nav-bar/index.less
var packages_nav_bar = __webpack_require__("598a");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"a9e78e98-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/cascader/cascader.vue?vue&type=template&id=0bf4be9e&
var cascadervue_type_template_id_0bf4be9e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('vue-input',{attrs:{"value":_vm.fieldValue,"readonly":true,"disabled":_vm.disabled,"clickable":true,"clearable":_vm.clearable,"size":_vm.size,"autofocus":_vm.autofocus,"placeholder":_vm.placeholder,"text-align":_vm.textAlign,"icon":_vm.showClose ? '' + _vm.clearIcon : '',"on-icon-click":_vm.disabled ? null : _vm.handleClickIcon},nativeOn:{"click":function($event){return _vm.onClick($event)}}}),_c('popup',{attrs:{"position":"bottom"},model:{value:(_vm.showPicker),callback:function ($$v) {_vm.showPicker=$$v},expression:"showPicker"}},[_c('picker',{ref:"picker",class:_vm.popperClass,attrs:{"columns":_vm.columns,"title":_vm.title,"loading":_vm.loading,"confirm-button-text":_vm.confirmButtonText,"cancel-button-text":_vm.cancelButtonText,"value-key":_vm.valueKey,"value-prop":_vm.valueProp,"value-disabled":_vm.valueDisabled,"show-toolbar":true,"toolbar-position":_vm.toolbarPosition,"allow-html":_vm.allowHtml,"item-height":_vm.itemHeight,"visible-item-count":_vm.visibleItemCount,"swipe-duration":_vm.swipeDuration},on:{"confirm":_vm.onConfirm,"cancel":_vm.onCancel,"change":_vm.onChange},scopedSlots:_vm._u([{key:"default",fn:function(){return [_vm._t("default")]},proxy:true},{key:"title",fn:function(){return [_vm._t("title")]},proxy:true},{key:"columns-top",fn:function(){return [_vm._t("columns-top")]},proxy:true},{key:"columns-bottom",fn:function(){return [_vm._t("columns-bottom")]},proxy:true}],null,true)})],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./packages/cascader/cascader.vue?vue&type=template&id=0bf4be9e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/cascader/cascader.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var cascadervue_type_script_lang_js_ = ({
  name: 'VueCascader',
  components: {
    Picker: picker,
    Popup: packages_popup
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: Array
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    },
    textAlign: {
      type: String
    },
    size: {
      type: String
    },
    popperClass: {
      type: String
    },
    props: {
      type: Object,
      default: function _default() {
        return {
          label: 'label',
          value: 'value',
          disabled: 'disabled'
        };
      }
    },
    title: {
      type: String
    },
    confirmButtonText: {
      type: String,
      default: ''
    },
    cancelButtonText: {
      type: String,
      default: ''
    },
    toolbarPosition: {
      type: String,
      default: 'top'
    },
    allowHtml: {
      type: Boolean,
      default: true
    },
    itemHeight: {
      type: [String, Number]
    },
    visibleItemCount: {
      // 可见的选项个数
      type: Number,
      default: 5
    },
    swipeDuration: {
      // 快速滑动时惯性滚动的时长，单位ms
      type: [String, Number],
      default: 1000
    },
    clearIcon: {
      //组件最右侧内容清空图标的设置
      type: String,
      default: 'vue-icon-close'
    }
  },
  mounted: function mounted() {
    this.showPicker = false; //默认值的初始化配对

    this.setValues(this.value);
  },
  data: function data() {
    return {
      showPicker: false,
      fieldValue: ''
    };
  },
  methods: {
    manualMatchValue: function manualMatchValue(values) {
      var labels = [];
      var matchOptions = this.options;

      for (var i = 0; i < values.length; i++) {
        var tmpValue = values[i];

        for (var j = 0; j < matchOptions.length; j++) {
          var tmpValue2 = matchOptions[j].value;

          if (tmpValue == tmpValue2) {
            labels.push(matchOptions[j].label);

            if (matchOptions[j].children) {
              matchOptions = matchOptions[j].children;
              continue;
            } else {
              break;
            }
          }
        }
      }

      if (labels.length > 0) {
        this.fieldValue = this.formatLabel(labels);
      }
    },
    setValues: function setValues(values) {
      var _this = this;

      setTimeout(function () {
        if (values && values.length > 0 && _this.getPicker()) {
          _this.getPicker().setValues(values);

          _this.fieldValue = _this.formatLabel(_this.getTexts());
        } else if (values && values.length > 0) {
          _this.manualMatchValue(values);
        }
      }, 50);
    },
    getPicker: function getPicker() {
      return this.$refs.picker;
    },
    onClick: function onClick() {
      if (!this.disabled) {
        this.showPicker = true;
        this.setValues(this.value);
      }
    },
    onConfirm: function onConfirm(value, index) {
      this.showPicker = false;
      this.$emit('input', this.getPicker().getValues());
      this.$emit('confirm', value, index);
    },
    onCancel: function onCancel(value, index) {
      this.showPicker = false;
      this.$emit('cancel', value, index);
    },
    onChange: function onChange(picker, values, index) {
      this.$emit('change', picker, values, index);
    },
    getTexts: function getTexts() {
      var _this2 = this;

      if (this.getPicker().dataType === 'cascade') {
        return this.getPicker().children.map(function (child) {
          var v = child.getValue();
          return v[_this2.valueKey];
        });
      }

      return this.children.map(function (child) {
        return child.getValue();
      });
    },
    handleClickIcon: function handleClickIcon(event) {
      if (this.disabled) {
        return;
      }

      this.fieldValue = '';
      event.stopPropagation();
      this.$emit('input', null);
    },
    formatLabel: function formatLabel(labelArr) {
      return labelArr.join(' > ');
    }
  },
  watch: {
    value: function value(val) {
      this.setValues(val);
    }
  },
  computed: {
    columns: function columns() {
      return this.options;
    },
    valueProp: function valueProp() {
      return this.props.value || 'value';
    },
    valueKey: function valueKey() {
      return this.props.label || 'label';
    },
    valueDisabled: function valueDisabled() {
      return this.props.disabled || 'disabled';
    },
    showClose: function showClose() {
      if (VueUtil.isArray(this.value)) {
        return this.value && this.value.length > 0;
      }

      return this.value ? true : false;
    }
  }
});
// CONCATENATED MODULE: ./packages/cascader/cascader.vue?vue&type=script&lang=js&
 /* harmony default export */ var cascader_cascadervue_type_script_lang_js_ = (cascadervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./packages/cascader/cascader.vue





/* normalize component */

var component = normalizeComponent(
  cascader_cascadervue_type_script_lang_js_,
  cascadervue_type_template_id_0bf4be9e_render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var cascader = (component.exports);
// CONCATENATED MODULE: ./packages/utils/vnodes.ts
function flattenVNodes(vnodes) {
  var result = [];

  function traverse(vnodes) {
    vnodes.forEach(function (vnode) {
      result.push(vnode);

      if (vnode.children) {
        traverse(vnode.children);
      }
    });
  }

  traverse(vnodes);
  return result;
} // sort children instances by vnodes order


function sortChildren(children, parent) {
  var componentOptions = parent.$vnode.componentOptions;

  if (!componentOptions || !componentOptions.children) {
    return;
  }

  var vnodes = flattenVNodes(componentOptions.children);
  children.sort(function (a, b) {
    return vnodes.indexOf(a.$vnode) - vnodes.indexOf(b.$vnode);
  });
}
// CONCATENATED MODULE: ./packages/mixins/relation.ts
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || relation_unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function relation_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return relation_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return relation_arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return relation_arrayLikeToArray(arr); }

function relation_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function relation_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



function ChildrenMixin(_parent) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var indexKey = options.indexKey || 'index';
  return external_Vue_default.a.extend({
    inject: relation_defineProperty({}, _parent, {
      default: null
    }),
    computed: relation_defineProperty({
      parent: function parent() {
        if (this.disableBindRelation) {
          return null;
        }

        return this[_parent];
      }
    }, indexKey, function () {
      this.bindRelation();
      return this.parent.children.indexOf(this);
    }),
    mounted: function mounted() {
      this.bindRelation();
    },
    beforeDestroy: function beforeDestroy() {
      var _this = this;

      if (this.parent) {
        this.parent.children = this.parent.children.filter(function (item) {
          return item !== _this;
        });
      }
    },
    methods: {
      bindRelation: function bindRelation() {
        if (!this.parent || this.parent.children.indexOf(this) !== -1) {
          return;
        }

        var children = [].concat(_toConsumableArray(this.parent.children), [this]);
        sortChildren(children, this.parent);
        this.parent.children = children;
      }
    }
  });
}
function ParentMixin(parent) {
  return {
    provide: function provide() {
      return relation_defineProperty({}, parent, this);
    },
    data: function data() {
      return {
        children: []
      };
    }
  };
}
// CONCATENATED MODULE: ./packages/tabbar/index.js
function tabbar_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function tabbar_slicedToArray(arr, i) {
  return tabbar_arrayWithHoles(arr) || tabbar_iterableToArrayLimit(arr, i) || tabbar_unsupportedIterableToArray(arr, i) || tabbar_nonIterableRest();
}

function tabbar_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function tabbar_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return tabbar_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return tabbar_arrayLikeToArray(o, minLen);
}

function tabbar_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function tabbar_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function tabbar_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}





var tabbar_createNamespace = createNamespace('tabbar'),
    tabbar_createNamespace2 = tabbar_slicedToArray(tabbar_createNamespace, 2),
    tabbar_createComponent = tabbar_createNamespace2[0],
    tabbar_bem = tabbar_createNamespace2[1];

/* harmony default export */ var tabbar = (tabbar_createComponent({
  mixins: [ParentMixin('vueTabbar')],
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    fixed: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    },
    zIndex: [Number, String],
    activeColor: String,
    inactiveColor: String,
    placeholder: Boolean,
    safeAreaInsetBottom: {
      type: Boolean,
      default: null
    },
    route: Boolean
  },
  data: function data() {
    return {
      height: null
    };
  },
  computed: {
    fit: function fit() {
      if (this.safeAreaInsetBottom !== null) {
        return this.safeAreaInsetBottom;
      } // enable safe-area-inset-bottom by default when fixed


      return this.fixed;
    }
  },
  watch: {
    value: 'setActiveItem',
    children: 'setActiveItem'
  },
  mounted: function mounted() {
    if (this.placeholder && this.fixed) {
      this.height = this.$refs.tabbar.getBoundingClientRect().height;
    }
  },
  methods: {
    setActiveItem: function setActiveItem() {
      var _this = this;

      this.children.forEach(function (item, index) {
        item.active = (item.name || index) === _this.value;
      });
    },
    onChange: function onChange(active) {
      if (active !== this.value) {
        this.$emit('input', active);
        this.$emit('change', active);
      }
    },
    genTabbar: function genTabbar() {
      var h = this.$createElement;
      return h("div", {
        "ref": "tabbar",
        "style": {
          zIndex: this.zIndex
        },
        "class": [tabbar_defineProperty({}, BORDER_TOP_BOTTOM, this.border), tabbar_bem({
          unfit: !this.fit,
          fixed: this.fixed
        })]
      }, [this.slots()]);
    }
  },
  render: function render() {
    var h = arguments[0];

    if (this.placeholder && this.fixed) {
      return h("div", {
        "class": tabbar_bem('placeholder'),
        "style": {
          height: "".concat(this.height, "px")
        }
      }, [this.genTabbar()]);
    }

    return this.genTabbar();
  }
}));
// EXTERNAL MODULE: ./packages/tabbar/index.less
var packages_tabbar = __webpack_require__("923d");

// CONCATENATED MODULE: ./packages/utils/router.ts
/**
 * Vue Router support
 */
function route(router, config) {
  var to = config.to,
      url = config.url,
      replace = config.replace;

  if (to && router) {
    var promise = router[replace ? 'replace' : 'push'](to);
    /* istanbul ignore else */

    if (promise && promise.catch) {
      promise.catch(function (err) {
        /* istanbul ignore if */
        if (err && err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    }
  } else if (url) {
    replace ? location.replace(url) : location.href = url;
  }
}
function functionalRoute(context) {
  route(context.parent && context.parent.$router, context.props);
}
var routeProps = {
  url: String,
  replace: Boolean,
  to: [String, Object]
};
// CONCATENATED MODULE: ./packages/tabbar-item/index.js
function tabbar_item_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function tabbar_item_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      tabbar_item_ownKeys(Object(source), true).forEach(function (key) {
        tabbar_item_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      tabbar_item_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function tabbar_item_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function tabbar_item_slicedToArray(arr, i) {
  return tabbar_item_arrayWithHoles(arr) || tabbar_item_iterableToArrayLimit(arr, i) || tabbar_item_unsupportedIterableToArray(arr, i) || tabbar_item_nonIterableRest();
}

function tabbar_item_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function tabbar_item_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return tabbar_item_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return tabbar_item_arrayLikeToArray(o, minLen);
}

function tabbar_item_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function tabbar_item_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function tabbar_item_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
} // Utils



 // Mixins

 // Components




var tabbar_item_createNamespace = createNamespace('tabbar-item'),
    tabbar_item_createNamespace2 = tabbar_item_slicedToArray(tabbar_item_createNamespace, 2),
    tabbar_item_createComponent = tabbar_item_createNamespace2[0],
    tabbar_item_bem = tabbar_item_createNamespace2[1];

/* harmony default export */ var tabbar_item = (tabbar_item_createComponent({
  mixins: [ChildrenMixin('vueTabbar')],
  props: tabbar_item_objectSpread({}, routeProps, {
    name: [Number, String],
    icon: String,
    dot: Boolean,
    info: [Number, String],
    badge: [Number, String]
  }),
  data: function data() {
    return {
      active: false
    };
  },
  computed: {
    routeActive: function routeActive() {
      var to = this.to,
          $route = this.$route;

      if (to && $route) {
        var config = isObject(to) ? to : {
          path: to
        };
        var pathMatched = config.path === $route.path;
        var nameMatched = isDef(config.name) && config.name === $route.name;
        return pathMatched || nameMatched;
      }
    }
  },
  methods: {
    onClick: function onClick(event) {
      this.parent.onChange(this.name || this.index);
      this.$emit('click', event);
      route(this.$router, this);
    },
    genIcon: function genIcon(active) {
      var h = this.$createElement;
      var slot = this.slots('icon', {
        active: active
      });

      if (slot) {
        return slot;
      }

      if (this.icon) {
        return h(packages_icon, {
          "attrs": {
            "name": this.icon
          }
        });
      }
    }
  },
  render: function render() {
    var h = arguments[0];
    var active = this.parent.route ? this.routeActive : this.active;
    var color = this.parent[active ? 'activeColor' : 'inactiveColor'];
    return h("div", {
      "class": tabbar_item_bem({
        active: active
      }),
      "style": {
        color: color
      },
      "on": {
        "click": this.onClick
      }
    }, [h("div", {
      "class": tabbar_item_bem('icon')
    }, [this.genIcon(active), h(packages_info_0, {
      "attrs": {
        "dot": this.dot,
        "info": isDef(this.badge) ? this.badge : this.info
      }
    })]), h("div", {
      "class": tabbar_item_bem('text')
    }, [this.slots('default', {
      active: active
    })])]);
  }
}));
// EXTERNAL MODULE: ./packages/tabbar-item/index.less
var packages_tabbar_item = __webpack_require__("0580");

// CONCATENATED MODULE: ./packages/cell-layout/index.js
function cell_layout_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function cell_layout_slicedToArray(arr, i) {
  return cell_layout_arrayWithHoles(arr) || cell_layout_iterableToArrayLimit(arr, i) || cell_layout_unsupportedIterableToArray(arr, i) || cell_layout_nonIterableRest();
}

function cell_layout_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function cell_layout_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return cell_layout_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return cell_layout_arrayLikeToArray(o, minLen);
}

function cell_layout_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function cell_layout_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function cell_layout_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}





var cell_layout_createNamespace = createNamespace('cell-layout'),
    cell_layout_createNamespace2 = cell_layout_slicedToArray(cell_layout_createNamespace, 2),
    cell_layout_createComponent = cell_layout_createNamespace2[0],
    cell_layout_bem = cell_layout_createNamespace2[1];

/* harmony default export */ var cell_layout = (cell_layout_createComponent({
  mixins: [ParentMixin('vueCellLayout')],
  props: {
    columnNum: {
      type: [Number, String],
      default: 4
    },
    iconSize: [Number, String],
    gutter: [Number, String],
    border: {
      type: Boolean,
      default: true
    },
    center: {
      type: Boolean,
      default: true
    },
    square: Boolean,
    clickable: Boolean
  },
  computed: {
    style: function style() {
      var gutter = this.gutter;

      if (gutter) {
        return {
          paddingLeft: addUnit(gutter)
        };
      }
    }
  },
  render: function render() {
    var h = arguments[0];
    return h("div", {
      "style": this.style,
      "class": [cell_layout_bem(), cell_layout_defineProperty({}, BORDER_TOP, this.border && !this.gutter)]
    }, [this.slots()]);
  }
}));
// EXTERNAL MODULE: ./packages/cell-layout/index.less
var packages_cell_layout = __webpack_require__("9f5b");

// CONCATENATED MODULE: ./packages/cell-layout-item/index.js
function cell_layout_item_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function cell_layout_item_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      cell_layout_item_ownKeys(Object(source), true).forEach(function (key) {
        cell_layout_item_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      cell_layout_item_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function cell_layout_item_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function cell_layout_item_slicedToArray(arr, i) {
  return cell_layout_item_arrayWithHoles(arr) || cell_layout_item_iterableToArrayLimit(arr, i) || cell_layout_item_unsupportedIterableToArray(arr, i) || cell_layout_item_nonIterableRest();
}

function cell_layout_item_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function cell_layout_item_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return cell_layout_item_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return cell_layout_item_arrayLikeToArray(o, minLen);
}

function cell_layout_item_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function cell_layout_item_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function cell_layout_item_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
} // Utils




 // Mixins

 // Components




var cell_layout_item_createNamespace = createNamespace('cell-layout-item'),
    cell_layout_item_createNamespace2 = cell_layout_item_slicedToArray(cell_layout_item_createNamespace, 2),
    cell_layout_item_createComponent = cell_layout_item_createNamespace2[0],
    cell_layout_item_bem = cell_layout_item_createNamespace2[1];

/* harmony default export */ var cell_layout_item = (cell_layout_item_createComponent({
  mixins: [ChildrenMixin('vueCellLayout')],
  props: cell_layout_item_objectSpread({}, routeProps, {
    text: String,
    icon: String,
    iconColor: String,
    dot: Boolean,
    badge: [Number, String],
    info: [Number, String]
  }),
  computed: {
    style: function style() {
      var _this$parent = this.parent,
          square = _this$parent.square,
          gutter = _this$parent.gutter,
          columnNum = _this$parent.columnNum;
      var percent = "".concat(100 / columnNum, "%");
      var style = {
        flexBasis: percent
      };

      if (square) {
        style.paddingTop = percent;
      } else if (gutter) {
        var gutterValue = addUnit(gutter);
        style.paddingRight = gutterValue;

        if (this.index >= columnNum) {
          style.marginTop = gutterValue;
        }
      }

      return style;
    },
    contentStyle: function contentStyle() {
      var _this$parent2 = this.parent,
          square = _this$parent2.square,
          gutter = _this$parent2.gutter;

      if (square && gutter) {
        var gutterValue = addUnit(gutter);
        return {
          right: gutterValue,
          bottom: gutterValue,
          height: 'auto'
        };
      }
    }
  },
  methods: {
    onClick: function onClick(event) {
      this.$emit('click', event);
      route(this.$router, this);
    },
    genIcon: function genIcon() {
      var h = this.$createElement;
      var iconSlot = this.slots('icon');
      var info = isDef(this.badge) ? this.badge : this.info;

      if (iconSlot) {
        return h("div", {
          "class": cell_layout_item_bem('icon-wrapper')
        }, [iconSlot, h(packages_info_0, {
          "attrs": {
            "dot": this.dot,
            "info": info
          }
        })]);
      }

      if (this.icon) {
        return h(packages_icon, {
          "attrs": {
            "name": this.icon,
            "dot": this.dot,
            "info": info,
            "size": this.parent.iconSize,
            "color": this.iconColor
          },
          "class": cell_layout_item_bem('icon')
        });
      }
    },
    getText: function getText() {
      var h = this.$createElement;
      var textSlot = this.slots('text');

      if (textSlot) {
        return textSlot;
      }

      if (this.text) {
        return h("span", {
          "class": cell_layout_item_bem('text')
        }, [this.text]);
      }
    },
    genContent: function genContent() {
      var slot = this.slots();

      if (slot) {
        return slot;
      }

      return [this.genIcon(), this.getText()];
    }
  },
  render: function render() {
    var h = arguments[0];
    var _this$parent3 = this.parent,
        center = _this$parent3.center,
        border = _this$parent3.border,
        square = _this$parent3.square,
        gutter = _this$parent3.gutter,
        clickable = _this$parent3.clickable;
    return h("div", {
      "class": [cell_layout_item_bem({
        square: square
      })],
      "style": this.style
    }, [h("div", {
      "style": this.contentStyle,
      "attrs": {
        "role": clickable ? 'button' : null,
        "tabindex": clickable ? 0 : null
      },
      "class": [cell_layout_item_bem('content', {
        center: center,
        square: square,
        clickable: clickable,
        surround: border && gutter
      }), cell_layout_item_defineProperty({}, BORDER, border)],
      "on": {
        "click": this.onClick
      }
    }, [this.genContent()])]);
  }
}));
// EXTERNAL MODULE: ./packages/cell-layout-item/index.less
var packages_cell_layout_item = __webpack_require__("fa23");

// CONCATENATED MODULE: ./packages/text-icon/index.js
function text_icon_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function text_icon_slicedToArray(arr, i) {
  return text_icon_arrayWithHoles(arr) || text_icon_iterableToArrayLimit(arr, i) || text_icon_unsupportedIterableToArray(arr, i) || text_icon_nonIterableRest();
}

function text_icon_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function text_icon_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return text_icon_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return text_icon_arrayLikeToArray(o, minLen);
}

function text_icon_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function text_icon_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function text_icon_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
} // Utils


 // Components



var text_icon_createNamespace = createNamespace('text-icon'),
    text_icon_createNamespace2 = text_icon_slicedToArray(text_icon_createNamespace, 2),
    text_icon_createComponent = text_icon_createNamespace2[0],
    text_icon_bem = text_icon_createNamespace2[1];

/* harmony default export */ var text_icon = (text_icon_createComponent({
  props: {
    iconName: String,
    iconColor: String,
    iconSize: String | Number,
    dot: {
      type: Boolean,
      default: false
    },
    badge: String | Number,
    label: String,
    labelColor: String,
    labelSize: String | Number,
    labelPosition: {
      type: String,
      default: 'bottom'
    },
    labelPadding: {
      type: String | Number,
      default: 2
    }
  },
  data: function data() {
    return {};
  },
  beforeCreate: function beforeCreate() {
    var _this = this;

    var createEmitter = function createEmitter(eventName) {
      return function (event) {
        return _this.$emit(eventName, event);
      };
    };

    this.handClick = createEmitter('click');
  },
  methods: {
    labelPaddingType: function labelPaddingType() {
      // return 'paddingLeft';
      return this.labelPosition == 'bottom' ? 'paddingTop' : this.labelPosition == 'top' ? 'paddingBottom' : this.labelPosition == 'right' ? 'paddingLeft' : 'paddingRight';
    },
    genTextPosition: function genTextPosition() {
      var h = this.$createElement;
      return [h(packages_icon, {
        "attrs": {
          "name": this.iconName,
          "color": this.iconColor,
          "size": this.iconSize,
          "dot": this.dot,
          "badge": this.badge
        }
      }), h("span", {
        "style": text_icon_defineProperty({
          color: this.labelColor,
          fontSize: addUnit(this.labelSize)
        }, this.labelPaddingType(), addUnit(this.labelPadding)),
        "class": text_icon_bem('label')
      }, [this.label])];
    }
  },
  render: function render() {
    var h = arguments[0];
    return h("div", {
      "ref": "textIcon",
      "class": [text_icon_bem(), text_icon_bem(this.labelPosition)],
      "on": {
        "click": this.handClick
      }
    }, [this.genTextPosition()]);
  }
}));
// EXTERNAL MODULE: ./packages/text-icon/index.less
var packages_text_icon = __webpack_require__("1c57");

// CONCATENATED MODULE: ./packages/utils/validate/system.ts

function isAndroid() {
  /* istanbul ignore next */
  return isServer ? false : /android/.test(navigator.userAgent.toLowerCase());
}
function isIOS() {
  /* istanbul ignore next */
  return isServer ? false : /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
}
// CONCATENATED MODULE: ./packages/utils/dom/reset-scroll.ts
/**
 * Hack for iOS12 page scroll
 * https://developers.weixin.qq.com/community/develop/doc/00044ae90742f8c82fb78fcae56800
 */


var reset_scroll_isIOS = isIOS();
/* istanbul ignore next */

function resetScroll() {
  if (reset_scroll_isIOS) {
    setRootScrollTop(getRootScrollTop());
  }
}
// CONCATENATED MODULE: ./packages/mixins/field.js
var FieldMixin = {
  inject: {
    vanField: {
      default: null
    }
  },
  watch: {
    value: function value() {
      var field = this.vanField;

      if (field) {
        field.resetValidation();
        field.validateWithTrigger('onChange');
      }
    }
  },
  created: function created() {
    var field = this.vanField;

    if (field && !field.children) {
      field.children = this;
    }
  }
};
// CONCATENATED MODULE: ./packages/field/utils.ts
function utils_formatNumber(value, allowDot) {
  if (allowDot) {
    var dotIndex = value.indexOf('.');

    if (dotIndex > -1) {
      value = value.slice(0, dotIndex + 1) + value.slice(dotIndex).replace(/\./g, '');
    }
  } else {
    value = value.split('.')[0];
  }

  var regExp = allowDot ? /[^0-9.]/g : /\D/g;
  return value.replace(regExp, '');
}
// CONCATENATED MODULE: ./packages/stepper/index.js



function stepper_slicedToArray(arr, i) {
  return stepper_arrayWithHoles(arr) || stepper_iterableToArrayLimit(arr, i) || stepper_unsupportedIterableToArray(arr, i) || stepper_nonIterableRest();
}

function stepper_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function stepper_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return stepper_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return stepper_arrayLikeToArray(o, minLen);
}

function stepper_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function stepper_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function stepper_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}







var stepper_createNamespace = createNamespace('stepper'),
    stepper_createNamespace2 = stepper_slicedToArray(stepper_createNamespace, 2),
    stepper_createComponent = stepper_createNamespace2[0],
    stepper_bem = stepper_createNamespace2[1];

var LONG_PRESS_START_TIME = 600;
var LONG_PRESS_INTERVAL = 200;

function equal(value1, value2) {
  return String(value1) === String(value2);
} // add num and avoid float number


function add(num1, num2) {
  var cardinal = Math.pow(10, 10);
  return Math.round((num1 + num2) * cardinal) / cardinal;
}

/* harmony default export */ var stepper = (stepper_createComponent({
  mixins: [FieldMixin],
  props: {
    value: null,
    min: {
      type: [Number, String],
      default: 0
    },
    max: {
      type: [Number, String],
      default: Infinity
    },
    defaultValue: {
      type: [Number, String],
      default: 0
    },
    step: {
      type: [Number, String],
      default: 1
    },
    name: {
      type: [Number, String],
      default: ''
    },
    inputWidth: [Number, String],
    buttonSize: [Number, String],
    decimalLength: [Number, String],
    integer: Boolean,
    disabled: Boolean,
    disablePlus: Boolean,
    disableMinus: Boolean,
    disableInput: Boolean,
    asyncChange: Boolean,
    showPlus: {
      type: Boolean,
      default: true
    },
    showMinus: {
      type: Boolean,
      default: true
    },
    longPress: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    var defaultValue = isDef(this.value) ? this.value : this.defaultValue;
    var value = this.format(defaultValue);

    if (!equal(value, this.value)) {
      this.$emit('input', value);
    }

    return {
      currentValue: value
    };
  },
  computed: {
    minusDisabled: function minusDisabled() {
      return this.disabled || this.disableMinus || this.currentValue <= this.min;
    },
    plusDisabled: function plusDisabled() {
      return this.disabled || this.disablePlus || this.currentValue >= this.max;
    },
    inputStyle: function inputStyle() {
      var style = {};

      if (this.inputWidth) {
        style.width = addUnit(this.inputWidth);
      }

      if (this.buttonSize) {
        style.height = addUnit(this.buttonSize);
      }

      return style;
    },
    buttonStyle: function buttonStyle() {
      if (this.buttonSize) {
        var size = addUnit(this.buttonSize);
        return {
          width: size,
          height: size
        };
      }
    }
  },
  watch: {
    max: 'check',
    min: 'check',
    integer: 'check',
    decimalLength: 'check',
    value: function value(val) {
      if (!equal(val, this.currentValue)) {
        this.currentValue = this.format(val);
      }
    },
    currentValue: function currentValue(val) {
      this.$emit('input', val);
      this.$emit('change', val, {
        name: this.name
      });
    }
  },
  methods: {
    check: function check() {
      var val = this.format(this.currentValue);

      if (!equal(val, this.currentValue)) {
        this.currentValue = val;
      }
    },
    // formatNumber illegal characters
    formatNumber: function formatNumber(value) {
      return utils_formatNumber(String(value), !this.integer);
    },
    format: function format(value) {
      value = this.formatNumber(value); // format range

      value = value === '' ? 0 : +value;
      value = Math.max(Math.min(this.max, value), this.min); // format decimal

      if (isDef(this.decimalLength)) {
        value = value.toFixed(this.decimalLength);
      }

      return value;
    },
    onInput: function onInput(event) {
      var value = event.target.value;
      var formatted = this.formatNumber(value); // limit max decimal length

      if (isDef(this.decimalLength) && formatted.indexOf('.') !== -1) {
        var pair = formatted.split('.');
        formatted = "".concat(pair[0], ".").concat(pair[1].slice(0, this.decimalLength));
      }

      if (!equal(value, formatted)) {
        event.target.value = formatted;
      }

      this.emitChange(formatted);
    },
    emitChange: function emitChange(value) {
      if (this.asyncChange) {
        this.$emit('input', value);
        this.$emit('change', value, {
          name: this.name
        });
      } else {
        this.currentValue = value;
      }
    },
    onChange: function onChange() {
      var type = this.type;

      if (this["".concat(type, "Disabled")]) {
        this.$emit('overlimit', type);
        return;
      }

      var diff = type === 'minus' ? -this.step : +this.step;
      var value = this.format(add(+this.currentValue, diff));
      this.emitChange(value);
      this.$emit(type);
    },
    onFocus: function onFocus(event) {
      this.$emit('focus', event); // readonly not work in lagacy mobile safari

      /* istanbul ignore if */

      if (this.disableInput && this.$refs.input) {
        this.$refs.input.blur();
      }
    },
    onBlur: function onBlur(event) {
      var value = this.format(event.target.value);
      event.target.value = value;
      this.currentValue = value;
      this.$emit('blur', event);
      resetScroll();
    },
    longPressStep: function longPressStep() {
      var _this = this;

      this.longPressTimer = setTimeout(function () {
        _this.onChange();

        _this.longPressStep(_this.type);
      }, LONG_PRESS_INTERVAL);
    },
    onTouchStart: function onTouchStart() {
      var _this2 = this;

      if (!this.longPress) {
        return;
      }

      clearTimeout(this.longPressTimer);
      this.isLongPress = false;
      this.longPressTimer = setTimeout(function () {
        _this2.isLongPress = true;

        _this2.onChange();

        _this2.longPressStep();
      }, LONG_PRESS_START_TIME);
    },
    onTouchEnd: function onTouchEnd(event) {
      if (!this.longPress) {
        return;
      }

      clearTimeout(this.longPressTimer);

      if (this.isLongPress) {
        preventDefault(event);
      }
    }
  },
  render: function render() {
    var _this3 = this;

    var h = arguments[0];

    var createListeners = function createListeners(type) {
      return {
        on: {
          click: function click() {
            _this3.type = type;

            _this3.onChange();
          },
          touchstart: function touchstart() {
            _this3.type = type;

            _this3.onTouchStart();
          },
          touchend: _this3.onTouchEnd,
          touchcancel: _this3.onTouchEnd
        }
      };
    };

    return h("div", {
      "class": stepper_bem()
    }, [h("button", helper_default()([{
      "directives": [{
        name: "show",
        value: this.showMinus
      }],
      "attrs": {
        "type": "button"
      },
      "style": this.buttonStyle,
      "class": stepper_bem('minus', {
        disabled: this.minusDisabled
      })
    }, createListeners('minus')])), h("input", {
      "ref": "input",
      "attrs": {
        "type": this.integer ? 'tel' : 'text',
        "role": "spinbutton",
        "disabled": this.disabled,
        "readonly": this.disableInput,
        "inputmode": this.integer ? 'numeric' : 'decimal',
        "aria-valuemax": this.max,
        "aria-valuemin": this.min,
        "aria-valuenow": this.currentValue
      },
      "class": stepper_bem('input'),
      "domProps": {
        "value": this.currentValue
      },
      "style": this.inputStyle,
      "on": {
        "input": this.onInput,
        "focus": this.onFocus,
        "blur": this.onBlur
      }
    }), h("button", helper_default()([{
      "directives": [{
        name: "show",
        value: this.showPlus
      }],
      "attrs": {
        "type": "button"
      },
      "style": this.buttonStyle,
      "class": stepper_bem('plus', {
        disabled: this.plusDisabled
      })
    }, createListeners('plus')]))]);
  }
}));
// EXTERNAL MODULE: ./packages/stepper/index.less
var packages_stepper = __webpack_require__("aec8");

// CONCATENATED MODULE: ./packages/mixins/click-outside.ts
/**
 * Listen to click outside event
 */


var click_outside_ClickOutsideMixin = function ClickOutsideMixin(config) {
  return external_Vue_default.a.extend({
    props: {
      closeOnClickOutside: {
        type: Boolean,
        default: true
      }
    },
    data: function data() {
      var _this = this;

      var clickOutsideHandler = function clickOutsideHandler(event) {
        if (_this.closeOnClickOutside && !_this.$el.contains(event.target)) {
          _this[config.method]();
        }
      };

      return {
        clickOutsideHandler: clickOutsideHandler
      };
    },
    mounted: function mounted() {
      on(document, config.event, this.clickOutsideHandler);
    },
    beforeDestroy: function beforeDestroy() {
      off(document, config.event, this.clickOutsideHandler);
    }
  });
};
// CONCATENATED MODULE: ./packages/swipe-cell/index.js
function swipe_cell_slicedToArray(arr, i) {
  return swipe_cell_arrayWithHoles(arr) || swipe_cell_iterableToArrayLimit(arr, i) || swipe_cell_unsupportedIterableToArray(arr, i) || swipe_cell_nonIterableRest();
}

function swipe_cell_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function swipe_cell_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return swipe_cell_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return swipe_cell_arrayLikeToArray(o, minLen);
}

function swipe_cell_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function swipe_cell_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function swipe_cell_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
} // Utils




 // Mixins




var swipe_cell_createNamespace = createNamespace('swipe-cell'),
    swipe_cell_createNamespace2 = swipe_cell_slicedToArray(swipe_cell_createNamespace, 2),
    swipe_cell_createComponent = swipe_cell_createNamespace2[0],
    swipe_cell_bem = swipe_cell_createNamespace2[1];

var THRESHOLD = 0.15;
/* harmony default export */ var swipe_cell = (swipe_cell_createComponent({
  mixins: [TouchMixin, click_outside_ClickOutsideMixin({
    event: 'touchstart',
    method: 'onClick'
  })],
  props: {
    // @deprecated
    // should be removed in next major version, use beforeClose instead
    name: {
      type: [Number, String],
      default: ''
    },
    leftWidth: [Number, String],
    rightWidth: [Number, String],
    beforeClose: Function,
    disabled: Boolean,
    stopPropagation: Boolean,
    onClose: Function
  },
  data: function data() {
    return {
      offset: 0,
      dragging: false
    };
  },
  computed: {
    computedLeftWidth: function computedLeftWidth() {
      return +this.leftWidth || this.getWidthByRef('left');
    },
    computedRightWidth: function computedRightWidth() {
      return +this.rightWidth || this.getWidthByRef('right');
    }
  },
  mounted: function mounted() {
    this.bindTouchEvent(this.$el);
  },
  methods: {
    getWidthByRef: function getWidthByRef(ref) {
      if (this.$refs[ref]) {
        var rect = this.$refs[ref].getBoundingClientRect();
        return rect.width;
      }

      return 0;
    },
    // @exposed-api
    open: function open(position) {
      var offset = position === 'left' ? this.computedLeftWidth : -this.computedRightWidth;
      this.opened = true;
      this.offset = offset;
      this.$emit('open', {
        position: position,
        name: this.name,
        // @deprecated
        // should be removed in next major version
        detail: this.name
      });
    },
    // @exposed-api
    close: function close(position) {
      this.offset = 0;

      if (this.opened) {
        this.opened = false;
        this.$emit('close', {
          position: position,
          name: this.name
        });
      }
    },
    onTouchStart: function onTouchStart(event) {
      if (this.disabled) {
        return;
      }

      this.startOffset = this.offset;
      this.touchStart(event);
    },
    onTouchMove: function onTouchMove(event) {
      if (this.disabled) {
        return;
      }

      this.touchMove(event);

      if (this.direction === 'horizontal') {
        this.dragging = true;
        this.lockClick = true;
        var isPrevent = !this.opened || this.deltaX * this.startOffset < 0;

        if (isPrevent) {
          preventDefault(event, this.stopPropagation);
        }

        this.offset = range(this.deltaX + this.startOffset, -this.computedRightWidth, this.computedLeftWidth);
      }
    },
    onTouchEnd: function onTouchEnd() {
      var _this = this;

      if (this.disabled) {
        return;
      }

      if (this.dragging) {
        this.toggle(this.offset > 0 ? 'left' : 'right');
        this.dragging = false; // compatible with desktop scenario

        setTimeout(function () {
          _this.lockClick = false;
        }, 0);
      }
    },
    toggle: function toggle(direction) {
      var offset = Math.abs(this.offset);
      var threshold = this.opened ? 1 - THRESHOLD : THRESHOLD;
      var computedLeftWidth = this.computedLeftWidth,
          computedRightWidth = this.computedRightWidth;

      if (computedRightWidth && direction === 'right' && offset > computedRightWidth * threshold) {
        this.open('right');
      } else if (computedLeftWidth && direction === 'left' && offset > computedLeftWidth * threshold) {
        this.open('left');
      } else {
        this.close();
      }
    },
    onClick: function onClick() {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'outside';
      this.$emit('click', position);

      if (this.opened && !this.lockClick) {
        if (this.beforeClose) {
          this.beforeClose({
            name: this.name,
            position: position,
            instance: this
          });
        } else if (this.onClose) {
          this.onClose(position, this, {
            name: this.name
          });
        } else {
          this.close(position);
        }
      }
    },
    getClickHandler: function getClickHandler(position, stop) {
      var _this2 = this;

      return function (event) {
        if (stop) {
          event.stopPropagation();
        }

        _this2.onClick(position);
      };
    },
    genLeftPart: function genLeftPart() {
      var h = this.$createElement;
      var content = this.slots('left');

      if (content) {
        return h("div", {
          "ref": "left",
          "class": swipe_cell_bem('left'),
          "on": {
            "click": this.getClickHandler('left', true)
          }
        }, [content]);
      }
    },
    genRightPart: function genRightPart() {
      var h = this.$createElement;
      var content = this.slots('right');

      if (content) {
        return h("div", {
          "ref": "right",
          "class": swipe_cell_bem('right'),
          "on": {
            "click": this.getClickHandler('right', true)
          }
        }, [content]);
      }
    }
  },
  render: function render() {
    var h = arguments[0];
    var wrapperStyle = {
      transform: "translate3d(".concat(this.offset, "px, 0, 0)"),
      transitionDuration: this.dragging ? '0s' : '.6s'
    };
    return h("div", {
      "class": swipe_cell_bem(),
      "on": {
        "click": this.getClickHandler('cell')
      }
    }, [h("div", {
      "class": swipe_cell_bem('wrapper'),
      "style": wrapperStyle
    }, [this.genLeftPart(), this.slots(), this.genRightPart()])]);
  }
}));
// EXTERNAL MODULE: ./packages/swipe-cell/index.less
var packages_swipe_cell = __webpack_require__("8d8d");

// EXTERNAL MODULE: ./packages/utils/touch-emulator/index.js
var touch_emulator = __webpack_require__("164e");

// CONCATENATED MODULE: ./packages/skeleton/index.tsx


function skeleton_slicedToArray(arr, i) { return skeleton_arrayWithHoles(arr) || skeleton_iterableToArrayLimit(arr, i) || skeleton_unsupportedIterableToArray(arr, i) || skeleton_nonIterableRest(); }

function skeleton_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function skeleton_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return skeleton_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return skeleton_arrayLikeToArray(o, minLen); }

function skeleton_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function skeleton_iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function skeleton_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Utils



var skeleton_createNamespace = createNamespace('skeleton'),
    skeleton_createNamespace2 = skeleton_slicedToArray(skeleton_createNamespace, 2),
    skeleton_createComponent = skeleton_createNamespace2[0],
    skeleton_bem = skeleton_createNamespace2[1];

var DEFAULT_ROW_WIDTH = '100%';
var DEFAULT_LAST_ROW_WIDTH = '60%';

function Skeleton(h, props, slots, ctx) {
  if (!props.loading) {
    return slots.default && slots.default();
  }

  function Title() {
    if (props.title) {
      return h("h3", {
        "class": skeleton_bem('title'),
        "style": {
          width: addUnit(props.titleWidth)
        }
      });
    }
  }

  function Rows() {
    var Rows = [];
    var rowWidth = props.rowWidth;

    function getRowWidth(index) {
      if (rowWidth === DEFAULT_ROW_WIDTH && index === +props.row - 1) {
        return DEFAULT_LAST_ROW_WIDTH;
      }

      if (Array.isArray(rowWidth)) {
        return rowWidth[index];
      }

      return rowWidth;
    }

    for (var i = 0; i < props.row; i++) {
      Rows.push(h("div", {
        "class": skeleton_bem('row'),
        "style": {
          width: addUnit(getRowWidth(i))
        }
      }));
    }

    return Rows;
  }

  function Avatar() {
    if (props.avatar) {
      var size = addUnit(props.avatarSize);
      return h("div", {
        "class": skeleton_bem('avatar', props.avatarShape),
        "style": {
          width: size,
          height: size
        }
      });
    }
  }

  return h("div", helper_default()([{
    "class": skeleton_bem({
      animate: props.animate
    })
  }, inherit(ctx)]), [Avatar(), h("div", {
    "class": skeleton_bem('content')
  }, [Title(), Rows()])]);
}

Skeleton.props = {
  title: Boolean,
  avatar: Boolean,
  row: {
    type: [Number, String],
    default: 0
  },
  loading: {
    type: Boolean,
    default: true
  },
  animate: {
    type: Boolean,
    default: true
  },
  avatarSize: {
    type: String,
    default: '32px'
  },
  avatarShape: {
    type: String,
    default: 'round'
  },
  titleWidth: {
    type: [Number, String],
    default: '40%'
  },
  rowWidth: {
    type: [Number, String, Array],
    default: DEFAULT_ROW_WIDTH
  }
};
/* harmony default export */ var skeleton = (skeleton_createComponent(Skeleton));
// EXTERNAL MODULE: ./packages/skeleton/index.less
var packages_skeleton = __webpack_require__("0ae8");

// CONCATENATED MODULE: ./packages/index-anchor/index.js
function index_anchor_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function index_anchor_slicedToArray(arr, i) {
  return index_anchor_arrayWithHoles(arr) || index_anchor_iterableToArrayLimit(arr, i) || index_anchor_unsupportedIterableToArray(arr, i) || index_anchor_nonIterableRest();
}

function index_anchor_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function index_anchor_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return index_anchor_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return index_anchor_arrayLikeToArray(o, minLen);
}

function index_anchor_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function index_anchor_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function index_anchor_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}





var index_anchor_createNamespace = createNamespace('index-anchor'),
    index_anchor_createNamespace2 = index_anchor_slicedToArray(index_anchor_createNamespace, 2),
    index_anchor_createComponent = index_anchor_createNamespace2[0],
    index_anchor_bem = index_anchor_createNamespace2[1];

/* harmony default export */ var index_anchor = (index_anchor_createComponent({
  mixins: [ChildrenMixin('vueIndexBar', {
    indexKey: 'childrenIndex'
  })],
  props: {
    index: [Number, String]
  },
  data: function data() {
    return {
      top: 0,
      left: null,
      width: null,
      active: false
    };
  },
  computed: {
    sticky: function sticky() {
      return this.active && this.parent.sticky;
    },
    anchorStyle: function anchorStyle() {
      if (this.sticky) {
        return {
          zIndex: "".concat(this.parent.zIndex),
          left: this.left ? "".concat(this.left, "px") : null,
          width: this.width ? "".concat(this.width, "px") : null,
          transform: "translate3d(0, ".concat(this.top, "px, 0)"),
          color: this.parent.highlightColor
        };
      }
    }
  },
  mounted: function mounted() {
    this.height = this.$el.offsetHeight;
  },
  methods: {
    scrollIntoView: function scrollIntoView() {
      this.$el.scrollIntoView();
    }
  },
  render: function render() {
    var h = arguments[0];
    var sticky = this.sticky;
    return h("div", {
      "style": {
        height: sticky ? "".concat(this.height, "px") : null
      }
    }, [h("div", {
      "style": this.anchorStyle,
      "class": [index_anchor_bem({
        sticky: sticky
      }), index_anchor_defineProperty({}, BORDER_BOTTOM, sticky)]
    }, [this.slots('default') || this.index])]);
  }
}));
// EXTERNAL MODULE: ./packages/index-anchor/index.less
var packages_index_anchor = __webpack_require__("85c2");

// CONCATENATED MODULE: ./packages/utils/dom/style.ts
function isHidden(el) {
  var style = window.getComputedStyle(el);
  var hidden = style.display === 'none'; // offsetParent returns null in the following situations:
  // 1. The element or its parent element has the display property set to none.
  // 2. The element has the position property set to fixed

  var parentHidden = el.offsetParent === null && style.position !== 'fixed';
  return hidden || parentHidden;
}
// CONCATENATED MODULE: ./packages/index-bar/index.js
function index_bar_slicedToArray(arr, i) {
  return index_bar_arrayWithHoles(arr) || index_bar_iterableToArrayLimit(arr, i) || index_bar_unsupportedIterableToArray(arr, i) || index_bar_nonIterableRest();
}

function index_bar_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function index_bar_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return index_bar_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return index_bar_arrayLikeToArray(o, minLen);
}

function index_bar_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function index_bar_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function index_bar_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
} // Utils





 // Mixins





function genAlphabet() {
  var indexList = [];
  var charCodeOfA = 'A'.charCodeAt(0);

  for (var i = 0; i < 26; i++) {
    indexList.push(String.fromCharCode(charCodeOfA + i));
  }

  return indexList;
}

var index_bar_createNamespace = createNamespace('index-bar'),
    index_bar_createNamespace2 = index_bar_slicedToArray(index_bar_createNamespace, 2),
    index_bar_createComponent = index_bar_createNamespace2[0],
    index_bar_bem = index_bar_createNamespace2[1];

/* harmony default export */ var index_bar = (index_bar_createComponent({
  mixins: [TouchMixin, ParentMixin('vueIndexBar'), BindEventMixin(function (bind) {
    if (!this.scroller) {
      this.scroller = getScroller(this.$el);
    }

    bind(this.scroller, 'scroll', this.onScroll);
  })],
  props: {
    indexList: {
      type: Array,
      default: genAlphabet
    },
    zIndex: [Number, String],
    sticky: {
      type: Boolean,
      default: true
    },
    stickyOffsetTop: {
      type: Number,
      default: 0
    },
    highlightColor: String
  },
  data: function data() {
    return {
      activeAnchorIndex: null
    };
  },
  computed: {
    sidebarStyle: function sidebarStyle() {
      if (isDef(this.zIndex)) {
        return {
          zIndex: this.zIndex + 1
        };
      }
    },
    highlightStyle: function highlightStyle() {
      var highlightColor = this.highlightColor;

      if (highlightColor) {
        return {
          color: highlightColor
        };
      }
    }
  },
  watch: {
    indexList: function indexList() {
      this.$nextTick(this.onScroll);
    }
  },
  methods: {
    onScroll: function onScroll() {
      var _this = this;

      if (isHidden(this.$el)) {
        return;
      }

      var scrollTop = getScrollTop(this.scroller);
      var scrollerRect = this.getScrollerRect();
      var rects = this.children.map(function (item) {
        return {
          height: item.height,
          top: _this.getElementTop(item.$el, scrollerRect)
        };
      });
      var active = this.getActiveAnchorIndex(scrollTop, rects);
      this.activeAnchorIndex = this.indexList[active];

      if (this.sticky) {
        this.children.forEach(function (item, index) {
          if (index === active || index === active - 1) {
            var rect = item.$el.getBoundingClientRect();
            item.left = rect.left;
            item.width = rect.width;
          } else {
            item.left = null;
            item.width = null;
          }

          if (index === active) {
            item.active = true;
            item.top = Math.max(_this.stickyOffsetTop, rects[index].top - scrollTop) + scrollerRect.top;
          } // else if (index === active - 1) {
          //   const activeItemTop = rects[active].top - scrollTop;
          //   item.active = activeItemTop > 0;
          //   item.top = activeItemTop + scrollerRect.top - item.height;
          // } 
          else {
              item.active = false;
            }
        });
      }
    },
    getScrollerRect: function getScrollerRect() {
      if (this.scroller.getBoundingClientRect) {
        return this.scroller.getBoundingClientRect();
      }

      return {
        top: 0,
        left: 0
      };
    },
    getElementTop: function getElementTop(ele, scrollerRect) {
      var scroller = this.scroller;

      if (scroller === window || scroller === document.body) {
        return scroll_getElementTop(ele);
      }

      var eleRect = ele.getBoundingClientRect();
      return eleRect.top - scrollerRect.top + getScrollTop(scroller);
    },
    getActiveAnchorIndex: function getActiveAnchorIndex(scrollTop, rects) {
      for (var i = this.children.length - 1; i >= 0; i--) {
        var prevHeight = i > 0 ? rects[i - 1].height : 0;
        var reachTop = this.sticky ? prevHeight + this.stickyOffsetTop : 0;

        if (scrollTop + reachTop >= rects[i].top) {
          return i;
        }
      }

      return -1;
    },
    onClick: function onClick(event) {
      this.scrollToElement(event.target);
    },
    onTouchMove: function onTouchMove(event) {
      this.touchMove(event);

      if (this.direction === 'vertical') {
        preventDefault(event);
        var _event$touches$ = event.touches[0],
            clientX = _event$touches$.clientX,
            clientY = _event$touches$.clientY;
        var target = document.elementFromPoint(clientX, clientY);

        if (target) {
          var index = target.dataset.index;
          /* istanbul ignore else */

          if (this.touchActiveIndex !== index) {
            this.touchActiveIndex = index;
            this.scrollToElement(target);
          }
        }
      }
    },
    scrollToElement: function scrollToElement(element) {
      var index = element.dataset.index;

      if (!index) {
        return;
      }

      var match = this.children.filter(function (item) {
        return String(item.index) === index;
      });

      if (match[0]) {
        match[0].scrollIntoView();

        if (this.sticky && this.stickyOffsetTop) {
          setRootScrollTop(getRootScrollTop() - this.stickyOffsetTop);
        }

        this.$emit('select', match[0].index);
      }
    },
    onTouchEnd: function onTouchEnd() {
      this.active = null;
    }
  },
  render: function render() {
    var _this2 = this;

    var h = arguments[0];
    var Indexes = this.indexList.map(function (index) {
      var active = index === _this2.activeAnchorIndex;
      return h("span", {
        "class": index_bar_bem('index', {
          active: active
        }),
        "style": active ? _this2.highlightStyle : null,
        "attrs": {
          "data-index": index
        }
      }, [index]);
    });
    return h("div", {
      "class": index_bar_bem()
    }, [h("div", {
      "class": index_bar_bem('sidebar'),
      "style": this.sidebarStyle,
      "on": {
        "click": this.onClick,
        "touchstart": this.touchStart,
        "touchmove": this.onTouchMove,
        "touchend": this.onTouchEnd,
        "touchcancel": this.onTouchEnd
      }
    }, [Indexes]), this.slots('default')]);
  }
}));
// EXTERNAL MODULE: ./packages/index-bar/index.less
var packages_index_bar = __webpack_require__("dc76");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"a9e78e98-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/scroll-view/index.vue?vue&type=template&id=0862f2a9&
var scroll_viewvue_type_template_id_0862f2a9_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-scroll-view",on:{"touchstart":_vm.onScrollerTouchStart,"touchmove":_vm.onScrollerTouchMove,"touchend":_vm.onScrollerTouchEnd,"touchcancel":_vm.onScrollerTouchEnd,"mousedown":_vm.onScrollerMouseDown,"mousemove":_vm.onScrollerMouseMove,"mouseup":_vm.onScrollerMouseUp,"mouseleave":_vm.onScrollerMouseUp}},[(_vm.$slots.header)?_c('div',{staticClass:"scroll-view-header"},[_vm._t("header")],2):_vm._e(),_c('div',{staticClass:"scroll-view-container",class:{
      'horizon': _vm.scrollingX && !_vm.scrollingY
    },attrs:{"scroll-wrapper":""}},[(_vm.hasRefresher)?_c('div',{staticClass:"scroll-view-refresh",class:{
        'refreshing': _vm.isRefreshing,
        'refresh-active': _vm.isRefreshActive,
      }},[_vm._t("refresh",null,{"scrollTop":_vm.scrollY,"isRefreshing":_vm.isRefreshing,"isRefreshActive":_vm.isRefreshActive})],2):_vm._e(),_vm._t("default"),(_vm.hasMore)?_c('div',{staticClass:"scroll-view-more",class:{active: _vm.isEndReachingStart || _vm.isEndReaching}},[_vm._t("more",null,{"isEndReaching":_vm.isEndReachingStart || _vm.isEndReaching})],2):_vm._e()],2),(_vm.$slots.footer)?_c('div',{staticClass:"scroll-view-footer"},[_vm._t("footer")],2):_vm._e()])}
var scroll_viewvue_type_template_id_0862f2a9_staticRenderFns = []


// CONCATENATED MODULE: ./packages/scroll-view/index.vue?vue&type=template&id=0862f2a9&

// EXTERNAL MODULE: ./packages/scroll-view/_util/env.js
var env = __webpack_require__("cfe9");

// CONCATENATED MODULE: ./packages/scroll-view/_util/store.js
function store_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    store_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    store_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return store_typeof(obj);
}

function store_toConsumableArray(arr) {
  return store_arrayWithoutHoles(arr) || store_iterableToArray(arr) || store_unsupportedIterableToArray(arr) || store_nonIterableSpread();
}

function store_nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function store_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return store_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return store_arrayLikeToArray(o, minLen);
}

function store_iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function store_arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return store_arrayLikeToArray(arr);
}

function store_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
} // eslint-disable-next-line @typescript-eslint/no-empty-function


function store_noop() {}
/**
 * Mix properties into target object.
 */

function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }

  return to;
}
/**
 * Multiple Array traversal
 * @return 1 continue
 * @return 2 break
 */

function traverse(data) {
  var childrenKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var fn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : store_noop;

  if (!data) {
    return;
  }

  if (typeof childrenKeys === 'function') {
    fn = childrenKeys;
    childrenKeys = [];
  }

  var level = 0; // current level

  var indexs = []; // index set of all levels

  var walk = function walk(curData) {
    for (var i = 0, len = curData.length; i < len; i++) {
      var isArray = Array.isArray(curData[i]);
      var key = Array.isArray(childrenKeys) ? childrenKeys[level] : childrenKeys;

      if (isArray || curData[i] && curData[i][key]) {
        level++;
        indexs.push(i);
        walk(isArray ? curData[i] : curData[i][key]);
      } else if (level >= childrenKeys.length) {
        var res = fn(curData[i], level, [].concat(store_toConsumableArray(indexs), [i]));

        if (res === 1) {
          continue;
        } else if (res === 2) {
          break;
        }
      } else {
        continue;
      }
    }

    level = 0;
    indexs = [];
  };

  walk(data);
}
/**
 * Merge an Array of Objects into a single Object.
 */

function toObject(arr) {
  var res = {};

  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }

  return res;
}
/**
 * Convert an Array-like object to a real Array.
 */

function toArray(list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = [];

  while (i--) {
    ret.unshift(list[i + start]);
  }

  return ret;
}
/**
 * whether item is in list or list equal item
 */

function inArray(list, item) {
  return Array.isArray(list) ? !!~list.indexOf(item) : item === list;
}
/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */

function toNumber(val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n;
}
/**
 * Convert a value to a string
 */

function store_toString(val) {
  return val == null ? '' : store_typeof(val) === 'object' ? JSON.stringify(val, null, 2) : String(val);
}
/**
 * Determine whether the two objects are equal or not shallowly
 */

function compareObjects(object0, object1) {
  var ret = true;

  if (!object0 || !object1) {
    ret = false;
  } else if (store_typeof(object0) !== 'object' || store_typeof(object1) !== 'object') {
    ret = false;
  } else if (JSON.stringify(object0) !== JSON.stringify(object1)) {
    ret = false;
  }

  return ret;
}
/**
 * Check object is empty
 */

function isEmptyObject(obj) {
  for (var key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
}
// CONCATENATED MODULE: ./packages/scroll-view/_util/index.js


// CONCATENATED MODULE: ./packages/scroll-view/_util/animate.js

/* istanbul ignore file */

var Animate = function (global) {
  /* istanbul ignore next */
  var time = Date.now || function () {
    return +new Date();
  };

  var desiredFrames = 60;
  var millisecondsPerSecond = 1000;
  var running = {};
  var counter = 1;
  return {
    /**
     * A requestAnimationFrame wrapper / polyfill.
     *
     * @param callback {Function} The callback to be invoked before the next repaint.
     * @param root {HTMLElement} The root element for the repaint
     */
    requestAnimationFrame: function () {
      // Check for request animation Frame support
      var requestFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame;
      var isNative = !!requestFrame;

      if (requestFrame && !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(requestFrame.toString())) {
        isNative = false;
      }

      if (isNative) {
        return function (callback, root) {
          requestFrame(callback, root);
        };
      }

      var TARGET_FPS = 60;
      var requests = {};
      var rafHandle = 1;
      var intervalHandle = null;
      var lastActive = +new Date();
      return function (callback) {
        var callbackHandle = rafHandle++; // Store callback

        requests[callbackHandle] = callback; // Create timeout at first request

        if (intervalHandle === null) {
          intervalHandle = setInterval(function () {
            var time = +new Date();
            var currentRequests = requests; // Reset data structure before executing callbacks

            requests = {};

            for (var key in currentRequests) {
              // eslint-disable-next-line no-prototype-builtins
              if (currentRequests.hasOwnProperty(key)) {
                currentRequests[key](time);
                lastActive = time;
              }
            } // Disable the timeout when nothing happens for a certain
            // period of time


            if (time - lastActive > 2500) {
              clearInterval(intervalHandle);
              intervalHandle = null;
            }
          }, 1000 / TARGET_FPS);
        }

        return callbackHandle;
      };
    }(),

    /**
     * Stops the given animation.
     *
     * @param id {Integer} Unique animation ID
     * @return {Boolean} Whether the animation was stopped (aka, was running before)
     */
    stop: function stop(id) {
      var cleared = running[id] != null;
      cleared && (running[id] = null);
      return cleared;
    },

    /**
     * Whether the given animation is still running.
     *
     * @param id {Integer} Unique animation ID
     * @return {Boolean} Whether the animation is still running
     */
    isRunning: function isRunning(id) {
      return running[id] != null;
    },

    /**
     * Start the animation.
     *
     * @param stepCallback {Function} Pointer to function which is executed on every step.
     *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
     * @param verifyCallback {Function} Executed before every animation step.
     *   Signature of the method should be `function() { return continueWithAnimation; }`
     * @param completedCallback {Function}
     *   Signature of the method should be `function(droppedFrames, finishedAnimation) {}`
     * @param duration {Integer} Milliseconds to run the animation
     * @param easingMethod {Function} Pointer to easing function
     *   Signature of the method should be `function(percent) { return modifiedValue; }`
     * @param root {Element ? document.body} Render root, when available. Used for internal
     *   usage of requestAnimationFrame.
     * @return {Integer} Identifier of animation. Can be used to stop it any time.
     */
    start: function start(stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {
      var _this = this;

      var start = time();
      var lastFrame = start;
      var percent = 0;
      var dropCounter = 0;
      var id = counter++;

      if (!root) {
        root = document.body;
      } // Compacting running db automatically every few new animations


      if (id % 20 === 0) {
        var newRunning = {};

        for (var usedId in running) {
          newRunning[usedId] = true;
        }

        running = newRunning;
      } // This is the internal step method which is called every few milliseconds


      var step = function step(virtual) {
        // Normalize virtual value
        var render = virtual !== true; // Get current time

        var now = time(); // Verification is executed before next animation step

        if (!running[id] || verifyCallback && !verifyCallback(id)) {
          running[id] = null;
          completedCallback && completedCallback(desiredFrames - dropCounter / ((now - start) / millisecondsPerSecond), id, false);
          return;
        } // For the current rendering to apply let's update omitted steps in memory.
        // This is important to bring internal state variables up-to-date with progress in time.


        if (render) {
          var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;

          for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
            step(true);
            dropCounter++;
          }
        } // Compute percent value


        if (duration) {
          percent = (now - start) / duration;

          if (percent > 1) {
            percent = 1;
          }
        } // Execute step callback, then...


        var value = easingMethod ? easingMethod(percent) : percent;
        value = isNaN(value) ? 0 : value;

        if ((stepCallback(value, now, render) === false || percent === 1) && render) {
          running[id] = null;
          completedCallback && completedCallback(desiredFrames - dropCounter / ((now - start) / millisecondsPerSecond), id, percent === 1 || duration == null);
        } else if (render) {
          lastFrame = now;

          _this.requestAnimationFrame(step, root);
        }
      }; // Mark as running


      running[id] = true; // Init first step

      this.requestAnimationFrame(step, root); // Return unique animation ID

      return id;
    }
  };
}(env["b" /* root */]);

var easeOutCubic = function easeOutCubic(pos) {
  return Math.pow(pos - 1, 3) + 1;
};
var easeInOutCubic = function easeInOutCubic(pos) {
  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(pos, 3);
  }

  return 0.5 * (Math.pow(pos - 2, 3) + 2);
};
/* harmony default export */ var _util_animate = (Animate);
// CONCATENATED MODULE: ./packages/scroll-view/_util/scroller.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* eslint-disable no-var */

/* istanbul ignore file */

/*
 * Based on the work of: Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function


function scroller_noop() {}

 // Development environment

var isProd = "production" === 'production';

var warn = function warn(msg) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'error';
  !isProd && console[fn]("[Mand-Mobile]: ".concat(msg));
};

var members = {
  _isSingleTouch: false,
  _isTracking: false,
  _didDecelerationComplete: false,
  _isGesturing: false,
  _isDragging: false,
  _isDecelerating: false,
  _isAnimating: false,
  _clientLeft: 0,
  _clientTop: 0,
  _clientWidth: 0,
  _clientHeight: 0,
  _contentWidth: 0,
  _contentHeight: 0,
  _snapWidth: 100,
  _snapHeight: 100,
  _refreshHeight: null,
  _refreshActive: false,
  _refreshActivate: null,
  _refreshDeactivate: null,
  _refreshStart: null,
  _zoomLevel: 1,
  _scrollLeft: 0,
  _scrollTop: 0,
  _maxScrollLeft: 0,
  _maxScrollTop: 0,
  _scheduledLeft: 0,
  _scheduledTop: 0,
  _lastTouchLeft: null,
  _lastTouchTop: null,
  _lastTouchMove: null,
  _positions: null,
  _minDecelerationScrollLeft: null,
  _minDecelerationScrollTop: null,
  _maxDecelerationScrollLeft: null,
  _maxDecelerationScrollTop: null,
  _decelerationVelocityX: null,
  _decelerationVelocityY: null
};
/* istanbul ignore next */

var scroller_Scroller = /*#__PURE__*/function () {
  function Scroller() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : scroller_noop;
    var options = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, Scroller);

    this.options = {
      scrollingX: true,
      scrollingY: true,
      animating: true,
      animationDuration: 250,
      inRequestAnimationFrame: false,
      bouncing: true,
      locking: true,
      paging: false,
      snapping: false,
      snappingVelocity: 4,
      zooming: false,
      minZoom: 0.5,
      maxZoom: 3,
      speedMultiplier: 1,
      scrollingComplete: scroller_noop,
      penetrationDeceleration: 0.03,
      penetrationAcceleration: 0.08
    };
    extend(this.options, options);
    this._callback = callback;
  }
  /**
   * Configures the dimensions of the client (outer) and content (inner) elements.
   * Requires the available space for the outer element and the outer size of the inner element.
   * All values which are falsy (null or zero etc.) are ignored and the old value is kept.
   *
   * @param clientWidth {Integer ? null} Inner width of outer element
   * @param clientHeight {Integer ? null} Inner height of outer element
   * @param contentWidth {Integer ? null} Outer width of inner element
   * @param contentHeight {Integer ? null} Outer height of inner element
   */


  _createClass(Scroller, [{
    key: "setDimensions",
    value: function setDimensions(clientWidth, clientHeight, contentWidth, contentHeight) {
      // Only update values which are defined
      if (clientWidth === +clientWidth) {
        this._clientWidth = clientWidth;
      }

      if (clientHeight === +clientHeight) {
        this._clientHeight = clientHeight;
      }

      if (contentWidth === +contentWidth) {
        this._contentWidth = contentWidth;
      }

      if (contentHeight === +contentHeight) {
        this._contentHeight = contentHeight;
      } // Refresh maximums


      this._computeScrollMax(); // Refresh scroll position


      this.scrollTo(this._scrollLeft, this._scrollTop, true);
    }
    /**
     * Sets the client coordinates in relation to the document.
     *
     * @param left {Integer ? 0} Left position of outer element
     * @param top {Integer ? 0} Top position of outer element
     */

  }, {
    key: "setPosition",
    value: function setPosition(left, top) {
      this._clientLeft = left || 0;
      this._clientTop = top || 0;
    }
    /**
     * Configures the snapping (when snapping is active)
     *
     * @param width {Integer} Snapping width
     * @param height {Integer} Snapping height
     */

  }, {
    key: "setSnapSize",
    value: function setSnapSize(width, height) {
      this._snapWidth = width;
      this._snapHeight = height;
    }
    /**
     * Returns the scroll position and zooming values
     *
     * @return {Map} `left` and `top` scroll position and `zoom` level
     */

  }, {
    key: "getValues",
    value: function getValues() {
      return {
        left: this._scrollLeft,
        top: this._scrollTop,
        zoom: this._zoomLevel
      };
    }
    /**
     * Returns the maximum scroll values
     *
     * @return {Map} `left` and `top` maximum scroll values
     */

  }, {
    key: "getScrollMax",
    value: function getScrollMax() {
      return {
        left: this._maxScrollLeft,
        top: this._maxScrollTop
      };
    }
    /**
     * Activates pull-to-refresh. A special zone on the top of the list to start a list refresh whenever
     * the user event is released during visibility of this zone. This was introduced by some apps on iOS like
     * the official Twitter client.
     *
     * @param height {Integer} Height of pull-to-refresh zone on top of rendered list
     * @param activateCallback {Function} Callback to execute on activation. This is for signalling the user about a refresh is about to happen when he release.
     * @param deactivateCallback {Function} Callback to execute on deactivation. This is for signalling the user about the refresh being cancelled.
     * @param startCallback {Function} Callback to execute to start the real async refresh action. Call {@link #finishPullToRefresh} after finish of refresh.
     */

  }, {
    key: "activatePullToRefresh",
    value: function activatePullToRefresh(height, activateCallback, deactivateCallback, startCallback) {
      this._refreshHeight = height;
      this._refreshActivate = activateCallback;
      this._refreshDeactivate = deactivateCallback;
      this._refreshStart = startCallback;
    }
    /**
     * Starts pull-to-refresh manually.
     */

  }, {
    key: "triggerPullToRefresh",
    value: function triggerPullToRefresh() {
      // Use publish instead of scrollTo to allow scrolling to out of boundary position
      // We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled
      this._publish(this._scrollLeft, -this._refreshHeight, this._zoomLevel, true);

      if (this._refreshStart) {
        this._refreshStart();
      }
    }
    /**
     * Signalizes that pull-to-refresh is finished.
     */

  }, {
    key: "finishPullToRefresh",
    value: function finishPullToRefresh() {
      this._refreshActive = false;

      if (this._refreshDeactivate) {
        this._refreshDeactivate();
      }

      this.scrollTo(this._scrollLeft, this._scrollTop, true);
    }
    /**
     * Scrolls to the given position. Respect limitations and snapping automatically.
     *
     * @param left {Number?null} Horizontal scroll position, keeps current if value is <code>null</code>
     * @param top {Number?null} Vertical scroll position, keeps current if value is <code>null</code>
     * @param animate {Boolean?false} Whether the scrolling should happen using an animation
     * @param zoom {Number?null} Zoom level to go to
     */

  }, {
    key: "scrollTo",
    value: function scrollTo(left, top, animate) {
      var zoom = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1; // Stop deceleration

      if (this._isDecelerating) {
        _util_animate.stop(this._isDecelerating);
        this._isDecelerating = false;
      } // Correct coordinates based on new zoom level


      if (zoom != null && zoom !== this._zoomLevel) {
        if (!this.options.zooming) {
          warn('Zooming is not enabled!');
        }

        zoom = zoom ? zoom : 1;
        left *= zoom;
        top *= zoom; // // Recompute maximum values while temporary tweaking maximum scroll ranges

        this._computeScrollMax(zoom);
      } else {
        // Keep zoom when not defined
        zoom = this._zoomLevel;
      }

      if (!this.options.scrollingX) {
        left = this._scrollLeft;
      } else {
        if (this.options.paging) {
          left = Math.round(left / this._clientWidth) * this._clientWidth;
        } else if (this.options.snapping) {
          left = Math.round(left / this._snapWidth) * this._snapWidth;
        }
      }

      if (!this.options.scrollingY) {
        top = this._scrollTop;
      } else {
        if (this.options.paging) {
          top = Math.round(top / this._clientHeight) * this._clientHeight;
        } else if (this.options.snapping) {
          top = Math.round(top / this._snapHeight) * this._snapHeight;
        }
      } // Limit for allowed ranges


      left = Math.max(Math.min(this._maxScrollLeft, left), 0);
      top = Math.max(Math.min(this._maxScrollTop, top), 0); // Don't animate when no change detected, still call publish to make sure
      // that rendered position is really in-sync with internal data

      if (left === this._scrollLeft && top === this._scrollTop) {
        animate = false;
      } // Publish new values


      if (!this._isTracking) {
        this._publish(left, top, zoom, animate);
      }
    }
    /**
     * Zooms to the given level. Supports optional animation. Zooms
     * the center when no coordinates are given.
     *
     * @param level {Number} Level to zoom to
     * @param animate {Boolean ? false} Whether to use animation
     * @param originLeft {Number ? null} Zoom in at given left coordinate
     * @param originTop {Number ? null} Zoom in at given top coordinate
     * @param callback {Function ? null} A callback that gets fired when the zoom is complete.
     */

  }, {
    key: "zoomTo",
    value: function zoomTo(level, animate, originLeft, originTop, callback) {
      if (!this.options.zooming) {
        warn('Zooming is not enabled!');
      } // Add callback if exists


      if (callback) {
        this._zoomComplete = callback;
      } // Stop deceleration


      if (this._isDecelerating) {
        _util_animate.stop(this._isDecelerating);
        this._isDecelerating = false;
      }

      var oldLevel = this._zoomLevel; // Normalize input origin to center of viewport if not defined

      if (originLeft == null) {
        originLeft = this._clientWidth / 2;
      }

      if (originTop == null) {
        originTop = this._clientHeight / 2;
      } // Limit level according to configuration


      level = Math.max(Math.min(level, this.options.maxZoom), this.options.minZoom); // Recompute maximum values while temporary tweaking maximum scroll ranges

      this._computeScrollMax(level); // Recompute left and top coordinates based on new zoom level


      var left = (originLeft + this._scrollLeft) * level / oldLevel - originLeft;
      var top = (originTop + this._scrollTop) * level / oldLevel - originTop; // Limit x-axis

      if (left > this._maxScrollLeft) {
        left = this._maxScrollLeft;
      } else if (left < 0) {
        left = 0;
      } // Limit y-axis


      if (top > this._maxScrollTop) {
        top = this._maxScrollTop;
      } else if (top < 0) {
        top = 0;
      } // Push values out


      this._publish(left, top, level, animate);
    }
  }, {
    key: "doTouchStart",
    value: function doTouchStart(touches, timeStamp) {
      // Array-like check is enough here
      if (touches.length == null) {
        warn("Invalid touch list: ".concat(touches));
      }

      if (timeStamp instanceof Date) {
        timeStamp = timeStamp.valueOf();
      }

      if (typeof timeStamp !== 'number') {
        warn("Invalid timestamp value: ".concat(timeStamp));
      } // Reset interruptedAnimation flag


      this._interruptedAnimation = true; // Stop deceleration

      if (this._isDecelerating) {
        _util_animate.stop(this._isDecelerating);
        this._isDecelerating = false;
        this._interruptedAnimation = true;
      } // Stop animation


      if (this._isAnimating) {
        _util_animate.stop(this._isAnimating);
        this._isAnimating = false;
        this._interruptedAnimation = true;
      } // Use center point when dealing with two fingers


      var isSingleTouch = touches.length === 1;
      var currentTouchLeft, currentTouchTop;

      if (isSingleTouch) {
        currentTouchLeft = touches[0].pageX;
        currentTouchTop = touches[0].pageY;
      } else {
        currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
        currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
      } // Store initial positions


      this._initialTouchLeft = currentTouchLeft;
      this._initialTouchTop = currentTouchTop; // Store current zoom level

      this._zoomLevelStart = this._zoomLevel; // Store initial touch positions

      this._lastTouchLeft = currentTouchLeft;
      this._lastTouchTop = currentTouchTop; // Store initial move time stamp

      this._lastTouchMove = timeStamp; // Reset initial scale

      this._lastScale = 1; // Reset locking flags

      this._enableScrollX = !isSingleTouch && this.options.scrollingX;
      this._enableScrollY = !isSingleTouch && this.options.scrollingY; // Reset tracking flag

      this._isTracking = true; // Reset deceleration complete flag

      this._didDecelerationComplete = false; // Dragging starts directly with two fingers, otherwise lazy with an offset

      this._isDragging = !isSingleTouch; // Some features are disabled in multi touch scenarios

      this._isSingleTouch = isSingleTouch; // Clearing data structure

      this._positions = [];
    }
  }, {
    key: "doTouchMove",
    value: function doTouchMove(touches, timeStamp, scale) {
      // Array-like check is enough here
      if (touches.length == null) {
        warn("Invalid touch list: ".concat(touches));
      }

      if (timeStamp instanceof Date) {
        timeStamp = timeStamp.valueOf();
      }

      if (typeof timeStamp !== 'number') {
        warn("Invalid timestamp value: ".concat(timeStamp));
      } // Ignore event when tracking is not enabled (event might be outside of element)


      if (!this._isTracking) {
        return;
      }

      var currentTouchLeft, currentTouchTop; // Compute move based around of center of fingers

      if (touches.length === 2) {
        currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
        currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
      } else {
        currentTouchLeft = touches[0].pageX;
        currentTouchTop = touches[0].pageY;
      }

      var positions = this._positions; // Are we already is dragging mode?

      if (this._isDragging) {
        // Compute move distance
        var moveX = currentTouchLeft - this._lastTouchLeft;
        var moveY = currentTouchTop - this._lastTouchTop; // Read previous scroll position and zooming

        var scrollLeft = this._scrollLeft;
        var scrollTop = this._scrollTop;
        var level = this._zoomLevel; // Work with scaling

        if (scale != null && this.options.zooming) {
          var oldLevel = level; // Recompute level based on previous scale and new scale

          level = level / this._lastScale * scale; // Limit level according to configuration

          level = Math.max(Math.min(level, this.options.maxZoom), this.options.minZoom); // Only do further compution when change happened

          if (oldLevel !== level) {
            // Compute relative event position to container
            var currentTouchLeftRel = currentTouchLeft - this._clientLeft;
            var currentTouchTopRel = currentTouchTop - this._clientTop; // Recompute left and top coordinates based on new zoom level

            scrollLeft = (currentTouchLeftRel + scrollLeft) * level / oldLevel - currentTouchLeftRel;
            scrollTop = (currentTouchTopRel + scrollTop) * level / oldLevel - currentTouchTopRel; // Recompute max scroll values

            this._computeScrollMax(level);
          }
        }

        if (this._enableScrollX) {
          scrollLeft -= moveX * this.options.speedMultiplier;
          var maxScrollLeft = this._maxScrollLeft;

          if (scrollLeft > maxScrollLeft || scrollLeft < 0) {
            // Slow down on the edges
            if (this.options.bouncing) {
              scrollLeft += moveX / 2 * this.options.speedMultiplier;
            } else if (scrollLeft > maxScrollLeft) {
              scrollLeft = maxScrollLeft;
            } else {
              scrollLeft = 0;
            }
          }
        } // Compute new vertical scroll position


        if (this._enableScrollY) {
          scrollTop -= moveY * this.options.speedMultiplier;
          var maxScrollTop = this._maxScrollTop;

          if (scrollTop > maxScrollTop || scrollTop < 0) {
            // Slow down on the edges
            if (this.options.bouncing) {
              scrollTop += moveY / 2 * this.options.speedMultiplier; // Support pull-to-refresh (only when only y is scrollable)

              if (!this._enableScrollX && this._refreshHeight != null) {
                if (!this._refreshActive && scrollTop <= -this._refreshHeight) {
                  this._refreshActive = true;

                  if (this._refreshActivate) {
                    this._refreshActivate();
                  }
                } else if (this._refreshActive && scrollTop > -this._refreshHeight) {
                  this._refreshActive = false;

                  if (this._refreshDeactivate) {
                    this._refreshDeactivate();
                  }
                }
              }
            } else if (scrollTop > maxScrollTop) {
              scrollTop = maxScrollTop;
            } else {
              scrollTop = 0;
            }
          }
        } // Keep list from growing infinitely (holding min 10, max 20 measure points)


        if (positions.length > 60) {
          positions.splice(0, 30);
        } // Track scroll movement for decleration


        positions.push(scrollLeft, scrollTop, timeStamp); // Sync scroll position

        this._publish(scrollLeft, scrollTop, level); // Otherwise figure out whether we are switching into dragging mode now.

      } else {
        var minimumTrackingForScroll = this.options.locking ? 3 : 0;
        var minimumTrackingForDrag = 5;
        var distanceX = Math.abs(currentTouchLeft - this._initialTouchLeft);
        var distanceY = Math.abs(currentTouchTop - this._initialTouchTop);
        this._enableScrollX = this.options.scrollingX && distanceX >= minimumTrackingForScroll;
        this._enableScrollY = this.options.scrollingY && distanceY >= minimumTrackingForScroll;
        positions.push(this._scrollLeft, this._scrollTop, timeStamp);
        this._isDragging = (this._enableScrollX || this._enableScrollY) && (distanceX >= minimumTrackingForDrag || distanceY >= minimumTrackingForDrag);

        if (this._isDragging) {
          this._interruptedAnimation = false;
        }
      } // Update last touch positions and time stamp for next event


      this._lastTouchLeft = currentTouchLeft;
      this._lastTouchTop = currentTouchTop;
      this._lastTouchMove = timeStamp;
    }
  }, {
    key: "doTouchEnd",
    value: function doTouchEnd(timeStamp) {
      if (timeStamp instanceof Date) {
        timeStamp = timeStamp.valueOf();
      }

      if (typeof timeStamp !== 'number') {
        warn("Invalid timestamp value: ".concat(timeStamp));
      } // Ignore event when tracking is not enabled (no touchstart event on element)
      // This is required as this listener ('touchmove') sits on the document and not on the element itthis.


      if (!this._isTracking) {
        return;
      } // Not touching anymore (when two finger hit the screen there are two touch end events)


      this._isTracking = false; // Be sure to reset the dragging flag now. Here we also detect whether
      // the finger has moved fast enough to switch into a deceleration animation.

      if (this._isDragging) {
        // Reset dragging flag
        this._isDragging = false; // Start deceleration
        // Verify that the last move detected was in some relevant time frame

        if (this._isSingleTouch && this.options.animating && timeStamp - this._lastTouchMove <= 100) {
          // Then figure out what the scroll position was about 100ms ago
          var positions = this._positions;
          var endPos = positions.length - 1;
          var startPos = endPos; // Move pointer to position measured 100ms ago

          for (var i = endPos; i > 0 && positions[i] > this._lastTouchMove - 100; i -= 3) {
            startPos = i;
          } // If start and stop position is identical in a 100ms timeframe,
          // we cannot compute any useful deceleration.


          if (startPos !== endPos) {
            // Compute relative movement between these two points
            var timeOffset = positions[endPos] - positions[startPos];
            var movedLeft = this._scrollLeft - positions[startPos - 2];
            var movedTop = this._scrollTop - positions[startPos - 1]; // Based on 50ms compute the movement to apply for each render step

            this._decelerationVelocityX = movedLeft / timeOffset * (1000 / 60);
            this._decelerationVelocityY = movedTop / timeOffset * (1000 / 60); // How much velocity is required to start the deceleration

            var minVelocityToStartDeceleration = this.options.paging || this.options.snapping ? this.options.snappingVelocity : 0.01; // Verify that we have enough velocity to start deceleration

            if (Math.abs(this._decelerationVelocityX) > minVelocityToStartDeceleration || Math.abs(this._decelerationVelocityY) > minVelocityToStartDeceleration) {
              // Deactivate pull-to-refresh when decelerating
              if (!this._refreshActive) {
                this._startDeceleration(timeStamp);
              }
            } else {
              this.options.scrollingComplete();
            }
          } else {
            this.options.scrollingComplete();
          }
        } else if (timeStamp - this._lastTouchMove > 100) {
          !this.options.snapping && this.options.scrollingComplete();
        }
      } // If this was a slower move it is per default non decelerated, but this
      // still means that we want snap back to the bounds which is done here.
      // This is placed outside the condition above to improve edge case stability
      // e.g. touchend fired without enabled dragging. This should normally do not
      // have modified the scroll positions or even showed the scrollbars though.


      if (!this._isDecelerating) {
        if (this._refreshActive && this._refreshStart) {
          // Use publish instead of scrollTo to allow scrolling to out of boundary position
          // We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled
          this._publish(this._scrollLeft, -this._refreshHeight, this._zoomLevel, true);

          if (this._refreshStart) {
            this._refreshStart();
          }
        } else {
          if (this._interruptedAnimation || this._isDragging) {
            this.options.scrollingComplete();
          }

          this.scrollTo(this._scrollLeft, this._scrollTop, true, this._zoomLevel); // Directly signalize deactivation (nothing todo on refresh?)

          if (this._refreshActive) {
            this._refreshActive = false;

            if (this._refreshDeactivate) {
              this._refreshDeactivate();
            }
          }
        }
      } // Fully cleanup list


      this._positions.length = 0;
    }
  }, {
    key: "_publish",
    value: function _publish(left, top) {
      var _this = this;

      var zoom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var animate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false; // Remember whether we had an animation, then we try to continue based on the current "drive" of the animation

      var wasAnimating = this._isAnimating;

      if (wasAnimating) {
        _util_animate.stop(wasAnimating);
        this._isAnimating = false;
      }

      if (animate && this.options.animating) {
        // Keep scheduled positions for scrollBy/zoomBy functionality
        this._scheduledLeft = left;
        this._scheduledTop = top;
        this._scheduledZoom = zoom;
        var oldLeft = this._scrollLeft;
        var oldTop = this._scrollTop;
        var oldZoom = this._zoomLevel;
        var diffLeft = left - oldLeft;
        var diffTop = top - oldTop;
        var diffZoom = zoom - oldZoom;

        var step = function step(percent, now, render) {
          if (render) {
            _this._scrollLeft = oldLeft + diffLeft * percent;
            _this._scrollTop = oldTop + diffTop * percent;
            _this._zoomLevel = oldZoom + diffZoom * percent; // Push values out

            if (_this._callback) {
              _this._callback(_this._scrollLeft, _this._scrollTop, _this._zoomLevel);
            }
          }
        };

        var verify = function verify(id) {
          return _this._isAnimating === id;
        };

        var completed = function completed(renderedFramesPerSecond, animationId, wasFinished) {
          if (animationId === _this._isAnimating) {
            _this._isAnimating = false;
          }

          if (_this._didDecelerationComplete || wasFinished) {
            _this.options.scrollingComplete();
          }

          if (_this.options.zooming) {
            _this._computeScrollMax();

            if (_this._zoomComplete) {
              _this._zoomComplete();

              _this._zoomComplete = null;
            }
          }
        };

        var doAnimation = function doAnimation() {
          // When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
          _this._isAnimating = _util_animate.start(step, verify, completed, _this.options.animationDuration, wasAnimating ? easeOutCubic : easeInOutCubic);
        };

        if (this.options.inRequestAnimationFrame) {
          _util_animate.requestAnimationFrame(function () {
            doAnimation();
          });
        } else {
          doAnimation();
        }
      } else {
        this._scheduledLeft = this._scrollLeft = left;
        this._scheduledTop = this._scrollTop = top;
        this._scheduledZoom = this._zoomLevel = zoom; // Push values out

        if (this._callback) {
          this._callback(left, top, zoom);
        } // Fix max scroll ranges


        if (this.options.zooming) {
          this._computeScrollMax();

          if (this._zoomComplete) {
            this._zoomComplete();

            this._zoomComplete = null;
          }
        }
      }
    }
  }, {
    key: "_computeScrollMax",
    value: function _computeScrollMax(zoomLevel) {
      if (zoomLevel == null) {
        zoomLevel = this._zoomLevel;
      }

      this._maxScrollLeft = Math.max(this._contentWidth * zoomLevel - this._clientWidth, 0);
      this._maxScrollTop = Math.max(this._contentHeight * zoomLevel - this._clientHeight, 0);
    }
  }, {
    key: "_startDeceleration",
    value: function _startDeceleration() {
      var _this2 = this;

      if (this.options.paging) {
        var scrollLeft = Math.max(Math.min(this._scrollLeft, this._maxScrollLeft), 0);
        var scrollTop = Math.max(Math.min(this._scrollTop, this._maxScrollTop), 0);
        var clientWidth = this._clientWidth;
        var clientHeight = this._clientHeight; // We limit deceleration not to the min/max values of the allowed range, but to the size of the visible client area.
        // Each page should have exactly the size of the client area.

        this._minDecelerationScrollLeft = Math.floor(scrollLeft / clientWidth) * clientWidth;
        this._minDecelerationScrollTop = Math.floor(scrollTop / clientHeight) * clientHeight;
        this._maxDecelerationScrollLeft = Math.ceil(scrollLeft / clientWidth) * clientWidth;
        this._maxDecelerationScrollTop = Math.ceil(scrollTop / clientHeight) * clientHeight;
      } else {
        this._minDecelerationScrollLeft = 0;
        this._minDecelerationScrollTop = 0;
        this._maxDecelerationScrollLeft = this._maxScrollLeft;
        this._maxDecelerationScrollTop = this._maxScrollTop;
      } // Wrap class method


      var step = function step(percent, now, render) {
        _this2._stepThroughDeceleration(render);
      }; // How much velocity is required to keep the deceleration running


      var minVelocityToKeepDecelerating = this.options.snapping ? this.options.snappingVelocity : 0.01; // Detect whether it's still worth to continue animating steps
      // If we are already slow enough to not being user perceivable anymore, we stop the whole process here.

      var verify = function verify() {
        var shouldContinue = Math.abs(_this2._decelerationVelocityX) >= minVelocityToKeepDecelerating || Math.abs(_this2._decelerationVelocityY) >= minVelocityToKeepDecelerating;

        if (!shouldContinue) {
          _this2._didDecelerationComplete = true;
        }

        return shouldContinue;
      };

      var completed = function completed() {
        _this2._isDecelerating = false; // if (this._didDecelerationComplete) {
        //   this.options.scrollingComplete()
        // }
        // Animate to grid when snapping is active, otherwise just fix out-of-boundary positions

        _this2.scrollTo(_this2._scrollLeft, _this2._scrollTop, _this2.options.snapping);
      }; // Start animation and switch on flag


      this._isDecelerating = _util_animate.start(step, verify, completed);
    }
  }, {
    key: "_stepThroughDeceleration",
    value: function _stepThroughDeceleration(render) {
      //
      // COMPUTE NEXT SCROLL POSITION
      //
      // Add deceleration to scroll position
      var scrollLeft = this._scrollLeft + this._decelerationVelocityX;
      var scrollTop = this._scrollTop + this._decelerationVelocityY; //
      // HARD LIMIT SCROLL POSITION FOR NON BOUNCING MODE
      //

      if (!this.options.bouncing) {
        var scrollLeftFixed = Math.max(Math.min(this._maxDecelerationScrollLeft, scrollLeft), this._minDecelerationScrollLeft);

        if (scrollLeftFixed !== scrollLeft) {
          scrollLeft = scrollLeftFixed;
          this._decelerationVelocityX = 0;
        }

        var scrollTopFixed = Math.max(Math.min(this._maxDecelerationScrollTop, scrollTop), this._minDecelerationScrollTop);

        if (scrollTopFixed !== scrollTop) {
          scrollTop = scrollTopFixed;
          this._decelerationVelocityY = 0;
        }
      } //
      // UPDATE SCROLL POSITION
      //


      if (render) {
        this._publish(scrollLeft, scrollTop, this._zoomLevel);
      } else {
        this._scrollLeft = scrollLeft;
        this._scrollTop = scrollTop;
      } //
      // SLOW DOWN
      //
      // Slow down velocity on every iteration


      if (!this.options.paging) {
        // This is the factor applied to every iteration of the animation
        // to slow down the process. This should emulate natural behavior where
        // objects slow down when the initiator of the movement is removed
        var frictionFactor = 0.95;
        this._decelerationVelocityX *= frictionFactor;
        this._decelerationVelocityY *= frictionFactor;
      } //
      // BOUNCING SUPPORT
      //


      if (this.options.bouncing) {
        var scrollOutsideX = 0;
        var scrollOutsideY = 0; // This configures the amount of change applied to deceleration/acceleration when reaching boundaries

        var penetrationDeceleration = this.options.penetrationDeceleration;
        var penetrationAcceleration = this.options.penetrationAcceleration; // Check limits

        if (scrollLeft < this._minDecelerationScrollLeft) {
          scrollOutsideX = this._minDecelerationScrollLeft - scrollLeft;
        } else if (scrollLeft > this._maxDecelerationScrollLeft) {
          scrollOutsideX = this._maxDecelerationScrollLeft - scrollLeft;
        }

        if (scrollTop < this._minDecelerationScrollTop) {
          scrollOutsideY = this._minDecelerationScrollTop - scrollTop;
        } else if (scrollTop > this._maxDecelerationScrollTop) {
          scrollOutsideY = this._maxDecelerationScrollTop - scrollTop;
        } // Slow down until slow enough, then flip back to snap position


        if (scrollOutsideX !== 0) {
          if (scrollOutsideX * this._decelerationVelocityX <= 0) {
            this._decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
          } else {
            this._decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
          }
        }

        if (scrollOutsideY !== 0) {
          if (scrollOutsideY * this._decelerationVelocityY <= 0) {
            this._decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
          } else {
            this._decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
          }
        }
      }
    }
  }]);

  return Scroller;
}();


extend(scroller_Scroller.prototype, members);
// CONCATENATED MODULE: ./packages/scroll-view/_util/render.js

/* istanbul ignore file */

var render_render = function (global) {
  // for ssr
  if (!env["a" /* inBrowser */]) {
    return function (content, left, top) {
      content.style.marginLeft = left ? "".concat(-left, "px") : '';
      content.style.marginTop = top ? "".concat(-top, "px") : '';
    };
  }

  var docStyle = document.documentElement.style;
  var engine; // eslint-disable-next-line no-undef

  if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
    engine = 'presto';
  } else if ('MozAppearance' in docStyle) {
    engine = 'gecko';
  } else if ('WebkitAppearance' in docStyle) {
    engine = 'webkit';
  } else if (typeof navigator.cpuClass === 'string') {
    engine = 'trident';
  }

  var vendorPrefix = {
    trident: 'ms',
    gecko: 'Moz',
    webkit: 'Webkit',
    presto: 'O'
  }[engine];
  var helperElem = document.createElement('div');
  var perspectiveProperty = vendorPrefix + 'Perspective';
  var transformProperty = vendorPrefix + 'Transform';

  if (helperElem.style[perspectiveProperty] !== undefined) {
    return function (content, left, top) {
      var zoom = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var useNativeDriver = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

      if (useNativeDriver) {
        content.style[transformProperty] = "translate3d(".concat(-left, "px,").concat(-top, "px,0) scale(").concat(zoom, ")");
      } else {
        content.style[transformProperty] = "translate(".concat(-left, "px,").concat(-top, "px) scale(").concat(zoom, ")");
      }
    };
  } else if (helperElem.style[transformProperty] !== undefined) {
    return function (content, left, top) {
      var zoom = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      content.style[transformProperty] = "translate(".concat(-left, "px,").concat(-top, "px) scale(").concat(zoom, ")");
    };
  } else {
    return function (content, left, top, zoom) {
      content.style.marginLeft = left ? "".concat(-left, "px") : '';
      content.style.marginTop = top ? "".concat(-top, "px") : '';
      content.style.zoom = zoom || '';
    };
  }
}(env["b" /* root */]);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/scroll-view/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var scroll_viewvue_type_script_lang_js_ = ({
  name: 'vue-scroll-view',
  props: {
    scrollingX: {
      type: Boolean,
      default: true
    },
    scrollingY: {
      type: Boolean,
      default: true
    },
    bouncing: {
      type: Boolean,
      default: true
    },
    autoReflow: {
      type: Boolean,
      default: false
    },
    manualInit: {
      type: Boolean,
      default: false
    },
    endReachedThreshold: {
      type: Number,
      default: 0
    },
    immediateCheckEndReaching: {
      type: Boolean,
      default: false
    },
    touchAngle: {
      type: Number,
      default: 45
    },
    isPrevent: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      container: null,
      content: null,
      refresher: null,
      more: null,
      scroller: null,
      refreshOffsetY: 0,
      isInitialed: false,
      isMouseDown: false,
      isRefreshing: false,
      isRefreshActive: false,
      isEndReachingStart: false,
      isEndReaching: false,
      scrollX: null,
      scrollY: null,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      containerW: 0,
      containerH: 0,
      contentW: 0,
      contentH: 0,
      reflowTimer: null,
      endReachedHandler: null
    };
  },
  computed: {
    hasRefresher: function hasRefresher() {
      return !!(this.$slots.refresh || this.$scopedSlots.refresh);
    },
    hasMore: function hasMore() {
      return !!(this.$slots.more || this.$scopedSlots.more);
    }
  },
  watch: {
    autoReflow: function autoReflow(val) {
      if (val) {
        this.initAutoReflow();
      } else {
        this.destroyAutoReflow();
      }
    }
  },
  mounted: function mounted() {
    if (!this.manualInit) {
      this.initScroller();
    }
  },
  destroyed: function destroyed() {
    this.destroyAutoReflow();
  },
  methods: {
    initScroller: function initScroller() {
      var _this = this;

      /* istanbul ignore if */
      if (this.isInitialed) {
        return;
      }

      this.container = this.$el;
      this.refresher = this.$el.querySelector('.scroll-view-refresh');
      this.more = this.$el.querySelector('.scroll-view-more');
      this.content = this.$el.querySelector('.scroll-view-container');
      this.refreshOffsetY = this.refresher ? this.refresher.clientHeight : 0;
      this.moreOffsetY = this.more ? this.more.clientHeight : 0;
      var container = this.container;
      var content = this.content;
      var rect = container.getBoundingClientRect();
      var scroller = new scroller_Scroller(function (left, top) {
        render_render(content, left, top);

        if (_this.isInitialed) {
          _this.onScroll(left, top);
        }
      }, {
        scrollingX: this.scrollingX,
        scrollingY: this.scrollingY,
        bouncing: this.bouncing,
        zooming: false,
        animationDuration: 200,
        speedMultiplier: 1.2,
        inRequestAnimationFrame: true
      });
      scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);

      if (this.hasRefresher) {
        scroller.activatePullToRefresh(this.refreshOffsetY, function () {
          _this.isRefreshActive = true;
          _this.isRefreshing = false;

          _this.$emit('refreshActive');
        }, function () {
          _this.isRefreshActive = false;
          _this.isRefreshing = false;
        }, function () {
          _this.isRefreshActive = false;
          _this.isRefreshing = true;

          _this.$emit('refreshing');
        });
      }

      this.scroller = scroller;
      this.reflowScroller(true);
      this.autoReflow && this.initAutoReflow();
      this.endReachedHandler = VueUtil._debounce(function () {
        _this.isEndReaching = true;

        _this.$emit('endReached');

        _this.$emit('end-reached');
      }, 150);
      setTimeout(function () {
        _this.isInitialed = true;
      }, 50);

      if (this.immediateCheckEndReaching) {
        this.$nextTick(this.checkScrollerEnd);
      }
    },
    initAutoReflow: function initAutoReflow() {
      var _this2 = this;

      this.destroyAutoReflow();
      this.reflowTimer = setInterval(function () {
        _this2.reflowScroller();
      }, 100);
    },
    destroyAutoReflow: function destroyAutoReflow() {
      this.reflowTimer && clearInterval(this.reflowTimer);
    },
    checkScrollerEnd: function checkScrollerEnd() {
      if (!this.scroller) {
        return;
      }

      var containerHeight = this.scroller._clientHeight;
      var content = this.scroller._contentHeight;
      var top = this.scroller._scrollTop;
      var moreOffsetY = this.moreOffsetY;
      var moreThreshold = this.endReachedThreshold;
      var endOffset = content - containerHeight - (top + moreOffsetY + moreThreshold);

      if (top >= 0 && !this.isEndReaching && endOffset <= 0 && this.endReachedHandler) {
        // First prepare for "load more" state
        this.isEndReachingStart = true; // Second enter "load more" state
        // & trigger endReached event only once after the rebounding animation

        this.endReachedHandler();
      }
    },
    getScrollerAngle: function getScrollerAngle() {
      var diffX = this.currentX - this.startX;
      var diffY = this.currentY - this.startY;
      var angle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
      return this.scrollingX ? 90 - angle : angle;
    },
    // MARK: events handler
    onScrollerTouchStart: function onScrollerTouchStart(event) {
      // event.target.tagName && event.target.tagName.match(/input|textarea|select/i)

      /* istanbul ignore if */
      if (!this.scroller) {
        return;
      }

      this.startX = event.targetTouches[0].pageX;
      this.startY = event.targetTouches[0].pageY;
      this.scroller.doTouchStart(event.touches, event.timeStamp);
    },
    onScrollerTouchMove: function onScrollerTouchMove(event) {
      /* istanbul ignore if */
      if (!this.scroller) {
        return;
      }

      var hadPrevent = false;

      if (this.isPrevent) {
        event.preventDefault();
        hadPrevent = true;
      }

      this.currentX = event.targetTouches[0].pageX;
      this.currentY = event.targetTouches[0].pageY;

      if (!this.scrollingX || !this.scrollingY) {
        var currentTouchAngle = this.getScrollerAngle();

        if (currentTouchAngle < this.touchAngle) {
          return;
        }
      }

      if (!hadPrevent && event.cancelable) {
        event.preventDefault();
      }

      this.scroller.doTouchMove(event.touches, event.timeStamp, event.scale);
      var boundaryDistance = 15;
      var scrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
      var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      var pX = this.currentX - scrollLeft;
      var pY = this.currentY - scrollTop;

      if (pX > document.documentElement.clientWidth - boundaryDistance || pY > document.documentElement.clientHeight - boundaryDistance || pX < boundaryDistance || pY < boundaryDistance) {
        this.scroller.doTouchEnd(event.timeStamp);
      }
    },
    onScrollerTouchEnd: function onScrollerTouchEnd(event) {
      /* istanbul ignore if */
      if (!this.scroller) {
        return;
      }

      this.scroller.doTouchEnd(event.timeStamp);
    },
    onScrollerMouseDown: function onScrollerMouseDown(event) {
      /* istanbul ignore if */
      if (!this.scroller) {
        return;
      }

      this.startX = event.pageX;
      this.startY = event.pageY;
      this.scroller.doTouchStart([{
        pageX: event.pageX,
        pageY: event.pageY
      }], event.timeStamp);
      this.isMouseDown = true;
    },
    onScrollerMouseMove: function onScrollerMouseMove(event) {
      /* istanbul ignore if */
      if (!this.scroller || !this.isMouseDown) {
        return;
      }

      this.currentX = event.pageX;
      this.currentY = event.pageY;

      if (!this.scrollingX || !this.scrollingY) {
        var currentTouchAngle = this.getScrollerAngle();

        if (currentTouchAngle < this.touchAngle) {
          return;
        }
      }

      this.scroller.doTouchMove([{
        pageX: event.pageX,
        pageY: event.pageY
      }], event.timeStamp);
      this.isMouseDown = true;
    },
    onScrollerMouseUp: function onScrollerMouseUp(event) {
      /* istanbul ignore if */
      if (!this.scroller || !this.isMouseDown) {
        return;
      }

      this.scroller.doTouchEnd(event.timeStamp);
      this.isMouseDown = false;
    },
    onScroll: function onScroll(left, top) {
      left = +left.toFixed(2);
      top = +top.toFixed(2);

      if (this.scrollX === left && this.scrollY === top) {
        return;
      }

      this.scrollX = left;
      this.scrollY = top;
      this.checkScrollerEnd();
      this.$emit('scroll', {
        scrollLeft: left,
        scrollTop: top
      });
    },
    init: function init() {
      var _this3 = this;

      this.$nextTick(function () {
        _this3.initScroller();
      });
    },
    scrollTo: function scrollTo(left, top) {
      var animate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      /* istanbul ignore if */
      if (!this.scroller) {
        return;
      }

      this.scroller.scrollTo(left, top, animate);
    },
    getOffsets: function getOffsets() {
      /* istanbul ignore if */
      if (!this.scroller) {
        return {
          left: 0,
          top: 0
        };
      }

      return this.scroller.getValues();
    },
    reflowScroller: function reflowScroller() {
      var _this4 = this;

      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var container = this.container;
      var content = this.content;
      /* istanbul ignore if */

      if (!this.scroller || !container || !content) {
        return;
      }

      this.$nextTick(function () {
        var containerW = container.clientWidth;
        var containerH = container.clientHeight;
        var contentW = content.offsetWidth;
        var contentH = content.offsetHeight;

        if (force || _this4.containerW !== containerW || _this4.containerH !== containerH || _this4.contentW !== contentW || _this4.contentH !== contentH) {
          _this4.scroller.setDimensions(container.clientWidth, container.clientHeight, content.offsetWidth, content.offsetHeight);

          _this4.containerW = containerW;
          _this4.containerH = containerH;
          _this4.contentW = contentW;
          _this4.contentH = contentH;
        }
      });
    },
    triggerRefresh: function triggerRefresh() {
      /* istanbul ignore if */
      if (!this.scroller) {
        return;
      }

      this.scroller.triggerPullToRefresh();
    },
    finishRefresh: function finishRefresh() {
      /* istanbul ignore if */
      if (!this.scroller) {
        return;
      }

      this.scroller.finishPullToRefresh();
      this.reflowScroller();
    },
    triggerLoadMore: function triggerLoadMore() {
      //触发触底加载更多数据的方法
      if (!this.scroller) {
        return;
      }

      this.endReachedHandler();
    },
    finishLoadMore: function finishLoadMore() {
      /* istanbul ignore if */
      if (!this.scroller) {
        return;
      }

      this.isEndReachingStart = false;
      this.isEndReaching = false;
      this.reflowScroller();
    }
  }
});
// CONCATENATED MODULE: ./packages/scroll-view/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var packages_scroll_viewvue_type_script_lang_js_ = (scroll_viewvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./packages/scroll-view/index.vue?vue&type=style&index=0&lang=css&
var scroll_viewvue_type_style_index_0_lang_css_ = __webpack_require__("e8a5");

// CONCATENATED MODULE: ./packages/scroll-view/index.vue






/* normalize component */

var scroll_view_component = normalizeComponent(
  packages_scroll_viewvue_type_script_lang_js_,
  scroll_viewvue_type_template_id_0862f2a9_render,
  scroll_viewvue_type_template_id_0862f2a9_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var scroll_view = (scroll_view_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"a9e78e98-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/scroll-view/more.vue?vue&type=template&id=3e23cb61&
var morevue_type_template_id_3e23cb61_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-scroll-view-more"},[(!_vm.isFinished)?[_vm._v(" "+_vm._s(_vm.loadingText || _vm.$t('vue.scrollViewMore.loadingText'))+" ")]:[_vm._v(" "+_vm._s(_vm.finishedText || _vm.$t('vue.scrollViewMore.finishedText'))+" ")]],2)}
var morevue_type_template_id_3e23cb61_staticRenderFns = []


// CONCATENATED MODULE: ./packages/scroll-view/more.vue?vue&type=template&id=3e23cb61&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/scroll-view/more.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var morevue_type_script_lang_js_ = ({
  name: 'vue-scroll-view-more',
  props: {
    loadingText: {
      type: String
    },
    finishedText: {
      type: String
    },
    isFinished: {
      type: Boolean,
      default: false
    }
  }
});
// CONCATENATED MODULE: ./packages/scroll-view/more.vue?vue&type=script&lang=js&
 /* harmony default export */ var scroll_view_morevue_type_script_lang_js_ = (morevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./packages/scroll-view/more.vue?vue&type=style&index=0&lang=css&
var morevue_type_style_index_0_lang_css_ = __webpack_require__("af92");

// CONCATENATED MODULE: ./packages/scroll-view/more.vue






/* normalize component */

var more_component = normalizeComponent(
  scroll_view_morevue_type_script_lang_js_,
  morevue_type_template_id_3e23cb61_render,
  morevue_type_template_id_3e23cb61_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var more = (more_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/scroll-view-more/index.vue?vue&type=script&lang=js&

/* harmony default export */ var lib_vue_loader_options_packages_scroll_view_morevue_type_script_lang_js_ = (more);
// CONCATENATED MODULE: ./packages/scroll-view-more/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var packages_scroll_view_morevue_type_script_lang_js_ = (lib_vue_loader_options_packages_scroll_view_morevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/scroll-view-more/index.vue
var scroll_view_more_render, scroll_view_more_staticRenderFns




/* normalize component */

var scroll_view_more_component = normalizeComponent(
  packages_scroll_view_morevue_type_script_lang_js_,
  scroll_view_more_render,
  scroll_view_more_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var scroll_view_more = (scroll_view_more_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"a9e78e98-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/scroll-view/refresh.vue?vue&type=template&id=5058841f&
var refreshvue_type_template_id_5058841f_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-scroll-view-refresh"},[_c('vue-activity-indicator-rolling',{attrs:{"process":!_vm.isRefreshing ? _vm.process : undefined,"width":4,"color":_vm.rollerColor}}),_c('p',{staticClass:"refresh-tip"},[_vm._v(_vm._s(_vm.refreshTip))])],1)}
var refreshvue_type_template_id_5058841f_staticRenderFns = []


// CONCATENATED MODULE: ./packages/scroll-view/refresh.vue?vue&type=template&id=5058841f&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"a9e78e98-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/scroll-view/roller.vue?vue&type=template&id=4f32b9b8&
var rollervue_type_template_id_4f32b9b8_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-activity-indicator-rolling"},[_c('div',{staticClass:"rolling-container"},[_c('svg',{staticClass:"vue-activity-indicator-svg rolling",style:({width: (_vm.size + "px"), height: (_vm.size + "px"), transform: ("rotateZ(" + _vm.rotate + "deg)")}),attrs:{"viewBox":("0 0 " + _vm.viewBoxSize + " " + _vm.viewBoxSize),"preserveAspectRatio":"xMidYMid"}},[_c('circle',{attrs:{"fill":"none","stroke":_vm.borderColor,"stroke-width":_vm.strokeWidth,"cx":_vm.viewBoxSize/2,"cy":_vm.viewBoxSize/2,"r":_vm.radius}}),(!_vm.$slots.circle)?_c('g',{staticClass:"circle"},[(_vm.isAutoAnimation || _vm.process > 0)?_c('circle',{staticClass:"stroke",attrs:{"cx":_vm.viewBoxSize/2,"cy":_vm.viewBoxSize/2,"fill":_vm.fill,"stroke":_vm.color,"stroke-width":_vm.strokeWidth,"stroke-dasharray":_vm.isAutoAnimation ? ("" + (110 * _vm.circlePerimeter / 125)) : _vm.strokeDasharray,"stroke-linecap":_vm.linecap,"r":_vm.radius}},[(_vm.isAutoAnimation)?_c('animate',{attrs:{"attributeName":"stroke-dashoffset","values":((360 * _vm.circlePerimeter / 125) + ";" + (140 * _vm.circlePerimeter / 125)),"dur":"2.2s","keyTimes":"0;1","calcMode":"spline","fill":"freeze","keySplines":"0.41,0.314,0.8,0.54","repeatCount":"indefinite","begin":"0"}}):_vm._e(),(_vm.isAutoAnimation)?_c('animateTransform',{attrs:{"dur":(_vm.duration + "s"),"values":("0 " + (_vm.viewBoxSize/2) + " " + (_vm.viewBoxSize/2) + ";360 " + (_vm.viewBoxSize/2) + " " + (_vm.viewBoxSize/2)),"attributeName":"transform","type":"rotate","calcMode":"linear","keyTimes":"0;1","begin":"0","repeatCount":"indefinite"}}):_vm._e()],1):_vm._e()]):_vm._t("circle"),_vm._t("defs")],2),_c('div',{staticClass:"content"},[_vm._t("default")],2)])])}
var rollervue_type_template_id_4f32b9b8_staticRenderFns = []


// CONCATENATED MODULE: ./packages/scroll-view/roller.vue?vue&type=template&id=4f32b9b8&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/scroll-view/roller.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var rollervue_type_script_lang_js_ = ({
  name: 'vue-activity-indicator-rolling',
  props: {
    size: {
      type: Number,
      default: 25
    },
    width: {
      type: Number
    },
    color: {
      type: String,
      default: '#2F86F6'
    },
    borderColor: {
      type: String,
      default: 'rgba(0, 0, 0, .1)'
    },
    fill: {
      type: String,
      default: 'transparent'
    },
    linecap: {
      // butt | round | square | inherit
      type: String,
      default: 'round'
    },
    rotate: {
      type: Number,
      default: 0
    },
    process: {
      // process control 0-1
      type: Number
    }
  },
  computed: {
    id: function id() {
      return "".concat(this.$options.name, "-keyframes-").concat(this.size);
    },
    strokeWidth: function strokeWidth() {
      return this.width || this.size / 12;
    },
    strokeDasharray: function strokeDasharray() {
      return "".concat(this.process * this.circlePerimeter, " ").concat((1 - this.process) * this.circlePerimeter);
    },
    radius: function radius() {
      return this.size / 2;
    },
    viewBoxSize: function viewBoxSize() {
      return this.size + 2 * this.strokeWidth;
    },
    circlePerimeter: function circlePerimeter() {
      return this.size * 3.1415;
    },
    duration: function duration() {
      return 2;
    },
    isAutoAnimation: function isAutoAnimation() {
      return this.process === undefined;
    }
  }
});
// CONCATENATED MODULE: ./packages/scroll-view/roller.vue?vue&type=script&lang=js&
 /* harmony default export */ var scroll_view_rollervue_type_script_lang_js_ = (rollervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./packages/scroll-view/roller.vue?vue&type=style&index=0&lang=css&
var rollervue_type_style_index_0_lang_css_ = __webpack_require__("ac62");

// CONCATENATED MODULE: ./packages/scroll-view/roller.vue






/* normalize component */

var roller_component = normalizeComponent(
  scroll_view_rollervue_type_script_lang_js_,
  rollervue_type_template_id_4f32b9b8_render,
  rollervue_type_template_id_4f32b9b8_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var roller = (roller_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/scroll-view/refresh.vue?vue&type=script&lang=js&
function refreshvue_type_script_lang_js_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var refreshvue_type_script_lang_js_ = ({
  name: 'vue-scroll-view-refresh',
  components: refreshvue_type_script_lang_js_defineProperty({}, roller.name, roller),
  props: {
    scrollTop: {
      type: Number,
      default: 0
    },
    isRefreshing: {
      type: Boolean,
      default: false
    },
    isRefreshActive: {
      type: Boolean,
      default: true
    },
    refreshText: {
      type: String
    },
    refreshActiveText: {
      type: String
    },
    refreshingText: {
      type: String
    },
    rollerColor: {
      type: String,
      default: '#2F86F6'
    }
  },
  computed: {
    process: function process() {
      /* istanbul ignore if */
      if (!this.$el || !this.scrollTop) {
        return +this.scrollTop;
      }

      var refreshHeight = this.$el.clientHeight;

      if (Math.abs(this.scrollTop) < refreshHeight / 2) {
        return 0;
      } // first 1/3 is not included in progress


      return (Math.abs(this.scrollTop) - refreshHeight / 2) / (refreshHeight / 2);
    },
    refreshTip: function refreshTip() {
      if (this.isRefreshing) {
        return this.refreshingText || this.$t('vue.scrollViewRefresh.refreshingText');
      } else if (this.isRefreshActive) {
        return this.refreshActiveText || this.$t('vue.scrollViewRefresh.refreshActiveText');
      } else {
        return this.refreshText || this.$t('vue.scrollViewRefresh.refreshText');
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/scroll-view/refresh.vue?vue&type=script&lang=js&
 /* harmony default export */ var scroll_view_refreshvue_type_script_lang_js_ = (refreshvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./packages/scroll-view/refresh.vue?vue&type=style&index=0&lang=css&
var refreshvue_type_style_index_0_lang_css_ = __webpack_require__("5078");

// CONCATENATED MODULE: ./packages/scroll-view/refresh.vue






/* normalize component */

var refresh_component = normalizeComponent(
  scroll_view_refreshvue_type_script_lang_js_,
  refreshvue_type_template_id_5058841f_render,
  refreshvue_type_template_id_5058841f_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var refresh = (refresh_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/scroll-view-refresh/index.vue?vue&type=script&lang=js&

/* harmony default export */ var lib_vue_loader_options_packages_scroll_view_refreshvue_type_script_lang_js_ = (refresh);
// CONCATENATED MODULE: ./packages/scroll-view-refresh/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var packages_scroll_view_refreshvue_type_script_lang_js_ = (lib_vue_loader_options_packages_scroll_view_refreshvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/scroll-view-refresh/index.vue
var scroll_view_refresh_render, scroll_view_refresh_staticRenderFns




/* normalize component */

var scroll_view_refresh_component = normalizeComponent(
  packages_scroll_view_refreshvue_type_script_lang_js_,
  scroll_view_refresh_render,
  scroll_view_refresh_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var scroll_view_refresh = (scroll_view_refresh_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/datetime-picker/datetimePicker.vue?vue&type=script&lang=js&
//
/* harmony default export */ var datetimePickervue_type_script_lang_js_ = ({
  name: 'VueDatePicker',
  props: {
    //true:显示移动端UI;false:显示 Viy PC端 Ui
    showMobileUi: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {};
  },
  render: function render(h) {
    var _this = this;

    var slots = this.$slots ? Object.keys(this.$slots).reduce(function (arr, key) {
      return arr.concat(_this.$slots[key]);
    }, []).map(function (vnode) {
      vnode.context = _this._self;
      return vnode;
    }) : null;
    return h(this.showMobileUi ? 'VueDatePickerMobile' : 'VueDatePickerViy', {
      attrs: this.$attrs,
      scopedSlots: this.$scopedSlots,
      on: this.$listeners
    }, slots);
  },
  methods: {},
  watch: {},
  computed: {}
});
// CONCATENATED MODULE: ./packages/datetime-picker/datetimePicker.vue?vue&type=script&lang=js&
 /* harmony default export */ var datetime_picker_datetimePickervue_type_script_lang_js_ = (datetimePickervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/datetime-picker/datetimePicker.vue
var datetimePicker_render, datetimePicker_staticRenderFns




/* normalize component */

var datetimePicker_component = normalizeComponent(
  datetime_picker_datetimePickervue_type_script_lang_js_,
  datetimePicker_render,
  datetimePicker_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var datetimePicker = (datetimePicker_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"a9e78e98-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/datetime-picker/datetimePickerMobile.vue?vue&type=template&id=27403015&
var datetimePickerMobilevue_type_template_id_27403015_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(!_vm.isRange)?_c('div',[_c('vue-input',{attrs:{"value":_vm.fieldValue,"readonly":true,"disabled":_vm.disabled,"clickable":true,"clearable":_vm.clearable,"size":_vm.size,"placeholder":_vm.placeholder,"text-align":_vm.actualTextAlign,"icon":_vm.showClose ? '' + _vm.clearIcon : '',"on-icon-click":_vm.handleClickIcon},nativeOn:{"click":function($event){return _vm.onClick($event)}}},[_c('i',{class:['vue-input__icon',_vm.triggerClass],attrs:{"slot":"prefix"},slot:"prefix"})]),_c('popup',{attrs:{"position":"bottom"},model:{value:(_vm.showPicker),callback:function ($$v) {_vm.showPicker=$$v},expression:"showPicker"}},[_c('datetime-picker',{ref:"picker",class:_vm.popperClass,attrs:{"format":_vm.format,"value-format":_vm.valueFormat,"formatter":_vm.actualFormatter,"filter":_vm.filter,"position":"bottom","title":_vm.title,"value":_vm.value,"type":_vm.type,"min-date":_vm.mMinDate,"max-date":_vm.mMaxDate,"default-pick":_vm.actualDefaultPick,"confirm-button-text":_vm.confirmButtonText,"cancel-button-text":_vm.cancelButtonText,"show-toolbar":true,"item-height":_vm.itemHeight,"visible-item-count":_vm.visibleItemCount,"swipe-duration":_vm.swipeDuration,"picker-options":_vm.pickerOptions},on:{"confirm":_vm.onConfirm,"cancel":_vm.onCancel}})],1)],1):_c('div',{staticStyle:{"background-color":"#fff"}},[_c('vue-input',{staticStyle:{"width":"48%"},attrs:{"value":_vm.fieldValue,"readonly":true,"disabled":_vm.disabled,"placeholder":_vm.startPlaceholder || _vm.$t('vue.datepicker.startPlaceholder'),"clickable":true,"clearable":_vm.clearable,"size":_vm.size,"text-align":_vm.actualTextAlign},nativeOn:{"click":function($event){return _vm.onClick($event)}}},[_c('i',{class:['vue-input__icon',_vm.triggerClass],attrs:{"slot":"prefix"},slot:"prefix"})]),_c('span',[_vm._v(_vm._s(_vm.rangeSeparator))]),_c('vue-input',{staticStyle:{"width":"48%"},attrs:{"value":_vm.endFieldValue,"readonly":true,"disabled":_vm.disabled,"clickable":true,"clearable":_vm.clearable,"size":_vm.size,"placeholder":_vm.endPlaceholder || _vm.$t('vue.datepicker.endPlaceholder'),"text-align":_vm.actualTextAlign,"icon":_vm.showClose ? '' + _vm.clearIcon : '',"on-icon-click":_vm.handleClickIcon},nativeOn:{"click":function($event){return _vm.endOnClick($event)}}}),_c('popup',{attrs:{"position":"bottom"},model:{value:(_vm.showPicker),callback:function ($$v) {_vm.showPicker=$$v},expression:"showPicker"}},[_c('datetime-picker',{ref:"picker",class:_vm.popperClass,attrs:{"format":_vm.format,"value-format":_vm.valueFormat,"formatter":_vm.actualFormatter,"filter":_vm.filter,"position":"bottom","title":_vm.startTitle || _vm.$t('vue.datepicker.startDate'),"placeholder":_vm.startPlaceholder || _vm.$t('vue.datepicker.startPlaceholder'),"value":_vm.startValue,"type":_vm.type,"min-date":_vm.mMinDate,"max-date":_vm.mMaxDate,"default-pick":_vm.isArray(_vm.actualDefaultPick) ? _vm.actualDefaultPick[0] : _vm.actualDefaultPick,"confirm-button-text":_vm.confirmButtonText,"cancel-button-text":_vm.cancelButtonText,"show-toolbar":true,"item-height":_vm.itemHeight,"visible-item-count":_vm.visibleItemCount,"swipe-duration":_vm.swipeDuration},on:{"confirm":_vm.startOnConfirm,"cancel":_vm.startOnCancel,"change":_vm.startOnChange}})],1),_c('popup',{attrs:{"position":"bottom"},model:{value:(_vm.endShowPicker),callback:function ($$v) {_vm.endShowPicker=$$v},expression:"endShowPicker"}},[_c('datetime-picker',{ref:"endPicker",class:_vm.popperClass,attrs:{"format":_vm.format,"value-format":_vm.valueFormat,"formatter":_vm.actualFormatter,"filter":_vm.filter,"position":"bottom","title":_vm.endTitle || _vm.$t('vue.datepicker.endDate'),"placeholder":_vm.endPlaceholder || _vm.$t('vue.datepicker.endPlaceholder'),"value":_vm.endValue,"type":_vm.type,"min-date":_vm.mMinDate2,"max-date":_vm.mMaxDate2,"default-pick":_vm.isArray(_vm.actualDefaultPick) ? _vm.actualDefaultPick[1] : _vm.actualDefaultPick,"confirm-button-text":_vm.confirmButtonText,"cancel-button-text":_vm.cancelButtonText,"show-toolbar":true,"item-height":_vm.itemHeight,"visible-item-count":_vm.visibleItemCount,"swipe-duration":_vm.swipeDuration},on:{"confirm":_vm.endOnConfirm,"cancel":_vm.endOnCancel,"change":_vm.endOnChange}})],1)],1)])}
var datetimePickerMobilevue_type_template_id_27403015_staticRenderFns = []


// CONCATENATED MODULE: ./packages/datetime-picker/datetimePickerMobile.vue?vue&type=template&id=27403015&

// CONCATENATED MODULE: ./packages/datetime-picker/utils.ts

function times(n, iteratee) {
  var index = -1;
  var result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }

  return result;
}
function getTrueValue(value) {
  if (!value) {
    return 0;
  }

  while (number_isNaN(parseInt(value, 10))) {
    if (value.length > 1) {
      value = value.slice(1);
    } else {
      return 0;
    }
  }

  return parseInt(value, 10);
}
function getMonthEndDay(year, month) {
  return 32 - new Date(year, month - 1, 32).getDate();
}
// CONCATENATED MODULE: ./packages/datetime-picker/shared.js
function shared_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function shared_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      shared_ownKeys(Object(source), true).forEach(function (key) {
        shared_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      shared_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function shared_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}





var sharedProps = shared_objectSpread({}, pickerProps, {
  value: null,
  filter: Function,
  showToolbar: {
    type: Boolean,
    default: true
  },
  formatter: {
    type: Function,
    default: function _default(type, value) {
      return value;
    }
  },
  pickerOptions: {
    firstDayOfWeek: {
      //周起始日,可选值: 1~7
      type: Number,
      default: 7
    },
    selectableRange: {
      type: [String, Array]
    }
  },
  defaultPick: {
    type: [Date, String, Number, Array]
  }
});
var TimePickerMixin = {
  data: function data() {
    return {
      innerValue: this.formatValue(this.value)
    };
  },
  computed: {
    originColumns: function originColumns() {
      var _this = this;

      return this.ranges.map(function (_ref) {
        var type = _ref.type,
            rangeArr = _ref.range;
        var values = times(rangeArr[1] - rangeArr[0] + 1, function (index) {
          if (type == 'week') {
            return rangeArr[0] + index;
          } else {
            var value = padZero(rangeArr[0] + index);
            return value;
          }
        });

        if (_this.filter) {
          values = _this.filter(type, values);
        }

        return {
          type: type,
          values: values
        };
      });
    },
    columns: function columns() {
      var _this2 = this;

      return this.originColumns.map(function (column) {
        return {
          values: column.values.map(function (value) {
            return _this2.formatter(column.type, value, _this2.innerValue);
          })
        };
      });
    }
  },
  watch: {
    columns: 'updateColumnValue',
    innerValue: function innerValue(val) {
      this.$emit('input', val);
    }
  },
  mounted: function mounted() {
    var _this3 = this;

    if (!this.value && this.defaultPick) {
      this.innerValue = this.defaultPick;
    }

    this.updateColumnValue();
    this.$nextTick(function () {
      _this3.updateInnerValue();
    });
  },
  methods: {
    // @exposed-api
    getPicker: function getPicker() {
      return this.$refs.picker;
    },
    onConfirm: function onConfirm() {
      this.$emit('confirm', this.innerValue);
    },
    onCancel: function onCancel() {
      this.$emit('cancel');
    },
    actualFirstDayOfWeek: function actualFirstDayOfWeek() {
      return this.pickerOptions == undefined || this.pickerOptions.firstDayOfWeek == undefined ? 7 : this.pickerOptions.firstDayOfWeek % 7;
    }
  },
  render: function render() {
    var _this4 = this;

    var h = arguments[0];
    var props = {};
    Object.keys(pickerProps).forEach(function (key) {
      props[key] = _this4[key];
    });
    return h(picker, {
      "ref": "picker",
      "attrs": {
        "columns": this.columns
      },
      "on": {
        "change": this.onChange,
        "confirm": this.onConfirm,
        "cancel": this.onCancel
      },
      "props": shared_objectSpread({}, props)
    });
  }
};
function getMonthWeekNumByDate(str, actualFirstDayOfWeek) {
  str = Date.parse(str);
  var date = new Date(str);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var dateN = new Date(str); //月份第一天

  dateN = new Date(dateN.setDate(1));
  var w1 = dateN.getDay(); // 将字符串转为标准时间格式

  var w = date.getDay(); //周几
  //if(w===0&&w1!=0){//当月第一天不是周天，当前日期是周天

  if (w === actualFirstDayOfWeek && w1 != actualFirstDayOfWeek) {
    //当月第一天不是firstDayOfWeek，当前日期是firstDayOfWeek
    w = 7;
  }

  var week = Math.ceil((date.getDate() + 6 - w) / 7); //if(w1!=0){//当月第一天不是周天

  if (w1 != actualFirstDayOfWeek) {
    //当月第一天不是firstDayOfWeek
    //week = Math.ceil((date.getDate() + 6 - w) / 7) - 1;
    week = Math.ceil((date.getDate() + 6 - w) / 7);
  }

  if (week === 0) {
    //第0周归于上月的最后一周
    month = date.getMonth();

    if (month === 0) {
      //跨年
      month = 12;
      year = year - 1;
    } //const dateLast = new Date(date);


    var dayLast = new Date(year, month, 0).getDate();
    var timestamp = new Date(year, month - 1, dayLast);
    w = new Date(timestamp).getDay(); //周几
    //if (w === 0) {

    if (w === actualFirstDayOfWeek) {
      w = 7;
    }

    week = Math.ceil((timestamp.getDate() + 6 - w) / 7) - 1;
  } // week=cNum[week];
  //const time = year+"年"+month + "月第" + week + "周";
  //console.log(time);


  return week;
} //获取选中周并属于当月的范围内的该周的第一天

function getFirstDayOfWeekActualDay(year, month, weekNum, actualFirstDayOfWeek) {
  var date = new Date(); // 该月第一天

  date.setFullYear(year, month - 1, 1); //获取月份第一天是周几，周日为0

  var w1 = date.getDay(); // 该月天数

  date.setFullYear(year, month, 0); // 第一个星期日

  var d1 = 7 - w1 + 1;
  var firstDay = d1 + (weekNum - 2) * 7;
  firstDay = Math.max(firstDay, 1); //比较两者取其大

  firstDay = Math.min(firstDay, 31); //比较两者取其小

  var actualDay = firstDay + (actualFirstDayOfWeek + 1) % 7;
  return actualDay;
}
// CONCATENATED MODULE: ./packages/datetime-picker/TimePicker.js
function TimePicker_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function TimePicker_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      TimePicker_ownKeys(Object(source), true).forEach(function (key) {
        TimePicker_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      TimePicker_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function TimePicker_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function TimePicker_slicedToArray(arr, i) {
  return TimePicker_arrayWithHoles(arr) || TimePicker_iterableToArrayLimit(arr, i) || TimePicker_unsupportedIterableToArray(arr, i) || TimePicker_nonIterableRest();
}

function TimePicker_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function TimePicker_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return TimePicker_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return TimePicker_arrayLikeToArray(o, minLen);
}

function TimePicker_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function TimePicker_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function TimePicker_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}






var TimePicker_createNamespace = createNamespace('time-picker'),
    TimePicker_createNamespace2 = TimePicker_slicedToArray(TimePicker_createNamespace, 1),
    TimePicker_createComponent = TimePicker_createNamespace2[0];

var rangeStringToArr = function rangeStringToArr(range, format) {
  if (typeof range === 'string') {
    if (range.indexOf('-') > -1) {
      return range.split('-').map(function (time) {
        return VueUtil.parseDate(time.trim(), format);
      });
    } else {
      return VueUtil.parseDate(range.trim(), format);
    }
  }

  return range;
};

/* harmony default export */ var TimePicker = (TimePicker_createComponent({
  mixins: [TimePickerMixin],
  data: function data() {
    return {
      minHour: 0,
      maxHour: 23,
      minMinute: 0,
      maxMinute: 59,
      minSecond: 0,
      maxSecond: 59
    };
  },
  props: TimePicker_objectSpread({}, sharedProps, {
    format: {
      type: String,
      default: "HH:mm:ss"
    }
  }),
  computed: {
    selectable: function selectable() {
      var _this = this;

      if (this.pickerOptions.selectableRange) {
        if (typeof this.pickerOptions.selectableRange == 'string') {
          return rangeStringToArr(this.pickerOptions.selectableRange, this.format);
        }

        return this.pickerOptions.selectableRange.map(function (r) {
          return rangeStringToArr(r, _this.format);
        });
      }

      return [];
    },
    minTime: function minTime() {
      return this.selectable[0] ? this.selectable[0] : VueUtil.parseDate('00:00:00', 'HH:mm:ss');
    },
    maxTime: function maxTime() {
      return this.selectable[1] ? this.selectable[1] : VueUtil.parseDate('23:59:59', 'HH:mm:ss');
    },
    ranges: function ranges() {
      var hourRange = {
        type: 'hour',
        range: [this.minHour, this.maxHour]
      };
      var minuteRange = {
        type: 'minute',
        range: [this.minMinute, this.maxMinute]
      };
      var secondRange = {
        type: 'second',
        range: [this.minSecond, this.maxSecond]
      };
      var resultData = [];
      if (this.format.indexOf("HH") >= 0) resultData.push(hourRange);
      if (this.format.indexOf("mm") >= 0) resultData.push(minuteRange);
      if (this.format.indexOf("ss") >= 0) resultData.push(secondRange);
      return resultData;
    }
  },
  watch: {
    filter: 'updateInnerValue',
    minHour: 'updateInnerValue',
    maxHour: 'updateInnerValue',
    minMinute: 'updateInnerValue',
    maxMinute: 'updateInnerValue',
    minSecond: 'updateInnerValue',
    maxSecond: 'updateInnerValue',
    pickerOptions: {
      deep: true,
      handler: function handler() {
        this.updateInnerValue();
      }
    },
    value: function value(val) {
      // 清空后值为null，不重新设置picker的选中项
      if (val === null) return;
      val = this.formatValue(val);

      if (val !== this.innerValue) {
        this.innerValue = val;
        this.updateColumnValue();
      }
    }
  },
  methods: {
    formatValue: function formatValue(value) {
      if (!value) {
        var currDate = new Date(); //设置默认时间为当前时间

        var _hour = currDate.getHours();

        var _minute = currDate.getMinutes();

        var _second = currDate.getSeconds();

        value = "".concat(padZero(_hour), ":").concat(padZero(_minute), ":").concat(padZero(_second)); // value = `${padZero(this.minHour)}:${padZero(this.minMinute)}:${padZero(this.minSecond)}`;
      }

      var _value$split = value.split(':'),
          _value$split2 = TimePicker_slicedToArray(_value$split, 3),
          hour = _value$split2[0],
          minute = _value$split2[1],
          second = _value$split2[2];

      hour = hour ? padZero(range(hour, this.minHour || 0, this.maxHour || 23)) : undefined;
      minute = minute ? padZero(range(minute, this.minMinute || 0, this.maxMinute || 59)) : undefined;
      second = second ? padZero(range(second, this.minSecond || 0, this.maxSecond || 59)) : undefined;
      var result = hour ? "".concat(hour) : "";
      result += minute ? ":".concat(minute) : "";
      result += second ? ":".concat(second) : "";
      return result;
    },
    updateInnerValue: function updateInnerValue() {
      var hour,
          minute,
          second = undefined;
      this.minHour = 0;
      this.maxHour = 23;
      this.minMinute = 0;
      this.maxMinute = 59;
      this.minSecond = 0;
      this.maxSecond = 59;

      for (var i = 0; i < this.originColumns.length; i++) {
        var tmpType = this.originColumns[i].type;
        var tmpVal = this.getPicker().getValues()[i].replace(/[^0-9]/ig, ""); //parseInt(this.getPicker().getValues()[i])?parseInt(this.getPicker().getValues()[i]):"00";

        if (tmpType == "hour") {
          hour = tmpVal;
          this.maxHour = this.maxTime.getHours();
          this.minHour = this.minTime.getHours();

          if (parseInt(hour) <= this.minHour) {
            this.minMinute = this.minTime.getMinutes();
          }

          if (parseInt(hour) >= this.maxHour) {
            this.maxMinute = this.maxTime.getMinutes();
          }
        } else if (tmpType == "minute") {
          minute = tmpVal;

          if (parseInt(hour) <= this.minHour && parseInt(minute) <= this.minMinute) {
            this.minSecond = this.minTime.getSeconds();
          }

          if (parseInt(hour) >= this.maxHour && parseInt(minute) >= this.maxMinute) {
            this.maxSecond = this.maxTime.getSeconds();
          }
        } else if (tmpType == "second") {
          second = tmpVal;
        }
      }

      var formatData = hour ? "".concat(hour) : "";
      formatData += minute ? ":".concat(minute) : "";
      formatData += second ? ":".concat(second) : "";
      this.innerValue = this.formatValue(formatData);
      this.updateColumnValue();
    },
    onChange: function onChange(picker) {
      var _this2 = this;

      this.updateInnerValue();
      this.$nextTick(function () {
        _this2.$nextTick(function () {
          _this2.$emit('change', picker);
        });
      });
    },
    updateColumnValue: function updateColumnValue() {
      var _this3 = this;

      var formatter = this.formatter;
      var pair = this.innerValue.split(':');
      var values = [];
      if (pair[0]) values.push(formatter('hour', pair[0], pair));
      if (pair[1]) values.push(formatter('minute', pair[1], pair));
      if (pair[2]) values.push(formatter('second', pair[2], pair));
      this.$nextTick(function () {
        _this3.getPicker().setValues(values);
      });
    }
  }
}));
// CONCATENATED MODULE: ./packages/utils/validate/date.ts

function isDate(val) {
  return Object.prototype.toString.call(val) === '[object Date]' && !number_isNaN(val.getTime());
}
// CONCATENATED MODULE: ./packages/datetime-picker/DatePicker.js
function DatePicker_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function DatePicker_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      DatePicker_ownKeys(Object(source), true).forEach(function (key) {
        DatePicker_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      DatePicker_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function DatePicker_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function DatePicker_slicedToArray(arr, i) {
  return DatePicker_arrayWithHoles(arr) || DatePicker_iterableToArrayLimit(arr, i) || DatePicker_unsupportedIterableToArray(arr, i) || DatePicker_nonIterableRest();
}

function DatePicker_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function DatePicker_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return DatePicker_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return DatePicker_arrayLikeToArray(o, minLen);
}

function DatePicker_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function DatePicker_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function DatePicker_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}






var currentYear = new Date().getFullYear();

var DatePicker_createNamespace = createNamespace('date-picker'),
    DatePicker_createNamespace2 = DatePicker_slicedToArray(DatePicker_createNamespace, 1),
    DatePicker_createComponent = DatePicker_createNamespace2[0];

/* harmony default export */ var DatePicker = (DatePicker_createComponent({
  mixins: [TimePickerMixin],
  props: DatePicker_objectSpread({}, sharedProps, {
    type: {
      type: String,
      default: 'date'
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    valueFormat: {
      //针对的是绑定值value的格式定义
      type: String
    },
    minDate: {
      type: Date,
      default: function _default() {
        return new Date(currentYear - 100, 0, 1);
      },
      validator: isDate
    },
    maxDate: {
      type: Date,
      default: function _default() {
        return new Date(currentYear + 100, 11, 31);
      },
      validator: isDate
    }
  }),
  watch: {
    filter: 'updateInnerValue',
    minDate: 'updateInnerValue',
    maxDate: 'updateInnerValue',
    value: function value(val) {
      // 清空后值为null，不重新设置picker的选中项
      if (val === null) return;
      val = this.formatValue(val);

      if (val.valueOf() !== this.innerValue.valueOf()) {
        this.innerValue = val;
      }
    }
  },
  computed: {
    ranges: function ranges() {
      var _this$getBoundary = this.getBoundary('max', this.innerValue),
          maxYear = _this$getBoundary.maxYear,
          maxDate = _this$getBoundary.maxDate,
          maxMonth = _this$getBoundary.maxMonth,
          maxHour = _this$getBoundary.maxHour,
          maxMinute = _this$getBoundary.maxMinute,
          maxSecond = _this$getBoundary.maxSecond;

      var _this$getBoundary2 = this.getBoundary('min', this.innerValue),
          minYear = _this$getBoundary2.minYear,
          minDate = _this$getBoundary2.minDate,
          minMonth = _this$getBoundary2.minMonth,
          minHour = _this$getBoundary2.minHour,
          minMinute = _this$getBoundary2.minMinute,
          minSecond = _this$getBoundary2.minSecond;

      var result = [{
        type: 'year',
        range: [minYear, maxYear]
      }, {
        type: 'month',
        range: [minMonth, maxMonth]
      }, {
        type: 'day',
        range: [minDate, maxDate]
      }, {
        type: 'hour',
        range: [minHour, maxHour]
      }, {
        type: 'minute',
        range: [minMinute, maxMinute]
      }, {
        type: 'second',
        range: [minSecond, maxSecond]
      }];
      if (this.type === 'year') result.splice(1, 5);
      if (this.type === 'month' || this.type === 'monthrange') result.splice(2, 4);
      if (this.type === 'date' || this.type === 'daterange') result.splice(3, 3);

      if (this.type === 'week') {
        result.splice(2, 4);
        result.push({
          type: 'week',
          range: [1, this.getMonthWeekCount(this.innerValue.getFullYear(), this.innerValue.getMonth() + 1)]
        });
      }

      if ((this.type === 'month' || this.type === 'monthrange') && this.format != "yyyy-MM" || (this.type === 'date' || this.type === 'daterange') && this.format != "yyyy-MM-dd" || (this.type === 'datetime' || this.type === 'datetimerange') && this.format != "yyyy-MM-dd HH:mm:ss") {
        for (var i = result.length - 1; i >= 0; i--) {
          var currType = result[i].type;

          if (currType == "second" && this.format.indexOf("ss") < 0) {
            result.splice(i, 1);
          } else if (currType == "minute" && this.format.indexOf("mm") < 0) {
            result.splice(i, 1);
          } else if (currType == "hour" && this.format.indexOf("HH") < 0) {
            result.splice(i, 1);
          } else if (currType == "day" && this.format.indexOf("dd") < 0) {
            result.splice(i, 1);
          } else if (currType == "month" && this.format.indexOf("MM") < 0) {
            result.splice(i, 1);
          } else if (currType == "year" && this.format.indexOf("yy") < 0) {
            result.splice(i, 1);
          }
        }
      }

      return result;
    }
  },
  methods: {
    formatValue: function formatValue(value) {
      if (!value || typeof value == "string" && VueUtil.isEmpty(value)) {
        value = new Date();
      } else if (value && typeof value == "string" && !VueUtil.isEmpty(value)) {
        if (this.type == "week" && this.valueFormat) {
          var vals = value.match(/\d+/g);
          var date = VueUtil.parseDate(value, this.valueFormat);
          var year = date.getFullYear();
          var month = date.getMonth();
          var weekNum = vals[vals.length - 1];
          var day = getFirstDayOfWeekActualDay(year, month, weekNum, this.actualFirstDayOfWeek());
          value = new Date(year, month, day);
        } else {
          value = VueUtil.parseDate(value, this.valueFormat);
        }
      }

      value = Math.max(value, this.minDate.getTime()); //比较两者取其大

      value = Math.min(value, this.maxDate.getTime()); //比较两者取其小

      return new Date(value);
    },
    getBoundary: function getBoundary(type, value) {
      var _ref;

      var boundary = this["".concat(type, "Date")];
      var year = boundary.getFullYear();
      var month = 1;
      var date = 1;
      var hour = 0;
      var minute = 0;
      var second = 0;

      if (type === 'max') {
        month = 12;
        date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
        hour = 23;
        minute = 59;
        second = 59;
      }

      if (value.getFullYear() === year) {
        month = boundary.getMonth() + 1;

        if (value.getMonth() + 1 === month) {
          date = boundary.getDate();

          if (value.getDate() === date) {
            hour = boundary.getHours();

            if (value.getHours() === hour) {
              minute = boundary.getMinutes();
            }

            if (value.getMinutes() === minute) {
              second = boundary.getSeconds();
            }
          }
        }
      }

      return _ref = {}, DatePicker_defineProperty(_ref, "".concat(type, "Year"), year), DatePicker_defineProperty(_ref, "".concat(type, "Month"), month), DatePicker_defineProperty(_ref, "".concat(type, "Date"), date), DatePicker_defineProperty(_ref, "".concat(type, "Hour"), hour), DatePicker_defineProperty(_ref, "".concat(type, "Minute"), minute), DatePicker_defineProperty(_ref, "".concat(type, "Second"), second), _ref;
    },
    updateInnerValue: function updateInnerValue() {
      var year,
          month,
          day,
          hour,
          minute,
          second,
          week = undefined;

      for (var i = 0; i < this.originColumns.length; i++) {
        var tmpType = this.originColumns[i].type;
        var tmpVal = this.getPicker().getValues()[i].replace(/[^0-9]/ig, ""); //parseInt(this.getPicker().getValues()[i]);

        if (tmpType == "year") {
          year = tmpVal;
        } else if (tmpType == "month") {
          month = tmpVal;
        } else if (tmpType == "day") {
          var maxDay = year && month ? getMonthEndDay(year, month) : 31;
          day = tmpVal;
          day = day > maxDay ? maxDay : day;
        } else if (tmpType == "hour") {
          hour = tmpVal;
        } else if (tmpType == "minute") {
          minute = tmpVal;
        } else if (tmpType == "second") {
          second = tmpVal;
        } else if (tmpType == "week") {
          week = tmpVal;
          var weekNum = this.getMonthWeekCount(year, month);
          day = getFirstDayOfWeekActualDay(year, month, week > weekNum ? weekNum : week, this.actualFirstDayOfWeek());
        }
      }

      var value = !day ? new Date(year ? year : currentYear, month ? month - 1 : 0) : hour == undefined ? new Date(year ? year : currentYear, month ? month - 1 : 0, day) : minute == undefined ? new Date(year ? year : currentYear, month ? month - 1 : 0, day, hour) : second == undefined ? new Date(year ? year : currentYear, month ? month - 1 : 0, day, hour, minute) : new Date(year ? year : currentYear, month ? month - 1 : 0, day, hour, minute, second);
      this.innerValue = this.formatValue(value);
    },
    onChange: function onChange(picker) {
      var _this = this;

      this.updateInnerValue();
      this.$nextTick(function () {
        _this.$nextTick(function () {
          _this.$emit('change', picker);
        });
      });
    },
    updateColumnValue: function updateColumnValue() {
      var _this2 = this;

      var value = this.innerValue;
      var formatter = this.formatter;
      var initValues = [{
        year: formatter('year', "".concat(value.getFullYear()), value)
      }, {
        month: formatter('month', padZero(value.getMonth() + 1), value)
      }];

      if (this.type === 'week') {
        initValues.push({
          week: formatter('week', getMonthWeekNumByDate(value, this.actualFirstDayOfWeek()), value)
        });
      } else if (this.type !== 'month' && this.type !== 'monthrange') {
        initValues.push({
          day: formatter('day', padZero(value.getDate()), value)
        });

        if (this.type === 'datetime' || this.type === 'datetimerange') {
          initValues.push({
            hour: formatter('hour', padZero(value.getHours()), value)
          });
          initValues.push({
            minute: formatter('minute', padZero(value.getMinutes()), value)
          });
          initValues.push({
            second: formatter('second', padZero(value.getSeconds()), value)
          });
        }
      }

      var values = [];

      for (var i = 0; i < initValues.length; i++) {
        var tmpVal = initValues[i];

        if (tmpVal.year && (!this.format || this.format && this.format.indexOf("yy") >= 0)) {
          values.push(tmpVal.year);
        } else if (tmpVal.month && (!this.format || this.format && this.format.indexOf("MM") >= 0)) {
          values.push(tmpVal.month);
        } else if (tmpVal.week) {
          values.push(tmpVal.week);
        } else if (tmpVal.day && (!this.format || this.format && this.format.indexOf("dd") >= 0)) {
          values.push(tmpVal.day);
        } else if (tmpVal.hour && (!this.format || this.format && this.format.indexOf("HH") >= 0)) {
          values.push(tmpVal.hour);
        } else if (tmpVal.minute && (!this.format || this.format && this.format.indexOf("mm") >= 0)) {
          values.push(tmpVal.minute);
        } else if (tmpVal.second && (!this.format || this.format && this.format.indexOf("ss") >= 0)) {
          values.push(tmpVal.second);
        }
      }

      this.$nextTick(function () {
        _this2.getPicker().setValues(values);
      });
    },
    getMonthWeekCount: function getMonthWeekCount(year, month) {
      var date = new Date(); // 该月第一天

      date.setFullYear(year, month - 1, 1); //获取月份第一天是周几，周日为0

      var w1 = date.getDay(); // 该月天数

      date.setFullYear(year, month, 0);
      var days = date.getDate(); //要减去开头的几天

      var first = 0;
      w1 == 0 ? first = 1 : first = 8 - w1;
      days = days - first;
      var weekCount = 1 + Math.ceil(days / 7);
      return weekCount;
    }
  }
}));
// CONCATENATED MODULE: ./packages/datetime-picker/index.js
function datetime_picker_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function datetime_picker_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      datetime_picker_ownKeys(Object(source), true).forEach(function (key) {
        datetime_picker_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      datetime_picker_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function datetime_picker_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function datetime_picker_slicedToArray(arr, i) {
  return datetime_picker_arrayWithHoles(arr) || datetime_picker_iterableToArrayLimit(arr, i) || datetime_picker_unsupportedIterableToArray(arr, i) || datetime_picker_nonIterableRest();
}

function datetime_picker_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function datetime_picker_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return datetime_picker_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return datetime_picker_arrayLikeToArray(o, minLen);
}

function datetime_picker_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function datetime_picker_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function datetime_picker_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}





var datetime_picker_createNamespace = createNamespace('datetime-picker'),
    datetime_picker_createNamespace2 = datetime_picker_slicedToArray(datetime_picker_createNamespace, 2),
    datetime_picker_createComponent = datetime_picker_createNamespace2[0],
    datetime_picker_bem = datetime_picker_createNamespace2[1];

/* harmony default export */ var datetime_picker = (datetime_picker_createComponent({
  props: datetime_picker_objectSpread({}, TimePicker.props, {}, DatePicker.props),
  methods: {
    // @exposed-api
    getPicker: function getPicker() {
      return this.$refs.root.getPicker();
    }
  },
  render: function render() {
    var h = arguments[0];
    var Component = this.type === 'time' ? TimePicker : DatePicker;
    return h(Component, {
      "ref": "root",
      "class": datetime_picker_bem(),
      "props": datetime_picker_objectSpread({}, this.$props),
      "on": datetime_picker_objectSpread({}, this.$listeners)
    });
  }
}));
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/datetime-picker/datetimePickerMobile.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ var datetimePickerMobilevue_type_script_lang_js_ = ({
  name: 'VueDatePickerMobile',
  components: {
    DatetimePicker: datetime_picker,
    Popup: packages_popup
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String
    },
    placeholder: {
      type: String
    },
    startPlaceholder: {
      type: String,
      default: ''
    },
    endPlaceholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'date'
    },
    format: {
      //针对的是input最终显示值的格式定义和时间选项的格式定义
      type: String
    },
    popperClass: {
      //下拉框类名
      type: String
    },
    rangeSeparator: {
      //选择范围时的分隔符
      type: String,
      default: '-'
    },
    valueFormat: {
      //针对的是绑定值value的格式定义
      type: String
    },
    pickerOptions: {},
    value: {
      //选择器当前选中值(通过v-model双向绑定使用)
      type: [Date, String, Number, Array]
    },
    textAlign: {
      //输入框文字水平对齐方式,当为区间类型时文本默认居中对齐，否则默认居左对齐
      type: String
    },
    minDate: {
      //选择器可选范围的最小日期
      type: Date
    },
    maxDate: {
      //选择器可选范围的最大日期
      type: Date
    },
    prefixIcon: {
      //组件最左侧图标的设置
      type: String
    },
    clearIcon: {
      //组件最右侧内容清空图标的设置
      type: String,
      default: 'vue-icon-close'
    },
    title: {
      type: String,
      default: ''
    },
    startTitle: {
      type: String,
      default: ''
    },
    endTitle: {
      type: String,
      default: ''
    },
    confirmButtonText: {
      type: String,
      default: ''
    },
    cancelButtonText: {
      type: String,
      default: ''
    },
    itemHeight: {
      type: [String, Number]
    },
    visibleItemCount: {
      // 可见的选项个数
      type: Number,
      default: 5
    },
    swipeDuration: {
      // 快速滑动时惯性滚动的时长，单位ms
      type: [String, Number],
      default: 1000
    },
    formatter: {
      type: Function
    },
    filter: {
      type: Function
    },
    defaultPick: {
      type: [Date, String, Number, Array]
    }
  },
  mounted: function mounted() {//this.showPicker = false;
    //this.endShowPicker = false;
  },
  data: function data() {
    return {
      showPicker: false,
      endShowPicker: false,
      fieldValue: '',
      endFieldValue: '',
      startValue: '',
      endValue: '',
      mMinDate: this.minDate,
      mMaxDate: this.maxDate,
      mMinDate2: this.minDate ? this.minDate : undefined,
      mMaxDate2: this.maxDate ? this.maxDate : undefined
    };
  },
  methods: {
    handleClickIcon: function handleClickIcon(event) {
      if (this.disabled) {
        return;
      }

      this.fieldValue = '';
      this.endFieldValue = '';
      this.startValue = null;
      this.endValue = null;
      event.stopPropagation();
      this.$emit('change', null);
      this.$emit('input', null);
    },
    actualFormatter: function actualFormatter(type, val, date) {
      if (this.formatter) {
        return this.formatter(type, val, date);
      }

      if (type === 'week') {
        return this.$t('vue.datepicker.weekNumber', {
          number: val
        });
      }

      return val;
    },
    onClick: function onClick() {
      if (!this.disabled) {
        this.mMinDate = this.minDate;
        if (this.endFieldValue) this.mMaxDate = VueUtil.parseDate(this.endFieldValue, this.actualFormat);else this.mMaxDate = this.maxDate;
        this.showPicker = true;
      }
    },
    onConfirm: function onConfirm(value, index) {
      this.showPicker = false;
      var actualValue = this.valueFormat && VueUtil.isDate(value) ? VueUtil.formatDate(value, this.valueFormat) : value;

      if (this.type === 'week' && VueUtil.isDate(value) && this.valueFormat) {
        actualValue = this.formatWeekValueByDate(value);
      }

      this.$emit('input', actualValue);
      this.$emit('change', actualValue);
      this.$emit('confirm', value, index);
    },
    onCancel: function onCancel(value, index) {
      this.showPicker = false;
      this.$emit('cancel', value, index);
    },
    endOnClick: function endOnClick() {
      if (!this.disabled) {
        if (this.fieldValue) this.mMinDate2 = VueUtil.parseDate(this.fieldValue, this.actualFormat);else this.mMinDate2 = this.minDate;
        this.mMaxDate2 = this.maxDate;
        this.endShowPicker = true;
      }
    },
    emitRangeChange: function emitRangeChange(value) {
      if (value[0] && value[1]) {
        this.$emit('change', value);
      }
    },
    startOnConfirm: function startOnConfirm(value, index) {
      if (this.endValue && new Date(value).getTime() > new Date(this.endValue).getTime()) {
        console.error('The start date cannot be later than the end date!');
        return;
      }

      this.showPicker = false;
      var actualValue = this.valueFormat && VueUtil.isDate(value) ? [VueUtil.formatDate(value, this.valueFormat), this.endValue] : [value, this.endValue];
      this.$emit('input', actualValue);
      this.emitRangeChange(actualValue);
      this.$emit('start-confirm', value, index);
    },
    startOnCancel: function startOnCancel(value, index) {
      this.showPicker = false;
      this.$emit('start-cancel', value, index);
    },
    startOnChange: function startOnChange(picker, value, index) {
      this.$emit('start-change', picker, value, index);
    },
    endOnConfirm: function endOnConfirm(value, index) {
      if (this.startValue && new Date(value).getTime() < new Date(this.startValue).getTime()) {
        console.error('The end date cannot be earlier than the start date!');
        return;
      }

      this.endShowPicker = false;
      var actualValue = this.valueFormat && VueUtil.isDate(value) ? [this.startValue, VueUtil.formatDate(value, this.valueFormat)] : [this.startValue, value];
      this.$emit('input', actualValue);
      this.emitRangeChange(actualValue);
      this.$emit('end-confirm', value, index);
    },
    endOnCancel: function endOnCancel(value, index) {
      this.endShowPicker = false;
      this.$emit('end-cancel', value, index);
    },
    endOnChange: function endOnChange(picker, value, index) {
      this.$emit('end-change', picker, value, index);
    },
    formatWeekValueByDate: function formatWeekValueByDate(val) {
      var date = val;
      var year = date.getFullYear();
      var str = "";
      var yearWeekNum = VueUtil.getWeekNumber(date);

      if (this.valueFormat.indexOf('MM') >= 0 && this.valueFormat.indexOf('ww') >= 0) {
        var month = padZero(date.getMonth() + 1);
        var monthWeekNum = getMonthWeekNumByDate(date, this.actualFirstDayOfWeek);
        str = this.valueFormat.replace('yyyy', year);
        str = this.valueFormat.indexOf('yyyy') >= 0 ? str.replace('MM', month) : this.valueFormat.replace('MM', month);
        str = this.valueFormat.indexOf('MM') >= 0 ? str.replace('ww', monthWeekNum) : this.valueFormat.replace('ww', monthWeekNum);
      } else {
        str = this.valueFormat.replace('yyyy', year);
        str = this.valueFormat.indexOf('yyyy') >= 0 ? str.replace('WW', yearWeekNum) : this.valueFormat.replace('WW', yearWeekNum);
      }

      return str;
    },
    isArray: Array.isArray
  },
  watch: {
    value: {
      handler: function handler(val) {
        if (VueUtil.isArray(val)) {
          var startVal = val[0];
          var endVal = val[1];
          this.startValue = this.valueFormat && startVal && VueUtil.isDate(startVal) ? VueUtil.formatDate(startVal, this.valueFormat) : startVal;

          if (startVal) {
            if (VueUtil.isDate(startVal)) {
              this.fieldValue = VueUtil.formatDate(startVal, this.actualFormat);
            } else {
              this.fieldValue = VueUtil.formatDate(VueUtil.parseDate(startVal, this.valueFormat), this.actualFormat);
            }
          } else {
            this.fieldValue = startVal;
          }

          this.endValue = this.valueFormat && endVal && VueUtil.isDate(endVal) ? VueUtil.formatDate(endVal, this.valueFormat) : endVal;

          if (endVal) {
            if (VueUtil.isDate(endVal)) {
              this.endFieldValue = VueUtil.formatDate(endVal, this.actualFormat);
            } else {
              this.endFieldValue = VueUtil.formatDate(VueUtil.parseDate(endVal, this.valueFormat), this.actualFormat);
            }
          } else {
            this.endFieldValue = endVal;
          }
        } else if (this.type === 'week') {
          var str = val;

          if (VueUtil.isDate(val)) {
            var year = val.getFullYear();
            var yearWeekNum = VueUtil.getWeekNumber(val);

            if (this.format) {
              if (this.format.indexOf('MM') >= 0 && this.format.indexOf('ww') >= 0) {
                var month = val.getMonth() + 1;
                var monthWeekNum = getMonthWeekNumByDate(val, this.actualFirstDayOfWeek);

                if (this.format.indexOf('yy') >= 0) {
                  if (this.format.indexOf('yyyy') >= 0) {
                    str = this.format.replace('yyyy', year);
                  } else {
                    str = this.format.replace('yy', String(year).substr(2));
                  }
                }

                str = str.replace('MM', month);
                this.fieldValue = str.replace('ww', monthWeekNum);
              } else {
                str = this.format.indexOf('yy') >= 0 && this.format.indexOf('yyyy') < 0 ? this.format.replace('yy', String(year).substr(2)) : this.format.replace('yyyy', year);
                this.fieldValue = str.replace('WW', yearWeekNum);
              }
            } else {
              this.fieldValue = this.$t('vue.datepicker.defaultWeekFormat', {
                year: year,
                yearWeekNum: yearWeekNum
              });
            }
          } else if (val && this.format && this.valueFormat && this.format != this.valueFormat) {
            var vals = val.match(/\d+/g);
            var date = VueUtil.parseDate(val, this.valueFormat);

            var _year = date.getFullYear();

            var _month = date.getMonth() + 1;

            var weekNum = vals[vals.length - 1];

            if (this.format.indexOf('yy') >= 0) {
              if (this.format.indexOf('yyyy') >= 0) {
                str = this.format.replace('yyyy', _year);
              } else {
                str = this.format.replace('yy', String(_year).substr(2));
              }
            }

            str = str.replace('MM', _month);
            this.fieldValue = str && this.format.indexOf('ww') >= 0 ? str.replace('ww', weekNum) : str && this.format.indexOf('WW') >= 0 ? str.replace('WW', weekNum) : str;
          } else {
            this.fieldValue = val;
          }
        } else {
          val = this.valueFormat && val && !VueUtil.isDate(val) ? VueUtil.parseDate(val, this.valueFormat) : val;
          this.fieldValue = VueUtil.formatDate(val, this.actualFormat);
        }
      },
      immediate: true
    }
  },
  computed: {
    showClose: function showClose() {
      if (this.disabled) return false;
      if (!this.clearable) return false;

      if (VueUtil.isArray(this.value)) {
        return this.value && this.value.length > 0;
      }

      return this.value ? true : false;
    },
    isRange: function isRange() {
      if (this.type === 'daterange' || this.type === 'datetimerange' || this.type === 'monthrange') {
        return true;
      }

      return false;
    },
    actualFormat: function actualFormat() {
      if (this.type === 'week') {
        return 'yyyy-MM-dd';
      }

      if (this.format) {
        return this.format;
      }

      var fmt = 'yyyy-MM-dd';

      if (this.type === 'year') {
        fmt = 'yyyy';
      } else if (this.type === 'month' || this.type === 'monthrange') {
        fmt = 'yyyy-MM';
      } else if (this.type === 'date' || this.type === 'daterange') {
        fmt = 'yyyy-MM-dd';
      } else if (this.type === 'datetime' || this.type === 'datetimerange') {
        fmt = 'yyyy-MM-dd HH:mm:ss';
      } else {
        console.error('type of "' + this.type + '" is invalid!');
      }

      return fmt;
    },
    actualFirstDayOfWeek: function actualFirstDayOfWeek() {
      return this.pickerOptions == undefined || this.pickerOptions.firstDayOfWeek == undefined ? 7 : this.pickerOptions.firstDayOfWeek % 7;
    },
    triggerClass: function triggerClass() {
      return this.prefixIcon || (this.type.indexOf('time') !== -1 ? 'vue-icon-time' : 'vue-icon-date');
    },
    actualTextAlign: function actualTextAlign() {
      return this.textAlign ? this.textAlign : this.isRange ? 'center' : 'left';
    },
    actualDefaultPick: function actualDefaultPick() {
      var _this = this;

      if (this.defaultPick && this.valueFormat) {
        if (Array.isArray(this.defaultPick)) {
          return this.defaultPick.map(function (defaultPick) {
            return VueUtil.parseDate(defaultPick, _this.valueFormat);
          });
        } else if (typeof this.defaultPick === 'string' || typeof this.defaultPick === 'number') {
          return VueUtil.parseDate(this.defaultPick, this.valueFormat);
        }
      }

      return this.defaultPick;
    }
  }
});
// CONCATENATED MODULE: ./packages/datetime-picker/datetimePickerMobile.vue?vue&type=script&lang=js&
 /* harmony default export */ var datetime_picker_datetimePickerMobilevue_type_script_lang_js_ = (datetimePickerMobilevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/datetime-picker/datetimePickerMobile.vue





/* normalize component */

var datetimePickerMobile_component = normalizeComponent(
  datetime_picker_datetimePickerMobilevue_type_script_lang_js_,
  datetimePickerMobilevue_type_template_id_27403015_render,
  datetimePickerMobilevue_type_template_id_27403015_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var datetimePickerMobile = (datetimePickerMobile_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/datetime-picker/timePicker.vue?vue&type=script&lang=js&
//
/* harmony default export */ var timePickervue_type_script_lang_js_ = ({
  name: 'VueTimePicker',
  props: {
    //true:显示移动端UI;false:显示 Viy PC端 Ui
    showMobileUi: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {};
  },
  render: function render(h) {
    var _this = this;

    var slots = this.$slots ? Object.keys(this.$slots).reduce(function (arr, key) {
      return arr.concat(_this.$slots[key]);
    }, []).map(function (vnode) {
      vnode.context = _this._self;
      return vnode;
    }) : null;
    return h(this.showMobileUi ? 'VueTimePickerMobile' : 'VueTimePickerViy', {
      //props: this.$props,
      attrs: this.$attrs,
      scopedSlots: this.$scopedSlots,
      on: this.$listeners
    }, slots);
  },
  methods: {},
  watch: {},
  computed: {}
});
// CONCATENATED MODULE: ./packages/datetime-picker/timePicker.vue?vue&type=script&lang=js&
 /* harmony default export */ var datetime_picker_timePickervue_type_script_lang_js_ = (timePickervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/datetime-picker/timePicker.vue
var timePicker_render, timePicker_staticRenderFns




/* normalize component */

var timePicker_component = normalizeComponent(
  datetime_picker_timePickervue_type_script_lang_js_,
  timePicker_render,
  timePicker_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var timePicker = (timePicker_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"a9e78e98-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/datetime-picker/timePickerMobile.vue?vue&type=template&id=6355098f&
var timePickerMobilevue_type_template_id_6355098f_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(!_vm.isRange)?_c('div',[_c('vue-input',{attrs:{"value":_vm.fieldValue,"readonly":true,"disabled":_vm.disabled,"clickable":true,"clearable":_vm.clearable,"size":_vm.size,"placeholder":_vm.placeholder,"text-align":_vm.actualTextAlign,"icon":_vm.showClose ? '' + _vm.clearIcon : '',"on-icon-click":_vm.handleClickIcon},nativeOn:{"click":function($event){return _vm.onClick($event)}}},[_c('i',{class:['vue-input__icon',_vm.triggerClass],attrs:{"slot":"prefix"},slot:"prefix"})]),_c('popup',{attrs:{"position":"bottom"},model:{value:(_vm.showPicker),callback:function ($$v) {_vm.showPicker=$$v},expression:"showPicker"}},[_c('time-picker',{ref:"picker",class:_vm.popperClass,attrs:{"format":_vm.format,"formatter":_vm.formatter,"filter":_vm.filter,"position":"bottom","title":_vm.title,"value":_vm.actualValue,"type":"time","default-pick":_vm.actualDefaultPick,"confirm-button-text":_vm.confirmButtonText,"cancel-button-text":_vm.cancelButtonText,"show-toolbar":true,"item-height":_vm.itemHeight,"visible-item-count":_vm.visibleItemCount,"swipe-duration":_vm.swipeDuration,"picker-options":_vm.pickerOptions},on:{"confirm":_vm.onConfirm,"cancel":_vm.onCancel,"change":_vm.onChange}})],1)],1):_c('div',{staticStyle:{"background-color":"#fff"}},[_c('vue-input',{staticStyle:{"width":"48%"},attrs:{"value":_vm.fieldValue,"readonly":true,"disabled":_vm.disabled,"placeholder":_vm.startPlaceholder || _vm.$t('vue.datepicker.startPlaceholder'),"clickable":true,"clearable":_vm.clearable,"size":_vm.size,"text-align":_vm.actualTextAlign},nativeOn:{"click":function($event){return _vm.onClick($event)}}},[_c('i',{class:['vue-input__icon',_vm.triggerClass],attrs:{"slot":"prefix"},slot:"prefix"})]),_c('span',[_vm._v(_vm._s(_vm.rangeSeparator))]),_c('vue-input',{staticStyle:{"width":"48%"},attrs:{"value":_vm.endFieldValue,"readonly":true,"disabled":_vm.disabled,"clickable":true,"clearable":_vm.clearable,"size":_vm.size,"placeholder":_vm.endPlaceholder || _vm.$t('vue.datepicker.endPlaceholder'),"text-align":_vm.actualTextAlign,"icon":_vm.showClose ? '' + _vm.clearIcon : '',"on-icon-click":_vm.handleClickIcon},nativeOn:{"click":function($event){return _vm.endOnClick($event)}}}),_c('popup',{attrs:{"position":"bottom"},model:{value:(_vm.showPicker),callback:function ($$v) {_vm.showPicker=$$v},expression:"showPicker"}},[_c('time-picker',{ref:"picker",class:_vm.popperClass,attrs:{"format":_vm.format,"formatter":_vm.formatter,"filter":_vm.filter,"position":"bottom","title":_vm.startTitle || _vm.$t('vue.datepicker.startTime'),"placeholder":_vm.startPlaceholder || _vm.$t('vue.datepicker.startPlaceholder'),"value":_vm.startValue,"type":"time","default-pick":_vm.isArray(_vm.actualDefaultPick) ? _vm.actualDefaultPick[0] : _vm.actualDefaultPick,"confirm-button-text":_vm.confirmButtonText,"cancel-button-text":_vm.cancelButtonText,"show-toolbar":true,"item-height":_vm.itemHeight,"visible-item-count":_vm.visibleItemCount,"swipe-duration":_vm.swipeDuration,"picker-options":_vm.startPickerOptions},on:{"confirm":_vm.startOnConfirm,"cancel":_vm.startOnCancel,"change":_vm.startOnChange}})],1),_c('popup',{attrs:{"position":"bottom"},model:{value:(_vm.endShowPicker),callback:function ($$v) {_vm.endShowPicker=$$v},expression:"endShowPicker"}},[_c('time-picker',{ref:"endPicker",class:_vm.popperClass,attrs:{"format":_vm.format,"formatter":_vm.formatter,"filter":_vm.filter,"position":"bottom","title":_vm.endTitle || _vm.$t('vue.datepicker.endTime'),"placeholder":_vm.endPlaceholder || _vm.$t('vue.datepicker.endPlaceholder'),"value":_vm.endValue,"type":"time","default-pick":_vm.isArray(_vm.actualDefaultPick) ? _vm.actualDefaultPick[1] : _vm.actualDefaultPick,"confirm-button-text":_vm.confirmButtonText,"cancel-button-text":_vm.cancelButtonText,"show-toolbar":true,"item-height":_vm.itemHeight,"visible-item-count":_vm.visibleItemCount,"swipe-duration":_vm.swipeDuration,"picker-options":_vm.endPickerOptions},on:{"confirm":_vm.endOnConfirm,"cancel":_vm.endOnCancel,"change":_vm.endOnChange}})],1)],1)])}
var timePickerMobilevue_type_template_id_6355098f_staticRenderFns = []


// CONCATENATED MODULE: ./packages/datetime-picker/timePickerMobile.vue?vue&type=template&id=6355098f&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/datetime-picker/timePickerMobile.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var timePickerMobilevue_type_script_lang_js_ = ({
  name: 'VueTimePickerMobile',
  components: {
    TimePicker: datetime_picker,
    Popup: packages_popup
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String
    },
    placeholder: {
      type: String
    },
    startPlaceholder: {
      type: String,
      default: ''
    },
    endPlaceholder: {
      type: String,
      default: ''
    },
    isRange: {
      type: Boolean,
      default: false
    },
    rangeSeparator: {
      //选择范围时的分隔符
      type: String,
      default: '-'
    },
    format: {
      type: String,
      default: "HH:mm:ss"
    },
    valueFormat: {
      type: String
    },
    popperClass: {
      type: String
    },
    value: {
      type: [Number, String, Date, Array]
    },
    textAlign: {
      type: String
    },
    prefixIcon: {
      type: String
    },
    clearIcon: {
      type: String,
      default: 'vue-icon-close'
    },
    title: {
      type: String,
      default: ''
    },
    startTitle: {
      type: String,
      default: ''
    },
    endTitle: {
      type: String,
      default: ''
    },
    confirmButtonText: {
      type: String,
      default: ''
    },
    cancelButtonText: {
      type: String,
      default: ''
    },
    itemHeight: {
      type: [String, Number]
    },
    visibleItemCount: {
      // 可见的选项个数
      type: Number,
      default: 5
    },
    swipeDuration: {
      // 快速滑动时惯性滚动的时长，单位ms
      type: [String, Number],
      default: 1000
    },
    formatter: {
      type: Function
    },
    filter: {
      type: Function
    },
    defaultPick: {
      type: [Date, String, Number, Array]
    },
    pickerOptions: {}
  },
  mounted: function mounted() {//this.showPicker = false;
    //this.endShowPicker = false;
  },
  data: function data() {
    return {
      showPicker: false,
      endShowPicker: false,
      fieldValue: '',
      endFieldValue: '',
      actualValue: '',
      startValue: '',
      endValue: '',
      minTime: null,
      maxTime: null
    };
  },
  methods: {
    handleClickIcon: function handleClickIcon(event) {
      if (this.disabled) {
        return;
      }

      this.fieldValue = '';
      this.endFieldValue = '';
      this.startValue = null;
      this.endValue = null;
      event.stopPropagation();
      this.$emit('change', null);
      this.$emit('input', null);
    },
    onClick: function onClick() {
      if (this.disabled) {
        return;
      }

      this.maxTime = this.endFieldValue;
      this.showPicker = true;
    },
    formatInnerValueByValueFormate: function formatInnerValueByValueFormate(val) {
      if (!val) return;
      var innerFormat = ['HH', 'HH:mm', 'HH:mm:ss'][val.split(':').length - 1];
      var date = VueUtil.parseDate(val, innerFormat);

      if (this.valueFormat) {
        return VueUtil.formatDate(date, this.valueFormat);
      } else {
        return date;
      }
    },
    onConfirm: function onConfirm(value, index) {
      this.showPicker = false;
      value = this.formatInnerValueByValueFormate(value);
      this.$emit('input', value);
      this.$emit('confirm', value, index);
    },
    onCancel: function onCancel(value, index) {
      this.showPicker = false;
      this.$emit('cancel', value, index);
    },
    onChange: function onChange(picker, value, index) {
      this.$emit('change', picker, value, index);
    },
    endOnClick: function endOnClick() {
      if (this.disabled) {
        return;
      }

      this.minTime = this.fieldValue;
      this.endShowPicker = true;
    },
    startOnConfirm: function startOnConfirm(value, index) {
      if (this.endValue && this.formatInnerValueByValueFormate(value) > this.formatInnerValueByValueFormate(this.endValue)) {
        console.error('The start time cannot be later than the end time!');
        return;
      }

      this.showPicker = false;
      var endVal = this.value ? this.value[1] : null;
      this.$emit('input', [this.formatInnerValueByValueFormate(value), endVal]);
      this.$emit('start-confirm', this.formatInnerValueByValueFormate(value), index);
    },
    startOnCancel: function startOnCancel(value, index) {
      this.showPicker = false;
      this.$emit('start-cancel', value, index);
    },
    startOnChange: function startOnChange(picker, value, index) {
      this.$emit('start-change', picker, value, index);
    },
    endOnConfirm: function endOnConfirm(value, index) {
      if (this.startValue && this.formatInnerValueByValueFormate(value) < this.formatInnerValueByValueFormate(this.startValue)) {
        console.error('The end time cannot be earlier than the start time!');
        return;
      }

      this.endShowPicker = false;
      var startVal = this.value ? this.value[0] : null;
      this.$emit('input', [startVal, this.formatInnerValueByValueFormate(value)]);
      this.$emit('end-confirm', this.formatInnerValueByValueFormate(value), index);
    },
    endOnCancel: function endOnCancel(value, index) {
      this.endShowPicker = false;
      this.$emit('end-cancel', value, index);
    },
    endOnChange: function endOnChange(picker, value, index) {
      this.$emit('end-change', picker, value, index);
    },
    isArray: Array.isArray
  },
  watch: {
    value: {
      handler: function handler(val) {
        if (VueUtil.isArray(val)) {
          var startDate = val[0];
          var endDate = val[1];

          if (this.valueFormat) {
            if (val[0] && !VueUtil.isDate(val[0])) {
              startDate = VueUtil.parseDate(val[0], this.valueFormat);
            }

            if (val[1] && !VueUtil.isDate(val[1])) {
              endDate = VueUtil.parseDate(val[1], this.valueFormat);
            }
          }

          this.fieldValue = VueUtil.formatDate(startDate, this.format);
          this.startValue = VueUtil.formatDate(startDate, 'HH:mm:ss');
          this.endFieldValue = VueUtil.formatDate(endDate, this.format);
          this.endValue = VueUtil.formatDate(endDate, 'HH:mm:ss');
        } else {
          if (val && this.valueFormat) {
            val = VueUtil.parseDate(val, this.valueFormat);
          }

          this.fieldValue = VueUtil.formatDate(val, this.format);
          this.actualValue = VueUtil.formatDate(val, 'HH:mm:ss');
        }
      },
      immediate: true
    }
  },
  computed: {
    showClose: function showClose() {
      if (this.disabled) return false;
      if (!this.clearable) return false;

      if (VueUtil.isArray(this.value)) {
        return this.value && this.value.length > 0;
      }

      return this.value ? true : false;
    },
    triggerClass: function triggerClass() {
      return this.prefixIcon || 'vue-icon-time';
    },
    actualTextAlign: function actualTextAlign() {
      return this.textAlign ? this.textAlign : this.isRange ? 'center' : 'left';
    },
    actualDefaultPick: function actualDefaultPick() {
      var _this = this;

      if (this.defaultPick) {
        if (Array.isArray(this.defaultPick)) {
          return this.defaultPick.map(function (defaultPick) {
            var date = _this.valueFormat ? VueUtil.parseDate(defaultPick, _this.valueFormat) : defaultPick;
            return VueUtil.formatDate(date, 'HH:mm:ss');
          });
        } else {
          var date = this.valueFormat ? VueUtil.parseDate(this.defaultPick, this.valueFormat) : this.defaultPick;
          return VueUtil.formatDate(date, 'HH:mm:ss');
        }
      }

      return this.defaultPick;
    },
    startPickerOptions: function startPickerOptions() {
      return VueUtil.merge({}, this.pickerOptions, {
        selectableRange: [null, this.formatInnerValueByValueFormate(this.maxTime)]
      });
    },
    endPickerOptions: function endPickerOptions() {
      return VueUtil.merge({}, this.pickerOptions, {
        selectableRange: [this.formatInnerValueByValueFormate(this.minTime), null]
      });
    }
  }
});
// CONCATENATED MODULE: ./packages/datetime-picker/timePickerMobile.vue?vue&type=script&lang=js&
 /* harmony default export */ var datetime_picker_timePickerMobilevue_type_script_lang_js_ = (timePickerMobilevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/datetime-picker/timePickerMobile.vue





/* normalize component */

var timePickerMobile_component = normalizeComponent(
  datetime_picker_timePickerMobilevue_type_script_lang_js_,
  timePickerMobilevue_type_template_id_6355098f_render,
  timePickerMobilevue_type_template_id_6355098f_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var timePickerMobile = (timePickerMobile_component.exports);
// CONCATENATED MODULE: ./packages/locale/zh.ts
/* harmony default export */ var zh = ({
  vue: {
    picker: {
      confirm: '确定',
      cancel: '取消'
    },
    datepicker: {
      weekNumber: '第{number}周',
      defaultWeekFormat: '{year}w{yearWeekNum}',
      startPlaceholder: '开始',
      endPlaceholder: '结束'
    },
    scrollViewMore: {
      finishedText: '全部已加载',
      loadingText: '更多加载中...'
    },
    scrollViewRefresh: {
      refreshText: '下拉刷新',
      refreshActiveText: '释放刷新',
      refreshingText: '刷新中...'
    }
  }
});
// CONCATENATED MODULE: ./packages/locale/en.ts
/* harmony default export */ var en = ({
  vue: {
    picker: {
      confirm: 'Confirm',
      cancel: 'Cancel'
    },
    datepicker: {
      weekNumber: 'Week {number}',
      defaultWeekFormat: '{year}w{yearWeekNum}',
      startPlaceholder: 'Start',
      endPlaceholder: 'End'
    },
    scrollViewMore: {
      finishedText: 'All loaded',
      loadingText: 'Loading...'
    },
    scrollViewRefresh: {
      refreshText: 'Pull to refresh',
      refreshActiveText: 'Release to refresh',
      refreshingText: 'Refreshing...'
    }
  }
});
// CONCATENATED MODULE: ./packages/locale/ja.ts
/* harmony default export */ var ja = ({
  vue: {
    picker: {
      confirm: 'はい',
      cancel: 'キャンセル'
    },
    datepicker: {
      weekNumber: '第{number}週',
      defaultWeekFormat: '{year}w{yearWeekNum}',
      startPlaceholder: '開始',
      endPlaceholder: '終了'
    },
    scrollViewMore: {
      finishedText: 'すべてロード済み',
      loadingText: 'より多くの読み込み...'
    },
    scrollViewRefresh: {
      refreshText: 'プルダウンリフレッシュ',
      refreshActiveText: 'リリースリフレッシュ',
      refreshingText: 'リフレッシュ中...'
    }
  }
});
// EXTERNAL MODULE: ./style/mobile.less
var mobile = __webpack_require__("b44f");
var mobile_default = /*#__PURE__*/__webpack_require__.n(mobile);

// CONCATENATED MODULE: ./packages/MobileCssLoader.js

/* harmony default export */ var MobileCssLoader = (mobile_default.a);
// CONCATENATED MODULE: ./packages/index.ts
function packages_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function packages_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { packages_ownKeys(Object(source), true).forEach(function (key) { packages_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { packages_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function packages_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


















 //宫格组件




 // import Icon from './icon/index';
// import './icon/index.less';







 //引入该文件将mouse事件转换成touch事件


















var installed = false; // 所有组件列表

var components = [packages_loading, picker, action_sheet, nav_bar, tabbar, tabbar_item, cell_layout, cell_layout_item, // Icon,
text_icon, stepper, swipe_cell, skeleton, index_anchor, index_bar, scroll_view, scroll_view_more, scroll_view_refresh];

var packages_install = function install(Vue) {
  VueUtil.setLocale('zh', zh);
  VueUtil.setLocale('en', en);
  VueUtil.setLocale('ja', ja);
  if (installed) return;
  VueUtil.getSystemInfo().isLoadMobileJs = true;

  if (VueUtil.getSystemInfo().device == 'Mobile') {
    var copyViyComponents = function getViyComponents(Vue) {
      var ary = [];
      var copyComps = ['VueDatePicker', 'VueTimePicker'];
      copyComps.map(function (component) {
        var ops = Vue.component(component).options;
        ops.name = ops.name + 'Viy';
        ary.push(ops);
      });
      return ary;
    };

    components = components.concat(copyViyComponents(window.Vue));
    components.push(cascader);
    components.push(datetimePicker);
    components.push(datetimePickerMobile);
    components.push(timePicker);
    components.push(timePickerMobile);
    MobileCssLoader.use();
  }

  installed = true;
  components.map(function (component) {
    return Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  packages_install(window.Vue);
}

/* harmony default export */ var packages_0 = (packages_objectSpread({
  install: packages_install
}, components, {
  lang: {
    zh: zh,
    en: en,
    ja: ja
  }
}));
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (packages_0);



/***/ })

/******/ });
});