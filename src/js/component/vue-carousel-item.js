!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueCarouselItem', this, function(Vue) {
	'use strict';
	var CARD_SCALE = 0.83;
	var VueCarouselItem = {
		template: '<div v-show="ready" class="vue-carousel__item" :class="{\'is-active\': active, \'vue-carousel__item--card\': $parent.type === \'card\', \'is-in-stage\': inStage, \'is-hover\': hover}" @click="handleItemClick" :style=\'{msTransform: "translateX(" + translate + "px) scale(" + scale + ")", webkitTransform: "translateX(" + translate + "px) scale(" + scale + ")", transform: "translateX(" + translate + "px) scale(" + scale + ")"}\'><div v-if="$parent.type === \'card\'" v-show="!active" class="vue-carousel__mask"></div><slot></slot></div>',
		name: 'VueCarouselItem',
		props: {
			name: String
		},
		data: function() {
			return {
				hover: false,
				translate: 0,
				scale: 1,
				active: false,
				ready: false,
				inStage: false
			};
		},
		methods: {
			processIndex: function(index, activeIndex, length) {
				if (activeIndex === 0 && index === length - 1) {
					return -1;
				} else if (activeIndex === length - 1 && index === 0) {
					return length;
				} else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
					return length + 1;
				} else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
					return -2;
				}
				return index;
			},
			calculateTranslate: function(index, activeIndex, parentWidth) {
				if (this.inStage) {
					return parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1) / 4;
				} else if (index < activeIndex) {
					return -(1 + CARD_SCALE) * parentWidth / 4;
				} else {
					return (3 + CARD_SCALE) * parentWidth / 4;
				}
			},
			translateItem: function(index, activeIndex) {
				var parentWidth = this.$parent.$el.offsetWidth;
				var length = this.$parent.items.length;
				if (index !== activeIndex && length > 2) {
					index = this.processIndex(index, activeIndex, length);
				}
				if (this.$parent.type === 'card') {
					this.inStage = Math.round(Math.abs(index - activeIndex)) <= 1;
					this.active = index === activeIndex;
					this.translate = this.calculateTranslate(index, activeIndex, parentWidth);
					this.scale = this.active ? 1 : CARD_SCALE;
				} else {
					this.active = index === activeIndex;
					this.translate = parentWidth * (index - activeIndex);
				}
				this.ready = true;
			},
			handleItemClick: function() {
				var parent = this.$parent;
				if (parent && parent.type === 'card') {
					var index = parent.items.indexOf(this);
					parent.setActiveItem(index);
				}
			}
		},
		created: function() {
			this.$parent && this.$parent.handleItemChange();
		},
		destroyed: function() {
			this.$parent && this.$parent.handleItemChange();
		}
	};
	Vue.component(VueCarouselItem.name, VueCarouselItem);
});
