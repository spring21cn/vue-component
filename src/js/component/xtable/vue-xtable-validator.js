(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    context.VueXtableValidatorMixin = definition(context.tools);
  }
})(this, function(tools) {
  var _defineProperty = tools.UtilTools.defineProperty;
  var _createClass = tools.UtilTools.createClass;
  var _classCallCheck = tools.UtilTools.classCallCheck;

  var Rule =
  /*#__PURE__*/
  function () {
    function Rule(rule) {
      _classCallCheck(this, Rule);

      VueUtil.assign(this, {
        $options: rule,
        required: rule.required,
        min: rule.min,
        max: rule.min,
        type: rule.type,
        pattern: rule.pattern,
        validator: rule.validator,
        trigger: rule.trigger,
        maxWidth: rule.maxWidth
      });
    }

    _createClass(Rule, [{
      key: 'message',
      get: function get() {
        return tools.UtilTools.getFuncText(this.$options.message);
      }
    }]);

    return Rule;
  }();

  var VueXtableValidatorMixin = {
    methods: {
      /**
      * 与 validate 一致行为，区别就是会校验所有并返回所有不通过的所有列
      */
      _fullValidate: function _fullValidate(rows, cb) {
        return this.beginValidate(rows, cb, true);
      },

      /**
      * 对表格数据进行校验
      */
      _validate: function _validate(rows, cb) {
        return this.beginValidate(rows, cb);
      },

      /**
      * 聚焦到校验通过的单元格并弹出校验错误提示
      */
      handleValidError: function handleValidError(params) {
        var _this = this;

        this.handleActived(params, {
          type: 'valid-error',
          trigger: 'call'
        }).then(function () {
          return _this.showValidTooltip(params);
        });
      },

      /**
      * 对表格数据进行校验
      * 如果传 row 指定行记录，则只验证传入的行
      * 如果传 rows 为多行记录，则只验证传入的行
      * 如果只传 callback 否则默认验证整个表格数据
      * 返回 Promise 对象，或者使用回调方式
      */
      beginValidate: function beginValidate(rows, cb, isAll) {
        var _this2 = this;

        var validRest = {};
        var status = true;
        var editRules = this.editRules,
            afterFullData = this.afterFullData,
            treeConfig = this.treeConfig;
        var vaildDatas = afterFullData;

        if (rows) {
          if (VueUtil.isFunction(rows)) {
            cb = rows;
          } else {
            vaildDatas = VueUtil.isArray(rows) ? rows : [rows];
          }
        }

        var rowValids = [];
        this.lastCallTime = Date.now();
        this.clearValidate();

        if (editRules) {
          var columns = this.getColumns();

          var handleVaild = function handleVaild(row) {
            var colVailds = [];
            columns.forEach(function (column, columnIndex) {
               function validOne(property){
                  if (VueUtil.hasIn(editRules, property)) {
                    colVailds.push(new Promise(function (resolve, reject) {
                      _this2.validCellRules('all', row, column).then(resolve).catch(function (_ref) {
                        var _rest;

                        var rule = _ref.rule,
                            rules = _ref.rules,
                            errorPropertys = _ref.propertys;
                        rule=rules[errorPropertys.indexOf(property)];
                        if(!rule){
                           return resolve();
                        }
                        var rest = (_rest = {
                          rule: rule,
                          rules: rules
                        }, _defineProperty(_rest, ''.concat(treeConfig ? '$' : '', 'rowIndex'), _this2.getRowIndex(row)), _defineProperty(_rest, 'row', row), _defineProperty(_rest, 'columnIndex', columnIndex), _defineProperty(_rest, '$columnIndex', _this2.tableColumn.indexOf(column)), _defineProperty(_rest, 'column', column), _defineProperty(_rest, '$table', _this2), _rest);

                        if (isAll) {
                          if (!validRest[property]) {
                            validRest[property] = [];
                          }

                          validRest[property].push(rest);
                          return resolve();
                        }

                        return reject(rest);
                      });
                    }));
                  }
              }
              if(VueUtil.isArray(column.property)){
                column.property.forEach(function(property){
                    validOne(property);
                });
              }else{
                validOne(column.property);
              }
            });
            rowValids.push(Promise.all(colVailds));
          };

          if (treeConfig) {
            VueUtil.eachTree(vaildDatas, handleVaild, treeConfig);
          } else {
            vaildDatas.forEach(handleVaild);
          }

          return Promise.all(rowValids).then(function () {
            var ruleProps = VueUtil.keys(validRest);

            if (ruleProps.length) {
              return Promise.reject(validRest[ruleProps[0]][0]);
            }

            if (cb) {
              cb(status);
            }
          }).catch(function (params) {
            var args = isAll ? validRest : _defineProperty({}, params.column.property, params);
            return new Promise(function (resolve, reject) {
              var finish = function finish() {
                params.cell = tools.DomTools.getCell(_this2, params);

                _this2.handleValidError(params);

                if (cb) {
                  status = false;
                  resolve(cb(status, args));
                } else {
                  reject(args);
                }
              };
              /**
               * 当校验不通过时
               * 将表格滚动到可视区
               * 由于提示信息至少需要占一行，定位向上偏移一行
               */


              var row = params.row;
              var rowIndex = afterFullData.indexOf(row);
              var locatRow = rowIndex > 0 ? afterFullData[rowIndex - 1] : row;

              tools.DomTools.toView(_this2.$el);

              if (treeConfig) {
                _this2.scrollToTreeRow(locatRow).then(finish);
              } else {
                _this2.scrollToRow(locatRow).then(finish);
              }
            });
          });
        } else {
          if (cb) {
            cb(status);
          }
        }

        return Promise.resolve(true);
      },
      hasCellRules: function hasCellRules(type, row, column) {
        var editRules = this.editRules;
        var property = column.property;
        function hasRulesByOne(itemProperty){
           if (itemProperty && editRules) {
             var rules = VueUtil.get(editRules, itemProperty);
             return rules && VueUtil.find(rules, function (rule) {
               return type === 'all' || !rule.trigger || type === rule.trigger;
             });
           }
           return false;
       }
		if(VueUtil.isArray(property)){
			return property.some(function(item){
				return hasRulesByOne(item);
			});
		}else{
			return hasRulesByOne(property);
		}
      },
      hasValidResultCell: function (validResult, row, column) {
        var result;
        var rowResult = validResult[tools.UtilTools.getRowid(this,row)];
        if (rowResult) {
          result = rowResult[column.property];
        }
        return result;
      },

      /**
      * 校验数据
      * 按表格行、列顺序依次校验（同步或异步）
      * 校验规则根据索引顺序依次校验，如果是异步则会等待校验完成才会继续校验下一列
      * 如果校验失败则，触发回调或者Promise，结果返回一个 Boolean 值
      * 如果是传回调方式这返回一个 Boolean 值和校验不通过列的错误消息
      *
      * rule 配置：
      *  required=Boolean 是否必填
      *  min=Number 最小长度
      *  max=Number 最大长度
      *  validator=Function(rule, value, callback, {rules, row, column, rowIndex, columnIndex}) 自定义校验
      *  trigger=blur|change 触发方式（除非特殊场景，否则默认为空就行）
      */
      validCellRules: function validCellRules(type, row, column, val) {
        var _this3 = this;

        var editRules = this.editRules,
            treeConfig = this.treeConfig;
        var property = column.property;
        var errorRules = [];
        var errorPropertys = [];
        var cellVailds = [];

        if (property && editRules) {
//if prop is Array
		  function validOne(propertyItem){
              var rules = VueUtil.get(editRules, propertyItem);
              var cellValue = VueUtil.isUndefined(val) ? VueUtil.get(row, propertyItem) : val;

              if (rules) {
                 rules.forEach(function (rule) {
                 cellVailds.push(new Promise(function (resolve) {
                     var isRequired = rule.required === true;

                     if (type === 'all' || !rule.trigger || type === rule.trigger) {
                          if (VueUtil.isFunction(rule.validator)) {
                          var _rule$validator;

                        rule.validator(rule, cellValue, function (e) {
                          if (Object.prototype.toString.call(e) === '[object Error]') {
                            var cusRule = {
                              type: 'custom',
                              trigger: rule.trigger,
                              message: e.message,
                              rule: new Rule(rule)
                            };
                            errorRules.push(new Rule(cusRule));
                            errorPropertys.push(propertyItem);
                          }

                          return resolve();
                        }, (_rule$validator = {
                          rules: rules,
                          row: row,
                          column: column
                        }, _defineProperty(_rule$validator, ''.concat(treeConfig ? '$' : '', 'rowIndex'), _this3.getRowIndex(row)), _defineProperty(_rule$validator, 'columnIndex', _this3.getColumnIndex(column)), _rule$validator));
                      } else {
                        var len;
                        var restVal = cellValue;
                        var isNumber = rule.type === 'number';
                        var isEmpty = cellValue === null || cellValue === undefined || cellValue === '';
                        if (isNumber) {
                          restVal = (parseFloat(cellValue) || 0);
                        } else {
                          len = restVal ? VueUtil.keys(restVal).length : 0;
                        }
                        if (isRequired && isEmpty) {
                          errorRules.push(new Rule(rule));
                          errorPropertys.push(propertyItem);
                        } else if (isNumber && isNaN(cellValue) || VueUtil.isRegExp(rule.pattern) && !rule.pattern.test(cellValue) || VueUtil.isNumber(rule.min) && (isNumber ? restVal < rule.min : len < rule.min) || VueUtil.isNumber(rule.max) && (isNumber ? restVal > rule.max : len > rule.max)) {
                          errorRules.push(new Rule(rule));
                          errorPropertys.push(propertyItem);
                        }
                        resolve();
                      }
                    } else {
                      resolve();
                    }
                  }));
                });
			  }
			}
            if(VueUtil.isArray(property)){
                property.forEach(function(propertyItem){
                    validOne(propertyItem);
                 });
            }else{
                validOne(property);
            }
        }

        return Promise.all(cellVailds).then(function () {
          if (errorRules.length) {
            var rest = {
              rules: errorRules,
              rule: errorRules[0],
              propertys: errorPropertys
            };
            return Promise.reject(rest);
          }
        });
      },
      _clearValidate: function _clearValidate() {
        var validTip = this.$refs.validTip;
        VueUtil.assign(this.validStore, {
          visible: false,
          row: null,
          column: null,
          content: '',
          rule: null
        });

        if (validTip && validTip.visible) {
          validTip.close();
        }

        return this.$nextTick();
      },

      /**
      * 触发校验
      */
      triggerValidate: function triggerValidate(type) {
        var _this4 = this;
        var editConfig = this.editConfig,
            editStore = this.editStore,
            editRules = this.editRules,
            validStore = this.validStore,
            validResultCell = this.validResultsCell;
        var actived = editStore.actived;

        if (actived.row && editRules) {
          var _actived$args = actived.args,
              row = _actived$args.row,
              column = _actived$args.column,
              cell = _actived$args.cell;

          if (this.hasCellRules(type, row, column)) {
            return this.validCellRules(type, row, column).then(function () {
              if (editConfig.mode === 'row') {
                if (validStore.visible && validStore.row === row && validStore.column === column) {
                  _this4.clearValidate();
                }
              }
              return _this4.doValidateResult(validResultCell, row, column, cell);
            }).catch(function (_ref3) {
              var rule = _ref3.rule;

              // 如果校验不通过与触发方式一致，则聚焦提示错误，否则跳过并不作任何处理
              if (!rule.trigger || type === rule.trigger) {
                var rest = {
                  rule: rule,
                  row: row,
                  column: column,
                  cell: cell
                };

                _this4.showValidTooltip(rest);

                return Promise.reject(rest);
              }

              return Promise.resolve();
            });
          } else if(validResultCell) {
            return this.doValidateResult(validResultCell, row, column, cell);
          }
        }

        return Promise.resolve();
      },

      doValidateResult: function(validResultCell, row, column, cell) {
        var validResult = this.hasValidResultCell(validResultCell, row, column);
        if (validResult) {
          var rest = {
            rule: {message: validResult.map(function(res) {return res.message;})},
            row: row,
            column: column,
            cell: cell
          };

          this.showValidTooltip(rest);

          return Promise.reject(rest);
        }
        return Promise.resolve();
      },

      /**
      * 弹出校验错误提示
      */
      showValidTooltip: function showValidTooltip(params) {
        var _this5 = this;
        var $refs = this.$refs,
            height = this.height,
            tableData = this.tableData,
            validOpts = this.validOpts;
        var rule = params.rule,
            row = params.row,
            column = params.column,
            cell = params.cell;
        var validTip = $refs.validTip;
        var content = rule.message;
        this.$nextTick(function () {
          VueUtil.assign(_this5.validStore, {
            row: row,
            column: column,
            rule: rule,
            content: content,
            visible: true
          });

          if (validTip && (validOpts.message === 'tooltip' || validOpts.message === 'default' && !height && tableData.length < 2)) {
            validTip.toVisible(cell, content);
          }

          tools.UtilTools.emitEvent(_this5, 'valid-error', [params]);
        });
      }
    }
  };

  return VueXtableValidatorMixin;
});