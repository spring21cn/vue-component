!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'Sortable', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['Sortable'], context['VueUtil']);
		delete context[name];
	}
})('VueSortable', this, function(Vue, Sortable, VueUtil) {
	'use strict';
	var computeVmIndex = function(vnodes, element) {
		if (vnodes) {
			return vnodes.map(function(elt) {
				return elt.elm;
			}).indexOf(element);
		}
		return -1;
	}
	var computeIndexes = function(slots, children) {
		if (!slots) {
			return [];
		}
		var elmFromNodes = slots.map(function(elt) {
			return elt.elm;
		});
		return [].concat(VueUtil.component.toConsumableArray(children)).map(function(elt) {
			return elmFromNodes.indexOf(elt);
		});
	}
	var emit = function(evtName, evtData) {
		var self = this;
		self.$nextTick(function() {
			self.$emit(evtName.toLowerCase(), evtData);
		});
	}
	var delegateAndEmit = function(evtName) {
		var self = this;
		return function(evtData) {
			if (self.realList !== null) {
				self['onDrag' + evtName](evtData);
			}
			emit.call(self, evtName, evtData);
		}
	}
	var eventsListened = ['Start', 'Add', 'Remove', 'Update', 'End'];
	var eventsToEmit = ['Choose', 'Sort', 'Filter', 'Clone'];
	var readonlyProperties = ['Move'].concat(eventsListened, eventsToEmit).map(function(evt) {
		return 'on' + evt;
	});
	var draggingElement = null;
	var VueSortable = {
		name: 'VueSortable',
		props: {
			options: Object,
			list: {
				type: Array,
				required: false,
				default: null
			},
			value: {
				type: Array,
				required: false,
				default: null
			},
			noTransitionOnDrag: {
				type: Boolean,
				default: false
			},
			clone: {
				type: Function,
				default: function(original) {
					return original;
				}
			},
			element: {
				type: String,
				default: 'div'
			},
			move: {
				type: Function,
				default: null
			}
		},
		data: function() {
			return {
				transitionMode: false,
				componentMode: false
			};
		},
		render: function(createElement) {
			if (this.$slots.default && this.$slots.default.length === 1) {
				var child = this.$slots.default[0];
				if (child.componentOptions && child.componentOptions.tag === "transition-group") {
					this.transitionMode = true;
				}
			}
			return createElement(this.element, null, this.$slots.default);
		},
		mounted: function() {
			var self = this;
			self.componentMode = self.element.toLowerCase() !== self.$el.nodeName.toLowerCase();
			if (self.componentMode && self.transitionMode) {
				throw new Error('Transition-group inside component is not suppported. Please alter element value or remove transition-group. Current element value: ' + self.element);
			}
			var optionsAdded = {};
			eventsListened.forEach(function(elt) {
				optionsAdded['on' + elt] = delegateAndEmit.call(self, elt);
			});
			eventsToEmit.forEach(function(elt) {
				optionsAdded['on' + elt] = emit.bind(self, elt);
			});
			var options = VueUtil.merge({}, self.options, optionsAdded, {
				onMove: function(evt) {
					return self.onDragMove(evt);
				}
			});
			self._sortable = new Sortable(self.rootContainer,options);
			self.computeIndexes();
		},
		beforeDestroy: function() {
			this._sortable.destroy();
		},
		computed: {
			rootContainer: function() {
				return this.transitionMode ? this.$el.children[0] : this.$el;
			},
			isCloning: function() {
				return !!this.options && !!this.options.group && this.options.group.pull === 'clone';
			},
			realList: function() {
				return !!this.list ? this.list : this.value;
			}
		},
		watch: {
			options: function(newOptionValue) {
				for (var property in newOptionValue) {
					if (readonlyProperties.indexOf(property) == -1) {
						this._sortable.option(property, newOptionValue[property]);
					}
				}
			},
			realList: function() {
				this.computeIndexes();
			}
		},
		methods: {
			getChildrenNodes: function() {
				if (this.componentMode) {
					return this.$children[0].$slots.default;
				}
				var rawNodes = this.$slots.default;
				return this.transitionMode ? rawNodes[0].child.$slots.default : rawNodes;
			},
			computeIndexes: function() {
				var self = this;
				self.$nextTick(function() {
					self.visibleIndexes = computeIndexes(self.getChildrenNodes(), self.rootContainer.children);
				});
			},
			getUnderlyingVm: function(htmlElt) {
				var index = computeVmIndex(this.getChildrenNodes(), htmlElt);
				var element = this.realList[index];
				return {
					index: index,
					element: element
				};
			},
			getUnderlyingPotencialDraggableComponent: function(_ref) {
				var __vue__ = _ref.__vue__;
				if (!__vue__ || !__vue__.$options || __vue__.$options._componentTag !== "transition-group") {
					return __vue__;
				}
				return __vue__.$parent;
			},
			emitChanges: function(evt) {
				var self = this;
				self.$nextTick(function() {
					self.$emit('change', evt);
				});
			},
			alterList: function(onList) {
				if (!!this.list) {
					onList(this.list);
				} else {
					var newList = [].concat(VueUtil.component.toConsumableArray(this.value));
					onList(newList);
					this.$emit('input', newList);
				}
			},
			spliceList: function() {
				var _arguments = arguments;
				var spliceList = function spliceList(list) {
					return list.splice.apply(list, _arguments);
				};
				this.alterList(spliceList);
			},
			updatePosition: function(oldIndex, newIndex) {
				var updatePosition = function updatePosition(list) {
					return list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
				};
				this.alterList(updatePosition);
			},
			getRelatedContextFromMoveEvent: function(_ref2) {
				var to = _ref2.to
				 , related = _ref2.related;
				var component = this.getUnderlyingPotencialDraggableComponent(to);
				if (!component) {
					return {
						component: component
					};
				}
				var list = component.realList;
				var context = {
					list: list,
					component: component
				};
				if (to !== related && list && component.getUnderlyingVm) {
					var destination = component.getUnderlyingVm(related);
					return VueUtil.merge(destination, context);
				}
				return context;
			},
			getVmIndex: function(domIndex) {
				var indexes = this.visibleIndexes;
				var numberIndexes = indexes.length;
				var vmIndex;
				if (domIndex > numberIndexes - 1) {
					vmIndex = numberIndexes||0;
				} else {
					vmIndex = indexes[domIndex]||0;
				}
				vmIndex < 0 ? vmIndex = 0 : undefined;
				return vmIndex;
			},
			getComponent: function() {
				return this.$slots.default[0].componentInstance;
			},
			resetTransitionData: function(index) {
				if (!this.noTransitionOnDrag || !this.transitionMode) {
					return;
				}
				var nodes = this.getChildrenNodes();
				nodes[index].data = null;
				var transitionContainer = this.getComponent();
				transitionContainer.children = [];
				transitionContainer.kept = undefined;
			},
			onDragStart: function(evt) {
				this.context = this.getUnderlyingVm(evt.item);
				evt.item._underlying_vm_ = this.clone(this.context.element);
				draggingElement = evt.item;
			},
			onDragAdd: function(evt) {
				var element = evt.item._underlying_vm_;
				if (element === undefined) {
					return;
				}
				VueUtil.removeNode(evt.item);
				var newIndex = evt.newIndex;
				this.spliceList(newIndex, 0, element);
				this.computeIndexes();
				var added = {
					element: element,
					newIndex: newIndex
				};
				this.emitChanges({
					added: added
				});
			},
			onDragRemove: function(evt) {
				VueUtil.insertNodeAt(this.rootContainer, evt.item, evt.oldIndex);
				if (this.isCloning) {
					VueUtil.removeNode(evt.clone);
					return;
				}
				var oldIndex = this.context.index;
				this.spliceList(oldIndex, 1);
				var removed = {
					element: this.context.element,
					oldIndex: oldIndex
				};
				this.resetTransitionData(oldIndex);
				this.emitChanges({
					removed: removed
				});
			},
			onDragUpdate: function(evt) {
				var oldIndex = evt.oldIndex;
				var newIndex = evt.newIndex;
				VueUtil.removeNode(evt.item);
				VueUtil.insertNodeAt(evt.from, evt.item, oldIndex);
				this.updatePosition(oldIndex, newIndex);
				var moved = {
					element: this.context.element,
					oldIndex: oldIndex,
					newIndex: newIndex
				};
				this.emitChanges({
					moved: moved
				});
			},
			computeFutureIndex: function(relatedContext, evt) {
				if (!relatedContext.element) {
					return 0;
				}
				var domChildren = [].concat(VueUtil.component.toConsumableArray(evt.to.children));
				var currentDOMIndex = domChildren.indexOf(evt.related);
				var currentIndex = relatedContext.component.getVmIndex(currentDOMIndex);
				var draggedInList = domChildren.indexOf(draggingElement) != -1;
				return draggedInList ? currentIndex : currentIndex + 1;
			},
			onDragMove: function(evt) {
				var onMove = this.move;
				if (!onMove || !this.realList) {
					return true;
				}
				var relatedContext = this.getRelatedContextFromMoveEvent(evt);
				var draggedContext = this.context;
				var futureIndex = this.computeFutureIndex(relatedContext, evt);
				VueUtil.merge(draggedContext, {
					futureIndex: futureIndex
				});
				VueUtil.merge(evt, {
					relatedContext: relatedContext,
					draggedContext: draggedContext
				});
				return onMove(evt);
			},
			onDragEnd: function(evt) {
				this.computeIndexes();
				draggingElement = null;
			}
		}
	};
	Vue.component(VueSortable.name, VueSortable);
});
