!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'DateUtil', 'Screenfull', 'VueI18n', 'VueResource'], definition);
	} else {
		context[name] = definition(context['Vue'], context['DateUtil'], context['Screenfull']);
	}
})('VueUtil', this, function(Vue, DateUtil, Screenfull) {
	'use strict';
	var animation = false;
	var RESIZE_ANIMATION_NAME = 'resizeanim';
	var keyFramePrefix = '';
	var animationStartEvent = 'animationstart';
	var stylesCreated = false;
	var DOM_PREFIXES = 'Webkit Moz O ms'.split(' ');
	var START_EVENTS = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' ');
	var attachEvent = typeof window === 'undefined' ? {} : document.attachEvent;
	var nodeList = [];
	var ctx = '@@clickoutsideContext';
	var clickOutSideFn = function(e) {
		nodeList.forEach(function(node) {
			node[ctx].documentHandler(e)
		});
	};
	if (!attachEvent && window !== 'undefined') {
		var testElement = document.createElement('fakeelement');
		if (testElement.style.animationName !== undefined) {
			animation = true;
		}
		if (animation === false) {
			var prefix = '';
			for (var i = 0; i < DOM_PREFIXES.length; i++) {
				if (testElement.style[DOM_PREFIXES[i] + 'AnimationName'] !== undefined) {
					prefix = DOM_PREFIXES[i];
					keyFramePrefix = '-' + prefix.toLowerCase() + '-';
					animationStartEvent = START_EVENTS[i];
					animation = true;
					break;
				}
			}
		}
	}
	var isServer = Vue.prototype.$isServer;
	var ieVersion = isServer ? 0 : Number(document.documentMode);
	var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
	var MOZ_HACK_REGEXP = /^moz([A-Z])/;
	var isVNode = function(node) {
		return typeof node === 'object' && Object.prototype.hasOwnProperty.call(node, 'componentOptions');
	};
	var isArray = Array.isArray || function(obj) {
		return toString.call(obj) === '[object Array]';
	};
	var isFunction = function(obj) {
		return typeof obj == 'function' || false;
	};
	var isObject = function(obj) {
		var type = typeof obj;
		return type === 'function' || type === 'object' && !!obj;
	};
	var instances = {};
	var popupManager = {
		zIndex: 2000,
		getInstance: function(id) {
			return instances[id];
		},
		register: function(id, instance) {
			if (id && instance) {
				instances[id] = instance;
			}
		},
		deregister: function(id) {
			if (id) {
				instances[id] = null;
				delete instances[id];
			}
		},
		nextZIndex: function() {
			return popupManager.zIndex++;
		},
		modalStack: [],
		openModal: function(id, zIndex) {
			if (Vue.prototype.$isServer)
				return;
			if (!id || zIndex === undefined)
				return;
			var modalStack = this.modalStack;
			for (var i = 0, j = modalStack.length; i < j; i++) {
				var item = modalStack[i];
				if (item.id === id) {
					return;
				}
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
	var on = (function() {
		if (!isServer && document.addEventListener) {
			return function(element, event, handler) {
				if (element && event && handler) {
					element.addEventListener(event, handler, false);
				}
			}
		} else {
			return function(element, event, handler) {
				if (element && event && handler) {
					element.attachEvent('on' + event, handler);
				}
			}
		}
	})();
	var off = (function() {
		if (!isServer && document.removeEventListener) {
			return function(element, event, handler) {
				if (element && event) {
					element.removeEventListener(event, handler, false);
				}
			}
		} else {
			return function(element, event, handler) {
				if (element && event) {
					element.detachEvent('on' + event, handler);
				}
			}
		}
	})();
	var once = function(el, event, fn) {
		var listener = function() {
			if (fn) {
				fn.apply(this, arguments);
			}
			off(el, event, listener);
		};
		on(el, event, listener);
	};
	var trim = function(string) {
		if (typeof string !== 'string') string = '';
		return string.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
	};
	var hasClass = function(el, clazz) {
		if (!el || !clazz)
			return false;
		if (clazz.indexOf(' ') !== -1)
			throw new Error('className should not contain space.');
		if (el.classList) {
			return el.classList.contains(clazz);
		} else {
			return (' ' + el.className + ' ').indexOf(' ' + clazz + ' ') > -1;
		}
	};
	var addClass = function(el, clazz) {
		if (!el)
			return;
		var curClass = el.className;
		var classes = (clazz || '').split(' ');
		for (var i = 0, j = classes.length; i < j; i++) {
			var _className = classes[i];
			if (!_className)
				continue;
			if (el.classList) {
				el.classList.add(_className);
			} else {
				if (!hasClass(el, _className)) {
					curClass += ' ' + _className;
				}
			}
		}
		if (!el.classList) {
			el.className = curClass;
		}
	};
	var removeClass = function(el, clazz) {
		if (!el || !clazz)
			return;
		var classes = clazz.split(' ');
		var curClass = ' ' + el.className + ' ';
		for (var i = 0, j = classes.length; i < j; i++) {
			var clsName = classes[i];
			if (!clsName)
				continue;
			if (el.classList) {
				el.classList.remove(clsName);
			} else {
				if (hasClass(el, clsName)) {
					curClass = curClass.replace(' ' + clsName + ' ', ' ');
				}
			}
		}
		if (!el.classList) {
			el.className = trim(curClass);
		}
	};
	var camelCase = function(name) {
		return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
			return offset ? letter.toUpperCase() : letter;
		}).replace(MOZ_HACK_REGEXP, 'Moz$1');
	};
	var getStyle = ieVersion < 9 ? function(element, styleName) {
		if (isServer) return;
		if (!element || !styleName) return null;
		styleName = camelCase(styleName);
		if (styleName === 'float') {
			styleName = 'styleFloat';
		}
		try {
			switch (styleName) {
			case 'opacity':
				try {
					return element.filters.item('alpha').opacity / 100;
				} catch (e) {
					return 1.0;
				}
			default:
				return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
			}
		} catch (e) {
			return element.style[styleName];
		}
	} : function(element, styleName) {
		if (isServer) return;
		if (!element || !styleName) return null;
		styleName = camelCase(styleName);
		if (styleName === 'float') {
			styleName = 'cssFloat';
		}
		try {
			var computed = document.defaultView.getComputedStyle(element, '');
			return element.style[styleName] || computed ? computed[styleName] : null;
		} catch (e) {
			return element.style[styleName];
		}
	};
	var setStyle = function(element, styleName, value) {
		if (!element || !styleName) return;
		if (typeof styleName === 'object') {
			for (var prop in styleName) {
				if (styleName.hasOwnProperty(prop)) {
					setStyle(element, prop, styleName[prop]);
				}
			}
		} else {
			styleName = camelCase(styleName);
			if (styleName === 'opacity' && ieVersion < 9) {
				element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
			} else {
				element.style[styleName] = value;
			}
		}
	};
	var merge = function(target) {
		for (var i = 1, j = arguments.length; i < j; i++) {
			var source = arguments[i] || {};
			for (var prop in source) {
				var value = source[prop];
				if (value !== undefined) {
					target[prop] = value;
				}
			}
		}
		return target;
	};
	var mergeArray = function(arr) {
		if (isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length), j = arr.length; i < j; i++) {
				var arrObj = arr[i];
				if (isObject(arrObj)) {
					arr2[i] = merge({}, arrObj);
				} else {
					arr2[i] = arrObj;
				}
			}
			return arr2;
		}
		return [];
	};
	var broadcast = function(componentName, eventName, params) {
		this.$children.forEach(function(child) {
			var name = child.$options.componentName;
			if (name === componentName) {
				child.$emit.apply(child, [eventName].concat(params));
			} else {
				broadcast.apply(child, [componentName, eventName].concat([params]));
			}
		});
	};
	var emitter = {
		methods: {
			dispatch: function(componentName, eventName, params) {
				var parent = this.$parent || this.$root;
				var name = parent.$options.componentName;
				while (parent && (!name || name !== componentName)) {
					parent = parent.$parent;
					if (parent) {
						name = parent.$options.componentName;
					}
				}
				if (parent) {
					parent.$emit.apply(parent, [eventName].concat(params));
				}
			},
			broadcast: function(componentName, eventName, params) {
				broadcast.call(this, componentName, eventName, params);
			}
		}
	};
	var menumixin = {
		computed: {
			indexPath: function() {
				var path = [this.index];
				var parent = this.$parent;
				while (parent.$options.componentName !== 'VueMenu') {
					if (parent.index) {
						path.unshift(parent.index);
					}
					parent = parent.$parent;
				}
				return path;
			},
			rootMenu: function() {
				var parent = this.$parent;
				while (parent && parent.$options.componentName !== 'VueMenu') {
					parent = parent.$parent;
				}
				return parent;
			},
			parentMenu: function() {
				var parent = this.$parent;
				while (parent && ['VueMenu', 'VueSubmenu'].indexOf(parent.$options.componentName) === -1) {
					parent = parent.$parent;
				}
				return parent;
			},
			paddingStyle: function() {
				if (this.rootMenu.mode !== 'vertical')
					return {};
				var padding = 20;
				var parent = this.$parent;
				while (parent && parent.$options.componentName !== 'VueMenu') {
					if (parent.$options.componentName === 'VueSubmenu') {
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
	var transition = function() {};
	transition.prototype.beforeEnter = function(el) {
		if (!el.dataset)
			el.dataset = {};
		el.dataset.oldPaddingTop = el.style.paddingTop;
		el.dataset.oldPaddingBottom = el.style.paddingBottom;
		el.style.height = '0';
		el.style.paddingTop = 0;
		el.style.paddingBottom = 0;
	}
	transition.prototype.enter = function(el) {
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
	}
	transition.prototype.afterEnter = function(el) {
		el.style.height = '';
		el.style.overflow = el.dataset.oldOverflow;
	}
	transition.prototype.beforeLeave = function(el) {
		if (!el.dataset)
			el.dataset = {};
		el.dataset.oldPaddingTop = el.style.paddingTop;
		el.dataset.oldPaddingBottom = el.style.paddingBottom;
		el.dataset.oldOverflow = el.style.overflow;
		el.style.height = el.scrollHeight + 'px';
		el.style.overflow = 'hidden';
	}
	transition.prototype.leave = function(el) {
		if (el.scrollHeight !== 0) {
			el.style.height = 0;
			el.style.paddingTop = 0;
			el.style.paddingBottom = 0;
		}
	}
	transition.prototype.afterLeave = function(el) {
		el.style.height = '';
		el.style.overflow = el.dataset.oldOverflow;
		el.style.paddingTop = el.dataset.oldPaddingTop;
		el.style.paddingBottom = el.dataset.oldPaddingBottom;
	}
	var collapseTransition = {
		functional: true,
		render: function(createElement, obj) {
			var children = obj.children;
			var data = {
				on: new transition()
			};
			children.forEach(function(child) {
				child.data.class = ['collapse-transition'];
			});
			return createElement('transition', data, children);
		}
	};
	var clickoutside = function() {
		if (!isServer) {
			on(document, 'click', clickOutSideFn);
		}
		return {
			bind: function(el, binding, vnode) {
				var id = nodeList.push(el) - 1;
				var documentHandler = function(e) {
					if (!vnode.context || el.contains(e.target) || (vnode.context.popperElm && vnode.context.popperElm.contains(e.target)))
						return;
					if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
						vnode.context[el[ctx].methodName]();
					} else {
						el[ctx].bindingFn && el[ctx].bindingFn();
					}
				};
				el[ctx] = {
					id: id,
					documentHandler: documentHandler,
					methodName: binding.expression,
					bindingFn: binding.value
				};
			},
			update: function(el, binding) {
				el[ctx].methodName = binding.expression;
				el[ctx].bindingFn = binding.value;
			},
			unbind: function(el) {
				for (var i = 0, j = nodeList.length; i < j; i++) {
					if (nodeList[i][ctx].id === el[ctx].id) {
						nodeList.splice(i, 1);
						break;
					}
				}
			}
		}
	};
	var throttle = function(delay, noTrailing, callback, debounceMode) {
		var timeoutID;
		var lastExec = 0;
		if (typeof noTrailing !== 'boolean') {
			debounceMode = callback;
			callback = noTrailing;
			noTrailing = undefined;
		}
		function wrapper() {
			var self = this;
			var elapsed = Number(new Date()) - lastExec;
			var args = arguments;
			function exec() {
				lastExec = Number(new Date());
				callback.apply(self, args);
			}
			function clear() {
				timeoutID = undefined;
			}
			if (debounceMode && !timeoutID) {
				exec();
			}
			if (timeoutID) {
				clearTimeout(timeoutID);
			}
			if (debounceMode === undefined && elapsed > delay) {
				exec();
			} else if (noTrailing !== true) {
				timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
			}
		}
		return wrapper;
	};
	var debounce = function(delay, atBegin, callback) {
		return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
	};
	var scrollBarWidth = function() {
		if (isServer)
			return;
		var outer = document.createElement('div');
		outer.className = 'vue-scrollbar__wrap';
		outer.style.visibility = 'hidden';
		outer.style.width = '100px';
		outer.style.position = 'absolute';
		outer.style.top = '-9999px';
		document.body.appendChild(outer);
		var widthNoScroll = outer.offsetWidth;
		outer.style.overflow = 'scroll';
		var inner = document.createElement('div');
		inner.style.width = '100%';
		outer.appendChild(inner);
		var widthWithScroll = inner.offsetWidth;
		outer.parentNode.removeChild(outer);
		return widthNoScroll - widthWithScroll;
	};
	var createStyles = function() {
		if (!stylesCreated && window !== 'undefined') {
			var animationKeyframes = '@' + keyFramePrefix + 'keyframes ' + RESIZE_ANIMATION_NAME + ' { from { opacity: 0; } to { opacity: 0; } } ';
			var animationStyle = keyFramePrefix + 'animation: 1ms ' + RESIZE_ANIMATION_NAME + ';';
			var css = animationKeyframes + '\n .resize-triggers { ' + animationStyle + ' visibility: hidden; opacity: 0; }\n .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; }\n .resize-triggers > div { background: #eee; overflow: auto; }\n .contract-trigger:before { width: 200%; height: 200%; }';
			var head = document.head || document.getElementsByTagName('head')[0];
			var style = document.createElement('style');
			style.type = 'text/css';
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}
			head.appendChild(style);
			stylesCreated = true;
		}
	};
	var resetTrigger = function(element) {
		var trigger = element.__resizeTrigger__;
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
	var requestFrame = (function() {
		if (typeof window === 'undefined')
			return;
		var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(fn) {
			return window.setTimeout(fn, 20);
		}
		return function(fn) {
			return raf(fn);
		}
	})();
	var cancelFrame = (function() {
		if (typeof window === 'undefined')
			return;
		var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
		return function(id) {
			return cancel(id);
		}
	})();
	var checkTriggers = function(element) {
		return element.offsetWidth !== element.__resizeLast__.width || element.offsetHeight !== element.__resizeLast__.height;
	};
	var scrollListener = function(event) {
		var self = this;
		resetTrigger(self);
		if (self.__resizeRAF__)
			cancelFrame(self.__resizeRAF__);
		self.__resizeRAF__ = requestFrame(function() {
			if (checkTriggers(self)) {
				self.__resizeLast__.width = self.offsetWidth;
				self.__resizeLast__.height = self.offsetHeight;
				self.__resizeListeners__.forEach(function(fn) {
					fn.call(self, event);
				});
			}
		});
	};
	var addResizeListener = function(element, fn) {
		if (window === 'undefined')
			return;
		if (attachEvent) {
			element.attachEvent('onresize', fn);
		} else {
			if (!element.__resizeTrigger__) {
				if (getComputedStyle(element).position === 'static') {
					element.style.position = 'relative';
				}
				createStyles();
				element.__resizeLast__ = {};
				element.__resizeListeners__ = [];
				var resizeTrigger = element.__resizeTrigger__ = document.createElement('div');
				resizeTrigger.className = 'resize-triggers';
				resizeTrigger.innerHTML = '<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>';
				element.appendChild(resizeTrigger);
				resetTrigger(element);
				element.addEventListener('scroll', scrollListener, true);
				if (animationStartEvent) {
					resizeTrigger.addEventListener(animationStartEvent, function(event) {
						if (event.animationName === RESIZE_ANIMATION_NAME) {
							resetTrigger(element);
						}
					});
				}
			}
			element.__resizeListeners__.push(fn);
		}
	};
	var removeResizeListener = function(element, fn) {
		if (attachEvent) {
			element.detachEvent('onresize', fn);
		} else {
			element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
			if (!element.__resizeListeners__.length) {
				element.removeEventListener('scroll', scrollListener);
				element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
			}
		}
	};
	var newArray = function(start, end) {
		var result = [];
		for (var i = start; i <= end; i++) {
			result.push(i);
		}
		return result;
	};
	var equalDate = function(dateA, dateB) {
		return dateA === dateB || new Date(dateA).getTime() === new Date(dateB).getTime();
	};
	var isDate = function(date) {
		if (date === null || date === undefined) return false;
		if (isNaN(new Date(date).getTime())) return false;
		return true;
	};
	var toDate = function(date) {
		return isDate(date) ? new Date(date) : null;
	};
	var formatDate = function(date, format) {
		date = toDate(date);
		if (!date) return '';
		return DateUtil.format(date, format || 'yyyy-MM-dd');
	};
	var parseDate = function(string, format) {
		return DateUtil.parse(string, format || 'yyyy-MM-dd');
	};
	var getDayCountOfMonth = function(year, month) {
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
		temp.setDate(1);
		return temp.getDay();
	};
	var getStartDateOfMonth = function(year, month) {
		var DAY_DURATION = 86400000;
		var result = new Date(year, month, 1);
		var day = result.getDay();
		if (day === 0) {
			result.setTime(result.getTime() - DAY_DURATION * 7);
		} else {
			result.setTime(result.getTime() - DAY_DURATION * day);
		}
		return result;
	};
	var getWeekNumber = function(src) {
		var date = toDate(src);
		date.setHours(0, 0, 0, 0);
		date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
		var week1 = new Date(date.getFullYear(), 0, 4);
		return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
	};
	var prevMonth = function(src) {
		src = toDate(src);
		var year = src.getFullYear();
		var month = src.getMonth();
		var date = src.getDate();
		var newYear = month === 0 ? year - 1 : year;
		var newMonth = month === 0 ? 11 : month - 1;
		var newMonthDayCount = getDayCountOfMonth(newYear, newMonth);
		if (newMonthDayCount < date) {
			src.setDate(newMonthDayCount);
		}
		src.setMonth(newMonth);
		src.setFullYear(newYear);
		return new Date(src.getTime());
	};
	var nextMonth = function(src) {
		src = toDate(src);
		var year = src.getFullYear();
		var month = src.getMonth();
		var date = src.getDate();
		var newYear = month === 11 ? year + 1 : year;
		var newMonth = month === 11 ? 0 : month + 1;
		var newMonthDayCount = getDayCountOfMonth(newYear, newMonth);
		if (newMonthDayCount < date) {
			src.setDate(newMonthDayCount);
		}
		src.setMonth(newMonth);
		src.setFullYear(newYear);
		return new Date(src.getTime());
	};
	var getRangeHours = function(ranges) {
		var hours = [];
		var disabledHours = [];
		(ranges || []).forEach(function(range) {
			var value = range.map(function(date) {
				return date.getHours();
			});
			disabledHours = disabledHours.concat(newArray(value[0], value[1]));
		});
		if (disabledHours.length) {
			for (var i = 0; i < 24; i++) {
				hours[i] = disabledHours.indexOf(i) === -1;
			}
		} else {
			for (var i = 0; i < 24; i++) {
				hours[i] = false;
			}
		}
		return hours;
	};
	var limitRange = function(date, ranges, format) {
		format = format || 'yyyy-MM-dd HH:mm:ss';
		if (!ranges || !ranges.length) return date;
		var len = ranges.length;
		date = DateUtil.parse(DateUtil.format(date, format), format);
		for (var i = 0; i < len; i++) {
			var range = ranges[i];
			if (date >= range[0] && date <= range[1]) {
				return date;
			}
		}
		var maxDate = ranges[0][0];
		var minDate = ranges[0][0];
		ranges.forEach(function(range) {
			minDate = new Date(Math.min(range[0], minDate));
			maxDate = new Date(Math.max(range[1], maxDate));
		});
		return date < minDate ? minDate : maxDate;
	};
	var setLang = function(lang) {
		if (lang) {
			Vue.config.lang = lang;
		}
	};
	var setLocale = function(lang, langObjs) {
		langObjs = merge({}, Vue.locale(lang), langObjs);
		Vue.locale(lang, langObjs);
	};
	var noLog = function() {
		Vue.config.silent = true;
	};
	var arrayfrom = function(arr) {
		var isCallable = function(fn) {
			return typeof fn === 'function' || Object.prototype.toString.call(fn) === '[object Function]';
		};
		var toInteger = function(value) {
			var number = Number(value);
			if (isNaN(number)) {
				return 0;
			}
			if (number === 0 || !isFinite(number)) {
				return number;
			}
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function(value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};
		var from = function(arrayLike) {
			var C = this;
			var items = Object(arrayLike);
			if (arrayLike == null) {
				throw new TypeError("Array.from requires an array-like object - not null or undefined");
			}
			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;
			if (typeof mapFn !== 'undefined') {
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}
			var len = toLength(items.length);
			var A = isCallable(C) ? Object(new C(len)) : new Array(len);
			var k = 0;
			var kValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					A[k] = kValue;
				}
				k += 1;
			}
			A.length = len;
			return A;
		}
		return from(arr);
	};
	var toConsumableArray = function(arr) {
		if (isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length), j = arr.length; i < j; i++) {
				arr2[i] = arr[i];
			}
			return arr2;
		} else {
			return arrayfrom(arr);
		}
	};
	var removeNode = function(node) {
		node && node.parentElement && node.parentElement.removeChild(node);
	};
	var insertNodeAt = function(fatherNode, node, position) {
		if (typeof position === 'undefined') position = 0;
		var refNode = (position === 0) ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling
		fatherNode.insertBefore(node, refNode)
	};
	var arrayToObject = function(arr) {
		var res = {};
		for (var i = 0, j = arr.length; i < j; i++) {
			var arrObj = arr[i];
			if (arrObj) {
				for (var key in arrObj) {
					res[key] = arrObj[key];
				}
			}
		}
		return res;
	};
	var loadVue = function(url, mountId, option, callbackFn) {
		var mountElement = document.querySelector(mountId);
		if (mountElement) {
			mountElement.innerHTML = '';
			if (typeof option === 'undefined') option = {};
			Vue.http.get(url).then(function(response) {
				var tmpDiv = document.createElement('DIV');
				tmpDiv.innerHTML = response.bodyText;
				var vueStyle = tmpDiv.querySelector('style');
				if (vueStyle.id && !document.querySelector('#' + vueStyle.id)) {
					mountElement.appendChild(vueStyle);
				}
				var vueScript = tmpDiv.querySelector('script');
				var newScript = document.createElement('script');
				newScript.innerHTML = "!(function(name, context, definition) {'use strict';context[name] = definition();})('_loadVue', this, function(Vue, VueUtil) {" + vueScript.innerHTML + "});";
				mountElement.appendChild(newScript).parentNode.removeChild(newScript);
				_loadVue.template = tmpDiv.querySelector('template').innerHTML;
				var newVue = Vue.extend(_loadVue);
				var newMount = new newVue(option);
				mountElement.appendChild(newMount.$mount().$el);
				if (typeof callbackFn === 'function') {
					callbackFn(newMount.$data, newMount);
				}
				_loadVue = null;
			});
		}
	};
	var screenfull = function() {
		if (!Screenfull.enabled) {
			this.$alert(this.$t('vue.screenfull.canot'), {
				type: 'warning'
			});
			return false;
		}
		Screenfull.toggle();
	};
	var hasProperty = function(obj, path) {
		if (!isArray(path)) {
			return obj != null && hasOwnProperty.call(obj, path);
		}
		var length = path.length;
		for (var i = 0; i < length; i++) {
			var key = path[i];
			if (obj == null || !hasOwnProperty.call(obj, key)) {
				return false;
			}
			obj = obj[key];
		}
		return !!length;
	};
	var objKeys = function(obj) {
		if (!isObject(obj)) return [];
		if (Object.keys) return Object.keys(obj);
		var keys = [];
		for (var key in obj) if (hasProperty(obj, key)) keys.push(key);
		if (hasEnumBug) collectNonEnumProps(obj, keys);
		return keys;
	};
	var eq = function(a, b, aStack, bStack) {
		if (a === b)
			return a !== 0 || 1 / a === 1 / b;
		if (a == null || b == null)
			return false;
		if (a !== a)
			return b !== b;
		var type = typeof a;
		if (type !== 'function' && type !== 'object' && typeof b != 'object')
			return false;
		return deepEq(a, b, aStack, bStack);
	};
	var deepEq = function(a, b, aStack, bStack) {
		var className = toString.call(a);
		if (className !== toString.call(b))
			return false;
		switch (className) {
		case '[object RegExp]':
		case '[object String]':
			return '' + a === '' + b;
		case '[object Number]':
			if (+a !== +a)
				return +b !== +b;
			return +a === 0 ? 1 / +a === 1 / b : +a === +b;
		case '[object Date]':
		case '[object Boolean]':
			return +a === +b;
		case '[object Symbol]':
			return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
		}
		var areArrays = className === '[object Array]';
		if (!areArrays) {
			if (typeof a != 'object' || typeof b != 'object')
				return false;
			var aCtor = a.constructor;
			var bCtor = b.constructor;
			if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor'in a && 'constructor'in b)) {
				return false;
			}
		}
		aStack = aStack || [];
		bStack = bStack || [];
		var length = aStack.length;
		while (length--) {
			if (aStack[length] === a)
				return bStack[length] === b;
		}
		aStack.push(a);
		bStack.push(b);
		if (areArrays) {
			length = a.length;
			if (length !== b.length)
				return false;
			while (length--) {
				if (!eq(a[length], b[length], aStack, bStack))
					return false;
			}
		} else {
			var keys = objKeys(a), key;
			length = keys.length;
			if (objKeys(b).length !== length)
				return false;
			while (length--) {
				key = keys[length];
				if (!(hasProperty(b, key) && eq(a[key], b[key], aStack, bStack)))
					return false;
			}
		}
		aStack.pop();
		bStack.pop();
		return true;
	};
	var mouseEvents = ('ontouchstart' in window) ? {
		down: 'touchstart',
		move: 'touchmove',
		up: 'touchend'
	} : {
		down: 'mousedown',
		move: 'mousemove',
		up: 'mouseup'
	};
	return {
		on: on,
		off: off,
		once: once,
		trim: trim,
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		getStyle: getStyle,
		setStyle: setStyle,
		merge: merge,
		mergeArray: mergeArray,
		addResizeListener: addResizeListener,
		removeResizeListener: removeResizeListener,
		parseDate: parseDate,
		formatDate: formatDate,
		isDate: isDate,
		toDate: toDate,
		setLang: setLang,
		setLocale: setLocale,
		removeNode: removeNode,
		insertNodeAt: insertNodeAt,
		arrayToObject: arrayToObject,
		screenfull: screenfull,
		loadVue: loadVue,
		isEqual: eq,
		prevMonth: prevMonth,
		nextMonth: nextMonth,
		noLog: noLog,
		component: {
			menumixin: menumixin,
			emitter: emitter,
			collapseTransition: collapseTransition,
			clickoutside: clickoutside,
			throttle: throttle,
			debounce: debounce,
			scrollBarWidth: scrollBarWidth,
			getRangeHours: getRangeHours,
			getStartDateOfMonth: getStartDateOfMonth,
			getDayCountOfMonth: getDayCountOfMonth,
			limitRange: limitRange,
			getFirstDayOfMonth: getFirstDayOfMonth,
			getWeekNumber: getWeekNumber,
			toConsumableArray: toConsumableArray,
			isVNode: isVNode,
			popupManager: popupManager,
			mouseEvents: mouseEvents
		}
	}
});
