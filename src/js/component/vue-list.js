(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueList = definition(context.Vue, context.VueUtil);
    delete context.VueList;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueList = {
    name: 'VueList',
    data: function() {
      return {
        defaultSlotLen: 0,
        activedIndex: null,
        keyList: [],
        isMobile: VueUtil.getSystemInfo().device == 'Mobile' && VueUtil.getSystemInfo().isLoadMobileJs ? true : false,
      };
    },
    props: {
      height: {
        type: Number,
        default: 200
      },
      onScroll: Function,
      defaultActivedIndex: {
        type: Number,
        default: 0
      },
      defaultSelected: {
        type: Boolean,
        default: true
      },
      scrollbar: Boolean
    },
    methods: {
      updateKeyList: function() {
        if(Array.isArray(this.$slots.default)) {
          this.keyList = this.$slots.default.map(function(item) {
            return item.key;
          });
        }
      },
      setItemIndex: function(item) {
        if(this.$slots.default.length != this.keyList.length) {
          this.updateKeyList();
        }
        item.index = this.keyList.indexOf(item.$vnode.key);
      },
      handleItemClick: function(itemObj) {
        this.activedIndex = itemObj.index;
      },
      handleScroll: function(e, scrollTop, isTop, isBottom) {
        if (!VueUtil.isDef(scrollTop)) {
          scrollTop = this.$el.scrollTop;
          isTop = (scrollTop === 0);
          isBottom = (scrollTop === this.$el.scrollHeight - this.$el.clientHeight);
        }
        this.updateZone(scrollTop);
        this.$emit('scroll', e, scrollTop, isTop, isBottom);
      },
      updateZone: function(offset) {
        var delta = this.delta;
        if (!VueUtil.isDef(delta)) return;
        if (delta.total <= delta.keeps) return;
        offset = offset || 0;
        var overs = Math.floor(offset / delta.size);
        overs < 0 && (overs = 0);
        var start = overs;
        var end = overs + delta.keeps;
        if (overs + delta.keeps >= delta.total) {
          end = delta.total;
          start = delta.total - delta.keeps;
        }
        delta.end = end;
        delta.start = start;
        this.$forceUpdate();
      },
      filter: function(slots) {
        var delta = this.delta;
        if (delta.keeps === 0 || slots.length <= delta.keeps) {
          delta.marginTop = 0;
          delta.marginBottom = 0;
          return slots;
        }
        delta.total = slots.length;
        delta.marginTop = delta.size * delta.start;
        delta.marginBottom = delta.size * (delta.total - delta.keeps - delta.start);
        var result = [];
        for (var i = delta.start, j = delta.end; i < j; i++) {
          result.push(slots[i]);
        }
        return result;
      },
      createDelta: function(slots) {
        var delta = this.delta = Object.create(null);
        delta.start = 0;
        delta.total = 0;
        delta.marginTop = 0;
        delta.marginBottom = 0;
        delta.size = this.isMobile?13:20;
        delta.remain = Math.floor(this.height * 1 / delta.size);
        delta.end = delta.remain;
        delta.keeps = delta.remain;
        if (slots.length <= delta.remain) {
          delta.end = slots.length;
          delta.keeps = slots.length;
        }
      }
    },
    render: function(createElement) {
      var slots = this.$slots.default;
      if (!VueUtil.isArray(slots)) return null;
      if (!VueUtil.isDef(this.delta) || this.defaultSlotLen !== slots.length) {
        this.createDelta(slots);
        this.defaultSlotLen = slots.length;
      }
      var delta = this.delta;
      var showList = this.filter(slots);
      var style = {
        'margin-top': delta.marginTop + 'px',
        'margin-bottom':  delta.marginBottom + 'px'
      };
      if (VueUtil.isChrome) {
        style = {
          'padding-top': delta.marginTop + 'px',
          'padding-bottom':  delta.marginBottom + 'px'
        };
      }
      var list = null;
      if (this.scrollbar) {
        list = createElement('div', {
          'class': ['vue-list'],
          'style': {
            'height': this.isMobile? '100%' : this.height * 1 + 'px'
          }
        }, [createElement('vue-scrollbar', {
            props: {
              height: this.isMobile? '100%' :this.height * 1
            },
            'on': {
              'scrollY': this.handleScroll
            },
            ref: 'scrollbar'
          }, [createElement('div', {
            'style': style
          }, showList)])
        ]);
      } else {
        list = createElement('div', {
          'class': ['vue-list'],
          'style': {
            'height':  this.isMobile? '100%' : this.height * 1 + 'px',
            'overflow': 'auto'
          },
          'on': {
            'scroll': this.handleScroll
          }
        }, [createElement('div', {
            'style': {
              'margin-top': delta.marginTop + 'px',
              'margin-bottom': delta.marginBottom + 'px',
              'height':this.isMobile? '100%' : this.height * 1 + 'px', 
            }
          }, showList)
        ]);
      }
      return list;
    },
    created: function() {
      this.updateKeyList();
    },
    mounted: function() {
      var self = this;
      self.$on('item-click', self.handleItemClick);
      if (self.defaultSelected && self.$slots.default) {
        self.$nextTick(function() {
          var defaultSlot = self.$slots.default[self.defaultActivedIndex];
          defaultSlot && defaultSlot.componentInstance && defaultSlot.componentInstance.handleClick();
        });
      }
    }
  };
  Vue.component(VueList.name, VueList);
});
