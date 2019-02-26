(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueTableColumn = definition(context.Vue, context.VueUtil);
    delete context.VueTableColumn;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var columnIdSeed = 1;
  var defaults = {
    default: {
      order: ''
    },
    selection: {
      width: 53,
      minWidth: 53,
      realWidth: 53,
      order: '',
      className: 'vue-table-column--selection'
    },
    expand: {
      width: 53,
      minWidth: 53,
      realWidth: 53,
      order: ''
    },
    index: {
      width: 53,
      minWidth: 53,
      realWidth: 53,
      order: ''
    }
  };
  var forced = {
    selection: {
      property: 'selectionColumn',
      renderHeader: function(createElement) {
        var states = this.store.states;
        return createElement('vue-checkbox', {
          on: {
            change: this.toggleAllSelection
          },
          attrs: {
            value: states.isAllSelected,
            indeterminate: states.selection.length > 0 && !states.isAllSelected
          }
        }, []);
      },
      renderCell: function(createElement, data) {
        var row = data.row;
        var column = data.column;
        var store = data.store;
        var index = data.$index;
        return createElement('vue-checkbox', {
          attrs: {
            disabled: !!column.selectable && !column.selectable.call(null, row, index),
            value: store.isSelected(row)
          },
          on: {
            input: function() {
              store.commit('rowSelectedChanged', row);
            }
          }
        }, []);
      },
      sortable: false,
      resizable: false
    },
    index: {
      property: 'indexColumn',
      renderHeader: function(createElement) {
        return '#';
      },
      renderCell: function(createElement, data) {
        var n = data.$index;
        return createElement('div', null, [n + 1]);
      },
      sortable: false
    },
    expand: {
      property: 'expandColumn',
      renderHeader: function(createElement) {
        return '';
      },
      renderCell: function(createElement, data, proxy) {
        var row = data.row;
        var store = data.store;
        var expanded = store.states.expandRows.indexOf(row) !== -1;
        return createElement('div', {
          class: 'vue-table__expand-icon ' + (expanded ? 'vue-table__expand-icon--expanded' : ''),
          on: {
            click: function() {
              return proxy.handleExpandClick(row);
            }
          }
        }, [createElement('i', {
          class: 'vue-icon vue-icon-arrow-right'
        }, [])]);
      },
      sortable: false,
      resizable: false,
      className: 'vue-table__expand-column'
    }
  };
  var VueTableColumn = {
    name: 'VueTableColumn',
    render: function(createElement) {
      var slots = this.$slots.default;
      return createElement('div', slots);
    },
    props: {
      type: {
        type: String,
        default: 'default'
      },
      label: String,
      printLabel: String,
      className: [String, Function],
      labelClassName: String,
      property: String,
      prop: String,
      width: {},
      minWidth: {},
      sortable: Boolean,
      sortMethod: Function,
      resizable: {
        type: Boolean,
        default: true
      },
      context: {},
      align: String,
      headerAlign: String,
      showOverflowTooltip: Boolean,
      fixed: [Boolean, String],
      formatter: Function,
      selectable: Function,
      visible: {
        type: Boolean,
        default: true
      },
      filterable: Boolean,
      filtered: {
        type: Boolean,
        default: false
      },
      filterMethod: Function,
      filteredValue: Array,
      filters: Array,
      aggregate: {
        type: String,
        default: ''
      },
      aggregateLabel: String,
      labelColspan: Boolean,
      colspan: Boolean,
      rowspan: Boolean
    },
    beforeCreate: function() {
      this.row = {};
      this.column = {};
      this.$index = 0;
    },
    computed: {
      owner: function() {
        var parent = this.$parent;
        while (parent && !parent.tableId) {
          parent = parent.$parent;
        }
        return parent;
      }
    },
    created: function() {
      var self = this;
      var columnId = self.columnId = ((self.$parent.tableId || (self.$parent.columnId + '_')) + 'column_' + columnIdSeed++);
      var parent = self.$parent;
      var owner = self.owner;
      var type = self.type;
      var width = self.width;
      if (VueUtil.isDef(width)) {
        width = parseInt(width, 10);
        if (isNaN(width)) {
          width = null;
        }
      }
      var minWidth = self.minWidth;
      if (VueUtil.isDef(minWidth)) {
        minWidth = parseInt(minWidth, 10);
        if (isNaN(minWidth)) {
          minWidth = 80;
        }
      }
      var getDefaultColumn = function(type, options) {
        var column = {};
        VueUtil.merge(column, defaults[type || 'default'], options);
        column.realWidth = column.width || column.minWidth;
        return column;
      };
      var column = getDefaultColumn(type, {
        id: columnId,
        label: self.label,
        printLabel: self.printLabel,
        className: self.className,
        labelClassName: self.labelClassName,
        property: self.prop || self.property,
        type: type,
        renderCell: null,
        renderHeader: self.renderHeader,
        minWidth: minWidth,
        width: width,
        visible: self.visible,
        context: self.context,
        align: self.align ? 'is-' + self.align : null,
        headerAlign: self.headerAlign ? 'is-' + self.headerAlign : 'is-center',
        sortable: self.sortable,
        sortMethod: self.sortMethod,
        resizable: self.resizable,
        showOverflowTooltip: self.showOverflowTooltip,
        formatter: self.formatter,
        selectable: self.selectable,
        fixed: self.fixed === '' ? true : self.fixed,
        fixedIndex: -1,
        filterMethod: self.filterMethod,
        filterable: self.filterable,
        filtered: self.filtered,
        filterOpened: false,
        filteredValue: self.filteredValue || [],
        filters: self.filters || [],
        aggregate: self.aggregate,
        aggregateLabel: self.aggregateLabel,
        labelColspan: self.labelColspan,
        rowspan: self.rowspan,
        getCellClass: function(rowIndex, cellIndex, rowData) {
          var classes = [];
          var className = self.className;
          if (VueUtil.isString(className)) {
            classes.push(className);
          } else if (VueUtil.isFunction(className)) {
            classes.push(className.call(null, rowIndex, cellIndex, rowData) || '');
          }
          return classes.join(' ');
        }
      });
      VueUtil.merge(column, forced[type] || {});
      self.columnConfig = column;
      var renderCell = column.renderCell;
      var renderHeader = column.renderHeader;
      column.renderHeader = function() {
        if (self.$scopedSlots.header) {
          column.renderHeader = function() {
            return self.$scopedSlots.header();
          };
        } else {
          column.renderHeader = renderHeader;
        }
      };
      if (type === 'expand') {
        owner.renderExpanded = function(createElement, data) {
          return self.$scopedSlots.default ? self.$scopedSlots.default(data) : self.$slots.default;
        };
        column.renderCell = function(createElement, data) {
          return createElement('div', {
            class: 'cell'
          }, [renderCell(createElement, data, this._renderProxy)]);
        };
        return;
      }
      column.renderCell = function(createElement, data) {
        if (self.$scopedSlots.default) {
          renderCell = function() {
            return self.$scopedSlots.default(data);
          };
        }
        if (!renderCell) {
          renderCell = function(createElement, data) {
            var row = data.row;
            var column = data.column;
            var property = column.property;
            var value = row[property];
            if (property && property.indexOf('.') !== -1) {
              var getValueByPath = function(object, prop) {
                prop = prop || '';
                var paths = prop.split('.');
                var current = object;
                var result = null;
                VueUtil.loop(paths, function(path, i) {
                  if (!current) return false;
                  if (i === paths.length - 1) {
                    result = current[path];
                    return false;
                  }
                  current = current[path];
                });
                return result;
              };
              value = getValueByPath(row, property);
            }
            if (VueUtil.isFunction(column.formatter)) {
              return column.formatter(row, column, value);
            }
            return value;
          };
        }
        return self.showOverflowTooltip ? createElement('div',
            {class: 'cell vue-tooltip'},
          [renderCell(createElement, data)]) : createElement('div', {
            class: 'cell'
          }, [renderCell(createElement, data)]);
      };
    },
    destroyed: function() {
      if (!this.$parent) return;
      this.owner.store.commit('removeColumn', this.columnConfig);
    },
    watch: {
      label: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.label = newVal;
          this.owner.doLayout();
        }
      },
      prop: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.property = newVal;
        }
      },
      property: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.property = newVal;
        }
      },
      align: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.align = newVal ? 'is-' + newVal : null;
          if (!this.headerAlign) {
            this.columnConfig.headerAlign = newVal ? 'is-' + newVal : null;
          }
        }
      },
      headerAlign: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.headerAlign = 'is-' + (newVal ? newVal : this.align);
        }
      },
      width: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.width = newVal;
          this.owner.doLayout();
        }
      },
      minWidth: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.minWidth = newVal;
          this.owner.doLayout();
        }
      },
      fixed: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.fixed = newVal;
          this.owner.doLayout();
        }
      },
      sortable: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.sortable = newVal;
        }
      },
      visible: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.visible = newVal;
          this.owner.doLayout();
        }
      },
      labelColspan: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.labelColspan = newVal;
          this.owner.doLayout();
        }
      },
      rowspan: function(newVal) {
        if (this.columnConfig) {
          this.columnConfig.rowspan = newVal;
          this.owner.doLayout();
        }
      }
    },
    mounted: function() {
      var owner = this.owner;
      var columnIndex;
      columnIndex = [].indexOf.call(owner.$refs.hiddenColumns.children, this.$el);

      if (columnIndex == -1) {
        columnIndex = [].indexOf.call(owner.$refs.hiddenColumns.children,this.$parent.$el);
      }
      owner.store.commit('insertColumn', this.columnConfig, columnIndex);
    }
  };
  Vue.component(VueTableColumn.name, VueTableColumn);
});
