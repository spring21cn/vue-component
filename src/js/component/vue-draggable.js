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

        var transform = document.defaultView.getComputedStyle(this._dragobj).transform; 
        if(transform && transform != 'none' && transform.split(',').length > 3) {
          this.translate3dX = parseFloat(transform.split(',')[4]);
        } else {
          this.translate3dX = 0;
        }

        this.elWidth = this._dragobj.offsetWidth;
        this.elHeight = this._dragobj.offsetHeight;

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

        if(i_y < 0) {
          i_y = 0;
        } 
        
        if(i_x + this.elWidth + this.translate3dX > document.documentElement.clientWidth) {
          i_x = document.documentElement.clientWidth - this.elWidth - this.translate3dX;
        }

        if(i_y + this.elHeight > document.documentElement.clientHeight) {
          i_y = document.documentElement.clientHeight - this.elHeight;
        }

        if(i_x + this.translate3dX < 0) {
          i_x = 0 - this.translate3dX;
        }

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
