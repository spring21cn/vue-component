(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VuePopper'], definition);
  } else {
    context.VueTable = definition(context.Vue, context.VueUtil, context.VuePopper);
    delete context.VueTable;
  }
})(this, function(Vue, VueUtil, VuePopper) {
  'use strict';

  function defaultFilterMethod(filter, value) {
    switch (filter.operations) {
      case '=':
        return value === filter.conditions;
      case '>':
        return value > filter.conditions;
      case '<':
        return value < filter.conditions;
      case '<=':
        return value <= filter.conditions;
      case '>=':
        return value >= filter.conditions;
      case '<>':
        return value !== filter.conditions;
      case '%':
        return value.indexOf(filter.conditions) !== -1;
    }
  }

  var TableStore = function(table, initialState) {
    this.table = table;
    this.states = {
      _columns: [],
      columns: [],
      labelColumns: [],
      fixedColumns: [],
      rightFixedColumns: [],
      _data: null,
      filteredData: null,
      data: null,
      sortingColumns: [],
      isAllSelected: false,
      selection: [],
      selectable: null,
      currentRow: null,
      hoverRow: null,
      filters: {},
      expandRows: [],
      aggregates: [],
      defaultExpandAll: false
    };
    VueUtil.merge(this.states, initialState);
  };
  TableStore.prototype.mutations = {
    setData: function(states, data) {
      var table = this.table;
      var dataInstanceChanged = states._data !== data;
      states._data = data;
      states.filteredData = data;
      states.data = this.sortData((data || []), states);
      VueUtil.loop(states.data, function(data, index) {
        data.$index = index;
      });
      var oldCurrentRow = states.currentRow;
      if (states.data.indexOf(oldCurrentRow) === -1) {
        states.currentRow = null;
        if (states.currentRow !== oldCurrentRow) {
          table.$emit('current-change', null, oldCurrentRow);
        }
      }
      if (dataInstanceChanged) {
        this.clearSelection();
      } else {
        var selection = states.selection || [];
        var deleted = VueUtil.filter(selection, function(item) {
          return states.data.indexOf(item) === -1;
        });
        VueUtil.loop(deleted, function(deletedItem) {
          selection.splice(selection.indexOf(deletedItem), 1);
        });
        if (deleted.length) {
          table.$emit('selection-change', selection);
        }
      }
      this.updateAllSelected();
      if (states.defaultExpandAll) {
        states.expandRows = VueUtil.mergeArray([], states.data);
      }
      VueUtil.isVueComponent(table.$refs.tableBody) && table.$refs.tableBody.resetDelta(data.length);
      Vue.nextTick(function() {
        table.updateScrollY();
        table.resizeZone();
      });
    },
    changeSortCondition: function(states) {
      var self = this;
      states.data = self.sortData((states.filteredData || states._data || []), states);
      
      //序号列重新排序
      VueUtil.loop(states.data, function(data, index) {
        data.$index = index;
      });
      
      if (this.table.highlightFirstAfterSort && states.data.length) {
        this.table.setCurrentRow(states.data[0]);
      } else {
        this.table.setCurrentRow(null);
      }

      self.table.$emit('sort-change', self.states.sortingColumns);
      Vue.nextTick(function() {
        self.table.updateScrollY();
        self.table.resizeZone();
      });
    },
    filterChange: function(states, options) {
      var self = this;
      var values = options.values;
      var column = options.column;
      var silent = options.silent;
      var prop = column.property;
      if (prop) {
        if (values && Object.keys(values).length === 0) {
          delete states.filters[column.id];
        } else {
          if (states.filters[column.id]) {
            states.filters[column.id] = VueUtil.merge(states.filters[column.id], values);
          } else {
            states.filters[column.id] = values;
          }

          column.filtered = false;
          var savedFilterRule = states.filters[column.id];
          if ((savedFilterRule.complexFilters && savedFilterRule.complexFilters.length > 0)
          || (savedFilterRule.simpleFilters && savedFilterRule.simpleFilters.length > 0)) {
            column.filtered = true;
          }
        }
      }

      var data = states._data;
      var filters = states.filters;
      VueUtil.ownPropertyLoop(filters, function(columnId) {
        var values = filters[columnId];
        var column = self.getColumnById(columnId);

        if(!values || !column) return;

        if(values.complexFilters && values.complexFilters.length > 0) {
          values.complexFilters.forEach(function(filter) {
            data = VueUtil.filter(data, function(row) {
                return defaultFilterMethod.call(null, filter, row[column.property]);
            });
          });
        }

        if(values.simpleFilters && values.simpleFilters.length > 0) {
          if (column.filterMethod) {
            data = VueUtil.filter(data, function(row) {
              return values.some(function(value) {
                return column.filterMethod.call(null, value, row);
              });
            });
          } else {
            var columnKey = column.property;
            data = VueUtil.filter(data, function(row) {
              return values.simpleFilters.some(function(value) {
                return row[columnKey] === value;
              });
            });
          }
        }
      });
      states.filteredData = data;
      states.data = self.sortData(data, states);

      //序号列重新排序
      VueUtil.loop(states.data, function(data, index) {
        data.$index = index;
      });

      //过滤条件改变，重设选中行。
      if (this.table.highlightFirstAfterFilter && data.length) {
        this.table.setCurrentRow(data[0]);
      } else {
        this.table.setCurrentRow(null);
      }

      if (!silent) {
        self.table.$emit('filter-change', filters);
      }
      self.table.$refs.tableBody.resetDelta(data.length);
      Vue.nextTick(function() {
        self.table.updateScrollY();
        self.table.resizeZone();
      });
    },
    insertColumn: function(states, column, index) {
      var array = states._columns;
      if (VueUtil.isDef(index)) {
        array.splice(index, 0, column);
      } else {
        array.push(column);
      }
      if (column.type === 'selection') {
        states.selectable = column.selectable;
      }
      this.updateColumns();
    },
    removeColumn: function(states, column) {
      var _columns = states._columns;
      if (_columns.length) {
        _columns.splice(_columns.indexOf(column), 1);
      }
      this.updateColumns();
    },
    reorderColumn: function (states, index, toIndex) {
      if(index === toIndex) return;
      var array = states._columns;

      if (index > toIndex) {
        array.splice(toIndex, 0, array[index]);
        array.splice(index + 1, 1);
      }
      else {
        array.splice(toIndex + 1, 0, array[index]);
        array.splice(index, 1);
      }

      this.updateColumns();
    },
    setHoverRow: function(states, row) {
      states.hoverRow = row;
    },
    setCurrentRow: function(states, row) {
      var oldCurrentRow = states.currentRow;
      states.currentRow = row;
      if (oldCurrentRow !== row) {
        this.table.$emit('current-change', row, oldCurrentRow);
      }
    },
    rowSelectedChanged: function(states, row) {
      var changed = this.toggleRowSelection(row);
      var selection = states.selection;
      if (changed) {
        var table = this.table;
        table.$emit('selection-change', selection);
        table.$emit('select', selection, row);
      }
      this.updateAllSelected();
    },
    toggleRowExpanded: function(states, row, expanded) {
      var expandRows = states.expandRows;
      if (VueUtil.isDef(expanded)) {
        var index = expandRows.indexOf(row);
        if (expanded) {
          if (index === -1)
            expandRows.push(row);
        } else {
          if (index !== -1)
            expandRows.splice(index, 1);
        }
      } else {
        var index = expandRows.indexOf(row);
        if (index === -1) {
          expandRows.push(row);
        } else {
          expandRows.splice(index, 1);
        }
      }
      var table = this.table;
      Vue.nextTick(function(){
        table.$emit('expand', row, expandRows.indexOf(row) !== -1);
      });
    },
    toggleAllSelection: function(states) {
      var data = states.data || [];
      var value = !states.isAllSelected;
      var selection = this.states.selection;
      var selectionChanged = false;
      var self = this;
      VueUtil.loop(data, function(item, index) {
        if (states.selectable) {
          if (states.selectable.call(null, item, index) && self.toggleRowSelection(item, value)) {
            selectionChanged = true;
          }
        } else {
          if (self.toggleRowSelection(item, value)) {
            selectionChanged = true;
          }
        }
      });
      var table = this.table;
      if (selectionChanged) {
        table.$emit('selection-change', selection);
      }
      table.$emit('select-all', selection);
      states.isAllSelected = value;
    }
  };
  TableStore.prototype.getAggregate = function(columns, data) {
    var labelMap = {
      'sum': Vue.t('vue.table.sumText'),
      'count': Vue.t('vue.table.countText'),
      'average': Vue.t('vue.table.averageText'),
      'min': Vue.t('vue.table.minText'),
      'max': Vue.t('vue.table.maxText'),
    };
    var aggregates = this.states.aggregates = [];
    if (data.length === 0) return;
    VueUtil.loop(columns, function(column) {
      var aggregate = '';
      var resultMap = {};
      resultMap.max = '';
      resultMap.min = '';
      resultMap.sum = '';
      resultMap.average = '';
      resultMap.label = '';
      resultMap.property = column.property;
      if (typeof column.aggregate == 'function') {
        resultMap.label = column.aggregate.call(column.property);
        aggregates.push(resultMap);
        return;
      }
      var aggregateType = column.aggregate.toLowerCase();
      var aggregateLabel = labelMap[aggregateType];
      if (VueUtil.isDef(column.aggregateLabel)) aggregateLabel = column.aggregateLabel;
      if (VueUtil.isDef(aggregateLabel)) {
        var max = null;
        var min = null;
        var sum = null;
        var precision = 0;
        var valueCount = 0;
        resultMap.count = data.length;
        VueUtil.loop(data, function(row) {
          var value = Number(row[column.property]);
          if (VueUtil.isNumber(value)) {
            var decimal = ('' + value).split('.')[1];
            decimal && decimal.length > precision ? precision = decimal.length : null;
            VueUtil.isDef(max) ? value > max ? max = value : null : max = value;
            VueUtil.isDef(min) ? value < min ? min = value : null : min = value;
            VueUtil.isDef(sum) ? sum = sum + value : sum = value;
            valueCount++;
          }
        });
        if (valueCount > 0) {
          resultMap.max = max;
          resultMap.min = min;
          resultMap.sum = sum;
          resultMap.average = (sum / valueCount);
        }
        var columnAggregate = resultMap[aggregateType];
        if (!VueUtil.isNumber(columnAggregate)) {
          aggregate = aggregateLabel;
        } else {
          if (aggregateType === 'count') precision = 0;
          columnAggregate = VueUtil.formatNumber(columnAggregate, precision); 
          aggregateLabel ? aggregate = aggregateLabel + ': ' + columnAggregate : aggregate = columnAggregate;
        }
        resultMap.label = aggregate;
      }
      aggregates.push(resultMap);
    });
  };
  TableStore.prototype.updateLabelColumns = function() {
    var states = this.states;
    var labelColumns = [];
    var colColumns = [];
    var tableColumns = states._columns;
    var i = tableColumns.length;
    while (i--) {
      var column = tableColumns[i];
      if (column.labelColspan) {
        colColumns.push(column);
      } else {
        if (colColumns.length > 0) {
          colColumns.reverse();
          column.colColumns = VueUtil.mergeArray([], colColumns);
          colColumns = [];
        }
        labelColumns.push(column);
      }
    }
    labelColumns.reverse();
    states.labelColumns = labelColumns;
  };
  TableStore.prototype.updateColumns = function() {
    var states = this.states;
    var columns = [];
    states.fixedColumns = [];
    states.rightFixedColumns = [];
    VueUtil.loop(VueUtil.mergeArray([], states._columns), function(column) {
      if (column.visible) {
        columns.push(column);
        if (column.fixed === true || column.fixed === 'left') {
          //Bug #1230
          // if (column.type === 'selection') {
          //   column.fixed = false;
          // } else {
            states.fixedColumns.push(column);
          // }
        }
        if (column.fixed === 'right') {
          //Bug #1230
          // if (column.type === 'selection') {
          //   column.fixed = false;
          // } else {
            states.rightFixedColumns.push(column);
          // }
        }
      }
    });
    states.fixedColumns.sort(function(a, b) {
      return a.fixedIndex - b.fixedIndex;
    });
    states.rightFixedColumns.sort(function(a, b) {
      return b.fixedIndex - a.fixedIndex;
    });
    if (states.fixedColumns.length > 0 && columns[0] && columns[0].type === 'selection' && !columns[0].fixed) {
      columns[0].fixed = true;
      states.fixedColumns.unshift(columns[0]);
    }
    states.columns = VueUtil.mergeArray([], states.fixedColumns, VueUtil.filter(columns, function(column) {
      return !column.fixed;
    }), states.rightFixedColumns);
    this.updateLabelColumns();
  };
  TableStore.prototype.rowspanData = function(data) {
    var columns = this.states.columns;
    VueUtil.loop(columns, function(column) {
      if (column.rowspan) {
        var val1 = null;
        var val2 = null;
        var startIndex = null;
        column.rowspanAry = [];
        column.rowspanStartAry = [];
        VueUtil.loop(data, function(row, index) {
          val1 = row[column.property];
          if (index > 0 && val1 === val2) {
            column.rowspanAry.push(index);
          }
          val2 = val1;
        });
        var spanItem = null;
        VueUtil.loop(column.rowspanAry, function(rowspan, index) {
          var startSpan = rowspan - 1;
          if (column.rowspanAry.indexOf(startSpan) === -1) {
            spanItem = {};
            spanItem.start = startSpan;
            spanItem.spanNum = 2;
            column.rowspanStartAry.push(spanItem);
          } else {
            spanItem.spanNum++;
          }
        });
      }
    });
  };
  TableStore.prototype.sortData = function(data, states) {
    var sortingColumns = states.sortingColumns;
    if (sortingColumns.length !== 0) {
      var orderBy = function(data, sortList) {
        return VueUtil.mergeArray([], data).sort(function(data1, data2) {
          var index = 0;
          var column = sortList[index];
          index++;
          var sortBy = function() {
            var value1 = data1[column.property];
            var value2 = data2[column.property];

            if (value1 === null || value1 === undefined) value1 = '';
            if (value2 === null || value2 === undefined) value2 = '';

            var sortOrder = 1;
            if (column.order === 'descending') {
              sortOrder = -1;
            }
            if (value1 === value2) {
              if (index === sortList.length) return;
              column = sortList[index];
              index++;
              return sortBy();
            }
            if (VueUtil.isFunction(column.sortMethod)) {
              return column.sortMethod(data1[column.property], data2[column.property], data1, data2) ? sortOrder : -sortOrder;
            } else {
              return value1 > value2 ? sortOrder : -sortOrder;
            }
          };
          return sortBy();
        });
      };
      data = orderBy(data, sortingColumns);
    }
    return data;
  };
  TableStore.prototype.getColumnById = function(columnId) {
    var column = null;
    var columns = this.states._columns;
    var i = columns.length;
    while (i--) {
      var item = columns[i];
      if (item.id === columnId) {
        column = item;
        break;
      }
    }
    return column;
  };
  TableStore.prototype.isSelected = function(row) {
    return (this.states.selection || []).indexOf(row) !== -1;
  };
  TableStore.prototype.clearSelection = function() {
    var states = this.states;
    states.isAllSelected = false;
    var oldSelection = states.selection;
    states.selection = [];
    if (oldSelection.length > 0) {
      this.table.$emit('selection-change', states.selection);
    }
  };
  TableStore.prototype.toggleRowSelection = function(row, selected) {
    var changed = false;
    var selection = this.states.selection;
    var index = selection.indexOf(row);
    if (!VueUtil.isDef(selected)) {
      if (index === -1) {
        selection.push(row);
        changed = true;
      } else {
        selection.splice(index, 1);
        changed = true;
      }
    } else {
      if (selected && index === -1) {
        selection.push(row);
        changed = true;
      } else if (!selected && index !== -1) {
        selection.splice(index, 1);
        changed = true;
      }
    }
    return changed;
  };
  TableStore.prototype.updateAllSelected = function() {
    var states = this.states;
    var selection = states.selection;
    var selectable = states.selectable;
    var data = states.data;
    if (!data || data.length === 0) {
      states.isAllSelected = false;
      return;
    }
    var selectedMap;
    var isSelected = function(row) {
      return selection.indexOf(row) !== -1;
    };
    var isAllSelected = true;
    var selectedCount = 0;
    var i = data.length;
    while (i--) {
      var item = data[i];
      if (selectable) {
        var isRowSelectable = selectable.call(null, item, i);
        if (isRowSelectable) {
          if (!isSelected(item)) {
            isAllSelected = false;
            break;
          } else {
            selectedCount++;
          }
        }
      } else {
        if (!isSelected(item)) {
          isAllSelected = false;
          break;
        } else {
          selectedCount++;
        }
      }
    }
    if (selectedCount === 0) isAllSelected = false;
    states.isAllSelected = isAllSelected;
  };
  TableStore.prototype.commit = function(name) {
    var mutations = this.mutations;
    var args = [];
    VueUtil.loop(arguments, function(arg, index) {
      if (index === 0) return;
      args.push(arg);
    });
    if (mutations[name]) {
      mutations[name].apply(this, VueUtil.mergeArray([this.states], args));
    } else {
      throw 'Action not found: ' + name;
    }
  };
  var TableLayout = function(options) {
    this.table = null;
    this.store = null;
    this.fit = true;
    this.showHeader = true;
    this.height = null;
    this.scrollX = false;
    this.scrollY = false;
    this.bodyWidth = null;
    this.fixedWidth = null;
    this.rightFixedWidth = null;
    this.headerHeight = 44;
    this.viewportHeight = null;
    this.bodyHeight = null;
    this.fixedBodyHeight = null;
    this.gutterWidth = VueUtil.scrollBarWidth();
    VueUtil.merge(this, options);
  };
  TableLayout.prototype.updateScrollY = function() {
    var refs = this.table.$refs;
    if (!refs.tableBody || !refs.bodyWrapper) return;
    this.scrollY = false;
    var tbody = refs.tableBody.$refs.tbody;
    if (VueUtil.isNumber(this.height) && VueUtil.isElement(tbody)) {
      var bodyWrapper = refs.bodyWrapper;
      if (tbody.offsetHeight > bodyWrapper.offsetHeight) this.scrollY = true;
    }
  };
  TableLayout.prototype.setHeight = function(value) {
    var el = this.table.$el;
    if (!el) return;
    if (VueUtil.isString(value) && /^\d+$/.test(value)) {
      value = Number(value);
    }
    if (VueUtil.isNumber(value)) {
      this.height = value;
      el.style.height = value + 'px';
    } else if (VueUtil.isString(value)) {
      if (value === '') {
        el.style.height = '';
      }
    }
    this.updateHeight();
  };
  TableLayout.prototype.updateHeight = function() {
    var height = 0;
    var el = this.table.$el;
    if (VueUtil.isElement(el)) height = el.clientHeight;
    this.headerHeight = 0;
    if (!this.showHeader) {
      if (VueUtil.isNumber(this.height)) {
        this.bodyHeight = height;
      }
      this.fixedBodyHeight = this.scrollX ? height - this.gutterWidth : height;
    } else {
      var headerWrapper = this.table.$refs.headerWrapper;
      if (VueUtil.isDef(headerWrapper)) {
        this.headerHeight = headerWrapper.offsetHeight;
      }
      var headerHeight = this.headerHeight;
      var footerHeight = 0;
      var footerWrapper = this.table.$refs.footerWrapper;
      if (this.table.showFooter && footerWrapper) {
        footerHeight = footerWrapper.clientHeight;
      }
      var hfHeight = headerHeight + footerHeight;
      var bodyHeight = height - hfHeight;
      if (VueUtil.isNumber(this.height)) {
        this.bodyHeight = bodyHeight;
      }
      this.fixedBodyHeight = this.scrollX ? bodyHeight - this.gutterWidth : bodyHeight;
    }
    this.viewportHeight = this.scrollX ? height - this.gutterWidth : height;
    if (this.table.showFooter) this.viewportHeight = height;
  };
  TableLayout.prototype.update = function() {
    var fit = this.fit;
    var columns = this.store.states.columns;
    var bodyWidth = 0;
    var el = this.table.$el;
    if (VueUtil.isElement(el)) bodyWidth = el.clientWidth;
    var bodyMinWidth = 0;
    var flexColumns = [];
    var allColumnsWidth = 0;
    VueUtil.loop(columns, function(column) {
      if (!VueUtil.isNumber(column.width)) {
        flexColumns.push(column);
        allColumnsWidth = allColumnsWidth + (column.minWidth || 80);
      }
      bodyMinWidth += column.width || column.minWidth || 80;
      column.realWidth = column.width || column.realWidth;
    });
    this.scrollX = bodyMinWidth > bodyWidth;
    this.bodyWidth = bodyMinWidth;
    var flexColumnLen = flexColumns.length;
    if (flexColumnLen > 0 && fit) {
      if (bodyMinWidth <= bodyWidth - this.gutterWidth) {
        this.scrollX = false;
        var totalFlexWidth = bodyWidth - this.gutterWidth - bodyMinWidth;
        var noneFirstWidth = 0;
        var flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
        while (flexColumnLen--) {
          if (flexColumnLen === 0) break;
          var column = flexColumns[flexColumnLen];
          var flexWidth = Math.floor((column.minWidth || 80) * flexWidthPerPixel);
          noneFirstWidth += flexWidth;
          column.realWidth = (column.minWidth || 80) + flexWidth;
        }
        flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth;
      } else {
        this.scrollX = true;
        VueUtil.loop(flexColumns, function(column) {
          column.realWidth = column.minWidth || 80;
        });
      }
      this.bodyWidth = Math.max(bodyMinWidth, bodyWidth);
    }
    var fixedColumns = this.store.states.fixedColumns;
    var fixedWidth = 0;
    VueUtil.loop(fixedColumns, function(column) {
      fixedWidth += column.realWidth || 80;
    });
    this.fixedWidth = fixedWidth;
    var rightFixedColumns = this.store.states.rightFixedColumns;
    var rightFixedWidth = 0;
    VueUtil.loop(rightFixedColumns, function(column) {
      rightFixedWidth += column.realWidth || 80;
    });
    this.rightFixedWidth = rightFixedWidth;
  };
  var TableBody = {
    props: {
      fixed: String
    },
    render: function(createElement) {
      var self = this;
      if (!VueUtil.isDef(self.delta)) this.createDelta();
      var delta = self.delta;
      var columns = self.store.states.columns;
      var storeData = self.store.states.data;
      if (self.fixed) {
        if (((self.fixed === 'left') && self.store.states.fixedColumns.length > 0)
        || (self.fixed === 'right' && self.store.states.rightFixedColumns.length > 0)) {
          delta = self.tableBody.delta;
          self.$nextTick(self.doResetCurrentRow);
        } else {
          return null;
        }
      } else {
        self.scrollFilter(storeData, delta);
      }
      if (delta.data.length === 0) return null;
      self.store.rowspanData(delta.data);
      return createElement('table', {
        class: 'vue-table__body',
        attrs: {
          cellspacing: '0',
          cellpadding: '0',
          border: '0'
        },
        style: {
          'margin-top': delta.marginTop + 'px',
          'margin-bottom': delta.marginBottom + 'px'
        }
      }, [createElement('colgroup', null, [self._l(columns, function(column, columnIndex) {
        return createElement('col', {
          key: columnIndex,
          attrs: {
            name: column.id,
            width: column.realWidth || column.width || 80
          }
        }, []);
      }), !self.fixed && (self.layout.scrollX || self.layout.scrollY) && self.layout.gutterWidth ? createElement('col', {
        attrs: {
          name: 'gutter',
          width: 0
        }
      }, []) : '']), createElement('tbody', {ref: 'tbody'}, [VueUtil.mergeArray(self._l(delta.data, function(row, index) {
        var $index = row.$index;
        return [createElement('tr', {
          style: self.rowStyle ? self.getRowStyle(row, $index) : null,
          key: $index,
          ref: 'trow'+$index,
          on: {
            dblclick: function(e) {
              return self.handleDoubleClick(e, row);
            },
            contextmenu: function(e) {
              return self.handleContextMenu(e, row);
            },
            mouseenter: function(e) {
              return self.handleMouseEnter(row);
            },
            mouseleave: function(e) {
              return self.handleMouseLeave();
            }
          },
          class: ['vue-table__row', self.getRowClass(row, $index)]
        }, [self._l(columns, function(column, cellIndex) {
          if (column.rowspan && column.rowspanAry.indexOf(index) !== -1) {
            return null;
          } else {
            var rowspanNum = null;
            if (column.rowspan) {
              VueUtil.loop(column.rowspanStartAry, function(rowspan) {
                if (rowspan.start === index) {
                  rowspanNum = rowspan.spanNum;
                }
              });
            }
            return createElement('td', {
              key: cellIndex,
              attrs: {
                rowspan: rowspanNum
              },
              class: ['vue-table__cell', $index % 2 === 1 ? 'grey' : '', column.align, column.getCellClass($index, cellIndex, row) || '', self.$parent.isCellHidden(cellIndex, self.fixed) ? 'is-hidden' : '', column.isRenderCell ? 'template-column-cell' : ''],
              on: {
                click: function(e) {
                  return self.handleClick(e, row, column);
                },
                mouseenter: function(e) {
                  return self.handleCellMouseEnter(e, row, column);
                },
                mouseleave: function(e) {
                  return self.handleCellMouseLeave(e, row, column);
                }
              }
            }, [column.renderCell.call(self._renderProxy, createElement, {
              row: row,
              column: column,
              $index: $index,
              store: self.store,
              _self: self.$parent.$vnode.context
            }), column.showOverflowTooltip ? createElement('vue-tooltip', {
              attrs: {
                effect: self.$parent.tooltipEffect,
                placement: 'top',
                content: self.tooltipContent,
                append: self.$parent.$el
              },
              ref: 'tooltip'+column.property+$index
            }, []) : null]);
          }
        }), !self.fixed && (self.layout.scrollX || self.layout.scrollY) && self.layout.gutterWidth ? createElement('td', {
          class: 'vue-table__cell gutter'
        }, []) : '']), self.store.states.expandRows.indexOf(row) !== -1 ? createElement('tr', {class: ['vue-table__row', 'vue-table__expanded-row']}, [createElement('td', {
          attrs: {
            colspan: columns.length
          },
          class: ['vue-table__cell', 'vue-table__expanded-cell', self.getExpandClass(row, $index)]
        }, [self.$parent.renderExpanded ? self.$parent.renderExpanded(createElement, {
          row: row,
          $index: $index,
          store: self.store
        }) : ''])]) : null];
      }), self._self.$parent.$slots.append)])]);
    },
    watch: {
      'store.states.hoverRow': function(newVal) {
        this.doResetHoverRow(newVal);
      },
      'store.states.currentRow': function(newVal) {
        this.doResetCurrentRow(newVal);
      }
    },
    computed: {
      store: function() {
        return this.$parent.store;
      },
      layout: function() {
        return this.$parent.layout;
      },
      rowClassName: function() {
        return this.$parent.rowClassName;
      },
      rowStyle: function() {
        return this.$parent.rowStyle;
      },
      expandClassName: function() {
        return this.$parent.expandClassName;
      },
      highlightCurrent: function() {
        return this.$parent.highlightCurrentRow;
      },
      highlightHover: function() {
        return this.$parent.highlightHoverRow;
      },
      tableBody: function() {
        return this.$parent.$refs.tableBody;
      },
      fixedTableBody: function() {
        return this.$parent.$refs.fixedTableBody;
      },
      rightFixedTableBody: function() {
        return this.$parent.$refs.rightFixedTableBody;
      }
    },
    data: function() {
      return {
        tooltipContent: ''
      };
    },
    methods: {
      createDelta: function() {
        if (this.fixed) return;
        var delta = this.delta = Object.create(null);
        delta.start = 0;
        delta.end = 0;
        delta.total = 0;
        delta.keeps = 0;
        delta.marginTop = 0;
        delta.marginBottom = 0;
        delta.size = 40;
        delta.remain = 0;
        delta.data = [];
        var table = this.$parent;
        if (table.height && table.lazyload) {
          delta.remain = Math.floor(table.height * 1 / delta.size) + 10;
          delta.end = delta.remain;
          delta.keeps = delta.remain;
        }
      },
      resetDelta: function(dataLen) {
        if (this.fixed) return;
        var delta = this.delta;
        if (delta.keeps === 0) return;
        delta.start = 0;
        if (dataLen <= delta.remain) {
          delta.end = dataLen;
          //delta.keeps = dataLen;
        } else {
          delta.end = delta.remain;
          delta.keeps = delta.remain;
        }
      },
      scrollFilter: function(storeData, delta) {
        delta.data = [];
        if (delta.keeps === 0 || storeData.length <= delta.keeps) {
          delta.marginTop = 0;
          delta.marginBottom = 0;
          delta.data = storeData;
        } else {
          delta.total = storeData.length;
          delta.marginTop = delta.size * delta.start;
          delta.marginBottom = delta.size * (delta.total - delta.keeps - delta.start);
          for (var i = delta.start, j = delta.end; i < j; i++) {
            delta.data.push(storeData[i]);
          }
        }
      },
      updateZone: function(offset) {
        if (this.fixed) return;
        var delta = this.delta;
        if (delta.keeps === 0) return;
        delta.size = 40;
        if (VueUtil.isElement(this.$refs.tbody)) delta.size = this.$refs.tbody.firstElementChild.offsetHeight;
        delta.remain = Math.floor(this.$parent.height * 1 / delta.size) + 11;
        delta.keeps = delta.remain;
        if (delta.total <= delta.keeps) return;
        var overs = Math.floor(offset / delta.size) - 6;
        overs < 0 && (overs = 0);
        var start = overs;
        var end = overs + delta.keeps;
        if (overs + delta.keeps >= delta.total) {
          end = delta.total;
          start = delta.total - delta.keeps;
        }
        delta.end = end;
        delta.start = start;
        this.forceUpdate();
        this.$nextTick(this.doResetCurrentRow);
      },
      forceUpdate: VueUtil.throttle(function() {
        this.tableBody.$forceUpdate();
        this.fixedTableBody.$forceUpdate();
        this.rightFixedTableBody.$forceUpdate();
      }),
      doResetCurrentRow: VueUtil.throttle(function(currentRow) {
        this.tableBody.resetCurrentRow(currentRow);
        this.fixedTableBody.resetCurrentRow(currentRow);
        this.rightFixedTableBody.resetCurrentRow(currentRow);
      }),
      doResetHoverRow: function(hoverRow) {
        this.tableBody.resetHoverRow(hoverRow);
        this.fixedTableBody.resetHoverRow(hoverRow);
        this.rightFixedTableBody.resetHoverRow(hoverRow);
      },
      resetCurrentRow: function(currentRowObj) {
        if (!this.highlightCurrent) return;
        var oldCurrentRow = this.currentRow;
        oldCurrentRow && oldCurrentRow.classList.remove('current-row');
        if (!VueUtil.isDef(currentRowObj)) currentRowObj = this.store.states.currentRow;
        if (!VueUtil.isDef(currentRowObj)) return;
        var currentRow = this.$refs['trow'+currentRowObj.$index];
        currentRow && currentRow.classList.add('current-row');
        this.currentRow = currentRow;
      },
      resetHoverRow: function(hoverRowObj) {
        if (!this.highlightHover) return;
        var oldHoverRow = this.hoverRow;
        oldHoverRow && oldHoverRow.classList.remove('hover-row');
        if (!VueUtil.isDef(hoverRowObj)) return;
        var hoverRow = this.$refs['trow'+hoverRowObj.$index];
        hoverRow && hoverRow.classList.add('hover-row');
        this.hoverRow = hoverRow;
      },
      getCell: function(event) {
        var cell = event.target;
        while (cell && cell.tagName.toUpperCase() !== 'HTML') {
          if (cell.tagName.toUpperCase() === 'TD') {
            return cell;
          }
          cell = cell.parentNode;
        }
        return null;
      },
      getRowStyle: function(row, index) {
        var rowStyle = this.rowStyle;
        if (VueUtil.isFunction(rowStyle)) {
          return rowStyle.call(null, row, index);
        }
        return rowStyle;
      },
      getRowClass: function(row, index) {
        var classes = [];
        var rowClassName = this.rowClassName;
        if (VueUtil.isString(rowClassName)) {
          classes.push(rowClassName);
        } else if (VueUtil.isFunction(rowClassName)) {
          classes.push(rowClassName.call(null, row, index) || '');
        }
        return classes.join(' ');
      },
      getExpandClass: function(row, index) {
        var classes = [];
        var expandClassName = this.expandClassName;
        if (VueUtil.isString(expandClassName)) {
          classes.push(expandClassName);
        } else if (VueUtil.isFunction(expandClassName)) {
          classes.push(expandClassName.call(null, row, index) || '');
        }
        return classes.join(' ');
      },
      handleCellMouseEnter: function(event, row, column) {
        var cell = this.getCell(event);
        if (!cell) return;
        var table = this.$parent;
        var hoverState = table.hoverState = {cell: cell, column: column, row: row};
        table.$emit('cell-mouse-enter', hoverState.row, hoverState.column, hoverState.cell, event);
        var cellChild = event.target.querySelector('.cell');
        if (column.showOverflowTooltip && cellChild.scrollWidth > cellChild.offsetWidth) {
          var tooltip = this.$refs['tooltip'+column.property+this.store.states.data.indexOf(row)];
          this.tooltipContent = cell.innerText;
          tooltip.referenceElm = cell;
          tooltip.setExpectedState(true);
          tooltip.handleShowPopper();
        }
      },
      handleCellMouseLeave: function(event, row, column) {
        var cell = this.getCell(event);
        if (!cell) return;
        var table = this.$parent;
        var oldHoverState = table.hoverState;
        table.$emit('cell-mouse-leave', oldHoverState.row, oldHoverState.column, oldHoverState.cell, event);
        var cellChild = event.target.querySelector('.cell');
        if (column.showOverflowTooltip && cellChild.scrollWidth > cellChild.offsetWidth) {
          var tooltip = this.$refs['tooltip'+column.property+this.store.states.data.indexOf(row)];
          tooltip.setExpectedState(false);
          tooltip.handleClosePopper();
        }
      },
      handleMouseEnter: function(row) {
        this.store.commit('setHoverRow', row);
      },
      handleMouseLeave: function() {
        this.store.commit('setHoverRow', null);
      },
      handleContextMenu: function(event, row) {
        this.$parent.$emit('row-contextmenu', row, event);
      },
      handleDoubleClick: function(event, row) {
        this.$parent.$emit('row-dblclick', row, event);
      },
      handleClick: function(event, row, column) {
        var table = this.$parent;
        var cell = this.getCell(event);
        if (cell) {
          table.$emit('cell-click', row, column, cell, event);
        }
        this.store.commit('setCurrentRow', row);
        table.$emit('row-click', row, event, column);
      },
      handleExpandClick: function(row) {
        this.store.commit('toggleRowExpanded', row);
      }
    }
  };
  var VueTableFilterPanel = {
    template: '<transition @after-leave="destroyPopper"> \
    <div class="vue-table-filter" v-show="showPopper" v-clickoutside="handleOutsideClick"> \
      <div class="vue-table-filter__content"> \
        <vue-checkbox-group v-model="filteredValue"> \
          <vue-list scrollbar :height="150" ref="list" class="vue-table-filter__list"> \
            <vue-list-item v-for="(filter, index) in complexFilters" :key="\'complexFilters\'+index" class="vue-table-filter__list-item"> \
              <template>\
              <label class="vue-checkbox table-complexfilter">\
                <span class="vue-checkbox__input is-checked">\
                  <span @mousedown.left.stop="removeComplexFilter(filter)" class="vue-checkbox__inner"></span>\
                </span>\
                <span class="vue-checkbox__label">{{filter.operations + \' \' + filter.conditions}}</span>\
              </label> \
              </template>\
            </vue-list-item>\
            <vue-list-item v-if="column.filterable" v-for="(filter, index) in filters" :key="index" class="vue-table-filter__list-item"> \
              <vue-checkbox :label="filter.value">{{filter.text}}</vue-checkbox> \
            </vue-list-item> \
          </vue-list> \
        </vue-checkbox-group> \
      </div> \
      <div class="vue-table-filter__bottom"> \
        <vue-button @click="handleConfirm" type="text" :disabled="filteredValue.length === 0">{{$t(\'vue.table.confirmFilter\')}}</vue-button> \
        <vue-button type="text" @click="handleReset">{{$t(\'vue.table.resetFilter\')}}</vue-button> \
      </div> \
    </div> \
  </transition>',
    name: 'VueTableFilterPanel',
    mixins: [VuePopper],
    directives: {
      Clickoutside: VueUtil.component.clickoutside()
    },
    props: {
      placement: {
        type: String,
        default: 'bottom'
      }
    },
    methods: {
      handleOutsideClick: function() {
        this.showPopper = false;
      },
      handleConfirm: function() {
        this.confirmFilter(this.filteredValue, this.column.complexFilters);
        this.handleOutsideClick();
      },
      handleReset: function() {
        this.filteredValue = [];
        this.column.complexFilters = [];
        this.handleConfirm();
      },
      confirmFilter: function(filteredValue, complexFilters) {
        this.table.store.commit('filterChange', {
          column: this.column,
          values: {simpleFilters: filteredValue, complexFilters: complexFilters}
        });
      },
      removeComplexFilter: function(filter) {
        var index = this.column.complexFilters.indexOf(filter);
        if (index > -1) {
          this.column.complexFilters.splice(index , 1);
          if(!this.column.filterable && this.column.complexFilters.length == 0) {
            this.handleOutsideClick();
          }
        }

        this.confirmFilter(this.filteredValue, this.column.complexFilters);
      }
    },
    computed: {
      filters: function() {
        if (this.column && this.column.filters.length > 0) return this.column.filters;
        var filterList = [];
        var column = this.column;
        VueUtil.loop(this.table.store.states._data, function(row) {
          var columnData = {};
          columnData.value = row[column.property];
          columnData.text = row[column.property];
          if (filterList.map(function(e) { return e.value; }).indexOf(columnData.value) === -1) {
            filterList.push(columnData);
          }
        });
        return filterList;
      },
      complexFilters: function() {
        if (this.column) {
          return this.column.complexFilters || [];
        }
        return [];
      },
      filteredValue: {
        get: function() {
          if (this.column) {
            return this.column.filteredValue || [];
          }
          return [];
        },
        set: function(value) {
          if (this.column) {
            this.column.filteredValue = value;
          }
        }
      }
    },
    mounted: function() {
      var self = this;
      self.popperElm = self.$el;
      self.referenceElm = self.cell;
      self.dropdown = Object.create(null);
      self.dropdown.dropdowns = [];
      self.dropdown.open = function(instance) {
        if (instance) {
          this.dropdowns.push(instance);
        }
      };
      self.dropdown.close = function(instance) {
        var index = this.dropdowns.indexOf(instance);
        if (index !== -1) {
          this.dropdowns.splice(instance, 1);
        }
      };
      self.$watch('showPopper', function(value) {
        if (self.column)
          self.column.filterOpened = value;
        if (value) {
          self.dropdown.open(self);
          self.$nextTick(self.$refs.list.updateZone);
        } else {
          self.dropdown.close(self);
        }
      });
    }
  };
  var TableHeader = {
    render: function(createElement) {
      if (!this.$parent.showHeader
        || ((this.fixed === 'left') && this.store.states.fixedColumns.length === 0)
        || (this.fixed === 'right' && this.store.states.rightFixedColumns.length === 0)) return null;
      var self = this;
      var columns = self.store.states.columns;
      var columnRows = self.convertToRows(columns);
      return createElement('table', {
        class: 'vue-table__header',
        attrs: {
          cellspacing: '0',
          cellpadding: '0',
          border: '0'
        }
      }, [createElement('colgroup', null, [self._l(columns, function(column, columnIndex) {
        return createElement('col', {
          key: columnIndex,
          attrs: {
            name: column.id,
            width: column.realWidth || column.width || 80
          }
        }, []);
      }), !self.fixed && (self.layout.scrollX || self.layout.scrollY) && self.layout.gutterWidth ? createElement('col', {
        attrs: {
          name: 'gutter',
          width: self.layout.gutterWidth
        }
      }, []) : '']), createElement('thead', null, [self._l(columnRows, function(columns, rowIndex) {
        return createElement('tr', {class: ['vue-table__row'], key:rowIndex}, [self._l(columns, function(column, cellIndex) {
          return column.labelColspan ? null : createElement('th', {
            key: cellIndex,
            attrs: {
              colspan: column.labelColspanNum
            },
            on: {
              mousemove: function(e) {
                return self.handleMouseMove(e, column);
              },
              mouseout: self.handleMouseOut,
              mousedown: function(e) {
                return self.handleMouseDown(e, column);
              },
              touchstart: function(e) {
                return self.handleMouseDown(e, column);
              },
              click: function(e) {
                return self.handleHeaderClick(e, column);
              }
            },
            class: ['vue-table__column', column.order, column.headerAlign, rowIndex === 0 && self.$parent.isCellHidden(cellIndex, self.fixed) ? 'is-hidden' : '', 'is-leaf', column.labelClassName, column.renderHeader ? 'template-column-header' : '']
          }, [createElement('div', {
            class: ['cell', column.filtered || column.order ? 'highlight' : ''],
            style: {'width': column.renderHeader ? '100%' : '', 'padding': column.renderHeader ? 0 : ''},
          }, [column.renderHeader ? column.renderHeader.call(self._renderProxy, createElement, {
            column: column,
            $index: cellIndex,
            store: self.store,
            _self: self.$vnode.context
          }) : createElement('span', { class: ['vue-table_column-label', 'vue-table_column-label-' + column.property], domProps: {innerHTML: column.label}}),
            column.sortable && !column.renderHeader ? createElement('span', {
            class: 'vue-table__sort-wrapper',
            on: {
              click: function(e) {
                return self.handleSortClick(e, column);
              }
            }
          }, [createElement('i', {
            class: ['is-sort', column.order === 'descending' ? 'vue-icon-sort-desc' : 'vue-icon-sort-asc'],
          }, [])]) : '', (column.filterable || (column.complexFilters && column.complexFilters.length > 0)) && !column.renderHeader ? createElement('span', {
            class: 'vue-table__column-filter-trigger',
            on: {
              click: function(e) {
                return self.handleFilterClick(e, column);
              }
            }
          }, [createElement('i', {
            class: ['vue-icon-filter', column.filtered ? 'is-filtered' : '']
          }, [])]) : ''])]);
        }), !self.fixed && (self.layout.scrollX || self.layout.scrollY) && self.layout.gutterWidth ? createElement('th', {
          class: 'vue-table__column gutter'
        }, []) : '']);
      })])]);
    },
    props: {
      fixed: String
    },
    computed: {
      store: function() {
        return this.$parent.store;
      },
      layout: function() {
        return this.$parent.layout;
      },
      border: function() {
        return this.$parent.border;
      },
      defaultSort: function() {
        return this.$parent.defaultSort;
      }
    },
    created: function() {
      this.filterPanels = {};
    },
    mounted: function() {
      this.draggingColumn = null;
      this.dragging = false;
      this.dragState = {};
      this.setDefaultSortColumn();
    },
    beforeDestroy: function() {
      var panels = this.filterPanels;
      VueUtil.ownPropertyLoop(panels, function(prop) {
        if (VueUtil.isVueComponent(panels[prop])) {
          panels[prop].$destroy();
        }
      });
    },
    methods: {
      setDefaultSortColumn: function() {
        if (this.fixed) return;
        var self = this;
        var sortingColumns = self.store.states.sortingColumns;
        VueUtil.loop(self.defaultSort, function(sort) {
          VueUtil.loop(self.store.states.columns, function(column) {
            if (column.property === sort.prop) {
              column.order = sort.order;
              sortingColumns.push(column);
            }
          });
        });
      },
      convertToRows: function(columns) {
        var rows = [[]];
        var colspan = 1;
        var i = columns.length;
        while (i--) {
          var column = columns[i];
          column.labelColspanNum = 1;
          if (!column.labelColspan) {
            column.labelColspanNum = colspan;
            colspan = 1;
          } else {
            colspan++;
          }
          rows[0].push(column);
        }
        rows[0].reverse();
        return rows;
      },
      toggleAllSelection: function() {
        this.store.commit('toggleAllSelection');
      },
      handleFilterClick: function(event, column) {
        event.stopPropagation();
        var target = event.target;

        if (target.tagName == 'SPAN') {
          target = target.querySelector('i');
        }
        var cell = target.parentNode;
        var filterPanel = this.filterPanels[column.id];
        if (filterPanel && column.filterOpened) {
          filterPanel.showPopper = false;
          return;
        }
        if (!filterPanel) {
          if(Vue.i18n) VueTableFilterPanel.i18n = Vue.i18n;
          filterPanel = new Vue(VueTableFilterPanel);
          this.filterPanels[column.id] = filterPanel;
          filterPanel.table = this.$parent;
          filterPanel.cell = cell;
          filterPanel.column = column;
          filterPanel.$mount(document.createElement('div'));
        } else {
          if(filterPanel.referenceElm !== cell) {
            filterPanel.referenceElm = cell;
          }
        }
        this.$nextTick(function() {
          filterPanel.showPopper = true;
        });
      },
      handleHeaderClick: function(event, column) {
        this.$parent.$emit('header-click', column, event);
      },
      handleMouseDown: function(event, column) {
        var self = this;
        if (event.touches) {
          self.handleMouseMove(event, column);
        }
        if (self.draggingColumn && self.border) {
          self.dragging = true;
          self.$parent.resizeProxyVisible = true;
          var tableEl = self.$parent.$el;
          var tableLeft = tableEl.getBoundingClientRect().left;
          var columnEl = event.currentTarget;
          var columnRect = columnEl.getBoundingClientRect();
          var minLeft = columnRect.left - tableLeft + 30;
          columnEl.classList.add('noclick');
          self.dragState = {
            startMouseLeft: event.clientX || event.touches[0].clientX,
            startLeft: columnRect.right - tableLeft,
            startColumnLeft: columnRect.left - tableLeft,
            tableLeft: tableLeft
          };
          var resizeProxy = self.$parent.$refs.resizeProxy;
          resizeProxy.style.left = self.dragState.startLeft + 'px';
          document.onselectstart = function() {
            return false;
          };
          document.ondragstart = function() {
            return false;
          };
          var handleMouseMove = function(event) {
            var deltaLeft = (event.clientX || event.touches[0].clientX) - self.dragState.startMouseLeft;
            var proxyLeft = self.dragState.startLeft + deltaLeft;
            resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px';
          };
          var handleMouseUp = function() {
            if (self.dragging) {
              var finalLeft = parseInt(resizeProxy.style.left, 10);
              var startLeft = self.dragState.startLeft;
              var startColumnLeft = self.dragState.startColumnLeft;
              var draggingColumnNum = 1;
              if (VueUtil.isArray(column.colColumns)) {
                draggingColumnNum = draggingColumnNum + column.colColumns.length;
              }
              var columnWidth = parseInt((finalLeft - startColumnLeft) / draggingColumnNum);
              column.width = column.realWidth = columnWidth;
              VueUtil.loop(column.colColumns, function(colColumn){
                colColumn.width = colColumn.realWidth = columnWidth;
              });
              self.$parent.$emit('header-dragend', finalLeft - startColumnLeft, startLeft - startColumnLeft, column, event);
              document.body.style.cursor = '';
              self.dragging = false;
              self.draggingColumn = null;
              self.dragState = {};
              self.$parent.resizeProxyVisible = false;
              self.$parent.doLayout();
            }
            VueUtil.removeTouchMove(document, handleMouseMove);
            VueUtil.removeTouchEnd(document, handleMouseUp);
            document.onselectstart = null;
            document.ondragstart = null;
            self.$nextTick(function() {
              columnEl.classList.remove('noclick');
            });
          };
          VueUtil.addTouchMove(document, handleMouseMove);
          VueUtil.addTouchEnd(document, handleMouseUp);
        }
      },
      handleMouseMove: function(event, column) {
        var target = event.target;
        while (target && !VueUtil.hasClass(target, 'vue-table__column')) {
          target = target.parentNode;
        }
        if (!column || !column.resizable) return;
        if (!this.dragging && this.border) {
          var rect = target.getBoundingClientRect();
          var bodyStyle = document.body.style;
          if (rect.width > 12 && rect.right - (event.pageX || event.touches[0].pageX) < 8) {
            bodyStyle.cursor = 'col-resize';
            this.draggingColumn = column;
          } else if (!this.dragging) {
            bodyStyle.cursor = '';
            this.draggingColumn = null;
          }
        }
      },
      handleMouseOut: function() {
        document.body.style.cursor = '';
      },
      toggleOrder: function(order) {
        return !order ? 'ascending' : order === 'ascending' ? 'descending' : null;
      },
      handleSortClick: function(event, column) {
        event.stopPropagation();
        var target = event.target;
        while (target && !VueUtil.hasClass(target, 'vue-table__column')) {
          target = target.parentNode;
        }
        if (target && VueUtil.hasClass(target, 'vue-table__column')) {
          if (target.classList.contains('noclick')) {
            target.classList.remove('noclick');
            return;
          }
        }
        var states = this.store.states;
        var sortingColumns = states.sortingColumns;
        column.order = this.toggleOrder(column.order);
        var sortIndex = sortingColumns.indexOf(column);
        if (sortIndex === -1) {
          sortingColumns.push(column);
        } else if (column.order === null) {
          sortingColumns.splice(sortIndex, 1);
        }
        this.store.commit('changeSortCondition');
      }
    }
  };
  var TableFooter = {
    render: function(createElement) {
      if (!this.$parent.showFooter
        || ((this.fixed === 'left') && this.store.states.fixedColumns.length === 0)
        || (this.fixed === 'right' && this.store.states.rightFixedColumns.length === 0)) return null;
      var self = this;
      var aggregates = self.fixed ? self.$parent.$refs.tableFooter.aggregates : self.aggregates;
      var columns = self.store.states.columns;
      return createElement('table', {
        class: 'vue-table__footer',
        attrs: {
          cellspacing: '0',
          cellpadding: '0',
          border: '0'
        }
      }, [createElement('colgroup', null, [self._l(columns, function(column, columnIndex) {
        return createElement('col', {
          key: columnIndex,
          attrs: {
            name: column.id,
            width: column.realWidth || column.width || 80
          }
        }, []);
      }), !self.fixed && (self.layout.scrollX || self.layout.scrollY) && self.layout.gutterWidth ? createElement('col', {
        attrs: {
          name: 'gutter',
          width: self.layout.gutterWidth
        }
      }, []) : '']), createElement('tfoot', null, [createElement('tr', {class: ['vue-table__row']}, [self._l(columns, function(column, cellIndex) {
        return createElement('th', {
          key: cellIndex,
          attrs: {
            colspan: column.colSpan,
            rowspan: column.rowSpan
          },
          class: ['vue-table__column', column.align, column.className || '', self.$parent.isCellHidden(cellIndex, self.fixed) ? 'is-hidden' : '', 'is-leaf', column.labelClassName]
        }, [createElement('div', {
          class: ['cell', column.labelClassName],
          domProps: {innerHTML: [aggregates[cellIndex] ? aggregates[cellIndex].label : '']}
        })]);
      }), !self.fixed && (self.layout.scrollX || self.layout.scrollY) && self.layout.gutterWidth ? createElement('th', {
        class: 'vue-table__column gutter'
      }, []) : ''])])]);
    },
    props: {
      fixed: String,
    },
    data: function() {
      return {
        aggregates: []
      };
    },
    computed: {
      store: function() {
        return this.$parent.store;
      },
      layout: function() {
        return this.$parent.layout;
      }
    },
    watch: {
      '$parent.emptyLabel': function() {
        if (this.$parent.showFooter && !this.fixed) {
          this.store.getAggregate(this.store.states.columns, this.store.states.data);
          this.aggregates = this.store.states.aggregates;
        }
      }
    }
  };
  var TableContextMenu = {
    template: '<vue-dialog :size="size" v-model="dialogVisible" custom-class="vue-table-context-menu" :title="$t(\'vue.table.contextMenu\')" \
      show-close @close="closeHandle"> \
      <vue-tabs> \
        <vue-tab-pane :label="$t(\'vue.table.pin\')"> \
          <vue-form label-width="100px"> \
            <vue-form-item :label="$t(\'vue.table.leftPin\')"> \
              <vue-select clearable v-model="pinForm.leftPin" multiple @change="leftPin" @remove-tag="noPin" value-key="id"> \
                <vue-option v-for="(column, index) in labelColumns" :key="index" :label="column.label?column.label:(column.type==\'index\'?\'#\':\' \')" :value="column"></vue-option> \
              </vue-select> \
            </vue-form-item> \
            <vue-form-item :label="$t(\'vue.table.rightPin\')"> \
              <vue-select clearable v-model="pinForm.rightPin" multiple @change="rightPin" @remove-tag="noPin" value-key="id"> \
                <vue-option v-for="(column, index) in labelColumns" :key="index" :label="column.label?column.label:(column.type==\'index\'?\'#\':\' \')" :value="column"></vue-option> \
              </vue-select> \
            </vue-form-item> \
          </vue-form> \
        </vue-tab-pane> \
        <vue-tab-pane :label="$t(\'vue.table.sort\')"> \
          <vue-list scrollbar :height="150" :default-selected="false"> \
            <vue-list-item v-for="(column, index) in labelColumns" v-if="column.type != \'index\'" :key="index"> \
              <vue-button type="text" style="padding-left:15px" @click="removeSortColumn(column, true)">{{column.label?column.label:(column.type=="index"?"#":"&nbsp;")}}</vue-button> \
              <div style="float:right;"> \
                <vue-button style="padding:10px 0 0 0;" :style="{color: column.order === \'ascending\' ? \'#eb9e05\' : \'rgb(151, 168, 190)\'}" \
                  icon="vue-icon-caret-top" type="text" @click="sortColumn(column)"></vue-button> \
                <vue-button style="padding:10px 15px 0 0;" :style="{color: column.order === \'descending\' ? \'#eb9e05\' : \'rgb(151, 168, 190)\'}" \
                  icon="vue-icon-caret-bottom" type="text" @click="sortColumn(column, true)"></vue-button> \
              </div> \
              <vue-divider v-if="index!==labelColumns.length-1"></vue-divider> \
            </vue-list-item> \
          </vue-list> \
          <vue-form label-width="70px"> \
            <vue-form-item :label="$t(\'vue.table.sortBy\')"> \
              <vue-tag hit style="margin:5px 5px 0 0;" v-for="(column, index) in sortList" :key="index" closable \
                type="info" @close="removeSortColumn(column)">{{column.label?column.label:(column.type=="index"?"#":"&nbsp;")}}<i style="padding:5px 0 0 5px;" :class="[{\'vue-icon-caret-top\': column.order === \'ascending\'}, {\'vue-icon-caret-bottom\': column.order === \'descending\'}]"></i></vue-tag> \
            </vue-form-item> \
          </vue-form> \
        </vue-tab-pane> \
        <vue-tab-pane :label="$t(\'vue.table.filter\')"> \
          <vue-form label-width="100px" :model="filterForm"> \
            <vue-form-item :label="$t(\'vue.table.column\')"> \
              <vue-select v-model="filterForm.filterColumn"> \
                <vue-option v-for="(column, index) in labelColumns" v-if="column.type != \'index\'" :key="index" :label="column.label?column.label:(column.type==\'index\'?\'#\':\' \')" :value="column"></vue-option> \
              </vue-select> \
            </vue-form-item> \
            <vue-form-item :label="$t(\'vue.table.conditions\')"> \
              <vue-input icon="vue-icon-search" v-model="filterForm.conditions" :on-icon-click="filterColumn" \
                @keydown.enter.native="filterColumn" ref="filterInput"> \
                <vue-select slot="prepend" v-model="filterForm.operations" style="width:80px;font-size:21px;" \
                  @change="operationsChange"> \
                  <vue-option v-for="(item, index) in operations" :key="index" :label="item" :value="item"></vue-option> \
                </vue-select> \
              </vue-input> \
            </vue-form-item> \
          </vue-form> \
          <vue-divider></vue-divider> \
          <vue-form label-width="100px"> \
            <vue-form-item :label="$t(\'vue.table.filterBy\')"> \
            <template v-for="(column, column_index) in labelColumns" > \
              <vue-tag hit style="margin:5px 5px 0 0;" v-for="(filter, index) in column.complexFilters" :key="column_index+\'__\'+index" closable \
                type="info" @close="removeFilterColumn(column, filter)">{{column.label?column.label:(column.type=="index"?"#":"&nbsp;")}} {{filter.operations}} {{filter.conditions}}</vue-tag> \
            </template> \
            </vue-form-item> \
          </vue-form> \
        </vue-tab-pane> \
        <vue-tab-pane :label="$t(\'vue.table.display\')"> \
          <vue-list scrollbar :height="150" :default-selected="false"> \
            <vue-list-item v-for="(column, index) in labelColumns" :key="index" @select="displayColumn(column)" \
              style="cursor:pointer;"> \
              <vue-button type="text" style="padding-left:15px">{{column.label?column.label:(column.type=="index"?"#":"&nbsp;")}}</vue-button> \
              <div style="float:right;"> \
              <vue-button style="padding:10px 0 0 0;" :style="{visibility: index==0?\'hidden\': \'visible\'}" \
              icon="vue-icon-caret-top" type="text" @click.stop="reorderColumn(index, \'up\')"></vue-button> \
            <vue-button style="padding:10px 15px 0 0;" :style="{visibility: index==labelColumns.length-1?\'hidden\': \'visible\'}"  \
              icon="vue-icon-caret-bottom" type="text" @click.stop="reorderColumn(index, \'down\')"></vue-button> \
                <vue-button style="padding:10px 15px 0 0;" :style="{color: column.visible ? \'#13ce66\' : \'#a94442\'}" \
                  :icon="column.visible ? \'vue-icon-success\' : \'vue-icon-error\'" type="text"></vue-button> \
              </div> \
              <vue-divider v-if="index!==labelColumns.length-1"></vue-divider> \
            </vue-list-item> \
          </vue-list> \
        </vue-tab-pane> \
        <vue-tab-pane :label="$t(\'vue.table.exportData\')"> \
          <vue-form label-width="100px"> \
            <vue-form-item :label="$t(\'vue.table.fileName\')"> \
              <vue-input v-model="fileName"></vue-input> \
            </vue-form-item> \
          </vue-form> \
          <div style="text-align:right"> \
            <vue-button @click="exportData(true)" plain type="info" icon="vue-icon-download2">{{$t(\'vue.table.exportOrgData\')}}</vue-button> \
            <vue-button @click="exportData(false)" type="primary" \
              icon="vue-icon-download2">{{$t(\'vue.table.exportHandleData\')}}</vue-button> \
          </div> \
        </vue-tab-pane> \
      </vue-tabs> \
    </vue-dialog>',
    data: function() {
      return {
        tableColumns: [],
        pinForm: {
          leftPin: [],
          rightPin: []
        },
        filterForm: {
          filterColumn: null,
          conditions: null,
          operations: '='
        },
        operations: ['=', '<', '>', '<=', '>=', '<>', '%'],
        sortList: [],
        filterList: [],
        dialogVisible: false,
        fileName: ''
      };
    },
    props: {
      visible: Boolean,
    },
    model: {
      prop: 'visible'
    },
    watch: {
      visible: function(val) {
        this.dialogVisible = val;
      }
    },
    computed: {
      size: function() {
        return VueUtil.getSystemInfo().device === 'Mobile' ? 'full' : 'small';
      },
      store: function() {
        return this.$parent.store;
      },
      labelColumns: function() {
        return this.$parent.store.states.labelColumns;
      }
    },
    methods: {
      closeHandle: function() {
        this.$parent.showContextMenu = false;
      },
      operationsChange: function() {
        this.$nextTick(this.$refs.filterInput.focus);
      },
      exportData: function(flg) {
        var params = {};
        params.fileName = this.fileName;
        params.original = flg;
        this.$parent.exportCsv(params);
      },
      noPin: function(tag) {
        this.removePin(tag.value);
      },
      removePin: function(column) {
        column.fixed = false;
        this.$parent.doLayout();
      },
      leftPin: function(columns, columnItem, oldColumns) {
        var removedTag = VueUtil.difference(oldColumns, columns);
        if(removedTag.length) this.removePin(removedTag[0]);

        if (columns.length <= 0) {
          var layoutFLg = false;
          VueUtil.loop(this.tableColumns, function(column) {
            if (column.fixed === true || column.fixed === 'left') {
              column.fixed = false;
              layoutFLg = true;
            }
          });
          if (layoutFLg) this.$parent.doLayout();
          return;
        }
        var self = this;
        VueUtil.loop(columns, function(column, index) {
          var rightIndex = self.pinForm.rightPin.indexOf(column);
          if (rightIndex !== -1) self.pinForm.rightPin.splice(rightIndex, 1);
          column.fixed = 'left';
          column.fixedIndex = index;
          VueUtil.loop(column.colColumns, function(colColumn) {
            colColumn.fixed = 'left';
            colColumn.fixedIndex = index;
          });
        });
        this.$parent.doLayout();
      },
      rightPin: function(columns, columnItem, oldColumns) {
        var removedTag = VueUtil.difference(oldColumns, columns);
        if(removedTag.length) this.removePin(removedTag[0]);

        if (columns.length <= 0) {
          var layoutFLg = false;
          VueUtil.loop(this.tableColumns, function(column) {
            if (column.fixed === 'right') {
              column.fixed = false;
              layoutFLg = true;
            }
          });
          if (layoutFLg) this.$parent.doLayout();
          return;
        }
        var self = this;
        VueUtil.loop(columns, function(column, index) {
          var leftIndex = self.pinForm.leftPin.indexOf(column);
          if (leftIndex !== -1) self.pinForm.leftPin.splice(leftIndex, 1);
          column.fixed = 'right';
          column.fixedIndex = index;
          VueUtil.loop(column.colColumns, function(colColumn) {
            colColumn.fixed = 'right';
            colColumn.fixedIndex = index;
          });
        });
        this.$parent.doLayout();
      },
      sortColumn: function(column, descFlg) {
        column.sortable = true;
        if (descFlg) {
          column.order = 'descending';
        } else {
          column.order = 'ascending';
        }
        var sortIndex = this.store.states.sortingColumns.indexOf(column);
        if (sortIndex === -1) {
          this.store.states.sortingColumns.push(column);
        }
        this.doSort();
      },
      removeSortColumn: function(column, flg) {
        if (flg) column.sortable = false;
        var sortIndex = this.sortList.indexOf(column);
        if (sortIndex === -1) return;
        column.order = '';
        this.sortList.splice(sortIndex, 1);
        this.doSort();
      },
      doSort: function() {
        this.store.commit('changeSortCondition');
      },
      filterColumn: function() {
        var self = this;
        var filterColumn = this.filterForm.filterColumn;
        if (!VueUtil.isDef(filterColumn)) return;

        if (!filterColumn.complexFilters) filterColumn.complexFilters = [];
        var complexFilters = filterColumn.complexFilters;

        var found = VueUtil.arrayFind(complexFilters, function(filter) {
          return filter.operations == self.filterForm.operations
              && filter.conditions == self.filterForm.conditions;
        });

        if(!found) {
          complexFilters.push({
            conditions: this.filterForm.conditions,
            operations: this.filterForm.operations
          });
        }
        this.doFilter(filterColumn);
      },
      removeFilterColumn: function(column,filter) {
        var store = this.store;

        if(filter) {
          var index = column.complexFilters.indexOf(filter);
          if (index > -1) {
            column.complexFilters.splice(index , 1);
          }
        } else {
          column.complexFilters = [];
        }


        store.commit('filterChange', {
          column: column,
          values: {complexFilters: column.complexFilters}
        });


        this.$forceUpdate();
      },
      doFilter: function(filterColumn) {

        var store = this.store;
        store.commit('filterChange', {
          column: filterColumn,
          values: {complexFilters: filterColumn.complexFilters}
        });
        this.doSort();
        this.$forceUpdate();
      },
      displayColumn: function(column) {
        column.visible = !column.visible;
        VueUtil.loop(column.colColumns, function(colColumn) {
          colColumn.visible = !colColumn.visible;
        });
        this.$parent.doLayout();
      },
      reorderColumn: function(index, direction) {
        var toIndex = direction === 'up' ? index - 1 : index + 1;
        this.store.commit('reorderColumn', index, toIndex);
      }
    },
    mounted: function() {
      if (this.store) {
        var tableColumns = this.tableColumns;
        VueUtil.loop(this.store.states._columns, function(column) {
          if (column.property !== 'selectionColumn'
            && column.property !== 'indexColumn'
            && column.property !== 'expandColumn') {
            tableColumns.push(column);
          }
        });
        this.pinForm.leftPin = this.store.states.fixedColumns;
        this.pinForm.rightPin = this.store.states.rightFixedColumns;
        this.sortList = this.store.states.sortingColumns;
      }
    }
  };
  var VueTable = {
    template: '<div :class="[\'vue-table\', {\'vue-table--fit\': fit, \'vue-table--striped\': stripe, \'vue-table--border\': border}]" @mouseleave="handleMouseLeave($event)" :style="{width: layout.bodyWidth <= 0 ? \'0px\' : \'\'}"><div class="hidden-columns" ref="hiddenColumns"><slot></slot></div><div class="vue-table__main"><div class="vue-table__header-wrapper" ref="headerWrapper" v-show="showHeader"><table-header ref="tableHeader" :style="{width: layout.bodyWidth ? layout.bodyWidth + \'px\' : \'\'}"></table-header></div><div class="vue-table__body-wrapper" ref="bodyWrapper" tabindex="0" :style="[bodyHeight]"><table-body ref="tableBody" :style="{width: bodyWidth}"></table-body><div :style="{width: bodyWidth}" class="vue-table__empty-block" v-show="!data || data.length === 0"><span class="vue-table__empty-text"><slot name="empty">{{emptyText || emptyLabel}}</slot></span></div></div><div class="vue-table__footer-wrapper" ref="footerWrapper" v-show="showFooter"><table-footer ref="tableFooter" :style="{width: layout.bodyWidth ? layout.bodyWidth + \'px\' : \'\'}"></table-footer></div></div><div class="vue-table__fixed" v-show="leftFixedCount > 0" :style="[{width: layout.fixedWidth ? layout.fixedWidth + \'px\' : \'\'}, fixedHeight]"><div class="vue-table__fixed-header-wrapper" ref="fixedHeaderWrapper" v-show="showHeader"><table-header fixed="left" :style="{width: layout.fixedWidth ? layout.fixedWidth + \'px\' : \'\'}"></table-header></div><div class="vue-table__fixed-body-wrapper" ref="fixedBodyWrapper" :style="[{top: layout.headerHeight + \'px\'}, fixedBodyHeight]"><table-body ref="fixedTableBody" fixed="left" :style="{width: layout.fixedWidth ? layout.fixedWidth + \'px\' : \'\'}"></table-body></div><div class="vue-table__fixed-footer-wrapper" ref="fixedFooterWrapper" v-show="showFooter"><table-footer fixed="left" :style="{width: layout.fixedWidth ? layout.fixedWidth + \'px\' : \'\'}"></table-footer></div></div><div class="vue-table__fixed-right" v-show="rightFixedCount > 0" :style="[{width: layout.rightFixedWidth ? layout.rightFixedWidth + \'px\' : \'\'}, {right: layout.scrollY ? (border ? layout.gutterWidth : (layout.gutterWidth || 1)) + \'px\' : \'\'}, fixedHeight]"><div class="vue-table__fixed-header-wrapper" ref="rightFixedHeaderWrapper" v-show="showHeader"><table-header fixed="right" :style="{width: layout.rightFixedWidth ? layout.rightFixedWidth + \'px\' : \'\'}"></table-header></div><div class="vue-table__fixed-body-wrapper" ref="rightFixedBodyWrapper" :style="[{top: layout.headerHeight + \'px\'}, fixedBodyHeight]"><table-body ref="rightFixedTableBody" fixed="right" :style="{width: layout.rightFixedWidth ? layout.rightFixedWidth + \'px\' : \'\'}"></table-body></div><div class="vue-table__fixed-footer-wrapper" ref="rightFixedFooterWrapper" v-show="showFooter"><table-footer fixed="right" :style="{width: layout.rightFixedWidth ? layout.rightFixedWidth + \'px\' : \'\'}"></table-footer></div></div><div class="vue-table__fixed-right-patch" v-show="rightFixedCount > 0" :style="{width: layout.scrollY ? layout.gutterWidth + \'px\' : \'0\', height: layout.headerHeight + \'px\'}"></div><div class="vue-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div><table-context-menu ref="contextMenu" v-if="contextMenu" v-model="showContextMenu""></table-context-menu></div>',
    name: 'VueTable',
    props: {
      data: {
        type: Array,
        default: function() {
          return [];
        }
      },
      lazyload: Boolean,
      height: [String, Number],
      fit: {
        type: Boolean,
        default: true
      },
      stripe: Boolean,
      border: Boolean,
      context: {},
      showHeader: {
        type: Boolean,
        default: true
      },
      showFooter: Boolean,
      contextMenu: Boolean,
      rowClassName: [String, Function],
      rowStyle: [Object, Function],
      highlightCurrentRow: Boolean,
      highlightFirstAfterFilter: Boolean,
      highlightFirstAfterSort: Boolean,
      highlightHoverRow: {
        type: Boolean,
        default: true
      },
      emptyText: String,
      defaultExpandAll: Boolean,
      defaultSort: {
        type: Array,
        default: function() {
          return [];
        }
      },
      tooltipEffect: {
        type: String,
        default: 'light'
      },
      expandClassName: [String, Function]
    },
    components: {
      TableHeader: TableHeader,
      TableBody: TableBody,
      TableFooter: TableFooter,
      TableContextMenu: TableContextMenu
    },
    activated: function() {
      var refs = this.$refs;
      var scrollTop = this.bodyScroll.top;
      refs.bodyWrapper.scrollTop = scrollTop;
      refs.fixedBodyWrapper.scrollTop = scrollTop;
      refs.rightFixedBodyWrapper.scrollTop = scrollTop;
    },
    methods: {
      clearFilters: function() {
        var filterPanels = this.$refs.tableHeader.filterPanels;

        for (var key in filterPanels) {
          filterPanels[key].handleReset();
        }
      },
      clearSorts: function() {
        var self = this;
        self.store.states.sortingColumns = [];
        self.$refs.contextMenu && (self.$refs.contextMenu.sortList = []);
        VueUtil.loop(self.store.states.columns, function(column) {
          column.order = null;
        });
        self.store.commit('changeSortCondition');
      },
      exportCsv: function(params) {
        if (!VueUtil.isObject(params)) params = {};
        if (params.fileName) {
          if (params.fileName.indexOf('.csv') === -1) {
            params.fileName += '.csv';
          }
        } else {
          params.fileName = 'table.csv';
        }
        if (!VueUtil.isDef(params.original)) params.original = true;
        var columns = params.original ? this.store.states._columns : this.store.states.columns;
        columns = VueUtil.filter(columns, function(column) {
          return (column.property !== 'selectionColumn'
            && column.property !== 'indexColumn'
            && column.property !== 'expandColumn');
        });
        var datas = params.original ? this.store.states._data : this.store.states.data;
        var footer = [];
        if (this.showFooter) {
          footer = VueUtil.map(VueUtil.filter(this.store.states.aggregates, function(aggregate) {
            return (aggregate.property !== 'selectionColumn'
              && aggregate.property !== 'indexColumn'
              && aggregate.property !== 'expandColumn');
          }), function(aggregate) {
            return aggregate.label;
          });
        }
        var appendLine = function(content, row, options) {
          var separator = options.separator;
          var line = VueUtil.map(row, function(data) {
            return '"' + VueUtil.toString(data).replace(/"/g, '""') + '"';
          });
          content.push(line.join(separator));
        };
        var tableDataToCsv = function(columns, datas, footer, options) {
          options = VueUtil.merge({}, {separator: ','}, options);
          var columnOrder;
          var content = [];
          var column = [];
          if (columns) {
            columnOrder = VueUtil.map(columns, function(v) {
              if (VueUtil.isString(v)) return v;
              column.push(VueUtil.isDef(v.printLabel) ? v.printLabel : VueUtil.isDef(v.label) ? v.label : v.property);
              return v.property;
            });
            if (column.length > 0) appendLine(content, column, options);
          } else {
            columnOrder = [];
            VueUtil.loop(datas, function(v) {
              if (!VueUtil.isArray(v)) {
                VueUtil.mergeArray(columnOrder, Object.keys(v));
              }
            });
            if (columnOrder.length > 0) {
              columnOrder = VueUtil.filter(columnOrder, function(value, index, self) {return self.indexOf(value) === index;});
              appendLine(content, columnOrder, options);
            }
          }
          VueUtil.loop(datas, function(row) {
            if (!VueUtil.isArray(row)) {
              row = VueUtil.map(columnOrder, function(k) {return VueUtil.isDef(row[k]) ? row[k] : '';});
            }
            appendLine(content, row, options);
          });
          if (VueUtil.isArray(footer)) {
            appendLine(content, footer, options);
          }
          return content.join('\r\n');
        };
        var data = tableDataToCsv(columns, datas, footer, params);
        var getDownloadUrl = function(text) {
          var BOM = '\uFEFF';
          if (Blob && URL && URL.createObjectURL) {
            var csvData = new Blob([BOM + text], {type: 'text/csv'});
            return URL.createObjectURL(csvData);
          } else {
            return 'data:attachment/csv;charset=utf-8,' + BOM + encodeURIComponent(text);
          }
        };
        var exportFile = function(fileName, text) {
          if (navigator.msSaveBlob) {
            var BOM = '\uFEFF';
            var csvData = new Blob([BOM + text], {type: 'text/csv'});
            navigator.msSaveBlob(csvData, fileName);
          } else {
            try {
              var link = document.createElement('a');
              link.download = fileName;
              link.href = getDownloadUrl(text);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } catch (e) {
              Vue.notify.warning({message: Vue.t('vue.screenfull.canot')});
              throw e;
            }
          }
        };
        exportFile(params.fileName, data);
      },
      columnFilter: function(columnProp, value) {
        var filterColumn = null;
        if (VueUtil.isString(columnProp)) {
          VueUtil.loop(this.store.states._columns, function(column){
            if (VueUtil.isDef(filterColumn)) return;
            if (column.property === columnProp) filterColumn = column;
          });
        } else {
          filterColumn = columnProp;
        }
        this.store.commit('filterChange', {
          column: filterColumn,
          values: value
        });
      },
      multipleColumnSort: function(sortList) {
        this.store.states.sortingColumns = sortList || [];
        this.store.commit('changeSortCondition');
      },
      toggleContextMenu: function() {
        if (this.contextMenu) this.showContextMenu = !this.showContextMenu;
      },
      getUserSetting: function(field) {
        var userSetting = {
          columns: [],
          columnsOrder: []
        };

        if (this.store) {
          VueUtil.loop(this.store.states._columns, function(column) {
            userSetting.columnsOrder.push(column.columnId);
              var setting = {
                id: column.columnId,
                property: column.property,
              };

              if (!field || field.indexOf('order') > -1) {
                setting.order = column.order;
              }
              if (!field || field.indexOf('fixed') > -1) {
                setting.fixed = column.fixed;
              }
              if (!field || field.indexOf('visible') > -1) {
                setting.visible = column.visible;
              }
              if (!field || field.indexOf('filter') > -1) {
                setting.filter = {complexFilters: column.complexFilters, simpleFilters: column.filteredValue};
              }
              userSetting.columns.push(setting);
          });
          // this.pinForm.leftPin = this.store.states.fixedColumns;
          // this.pinForm.rightPin = this.store.states.rightFixedColumns;
          // this.sortList = this.store.states.sortingColumns;
        }

        return userSetting;
      },
      setUserSetting: function(userSetting) {
        if(!userSetting) {
          return;
        }
        var self = this;
        if(userSetting.columnsOrder) {
          userSetting.columnsOrder.forEach(function(orderId, toIndex) {

            var index = VueUtil.arrayFindIndex(self.store.states._columns, function(column) {
              return column.columnId == orderId;
            });

            self.store.commit('reorderColumn', index, toIndex);
          });
        }

        if(!userSetting.columns) {
          return;
        }
        var columns = this.store.states._columns;

        self.clearSorts();
        self.$refs.contextMenu.pinForm = {
          leftPin: [],
          rightPin: []
        };

        userSetting.columns.forEach(function(setting) {
          var column = VueUtil.arrayFind(columns, function(column) {
            return (column.columnId == setting.id && column.property == setting.property);
          });
          column.fixed = false;
          column.visible = true;

          self.store.commit('filterChange', {
            column: column,
            values: {},
            silent: true
          });

          if (setting.fixed == 'left') {
            self.$refs.contextMenu.pinForm.leftPin.push(column);
          }

          if (setting.fixed == 'right') {
            self.$refs.contextMenu.pinForm.rightPin.push(column);
          }

          if (setting.order) {
            self.$refs.contextMenu.sortColumn(column, setting.order == 'descending');
          }

          if ((setting.filter.complexFilters && setting.filter.complexFilters.length > 0) 
          || (setting.filter.simpleFilters && setting.filter.simpleFilters.length > 0)) {
            column.complexFilters = setting.filter.complexFilters || [];
            column.filteredValue = setting.filter.simpleFilters || [];
            self.store.commit('filterChange', {
              column: column,
              values: setting.filter,
            });
            
          }

          if (setting.visible === false) {
            self.$refs.contextMenu.displayColumn(column);
          }
        });

        self.$refs.contextMenu.filterForm = {
          filterColumn: null,
          conditions: null,
          operations: '='
        };
        self.doLayout();
      },
      setCurrentRow: function(row, scrollTo) {
        this.store.commit('setCurrentRow', row);
        if (scrollTo) {
          var rowEl = this.$refs.tableBody.$refs['trow'+row.$index];
          var bodyHeight = this.$refs.bodyWrapper.offsetHeight;
          var oldScrollTop = this.$refs.bodyWrapper.scrollTop;
          var maxScrollTop = rowEl.offsetTop + this.$refs.tableBody.delta.marginTop;
          var minScrollTop = maxScrollTop - (bodyHeight - rowEl.offsetHeight);
          
          if(oldScrollTop > maxScrollTop) this.$refs.bodyWrapper.scrollTop = maxScrollTop;
          if(oldScrollTop < minScrollTop) this.$refs.bodyWrapper.scrollTop = minScrollTop;
        }
      },
      getCurrentRow: function() {
        return this.store.states.currentRow;
      },
      getSelection: function() {
        return this.store.states.selection;
      },
      toggleRowSelection: function(row, selected) {
        if (this.store.toggleRowSelection(row, selected)) {
          this.$emit('selection-change', this.store.states.selection);
        }
        this.store.updateAllSelected();
      },
      clearSelection: function() {
        this.store.clearSelection();
      },
      handleMouseLeave: function() {
        this.store.commit('setHoverRow', null);
        if (this.hoverState) this.hoverState = null;
      },
      updateScrollY: function() {
        this.layout.updateScrollY();
        var refs = this.$refs;
        refs.fixedBodyWrapper && (refs.fixedBodyWrapper.scrollTop = this.bodyScroll.top);
        refs.rightFixedBodyWrapper && (refs.rightFixedBodyWrapper.scrollTop = this.bodyScroll.top);
      },
      isCellHidden: function(index, fixed) {
        if (fixed === 'left') {
          return index >= this.leftFixedCount;
        }
        if (fixed === 'right') {
          return index < this.store.states.columns.length - this.rightFixedCount;
        }
        return (index < this.leftFixedCount) || (index >= this.store.states.columns.length - this.rightFixedCount);
      },
      bodyScrollFn: function(event) {
        var refs = this.$refs;
        var scrollLeft = refs.bodyWrapper.scrollLeft;
        var scrollTop = refs.bodyWrapper.scrollTop;
        if (this.bodyScroll.left !== scrollLeft) {
          this.bodyScroll.left = scrollLeft;
          refs.headerWrapper.scrollLeft = scrollLeft;
          refs.footerWrapper.scrollLeft = scrollLeft;
          if (scrollLeft === 0) {
            this.$emit('scroll-left');
          }
          if (scrollLeft === refs.bodyWrapper.scrollWidth - refs.bodyWrapper.clientWidth) {
            this.$emit('scroll-right');
          }
        }
        if (this.bodyScroll.top !== scrollTop) {
          refs.tableBody.updateZone(scrollTop);
          this.bodyScroll.top = scrollTop;
          refs.fixedBodyWrapper.scrollTop = scrollTop;
          refs.rightFixedBodyWrapper.scrollTop = scrollTop;
          if (scrollTop === 0) {
            this.$emit('scroll-top');
          }
          if (scrollTop === refs.bodyWrapper.scrollHeight - refs.bodyWrapper.clientHeight) {
            this.$emit('scroll-bottom');
          }
        }
      },
      scrollYMouseWheel: function(event) {
        var refs = this.$refs;
        if (this.layout.scrollY) {
          event.preventDefault();
          var wheelDelta = event.wheelDelta || -event.detail;
          var scrollTop = this.bodyScroll.top;
          var wheel = 40;
          if (VueUtil.isElement(refs.tableBody.$refs.tbody)) wheel = refs.tableBody.$refs.tbody.firstElementChild.offsetHeight;
          wheel = wheel * 3;
          if (wheelDelta < 0) {
            scrollTop += wheel;
          } else {
            scrollTop -= wheel;
          }
          var scrollBottom = refs.bodyWrapper.scrollHeight - refs.bodyWrapper.clientHeight;
          scrollTop < 0 ? scrollTop = 0 : null;
          scrollTop > scrollBottom ? scrollTop = scrollBottom : null;
          refs.bodyWrapper.scrollTop = scrollTop;
          refs.fixedBodyWrapper.scrollTop = scrollTop;
          refs.rightFixedBodyWrapper.scrollTop = scrollTop;
        }
      },
      scrollXMouseWheel: function(event) {
        var refs = this.$refs;
        if (this.layout.scrollX) {
          event.preventDefault();
          var wheelDelta = event.wheelDelta || -event.detail;
          var scrollLeft = this.bodyScroll.left;
          if (wheelDelta < 0) {
            scrollLeft += 80;
          } else {
            scrollLeft -= 80;
          }
          var scrollRight = refs.bodyWrapper.scrollWidth - refs.bodyWrapper.clientWidth;
          scrollLeft < 0 ? scrollLeft = 0 : null;
          scrollLeft > scrollRight ? scrollLeft = scrollRight : null;
          refs.bodyWrapper.scrollLeft = scrollLeft;
          refs.headerWrapper.scrollLeft = scrollLeft;
          refs.footerWrapper.scrollLeft = scrollLeft;
        }
      },
      bodyKeydownFn: function(e) {
        if (e.keyCode == 38 || e.keyCode == 40) {
          e.preventDefault();
          var index = this.store.states.data.indexOf(this.store.states.currentRow);
          if(e.keyCode == 38) index--;
          if(e.keyCode == 40) index++;
          var focusToRow = this.store.states.data[index];
          if (focusToRow) {
            this.setCurrentRow(focusToRow, true);
          }
        }
      },
      bindEvents: function() {
        var refs = this.$refs;
        var mouseWheel = VueUtil.isFirefox ? 'DOMMouseScroll' : 'mousewheel';
        VueUtil.on(refs.bodyWrapper, 'keydown', this.bodyKeydownFn);
        VueUtil.on(refs.bodyWrapper, 'scroll', this.bodyScrollFn);
        VueUtil.on(refs.bodyWrapper, mouseWheel, this.scrollYMouseWheel);
        VueUtil.on(refs.fixedBodyWrapper, mouseWheel, this.scrollYMouseWheel);
        VueUtil.on(refs.rightFixedBodyWrapper, mouseWheel, this.scrollYMouseWheel);
        VueUtil.on(refs.headerWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.on(refs.fixedHeaderWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.on(refs.rightFixedHeaderWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.on(refs.footerWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.on(refs.fixedFooterWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.on(refs.rightFixedFooterWrapper, mouseWheel, this.scrollXMouseWheel);
        if (this.fit) {
          VueUtil.addResizeListener(this.$el, this.doLayout);
        }
      },
      unBindEvents: function() {
        var refs = this.$refs;
        var mouseWheel = VueUtil.isFirefox ? 'DOMMouseScroll' : 'mousewheel';
        VueUtil.off(refs.bodyWrapper, 'scroll', this.bodyScrollFn);
        VueUtil.off(refs.bodyWrapper, mouseWheel, this.scrollYMouseWheel);
        VueUtil.off(refs.fixedBodyWrapper, mouseWheel, this.scrollYMouseWheel);
        VueUtil.off(refs.rightFixedBodyWrapper, mouseWheel, this.scrollYMouseWheel);
        VueUtil.off(refs.headerWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.off(refs.fixedHeaderWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.off(refs.rightFixedHeaderWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.off(refs.footerWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.off(refs.fixedFooterWrapper, mouseWheel, this.scrollXMouseWheel);
        VueUtil.off(refs.rightFixedFooterWrapper, mouseWheel, this.scrollXMouseWheel);
        if (this.fit) {
          VueUtil.removeResizeListener(this.$el, this.doLayout);
        }
      },
      resizeZone: function() {
        var refs = this.$refs;
        refs.tableBody && refs.tableBody.updateZone(this.bodyScroll.top);
        if (this.showFooter) {
          this.store.getAggregate(this.store.states.columns, this.store.states.data);
          refs.tableFooter.aggregates = this.store.states.aggregates;
        }
      },
      doLayout: function() {
        var self = this;
        self.store.updateColumns();
        self.$nextTick(function() {
          self.layout.update();
          self.layout.updateHeight();
          self.updateScrollY();
          self.resizeZone();
        });
      }
    },
    created: function() {
      this.tableId = 'vue-table_';
      this.columnId = 1;
    },
    computed: {
      emptyLabel: function() {
        return this.$t('vue.table.emptyText');
      },
      leftFixedCount: function() {
        return this.store.states.fixedColumns.length;
      },
      rightFixedCount: function() {
        return this.store.states.rightFixedColumns.length;
      },
      bodyHeight: function() {
        var style = {};
        style = {
          height: this.layout.bodyHeight ? this.layout.bodyHeight + 'px' : ''
        };
        return style;
      },
      bodyWidth: function() {
        var layout = this.layout;
        return layout.bodyWidth ? layout.bodyWidth - (layout.scrollY ? layout.gutterWidth : 0) + 'px' : '';
      },
      fixedBodyHeight: function() {
        var style = {};
        var layout = this.layout;
        if (this.height) {
          style = {
            height: layout.fixedBodyHeight ? layout.fixedBodyHeight + 'px' : ''
          };
        }
        return style;
      },
      fixedHeight: function() {
        var style = {};
        var layout = this.layout;
        style = {
          height: layout.viewportHeight ? layout.viewportHeight + 'px' : ''
        };
        return style;
      }
    },
    watch: {
      height: function(val) {
        this.layout.setHeight(val);
      },
      data: {
        immediate: true,
        handler: function(val) {
          var store = this.store;
          store.commit('setData', val);
          VueUtil.loop(store.states.columns, function(column) {
            if ((column.filteredValue && column.filteredValue.length) 
            || column.complexFilters && column.complexFilters.length) {
              store.commit('filterChange', {
                column: column,
                values: {complexFilters: column.complexFilters, simpleFilters: column.filteredValue},
                silent: true
              });
            }
          });

          if (store.states.sortingColumns.length > 0) {
            this.$nextTick(function() {
              store.commit('changeSortCondition');
            });
          }
        }
      },
      showHeader: function() {
        this.doLayout();
      },
      showFooter: function() {
        this.doLayout();
      },
      lazyload: function(val) {
        if (this.height) {
          var delta = this.$refs.tableBody.delta;
          if (val) {
            delta.keeps = this.height * 1;
          } else {
            delta.keeps = 0;
          }
          this.doLayout();
        }
      }
    },
    beforeDestroy: function() {
      this.unBindEvents();
    },
    mounted: function() {
      this.layout.setHeight(this.height);
      this.bindEvents();
      this.doLayout();

      //table的contextmenu在多个table的情况，会被覆盖 Bug #1263
      if (this.contextMenu) {
        this.$el.parentNode.appendChild(this.$refs.contextMenu.$el);
      }
    },
    data: function() {
      var store = new TableStore(this, {defaultExpandAll: self.defaultExpandAll});
      var layout = new TableLayout({
        store: store,
        table: this,
        fit: this.fit,
        showHeader: self.showHeader
      });
      return {
        store: store,
        layout: layout,
        renderExpanded: null,
        resizeProxyVisible: false,
        showContextMenu: false,
        bodyScroll: {left: 0, top: 0}
      };
    }
  };
  Vue.component(VueTable.name, VueTable);
});
