(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define( definition);
  } else {
    context.baseTable = definition(context.GlobalConfig, context.tools);
  }
})(this, function(GlobalConfig, tools) {
  var mod = {};
  var UtilTools = tools.UtilTools;
  var _defineProperty = tools.UtilTools.defineProperty;
  
  (function() {
    // 全局的工具栏按钮
    var _storeMap = {};
    var Buttons = {
      mixin: function mixin(map) {
        VueUtil.assign(_storeMap, map);
        return Buttons;
      },
      get: function get(type) {
        return _storeMap[type];
      },
      add: function add(type, callback) {
        _storeMap[type] = callback;
        return Buttons;
      },
      delete: function _delete(type) {
        delete _storeMap[type];
        return Buttons;
      }
    };
    mod.Buttons = Buttons;
  })();

  (function() {
    function toType(type) {
      return VueUtil.toString(type).replace('_', '').toLowerCase();
    }

    var eventTypes = 'created,mounted,activated,beforeDestroy,destroyed,event.clearActived,event.clearFilter,event.showMenu,event.keydown,event.export,event.import'.split(',').map(toType);
    var _storeMap = {};
    var Interceptor = {
      mixin: function mixin(map) {
        VueUtil.forEach(map, function (callback, type) {
          return Interceptor.add(type, callback);
        });
        return Interceptor;
      },
      get: function get(type) {
        return _storeMap[toType(type)] || [];
      },
      add: function add(type, callback) {
        type = toType(type);

        if (callback && VueUtil.includes(eventTypes, type)) {
          var eList = _storeMap[type];

          if (!eList) {
            eList = _storeMap[type] = [];
          }

          eList.push(callback);
        }

        return Interceptor;
      },
      delete: function _delete(type, callback) {
        var eList = _storeMap[toType(type)];

        if (eList) {
          VueUtil.remove(eList, function (cb) {
            return cb === callback;
          });
        }

        return Interceptor;
      }
    };
    mod.Interceptor = Interceptor;
  })();

  (function() {
    // 全局的快捷菜单
    var _storeMap = {};
    var Menus = {
      mixin: function mixin(map) {
        VueUtil.assign(_storeMap, map);
        return Menus;
      },
      get: function get(type) {
        return _storeMap[type];
      },
      add: function add(type, callback) {
        _storeMap[type] = callback;
        return Menus;
      },
      delete: function _delete(type) {
        delete _storeMap[type];
        return Menus;
      }
    };
    mod.Menus = Menus;
  })();

  (function() {
      function getAttrs(_ref) {
          var name = _ref.name,
              attrs = _ref.attrs;
      
          if (name === 'input') {
            attrs = VueUtil.assign({
              type: 'text'
            }, attrs);
          }
      
          return attrs;
        }
      
        function isSyncCell(renderOpts, params, context) {
          return renderOpts.immediate || renderOpts.type === 'visible' || context.$type === 'cell';
        }
        /**
         * 内置渲染器
         * 支持原生的 input、textarea、select
         */
      
      
        function defaultEditRender(h, renderOpts, params, context) {
          var row = params.row,
              column = params.column;
          var name = renderOpts.name;
          var attrs = getAttrs(renderOpts);
          var cellValue = isSyncCell(renderOpts, params, context) ? UtilTools.getCellValue(row, column) : column.model.value;
          return [h(name, {
            class: 'vue-xtable-default-'.concat(name),
            attrs: attrs,
            domProps: {
              value: cellValue
            },
            on: getEvents(renderOpts, params, context)
          })];
        }
      
        function getEvents(renderOpts, params, context) {
          var name = renderOpts.name,
              events = renderOpts.events;
          var $table = params.$table,
              row = params.row,
              column = params.column;
          var model = column.model;
          var isSelect = name === 'select';
          var type = isSelect ? 'change' : 'input';
      
          var on = UtilTools.defineProperty({}, type, function (evnt) {
            var cellValue = evnt.target.value;
      
            if (isSyncCell(renderOpts, params, context)) {
              UtilTools.setCellValue(row, column, cellValue);
            } else {
              model.update = true;
              model.value = cellValue;
            }
      
            $table.updateStatus(params, cellValue);
      
            if (events && events[type]) {
              events[type](params, evnt);
            }
          });
      
          if (events) {
            return VueUtil.assign({}, VueUtil.mapValues(events, function (cb) {
              return function () {
                cb.apply(null, [params].concat.apply(params, arguments));
              };
            }), on);
          }
      
          return on;
        }
      
        function renderOptgroups(h, renderOpts, params, context) {
          var optionGroups = renderOpts.optionGroups,
              _renderOpts$optionGro = renderOpts.optionGroupProps,
              optionGroupProps = _renderOpts$optionGro === void 0 ? {} : _renderOpts$optionGro;
          var groupOptions = optionGroupProps.options || 'options';
          var groupLabel = optionGroupProps.label || 'label';
          return optionGroups.map(function (group, gIndex) {
            return h('optgroup', {
              domProps: {
                label: group[groupLabel]
              },
              key: gIndex
            }, renderOptions(h, group[groupOptions], renderOpts, params, context));
          });
        }
      
        function renderOptions(h, options, renderOpts, params, context) {
          var _renderOpts$optionPro = renderOpts.optionProps,
              optionProps = _renderOpts$optionPro === void 0 ? {} : _renderOpts$optionPro;
          var row = params.row,
              column = params.column;
          var labelProp = optionProps.label || 'label';
          var valueProp = optionProps.value || 'value';
          var disabledProp = optionProps.disabled || 'disabled';
          var cellValue = isSyncCell(renderOpts, params, context) ? UtilTools.getCellValue(row, column) : column.model.value;
          return options.map(function (item, index) {
            return h('option', {
              attrs: {
                value: item[valueProp],
                disabled: item[disabledProp]
              },
              domProps: {
                selected: item[valueProp] === cellValue
              },
              key: index
            }, item[labelProp]);
          });
        }
      
        function getFilterEvents(item, renderOpts, params, context) {
          var _params = params,
              column = _params.column;
          var events = renderOpts.events;
          var type = name === 'select' ? 'change' : 'input';
      
          var on = UtilTools.defineProperty({}, type, function (evnt) {
            item.data = evnt.target.value;
            handleConfirmFilter(context, column, !!item.data, item);
      
            if (events && events[type]) {
              events[type](VueUtil.assign({
                context: context
              }, params), evnt);
            }
          });
      
          if (events) {
            return VueUtil.assign({}, VueUtil.mapValues(events, function (cb) {
              return function () {
                params = VueUtil.assign({
                  context: context
                }, params);
                cb.apply(null, [params].concat.apply(params, arguments));
              };
            }), on);
          }
      
          return on;
        }
      
        function defaultFilterRender(h, renderOpts, params, context) {
          var column = params.column;
          var name = renderOpts.name;
          var attrs = getAttrs(renderOpts);
          return column.filters.map(function (item) {
            return h(name, {
              class: 'vue-xtable-default-'.concat(name),
              attrs: attrs,
              domProps: {
                value: item.data
              },
              on: getFilterEvents(item, renderOpts, params, context)
            });
          });
        }
      
        function handleConfirmFilter(context, column, checked, item) {
          context[column.filterMultiple ? 'changeMultipleOption' : 'changeRadioOption']({}, checked, item);
        }
      
        function defaultFilterMethod(_ref2) {
          var option = _ref2.option,
              row = _ref2.row,
              column = _ref2.column;
          var data = option.data;
          var cellValue = VueUtil.get(row, column.property);
          /* eslint-disable eqeqeq */
      
          return cellValue == data;
        }
      
        function renderSelectEdit(h, renderOpts, params, context) {
          return [h('select', {
            class: 'vue-xtable-default-select',
            on: getEvents(renderOpts, params, context)
          }, renderOpts.optionGroups ? renderOptgroups(h, renderOpts, params, context) : renderOptions(h, renderOpts.options, renderOpts, params, context))];
        }
      
        var renderMap = {
          input: {
            autofocus: 'input',
            renderEdit: defaultEditRender,
            renderDefault: defaultEditRender,
            renderFilter: defaultFilterRender,
            filterMethod: defaultFilterMethod
          },
          textarea: {
            autofocus: 'textarea',
            renderEdit: defaultEditRender,
            renderDefault: defaultEditRender,
            renderFilter: defaultFilterRender,
            filterMethod: defaultFilterMethod
          },
          select: {
            renderEdit: renderSelectEdit,
            renderDefault: renderSelectEdit,
            renderCell: function renderCell(h, renderOpts, params, context) {
              var options = renderOpts.options,
                  optionGroups = renderOpts.optionGroups,
                  _renderOpts$optionPro2 = renderOpts.optionProps,
                  optionProps = _renderOpts$optionPro2 === void 0 ? {} : _renderOpts$optionPro2,
                  _renderOpts$optionGro2 = renderOpts.optionGroupProps,
                  optionGroupProps = _renderOpts$optionGro2 === void 0 ? {} : _renderOpts$optionGro2;
              var row = params.row,
                  column = params.column;
              var cellValue = VueUtil.get(row, column.property);
              var selectItem;
              var labelProp = optionProps.label || 'label';
              var valueProp = optionProps.value || 'value';
      
              if (optionGroups) {
                var groupOptions = optionGroupProps.options || 'options';
      
                for (var index = 0; index < optionGroups.length; index++) {
                  selectItem = VueUtil.find(optionGroups[index][groupOptions], function (item) {
                    return item[valueProp] === cellValue;
                  });
      
                  if (selectItem) {
                    break;
                  }
                }
      
                return selectItem ? selectItem[labelProp] : cellValue;
              } else {
                selectItem = VueUtil.find(options, function (item) {
                  return item[valueProp] === cellValue;
                });
                return selectItem ? selectItem[labelProp] : cellValue;
              }
            },
            renderFilter: function renderFilter(h, renderOpts, params, context) {
              var column = params.column;
              var attrs = renderOpts.attrs;
              return column.filters.map(function (item) {
                return h('select', {
                  class: 'vue-xtable-default-select',
                  attrs: attrs,
                  on: getFilterEvents(item, renderOpts, params, context)
                }, renderOpts.optionGroups ? renderOptgroups(h, renderOpts, params) : renderOptions(h, renderOpts.options, renderOpts, params, context));
              });
            },
            filterMethod: defaultFilterMethod
          }
        };

        function fallbackEditRender(h, renderOpts, params, context) {
          var row = params.row,
              column = params.column;
          var name = renderOpts.name;
          var attrs = VueUtil.assign({}, getAttrs(renderOpts));
          var cellValue = isSyncCell(renderOpts, params, context) ? UtilTools.getCellValue(row, column) : column.model.value;
          if(!attrs.value){
            attrs.value=cellValue;
          }
          return [h(name, {
            class: 'vue-default-'.concat(name),
            attrs: attrs,
            on: getFallbackEvents(renderOpts, params, context)
          })];
        }
        
        function getFallbackEvents(renderOpts, params, context) {
          var name = renderOpts.name,
              events = renderOpts.events;
          var $table = params.$table,
              row = params.row,
              column = params.column;
          var model = column.model;
          var type = name === 'select' ? 'change' : 'input';
        
          var on = _defineProperty({}, type, function (evnt) {
            var cellValue = evnt;
        
            if (isSyncCell(renderOpts, params, context)) {
              UtilTools.setCellValue(row, column, cellValue);
            } else {
              model.update = true;
              model.value = cellValue;
            }
            $table.updateStatus(params, cellValue);
          });
        
          if (events) {
            VueUtil.assign(on, VueUtil.mapValues(events, function (cb) {
              return function () {
                cb.apply(null, [params].concat.apply(params, arguments));
              };
            }));
          }
        
          return on;
        }

        var fallbackRender = function(name){
          return {
              autofocus: name,
              renderEdit: fallbackEditRender,
              renderDefault: fallbackEditRender,
              renderFilter: defaultFilterRender,
              filterMethod: defaultFilterMethod
            };
        };
        /**
         * 全局渲染器
         */
      
        var Renderer = {
          mixin: function mixin(map) {
            VueUtil.forEach(map, function (options, name) {
              return Renderer.add(name, options);
            });
            return Renderer;
          },
          get: function get(name) {
            return renderMap[name] || fallbackRender(name) || null;
          },
          add: function add(name, options) {
            if (name && options) {
              var renders = renderMap[name];
      
              if (renders) {
                VueUtil.assign(renders, options);
              } else {
                renderMap[name] = options;
              }
            }
      
            return Renderer;
          },
          delete: function _delete(name) {
            delete renderMap[name];
            return Renderer;
          }
        };
        mod.Renderer = Renderer;
  })();

  (function() {
    function mergeOpts(data1, data2) {
      if (data1 && VueUtil.isObject(data2)) {
        VueUtil.forEach(data2, function (val, key) {
          data1[key] = data1[key] && val ? mergeOpts(data1[key], val) : val;
        });
        return data1;
      }

      return data2;
    }
    /**
     * 全局参数设置
     */
    function setup() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      mergeOpts(GlobalConfig, options);
    }
    mod.setup = setup;
  })();

  var installedPlugins = [];

  function use(Plugin, options) {
    if (Plugin && Plugin.install) {
      if (installedPlugins.indexOf(Plugin) === -1) {
        Plugin.install(baseTable, options);
        installedPlugins.push(Plugin);
      }
    }

    return baseTable;
  }
  /**
   * 检测模块的安装顺序是否正确
   */


  function reg(key) {
    if (baseTable.Table) {
      UtilTools.error('vue.xtable.error.useErr', [key]);
    }

    baseTable['_'.concat(key)] = 1;
  }
  var baseTable = {
    t: function t(key) {
      return GlobalConfig.i18n(key);
    },
    v: 'v2',
    reg: reg,
    use: use,
    types: {},
    setup: mod.setup,
    interceptor: mod.Interceptor,
    renderer: mod.Renderer,
    buttons: mod.Buttons,
    menus: mod.Menus,
    Interceptor: mod.Interceptor,
    Renderer: mod.Renderer,
    Buttons: mod.Buttons,
    Menus: mod.Menus,
  };
  /**
   * 获取当前的 zIndex
   */

  Object.defineProperty(baseTable, 'zIndex', {
    get: UtilTools.getLastZIndex
  });
  /**
   * 获取下一个 zIndex
   */

  Object.defineProperty(baseTable, 'nextZIndex', {
    get: UtilTools.nextZIndex
  });
  /**
   * 获取所有导出类型
   */

  Object.defineProperty(baseTable, 'exportTypes', {
    get: function get() {
      return VueUtil.keys(baseTable.types);
    }
  });
  /**
   * 获取所有导入类型
   */

  Object.defineProperty(baseTable, 'importTypes', {
    get: function get() {
      var rest = [];
      VueUtil.forEach(baseTable.types, function (flag, type) {
        if (flag) {
          rest.push(type);
        }
      });
      return rest;
    }
  });

  return baseTable;
});