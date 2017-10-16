!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueProgress', this, function(Vue) {
	'use strict';
	var VueProgress = {
		template: '<div class="vue-progress" :class="[\'vue-progress--\' + type, status ? \'is-\' + status : \'\',{\'vue-progress--without-text\': !showText,\'vue-progress--text-inside\': textInside,}]"><div class="vue-progress-bar" v-if="type === \'line\'"><div class="vue-progress-bar__outer" :style="{height: strokeWidth + \'px\'}"><div class="vue-progress-bar__inner" :style="barStyle"><div class="vue-progress-bar__innerText" v-if="showText && textInside">{{percentage}}%</div></div></div></div><div class="vue-progress-circle" :style="{height: width + \'px\', width: width + \'px\'}" v-else><svg viewBox="0 0 100 100"><path class="vue-progress-circle__track" :d="trackPath" stroke="#e5e9f2" :stroke-width="relativeStrokeWidth" fill="none"></path><path class="vue-progress-circle__path" :d="trackPath" stroke-linecap="round" :stroke="stroke" :stroke-width="relativeStrokeWidth" fill="none" :style="circlePathStyle"></path></svg></div><div class="vue-progress__text" v-if="showText && !textInside" :style="{fontSize: progressTextSize + \'px\'}"><template v-if="!status">{{percentage}}%</template><i v-else :class="iconClass"></i></div></div>',
		name: 'VueProgress',
		props: {
			type: {
				type: String,
				default: 'line',
				validator: function(val) {return ['line', 'circle'].indexOf(val) > -1;}
			},
			percentage: {
				type: Number,
				default: 0,
				validator: function(val) {return val >= 0 && val <= 100;}
			},
			status: {
				type: String
			},
			strokeWidth: {
				type: Number,
				default: 6
			},
			textInside: {
				type: Boolean,
				default: false
			},
			width: {
				type: Number,
				default: 126
			},
			showText: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			barStyle: function() {
				var style = {};
				style.width = this.percentage + '%';
				return style;
			},
			relativeStrokeWidth: function() {
				return (this.strokeWidth / this.width * 100).toFixed(1);
			},
			trackPath: function() {
				var radius = parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10);
				return 'M 50 50 m 0 -' + radius + ' a ' + radius + ' ' + radius + ' 0 1 1 0 ' + 2 * radius + ' a ' + radius + ' ' + radius + ' 0 1 1 0 -' + 2 * radius
			},
			perimeter: function() {
				var radius = 50 - parseFloat(this.relativeStrokeWidth) / 2;
				return 2 * Math.PI * radius;
			},
			circlePathStyle: function() {
				var perimeter = this.perimeter;
				return {
					strokeDasharray: perimeter + 'px,' + perimeter + 'px',
					strokeDashoffset: (1 - this.percentage / 100) * perimeter + 'px',
					transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
				};
			},
			stroke: function() {
				var ret;
				switch (this.status) {
					case 'success':
						ret = '#13ce66';
						break;
					case 'exception':
						ret = '#ff4949';
						break;
					default:
						ret = '#20a0ff';
				}
				return ret;
			},
			iconClass: function() {
				if (this.type === 'line') {
					return this.status === 'success' ? 'vue-icon-circle-check' : 'vue-icon-circle-cross';
				} else {
					return this.status === 'success' ? 'vue-icon-check' : 'vue-icon-close';
				}
			},
			progressTextSize: function() {
				return this.type === 'line' ? 12 + this.strokeWidth * 0.4 : this.width * 0.111111 + 2 ;
			}
		}
	};
	Vue.component(VueProgress.name, VueProgress);
});
