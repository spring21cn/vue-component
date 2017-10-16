!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueDraggable', this, function(Vue, VueUtil) {
	'use strict';
	var mouseEvents = VueUtil.component.mouseEvents;
	var Bind = function(object, fun, args) {
		return function() {
			return fun.apply(object, args || []);
		}
	};
	var BindAsEventListener = function(object, fun) {
		var args = Array.prototype.slice.call(arguments).slice(2);
		return function(event) {
			return fun.apply(object, [event || window.event].concat(args));
		}
	};
	var Class = function(properties) {
		var _class = function() {
			return (arguments[0] !== null && this.initialize && typeof (this.initialize) == 'function') ? this.initialize.apply(this, arguments) : this;
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
			VueUtil.on(this._dragobj, mouseEvents.down, BindAsEventListener(this, this.Start, true));
			for (var i = 0, j = this._body.length; i < j; i++) {
				VueUtil.on(this._body[i], mouseEvents.down, BindAsEventListener(this, this.Cancelbubble));
			}
			VueUtil.on(this._resize, mouseEvents.down, BindAsEventListener(this, this.Start, false));
		},
		Cancelbubble: function(e) {
			document.all ? (e.cancelBubble = true) : (e.stopPropagation())
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
			if (typeof clientX === 'undefined' || typeof clientY === 'undefined') return;
			if (!isdrag) {
				this.Cancelbubble(e);
			}
			this._Css = isdrag ? {
				x: "left",
				y: "top"
			} : {
				x: "width",
				y: "height"
			}
			this._isdrag = isdrag;
			this._x = isdrag ? (clientX - this._dragobj.offsetLeft + this.offsetLeft) : (this._dragobj.offsetLeft || 0);
			this._y = isdrag ? (clientY - this._dragobj.offsetTop + this.offsetTop) : (this._dragobj.offsetTop || 0);
			if (document.all) {
				VueUtil.on(this._dragobj, "losecapture", this._fS);
				this._dragobj.setCapture();
			} else {
				e.preventDefault();
				VueUtil.on(window, "blur", this._fS);
			}
			VueUtil.on(document, mouseEvents.move, this._fM);
			VueUtil.on(document, mouseEvents.up, this._fS);
		},
		Move: function(e) {
			var clientX = e.clientX;
			var clientY = e.clientY;
			if (e.touches && e.touches[0]) {
				clientX = e.touches[0].clientX;
				clientY = e.touches[0].clientY;
			}
			if (typeof clientX === 'undefined' || typeof clientY === 'undefined') return;
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			var i_x = clientX - this._x;
			var i_y = clientY - this._y;
			this._dragobj.style[this._Css.x] = (this._isdrag ? i_x : Math.max(i_x, this.Minwidth)) + 'px';
			this._dragobj.style[this._Css.y] = (this._isdrag ? i_y : Math.max(i_y, this.Minheight)) + 'px'
			if (!this._isdrag) {
				VueUtil.setStyle(this._dragobj, 'height', Math.max(i_y, this.Minheight) - 2 * parseInt(VueUtil.getStyle(this._dragobj, 'paddingLeft')) + 'px');
			}
		},
		Stop: function() {
			VueUtil.off(document, mouseEvents.move, this._fM);
			VueUtil.off(document, mouseEvents.up, this._fS);
			if (document.all) {
				VueUtil.off(this._dragobj, "losecapture", this._fS);
				this._dragobj.releaseCapture();
			} else {
				VueUtil.off(window, "blur", this._fS);
			}
		}
	});
	var directive = function(Vue) {
		if (Vue.prototype.$isServer) return;
		Vue.directive('draggable', {
			inserted: function(el, binding) {
				var cancelObj = [];
				var resizeObj = null;
				var cancelSelectors = el.getAttribute('draggable-cancel-selector');
				if (cancelSelectors) {
					var cancelSelectorAry = cancelSelectors.split(',');
					for (var i = 0, j = cancelSelectorAry.length; i < j; i++) {
						var cancelSelector = cancelSelectorAry[i];
						cancelObj.push(el.querySelector(cancelSelector));
					}
				}
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
					}
					VueUtil.merge(resizeObj.style, resizeStyle);
					el.appendChild(resizeObj)
				}
				Vue.nextTick(function() {
					var displayStyle = VueUtil.getStyle(el, 'display')
					VueUtil.setStyle(el, 'display', 'block');
					var offsetLeft = el.offsetLeft;
					var offsetTop = el.offsetTop;
					VueUtil.setStyle(el, 'display', displayStyle);
					VueUtil.setStyle(el, 'position', 'relative');
					VueUtil.setStyle(el, 'zIndex', VueUtil.component.popupManager.nextZIndex());
					new dragEl(el,cancelObj,resizeObj,offsetLeft,offsetTop);
				});
			}
		});
	};
	Vue.use(directive);
});
