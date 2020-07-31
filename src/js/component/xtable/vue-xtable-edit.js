(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    context.VueXtableEditMixin = definition(context.tools, context.baseTable);
  }
})(this, function(tools, baseTable) {
  var VueXtableEditMixin = {
    data: function() {
      return {
        currentActiveRowOldValue: null,
      };
    },
    methods: {
      /**
       * 往表格中插入临时数据
       *
       * @param {*} records
       */
      _insert: function _insert(records) {
        return this.insertAt(records);
      },

      /**
       * 往表格指定行中插入临时数据
       * 如果 row 为空则从插入到顶部
       * 如果 row 为 -1 则从插入到底部
       * 如果 row 为有效行则插入到该行的位置
       * @param {Object/Array} records 新的数据
       * @param {Row} row 指定行
       */
      _insertAt: function _insertAt(records, row) {
        var _this = this;

        var afterFullData = this.afterFullData,
            editStore = this.editStore,
            scrollYLoad = this.scrollYLoad,
            tableFullData = this.tableFullData,
            treeConfig = this.treeConfig;

        if (treeConfig) {
          throw new Error(tools.UtilTools.getLog('vue.xtable.error.noTree', ['insert']));
        }

        if (!VueUtil.isArray(records)) {
          records = [records];
        }

        var nowData = afterFullData;
        var newRecords = records.map(function (record) {
          return _this.defineField(VueUtil.assign({}, record));
        });

        if (!row) {
          nowData.unshift.apply(nowData, newRecords);
          tableFullData.unshift.apply(tableFullData, newRecords);
        } else {
          if (row === -1) {
            nowData.push.apply(nowData, newRecords);
            tableFullData.push.apply(tableFullData, newRecords);
          } else {
            var targetIndex = nowData.indexOf(row);

            if (targetIndex === -1) {
              throw new Error(tools.UtilTools.error('vue.xtable.error.unableInsert'));
            }

            nowData.splice.apply(nowData, [targetIndex, 0].concat(newRecords));
            tableFullData.splice.apply(tableFullData, [tableFullData.indexOf(row), 0].concat(newRecords));
          }
        }

        [].unshift.apply(editStore.insertList, newRecords);
        this.handleTableData();
        this.updateCache();
        this.checkSelectionStatus();

        if (scrollYLoad) {
          this.updateScrollYSpace();
        }

        return this.$nextTick().then(function () {
          _this.recalculate();

          return {
            row: newRecords.length ? newRecords[newRecords.length - 1] : null,
            rows: newRecords
          };
        });
      },

      /**
       * 删除指定行数据
       * 如果传 row 则删除一行
       * 如果传 rows 则删除多行
       * 如果为空则删除所有
       */
      _remove: function _remove(rows) {
        var _this2 = this;

        var afterFullData = this.afterFullData,
            tableFullData = this.tableFullData,
            editStore = this.editStore,
            treeConfig = this.treeConfig,
            selection = this.selection,
            isInsertByRow = this.isInsertByRow,
            scrollYLoad = this.scrollYLoad;
        var removeList = editStore.removeList,
            insertList = editStore.insertList; // 在 v3.0 中废弃 selectConfig

        var checkboxConfig = this.checkboxConfig || this.selectConfig || {};
        var property = checkboxConfig.checkField;
        var rest = [];
        var nowData = afterFullData;

        if (treeConfig) {
          throw new Error(tools.UtilTools.getLog('vue.xtable.error.noTree', ['remove']));
        }

        if (!rows) {
          rows = tableFullData;
        } else if (!VueUtil.isArray(rows)) {
          rows = [rows];
        } // 如果是新增，则保存记录


        rows.forEach(function (row) {
          if (!isInsertByRow(row)) {
            removeList.push(row);
          }
        }); // 如果绑定了多选属性，则更新状态

        if (!property) {
          VueUtil.remove(selection, function (row) {
            return rows.indexOf(row) > -1;
          });
        } // 从数据源中移除


        if (tableFullData === rows) {
          rows = tableFullData.slice(0);
          tableFullData.length = 0;
          nowData.length = 0;
        } else {
          rest = VueUtil.remove(tableFullData, function (row) {
            return rows.indexOf(row) > -1;
          });
          VueUtil.remove(nowData, function (row) {
            return rows.indexOf(row) > -1;
          });
        } // 从新增中移除已删除的数据


        VueUtil.remove(insertList, function (row) {
          return rows.indexOf(row) > -1;
        });
        this.handleTableData();
        this.updateCache();
        this.checkSelectionStatus();

        if (scrollYLoad) {
          this.updateScrollYSpace();
        }

        return this.$nextTick().then(function () {
          _this2.recalculate();

          return {
            row: rows && rows.length ? rows[rows.length - 1] : null,
            rows: rest
          };
        });
      },

      _insertRow: function(position, record, callback) {
        var self = this;
        var addPosition;
        //参数position为0第一行插入，-1最后一行
        if (position === 0 || position === -1) {
          addPosition = position;
        //其他数字放回对应的row对象，在该row上面插入
        } else if (position) {
          addPosition = self.afterFullData[position];
        //未定义，并且当前选中行存在，返回选中行的下一行，并在该行上面插入
        } else if (self.highlightCurrentRow && self.getCurrentRow()) {
          addPosition = self.afterFullData[self.afterFullData.indexOf(self.getCurrentRow()) + 1] || -1;
        //其他情况，在最后插入
        } else {
          addPosition = -1;
        }

        record = record || {};

        return self.insertAt(record, addPosition).then(function(added) {
          var newRow = added.row;
          self.setCurrentRow(newRow);
          self.setActiveRow(newRow).then(function() {
            callback && callback(added, self);
          });
        });
      },

      _delRow: function(callback) {
        var self = this;
        if(this.getSelectRecords().length > 0){
            this.removeSelecteds().then(function() {
              callback && callback();
            });
        } else if (this.highlightCurrentRow && this.getCurrentRow()) {
          var index = this.afterFullData.indexOf(this.getCurrentRow());
          this.remove(this.getCurrentRow()).then(function(row) {
            if (index >= self.afterFullData.length) index = self.afterFullData.length -1;
            self.setCurrentRow(self.afterFullData[index]);
            callback && callback(row);
          });
        }
      },

      /**
       * 删除选中数据
       */
      _removeSelecteds: function _removeSelecteds() {
        var _this3 = this;

        return this.remove(this.getSelectRecords()).then(function (params) {
          _this3.clearSelection();

          return params;
        });
      },
      _revert: function _revert() {
        tools.UtilTools.warn('vue.xtable.error.delFunc', ['revert', 'revertData']);

        return this.revertData.apply(this, arguments);
      },

      /**
       * 还原数据
       * 如果不传任何参数，则还原整个表格
       * 如果传 row 则还原一行
       * 如果传 rows 则还原多行
       * 如果还额外传了 field 则还原指定的单元格数据
       */
      _revertData: function _revertData(rows, field) {
        var tableSourceData = this.tableSourceData,
            getRowIndex = this.getRowIndex;

        if (arguments.length) {
          if (rows && !VueUtil.isArray(rows)) {
            rows = [rows];
          }

          rows.forEach(function (row) {
            var rowIndex = getRowIndex(row);
            var oRow = tableSourceData[rowIndex];

            if (oRow && row) {
              if (field) {
                VueUtil.set(row, field, VueUtil.get(oRow, field));
              } else {
                VueUtil.destructuring(row, oRow);
              }
            }
          });
          return this.$nextTick();
        }

        return this.reloadData(tableSourceData);
      },

      /**
       * 获取表格数据集，包含新增、删除、修改
       */
      _getRecordset: function _getRecordset() {
        return {
          insertRecords: this.getInsertRecords(),
          removeRecords: this.getRemoveRecords(),
          updateRecords: this.getUpdateRecords()
        };
      },

      /**
       * 获取新增的临时数据
       */
      _getInsertRecords: function _getInsertRecords() {
        return this.editStore.insertList;
      },

      /**
       * 获取已删除的数据
       */
      _getRemoveRecords: function _getRemoveRecords() {
        return this.editStore.removeList;
      },

      /**
       * 获取更新数据
       * 只精准匹配 row 的更改
       * 如果是树表格，子节点更改状态不会影响父节点的更新状态
       */
      _getUpdateRecords: function _getUpdateRecords() {
        var tableFullData = this.tableFullData,
            isUpdateByRow = this.isUpdateByRow,
            treeConfig = this.treeConfig;

        if (treeConfig) {
          return VueUtil.filterTree(tableFullData, function (row) {
            return isUpdateByRow(row);
          }, treeConfig);
        }

        return tableFullData.filter(function (row) {
          return isUpdateByRow(row);
        });
      },

      isCellEditable: function(params) {
        if (params.column && params.column.editRender) {
          var cell = tools.DomTools.getCell(this, {
            row: params.row,
            column: params.column
          });

          var newParams = {
            row: params.row,
            rowIndex: this.getRowIndex(params.row),
            column: params.column,
            columnIndex: this.getColumnIndex(params.column),
            $table: this
          };

          params.cell = cell;
          var activeMethod = this.editConfig && this.editConfig.activeMethod;

          if (!activeMethod || activeMethod(newParams)) {
            return true;
          }
        }
        return false;
      },
      /**
       * 处理激活编辑
       */
      handleActived: function handleActived(params, evnt, clearColumn) {
        var _this4 = this;

        var editStore = this.editStore,
            editConfig = this.editConfig,
            tableColumn = this.tableColumn;
        var activeMethod = editConfig.activeMethod;
        var actived = editStore.actived;
        var row = params.row,
            column = params.column,
            cell = params.cell;
        var editRender = column.editRender;

        if (editRender && cell) {
          if (actived.row !== row || (editConfig.mode === 'cell' ? actived.column !== column : false)) {
            // 判断是否禁用编辑
            var type = 'edit-disabled';

            if (!activeMethod || activeMethod(params)) {
              if (this.keyboardConfig || this.mouseConfig) {
                this.clearCopyed(evnt);
                this.clearChecked();
                this.clearSelected(evnt);
              }

              this.clostTooltip();
              this.clearActived(evnt);
              type = 'edit-actived';
              column.renderHeight = cell.offsetHeight;
              actived.args = params;
              actived.row = row;
              actived.column = column;

              this.currentActiveRowOldValue = VueUtil.cloneDeep(row);
              if (clearColumn) tools.UtilTools.setCellValue(row, clearColumn, null);
              if (editConfig.mode === 'row') {
                tableColumn.forEach(function (column) {
                  return _this4._getColumnModel(row, column);
                });
              } else {
                this._getColumnModel(row, column);
              }

              this.$nextTick(function () {
                _this4.handleFocus(params, evnt);
              });
            }

            tools.UtilTools.emitEvent(this, type, [params, evnt]);
          } else {
            var oldColumn = actived.column;

            if (oldColumn !== column) {
              var oldModel = oldColumn.model;

              if (oldModel.update) {
                tools.UtilTools.setCellValue(row, oldColumn, oldModel.value);
              }

              this.clearValidate();
            }

            column.renderHeight = cell.offsetHeight;
            actived.args = params;
            actived.column = column;
            setTimeout(function () {
              _this4.handleFocus(params, evnt);
            });
          }
        }
        _this4.isActivated = true;
        return this.$nextTick();
      },
      _getColumnModel: function _getColumnModel(row, column) {
        var model = column.model,
            editRender = column.editRender;

        if (editRender) {
          model.value = tools.UtilTools.getCellValue(row, column);
          model.update = false;
        }
      },
      _setColumnModel: function _setColumnModel(row, column) {
        var model = column.model,
            editRender = column.editRender;

        if (editRender && model.update) {
          tools.UtilTools.setCellValue(row, column, model.value);

          model.update = false;
          model.value = null;
        }
      },

      /**
       * 清除激活的编辑
       */
      _clearActived: function _clearActived(evnt) {
        var _this5 = this;

        var tableColumn = this.tableColumn,
            editStore = this.editStore,
            _this$editConfig = this.editConfig,
            editConfig = _this$editConfig === void 0 ? {} : _this$editConfig;
        var actived = editStore.actived;
        var args = actived.args,
            row = actived.row,
            column = actived.column;

        if (row || column) {
          if (editConfig.mode === 'row') {
            tableColumn.forEach(function (column) {
              return _this5._setColumnModel(row, column);
            });
          } else {
            this._setColumnModel(row, column);
          }

          this.updateFooter();

          tools.UtilTools.emitEvent(this, 'edit-closed', [args, evnt]);
        }

        actived.args = null;
        actived.row = null;
        actived.column = null;
        return (baseTable._valid ? this.clearValidate() : this.$nextTick()).then(this.recalculate);
      },
      _getActiveRow: function _getActiveRow() {
        var $el = this.$el,
            editStore = this.editStore,
            tableData = this.tableData;
        var _editStore$actived = editStore.actived,
            args = _editStore$actived.args,
            row = _editStore$actived.row;

        if (args && tableData.indexOf(row) > -1 && $el.querySelectorAll('.vue-xtable-body--column.col--actived').length) {
          return VueUtil.assign({}, args);
        }

        return null;
      },
      // 在 v3.0 中废弃 hasActiveRow
      _hasActiveRow: function _hasActiveRow(row) {
        tools.UtilTools.warn('vue.xtable.error.delFunc', ['hasActiveRow', 'isActiveByRow']);

        return this.isActiveByRow(row);
      },

      /**
       * 判断行是否为激活编辑状态
       * @param {Row} row 行对象
       */
      _isActiveByRow: function _isActiveByRow(row) {
        return this.editStore.actived.row === row;
      },

      /**
       * 处理聚焦
       */
      handleFocus: function handleFocus(params, evnt) {
        var row = params.row,
            column = params.column,
            cell = params.cell;
        var editRender = column.editRender;

        if (editRender) {
          var compRender = baseTable.Renderer.get(editRender.name);

          var autofocus = editRender.autofocus,
              autoselect = editRender.autoselect;
          var inputElem; // 如果指定了聚焦 class

          if (autofocus) {
            inputElem = cell.querySelector(autofocus);
          } // 渲染器的聚焦处理


          if (!inputElem && compRender && compRender.autofocus) {
            inputElem = cell.querySelector(compRender.autofocus);
          }

          if (inputElem) {
            inputElem[autoselect ? 'select' : 'focus']();

            if (VueUtil.isIE) {
              var textRange = inputElem.createTextRange();
              textRange.collapse(false);
              textRange.select();
            }
          } else {
            // 显示到可视区中
            this.scrollToRow(row, column);
          }
        }
      },

      /**
       * 激活行编辑
       */
      _setActiveRow: function _setActiveRow(row) {
        var column = VueUtil.find(this.visibleColumn, function (column) {
          return column.editRender;
        });
        // 没有可编辑列时, 强制focus第一可见列
        if(!column) {
          column = VueUtil.find(this.visibleColumn, function (column) {
            return column.property;
          });
        }

        return this.setActiveCell(row, column.property);
      },

      /**
       * 激活单元格编辑
       */
      _setActiveCell: function _setActiveCell(row, field) {
        var _this6 = this;

        return this.scrollToRow(row, true).then(function () {
          if (row && field) {
            var column = VueUtil.find(_this6.visibleColumn, function (column) {
              return column.property === field;
            });

            if (column && column.editRender) {
              var cell = tools.DomTools.getCell(_this6, {
                row: row,
                column: column
              });

              if (cell) {
                _this6.handleActived({
                  row: row,
                  rowIndex: _this6.getRowIndex(row),
                  column: column,
                  columnIndex: _this6.getColumnIndex(column),
                  $columnIndex: _this6.tableColumn.indexOf(column),
                  cell: cell,
                  $table: _this6
                });

                _this6.lastCallTime = Date.now();
              }
            }
          }

          return _this6.$nextTick();
        });
      },

      /**
       * 只对 trigger=dblclick 有效，选中单元格
       */
      _setSelectCell: function _setSelectCell(row, field) {
        var tableData = this.tableData,
            editConfig = this.editConfig,
            visibleColumn = this.visibleColumn;

        if (!VueUtil.isDef(field)) field = 0;
        if (row && (!editConfig || editConfig.trigger === 'dblclick')) {
          var column;
          if(typeof field === 'number') {
            column = visibleColumn[field];
          } else {
            column = VueUtil.find(visibleColumn, function (column) {
              return column.property === field;
            });
          }
          var rowIndex = tableData.indexOf(row);

          if (rowIndex > -1 && column) {
            var cell = tools.DomTools.getCell(this, {
              row: row,
              rowIndex: rowIndex,
              column: column
            });

            var params = {
              row: row,
              rowIndex: rowIndex,
              column: column,
              columnIndex: visibleColumn.indexOf(column),
              cell: cell
            };

            this.setCurrentRow(row, column);
            this.isActivated = true;
            this.handleSelected(params, {});
          }
        }

        return this.$nextTick();
      },

      /**
       * 处理选中源
       */
      handleSelected: function handleSelected(params, evnt) {
        var _this7 = this;

        var _this$mouseConfig = this.mouseConfig,
            mouseConfig = _this$mouseConfig === void 0 ? {} : _this$mouseConfig,
            editConfig = this.editConfig,
            editStore = this.editStore,
            elemStore = this.elemStore;
        var actived = editStore.actived,
            selected = editStore.selected;
        var row = params.row,
            column = params.column,
            cell = params.cell;

        var selectMethod = function selectMethod() {
          if ((mouseConfig.selected || mouseConfig.checked) && (selected.row !== row || selected.column !== column)) {
            if (actived.row !== row || (editConfig.mode === 'cell' ? actived.column !== column : false)) {
              if (_this7.keyboardConfig) {
                _this7.clearChecked(evnt);

                _this7.clearIndexChecked();

                _this7.clearHeaderChecked();

                _this7.clearSelected(evnt);
              }

              _this7.clearActived(evnt);

              selected.args = params;
              selected.row = row;
              selected.column = column;

              if (mouseConfig.selected) {
                _this7.addColSdCls();
              } // 如果配置了批量选中功能，则为批量选中状态


              if (mouseConfig.checked) {
                var headerElem = elemStore['main-header-list'];

                _this7.handleChecked([[cell]]);

                if (headerElem) {
                  _this7.handleHeaderChecked([[headerElem.querySelector('.'.concat(column.id))]]);
                }

                _this7.handleIndexChecked([[cell.parentNode.querySelector('.col--index')]]);
              }
            }
          }

          return _this7.$nextTick();
        };

        return selectMethod();
      },

      /**
       * 清除所选中源状态
       */
      _clearSelected: function _clearSelected(evnt) {
        var selected = this.editStore.selected;
        selected.row = null;
        selected.column = null;
        this.reColTitleSdCls();
        this.reColSdCls();
        return this.$nextTick();
      },
      reColTitleSdCls: function reColTitleSdCls() {
        var headerElem = this.elemStore['main-header-list'];

        if (headerElem) {
          VueUtil.loop(headerElem.querySelectorAll('.col--title-selected'), function (elem) {
            return tools.DomTools.removeClass(elem, 'col--title-selected');
          });
        }
      },
      reColSdCls: function reColSdCls() {
        var cell = this.$el.querySelector('.col--selected');

        if (cell) {
          tools.DomTools.removeClass(cell, 'col--selected');
        }
      },
      addColSdCls: function addColSdCls() {
        var selected = this.editStore.selected;
        var row = selected.row,
            column = selected.column;
        this.reColSdCls();

        if (row && column) {
          var cell = tools.DomTools.getCell(this, {
            row: row,
            column: column
          });

          if (cell) {
            tools.DomTools.addClass(cell, 'col--selected');
          }
        }
      }
    }
  };

  return VueXtableEditMixin;
});