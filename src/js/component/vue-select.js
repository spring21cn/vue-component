(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueSelect = definition(context.Vue, context.VueUtil);
    delete context.VueSelect;
  }
})(this, function(Vue, VueUtil) {
  'use strict';
  var formatedLabelCache = [];
  var getValueByPath = function(object, prop) {
    prop = prop || '';
    var paths = prop.split('.');
    var current = object;
    var result = null;
    VueUtil.loop(paths, function(path, i) {
      if (!current) return false;
      if (i === paths.length - 1) {
        result = current[path];
        return false;
      }
      current = current[path];
    });
    return result;
  };
  var VueSelect = {
    template: 
    '<div :class="[\'vue-select\', {\'filter-vue-select\': isMobile && visible && filterable}]" v-clickoutside="handleClose" v-scrolling="handleClose"> \
      <div :class="[\'vue-select__tags\', {\'no-reset-height\': !autoHeight}]" v-if="multiple" @click.stop="toggleMenu" \
        ref="tags" :style="{\'max-width\': inputWidth - 32 + \'px\'}"> \
        <transition-group @after-leave="resetInputHeight"> \
          <vue-tag v-for="(item, index) in selected" :key="getValueKey(item)" :closable="!disabled" hit :type="disabled ? \'\' : \'info\'" \
            @close="deleteTag($event, item)"><span class="vue-select__tags-text">{{getFormatedLabel(item)}}</span></vue-tag> \
        </transition-group>\
        <input type="text" :class="[\'vue-select__input\', {\'is-mini\': size===\'mini\'}]" @focus="visible == true" \
          :disabled="disabled" @keyup="managePlaceholder" @keydown="resetInputState" @keydown.down.prevent="navigateOptions(\'next\')" \
          @keydown.up.prevent="navigateOptions(\'prev\')" @keydown.enter.prevent="selectOption" @keydown.esc.prevent="visible = false" \
          @keydown.delete="deletePrevTag" v-model="query" v-if="filterable" :readonly="isMobile" :style="{width: multipleInputLength + \'px\', \'max-width\': inputWidth - 42 + \'px\'}" \
          ref="input" />\
      </div> \
      <vue-input ref="reference" v-model="selectedLabel" type="text" :text-align="textAlign" \
        :placeholder="placeholderLang" :autofocus="autofocus" :tabindex="tabindex" :name="name" :size="size" \
        :disabled="disabled" :readonly="isMobile || !filterable || multiple" :validate-event="false" @click="handleIconClick" \
        @mousedown.native="handleMouseDown" @keyup.native="debouncedOnInputChange" @input="keepMenu" @keydown.native.down.prevent="navigateOptions(\'next\')" \
        @keydown.native.up.prevent="navigateOptions(\'prev\')" @keydown.native.enter.prevent="selectOption" \
        @keydown.native.esc.prevent="visible = false" @keydown.native.tab="visible = false" @paste.native="debouncedOnInputChange" \
        @mouseenter.native="inputHovering = true" @mouseleave.native="inputHovering = false" :icon="iconClass"></vue-input> \
      <transition @after-leave="destroyPopper" @after-enter="handleMenuEnter"> \
        <vue-select-dropdown ref="popper" v-show="visible && emptyText !== false"  :append="append" > \
        <div :class="{\'vue-select-dropdown_main\':isMobile}">\
          <div @touchmove.prevent v-if="isMobile && visible && emptyText !== false" class="vue-aside__wrapper" @click="handleClose"></div> \
            <div :class="{\'vue-aside vue-aside-bottom\':isMobile && visible && emptyText !== false}">\
              <div class="tag_view" v-if="isMobile && visible && emptyText !== false && filterable && multiple && selected.length>0" @click.stop="toggleMenu">\
                <transition-group   @after-leave="resetInputHeight" > \
                  <vue-tag v-for="(item, index) in selected" :key="getValueKey(item)" :closable="!disabled" hit :type="disabled ? \'\' : \'info\'" \
                  @close="deleteTag($event, item)"><span class="vue-select__tags-text">{{getFormatedLabel(item)}}</span></vue-tag> \
                </transition-group>\
              </div>\
              <vue-input ref="filterInputRef" v-if="isMobile && visible && emptyText !== false && filterable" v-model="selectedLabel" type="text"\
              :placeholder="placeholderLang" @input="debouncedOnInputChange"\
              :icon="iconClass" @click="handleIconClick"></vue-input>\
              <div :class="{\'vue-select-dropdown_list_main\':isMobile && visible && emptyText !== false}">\
                <ul :class="[\'vue-select-dropdown__list\', {\'is-empty\': !allowCreate && filteredOptionsCount === 0}]" \
                  v-show="options.length > 0 && !loading"> \
                  <vue-option :value="query" created v-if="showNewOption"></vue-option> \
                  <vue-recycle-scroller \
                  ref="scroller" \
                  class="recycle-scroller" \
                  :items="lazyData" \
                  :item-size="itemSize" \
                  :key-field="valueMember" \
                  v-slot="ref" \
                  v-if="lazyload"> \
                    <slot :item="ref.item"></slot> \
                  </vue-recycle-scroller> \
                  <slot v-else></slot> \
                </ul> \
                <p class="vue-select-dropdown__empty" v-if="emptyText && !allowCreate">{{emptyText}}</p> \
              </div>\
          </div>\
          </div>\
        </vue-select-dropdown> \
      </transition> \
    </div>',
    mixins: [VueUtil.component.emitter],
    name: 'VueSelect',
    computed: {
      iconClass: function() {
        var criteria;
        var resultCss;
        if (this.multiple) {
          if (this.visible) {
            criteria = this.clearable && !this.disabled && this.inputHovering;
            resultCss = criteria && !this.multipleLimit && !this.lazyload ? 'vue-icon-success is-show-check' : (this.remote && this.filterable ? '' : 'vue-icon-arrow-up is-reverse');
            if(this.isMobile){
              criteria = this.clearable && !this.disabled;
              resultCss = criteria && !this.multipleLimit && !this.lazyload ? this.filterAllSelectedStatus ? 'vue-icon-success is-show-check is-all-select' : 'vue-icon-success is-show-check' : (this.remote && this.filterable ? '' : 'vue-icon-arrow-up is-reverse');
            }
            return resultCss;
          } else {
            criteria = this.clearable && !this.disabled && this.inputHovering && VueUtil.isDef(this.value) && this.value.length > 0;
            if(this.isMobile)
              criteria = this.clearable && !this.disabled && VueUtil.isDef(this.value) && this.value.length > 0;
            return criteria ? 'vue-icon-error is-show-close' : (this.remote && this.filterable ? '' : 'vue-icon-arrow-up');
          }
        } else {
          criteria = this.clearable && !this.disabled && this.inputHovering && VueUtil.isDef(this.value) && this.value !== '';
          resultCss = criteria ? 'vue-icon-error is-show-close' : (this.remote && this.filterable ? '' : 'vue-icon-arrow-up');
          if(this.isMobile){
            criteria = this.clearable && !this.disabled && VueUtil.isDef(this.value) && this.value !== '' && !this.visible;
            resultCss = criteria ? 'vue-icon-error is-show-close' : (this.remote || this.filterable) && this.visible ? '' : 'vue-icon-arrow-up';
          }
          return resultCss;
        }
      },
      emptyText: function() {
        if (this.loading) {
          return this.loadingText || this.$t('vue.select.loading');
        } else if (this.lazyload) {

          if (this.remote && this.query === '' && this.options.length === 0){
            if(this.isMobile && this.filterable && this.visible && this.selectedLabel.length>=0){
              return null;
            }
            return false;

          }
          if (this.filterable && this.data.length > 0 && this.lazyData.length === 0) {
            return this.noMatchText || this.$t('vue.select.noMatch');
          }
          if (this.data.length === 0) {
            return this.noDataText || this.$t('vue.select.noData');
          }
        } else {
          if (this.remote && this.query === '' && this.options.length === 0){
            if(this.isMobile && this.filterable && this.visible && this.selectedLabel.length>=0){
              return null;
            }
            return false;
          }
          if (this.filterable && this.options.length > 0 && this.filteredOptionsCount === 0) {
            return this.noMatchText || this.$t('vue.select.noMatch');
          }
          if (this.options.length === 0) {
            return this.noDataText || this.$t('vue.select.noData');
          }
        }
        return null;
      },
      showNewOption: function() {
        var self = this;
        var hasExistingOption = VueUtil.filter(self.options, function(option) {
          return !option.created;
        }).some(function(option) {
          return option.currentLabel === self.query;
        });
        return self.filterable && self.allowCreate && self.query !== '' && !hasExistingOption;
      },
      placeholderLang: function() {
        if (this.multiple) {
          if (VueUtil.isArray(this.value) && this.value.length > 0) {
            return '';
          } else if (this.query) {
            return '';
          } else {
            if (!this.currentPlaceholder) {
              return this.$t('vue.select.placeholder');
            }
            return this.currentPlaceholder;
          }
        }
        if (!this.placeholder)
          return this.$t('vue.select.placeholder');
        return this.placeholder;
      }
    },
    directives: {
      Clickoutside: VueUtil.component.clickoutside(),
      Scrolling: VueUtil.component.scrolling
    },
    props: {
      name: String,
      value: {required: true},
      size: String,
      disabled: Boolean,
      clearable: Boolean,
      filterable: Boolean,
      allowCreate: Boolean,
      loading: Boolean,
      popperClass: String,
      remote: Boolean,
      loadingText: String,
      noMatchText: String,
      noDataText: String,
      autofocus: Boolean,
      textAlign: String,
      tabindex: Number,
      remoteMethod: Function,
      filterMethod: Function,
      multiple: Boolean,
      multipleLimit: {
        type: Number,
        default: 0
      },
      placeholder: String,
      autoHeight: {
        type: Boolean,
        default: true
      },
      valueKey: {
        type: String,
        default: 'value'
      },
      lazyload: {
        type: Boolean,
        default: false
      },
      itemSize: {
        type: Number,
        default:36
      },
      displayMember: {
        type: String,
        default: 'label'
      },
      valueMember: {
        type: String,
        default: 'value'
      },
      data: {
        type: Array,
        default: function() {
          return [];
        }
      },
      labelFormatter: Function,
      appendToSelf: Boolean
    },
    data: function() {
      return {
        options: [],
        cachedOptions: [],
        createdLabel: null,
        createdSelected: false,
        selected: this.multiple ? [] : {},
        isSelect: true,
        multipleInputLength: 20,
        inputWidth: 0,
        cachedPlaceHolder: '',
        optionsCount: 0,
        filteredOptionsCount: 0,
        dropdownUl: null,
        visible: false,
        selectedLabel: '',
        hoverIndex: -1,
        query: '',
        bottomOverflowBeforeHidden: 0,
        topOverflowBeforeHidden: 0,
        optionsAllDisabled: false,
        inputHovering: false,
        currentPlaceholder: '',
        lazyData: [],
        append: null,
        isMobile: VueUtil.getSystemInfo().device == 'Mobile' && VueUtil.getSystemInfo().isLoadMobileJs ? true : false,
        filterAllSelectedStatus:false,
      };
    },
    watch: {
      data: {
        immediate: true,
        handler: function(val) {
          formatedLabelCache = [];
          this.lazyData = val;
        }
      },
      multiple: function(val) {
        var self = this;
        if (self.$refs.reference) {
          self.$refs.reference.setCurrentValue('');
        }
        if (val) {
          self.selected = [];
          self.$nextTick(function() {
            self.$emit('input', []);
          });
        } else {
          self.selected = {};
          self.$nextTick(function() {
            self.$emit('input', '');
          });
        }
      },
      value: function(val, oldVal) {
        var self = this;
        var valueItem;
        
        if (this.multiple) {
          this.resetInputHeight();
          if (val.length > 0 || (this.$refs.input && this.query !== '')) {
            this.currentPlaceholder = '';
          } else {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
          var valueMap = {};
          valueItem = [];
          if (val.length > 0) {
            
            if (this.lazyload) {
              for (var i = 0; i < this.data.length; i++) {
                var index = val.indexOf(this.data[i][self.valueMember]);
                if(index > -1) {
                  valueMap[index] = this.data[i];
                }
              }
            } else {
              for (var j = 0; j < this.options.length; j++) {
                var optionsIndex = val.indexOf(this.options[j].value);
                if(optionsIndex > -1) {
                  valueMap[optionsIndex] = this.data[j];
                }
              }
            }
          }
          
          for (var j = 0; j < Object.keys(valueMap).length; j++) {
            valueItem.push(valueMap[j]);
          }
        } else {
          if (this.lazyload) {
            valueItem = VueUtil.arrayFind(this.data, function(item) {
              return item[self.valueMember] === val;
            });
          } else {
            var optionIndex = VueUtil.arrayFindIndex(this.options, function(option) {
              return option.value == val;
            });
            valueItem = this.data[optionIndex];
          }
        }
        this.setSelected();
        this.$emit('change', val, valueItem, oldVal);
        this.dispatch('VueFormItem', 'vue.form.change', val);
      },
      query: function(val) {
        var self = this;
        self.$nextTick(function() {
          self.broadcast('VueSelectDropdown', 'updatePopper');
        });
        self.hoverIndex = -1;
        if (self.multiple && self.filterable) {
          self.resetInputHeight();
        }
        if (this.lazyload) {
          val = val || '';
          var parsedQuery = String(val).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
          var reg = new RegExp(parsedQuery, 'i');
          this.filteredOptionsCount = this.data.length;
          var result = this.data.filter(function (option) {
            var currentLabel = option[self.displayMember] || ((VueUtil.isString(option[self.valueMember]) || VueUtil.isNumber(option[self.valueMember])) ? option[self.valueMember] : '');
            var formatedLabel = self.getFormatedLabel({
              currentLabel: currentLabel,
              value: option[self.valueMember]
            });

            var visible;
            if (VueUtil.isFunction(self.filterMethod)) {
              visible = self.filterMethod(val, option, formatedLabel);
            } else {
              visible = reg.test(formatedLabel);
            }

            if (!visible) {
              self.filteredOptionsCount--;
            }
            return visible;
          });

          this.lazyData = result;
          return;
        } else if (self.remote && VueUtil.isFunction(self.remoteMethod)) {
          self.hoverIndex = -1;
          self.remoteMethod(val);
          self.broadcast('VueOption', 'resetIndex');
        } else {
          self.filteredOptionsCount = self.optionsCount;
          self.broadcast('VueOption', 'queryChange', val);
          self.broadcast('VueOptionGroup', 'queryChange');
        }
      },
      selectedLabel: function(val){
      },
      visible: function(val) {
        var self = this;
        if(this.lazyload) {
          this.$refs.scroller.scrollToPosition(0);
        }
        if (!val) {
          self.$refs.reference.$refs.input.blur();
          self.handleIconHide();
          self.broadcast('VueSelectDropdown', 'destroyPopper');
          if (self.$refs.input) {
            self.$refs.input.blur();
          }
          self.query = '';
          self.selectedLabel = '';
          self.resetHoverIndex();
          self.$nextTick(function() {
            if (self.$refs.input && self.$refs.input.value === '' && self.selected.length === 0) {
              self.currentPlaceholder = self.cachedPlaceHolder;
            }
          });
          if (!self.multiple) {
            self.getOverflows();
            if (self.selected) {
              if (self.filterable && self.allowCreate && self.createdSelected && self.createdOption) {
                self.selectedLabel = self.createdLabel;
              } else {
                self.selectedLabel = self.getFormatedLabel(self.selected);
              }
              if (self.filterable)
                self.query = self.selectedLabel;
            }
          }
        } else {
          self.handleIconShow();
          self.broadcast('VueSelectDropdown', 'updatePopper');
          if (self.filterable) {
            self.query = self.selectedLabel;
            if (self.multiple) {
              if(self.$refs.input && !self.isMobile)
                self.$refs.input.focus();
            } else {
              if (!self.remote && !self.lazyload) {
                self.broadcast('VueOption', 'queryChange', '');
                self.broadcast('VueOptionGroup', 'queryChange');
              }
            }
            if(self.isMobile && self.remote){
              setTimeout(function(){
                self.$refs.filterInputRef.focus();
                self.$refs.reference.focus();
              },50);
            }
          }
        }
        
        self.$emit('visible-change', val);
      },
      options: function(val) {
        var self = this;
        self.optionsAllDisabled = val.length === VueUtil.filter(val, function(item) {
          return item.disabled === true;
        }).length;
        if (self.multiple) {
          self.resetInputHeight();
        }
        var inputs = self.$el.querySelectorAll('input');
        if ([].indexOf.call(inputs, document.activeElement) === -1) {
          self.setSelected();
        }
      },
      selected: function() {
        this.resetMultipeInput();
      },
      placeholder: function(val) {
        this.cachedPlaceHolder = val;
        this.managePlaceholder();
      }
    },
    methods: {
      focus: function() {
        this.$refs.reference && this.$nextTick(this.$refs.reference.focus);
      },
      handleIconHide: function() {
        var icon = this.$refs.reference.$refs.icon;
        if (icon) {
          VueUtil.removeClass(icon, 'is-reverse');
        }
      },
      handleIconShow: function() {
        var icon = this.$refs.reference.$refs.icon;
        if (icon && !VueUtil.hasClass(icon, 'vue-icon-error')) {
          VueUtil.addClass(icon, 'is-reverse');
        }
      },
      handleMenuEnter: function() {
        if (!this.dropdownUl) {
          this.dropdownUl = this.$refs.popper.$el.querySelector('.vue-select-dropdown__list');
          this.getOverflows();
        }
      },
      getOverflows: function() {
        if (this.dropdownUl && this.selected && this.selected.$el) {
          var selectedRect = this.selected.$el.getBoundingClientRect();
          var popperRect = this.$refs.popper.$el.getBoundingClientRect();
          this.bottomOverflowBeforeHidden = selectedRect.bottom - popperRect.bottom;
          this.topOverflowBeforeHidden = selectedRect.top - popperRect.top;
        }
      },
      getOption: function(value) {
        var option;
        var self = this;

        if (this.lazyload) {
          option = VueUtil.filter(this.data, function(option) {
            return option[self.valueMember] === value;
          })[0];
          if (option) {
            option = VueUtil.merge({}, option);
            option.value = option[this.valueMember];
            option.currentLabel = option[this.displayMember] || ((VueUtil.isString(option[this.valueMember]) || VueUtil.isNumber(option[this.valueMember])) ? option[this.valueMember] : '');
          }
        } else {
          option = VueUtil.filter(this.cachedOptions, function(option) {
            return option.value === value;
          })[0];
        }
        if (option)
          return option;
        var label = VueUtil.isString(value) || VueUtil.isNumber(value) ? value : '';
        var newOption = {
          value: value,
          currentLabel: label
        };
        return newOption;
      },
      setSelected: function() {
        var self = this;
        if (!self.multiple) {
          var option = self.getOption(self.value);
          if (option.created) {
            self.createdLabel = option.currentLabel;
            self.createdSelected = true;
          } else {
            self.createdSelected = false;
          }
          //移动端过滤输入框内容回退为空时，不做已选中值对它的重新赋值
          if(!(this.isMobile && this.visible && (this.remote || this.allowCreate)))
            self.selectedLabel = self.getFormatedLabel(option);

          self.selected = option;
          if (self.filterable)
            self.query = self.selectedLabel;
          return;
        }
        var result = [];
        VueUtil.loop(self.value, function(value) {
          result.push(self.getOption(value));
        });
        self.selected = result;
        self.$nextTick(function() {
          self.resetInputHeight();
        });
      },
      handleIconClick: function(event) {
        var value = [];
        if (this.iconClass.indexOf('vue-icon-error') !== -1) {
          this.deleteSelected(event);
        }else if(this.isMobile && this.iconClass.indexOf('vue-icon-success is-show-check is-all-select') !== -1){
          this.$emit('input', value);
          this.filterAllSelectedStatus = false;
        } else if (this.iconClass.indexOf('vue-icon-success is-show-check') !== -1) {
          VueUtil.loop(this.options, function(option) {
            if (!option.disabled) {
              value.push(option.value);
            }
          });
          this.$emit('input', value);
          this.filterAllSelectedStatus = true;
        }else {
          this.toggleMenu();
        }
      },
      handleMouseDown: function(event) {
        if (event.target.tagName !== 'INPUT')
          return;
        if (this.visible) {
          this.handleClose();
          this.focus();
          event.preventDefault();
        } else {
          this.toggleMenu();
        }
      },
      destroyPopper: function() {
        this.$refs.popper.destroyPopper();
      },
      handleClose: function() {
        this.visible = false;
      },
      deletePrevTag: function(e) {
        if (e.target.value.length <= 0) {
          var value = VueUtil.mergeArray([], this.value);
          value.pop();
          this.$emit('input', value);
        }
      },
      managePlaceholder: function() {
        if (this.currentPlaceholder !== '' && this.$refs.input) {
          this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
        }
      },
      resetInputState: function(e) {
        if (e.keyCode !== 8) {
          this.resetInputHeight();
        }
      },
      resetInputHeight: function() {
        var self = this;
        if (!this.autoHeight) return;
        self.$nextTick(function() {
          var sizeMap = {'large': 42, 'small': 30, 'mini': 22};
          var input = self.$refs.reference.$refs.input;
          var icon = self.$refs.reference.$refs.icon;
          input.style.height = '';
          if(icon) icon.style.lineHeight = '';

          var size = input.offsetHeight || 36;
          if(icon) icon.style.lineHeight = size + 'px';
          var newHeight = (parseInt(self.$refs.tags.children[0].offsetHeight / size, 10) + 1) * size;
          if (self.selected.length > 0 && self.multipleInputLength == self.inputWidth - 45) {
            newHeight += size;
          }

          newHeight !== size ? newHeight += 'px' : newHeight = '';
          input.style.height = newHeight;
          if(icon) icon.style.lineHeight = newHeight;
          if (self.visible && self.emptyText !== false) {
            self.broadcast('VueSelectDropdown', 'updatePopper');
          }
        });
      },
      resetHoverIndex: function() {
        var self = this;
        self.$nextTick(function() {
          if (!self.multiple) {
            self.hoverIndex = self.options.indexOf(self.selected);
          } else {
            if (self.selected.length > 0) {
              self.hoverIndex = Math.min.apply(null, VueUtil.map(self.selected, function(item) {
                return self.options.indexOf(item);
              }));
            } else {
              self.hoverIndex = -1;
            }
          }
        });
      },
      handleOptionSelect: function(option) {
        if (this.multiple) {
          var value = VueUtil.mergeArray([], this.value);
          var optionIndex = value.indexOf(option.value);
          if (optionIndex !== -1) {
            value.splice(optionIndex, 1);
          } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
            value.push(option.value);
          }
          this.$emit('input', value);
          if (option.created) {
            this.query = '';
          }
          if (this.filterable) {
            this.query = '';
            this.$refs.input.focus();
          } else {
            this.focus();
          }
        } else {
          this.$emit('input', option.value);
          this.visible = false;
          this.focus();
        }
      },
      toggleMenu: function() {
        if (this.filterable && this.query === '' && this.visible) {
          return;
        }
        if (!this.disabled) {
          this.visible = !this.visible;
        }
      },
      keepMenu: function() {
        if (!this.visible) {
          this.visible = true;
        }
      },
      navigateOptions: function(direction) {
        if (!this.visible) {
          this.visible = true;
          return;
        }
        if (this.options.length === 0 || this.filteredOptionsCount === 0)
          return;
        this.optionsAllDisabled = this.options.length === VueUtil.filter(this.options, function(item) {return item.disabled === true;}).length;
        if (!this.optionsAllDisabled) {
          if (direction === 'next') {
            if (this.lazyload) {
              this.getHoverIndexLazy(direction);
            } else {
              this.hoverIndex++;
              if (this.hoverIndex === this.options.length) {
                this.hoverIndex = 0;
              }
            }
            this.resetScrollTop();
            if (this.options[this.hoverIndex].disabled === true || this.options[this.hoverIndex].groupDisabled === true || !this.options[this.hoverIndex].visible) {
              this.navigateOptions('next');
            }
          }
          if (direction === 'prev') {
            if (this.lazyload) {
              this.getHoverIndexLazy(direction);
            } else {
              this.hoverIndex--;
              if (this.hoverIndex < 0) {
                this.hoverIndex = this.options.length - 1;
              }
            }
            this.resetScrollTop();
            if (this.options[this.hoverIndex].disabled === true || this.options[this.hoverIndex].groupDisabled === true || !this.options[this.hoverIndex].visible) {
              this.navigateOptions('prev');
            }
          }
        }
      },
      getHoverIndexLazy: function(direction) {
        var self = this;
        var currentLazyList = this.lazyData.slice(this.$refs.scroller.$_startIndex, this.$refs.scroller.$_endIndex);
        var hoverIndex = self.hoverIndex;
        var hoverValue;

        if(hoverIndex > -1) {
          var currentHoverValue = self.options[self.hoverIndex].value;
          //当前数据中处于第几个
          hoverIndex = VueUtil.findIndex(currentLazyList, function(option) {
            return option[self.valueMember] == currentHoverValue;
          });
        }

        if (direction == 'next') {
          hoverIndex++;
          if (hoverIndex == currentLazyList.length) {
            hoverIndex = currentLazyList.length -1;
          }
        } else if (direction == 'prev') {
          hoverIndex--;
          if (hoverIndex < 0) {
            hoverIndex = 0;
          }
        }
        hoverValue = currentLazyList[hoverIndex][self.valueMember];

        this.hoverIndex = VueUtil.findIndex(self.$refs.scroller.pool, function(pool) {
          return pool.position > -1 && pool.item[self.valueMember] == hoverValue;
        });
        
      },
      resetScrollTop: function() {
        var scrollPanel = this.lazyload ? this.$refs.scroller.$el : this.dropdownUl;

        var bottomOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().bottom - this.$refs.popper.$el.getBoundingClientRect().bottom;
        var topOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().top - this.$refs.popper.$el.getBoundingClientRect().top;
        if (bottomOverflowDistance > 0) {
          scrollPanel.scrollTop += bottomOverflowDistance;
        }
        if (topOverflowDistance < 0) {
          scrollPanel.scrollTop += topOverflowDistance;
        }
      },
      selectOption: function(event) {
        if (this.visible) {
          event.stopPropagation();
        } else {
          this.visible = true;
          return;
        }
        if (this.options[this.hoverIndex]) {
          this.handleOptionSelect(this.options[this.hoverIndex]);
        }
      },
      deleteSelected: function(event) {
        event && event.stopPropagation();
        if (this.multiple) {
          this.$emit('input', []);
        } else {
          this.$emit('input', '');
        }
        this.visible = false;
      },
      deleteTag: function(event, tag) {
        var index = this.selected.indexOf(tag);
        if (index !== -1 && !this.disabled) {
          var value = VueUtil.mergeArray([], this.value);
          value.splice(index, 1);
          this.$emit('input', value);
          this.$emit('remove-tag', tag);
        }
        event.stopPropagation();
      },
      onInputChange: function() {
        if (this.filterable) {
          this.query = this.selectedLabel;
        }
      },
      onOptionDestroy: function(option) {
        this.optionsCount--;
        this.filteredOptionsCount--;
        var index = this.options.indexOf(option);
        if (index !== -1) {
          this.options.splice(index, 1);
        }
        
        var self = this;
        VueUtil.throttle(100, function() {
          self.broadcast('VueOption', 'resetIndex');
        }).apply(self);
      },
      resetInputWidth: function() {
        var self = this;
        self.inputWidth = self.$refs.reference.$el.getBoundingClientRect().width;
        this.$nextTick(function() {
          setTimeout(function() {
            if(VueUtil.get(self, '$refs.reference.$el')) {
              self.inputWidth = self.$refs.reference.$el.getBoundingClientRect().width;
              self.resetMultipeInput();
            }
          }, 500);
        });
      },
      handleResize: function() {
        this.resetInputWidth();
        if (this.multiple) this.resetInputHeight();
      },
      debouncedOnInputChange: VueUtil.debounce(function() {
        this.onInputChange();
      }),
      getValueKey: function(item) {
        if (Object.prototype.toString.call(item.value).toLowerCase() !== '[object object]') {
          return item.value;
        } else {
          return getValueByPath(item.value, this.valueKey);
        }
      },
      getFormatedLabel: function(option) {
        if(!VueUtil.isFunction(this.labelFormatter)) {
          return option.currentLabel;
        }

        var keySpliter = '|';
        var key = option.currentLabel + keySpliter + option.value;
        var label = formatedLabelCache[key];
        if (label === undefined) {
          formatedLabelCache[key] = this.labelFormatter(option.currentLabel, option.value);
        }
        return formatedLabelCache[key];
      },

      resetMultipeInput: function() {
        var self = this;
        if(this.multiple && this.filterable) {
          self.multipleInputLength = 1;
          self.$nextTick(function() {
            setTimeout(function() {
              var totalLength = self.inputWidth;
              var inputReact = self.$refs.input.getBoundingClientRect();
              var totalTag = self.$refs.tags.querySelectorAll('.vue-tag');
              var sameLineTagCount = 0;
              for (var i = 0; i < self.selected.length; i++) {
                if(totalTag[i]) {
                  var tagReact = totalTag[i].getBoundingClientRect();
                  if(Math.abs(inputReact.top - tagReact.top) < 10) {
                    sameLineTagCount++;
                    totalLength -= (tagReact.width + 6); //6px是tag的margin-left
                  }
                }
              }
              self.multipleInputLength = totalLength - 45;

              if (sameLineTagCount === 0) {
                self.resetInputHeight();
              }
            }, 100);
          });
        }
      }
    },
    created: function() {
      this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
      if (this.multiple && !VueUtil.isArray(this.value)) this.$emit('input', []);
      if (!this.multiple && VueUtil.isArray(this.value)) this.$emit('input', '');
      this.setSelected();
      this.$on('handleOptionClick', this.handleOptionSelect);
      this.$on('onOptionDestroy', this.onOptionDestroy);
      this.$on('setSelected', this.setSelected);
    },
    mounted: function() {
      this.appendToSelf && (this.append = this.$el);
      VueUtil.addResizeListener(this.$el, this.handleResize);
      if (this.remote && this.multiple) {
        this.resetInputHeight();
      }
      this.$nextTick(function() {
        this.setSelected();
        if (this.$refs.reference && this.$refs.reference.$el) {
          this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
        }
      });
    },
    beforeDestroy: function() {
      VueUtil.removeResizeListener(this.$el, this.handleResize);
    }
  };
  Vue.component(VueSelect.name, VueSelect);
});
