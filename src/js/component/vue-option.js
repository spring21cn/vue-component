!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
	}
})('VueOption', this, function(Vue, VueUtil) {
	'use strict';
	var VueOption = {
		template: '<li @mouseenter="hoverItem" @click.stop="selectOptionClick" class="vue-select-dropdown__item" v-show="visible" :class="{\'selected\': itemSelected, \'is-disabled\': disabled || groupDisabled || limitReached}"><slot><span>{{ currentLabel }}</span></slot></li>',
		name: 'VueOption',
		componentName: 'VueOption',
		mixins: [VueUtil.component.emitter],
		props: {
			value: {
				required: true
			},
			label: [String, Number],
			selected: {
				type: Boolean,
				default: false
			},
			created: Boolean,
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data: function() {
			return {
				index: -1,
				groupDisabled: false,
				visible: true,
				hitState: false
			};
		},
		computed: {
			currentLabel: function() {
				return this.label || ((typeof this.value === 'string' || typeof this.value === 'number') ? this.value : '');
			},
			currentValue: function() {
				return this.value || this.label || '';
			},
			parent: function() {
				var result = this.$parent;
				while (!result.isSelect) {
					result = result.$parent;
				}
				return result;
			},
			itemSelected: function() {
				if (!this.parent.multiple) {
					return this.value === this.parent.value;
				} else {
					return this.parent.value.indexOf(this.value) > -1;
				}
			},
			limitReached: function() {
				if (this.parent.multiple) {
					return !this.itemSelected && this.parent.value.length >= this.parent.multipleLimit && this.parent.multipleLimit > 0;
				} else {
					return false;
				}
			}
		},
		watch: {
			currentLabel: function() {
				if (!this.created && !this.parent.remote)
					this.dispatch('VueSelect', 'setSelected');
			},
			value: function() {
				if (!this.created && !this.parent.remote)
					this.dispatch('VueSelect', 'setSelected');
			}
		},
		methods: {
			handleGroupDisabled: function(val) {
				this.groupDisabled = val;
			},
			hoverItem: function() {
				if (!this.disabled && !this.groupDisabled) {
					this.parent.hoverIndex = this.parent.options.indexOf(this);
				}
			},
			selectOptionClick: function() {
				if (this.disabled !== true && this.groupDisabled !== true) {
					this.dispatch('VueSelect', 'handleOptionClick', this);
				}
			},
			queryChange: function(query) {
				var parsedQuery = String(query).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
				this.visible = new RegExp(parsedQuery,'i').test(this.currentLabel) || this.created;
				if (!this.visible) {
					this.parent.filteredOptionsCount--;
				}
			},
			resetIndex: function() {
				var self = this;
				self.$nextTick(function() {
					self.index = self.parent.options.indexOf(self);
				});
			}
		},
		created: function() {
			this.parent.options.push(this);
			this.parent.cachedOptions.push(this);
			this.parent.optionsCount++;
			this.parent.filteredOptionsCount++;
			this.index = this.parent.options.indexOf(this);
			this.$on('queryChange', this.queryChange);
			this.$on('handleGroupDisabled', this.handleGroupDisabled);
			this.$on('resetIndex', this.resetIndex);
		},
		beforeDestroy: function() {
			this.dispatch('VueSelect', 'onOptionDestroy', this);
		}
	};
	Vue.component(VueOption.name, VueOption);
	return function() {
		return VueOption;
	}
});
