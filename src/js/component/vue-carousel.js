!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueCarousel', this, function(Vue, VueUtil) {
	'use strict';
	var VueCarousel = {
		template: '<div class="vue-carousel" :class="{ \'vue-carousvue--card\': type === \'card\' }" @mouseenter.stop="handleMouseEnter" @mouseleave.stop="handleMouseLeave"><div class="vue-carousel__container" :style="{ height: height }"><transition name="carousvue-arrow-left"><button v-if="arrow !== \'never\'" v-show="arrow === \'always\' || hover" @mouseenter="handleButtonEnter(\'left\')" @mouseleave="handleButtonLeave" @click.stop="throttledArrowClick(activeIndex - 1)" class="vue-carousel__arrow vue-carousel__arrow--left"><i class="vue-icon-arrow-left"></i></button></transition><transition name="carousvue-arrow-right"><button v-if="arrow !== \'never\'" v-show="arrow === \'always\' || hover" @mouseenter="handleButtonEnter(\'right\')" @mouseleave="handleButtonLeave" @click.stop="throttledArrowClick(activeIndex + 1)" class="vue-carousel__arrow vue-carousel__arrow--right"><i class="vue-icon-arrow-right"></i></button></transition><slot></slot></div><ul class="vue-carousel__indicators" v-if="indicatorPosition !== \'none\'" :class="{ \'vue-carousel__indicators--outside\': indicatorPosition === \'outside\' || type === \'card\' }"><li v-for="(item, index) in items" class="vue-carousel__indicator" :class="{ \'is-active\': index === activeIndex }" @mouseenter="throttledIndicatorHover(index)" @click.stop="handleIndicatorClick(index)"><button class="vue-carousel__button"></button></li></ul></div>',
		name: 'VueCarousel',
		props: {
			initialIndex: {
				type: Number,
				default: 0
			},
			height: String,
			trigger: {
				type: String,
				default: 'hover'
			},
			autoplay: {
				type: Boolean,
				default: true
			},
			interval: {
				type: Number,
				default: 3000
			},
			indicatorPosition: String,
			indicator: {
				type: Boolean,
				default: true
			},
			arrow: {
				type: String,
				default: 'hover'
			},
			type: String
		},
		data: function() {
			return {
				items: [],
				activeIndex: -1,
				containerWidth: 0,
				timer: null,
				hover: false
			};
		},
		watch: {
			items: function(val) {
				if (val.length > 0)
					this.setActiveItem(0);
			},
			activeIndex: function(val, oldVal) {
				this.resetItemPosition();
				this.$emit('change', val, oldVal);
			}
		},
		methods: {
			handleMouseEnter: function() {
				this.hover = true;
				this.pauseTimer();
			},
			handleMouseLeave: function() {
				this.hover = false;
				this.startTimer();
			},
			itemInStage: function(item, index) {
				var length = this.items.length;
				if (index === length - 1 && item.inStage && this.items[0].active || (item.inStage && this.items[index + 1] && this.items[index + 1].active)) {
					return 'left';
				} else if (index === 0 && item.inStage && this.items[length - 1].active || (item.inStage && this.items[index - 1] && this.items[index - 1].active)) {
					return 'right';
				}
				return false;
			},
			handleButtonEnter: function(arrow) {
				var self = this;
				self.items.forEach(function(item, index) {
					if (arrow === self.itemInStage(item, index)) {
						item.hover = true;
					}
				});
			},
			handleButtonLeave: function() {
				var self = this;
				self.items.forEach(function(item) {
					item.hover = self;
				});
			},
			handleItemChange: VueUtil.component.debounce(100, function() {
				this.updateItems();
			}),
			updateItems: function() {
				this.items = this.$children.filter(function(child) {
					return child.$options.name === 'VueCarouselItem';
				});
			},
			resetItemPosition: function() {
				var self = this;
				self.items.forEach(function(item, index) {
					item.translateItem(index, self.activeIndex);
				});
			},
			playSlides: function() {
				if (this.activeIndex < this.items.length - 1) {
					this.activeIndex++;
				} else {
					this.activeIndex = 0;
				}
			},
			pauseTimer: function() {
				clearInterval(this.timer);
			},
			startTimer: function() {
				if (this.interval <= 0 || !this.autoplay)
					return;
				this.timer = setInterval(this.playSlides, this.interval);
			},
			setActiveItem: function(index) {
				if (typeof index === 'string') {
					var filteredItems = this.items.filter(function(item) {
						return item.name === index;
					});
					if (filteredItems.length > 0) {
						index = this.items.indexOf(filteredItems[0]);
					}
				}
				index = Number(index);
				if (isNaN(index) || index !== Math.floor(index)) {
					process.env.NODE_ENV !== 'production' && console.warn('[Carousel]index must be an integer.');
					return;
				}
				var length = this.items.length;
				if (index < 0) {
					this.activeIndex = length - 1;
				} else if (index >= length) {
					this.activeIndex = 0;
				} else {
					this.activeIndex = index;
				}
			},
			prev: function() {
				this.setActiveItem(this.activeIndex - 1);
			},
			next: function() {
				this.setActiveItem(this.activeIndex + 1);
			},
			handleIndicatorClick: function(index) {
				this.activeIndex = index;
			},
			handleIndicatorHover: function(index) {
				if (this.trigger === 'hover' && index !== this.activeIndex) {
					this.activeIndex = index;
				}
			}
		},
		created: function() {
			var self = this;
			self.throttledArrowClick = VueUtil.component.throttle(300, true, function(index) {
				self.setActiveItem(index);
			});
			self.throttledIndicatorHover = VueUtil.component.throttle(300, function(index) {
				self.handleIndicatorHover(index);
			});
		},
		mounted: function() {
			var self = this;
			self.updateItems();
			self.$nextTick(function() {
				VueUtil.addResizeListener(self.$el, self.resetItemPosition);
				if (self.initialIndex < self.items.length && self.initialIndex >= 0) {
					self.activeIndex = self.initialIndex;
				}
				self.startTimer();
			});
		},
		beforeDestroy: function() {
			if (this.$el)
				VueUtil.removeResizeListener(this.$el, this.resetItemPosition);
		}
	};
	Vue.component(VueCarousel.name, VueCarousel);
});
