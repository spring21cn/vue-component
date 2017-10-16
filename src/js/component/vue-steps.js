!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueSteps', this, function(Vue) {
	'use strict';
	var VueSteps = {
		template: '<div class="vue-steps" :class="[\'is-\' + direction, center ? \'is-center\' : \'\']"><slot></slot></div>',
		name: 'VueSteps',
		props: {
			space: [Number, String],
			active: Number,
			direction: {
				type: String,
				default: 'horizontal'
			},
			alignCenter: Boolean,
			center: Boolean,
			finishStatus: {
				type: String,
				default: 'finish'
			},
			processStatus: {
				type: String,
				default: 'process'
			}
		},
		data: function() {
			return {
				steps: [],
				stepOffset: 0
			};
		},
		watch: {
			active: function(newVal, oldVal) {
				this.$emit('change', newVal, oldVal);
			},
			steps: function(steps) {
				var self = this;
				steps.forEach(function(child, index) {
					child.index = index;
				});
				if (self.center) {
					var len = steps.length;
					self.$nextTick(function() {
						self.stepOffset = steps[len - 1].$el.getBoundingClientRect().width / (len - 1);
					});
				}
			}
		}
	};
	Vue.component(VueSteps.name, VueSteps);
});
