(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    context.cell = definition(context.baseTable, context.tools);
  }
})(this, function(baseTable, tools) {
  var _defineProperty = tools.UtilTools.defineProperty;
  var Cell = {
    createColumn: function createColumn($table, _vm) {
      var type = _vm.type,
          sortable = _vm.sortable,
          remoteSort = _vm.remoteSort,
          filters = _vm.filters,
          editRender = _vm.editRender,
          treeNode = _vm.treeNode;
      var treeConfig = $table.treeConfig; // 在 v3.0 中废弃 selectConfig
  
      var checkboxConfig = $table.checkboxConfig || $table.selectConfig;
      var isTreeNode = treeConfig && treeNode;
      var renMaps = {
        renderHeader: this.renderHeader,
        renderCell: isTreeNode ? this.renderTreeCell : this.renderCell
      };
  
      switch (type) {
        case 'index':
          renMaps.renderHeader = this.renderIndexHeader;
          renMaps.renderCell = isTreeNode ? this.renderTreeIndexCell : this.renderIndexCell;
          break;
  
        case 'radio':
          renMaps.renderHeader = this.renderRadioHeader;
          renMaps.renderCell = isTreeNode ? this.renderTreeRadioCell : this.renderRadioCell;
          break;
        // 在 v3.0 中废弃 type=selection
  
        case 'checkbox':
        case 'selection':
          renMaps.renderHeader = this.renderSelectionHeader;
          renMaps.renderCell = checkboxConfig && checkboxConfig.checkField ? isTreeNode ? this.renderTreeSelectionCellByProp : this.renderSelectionCellByProp : isTreeNode ? this.renderTreeSelectionCell : this.renderSelectionCell;
          break;
  
        case 'expand':
          renMaps.renderCell = this.renderExpandCell;
          renMaps.renderData = this.renderExpandData;
          break;

        case 'drag':
          renMaps.renderHeader = this.renderDragHeader;
          renMaps.renderCell = this.renderDragCell;
          break;
  
        default:
          if (editRender) {
            renMaps.renderHeader = this.renderEditHeader;
            renMaps.renderCell = $table.editConfig && $table.editConfig.mode === 'cell' ? isTreeNode ? this.renderTreeCellEdit : this.renderCellEdit : isTreeNode ? this.renderTreeRadioCell : this.renderRowEdit;
          } else if (filters && filters.length && (sortable || remoteSort)) {
            renMaps.renderHeader = this.renderSortAndFilterHeader;
          } else if (sortable || remoteSort) {
            renMaps.renderHeader = this.renderSortHeader;
          } else if (filters && filters.length) {
            renMaps.renderHeader = this.renderFilterHeader;
          }
  
      }
  
      return tools.UtilTools.getColumnConfig(_vm, renMaps);
    },
  
    /**
     * 单元格
     */
    renderHeader: function renderHeader(h, params) {
      var column = params.column;
      var slots = column.slots,
          own = column.own;
  
      if (slots && slots.header) {
        return slots.header(params, h);
      } // 在 v3.0 中废弃 label
  
  
      return [tools.UtilTools.formatText(tools.UtilTools.getFuncText(own.title || own.label), 1)];
    },
    renderCell: function renderCell(h, params) {
      var cellValue;
      var $table = params.$table,
          row = params.row,
          column = params.column;
      var slots = column.slots,
          own = column.own;
      var renderOpts = own.editRender || own.cellRender;
  
      if (slots && slots.default) {
        return slots.default(params, h);
      }
  
      if (renderOpts) {
        var funName = own.editRender ? 'renderCell' : 'renderDefault';
  
        var compConf = baseTable.Renderer.get(renderOpts.name);
  
        if (compConf && compConf[funName]) {
          return compConf[funName].call($table, h, renderOpts, params, {
            $type: own.editRender ? 'edit' : 'cell',
            $excel: $table.$parent,
            $table: $table,
            $column: column
          });
        }
      }
  
      cellValue = tools.UtilTools.getCellLabel(row, column, params);
      return [tools.UtilTools.formatText(cellValue, 1)];
    },
    renderTreeCell: function renderTreeCell(h, params) {
      return Cell.renderTreeIcon(h, params).concat(Cell.renderCell.call(this, h, params));
    },
  
    /**
     * 树节点
     */
    renderTreeIcon: function renderTreeIcon(h, params) {
      var _GlobalConfig = GlobalConfig,
          icon = _GlobalConfig.icon;
      var $table = params.$table;
      var treeConfig = $table.treeConfig,
          treeExpandeds = $table.treeExpandeds;
      var row = params.row,
          level = params.level;
      var children = treeConfig.children,
          indent = treeConfig.indent,
          trigger = treeConfig.trigger;
      var rowChildren = row[children];
      var on = {};
  
      if (!trigger || trigger === 'default') {
        on.click = function (evnt) {
          return $table.triggerTreeExpandEvent(evnt, params);
        };
      }
  
      return [h('span', {
        class: 'vue-xtable-tree--indent',
        style: {
          width: ''.concat(level * (indent || 16), 'px')
        }
      }), h('span', {
        class: ['vue-xtable-tree-wrapper', {
          'is--active': treeExpandeds.indexOf(row) > -1
        }],
        on: on
      }, rowChildren && rowChildren.length ? [h('i', {
        class: 'vue-xtable-tree--node-btn '.concat(icon.tree)
      })] : [])];
    },
  
    /**
     * 索引
     */
    renderIndexHeader: function renderIndexHeader(h, params) {
      var column = params.column;
      var slots = column.slots;
  
      if (slots && slots.header) {
        return slots.header(params, h);
      }
  
      return [tools.UtilTools.formatText(column.getTitle(), 1)];
    },
    renderIndexCell: function renderIndexCell(h, params) {
      var $table = params.$table,
          column = params.column;
      var startIndex = $table.startIndex;
      var slots = column.slots,
          indexMethod = column.indexMethod;
  
      if (slots && slots.default) {
        return slots.default(params, h);
      }
  
      var $seq = params.$seq,
          seq = params.seq,
          level = params.level;
      return [tools.UtilTools.formatText(indexMethod ? indexMethod(params) : level ? ''.concat($seq, '.').concat(seq) : startIndex + seq, 1)];
    },
    renderTreeIndexCell: function renderTreeIndexCell(h, params) {
      return Cell.renderTreeIcon(h, params).concat(Cell.renderIndexCell(h, params));
    },
  
    /**
     * 单选
     */
    renderRadioHeader: function renderRadioHeader(h, params) {
      var column = params.column;
      var slots = column.slots,
          own = column.own;
  
      if (slots && slots.header) {
        return slots.header(params, h);
      } // 在 v3.0 中废弃 label
  
  
      return [tools.UtilTools.formatText(tools.UtilTools.getFuncText(own.title || own.label), 1)];
    },
    renderRadioCell: function renderRadioCell(h, params) {
      var _ref;
  
      var $table = params.$table,
          column = params.column,
          isHidden = params.isHidden;
      var vSize = $table.vSize,
          _$table$radioConfig = $table.radioConfig,
          radioConfig = _$table$radioConfig === void 0 ? {} : _$table$radioConfig;
      var slots = column.slots;
      var labelField = radioConfig.labelField,
          checkMethod = radioConfig.checkMethod;
      var isDisabled = !!checkMethod;
  
      if (slots && slots.default) {
        return slots.default(params, h);
      }
  
      var selectRow = $table.selectRow;
      var row = params.row;
      var options = {
        attrs: {
          type: 'radio',
          name: 'vue-xtable-radio--'.concat($table.id)
        }
      };
  
      if (!isHidden) {
        if (checkMethod) {
          isDisabled = !checkMethod(params);
          options.attrs.disabled = isDisabled;
        }
  
        options.domProps = {
          checked: row === selectRow
        };
        options.on = {
          change: function change(evnt) {
            $table.triggerRadioRowEvent(evnt, params);
          }
        };
      }
  
      return [h('label', {
        class: ['vue-xtable-radio', (_ref = {}, _defineProperty(_ref, 'size--'.concat(vSize), vSize), _defineProperty(_ref, 'is--disabled', isDisabled), _ref)]
      }, [h('input', options), h('span', {
        class: 'vue-xtable-radio--icon'
      }), labelField ? h('span', {
        class: 'vue-xtable-radio--label'
      }, VueUtil.get(row, labelField)) : null])];
    },
    renderTreeRadioCell: function renderTreeRadioCell(h, params) {
      return Cell.renderTreeIcon(h, params).concat(Cell.renderRadioCell(h, params));
    },
  
    /**
     * 多选
     */
    renderSelectionHeader: function renderSelectionHeader(h, params) {
      var _ref2;
  
      var $table = params.$table,
          column = params.column,
          isHidden = params.isHidden;
      var vSize = $table.vSize,
          isIndeterminate = $table.isIndeterminate,
          isAllCheckboxDisabled = $table.isAllCheckboxDisabled;
      var slots = column.slots,
          own = column.own; // 在 v3.0 中废弃 selectConfig
  
      var checkboxConfig = $table.checkboxConfig || $table.selectConfig; // 在 v3.0 中废弃 label
  
      var headerTitle = own.title || own.label;
      var options = {
        attrs: {
          type: 'checkbox',
          disabled: isAllCheckboxDisabled
        }
      };
  
      if (slots && slots.header) {
        return slots.header(params, h);
      }
  
      if (checkboxConfig && (checkboxConfig.checkStrictly ? !checkboxConfig.showHeader : checkboxConfig.showHeader === false)) {
        return [];
      }
  
      if (!isHidden) {
        options.domProps = {
          checked: isAllCheckboxDisabled ? false : $table.isAllSelected
        };
        options.on = {
          change: function change(evnt) {
            $table.triggerCheckAllEvent(evnt, evnt.target.checked);
          }
        };
      }
  
      return [h('label', {
        class: ['vue-xtable-checkbox', (_ref2 = {}, _defineProperty(_ref2, 'size--'.concat(vSize), vSize), _defineProperty(_ref2, 'is--disabled', options.attrs.disabled), _defineProperty(_ref2, 'is--indeterminate', isIndeterminate), _ref2)]
      }, [h('input', options), h('span', {
        class: 'vue-xtable-checkbox--icon'
      }), headerTitle ? h('span', {
        class: 'vue-xtable-checkbox--label'
      }, tools.UtilTools.getFuncText(headerTitle)) : null])];
    },

    /**
     * 行拖动
     */
    renderDragHeader: function renderDragHeader(h, params) {
      var column = params.column;
      var slots = column.slots;
  
      if (slots && slots.header) {
        return slots.header(params, h);
      }
      
      return [tools.UtilTools.formatText(column.getTitle(), 1)];
    },

    renderSelectionCell: function renderSelectionCell(h, params) {
      var _ref3;
  
      var $table = params.$table,
          row = params.row,
          column = params.column,
          isHidden = params.isHidden;
      var vSize = $table.vSize,
          treeConfig = $table.treeConfig,
          treeIndeterminates = $table.treeIndeterminates; // 在 v3.0 中废弃 selectConfig
  
      var checkboxConfig = $table.checkboxConfig || $table.selectConfig || {};
      var labelField = checkboxConfig.labelField,
          checkMethod = checkboxConfig.checkMethod;
      var slots = column.slots;
      var indeterminate = false;
      var isDisabled = !!checkMethod;
      var options = {
        attrs: {
          type: 'checkbox'
        }
      };
  
      if (slots && slots.default) {
        return slots.default(params, h);
      }
  
      if (!isHidden) {
        if (checkMethod) {
          isDisabled = !checkMethod(params);
          options.attrs.disabled = isDisabled;
        }
  
        if (treeConfig) {
          indeterminate = treeIndeterminates.indexOf(row) > -1;
        }
  
        options.domProps = {
          checked: $table.selection.indexOf(row) > -1
        };
        options.on = {
          change: function change(evnt) {
            $table.triggerCheckRowEvent(evnt, params, evnt.target.checked);
          }
        };
      }
  
      return [h('label', {
        class: ['vue-xtable-checkbox', (_ref3 = {}, _defineProperty(_ref3, 'size--'.concat(vSize), vSize), _defineProperty(_ref3, 'is--indeterminate', indeterminate), _defineProperty(_ref3, 'is--disabled', isDisabled), _ref3)]
      }, [h('input', options), h('span', {
        class: 'vue-xtable-checkbox--icon'
      }), labelField ? h('span', {
        class: 'vue-xtable-checkbox--label'
      }, VueUtil.get(row, labelField)) : null])];
    },
    renderTreeSelectionCell: function renderTreeSelectionCell(h, params) {
      return Cell.renderTreeIcon(h, params).concat(Cell.renderSelectionCell(h, params));
    },
    renderSelectionCellByProp: function renderSelectionCellByProp(h, params) {
      var _ref4;
  
      var $table = params.$table,
          row = params.row,
          column = params.column,
          isHidden = params.isHidden;
      var vSize = $table.vSize,
          treeConfig = $table.treeConfig,
          treeIndeterminates = $table.treeIndeterminates; // 在 v3.0 中废弃 selectConfig
  
      var checkboxConfig = $table.checkboxConfig || $table.selectConfig || {};
      var labelField = checkboxConfig.labelField,
          property = checkboxConfig.checkField,
          checkMethod = checkboxConfig.checkMethod;
      var slots = column.slots;
      var indeterminate = false;
      var isDisabled = !!checkMethod;
      var options = {
        attrs: {
          type: 'checkbox'
        }
      };
  
      if (slots && slots.default) {
        return slots.default(params, h);
      }
  
      if (!isHidden) {
        if (checkMethod) {
          isDisabled = !checkMethod(params);
          options.attrs.disabled = isDisabled;
        }
  
        if (treeConfig) {
          indeterminate = treeIndeterminates.indexOf(row) > -1;
        }
  
        options.domProps = {
          checked: VueUtil.get(row, property)
        };
        options.on = {
          change: function change(evnt) {
            $table.triggerCheckRowEvent(evnt, params, evnt.target.checked);
          }
        };
      }
  
      return [h('label', {
        class: ['vue-xtable-checkbox', (_ref4 = {}, _defineProperty(_ref4, 'size--'.concat(vSize), vSize), _defineProperty(_ref4, 'is--indeterminate', indeterminate), _defineProperty(_ref4, 'is--disabled', isDisabled), _ref4)]
      }, [h('input', options), h('span', {
        class: 'vue-xtable-checkbox--icon'
      }), labelField ? h('span', {
        class: 'vue-xtable-checkbox--label'
      }, VueUtil.get(row, labelField)) : null])];
    },
    renderTreeSelectionCellByProp: function renderTreeSelectionCellByProp(h, params) {
      return Cell.renderTreeIcon(h, params).concat(Cell.renderSelectionCellByProp(h, params));
    },
  
    /**
     * 展开行
     */
    renderExpandCell: function renderExpandCell(h, params) {
      var $table = params.$table,
          isHidden = params.isHidden;
      var expandActive = false;
  
      if (!isHidden) {
        expandActive = $table.expandeds.indexOf(params.row) > -1;
      }
  
      return [h('span', {
        class: ['vue-xtable-table--expanded', {
          'expand--active': expandActive
        }],
        on: {
          click: function click(evnt) {
            $table.triggerRowExpandEvent(evnt, params);
          }
        }
      }, [h('i', {
        class: 'vue-xtable-table--expand-icon'
      })])];
    },

    /**
     * 行拖动
     */
    renderDragCell: function renderDragCell(h, params) {
      return [h('span', {
        class: ['vue-xtable-table--drag', 'vue-icon-menu'],
      })];
    },

    renderExpandData: function renderExpandData(h, params) {
      var column = params.column;
      var slots = column.slots;
  
      if (slots && slots.default) {
        return slots.default(params, h);
      }
  
      return [];
    },
  
    /**
     * 排序和筛选
     */
    renderSortAndFilterHeader: function renderSortAndFilterHeader(h, params) {
      return Cell.renderHeader(h, params).concat(Cell.renderSortIcon(h, params)).concat(Cell.renderFilterIcon(h, params));
    },
  
    /**
     * 排序
     */
    renderSortHeader: function renderSortHeader(h, params) {
      return Cell.renderHeader(h, params).concat(Cell.renderSortIcon(h, params));
    },
    renderSortIcon: function renderSortIcon(h, params) {
      var _GlobalConfig2 = GlobalConfig,
          icon = _GlobalConfig2.icon;
      var $table = params.$table,
          column = params.column;
      return [h('span', {
        class: 'vue-xtable-sort-wrapper'
      }, [h('i', {
        class: ['vue-xtable-sort--asc-btn', icon.sortAsc, {
          'sort--active': column.order === 'asc'
        }],
        on: {
          click: function click(evnt) {
            $table.triggerSortEvent(evnt, column, 'asc');
          }
        }
      }), h('i', {
        class: ['vue-xtable-sort--desc-btn', icon.sortDesc, {
          'sort--active': column.order === 'desc'
        }],
        on: {
          click: function click(evnt) {
            $table.triggerSortEvent(evnt, column, 'desc');
          }
        }
      })])];
    },
  
    /**
     * 筛选
     */
    renderFilterHeader: function renderFilterHeader(h, params) {
      return Cell.renderHeader(h, params).concat(Cell.renderFilterIcon(h, params));
    },
    renderFilterIcon: function renderFilterIcon(h, params) {
      var _GlobalConfig3 = GlobalConfig,
          icon = _GlobalConfig3.icon;
      var $table = params.$table,
          column = params.column;
      var filterStore = $table.filterStore;
      return [h('span', {
        class: ['vue-xtable-filter-wrapper', {
          'is--active': filterStore.visible && filterStore.column === column
        }]
      }, [h('i', {
        class: 'vue-xtable-filter--btn '.concat(icon.filter),
        on: {
          click: function click(evnt) {
            $table.triggerFilterEvent(evnt, params.column, params);
          }
        }
      })])];
    },
  
    /**
     * 可编辑
     */
    renderEditHeader: function renderEditHeader(h, params) {
      var _GlobalConfig4 = GlobalConfig,
          icon = _GlobalConfig4.icon;
      var $table = params.$table,
          column = params.column;
      var editRules = $table.editRules,
          editConfig = $table.editConfig;
      var sortable = column.sortable,
          remoteSort = column.remoteSort,
          filters = column.filters;
      var isRequired;
  
      if (editRules) {
        function getIsRequiredByOne(property){
            var columnRules = VueUtil.get(editRules, property);

            if (columnRules) {
              isRequired = columnRules.some(function (rule) {
                return rule.required;
              });
            }
		}
		if(VueUtil.isArray(params.column.property)){
			params.column.property.some(function (item) {
				getIsRequiredByOne(item);
				if(isRequired){ return true; }
			});
		}else{
			getIsRequiredByOne(params.column.property);
		}
      }
  
      return [isRequired ? h('i', {
        class: 'vue-xtable-required-icon'
      }) : null, editConfig && editConfig.showIcon === false ? null : h('i', {
        class: 'vue-xtable-edit-icon '.concat(icon.edit)
      })].concat(Cell.renderHeader(h, params)).concat(sortable || remoteSort ? Cell.renderSortIcon(h, params) : []).concat(filters && filters.length ? Cell.renderFilterIcon(h, params) : []);
    },
    // 行格编辑模式
    renderRowEdit: function renderRowEdit(h, params) {
      var $table = params.$table;
      var actived = $table.editStore.actived;
      var activeMethod = $table.editConfig.activeMethod;
      return Cell.runRenderer(h, params, this, actived && actived.row === params.row && (!activeMethod || activeMethod(params)));
    },
    renderTreeRowEdit: function renderTreeRowEdit(h, params) {
      return Cell.renderTreeIcon(h, params).concat(Cell.renderRowEdit(h, params));
    },
    // 单元格编辑模式
    renderCellEdit: function renderCellEdit(h, params) {
      var $table = params.$table;
      var actived = $table.editStore.actived;
      return Cell.runRenderer(h, params, this, actived && actived.row === params.row && actived.column === params.column);
    },
    renderTreeCellEdit: function renderTreeCellEdit(h, params) {
      return Cell.renderTreeIcon(h, params).concat(Cell.renderCellEdit(h, params));
    },
    runRenderer: function runRenderer(h, params, _vm, isEdit) {
      var $table = params.$table,
          row = params.row,
          column = params.column;
      var slots = column.slots,
          own = column.own,
          formatter = column.formatter;
      var editRender = own.editRender;
  
      var compConf = baseTable.Renderer.get(editRender.name);
  
      if (editRender.type === 'visible' || isEdit) {
        if (slots && slots.edit) {
          return slots.edit(params, h);
        }
  
        return compConf && compConf.renderEdit ? compConf.renderEdit.call($table, h, editRender, params, {
          $type: 'edit',
          $excel: $table.$parent,
          $table: $table,
          $column: column
        }) : [];
      }
  
      if (slots && slots.default) {
        return slots.default(params, h);
      }
  
      if (formatter) {
        return [tools.UtilTools.formatText(tools.UtilTools.getCellLabel(row, column, params), 1)];
      }
  
      return Cell.renderCell.call(_vm, h, params);
    }
  };

  return Cell;
});