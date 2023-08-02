(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vue-pic-marker"] = factory();
	else
		root["vue-pic-marker"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
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

/***/ "3d0d":
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

/***/ "ab12":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "e54e":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VuePicMarker_vue_vue_type_style_index_0_id_fe5e12b0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ab12");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VuePicMarker_vue_vue_type_style_index_0_id_fe5e12b0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VuePicMarker_vue_vue_type_style_index_0_id_fe5e12b0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VuePicMarker_vue_vue_type_style_index_0_id_fe5e12b0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

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

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"27075934-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/VuePicMarker.vue?vue&type=template&id=fe5e12b0&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-pic-marker-panel",class:_vm.rootClass,attrs:{"loading":_vm.loading}},[_c('div',{staticClass:"vue-pic-marker-image"},[_c('img',{staticClass:"vue-pic-marker-raw-image",attrs:{"src":_vm.currentBaseImage},on:{"load":_vm.onImageLoad}}),_c('div',{staticClass:"annotate vue-pic-marker-raw-image-mask",staticStyle:{"user-select":"none","position":"absolute","left":"0px","top":"0"},style:({cursor: _vm.readOnly ? '' : 'crosshair'})},[_c('div',{class:'draft ' + _vm.type + (_vm.type ? ' has-type': ''),staticStyle:{"display":"none"},style:({backgroundColor: _vm.type ? '' : 'rgba(0, 0, 0, 0.3)'})})])])])}
var staticRenderFns = []


// CONCATENATED MODULE: ./packages/VuePicMarker.vue?vue&type=template&id=fe5e12b0&scoped=true&

// CONCATENATED MODULE: ./packages/marker-lib/config.js
function checkMobile() {
  var check = false;

  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
}

var isMobile = checkMobile();
var MOUSE_EVENT = isMobile ? ['touchstart', 'touchmove', 'touchend', 'xxx', 'touchend', 'xxx', 'contextmenu'] : ['mousedown', 'mousemove', 'mouseend', 'xxx', 'mouseup', 'xxx', 'contextmenu'];
var defaultPositions = {
  bottom: 0x01,
  out_bottom: 0x02
};
var defaultConfig = {
  options: {
    blurOtherDots: true,
    blurOtherDotsShowTags: false,
    editable: true,
    dotSize: 20,
    showTags: true,
    comment: true,
    allowClickAdd: true,
    allowDragAdd: true,
    showGrid: false,
    supportDelKey: true,
    tagLocation: defaultPositions.bottom,
    boundReachPercent: 0.01,
    annotationClass: 'annotation'
  },
  onAnnoContextMenu: function onAnnoContextMenu(annoData, element, annoContext) {},
  onAnnoRemoved: function onAnnoRemoved(annoData, element) {
    return true;
  },
  onAnnoAdded: function onAnnoAdded(insertItem, element) {},
  onAnnoChanged: function onAnnoChanged(newValue, oldValue) {},
  onAnnoDataFullLoaded: function onAnnoDataFullLoaded() {},
  onAnnoSelected: function onAnnoSelected(value, element) {},
  onUpdated: function onUpdated() {},
  // region maybe desperated at the end of 2019
  onDataRendered: function onDataRendered() {},
  onDrawOne: function onDrawOne() {},
  onSelect: function onSelect() {} // endregion

};
var imageOpTag = 'vue-pic-marker-popover-name';
var PREFIX_RESIZE_DOT = 'resize-dot';
var dotCls = ["".concat(PREFIX_RESIZE_DOT, "-n"), "".concat(PREFIX_RESIZE_DOT, "-s"), "".concat(PREFIX_RESIZE_DOT, "-w"), "".concat(PREFIX_RESIZE_DOT, "-e"), "".concat(PREFIX_RESIZE_DOT, "-nw"), "".concat(PREFIX_RESIZE_DOT, "-ne"), "".concat(PREFIX_RESIZE_DOT, "-sw"), "".concat(PREFIX_RESIZE_DOT, "-se"), "".concat(PREFIX_RESIZE_DOT, "-tag-trash")];

var getParent = function getParent(element, className) {
  while (element = element.parentElement) {
    if (element.classList.contains(className)) {
      return element;
    }
  }
};

var UUID = function UUID(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [];
  var i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix];
    }
  } else {
    // rfc4122, version 4 form
    var r; // rfc4122 requires these characters

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4'; // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[i === 19 ? r & 0x3 | 0x8 : r];
      }
    }
  }

  return uuid.join('');
};

var percentToSize = function percentToSize(percent) {
  var baseDistance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.round(parseFloat(percent).toFixed(3) * baseDistance / 100);
};

var positionP2S = function positionP2S() {
  var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    x: '0%',
    y: '0%',
    x1: '0%',
    y1: '0%'
  };
  var baseWith = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  var baseHeight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

  for (var o in position) {
    if (o.startsWith('x')) {
      position[o] = percentToSize(position[o], baseWith);
    } else {
      position[o] = percentToSize(position[o], baseHeight);
    }
  }

  return position;
};

var transformDataArray = function transformDataArray() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var baseWith = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  for (var i = 0; i < data.length; i++) {
    var o = data[i];
    o.position = positionP2S(o.position, baseWith);
  }

  return data;
};


// CONCATENATED MODULE: ./packages/marker-lib/movement.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Movement = function Movement(node) {
  var _this = this;

  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
  var boundRect = arguments.length > 2 ? arguments[2] : undefined;
  var options = arguments.length > 3 ? arguments[3] : undefined;

  _classCallCheck(this, Movement);

  _defineProperty(this, "transform", function (offsetX, offsetY) {
    if (!_this.options.editable) return;
    var parentEl = _this.moveNode;
    var rawHeightp = parseFloat(parentEl.style.height);
    var rawWidthp = parseFloat(parentEl.style.width);
    var rawTop = parseFloat(parentEl.style.top);
    var rawLeft = parseFloat(parentEl.style.left);
    var heightOffset = 100 * offsetY / _this.boundRect.height;
    var widthOffset = 100 * offsetX / _this.boundRect.width; // console.log( `this.type=${this.type},rawHeightp=${rawHeightp},rawWidthp=${rawWidthp},rawTop=${rawTop},rawLeft=${rawLeft},heightOffset=${heightOffset},widthOffset=${widthOffset}`);

    if (rawTop + heightOffset < _this.options.boundReachPercent || rawTop + heightOffset > 100 - _this.options.boundReachPercent) {
      return;
    }

    if (_this.type === 0) {
      // top
      if (rawHeightp - heightOffset < _this.options.boundReachPercent) {
        return;
      }

      parentEl.style.top = "".concat((rawTop + heightOffset).toFixed(3), "%");
      parentEl.style.height = "".concat((rawHeightp - heightOffset).toFixed(3), "%");
    } else if (_this.type === 1) {
      // bottom
      parentEl.style.height = "".concat((rawHeightp + heightOffset).toFixed(3), "%");
    } else if (_this.type === 2) {
      // left
      if (widthOffset + rawLeft < _this.options.boundReachPercent || widthOffset + rawLeft >= rawWidthp + rawLeft) {
        return;
      }

      parentEl.style.left = "".concat((widthOffset + rawLeft).toFixed(3), "%");
      parentEl.style.width = "".concat((rawWidthp - widthOffset).toFixed(3), "%");
    } else if (_this.type === 3) {
      // right
      parentEl.style.width = "".concat((rawWidthp + widthOffset).toFixed(3), "%");
    } else if (_this.type === 4) {
      // top-left
      if (rawHeightp - heightOffset < _this.options.boundReachPercent) {
        return;
      }

      if (rawWidthp - widthOffset < _this.options.boundReachPercent) {
        return;
      }

      parentEl.style.top = "".concat((rawTop + heightOffset).toFixed(3), "%");
      parentEl.style.height = "".concat((rawHeightp - heightOffset).toFixed(3), "%");
      parentEl.style.left = "".concat((widthOffset + rawLeft).toFixed(3), "%");
      parentEl.style.width = "".concat((rawWidthp - widthOffset).toFixed(3), "%");
    } else if (_this.type === 5) {
      // top-right
      if (rawWidthp + widthOffset < _this.options.boundReachPercent) {
        return;
      }

      if (rawHeightp - heightOffset < _this.options.boundReachPercent) {
        return;
      }

      parentEl.style.top = "".concat((rawTop + heightOffset).toFixed(3), "%");
      parentEl.style.height = "".concat((rawHeightp - heightOffset).toFixed(3), "%");
      parentEl.style.width = "".concat((rawWidthp + widthOffset).toFixed(3), "%");
    } else if (_this.type === 6) {
      // bottom-left
      if (rawHeightp + heightOffset < _this.options.boundReachPercent) {
        return;
      }

      if (rawWidthp - widthOffset < _this.options.boundReachPercent) {
        return;
      }

      parentEl.style.height = "".concat((rawHeightp + heightOffset).toFixed(3), "%");
      parentEl.style.left = "".concat((widthOffset + rawLeft).toFixed(3), "%");
      parentEl.style.width = "".concat((rawWidthp - widthOffset).toFixed(3), "%");
    } else if (_this.type === 7) {
      // bottom-right
      if (rawHeightp + heightOffset < _this.options.boundReachPercent) {
        return;
      }

      if (rawWidthp + widthOffset < _this.options.boundReachPercent) {
        return;
      }

      parentEl.style.height = "".concat((rawHeightp + heightOffset).toFixed(3), "%");
      parentEl.style.width = "".concat((rawWidthp + widthOffset).toFixed(3), "%");
    } else if (_this.type === -1) {
      // //move
      if (heightOffset + rawTop < _this.options.boundReachPercent || heightOffset + rawTop + rawHeightp > 100 - _this.options.boundReachPercent) {
        return;
      }

      if (widthOffset + rawLeft < _this.options.boundReachPercent || widthOffset + rawLeft + rawWidthp > 100 - _this.options.boundReachPercent) {
        return;
      }

      parentEl.style.top = "".concat((heightOffset + rawTop).toFixed(3), "%");
      parentEl.style.left = "".concat((widthOffset + rawLeft).toFixed(3), "%");
    }
  });

  this.moveNode = node;
  this.type = type;
  this.boundRect = boundRect;
  this.options = options;
};


// CONCATENATED MODULE: ./packages/marker-lib/anno.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { anno_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function anno_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function anno_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var anno_ResizeAnnotation = function ResizeAnnotation(parentNode, boundRect) {
  var _this = this;

  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultConfig;
  var callbackHandler = arguments.length > 3 ? arguments[3] : undefined;

  anno_classCallCheck(this, ResizeAnnotation);

  anno_defineProperty(this, "setConfigOptions", function (newOptions) {
    _this.options = _objectSpread(_objectSpread({}, _this.options), newOptions.options);
    _this.rawConfig = _objectSpread(_objectSpread({}, _this.rawConfig), newOptions);

    if (_this.options.supportDelKey) {
      document.onkeydown = function (e) {
        if (e.keyCode === 8 || e.keyCode === 46) {
          var _ref = _this.currentMovement || {},
              moveNode = _ref.moveNode;

          if (moveNode && !document.querySelector('.vue-pic-marker-popover-content.editing')) {
            _this.removeAnnotation(moveNode);
          }
        }
      };
    }

    if (!_this.options.editable) {
      _this.removeSelectedAnnotation();

      _this.annotationContainer.classList.remove('editable');
    } else {
      _this.annotationContainer.classList.add('editable');
    }

    if (!_this.options.showGrid) {
      _this.annotationContainer.classList.remove('show-grid');
    } else {
      _this.annotationContainer.classList.add('show-grid');
    }
  });

  anno_defineProperty(this, "dataTemplate", function (tag, x, y, x1, y1) {
    if (!tag || !/^.+$/gi.test(tag)) {
      tag = {
        tag: "temp@".concat(new Date().getTime())
      };
    }

    return _objectSpread(_objectSpread({}, tag), {}, {
      position: {
        x: x,
        y: y,
        x1: x1,
        y1: y1
      }
    });
  });

  anno_defineProperty(this, "reset", function () {
    _this.data = [];
  });

  anno_defineProperty(this, "isValid", function (rect) {
    return rect && parseFloat(rect.width) > 1 && parseFloat(rect.height) > 1;
  });

  anno_defineProperty(this, "renderData", function () {
    var dataArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      width: _this.boundRect().width,
      height: _this.boundRect().height
    };

    if (dataArray instanceof Array && dataArray.length > 0) {
      dataArray.forEach(function (data, index, arr) {
        var rect;

        if (!isNaN(data.position.x)) {
          rect = {
            x: "".concat((100 * data.position.x / base.width).toFixed(3), "%"),
            y: "".concat((100 * data.position.y / base.height).toFixed(3), "%"),
            width: data.isClick ? '0%' : "".concat((100 * (data.position.x1 - data.position.x) / base.width).toFixed(3), "%"),
            height: data.isClick ? '0%' : "".concat((100 * (data.position.y1 - data.position.y) / base.height).toFixed(3), "%")
          };
        } else if (data.position.x.endsWith('%')) {
          rect = {
            x: data.position.x,
            y: data.position.y,
            width: data.isClick ? '0%' : "".concat(parseFloat(data.position.x1) - parseFloat(data.position.x), "%"),
            height: data.isClick ? '0%' : "".concat(parseFloat(data.position.y1) - parseFloat(data.position.y), "%")
          };
        } else {
          return;
        }

        _this.drawAnnotation(rect, data);

        _this.removeSelectedAnnotation();
      });
    } else {
      _this.reset();
    }

    _this.rawConfig.onDataRendered();

    _this.rawConfig.onAnnoDataFullLoaded();
  });

  anno_defineProperty(this, "dataSource", function () {
    return _this.data;
  });

  anno_defineProperty(this, "dataSourceOfTag", function (tagId, uuid) {
    for (var i = 0; i < _this.data.length; i++) {
      var value = _this.data[i];

      if (value.tag === tagId && value.uuid == uuid) {
        return value;
      }
    }
  });

  anno_defineProperty(this, "setTagForCurrentMovement", function (tagOb) {
    if (_this.currentMovement) {
      var node = _this.currentMovement.moveNode;
      var tagStr = '';
      var tagId = '';

      if (typeof tagOb === 'string') {
        tagId = tagOb;
        tagStr = tagOb;
      }

      var oldtag = node.querySelector(".".concat(imageOpTag)).dataset.id;
      var constData = {};

      if (_typeof(tagOb) === 'object') {
        tagStr = tagOb.tagName;
        tagId = tagOb.tag;
        constData = _objectSpread({}, tagOb);

        for (var k in tagOb) {
          node.querySelector(".".concat(imageOpTag)).dataset[k] = tagOb[k];
        }
      }

      var uuid = node.dataset.uuid;
      node.querySelector(".".concat(imageOpTag)).innerText = tagStr;

      for (var i = 0; i < _this.data.length; i++) {
        var value = _this.data[i];

        var oldValue = _objectSpread({}, value);

        if (value.tag === oldtag && value.uuid === uuid) {
          value = _objectSpread(_objectSpread(_objectSpread({}, value), constData), {}, {
            tag: tagId,
            tagName: tagStr
          });
          node.querySelector(".".concat(imageOpTag)).dataset.id = tagId;
          node.querySelector(".".concat(imageOpTag)).dataset.name = tagStr;

          _this.rawConfig.onAnnoChanged(value, oldValue);
        }

        _this.data[i] = value;
      }

      _this.rawConfig.onUpdated(_this.dataSource());

      var content = node.querySelector('.vue-pic-marker-popover-content');

      if (!tagStr) {
        content && content.classList.add('empty-comment');
      } else {
        content && content.classList.remove('empty-comment');
      }

      _this.tagPosition(node);
    }
  });

  anno_defineProperty(this, "updateMovementData", function () {
    // 获取tag
    if (_this.currentMovement == null) return;
    var node = _this.currentMovement.moveNode;
    var uuid = node.dataset.uuid;
    var tag = node.querySelector(".".concat(imageOpTag)).dataset.id;
    var position = {
      x: node.style.left,
      y: node.style.top,
      x1: "".concat((parseFloat(node.style.width) + parseFloat(node.style.left)).toFixed(3), "%"),
      y1: "".concat((parseFloat(node.style.height) + parseFloat(node.style.top)).toFixed(3), "%")
    }; // 从原有的数据集查找该tag

    for (var i = 0; i < _this.data.length; i++) {
      var value = _this.data[i];

      var oldValue = _objectSpread({}, value);

      if (value.tag === tag && value.uuid === uuid) {
        value.position = position;
        _this.data[i] = value;

        _this.rawConfig.onAnnoChanged(value, oldValue);
      }
    }

    _this.rawConfig.onUpdated(_this.dataSource(), _this.currentMovement);
  });

  anno_defineProperty(this, "_removeAnnotationEvent", function (e) {
    if (!_this.options.editable) return;
    var selectNode = getParent(e.currentTarget, 'annotation');

    _this.removeAnnotation(selectNode);
  });

  anno_defineProperty(this, "_editAnnotationEvent", function (e) {
    if (!_this.options.editable) return;
    var selectNode = getParent(e.currentTarget, 'annotation');

    _this.editAnnotationEvent(selectNode);

    _this.tagPosition(selectNode);
  });

  anno_defineProperty(this, "_saveEditEvent", function (e) {
    if (!_this.options.editable) return;
    var selectNode = getParent(e.currentTarget, 'annotation');

    if (selectNode) {
      var textspan = selectNode.querySelector('.vue-pic-marker-popover-name');
      if (!textspan) return;
      var text = textspan.innerText;

      _this.setTagForCurrentMovement(text);
    }

    _this._exitEditEvent(e);
  });

  anno_defineProperty(this, "_exitEditEvent", function (e) {
    if (!_this.options.editable) return;
    var selectNode = getParent(e.currentTarget, 'annotation');

    if (selectNode) {
      selectNode.querySelector('.vue-pic-marker-popover-content').classList.remove('editing');
      selectNode.querySelector('.vue-pic-marker-popover-name').removeAttribute('contenteditable');

      _this.tagPosition(selectNode);
    }
  });

  anno_defineProperty(this, "_cancelEditEvent", function (e) {
    if (!_this.options.editable) return;
    var selectNode = getParent(e.currentTarget, 'annotation');

    if (selectNode) {
      var textspan = selectNode.querySelector('.vue-pic-marker-popover-name');
      if (!textspan) return;
      var text = textspan.dataset.name;

      _this.setTagForCurrentMovement(text);
    }

    _this._exitEditEvent(e);
  });

  anno_defineProperty(this, "removeAnnotation", function (node) {
    if (node) {
      var uuid = node.dataset.uuid; // const tag = node.querySelector(`.${imageOpTag}`).dataset.id;

      var value;

      for (var i = 0; i < _this.data.length; i++) {
        value = _this.data[i];

        if ( // value.tag === tag &&
        value.uuid === uuid) {
          _this.rawConfig.onAnnoRemoved(value);

          _this.data.splice(i, 1);

          break;
        }
      }

      _this.rawConfig.onUpdated(_this.dataSource());

      node.remove();
    }
  });

  anno_defineProperty(this, "editAnnotationEvent", function (node) {
    if (node) {
      node.querySelector('.vue-pic-marker-popover-content').classList.add('editing');
      node.querySelector('.vue-pic-marker-popover-name').setAttribute('contenteditable', 'true');
    }
  });

  anno_defineProperty(this, "annotationType", '');

  anno_defineProperty(this, "drawAnnotation", function (rect) {
    var tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : void 0;
    var isClick = false;
    if (rect.x == -1 || rect.y == -1) return;

    if (!_this.isValid(rect)) {
      if (_this.options.allowClickAdd) {
        isClick = true;
      } else {
        return;
      }
    }

    _this.removeSelectedAnnotation(); // 创建Annotation节点


    var annotation = document.createElement('div');
    annotation.className = "".concat(_this.options.annotationClass, " selected ").concat(tag && tag.type || _this.annotationType || '', " ").concat(isClick ? 'is-click' : '', "  ").concat(_this.options.comment ? '' : "no-comment");
    annotation.innerHTML = tag && tag.content && '<div class="anno-content">' + tag.content + '</div>' || '';
    annotation.style.position = 'absolute';
    annotation.style.top = rect.y;
    annotation.style.left = rect.x;
    annotation.style.width = rect.width;
    annotation.style.height = rect.height;

    if (isClick) {
      var dotSize = _this.options.dotSize;
      var dotWidthPercentage = dotSize / _this.annotationContainer.offsetWidth * 100;
      var dotHeightPercentage = dotSize / _this.annotationContainer.offsetHeight * 100;
      annotation.style.top = parseFloat(annotation.style.top) - dotHeightPercentage / 2 + '%';
      annotation.style.left = parseFloat(annotation.style.left) - dotWidthPercentage / 2 + '%';
      annotation.style.width = dotWidthPercentage + '%';
      annotation.style.height = dotHeightPercentage + '%';
    } // 创建8个resizeDot


    var resizeDotClasses = {
      top: "".concat(PREFIX_RESIZE_DOT, " top"),
      bottom: "".concat(PREFIX_RESIZE_DOT, " bottom"),
      left: "".concat(PREFIX_RESIZE_DOT, " left"),
      right: "".concat(PREFIX_RESIZE_DOT, " right"),
      topLeft: "".concat(PREFIX_RESIZE_DOT, " top-left"),
      topRight: "".concat(PREFIX_RESIZE_DOT, " top-right"),
      bottomLeft: "".concat(PREFIX_RESIZE_DOT, " bottom-left"),
      bottomRight: "".concat(PREFIX_RESIZE_DOT, " bottom-right"),
      trash: 'vue-pic-marker-popover'
    };
    var uu = "".concat(UUID(16, 16));
    annotation.dataset.uuid = uu; // this.rawConfig

    var i = 0;
    var tagString;
    var tagId;

    if (_typeof(tag) === 'object') {
      tagString = tag.tagName;
      tagId = tag.tag;
    } else if (typeof tag === 'string') {
      tagString = tag;
      tagId = tag;
    } else {
      tagString = '';
      tagId = "temp@".concat(uu);
      tag = {
        tag: tagId,
        tagName: tagString
      };
    }

    for (var prop in resizeDotClasses) {
      var resizeDot = document.createElement('div');

      if (i === 8) {
        resizeDot.className = "".concat(_this.options.blurOtherDotsShowTags ? '' : "".concat(dotCls[i]), " ").concat(resizeDotClasses[prop]);
        var opContent = document.createElement('div');
        opContent.className = 'vue-pic-marker-popover-content';

        if (!_this.options.showTags) {
          opContent.style.visibility = 'collapse';
        } else {
          opContent.style.visibility = 'visible';
        }

        if (_this.options.tagLocation == defaultPositions.out_bottom) {
          opContent.style.position = 'absolute';
          opContent.style.bottom = null;
        } else {
          opContent.style.position = null;
        }

        var trash = document.createElement('i');
        trash.className = 'vue-pic-marker-popover-del';
        trash.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="markericon-trash"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>';
        trash.addEventListener('click', _this._removeAnnotationEvent, true);
        var edit = document.createElement('i');
        edit.className = 'vue-pic-marker-popover-edit';
        edit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="markericon-trash"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>';
        edit.addEventListener('click', _this._editAnnotationEvent, true);
        var btns = document.createElement('div');
        btns.className = 'vue-pic-marker-tag-btns';

        if (_this.options.comment) {
          btns.appendChild(edit);
        }

        btns.appendChild(trash);

        var _tag = document.createElement('span');

        _tag.dataset.name = tagString;
        _tag.className = "".concat(imageOpTag);
        _tag.innerText = tagString;
        _tag.dataset.id = tagId;

        if (!tagString) {
          opContent.classList.add('empty-comment');
        }

        var editPanel = document.createElement('div');
        editPanel.className = "vue-pic-marker-popover-edit-panel";
        var saveBtn = document.createElement('button');
        var cancelBtn = document.createElement('button');
        saveBtn.className = "vue-pic-marker-popover-btn-save";
        cancelBtn.className = "vue-pic-marker-popover-btn-cancel";
        saveBtn.innerText = 'Save';
        cancelBtn.innerText = 'Cancel';
        editPanel.appendChild(saveBtn);
        editPanel.appendChild(cancelBtn);
        saveBtn.addEventListener('click', _this._saveEditEvent, true);
        cancelBtn.addEventListener('click', _this._cancelEditEvent, true);
        opContent.appendChild(btns);
        opContent.appendChild(_tag);

        if (_this.options.comment) {
          opContent.appendChild(editPanel);
        }

        resizeDot.appendChild(opContent);
      } else {
        resizeDot.className = "".concat(resizeDotClasses[prop], " ").concat(dotCls[i], " ").concat(isClick || _this.options.editable ? '' : 'hidden');
      }

      (!isClick || i == 8) && annotation.appendChild(resizeDot);
      i++;
    } // 加事件


    _this.annotationContainer.appendChild(annotation);

    _this.tagPosition(annotation);

    annotation.oncontextmenu = function (e) {
      e.preventDefault();
      var annoContent = annotation.querySelector('.anno-content');
      var node;

      if (e.target.classList.contains('annotation')) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        node = e.target;
      } else if (annoContent && annoContent.contains(e.target)) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        node = annotation;
      } else {
        return;
      }

      var tagAttr = node.querySelector(".".concat(imageOpTag)).dataset;

      var ab = _this.dataSourceOfTag(tagAttr.id, node.dataset.uuid);

      _this.rawConfig.onAnnoContextMenu(e, ab, node, _this); // this.removeAnnotation(selectNode);


      return true;
    };

    annotation.onclick = function (e) {
      e.preventDefault();
      var annoContent = annotation.querySelector('.anno-content');
      var node;

      if (e.target.classList.contains('annotation')) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        node = e.target;
      } else if (annoContent && annoContent.contains(e.target)) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        node = annotation;
      } else {
        return;
      }

      var tagAttr = node.querySelector(".".concat(imageOpTag)).dataset;

      var ab = _this.dataSourceOfTag(tagAttr.id, node.dataset.uuid);

      _this.rawConfig.onAnnoClick(e, ab, node, _this); // this.removeAnnotation(selectNode);


      return true;
    };

    annotation.ondblclick = function (e) {
      e.preventDefault();
      var annoContent = annotation.querySelector('.anno-content');
      var node;

      if (e.target.classList.contains('annotation')) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        node = e.target;
      } else if (annoContent && annoContent.contains(e.target)) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        node = annotation;
      } else {
        return;
      }

      var tagAttr = node.querySelector(".".concat(imageOpTag)).dataset;

      var ab = _this.dataSourceOfTag(tagAttr.id, node.dataset.uuid);

      _this.rawConfig.onAnnoDblClick(e, ab, node, _this); // this.removeAnnotation(selectNode);


      return true;
    };

    _this.currentMovement = new Movement(annotation, 0, _this.boundRect(), _this.options); // this.selectAnnotation();

    var dts = _this.dataTemplate(tag, rect.x, rect.y, "".concat(parseFloat(rect.x) + parseFloat(rect.width), "%"), "".concat(parseFloat(rect.y) + parseFloat(rect.height), "%"));

    var insertItem = _objectSpread(_objectSpread({}, dts), {}, {
      uuid: uu,
      type: tag && tag.type || _this.annotationType,
      isClick: isClick
    });

    _this.data.push(insertItem);

    _this.rawConfig.onUpdated(_this.dataSource());

    _this.rawConfig.onAnnoAdded(insertItem, annotation);

    _this.rawConfig.onDrawOne(dts, _this.currentMovement);
  });

  anno_defineProperty(this, "tagPosition", function (node) {
    var popper = node.querySelector('.vue-pic-marker-popover');

    if (!popper) {
      return;
    }

    popper.style.left = "".concat((node.offsetWidth - popper.offsetWidth) / 2, "px");
  });

  anno_defineProperty(this, "moved", false);

  anno_defineProperty(this, "dragEventOn", function (e) {
    // e.preventDefault();
    // e.stopPropagation();
    // if (!e.target.classList.contains('annotation') &&
    //     !e.target.classList.contains(`${PREFIX_RESIZE_DOT}`)) {
    //     eventTargetOnTransform = false;
    //   }
    var eventType = e.type;

    if (eventType === MOUSE_EVENT[6]) {
      _this.selectAnnotation();

      return;
    }

    var clientX = e.clientX;
    var clientY = e.clientY;

    if (isMobile && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    _this.moveX = clientX; // - this.boundRect().x;

    _this.moveY = clientY; // - this.boundRect().y;

    if (eventType === MOUSE_EVENT[0]) {
      _this.actionDown = true;
      _this.lastX = _this.moveX;
      _this.lastY = _this.moveY;

      if (typeof _this.callbackHandler === 'function') {
        _this.callbackHandler(true);
      } // eventTargetOnTransform = true;


      _this.targetEventType(e);
    } else if (eventType === MOUSE_EVENT[1] || eventType === MOUSE_EVENT[3] || eventType === MOUSE_EVENT[5]) {
      if (isMobile) {
        e.preventDefault();
      }

      if (_this.currentMovement == null) {
        return true;
      }

      if (_this.actionDown) {
        if (_this.filterOutOfBounds(_this.moveX, _this.moveY)) {
          return;
        }

        _this.currentMovement.transform(_this.moveX - _this.lastX, _this.moveY - _this.lastY);

        _this.lastX = _this.moveX;
        _this.lastY = _this.moveY;
      }

      _this.moved = true;

      _this.tagPosition(_this.currentMovement.moveNode);
    } else {
      if (typeof _this.callbackHandler === 'function') {
        _this.callbackHandler(false);
      } // eventTargetOnTransform = false;


      if (_this.actionDown) {
        var el = e.target;

        if (el.classList.contains('selected') && !_this.moved) {
          _this.removeSelectedAnnotation();
        } else {
          _this.updateMovementData();

          _this.selectAnnotation();
        }
      }

      _this.actionDown = false;
      _this.moved = false;
    }
  });

  anno_defineProperty(this, "removeSelectedAnnotation", function () {
    if (_this.currentMovement) {
      var cs = _this.currentMovement.moveNode.classList;
      cs.remove('selected');

      if (_this.options.blurOtherDots) {
        _this.currentMovement.moveNode.querySelectorAll("[class*=".concat(PREFIX_RESIZE_DOT, "]")).forEach(function (node) {
          node.classList.add('hidden');
        });
      }
    }
  });

  anno_defineProperty(this, "selectAnnotation", function () {
    var isUserinteracted = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (_this.currentMovement) {
      var cs = _this.currentMovement.moveNode.classList;
      cs.add('selected');

      _this.tagPosition(_this.currentMovement.moveNode);

      if (_this.options.blurOtherDots) {
        if (!_this.options.editable) {
          _this.currentMovement.moveNode.querySelectorAll("[class*=".concat(PREFIX_RESIZE_DOT, "]")).forEach(function (node) {
            if (node.classList.contains(dotCls[8])) {
              node.classList.remove('hidden');
            } else {
              node.classList.add('hidden');
            }
          });

          return;
        }

        _this.currentMovement.moveNode.querySelectorAll("[class*=".concat(PREFIX_RESIZE_DOT, "]")).forEach(function (node) {
          node.classList.remove('hidden');
        });
      }

      if (!isUserinteracted) return;
      var node = _this.currentMovement.moveNode;
      var tag_str = node.querySelector(".".concat(imageOpTag)).innerText;
      var tagAttr = node.querySelector(".".concat(imageOpTag)).dataset;

      var selectData = _objectSpread(_objectSpread({}, tagAttr), _this.dataSourceOfTag(tagAttr.id, node.dataset.uuid));

      _this.rawConfig.onAnnoSelected(selectData, node);

      _this.rawConfig.onSelect(selectData);
    }
  });

  anno_defineProperty(this, "selectMarkerByTagId", function (tagId) {
    var tag = _this.annotationContainer.querySelector("[data-id=\"".concat(tagId, "\"]"));

    if (tag) {
      var markerAnnotation = tag.parentNode.parentNode.parentNode;

      _this.removeSelectedAnnotation();

      _this.currentMovement = new Movement(markerAnnotation, -1, _this.boundRect(), _this.options);

      _this.selectAnnotation(false);
    }
  });

  anno_defineProperty(this, "targetEventType", function (e) {
    var current = _this.currentMovement ? _this.currentMovement.moveNode : null;
    var el = e.target;
    var parentEl = el.classList.contains('annotation') ? el : el.parentNode;

    if (parentEl !== current) {
      _this.removeSelectedAnnotation();
    }

    if (el.classList.contains(dotCls[0])) {
      // top
      _this.currentMovement = new Movement(parentEl, 0, _this.boundRect(), _this.options);
    } else if (el.classList.contains(dotCls[1])) {
      // bottom
      _this.currentMovement = new Movement(parentEl, 1, _this.boundRect(), _this.options);
    } else if (el.classList.contains(dotCls[2])) {
      // left
      _this.currentMovement = new Movement(parentEl, 2, _this.boundRect(), _this.options);
    } else if (el.classList.contains(dotCls[3])) {
      // right
      _this.currentMovement = new Movement(parentEl, 3, _this.boundRect(), _this.options);
    } else if (el.classList.contains(dotCls[4])) {
      // top-left
      _this.currentMovement = new Movement(parentEl, 4, _this.boundRect(), _this.options);
    } else if (el.classList.contains(dotCls[5])) {
      // top-right
      _this.currentMovement = new Movement(parentEl, 5, _this.boundRect(), _this.options);
    } else if (el.classList.contains(dotCls[6])) {
      // bottom-left
      _this.currentMovement = new Movement(parentEl, 6, _this.boundRect(), _this.options);
    } else if (el.classList.contains(dotCls[7])) {
      // bottom-right
      _this.currentMovement = new Movement(parentEl, 7, _this.boundRect(), _this.options);
    } else if (el.classList.contains('annotation')) {
      _this.currentMovement = new Movement(parentEl, -1, _this.boundRect(), _this.options);
    } else {
      var content = el.classList.contains('anno-content') ? el : getParent(el, 'anno-content');

      if (content) {
        _this.currentMovement = new Movement(content.parentNode, -1, _this.boundRect(), _this.options);
      } else {
        _this.currentMovement = null;
      }
    } // this.selectAnnotation();

  });

  anno_defineProperty(this, "filterOutOfBounds", function (x, y) {
    return x >= _this.boundRect().x + _this.boundRect().width + 2 || y >= _this.boundRect().y + _this.boundRect().height + 2 || x < 5 || y < 5;
  });

  this.options = _objectSpread(_objectSpread({}, defaultConfig.options), callback.options);
  this.callbackHandler = callbackHandler;
  this.annotationContainer = parentNode;
  this.boundRect = boundRect;
  this.actionDown = false;
  this.currentMovement = null;
  this.rawConfig = _objectSpread(_objectSpread({}, defaultConfig), callback);
  this.data = [];
  this.setConfigOptions(this.rawConfig);
};


// CONCATENATED MODULE: ./packages/marker-lib/bdmarker.js
function bdmarker_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { bdmarker_typeof = function _typeof(obj) { return typeof obj; }; } else { bdmarker_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return bdmarker_typeof(obj); }

function bdmarker_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function bdmarker_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { bdmarker_ownKeys(Object(source), true).forEach(function (key) { bdmarker_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { bdmarker_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function bdmarker_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function bdmarker_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var bdmarker_BdAIMarker = function BdAIMarker(layer, draft, resizeAnnotation) {
  var _this = this;

  var configs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  bdmarker_classCallCheck(this, BdAIMarker);

  bdmarker_defineProperty(this, "eventTargetOnTransform", false);

  bdmarker_defineProperty(this, "$callbackHandler", function (onTrans) {
    _this.eventTargetOnTransform = onTrans;
  });

  bdmarker_defineProperty(this, "setConfigOptions", function (newOptions) {
    _this.options = bdmarker_objectSpread(bdmarker_objectSpread({}, _this.options), newOptions.options);

    if (_this.resizeAnnotation) {
      _this.resizeAnnotation.setConfigOptions(newOptions);
    }
  });

  bdmarker_defineProperty(this, "mouseEventHandler", function (e, clientX, clientY) {
    // e.preventDefault();
    // e.stopPropagation();
    var eventType = e.type;
    if ((eventType === MOUSE_EVENT[0] || eventType === MOUSE_EVENT[4]) && getParent(e.target, 'vue-pic-marker-popover')) return;

    var boundRect = _this.boundRect();

    _this.moveX = clientX - boundRect.x;
    _this.moveY = clientY - boundRect.y;

    if (eventType === MOUSE_EVENT[6]) {
      _this.eventTargetOnTransform = false;
      _this.actionDown = false;

      _this.resizeAnnotation.dragEventOn(e);

      return;
    }

    if (_this.eventTargetOnTransform) {
      _this.resizeAnnotation.dragEventOn(e);

      return;
    }

    if (eventType === MOUSE_EVENT[0]) {
      if (e.target.classList.contains(_this.options.annotationClass) || e.target.classList.contains("".concat(PREFIX_RESIZE_DOT)) || e.target.classList.contains('anno-content') || getParent(e.target, 'anno-content')) {
        _this.eventTargetOnTransform = true;

        _this.resizeAnnotation.dragEventOn(e);

        return;
      }

      if (_this.actionDown) {
        _this.dragTo(_this.moveX, _this.moveY);

        return;
      }

      _this.actionDown = true;
      _this.anchorX = _this.moveX;
      _this.anchorY = _this.moveY;

      _this.resetDraft();

      _this.anchorAt(_this.anchorX, _this.anchorY);
    } else if (eventType === MOUSE_EVENT[1]) {
      if (isMobile) {
        e.preventDefault();
      }

      if (_this.actionDown) {
        if (_this.options.allowDragAdd) {
          _this.dragTo(_this.moveX, _this.moveY);
        } else {
          _this.actionDown = false;
        }
      }
    } else if (eventType === MOUSE_EVENT[4]) {
      if (_this.actionDown && _this.resizeAnnotation) {
        _this.resizeAnnotation.drawAnnotation(_this.draftRect);

        _this.resetDraft();
      }

      _this.actionDown = false;
    } else if (_this.actionDown && _this.filterOutOfBounds(_this.moveX, _this.moveY)) {
      // console.log(`eventType=${eventType}`);
      // console.log(this.draftRect);
      if (_this.resizeAnnotation) {
        _this.resizeAnnotation.drawAnnotation(_this.draftRect);

        _this.resetDraft();
      }

      _this.actionDown = false;
    }
  });

  bdmarker_defineProperty(this, "anchorAt", function (x, y) {
    if (!_this.options.editable) return;
    _this.draft.style.display = '';

    if (_this.moveX < x) {
      _this.draft.style.right = "".concat(100 * Math.abs(_this.boundRect().width - x) / _this.boundRect().width, "%");
      _this.draft.style.left = '';
      _this.draftRect = Object.assign(_this.draftRect, {
        x: "".concat((100 * Math.abs(_this.moveX) / _this.boundRect().width).toFixed(3), "%")
      });
    } else {
      _this.draft.style.left = "".concat((100 * Math.abs(x) / _this.boundRect().width).toFixed(3), "%");
      _this.draft.style.right = '';
      _this.draftRect = Object.assign(_this.draftRect, {
        x: "".concat((100 * Math.abs(x) / _this.boundRect().width).toFixed(3), "%")
      });
    }

    if (_this.moveY < y) {
      _this.draft.style.bottom = "".concat((100 * Math.abs(_this.boundRect().height - y) / _this.boundRect().height).toFixed(3), "%");
      _this.draft.style.top = '';
      _this.draftRect = Object.assign(_this.draftRect, {
        y: "".concat((100 * Math.abs(_this.moveY) / _this.boundRect().height).toFixed(3), "%")
      });
    } else {
      _this.draft.style.top = "".concat((100 * Math.abs(y) / _this.boundRect().height).toFixed(3), "%");
      _this.draft.style.bottom = '';
      _this.draftRect = Object.assign(_this.draftRect, {
        y: "".concat((100 * Math.abs(y) / _this.boundRect().height).toFixed(3), "%")
      });
    }
  });

  bdmarker_defineProperty(this, "filterOutOfBounds", function (x, y) {
    return x >= _this.boundRect().width // x >= this.boundRect().x + this.boundRect().width + 2 ||
    || y >= _this.boundRect().height // y >= this.boundRect().y + this.boundRect().height + 2 ||
    || x < 1 || y < 1;
  });

  bdmarker_defineProperty(this, "resetDraft", function () {
    // reset
    _this.draftRect = {
      x: -1,
      y: -1,
      width: 0,
      height: 0
    };
    _this.draft.style.width = '0%';
    _this.draft.style.height = '0%';
  });

  bdmarker_defineProperty(this, "clearAll", function () {
    var annotations = _this.layer.querySelectorAll(".".concat(_this.options.annotationClass));

    annotations.forEach(function (item) {
      item.remove();
    });

    _this.renderData(void 0);
  });

  bdmarker_defineProperty(this, "dragTo", function (x, y) {
    if (!_this.options.editable) return;

    if (_this.filterOutOfBounds(x, y)) {
      _this.actionDown = false;
    }

    _this.anchorAt(_this.anchorX, _this.anchorY);

    var widthRatio = (100 * Math.abs(x - _this.anchorX) / _this.boundRect().width).toFixed(3);

    var heightRatio = (100 * Math.abs(y - _this.anchorY) / _this.boundRect().height).toFixed(3);

    _this.draftRect = Object.assign(_this.draftRect, {
      width: "".concat(widthRatio, "%"),
      height: "".concat(heightRatio, "%")
    });
    _this.draft.style.width = _this.draftRect.width;
    _this.draft.style.height = _this.draftRect.height;
  });

  bdmarker_defineProperty(this, "renderData", function () {
    var dataArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var base = arguments.length > 1 ? arguments[1] : undefined;
    var ra = _this.resizeAnnotation;

    if (ra) {
      ra.renderData(dataArray, base);
    }
  });

  bdmarker_defineProperty(this, "setTag", function (tag) {
    if (_this.resizeAnnotation && tag != undefined) {
      _this.resizeAnnotation.setTagForCurrentMovement(tag);
    }
  });

  bdmarker_defineProperty(this, "selectMarkerByTagId", function (tagId) {
    if (tagId) {
      _this.resizeAnnotation.selectMarkerByTagId(tagId);
    }
  });

  bdmarker_defineProperty(this, "setType", function (type) {
    if (_this.resizeAnnotation) {
      _this.resizeAnnotation.annotationType = type;
    }
  });

  bdmarker_defineProperty(this, "dataSource", function () {
    if (_this.resizeAnnotation) {
      return _this.resizeAnnotation.dataSource();
    }

    return void 0;
  });

  bdmarker_defineProperty(this, "dataForTag", function (tagId, uuid) {
    return _this.resizeAnnotation.dataSourceOfTag(tagId, uuid);
  });

  if (bdmarker_typeof(configs) !== 'object') {
    throw 'Please provide a callback Config for BdAIMarker';
  }

  this.options = bdmarker_objectSpread(bdmarker_objectSpread({}, defaultConfig.options), configs.options);

  if (layer) {
    this.layer = layer;
    this.draft = draft;
    this.actionDown = false;
    this.draftRect = {};
    this.anchorX = -1;
    this.anchorY = -1;

    this.boundRect = function () {
      return layer.getBoundingClientRect();
    };

    this.resizeAnnotation = resizeAnnotation || new anno_ResizeAnnotation(draft.parentNode, this.boundRect, configs, this.$callbackHandler);
    var self = this;
    MOUSE_EVENT.forEach(function (currentValue, index, arr) {
      layer.addEventListener(currentValue, function (e) {
        var x = e.clientX;
        var y = e.clientY;

        if (isMobile && e.touches[0]) {
          x = e.touches[0].clientX;
          y = e.touches[0].clientY;
        }

        self.mouseEventHandler(e, x, y);
      }, true);
    });
  }
};


// CONCATENATED MODULE: ./packages/marker/marker.js
function marker_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function marker_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var marker_ImageMarker = function ImageMarker(_parentEl, _draftEl, _configs) {
  var _this = this;

  marker_classCallCheck(this, ImageMarker);

  marker_defineProperty(this, "_makeMarker", function (parentEl, draftEl, configs) {
    return new bdmarker_BdAIMarker(parentEl, draftEl, null, configs);
  });

  marker_defineProperty(this, "updateConfig", function (configs) {
    _this.marker.setConfigOptions(configs);
  });

  marker_defineProperty(this, "getMarker", function () {
    return _this.marker;
  });

  marker_defineProperty(this, "setTag", function () {
    var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _this.marker.setTag(tag);
  });

  marker_defineProperty(this, "type", '');

  marker_defineProperty(this, "setType", function (type) {
    _this.type = type;

    _this.marker.setType(type);
  });

  marker_defineProperty(this, "renderData", function (data, wihe) {
    _this.marker.renderData(data, wihe);
  });

  marker_defineProperty(this, "getData", function () {
    return _this.marker.dataSource();
  });

  marker_defineProperty(this, "clearData", function () {
    _this.marker.clearAll();
  });

  marker_defineProperty(this, "mapDataPercent2Real", function (dataArray, baseW, baseH) {
    return dataArray.map(function (item) {
      item.position = positionP2S(item.position, baseW, baseH);
      return item;
    });
  });

  this.marker = this._makeMarker(_parentEl, _draftEl, _configs);
};


// EXTERNAL MODULE: ./styles/marker.scss
var marker = __webpack_require__("3d0d");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/VuePicMarker.vue?vue&type=script&lang=js&
function VuePicMarkervue_type_script_lang_js_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function VuePicMarkervue_type_script_lang_js_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { VuePicMarkervue_type_script_lang_js_ownKeys(Object(source), true).forEach(function (key) { VuePicMarkervue_type_script_lang_js_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { VuePicMarkervue_type_script_lang_js_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function VuePicMarkervue_type_script_lang_js_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var empImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==";
/* harmony default export */ var VuePicMarkervue_type_script_lang_js_ = ({
  name: "VuePicMarker",
  props: {
    readOnly: Boolean,
    showGrid: Boolean,
    imgUrl: String,
    uniqueKey: [String, Number],
    width: [String, Number],
    height: [String, Number],
    allowClickAdd: {
      type: Boolean,
      default: true
    },
    allowDragAdd: {
      type: Boolean,
      default: true
    },
    dotSize: Number,
    comment: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    imgUrl: function imgUrl(n, o) {
      this.currentBaseImage = n;
    },
    width: function width(n, o) {
      this.__updateFrame();
    },
    readOnly: function readOnly(n, o) {
      this.updateConfig({
        editable: !n
      });
    },
    showGrid: function showGrid(n, o) {
      this.updateConfig({
        showGrid: n
      });
    }
  },
  data: function data() {
    return {
      emptyImg: empImg,
      options: undefined,
      currentBaseImage: undefined,
      rootClass: "",
      key: "",
      loading: true,
      type: ""
    };
  },
  beforeMount: function beforeMount() {
    this.key = this.uniqueKey;
    this.rootClass = this.uniqueKey ? "pannel-".concat(this.uniqueKey) : undefined;
  },
  mounted: function mounted() {
    this.__updateFrame();
  },
  created: function created() {
    var self = this;
    this.options = {
      options: {
        blurOtherDots: true,
        blurOtherDotsShowTags: true,
        editable: !this.readOnly,
        showGrid: this.showGrid,
        trashPositionStart: 1,
        allowClickAdd: this.allowClickAdd,
        allowDragAdd: this.allowDragAdd,
        dotSize: this.dotSize || 20,
        comment: this.comment
      },
      onDataRendered: self.onDataRendered,
      onAnnoClick: self.onAnnoClick,
      onAnnoDblClick: self.onAnnoDblClick,
      onUpdated: self.onUpdated,
      onDrawOne: self.onDrawOne,
      onAnnoChanged: self.onAnnoChanged,
      onAnnoContextMenu: self.onAnnoContextMenu,
      onAnnoRemoved: self.onAnnoRemoved,
      onAnnoSelected: self.onAnnoSelected
    };

    if (/^.+$/.test(this.imgUrl)) {
      this.currentBaseImage = this.imgUrl;
    } else {
      this.currentBaseImage = this.emptyImg;
    }

    this.$nextTick(function () {
      self.__initMarker();

      self.$emit("ready", self.key);
    });
  },
  activated: function activated() {
    this.rootClass = "pannel-".concat(this.key);
    this.$emit("ready", this.key);
  },
  methods: {
    getMarker: function getMarker() {
      return this.marker;
    },
    __updateFrame: function __updateFrame() {
      var root = this.$el;

      if (!root) {
        return;
      }

      var width = this.width,
          height = this.height;

      if (!width) {
        width = "100%";
      }

      if (!height) {
        height = "auto";
      }

      root.style.width = width.endsWith("%") ? width : "".concat(parseInt(width), "px");
      root.style.height = height === "auto" ? height : height.endsWith("%") ? height : "".concat(parseInt(height), "px");
      root.querySelectorAll(".vue-pic-marker-image,.vue-pic-marker-raw-image").forEach(function (element) {
        element.style.width = root.style.width;
        element.style.height = height === "auto" ? height : height.endsWith("%") ? height : "".concat(parseInt(height), "px");
      });
    },
    __initMarker: function __initMarker() {
      var self = this;
      var root = this.$el;

      if (!root) {
        return;
      }

      self.marker = new marker_ImageMarker(root.querySelector(".annotate"), // box
      root.querySelector(".draft "), // draft
      self.options);
    },
    onImageLoad: function onImageLoad(e) {
      var rawData = {
        rawW: e.target.naturalWidth,
        rawH: e.target.naturalHeight,
        currentW: e.target.offsetWidth,
        currentH: e.target.offsetHeight
      };

      if (!this.currentBaseImage.startsWith("data")) {
        this.$emit("image-load", rawData, this.key);
      }

      this.loading = false;
    },
    // marker
    onDataRendered: function onDataRendered() {
      this.$emit("data-rendered", this.key);
    },
    onUpdated: function onUpdated(data, movement) {
      this.$emit("updated", data, movement, this.key);
    },
    onDrawOne: function onDrawOne(data, movement) {
      this.$emit("draw", data, movement, this.key);
    },
    onAnnoChanged: function onAnnoChanged(value, oldValue) {
      this.$emit("change", value, oldValue, this.key);
    },
    onAnnoClick: function onAnnoClick(e, ab, node) {
      this.$emit("anno-click", e, ab, node, this.key);
    },
    onAnnoDblClick: function onAnnoDblClick(e, ab, node) {
      this.$emit("anno-dblclick", e, ab, node, this.key);
    },
    onAnnoContextMenu: function onAnnoContextMenu(e, ab, node) {
      this.$emit("context-menu", e, ab, node, this.key);
    },
    onAnnoRemoved: function onAnnoRemoved(data) {
      this.$emit("remove", data, this.key);
    },
    onAnnoSelected: function onAnnoSelected(selectData, node) {
      this.$emit("select", selectData, node, this.key);
    },
    dispatchEvent: function dispatchEvent(event, data) {
      if (this.marker) {
        return this.marker[event](data);
      }
    },
    renderData: function renderData(data, wh) {
      if (this.marker) {
        this.marker.renderData(data, wh);
      }
    },
    clearData: function clearData() {
      if (this.marker) {
        this.marker.clearData();
      }
    },
    setTag: function setTag(tag) {
      if (this.marker) {
        this.marker.setTag(tag);
      }
    },
    setType: function setType(type) {
      if (this.marker) {
        this.type = type;
        this.marker.setType(type);
      }
    },
    renderer: function renderer(imageUrl) {
      this.currentBaseImage = imageUrl;
      this.imgUrl = imageUrl;
    },
    updateConfig: function updateConfig(options) {
      this.options.options = VuePicMarkervue_type_script_lang_js_objectSpread(VuePicMarkervue_type_script_lang_js_objectSpread({}, this.options.options), options);

      if (this.marker) {
        this.marker.updateConfig(this.options);
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/VuePicMarker.vue?vue&type=script&lang=js&
 /* harmony default export */ var packages_VuePicMarkervue_type_script_lang_js_ = (VuePicMarkervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./packages/VuePicMarker.vue?vue&type=style&index=0&id=fe5e12b0&lang=scss&scoped=true&
var VuePicMarkervue_type_style_index_0_id_fe5e12b0_lang_scss_scoped_true_ = __webpack_require__("e54e");

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

// CONCATENATED MODULE: ./packages/VuePicMarker.vue






/* normalize component */

var component = normalizeComponent(
  packages_VuePicMarkervue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "fe5e12b0",
  null
  
)

/* harmony default export */ var VuePicMarker = (component.exports);
// CONCATENATED MODULE: ./packages/index.js


var packages_install = function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component(VuePicMarker.name, VuePicMarker);
}; // 检测到Vue再执行


if (typeof window !== 'undefined' && window.Vue) {
  packages_install(window.Vue);
}

/* harmony default export */ var packages_0 = ({
  install: packages_install,
  VuePicMarker: VuePicMarker
});
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (packages_0);



/***/ })

/******/ });
});
//# sourceMappingURL=vue-pic-marker.umd.js.map