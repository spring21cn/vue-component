!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueLoadingBar', this, function(Vue) {
	'use strict';
	var loadingBarInstance;
	var color = 'primary';
	var failedColor = 'error';
	var height = 2;
	var timer;
	var LoadingBar = {
		template: '<transition name="fade"><div :class="classes" :style="outerStyles" v-show="show"><div :class="innerClasses" :style="styles"></div></div></transition>',
		props: {
			color: {
				type: String,
				default: 'primary'
			},
			failedColor: {
				type: String,
				default: 'error'
			},
			height: {
				type: Number,
				default: 2
			},
		},
		data: function() {
			return {
				percent: 0,
				status: 'success',
				show: false
			};
		},
		computed: {
			classes: function() {
				return 'vue-loading-bar';
			},
			innerClasses: function() {
				return [
					'vue-loading-bar-inner',
					{
						'vue-loading-bar-inner-color-primary': this.color === 'primary' && this.status === 'success',
						'vue-loading-bar-inner-failed-color-error': this.failedColor === 'error' && this.status === 'error'
					}
				];
			},
			outerStyles: function() {
				return {
					height: this.height + 'px'
				};
			},
			styles: function() {
				var style = {
					width: this.percent + '%',
					height: this.height + 'px'
				};
				if (this.color !== 'primary' && this.status === 'success') {
					style.backgroundColor = this.color;
				}
				if (this.failedColor !== 'error' && this.status === 'error') {
					style.backgroundColor = this.failedColor;
				}
				return style;
			}
		}
	};
	LoadingBar.newInstance = function(properties) {
		var _props = properties || {};
		var props = '';
		Object.keys(_props).forEach(function(prop) {
			props += ' :' + camelcaseToHyphen(prop) + '=' + prop;
		});
		var div = document.createElement('div');
		div.innerHTML = '<loading-bar'+props+'></loading-bar>';
		document.body.appendChild(div);
		var loading_bar = new Vue({
			el: div,
			data: _props,
			components: { LoadingBar: LoadingBar }
		}).$children[0];
		return {
			update: function(options) {
				if ('percent' in options) {
					loading_bar.percent = options.percent;
				}
				if (options.status) {
					loading_bar.status = options.status;
				}
				if ('show' in options) {
					loading_bar.show = options.show;
				}
			},
			component: loading_bar,
			destroy: function() {
				document.body.removeChild(div);
			}
		};
	};
	var getLoadingBarInstance = function() {
		loadingBarInstance = loadingBarInstance || LoadingBar.newInstance({
			color: color,
			failedColor: failedColor,
			height: height
		});
		return loadingBarInstance;
	}
	var update = function(options) {
		var instance = getLoadingBarInstance();
		instance.update(options);
	}
	var hide = function() {
		setTimeout(function() {
			update({show: false});
			setTimeout(function() {
				update({percent: 0});
			}, 200);
		}, 500);
	}
	var clearTimer = function() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}
	var camelcaseToHyphen = function(str) {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}
	var VueLoadingBar = {
		start: function() {
			if (timer) return;
			var percent = 0;
			update({percent: percent, status: 'success', show: true});
			timer = setInterval(function() {
				percent += Math.floor(Math.random () * 3 + 5);
				if (percent > 95) {
					clearTimer();
				}
				update({percent: percent, status: 'success', show: true});
			}, 200);
		},
		update: function(percent) {
			clearTimer();
			update({percent: percent, status: 'success', show: true});
		},
		finish: function() {
			clearTimer();
			update({percent: 100, status: 'success', show: true});
			hide();
		},
		error: function() {
			clearTimer();
			update({percent: 100, status: 'error', show: true});
			hide();
		},
		config: function(options) {
			if (options.color) {
				color = options.color;
			}
			if (options.failedColor) {
				failedColor = options.failedColor;
			}
			if (options.height) {
				height = options.height;
			}
		},
		destroy: function() {
			clearTimer();
			var instance = getLoadingBarInstance();
			loadingBarInstance = null;
			instance.destroy();
		}
	}
	Vue.loadingBar = VueLoadingBar;
});
