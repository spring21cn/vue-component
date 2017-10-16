!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueTree', this, function(Vue, VueUtil) {
	'use strict';
	var NODE_KEY = '$treeNodeId';
	var markNodeData = function(node, data) {
		if (data[NODE_KEY])
			return;
		Object.defineProperty(data, NODE_KEY, {
			value: node.id,
			enumerable: false,
			configurable: false,
			writable: false
		});
	};
	var getNodeKey = function(key, data) {
		if (!key)
			return data[NODE_KEY];
		return data[key];
	};
	var getChildState = function(node) {
		var all = true;
		var none = true;
		var allWithoutDisable = true;
		for (var i = 0, j = node.length; i < j; i++) {
			var n = node[i];
			if (n.checked !== true || n.indeterminate) {
				all = false;
				if (!n.disabled) {
					allWithoutDisable = false;
				}
			}
			if (n.checked !== false || n.indeterminate) {
				none = false;
			}
		}
		return {
			all: all,
			none: none,
			allWithoutDisable: allWithoutDisable,
			half: !all && !none
		};
	};
	var reInitChecked = function(node) {
		var childState = getChildState(node.childNodes);
		var all = childState.all;
		var none = childState.none;
		var half = childState.half;
		if (all) {
			node.checked = true;
			node.indeterminate = false;
		} else if (half) {
			node.checked = false;
			node.indeterminate = true;
		} else if (none) {
			node.checked = false;
			node.indeterminate = false;
		}
		var parent = node.parent;
		if (!parent || parent.level === 0) return;
		if (!node.store.checkStrictly) {
			reInitChecked(parent);
		}
	};
	var initLazyLoadChild = function(node) {
		var childNodes = node.childNodes;
		if (node.checked) {
			for (var i = 0, j = childNodes.length; i < j; i++) {
				var child = childNodes[i];
				if (!child.disabled) {
					child.checked = true;
				}
			}
		}
		var parent = node.parent;
		if (!parent || parent.level === 0) return;
		reInitChecked(parent);
	};
	var getPropertyFromData = function(node, prop) {
		var props = node.store.props;
		var data = node.data || {};
		var config = props[prop];
		if (typeof config === 'function') {
			return config(data, node);
		} else if (typeof config === 'string') {
			return data[config];
		} else if (typeof config === 'undefined') {
			return '';
		}
	};
	var nodeIdSeed = 0;
	var Node = function(options) {
		this.id = nodeIdSeed++;
		this.text = null;
		this.checked = false;
		this.indeterminate = false;
		this.data = null;
		this.expanded = false;
		this.parent = null;
		this.visible = true;
		for (var name in options) {
			if (options.hasOwnProperty(name)) {
				this[name] = options[name];
			}
		}
		this.level = 0;
		this.loaded = false;
		this.childNodes = [];
		this.loading = false;
		this.label = this.getLabel();
		this.icon = this.getIcon();
		this.key = this.getKey();
		this.disabled = this.getDisabled();
		if (this.parent) {
			this.level = this.parent.level + 1;
		}
		var store = this.store;
		if (!store) {
			throw new Error('[Node]store is required!');
		}
		store.registerNode(this);
		var props = store.props;
		if (props && typeof props.isLeaf !== 'undefined') {
			var isLeaf = getPropertyFromData(this, 'isLeaf');
			if (typeof isLeaf === 'boolean') {
				this.isLeafByUser = isLeaf;
			}
		}
		if (store.lazy !== true && this.data) {
			this.setData(this.data);
			if (store.defaultExpandAll) {
				this.expanded = true;
			}
		} else if (this.level > 0 && store.lazy && store.defaultExpandAll) {
			this.expand();
		}
		if (!this.data)
			return;
		var defaultExpandedKeys = store.defaultExpandedKeys;
		var key = store.key;
		if (key && defaultExpandedKeys && defaultExpandedKeys.indexOf(this.key) !== -1) {
			this.expand(null, store.autoExpandParent);
		}
		if (key && store.currentNodeKey && this.key === store.currentNodeKey) {
			store.currentNode = this;
		}
		if (store.lazy) {
			store._initDefaultCheckedNode(this);
		}
		this.updateLeafState();
	};
	Node.prototype.setData = function(data) {
		var self = this;
		if (!Array.isArray(data)) {
			markNodeData(self, data);
		}
		self.data = data;
		self.childNodes = [];
		var children;
		if (self.level === 0 && self.data instanceof Array) {
			children = self.data;
		} else {
			children = getPropertyFromData(self, 'children') || [];
		}
		for (var i = 0, j = children.length; i < j; i++) {
			self.insertChild({
				data: children[i]
			});
		}
	};
	Node.prototype.getLabel = function() {
		return getPropertyFromData(this, 'label');
	};
	Node.prototype.getIcon = function(node) {
		return getPropertyFromData(this, 'icon');
	};
	Node.prototype.getDisabled = function() {
		return getPropertyFromData(this, 'disabled');
	};
	Node.prototype.getKey = function() {
		var self = this;
		var nodeKey = self.store.key;
		if (self.data)
			return self.data[nodeKey];
		return null;
	};
	Node.prototype.insertChild = function(child, index) {
		var self = this;
		if (!child)
			throw new Error('insertChild error: child is required.');
		if (!(child instanceof Node)) {
			VueUtil.merge(child, {
				parent: self,
				store: self.store
			});
			child = new Node(child);
		}
		child.level = self.level + 1;
		if (typeof index === 'undefined' || index < 0) {
			self.childNodes.push(child);
		} else {
			self.childNodes.splice(index, 0, child);
		}
		self.updateLeafState();
	};
	Node.prototype.insertBefore = function(child, ref) {
		var self = this;
		var index;
		if (ref) {
			index = self.childNodes.indexOf(ref);
		}
		self.insertChild(child, index);
	};
	Node.prototype.insertAfter = function(child, ref) {
		var self = this;
		var index;
		if (ref) {
			index = self.childNodes.indexOf(ref);
			if (index !== -1)
				index += 1;
		}
		self.insertChild(child, index);
	};
	Node.prototype.removeChild = function(child) {
		var self = this;
		var index = self.childNodes.indexOf(child);
		if (index > -1) {
			self.store && self.store.deregisterNode(child);
			child.parent = null;
			self.childNodes.splice(index, 1);
		}
		self.updateLeafState();
	};
	Node.prototype.removeChildByData = function(data) {
		var self = this;
		var targetNode = null;
		self.childNodes.forEach(function(node) {
			if (node.data === data) {
				targetNode = node;
			}
		});
		if (targetNode) {
			self.removeChild(targetNode);
		}
	};
	Node.prototype.expand = function(callback, expandParent) {
		var self = this;
		var done = function() {
			if (expandParent) {
				var parent = self.parent;
				while (parent.level > 0) {
					parent.expanded = true;
					parent = parent.parent;
				}
			}
			self.expanded = true;
			if (callback)
				callback();
		};
		if (self.shouldLoadData()) {
			self.loadData(function(data) {
				if (data instanceof Array) {
					initLazyLoadChild(self);
					done();
				}
			});
		} else {
			done();
		}
	};
	Node.prototype.doCreateChildren = function(array, defaultProps) {
		var self = this;
		defaultProps = defaultProps || {};
		array.forEach(function(item) {
			self.insertChild(VueUtil.merge({
				data: item
			}, defaultProps));
		});
	};
	Node.prototype.collapse = function() {
		this.expanded = false;
	}
	Node.prototype.shouldLoadData = function() {
		return this.store.lazy === true && this.store.load && !this.loaded;
	};
	Node.prototype.updateLeafState = function() {
		var self = this;
		if (self.store.lazy === true && self.loaded !== true && typeof self.isLeafByUser !== 'undefined') {
			self.isLeaf = selfk.isLeafByUser;
			return;
		}
		var childNodes = self.childNodes;
		if (!self.store.lazy || (self.store.lazy === true && self.loaded === true)) {
			self.isLeaf = !childNodes || childNodes.length === 0;
			return;
		}
		self.isLeaf = false;
	};
	Node.prototype.setChecked = function(value, deep, recursion, passValue) {
		var self = this;
		self.indeterminate = value === 'half';
		self.checked = value === true;
		var selfChildState = getChildState(self);
		var all = selfChildState.all;
		var allWithoutDisable = selfChildState.allWithoutDisable;
		if (self.childNodes.length && !all && allWithoutDisable) {
			self.checked = false;
			value = false;
		}
		var handleDescendants = function(lazy) {
			if (deep && !lazy) {
				var childNodes = self.childNodes;
				for (var i = 0, j = childNodes.length; i < j; i++) {
					var child = childNodes[i];
					passValue = passValue || value !== false;
					var isCheck = child.disabled ? child.checked : passValue;
					child.setChecked(isCheck, deep, true, passValue);
				}
				var childState = getChildState(childNodes);
				var half = childState.half;
				var all = childState.all;
				if (!all) {
					self.checked = all;
					self.indeterminate = half;
				}
			}
		};
		if (!self.store.checkStrictly && self.shouldLoadData()) {
			self.loadData(function() {
				handleDescendants(true);
			}, {
				checked: value !== false
			});
		} else {
			handleDescendants();
		}
		var parent = self.parent;
		if (!parent || parent.level === 0) return;
		if (!self.store.checkStrictly && !recursion) {
			reInitChecked(parent);
		}
	};
	Node.prototype.getChildren = function() {
		var self = this;
		var data = self.data;
		if (!data) return null;
		var props = self.store.props;
		var children = 'children';
		if (props) {
			children = props.children || 'children';
		}
		if (data[children] === undefined) {
			data[children] = null;
		}
		return data[children];
	};
	Node.prototype.updateChildren = function() {
		var self = this;
		var newData = self.getChildren() || [];
		var oldData = self.childNodes.map(function(node) {
			return node.data;
		});
		var newDataMap = {};
		var newNodes = [];
		newData.forEach(function(item, index) {
			if (item[NODE_KEY]) {
				newDataMap[item[NODE_KEY]] = {
					index: index,
					data: item
				};
			} else {
				newNodes.push({
					index: index,
					data: item
				});
			}
		});
		oldData.forEach(function(item) {
			if (!newDataMap[item[NODE_KEY]])
				self.removeChildByData(item);
		});
		newNodes.forEach(function(args) {
			var index = args.index;
			var data = args.data;
			self.insertChild({
				data: data
			}, index);
		});
		self.updateLeafState();
	};
	Node.prototype.loadData = function(callback, defaultProps) {
		var self = this;
		defaultProps = defaultProps || {}
		if (self.store.lazy === true && self.store.load && !self.loaded && (!self.loading || Object.keys(defaultProps).length)) {
			self.loading = true;
			var resolve = function(children) {
				self.loaded = true;
				self.loading = false;
				self.childNodes = [];
				self.doCreateChildren(children, defaultProps);
				self.updateLeafState();
				if (callback) {
					callback.call(self, children);
				}
			};
			self.store.load(self, resolve);
		} else {
			if (callback) {
				callback.call(self);
			}
		}
	};
	var TreeStore = function(options) {
		var self = this;
		self.currentNode = null;
		self.currentNodeKey = null;
		for (var option in options) {
			if (options.hasOwnProperty(option)) {
				self[option] = options[option];
			}
		}
		self.nodesMap = {};
		self.root = new Node({
			data: self.data,
			store: self
		});
		if (self.lazy && self.load) {
			var loadFn = self.load;
			loadFn(self.root, function(data) {
				self.root.doCreateChildren(data);
				self._initDefaultCheckedNodes();
			});
		} else {
			self._initDefaultCheckedNodes();
		}
	};
	TreeStore.prototype.filter = function(value) {
		var self = this;
		var filterNodeMethod = self.filterNodeMethod;
		var traverse = function(node) {
			var childNodes = node.root ? node.root.childNodes : node.childNodes;
			childNodes.forEach(function(child) {
				child.visible = filterNodeMethod.call(child, value, child.data, child);
				traverse(child);
			});
			if (!node.visible && childNodes.length) {
				var allHidden = true;
				childNodes.forEach(function(child) {
					if (child.visible)
						allHidden = false;
				});
				if (node.root) {
					node.root.visible = allHidden === false;
				} else {
					node.visible = allHidden === false;
				}
			}
			if (node.visible && !node.isLeaf)
				node.expand();
		};
		traverse(self);
	};
	TreeStore.prototype.setData = function(newVal) {
		var self = this;
		var instanceChanged = newVal !== self.root.data;
		self.root.setData(newVal);
		if (instanceChanged) {
			self._initDefaultCheckedNodes();
		}
	};
	TreeStore.prototype.getNode = function(data) {
		var self = this;
		var key = typeof data !== 'object' ? data : getNodeKey(self.key, data);
		return self.nodesMap[key];
	};
	TreeStore.prototype.insertBefore = function(data, refData) {
		var self = this;
		var refNode = self.getNode(refData);
		refNode.parent.insertBefore({
			data: data
		}, refNode);
	};
	TreeStore.prototype.insertAfter = function(data, refData) {
		var self = this;
		var refNode = self.getNode(refData);
		refNode.parent.insertAfter({
			data: data
		}, refNode);
	};
	TreeStore.prototype.remove = function(data) {
		var self = this;
		var node = self.getNode(data);
		if (node && node.parent) {
			node.parent.removeChild(node);
		}
	};
	TreeStore.prototype.append = function(data, parentData) {
		var self = this;
		var parentNode = parentData ? self.getNode(parentData) : self.root;
		if (parentNode) {
			parentNode.insertChild({
				data: data
			});
		}
	};
	TreeStore.prototype._initDefaultCheckedNodes = function() {
		var self = this;
		var defaultCheckedKeys = self.defaultCheckedKeys || [];
		var nodesMap = self.nodesMap;
		defaultCheckedKeys.forEach(function(checkedKey) {
			var node = nodesMap[checkedKey];
			if (node) {
				node.setChecked(true, !self.checkStrictly);
			}
		});
	};
	TreeStore.prototype._initDefaultCheckedNode = function(node) {
		var self = this;
		var defaultCheckedKeys = self.defaultCheckedKeys || [];
		var nodeKey = node.key || node.getKey();
		if (defaultCheckedKeys.indexOf(nodeKey) !== -1) {
			node.setChecked(true, !self.checkStrictly);
		}
	};
	TreeStore.prototype.setDefaultCheckedKey = function(newVal) {
		var self = this;
		if (newVal !== self.defaultCheckedKeys) {
			self.defaultCheckedKeys = newVal;
			self._initDefaultCheckedNodes();
		}
	};
	TreeStore.prototype.registerNode = function(node) {
		var self = this;
		var key = self.key;
		if (!key || !node || !node.data)
			return;
		var nodeKey = node.key || node.getKey();
		if (nodeKey)
			self.nodesMap[nodeKey] = node;
	};
	TreeStore.prototype.deregisterNode = function(node) {
		var self = this;
		var key = self.key;
		if (!key || !node || !node.data)
			return;
		var nodeKey = node.key || node.getKey();
		delete self.nodesMap[nodeKey];
	};
	TreeStore.prototype.getCheckedNodes = function() {
		var self = this;
		var leafOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var checkedNodes = [];
		var traverse = function(node) {
			var childNodes = node.root ? node.root.childNodes : node.childNodes;
			childNodes.forEach(function(child) {
				if ((!leafOnly && child.checked) || (leafOnly && child.isLeaf && child.checked)) {
					checkedNodes.push(child.data);
				}
				traverse(child);
			});
		};
		traverse(self);
		return checkedNodes;
	};
	TreeStore.prototype.getCheckedKeys = function() {
		var self = this;
		var leafOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var key = self.key;
		var allNodes = self._getAllNodes();
		var keys = [];
		allNodes.forEach(function(node) {
			if (!leafOnly || (leafOnly && node.isLeaf)) {
				if (node.checked) {
					keys.push((node.data || {})[key]);
				}
			}
		});
		return keys;
	};
	TreeStore.prototype._getAllNodes = function() {
		var self = this;
		var allNodes = [];
		var nodesMap = self.nodesMap;
		for (var nodeKey in nodesMap) {
			if (nodesMap.hasOwnProperty(nodeKey)) {
				allNodes.push(nodesMap[nodeKey]);
			}
		}
		return allNodes;
	};
	TreeStore.prototype._setCheckedKeys = function(key) {
		var self = this;
		var leafOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var checkedKeys = arguments[2];
		var allNodes = self._getAllNodes().sort(function(a, b){return b.level - a.level});
		var cache = Object.create(null);
		var keys = Object.keys(checkedKeys);
		allNodes.forEach(function(node){return node.setChecked(false, false)});
		for (var i = 0, j = allNodes.length; i < j; i++) {
			var node = allNodes[i];
			var nodeKey = node.data[key].toString();
			var checked = keys.indexOf(nodeKey) > -1;
			if (!checked) {
				if (node.checked && !cache[nodeKey]) {
					node.setChecked(false, false);
				}
				continue;
			}
			var parent = node.parent;
			while (parent && parent.level > 0) {
				cache[parent.data[key]] = true;
				parent = parent.parent;
			}
			if (node.isLeaf || self.checkStrictly) {
				node.setChecked(true, false);
				continue;
			}
			node.setChecked(true, true);
			if (leafOnly) {
				node.setChecked(false, false);
				var traverse = function(node) {
					var childNodes = node.childNodes;
					childNodes.forEach(function(child) {
						if (!child.isLeaf) {
							child.setChecked(false, false);
						}
						traverse(child);
					});
				};
				traverse(node);
			}
		}
	};
	TreeStore.prototype.setCheckedNodes = function(array) {
		var self = this;
		var leafOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var key = self.key;
		var checkedKeys = {};
		array.forEach(function(item) {
			checkedKeys[(item || {})[key]] = true;
		});
		self._setCheckedKeys(key, leafOnly, checkedKeys);
	};
	TreeStore.prototype.setCheckedKeys = function(keys, leafonly) {
		var self = this;
		var leafOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		self.defaultCheckedKeys = keys;
		var key = self.key;
		var checkedKeys = {};
		keys.forEach(function(key) {
			checkedKeys[key] = true;
		});
		self._setCheckedKeys(key, leafOnly, checkedKeys);
	};
	TreeStore.prototype.setDefaultExpandedKeys = function(keys) {
		var self = this;
		keys = keys || [];
		self.defaultExpandedKeys = keys;
		keys.forEach(function(key) {
			var node = self.getNode(key);
			if (node)
				node.expand(null, self.autoExpandParent);
		});
	};
	TreeStore.prototype.setChecked = function(data, checked, deep) {
		var self = this;
		var node = self.getNode(data);
		if (node) {
			node.setChecked(!!checked, deep);
		}
	};
	TreeStore.prototype.getCurrentNode = function() {
		return this.currentNode;
	};
	TreeStore.prototype.setCurrentNode = function(node) {
		this.currentNode = node;
	};
	TreeStore.prototype.setCurrentNodeKey = function(key) {
		var self = this;
		if (!key) {
			self.currentNode = null;
		} else {
			var node = self.getNode(key);
			if (node) {
				self.currentNode = node;
			}
		}
	};
	var VueTreeNode = {
		template: '<div class="vue-tree-node" @click.stop="handleClick" v-show="node.visible" :class="{\'is-expanded\': childNodeRendered && expanded,\'is-current\': tree.store.currentNode === node,\'is-hidden\': !node.visible}"><div class="vue-tree-node__content" :style="{ \'padding-left\': (node.level - 1) * tree.indent + \'px\' }"><span class="vue-tree-node__expand-icon" @click.stop="handleExpandIconClick" :class="{ \'is-leaf\': node.isLeaf, expanded: !node.isLeaf && expanded }"></span><vue-checkbox v-if="showCheckbox" v-model="node.checked" :indeterminate="node.indeterminate" :disabled="!!node.disabled" @change="handleCheckChange"></vue-checkbox><span v-if="node.loading" class="vue-tree-node__loading-icon vue-icon-loading"></span><node-content :node="node"></node-content></div><collapse-transition><div class="vue-tree-node__children" v-show="expanded"><vue-tree-node :render-content="renderContent" v-for="child in node.childNodes" :key="getNodeKey(child)" :node="child" @node-expand="handleChildNodeExpand"></vue-tree-node></div></collapse-transition></div>',
		name: 'VueTreeNode',
		componentName: 'VueTreeNode',
		mixins: [VueUtil.component.emitter],
		props: {
			node: {
				default: function() {
					return {};
				}
			},
			props: {},
			renderContent: Function
		},
		components: {
			CollapseTransition: VueUtil.component.collapseTransition,
			NodeContent: {
				props: {
					node: {
						required: true
					}
				},
				render: function(createElement) {
					var parent = this.$parent;
					var node = this.node;
					var data = node.data;
					var store = node.store;
					return ( parent.renderContent ? parent.renderContent.call(parent._renderProxy, createElement, {
						_self: parent.tree.$vnode.context,
						node: node,
						data: data,
						store: store
					}) : createElement("span", {
						class: "vue-tree-node__label"
					}, [this.node.label])) ;
				}
			}
		},
		data: function() {
			return {
				tree: null,
				expanded: false,
				childNodeRendered: false,
				showCheckbox: false,
				oldChecked: null,
				oldIndeterminate: null
			};
		},
		watch: {
			'node.indeterminate': function(val) {
				this.handleSelectChange(this.node.checked, val);
			},
			'node.checked': function(val) {
				this.handleSelectChange(val, this.node.indeterminate);
			},
			'node.expanded': function(val) {
				this.expanded = val;
				if (val) {
					this.childNodeRendered = true;
				}
			}
		},
		methods: {
			getNodeKey: function(node, index) {
				var nodeKey = this.tree.nodeKey;
				if (nodeKey && node) {
					return node.data[nodeKey];
				}
				return index;
			},
			handleSelectChange: function(checked, indeterminate) {
				if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
					this.tree.$emit('check-change', this.node.data, checked, indeterminate);
				}
				this.oldChecked = checked;
				this.indeterminate = indeterminate;
			},
			handleClick: function() {
				var store = this.tree.store;
				store.setCurrentNode(this.node);
				this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
				this.tree.currentNode = this;
				if (this.tree.expandOnClickNode) {
					this.handleExpandIconClick();
				}
				this.tree.$emit('node-click', this.node.data, this.node, this);
			},
			handleExpandIconClick: function() {
				if (this.node.isLeaf)
					return;
				if (this.expanded) {
					this.tree.$emit('node-collapse', this.node.data, this.node, this);
					this.node.collapse();
				} else {
					this.node.expand();
					this.$emit('node-expand', this.node.data, this.node, this);
				}
			},
			handleCheckChange: function(ev) {
				this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
			},
			handleChildNodeExpand: function(nodeData, node, instance) {
				this.broadcast('VueTreeNode', 'tree-node-expand', node);
				this.tree.$emit('node-expand', nodeData, node, instance);
			}
		},
		created: function() {
			var self = this;
			var parent = self.$parent;
			if (parent.isTree) {
				self.tree = parent;
			} else {
				self.tree = parent.tree;
			}
			var tree = self.tree;
			if (!tree) {
				console.warn('Can not find node\'s tree.');
			}
			var props = tree.props || {};
			var childrenKey = props['children'] || 'children';
			self.$watch('node.data.' + childrenKey, function() {
				self.node.updateChildren();
			});
			self.showCheckbox = tree.showCheckbox;
			if (self.node.expanded) {
				self.expanded = true;
				self.childNodeRendered = true;
			}
			if (self.tree.accordion) {
				self.$on('tree-node-expand', function(node) {
					if (self.node !== node) {
						self.node.collapse();
					}
				});
			}
		}
	};
	var VueTree = {
		template: '<div class="vue-tree" :class="{ \'vue-tree--highlight-current\': highlightCurrent }"><vue-tree-node v-for="child in root.childNodes" :node="child" :props="props" :key="getNodeKey(child)" :render-content="renderContent" @node-expand="handleNodeExpand"></vue-tree-node><div class="vue-tree__empty-block" v-if="!root.childNodes || root.childNodes.length === 0"><span class="vue-tree__empty-text">{{ $t(\'vue.tree.emptyText\') }}</span></div></div>',
		name: 'VueTree',
		mixins: [VueUtil.component.emitter],
		components: {
			VueTreeNode: VueTreeNode
		},
		data: function() {
			return {
				store: null,
				root: null,
				currentNode: null
			};
		},
		props: {
			data: {
				type: Array
			},
			nodeKey: String,
			checkStrictly: Boolean,
			defaultExpandAll: Boolean,
			expandOnClickNode: {
				type: Boolean,
				default: true
			},
			autoExpandParent: {
				type: Boolean,
				default: true
			},
			defaultCheckedKeys: Array,
			defaultExpandedKeys: Array,
			renderContent: Function,
			showCheckbox: {
				type: Boolean,
				default: false
			},
			props: {
				default: function() {
					return {
						children: 'children',
						label: 'label',
						icon: 'icon',
						disabled: 'disabled'
					};
				}
			},
			lazy: {
				type: Boolean,
				default: false
			},
			highlightCurrent: Boolean,
			currentNodeKey: [String, Number],
			load: Function,
			filterNodeMethod: Function,
			accordion: Boolean,
			indent: {
				type: Number,
				default: 16
			}
		},
		computed: {
			children: {
				set: function(value) {
					this.data = value;
				},
				get: function() {
					return this.data;
				}
			}
		},
		watch: {
			defaultCheckedKeys: function(newVal) {
				this.store.defaultCheckedKeys = newVal;
				this.store.setDefaultCheckedKey(newVal);
			},
			defaultExpandedKeys: function(newVal) {
				this.store.defaultExpandedKeys = newVal;
				this.store.setDefaultExpandedKeys(newVal);
			},
			currentNodeKey: function(newVal) {
				this.store.setCurrentNodeKey(newVal);
				this.store.currentNodeKey = newVal;
			},
			data: function(newVal) {
				this.store.setData(newVal);
			}
		},
		methods: {
			filter: function(value) {
				if (!this.filterNodeMethod)
					throw new Error('[Tree] filterNodeMethod is required when filter');
				this.store.filter(value);
			},
			getNodeKey: function(node, index) {
				var nodeKey = this.nodeKey;
				if (nodeKey && node) {
					return node.data[nodeKey];
				}
				return index;
			},
			getCurrentNode: function() {
				var currentNode = this.store.getCurrentNode();
				return currentNode ? currentNode.data : null;
			},
			getCurrentKey: function() {
				if (!this.nodeKey) return null;
				var currentNode = this.store.getCurrentNode();
				return currentNode ? currentNode.data[this.nodeKey] : null;
			},
			setCurrentNode: function(node) {
				if (!this.nodeKey)
					throw new Error('[Tree] nodeKey is required in setCheckedNodes');
				if (!node) return this.store.setCurrentNodeKey(null);
				var key = node[this.nodeKey];
				return this.store.setCurrentNodeKey(key);
			},
			setCurrentKey: function(key) {
				if (!this.nodeKey)
					throw new Error('[Tree] nodeKey is required in setCheckedNodes');
				return this.store.setCurrentNodeKey(key);
			},
			getCheckedNodes: function(leafOnly) {
				return this.store.getCheckedNodes(leafOnly);
			},
			getCheckedKeys: function(leafOnly) {
				return this.store.getCheckedKeys(leafOnly);
			},
			setCheckedNodes: function(nodes, leafOnly) {
				if (!this.nodeKey)
					throw new Error('[Tree] nodeKey is required in setCheckedNodes');
				this.store.setCheckedNodes(nodes, leafOnly);
			},
			setCheckedKeys: function(keys, leafOnly) {
				if (!this.nodeKey)
					throw new Error('[Tree] nodeKey is required in setCheckedNodes');
				this.store.setCheckedKeys(keys, leafOnly);
			},
			setChecked: function(data, checked, deep) {
				this.store.setChecked(data, checked, deep);
			},
			handleNodeExpand: function(nodeData, node, instance) {
				this.broadcast('VueTreeNode', 'tree-node-expand', node);
				this.$emit('node-expand', nodeData, node, instance);
			}
		},
		created: function() {
			var self = this;
			self.isTree = true;
			self.store = new TreeStore({
				key: self.nodeKey,
				data: self.data,
				lazy: self.lazy,
				props: self.props,
				load: self.load,
				currentNodeKey: self.currentNodeKey,
				checkStrictly: self.checkStrictly,
				defaultCheckedKeys: self.defaultCheckedKeys,
				defaultExpandedKeys: self.defaultExpandedKeys,
				autoExpandParent: self.autoExpandParent,
				defaultExpandAll: self.defaultExpandAll,
				filterNodeMethod: self.filterNodeMethod
			});
			self.root = self.store.root;
		}
	};
	Vue.component(VueTree.name, VueTree);
});
