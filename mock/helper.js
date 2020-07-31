var template = XEAjaxMock.template;

var userData = template(require('./api/user/list.json'));
var columnData = template(require('./api/column/list.json'));
var fileData = template(require('./api/file/list.json'));

var sexData = template(require('./api/conf/sex.json'));
var cityAllData = template(require('./api/city/all.json'));
var i18nData = template(require('./api/i18n/list.json'));

module.exports = {
  userData: userData,
  columnData: columnData,
  fileData: fileData,
  sexData: sexData,
  cityAllData: cityAllData,
  i18nData: i18nData,
}