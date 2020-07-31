(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    context.VueRules = definition();
  }
})(this, function() {
  'use strict';

  var basicRule = function(rule, value, callback, regex) {
    if (regex.test(value)) {
      callback();
    } else {
      callback(new Error(rule.message));
    }
  };

  var halfwidthkana = function(rule, value, callback) {
    return basicRule(rule, value, callback, /^([ｧ-ﾝﾞﾟ ]+)$/);
  };
  var hiragana = function(rule, value, callback) {
    return basicRule(rule, value, callback, /^([ぁ-ん 　]+)$/);
  };
  var katakana = function(rule, value, callback) {
    return basicRule(rule, value, callback, /^([ァ-ヶー 　]+)$/);
  };
  var fullwithkana = function(rule, value, callback) {
    return basicRule(rule, value, callback, /^([ァ-ヶーぁ-ん 　]+)$/);
  };

  var VueRules = {
    halfwidthkana: halfwidthkana,
    hiragana: hiragana,
    katakana: katakana,
    fullwithkana: fullwithkana,
  };
  Vue.prototype.$rules = VueRules;
  return VueRules;
});
