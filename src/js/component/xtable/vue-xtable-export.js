(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    var mod = definition(context.tools, context.baseTable);
    context.VueXtableExportPanel = mod.VueXtableExportPanel;
    context.VueXtableImportPanel = mod.VueXtableImportPanel;
    context.VueXtableExportMixin = mod.VueXtableExportMixin;
  }
})(this, function(tools, baseTable) {

  var mod = {};

  (function() {
    var VueXtableExportPanel = {
      name: 'VueXtableExportPanel',
      props: {
        defaultOptions: Object,
        storeData: Object
      },
      data: function data() {
        return {
          isAll: false,
          isIndeterminate: false,
          modeList: [{
            value: 'all',
            label: 'vue.xtable.toolbar.expAll'
          }, {
            value: 'selected',
            label: 'vue.xtable.toolbar.expSelected'
          }]
        };
      },
      computed: {
        vSize: function vSize() {
          return this.size || this.$parent.size || this.$parent.vSize;
        },
        showSheet: function showSheet() {
          return VueUtil.includes(['html', 'xml', 'xlsx'], this.defaultOptions.type);
        }
      },
      render: function render(h) {
        var _this = this;
    
        var _e = this._e,
            isAll = this.isAll,
            isIndeterminate = this.isIndeterminate,
            showSheet = this.showSheet,
            defaultOptions = this.defaultOptions,
            storeData = this.storeData,
            modeList = this.modeList;
        return h('vue-dialog', {
          res: 'modal',
          model: {
            value: storeData.visible,
            callback: function callback(value) {
              storeData.visible = value;
            }
          },
          props: {
            title: GlobalConfig.i18n('vue.xtable.toolbar.expTitle'),
            showClose: true,
            // width: 660,
            // mask: true,
            // lockView: true,
            // showFooter: false,
            // maskClosable: true
            appendToBody: VueUtil.getSystemInfo().os === 'iOS'
          },
          on: {
            open: this.showEvent
          }
        }, [h('div', {
          class: 'vue-xtable-export--panel'
        }, [h('table', {
          attrs: {
            cellspacing: 0,
            cellpadding: 0,
            border: 0
          }
        }, [h('tr', [h('td', GlobalConfig.i18n('vue.xtable.toolbar.expName')), h('td', [h('input', {
          ref: 'filename',
          attrs: {
            type: 'text',
            placeholder: GlobalConfig.i18n('vue.xtable.toolbar.expNamePlaceholder')
          },
          domProps: {
            value: defaultOptions.filename
          },
          on: {
            input: function input(evnt) {
              defaultOptions.filename = evnt.target.value;
            }
          }
        })])]), h('tr', [h('td', GlobalConfig.i18n('vue.xtable.toolbar.expType')), h('td', [h('select', {
          on: {
            change: function change(evnt) {
              defaultOptions.type = evnt.target.value;
            }
          }
        }, defaultOptions.types.map(function (item) {
          return h('option', {
            attrs: {
              value: item.value
            },
            domProps: {
              selected: defaultOptions.type === item.value
            }
          }, GlobalConfig.i18n(item.label));
        }))])]), showSheet ? h('tr', [h('td', GlobalConfig.i18n('vue.xtable.toolbar.expSheetName')), h('td', [h('input', {
          attrs: {
            type: 'text',
            placeholder: GlobalConfig.i18n('vue.xtable.toolbar.expSheetNamePlaceholder')
          },
          domProps: {
            value: defaultOptions.sheetName
          },
          on: {
            input: function input(evnt) {
              defaultOptions.sheetName = evnt.target.value;
            }
          }
        })])]) : _e(), h('tr', [h('td', GlobalConfig.i18n('vue.xtable.toolbar.expMode')), h('td', [h('select', {
          on: {
            change: function change(evnt) {
              storeData.mode = evnt.target.value;
            }
          }
        }, modeList.map(function (item) {
          return h('option', {
            attrs: {
              value: item.value
            },
            domProps: {
              selected: storeData.mode === item.value
            }
          }, GlobalConfig.i18n(item.label));
        }))])]), h('tr', [h('td', [GlobalConfig.i18n('vue.xtable.toolbar.expColumn')]), h('td', [h('div', {
          class: 'vue-xtable-export--panel-column'
        }, [h('vue-checkbox', {
          props: {
            indeterminate: isIndeterminate
          },
          model: {
            value: isAll,
            callback: function callback(value) {
              _this.isAll = value;
            }
          },
          on: {
            change: this.allColumnEvent
          }
        }, GlobalConfig.i18n('vue.xtable.toolbar.expAllColumn')), h('ul', storeData.columns.map(function (column) {
          var own = column.own,
              checked = column.checked,
              type = column.type;
          return h('li', {
            class: {
              active: checked
            },
            on: {
              click: function click() {
                column.checked = !checked;
    
                _this.checkStatus();
              }
            }
          }, tools.UtilTools.getFuncText(own.title || own.label || (type === 'index' ? GlobalConfig.i18n('vue.xtable.column.indexTitle') : '')));
        }))])])]), h('tr', [h('td', GlobalConfig.i18n('vue.xtable.toolbar.expOpts')), h('td', [h('vue-checkbox', {
          model: {
            value: defaultOptions.isHeader,
            callback: function callback(value) {
              defaultOptions.isHeader = value;
            }
          }
        }, GlobalConfig.i18n('vue.xtable.toolbar.expOptHeader')), h('vue-checkbox', {
          props: {
            disabled: !storeData.hasFooter
          },
          model: {
            value: defaultOptions.isFooter,
            callback: function callback(value) {
              defaultOptions.isFooter = value;
            }
          }
        }, GlobalConfig.i18n('vue.xtable.toolbar.expOptFooter')), defaultOptions.showOriginal ? h('vue-checkbox', {
          props: {
            disabled: storeData.forceOriginal
          },
          model: {
            value: defaultOptions.original,
            callback: function callback(value) {
              defaultOptions.original = value;
            }
          }
        }, GlobalConfig.i18n('vue.xtable.toolbar.expOptOriginal')) : null])])]), h('div', {
          class: 'vue-xtable-export--panel-btns'
        }, [defaultOptions.isPrint ? h('vue-button', {
          on: {
            click: this.printEvent
          }
        }, GlobalConfig.i18n('vue.xtable.toolbar.expPrint')) : null, h('vue-button', {
          props: {
            type: 'primary'
          },
          on: {
            click: this.exportEvent
          }
        }, GlobalConfig.i18n('vue.xtable.toolbar.expConfirm'))])])]);
      },
      methods: {
        checkStatus: function checkStatus() {
          var columns = this.storeData.columns;
          this.isAll = this.storeData.columns.every(function (column) {
            return column.checked;
          });
          this.isIndeterminate = !this.isAll && columns.some(function (column) {
            return column.checked;
          });
        },
        allColumnEvent: function allColumnEvent() {
          var isAll = this.isAll;
          this.storeData.columns.forEach(function (column) {
            column.checked = isAll;
          });
          this.checkStatus();
        },
        showEvent: function showEvent() {
          var _this2 = this;
    
          this.$nextTick(function () {
            _this2.$refs.filename.focus();
          });
          this.checkStatus();
        },
        getExportOption: function getExportOption() {
          var storeData = this.storeData,
              defaultOptions = this.defaultOptions;
          var _this$$parent = this.$parent,
              $grid = _this$$parent.$grid,
              $table = _this$$parent.$table;
          var comp = $grid || $table;
          var selectRecords = storeData.selectRecords;
          var opts = VueUtil.assign({
            columns: storeData.columns.filter(function (column) {
              return column.checked;
            })
          }, defaultOptions);
    
          if (storeData.mode === 'selected') {
            if (VueUtil.includes(['html', 'pdf'], defaultOptions.type) && comp.treeConfig) {
              opts.data = VueUtil.searchTree(comp.tableFullData, function (item) {
                return selectRecords.indexOf(item) > -1;
              }, comp.treeConfig);
            } else {
              opts.data = selectRecords;
            }
          }
    
          return opts;
        },
        printEvent: function printEvent() {
          this.storeData.visible = false;
          this.$emit('print', this.getExportOption());
        },
        exportEvent: function exportEvent() {
          this.storeData.visible = false;
          this.$emit('export', this.getExportOption());
        }
      }
    };
    mod.VueXtableExportPanel = VueXtableExportPanel;
  })();

  (function() {
    var VueXtableImportPanel = {
      name: 'VueXtableImportPanel',
      props: {
        defaultOptions: Object,
        storeData: Object
      },
      computed: {
        vSize: function vSize() {
          return this.size || this.$parent.size || this.$parent.vSize;
        },
        selectName: function selectName() {
          return ''.concat(this.storeData.filename, '.').concat(this.storeData.type);
        },
        hasFile: function hasFile() {
          return this.storeData.file && this.storeData.type;
        },
        parseTypeLabel: function parseTypeLabel() {
          var storeData = this.storeData;
    
          if (storeData.type) {
            return GlobalConfig.i18n('vue.xtable.types.'.concat(storeData.type));
          }
    
          var types = this.defaultOptions.types || baseTable.importTypes;

          if (types.indexOf('xlsx') > -1) {
            types = types.concat('xls');
          }
          return '*.'.concat((types).join(', *.'));
        }
      },
      render: function render(h) {
        var hasFile = this.hasFile,
            parseTypeLabel = this.parseTypeLabel,
            defaultOptions = this.defaultOptions,
            storeData = this.storeData,
            selectName = this.selectName;
        return h('vue-dialog', {
          res: 'modal',
          model: {
            value: storeData.visible,
            callback: function callback(value) {
              storeData.visible = value;
            }
          },
          props: {
            title: GlobalConfig.i18n('vue.xtable.toolbar.impTitle'),
            showClose: true,
            // width: 440,
            // mask: true,
            // lockView: true,
            // showFooter: false,
            // maskClosable: true
            appendToBody: VueUtil.getSystemInfo().os === 'iOS'
          }
        }, [h('div', {
          class: 'vue-xtable-export--panel'
        }, [h('table', {
          attrs: {
            cellspacing: 0,
            cellpadding: 0,
            border: 0
          }
        }, [h('tr', [h('td', GlobalConfig.i18n('vue.xtable.toolbar.impFile')), h('td', [hasFile ? h('div', {
          class: 'vue-xtable-import-selected--file',
          attrs: {
            title: selectName
          }
        }, [h('span', selectName), h('i', {
          class: GlobalConfig.icon.importRemove,
          on: {
            click: this.clearFileEvent
          }
        })]) : h('span', {
          class: 'vue-xtable-import-select--file',
          on: {
            click: this.selectFileEvent
          }
        }, GlobalConfig.i18n('vue.xtable.toolbar.impSelect'))])]), h('tr', [h('td', GlobalConfig.i18n('vue.xtable.toolbar.impType')), h('td', parseTypeLabel)]), h('tr', [h('td', GlobalConfig.i18n('vue.xtable.toolbar.impOpts')), h('td', [h('vue-radio', {
          props: {
            name: 'mode',
            label: 'covering'
          },
          model: {
            value: defaultOptions.mode,
            callback: function callback(value) {
              defaultOptions.mode = value;
            }
          }
        }, GlobalConfig.i18n('vue.xtable.toolbar.impModeCovering')), h('vue-radio', {
          props: {
            name: 'mode',
            label: 'append'
          },
          model: {
            value: defaultOptions.mode,
            callback: function callback(value) {
              defaultOptions.mode = value;
            }
          }
        }, GlobalConfig.i18n('vue.xtable.toolbar.impModeAppend'))])])]), h('div', {
          class: 'vue-xtable-export--panel-btns'
        }, [h('vue-button', {
          props: {
            type: 'primary',
            disabled: !hasFile
          },
          on: {
            click: this.importEvent
          }
        }, GlobalConfig.i18n('vue.xtable.toolbar.impConfirm'))])])]);
      },
      methods: {
        clearFileEvent: function clearFileEvent() {
          VueUtil.assign(this.storeData, {
            filename: '',
            sheetName: '',
            type: ''
          });
        },
        selectFileEvent: function selectFileEvent() {
          var _this = this;
    
          var _this$$parent = this.$parent,
              $grid = _this$$parent.$grid,
              $table = _this$$parent.$table;
          var comp = $grid || $table;
    
          if (comp) {
            comp.readFile(this.defaultOptions).then(function (evnt) {
              var file = evnt.target.files[0];
              VueUtil.assign(_this.storeData, tools.UtilTools.parseFile(file), {
                file: file
              });
            }).catch(function (e) {
              return e;
            });
          }
        },
        importEvent: function importEvent() {
          var storeData = this.storeData,
              defaultOptions = this.defaultOptions;
          var opts = VueUtil.assign({}, defaultOptions);
          storeData.visible = false;
          this.$emit('import', opts);
        }
      }
    };
    mod.VueXtableImportPanel = VueXtableImportPanel;
  })();


  (function() {
    var defaultHtmlStyle = 'body{margin:0;font-size:14px}table{text-align:left;border-width:1px 0 0 1px}tbody{white-space:pre-wrap;}table,td,th{border-style:solid;border-color:#e8eaec}tfoot,thead{background-color:#f8f8f9}td,th{padding:6px;border-width:0 1px 1px 0}.tree-icon-wrapper{position:relative;display:inline-block;width:18px}.tree-icon{position:absolute;top:-9px;left:0;width:0;height:0;border-style:solid;border-width:6px;border-top-color:#939599;border-right-color:transparent;border-bottom-color:transparent;border-left-color:transparent}.tree-node{text-align:left}.tree-indent{display:inline-block}'; // 导入

    var impForm = document.createElement('form');
    var impInput = document.createElement('input');
    impForm.className = 'vue-xtable-table--import-form';
    impInput.name = 'file';
    impInput.type = 'file';
    impForm.appendChild(impInput); // 打印
    
    var printFrame;
    
    function createFrame() {
      var frame = document.createElement('iframe');
      frame.className = 'vue-xtable-table--print-frame';
      return frame;
    }
    
    function hasTreeChildren($table, row) {
      var treeConfig = $table.treeConfig;
      return row[treeConfig.children] && row[treeConfig.children].length;
    }
    
    function handleExport($table, opts, oColumns, fullData) {
      var _getExportData = getExportData($table, opts, fullData, oColumns),
          columns = _getExportData.columns,
          datas = _getExportData.datas;
      return $table.preventEvent(null, 'event.export' + (opts.silent ? '.silent' : ''), {
        $table: $table,
        options: opts,
        columns: columns,
        datas: datas
      }, function () {
        return downloadFile($table, opts, getContent($table, opts, columns, datas));
      });
    }
    
    function getContent($table, opts, columns, datas) {
      switch (opts.type) {
        case 'csv':
          return toCsv($table, opts, columns, datas);
    
        case 'txt':
          return toTxt($table, opts, columns, datas);
    
        case 'html':
          return toHtml($table, opts, columns, datas);
    
        case 'xml':
          return toXML($table, opts, columns, datas);

        case 'xlsx':
          return toXlsx($table, opts, columns, datas);
      }
    
      return '';
    }
    
    function getHeaderTitle(opts, column) {
      return (opts.original ? column.property : column.getTitle()) || '';
    }
    
    function toCsv($table, opts, columns, datas) {
      var isOriginal = opts.original;
      var content = '\uFEFF';
      
      if (opts.isHeader) {
        content += columns.map(function (column) {
          return '"'.concat(getHeaderTitle(opts, column), '"');
        }).join(',') + '\n';
      }
    
      datas.forEach(function (row, rowIndex) {
        if (isOriginal) {
          content += columns.map(function (column, columnIndex) {
            if (column.type === 'index') {
              return '"'.concat(column.indexMethod ? column.indexMethod({
                row: row,
                rowIndex: rowIndex,
                column: column,
                columnIndex: columnIndex
              }) : rowIndex + 1, '"');
            }
    
            var cellValue = tools.UtilTools.getCellValue(row, column);
            cellValue = cellValue!='undefined'?cellValue:'';
            if(VueUtil.isString(cellValue)) cellValue = cellValue.replace('"', '\\"');
            return '"'.concat(cellValue, '"');
          }).join(',') + '\n';
        } else {
          content += columns.map(function (column) {
            var value = row[column.id];
            if(VueUtil.isString(value)) value = value.replace('"', '\\"');
            return '"'.concat(value, '"');
          }).join(',') + '\n';
        }
      });
    
      if (opts.isFooter) {
        var footerData = getFooterData($table, columns, opts);

        var footers = opts.footerFilterMethod ? footerData.filter(opts.footerFilterMethod) : footerData;

        footers.forEach(function (rows) {
          content += columns.map(function (column, index) {
            return '"'.concat(rows[index] || '', '"');
          }).join(',') + '\n';
        });
      }
    
      return content;
    }

    function toXlsx($table, opts, columns, datas) {
      var isOriginal = opts.original;
      var sheetName = opts.sheetName;

      var indexKey = 'xtable-column-index';
      var exportDatas = [];
      var fields = {};
      VueUtil.loop(columns, function(column){
        if (column.type === 'index') {
          fields[indexKey] = indexKey;
        } else if (!isOriginal && VueUtil.isFunction(column.excelExportConfig)) {
          fields[column.property] = column.excelExportConfig;
        } else {
          fields[column.property] = column.property;
        }
      });

      if (opts.isHeader) {
        var header = {};
        columns.map(function (column) {
          var title = getHeaderTitle(opts, column);
          var field = column.type === 'index'? indexKey :column.property;
          header[field] = title;
        });
        exportDatas.push(header);
      }
      
      datas.forEach(function (row, rowIndex) {
        var data = {};
        if (isOriginal) {
          columns.map(function (column, columnIndex) {
            if (column.type === 'index') {
              var value = column.indexMethod ? column.indexMethod({
                row: row,
                rowIndex: rowIndex,
                column: column,
                columnIndex: columnIndex
              }) : rowIndex + 1;

              data[indexKey] = value;

            } else {
              var cellValue = tools.UtilTools.getCellValue(row, column);
              cellValue = cellValue!='undefined'?cellValue:'';
              data[column.property] = cellValue;
            }
          });
        } else {
          columns.map(function (column) {
            var value = row[column.id];
            data[column.type === 'index'? indexKey :column.property] = value;
          });
        }

        exportDatas.push(data);
      });
      if (opts.isFooter) {
        var footerData = getFooterData($table, columns, opts);
        var footers = opts.footerFilterMethod ? footerData.filter(opts.footerFilterMethod) : footerData;
        footers.forEach(function (rows) {
          var data = {};
          columns.map(function (column, index) {
            var content = rows[index] || '';
            data[column.type === 'index'? indexKey : column.property] = content;
          });
          exportDatas.push(data);
        });
      }
      var data = VueUtil.Excel.filterExportData(exportDatas, fields);

      var exportDataSheet = {};
      exportDataSheet[sheetName] = data;
      return VueUtil.Excel.exportExcel( exportDataSheet, 'export.xlsx', 'xlsx', {download: false});
    }
    
    function toTxt($table, opts, columns, datas) {
      var isOriginal = opts.original;
      var content = '';
      if (opts.isHeader) {
        content += columns.map(function (column) {
          return ''.concat(getHeaderTitle(opts, column));
        }).join('\t') + '\n';
      }
    
      datas.forEach(function (row, rowIndex) {
        if (isOriginal) {
          content += columns.map(function (column, columnIndex) {
            if (column.type === 'index') {
              return ''.concat(column.indexMethod ? column.indexMethod({
                row: row,
                rowIndex: rowIndex,
                column: column,
                columnIndex: columnIndex
              }) : rowIndex + 1);
            }
    
            var cellValue = tools.UtilTools.getCellValue(row, column);
			cellValue = cellValue!='undefined'?cellValue:'';
            return '"'.concat(cellValue, '"');
          }).join('\t') + '\n';
        } else {
          content += columns.map(function (column) {
            return ''.concat(row[column.id]);
          }).join('\t') + '\n';
        }
      });
    
      if (opts.isFooter) {
        var footerData = getFooterData($table, columns, opts);
        var footers = opts.footerFilterMethod ? footerData.filter(opts.footerFilterMethod) : footerData;
        footers.forEach(function (rows) {
          content += columns.map(function (column, index) {
            return ''.concat(rows[index] || '');
          }).join(',') + '\n';
        });
      }
    
      return content;
    }
    
    function toHtml($table, opts, columns, datas) {
      var treeConfig = $table.treeConfig,
          tableFullData = $table.tableFullData;
      var isOriginal = opts.original;
      var html = ['<html>', '<head>', '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui"><title>'.concat(opts.sheetName, '</title>'), '<style>'.concat(opts.style || defaultHtmlStyle, '</style>'), '</head>', '<body>', '<table border="1" cellspacing="0" cellpadding="0">', '<colgroup>'.concat(columns.map(function (column) {
        return '<col width="'.concat(column.renderWidth, '">');
      }).join(''), '</colgroup>')].join('');
    
      if (opts.isHeader) {
        html += '<thead><tr>'.concat(columns.map(function (column) {
          return '<th>'.concat(getHeaderTitle(opts, column), '</th>');
        }).join(''), '</tr></thead>');
      }
    
      if (datas.length) {
        html += '<tbody>';
    
        if (treeConfig) {
          VueUtil.eachTree(opts.data ? datas : tableFullData, function (row, rowIndex, items, path, parent, nodes) {
            html += '<tr>';
    
            if (isOriginal) {
              html += columns.map(function (column, columnIndex) {
                var cellValue = '';
    
                if (column.type === 'index') {
                  cellValue = column.indexMethod ? column.indexMethod({
                    row: row,
                    rowIndex: rowIndex,
                    column: column,
                    columnIndex: columnIndex
                  }) : rowIndex + 1;
                } else {
					var cellValue = tools.UtilTools.getCellValue(row, column);
					cellValue = cellValue!='undefined'?cellValue:'';
                }
    
                if (treeConfig && column.treeNode) {
                  var treeIcon = '';
    
                  if (hasTreeChildren($table, row)) {
                    treeIcon = '<i class="tree-icon"></i>';
                  }
    
                  return '<td class="tree-node"><span class="tree-indent" style="width: '.concat((nodes.length - 1) * (treeConfig.indent || 16), 'px"></span><span class="tree-icon-wrapper">').concat(treeIcon, '</span>').concat(cellValue, '</td>');
                }
    
                return '<td>'.concat(cellValue, '</td>');
              }).join('');
            } else {
              html += columns.map(function (column) {
                if (treeConfig && column.treeNode) {
                  var treeIcon = '';
    
                  if (row.hasChild) {
                    treeIcon = '<i class="tree-icon"></i>';
                  }
    
                  return '<td class="tree-node"><span class="tree-indent" style="width: '.concat((nodes.length - 1) * (treeConfig.indent || 16), 'px"></span><span class="tree-icon-wrapper">').concat(treeIcon, '</span>').concat(row[column.id], '</td>');
                }
    
                return '<td>'.concat(row[column.id], '</td>');
              }).join('');
            }
    
            html += '</tr>';
          }, treeConfig);
        } else {
          datas.forEach(function (row, rowIndex) {
            html += '<tr>';
    
            if (isOriginal) {
              html += columns.map(function (column, columnIndex) {
                var cellValue = '';
    
                if (column.type === 'index') {
                  cellValue = column.indexMethod ? column.indexMethod({
                    row: row,
                    rowIndex: rowIndex,
                    column: column,
                    columnIndex: columnIndex
                  }) : rowIndex + 1;
                } else {
                  cellValue = tools.UtilTools.getCellValue(row, column) || '';
                }
    
                return '<td>'.concat(cellValue, '</td>');
              }).join('');
            } else {
              html += columns.map(function (column) {
                return '<td>'.concat(row[column.id], '</td>');
              }).join('');
            }
    
            html += '</tr>';
          });
        }
    
        html += '</tbody>';
      }
    
      if (opts.isFooter) {
        var footerData = getFooterData($table, columns, opts);
        var footers = opts.footerFilterMethod ? footerData.filter(opts.footerFilterMethod) : footerData;
    
        if (footers.length) {
          html += '<tfoot>';
          footers.forEach(function (rows) {
            html += '<tr>'.concat(columns.map(function (column, index) {
              return '<td>'.concat(rows[index] || '', '</td>');
            }).join(''), '</tr>');
          });
          html += '</tfoot>';
        }
      }
    
      return html + '</table></body></html>';
    }
    
    function toXML($table, opts, columns, datas) {
      var isOriginal = opts.original;
      var xml = ['<?xml version="1.0"?>', '<?mso-application progid="Excel.Sheet"?>', '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">', '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">', '<Version>16.00</Version>', '</DocumentProperties>', '<ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">', '<WindowHeight>7920</WindowHeight>', '<WindowWidth>21570</WindowWidth>', '<WindowTopX>32767</WindowTopX>', '<WindowTopY>32767</WindowTopY>', '<ProtectStructure>False</ProtectStructure>', '<ProtectWindows>False</ProtectWindows>', '</ExcelWorkbook>', '<Worksheet ss:Name="'.concat(opts.sheetName, '">'), '<Table>', columns.map(function (column) {
        return '<Column ss:Width="'.concat(column.renderWidth, '"/>');
      }).join('')].join('');
    
      if (opts.isHeader) {
        xml += '<Row>'.concat(columns.map(function (column) {
          return '<Cell><Data ss:Type="String">'.concat(getHeaderTitle(opts, column), '</Data></Cell>');
        }).join(''), '</Row>');
      }
    
      datas.forEach(function (row, rowIndex) {
        xml += '<Row>';
    
        if (isOriginal) {
          xml += columns.map(function (column, columnIndex) {
            if (column.type === 'index') {
              return '<Cell><Data ss:Type="String">'.concat(column.indexMethod ? column.indexMethod({
                row: row,
                rowIndex: rowIndex,
                column: column,
                columnIndex: columnIndex
              }) : rowIndex + 1, '</Data></Cell>');
            }
    
			var cellValue = tools.UtilTools.getCellValue(row, column);
			cellValue = cellValue!='undefined'?cellValue:'';
            return '<Cell><Data ss:Type="String">'.concat(cellValue, '</Data></Cell>');
          }).join('');
        } else {
          xml += columns.map(function (column) {
            return '<Cell><Data ss:Type="String">'.concat(row[column.id], '</Data></Cell>');
          }).join('');
        }
    
        xml += '</Row>';
      });
    
      if (opts.isFooter) {
        var footerData = getFooterData($table, columns, opts);
        var footers = opts.footerFilterMethod ? footerData.filter(opts.footerFilterMethod) : footerData;
        footers.forEach(function (rows) {
          xml += '<Row>'.concat(columns.map(function (column, index) {
            return '<Cell><Data ss:Type="String">'.concat(rows[index] || '', '</Data></Cell>');
          }).join(''), '</Row>');
        });
      }
    
      return ''.concat(xml, '</Table></Worksheet></Workbook>');
    }
    
    function downloadFile($table, opts, content) {
      var filename = opts.filename,
          type = opts.type,
          download = opts.download;
      var name = ''.concat(filename, '.').concat(type);
    
      if (window.Blob) {
        var blob;
        if (type == 'xlsx') {
          blob = content;
        } else {
          blob = new Blob([content], {
            type: 'text/'.concat(type)
          });
        }
    
        if (!download) {
          return Promise.resolve({
            type: type,
            content: content,
            blob: blob
          });
        }
    
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, name);
        } else {
          var linkElem = document.createElement('a');
          linkElem.target = '_blank';
          linkElem.download = name;
          linkElem.href = URL.createObjectURL(blob);
          document.body.appendChild(linkElem);
          linkElem.click();
          document.body.removeChild(linkElem);
        }
    
        if (opts.message !== false) {
          $table.$notify({
            message: GlobalConfig.i18n('vue.xtable.table.expSuccess'),
            type: 'success'
          });
        }
      } else {
        tools.UtilTools.error('vue.xtable.error.notExp');
      }
    }
    
    function getLabelData($table, columns, datas, opts) {
      var treeConfig = $table.treeConfig;
      var virtualScroller = $table.getVirtualScroller();
      return datas.map(function (row, rowIndex) {
        var item = {
          hasChild: treeConfig && hasTreeChildren($table, row)
        };
        columns.forEach(function (column, columnIndex) {
          if (virtualScroller.scrollX || virtualScroller.scrollY || opts.dataSource || column.visible === false) {
            var params = {
              $table:$table,
              column:column,
              row:row
            };
            var cellLabel;
            if (column.type === 'index') {
              cellLabel = column.indexMethod ? column.indexMethod({
                row: row,
                rowIndex: rowIndex,
                column: column,
                columnIndex: columnIndex
              }) : rowIndex + 1;
            } else {
              cellLabel = tools.UtilTools.formatText(tools.UtilTools.getCellLabel(row, column, params), 1);
            }

            item[column.id] = cellLabel ? (VueUtil.isString(cellLabel) ? cellLabel.trim() : cellLabel) : '';
          } else {
            var cell = tools.DomTools.getCell($table, {
              row: row,
              column: column
            });
            item[column.id] = cell ? cell.innerText.trim() : '';
          }
        });
        return item;
      });
    }
    
    function getExportData($table, opts, fullData, oColumns) {
      var columns = opts.columns ? opts.columns : oColumns;
      var datas = opts.data || fullData;
    
      if (opts.columnFilterMethod) {
        columns = columns.filter(opts.columnFilterMethod);
      }
    
      if (opts.dataFilterMethod) {
        datas = datas.filter(opts.dataFilterMethod);
      }
    
      return {
        columns: columns,
        datas: opts.original ? datas : getLabelData($table, columns, datas, opts)
      };
    }
    
    function replaceDoubleQuotation(val) {
      return val.replace(/^"/, '').replace(/"$/, '');
    }
    function formateValue(value, field,item, table) {
      var col = table.getColumnByField(field);
      if(table.getFormattedVal) {
        value = table.getFormattedVal(value, item, col, 'paste');
      }
      return value;
    }

    function CSVtoArray(text) {
      var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
      var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
      if (!re_valid.test(text)) return [];
      var a = []; 
      text.replace(re_value,
          function(m0, m1, m2, m3) {
              if      (m1 !== undefined) a.push(m1.replace(/\\'/g, '\''));
              else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
              else if (m3 !== undefined) a.push(m3);
              return ''; // Return empty string.
          });
      // Handle special case of empty last value.
      if (/,\s*$/.test(text)) a.push('');
      return a;
    }

    function parseCsv(columns, content, table) {
      var list = content.split('\n');
      var fields = [];
      var rows = [];
    
      if (list.length) {
        var rList = list.slice(1);
        CSVtoArray(list[0]).forEach(function (val) {
          // var field = replaceDoubleQuotation(val);
            fields.push(val);
        });
        rList.forEach(function (r) {
          if (r) {
            var item = {};
            CSVtoArray(r).forEach(function (val, colIndex) {

              // val = replaceDoubleQuotation(val);
              val = formateValue(val, fields[colIndex], item, table);
              if(fields[colIndex]) {
                item[fields[colIndex]] = val;
              }
            });
            rows.push(item);
          }
        });
      }
      return {
        fields: fields,
        rows: rows
      };
    }

    function parseXlsx(columns, content, table, book) {
      var fields = [];
      var rows = [];
      var firstSheetName = book[0].SheetNames[0];
      var rawData = content[0][firstSheetName];

      if (rawData.length) {
        var header = rawData[0];
        var fieldMap = VueUtil.keys(header).reduce(function(obj, key) {
          fields.push(header[key]);
          obj[header[key]] = key;
          return obj; 
        }, {});
        
        VueUtil.Excel.filterImportData(content, fieldMap);

        rows = content[0][firstSheetName].slice(1);
      }
    
      return {
        fields: fields,
        rows: rows
      };
    }
    
    function parseTxt(columns, content, table) {
      var list = content.split('\n');
      var fields = [];
      var rows = [];
    
      if (list.length) {
        var rList = list.slice(1);
        list[0].split('\t').forEach(function (field) {
            fields.push(field);
        });
        rList.forEach(function (r) {
          if (r) {
            var item = {};
            r.split('\t').forEach(function (val, colIndex) {
              if(fields[colIndex]) {
                val = replaceDoubleQuotation(val);
                val = formateValue(val, fields[colIndex], item, table);

                item[fields[colIndex]] = val;
              }
            });
            rows.push(item);
          }
        });
      }
    
      return {
        fields: fields,
        rows: rows
      };
    }
    
    function parseHTML(columns, content, table) {
      var domParser = new DOMParser();
      var xmlDoc = domParser.parseFromString(content, 'text/html');
      var bodyNodes = getElementsByTagName(xmlDoc, 'body');
      var fields = [];
      var rows = [];
    
      if (bodyNodes.length) {
        var tableNodes = getElementsByTagName(bodyNodes[0], 'table');
    
        if (tableNodes.length) {
          var theadNodes = getElementsByTagName(tableNodes[0], 'thead');
    
          if (theadNodes.length) {
            VueUtil.forEach(getElementsByTagName(theadNodes[0], 'tr'), function (rowNode) {
              VueUtil.forEach(getElementsByTagName(rowNode, 'th'), function (cellNode) {
                var field = cellNode.textContent;
    
                  fields.push(field);
              });
            });
            var tbodyNodes = getElementsByTagName(tableNodes[0], 'tbody');
    
            if (tbodyNodes.length) {
              VueUtil.forEach(getElementsByTagName(tbodyNodes[0], 'tr'), function (rowNode) {
                var item = {};
                VueUtil.forEach(getElementsByTagName(rowNode, 'td'), function (cellNode, colIndex) {
                  var val = formateValue(cellNode.textContent || '', fields[colIndex], item, table);

                  if(fields[colIndex]) {
                    item[fields[colIndex]] = val;
                  }
                });
                rows.push(item);
              });
            }
          }
        }
      }
    
      return {
        fields: fields,
        rows: rows
      };
    }
    
    function parseXML(columns, content, table) {
      var domParser = new DOMParser();
      var xmlDoc = domParser.parseFromString(content, 'application/xml');
      var sheetNodes = getElementsByTagName(xmlDoc, 'Worksheet');
      var fields = [];
      var rows = [];
    
      if (sheetNodes.length) {
        var tableNodes = getElementsByTagName(sheetNodes[0], 'Table');
    
        if (tableNodes.length) {
          var rowNodes = getElementsByTagName(tableNodes[0], 'Row');
    
          if (rowNodes.length) {
            VueUtil.forEach(getElementsByTagName(rowNodes[0], 'Cell'), function (cellNode) {
              var field = cellNode.textContent;
    
                fields.push(field);
            });
            VueUtil.forEach(rowNodes, function (rowNode, index) {
              if (index) {
                var item = {};
                var cellNodes = getElementsByTagName(rowNode, 'Cell');
                VueUtil.forEach(cellNodes, function (cellNode, colIndex) {
                  var val = formateValue(cellNode.textContent, fields[colIndex], item, table);
                  if(fields[colIndex])  {
                    item[fields[colIndex]] = val;
                  }
                });
                rows.push(item);
              }
            });
          }
        }
      }
    
      return {
        fields: fields,
        rows: rows
      };
    }
    
    function getElementsByTagName(elem, qualifiedName) {
      return elem.getElementsByTagName(qualifiedName);
    }
    /**
     * 检查导入的列是否完整
     * @param {Array} fields 字段名列表
     * @param {Array} rows 数据列表
     */
    
    
    function checkImportData(columns, fields, rows) {
      var tableFields = [];
      columns.forEach(function (column) {
        var field = column.property;
    
        if (field) {
            var fields = [].concat(field);
            fields.forEach(function(item){
                tableFields.push(item);
            });
        }
      });
      return tableFields.every(function (field) {
        return VueUtil.includes(fields, field);
      });
    }
    
    function handleImport($table, content, opts, book) {
      var tableFullColumn = $table.tableFullColumn,
          _importResolve = $table._importResolve;
      var rest = {
        fields: [],
        rows: []
      };
      
      switch (opts.type) {
        case 'csv':
          rest = parseCsv(tableFullColumn, content, $table);
          break;

        case 'xlsx', 'xls':
          rest = parseXlsx(tableFullColumn, content, $table, book);
          break;
    
        case 'txt':
          rest = parseTxt(tableFullColumn, content, $table);
          break;
    
        case 'html':
          rest = parseHTML(tableFullColumn, content, $table);
          break;
    
        case 'xml':
          rest = parseXML(tableFullColumn, content, $table);
          break;
      }
    
      var _rest = rest,
          fields = _rest.fields,
          rows = _rest.rows;
      var status = checkImportData(tableFullColumn, fields, rows);
    
      if (status) {
        $table.createData(rows).then(function (data) {
          if (opts.mode === 'append') {
            $table.insertAt(data, -1);
          } else {
            $table.reloadData(data);
          }
        });
    
        if (opts.message !== false) {
          $table.$notify({
            message: GlobalConfig.i18n('vue.xtable.table.impSuccess'),
            type: 'success'
          });
        }
      } else if (opts.message !== false) {
        $table.$notify({
          message: GlobalConfig.i18n('vue.xtable.error.impFields'),
          type: 'error'
        });
      }
    
      if (_importResolve) {
        _importResolve(status);
    
        $table._importResolve = null;
      }
    }
    
    var VueXtableExportMixin = {
      methods: {
        // 在 v3.0 中废弃 exportCsv 方法
        _exportCsv: function _exportCsv(options) {
          tools.UtilTools.warn('vue.xtable.error.delFunc', ['exportCsv', 'exportData']);
    
          return this.exportData(options);
        },
        _openExport: function _openExport(options) {
          if (this.$toolbar) {
            return this.$toolbar.openExport(options);
          }
    
          throw new Error(tools.UtilTools.getLog('vue.xtable.error.barUnableLink'));
        },
    
        /**
         * 导出文件，支持 csv/html/xml
         * 如果是树表格，则默认是导出所有节点
         * 如果是启用了虚拟滚动，则只能导出数据源，可以配合 dataFilterMethod 函数自行转换数据
         * @param {Object} options 参数
         */
        _exportData: function _exportData(options) {
          var visibleColumn = this.visibleColumn,
              scrollXLoad = this.scrollXLoad,
              scrollYLoad = this.scrollYLoad,
              treeConfig = this.treeConfig;
          var opts = VueUtil.assign({
            filename: '',
            sheetName: '',
            original: !!treeConfig,
            message: false,
            isHeader: true,
            isFooter: true,
            download: true,
            type: 'csv',
            data: null,
            dataSource: null,
            silent: false,
            columns: null,
            columnFilterMethod: null,
            dataFilterMethod: null,
            footerFilterMethod: null
          }, GlobalConfig.export, this.exportConfig, options);
    
          if (opts.dataSource) {
            opts.data = opts.dataSource;
          }

          if (!opts.filename) {
            opts.filename = 'export';
          }
    
          if (!opts.sheetName) {
            opts.sheetName = 'Sheet1';
          }
    
          if (!VueUtil.includes(baseTable.exportTypes, opts.type)) {
            throw new Error(tools.UtilTools.getLog('vue.xtable.error.notType', [opts.type]));
          }
    
          if ((!options || !options.columns) && !opts.columnFilterMethod) {
            // 在 v3.0 中废弃 type=selection
            opts.columnFilterMethod = function (column) {
              return column.property && ['index', 'checkbox', 'selection', 'radio'].indexOf(column.type) === -1;
            };
          }
    
          var columns = visibleColumn;
          var fullData = this.tableFullData;
    
          if (treeConfig) {
            fullData = VueUtil.toTreeArray(fullData, treeConfig);
          }
    
          return handleExport(this, opts, columns, fullData);
        },
        _openImport: function _openImport(options) {
          if (this.$toolbar) {
            return this.$toolbar.openImport(options);
          }
    
          throw new Error(tools.UtilTools.getLog('vue.xtable.error.barUnableLink'));
        },
        _importByFile: function _importByFile(file, opts) {
          var _this = this;
    
          if (window.FileReader) {
            var _UtilTools$parseFile = tools.UtilTools.parseFile(file),
                type = _UtilTools$parseFile.type,
                filename = _UtilTools$parseFile.filename;
    
            var options = VueUtil.assign({
              mode: 'covering'
            }, opts, {
              type: type,
              filename: filename
            });
            var types = options.types || baseTable.importTypes;
    
            if (types.indexOf('xlsx') > -1) {
              types = types.concat('xls');
            }
            if (VueUtil.includes(types, type)) {
              this.preventEvent(null, 'event.import', {
                $table: this,
                file: file,
                options: options,
                columns: this.tableFullColumn
              }, function () {

                if(type == 'xlsx' || type == 'xls') {
                  VueUtil.Excel.importExcel([file], {cellDates: true}, function(data, book) {
                    handleImport(_this, data, options, book);
                  });

                  return;
                }

                var reader = new FileReader();
    
                reader.onerror = function (e) {
                  tools.UtilTools.error('vue.xtable.error.notType', [type]);
                };
    
                reader.onload = function (e) {
                  var result = e.target.result;
                  // txt类型被trim后，由于index列没有标题，field会少掉一列，导致列数据错位,所以去掉trim。
                  handleImport(_this, type != 'txt' ? result.trim() : result, options);
                };
    
                reader.readAsText(file, 'UTF-8');
              });
            } else {
              tools.UtilTools.error('vue.xtable.error.notType', [type]);
            }
          } else {
            tools.UtilTools.error('vue.xtable.error.notExp');
          }
        },
        _importData: function _importData(options) {
          var _this2 = this;
    
          var opts = VueUtil.assign({}, GlobalConfig.import, this.importConfig, options);
          var rest = new Promise(function (resolve, reject) {
            _this2._importResolve = resolve;
            _this2._importReject = reject;
          });
          this.readFile(opts).then(function (evnt) {
            return _this2.importByFile(evnt.target.files[0], opts);
          }).catch(function (evnt) {
            _this2._importReject(evnt);
    
            _this2._importReject = null;
          });
          return rest;
        },
        _readFile: function _readFile() {
          var _this3 = this;
    
          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    
          if (!impForm.parentNode) {
            document.body.appendChild(impForm);
          }
    
          var types = options.types || baseTable.importTypes;

          if (types.indexOf('xlsx') > -1) {
            types = types.concat('xls');
          }

          impInput.accept = '.'.concat(types.join(', .'));
    
          impInput.onchange = function (evnt) {
            var _UtilTools$parseFile2 = tools.UtilTools.parseFile(evnt.target.files[0]),
                type = _UtilTools$parseFile2.type;
    
            if (VueUtil.includes(types, type)) {
              _this3._fileResolve(evnt);
            } else {
              if (options.message !== false) {
                _this3.$notify({
                  message: _this3.t('vue.xtable.error.notType', [type]),
                  type: 'error'
                });
              }
    
              _this3._fileReject(evnt);
            }
    
            _this3._fileResolve = null;
          };
    
          impForm.reset();
          impInput.click();
          return new Promise(function (resolve, reject) {
            _this3._fileResolve = resolve;
            _this3._fileReject = reject;
          });
        },
        _print: function _print(options) {
          this.exportData(VueUtil.assign({
            original: this.scrollXLoad || this.scrollYLoad
          }, options, {
            type: 'html',
            download: false
          })).then(function (_ref) {
            var content = _ref.content,
                blob = _ref.blob;
    
            if (VueUtil.isIE) {
              if (printFrame) {
                try {
                  printFrame.contentDocument.write('');
                  printFrame.contentDocument.clear();
                } catch (e) {}
    
                document.body.removeChild(printFrame);
              }
    
              printFrame = createFrame();
              document.body.appendChild(printFrame);
              printFrame.contentDocument.write(content);
              printFrame.contentDocument.execCommand('print');
            } else {
              if (!printFrame) {
                printFrame = createFrame();
    
                printFrame.onload = function (evnt) {
                  if (evnt.target.src) {
                    evnt.target.contentWindow.print();
                  }
                };
    
                document.body.appendChild(printFrame);
              }
    
              printFrame.src = URL.createObjectURL(blob);
            }
          });
        }
      }
    };
    mod.VueXtableExportMixin = VueXtableExportMixin;
  })();

  return mod;
});

function getFooterData($table, columns, opts) {
  var footerData = $table.footerData;

  if ($table.showFooter && $table.footerMethod) {
    footerData = $table.tableColumn.length ? $table.footerMethod({
      columns: columns,
      data: opts.data || $table.afterFullData
    }) : [];
  }
  return footerData;
}
