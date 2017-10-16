!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VuePagination', this, function(Vue) {
	'use strict';
	var VuePager = {
		template: '<ul @click="onPagerClick" class="vue-pager"><li :class="{ active: currentPage === 1 }" v-if="pageCount > 0" class="number">1</li><li class="vue-icon more btn-quickprev" :class="[quickprevIconClass]" v-if="showPrevMore" @mouseenter="quickprevIconClass = \'vue-icon-d-arrow-left\'" @mouseleave="quickprevIconClass = \'vue-icon-more\'"></li><li v-for="pager in pagers" :class="{ active: currentPage === pager }" class="number">{{ pager }}</li><li class="vue-icon more btn-quicknext" :class="[quicknextIconClass]" v-if="showNextMore" @mouseenter="quicknextIconClass = \'vue-icon-d-arrow-right\'" @mouseleave="quicknextIconClass = \'vue-icon-more\'"></li><li :class="{ active: currentPage === pageCount }" class="number" v-if="pageCount > 1">{{ pageCount }}</li></ul>',
		name: 'VuePager',
		props: {
			currentPage: Number,
			pageCount: Number
		},
		watch: {
			showPrevMore: function(val) {
				if (!val) this.quickprevIconClass = 'vue-icon-more';
			},
			showNextMore: function(val) {
				if (!val) this.quicknextIconClass = 'vue-icon-more';
			}
		},
		methods: {
			onPagerClick: function(event) {
				var target = event.target;
				if (target.tagName === 'UL') {
					return;
				}
				var newPage = Number(event.target.textContent);
				var pageCount = this.pageCount;
				var currentPage = this.currentPage;
				if (target.className.indexOf('more') !== -1) {
					if (target.className.indexOf('quickprev') !== -1) {
						newPage = currentPage - 5;
					} else if (target.className.indexOf('quicknext') !== -1) {
						newPage = currentPage + 5;
					}
				}
				if (!isNaN(newPage)) {
					if (newPage < 1) {
						newPage = 1;
					}
					if (newPage > pageCount) {
						newPage = pageCount;
					}
				}
				if (newPage !== currentPage) {
					this.$emit('change', newPage);
				}
			}
		},
		computed: {
			pagers: function() {
				var pagerCount = 7;
				var currentPage = Number(this.currentPage);
				var pageCount = Number(this.pageCount);
				var showPrevMore = false;
				var showNextMore = false;
				if (pageCount > pagerCount) {
					if (currentPage > pagerCount - 2) {
						showPrevMore = true;
					}
					if (currentPage < pageCount - 2) {
						showNextMore = true;
					}
				}
				var array = [];
				if (showPrevMore && !showNextMore) {
					var startPage = pageCount - (pagerCount - 2);
					for (var i = startPage; i < pageCount; i++) {
						array.push(i);
					}
				} else if (!showPrevMore && showNextMore) {
					for (var i = 2; i < pagerCount; i++) {
						array.push(i);
					}
				} else if (showPrevMore && showNextMore) {
					var offset = Math.floor(pagerCount / 2) - 1;
					for (var i = currentPage - offset ; i <= currentPage + offset; i++) {
						array.push(i);
					}
				} else {
					for (var i = 2; i < pageCount; i++) {
						array.push(i);
					}
				}
				this.showPrevMore = showPrevMore;
				this.showNextMore = showNextMore;
				return array;
			}
		},
		data: function() {
			return {
				current: null,
				showPrevMore: false,
				showNextMore: false,
				quicknextIconClass: 'vue-icon-more',
				quickprevIconClass: 'vue-icon-more'
			};
		}
	};
	var VuePagination = {
		name: 'VuePagination',
		props: {
			pageSize: {
				type: Number,
				default: 10
			},
			small: Boolean,
			total: Number,
			pageCount: Number,
			currentPage: {
				type: Number,
				default: 1
			},
			layout: {
				default: 'prev, pager, next, jumper, ->, total'
			},
			pageSizes: {
				type: Array,
				default: function() {
					return [10, 20, 30, 40, 50, 100];
				}
			}
		},
		data: function() {
			return {
				internalCurrentPage: 1,
				internalPageSize: 0
			};
		},
		render: function(createElement) {
			var self = this;
			var template = createElement('div', {class: 'vue-pagination'}, []);
			var layout = self.layout || '';
			if (!layout) return;
			var TEMPLATE_MAP = {
				prev: createElement('prev', null, []),
				jumper: createElement('jumper', null, []),
				pager: createElement('pager', {attrs: {currentPage: self.internalCurrentPage,pageCount: self.internalPageCount}, on: {change: self.handleCurrentChange}}, []),
				next: createElement('next', null, []),
				sizes: createElement('sizes', {attrs: {pageSizes: self.pageSizes}}, []),
				slot: createElement('my-slot', null, []),
				total: createElement('total', null, [])
			};
			var components = layout.split(',').map(function(item){return item.trim();});
			var rightWrapper = createElement('div', {class: 'vue-pagination__rightwrapper'}, []);
			var haveRightWrapper = false;
			if (self.small) {
				template.data.class += ' vue-pagination--small';
			}
			components.forEach(function(compo) {
				if (compo === '->') {
					haveRightWrapper = true;
					return;
				}
				if (!haveRightWrapper) {
					template.children.push(TEMPLATE_MAP[compo]);
				} else {
					rightWrapper.children.push(TEMPLATE_MAP[compo]);
				}
			});
			if (haveRightWrapper) {
				template.children.push(rightWrapper);
			}
			return template;
		},
		components: {
			MySlot: {
				render: function(createElement) {
					return this.$parent.$slots.default ? this.$parent.$slots.default[0] : '';
				}
			},
			Prev: {
				render: function(createElement) {
					return createElement('button',{ attrs: {type: 'button'}, class: ['btn-prev', {disabled: this.$parent.internalCurrentPage <= 1}], on: { click: this.$parent.prev} }, [createElement('i', {class: 'vue-icon vue-icon-arrow-left'}, [])]);
				}
			},
			Next: {
				render: function(createElement) {
					return createElement('button', {attrs: {type: 'button'}, class: ['btn-next', {disabled: this.$parent.internalCurrentPage === this.$parent.internalPageCount || 0 === this.$parent.internalPageCount}], on: {click: this.$parent.next}}, [createElement('i', {class: 'vue-icon vue-icon-arrow-right'}, [])]);
				}
			},
			Sizes: {
				props: {
					pageSizes: Array
				},
				watch: {
					pageSizes: {
						immediate: true,
						handler: function(value) {
							if (Array.isArray(value)) {
								this.$parent.internalPageSize = value.indexOf(this.$parent.pageSize) > -1 ? this.$parent.pageSize : this.pageSizes[0];
							}
						}
					}
				},
				render: function(createElement) {
					var self = this;
					return createElement('span', {class: 'vue-pagination__sizes'}, [createElement('vue-select', {attrs: {value: this.$parent.internalPageSize}, on: {input: this.handleChange}}, [this.pageSizes.map(function (item) {return createElement('vue-option', {attrs: {value: item, label: item + ' ' + self.$t('vue.pagination.pagesize')}}, [])})])]);
				},
				methods: {
					handleChange: function(val) {
						if (val !== this.$parent.internalPageSize) {
							this.$parent.internalPageSize = val = parseInt(val, 10);
							this.$parent.$emit('size-change', val);
						}
					}
				}
			},
			Jumper: {
				data: function() {
					return {
						oldValue: null
					};
				},
				methods: {
					handleFocus: function(event) {
						this.oldValue = event.target.value;
					},
					handleChange: function(event) {
						this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(event.target.value);
						this.oldValue = null;
					}
				},
				render: function(createElement) {
					return createElement('span', {class: 'vue-pagination__jump'}, [this.$t('vue.pagination.goto'), createElement('input', {class: 'vue-pagination__editor', attrs: {type: 'number', min: 1, max: this.$parent.internalPageCount, number: !0}, domProps: {value: this.$parent.internalCurrentPage}, on: {change: this.handleChange, focus: this.handleFocus}, style: {width: '30px'}}, []), this.$t('vue.pagination.pageClassifier')]);
				}
			},
			Total: {
				render: function(createElement) {
					return 'number' == typeof this.$parent.total ? createElement('span', {class: 'vue-pagination__total'}, [this.$t('vue.pagination.total', {total: this.$parent.total})]) : '';
				}
			},
			Pager: VuePager
		},
		methods: {
			handleCurrentChange: function(val) {
				this.internalCurrentPage = this.getValidCurrentPage(val);
			},
			prev: function() {
				var newVal = this.internalCurrentPage - 1;
				this.internalCurrentPage = this.getValidCurrentPage(newVal);
			},
			next: function() {
				var newVal = this.internalCurrentPage + 1;
				this.internalCurrentPage = this.getValidCurrentPage(newVal);
			},
			getValidCurrentPage: function(value) {
				value = parseInt(value, 10);
				var havePageCount = typeof this.internalPageCount === 'number';
				var resetValue;
				if (!havePageCount) {
					if (isNaN(value) || value < 1) resetValue = 1;
				} else {
					if (value < 1) {
						resetValue = 1;
					} else if (value > this.internalPageCount) {
						resetValue = this.internalPageCount;
					}
				}
				if (resetValue === undefined && isNaN(value)) {
					resetValue = 1;
				} else if (resetValue === 0) {
					resetValue = 1;
				}
				return resetValue === undefined ? value : resetValue;
			}
		},
		computed: {
			internalPageCount: function() {
				if (typeof this.total === 'number') {
					return Math.ceil(this.total / this.internalPageSize);
				} else if (typeof this.pageCount === 'number') {
					return this.pageCount;
				}
				return null;
			}
		},
		watch: {
			currentPage: {
				immediate: true,
				handler: function(val) {
					this.internalCurrentPage = val;
				}
			},
			pageSize: {
				immediate: true,
				handler: function(val) {
					this.internalPageSize = val;
				}
			},
			internalCurrentPage: function(newVal, oldVal) {
				var self = this;
				newVal = parseInt(newVal, 10);
				if (isNaN(newVal)) {
					newVal = oldVal || 1;
				} else {
					newVal = self.getValidCurrentPage(newVal);
				}
				if (newVal !== undefined) {
					self.$nextTick(function() {
						self.internalCurrentPage = newVal;
						if (oldVal !== newVal) {
							self.$emit('current-change', self.internalCurrentPage);
						}
					});
				} else {
					self.$emit('current-change', self.internalCurrentPage);
				}
			},
			internalPageCount: function(newVal) {
				var oldPage = this.internalCurrentPage;
				if (newVal > 0 && oldPage === 0) {
					this.internalCurrentPage = 1;
				} else if (oldPage > newVal) {
					this.internalCurrentPage = newVal === 0 ? 1 : newVal;
				}
			}
		}
	};
	Vue.component(VuePagination.name, VuePagination);
});
