!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
	}
})('VueScrollbar', this, function(Vue, VueUtil) {
	'use strict';
	var BAR_MAP = {
		vertical: {
			offset: 'offsetHeight',
			scroll: 'scrollTop',
			scrollSize: 'scrollHeight',
			size: 'height',
			key: 'vertical',
			axis: 'Y',
			client: 'clientY',
			direction: 'top'
		},
		horizontal: {
			offset: 'offsetWidth',
			scroll: 'scrollLeft',
			scrollSize: 'scrollWidth',
			size: 'width',
			key: 'horizontal',
			axis: 'X',
			client: 'clientX',
			direction: 'left'
		}
	};
	var renderThumbStyle = function(obj) {
		var move = obj.move;
		var size = obj.size;
		var bar = obj.bar;
		var style = {};
		var translate = "translate" + bar.axis + "(" + move + "%)";
		style[bar.size] = size;
		style.transform = translate;
		style.msTransform = translate;
		style.webkitTransform = translate;
		return style;
	};
	var Bar = {
		name: 'Bar',
		props: {
			vertical: Boolean,
			size: String,
			move: Number
		},
		computed: {
			bar: function() {
				return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
			},
			wrap: function() {
				return this.$parent.wrap;
			}
		},
		render: function(createElement) {
			var self = this;
			var move = self.move;
			var size = self.size;
			var bar = self.bar;
			return createElement("div", {
				class: ["vue-scrollbar__bar", "is-" + bar.key],
				on: {
					mousedown: self.clickTrackHandler
				}
			}, [createElement("div", {
				ref: "thumb",
				class: "vue-scrollbar__thumb",
				on: {
					mousedown: self.clickThumbHandler
				},
				style: renderThumbStyle({
					size: size,
					move: move,
					bar: bar
				})
			}, [])]);
		},
		methods: {
			clickThumbHandler: function(e) {
				this.startDrag(e);
				this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]));
			},
			clickTrackHandler: function(e) {
				var offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
				var thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);
				var thumbPositionPercentage = (offset - thumbHalf) * 100 / this.$el[this.bar.offset];
				this.wrap[this.bar.scroll] = thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100;
			},
			startDrag: function(e) {
				e.stopImmediatePropagation();
				this.cursorDown = true;
				VueUtil.on(document, 'mousemove', this.mouseMoveDocumentHandler);
				VueUtil.on(document, 'mouseup', this.mouseUpDocumentHandler);
				document.onselectstart = function() {
					return false;
				}
			},
			mouseMoveDocumentHandler: function(e) {
				if (this.cursorDown === false)
					return;
				var prevPage = this[this.bar.axis];
				if (!prevPage)
					return;
				var offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1);
				var thumbClickPosition = (this.$refs.thumb[this.bar.offset] - prevPage);
				var thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this.$el[this.bar.offset]);
				this.wrap[this.bar.scroll] = thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100;
			},
			mouseUpDocumentHandler: function(e) {
				this.cursorDown = false;
				this[this.bar.axis] = 0;
				VueUtil.off(document, 'mousemove', this.mouseMoveDocumentHandler);
				document.onselectstart = null;
			}
		},
		destroyed: function() {
			VueUtil.off(document, 'mouseup', this.mouseUpDocumentHandler);
		}
	};
	var VueScrollbar = {
		name: 'VueScrollbar',
		components: {
			Bar: Bar
		},
		props: {
			native: Boolean,
			wrapStyle: {},
			wrapClass: {},
			viewClass: {},
			viewStyle: {},
			noresize: Boolean,
			tag: {
				type: String,
				default: 'div'
			}
		},
		data: function() {
			return {
				sizeWidth: '0',
				sizeHeight: '0',
				moveX: 0,
				moveY: 0
			};
		},
		computed: {
			wrap: function() {
				return this.$refs.wrap;
			}
		},
		render: function(createElement) {
			var self = this;
			var gutter = VueUtil.component.scrollBarWidth();
			var style = self.wrapStyle;
			if (gutter) {
				var gutterWith = "-" + gutter + "px";
				var gutterHeight = "auto";
				if (self.$parent.$el) {
					var clientHeight = parseInt(self.$parent.$el.style.height);
					if (clientHeight > 0) {
						gutterHeight = clientHeight + gutter + 'px';
					}
				}
				var gutterStyle = 'margin-bottom: ' + gutterWith + '; margin-right: ' + gutterWith + ';height: ' + gutterHeight + ';';
				if (Array.isArray(self.wrapStyle)) {
					style = VueUtil.arrayToObject(self.wrapStyle);
					style.marginRight = style.marginBottom = gutterWith;
				} else if (typeof self.wrapStyle === 'string') {
					style += gutterStyle;
				} else {
					style = gutterStyle;
				}
			}
			var view = createElement(self.tag, {
				class: ['vue-scrollbar__view', self.viewClass],
				style: self.viewStyle,
				ref: 'resize'
			}, self.$slots.default);
			var wrap = createElement('div', {
				ref: "wrap",
				style: style,
				on: {
					'scroll': self.handleScroll
				},
				class: [self.wrapClass, 'vue-scrollbar__wrap', gutter ? '' : 'vue-scrollbar__wrap--hidden-default']
			}, [[view]]);
			var nodes;
			if (!self.native) {
				nodes = [wrap, createElement(Bar, {
					attrs: {
						move: self.moveX,
						size: self.sizeWidth
					}
				}, []), createElement(Bar, {
					attrs: {
						vertical: true,
						move: self.moveY,
						size: self.sizeHeight
					}
				}, []), ];
			} else {
				nodes = [createElement('div', {
					ref: "wrap",
					class: [self.wrapClass, "vue-scrollbar__wrap"],
					style: style
				}, [[view]])];
			}
			this.$nextTick(this.update);
			return createElement('div', {
				class: 'vue-scrollbar'
			}, nodes);
		},
		methods: {
			handleScroll: function() {
				var wrap = this.wrap;
				if (!wrap) return;
				this.moveY = wrap.scrollTop * 100 / wrap.clientHeight;
				this.moveX = wrap.scrollLeft * 100 / wrap.clientWidth;
			},
			update: function() {
				var wrap = this.wrap;
				if (!wrap) return;
				var heightPercentage = wrap.clientHeight * 100 / wrap.scrollHeight;
				var widthPercentage = wrap.clientWidth * 100 / wrap.scrollWidth;
				this.sizeHeight = heightPercentage < 100 ? heightPercentage + '%' : '';
				this.sizeWidth = widthPercentage < 100 ? widthPercentage + '%' : '';
			}
		},
		mounted: function() {
			if (this.native) return;
			this.$nextTick(this.update);
			!this.noresize && this.$refs.resize && VueUtil.addResizeListener(this.$refs.resize, this.update);
		},
		destroyed: function() {
			if (this.native) return;
			!this.noresize && this.$refs.resize && VueUtil.removeResizeListener(this.$refs.resize, this.update);
		}
	};
	Vue.component(VueScrollbar.name, VueScrollbar);
	return function() {
		return VueScrollbar;
	}
});
