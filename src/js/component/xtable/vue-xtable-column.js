(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    context.VueXtableColumn = definition(context.tools, context.cell);
  }
})(this, function(tools, cell) {
  
  var props = {
    // 渲染类型 index,radio,checkbox,expand,drag
    type: String,
    // 在 v3.0 中废弃 prop
    prop: String,
    // 在 v3.0 中废弃 label
    label: String,
    // 列属性
	field: [String,Array],
    // 列标题
    title: String,
    // 列宽度
    width: [Number, String],
    // 列最小宽度，把剩余宽度按比例分配
    minWidth: [Number, String],
    // 是否允许拖动列宽调整大小
    resizable: {
      type: Boolean,
      default: null
    },
    // 将列固定在左侧或者右侧
    fixed: String,
    // 列对其方式
    align: String,
    // 表头对齐方式
    headerAlign: String,
    // 表尾列的对齐方式
    footerAlign: String,
    // 当内容过长时显示为省略号
    showOverflow: {
      type: [Boolean, String],
      default: null
    },
    // 当表头内容过长时显示为省略号
    showHeaderOverflow: {
      type: [Boolean, String],
      default: null
    },
    // 给单元格附加 className
    className: [String, Function],
    // 给表头单元格附加 className
    headerClassName: [String, Function],
    // 给表尾单元格附加 className
    footerClassName: [String, Function],
    // 格式化显示内容
    formatter: [Function, Array, String],
    // 自定义索引方法
    indexMethod: Function,
    // 是否允许排序
    sortable: Boolean,
    // 是否服务端排序
    remoteSort: {
      type: Boolean,
      default: null
    },
    // 自定义排序的属性
    sortBy: [String, Array],
    // 自定义排序方法
    sortMethod: Function,
    // 配置筛选条件数组
    filters: Array,
    // 筛选是否允许多选
    filterMultiple: {
      type: Boolean,
      default: true
    },
    // 自定义筛选方法
    filterMethod: Function,
    // 筛选模板配置项
    filterRender: Object,
    // 指定为树节点
    treeNode: Boolean,
    // 单元格渲染配置项
    cellRender: Object,
    // 单元格编辑渲染配置项
    editRender: Object,
    // 复制时值的格式化方法
    copyFormatter: [Function, Array, String],
    // 黏贴时值的格式化方法
    pasteFormatter: [Function, Array, String],
    // 值的format缓存key
    formatterKey: [Function, Array, String],
    // 额外的参数
    params: Object,
    visible: {
      type: Boolean,
      default: true
    },
    excelExportConfig: Function
  };
  var watch = {};
  VueUtil.keys(props).forEach(function (name) {
    watch[name] = function (value) {
      this.columnConfig.update(name, value);
      this.$table.refreshColumn(false);
    };
  });
  var VueXtableColumn = {
    name: 'VueXtableColumn',
    props: props,
    provide: function provide() {
      return {
        $column: this
      };
    },
    inject: {
      $table: {
        default: null
      },
      $column: {
        default: null
      }
    },
    watch: watch,
    created: function created() {
      this.columnConfig = this.createColumn(this.$table, this);
    },
    mounted: function mounted() {
      tools.UtilTools.assemColumn(this);
    },
    destroyed: function destroyed() {
      var self = this;
      VueUtil.remove(this.$table.sortingColumns, function(column) {
        return column.id && column.id === self.columnConfig.id;
      });

      tools.UtilTools.destroyColumn(this);
    },
    render: function render(h) {
      return h('div', this.$slots.default);
    },
    methods: cell
  };
  
  return VueXtableColumn;
});