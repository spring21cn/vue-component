(function (context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([''], definition);
  } else {
    context.GlobalConfig = definition();
  }
})(this, function () {
  var GlobalConfig = {
    // showOverflow: null,
    // showHeaderOverflow: null,
    // resizeInterval: 250,
    // size: null,
    // validConfig: {
    //   message: 'default'
    // },
    // tooltipConfig: {
    //   enterable: false
    // },
    // resizable: false,
    // stripe: false,
    // border: false,
    fit: true,
    emptyCell: '　',
    showHeader: true,
    zIndex: 100,
    rowId: '_XID',
    // 行数据的唯一主键字段名
    version: 0,
    // 版本号，对于某些带数据缓存的功能有用到，上升版本号可以用于重置数据
    optimization: {
      animat: true,
      delayHover: 250,
      // rHeights: {
      //   default: 48,
      //   medium: 44,
      //   small: 40,
      //   mini: 36
      // },
      scrollX: {
        gt: 100 // oSize: 0,
        // rSize: 0
        // vSize: 0

      },
      scrollY: {
        gt: 500 // oSize: 0,
        // rSize: 0
        // vSize: 0,
        // rHeight: 0

      }
    },
    icon: {
      sortAsc: 'vue-xtable-icon--caret-top',
      sortDesc: 'vue-xtable-icon--caret-bottom',
      filter: 'vue-xtable-icon--funnel',
      edit: 'vue-xtable-icon--edit-outline',
      tree: 'vue-xtable-icon--caret-right',
      refresh: 'vue-icon-refresh',
      addRow: 'vue-icon-add-row',
      insertRow: 'vue-icon-insert-row',
      delRow: 'vue-icon-del-row',
      import: 'vue-icon-import-file',
      importRemove: 'vue-xtable-icon--close',
      export: 'vue-icon-export-file',
      custom: 'vue-icon-menu',
      fixed: 'vue-icon-sort',
      jumpPrev: 'vue-xtable-icon--d-arrow-left',
      jumpNext: 'vue-xtable-icon--d-arrow-right',
      prevPage: 'vue-xtable-icon--arrow-left',
      nextPage: 'vue-xtable-icon--arrow-right',
      zoomIn: 'vue-xtable-icon--zoomin',
      zoomOut: 'vue-xtable-icon--zoomout',
      caretBottom: 'vue-xtable-icon--caret-bottom',
      dropdownBottom: 'vue-xtable-icon--arrow-bottom',
      btnLoading: 'vue-xtable-icon--refresh roll'
    },
    grid: {},
    menu: {},
    tooltip: {
      trigger: 'hover',
      theme: 'dark',
      leaveDelay: 300
    },
    pager: {// perfect: true,
      // pageSize: 10,
      // pagerCount: 7,
      // pageSizes: [10, 15, 20, 50, 100],
      // layouts: ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total']
    },
    toolbar: {// import: {
      //   mode: 'covering'
      // },
      // export: {
      //   types: ['csv', 'html', 'xml', 'txt']
      // },
      // resizable: {
      //   storage: false
      // },
      // export: false,
      // setting: {
      //   storage: false
      // },
      // addRow: {
      //   handler: handler, record:record, callback: callback
      // },
      // insertRow: {
      //   position:position, handler: handler, record:record, callback: callback
      // },
      // delRow: {
      //   handler: handler, callback: callback
      // }
      // buttons: []
    },
    i18n: function i18n(key) {
      return Vue.t(key);
    }
  };

  return GlobalConfig;
});
