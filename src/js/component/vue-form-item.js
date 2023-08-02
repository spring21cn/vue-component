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
    template: '<div :class="[\'vue-form-item\', sizeClass ? \'vue-form-item--\' + sizeClass : \'\', {\'is-notify\': form.notifyMessage || form.customMessageMethod,\'is-error\': validateState === \'error\',\'is-validating\': validateState === \'validating\',\'is-required\': isRequired || required}]"><label :for="prop" :class="[\'vue-form-item__label\', {\'is-responsive\': resetIsResponsive()}]" :style="labelStyle" v-if="label" ref="label">{{label + form.labelSuffix}}</label><div class="vue-form-item__content" :style="contentStyle" ref="content"><slot></slot><div class="vue-form-item__error" v-if="validateState === \'error\' && showMessage && form.showMessage && !form.notifyMessage && !form.customMessageMethod">{{validateMessage}}</div></div></div>',
    name: 'VueFormItem',
    mixins: [VueUtil.component.emitter],
    props: {
      value: {},
      valuePassed: Boolean,
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
      },
      size: String,
      onRulesChanged: [String, Function],
    },
    provide: function() {
      return {
        vueFormItem: this
      };
    },
    inject: ['vueForm'],
    watch: {
      error: function(value) {
        this.validateMessage = value;
        this.validateState = 'error';
      },
      validateStatus: function(value) {
        this.validateState = value;
      },
      rulesUniqueKey: function() {
        var self = this;
        var globalConfig = (this.$VIY || {});
        var action = this.onRulesChanged || globalConfig.onRulesChanged;
        setTimeout(function() {
          if (action === 'validate') {
            self.validate();
          } else if (action === 'resetError') {
            self.resetError();
          } else if (VueUtil.isFunction(action)) {
            action(self);
          }
        }, 0);
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
          if(this.valuePassed) return this.value;
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
      },
      isRequired: function() {
        var self = this;
        var res = false;
        var rules = self.mergedRules;
        VueUtil.loop(rules, function(rule) {
          if (rule.required) {
            res = true;
            return false;
          }
        });
        return res;
      },
      initialValue: function() {
        var model = this.form.initModel;
        var path = this.prop;
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }
        var prop = this.getPropByPath(model, path);

        return prop.o[prop.k];
      },
      vueFormItemSize: function() {
        return this.size || this.vueForm.size;
      },
      sizeClass: function() {
        return this.vueFormItemSize || (this.$VIY || {}).size;
      },
      mergedRules: function() {
        var formRules = this.form.rules;
        var selfRuels = this.rules;
        formRules = formRules ? formRules[this.prop] : [];
        var mergedRules = VueUtil.mergeArray([], (selfRuels || formRules || []));

        return VueUtil.filter(mergedRules, function(rule) {
          return rule.enabled == null || (VueUtil.isBoolean(rule.enabled) ? rule.enabled : rule.enabled());
        });
      },
      rulesUniqueKey: function() {
        return this.mergedRules.length + this.mergedRules.join(',');
      }
    },
    data: function() {
      return {
        validateState: '',
        validateMessage: '',
        validateDisabled: false,
        validator: {},
        isMobile: VueUtil.getSystemInfo().device == 'Mobile' && VueUtil.getSystemInfo().isLoadMobileJs ? true : false,
        screenWidth:window.screen.width,
        initPassedValue: undefined
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
        if(this.form.labelPosition !== 'top' && this.isMobile && this.$refs.label){
            var oldLabelWidth = labelStyleWidth ? Number.parseFloat(labelStyleWidth.split('px')[0]) : undefined;
            if(oldLabelWidth)
              this.$refs.label.style.width = '';
            var textWidth = this.$refs.label.offsetWidth;
            var widthScale = textWidth / this.screenWidth;
            if(!oldLabelWidth && widthScale <=0.3)
              labelStyleWidth = '30%';
            if((!oldLabelWidth && widthScale > 0.3) || (oldLabelWidth && textWidth > oldLabelWidth)){
              this.$refs.label.style.padding = '10px 10px 0 10px';
              this.$refs.content.style.marginLeft = '';
              return;
            }
        }
        this.$refs.label && (this.$refs.label.style.width = labelStyleWidth);
        this.$refs.content && (this.$refs.content.style.marginLeft = labelStyleWidth);
      },
      resetIsResponsive:function(){
        var isResponsiveCss = this.form.labelResponsive;
        if(this.isMobile){
          isResponsiveCss = false;
        }
        return isResponsiveCss;
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
          self.validateState = '';
          self.validateMessage = '';
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
          callback(self.validateMessage, self.prop);
        });
      },
      resetField: function() {
        this.validateState = '';
        this.validateMessage = '';
        var model = this.form.model;
        var value = this.fieldValue;
        var path = this.prop;

        if (!path) {
          return;
        }

        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }

        var prop;
        try {
          prop = this.getPropByPath(model, path);
        } catch (error) {
          return;
        }
        this.validateDisabled = true;
        var self = this;
        setTimeout(function() {
          self.validateDisabled = false;
        }, 100);
        if (Array.isArray(value) && this.initialValue) {
          prop.o[prop.k] = [].concat(this.initialValue);
        } else {
          prop.o[prop.k] = this.initialValue;
        }

        this.broadcast('VueTimeSelect', 'fieldReset', this.initialValue);
      },
      resetError: function() {
        this.validateState = '';
        this.validateMessage = '';
      },
      isModify: function() {
        if (this.valuePassed) {
          return this.initPassedValue !== this.value;
        }

        var model = this.form.model;
        var path = this.prop;
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }
        var prop = this.getPropByPath(model, path);
        return (prop.o[prop.k] !== this.initialValue);
      },
      getFilteredRule: function(trigger) {
        var rules = this.mergedRules;
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
      if (this.valuePassed) {
        this.initPassedValue = VueUtil.cloneDeep(this.value);
      }
      if (self.prop || self.valuePassed) {
        self.dispatch('VueForm', 'vue.form.addField', [self]);
        self.$on('vue.form.blur', self.onFieldBlur);
        self.$on('vue.form.change', self.onFieldChange);
      }
    },
    beforeDestroy: function() {
      if (this.prop || this.valuePassed) {
        this.dispatch('VueForm', 'vue.form.removeField', [this]);
      }
      VueUtil.removeResizeListener(this.form.$el, this.resetLabelWidth);
    }
  };
  Vue.component(VueFormItem.name, VueFormItem);
});
