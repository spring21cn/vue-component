(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    context.VueXtableTooltip = definition(context.tools, context.baseTable);
  }
})(this, function(tools) {

  var VueXtableTooltip = {
    name: 'VueXtableTooltip',
    props: {
      value: Boolean,
      trigger: {
        type: String,
        default: function _default() {
          return GlobalConfig.tooltip.trigger;
        }
      },
      theme: {
        type: String,
        default: function _default() {
          return GlobalConfig.tooltip.theme;
        }
      },
      content: [String, Function],
      zIndex: [String, Number],
      isArrow: {
        type: Boolean,
        default: true
      },
      enterable: Boolean,
      leaveDelay: {
        type: Number,
        default: GlobalConfig.tooltip.leaveDelay
      }
    },
    data: function data() {
      return {
        isUpdate: false,
        isHover: false,
        visible: false,
        message: '',
        tipZindex: 0,
        tipStore: {
          style: {},
          placement: '',
          arrowStyle: null
        }
      };
    },
    watch: {
      content: function content(value) {
        this.message = value;
      },
      value: function value(_value) {
        if (!this.isUpdate) {
          this[_value ? 'show' : 'close']();
        }
  
        this.isUpdate = false;
      }
    },
    mounted: function mounted() {
      var $el = this.$el,
          trigger = this.trigger,
          content = this.content,
          value = this.value;
      var parentNode = $el.parentNode;
      var target;
      this.message = content;
      this.tipZindex = tools.UtilTools.nextZIndex();
      VueUtil.values($el.children).forEach(function (elem, index) {
        if (index > 1) {
          parentNode.insertBefore(elem, $el);
  
          if (!target) {
            target = elem;
          }
        }
      });
      parentNode.removeChild($el);
      this.target = target;
  
      if (target) {
        if (trigger === 'hover') {
          target.onmouseleave = this.targetMouseleaveEvent;
          target.onmouseenter = this.targetMouseenterEvent;
        } else if (trigger === 'click') {
          target.onclick = this.clickEvent;
        }
      }
  
      if (value) {
        this.show();
      }
    },
    beforeDestroy: function beforeDestroy() {
      var $el = this.$el,
          target = this.target,
          trigger = this.trigger;
      var parentNode = $el.parentNode;
  
      if (parentNode) {
        parentNode.removeChild($el);
      }
  
      if (target) {
        if (trigger === 'hover') {
          target.onmouseenter = null;
          target.onmouseleave = null;
        } else if (trigger === 'click') {
          target.onclick = null;
        }
      }
    },
    render: function render(h) {
      var theme = this.theme,
          message = this.message,
          isHover = this.isHover,
          isArrow = this.isArrow,
          visible = this.visible,
          tipStore = this.tipStore,
          enterable = this.enterable;
      var on = null;
  
      if (enterable) {
        on = {
          mouseenter: this.wrapperMouseenterEvent,
          mouseleave: this.wrapperMouseleaveEvent
        };
      }
  
      return h('div', {
        class: ['vue-xtable-table--tooltip-wrapper', 'theme--'.concat(theme), 'placement--'.concat(tipStore.placement), {
          'is--enterable': enterable,
          'is--visible': visible,
          'is--arrow': isArrow,
          'is--hover': isHover
        }],
        style: tipStore.style,
        ref: 'tipWrapper',
        on: on
      }, [h('div', {
        class: 'vue-xtable-table--tooltip-content'
      }, this.$slots.content || message), h('div', {
        class: 'vue-xtable-table--tooltip-arrow',
        style: tipStore.arrowStyle
      })].concat(this.$slots.default));
    },
    methods: {
      show: function show() {
        return this.toVisible(this.target);
      },
      close: function close() {
        VueUtil.assign(this.tipStore, {
          style: {},
          placement: '',
          arrowStyle: null
        });
        this.update(false);
        return this.$nextTick();
      },
      update: function update(value) {
        if (value !== this.visible) {
          this.visible = value;
          this.isUpdate = true;
  
          if (this.$listeners.input) {
            this.$emit('input', this.visible);
          }
        }
      },
      updateZindex: function updateZindex() {
        if (this.tipZindex < tools.UtilTools.getLastZIndex()) {
          this.tipZindex = tools.UtilTools.nextZIndex();
        }
      },
      toVisible: function toVisible(target, message) {
        var _this = this;
  
        this.targetActive = true;
  
        if (target) {
          var $el = this.$el,
              tipStore = this.tipStore,
              zIndex = this.zIndex;
  
          var _DomTools$getAbsolute = tools.DomTools.getAbsolutePos(target),
              top = _DomTools$getAbsolute.top,
              left = _DomTools$getAbsolute.left;
  
          var _DomTools$getDomNode = tools.DomTools.getDomNode(),
              scrollTop = _DomTools$getDomNode.scrollTop,
              scrollLeft = _DomTools$getDomNode.scrollLeft,
              visibleWidth = _DomTools$getDomNode.visibleWidth;
  
          var parentNode = $el.parentNode;
          var tipLeft = left;
          tipStore.placement = 'top';
          tipStore.style = {
            width: 'auto'
          };
          tipStore.arrowStyle = {
            left: '50%'
          };
  
          if (!parentNode) {
            document.body.appendChild($el);
          }
  
          if (message) {
            this.message = message;
          }
  
          this.update(true);
          this.updateZindex();
          return this.$nextTick().then(function () {
            var wrapperElem = $el;
  
            if (wrapperElem) {
              var clientHeight = wrapperElem.clientHeight;
              var clientWidth = (parseFloat(getComputedStyle(wrapperElem).width) || 0);
              tipLeft = left + Math.floor((target.offsetWidth - clientWidth) / 2);
              tipStore.style = {
                zIndex: zIndex || _this.tipZindex,
                width: ''.concat(clientWidth, 'px'),
                top: ''.concat(top - clientHeight - 6, 'px'),
                left: ''.concat(tipLeft, 'px')
              };
              return _this.$nextTick();
            }
          }).then(function () {
            var wrapperElem = $el;
  
            if (wrapperElem) {
              var clientHeight = wrapperElem.clientHeight;
              var clientWidth = wrapperElem.clientWidth;
              VueUtil.assign(tipStore.style, {
                top: ''.concat(top - clientHeight - 6, 'px'),
                left: ''.concat(tipLeft, 'px')
              });
  
              if (top - clientHeight < scrollTop + 6) {
                tipStore.placement = 'bottom';
                tipStore.style.top = ''.concat(top + target.offsetHeight + 6, 'px');
              }
  
              if (tipLeft < scrollLeft + 6) {
                // 超出左边界
                tipLeft = scrollLeft + 6;
                tipStore.arrowStyle.left = ''.concat(left > tipLeft + 16 ? left - tipLeft + 16 : 16, 'px');
                tipStore.style.left = ''.concat(tipLeft, 'px');
              } else if (tipLeft + clientWidth > scrollLeft + visibleWidth) {
                // 超出右边界
                tipLeft = scrollLeft + visibleWidth - clientWidth - 6;
                tipStore.arrowStyle.left = ''.concat(clientWidth - Math.max(Math.floor((tipLeft + clientWidth - left) / 2), 22), 'px');
                tipStore.style.left = ''.concat(tipLeft, 'px');
              }
            }
          });
        }
  
        return this.$nextTick();
      },
      clickEvent: function clickEvent(event) {
        this[this.visible ? 'close' : 'show']();
      },
      targetMouseenterEvent: function targetMouseenterEvent(evnt) {
        this.show();
      },
      targetMouseleaveEvent: function targetMouseleaveEvent(evnt) {
        var _this2 = this;
  
        var trigger = this.trigger,
            enterable = this.enterable,
            leaveDelay = this.leaveDelay;
        this.targetActive = false;
  
        if (enterable && trigger === 'hover') {
          setTimeout(function () {
            if (!_this2.isHover) {
              _this2.close();
            }
          }, leaveDelay);
        } else {
          this.close();
        }
      },
      wrapperMouseenterEvent: function wrapperMouseenterEvent(evnt) {
        this.isHover = true;
      },
      wrapperMouseleaveEvent: function wrapperMouseleaveEvent(evnt) {
        var _this3 = this;
  
        var $listeners = this.$listeners,
            trigger = this.trigger,
            enterable = this.enterable,
            leaveDelay = this.leaveDelay;
        this.isHover = false;
  
        if ($listeners.leave) {
          this.$emit('leave', evnt);
        } else if (enterable && trigger === 'hover') {
          setTimeout(function () {
            if (!_this3.targetActive) {
              _this3.close();
            }
          }, leaveDelay);
        }
      }
    }
  };
  return VueXtableTooltip;
});