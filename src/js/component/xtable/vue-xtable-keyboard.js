(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    context.VueXtableKeyboardMixin = definition(context.tools);
  }
})(this, function(tools) {
  var VueXtableKeyboardMixin = {
    methods: {
      // 处理 Tab 键移动
      moveTabSelected: function moveTabSelected(args, isLeft, evnt) {
        var _this = this;
  
        var afterFullData = this.afterFullData,
            visibleColumn = this.visibleColumn,
            editConfig = this.editConfig,
            hasIndexColumn = this.hasIndexColumn;
        var targetRow;
        var targetRowIndex;
        var targetColumn;
        var targetColumnIndex;
        var params = VueUtil.assign({}, args);
        var rowIndex = afterFullData.indexOf(params.row);
        var columnIndex = visibleColumn.indexOf(params.column);
        evnt.preventDefault();

        if (params.column.editRender && params.column.editRender.name && params.column.editRender.name.indexOf('checkbox') > -1) {

          var allChecks = params.cell.querySelectorAll('input[type=checkbox]:not(:disabled)');
          var focusCheck = params.cell.querySelector('input[type=checkbox]:focus');

          var index = [].indexOf.call(allChecks, focusCheck);

          if (!evnt.shiftKey && index > -1 && index < allChecks.length -1) {
            allChecks[index + 1].focus();
            return;
          }

          if (evnt.shiftKey && index > 0) {
            allChecks[index - 1].focus();
            return;
          }
        }
  
        if (isLeft) {
          // 向左
          for (var len = columnIndex - 1; len >= 0; len--) {
            if (!hasIndexColumn(visibleColumn[len])) {
              if (visibleColumn[len].editRender) {
                targetColumnIndex = len;
                targetColumn = visibleColumn[len];
                break;
              }
            }
          }
  
          if (!targetColumn && rowIndex > 0) {
            // 如果找不到从上一行开始找，如果一行都找不到就不需要继续找了，可能不存在可编辑的列
            targetRowIndex = rowIndex - 1;
            targetRow = afterFullData[targetRowIndex];
  
            for (var _len = visibleColumn.length - 1; _len >= 0; _len--) {
              if (!hasIndexColumn(visibleColumn[_len])) {
                targetColumnIndex = _len;
                targetColumn = visibleColumn[_len];
                break;
              }
            }
          }
        } else {
          // 向右
          for (var index = columnIndex + 1; index < visibleColumn.length; index++) {
            if (!hasIndexColumn(visibleColumn[index])) {
              if (visibleColumn[index].editRender) {
                targetColumnIndex = index;
                targetColumn = visibleColumn[index];
                break;
              }
            }
          }
  
          if (!targetColumn && rowIndex < afterFullData.length - 1) {
            // 如果找不到从下一行开始找，如果一行都找不到就不需要继续找了，可能不存在可编辑的列
            targetRowIndex = rowIndex + 1;
            targetRow = afterFullData[targetRowIndex];
  
            for (var _index = 0; _index < visibleColumn.length; _index++) {
              if (!hasIndexColumn(visibleColumn[_index])) {
                targetColumnIndex = _index;
                targetColumn = visibleColumn[_index];
                break;
              }
            }
          }
        }
  
        if (targetColumn) {
          if (targetRow) {
            params.rowIndex = targetRowIndex;
            params.row = targetRow;
          } else {
            params.rowIndex = rowIndex;
          }
  
          params.columnIndex = targetColumnIndex;
          params.column = targetColumn;

          params.$columnIndex = this.tableColumn.indexOf(targetColumn);
          targetRow && (params.$rowIndex = targetRow.$rowIndex);

          params.cell = tools.DomTools.getCell(this, params);
  
          if (editConfig) {
            if (editConfig.trigger === 'click' || editConfig.trigger === 'dblclick') {
              if (editConfig.mode === 'row') {
                this.handleActived(params, evnt);
              } else {
                this.scrollToRow(params.row, params.column).then(function () {
                  return _this.handleSelected(params, evnt);
                });
              }
            }
          }
        }
      },
      // 处理当前行方向键移动
      moveCurrentRow: function moveCurrentRow(isUpArrow, isDwArrow, evnt) {
        var _this2 = this;
  
        var currentRow = this.currentRow,
            treeConfig = this.treeConfig,
            afterFullData = this.afterFullData;
        var targetRow;
        evnt.preventDefault();
  
        if (treeConfig) {
          var findTreeData = VueUtil.findTree(afterFullData, function (item) {
            return item === currentRow;
          }, treeConfig),
              index = findTreeData.index,
              items = findTreeData.items;
  
          if (isUpArrow && index > 0) {
            targetRow = items[index - 1];
          } else if (isDwArrow && index < items.length - 1) {
            targetRow = items[index + 1];
          }
        } else {
          var rowIndex = afterFullData.indexOf(currentRow);
  
          if (isUpArrow && rowIndex > 0) {
            targetRow = afterFullData[rowIndex - 1];
          } else if (isDwArrow && rowIndex < afterFullData.length - 1) {
            targetRow = afterFullData[rowIndex + 1];
          }
        }
  
        if (targetRow) {
          var params = {
            $table: this,
            row: targetRow
          };
          this.scrollToRow(targetRow).then(function () {
            return _this2.triggerCurrentRowEvent(evnt, params);
          });
        }
      },
      // 处理可编辑方向键移动
      moveSelected: function moveSelected(args, isLeftArrow, isUpArrow, isRightArrow, isDwArrow, evnt) {
        var _this3 = this;
        var params = VueUtil.assign({}, args);

        function _getRowIndex (row) {
          return _this3.afterFullData.indexOf(row);
        }

        var _rowIndex = _getRowIndex(params.row);

        params.rowIndex = _rowIndex;
        var offsetRow = params.offset && params.offset[0];
        var offsetCol = params.offset && params.offset[1];

        var afterFullData = this.afterFullData,
            visibleColumn = this.tableColumn,
            hasIndexColumn = this.hasIndexColumn;
        
        var visibleIndex = this.getVisibleIndexFromColumnIndex(params.columnIndex);
        evnt.preventDefault();
  
        if (isUpArrow && params.rowIndex) {
          params.rowIndex -= 1;
          params.row = afterFullData[params.rowIndex];
          params.$rowIndex = params.row.$rowIndex;
        } else if (isDwArrow && params.rowIndex < afterFullData.length - 1) {
          params.rowIndex += params.cell.rowSpan;
          params.row = afterFullData[params.rowIndex];
          params.$rowIndex = params.row.$rowIndex;
        } else if (isLeftArrow && visibleIndex) {
          for (var len = visibleIndex - 1; len >= 0; len--) {
            if (!hasIndexColumn(visibleColumn[len])) {
              params.columnIndex = this.getColumnIndexFromVisibleIndex(len);
              params.column = visibleColumn[len];
              params.$columnIndex = visibleColumn.indexOf(params.column);
              break;
            }
          }
        } else if (isRightArrow) {
          for (var index = visibleIndex + params.cell.colSpan; index < visibleColumn.length; index++) {
            if (!hasIndexColumn(visibleColumn[index])) {
              params.columnIndex = this.getColumnIndexFromVisibleIndex(index);
              params.column = visibleColumn[index];
              params.$columnIndex = visibleColumn.indexOf(params.column);
              break;
            }
          }
        }

        if(offsetRow && (isLeftArrow || isRightArrow)) {
          params.rowIndex = _this3.getRowIndex(offsetRow);
          params.row = offsetRow;
          params.$rowIndex = params.row.$rowIndex;
        }
        if(offsetCol && (isUpArrow || isDwArrow)) {
          params.columnIndex = _this3.getColumnIndex(offsetCol);
          params.column = offsetCol;
          params.$columnIndex = visibleColumn.indexOf(offsetCol);
        }
  
        this.scrollToRow(params.row, params.column).then(function () {
          params.cell = tools.DomTools.getCell(_this3, params);
  
          _this3.handleSelected(params, evnt);
        });
      },
  
      /**
       * 表头按下事件
       */
      triggerHeaderCellMousedownEvent: function triggerHeaderCellMousedownEvent(evnt, params) {
        var $el = this.$el,
            tableData = this.tableData,
            _this$mouseConfig = this.mouseConfig,
            mouseConfig = _this$mouseConfig === void 0 ? {} : _this$mouseConfig,
            elemStore = this.elemStore,
            handleChecked = this.handleChecked,
            handleHeaderChecked = this.handleHeaderChecked;
        var button = evnt.button;
        var column = params.column,
            cell = params.cell;
        var isLeftBtn = button === 0;
        var isIndex = column.type === 'index';
  
        if (isLeftBtn && mouseConfig.checked) {
          var headerList = elemStore['main-header-list'].children;
          var bodyList = elemStore['main-body-list'].children;
  
          if (isIndex) {
            this.handleAllChecked(evnt);
          } else {
            evnt.preventDefault();
            evnt.stopPropagation();
            this.clearSelected(evnt);
            this.clearHeaderChecked();
            this.clearIndexChecked();
            var domMousemove = document.onmousemove;
            var domMouseup = document.onmouseup;
            var startCell = bodyList[0].querySelector('.'.concat(column.id));
            var updateEvent = VueUtil._throttle(function (evnt) {
              evnt.preventDefault();
  
              var _DomTools$getEventTar = tools.DomTools.getEventTargetNode(evnt, $el, 'vue-xtable-header--column'),
                  flag = _DomTools$getEventTar.flag,
                  targetElem = _DomTools$getEventTar.targetElem;
  
              if (!flag) {
                var a = tools.DomTools.getEventTargetNode(evnt, $el, 'vue-xtable-body--column');
  
                flag = a.flag;
                targetElem = a.targetElem;
              }
  
              if (flag && !tools.DomTools.hasClass(targetElem, 'col--index')) {
                var colIndex = [].indexOf.call(targetElem.parentNode.children, targetElem);
                var endCell = bodyList[bodyList.length - 1].children[colIndex];
                var head = headerList[0].children[colIndex];
                handleHeaderChecked(tools.DomTools.getRowNodes(headerList, tools.DomTools.getCellNodeIndex(head), tools.DomTools.getCellNodeIndex(cell)));
                handleChecked(tools.DomTools.getRowNodes(bodyList, tools.DomTools.getCellNodeIndex(startCell), tools.DomTools.getCellNodeIndex(endCell)));
              }
            }, 80, {
              leading: true,
              trailing: true
            });
  
            tools.DomTools.addClass($el, 'c--checked');
  
            document.onmousemove = updateEvent;
  
            document.onmouseup = function () {
              tools.DomTools.removeClass($el, 'c--checked');
  
              document.onmousemove = domMousemove;
              document.onmouseup = domMouseup;
            };
  
            handleHeaderChecked([[cell]]);
  
            if (bodyList.length) {
              var endCell = bodyList[bodyList.length - 1].querySelector('.'.concat(column.id));
              var firstTrElem = bodyList[0];
              var lastTrElem = bodyList[bodyList.length - 1];
              var firstCell = firstTrElem.querySelector('.col--index');
              params.rowIndex = 0;
              params.row = tableData[0];
              params.cell = tools.DomTools.getCell(this, params);
              this.handleSelected(params, evnt);
              this.handleIndexChecked(tools.DomTools.getRowNodes(bodyList, tools.DomTools.getCellNodeIndex(firstCell), tools.DomTools.getCellNodeIndex(lastTrElem.querySelector('.col--index'))));
              this.handleChecked(tools.DomTools.getRowNodes(bodyList, tools.DomTools.getCellNodeIndex(startCell), tools.DomTools.getCellNodeIndex(endCell)));
            }
          }
  
          this.closeMenu();
        }
  
        this.isActivated = true;
      },
  
      /**
       * 单元格按下事件
       */
      triggerCellMousedownEvent: function triggerCellMousedownEvent(evnt, params) {
        var $el = this.$el,
            visibleColumn = this.visibleColumn,
            highlightCurrentRow = this.highlightCurrentRow,
            _this$radioConfig3 = this.radioConfig,
            radioConfig = _this$radioConfig3 === void 0 ? {} : _this$radioConfig3,
            editStore = this.editStore,
            editConfig = this.editConfig,
            handleSelected = this.handleSelected,
            _this$mouseConfig2 = this.mouseConfig,
            mouseConfig = _this$mouseConfig2 === void 0 ? {} : _this$mouseConfig2,
            handleChecked = this.handleChecked,
            handleIndexChecked = this.handleIndexChecked,
            handleHeaderChecked = this.handleHeaderChecked,
            elemStore = this.elemStore;
        var checked = editStore.checked,
            actived = editStore.actived;
        var row = params.row,
            column = params.column,
            cell = params.cell;
        var button = evnt.button;
        var isLeftBtn = button === 0;
  
        if ((!column.treeNode || !this.getEventTargetNode(evnt, $el, 'vue-xtable-tree-wrapper').flag) && (column.type !== 'expand' || !this.getEventTargetNode(evnt, $el, 'vue-xtable-table--expanded').flag)) {
          // 如果是高亮行
          if (highlightCurrentRow) {
            if (radioConfig.trigger === 'row' || !this.getEventTargetNode(evnt, $el, 'vue-xtable-checkbox').flag && !this.getEventTargetNode(evnt, $el, 'vue-xtable-radio').flag) {
              this.triggerCurrentRowEvent(evnt, params);
            }
          }
        }
        if (editConfig) {
          if (actived.row !== row || !(editConfig.mode === 'cell' && actived.column === column)) {
            if (isLeftBtn && mouseConfig.checked) {
              evnt.preventDefault();
              evnt.stopPropagation();
              this.clearHeaderChecked();
              this.clearIndexChecked();
              var domMousemove = document.onmousemove;
              var domMouseup = document.onmouseup;
  
              var startCellNode = tools.DomTools.getCellNodeIndex(cell);
  
              var isIndex = column.type === 'index';
              var bodyList = elemStore['main-body-list'].children;
              var headerList = elemStore['main-header-list'].children;
              var cellLastElementChild = cell.parentNode.lastElementChild;
              var cellFirstElementChild = cell.parentNode.firstElementChild;
              var colIndex = [].indexOf.call(cell.parentNode.children, cell);
              var headStart = headerList[0].children[colIndex];
              var updateEvent = VueUtil._throttle(function (evnt) {
                evnt.preventDefault();
  
                var _DomTools$getEventTar2 = tools.DomTools.getEventTargetNode(evnt, $el, 'vue-xtable-body--column'),
                    flag = _DomTools$getEventTar2.flag,
                    targetElem = _DomTools$getEventTar2.targetElem;
  
                if (flag) {
                  var indexCells = Array.prototype.filter.call(targetElem.parentNode.children, function(cell) {
                    return VueUtil.hasClass(cell, 'col--index');
                  });
                  
                  var firstCell = indexCells.length ? indexCells[0] : targetElem.parentNode.firstElementChild;
                  
                  if (isIndex) {
                    handleChecked(tools.DomTools.getRowNodes(bodyList, tools.DomTools.getCellNodeIndex(firstCell.nextElementSibling), tools.DomTools.getCellNodeIndex(cellLastElementChild)));
                    handleIndexChecked(tools.DomTools.getRowNodes(bodyList, tools.DomTools.getCellNodeIndex(firstCell), tools.DomTools.getCellNodeIndex(cell)));
                  } else if (!tools.DomTools.hasClass(targetElem, 'col--index')) {
  
                    var _colIndex = [].indexOf.call(targetElem.parentNode.children, targetElem);
  
                    if(headerList.length == 1) {
                      var head = headerList[0].children[_colIndex];
                      handleHeaderChecked(tools.DomTools.getRowNodes(headerList, tools.DomTools.getCellNodeIndex(head), tools.DomTools.getCellNodeIndex(headStart)));
                    } else if(headerList.length > 1) {
                      
                      var startRect = cell.getBoundingClientRect();
                      var targetRect = targetElem.getBoundingClientRect();
                      var offs = 5;
                      var left = Math.min(startRect.left, targetRect.left) - offs;
                      var right = Math.max(startRect.right, targetRect.right) + offs;
                      var rows = [];

                      VueUtil.loop(headerList, function(header) {
                        var row = Array.prototype.filter.call(header.children, function(td) {
                          var tdRect = td.getBoundingClientRect();
                          return tdRect.left > left && tdRect.right < right;
                        });
                        rows.push(row);
                      });

                      handleHeaderChecked(rows);
                    }
                    handleIndexChecked(tools.DomTools.getRowNodes(bodyList, tools.DomTools.getCellNodeIndex(firstCell), tools.DomTools.getCellNodeIndex(cellFirstElementChild)));
                    handleChecked(tools.DomTools.getRowNodes(bodyList, startCellNode, tools.DomTools.getCellNodeIndex(targetElem)));
                  }
                }
              }, 80, {
                leading: true,
                trailing: true
              });
              document.onmousemove = updateEvent;
  
              document.onmouseup = function (evnt) {
                document.onmousemove = domMousemove;
                document.onmouseup = domMouseup;
              };
  
              if (isIndex) {
                var firstCell = cell.parentNode.firstElementChild;
                params.columnIndex++;
                params.column = visibleColumn[params.columnIndex];
                params.cell = cell.nextElementSibling;
                handleSelected(params, evnt);
                handleChecked(tools.DomTools.getRowNodes(bodyList, tools.DomTools.getCellNodeIndex(firstCell.nextElementSibling), tools.DomTools.getCellNodeIndex(cellLastElementChild)));
                handleHeaderChecked([headerList[0].querySelectorAll('.vue-xtable-header--column:not(.col--index):not(.col--drag)')]);
                handleIndexChecked(tools.DomTools.getRowNodes(bodyList, tools.DomTools.getCellNodeIndex(firstCell), tools.DomTools.getCellNodeIndex(cell)));
              } else {
                
                var indexCells = Array.prototype.filter.call(cell.parentNode.children, function(cell) {
                  return VueUtil.hasClass(cell, 'col--index');
                });
                
                var _firstCell2 = indexCells.length ? indexCells[0] : cell.parentNode.firstElementChild;
                
                handleSelected(params, evnt);
                handleHeaderChecked([[headerList[0].querySelector('.'.concat(column.id))]]);
                handleIndexChecked([[_firstCell2]]);
              }
  
              this.closeFilter();
              this.closeMenu();
            } else if (mouseConfig.selected) {
              // 除了双击其他都没有选中状态
              if (editConfig.trigger === 'dblclick') {
                // 如果不在所有选中的范围之内则重新选中
                if (!checked.rowNodes || !checked.rowNodes.some(function (list) {
                  return VueUtil.includes(list, cell);
                })) {
                  handleSelected(params, evnt);
                }
              }
            }
          }
        } else if (mouseConfig.selected) {
          handleSelected(params, evnt);
        }
  
        this.isActivated = true;
      },
  
      /**
       * 边角事件
       */
      // triggerCornerMousedownEvent (params, evnt) {
      //   evnt.preventDefault()
      //   evnt.stopPropagation()
      //   let { $el, tableData, visibleColumn, editStore, editConfig, handleTempChecked } = this
      //   let { checked } = editStore
      //   let { button } = evnt
      //   let isLeftBtn = button === 0
      //   let isRightBtn = button === 2
      //   if (isLeftBtn || isRightBtn) {
      //     if (editConfig && checked.rows.length && editConfig.trigger === 'dblclick') {
      //       let domMousemove = document.onmousemove
      //       let domMouseup = document.onmouseup
      //       let start = {
      //         rowIndex: tableData.indexOf(checked.rows[0]),
      //         columnIndex: visibleColumn.indexOf(checked.columns[0])
      //       }
      //       let updateEvent = VueUtil._throttle(function (evnt) {
      //         evnt.preventDefault()
      //         let { flag, targetElem } = DomTools.getEventTargetNode(evnt, $el, 'vue-xtable-body--column')
      //         if (flag) {
      //           handleTempChecked(start, DomTools.getCellIndexs(targetElem), evnt)
      //         }
      //       }, VueUtil.isIE ? 80 : 40, { leading: true, trailing: true })
      //       document.onmousemove = updateEvent
      //       document.onmouseup = function (evnt) {
      //         document.onmousemove = domMousemove
      //         document.onmouseup = domMouseup
      //         checked.rows = checked.tRows
      //         checked.columns = checked.tColumns
      //       }
      //     }
      //   }
      // },
  
      /**
       * 清除所有选中状态
       */
      _clearChecked: function _clearChecked(evnt) {
        var $refs = this.$refs,
            editStore = this.editStore,
            mouseConfig = this.mouseConfig;
        var checked = editStore.checked;
  
        if (mouseConfig && mouseConfig.checked) {
          var tableBody = $refs.tableBody;
          checked.rows = [];
          checked.columns = [];
          checked.tRows = [];
          checked.tColumns = [];
          var checkBorders = tableBody.$refs.checkBorders;
          checkBorders.style.display = 'none';
          VueUtil.loop(this.$el.querySelectorAll('.col--checked'), function (elem) {
            return tools.DomTools.removeClass(elem, 'col--checked');
          });
        }
  
        return this.$nextTick();
      },
      _getMouseSelecteds: function _getMouseSelecteds() {
        var _this$editStore$selec = this.editStore.selected,
            args = _this$editStore$selec.args,
            column = _this$editStore$selec.column;
  
        if (args && column) {
          return VueUtil.assign({}, args);
        }
  
        return null;
      },
      _getMouseCheckeds: function _getMouseCheckeds() {
        var _this4 = this;
  
        var checked = this.editStore.checked;
        var _checked$rowNodes = checked.rowNodes,
            rowNodes = _checked$rowNodes === void 0 ? [] : _checked$rowNodes;
        var columns = [];
        var rows = [];
  
        if (rowNodes && rowNodes.length) {
          rows = rowNodes.map(function (list) {
            return _this4.getRowNode(list[0].parentNode).item;
          });
          columns = rowNodes[0].map(function (cell) {
            return _this4.getColumnNode(cell).item;
          });
        }
  
        return {
          columns: columns,
          rows: rows,
          rowNodes: rowNodes
        };
      },
  
      /**
       * 处理所有选中
       */
      handleChecked: function handleChecked(rowNodes) {
        var checked = this.editStore.checked;
        this.clearChecked();
        var cWidth = -2;
        var cHeight = -2;
        var offsetTop = 0;
        var offsetLeft = 0;
        VueUtil.loop(rowNodes, function (rows, rowIndex) {
          var isTop = rowIndex === 0;
          VueUtil.loop(rows, function (elem, colIndex) {
            var isLeft = colIndex === 0;
  
            if (isLeft && isTop) {
              offsetTop = elem.offsetTop;
              offsetLeft = elem.offsetLeft;
            }
  
            if (isTop) {
              cWidth += elem.offsetWidth;
            }
  
            if (isLeft) {
              cHeight += elem.offsetHeight;
            }
  
            tools.DomTools.addClass(elem, 'col--checked');
          });
        });
        var _this$$refs$tableBody = this.$refs.tableBody.$refs,
            checkBorders = _this$$refs$tableBody.checkBorders,
            checkTop = _this$$refs$tableBody.checkTop,
            checkRight = _this$$refs$tableBody.checkRight,
            checkBottom = _this$$refs$tableBody.checkBottom,
            checkLeft = _this$$refs$tableBody.checkLeft;
        checkBorders.style.display = 'block';
        VueUtil.assign(checkTop.style, {
          top: ''.concat(offsetTop, 'px'),
          left: ''.concat(offsetLeft, 'px'),
          width: ''.concat(cWidth, 'px')
        });
        VueUtil.assign(checkRight.style, {
          top: ''.concat(offsetTop, 'px'),
          left: ''.concat(offsetLeft + cWidth, 'px'),
          height: ''.concat(cHeight, 'px')
        });
        VueUtil.assign(checkBottom.style, {
          top: ''.concat(offsetTop + cHeight, 'px'),
          left: ''.concat(offsetLeft, 'px'),
          width: ''.concat(cWidth, 'px')
        });
        VueUtil.assign(checkLeft.style, {
          top: ''.concat(offsetTop, 'px'),
          left: ''.concat(offsetLeft, 'px'),
          height: ''.concat(cHeight, 'px')
        });
        checked.rowNodes = rowNodes;
      },
      handleAllChecked: function handleAllChecked(evnt) {
        var tableData = this.tableData,
            visibleColumn = this.visibleColumn,
            _this$mouseConfig3 = this.mouseConfig,
            mouseConfig = _this$mouseConfig3 === void 0 ? {} : _this$mouseConfig3,
            elemStore = this.elemStore;
  
        if (mouseConfig.checked) {
          evnt.preventDefault();
          var headerListElem = elemStore['main-header-list'];
          var headerList = headerListElem.children;
          var bodyList = elemStore['main-body-list'].children;
          var column = VueUtil.find(visibleColumn, function (column) {
            return column.type === 'index';
          }) || visibleColumn[0];
          var cell = headerListElem.querySelector('.'.concat(column.id));
          var firstTrElem = bodyList[0];
          var lastTrElem = bodyList[bodyList.length - 1];
          var firstCell = firstTrElem.querySelector('.'.concat(column.id));
          var params = {
            $table: this,
            rowIndex: 0,
            row: tableData[0],
            column: VueUtil.find(visibleColumn, function (column) {
              return column.property;
            })
          };
          params.columnIndex = this.getColumnIndex(params.column);
          params.cell = tools.DomTools.getCell(this, params);
          this.handleSelected(params, evnt);
          this.handleHeaderChecked(tools.DomTools.getRowNodes(headerList, tools.DomTools.getCellNodeIndex(cell.nextElementSibling), tools.DomTools.getCellNodeIndex(cell.parentNode.lastElementChild)));
          this.handleIndexChecked(tools.DomTools.getRowNodes(bodyList, tools.DomTools.getCellNodeIndex(firstCell), tools.DomTools.getCellNodeIndex(lastTrElem.querySelector('.'.concat(column.id)))));
          this.handleChecked(tools.DomTools.getRowNodes(bodyList, tools.DomTools.getCellNodeIndex(firstCell.nextElementSibling), tools.DomTools.getCellNodeIndex(lastTrElem.lastElementChild)));
        }
      },
      handleIndexChecked: function handleIndexChecked(rowNodes) {
        var indexs = this.editStore.indexs;
        this.clearIndexChecked();
        VueUtil.loop(rowNodes, function (rows) {
          VueUtil.loop(rows, function (elem) {
            tools.DomTools.addClass(elem, 'col--index-checked');
          });
        });
        indexs.rowNodes = rowNodes;
      },
      _clearIndexChecked: function _clearIndexChecked() {
        var elemStore = this.elemStore;
        var bodyElem = elemStore['main-body-list'];
        VueUtil.loop(bodyElem.querySelectorAll('.col--index-checked'), function (elem) {
          return tools.DomTools.removeClass(elem, 'col--index-checked');
        });
        return this.$nextTick();
      },
      handleHeaderChecked: function handleHeaderChecked(rowNodes) {
        var titles = this.editStore.titles;
        this.clearHeaderChecked();
        VueUtil.loop(rowNodes, function (rows) {
          VueUtil.loop(rows, function (elem) {
            tools.DomTools.addClass(elem, 'col--title-checked');
          });
        });
        titles.rowNodes = rowNodes;
      },
      _clearHeaderChecked: function _clearHeaderChecked() {
        var elemStore = this.elemStore;
        var headerElem = elemStore['main-header-list'];
  
        if (headerElem) {
          VueUtil.loop(headerElem.querySelectorAll('.col--title-checked'), function (elem) {
            return tools.DomTools.removeClass(elem, 'col--title-checked');
          });
        }
  
        return this.$nextTick();
      },
  
      /**
       * 处理所有选中的临时选中
       */
      // handleTempChecked (start, end, evnt) {
      //   let { tableData, visibleColumn, editStore } = this
      //   let { checked } = editStore
      //   let { rows, tRows, columns, tColumns } = checked
      //   let { rowIndex: sRowIndex, columnIndex: sColumnIndex } = start
      //   let { rowIndex: eRowIndex, columnIndex: eColumnIndex } = end
      //   if (tRows.length > rows.length) {
      //     eColumnIndex = visibleColumn.indexOf(columns[columns.length - 1])
      //   } else if (tColumns.length > columns.length) {
      //     eRowIndex = tableData.indexOf(rows[rows.length - 1])
      //   }
      //   if (sRowIndex < eRowIndex) {
      //     // 向下
      //     checked.tRows = tableData.slice(sRowIndex, eRowIndex + 1)
      //   } else {
      //     // 向上
      //     sRowIndex += rows.length
      //     checked.tRows = tableData.slice(eRowIndex, sRowIndex)
      //   }
      //   if (sColumnIndex < eColumnIndex) {
      //     // 向右
      //     checked.tColumns = visibleColumn.slice(Math.max(sColumnIndex, 1), eColumnIndex + 1)
      //   } else {
      //     // 向左
      //     sColumnIndex += columns.length
      //     checked.tColumns = visibleColumn.slice(Math.max(eColumnIndex, 1), sColumnIndex)
      //   }
      // },
  
      /**
       * 清空已复制的内容
       */
      _clearCopyed: function _clearCopyed() {
        var $refs = this.$refs,
            editStore = this.editStore,
            keyboardConfig = this.keyboardConfig;
        var copyed = editStore.copyed;
  
        if (keyboardConfig && keyboardConfig.isCut) {
          var tableBody = $refs.tableBody;
          var copyBorders = $refs.tableBody.$refs.copyBorders;
          copyed.cut = false;
          copyed.rows = [];
          copyed.columns = [];
          copyBorders.style.display = 'none';
          VueUtil.loop(tableBody.$el.querySelectorAll('.col--copyed'), function (elem) {
            return tools.DomTools.removeClass(elem, 'col--copyed');
          });
        }
  
        return this.$nextTick();
      },
  
      /**
       * 处理复制
       */
      handleCopyed: function handleCopyed(cut, evnt) {
        var tableData = this.tableData,
            tableColumn = this.tableColumn,
            editStore = this.editStore;
        var copyed = editStore.copyed,
            checked = editStore.checked;
        var rowNodes;

        if (this.mouseConfig.checked) {
          rowNodes = checked.rowNodes;
        } else if(this.mouseConfig.selected) {
          rowNodes = editStore.selected.args && [[editStore.selected.args.cell]] ;
        }

        if (!rowNodes) {
          return;
        }

        this.clearCopyed();
        var cWidth = -3;
        var cHeight = -3;
        var offsetTop = 0;
        var offsetLeft = 0;
        var columns = [];
        var rows = [];
  
        if (rowNodes.length) {
          var firstRows = rowNodes[0];
  
          var _DomTools$getCellNode = tools.DomTools.getCellNodeIndex(firstRows[0]),
              rowIndex = _DomTools$getCellNode.rowIndex,
              columnIndex = _DomTools$getCellNode.columnIndex;
  
          columns = tableColumn.slice(columnIndex, columnIndex + firstRows.length);
          rows = tableData.slice(rowIndex, rowIndex + rowNodes.length);
        }
  
        VueUtil.loop(rowNodes, function (rows, rowIndex) {
          var isTop = rowIndex === 0;
          VueUtil.loop(rows, function (elem, colIndex) {
            var isLeft = colIndex === 0;
  
            if (isLeft && isTop) {
              offsetTop = elem.offsetTop;
              offsetLeft = elem.offsetLeft;
            }
  
            if (isTop) {
              cWidth += elem.offsetWidth;
            }
  
            if (isLeft) {
              cHeight += elem.offsetHeight;
            }
  
            tools.DomTools.addClass(elem, 'col--copyed');
          });
        });
        var _this$$refs$tableBody2 = this.$refs.tableBody.$refs,
            copyBorders = _this$$refs$tableBody2.copyBorders,
            copyTop = _this$$refs$tableBody2.copyTop,
            copyRight = _this$$refs$tableBody2.copyRight,
            copyBottom = _this$$refs$tableBody2.copyBottom,
            copyLeft = _this$$refs$tableBody2.copyLeft;
        copyBorders.style.display = 'block';
        VueUtil.assign(copyTop.style, {
          top: ''.concat(offsetTop, 'px'),
          left: ''.concat(offsetLeft, 'px'),
          width: ''.concat(cWidth, 'px')
        });
        VueUtil.assign(copyRight.style, {
          top: ''.concat(offsetTop, 'px'),
          left: ''.concat(offsetLeft + cWidth, 'px'),
          height: ''.concat(cHeight, 'px')
        });
        VueUtil.assign(copyBottom.style, {
          top: ''.concat(offsetTop + cHeight, 'px'),
          left: ''.concat(offsetLeft, 'px'),
          width: ''.concat(cWidth, 'px')
        });
        VueUtil.assign(copyLeft.style, {
          top: ''.concat(offsetTop, 'px'),
          left: ''.concat(offsetLeft, 'px'),
          height: ''.concat(cHeight, 'px')
        });
        copyed.cut = cut;
        copyed.rows = rows;
        copyed.columns = columns;
        copyed.rowNodes = rowNodes;

        VueUtil.clipboard(this.getHandleCopyStr());
      },
  
      /**
       * 处理粘贴
       */
      handlePaste: function handlePaste(evnt) {
        var table = this;
        var data = this.getClipboardData(evnt);
        var tableData = this.tableData,
            visibleColumn = this.visibleColumn,
            editStore = this.editStore,
            elemStore = this.elemStore;
        var copyed = editStore.copyed,
            selected = editStore.selected;
        var cut = copyed.cut,
            rows = data.rows,
            columns = data.columns;
  
        if (rows.length && columns.length && selected.row && selected.column) {
          var _selected$args = selected.args,
              rowIndex = _selected$args.$rowIndex,
              columnIndex = _selected$args.columnIndex;
          VueUtil.loop(rows, function (row, rIndex) {
            var offsetRow = tableData[rowIndex + rIndex];
  
            if (offsetRow) {
              VueUtil.loop(columns, function (column, cIndex) {
                var offsetColumn = visibleColumn[columnIndex + cIndex];

                if (offsetColumn) {

                  if (table.isCellEditable({row: offsetRow, column: offsetColumn})) {
                    var val = tools.UtilTools.getCellValue(row, column);
                    var formattedVal = table.getFormattedVal(val, offsetRow, offsetColumn, 'paste');
                    tools.UtilTools.setCellValue(offsetRow, offsetColumn, formattedVal);
                  }
                }
  
                if (cut) {
                  var oldRow = copyed.rows[rIndex];
                  var oldCol = copyed.columns[cIndex];
                  if (table.isCellEditable({row: oldRow, column: oldCol})) {
                    tools.UtilTools.setCellValue(oldRow, oldCol, null);
                  }
                }
              });
            }
          });
  
          if (cut) {
            this.clearCopyed();
          }
  
          var bodyList = elemStore['main-body-list'].children;
          var cell = selected.args.cell;
          var trElem = cell.parentNode;
          var colIndex = VueUtil.arrayIndexOfVal(trElem.children, cell);
          var rIndex = VueUtil.arrayIndexOfVal(bodyList, trElem);
          var targetTrElem = bodyList[rIndex + rows.length - 1];
          var targetCell = targetTrElem.children[colIndex + columns.length - 1];
          this.handleChecked(tools.DomTools.getRowNodes(bodyList, tools.DomTools.getCellNodeIndex(cell), tools.DomTools.getCellNodeIndex(targetCell)));
        }
      },

      getFormattedVal: function(val, offsetRow, offsetColumn, type) {
        if (!offsetColumn) return val;
        var formatter;
        if (type === 'paste') {
          formatter = offsetColumn.pasteFormatter;
        } else if (type === 'copy') {
          formatter = offsetColumn.copyFormatter || offsetColumn.formatter;
        }
        if(!formatter) return  val;

        var formattedVal = '';

        if (VueUtil.isString(formatter)) {
          formattedVal = VueUtil.get(VueUtil, formatter)(val);
        } else if (VueUtil.isArray(formatter)) {
          formattedVal = VueUtil.get(VueUtil, formatter[0]).apply(VueUtil, [val].concat(formatter.slice(1)));
        } else {
          formattedVal = formatter({
            cellValue: val,
            row: offsetRow,
            rowIndex: this.getRowIndex(offsetRow),
            column: offsetColumn,
            columnIndex: this.getColumnIndex(offsetColumn),
          });
        }

        return formattedVal;
      },

      // 复制的行列数据转化为内容数据
      getHandleCopyStr: function getHandleCopyStr() {
        var temp = '';
        var copy = this.editStore.copyed;
        for (var j = 0; j < copy.rows.length; j++) {
          if (j > 0) {
            temp += '\n';
          }
          for (var i = 0; i < copy.columns.length; i++) {
            if (i > 0) {
              temp += '\t';
            }
            // temp += tools.UtilTools.getCellValue(copy.rows[j], copy.columns[i]);
            var val = tools.UtilTools.getCellValue(copy.rows[j], copy.columns[i]);
            var formattedVal = this.getFormattedVal(val, copy.rows[j], copy.columns[i], 'copy');
            temp += (formattedVal || '');
          }
        }
        return temp;
      },
      // 获取剪贴板文字
      getClipboardText: function getClipboardText(e) {
        var data = null;
        var clipboardData = window.clipboardData; // IE
        if (!clipboardData) { //chrome
          if (typeof e != 'undefined' && typeof e.clipboardData != 'undefined') {
            clipboardData = e.clipboardData;
          }
        }
        if (clipboardData) {
          data = clipboardData.getData('text');
        }
        return data;
      },
      /**
        return "{\"rows\": [{\"1\": \"抢钱cx\",\"2\": \"前端cx\"}, {\"1\": \"蕾蕾cx\",\"2\": \"后端cx\"}],
          \"columns\": [{\"property\": 1}, {\"property\": 2}]}"
      */
     getClipboardData: function getClipboardData(event) {

      function uniqueColumns(columns) {
        var map = {};
        var newList = [];
        for (var i = 0; i < columns.length; i++) {
          if (!map[columns[i].property]) {
            map[columns[i].property] = 1;
            newList.push(columns[i]);
          }
        }
        return newList;
      }

        var rows = this.getClipboardText(event).split(/\r?\n/);
        var dataObj = { rows: [], columns: [] };
        for (var i = 0; i < rows.length; i++) {
          var rowitems = rows[i].split('\t');
          if (rowitems.length == 1 && '' == rowitems[0]) {
            continue;
          }
          var rowitem = {};
          for (var j = 0; j < rowitems.length; j++) {
            rowitem[j + 1] = rowitems[j];
            dataObj.columns.push({ 'property': j + 1 });
          }
          dataObj.rows.push(rowitem);
        }
        dataObj.columns = uniqueColumns(dataObj.columns);
        return dataObj;
      },
    }
  };

  return VueXtableKeyboardMixin;
});