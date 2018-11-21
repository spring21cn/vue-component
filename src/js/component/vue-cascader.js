(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VuePopper', 'VueUtil'], definition);
  } else {
    context.VueCascader = definition(context.Vue, context.VuePopper, context.VueUtil);
    delete context.VueCascader;
  }
})(this, function(Vue, VuePopper, VueUtil) {
  'use strict';
  var VueCascaderMenu = {
    name: 'VueCascaderMenu',
    data: function() {
      return {
        inputWidth: 0,
        options: [],
        props: {},
        visible: false,
        activeValue: [],
        value: [],
        expandTrigger: 'click',
        changeOnSelect: false,
        popperClass: ''
      };
    },
    watch: {
      visible: function(value) {
        if (value) {
          this.activeValue = this.value;
        }
      },
      value: {
        immediate: true,
        handler: function(value) {
          this.activeValue = value;
        }
      }
    },
    computed: {
      activeOptions: {
        cache: false,
        get: function() {
          var self = this;
          var activeValue = self.activeValue;
          var configurableProps = ['label', 'value', 'children', 'disabled'];
          var formatOptions = function(options) {
            VueUtil.loop(options, function(option) {
              if (option.__IS__FLAT__OPTIONS) return;
              VueUtil.loop(configurableProps, function(prop) {
                var value = option[self.props[prop] || prop];
                if (value)
                  option[prop] = value;
              });
              if (VueUtil.isArray(option.children)) {
                formatOptions(option.children);
              }
            });
          };
          var loadActiveOptions = function(options, activeOptions) {
            options = options || [];
            activeOptions = activeOptions || [];
            var level = activeOptions.length;
            activeOptions[level] = options;
            var active = activeValue[level];
            if (active) {
              options = VueUtil.filter(options, function(option) {
                return option.value === active;
              })[0];
              if (options && options.children) {
                loadActiveOptions(options.children, activeOptions);
              }
            }
            return activeOptions;
          };
          formatOptions(self.options);
          return loadActiveOptions(self.options);
        }
      }
    },
    methods: {
      select: function(item, menuIndex) {
        if (item.__IS__FLAT__OPTIONS) {
          this.activeValue = item.value;
        } else if (menuIndex) {
          this.activeValue.splice(menuIndex, this.activeValue.length - 1, item.value);
        } else {
          this.activeValue = [item.value];
        }
        this.$emit('pick', this.activeValue);
      },
      handleMenuLeave: function() {
        this.$emit('menuLeave');
      },
      activeItem: function(item, menuIndex) {
        var len = this.activeOptions.length;
        this.activeValue.splice(menuIndex, len, item.value);
        this.activeOptions.splice(menuIndex + 1, len, item.children);
        if (this.changeOnSelect) {
          this.$emit('pick', this.activeValue, false);
        } else {
          this.$emit('activeItemChange', this.activeValue);
        }
      }
    },
    render: function(createElement) {
      var self = this;
      var activeValue = self.activeValue
        , activeOptions = self.activeOptions
        , visible = self.visible
        , expandTrigger = self.expandTrigger
        , popperClass = self.popperClass;
      var menus = self._l(activeOptions, function(menu, menuIndex) {
        var isFlat = false;
        var items = self._l(menu, function(item, itemIndex) {
          var events = {
            on: {}
          };
          if (item.__IS__FLAT__OPTIONS)
            isFlat = true;
          if (!item.disabled) {
            if (item.children) {
              var triggerEvent = {
                click: 'click',
                hover: 'mouseenter'
              }[expandTrigger];
              events.on[triggerEvent] = function() {
                self.activeItem(item, menuIndex);
              };
            } else {
              events.on.click = function() {
                self.select(item, menuIndex);
              };
            }
          }
          return createElement('li', {
            key: itemIndex,
            class: {
              'vue-cascader-menu__item': !0,
              'vue-cascader-menu__item--extensible': item.children,
              'is-active': item.value === activeValue[menuIndex],
              'is-disabled': item.disabled
            },
            on: events.on
          }, [item.label]);
        });
        var menuStyle = {};
        if (isFlat) {
          menuStyle.minWidth = self.inputWidth + 'px';
        }
        return createElement('ul', {
          key: menuIndex,
          class: {
            'vue-cascader-menu': true,
            'vue-cascader-menu--flexible': isFlat
          },
          style: menuStyle
        }, [items]);
      });
      return createElement('transition', {
        on: {
          'after-leave': self.handleMenuLeave
        }
      }, [createElement('div', {
        directives: [{
          name: 'show',
          value: visible
        }],
        class: ['vue-cascader-menus', popperClass]
      }, [menus])]);
    }
  };
  var popperMixin = {
    props: {
      placement: {
        type: String,
        default: 'bottom-start'
      },
      offset: VuePopper.props.offset,
      popperOptions: VuePopper.props.options
    },
    methods: VuePopper.methods,
    data: VuePopper.data,
    beforeDestroy: VuePopper.beforeDestroy
  };
  var VueCascader = {
    template: '<span :class="[\'vue-cascader\', {\'is-opened\': menuVisible, \'is-disabled\': disabled},size ? \'vue-cascader--\' + size : \'\']" @click="handleClick" @mouseenter="inputHover = true" @mouseleave="inputHover = false" ref="reference" v-clickoutside="handleClickoutside"><vue-input :text-align="textAlign" ref="input" :autofocus="autofocus" :tabindex="tabindex" :readonly="!filterable" :placeholder="currentLabels.length ? \'\' : placeholderLang" v-model="inputValue" @change="debouncedInputChange" :validate-event="false" :size="size" :disabled="disabled"><template slot="icon"><i key="1" v-if="clearable && inputHover && currentLabels.length" class="vue-input__icon vue-icon-error vue-cascader__clearIcon" @click="clearValue"></i><i key="2" v-else :class="[\'vue-input__icon vue-icon-arrow-up\', {\'is-reverse\': menuVisible}]"></i></template></vue-input><span class="vue-cascader__label" v-show="inputValue === \'\'"><template v-if="showAllLevels"><template v-for="(label, index) in currentLabels">{{label}}<span v-if="index < currentLabels.length - 1"> / </span></template></template><template v-else>{{currentLabels[currentLabels.length - 1]}}</template></span></span>',
    name: 'VueCascader',
    directives: {
      Clickoutside: VueUtil.component.clickoutside()
    },
    mixins: [popperMixin, VueUtil.component.emitter],
    props: {
      options: {
        type: Array,
        required: true
      },
      props: {
        type: Object,
        default: function() {
          return {
            children: 'children',
            label: 'label',
            value: 'value',
            disabled: 'disabled'
          };
        }
      },
      value: {
        type: Array,
        default: function() {
          return [];
        }
      },
      placeholder: String,
      disabled: Boolean,
      clearable: Boolean,
      changeOnSelect: Boolean,
      popperClass: String,
      expandTrigger: {
        type: String,
        default: 'click'
      },
      filterable: Boolean,
      size: String,
      autofocus: Boolean,
      textAlign: String,
      tabindex: Number,
      showAllLevels: {
        type: Boolean,
        default: true
      }
    },
    data: function() {
      return {
        currentValue: this.value,
        menu: null,
        menuVisible: false,
        inputHover: false,
        inputValue: '',
        flatOptions: null
      };
    },
    computed: {
      placeholderLang: function() {
        if (!this.placeholder)
          return this.$t('vue.cascader.placeholder');
        return this.placeholder;
      },
      labelKey: function() {
        return this.props.label || 'label';
      },
      valueKey: function() {
        return this.props.value || 'value';
      },
      childrenKey: function() {
        return this.props.children || 'children';
      },
      currentLabels: function() {
        var self = this;
        var options = self.options || [];
        var labels = [];
        VueUtil.loop(self.currentValue, function(value) {
          var targetOption = VueUtil.filter(options, function(option) {
            return option[self.valueKey] === value;
          })[0];
          if (targetOption) {
            labels.push(targetOption[self.labelKey]);
            options = targetOption[self.childrenKey];
          }
        });
        return labels;
      }
    },
    watch: {
      menuVisible: function(value) {
        value ? this.showMenu() : this.hideMenu();
      },
      value: function(value) {
        this.currentValue = value;
      },
      currentValue: function(value) {
        this.dispatch('VueFormItem', 'vue.form.change', [value]);
      },
      options: {
        deep: true,
        handler: function(value) {
          if (!this.menu) {
            this.initMenu();
          }
          this.flatOptions = this.flattenOptions(this.options);
          this.menu.options = value;
        }
      }
    },
    methods: {
      focus: function() {
        this.$refs.input.focus();
      },
      initMenu: function() {
        this.menu = new Vue(VueCascaderMenu).$mount();
        this.menu.options = this.options;
        this.menu.props = this.props;
        this.menu.expandTrigger = this.expandTrigger;
        this.menu.changeOnSelect = this.changeOnSelect;
        this.menu.popperClass = this.popperClass;
        this.popperElm = this.menu.$el;
        this.menu.$on('pick', this.handlePick);
        this.menu.$on('activeItemChange', this.handleActiveItemChange);
        this.menu.$on('menuLeave', this.destroyPopper);
      },
      showMenu: function() {
        var self = this;
        if (!self.menu) {
          self.initMenu();
        }
        self.menu.value = VueUtil.mergeArray([], self.currentValue);
        self.menu.visible = true;
        self.menu.options = self.options;
        self.$nextTick(function() {
          self.updatePopper();
          self.menu.inputWidth = self.$refs.input.$el.offsetWidth - 2;
        });
      },
      hideMenu: function() {
        this.inputValue = '';
        this.menu.visible = false;
      },
      handleActiveItemChange: function(value) {
        var self = this;
        self.$nextTick(function() {
          self.updatePopper();
        });
        self.$emit('active-item-change', value);
      },
      handlePick: function(value, close) {
        if (!VueUtil.isDef(close)) close = true;
        this.currentValue = value;
        this.$emit('input', value);
        this.$emit('change', value);
        if (close) {
          this.menuVisible = false;
        }
        this.$nextTick(this.focus);
      },
      handleInputChange: function(value) {
        var self = this;
        if (!self.menuVisible)
          return;
        var flatOptions = self.flatOptions;
        if (!value) {
          self.menu.options = self.options;
          return;
        }
        var filteredFlatOptions = VueUtil.filter(flatOptions, function(optionsStack) {
          return optionsStack.some(function(option) {
            return new RegExp(value, 'i').test(option[self.labelKey]);
          });
        });
        if (filteredFlatOptions.length > 0) {
          filteredFlatOptions = VueUtil.map(filteredFlatOptions, function(optionStack) {
            return {
              __IS__FLAT__OPTIONS: true,
              value:  VueUtil.map(optionStack, function(item) {
                return item[self.valueKey];
              }),
              label: self.renderFilteredOptionLabel(value, optionStack)
            };
          });
        } else {
          filteredFlatOptions = [{
            __IS__FLAT__OPTIONS: true,
            label: self.$t('vue.cascader.noMatch'),
            value: '',
            disabled: true
          }];
        }
        self.menu.options = filteredFlatOptions;
      },
      renderFilteredOptionLabel: function(inputValue, optionsStack) {
        var self = this;
        return  VueUtil.map(optionsStack, function(option, index) {
          var label = option[self.labelKey];
          var keywordIndex = label.toLowerCase().indexOf(inputValue.toLowerCase());
          var labelPart = label.slice(keywordIndex, inputValue.length + keywordIndex);
          var node = keywordIndex !== -1 ? self.highlightKeyword(label, labelPart) : label;
          return index === 0 ? node : [' / ', node];
        });
      },
      highlightKeyword: function(label, keyword) {
        var self = this;
        var h = self._c;
        return  VueUtil.map(label.split(keyword), function(node, index) {
          return index === 0 ? node : [h('span', {
            class: {
              'vue-cascader-menu__item__keyword': true
            }
          }, [self._v(keyword)]), node];
        });
      },
      flattenOptions: function(options, ancestor) {
        options = options || [];
        ancestor = ancestor || [];
        var self = this;
        var flatOptions = [];
        VueUtil.loop(options, function(option) {
          var optionsStack = VueUtil.mergeArray(ancestor, option);
          if (!option[self.childrenKey]) {
            flatOptions.push(optionsStack);
          } else {
            if (self.changeOnSelect) {
              flatOptions.push(optionsStack);
            }
            VueUtil.mergeArray(flatOptions, self.flattenOptions(option[self.childrenKey], optionsStack));
          }
        });
        return flatOptions;
      },
      clearValue: function(ev) {
        ev.stopPropagation();
        this.handlePick([], true);
      },
      handleClickoutside: function() {
        this.menuVisible = false;
      },
      handleClick: function() {
        if (this.disabled)
          return;
        if (this.filterable) {
          this.menuVisible = true;
          return;
        }
        this.menuVisible = !this.menuVisible;
      },
      debouncedInputChange: VueUtil.debounce(function(value) {
        this.handleInputChange(value);
      })
    },
    mounted: function() {
      this.flatOptions = this.flattenOptions(this.options);
    },
    beforeDestroy: function() {
      if (this.menu) {
        this.menu.$destroy();
      }
    }
  };
  Vue.component(VueCascader.name, VueCascader);
});
