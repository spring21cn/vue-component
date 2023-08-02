(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    definition(context);
  }
})(this, function(context) {
  var baseTable = context.baseTable;
  // 暴露配置用变量到vueutil
  VueUtil.config.baseTable = baseTable;
  VueUtil.config.xtable = GlobalConfig;

  Vue.component(context.VueXtableColumn.name, context.VueXtableColumn);

  Vue.component(context.VueXtableHeader.name, context.VueXtableHeader);

  Vue.component(context.VueXtableBody.name, context.VueXtableBody);

  Vue.component(context.VueXtableFooter.name, context.VueXtableFooter);

  context.baseTable.reg('filter');
  context.VueXtable.mixins.push(context.VueXtableFilterMixin);
  Vue.component(context.VueXtableFilter.name, context.VueXtableFilter);

  Vue.component(context.VueXtableLoading.name, context.VueXtableLoading);

  Vue.component(context.VueXgrid.name, context.VueXgrid);

  context.baseTable.reg('menu');
  context.VueXtable.mixins.push(context.VueXtableContextMenuMixin);
  Vue.component(context.VueXtableContextMenu.name, context.VueXtableContextMenu);

  Vue.component(context.VueXtableToolbar.name, context.VueXtableToolbar);

  Vue.component(context.VueXtablePager.name, context.VueXtablePager);

  context.baseTable._tooltip = 1;
  Vue.component(context.VueXtableTooltip.name, context.VueXtableTooltip);

  context.baseTable.reg('edit');
  context.VueXtable.mixins.push(context.VueXtableEditMixin);

  context.baseTable.reg('export');

  Object.defineProperty(baseTable, 'types', {
    get: function get() {
      var res = {
        csv: 1,
        html: 1,
        xml: 1,
        txt: 1
      };

      if(VueUtil.Excel) {
        res.xlsx = 1;
      }

      return res;
    }
  });

  context.VueXtable.mixins.push(context.VueXtableExportMixin);
  Vue.component(context.VueXtableExportPanel.name, context.VueXtableExportPanel);
  Vue.component(context.VueXtableImportPanel.name, context.VueXtableImportPanel);

  
  context.baseTable.reg('keyboard');
  context.VueXtable.mixins.push(context.VueXtableKeyboardMixin);

  context.baseTable.reg('valid');
  context.VueXtable.mixins.push(context.VueXtableValidatorMixin);

  context.baseTable.use(context.VueXtableChart);

  context.baseTable.Vue = context.Vue;
  context.baseTable.Table = context.VueXtable;
  Vue.component(context.VueXtable.name, context.VueXtable);


  var allGlobalVars = 'baseTable,tools,VueXtableColumn,VueXtableHeader,VueXtableBody,VueXtableFooter,VueXtableFilterMixin,VueXtableFilter,VueXtableLoading,'
  +'VueXgrid,VueXtableContextMenuMixin,VueXtableContextMenu,VueXtableToolbar,VueXtablePager,VueXtableTooltip,VueXtableEditMixin,VueXtableExportMixin,'
  +'VueXtableExportPanel,VueXtableImportPanel,VueXtableKeyboardMixin,VueXtableValidatorMixin,VueXtableChart,VueXtable';

  allGlobalVars.split(',').forEach(function(name) {
    context[name] && delete context[name];
  });
});