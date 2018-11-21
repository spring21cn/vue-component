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
      customMessageMethod: Function
    },
    watch: {
      rules: function() {
        this.validate();
      }
    },
    data: function() {
      return {
        fields: []
      };
    },
    created: function() {
      this.$on('vue.form.addField', function(field) {
        if (field) {
          this.fields.push(field);
        }
      });
      this.$on('vue.form.removeField', function(field) {
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1);
        }
      });
    },
    methods: {
      initValue: function() {
        VueUtil.loop(this.fields, function(field) {
          field.initValue();
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
          VueUtil.loop(self.fields, function(field, index) {
            field.validate('', function(errors) {
              if (errors) {
                valid = false;
                errorMsgs.push(errors);
              }
              if (VueUtil.isFunction(callback) && ++count === self.fields.length) {
                callback(valid);
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
    }
  };
  Vue.component(VueForm.name, VueForm);
});
