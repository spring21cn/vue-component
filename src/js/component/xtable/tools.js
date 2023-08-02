(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['utils'], definition);
  } else {
    context.tools = definition(context.GlobalConfig);
  }
})(this, function(GlobalConfig) {
  //dom.js
  var htmlElem = document.querySelector('html');
  var bodyElem = document.body;

  function getClsRE(cls) {
    if (!reClsMap[cls]) {
      reClsMap[cls] = new RegExp('(?:^|\\s)'.concat(cls, '(?!\\S)'), 'g');
    }

    return reClsMap[cls];
  }

  var reClsMap = {};
  var DomTools = {
    isPx: function isPx(val) {
      return val && /^\d+(px)?$/.test(val);
    },
    isScale: function isScale(val) {
      return val && /^\d+%$/.test(val);
    },
    hasClass: function hasClass(elem, cls) {
      return elem && elem.className && elem.className.match && elem.className.match(getClsRE(cls));
    },
    removeClass: function removeClass(elem, cls) {
      if (elem && DomTools.hasClass(elem, cls)) {
        elem.className = elem.className.replace(getClsRE(cls), '');
      }
    },
    addClass: function addClass(elem, cls) {
      if (elem && !DomTools.hasClass(elem, cls)) {
        DomTools.removeClass(elem, cls);
        elem.className = ''.concat(elem.className, ' ').concat(cls);
      }
    },
    updateCellTitle: function updateCellTitle(evnt) {
      var cellElem = evnt.currentTarget.querySelector('.vue-xtable-cell');

      var content;
      if (VueUtil.hasClass(cellElem.parentElement, 'col--actived')) {
        return;
      } else {
        content = cellElem.innerText;
      }

      if (cellElem.getAttribute('title') !== content) {
        cellElem.setAttribute('title', content);
      }
    },
    rowToVisible: function rowToVisible($table, row) {
      var bodyElem = $table.$refs.tableBody.$el;
      var trElem = bodyElem.querySelector('[data-rowid="'.concat(UtilTools.getRowid($table, row), '"]'));

      var bodyHeight = bodyElem.clientHeight;
      var bodySrcollTop = bodyElem.scrollTop;
      var trOffsetTop;
      var trHeight;
      if (trElem) {
        trOffsetTop = trElem.offsetTop + (trElem.offsetParent ? trElem.offsetParent.offsetTop : 0);
        trHeight = trElem.clientHeight;
      } else if ($table.scrollYLoad) {
        // 懒加载
        trHeight = $table.scrollYStore.rowHeight;
        trOffsetTop = $table.afterFullData.indexOf(row) * trHeight;
      }

        if (trOffsetTop < bodySrcollTop) {
          // 向上定位
          return $table.scrollTo(null, trOffsetTop);
        } else if (trOffsetTop > bodyHeight + bodySrcollTop - trHeight) {
          // 向下定位
          return $table.scrollTo(null, trOffsetTop - bodyHeight + trHeight);
        }

      return Promise.resolve();
    },
    colToVisible: function colToVisible($table, column) {
      var bodyElem = $table.$refs.tableBody.$el;
      var tdElem = bodyElem.querySelector('.'.concat(column.id));

      if (tdElem) {
        var bodyWidth = bodyElem.clientWidth;
        var bodySrcollLeft = bodyElem.scrollLeft;
        var tdOffsetLeft = tdElem.offsetLeft + (tdElem.offsetParent ? tdElem.offsetParent.offsetLeft : 0);
        var tdWidth = tdElem.clientWidth; // 检测行是否在可视区中

        if (tdOffsetLeft < bodySrcollLeft || tdOffsetLeft > bodySrcollLeft + bodyWidth) {
          // 向左定位
          return $table.scrollTo(tdOffsetLeft);
        } else if (tdOffsetLeft + tdWidth >= bodyWidth + bodySrcollLeft) {
          // 向右定位
          return $table.scrollTo(bodySrcollLeft + tdWidth);
        }
      } else {
        // 如果是虚拟渲染跨行滚动
        if ($table.scrollXLoad) {
          var visibleColumn = $table.visibleColumn;
          var scrollLeft = 0;

          for (var index = 0; index < visibleColumn.length; index++) {
            if (visibleColumn[index] === column) {
              break;
            }

            scrollLeft += visibleColumn[index].renderWidth;
          }

          return $table.scrollTo(scrollLeft);
        }
      }

      return Promise.resolve();
    },
    getDomNode: function getDomNode() {
      var documentElement = document.documentElement;
      var bodyElem = document.body;
      return {
        scrollTop: documentElement.scrollTop || bodyElem.scrollTop,
        scrollLeft: documentElement.scrollLeft || bodyElem.scrollLeft,
        visibleHeight: documentElement.clientHeight || bodyElem.clientHeight,
        visibleWidth: documentElement.clientWidth || bodyElem.clientWidth
      };
    },

    /**
     * 检查触发源是否属于目标节点
     */
    getEventTargetNode: function getEventTargetNode(evnt, container, queryCls, findPopper) {
      var targetElem;
      var target = evnt.target;
      var popper;

      while (target && target.nodeType && target !== document) {
        if (queryCls && DomTools.hasClass(target, queryCls)) {
          targetElem = target;
        } else if (target === container) {
          return {
            flag: queryCls ? !!targetElem : true,
            container: container,
            targetElem: targetElem
          };
        } else if (findPopper && target.getAttribute('x-placement')) {
          popper = target;
        }

        target = target.parentNode;
      }

      if (popper && VueUtil.get(popper, 'editor.$parent.$el')) {
        return getEventTargetNode({target: popper.editor.$parent.$el}, container);
      }

      return {
        flag: false
      };
    },

    /**
     * 获取元素相对于 document 的位置
     */
    getOffsetPos: function getOffsetPos(elem, container) {
      return getNodeOffset(elem, container, {
        left: 0,
        top: 0
      });
    },
    getAbsolutePos: function getAbsolutePos(elem) {
      var bounding = elem.getBoundingClientRect();

      var _DomTools$getDomNode = DomTools.getDomNode(),
          scrollTop = _DomTools$getDomNode.scrollTop,
          scrollLeft = _DomTools$getDomNode.scrollLeft;

      return {
        top: scrollTop + bounding.top,
        left: scrollLeft + bounding.left
      };
    },

    /**
     * 获取单元格节点索引
     */
    getCellNodeIndex: function getCellNodeIndex(cell, fullColumnIdData) {
      var trElem = cell.parentNode;

      var columnIndex = fullColumnIdData ? fullColumnIdData[cell.dataset.colid].index : VueUtil.arrayIndexOfVal(trElem.children, cell);
      var rowIndex = VueUtil.arrayIndexOfVal(trElem.parentNode.children, trElem);
      return {
        columnIndex: columnIndex,
        rowIndex: rowIndex
      };
    },

    getCellById: function (row, id) {
      var cell = [].filter.call(row.children, function(el) {
        return el.dataset.colid === id;
      });
      
      return VueUtil.get(cell,0);
    },

    /**
     * 获取选中单元格矩阵范围
     */
    getRowNodes: function getRowNodes(trList, cellNode, targetCellNode) {
      var startColIndex = cellNode.columnIndex;
      var startRowIndex = cellNode.rowIndex;
      var targetColIndex = targetCellNode.columnIndex;
      var targetRowIndex = targetCellNode.rowIndex;
      var rows = [];

      for (var rowIndex = Math.min(startRowIndex, targetRowIndex), rowLen = Math.max(startRowIndex, targetRowIndex); rowIndex <= rowLen; rowIndex++) {
        var cells = [];
        var trElem = trList[rowIndex];

        for (var colIndex = Math.min(startColIndex, targetColIndex), colLen = Math.max(startColIndex, targetColIndex); colIndex <= colLen; colIndex++) {
          var tdElem = trElem.children[colIndex];
          cells.push(tdElem);
        }

        rows.push(cells);
      }

      return rows;
    },
    getCellIndexs: function getCellIndexs(cell) {
      var trElem = cell.parentNode;
      var rowid = trElem.getAttribute('data-rowid');
      var columnIndex = [].indexOf.call(trElem.children, cell);
      var rowIndex = [].indexOf.call(trElem.parentNode.children, trElem);
      return {
        rowid: rowid,
        rowIndex: rowIndex,
        columnIndex: columnIndex
      };
    },
    getCell: function getCell($table, params) {
      var row = params.row,
          column = params.column;
      var rowid = UtilTools.getRowid($table, row);

      var bodyElem = $table.$refs[''.concat(column.fixed || 'table', 'Body')];
      var tableEl = (bodyElem || $table.$refs.tableBody).$el;
      var cell = tableEl.querySelector('.vue-xtable-body--row[data-rowid="'.concat(rowid, '"] .').concat(column.id));

      // rowspan colspan等情况下取不到被隐藏掉的cell
      if(!cell) {
        cell = this.getTableSpanCell($table, params);
      } else {
        params.offset = undefined;
      }
      return cell;
    },

    getTableSpanCell: function($table, params) {
      var column = params.column;
      var bodyElem = $table.$refs[''.concat(column.fixed || 'table', 'Body')];
      var tableEl = (bodyElem || $table.$refs.tableBody).$el;
      var table = tableEl.querySelector('table');
      var rowIndex = $table.getRowIndex(params.row);
      var columnIndex = $table.getColumnIndex(params.column);

      var range = 30;
      var tableDefine = [];
      var cell;

      var startIndexRow = $table.scrollYStore.startIndex || 0;
      var startIndexCol = $table.scrollXStore.startIndex || 0;

      for (var t = 0; t < table.rows.length; t++) tableDefine[t] = [];

      for (var tempRowIndex = 0; tempRowIndex < table.rows.length; tempRowIndex++) {
          if (rowIndex - tempRowIndex - startIndexRow > range) continue;
          if (tempRowIndex > rowIndex) break;
          var offset = 0;

          for (var tempColIndex = 0; tempColIndex < table.rows[tempRowIndex].cells.length; tempColIndex++) {
            while (tableDefine[tempRowIndex][tempColIndex + offset]) offset++;
            if (columnIndex - tempColIndex - startIndexCol > range) continue;
            if (tempColIndex + offset > columnIndex) break;

              cell = table.rows[tempRowIndex].cells[tempColIndex];

              var rowSpans = parseInt(cell.getAttribute('rowspan') || 1);
              var colSpans = parseInt(cell.getAttribute('colspan') || 1);

              for (var rowSpan = 0; rowSpan < rowSpans; rowSpan++) {
                  for (var colSpan = 0; colSpan < colSpans; colSpan++) {
                      if (tempRowIndex + rowSpan < table.rows.length) tableDefine[tempRowIndex + rowSpan][tempColIndex + offset + colSpan] = [tempRowIndex, tempColIndex];
                  }
              }
          }
      }

      try {
        var spanCellXY = tableDefine[rowIndex - startIndexRow][columnIndex - startIndexCol];
        var domRow = table.rows[spanCellXY[0]];
        var domCell = domRow.cells[spanCellXY[1]];
        var rowId = domRow.dataset.rowid;
        var row = $table.getRowById(rowId);
        var column = $table.fullColumnIdData[domCell.dataset.colid].column;
        var newRowIndex = $table.getRowIndex(row);
        var newColumnIndex = $table.getColumnIndex(column);

        params.offset = [params.row, params.column];

        params.row = row;
        params.column = column;
        params.rowIndex = newRowIndex;
        params.columnIndex = newColumnIndex;

      } catch (error) {
        return null;
      }

      return domCell;
    },
    toView: function toView(elem) {
      var scrollIntoViewIfNeeded = 'scrollIntoViewIfNeeded';
      var scrollIntoView = 'scrollIntoView';

      if (elem) {
        if (elem[scrollIntoViewIfNeeded]) {
          elem[scrollIntoViewIfNeeded]();
        } else if (elem[scrollIntoView]) {
          elem[scrollIntoView]();
        }
      }
    }
  };

  function getNodeOffset(elem, container, rest) {
    if (elem) {
      var parentElem = elem.parentNode;
      rest.top += elem.offsetTop;
      rest.left += elem.offsetLeft;

      if (parentElem && parentElem !== htmlElem && parentElem !== bodyElem) {
        rest.top -= parentElem.scrollTop;
        rest.left -= parentElem.scrollLeft;
      }

      if (container && (elem === container || elem.offsetParent === container) ? 0 : elem.offsetParent) {
        return getNodeOffset(elem.offsetParent, container, rest);
      }
    }

    return rest;
  }

  // events.js
  // 监听全局事件
  var wheelName = /Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel';
  var eventStore = [];
  var GlobalEvent = {
    on: function on(comp, type, cb) {
      if (cb) {
        eventStore.push({
          comp: comp,
          type: type,
          cb: cb
        });
      }
    },
    off: function off(comp, type) {
      VueUtil.remove(eventStore, function (item) {
        return item.comp === comp && item.type === type;
      });
    },
    trigger: function trigger(evnt) {
      eventStore.forEach(function (_ref) {
        var comp = _ref.comp,
            type = _ref.type,
            cb = _ref.cb;

        if (type === evnt.type || type === 'mousewheel' && evnt.type === wheelName) {
          cb.call(comp, evnt);
        }
      });
    }
  };
  document.addEventListener('keydown', GlobalEvent.trigger, false);
  document.addEventListener('contextmenu', GlobalEvent.trigger, false);
  document.addEventListener('paste', GlobalEvent.trigger, false);
  window.addEventListener('mousedown', GlobalEvent.trigger, false);
  window.addEventListener('blur', GlobalEvent.trigger, false);

  window.addEventListener(wheelName, GlobalEvent.trigger, false);

  //utils.js
  

  // babel创建的特殊函数，统一定义在此处
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
  
  var columnUniqueId = 0;

  var ColumnConfig =
  /*#__PURE__*/
  function () {
    function ColumnConfig(_vm) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          renderHeader = _ref.renderHeader,
          renderCell = _ref.renderCell,
          renderData = _ref.renderData;

      _classCallCheck(this, ColumnConfig);

      if (_vm.cellRender && _vm.editRender) {
        UtilTools.warn('vue.xtable.error.cellEditRender');
      }

      if (_vm.type === 'selection') {
        UtilTools.warn('vue.xtable.error.delProp', ['selection', 'checkbox']);
      }

      VueUtil.assign(this, {
        // 基本属性
        id: 'col_'.concat(++columnUniqueId),
        type: _vm.type,
        prop: _vm.prop,
        property: _vm.field || _vm.prop,
        title: _vm.title,
        label: _vm.label,
        width: _vm.width,
        minWidth: _vm.minWidth,
        resizable: _vm.resizable,
        fixed: _vm.fixed,
        align: _vm.align,
        headerAlign: _vm.headerAlign,
        footerAlign: _vm.footerAlign,
        showOverflow: _vm.showOverflow,
        showHeaderOverflow: _vm.showHeaderOverflow,
        className: _vm.class || _vm.className,
        headerClassName: _vm.headerClassName,
        footerClassName: _vm.footerClassName,
        indexMethod: _vm.indexMethod,
        formatter: _vm.formatter,
        sortable: _vm.sortable,
        sortBy: _vm.sortBy,
        sortMethod: _vm.sortMethod,
        remoteSort: _vm.remoteSort,
        filters: UtilTools.getFilters(_vm.filters),
        filterMultiple: VueUtil.isBoolean(_vm.filterMultiple) ? _vm.filterMultiple : true,
        filterMethod: _vm.filterMethod,
        filterRender: _vm.filterRender,
        copyFormatter: _vm.copyFormatter,
        formatterKey: _vm.formatterKey,
        pasteFormatter: _vm.pasteFormatter,
        treeNode: _vm.treeNode,
        cellRender: _vm.cellRender,
        editRender: _vm.editRender,
        // 自定义参数
        checked: false,
        params: _vm.params,
        // 渲染属性
        visible: _vm.visible === false ? false : true,
        level: 1,
        rowSpan: 1,
        colSpan: 1,
        order: null,
        renderWidth: 0,
        renderHeight: 0,
        resizeWidth: 0,
        renderLeft: 0,
        model: {},
        renderHeader: renderHeader || _vm.renderHeader,
        renderCell: renderCell || _vm.renderCell,
        renderData: renderData,
        // 单元格插槽，只对 grid 有效
        slots: _vm.slots,
        own: _vm,
        excelExportConfig: _vm.excelExportConfig
      });
    }

    _createClass(ColumnConfig, [{
      key: 'getTitle',
      value: function getTitle() {
        // 在 v3.0 中废弃 label
        return UtilTools.getFuncText(this.own.title || this.own.label || (this.type === 'index' ? GlobalConfig.i18n('vue.xtable.column.indexTitle') : ''));
      }
    }, {
      key: 'update',
      value: function update(name, value) {
        // 不支持双向的属性
        if (!VueUtil.includes(['filters'], name)) {
          if (name == 'field') {
            this[name] = value;
            this['property'] = value;
            return;
          }
          this[name] = value;
        }
      }
    }]);

    return ColumnConfig;
  }();

  function outLog(type) {
    return function (message, params) {
      var msg = UtilTools.getLog(message, params);
      console[type](msg);
      return msg;
    };
  }

  var UtilTools = {
    warn: outLog('warn'),
    error: outLog('error'),
    getLog: function getLog(message, params) {
      return '[vue-xtable] '.concat(Vue.t(message, params));
    },
    getSize: function getSize(_ref2) {
      var size = _ref2.size,
          $parent = _ref2.$parent;
      return size || ($parent && ['medium', 'small', 'mini'].indexOf($parent.size) > -1 ? $parent.size : null);
    },
    getFuncText: function getFuncText(content) {
      return VueUtil.isFunction(content) ? content() : GlobalConfig.translate ? GlobalConfig.translate(content) : content;
    },
    nextZIndex: function nextZIndex($table) {
      if ($table && $table.zIndex) {
        return $table.zIndex;
      }
      return VueUtil.nextZIndex();
    },
    getLastZIndex: function getLastZIndex() {
      return VueUtil.component.popupManager.zIndex;
    },
    // 行主键 key
    getRowkey: function getRowkey($table) {
      return $table.rowId;
    },
    // 行主键 value
    getRowid: function getRowid($table, row) {
      var rowId = VueUtil.get(row, UtilTools.getRowkey($table));
      return rowId ? encodeURIComponent(rowId) : '';
    },
    // 触发事件
    emitEvent: function emitEvent(_vm, type, args) {
      if (_vm.$listeners[type]) {
        _vm.$emit.apply(_vm, [type].concat(args));
      }
    },
    // 获取所有的列，排除分组
    getColumnList: function getColumnList(columns) {
      var result = [];
      columns.forEach(function (column) {
        result.push.apply(result, column.children && column.children.length ? UtilTools.getColumnList(column.children) : [column]);
      });
      return result;
    },
    getClass: function getClass(property, params) {
      return property ? VueUtil.isFunction(property) ? property(params) : property : '';
    },
    getFilters: function getFilters(filters) {
      return (filters || []).map(function (_ref3) {
        var label = _ref3.label,
            value = _ref3.value,
            data = _ref3.data,
            checked = _ref3.checked;
        return {
          label: label,
          value: value,
          data: data,
          _data: data,
          checked: !!checked
        };
      });
    },
    formatText: function formatText(value, placeholder) {
      return '' + (value === null || value === void 0 ? placeholder ? GlobalConfig.emptyCell : '' : value);
    },
    getCellValue: function getCellValue(row, column) {
      return VueUtil.get(row, column.property);
    },
    getCellLabel: function getCellLabel(row, column, params) {
      var formatter = column.formatter;
      var cellValue = UtilTools.getCellValue(row, column);
      var cellLabel = cellValue;

      if (params && formatter) {
        var rest, formatData;
        var $table = params.$table;
        var colid = column.id;
        var formatterKey = column.formatterKey;
        var cacheFormat = $table && $table.fullAllDataRowMap.has(row);

        if (cacheFormat) {
          rest = $table.fullAllDataRowMap.get(row);
          formatData = rest.formatData;

          if (!formatData) {
            formatData = $table.fullAllDataRowMap.get(row).formatData = {};
          }
        }

        var formatterKeyResult;

        if (typeof formatterKey == 'function') {
          formatterKeyResult = formatterKey(row, column, params);
        } else if (VueUtil.isArray(formatterKey)) {
          formatterKeyResult = VueUtil.reduce(formatterKey, function(result, field) {
            return result + '=%=' + row[field];
          }, '');
        } else if (typeof formatterKey == 'string') {
          formatterKeyResult = row[formatterKey];
        }

        if (rest && formatData[colid]) {
          if (formatData[colid].value === cellValue && formatData[colid].formatterKey === formatterKeyResult) {
            return formatData[colid].label;
          }
        }
        if (VueUtil.isString(formatter)) {
          cellLabel = VueUtil.get(VueUtil, formatter)(cellValue);
        } else if (VueUtil.isArray(formatter)) {
          cellLabel = VueUtil.get(VueUtil, formatter[0]).apply(VueUtil, [cellValue].concat(formatter.slice(1)));
        } else {
          cellLabel = formatter(VueUtil.assign({
            cellValue: cellValue
          }, params));
        }

        if (formatData) {
          formatData[colid] = {
            value: cellValue,
            label: cellLabel,
            formatterKey: formatterKeyResult,
          };
        }
      }

      return cellLabel;
    },
    setCellValue: function setCellValue(row, column, value, table) {

      // 如果table不为空，尝试触发change事件
      if (table) {
        oldVal = VueUtil.get(row, column.property);
        if (oldVal != value) {
          table.$emit('cell-change', row, column.property, value, oldVal);
        }
      }
      return VueUtil.set(row, column.property, value);
    },
    getColumnConfig: function getColumnConfig(_vm, options) {
      return _vm instanceof ColumnConfig ? _vm : new ColumnConfig(_vm, options);
    },
    // 组装列配置
    assemColumn: function assemColumn(_vm) {
      var $table = _vm.$table,
          $column = _vm.$column,
          columnConfig = _vm.columnConfig;
      var groupConfig = $column ? $column.columnConfig : null;
      columnConfig.slots = _vm.$scopedSlots;

      if (groupConfig && $column.$children.length > 0) {
        if (!groupConfig.children) {
          groupConfig.children = [];
        }

        groupConfig.children.splice([].indexOf.call($column.$el.children, _vm.$el), 0, columnConfig);
      } else {
        $table.collectColumn.splice([].indexOf.call($table.$refs.hideColumn.children, _vm.$el), 0, columnConfig);
      }
    },
    // 销毁列
    destroyColumn: function destroyColumn(_vm) {
      var $table = _vm.$table,
          columnConfig = _vm.columnConfig;
      var matchObj = VueUtil.findTree($table.collectColumn, function (column) {
        return column === columnConfig;
      });

      if (matchObj) {
        matchObj.items.splice(matchObj.index, 1);
      }
    },
    hasChildrenList: function hasChildrenList(item) {
      return item && item.children && item.children.length > 0;
    },
    parseFile: function parseFile(file) {
      var name = file.name;
      var tIndex = name.lastIndexOf('.');
      var type = name.substring(tIndex + 1, name.length);
      var filename = name.substring(0, tIndex);
      return {
        filename: filename,
        type: type
      };
    },
    defineProperties: _defineProperties,
    defineProperty: _defineProperty,
    createClass: _createClass,
    classCallCheck: _classCallCheck
    
  };

  return {
    DomTools: DomTools,
    GlobalEvent: GlobalEvent,
    UtilTools: UtilTools
  };
});