!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueCol', this, function(Vue) {
	'use strict';
	var VueCol = {
		name: 'VueCol',
		props: {
			span: {
				type: Number,
				default: 24
			},
			offset: Number,
			pull: Number,
			push: Number,
			xs: [Number, Object],
			sm: [Number, Object],
			md: [Number, Object],
			lg: [Number, Object]
		},
		computed: {
			gutter: function() {
				return this.$parent.gutter;
			},
			style: function() {
				var ret = {};
				if (this.gutter) {
					ret.paddingLeft = this.gutter / 2 + 'px';
					ret.paddingRight = ret.paddingLeft;
				}
				return ret;
			}
		},
		render: function(createElement) {
			var self = this;
			var classList = [];
			['span', 'offset', 'pull', 'push'].forEach(function(prop) {
				if (self[prop]) {
					classList.push(prop !== 'span' ? 'vue-col-' + prop + '-' + self[prop] : 'vue-col-' + self[prop]);
				}
			});
			['xs', 'sm', 'md', 'lg'].forEach(function(size) {
				if (typeof self[size] === 'number') {
					classList.push('vue-col-' + size + '-' + self[size]);
				} else if (typeof self[size] === 'object') {
					var props = self[size];
					Object.keys(props).forEach(function(prop) {
						classList.push(prop !== 'span' ? 'vue-col-' + size + '-' + prop + '-' + props[prop] : 'vue-col-' + size + '-' + props[prop]);
					});
				}
			});
			return createElement('div', {
				class: ['vue-col', classList],
				style: self.style
			}, [this.$slots.default]);
		}
	};
	Vue.component(VueCol.name, VueCol);
});
