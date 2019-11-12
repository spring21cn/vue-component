(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueXtable = definition(context.baseTable, context.tools, context.cell);
  }
})(this, function(baseTable, tools, cell) {
  // 多列排序方法 github.com/Teun/thenBy.js
  var firstBy = (function () {
    function identity(v) { return v; }

    function ignoreCase(v) { return typeof (v) === 'string' ? v.toLowerCase() : v; }

    function makeCompareFunction(f, opt) {
      opt = typeof (opt) === 'number' ? { direction: opt } : opt || {};
      if (typeof (f) != 'function') {
        var prop = f;
        // make unary function
        f = function (v1) { return v1[prop] ? v1[prop] : ''; };
      }
      if (f.length === 1) {
        // f is a unary function mapping a single item to its sort score
        var uf = f;
        var preprocess = opt.ignoreCase ? ignoreCase : identity;
        var cmp = opt.cmp || function (v1, v2) { return v1 < v2 ? -1 : v1 > v2 ? 1 : 0; };
        f = function (v1, v2) { return cmp(preprocess(uf(v1)), preprocess(uf(v2))); };
      }
      if (opt.direction === -1) return function (v1, v2) { return -f(v1, v2); };
      return f;
    }

    function tb(func, opt) {
      var x = (typeof (this) == 'function' && !this.firstBy) ? this : false;
      var y = makeCompareFunction(func, opt);
      var f = x ? function (a, b) {
        return x(a, b) || y(a, b);
      }
        : y;
      f.thenBy = tb;
      return f;
    }
    tb.firstBy = tb;
    return tb;
  })();
  
  // methods.js
  var mod = {};
  (function() {
    var rowUniqueId = 0;
    var isWebkit = !!document.documentElement['webkitMatchesSelector'] && !VueUtil.isEdge;
    var debounceScrollYDuration = VueUtil.isIE ? 40 : 20; // 分组表头的属性
    
    var headerProps = {
      children: 'children'
    };
    /**
     * 生成行的唯一主键
     */
    
    function getRowUniqueId() {
      return 'row_'.concat(++rowUniqueId);
    }
    
    function isTargetRadioOrCheckbox(evnt, column, colType, targetType) {
      var target = evnt.target;
      return target && column.type === colType && target.tagName.toLowerCase() === 'input' && target.type === (targetType || colType);
    }
    
    var Methods = {
      /**
       * 获取父容器元素
       */
      getParentElem: function getParentElem() {
        return this.$grid ? this.$grid.$el.parentNode : this.$el.parentNode;
      },
    
      /**
       * 获取父容器的高度
       */
      getParentHeight: function getParentHeight() {
        return this.$grid ? this.$grid.getParentHeight() : this.getParentElem().clientHeight;
      },
    
      /**
       * 获取需要排除的高度
       * 但渲染表格高度时，需要排除工具栏或分页等相关组件的高度
       * 如果存在表尾合计滚动条，则需要排除滚动条高度
       */
      getExcludeHeight: function getExcludeHeight() {
        return this.$grid ? this.$grid.getExcludeHeight() : 0;
      },
    
      /**
       * 重置表格的一切数据状态
       */
      clearAll: function clearAll() {
        this.clearSort();
        this.clearCurrentRow();
        this.clearCurrentColumn();
        this.clearSelection();
        this.clearRowExpand();
        this.clearTreeExpand();
        this.clearActived();
    
        if (baseTable._filter) {
          this.clearFilter();
        }
    
        if (this.keyboardConfig || this.mouseConfig) {
          this.clearIndexChecked();
          this.clearHeaderChecked();
          this.clearChecked();
          this.clearSelected();
          this.clearCopyed();
        }
    
        return this.clearScroll();
      },
    
      /**
       * 同步刷新 data 数据
       * 如果用了该方法，那么组件将不再记录增删改的状态，只能自行实现对应逻辑
       * 对于某些特殊的场景，比如深层树节点元素发生变动时可能会用到
       */
      refreshData: function refreshData() {
        var _this = this;
    
        return this.$nextTick().then(function () {
          _this.tableData = [];
          return _this.$nextTick().then(function () {
            return _this.loadTableData(_this.tableFullData);
          });
        });
      },
    
      /**
       * 手动处理数据
       * 对于手动更改了排序、筛选...等条件后需要重新处理数据时可能会用到
       */
      updateData: function updateData() {
        return this.handleTableData(true).then(this.updateFooter).then(this.recalculate);
      },
      handleTableData: function handleTableData(force) {
        if (this.keyboardConfig || this.mouseConfig) {
          this.clearIndexChecked();
          this.clearHeaderChecked();
          this.clearChecked();
          this.clearCopyed();
        }
        
        var scrollYLoad = this.scrollYLoad,
            scrollYStore = this.scrollYStore;
        var fullData = force ? this.updateAfterFullData() : this.afterFullData;
        this.tableData = scrollYLoad ? fullData.slice(scrollYStore.startIndex, scrollYStore.startIndex + scrollYStore.renderSize) : fullData.slice(0);
        return this.$nextTick();
      },
    
      /**
       * 加载表格数据
       * @param {Array} datas 数据
       * @param {Boolean} notRefresh 是否不重新运算列宽
       */
      loadTableData: function loadTableData(datas, notRefresh) {
        var _this2 = this;
    
        var height = this.height,
            maxHeight = this.maxHeight,
            showOverflow = this.showOverflow,
            treeConfig = this.treeConfig,
            editStore = this.editStore,
            optimizeOpts = this.optimizeOpts,
            scrollYStore = this.scrollYStore;
        var scrollY = optimizeOpts.scrollY;
        var tableFullData = datas ? datas.slice(0) : [];
        var scrollYLoad = !treeConfig && scrollY && scrollY.gt && scrollY.gt < tableFullData.length;
        scrollYStore.startIndex = 0;
        scrollYStore.visibleIndex = 0;
        editStore.insertList = [];
        editStore.removeList = []; // 全量数据
    
        this.tableFullData = tableFullData; // 缓存数据
    
        this.updateCache(true); // 原始数据
    
        this.tableSynchData = datas;
        this.tableSourceData = VueUtil.cloneDeep(tableFullData);
        this.scrollYLoad = scrollYLoad;
    
        if (scrollYLoad && !(height || maxHeight)) {
          tools.UtilTools.error('vue.xtable.error.scrollYReqProp', ['height | max-height']);
        }
    
        if (scrollYLoad && !showOverflow) {
          tools.UtilTools.warn('vue.xtable.error.scrollYReqProp', ['show-overflow']);
        }
    
        var rest = Promise.resolve();
    
        if (scrollYLoad) {
          rest = this.computeScrollLoad();
        }
    
        return rest.then(function () {
          // 是否加载了数据
          _this2.isLoadData = true;
    
          _this2.handleTableData(true);
    
          _this2.reserveCheckSelection();
    
          _this2.checkSelectionStatus();
    
          rest = _this2.$nextTick();
    
          if (!notRefresh) {
            rest = rest.then(_this2.recalculate);
          }
    
          return rest.then(_this2.refreshScroll);
        });
      },
    
      /**
       * 重新加载数据，不会清空表格状态
       * @param {Array} datas 数据
       */
      loadData: function loadData(datas) {
        return this.loadTableData(datas).then(this.recalculate);
      },
    
      /**
       * 重新加载数据，会清空表格状态
       * @param {Array} datas 数据
       */
      reloadData: function reloadData(datas) {
        var _this3 = this;
    
        return this.clearAll().then(function () {
          return _this3.loadTableData(datas);
        }).then(this.handleDefault);
      },
    
      /**
       * 局部加载行数据并恢复到初始状态
       * 对于行数据需要局部更改的场景中可能会用到
       * @param {Row} row 行对象
       * @param {Object} record 新数据
       * @param {String} field 字段名
       */
      reloadRow: function reloadRow(row, record, field) {
        var tableSourceData = this.tableSourceData,
            tableData = this.tableData;
        var rowIndex = this.getRowIndex(row);
        var oRow = tableSourceData[rowIndex];
    
        if (oRow && row) {
          if (field) {
            VueUtil.set(oRow, field, VueUtil.get(record || row, field));
          } else {
            if (record) {
              tableSourceData[rowIndex] = record;

              VueUtil.forEach(row, function(val,key) {
                row[key] = undefined;
              });
              
              VueUtil.assign(row, this.defineField(VueUtil.assign({}, record)));
              this.updateCache(true);
            } else {
              VueUtil.destructuring(oRow, VueUtil.cloneDeep(row));
            }
          }
        }
    
        this.tableData = tableData.slice(0);
        return this.$nextTick();
      },
    
      /**
       * 加载列配置
       * 对于表格列需要重载、局部递增场景下可能会用到
       * @param {ColumnConfig} columns 列配置
       */
      loadColumn: function loadColumn(columns) {
        var _this4 = this;

        this.collectColumn = VueUtil.mapTree(columns, function (column) {
          return cell.createColumn(_this4, column);
        }, headerProps);
        return this.$nextTick();
      },
    
      /**
       * 加载列配置并恢复到初始状态
       * 对于表格列需要重载、局部递增场景下可能会用到
       * @param {ColumnConfig} columns 列配置
       */
      reloadColumn: function reloadColumn(columns) {
        this.clearAll();
        return this.loadColumn(columns);
      },
    
      /**
       * 更新数据行的 Map
       * 牺牲数据组装的耗时，用来换取使用过程中的流畅
       */
      updateCache: function updateCache(source) {
        var _this5 = this;
    
        var treeConfig = this.treeConfig,
            tableFullData = this.tableFullData,
            fullDataRowIdData = this.fullDataRowIdData,
            fullDataRowMap = this.fullDataRowMap,
            fullAllDataRowMap = this.fullAllDataRowMap,
            fullAllDataRowIdData = this.fullAllDataRowIdData;
    
        var rowkey = tools.UtilTools.getRowkey(this);
    
        var handleCache = function handleCache(row, index) {
          var rowid = tools.UtilTools.getRowid(_this5, row);
    
          if (!rowid) {
            rowid = getRowUniqueId();
            VueUtil.set(row, rowkey, rowid);
          }
    
          var rest = {
            row: row,
            rowid: rowid,
            index: index
          };
    
          if (source) {
            fullDataRowIdData[rowid] = rest;
            fullDataRowMap.set(row, rest);
          }
    
          fullAllDataRowIdData[rowid] = rest;
          fullAllDataRowMap.set(row, rest);
        };
    
        if (source) {
          fullDataRowIdData = this.fullDataRowIdData = {};
          fullDataRowMap.clear();
        }
    
        fullAllDataRowIdData = this.fullAllDataRowIdData = {};
        fullAllDataRowMap.clear();
    
        if (treeConfig) {
          VueUtil.eachTree(tableFullData, handleCache, treeConfig);
        } else {
          tableFullData.forEach(handleCache);
        }
      },
    
      /**
       * 更新数据列的 Map
       * 牺牲数据组装的耗时，用来换取使用过程中的流畅
       */
      cacheColumnMap: function cacheColumnMap() {
        var tableFullColumn = this.tableFullColumn,
            fullColumnMap = this.fullColumnMap;
        var fullColumnIdData = this.fullColumnIdData = {};
        fullColumnMap.clear();
        tableFullColumn.forEach(function (column, index) {
          var rest = {
            column: column,
            colid: column.id,
            index: index
          };
          fullColumnIdData[column.id] = rest;
          fullColumnMap.set(column, rest);
        });
      },
    
      /**
       * 根据 tr 元素获取对应的 row 信息
       * @param {Element} tr 元素
       */
      getRowNode: function getRowNode(tr) {
        var _this6 = this;
    
        if (tr) {
          var treeConfig = this.treeConfig,
              tableFullData = this.tableFullData,
              fullAllDataRowIdData = this.fullAllDataRowIdData;
          var rowid = tr.getAttribute('data-rowid');
    
          if (treeConfig) {
            var matchObj = VueUtil.findTree(tableFullData, function (row) {
              return tools.UtilTools.getRowid(_this6, row) === rowid;
            }, treeConfig);
    
            if (matchObj) {
              return matchObj;
            }
          } else {
            if (fullAllDataRowIdData[rowid]) {
              var rest = fullAllDataRowIdData[rowid];
              return {
                item: rest.row,
                index: rest.index,
                items: tableFullData
              };
            }
          }
        }
    
        return null;
      },
    
      /**
       * 根据 th/td 元素获取对应的 column 信息
       * @param {Element} cell 元素
       */
      getColumnNode: function getColumnNode(cell) {
        if (cell) {
          var isGroup = this.isGroup,
              fullColumnIdData = this.fullColumnIdData,
              tableFullColumn = this.tableFullColumn;
          var colid = cell.getAttribute('data-colid');
    
          if (isGroup) {
            var matchObj = VueUtil.findTree(tableFullColumn, function (column) {
              return column.id === colid;
            }, headerProps);
    
            if (matchObj) {
              return matchObj;
            }
          } else {
            var _fullColumnIdData$col = fullColumnIdData[colid],
                column = _fullColumnIdData$col.column,
                index = _fullColumnIdData$col.index;
            return {
              item: column,
              index: index,
              items: tableFullColumn
            };
          }
        }
    
        return null;
      },
    
      /**
       * 根据 row 获取相对于 data 中的索引
       * @param {Row} row 行对象
       */
      getRowIndex: function getRowIndex(row) {
        return this.fullDataRowMap.has(row) ? this.fullDataRowMap.get(row).index : -1;
      },
    
      /**
       * 根据 column 获取相对于 columns 中的索引
       * @param {ColumnConfig} column 列配置
       */
      getColumnIndex: function getColumnIndex(column) {
        return this.fullColumnMap.has(column) ? this.fullColumnMap.get(column).index : -1;
      },
    
      /**
       * 判断是否为索引列
       * @param {ColumnConfig} column 列配置
       */
      hasIndexColumn: function hasIndexColumn(column) {
        return column && column.type === 'index';
      },
    
      /**
       * 定义行数据中的列属性，如果不存在则定义
       * @param {Row} row 行数据
       */
      defineField: function defineField(row) {
        var rowkey = tools.UtilTools.getRowkey(this);
    
        this.visibleColumn.forEach(function (_ref) {
          var property = _ref.property,
              editRender = _ref.editRender;
    
          function setDefaultByOne(propertyItem){
              if (propertyItem && !VueUtil.hasIn(row, propertyItem)) {
                VueUtil.set(row, propertyItem, editRender && !VueUtil.isUndefined(editRender.defaultValue) ? editRender.defaultValue : null);
              }
          }
          if(VueUtil.isArray(property)){
             property.forEach(function(item){
                  setDefaultByOne(item);
              });
          }else{
              setDefaultByOne(property);
          }
        }); // 必须有行数据的唯一主键，可以自行设置；也可以默认生成一个随机数
    
        if (!VueUtil.get(row, rowkey)) {
          VueUtil.set(row, rowkey, getRowUniqueId());
        }
    
        return row;
      },
    
      /**
       * 创建 data 对象
       * 对于某些特殊场景可能会用到，会自动对数据的字段名进行检测，如果不存在就自动定义
       * @param {Array} records 新数据
       */
      createData: function createData(records) {
        var _this7 = this;
    
        return this.$nextTick().then(function () {
          return records.map(_this7.defineField);
        });
      },
    
      /**
       * 创建 Row|Rows 对象
       * 对于某些特殊场景需要对数据进行手动插入时可能会用到
       * @param {Array/Object} records 新数据
       */
      createRow: function createRow(records) {
        var _this8 = this;
    
        var isArr = VueUtil.isArray(records);
    
        if (!isArr) {
          records = [records];
        }
    
        return this.$nextTick().then(function () {
          var rows = records.map(function (record) {
            return _this8.defineField(VueUtil.assign({}, record));
          });
          return isArr ? rows : rows[0];
        });
      },
    
      /**
       * 清空单元格内容
       * 如果不创参数，则清空整个表格内容
       * 如果传 row 则清空一行内容
       * 如果传 rows 则清空多行内容
       * 如果还额外传了 field 则清空指定单元格内容
       * @param {Array/Row} rows 行数据
       * @param {String} field 字段名
       */
      clearData: function clearData(rows, field) {
        var tableFullData = this.tableFullData,
            visibleColumn = this.visibleColumn;
    
        if (!arguments.length) {
          rows = tableFullData;
        } else if (rows && !VueUtil.isArray(rows)) {
          rows = [rows];
        }
    
        if (field) {
          rows.forEach(function (row) {
            return VueUtil.set(row, field, null);
          });
        } else {
          rows.forEach(function (row) {
            visibleColumn.forEach(function (column) {
              if (column.property) {
                tools.UtilTools.setCellValue(row, column, null);
              }
            });
          });
        }
    
        return this.$nextTick();
      },
    
      /**
       * 检查是否为临时行数据
       * @param {Row} row 行对象
       */
      isInsertByRow: function isInsertByRow(row) {
        return this.editStore.insertList.indexOf(row) > -1;
      },
      // 在 v3.0 中废弃 hasRowChange
      hasRowChange: function hasRowChange(row, field) {
        tools.UtilTools.warn('vue.xtable.error.delFunc', ['hasRowChange', 'isUpdateByRow']);
    
        return this.isUpdateByRow(row, field);
      },
    
      /**
       * 检查行或列数据是否发生改变
       * @param {Row} row 行对象
       * @param {String} field 字段名
       */
      isUpdateByRow: function isUpdateByRow(row, field) {
        var _this9 = this;
    
        var oRow, property;
        var visibleColumn = this.visibleColumn,
            treeConfig = this.treeConfig,
            tableSourceData = this.tableSourceData,
            fullDataRowIdData = this.fullDataRowIdData;
    
        var rowid = tools.UtilTools.getRowid(this, row); // 新增的数据不需要检测
    
    
        if (!fullDataRowIdData[rowid]) {
          return false;
        }
    
        if (treeConfig) {
          var children = treeConfig.children;
          var matchObj = VueUtil.findTree(tableSourceData, function (item) {
            return rowid === tools.UtilTools.getRowid(_this9, item);
          }, treeConfig);
          row = VueUtil.assign({}, row, tools.UtilTools.defineProperty({}, children, null));
    
          if (matchObj) {
            oRow = VueUtil.assign({}, matchObj.item, tools.UtilTools.defineProperty({}, children, null));
          }
        } else {
          var oRowIndex = fullDataRowIdData[rowid].index;
          oRow = tableSourceData[oRowIndex];
        }
    
        if (oRow) {
		  function isEqualsByListOrOne(obj,cb){
			  if(VueUtil.isArray(obj)){
				return obj.some(function(item){
					if(cb(item)){
						 return true;
					 }
				});
			  }else{
				return cb(obj);
			  }
		  }
          if (arguments.length > 1) {
            function isEqualByOne(item){
				 return !VueUtil.isEqual(VueUtil.get(oRow, item), VueUtil.get(row, item));
			 }
			 return isEqualsByListOrOne(field,isEqualByOne);
          }
    
          for (var index = 0, len = visibleColumn.length; index < len; index++) {
            property = visibleColumn[index].property;
            function isEqualByOne(item){
				if (property && !VueUtil.isEqual(VueUtil.get(oRow, item), VueUtil.get(row, item))) {
					return true;
				}
			}
			if(isEqualsByListOrOne(property,isEqualByOne)){
				return true;
			}
          }
        }
    
        return false;
      },
    
      /**
       * 获取表格的可视列，也可以指定索引获取列
       * @param {Number} columnIndex 索引
       */
      getColumns: function getColumns(columnIndex) {
        var columns = this.visibleColumn;
        return arguments.length ? columns[columnIndex] : columns.slice(0);
      },
    
      /**
       * 根据列的唯一主键获取列
       * @param {String} colid 列主键
       */
      getColumnById: function getColumnById(colid) {
        var fullColumnIdData = this.fullColumnIdData;
        return fullColumnIdData[colid] ? fullColumnIdData[colid].column : null;
      },
    
      /**
       * 根据列的字段名获取列
       * @param {String} field 字段名
       */
      getColumnByField: function getColumnByField(field) {
        var isArrayField = VueUtil.isArray(field);

        return VueUtil.find(this.visibleColumn, function (column) {
          return isArrayField ? VueUtil.isEqual(column.property, field) : column.property === field;
        });
      },
    
      /**
       * 获取当前表格的列
       * 完整的全量表头列、处理条件之后的全量表头列、当前渲染中的表头列
       */
      getTableColumn: function getTableColumn() {
        return {
          fullColumn: this.tableFullColumn.slice(0),
          visibleColumn: this.visibleColumn.slice(0),
          tableColumn: this.tableColumn.slice(0)
        };
      },
      // 在 v3.0 中废弃 getRecords
      getRecords: function getRecords() {
        tools.UtilTools.warn('vue.xtable.error.delFunc', ['getRecords', 'getData']);
    
        return this.getData.apply(this, arguments);
      },
    
      /**
       * 获取数据，和 data 的行为一致，也可以指定索引获取数据
       */
      getData: function getData(rowIndex) {
        var tableSynchData = this.data || this.tableSynchData;
        return arguments.length ? tableSynchData[rowIndex] : tableSynchData.slice(0);
      },
      // 在 v3.0 中废弃 getAllRecords
      getAllRecords: function getAllRecords() {
        tools.UtilTools.warn('vue.xtable.error.delFunc', ['getAllRecords', 'getRecordset']);
    
        return this.getRecordset();
      },
    
      /**
       * 用于多选行，获取已选中的数据
       */
      getSelectRecords: function getSelectRecords() {
        var tableFullData = this.tableFullData,
            treeConfig = this.treeConfig; // 在 v3.0 中废弃 selectConfig
    
        var checkboxConfig = this.checkboxConfig || this.selectConfig || {};
        var property = checkboxConfig.checkField;
        var rowList = [];
    
        if (property) {
          if (treeConfig) {
            rowList = VueUtil.filterTree(tableFullData, function (row) {
              return VueUtil.get(row, property);
            }, treeConfig);
          } else {
            rowList = tableFullData.filter(function (row) {
              return VueUtil.get(row, property);
            });
          }
    
        } else {
          var selection = this.selection;
    
          if (treeConfig) {
            rowList = VueUtil.filterTree(tableFullData, function (row) {
              return selection.indexOf(row) > -1;
            }, treeConfig);
          } else {
            rowList = tableFullData.filter(function (row) {
              return selection.indexOf(row) > -1;
            });
          }
    
        }
    
        return rowList;
      },
    
      /**
       * 获取处理后全量的表格数据
       * 如果存在筛选条件，继续处理
       */
      updateAfterFullData: function updateAfterFullData() {
        var visibleColumn = this.visibleColumn,
            tableFullData = this.tableFullData,
            remoteSort = this.remoteSort,
            remoteFilter = this.remoteFilter;
        var tableData = tableFullData;
        var filterColumn = visibleColumn.filter(function (_ref2) {
          var filters = _ref2.filters;
          return filters && filters.length;
        });
        tableData = tableData.filter(function (row) {
          return filterColumn.every(function (column) {
            var filters = column.filters,
                filterRender = column.filterRender;
            var compConf = filterRender ? baseTable.Renderer.get(filterRender.name) : null;
            var valueList = [];
            var itemList = [];
    
            if (filters && filters.length) {
              filters.forEach(function (item) {
                if (item.checked) {
                  itemList.push(item);
                  valueList.push(item.value);
                }
              });
    
              if (valueList.length && !remoteFilter) {
                var property = column.property,
                    filterMethod = column.filterMethod;
    
                if (!filterMethod && compConf && compConf.renderFilter) {
                  filterMethod = compConf.filterMethod;
                }
    
                return filterMethod ? itemList.some(function (item) {
                  return filterMethod({
                    value: item.value,
                    option: item,
                    row: row,
                    column: column
                  });
                }) : valueList.indexOf(VueUtil.get(row, property)) > -1;
              }
            }
    
            return true;
          });
        });
    
        if (this.sortingColumns && this.sortingColumns.length > 0) {
          var iteratees = this.sortingColumns.map(function(column) {
            return column.sortMethod || column.property;
          });

          var orders = this.sortingColumns.map(function(column) {
            return column.order;
          });
          
          if (!remoteSort) {
            if (this.sortMethod) {
              tableData = this.sortMethod({
                data: tableData,
                column: VueUtil.clone(this.sortingColumns),
                property: iteratees,
                order: orders,
                $table: this
              }) || tableData;
            } else {
              var sortAry = [];
              this.sortingColumns.forEach(function(column) {
                if(VueUtil.isArray(column.sortBy) && column.sortBy.length > 0) {
                  column.sortBy.forEach(function (sortBy) {
                    sortAry.push({
                      prop: sortBy,
                      order: column.order === 'desc' ? -1 : undefined
                    });
                  });
                } else {
                  sortAry.push({
                    prop: column.sortMethod || column.property,
                    order: column.order === 'desc' ? -1 : undefined
                  });
                }
              });
      
              var sortFunc = firstBy(sortAry[0].prop, sortAry[0].order);
              for (var index = 1; index < sortAry.length; index++) {
                sortFunc = sortFunc.thenBy(sortAry[index].prop, sortAry[index].order);
              }
              tableData = tableData.sort(sortFunc);
            }
          }
        }

        this.afterFullData = tableData;
        return tableData;
      },
    
      /**
       * 根据行的唯一主键获取行
       * @param {String/Number} rowid 行主键
       */
      getRowById: function getRowById(rowid) {
        var fullDataRowIdData = this.fullDataRowIdData;
        return fullDataRowIdData[rowid] ? fullDataRowIdData[rowid].row : null;
      },
    
      /**
       * 根据行获取行的唯一主键
       * @param {Row} row 行对象
       */
      getRowid: function getRowid(row) {
        var fullAllDataRowMap = this.fullAllDataRowMap;
        return fullAllDataRowMap.has(row) ? fullAllDataRowMap.get(row).rowid : null;
      },
    
      /**
       * 获取处理后的表格数据
       * 如果存在筛选条件，继续处理
       * 如果存在排序，继续处理
       */
      getTableData: function getTableData() {
        var tableFullData = this.tableFullData,
            afterFullData = this.afterFullData,
            tableData = this.tableData,
            footerData = this.footerData;
        return {
          fullData: tableFullData.slice(0),
          visibleData: afterFullData.slice(0),
          tableData: tableData.slice(0),
          footerData: footerData.slice(0)
        };
      },
      handleDefault: function handleDefault() {
        var _this10 = this;
    
        // 在 v3.0 中废弃 selectConfig
        var checkboxConfig = this.checkboxConfig || this.selectConfig;
    
        if (checkboxConfig) {
          this.handleSelectionDefChecked();
        }
    
        if (this.radioConfig) {
          this.handleRadioDefChecked();
        }
    
        if (this.expandConfig) {
          this.handleDefaultRowExpand();
        }
    
        if (this.treeConfig) {
          this.handleDefaultTreeExpand();
        }
    
        this.updateFooter();
        this.$nextTick(function () {
          return setTimeout(_this10.recalculate);
        });
      },
    
      /**
       * 动态列处理
       */
      mergeCustomColumn: function mergeCustomColumn(customColumns) {
        var tableFullColumn = this.tableFullColumn;
        this.isUpdateCustoms = true;
    
        if (customColumns.length) {
          tableFullColumn.forEach(function (column) {
            // 在 v3.0 中废弃 prop
            var item = VueUtil.find(customColumns, function (item) {
              return column.property && (item.field || item.prop) === column.property;
            });
    
            if (item) {
              if (VueUtil.isNumber(item.resizeWidth)) {
                column.resizeWidth = item.resizeWidth;
              }
    
              if (VueUtil.isBoolean(item.visible)) {
                column.visible = item.visible;
              }

              if (item.fixed === 'left' || item.fixed === 'right' ) {
                column.fixed = item.fixed;
              }
            }
          });
        }
    
        this.$emit('update:customs', tableFullColumn);
      },
    
      /**
       * 手动重置列的所有操作，还原到初始状态
       * 如果已关联工具栏，则会同步更新
       */
      resetAll: function resetAll() {
        this.resetFixColumn();
        this.resetCustoms();
        this.resetResizable();
        this.resetColumnDrag();
      },
    
      /**
       * 隐藏指定列
       * @param {ColumnConfig} column 列配置
       */
      hideColumn: function hideColumn(column) {
        return this.handleVisibleColumn(column, false);
      },
    
      /**
       * 显示指定列
       * @param {ColumnConfig} column 列配置
       */
      showColumn: function showColumn(column) {
        return this.handleVisibleColumn(column, true);
      },

      /**
       * 固定指定列
       * @param {ColumnConfig} column 列配置
       */
      fixColumn: function fixColumn(column, position) {
        if (arguments.length) {
          column.fixed = position === false ? undefined : position === 'right' ? position : 'left';
        } else {
          this.tableFullColumn.forEach(function (column) {
            column.fixed = undefined;
          });
        }
        
        if (this.$toolbar) {
          this.$toolbar.updateFixed();
        }
      },

      resetFixColumn: function() {
        this.fixColumn();
      },
    
      /**
       * 手动重置列的显示/隐藏操作，还原到初始状态
       * 如果已关联工具栏，则会同步更新
       */
      resetCustoms: function resetCustoms() {
        return this.handleVisibleColumn();
      },
      handleVisibleColumn: function handleVisibleColumn(column, visible) {
        if (arguments.length) {
          column.visible = visible;
        } else {
          this.tableFullColumn.forEach(function (column) {
            column.visible = true;
          });
        }
    
        if (this.$toolbar) {
          this.$toolbar.updateSetting();
        }
    
        return this.$nextTick();
      },
    
      /**
       * 初始化加载显示/隐藏列
       * 对于异步更新的场景下可能会用到
       * @param {Array} customColumns 自定义列数组
       */
      reloadCustoms: function reloadCustoms(customColumns) {
        var _this11 = this;
    
        return this.$nextTick().then(function () {
          _this11.mergeCustomColumn(customColumns);
    
          return _this11.refreshColumn().then(function () {
            return _this11.tableFullColumn;
          });
        });
      },
    
      /**
       * 刷新列信息
       * 将固定的列左边、右边分别靠边
       * 如果使用了分组表头，固定列必须在左侧或者右侧
       */
      refreshColumn: function refreshColumn() {
        var _this12 = this;
    
        var isColspan;
        var letIndex = 0;
        var leftList = [];
        var leftStartIndex = null;
        var rightEndIndex = null;
        var centerList = [];
        var rightList = [];
        var tableFullColumn = this.tableFullColumn,
            isGroup = this.isGroup,
            columnStore = this.columnStore,
            scrollXStore = this.scrollXStore,
            optimizeOpts = this.optimizeOpts;
        var scrollX = optimizeOpts.scrollX; // 如果是分组表头，如果子列全部被隐藏，则根列也隐藏
    
        if (isGroup) {
          VueUtil.eachTree(this.collectColumn, function (column) {
            if (column.children && column.children.length) {
              column.visible = !!VueUtil.findTree(column.children, function (subColumn) {
                return subColumn.children && subColumn.children.length ? 0 : subColumn.visible;
              }, headerProps);
            }
          }, headerProps);
        } // 重新分配列
    
    
        tableFullColumn.filter(function (column) {
          return column.visible;
        }).forEach(function (column, columnIndex) {
          if (column.fixed === 'left') {
            if (leftStartIndex === null) {
              leftStartIndex = letIndex;
            }
    
            if (!isColspan) {
              if (columnIndex - letIndex !== 0) {
                isColspan = true;
              } else {
                letIndex++;
              }
            }
    
            leftList.push(column);
          } else if (column.fixed === 'right') {
            if (!isColspan) {
              if (rightEndIndex === null) {
                rightEndIndex = columnIndex;
              }
    
              if (columnIndex - rightEndIndex !== 0) {
                isColspan = true;
              } else {
                rightEndIndex++;
              }
            }
    
            rightList.push(column);
          } else {
            centerList.push(column);
          }
        });
        var visibleColumn = leftList.concat(centerList).concat(rightList);
        var scrollXLoad = scrollX && scrollX.gt && scrollX.gt < tableFullColumn.length;
        VueUtil.assign(columnStore, {
          leftList: leftList,
          centerList: centerList,
          rightList: rightList
        });
    
        if (scrollXLoad) {
          if (this.isGroup) {
            tools.UtilTools.warn('vue.xtable.error.scrollXNotGroup');
          } // if (this.resizable || visibleColumn.some(column => column.resizable)) {
          //   UtilTools.warn('vue.xtable.error.scrollXNotResizable')
          // }
    
    
          VueUtil.assign(scrollXStore, {
            startIndex: 0,
            visibleIndex: 0
          });
          visibleColumn = visibleColumn.slice(scrollXStore.startIndex, scrollXStore.startIndex + scrollXStore.renderSize);
        }
    
        this.scrollXLoad = scrollXLoad;
        this.tableColumn = visibleColumn;
        return this.$nextTick().then(function () {
          _this12.updateFooter();
    
          _this12.recalculate(true);
        });
      },
    
      /**
       * 指定列宽的列进行拆分
       */
      analyColumnWidth: function analyColumnWidth() {
        var columnWidth = this.columnWidth,
            columnMinWidth = this.columnMinWidth;
        var resizeList = [];
        var pxList = [];
        var pxMinList = [];
        var scaleList = [];
        var scaleMinList = [];
        var autoList = [];
        this.tableFullColumn.forEach(function (column) {
          if (columnWidth && !column.width) {
            column.width = columnWidth;
          }
    
          if (columnMinWidth && !column.minWidth) {
            column.minWidth = columnMinWidth;
          }
    
          if (column.visible) {
            if (column.resizeWidth) {
              resizeList.push(column);
            } else if (tools.DomTools.isPx(column.width)) {
              pxList.push(column);
            } else if (tools.DomTools.isScale(column.width)) {
              scaleList.push(column);
            } else if (tools.DomTools.isPx(column.minWidth)) {
              pxMinList.push(column);
            } else if (tools.DomTools.isScale(column.minWidth)) {
              scaleMinList.push(column);
            } else {
              autoList.push(column);
            }
          }
        });
        VueUtil.assign(this.columnStore, {
          resizeList: resizeList,
          pxList: pxList,
          pxMinList: pxMinList,
          scaleList: scaleList,
          scaleMinList: scaleMinList,
          autoList: autoList
        });
      },
    
      /**
       * 刷新滚动操作，手动同步滚动相关位置（对于某些特殊的操作，比如滚动条错位、固定列不同步）
       */
      refreshScroll: function refreshScroll() {
        var _this13 = this;
    
        var lastScrollLeft = this.lastScrollLeft,
            lastScrollTop = this.lastScrollTop;
        this.clearScroll();
        return this.$nextTick().then(function () {
          if (lastScrollLeft || lastScrollTop) {
            // 重置最后滚动状态
            _this13.lastScrollLeft = 0;
            _this13.lastScrollTop = 0; // 还原滚动状态
    
            return _this13.scrollTo(lastScrollLeft, lastScrollTop);
          }
        });
      },
    
      /**
       * 计算单元格列宽，动态分配可用剩余空间
       * 支持 width=? width=?px width=?% min-width=? min-width=?px min-width=?%
       */
      recalculate: function recalculate(refull) {
        var _this14 = this;
    
        var $refs = this.$refs;
        var tableBody = $refs.tableBody,
            tableHeader = $refs.tableHeader,
            tableFooter = $refs.tableFooter;
        var bodyElem = tableBody ? tableBody.$el : null;
        var headerElem = tableHeader ? tableHeader.$el : null;
        var footerElem = tableFooter ? tableFooter.$el : null; // DomTools.addClass($el, 'is--recalculate')
    
        if (bodyElem) {
          this.autoCellWidth(headerElem, bodyElem, footerElem);
    
          if (refull === true) {
            // 初始化时需要在列计算之后再执行优化运算，达到最优显示效果
            return this.computeScrollLoad().then(function () {
              _this14.autoCellWidth(headerElem, bodyElem, footerElem);
    
              _this14.computeScrollLoad(); // DomTools.removeClass($el, 'is--recalculate')
    
            });
          }
        } // DomTools.removeClass($el, 'is--recalculate')
    
    
        return this.computeScrollLoad();
      },
      // 列宽计算
      autoCellWidth: function autoCellWidth(headerElem, bodyElem, footerElem) {
        var meanWidth;
        var tableWidth = 0;
        var minCellWidth = 40; // 列宽最少限制 40px
    
        var bodyWidth = bodyElem.clientWidth;
        var remainWidth = bodyWidth;
        var fit = this.fit,
            columnStore = this.columnStore;
        var resizeList = columnStore.resizeList,
            pxMinList = columnStore.pxMinList,
            pxList = columnStore.pxList,
            scaleList = columnStore.scaleList,
            scaleMinList = columnStore.scaleMinList,
            autoList = columnStore.autoList; // 最小宽
    
        pxMinList.forEach(function (column) {
          var minWidth = parseInt(column.minWidth);
          tableWidth += minWidth;
          column.renderWidth = minWidth;
        }); // 最小百分比
    
        meanWidth = remainWidth / 100;
        scaleMinList.forEach(function (column) {
          var scaleWidth = Math.floor(parseInt(column.minWidth) * meanWidth);
          tableWidth += scaleWidth;
          column.renderWidth = scaleWidth;
        }); // 固定百分比
    
        scaleList.forEach(function (column) {
          var scaleWidth = Math.floor(parseInt(column.width) * meanWidth);
          tableWidth += scaleWidth;
          column.renderWidth = scaleWidth;
        }); // 固定宽
    
        pxList.forEach(function (column) {
          var width = parseInt(column.width);
          tableWidth += width;
          column.renderWidth = width;
        }); // 调整了列宽
    
        resizeList.forEach(function (column) {
          var width = parseInt(column.resizeWidth);
          tableWidth += width;
          column.renderWidth = width;
        });
        remainWidth -= tableWidth;
        meanWidth = remainWidth > 0 ? Math.floor(remainWidth / (scaleMinList.length + pxMinList.length + autoList.length)) : 0;
    
        if (fit) {
          if (remainWidth > 0) {
            scaleMinList.concat(pxMinList).forEach(function (column) {
              tableWidth += meanWidth;
              column.renderWidth += meanWidth;
            });
          }
        } else {
          meanWidth = minCellWidth;
        } // 自适应
    
    
        autoList.forEach(function (column, index) {
          var width = Math.max(meanWidth, minCellWidth);
          column.renderWidth = width;
          tableWidth += width;
    
          if (fit && index === autoList.length - 1) {
            // 如果所有列足够放的情况下，修补列之间的误差
            var odiffer = bodyWidth - tableWidth;
    
            if (odiffer > 0) {
              column.renderWidth += odiffer;
              tableWidth = bodyWidth;
            }
          }
        });
        var tableHeight = bodyElem.offsetHeight;
        var overflowY = bodyElem.scrollHeight > bodyElem.clientHeight;
        this.scrollbarWidth = overflowY ? bodyElem.offsetWidth - bodyWidth : 0;
        this.overflowY = overflowY;
        this.tableWidth = tableWidth;
        this.tableHeight = tableHeight;
        this.parentHeight = this.getParentHeight();
    
        if (headerElem) {
          this.headerHeight = headerElem.offsetHeight; // 检测是否同步滚动
    
          if (headerElem.scrollLeft !== bodyElem.scrollLeft) {
            headerElem.scrollLeft = bodyElem.scrollLeft;
          }
        }
    
        if (footerElem) {
          var footerHeight = footerElem.offsetHeight;
          this.scrollbarHeight = Math.max(footerHeight - footerElem.clientHeight, 0);
          this.overflowX = tableWidth > footerElem.clientWidth;
          this.footerHeight = footerHeight;
        } else {
          this.scrollbarHeight = Math.max(tableHeight - bodyElem.clientHeight, 0);
          this.overflowX = tableWidth > bodyWidth;
        }
    
        if (this.overflowX) {
          this.checkScrolling();
        }
      },
    
      /**
       * 手动重置列宽拖动的操作，还原到初始状态
       * 如果已关联工具栏，则会同步更新
       */
      resetResizable: function resetResizable() {
        this.visibleColumn.forEach(function (column) {
          column.resizeWidth = 0;
        });
    
        if (this.$toolbar) {
          this.$toolbar.resetResizable();
        }
    
        this.analyColumnWidth();
        return this.recalculate(true);
      },
    
      /**
       * 放弃 vue 的双向 dom 绑定，使用原生的方式更新 Dom，性能翻倍提升
       */
      updateStyle: function updateStyle() {
        var $refs = this.$refs,
            fullColumnIdData = this.fullColumnIdData,
            maxHeight = this.maxHeight,
            height = this.height,
            parentHeight = this.parentHeight,
            border = this.border,
            tableColumn = this.tableColumn,
            headerHeight = this.headerHeight,
            allColumnHeaderOverflow = this.showHeaderOverflow,
            showFooter = this.showFooter,
            allColumnOverflow = this.showOverflow,
            footerHeight = this.footerHeight,
            tableHeight = this.tableHeight,
            tableWidth = this.tableWidth,
            scrollbarHeight = this.scrollbarHeight,
            scrollbarWidth = this.scrollbarWidth,
            scrollXLoad = this.scrollXLoad,
            scrollYLoad = this.scrollYLoad,
            columnStore = this.columnStore,
            elemStore = this.elemStore,
            editStore = this.editStore,
            currentRow = this.currentRow,
            mouseConfig = this.mouseConfig;
        var containerList = ['main', 'left', 'right'];
        var customHeight = height === 'auto' ? parentHeight : (tools.DomTools.isScale(height) ? Math.floor(parseInt(height) / 100 * parentHeight) : (parseFloat(height)) - this.getExcludeHeight() || 0);
    
        if (showFooter) {
          customHeight += scrollbarHeight + 1;
        }
    
        containerList.forEach(function (name, index) {
          var fixedType = index > 0 ? name : '';
          var layoutList = ['header', 'body', 'footer'];
          var fixedColumn = columnStore[''.concat(fixedType, 'List')];
          var fixedWrapperElem = $refs[''.concat(fixedType, 'Container')];
          layoutList.forEach(function (layout) {
            var wrapperElem = elemStore[''.concat(name, '-').concat(layout, '-wrapper')];
            var tableElem = elemStore[''.concat(name, '-').concat(layout, '-table')];
    
            if (layout === 'header') {
              // 表头体样式处理
              // 横向滚动渲染
              var tWidth = tableWidth;
    
              if (scrollXLoad) {
                if (fixedType) {
                  tableColumn = fixedColumn;
                }
    
                tWidth = tableColumn.reduce(function (previous, column) {
                  return previous + column.renderWidth;
                }, 0);
              }
    
              if (tableElem) {
                tableElem.style.width = tWidth === null ? tWidth : ''.concat(tWidth + scrollbarWidth, 'px');
              }
    
              var repairElem = elemStore[''.concat(name, '-').concat(layout, '-repair')];
    
              if (repairElem) {
                repairElem.style.width = ''.concat(tableWidth, 'px');
              } // let listElem = elemStore[`${name}-${layout}-list`]
              // if (listElem) {
              //   VueUtil.loop(listElem.querySelectorAll(`.col--gutter`), thElem => {
              //     thElem.style.width = `${scrollbarWidth}px`
              //   })
              // }
    
            } else if (layout === 'body') {
              var emptyBlockElem = elemStore[''.concat(name, '-').concat(layout, '-emptyBlock')];
    
              if (wrapperElem) {
                if (customHeight > 0) {
                  wrapperElem.style.height = ''.concat(fixedType ? (customHeight > 0 ? customHeight - headerHeight - footerHeight : tableHeight) - (showFooter ? 0 : scrollbarHeight) : customHeight - headerHeight - footerHeight, 'px');
                } else if (maxHeight) {
                  maxHeight = tools.DomTools.isScale(maxHeight) ? Math.floor(parseInt(maxHeight) / 100 * parentHeight) : (parseFloat(maxHeight) || 0);
                  wrapperElem.style.maxHeight = ''.concat(fixedType ? maxHeight - headerHeight - (showFooter ? 0 : scrollbarHeight) : maxHeight - headerHeight, 'px');
                }
              } // 如果是固定列
    
    
              if (fixedWrapperElem) {
                var isRightFixed = fixedType === 'right';
                var _fixedColumn = columnStore[''.concat(fixedType, 'List')];
                wrapperElem.style.top = ''.concat(headerHeight, 'px');
                fixedWrapperElem.style.height = ''.concat((customHeight > 0 ? customHeight - headerHeight - footerHeight : tableHeight) + headerHeight + footerHeight - scrollbarHeight * (showFooter ? 2 : 1), 'px');
                fixedWrapperElem.style.width = ''.concat(_fixedColumn.reduce(function (previous, column) {
                  return previous + column.renderWidth;
                }, isRightFixed ? scrollbarWidth : 0), 'px');
              }
    
              var _tWidth = tableWidth; // 如果是固定列与设置了超出隐藏
    
              if (fixedType && allColumnOverflow) {
                tableColumn = fixedColumn;
                _tWidth = tableColumn.reduce(function (previous, column) {
                  return previous + column.renderWidth;
                }, 0);
              } else if (scrollXLoad) {
                if (fixedType) {
                  tableColumn = fixedColumn;
                }
    
                _tWidth = tableColumn.reduce(function (previous, column) {
                  return previous + column.renderWidth;
                }, 0);
              }
    
              if (tableElem) {
                tableElem.style.width = _tWidth ? ''.concat(_tWidth, 'px') : _tWidth; // 兼容性处理
    
                tableElem.style.paddingRight = scrollbarWidth && fixedType && (VueUtil.isFirefox || VueUtil.isSafari) ? ''.concat(scrollbarWidth, 'px') : '';
              }
    
              if (emptyBlockElem) {
                emptyBlockElem.style.width = _tWidth ? ''.concat(_tWidth, 'px') : _tWidth;
              }
            } else if (layout === 'footer') {
              // 如果是使用优化模式
              var _tWidth2 = tableWidth;
    
              if (fixedType && allColumnOverflow) {
                tableColumn = fixedColumn;
                _tWidth2 = tableColumn.reduce(function (previous, column) {
                  return previous + column.renderWidth;
                }, 0);
              } else if (scrollXLoad) {
                if (fixedType) {
                  tableColumn = fixedColumn;
                }
    
                _tWidth2 = tableColumn.reduce(function (previous, column) {
                  return previous + column.renderWidth;
                }, 0);
              }
    
              if (wrapperElem) {
                // 如果是固定列
                if (fixedWrapperElem) {
                  wrapperElem.style.top = ''.concat(customHeight > 0 ? customHeight - footerHeight : tableHeight + headerHeight, 'px');
                }
    
                wrapperElem.style.marginTop = ''.concat(-scrollbarHeight - 1, 'px');
              }
    
              if (tableElem) {
                tableElem.style.width = _tWidth2 === null ? _tWidth2 : ''.concat(_tWidth2 + scrollbarWidth, 'px');
              } // let listElem = elemStore[`${name}-${layout}-list`]
              // if (listElem) {
              //   VueUtil.loop(listElem.querySelectorAll(`.col--gutter`), thElem => {
              //     thElem.style.width = `${scrollbarWidth}px`
              //   })
              // }
    
            }
    
            var colgroupElem = elemStore[''.concat(name, '-').concat(layout, '-colgroup')];
    
            if (colgroupElem) {
              VueUtil.loop(colgroupElem.children, function (colElem) {
                var colid = colElem.getAttribute('name');
    
                if (colid === 'col_gutter') {
                  colElem.width = ''.concat(scrollbarWidth || '');
                }
    
                if (fullColumnIdData[colid]) {
                  var column = fullColumnIdData[colid].column;
                  var showHeaderOverflow = column.showHeaderOverflow,
                      showOverflow = column.showOverflow,
                      renderWidth = column.renderWidth;
                  var cellOverflow;
                  colElem.width = ''.concat(column.renderWidth || '');
    
                  if (layout === 'header') {
                    cellOverflow = VueUtil.isUndefined(showHeaderOverflow) || VueUtil.isNull(showHeaderOverflow) ? allColumnHeaderOverflow : showHeaderOverflow;
                  } else {
                    cellOverflow = VueUtil.isUndefined(showOverflow) || VueUtil.isNull(showOverflow) ? allColumnOverflow : showOverflow;
                  }
    
                  var showEllipsis = cellOverflow === 'ellipsis';
                  var showTitle = cellOverflow === 'title';
                  var showTooltip = cellOverflow === true || cellOverflow === 'tooltip';
                  var hasEllipsis = showTitle || showTooltip || showEllipsis;
                  var listElem = elemStore[''.concat(name, '-').concat(layout, '-list')]; // 滚动的渲染不支持动态行高
    
                  if ((scrollXLoad || scrollYLoad) && !hasEllipsis) {
                    hasEllipsis = true;
                  }
    
                  if (listElem) {
                    VueUtil.loop(listElem.querySelectorAll('.'.concat(column.id)), function (thElem) {
                      var cellElem = thElem.querySelector('.vue-xtable-cell');
    
                      if (cellElem) {
                        cellElem.style.width = ''.concat(border ? renderWidth - 1 : renderWidth, 'px');
                      }
                    });
                  }
                }
              });
            }
          });
        });
    
        if (currentRow) {
          this.setCurrentRow(currentRow);
        }
    
        if (mouseConfig && mouseConfig.selected && editStore.selected.row && editStore.selected.column) {
          this.addColSdCls();
        }
    
        return this.$nextTick();
      },
    
      /**
       * 处理固定列的显示状态
       */
      checkScrolling: function checkScrolling() {
        var _this$$refs = this.$refs,
            tableBody = _this$$refs.tableBody,
            leftContainer = _this$$refs.leftContainer,
            rightContainer = _this$$refs.rightContainer;
        var bodyElem = tableBody ? tableBody.$el : null;
    
        if (bodyElem) {
          if (leftContainer) {
            tools.DomTools[bodyElem.scrollLeft > 0 ? 'addClass' : 'removeClass'](leftContainer, 'scrolling--middle');
          }
    
          if (rightContainer) {
            tools.DomTools[bodyElem.clientWidth < bodyElem.scrollWidth - bodyElem.scrollLeft ? 'addClass' : 'removeClass'](rightContainer, 'scrolling--middle');
          }
        }
      },
      preventEvent: function preventEvent(evnt, type, args, next, end) {
        var _this15 = this;
    
        var evntList = baseTable.interceptor.get(type);
    
        var rest;
    
        if (!evntList.some(function (func) {
          return func(args, evnt, _this15) === false;
        })) {
          if (next) {
            rest = next();
          }
        }
    
        if (end) {
          end();
        }
    
        return rest;
      },
    
      /**
       * 全局按下事件处理
       */
      handleGlobalMousedownEvent: function handleGlobalMousedownEvent(evnt) {
        var _this16 = this;
    
        var $el = this.$el,
            $refs = this.$refs,
            editStore = this.editStore,
            ctxMenuStore = this.ctxMenuStore,
            _this$editConfig = this.editConfig,
            editConfig = _this$editConfig === void 0 ? {} : _this$editConfig,
            filterStore = this.filterStore,
            getEventTargetNode = this.getEventTargetNode,
            getRowNode = this.getRowNode;
        var actived = editStore.actived;
        var filterWrapper = $refs.filterWrapper,
            validTip = $refs.validTip;
    
        if (filterWrapper) {
          if (getEventTargetNode(evnt, $el, 'vue-xtable-filter-wrapper').flag) {// 如果点击了筛选按钮
          } else if (getEventTargetNode(evnt, filterWrapper.$el).flag) {// 如果点击筛选容器
          } else {
            this.preventEvent(evnt, 'event.clearFilter', filterStore.args, this.closeFilter);
          }
        } // 如果已激活了编辑状态
    
    
        if (actived.row) {
          if (!(editConfig.autoClear === false)) {
            if (validTip && getEventTargetNode(evnt, validTip.$el).flag) {// 如果是激活状态，且点击了校验提示框
            } else if (!this.lastCallTime || this.lastCallTime + 50 < Date.now()) {
              // 如果手动调用了激活单元格，避免触发源被移除后导致重复关闭
              this.preventEvent(evnt, 'event.clearActived', actived.args, function () {
                var isClear;
    
                if (editConfig.mode === 'row') {
                  var rowNode = getEventTargetNode(evnt, $el, 'vue-xtable-body--row'); // row 方式，如果点击了不同行
    
                  isClear = rowNode.flag ? getRowNode(rowNode.targetElem).item !== getRowNode(actived.args.cell.parentNode).item : 0;
                } else {
                  // cell 方式，如果是非编辑列
                  isClear = !getEventTargetNode(evnt, $el, 'col--edit', true).flag;
                }
    
                if (isClear || // 如果点击了当前表格之外
                !getEventTargetNode(evnt, $el, undefined, true).flag) {
                  setTimeout(function () {
                    return _this16.clearActived(evnt);
                  });
                }
              });
            }
          }
        } // 如果配置了快捷菜单且，点击了其他地方则关闭
    
    
        if (ctxMenuStore.visible && this.$refs.ctxWrapper && !getEventTargetNode(evnt, this.$refs.ctxWrapper.$el).flag) {
          this.closeMenu();
        } // 最后激活的表格
    
        this.isActivated = getEventTargetNode(evnt, this.$el).flag;
      },
    
      /**
       * 窗口失焦事件处理
       */
      handleGlobalBlurEvent: function handleGlobalBlurEvent(evnt) {
        this.closeFilter();
        this.closeMenu();
      },
    
      /**
       * 全局滚动事件
       */
      handleGlobalMousewheelEvent: function handleGlobalMousewheelEvent(evnt) {
        this.clostTooltip();
        this.closeMenu();
      },
    
      /**
       * 全局键盘事件
       */
      handleGlobalKeydownEvent: function handleGlobalKeydownEvent(evnt) {
        var _this17 = this;
    
        // 该行为只对当前激活的表格有效
        if (this.isActivated) {
          this.preventEvent(evnt, 'event.keydown', {
            $table: this
          }, function () {
            var isCtxMenu = _this17.isCtxMenu,
                ctxMenuStore = _this17.ctxMenuStore,
                editStore = _this17.editStore,
                _this17$mouseConfig = _this17.mouseConfig,
                mouseConfig = _this17$mouseConfig === void 0 ? {} : _this17$mouseConfig,
                _this17$keyboardConfi = _this17.keyboardConfig,
                keyboardConfig = _this17$keyboardConfi === void 0 ? {} : _this17$keyboardConfi,
                treeConfig = _this17.treeConfig,
                highlightCurrentRow = _this17.highlightCurrentRow,
                currentRow = _this17.currentRow;
            var selected = editStore.selected,
                actived = editStore.actived;
            var keyCode = evnt.keyCode;
            var isBack = keyCode === 8;
            var isTab = keyCode === 9;
            var isEnter = keyCode === 13;
            var isEsc = keyCode === 27;
            var isSpacebar = keyCode === 32;
            var isLeftArrow = keyCode === 37;
            var isUpArrow = keyCode === 38;
            var isRightArrow = keyCode === 39;
            var isDwArrow = keyCode === 40;
            var isDel = keyCode === 46;
            var isA = keyCode === 65;
            var isC = keyCode === 67;
            var isX = keyCode === 88;
            var isF2 = keyCode === 113;
            var isCtrlKey = evnt.ctrlKey;
            var isShiftKey = evnt.shiftKey;
            var operArrow = isLeftArrow || isUpArrow || isRightArrow || isDwArrow;
            var operCtxMenu = isCtxMenu && ctxMenuStore.visible && (isEnter || isSpacebar || operArrow);
            var params;
    
            if (isEsc) {
              // 如果按下了 Esc 键，关闭快捷菜单、筛选
              _this17.closeMenu();
    
              _this17.closeFilter(); // 如果是激活编辑状态，则取消编辑
    
              var activedRow = actived.row;
              if (activedRow) {
                params = actived.args;
                _this17.clearActived(evnt); // 如果配置了选中功能，则为选中状态
                if (_this17.currentActiveRowOldValue !== null) {
                  VueUtil.destructuring(activedRow, _this17.currentActiveRowOldValue);
                }
    
    
                if (mouseConfig.selected) {
                  _this17.$nextTick(function () {
                    return _this17.handleSelected(params, evnt);
                  });
                }
              }
            } else if (isSpacebar && (keyboardConfig.isArrow || keyboardConfig.isTab) && selected.row && selected.column && (selected.column.type === 'checkbox' || selected.column.type === 'selection' || selected.column.type === 'radio')) {
              // 在 v3.0 中废弃 type=selection
              // 空格键支持选中复选列
              evnt.preventDefault(); // 在 v3.0 中废弃 type=selection
    
              if (selected.column.type === 'checkbox' || selected.column.type === 'selection') {
                _this17.handleToggleCheckRowEvent(selected.args, evnt);
              } else {
                _this17.triggerRadioRowEvent(evnt, selected.args);
              }
            } else if (isEnter && (keyboardConfig.isArrow || keyboardConfig.isTab) && (selected.row || actived.row || treeConfig && highlightCurrentRow && currentRow)) {
              // 如果是激活状态，退则出到下一行
              if (selected.row || actived.row) {
                _this17.moveSelected(selected.row ? selected.args : actived.args, isLeftArrow, isUpArrow, isRightArrow, true, evnt);
              } else if (treeConfig && highlightCurrentRow && currentRow) {
                // 如果是树形表格当前行回车移动到子节点
                var childrens = currentRow[treeConfig.children];
    
                if (childrens && childrens.length) {
                  evnt.preventDefault();
                  var targetRow = childrens[0];
                  params = {
                    $table: _this17,
                    row: targetRow
                  };
    
                  _this17.setTreeExpansion(currentRow, true).then(function () {
                    return _this17.scrollToRow(targetRow);
                  }).then(function () {
                    return _this17.triggerCurrentRowEvent(evnt, params);
                  });
                }
              }
            } else if (operCtxMenu) {
              // 如果配置了右键菜单; 支持方向键操作、回车
              evnt.preventDefault();
    
              if (ctxMenuStore.showChild && tools.UtilTools.hasChildrenList(ctxMenuStore.selected)) {
                _this17.moveCtxMenu(evnt, keyCode, ctxMenuStore, 'selectChild', 37, false, ctxMenuStore.selected.children);
              } else {
                _this17.moveCtxMenu(evnt, keyCode, ctxMenuStore, 'selected', 39, true, _this17.ctxMenuList);
              }
            } else if (isF2) {
              // 如果按下了 F2 键
              if (selected.row && selected.column) {
                evnt.preventDefault();
    
                _this17.handleActived(selected.args, evnt);
              }
            } else if (operArrow && keyboardConfig.isArrow) {
              // 如果按下了方向键
              if (selected.row && selected.column) {
                _this17.moveSelected(selected.args, isLeftArrow, isUpArrow, isRightArrow, isDwArrow, evnt);
              } else if ((isUpArrow || isDwArrow) && highlightCurrentRow && currentRow) {
                // 当前行按键上下移动
                _this17.moveCurrentRow(isUpArrow, isDwArrow, evnt);
              }
            } else if (isTab && keyboardConfig.isTab) {
              // 如果按下了 Tab 键切换
              if (selected.row || selected.column) {
                _this17.moveTabSelected(selected.args, isShiftKey, evnt);
              } else if (actived.row || actived.column) {
                _this17.moveTabSelected(actived.args, isShiftKey, evnt);
              }
            } else if (isDel || (treeConfig && highlightCurrentRow && currentRow ? isBack && keyboardConfig.isArrow : isBack)) {
              // 如果是删除键
              if (keyboardConfig.isDel && (selected.row || selected.column)) {
                tools.UtilTools.setCellValue(selected.row, selected.column, null);
    
                if (isBack) {
                  _this17.handleActived(selected.args, evnt);
                }
              } else if (isBack && keyboardConfig.isArrow && treeConfig && highlightCurrentRow && currentRow) {
                // 如果树形表格回退键关闭当前行返回父节点
                var findTreeData = VueUtil.findTree(_this17.afterFullData, function (item) {
                  return item === currentRow;
                }, treeConfig),
                    parentRow = findTreeData.parent;
    
                if (parentRow) {
                  evnt.preventDefault();
                  params = {
                    $table: _this17,
                    row: parentRow
                  };
    
                  _this17.setTreeExpansion(parentRow, false).then(function () {
                    return _this17.scrollToRow(parentRow);
                  }).then(function () {
                    return _this17.triggerCurrentRowEvent(evnt, params);
                  });
                }
              }
            } else if (keyboardConfig.isCut && isCtrlKey && (isA || isX || isC)) {
              // 如果开启复制功能
              if (isA) {
                _this17.handleAllChecked(evnt);
              } else if (isX || isC) {
                if (!editStore.actived.column && !editStore.actived.row) {
                  _this17.handleCopyed(isX, evnt);
                }
              }
            } else if (keyboardConfig.isEdit && !isCtrlKey && (keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90 || keyCode >= 96 && keyCode <= 111 || keyCode >= 186 && keyCode <= 192 || keyCode >= 219 && keyCode <= 222 || keyCode === 32)) {
              // 如果是按下非功能键之外允许直接编辑
              if (selected.column && selected.row && selected.column.editRender) {
                if (!keyboardConfig.editMethod || !(keyboardConfig.editMethod(selected.args, evnt) === false)) {
                  // tools.UtilTools.setCellValue(selected.row, selected.column, null);
    
                  _this17.handleActived(selected.args, evnt, selected.column);
                }
              }
            }
          });
        }
      },

      handleGlobalPaste: function(evnt) {
        if (this.isActivated) {
          this.handlePaste(evnt);
        }
      },
      handleGlobalResizeEvent: function handleGlobalResizeEvent() {
        this.recalculate();
      },
      handleTooltipLeaveEvent: function handleTooltipLeaveEvent(evnt) {
        var _this18 = this;
    
        var _this$tooltipConfig = this.tooltipConfig,
            tooltipConfig = _this$tooltipConfig === void 0 ? {} : _this$tooltipConfig;
        setTimeout(function () {
          if (!_this18.tooltipActive) {
            _this18.clostTooltip();
          }
        }, tooltipConfig.leaveDelay || GlobalConfig.tooltip.leaveDelay);
      },
      handleTargetEnterEvent: function handleTargetEnterEvent(evnt) {
        clearTimeout(this.tooltipTimeout);
        this.tooltipActive = true;
        this.clostTooltip();
      },
      handleTargetLeaveEvent: function handleTargetLeaveEvent(evnt) {
        var _this19 = this;
    
        var _this$tooltipConfig2 = this.tooltipConfig,
            tooltipConfig = _this$tooltipConfig2 === void 0 ? {} : _this$tooltipConfig2;
        this.tooltipActive = false;
    
        if (tooltipConfig.enterable) {
          this.tooltipTimeout = setTimeout(function () {
            if (!_this19.$refs.tooltip.isHover) {
              _this19.clostTooltip();
            }
          }, tooltipConfig.leaveDelay || GlobalConfig.tooltip.leaveDelay);
        } else {
          this.clostTooltip();
        }
      },
    
      /**
       * 触发表头 tooltip 事件
       */
      triggerHeaderTooltipEvent: function triggerHeaderTooltipEvent(evnt, params) {
        var tooltipStore = this.tooltipStore;
        var column = params.column;
        this.handleTargetEnterEvent();
    
        if (tooltipStore.column !== column || !tooltipStore.visible) {
          // 在 v3.0 中废弃 label
          this.handleTooltip(evnt, column);
        }
      },
    
      /**
       * 触发表尾 tooltip 事件
       */
      triggerFooterTooltipEvent: function triggerFooterTooltipEvent(evnt, params) {
        var column = params.column;
        var tooltipStore = this.tooltipStore;
        this.handleTargetEnterEvent();
    
        if (tooltipStore.column !== column || !tooltipStore.visible) {
          this.handleTooltip(evnt, column);
        }
      },
    
      /**
       * 触发 tooltip 事件
       */
      triggerTooltipEvent: function triggerTooltipEvent(evnt, params) {
        var editConfig = this.editConfig,
            editStore = this.editStore,
            tooltipStore = this.tooltipStore;
        var actived = editStore.actived;
        var row = params.row,
            column = params.column;
        this.handleTargetEnterEvent();
    
        if (editConfig) {
          if (editConfig.mode === 'row' && actived.row === row || actived.row === row && actived.column === column) {
            return;
          }
        }
    
        if (tooltipStore.column !== column || tooltipStore.row !== row || !tooltipStore.visible) {
          this.handleTooltip(evnt, column, row);
        }
      },
    
      /**
       * 处理显示 tooltip
       * @param {Event} evnt 事件
       * @param {ColumnConfig} column 列配置
       * @param {Row} row 行对象
       */
      handleTooltip: function handleTooltip(evnt, column, row) {
        var cell = evnt.currentTarget;
        var tooltip = this.$refs.tooltip;
        var wrapperElem = cell.children[0];
        var content = cell.innerText;
    
        if (content && wrapperElem.scrollWidth > wrapperElem.clientWidth) {
          VueUtil.assign(this.tooltipStore, {
            row: row,
            column: column,
            visible: true
          });
    
          if (tooltip) {
            tooltip.toVisible(cell, tools.UtilTools.formatText(content));
          }
        }
    
        return this.$nextTick();
      },
    
      /**
       * 关闭 tooltip
       */
      clostTooltip: function clostTooltip() {
        var tooltip = this.$refs.tooltip;
        VueUtil.assign(this.tooltipStore, {
          row: null,
          column: null,
          content: null,
          visible: false
        });
    
        if (tooltip) {
          tooltip.close();
        }
    
        return this.$nextTick();
      },
    
      /**
       * 处理默认勾选
       */
      handleSelectionDefChecked: function handleSelectionDefChecked() {
        var fullDataRowIdData = this.fullDataRowIdData; // 在 v3.0 中废弃 selectConfig
    
        var checkboxConfig = this.checkboxConfig || this.selectConfig || {};
        var checkAll = checkboxConfig.checkAll,
            checkRowKeys = checkboxConfig.checkRowKeys;
    
        if (checkAll) {
          this.setAllSelection(true);
        } else if (checkRowKeys) {
          var defSelection = [];
          checkRowKeys.forEach(function (rowid) {
            if (fullDataRowIdData[rowid]) {
              defSelection.push(fullDataRowIdData[rowid].row);
            }
          });
          this.setSelection(defSelection, true);
        }
      },
    
      /**
       * 用于多选行，设置行为选中状态，第二个参数为选中与否
       * @param {Array/Row} rows 行数据
       * @param {Boolean} value 是否选中
       */
      setSelection: function setSelection(rows, value) {
        var _this20 = this;
    
        if (rows && !VueUtil.isArray(rows)) {
          rows = [rows];
        }
    
        rows.forEach(function (row) {
          return _this20.handleSelectRow({
            row: row
          }, !!value);
        });
        return this.$nextTick();
      },
    
      /**
       * 多选，行选中事件
       * value 选中true 不选false 不确定-1
       */
      handleSelectRow: function handleSelectRow(_ref3, value) {
        var row = _ref3.row;
        var selection = this.selection,
            tableFullData = this.tableFullData,
            treeConfig = this.treeConfig,
            treeIndeterminates = this.treeIndeterminates; // 在 v3.0 中废弃 selectConfig
    
        var checkboxConfig = this.checkboxConfig || this.selectConfig || {};
        var property = checkboxConfig.checkField,
            checkStrictly = checkboxConfig.checkStrictly,
            checkMethod = checkboxConfig.checkMethod;
    
        if (property) {
          if (treeConfig && !checkStrictly) {
            if (value === -1) {
              treeIndeterminates.push(row);
              VueUtil.set(row, property, false);
            } else {
              // 更新子节点状态
              VueUtil.eachTree([row], function (item, $rowIndex) {
                if (row === item || !checkMethod || checkMethod({
                  row: item,
                  $rowIndex: $rowIndex
                })) {
                  VueUtil.set(item, property, value);
                }
              }, treeConfig);
              VueUtil.remove(treeIndeterminates, function (item) {
                return item === row;
              });
            } // 如果存在父节点，更新父节点状态
    
    
            var matchObj = VueUtil.findTree(tableFullData, function (item) {
              return item === row;
            }, treeConfig);
    
            if (matchObj && matchObj.parent) {
              var parentStatus;
              var vItems = checkMethod ? matchObj.items.filter(function (item, $rowIndex) {
                return checkMethod({
                  row: item,
                  $rowIndex: $rowIndex
                });
              }) : matchObj.items;
              var indeterminatesItem = VueUtil.find(matchObj.items, function (item) {
                return treeIndeterminates.indexOf(item) > -1;
              });
    
              if (indeterminatesItem) {
                parentStatus = -1;
              } else {
                var selectItems = matchObj.items.filter(function (item) {
                  return VueUtil.get(item, property);
                });
                parentStatus = selectItems.filter(function (item) {
                  return vItems.indexOf(item) > -1;
                }).length === vItems.length ? true : selectItems.length || value === -1 ? -1 : false;
              }
    
              return this.handleSelectRow({
                row: matchObj.parent
              }, parentStatus);
            }
          } else {
            VueUtil.set(row, property, value);
          }
        } else {
          if (treeConfig && !checkStrictly) {
            if (value === -1) {
              treeIndeterminates.push(row);
              VueUtil.remove(selection, function (item) {
                return item === row;
              });
            } else {
              // 更新子节点状态
              VueUtil.eachTree([row], function (item, $rowIndex) {
                if (row === item || !checkMethod || checkMethod({
                  row: item,
                  $rowIndex: $rowIndex
                })) {
                  if (value) {
                    selection.push(item);
                  } else {
                    VueUtil.remove(selection, function (select) {
                      return select === item;
                    });
                  }
                }
              }, treeConfig);
              VueUtil.remove(treeIndeterminates, function (item) {
                return item === row;
              });
            } // 如果存在父节点，更新父节点状态
    
    
            var _matchObj = VueUtil.findTree(tableFullData, function (item) {
              return item === row;
            }, treeConfig);
    
            if (_matchObj && _matchObj.parent) {
              var _parentStatus;
    
              var _vItems = checkMethod ? _matchObj.items.filter(function (item, $rowIndex) {
                return checkMethod({
                  row: item,
                  $rowIndex: $rowIndex
                });
              }) : _matchObj.items;
    
              var _indeterminatesItem = VueUtil.find(_matchObj.items, function (item) {
                return treeIndeterminates.indexOf(item) > -1;
              });
    
              if (_indeterminatesItem) {
                _parentStatus = -1;
              } else {
                var _selectItems = _matchObj.items.filter(function (item) {
                  return selection.indexOf(item) > -1;
                });
    
                _parentStatus = _selectItems.filter(function (item) {
                  return _vItems.indexOf(item) > -1;
                }).length === _vItems.length ? true : _selectItems.length || value === -1 ? -1 : false;
              }
    
              return this.handleSelectRow({
                row: _matchObj.parent
              }, _parentStatus);
            }
          } else {
            if (value) {
              if (selection.indexOf(row) === -1) {
                selection.push(row);
              }
            } else {
              VueUtil.remove(selection, function (item) {
                return item === row;
              });
            }
          }
        }
    
        this.checkSelectionStatus();
      },
      handleToggleCheckRowEvent: function handleToggleCheckRowEvent(params, evnt) {
        var selection = this.selection; // 在 v3.0 中废弃 selectConfig
    
        var checkboxConfig = this.checkboxConfig || this.selectConfig || {};
        var property = checkboxConfig.checkField;
        var row = params.row;
        var value = property ? !VueUtil.get(row, property) : selection.indexOf(row) === -1;
    
        if (evnt) {
          this.triggerCheckRowEvent(evnt, params, value);
        } else {
          this.handleSelectRow(params, value);
        }
      },
      triggerCheckRowEvent: function triggerCheckRowEvent(evnt, params, value) {
        // 在 v3.0 中废弃 selectConfig
        var checkboxConfig = this.checkboxConfig || this.selectConfig || {};
        var checkMethod = checkboxConfig.checkMethod;
    
        if (!checkMethod || checkMethod({
          row: params.row,
          rowIndex: params.rowIndex,
          $rowIndex: params.$rowIndex
        })) {
          this.handleSelectRow(params, value);
    
          tools.UtilTools.emitEvent(this, 'select-change', [VueUtil.assign({
            selection: this.getSelectRecords(),
            reserves: this.getSelectReserveRecords(),
            checked: value,
            $table: this
          }, params), evnt]);
        }
      },
    
      /**
       * 多选，切换某一行的选中状态
       */
      toggleRowSelection: function toggleRowSelection(row) {
        this.handleToggleCheckRowEvent({
          row: row
        });
        return this.$nextTick();
      },
    
      /**
       * 用于多选行，设置所有行的选中状态
       * @param {Boolean} value 是否选中
       */
      setAllSelection: function setAllSelection(value) {
        var tableFullData = this.tableFullData,
            treeConfig = this.treeConfig,
            selection = this.selection; // 在 v3.0 中废弃 selectConfig
    
        var checkboxConfig = this.checkboxConfig || this.selectConfig || {};
        var property = checkboxConfig.checkField,
            reserve = checkboxConfig.reserve,
            checkStrictly = checkboxConfig.checkStrictly,
            checkMethod = checkboxConfig.checkMethod;
        var selectRows = []; // 包含新增的数据
    
        if (!checkStrictly) {
          if (property) {
            var indexKey = ''.concat(treeConfig ? '$' : '', 'rowIndex');
    
            var setValFn = function setValFn(row, rowIndex) {
              var _checkMethod;
    
              if (!checkMethod || checkMethod((_checkMethod = {
                row: row
              }, tools.UtilTools.defineProperty(_checkMethod, indexKey, rowIndex), tools.UtilTools.defineProperty(_checkMethod, '$rowIndex', rowIndex), _checkMethod))) {
                VueUtil.set(row, property, value);
              }
            };
    
            var clearValFn = function clearValFn(row, rowIndex) {
              var _checkMethod2;
    
              if (!checkMethod || (checkMethod((_checkMethod2 = {
                row: row
              }, tools.UtilTools.defineProperty(_checkMethod2, indexKey, rowIndex), tools.UtilTools.defineProperty(_checkMethod2, '$rowIndex', rowIndex), _checkMethod2)) ? 0 : selection.indexOf(row) > -1)) {
                VueUtil.set(row, property, value);
              }
            };
    
            if (treeConfig) {
              VueUtil.eachTree(tableFullData, value ? setValFn : clearValFn, treeConfig);
            } else {
              tableFullData.forEach(value ? setValFn : clearValFn);
            }
          } else {
            if (treeConfig) {
              if (value) {
                VueUtil.eachTree(tableFullData, function (row, $rowIndex) {
                  if (!checkMethod || checkMethod({
                    row: row,
                    $rowIndex: $rowIndex
                  })) {
                    selectRows.push(row);
                  }
                }, treeConfig);
              } else {
                if (checkMethod) {
                  VueUtil.eachTree(tableFullData, function (row, $rowIndex) {
                    if (checkMethod({
                      row: row,
                      $rowIndex: $rowIndex
                    }) ? 0 : selection.indexOf(row) > -1) {
                      selectRows.push(row);
                    }
                  }, treeConfig);
                }
              }
            } else {
              if (value) {
                if (checkMethod) {
                  selectRows = tableFullData.filter(function (row, rowIndex) {
                    return selection.indexOf(row) > -1 || checkMethod({
                      row: row,
                      rowIndex: rowIndex,
                      $rowIndex: rowIndex
                    });
                  });
                } else {
                  selectRows = tableFullData.slice(0);
                }
              } else {
                if (checkMethod) {
                  selectRows = tableFullData.filter(function (row, rowIndex) {
                    return checkMethod({
                      row: row,
                      rowIndex: rowIndex,
                      $rowIndex: rowIndex
                    }) ? 0 : selection.indexOf(row) > -1;
                  });
                }
              }
            }
          }
    
          this.selection = value && reserve ? selection.concat(selectRows.filter(function (row) {
            return selection.indexOf(row) === -1;
          })) : selectRows;
        }
    
        this.treeIndeterminates = [];
        this.checkSelectionStatus();
      },
      checkSelectionStatus: function checkSelectionStatus() {
        var tableFullData = this.tableFullData,
            editStore = this.editStore,
            selection = this.selection,
            treeIndeterminates = this.treeIndeterminates; // 在 v3.0 中废弃 selectConfig
    
        var checkboxConfig = this.checkboxConfig || this.selectConfig || {};
        var property = checkboxConfig.checkField,
            checkStrictly = checkboxConfig.checkStrictly,
            checkMethod = checkboxConfig.checkMethod;
        var insertList = editStore.insertList; // 包含新增的数据
    
        if (insertList.length) {
          tableFullData = tableFullData.concat(insertList);
        }
    
        if (!checkStrictly) {
          var allDisabled = true;
          if (property) {
            this.isAllSelected = tableFullData.length && tableFullData.every(checkMethod ? function (row, rowIndex) {
              var canCheck = checkMethod({
                row: row,
                rowIndex: rowIndex,
                $rowIndex: rowIndex
              });

              if(canCheck) {
                allDisabled = false;
                return VueUtil.get(row, property);
              } else {
                return true;
              }

            } : function (row) {
              return VueUtil.get(row, property);
            }) && !allDisabled;
            this.isIndeterminate = !this.isAllSelected && tableFullData.some(function (row) {
              return VueUtil.get(row, property) || treeIndeterminates.indexOf(row) > -1;
            });
          } else {
            this.isAllSelected = tableFullData.length && tableFullData.every(checkMethod ? function (row, rowIndex) {

              var canCheck = checkMethod({
                row: row,
                rowIndex: rowIndex,
                $rowIndex: rowIndex
              });

              if(canCheck) {
                allDisabled = false;
                return selection.indexOf(row) > -1;
              } else {
                return true;
              }
            } : function (row) {
              return selection.indexOf(row) > -1;
            }) && !allDisabled;
            this.isIndeterminate = !this.isAllSelected && tableFullData.some(function (row) {
              return treeIndeterminates.indexOf(row) > -1 || selection.indexOf(row) > -1;
            });
          }
        }
      },
      // 保留选中状态
      reserveCheckSelection: function reserveCheckSelection() {
        var selection = this.selection,
            fullDataRowIdData = this.fullDataRowIdData; // 在 v3.0 中废弃 selectConfig
    
        var checkboxConfig = this.checkboxConfig || this.selectConfig || {};
        var reserve = checkboxConfig.reserve;
    
        var rowkey = tools.UtilTools.getRowkey(this);
    
        if (reserve && selection.length) {
          this.selection = selection.map(function (row) {
            var rowid = '' + VueUtil.get(row, rowkey);
            return fullDataRowIdData[rowid] ? fullDataRowIdData[rowid].row : row;
          });
        }
      },
    
      /**
       * 获取保留选中的行
       */
      getSelectReserveRecords: function getSelectReserveRecords() {
        var selection = this.selection,
            fullDataRowIdData = this.fullDataRowIdData; // 在 v3.0 中废弃 selectConfig
    
        var checkboxConfig = this.checkboxConfig || this.selectConfig || {};
        var reserve = checkboxConfig.reserve;
    
        var rowkey = tools.UtilTools.getRowkey(this);
    
        if (reserve && selection.length) {
          return selection.filter(function (row) {
            return !fullDataRowIdData['' + VueUtil.get(row, rowkey)];
          });
        }
    
        return [];
      },
    
      /**
       * 多选，选中所有事件
       */
      triggerCheckAllEvent: function triggerCheckAllEvent(evnt, value) {
        this.setAllSelection(value);
    
        tools.UtilTools.emitEvent(this, 'select-all', [{
          selection: this.getSelectRecords(),
          reserves: this.getSelectReserveRecords(),
          checked: value,
          $table: this
        }, evnt]);
      },
    
      /**
       * 多选，切换所有行的选中状态
       */
      toggleAllSelection: function toggleAllSelection() {
        this.triggerCheckAllEvent(null, !this.isAllSelected);
        return this.$nextTick();
      },
    
      /**
       * 用于多选行，手动清空用户的选择
       */
      clearSelection: function clearSelection() {
        var tableFullData = this.tableFullData,
            treeConfig = this.treeConfig; // 在 v3.0 中废弃 selectConfig
    
        var checkboxConfig = this.checkboxConfig || this.selectConfig || {};
        var property = checkboxConfig.checkField;
    
        if (property) {
          if (treeConfig) {
            VueUtil.eachTree(tableFullData, function (item) {
              return VueUtil.set(item, property, false);
            }, treeConfig);
          } else {
            tableFullData.forEach(function (item) {
              return VueUtil.set(item, property, false);
            });
          }
        }
    
        this.isAllSelected = false;
        this.isIndeterminate = false;
        this.selection = [];
        this.treeIndeterminates = [];
        return this.$nextTick();
      },
    
      /**
       * 处理单选框默认勾选
       */
      handleRadioDefChecked: function handleRadioDefChecked() {
        var _this$radioConfig = this.radioConfig,
            radioConfig = _this$radioConfig === void 0 ? {} : _this$radioConfig,
            fullDataRowIdData = this.fullDataRowIdData;
        var rowid = radioConfig.checkRowKey;
    
        if (rowid && fullDataRowIdData[rowid]) {
          this.setRadioRow(fullDataRowIdData[rowid].row);
        }
      },
    
      /**
       * 单选，行选中事件
       */
      triggerRadioRowEvent: function triggerRadioRowEvent(evnt, params) {
        var _this$radioConfig2 = this.radioConfig,
            radioConfig = _this$radioConfig2 === void 0 ? {} : _this$radioConfig2;
        var checkMethod = radioConfig.checkMethod;
    
        if (!checkMethod || checkMethod({
          row: params.row,
          rowIndex: params.rowIndex,
          $rowIndex: params.$rowIndex
        })) {
          var isChange = this.selectRow !== params.row;
          this.setRadioRow(params.row);
    
          if (isChange) {
            tools.UtilTools.emitEvent(this, 'radio-change', [params, evnt]);
          }
        }
      },
      triggerCurrentRowEvent: function triggerCurrentRowEvent(evnt, params) {
        var isChange = this.currentRow !== params.row;
        this.setCurrentRow(params.row);
    
        if (isChange) {
          tools.UtilTools.emitEvent(this, 'current-change', [params, evnt]);
        }
      },
    
      /**
       * 用于当前行，设置某一行为高亮状态
       * @param {Row} row 行对象
       */
      setCurrentRow: function setCurrentRow(row, column) {

        if(this.currentRow != row) {
          this.scrollToRow(row, column);
        }

        this.clearCurrentRow();
        this.clearCurrentColumn();
        this.currentRow = row;
    
        if (this.highlightCurrentRow) {
          VueUtil.loop(this.$el.querySelectorAll('[data-rowid="'.concat(tools.UtilTools.getRowid(this, row), '"]')), function (elem) {
            return tools.DomTools.addClass(elem, 'row--current');
          });
        }
        
        return this.$nextTick();
      },
    
      /**
       * 用于单选行，设置某一行为选中状态
       * @param {Row} row 行对象
       */
      setRadioRow: function setRadioRow(row) {
        if (this.selectRow !== row) {
          this.clearRadioRow();
        }
    
        this.selectRow = row;
        return this.$nextTick();
      },
    
      /**
       * 用于当前行，手动清空当前高亮的状态
       */
      clearCurrentRow: function clearCurrentRow() {
        this.currentRow = null;
        this.hoverRow = null;
        VueUtil.loop(this.$el.querySelectorAll('.row--current'), function (elem) {
          return tools.DomTools.removeClass(elem, 'row--current');
        });
        return this.$nextTick();
      },
    
      /**
       * 用于单选行，手动清空用户的选择
       */
      clearRadioRow: function clearRadioRow() {
        this.selectRow = null;
        return this.$nextTick();
      },
    
      /**
       * 用于当前行，获取当前行的数据
       */
      getCurrentRow: function getCurrentRow() {
        return this.currentRow;
      },
    
      /**
       * 用于单选行，获取当已选中的数据
       */
      getRadioRow: function getRadioRow() {
        return this.selectRow;
      },
    
      /**
       * 行 hover 事件
       */
      triggerHoverEvent: function triggerHoverEvent(evnt, _ref4) {
        var row = _ref4.row;
        this.setHoverRow(row);
      },
      setHoverRow: function setHoverRow(row) {
        var rowid = tools.UtilTools.getRowid(this, row);
    
        this.clearHoverRow();
        VueUtil.loop(this.$el.querySelectorAll('[data-rowid="'.concat(rowid, '"]')), function (elem) {
          return tools.DomTools.addClass(elem, 'row--hover');
        });
        this.hoverRow = row;
      },
      clearHoverRow: function clearHoverRow() {
        VueUtil.loop(this.$el.querySelectorAll('.vue-xtable-body--row.row--hover'), function (elem) {
          return tools.DomTools.removeClass(elem, 'row--hover');
        });
        this.hoverRow = null;
      },
      triggerHeaderCellClickEvent: function triggerHeaderCellClickEvent(evnt, params) {
        var _lastResizeTime = this._lastResizeTime,
            sortOpts = this.sortOpts;
        var column = params.column,
            cell = params.cell;
    
        var triggerResizable = _lastResizeTime && _lastResizeTime > Date.now() - 300;
    
        var triggerSort = this.getEventTargetNode(evnt, cell, 'vue-xtable-sort-wrapper').flag;
        var triggerFilter = this.getEventTargetNode(evnt, cell, 'vue-xtable-filter-wrapper').flag;
    
        if (sortOpts.trigger === 'cell' && !(triggerResizable || triggerSort || triggerFilter)) {
          this.triggerSortEvent(evnt, column, column.order === 'desc' ? 'asc' : column.order === 'asc' ? 'asc' : 'desc');
        }
    
        tools.UtilTools.emitEvent(this, 'header-cell-click', [VueUtil.assign({
          triggerResizable: triggerResizable,
          triggerSort: triggerSort,
          triggerFilter: triggerFilter
        }, params), evnt]);
    
        if (this.highlightCurrentColumn) {
          return this.setCurrentColumn(column, true);
        }
    
        return this.$nextTick();
      },
    
      /**
       * 用于当前列，设置某列行为高亮状态
       * @param {ColumnConfig} column 列配置
       */
      setCurrentColumn: function setCurrentColumn(column) {
        this.clearCurrentRow();
        this.clearCurrentColumn();
        this.currentColumn = column;
        VueUtil.loop(this.$el.querySelectorAll('.'.concat(column.id)), function (elem) {
          return tools.DomTools.addClass(elem, 'col--current');
        });
        return this.$nextTick();
      },
    
      /**
       * 用于当前列，手动清空当前高亮的状态
       */
      clearCurrentColumn: function clearCurrentColumn() {
        this.currentColumn = null;
        VueUtil.loop(this.$el.querySelectorAll('.col--current'), function (elem) {
          return tools.DomTools.removeClass(elem, 'col--current');
        });
        return this.$nextTick();
      },
      checkValidate: function checkValidate(type) {
        if (baseTable._valid) {
          return this.triggerValidate(type);
        }
    
        return this.$nextTick();
      },
    
      /**
       * 当单元格发生改变时
       * 如果存在规则，则校验
       */
      handleChangeCell: function handleChangeCell(evnt, params) {
        var _this21 = this;
    
        this.checkValidate('blur').catch(function (e) {
          return e;
        }).then(function () {
          _this21.handleActived(params, evnt).then(function () {
            return _this21.checkValidate('change');
          }).catch(function (e) {
            return e;
          });
        });
      },
    
      /**
       * 列点击事件
       * 如果是单击模式，则激活为编辑状态
       * 如果是双击模式，则单击后选中状态
       */
      triggerCellClickEvent: function triggerCellClickEvent(evnt, params) {
        var $el = this.$el,
            highlightCurrentRow = this.highlightCurrentRow,
            editStore = this.editStore,
            _this$radioConfig3 = this.radioConfig,
            radioConfig = _this$radioConfig3 === void 0 ? {} : _this$radioConfig3,
            _this$expandConfig = this.expandConfig,
            expandConfig = _this$expandConfig === void 0 ? {} : _this$expandConfig,
            _this$treeConfig = this.treeConfig,
            treeConfig = _this$treeConfig === void 0 ? {} : _this$treeConfig,
            editConfig = this.editConfig,
            _this$mouseConfig = this.mouseConfig,
            mouseConfig = _this$mouseConfig === void 0 ? {} : _this$mouseConfig;
        var actived = editStore.actived;
        var row = params.row,
            column = params.column,
            cell = params.cell; // 在 v3.0 中废弃 selectConfig
    
        var checkboxConfig = this.checkboxConfig || this.selectConfig || {}; // 解决 checkbox 重复触发两次问题
    
        if (isTargetRadioOrCheckbox(evnt, column, 'radio') || isTargetRadioOrCheckbox(evnt, column, 'checkbox', 'checkbox') || isTargetRadioOrCheckbox(evnt, column, 'selection', 'checkbox')) {
          // 在 v3.0 中废弃 type=selection
          return;
        } // 如果是展开行
    
    
        if ((expandConfig.trigger === 'row' || column.type === 'expand' && expandConfig.trigger === 'cell') && !this.getEventTargetNode(evnt, $el, 'vue-xtable-table--expanded').flag) {
          this.triggerRowExpandEvent(evnt, params);
        } // 如果是树形表格
    
    
        if (treeConfig.trigger === 'row' || column.treeNode && treeConfig.trigger === 'cell') {
          this.triggerTreeExpandEvent(evnt, params);
        }
    
        if ((!column.treeNode || !this.getEventTargetNode(evnt, $el, 'vue-xtable-tree-wrapper').flag) && (column.type !== 'expand' || !this.getEventTargetNode(evnt, $el, 'vue-xtable-table--expanded').flag)) {
          // 如果是高亮行
          // 为修复行高亮和单元格选中，不在同一个事件下的bug，把高亮行的实现移动到mousedown事件中
          // if (highlightCurrentRow) {
          //   if (radioConfig.trigger === 'row' || !this.getEventTargetNode(evnt, $el, 'vue-xtable-checkbox').flag && !this.getEventTargetNode(evnt, $el, 'vue-xtable-radio').flag) {
          //     this.triggerCurrentRowEvent(evnt, params);
          //   }
          // }
           // 如果是单选框
    
    
          if ((radioConfig.trigger === 'row' || column.type === 'radio' && radioConfig.trigger === 'cell') && !this.getEventTargetNode(evnt, $el, 'vue-xtable-radio').flag) {
            this.triggerRadioRowEvent(evnt, params);
          } // 如果是复选框
    
    
          if ((checkboxConfig.trigger === 'row' || (column.type === 'checkbox' || column.type === 'selection') && checkboxConfig.trigger === 'cell') && !this.getEventTargetNode(evnt, params.cell, 'vue-xtable-checkbox').flag) {
            // 在 v3.0 中废弃 type=selection
            this.handleToggleCheckRowEvent(params, evnt);
          } // 如果设置了单元格选中功能，则不会使用点击事件去处理（只能支持双击模式）
    
    
          if (!mouseConfig.checked) {
            if (editConfig) {
              if (editConfig.trigger === 'manual') {
                if (actived.args && actived.row === row && column !== actived.column) {
                  this.handleChangeCell(evnt, params);
                }
              } else if (!actived.args || cell !== actived.args.cell) {
                if (editConfig.trigger === 'click') {
                  this.handleChangeCell(evnt, params);
                } else if (editConfig.trigger === 'dblclick') {
                  if (editConfig.mode === 'row' && actived.row === params.row) {
                    this.handleChangeCell(evnt, params);
                  } else {
                    this.handleSelected(params, evnt);
                  }
                }
              }
            }
          }
        }
    
        tools.UtilTools.emitEvent(this, 'cell-click', [params, evnt]);
      },
    
      /**
       * 列双击点击事件
       * 如果是双击模式，则激活为编辑状态
       */
      triggerCellDBLClickEvent: function triggerCellDBLClickEvent(evnt, params) {
        var _this22 = this;
    
        var editStore = this.editStore,
            editConfig = this.editConfig;
        var actived = editStore.actived;
    
        if (editConfig && editConfig.trigger === 'dblclick') {
          if (!actived.args || evnt.currentTarget !== actived.args.cell) {
            if (editConfig.mode === 'row') {
              this.checkValidate('blur').catch(function (e) {
                return e;
              }).then(function () {
                _this22.handleActived(params, evnt).then(function () {
                  return _this22.checkValidate('change');
                }).catch(function (e) {
                  return e;
                });
              });
            } else if (editConfig.mode === 'cell') {
              this.handleActived(params, evnt).then(function () {
                return _this22.checkValidate('change');
              }).catch(function (e) {
                return e;
              });
            }
          }
        }
    
        tools.UtilTools.emitEvent(this, 'cell-dblclick', [params, evnt]);
      },
    
      /**
       * 点击排序事件
       */
      triggerSortEvent: function triggerSortEvent(evnt, column, order) {
        var property = column.property;
    
        if (column.sortable || column.remoteSort) {
          var evntParams = {
            column: column,
            property: property,
            field: property,
            prop: property,
            $table: this
          };
    
          if (column.order === order) {
            this.clearSort(column.property);
          } else {
            this.sort(property, order);
          }

          var orderParam = [];
          for (var j = 0; j < this.sortingColumns.length; j++) {
            var sortingColumn = this.sortingColumns[j];
            if (sortingColumn.property && sortingColumn.order) {
              orderParam.push({
                property: sortingColumn.property,
                order: sortingColumn.order
              });
            }
          }

          evntParams.order = orderParam;
    
          tools.UtilTools.emitEvent(this, 'sort-change', [evntParams, evnt]);
        }
      },
      sort: function sort(field, order) {
        var visibleColumn = this.visibleColumn,
            tableFullColumn = this.tableFullColumn,
            remoteSort = this.remoteSort,
            singleSort = this.singleSort;
        var column = VueUtil.find(visibleColumn, function (item) {
          return item.property === field;
        });
        var isRemote = VueUtil.isBoolean(column.remoteSort) ? column.remoteSort : remoteSort;
    
        if (column.sortable || column.remoteSort) {
          if (!order) {
            order = column.order === 'desc' ? 'asc' : 'desc';
          }
    
          if (column.order !== order) {
            if(singleSort) {
              tableFullColumn.forEach(function (column) {
                  column.order = null;
              });
              this.sortingColumns = [];
            }
            column.order = order; // 如果是服务端排序，则跳过本地排序处理
            if(this.sortingColumns.indexOf(column) == -1)  this.sortingColumns.push(column); //加入排序顺序数组

            if (!isRemote) {
              this.handleTableData(true);
            }
          }
    
          return this.$nextTick().then(this.updateStyle);
        }
    
        return this.$nextTick();
      },
    
      /**
       * 手动清空排序条件，数据会恢复成未排序的状态
       */
      clearSort: function clearSort(property) {
        var self = this;
        this.tableFullColumn.forEach(function (column) {
          if(!property || property == column.property) {
            column.order = null;
            VueUtil.remove(self.sortingColumns, function(item) {
              return item === column;
            });
          }
        });
        return this.handleTableData(true);
      },
    
      /**
       * 关闭筛选
       * @param {Event} evnt 事件
       */
      closeFilter: function closeFilter(evnt) {
        VueUtil.assign(this.filterStore, {
          isAllSelected: false,
          isIndeterminate: false,
          options: [],
          visible: false
        });
        return this.$nextTick();
      },
    
      /**
       * 展开行事件
       */
      triggerRowExpandEvent: function triggerRowExpandEvent(evnt, _ref5) {
        var row = _ref5.row;
        var rest = this.toggleRowExpansion(row);
    
        tools.UtilTools.emitEvent(this, 'toggle-expand-change', [{
          row: row,
          rowIndex: this.getRowIndex(row),
          $table: this
        }, evnt]);
    
        return rest;
      },
    
      /**
       * 切换展开行
       */
      toggleRowExpansion: function toggleRowExpansion(row) {
        return this.setRowExpansion(row);
      },
    
      /**
       * 处理默认展开行
       */
      handleDefaultRowExpand: function handleDefaultRowExpand() {
        var _this$expandConfig2 = this.expandConfig,
            expandConfig = _this$expandConfig2 === void 0 ? {} : _this$expandConfig2,
            tableFullData = this.tableFullData,
            fullDataRowIdData = this.fullDataRowIdData;
        var expandAll = expandConfig.expandAll,
            expandRowKeys = expandConfig.expandRowKeys;
    
        if (expandAll) {
          this.expandeds = tableFullData.slice(0);
        } else if (expandRowKeys) {
          var defExpandeds = [];
          expandRowKeys.forEach(function (rowid) {
            if (fullDataRowIdData[rowid]) {
              defExpandeds.push(fullDataRowIdData[rowid].row);
            }
          });
          this.expandeds = defExpandeds;
        }
      },
    
      /**
       * 设置所有行的展开与否
       * @param {Boolean} expanded 是否展开
       */
      setAllRowExpansion: function setAllRowExpansion(expanded) {
        this.expandeds = expanded ? this.tableFullData.slice(0) : [];
        return this.$nextTick().then(this.recalculate);
      },
    
      /**
       * 设置展开行，二个参数设置这一行展开与否
       * 支持单行
       * 支持多行
       * @param {Array/Row} rows 行数据
       * @param {Boolean} expanded 是否展开
       */
      setRowExpansion: function setRowExpansion(rows, expanded) {
        var expandeds = this.expandeds,
            _this$expandConfig3 = this.expandConfig,
            expandConfig = _this$expandConfig3 === void 0 ? {} : _this$expandConfig3;
        var isToggle = arguments.length === 1;
    
        if (rows) {
          if (!VueUtil.isArray(rows)) {
            rows = [rows];
          }
    
          if (expandConfig.accordion) {
            // 只能同时展开一个
            expandeds.length = 0;
            rows = rows.slice(rows.length - 1, rows.length);
          }
    
          rows.forEach(function (row) {
            var index = expandeds.indexOf(row);
    
            if (index > -1) {
              if (isToggle || !expanded) {
                expandeds.splice(index, 1);
              }
            } else {
              if (isToggle || expanded) {
                expandeds.push(row);
              }
            }
          });
        }
    
        return this.$nextTick().then(this.recalculate);
      },
      // 在 v3.0 中废弃 getRecords
      hasRowExpand: function hasRowExpand(row) {
        tools.UtilTools.warn('vue.xtable.error.delFunc', ['hasRowExpand', 'isExpandByRow']);
    
        return this.isExpandByRow(row);
      },
    
      /**
       * 判断行是否为展开状态
       * @param {Row} row 行对象
       */
      isExpandByRow: function isExpandByRow(row) {
        return this.expandeds.indexOf(row) > -1;
      },
    
      /**
       * 手动清空展开行状态，数据会恢复成未展开的状态
       */
      clearRowExpand: function clearRowExpand() {
        var _this23 = this;
    
        var isExists = this.expandeds.length;
        this.expandeds = [];
        return this.$nextTick().then(function () {
          return isExists ? _this23.recalculate() : 0;
        });
      },
      getRowExpandRecords: function getRowExpandRecords() {
        return this.expandeds.slice(0);
      },
      getTreeExpandRecords: function getTreeExpandRecords() {
        return this.treeExpandeds.slice(0);
      },
    
      /**
       * 获取数表格状态
       */
      getTreeStatus: function getTreeStatus() {
        if (this.treeConfig) {
          return {
            config: this.treeConfig,
            expandeds: this.getTreeExpandRecords()
          };
        }
    
        return null;
      },
    
      /**
       * 展开树节点事件
       */
      triggerTreeExpandEvent: function triggerTreeExpandEvent(evnt, _ref6) {
        var _this24 = this;
    
        var row = _ref6.row;
        var rest = this.toggleTreeExpansion(row);
    
        tools.UtilTools.emitEvent(this, 'toggle-tree-change', [{
          row: row,
          rowIndex: this.getRowIndex(row),
          $table: this
        }, evnt]);
    
        this.$nextTick(function () {
          var currentRow = _this24.currentRow,
              currentColumn = _this24.currentColumn;
    
          if (currentRow) {
            _this24.setCurrentRow(currentRow);
          } else if (currentColumn) {
            _this24.setCurrentColumn(currentColumn);
          }
        });
        return rest;
      },
    
      /**
       * 切换/展开树节点
       */
      toggleTreeExpansion: function toggleTreeExpansion(row) {
        return this.setTreeExpansion(row);
      },
    
      /**
       * 处理默认展开树节点
       */
      handleDefaultTreeExpand: function handleDefaultTreeExpand() {
        var treeConfig = this.treeConfig,
            tableFullData = this.tableFullData;
    
        if (treeConfig) {
          var expandAll = treeConfig.expandAll,
              expandRowKeys = treeConfig.expandRowKeys;
          var children = treeConfig.children;
          var treeExpandeds = [];
    
          if (expandAll) {
            VueUtil.filterTree(tableFullData, function (row) {
              var rowChildren = row[children];
    
              if (rowChildren && rowChildren.length) {
                treeExpandeds.push(row);
              }
            }, treeConfig);
            this.treeExpandeds = treeExpandeds;
          } else if (expandRowKeys) {
            var rowkey = tools.UtilTools.getRowkey(this);
    
            expandRowKeys.forEach(function (rowid) {
              var matchObj = VueUtil.findTree(tableFullData, function (item) {
                return rowid === VueUtil.get(item, rowkey);
              }, treeConfig);
              var rowChildren = matchObj ? matchObj.item[children] : 0;
    
              if (rowChildren && rowChildren.length) {
                treeExpandeds.push(matchObj.item);
              }
            });
            this.treeExpandeds = treeExpandeds;
          }
        }
      },
    
      /**
       * 设置所有树节点的展开与否
       * @param {Boolean} expanded 是否展开
       */
      setAllTreeExpansion: function setAllTreeExpansion(expanded) {
        var tableFullData = this.tableFullData,
            treeConfig = this.treeConfig;
        var children = treeConfig.children;
        var treeExpandeds = [];
    
        if (expanded) {
          VueUtil.eachTree(tableFullData, function (row) {
            var rowChildren = row[children];
    
            if (rowChildren && rowChildren.length) {
              treeExpandeds.push(row);
            }
          }, treeConfig);
        }
    
        this.treeExpandeds = treeExpandeds;
        return this.$nextTick().then(this.recalculate);
      },
    
      /**
       * 设置展开树形节点，二个参数设置这一行展开与否
       * 支持单行
       * 支持多行
       * @param {Array/Row} rows 行数据
       * @param {Boolean} expanded 是否展开
       */
      setTreeExpansion: function setTreeExpansion(rows, expanded) {
        var tableFullData = this.tableFullData,
            treeExpandeds = this.treeExpandeds,
            treeConfig = this.treeConfig;
        var children = treeConfig.children;
        var isToggle = arguments.length === 1;
    
        if (rows) {
          if (!VueUtil.isArray(rows)) {
            rows = [rows];
          }
    
          if (treeConfig.accordion) {
            rows = rows.slice(rows.length - 1, rows.length);
          }
    
          rows.forEach(function (row) {
            var rowChildren = row[children];
    
            if (rowChildren && rowChildren.length) {
              var index = treeExpandeds.indexOf(row);
    
              if (treeConfig.accordion) {
                // 同一级只能展开一个
                var matchObj = VueUtil.findTree(tableFullData, function (item) {
                  return item === row;
                }, treeConfig);
                VueUtil.remove(treeExpandeds, function (item) {
                  return matchObj.items.indexOf(item) > -1;
                });
              }
    
              if (index > -1) {
                if (isToggle || !expanded) {
                  treeExpandeds.splice(index, 1);
                }
              } else {
                if (isToggle || expanded) {
                  treeExpandeds.push(row);
                }
              }
            }
          });
        }
    
        return this.$nextTick().then(this.recalculate);
      },
      // 在 v3.0 中废弃 hasTreeExpand
      hasTreeExpand: function hasTreeExpand(row) {
        tools.UtilTools.warn('vue.xtable.error.delFunc', ['hasTreeExpand', 'isTreeExpandByRow']);
    
        return this.isTreeExpandByRow(row);
      },
    
      /**
       * 判断行是否为树形节点展开状态
       * @param {Row} row 行对象
       */
      isTreeExpandByRow: function isTreeExpandByRow(row) {
        return this.treeExpandeds.indexOf(row) > -1;
      },
    
      /**
       * 手动清空树形节点的展开状态，数据会恢复成未展开的状态
       */
      clearTreeExpand: function clearTreeExpand() {
        var _this25 = this;
    
        var isExists = this.treeExpandeds.length;
        this.treeExpandeds = [];
        return this.$nextTick().then(function () {
          return isExists ? _this25.recalculate() : 0;
        });
      },
    
      /**
       * 获取虚拟滚动状态
       */
      getVirtualScroller: function getVirtualScroller() {
        var $refs = this.$refs,
            scrollXLoad = this.scrollXLoad,
            scrollYLoad = this.scrollYLoad;
        var bodyElem = $refs.tableBody.$el;
        return {
          scrollX: scrollXLoad,
          scrollY: scrollYLoad,
          scrollTop: bodyElem.scrollTop,
          scrollLeft: bodyElem.scrollLeft
        };
      },
    
      /**
       * 横向 X 可视渲染事件处理
       */
      triggerScrollXEvent: function triggerScrollXEvent(evnt) {
        this.updateVirtualScrollX();
      },
      updateVirtualScrollX: function updateVirtualScrollX(force) {
        var $refs = this.$refs,
            visibleColumn = this.visibleColumn,
            scrollXStore = this.scrollXStore;
        var startIndex = scrollXStore.startIndex,
            renderSize = scrollXStore.renderSize,
            offsetSize = scrollXStore.offsetSize,
            visibleSize = scrollXStore.visibleSize;
        var scrollBodyElem = $refs.tableBody.$el;
        var scrollLeft = scrollBodyElem.scrollLeft;
        var toVisibleIndex = 0;
        var width = 0;
        var preload = force || false;
    
        for (var index = 0; index < visibleColumn.length; index++) {
          width += visibleColumn[index].renderWidth;
    
          if (scrollLeft < width) {
            toVisibleIndex = index;
            break;
          }
        }
    
        if (force || scrollXStore.visibleIndex !== toVisibleIndex) {
          var marginSize = 0;
          // var marginSize = Math.min(Math.floor((renderSize - visibleSize) / 2), visibleSize);
          if (scrollXStore.visibleIndex === toVisibleIndex) {
            scrollXStore.startIndex = toVisibleIndex;
          } else if (scrollXStore.visibleIndex > toVisibleIndex) {
            // 向左
            preload = toVisibleIndex - offsetSize <= startIndex;
    
            if (preload) {
              scrollXStore.startIndex = Math.max(0, Math.max(marginSize, toVisibleIndex - marginSize));
            }
          } else {
            // 向右
            preload = toVisibleIndex + visibleSize + offsetSize >= startIndex + renderSize;
    
            if (preload) {
              scrollXStore.startIndex = Math.max(0, Math.min(visibleColumn.length - renderSize, toVisibleIndex - marginSize));
            }
          }
    
          if (preload) {
            this.updateScrollXData();
          }
    
          scrollXStore.visibleIndex = toVisibleIndex;
        }
    
        this.clostTooltip();
      },
    
      /**
       * 纵向 Y 可视渲染事件处理
       */
      triggerScrollYEvent: function triggerScrollYEvent(evnt) {
        // webkit 浏览器使用最佳的渲染方式
        if (isWebkit && this.scrollYStore.adaptive) {
          this.loadScrollYData(evnt);
        } else {
          this.debounceScrollY(evnt);
        }
      },
      debounceScrollY: VueUtil._debounce(function (evnt) {
        this.loadScrollYData(evnt);
      }, debounceScrollYDuration, {
        leading: false,
        trailing: true
      }),
    
      /**
       * 纵向 Y 可视渲染处理
       */
      loadScrollYData: function loadScrollYData(evnt) {
        var afterFullData = this.afterFullData,
            scrollYStore = this.scrollYStore,
            isLoadData = this.isLoadData;
        var startIndex = scrollYStore.startIndex,
            renderSize = scrollYStore.renderSize,
            offsetSize = scrollYStore.offsetSize,
            visibleSize = scrollYStore.visibleSize,
            rowHeight = scrollYStore.rowHeight;
        var scrollBodyElem = evnt.target;
        var scrollTop = scrollBodyElem.scrollTop;
        var toVisibleIndex = Math.ceil(scrollTop / rowHeight);
        var preload = false;
    
        if (isLoadData || scrollYStore.visibleIndex !== toVisibleIndex) {
          var marginSize = Math.min(Math.floor((renderSize - visibleSize) / 2), visibleSize);
    
          if (scrollYStore.visibleIndex > toVisibleIndex) {
            // 向上
            preload = toVisibleIndex - offsetSize <= startIndex;
    
            if (preload) {
              scrollYStore.startIndex = Math.max(0, toVisibleIndex - Math.max(marginSize, renderSize - visibleSize));
            }
          } else {
            // 向下
            preload = toVisibleIndex + visibleSize + offsetSize >= startIndex + renderSize;
    
            if (preload) {
              scrollYStore.startIndex = Math.max(0, Math.min(afterFullData.length - renderSize, toVisibleIndex - marginSize));
            }
          }
    
          if (preload) {
            this.updateScrollYData();
          }
    
          scrollYStore.visibleIndex = toVisibleIndex;
          this.isLoadData = false;
        }
      },
      // 计算可视渲染相关数据
      computeScrollLoad: function computeScrollLoad() {
        var _this26 = this;
    
        return this.$nextTick().then(function () {
          var vSize = _this26.vSize,
              scrollXLoad = _this26.scrollXLoad,
              scrollYLoad = _this26.scrollYLoad,
              scrollYStore = _this26.scrollYStore,
              scrollXStore = _this26.scrollXStore,
              visibleColumn = _this26.visibleColumn,
              optimizeOpts = _this26.optimizeOpts,
              rowHeightMaps = _this26.rowHeightMaps;
          var scrollX = optimizeOpts.scrollX,
              scrollY = optimizeOpts.scrollY;
          var tableBody = _this26.$refs.tableBody;
          var tableBodyElem = tableBody ? tableBody.$el : null;
          var tableHeader = _this26.$refs.tableHeader;
    
          if (tableBodyElem) {
            // 计算 X 逻辑
            if (scrollXLoad) {
              var firstColumn = visibleColumn[0];
              var cWidth = firstColumn ? firstColumn.renderWidth : 40;
              var visibleXSize = (parseFloat(scrollX.vSize || Math.ceil(tableBodyElem.clientWidth / cWidth)) || 0);
              scrollXStore.visibleSize = visibleXSize; // 自动优化
    
              if (!scrollX.oSize) {
                scrollXStore.offsetSize = visibleXSize;
              }
    
              if (!scrollX.rSize) {
                scrollXStore.renderSize = visibleXSize + 6;
              }
    
              _this26.updateScrollXData();
            } else {
              _this26.updateScrollXSpace();
            } // 计算 Y 逻辑
    
    
            if (scrollYLoad) {
              var rHeight;
    
              if (scrollY.rHeight) {
                rHeight = scrollY.rHeight;
              } else {
                var firstTrElem = tableBodyElem.querySelector('tbody>tr');
    
                if (!firstTrElem && tableHeader) {
                  firstTrElem = tableHeader.$el.querySelector('thead>tr');
                }
    
                if (firstTrElem) {
                  rHeight = firstTrElem.clientHeight;
                }
              } // 默认的行高
    
    
              if (!rHeight) {
                rHeight = rowHeightMaps[vSize || 'default'];
              }
    
              var clientHeight = tableBodyElem.clientHeight;
              var propsHeight = parseInt(_this26.height);
              var calcHeight = propsHeight ? propsHeight : clientHeight;
              var visibleYSize = (parseFloat(scrollY.vSize || Math.ceil(calcHeight / rHeight)) || 0);
              scrollYStore.visibleSize = visibleYSize;
              scrollYStore.rowHeight = rHeight; // 自动优化
    
              if (!scrollY.oSize) {
                scrollYStore.offsetSize = visibleYSize;
              }
    
              if (!scrollY.rSize) {
                scrollYStore.renderSize = VueUtil.isFirefox ? visibleYSize * 6 : VueUtil.isEdge ? visibleYSize * 10 : isWebkit ? visibleYSize + 2 : visibleYSize * 6;
              }
    
              _this26.updateScrollYData();
            } else {
              _this26.updateScrollYSpace();
            }
          }
    
          _this26.$nextTick(_this26.updateStyle);
        });
      },
      updateScrollXData: function updateScrollXData() {
        var visibleColumn = this.visibleColumn,
            scrollXStore = this.scrollXStore;
        this.tableColumn = visibleColumn.slice(scrollXStore.startIndex, scrollXStore.startIndex + scrollXStore.renderSize);
        this.updateScrollXSpace();
      },
      // 更新横向 X 可视渲染上下剩余空间大小
      updateScrollXSpace: function updateScrollXSpace() {
        var $refs = this.$refs,
            elemStore = this.elemStore,
            visibleColumn = this.visibleColumn,
            scrollXStore = this.scrollXStore,
            scrollXLoad = this.scrollXLoad,
            tableWidth = this.tableWidth,
            scrollbarWidth = this.scrollbarWidth;
        var tableHeader = $refs.tableHeader,
            tableBody = $refs.tableBody,
            tableFooter = $refs.tableFooter;
        var headerElem = tableHeader ? tableHeader.$el.querySelector('.vue-xtable-table--header') : null;
        var bodyElem = tableBody.$el.querySelector('.vue-xtable-table--body');
        var footerElem = tableFooter ? tableFooter.$el.querySelector('.vue-xtable-table--footer') : null;
        var leftSpaceWidth = visibleColumn.slice(0, scrollXStore.startIndex).reduce(function (previous, column) {
          return previous + column.renderWidth;
        }, 0);
        var marginLeft = '';
    
        if (scrollXLoad) {
          marginLeft = ''.concat(leftSpaceWidth, 'px');
        }
    
        if (headerElem) {
          headerElem.style.marginLeft = marginLeft;
        }
    
        bodyElem.style.marginLeft = marginLeft;
    
        if (footerElem) {
          footerElem.style.marginLeft = marginLeft;
        }
    
        var containerList = ['main'];
        containerList.forEach(function (name) {
          var layoutList = ['header', 'body', 'footer'];
          layoutList.forEach(function (layout) {
            var xSpaceElem = elemStore[''.concat(name, '-').concat(layout, '-xSpace')];
    
            if (xSpaceElem) {
              xSpaceElem.style.width = scrollXLoad ? ''.concat(tableWidth + (layout === 'header' ? scrollbarWidth : 0), 'px') : '';
            }
          });
        });
        this.$nextTick(this.updateStyle);
      },
      updateScrollYData: function updateScrollYData() {
        this.handleTableData();
        this.updateScrollYSpace();
      },
      // 更新纵向 Y 可视渲染上下剩余空间大小
      updateScrollYSpace: function updateScrollYSpace() {
        var elemStore = this.elemStore,
            scrollYStore = this.scrollYStore,
            scrollYLoad = this.scrollYLoad,
            afterFullData = this.afterFullData;
        var bodyHeight = afterFullData.length * scrollYStore.rowHeight;
        var topSpaceHeight = Math.max(scrollYStore.startIndex * scrollYStore.rowHeight, 0);
        var containerList = ['main', 'left', 'right'];
        var marginTop = '';
        var ySpaceHeight = '';
    
        if (scrollYLoad) {
          marginTop = ''.concat(topSpaceHeight, 'px');
          ySpaceHeight = ''.concat(bodyHeight, 'px');
        }
    
        containerList.forEach(function (name) {
          var layoutList = ['header', 'body', 'footer'];
          var tableElem = elemStore[''.concat(name, '-body-table')];
    
          if (tableElem) {
            tableElem.style.marginTop = marginTop;
          }
    
          layoutList.forEach(function (layout) {
            var ySpaceElem = elemStore[''.concat(name, '-').concat(layout, '-ySpace')];
    
            if (ySpaceElem) {
              ySpaceElem.style.height = ySpaceHeight;
            }
          });
        });
        this.$nextTick(this.updateStyle);
      },
    
      /**
       * 如果有滚动条，则滚动到对应的位置
       * @param {Number} scrollLeft 左距离
       * @param {Number} scrollTop 上距离
       */
      scrollTo: function scrollTo(scrollLeft, scrollTop) {
        var _this27 = this;
    
        var bodyElem = this.$refs.tableBody.$el;
    
        if (VueUtil.isNumber(scrollLeft)) {
          var tableFooter = this.$refs.tableFooter;
    
          if (tableFooter) {
            tableFooter.$el.scrollLeft = scrollLeft;
          } else {
            bodyElem.scrollLeft = scrollLeft;
          }
        }
    
        if (VueUtil.isNumber(scrollTop)) {
          var rightBody = this.$refs.rightBody;
    
          if (rightBody) {
            rightBody.$el.scrollTop = scrollTop;
          }
    
          bodyElem.scrollTop = scrollTop;
        }
    
        if (this.scrollXLoad || this.scrollYLoad) {
          return new Promise(function (resolve) {
            return setTimeout(function () {
              return resolve(_this27.$nextTick());
            }, 50);
          });
        }
    
        return this.$nextTick();
      },
    
      /**
       * 如果有滚动条，则滚动到对应的行
       * @param {Row} row 行对象
       * @param {ColumnConfig} column 列配置
       */
      scrollToRow: function scrollToRow(row, column) {
        var rest = [];
    
        if (row && this.fullAllDataRowMap.has(row)) {
          rest.push(tools.DomTools.rowToVisible(this, row));
        }
    
        rest.push(this.scrollToColumn(column));
        return Promise.all(rest);
      },
    
      /**
       * 如果有滚动条，则滚动到对应的列
       * @param {ColumnConfig} column 列配置
       */
      scrollToColumn: function scrollToColumn(column) {
        if (column && this.fullColumnMap.has(column)) {
          return tools.DomTools.colToVisible(this, column);
        }
    
        return this.$nextTick();
      },
    
      /**
       * 对于树形结构中，可以直接滚动到指定深层节点中
       * 对于某些特定的场景可能会用到，比如定位到某一节点
       * @param {Row} row 行对象
       */
      scrollToTreeRow: function scrollToTreeRow(row) {
        var _this28 = this;
    
        var tableFullData = this.tableFullData,
            treeConfig = this.treeConfig;
    
        if (treeConfig) {
          var matchObj = VueUtil.findTree(tableFullData, function (item) {
            return item === row;
          }, treeConfig);
    
          if (matchObj) {
            var nodes = matchObj.nodes;
            nodes.forEach(function (row, index) {
              if (index < nodes.length - 1 && !_this28.isTreeExpandByRow(row)) {
                _this28.setTreeExpansion(row, true);
              }
            });
          }
        }
    
        return this.$nextTick();
      },
    
      /**
       * 手动清除滚动相关信息，还原到初始状态
       */
      clearScroll: function clearScroll() {
        var _this29 = this;
    
        var $refs = this.$refs;
        var tableBody = $refs.tableBody;
        var tableBodyElem = tableBody ? tableBody.$el : null;
        var tableFooter = $refs.tableFooter;
        var tableFooterElem = tableFooter ? tableFooter.$el : null;
        var footerTargetElem = tableFooterElem || tableBodyElem;
    
        if (tableBodyElem) {
          tableBodyElem.scrollTop = 0;
        }
    
        if (footerTargetElem) {
          footerTargetElem.scrollLeft = 0;
        }
    
        return new Promise(function (resolve) {
          return setTimeout(function () {
            return resolve(_this29.$nextTick());
          });
        });
      },
    
      /**
       * 更新表尾合计
       */
      updateFooter: function updateFooter() {
        var showFooter = this.showFooter,
            tableColumn = this.tableColumn,
            footerMethod = this.footerMethod;
    
        if (showFooter && footerMethod) {
          this.footerData = tableColumn.length ? footerMethod({
            columns: tableColumn,
            data: this.afterFullData
          }) : [];
        }
    
        return this.$nextTick();
      },
    
      /**
       * 更新列状态
       * 如果组件值 v-model 发生 change 时，调用改函数用于更新某一列编辑状态
       * 如果单元格配置了校验规则，则会进行校验
       */
      updateStatus: function updateStatus(scope, cellValue) {
        var _this30 = this;
    
        var customVal = !VueUtil.isUndefined(cellValue);
        return this.$nextTick().then(function () {
          var $refs = _this30.$refs,
              tableData = _this30.tableData,
              editRules = _this30.editRules,
              validStore = _this30.validStore;
    
          if (scope && $refs.tableBody && editRules) {
            var row = scope.row,
                column = scope.column;
            var type = 'change';
    
            var hasCellRule = _this30.hasCellRules(type, row, column);
            var rowIndex = tableData.indexOf(row);
  
            var cell = tools.DomTools.getCell(_this30, {
              row: row,
              rowIndex: rowIndex,
              column: column
            });
  
            if (cell) {

              if (_this30.validResults.length > 0) {
                var rowId = tools.UtilTools.getRowid(_this30, row);

                var f = _this30.validResults.filter(function(result) {
                  if (result.rowId != rowId || result.property != column.property) {
                    _this30.clearValidate();
                    return true;
                  }
                });

                if (f.length != _this30.validResults.length) {
                  _this30.validResults = f;
                }
              }

              if (hasCellRule) {
                return _this30.validCellRules(type, row, column, cellValue).then(function () {
                  if (customVal && validStore.visible) {
                    tools.UtilTools.setCellValue(row, column, cellValue);
                  }
    
                  _this30.clearValidate();
                }).catch(function (_ref7) {
                  var rule = _ref7.rule;
    
                  if (customVal) {
                    tools.UtilTools.setCellValue(row, column, cellValue);
                  }
    
                  _this30.showValidTooltip({
                    rule: rule,
                    row: row,
                    column: column,
                    cell: cell
                  });
                });
              }
            }
          }
        });
      },
      updateZindex: function updateZindex() {
        if (this.tZindex < tools.UtilTools.getLastZIndex()) {
          this.tZindex = tools.UtilTools.nextZIndex(this);
        }
      },
    
      getUserSetting: function() {
        var setting = {
          width: {},
          hidden: [],
          fixed: {},
          filters: {},
          order: [],
          drag: [],
        };
        var table = this;
        var tableFullColumn = this.tableFullColumn;
        var sortingColumns = this.sortingColumns;
        var isGroup = this.isGroup;

        for (var i = 0; i < tableFullColumn.length; i++) {
          var column = tableFullColumn[i];
          var property = column.property;
          var visible = column.visible;
          var resizeWidth = column.resizeWidth;
          var renderWidth = column.renderWidth;
          var fixed = column.fixed;
          var filters = column.filters;
          var dragged = column.dragged;

          if (property && !visible) {
            setting.hidden.push(property);
          }
          if (property && resizeWidth) {
            setting.width[property] = renderWidth;
          }
          if (property && fixed) {
            setting.fixed[property] = fixed;
          }
          if (property && filters && filters.length) {
            if (filters.length > 0) {
              setting.filters[property] = [];
            } 
            filters.forEach(function(filter) {
              if (filter.checked) {
                setting.filters[property].push(filter);
              }
            });
          }
          if (!isGroup && property && dragged) {
            setting.drag.push({
              property: property,
              index: this.getColumnIndex(column)
            });
          }
        }

        if(isGroup) {
          this.collectColumn.forEach(function(collectColumn, index) {
            if (collectColumn.dragged) {
              setting.drag.push({
                property: table.beforeDragColumn.indexOf(collectColumn),
                index: index
              });
            }
          });
        }

        for (var j = 0; j < sortingColumns.length; j++) {
          var sortingColumn = sortingColumns[j];
          if (sortingColumn.property && sortingColumn.order) {
            setting.order.push({
              property: sortingColumn.property,
              order: sortingColumn.order
            });
          }
        }

        // 解决重复
        setting.order = VueUtil.uniqBy(setting.order, 'property');

        return JSON.stringify(setting);
      },

      safeGetColumnByField: function(property) {
        var col = this.getColumnByField(property);

        if (!col) {
          col = VueUtil.find(this.tableFullColumn, function (columnConfig) {
            return columnConfig.property === property;
          });
        }

        return col;
      },

      setUserSetting: function(settingStr) {
        var setting =  JSON.parse(settingStr);
        var tableFullColumn = this.tableFullColumn;
        var table = this;
        for (var i = 0; i < tableFullColumn.length; i++) {
          var column = tableFullColumn[i];
          var property = column.property;

          if (property && setting.hidden && setting.hidden.indexOf(property) > -1) {
            column.visible = false;
          }

          if (property && setting.width && setting.width.hasOwnProperty(property)) {
            column.resizeWidth = setting.width[property];
          }

          if (property && setting.fixed && setting.fixed.hasOwnProperty(property)) {
            column.fixed = setting.fixed[property];
          }

          if (property && setting.filters && setting.filters.hasOwnProperty(property)) {
            setting.filters[property].forEach(function(settingFilter) {
              var columnFilter = VueUtil.find(column.filters, function(columnFilter) {
                return(settingFilter.value && columnFilter.value === settingFilter.value)
                  || (settingFilter.data && VueUtil.isEqual(columnFilter.data, settingFilter.data));
              });

              if (columnFilter) {
                columnFilter.checked = true;
              } else {
                column.filters.push(settingFilter);
              }
            });
          }
        }

        if (setting.order) {
          setting.order.forEach(function(orderObj) {
            var sortingColumn = table.safeGetColumnByField(orderObj.property);
            table.sortingColumns.push(sortingColumn);
            sortingColumn.order = orderObj.order;
          });
        }

        var dragColumns = setting.drag;
        dragColumns.sort(function(a, b) {
          var aIndex = table.getColumnIndex(table.safeGetColumnByField(a.property));
          var bIndex = table.getColumnIndex(table.safeGetColumnByField(b.property));
          return aIndex - bIndex;
        });

        VueUtil.forEach(dragColumns, function(dragObj) {
          var property = dragObj.property;
          var index = dragObj.index;
          var cols = table.isGroup ? table.collectColumn : tableFullColumn;

          if (!table.originColumn) {
            table.originColumn = cols.slice(0);
          }

          var column = table.isGroup ? table.beforeDragColumn[property] : table.safeGetColumnByField(property);
          var oldColumnIndex = cols.indexOf(column);
          var newColumnIndex = index;

          var currRow = cols.splice(oldColumnIndex, 1)[0];
          currRow.dragged = 'dragged';
          cols.splice(newColumnIndex, 0, currRow);
        });
        
        if (this.$toolbar) {
          this.$toolbar.resetResizable();
        }
    
        if (setting.width && setting.width.length > 0) {
          this.analyColumnWidth();
          this.recalculate(true);
        }

        this.handleTableData(true);
        this.cacheColumnMap();
        return this.refreshColumn();
      },

      columnDragHandler: function () {
        var self = this;

        this.$nextTick(function () {
          if(this.isGroup && !this.beforeDragColumn) {
            this.beforeDragColumn = this.collectColumn.slice(0);
          }
          self.columnDragSortable = Sortable.create(self.$el.querySelector('.body--wrapper>.vue-xtable-table--header .vue-xtable-header--row'), {
            handle: '.vue-xtable-header--column:not(.col--fixed):not(.col--index):not(.col--drag)',
            onEnd: this.onDragEnd,
            onMove: function(evt) {
              if (evt.related.classList.contains('col--fixed') || evt.related.classList.contains('col--gutter') || evt.related.classList.contains('col--index') || evt.related.classList.contains('col--drag')) return false;
            },
            scroll: self.$el.querySelector('.body--wrapper.vue-xtable-table--body-wrapper'),
          });
        });
      },

      onDragEnd: function (param) {
        // var item = param.item;
        var newIndex = param.newIndex;
        var oldIndex = param.oldIndex;
        var xTable = this;

        var cols = xTable.getTableColumn(),
            fullColumn = cols.fullColumn,
            tableColumn = cols.tableColumn;

        // var targetThElem = item;
        // var wrapperElem = targetThElem.parentNode;
        // var newColumn = fullColumn[newIndex];
        // if (newColumn.fixed) {
        //   // 错误的移动
        //   if (newIndex > oldIndex) {
        //     wrapperElem.insertBefore(targetThElem, wrapperElem.children[oldIndex]);
        //   } else {
        //     wrapperElem.insertBefore(wrapperElem.children[oldIndex], targetThElem);
        //   }

        //   return xTable.$notify.error({
        //     message: this.$t('vue.xtable.error.fixColumnDrag')
        //   });
        // } // 转换真实索引
        var col = this.isGroup ? this.collectColumn.slice(0) : fullColumn;

        if (!xTable.originColumn) {
          xTable.originColumn = col.slice(0);
        }

        var oldColumnIndex = xTable.getColumnIndex(tableColumn[oldIndex]);
        var newColumnIndex = xTable.getColumnIndex(tableColumn[newIndex]); // 移动到目标列
        var currCol = col.splice(oldColumnIndex, 1)[0];
        currCol.dragged = 'dragged';
        col.splice(newColumnIndex, 0, currCol);
        xTable.loadColumn(col);
        xTable.$emit('column-drag', {
          newIndex: newIndex,
          oldIndex: oldIndex,
          column: currCol,
        });
      },

      resetColumnDrag: function() {
        if(this.originColumn) {
          this.loadColumn(this.originColumn);
        }
      },

      /*************************
       * Publish methods
       *************************/
      // 与工具栏对接
      connect: function connect(_ref8) {
        var toolbar = _ref8.toolbar;
        this.$toolbar = toolbar;
      },
      // 检查触发源是否属于目标节点
      getEventTargetNode: tools.DomTools.getEventTargetNode,
      /*************************
       * Publish methods
       *************************/


      initRowDrag: function () {
        var self = this;
        self.$nextTick(function () {
          self.rowSortable = Sortable.create(self.$el.querySelector('.body--wrapper>.vue-xtable-table--body tbody'), {
            handle: '.col--drag',
            onEnd: function (obj) {

              var newIndex = obj.newIndex,
                oldIndex = obj.oldIndex;
              var data = self.tableData;
              var currRow = data.splice(oldIndex, 1)[0];
              data.splice(newIndex, 0, currRow);
              self.setCurrentRow(currRow);

              self.clearSelected();
              self.clearChecked();
              self.clearCopyed();
              self.clearIndexChecked();
              self.clearHeaderChecked();

              self.editStore.checked.rowNodes = null;
              self.editStore.selected.args = null;

              self.$emit('row-drag', {
                newIndex: newIndex,
                oldIndex: oldIndex,
                row: currRow,
              });
            }
          });
        });
      },
    
      getVisibleIndexFromColumnIndex: function(columnIndex) {
        return this.tableColumn.indexOf(this.tableFullColumn[columnIndex]);
      },

      getColumnIndexFromVisibleIndex: function(visibleIndex) {
        return this.tableFullColumn.indexOf(this.tableColumn[visibleIndex]);
      }
    }; // Module methods
    
    var funcs = 'filter,clearFilter,closeMenu,getMouseSelecteds,getMouseCheckeds,clearCopyed,clearChecked,clearHeaderChecked,clearIndexChecked,clearSelected,insert,insertAt,insertRow,delRow,remove,removeSelecteds,revert,revertData,getRecordset,getInsertRecords,getRemoveRecords,getUpdateRecords,clearActived,getActiveRow,hasActiveRow,isActiveByRow,setActiveRow,setActiveCell,setSelectCell,clearValidate,fullValidate,validate,exportCsv,openExport,exportData,openImport,importData,readFile,importByFile,print'.split(',');
    funcs.forEach(function (name) {
      Methods[name] = function () {
        return this['_'.concat(name)] ? this['_'.concat(name)].apply(this, arguments) : null;
      };
    });
    mod.methods = Methods;
  })();

  /**
   * 渲染浮固定列
   * 分别渲染左边固定列和右边固定列
   * 如果宽度足够情况下，则不需要渲染固定列
   * @param {Function} h 创建 VNode 函数
   * @param {Object} $table 表格实例
   * @param {String} fixedType 固定列类型
   */
  function renderFixed(h, $table, fixedType) {
      var tableData = $table.tableData,
          tableColumn = $table.tableColumn,
          visibleColumn = $table.visibleColumn,
          collectColumn = $table.collectColumn,
          isGroup = $table.isGroup,
          vSize = $table.vSize,
          showHeader = $table.showHeader,
          showFooter = $table.showFooter,
          columnStore = $table.columnStore,
          footerData = $table.footerData;
      var fixedColumn = columnStore[''.concat(fixedType, 'List')];
      return h('div', {
        class: 'vue-xtable-table--fixed-'.concat(fixedType, '-wrapper'),
        ref: ''.concat(fixedType, 'Container')
      }, [showHeader ? h('vue-xtable-header', {
        props: {
          fixedType: fixedType,
          tableData: tableData,
          tableColumn: tableColumn,
          visibleColumn: visibleColumn,
          collectColumn: collectColumn,
          size: vSize,
          fixedColumn: fixedColumn,
          isGroup: isGroup
        },
        ref: ''.concat(fixedType, 'Header')
      }) : null, h('vue-xtable-body', {
        props: {
          fixedType: fixedType,
          tableData: tableData,
          tableColumn: tableColumn,
          visibleColumn: visibleColumn,
          collectColumn: collectColumn,
          fixedColumn: fixedColumn,
          size: vSize,
          isGroup: isGroup
        },
        ref: ''.concat(fixedType, 'Body')
      }), showFooter ? h('vue-xtable-footer', {
        props: {
          fixedType: fixedType,
          footerData: footerData,
          tableColumn: tableColumn,
          visibleColumn: visibleColumn,
          size: vSize,
          fixedColumn: fixedColumn
        },
        ref: ''.concat(fixedType, 'Footer')
      }) : null]);
    }
    
    var VueXtable = {
      name: 'VueXtable',
      props: {
        /** 基本属性 */
        // 数据
        data: Array,
        // 初始化绑定动态列
        customs: Array,
        // 表格的高度
        height: [Number, String],
        // 表格的最大高度
        maxHeight: [Number, String],
        // 所有列是否允许拖动列宽调整大小
        resizable: {
          type: Boolean,
          default: function _default() {
            return GlobalConfig.resizable;
          }
        },
        // 是否带有斑马纹
        stripe: {
          type: Boolean,
          default: function _default() {
            return GlobalConfig.stripe;
          }
        },
        // 是否带有纵向边框
        border: {
          type: Boolean,
          default: function _default() {
            return GlobalConfig.border;
          }
        },
        // 表格的尺寸
        size: {
          type: String,
          default: function _default() {
            return GlobalConfig.size;
          }
        },
        // 列的宽度是否自撑开
        fit: {
          type: Boolean,
          default: function _default() {
            return GlobalConfig.fit;
          }
        },
        // 表格是否加载中
        loading: Boolean,
        // 所有的列对其方式
        align: {
          type: String,
          default: function _default() {
            return GlobalConfig.align;
          }
        },
        // 所有的表头列的对齐方式
        headerAlign: {
          type: String,
          default: function _default() {
            return GlobalConfig.headerAlign;
          }
        },
        // 所有的表尾列的对齐方式
        footerAlign: {
          type: String,
          default: function _default() {
            return GlobalConfig.footerAlign;
          }
        },
        // 是否显示表头
        showHeader: {
          type: Boolean,
          default: function _default() {
            return GlobalConfig.showHeader;
          }
        },
        // 只对 type=index 时有效，自定义序号的起始值
        startIndex: {
          type: Number,
          default: 0
        },
        // 是否要高亮当前选中行
        highlightCurrentRow: {
          type: Boolean,
          default: function _default() {
            return GlobalConfig.highlightCurrentRow;
          }
        },
        // 鼠标移到行是否要高亮显示
        highlightHoverRow: {
          type: Boolean,
          default: function _default() {
            return GlobalConfig.highlightHoverRow;
          }
        },
        // 是否要高亮当前选中列
        highlightCurrentColumn: {
          type: Boolean,
          default: function _default() {
            return GlobalConfig.highlightCurrentColumn;
          }
        },
        // 鼠标移到列是否要高亮显示
        highlightHoverColumn: {
          type: Boolean,
          default: function _default() {
            return GlobalConfig.highlightHoverColumn;
          }
        },
        // 激活单元格编辑时是否高亮显示
        highlightCell: Boolean,
        // 是否显示表尾合计
        showFooter: Boolean,
        // 表尾合计的计算方法
        footerMethod: Function,
        // 给行附加 className
        rowClassName: [String, Function],
        // 给单元格附加 className
        cellClassName: [String, Function],
        // 给表头的行附加 className
        headerRowClassName: [String, Function],
        // 给表头的单元格附加 className
        headerCellClassName: [String, Function],
        // 给表尾的行附加 className
        footerRowClassName: [String, Function],
        // 给表尾的单元格附加 className
        footerCellClassName: [String, Function],
        // 给单元格附加样式
        cellStyle: [Object, Function],
        // 给表头单元格附加样式
        headerCellStyle: [Object, Function],
        // 给表尾单元格附加样式
        footerCellStyle: [Object, Function],
        // 给行附加样式
        rowStyle: [Object, Function],
        // 给表头行附加样式
        headerRowStyle: [Object, Function],
        // 给表尾行附加样式
        footerRowStyle: [Object, Function],
        // 合并行或列
        spanMethod: Function,
        // 表尾合并行或列
        footerSpanMethod: Function,
        // 设置所有内容过长时显示为省略号
        showOverflow: {
          type: [Boolean, String],
          default: function _default() {
            return GlobalConfig.showOverflow;
          }
        },
        // 设置表头所有内容过长时显示为省略号
        showHeaderOverflow: {
          type: [Boolean, String],
          default: function _default() {
            return GlobalConfig.showHeaderOverflow;
          }
        },
        // 是否所有服务端筛选
        remoteFilter: Boolean,
        // 是否所有服务端排序
        remoteSort: Boolean,
        // 只允许单列排序
        singleSort: Boolean,
        // 自定义所有列的排序方法
        sortMethod: Function,
        // 所有列宽度
        columnWidth: [Number, String],
        // 所有列最小宽度，把剩余宽度按比例分配
        columnMinWidth: [Number, String],
    
        /** 高级属性 */
        // 主键配置
        columnKey: Boolean,
        rowKey: Boolean,
        rowId: {
          type: String,
          default: function _default() {
            return GlobalConfig.rowId;
          }
        },
        zIndex: Number,
        // 是否自动监听父容器变化去更新响应式表格宽高
        autoResize: Boolean,
        // 是否自动根据状态属性去更新响应式表格宽高
        syncResize: [Boolean, String, Number],
        // 排序配置项
        sortConfig: Object,
        // 单选框配置
        radioConfig: Object,
        // （v3.0 废弃）
        selectConfig: Object,
        // 复选框配置项
        checkboxConfig: Object,
        // tooltip 配置项
        tooltipConfig: Object,
        // 展开行配置项
        expandConfig: Object,
        // 树形结构配置项
        treeConfig: Object,
        // 快捷菜单配置项
        contextMenu: Object,
        // 鼠标配置项
        mouseConfig: Object,
        // 按键配置项
        keyboardConfig: Object,
        // 编辑配置项
        editConfig: Object,
        // 校验配置项
        validConfig: Object,
        // 校验规则配置项
        editRules: Object,
        // 优化配置项
        optimization: Object,
        // 额外的参数
        params: Object,
        //允许列拖拽排序
        columnDrag: Boolean,
      },
      provide: function provide() {
        return {
          $table: this
        };
      },
      inject: {
        $grid: {
          default: null
        }
      },
      mixins: [],
      data: function data() {
        return {
          id: VueUtil.uniqueId(),
          // 列分组配置
          collectColumn: [],
          // 完整所有列
          tableFullColumn: [],
          // 渲染的列
          tableColumn: [],
          // 渲染中的数据
          tableData: [],
          // 是否启用了横向 X 可视渲染方式加载
          scrollXLoad: false,
          // 是否启用了纵向 Y 可视渲染方式加载
          scrollYLoad: false,
          // 是否存在纵向滚动条
          overflowY: true,
          // 是否存在横向滚动条
          overflowX: false,
          // 纵向滚动条的宽度
          scrollbarWidth: 0,
          // 横向滚动条的高度
          scrollbarHeight: 0,
          // 复选框属性，是否全选
          isAllSelected: false,
          // 复选框属性，有选中且非全选状态
          isIndeterminate: false,
          // 复选框属性，已选中的列
          selection: [],
          // 当前行
          currentRow: null,
          // 单选框属性，选中行
          selectRow: null,
          // 表尾合计数据
          footerData: [],
          // 已展开的行
          expandeds: [],
          // 已展开树节点
          treeExpandeds: [],
          // 树节点不确定状态的列表
          treeIndeterminates: [],
          // 当前选中的筛选列
          filterStore: {
            isAllSelected: false,
            isIndeterminate: false,
            style: null,
            options: [],
            column: null,
            multiple: false,
            visible: false
          },
          // 存放列相关的信息
          columnStore: {
            leftList: [],
            centerList: [],
            rightList: [],
            resizeList: [],
            pxList: [],
            pxMinList: [],
            scaleList: [],
            scaleMinList: [],
            autoList: []
          },
          // 存放快捷菜单的信息
          ctxMenuStore: {
            selected: null,
            visible: false,
            showChild: false,
            selectChild: null,
            list: [],
            style: null
          },
          // 存放可编辑相关信息
          editStore: {
            indexs: {
              columns: []
            },
            titles: {
              columns: []
            },
            // 所有选中
            checked: {
              rows: [],
              columns: [],
              tRows: [],
              tColumns: []
            },
            // 选中源
            selected: {
              row: null,
              column: null
            },
            // 已复制源
            copyed: {
              cut: false,
              rows: [],
              columns: []
            },
            // 激活
            actived: {
              row: null,
              column: null
            },
            insertList: [],
            removeList: []
          },
          // 存放数据校验相关信息
          validStore: {
            visible: false,
            row: null,
            column: null,
            content: '',
            rule: null,
            isArrow: false
          },
          validResults: [],
          printUrl: '',
          // 存放排序列顺序
          sortingColumns: []
        };
      },
      computed: {
        vSize: function vSize() {
          return this.size || this.$parent.size || this.$parent.vSize;
        },
        validOpts: function validOpts() {
          return VueUtil.assign({
            message: 'default'
          }, GlobalConfig.validConfig, this.validConfig);
        },
        optimizeOpts: function optimizeOpts() {
          return VueUtil.assign({}, GlobalConfig.optimization, this.optimization);
        },
        rowHeightMaps: function rowHeightMaps() {
          return VueUtil.assign({
            default: 48,
            medium: 44,
            small: 40,
            mini: 36
          }, this.optimizeOpts.rHeights);
        },
        vaildTipOpts: function vaildTipOpts() {
          return VueUtil.assign({
            isArrow: false
          }, this.tooltipConfig);
        },
        sortOpts: function sortOpts() {
          return VueUtil.assign({}, GlobalConfig.sortConfig, this.sortConfig);
        },
        // 是否使用了分组表头
        isGroup: function isGroup() {
          return this.collectColumn.some(function (column) {
            return tools.UtilTools.hasChildrenList(column);
          });
        },
        hasTip: function hasTip() {
          return baseTable._tooltip;
        },
        visibleColumn: function visibleColumn() {
          return this.tableFullColumn ? this.tableFullColumn.filter(function (column) {
            return column.visible;
          }) : [];
        },
        isResizable: function isResizable() {
          return this.resizable || this.tableFullColumn.some(function (column) {
            return column.resizable;
          });
        },
        hasFilter: function hasFilter() {
          return this.tableColumn.some(function (column) {
            return column.filters && column.filters.length;
          });
        },
        headerCtxMenu: function headerCtxMenu() {
          return this.ctxMenuOpts.header && this.ctxMenuOpts.header.options ? this.ctxMenuOpts.header.options : [];
        },
        bodyCtxMenu: function bodyCtxMenu() {
          return this.ctxMenuOpts.body && this.ctxMenuOpts.body.options ? this.ctxMenuOpts.body.options : [];
        },
        isCtxMenu: function isCtxMenu() {
          return this.headerCtxMenu.length || this.bodyCtxMenu.length;
        },
        ctxMenuOpts: function ctxMenuOpts() {
          return VueUtil.assign({}, GlobalConfig.menu, this.contextMenu);
        },
        ctxMenuList: function ctxMenuList() {
          var rest = [];
          this.ctxMenuStore.list.forEach(function (list) {
            list.forEach(function (item) {
              rest.push(item);
            });
          });
          return rest;
        },
    
        /**
         * 判断列全选的复选框是否禁用
         */
        isAllCheckboxDisabled: function isAllCheckboxDisabled() {
          var tableFullData = this.tableFullData,
              treeConfig = this.treeConfig; // 在 v3.0 中废弃 selectConfig
    
          var checkboxConfig = this.checkboxConfig || this.selectConfig || {};
          var strict = checkboxConfig.strict,
              checkMethod = checkboxConfig.checkMethod;
    
          if (strict) {
            if (tableFullData.length) {
              if (checkMethod) {
                if (treeConfig) {} // 暂时不支持树形结构
                // 如果所有行都被禁用
    
    
                return tableFullData.every(function (row, rowIndex) {
                  return !checkMethod({
                    row: row,
                    rowIndex: rowIndex,
                    $rowIndex: rowIndex
                  });
                });
              }
    
              return false;
            }
    
            return true;
          }
    
          return false;
        },
        validResultsCell: function() {
          var res = {};
          VueUtil.loop(this.validResults, function(result) {
            if (!res[result.rowId]) {
              res[result.rowId] = {};
            }
            if (!res[result.rowId][result.property]) {
              res[result.rowId][result.property] = [];
            }
            res[result.rowId][result.property].push(result);
          });
          return res;
        }
      },
      watch: {
        data: function data(value) {
          if (!this._isUpdateData) {
            this.loadTableData(value, true).then(this.handleDefault);
          }
    
          this._isUpdateData = false;
        },
        customs: function customs(value) {
          if (!this.isUpdateCustoms) {
            this.mergeCustomColumn(value);
          }
    
          this.isUpdateCustoms = false;
        },
        collectColumn: function collectColumn(value) {
          var _this = this;
    
          var tableFullColumn = tools.UtilTools.getColumnList(value);
    
          this.tableFullColumn = tableFullColumn;
          this.cacheColumnMap();
    
          if (this.customs) {
            this.mergeCustomColumn(this.customs);
          }
    
          this.refreshColumn().then(function () {
            if (_this.scrollXLoad) {
              _this.updateVirtualScrollX(true);
            }
          });
          this.handleTableData(true);
    
          if (this.$toolbar) {
            this.$toolbar.updateColumn(tableFullColumn);
          } // 在 v3.0 中废弃 prop、label
    
    
          if (tableFullColumn.length) {
            var cIndex = Math.floor((tableFullColumn.length - 1) / 2);
    
            if (tableFullColumn[cIndex].prop) {
              tools.UtilTools.warn('vue.xtable.error.delProp', ['prop', 'field']);
            }
    
            if (tableFullColumn[cIndex].label) {
              tools.UtilTools.warn('vue.xtable.error.delProp', ['label', 'title']);
            }
          }
    
          if (this.treeConfig && tableFullColumn.some(function (column) {
            return column.fixed;
          }) && tableFullColumn.some(function (column) {
            return column.type === 'expand';
          })) {
            tools.UtilTools.warn('vue.xtable.error.treeFixedExpand');
          }
        },
        tableColumn: function tableColumn() {
          this.analyColumnWidth();
        },
        height: function height() {
          this.$nextTick(this.recalculate);
        },
        loading: function loading() {
          if (!this._isLoading) {
            this._isLoading = true;
          }
        },
        syncResize: function syncResize(value) {
          if (value) {
            this.$nextTick(this.recalculate);
          }
        },
        columnDrag: {
          handler: function(val) {
            if(val) {
              this.columnDragHandler();
            } else {
              if (this.columnDragSortable) {
                this.columnDragSortable.destroy();
              }
            }
          },
          immediate: true
        },
      },
      created: function created() {
        var _this2 = this;
    
        var _Object$assign = VueUtil.assign(this, {
          tZindex: 0,
          elemStore: {},
          // 存放横向 X 虚拟滚动相关的信息
          scrollXStore: {},
          // 存放纵向 Y 虚拟滚动相关信息
          scrollYStore: {},
          // 存放 tooltip 相关信息
          tooltipStore: {},
          // 表格父容器的高度
          parentHeight: 0,
          // 表格宽度
          tableWidth: 0,
          // 表格高度
          tableHeight: 0,
          // 表头高度
          headerHeight: 0,
          // 表尾高度
          footerHeight: 0,
          // 单选框属性，选中列
          // currentColumn: null,
          // 当前 hover 行
          // hoverRow: null,
          // 最后滚动位置
          lastScrollLeft: 0,
          lastScrollTop: 0,
          // 完整数据、条件处理后
          tableFullData: [],
          afterFullData: [],
          // 缓存数据集
          fullAllDataRowMap: new Map(),
          fullAllDataRowIdData: {},
          fullDataRowMap: new Map(),
          fullDataRowIdData: {},
          fullColumnMap: new Map(),
          fullColumnIdData: {}
        }),
            scrollXStore = _Object$assign.scrollXStore,
            scrollYStore = _Object$assign.scrollYStore,
            optimizeOpts = _Object$assign.optimizeOpts,
            data = _Object$assign.data,
            loading = _Object$assign.loading;
    
        var scrollX = optimizeOpts.scrollX,
            scrollY = optimizeOpts.scrollY; // 是否加载过 Loading 模块
    
        this._isLoading = loading;
    
        if (!tools.UtilTools.getRowkey(this)) {
          tools.UtilTools.error('vue.xtable.error.emptyProp', ['row-id']);
        } // if (this.selectConfig) {
        //   UtilTools.warn('vue.xtable.error.delProp', ['select-config', 'checkbox-config'])
        // }
        // 检查是否有安装需要的模块
    
    
        var errorModuleName;
    
        if (!baseTable._edit && this.editConfig) {
          errorModuleName = 'Edit';
        } else if (!baseTable._valid && this.editRules) {
          errorModuleName = 'Validator';
        } else if (!baseTable._keyboard && (this.keyboardConfig || this.mouseConfig)) {
          errorModuleName = 'Keyboard';
        } else if (!baseTable._resize && this.autoResize) {
          errorModuleName = 'Resize';
        }
    
        if (errorModuleName) {
          throw new Error(tools.UtilTools.getLog('vue.xtable.error.reqModule', [errorModuleName]));
        }
    
        if (scrollY) {
          VueUtil.assign(scrollYStore, {
            startIndex: 0,
            visibleIndex: 0,
            adaptive: VueUtil.isBoolean(scrollY.adaptive) ? scrollY.adaptive : true,
            renderSize: (parseFloat(scrollY.rSize) || 0),
            offsetSize: (parseFloat(scrollY.oSize) || 0)
          });
        }
    
        if (scrollX) {
          VueUtil.assign(scrollXStore, {
            startIndex: 0,
            visibleIndex: 0,
            renderSize: (parseFloat(scrollX.rSize) || 0),
            offsetSize: (parseFloat(scrollX.oSize) || 0)
          });
        }
    
        this.loadTableData(data, true).then(function () {
          _this2.handleDefault();
    
          _this2.updateStyle();
        });
    
        tools.GlobalEvent.on(this, 'mousedown', this.handleGlobalMousedownEvent);
    
        tools.GlobalEvent.on(this, 'blur', this.handleGlobalBlurEvent);
    
        tools.GlobalEvent.on(this, 'mousewheel', this.handleGlobalMousewheelEvent);
    
        tools.GlobalEvent.on(this, 'keydown', this.handleGlobalKeydownEvent);

        tools.GlobalEvent.on(this, 'paste', this.handleGlobalPaste);
    
        tools.GlobalEvent.on(this, 'resize', this.handleGlobalResizeEvent);
    
        tools.GlobalEvent.on(this, 'contextmenu', this.handleGlobalContextmenuEvent);
    
        this.preventEvent(null, 'created', {
          $table: this
        });
      },
      mounted: function mounted() {
        if (this.autoResize && baseTable._resize) {
          this.bindResize();
        }
    
        document.body.appendChild(this.$refs.tableWrapper);
        this.preventEvent(null, 'mounted', {
          $table: this
        });
        this.$nextTick(function() {
          var hasDragCol = VueUtil.find(this.tableColumn, function (col) {
            return col.type === 'drag';
          });
          if(hasDragCol) {
            this.initRowDrag();
          }
        });

      },
      activated: function activated() {
        this.refreshScroll();
        this.preventEvent(null, 'activated', {
          $table: this
        });
      },
      deactivated: function deactivated() {
        this.preventEvent(null, 'deactivated', {
          $table: this
        });
      },
      beforeDestroy: function beforeDestroy() {
        var tableWrapper = this.$refs.tableWrapper;
    
        if (tableWrapper && tableWrapper.parentNode) {
          tableWrapper.parentNode.removeChild(tableWrapper);
        }
    
        if (baseTable._resize) {
          this.unbindResize();
        }
    
        this.closeFilter();
        this.closeMenu();
        this.preventEvent(null, 'beforeDestroy', {
          $table: this
        });

        if (this.columnDragSortable) {
          this.columnDragSortable.destroy();
        }

        if (this.rowSortable) {
          this.rowSortable.destroy();
        }
      },
      destroyed: function destroyed() {
        tools.GlobalEvent.off(this, 'mousedown');
    
        tools.GlobalEvent.off(this, 'blur');
    
        tools.GlobalEvent.off(this, 'mousewheel');
    
        tools.GlobalEvent.off(this, 'keydown');
    
        tools.GlobalEvent.off(this, 'resize');
    
        tools.GlobalEvent.off(this, 'contextmenu');
    
        this.preventEvent(null, 'destroyed', {
          $table: this
        });
      },
      render: function render(h) {
        var _class;
    
        var _e = this._e,
            id = this.id,
            tableData = this.tableData,
            tableColumn = this.tableColumn,
            visibleColumn = this.visibleColumn,
            collectColumn = this.collectColumn,
            isGroup = this.isGroup,
            hasFilter = this.hasFilter,
            isResizable = this.isResizable,
            isCtxMenu = this.isCtxMenu,
            loading = this.loading,
            _isLoading = this._isLoading,
            showHeader = this.showHeader,
            border = this.border,
            stripe = this.stripe,
            height = this.height,
            highlightHoverRow = this.highlightHoverRow,
            highlightHoverColumn = this.highlightHoverColumn,
            highlightCell = this.highlightCell,
            vSize = this.vSize,
            showOverflow = this.showOverflow,
            showHeaderOverflow = this.showHeaderOverflow,
            editConfig = this.editConfig,
            validOpts = this.validOpts,
            _this$mouseConfig = this.mouseConfig,
            mouseConfig = _this$mouseConfig === void 0 ? {} : _this$mouseConfig,
            editRules = this.editRules,
            showFooter = this.showFooter,
            footerMethod = this.footerMethod,
            overflowX = this.overflowX,
            overflowY = this.overflowY,
            scrollXLoad = this.scrollXLoad,
            scrollYLoad = this.scrollYLoad,
            scrollbarHeight = this.scrollbarHeight,
            optimizeOpts = this.optimizeOpts,
            vaildTipOpts = this.vaildTipOpts,
            tooltipConfig = this.tooltipConfig,
            columnStore = this.columnStore,
            filterStore = this.filterStore,
            ctxMenuStore = this.ctxMenuStore,
            footerData = this.footerData,
            hasTip = this.hasTip;
        var leftList = columnStore.leftList,
            rightList = columnStore.rightList;
        return h('div', {
          class: (_class = {
            'vue-xtable-table': 1
          }, tools.UtilTools.defineProperty(_class, 'size--'.concat(vSize), vSize), tools.UtilTools.defineProperty(_class, 'vue-xtable-editable', editConfig), tools.UtilTools.defineProperty(_class, 'show--head', showHeader), tools.UtilTools.defineProperty(_class, 'show--foot', showFooter), tools.UtilTools.defineProperty(_class, 'fixed--left', leftList.length), tools.UtilTools.defineProperty(_class, 'fixed--right', rightList.length), tools.UtilTools.defineProperty(_class, 'all-overflow', showOverflow), tools.UtilTools.defineProperty(_class, 'all-head-overflow', showHeaderOverflow), tools.UtilTools.defineProperty(_class, 'c--highlight', highlightCell), tools.UtilTools.defineProperty(_class, 't--animat', optimizeOpts.animat), tools.UtilTools.defineProperty(_class, 't--stripe', stripe), tools.UtilTools.defineProperty(_class, 't--border', border), tools.UtilTools.defineProperty(_class, 't--selected', mouseConfig.selected), tools.UtilTools.defineProperty(_class, 't--checked', mouseConfig.checked), tools.UtilTools.defineProperty(_class, 'row--highlight', highlightHoverRow), tools.UtilTools.defineProperty(_class, 'column--highlight', highlightHoverColumn), tools.UtilTools.defineProperty(_class, 'is--loading', loading), tools.UtilTools.defineProperty(_class, 'scroll--y', overflowY), tools.UtilTools.defineProperty(_class, 'scroll--x', overflowX), tools.UtilTools.defineProperty(_class, 'virtual--x', scrollXLoad), tools.UtilTools.defineProperty(_class, 'virtual--y', scrollYLoad), _class)
        }, [
        /**
         * 隐藏列
         */
        h('div', {
          class: 'vue-xtable-table-hidden-column',
          ref: 'hideColumn'
        }, this.$slots.default), h('div', {
          class: 'vue-xtable-table--main-wrapper'
        }, [
        /**
         * 主头部
         */
        showHeader ? h('vue-xtable-header', {
          ref: 'tableHeader',
          props: {
            tableData: tableData,
            tableColumn: tableColumn,
            visibleColumn: visibleColumn,
            collectColumn: collectColumn,
            size: vSize,
            isGroup: isGroup
          }
        }) : _e(),
        /**
         * 主内容
         */
        h('vue-xtable-body', {
          ref: 'tableBody',
          props: {
            tableData: tableData,
            tableColumn: tableColumn,
            visibleColumn: visibleColumn,
            collectColumn: collectColumn,
            size: vSize,
            isGroup: isGroup
          }
        }),
        /**
         * 底部汇总
         */
        showFooter ? h('vue-xtable-footer', {
          props: {
            footerData: footerData,
            footerMethod: footerMethod,
            tableColumn: tableColumn,
            visibleColumn: visibleColumn,
            size: vSize
          },
          ref: 'tableFooter'
        }) : null]),
        /**
         * 左侧固定列
         */
        leftList && leftList.length && overflowX ? renderFixed(h, this, 'left') : _e(),
        /**
         * 右侧固定列
         */
        rightList && rightList.length && overflowX ? renderFixed(h, this, 'right') : _e(),
        /**
         * 列宽线
         */
        isResizable ? h('div', {
          class: 'vue-xtable-table--resizable-bar',
          style: overflowX ? {
            'padding-bottom': ''.concat(scrollbarHeight, 'px')
          } : null,
          ref: 'resizeBar'
        }) : _e(),
        /**
         * 加载中
         */
        _isLoading ? h('vue-xtable-loading', {
          props: {
            visible: loading
          }
        }) : _e(), h('div', {
          class: 'vue-xtable-table'.concat(id, '-wrapper ').concat(this.$vnode.data.staticClass || ''),
          ref: 'tableWrapper'
        }, [
        /**
         * 筛选
         */
        hasFilter ? h('vue-xtable-filter', {
          props: {
            optimizeOpts: optimizeOpts,
            filterStore: filterStore
          },
          ref: 'filterWrapper'
        }) : _e(),
        /**
         * 快捷菜单
         */
        isCtxMenu ? h('vue-xtable-context-menu', {
          props: {
            ctxMenuStore: ctxMenuStore
          },
          ref: 'ctxWrapper'
        }) : _e(),
        /**
         * 单元格内容溢出的 tooltip
         */
        hasTip ? h('vue-xtable-tooltip', {
          ref: 'tooltip',
          props: tooltipConfig,
          on: tooltipConfig && tooltipConfig.enterable ? {
            leave: this.handleTooltipLeaveEvent
          } : null
        }) : _e(),
        /**
         * 校验不通过的 tooltip
         */
        hasTip && editRules && (validOpts.message === 'default' ? !height : validOpts.message === 'tooltip') ? h('vue-xtable-tooltip', {
          class: 'vue-xtable-table--valid-error',
          props: validOpts.message === 'tooltip' || tableData.length === 1 ? vaildTipOpts : null,
          ref: 'validTip'
        }) : _e()])]);
      },
      methods: mod.methods
    };
    
    return VueXtable;
});