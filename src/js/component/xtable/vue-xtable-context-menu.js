(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    context.VueXtableContextMenu = definition(context.tools, context.baseTable).component;
    context.VueXtableContextMenuMixin = definition(context.tools, context.baseTable).mixin;
  }
})(this, function(tools, baseTable) {

  var Mixin = {
    methods: {
      /**
      * 关闭快捷菜单
      */
      _closeMenu: function _closeMenu() {
        VueUtil.assign(this.ctxMenuStore, {
          visible: false,
          selected: null,
          selectChild: null,
          showChild: false
        });
        return this.$nextTick();
      },
      // 处理菜单的移动
      moveCtxMenu: function moveCtxMenu(evnt, keyCode, ctxMenuStore, property, operKey, operRest, menuList) {
        var selectItem;
        var selectIndex = VueUtil.findIndexOf(menuList, function (item) {
          return ctxMenuStore[property] === item;
        });
  
        if (keyCode === operKey) {
          if (operRest && tools.UtilTools.hasChildrenList(ctxMenuStore.selected)) {
            ctxMenuStore.showChild = true;
          } else {
            ctxMenuStore.showChild = false;
            ctxMenuStore.selectChild = null;
          }
        } else if (keyCode === 38) {
          for (var len = selectIndex - 1; len >= 0; len--) {
            if (menuList[len].visible !== false) {
              selectItem = menuList[len];
              break;
            }
          }
  
          ctxMenuStore[property] = selectItem || menuList[menuList.length - 1];
        } else if (keyCode === 40) {
          for (var index = selectIndex + 1; index < menuList.length; index++) {
            if (menuList[index].visible !== false) {
              selectItem = menuList[index];
              break;
            }
          }
  
          ctxMenuStore[property] = selectItem || menuList[0];
        } else if (ctxMenuStore[property] && (keyCode === 13 || keyCode === 32)) {
          this.ctxMenuLinkEvent(evnt, ctxMenuStore[property]);
        }
      },
  
      /**
      * 快捷菜单事件处理
      */
      handleGlobalContextmenuEvent: function handleGlobalContextmenuEvent(evnt) {
        var isCtxMenu = this.isCtxMenu,
            ctxMenuStore = this.ctxMenuStore,
            ctxMenuOpts = this.ctxMenuOpts;
        var layoutList = ['header', 'body', 'footer'];
  
        if (isCtxMenu) {
          if (ctxMenuStore.visible) {
            if (ctxMenuStore.visible && this.$refs.ctxWrapper && this.getEventTargetNode(evnt, this.$refs.ctxWrapper.$el).flag) {
              evnt.preventDefault();
              return;
            }
          }
  
          for (var index = 0; index < layoutList.length; index++) {
            var layout = layoutList[index];
            var columnTargetNode = this.getEventTargetNode(evnt, this.$el, 'vue-xtable-'.concat(layout, '--column'));
            var params = {
              type: layout,
              $table: this,
              columns: this.visibleColumn.slice(0)
            };
  
            if (columnTargetNode.flag) {
              var cell = columnTargetNode.targetElem;
              var column = this.getColumnNode(cell).item;
              var typePrefix = ''.concat(layout, '-');
              VueUtil.assign(params, {
                column: column,
                columnIndex: this.getColumnIndex(column),
                cell: cell
              });
  
              if (layout === 'body') {
                var row = this.getRowNode(cell.parentNode).item;
                typePrefix = '';
                params.row = row;
                params.rowIndex = this.getRowIndex(row);
              }
  
              this.openContextMenu(evnt, layout, params);
  
              tools.UtilTools.emitEvent(this, ''.concat(typePrefix, 'cell-context-menu'), [params, evnt]);
  
              return;
            } else if (this.getEventTargetNode(evnt, this.$el, 'vue-xtable-table--'.concat(layout, '-wrapper')).flag) {
              if (ctxMenuOpts.trigger === 'cell') {
                evnt.preventDefault();
              } else {
                this.openContextMenu(evnt, layout, params);
              }
  
              return;
            }
          }
        }
  
        this.closeMenu();
        this.closeFilter();
      },
  
      /**
      * 显示快捷菜单
      */
      openContextMenu: function openContextMenu(evnt, type, params) {
        var _this = this;
  
        var ctxMenuStore = this.ctxMenuStore,
            ctxMenuOpts = this.ctxMenuOpts;
        var config = ctxMenuOpts[type];
        var visibleMethod = ctxMenuOpts.visibleMethod;
  
        if (config) {
          var options = config.options,
              disabled = config.disabled;
  
          if (disabled) {
            evnt.preventDefault();
          } else if (options && options.length) {
            params.options = options;
            this.preventEvent(evnt, 'event.show_menu', params, null, function () {
              if (!visibleMethod || visibleMethod(params, evnt)) {
                evnt.preventDefault();
  
                _this.updateZindex();
  
                var _DomTools$getDomNode = tools.DomTools.getDomNode(),
                    scrollTop = _DomTools$getDomNode.scrollTop,
                    scrollLeft = _DomTools$getDomNode.scrollLeft,
                    visibleHeight = _DomTools$getDomNode.visibleHeight,
                    visibleWidth = _DomTools$getDomNode.visibleWidth;
  
                var top = evnt.clientY + scrollTop;
                var left = evnt.clientX + scrollLeft;
                VueUtil.assign(ctxMenuStore, {
                  args: params,
                  visible: true,
                  list: options,
                  selected: null,
                  selectChild: null,
                  showChild: false,
                  style: {
                    zIndex: _this.tZindex,
                    top: ''.concat(top, 'px'),
                    left: ''.concat(left, 'px')
                  }
                });
  
                _this.$nextTick(function () {
                  var ctxElem = _this.$refs.ctxWrapper.$el;
                  var clientHeight = ctxElem.clientHeight;
                  var clientWidth = ctxElem.clientWidth;
                  var offsetTop = evnt.clientY + clientHeight - visibleHeight;
                  var offsetLeft = evnt.clientX + clientWidth - visibleWidth;
  
                  if (offsetTop > -10) {
                    ctxMenuStore.style.top = ''.concat(top - clientHeight, 'px');
                  }
  
                  if (offsetLeft > -10) {
                    ctxMenuStore.style.left = ''.concat(left - clientWidth, 'px');
                  }
                });
              } else {
                _this.closeMenu();
              }
            });
          }
        }
  
        this.closeFilter();
      },
      ctxMenuMouseoverEvent: function ctxMenuMouseoverEvent(evnt, item, child) {
        var ctxMenuStore = this.ctxMenuStore;
        evnt.preventDefault();
        evnt.stopPropagation();
        ctxMenuStore.selected = item;
        ctxMenuStore.selectChild = child;
  
        if (!child) {
          ctxMenuStore.showChild = tools.UtilTools.hasChildrenList(item);
        }
      },
      ctxMenuMouseoutEvent: function ctxMenuMouseoutEvent(evnt, item, child) {
        var ctxMenuStore = this.ctxMenuStore;
  
        if (!item.children) {
          ctxMenuStore.selected = null;
        }
  
        ctxMenuStore.selectChild = null;
      },
  
      /**
      * 快捷菜单点击事件
      */
      ctxMenuLinkEvent: function ctxMenuLinkEvent(evnt, menu) {
        if (!menu.disabled && (!menu.children || !menu.children.length)) {
          var ctxMenuMethod = baseTable.Menus.get(menu.code);
  
          var params = VueUtil.assign({
            menu: menu,
            $table: this
          }, this.ctxMenuStore.args);
  
          if (ctxMenuMethod) {
            ctxMenuMethod.call(this, params, evnt);
          }
  
          tools.UtilTools.emitEvent(this, 'context-menu-click', [params, evnt]);
  
          this.closeMenu();
        }
      }
    }
  };
  var VueXtableContextMenu = {
    name: 'VueXtableContextMenu',
    props: {
      ctxMenuStore: Object
    },
    render: function render(h) {
      var $table = this.$parent;
      var _e = this._e,
          ctxMenuStore = this.ctxMenuStore;
      return h('div', {
        class: ['vue-xtable-table--ctxmenu-wrapper', {
          show: ctxMenuStore.visible
        }],
        style: ctxMenuStore.style
      }, ctxMenuStore.list.map(function (options, gIndex) {
        return h('ul', {
          class: 'vue-xtable-ctxmenu--option-wrapper',
          key: gIndex
        }, options.map(function (item, index) {
          var hasChild = item.children && item.children.length;
          return item.visible === false ? _e() : h('li', {
            class: {
              'link--disabled': item.disabled,
              'link--active': item === ctxMenuStore.selected
            },
            key: ''.concat(gIndex, '_').concat(index)
          }, [h('a', {
            class: 'vue-xtable-ctxmenu--link',
            on: {
              click: function click(evnt) {
                $table.ctxMenuLinkEvent(evnt, item);
              },
              mouseover: function mouseover(evnt) {
                $table.ctxMenuMouseoverEvent(evnt, item);
              },
              mouseout: function mouseout(evnt) {
                $table.ctxMenuMouseoutEvent(evnt, item);
              }
            }
          }, [h('i', {
            class: ['vue-xtable-ctxmenu--link-prefix', item.prefixIcon]
          }), h('span', {
            class: 'vue-xtable-ctxmenu--link-content'
          }, tools.UtilTools.getFuncText(item.name)), h('i', {
            class: ['vue-xtable-ctxmenu--link-suffix', hasChild ? item.suffixIcon || 'suffix--haschild' : item.suffixIcon]
          })]), hasChild ? h('ul', {
            class: ['vue-xtable-table--ctxmenu-clild-wrapper', {
              show: item === ctxMenuStore.selected && ctxMenuStore.showChild
            }]
          }, item.children.map(function (child, cIndex) {
            return child.visible === false ? _e() : h('li', {
              class: {
                'link--disabled': child.disabled,
                'link--active': child === ctxMenuStore.selectChild
              },
              key: ''.concat(gIndex, '_').concat(index, '_').concat(cIndex)
            }, [h('a', {
              class: 'vue-xtable-ctxmenu--link',
              on: {
                click: function click(evnt) {
                  $table.ctxMenuLinkEvent(evnt, child);
                },
                mouseover: function mouseover(evnt) {
                  $table.ctxMenuMouseoverEvent(evnt, item, child);
                },
                mouseout: function mouseout(evnt) {
                  $table.ctxMenuMouseoutEvent(evnt, item, child);
                }
              }
            }, [h('i', {
              class: ['vue-xtable-ctxmenu--link-prefix', child.prefixIcon]
            }), h('span', {
              class: 'vue-xtable-ctxmenu--link-content'
            }, tools.UtilTools.getFuncText(child.name))])]);
          })) : _e()]);
        }));
      }));
    }
  };
  return {
    component: VueXtableContextMenu,
    mixin: Mixin
  };
});