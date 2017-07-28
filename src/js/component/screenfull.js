!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(definition);
	} else {
		context[name] = definition();
	}
})('Screenfull', this, function() {
	'use strict';
	var document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};
	var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;
	var fn = (function () {
		var val;
		var fnMap = [['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'], ['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitFullscreenEnabled', 'webkitfullscreenchange', 'webkitfullscreenerror'], ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitfullscreenerror'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror'], ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError']];
		var i = 0;
		var l = fnMap.length;
		var ret = {};
		for (; i < l; i++) {
			val = fnMap[i];
			if (val && val[1]in document) {
				for (i = 0; i < val.length; i++) {
					ret[fnMap[0][i]] = val[i];
				}
				return ret;
			}
		}
		return false;
	})();
	var screenfull = {
		request: function (elem) {
			var request = fn.requestFullscreen;
			elem = elem || document.documentElement;
			if (/5\.1[.\d]* Safari/.test(navigator.userAgent)) {
				elem[request]();
			} else {
				elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
			}
		},
		exit: function () {
			document[fn.exitFullscreen]();
		},
		toggle: function (elem) {
			if (this.isFullscreen) {
				this.exit();
			} else {
				this.request(elem);
			}
		},
		onchange: function (callback) {
			document.addEventListener(fn.fullscreenchange, callback, false);
		},
		onerror: function (callback) {
			document.addEventListener(fn.fullscreenerror, callback, false);
		},
		raw: fn
	};
	if (!fn) {
		return false;
	}
	Object.defineProperties(screenfull, {
		isFullscreen: {
			get: function () {
				return Boolean(document[fn.fullscreenElement]);
			}
		},
		element: {
			enumerable: true,
			get: function () {
				return document[fn.fullscreenElement];
			}
		},
		enabled: {
			enumerable: true,
			get: function () {
				return Boolean(document[fn.fullscreenEnabled]);
			}
		}
	});
	return screenfull;
});
