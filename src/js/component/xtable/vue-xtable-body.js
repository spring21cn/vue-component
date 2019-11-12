(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    context.VueXtableBody = definition(context.GlobalConfig, context.tools);
  }
})(this, function(GlobalConfig, tools) {

  var _defineProperty = tools.UtilTools.defineProperty;
  
  // 滚动、拖动过程中不需要触发
  function isOperateMouse ($table) {
    return $table._isResize || ($table.lastScrollTime && Date.now() < $table.lastScrollTime + $table.optimizeOpts.delayHover);
  }
  function renderBorder(h, type) {
    return h('div', {
      class: 'vue-xtable-table-'.concat(type, 'ed-borders'),
      ref: ''.concat(type, 'Borders')
    }, [h('span', {
      class: 'vue-xtable-table-border-top',
      ref: ''.concat(type, 'Top')
    }), h('span', {
      class: 'vue-xtable-table-border-right',
      ref: ''.concat(type, 'Right')
    }), h('span', {
      class: 'vue-xtable-table-border-bottom',
      ref: ''.concat(type, 'Bottom')
    }), h('span', {
      class: 'vue-xtable-table-border-left',
      ref: ''.concat(type, 'Left')
    })]);
  }
  /**
   * 渲染列
   */
  
  
  function renderColumn(h, _vm, $table, $seq, seq, fixedType, rowLevel, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex) {
    var _ref2;
  
    var _e = $table._e,
        tableListeners = $table.$listeners,
        tableData = $table.tableData,
        height = $table.height,
        columnKey = $table.columnKey,
        overflowX = $table.overflowX,
        scrollXLoad = $table.scrollXLoad,
        scrollYLoad = $table.scrollYLoad,
        highlightCurrentRow = $table.highlightCurrentRow,
        allColumnOverflow = $table.showOverflow,
        allAlign = $table.align,
        cellClassName = $table.cellClassName,
        cellStyle = $table.cellStyle,
        spanMethod = $table.spanMethod,
        _$table$radioConfig = $table.radioConfig,
        radioConfig = _$table$radioConfig === void 0 ? {} : _$table$radioConfig,
        _$table$expandConfig = $table.expandConfig,
        expandConfig = _$table$expandConfig === void 0 ? {} : _$table$expandConfig,
        _$table$treeConfig = $table.treeConfig,
        treeConfig = _$table$treeConfig === void 0 ? {} : _$table$treeConfig,
        _$table$mouseConfig = $table.mouseConfig,
        mouseConfig = _$table$mouseConfig === void 0 ? {} : _$table$mouseConfig,
        editConfig = $table.editConfig,
        editRules = $table.editRules,
        validOpts = $table.validOpts,
        editStore = $table.editStore,
        validStore = $table.validStore,
        validResultsCell = $table.validResultsCell;
    var editRender = column.editRender,
        align = column.align,
        showOverflow = column.showOverflow,
        className = column.className;
    var actived = editStore.actived;
    var fixedHiddenColumn = fixedType ? column.fixed !== fixedType : column.fixed && overflowX;
    var cellOverflow = VueUtil.isUndefined(showOverflow) || VueUtil.isNull(showOverflow) ? allColumnOverflow : showOverflow;
    var showEllipsis = cellOverflow === 'ellipsis';
    var showTitle = cellOverflow === 'title';
    var showTooltip = cellOverflow === true || cellOverflow === 'tooltip';
    var hasEllipsis = showTitle || showTooltip || showEllipsis;
    var isDirty;
    var tdOns = {};
    var cellAlign = align || allAlign;
    var validError = validStore.row === row && validStore.column === column;
    var rowId = tools.UtilTools.getRowid($table, row);
    var validResultCell = validResultsCell[rowId] ? validResultsCell[rowId][column.property] : undefined;
    var hasDefaultTip = editRules && (validOpts.message === 'default' ? height || tableData.length > 1 : validOpts.message === 'inline');
    var attrs = {
      'data-colid': column.id
    };
    var triggerDblclick = editRender && editConfig && editConfig.trigger === 'dblclick';
    var params = {
      $table: $table,
      $seq: $seq,
      seq: seq,
      row: row,
      rowIndex: rowIndex,
      $rowIndex: $rowIndex,
      column: column,
      columnIndex: columnIndex,
      $columnIndex: $columnIndex,
      fixed: fixedType,
      isHidden: fixedHiddenColumn,
      level: rowLevel,
      data: tableData
    }; // 在 v3.0 中废弃 selectConfig
  
    var checkboxConfig = $table.checkboxConfig || $table.selectConfig || {}; // 滚动的渲染不支持动态行高
  
    if ((scrollXLoad || scrollYLoad) && !hasEllipsis) {
      showEllipsis = hasEllipsis = true;
    } // hover 进入事件
  
  
    if (showTitle || showTooltip || tableListeners['cell-mouseenter']) {
      tdOns.mouseenter = function (evnt) {
        if (isOperateMouse($table)) {
          return;
        }
  
        var evntParams = {
          $table: $table,
          seq: seq,
          row: row,
          rowIndex: rowIndex,
          $rowIndex: $rowIndex,
          column: column,
          columnIndex: columnIndex,
          $columnIndex: $columnIndex,
          fixed: fixedType,
          isHidden: fixedHiddenColumn,
          level: rowLevel,
          cell: evnt.currentTarget
        };
  
        if (showTitle) {
          tools.DomTools.updateCellTitle(evnt);
        } else if (showTooltip) {
          // 如果配置了显示 tooltip
          $table.triggerTooltipEvent(evnt, evntParams);
        }
  
        tools.UtilTools.emitEvent($table, 'cell-mouseenter', [evntParams, evnt]);
      };
    } // hover 退出事件
  
  
    if (showTooltip || tableListeners['cell-mouseleave']) {
      tdOns.mouseleave = function (evnt) {
        if (isOperateMouse($table)) {
          return;
        }
  
        if (showTooltip) {
          $table.handleTargetLeaveEvent(evnt);
        }
  
        tools.UtilTools.emitEvent($table, 'cell-mouseleave', [{
          $table: $table,
          seq: seq,
          row: row,
          rowIndex: rowIndex,
          $rowIndex: $rowIndex,
          column: column,
          columnIndex: columnIndex,
          $columnIndex: $columnIndex,
          fixed: fixedType,
          isHidden: fixedHiddenColumn,
          level: rowLevel,
          cell: evnt.currentTarget
        }, evnt]);
      };
    } // 按下事件处理
  
  
    if (mouseConfig.checked || mouseConfig.selected || $table.highlightCurrentRow) {
      tdOns.mousedown = function (evnt) {
        if(evnt.currentTarget.className.indexOf('col--drag') > -1) {
          return;
        }
        if ($table.editStore && $table.editStore.actived &&  $table.editConfig) {
          if($table.editConfig.mode == 'row' && $table.editStore.actived.row == row) {
            return; 
          }
          if($table.editConfig.mode == 'cell' && $table.editStore.actived.row == row && $table.editStore.actived.column == column) {
            return;
          }
        }
        
        $table.triggerCellMousedownEvent(evnt, {
          $table: $table,
          seq: seq,
          row: row,
          rowIndex: rowIndex,
          $rowIndex: $rowIndex,
          column: column,
          columnIndex: columnIndex,
          $columnIndex: $columnIndex,
          fixed: fixedType,
          isHidden: fixedHiddenColumn,
          level: rowLevel,
          cell: evnt.currentTarget
        });
      };
    } // 点击事件处理
  
  
    if (highlightCurrentRow || tableListeners['cell-click'] || mouseConfig.checked || editRender && editConfig || expandConfig.trigger === 'row' || expandConfig.trigger === 'cell' || radioConfig.trigger === 'row' || column.type === 'radio' && radioConfig.trigger === 'cell' || // 在 v3.0 中废弃 type=selection
    checkboxConfig.trigger === 'row' || (column.type === 'checkbox' || column.type === 'selection') && checkboxConfig.trigger === 'cell' || treeConfig.trigger === 'row' || column.treeNode && treeConfig.trigger === 'cell') {
      tdOns.click = function (evnt) {
        if(evnt.currentTarget.className.indexOf('col--drag') > -1) {
          return;
        }
        $table.triggerCellClickEvent(evnt, {
          $table: $table,
          row: row,
          rowIndex: rowIndex,
          $rowIndex: $rowIndex,
          column: column,
          columnIndex: columnIndex,
          $columnIndex: $columnIndex,
          fixed: fixedType,
          isHidden: fixedHiddenColumn,
          level: rowLevel,
          cell: evnt.currentTarget
        });
      };
    } // 双击事件处理
  
  
    tdOns.dblclick = function (evnt) {
      $table.clearCopyed();
      if (triggerDblclick || tableListeners['cell-dblclick']) {
        $table.triggerCellDBLClickEvent(evnt, {
          $table: $table,
          seq: seq,
          row: row,
          rowIndex: rowIndex,
          $rowIndex: $rowIndex,
          column: column,
          columnIndex: columnIndex,
          $columnIndex: $columnIndex,
          fixed: fixedType,
          isHidden: fixedHiddenColumn,
          level: rowLevel,
          cell: evnt.currentTarget
        });
      } 
    };
  
  // 合并行或列
    if (spanMethod) {
      var _ref = spanMethod(params) || {},
          _ref$rowspan = _ref.rowspan,
          rowspan = _ref$rowspan === void 0 ? 1 : _ref$rowspan,
          _ref$colspan = _ref.colspan,
          colspan = _ref$colspan === void 0 ? 1 : _ref$colspan;
  
      if (!rowspan || !colspan) {
        return null;
      }
  
      attrs.rowspan = rowspan;
      attrs.colspan = colspan;
    } // 如果显示状态
  
  
    if (!fixedHiddenColumn && editConfig && editConfig.showStatus) {
      isDirty = $table.isUpdateByRow(row, column.property);
    }
  
    return h('td', {
      class: ['vue-xtable-body--column', column.id, (_ref2 = {}, _defineProperty(_ref2, 'col--'.concat(cellAlign), cellAlign),
      _defineProperty(_ref2, 'col--edit', editRender), _defineProperty(_ref2, 'col--index', column.type === 'index'),
      _defineProperty(_ref2, 'col--drag', column.type === 'drag'), _defineProperty(_ref2, 'col--ellipsis', hasEllipsis),
      _defineProperty(_ref2, 'edit--visible', editRender && editRender.type === 'visible'), _defineProperty(_ref2, 'fixed--hidden', fixedHiddenColumn),
      _defineProperty(_ref2, 'col--dirty', isDirty), _defineProperty(_ref2, 'col--actived', editConfig && editRender && actived.row === row && (actived.column === column || editConfig.mode === 'row')),
      _defineProperty(_ref2, 'col--valid-error', validError),
      _defineProperty(_ref2, 'col--valid-result-error', validResultCell),
       _ref2), tools.UtilTools.getClass(className, params),
       tools.UtilTools.getClass(cellClassName, params)],
      key: columnKey ? column.id : columnIndex,
      attrs: attrs,
      style: cellStyle ? VueUtil.isFunction(cellStyle) ? cellStyle(params) : cellStyle : null,
      on: tdOns
    }, allColumnOverflow && fixedHiddenColumn ? [] : [h('div', {
      class: ['vue-xtable-cell', {
        'c--title': showTitle,
        'c--tooltip': showTooltip,
        'c--ellipsis': showEllipsis
      }],
      attrs: {
        title: showTitle ? tools.UtilTools.getCellLabel(row, column, params) : null
      }
    }, column.renderCell(h, params)), hasDefaultTip ? validError ? h('div', {
      class: 'vue-xtable-cell--valid',
      style: validStore.rule && validStore.rule.width ? {
        width: ''.concat(validStore.rule.width, 'px')
      } : null
    }, [h('span', {
      class: 'vue-xtable-cell--valid-msg',
      domProps: {
        innerHTML: Array.isArray(validStore.content) ? validStore.content.join('<br>') :  validStore.content
      },
    })]) : _e() : null]);
  }
  
  function renderRows(h, _vm, $table, $seq, rowLevel, fixedType, tableData, tableColumn) {
    var stripe = $table.stripe,
        rowKey = $table.rowKey,
        highlightHoverRow = $table.highlightHoverRow,
        rowClassName = $table.rowClassName,
        rowStyle = $table.rowStyle,
        treeConfig = $table.treeConfig,
        treeExpandeds = $table.treeExpandeds,
        scrollYLoad = $table.scrollYLoad,
        scrollYStore = $table.scrollYStore,
        editStore = $table.editStore,
        expandeds = $table.expandeds,
        getColumnIndex = $table.getColumnIndex,
        validResultsCell = $table.validResultsCell;
    var rows = [];
    tableData.forEach(function (row, $rowIndex) {
      var _ref3;
  
      var trOn = {};
      var rowIndex = $rowIndex;
      var seq = rowIndex + 1;
  
      if (scrollYLoad) {
        seq += scrollYStore.startIndex;
      } // 确保任何情况下 rowIndex 都精准指向真实 data 索引
  
  
      rowIndex = $table.getRowIndex(row); // 事件绑定
  
      row.$rowIndex = $rowIndex;
      row.rowIndex = rowIndex;

      var rowid = tools.UtilTools.getRowid($table, row);

      var evntParams = {
        $table: $table,
        $seq: $seq,
        seq: seq,
        fixedType: fixedType,
        rowLevel: rowLevel,
        row: row,
        rowIndex: rowIndex,
        $rowIndex: $rowIndex
      };

      
      trOn.mouseenter = function (evnt) {
        if (isOperateMouse($table)) {
          return;
        }

        if (highlightHoverRow) {
          $table.triggerHoverEvent(evnt, {
            row: row,
            rowIndex: rowIndex
          });
        }

        tools.UtilTools.emitEvent($table, 'row-mouseenter', [evntParams, evnt]);
      };

      trOn.mouseleave = function (evnt) {
        if (isOperateMouse($table)) {
          return;
        }

        if (highlightHoverRow) {
          $table.clearHoverRow();
        }

        tools.UtilTools.emitEvent($table, 'row-mouseleave', [evntParams, evnt]);
      };
      
      trOn.mousedown = function (evnt) {
        if (isOperateMouse($table)) {
          return;
        }
        tools.UtilTools.emitEvent($table, 'row-mousedown', [evntParams, evnt]);
      };
      rows.push(h('tr', {
        class: ['vue-xtable-body--row', (_ref3 = {
          'row--stripe': stripe && $rowIndex > 0 && ($rowIndex + 1) % 2 === 0,
          'row--valid-result-error': validResultsCell[rowid] && Object.keys(validResultsCell[rowid]).length
        }, _defineProperty(_ref3, 'row--level-'.concat(rowLevel), treeConfig), _defineProperty(_ref3, 'row--new', editStore.insertList.indexOf(row) > -1), _ref3), rowClassName ? VueUtil.isFunction(rowClassName) ? rowClassName({
          $table: $table,
          $seq: $seq,
          seq: seq,
          fixedType: fixedType,
          rowLevel: rowLevel,
          row: row,
          rowIndex: rowIndex,
          $rowIndex: $rowIndex
        }) : rowClassName : ''],
        attrs: {
          'data-rowid': rowid
        },
        style: rowStyle ? VueUtil.isFunction(rowStyle) ? rowStyle({
          $table: $table,
          $seq: $seq,
          seq: seq,
          fixedType: fixedType,
          rowLevel: rowLevel,
          row: row,
          rowIndex: rowIndex,
          $rowIndex: $rowIndex
        }) : rowStyle : null,
        key: rowKey || treeConfig ? rowid : $rowIndex,
        on: trOn
      }, tableColumn.map(function (column, $columnIndex) {
        var columnIndex = getColumnIndex(column);
        return renderColumn(h, _vm, $table, $seq, seq, fixedType, rowLevel, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex);
      }))); // 如果行被展开了
  
      if (expandeds.length && expandeds.indexOf(row) > -1) {
        var column = VueUtil.find(tableColumn, function (column) {
          return column.type === 'expand';
        });
        var columnIndex = getColumnIndex(column);
        var cellStyle;
  
        if (treeConfig) {
          cellStyle = {
            paddingLeft: ''.concat(rowLevel * (treeConfig.indent || 16) + 30, 'px')
          };
        }
  
        if (column) {
          rows.push(h('tr', {
            class: 'vue-xtable-body--expanded-row',
            key: 'expand_'.concat(rowid),
            style: rowStyle ? VueUtil.isFunction(rowStyle) ? rowStyle({
              $table: $table,
              $seq: $seq,
              seq: seq,
              fixedType: fixedType,
              rowLevel: rowLevel,
              row: row,
              rowIndex: rowIndex,
              $rowIndex: $rowIndex,
              isExpanded: true
            }) : rowStyle : null,
            on: trOn
          }, [h('td', {
            class: 'vue-xtable-body--expanded-column',
            attrs: {
              colspan: tableColumn.length
            }
          }, [h('div', {
            class: ['vue-xtable-body--expanded-cell', {
              'fixed--hidden': fixedType
            }],
            style: cellStyle
          }, [column.renderData(h, {
            $table: $table,
            seq: seq,
            row: row,
            rowIndex: rowIndex,
            column: column,
            columnIndex: columnIndex,
            fixed: fixedType,
            level: rowLevel
          })])])]));
        }
      } // 如果是树形表格
  
  
      if (treeConfig && treeExpandeds.length) {
        var rowChildren = row[treeConfig.children];
  
        if (rowChildren && rowChildren.length && treeExpandeds.indexOf(row) > -1) {
          rows.push.apply(rows, renderRows(h, _vm, $table, $seq ? ''.concat($seq, '.').concat(seq) : ''.concat(seq), rowLevel + 1, fixedType, rowChildren, tableColumn));
        }
      }
    });
    return rows;
  }
  /**
   * 同步滚动条
   * scroll 方式：可以使固定列与内容保持一致的滚动效果，处理相对麻烦
   * mousewheel 方式：对于同步滚动效果就略差了，左右滚动，内容跟随即可
   * css3 translate 方式：可以利用硬件加速，各方面较优，失去table布局能力
   */
  
  
  var scrollProcessTimeout;
  
  function syncBodyScroll(scrollTop, elem1, elem2) {
    if (elem1 || elem2) {
      if (elem1) {
        elem1.onscroll = null;
        elem1.scrollTop = scrollTop;
      }
  
      if (elem2) {
        elem2.onscroll = null;
        elem2.scrollTop = scrollTop;
      }
  
      clearTimeout(scrollProcessTimeout);
      scrollProcessTimeout = setTimeout(function () {
        if (elem1) {
          elem1.onscroll = elem1._onscroll;
        }
  
        if (elem2) {
          elem2.onscroll = elem2._onscroll;
        }
      }, 100);
    }
  }
  
  var VueXtableBody = {
    name: 'VueXtableBody',
    props: {
      tableData: Array,
      tableColumn: Array,
      visibleColumn: Array,
      collectColumn: Array,
      fixedColumn: Array,
      size: String,
      fixedType: String,
      isGroup: Boolean
    },
    mounted: function mounted() {
      var $table = this.$parent,
          $el = this.$el,
          $refs = this.$refs,
          fixedType = this.fixedType;
      var elemStore = $table.elemStore;
      var prefix = ''.concat(fixedType || 'main', '-body-');
      elemStore[''.concat(prefix, 'wrapper')] = $el;
      elemStore[''.concat(prefix, 'table')] = $refs.table;
      elemStore[''.concat(prefix, 'colgroup')] = $refs.colgroup;
      elemStore[''.concat(prefix, 'list')] = $refs.tbody;
      elemStore[''.concat(prefix, 'xSpace')] = $refs.xSpace;
      elemStore[''.concat(prefix, 'ySpace')] = $refs.ySpace;
      elemStore[''.concat(prefix, 'emptyBlock')] = $refs.emptyBlock;
      this.$el.onscroll = this.scrollEvent;
      this.$el._onscroll = this.scrollEvent;
    },
    beforeDestroy: function beforeDestroy() {
      this.$el._onscroll = null;
      this.$el.onscroll = null;
    },
    render: function render(h) {
      var _e = this._e,
          $table = this.$parent,
          fixedColumn = this.fixedColumn,
          fixedType = this.fixedType;
      var $scopedSlots = $table.$scopedSlots,
          tableData = $table.tableData,
          tableColumn = $table.tableColumn,
          allColumnOverflow = $table.showOverflow,
          scrollXLoad = $table.scrollXLoad,
          _$table$mouseConfig2 = $table.mouseConfig,
          mouseConfig = _$table$mouseConfig2 === void 0 ? {} : _$table$mouseConfig2,
          _$table$keyboardConfi = $table.keyboardConfig,
          keyboardConfig = _$table$keyboardConfi === void 0 ? {} : _$table$keyboardConfi; // 如果是固定列与设置了超出隐藏
  
      if (fixedType && allColumnOverflow) {
        tableColumn = fixedColumn;
      } else if (scrollXLoad) {
        if (fixedType) {
          tableColumn = fixedColumn;
        }
      }
  
      return h('div', {
        class: ['vue-xtable-table--body-wrapper', fixedType ? 'fixed-'.concat(fixedType, '--wrapper') : 'body--wrapper']
      }, [fixedType ? _e() : h('div', {
        class: 'vue-xtable-body--x-space',
        ref: 'xSpace'
      }), h('div', {
        class: 'vue-xtable-body--y-space',
        ref: 'ySpace'
      }), h('table', {
        class: 'vue-xtable-table--body',
        attrs: {
          cellspacing: 0,
          cellpadding: 0,
          border: 0
        },
        ref: 'table'
      }, [
      /**
       * 列宽
       */
      h('colgroup', {
        ref: 'colgroup'
      }, tableColumn.map(function (column, columnIndex) {
        return h('col', {
          attrs: {
            name: column.id
          },
          key: columnIndex
        });
      })),
      /**
       * 内容
       */
      h('tbody', {
        ref: 'tbody'
      }, renderRows(h, this, $table, '', 0, fixedType, tableData, tableColumn))]),
      /**
       * 选中边框线
       */
      !fixedType && (mouseConfig.checked || keyboardConfig.isCut) ? h('div', {
        class: 'vue-xtable-table--borders'
      }, [mouseConfig.checked ? renderBorder(h, 'check') : null, keyboardConfig.isCut ? renderBorder(h, 'copy') : null]) : null, !fixedType ? h('div', {
        class: 'vue-xtable-table--empty-block'.concat(tableData.length ? '' : ' is--visible'),
        ref: 'emptyBlock'
      }, [h('span', {
        class: 'vue-xtable-table--empty-text'
      }, $scopedSlots.empty ? $scopedSlots.empty.call(this, {
        $table: $table
      }, h) : GlobalConfig.i18n('vue.xtable.table.emptyText'))]) : null]);
    },
    methods: {
      /**
       * 滚动处理
       * 如果存在列固定左侧，同步更新滚动状态
       * 如果存在列固定右侧，同步更新滚动状态
       */
      scrollEvent: function scrollEvent(evnt) {
        var $table = this.$parent,
            fixedType = this.fixedType;
        var $refs = $table.$refs,
            highlightHoverRow = $table.highlightHoverRow,
            scrollXLoad = $table.scrollXLoad,
            scrollYLoad = $table.scrollYLoad,
            lastScrollTop = $table.lastScrollTop,
            lastScrollLeft = $table.lastScrollLeft;
        var tableHeader = $refs.tableHeader,
            tableBody = $refs.tableBody,
            leftBody = $refs.leftBody,
            rightBody = $refs.rightBody,
            tableFooter = $refs.tableFooter;
        var headerElem = tableHeader ? tableHeader.$el : null;
        var footerElem = tableFooter ? tableFooter.$el : null;
        var bodyElem = tableBody.$el;
        var leftElem = leftBody ? leftBody.$el : null;
        var rightElem = rightBody ? rightBody.$el : null;
        var scrollTop = bodyElem.scrollTop;
        var scrollLeft = bodyElem.scrollLeft;
        var isX = scrollLeft !== lastScrollLeft;
        var isY = scrollTop !== lastScrollTop;
        $table.lastScrollTop = scrollTop;
        $table.lastScrollLeft = scrollLeft;
        $table.lastScrollTime = Date.now();
  
        if (highlightHoverRow) {
          $table.clearHoverRow();
        }
  
        if (leftElem && fixedType === 'left') {
          scrollTop = leftElem.scrollTop;
          syncBodyScroll(scrollTop, bodyElem, rightElem);
        } else if (rightElem && fixedType === 'right') {
          scrollTop = rightElem.scrollTop;
          syncBodyScroll(scrollTop, bodyElem, leftElem);
        } else {
          if (isX) {
            if (headerElem) {
              headerElem.scrollLeft = bodyElem.scrollLeft;
            }
  
            if (footerElem) {
              footerElem.scrollLeft = bodyElem.scrollLeft;
            }
          }
  
          if (leftElem || rightElem) {
            $table.checkScrolling();
  
            if (isY) {
              syncBodyScroll(scrollTop, leftElem, rightElem);
            }
          }
        }
  
        if (scrollXLoad && isX) {
          $table.triggerScrollXEvent(evnt);
  
          if (headerElem && scrollLeft + bodyElem.clientWidth >= bodyElem.scrollWidth - 80) {
            // 修复拖动滚动条时可能存在不同步问题
            this.$nextTick(function () {
              if (bodyElem.scrollLeft !== headerElem.scrollLeft) {
                headerElem.scrollLeft = bodyElem.scrollLeft;
              }
            });
          }
        }
  
        if (scrollYLoad && isY) {
          $table.triggerScrollYEvent(evnt);
        }
  
        tools.UtilTools.emitEvent($table, 'scroll', [{
          type: 'body',
          fixed: fixedType,
          scrollTop: scrollTop,
          scrollLeft: scrollLeft,
          isX: isX,
          isY: isY,
          $table: $table
        }, evnt]);
      }
    }
  };
  
  return VueXtableBody;
});