!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueStep', this, function(Vue) {
	'use strict';
	var VueStep = {
		template: '<div class="vue-step" :style="[style, isLast ? \'\' : { marginRight: - $parent.stepOffset + \'px\' }]" :class="[\'is-\' + $parent.direction]"><div class="vue-step__head" :class="[\'is-\' + currentStatus, { \'is-text\': !icon }]"><div class="vue-step__line" :style="isLast ? \'\' : { marginRight: $parent.stepOffset + \'px\' }" :class="[\'is-\' + $parent.direction, { \'is-icon\': icon }]"><i class="vue-step__line-inner" :style="lineStyle"></i></div><span class="vue-step__icon"><slot v-if="currentStatus !== \'success\' && currentStatus !== \'error\'" name="icon"><i v-if="icon" :class="[icon]"></i><div v-else>{{ index + 1 }}</div></slot><i v-else :class="[\'vue-icon-\' + (currentStatus === \'success\' ? \'check\' : \'close\')]"></i></span></div><div class="vue-step__main" :style="{ marginLeft: mainOffset }"><div class="vue-step__title" ref="title" :class="[\'is-\' + currentStatus]"><slot name="title">{{ title }}</slot></div><div class="vue-step__description" :class="[\'is-\' + currentStatus]"><slot name="description"></slot></div></div></div>',
		name: 'VueStep',
		props: {
			title: String,
			icon: String,
			status: {
				type: String,
				default: 'wait'
			}
		},
		data: function() {
			return {
				index: -1,
				style: {},
				lineStyle: {},
				mainOffset: 0,
				isLast: false,
				currentStatus: this.status
			};
		},
		beforeCreate: function() {
			this.$parent.steps.push(this);
		},
		methods: {
			updateStatus: function(val) {
				var prevChild = this.$parent.$children[this.index - 1];
				if (val > this.index) {
					this.currentStatus = this.$parent.finishStatus;
				} else if (val === this.index) {
					this.currentStatus = this.$parent.processStatus;
				} else {
					this.currentStatus = 'wait';
				}
				if (prevChild)
					prevChild.calcProgress(this.currentStatus);
			},
			calcProgress: function(status) {
				var step = 100;
				var style = {};
				style.transitionDelay = 150 * this.index + 'ms';
				if (status === this.$parent.processStatus) {
					step = 50;
				} else if (status === 'wait') {
					step = 0;
					style.transitionDelay = (-150 * this.index) + 'ms';
				}
				this.$parent.direction === 'vertical' ? style.height = step + '%' : style.width = step + '%';
				this.lineStyle = style;
			},
			adjustPosition: function() {
				this.style = {};
				this.$parent.stepOffset = this.$el.getBoundingClientRect().width / (this.$parent.steps.length - 1);
			}
		},
		mounted: function() {
			var self = this;
			var parent = self.$parent;
			var isCenter = parent.center;
			var len = parent.steps.length;
			var isLast = self.isLast = parent.steps[parent.steps.length - 1] === self;
			var space = typeof parent.space === 'number' ? parent.space + 'px' : parent.space ? parent.space : 100 / (isCenter ? len - 1 : len) + '%';
			if (parent.direction === 'horizontal') {
				self.style = {
					width: space
				};
				if (parent.alignCenter) {
					self.mainOffset = -self.$refs.title.getBoundingClientRect().width / 2 + 16 + 'px';
				}
				isCenter && isLast && self.adjustPosition();
			} else {
				if (!isLast) {
					self.style = {
						height: space
					};
				}
			}
			var unwatch = self.$watch('index', function(val) {
				self.$watch('$parent.active', self.updateStatus, {
					immediate: true
				});
				unwatch();
			});
		}
	};
	Vue.component(VueStep.name, VueStep);
});
