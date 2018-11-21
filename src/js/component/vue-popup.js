(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VuePopup = definition(context.Vue, context.VueUtil);
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var PopupManager = VueUtil.component.popupManager;
  VueUtil.on(document, 'keydown', function(event) {
    if (event.keyCode === 27) {
      if (PopupManager.modalStack.length > 0) {
        var topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1];
        if (!topItem) return;
        var instance = PopupManager.getInstance(topItem.id);
        if (instance.closeOnPressEscape) {
          instance.$emit('visible-change', false);
        }
      }
    }
  });
  var idSeed = 1;
  var VuePopup = {};
  VuePopup.model = {
    prop: 'visible',
    event: 'visible-change'
  };
  VuePopup.props = {
    visible: Boolean,
    openDelay: {},
    closeDelay: {},
    zIndex: {},
    closeOnPressEscape: {
      type: Boolean,
      default: true
    }
  };
  VuePopup.beforeMount = function() {
    this._popupId = 'popup-' + idSeed++;
    PopupManager.register(this._popupId, this);
  };
  VuePopup.beforeDestroy = function() {
    PopupManager.deregister(this._popupId);
    PopupManager.closeModal(this._popupId);
  };
  VuePopup.data = function() {
    return {
      opened: false
    };
  };
  VuePopup.watch = {
    visible: function(val) {
      var getDOM = function(dom) {
        if (dom.nodeType === 3) {
          dom = dom.nextElementSibling || dom.nextSibling;
          getDOM(dom);
        }
        return dom;
      };
      var self = this;
      if (val) {
        if (!self.opened) {
          self.$nextTick(function() {
            var dom = getDOM(self.$el);
            if (VueUtil.getStyle(dom, 'position') === 'static') {
              VueUtil.setStyle(dom, 'position', 'absolute');
            }
            dom.style.zIndex = PopupManager.nextZIndex();
            if (self.closeOnPressEscape)
              PopupManager.openModal(self._popupId, dom.style.zIndex);
          });
        }
      } else {
        PopupManager.closeModal(self._popupId);
        self.$nextTick(function() {
          if (self.opened && self.closeOnPressEscape) {
            var dom = getDOM(self.$el);
            PopupManager.openModal(self._popupId, dom.style.zIndex);
          }
        });
      }
    }
  };
  return VuePopup;
});
