!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueTableColumn', this, function(Vue, VueUtil) {
	'use strict';
	var columnIdSeed = 1;
	var defaults = {
		default: {
			order: ''
		},
		selection: {
			width: 48,
			minWidth: 48,
			realWidth: 48,
			order: '',
			className: 'vue-table-column--selection'
		},
		expand: {
			width: 48,
			minWidth: 48,
			realWidth: 48,
			order: ''
		},
		index: {
			width: 48,
			minWidth: 48,
			realWidth: 48,
			order: ''
		}
	};
	var forced = {
		selection: {
			property: 'selection column',
			renderHeader: function(createElement) {
				return createElement('vue-checkbox', {
					nativeOn: {
						click: this.toggleAllSelection
					},
					attrs: {
						value: this.isAllSelected
					}
				}, []);
			},
			renderCell: function(createElement, data) {
				var row = data.row;
				var column = data.column;
				var store = data.store;
				var index = data.$index;
				return createElement('vue-checkbox', {
					attrs: {
						disabled: !!column.selectable && !column.selectable.call(null, row, index),
						value: store.isSelected(row)
					},
					on: {
						input: function() {
							store.commit('rowSelectedChanged', row)
						}
					}
				}, []);
			},
			sortable: false,
			resizable: false
		},
		index: {
			property: 'index column',
			renderHeader: function(createElement, data) {
				return '#';
			},
			renderCell: function(createElement, data) {
				var n = data.$index;
				return createElement('div', null, [n + 1])
			},
			sortable: false
		},
		expand: {
			property: 'expand column',
			renderHeader: function(createElement, data) {
				return '';
			},
			renderCell: function(createElement, data, proxy) {
				var row = data.row;
				var store = data.store;
				var expanded = store.states.expandRows.indexOf(row) > -1;
				return createElement('div', {
					class: 'vue-table__expand-icon ' + (expanded ? 'vue-table__expand-icon--expanded' : ''),
					on: {
						click: function() {
							return proxy.handleExpandClick(row)
						}
					}
				}, [createElement('i', {
					class: 'vue-icon vue-icon-arrow-right'
				}, [])])
			},
			sortable: false,
			resizable: false,
			className: 'vue-table__expand-column'
		}
	};
	var getValueByPath = function(object, prop) {
		prop = prop || '';
		var paths = prop.split('.');
		var current = object;
		var result = null;
		for (var i = 0, j = paths.length; i < j; i++) {
			var path = paths[i];
			if (!current)
				break;
			if (i === j - 1) {
				result = current[path];
				break;
			}
			current = current[path];
		}
		return result;
	};
	var getDefaultColumn = function(type, options) {
		var column = {};
		VueUtil.merge(column, defaults[type || 'default']);
		for (var name in options) {
			if (options.hasOwnProperty(name)) {
				var value = options[name];
				if (typeof value !== 'undefined') {
					column[name] = value;
				}
			}
		}
		column.realWidth = column.width || column.minWidth;
		return column;
	};
	var DEFAULT_RENDER_CELL = function(createElement, data) {
		var row = data.row;
		var column = data.column;
		var property = column.property;
		var value = property && property.indexOf('.') === -1 ? row[property] : getValueByPath(row, property);
		if (column && column.formatter) {
			return column.formatter(row, column, value);
		}
		return value;
	};
	var VueTableColumn = {
		name: 'VueTableColumn',
		props: {
			type: {
				type: String,
				default: 'default'
			},
			label: String,
			className: [String, Function],
			labelClassName: String,
			property: String,
			prop: String,
			width: {},
			minWidth: {},
			renderHeader: Function,
			sortable: {
				type: [String, Boolean],
				default: false
			},
			sortMethod: Function,
			resizable: {
				type: Boolean,
				default: true
			},
			context: {},
			columnKey: String,
			align: String,
			headerAlign: String,
			showTooltipWhenOverflow: Boolean,
			showOverflowTooltip: Boolean,
			fixed: [Boolean, String],
			formatter: Function,
			selectable: Function,
			reserveSelection: Boolean,
			visible: {
				type: Boolean,
				default: true
			},
			filterMethod: Function,
			filteredValue: Array,
			filters: Array,
			filterPlacement: String,
			filterMultiple: {
				type: Boolean,
				default: true
			}
		},
		data: function() {
			return {
				isSubColumn: false,
				columns: []
			};
		},
		beforeCreate: function() {
			this.row = {};
			this.column = {};
			this.$index = 0;
		},
		computed: {
			owner: function() {
				var parent = this.$parent;
				while (parent && !parent.tableId) {
					parent = parent.$parent;
				}
				return parent;
			}
		},
		created: function() {
			var slots = this.$slots.default;
			this.customRender = this.$options.render;
			this.$options.render = function(createElement) {
				return createElement('div', slots)
			}
			var columnId = this.columnId = this.columnKey || ((this.$parent.tableId || (this.$parent.columnId + '_')) + 'column_' + columnIdSeed++);
			var parent = this.$parent;
			var owner = this.owner;
			this.isSubColumn = owner !== parent;
			var type = this.type;
			var width = this.width;
			if (width !== undefined) {
				width = parseInt(width, 10);
				if (isNaN(width)) {
					width = null;
				}
			}
			var minWidth = this.minWidth;
			if (minWidth !== undefined) {
				minWidth = parseInt(minWidth, 10);
				if (isNaN(minWidth)) {
					minWidth = 80;
				}
			}
			var isColumnGroup = false;
			var column = getDefaultColumn(type, {
				id: columnId,
				label: this.label,
				className: this.className,
				labelClassName: this.labelClassName,
				property: this.prop || this.property,
				type: type,
				renderCell: null,
				renderHeader: this.renderHeader,
				minWidth: minWidth,
				width: width,
				visible: this.visible,
				isColumnGroup: isColumnGroup,
				context: this.context,
				align: this.align ? 'is-' + this.align : null,
				headerAlign: this.headerAlign ? 'is-' + this.headerAlign : 'is-center',
				sortable: this.sortable === '' ? true : this.sortable,
				sortMethod: this.sortMethod,
				resizable: this.resizable,
				showOverflowTooltip: this.showOverflowTooltip || this.showTooltipWhenOverflow,
				formatter: this.formatter,
				selectable: this.selectable,
				reserveSelection: this.reserveSelection,
				fixed: this.fixed === '' ? true : this.fixed,
				fixedIndex: -1,
				filterMethod: this.filterMethod,
				filters: this.filters,
				filterable: this.filters || this.filterMethod,
				filterMultiple: this.filterMultiple,
				filterOpened: false,
				filteredValue: this.filteredValue || [],
				filterPlacement: this.filterPlacement || 'bottom',
				getCellClass: function(rowIndex, cellIndex, rowData) {
					var classes = [];
					var className = this.className;
					if (typeof className === 'string') {
						classes.push(className);
					} else if (typeof className === 'function') {
						classes.push(className.call(null, rowIndex, cellIndex, rowData) || '');
					}
					return classes.join(' ');
				}
			});
			VueUtil.merge(column, forced[type] || {});
			this.columnConfig = column;
			var renderCell = column.renderCell;
			var self = this;
			if (type === 'expand') {
				owner.renderExpanded = function(createElement, data) {
					return self.$scopedSlots.default ? self.$scopedSlots.default(data) : self.$slots.default;
				}
				column.renderCell = function(createElement, data) {
					return createElement('div', {
						class: 'cell'
					}, [renderCell(createElement, data, this._renderProxy)]);
				}
				return;
			}
			column.renderCell = function(createElement, data) {
				if (self.$vnode.data.inlineTemplate) {
					renderCell = function() {
						data.self = self.context || data.self;
						if (Object.prototype.toString.call(data.self) === '[object Object]') {
							for (var prop in data.self) {
								if (!data.hasOwnProperty(prop)) {
									data[prop] = data.self[prop];
								}
							}
						}
						data._staticTrees = self._staticTrees;
						data.$options.staticRenderFns = self.$options.staticRenderFns;
						return self.customRender.call(data);
					}
				} else if (self.$scopedSlots.default) {
					renderCell = function() {
						return self.$scopedSlots.default(data);
					}
				}
				if (!renderCell) {
					renderCell = DEFAULT_RENDER_CELL;
				}
				return self.showOverflowTooltip || self.showTooltipWhenOverflow ? createElement('div',
				{ 'class': 'cell vue-tooltip', style: 'width:' + (data.column.realWidth || data.column.width) + 'px' },
				[renderCell(createElement, data)]) : createElement('div', {
					class: 'cell'
				}, [renderCell(createElement, data)]);
			}
		},
		destroyed: function() {
			if (!this.$parent)
				return;
			this.owner.store.commit('removeColumn', this.columnConfig);
		},
		watch: {
			label: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.label = newVal;
				}
			},
			prop: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.property = newVal;
				}
			},
			property: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.property = newVal;
				}
			},
			filters: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.filters = newVal;
				}
			},
			filterMultiple: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.filterMultiple = newVal;
				}
			},
			align: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.align = newVal ? 'is-' + newVal : null;
					if (!this.headerAlign) {
						this.columnConfig.headerAlign = newVal ? 'is-' + newVal : null;
					}
				}
			},
			headerAlign: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.headerAlign = 'is-' + (newVal ? newVal : this.align);
				}
			},
			width: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.width = newVal;
					this.owner.store.scheduleLayout();
				}
			},
			minWidth: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.minWidth = newVal;
					this.owner.store.scheduleLayout();
				}
			},
			fixed: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.fixed = newVal;
					this.owner.store.scheduleLayout();
				}
			},
			sortable: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.sortable = newVal;
				}
			},
			visible: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.visible = newVal;
					this.owner.store.scheduleLayout();
				}
			}
		},
		mounted: function() {
			var owner = this.owner;
			var parent = this.$parent;
			var columnIndex;
			if (!this.isSubColumn) {
				columnIndex = [].indexOf.call(parent.$refs.hiddenColumns.children, this.$el);
			} else {
				columnIndex = [].indexOf.call(parent.$el.children, this.$el);
			}
			owner.store.commit('insertColumn', this.columnConfig, columnIndex, this.isSubColumn ? parent.columnConfig : null);
		}
	};
	Vue.component(VueTableColumn.name, VueTableColumn);
});
