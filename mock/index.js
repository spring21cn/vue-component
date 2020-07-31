var helper = require('./helper');

MockData = {
  // user
  'GET */api/user/page/list(/:pageSize)(/:currentPage)': function (param, query, request, passThrough) {
    var pageSize = VueUtil.toNumber(param.pageSize);
    var currentPage = VueUtil.toNumber(param.currentPage);
    var totalResult = helper.userData.length;

    let body = {
      page: {  pageSize: pageSize, currentPage: currentPage, totalResult: totalResult, total: totalResult },
      result: helper.userData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    }
    return {
      body: body,
      status: 200,
    }
  },
  'GET */api/user/list': helper.userData.slice(0, 10),
  'POST */api/user/save': function(param, query, request, passThrough) {
    var removeRecords = request.body.removeRecords
    VueUtil.remove(helper.userData, function (item) {
      return removeRecords.some(function (row) {
        return row.id === item.id;
      });
    });
    return {
      status: 200,
    }
  },


  //column
  'GET */api/column/page/list(/:pageSize)(/:currentPage)': function (param, query, request, passThrough) {
    var pageSize = VueUtil.toNumber(param.pageSize);
    var currentPage = VueUtil.toNumber(param.currentPage);
    var totalResult = helper.columnData.length;

    let body = {
      page: { pageSize: pageSize, currentPage: currentPage, totalResult: totalResult, total: totalResult },
      result: helper.columnData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    }
    return {
      body: body,
      status: 200,
    }
  },
  'GET */api/column/list': helper.columnData.slice(0, 10),


  // file
  'GET */api/file/list': helper.fileData,

  
  // sex
  'GET */api/conf/sex/list': helper.sexData,

  // city
  'GET */api/conf/city/all': helper.cityAllData,

  // i18n
  'GET */api/i18n/list': helper.i18nData,

  
}
Vue.use(window["vue-resource-mock"].default, MockData, { silent: false })