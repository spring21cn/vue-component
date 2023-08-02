(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueForm = definition(context.Vue, context.VueUtil);
    delete context.VueForm;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var VueForm = {
    template: '<form :class="[\'vue-form\', labelPosition ? \'vue-form--label-\' + labelPosition : \'\', {\'vue-form--inline\': inline}]"><slot></slot><input style="display:none" /></form>',
    name: 'VueForm',
    provide: function() {
      return {
        vueForm: this
      };
    },
    inject: {
      vueForm: {
        default: ''
      },
    },
    props: {
      model: Object,
      rules: Object,
      labelPosition: String,
      labelWidth: String,
      labelSuffix: {
        type: String,
        default: ''
      },
      inline: Boolean,
      showMessage: {
        type: Boolean,
        default: true
      },
      labelResponsive: {
        type: Boolean,
        default: true
      },
      notifyMessage: Boolean,
      customMessageMethod: Function,
      autoFocusError: [Boolean, String],
      forceDisable: Boolean,
      disabled: Boolean,
      size: String
    },
    watch: {
      rules: function() {
        this.validate();
      }
    },
    data: function() {
      return {
        fields: [],
        initModel: {}
      };
    },
    computed: {
      isDisabled: function() {
        return this.disabled || (this.vueForm || {}).disabled;
      }
    },
    created: function() {
      this.$on('vue.form.addField', function(field) {
        if (field) {
          this.fields.push(field);
        }
      });
      this.$on('vue.form.removeField', function(field) {
        if (field) {
          this.fields.splice(this.fields.indexOf(field), 1);
        }
      });
    },
    methods: {
      initValue: function() {
        this.initModel = VueUtil.cloneDeep(this.model);

        VueUtil.loop(this.fields, function(field) {
          if (field.valuePassed) {
            field.initPassedValue = VueUtil.cloneDeep(field.value);
          }
        });
      },
      isModify: function() {
        var modifyFLg = false;
        VueUtil.loop(this.fields, function(field) {
          if (modifyFLg) return;
          modifyFLg = field.isModify();
        });
        return modifyFLg;
      },
      resetFields: function() {
        VueUtil.loop(this.fields, function(field) {
          field.resetField();
        });
      },
      validate: function(callback) {
        var self = this;
        self.$nextTick(function(){
          var valid = true;
          var count = 0;
          var errorMsgs = [];
          var errorProps = [];
          VueUtil.loop(self.fields, function(field, index) {
            field.validate('', function(errors, prop) {
              if (errors) {
                valid = false;
                errorMsgs.push(errors);
                errorProps.push(prop);
              }
              if (VueUtil.isFunction(callback) && ++count === self.fields.length) {
                callback(valid, {
                  errorProps: errorProps
                });
              }
            });
          });
          if (errorMsgs.length > 0) {
            if (VueUtil.isFunction(self.customMessageMethod)) {
              self.customMessageMethod(errorMsgs);
            } else if (self.notifyMessage) {
              var createElement = self.$createElement;
              self.$notify.error({
                message: createElement('div', null, [self._l(errorMsgs, function(errorMsg, errorIndex) {
                  return [createElement('span', {key: errorIndex}, [errorMsg]), createElement('br', null, [])];
                })]),
                duration: 0
              });
            }
          }

          var auto = this.autoFocusError;
          if (errorProps.length > 0) {
            var firstErrorField = VueUtil.find(self.fields, function(field) {
              return field.prop === errorProps[0];
            });
            var query = typeof auto === 'string' ? auto : 'input:not([disabled]):not([tabindex=\'-1\']),select:not([disabled]):not([tabindex=\'-1\']),textarea:not([disabled]):not([tabindex=\'-1\']),button:not([disabled]):not([tabindex=\'-1\']),[tabindex]:not([tabindex=\'-1\'])';

            if (firstErrorField && firstErrorField.$el) {
              var firstInput = firstErrorField.$el.querySelector(query);
              if (!firstInput) return;

              if (auto) {
                firstInput.focus();
              } else {
                firstInput.scrollIntoView && firstInput.scrollIntoView();
              }
            }
          }
        });
      },
      validateField: function(prop, cb) {
        var field = VueUtil.filter(this.fields, function(field) {
          return (field.prop === prop);
        })[0];
        if (!field) {
          throw 'must call validateField with valid prop string!';
        }
        field.validate('', cb);
      }
    },
    mounted: function() {
      this.initValue();
    }
  };
  Vue.component(VueForm.name, VueForm);
});
