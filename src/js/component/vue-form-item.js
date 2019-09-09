(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil', 'VueValidator'], definition);
  } else {
    context.VueFormItem = definition(context.Vue, context.VueUtil, context.VueValidator);
    delete context.VueFormItem;
    delete context.VueValidator;
  }
})(this, function(Vue, VueUtil, VueValidator) {
  'use strict';
  var VueFormItem = {
    template: '<div :class="[\'vue-form-item\', {\'is-notify\': form.notifyMessage || form.customMessageMethod,\'is-error\': validateState === \'error\',\'is-validating\': validateState === \'validating\',\'is-required\': isRequired || required}]"><label :for="prop" :class="[\'vue-form-item__label\', {\'is-responsive\': form.labelResponsive}]" :style="labelStyle" v-if="label" ref="label">{{label + form.labelSuffix}}</label><div class="vue-form-item__content" :style="contentStyle" ref="content"><slot></slot><div class="vue-form-item__error" v-if="validateState === \'error\' && showMessage && form.showMessage && !form.notifyMessage && !form.customMessageMethod">{{validateMessage}}</div></div></div>',
    name: 'VueFormItem',
    mixins: [VueUtil.component.emitter],
    props: {
      label: String,
      labelWidth: String,
      prop: String,
      required: Boolean,
      rules: [Object, Array],
      error: String,
      validateStatus: String,
      showMessage: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      error: function(value) {
        this.validateMessage = value;
        this.validateState = 'error';
      },
      validateStatus: function(value) {
        this.validateState = value;
      },
      label: {
        immediate: true,
        handler: function(val) {
          var self = this;
          if (VueUtil.isDef(val)) {
            self.$nextTick(function() {
              VueUtil.removeResizeListener(self.form.$el, self.resetLabelWidth);
              VueUtil.addResizeListener(self.form.$el, self.resetLabelWidth);
            });
          } else {
            self.$nextTick(function() {
              VueUtil.removeResizeListener(self.form.$el, self.resetLabelWidth);
            });
          }
        }
      }
    },
    computed: {
      labelStyle: function() {
        var ret = {};
        var labelStyleWidth = this.labelStyleWidth();
        if (labelStyleWidth) {
          ret.width = labelStyleWidth;
        }
        return ret;
      },
      contentStyle: function() {
        var ret = {};
        var labelStyleWidth = this.labelStyleWidth();
        if (labelStyleWidth) {
          ret.marginLeft = labelStyleWidth;
        }
        return ret;
      },
      form: function() {
        var parent = this.$parent;
        while (parent.$options.name !== 'VueForm') {
          parent = parent.$parent;
        }
        return parent;
      },
      fieldValue: {
        cache: false,
        get: function() {
          var model = this.form.model;
          if (!model || !this.prop) {
            return;
          }
          var path = this.prop;
          if (path.indexOf(':') !== -1) {
            path = path.replace(/:/, '.');
          }
          return this.getPropByPath(model, path).v;
        }
      }
    },
    data: function() {
      return {
        validateState: '',
        validateMessage: '',
        validateDisabled: false,
        validator: {},
        isRequired: false,
        initialValue: null
      };
    },
    methods: {
      getPropByPath: function(obj, path) {
        var tempObj = obj;
        path = path.replace(/\[(\w+)\]/g, '.$1');
        path = path.replace(/^\./, '');
        var keyArr = path.split('.');
        for (var i = 0, len = keyArr.length; i < len - 1; ++i) {
          var key = keyArr[i];
          tempObj = tempObj[key];
          if (!VueUtil.isDef(tempObj)) {
            throw 'please transfer a valid prop path to form item!';
          }
        }
        return {
          o: tempObj,
          k: keyArr[i],
          v: tempObj[keyArr[i]]
        };
      },
      labelStyleWidth: function() {
        if (this.form.labelPosition === 'top' || (this.form.labelResponsive && VueUtil.getStyle(this.$refs.label, 'display') === 'inline-block')) return '';
        var labelWidth = this.labelWidth || this.form.labelWidth;
        return labelWidth;
      },
      resetLabelWidth: function() {
        var labelStyleWidth = this.labelStyleWidth();
        this.$refs.label && (this.$refs.label.style.width = labelStyleWidth);
        this.$refs.content && (this.$refs.content.style.marginLeft = labelStyleWidth);
      },
      validate: function(trigger, callback) {
        var self = this;
        var noop = function() {};
        if (VueUtil.isFunction(self.form.customMessageMethod)) {
          noop = self.form.customMessageMethod;
        } else if (self.form.notifyMessage) {
          noop = function(errorMsg) {
            if (errorMsg) {
              self.$notify.error({message: errorMsg});
            }
          };
        }
        callback = callback || noop;
        var rules = self.getFilteredRule(trigger);
        if (!rules || rules.length === 0) {
          callback();
          return true;
        }
        self.validateState = 'validating';
        var descriptor = {};
        descriptor[self.prop] = rules;
        var validator = new VueValidator(descriptor);
        var model = {};
        model[self.prop] = self.fieldValue;
        validator.validate(model, {
          firstFields: true
        }, function(errors, fields) {
          self.validateState = !errors ? 'success' : 'error';
          self.validateMessage = errors ? errors[0].message : '';
          callback(self.validateMessage);
        });
      },
      resetField: function() {
        this.validateState = '';
        this.validateMessage = '';
        var model = this.form.model;
        var value = this.fieldValue;
        var path = this.prop;
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }
        var prop = this.getPropByPath(model, path);
        this.validateDisabled = true;
        if (Array.isArray(value)) {
          prop.o[prop.k] = [].concat(this.initialValue);
        } else {
          prop.o[prop.k] = this.initialValue;
        }

        this.broadcast('VueTimeSelect', 'fieldReset', this.initialValue);
      },
      isModify: function() {
        this.validateState = '';
        this.validateMessage = '';
        var model = this.form.model;
        var value = this.fieldValue;
        var path = this.prop;
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }
        var prop = this.getPropByPath(model, path);
        return (prop.o[prop.k] !== this.initialValue);
      },
      initValue: function() {
        this.initialValue = this.fieldValue;
      },
      getRules: function() {
        var formRules = this.form.rules;
        var selfRuels = this.rules;
        formRules = formRules ? formRules[this.prop] : [];
        return VueUtil.mergeArray([], (selfRuels || formRules || []));
      },
      getFilteredRule: function(trigger) {
        var rules = this.getRules();
        return VueUtil.filter(rules, function(rule) {
          return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
        });
      },
      onFieldBlur: function() {
        this.validate('blur');
      },
      onFieldChange: function() {
        if (this.validateDisabled) {
          this.validateDisabled = false;
          return;
        }
        this.validate('change');
      }
    },
    mounted: function() {
      var self = this;
      if (self.prop) {
        self.dispatch('VueForm', 'vue.form.addField', [self]);
        self.initValue();
        var rules = self.getRules();
        if (rules.length) {
          VueUtil.loop(rules, function(rule) {
            if (rule.required) {
              self.isRequired = true;
              return false;
            }
          });
          self.$on('vue.form.blur', self.onFieldBlur);
          self.$on('vue.form.change', self.onFieldChange);
        }
      }
    },
    beforeDestroy: function() {
      this.dispatch('VueForm', 'vue.form.removeField', [this]);
      VueUtil.removeResizeListener(this.form.$el, this.resetLabelWidth);
    }
  };
  Vue.component(VueFormItem.name, VueFormItem);
});
