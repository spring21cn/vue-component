(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    context.VueFormatter = definition();
  }
})(this, function() {
  
  'use strict';

  // var format = function(value, regex) {
  //   var res = '';
  //   if(!regex.test(value)) {
  //     for (var i = 0; i < value.length; i++) {
  //       var char = value.charAt(i);
  //       if(regex.test(char)) {
  //         res += char;
  //       }
  //     }
  //   } else {
  //     res = value;
  //   }
  //   return res;
  // };

  var alpha = function(value) {
    // return format(value, /^([a-zA-Z]+)$/);
    return value.replace(/([^a-zA-Z])/, '');
  };
  var alnum = function(value) {
    //return format(value, /^([a-zA-Z0-9\.]+)$/);
    return value.replace(/([^a-zA-Z0-9.])/, '');
  };
  var alint = function(value) {
    // return format(value, /^([a-zA-Z0-9]+)$/);
    return value.replace(/([^a-zA-Z0-9])/, '');
  };
  // //todo 由于英文被禁止，输入法无法输入日语。
  // var halfwidthkana = function(value) {
  //   return format(value, /^([ｧ-ﾝﾞﾟ ]+)$/);
  // };
  // var hiragana = function(value) {
  //   return format(value, /^([ぁ-ん 　]+)$/);
  // };
  // var katakana = function(value) {
  //   return format(value, /^([ァ-ヶー 　]+)$/);
  // };
  // var fullwithkana = function(value) {
  //   return format(value, /^([ァ-ヶーぁ-ん 　]+)$/);
  // };
  // //end todo

  var alnumsymbol = function(value) {
    // return format(value, /^([0-9a-zA-Z\!\"\#\$\%\&\'\(\)\-\=\^\~\\\|\@\`\[\{\;\+\:\*\]\}\,\>\.\<;\/\?\_ ]+)$/);
    return value.replace(/([^0-9a-zA-Z\!\"\#\$\%\&\'\(\)\-\=\^\~\\\|\@\`\[\{\;\+\:\*\]\}\,\>\.\<;\/\?\_ ])/, '');
  };
  var alnumhyphenasterisk = function(value) {
    return value.replace(/([^0-9a-zA-Z\-*])/, '');
  };
  var alnumhyphen = function(value) {
    // return format(value, /^([0-9a-zA-Z\-]+)$/);
    return value.replace(/([^0-9a-zA-Z\-])/, '');
  };
  var VueFormatter = {
    alpha: alpha,
    alnum: alnum,
    alint: alint,
    // halfwidthkana: halfwidthkana,
    // hiragana: hiragana,
    // katakana: katakana,
    // fullwithkana: fullwithkana,
    alnumsymbol: alnumsymbol,
    alnumhyphenasterisk: alnumhyphenasterisk,
    alnumhyphen: alnumhyphen,
  };
  Vue.prototype.$formatter = VueFormatter;
  return VueFormatter;
});
