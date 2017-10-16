!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueSelect', this, function(Vue, VueUtil) {
	'use strict';
	var sizeMap = {
		'large': 42,
		'small': 30,
		'mini': 22
	};
	var VueSelect = {
		template: '<div class="vue-select" v-clickoutside="handleClose"><div class="vue-select__tags" :class="{\'no-reset-height\': !autoHeight}" v-if="multiple" @click.stop="toggleMenu" ref="tags" :style="{ \'max-width\': inputWidth - 32 + \'px\' }"><transition-group @after-leave="resetInputHeight"><vue-tag v-for="(item, index) in selected" :key="index" :closable="!disabled" hit :type="disabled ? \'\' : \'info\'" @close="deleteTag($event, item)"><span class="vue-select__tags-text">{{ item.currentLabel }}</span></vue-tag></transition-group><input type="text" class="vue-select__input" :class="\'is-\'+size" @focus="visible = true" :disabled="disabled" @keyup="managePlaceholder" @keydown="resetInputState" @keydown.down.prevent="navigateOptions(\'next\')" @keydown.up.prevent="navigateOptions(\'prev\')" @keydown.enter.prevent="selectOption" @keydown.esc.prevent="visible = false" @keydown.delete="deletePrevTag" v-model="query" :debounce="remote ? 300 : 0" v-if="filterable" :style="{ width: inputLength + \'px\', \'max-width\': inputWidth - 42 + \'px\' }" ref="input"></div><vue-input ref="reference" v-model="selectedLabel" type="text" :placeholder="placeholderLang" :autofocus="autofocus" :tabindex="tabindex" :name="name" :size="size" :disabled="disabled" :readonly="!filterable || multiple" :validate-event="false" @click="handleIconClick" @mousedown.native="handleMouseDown" @keyup.native="debouncedOnInputChange" @keydown.native.down.prevent="navigateOptions(\'next\')" @keydown.native.up.prevent="navigateOptions(\'prev\')" @keydown.native.enter.prevent="selectOption" @keydown.native.esc.prevent="visible = false" @keydown.native.tab="visible = false" @paste.native="debouncedOnInputChange" @mouseenter.native="inputHovering = true" @mouseleave.native="inputHovering = false" :icon="iconClass"></vue-input><transition name="vue-zoom-in-top" @after-leave="doDestroy" @after-enter="handleMenuEnter"><vue-select-dropdown ref="popper" v-show="visible && emptyText !== false"><ul class="vue-select-dropdown__list" :class="{ \'is-empty\': !allowCreate && filteredOptionsCount === 0 }" v-show="options.length > 0 && !loading"><vue-option :value="query" created v-if="showNewOption"></vue-option><slot></slot></ul><p class="vue-select-dropdown__empty" v-if="emptyText && !allowCreate">{{ emptyText }}</p></vue-select-dropdown></transition></div>',
		mixins: [VueUtil.component.emitter],
		name: 'VueSelect',
		componentName: 'VueSelect',
		computed: {
			iconClass: function() {
				if (this.multiple) {
					if (this.visible) {
						var criteria = this.clearable && !this.disabled && this.inputHovering;
						return criteria ? 'vue-icon-circle-check is-show-check' : (this.remote && this.filterable ? '' : 'vue-icon-caret-top');
					} else {
						var criteria = this.clearable && !this.disabled && this.inputHovering && this.value !== undefined && this.value.length>0;
						return criteria ? 'vue-icon-circle-close is-show-close' : (this.remote && this.filterable ? '' : 'vue-icon-caret-top');
					}
				} else {
					var criteria = this.clearable && !this.disabled && this.inputHovering && this.value !== undefined && this.value !== '';
					return criteria ? 'vue-icon-circle-close is-show-close' : (this.remote && this.filterable ? '' : 'vue-icon-caret-top');
				}
			},
			debounce: function() {
				return this.remote ? 300 : 0;
			},
			emptyText: function() {
				if (this.loading) {
					return this.loadingText || this.$t('vue.select.loading');
				} else {
					if (this.remote && this.query === '' && this.options.length === 0)
						return false;
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
				var hasExistingOption = self.options.filter(function(option) {
					return !option.created;
				}).some(function(option) {
					return option.currentLabel === self.query;
				});
				return self.filterable && self.allowCreate && self.query !== '' && !hasExistingOption;
			},
			placeholderLang: function() {
				if (this.multiple) {
					if (Array.isArray(this.value) && this.value.length > 0) {
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
			Clickoutside: VueUtil.component.clickoutside()
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
			}
		},
		data: function() {
			return {
				options: [],
				cachedOptions: [],
				createdLabel: null,
				createdSelected: false,
				selected: this.multiple ? [] : {},
				isSelect: true,
				inputLength: 20,
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
				currentPlaceholder: ''
			};
		},
		watch: {
			value: function(val) {
				if (this.multiple) {
					this.resetInputHeight();
					if (val.length > 0 || (this.$refs.input && this.query !== '')) {
						this.currentPlaceholder = '';
					} else {
						this.currentPlaceholder = this.cachedPlaceHolder;
					}
				}
				this.setSelected();
				if (this.filterable && !this.multiple) {
					this.inputLength = 20;
				}
				this.$emit('change', val);
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
				if (self.remote && typeof self.remoteMethod === 'function') {
					self.hoverIndex = -1;
					self.remoteMethod(val);
					self.broadcast('VueOption', 'resetIndex');
				} else if (typeof self.filterMethod === 'function') {
					self.filterMethod(val);
					self.broadcast('VueOptionGroup', 'queryChange');
				} else {
					self.filteredOptionsCount = self.optionsCount;
					self.broadcast('VueOption', 'queryChange', val);
					self.broadcast('VueOptionGroup', 'queryChange');
				}
			},
			visible: function(val) {
				var self = this;
				if (!val) {
					self.$refs.reference.$el.querySelector('input').blur();
					self.handleIconHide();
					self.broadcast('VueSelectDropdown', 'destroyPopper');
					if (self.$refs.input) {
						self.$refs.input.blur();
					}
					self.query = '';
					self.selectedLabel = '';
					self.inputLength = 20;
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
								self.selectedLabel = self.selected.currentLabel;
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
							self.$refs.input.focus();
						} else {
							if (!self.remote) {
								self.broadcast('VueOption', 'queryChange', '');
								self.broadcast('VueOptionGroup', 'queryChange');
							}
							self.broadcast('VueInput', 'inputSelect');
						}
					}
				}
				self.$emit('visible-change', val);
			},
			options: function(val) {
				var self = this;
				if (self.$isServer)
					return;
				self.optionsAllDisabled = val.length === val.filter(function(item) {
					return item.disabled === true;
				}).length;
				if (self.multiple) {
					self.resetInputHeight();
				}
				var inputs = self.$el.querySelectorAll('input');
				if ([].indexOf.call(inputs, document.activeElement) === -1) {
					self.setSelected();
				}
			}
		},
		methods: {
			focus: function() {
				this.$refs.reference && this.$nextTick(this.$refs.reference.focus);
			},
			handleIconHide: function() {
				var icon = this.$el.querySelector('.vue-input__icon');
				if (icon) {
					VueUtil.removeClass(icon, 'is-reverse');
				}
			},
			handleIconShow: function() {
				var icon = this.$el.querySelector('.vue-input__icon');
				if (icon && !VueUtil.hasClass(icon, 'vue-icon-circle-close')) {
					VueUtil.addClass(icon, 'is-reverse');
				}
			},
			handleMenuEnter: function() {
				if (!this.dropdownUl) {
					this.dropdownUl = this.$refs.popper.$el.querySelector('.vue-select-dropdown__wrap');
					this.getOverflows();
				}
				if (!this.multiple && this.dropdownUl) {
					this.resetMenuScroll();
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
			resetMenuScroll: function() {
				if (this.bottomOverflow > 0) {
					this.dropdownUl.scrollTop += this.bottomOverflow;
				} else if (this.topOverflow < 0) {
					this.dropdownUl.scrollTop += this.topOverflow;
				}
			},
			getOption: function(value) {
				var option = this.cachedOptions.filter(function(option) {
					return option.value === value;
				})[0];
				if (option)
					return option;
				var label = typeof value === 'string' || typeof value === 'number' ? value : '';
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
					self.selectedLabel = option.currentLabel;
					self.selected = option;
					if (self.filterable)
						self.query = self.selectedLabel;
					return;
				}
				var result = [];
				if (Array.isArray(self.value)) {
					self.value.forEach(function(value) {
						result.push(self.getOption(value));
					});
				}
				self.selected = result;
				self.$nextTick(function() {
					self.resetInputHeight();
				});
			},
			handleIconClick: function(event) {
				if (this.iconClass.indexOf('circle-close') > -1) {
					this.deleteSelected(event);
				} else if (this.iconClass.indexOf('circle-check') > -1) {
					var value = [];
					this.options.forEach(function(option){
						value.push(option.value);
					});
					this.$emit('input', value);
				} else {
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
			doDestroy: function() {
				this.$refs.popper.doDestroy();
			},
			handleClose: function() {
				this.visible = false;
			},
			deletePrevTag: function(e) {
				if (e.target.value.length <= 0) {
					var value = this.value.slice();
					value.pop();
					this.$emit('input', value);
				}
			},
			managePlaceholder: function() {
				if (this.currentPlaceholder !== '') {
					this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
				}
			},
			resetInputState: function(e) {
				if (e.keyCode !== 8) {
					this.inputLength = this.$refs.input.value.length * 15 + 20;
					this.resetInputHeight();
				}
			},
			resetInputHeight: function() {
				var self = this;
				if (!this.autoHeight) return;
				self.$nextTick(function() {
					var inputChildNodes = self.$refs.reference.$el.childNodes;
					var input = [].filter.call(inputChildNodes, function(item) {
						return item.tagName === 'INPUT';
					})[0];
					input.style.height = Math.max(self.$refs.tags.clientHeight + 6, sizeMap[self.size] || 36) + 'px';
					if (self.visible && self.emptyText !== false) {
						self.broadcast('VueSelectDropdown', 'updatePopper');
					}
				});
			},
			resetHoverIndex: function() {
				var self = this;
				setTimeout(function() {
					if (!self.multiple) {
						self.hoverIndex = self.options.indexOf(self.selected);
					} else {
						if (self.selected.length > 0) {
							self.hoverIndex = Math.min.apply(null, self.selected.map(function(item) {
								return self.options.indexOf(item);
							}));
						} else {
							self.hoverIndex = -1;
						}
					}
				}, 300);
			},
			handleOptionSelect: function(option) {
				if (this.multiple) {
					var value = this.value.slice();
					var optionIndex = value.indexOf(option.value);
					if (optionIndex > -1) {
						value.splice(optionIndex, 1);
					} else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
						value.push(option.value);
					}
					this.$emit('input', value);
					if (option.created) {
						this.query = '';
						this.inputLength = 20;
					}
					if (this.filterable) {
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
			navigateOptions: function(direction) {
				if (!this.visible) {
					this.visible = true;
					return;
				}
				if (this.options.length === 0 || this.filteredOptionsCount === 0)
					return;
				this.optionsAllDisabled = this.options.length === this.options.filter(function(item) {return item.disabled === true;}).length;
				if (!this.optionsAllDisabled) {
					if (direction === 'next') {
						this.hoverIndex++;
						if (this.hoverIndex === this.options.length) {
							this.hoverIndex = 0;
						}
						this.resetScrollTop();
						if (this.options[this.hoverIndex].disabled === true || this.options[this.hoverIndex].groupDisabled === true || !this.options[this.hoverIndex].visible) {
							this.navigateOptions('next');
						}
					}
					if (direction === 'prev') {
						this.hoverIndex--;
						if (this.hoverIndex < 0) {
							this.hoverIndex = this.options.length - 1;
						}
						this.resetScrollTop();
						if (this.options[this.hoverIndex].disabled === true || this.options[this.hoverIndex].groupDisabled === true || !this.options[this.hoverIndex].visible) {
							this.navigateOptions('prev');
						}
					}
				}
			},
			resetScrollTop: function() {
				var bottomOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().bottom - this.$refs.popper.$el.getBoundingClientRect().bottom;
				var topOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().top - this.$refs.popper.$el.getBoundingClientRect().top;
				if (bottomOverflowDistance > 0) {
					this.dropdownUl.scrollTop += bottomOverflowDistance;
				}
				if (topOverflowDistance < 0) {
					this.dropdownUl.scrollTop += topOverflowDistance;
				}
			},
			selectOption: function() {
				if (this.options[this.hoverIndex]) {
					this.handleOptionSelect(this.options[this.hoverIndex]);
				}
			},
			deleteSelected: function(event) {
				event.stopPropagation();
				if (this.multiple) {
					this.$emit('input', []);
				} else {
					this.$emit('input', '');
				}
				this.visible = false;
			},
			deleteTag: function(event, tag) {
				var index = this.selected.indexOf(tag);
				if (index > -1 && !this.disabled) {
					var value = this.value.slice();
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
				if (index > -1) {
					this.options.splice(index, 1);
				}
				this.broadcast('VueOption', 'resetIndex');
			},
			resetInputWidth: function() {
				this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
			},
			handleResize: function() {
				this.resetInputWidth();
				if (this.multiple) this.resetInputHeight();
			}
		},
		created: function() {
			var self = this;
			self.cachedPlaceHolder = self.currentPlaceholder = self.placeholder;
			if (self.multiple && !Array.isArray(self.value)) {
				self.$emit('input', []);
			}
			if (!self.multiple && Array.isArray(self.value)) {
				self.$emit('input', '');
			}
			self.setSelected();
			self.debouncedOnInputChange = VueUtil.component.debounce(self.debounce, function() {
				self.onInputChange();
			});
			self.$on('handleOptionClick', self.handleOptionSelect);
			self.$on('onOptionDestroy', self.onOptionDestroy);
			self.$on('setSelected', self.setSelected);
		},
		mounted: function() {
			var self = this;
			VueUtil.addResizeListener(self.$el, self.handleResize);
			if (self.remote && self.multiple) {
				self.resetInputHeight();
			}
			self.$nextTick(function() {
				if (self.$refs.reference.$el) {
					self.inputWidth = self.$refs.reference.$el.getBoundingClientRect().width;
				}
			});
		},
		beforeDestroy: function() {
			if (this.$el && this.handleResize)
				VueUtil.removeResizeListener(this.$el, this.handleResize);
		}
	};
	Vue.component(VueSelect.name, VueSelect);
});
