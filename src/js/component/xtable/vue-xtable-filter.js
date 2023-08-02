(function (context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    var result = definition(context.VueXtable, context.baseTable, context.tools);
    context.VueXtableFilter = result.component;
    context.VueXtableFilterMixin = result.mixin;
  }
})(this, function (Table, baseTable, tools) {
  var _defineProperty = tools.UtilTools.defineProperty;

  var mixin = {
    methods: {
      /**
       * 手动调用筛选的方法
       * 如果不传回调则返回一个选项列表的 Promise 对象
       * 如果传回调则通过回调返回的值更新选项列表，并返回一个新选项列表的 Promise 对象
       * @param {String} field 字段名
       * @param {Function} callback 重置列表的回调函数，返回新的选项列表
       */
      _filter: function filter(field, callback) {
        var column = this.getColumnByField(field);
        var filters = column.filters;

        if (callback) {
          var rest = callback(filters);

          if (VueUtil.isArray(rest)) {
            column.filters = tools.UtilTools.getFilters(rest);
          }
        }

        return this.$nextTick().then(function () {
          return filters;
        });
      },

      /**
       * 点击筛选事件
       * 当筛选图标被点击时触发
       * 更新选项是否全部状态
       * 打开筛选面板
       * @param {Event} evnt 事件
       * @param {ColumnConfig} column 列配置
       * @param {Object} params 参数
       */
      triggerFilterEvent: function triggerFilterEvent(evnt, column, params) {
        var $refs = this.$refs,
          filterStore = this.filterStore;

        if (filterStore.column === column && filterStore.visible) {
          filterStore.visible = false;
        } else {

          this.closeFilter();
          this.$nextTick(function () {

            var filterWrapper = $refs.filterWrapper;
            var targetElem = evnt.target,
              pageX = evnt.pageX;

            var _DomTools$getDomNode = tools.DomTools.getDomNode(),
              visibleWidth = _DomTools$getDomNode.visibleWidth;

            var _DomTools$getAbsolute = tools.DomTools.getAbsolutePos(targetElem),
              top = _DomTools$getAbsolute.top,
              left = _DomTools$getAbsolute.left;

            if (!filterStore.zIndex || filterStore.zIndex < tools.UtilTools.getLastZIndex()) {
              filterStore.zIndex = tools.UtilTools.nextZIndex(this);
            }

            VueUtil.assign(filterStore, {
              args: params,
              multiple: column.filterMultiple,
              options: column.filters,
              column: column,
              style: {
                zIndex: filterStore.zIndex,
                top: ''.concat(top + targetElem.clientHeight + 6, 'px'),
                left: ''.concat(left, 'px')
              },
              visible: true
            });
            
            // 复原状态
            filterStore.options.forEach(function(option) {
              option._checked = option.checked;
            });

            filterStore.isAllSelected = filterStore.options.every(function (item) {
              return item._checked;
            });
            filterStore.isIndeterminate = !filterStore.isAllSelected && filterStore.options.some(function (item) {
              return item._checked;
            });
            this.$nextTick(function () {
              var filterWrapperElem = filterWrapper.$el;
              var clientWidth = filterWrapperElem.clientWidth;
              var wrapperLeft = left - clientWidth / 2 + 10;

              if (pageX + clientWidth > visibleWidth) {
                wrapperLeft = left - clientWidth - 22;
              }

              filterStore.style.left = ''.concat(Math.max(20, wrapperLeft + 20), 'px');
              filterStore.style.top = ''.concat(top + targetElem.clientHeight + 6, 'px');
            });
          });

        }
      },

      /**
       * 确认筛选
       * 当筛选面板中的确定按钮被按下时触发
       * @param {Event} evnt 事件
       */
      confirmFilterEvent: function confirmFilterEvent(evnt) {
        var visibleColumn = this.visibleColumn,
          filterStore = this.filterStore,
          remoteFilter = this.remoteFilter,
          scrollXLoad = this.scrollXLoad,
          scrollYLoad = this.scrollYLoad;
        var column = filterStore.column;
        var property = column.property;
        var values = [];
        var datas = [];
        column.filters.forEach(function (item) {
          if (item.checked) {
            values.push(item.value);
            datas.push(item.data);
          }
        });
        filterStore.visible = false; // 如果是服务端筛选，则跳过本地筛选处理

        if (!remoteFilter) {
          this.clearOrderIndex();
          this.handleTableData(true);
        }

        var filterList = [];
        visibleColumn.filter(function (column) {
          var property = column.property,
            filters = column.filters;
          var valueList = [];
          var dataList = [];

          if (filters && filters.length) {
            filters.forEach(function (item) {
              if (item.checked) {
                valueList.push(item.value);
                dataList.push(item.data);
              }
            }); // 在 v3.0 中废弃 prop

            filterList.push({
              column: column,
              property: property,
              field: property,
              prop: property,
              values: valueList,
              datas: dataList
            });
          }
        }); // 在 v3.0 中废弃 prop

        tools.UtilTools.emitEvent(this, 'filter-change', [{
          column: column,
          property: property,
          field: property,
          prop: property,
          values: values,
          datas: datas,
          filters: filterList,
          $table: this
        }]);

        this.updateFooter();

        if (scrollXLoad || scrollYLoad) {
          this.clearScroll();

          if (scrollYLoad) {
            this.updateScrollYSpace();
          }
        }

        this.closeFilter();
        this.checkSelectionStatus();
        this.$nextTick(this.recalculate);
      },

      /**
       * 重置筛选
       * 当筛选面板中的重置按钮被按下时触发
       * @param {Event} evnt 事件
       */
      resetFilterEvent: function resetFilterEvent(evnt) {
        this.filterStore.options.forEach(function (item) {
          item.checked = false;
          item._checked = false;
          item.data = item._data;
        });
        this.confirmFilterEvent(evnt);
        this.checkSelectionStatus();
      },

      /**
       * 清空指定列的筛选条件
       * 如果为空则清空所有列的筛选条件
       * @param {String} field 字段名
       */
      _clearFilter: function (field) {
        var column = arguments.length ? this.getColumnByField(field) : null;
        var filterStore = this.filterStore;

        var handleClear = function handleClear(column) {
          var filters = column.filters;

          if (filters && filters.length) {
            filters.forEach(function (item) {
              item.checked = false;
              item._checked = false;
              item.data = item._data;
            });
          }
        };

        if (column) {
          handleClear(column);
        } else {
          this.visibleColumn.forEach(handleClear);
        }

        if (!column || column !== filterStore.column) {
          VueUtil.assign(filterStore, {
            isAllSelected: false,
            isIndeterminate: false,
            style: null,
            options: [],
            column: null,
            multiple: false,
            visible: false
          });
        }

        return this.updateData();
      }
    }
  };

  var VueXtableFilter = {
    name: 'VueXtableFilter',
    props: {
      filterStore: Object,
      optimizeOpts: Object
    },
    render: function render(h) {
      var filterStore = this.filterStore,
        optimizeOpts = this.optimizeOpts;
      return h('div', {
        class: ['vue-xtable-table--filter-wrapper', 'filter--prevent-default', {
          't--animat': optimizeOpts.animat,
          'filter--active': filterStore.visible
        }],
        style: filterStore.style
      }, filterStore.visible ? [h('ul', {
        class: 'vue-xtable-table--filter-body'
      }, this.renderOptions(h)), this.renderFooter(h)] : []);
    },
    methods: {
      renderOptions: function renderOptions(h) {
        var _ref,
          _this = this;

        var $table = this.$parent,
          filterStore = this.filterStore;
        var vSize = $table.vSize;
        var args = filterStore.args,
          column = filterStore.column,
          multiple = filterStore.multiple;
        var slots = column.slots,
          own = column.own;
        var filterRender = own.filterRender;
        var compConf = filterRender ? baseTable.Renderer.get(filterRender.name) : null;

        if (slots && slots.filter) {
          return slots.filter.call($table, VueUtil.assign({
            $table: $table,
            context: this
          }, args), h);
        } else if (compConf && compConf.renderFilter) {
          return compConf.renderFilter.call($table, h, filterRender, args, this);
        }

        var filterRens = [h('li', {
          class: ['vue-xtable-table--filter-option', {
            'is--active': !filterStore.options.some(function (item) {
              return item.checked;
            })
          }]
        }, [multiple ? h('label', {
          class: ['vue-xtable-checkbox', (_ref = {}, _defineProperty(_ref, 'size--'.concat(vSize), vSize), _defineProperty(_ref, 'is--indeterminate', filterStore.isIndeterminate), _ref)]
        }, [h('input', {
          attrs: {
            type: 'checkbox'
          },
          domProps: {
            checked: filterStore.isAllSelected
          },
          on: {
            change: function change(evnt) {
              return _this.filterCheckAllEvent(evnt, evnt.target.checked);
            }
          }
        }), h('span', {
          class: 'vue-xtable-checkbox--icon'
        }), h('span', {
          class: 'vue-xtable-checkbox--label'
        }, GlobalConfig.i18n('vue.xtable.table.allFilter'))]) : h('span', {
          class: 'vue-xtable-table--filter-label',
          on: {
            click: $table.resetFilterEvent
          }
        }, GlobalConfig.i18n('vue.xtable.table.allFilter'))])];
        filterStore.options.forEach(function (item, index) {
          filterRens.push(h('li', {
            class: ['vue-xtable-table--filter-option', {
              'is--active': item.checked
            }],
            key: index
          }, [multiple ? h('label', {
            class: ['vue-xtable-checkbox', _defineProperty({}, 'size--'.concat(vSize), vSize)]
          }, [h('input', {
            attrs: {
              type: 'checkbox'
            },
            domProps: {
              checked: item._checked
            },
            on: {
              change: function change(evnt) {
                return _this.changeMultipleOption(evnt, evnt.target.checked, item);
              }
            }
          }), h('span', {
            class: 'vue-xtable-checkbox--icon'
          }), h('span', {
            class: 'vue-xtable-checkbox--label'
          }, item.label)]) : h('span', {
            class: 'vue-xtable-table--filter-label',
            on: {
              click: function click(evnt) {
                return _this.changeRadioOption(evnt, !item._checked, item);
              }
            }
          }, item.label)]));
        });
        return filterRens;
      },
      renderFooter: function renderFooter(h) {
        var filterStore = this.filterStore;
        var multiple = filterStore.multiple;
        return multiple ? h('div', {
          class: 'vue-xtable-table--filter-footer'
        }, [h('vue-button', {
          attrs: {
            type: 'primary',
            size: 'mini',
            disabled: !filterStore.isAllSelected && !filterStore.isIndeterminate
          },
          on: {
            click: this.confirmFilter
          }
        }, GlobalConfig.i18n('vue.xtable.table.confirmFilter')), h('vue-button', {
          attrs: {
            size: 'mini'
          },
          on: {
            click: this.resetFilter
          }
        }, GlobalConfig.i18n('vue.xtable.table.resetFilter'))]) : null;
      },
      // 全部筛选事件
      filterCheckAllEvent: function filterCheckAllEvent(evnt, value) {
        var filterStore = this.filterStore;
        filterStore.options.forEach(function (item) {
          item._checked = value;
        });
        filterStore.isAllSelected = value;
        filterStore.isIndeterminate = false;
      },
      checkOptions: function checkOptions() {
        var filterStore = this.filterStore;
        filterStore.isAllSelected = filterStore.options.every(function (item) {
          return item._checked;
        });
        filterStore.isIndeterminate = !filterStore.isAllSelected && filterStore.options.some(function (item) {
          return item._checked;
        });
      },

      /*************************
       * Publish methods
       *************************/
      // （单选）筛选发生改变
      changeRadioOption: function changeRadioOption(evnt, checked, item) {
        this.filterStore.options.forEach(function (item) {
          item.checked = false;
        });
        item.checked = checked;
        this.checkOptions();
        this.$parent.confirmFilterEvent();
      },
      // （多选）筛选发生改变
      changeMultipleOption: function changeMultipleOption(evnt, checked, item) {
        item._checked = checked;
        this.checkOptions();
      },
      // 筛选发生改变
      changeOption: function changeOption(evnt, checked, item) {
        if (this.filterStore.multiple) {
          this.changeMultipleOption(evnt, checked, item);
        } else {
          this.changeRadioOption(evnt, checked, item);
        }
      },
      // 确认筛选
      confirmFilter: function confirmFilter() {
        this.filterStore.options.forEach(function(option) {
          option.checked = option._checked;
        });
        this.$parent.confirmFilterEvent();
      },
      // 重置筛选
      resetFilter: function resetFilter() {
        this.$parent.resetFilterEvent();
      }
      /*************************
       * Publish methods
       *************************/

    }
  };

  return {
    component: VueXtableFilter,
    mixin: mixin
  };
});