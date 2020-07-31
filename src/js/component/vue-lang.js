(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueLang = definition(context.Vue, context.VueUtil);
    delete context.VueLang;
    delete context.VuePopper;
    delete context.VuePopup;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueLang = {
    zh: {
      vue: {
        colorpicker: {
          confirm: '确定',
          clear: '清空'
        },
        datepicker: {
          now: '此刻',
          today: '今天',
          thisMonth: '本月',
          cancel: '取消',
          clear: '清空',
          confirm: '确定',
          selectDate: '选择日期',
          selectTime: '选择时间',
          startDate: '开始日期',
          startTime: '开始时间',
          endDate: '结束日期',
          endTime: '结束时间',
          year: '年',
          month1: '1 月',
          month2: '2 月',
          month3: '3 月',
          month4: '4 月',
          month5: '5 月',
          month6: '6 月',
          month7: '7 月',
          month8: '8 月',
          month9: '9 月',
          month10: '10 月',
          month11: '11 月',
          month12: '12 月',
          week: '周',
          weeks: {
            sun: '日',
            mon: '一',
            tue: '二',
            wed: '三',
            thu: '四',
            fri: '五',
            sat: '六'
          },
          months: {
            jan: '一月',
            feb: '二月',
            mar: '三月',
            apr: '四月',
            may: '五月',
            jun: '六月',
            jul: '七月',
            aug: '八月',
            sep: '九月',
            oct: '十月',
            nov: '十一月',
            dec: '十二月'
          }
        },
        select: {
          loading: '加载中',
          noMatch: '无匹配数据',
          noData: '无数据',
          placeholder: '请选择'
        },
        cascader: {
          noMatch: '无匹配数据',
          placeholder: '请选择'
        },
        pagination: {
          goto: '前往',
          pagesize: '条/页',
          total: '共 {total} 条',
          pageClassifier: '页'
        },
        messagebox: {
          title: '提示',
          confirm: '确定',
          cancel: '取消',
          error: '输入的数据不合法!'
        },
        upload: {
          delete: '删除',
          preview: '查看图片',
          continue: '继续上传'
        },
        table: {
          emptyText: '暂无数据',
          confirmFilter: '筛选',
          resetFilter: '重置',
          clearFilter: '全部',
          sumText: '合计',
          countText: '总数',
          averageText: '平均值',
          minText: '最小值',
          maxText: '最大值',
          contextMenu: '快捷菜单',
          pin: '固定列',
          leftPin: '固定至左边',
          rightPin: '固定至右边',
          sort: '排序',
          sortBy: '排序集',
          filter: '过滤',
          column: '字段',
          conditions: '条件',
          filterBy: '过滤集',
          display: '列显示',
          exportData: '数据导出',
          fileName: '文件名',
          exportOrgData: '导出原始数据',
          exportHandleData: '导出数据'
        },
        tree: {
          emptyText: '暂无数据'
        },
        screenfull: {
          canot: '不兼容您的浏览器!'
        },
        image:{
          error: '加载失败'
        },
        xtable: {
          error: {
            groupFixed: '如果使用分组表头，固定列必须在左右两侧',
            // scrollXNotResizable: '横向虚拟滚动不支持 "resizable"',
            cellEditRender: '渲染器 "cell-render" 和 "edit-render" 不能同时使用',
            treeFixedExpand: '树结构的固定列与展开行功能有冲突',
            scrollOriginal: '虚拟滚动启用后只能导出源数据，请将设置 "original=true"',
            scrollXNotGroup: '横向虚拟滚动不支持分组表头',
            scrollYReqProp: '纵向虚拟滚动需要设置 {0}',
            unableInsert: '无法插入到指定位置',
            useErr: '安装 {0} 模块时发生错误，顺序不正确',
            barUnableLink: '工具栏无法关联表格',
            toolbarId: '工具栏需要设置唯一 "id"',
            toolbarDelBtn: '工具栏按钮 {0} 已废弃，请使用 {1}',
            reqModule: '缺少 {0} 模块',
            emptyProp: '参数 {0} 不允许为空',
            notFunc: '{0} 方法不存在',
            noTree: '树结构不支持 {0}',
            delFunc: '方法 {0} 已废弃，请使用 {1}',
            delProp: '参数 {0} 已废弃，请使用 {1}',
            notType: '不支持的文件类型 "{0}"',
            notExp: '该浏览器不支持导入/导出功能',
            impFields: '导入失败，请检查字段名和数据格式是否正确',
            fixColumnDrag: '固定列不允许拖动！'
          },
          table: {
            emptyText: '暂无数据',
            confirmFilter: '筛选',
            resetFilter: '重置',
            allFilter: '全部',
            impSuccess: '导入成功',
            expSuccess: '导出成功'
          },
          column: {
            indexTitle: '#'
          },
          grid: {
            selectOneRecord: '请至少选择一条记录！',
            deleteSelectRecord: '您确定要删除所选记录吗？',
            removeSelectRecord: '您确定要移除所选记录吗？',
            dataUnchanged: '数据未改动！ ',
            saveSuccess: '保存成功'
          },
          pager: {
            goto: '前往',
            pagesize: '条/页',
            total: '共 {total} 条记录',
            pageClassifier: '页'
          },
          types: {
            csv: 'CSV (逗号分隔)(*.csv)',
            html: '网页(*.html)',
            xml: 'XML 数据(*.xml)',
            txt: '文本文件(制表符分隔)(*.txt)',
            xlsx: 'Excel 工作簿(*.xlsx)',
            pdf: 'PDF (*.pdf)'
          },
          toolbar: {
            impTitle: '导入参数设置',
            impFile: '文件名',
            impSelect: '选择文件',
            impType: '文件类型',
            impOpts: '导入选项',
            impConfirm: '导入',
            impModeCovering: '覆盖',
            impModeAppend: '追加',
            expTitle: '导出参数设置',
            expName: '文件名',
            expNamePlaceholder: '请输入文件名',
            expSheetName: '工作表名称',
            expSheetNamePlaceholder: '请输入工作表名称',
            expType: '保存类型',
            expMode: '要导出的数据',
            expAll: '全部数据',
            expSelected: '选中数据',
            expAllColumn: '全部字段',
            expColumn: '要导出的字段',
            expOpts: '导出选项',
            expOptHeader: '表头',
            expOptFooter: '表尾',
            expOptOriginal: '源(支持导入)',
            expPrint: '打印',
            expConfirm: '导出',
            refresh: '刷新',
            addRow: '新增行',
            insertRow: '插入行',
            delRow: '删除行',
          }
        }
      }
    },
    ja: {
      vue: {
        colorpicker: {
          confirm: 'はい',
          clear: 'クリア'
        },
        datepicker: {
          now: '現在',
          today: '今日',
          thisMonth: '今月',
          cancel: 'キャンセル',
          clear: 'クリア',
          confirm: 'はい',
          selectDate: '日付を選択',
          selectTime: '時間を選択',
          startDate: '開始日',
          startTime: '開始時間',
          endDate: '終了日',
          endTime: '終了時間',
          year: '年',
          week: '週',
          month1: '1月',
          month2: '2月',
          month3: '3月',
          month4: '4月',
          month5: '5月',
          month6: '6月',
          month7: '7月',
          month8: '8月',
          month9: '9月',
          month10: '10月',
          month11: '11月',
          month12: '12月',
          weeks: {
            sun: '日',
            mon: '月',
            tue: '火',
            wed: '水',
            thu: '木',
            fri: '金',
            sat: '土'
          },
          months: {
            jan: '1月',
            feb: '2月',
            mar: '3月',
            apr: '4月',
            may: '5月',
            jun: '6月',
            jul: '7月',
            aug: '8月',
            sep: '9月',
            oct: '10月',
            nov: '11月',
            dec: '12月'
          }
        },
        select: {
          loading: 'ロード中',
          noMatch: 'データなし',
          noData: 'データなし',
          placeholder: '選択してください'
        },
        cascader: {
          noMatch: 'データなし',
          placeholder: '選択してください'
        },
        pagination: {
          goto: '',
          pagesize: '件/ページ',
          total: '総計 {total} 件',
          pageClassifier: 'ページ目へ'
        },
        messagebox: {
          title: 'メッセージ',
          confirm: 'はい',
          cancel: 'キャンセル',
          error: '正しくない入力'
        },
        upload: {
          delete: '削除する',
          preview: 'プレビュー',
          continue: '続行する'
        },
        table: {
          emptyText: 'データなし',
          confirmFilter: '確認',
          resetFilter: '初期化',
          clearFilter: 'すべて',
          sumText: '合計',
          countText: '総数',
          averageText: '平均値',
          minText: '最小値',
          maxText: '最大値',
          contextMenu: 'コンテキスト・メニュー',
          pin: '固定列',
          leftPin: '左に固定',
          rightPin: '右に固定',
          sort: 'ソート',
          sortBy: 'ソート集',
          filter: 'フィルター',
          column: 'カラム',
          conditions: '条件',
          filterBy: 'フィルター集',
          display: '列表示',
          exportData: 'データ出力',
          fileName: 'ファイル名',
          exportOrgData: '元データ出力',
          exportHandleData: 'データ出力'
        },
        tree: {
          emptyText: 'データなし'
        },
        screenfull: {
          canot: 'ブラウザは実行できません!'
        },
        image: {
          error: '読み込みに失敗しました'
        },
        xtable: {
          error: {
            groupFixed: 'Grouping headersが使われている場合、fixed columnsは左右になくてはなりません',
            // scrollXNotResizable: 'Horizontal virtual scrollingは"resizable"をサポートしていません',
            cellEditRender: 'Rendererは"cell-render"と"edit-render"を同時に仕様できません',
            treeFixedExpand: '樹木構造の固定柱は展開された行と矛盾する。',
            scrollOriginal: 'Virtual scrollingはsource dataのみエクスポートできます、"original=true"を設定してください',
            scrollXNotGroup: '横向虚拟滚动不支持分组表头',
            scrollYReqProp: 'Virtual scrollingを有効にするには"{{0}}を設定してください',
            unableInsert: '指定された位置に挿入できない',
            useErr: '{0} モジュールのインストール時にエラーが発生し、エラーのインストール順序',
            barUnableLink: 'ツールバーはフォームを関連付けることができない',
            toolbarId: 'ツールバーはユニーク"id"を設定する必要がある',
            toolbarDelBtn: '工具栏按钮 {0} 已废弃，请使用 {1}',
            reqModule: '{0}モジュールが必要',
            emptyProp: '{0} propertyはemptyが許可されていません',
            notFunc: '{0} methodがありません',
            noTree: 'Tree structureは {0} をサポートしていません',
            delFunc: '{0} functionは非推奨です、{1}を使用してください',
            delProp: '{0} propertyは非推奨です、{1}を使用してください',
            notType: 'サポートされていないファイルタイプ {0}',
            notExp: 'ブラウザはインポート/エクスポート機能をサポートしていません',
            impFields: 'インポートに失敗しました。フィールド名とデータ形式が正しいことを確認してください',
            fixColumnDrag: '固定列はドラッグできません！'
          },
          table: {
            emptyText: 'データがありません',
            confirmFilter: '完了',
            resetFilter: 'リセット',
            allFilter: '全て',
            impSuccess: 'インポートに成功しました',
            expSuccess: 'エクスポートに成功しました'
          },
          column: {
            indexTitle: '#'
          },
          grid: {
            selectOneRecord: '少なくとも1つのレコードを選択してください',
            deleteSelectRecord: 'レコードを削除してもよろしいですか？',
            removeSelectRecord: 'レコードを削除してもよろしいですか？',
            dataUnchanged: 'データは変更されませんでした',
            saveSuccess: '保存しました'
          },
          pager: {
            goto: '移動',
            pagesize: '件/ページ',
            total: '全 {total} 件',
            pageClassifier: ''
          },
          types: {
            csv: 'CSV (カンマ区切り)(*.csv)',
            html: 'ウェブページ(*.html)',
            xml: 'XML データ(*.xml)',
            txt: 'テキスト(タブ区切り)(*.txt)',
            xlsx: 'Excel ワークブック(*.xlsx)',
            pdf: 'PDF (*.pdf)'
          },
          toolbar: {
            impTitle: 'インポート設定',
            impFile: 'ファイル名',
            impSelect: 'ファイルを選択',
            impType: 'ファイルタイプ',
            impOpts: 'オプション',
            impConfirm: 'インポート',
            impModeCovering: '上書きする',
            impModeAppend: '追加',
            expTitle: 'エクスポート設定',
            expName: 'ファイル名',
            expNamePlaceholder: 'ファイル名を入力してください',
            expSheetName: 'シート名',
            expSheetNamePlaceholder: 'シート名を入力してください',
            expType: 'エクスポートタイプ',
            expMode: 'エクスポートするデータ',
            expAll: 'すべてエクスポート',
            expSelected: '選択したデータ',
            expAllColumn: 'すべての列',
            expColumn: 'エクスポートする列',
            expOpts: 'オプション',
            expOptHeader: 'ヘッダー',
            expOptFooter: 'フッター',
            expOptOriginal: 'ソース（インポートをサポート）',
            expPrint: 'プリント',
            expConfirm: 'エクスポート',
            refresh: 'リフレッシュ',
            addRow: '行追加',
            insertRow: '行挿入',
            delRow: '行削除',
          }
        }
      }
    },
    en: {
      vue: {
        colorpicker: {
          confirm: 'OK',
          clear: 'Clear'
        },
        datepicker: {
          now: 'Now',
          today: 'Today',
          thisMonth: 'This Month',
          cancel: 'Cancel',
          clear: 'Clear',
          confirm: 'OK',
          selectDate: 'Select date',
          selectTime: 'Select time',
          startDate: 'Start Date',
          startTime: 'Start Time',
          endDate: 'End Date',
          endTime: 'End Time',
          year: '',
          week: 'Wk',
          month1: 'Jan',
          month2: 'Feb',
          month3: 'Mar',
          month4: 'Apr',
          month5: 'May',
          month6: 'Jun',
          month7: 'Jul',
          month8: 'Aug',
          month9: 'Sep',
          month10: 'Oct',
          month11: 'Nov',
          month12: 'Dec',
          weeks: {
            sun: 'Sun',
            mon: 'Mon',
            tue: 'Tue',
            wed: 'Wed',
            thu: 'Thu',
            fri: 'Fri',
            sat: 'Sat'
          },
          months: {
            jan: 'Jan',
            feb: 'Feb',
            mar: 'Mar',
            apr: 'Apr',
            may: 'May',
            jun: 'Jun',
            jul: 'Jul',
            aug: 'Aug',
            sep: 'Sep',
            oct: 'Oct',
            nov: 'Nov',
            dec: 'Dec'
          }
        },
        select: {
          loading: 'Loading',
          noMatch: 'No matching data',
          noData: 'No data',
          placeholder: 'Select'
        },
        cascader: {
          noMatch: 'No matching data',
          placeholder: 'Select'
        },
        pagination: {
          goto: 'Go to',
          pagesize: '/page',
          total: 'Total {total}',
          pageClassifier: ''
        },
        messagebox: {
          title: 'Message',
          confirm: 'OK',
          cancel: 'Cancel',
          error: 'Illegal input'
        },
        upload: {
          delete: 'Delete',
          preview: 'Preview',
          continue: 'Continue'
        },
        table: {
          emptyText: 'No Data',
          confirmFilter: 'Confirm',
          resetFilter: 'Reset',
          clearFilter: 'All',
          sumText: 'Sum',
          countText: 'Count',
          averageText: 'Average',
          minText: 'Mix',
          maxText: 'Max',
          contextMenu: 'Context Menu',
          pin: 'Pin',
          leftPin: 'Left Pin',
          rightPin: 'Right Pin',
          sort: 'Sort',
          sortBy: 'Sort By',
          filter: 'Filter',
          column: 'Column',
          conditions: 'Conditions',
          filterBy: 'Filter By',
          display: 'Display',
          exportData: 'Data Export',
          fileName: 'File Name',
          exportOrgData: 'Original Data Export',
          exportHandleData: 'Data Export'
        },
        tree: {
          emptyText: 'No Data'
        },
        screenfull: {
          canot: 'You browser can\'t work!'
        },
        image:{
          error: 'Failed to load'
        },
        xtable: {
          error: {
            groupFixed: 'If grouping headers are used, fixed columns must be on the left and right sides.',
            // scrollXNotResizable: 'Horizontal virtual scrolling does not support "resizable".',
            cellEditRender: 'The renderer "cell-render" and "edit-render" cannot be used together.',
            treeFixedExpand: 'The fixed columns of the tree structure conflict with the expanded row.',
            scrollOriginal: 'Virtual scrolling can only export source data, please set "original=true".',
            scrollXNotGroup: 'Horizontal Virtual scrolling does not support grouping headers',
            scrollYReqProp: 'Vertical virtual scrolling requires setting the {0}.',
            unableInsert: 'Unable to insert to the specified location.',
            useErr: 'An error occurred while installing {0} module. The sequence is not correct.',
            barUnableLink: 'Toolbar cannot associate table.',
            toolbarId: 'Toolbar must have a unique "id"',
            toolbarDelBtn: 'Toolbar button {0} is deprecated, please use {1}',
            reqModule: 'require {0} module.',
            emptyProp: 'The property {0} is not allowed to be empty.',
            notFunc: '{0} method not exist.',
            noTree: 'The tree structure does not support {0}.',
            delFunc: 'The property {0} is deprecated, please use {1}.',
            delProp: 'The function {0} is deprecated, please use {1}.',
            notType: 'Unsupported file types {0}',
            notExp: 'The browser does not support import / export.',
            impFields: 'Import failed, please check that the field name and data format are correct.',
            fixColumnDrag: 'Fixed columns are not allowed to drag!'
          },
          table: {
            emptyText: 'No Data',
            confirmFilter: 'Confirm',
            resetFilter: 'Reset',
            allFilter: 'All',
            impSuccess: 'Import success',
            expSuccess: 'Export success'
          },
          column: {
            indexTitle: '#'
          },
          grid: {
            selectOneRecord: 'Please choose at least one piece of record!',
            deleteSelectRecord: 'Are you sure you want to delete the selected record?',
            removeSelectRecord: 'Are you sure you want to remove the selected record?',
            dataUnchanged: 'Data unchanged! ',
            saveSuccess: 'save successfully.'
          },
          pager: {
            goto: 'Go to',
            pagesize: '/page',
            total: 'Total {total} record',
            pageClassifier: ''
          },
          types: {
            csv: 'CSV (Comma separated) (*.csv)',
            html: 'Web Page (*.html)',
            xml: 'XML Data(*.xml)',
            txt: 'Text (Tab delimited) (*.txt)',
            xlsx: 'Excel Workbook (*.xlsx)',
            pdf: 'PDF (*.pdf)'
          },
          toolbar: {
            impTitle: 'Import parameter settings',
            impFile: 'Filename',
            impSelect: 'Select file',
            impType: 'File type',
            impOpts: 'Import option',
            impConfirm: 'Import',
            impModeCovering: 'Covering',
            impModeAppend: 'Append',
            expTitle: 'Export parameter settings',
            expName: 'Filename',
            expNamePlaceholder: 'Please enter filename',
            expSheetName: 'Sheet name',
            expSheetNamePlaceholder: 'Please enter a sheet name.',
            expType: 'Save the type',
            expMode: 'Data to export',
            expAll: 'All data',
            expSelected: 'Selected data',
            expAllColumn: 'All the field',
            expColumn: 'The field to export',
            expOpts: 'Export option',
            expOptHeader: 'Header',
            expOptFooter: 'Footer',
            expOptOriginal: 'Original (Support for importing)',
            expPrint: 'Print',
            expConfirm: 'Export',
            refresh: 'Refresh',
            addRow: 'Add Row',
            insertRow: 'Insert Row',
            delRow: 'Delete Row',
          }
        }
      }
    }
  };
  VueUtil.setLocale('zh', VueLang.zh);
  VueUtil.setLocale('ja', VueLang.ja);
  VueUtil.setLocale('en', VueLang.en);
  VueUtil.setLang('zh');

  if(typeof bundleModule != 'undefined') {
    bundleModule.lang = VueLang;
  }
});
