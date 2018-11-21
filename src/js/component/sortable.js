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
