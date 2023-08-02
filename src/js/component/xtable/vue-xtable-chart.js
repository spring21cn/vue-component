(function (context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    context.VueXtableChart = definition(context.tools);
  }
})(this, function () {
  'use strict';

  var modal = Vue.extend(({
    name: 'VueChartModal',
    data: function () {
      return { visible: false };
    },
    props: {
      title: String,
      showClose: Boolean,
      size: String,
      slots: Object,
      events: Object,
      width: [Number, String],
      height: [Number, String]
    },
    methods: {
      open: function () {
        var self = this,
          events = self.events === void 0 ? {} : self.events,
          listeners = this.$listeners;
        var params = {
          type: 'show',
          $modal: self
        };
        setTimeout(function () {
          self.visible = true;
          self.$nextTick(function () {
            if (!events.show) {
              self.$emit('input', true);
              self.$emit('show', params);
            }
            if (!listeners.show && events.show) {
              events.show.call(self, params);
            }
          });
        }, 10);
      },
      close: function (visible) {
        var self = this,
          events = self.events === void 0 ? {} : self.events;
        self.visible = visible;
        self.$el.parentNode.removeChild(self.$el);
        setTimeout(function () {
          var params = {
            type: 'hide',
            $modal: self
          };
          if (events.hide) {
            events.hide.call(self, params);
          } else {
            self.$emit('input', false);
            self.$emit('hide', params);
          }
        }, 200);
      },
      getBox: function getBox() {
        return this.$refs.modalBox;
      }
    },
    mounted: function () {
      document.body.appendChild(this.$el); // 触发 inserted 事件
      var modalElem = this.getBox(),
        width = this.width,
        height = this.height;
      VueUtil.assign(modalElem.style, {
        /* width: width ? isNaN(width) ? width : "".concat(width, "px") : null, */
        height: height ? isNaN(height) ? height : ''.concat(height, 'px') : null,
        width: '100%',
        overflow: 'auto'
      });
    },
    render: function render(h) {
      var self = this;
      var $scopedSlots = this.$scopedSlots;
      var defaultSlot = $scopedSlots.default || self.slots.default;
      return h('vue-dialog', {
        res: 'modal',
        model: {
          value: self.visible,
          callback: function callback(value) {
            if (!value) { self.close(value); }
          }
        },
        props: {
          title: self.title,
          showClose: self.showClose,
          widht: self.width,
          height: self.height
        }
      }, [h('div', {
        ref: 'modalBox'
      }, [defaultSlot ? defaultSlot.call(this, {
        $modal: this
      }, h) : null])]);
    }
  }));

  function createChartModal(getOptions) {
    return function (params) {
      var menu = params.menu;
      var dialogdiv = document.createElement('div');

      var options = {
        width: 600,
        height: 400,
        title: menu.name,
        showClose: true,
        slots: {
          'default': function _default(params, h) {
            return [h('div', {
              'class': 'vue-xtable-chart--wrapper'
            }, [h('div', {
              'class': 'vue-xtable-chart--panel'
            })])];
          }
        },
        events: {
          show: function show() {
            var $chart = echarts.init(this.$el.querySelector('.vue-xtable-chart--wrapper'));

            $chart.setOption(getOptions(params));
            this.$chart = $chart;
          },
          close: function close() {
            // 旧版本，即将废弃
            this.$chart.dispose();
            this.$chart = null;
          },
          hide: function hide() {
            this.$chart.dispose();
            this.$chart = null;
          },
          zoom: function zoom() {
            this.$chart.resize();
          }
        }
      };
      var chart = new modal({
        i18n: Vue.i18n,
        el: dialogdiv,//document.createElement('div'),
        propsData: options
      });
      setTimeout(function () {
        return chart.open();
      }, 10);
    };
  }

  var menuMap = {
    CHART_BAR_X_AXIS: createChartModal(function (params) {
      var $table = params.$table,
        menu = params.menu;

      var _$table$getMouseCheck = $table.getMouseCheckeds(),
        rows = _$table$getMouseCheck.rows,
        columns = _$table$getMouseCheck.columns;

      var _menu$params = menu.params,
        chartParams = _menu$params === void 0 ? {} : _menu$params;
      var category = chartParams.category;
      var categoryColumn = $table.getColumnByField(category || columns[0].property);
      var serieColumns = columns.filter(function (column) {
        return column.property !== categoryColumn.property;
      });
      var legendOpts = {
        data: []
      };
      var seriesOpts = [];
      var xAxisOpts = {
        type: 'category',
        data: rows.map(function (row) {
          return VueUtil.get(row, categoryColumn.property);
        })
      };
      serieColumns.forEach(function (column) {
        legendOpts.data.push(column.title);
        seriesOpts.push({
          name: column.title,
          type: 'bar',
          data: rows.map(function (row) {
            return VueUtil.get(row, column.property);
          })
        });
      });
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: legendOpts,
        xAxis: xAxisOpts,
        yAxis: {
          type: 'value'
        },
        series: seriesOpts
      };
      return option;
    }),
    CHART_BAR_Y_AXIS: createChartModal(function (params) {
      var $table = params.$table,
        menu = params.menu;

      var _$table$getMouseCheck2 = $table.getMouseCheckeds(),
        rows = _$table$getMouseCheck2.rows,
        columns = _$table$getMouseCheck2.columns;

      var _menu$params2 = menu.params,
        chartParams = _menu$params2 === void 0 ? {} : _menu$params2;
      var category = chartParams.category;
      var categoryColumn = $table.getColumnByField(category || columns[0].property);
      var serieColumns = columns.filter(function (column) {
        return column.property !== categoryColumn.property;
      });
      var legendOpts = {
        data: []
      };
      var seriesOpts = [];
      var xAxisOpts = {
        type: 'category',
        data: rows.map(function (row) {
          return VueUtil.get(row, categoryColumn.property);
        })
      };
      serieColumns.forEach(function (column) {
        legendOpts.data.push(column.title);
        seriesOpts.push({
          name: column.title,
          type: 'bar',
          data: rows.map(function (row) {
            return VueUtil.get(row, column.property);
          })
        });
      });
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: legendOpts,
        xAxis: xAxisOpts,
        yAxis: {
          type: 'value'
        },
        series: seriesOpts
      };
      return option;
    }),
    CHART_LINE: createChartModal(function (params) {
      var $table = params.$table,
        menu = params.menu;

      var _$table$getMouseCheck3 = $table.getMouseCheckeds(),
        rows = _$table$getMouseCheck3.rows,
        columns = _$table$getMouseCheck3.columns;

      var _menu$params3 = menu.params,
        chartParams = _menu$params3 === void 0 ? {} : _menu$params3;
      var category = chartParams.category;
      var categoryColumn = $table.getColumnByField(category || columns[0].property);
      var serieColumns = columns.filter(function (column) {
        return column.property !== categoryColumn.property;
      });
      var legendOpts = {
        data: []
      };
      var seriesOpts = [];
      var xAxisOpts = {
        type: 'category',
        data: rows.map(function (row) {
          return VueUtil.get(row, categoryColumn.property);
        })
      };
      serieColumns.forEach(function (column) {
        legendOpts.data.push(column.title);
        seriesOpts.push({
          name: column.title,
          type: 'line',
          data: rows.map(function (row) {
            return VueUtil.get(row, column.property);
          })
        });
      });
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: legendOpts,
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: xAxisOpts,
        yAxis: {
          type: 'value'
        },
        series: seriesOpts
      };
      return option;
    }),
    CHART_PIE: createChartModal(function (params) {
      var $table = params.$table,
        menu = params.menu;

      var _$table$getMouseCheck4 = $table.getMouseCheckeds(),
        rows = _$table$getMouseCheck4.rows,
        columns = _$table$getMouseCheck4.columns;

      var _menu$params4 = menu.params,
        chartParams = _menu$params4 === void 0 ? {} : _menu$params4;
      var category = chartParams.category;
      var categoryColumn = $table.getColumnByField(category || columns[0].property);
      var serieColumns = columns.filter(function (column) {
        return column.property !== categoryColumn.property;
      });
      var serieColumn = serieColumns[0];
      var legendData = rows.map(function (row) {
        return VueUtil.get(row, categoryColumn.property);
      });
      var seriesData = [];
      rows.forEach(function (row) {
        seriesData.push({
          name: VueUtil.get(row, categoryColumn.property),
          value: VueUtil.get(row, serieColumn.property)
        });
      });
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: legendData // selected: data.selected

        },
        series: [{
          name: serieColumn.title,
          type: 'pie',
          radius: '50%',
          center: ['40%', '50%'],
          data: seriesData
        }]
      };
      return option;
    })
  };

  function checkPrivilege(item, params) {
    var $table = params.$table;
    var code = item.code,
      _item$params = item.params,
      chartParams = _item$params === void 0 ? {} : _item$params;

    switch (code) {
      case 'CHART_BAR_X_AXIS':
      case 'CHART_BAR_Y_AXIS':
      case 'CHART_LINE':
        {
          var _$table$getMouseCheck5 = $table.getMouseCheckeds(),
            rows = _$table$getMouseCheck5.rows,
            columns = _$table$getMouseCheck5.columns;

          var category = chartParams.category;

          if (category) {
            var serieColumns = columns.filter(function (column) {
              return column.property !== category;
            });
            item.disabled = !rows.length || serieColumns.length < 1;
          } else {
            item.disabled = !rows.length || columns.length < 2;
          }
        }
        break;

      case 'CHART_PIE':
        {
          var _$table$getMouseCheck6 = $table.getMouseCheckeds(),
            _rows = _$table$getMouseCheck6.rows,
            _columns = _$table$getMouseCheck6.columns;

          var _category = chartParams.category;

          if (_category) {
            var _serieColumns = _columns.filter(function (column) {
              return column.property !== _category;
            });

            item.disabled = !_rows.length || _serieColumns.length !== 1;
          } else {
            item.disabled = !_rows.length || _columns.length !== 2;
          }
        }
        break;
    }
  }

  function handlePrivilegeEvent(params) {
    params.options.forEach(function (list) {
      list.forEach(function (item) {
        checkPrivilege(item, params);

        if (item.children) {
          item.children.forEach(function (child) {
            checkPrivilege(child, params);
          });
        }
      });
    });
  }

  var VueXtableChart = {
    install: function install(baseTable) {
      var interceptor = baseTable.interceptor,
        menus = baseTable.menus;

      interceptor.add('event.show_menu', handlePrivilegeEvent);
      menus.mixin(menuMap);
    }
  };

  return VueXtableChart;
});