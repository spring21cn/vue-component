(function (context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    context.VueXtableToolbar = definition(context.tools, context.baseTable);
  }
})(this, function (tools, baseTable) {

  function getHotKey(hotKeys, btnType) {
    var btnHotKey = hotKeys[btnType];
    var focusClickTypes = ['setting', 'fixed'];
    if(btnHotKey) {
      return [
        {
          name: 'hotkey',
          arg: btnHotKey.key,
          value: btnHotKey.keyAction || (focusClickTypes.indexOf(btnType) > -1 ? 'focusClick' : undefined)
        }
      ];
    }
    return;
  }

  var vueFixedPanel = {
    template: '<div class="vue-xtable-toolbar-fixed-panel">\
    <vue-form label-width="100px"> \
      <vue-form-item :label="$t(\'vue.table.leftPin\')"> \
        <vue-select append-to-self ref="left" clearable v-model="left" multiple @change="leftPin" > \
          <vue-option v-for="(column, index) in options" :key="index" :label="column.label" :value="column.value"></vue-option> \
        </vue-select> \
      </vue-form-item> \
      <vue-form-item :label="$t(\'vue.table.rightPin\')"> \
        <vue-select append-to-self  ref="right" clearable v-model="right" multiple @change="rightPin"> \
          <vue-option v-for="(column, index) in options" :key="index" :label="column.label" :value="column.value"></vue-option> \
        </vue-select> \
      </vue-form-item> \
      </vue-form>\
      </div>',
    props: ['toolbar','tableFullColumn', 'visible'],
    data: function(){
      return {
        left:[],
        right:[],
      };
    },
    computed: {
      comp: function() {
        var $grid = this.toolbar.$grid,
          $table = this.toolbar.$table;
        return $grid || $table;
      },
      cols: function() {
        var tableFullColumn = this.tableFullColumn;
        return tableFullColumn.filter(function(column) {
          var property = column.property,
            visible = column.visible,
            own = column.own;
          var headerTitle = tools.UtilTools.getFuncText(own.title || own.label);
          return visible && property && headerTitle;
        });
      },
      options: function() {
        return this.cols.map(function (column) {
          var property = column.property,
            own = column.own;
          var headerTitle = tools.UtilTools.getFuncText(own.title || own.label);
          return property && headerTitle ? {
            value: property,
            label: headerTitle
          } : null;
        });
      }
    },
    methods: {
      leftPin: function(columns) {
        var self = this;
        VueUtil.loop(this.cols, function(column) {
          if (column.fixed === 'left') {
            column.fixed = false;
          }
        });
        VueUtil.loop(columns, function(property) {
          var rightIndex = self.right.indexOf(property);
          if (rightIndex !== -1) self.right.splice(rightIndex, 1);
          self.comp.getColumnByField(property).fixed = 'left';
        });

        this.comp.refreshColumn();
      },
      rightPin: function(columns) {
        var self = this;
        VueUtil.loop(this.cols, function(column) {
          if (column.fixed === 'right') {
            column.fixed = false;
          }
        });
        VueUtil.loop(columns, function(property) {
          var leftIndex = self.left.indexOf(property);
          if (leftIndex !== -1) self.left.splice(leftIndex, 1);
          self.comp.getColumnByField(property).fixed = 'right';
        });

        this.comp.refreshColumn();
      },
      updateFixed: function(val) {
        this.left = val.filter(function(column) {
          return column.fixed == 'left';
        }).map(function(column) {
          return column.property;
        });

        this.right = val.filter(function(column) {
          return column.fixed == 'right';
        }).map(function(column) {
          return column.property;
        });
      }
    },
    watch: {
      visible: function(val) {
        if(!val) {
          this.$refs.left.handleClose();
          this.$refs.right.handleClose();
        }
      },
      cols: function(val) {
        this.updateFixed(val);
      }
    },
  };


  var _defineProperty = tools.UtilTools.defineProperty;
  var VueXtableToolbar = {
    name: 'VueToolbar',
    components: { 'vue-fixed-panel': vueFixedPanel },
    props: {
      id: String,
      loading: false,
      resizable: {
        type: [Boolean, Object],
        default: function _default() {
          return GlobalConfig.toolbar.resizable;
        }
      },
      addRow: {
        type: [Boolean, Object],
        default: function _default() {
          return GlobalConfig.toolbar.addRow;
        }
      },
      insertRow: {
        type: [Boolean, Object],
        default: function _default() {
          return GlobalConfig.toolbar.insertRow;
        }
      },
      delRow: {
        type: [Boolean, Object],
        default: function _default() {
          return GlobalConfig.toolbar.delRow;
        }
      },
      refresh: {
        type: [Boolean, Object],
        default: function _default() {
          return GlobalConfig.toolbar.refresh;
        }
      },
      import: {
        type: [Boolean, Object],
        default: function _default() {
          return GlobalConfig.toolbar.import;
        }
      },
      export: {
        type: [Boolean, Object],
        default: function _default() {
          return GlobalConfig.toolbar.export;
        }
      },
      setting: {
        type: [Boolean, Object],
        default: function _default() {
          return GlobalConfig.toolbar.setting;
        }
      },
      fixed: {
        type: [Boolean, Object],
        default: function _default() {
          return GlobalConfig.toolbar.fixed;
        }
      },
      buttons: {
        type: Array,
        default: function _default() {
          return GlobalConfig.toolbar.buttons;
        }
      },
      size: String,
      data: Array,
      customs: Array,
      tabKey: {
        type: [Boolean, Object],
        default: function _default() {
          return GlobalConfig.toolbar.tabKey;
        }
      },
      hotKey: {
        type: Object,
        default: function _default() {
          return GlobalConfig.toolbar.hotKey;
        }
      }
    },
    inject: {
      $grid: {
        default: null
      }
    },
    data: function data() {
      return {
        $table: null,
        comp: null,
        isRefresh: false,
        tableFullColumn: [],
        importStore: {
          file: null,
          type: '',
          filename: '',
          visible: false
        },
        importParams: {
          mode: '',
          types: null,
          message: true
        },
        exportStore: {
          name: '',
          mode: '',
          columns: [],
          selectRecords: [],
          hasFooter: false,
          forceOriginal: false,
          visible: false
        },
        exportParams: {
          filename: '',
          sheetName: '',
          type: '',
          types: [],
          original: false,
          message: true,
          isHeader: false,
          isFooter: false,
          isPrint: true,
        },
        settingStore: {
          visible: false,
          fixedVisible: false,
        }
      };
    },
    computed: {
      vSize: function vSize() {
        return this.size || this.$parent.size || this.$parent.vSize;
      },
      refreshOpts: function refreshOpts() {
        return VueUtil.assign({}, GlobalConfig.toolbar.refresh, this.refresh);
      },
      importOpts: function importOpts() {
        return VueUtil.assign({}, GlobalConfig.toolbar.import, typeof this.import == 'object' ? VueUtil.assign({display: true},this.import) : {display: this.import});
      },
      exportOpts: function exportOpts() {
        return VueUtil.assign({}, GlobalConfig.toolbar.export, typeof this.export == 'object' ? VueUtil.assign({display: true},this.export) : {display: this.export});
      },
      resizableOpts: function resizableOpts() {
        return VueUtil.assign({
          storageKey: 'VUE_XTABLE_CUSTOM_COLUMN_WIDTH'
        }, GlobalConfig.toolbar.resizable, this.resizable);
      },
      settingOpts: function settingOpts() {
        return VueUtil.assign({
          storageKey: 'VUE_XTABLE_CUSTOM_COLUMN_HIDDEN'
        }, GlobalConfig.toolbar.setting, this.setting);
      },
      fixedOpts: function fixedOpts() {
        return VueUtil.assign({
          storageKey: 'VUE_XTABLE_CUSTOM_COLUMN_FIXED'
        }, GlobalConfig.toolbar.fixed, this.fixed);
      },
      disableDelRow: function() {
        var comp = this.comp;
        if(!this.comp) {
          return true;
        }

        var checkboxConfig = comp.checkboxConfig || comp.selectConfig || {};
        if ((comp.selection && comp.selection.length > 0) || comp.selectRow) {
          // checkbox选中或radio选中
          return false;
        } else if (checkboxConfig.checkField) {
          // 配置了checkField，判断选中项大于0
          return comp.getSelectRecords().length === 0;
        } else if (comp.highlightCurrentRow && comp.getCurrentRow()){
          // 单选，且有选中
          return false;
        }

        return true;
      }
    },
    created: function created() {
      var _this = this;

      var settingOpts = this.settingOpts,
        id = this.id,
        customs = this.customs;

      if (customs) {
        this.tableFullColumn = customs;
      }

      if (settingOpts.storage && !id) {
        return tools.UtilTools.error('vue.xtable.error.toolbarId');
      }

      if (!baseTable._export && (this.export || this.import)) {
        tools.UtilTools.error('vue.xtable.error.reqModule', ['Export']);
      }

      this.$nextTick(function () {
        _this.updateConf();

        _this.loadStorage();
      });

      tools.GlobalEvent.on(this, 'mousedown', this.handleGlobalMousedownEvent);

      tools.GlobalEvent.on(this, 'blur', this.handleGlobalBlurEvent);
    },
    destroyed: function destroyed() {
      tools.GlobalEvent.off(this, 'mousedown');

      tools.GlobalEvent.off(this, 'blur');
    },
    render: function render(h) {
      var _ref,
        _this2 = this;

      var _e = this._e,
        $scopedSlots = this.$scopedSlots,
        $grid = this.$grid,
        $table = this.$table,
        loading = this.loading,
        settingStore = this.settingStore,
        addRow = this.addRow,
        insertRow = this.insertRow,
        delRow = this.delRow,
        refresh = this.refresh,
        setting = this.setting,
        settingOpts = this.settingOpts,
        _this$buttons = this.buttons,
        buttons = _this$buttons === void 0 ? [] : _this$buttons,
        vSize = this.vSize,
        tableFullColumn = this.tableFullColumn,
        importStore = this.importStore,
        importParams = this.importParams,
        exportStore = this.exportStore,
        fixed = this.fixed,
        exportParams = this.exportParams;
      var customBtnOns = {};
      var customWrapperOns = {};
      var $buttons = $scopedSlots.buttons;
      var $tools = $scopedSlots.tools;
      var tabKey = _this2.tabKey;
      if (tabKey === true) {
        tabKey = {};
      }
      var hotKey = _this2.hotKey || {};

      if (setting || fixed) {
        if (settingOpts.trigger === 'manual') {// 手动触发
        } else if (settingOpts.trigger === 'hover') {
          // hover 触发
          customBtnOns.mouseenter = this.handleMouseenterSettingEvent;
          customBtnOns.mouseleave = this.handleMouseleaveSettingEvent;
          customWrapperOns.mouseenter = this.handleWrapperMouseenterEvent;
          customWrapperOns.mouseleave = this.handleWrapperMouseleaveEvent;
        } else {
          // 点击触发
          var self =this;
          customBtnOns.click = this.handleClickSettingEvent;
          customBtnOns.keydown = function (e) {
            if (e.keyCode == 27) {
              e.stopPropagation();
              self.handleClickSettingEvent(e);
            }
          };
          customWrapperOns.keydown = function (e) {
            if (e.keyCode == 27) {
              e.stopPropagation();
              self.handleClickSettingEvent(e);
            }
          };
          customWrapperOns.click = function (e) {
            e.stopPropagation();
          };
        }
      }

      return h('div', {
        class: ['vue-xtable-toolbar', (_ref = {}, _defineProperty(_ref, 'size--'.concat(vSize), vSize), _defineProperty(_ref, 'is--loading', loading), _ref)]
      }, [h('div', {
        class: 'vue-xtable-button--wrapper'
      }, $buttons ? $buttons.call(this, {
        $grid: $grid,
        $table: $table
      }, h) : buttons.map(function (item) {
        return item.visible === false ? _e() : h(item.dropdowns && item.dropdowns.length ? 'vue-dropdown' : 'vue-button', {
          on: {
            click: function click(evnt) {
              return _this2.btnEvent(evnt, item);
            }
          },
          props: {
            disabled: item.disabled
          },
          directives: item.key ? [
            {
              name: 'hotkey',
              arg: item.key,
              value: item.keyAction
            }
          ] : undefined,
          attrs: {
            tabindex: tabKey || item.tabIndex !== undefined ? item.tabIndex : -1
          }
        }, item.dropdowns && item.dropdowns.length ? [
          h('vue-button', {
            attrs: {
              tabindex: tabKey || item.tabIndex !== undefined ? item.tabIndex : -1
            }
          }, [tools.UtilTools.getFuncText(item.name),
          h('i', {
            class: 'vue-icon-arrow-down vue-icon--right'
          })
          ]),
          h('vue-dropdown-menu', {
            slot: 'dropdown'
          }, item.dropdowns.map(function (child) {
            return child.visible === false ? _e() : h('vue-dropdown-item', {
              nativeOn: {
                click: function click(evnt) {
                  return _this2.btnEvent(evnt, child);
                }
              },
              props: {
                disabled: child.disabled
              }
            }, tools.UtilTools.getFuncText(child.name));
          }))
        ] : tools.UtilTools.getFuncText(item.name));
      })), h('div', {
        class: 'vue-xtable-tools--operate'
      }, [
        
        addRow ? h('vue-button', {
          class: ['vue-xtable-add-row--btn', 'toolbar-right-btn'],
          props: {
            type: 'text',
            icon: GlobalConfig.icon.addRow,
          },
          directives: getHotKey(hotKey, 'addRow'),
          attrs: {
            title: GlobalConfig.i18n('vue.xtable.toolbar.addRow'),
            tabindex: tabKey ? tabKey['addRow'] : -1
          },
          on: {
            click: this.addRowEvent
          }
        }) : null,


        insertRow ? h('vue-button', {
          class: ['vue-xtable-insert-row--btn', 'toolbar-right-btn'],
          props: {
            type: 'text',
            icon: GlobalConfig.icon.insertRow,
          },
          directives: getHotKey(hotKey, 'insertRow'),
          attrs: {
            title: GlobalConfig.i18n('vue.xtable.toolbar.insertRow'),
            tabindex: tabKey ? tabKey['insertRow'] : -1
          },
          on: {
            click: this.insertRowEvent
          }
        }) : null,

        delRow ? h('vue-button', {
          class: ['vue-xtable-del-row--btn', 'toolbar-right-btn'],
          props: {
            type: 'text',
            icon: GlobalConfig.icon.delRow,
            disabled: this.disableDelRow
          },
          directives: getHotKey(hotKey, 'delRow'),
          attrs: {
            title: GlobalConfig.i18n('vue.xtable.toolbar.delRow'),
            tabindex: tabKey ? tabKey['delRow'] : -1
          },
          on: {
            click: this.delRowEvent
          }
        }) : null,
        
        
        
        this.importOpts.display ? h('vue-button', {
        class: ['vue-xtable-export--btn', 'toolbar-right-btn'],
        props: {
          type: 'text',
          icon: GlobalConfig.icon.import,
        },
        directives: getHotKey(hotKey, 'import'),
        attrs: {
          title: GlobalConfig.i18n('vue.xtable.toolbar.impConfirm'),
          tabindex: tabKey ? tabKey['import'] : -1
        },
        on: {
          click: this.importEvent
        }
      }) : null, this.exportOpts.display ? h('vue-button', {
        class: ['vue-xtable-export--btn', 'toolbar-right-btn'],
        props: {
          type: 'text',
          icon: GlobalConfig.icon.export
        },
        directives: getHotKey(hotKey, 'export'),
        attrs: {
          title: GlobalConfig.i18n('vue.xtable.toolbar.expConfirm'),
          tabindex: tabKey ? tabKey['export'] : -1
        },
        on: {
          click: this.exportEvent
        }
      }) : null, refresh ? h('vue-button', {
        class: ['vue-xtable-refresh--btn', 'toolbar-right-btn'],
        props: {
          type: 'text',
          icon: GlobalConfig.icon.refresh,
          loading: this.isRefresh
        },
        directives: getHotKey(hotKey, 'refresh'),
        attrs: {
          title: GlobalConfig.i18n('vue.xtable.toolbar.refresh'),
          tabindex: tabKey ? tabKey['refresh'] : -1
        },
        on: {
          click: this.refreshEvent
        }
      }) : null,

      setting ? h('div', {
        class: ['vue-xtable-custom--wrapper', 'toolbar-right-btn', {
          'is--active': settingStore.visible
        }],
        ref: 'customWrapper'
      }, [h('button', {
        class: 'vue-xtable-custom--setting-btn',
        on: customBtnOns,
        directives: getHotKey(hotKey, 'setting'),
        attrs: {
          type: 'button',
          title: GlobalConfig.i18n('vue.xtable.toolbar.setting'),
          tabindex: tabKey ? tabKey['setting'] : -1
        }
      }, [h('i', {
        class: GlobalConfig.icon.custom
      })]), h('div', {
        class: 'vue-xtable-custom--option-wrapper'
      }, [h('div', {
        class: 'vue-xtable-custom--option',
        on: customWrapperOns
      }, tableFullColumn.map(function (column) {
        var property = column.property,
          visible = column.visible,
          own = column.own;

        var headerTitle = tools.UtilTools.getFuncText(own.title || own.label);

        return property && headerTitle ? h('vue-checkbox', {
          props: {
            value: visible,
            disabled: settingOpts.checkMethod ? !settingOpts.checkMethod({
              column: column
            }) : false
          },
          attrs: {
            title: headerTitle
          },
          on: {
            input: function change(value) {
              column.visible = value;

              if (setting && settingOpts.immediate) {
                _this2.updateSetting();
              }
            },
          }
        }, headerTitle) : null;
      }))])]) : null

        , fixed ? h('div', {
          class: ['vue-xtable-custom--wrapper', 'vue-xtable-fixed--wrapper', 'toolbar-right-btn', {
            'is--active': settingStore.fixedVisible
          }],
          ref: 'fixedWrapper'
        }, [h('button', {
          class: 'vue-xtable-custom--setting-btn',
          on: customBtnOns,
          directives: getHotKey(hotKey, 'fixed'),
          attrs: {
            type: 'button',
            title: GlobalConfig.i18n('vue.xtable.toolbar.fixed'),
            tabindex: tabKey ? tabKey['fixed'] : -1
          },
        }, [h('i', {
          class: GlobalConfig.icon.fixed
        })]), h('div', {
          class: 'vue-xtable-custom--option-wrapper'
        }, [h('div', {
          class: 'vue-xtable-custom--option',
          on: customWrapperOns
        },
          [h('vue-fixed-panel',  {
            props: {
              visible: settingStore.fixedVisible,
              tableFullColumn: tableFullColumn,
              toolbar: _this2
            },
            ref: 'fixedPanel'
          })]
          )
        ]
        )]) : null]),

      baseTable._export ? h('vue-xtable-import-panel', {
        props: {
          defaultOptions: importParams,
          storeData: importStore
        },
        on: {
          import: this.confirmImportEvent
        }
      }) : _e(),

      baseTable._export ? h('vue-xtable-export-panel', {
        props: {
          defaultOptions: exportParams,
          storeData: exportStore
        },
        on: {
          print: this.confirmPrintEvent,
          export: this.confirmExportEvent
        }
      }) : _e(),

      $tools ? h('div', {
        class: 'vue-xtable-tools--wrapper'
      }, $tools.call(this, {
        $grid: $grid,
        $table: $table
      }, h)) : null]);
    },
    methods: {
      updateConf: function updateConf() {
        var $parent = this.$parent,
          data = this.data;
        var $children = $parent.$children;
        var selfIndex = $children.indexOf(this);
        this.$table = VueUtil.find($children, function (comp, index) {
          return comp && comp.refreshColumn && index > selfIndex && (data ? comp.data === data : comp.$vnode.componentOptions.tag === 'vue-xtable');
        });

        this.comp = this.$table || this.$grid;
        var table = (this.$table || this.$grid.$refs.xTable);

        var self = this;
        table && table.$on('set-user-setting', function() {
          var fixedPanel = self.$refs.fixedPanel;
          fixedPanel && fixedPanel.updateFixed(fixedPanel.cols);
        });
      },
      openSetting: function openSetting() {
        this.settingStore.visible = true;
      },
      openFixedSetting: function () {
        this.settingStore.fixedVisible = true;
      },
      closeSetting: function closeSetting() {
        var setting = this.setting,
          settingStore = this.settingStore;
        if (settingStore.visible) {
          settingStore.visible = false;

          if (setting && !settingStore.immediate) {
            this.updateSetting();
          }
        }
        if (settingStore.fixedVisible) {
          settingStore.fixedVisible = false;

          if (setting && !settingStore.immediate) {
            this.updateFixed();
          }
        }
      },
      loadStorage: function loadStorage() {
        var $grid = this.$grid,
          $table = this.$table,
          id = this.id,
          refresh = this.refresh,
          resizable = this.resizable,
          setting = this.setting,
          refreshOpts = this.refreshOpts,
          resizableOpts = this.resizableOpts,
          settingOpts = this.settingOpts,
          fixedOpts = this.fixedOpts;

        if (refresh && !$grid) {
          if (!refreshOpts.query) {
            tools.UtilTools.warn('vue.xtable.error.notFunc', ['query']);
          }
        }

        if ($grid || $table) {
          ($grid || $table).connect({
            toolbar: this
          });
        } else {
          if (resizable || setting) {
            throw new Error(tools.UtilTools.getLog('vue.xtable.error.barUnableLink'));
          }
        }

        if (resizable || setting) {
          var customMap = {};

          if (resizableOpts.storage) {
            var columnWidthStorage = this.getStorageMap(resizableOpts.storageKey)[id];

            if (columnWidthStorage) {
              VueUtil.forEach(columnWidthStorage, function (resizeWidth, field) {
                customMap[field] = {
                  field: field,
                  resizeWidth: resizeWidth
                };
              });
            }
          }

          if (settingOpts.storage) {
            var columnHideStorage = this.getStorageMap(settingOpts.storageKey)[id];

            if (columnHideStorage) {
              columnHideStorage.split(',').forEach(function (field) {
                if (customMap[field]) {
                  customMap[field].visible = false;
                } else {
                  customMap[field] = {
                    field: field,
                    visible: false
                  };
                }
              });
            }
          }

          if (fixedOpts.storage) {
            var columnFixedStorage = this.getStorageMap(fixedOpts.storageKey)[id];

            if (columnFixedStorage) {
              VueUtil.forEach(columnFixedStorage, function (fixed, field) {
                if (customMap[field]) {
                  customMap[field].fixed = fixed;
                } else {
                  customMap[field] = {
                    field: field,
                    fixed: fixed
                  };
                }
              });
            }
          }
          var customList = VueUtil.values(customMap);
          this.updateCustoms(customList.length ? customList : this.tableFullColumn);
        }
      },
      updateColumn: function updateColumn(fullColumn) {
        this.tableFullColumn = fullColumn;
      },
      updateCustoms: function updateCustoms(customs) {
        var _this3 = this;

        var $grid = this.$grid,
          $table = this.$table;
        var comp = $grid || $table;

        if (comp) {
          comp.reloadCustoms(customs).then(function (fullColumn) {
            _this3.tableFullColumn = fullColumn;
          });
        }
      },
      getStorageMap: function getStorageMap(key) {
        var version = GlobalConfig.version;
        var rest = JSON.parse(localStorage.getItem(key));
        return rest && rest._v === version ? rest : {
          _v: version
        };
      },
      saveColumnHide: function saveColumnHide() {
        var id = this.id,
          tableFullColumn = this.tableFullColumn,
          settingOpts = this.settingOpts;

        if (settingOpts.storage) {
          var columnHideStorageMap = this.getStorageMap(settingOpts.storageKey);
          var colHides = tableFullColumn.filter(function (column) {
            return column.property && !column.visible;
          });
          columnHideStorageMap[id] = colHides.length ? colHides.map(function (column) {
            return column.property;
          }).join(',') : undefined;
          localStorage.setItem(settingOpts.storageKey, JSON.stringify(columnHideStorageMap));
        }

        return this.$nextTick();
      },
      saveColumnWidth: function saveColumnWidth(isReset) {
        var id = this.id,
          tableFullColumn = this.tableFullColumn,
          resizableOpts = this.resizableOpts;

        if (resizableOpts.storage) {
          var columnWidthStorageMap = this.getStorageMap(resizableOpts.storageKey);
          var columnWidthStorage;

          if (!isReset) {
            columnWidthStorage = VueUtil.isObject(columnWidthStorageMap[id]) ? columnWidthStorageMap[id] : {};
            tableFullColumn.forEach(function (_ref2) {
              var property = _ref2.property,
                resizeWidth = _ref2.resizeWidth,
                renderWidth = _ref2.renderWidth;

              if (property && resizeWidth) {
                columnWidthStorage[property] = renderWidth;
              }
            });
          }

          columnWidthStorageMap[id] = VueUtil.isEmpty(columnWidthStorage) ? undefined : columnWidthStorage;
          localStorage.setItem(resizableOpts.storageKey, JSON.stringify(columnWidthStorageMap));
        }

        return this.$nextTick();
      },

      saveColumnFixed: function () {
        var id = this.id,
          tableFullColumn = this.tableFullColumn,
          fixedOpts = this.fixedOpts;

        if (fixedOpts.storage) {
          var columnFixedStorageMap = this.getStorageMap(fixedOpts.storageKey);
          var columnFixedStorage = {};
          var colFixed = tableFullColumn.filter(function (column) {
            return column.property && column.fixed;
          });

          colFixed.forEach(function (col) {
            columnFixedStorage[col.property] = col.fixed;
          });

          columnFixedStorageMap[id] = VueUtil.isEmpty(columnFixedStorage) ? undefined : columnFixedStorage;
          localStorage.setItem(fixedOpts.storageKey, JSON.stringify(columnFixedStorageMap));
        }
        return this.$nextTick();
      },

      hideColumn: function hideColumn(column) {
        tools.UtilTools.warn('vue.xtable.error.delFunc', ['hideColumn', 'table.hideColumn']);

        column.visible = false;
        return this.updateSetting();
      },
      showColumn: function showColumn(column) {
        tools.UtilTools.warn('vue.xtable.error.delFunc', ['showColumn', 'table.showColumn']);

        column.visible = true;
        return this.updateSetting();
      },
      resetCustoms: function resetCustoms() {
        return this.updateSetting();
      },
      resetResizable: function resetResizable() {
        this.updateResizable(this);
      },
      updateResizable: function updateResizable(isReset) {
        var $grid = this.$grid,
          $table = this.$table;
        var comp = $grid || $table;
        this.saveColumnWidth(isReset);
        comp.analyColumnWidth();
        return comp.recalculate(true);
      },
      updateSetting: function updateSetting() {
        (this.$grid || this.$table).refreshColumn();
        return this.saveColumnHide();
      },
      updateFixed: function updateFixed() {
        (this.$grid || this.$table).refreshColumn();
        return this.saveColumnFixed();
      },
      handleGlobalMousedownEvent: function handleGlobalMousedownEvent(evnt) {
        var warpper = this.isFixedEvent(evnt) ? this.$refs.fixedWrapper : this.$refs.customWrapper;
        if (!tools.DomTools.getEventTargetNode(evnt, warpper).flag) {
          this.closeSetting();
        }
      },
      handleGlobalBlurEvent: function handleGlobalBlurEvent(evnt) {
        this.closeSetting();
      },
      isFixedEvent: function(evnt) {
        return tools.DomTools.getEventTargetNode(evnt, this.$refs.fixedWrapper).flag;
      },
      handleClickSettingEvent: function handleClickSettingEvent(evnt) {
        var settingStore = this.settingStore;
        var isFixed = this.isFixedEvent(evnt);
        if (isFixed) {
          settingStore.fixedVisible = !settingStore.fixedVisible;
          settingStore.visible = false;
        } else {
          settingStore.fixedVisible = false;
          settingStore.visible = !settingStore.visible;
        }
      },
      handleMouseenterSettingEvent: function handleMouseenterSettingEvent(evnt) {
        this.settingStore.activeBtn = true;
        this.openSetting();
      },
      handleMouseleaveSettingEvent: function handleMouseleaveSettingEvent(evnt) {
        var _this4 = this;

        var settingStore = this.settingStore;
        settingStore.activeBtn = false;
        setTimeout(function () {
          if (!settingStore.activeBtn && !settingStore.activeWrapper) {
            _this4.closeSetting();
          }
        }, 300);
      },
      // fix列
      handleWrapperMouseenterEvent: function handleWrapperMouseenterEvent(evnt) {
        this.settingStore.activeWrapper = true;
        this.openSetting();
      },
      handleWrapperMouseleaveEvent: function handleWrapperMouseleaveEvent(evnt) {
        var _this5 = this;

        var settingStore = this.settingStore;
        settingStore.activeWrapper = false;
        setTimeout(function () {
          if (!settingStore.activeBtn && !settingStore.activeWrapper) {
            _this5.closeSetting();
          }
        }, 300);
      },
      addRowEvent: function() {
        var $grid = this.$grid,
            $table = this.$table;
        var comp = $grid || $table;

        if(this.addRow.handler) {
          return this.addRow.handler(comp, 'add');
        }

        return comp.insertRow(-1, this.addRow.record, this.addRow.callback);
      },

      insertRowEvent: function() {
        var $grid = this.$grid,
            $table = this.$table;
        var comp = $grid || $table;

        if(this.insertRow.handler) {
          return this.insertRow.handler(comp, 'insert');
        }

        return comp.insertRow(this.insertRow.position, this.insertRow.record, this.insertRow.callback);
      },

      delRowEvent: function() {
        var $grid = this.$grid,
            $table = this.$table;
        var comp = $grid || $table;
        
        if(this.delRow.handler) {
          return this.delRow.handler(comp, 'del');
        }

        return comp.delRow(this.delRow.callback);
      },

      refreshEvent: function refreshEvent() {
        var _this6 = this;

        var $grid = this.$grid,
          refreshOpts = this.refreshOpts,
          isRefresh = this.isRefresh;

        if (!isRefresh) {
          if (refreshOpts.query) {
            this.isRefresh = true;
            refreshOpts.query().catch(function (e) {
              return e;
            }).then(function () {
              _this6.isRefresh = false;
            });
          } else if ($grid) {
            this.isRefresh = true;
            $grid.commitProxy('reload').catch(function (e) {
              return e;
            }).then(function () {
              _this6.isRefresh = false;
            });
          }
        }
      },
      btnEvent: function btnEvent(evnt, item) {
        var $grid = this.$grid,
          $table = this.$table;
        var code = item.code;

        if (code) {
          if ($grid) {
            $grid.triggerToolbarBtnEvent(item, evnt);
          } else {
            var btnMethod = baseTable.Buttons.get(code);

            var params = {
              code: code,
              button: item,
              $grid: $grid,
              $table: $table
            };

            if (btnMethod) {
              btnMethod.call(this, params, evnt);
            }

            tools.UtilTools.emitEvent(this, 'button-click', [params, evnt]);
          }
        }
      },
      importEvent: function importEvent() {
        this.openImport();
      },
      openImport: function openImport(options) {
        var importParams = this.importParams,
          importStore = this.importStore,
          importOpts = this.importOpts;
        var defOpts = VueUtil.assign({
          mode: 'covering',
          message: true
        }, options, importOpts);
        VueUtil.assign(importStore, {
          file: null,
          type: '',
          filename: '',
          visible: true
        });
        VueUtil.assign(importParams, defOpts);
      },
      confirmImportEvent: function confirmImportEvent(options) {
        var $grid = this.$grid,
          $table = this.$table;
        var comp = $grid || $table;
        comp.importByFile(this.importStore.file, options);
      },
      exportEvent: function exportEvent() {
        this.openExport();
      },
      openExport: function openExport(options) {
        var $grid = this.$grid,
          $table = this.$table,
          exportOpts = this.exportOpts,
          exportStore = this.exportStore,
          exportParams = this.exportParams;
        var comp = $grid || $table;

        var _comp$getTableColumn = comp.getTableColumn(),
          fullColumn = _comp$getTableColumn.fullColumn;

        var _comp$getTableData = comp.getTableData(),
          footerData = _comp$getTableData.footerData;

        var selectRecords = comp.getSelectRecords();
        var defOpts = VueUtil.assign({
          original: true,
          message: true,
          isPrint: true,
          showOriginal: true,
        }, exportOpts, options);

        var exportColumns = fullColumn.filter(defOpts.columnFilterMethod || function (column) {
          return column.type === 'index' || column.property && ['checkbox', 'selection', 'radio'].indexOf(column.type) === -1;
        });
        var treeStatus = comp.getTreeStatus();
        var forceOriginal = !!treeStatus;
        var hasFooter = !!footerData.length;
        var types = defOpts.types || baseTable.exportTypes; // 处理类型

        defOpts.types = types.map(function (value) {
          return {
            value: value,
            label: 'vue.xtable.types.'.concat(value)
          };
        }); // 索引列默认不选中

        exportColumns.forEach(function (column) {
          column.checked = defOpts.columnCheckMethod ? defOpts.columnCheckMethod(column) : column.type !== 'index';
        }); // 更新条件

        VueUtil.assign(exportStore, {
          columns: exportColumns,
          selectRecords: selectRecords,
          mode: selectRecords.length ? 'selected' : 'all',
          forceOriginal: !!treeStatus,
          hasFooter: !!footerData.length,
          visible: true
        }); // 重置参数

        VueUtil.assign(exportParams, {
          filename: defOpts.filename || '',
          sheetName: defOpts.sheetName || '',
          type: defOpts.type || defOpts.types[0].value,
          types: defOpts.types,
          original: forceOriginal || defOpts.original,
          showOriginal: defOpts.showOriginal,
          message: defOpts.message,
          isPrint: defOpts.isPrint,
          isHeader: true,
          isFooter: hasFooter
        });
        return this.$nextTick();
      },
      confirmPrintEvent: function confirmPrintEvent(options) {
        (this.$grid || this.$table).print(options);
      },
      confirmExportEvent: function confirmExportEvent(options) {
        (this.$grid || this.$table).exportData(options);
      }
    },
  };

  return VueXtableToolbar;
});