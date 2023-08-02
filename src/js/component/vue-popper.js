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
    sideValue = Math.max(Math.min(popper[len] - arrowSize - 3, sideValue), 0);
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
      },
      appendToDirectParent: Boolean  //append to referenceElm's direct parentNode
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
        } else if(self.appendToDirectParent) {
          self.appendElement = self.referenceElm.parentNode;
        }else {
          self.appendElement = self.referenceElm.parentNode;
          self.findeAbsoluteParent(self.referenceElm);
        }
        self.appendElement.appendChild(self.popperElm);
        self.popperElm.style.visibility = 'hidden';
        if (self.popperJS && self.popperJS.destroy) self.popperJS.destroy();
        options.placement = self.currentPlacement;
        options.offset = self.offset;
        options.autoWidth = self.autoWidth;
        self.popperJS = new Popper(reference, popper, options);
        self.popperJS.onCreate(function() {
          self.$emit('created', self);
          self.resetTransformOrigin();
          self.$nextTick(function() {
            self.updatePopper();
            self.popperElm.style.visibility = '';
          });
        });
        if (VueUtil.isFunction(options.onUpdate)) {
          self.popperJS.onUpdate(options.onUpdate);
        }
        self.popperJS._popper.style.zIndex = VueUtil.nextZIndex();
        !VueUtil.isIE && VueUtil.on(self.popperElm, 'click', self.stop);
        self.popperJS._popper.editor = self;
      },
      updatePopper: function() {
        this.popperJS ? this.popperJS.update() : this.createPopper();
      },
      destroyPopper: function(forceDestroy) {
        if ((this.showPopper && !forceDestroy) || !this.popperJS) return;
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
      this.destroyPopper(true);
    }
  };
  return VuePopper;
});
