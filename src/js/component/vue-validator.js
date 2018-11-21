(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['VueUtil'], definition);
  } else {
    context.VueValidator = definition(context.VueUtil);
  }
})(this, function(VueUtil) {
  'use strict';
  var newMessages = function() {
    return {
      default: 'Validation Error'
    };
  };
  var isEmptyValue = function(value, type) {
    if (!VueUtil.isDef(value)) {
      return true;
    }
    if (type === 'array' && VueUtil.isArray(value) && !value.length) {
      return true;
    }
    var isNativeStringType = function(type) {
      return type === 'string' || type === 'url' || type === 'hex' || type === 'email' || type === 'pattern' || type === 'ipv4';
    };
    if (isNativeStringType(type) && VueUtil.isString(value) && !value) {
      return true;
    }
    return false;
  };
  var rulesEnumerable = function(rule, value, source, errors, options) {
    var ENUM = 'enum';
    rule[ENUM] = VueUtil.isArray(rule[ENUM]) ? rule[ENUM] : [];
    if (rule[ENUM].indexOf(value) === -1) {
      errors.push(options.messages.default);
    }
  };
  var rulesPattern = function(rule, value, source, errors, options) {
    if (rule.pattern) {
      if (rule.pattern instanceof RegExp) {
        if (!rule.pattern.test(value)) {
          errors.push(options.messages.default);
        }
      } else if (VueUtil.isString(rule.pattern)) {
        var _pattern = new RegExp(rule.pattern);
        if (!_pattern.test(value)) {
          errors.push(options.messages.default);
        }
      }
    }
  };
  var rulesRange = function(rule, value, source, errors, options) {
    var len = VueUtil.isNumber(rule.len);
    var min = VueUtil.isNumber(rule.min);
    var max = VueUtil.isNumber(rule.max);
    var val = value;
    var key = null;
    var num = VueUtil.isNumber(value);
    var str = VueUtil.isString(value);
    var arr = VueUtil.isArray(value);
    if (num) {
      key = 'number';
    } else if (str) {
      key = 'string';
    } else if (arr) {
      key = 'array';
    }
    if (!key) {
      return false;
    }
    if (str || arr) {
      val = value.length;
    }
    if (len) {
      if (val !== rule.len) {
        errors.push(options.messages.default);
      }
    } else if (min && !max && val < rule.min) {
      errors.push(options.messages.default);
    } else if (max && !min && val > rule.max) {
      errors.push(options.messages.default);
    } else if (min && max && (val < rule.min || val > rule.max)) {
      errors.push(options.messages.default);
    }
  };
  var rulesRequired = function(rule, value, source, errors, options, type) {
    if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type || rule.type))) {
      errors.push(options.messages.default);
    }
  };
  var rulesType = function(rule, value, source, errors, options) {
    var pattern = {
      email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      url: new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i'),
      hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i,
      ipv4: new RegExp('\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b'),
    };
    var types = {
      integer: function(value) {
        return types.number(value) && parseInt(value, 10) === value;
      },
      float: function(value) {
        return types.number(value) && !types.integer(value);
      },
      array: function(value) {
        return VueUtil.isArray(value);
      },
      regexp: function(value) {
        if (value instanceof RegExp) {
          return true;
        }
        try {
          return !!new RegExp(value);
        } catch (e) {
          throw e;
        }
      },
      date: function(value) {
        return VueUtil.isFunction(value.getTime) && VueUtil.isFunction(value.getMonth) && VueUtil.isFunction(value.getYear);
      },
      number: function(value) {
        return VueUtil.isNumber(value);
      },
      object: function(value) {
        return VueUtil.isObject(value);
      },
      method: function(value) {
        return VueUtil.isFunction(value);
      },
      email: function(value) {
        return VueUtil.isString(value) && !!value.match(pattern.email) && value.length < 255;
      },
      url: function(value) {
        return VueUtil.isString(value) && !!value.match(pattern.url);
      },
      hex: function(value) {
        return VueUtil.isString(value) && !!value.match(pattern.hex);
      },
      ipv4: function(value) {
        return VueUtil.isString(value) && !!value.match(pattern.ipv4);
      }
    };
    if (rule.required && !VueUtil.isDef(value)) {
      rulesRequired(rule, value, source, errors, options);
      return;
    }
    var custom = ['integer', 'float', 'array', 'regexp', 'object', 'method', 'email', 'number', 'date', 'url', 'hex', 'ipv4'];
    var ruleType = rule.type;
    if (custom.indexOf(ruleType) !== -1) {
      if (!types[ruleType](value)) {
        errors.push(options.messages.default);
      }
    } else if (ruleType && typeof (value) !== ruleType) {
      errors.push(options.messages.default);
    }
  };
  var rulesWhitespace = function(rule, value, source, errors, options) {
    if (/^\s+$/.test(value) || value === '') {
      errors.push(options.messages.default);
    }
  };
  var rules = {
    enum: rulesEnumerable,
    pattern: rulesPattern,
    range: rulesRange,
    required: rulesRequired,
    type: rulesType,
    whitespace: rulesWhitespace
  };
  var validtorDate = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value)) {
        rules.type(rule, value, source, errors, options);
        if (value) {
          rules.range(rule, value.getTime(), source, errors, options);
        }
      }
    }
    callback(errors);
  };
  var validtorBoolean = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (VueUtil.isDef(value)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorArray = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value, 'array') && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, 'array');
      if (!isEmptyValue(value, 'array')) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorType = function(rule, value, callback, source, options) {
    var ruleType = rule.type;
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value, ruleType) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, ruleType);
      if (!isEmptyValue(value, ruleType)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorString = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value, 'string') && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, 'string');
      if (!isEmptyValue(value, 'string')) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
        rules.pattern(rule, value, source, errors, options);
        if (rule.whitespace === true) {
          rules.whitespace(rule, value, source, errors, options);
        }
      }
    }
    callback(errors);
  };
  var validtorRequired = function(rule, value, callback, source, options) {
    var errors = [];
    var type = VueUtil.isArray(value) ? 'array' : typeof value;
    rules.required(rule, value, source, errors, options, type);
    callback(errors);
  };
  var validtorRegexp = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorPattern = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value, 'string') && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value, 'string')) {
        rules.pattern(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorObject = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (VueUtil.isDef(value)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorNumber = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (VueUtil.isDef(value)) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorMethod = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (VueUtil.isDef(value)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validtorEnumerable = function(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value) {
        rules['enum'](rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var validators = {
    string: validtorString,
    method: validtorMethod,
    number: validtorNumber,
    boolean: validtorBoolean,
    regexp: validtorRegexp,
    integer: validtorNumber,
    float: validtorNumber,
    array: validtorArray,
    object: validtorObject,
    enum: validtorEnumerable,
    pattern: validtorPattern,
    email: validtorType,
    url: validtorType,
    date: validtorDate,
    hex: validtorType,
    ipv4: validtorType,
    required: validtorRequired
  };
  var Schema = function(descriptor) {
    this.rules = null;
    this._messages = newMessages();
    this.define(descriptor);
  };
  Schema.prototype = {
    messages: function(messages) {
      return VueUtil.merge(this._messages, messages);
    },
    define: function(rules) {
      if (!rules) {
        throw 'No rules';
      }
      if (!VueUtil.isObject(rules)) {
        throw 'Rules must be an object';
      }
      var self = this;
      self.rules = {};
      VueUtil.ownPropertyLoop(rules, function(z) {
        var item = rules[z];
        self.rules[z] = VueUtil.isArray(item) ? item : [item];
      });
    },
    validate: function(source_, o, oc) {
      var source = source_;
      var options = o || {};
      var callback = oc;
      if (VueUtil.isFunction(options)) {
        callback = options;
        options = {};
      }
      if (!this.rules || Object.keys(this.rules).length === 0) {
        if (callback) {
          callback();
        }
        return;
      }
      function complete(results) {
        var i;
        var field;
        var errors = [];
        var fields = {};
        function add(e) {
          if (VueUtil.isArray(e)) {
            errors = errors.concat.apply(errors, e);
          } else {
            errors.push(e);
          }
        }
        i = results.length;
        while (i--) {
          add(results[i]);
        }
        if (!errors.length) {
          errors = null;
          fields = null;
        } else {
          i = errors.length;
          while (i--) {
            field = errors[i].field;
            fields[field] = fields[field] || [];
            fields[field].push(errors[i]);
          }
        }
        callback(errors, fields);
      }
      options.messages = VueUtil.merge(this.messages(), options.messages);
      var self = this;
      var arr;
      var value;
      var series = {};
      var keys = options.keys || Object.keys(self.rules);
      VueUtil.loop(keys, function(z) {
        arr = self.rules[z];
        value = source[z];
        VueUtil.loop(arr, function(r) {
          var rule = r;
          if (VueUtil.isFunction(rule.transform)) {
            if (source === source_) {
              source = VueUtil.merge({}, source);
            }
            value = source[z] = rule.transform(value);
          }
          if (VueUtil.isFunction(rule)) {
            rule = {
              validator: rule,
            };
          } else {
            rule = VueUtil.merge({}, rule);
          }
          rule.validator = self.getValidationMethod(rule);
          rule.field = z;
          rule.fullField = rule.fullField || z;
          rule.type = self.getType(rule);
          if (!rule.validator) {
            return;
          }
          series[z] = series[z] || [];
          series[z].push({
            rule: rule,
            value: value,
            source: source,
            field: z,
          });
        });
      });
      var errorFields = {};
      var asyncMap = function(objArr, option, func, callback) {
        var flattenObjArr = function(objArr) {
          var ret = [];
          VueUtil.ownPropertyLoop(objArr, function(k) {
            ret.push.apply(ret, objArr[k]);
          });
          return ret;
        };
        var asyncSerialArray = function(arr, func, callback) {
          var index = 0;
          var arrLength = arr.length;
          function next(errors) {
            if (errors && errors.length) {
              callback(errors);
              return;
            }
            var original = index;
            index = index + 1;
            if (original < arrLength) {
              func(arr[original], next);
            } else {
              callback([]);
            }
          }
          next([]);
        };
        if (option.first) {
          var flattenArr = flattenObjArr(objArr);
          return asyncSerialArray(flattenArr, func, callback);
        }
        var firstFields = option.firstFields || [];
        if (firstFields === true) {
          firstFields = Object.keys(objArr);
        }
        var objArrKeys = Object.keys(objArr);
        var objArrLength = objArrKeys.length;
        var total = 0;
        var results = [];
        var next = function(errors) {
          results.push.apply(results, errors);
          total++;
          if (total === objArrLength) {
            callback(results);
          }
        };
        VueUtil.loop(objArrKeys, function(key) {
          var arr = objArr[key];
          if (firstFields.indexOf(key) !== -1) {
            asyncSerialArray(arr, func, next);
          } else {
            var asyncParallelArray = function(arr, func, callback) {
              var results = [];
              var total = 0;
              var arrLength = arr.length;
              function count(errors) {
                results.push.apply(results, errors);
                total++;
                if (total === arrLength) {
                  callback(results);
                }
              }
              VueUtil.loop(arr, function(a) {
                func(a, count);
              });
            };
            asyncParallelArray(arr, func, next);
          }
        });
      };
      asyncMap(series, options, function(data, doIt) {
        var rule = data.rule;
        var deep = (VueUtil.isObject(rule.type) || VueUtil.isArray(rule.type)) && (VueUtil.isObject(rule.fields) || VueUtil.isObject(rule.defaultField));
        deep = deep && (rule.required || (!rule.required && data.value));
        rule.field = data.field;
        function addFullfield(key, schema) {
          return VueUtil.merge({}, schema, {
            fullField: rule.fullField + '.' + key
          });
        }
        function cb() {
          var errors = arguments.length > 0 && VueUtil.isDef(arguments[0]) ? arguments[0] : [];
          var complementError = function(rule) {
            return function(oe) {
              if (oe && oe.message) {
                oe.field = oe.field || rule.fullField;
                return oe;
              }
              return {
                message: oe,
                field: oe.field || rule.fullField,
              };
            };
          };
          if (!VueUtil.isArray(errors)) {
            errors = [errors];
          }
          if (errors.length && rule.message) {
            errors = VueUtil.mergeArray([], rule.message);
          }
          errors = VueUtil.map(errors, complementError(rule));
          if (options.first && errors.length) {
            errorFields[rule.field] = 1;
            return doIt(errors);
          }
          if (!deep) {
            doIt(errors);
          } else {
            if (rule.required && !data.value) {
              if (rule.message) {
                errors = VueUtil.map(VueUtil.mergeArray([], rule.message), complementError(rule));
              } else if (options.error) {
                errors = [options.error(rule, options.messages.default)];
              } else {
                errors = [];
              }
              return doIt(errors);
            }
            var fieldsSchema = {};
            if (rule.defaultField) {
              VueUtil.ownPropertyLoop(data.value, function(k) {
                fieldsSchema[k] = rule.defaultField;
              });
            }
            fieldsSchema = VueUtil.merge({}, fieldsSchema, data.rule.fields);
            VueUtil.ownPropertyLoop(fieldsSchema, function(f) {
              var fieldSchema = VueUtil.isArray(fieldsSchema[f]) ? fieldsSchema[f] : [fieldsSchema[f]];
              fieldsSchema[f] = VueUtil.map(fieldSchema, addFullfield.bind(null, f));
            });
            var schema = new Schema(fieldsSchema);
            schema.messages(options.messages);
            if (data.rule.options) {
              data.rule.options.messages = options.messages;
              data.rule.options.error = options.error;
            }
            schema.validate(data.value, data.rule.options || options, function(errs) {
              doIt(errs && errs.length ? VueUtil.mergeArray(errors, errs) : errs);
            });
          }
        }
        var res = rule.validator(rule, data.value, cb, data.source, options);
        if (res && res.then) {
          res.then(function() {cb();}, function(e) {cb(e);});
        }
      }, function(results) {
        complete(results);
      });
    },
    getType: function(rule) {
      if (!VueUtil.isDef(rule.type) && (rule.pattern instanceof RegExp)) {
        rule.type = 'pattern';
      }
      if (!VueUtil.isFunction(rule.validator) && (rule.type && !validators.hasOwnProperty(rule.type))) {
        throw 'Unknown rule type ' + rule.type;
      }
      return rule.type || 'string';
    },
    getValidationMethod: function(rule) {
      if (VueUtil.isFunction(rule.validator)) {
        return rule.validator;
      }
      var keys = Object.keys(rule);
      var messageIndex = keys.indexOf('message');
      if (messageIndex !== -1) {
        keys.splice(messageIndex, 1);
      }
      if (keys.length === 1 && keys[0] === 'required') {
        return validators.required;
      }
      return validators[this.getType(rule)] || false;
    },
  };
  Schema.register = function register(type, validator) {
    if (!VueUtil.isFunction(validator)) {
      throw 'Cannot register a validator by type, validator is not a function';
    }
    validators[type] = validator;
  };
  Schema.messages = newMessages();
  return Schema;
});
