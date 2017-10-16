!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VuePopper'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VuePopper']);
		delete context[name];
	}
})('VueAutocomplete', this, function(Vue, VueUtil, VuePopper) {
	'use strict';
	var VueAutocompleteSuggestions = {
		template: '<transition name="vue-zoom-in-top" @after-leave="doDestroy"><div v-show="showPopper" class="vue-autocomplete-suggestion" :class="{ \'is-loading\': parent.loading }" :style="{ width: dropdownWidth }"><ul class="vue-autocomplete-suggestion__wrap"><li v-if="parent.loading"><i class="vue-icon-loading"></i></li><template v-for="(item, index) in suggestions" v-else><li v-if="!parent.customItem" :class="{\'highlighted\': parent.highlightedIndex === index}" @click="select(item)">{{item[props.label]}}</li><component v-else :class="{\'highlighted\': parent.highlightedIndex === index}" @click="select(item)" :is="parent.customItem" :item="item" :index="index"></component></template></ul></div></transition>',
		mixins: [VuePopper, VueUtil.component.emitter],
		componentName: 'VueAutocompleteSuggestions',
		data: function() {
			return {
				parent: this.$parent,
				dropdownWidth: ''
			};
		},
		props: {
			props: Object,
			suggestions: Array,
			options: {
				default: function() {
					return {
						forceAbsolute: true,
						gpuAcceleration: false
					};
				}
			}
		},
		methods: {
			select: function(item) {
				this.dispatch('VueAutocomplete', 'item-click', item);
			}
		},
		updated: function() {
			var self = this;
			self.$nextTick(function() {
				self.updatePopper();
			});
		},
		mounted: function() {
			this.popperElm = this.$el;
			this.referenceElm = this.$parent.$refs.input.$refs.input;
		},
		created: function() {
			var self = this;
			self.$on('visible', function(val, inputWidth) {
				self.dropdownWidth = inputWidth + 'px';
				self.showPopper = val;
			});
		}
	};
	var VueAutocomplete = {
		template: '<div class="vue-autocomplete" v-clickoutside="close"><vue-input :autofocus="autofocus" :tabindex="tabindex" ref="input" v-bind="$props" @compositionstart.native="handleComposition" @compositionupdate.native="handleComposition" @compositionend.native="handleComposition" @change="handleChange" @focus="handleFocus" @keydown.up.native.prevent="highlight(highlightedIndex - 1)" @keydown.down.native.prevent="highlight(highlightedIndex + 1)" @keydown.enter.native.prevent="handleKeyEnter" @keydown.native.tab="close"><template slot="prepend" v-if="$slots.prepend"><slot name="prepend"></slot></template><template slot="append" v-if="$slots.append"><slot name="append"></slot></template></vue-input><vue-autocomplete-suggestions :props="props" :class="[popperClass ? popperClass : \'\']" ref="suggestions" :suggestions="suggestions"></vue-autocomplete-suggestions></div>',
		name: 'VueAutocomplete',
		mixins: [VueUtil.component.emitter],
		componentName: 'VueAutocomplete',
		components: {
			VueAutocompleteSuggestions: VueAutocompleteSuggestions
		},
		directives: {
			Clickoutside: VueUtil.component.clickoutside()
		},
		props: {
			props: {
				type: Object,
				default: function() {
					return {
						label: 'value',
						value: 'value'
					};
				}
			},
			popperClass: String,
			placeholder: String,
			disabled: Boolean,
			name: String,
			size: String,
			value: String,
			autofocus: Boolean,
			tabindex: Number,
			fetchSuggestions: Function,
			triggerOnFocus: {
				type: Boolean,
				default: true
			},
			customItem: String,
			icon: String,
			onIconClick: Function
		},
		data: function() {
			return {
				activated: false,
				isOnComposition: false,
				suggestions: [],
				loading: false,
				highlightedIndex: -1
			};
		},
		computed: {
			suggestionVisible: function() {
				var suggestions = this.suggestions;
				var isValidData = Array.isArray(suggestions) && suggestions.length > 0;
				return (isValidData || this.loading) && this.activated;
			}
		},
		watch: {
			suggestionVisible: function(val) {
				this.broadcast('VueAutocompleteSuggestions', 'visible', [val, this.$refs.input.$refs.input.offsetWidth]);
			}
		},
		methods: {
			focus: function() {
				this.$refs.input.focus();
			},
			getData: function(queryString) {
				var self = this;
				self.loading = true;
				self.fetchSuggestions && self.fetchSuggestions(queryString, function(suggestions) {
					self.loading = false;
					if (Array.isArray(suggestions)) {
						self.suggestions = suggestions;
					} else {
						console.error('autocomplete suggestions must be an array');
					}
				});
			},
			handleComposition: function(event) {
				if (event.type === 'compositionend') {
					this.isOnComposition = false;
					this.handleChange(event.data);
				} else {
					this.isOnComposition = true;
				}
			},
			handleChange: function(value) {
				this.$emit('input', value);
				if (this.isOnComposition || (!this.triggerOnFocus && !value)) {
					this.suggestions = [];
					return;
				}
				this.getData(value);
			},
			handleFocus: function() {
				this.activated = true;
				if (this.triggerOnFocus) {
					this.getData(this.value);
				}
			},
			close: function() {
				this.activated = false;
			},
			handleKeyEnter: function() {
				if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
					this.select(this.suggestions[this.highlightedIndex]);
				}
			},
			select: function(item) {
				var self = this;
				self.$emit('input', item[self.props.value]);
				self.$emit('select', item);
				self.$nextTick(function() {
					self.suggestions = [];
					self.focus();
				});
			},
			highlight: function(index) {
				if (!this.suggestionVisible || this.loading) return;
				if (index < 0) index = 0;
				if (index >= this.suggestions.length) {
					index = this.suggestions.length - 1;
				}
				var suggestion = this.$refs.suggestions.$el.querySelector('.vue-autocomplete-suggestion__wrap');
				var suggestionList = suggestion.querySelectorAll('li');
				var highlightItem = suggestionList[index];
				var scrollTop = suggestion.scrollTop;
				var offsetTop = highlightItem.offsetTop;
				if (offsetTop + highlightItem.scrollHeight > (scrollTop + suggestion.clientHeight)) {
					suggestion.scrollTop += highlightItem.scrollHeight;
				}
				if (offsetTop < scrollTop) {
					suggestion.scrollTop -= highlightItem.scrollHeight;
				}
				this.highlightedIndex = index;
			}
		},
		mounted: function() {
			var self = this;
			self.$on('item-click', function(item) {
				self.select(item);
			});
		},
		beforeDestroy: function() {
			this.$refs.suggestions.$destroy();
		}
	};
	Vue.component(VueAutocomplete.name, VueAutocomplete);
});
