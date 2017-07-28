!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VuePopper'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VuePopper']);
		delete context[name];
	}
})('VueColorPicker', this, function(Vue, VueUtil, VuePopper) {
	'use strict';
	var isDragging = false;
	var hsv2hsl = function(hue, sat, val) {
		return [hue, (sat * val / ((hue = (2 - sat) * val) < 1 ? hue : 2 - hue)) || 0, hue / 2];
	};
	var isOnePointZero = function(n) {
		return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
	};
	var isPercentage = function(n) {
		return typeof n === 'string' && n.indexOf('%') !== -1;
	};
	var bound01 = function(value, max) {
		if (isOnePointZero(value)) value = '100%';
		var processPercent = isPercentage(value);
		value = Math.min(max, Math.max(0, parseFloat(value)));
		if (processPercent) {
			value = parseInt(value * max, 10) / 100;
		}
		if ((Math.abs(value - max) < 0.000001)) {
			return 1;
		}
		return (value % max) / parseFloat(max);
	};
	var INT_HEX_MAP = {10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F'};
	var HEX_INT_MAP = {A: 10, B: 11, C: 12, D: 13, E: 14, F: 15};
	var toHex = function(ref) {
		var r = ref.r;
		var g = ref.g;
		var b = ref.b;
		var hexOne = function(value) {
			value = Math.min(Math.round(value), 255);
			var high = Math.floor(value / 16);
			var low = value % 16;
			return '' + (INT_HEX_MAP[high] || high) + (INT_HEX_MAP[low] || low);
		};
		if (isNaN(r) || isNaN(g) || isNaN(b)) return '';
		return '#' + hexOne(r) + hexOne(g) + hexOne(b);
	};
	var parseHexChannel = function(hex) {
		if (hex.length === 2) {
			return (HEX_INT_MAP[hex[0].toUpperCase()] || +hex[0]) * 16 + (HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1]);
		}
		return HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1];
	};
	var hsl2hsv = function(hue, sat, light) {
		sat = sat / 100;
		light = light / 100;
		var smin = sat;
		var lmin = Math.max(light, 0.01);
		var sv;
		var v;
		light *= 2;
		sat *= (light <= 1) ? light : 2 - light;
		smin *= lmin <= 1 ? lmin : 2 - lmin;
		v = (light + sat) / 2;
		sv = light === 0 ? (2 * smin) / (lmin + smin) : (2 * sat) / (light + sat);
		return {
			h: hue,
			s: sv * 100,
			v: v * 100
		};
	};
	var rgb2hsv = function(r, g, b) {
		r = bound01(r, 255);
		g = bound01(g, 255);
		b = bound01(b, 255);
		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var h,
		s;
		var v = max;
		var d = max - min;
		s = max === 0 ? 0 : d / max;
		if (max === min) {
			h = 0;
		} else {
			switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
			}
			h /= 6;
		}
		return {
			h: h * 360,
			s: s * 100,
			v: v * 100
		};
	};
	var hsv2rgb = function(h, s, v) {
		h = bound01(h, 360) * 6;
		s = bound01(s, 100);
		v = bound01(v, 100);
		var i = Math.floor(h);
		var f = h - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);
		var mod = i % 6;
		var r = [v, q, p, p, t, v][mod];
		var g = [t, v, v, q, p, p][mod];
		var b = [p, p, t, v, v, q][mod];
		return {
			r: Math.round(r * 255),
			g: Math.round(g * 255),
			b: Math.round(b * 255)
		};
	};
	var Color = function(options) {
		this._hue = 0;
		this._saturation = 100;
		this._value = 100;
		this._alpha = 100;
		this.enableAlpha = false;
		this.format = 'hex';
		this.value = '';
		options = options || {};
		for (var option in options) {
			if (options.hasOwnProperty(option)) {
				this[option] = options[option];
			}
		}
		this.doOnChange();
	};
	Color.prototype.set = function(prop, value) {
		if (arguments.length === 1 && typeof prop === 'object') {
			for (var p in prop) {
				if (prop.hasOwnProperty(p)) {
					this.set(p, prop[p]);
				}
			}
			return;
		}
		this['_' + prop] = value;
		this.doOnChange();
	};
	Color.prototype.get = function(prop) {
		return this['_' + prop];
	};
	Color.prototype.toRgb = function() {
		return hsv2rgb(this._hue, this._saturation, this._value);
	};
	Color.prototype.fromString = function(value) {
		var self = this;
		if (!value) {
			this._hue = 0;
			this._saturation = 100;
			this._value = 100;
			this.doOnChange();
			return;
		}
		var fromHSV = function(h, s, v) {
			self._hue = h;
			self._saturation = s;
			self._value = v;
			self.doOnChange();
		};
		if (value.indexOf('hsl') !== -1) {
			var parts = value.replace(/hsla|hsl|\(|\)/gm, '').split(/\s|,/g).filter(function(val) {return val !== '';}).map(function(val, index) {return index > 2 ? parseFloat(val) : parseInt(val, 10);});
			if (parts.length === 4) {
				this._alpha = Math.floor(parseFloat(parts[3]) * 100);
			}
			if (parts.length >= 3) {
				var _hsl2hsv = hsl2hsv(parts[0], parts[1], parts[2]);
				var h = _hsl2hsv.h;
				var s = _hsl2hsv.s;
				var v = _hsl2hsv.v;
				fromHSV(h, s, v);
			}
		} else if (value.indexOf('hsv') !== -1) {
			var parts = value.replace(/hsva|hsv|\(|\)/gm, '').split(/\s|,/g).filter(function(val) {return val !== '';}).map(function(val, index) {return index > 2 ? parseFloat(val) : parseInt(val, 10);});
			if (parts.length === 4) {
				this._alpha = Math.floor(parseFloat(parts[3]) * 100);
			}
			if (parts.length >= 3) {
				fromHSV(parts[0], parts[1], parts[2]);
			}
		} else if (value.indexOf('rgb') !== -1) {
			var parts = value.replace(/rgba|rgb|\(|\)/gm, '').split(/\s|,/g).filter(function(val) {return val !== '';}).map(function(val, index) {return index > 2 ? parseFloat(val) : parseInt(val, 10);});
			if (parts.length === 4) {
				this._alpha = Math.floor(parseFloat(parts[3]) * 100);
			}
			if (parts.length >= 3) {
				var _rgb2hsv = rgb2hsv(parts[0], parts[1], parts[2]);
				var h = _rgb2hsv.h;
				var s = _rgb2hsv.s;
				var v = _rgb2hsv.v;
				fromHSV(h, s, v);
			}
		} else if (value.indexOf('#') !== -1) {
			var hex = value.replace('#', '').trim();
			var r, g, b;
			if (hex.length === 3) {
				r = parseHexChannel(hex[0] + hex[0]);
				g = parseHexChannel(hex[1] + hex[1]);
				b = parseHexChannel(hex[2] + hex[2]);
			} else if (hex.length === 6) {
				r = parseHexChannel(hex.substring(0, 2));
				g = parseHexChannel(hex.substring(2, 4));
				b = parseHexChannel(hex.substring(4));
			}
			var _rgb2hsv = rgb2hsv(r, g, b);
			var h = _rgb2hsv.h;
			var s = _rgb2hsv.s;
			var v = _rgb2hsv.v;
			fromHSV(h, s, v);
		}
	};
	Color.prototype.doOnChange = function() {
		var _hue = this._hue;
		var _saturation = this._saturation;
		var _value = this._value;
		var _alpha = this._alpha;
		var format = this.format;
		if (this.enableAlpha) {
			switch (format) {
			case 'hsl':
				var hsl = hsv2hsl(_hue, _saturation / 100, _value / 100);
				this.value = 'hsla(' + _hue + ', ' + Math.round(hsl[1] * 100) + '%, ' + Math.round(hsl[2] * 100) + '%, ' + _alpha / 100 + ')';
				break;
			case 'hsv':
				this.value = 'hsva(' + _hue + ', ' + Math.round(_saturation) + '%, ' + Math.round(_value) + '%, ' + _alpha / 100 + ')';
				break;
			default:
				var _hsv2rgb = hsv2rgb(_hue, _saturation, _value);
				var r = _hsv2rgb.r;
				var g = _hsv2rgb.g;
				var b = _hsv2rgb.b;
				this.value = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + _alpha / 100 + ')';
			}
		} else {
			switch (format) {
			case 'hsl':
				var hsl = hsv2hsl(_hue, _saturation / 100, _value / 100);
				this.value = 'hsl(' + _hue + ', ' + Math.round(_hsl[1] * 100) + '%, ' + Math.round(_hsl[2] * 100) + '%)';
				break;
			case 'hsv':
				 this.value = 'hsv(' + _hue + ', ' + Math.round(_saturation) + '%, ' + Math.round(_value) + '%)';
				break;
			case 'rgb':
				var _hsv2rgb2 = hsv2rgb(_hue, _saturation, _value);
				var r = _hsv2rgb2.r;
				var g = _hsv2rgb2.g;
				var b = _hsv2rgb2.b;
				this.value = 'rgb(' + r + ', ' + g + ', ' + b + ')';
				break;
			default:
				this.value = toHex(hsv2rgb(_hue, _saturation, _value));
			}
		}
	};
	var draggable = function(element, options) {
		if (Vue.prototype.$isServer) return;
		var moveFn = function(event) {
			if (options.drag) {
				options.drag(event);
			}
		};
		var upFn = function(event) {
			document.removeEventListener('mousemove', moveFn);
			document.removeEventListener('mouseup', upFn);
			document.onselectstart = null;
			document.ondragstart = null;
			isDragging = false;
			if (options.end) {
				options.end(event);
			}
		};
		element.addEventListener('mousedown', function(event) {
			if (isDragging) return;
			document.onselectstart = function() { return false; };
			document.ondragstart = function() { return false; };
			document.addEventListener('mousemove', moveFn);
			document.addEventListener('mouseup', upFn);
			isDragging = true;
			if (options.start) {
				options.start(event);
			}
		});
	};
	var SvPanel = {
		template: '<div class="vue-color-svpanel" :style="{backgroundColor: background}"><div class="vue-color-svpanel__white"></div><div class="vue-color-svpanel__black"></div><div class="vue-color-svpanel__cursor" :style="{top: cursorTop + \'px\', left: cursorLeft + \'px\'}"><div></div></div></div>',
		props: {
			color: {
				required: true
			}
		},
		computed: {
			colorValue: function() {
				var hue = this.color.get('hue');
				var value = this.color.get('value');
				return {hue: hue, value: value};
			}
		},
		watch: {
			colorValue: function() {
				this.update();
			}
		},
		methods: {
			update: function() {
				var saturation = this.color.get('saturation');
				var value = this.color.get('value');
				var el = this.$el;
				var boundingClientRect = el.getBoundingClientRect();
				var width = boundingClientRect.width;
				var height = boundingClientRect.height;
				if (!height) height = width * 3 / 4;
				this.cursorLeft = saturation * width / 100;
				this.cursorTop = (100 - value) * height / 100;
				this.background = 'hsl(' + this.color.get('hue') + ', 100%, 50%)';
			},
			handleDrag: function(event) {
				var el = this.$el;
				var rect = el.getBoundingClientRect();
				var left = event.clientX - rect.left;
				var top = event.clientY - rect.top;
				left = Math.max(0, left);
				left = Math.min(left, rect.width);
				top = Math.max(0, top);
				top = Math.min(top, rect.height);
				this.cursorLeft = left;
				this.cursorTop = top;
				this.color.set({
					saturation: left / rect.width * 100,
					value: 100 - top / rect.height * 100
				});
			}
		},
		mounted: function() {
			var self = this;
			draggable(self.$el, {
				drag: function(event) {
					self.handleDrag(event);
				},
				end: function(event) {
					self.handleDrag(event);
				}
			});
			self.update();
		},
		data: function() {
			return {
				cursorTop: 0,
				cursorLeft: 0,
				background: 'hsl(0, 100%, 50%)'
			};
		}
	};
	var HueSlider = {
		template: '<div class="vue-color-hue-slider" :class="{ \'is-vertical\': vertical }"><div class="vue-color-hue-slider__bar" @click="handleClick" ref="bar"></div><div class="vue-color-hue-slider__thumb" :style="{left: thumbLeft + \'px\', top: thumbTop + \'px\'}" ref="thumb"></div></div>',
		props: {
			color: {
				required: true
			},
			vertical: Boolean
		},
		data: function() {
			return {
				thumbLeft: 0,
				thumbTop: 0
			};
		},
		computed: {
			hueValue: function() {
				var hue = this.color.get('hue');
				return hue;
			}
		},
		watch: {
			hueValue: function() {
				this.update();
			}
		},
		methods: {
			handleClick: function(event) {
				var thumb = this.$refs.thumb;
				var target = event.target;
				if (target !== thumb) {
					this.handleDrag(event);
				}
			},
			handleDrag: function(event) {
				var rect = this.$el.getBoundingClientRect();
				var thumb = this.$refs.thumb;
				var hue;
				if (!this.vertical) {
					var left = event.clientX - rect.left;
					left = Math.min(left, rect.width - thumb.offsetWidth / 2);
					left = Math.max(thumb.offsetWidth / 2, left);
					hue = Math.round((left - thumb.offsetWidth / 2) / (rect.width - thumb.offsetWidth) * 360);
				} else {
					var top = event.clientY - rect.top;
					top = Math.min(top, rect.height - thumb.offsetHeight / 2);
					top = Math.max(thumb.offsetHeight / 2, top);
					hue = Math.round((top - thumb.offsetHeight / 2) / (rect.height - thumb.offsetHeight) * 360);
				}
				this.color.set('hue', hue);
			},
			getThumbLeft: function() {
				if (this.vertical) return 0;
				var el = this.$el;
				var hue = this.color.get('hue');
				if (!el) return 0;
				var thumb = this.$refs.thumb;
				return Math.round(hue * (el.offsetWidth - thumb.offsetWidth / 2) / 360);
			},
			getThumbTop: function() {
				if (!this.vertical) return 0;
				var el = this.$el;
				var hue = this.color.get('hue');
				if (!el) return 0;
				var thumb = this.$refs.thumb;
				return Math.round(hue * (el.offsetHeight - thumb.offsetHeight / 2) / 360);
			},
			update: function() {
				this.thumbLeft = this.getThumbLeft();
				this.thumbTop = this.getThumbTop();
			}
		},
		mounted: function() {
			var self = this;
			var _$refs = self.$refs;
			var bar = _$refs.bar;
			var thumb = _$refs.thumb;
			var dragConfig = {
				drag: function(event) {
					self.handleDrag(event);
				},
				end: function(event) {
					self.handleDrag(event);
				}
			};
			draggable(bar, dragConfig);
			draggable(thumb, dragConfig);
			self.update();
		}
	};
	var AlphaSlider = {
		template: '<div class="vue-color-alpha-slider" :class="{ \'is-vertical\': vertical }"><div class="vue-color-alpha-slider__bar" @click="handleClick" ref="bar" :style="{background: background}"></div><div class="vue-color-alpha-slider__thumb" ref="thumb" :style="{left: thumbLeft + \'px\', top: thumbTop + \'px\'}"></div></div>',
		props: {
			color: {
				required: true
			},
			vertical: Boolean
		},
		watch: {
			'color._alpha': function() {
				this.update();
			},
			'color.value': function() {
				this.update();
			}
		},
		methods: {
			handleClick: function(event) {
				var thumb = this.$refs.thumb;
				var target = event.target;
				if (target !== thumb) {
					this.handleDrag(event);
				}
			},
			handleDrag: function(event) {
				var rect = this.$el.getBoundingClientRect();
				var thumb = this.$refs.thumb;
				if (!this.vertical) {
					var left = event.clientX - rect.left;
					left = Math.max(thumb.offsetWidth / 2, left);
					left = Math.min(left, rect.width - thumb.offsetWidth / 2);
					this.color.set('alpha', Math.round((left - thumb.offsetWidth / 2) / (rect.width - thumb.offsetWidth) * 100));
				} else {
					var top = event.clientY - rect.top;
					top = Math.max(thumb.offsetHeight / 2, top);
					top = Math.min(top, rect.height - thumb.offsetHeight / 2);
					this.color.set('alpha', Math.round((top - thumb.offsetHeight / 2) / (rect.height - thumb.offsetHeight) * 100));
				}
			},
			getThumbLeft: function() {
				if (this.vertical) return 0;
				var el = this.$el;
				var alpha = this.color._alpha;
				if (!el) return 0;
				var thumb = this.$refs.thumb;
				return Math.round(alpha * (el.offsetWidth - thumb.offsetWidth / 2) / 100);
			},
			getThumbTop: function() {
				if (!this.vertical) return 0;
				var el = this.$el;
				var alpha = this.color._alpha;
				if (!el) return 0;
				var thumb = this.$refs.thumb;
				return Math.round(alpha * (el.offsetHeight - thumb.offsetHeight / 2) / 100);
			},
			getBackground: function() {
				if (this.color && this.color.value) {
					var colorToRgb = this.color.toRgb();
					var r = colorToRgb.r;
					var g = colorToRgb.g;
					var b = colorToRgb.b;
					return 'linear-gradient(to right, rgba(' + r + ', ' + g + ', ' + b + ', 0) 0%, rgba(' + r + ', ' + g + ', ' + b + ', 1) 100%)';
				}
				return null;
			},
			update: function() {
				this.thumbLeft = this.getThumbLeft();
				this.thumbTop = this.getThumbTop();
				this.background = this.getBackground();
			}
		},
		data: function() {
			return {
				thumbLeft: 0,
				thumbTop: 0,
				background: null
			};
		},
		mounted: function() {
			var self = this;
			var _$refs = self.$refs;
			var bar = _$refs.bar;
			var thumb = _$refs.thumb;
			var dragConfig = {
				drag: function(event) {
					self.handleDrag(event);
				},
				end: function(event) {
					self.handleDrag(event);
				}
			};
			draggable(bar, dragConfig);
			draggable(thumb, dragConfig);
			self.update();
		}
	};
	var PickerDropdown = {
		template: '<transition name="vue-zoom-in-top" @after-leave="doDestroy"><div class="vue-color-dropdown" v-show="showPopper"><div class="vue-color-dropdown__main-wrapper"><hue-slider ref="hue" :color="color" vertical style="float: right;"></hue-slider><sv-panel ref="sl" :color="color"></sv-panel></div><alpha-slider v-if="showAlpha" ref="alpha" :color="color"></alpha-slider><div class="vue-color-dropdown__btns"><span class="vue-color-dropdown__value">{{ currentColor }}</span><a href="JavaScript:" class="vue-color-dropdown__link-btn" @click="$emit(\'clear\')">{{ $t(\'vue.colorpicker.clear\') }}</a><button class="vue-color-dropdown__btn" @click="confirmValue">{{ $t(\'vue.colorpicker.confirm\') }}</button></div></div></transition>',
		mixins: [VuePopper()],
		components: {
			SvPanel: SvPanel,
			HueSlider: HueSlider,
			AlphaSlider: AlphaSlider
		},
		props: {
			color: {
				required: true
			},
			showAlpha: Boolean
		},
		computed: {
			currentColor: function() {
				var parent = this.$parent;
				return !parent.value && !parent.showPanelColor ? '' : parent.color.value;
			}
		},
		methods: {
			confirmValue: function() {
				this.$emit('pick');
			}
		},
		mounted: function() {
			this.$parent.popperElm = this.popperElm = this.$el;
			this.referenceElm = this.$parent.$el;
		},
		watch: {
			showPopper: function(val) {
				var self = this;
				if (val === true) {
					self.$nextTick(function() {
						var _$refs = self.$refs;
						var sl = _$refs.sl;
						var hue = _$refs.hue;
						var alpha = _$refs.alpha;
						sl && sl.update();
						hue && hue.update();
						alpha && alpha.update();
					});
				}
			}
		}
	};
	var VueColorPicker = {
		template: '<div class="vue-color-picker" v-clickoutside="hide"><div class="vue-color-picker__trigger" @click="showPicker = !showPicker"><span class="vue-color-picker__color" :class="{ \'is-alpha\': showAlpha }"><span class="vue-color-picker__color-inner" :style="{backgroundColor: displayedColor}"></span><span class="vue-color-picker__empty vue-icon-close" v-if="!value && !showPanelColor"></span></span><span class="vue-color-picker__icon vue-icon-caret-bottom"></span></div><picker-dropdown ref="dropdown" class="vue-color-picker__panel" v-model="showPicker" @pick="confirmValue" @clear="clearValue" :color="color" :show-alpha="showAlpha"></picker-dropdown></div>',
		name: 'VueColorPicker',
		props: {
			value: {
				type: String
			},
			showAlpha: {
				type: Boolean
			},
			colorFormat: {
				type: String
			}
		},
		directives: {
			Clickoutside: VueUtil.component.clickoutside()
		},
		computed: {
			displayedColor: function() {
				if (!this.value && !this.showPanelColor) {
					return 'transparent';
				} else {
					var colorToRgb = this.color.toRgb();
					var r = colorToRgb.r;
					var g = colorToRgb.g;
					var b = colorToRgb.b;
					return this.showAlpha ? 'rgba(' + r + ', ' + g + ', ' + b + ', ' + this.color.get('alpha') / 100 + ')' : 'rgb(' + r + ', ' + g + ', ' + b + ')';
				}
			}
		},
		watch: {
			value: function(val) {
				if (!val) {
					this.showPanelColor = false;
				} else if (val !== this.color.value) {
					this.color.fromString(val);
				}
			},
			color: {
				deep: true,
				handler: function() {
					this.showPanelColor = true;
				}
			}
		},
		methods: {
			confirmValue: function(value) {
				this.$emit('input', this.color.value);
				this.$emit('change', this.color.value);
				this.showPicker = false;
			},
			clearValue: function() {
				this.$emit('input', null);
				this.$emit('change', null);
				this.showPanelColor = false;
				this.showPicker = false;
				this.resetColor();
			},
			hide: function() {
				this.showPicker = false;
				this.resetColor();
			},
			resetColor: function() {
				var self = this;
				self.$nextTick(function() {
					if (self.value) {
						self.color.fromString(self.value);
					} else {
						self.showPanelColor = false;
					}
				});
			}
		},
		mounted: function() {
			var value = this.value;
			if (value) {
				this.color.fromString(value);
			}
			this.popperElm = this.$refs.dropdown.$el;
		},
		data: function() {
			var color = new Color({
				enableAlpha: this.showAlpha,
				format: this.colorFormat
			});
			return {
				color: color,
				showPicker: false,
				showPanelColor: false
			};
		},
		components: {
			PickerDropdown: PickerDropdown
		}
	};
	Vue.component(VueColorPicker.name, VueColorPicker);
});
