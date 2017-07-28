!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(definition);
	} else {
		context[name] = definition();
	}
})('Cleave', this, function() {
	'use strict';
	var NumeralFormatter = function(numeralDecimalMark, numeralDecimalScale, numeralThousandsGroupStyle, numeralPositiveOnly, delimiter) {
		var owner = this;
		owner.numeralDecimalMark = numeralDecimalMark || '.';
		owner.numeralDecimalScale = numeralDecimalScale >= 0 ? numeralDecimalScale : 2;
		owner.numeralThousandsGroupStyle = numeralThousandsGroupStyle || NumeralFormatter.groupStyle.thousand;
		owner.numeralPositiveOnly = !!numeralPositiveOnly;
		owner.delimiter = (delimiter || delimiter === '') ? delimiter : ',';
		owner.delimiterRE = delimiter ? new RegExp('\\' + delimiter,'g') : '';
	};
	NumeralFormatter.groupStyle = {
		thousand: 'thousand',
		lakh: 'lakh',
		wan: 'wan'
	};
	NumeralFormatter.prototype = {
		getRawValue: function(value) {
			return value.replace(this.delimiterRE, '').replace(this.numeralDecimalMark, '.');
		},
		format: function(value) {
			var owner = this, parts, partInteger, partDecimal = '';
			value = value.replace(/[A-Za-z]/g, '').replace(owner.numeralDecimalMark, 'M').replace(/[^\dM-]/g, '').replace(/^\-/, 'N').replace(/\-/g, '').replace('N', owner.numeralPositiveOnly ? '' : '-').replace('M', owner.numeralDecimalMark).replace(/^(-)?0+(?=\d)/, '$1');
			partInteger = value;
			if (value.indexOf(owner.numeralDecimalMark) >= 0) {
				parts = value.split(owner.numeralDecimalMark);
				partInteger = parts[0];
				partDecimal = owner.numeralDecimalMark + parts[1].slice(0, owner.numeralDecimalScale);
			}
			switch (owner.numeralThousandsGroupStyle) {
			case NumeralFormatter.groupStyle.lakh:
				partInteger = partInteger.replace(/(\d)(?=(\d\d)+\d$)/g, '$1' + owner.delimiter);
				break;
			case NumeralFormatter.groupStyle.wan:
				partInteger = partInteger.replace(/(\d)(?=(\d{4})+$)/g, '$1' + owner.delimiter);
				break;
			default:
				partInteger = partInteger.replace(/(\d)(?=(\d{3})+$)/g, '$1' + owner.delimiter);
			}
			return partInteger.toString() + (owner.numeralDecimalScale > 0 ? partDecimal.toString() : '');
		}
	};
	var DateFormatter = function(datePattern) {
		var owner = this;
		owner.blocks = [];
		owner.datePattern = datePattern;
		owner.initBlocks();
	};
	DateFormatter.prototype = {
		initBlocks: function() {
			var owner = this;
			owner.datePattern.forEach(function(value) {
				if (value === 'Y') {
					owner.blocks.push(4);
				} else {
					owner.blocks.push(2);
				}
			});
		},
		getBlocks: function() {
			return this.blocks;
		},
		getValidatedDate: function(value) {
			var owner = this
			  , result = '';
			value = value.replace(/[^\d]/g, '');
			owner.blocks.forEach(function(length, index) {
				if (value.length > 0) {
					var sub = value.slice(0, length)
					  , sub0 = sub.slice(0, 1)
					  , rest = value.slice(length);
					switch (owner.datePattern[index]) {
					case 'd':
						if (sub === '00') {
							sub = '01';
						} else if (parseInt(sub0, 10) > 3) {
							sub = '0' + sub0;
						} else if (parseInt(sub, 10) > 31) {
							sub = '31';
						}
						break;
					case 'm':
						if (sub === '00') {
							sub = '01';
						} else if (parseInt(sub0, 10) > 1) {
							sub = '0' + sub0;
						} else if (parseInt(sub, 10) > 12) {
							sub = '12';
						}
						break;
					}
					result += sub;
					value = rest;
				}
			});
			return result;
		}
	};
	var PhoneFormatter = function(formatter, delimiter) {
		var owner = this;
		owner.delimiter = (delimiter || delimiter === '') ? delimiter : ' ';
		owner.delimiterRE = delimiter ? new RegExp('\\' + delimiter,'g') : '';
		owner.formatter = formatter;
	};
	PhoneFormatter.prototype = {
		setFormatter: function(formatter) {
			this.formatter = formatter;
		},
		format: function(phoneNumber) {
			var owner = this;
			owner.formatter.clear();
			phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
			phoneNumber = phoneNumber.replace(owner.delimiterRE, '');
			var result = '', current, validated = false;
			for (var i = 0, iMax = phoneNumber.length; i < iMax; i++) {
				current = owner.formatter.inputDigit(phoneNumber.charAt(i));
				if (/[\s()-]/g.test(current)) {
					result = current;
					validated = true;
				} else {
					if (!validated) {
						result = current;
					}
				}
			}
			result = result.replace(/[()]/g, '');
			result = result.replace(/[\s-]/g, owner.delimiter);
			return result;
		}
	};
	var CreditCardDetector = {
		blocks: {
			uatp: [4, 5, 6],
			amex: [4, 6, 5],
			diners: [4, 6, 4],
			discover: [4, 4, 4, 4],
			mastercard: [4, 4, 4, 4],
			dankort: [4, 4, 4, 4],
			instapayment: [4, 4, 4, 4],
			jcb: [4, 4, 4, 4],
			maestro: [4, 4, 4, 4],
			visa: [4, 4, 4, 4],
			general: [4, 4, 4, 4],
			generalStrict: [4, 4, 4, 7]
		},
		re: {
			uatp: /^(?!1800)1\d{0,14}/,
			amex: /^3[47]\d{0,13}/,
			discover: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
			diners: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
			mastercard: /^(5[1-5]|2[2-7])\d{0,14}/,
			dankort: /^(5019|4175|4571)\d{0,12}/,
			instapayment: /^63[7-9]\d{0,13}/,
			jcb: /^(?:2131|1800|35\d{0,2})\d{0,12}/,
			maestro: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
			visa: /^4\d{0,15}/
		},
		getInfo: function(value, strictMode) {
			var blocks = CreditCardDetector.blocks
			  , re = CreditCardDetector.re;
			strictMode = !!strictMode;
			if (re.amex.test(value)) {
				return {
					type: 'amex',
					blocks: blocks.amex
				};
			} else if (re.uatp.test(value)) {
				return {
					type: 'uatp',
					blocks: blocks.uatp
				};
			} else if (re.diners.test(value)) {
				return {
					type: 'diners',
					blocks: blocks.diners
				};
			} else if (re.discover.test(value)) {
				return {
					type: 'discover',
					blocks: blocks.discover
				};
			} else if (re.mastercard.test(value)) {
				return {
					type: 'mastercard',
					blocks: blocks.mastercard
				};
			} else if (re.dankort.test(value)) {
				return {
					type: 'dankort',
					blocks: blocks.dankort
				};
			} else if (re.instapayment.test(value)) {
				return {
					type: 'instapayment',
					blocks: blocks.instapayment
				};
			} else if (re.jcb.test(value)) {
				return {
					type: 'jcb',
					blocks: blocks.jcb
				};
			} else if (re.maestro.test(value)) {
				return {
					type: 'maestro',
					blocks: blocks.maestro
				};
			} else if (re.visa.test(value)) {
				return {
					type: 'visa',
					blocks: strictMode ? blocks.generalStrict : blocks.visa
				};
			} else {
				return {
					type: 'unknown',
					blocks: blocks.general
				};
			}
		}
	};
	var Util = {
		noop: function() {},
		strip: function(value, re) {
			return value.replace(re, '');
		},
		isDelimiter: function(letter, delimiter, delimiters) {
			if (delimiters.length === 0) {
				return letter === delimiter;
			}
			return delimiters.some(function(current) {
				if (letter === current) {
					return true;
				}
			});
		},
		stripDelimiters: function(value, delimiter, delimiters) {
			if (delimiters.length === 0) {
				var delimiterRE = delimiter ? new RegExp('\\' + delimiter,'g') : '';
				return value.replace(delimiterRE, '');
			}
			delimiters.forEach(function(current) {
				value = value.replace(new RegExp('\\' + current,'g'), '');
			});
			return value;
		},
		headStr: function(str, length) {
			return str.slice(0, length);
		},
		getMaxLength: function(blocks) {
			return blocks.reduce(function(previous, current) {
				return previous + current;
			}, 0);
		},
		getPrefixStrippedValue: function(value, prefix, prefixLength) {
			if (value.slice(0, prefixLength) !== prefix) {
				var diffIndex = this.getFirstDiffIndex(prefix, value.slice(0, prefixLength));
				value = prefix + value.slice(diffIndex, diffIndex + 1) + value.slice(prefixLength + 1);
			}
			return value.slice(prefixLength);
		},
		getFirstDiffIndex: function(prev, current) {
			var index = 0;
			while (prev.charAt(index) === current.charAt(index))
				if (prev.charAt(index++) === '')
					return -1;
			return index;
		},
		getFormattedValue: function(value, blocks, blocksLength, delimiter, delimiters) {
			var result = '', multipleDelimiters = delimiters.length > 0, currentDelimiter;
			if (blocksLength === 0) {
				return value;
			}
			blocks.forEach(function(length, index) {
				if (value.length > 0) {
					var sub = value.slice(0, length)
					  , rest = value.slice(length);
					result += sub;
					currentDelimiter = multipleDelimiters ? (delimiters[index] || currentDelimiter) : delimiter;
					if (sub.length === length && index < blocksLength - 1) {
						result += currentDelimiter;
					}
					value = rest;
				}
			});
			return result;
		},
		isAndroid: function() {
			if (navigator && /android/i.test(navigator.userAgent)) {
				return true;
			}
			return false;
		}
	};
	var DefaultProperties = {
		assign: function(target, opts) {
			target = target || {};
			opts = opts || {};
			target.creditCard = !!opts.creditCard;
			target.creditCardStrictMode = !!opts.creditCardStrictMode;
			target.creditCardType = '';
			target.onCreditCardTypeChanged = opts.onCreditCardTypeChanged || (function() {}
			);
			target.phone = !!opts.phone;
			target.phoneRegionCode = opts.phoneRegionCode || 'AU';
			target.phoneFormatter = {};
			target.date = !!opts.date;
			target.datePattern = opts.datePattern || ['d', 'm', 'Y'];
			target.dateFormatter = {};
			target.numeral = !!opts.numeral;
			target.numeralDecimalScale = opts.numeralDecimalScale >= 0 ? opts.numeralDecimalScale : 2;
			target.numeralDecimalMark = opts.numeralDecimalMark || '.';
			target.numeralThousandsGroupStyle = opts.numeralThousandsGroupStyle || 'thousand';
			target.numeralPositiveOnly = !!opts.numeralPositiveOnly;
			target.numericOnly = target.creditCard || target.date || !!opts.numericOnly;
			target.uppercase = !!opts.uppercase;
			target.lowercase = !!opts.lowercase;
			target.prefix = (target.creditCard || target.phone || target.date) ? '' : (opts.prefix || '');
			target.prefixLength = target.prefix.length;
			target.rawValueTrimPrefix = !!opts.rawValueTrimPrefix;
			target.copyDelimiter = !!opts.copyDelimiter;
			target.initValue = opts.initValue === undefined ? '' : opts.initValue.toString();
			target.delimiter = (opts.delimiter || opts.delimiter === '') ? opts.delimiter : (opts.date ? '/' : (opts.numeral ? ',' : ' '));
			target.delimiters = opts.delimiters || [];
			target.blocks = opts.blocks || [];
			target.blocksLength = target.blocks.length;
			target.root = (typeof global === 'object' && global) ? global : window;
			target.maxLength = 0;
			target.backspace = false;
			target.result = '';
			return target;
		}
	};
	var Cleave = function(element, opts) {
		var owner = this;
		if (typeof element === 'string') {
			owner.element = document.querySelector(element);
		} else {
			owner.element = ((typeof element.length !== 'undefined') && element.length > 0) ? element[0] : element;
		}
		if (!owner.element) {
			throw new Error('[cleave.js] Please check the element');
		}
		opts.initValue = owner.element.value;
		owner.properties = Cleave.DefaultProperties.assign({}, opts);
		owner.init();
	};
	Cleave.prototype = {
		init: function() {
			var owner = this
			  , pps = owner.properties;
			if (!pps.numeral && !pps.phone && !pps.creditCard && !pps.date && (pps.blocksLength === 0 && !pps.prefix)) {
				return;
			}
			pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
			owner.isAndroid = Cleave.Util.isAndroid();
			owner.onChangeListener = owner.onChange.bind(owner);
			owner.onKeyDownListener = owner.onKeyDown.bind(owner);
			owner.onCutListener = owner.onCut.bind(owner);
			owner.onCopyListener = owner.onCopy.bind(owner);
			owner.element.addEventListener('input', owner.onChangeListener);
			owner.element.addEventListener('keydown', owner.onKeyDownListener);
			owner.element.addEventListener('cut', owner.onCutListener);
			owner.element.addEventListener('copy', owner.onCopyListener);
			owner.initPhoneFormatter();
			owner.initDateFormatter();
			owner.initNumeralFormatter();
			owner.onInput(pps.initValue);
		},
		initNumeralFormatter: function() {
			var owner = this
			  , pps = owner.properties;
			if (!pps.numeral) {
				return;
			}
			pps.numeralFormatter = new Cleave.NumeralFormatter(pps.numeralDecimalMark,pps.numeralDecimalScale,pps.numeralThousandsGroupStyle,pps.numeralPositiveOnly,pps.delimiter);
		},
		initDateFormatter: function() {
			var owner = this
			  , pps = owner.properties;
			if (!pps.date) {
				return;
			}
			pps.dateFormatter = new Cleave.DateFormatter(pps.datePattern);
			pps.blocks = pps.dateFormatter.getBlocks();
			pps.blocksLength = pps.blocks.length;
			pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
		},
		initPhoneFormatter: function() {
			var owner = this
			  , pps = owner.properties;
			if (!pps.phone) {
				return;
			}
			try {
				pps.phoneFormatter = new Cleave.PhoneFormatter(new pps.root.Cleave.AsYouTypeFormatter(pps.phoneRegionCode),pps.delimiter);
			} catch (ex) {
				throw new Error('[cleave.js] Please include phone-type-formatter.{country}.js lib');
			}
		},
		onKeyDown: function(event) {
			var owner = this
			  , pps = owner.properties
			  , charCode = event.which || event.keyCode;
			if (charCode === 8 && Cleave.Util.isDelimiter(owner.element.value.slice(-1), pps.delimiter, pps.delimiters)) {
				pps.backspace = true;
				return;
			}
			pps.backspace = false;
		},
		onChange: function() {
			this.onInput(this.element.value);
		},
		onCut: function(e) {
			this.copyClipboardData(e);
			this.onInput('');
		},
		onCopy: function(e) {
			this.copyClipboardData(e);
		},
		copyClipboardData: function(e) {
			var owner = this
			  , pps = owner.properties
			  , Util = Cleave.Util
			  , inputValue = owner.element.value
			  , textToCopy = '';
			if (!pps.copyDelimiter) {
				textToCopy = Util.stripDelimiters(inputValue, pps.delimiter, pps.delimiters);
			} else {
				textToCopy = inputValue;
			}
			try {
				if (e.clipboardData) {
					e.clipboardData.setData('Text', textToCopy);
				} else {
					window.clipboardData.setData('Text', textToCopy);
				}
				e.preventDefault();
			} catch (ex) {}
		},
		onInput: function(value) {
			var owner = this
			  , pps = owner.properties
			  , prev = value
			  , Util = Cleave.Util;
			if (!pps.numeral && pps.backspace && !Util.isDelimiter(value.slice(-1), pps.delimiter, pps.delimiters)) {
				value = Util.headStr(value, value.length - 1);
			}
			if (pps.phone) {
				pps.result = pps.phoneFormatter.format(value);
				owner.updateValueState();
				return;
			}
			if (pps.numeral) {
				pps.result = pps.prefix + pps.numeralFormatter.format(value);
				owner.updateValueState();
				return;
			}
			if (pps.date) {
				value = pps.dateFormatter.getValidatedDate(value);
			}
			value = Util.stripDelimiters(value, pps.delimiter, pps.delimiters);
			value = Util.getPrefixStrippedValue(value, pps.prefix, pps.prefixLength);
			value = pps.numericOnly ? Util.strip(value, /[^\d]/g) : value;
			value = pps.uppercase ? value.toUpperCase() : value;
			value = pps.lowercase ? value.toLowerCase() : value;
			if (pps.prefix) {
				value = pps.prefix + value;
				if (pps.blocksLength === 0) {
					pps.result = value;
					owner.updateValueState();
					return;
				}
			}
			if (pps.creditCard) {
				owner.updateCreditCardPropsByValue(value);
			}
			value = Util.headStr(value, pps.maxLength);
			pps.result = Util.getFormattedValue(value, pps.blocks, pps.blocksLength, pps.delimiter, pps.delimiters);
			if (prev === pps.result && prev !== pps.prefix) {
				return;
			}
			owner.updateValueState();
		},
		updateCreditCardPropsByValue: function(value) {
			var owner = this, pps = owner.properties, Util = Cleave.Util, creditCardInfo;
			if (Util.headStr(pps.result, 4) === Util.headStr(value, 4)) {
				return;
			}
			creditCardInfo = Cleave.CreditCardDetector.getInfo(value, pps.creditCardStrictMode);
			pps.blocks = creditCardInfo.blocks;
			pps.blocksLength = pps.blocks.length;
			pps.maxLength = Util.getMaxLength(pps.blocks);
			if (pps.creditCardType !== creditCardInfo.type) {
				pps.creditCardType = creditCardInfo.type;
				pps.onCreditCardTypeChanged.call(owner, pps.creditCardType);
			}
		},
		updateValueState: function() {
			var owner = this;
			if (owner.isAndroid) {
				window.setTimeout(function() {
					owner.element.value = owner.properties.result;
				}, 1);
				return;
			}
			owner.element.value = owner.properties.result;
		},
		setPhoneRegionCode: function(phoneRegionCode) {
			var owner = this
			  , pps = owner.properties;
			pps.phoneRegionCode = phoneRegionCode;
			owner.initPhoneFormatter();
			owner.onChange();
		},
		setRawValue: function(value) {
			var owner = this
			  , pps = owner.properties;
			value = value !== undefined ? value.toString() : '';
			if (pps.numeral) {
				value = value.replace('.', pps.numeralDecimalMark);
			}
			owner.element.value = value;
			owner.onInput(value);
		},
		getRawValue: function() {
			var owner = this
			  , pps = owner.properties
			  , Util = Cleave.Util
			  , rawValue = owner.element.value;
			if (pps.rawValueTrimPrefix) {
				rawValue = Util.getPrefixStrippedValue(rawValue, pps.prefix, pps.prefixLength);
			}
			if (pps.numeral) {
				rawValue = pps.numeralFormatter.getRawValue(rawValue);
			} else {
				rawValue = Util.stripDelimiters(rawValue, pps.delimiter, pps.delimiters);
			}
			return rawValue;
		},
		getFormattedValue: function() {
			return this.element.value;
		},
		destroy: function() {
			var owner = this;
			owner.element.removeEventListener('input', owner.onChangeListener);
			owner.element.removeEventListener('keydown', owner.onKeyDownListener);
			owner.element.removeEventListener('cut', owner.onCutListener);
			owner.element.removeEventListener('copy', owner.onCopyListener);
		},
		toString: function() {
			return '[Cleave Object]';
		}
	};
	Cleave.NumeralFormatter = NumeralFormatter;
	Cleave.DateFormatter = DateFormatter;
	Cleave.PhoneFormatter = PhoneFormatter;
	Cleave.CreditCardDetector = CreditCardDetector;
	Cleave.Util = Util;
	Cleave.DefaultProperties = DefaultProperties;
	return Cleave;
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(definition);
	} else {
		context[name] = definition();
	}
})('DateUtil', this, function() {
	'use strict';
	var fecha = {};
	var token = /d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
	var twoDigits = /\d\d?/;
	var threeDigits = /\d{3}/;
	var fourDigits = /\d{4}/;
	var word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
	var noop = function() {};
	function shorten(arr, sLen) {
		var newArr = [];
		for (var i = 0, len = arr.length; i < len; i++) {
			newArr.push(arr[i].substr(0, sLen));
		}
		return newArr;
	}
	function monthUpdate(arrName) {
		return function(d, v, i18n) {
			var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
			if (~index) {
				d.month = index;
			}
		}
	}
	function pad(val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) {
			val = '0' + val;
		}
		return val;
	}
	var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var monthNamesShort = shorten(monthNames, 3);
	var dayNamesShort = shorten(dayNames, 3);
	fecha.i18n = {
		dayNamesShort: dayNamesShort,
		dayNames: dayNames,
		monthNamesShort: monthNamesShort,
		monthNames: monthNames,
		amPm: ['am', 'pm'],
		DoFn: function DoFn(D) {
			return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
		}
	};
	var formatFlags = {
		D: function(dateObj) {
			return dateObj.getDay();
		},
		DD: function(dateObj) {
			return pad(dateObj.getDay());
		},
		Do: function(dateObj, i18n) {
			return i18n.DoFn(dateObj.getDate());
		},
		d: function(dateObj) {
			return dateObj.getDate();
		},
		dd: function(dateObj) {
			return pad(dateObj.getDate());
		},
		ddd: function(dateObj, i18n) {
			return i18n.dayNamesShort[dateObj.getDay()];
		},
		dddd: function(dateObj, i18n) {
			return i18n.dayNames[dateObj.getDay()];
		},
		M: function(dateObj) {
			return dateObj.getMonth() + 1;
		},
		MM: function(dateObj) {
			return pad(dateObj.getMonth() + 1);
		},
		MMM: function(dateObj, i18n) {
			return i18n.monthNamesShort[dateObj.getMonth()];
		},
		MMMM: function(dateObj, i18n) {
			return i18n.monthNames[dateObj.getMonth()];
		},
		yy: function(dateObj) {
			return String(dateObj.getFullYear()).substr(2);
		},
		yyyy: function(dateObj) {
			return dateObj.getFullYear();
		},
		h: function(dateObj) {
			return dateObj.getHours() % 12 || 12;
		},
		hh: function(dateObj) {
			return pad(dateObj.getHours() % 12 || 12);
		},
		H: function(dateObj) {
			return dateObj.getHours();
		},
		HH: function(dateObj) {
			return pad(dateObj.getHours());
		},
		m: function(dateObj) {
			return dateObj.getMinutes();
		},
		mm: function(dateObj) {
			return pad(dateObj.getMinutes());
		},
		s: function(dateObj) {
			return dateObj.getSeconds();
		},
		ss: function(dateObj) {
			return pad(dateObj.getSeconds());
		},
		S: function(dateObj) {
			return Math.round(dateObj.getMilliseconds() / 100);
		},
		SS: function(dateObj) {
			return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
		},
		SSS: function(dateObj) {
			return pad(dateObj.getMilliseconds(), 3);
		},
		a: function(dateObj, i18n) {
			return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
		},
		A: function(dateObj, i18n) {
			return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
		},
		ZZ: function(dateObj) {
			var o = dateObj.getTimezoneOffset();
			return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4);
		}
	};
	var parseFlags = {
		d: [twoDigits, function(d, v) {
			d.day = v;
		}
		],
		M: [twoDigits, function(d, v) {
			d.month = v - 1;
		}
		],
		yy: [twoDigits, function(d, v) {
			var da = new Date()
			 , cent = +('' + da.getFullYear()).substr(0, 2);
			d.year = '' + (v > 68 ? cent - 1 : cent) + v;
		}
		],
		h: [twoDigits, function(d, v) {
			d.hour = v;
		}
		],
		m: [twoDigits, function(d, v) {
			d.minute = v;
		}
		],
		s: [twoDigits, function(d, v) {
			d.second = v;
		}
		],
		yyyy: [fourDigits, function(d, v) {
			d.year = v;
		}
		],
		S: [/\d/, function(d, v) {
			d.millisecond = v * 100;
		}
		],
		SS: [/\d{2}/, function(d, v) {
			d.millisecond = v * 10;
		}
		],
		SSS: [threeDigits, function(d, v) {
			d.millisecond = v;
		}
		],
		D: [twoDigits, noop],
		ddd: [word, noop],
		MMM: [word, monthUpdate('monthNamesShort')],
		MMMM: [word, monthUpdate('monthNames')],
		a: [word, function(d, v, i18n) {
			var val = v.toLowerCase();
			if (val === i18n.amPm[0]) {
				d.isPm = false;
			} else if (val === i18n.amPm[1]) {
				d.isPm = true;
			}
		}
		],
		ZZ: [/[\+\-]\d\d:?\d\d/, function(d, v) {
			var parts = (v + '').match(/([\+\-]|\d\d)/gi), minutes;
			if (parts) {
				minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
				d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
			}
		}
		]
	};
	parseFlags.DD = parseFlags.D;
	parseFlags.dddd = parseFlags.ddd;
	parseFlags.Do = parseFlags.dd = parseFlags.d;
	parseFlags.mm = parseFlags.m;
	parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
	parseFlags.MM = parseFlags.M;
	parseFlags.ss = parseFlags.s;
	parseFlags.A = parseFlags.a;
	fecha.masks = {
		'default': 'ddd MMM dd yyyy HH:mm:ss',
		shortDate: 'M/D/yy',
		mediumDate: 'MMM d, yyyy',
		longDate: 'MMMM d, yyyy',
		fullDate: 'dddd, MMMM d, yyyy',
		shortTime: 'HH:mm',
		mediumTime: 'HH:mm:ss',
		longTime: 'HH:mm:ss.SSS'
	};
	fecha.format = function(dateObj, mask, i18nSettings) {
		var i18n = i18nSettings || fecha.i18n;
		if (typeof dateObj === 'number') {
			dateObj = new Date(dateObj);
		}
		if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
			throw new Error('Invalid Date in fecha.format');
		}
		mask = fecha.masks[mask] || mask || fecha.masks['default'];
		return mask.replace(token, function($0) {
			return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
		});
	}
	fecha.parse = function(dateStr, format, i18nSettings) {
		var i18n = i18nSettings || fecha.i18n;
		if (typeof format !== 'string') {
			throw new Error('Invalid format in fecha.parse');
		}
		format = fecha.masks[format] || format;
		if (dateStr.length > 1000) {
			return false;
		}
		var isValid = true;
		var dateInfo = {};
		format.replace(token, function($0) {
			if (parseFlags[$0]) {
				var info = parseFlags[$0];
				var index = dateStr.search(info[0]);
				if (!~index) {
					isValid = false;
				} else {
					dateStr.replace(info[0], function(result) {
						info[1](dateInfo, result, i18n);
						dateStr = dateStr.substr(index + result.length);
						return result;
					});
				}
			}
			return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
		});
		if (!isValid) {
			return false;
		}
		var today = new Date();
		if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
			dateInfo.hour = +dateInfo.hour + 12;
		} else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
			dateInfo.hour = 0;
		}
		var date;
		if (dateInfo.timezoneOffset != null) {
			dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
			date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1, dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
		} else {
			date = new Date(dateInfo.year || today.getFullYear(),dateInfo.month || 0,dateInfo.day || 1,dateInfo.hour || 0,dateInfo.minute || 0,dateInfo.second || 0,dateInfo.millisecond || 0);
		}
		return date;
	}
	return fecha;
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(definition);
	} else {
		context[name] = definition();
	}
})('Popper', this, function() {
	'use strict';
	var root = window;
	var DEFAULTS = {
		placement: 'bottom',
		gpuAcceleration: true,
		offset: 0,
		boundariesElement: 'viewport',
		boundariesPadding: 5,
		preventOverflowOrder: ['left', 'right', 'top', 'bottom'],
		flipBehavior: 'flip',
		arrowElement: '[x-arrow]',
		modifiers: ['shift', 'offset', 'preventOverflow', 'keepTogether', 'arrow', 'flip', 'applyStyle'],
		modifiersIgnored: [],
		forceAbsolute: false,
		removeOnDestroy: true
	};
	function Popper(reference, popper, options) {
		this._reference = reference.jquery ? reference[0] : reference;
		this.state = {};
		var isNotDefined = typeof popper === 'undefined' || popper === null;
		var isConfig = popper && Object.prototype.toString.call(popper) === '[object Object]';
		if (isNotDefined || isConfig) {
			this._popper = this.parse(isConfig ? popper : {});
		} else {
			this._popper = popper.jquery ? popper[0] : popper;
		}
		this._options = Object.assign({}, DEFAULTS, options);
		this._options.modifiers = this._options.modifiers.map(function(modifier) {
			if (this._options.modifiersIgnored.indexOf(modifier) !== -1)
				return;
			if (modifier === 'applyStyle') {
				this._popper.setAttribute('x-placement', this._options.placement);
			}
			return this.modifiers[modifier] || modifier;
		}
		.bind(this));
		this.state.position = this._getPosition(this._popper, this._reference);
		setStyle(this._popper, {
			position: this.state.position,
			top: 0
		});
		this.update();
		this._setupEventListeners();
		return this;
	}
	Popper.prototype.destroy = function() {
		this._popper.removeAttribute('x-placement');
		this._popper.style.left = '';
		this._popper.style.position = '';
		this._popper.style.top = '';
		this._popper.style[getSupportedPropertyName('transform')] = '';
		this._removeEventListeners();
		if (this._options.removeOnDestroy) {
			this._popper.parentElement.removeChild(this._popper);
		}
		return this;
	}
	Popper.prototype.update = function() {
		var data = {
			instance: this,
			styles: {}
		};
		data.placement = this._options.placement;
		data._originalPlacement = this._options.placement;
		data.offsets = this._getOffsets(this._popper, this._reference, data.placement);
		data.boundaries = this._getBoundaries(data, this._options.boundariesPadding, this._options.boundariesElement);
		data = this.runModifiers(data, this._options.modifiers);
		if (typeof this.state.updateCallback === 'function') {
			this.state.updateCallback(data);
		}
	}
	Popper.prototype.onCreate = function(callback) {
		callback(this);
		return this;
	}
	Popper.prototype.onUpdate = function(callback) {
		this.state.updateCallback = callback;
		return this;
	}
	Popper.prototype.parse = function(config) {
		var defaultConfig = {
			tagName: 'div',
			classNames: ['popper'],
			attributes: [],
			parent: root.document.body,
			content: '',
			contentType: 'text',
			arrowTagName: 'div',
			arrowClassNames: ['popper__arrow'],
			arrowAttributes: ['x-arrow']
		};
		config = Object.assign({}, defaultConfig, config);
		var d = root.document;
		var popper = d.createElement(config.tagName);
		addClassNames(popper, config.classNames);
		addAttributes(popper, config.attributes);
		if (config.contentType === 'node') {
			popper.appendChild(config.content.jquery ? config.content[0] : config.content);
		} else if (config.contentType === 'html') {
			popper.innerHTML = config.content;
		} else {
			popper.textContent = config.content;
		}
		if (config.arrowTagName) {
			var arrow = d.createElement(config.arrowTagName);
			addClassNames(arrow, config.arrowClassNames);
			addAttributes(arrow, config.arrowAttributes);
			popper.appendChild(arrow);
		}
		var parent = config.parent.jquery ? config.parent[0] : config.parent;
		if (typeof parent === 'string') {
			parent = d.querySelectorAll(config.parent);
			if (parent.length > 1) {
				console.warn('WARNING: the given \'parent\' query(' + config.parent + ') matched more than one element, the first one will be used');
			}
			if (parent.length === 0) {
				throw 'ERROR: the given \'parent\' doesn\'t exists!';
			}
			parent = parent[0];
		}
		if (parent.length > 1 && parent instanceof Element === false) {
			console.warn('WARNING: you have passed as parent a list of elements, the first one will be used');
			parent = parent[0];
		}
		parent.appendChild(popper);
		return popper;
		function addClassNames(element, classNames) {
			classNames.forEach(function(className) {
				element.classList.add(className);
			});
		}
		function addAttributes(element, attributes) {
			attributes.forEach(function(attribute) {
				element.setAttribute(attribute.split(':')[0], attribute.split(':')[1] || '');
			});
		}
	}
	Popper.prototype._getPosition = function(popper, reference) {
		if (this._options.forceAbsolute) {
			return 'absolute';
		}
		var isParentFixed = isFixed(reference);
		return isParentFixed ? 'fixed' : 'absolute';
	}
	Popper.prototype._getOffsets = function(popper, reference, placement) {
		placement = placement.split('-')[0];
		var popperOffsets = {};
		popperOffsets.position = this.state.position;
		var isParentFixed = popperOffsets.position === 'fixed';
		var referenceOffsets = getOffsetRectRelativeToCustomParent(reference, getOffsetParent(popper), isParentFixed);
		var popperRect = getOuterSizes(popper);
		if (['right', 'left'].indexOf(placement) !== -1) {
			popperOffsets.top = referenceOffsets.top + referenceOffsets.height / 2 - popperRect.height / 2;
			if (placement === 'left') {
				popperOffsets.left = referenceOffsets.left - popperRect.width;
			} else {
				popperOffsets.left = referenceOffsets.right;
			}
		} else {
			popperOffsets.left = referenceOffsets.left + referenceOffsets.width / 2 - popperRect.width / 2;
			if (placement === 'top') {
				popperOffsets.top = referenceOffsets.top - popperRect.height;
			} else {
				popperOffsets.top = referenceOffsets.bottom;
			}
		}
		popperOffsets.width = popperRect.width;
		popperOffsets.height = popperRect.height;
		return {
			popper: popperOffsets,
			reference: referenceOffsets
		};
	}
	Popper.prototype._setupEventListeners = function() {
		this.state.updateBound = this.update.bind(this);
		root.addEventListener('resize', this.state.updateBound);
		if (this._options.boundariesElement !== 'window') {
			var target = getScrollParent(this._reference);
			if (target === root.document.body || target === root.document.documentElement) {
				target = root;
			}
			target.addEventListener('scroll', this.state.updateBound);
		}
	}
	Popper.prototype._removeEventListeners = function() {
		root.removeEventListener('resize', this.state.updateBound);
		if (this._options.boundariesElement !== 'window') {
			var target = getScrollParent(this._reference);
			if (target === root.document.body || target === root.document.documentElement) {
				target = root;
			}
			target.removeEventListener('scroll', this.state.updateBound);
		}
		this.state.updateBound = null;
	}
	Popper.prototype._getBoundaries = function(data, padding, boundariesElement) {
		var boundaries = {};
		var width, height;
		if (boundariesElement === 'window') {
			var body = root.document.body
			  , html = root.document.documentElement;
			height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
			boundaries = {
				top: 0,
				right: width,
				bottom: height,
				left: 0
			};
		} else if (boundariesElement === 'viewport') {
			var offsetParent = getOffsetParent(this._popper);
			var scrollParent = getScrollParent(this._popper);
			var offsetParentRect = getOffsetRect(offsetParent);
			var getScrollTopValue = function(element) {
				return element == document.body ? Math.max(document.documentElement.scrollTop, document.body.scrollTop) : element.scrollTop;
			}
			var getScrollLeftValue = function(element) {
				return element == document.body ? Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) : element.scrollLeft;
			}
			var scrollTop = data.offsets.popper.position === 'fixed' ? 0 : getScrollTopValue(scrollParent);
			var scrollLeft = data.offsets.popper.position === 'fixed' ? 0 : getScrollLeftValue(scrollParent);
			boundaries = {
				top: 0 - (offsetParentRect.top - scrollTop),
				right: root.document.documentElement.clientWidth - (offsetParentRect.left - scrollLeft),
				bottom: root.document.documentElement.clientHeight - (offsetParentRect.top - scrollTop),
				left: 0 - (offsetParentRect.left - scrollLeft)
			};
		} else {
			if (getOffsetParent(this._popper) === boundariesElement) {
				boundaries = {
					top: 0,
					left: 0,
					right: boundariesElement.clientWidth,
					bottom: boundariesElement.clientHeight
				};
			} else {
				boundaries = getOffsetRect(boundariesElement);
			}
		}
		boundaries.left += padding;
		boundaries.right -= padding;
		boundaries.top = boundaries.top + padding;
		boundaries.bottom = boundaries.bottom - padding;
		return boundaries;
	}
	Popper.prototype.runModifiers = function(data, modifiers, ends) {
		var modifiersToRun = modifiers.slice();
		if (ends !== undefined) {
			modifiersToRun = this._options.modifiers.slice(0, getArrayKeyIndex(this._options.modifiers, ends));
		}
		modifiersToRun.forEach(function(modifier) {
			if (isFunction(modifier)) {
				data = modifier.call(this, data);
			}
		}
		.bind(this));
		return data;
	}
	Popper.prototype.isModifierRequired = function(requesting, requested) {
		var index = getArrayKeyIndex(this._options.modifiers, requesting);
		return !!this._options.modifiers.slice(0, index).filter(function(modifier) {
			return modifier === requested;
		}).length;
	}
	Popper.prototype.modifiers = {};
	Popper.prototype.modifiers.applyStyle = function(data) {
		var styles = {
			position: data.offsets.popper.position
		};
		var left = Math.round(data.offsets.popper.left);
		var top = Math.round(data.offsets.popper.top);
		var prefixedProperty;
		if (this._options.gpuAcceleration && (prefixedProperty = getSupportedPropertyName('transform'))) {
			styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
			styles.top = 0;
			styles.left = 0;
		} else {
			styles.left = left;
			styles.top = top;
		}
		Object.assign(styles, data.styles);
		setStyle(this._popper, styles);
		this._popper.setAttribute('x-placement', data.placement);
		if (this.isModifierRequired(this.modifiers.applyStyle, this.modifiers.arrow) && data.offsets.arrow) {
			setStyle(data.arrowElement, data.offsets.arrow);
		}
		return data;
	}
	Popper.prototype.modifiers.shift = function(data) {
		var placement = data.placement;
		var basePlacement = placement.split('-')[0];
		var shiftVariation = placement.split('-')[1];
		if (shiftVariation) {
			var reference = data.offsets.reference;
			var popper = getPopperClientRect(data.offsets.popper);
			var shiftOffsets = {
				y: {
					start: {
						top: reference.top
					},
					end: {
						top: reference.top + reference.height - popper.height
					}
				},
				x: {
					start: {
						left: reference.left
					},
					end: {
						left: reference.left + reference.width - popper.width
					}
				}
			};
			var axis = ['bottom', 'top'].indexOf(basePlacement) !== -1 ? 'x' : 'y';
			data.offsets.popper = Object.assign(popper, shiftOffsets[axis][shiftVariation]);
		}
		return data;
	}
	Popper.prototype.modifiers.preventOverflow = function(data) {
		var order = this._options.preventOverflowOrder;
		var popper = getPopperClientRect(data.offsets.popper);
		var check = {
			left: function() {
				var left = popper.left;
				if (popper.left < data.boundaries.left) {
					left = Math.max(popper.left, data.boundaries.left);
				}
				return {
					left: left
				};
			},
			right: function() {
				var left = popper.left;
				if (popper.right > data.boundaries.right) {
					left = Math.min(popper.left, data.boundaries.right - popper.width);
				}
				return {
					left: left
				};
			},
			top: function() {
				var top = popper.top;
				if (popper.top < data.boundaries.top) {
					top = Math.max(popper.top, data.boundaries.top);
				}
				return {
					top: top
				};
			},
			bottom: function() {
				var top = popper.top;
				if (popper.bottom > data.boundaries.bottom) {
					top = Math.min(popper.top, data.boundaries.bottom - popper.height);
				}
				return {
					top: top
				};
			}
		};
		order.forEach(function(direction) {
			data.offsets.popper = Object.assign(popper, check[direction]());
		});
		return data;
	}
	Popper.prototype.modifiers.keepTogether = function(data) {
		var popper = getPopperClientRect(data.offsets.popper);
		var reference = data.offsets.reference;
		var f = Math.floor;
		if (popper.right < f(reference.left)) {
			data.offsets.popper.left = f(reference.left) - popper.width;
		}
		if (popper.left > f(reference.right)) {
			data.offsets.popper.left = f(reference.right);
		}
		if (popper.bottom < f(reference.top)) {
			data.offsets.popper.top = f(reference.top) - popper.height;
		}
		if (popper.top > f(reference.bottom)) {
			data.offsets.popper.top = f(reference.bottom);
		}
		return data;
	}
	Popper.prototype.modifiers.flip = function(data) {
		if (!this.isModifierRequired(this.modifiers.flip, this.modifiers.preventOverflow)) {
			console.warn('WARNING: preventOverflow modifier is required by flip modifier in order to work, be sure to include it before flip!');
			return data;
		}
		if (data.flipped && data.placement === data._originalPlacement) {
			return data;
		}
		var placement = data.placement.split('-')[0];
		var placementOpposite = getOppositePlacement(placement);
		var variation = data.placement.split('-')[1] || '';
		var flipOrder = [];
		if (this._options.flipBehavior === 'flip') {
			flipOrder = [placement, placementOpposite];
		} else {
			flipOrder = this._options.flipBehavior;
		}
		flipOrder.forEach(function(step, index) {
			if (placement !== step || flipOrder.length === index + 1) {
				return;
			}
			placement = data.placement.split('-')[0];
			placementOpposite = getOppositePlacement(placement);
			var popperOffsets = getPopperClientRect(data.offsets.popper);
			var a = ['right', 'bottom'].indexOf(placement) !== -1;
			if (a && Math.floor(data.offsets.reference[placement]) > Math.floor(popperOffsets[placementOpposite]) || !a && Math.floor(data.offsets.reference[placement]) < Math.floor(popperOffsets[placementOpposite])) {
				data.flipped = true;
				data.placement = flipOrder[index + 1];
				if (variation) {
					data.placement += '-' + variation;
				}
				data.offsets.popper = this._getOffsets(this._popper, this._reference, data.placement).popper;
				data = this.runModifiers(data, this._options.modifiers, this._flip);
			}
		}
		.bind(this));
		return data;
	}
	Popper.prototype.modifiers.offset = function(data) {
		var offset = this._options.offset;
		var popper = data.offsets.popper;
		if (data.placement.indexOf('left') !== -1) {
			popper.top -= offset;
		} else if (data.placement.indexOf('right') !== -1) {
			popper.top += offset;
		} else if (data.placement.indexOf('top') !== -1) {
			popper.left -= offset;
		} else if (data.placement.indexOf('bottom') !== -1) {
			popper.left += offset;
		}
		return data;
	}
	Popper.prototype.modifiers.arrow = function(data) {
		var arrow = this._options.arrowElement;
		if (typeof arrow === 'string') {
			arrow = this._popper.querySelector(arrow);
		}
		if (!arrow) {
			return data;
		}
		if (!this._popper.contains(arrow)) {
			console.warn('WARNING: \'arrowElement\' must be child of its popper element!');
			return data;
		}
		if (!this.isModifierRequired(this.modifiers.arrow, this.modifiers.keepTogether)) {
			console.warn('WARNING: keepTogether modifier is required by arrow modifier in order to work, be sure to include it before arrow!');
			return data;
		}
		var arrowStyle = {};
		var placement = data.placement.split('-')[0];
		var popper = getPopperClientRect(data.offsets.popper);
		var reference = data.offsets.reference;
		var isVertical = ['left', 'right'].indexOf(placement) !== -1;
		var len = isVertical ? 'height' : 'width';
		var side = isVertical ? 'top' : 'left';
		var altSide = isVertical ? 'left' : 'top';
		var opSide = isVertical ? 'bottom' : 'right';
		var arrowSize = getOuterSizes(arrow)[len];
		if (reference[opSide] - arrowSize < popper[side]) {
			data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowSize);
		}
		if (reference[side] + arrowSize > popper[opSide]) {
			data.offsets.popper[side] += (reference[side] + arrowSize) - popper[opSide];
		}
		var center = reference[side] + (reference[len] / 2) - (arrowSize / 2);
		var sideValue = center - popper[side];
		sideValue = Math.max(Math.min(popper[len] - arrowSize, sideValue), 0);
		arrowStyle[side] = sideValue;
		arrowStyle[altSide] = '';
		data.offsets.arrow = arrowStyle;
		data.arrowElement = arrow;
		return data;
	}
	function getOuterSizes(element) {
		var _display = element.style.display
		  , _visibility = element.style.visibility;
		element.style.display = 'block';
		element.style.visibility = 'hidden';
		var calcWidthToForceRepaint = element.offsetWidth;
		var styles = root.getComputedStyle(element);
		var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
		var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
		var result = {
			width: element.offsetWidth + y,
			height: element.offsetHeight + x
		};
		element.style.display = _display;
		element.style.visibility = _visibility;
		return result;
	}
	function getOppositePlacement(placement) {
		var hash = {
			left: 'right',
			right: 'left',
			bottom: 'top',
			top: 'bottom'
		};
		return placement.replace(/left|right|bottom|top/g, function(matched) {
			return hash[matched];
		});
	}
	function getPopperClientRect(popperOffsets) {
		var offsets = Object.assign({}, popperOffsets);
		offsets.right = offsets.left + offsets.width;
		offsets.bottom = offsets.top + offsets.height;
		return offsets;
	}
	function getArrayKeyIndex(arr, keyToFind) {
		var i = 0, key;
		for (key in arr) {
			if (arr[key] === keyToFind) {
				return i;
			}
			i++;
		}
		return null;
	}
	function getStyleComputedProperty(element, property) {
		var css = root.getComputedStyle(element, null);
		return css[property];
	}
	function getOffsetParent(element) {
		var offsetParent = element.offsetParent;
		return offsetParent === root.document.body || !offsetParent ? root.document.documentElement : offsetParent;
	}
	function getScrollParent(element) {
		var parent = element.parentNode;
		if (!parent) {
			return element;
		}
		if (parent === root.document) {
			if (root.document.body.scrollTop) {
				return root.document.body;
			} else {
				return root.document.documentElement;
			}
		}
		if (['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow')) !== -1 || ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-x')) !== -1 || ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-y')) !== -1) {
			return parent;
		}
		return getScrollParent(element.parentNode);
	}
	function isFixed(element) {
		if (element === root.document.body) {
			return false;
		}
		if (getStyleComputedProperty(element, 'position') === 'fixed') {
			return true;
		}
		return element.parentNode ? isFixed(element.parentNode) : element;
	}
	function setStyle(element, styles) {
		function is_numeric(n) {
			return ( n !== '' && !isNaN(parseFloat(n)) && isFinite(n)) ;
		}
		Object.keys(styles).forEach(function(prop) {
			var unit = '';
			if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && is_numeric(styles[prop])) {
				unit = 'px';
			}
			element.style[prop] = styles[prop] + unit;
		});
	}
	function isFunction(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}
	function getOffsetRect(element) {
		var elementRect = {
			width: element.offsetWidth,
			height: element.offsetHeight,
			left: element.offsetLeft,
			top: element.offsetTop
		};
		elementRect.right = elementRect.left + elementRect.width;
		elementRect.bottom = elementRect.top + elementRect.height;
		return elementRect;
	}
	function getBoundingClientRect(element) {
		var rect = element.getBoundingClientRect();
		var isIE = navigator.userAgent.indexOf('MSIE') != -1;
		var rectTop = isIE && element.tagName === 'HTML' ? -element.scrollTop : rect.top;
		return {
			left: rect.left,
			top: rectTop,
			right: rect.right,
			bottom: rect.bottom,
			width: rect.right - rect.left,
			height: rect.bottom - rectTop
		};
	}
	function getOffsetRectRelativeToCustomParent(element, parent, fixed) {
		var elementRect = getBoundingClientRect(element);
		var parentRect = getBoundingClientRect(parent);
		if (fixed) {
			var scrollParent = getScrollParent(parent);
			parentRect.top += scrollParent.scrollTop;
			parentRect.bottom += scrollParent.scrollTop;
			parentRect.left += scrollParent.scrollLeft;
			parentRect.right += scrollParent.scrollLeft;
		}
		var rect = {
			top: elementRect.top - parentRect.top,
			left: elementRect.left - parentRect.left,
			bottom: (elementRect.top - parentRect.top) + elementRect.height,
			right: (elementRect.left - parentRect.left) + elementRect.width,
			width: elementRect.width,
			height: elementRect.height
		};
		return rect;
	}
	function getSupportedPropertyName(property) {
		var prefixes = ['', 'ms', 'webkit', 'moz', 'o'];
		for (var i = 0; i < prefixes.length; i++) {
			var toCheck = prefixes[i] ? prefixes[i] + property.charAt(0).toUpperCase() + property.slice(1) : property;
			if (typeof root.document.body.style[toCheck] !== 'undefined') {
				return toCheck;
			}
		}
		return null;
	}
	if (!Object.assign) {
		Object.defineProperty(Object, 'assign', {
			enumerable: false,
			configurable: true,
			writable: true,
			value: function(target) {
				if (target === undefined || target === null) {
					throw new TypeError('Cannot convert first argument to object');
				}
				var to = Object(target);
				for (var i = 1; i < arguments.length; i++) {
					var nextSource = arguments[i];
					if (nextSource === undefined || nextSource === null) {
						continue;
					}
					nextSource = Object(nextSource);
					var keysArray = Object.keys(nextSource);
					for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
						var nextKey = keysArray[nextIndex];
						var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
						if (desc !== undefined && desc.enumerable) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
				return to;
			}
		});
	}
	return Popper;
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(definition);
	} else {
		context[name] = definition();
	}
})('Screenfull', this, function() {
	'use strict';
	var document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};
	var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;
	var fn = (function () {
		var val;
		var fnMap = [['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'], ['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitFullscreenEnabled', 'webkitfullscreenchange', 'webkitfullscreenerror'], ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitfullscreenerror'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror'], ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError']];
		var i = 0;
		var l = fnMap.length;
		var ret = {};
		for (; i < l; i++) {
			val = fnMap[i];
			if (val && val[1]in document) {
				for (i = 0; i < val.length; i++) {
					ret[fnMap[0][i]] = val[i];
				}
				return ret;
			}
		}
		return false;
	})();
	var screenfull = {
		request: function (elem) {
			var request = fn.requestFullscreen;
			elem = elem || document.documentElement;
			if (/5\.1[.\d]* Safari/.test(navigator.userAgent)) {
				elem[request]();
			} else {
				elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
			}
		},
		exit: function () {
			document[fn.exitFullscreen]();
		},
		toggle: function (elem) {
			if (this.isFullscreen) {
				this.exit();
			} else {
				this.request(elem);
			}
		},
		onchange: function (callback) {
			document.addEventListener(fn.fullscreenchange, callback, false);
		},
		onerror: function (callback) {
			document.addEventListener(fn.fullscreenerror, callback, false);
		},
		raw: fn
	};
	if (!fn) {
		return false;
	}
	Object.defineProperties(screenfull, {
		isFullscreen: {
			get: function () {
				return Boolean(document[fn.fullscreenElement]);
			}
		},
		element: {
			enumerable: true,
			get: function () {
				return document[fn.fullscreenElement];
			}
		},
		enabled: {
			enumerable: true,
			get: function () {
				return Boolean(document[fn.fullscreenEnabled]);
			}
		}
	});
	return screenfull;
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(definition);
	} else {
		context[name] = definition();
	}
})('Sortable', this, function() {
	'use strict';
	if (typeof window == "undefined" || !window.document) {
		return function sortableError() {
			throw new Error("Sortable.js requires a window with a document");
		}
	}
	var dragEl, parentEl, ghostEl, cloneEl, rootEl, nextEl, lastDownEl, scrollEl, scrollParentEl, scrollCustomFn, lastEl, lastCSS, lastParentCSS, oldIndex, newIndex, activeGroup, putSortable, autoScroll = {}, tapEvt, touchEvt, moved, R_SPACE = /\s+/g, R_FLOAT = /left|right|inline/, expando = 'Sortable' + (new Date).getTime(), win = window, document = win.document, parseInt = win.parseInt, $ = win.jQuery || win.Zepto, Polymer = win.Polymer, captureMode = false, supportDraggable = !!('draggable'in document.createElement('div')), supportCssPointerEvents = (function(el) {
		if (!!navigator.userAgent.match(/Trident.*rv[ :]?11\./)) {
			return false;
		}
		el = document.createElement('x');
		el.style.cssText = 'pointer-events:auto';
		return el.style.pointerEvents === 'auto';
	})(), _silent = false, abs = Math.abs, min = Math.min, savedInputChecked = [], touchDragOverListeners = [], _autoScroll = _throttle(function(evt, options, rootEl) {
		if (rootEl && options.scroll) {
			var _this = rootEl[expando], el, rect, sens = options.scrollSensitivity, speed = options.scrollSpeed, x = evt.clientX, y = evt.clientY, winWidth = window.innerWidth, winHeight = window.innerHeight, vx, vy, scrollOffsetX, scrollOffsetY;
			if (scrollParentEl !== rootEl) {
				scrollEl = options.scroll;
				scrollParentEl = rootEl;
				scrollCustomFn = options.scrollFn;
				if (scrollEl === true) {
					scrollEl = rootEl;
					do {
						if ((scrollEl.offsetWidth < scrollEl.scrollWidth) || (scrollEl.offsetHeight < scrollEl.scrollHeight)) {
							break;
						}
					} while (scrollEl = scrollEl.parentNode);
				}
			}
			if (scrollEl) {
				el = scrollEl;
				rect = scrollEl.getBoundingClientRect();
				vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
				vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
			}
			if (!(vx || vy)) {
				vx = (winWidth - x <= sens) - (x <= sens);
				vy = (winHeight - y <= sens) - (y <= sens);
				(vx || vy) && (el = win);
			}
			if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {
				autoScroll.el = el;
				autoScroll.vx = vx;
				autoScroll.vy = vy;
				clearInterval(autoScroll.pid);
				if (el) {
					autoScroll.pid = setInterval(function() {
						scrollOffsetY = vy ? vy * speed : 0;
						scrollOffsetX = vx ? vx * speed : 0;
						if ('function' === typeof (scrollCustomFn)) {
							return scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt);
						}
						if (el === win) {
							win.scrollTo(win.pageXOffset + scrollOffsetX, win.pageYOffset + scrollOffsetY);
						} else {
							el.scrollTop += scrollOffsetY;
							el.scrollLeft += scrollOffsetX;
						}
					}, 24);
				}
			}
		}
	}, 30), _prepareGroup = function(options) {
		function toFn(value, pull) {
			if (value === void 0 || value === true) {
				value = group.name;
			}
			if (typeof value === 'function') {
				return value;
			} else {
				return function(to, from) {
					var fromGroup = from.options.group.name;
					return pull ? value : value && (value.join ? value.indexOf(fromGroup) > -1 : (fromGroup == value));
				}
			}
		}
		var group = {};
		var originalGroup = options.group;
		if (!originalGroup || typeof originalGroup != 'object') {
			originalGroup = {
				name: originalGroup
			};
		}
		group.name = originalGroup.name;
		group.checkPull = toFn(originalGroup.pull, true);
		group.checkPut = toFn(originalGroup.put);
		group.revertClone = originalGroup.revertClone;
		options.group = group;
	};
	function Sortable(el, options) {
		if (!(el && el.nodeType && el.nodeType === 1)) {
			throw 'Sortable: ' + el + ' must be HTMLElement, and not ' + {}.toString.call(el);
		}
		this.el = el;
		this.options = options = _extend({}, options);
		el[expando] = this;
		var defaults = {
			group: Math.random(),
			sort: true,
			disabled: false,
			store: null,
			handle: null,
			scroll: true,
			scrollSensitivity: 30,
			scrollSpeed: 10,
			draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
			ghostClass: 'sortable-ghost',
			chosenClass: 'sortable-chosen',
			dragClass: 'sortable-drag',
			ignore: 'a, img',
			filter: null,
			preventOnFilter: true,
			animation: 0,
			setData: function(dataTransfer, dragEl) {
				dataTransfer.setData('Text', dragEl.textContent);
			},
			dropBubble: false,
			dragoverBubble: false,
			dataIdAttr: 'data-id',
			delay: 0,
			forceFallback: false,
			fallbackClass: 'sortable-fallback',
			fallbackOnBody: false,
			fallbackTolerance: 0,
			fallbackOffset: {
				x: 0,
				y: 0
			}
		};
		for (var name in defaults) {
			!(name in options) && (options[name] = defaults[name]);
		}
		_prepareGroup(options);
		for (var fn in this) {
			if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
				this[fn] = this[fn].bind(this);
			}
		}
		this.nativeDraggable = options.forceFallback ? false : supportDraggable;
		_on(el, 'mousedown', this._onTapStart);
		_on(el, 'touchstart', this._onTapStart);
		_on(el, 'pointerdown', this._onTapStart);
		if (this.nativeDraggable) {
			_on(el, 'dragover', this);
			_on(el, 'dragenter', this);
		}
		touchDragOverListeners.push(this._onDragOver);
		options.store && this.sort(options.store.get(this));
	}
	Sortable.prototype = {
		constructor: Sortable,
		_onTapStart: function(evt) {
			var _this = this, el = this.el, options = this.options, preventOnFilter = options.preventOnFilter, type = evt.type, touch = evt.touches && evt.touches[0], target = (touch || evt).target, originalTarget = evt.target.shadowRoot && evt.path[0] || target, filter = options.filter, startIndex;
			_saveInputCheckedState(el);
			if (dragEl) {
				return;
			}
			if (type === 'mousedown' && evt.button !== 0 || options.disabled) {
				return;
			}
			target = _closest(target, options.draggable, el);
			if (!target) {
				return;
			}
			if (lastDownEl === target) {
				return;
			}
			startIndex = _index(target, options.draggable);
			if (typeof filter === 'function') {
				if (filter.call(this, evt, target, this)) {
					_dispatchEvent(_this, originalTarget, 'filter', target, el, startIndex);
					preventOnFilter && evt.preventDefault();
					return;
				}
			} else if (filter) {
				filter = filter.split(',').some(function(criteria) {
					criteria = _closest(originalTarget, criteria.trim(), el);
					if (criteria) {
						_dispatchEvent(_this, criteria, 'filter', target, el, startIndex);
						return true;
					}
				});
				if (filter) {
					preventOnFilter && evt.preventDefault();
					return;
				}
			}
			if (options.handle && !_closest(originalTarget, options.handle, el)) {
				return;
			}
			this._prepareDragStart(evt, touch, target, startIndex);
		},
		_prepareDragStart: function(evt, touch, target, startIndex) {
			var _this = this, el = _this.el, options = _this.options, ownerDocument = el.ownerDocument, dragStartFn;
			if (target && !dragEl && (target.parentNode === el)) {
				tapEvt = evt;
				rootEl = el;
				dragEl = target;
				parentEl = dragEl.parentNode;
				nextEl = dragEl.nextSibling;
				lastDownEl = target;
				activeGroup = options.group;
				oldIndex = startIndex;
				this._lastX = (touch || evt).clientX;
				this._lastY = (touch || evt).clientY;
				dragEl.style['will-change'] = 'transform';
				dragStartFn = function() {
					_this._disableDelayedDrag();
					dragEl.draggable = _this.nativeDraggable;
					_toggleClass(dragEl, options.chosenClass, true);
					_this._triggerDragStart(evt, touch);
					_dispatchEvent(_this, rootEl, 'choose', dragEl, rootEl, oldIndex);
				}
				options.ignore.split(',').forEach(function(criteria) {
					_find(dragEl, criteria.trim(), _disableDraggable);
				});
				_on(ownerDocument, 'mouseup', _this._onDrop);
				_on(ownerDocument, 'touchend', _this._onDrop);
				_on(ownerDocument, 'touchcancel', _this._onDrop);
				_on(ownerDocument, 'pointercancel', _this._onDrop);
				_on(ownerDocument, 'selectstart', _this);
				if (options.delay) {
					_on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchend', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
					_on(ownerDocument, 'mousemove', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchmove', _this._disableDelayedDrag);
					_on(ownerDocument, 'pointermove', _this._disableDelayedDrag);
					_this._dragStartTimer = setTimeout(dragStartFn, options.delay);
				} else {
					dragStartFn();
				}
			}
		},
		_disableDelayedDrag: function() {
			var ownerDocument = this.el.ownerDocument;
			clearTimeout(this._dragStartTimer);
			_off(ownerDocument, 'mouseup', this._disableDelayedDrag);
			_off(ownerDocument, 'touchend', this._disableDelayedDrag);
			_off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
			_off(ownerDocument, 'mousemove', this._disableDelayedDrag);
			_off(ownerDocument, 'touchmove', this._disableDelayedDrag);
			_off(ownerDocument, 'pointermove', this._disableDelayedDrag);
		},
		_triggerDragStart: function(evt, touch) {
			touch = touch || (evt.pointerType == 'touch' ? evt : null);
			if (touch) {
				tapEvt = {
					target: dragEl,
					clientX: touch.clientX,
					clientY: touch.clientY
				};
				this._onDragStart(tapEvt, 'touch');
			} else if (!this.nativeDraggable) {
				this._onDragStart(tapEvt, true);
			} else {
				_on(dragEl, 'dragend', this);
				_on(rootEl, 'dragstart', this._onDragStart);
			}
			try {
				if (document.selection) {
					setTimeout(function() {
						document.selection.empty();
					});
				} else {
					window.getSelection().removeAllRanges();
				}
			} catch (err) {}
		},
		_dragStarted: function() {
			if (rootEl && dragEl) {
				var options = this.options;
				_toggleClass(dragEl, options.ghostClass, true);
				_toggleClass(dragEl, options.dragClass, false);
				Sortable.active = this;
				_dispatchEvent(this, rootEl, 'start', dragEl, rootEl, oldIndex);
			} else {
				this._nulling();
			}
		},
		_emulateDragOver: function() {
			if (touchEvt) {
				if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY) {
					return;
				}
				this._lastX = touchEvt.clientX;
				this._lastY = touchEvt.clientY;
				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', 'none');
				}
				var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY)
				  , parent = target
				  , i = touchDragOverListeners.length;
				if (parent) {
					do {
						if (parent[expando]) {
							while (i--) {
								touchDragOverListeners[i]({
									clientX: touchEvt.clientX,
									clientY: touchEvt.clientY,
									target: target,
									rootEl: parent
								});
							}
							break;
						}
						target = parent;
					} while (parent = parent.parentNode);
				}
				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', '');
				}
			}
		},
		_onTouchMove: function(evt) {
			if (tapEvt) {
				var options = this.options
				  , fallbackTolerance = options.fallbackTolerance
				  , fallbackOffset = options.fallbackOffset
				  , touch = evt.touches ? evt.touches[0] : evt
				  , dx = (touch.clientX - tapEvt.clientX) + fallbackOffset.x
				  , dy = (touch.clientY - tapEvt.clientY) + fallbackOffset.y
				  , translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';
				if (!Sortable.active) {
					if (fallbackTolerance && min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY)) < fallbackTolerance) {
						return;
					}
					this._dragStarted();
				}
				this._appendGhost();
				moved = true;
				touchEvt = touch;
				_css(ghostEl, 'webkitTransform', translate3d);
				_css(ghostEl, 'mozTransform', translate3d);
				_css(ghostEl, 'msTransform', translate3d);
				_css(ghostEl, 'transform', translate3d);
				evt.preventDefault();
			}
		},
		_appendGhost: function() {
			if (!ghostEl) {
				var rect = dragEl.getBoundingClientRect(), css = _css(dragEl), options = this.options, ghostRect;
				ghostEl = dragEl.cloneNode(true);
				_toggleClass(ghostEl, options.ghostClass, false);
				_toggleClass(ghostEl, options.fallbackClass, true);
				_toggleClass(ghostEl, options.dragClass, true);
				_css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
				_css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
				_css(ghostEl, 'width', rect.width);
				_css(ghostEl, 'height', rect.height);
				_css(ghostEl, 'opacity', '0.8');
				_css(ghostEl, 'position', 'fixed');
				_css(ghostEl, 'zIndex', '100000');
				_css(ghostEl, 'pointerEvents', 'none');
				options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);
				ghostRect = ghostEl.getBoundingClientRect();
				_css(ghostEl, 'width', rect.width * 2 - ghostRect.width);
				_css(ghostEl, 'height', rect.height * 2 - ghostRect.height);
			}
		},
		_onDragStart: function(evt, useFallback) {
			var dataTransfer = evt.dataTransfer
			  , options = this.options;
			this._offUpEvents();
			if (activeGroup.checkPull(this, this, dragEl, evt)) {
				cloneEl = _clone(dragEl);
				cloneEl.draggable = false;
				cloneEl.style['will-change'] = '';
				_css(cloneEl, 'display', 'none');
				_toggleClass(cloneEl, this.options.chosenClass, false);
				rootEl.insertBefore(cloneEl, dragEl);
				_dispatchEvent(this, rootEl, 'clone', dragEl);
			}
			_toggleClass(dragEl, options.dragClass, true);
			if (useFallback) {
				if (useFallback === 'touch') {
					_on(document, 'touchmove', this._onTouchMove);
					_on(document, 'touchend', this._onDrop);
					_on(document, 'touchcancel', this._onDrop);
					_on(document, 'pointermove', this._onTouchMove);
					_on(document, 'pointerup', this._onDrop);
				} else {
					_on(document, 'mousemove', this._onTouchMove);
					_on(document, 'mouseup', this._onDrop);
				}
				this._loopId = setInterval(this._emulateDragOver, 50);
			} else {
				if (dataTransfer) {
					dataTransfer.effectAllowed = 'move';
					options.setData && options.setData.call(this, dataTransfer, dragEl);
				}
				_on(document, 'drop', this);
				setTimeout(this._dragStarted, 0);
			}
		},
		_onDragOver: function(evt) {
			var el = this.el, target, dragRect, targetRect, revert, options = this.options, group = options.group, activeSortable = Sortable.active, isOwner = (activeGroup === group), isMovingBetweenSortable = false, canSort = options.sort;
			if (evt.preventDefault !== void 0) {
				evt.preventDefault();
				!options.dragoverBubble && evt.stopPropagation();
			}
			if (dragEl.animated) {
				return;
			}
			moved = true;
			if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = !rootEl.contains(dragEl)) : (putSortable === this || ((activeSortable.lastPullMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt)))) && (evt.rootEl === void 0 || evt.rootEl === this.el)) {
				_autoScroll(evt, options, this.el);
				if (_silent) {
					return;
				}
				target = _closest(evt.target, options.draggable, el);
				dragRect = dragEl.getBoundingClientRect();
				if (putSortable !== this) {
					putSortable = this;
					isMovingBetweenSortable = true;
				}
				if (revert) {
					_cloneHide(activeSortable, true);
					parentEl = rootEl;
					if (cloneEl || nextEl) {
						rootEl.insertBefore(dragEl, cloneEl || nextEl);
					} else if (!canSort) {
						rootEl.appendChild(dragEl);
					}
					return;
				}
				if ((el.children.length === 0) || (el.children[0] === ghostEl) || (el === evt.target) && (_ghostIsLast(el, evt))) {
					if (el.children.length !== 0 && el.children[0] !== ghostEl && el === evt.target) {
						target = el.lastElementChild;
					}
					if (target) {
						if (target.animated) {
							return;
						}
						targetRect = target.getBoundingClientRect();
					}
					_cloneHide(activeSortable, isOwner);
					if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt) !== false) {
						if (!dragEl.contains(el)) {
							el.appendChild(dragEl);
							parentEl = el;
						}
						this._animate(dragRect, dragEl);
						target && this._animate(targetRect, target);
					}
				} else if (target && !target.animated && target !== dragEl && (target.parentNode[expando] !== void 0)) {
					if (lastEl !== target) {
						lastEl = target;
						lastCSS = _css(target);
						lastParentCSS = _css(target.parentNode);
					}
					targetRect = target.getBoundingClientRect();
					var width = targetRect.right - targetRect.left
					  , height = targetRect.bottom - targetRect.top
					  , floating = R_FLOAT.test(lastCSS.cssFloat + lastCSS.display) || (lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0)
					  , isWide = (target.offsetWidth > dragEl.offsetWidth)
					  , isLong = (target.offsetHeight > dragEl.offsetHeight)
					  , halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5
					  , nextSibling = target.nextElementSibling
					  , after = false;
					if (floating) {
						var elTop = dragEl.offsetTop
						  , tgTop = target.offsetTop;
						if (elTop === tgTop) {
							after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;
						} else if (target.previousElementSibling === dragEl || dragEl.previousElementSibling === target) {
							after = (evt.clientY - targetRect.top) / height > 0.5;
						} else {
							after = tgTop > elTop;
						}
					} else if (!isMovingBetweenSortable) {
						after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
					}
					var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
					if (moveVector !== false) {
						if (moveVector === 1 || moveVector === -1) {
							after = (moveVector === 1);
						}
						_silent = true;
						setTimeout(_unsilent, 30);
						_cloneHide(activeSortable, isOwner);
						if (!dragEl.contains(el)) {
							if (after && !nextSibling) {
								el.appendChild(dragEl);
							} else {
								target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
							}
						}
						parentEl = dragEl.parentNode;
						this._animate(dragRect, dragEl);
						this._animate(targetRect, target);
					}
				}
			}
		},
		_animate: function(prevRect, target) {
			var ms = this.options.animation;
			if (ms) {
				var currentRect = target.getBoundingClientRect();
				if (prevRect.nodeType === 1) {
					prevRect = prevRect.getBoundingClientRect();
				}
				_css(target, 'transition', 'none');
				_css(target, 'transform', 'translate3d(' + (prevRect.left - currentRect.left) + 'px,' + (prevRect.top - currentRect.top) + 'px,0)');
				target.offsetWidth;
				_css(target, 'transition', 'all ' + ms + 'ms');
				_css(target, 'transform', 'translate3d(0,0,0)');
				clearTimeout(target.animated);
				target.animated = setTimeout(function() {
					_css(target, 'transition', '');
					_css(target, 'transform', '');
					target.animated = false;
				}, ms);
			}
		},
		_offUpEvents: function() {
			var ownerDocument = this.el.ownerDocument;
			_off(document, 'touchmove', this._onTouchMove);
			_off(document, 'pointermove', this._onTouchMove);
			_off(ownerDocument, 'mouseup', this._onDrop);
			_off(ownerDocument, 'touchend', this._onDrop);
			_off(ownerDocument, 'pointerup', this._onDrop);
			_off(ownerDocument, 'touchcancel', this._onDrop);
			_off(ownerDocument, 'pointercancel', this._onDrop);
			_off(ownerDocument, 'selectstart', this);
		},
		_onDrop: function(evt) {
			var el = this.el
			  , options = this.options;
			clearInterval(this._loopId);
			clearInterval(autoScroll.pid);
			clearTimeout(this._dragStartTimer);
			_off(document, 'mousemove', this._onTouchMove);
			if (this.nativeDraggable) {
				_off(document, 'drop', this);
				_off(el, 'dragstart', this._onDragStart);
			}
			this._offUpEvents();
			if (evt) {
				if (moved) {
					evt.preventDefault();
					!options.dropBubble && evt.stopPropagation();
				}
				ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
				if (rootEl === parentEl || Sortable.active.lastPullMode !== 'clone') {
					cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
				}
				if (dragEl) {
					if (this.nativeDraggable) {
						_off(dragEl, 'dragend', this);
					}
					_disableDraggable(dragEl);
					dragEl.style['will-change'] = '';
					_toggleClass(dragEl, this.options.ghostClass, false);
					_toggleClass(dragEl, this.options.chosenClass, false);
					_dispatchEvent(this, rootEl, 'unchoose', dragEl, rootEl, oldIndex);
					if (rootEl !== parentEl) {
						newIndex = _index(dragEl, options.draggable);
						if (newIndex >= 0) {
							_dispatchEvent(null, parentEl, 'add', dragEl, rootEl, oldIndex, newIndex);
							_dispatchEvent(this, rootEl, 'remove', dragEl, rootEl, oldIndex, newIndex);
							_dispatchEvent(null, parentEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
							_dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
						}
					} else {
						if (dragEl.nextSibling !== nextEl) {
							newIndex = _index(dragEl, options.draggable);
							if (newIndex >= 0) {
								_dispatchEvent(this, rootEl, 'update', dragEl, rootEl, oldIndex, newIndex);
								_dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
							}
						}
					}
					if (Sortable.active) {
						if (newIndex == null || newIndex === -1) {
							newIndex = oldIndex;
						}
						_dispatchEvent(this, rootEl, 'end', dragEl, rootEl, oldIndex, newIndex);
						this.save();
					}
				}
			}
			this._nulling();
		},
		_nulling: function() {
			rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = scrollEl = scrollParentEl = tapEvt = touchEvt = moved = newIndex = lastEl = lastCSS = putSortable = activeGroup = Sortable.active = null;
			savedInputChecked.forEach(function(el) {
				el.checked = true;
			});
			savedInputChecked.length = 0;
		},
		handleEvent: function(evt) {
			switch (evt.type) {
			case 'drop':
			case 'dragend':
				this._onDrop(evt);
				break;
			case 'dragover':
			case 'dragenter':
				if (dragEl) {
					this._onDragOver(evt);
					_globalDragOver(evt);
				}
				break;
			case 'selectstart':
				evt.preventDefault();
				break;
			}
		},
		toArray: function() {
			var order = [], el, children = this.el.children, i = 0, n = children.length, options = this.options;
			for (; i < n; i++) {
				el = children[i];
				if (_closest(el, options.draggable, this.el)) {
					order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
				}
			}
			return order;
		},
		sort: function(order) {
			var items = {}
			  , rootEl = this.el;
			this.toArray().forEach(function(id, i) {
				var el = rootEl.children[i];
				if (_closest(el, this.options.draggable, rootEl)) {
					items[id] = el;
				}
			}, this);
			order.forEach(function(id) {
				if (items[id]) {
					rootEl.removeChild(items[id]);
					rootEl.appendChild(items[id]);
				}
			});
		},
		save: function() {
			var store = this.options.store;
			store && store.set(this);
		},
		closest: function(el, selector) {
			return _closest(el, selector || this.options.draggable, this.el);
		},
		option: function(name, value) {
			var options = this.options;
			if (value === void 0) {
				return options[name];
			} else {
				options[name] = value;
				if (name === 'group') {
					_prepareGroup(options);
				}
			}
		},
		destroy: function() {
			var el = this.el;
			el[expando] = null;
			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);
			_off(el, 'pointerdown', this._onTapStart);
			if (this.nativeDraggable) {
				_off(el, 'dragover', this);
				_off(el, 'dragenter', this);
			}
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function(el) {
				el.removeAttribute('draggable');
			});
			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);
			this._onDrop();
			this.el = el = null;
		}
	};
	function _cloneHide(sortable, state) {
		if (sortable.lastPullMode !== 'clone') {
			state = true;
		}
		if (cloneEl && (cloneEl.state !== state)) {
			_css(cloneEl, 'display', state ? 'none' : '');
			if (!state) {
				if (cloneEl.state) {
					if (sortable.options.group.revertClone) {
						rootEl.insertBefore(cloneEl, nextEl);
						sortable._animate(dragEl, cloneEl);
					} else {
						rootEl.insertBefore(cloneEl, dragEl);
					}
				}
			}
			cloneEl.state = state;
		}
	}
	function _closest(el, selector, ctx) {
		if (el) {
			ctx = ctx || document;
			do {
				if ((selector === '>*' && el.parentNode === ctx) || _matches(el, selector)) {
					return el;
				}
			} while (el = _getParentOrHost(el));
		}
		return null;
	}
	function _getParentOrHost(el) {
		var parent = el.host;
		return (parent && parent.nodeType) ? parent : el.parentNode;
	}
	function _globalDragOver(evt) {
		if (evt.dataTransfer) {
			evt.dataTransfer.dropEffect = 'move';
		}
		evt.preventDefault();
	}
	function _on(el, event, fn) {
		el.addEventListener(event, fn, captureMode);
	}
	function _off(el, event, fn) {
		el.removeEventListener(event, fn, captureMode);
	}
	function _toggleClass(el, name, state) {
		if (el) {
			if (el.classList) {
				el.classList[state ? 'add' : 'remove'](name);
			} else {
				var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
				el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
			}
		}
	}
	function _css(el, prop, val) {
		var style = el && el.style;
		if (style) {
			if (val === void 0) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					val = document.defaultView.getComputedStyle(el, '');
				} else if (el.currentStyle) {
					val = el.currentStyle;
				}
				return prop === void 0 ? val : val[prop];
			} else {
				if (!(prop in style)) {
					prop = '-webkit-' + prop;
				}
				style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}
	function _find(ctx, tagName, iterator) {
		if (ctx) {
			var list = ctx.getElementsByTagName(tagName)
			  , i = 0
			  , n = list.length;
			if (iterator) {
				for (; i < n; i++) {
					iterator(list[i], i);
				}
			}
			return list;
		}
		return [];
	}
	function _dispatchEvent(sortable, rootEl, name, targetEl, fromEl, startIndex, newIndex) {
		sortable = (sortable || rootEl[expando]);
		var evt = document.createEvent('Event')
		  , options = sortable.options
		  , onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
		evt.initEvent(name, true, true);
		evt.to = rootEl;
		evt.from = fromEl || rootEl;
		evt.item = targetEl || rootEl;
		evt.clone = cloneEl;
		evt.oldIndex = startIndex;
		evt.newIndex = newIndex;
		rootEl.dispatchEvent(evt);
		if (options[onName]) {
			options[onName].call(sortable, evt);
		}
	}
	function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt, willInsertAfter) {
		var evt, sortable = fromEl[expando], onMoveFn = sortable.options.onMove, retVal;
		evt = document.createEvent('Event');
		evt.initEvent('move', true, true);
		evt.to = toEl;
		evt.from = fromEl;
		evt.dragged = dragEl;
		evt.draggedRect = dragRect;
		evt.related = targetEl || toEl;
		evt.relatedRect = targetRect || toEl.getBoundingClientRect();
		evt.willInsertAfter = willInsertAfter;
		fromEl.dispatchEvent(evt);
		if (onMoveFn) {
			retVal = onMoveFn.call(sortable, evt, originalEvt);
		}
		return retVal;
	}
	function _disableDraggable(el) {
		el.draggable = false;
	}
	function _unsilent() {
		_silent = false;
	}
	function _ghostIsLast(el, evt) {
		var lastEl = el.lastElementChild
		  , rect = lastEl.getBoundingClientRect();
		return (evt.clientY - (rect.top + rect.height) > 5) || (evt.clientX - (rect.left + rect.width) > 5);
	}
	function _generateId(el) {
		var str = el.tagName + el.className + el.src + el.href + el.textContent
		  , i = str.length
		  , sum = 0;
		while (i--) {
			sum += str.charCodeAt(i);
		}
		return sum.toString(36);
	}
	function _index(el, selector) {
		var index = 0;
		if (!el || !el.parentNode) {
			return -1;
		}
		while (el && (el = el.previousElementSibling)) {
			if ((el.nodeName.toUpperCase() !== 'TEMPLATE') && (selector === '>*' || _matches(el, selector))) {
				index++;
			}
		}
		return index;
	}
	function _matches(el, selector) {
		if (el) {
			selector = selector.split('.');
			var tag = selector.shift().toUpperCase()
			  , re = new RegExp('\\s(' + selector.join('|') + ')(?=\\s)','g');
			return ( (tag === '' || el.nodeName.toUpperCase() == tag) && (!selector.length || ((' ' + el.className + ' ').match(re) || []).length == selector.length)) ;
		}
		return false;
	}
	function _throttle(callback, ms) {
		var args, _this;
		return function() {
			if (args === void 0) {
				args = arguments;
				_this = this;
				setTimeout(function() {
					if (args.length === 1) {
						callback.call(_this, args[0]);
					} else {
						callback.apply(_this, args);
					}
					args = void 0;
				}, ms);
			}
		}
	}
	function _extend(dst, src) {
		if (dst && src) {
			for (var key in src) {
				if (src.hasOwnProperty(key)) {
					dst[key] = src[key];
				}
			}
		}
		return dst;
	}
	function _clone(el) {
		return $ ? $(el).clone(true)[0] : (Polymer && Polymer.dom ? Polymer.dom(el).cloneNode(true) : el.cloneNode(true));
	}
	function _saveInputCheckedState(root) {
		var inputs = root.getElementsByTagName('input');
		var idx = inputs.length;
		while (idx--) {
			var el = inputs[idx];
			el.checked && savedInputChecked.push(el);
		}
	}
	_on(document, 'touchmove', function(evt) {
		if (Sortable.active) {
			evt.preventDefault();
		}
	});
	try {
		window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
			get: function() {
				captureMode = {
					capture: false,
					passive: false
				};
			}
		}));
	} catch (err) {}
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		is: function(el, selector) {
			return !!_closest(el, selector, el);
		},
		extend: _extend,
		throttle: _throttle,
		closest: _closest,
		toggleClass: _toggleClass,
		clone: _clone,
		index: _index
	};
	Sortable.create = function(el, options) {
		return new Sortable(el,options);
	}
	return Sortable;
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'DateUtil', 'Screenfull', 'VueI18n', 'VueResource'], definition);
	} else {
		context[name] = definition(context['Vue'], context['DateUtil'], context['Screenfull']);
	}
})('VueUtil', this, function(Vue, DateUtil, Screenfull) {
	'use strict';
	var animation = false;
	var RESIZE_ANIMATION_NAME = 'resizeanim';
	var keyFramePrefix = '';
	var animationStartEvent = 'animationstart';
	var stylesCreated = false;
	var DOM_PREFIXES = 'Webkit Moz O ms'.split(' ');
	var START_EVENTS = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' ');
	var attachEvent = typeof window === 'undefined' ? {} : document.attachEvent;
	var nodeList = [];
	var ctx = '@@clickoutsideContext';
	var clickOutSideFn = function(e) {
		nodeList.forEach(function(node) {
			node[ctx].documentHandler(e)
		});
	};
	if (!attachEvent && window !== 'undefined') {
		var testElement = document.createElement('fakeelement');
		if (testElement.style.animationName !== undefined) {
			animation = true;
		}
		if (animation === false) {
			var prefix = '';
			for (var i = 0; i < DOM_PREFIXES.length; i++) {
				if (testElement.style[DOM_PREFIXES[i] + 'AnimationName'] !== undefined) {
					prefix = DOM_PREFIXES[i];
					keyFramePrefix = '-' + prefix.toLowerCase() + '-';
					animationStartEvent = START_EVENTS[i];
					animation = true;
					break;
				}
			}
		}
	}
	var isServer = Vue.prototype.$isServer;
	var ieVersion = isServer ? 0 : Number(document.documentMode);
	var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
	var MOZ_HACK_REGEXP = /^moz([A-Z])/;
	var on = (function() {
		if (!isServer && document.addEventListener) {
			return function(element, event, handler) {
				if (element && event && handler) {
					element.addEventListener(event, handler, false);
				}
			}
		} else {
			return function(element, event, handler) {
				if (element && event && handler) {
					element.attachEvent('on' + event, handler);
				}
			}
		}
	})();
	var off = (function() {
		if (!isServer && document.removeEventListener) {
			return function(element, event, handler) {
				if (element && event) {
					element.removeEventListener(event, handler, false);
				}
			}
		} else {
			return function(element, event, handler) {
				if (element && event) {
					element.detachEvent('on' + event, handler);
				}
			}
		}
	})();
	var once = function(el, event, fn) {
		var listener = function() {
			if (fn) {
				fn.apply(this, arguments);
			}
			off(el, event, listener);
		};
		on(el, event, listener);
	};
	var trim = function(string) {
		return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
	};
	var hasClass = function(el, clazz) {
		if (!el || !clazz)
			return false;
		if (clazz.indexOf(' ') !== -1)
			throw new Error('className should not contain space.');
		if (el.classList) {
			return el.classList.contains(clazz);
		} else {
			return (' ' + el.className + ' ').indexOf(' ' + clazz + ' ') > -1;
		}
	};
	var addClass = function(el, clazz) {
		if (!el)
			return;
		var curClass = el.className;
		var classes = (clazz || '').split(' ');
		for (var i = 0, j = classes.length; i < j; i++) {
			var _className = classes[i];
			if (!_className)
				continue;
			if (el.classList) {
				el.classList.add(_className);
			} else {
				if (!hasClass(el, _className)) {
					curClass += ' ' + _className;
				}
			}
		}
		if (!el.classList) {
			el.className = curClass;
		}
	};
	var removeClass = function(el, clazz) {
		if (!el || !clazz)
			return;
		var classes = clazz.split(' ');
		var curClass = ' ' + el.className + ' ';
		for (var i = 0, j = classes.length; i < j; i++) {
			var clsName = classes[i];
			if (!clsName)
				continue;
			if (el.classList) {
				el.classList.remove(clsName);
			} else {
				if (hasClass(el, clsName)) {
					curClass = curClass.replace(' ' + clsName + ' ', ' ');
				}
			}
		}
		if (!el.classList) {
			el.className = trim(curClass);
		}
	};
	var camelCase = function(name) {
		return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
			return offset ? letter.toUpperCase() : letter;
		}).replace(MOZ_HACK_REGEXP, 'Moz$1');
	};
	var getStyle = ieVersion < 9 ? function(element, styleName) {
		if (isServer) return;
		if (!element || !styleName) return null;
		styleName = camelCase(styleName);
		if (styleName === 'float') {
			styleName = 'styleFloat';
		}
		try {
			switch (styleName) {
				case 'opacity':
					try {
						return element.filters.item('alpha').opacity / 100;
					} catch (e) {
						return 1.0;
					}
				default:
					return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
			}
		} catch (e) {
			return element.style[styleName];
		}
	} : function(element, styleName) {
		if (isServer) return;
		if (!element || !styleName) return null;
		styleName = camelCase(styleName);
		if (styleName === 'float') {
			styleName = 'cssFloat';
		}
		try {
			var computed = document.defaultView.getComputedStyle(element, '');
			return element.style[styleName] || computed ? computed[styleName] : null;
		} catch (e) {
			return element.style[styleName];
		}
	};
	var setStyle = function(element, styleName, value) {
		if (!element || !styleName) return;
		if (typeof styleName === 'object') {
			for (var prop in styleName) {
				if (styleName.hasOwnProperty(prop)) {
					setStyle(element, prop, styleName[prop]);
				}
			}
		} else {
			styleName = camelCase(styleName);
			if (styleName === 'opacity' && ieVersion < 9) {
				element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
			} else {
				element.style[styleName] = value;
			}
		}
	};
	var merge = function(target) {
		for (var i = 1, j = arguments.length; i < j; i++) {
			var source = arguments[i] || {};
			for (var prop in source) {
				var value = source[prop];
				if (value !== undefined) {
					target[prop] = value;
				}
			}
		}
		return target;
	};
	var broadcast = function(componentName, eventName, params) {
		this.$children.forEach(function(child) {
			var name = child.$options.componentName;
			if (name === componentName) {
				child.$emit.apply(child, [eventName].concat(params));
			} else {
				broadcast.apply(child, [componentName, eventName].concat([params]));
			}
		});
	};
	var emitter = {
		methods: {
			dispatch: function(componentName, eventName, params) {
				var parent = this.$parent || this.$root;
				var name = parent.$options.componentName;
				while (parent && (!name || name !== componentName)) {
					parent = parent.$parent;
					if (parent) {
						name = parent.$options.componentName;
					}
				}
				if (parent) {
					parent.$emit.apply(parent, [eventName].concat(params));
				}
			},
			broadcast: function(componentName, eventName, params) {
				broadcast.call(this, componentName, eventName, params);
			}
		}
	};
	var menumixin = {
		computed: {
			indexPath: function() {
				var path = [this.index];
				var parent = this.$parent;
				while (parent.$options.componentName !== 'VueMenu') {
					if (parent.index) {
						path.unshift(parent.index);
					}
					parent = parent.$parent;
				}
				return path;
			},
			rootMenu: function() {
				var parent = this.$parent;
				while (parent && parent.$options.componentName !== 'VueMenu') {
					parent = parent.$parent;
				}
				return parent;
			},
			parentMenu: function() {
				var parent = this.$parent;
				while (parent && ['VueMenu', 'VueSubmenu'].indexOf(parent.$options.componentName) === -1) {
					parent = parent.$parent;
				}
				return parent;
			},
			paddingStyle: function() {
				if (this.rootMenu.mode !== 'vertical')
					return {};
				var padding = 20;
				var parent = this.$parent;
				while (parent && parent.$options.componentName !== 'VueMenu') {
					if (parent.$options.componentName === 'VueSubmenu') {
						padding += 20;
					}
					parent = parent.$parent;
				}
				return {
					paddingLeft: padding + 'px'
				};
			}
		}
	};
	var transition = function() {
	};
	transition.prototype.beforeEnter = function(el) {
		if (!el.dataset)
			el.dataset = {};
		el.dataset.oldPaddingTop = el.style.paddingTop;
		el.dataset.oldPaddingBottom = el.style.paddingBottom;
		el.style.height = '0';
		el.style.paddingTop = 0;
		el.style.paddingBottom = 0;
	};
	transition.prototype.enter = function(el) {
		el.dataset.oldOverflow = el.style.overflow;
		if (el.scrollHeight !== 0) {
			el.style.height = el.scrollHeight + 'px';
			el.style.paddingTop = el.dataset.oldPaddingTop;
			el.style.paddingBottom = el.dataset.oldPaddingBottom;
		} else {
			el.style.height = '';
			el.style.paddingTop = el.dataset.oldPaddingTop;
			el.style.paddingBottom = el.dataset.oldPaddingBottom;
		}
		el.style.overflow = 'hidden';
	};
	transition.prototype.afterEnter = function(el) {
		el.style.height = '';
		el.style.overflow = el.dataset.oldOverflow;
	};
	transition.prototype.beforeLeave = function(el) {
		if (!el.dataset)
			el.dataset = {};
		el.dataset.oldPaddingTop = el.style.paddingTop;
		el.dataset.oldPaddingBottom = el.style.paddingBottom;
		el.dataset.oldOverflow = el.style.overflow;
		el.style.height = el.scrollHeight + 'px';
		el.style.overflow = 'hidden';
	};
	transition.prototype.leave = function(el) {
		if (el.scrollHeight !== 0) {
			el.style.height = 0;
			el.style.paddingTop = 0;
			el.style.paddingBottom = 0;
		}
	};
	transition.prototype.afterLeave = function(el) {
		el.style.height = '';
		el.style.overflow = el.dataset.oldOverflow;
		el.style.paddingTop = el.dataset.oldPaddingTop;
		el.style.paddingBottom = el.dataset.oldPaddingBottom;
	};
	var collapseTransition = {
		functional: true,
		render: function(createElement, obj) {
			var children = obj.children;
			var data = {
				on: new transition()
			};
			children.map(function(child) {
				child.data.class = ['collapse-transition'];
			});
			return createElement('transition', data, children);
		}
	};
	var clickoutside = function() {
		if (!isServer) {
			on(document, 'click', clickOutSideFn);
		}
		return {
			bind: function(el, binding, vnode) {
				var id = nodeList.push(el) - 1;
				var documentHandler = function(e) {
					if (!vnode.context || el.contains(e.target) || (vnode.context.popperElm && vnode.context.popperElm.contains(e.target)))
						return;
					if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
						vnode.context[el[ctx].methodName]();
					} else {
						el[ctx].bindingFn && el[ctx].bindingFn();
					}
				};
				el[ctx] = {
					id: id,
					documentHandler: documentHandler,
					methodName: binding.expression,
					bindingFn: binding.value
				};
			},
			update: function(el, binding) {
				el[ctx].methodName = binding.expression;
				el[ctx].bindingFn = binding.value;
			},
			unbind: function(el) {
				for (var i = 0, j = nodeList.length; i < j; i++) {
					if (nodeList[i][ctx].id === el[ctx].id) {
						nodeList.splice(i, 1);
						break;
					}
				}
			}
		}
	};
	var throttle = function(delay, noTrailing, callback, debounceMode) {
		var timeoutID;
		var lastExec = 0;
		if (typeof noTrailing !== 'boolean') {
			debounceMode = callback;
			callback = noTrailing;
			noTrailing = undefined;
		}
		function wrapper() {
			var self = this;
			var elapsed = Number(new Date()) - lastExec;
			var args = arguments;
			function exec() {
				lastExec = Number(new Date());
				callback.apply(self, args);
			}
			function clear() {
				timeoutID = undefined;
			}
			if (debounceMode && !timeoutID) {
				exec();
			}
			if (timeoutID) {
				clearTimeout(timeoutID);
			}
			if (debounceMode === undefined && elapsed > delay) {
				exec();
			} else if (noTrailing !== true) {
				timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
			}
		}
		return wrapper;
	};
	var debounce = function(delay, atBegin, callback) {
		return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
	};
	var scrollBarWidth = function() {
		if (isServer)
			return;
		var outer = document.createElement('div');
		outer.className = 'vue-scrollbar__wrap';
		outer.style.visibility = 'hidden';
		outer.style.width = '100px';
		outer.style.position = 'absolute';
		outer.style.top = '-9999px';
		document.body.appendChild(outer);
		var widthNoScroll = outer.offsetWidth;
		outer.style.overflow = 'scroll';
		var inner = document.createElement('div');
		inner.style.width = '100%';
		outer.appendChild(inner);
		var widthWithScroll = inner.offsetWidth;
		outer.parentNode.removeChild(outer);
		return widthNoScroll - widthWithScroll;
	};
	var createStyles = function() {
		if (!stylesCreated && window !== 'undefined') {
			var animationKeyframes = '@' + keyFramePrefix + 'keyframes ' + RESIZE_ANIMATION_NAME + ' { from { opacity: 0; } to { opacity: 0; } } ';
			var animationStyle = keyFramePrefix + 'animation: 1ms ' + RESIZE_ANIMATION_NAME + ';';
			var css = animationKeyframes + '\n .resize-triggers { ' + animationStyle + ' visibility: hidden; opacity: 0; }\n .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; }\n .resize-triggers > div { background: #eee; overflow: auto; }\n .contract-trigger:before { width: 200%; height: 200%; }';
			var head = document.head || document.getElementsByTagName('head')[0];
			var style = document.createElement('style');
			style.type = 'text/css';
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}
			head.appendChild(style);
			stylesCreated = true;
		}
	};
	var resetTrigger = function(element) {
		var trigger = element.__resizeTrigger__;
		var expand = trigger.firstElementChild;
		var contract = trigger.lastElementChild;
		var expandChild = expand.firstElementChild;
		contract.scrollLeft = contract.scrollWidth;
		contract.scrollTop = contract.scrollHeight;
		expandChild.style.width = expand.offsetWidth + 1 + 'px';
		expandChild.style.height = expand.offsetHeight + 1 + 'px';
		expand.scrollLeft = expand.scrollWidth;
		expand.scrollTop = expand.scrollHeight;
	};
	var requestFrame = (function() {
		if (typeof window === 'undefined')
			return;
		var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(fn) {
			return window.setTimeout(fn, 20);
		}
		return function(fn) {
			return raf(fn);
		}
	})();
	var cancelFrame = (function() {
		if (typeof window === 'undefined')
			return;
		var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
		return function(id) {
			return cancel(id);
		}
	})();
	var checkTriggers = function(element) {
		return element.offsetWidth !== element.__resizeLast__.width || element.offsetHeight !== element.__resizeLast__.height;
	};
	var scrollListener = function(event) {
		var self = this;
		resetTrigger(self);
		if (self.__resizeRAF__)
			cancelFrame(self.__resizeRAF__);
		self.__resizeRAF__ = requestFrame(function() {
			if (checkTriggers(self)) {
				self.__resizeLast__.width = self.offsetWidth;
				self.__resizeLast__.height = self.offsetHeight;
				self.__resizeListeners__.forEach(function(fn) {
					fn.call(self, event);
				});
			}
		});
	};
	var addResizeListener = function(element, fn) {
		if (window === 'undefined')
			return;
		if (attachEvent) {
			element.attachEvent('onresize', fn);
		} else {
			if (!element.__resizeTrigger__) {
				if (getComputedStyle(element).position === 'static') {
					element.style.position = 'relative';
				}
				createStyles();
				element.__resizeLast__ = {};
				element.__resizeListeners__ = [];
				var resizeTrigger = element.__resizeTrigger__ = document.createElement('div');
				resizeTrigger.className = 'resize-triggers';
				resizeTrigger.innerHTML = '<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>';
				element.appendChild(resizeTrigger);
				resetTrigger(element);
				element.addEventListener('scroll', scrollListener, true);
				if (animationStartEvent) {
					resizeTrigger.addEventListener(animationStartEvent, function(event) {
						if (event.animationName === RESIZE_ANIMATION_NAME) {
							resetTrigger(element);
						}
					});
				}
			}
			element.__resizeListeners__.push(fn);
		}
	};
	var removeResizeListener = function(element, fn) {
		if (attachEvent) {
			element.detachEvent('onresize', fn);
		} else {
			element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
			if (!element.__resizeListeners__.length) {
				element.removeEventListener('scroll', scrollListener);
				element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
			}
		}
	};
	var newArray = function(start, end) {
		var result = [];
		for (var i = start; i <= end; i++) {
			result.push(i);
		}
		return result;
	};
	var equalDate = function(dateA, dateB) {
		return dateA === dateB || new Date(dateA).getTime() === new Date(dateB).getTime();
	};
	var isDate = function(date) {
		if (date === null || date === undefined) return false;
		if (isNaN(new Date(date).getTime())) return false;
		return true;
	};
	var toDate = function(date) {
		return isDate(date) ? new Date(date) : null;
	};
	var formatDate = function(date, format) {
		date = toDate(date);
		if (!date) return '';
		return DateUtil.format(date, format || 'yyyy-MM-dd');
	};
	var parseDate = function(string, format) {
		return DateUtil.parse(string, format || 'yyyy-MM-dd');
	};
	var getDayCountOfMonth = function(year, month) {
		if (month === 3 || month === 5 || month === 8 || month === 10) {
			return 30;
		}
		if (month === 1) {
			if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
				return 29;
			} else {
				return 28;
			}
		}
		return 31;
	};
	var getFirstDayOfMonth = function(date) {
		var temp = toDate(date);
		temp.setDate(1);
		return temp.getDay();
	};
	var getStartDateOfMonth = function(year, month) {
		var DAY_DURATION = 86400000;
		var result = new Date(year, month, 1);
		var day = result.getDay();
		if (day === 0) {
			result.setTime(result.getTime() - DAY_DURATION * 7);
		} else {
			result.setTime(result.getTime() - DAY_DURATION * day);
		}
		return result;
	};
	var getWeekNumber = function(src) {
		var date = toDate(src);
		date.setHours(0, 0, 0, 0);
		date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
		var week1 = new Date(date.getFullYear(), 0, 4);
		return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
	};
	var prevMonth = function(src) {
		var year = src.getFullYear();
		var month = src.getMonth();
		var date = src.getDate();
		var newYear = month === 0 ? year - 1 : year;
		var newMonth = month === 0 ? 11 : month - 1;
		var newMonthDayCount = getDayCountOfMonth(newYear, newMonth);
		if (newMonthDayCount < date) {
			src.setDate(newMonthDayCount);
		}
		src.setMonth(newMonth);
		src.setFullYear(newYear);
		return new Date(src.getTime());
	};
	var nextMonth = function(src) {
		var year = src.getFullYear();
		var month = src.getMonth();
		var date = src.getDate();
		var newYear = month === 11 ? year + 1 : year;
		var newMonth = month === 11 ? 0 : month + 1;
		var newMonthDayCount = getDayCountOfMonth(newYear, newMonth);
		if (newMonthDayCount < date) {
			src.setDate(newMonthDayCount);
		}
		src.setMonth(newMonth);
		src.setFullYear(newYear);
		return new Date(src.getTime());
	};
	var getRangeHours = function(ranges) {
		var hours = [];
		var disabledHours = [];
		(ranges || []).forEach(function(range) {
			var value = range.map(function(date) {return date.getHours();});
			disabledHours = disabledHours.concat(newArray(value[0], value[1]));
		});
		if (disabledHours.length) {
			for (var i = 0; i < 24; i++) {
				hours[i] = disabledHours.indexOf(i) === -1;
			}
		} else {
			for (var i = 0; i < 24; i++) {
				hours[i] = false;
			}
		}
		return hours;
	};
	var limitRange = function(date, ranges, format) {
		format = format || 'yyyy-MM-dd HH:mm:ss';
		if (!ranges || !ranges.length) return date;
		var len = ranges.length;
		date = DateUtil.parse(DateUtil.format(date, format), format);
		for (var i = 0; i < len; i++) {
			var range = ranges[i];
			if (date >= range[0] && date <= range[1]) {
				return date;
			}
		}
		var maxDate = ranges[0][0];
		var minDate = ranges[0][0];
		ranges.forEach(function(range) {
			minDate = new Date(Math.min(range[0], minDate));
			maxDate = new Date(Math.max(range[1], maxDate));
		});
		return date < minDate ? minDate : maxDate;
	};
	var setLang = function (lang) {
		if (lang) {
			Vue.config.lang = lang;
		}
	};
	var setLocale = function(lang, langObjs) {
		langObjs = merge({}, Vue.locale(lang), langObjs);
		Vue.locale(lang, langObjs);
	};
	var arrayfrom = function(arr) {
		var isCallable = function(fn) {
			return typeof fn === 'function' || Object.prototype.toString.call(fn) === '[object Function]';
		};
		var toInteger = function(value) {
			var number = Number(value);
			if (isNaN(number)) {
				return 0;
			}
			if (number === 0 || !isFinite(number)) {
				return number;
			}
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function(value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};
		var from = function(arrayLike) {
			var C = this;
			var items = Object(arrayLike);
			if (arrayLike == null) {
				throw new TypeError("Array.from requires an array-like object - not null or undefined");
			}
			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;
			if (typeof mapFn !== 'undefined') {
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}
			var len = toLength(items.length);
			var A = isCallable(C) ? Object(new C(len)) : new Array(len);
			var k = 0;
			var kValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					A[k] = kValue;
				}
				k += 1;
			}
			A.length = len;
			return A;
		}
		return from(arr);
	};
	var toConsumableArray = function(arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
				arr2[i] = arr[i];
			}
			return arr2;
		} else {
			return arrayfrom(arr);
		}
	};
	var removeNode = function(node) {
		node.parentElement.removeChild(node);
	};
	var insertNodeAt = function(fatherNode, node, position) {
		if (position < fatherNode.children.length) {
			fatherNode.insertBefore(node, fatherNode.children[position]);
		} else {
			fatherNode.appendChild(node);
		}
	};
	var arrayToObject = function(arr) {
		var res = {};
		for (var i = 0, j=arr.length; i < j; i++) {
			var arrObj = arr[i];
			if (arrObj) {
				for (var key in arrObj) {
					res[key] = arrObj[key];
				}
			}
		}
		return res;
	};
	var loadVue = function(url, mountId, option, callbackFn){
		var mountElement = document.querySelector(mountId);
		if (mountElement) {
			mountElement.innerHTML = '';
			if (typeof option === 'undefined') option = {};
			Vue.http.get(url).then(function(response) {
				var tmpDiv = document.createElement('DIV');
				tmpDiv.innerHTML = response.bodyText;
				var vueStyle = tmpDiv.querySelector('style');
				if (vueStyle.id && !document.querySelector('#'+vueStyle.id)) {
					mountElement.appendChild(vueStyle);
				}
				var vueScript = tmpDiv.querySelector('script');
				var newScript = document.createElement('script');
				newScript.innerHTML = "!(function(name, context, definition) {'use strict';context[name] = definition();})('_loadVue', this, function(Vue, VueUtil) {" + vueScript.innerHTML + "});";
				mountElement.appendChild(newScript).parentNode.removeChild(newScript);
				_loadVue.template = tmpDiv.querySelector('template').innerHTML;
				var newVue = Vue.extend(_loadVue);
				var newMount = new newVue(option);
				mountElement.appendChild(newMount.$mount().$el);
				if (typeof callbackFn === 'function') {
					callbackFn(newMount.$data, newMount);
				}
				_loadVue = null;
			});
		}
	};
	var screenfull = function(){
		if (!Screenfull.enabled) {
			this.$alert(this.$t('vue.screenfull.canot'),{
				type: 'warning'
			});
			return false;
		}
		Screenfull.toggle();
	};
	return {
		on: on,
		off: off,
		once: once,
		trim: trim,
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		getStyle: getStyle,
		setStyle: setStyle,
		merge: merge,
		addResizeListener: addResizeListener,
		removeResizeListener: removeResizeListener,
		parseDate: parseDate,
		formatDate: formatDate,
		isDate: isDate,
		toDate: toDate,
		setLang: setLang,
		setLocale: setLocale,
		removeNode: removeNode,
		insertNodeAt: insertNodeAt,
		arrayToObject: arrayToObject,
		screenfull: screenfull,
		loadVue: loadVue,
		component:{
			menumixin: menumixin,
			emitter: emitter,
			collapseTransition: collapseTransition,
			clickoutside: clickoutside,
			throttle: throttle,
			debounce: debounce,
			scrollBarWidth: scrollBarWidth,
			getRangeHours: getRangeHours,
			getStartDateOfMonth: getStartDateOfMonth,
			getDayCountOfMonth: getDayCountOfMonth,
			limitRange: limitRange,
			getFirstDayOfMonth: getFirstDayOfMonth,
			getWeekNumber: getWeekNumber,
			toConsumableArray: toConsumableArray,
			prevMonth: prevMonth,
			nextMonth: nextMonth
		}
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueLang', this, function(Vue, VueUtil) {
	'use strict';
	var VueLang = {
		zh: {
			vue: {
				colorpicker: {
					confirm: '确定',
					clear: '清空'
				},
				datepicker: {
					now: '此刻',
					today: '今天',
					cancel: '取消',
					clear: '清空',
					confirm: '确定',
					selectDate: '选择日期',
					selectTime: '选择时间',
					startDate: '开始日期',
					startTime: '开始时间',
					endDate: '结束日期',
					endTime: '结束时间',
					year: '年',
					month1: '1 月',
					month2: '2 月',
					month3: '3 月',
					month4: '4 月',
					month5: '5 月',
					month6: '6 月',
					month7: '7 月',
					month8: '8 月',
					month9: '9 月',
					month10: '10 月',
					month11: '11 月',
					month12: '12 月',
					weeks: {
						sun: '日',
						mon: '一',
						tue: '二',
						wed: '三',
						thu: '四',
						fri: '五',
						sat: '六'
					},
					months: {
						jan: '一月',
						feb: '二月',
						mar: '三月',
						apr: '四月',
						may: '五月',
						jun: '六月',
						jul: '七月',
						aug: '八月',
						sep: '九月',
						oct: '十月',
						nov: '十一月',
						dec: '十二月'
					}
				},
				select: {
					loading: '加载中',
					noMatch: '无匹配数据',
					noData: '无数据',
					placeholder: '请选择'
				},
				cascader: {
					noMatch: '无匹配数据',
					placeholder: '请选择'
				},
				pagination: {
					goto: '前往',
					pagesize: '条/页',
					total: '共 {total} 条',
					pageClassifier: '页'
				},
				messagebox: {
					title: '提示',
					confirm: '确定',
					cancel: '取消',
					error: '输入的数据不合法!'
				},
				upload: {
					delete: '删除',
					preview: '查看图片',
					continue: '继续上传'
				},
				table: {
					emptyText: '暂无数据',
					confirmFilter: '筛选',
					resetFilter: '重置',
					clearFilter: '全部',
					sumText: '合计'
				},
				tree: {
					emptyText: '暂无数据'
				},
				screenfull: {
					canot: '不兼容您的浏览器!'
				}
			}
		},
		ja: {
			vue: {
				colorpicker: {
					confirm: 'はい',
					clear: 'クリア'
				},
				datepicker: {
					now: '現在',
					today: '今日',
					cancel: 'キャンセル',
					clear: 'クリア',
					confirm: 'はい',
					selectDate: '日付を選択',
					selectTime: '時間を選択',
					startDate: '開始日',
					startTime: '開始時間',
					endDate: '終了日',
					endTime: '終了時間',
					year: '年',
					month1: '一月',
					month2: '二月',
					month3: '三月',
					month4: '四月',
					month5: '五月',
					month6: '六月',
					month7: '七月',
					month8: '八月',
					month9: '九月',
					month10: '十月',
					month11: '十一月',
					month12: '十二月',
					weeks: {
						sun: '日',
						mon: '月',
						tue: '火',
						wed: '水',
						thu: '木',
						fri: '金',
						sat: '土'
					},
					months: {
						jan: '一月',
						feb: '二月',
						mar: '三月',
						apr: '四月',
						may: '五月',
						jun: '六月',
						jul: '七月',
						aug: '八月',
						sep: '九月',
						oct: '十月',
						nov: '十一月',
						dec: '十二月'
					}
				},
				select: {
					loading: 'ロード中',
					noMatch: 'データなし',
					noData: 'データなし',
					placeholder: '選択してください'
				},
				cascader: {
					noMatch: 'データなし',
					placeholder: '選択してください'
				},
				pagination: {
					goto: '',
					pagesize: '件/ページ',
					total: '総計 {total} 件',
					pageClassifier: 'ページ目へ'
				},
				messagebox: {
					title: 'メッセージ',
					confirm: 'はい',
					cancel: 'キャンセル',
					error: '正しくない入力'
				},
				upload: {
					delete: '削除する',
					preview: 'プレビュー',
					continue: '続行する'
				},
				table: {
					emptyText: 'データなし',
					confirmFilter: '確認',
					resetFilter: '初期化',
					clearFilter: 'すべて',
					sumText: '合計'
				},
				tree: {
					emptyText: 'データなし'
				},
				screenfull: {
					canot: 'ブラウザは実行できません!'
				}
			}
		},
		en: {
			vue: {
				colorpicker: {
					confirm: 'OK',
					clear: 'Clear'
				},
				datepicker: {
					now: 'Now',
					today: 'Today',
					cancel: 'Cancel',
					clear: 'Clear',
					confirm: 'OK',
					selectDate: 'Select date',
					selectTime: 'Select time',
					startDate: 'Start Date',
					startTime: 'Start Time',
					endDate: 'End Date',
					endTime: 'End Time',
					year: '',
					month1: 'Jan',
					month2: 'Feb',
					month3: 'Mar',
					month4: 'Apr',
					month5: 'May',
					month6: 'Jun',
					month7: 'Jul',
					month8: 'Aug',
					month9: 'Sep',
					month10: 'Oct',
					month11: 'Nov',
					month12: 'Dec',
					weeks: {
						sun: 'Sun',
						mon: 'Mon',
						tue: 'Tue',
						wed: 'Wed',
						thu: 'Thu',
						fri: 'Fri',
						sat: 'Sat'
					},
					months: {
						jan: 'Jan',
						feb: 'Feb',
						mar: 'Mar',
						apr: 'Apr',
						may: 'May',
						jun: 'Jun',
						jul: 'Jul',
						aug: 'Aug',
						sep: 'Sep',
						oct: 'Oct',
						nov: 'Nov',
						dec: 'Dec'
					}
				},
				select: {
					loading: 'Loading',
					noMatch: 'No matching data',
					noData: 'No data',
					placeholder: 'Select'
				},
				cascader: {
					noMatch: 'No matching data',
					placeholder: 'Select'
				},
				pagination: {
					goto: 'Go to',
					pagesize: '/page',
					total: 'Total {total}',
					pageClassifier: ''
				},
				messagebox: {
					title: 'Message',
					confirm: 'OK',
					cancel: 'Cancel',
					error: 'Illegal input'
				},
				upload: {
					delete: 'Delete',
					preview: 'Preview',
					continue: 'Continue'
				},
				table: {
					emptyText: 'No Data',
					confirmFilter: 'Confirm',
					resetFilter: 'Reset',
					clearFilter: 'All',
					sumText: 'Sum'
				},
				tree: {
					emptyText: 'No Data'
				},
				screenfull: {
					canot: 'You browser can\'t work!'
				}
			}
		}
	}
	VueUtil.setLocale('zh', VueLang.zh);
	VueUtil.setLocale('ja', VueLang.ja);
	VueUtil.setLocale('en', VueLang.en);
	VueUtil.setLang('zh');
});!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(definition);
	} else {
		context[name] = definition();
	}
})('VueValidator', this, function(Vue) {
	'use strict';
	var newMessages = function() {
		return {
			default: 'Validation error on field %s',
			required: '%s is required',
			enum: '%s must be one of %s',
			whitespace: '%s cannot be empty',
			date: {
				format: '%s date %s is invalid for format %s',
				parse: '%s date could not be parsed, %s is invalid ',
				invalid: '%s date %s is invalid',
			},
			types: {
				string: '%s is not a %s',
				method: '%s is not a %s (function)',
				array: '%s is not an %s',
				object: '%s is not an %s',
				number: '%s is not a %s',
				date: '%s is not a %s',
				boolean: '%s is not a %s',
				integer: '%s is not an %s',
				float: '%s is not a %s',
				regexp: '%s is not a valid %s',
				email: '%s is not a valid %s',
				url: '%s is not a valid %s',
				hex: '%s is not a valid %s',
			},
			string: {
				len: '%s must be exactly %s characters',
				min: '%s must be at least %s characters',
				max: '%s cannot be longer than %s characters',
				range: '%s must be between %s and %s characters',
			},
			number: {
				len: '%s must equal %s',
				min: '%s cannot be less than %s',
				max: '%s cannot be greater than %s',
				range: '%s must be between %s and %s',
			},
			array: {
				len: '%s must be exactly %s in length',
				min: '%s cannot be less than %s in length',
				max: '%s cannot be greater than %s in length',
				range: '%s must be between %s and %s in length',
			},
			pattern: {
				mismatch: '%s value %s does not match pattern %s',
			},
			clone: function() {
				var cloned = JSON.parse(JSON.stringify(this));
				cloned.clone = this.clone;
				return cloned;
			},
		};
	};
	var defaultMessages = newMessages();
	var _extends = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}
		return target;
	}
	var formatRegExp = /%[sdj%]/g;
	var warning2 = function(type, message) {
		if (typeof console !== 'undefined' && console.warn) {
			console.warn(type, message);
		}
	};
	var warning = function(type, errors) {
		if (errors.every(function(e) {
			return typeof e === 'string'
		})) {
			warning2(type, errors);
		}
	};
	var format = function() {
		var i = 1;
		var f = arguments[0];
		var len = arguments.length;
		if (typeof f === 'function') {
			return f.apply(null, arguments.slice(1));
		}
		if (typeof f === 'string') {
			var str = String(f).replace(formatRegExp, function(x) {
				if (x === '%%') {
					return '%';
				}
				if (i >= len) {
					return x;
				}
				switch (x) {
				case '%s':
					return String(arguments[i++]);
				case '%d':
					return Number(arguments[i++]);
				case '%j':
					try {
						return JSON.stringify(arguments[i++]);
					} catch (_) {
						return '[Circular]';
					}
					break;
				default:
					return x;
				}
			});
			for (var arg = arguments[i]; i < len; arg = arguments[++i]) {
				str += ' ' + arg;
			}
			return str;
		}
		return f;
	};
	var isNativeStringType = function(type) {
		return type === 'string' || type === 'url' || type === 'hex' || type === 'email' || type === 'pattern';
	};
	var isEmptyValue = function(value, type) {
		if (value === undefined || value === null) {
			return true;
		}
		if (type === 'array' && Array.isArray(value) && !value.length) {
			return true;
		}
		if (isNativeStringType(type) && typeof value === 'string' && !value) {
			return true;
		}
		return false;
	};
	var isEmptyObject = function(obj) {
		return Object.keys(obj).length === 0;
	};
	var asyncParallelArray = function(arr, func, callback) {
		var results = [];
		var total = 0;
		var arrLength = arr.length;
		function count(errors) {
			results.push.apply(results, errors);
			total++;
			if (total === arrLength) {
				callback(results);
			}
		}
		arr.forEach(function(a) {
			func(a, count);
		});
	};
	var asyncSerialArray = function(arr, func, callback) {
		var index = 0;
		var arrLength = arr.length;
		function next(errors) {
			if (errors && errors.length) {
				callback(errors);
				return;
			}
			var original = index;
			index = index + 1;
			if (original < arrLength) {
				func(arr[original], next);
			} else {
				callback([]);
			}
		}
		next([]);
	};
	var flattenObjArr = function(objArr) {
		var ret = [];
		Object.keys(objArr).forEach(function(k) {
			ret.push.apply(ret, objArr[k]);
		});
		return ret;
	};
	var asyncMap = function(objArr, option, func, callback) {
		if (option.first) {
			var flattenArr = flattenObjArr(objArr);
			return asyncSerialArray(flattenArr, func, callback);
		}
		var firstFields = option.firstFields || [];
		if (firstFields === true) {
			firstFields = Object.keys(objArr);
		}
		var objArrKeys = Object.keys(objArr);
		var objArrLength = objArrKeys.length;
		var total = 0;
		var results = [];
		var next = function(errors) {
			results.push.apply(results, errors);
			total++;
			if (total === objArrLength) {
				callback(results);
			}
		};
		objArrKeys.forEach(function(key) {
			var arr = objArr[key];
			if (firstFields.indexOf(key) !== -1) {
				asyncSerialArray(arr, func, next);
			} else {
				asyncParallelArray(arr, func, next);
			}
		});
	};
	var complementError = function(rule) {
		return function(oe) {
			if (oe && oe.message) {
				oe.field = oe.field || rule.fullField;
				return oe;
			}
			return {
				message: oe,
				field: oe.field || rule.fullField,
			};
		}
	};
	var deepMerge = function(target, source) {
		if (source) {
			for (var s in source) {
				if (source.hasOwnProperty(s)) {
					var value = source[s];
					if (typeof value === 'object' && typeof target[s] === 'object') {
						target[s] = _extends({}, target[s], value);
					} else {
						target[s] = value;
					}
				}
			}
		}
		return target;
	};
	var rulesEnumerable = function(rule, value, source, errors, options) {
		var ENUM = 'enum';
		rule[ENUM] = Array.isArray(rule[ENUM]) ? rule[ENUM] : [];
		if (rule[ENUM].indexOf(value) === -1) {
			errors.push(format(options.messages[ENUM], rule.fullField, rule[ENUM].join(', ')));
		}
	};
	var rulesPattern = function(rule, value, source, errors, options) {
		if (rule.pattern instanceof RegExp) {
			if (!rule.pattern.test(value)) {
				errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
			}
		}
	};
	var rulesRange = function(rule, value, source, errors, options) {
		var len = typeof rule.len === 'number';
		var min = typeof rule.min === 'number';
		var max = typeof rule.max === 'number';
		var val = value;
		var key = null;
		var num = typeof (value) === 'number';
		var str = typeof (value) === 'string';
		var arr = Array.isArray(value);
		if (num) {
			key = 'number';
		} else if (str) {
			key = 'string';
		} else if (arr) {
			key = 'array';
		}
		if (!key) {
			return false;
		}
		if (str || arr) {
			val = value.length;
		}
		if (len) {
			if (val !== rule.len) {
				errors.push(format(options.messages[key].len, rule.fullField, rule.len));
			}
		} else if (min && !max && val < rule.min) {
			errors.push(format(options.messages[key].min, rule.fullField, rule.min));
		} else if (max && !min && val > rule.max) {
			errors.push(format(options.messages[key].max, rule.fullField, rule.max));
		} else if (min && max && (val < rule.min || val > rule.max)) {
			errors.push(format(options.messages[key].range, rule.fullField, rule.min, rule.max));
		}
	};
	var rulesRequired = function(rule, value, source, errors, options, type) {
		if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type || rule.type))) {
			errors.push(format(options.messages.required, rule.fullField));
		}
	};
	var rulesType = function(rule, value, source, errors, options) {
		var pattern = {
			email: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
			url: new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$','i'),
			hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i,
		};
		var types = {
			integer: function(value) {
				return types.number(value) && parseInt(value, 10) === value;
			},
			float: function(value) {
				return types.number(value) && !types.integer(value);
			},
			array: function(value) {
				return Array.isArray(value);
			},
			regexp: function(value) {
				if (value instanceof RegExp) {
					return true;
				}
				try {
					return !!new RegExp(value);
				} catch (e) {
					return false;
				}
			},
			date: function(value) {
				return typeof value.getTime === 'function' && typeof value.getMonth === 'function' && typeof value.getYear === 'function';
			},
			number: function(value) {
				if (isNaN(value)) {
					return false;
				}
				return typeof (value) === 'number';
			},
			object: function(value) {
				return typeof (value) === 'object' && !types.array(value);
			},
			method: function(value) {
				return typeof (value) === 'function';
			},
			email: function(value) {
				return typeof (value) === 'string' && !!value.match(pattern.email);
			},
			url: function(value) {
				return typeof (value) === 'string' && !!value.match(pattern.url);
			},
			hex: function(value) {
				return typeof (value) === 'string' && !!value.match(pattern.hex);
			},
		};
		if (rule.required && value === undefined) {
			rulesRequired(rule, value, source, errors, options);
			return;
		}
		var custom = ['integer', 'float', 'array', 'regexp', 'object', 'method', 'email', 'number', 'date', 'url', 'hex'];
		var ruleType = rule.type;
		if (custom.indexOf(ruleType) > -1) {
			if (!types[ruleType](value)) {
				errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
			}
		} else if (ruleType && typeof (value) !== rule.type) {
			errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
		}
	};
	var rulesWhitespace = function(rule, value, source, errors, options) {
		if (/^\s+$/.test(value) || value === '') {
			errors.push(format(options.messages.whitespace, rule.fullField));
		}
	};
	var rules = {
		enum: rulesEnumerable,
		pattern: rulesPattern,
		range: rulesRange,
		required: rulesRequired,
		type: rulesType,
		whitespace: rulesWhitespace
	};
	var validtorDate = function(rule, value, callback, source, options) {
		var errors = [];
		var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
		if (validate) {
			if (isEmptyValue(value) && !rule.required) {
				return callback();
			}
			rules.required(rule, value, source, errors, options);
			if (!isEmptyValue(value)) {
				rules.type(rule, value, source, errors, options);
				if (value) {
					rules.range(rule, value.getTime(), source, errors, options);
				}
			}
		}
		callback(errors);
	};
	var validtorBoolean = function(rule, value, callback, source, options) {
		var errors = [];
		var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
		if (validate) {
			if (isEmptyValue(value) && !rule.required) {
				return callback();
			}
			rules.required(rule, value, source, errors, options);
			if (value !== undefined) {
				rules.type(rule, value, source, errors, options);
			}
		}
		callback(errors);
	};
	var validtorArray = function(rule, value, callback, source, options) {
		var errors = [];
		var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
		if (validate) {
			if (isEmptyValue(value, 'array') && !rule.required) {
				return callback();
			}
			rules.required(rule, value, source, errors, options, 'array');
			if (!isEmptyValue(value, 'array')) {
				rules.type(rule, value, source, errors, options);
				rules.range(rule, value, source, errors, options);
			}
		}
		callback(errors);
	};
	var validtorType = function(rule, value, callback, source, options) {
		var ruleType = rule.type;
		var errors = [];
		var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
		if (validate) {
			if (isEmptyValue(value, ruleType) && !rule.required) {
				return callback();
			}
			rules.required(rule, value, source, errors, options, ruleType);
			if (!isEmptyValue(value, ruleType)) {
				rules.type(rule, value, source, errors, options);
			}
		}
		callback(errors);
	};
	var validtorString = function(rule, value, callback, source, options) {
		var errors = [];
		var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
		if (validate) {
			if (isEmptyValue(value, 'string') && !rule.required) {
				return callback();
			}
			rules.required(rule, value, source, errors, options, 'string');
			if (!isEmptyValue(value, 'string')) {
				rules.type(rule, value, source, errors, options);
				rules.range(rule, value, source, errors, options);
				rules.pattern(rule, value, source, errors, options);
				if (rule.whitespace === true) {
					rules.whitespace(rule, value, source, errors, options);
				}
			}
		}
		callback(errors);
	};
	var validtorRequired = function(rule, value, callback, source, options) {
		var errors = [];
		var type = Array.isArray(value) ? 'array' : typeof value;
		rules.required(rule, value, source, errors, options, type);
		callback(errors);
	};
	var validtorRegexp = function(rule, value, callback, source, options) {
		var errors = [];
		var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
		if (validate) {
			if (isEmptyValue(value) && !rule.required) {
				return callback();
			}
			rules.required(rule, value, source, errors, options);
			if (!isEmptyValue(value)) {
				rules.type(rule, value, source, errors, options);
			}
		}
		callback(errors);
	};
	var validtorPattern = function(rule, value, callback, source, options) {
		var errors = [];
		var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
		if (validate) {
			if (isEmptyValue(value, 'string') && !rule.required) {
				return callback();
			}
			rules.required(rule, value, source, errors, options);
			if (!isEmptyValue(value, 'string')) {
				rules.pattern(rule, value, source, errors, options);
			}
		}
		callback(errors);
	};
	var validtorObject = function(rule, value, callback, source, options) {
		var errors = [];
		var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
		if (validate) {
			if (isEmptyValue(value) && !rule.required) {
				return callback();
			}
			rules.required(rule, value, source, errors, options);
			if (value !== undefined) {
				rules.type(rule, value, source, errors, options);
			}
		}
		callback(errors);
	};
	var validtorNumber = function(rule, value, callback, source, options) {
		var errors = [];
		var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
		if (validate) {
			if (isEmptyValue(value) && !rule.required) {
				return callback();
			}
			rules.required(rule, value, source, errors, options);
			if (value !== undefined) {
				rules.type(rule, value, source, errors, options);
				rules.range(rule, value, source, errors, options);
			}
		}
		callback(errors);
	};
	var validtorMethod = function(rule, value, callback, source, options) {
		var errors = [];
		var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
		if (validate) {
			if (isEmptyValue(value) && !rule.required) {
				return callback();
			}
			rules.required(rule, value, source, errors, options);
			if (value !== undefined) {
				rules.type(rule, value, source, errors, options);
			}
		}
		callback(errors);
	};
	var validtorEnumerable = function(rule, value, callback, source, options) {
		var errors = [];
		var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
		if (validate) {
			if (isEmptyValue(value) && !rule.required) {
				return callback();
			}
			rules.required(rule, value, source, errors, options);
			if (value) {
				rules['enum'](rule, value, source, errors, options);
			}
		}
		callback(errors);
	};
	var validators = {
		string: validtorString,
		method: validtorMethod,
		number: validtorNumber,
		boolean: validtorBoolean,
		regexp: validtorRegexp,
		integer: validtorNumber,
		float: validtorNumber,
		array: validtorArray,
		object: validtorObject,
		enum: validtorEnumerable,
		pattern: validtorPattern,
		email: validtorType,
		url: validtorType,
		date: validtorDate,
		hex: validtorType,
		required: validtorRequired
	};
	var Schema = function(descriptor) {
		this.rules = null;
		this._messages = defaultMessages;
		this.define(descriptor);
	};
	Schema.prototype = {
		messages: function(messages) {
			if (messages) {
				this._messages = deepMerge(newMessages(), messages);
			}
			return this._messages;
		},
		define: function(rules) {
			if (!rules) {
				throw new Error('Cannot configure a schema with no rules');
			}
			if (typeof rules !== 'object' || Array.isArray(rules)) {
				throw new Error('Rules must be an object');
			}
			this.rules = {};
			var z;
			var item;
			for (z in rules) {
				if (rules.hasOwnProperty(z)) {
					item = rules[z];
					this.rules[z] = Array.isArray(item) ? item : [item];
				}
			}
		},
		validate: function(source_, o, oc) {
			var source = source_;
			var options = o;
			var callback = oc;
			if (typeof options === 'function') {
				callback = options;
				options = {};
			}
			if (!this.rules || Object.keys(this.rules).length === 0) {
				if (callback) {
					callback();
				}
				return;
			}
			function complete(results) {
				var i;
				var field;
				var errors = [];
				var fields = {};
				function add(e) {
					if (Array.isArray(e)) {
						errors = errors.concat.apply(errors, e);
					} else {
						errors.push(e);
					}
				}
				for (i = 0; i < results.length; i++) {
					add(results[i]);
				}
				if (!errors.length) {
					errors = null;
					fields = null;
				} else {
					for (i = 0; i < errors.length; i++) {
						field = errors[i].field;
						fields[field] = fields[field] || [];
						fields[field].push(errors[i]);
					}
				}
				callback(errors, fields);
			}
			if (options.messages) {
				var messages = this.messages();
				if (messages === defaultMessages) {
					messages = newMessages();
				}
				deepMerge(messages, options.messages);
				options.messages = messages;
			} else {
				options.messages = this.messages();
			}
			options.error = rules;
			var self = this;
			var arr;
			var value;
			var series = {};
			var keys = options.keys || Object.keys(self.rules);
			keys.forEach(function(z) {
				arr = self.rules[z];
				value = source[z];
				arr.forEach(function(r) {
					var rule = r;
					if (typeof (rule.transform) === 'function') {
						if (source === source_) {
							source = _extends({}, source);
						}
						value = source[z] = rule.transform(value);
					}
					if (typeof (rule) === 'function') {
						rule = {
							validator: rule,
						};
					} else {
						rule = _extends({}, rule);
					}
					rule.validator = self.getValidationMethod(rule);
					rule.field = z;
					rule.fullField = rule.fullField || z;
					rule.type = self.getType(rule);
					if (!rule.validator) {
						return;
					}
					series[z] = series[z] || [];
					series[z].push({
						rule: rule,
						value: value,
						source: source,
						field: z,
					});
				});
			});
			var errorFields = {};
			asyncMap(series, options, function(data, doIt) {
				var rule = data.rule;
				var deep = (rule.type === 'object' || rule.type === 'array') && (typeof (rule.fields) === 'object' || typeof (rule.defaultField) === 'object');
				deep = deep && (rule.required || (!rule.required && data.value));
				rule.field = data.field;
				function addFullfield(key, schema) {
					return _extends({}, schema, {
						fullField: rule.fullField + '.' + key
					});
				}
				function cb() {
					var errors = arguments.length > 0 && undefined !== arguments[0] ? arguments[0] : [];
					if (!Array.isArray(errors)) {
						errors = [errors];
					}
					if (errors.length && rule.message) {
						errors = [].concat(rule.message);
					}
					errors = errors.map(complementError(rule));
					if ((options.first || options.fieldFirst) && errors.length) {
						errorFields[rule.field] = 1;
						return doIt(errors);
					}
					if (!deep) {
						doIt(errors);
					} else {
						if (rule.required && !data.value) {
							if (rule.message) {
								errors = [].concat(rule.message).map(complementError(rule));
							} else {
								errors = [options.error(rule, format(options.messages.required, rule.field))];
							}
							return doIt(errors);
						}
						var fieldsSchema = {};
						if (rule.defaultField) {
							for (var k in data.value) {
								if (data.value.hasOwnProperty(k)) {
									fieldsSchema[k] = rule.defaultField;
								}
							}
						}
						fieldsSchema = _extends({}, fieldsSchema, data.rule.fields);
						for (var f in fieldsSchema) {
							if (fieldsSchema.hasOwnProperty(f)) {
								var fieldSchema = Array.isArray(fieldsSchema[f]) ? fieldsSchema[f] : [fieldsSchema[f]];
								fieldsSchema[f] = fieldSchema.map(addFullfield.bind(null, f));
							}
						}
						var schema = new Schema(fieldsSchema);
						schema.messages(options.messages);
						if (data.rule.options) {
							data.rule.options.messages = options.messages;
							data.rule.options.error = options.error;
						}
						schema.validate(data.value, data.rule.options || options, function(errs) {
							doIt(errs && errs.length ? errors.concat(errs) : errs);
						});
					}
				}
				rule.validator(rule, data.value, cb, data.source, options);
			}, function(results) {
				complete(results);
			});
		},
		getType: function(rule) {
			if (rule.type === undefined && (rule.pattern instanceof RegExp)) {
				rule.type = 'pattern';
			}
			if (typeof (rule.validator) !== 'function' && (rule.type && !validators.hasOwnProperty(rule.type))) {
				throw new Error(format('Unknown rule type %s', rule.type));
			}
			return rule.type || 'string';
		},
		getValidationMethod: function(rule) {
			if (typeof rule.validator === 'function') {
				return rule.validator;
			}
			var keys = Object.keys(rule);
			var messageIndex = keys.indexOf('message');
			if (messageIndex !== -1) {
				keys.splice(messageIndex, 1);
			}
			if (keys.length === 1 && keys[0] === 'required') {
				return validators.required;
			}
			return validators[this.getType(rule)] || false;
		},
	};
	Schema.register = function register(type, validator) {
		if (typeof validator !== 'function') {
			throw new Error('Cannot register a validator by type, validator is not a function');
		}
		validators[type] = validator;
	}
	Schema.messages = defaultMessages;
	return Schema;
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
	}
})('VuePopup', this, function(Vue, VueUtil) {
	'use strict';
	var instances = {};
	var PopupManager = {
		zIndex: 2000,
		getInstance: function(id) {
			return instances[id];
		},
		register: function(id, instance) {
			if (id && instance) {
				instances[id] = instance;
			}
		},
		deregister: function(id) {
			if (id) {
				instances[id] = null;
				delete instances[id];
			}
		},
		nextZIndex: function() {
			return PopupManager.zIndex++;
		},
		modalStack: [],
		doOnModalClick: function() {
			var topItem = this.modalStack[this.modalStack.length - 1];
			if (!topItem)
				return;
			var instance = this.getInstance(topItem.id);
			if (instance && instance.closeOnClickModal) {
				instance.close();
			}
		},
		openModal: function(id, zIndex, dom, modalClass) {
			if (Vue.prototype.$isServer)
				return;
			if (!id || zIndex === undefined)
				return;
			var modalStack = this.modalStack;
			for (var i = 0, j = modalStack.length; i < j; i++) {
				var item = modalStack[i];
				if (item.id === id) {
					return;
				}
			}
			this.modalStack.push({
				id: id,
				zIndex: zIndex,
				modalClass: modalClass
			});
		},
		closeModal: function(id) {
			var modalStack = this.modalStack;
			if (modalStack.length > 0) {
				var topItem = modalStack[modalStack.length - 1];
				if (topItem.id === id) {
					modalStack.pop();
				} else {
					for (var i = modalStack.length - 1; i >= 0; i--) {
						if (modalStack[i].id === id) {
							modalStack.splice(i, 1);
							break;
						}
					}
				}
			}
		}
	};
	!Vue.prototype.$isServer && window.addEventListener('keydown', function(event) {
		if (event.keyCode === 27) {
			if (PopupManager.modalStack.length > 0) {
				var topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1];
				if (!topItem)
					return;
				var instance = PopupManager.getInstance(topItem.id);
				if (instance.closeOnPressEscape) {
					instance.close();
				}
			}
		}
	});
	var idSeed = 1;
	var transitions = [];
	var hookTransition = function(transition) {
		if (transitions.indexOf(transition) !== -1)
			return;
		var getVueInstance = function(element) {
			var instance = element.__vue__;
			if (!instance) {
				var textNode = element.previousSibling;
				if (textNode.__vue__) {
					instance = textNode.__vue__;
				}
			}
			return instance;
		};
		Vue.transition(transition, {
			afterEnter: function(el) {
				var instance = getVueInstance(el);
				if (instance) {
					instance.doAfterOpen && instance.doAfterOpen();
				}
			},
			afterLeave: function(el) {
				var instance = getVueInstance(el);
				if (instance) {
					instance.doAfterClose && instance.doAfterClose();
				}
			}
		});
	};
	var scrollBarWidth;
	var getDOM = function(dom) {
		if (dom.nodeType === 3) {
			dom = dom.nextElementSibling || dom.nextSibling;
			getDOM(dom);
		}
		return dom;
	};
	var VuePopup = {};
	VuePopup.model = {
		prop: 'visible',
		event: 'visible-change'
	};
	VuePopup.props = {
		visible: {
			type: Boolean,
			default: false
		},
		transition: {
			type: String,
			default: ''
		},
		openDelay: {},
		closeDelay: {},
		zIndex: {},
		modal: {
			type: Boolean,
			default: true
		},
		modalClass: {},
		modalAppendToBody: {
			type: Boolean,
			default: false
		},
		lockScroll: {
			type: Boolean,
			default: true
		},
		closeOnPressEscape: {
			type: Boolean,
			default: true
		},
		closeOnClickModal: {
			type: Boolean,
			default: false
		}
	};
	VuePopup.created = function() {
		if (this.transition) {
			hookTransition(this.transition);
		}
	}
	VuePopup.beforeMount = function() {
		this._popupId = 'popup-' + idSeed++;
		PopupManager.register(this._popupId, this);
	}
	VuePopup.beforeDestroy = function() {
		PopupManager.deregister(this._popupId);
		PopupManager.closeModal(this._popupId);
		if (this.modal && this.bodyOverflow !== null && this.bodyOverflow !== 'hidden') {
			document.body.style.overflow = this.bodyOverflow;
			document.body.style.paddingRight = this.bodyPaddingRight;
		}
		this.bodyOverflow = null;
		this.bodyPaddingRight = null;
	}
	VuePopup.data = function() {
		return {
			opened: false,
			bodyOverflow: null,
			bodyPaddingRight: null,
			rendered: false
		};
	}
	VuePopup.watch = {
		visible: function(val) {
			if (val) {
				if (this._opening)
					return;
				if (!this.rendered) {
					var self = this;
					this.rendered = true;
					Vue.nextTick(function() {
						self.open();
					});
				} else {
					this.open();
				}
			} else {
				this.close();
			}
		}
	};
	VuePopup.methods = {
		open: function(options) {
			var self = this;
			if (!self.rendered) {
				self.rendered = true;
				self.$emit('visible-change', true);
			}
			var props = VueUtil.merge({}, self, options);
			if (self._closeTimer) {
				clearTimeout(self._closeTimer);
				self._closeTimer = null;
			}
			clearTimeout(self._openTimer);
			var openDelay = Number(props.openDelay);
			if (openDelay > 0) {
				self._openTimer = setTimeout(function() {
					self._openTimer = null;
					self.doOpen(props);
				}, openDelay);
			} else {
				self.doOpen(props);
			}
		},
		doOpen: function(props) {
			if (this.$isServer)
				return;
			if (this.willOpen && !this.willOpen())
				return;
			if (this.opened)
				return;
			this._opening = true;
			this.$emit('visible-change', true);
			var dom = getDOM(this.$el);
			var modal = props.modal;
			var zIndex = props.zIndex;
			if (zIndex) {
				PopupManager.zIndex = zIndex;
			}
			if (modal) {
				if (this._closing) {
					PopupManager.closeModal(this._popupId);
					this._closing = false;
				}
				PopupManager.openModal(this._popupId, PopupManager.nextZIndex(), dom, props.modalClass);
				if (props.lockScroll) {
					if (!this.bodyOverflow) {
						this.bodyPaddingRight = document.body.style.paddingRight;
						this.bodyOverflow = document.body.style.overflow;
					}
					scrollBarWidth = VueUtil.component.scrollBarWidth();
					var bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
					if (scrollBarWidth > 0 && bodyHasOverflow) {
						document.body.style.paddingRight = scrollBarWidth + 'px';
					}
					document.body.style.overflow = 'hidden';
				}
			}
			if (getComputedStyle(dom).position === 'static') {
				dom.style.position = 'absolute';
			}
			dom.style.zIndex = PopupManager.nextZIndex();
			this.opened = true;
			this.onOpen && this.onOpen();
			if (!this.transition) {
				this.doAfterOpen();
			}
		},
		doAfterOpen: function() {
			this._opening = false;
		},
		close: function() {
			var self = this;
			if (self.willClose && !self.willClose())
				return;
			if (self._openTimer !== null) {
				clearTimeout(self._openTimer);
				self._openTimer = null;
			}
			clearTimeout(self._closeTimer);
			var closeDelay = Number(self.closeDelay);
			if (closeDelay > 0) {
				self._closeTimer = setTimeout(function() {
					self._closeTimer = null;
					self.doClose();
				}, closeDelay);
			} else {
				self.doClose();
			}
		},
		doClose: function() {
			var self = this;
			self.$emit('visible-change', false);
			self._closing = true;
			self.onClose && self.onClose();
			if (self.lockScroll) {
				setTimeout(function() {
					if (self.modal && self.bodyOverflow !== 'hidden') {
						document.body.style.overflow = self.bodyOverflow;
						document.body.style.paddingRight = self.bodyPaddingRight;
					}
					self.bodyOverflow = null;
					self.bodyPaddingRight = null;
				}, 200);
			}
			self.opened = false;
			if (!self.transition) {
				self.doAfterClose();
			}
		},
		doAfterClose: function() {
			PopupManager.closeModal(this._popupId);
			this._closing = false;
		}
	};
	return function() {
		return {
			VuePopup: VuePopup,
			PopupManager: PopupManager
		};
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'Popper', 'VuePopup'], definition);
	} else {
		context[name] = definition(context['Vue'], context['Popper'], context['VuePopup']);
	}
})('VuePopper', this, function(Vue, Popper, VuePopup) {
	'use strict';
	var PopperJS = Vue.prototype.$isServer ? function() {} : Popper;
	var stop = function(e) {
		e.stopPropagation()
	};
	var VuePopper = {
		props: {
			placement: {
				type: String,
				default: 'bottom'
			},
			boundariesPadding: {
				type: Number,
				default: 5
			},
			reference: {},
			popper: {},
			offset: {
				default: 0
			},
			value: Boolean,
			visibleArrow: Boolean,
			transition: String,
			appendToBody: {
				type: Boolean,
				default: true
			},
			options: {
				type: Object,
				default: function() {
					return {
						gpuAcceleration: false
					};
				}
			}
		},
		data: function() {
			return {
				showPopper: false,
				currentPlacement: ''
			};
		},
		watch: {
			value: {
				immediate: true,
				handler: function(val) {
					this.showPopper = val;
					this.$emit('input', val);
				}
			},
			showPopper: function(val) {
				val ? this.updatePopper() : this.destroyPopper();
				this.$emit('input', val);
			}
		},
		methods: {
			createPopper: function() {
				var self = this;
				if (self.$isServer)
					return;
				self.currentPlacement = self.currentPlacement || self.placement;
				if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(self.currentPlacement)) {
					return;
				}
				var options = self.options || {};
				var popper = self.popperElm = self.popperElm || self.popper || self.$refs.popper;
				var reference = self.referenceElm = self.referenceElm || self.reference || self.$refs.reference;
				if (!reference && self.$slots.reference && self.$slots.reference[0]) {
					reference = self.referenceElm = self.$slots.reference[0].elm;
				}
				if (!popper || !reference)
					return;
				if (self.visibleArrow)
					self.appendArrow(popper);
				if (self.appendToBody)
					document.body.appendChild(self.popperElm);
				if (self.popperJS && self.popperJS.destroy) {
					self.popperJS.destroy();
				}
				options.placement = self.currentPlacement;
				options.offset = self.offset;
				self.popperJS = new PopperJS(reference,popper,options);
				self.popperJS.onCreate(function() {
					self.$emit('created', self);
					self.resetTransformOrigin();
					self.$nextTick(self.updatePopper);
				});
				if (typeof options.onUpdate === 'function') {
					self.popperJS.onUpdate(options.onUpdate);
				}
				self.popperJS._popper.style.zIndex = VuePopup().PopupManager.nextZIndex();
				self.popperElm.addEventListener('click', stop);
			},
			updatePopper: function() {
				this.popperJS ? this.popperJS.update() : this.createPopper();
			},
			doDestroy: function() {
				if (this.showPopper || !this.popperJS)
					return;
				this.popperJS.destroy();
				this.popperJS = null;
			},
			destroyPopper: function() {
				if (this.popperJS) {
					this.resetTransformOrigin();
				}
			},
			resetTransformOrigin: function() {
				var placementMap = {
					top: 'bottom',
					bottom: 'top',
					left: 'right',
					right: 'left'
				};
				var placement = this.popperJS._popper.getAttribute('x-placement').split('-')[0];
				var origin = placementMap[placement];
				this.popperJS._popper.style.transformOrigin = ['top', 'bottom'].indexOf(placement) > -1 ? 'center ' + origin : origin + ' center';
			},
			appendArrow: function(element) {
				var hash;
				if (this.appended) {
					return;
				}
				this.appended = true;
				for (var item in element.attributes) {
					if (/^_v-/.test(element.attributes[item].name)) {
						hash = element.attributes[item].name;
						break;
					}
				}
				var arrow = document.createElement('div');
				if (hash) {
					arrow.setAttribute(hash, '');
				}
				arrow.setAttribute('x-arrow', '');
				arrow.className = 'popper__arrow';
				element.appendChild(arrow);
			}
		},
		beforeDestroy: function() {
			this.doDestroy();
			if (this.popperElm && this.popperElm.parentNode === document.body) {
				this.popperElm.removeEventListener('click', stop);
				document.body.removeChild(this.popperElm);
			}
		},
		deactivated: function() {
			this.$options.beforeDestroy[0].call(this);
		}
	};
	return function() {
		return VuePopper;
	}
});
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
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueRow', this, function(Vue) {
	'use strict';
	var VueRow = {
		template: '<div class="vue-row" :style="style" :class="[ justify !== \'start\' ? \'is-justify-\' + justify : \'\', align !== \'top\' ? \'is-align-\' + align : \'\', { \'vue-row--flex\': type === \'flex\' } ]" ><slot></slot></div>',
		name: 'VueRow',
		props: {
			gutter: Number,
			type: String,
			justify: {
				type: String,
				default: 'start'
			},
			align: {
				type: String,
				default: 'top'
			}
		},
		computed: {
			style: function() {
				var ret = {};
				if (this.gutter) {
					ret.marginLeft = this.gutter / 2 + 'px';
					ret.marginRight = ret.marginLeft;
				}
				return ret;
			}
		}
	};
	Vue.component(VueRow.name, VueRow);
});
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
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueForm', this, function(Vue) {
	'use strict';
	var VueForm = {
		template: '<form class="vue-form" :class="[ labelPosition ? \'vue-form--label-\' + labelPosition : \'\', { \'vue-form--inline\': inline } ]"><slot></slot></form>',
		name: 'VueForm',
		componentName: 'VueForm',
		props: {
			model: Object,
			rules: Object,
			labelPosition: String,
			labelWidth: String,
			labelSuffix: {
				type: String,
				default: ''
			},
			inline: Boolean,
			showMessage: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			rules: function() {
				this.validate();
			}
		},
		data: function() {
			return {
				fields: []
			};
		},
		created: function() {
			this.$on('vue.form.addField', function(field) {
				if (field) {
					this.fields.push(field);
				}
			});
			this.$on('vue.form.removeField', function(field) {
				if (field.prop) {
					this.fields.splice(this.fields.indexOf(field), 1);
				}
			});
		},
		methods: {
			resetFields: function() {
				this.fields.forEach(function(field) {
					field.resetField();
				});
			},
			validate: function(callback) {
				var self = this;
				var valid = true;
				var count = 0;
				this.fields.forEach(function(field, index) {
					field.validate('', function(errors) {
						if (errors) {
							valid = false;
						}
						if (typeof callback === 'function' && ++count === self.fields.length) {
							callback(valid);
						}
					});
				});
			},
			validateField: function(prop, cb) {
				var field = this.fields.filter(function(field) {
					return ( field.prop === prop)
				})[0];
				if (!field) {
					throw new Error('must call validateField with valid prop string!');
				}
				field.validate('', cb);
			}
		}
	};
	Vue.component(VueForm.name, VueForm);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VueValidator'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VueValidator']);
		delete context[name];
	}
})('VueFormItem', this, function(Vue, VueUtil, VueValidator) {
	'use strict';
	var noop = function() {}
	var getPropByPath = function(obj, path) {
		var tempObj = obj;
		path = path.replace(/\[(\w+)\]/g, '.$1');
		path = path.replace(/^\./, '');
		var keyArr = path.split('.');
		var i = 0;
		for (var len = keyArr.length; i < len - 1; ++i) {
			var key = keyArr[i];
			if (key in tempObj) {
				tempObj = tempObj[key];
			} else {
				throw new Error('please transfer a valid prop path to form item!');
			}
		}
		return {
			o: tempObj,
			k: keyArr[i],
			v: tempObj[keyArr[i]]
		};
	}
	var VueFormItem = {
		template: '<div class="vue-form-item" :class="{\'is-error\': validateState === \'error\',\'is-validating\': validateState === \'validating\',\'is-required\': isRequired || required}"><label :for="prop" class="vue-form-item__label" v-bind:style="labelStyle" v-if="label">{{label + form.labelSuffix}}</label><div class="vue-form-item__content" v-bind:style="contentStyle"><slot></slot><transition name="vue-zoom-in-top"><div class="vue-form-item__error" v-if="validateState === \'error\' && showMessage && form.showMessage">{{validateMessage}}</div></transition></div></div>',
		name: 'VueFormItem',
		componentName: 'VueFormItem',
		mixins: [VueUtil.component.emitter],
		props: {
			label: String,
			labelWidth: String,
			prop: String,
			required: Boolean,
			rules: [Object, Array],
			error: String,
			validateStatus: String,
			showMessage: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			error: function(value) {
				this.validateMessage = value;
				this.validateState = 'error';
			},
			validateStatus: function(value) {
				this.validateState = value;
			}
		},
		computed: {
			labelStyle: function() {
				var ret = {};
				if (this.form.labelPosition === 'top')
					return ret;
				var labelWidth = this.labelWidth || this.form.labelWidth;
				if (labelWidth) {
					ret.width = labelWidth;
				}
				return ret;
			},
			contentStyle: function() {
				var ret = {};
				if (this.form.labelPosition === 'top')
					return ret;
				var labelWidth = this.labelWidth || this.form.labelWidth;
				if (labelWidth) {
					ret.marginLeft = labelWidth;
				}
				return ret;
			},
			form: function() {
				var parent = this.$parent;
				while (parent.$options.componentName !== 'VueForm') {
					parent = parent.$parent;
				}
				return parent;
			},
			fieldValue: {
				cache: false,
				get: function() {
					var model = this.form.model;
					if (!model || !this.prop) {
						return;
					}
					var path = this.prop;
					if (path.indexOf(':') !== -1) {
						path = path.replace(/:/, '.');
					}
					return getPropByPath(model, path).v;
				}
			}
		},
		data: function() {
			return {
				validateState: '',
				validateMessage: '',
				validateDisabled: false,
				validator: {},
				isRequired: false
			};
		},
		methods: {
			validate: function(trigger, callback) {
				var self = this;
				callback = callback || noop;
				var rules = self.getFilteredRule(trigger);
				if (!rules || rules.length === 0) {
					callback();
					return true;
				}
				self.validateState = 'validating';
				var descriptor = {};
				descriptor[self.prop] = rules;
				var validator = new VueValidator(descriptor);
				var model = {};
				model[self.prop] = self.fieldValue;
				validator.validate(model, {
					firstFields: true
				}, function(errors, fields) {
					self.validateState = !errors ? 'success' : 'error';
					self.validateMessage = errors ? errors[0].message : '';
					callback(self.validateMessage);
				});
			},
			resetField: function() {
				this.validateState = '';
				this.validateMessage = '';
				var model = this.form.model;
				var value = this.fieldValue;
				var path = this.prop;
				if (path.indexOf(':') !== -1) {
					path = path.replace(/:/, '.');
				}
				var prop = getPropByPath(model, path);
				if (Array.isArray(value) && value.length > 0) {
					this.validateDisabled = true;
					prop.o[prop.k] = [];
				} else if (value) {
					this.validateDisabled = true;
					prop.o[prop.k] = this.initialValue;
				}
			},
			getRules: function() {
				var formRules = this.form.rules;
				var selfRuels = this.rules;
				formRules = formRules ? formRules[this.prop] : [];
				return [].concat(selfRuels || formRules || []);
			},
			getFilteredRule: function(trigger) {
				var rules = this.getRules();
				return rules.filter(function(rule) {
					return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
				});
			},
			onFieldBlur: function() {
				this.validate('blur');
			},
			onFieldChange: function() {
				if (this.validateDisabled) {
					this.validateDisabled = false;
					return;
				}
				this.validate('change');
			}
		},
		mounted: function() {
			var self = this;
			if (self.prop) {
				self.dispatch('VueForm', 'vue.form.addField', [self]);
				Object.defineProperty(self, 'initialValue', {
					value: self.fieldValue
				});
				var rules = self.getRules();
				if (rules.length) {
					rules.every(function(rule) {
						if (rule.required) {
							self.isRequired = true;
							return false;
						}
					});
					self.$on('vue.form.blur', self.onFieldBlur);
					self.$on('vue.form.change', self.onFieldChange);
				}
			}
		},
		beforeDestroy: function() {
			this.dispatch('VueForm', 'vue.form.removeField', [this]);
		}
	};
	Vue.component(VueFormItem.name, VueFormItem);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'Cleave'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['Cleave']);
	}
})('VueInput', this, function(Vue, VueUtil, Cleave) {
	'use strict';
	var calculateNodeStylingFn = function(node) {
		var CONTEXT_STYLE = ['letter-spacing', 'line-height', 'padding-top', 'padding-bottom', 'font-family', 'font-weight', 'font-size', 'text-rendering', 'text-transform', 'width', 'text-indent', 'padding-left', 'padding-right', 'border-width', 'box-sizing'];
		var style = window.getComputedStyle(node);
		var boxSizing = style.getPropertyValue('box-sizing');
		var paddingSize = (parseFloat(style.getPropertyValue('padding-bottom')) + parseFloat(style.getPropertyValue('padding-top')));
		var borderSize = (parseFloat(style.getPropertyValue('border-bottom-width')) + parseFloat(style.getPropertyValue('border-top-width')));
		var contextStyle = CONTEXT_STYLE.map(function(name) {
			return name + ':' + style.getPropertyValue(name)
		}).join(';');
		var calculateNodeStylingObj = {};
		calculateNodeStylingObj.contextStyle = contextStyle;
		calculateNodeStylingObj.paddingSize = paddingSize;
		calculateNodeStylingObj.borderSize = borderSize;
		calculateNodeStylingObj.boxSizing = boxSizing;
		return calculateNodeStylingObj;
	};
	var calcTextareaHeight = function(targetNode, minRows, maxRows, options) {
		var HIDDEN_STYLE = '\n height:0 !important;\n visibility:hidden !important;\n overflow:hidden !important;\n position:absolute !important;\n z-index:-1000 !important;\n top:0 !important;\n right:0 !important\n';
		var hiddenTextarea = document.createElement('textarea');
		document.body.appendChild(hiddenTextarea);
		var calculateNodeStyling = calculateNodeStylingFn(targetNode);
		hiddenTextarea.setAttribute('style', calculateNodeStyling.contextStyle + ';' + HIDDEN_STYLE);
		hiddenTextarea.value = targetNode.value || targetNode.placeholder || '';
		var height = hiddenTextarea.scrollHeight;
		if (calculateNodeStyling.boxSizing === 'border-box') {
			height = height + calculateNodeStyling.borderSize;
		} else if (calculateNodeStyling.boxSizing === 'content-box') {
			height = height - calculateNodeStyling.paddingSize;
		}
		hiddenTextarea.value = '';
		var singleRowHeight = hiddenTextarea.scrollHeight - calculateNodeStyling.paddingSize;
		if (minRows !== null) {
			var minHeight = singleRowHeight * minRows;
			if (calculateNodeStyling.boxSizing === 'border-box') {
				minHeight = minHeight + calculateNodeStyling.paddingSize + calculateNodeStyling.borderSize;
			}
			height = Math.max(minHeight, height);
		}
		if (maxRows !== null) {
			var maxHeight = singleRowHeight * maxRows;
			if (calculateNodeStyling.boxSizing === 'border-box') {
				maxHeight = maxHeight + calculateNodeStyling.paddingSize + calculateNodeStyling.borderSize;
			}
			height = Math.min(maxHeight, height);
		}
		document.body.removeChild(hiddenTextarea);
		return VueUtil.merge({height: height + 'px'}, options);
	};
	var VueInput = {
		template: '<div :class="[ type === \'textarea\' ? \'vue-textarea\' : \'vue-input\', size ? \'vue-input--\' + size : \'\', { \'is-disabled\': disabled, \'vue-input-group\': $slots.prepend || $slots.append, \'vue-input-group--append\': $slots.append, \'vue-input-group--prepend\': $slots.prepend, \'is-readonly\': readonly } ]"><template v-if="type !== \'textarea\'"><div class="vue-input-group__prepend" v-if="$slots.prepend"><slot name="prepend"></slot></div><slot name="icon"><i class="vue-input__icon" :class="[ icon, onIconClick ? \'is-clickable\' : \'\' ]" v-if="icon" @click="handleIconClick"></i></slot><input v-if="type !== \'textarea\'" class="vue-input__inner" :type="type" :name="name" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :maxlength="maxlength" :minlength="minlength" :autocomplete="autoComplete" :autofocus="autofocus" :min="min" :max="max" :form="form" :value="currentValue" ref="input" @input="handleInput" @focus="handleFocus" @blur="handleBlur" ><i class="vue-input__icon vue-icon-loading" v-if="validating"></i><div class="vue-input-group__append" v-if="$slots.append"><slot name="append"></slot></div></template><textarea v-else class="vue-textarea__inner" :value="currentValue" @input="handleInput" ref="textarea" :name="name" :placeholder="placeholder" :disabled="disabled" :style="textareaStyle" :readonly="readonly" :rows="rows" :form="form" :autofocus="autofocus" :maxlength="maxlength" :minlength="minlength" @focus="handleFocus" @blur="handleBlur"></textarea></div>',
		name: 'VueInput',
		componentName: 'VueInput',
		mixins: [VueUtil.component.emitter],
		data: function() {
			return {
				currentValue: this.value,
				textareaStyle: {}
			};
		},
		props: {
			value: [String, Number],
			placeholder: String,
			size: String,
			resize: String,
			readonly: Boolean,
			autofocus: Boolean,
			icon: String,
			disabled: Boolean,
			type: {
				type: String,
				default: 'text'
			},
			name: String,
			autosize: {
				type: [Boolean, Object],
				default: false
			},
			rows: {
				type: Number,
				default: 2
			},
			autoComplete: {
				type: String,
				default: 'off'
			},
			form: String,
			maxlength: Number,
			minlength: Number,
			max: {},
			min: {},
			cleave: {
				type: Object,
				default: function(){return null}
			},
			validateEvent: {
				type: Boolean,
				default: true
			},
			onIconClick: Function
		},
		computed: {
			validating: function() {
				return this.$parent.validateState === 'validating';
			}
		},
		watch: {
			'value': function(val, oldValue) {
				this.setCurrentValue(val, true);
			}
		},
		methods: {
			handleBlur: function(event) {
				this.$emit('blur', event);
				if (this.validateEvent) {
					this.dispatch('VueFormItem', 'vue.form.blur', [this.currentValue]);
				}
			},
			inputSelect: function() {
				this.$refs.input.select();
			},
			resizeTextarea: function() {
				if (this.$isServer)
					return;
				if (!this.autosize || this.type !== 'textarea')
					return;
				var minRows = this.autosize.minRows;
				var maxRows = this.autosize.maxRows;
				var options = {
					resize: this.resize
				};
				this.textareaStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows, options);
			},
			handleFocus: function(event) {
				this.$emit('focus', event);
			},
			handleInput: function(event) {
				this.setCurrentValue(event.target.value);
			},
			handleIconClick: function(event) {
				if (this.onIconClick) {
					this.onIconClick(event);
				}
				this.$emit('click', event);
			},
			setCurrentValue: function(value, watchFlg) {
				if (typeof value === "undefined") value = "";
				var self = this;
				if (value === self.currentValue && !watchFlg)
					return;
				self.$nextTick(function() {
					self.resizeTextarea();
				});
				if (self.type !== 'textarea' && self.cleave !== null) {
					self.$el.querySelector('input').value = value;
					var cleaveObj = new Cleave(self.$el.querySelector('input'), self.cleave);
					self.currentValue = cleaveObj.getFormattedValue();
					if (cleaveObj.getFormattedValue().length >= value.length && !watchFlg) {
						self.currentValue = value;
					}
					value = cleaveObj.getRawValue()
					cleaveObj.destroy && cleaveObj.destroy();
				} else {
					self.currentValue = value;
				}
				self.$emit('input', value);
				self.$emit('change', value);
				if (self.validateEvent) {
					self.dispatch('VueFormItem', 'vue.form.change', [value]);
				}
			}
		},
		created: function() {
			this.$on('inputSelect', this.inputSelect);
		},
		mounted: function() {
			this.setCurrentValue(this.currentValue, true);
			this.resizeTextarea();
		}
	};
	Vue.component(VueInput.name, VueInput);
	return function() {
		return VueInput;
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueAlert', this, function(Vue) {
	'use strict';
	var TYPE_CLASSES_MAP = {
		'success': 'vue-icon-circle-check',
		'warning': 'vue-icon-warning',
		'error': 'vue-icon-circle-cross'
	};
	var VueAlert = {
		template: '<transition name="vue-alert-fade"><div class="vue-alert" :class="[ typeClass ]" v-show="visible"><i class="vue-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i><div class="vue-alert__content"><span class="vue-alert__title" :class="[ isBoldTitle ]" v-if="title">{{ title }}</span><slot><p class="vue-alert__description" v-if="description">{{ description }}</p></slot><i class="vue-alert__closebtn" :class="{ \'is-customed\': closeText !== \'\', \'vue-icon-close\': closeText === \'\' }" v-show="closable" @click="close()">{{closeText}}</i></div></div></transition>',
		name: 'VueAlert',
		props: {
			title: {
				type: String,
				default: ''
			},
			description: {
				type: String,
				default: ''
			},
			type: {
				type: String,
				default: 'info'
			},
			closable: {
				type: Boolean,
				default: true
			},
			closeText: {
				type: String,
				default: ''
			},
			showIcon: {
				type: Boolean,
				default: false
			},
			dark: {
				type: Boolean,
				default: false
			}
		},
		data: function() {
			return {
				visible: true
			};
		},
		methods: {
			close: function() {
				this.visible = false;
				this.$emit('close');
			}
		},
		computed: {
			typeClass: function() {
				if (this.dark) {
					return 'vue-alert--' + this.type + '-dark';
				}
				return 'vue-alert--' + this.type;
			},
			iconClass: function() {
				return TYPE_CLASSES_MAP[this.type] || 'vue-icon-information';
			},
			isBigIcon: function() {
				return this.description ? 'is-big' : '';
			},
			isBoldTitle: function() {
				return this.description ? 'is-bold' : '';
			}
		}
	};
	Vue.component(VueAlert.name, VueAlert);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePopup'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePopup']);
		delete context[name];
	}
})('VueAside', this, function(Vue, VuePopup) {
	'use strict';
	var VueAside = {
		template: '<div :class="[{\'vue-aside__initial\':relative}]"><div v-show="visible" class="vue-aside__wrapper" :class="[{\'vue-aside__absolute\':relative}]" @click.self="handleWrapperClick"></div><transition :name="left ? \'vue-aside-left\' : \'vue-aside-right\'"><div v-show="visible" class="vue-aside" :class="[{\'vue-aside-left\':left, \'vue-aside__absolute\':relative},sizeClass,setClass]" ref="dialog" :style="setStyle"><div v-if="showClose" class="vue-aside__headerbtn"><i class="vue-aside__close vue-icon vue-icon-close" @click=\'handleClose\'></i></div><div class="vue-aside__header"><span class="vue-aside__title" v-if="showTitle && !$slots.header">{{title}}</span><slot name="header"></slot></div><div class="vue-aside__body"><slot></slot></div><div class="vue-aside__footer" v-if="$slots.footer"><slot name="footer"></slot></div></div></transition></div>',
		name: 'VueAside',
		mixins: [VuePopup().VuePopup],
		props: {
			title: {
				type: String,
				default: ''
			},
			lockScroll: {
				type: Boolean,
				default: true
			},
			closeOnClickModal: {
				type: Boolean,
				default: false
			},
			closeOnPressEscape: {
				type: Boolean,
				default: true
			},
			showClose: {
				type: Boolean,
				default: false
			},
			size: {
				type: String,
				default: 'small'
			},
			left: {
				type: Boolean,
				default: false
			},
			relative: {
				type: Boolean,
				default: false
			},
			asideClass: {
				type: String,
				default: ""
			},
			asideStyle: {
				type: String,
				default: ""
			}
		},
		watch: {
			visible: function(val) {
				if (val) {
					this.$emit('open');
					this.$el.addEventListener('scroll', this.updatePopper);
					this.$el.firstElementChild.addEventListener('touchmove', function(event) {
						event.preventDefault();
						event.stopPropagation();
					});
					var refsDialog = this.$refs.dialog;
					this.$nextTick(function() {
						refsDialog.scrollTop = 0;
					});
				} else {
					this.$el.removeEventListener('scroll', this.updatePopper);
					this.$el.firstElementChild.removeEventListener('touchmove', function(event) {
						event.preventDefault();
						event.stopPropagation();
					});
					this.$emit('close');
				}
			}
		},
		computed: {
			showTitle: function() {
				if (this.title.replace(/^\s+|\s+$/g, "") === "") {
					return false;
				}
				return true;
			},
			sizeClass: function() {
				return 'vue-aside--' + this.size;
			},
			setClass: function() {
				return this.asideClass;
			},
			setStyle: function() {
				return this.asideStyle;
			}
		},
		methods: {
			handleWrapperClick: function() {
				if (!this.closeOnClickModal) return;
				this.handleClose();
			},
			handleClose: function() {
				if (typeof this.beforeClose === 'function') {
					this.beforeClose();
				}
				this.$emit('visible-change', false);
			}
		}
	};
	Vue.component(VueAside.name, VueAside);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VuePopper', 'VueInput'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VuePopper'], context['VueInput']);
		delete context[name];
	}
})('VueAutocomplete', this, function(Vue, VueUtil, VuePopper, VueInput) {
	'use strict';
	var VueAutocompleteSuggestions = {
		template: '<div><transition name="vue-zoom-in-top" @after-leave="doDestroy"><div v-show="showPopper" class="vue-autocomplete-suggestion" :class="{ \'is-loading\': parent.loading }" :style="{ width: dropdownWidth }"><ul class="vue-autocomplete-suggestion__wrap"><li v-if="parent.loading"><i class="vue-icon-loading"></i></li><template v-for="(item, index) in suggestions" v-else><li v-if="!parent.customItem" :class="{\'highlighted\': parent.highlightedIndex === index}" @click="select(item)">{{item.value}}</li><component v-else :class="{\'highlighted\': parent.highlightedIndex === index}" @click="select(item)" :is="parent.customItem" :item="item" :index="index"></component></template></ul></div></transition></div>',
		mixins: [VuePopper(), VueUtil.component.emitter],
		componentName: 'VueAutocompleteSuggestions',
		data: function() {
			return {
				parent: this.$parent,
				dropdownWidth: ''
			};
		},
		props: {
			suggestions: Array,
			options: {
				default: function() {
					return {
						forceAbsolute: true,
						gpuAcceleration: false
					};
				}
			}
		},
		methods: {
			select: function(item) {
				this.dispatch('VueAutocomplete', 'item-click', item);
			}
		},
		mounted: function() {
			this.popperElm = this.$el;
			this.referenceElm = this.$parent.$refs.input.$refs.input;
		},
		created: function() {
			var self = this;
			self.$on('visible', function(val, inputWidth) {
				self.dropdownWidth = inputWidth + 'px';
				self.showPopper = val;
			});
		}
	};
	var VueAutocomplete = {
		template: '<div class="vue-autocomplete" v-clickoutside="handleClickoutside"><vue-input ref="input" :value="value" :disabled="disabled" :placeholder="placeholder" :name="name" :size="size" :icon="icon" :on-icon-click="onIconClick" @compositionstart.native="handleComposition" @compositionupdate.native="handleComposition" @compositionend.native="handleComposition" @change="handleChange" @focus="handleFocus" @blur="handleBlur" @keydown.up.native.prevent="highlight(highlightedIndex - 1)" @keydown.down.native.prevent="highlight(highlightedIndex + 1)" @keydown.enter.stop.native="handleKeyEnter"><template slot="prepend" v-if="$slots.prepend"><slot name="prepend"></slot></template><template slot="append" v-if="$slots.append"><slot name="append"></slot></template></vue-input><vue-autocomplete-suggestions :class="[popperClass ? popperClass : \'\']" ref="suggestions" :suggestions="suggestions"></vue-autocomplete-suggestions></div>',
		name: 'VueAutocomplete',
		mixins: [VueUtil.component.emitter],
		componentName: 'VueAutocomplete',
		components: {
			VueInput: VueInput(),
			VueAutocompleteSuggestions: VueAutocompleteSuggestions
		},
		directives: {
			Clickoutside: VueUtil.component.clickoutside()
		},
		props: {
			popperClass: String,
			placeholder: String,
			disabled: Boolean,
			name: String,
			size: String,
			value: String,
			autofocus: Boolean,
			fetchSuggestions: Function,
			triggerOnFocus: {
				type: Boolean,
				default: true
			},
			customItem: String,
			icon: String,
			onIconClick: Function
		},
		data: function() {
			return {
				isFocus: false,
				isOnComposition: false,
				suggestions: [],
				loading: false,
				highlightedIndex: -1
			};
		},
		computed: {
			suggestionVisible: function() {
				var suggestions = this.suggestions;
				var isValidData = Array.isArray(suggestions) && suggestions.length > 0;
				return (isValidData || this.loading) && this.isFocus;
			}
		},
		watch: {
			suggestionVisible: function(val) {
				this.broadcast('VueAutocompleteSuggestions', 'visible', [val, this.$refs.input.$refs.input.offsetWidth]);
			}
		},
		methods: {
			getData: function(queryString) {
				var self = this;
				self.loading = true;
				self.fetchSuggestions(queryString, function(suggestions) {
					self.loading = false;
					if (Array.isArray(suggestions)) {
						self.suggestions = suggestions;
					} else {
						console.error('autocomplete suggestions must be an array');
					}
				});
			},
			handleComposition: function(event) {
				if (event.type === 'compositionend') {
					this.isOnComposition = false;
					this.handleChange(event.data);
				} else {
					this.isOnComposition = true;
				}
			},
			handleChange: function(value) {
				this.$emit('input', value);
				if (this.isOnComposition || (!this.triggerOnFocus && !value)) {
					this.suggestions = [];
					return;
				}
				this.getData(value);
			},
			handleFocus: function() {
				this.isFocus = true;
				if (this.triggerOnFocus) {
					this.getData(this.value);
				}
			},
			handleBlur: function() {
				var self = this;
				setTimeout(function() {
					self.isFocus = false;
				}, 100);
			},
			handleKeyEnter: function() {
				if (this.suggestionVisible) {
					this.select(this.suggestions[this.highlightedIndex]);
				}
			},
			handleClickoutside: function() {
				this.isFocus = false;
			},
			select: function(item) {
				var self = this;
				self.$emit('input', item.value);
				self.$emit('select', item);
				self.$nextTick(function() {
					self.suggestions = [];
				});
			},
			highlight: function(index) {
				if (!this.suggestionVisible || this.loading) return;
				if (index < 0) index = 0;
				if (index >= this.suggestions.length) {
					index = this.suggestions.length - 1;
				}
				var suggestion = this.$refs.suggestions.$el.querySelector('.vue-autocomplete-suggestion__wrap');
				var suggestionList = suggestion.querySelectorAll('.vue-autocomplete-suggestion__list li');
				var highlightItem = suggestionList[index];
				var scrollTop = suggestion.scrollTop;
				var offsetTop = highlightItem.offsetTop;
				if (offsetTop + highlightItem.scrollHeight > (scrollTop + suggestion.clientHeight)) {
					suggestion.scrollTop += highlightItem.scrollHeight;
				}
				if (offsetTop < scrollTop) {
					suggestion.scrollTop -= highlightItem.scrollHeight;
				}
				this.highlightedIndex = index;
			}
		},
		mounted: function() {
			var self = this;
			self.$on('item-click', function(item) {
				self.select(item);
			});
		},
		beforeDestroy: function() {
			this.$refs.suggestions.$destroy();
		}
	};
	Vue.component(VueAutocomplete.name, VueAutocomplete);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
	}
})('VueButtonGroup', this, function(Vue) {
	'use strict';
	var VueButtonGroup = {
		template: '<div class="vue-button-group"><slot></slot></div>',
		name: 'VueButtonGroup'
	};
	Vue.component(VueButtonGroup.name, VueButtonGroup);
	return function() {
		return VueButtonGroup;
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
	}
})('VueButton', this, function(Vue) {
	'use strict';
	var VueButton = {
		template: '<button :disabled="disabled" class="vue-button" @click="handleClick" :autofocus="autofocus" :type="nativeType" :class="[type ? \'vue-button--\' + type : \'\', size ? \'vue-button--\' + size : \'\', { \'is-disabled\': disabled, \'is-loading\': loading, \'is-plain\': plain, \'is-circle\': circle } ]"><i class="vue-icon-loading" v-if="loading"></i><i :class="icon" v-if="icon && !loading"></i><span v-if="$slots.default"><slot></slot></span></button>',
		name: 'VueButton',
		props: {
			type: {
				type: String,
				default: 'default'
			},
			size: String,
			icon: {
				type: String,
				default: ''
			},
			nativeType: {
				type: String,
				default: 'button'
			},
			loading: Boolean,
			disabled: Boolean,
			plain: Boolean,
			circle: Boolean,
			autofocus: Boolean
		},
		methods: {
			handleClick: function(evt) {
				this.$emit('click', evt);
			}
		}
	};
	Vue.component(VueButton.name, VueButton);
	return function() {
		return VueButton;
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
	}
})('VueCheckboxGroup', this, function(Vue, VueUtil) {
	'use strict';
	var VueCheckboxGroup = {
		template: '<div class="vue-checkbox-group"><slot></slot></div>',
		name: 'VueCheckboxGroup',
		componentName: 'VueCheckboxGroup',
		mixins: [VueUtil.component.emitter],
		props: {
			value: {},
			min: Number,
			max: Number,
			size: String,
			fill: String,
			textColor: String,
			disabled: Boolean
		},
		watch: {
			value: function(value) {
				this.dispatch('VueFormItem', 'vue.form.change', [value]);
			}
		}
	};
	Vue.component(VueCheckboxGroup.name, VueCheckboxGroup);
	return function() {
		return VueCheckboxGroup;
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueCheckboxButton', this, function(Vue, VueUtil) {
	'use strict';
	var VueCheckboxButton = {
		template: '<label class="vue-checkbox-button" :class="[ size ? \'vue-checkbox-button--\' + size : \'\', { \'is-disabled\': isDisabled }, { \'is-checked\': isChecked }, { \'is-focus\': focus }, ]"><input v-if="trueLabel || falseLabel" class="vue-checkbox-button__original" type="checkbox" :name="name" :disabled="isDisabled" :true-value="trueLabel" :false-value="falseLabel" v-model="model" @change="handleChange" @focus="focus = true" @blur="focus = false"><input v-else class="vue-checkbox-button__original" type="checkbox" :name="name" :disabled="disabled" :value="label" v-model="model" @change="handleChange" @focus="focus = true" @blur="focus = false"><span class="vue-checkbox-button__inner"	v-if="$slots.default || label" :style="isChecked ? activeStyle : null"> <slot>{{label}}</slot></span></label>',
		name: 'VueCheckboxButton',
		mixins: [VueUtil.component.emitter],
		data: function() {
			return {
				selfModel: false,
				focus: false
			};
		},
		props: {
			value: {},
			label: {},
			disabled: Boolean,
			checked: Boolean,
			name: String,
			trueLabel: [String, Number],
			falseLabel: [String, Number]
		},
		computed: {
			model: {
				get: function() {
					return this._checkboxGroup ? this.store : this.value !== undefined ? this.value : this.selfModel;
				},
				set: function(val) {
					if (this._checkboxGroup) {
						var isLimitExceeded = false;
						(this._checkboxGroup.min !== undefined && val.length < this._checkboxGroup.min && (isLimitExceeded = true));
						(this._checkboxGroup.max !== undefined && val.length > this._checkboxGroup.max && (isLimitExceeded = true));
						isLimitExceeded === false && this.dispatch('VueCheckboxGroup', 'input', [val]);
					} else if (this.value !== undefined) {
						this.$emit('input', val);
					} else {
						this.selfModel = val;
					}
				}
			},
			isChecked: function() {
				if ({}.toString.call(this.model) === '[object Boolean]') {
					return this.model;
				} else if (Array.isArray(this.model)) {
					return this.model.indexOf(this.label) > -1;
				} else if (this.model !== null && this.model !== undefined) {
					return this.model === this.trueLabel;
				}
			},
			_checkboxGroup: function() {
				var parent = this.$parent;
				while (parent) {
					if (parent.$options.componentName !== 'VueCheckboxGroup') {
						parent = parent.$parent;
					} else {
						return parent;
					}
				}
				return false;
			},
			isDisabled: function() {
				return this.disabled || this._checkboxGroup.disabled;
			},
			store: function() {
				return this._checkboxGroup ? this._checkboxGroup.value : this.value;
			},
			activeStyle: function() {
				return {
					backgroundColor: this._checkboxGroup.fill || '',
					borderColor: this._checkboxGroup.fill || '',
					color: this._checkboxGroup.textColor || '',
					'box-shadow': '-1px 0 0 0 ' + this._checkboxGroup.fill
				};
			},
			size: function() {
				return this._checkboxGroup.size;
			}
		},
		methods: {
			addToStore: function() {
				if (
					Array.isArray(this.model) &&
					this.model.indexOf(this.label) === -1
				) {
					this.model.push(this.label);
				} else {
					this.model = this.trueLabel || true;
				}
			},
			handleChange: function(ev) {
				var self = this;
				self.$emit('change', ev);
				if (self._checkboxGroup) {
					self.$nextTick(function() {
						self.dispatch('VueCheckboxGroup', 'change', [self._checkboxGroup.value]);
					});
				}
			}
		},
		created: function() {
			this.checked && this.addToStore();
		}
	};
	Vue.component(VueCheckboxButton.name, VueCheckboxButton);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
	}
})('VueCheckbox', this, function(Vue, VueUtil) {
	'use strict';
	var VueCheckbox = {
		template: '<label class="vue-checkbox"><span class="vue-checkbox__input" :class="{ \'is-disabled\': disabled, \'is-checked\': isChecked, \'is-indeterminate\': indeterminate, \'is-focus\': focus }" ><span class="vue-checkbox__inner"></span><input v-if="trueLabel || falseLabel" class="vue-checkbox__original" type="checkbox" :name="name" :disabled="disabled" :true-value="trueLabel" :false-value="falseLabel" v-model="model" @change="handleChange" @focus="focus = true" @blur="focus = false"><input v-else class="vue-checkbox__original" type="checkbox" :disabled="disabled" :value="label" :name="name" v-model="model" @change="handleChange" @focus="focus = true" @blur="focus = false"></span><span class="vue-checkbox__label" v-if="$slots.default || label"><slot></slot><template v-if="!$slots.default">{{label}}</template></span></label>',
		name: 'VueCheckbox',
		mixins: [VueUtil.component.emitter],
		componentName: 'VueCheckbox',
		data: function() {
			return {
				selfModel: false,
				focus: false
			};
		},
		computed: {
			model: {
				get: function() {
					return this.isGroup ? this.store : this.value !== undefined ? this.value : this.selfModel;
				},
				set: function(val) {
					if (this.isGroup) {
						var isLimitExceeded = false;
						(this._checkboxGroup.min !== undefined && val.length < this._checkboxGroup.min && (isLimitExceeded = true));
						(this._checkboxGroup.max !== undefined && val.length > this._checkboxGroup.max && (isLimitExceeded = true));
						isLimitExceeded === false && this.dispatch('VueCheckboxGroup', 'input', [val]);
					} else {
						this.$emit('input', val);
						this.selfModel = val;
					}
				}
			},
			isChecked: function() {
				if ({}.toString.call(this.model) === '[object Boolean]') {
					return this.model;
				} else if (Array.isArray(this.model)) {
					return this.model.indexOf(this.label) > -1;
				} else if (this.model !== null && this.model !== undefined) {
					return this.model === this.trueLabel;
				}
			},
			isGroup: function() {
				var parent = this.$parent;
				while (parent) {
					if (parent.$options.componentName !== 'VueCheckboxGroup') {
						parent = parent.$parent;
					} else {
						this._checkboxGroup = parent;
						return true;
					}
				}
				return false;
			},
			store: function() {
				return this._checkboxGroup ? this._checkboxGroup.value : this.value;
			}
		},
		props: {
			value: {},
			label: {},
			indeterminate: Boolean,
			disabled: Boolean,
			checked: Boolean,
			name: String,
			trueLabel: [String, Number],
			falseLabel: [String, Number]
		},
		methods: {
			addToStore: function() {
				if (Array.isArray(this.model) && this.model.indexOf(this.label) === -1) {
					this.model.push(this.label);
				} else {
					this.model = this.trueLabel || true;
				}
			},
			handleChange: function(ev) {
				var self = this;
				self.$emit('change', ev);
				if (self.isGroup) {
					self.$nextTick(function(ev) {
						self.dispatch('VueCheckboxGroup', 'change', [self._checkboxGroup.value]);
					});
				}
			}
		},
		created: function() {
			this.checked && this.addToStore();
		}
	};
	Vue.component(VueCheckbox.name, VueCheckbox);
	return function() {
		return VueCheckbox;
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePopup'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePopup']);
		delete context[name];
	}
})('VueDialog', this, function(Vue, VuePopup) {
	'use strict';
	var VueDialog = {
		template: '<transition name="dialog-fade"><div class="vue-dialog__wrapper" v-show="visible" @click.self="handleWrapperClick"><div class="vue-dialog" :class="[sizeClass, customClass]" ref="dialog" :style="style"><div class="vue-dialog__header"><span class="vue-dialog__title" v-if="showTitle && !$slots.header">{{title}}</span><slot name="header"></slot><div class="vue-dialog__headerbtn" v-if="showClose" ><i class="vue-dialog__close vue-icon vue-icon-close" @click=\'handleClose\'></i></div></div><div class="vue-dialog__body"><slot></slot></div><div class="vue-dialog__footer" v-if="$slots.footer"><slot name="footer"></slot></div></div></div></transition>',
		name: 'VueDialog',
		mixins: [VuePopup().VuePopup],
		props: {
			title: {
				type: String,
				default: ''
			},
			lockScroll: {
				type: Boolean,
				default: true
			},
			closeOnClickModal: {
				type: Boolean,
				default: false
			},
			closeOnPressEscape: {
				type: Boolean,
				default: true
			},
			showClose: {
				type: Boolean,
				default: false
			},
			size: {
				type: String,
				default: 'small'
			},
			customClass: {
				type: String,
				default: ''
			},
			top: {
				type: String,
				default: '15%'
			},
			beforeClose: Function
		},
		watch: {
			visible: function(val) {
				if (val) {
					this.$emit('open');
					this.$el.addEventListener('scroll', this.updatePopper);
					this.$el.firstElementChild.addEventListener('touchmove', function(event) {
						event.preventDefault();
						event.stopPropagation();
					});
					var refsDialog = this.$refs.dialog;
					this.$nextTick(function() {
						refsDialog.scrollTop = 0;
					});
				} else {
					this.$el.removeEventListener('scroll', this.updatePopper);
					this.$el.firstElementChild.removeEventListener('touchmove', function(event) {
						event.preventDefault();
						event.stopPropagation();
					});
					this.$emit('close');
				}
			}
		},
		computed: {
			showTitle: function() {
				if (this.title.replace(/^\s+|\s+$/g, "") === "") {
					return false;
				}
				return true;
			},
			sizeClass: function() {
				return 'vue-dialog--' + this.size;
			},
			style: function() {
				return this.size === 'full' ? {} : { 'top': this.top };
			}
		},
		methods: {
			handleWrapperClick: function() {
				if (!this.closeOnClickModal) return;
				this.handleClose();
			},
			handleClose: function() {
				if (typeof this.beforeClose === 'function') {
					this.beforeClose();
				}
				this.$emit('visible-change', false);
			}
		}
	};
	Vue.component(VueDialog.name, VueDialog);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueLoading', this, function(Vue, VueUtil) {
	'use strict';
	var VueLoading = Vue.extend({
		template: '<transition name="vue-loading-fade" @after-leave="handleAfterLeave"><div v-show="visible" class="vue-loading-mask" :class="[customClass, { \'is-fullscreen\': fullscreen }]"><div class="vue-loading-spinner"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none"/></svg><p v-if="text" class="vue-loading-text">{{ text }}</p></div></div></transition>',
		data: function() {
			return {
				text: null,
				fullscreen: true,
				visible: false,
				customClass: ''
			};
		},
		methods: {
			handleAfterLeave: function() {
				this.$emit('after-leave');
			}
		}
	});
	var directive = function(Vue) {
		if (Vue.prototype.$isServer) return;
		var insertDom = function(parent, el, binding) {
			if (!el.domVisible) {
				Object.keys(el.maskStyle).forEach(function(property) {
					el.mask.style[property] = el.maskStyle[property];
				});
				if (el.originalPosition !== 'absolute') {
					parent.style.position = 'relative';
				}
				if (binding.modifiers.fullscreen && binding.modifiers.lock) {
					parent.style.overflow = 'hidden';
				}
				el.domVisible = true;
				parent.appendChild(el.mask);
				Vue.nextTick(function() {
					el.instance.visible = true;
				});
				el.domInserted = true;
			}
		};
		var toggleLoading = function(el, binding) {
			if (binding.value) {
				Vue.nextTick(function() {
					if (binding.modifiers.fullscreen) {
						el.originalPosition = document.body.style.position;
						el.originalOverflow = document.body.style.overflow;
						VueUtil.addClass(el.mask, 'is-fullscreen');
						insertDom(document.body, el, binding);
					} else {
						VueUtil.removeClass(el.mask, 'is-fullscreen');
						if (binding.modifiers.body) {
							el.originalPosition = document.body.style.position;
							['top', 'left'].forEach(function(property) {
								var scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
								el.maskStyle[property] = el.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] + 'px';
							});
							['height', 'width'].forEach(function(property) {
								el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px';
							});
							insertDom(document.body, el, binding);
						} else {
							el.originalPosition = el.style.position;
							insertDom(el, el, binding);
						}
					}
				});
			} else {
				if (el.domVisible) {
					el.instance.$on('after-leave', function() {
						el.domVisible = false;
						if (binding.modifiers.fullscreen && el.originalOverflow !== 'hidden') {
							document.body.style.overflow = el.originalOverflow;
						}
						if (binding.modifiers.fullscreen || binding.modifiers.body) {
							document.body.style.position = el.originalPosition;
						} else {
							el.style.position = el.originalPosition;
						}
					});
					el.instance.visible = false;
				}
			}
		};
		Vue.directive('loading', {
			bind: function(el, binding) {
				var mask = new VueLoading({
					el: document.createElement('div'),
					data: {
						text: el.getAttribute('vue-loading-text'),
						fullscreen: !!binding.modifiers.fullscreen
					}
				});
				el.instance = mask;
				el.mask = mask.$el;
				el.maskStyle = {};
				toggleLoading(el, binding);
			},
			update: function(el, binding) {
				if (binding.oldValue !== binding.value) {
					toggleLoading(el, binding);
				}
			},
			unbind: function(el, binding) {
				if (el.domInserted) {
					if (binding.modifiers.fullscreen || binding.modifiers.body) {
						document.body.removeChild(el.mask);
					} else {
						el.mask && el.mask.parentNode && el.mask.parentNode.removeChild(el.mask);
					}
				}
			}
		});
	};
	var defaults = {
		text: null,
		fullscreen: true,
		body: false,
		lock: false,
		customClass: ''
	};
	var fullscreenLoading;
	VueLoading.prototype.originalPosition = '';
	VueLoading.prototype.originalOverflow = '';
	VueLoading.prototype.close = function() {
		if (this.fullscreen && this.originalOverflow !== 'hidden') {
			document.body.style.overflow = this.originalOverflow;
		}
		if (this.fullscreen || this.body) {
			document.body.style.position = this.originalPosition;
		} else {
			this.target.style.position = this.originalPosition;
		}
		if (this.fullscreen) {
			fullscreenLoading = undefined;
		}
		this.$on('after-leave', function() {
			this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el);
			this.$destroy();
		});
		this.visible = false;
	}
	var addStyle = function(options, parent, instance) {
		var maskStyle = {};
		if (options.fullscreen) {
			instance.originalPosition = document.body.style.position;
			instance.originalOverflow = document.body.style.overflow;
		} else if (options.body) {
			instance.originalPosition = document.body.style.position;
			['top', 'left'].forEach(function(property) {
				var scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
				maskStyle[property] = options.target.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] + 'px';
			});
			['height', 'width'].forEach(function(property) {
				maskStyle[property] = options.target.getBoundingClientRect()[property] + 'px';
			});
		} else {
			instance.originalPosition = parent.style.position;
		}
		Object.keys(maskStyle).forEach(function(property) {
			instance.$el.style[property] = maskStyle[property];
		});
	};
	var service = function() {
		var options = {};
		if (Vue.prototype.$isServer)
			return;
		options = VueUtil.merge({}, defaults, options);
		if (typeof options.target === 'string') {
			options.target = document.querySelector(options.target);
		}
		options.target = options.target || document.body;
		if (options.target !== document.body) {
			options.fullscreen = false;
		} else {
			options.body = true;
		}
		if (options.fullscreen && fullscreenLoading) {
			return fullscreenLoading;
		}
		var parent = options.body ? document.body : options.target;
		var instance = new VueLoading({
			el: document.createElement('div'),
			data: options
		});
		addStyle(options, parent, instance);
		if (instance.originalPosition !== 'absolute') {
			parent.style.position = 'relative';
		}
		if (options.fullscreen && options.lock) {
			parent.style.overflow = 'hidden';
		}
		parent.appendChild(instance.$el);
		Vue.nextTick(function() {
			instance.visible = true;
		});
		if (options.fullscreen) {
			fullscreenLoading = instance;
		}
		return instance;
	};
	Vue.use(directive);
	Vue.prototype.$loading = service;
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueMenuItemGroup', this, function(Vue) {
	'use strict';
	var VueMenuItemGroup = {
		template: '<li class="vue-menu-item-group"><div class="vue-menu-item-group__title" :style="{paddingLeft: levelPadding + \'px\'}" v-if="showTitle"><template v-if="!$slots.title">{{title}}</template><slot v-else name="title"></slot></div><ul><slot></slot></ul></li>',
		name: 'VueMenuItemGroup',
		componentName: 'VueMenuItemGroup',
		props: {
			title: {
				type: String,
				default: ''
			}
		},
		data: function() {
			return {
				paddingLeft: 20
			};
		},
		computed: {
			showTitle: function() {
				if (this.title.replace(/^\s+|\s+$/g, "") === "" && !this.$slots.title) {
					return false;
				}
				return true;
			},
			levelPadding: function() {
				var padding = 10;
				var parent = this.$parent;
				while (parent && parent.$options.componentName !== 'VueMenu') {
					if (parent.$options.componentName === 'VueSubmenu') {
						padding += 20;
					}
					parent = parent.$parent;
				}
				padding === 10 && (padding = 20);
				return padding;
			}
		}
	};
	Vue.component(VueMenuItemGroup.name, VueMenuItemGroup);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueMenuItem', this, function(Vue, VueUtil) {
	'use strict';
	var VueMenuItem = {
		template: '<li class="vue-menu-item" :style="paddingStyle" @click="handleClick" :class="{ \'is-active\': active, \'is-disabled\': disabled }"><slot></slot></li>',
		name: 'VueMenuItem',
		componentName: 'VueMenuItem',
		mixins: [VueUtil.component.menumixin, VueUtil.component.emitter],
		props: {
			index: {
				type: String,
				required: true
			},
			route: {
				type: Object,
				required: false
			},
			disabled: {
				type: Boolean,
				required: false
			}
		},
		computed: {
			active: function() {
				return this.index === this.rootMenu.activedIndex;
			}
		},
		methods: {
			handleClick: function() {
				this.dispatch('VueMenu', 'item-click', this);
			}
		},
		created: function() {
			this.parentMenu.addItem(this);
			this.rootMenu.addItem(this);
		},
		beforeDestroy: function() {
			this.parentMenu.removeItem(this);
			this.rootMenu.removeItem(this);
		}
	};
	Vue.component(VueMenuItem.name, VueMenuItem);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueMenu', this, function(Vue, VueUtil) {
	'use strict';
	var VueMenu = {
		template: '<ul class="vue-menu" :class="{ \'vue-menu--horizontal\': mode === \'horizontal\', \'vue-menu--dark\': theme === \'dark\' }" ><slot></slot></ul>',
		name: 'VueMenu',
		componentName: 'VueMenu',
		mixins: [VueUtil.component.emitter],
		props: {
			mode: {
				type: String,
				default: 'vertical'
			},
			defaultActive: {
				type: String,
				default: ''
			},
			defaultOpeneds: Array,
			theme: {
				type: String,
				default: 'light'
			},
			uniqueOpened: Boolean,
			router: Boolean,
			menuTrigger: {
				type: String,
				default: 'hover'
			}
		},
		data: function() {
			return {
				activedIndex: this.defaultActive,
				openedMenus: this.defaultOpeneds ? this.defaultOpeneds.slice(0) : [],
				items: {},
				submenus: {}
			};
		},
		watch: {
			defaultActive: function(value) {
				var item = this.items[value];
				if (!item)
					return;
				this.activedIndex = value;
				this.initOpenedMenu();
			},
			defaultOpeneds: function(value) {
				this.openedMenus = value;
			},
			'$route': {
				immediate: true,
				handler: function(value) {
					if (this.router) {
						var item = this.items[value.path];
						if (!item)
							return;
						this.activedIndex = value.path;
						this.initOpenedMenu();
					}
				}
			}
		},
		methods: {
			addItem: function(item) {
				this.$set(this.items, item.index, item);
			},
			removeItem: function(item) {
				delete this.items[item.index];
			},
			addSubmenu: function(item) {
				this.$set(this.submenus, item.index, item);
			},
			removeSubmenu: function(item) {
				delete this.submenus[item.index];
			},
			openMenu: function(index, indexPath) {
				var openedMenus = this.openedMenus;
				if (openedMenus.indexOf(index) !== -1)
					return;
				if (this.uniqueOpened) {
					this.openedMenus = openedMenus.filter(function(index) {
						return indexPath.indexOf(index) !== -1;
					});
				}
				this.openedMenus.push(index);
			},
			closeMenu: function(index, indexPath) {
				this.openedMenus.splice(this.openedMenus.indexOf(index), 1);
			},
			handleSubmenuClick: function(submenu) {
				var isOpened = this.openedMenus.indexOf(submenu.index) !== -1;
				if (isOpened) {
					this.closeMenu(submenu.index, submenu.indexPath);
					this.$emit('close', submenu.index, submenu.indexPath);
				} else {
					this.openMenu(submenu.index, submenu.indexPath);
					this.$emit('open', submenu.index, submenu.indexPath);
				}
			},
			handleItemClick: function(item) {
				this.$emit('select', item.index, item.indexPath, item);
				if (this.mode === 'horizontal') {
					this.openedMenus = [];
				}
				if (this.router) {
					this.routeToItem(item);
				} else {
					this.activedIndex = item.index;
				}
			},
			initOpenedMenu: function() {
				var self = this;
				var index = self.activedIndex;
				var activeItem = self.items[index];
				if (!activeItem || self.mode === 'horizontal')
					return;
				var indexPath = activeItem.indexPath;
				indexPath.forEach(function(index) {
					var submenu = self.submenus[index];
					submenu && self.openMenu(index, submenu.indexPath);
				});
			},
			routeToItem: function(item) {
				var route = item.route || item.index;
				try {
					this.$router.push(route);
				} catch (e) {
					console.error(e);
				}
			}
		},
		mounted: function() {
			this.initOpenedMenu();
			this.$on('item-click', this.handleItemClick);
			this.$on('submenu-click', this.handleSubmenuClick);
		}
	};
	Vue.component(VueMenu.name, VueMenu);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueRadioGroup', this, function(Vue, VueUtil) {
	'use strict';
	var VueRadioGroup = {
		template: '<div class="vue-radio-group"><slot></slot></div>',
		name: 'VueRadioGroup',
		componentName: 'VueRadioGroup',
		mixins: [VueUtil.component.emitter],
		props: {
			value: {},
			size: String,
			fill: String,
			textColor: String,
			disabled: Boolean
		},
		watch: {
			value: function(value) {
				this.$emit('change', value);
				this.dispatch('VueFormItem', 'vue.form.change', [this.value]);
			}
		}
	};
	Vue.component(VueRadioGroup.name, VueRadioGroup);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueRadioButton', this, function(Vue) {
	'use strict';
	var VueRadioButton = {
		template: '<label class="vue-radio-button" :class="[ size ? \'vue-radio-button--\' + size : \'\', { \'is-active\': value === label }, { \'is-disabled\': isDisabled } ]" ><input class="vue-radio-button__orig-radio" :value="label" type="radio" v-model="value" :name="name" :disabled="isDisabled"><span class="vue-radio-button__inner" :style="value === label ? activeStyle : null"><slot></slot><template v-if="!$slots.default">{{label}}</template></span></label>',
		name: 'VueRadioButton',
		props: {
			label: {},
			disabled: Boolean,
			name: String
		},
		computed: {
			value: {
				get: function() {
					return this._radioGroup.value;
				},
				set: function(value) {
					this._radioGroup.$emit('input', value);
				}
			},
			_radioGroup: function() {
				var parent = this.$parent;
				while (parent) {
					if (parent.$options.componentName !== 'VueRadioGroup') {
						parent = parent.$parent;
					} else {
						return parent;
					}
				}
				return false;
			},
			activeStyle: function() {
				return {
					backgroundColor: this._radioGroup.fill || '',
					borderColor: this._radioGroup.fill || '',
					boxShadow: this._radioGroup.fill ? '-1px 0 0 0 ' + this._radioGroup.fill : '',
					color: this._radioGroup.textColor || ''
				};
			},
			size: function() {
				return this._radioGroup.size;
			},
			isDisabled: function() {
				return this.disabled || this._radioGroup.disabled;
			}
		}
	};
	Vue.component(VueRadioButton.name, VueRadioButton);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePopper', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePopper'], context['VueUtil']);
	}
})('VueTooltip', this, function(Vue, VuePopper, VueUtil) {
	'use strict';
	var getFirstComponentChild = function(children) {
		return children && children.filter(function(c) {
			return c && c.tag;
		})[0];
	};
	var VueTooltip = {
		name: 'VueTooltip',
		mixins: [VuePopper()],
		props: {
			openDelay: {
				type: Number,
				default: 0
			},
			disabled: Boolean,
			manual: Boolean,
			effect: {
				type: String,
				default: 'dark'
			},
			popperClass: String,
			content: String,
			visibleArrow: {
				default: true
			},
			transition: {
				type: String,
				default: 'vue-fade-in-linear'
			},
			popperOptions: {
				default: function() {
					return {
						boundariesPadding: 10,
						gpuAcceleration: false
					};
				}
			},
			enterable: {
				type: Boolean,
				default: true
			}
		},
		beforeCreate: function() {
			var self = this;
			if (self.$isServer)
				return;
			self.popperVM = new Vue({
				data: {node: ''},
				render: function(createElement) {
					return this.node;
				}
			}).$mount();
			self.debounceClose = VueUtil.component.debounce(200, function() {
				self.handleClosePopper();
			});
		},
		render: function(createElement) {
			var self = this;
			if (self.popperVM) {
				self.popperVM.node = createElement('transition', {
					attrs: {
						name: self.transition
					},
					on: {
						afterLeave: self.doDestroy
					}
				}, [createElement('div', {
					on: {
						mouseleave: function() {
							self.setExpectedState(false);
							self.debounceClose();
						},
						mouseenter: function() {
							self.setExpectedState(true);
						}
					},
					ref: 'popper',
					directives: [{
						name: 'show',
						value: !self.disabled && self.showPopper
					}],
					class: ['vue-tooltip__popper', 'is-' + self.effect, self.popperClass]
				}, [self.$slots.content || self.content])]);
			}
			if (!self.$slots.default || !self.$slots.default.length)
				return self.$slots.default;
			var vnode = getFirstComponentChild(self.$slots.default);
			if (!vnode)
				return vnode;
			var data = vnode.data = vnode.data || {};
			var on = vnode.data.on = vnode.data.on || {};
			on.mouseenter = self.addEventHandle(on.mouseenter, function(){self.setExpectedState(true); self.handleShowPopper();});
			on.mouseleave = self.addEventHandle(on.mouseleave, function(){self.setExpectedState(false); self.debounceClose();});
			data.staticClass = self.concatClass(data.staticClass, 'vue-tooltip');
			return vnode;
		},
		mounted: function() {
			this.referenceElm = this.$el;
		},
		methods: {
			addEventHandle: function(old, fn) {
				return old ? Array.isArray(old) ? old.concat(fn) : [old, fn] : fn;
			},
			concatClass: function(a, b) {
				if (a && a.indexOf(b) > -1)
					return a;
				return a ? b ? (a + ' ' + b) : a : (b || '');
			},
			handleShowPopper: function() {
				var self = this;
				if (!self.expectedState || self.manual)
					return;
				clearTimeout(self.timeout);
				self.timeout = setTimeout(function() {
					self.showPopper = true;
				}, self.openDelay);
			},
			handleClosePopper: function() {
				if (this.enterable && this.expectedState || this.manual)
					return;
				clearTimeout(this.timeout);
				this.showPopper = false;
			},
			setExpectedState: function(expectedState) {
				this.expectedState = expectedState;
			}
		}
	};
	Vue.component(VueTooltip.name, VueTooltip);
	return function() {
		return VueTooltip;
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueRadio', this, function(Vue, VueUtil) {
	'use strict';
	var VueRadio = {
		template: '<label class="vue-radio"><span class="vue-radio__input" :class="{ \'is-disabled\': isDisabled, \'is-checked\': model === label, \'is-focus\': focus }" ><span class="vue-radio__inner"></span><input class="vue-radio__original" :value="label" type="radio" v-model="model" @focus="focus=true" @blur="focus=false" :name="name" :disabled="isDisabled"></span><span class="vue-radio__label"><slot></slot><template v-if="!$slots.default">{{label}}</template></span></label>',
		name: 'VueRadio',
		mixins: [VueUtil.component.emitter],
		componentName: 'VueRadio',
		props: {
			value: {},
			label: {},
			disabled: Boolean,
			name: String
		},
		data: function() {
			return {
				focus: false
			};
		},
		computed: {
			isGroup: function() {
				var parent = this.$parent;
				while (parent) {
					if (parent.$options.componentName !== 'VueRadioGroup') {
						parent = parent.$parent;
					} else {
						this._radioGroup = parent;
						return true;
					}
				}
				return false;
			},
			model: {
				get: function() {
					return this.isGroup ? this._radioGroup.value : this.value;
				},
				set: function(val) {
					if (this.isGroup) {
						this.dispatch('VueRadioGroup', 'input', [val]);
					} else {
						this.$emit('input', val);
					}
				}
			},
			isDisabled: function() {
				return this.isGroup ? this._radioGroup.disabled || this.disabled : this.disabled;
			}
		}
	};
	Vue.component(VueRadio.name, VueRadio);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueSubmenu', this, function(Vue, VueUtil) {
	'use strict';
	var VueSubMenu = {
		template: '<li :class="{ \'vue-submenu\': true, \'is-active\': active, \'is-opened\': opened }" ><div class="vue-submenu__title" ref="submenu-title" :style="paddingStyle"><slot name="title"></slot><i :class="{ \'vue-submenu__icon-arrow\': true, \'vue-icon-arrow-down\': rootMenu.mode === \'vertical\', \'vue-icon-caret-bottom\': rootMenu.mode === \'horizontal\' }"></i></div><template v-if="rootMenu.mode === \'horizontal\'"><transition name="vue-zoom-in-top"><ul class="vue-menu" v-show="opened"><slot></slot></ul></transition></template><collapse-transition v-else><ul class="vue-menu" v-show="opened"><slot></slot></ul></collapse-transition></li>',
		name: 'VueSubmenu',
		componentName: 'VueSubmenu',
		mixins: [VueUtil.component.menumixin, VueUtil.component.emitter],
		components: {
			CollapseTransition: VueUtil.component.collapseTransition
		},
		props: {
			index: {
				type: String,
				required: true
			}
		},
		data: function() {
			return {
				timeout: null,
				items: {},
				submenus: {}
			};
		},
		computed: {
			opened: function() {
				return ( this.rootMenu.openedMenus.indexOf(this.index) > -1) ;
			},
			active: {
				cache: false,
				get: function() {
					var isActive = false;
					var submenus = this.submenus;
					var items = this.items;
					Object.keys(items).forEach(function(index) {
						if (items[index].active) {
							isActive = true;
						}
					});
					Object.keys(submenus).forEach(function(index) {
						if (submenus[index].active) {
							isActive = true;
						}
					});
					return isActive;
				}
			}
		},
		methods: {
			addItem: function(item) {
				this.$set(this.items, item.index, item);
			},
			removeItem: function(item) {
				delete this.items[item.index];
			},
			addSubmenu: function(item) {
				this.$set(this.submenus, item.index, item);
			},
			removeSubmenu: function(item) {
				delete this.submenus[item.index];
			},
			handleClick: function() {
				this.dispatch('VueMenu', 'submenu-click', this);
			},
			handleMouseenter: function() {
				var self = this;
				clearTimeout(self.timeout);
				self.timeout = setTimeout(function() {
					self.rootMenu.openMenu(self.index, self.indexPath);
				}, 300);
			},
			handleMouseleave: function() {
				var self = this;
				clearTimeout(self.timeout);
				self.timeout = setTimeout(function() {
					self.rootMenu.closeMenu(self.index, self.indexPath);
				}, 300);
			},
			initEvents: function() {
				var triggerElm;
				if (this.rootMenu.mode === 'horizontal' && this.rootMenu.menuTrigger === 'hover') {
					triggerElm = this.$el;
					triggerElm.addEventListener('mouseenter', this.handleMouseenter);
					triggerElm.addEventListener('mouseleave', this.handleMouseleave);
				} else {
					triggerElm = this.$refs['submenu-title'];
					triggerElm.addEventListener('click', this.handleClick);
				}
			}
		},
		created: function() {
			this.parentMenu.addSubmenu(this);
			this.rootMenu.addSubmenu(this);
		},
		beforeDestroy: function() {
			this.parentMenu.removeSubmenu(this);
			this.rootMenu.removeSubmenu(this);
		},
		mounted: function() {
			this.initEvents();
		}
	};
	Vue.component(VueSubMenu.name, VueSubMenu);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueSwitch', this, function(Vue) {
	'use strict';
	var VueSwitch = {
		template: '<label class="vue-switch" :class="{ \'is-disabled\': disabled, \'vue-switch--wide\': hasText }"><div class="vue-switch__mask" v-show="disabled"></div><input class="vue-switch__input" type="checkbox" @change="handleChange" v-model="_value" :name="name" :disabled="disabled"><span class="vue-switch__core" ref="core" :style="{ \'width\': coreWidth + \'px\' }"><span class="vue-switch__button" :style="buttonStyle"></span></span><transition name="labvue-fade"><div class="vue-switch__label vue-switch__labvue--left" v-show="value" :style="{ \'width\': coreWidth + \'px\' }"><i :class="[onIconClass]" v-if="onIconClass"></i><span v-if="!onIconClass && onText">{{ onText }}</span></div></transition><transition name="labvue-fade"><div class="vue-switch__label vue-switch__labvue--right" v-show="!value" :style="{ \'width\': coreWidth + \'px\' }"><i :class="[offIconClass]" v-if="offIconClass"></i><span v-if="!offIconClass && offText">{{ offText }}</span></div></transition></label>',
		name: 'VueSwitch',
		props: {
			value: {
				type: Boolean,
				default: true
			},
			disabled: {
				type: Boolean,
				default: false
			},
			width: {
				type: Number,
				default: 0
			},
			onIconClass: {
				type: String,
				default: ''
			},
			offIconClass: {
				type: String,
				default: ''
			},
			onText: {
				type: String,
				default: 'ON'
			},
			offText: {
				type: String,
				default: 'OFF'
			},
			onColor: {
				type: String,
				default: ''
			},
			offColor: {
				type: String,
				default: ''
			},
			name: {
				type: String,
				default: ''
			}
		},
		data: function() {
			return {
				coreWidth: this.width,
				buttonStyle: {
					transform: ''
				}
			};
		},
		computed: {
			hasText: function() {
				return this.onText || this.offText;
			},
			_value: {
				get: function() {
					return this.value;
				},
				set: function(val) {
					this.$emit('input', val);
				}
			}
		},
		watch: {
			value: function() {
				if (this.onColor || this.offColor) {
					this.setBackgroundColor();
				}
				this.handleButtonTransform();
			}
		},
		methods: {
			handleChange: function(event) {
				this.$emit('change', event.currentTarget.checked);
			},
			handleButtonTransform: function() {
				this.buttonStyle.transform = this.value ? 'translate(' + (this.coreWidth - 20) + 'px, 2px)' : 'translate(2px, 2px)';
			},
			setBackgroundColor: function() {
				var newColor = this.value ? this.onColor : this.offColor;
				this.$refs.core.style.borderColor = newColor;
				this.$refs.core.style.backgroundColor = newColor;
			}
		},
		mounted: function() {
			if (this.width === 0) {
				this.coreWidth = this.hasText ? 58 : 46;
			}
			this.handleButtonTransform();
			if (this.onColor || this.offColor) {
				this.setBackgroundColor();
			}
		}
	};
	Vue.component(VueSwitch.name, VueSwitch);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueTabPane', this, function(Vue) {
	'use strict';
	var VueTabPane = {
		template: '<div class="vue-tab-pane" v-show="active"><slot></slot></div>',
		name: 'VueTabPane',
		componentName: 'VueTabPane',
		props: {
			label: String,
			labelContent: Function,
			name: String,
			closable: Boolean,
			disabled: Boolean
		},
		data: function() {
			return {
				index: null
			};
		},
		computed: {
			isClosable: function() {
				return this.closable || this.$parent.closable;
			},
			active: function() {
				return this.$parent.currentName === (this.name || this.index);
			}
		},
		mounted: function() {
			this.$parent.addPanes(this);
		},
		destroyed: function() {
			if (this.$el && this.$el.parentNode) {
				this.$el.parentNode.removeChild(this.$el);
			}
			this.$parent.removePanes(this);
		},
		watch: {
			label: function() {
				this.$parent.$forceUpdate();
			}
		}
	};
	Vue.component(VueTabPane.name, VueTabPane);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueTabs', this, function(Vue) {
	'use strict';
	var VueTabBar = {
		template: '<div class="vue-tabs__active-bar" :style="barStyle"></div>',
		props: {
			tabs: Array
		},
		computed: {
			barStyle: {
				cache: false,
				get: function() {
					var self = this;
					if (!self.$parent.$refs.tabs)
						return {};
					var style = {};
					var offset = 0;
					var tabWidth = 0;
					self.tabs.every(function(tab, index) {
						var $el = self.$parent.$refs.tabs[index];
						if (!$el) {
							return false;
						}
						if (!tab.active) {
							offset += $el.clientWidth;
							return true;
						} else {
							tabWidth = $el.clientWidth;
							return false;
						}
					});
					var transform = 'translateX(' + offset + 'px)';
					style.width = tabWidth + 'px';
					style.transform = transform;
					style.msTransform = transform;
					style.webkitTransform = transform;
					return style;
				}
			}
		}
	};
	var VueTabs = {
		name: 'VueTabs',
		components: {
			TabBar: VueTabBar
		},
		props: {
			type: String,
			activeName: String,
			closable: {
				type: Boolean,
				default: false
			},
			value: {}
		},
		data: function() {
			return {
				children: null,
				currentName: this.value || this.activeName,
				panes: []
			};
		},
		watch: {
			activeName: function(value) {
				this.setCurrentName(value);
			},
			value: function(value) {
				this.setCurrentName(value);
			}
		},
		computed: {
			currentTab: function() {
				var self = this;
				var result;
				self.panes.forEach(function(tab) {
					if (self.currentName === (tab.name || tab.index)) {
						result = tab;
					}
				});
				return result;
			}
		},
		methods: {
			handleTabRemove: function(pane, event) {
				var self = this;
				event.stopPropagation();
				var panes = self.panes;
				var currentTab = self.currentTab;
				var index = panes.indexOf(pane);
				if (index === -1)
					return;
				panes.splice(index, 1);
				pane.$destroy();
				self.$emit('tab-remove', pane);
				self.$nextTick(function() {
					if (pane.active) {
						var panes = self.panes;
						var nextChild = panes[index];
						var prevChild = panes[index - 1];
						var nextActiveTab = nextChild || prevChild || null;
						if (nextActiveTab) {
							self.setCurrentName(nextActiveTab.name || nextActiveTab.index);
						}
						return;
					} else {
						self.setCurrentName(currentTab.name || currentTab.index);
					}
				});
			},
			handleTabClick: function(tab, tabName, event) {
				if (tab.disabled)
					return;
				this.setCurrentName(tabName);
				this.$emit('tab-click', tab, event);
			},
			setCurrentName: function(value) {
				this.currentName = value;
				this.$emit('input', value);
			},
			addPanes: function(item) {
				this.panes.push(item);
			},
			removePanes: function(item) {
				var panes = this.panes;
				var index = panes.indexOf(item);
				if (index > -1) {
					panes.splice(index, 1);
				}
			}
		},
		render: function(createElement) {
			var self = this;
			var type = self.type
			 , handleTabRemove = self.handleTabRemove
			 , handleTabClick = self.handleTabClick
			 , currentName = self.currentName
			 , panes = self.panes;
			var tabs = self._l(panes, function(pane, index) {
				var tabName = pane.name || pane.index || index;
				if (currentName === undefined && index === 0) {
					self.setCurrentName(tabName);
				}
				pane.index = index;
				var btnClose = pane.isClosable ? createElement('span', {
					class: 'vue-icon-close',
					on: {
						click: function(ev) {
							handleTabRemove(pane, ev);
						}
					}
				}, []) : null;
				var tabLabelContent = pane.$slots.label || pane.label;
				return createElement('div', {
					class: {
						'vue-tabs__item': true,
						'is-active': pane.active,
						'is-disabled': pane.disabled,
						'is-closable': pane.isClosable
					},
					ref: 'tabs',
					refInFor: true,
					on: {
						click: function(ev) {
							handleTabClick(pane, tabName, ev);
						}
					}
				}, [tabLabelContent, btnClose]);
			});
			return createElement('div', {
				class: {
					'vue-tabs': true,
					'vue-tabs--card': type === 'card',
					'vue-tabs--border-card': type === 'border-card'
				}
			}, [createElement('div', {
				class: 'vue-tabs__header'
			}, [type ? null : createElement('tab-bar', {
				attrs: {
					tabs: panes
				}
			}, []), tabs]), createElement('div', {
				class: 'vue-tabs__content'
			}, [this.$slots.default])]);
		}
	};
	Vue.component(VueTabs.name, VueTabs);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
	}
})('VueTag', this, function(Vue) {
	'use strict';
	var VueTag = {
		template: '<transition name="vue-zoom-in-center" v-if="transition"><span class="vue-tag" :class="[type ? \'vue-tag--\' + type : \'\', {\'is-hit\': hit}]" :style="{backgroundColor: color}"><slot></slot><i class="vue-tag__close vue-icon-close" v-if="closable" @click="handleClose"></i></span></transition><span v-else class="vue-tag" :class="[type ? \'vue-tag--\' + type : \'\', {\'is-hit\': hit}]" :style="{backgroundColor: color}"><slot></slot><i class="vue-tag__close vue-icon-close" v-if="closable" @click="handleClose"></i></span>',
		name: 'VueTag',
		props: {
			text: String,
			closable: Boolean,
			type: String,
			hit: Boolean,
			transition: {
				type: Boolean,
				default: false
			},
			color: String
		},
		methods: {
			handleClose: function(event) {
				this.$emit('close', event);
			}
		}
	};
	Vue.component(VueTag.name, VueTag);
	return function() {
		return VueTag;
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VueCheckbox', 'VueTag'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VueCheckbox'], context['VueTag']);
		delete context[name];
	}
})('VueTableColumn', this, function(Vue, VueUtil, VueCheckbox, VueTag) {
	'use strict';
	var columnIdSeed = 1;
	var defaults = {
		default: {
			order: ''
		},
		selection: {
			width: 48,
			minWidth: 48,
			realWidth: 48,
			order: '',
			className: 'vue-table-column--selection'
		},
		expand: {
			width: 48,
			minWidth: 48,
			realWidth: 48,
			order: ''
		},
		index: {
			width: 48,
			minWidth: 48,
			realWidth: 48,
			order: ''
		}
	};
	var forced = {
		selection: {
			renderHeader: function(createElement) {
				return createElement('vue-checkbox', {
					nativeOn: {
						click: this.toggleAllSelection
					},
					attrs: {
						value: this.isAllSelected
					}
				}, []);
			},
			renderCell: function(createElement, data) {
				var row = data.row;
				var column = data.column;
				var store = data.store;
				var index = data.$index;
				return createElement('vue-checkbox', {
					attrs: {
						disabled: !!column.selectable && !column.selectable.call(null, row, index),
						value: store.isSelected(row)
					},
					on: {
						input: function() {
							store.commit('rowSelectedChanged', row)
						}
					}
				}, []);
			},
			sortable: false,
			resizable: false
		},
		index: {
			renderHeader: function(createElement, data) {
				var column = data.column;
				return column.label || '#';
			},
			renderCell: function(createElement, data) {
				var n = data.$index;
				return createElement('div', null, [n + 1])
			},
			sortable: false
		},
		expand: {
			renderHeader: function(createElement, data) {
				return '';
			},
			renderCell: function(createElement, data, proxy) {
				var row = data.row;
				var store = data.store;
				var expanded = store.states.expandRows.indexOf(row) > -1;
				return createElement('div', {
					class: 'vue-table__expand-icon ' + (expanded ? 'vue-table__expand-icon--expanded' : ''),
					on: {
						click: function() {
							return proxy.handleExpandClick(row)
						}
					}
				}, [createElement('i', {
					class: 'vue-icon vue-icon-arrow-right'
				}, [])])
			},
			sortable: false,
			resizable: false,
			className: 'vue-table__expand-column'
		}
	};
	var getValueByPath = function(object, prop) {
		prop = prop || '';
		var paths = prop.split('.');
		var current = object;
		var result = null;
		for (var i = 0, j = paths.length; i < j; i++) {
			var path = paths[i];
			if (!current)
				break;
			if (i === j - 1) {
				result = current[path];
				break;
			}
			current = current[path];
		}
		return result;
	};
	var getDefaultColumn = function(type, options) {
		var column = {};
		VueUtil.merge(column, defaults[type || 'default']);
		for (var name in options) {
			if (options.hasOwnProperty(name)) {
				var value = options[name];
				if (typeof value !== 'undefined') {
					column[name] = value;
				}
			}
		}
		column.realWidth = column.width || column.minWidth;
		return column;
	};
	var DEFAULT_RENDER_CELL = function(createElement, data) {
		var row = data.row;
		var column = data.column;
		var property = column.property;
		if (column && column.formatter) {
			return column.formatter(row, column);
		}
		if (property && property.indexOf('.') === -1) {
			return row[property];
		}
		return getValueByPath(row, property);
	};
	var VueTableColumn = {
		name: 'VueTableColumn',
		props: {
			type: {
				type: String,
				default: 'default'
			},
			label: String,
			className: [String, Function],
			labelClassName: String,
			property: String,
			prop: String,
			width: {},
			minWidth: {},
			renderHeader: Function,
			sortable: {
				type: [String, Boolean],
				default: false
			},
			sortMethod: Function,
			resizable: {
				type: Boolean,
				default: true
			},
			context: {},
			columnKey: String,
			align: String,
			headerAlign: String,
			showTooltipWhenOverflow: Boolean,
			showOverflowTooltip: Boolean,
			fixed: [Boolean, String],
			formatter: Function,
			selectable: Function,
			reserveSelection: Boolean,
			filterMethod: Function,
			filteredValue: Array,
			filters: Array,
			filterPlacement: String,
			filterMultiple: {
				type: Boolean,
				default: true
			}
		},
		data: function() {
			return {
				isSubColumn: false,
				columns: []
			};
		},
		beforeCreate: function() {
			this.row = {};
			this.column = {};
			this.$index = 0;
		},
		components: {
			VueCheckbox: VueCheckbox(),
			VueTag: VueTag()
		},
		computed: {
			owner: function() {
				var parent = this.$parent;
				while (parent && !parent.tableId) {
					parent = parent.$parent;
				}
				return parent;
			}
		},
		created: function() {
			this.customRender = this.$options.render;
			this.$options.render = function(createElement) {
				return createElement('div', this.$slots.default)
			}
			var columnId = this.columnId = this.columnKey || ((this.$parent.tableId || (this.$parent.columnId + '_')) + 'column_' + columnIdSeed++);
			var parent = this.$parent;
			var owner = this.owner;
			this.isSubColumn = owner !== parent;
			var type = this.type;
			var width = this.width;
			if (width !== undefined) {
				width = parseInt(width, 10);
				if (isNaN(width)) {
					width = null;
				}
			}
			var minWidth = this.minWidth;
			if (minWidth !== undefined) {
				minWidth = parseInt(minWidth, 10);
				if (isNaN(minWidth)) {
					minWidth = 80;
				}
			}
			var isColumnGroup = false;
			var column = getDefaultColumn(type, {
				id: columnId,
				label: this.label,
				className: this.className,
				labelClassName: this.labelClassName,
				property: this.prop || this.property,
				type: type,
				renderCell: null,
				renderHeader: this.renderHeader,
				minWidth: minWidth,
				width: width,
				isColumnGroup: isColumnGroup,
				context: this.context,
				align: this.align ? 'is-' + this.align : null,
				headerAlign: this.headerAlign ? 'is-' + this.headerAlign : 'is-center',
				sortable: this.sortable === '' ? true : this.sortable,
				sortMethod: this.sortMethod,
				resizable: this.resizable,
				showOverflowTooltip: this.showOverflowTooltip || this.showTooltipWhenOverflow,
				formatter: this.formatter,
				selectable: this.selectable,
				reserveSelection: this.reserveSelection,
				fixed: this.fixed === '' ? true : this.fixed,
				filterMethod: this.filterMethod,
				filters: this.filters,
				filterable: this.filters || this.filterMethod,
				filterMultiple: this.filterMultiple,
				filterOpened: false,
				filteredValue: this.filteredValue || [],
				filterPlacement: this.filterPlacement || '',
				getCellClass: function(rowIndex, cellIndex, rowData) {
					var classes = [];
					var className = this.className;
					if (typeof className === 'string') {
						classes.push(className);
					} else if (typeof className === 'function') {
						classes.push(className.call(null, rowIndex, cellIndex, rowData) || '');
					}
					return classes.join(' ');
				}
			});
			VueUtil.merge(column, forced[type] || {});
			this.columnConfig = column;
			var renderCell = column.renderCell;
			var _self = this;
			if (type === 'expand') {
				owner.renderExpanded = function(createElement, data) {
					return _self.$scopedSlots.default ? _self.$scopedSlots.default(data) : _self.$slots.default;
				}
				column.renderCell = function(createElement, data) {
					return createElement('div', {
						class: 'cell'
					}, [renderCell(createElement, data, this._renderProxy)]);
				}
				return;
			}
			column.renderCell = function(createElement, data) {
				if (_self.$vnode.data.inlineTemplate) {
					renderCell = function() {
						data._self = _self.context || data._self;
						if (Object.prototype.toString.call(data._self) === '[object Object]') {
							for (var prop in data._self) {
								if (!data.hasOwnProperty(prop)) {
									data[prop] = data._self[prop];
								}
							}
						}
						data._staticTrees = _self._staticTrees;
						data.$options.staticRenderFns = _self.$options.staticRenderFns;
						return _self.customRender.call(data);
					}
				} else if (_self.$scopedSlots.default) {
					renderCell = function() {
						return _self.$scopedSlots.default(data);
					}
				}
				if (!renderCell) {
					renderCell = DEFAULT_RENDER_CELL;
				}
				return _self.showOverflowTooltip || _self.showTooltipWhenOverflow ? createElement('div',
				{ 'class': 'cell vue-tooltip', style: 'width:' + (data.column.realWidth || data.column.width) + 'px' },
				[renderCell(createElement, data)]) : createElement('div', {
					class: 'cell'
				}, [renderCell(createElement, data)]);
			}
		},
		destroyed: function() {
			if (!this.$parent)
				return;
			this.owner.store.commit('removeColumn', this.columnConfig);
		},
		watch: {
			label: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.label = newVal;
				}
			},
			prop: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.property = newVal;
				}
			},
			property: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.property = newVal;
				}
			},
			filters: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.filters = newVal;
				}
			},
			filterMultiple: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.filterMultiple = newVal;
				}
			},
			align: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.align = newVal ? 'is-' + newVal : null;
					if (!this.headerAlign) {
						this.columnConfig.headerAlign = newVal ? 'is-' + newVal : null;
					}
				}
			},
			headerAlign: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.headerAlign = 'is-' + (newVal ? newVal : this.align);
				}
			},
			width: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.width = newVal;
					this.owner.store.scheduleLayout();
				}
			},
			minWidth: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.minWidth = newVal;
					this.owner.store.scheduleLayout();
				}
			},
			fixed: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.fixed = newVal;
					this.owner.store.scheduleLayout();
				}
			},
			sortable: function(newVal) {
				if (this.columnConfig) {
					this.columnConfig.sortable = newVal;
				}
			}
		},
		mounted: function() {
			var owner = this.owner;
			var parent = this.$parent;
			var columnIndex;
			if (!this.isSubColumn) {
				columnIndex = [].indexOf.call(parent.$refs.hiddenColumns.children, this.$el);
			} else {
				columnIndex = [].indexOf.call(parent.$el.children, this.$el);
			}
			owner.store.commit('insertColumn', this.columnConfig, columnIndex, this.isSubColumn ? parent.columnConfig : null);
		}
	};
	Vue.component(VueTableColumn.name, VueTableColumn);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VuePopper', 'VuePopup', 'VueCheckbox', 'VueCheckboxGroup', 'VueTag', 'VueTooltip'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VuePopper'], context['VuePopup'], context['VueCheckbox'], context['VueCheckboxGroup'], context['VueTag'], context['VueTooltip']);
		delete context[name];
	}
})('VueTable', this, function(Vue, VueUtil, VuePopper, VuePopup, VueCheckbox, VueCheckboxGroup, VueTag, VueTooltip) {
	'use strict';
	var isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	var SIZE, REMAIN;
	var bodyScrollLeft = 0;
	var bodyScrollTop = 0;
	var dropdowns = [];
	var Dropdown = {
		open: function(instance) {
			if (instance) {
				dropdowns.push(instance);
			}
		},
		close: function(instance) {
			var index = dropdowns.indexOf(instance);
			if (index !== -1) {
				dropdowns.splice(instance, 1);
			}
		}
	};
	var scrollFilter = function(slots, delta) {
		if (delta.keeps === 0) {
			return slots;
		}
		delta.total = slots.length;
		delta.paddingTop = SIZE * delta.start;
		delta.allPadding = SIZE * (slots.length - delta.keeps);
		delta.paddingTop < 0 ? delta.paddingTop = 0 : undefined;
		delta.allPadding < 0 ? delta.allPadding = 0 : undefined;
		delta.allPadding < delta.paddingTop ? delta.allPadding = delta.paddingTop : undefined;
		return slots.filter(function(slot, index) {
			return index >= delta.start && index <= delta.end;
		});
	};
	var mousewheel = function(element, callback) {
		if (element && element.addEventListener) {
			element.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', callback);
		}
	};
	var getValueByPath = function(object, prop) {
		prop = prop || '';
		var paths = prop.split('.');
		var current = object;
		var result = null;
		for (var i = 0, j = paths.length; i < j; i++) {
			var path = paths[i];
			if (!current)
				break;
			if (i === j - 1) {
				result = current[path];
				break;
			}
			current = current[path];
		}
		return result;
	};
	var isObject = function(obj) {
		return obj !== null && typeof obj === 'object';
	};
	var getCell = function(event) {
		var cell = event.target;
		while (cell && cell.tagName.toUpperCase() !== 'HTML') {
			if (cell.tagName.toUpperCase() === 'TD') {
				return cell;
			}
			cell = cell.parentNode;
		}
		return null;
	};
	var getAllColumns = function(columns) {
		var result = [];
		columns.forEach(function(column) {
			if (column.children) {
				result.push(column);
				result.push.apply(result, getAllColumns(column.children));
			} else {
				result.push(column);
			}
		});
		return result;
	};
	var convertToRows = function(originColumns) {
		var maxLevel = 1;
		var traverse = function(column, parent) {
			if (parent) {
				column.level = parent.level + 1;
				if (maxLevel < column.level) {
					maxLevel = column.level;
				}
			}
			if (column.children) {
				var childrenMax = 1;
				var colSpan = 0;
				column.children.forEach(function(subColumn) {
					var temp = traverse(subColumn, column);
					if (temp > childrenMax) {
						childrenMax = temp;
					}
					colSpan += subColumn.colSpan;
				});
				column.colSpan = colSpan;
			} else {
				column.colSpan = 1;
			}
		};
		originColumns.forEach(function(column) {
			column.level = 1;
			traverse(column);
		});
		var rows = [];
		for (var i = 0; i < maxLevel; i++) {
			rows.push([]);
		}
		var allColumns = getAllColumns(originColumns);
		allColumns.forEach(function(column) {
			if (!column.children) {
				column.rowSpan = maxLevel - column.level + 1;
			} else {
				column.rowSpan = 1;
			}
			rows[column.level - 1].push(column);
		});
		return rows;
	};
	var orderBy = function(array, sortKey, reverse, sortMethod) {
		if (typeof reverse === 'string') {
			reverse = reverse === 'descending' ? -1 : 1;
		}
		if (!sortKey) {
			return array;
		}
		var order = (reverse && reverse < 0) ? -1 : 1;
		return array.slice().sort(sortMethod ? function(a, b) {
			return sortMethod(a, b) ? order : -order;
		}
		: function(a, b) {
			if (sortKey !== '$key') {
				if (isObject(a) && '$value'in a)
					a = a.$value;
				if (isObject(b) && '$value'in b)
					b = b.$value;
			}
			a = isObject(a) ? getValueByPath(a, sortKey) : a;
			b = isObject(b) ? getValueByPath(b, sortKey) : b;
			return a === b ? 0 : a > b ? order : -order;
		}
		);
	};
	var getColumnById = function(table, columnId) {
		var column = null;
		table.columns.forEach(function(item) {
			if (item.id === columnId) {
				column = item;
			}
		});
		return column;
	};
	var getColumnByCell = function(table, cell) {
		var matches = (cell.className || '').match(/vue-table_[^\s]+/gm);
		if (matches) {
			return getColumnById(table, matches[0]);
		}
		return null;
	};
	var getRowIdentity = function(row, rowKey) {
		if (!row)
			throw new Error('row is required when get row identity');
		if (typeof rowKey === 'string') {
			return row[rowKey];
		} else if (typeof rowKey === 'function') {
			return rowKey.call(null, row);
		}
	};
	var sortData = function(data, states) {
		var sortingColumn = states.sortingColumn;
		if (!sortingColumn || typeof sortingColumn.sortable === 'string') {
			return data;
		}
		return orderBy(data, states.sortProp, states.sortOrder, sortingColumn.sortMethod);
	};
	var getKeysMap = function(array, rowKey) {
		var arrayMap = {};
		(array || []).forEach(function(row, index) {
			arrayMap[getRowIdentity(row, rowKey)] = {
				row: row,
				index: index
			};
		});
		return arrayMap;
	};
	var toggleRowSelection = function(states, row, selected) {
		var changed = false;
		var selection = states.selection;
		var index = selection.indexOf(row);
		if (typeof selected === 'undefined') {
			if (index === -1) {
				selection.push(row);
				changed = true;
			} else {
				selection.splice(index, 1);
				changed = true;
			}
		} else {
			if (selected && index === -1) {
				selection.push(row);
				changed = true;
			} else if (!selected && index > -1) {
				selection.splice(index, 1);
				changed = true;
			}
		}
		return changed;
	};
	var TableStore = function(table, initialState) {
		if (!table) {
			throw new Error('Table is required.');
		}
		this.table = table;
		this.states = {
			rowKey: null,
			_columns: [],
			originColumns: [],
			columns: [],
			fixedColumns: [],
			rightFixedColumns: [],
			isComplex: false,
			_data: null,
			filteredData: null,
			data: null,
			sortingColumn: null,
			sortProp: null,
			sortOrder: null,
			isAllSelected: false,
			selection: [],
			reserveSelection: false,
			selectable: null,
			currentRow: null,
			hoverRow: null,
			filters: {},
			expandRows: [],
			defaultExpandAll: false
		};
		for (var prop in initialState) {
			if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
				this.states[prop] = initialState[prop];
			}
		}
	};
	TableStore.prototype.mutations = {
		setData: function(states, data) {
			var dataInstanceChanged = states._data !== data;
			states._data = data;
			states.data = sortData((data || []), states);
			states.data.forEach(function(item) {
				if (!item.$extra) {
					Object.defineProperty(item, '$extra', {
						value: {},
						enumerable: false
					});
				}
			});
			this.updateCurrentRow();
			if (!states.reserveSelection) {
				if (dataInstanceChanged) {
					this.clearSelection();
				} else {
					this.cleanSelection();
				}
				this.updateAllSelected();
			} else {
				var rowKey = states.rowKey;
				if (rowKey) {
					var selection = states.selection;
					var selectedMap = getKeysMap(selection, rowKey);
					states.data.forEach(function(row) {
						var rowId = getRowIdentity(row, rowKey);
						var rowInfo = selectedMap[rowId];
						if (rowInfo) {
							selection[rowInfo.index] = row;
						}
					});
					this.updateAllSelected();
				} else {
					console.warn('WARN: rowKey is required when reserve-selection is enabled.');
				}
			}
			var defaultExpandAll = states.defaultExpandAll;
			var self = this;
			if (defaultExpandAll) {
				self.states.expandRows = (states.data || []).slice(0);
			}
			Vue.nextTick(function() {
				self.table.updateScrollY();
				self.table.resizeZone();
			});
		},
		changeSortCondition: function(states) {
			var self = this;
			states.data = sortData((states.filteredData || states._data || []), states);
			this.table.$emit('sort-change', {
				column: self.states.sortingColumn,
				prop: self.states.sortProp,
				order: self.states.sortOrder
			});
			Vue.nextTick(function() {
				self.table.updateScrollY();
			});
		},
		filterChange: function(states, options) {
			var self = this;
			var values = options.values,
				column = options.column,
				silent = options.silent;
			if (values && !Array.isArray(values)) {
				values = [values];
			}
			var prop = column.property;
			var filters = {};
			if (prop) {
				states.filters[column.id] = values;
				filters[column.columnKey || column.id] = values;
			}
			var data = states._data;
			var filters = states.filters;
			Object.keys(filters).forEach(function(columnId) {
				var values = filters[columnId];
				if (!values || values.length === 0)
					return;
				var column = getColumnById(self.states, columnId);
				if (column) {
					if (column.filterMethod) {
						data = data.filter(function(row) {
							return values.some(function(value) {
								column.filterMethod.call(null, value, row)
							});
						});
					} else {
						var columnKey = column.property
						data = data.filter(function(row) {
							return values.some(function(value) {
								return row[columnKey] === value;;
							});
						});
					}
				}
			});
			states.filteredData = data;
			states.data = sortData(data, states);
			if (!silent) {
				self.table.$emit('filter-change', filters);
			}
			Vue.nextTick(function() {
				self.table.updateScrollY();
				self.table.resizeZone();
			});
		},
		insertColumn: function(states, column, index, parent) {
			var array = states._columns;
			if (parent) {
				array = parent.children;
				if (!array)
					array = parent.children = [];
			}
			if (typeof index !== 'undefined') {
				array.splice(index, 0, column);
			} else {
				array.push(column);
			}
			if (column.type === 'selection') {
				states.selectable = column.selectable;
				states.reserveSelection = column.reserveSelection;
			}
			this.updateColumns();
			this.scheduleLayout();
		},
		removeColumn: function(states, column) {
			var _columns = states._columns;
			if (_columns) {
				_columns.splice(_columns.indexOf(column), 1);
			}
			this.updateColumns();
			this.scheduleLayout();
		},
		setHoverRow: function(states, row) {
			states.hoverRow = row;
		},
		setCurrentRow: function(states, row) {
			var oldCurrentRow = states.currentRow;
			states.currentRow = row;
			if (oldCurrentRow !== row) {
				this.table.$emit('current-change', row, oldCurrentRow);
			}
		},
		rowSelectedChanged: function(states, row) {
			var changed = toggleRowSelection(states, row);
			var selection = states.selection;
			if (changed) {
				var table = this.table;
				table.$emit('selection-change', selection);
				table.$emit('select', selection, row);
			}
			this.updateAllSelected();
		},
		toggleRowExpanded: function(states, row, expanded) {
			var expandRows = states.expandRows;
			if (typeof expanded !== 'undefined') {
				var index = expandRows.indexOf(row);
				if (expanded) {
					if (index === -1)
						expandRows.push(row);
				} else {
					if (index !== -1)
						expandRows.splice(index, 1);
				}
			} else {
				var index = expandRows.indexOf(row);
				if (index === -1) {
					expandRows.push(row);
				} else {
					expandRows.splice(index, 1);
				}
			}
			this.table.$emit('expand', row, expandRows.indexOf(row) !== -1);
		},
		toggleAllSelection: VueUtil.component.debounce(10, function(states) {
			var data = states.data || [];
			var value = !states.isAllSelected;
			var selection = this.states.selection;
			var selectionChanged = false;
			data.forEach(function(item, index) {
				if (states.selectable) {
					if (states.selectable.call(null, item, index) && toggleRowSelection(states, item, value)) {
						selectionChanged = true;
					}
				} else {
					if (toggleRowSelection(states, item, value)) {
						selectionChanged = true;
					}
				}
			});
			var table = this.table;
			if (selectionChanged) {
				table.$emit('selection-change', selection);
			}
			table.$emit('select-all', selection);
			states.isAllSelected = value;
		})
	};
	var doFlattenColumns = function(columns) {
		var result = [];
		columns.forEach(function(column) {
			if (column.children) {
				result.push.apply(result, doFlattenColumns(column.children));
			} else {
				result.push(column);
			}
		});
		return result;
	};
	TableStore.prototype.updateColumns = function() {
		var states = this.states;
		var _columns = states._columns || [];
		states.fixedColumns = _columns.filter(function(column) {
			return column.fixed === true || column.fixed === 'left'
		});
		states.rightFixedColumns = _columns.filter(function(column) {
			return column.fixed === 'right'
		});
		if (states.fixedColumns.length > 0 && _columns[0] && _columns[0].type === 'selection' && !_columns[0].fixed) {
			_columns[0].fixed = true;
			states.fixedColumns.unshift(_columns[0]);
		}
		states.originColumns = [].concat(states.fixedColumns).concat(_columns.filter(function(column) {
			return !column.fixed
		})).concat(states.rightFixedColumns);
		states.columns = doFlattenColumns(states.originColumns);
		states.isComplex = states.fixedColumns.length > 0 || states.rightFixedColumns.length > 0;
	}
	TableStore.prototype.isSelected = function(row) {
		return (this.states.selection || []).indexOf(row) > -1;
	}
	TableStore.prototype.clearSelection = function() {
		var states = this.states;
		states.isAllSelected = false;
		var oldSelection = states.selection;
		states.selection = [];
		if (oldSelection.length > 0) {
			this.table.$emit('selection-change', states.selection);
		}
	}
	TableStore.prototype.setExpandRowKeys = function(rowKeys) {
		var expandRows = [];
		var data = this.states.data;
		var rowKey = this.states.rowKey;
		if (!rowKey)
			throw new Error('[Table] prop row-key should not be empty.');
		var keysMap = getKeysMap(data, rowKey);
		rowKeys.forEach(function(key) {
			var info = keysMap[key];
			if (info) {
				expandRows.push(info.row);
			}
		});
		this.states.expandRows = expandRows;
	}
	TableStore.prototype.toggleRowSelection = function(row, selected) {
		var changed = toggleRowSelection(this.states, row, selected);
		if (changed) {
			this.table.$emit('selection-change', this.states.selection);
		}
	}
	TableStore.prototype.cleanSelection = function() {
		var selection = this.states.selection || [];
		var data = this.states.data;
		var rowKey = this.states.rowKey;
		var deleted;
		if (rowKey) {
			deleted = [];
			var selectedMap = getKeysMap(selection, rowKey);
			var dataMap = getKeysMap(data, rowKey);
			for (var key in selectedMap) {
				if (selectedMap.hasOwnProperty(key) && !dataMap[key]) {
					deleted.push(selectedMap[key].row);
				}
			}
		} else {
			deleted = selection.filter(function(item) {
				return data.indexOf(item) === -1;
			});
		}
		deleted.forEach(function(deletedItem) {
			selection.splice(selection.indexOf(deletedItem), 1);
		});
		if (deleted.length) {
			this.table.$emit('selection-change', selection);
		}
	}
	TableStore.prototype.updateAllSelected = function() {
		var states = this.states;
		var selection = states.selection;
		var rowKey = states.rowKey;
		var selectable = states.selectable;
		var data = states.data;
		if (!data || data.length === 0) {
			states.isAllSelected = false;
			return;
		}
		var selectedMap;
		if (rowKey) {
			selectedMap = getKeysMap(selection, rowKey);
		}
		var isSelected = function(row) {
			if (selectedMap) {
				return !!selectedMap[getRowIdentity(row, rowKey)];
			} else {
				return selection.indexOf(row) !== -1;
			}
		};
		var isAllSelected = true;
		var selectedCount = 0;
		for (var i = 0, j = data.length; i < j; i++) {
			var item = data[i];
			if (selectable) {
				var isRowSelectable = selectable.call(null, item, i);
				if (isRowSelectable) {
					if (!isSelected(item)) {
						isAllSelected = false;
						break;
					} else {
						selectedCount++;
					}
				}
			} else {
				if (!isSelected(item)) {
					isAllSelected = false;
					break;
				} else {
					selectedCount++;
				}
			}
		}
		if (selectedCount === 0)
			isAllSelected = false;
		states.isAllSelected = isAllSelected;
	}
	TableStore.prototype.scheduleLayout = function() {
		this.table.debouncedLayout();
	}
	TableStore.prototype.setCurrentRowKey = function(key) {
		var states = this.states;
		var rowKey = states.rowKey;
		if (!rowKey)
			throw new Error('[Table] row-key should not be empty.');
		var data = states.data || [];
		var keysMap = getKeysMap(data, rowKey);
		var info = keysMap[key];
		if (info) {
			states.currentRow = info.row;
		}
	}
	TableStore.prototype.updateCurrentRow = function() {
		var states = this.states;
		var table = this.table;
		var data = states.data || [];
		var oldCurrentRow = states.currentRow;
		if (data.indexOf(oldCurrentRow) === -1) {
			states.currentRow = null;
			if (states.currentRow !== oldCurrentRow) {
				table.$emit('current-change', null, oldCurrentRow);
			}
		}
	}
	TableStore.prototype.commit = function(name) {
		var mutations = this.mutations;
		var args = [];
		for (var i = 1, j = arguments.length; i < j; i++) {
			args[i - 1] = arguments[i];
		}
		if (mutations[name]) {
			mutations[name].apply(this, [this.states].concat(args));
		} else {
			throw new Error('Action not found: ' + name);
		}
	}
	var TableLayout = function(options) {
		this.table = null;
		this.store = null;
		this.columns = null;
		this.fit = true;
		this.showHeader = true;
		this.height = null;
		this.scrollX = false;
		this.scrollY = false;
		this.bodyWidth = null;
		this.fixedWidth = null;
		this.rightFixedWidth = null;
		this.tableHeight = null;
		this.headerHeight = 44;
		this.viewportHeight = null;
		this.bodyHeight = null;
		this.fixedBodyHeight = null;
		this.gutterWidth = VueUtil.component.scrollBarWidth();
		for (var name in options) {
			if (options.hasOwnProperty(name)) {
				this[name] = options[name];
			}
		}
		if (!this.table) {
			throw new Error('table is required for Table Layout');
		}
		if (!this.store) {
			throw new Error('store is required for Table Layout');
		}
		this.updateScrollY = function() {
			var height = this.height;
			if (typeof height !== 'string' && typeof height !== 'number')
				return;
			var bodyWrapper = this.table.bodyWrapper;
			if (this.table.$el && bodyWrapper) {
				var body = bodyWrapper.querySelector('.vue-table__body');
				this.scrollY = body.offsetHeight > bodyWrapper.offsetHeight;
			}
		}
	};
	TableLayout.prototype.setHeight = function(value) {
		var prop = 'height';
		var el = this.table.$el;
		if (typeof value === 'string' && /^\d+$/.test(value)) {
			value = Number(value);
		}
		this.height = value;
		if (!el)
			return;
		if (typeof value === 'number') {
			el.style[prop] = value + 'px';
		} else if (typeof value === 'string') {
			if (value === '') {
				el.style[prop] = '';
			}
		}
		this.updateHeight();
	};
	TableLayout.prototype.updateHeight = function() {
		var height = this.tableHeight = this.table.$el.clientHeight;
		var noData = !this.table.data || this.table.data.length === 0;
		var headerWrapper = this.table.$refs.headerWrapper;
		if (this.showHeader && !headerWrapper)
			return;
		if (!this.showHeader) {
			this.headerHeight = 0;
			if (this.height !== null && (!isNaN(this.height) || typeof this.height === 'string')) {
				this.bodyHeight = height;
			}
			this.fixedBodyHeight = this.scrollX ? height - this.gutterWidth : height;
		} else {
			var headerHeight = this.headerHeight = headerWrapper.offsetHeight;
			var ratio = this.table.showSummary && this.table.data && this.table.data.length > 0 ? 2 : 1;
			var bodyHeight = height - ratio * headerHeight + (this.table.showSummary ? 1 : 0);
			if (this.height !== null && (!isNaN(this.height) || typeof this.height === 'string')) {
				this.bodyHeight = bodyHeight;
			}
			this.fixedBodyHeight = this.scrollX ? bodyHeight - this.gutterWidth : bodyHeight;
		}
		this.viewportHeight = height;
	};
	TableLayout.prototype.update = function() {
		var fit = this.fit;
		var columns = this.table.columns;
		var bodyWidth = this.table.$el.clientWidth;
		var bodyMinWidth = 0;
		var flattenColumns = [];
		columns.forEach(function(column) {
			if (column.isColumnGroup) {
				flattenColumns.push.apply(flattenColumns, column.columns);
			} else {
				flattenColumns.push(column);
			}
		});
		var flexColumns = flattenColumns.filter(function(column) {
			return typeof column.width !== 'number'
		});
		if (flexColumns.length > 0 && fit) {
			flattenColumns.forEach(function(column) {
				bodyMinWidth += column.width || column.minWidth || 80;
			});
			if (bodyMinWidth <= bodyWidth - this.gutterWidth) {
				this.scrollX = false;
				var totalFlexWidth = bodyWidth - this.gutterWidth - bodyMinWidth;
				if (flexColumns.length === 1) {
					flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth;
				} else {
					var allColumnsWidth = flexColumns.reduce(function(prev, column) {
						return prev + (column.minWidth || 80);
					}, 0);
					var flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
					var noneFirstWidth = 0;
					flexColumns.forEach(function(column, index) {
						if (index === 0)
							return;
						var flexWidth = Math.floor((column.minWidth || 80) * flexWidthPerPixel);
						noneFirstWidth += flexWidth;
						column.realWidth = (column.minWidth || 80) + flexWidth;
					});
					flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth;
				}
			} else {
				this.scrollX = true;
				flexColumns.forEach(function(column) {
					column.realWidth = column.minWidth;
				});
			}
			this.bodyWidth = Math.max(bodyMinWidth, bodyWidth);
		} else {
			flattenColumns.forEach(function(column) {
				if (!column.width && !column.minWidth) {
					column.realWidth = 80;
				} else {
					column.realWidth = column.width || column.minWidth;
				}
				bodyMinWidth += column.realWidth;
			});
			this.scrollX = bodyMinWidth > bodyWidth;
			this.bodyWidth = bodyMinWidth;
		}
		var fixedColumns = this.store.states.fixedColumns;
		if (fixedColumns.length > 0) {
			var fixedWidth = 0;
			fixedColumns.forEach(function(column) {
				fixedWidth += column.realWidth;
			});
			this.fixedWidth = fixedWidth;
		}
		var rightFixedColumns = this.store.states.rightFixedColumns;
		if (rightFixedColumns.length > 0) {
			var rightFixedWidth = 0;
			rightFixedColumns.forEach(function(column) {
				rightFixedWidth += column.realWidth;
			});
			this.rightFixedWidth = rightFixedWidth;
		}
	};
	var VueTableFilterPanel = {
		template: '<transition name="vue-zoom-in-top" @after-leave="doDestroy"><div class="vue-table-filter" v-if="multiple" v-show="showPopper" v-clickoutside="handleOutsideClick"><div class="vue-table-filter__content"><vue-checkbox-group class="vue-table-filter__checkbox-group" v-model="filteredValue"><vue-checkbox v-for="filter in filters" :key="filter.value" :label="filter.value">{{ filter.text }}</vue-checkbox></vue-checkbox-group></div><div class="vue-table-filter__bottom"><button @click="handleConfirm" :class="{ \'is-disabled\': filteredValue.length === 0 }" :disabled="filteredValue.length === 0">{{ $t(\'vue.table.confirmFilter\') }}</button><button @click="handleReset">{{ $t(\'vue.table.resetFilter\') }}</button></div></div><div class="vue-table-filter" v-else v-show="showPopper"><ul class="vue-table-filter__list"><li class="vue-table-filter__list-item" :class="{ \'is-active\': !filterValue }" @click="handleSelect(null)">{{ $t(\'vue.table.clearFilter\') }}</li><li class="vue-table-filter__list-item" v-for="filter in filters" :key="filter.value" :label="filter.value" :class="{ \'is-active\': isActive(filter) }" @click="handleSelect(filter.value)" >{{ filter.text }}</li></ul></div></transition>',
		name: 'VueTableFilterPanel',
		mixins: [VuePopper()],
		directives: {
			Clickoutside: VueUtil.component.clickoutside()
		},
		components: {
			VueCheckbox: VueCheckbox(),
			VueCheckboxGroup: VueCheckboxGroup()
		},
		props: {
			placement: {
				type: String,
				default: 'bottom-end'
			}
		},
		customRender: function(createElement) {
			return createElement('div', {
				class: 'vue-table-filter'
			}, [createElement('div', {
				class: 'vue-table-filter__content'
			}, []), createElement('div', {
				class: 'vue-table-filter__bottom'
			}, [createElement('button', {
				on: {
					click: this.handleConfirm
				}
			}, [this.$t('vue.table.confirmFilter')]), createElement('button', {
				on: {
					click: this.handleReset
				}
			}, [this.$t('vue.table.resetFilter')])])]);
		},
		methods: {
			isActive: function(filter) {
				return filter.value === this.filterValue;
			},
			handleOutsideClick: function() {
				this.showPopper = false;
			},
			handleConfirm: function() {
				this.confirmFilter(this.filteredValue);
				this.handleOutsideClick();
			},
			handleReset: function() {
				this.filteredValue = [];
				this.handleConfirm();
			},
			handleSelect: function(filterValue) {
				this.filterValue = filterValue;
				if ((typeof filterValue !== 'undefined') && (filterValue !== null)) {
					this.confirmFilter(this.filteredValue);
				} else {
					this.confirmFilter([]);
				}
				this.handleOutsideClick();
			},
			confirmFilter: function(filteredValue) {
				this.table.store.commit('filterChange', {
					column: this.column,
					values: filteredValue
				});
			}
		},
		data: function() {
			return {
				table: null,
				cell: null,
				column: null
			};
		},
		computed: {
			filters: function() {
				return this.column && this.column.filters;
			},
			filterValue: {
				get: function() {
					return (this.column.filteredValue || [])[0];
				},
				set: function(value) {
					if (this.filteredValue) {
						if ((typeof value !== 'undefined') && (value !== null)) {
							this.filteredValue.splice(0, 1, value);
						} else {
							this.filteredValue.splice(0, 1);
						}
					}
				}
			},
			filteredValue: {
				get: function() {
					if (this.column) {
						return this.column.filteredValue || [];
					}
					return [];
				},
				set: function(value) {
					if (this.column) {
						this.column.filteredValue = value;
					}
				}
			},
			multiple: function() {
				if (this.column) {
					return this.column.filterMultiple;
				}
				return true;
			}
		},
		mounted: function() {
			var self = this;
			self.popperElm = self.$el;
			self.referenceElm = self.cell;
			self.table.bodyWrapper.addEventListener('scroll', function() {
				self.updatePopper();
			});
			self.$watch('showPopper', function(value) {
				if (self.column)
					self.column.filterOpened = value;
				if (value) {
					Dropdown.open(self);
				} else {
					Dropdown.close(self);
				}
			});
		},
		watch: {
			showPopper: function(val) {
				if (val === true && parseInt(this.popperJS._popper.style.zIndex, 10) < VuePopup().PopupManager.zIndex) {
					this.popperJS._popper.style.zIndex = VuePopup().PopupManager.nextZIndex();
				}
			}
		}
	};
	var TableBody = {
		components: {
			VueCheckbox: VueCheckbox(),
			VueTooltip: VueTooltip()
		},
		props: {
			store: {
				required: true
			},
			context: {},
			layout: {
				required: true
			},
			rowClassName: [String, Function],
			rowStyle: [Object, Function],
			fixed: String,
			highlight: Boolean,
			expandClassName: [String, Function]
		},
		render: function(createElement) {
			var delta = this.$options.delta;
			var self = this;
			var columnsHidden = self.columns.map(function(column, index) {
				return self.isColumnHidden(index);
			});
			var selfData = scrollFilter(self.data ,delta);
			var paddingTop = delta.paddingTop
			 , allPadding = delta.allPadding;
			return createElement('table', {
				class: 'vue-table__body',
				attrs: {
					cellspacing: '0',
					cellpadding: '0',
					border: '0'
				},
				style: {'padding-top': paddingTop + 'px', 'padding-bottom': allPadding - paddingTop + 'px'}
			}, [createElement('colgroup', null, [self._l(self.columns, function(column) {
				return createElement('col', {
					attrs: {
						name: column.id,
						width: column.realWidth || column.width
					}
				}, [])
			})]), createElement('tbody', null, [self._l(selfData, function(row, $index) {
				$index = self.data.indexOf(row);
				return [createElement('tr', {
					style: self.rowStyle ? self.getRowStyle(row, $index) : null,
					key: self.table.rowKey ? self.getKeyOfRow(row, $index) : $index,
					on: {
						dblclick: function(e) {
							return self.handleDoubleClick(e, row)
						},
						click: function(e) {
							return self.handleClick(e, row)
						},
						contextmenu: function(e) {
							return self.handleContextMenu(e, row)
						},
						mouseenter: function(e) {
							return self.handleMouseEnter($index)
						},
						mouseleave: function(e) {
							return self.handleMouseLeave()
						}
					},
					class: [self.getRowClass(row, $index)]
				}, [self._l(self.columns, function(column, cellIndex) {
					return createElement('td', {
						class: [column.id, column.align, column.getCellClass($index, cellIndex, row) || '', columnsHidden[cellIndex] ? 'is-hidden' : ''],
						on: {
							mouseenter: function(e) {
								return self.handleCellMouseEnter(e, row)
							},
							mouseleave: self.handleCellMouseLeave
						}
					}, [column.renderCell.call(self._renderProxy, createElement, {
						row: row,
						column: column,
						$index: $index,
						store: self.store,
						_self: self.context || self.table.$vnode.context
					})])
				}), !self.fixed && self.layout.scrollY && self.layout.gutterWidth ? createElement('td', {
					class: 'gutter'
				}, []) : '']), self.store.states.expandRows.indexOf(row) > -1 ? createElement('tr', null, [createElement('td', {
					attrs: {
						colspan: self.columns.length
					},
					class: ['vue-table__expanded-cell', self.getExpandClass(row, $index)]
				}, [self.table.renderExpanded ? self.table.renderExpanded(createElement, {
					row: row,
					$index: $index,
					store: self.store
				}) : ''])]) : '']}).concat(self._self.$parent.$slots.append).concat(createElement('vue-tooltip', {attrs: {effect: self.table.tooltipEffect, placement: "top", content: self.tooltipContent}, ref: "tooltip"}, []))
			])]);
		},
		watch: {
			'store.states.hoverRow': function(newVal, oldVal) {
				if (!this.store.states.isComplex)
					return;
				var el = this.$el;
				if (!el)
					return;
				var rows = el.querySelectorAll('tbody > tr');
				var oldRow = rows[oldVal];
				var newRow = rows[newVal];
				if (oldRow) {
					oldRow.classList.remove('hover-row');
				}
				if (newRow) {
					newRow.classList.add('hover-row');
				}
			},
			'store.states.currentRow': function(newVal, oldVal) {
				var self = this;
				if (!self.highlight)
					return;
				var el = self.$el;
				if (!el)
					return;
				var data = self.store.states.data;
				if (self.$options.delta.keeps !== 0) {
					data = self.store.states.data.filter(function(data, index) {
						return index >= self.$options.delta.start && index <= self.$options.delta.end;
					});
				}
				var rows = el.querySelectorAll('tbody > tr');
				var oldRow = rows[data.indexOf(oldVal)];
				var newRow = rows[data.indexOf(newVal)];
				if (oldRow) {
					oldRow.classList.remove('current-row');
				} else if (rows) {
					[].forEach.call(rows, function(row) {
						row.classList.remove('current-row')
					});
				}
				if (newRow) {
					newRow.classList.add('current-row');
				}
			}
		},
		computed: {
			table: function() {
				return this.$parent;
			},
			data: function() {
				return this.store.states.data;
			},
			columnsCount: function() {
				return this.store.states.columns.length;
			},
			leftFixedCount: function() {
				return this.store.states.fixedColumns.length;
			},
			rightFixedCount: function() {
				return this.store.states.rightFixedColumns.length;
			},
			columns: function() {
				return this.store.states.columns;
			}
		},
		data: function() {
			return {
				tooltipContent: ''
			};
		},
		created: function() {
			this.activateTooltip = VueUtil.component.debounce(50, function(tooltip) {return tooltip.handleShowPopper();});
		},
		methods: {
			updateZone: function(offset) {
				var delta = this.$options.delta;
				var overs = Math.floor(offset / SIZE);
				if (!offset) {
					this.$emit('toTop');
				}
				var start = overs ? overs : 0;
				var end = overs ? (overs + delta.keeps) : delta.keeps;
				if (overs + REMAIN >= delta.total) {
					end = delta.total;
					start = delta.total - delta.keeps;
					this.$emit('toBottom');
				}
				delta.end = end;
				delta.start = start;
				this.$forceUpdate();
			},
			updateCurrentRowClass: function() {
				var self = this;
				if (!self.highlight)
					return;
				var el = self.$el;
				if (!el)
					return;
				var data = self.data.filter(function(data, index) {
					return index >= self.$options.delta.start && index <= self.$options.delta.end;
				});
				var rows = el.querySelectorAll('tbody > tr');
				var newRow = rows[data.indexOf(self.store.states.currentRow)];
				[].forEach.call(rows, function(row) {
					row.classList.remove('current-row');
					if (newRow && row === newRow) {
						row.classList.add('current-row');
					}
				});
			},
			getKeyOfRow: function(row, index) {
				var rowKey = this.table.rowKey;
				if (rowKey) {
					return getRowIdentity(row, rowKey);
				}
				return index;
			},
			isColumnHidden: function(index) {
				if (this.fixed === true || this.fixed === 'left') {
					return index >= this.leftFixedCount;
				} else if (this.fixed === 'right') {
					return index < this.columnsCount - this.rightFixedCount;
				} else {
					return (index < this.leftFixedCount) || (index >= this.columnsCount - this.rightFixedCount);
				}
			},
			getRowStyle: function(row, index) {
				var rowStyle = this.rowStyle;
				if (typeof rowStyle === 'function') {
					return rowStyle.call(null, row, index);
				}
				return rowStyle;
			},
			getRowClass: function(row, index) {
				var classes = [];
				var rowClassName = this.rowClassName;
				if (typeof rowClassName === 'string') {
					classes.push(rowClassName);
				} else if (typeof rowClassName === 'function') {
					classes.push(rowClassName.call(null, row, index) || '');
				}
				return classes.join(' ');
			},
			getExpandClass: function(row, index) {
				var classes = [];
				var expandClassName = this.expandClassName;
				if (typeof expandClassName === 'string') {
					classes.push(expandClassName);
				} else if (typeof expandClassName === 'function') {
					classes.push(expandClassName.call(null, row, index) || '');
				}
				return classes.join(' ');
			},
			handleCellMouseEnter: function(event, row) {
				var table = this.table;
				var cell = getCell(event);
				if (cell) {
					var column = getColumnByCell(table, cell);
					var hoverState = table.hoverState = {
						cell: cell,
						column: column,
						row: row
					};
					table.$emit('cell-mouse-enter', hoverState.row, hoverState.column, hoverState.cell, event);
				}
				var cellChild = event.target.querySelector('.cell');
				if (VueUtil.hasClass(cellChild, 'vue-tooltip') && cellChild.scrollWidth > cellChild.offsetWidth) {
					var tooltip = this.$refs.tooltip;
					this.tooltipContent = cell.innerText;
					tooltip.referenceElm = cell;
					tooltip.$refs.popper.style.display = 'none';
					tooltip.doDestroy();
					tooltip.setExpectedState(true);
					this.activateTooltip(tooltip);
				}
			},
			handleCellMouseLeave: function(event) {
				var tooltip = this.$refs.tooltip;
				if (tooltip) {
					tooltip.setExpectedState(false);
					tooltip.handleClosePopper();
				}
				var cell = getCell(event);
				if (!cell)
					return;
				var oldHoverState = this.table.hoverState;
				this.table.$emit('cell-mouse-leave', oldHoverState.row, oldHoverState.column, oldHoverState.cell, event);
			},
			handleMouseEnter: function(index) {
				this.store.commit('setHoverRow', index);
			},
			handleMouseLeave: function() {
				this.store.commit('setHoverRow', null);
			},
			handleContextMenu: function(event, row) {
				var table = this.table;
				table.$emit('row-contextmenu', row, event);
			},
			handleDoubleClick: function(event, row) {
				var table = this.table;
				table.$emit('row-dblclick', row, event);
			},
			handleClick: function(event, row) {
				var table = this.table;
				var cell = getCell(event);
				var column;
				if (cell) {
					column = getColumnByCell(table, cell);
					if (column) {
						table.$emit('cell-click', row, column, cell, event);
					}
				}
				this.store.commit('setCurrentRow', row);
				table.$emit('row-click', row, event, column);
			},
			handleExpandClick: function(row) {
				this.store.commit('toggleRowExpanded', row);
			}
		},
		delta: {
			start: 0,
			end: 0,
			total: 0,
			keeps: 0,
			allPadding: 0,
			paddingTop: 0
		},
		mounted: function() {
			var tableHeight = this.table.height;
			if (tableHeight) {
				var delta = this.$options.delta;
				var tdObj = this.$el.querySelector('td');
				SIZE = (tdObj && tdObj.offsetHeight) || 40;
				REMAIN = Math.round(tableHeight*1 / SIZE);
				delta.end = REMAIN;
				delta.keeps = REMAIN;
			}
		}
	};
	var TableHeader = {
		name: 'VueTableHeader',
		render: function(createElement) {
			var self = this;
			var originColumns = self.store.states.originColumns;
			var columnRows = convertToRows(originColumns);
			return createElement('table', {
				class: 'vue-table__header',
				attrs: {
					cellspacing: '0',
					cellpadding: '0',
					border: '0'
				}
			}, [createElement('colgroup', null, [self._l(self.columns, function(column) {
				return createElement('col', {
					attrs: {
						name: column.id,
						width: column.realWidth || column.width
					}
				}, [])
			}), !self.fixed && self.layout.gutterWidth ? createElement('col', {
				attrs: {
					name: 'gutter',
					width: self.layout.scrollY ? self.layout.gutterWidth : ''
				}
			}, []) : '']), createElement('thead', null, [self._l(columnRows, function(columns, rowIndex) {
				return createElement('tr', null, [self._l(columns, function(column, cellIndex) {
					return createElement('th', {
						attrs: {
							colspan: column.colSpan,
							rowspan: column.rowSpan
						},
						on: {
							mousemove: function(e) {
								return self.handleMouseMove(e, column)
							},
							mouseout: self.handleMouseOut,
							mousedown: function(e) {
								return self.handleMouseDown(e, column)
							},
							click: function(e) {
								return self.handleHeaderClick(e, column)
							}
						},
						class: [column.id, column.order, column.headerAlign, rowIndex === 0 && self.isCellHidden(cellIndex) ? 'is-hidden' : '', !column.children ? 'is-leaf' : '', column.labelClassName]
					}, [createElement('div', {
						class: ['cell', column.filteredValue && column.filteredValue.length > 0 ? 'highlight' : '', column.labelClassName]
					}, [column.renderHeader ? column.renderHeader.call(self._renderProxy, createElement, {
						column: column,
						$index: cellIndex,
						store: self.store,
						_self: self.$parent.$vnode.context
					}) : column.label, column.sortable ? createElement('span', {
						class: 'caret-wrapper',
						on: {
							click: function(e) {
								return self.handleSortClick(e, column);
							}
						}
					}, [createElement('i', {
						class: 'sort-caret ascending',
						on: {
							click: function(e) {
								return self.handleSortClick(e, column, 'ascending');
							}
						}
					}, []), createElement('i', {
						class: 'sort-caret descending',
						on: {
							click: function(e) {
								return self.handleSortClick(e, column, 'descending');
							}
						}
					}, [])]) : '', column.filterable ? createElement('span', {
						class: 'vue-table__column-filter-trigger',
						on: {
							click: function(e) {
								return self.handleFilterClick(e, column)
							}
						}
					}, [createElement('i', {
						class: ['vue-icon-arrow-down', column.filterOpened ? 'vue-icon-arrow-up' : '']
					}, [])]) : ''])])
				}), !self.fixed && self.layout.gutterWidth ? createElement('th', {
					class: 'gutter',
					style: {
						width: self.layout.scrollX ? self.layout.gutterWidth + 'px' : 0
					}
				}, []) : ''])
			})])]);
		},
		props: {
			fixed: String,
			store: {
				required: true
			},
			layout: {
				required: true
			},
			border: Boolean,
			defaultSort: {
				type: Object,
				default: function() {
					return {
						prop: '',
						order: ''
					};
				}
			}
		},
		components: {
			VueCheckbox: VueCheckbox(),
			VueTag: VueTag()
		},
		computed: {
			isAllSelected: function() {
				return this.store.states.isAllSelected;
			},
			columnsCount: function() {
				return this.store.states.columns.length;
			},
			leftFixedCount: function() {
				return this.store.states.fixedColumns.length;
			},
			rightFixedCount: function() {
				return this.store.states.rightFixedColumns.length;
			},
			columns: function() {
				return this.store.states.columns;
			}
		},
		created: function() {
			this.filterPanels = {};
		},
		mounted: function() {
			if (this.defaultSort.prop) {
				var states = this.store.states;
				states.sortProp = this.defaultSort.prop;
				states.sortOrder = this.defaultSort.order || 'ascending';
				this.$nextTick(function() {
					for (var i = 0, length = this.columns.length; i < length; i++) {
						var column = this.columns[i];
						if (column.property === states.sortProp) {
							column.order = states.sortOrder;
							states.sortingColumn = column;
							break;
						}
					}
					if (states.sortingColumn) {
						this.store.commit('changeSortCondition');
					}
				});
			}
		},
		beforeDestroy: function() {
			var panels = this.filterPanels;
			for (var prop in panels) {
				if (panels.hasOwnProperty(prop) && panels[prop]) {
					panels[prop].$destroy(true);
				}
			}
		},
		methods: {
			isCellHidden: function(index) {
				if (this.fixed === true || this.fixed === 'left') {
					return index >= this.leftFixedCount;
				} else if (this.fixed === 'right') {
					return index < this.columnsCount - this.rightFixedCount;
				} else {
					return (index < this.leftFixedCount) || (index >= this.columnsCount - this.rightFixedCount);
				}
			},
			toggleAllSelection: function() {
				this.store.commit('toggleAllSelection');
			},
			handleFilterClick: function(event, column) {
				event.stopPropagation();
				var target = event.target;
				var cell = target.parentNode;
				var table = this.$parent;
				var filterPanel = this.filterPanels[column.id];
				if (filterPanel && column.filterOpened) {
					filterPanel.showPopper = false;
					return;
				}
				if (!filterPanel) {
					filterPanel = new Vue(VueTableFilterPanel);
					this.filterPanels[column.id] = filterPanel;
					if (column.filterPlacement) {
						filterPanel.placement = column.filterPlacement;
					}
					filterPanel.table = table;
					filterPanel.cell = cell;
					filterPanel.column = column;
					!this.$isServer && filterPanel.$mount(document.createElement('div'));
				}
				setTimeout(function() {
					filterPanel.showPopper = true;
				}, 16);
			},
			handleHeaderClick: function(event, column) {
				if (!column.filters && column.sortable) {
					this.handleSortClick(event, column);
				} else if (column.filters && !column.sortable) {
					this.handleFilterClick(event, column);
				}
				this.$parent.$emit('header-click', column, event);
			},
			handleMouseDown: function(event, column) {
				var self = this;
				if (self.$isServer)
					return;
				if (column.children && column.children.length > 0)
					return;
				if (self.draggingColumn && self.border) {
					self.dragging = true;
					self.$parent.resizeProxyVisible = true;
					var tableEl = self.$parent.$el;
					var tableLeft = tableEl.getBoundingClientRect().left;
					var columnEl = self.$el.querySelector('th.' + column.id);
					var columnRect = columnEl.getBoundingClientRect();
					var minLeft = columnRect.left - tableLeft + 30;
					columnEl.classList.add('noclick');
					self.dragState = {
						startMouseLeft: event.clientX,
						startLeft: columnRect.right - tableLeft,
						startColumnLeft: columnRect.left - tableLeft,
						tableLeft: tableLeft
					};
					var resizeProxy = self.$parent.$refs.resizeProxy;
					resizeProxy.style.left = self.dragState.startLeft + 'px';
					document.onselectstart = function() {
						return false;
					}
					document.ondragstart = function() {
						return false;
					}
					var handleMouseMove = function(event) {
						var deltaLeft = event.clientX - self.dragState.startMouseLeft;
						var proxyLeft = self.dragState.startLeft + deltaLeft;
						resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px';
					};
					var handleMouseUp = function() {
						if (self.dragging) {
							var finalLeft = parseInt(resizeProxy.style.left, 10);
							var columnWidth = finalLeft - self.dragState.startColumnLeft;
							column.width = column.realWidth = columnWidth;
							self.store.scheduleLayout();
							document.body.style.cursor = '';
							self.dragging = false;
							self.draggingColumn = null;
							self.dragState = {};
							self.$parent.resizeProxyVisible = false;
						}
						document.removeEventListener('mousemove', handleMouseMove);
						document.removeEventListener('mouseup', handleMouseUp);
						document.onselectstart = null;
						document.ondragstart = null;
						setTimeout(function() {
							columnEl.classList.remove('noclick');
						}, 0);
					};
					document.addEventListener('mousemove', handleMouseMove);
					document.addEventListener('mouseup', handleMouseUp);
				}
			},
			handleMouseMove: function(event, column) {
				if (column.children && column.children.length > 0)
					return;
				var target = event.target;
				while (target && target.tagName !== 'TH') {
					target = target.parentNode;
				}
				if (!column || !column.resizable)
					return;
				if (!this.dragging && this.border) {
					var rect = target.getBoundingClientRect();
					var bodyStyle = document.body.style;
					if (rect.width > 12 && rect.right - event.pageX < 8) {
						bodyStyle.cursor = 'col-resize';
						this.draggingColumn = column;
					} else if (!this.dragging) {
						bodyStyle.cursor = '';
						this.draggingColumn = null;
					}
				}
			},
			handleMouseOut: function() {
				if (this.$isServer)
					return;
				document.body.style.cursor = '';
			},
			toggleOrder: function(order) {
				return !order ? 'ascending' : order === 'ascending' ? 'descending' : null;
			},
			handleSortClick: function(event, column, givenOrder) {
				event.stopPropagation();
				var order = givenOrder || this.toggleOrder(column.order);
				var target = event.target;
				while (target && target.tagName !== 'TH') {
					target = target.parentNode;
				}
				if (target && target.tagName === 'TH') {
					if (target.classList.contains('noclick')) {
						target.classList.remove('noclick');
						return;
					}
				}
				if (!column.sortable)
					return;
				var states = this.store.states;
				var sortProp = states.sortProp;
				var sortOrder;
				var sortingColumn = states.sortingColumn;
				if (sortingColumn !== column) {
					if (sortingColumn) {
						sortingColumn.order = null;
					}
					states.sortingColumn = column;
					sortProp = column.property;
				}
				if (column.order === order) {
					sortOrder = column.order = null;
					states.sortingColumn = null;
					sortProp = null;
				} else {
					sortOrder = column.order = order;
				}
				states.sortProp = sortProp;
				states.sortOrder = sortOrder;
				this.store.commit('changeSortCondition');
			}
		},
		data: function() {
			return {
				draggingColumn: null,
				dragging: false,
				dragState: {}
			};
		}
	};
	var TableFooter = {
		name: 'VueTableFooter',
		render: function(createElement) {
			var self = this;
			var sums = [];
			self.columns.forEach(function(column, index) {
				if (index === 0) {
					sums[index] = self.sumText;
					return;
				}
				var values = self.store.states.data.map(function(item) {return Number(item[column.property])});
				var precisions = [];
				var notNumber = true;
				values.forEach(function(value) {
					if (!isNaN(value)) {
						notNumber = false;
						var decimal = ('' + value).split('.')[1];
						precisions.push(decimal ? decimal.length : 0);
					}
				});
				var precision = Math.max.apply(null, precisions);
				if (!notNumber) {
					sums[index] = values.reduce(function(prev, curr) {
						var value = Number(curr);
						if (!isNaN(value)) {
							return parseFloat((prev + curr).toFixed(precision));
						} else {
							return prev;
						}
					}, 0);
				} else {
					sums[index] = '';
				}
			});
			return createElement('table',
			{
				class: 'vue-table__footer',
				attrs: { cellspacing: '0', cellpadding: '0', border: '0' }
			}, [
				createElement('colgroup',
					null,
					[
						self._l(self.columns, function(column) {
							return createElement('col', {attrs: {name: column.id, width: column.realWidth || column.width}}, []);
						}),
						!self.fixed && self.layout.gutterWidth ? createElement('col', {attrs: {name: 'gutter', width: self.layout.scrollY ? self.layout.gutterWidth : '' }}, []) : ''
					]
				),
				createElement('tbody',
					null,
					[
						createElement('tr',
							null,
							[
								self._l(self.columns, function(column, cellIndex) {
									return createElement('td',
										{
											attrs: {colspan: column.colSpan, rowspan: column.rowSpan},
											class: [column.id, column.align, column.className || '', self.isCellHidden(cellIndex, self.columns) ? 'is-hidden' : '', !column.children ? 'is-leaf' : '', column.labelClassName]
										},
										[
											createElement('div',
												{class: ['cell', column.labelClassName]},
												[self.summaryMethod ? self.summaryMethod({columns: self.columns, data: self.store.states.data})[cellIndex] : sums[cellIndex]]
											)
										]
									)
								}),
								!self.fixed && self.layout.gutterWidth ? createElement('td',	{class: 'gutter', style: { width: self.layout.scrollY ? self.layout.gutterWidth + 'px' : '0' }}, []) : ''
							]
						)
					]
				)
			]);
		},
		props: {
			fixed: String,
			store: {
				required: true
			},
			layout: {
				required: true
			},
			summaryMethod: Function,
			sumText: String,
			border: Boolean,
			defaultSort: {
				type: Object,
				default: function() {
					return {
						prop: '',
						order: ''
					};
				}
			}
		},
		computed: {
			isAllSelected: function() {
				return this.store.states.isAllSelected;
			},
			columnsCount: function() {
				return this.store.states.columns.length;
			},
			leftFixedCount: function() {
				return this.store.states.fixedColumns.length;
			},
			rightFixedCount: function() {
				return this.store.states.rightFixedColumns.length;
			},
			columns: function() {
				return this.store.states.columns;
			}
		},
		methods: {
			isCellHidden: function(index, columns) {
				if (this.fixed === true || this.fixed === 'left') {
					return index >= this.leftFixedCount;
				} else if (this.fixed === 'right') {
					var before = 0;
					for (var i = 0; i < index; i++) {
						before += columns[i].colSpan;
					}
					return before < this.columnsCount - this.rightFixedCount;
				} else {
					return (index < this.leftFixedCount) || (index >= this.columnsCount - this.rightFixedCount);
				}
			}
		}
	};
	var VueTable = {
		template: '<div class="vue-table":class="{ \'vue-table--fit\': fit, \'vue-table--striped\': stripe, \'vue-table--border\': border, \'vue-table--enable-row-hover\': !store.states.isComplex, \'vue-table--enable-row-transition\': true || (store.states.data || []).length !== 0 && (store.states.data || []).length < 100}" @mouseleave="handleMouseLeave($event)" :style="[tableWidth]"><div class="hidden-columns" ref="hiddenColumns"><slot></slot></div><div class="vue-table__header-wrapper" ref="headerWrapper" v-if="showHeader"><table-header :store="store" :layout="layout" :border="border" :default-sort="defaultSort" :style="{ width: layout.bodyWidth ? layout.bodyWidth + \'px\' : \'\' }"></table-header></div><div class="vue-table__body-wrapper" ref="bodyWrapper" :style="[wrapperWidth, bodyHeight]"> <table-body :context="context" :store="store" :layout="layout" :expand-class-name="expandClassName" :row-class-name="rowClassName" :row-style="rowStyle" :highlight="highlightCurrentRow" :style="{ width: bodyWidth }"></table-body><div :style="{ width: bodyWidth }" class="vue-table__empty-block" v-if="!data || data.length === 0"><span class="vue-table__empty-text"><slot name="empty">{{ emptyText || $t(\'vue.table.emptyText\') }}</slot></span></div></div><div class="vue-table__footer-wrapper" ref="footerWrapper" v-if="showSummary && data && data.length > 0"><table-footer :store="store" :layout="layout" :border="border" :sum-text="sumText || $t(\'vue.table.sumText\')" :summary-method="summaryMethod" :default-sort="defaultSort" :style="{ width: layout.bodyWidth ? layout.bodyWidth + \'px\' : \'\' }"></table-footer></div><div class="vue-table__fixed" ref="fixedWrapper" v-if="fixedColumns.length > 0" :style="[ { width: layout.fixedWidth ? layout.fixedWidth + \'px\' : \'\' }, fixedHeight ]"><div class="vue-table__fixed-header-wrapper" ref="fixedHeaderWrapper" v-if="showHeader"><table-header fixed="left" :border="border" :store="store" :layout="layout" :style="{ width: layout.fixedWidth ? layout.fixedWidth + \'px\' : \'\' }"></table-header></div><div class="vue-table__fixed-body-wrapper" ref="fixedBodyWrapper" :style="[ { top: layout.headerHeight + \'px\' }, fixedBodyHeight ]"><table-body fixed="left" :store="store" :layout="layout" :highlight="highlightCurrentRow" :row-class-name="rowClassName" :row-style="rowStyle" :style="{ width: layout.fixedWidth ? layout.fixedWidth + \'px\' : \'\' }"></table-body></div><div class="vue-table__fixed-footer-wrapper" ref="fixedFooterWrapper" v-if="showSummary && data && data.length > 0"><table-footer fixed="left" :border="border" :sum-text="sumText || $t(\'vue.table.sumText\')" :summary-method="summaryMethod" :store="store" :layout="layout" :style="{ width: layout.fixedWidth ? layout.fixedWidth + \'px\' : \'\' }"></table-footer></div></div><div class="vue-table__fixed-right" ref="rightFixedWrapper" v-if="rightFixedColumns.length > 0" :style="[ { width: layout.rightFixedWidth ? layout.rightFixedWidth + \'px\' : \'\' }, { right: layout.scrollY ? (border ? layout.gutterWidth : (layout.gutterWidth || 1)) + \'px\' : \'\' }, fixedHeight ]"><div class="vue-table__fixed-header-wrapper" ref="rightFixedHeaderWrapper" v-if="showHeader"><table-header fixed="right" :border="border" :store="store" :layout="layout" :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + \'px\' : \'\' }"></table-header></div><div class="vue-table__fixed-body-wrapper" ref="rightFixedBodyWrapper" :style="[ { top: layout.headerHeight + \'px\' }, fixedBodyHeight]"><table-body fixed="right" :store="store" :layout="layout" :row-class-name="rowClassName" :row-style="rowStyle" :highlight="highlightCurrentRow" :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + \'px\' : \'\' }"></table-body></div><div class="vue-table__fixed-footer-wrapper" ref="rightFixedFooterWrapper" v-if="showSummary && data && data.length > 0"><table-footer fixed="right" :border="border" :sum-text="sumText || $t(\'vue.table.sumText\')" :summary-method="summaryMethod" :store="store" :layout="layout" :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + \'px\' : \'\' }"></table-footer></div></div><div class="vue-table__fixed-right-patch" v-if="rightFixedColumns.length > 0" :style="{ width: layout.scrollY ? layout.gutterWidth + \'px\' : \'0\', height: layout.headerHeight + \'px\' }"></div><div class="vue-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div></div>',
		name: 'VueTable',
		props: {
			data: {
				type: Array,
				default: function() {
					return [];
				}
			},
			height: [String, Number],
			fit: {
				type: Boolean,
				default: true
			},
			stripe: Boolean,
			border: Boolean,
			rowKey: [String, Function],
			context: {},
			showHeader: {
				type: Boolean,
				default: true
			},
			showSummary: {
				type: Boolean,
				default: false
			},
			sumText: String,
			summaryMethod: Function,
			rowClassName: [String, Function],
			rowStyle: [Object, Function],
			highlightCurrentRow: Boolean,
			currentRowKey: [String, Number],
			emptyText: String,
			expandRowKeys: Array,
			defaultExpandAll: Boolean,
			defaultSort: Object,
			expandClassName: [String, Function]
		},
		components: {
			TableHeader: TableHeader,
			TableBody: TableBody,
			TableFooter: TableFooter,
			VueCheckbox: VueCheckbox()
		},
		methods: {
			setCurrentRow: function(row) {
				this.store.commit('setCurrentRow', row);
			},
			toggleRowSelection: function(row, selected) {
				this.store.toggleRowSelection(row, selected);
				this.store.updateAllSelected();
			},
			clearSelection: function() {
				this.store.clearSelection();
			},
			handleMouseLeave: function() {
				this.store.commit('setHoverRow', null);
				if (this.hoverState)
					this.hoverState = null;
			},
			updateScrollY: function() {
				this.layout.updateScrollY();
			},
			bindEvents: function() {
				var self = this;
				var refs = self.$refs;
				var headerWrapper = refs.headerWrapper,
					footerWrapper = refs.footerWrapper;
				self.bodyWrapper.addEventListener('scroll', function() {
					var scrollLeft = this.scrollLeft;
					var scrollTop = this.scrollTop;
					if (bodyScrollLeft !== scrollLeft) {
						if (headerWrapper) headerWrapper.scrollLeft = scrollLeft;
						if (footerWrapper) footerWrapper.scrollLeft = scrollLeft;
						bodyScrollLeft = scrollLeft;
					}
					if (bodyScrollTop !== scrollTop) {
						self.$children.forEach(function(child){
							if (child.updateZone && child.$options.delta.keeps !== 0) {
								child.updateZone(scrollTop);
								child.updateCurrentRowClass();
							}
						});
						if (refs.fixedBodyWrapper) refs.fixedBodyWrapper.scrollTop = scrollTop;
						if (refs.rightFixedBodyWrapper) refs.rightFixedBodyWrapper.scrollTop = scrollTop;
						bodyScrollTop = scrollTop;
					}
				});
				if (headerWrapper) {
					mousewheel(headerWrapper, VueUtil.component.throttle(16, function(event) {
						var deltaX = event.deltaX;
						if (deltaX > 0) {
							self.bodyWrapper.scrollLeft += 10;
						} else {
							self.bodyWrapper.scrollLeft -= 10;
						}
					}));
				}
				if (self.fit) {
					self.windowResizeListener = VueUtil.component.throttle(50, function() {
						if (self.$ready)
							self.doLayout();
					});
					VueUtil.addResizeListener(self.$el, self.windowResizeListener);
				}
			},
			resizeZone: function() {
				var scrollTop = this.bodyWrapper.scrollTop;
				this.$children.forEach(function(child){
					if (child.updateZone && child.$options.delta.keeps !== 0) {
						child.updateZone(scrollTop);
						child.updateCurrentRowClass();
					}
				});
			},
			doLayout: function() {
				var self = this;
				self.store.updateColumns();
				self.layout.update();
				self.updateScrollY();
				self.$nextTick(function() {
					if (self.height) {
						self.layout.setHeight(self.height);
					} else if (self.shouldUpdateHeight) {
						self.layout.updateHeight();
					}
				});
			}
		},
		created: function() {
			var self = this;
			self.tableId = 'vue-table_1_';
			self.debouncedLayout = VueUtil.component.debounce(50, function() {
				self.doLayout()
			});
		},
		computed: {
			bodyWrapper: function() {
				return this.$refs.bodyWrapper;
			},
			shouldUpdateHeight: function() {
				return typeof this.height === 'number' || this.fixedColumns.length > 0 || this.rightFixedColumns.length > 0;
			},
			selection: function() {
				return this.store.selection;
			},
			columns: function() {
				return this.store.states.columns;
			},
			tableData: function() {
				return this.store.states.data;
			},
			fixedColumns: function() {
				return this.store.states.fixedColumns;
			},
			rightFixedColumns: function() {
				return this.store.states.rightFixedColumns;
			},
			bodyHeight: function() {
				var style = {};
				if (this.height) {
					style = {
						height: this.layout.bodyHeight ? this.layout.bodyHeight + 'px' : ''
					};
				}
				return style;
			},
			bodyWidth: function() {
				var layout = this.layout;
				return layout.bodyWidth ? layout.bodyWidth - (layout.scrollY ? layout.gutterWidth : 0) + 'px' : '';
			},
			tableWidth: function() {
				var layout = this.layout;
				return {width: layout.bodyWidth ? layout.bodyWidth + (layout.scrollY ? layout.gutterWidth : 0) + 2 + 'px' : ''};
			},
			wrapperWidth: function() {
				var layout = this.layout;
				if (this.$el && parseInt(this.$el.style.width) < layout.bodyWidth + layout.gutterWidth) return '';
				var colLen = this.columns.length;
				if (colLen> 0 && this.columns[colLen-1].fixed === 'right') return '';
				if (colLen > 0 && this.columns[colLen-1].width) {
					return {width: layout.bodyWidth ? layout.bodyWidth + (layout.scrollY ? layout.gutterWidth : 0) + 'px' : ''};
				} else {
					return {width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''};
				}
			},
			fixedBodyHeight: function() {
				var style = {};
				var layout = this.layout;
				if (this.height) {
					style = {
						height: layout.fixedBodyHeight ? layout.fixedBodyHeight + 'px' : ''
					};
				}
				return style;
			},
			fixedHeight: function() {
				var style = {};
				var layout = this.layout;
				style = {
					height: layout.viewportHeight ? layout.viewportHeight + 'px' : ''
				};
				return style;
			}
		},
		watch: {
			height: function(value) {
				this.layout.setHeight(value);
			},
			currentRowKey: function(newVal) {
				this.store.setCurrentRowKey(newVal);
			},
			data: {
				immediate: true,
				handler: function(val) {
					this.store.commit('setData', val);
				}
			},
			expandRowKeys: function(newVal) {
				this.store.setExpandRowKeys(newVal);
			}
		},
		destroyed: function() {
			if (this.windowResizeListener)
				VueUtil.removeResizeListener(this.$el, this.windowResizeListener);
		},
		mounted: function() {
			var self = this;
			self.bindEvents();
			self.doLayout();
			self.store.states.columns.forEach(function(column) {
				if (column.filteredValue && column.filteredValue.length) {
					self.store.commit('filterChange', {
						column: cloumn,
						values: column.filteredValue,
						silent: true
					});
				}
			});
			self.$ready = true;
			self.doLayout();
		},
		data: function() {
			var self = this;
			var store = new TableStore(self,{
				rowKey: self.rowKey,
				defaultExpandAll: self.defaultExpandAll
			});
			var layout = new TableLayout({
				store: store,
				table: self,
				fit: self.fit,
				showHeader: self.showHeader
			});
			return {
				store: store,
				layout: layout,
				renderExpanded: null,
				resizeProxyVisible: false
			};
		}
	};
	Vue.component(VueTable.name, VueTable);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
	}
})('VueOption', this, function(Vue, VueUtil) {
	'use strict';
	var VueOption = {
		template: '<li @mouseenter="hoverItem" @click.stop="selectOptionClick" class="vue-select-dropdown__item" v-show="visible" :class="{\'selected\': itemSelected, \'is-disabled\': disabled || groupDisabled || limitReached}"><slot><span>{{ currentLabel }}</span></slot></li>',
		name: 'VueOption',
		componentName: 'VueOption',
		mixins: [VueUtil.component.emitter],
		props: {
			value: {
				required: true
			},
			label: [String, Number],
			selected: {
				type: Boolean,
				default: false
			},
			created: Boolean,
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data: function() {
			return {
				index: -1,
				groupDisabled: false,
				visible: true,
				hitState: false
			};
		},
		computed: {
			currentLabel: function() {
				return this.label || ((typeof this.value === 'string' || typeof this.value === 'number') ? this.value : '');
			},
			currentValue: function() {
				return this.value || this.label || '';
			},
			parent: function() {
				var result = this.$parent;
				while (!result.isSelect) {
					result = result.$parent;
				}
				return result;
			},
			itemSelected: function() {
				if (!this.parent.multiple) {
					return this.value === this.parent.value;
				} else {
					return this.parent.value.indexOf(this.value) > -1;
				}
			},
			limitReached: function() {
				if (this.parent.multiple) {
					return !this.itemSelected && this.parent.value.length >= this.parent.multipleLimit && this.parent.multipleLimit > 0;
				} else {
					return false;
				}
			}
		},
		watch: {
			currentLabel: function() {
				if (!this.created && !this.parent.remote)
					this.dispatch('VueSelect', 'setSelected');
			},
			value: function() {
				if (!this.created && !this.parent.remote)
					this.dispatch('VueSelect', 'setSelected');
			}
		},
		methods: {
			handleGroupDisabled: function(val) {
				this.groupDisabled = val;
			},
			hoverItem: function() {
				if (!this.disabled && !this.groupDisabled) {
					this.parent.hoverIndex = this.parent.options.indexOf(this);
				}
			},
			selectOptionClick: function() {
				if (this.disabled !== true && this.groupDisabled !== true) {
					this.dispatch('VueSelect', 'handleOptionClick', this);
				}
			},
			queryChange: function(query) {
				var parsedQuery = String(query).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
				this.visible = new RegExp(parsedQuery,'i').test(this.currentLabel) || this.created;
				if (!this.visible) {
					this.parent.filteredOptionsCount--;
				}
			},
			resetIndex: function() {
				var self = this;
				self.$nextTick(function() {
					self.index = self.parent.options.indexOf(self);
				});
			}
		},
		created: function() {
			this.parent.options.push(this);
			this.parent.cachedOptions.push(this);
			this.parent.optionsCount++;
			this.parent.filteredOptionsCount++;
			this.index = this.parent.options.indexOf(this);
			this.$on('queryChange', this.queryChange);
			this.$on('handleGroupDisabled', this.handleGroupDisabled);
			this.$on('resetIndex', this.resetIndex);
		},
		beforeDestroy: function() {
			this.dispatch('VueSelect', 'onOptionDestroy', this);
		}
	};
	Vue.component(VueOption.name, VueOption);
	return function() {
		return VueOption;
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueOptionGroup', this, function(Vue, VueUtil) {
	'use strict';
	var VueOptionGroup = {
		template: '<ul class="vue-select-group__wrap"><li class="vue-select-group__title" v-show="visible">{{ label }}</li><li><ul class="vue-select-group"><slot></slot></ul></li></ul>',
		name: 'VueOptionGroup',
		componentName: 'VueOptionGroup',
		mixins: [VueUtil.component.emitter],
		props: {
			label: String,
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data: function() {
			return {
				visible: true
			};
		},
		watch: {
			disabled: function(val) {
				this.broadcast('VueOption', 'handleGroupDisabled', val);
			}
		},
		methods: {
			queryChange: function() {
				this.visible = this.$children && Array.isArray(this.$children) && this.$children.some(function(option) {
					return option.visible === true;
				});
			}
		},
		created: function() {
			this.$on('queryChange', this.queryChange);
		},
		mounted: function() {
			if (this.disabled) {
				this.broadcast('VueOption', 'handleGroupDisabled', this.disabled);
			}
		}
	};
	Vue.component(VueOptionGroup.name, VueOptionGroup);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePopper'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePopper']);
	}
})('VueSelectDropdown', this, function(Vue, VuePopper) {
	'use strict';
	var VueSelectDropdown = {
		template: '<div class="vue-select-dropdown" :class="[{ \'is-multiple\': $parent.multiple }, popperClass]" :style="{ minWidth: minWidth }"><slot></slot></div>',
		name: 'VueSelectDropdown',
		componentName: 'VueSelectDropdown',
		mixins: [VuePopper()],
		props: {
			placement: {
				default: 'bottom-start'
			},
			boundariesPadding: {
				default: 0
			},
			options: {
				default: function() {
					return {
						forceAbsolute: true,
						gpuAcceleration: false
					};
				}
			}
		},
		data: function() {
			return {
				minWidth: ''
			};
		},
		computed: {
			popperClass: function() {
				return this.$parent.popperClass;
			}
		},
		watch: {
			'$parent.inputWidth': function() {
				this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
			}
		},
		mounted: function() {
			this.referenceElm = this.$parent.$refs.reference.$el;
			this.$parent.popperElm = this.popperElm = this.$el;
			this.$on('updatePopper', this.updatePopper);
			this.$on('destroyPopper', this.destroyPopper);
		}
	};
	Vue.component(VueSelectDropdown.name, VueSelectDropdown);
	return function() {
		return VueSelectDropdown;
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VueInput', 'VueSelectDropdown', 'VueOption', 'VueTag'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VueInput'], context['VueSelectDropdown'], context['VueOption'], context['VueTag']);
	}
})('VueSelect', this, function(Vue, VueUtil, VueInput, VueSelectDropdown, VueOption, VueTag) {
	'use strict';
	var sizeMap = {
		'large': 42,
		'small': 30,
		'mini': 22
	};
	var VueSelect = {
		template: '<div class="vue-select" v-clickoutside="handleClose"><div class="vue-select__tags" v-if="multiple" @click.stop="toggleMenu" ref="tags" :style="{ \'max-width\': inputWidth - 32 + \'px\' }"><transition-group @after-leave="resetInputHeight"><vue-tag v-for="item in selected" :key="item.value" closable :hit="item.hitState" type="primary" @close="deleteTag($event, item)" close-transition><span class="vue-select__tags-text">{{ item.currentLabel }}</span></vue-tag></transition-group><input type="text" class="vue-select__input" :class="\'is-\'+size" @focus="visible = true" :disabled="disabled" @keyup="managePlaceholder" @keydown="resetInputState" @keydown.down.prevent="navigateOptions(\'next\')" @keydown.up.prevent="navigateOptions(\'prev\')" @keydown.enter.prevent="selectOption" @keydown.esc.prevent="visible = false" @keydown.delete="deletePrevTag" v-model="query" :debounce="remote ? 300 : 0" v-if="filterable" :style="{ width: inputLength + \'px\', \'max-width\': inputWidth - 42 + \'px\' }" ref="input"></div><vue-input ref="reference" v-model="selectedLabel" type="text" :placeholder="placeholderLang" :name="name" :size="size" :disabled="disabled" :readonly="!filterable || multiple" :validate-event="false" @focus="handleFocus" @click="handleIconClick" @mousedown.native="handleMouseDown" @keyup.native="debouncedOnInputChange" @keydown.native.down.prevent="navigateOptions(\'next\')" @keydown.native.up.prevent="navigateOptions(\'prev\')" @keydown.native.enter.prevent="selectOption" @keydown.native.esc.prevent="visible = false" @keydown.native.tab="visible = false" @paste.native="debouncedOnInputChange" @mouseenter.native="inputHovering = true" @mouseleave.native="inputHovering = false" :icon="iconClass"></vue-input><transition name="vue-zoom-in-top" @after-leave="doDestroy" @after-enter="handleMenuEnter"><vue-select-menu ref="popper" v-show="visible && emptyText !== false"><ul class="vue-select-dropdown__list" :class="{ \'is-empty\': !allowCreate && filteredOptionsCount === 0 }" v-show="options.length > 0 && !loading"><vue-option :value="query" created v-if="showNewOption"></vue-option><slot></slot></ul><p class="vue-select-dropdown__empty" v-if="emptyText && !allowCreate">{{ emptyText }}</p></vue-select-menu></transition></div>',
		mixins: [VueUtil.component.emitter],
		name: 'VueSelect',
		componentName: 'VueSelect',
		computed: {
			iconClass: function() {
				var criteria = this.clearable && !this.disabled && this.inputHovering && !this.multiple && this.value !== undefined && this.value !== '';
				return criteria ? 'vue-icon-circle-close is-show-close' : (this.remote && this.filterable ? '' : 'vue-icon-caret-top');
			},
			debounce: function() {
				return this.remote ? 300 : 0;
			},
			emptyText: function() {
				if (this.loading) {
					return this.loadingText || this.$t('vue.select.loading');
				} else {
					if (this.remote && this.query === '' && this.options.length === 0)
						return false;
					if (this.filterable && this.options.length > 0 && this.filteredOptionsCount === 0) {
						return this.noMatchText || this.$t('vue.select.noMatch');
					}
					if (this.options.length === 0) {
						return this.noDataText || this.$t('vue.select.noData');
					}
				}
				return null;
			},
			showNewOption: function() {
				var self = this;
				var hasExistingOption = self.options.filter(function(option) {
					return !option.created;
				}).some(function(option) {
					return option.currentLabel === self.query;
				});
				return self.filterable && self.allowCreate && self.query !== '' && !hasExistingOption;
			},
			placeholderLang: function() {
				if (this.multiple)
					return this.currentPlaceholder;
				if (!this.placeholder)
					return this.$t('vue.select.placeholder');
				return this.placeholder;
			}
		},
		components: {
			VueInput: VueInput(),
			VueSelectMenu: VueSelectDropdown(),
			VueOption: VueOption(),
			VueTag: VueTag()
		},
		directives: {
			Clickoutside: VueUtil.component.clickoutside()
		},
		props: {
			name: String,
			value: {required: true},
			size: String,
			disabled: Boolean,
			clearable: Boolean,
			filterable: Boolean,
			allowCreate: Boolean,
			loading: Boolean,
			popperClass: String,
			remote: Boolean,
			loadingText: String,
			noMatchText: String,
			noDataText: String,
			remoteMethod: Function,
			filterMethod: Function,
			multiple: Boolean,
			multipleLimit: {
				type: Number,
				default: 0
			},
			placeholder: String
		},
		data: function() {
			return {
				options: [],
				cachedOptions: [],
				createdLabel: null,
				createdSelected: false,
				selected: this.multiple ? [] : {},
				isSelect: true,
				inputLength: 20,
				inputWidth: 0,
				cachedPlaceHolder: '',
				optionsCount: 0,
				filteredOptionsCount: 0,
				dropdownUl: null,
				visible: false,
				selectedLabel: '',
				hoverIndex: -1,
				query: '',
				bottomOverflowBeforeHidden: 0,
				topOverflowBeforeHidden: 0,
				optionsAllDisabled: false,
				inputHovering: false,
				currentPlaceholder: ''
			};
		},
		watch: {
			placeholder: function(val) {
				if (val.replace(/^\s+|\s+$/g, "") === "") {
					this.currentPlaceholder = this.$t('vue.select.placeholder');
				} else {
					this.currentPlaceholder = val;
				}
			},
			value: function(val) {
				if (this.multiple) {
					this.resetInputHeight();
					if (val.length > 0 || (this.$refs.input && this.query !== '')) {
						this.currentPlaceholder = '';
					} else {
						this.currentPlaceholder = this.cachedPlaceHolder;
					}
				}
				this.setSelected();
				if (this.filterable && !this.multiple) {
					this.inputLength = 20;
				}
				this.$emit('change', val);
				this.dispatch('VueFormItem', 'vue.form.change', val);
			},
			query: function(val) {
				var self = this;
				self.$nextTick(function() {
					self.broadcast('VueSelectDropdown', 'updatePopper');
				});
				self.hoverIndex = -1;
				if (self.multiple && self.filterable) {
					self.resetInputHeight();
				}
				if (self.remote && typeof self.remoteMethod === 'function') {
					self.hoverIndex = -1;
					self.remoteMethod(val);
					self.broadcast('VueOption', 'resetIndex');
				} else if (typeof self.filterMethod === 'function') {
					self.filterMethod(val);
					self.broadcast('VueOptionGroup', 'queryChange');
				} else {
					self.filteredOptionsCount = self.optionsCount;
					self.broadcast('VueOption', 'queryChange', val);
					self.broadcast('VueOptionGroup', 'queryChange');
				}
			},
			visible: function(val) {
				var self = this;
				if (!val) {
					self.$refs.reference.$el.querySelector('input').blur();
					self.handleIconHide();
					self.broadcast('VueSelectDropdown', 'destroyPopper');
					if (self.$refs.input) {
						self.$refs.input.blur();
					}
					self.query = '';
					self.selectedLabel = '';
					self.inputLength = 20;
					self.resetHoverIndex();
					self.$nextTick(function() {
						if (self.$refs.input && self.$refs.input.value === '' && self.selected.length === 0) {
							self.currentPlaceholder = self.cachedPlaceHolder;
						}
					});
					if (!self.multiple) {
						self.getOverflows();
						if (self.selected) {
							if (self.filterable && self.allowCreate && self.createdSelected && self.createdOption) {
								self.selectedLabel = self.createdLabel;
							} else {
								self.selectedLabel = self.selected.currentLabel;
							}
							if (self.filterable)
								self.query = self.selectedLabel;
						}
					}
				} else {
					self.handleIconShow();
					self.broadcast('VueSelectDropdown', 'updatePopper');
					if (self.filterable) {
						self.query = self.selectedLabel;
						if (self.multiple) {
							self.$refs.input.focus();
						} else {
							if (!self.remote) {
								self.broadcast('VueOption', 'queryChange', '');
								self.broadcast('VueOptionGroup', 'queryChange');
							}
							self.broadcast('VueInput', 'inputSelect');
						}
					}
				}
				self.$emit('visible-change', val);
			},
			options: function(val) {
				var self = this;
				if (self.$isServer)
					return;
				self.optionsAllDisabled = val.length === val.filter(function(item) {
					return item.disabled === true;
				}).length;
				if (self.multiple) {
					self.resetInputHeight();
				}
				var inputs = self.$el.querySelectorAll('input');
				if ([].indexOf.call(inputs, document.activeElement) === -1) {
					self.setSelected();
				}
			}
		},
		methods: {
			handleIconHide: function() {
				var icon = this.$el.querySelector('.vue-input__icon');
				if (icon) {
					VueUtil.removeClass(icon, 'is-reverse');
				}
			},
			handleIconShow: function() {
				var icon = this.$el.querySelector('.vue-input__icon');
				if (icon && !VueUtil.hasClass(icon, 'vue-icon-circle-close')) {
					VueUtil.addClass(icon, 'is-reverse');
				}
			},
			handleMenuEnter: function() {
				if (!this.dropdownUl) {
					this.dropdownUl = this.$refs.popper.$el.querySelector('.vue-select-dropdown__wrap');
					this.getOverflows();
				}
				if (!this.multiple && this.dropdownUl) {
					this.resetMenuScroll();
				}
			},
			getOverflows: function() {
				if (this.dropdownUl && this.selected && this.selected.$el) {
					var selectedRect = this.selected.$el.getBoundingClientRect();
					var popperRect = this.$refs.popper.$el.getBoundingClientRect();
					this.bottomOverflowBeforeHidden = selectedRect.bottom - popperRect.bottom;
					this.topOverflowBeforeHidden = selectedRect.top - popperRect.top;
				}
			},
			resetMenuScroll: function() {
				if (this.bottomOverflow > 0) {
					this.dropdownUl.scrollTop += this.bottomOverflow;
				} else if (this.topOverflow < 0) {
					this.dropdownUl.scrollTop += this.topOverflow;
				}
			},
			getOption: function(value) {
				var option = this.cachedOptions.filter(function(option) {
					return option.value === value;
				})[0];
				if (option)
					return option;
				var label = typeof value === 'string' || typeof value === 'number' ? value : '';
				var newOption = {
					value: value,
					currentLabel: label
				};
				if (this.multiple) {
					newOption.hitState = false;
				}
				return newOption;
			},
			setSelected: function() {
				var self = this;
				if (!self.multiple) {
					var option = self.getOption(self.value);
					if (option.created) {
						self.createdLabel = option.currentLabel;
						self.createdSelected = true;
					} else {
						self.createdSelected = false;
					}
					self.selectedLabel = option.currentLabel;
					self.selected = option;
					if (self.filterable)
						self.query = self.selectedLabel;
					return;
				}
				var result = [];
				if (Array.isArray(self.value)) {
					self.value.forEach(function(value) {
						result.push(self.getOption(value));
					});
				}
				self.selected = result;
				self.$nextTick(function() {
					self.resetInputHeight();
				});
			},
			handleFocus: function() {
				this.visible = true;
			},
			handleIconClick: function(event) {
				if (this.iconClass.indexOf('circle-close') > -1) {
					this.deleteSelected(event);
				} else {
					this.toggleMenu();
				}
			},
			handleMouseDown: function(event) {
				if (event.target.tagName !== 'INPUT')
					return;
				if (this.visible) {
					this.handleClose();
					event.preventDefault();
				}
			},
			doDestroy: function() {
				this.$refs.popper.doDestroy();
			},
			handleClose: function() {
				this.visible = false;
			},
			toggleLastOptionHitState: function(hit) {
				if (!Array.isArray(this.selected))
					return;
				var option = this.selected[this.selected.length - 1];
				if (!option)
					return;
				if (hit === true || hit === false) {
					option.hitState = hit;
					return hit;
				}
				option.hitState = !option.hitState;
				return option.hitState;
			},
			deletePrevTag: function(e) {
				if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
					var value = this.value.slice();
					value.pop();
					this.$emit('input', value);
				}
			},
			managePlaceholder: function() {
				if (this.currentPlaceholder !== '') {
					this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
				}
			},
			resetInputState: function(e) {
				if (e.keyCode !== 8)
					this.toggleLastOptionHitState(false);
				this.inputLength = this.$refs.input.value.length * 15 + 20;
				this.resetInputHeight();
			},
			resetInputHeight: function() {
				var self = this;
				self.$nextTick(function() {
					var inputChildNodes = self.$refs.reference.$el.childNodes;
					var input = [].filter.call(inputChildNodes, function(item) {
						return item.tagName === 'INPUT';
					})[0];
					input.style.height = Math.max(self.$refs.tags.clientHeight + 6, sizeMap[self.size] || 36) + 'px';
					if (self.visible && self.emptyText !== false) {
						self.broadcast('VueSelectDropdown', 'updatePopper');
					}
				});
			},
			resetHoverIndex: function() {
				var self = this;
				setTimeout(function() {
					if (!self.multiple) {
						self.hoverIndex = self.options.indexOf(self.selected);
					} else {
						if (self.selected.length > 0) {
							self.hoverIndex = Math.min.apply(null, self.selected.map(function(item) {
								return self.options.indexOf(item);
							}));
						} else {
							self.hoverIndex = -1;
						}
					}
				}, 300);
			},
			handleOptionSelect: function(option) {
				if (this.multiple) {
					var value = this.value.slice();
					var optionIndex = value.indexOf(option.value);
					if (optionIndex > -1) {
						value.splice(optionIndex, 1);
					} else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
						value.push(option.value);
					}
					this.$emit('input', value);
					if (option.created) {
						this.query = '';
						this.inputLength = 20;
					}
					if (this.filterable) this.$refs.input.focus();
				} else {
					this.$emit('input', option.value);
					this.visible = false;
				}
			},
			toggleMenu: function() {
				if (this.filterable && this.query === '' && this.visible) {
					return;
				}
				if (!this.disabled) {
					this.visible = !this.visible;
				}
			},
			navigateOptions: function(direction) {
				if (!this.visible) {
					this.visible = true;
					return;
				}
				if (this.options.length === 0 || this.filteredOptionsCount === 0)
					return;
				this.optionsAllDisabled = this.options.length === this.options.filter(function(item) {return item.disabled === true;}).length;
				if (!this.optionsAllDisabled) {
					if (direction === 'next') {
						this.hoverIndex++;
						if (this.hoverIndex === this.options.length) {
							this.hoverIndex = 0;
						}
						this.resetScrollTop();
						if (this.options[this.hoverIndex].disabled === true || this.options[this.hoverIndex].groupDisabled === true || !this.options[this.hoverIndex].visible) {
							this.navigateOptions('next');
						}
					}
					if (direction === 'prev') {
						this.hoverIndex--;
						if (this.hoverIndex < 0) {
							this.hoverIndex = this.options.length - 1;
						}
						this.resetScrollTop();
						if (this.options[this.hoverIndex].disabled === true || this.options[this.hoverIndex].groupDisabled === true || !this.options[this.hoverIndex].visible) {
							this.navigateOptions('prev');
						}
					}
				}
			},
			resetScrollTop: function() {
				var bottomOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().bottom - this.$refs.popper.$el.getBoundingClientRect().bottom;
				var topOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().top - this.$refs.popper.$el.getBoundingClientRect().top;
				if (bottomOverflowDistance > 0) {
					this.dropdownUl.scrollTop += bottomOverflowDistance;
				}
				if (topOverflowDistance < 0) {
					this.dropdownUl.scrollTop += topOverflowDistance;
				}
			},
			selectOption: function() {
				if (this.options[this.hoverIndex]) {
					this.handleOptionSelect(this.options[this.hoverIndex]);
				}
			},
			deleteSelected: function(event) {
				event.stopPropagation();
				this.$emit('input', '');
				this.visible = false;
			},
			deleteTag: function(event, tag) {
				var index = this.selected.indexOf(tag);
				if (index > -1 && !this.disabled) {
					var value = this.value.slice();
					value.splice(index, 1);
					this.$emit('input', value);
					this.$emit('remove-tag', tag);
				}
				event.stopPropagation();
			},
			onInputChange: function() {
				if (this.filterable) {
					this.query = this.selectedLabel;
				}
			},
			onOptionDestroy: function(option) {
				this.optionsCount--;
				this.filteredOptionsCount--;
				var index = this.options.indexOf(option);
				if (index > -1) {
					this.options.splice(index, 1);
				}
				this.broadcast('VueOption', 'resetIndex');
			},
			resetInputWidth: function() {
				this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
			},
			handleResize: function() {
				this.resetInputWidth();
				if (this.multiple) this.resetInputHeight();
			}
		},
		created: function() {
			var self = this;
			self.cachedPlaceHolder = self.currentPlaceholder = self.placeholder;
			if (self.multiple && !Array.isArray(self.value)) {
				self.$emit('input', []);
			}
			if (!self.multiple && Array.isArray(self.value)) {
				self.$emit('input', '');
			}
			self.setSelected();
			self.debouncedOnInputChange = VueUtil.component.debounce(self.debounce, function() {
				self.onInputChange();
			});
			self.$on('handleOptionClick', self.handleOptionSelect);
			self.$on('onOptionDestroy', self.onOptionDestroy);
			self.$on('setSelected', self.setSelected);
		},
		mounted: function() {
			var self = this;
			if (self.multiple && Array.isArray(self.value) && self.value.length > 0) {
				self.currentPlaceholder = '';
			}
			VueUtil.addResizeListener(self.$el, self.handleResize);
			if (self.remote && self.multiple) {
				self.resetInputHeight();
			}
			self.$nextTick(function() {
				if (self.$refs.reference.$el) {
					self.inputWidth = self.$refs.reference.$el.getBoundingClientRect().width;
				}
			});
		},
		beforeDestroy: function() {
			if (this.$el && this.handleResize)
				VueUtil.removeResizeListener(this.$el, this.handleResize);
		}
	};
	Vue.component(VueSelect.name, VueSelect);
	return function() {
		return VueSelect;
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VueCheckbox'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VueCheckbox']);
		delete context[name];
	}
})('VueTree', this, function(Vue, VueUtil, VueCheckbox) {
	'use strict';
	var NODE_KEY = '$treeNodeId';
	var markNodeData = function(node, data) {
		if (data[NODE_KEY])
			return;
		Object.defineProperty(data, NODE_KEY, {
			value: node.id,
			enumerable: false,
			configurable: false,
			writable: false
		});
	};
	var getNodeKey = function(key, data) {
		if (!key)
			return data[NODE_KEY];
		return data[key];
	};
	var reInitChecked = function(node) {
		var siblings = node.childNodes;
		var all = true;
		var none = true;
		for (var i = 0, j = siblings.length; i < j; i++) {
			var sibling = siblings[i];
			if (sibling.checked !== true || sibling.indeterminate) {
				all = false;
			}
			if (sibling.checked !== false || sibling.indeterminate) {
				none = false;
			}
		}
		if (all) {
			node.setChecked(true);
		} else if (!all && !none) {
			node.setChecked('half');
		} else if (none) {
			node.setChecked(false);
		}
	};
	var getPropertyFromData = function(node, prop) {
		var props = node.store.props;
		var data = node.data || {};
		var config = props[prop];
		if (typeof config === 'function') {
			return config(data, node);
		} else if (typeof config === 'string') {
			return data[config];
		} else if (typeof config === 'undefined') {
			return '';
		}
	};
	var nodeIdSeed = 0;
	var Node = function(options) {
		this.id = nodeIdSeed++;
		this.text = null;
		this.checked = false;
		this.indeterminate = false;
		this.data = null;
		this.expanded = false;
		this.parent = null;
		this.visible = true;
		for (var name in options) {
			if (options.hasOwnProperty(name)) {
				this[name] = options[name];
			}
		}
		this.level = 0;
		this.loaded = false;
		this.childNodes = [];
		this.loading = false;
		if (this.parent) {
			this.level = this.parent.level + 1;
		}
		var store = this.store;
		if (!store) {
			throw new Error('[Node]store is required!');
		}
		store.registerNode(this);
		var props = store.props;
		if (props && typeof props.isLeaf !== 'undefined') {
			var isLeaf = getPropertyFromData(this, 'isLeaf');
			if (typeof isLeaf === 'boolean') {
				this.isLeafByUser = isLeaf;
			}
		}
		if (store.lazy !== true && this.data) {
			this.setData(this.data);
			if (store.defaultExpandAll) {
				this.expanded = true;
			}
		} else if (this.level > 0 && store.lazy && store.defaultExpandAll) {
			this.expand();
		}
		if (!this.data)
			return;
		var defaultExpandedKeys = store.defaultExpandedKeys;
		var key = store.key;
		if (key && defaultExpandedKeys && defaultExpandedKeys.indexOf(this.key) !== -1) {
			this.expand(null, store.autoExpandParent);
		}
		if (key && store.currentNodeKey && this.key === store.currentNodeKey) {
			store.currentNode = this;
		}
		if (store.lazy) {
			store._initDefaultCheckedNode(this);
		}
		this.updateLeafState();
		this.label = this.getLabel();
		this.icon = this.getIcon();
		this.key = this.getKey();
	};
	Node.prototype.setData = function(data) {
		var self = this;
		if (!Array.isArray(data)) {
			markNodeData(self, data);
		}
		self.data = data;
		self.childNodes = [];
		var children;
		if (self.level === 0 && self.data instanceof Array) {
			children = self.data;
		} else {
			children = getPropertyFromData(self, 'children') || [];
		}
		for (var i = 0, j = children.length; i < j; i++) {
			self.insertChild({
				data: children[i]
			});
		}
	};
	Node.prototype.getLabel = function() {
		return getPropertyFromData(this, 'label');
	};
	Node.prototype.getIcon = function(node) {
		return getPropertyFromData(this, 'icon');
	};
	Node.prototype.getKey = function() {
		var self = this;
		var nodeKey = self.store.key;
		if (this.data)
			return self.data[nodeKey];
		return null;
	};
	Node.prototype.insertChild = function(child, index) {
		var self = this;
		if (!child)
			throw new Error('insertChild error: child is required.');
		if (!(child instanceof Node)) {
			VueUtil.merge(child, {
				parent: self,
				store: self.store
			});
			child = new Node(child);
		}
		child.level = self.level + 1;
		if (typeof index === 'undefined' || index < 0) {
			self.childNodes.push(child);
		} else {
			self.childNodes.splice(index, 0, child);
		}
		self.updateLeafState();
	};
	Node.prototype.insertBefore = function(child, ref) {
		var self = this;
		var index;
		if (ref) {
			index = self.childNodes.indexOf(ref);
		}
		self.insertChild(child, index);
	};
	Node.prototype.insertAfter = function(child, ref) {
		var self = this;
		var index;
		if (ref) {
			index = self.childNodes.indexOf(ref);
			if (index !== -1)
				index += 1;
		}
		self.insertChild(child, index);
	};
	Node.prototype.removeChild = function(child) {
		var self = this;
		var index = self.childNodes.indexOf(child);
		if (index > -1) {
			self.store && self.store.deregisterNode(child);
			child.parent = null;
			self.childNodes.splice(index, 1);
		}
		self.updateLeafState();
	};
	Node.prototype.removeChildByData = function(data) {
		var self = this;
		var targetNode = null;
		self.childNodes.forEach(function(node) {
			if (node.data === data) {
				targetNode = node;
			}
		});
		if (targetNode) {
			this.removeChild(targetNode);
		}
	};
	Node.prototype.expand = function(callback, expandParent) {
		var self = this;
		var done = function() {
			if (expandParent) {
				var parent = this.parent;
				while (parent.level > 0) {
					parent.expanded = true;
					parent = parent.parent;
				}
			}
			self.expanded = true;
			if (callback)
				callback();
		};
		if (this.shouldLoadData()) {
			this.loadData(function(data) {
				if (data instanceof Array) {
					done();
				}
			});
		} else {
			done();
		}
	};
	Node.prototype.doCreateChildren = function(array, defaultProps) {
		var self = this;
		defaultProps = defaultProps || {};
		array.forEach(function(item) {
			self.insertChild(VueUtil.merge({
				data: item
			}, defaultProps));
		});
	};
	Node.prototype.collapse = function() {
		this.expanded = false;
	}
	Node.prototype.shouldLoadData = function() {
		return this.store.lazy === true && this.store.load && !this.loaded;
	};
	Node.prototype.updateLeafState = function() {
		var self = this;
		if (self.store.lazy === true && self.loaded !== true && typeof self.isLeafByUser !== 'undefined') {
			self.isLeaf = selfk.isLeafByUser;
			return;
		}
		var childNodes = self.childNodes;
		if (!self.store.lazy || (self.store.lazy === true && self.loaded === true)) {
			self.isLeaf = !childNodes || childNodes.length === 0;
			return;
		}
		self.isLeaf = false;
	};
	Node.prototype.setChecked = function(value, deep) {
		var self = this;
		self.indeterminate = value === 'half';
		self.checked = value === true;
		var handleDescendants = function() {
			if (deep) {
				var childNodes = self.childNodes;
				for (var i = 0, j = childNodes.length; i < j; i++) {
					var child = childNodes[i];
					child.setChecked(value !== false, deep);
				}
			}
		};
		if (!self.store.checkStrictly && self.shouldLoadData()) {
			self.loadData(function() {
				handleDescendants();
			}, {
				checked: value !== false
			});
		} else {
			handleDescendants();
		}
		var parent = self.parent;
		if (!parent || parent.level === 0)
			return;
		if (!self.store.checkStrictly) {
			reInitChecked(parent);
		}
	};
	Node.prototype.getChildren = function() {
		var self = this;
		var data = self.data;
		if (!data) return null;
		var props = self.store.props;
		var children = 'children';
		if (props) {
			children = props.children || 'children';
		}
		if (data[children] === undefined) {
			data[children] = null;
		}
		return data[children];
	};
	Node.prototype.updateChildren = function() {
		var self = this;
		var newData = self.getChildren() || [];
		var oldData = self.childNodes.map(function(node) {
			return node.data;
		});
		var newDataMap = {};
		var newNodes = [];
		newData.forEach(function(item, index) {
			if (item[NODE_KEY]) {
				newDataMap[item[NODE_KEY]] = {
					index: index,
					data: item
				};
			} else {
				newNodes.push({
					index: index,
					data: item
				});
			}
		});
		oldData.forEach(function(item) {
			if (!newDataMap[item[NODE_KEY]])
				self.removeChildByData(item);
		});
		newNodes.forEach(function(args) {
			var index = args.index;
			var data = args.data;
			self.insertChild({
				data: data
			}, index);
		});
		self.updateLeafState();
	};
	Node.prototype.loadData = function(callback, defaultProps) {
		var self = this;
		defaultProps = defaultProps || {}
		if (self.store.lazy === true && self.store.load && !self.loaded && !self.loading) {
			self.loading = true;
			var resolve = function(children) {
				self.loaded = true;
				self.loading = false;
				self.childNodes = [];
				self.doCreateChildren(children, defaultProps);
				self.updateLeafState();
				if (callback) {
					callback.call(self, children);
				}
			};
			self.store.load(self, resolve);
		} else {
			if (callback) {
				callback.call(self);
			}
		}
	};
	var TreeStore = function(options) {
		var self = this;
		self.currentNode = null;
		self.currentNodeKey = null;
		for (var option in options) {
			if (options.hasOwnProperty(option)) {
				self[option] = options[option];
			}
		}
		self.nodesMap = {};
		self.root = new Node({
			data: self.data,
			store: self
		});
		if (self.lazy && self.load) {
			var loadFn = self.load;
			loadFn(self.root, function(data) {
				self.root.doCreateChildren(data);
				self._initDefaultCheckedNodes();
			});
		} else {
			self._initDefaultCheckedNodes();
		}
	};
	TreeStore.prototype.filter = function(value) {
		var self = this;
		var filterNodeMethod = self.filterNodeMethod;
		var traverse = function(node) {
			var childNodes = node.root ? node.root.childNodes : node.childNodes;
			childNodes.forEach(function(child) {
				child.visible = filterNodeMethod.call(child, value, child.data, child);
				traverse(child);
			});
			if (!node.visible && childNodes.length) {
				var allHidden = true;
				childNodes.forEach(function(child) {
					if (child.visible)
						allHidden = false;
				});
				if (node.root) {
					node.root.visible = allHidden === false;
				} else {
					node.visible = allHidden === false;
				}
			}
			if (node.visible && !node.isLeaf)
				node.expand();
		};
		traverse(self);
	};
	TreeStore.prototype.setData = function(newVal) {
		var self = this;
		var instanceChanged = newVal !== self.root.data;
		self.root.setData(newVal);
		if (instanceChanged) {
			self._initDefaultCheckedNodes();
		}
	};
	TreeStore.prototype.getNode = function(data) {
		var self = this;
		var key = typeof data !== 'object' ? data : getNodeKey(self.key, data);
		return self.nodesMap[key];
	};
	TreeStore.prototype.insertBefore = function(data, refData) {
		var self = this;
		var refNode = self.getNode(refData);
		refNode.parent.insertBefore({
			data: data
		}, refNode);
	};
	TreeStore.prototype.insertAfter = function(data, refData) {
		var self = this;
		var refNode = self.getNode(refData);
		refNode.parent.insertAfter({
			data: data
		}, refNode);
	};
	TreeStore.prototype.remove = function(data) {
		var self = this;
		var node = self.getNode(data);
		if (node) {
			node.parent.removeChild(node);
		}
	};
	TreeStore.prototype.append = function(data, parentData) {
		var self = this;
		var parentNode = parentData ? self.getNode(parentData) : self.root;
		if (parentNode) {
			parentNode.insertChild({
				data: data
			});
		}
	};
	TreeStore.prototype._initDefaultCheckedNodes = function() {
		var self = this;
		var defaultCheckedKeys = self.defaultCheckedKeys || [];
		var nodesMap = self.nodesMap;
		defaultCheckedKeys.forEach(function(checkedKey) {
			var node = nodesMap[checkedKey];
			if (node) {
				node.setChecked(true, !self.checkStrictly);
			}
		});
	};
	TreeStore.prototype._initDefaultCheckedNode = function(node) {
		var self = this;
		var defaultCheckedKeys = self.defaultCheckedKeys || [];
		var nodeKey = node.key || node.getKey();
		if (defaultCheckedKeys.indexOf(nodeKey) !== -1) {
			node.setChecked(true, !self.checkStrictly);
		}
	};
	TreeStore.prototype.setDefaultCheckedKey = function(newVal) {
		var self = this;
		if (newVal !== self.defaultCheckedKeys) {
			self.defaultCheckedKeys = newVal;
			self._initDefaultCheckedNodes();
		}
	};
	TreeStore.prototype.registerNode = function(node) {
		var self = this;
		var key = self.key;
		if (!key || !node || !node.data)
			return;
		var nodeKey = node.key || node.getKey();
		if (nodeKey)
			self.nodesMap[nodeKey] = node;
	};
	TreeStore.prototype.deregisterNode = function(node) {
		var self = this;
		var key = self.key;
		if (!key || !node || !node.data)
			return;
		var nodeKey = node.key || node.getKey();
		delete self.nodesMap[nodeKey];
	};
	TreeStore.prototype.getCheckedNodes = function() {
		var self = this;
		var leafOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var checkedNodes = [];
		var traverse = function(node) {
			var childNodes = node.root ? node.root.childNodes : node.childNodes;
			childNodes.forEach(function(child) {
				if ((!leafOnly && child.checked) || (leafOnly && child.isLeaf && child.checked)) {
					checkedNodes.push(child.data);
				}
				traverse(child);
			});
		};
		traverse(self);
		return checkedNodes;
	};
	TreeStore.prototype.getCheckedKeys = function() {
		var self = this;
		var leafOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var key = self.key;
		var allNodes = self._getAllNodes();
		var keys = [];
		allNodes.forEach(function(node) {
			if (!leafOnly || (leafOnly && node.isLeaf)) {
				if (node.checked) {
					keys.push((node.data || {})[key]);
				}
			}
		});
		return keys;
	};
	TreeStore.prototype._getAllNodes = function() {
		var self = this;
		var allNodes = [];
		var nodesMap = self.nodesMap;
		for (var nodeKey in nodesMap) {
			if (nodesMap.hasOwnProperty(nodeKey)) {
				allNodes.push(nodesMap[nodeKey]);
			}
		}
		return allNodes;
	};
	TreeStore.prototype._setCheckedKeys = function(key) {
		var self = this;
		var leafOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var checkedKeys = arguments[2];
		var allNodes = self._getAllNodes();
		allNodes.sort(function(a, b) {
			return a.level < b.level;
		});
		var keys = Object.keys(checkedKeys);
		allNodes.forEach(function(node) {
			var checked = keys.indexOf(node.data[key] + '') > -1;
			if (!node.isLeaf) {
				if (!self.checkStrictly) {
					var childNodes = node.childNodes;
					var all = true;
					var none = true;
					for (var i = 0, j = childNodes.length; i < j; i++) {
						var child = childNodes[i];
						if (child.checked !== true || child.indeterminate) {
							all = false;
						}
						if (child.checked !== false || child.indeterminate) {
							none = false;
						}
					}
					if (all) {
						node.setChecked(true, !self.checkStrictly);
					} else if (!all && !none) {
						checked = checked ? true : 'half';
						node.setChecked(checked, !self.checkStrictly && checked === true);
					} else if (none) {
						node.setChecked(checked, !self.checkStrictly);
					}
				} else {
					node.setChecked(checked, false);
				}
				if (leafOnly) {
					node.setChecked(false, false);
					var traverse = function(node) {
						var childNodes = node.childNodes;
						childNodes.forEach(function(child) {
							if (!child.isLeaf) {
								child.setChecked(false, false);
							}
							traverse(child);
						});
					};
					traverse(node);
				}
			} else {
				node.setChecked(checked, false);
			}
		});
	};
	TreeStore.prototype.setCheckedNodes = function(array) {
		var self = this;
		var leafOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var key = self.key;
		var checkedKeys = {};
		array.forEach(function(item) {
			checkedKeys[(item || {})[key]] = true;
		});
		self._setCheckedKeys(key, leafOnly, checkedKeys);
	};
	TreeStore.prototype.setCheckedKeys = function(keys, leafonly) {
		var self = this;
		var leafOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		self.defaultCheckedKeys = keys;
		var key = self.key;
		var checkedKeys = {};
		keys.forEach(function(key) {
			checkedKeys[key] = true;
		});
		self._setCheckedKeys(key, leafOnly, checkedKeys);
	};
	TreeStore.prototype.setDefaultExpandedKeys = function(keys) {
		var self = this;
		keys = keys || [];
		self.defaultExpandedKeys = keys;
		keys.forEach(function(key) {
			var node = self.getNode(key);
			if (node)
				node.expand(null, self.autoExpandParent);
		});
	};
	TreeStore.prototype.setChecked = function(data, checked, deep) {
		var self = this;
		var node = self.getNode(data);
		if (node) {
			node.setChecked(!!checked, deep);
		}
	};
	TreeStore.prototype.getCurrentNode = function() {
		return this.currentNode;
	};
	TreeStore.prototype.setCurrentNode = function(node) {
		this.currentNode = node;
	};
	TreeStore.prototype.setCurrentNodeKey = function(key) {
		var self = this;
		var node = self.getNode(key);
		if (node) {
			self.currentNode = node;
		}
	};
	var VueTreeNode = {
		template: '<div class="vue-tree-node" @click.stop="handleClick" v-show="node.visible" :class="{\'is-expanded\': childNodeRendered && expanded,\'is-current\': tree.store.currentNode === node,\'is-hidden\': !node.visible}"><div class="vue-tree-node__content" :style="{ \'padding-left\': (node.level - 1) * tree.indent + \'px\' }"><span class="vue-tree-node__expand-icon" @click.stop="handleExpandIconClick" :class="{ \'is-leaf\': node.isLeaf, expanded: !node.isLeaf && expanded }"></span><vue-checkbox v-if="showCheckbox" v-model="node.checked" :indeterminate="node.indeterminate" @change="handleCheckChange" @click.native.stop="handleUserClick"></vue-checkbox><span v-if="node.loading" class="vue-tree-node__loading-icon vue-icon-loading"></span><node-content :node="node"></node-content></div><collapse-transition><div class="vue-tree-node__children" v-show="expanded"><vue-tree-node :render-content="renderContent" v-for="child in node.childNodes" :key="getNodeKey(child)" :node="child" @node-expand="handleChildNodeExpand"></vue-tree-node></div></collapse-transition></div>',
		name: 'VueTreeNode',
		componentName: 'VueTreeNode',
		mixins: [VueUtil.component.emitter],
		props: {
			node: {
				default: function() {
					return {};
				}
			},
			props: {},
			renderContent: Function
		},
		components: {
			VueCheckbox: VueCheckbox(),
			CollapseTransition: VueUtil.component.collapseTransition,
			NodeContent: {
				props: {
					node: {
						required: true
					}
				},
				render: function(createElement) {
					var parent = this.$parent;
					var node = this.node;
					var data = node.data;
					var store = node.store;
					return ( parent.renderContent ? parent.renderContent.call(parent._renderProxy, createElement, {
						_self: parent.tree.$vnode.context,
						node: node,
						data: data,
						store: store
					}) : createElement("span", {
						class: "vue-tree-node__label"
					}, [this.node.label])) ;
				}
			}
		},
		data: function() {
			return {
				tree: null,
				expanded: false,
				childNodeRendered: false,
				showCheckbox: false,
				oldChecked: null,
				oldIndeterminate: null
			};
		},
		watch: {
			'node.indeterminate': function(val) {
				this.handleSelectChange(this.node.checked, val);
			},
			'node.checked': function(val) {
				this.handleSelectChange(val, this.node.indeterminate);
			},
			'node.expanded': function(val) {
				this.expanded = val;
				if (val) {
					this.childNodeRendered = true;
				}
			}
		},
		methods: {
			getNodeKey: function(node, index) {
				var nodeKey = this.tree.nodeKey;
				if (nodeKey && node) {
					return node.data[nodeKey];
				}
				return index;
			},
			handleSelectChange: function(checked, indeterminate) {
				if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
					this.tree.$emit('check-change', this.node.data, checked, indeterminate);
				}
				this.oldChecked = checked;
				this.indeterminate = indeterminate;
			},
			handleClick: function() {
				var store = this.tree.store;
				store.setCurrentNode(this.node);
				this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
				this.tree.currentNode = this;
				if (this.tree.expandOnClickNode) {
					this.handleExpandIconClick();
				}
				this.tree.$emit('node-click', this.node.data, this.node, this);
			},
			handleExpandIconClick: function() {
				if (this.node.isLeaf)
					return;
				if (this.expanded) {
					this.tree.$emit('node-collapse', this.node.data, this.node, this);
					this.node.collapse();
				} else {
					this.node.expand();
					this.$emit('node-expand', this.node.data, this.node, this);
				}
			},
			handleUserClick: function() {
				if (this.node.indeterminate) {
					this.node.setChecked(this.node.checked, !this.tree.checkStrictly);
				}
			},
			handleCheckChange: function(ev) {
				if (!this.node.indeterminate) {
					this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
				}
			},
			handleChildNodeExpand: function(nodeData, node, instance) {
				this.broadcast('VueTreeNode', 'tree-node-expand', node);
				this.tree.$emit('node-expand', nodeData, node, instance);
			}
		},
		created: function() {
			var self = this;
			var parent = self.$parent;
			if (parent.isTree) {
				self.tree = parent;
			} else {
				self.tree = parent.tree;
			}
			var tree = self.tree;
			if (!tree) {
				console.warn('Can not find node\'s tree.');
			}
			var props = tree.props || {};
			var childrenKey = props['children'] || 'children';
			self.$watch('node.data.' + childrenKey, function() {
				self.node.updateChildren();
			});
			self.showCheckbox = tree.showCheckbox;
			if (self.node.expanded) {
				self.expanded = true;
				self.childNodeRendered = true;
			}
			if (self.tree.accordion) {
				self.$on('tree-node-expand', function(node) {
					if (self.node !== node) {
						self.node.collapse();
					}
				});
			}
		}
	};
	var VueTree = {
		template: '<div class="vue-tree" :class="{ \'vue-tree--highlight-current\': highlightCurrent }"><vue-tree-node v-for="child in root.childNodes" :node="child" :props="props" :key="getNodeKey(child)" :render-content="renderContent" @node-expand="handleNodeExpand"></vue-tree-node><div class="vue-tree__empty-block" v-if="!root.childNodes || root.childNodes.length === 0"><span class="vue-tree__empty-text">{{ emptyText || $t(\'vue.tree.emptyText\') }}</span></div></div>',
		name: 'VueTree',
		mixins: [VueUtil.component.emitter],
		components: {
			VueTreeNode: VueTreeNode
		},
		data: function() {
			return {
				store: null,
				root: null,
				currentNode: null
			};
		},
		props: {
			data: {
				type: Array
			},
			emptyText: {
				type: String,
				default: function() {
					return 'no data';
				}
			},
			nodeKey: String,
			checkStrictly: Boolean,
			defaultExpandAll: Boolean,
			expandOnClickNode: {
				type: Boolean,
				default: true
			},
			autoExpandParent: {
				type: Boolean,
				default: true
			},
			defaultCheckedKeys: Array,
			defaultExpandedKeys: Array,
			renderContent: Function,
			showCheckbox: {
				type: Boolean,
				default: false
			},
			props: {
				default: function() {
					return {
						children: 'children',
						label: 'label',
						icon: 'icon'
					};
				}
			},
			lazy: {
				type: Boolean,
				default: false
			},
			highlightCurrent: Boolean,
			currentNodeKey: [String, Number],
			load: Function,
			filterNodeMethod: Function,
			accordion: Boolean,
			indent: {
				type: Number,
				default: 16
			}
		},
		computed: {
			children: {
				set: function(value) {
					this.data = value;
				},
				get: function() {
					return this.data;
				}
			}
		},
		watch: {
			defaultCheckedKeys: function(newVal) {
				this.store.defaultCheckedKeys = newVal;
				this.store.setDefaultCheckedKey(newVal);
			},
			defaultExpandedKeys: function(newVal) {
				this.store.defaultExpandedKeys = newVal;
				this.store.setDefaultExpandedKeys(newVal);
			},
			currentNodeKey: function(newVal) {
				this.store.setCurrentNodeKey(newVal);
				this.store.currentNodeKey = newVal;
			},
			data: function(newVal) {
				this.store.setData(newVal);
			}
		},
		methods: {
			filter: function(value) {
				if (!this.filterNodeMethod)
					throw new Error('[Tree] filterNodeMethod is required when filter');
				this.store.filter(value);
			},
			getNodeKey: function(node, index) {
				var nodeKey = this.nodeKey;
				if (nodeKey && node) {
					return node.data[nodeKey];
				}
				return index;
			},
			getCheckedNodes: function(leafOnly) {
				return this.store.getCheckedNodes(leafOnly);
			},
			getCheckedKeys: function(leafOnly) {
				return this.store.getCheckedKeys(leafOnly);
			},
			setCheckedNodes: function(nodes, leafOnly) {
				if (!this.nodeKey)
					throw new Error('[Tree] nodeKey is required in setCheckedNodes');
				this.store.setCheckedNodes(nodes, leafOnly);
			},
			setCheckedKeys: function(keys, leafOnly) {
				if (!this.nodeKey)
					throw new Error('[Tree] nodeKey is required in setCheckedNodes');
				this.store.setCheckedKeys(keys, leafOnly);
			},
			setChecked: function(data, checked, deep) {
				this.store.setChecked(data, checked, deep);
			},
			handleNodeExpand: function(nodeData, node, instance) {
				this.broadcast('VueTreeNode', 'tree-node-expand', node);
				this.$emit('node-expand', nodeData, node, instance);
			}
		},
		created: function() {
			var self = this;
			self.isTree = true;
			self.store = new TreeStore({
				key: self.nodeKey,
				data: self.data,
				lazy: self.lazy,
				props: self.props,
				load: self.load,
				currentNodeKey: self.currentNodeKey,
				checkStrictly: self.checkStrictly,
				defaultCheckedKeys: self.defaultCheckedKeys,
				defaultExpandedKeys: self.defaultExpandedKeys,
				autoExpandParent: self.autoExpandParent,
				defaultExpandAll: self.defaultExpandAll,
				filterNodeMethod: self.filterNodeMethod
			});
			self.root = self.store.root;
		}
	};
	Vue.component(VueTree.name, VueTree);
});
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
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueCard', this, function(Vue) {
	'use strict';
	var VueCard = {
		template: '<div class="vue-card"><div class="vue-card__header" v-if="$slots.header || header"><slot name="header">{{ header }}</slot></div><div class="vue-card__body" :style="bodyStyle"><slot></slot></div></div>',
		name: 'VueCard',
		props: ['header', 'bodyStyle']
	};
	Vue.component(VueCard.name, VueCard);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VuePopper'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VuePopper']);
		delete context[name];
	}
})('VuePopover', this, function(Vue, VueUtil, VuePopper) {
	'use strict';
	var VuePopover = {
		template: '<span><transition :name="transition" @after-leave="doDestroy"><div class="vue-popover" :class="[popperClass]" ref="popper" v-show="!disabled && showPopper" :style="{ width: width + \'px\' }"><div class="vue-popover__title" v-if="title" v-text="title"></div><slot>{{ content }}</slot></div></transition><slot name="reference"></slot></span>',
		name: 'VuePopover',
		mixins: [VuePopper()],
		props: {
			trigger: {
				type: String,
				default: 'click',
				validator: function(value) {
					return ['click', 'focus', 'hover', 'manual'].indexOf(value) > -1
				}
			},
			title: String,
			disabled: Boolean,
			content: String,
			reference: {},
			popperClass: String,
			width: {},
			visibleArrow: {
				default: true
			},
			transition: {
				type: String,
				default: 'fade-in-linear'
			}
		},
		watch: {
			showPopper: function(newVal, oldVal) {
				newVal ? this.$emit('show') : this.$emit('hide');
			}
		},
		mounted: function() {
			var self = this;
			var reference = self.reference || self.$refs.reference;
			var popper = self.popper || self.$refs.popper;
			if (!reference && self.$slots.reference && self.$slots.reference[0]) {
				reference = self.referenceElm = self.$slots.reference[0].elm;
			}
			if (self.trigger === 'click') {
				VueUtil.on(reference, 'click', self.doToggle);
				VueUtil.on(document, 'click', self.handleDocumentClick);
			} else if (self.trigger === 'hover') {
				VueUtil.on(reference, 'mouseenter', self.handleMouseEnter);
				VueUtil.on(popper, 'mouseenter', self.handleMouseEnter);
				VueUtil.on(reference, 'mouseleave', self.handleMouseLeave);
				VueUtil.on(popper, 'mouseleave', self.handleMouseLeave);
			} else if (self.trigger === 'focus') {
				var found = false;
				if ([].slice.call(reference.children).length) {
					var children = reference.childNodes;
					var len = children.length;
					for (var i = 0; i < len; i++) {
						if (children[i].nodeName === 'INPUT' || children[i].nodeName === 'TEXTAREA') {
							VueUtil.on(children[i], 'focus', self.doShow);
							VueUtil.on(children[i], 'blur', self.doClose);
							found = true;
							break;
						}
					}
				}
				if (found)
					return;
				if (reference.nodeName === 'INPUT' || reference.nodeName === 'TEXTAREA') {
					VueUtil.on(reference, 'focus', self.doShow);
					VueUtil.on(reference, 'blur', self.doClose);
				} else {
					VueUtil.on(reference, 'mousedown', self.doShow);
					VueUtil.on(reference, 'mouseup', self.doClose);
				}
			}
		},
		methods: {
			doToggle: function() {
				this.showPopper = !this.showPopper;
			},
			doShow: function() {
				this.showPopper = true;
			},
			doClose: function() {
				this.showPopper = false;
			},
			handleMouseEnter: function() {
				this.showPopper = true;
				clearTimeout(this._timer);
			},
			handleMouseLeave: function() {
				var self = this;
				self._timer = setTimeout(function() {
					self.showPopper = false;
				}, 200);
			},
			handleDocumentClick: function(e) {
				var reference = this.reference || this.$refs.reference;
				var popper = this.popper || this.$refs.popper;
				if (!reference && this.$slots.reference && this.$slots.reference[0]) {
					reference = this.referenceElm = this.$slots.reference[0].elm;
				}
				if (!this.$el || !reference || this.$el.contains(e.target) || reference.contains(e.target) || !popper || popper.contains(e.target))
					return;
				this.showPopper = false;
			}
		},
		destroyed: function() {
			var reference = this.reference;
			VueUtil.off(reference, 'click', this.doToggle);
			VueUtil.off(reference, 'mouseup', this.doClose);
			VueUtil.off(reference, 'mousedown', this.doShow);
			VueUtil.off(reference, 'focus', this.doShow);
			VueUtil.off(reference, 'blur', this.doClose);
			VueUtil.off(reference, 'mouseleave', this.handleMouseLeave);
			VueUtil.off(reference, 'mouseenter', this.handleMouseEnter);
			VueUtil.off(document, 'click', this.handleDocumentClick);
		}
	};
	var directive = function(el, binding, vnode) {
		vnode.context.$refs[binding.arg].$refs.reference = el;
	};
	Vue.directive('popover', directive);
	Vue.component(VuePopover.name, VuePopover);
	VuePopover.directive = directive;
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePopper', 'VueUtil', 'VueInput'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePopper'], context['VueUtil'], context['VueInput']);
		delete context[name];
	}
})('VueCascader', this, function(Vue, VuePopper, VueUtil, VueInput) {
	'use strict';
	var VueCascaderMenu = {
		name: 'VueCascaderMenu',
		data: function() {
			return {
				inputWidth: 0,
				options: [],
				props: {},
				visible: false,
				activeValue: [],
				value: [],
				expandTrigger: 'click',
				changeOnSelect: false,
				popperClass: ''
			};
		},
		watch: {
			visible: function(value) {
				if (value) {
					this.activeValue = this.value;
				}
			},
			value: {
				immediate: true,
				handler: function(value) {
					this.activeValue = value;
				}
			}
		},
		computed: {
			activeOptions: {
				cache: false,
				get: function() {
					var self = this;
					var activeValue = self.activeValue;
					var configurableProps = ['label', 'value', 'children', 'disabled'];
					var formatOptions = function(options) {
						options.forEach(function(option) {
							if (option.__IS__FLAT__OPTIONS)
								return;
							configurableProps.forEach(function(prop) {
								var value = option[self.props[prop] || prop];
								if (value)
									option[prop] = value;
							});
							if (Array.isArray(option.children)) {
								formatOptions(option.children);
							}
						});
					};
					var loadActiveOptions = function(options, activeOptions) {
						activeOptions = activeOptions || [];
						var level = activeOptions.length;
						activeOptions[level] = options;
						var active = activeValue[level];
						if (active) {
							options = options.filter(function(option) {
								return option.value === active;
							})[0];
							if (options && options.children) {
								loadActiveOptions(options.children, activeOptions);
							}
						}
						return activeOptions;
					};
					formatOptions(self.options);
					return loadActiveOptions(self.options);
				}
			}
		},
		methods: {
			select: function(item, menuIndex) {
				if (item.__IS__FLAT__OPTIONS) {
					this.activeValue = item.value;
				} else if (menuIndex) {
					this.activeValue.splice(menuIndex, this.activeValue.length - 1, item.value);
				} else {
					this.activeValue = [item.value];
				}
				this.$emit('pick', this.activeValue);
			},
			handleMenuLeave: function() {
				this.$emit('menuLeave');
			},
			activeItem: function(item, menuIndex) {
				var len = this.activeOptions.length;
				this.activeValue.splice(menuIndex, len, item.value);
				this.activeOptions.splice(menuIndex + 1, len, item.children);
				if (this.changeOnSelect) {
					this.$emit('pick', this.activeValue, false);
				} else {
					this.$emit('activeItemChange', this.activeValue);
				}
			}
		},
		render: function(createElement) {
			var self = this;
			var activeValue = self.activeValue
			 , activeOptions = self.activeOptions
			 , visible = self.visible
			 , expandTrigger = self.expandTrigger
			 , popperClass = self.popperClass;
			var menus = self._l(activeOptions, function(menu, menuIndex) {
				var isFlat = false;
				var items = self._l(menu, function(item) {
					var events = {
						on: {}
					};
					if (item.__IS__FLAT__OPTIONS)
						isFlat = true;
					if (!item.disabled) {
						if (item.children) {
							var triggerEvent = {
								click: 'click',
								hover: 'mouseenter'
							}[expandTrigger];
							events.on[triggerEvent] = function() {
								self.activeItem(item, menuIndex);
							}
						} else {
							events.on.click = function() {
								self.select(item, menuIndex);
							}
						}
					}
					return createElement('li', {
						class: {
							'vue-cascader-menu__item': !0,
							'vue-cascader-menu__item--extensible': item.children,
							'is-active': item.value === activeValue[menuIndex],
							'is-disabled': item.disabled
						},
						on: events.on
					}, [item.label]);
				});
				var menuStyle = {};
				if (isFlat) {
					menuStyle.minWidth = self.inputWidth + 'px';
				}
				return createElement('ul', {
					class: {
						'vue-cascader-menu': true,
						'vue-cascader-menu--flexible': isFlat
					},
					style: menuStyle
				}, [items]);
			});
			return createElement('div', {}, [createElement('transition', {
				attrs: {
					name: 'vue-zoom-in-top'
				},
				on: {
					'after-leave': self.handleMenuLeave
				}
			}, [createElement('div', {
				directives: [{
					name: 'show',
					value: visible
				}],
				class: ['vue-cascader-menus', popperClass]
			}, [menus])])]);
		}
	};
	var popperMixin = {
		props: {
			placement: {
				type: String,
				default: 'bottom-start'
			},
			appendToBody: VuePopper().props.appendToBody,
			offset: VuePopper().props.offset,
			boundariesPadding: VuePopper().props.boundariesPadding,
			popperOptions: VuePopper().props.popperOptions
		},
		methods: VuePopper().methods,
		data: VuePopper().data,
		beforeDestroy: VuePopper().beforeDestroy
	};
	var VueCascader = {
		template: '<span class="vue-cascader" :class="[{ \'is-opened\': menuVisible, \'is-disabled\': disabled},size ? \'vue-cascader--\' + size : \'\']" @click="handleClick" @mouseenter="inputHover = true" @mouseleave="inputHover = false" ref="reference" v-clickoutside="handleClickoutside"><vue-input ref="input" :readonly="!filterable" :placeholder="currentLabels.length ? undefined : placeholderLang" v-model="inputValue" @change="debouncedInputChange" :validate-event="false" :size="size" :disabled="disabled"><template slot="icon"><i key="1" v-if="clearable && inputHover && currentLabels.length" class="vue-input__icon vue-icon-circle-close vue-cascader__clearIcon" @click="clearValue"></i><i key="2" v-else class="vue-input__icon vue-icon-caret-bottom" :class="{ \'is-reverse\': menuVisible }"></i></template></vue-input><span class="vue-cascader__label" v-show="inputValue === \'\'"><template v-if="showAllLevels"><template v-for="(label, index) in currentLabels">{{ label }}<span v-if="index < currentLabels.length - 1"> / </span></template></template><template v-else>{{ currentLabels[currentLabels.length - 1] }}</template></span></span>',
		name: 'VueCascader',
		directives: {
			Clickoutside: VueUtil.component.clickoutside()
		},
		mixins: [popperMixin, VueUtil.component.emitter],
		components: {
			VueInput: VueInput()
		},
		props: {
			options: {
				type: Array,
				required: true
			},
			props: {
				type: Object,
				default: function() {
					return {
						children: 'children',
						label: 'label',
						value: 'value',
						disabled: 'disabled'
					};
				}
			},
			value: {
				type: Array,
				default: function() {
					return [];
				}
			},
			placeholder: String,
			disabled: Boolean,
			clearable: {
				type: Boolean,
				default: false
			},
			changeOnSelect: Boolean,
			popperClass: String,
			expandTrigger: {
				type: String,
				default: 'click'
			},
			filterable: Boolean,
			size: String,
			showAllLevels: {
				type: Boolean,
				default: true
			},
			debounce: {
				type: Number,
				default: 300
			}
		},
		data: function() {
			return {
				currentValue: this.value,
				menu: null,
				debouncedInputChange: function() {},
				menuVisible: false,
				inputHover: false,
				inputValue: '',
				flatOptions: null
			};
		},
		computed: {
			placeholderLang: function() {
				if (!this.placeholder)
					return this.$t('vue.cascader.placeholder');
				return this.placeholder;
			},
			labelKey: function() {
				return this.props.label || 'label';
			},
			valueKey: function() {
				return this.props.value || 'value';
			},
			childrenKey: function() {
				return this.props.children || 'children';
			},
			currentLabels: function() {
				var self = this;
				var options = self.options;
				var labels = [];
				self.currentValue.forEach(function(value) {
					var targetOption = options && options.filter(function(option) {
						return option[self.valueKey] === value;
					})[0];
					if (targetOption) {
						labels.push(targetOption[self.labelKey]);
						options = targetOption[self.childrenKey];
					}
				});
				return labels;
			}
		},
		watch: {
			menuVisible: function(value) {
				value ? this.showMenu() : this.hideMenu();
			},
			value: function(value) {
				this.currentValue = value;
			},
			currentValue: function(value) {
				this.dispatch('VueFormItem', 'vue.form.change', [value]);
			},
			options: {
				deep: true,
				handler: function(value) {
					if (!this.menu) {
						this.initMenu();
					}
					this.flatOptions = this.flattenOptions(this.options);
					this.menu.options = value;
				}
			}
		},
		methods: {
			initMenu: function() {
				this.menu = new Vue(VueCascaderMenu).$mount();
				this.menu.options = this.options;
				this.menu.props = this.props;
				this.menu.expandTrigger = this.expandTrigger;
				this.menu.changeOnSelect = this.changeOnSelect;
				this.menu.popperClass = this.popperClass;
				this.popperElm = this.menu.$el;
				this.menu.$on('pick', this.handlePick);
				this.menu.$on('activeItemChange', this.handleActiveItemChange);
				this.menu.$on('menuLeave', this.doDestroy);
			},
			showMenu: function() {
				var self = this;
				if (!self.menu) {
					self.initMenu();
				}
				self.menu.value = self.currentValue.slice(0);
				self.menu.visible = true;
				self.menu.options = self.options;
				self.$nextTick(function() {
					self.updatePopper();
					self.menu.inputWidth = self.$refs.input.$el.offsetWidth - 2;
				});
			},
			hideMenu: function() {
				this.inputValue = '';
				this.menu.visible = false;
			},
			handleActiveItemChange: function(value) {
				var self = this;
				self.$nextTick(function() {
					self.updatePopper();
				});
				self.$emit('active-item-change', value);
			},
			handlePick: function(value, close) {
				if (typeof close === 'undefined')
					close = true;
				this.currentValue = value;
				this.$emit('input', value);
				this.$emit('change', value);
				if (close) {
					this.menuVisible = false;
				}
			},
			handleInputChange: function(value) {
				var self = this;
				if (!self.menuVisible)
					return;
				var flatOptions = self.flatOptions;
				if (!value) {
					self.menu.options = self.options;
					return;
				}
				var filteredFlatOptions = flatOptions.filter(function(optionsStack) {
					return optionsStack.some(function(option) {
						return new RegExp(value,'i').test(option[self.labelKey]);
					});
				});
				if (filteredFlatOptions.length > 0) {
					filteredFlatOptions = filteredFlatOptions.map(function(optionStack) {
						return {
							__IS__FLAT__OPTIONS: true,
							value: optionStack.map(function(item) {
								return item[self.valueKey];
							}),
							label: self.renderFilteredOptionLabel(value, optionStack)
						};
					});
				} else {
					filteredFlatOptions = [{
						__IS__FLAT__OPTIONS: true,
						label: self.$t('vue.cascader.emptyText'),
						value: '',
						disabled: true
					}];
				}
				self.menu.options = filteredFlatOptions;
			},
			renderFilteredOptionLabel: function(inputValue, optionsStack) {
				var self = this;
				return optionsStack.map(function(option, index) {
					var label = option[self.labelKey];
					var keywordIndex = label.toLowerCase().indexOf(inputValue.toLowerCase());
					var labelPart = label.slice(keywordIndex, inputValue.length + keywordIndex);
					var node = keywordIndex > -1 ? self.highlightKeyword(label, labelPart) : label;
					return index === 0 ? node : [' / ', node];
				});
			},
			highlightKeyword: function(label, keyword) {
				var self = this;
				var h = self._c;
				return label.split(keyword).map(function(node, index) {
					return index === 0 ? node : [h('span', {
						class: {
							'vue-cascader-menu__item__keyword': true
						}
					}, [self._v(keyword)]), node]
				});
			},
			flattenOptions: function(options, ancestor) {
				ancestor = ancestor || [];
				var self = this;
				var flatOptions = [];
				options.forEach(function(option) {
					var optionsStack = ancestor.concat(option);
					if (!option[self.childrenKey]) {
						flatOptions.push(optionsStack);
					} else {
						if (self.changeOnSelect) {
							flatOptions.push(optionsStack);
						}
						flatOptions = flatOptions.concat(self.flattenOptions(option[self.childrenKey], optionsStack));
					}
				});
				return flatOptions;
			},
			clearValue: function(ev) {
				ev.stopPropagation();
				this.handlePick([], true);
			},
			handleClickoutside: function() {
				this.menuVisible = false;
			},
			handleClick: function() {
				if (this.disabled)
					return;
				if (this.filterable) {
					this.menuVisible = true;
					return;
				}
				this.menuVisible = !this.menuVisible;
			}
		},
		created: function() {
			var self = this;
			self.debouncedInputChange = VueUtil.component.debounce(self.debounce, function(value) {
				self.handleInputChange(value);
			});
		},
		mounted: function() {
			this.flatOptions = this.flattenOptions(this.options);
		}
	};
	Vue.component(VueCascader.name, VueCascader);
});
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
				steps.forEach(function(child, index) {
					child.index = index;
				});
			}
		}
	};
	Vue.component(VueSteps.name, VueSteps);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VueButton', 'VueButtonGroup'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VueButton'], context['VueButtonGroup']);
		delete context[name];
	}
})('VueDropdown', this, function(Vue, VueUtil, VueButton, VueButtonGroup) {
	'use strict';
	var VueDropdown = {
		template: '',
		name: 'VueDropdown',
		componentName: 'VueDropdown',
		mixins: [VueUtil.component.emitter],
		directives: {
			Clickoutside: VueUtil.component.clickoutside()
		},
		components: {
			VueButton: VueButton(),
			VueButtonGroup: VueButtonGroup()
		},
		props: {
			trigger: {
				type: String,
				default: 'hover'
			},
			menuAlign: {
				type: String,
				default: 'end'
			},
			type: String,
			size: String,
			splitButton: Boolean,
			hideOnClick: {
				type: Boolean,
				default: true
			}
		},
		data: function() {
			return {
				timeout: null,
				visible: false
			};
		},
		mounted: function() {
			this.$on('menu-item-click', this.handleMenuItemClick);
			this.initEvent();
		},
		watch: {
			visible: function(val) {
				this.broadcast('VueDropdownMenu', 'visible', val);
			}
		},
		methods: {
			show: function() {
				var self = this;
				clearTimeout(self.timeout);
				self.timeout = setTimeout(function() {
					self.visible = true;
				}, 250);
			},
			hide: function() {
				var self = this;
				clearTimeout(self.timeout);
				self.timeout = setTimeout(function() {
					self.visible = false;
				}, 150);
			},
			handleClick: function() {
				this.visible = !this.visible;
			},
			initEvent: function() {
				var trigger = this.trigger
				 , show = this.show
				 , hide = this.hide
				 , handleClick = this.handleClick
				 , splitButton = this.splitButton;
				var triggerElm = splitButton ? this.$refs.trigger.$el : this.$slots.default[0].elm;
				if (trigger === 'hover') {
					triggerElm.addEventListener('mouseenter', show);
					triggerElm.addEventListener('mouseleave', hide);
					var dropdownElm = this.$slots.dropdown[0].elm;
					dropdownElm.addEventListener('mouseenter', show);
					dropdownElm.addEventListener('mouseleave', hide);
				} else if (trigger === 'click') {
					triggerElm.addEventListener('click', handleClick);
				}
			},
			handleMenuItemClick: function(command, instance) {
				if (this.hideOnClick) {
					this.visible = false;
				}
				this.$emit('command', command, instance);
			}
		},
		render: function(createElement) {
			var self = this;
			var hide = self.hide
			 , splitButton = self.splitButton
			 , type = self.type
			 , size = self.size;
			var handleClick = function() {
				self.$emit('click');
			};
			var triggerElm = !splitButton ? self.$slots.default : createElement('vue-button-group', null, [createElement('vue-button', {
				attrs: {
					type: type,
					size: size
				},
				nativeOn: {
					click: handleClick
				}
			}, [self.$slots.default]), createElement('vue-button', {
				ref: 'trigger',
				attrs: {
					type: type,
					size: size
				},
				class: 'vue-dropdown__caret-button'
			}, [createElement('i', {
				class: 'vue-dropdown__icon vue-icon-caret-bottom'
			}, [])])]);
			return createElement('div', {
				class: 'vue-dropdown',
				directives: [{
					name: 'clickoutside',
					value: hide
				}]
			}, [triggerElm, self.$slots.dropdown]);
		}
	};
	Vue.component(VueDropdown.name, VueDropdown);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueDropdownItem', this, function(Vue, VueUtil) {
	'use strict';
	var VueDropdownItem = {
		template: '<li class="vue-dropdown-menu__item" :class="{ \'is-disabled\': disabled, \'vue-dropdown-menu__item--divided\': divided }" @click="handleClick"><slot></slot></li>',
		name: 'VueDropdownItem',
		mixins: [VueUtil.component.emitter],
		props: {
			command: String,
			disabled: Boolean,
			divided: Boolean
		},
		methods: {
			handleClick: function(e) {
				this.dispatch('VueDropdown', 'menu-item-click', [this.command, this]);
			}
		}
	};
	Vue.component(VueDropdownItem.name, VueDropdownItem);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePopper'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePopper']);
		delete context[name];
	}
})('VueDropdownMenu', this, function(Vue, VuePopper) {
	'use strict';
	var VueDropdownMenu = {
		template: '<transition name="vue-zoom-in-top" @after-leave="doDestroy"><div class="vue-dropdown-menu" v-show="showPopper"><ul class="vue-dropdown-menu__view"><slot></slot></ul></div></transition>',
		name: 'VueDropdownMenu',
		componentName: 'VueDropdownMenu',
		mixins: [VuePopper()],
		created: function() {
			var self = this;
			self.$on('updatePopper', self.updatePopper);
			self.$on('visible', function(val) {
				self.showPopper = val;
			});
		},
		mounted: function() {
			this.$parent.popperElm = this.popperElm = this.$el;
			this.referenceElm = this.$parent.$el;
		},
		watch: {
			'$parent.menuAlign': {
				immediate: true,
				handler: function(val) {
					this.currentPlacement = 'bottom-' + val;
				}
			}
		}
	};
	Vue.component(VueDropdownMenu.name, VueDropdownMenu);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueCollapse', this, function(Vue) {
	'use strict';
	var VueCollapse = {
		template: '<div class="vue-collapse"><slot></slot></div>',
		name: 'VueCollapse',
		componentName: 'VueCollapse',
		props: {
			accordion: Boolean,
			value: {
				type: [Array, String, Number],
				default: function() {
					return [];
				}
			}
		},
		data: function() {
			return {
				activeNames: [].concat(this.value)
			};
		},
		watch: {
			value: function(value) {
				this.activeNames = [].concat(value);
			}
		},
		methods: {
			setActiveNames: function(activeNames) {
				activeNames = [].concat(activeNames);
				var value = this.accordion ? activeNames[0] : activeNames;
				this.activeNames = activeNames;
				this.$emit('input', value);
				this.$emit('change', value);
			},
			handleItemClick: function(item) {
				if (this.accordion) {
					this.setActiveNames(
						this.activeNames[0] &&
						this.activeNames[0] === item.name
						? '' : item.name
					);
				} else {
					var activeNames = this.activeNames.slice(0);
					var index = activeNames.indexOf(item.name);
					if (index > -1) {
						activeNames.splice(index, 1);
					} else {
						activeNames.push(item.name);
					}
					this.setActiveNames(activeNames);
				}
			}
		},
		created: function() {
			this.$on('item-click', this.handleItemClick);
		}
	};
	Vue.component(VueCollapse.name, VueCollapse);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueCollapseItem', this, function(Vue, VueUtil) {
	'use strict';
	var VueCollapseItem = {
		template: '<div class="vue-collapse-item" :class="{\'is-active\': isActive}"><div class="vue-collapse-item__header" @click="handleHeaderClick"><i class="vue-collapse-item__header__arrow vue-icon-arrow-right"></i><slot name="title">{{title}}</slot></div><collapse-transition><div class="vue-collapse-item__wrap" v-show="isActive"><div class="vue-collapse-item__content"><slot></slot></div></div></collapse-transition></div>',
		name: 'VueCollapseItem',
		componentName: 'VueCollapseItem',
		mixins: [VueUtil.component.emitter],
		components: {
			CollapseTransition: VueUtil.component.collapseTransition
		},
		data: function() {
			return {
				contentWrapStyle: {
					height: 'auto',
					display: 'block'
				},
				contentHeight: 0
			};
		},
		props: {
			title: String,
			name: {
				type: [String, Number],
				default: function() {
					return this._uid;
				}
			}
		},
		computed: {
			isActive: function() {
				return this.$parent.activeNames.indexOf(this.name) > -1;
			}
		},
		watch: {
			'isActive': function(value) {
			}
		},
		methods: {
			handleHeaderClick: function() {
				this.dispatch('VueCollapse', 'item-click', this);
			}
		},
		mounted: function() {
		}
	};
	Vue.component(VueCollapseItem.name, VueCollapseItem);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueBadge', this, function(Vue) {
	'use strict';
	var VueBadge = {
		template: '<div class="vue-badge"><slot></slot><transition name="vue-zoom-in-center"><sup v-show="!hidden && ( content || isDot )" v-text="content" class="vue-badge__content" :class="{ \'is-fixed\': $slots.default, \'is-dot\': isDot }"></sup></transition></div>',
		name: 'VueBadge',
		props: {
			value: {},
			max: Number,
			isDot: Boolean,
			hidden: Boolean
		},
		computed: {
			content: function() {
				if (this.isDot) return;
				var value = this.value;
				var max = this.max;
				if (typeof value === 'number' && typeof max === 'number') {
					return max < value ? max + '+' : value;
				}
				return value;
			}
		}
	};
	Vue.component(VueBadge.name, VueBadge);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueBreadcrumb', this, function(Vue) {
	'use strict';
	var VueBreadcrumb = {
		template: '<div class="vue-breadcrumb"><slot></slot></div>',
		name: 'VueBreadcrumb',
		props: {
			separator: {
				type: String,
				default: '/'
			}
		}
	};
	Vue.component(VueBreadcrumb.name, VueBreadcrumb);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueBreadcrumbItem', this, function(Vue) {
	'use strict';
	var VueBreadcrumbItem = {
		template: '<span class="vue-breadcrumb__item"><span class="vue-breadcrumb__item__inner" ref="link"><slot></slot></span><span class="vue-breadcrumb__separator">{{separator}}</span></span>',
		name: 'VueBreadcrumbItem',
		props: {
			to: {},
			replace: Boolean
		},
		data: function() {
			return {
				separator: ''
			};
		},
		mounted: function() {
			this.separator = this.$parent.separator;
			var self = this;
			var link = self.$refs.link;
			if (self.to) {
				link.addEventListener('click', function() {
					var to = self.to;
					if (self.$router) {
						self.replace ? self.$router.replace(to) : self.$router.push(to);
					}
				});
			} else {
				link.addEventListener('click', function() {
					self.$emit('click');
				});
			}
		}
	};
	Vue.component(VueBreadcrumbItem.name, VueBreadcrumbItem);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VuePopper', 'VueInput'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VuePopper'], context['VueInput']);
	}
})('VuePicker', this, function(Vue, VueUtil, VuePopper, VueInput) {
	'use strict';
	var NewPopper = {
		props: {
			appendToBody: VuePopper().props.appendToBody,
			offset: VuePopper().props.offset,
			boundariesPadding: VuePopper().props.boundariesPadding
		},
		methods: VuePopper().methods,
		data: VuePopper().data,
		beforeDestroy: VuePopper().beforeDestroy
	};
	var DEFAULT_FORMATS = {
		date: 'yyyy-MM-dd',
		month: 'yyyy-MM',
		datetime: 'yyyy-MM-dd HH:mm:ss',
		time: 'HH:mm:ss',
		timerange: 'HH:mm:ss',
		week: 'yyyywWW',
		daterange: 'yyyy-MM-dd',
		datetimerange: 'yyyy-MM-dd HH:mm:ss',
		year: 'yyyy'
	};
	var HAVE_TRIGGER_TYPES = ['date', 'datetime', 'time', 'time-select', 'week', 'month', 'year', 'daterange', 'timerange', 'datetimerange'];
	var DATE_FORMATTER = function(value, format) {
		return VueUtil.formatDate(value, format);
	};
	var DATE_PARSER = function(text, format) {
		return VueUtil.parseDate(text, format);
	};
	var RANGE_FORMATTER = function(value, format, separator) {
		if (Array.isArray(value) && value.length === 2) {
			var start = value[0];
			var end = value[1];
			if (start && end) {
				return VueUtil.formatDate(start, format) + separator + VueUtil.formatDate(end, format);
			}
		}
		return '';
	};
	var RANGE_PARSER = function(text, format, separator) {
		var array = text.split(separator);
		if (array.length === 2) {
			var range1 = array[0];
			var range2 = array[1];
			return [VueUtil.parseDate(range1, format), VueUtil.parseDate(range2, format)];
		}
		return [];
	};
	var TYPE_VALUE_RESOLVER_MAP = {
		default: {
			formatter: function(value) {
				if (!value)
					return '';
				return '' + value;
			},
			parser: function(text) {
				if (text === undefined || text === '')
					return null;
				return text;
			}
		},
		week: {
			formatter: function(value, format) {
				var date = VueUtil.formatDate(value, format);
				var week = VueUtil.component.getWeekNumber(value);
				date = /WW/.test(date) ? date.replace(/WW/, week < 10 ? '0' + week : week) : date.replace(/W/, week);
				return date;
			},
			parser: function(text) {
				var array = (text || '').split('w');
				if (array.length === 2) {
					var year = Number(array[0]);
					var month = Number(array[1]);
					if (!isNaN(year) && !isNaN(month) && month < 54) {
						return text;
					}
				}
				return null;
			}
		},
		date: {
			formatter: DATE_FORMATTER,
			parser: DATE_PARSER
		},
		datetime: {
			formatter: DATE_FORMATTER,
			parser: DATE_PARSER
		},
		daterange: {
			formatter: RANGE_FORMATTER,
			parser: RANGE_PARSER
		},
		datetimerange: {
			formatter: RANGE_FORMATTER,
			parser: RANGE_PARSER
		},
		timerange: {
			formatter: RANGE_FORMATTER,
			parser: RANGE_PARSER
		},
		time: {
			formatter: DATE_FORMATTER,
			parser: DATE_PARSER
		},
		month: {
			formatter: DATE_FORMATTER,
			parser: DATE_PARSER
		},
		year: {
			formatter: DATE_FORMATTER,
			parser: DATE_PARSER
		},
		number: {
			formatter: function(value) {
				if (!value)
					return '';
				return '' + value;
			},
			parser: function(text) {
				var result = Number(text);
				if (!isNaN(text)) {
					return result;
				} else {
					return null;
				}
			}
		}
	};
	var PLACEMENT_MAP = {
		left: 'bottom-start',
		center: 'bottom-center',
		right: 'bottom-end'
	};
	var VuePicker = {
		template: '<vue-input class="vue-date-editor" :class="\'vue-date-editor--\' + type" :readonly="readonly" :disabled="disabled" :size="size" v-clickoutside="handleClose" :placeholder="placeholder" @focus="handleFocus" @blur="handleBlur" @keydown.native="handleKeydown" :value="displayValue" @change.native="displayValue = $event.target.value" :validateEvent="false" ref="reference" ><i slot="icon" class="vue-input__icon" @click="handleClickIcon" :class="[showClose ? \'vue-icon-close\' : triggerClass]" @mouseenter="handleMouseEnterIcon" @mouseleave="showClose = false" v-if="haveTrigger"></i></vue-input>',
		mixins: [VueUtil.component.emitter, NewPopper],
		props: {
			size: String,
			format: String,
			readonly: {
				type: Boolean,
				default: true
			},
			placeholder: String,
			disabled: Boolean,
			clearable: {
				type: Boolean,
				default: true
			},
			popperClass: String,
			align: {
				type: String,
				default: 'left'
			},
			value: {},
			defaultValue: {},
			rangeSeparator: {
				default: ' - '
			},
			pickerOptions: {}
		},
		components: {
			VueInput: VueInput()
		},
		directives: {
			Clickoutside: VueUtil.component.clickoutside()
		},
		data: function() {
			return {
				pickerVisible: false,
				showClose: false,
				currentValue: '',
				unwatchPickerOptions: null
			};
		},
		watch: {
			pickerVisible: function(val) {
				if (!val)
					this.dispatch('VueFormItem', 'vue.form.blur');
				if (this.disabled)
					return;
				val ? this.showPicker() : this.hidePicker();
			},
			currentValue: function(val) {
				if (val)
					return;
				if (this.picker && typeof this.picker.handleClear === 'function') {
					this.picker.handleClear();
				} else {
					this.$emit('input');
				}
			},
			value: {
				immediate: true,
				handler: function(val) {
					this.currentValue = VueUtil.isDate(val) ? new Date(val) : val;
				}
			},
			displayValue: function(val) {
				this.$emit('change', val);
				this.dispatch('ElFormItem', 'el.form.change');
			}
		},
		computed: {
			reference: function() {
				return this.$refs.reference.$el;
			},
			refInput: function() {
				if (this.reference)
					return this.reference.querySelector('input');
				return {};
			},
			valueIsEmpty: function() {
				var val = this.currentValue;
				if (Array.isArray(val)) {
					for (var i = 0, len = val.length; i < len; i++) {
						if (val[i]) {
							return false;
						}
					}
				} else {
					if (val) {
						return false;
					}
				}
				return true;
			},
			triggerClass: function() {
				return this.type.indexOf('time') !== -1 ? 'vue-icon-time' : 'vue-icon-date';
			},
			selectionMode: function() {
				if (this.type === 'week') {
					return 'week';
				} else if (this.type === 'month') {
					return 'month';
				} else if (this.type === 'year') {
					return 'year';
				}
				return 'day';
			},
			haveTrigger: function() {
				if (typeof this.showTrigger !== 'undefined') {
					return this.showTrigger;
				}
				return HAVE_TRIGGER_TYPES.indexOf(this.type) !== -1;
			},
			displayValue: {
				get: function() {
					var value = this.currentValue;
					if (!value)
						return;
					var formatter = (TYPE_VALUE_RESOLVER_MAP[this.type] || TYPE_VALUE_RESOLVER_MAP['default']).formatter;
					var format = DEFAULT_FORMATS[this.type];
					return formatter(value, this.format || format, this.rangeSeparator);
				},
				set: function(value) {
					if (value) {
						var type = this.type;
						var parser = (TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP['default']).parser;
						var parsedValue = parser(value, this.format || DEFAULT_FORMATS[type], this.rangeSeparator);
						if (parsedValue && this.picker) {
							this.picker.value = parsedValue;
						}
					} else {
						this.$emit('input', value);
						this.picker.value = value;
					}
					this.$forceUpdate();
				}
			}
		},
		created: function() {
			this.popperOptions = {
				boundariesPadding: 0,
				gpuAcceleration: false
			};
			this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left;
		},
		methods: {
			handleMouseEnterIcon: function() {
				if (this.disabled)
					return;
				if (!this.valueIsEmpty && this.clearable) {
					this.showClose = true;
				}
			},
			handleClickIcon: function() {
				if (this.disabled)
					return;
				if (this.showClose) {
					this.currentValue = this.$options.defaultValue || '';
					this.showClose = false;
				} else {
					this.pickerVisible = !this.pickerVisible;
				}
			},
			dateChanged: function(dateA, dateB) {
				if (Array.isArray(dateA)) {
					var len = dateA.length;
					if (!dateB)
						return true;
					while (len--) {
						if (!VueUtil.equalDate(dateA[len], dateB[len]))
							return true;
					}
				} else {
					if (!VueUtil.equalDate(dateA, dateB))
						return true;
				}
				return false;
			},
			handleClose: function() {
				this.pickerVisible = false;
			},
			handleFocus: function() {
				var type = this.type;
				if (HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible) {
					this.pickerVisible = true;
				}
				this.$emit('focus', this);
			},
			handleBlur: function() {
				this.$emit('blur', this);
			},
			handleKeydown: function(event) {
				var keyCode = event.keyCode;
				if (keyCode === 9) {
					this.pickerVisible = false;
				}
			},
			hidePicker: function() {
				if (this.picker) {
					this.picker.resetView && this.picker.resetView();
					this.pickerVisible = this.picker.visible = false;
					this.destroyPopper();
				}
			},
			showPicker: function() {
				if (this.$isServer) return;
				var self = this;
				if (!self.picker) {
					self.mountPicker();
				}
				self.pickerVisible = self.picker.visible = true;
				self.updatePopper();
				if (self.currentValue instanceof Date) {
					self.picker.date = new Date(self.currentValue.getTime());
				} else {
					self.picker.value = self.currentValue;
				}
				self.picker.resetView && self.picker.resetView();
				self.$nextTick(function() {
					self.picker.ajustScrollTop && self.picker.ajustScrollTop();
				});
			},
			mountPicker: function() {
				var self = this;
				self.panel.defaultValue = self.defaultValue || self.currentValue;
				self.picker = new Vue(self.panel).$mount();
				self.picker.popperClass = self.popperClass;
				self.popperElm = self.picker.$el;
				self.picker.width = self.reference.getBoundingClientRect().width;
				self.picker.showTime = self.type === 'datetime' || self.type === 'datetimerange';
				self.picker.selectionMode = self.selectionMode;
				if (self.format) {
					self.picker.format = self.format;
				}
				var updateOptions = function() {
					var options = self.pickerOptions;
					if (options && options.selectableRange) {
						var ranges = options.selectableRange;
						var parser = TYPE_VALUE_RESOLVER_MAP.datetimerange.parser;
						var format = DEFAULT_FORMATS.timerange;
						ranges = Array.isArray(ranges) ? ranges : [ranges];
						self.picker.selectableRange = ranges.map(function(range) {return parser(range, format, self.rangeSeparator);});
					}
					for (var option in options) {
						if (options.hasOwnProperty(option) && option !== 'selectableRange') {
							self.picker[option] = options[option];
						}
					}
				};
				updateOptions();
				self.unwatchPickerOptions = self.$watch('pickerOptions', function() {updateOptions();}, { deep: true });
				self.$el.appendChild(self.picker.$el);
				self.picker.resetView && self.picker.resetView();
				self.picker.$on('dodestroy', self.doDestroy);
				self.picker.$on('pick', function(date, visible) {
					date = date||'';
					visible = visible||false;
					self.$emit('input', date);
					self.pickerVisible = self.picker.visible = visible;
					self.picker.resetView && self.picker.resetView();
				});
				self.picker.$on('select-range', function(start, end) {
					self.refInput.setSelectionRange(start, end);
					self.refInput.focus();
				});
			},
			unmountPicker: function() {
				if (this.picker) {
					this.picker.$destroy();
					this.picker.$off();
					if (typeof this.unwatchPickerOptions === 'function') {
						this.unwatchPickerOptions();
					}
					this.picker.$el.parentNode.removeChild(this.picker.$el);
				}
			}
		}
	};
	return function() {
		return VuePicker;
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePicker'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePicker']);
		delete context[name];
	}
})('VueTimeSelect', this, function(Vue, VuePicker) {
	'use strict';
	var parseTime = function(time) {
		var values = ('' || time).split(':');
		if (values.length >= 2) {
			var hours = parseInt(values[0], 10);
			var minutes = parseInt(values[1], 10);
			return {
				hours: hours,
				minutes: minutes
			};
		}
		return null;
	};
	var compareTime = function(time1, time2) {
		var value1 = parseTime(time1);
		var value2 = parseTime(time2);
		var minutes1 = value1.minutes + value1.hours * 60;
		var minutes2 = value2.minutes + value2.hours * 60;
		if (minutes1 === minutes2) {
			return 0;
		}
		return minutes1 > minutes2 ? 1 : -1;
	};
	var formatTime = function(time) {
		return (time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes);
	};
	var nextTime = function(time, step) {
		var timeValue = parseTime(time);
		var stepValue = parseTime(step);
		var next = {
			hours: timeValue.hours,
			minutes: timeValue.minutes
		};
		next.minutes += stepValue.minutes;
		next.hours += stepValue.hours;
		next.hours += Math.floor(next.minutes / 60);
		next.minutes = next.minutes % 60;
		return formatTime(next);
	};
	var TimeSelect = {
		template: '<transition name="vue-zoom-in-top" @after-leave="$emit(\'dodestroy\')"><div v-show="visible" :style="{ width: width + \'px\' }" :class="popperClass" class="vue-picker-panel time-select"><div class="vue-picker-panel__content"><div class="time-select-item" v-for="item in items" :class="{ selected: value === item.value, disabled: item.disabled }" :disabled="item.disabled" @click="handleClick(item)">{{ item.value }}</div></div></div></transition>',
		watch: {
			value: function(val) {
				if (!val) return;
				if (this.minTime && compareTime(val, this.minTime) < 0) {
					this.$emit('pick');
				} else if (this.maxTime && compareTime(val, this.maxTime) > 0) {
					this.$emit('pick');
				}
			}
		},
		methods: {
			handleClick: function(item) {
				if (!item.disabled) {
					this.$emit('pick', item.value);
				}
			},
			handleClear: function() {
				this.$emit('pick');
			}
		},
		data: function() {
			return {
				popperClass: '',
				start: '09:00',
				end: '18:00',
				step: '00:30',
				value: '',
				visible: false,
				minTime: '',
				maxTime: '',
				width: 0
			};
		},
		computed: {
			items: function() {
				var start = this.start;
				var end = this.end;
				var step = this.step;
				var result = [];
				if (start && end && step) {
					var current = start;
					while (compareTime(current, end) <= 0) {
						result.push({
							value: current,
							disabled: compareTime(current, this.minTime || '-1:-1') <= 0 ||
								compareTime(current, this.maxTime || '100:100') >= 0
						});
						current = nextTime(current, step);
					}
				}
				return result;
			}
		}
	};
	var VueTimeSelect = {
		mixins: [VuePicker()],
		name: 'VueTimeSelect',
		beforeCreate: function() {
			this.type = 'time-select';
			this.panel = TimeSelect;
		}
	};
	Vue.component(VueTimeSelect.name, VueTimeSelect);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePicker', 'VueUtil', 'VueScrollbar'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VuePicker'], context['VueUtil'], context['VueScrollbar']);
	}
})('VueTimePicker', this, function(Vue, VuePicker, VueUtil, VueScrollbar) {
	'use strict';
	var MIN_TIME = VueUtil.parseDate('00:00:00', 'HH:mm:ss');
	var MAX_TIME = VueUtil.parseDate('23:59:59', 'HH:mm:ss');
	var isDisabled = function(minTime, maxTime) {
		var minValue = minTime.getHours() * 3600 + minTime.getMinutes() * 60 + minTime.getSeconds();
		var maxValue = maxTime.getHours() * 3600 + maxTime.getMinutes() * 60 + maxTime.getSeconds();
		return minValue > maxValue;
	};
	var clacTime = function(time) {
		time = Array.isArray(time) ? time : [time];
		var minTime = time[0] || new Date();
		var date = new Date();
		date.setHours(date.getHours() + 1);
		var maxTime = time[1] || date;
		if (minTime > maxTime) return clacTime();
		return { minTime: minTime, maxTime: maxTime };
	};
	var TimeSpinner = {
		template: '<div class="vue-time-spinner" :class="{ \'has-seconds\': showSeconds }"><vue-scrollbar noresize @mouseenter.native="emitSelectRange(\'hours\')" class="vue-time-spinner__wrapper" wrap-style="max-height: inherit;" view-class="vue-time-spinner__list" noresize tag="ul" ref="hour"><li @click="handleClick(\'hours\', { value: hour, disabled: disabled }, true)" v-for="(disabled, hour) in hoursList" track-by="hour" class="vue-time-spinner__item" :class="{ \'active\': hour === hours, \'disabled\': disabled }" v-text="hour"></li></vue-scrollbar><vue-scrollbar @mouseenter.native="emitSelectRange(\'minutes\')" class="vue-time-spinner__wrapper" wrap-style="max-height: inherit;" view-class="vue-time-spinner__list" noresize tag="ul" ref="minute"><li @click="handleClick(\'minutes\', key, true)" v-for="(minute, key) in 60" class="vue-time-spinner__item" :class="{ \'active\': key === minutes }" v-text="key"></li></vue-scrollbar><vue-scrollbar v-show="showSeconds" @mouseenter.native="emitSelectRange(\'seconds\')" class="vue-time-spinner__wrapper" wrap-style="max-height: inherit;" view-class="vue-time-spinner__list" noresize tag="ul" ref="second"><li @click="handleClick(\'seconds\', key, true)" v-for="(second, key) in 60" class="vue-time-spinner__item" :class="{ \'active\': key === seconds }" v-text="key"></li></vue-scrollbar></div>',
		components: {
			VueScrollbar: VueScrollbar()
		},
		props: {
			hours: {
				type: Number,
				default: 0
			},
			minutes: {
				type: Number,
				default: 0
			},
			seconds: {
				type: Number,
				default: 0
			},
			showSeconds: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			hoursPrivate: function(newVal, oldVal) {
				if (!(newVal >= 0 && newVal <= 23)) {
					this.hoursPrivate = oldVal;
				}
				this.ajustElTop('hour', newVal);
				this.$emit('change', { hours: newVal });
			},
			minutesPrivate: function(newVal, oldVal) {
				if (!(newVal >= 0 && newVal <= 59)) {
					this.minutesPrivate = oldVal;
				}
				this.ajustElTop('minute', newVal);
				this.$emit('change', { minutes: newVal });
			},
			secondsPrivate: function(newVal, oldVal) {
				if (!(newVal >= 0 && newVal <= 59)) {
					this.secondsPrivate = oldVal;
				}
				this.ajustElTop('second', newVal);
				this.$emit('change', { seconds: newVal });
			}
		},
		computed: {
			hoursList: function() {
				return VueUtil.component.getRangeHours(this.selectableRange);
			},
			hourVue: function() {
				return this.$refs.hour.wrap;
			},
			minuteVue: function() {
				return this.$refs.minute.wrap;
			},
			secondVue: function() {
				return this.$refs.second.wrap;
			}
		},
		data: function() {
			return {
				hoursPrivate: 0,
				minutesPrivate: 0,
				secondsPrivate: 0,
				selectableRange: []
			};
		},
		created: function() {
			var self = this;
			self.debounceAjustElTop = VueUtil.component.debounce(100, function(type) {self.ajustElTop(type, self[type + 's']);});
		},
		mounted: function() {
			var self = this;
			self.$nextTick(function() {
				self.bindScrollEvent();
			});
		},
		methods: {
			handleClick: function(type, value, disabled) {
				if (value.disabled) {
					return;
				}
				this[type + 'Private'] = value.value >= 0 ? value.value : value;
				this.emitSelectRange(type);
			},
			emitSelectRange: function(type) {
				if (type === 'hours') {
					this.$emit('select-range', 0, 2);
				} else if (type === 'minutes') {
					this.$emit('select-range', 3, 5);
				} else if (type === 'seconds') {
					this.$emit('select-range', 6, 8);
				}
			},
			bindScrollEvent: function() {
				var self = this;
				var bindFuntion = function(type) {
					self[type + 'Vue'].onscroll = function(e) {self.handleScroll(type, e);}
				};
				bindFuntion('hour');
				bindFuntion('minute');
				bindFuntion('second');
			},
			handleScroll: function(type) {
				var ajust = {};
				ajust[type + 's'] = Math.min(Math.floor((this[type + 'Vue'].scrollTop - 80) / 32 + 3), 59);
				this.debounceAjustElTop(type);
				this.$emit('change', ajust);
			},
			ajustScrollTop: function() {
				this.ajustElTop('hour', this.hours);
				this.ajustElTop('minute', this.minutes);
				this.ajustElTop('second', this.seconds);
			},
			ajustElTop: function(type, value) {
				this[type + 'Vue'].scrollTop = Math.max(0, (value - 2.5) * 32 + 80);
			}
		}
	};
	var TimePanel = {
		template: '<transition name="vue-zoom-in-top" @after-leave="$emit(\'dodestroy\')"><div v-show="currentVisible" :style="{width: width + \'px\'}" class="vue-time-panel" :class="popperClass"><div class="vue-time-panel__content" :class="{ \'has-seconds\': showSeconds }"><time-spinner ref="spinner" @change="handleChange" :show-seconds="showSeconds" @select-range="setSelectionRange" :hours="hours" :minutes="minutes" :seconds="seconds"></time-spinner></div><div class="vue-time-panel__footer"><button type="button" class="vue-time-panel__btn cancel" @click="handleCancel">{{ cancelLabel }}</button><button type="button" class="vue-time-panel__btn confirm" @click="handleConfirm()">{{ confirmLabel }}</button></div></div></transition>',
		components: {
			TimeSpinner: TimeSpinner
		},
		props: {
			pickerWidth: {},
			date: {
				default: function() {
					return new Date();
				}
			},
			visible: Boolean
		},
		watch: {
			visible: function(val) {
				this.currentVisible = val;
			},
			pickerWidth: function(val) {
				this.width = val;
			},
			value: function(newVal) {
				var self = this;
				var date;
				if (newVal instanceof Date) {
					date = VueUtil.component.limitRange(newVal, self.selectableRange);
				} else if (!newVal) {
					date = new Date();
				}
				self.handleChange({
					hours: date.getHours(),
					minutes: date.getMinutes(),
					seconds: date.getSeconds()
				});
				self.$nextTick(function() {self.ajustScrollTop();});
			},
			selectableRange: function(val) {
				this.$refs.spinner.selectableRange = val;
			}
		},
		data: function() {
			return {
				popperClass: '',
				format: 'HH:mm:ss',
				value: '',
				hours: 0,
				minutes: 0,
				seconds: 0,
				selectableRange: [],
				currentDate: this.$options.defaultValue || this.date || new Date(),
				currentVisible: this.visible || false,
				width: this.pickerWidth || 0
			};
		},
		computed: {
			showSeconds: function() {
				return (this.format || '').indexOf('ss') !== -1;
			},
			confirmLabel: function() {
				return this.$t('vue.datepicker.confirm');
			},
			cancelLabel: function() {
				return this.$t('vue.datepicker.cancel');
			}
		},
		methods: {
			handleClear: function() {
				this.$emit('pick');
			},
			handleCancel: function() {
				this.$emit('pick');
			},
			handleChange: function(date) {
				if (date.hours !== undefined) {
					this.currentDate.setHours(date.hours);
					this.hours = this.currentDate.getHours();
				}
				if (date.minutes !== undefined) {
					this.currentDate.setMinutes(date.minutes);
					this.minutes = this.currentDate.getMinutes();
				}
				if (date.seconds !== undefined) {
					this.currentDate.setSeconds(date.seconds);
					this.seconds = this.currentDate.getSeconds();
				}
				this.handleConfirm(true);
			},
			setSelectionRange: function(start, end) {
				this.$emit('select-range', start, end);
			},
			handleConfirm: function(visible, first) {
				visible = visible||false;
				if (first) return;
				var date = new Date(VueUtil.component.limitRange(this.currentDate, this.selectableRange, 'HH:mm:ss'));
				this.$emit('pick', date, visible, first);
			},
			ajustScrollTop: function() {
				return this.$refs.spinner.ajustScrollTop();
			}
		},
		created: function() {
			this.hours = this.currentDate.getHours();
			this.minutes = this.currentDate.getMinutes();
			this.seconds = this.currentDate.getSeconds();
		},
		mounted: function() {
			var self = this;
			self.$nextTick(function() {self.handleConfirm(true, true);});
			self.$emit('mounted');
		}
	};
	var TimeRangePanel = {
		template: '<transition name="vue-zoom-in-top" @before-enter="panelCreated" @after-leave="$emit(\'dodestroy\')"><div v-show="visible" :style="{ width: width + \'px\' }" class="vue-time-range-picker vue-picker-panel" :class="popperClass"><div class="vue-time-range-picker__content"><div class="vue-time-range-picker__cell"><div class="vue-time-range-picker__header">{{ $t(\'vue.datepicker.startTime\') }}</div><div :class="{ \'has-seconds\': showSeconds }" class="vue-time-range-picker__body vue-time-panel__content"><time-spinner ref="minSpinner" :show-seconds="showSeconds" @change="handleMinChange" @select-range="setMinSelectionRange" :hours="minHours" :minutes="minMinutes" :seconds="minSeconds"></time-spinner></div></div><div class="vue-time-range-picker__cell"><div class="vue-time-range-picker__header">{{ $t(\'vue.datepicker.endTime\') }}</div><div :class="{ \'has-seconds\': showSeconds }" class="vue-time-range-picker__body vue-time-panel__content"><time-spinner ref="maxSpinner" :show-seconds="showSeconds" @change="handleMaxChange" @select-range="setMaxSelectionRange" :hours="maxHours" :minutes="maxMinutes" :seconds="maxSeconds"></time-spinner></div></div></div><div class="vue-time-panel__footer"><button type="button" class="vue-time-panel__btn cancel" @click="handleCancel()">{{ cancelLabel }}</button><button type="button" class="vue-time-panel__btn confirm" @click="handleConfirm()" :disabled="btnDisabled">{{ confirmLabel }}</button></div></div></transition>',
		components: {
			TimeSpinner: TimeSpinner
		},
		computed: {
			showSeconds: function() {
				return (this.format || '').indexOf('ss') !== -1;
			},
			confirmLabel: function() {
				return this.$t('vue.datepicker.confirm');
			},
			cancelLabel: function() {
				return this.$t('vue.datepicker.cancel');
			}
		},
		props: ['value'],
		data: function() {
			var time = clacTime(this.$options.defaultValue);
			return {
				popperClass: '',
				minTime: time.minTime,
				maxTime: time.maxTime,
				btnDisabled: isDisabled(time.minTime, time.maxTime),
				maxHours: time.maxTime.getHours(),
				maxMinutes: time.maxTime.getMinutes(),
				maxSeconds: time.maxTime.getSeconds(),
				minHours: time.minTime.getHours(),
				minMinutes: time.minTime.getMinutes(),
				minSeconds: time.minTime.getSeconds(),
				format: 'HH:mm:ss',
				visible: false,
				width: 0
			};
		},
		watch: {
			value: function(newVal) {
				var self = this;
				self.panelCreated();
				self.$nextTick(function() {self.ajustScrollTop();});
			}
		},
		methods: {
			panelCreated: function() {
				var time = clacTime(this.value);
				if (time.minTime === this.minTime && time.maxTime === this.maxTime) {
					return;
				}
				this.handleMinChange({
					hours: time.minTime.getHours(),
					minutes: time.minTime.getMinutes(),
					seconds: time.minTime.getSeconds()
				});
				this.handleMaxChange({
					hours: time.maxTime.getHours(),
					minutes: time.maxTime.getMinutes(),
					seconds: time.maxTime.getSeconds()
				});
			},
			handleClear: function() {
				this.handleCancel();
			},
			handleCancel: function() {
				this.$emit('pick');
			},
			handleChange: function() {
				if (this.minTime > this.maxTime) return;
				MIN_TIME.setFullYear(this.minTime.getFullYear());
				MIN_TIME.setMonth(this.minTime.getMonth(), this.minTime.getDate());
				MAX_TIME.setFullYear(this.maxTime.getFullYear());
				MAX_TIME.setMonth(this.maxTime.getMonth(), this.maxTime.getDate());
				this.$refs.minSpinner.selectableRange = [[MIN_TIME, this.maxTime]];
				this.$refs.maxSpinner.selectableRange = [[this.minTime, MAX_TIME]];
				this.handleConfirm(true);
			},
			handleMaxChange: function(date) {
				if (date.hours !== undefined) {
					this.maxTime.setHours(date.hours);
					this.maxHours = this.maxTime.getHours();
				}
				if (date.minutes !== undefined) {
					this.maxTime.setMinutes(date.minutes);
					this.maxMinutes = this.maxTime.getMinutes();
				}
				if (date.seconds !== undefined) {
					this.maxTime.setSeconds(date.seconds);
					this.maxSeconds = this.maxTime.getSeconds();
				}
				this.handleChange();
			},
			handleMinChange: function(date) {
				if (date.hours !== undefined) {
					this.minTime.setHours(date.hours);
					this.minHours = this.minTime.getHours();
				}
				if (date.minutes !== undefined) {
					this.minTime.setMinutes(date.minutes);
					this.minMinutes = this.minTime.getMinutes();
				}
				if (date.seconds !== undefined) {
					this.minTime.setSeconds(date.seconds);
					this.minSeconds = this.minTime.getSeconds();
				}
				this.handleChange();
			},
			setMinSelectionRange: function(start, end) {
				this.$emit('select-range', start, end);
			},
			setMaxSelectionRange: function(start, end) {
				this.$emit('select-range', start + 11, end + 11);
			},
			handleConfirm: function(visible, first) {
				visible = visible||false;
				first = first||false;
				var minSelectableRange = this.$refs.minSpinner.selectableRange;
				var maxSelectableRange = this.$refs.maxSpinner.selectableRange;
				this.minTime = VueUtil.component.limitRange(this.minTime, minSelectableRange);
				this.maxTime = VueUtil.component.limitRange(this.maxTime, maxSelectableRange);
				if (first) return;
				this.$emit('pick', [this.minTime, this.maxTime], visible, first);
			},
			ajustScrollTop: function() {
				this.$refs.minSpinner.ajustScrollTop();
				this.$refs.maxSpinner.ajustScrollTop();
			}
		},
		mounted: function() {
			var self = this;
			self.$nextTick(function() {self.handleConfirm(true, true);});
		}
	};
	var VueTimePicker = {
		mixins: [VuePicker()],
		name: 'VueTimePicker',
		props: {
			isRange: Boolean
		},
		data: function() {
			return {
				type: ''
			};
		},
		watch: {
			isRange: function(isRange) {
				if (this.picker) {
					this.unmountPicker();
					this.type = isRange ? 'timerange' : 'time';
					this.panel = isRange ? TimeRangePanel : TimePanel;
					this.mountPicker();
				} else {
					this.type = isRange ? 'timerange' : 'time';
					this.panel = isRange ? TimeRangePanel : TimePanel;
				}
			}
		},
		created: function() {
			this.type = this.isRange ? 'timerange' : 'time';
			this.panel = this.isRange ? TimeRangePanel : TimePanel;
		}
	};
	Vue.component(VueTimePicker.name, VueTimePicker);
	return function() {
		return {
			VueTimePicker: VueTimePicker,
			TimePicker: TimePanel
		}
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VuePicker', 'VueUtil', 'VueTimePicker', 'VueInput'], definition);
	} else {
		context['VueDatePicker'] = definition(context['Vue'], context['VuePicker'], context['VueUtil'], context['VueTimePicker'], context['VueInput']);
	}
})('VueDatePicker', this, function(Vue, VuePicker, VueUtil, VueTimePicker, VueInput) {
	'use strict';
	var DAY_DURATION = 86400000;
	var WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
	var clearHours = function(time) {
		var cloneDate = new Date(time);
		cloneDate.setHours(0, 0, 0, 0);
		return cloneDate.getTime();
	};
	var YearTable = {
		template: '<table @click="handleYearTableClick" class="vue-year-table"><tbody><tr><td class="available" :class="getCellStyle(startYear + 0)"><a class="cell">{{ startYear }}</a></td><td class="available" :class="getCellStyle(startYear + 1)"><a class="cell">{{ startYear + 1 }}</a></td><td class="available" :class="getCellStyle(startYear + 2)"><a class="cell">{{ startYear + 2 }}</a></td><td class="available" :class="getCellStyle(startYear + 3)"><a class="cell">{{ startYear + 3 }}</a></td></tr><tr><td class="available" :class="getCellStyle(startYear + 4)"><a class="cell">{{ startYear + 4 }}</a></td><td class="available" :class="getCellStyle(startYear + 5)"><a class="cell">{{ startYear + 5 }}</a></td><td class="available" :class="getCellStyle(startYear + 6)"><a class="cell">{{ startYear + 6 }}</a></td><td class="available" :class="getCellStyle(startYear + 7)"><a class="cell">{{ startYear + 7 }}</a></td></tr><tr><td class="available" :class="getCellStyle(startYear + 8)"><a class="cell">{{ startYear + 8 }}</a></td><td class="available" :class="getCellStyle(startYear + 9)"><a class="cell">{{ startYear + 9 }}</a></td><td></td><td></td></tr></tbody></table>',
		props: {
			disabledDate: {},
			date: {},
			year: {}
		},
		computed: {
			startYear: function() {
				return Math.floor(this.year / 10) * 10;
			}
		},
		methods: {
			getCellStyle: function(year) {
				var style = {};
				var date = new Date(this.date);
				date.setFullYear(year);
				style.disabled = typeof this.disabledDate === 'function' && this.disabledDate(date);
				style.current = Number(this.year) === year;
				return style;
			},
			nextTenYear: function() {
				this.$emit('pick', Number(this.year) + 10, false);
			},
			prevTenYear: function() {
				this.$emit('pick', Number(this.year) - 10, false);
			},
			handleYearTableClick: function(event) {
				var target = event.target;
				if (target.tagName === 'A') {
					if (VueUtil.hasClass(target.parentNode, 'disabled'))
						return;
					var year = target.textContent || target.innerText;
					this.$emit('pick', year);
				}
			}
		}
	};
	var MonthTable = {
		template: '<table @click="handleMonthTableClick" class="vue-month-table"><tbody><tr><td :class="getCellStyle(0)"><a class="cell">{{ $t(\'vue.datepicker.months.jan\') }}</a></td><td :class="getCellStyle(1)"><a class="cell">{{ $t(\'vue.datepicker.months.feb\') }}</a></td><td :class="getCellStyle(2)"><a class="cell">{{ $t(\'vue.datepicker.months.mar\') }}</a></td><td :class="getCellStyle(3)"><a class="cell">{{ $t(\'vue.datepicker.months.apr\') }}</a></td></tr><tr><td :class="getCellStyle(4)"><a class="cell">{{ $t(\'vue.datepicker.months.may\') }}</a></td><td :class="getCellStyle(5)"><a class="cell">{{ $t(\'vue.datepicker.months.jun\') }}</a></td><td :class="getCellStyle(6)"><a class="cell">{{ $t(\'vue.datepicker.months.jul\') }}</a></td><td :class="getCellStyle(7)"><a class="cell">{{ $t(\'vue.datepicker.months.aug\') }}</a></td></tr><tr><td :class="getCellStyle(8)"><a class="cell">{{ $t(\'vue.datepicker.months.sep\') }}</a></td><td :class="getCellStyle(9)"><a class="cell">{{ $t(\'vue.datepicker.months.oct\') }}</a></td><td :class="getCellStyle(10)"><a class="cell">{{ $t(\'vue.datepicker.months.nov\') }}</a></td><td :class="getCellStyle(11)"><a class="cell">{{ $t(\'vue.datepicker.months.dec\') }}</a></td></tr></tbody></table>',
		props: {
			disabledDate: {},
			date: {},
			month: {
				type: Number
			}
		},
		methods: {
			getCellStyle: function(month) {
				var style = {};
				var date = new Date(this.date);
				date.setMonth(month);
				style.disabled = typeof this.disabledDate === 'function' && this.disabledDate(date);
				style.current = this.month === month;
				return style;
			},
			handleMonthTableClick: function(event) {
				var target = event.target;
				if (target.tagName !== 'A')
					return;
				if (VueUtil.hasClass(target.parentNode, 'disabled'))
					return;
				var column = target.parentNode.cellIndex;
				var row = target.parentNode.parentNode.rowIndex;
				var month = row * 4 + column;
				this.$emit('pick', month);
			}
		}
	};
	var DateTable = {
		template: '<table cellspacing="0" cellpadding="0" class="vue-date-table" @click="handleClick" @mousemove="handleMouseMove" :class="{ \'is-week-mode\': selectionMode === \'week\' }"><tbody><tr><th v-if="showWeekNumber">{{ $t(\'vue.datepicker.week\') }}</th><th v-for="week in WEEKS">{{ $t(\'vue.datepicker.weeks.\'+week) }}</th></tr><tr class="vue-date-table__row" v-for="row in rows" :class="{ current: isWeekActive(row[1]) }"><td v-for="cell in row" :class="getCellClasses(cell)" v-text="cell.text"></td></tr></tbody></table>',
		props: {
			firstDayOfWeek: {
				default: 7,
				type: Number,
				validator: function(val) {
					return val >= 1 && val <= 7
				}
			},
			date: {},
			year: {},
			month: {},
			week: {},
			events: {
				type: Array,
				default: function() {
					return [];
				}
			},
			selectionMode: {
				default: 'day'
			},
			showWeekNumber: {
				type: Boolean,
				default: false
			},
			disabledDate: {},
			minDate: {},
			maxDate: {},
			rangeState: {
				default: function() {
					return {
						endDate: null,
						selecting: false,
						row: null,
						column: null
					};
				}
			}
		},
		computed: {
			offsetDay: function() {
				var week = this.firstDayOfWeek;
				return week > 3 ? 7 - week : -week;
			},
			WEEKS: function() {
				var week = this.firstDayOfWeek;
				return WEEKS.concat(WEEKS).slice(week, week + 7);
			},
			monthDate: function() {
				return this.date.getDate();
			},
			startDate: function() {
				return VueUtil.component.getStartDateOfMonth(this.year, this.month);
			},
			rows: function() {
				var date = new Date(this.year,this.month,1);
				var day = VueUtil.component.getFirstDayOfMonth(date);
				var dateCountOfMonth = VueUtil.component.getDayCountOfMonth(date.getFullYear(), date.getMonth());
				var dateCountOfLastMonth = VueUtil.component.getDayCountOfMonth(date.getFullYear(), (date.getMonth() === 0 ? 11 : date.getMonth() - 1));
				day = (day === 0 ? 7 : day);
				var offset = this.offsetDay;
				var rows = this.tableRows;
				var count = 1;
				var firstDayPosition;
				var startDate = this.startDate;
				var disabledDate = this.disabledDate;
				var now = clearHours(new Date());
				for (var i = 0; i < 6; i++) {
					var row = rows[i];
					if (this.showWeekNumber) {
						if (!row[0]) {
							row[0] = {
								type: 'week',
								text: VueUtil.component.getWeekNumber(new Date(startDate.getTime() + DAY_DURATION * (i * 7 + 1)))
							};
						}
					}
					for (var j = 0; j < 7; j++) {
						var cell = row[this.showWeekNumber ? j + 1 : j];
						if (!cell) {
							cell = {
								row: i,
								column: j,
								type: 'normal',
								inRange: false,
								start: false,
								end: false
							};
						}
						cell.type = 'normal';
						var index = i * 7 + j;
						var time = startDate.getTime() + DAY_DURATION * (index - offset);
						cell.inRange = time >= clearHours(this.minDate) && time <= clearHours(this.maxDate);
						cell.start = this.minDate && time === clearHours(this.minDate);
						cell.end = this.maxDate && time === clearHours(this.maxDate);
						var isToday = time === now;
						if (isToday) {
							cell.type = 'today';
						}
						if (i >= 0 && i <= 1) {
							if (j + i * 7 >= (day + offset)) {
								cell.text = count++;
								if (count === 2) {
									firstDayPosition = i * 7 + j;
								}
							} else {
								cell.text = dateCountOfLastMonth - (day + offset - j % 7) + 1 + i * 7;
								cell.type = 'prev-month';
							}
						} else {
							if (count <= dateCountOfMonth) {
								cell.text = count++;
								if (count === 2) {
									firstDayPosition = i * 7 + j;
								}
							} else {
								cell.text = count++ - dateCountOfMonth;
								cell.type = 'next-month';
							}
						}
						cell.disabled = typeof disabledDate === 'function' && disabledDate(new Date(time));
						cell.event = false;
						if (cell.type === 'today' || cell.type === 'normal') {
							if (this.events && this.events.length>0) {
								var cellDate = new Date(this.year, this.month, cell.text);
								this.events.forEach(function(event){
									if (event.date
									 && VueUtil.formatDate(event.date) === VueUtil.formatDate(cellDate)) {
										cell.event = true;
									}
								});
							}
						}
						this.$set(row, this.showWeekNumber ? j + 1 : j, cell);
					}
					if (this.selectionMode === 'week') {
						var start = this.showWeekNumber ? 1 : 0;
						var end = this.showWeekNumber ? 7 : 6;
						var isWeekActive = this.isWeekActive(row[start + 1]);
						row[start].inRange = isWeekActive;
						row[start].start = isWeekActive;
						row[end].inRange = isWeekActive;
						row[end].end = isWeekActive;
					}
				}
				rows.firstDayPosition = firstDayPosition;
				return rows;
			}
		},
		watch: {
			'rangeState.endDate': function(newVal) {
				this.markRange(newVal);
			},
			minDate: function(newVal, oldVal) {
				if (newVal && !oldVal) {
					this.rangeState.selecting = true;
					this.markRange(newVal);
				} else if (!newVal) {
					this.rangeState.selecting = false;
					this.markRange(newVal);
				} else {
					this.markRange();
				}
			},
			maxDate: function(newVal, oldVal) {
				if (newVal && !oldVal) {
					this.rangeState.selecting = false;
					this.markRange(newVal);
					this.$emit('pick', {
						minDate: this.minDate,
						maxDate: this.maxDate
					});
				}
			}
		},
		data: function() {
			return {
				tableRows: [[], [], [], [], [], []]
			};
		},
		methods: {
			getCellClasses: function(cell) {
				var selectionMode = this.selectionMode;
				var monthDate = this.monthDate;
				var classes = [];
				if ((cell.type === 'normal' || cell.type === 'today') && !cell.disabled) {
					classes.push('available');
					if (cell.type === 'today') {
						classes.push('today');
					}
				} else {
					classes.push(cell.type);
				}
				if (selectionMode === 'day' && (cell.type === 'normal' || cell.type === 'today') && Number(this.year) === this.date.getFullYear() && this.month === this.date.getMonth() && monthDate === Number(cell.text)) {
					classes.push('current');
				}
				if (cell.inRange && ((cell.type === 'normal' || cell.type === 'today') || this.selectionMode === 'week')) {
					classes.push('in-range');
					if (cell.start) {
						classes.push('start-date');
					}
					if (cell.end) {
						classes.push('end-date');
					}
				}
				if (cell.disabled) {
					classes.push('disabled');
				}
				if (cell.event) {
					classes.push('event-date');
				}
				return classes.join(' ');
			},
			getDateOfCell: function(row, column) {
				var startDate = this.startDate;
				return new Date(startDate.getTime() + (row * 7 + (column - (this.showWeekNumber ? 1 : 0)) - this.offsetDay) * DAY_DURATION);
			},
			getCellByDate: function(date) {
				var startDate = this.startDate;
				var rows = this.rows;
				var index = (date - startDate) / DAY_DURATION;
				var row = rows[Math.floor(index / 7)];
				if (this.showWeekNumber) {
					return row[index % 7 + 1];
				} else {
					return row[index % 7];
				}
			},
			isWeekActive: function(cell) {
				if (this.selectionMode !== 'week')
					return false;
				var newDate = new Date(this.year,this.month,1);
				var year = newDate.getFullYear();
				var month = newDate.getMonth();
				if (cell.type === 'prev-month') {
					newDate.setMonth(month === 0 ? 11 : month - 1);
					newDate.setFullYear(month === 0 ? year - 1 : year);
				}
				if (cell.type === 'next-month') {
					newDate.setMonth(month === 11 ? 0 : month + 1);
					newDate.setFullYear(month === 11 ? year + 1 : year);
				}
				newDate.setDate(parseInt(cell.text, 10));
				return VueUtil.component.getWeekNumber(newDate) === this.week;
			},
			markRange: function(maxDate) {
				var startDate = this.startDate;
				if (!maxDate) {
					maxDate = this.maxDate;
				}
				var rows = this.rows;
				var minDate = this.minDate;
				for (var i = 0, k = rows.length; i < k; i++) {
					var row = rows[i];
					for (var j = 0, l = row.length; j < l; j++) {
						if (this.showWeekNumber && j === 0)
							continue;
						var cell = row[j];
						var index = i * 7 + j + (this.showWeekNumber ? -1 : 0);
						var time = startDate.getTime() + DAY_DURATION * (index - this.offsetDay);
						cell.inRange = minDate && time >= clearHours(minDate) && time <= clearHours(maxDate);
						cell.start = minDate && time === clearHours(minDate.getTime());
						cell.end = maxDate && time === clearHours(maxDate.getTime());
					}
				}
			},
			handleMouseMove: function(event) {
				if (!this.rangeState.selecting)
					return;
				this.$emit('changerange', {
					minDate: this.minDate,
					maxDate: this.maxDate,
					rangeState: this.rangeState
				});
				var target = event.target;
				if (target.tagName !== 'TD') return;
				var column = target.cellIndex;
				var row = target.parentNode.rowIndex - 1;
				var oldRow = this.rangeState.row
				var oldColumn = this.rangeState.column;
				if (oldRow !== row || oldColumn !== column) {
					this.rangeState.row = row;
					this.rangeState.column = column;
					this.rangeState.endDate = this.getDateOfCell(row, column);
				}
			},
			handleClick: function(event) {
				var target = event.target;
				if (target.tagName !== 'TD')
					return;
				if (VueUtil.hasClass(target, 'disabled') || VueUtil.hasClass(target, 'week'))
					return;
				var selectionMode = this.selectionMode;
				if (selectionMode === 'week') {
					target = target.parentNode.cells[1];
				}
				var year = Number(this.year);
				var month = Number(this.month);
				var cellIndex = target.cellIndex;
				var rowIndex = target.parentNode.rowIndex;
				var cell = this.rows[rowIndex - 1][cellIndex];
				var text = cell.text;
				var className = target.className;
				var newDate = new Date(year,month,1);
				if (className.indexOf('prev') !== -1) {
					if (month === 0) {
						year = year - 1;
						month = 11;
					} else {
						month = month - 1;
					}
					newDate.setFullYear(year);
					newDate.setMonth(month);
				} else if (className.indexOf('next') !== -1) {
					if (month === 11) {
						year = year + 1;
						month = 0;
					} else {
						month = month + 1;
					}
					newDate.setFullYear(year);
					newDate.setMonth(month);
				}
				newDate.setDate(parseInt(text, 10));
				if (this.selectionMode === 'range') {
					if (this.minDate && this.maxDate) {
						var minDate = new Date(newDate.getTime());
						var maxDate = null;
						this.$emit('pick', {
							minDate: minDate,
							maxDate: maxDate
						}, false);
						this.rangeState.selecting = true;
						this.markRange(this.minDate);
					} else if (this.minDate && !this.maxDate) {
						if (newDate >= this.minDate) {
							var maxDate = new Date(newDate.getTime());
							this.rangeState.selecting = false;
							this.$emit('pick', {
								minDate: this.minDate,
								maxDate: maxDate
							});
						} else {
							var minDate = new Date(newDate.getTime());
							this.$emit('pick', {
								minDate: minDate,
								maxDate: this.maxDate
							}, false);
						}
					} else if (!this.minDate) {
						var minDate = new Date(newDate.getTime());
						this.$emit('pick', {
							minDate: minDate,
							maxDate: this.maxDate
						}, false);
						this.rangeState.selecting = true;
						this.markRange(this.minDate);
					}
				} else if (selectionMode === 'day') {
					this.$emit('pick', newDate);
				} else if (selectionMode === 'week') {
					var weekNumber = VueUtil.component.getWeekNumber(newDate);
					var value = newDate.getFullYear() + 'w' + weekNumber;
					this.$emit('pick', {
						year: newDate.getFullYear(),
						week: weekNumber,
						value: value,
						date: newDate
					});
				}
			}
		}
	};
	var DatePanel = {
		template: '<transition name="vue-zoom-in-top" @after-leave="$emit(\'dodestroy\')"><div v-show="visible" :style="{width: width + \'px\'}" class="vue-picker-panel vue-date-picker" :class="[{\'has-sidebar\': $slots.sidebar || shortcuts,\'has-time\': showTime}, popperClass]"><div class="vue-picker-panel__body-wrapper"><slot name="sidebar" class="vue-picker-panel__sidebar"></slot><div class="vue-picker-panel__sidebar" v-if="shortcuts"><button type="button" class="vue-picker-panel__shortcut" v-for="shortcut in shortcuts" @click="handleShortcutClick(shortcut)">{{ shortcut.text }}</button></div><div class="vue-picker-panel__body"><div class="vue-date-picker__time-header" v-if="showTime"><span class="vue-date-picker__editor-wrap"><vue-input :placeholder="$t(\'vue.datepicker.selectDate\')" :value="visibleDate" size="small" @change.native="visibleDate = $event.target.value" /></span><span class="vue-date-picker__editor-wrap"><vue-input ref="input" @focus="timePickerVisible = !timePickerVisible" :placeholder="$t(\'vue.datepicker.selectTime\')" :value="visibleTime" size="small" @change.native="visibleTime = $event.target.value" /><time-picker ref="timepicker" :date="date" :picker-width="pickerWidth" @pick="handleTimePick" :visible="timePickerVisible" @mounted="$refs.timepicker.format=timeFormat"></time-picker></span></div><div class="vue-date-picker__header" v-show="currentView !== \'time\'"><button type="button" @click="prevYear" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-d-arrow-left"></button><button type="button" @click="prevMonth" v-show="currentView === \'date\'" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-arrow-left"></button><span @click="showYearPicker" class="vue-date-picker__header-label">{{ yearLabel }}</span><span @click="showMonthPicker" v-show="currentView === \'date\'" class="vue-date-picker__header-label" :class="{ active: currentView === \'month\' }">{{ monthLabel }}</span><button type="button" @click="nextYear" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-d-arrow-right"></button><button type="button" @click="nextMonth" v-show="currentView === \'date\'" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-arrow-right"></button></div><div class="vue-picker-panel__content"><date-table v-show="currentView === \'date\'" @pick="handleDatePick" :year="year" :month="month" :date="date" :week="week" :selection-mode="selectionMode" :first-day-of-week="firstDayOfWeek" :disabled-date="disabledDate"></date-table><year-table ref="yearTable" :year="year" :date="date" v-show="currentView === \'year\'" @pick="handleYearPick" :disabled-date="disabledDate"></year-table><month-table :month="month" :date="date" v-show="currentView === \'month\'" @pick="handleMonthPick" :disabled-date="disabledDate"></month-table></div></div></div><div class="vue-picker-panel__footer" v-show="footerVisible && currentView === \'date\'"><a href="JavaScript:" class="vue-picker-panel__link-btn" @click="changeToNow">{{ nowLabel }}</a><button type="button" class="vue-picker-panel__btn" @click="confirm">{{ confirmLabel }}</button></div></div></transition>',
		watch: {
			showTime: function(val) {
				var self = this;
				if (!val)
					return;
				self.$nextTick(function() {
					var inputElm = self.$refs.input.$el;
					if (inputElm) {
						self.pickerWidth = inputElm.getBoundingClientRect().width + 10;
					}
				});
			},
			value: function(newVal) {
				if (!newVal)
					return;
				newVal = new Date(newVal);
				if (!isNaN(newVal)) {
					if (typeof this.disabledDate === 'function' && this.disabledDate(new Date(newVal))) {
						return;
					}
					this.date = newVal;
					this.year = newVal.getFullYear();
					this.month = newVal.getMonth();
					this.$emit('pick', newVal, true);
				}
			},
			timePickerVisible: function(val) {
				var self = this;
				if (val)
					self.$nextTick(function() {
						self.$refs.timepicker.ajustScrollTop();
					});
			},
			selectionMode: function(newVal) {
				if (newVal === 'month') {
					if (this.currentView !== 'year' || this.currentView !== 'month') {
						this.currentView = 'month';
					}
				} else if (newVal === 'week') {
					this.week = VueUtil.component.getWeekNumber(this.date);
				}
			},
			date: function(newVal) {
				this.year = newVal.getFullYear();
				this.month = newVal.getMonth();
			}
		},
		methods: {
			handleClear: function() {
				this.date = this.$options.defaultValue ? new Date(this.$options.defaultValue) : new Date();
				this.$emit('pick');
			},
			resetDate: function() {
				this.date = new Date(this.date);
			},
			showMonthPicker: function() {
				this.currentView = 'month';
			},
			showYearPicker: function() {
				this.currentView = 'year';
			},
			prevMonth: function() {
				this.month--;
				if (this.month < 0) {
					this.month = 11;
					this.year--;
				}
			},
			nextMonth: function() {
				this.month++;
				if (this.month > 11) {
					this.month = 0;
					this.year++;
				}
			},
			nextYear: function() {
				if (this.currentView === 'year') {
					this.$refs.yearTable.nextTenYear();
				} else {
					this.year++;
					this.date.setFullYear(this.year);
					this.resetDate();
				}
			},
			prevYear: function() {
				if (this.currentView === 'year') {
					this.$refs.yearTable.prevTenYear();
				} else {
					this.year--;
					this.date.setFullYear(this.year);
					this.resetDate();
				}
			},
			handleShortcutClick: function(shortcut) {
				if (shortcut.onClick) {
					shortcut.onClick(this);
				}
			},
			handleTimePick: function(picker, visible, first) {
				if (picker) {
					var oldDate = new Date(this.date.getTime());
					var hour = picker.getHours();
					var minute = picker.getMinutes();
					var second = picker.getSeconds();
					oldDate.setHours(hour);
					oldDate.setMinutes(minute);
					oldDate.setSeconds(second);
					this.date = new Date(oldDate.getTime());
				}
				if (!first) {
					this.timePickerVisible = visible;
				}
			},
			handleMonthPick: function(month) {
				this.month = month;
				var selectionMode = this.selectionMode;
				if (selectionMode !== 'month') {
					this.date.setMonth(month);
					this.currentView = 'date';
					this.resetDate();
				} else {
					this.date.setMonth(month);
					this.year && this.date.setFullYear(this.year);
					this.resetDate();
					var value = new Date(this.date.getFullYear(),month,1);
					this.$emit('pick', value);
				}
			},
			handleDatePick: function(value) {
				if (this.selectionMode === 'day') {
					if (!this.showTime) {
						this.$emit('pick', new Date(value.getTime()));
					}
					this.date.setFullYear(value.getFullYear());
					this.date.setMonth(value.getMonth(), value.getDate());
				} else if (this.selectionMode === 'week') {
					this.week = value.week;
					this.$emit('pick', value.date);
				}
				this.resetDate();
			},
			handleYearPick: function(year, close) {
				if (typeof close === 'undefined') close = true;
				this.year = year;
				if (!close)
					return;
				this.date.setFullYear(year);
				if (this.selectionMode === 'year') {
					this.$emit('pick', new Date(year));
				} else {
					this.currentView = 'month';
				}
				this.resetDate();
			},
			changeToNow: function() {
				this.date.setTime(+new Date());
				this.$emit('pick', new Date(this.date.getTime()));
				this.resetDate();
			},
			confirm: function() {
				this.$emit('pick', this.date);
			},
			resetView: function() {
				if (this.selectionMode === 'month') {
					this.currentView = 'month';
				} else if (this.selectionMode === 'year') {
					this.currentView = 'year';
				} else {
					this.currentView = 'date';
				}
				if (this.selectionMode !== 'week') {
					this.year = this.date.getFullYear();
					this.month = this.date.getMonth();
				}
			}
		},
		components: {
			TimePicker: VueTimePicker().TimePicker,
			YearTable: YearTable,
			MonthTable: MonthTable,
			DateTable: DateTable,
			VueInput: VueInput()
		},
		mounted: function() {
			if (this.date && !this.year) {
				this.year = this.date.getFullYear();
				this.month = this.date.getMonth();
			}
		},
		data: function() {
			return {
				popperClass: '',
				pickerWidth: 0,
				date: this.$options.defaultValue ? new Date(this.$options.defaultValue) : new Date(),
				value: '',
				showTime: false,
				selectionMode: 'day',
				shortcuts: '',
				visible: false,
				currentView: 'date',
				disabledDate: '',
				firstDayOfWeek: 7,
				year: null,
				month: null,
				week: null,
				showWeekNumber: false,
				timePickerVisible: false,
				width: 0,
				format: ''
			};
		},
		computed: {
			footerVisible: function() {
				return this.showTime;
			},
			visibleTime: {
				get: function() {
					return VueUtil.formatDate(this.date, this.timeFormat);
				},
				set: function(val) {
					if (val) {
						var date = VueUtil.parseDate(val, this.timeFormat);
						if (date) {
							date.setFullYear(this.date.getFullYear());
							date.setMonth(this.date.getMonth());
							date.setDate(this.date.getDate());
							this.date = date;
							this.$refs.timepicker.value = date;
							this.timePickerVisible = false;
						}
					}
				}
			},
			visibleDate: {
				get: function() {
					return VueUtil.formatDate(this.date);
				},
				set: function(val) {
					var date = VueUtil.parseDate(val, 'yyyy-MM-dd');
					if (!date) return;
					if (typeof this.disabledDate === 'function' && this.disabledDate(date)) return;
					date.setHours(this.date.getHours());
					date.setMinutes(this.date.getMinutes());
					date.setSeconds(this.date.getSeconds());
					this.date = date;
					this.resetView();
				}
			},
			yearLabel: function() {
				var year = this.year;
				if (!year)
					return '';
				var yearTranslation = this.$t('vue.datepicker.year');
				if (this.currentView === 'year') {
					var startYear = Math.floor(year / 10) * 10;
					if (yearTranslation) {
						return startYear + ' ' + yearTranslation + ' - ' + (startYear + 9) + ' ' + yearTranslation;
					}
					return startYear + ' - ' + (startYear + 9);
				}
				return this.year + ' ' + yearTranslation;
			},
			timeFormat: function() {
				if (this.format && this.format.indexOf('ss') === -1) {
					return 'HH:mm';
				} else {
					return 'HH:mm:ss';
				}
			},
			monthLabel: function() {
				return this.$t('vue.datepicker.month' + (this.month + 1));
			},
			nowLabel: function() {
				return this.$t('vue.datepicker.now');
			},
			confirmLabel: function() {
				return this.$t('vue.datepicker.confirm');
			}
		}
	};
	var DateRangePanel = {
		template: '<transition name="vue-zoom-in-top" @after-leave="$emit(\'dodestroy\')"><div v-show="visible" :style="{ width: width + \'px\' }" class="vue-picker-panel vue-date-range-picker" :class="[{\'has-sidebar\': $slots.sidebar || shortcuts,\'has-time\': showTime}, popperClass]"><div class="vue-picker-panel__body-wrapper"><slot name="sidebar" class="vue-picker-panel__sidebar"></slot><div class="vue-picker-panel__sidebar" v-if="shortcuts"><button type="button" class="vue-picker-panel__shortcut" v-for="shortcut in shortcuts" @click="handleShortcutClick(shortcut)">{{ shortcut.text }}</button></div><div class="vue-picker-panel__body"><div class="vue-date-range-picker__time-header" v-if="showTime"><span class="vue-date-range-picker__editors-wrap"><span class="vue-date-range-picker__time-picker-wrap"><vue-input size="small" :placeholder="$t(\'vue.datepicker.startDate\')" ref="minInput" class="vue-date-range-picker__editor" :value="minVisibleDate" @input.native="handleDateInput($event, \'min\')" @change.native="handleDateChange($event, \'min\')" /></span><span class="vue-date-range-picker__time-picker-wrap"><vue-input size="small" :placeholder="$t(\'vue.datepicker.startTime\')" class="vue-date-range-picker__editor" :value="minVisibleTime" @focus="minTimePickerVisible = !minTimePickerVisible" @change.native="handleTimeChange($event, \'min\')" /><time-picker :picker-width="minPickerWidth" ref="minTimePicker" :date="minDate" @pick="handleMinTimePick" :visible="minTimePickerVisible"></time-picker></span></span><span class="vue-icon-arrow-right"></span><span class="vue-date-range-picker__editors-wrap is-right"><span class="vue-date-range-picker__time-picker-wrap"><vue-input size="small" :placeholder="$t(\'vue.datepicker.endDate\')" class="vue-date-range-picker__editor" :value="maxVisibleDate" :readonly="!minDate" @input.native="handleDateInput($event, \'max\')" @change.native="handleDateChange($event, \'max\')" /></span><span class="vue-date-range-picker__time-picker-wrap"><vue-input size="small" :placeholder="$t(\'vue.datepicker.endTime\')" ref="maxInput" class="vue-date-range-picker__editor" :value="maxVisibleTime" @focus="minDate && (maxTimePickerVisible = !maxTimePickerVisible)" :readonly="!minDate" @change.native="handleTimeChange($event, \'max\')" /><time-picker :picker-width="maxPickerWidth" ref="maxTimePicker" :date="maxDate" @pick="handleMaxTimePick" :visible="maxTimePickerVisible"></time-picker></span></span></div><div class="vue-picker-panel__content vue-date-range-picker__content is-left"><div class="vue-date-range-picker__header"><button type="button" @click="prevYear" class="vue-picker-panel__icon-btn vue-icon-d-arrow-left"></button><button type="button" @click="prevMonth" class="vue-picker-panel__icon-btn vue-icon-arrow-left"></button><div>{{ leftLabel }}</div></div><date-table selection-mode="range" :date="date" :year="leftYear" :month="leftMonth" :min-date="minDate" :max-date="maxDate" :range-state="rangeState" :disabled-date="disabledDate" @changerange="handleChangeRange" :first-day-of-week="firstDayOfWeek" @pick="handleRangePick"></date-table></div><div class="vue-picker-panel__content vue-date-range-picker__content is-right"><div class="vue-date-range-picker__header"><button type="button" @click="nextYear" class="vue-picker-panel__icon-btn vue-icon-d-arrow-right"></button><button type="button" @click="nextMonth" class="vue-picker-panel__icon-btn vue-icon-arrow-right"></button><div>{{ rightLabel }}</div></div><date-table selection-mode="range" :date="rightDate" :year="rightYear" :month="rightMonth" :min-date="minDate" :max-date="maxDate" :range-state="rangeState" :disabled-date="disabledDate" @changerange="handleChangeRange" :first-day-of-week="firstDayOfWeek" @pick="handleRangePick"></date-table></div></div></div><div class="vue-picker-panel__footer" v-if="showTime"><a class="vue-picker-panel__link-btn" @click="handleClear">{{ clearLabel }}</a><button type="button" class="vue-picker-panel__btn" @click="handleConfirm()" :disabled="btnDisabled">{{ confirmLabel }}</button></div></div></transition>',
		components: {
			TimePicker: VueTimePicker().TimePicker,
			DateTable: DateTable,
			VueInput: VueInput()
		},
		computed: {
			btnDisabled: function() {
				return !(this.minDate && this.maxDate && !this.selecting);
			},
			leftLabel: function() {
				return this.date.getFullYear() + ' ' + this.$t('vue.datepicker.year') + ' ' + this.$t('vue.datepicker.month' + (this.date.getMonth() + 1));
			},
			rightLabel: function() {
				return this.rightDate.getFullYear() + ' ' + this.$t('vue.datepicker.year') + ' ' + this.$t('vue.datepicker.month' + (this.rightDate.getMonth() + 1));
			},
			clearLabel: function() {
				return this.$t('vue.datepicker.clear');
			},
			confirmLabel: function() {
				return this.$t('vue.datepicker.confirm');
			},
			leftYear: function() {
				return this.date.getFullYear();
			},
			leftMonth: function() {
				return this.date.getMonth();
			},
			rightYear: function() {
				return this.rightDate.getFullYear();
			},
			rightMonth: function() {
				return this.rightDate.getMonth();
			},
			minVisibleDate: function() {
				return this.minDate ? VueUtil.formatDate(this.minDate) : '';
			},
			maxVisibleDate: function() {
				return (this.maxDate || this.minDate) ? VueUtil.formatDate(this.maxDate || this.minDate) : '';
			},
			minVisibleTime: function() {
				return this.minDate ? VueUtil.formatDate(this.minDate, 'HH:mm:ss') : '';
			},
			maxVisibleTime: function() {
				return (this.maxDate || this.minDate) ? VueUtil.formatDate(this.maxDate || this.minDate, 'HH:mm:ss') : '';
			},
			rightDate: function() {
				var newDate = new Date(this.date);
				var month = newDate.getMonth();
				newDate.setDate(1);
				if (month === 11) {
					newDate.setFullYear(newDate.getFullYear() + 1);
					newDate.setMonth(0);
				} else {
					newDate.setMonth(month + 1);
				}
				return newDate;
			}
		},
		data: function() {
			return {
				popperClass: '',
				minPickerWidth: 0,
				maxPickerWidth: 0,
				date: new Date(),
				minDate: '',
				maxDate: '',
				rangeState: {
					endDate: null,
					selecting: false,
					row: null,
					column: null
				},
				showTime: false,
				shortcuts: '',
				value: '',
				visible: '',
				disabledDate: '',
				firstDayOfWeek: 7,
				minTimePickerVisible: false,
				maxTimePickerVisible: false,
				width: 0
			};
		},
		watch: {
			showTime: function(val) {
				if (!val)
					return;
				var self = this;
				self.$nextTick(function() {
					var minInputElm = self.$refs.minInput.$el;
					var maxInputElm = self.$refs.maxInput.$el;
					if (minInputElm) {
						self.minPickerWidth = minInputElm.getBoundingClientRect().width + 10;
					}
					if (maxInputElm) {
						self.maxPickerWidth = maxInputElm.getBoundingClientRect().width + 10;
					}
				});
			},
			minDate: function() {
				var self = this;
				self.$nextTick(function() {
					if (self.maxDate && this.maxDate < this.minDate) {
						var format = 'HH:mm:ss';
						self.$refs.maxTimePicker.selectableRange = [[VueUtil.parseDate(VueUtil.formatDate(self.minDate, format), format), VueUtil.parseDate('23:59:59', format)]];
					}
				});
			},
			minTimePickerVisible: function(val) {
				var self = this;
				if (val)
					self.$nextTick(function() {
						self.$refs.minTimePicker.ajustScrollTop();
					});
			},
			maxTimePickerVisible: function(val) {
				var self = this;
				if (val)
					self.$nextTick(function() {
						self.$refs.maxTimePicker.ajustScrollTop();
					});
			},
			value: function(newVal) {
				if (!newVal) {
					this.minDate = null;
					this.maxDate = null;
				} else if (Array.isArray(newVal)) {
					this.minDate = newVal[0] ? VueUtil.toDate(newVal[0]) : null;
					this.maxDate = newVal[1] ? VueUtil.toDate(newVal[1]) : null;
					if (this.minDate)
						this.date = new Date(this.minDate);
					this.handleConfirm(true);
				}
			}
		},
		methods: {
			handleClear: function() {
				this.minDate = null;
				this.maxDate = null;
				this.handleConfirm(false);
			},
			handleDateInput: function(event, type) {
				var value = event.target.value;
				var parsedValue = VueUtil.parseDate(value, 'yyyy-MM-dd');
				if (parsedValue) {
					if (typeof this.disabledDate === 'function' && this.disabledDate(new Date(parsedValue))) {
						return;
					}
					var target = new Date(type === 'min' ? this.minDate : this.maxDate);
					if (target) {
						target.setFullYear(parsedValue.getFullYear());
						target.setMonth(parsedValue.getMonth(), parsedValue.getDate());
					}
				}
			},
			handleChangeRange: function(val) {
				this.minDate = val.minDate;
				this.maxDate = val.maxDate;
				this.rangeState = val.rangeState;
			},
			handleDateChange: function(event, type) {
				var value = event.target.value;
				var parsedValue = VueUtil.parseDate(value, 'yyyy-MM-dd');
				if (parsedValue) {
					var target = new Date(type === 'min' ? this.minDate : this.maxDate);
					if (target) {
						target.setFullYear(parsedValue.getFullYear());
						target.setMonth(parsedValue.getMonth(), parsedValue.getDate());
					}
					if (type === 'min') {
						if (target < this.maxDate) {
							this.minDate = new Date(target.getTime());
						}
					} else {
						if (target > this.minDate) {
							this.maxDate = new Date(target.getTime());
							if (this.minDate && this.minDate > this.maxDate) {
								this.minDate = null;
							}
						}
					}
				}
			},
			handleTimeChange: function(event, type) {
				var value = event.target.value;
				var parsedValue = VueUtil.parseDate(value, 'HH:mm:ss');
				if (parsedValue) {
					var target = new Date(type === 'min' ? this.minDate : this.maxDate);
					if (target) {
						target.setHours(parsedValue.getHours());
						target.setMinutes(parsedValue.getMinutes());
						target.setSeconds(parsedValue.getSeconds());
					}
					if (type === 'min') {
						if (target < this.maxDate) {
							this.minDate = new Date(target.getTime());
						}
					} else {
						if (target > this.minDate) {
							this.maxDate = new Date(target.getTime());
						}
					}
					this.$refs[type + 'TimePicker'].value = target;
					this[type + 'TimePickerVisible'] = false;
				}
			},
			handleRangePick: function(val, close) {
				if (typeof close === 'undefined') close = true;
				if (this.maxDate === val.maxDate && this.minDate === val.minDate) {
					return;
				}
				this.onPick && this.onPick(val);
				this.maxDate = val.maxDate;
				this.minDate = val.minDate;
				if (!close || this.showTime) return;
				this.handleConfirm();
			},
			changeToToday: function() {
				this.date = new Date();
			},
			handleShortcutClick: function(shortcut) {
				if (shortcut.onClick) {
					shortcut.onClick(this);
				}
			},
			resetView: function() {
				this.minTimePickerVisible = false;
				this.maxTimePickerVisible = false;
			},
			setTime: function(date, value) {
				var oldDate = new Date(date.getTime());
				var hour = value.getHours();
				var minute = value.getMinutes();
				var second = value.getSeconds();
				oldDate.setHours(hour);
				oldDate.setMinutes(minute);
				oldDate.setSeconds(second);
				return new Date(oldDate.getTime());
			},
			handleMinTimePick: function(value, visible, first) {
				this.minDate = this.minDate || new Date();
				if (value) {
					this.minDate = this.setTime(this.minDate, value);
				}
				if (!first) {
					this.minTimePickerVisible = visible;
				}
			},
			handleMaxTimePick: function(value, visible, first) {
				if (!this.maxDate) {
					var now = new Date();
					if (now >= this.minDate) {
						this.maxDate = new Date();
					}
				}
				if (this.maxDate && value) {
					this.maxDate = this.setTime(this.maxDate, value);
				}
				if (!first) {
					this.maxTimePickerVisible = visible;
				}
			},
			prevMonth: function() {
				this.date = VueUtil.component.prevMonth(this.date);
			},
			nextMonth: function() {
				this.date = VueUtil.component.nextMonth(this.date);
			},
			nextYear: function() {
				var date = this.date;
				date.setFullYear(date.getFullYear() + 1);
				this.resetDate();
			},
			prevYear: function() {
				var date = this.date;
				date.setFullYear(date.getFullYear() - 1);
				this.resetDate();
			},
			handleConfirm: function(visible) {
				visible = visible || false
				this.$emit('pick', [this.minDate, this.maxDate], visible);
			},
			resetDate: function() {
				this.date = new Date(this.date);
			}
		}
	};
	var getPanel = function(type) {
		if (type === 'daterange' || type === 'datetimerange') {
			return DateRangePanel;
		}
		return DatePanel;
	};
	var VueDatePicker = {
		mixins: [VuePicker()],
		name: 'VueDatePicker',
		props: {
			type: {
				type: String,
				default: 'date'
			}
		},
		watch: {
			type: function(type) {
				if (this.picker) {
					this.unmountPicker();
					this.panel = getPanel(type);
					this.mountPicker();
				} else {
					this.panel = getPanel(type);
				}
			}
		},
		created: function() {
			this.panel = getPanel(this.type);
		}
	};
	Vue.component(VueDatePicker.name, VueDatePicker);
	return function() {
		return {
			DatePanel: DatePanel
		}
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VuePopup', 'VueInput', 'VueButton'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VuePopup'], context['VueInput'], context['VueButton']);
		delete context[name];
	}
})('VueMessageBox', this, function(Vue, VueUtil, VuePopup, VueInput, VueButton) {
	'use strict';
	var isVNode = function(node) {
		return typeof node === 'object' && Object.prototype.hasOwnProperty.call(node, 'componentOptions');
	};
	var typeMap = {
		success: 'circle-check',
		info: 'information',
		warning: 'warning',
		error: 'circle-cross'
	};
	var VueMessageBox = {
		template: '<transition name="msgbox-fade"><div class="vue-message-box__wrapper" v-show="visible" @click.self="handleWrapperClick"><div class="vue-message-box" :class="customClass"><div class="vue-message-box__header" v-if="title !== undefined"><div class="vue-message-box__title">{{ title || $t(\'vue.messagebox.title\') }}</div><i class="vue-message-box__close vue-icon-close" @click="handleAction(\'cancel\')" v-if="showClose"></i></div><div class="vue-message-box__content" v-if="message !== \'\'"><div class="vue-message-box__status" :class="[ typeClass ]"></div><div class="vue-message-box__message" :style="{ \'margin-left\': typeClass ? \'50px\' : \'0\' }"><slot><p>{{ message }}</p></slot></div><div class="vue-message-box__input" v-show="showInput"><vue-input v-model="inputValue" @keyup.enter.native="handleAction(\'confirm\')" :placeholder="inputPlaceholder" ref="input"></vue-input><div class="vue-message-box__errormsg" :style="{ visibility: !!editorErrorMessage ? \'visible\' : \'hidden\' }">{{ editorErrorMessage }}</div></div></div><div class="vue-message-box__btns"><vue-button :loading="cancelButtonLoading" :class="[ cancelButtonClasses ]" v-show="showCancelButton" @click.native="handleAction(\'cancel\')"> {{ cancelButtonText || $t(\'vue.messagebox.cancel\') }}</vue-button><vue-button :loading="confirmButtonLoading" ref="confirm" :class="[ confirmButtonClasses ]" v-show="showConfirmButton" @click.native="handleAction(\'confirm\')"> {{ confirmButtonText || $t(\'vue.messagebox.confirm\') }}</vue-button></div></div></div></transition>',
		mixins: [VuePopup().VuePopup],
		props: {
			lockScroll: {
				type: Boolean,
				default: true
			},
			showClose: {
				type: Boolean,
				default: false
			},
			closeOnClickModal: {
				type: Boolean,
				default: false
			},
			closeOnPressEscape: {
				type: Boolean,
				default: true
			}
		},
		components: {
			VueInput: VueInput(),
			VueButton: VueButton()
		},
		computed: {
			typeClass: function() {
				return this.type && typeMap[this.type] ? 'vue-icon-' + typeMap[this.type] : '';
			},
			confirmButtonClasses: function() {
				return 'vue-button--primary '+ this.confirmButtonClass;
			},
			cancelButtonClasses: function() {
				return this.cancelButtonClass;
			}
		},
		methods: {
			getSafeClose: function() {
				var self = this;
				var currentId = self.uid;
				return function() {
					self.$nextTick(function() {
						if (currentId === self.uid) self.doClose();
					});
				};
			},
			doClose: function() {
				var self = this;
				if (!self.visible) return;
				self.visible = false;
				self._closing = true;
				self.onClose && self.onClose();
				if (self.lockScroll) {
					setTimeout(function() {
						if (self.modal && self.bodyOverflow !== 'hidden') {
							document.body.style.overflow = self.bodyOverflow;
							document.body.style.paddingRight = self.bodyPaddingRight;
						}
						self.bodyOverflow = null;
						self.bodyPaddingRight = null;
					}, 200);
				}
				self.opened = false;
				if (!self.transition) {
					self.doAfterClose();
				}
				if (self.action) self.callback(self.action, self);
			},
			handleWrapperClick: function() {
				if (this.closeOnClickModal) {
					this.action = '';
					this.doClose();
				}
			},
			handleAction: function(action) {
				if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
					return;
				}
				this.action = action;
				if (typeof this.beforeClose === 'function') {
					this.close = this.getSafeClose();
					this.beforeClose(action, this, this.close);
				} else {
					this.doClose();
				}
			},
			validate: function() {
				if (this.$type === 'prompt') {
					var inputPattern = this.inputPattern;
					if (inputPattern && !inputPattern.test(this.inputValue || '')) {
						this.editorErrorMessage = this.inputErrorMessage || this.$t('vue.messagebox.error');
						VueUtil.addClass(this.$refs.input.$el.querySelector('input'), 'invalid');
						return false;
					}
					var inputValidator = this.inputValidator;
					if (typeof inputValidator === 'function') {
						var validateResult = inputValidator(this.inputValue);
						if (validateResult === false) {
							this.editorErrorMessage = this.inputErrorMessage || this.$t('vue.messagebox.error');
							VueUtil.addClass(this.$refs.input.$el.querySelector('input'), 'invalid');
							return false;
						}
						if (typeof validateResult === 'string') {
							this.editorErrorMessage = validateResult;
							return false;
						}
					}
				}
				this.editorErrorMessage = '';
				VueUtil.removeClass(this.$refs.input.$el.querySelector('input'), 'invalid');
				return true;
			}
		},
		watch: {
			inputValue: {
				immediate: true,
				handler: function(val) {
					var self = this;
					self.$nextTick(function() {
						if (self.$type === 'prompt' && val !== null) {
							self.validate();
						}
					});
				}
			},
			visible: function(val) {
				var self = this;
				if (val) {
					self.uid++;
					self.$el.addEventListener('touchmove', function(event) {
						event.preventDefault();
						event.stopPropagation();
					});
				} else {
					self.$el.removeEventListener('touchmove', function(event) {
						event.preventDefault();
						event.stopPropagation();
					});
				}
				if (self.$type === 'alert' || self.$type === 'confirm') {
					self.$nextTick(function() {
						self.$refs.confirm.$el.focus();
					});
				}
				if (self.$type !== 'prompt') return;
				if (val) {
					setTimeout(function() {
						if (self.$refs.input && self.$refs.input.$el) {
							self.$refs.input.$el.querySelector('input').focus();
						}
					}, 500);
				} else {
					self.editorErrorMessage = '';
					VueUtil.removeClass(self.$refs.input.$el.querySelector('input'), 'invalid');
				}
			}
		},
		data: function() {
			return {
				uid: 1,
				title: undefined,
				message: '',
				type: '',
				customClass: '',
				showInput: false,
				inputValue: null,
				inputPlaceholder: '',
				inputPattern: null,
				inputValidator: null,
				inputErrorMessage: '',
				showConfirmButton: true,
				showCancelButton: false,
				action: '',
				confirmButtonText: '',
				cancelButtonText: '',
				confirmButtonLoading: false,
				cancelButtonLoading: false,
				confirmButtonClass: '',
				confirmButtonDisabled: false,
				cancelButtonClass: '',
				editorErrorMessage: null,
				callback: null
			};
		}
	};
	var defaults = {
		title: undefined,
		message: '',
		type: '',
		showInput: false,
		showClose: false,
		lockScroll: true,
		closeOnClickModal: false,
		closeOnPressEscape: true,
		inputValue: null,
		inputPlaceholder: '',
		inputPattern: null,
		inputValidator: null,
		inputErrorMessage: '',
		showConfirmButton: true,
		showCancelButton: false,
		confirmButtonPosition: 'right',
		confirmButtonHighlight: false,
		cancelButtonHighlight: false,
		confirmButtonText: '',
		cancelButtonText: '',
		confirmButtonClass: '',
		cancelButtonClass: '',
		customClass: '',
		beforeClose: null
	};
	var MessageBoxConstructor = Vue.extend(VueMessageBox);
	var currentMsg, instance;
	var msgQueue = [];
	var defaultCallback = function(action) {
		if (currentMsg) {
			var callback = currentMsg.callback;
			if (typeof callback === 'function') {
				if (instance.showInput) {
					callback(instance.inputValue, action);
				} else {
					callback(action);
				}
			}
			if (currentMsg.resolve) {
				var $type = currentMsg.options.$type;
				if ($type === 'confirm' || $type === 'prompt') {
					if (action === 'confirm') {
						if (instance.showInput) {
							currentMsg.resolve({ value: instance.inputValue, action: action });
						} else {
							currentMsg.resolve(action);
						}
					} else if (action === 'cancel' && currentMsg.reject) {
						currentMsg.reject(action);
					}
				} else {
					currentMsg.resolve(action);
				}
			}
		}
	};
	var initInstance = function() {
		instance = new MessageBoxConstructor({
			el: document.createElement('div')
		});
		instance.callback = defaultCallback;
	};
	var showNextMsg = function() {
		if (!instance) {
			initInstance();
		}
		instance.action = '';
		if (!instance.visible || instance.closeTimer) {
			if (msgQueue.length > 0) {
				currentMsg = msgQueue.shift();
				var options = currentMsg.options;
				for (var prop in options) {
					if (options.hasOwnProperty(prop)) {
						instance[prop] = options[prop];
					}
				}
				if (options.callback === undefined) {
					instance.callback = defaultCallback;
				}
				var oldCb = instance.callback;
				instance.callback = function(action, instance) {
					oldCb(action, instance);
					showNextMsg();
				};
				if (isVNode(instance.message)) {
					instance.$slots.default = [instance.message];
					instance.message = null;
				}
				['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape'].forEach(function(prop) {
					if (instance[prop] === undefined) {
						instance[prop] = true;
					}
				});
				document.body.appendChild(instance.$el);
				Vue.nextTick(function() {
					instance.visible = true;
				});
			}
		}
	};
	var MessageBox = function(options, callback) {
		if (Vue.prototype.$isServer) return;
		if (typeof options === 'string') {
			options = {
				message: options
			};
			if (arguments[1]) {
				options.title = arguments[1];
			}
			if (arguments[2]) {
				options.type = arguments[2];
			}
		} else if (options.callback && !callback) {
			callback = options.callback;
		}
		if (typeof Promise !== 'undefined') {
			return new Promise(function(resolve, reject) {
				msgQueue.push({
					options: VueUtil.merge({}, defaults, MessageBox.defaults, options),
					callback: callback,
					resolve: resolve,
					reject: reject
				});
				showNextMsg();
			});
		} else {
			msgQueue.push({
				options: VueUtil.merge({}, defaults, MessageBox.defaults, options),
				callback: callback
			});
			showNextMsg();
		}
	};
	MessageBox.setDefaults = function(defaults) {
		MessageBox.defaults = defaults;
	};
	MessageBox.alert = function(message, title, options) {
		if (typeof title === 'object') {
			options = title;
			title = '';
		}
		return MessageBox(VueUtil.merge({
			title: title,
			message: message,
			$type: 'alert'
		}, options));
	};
	MessageBox.confirm = function(message, title, options) {
		if (typeof title === 'object') {
			options = title;
			title = '';
		}
		return MessageBox(VueUtil.merge({
			title: title,
			message: message,
			$type: 'confirm',
			closeOnPressEscape: false,
			showCancelButton: true
		}, options));
	};
	MessageBox.prompt = function(message, title, options) {
		if (typeof title === 'object') {
			options = title;
			title = '';
		}
		return MessageBox(VueUtil.merge({
			title: title,
			message: message,
			showCancelButton: true,
			showInput: true,
			$type: 'prompt'
		}, options));
	};
	MessageBox.close = function() {
		instance.visible = false;
		msgQueue = [];
		currentMsg = null;
	};
	Vue.prototype.$msgbox = MessageBox;
	Vue.prototype.$alert = MessageBox.alert;
	Vue.prototype.$confirm = MessageBox.confirm;
	Vue.prototype.$prompt = MessageBox.prompt;
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VuePopup'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VuePopup']);
		delete context[name];
	}
})('VueNotification', this, function(Vue, VueUtil, VuePopup) {
	'use strict';
	var typeMap = {
		success: 'circle-check',
		info: 'information',
		warning: 'warning',
		error: 'circle-cross'
	};
	var VueNotification = {
		template: '<transition :name="isLeft ? \'vue-notification-fade-left\' : isTop ? \'vue-notification-fade-top\' : isBottom ? \'vue-notification-fade-bottom\' : isCenter? \'vue-notification-fade-center\' : \'vue-notification-fade\'"><div class="vue-notification" :class="[{\'vue-notification-translateX\':centerX, \'vue-notification-translateY\':centerY},customClass]" v-show="visible" :style="{ top: top ? top + \'px\' : \'auto\', bottom: bottom ? bottom + \'px\' : \'auto\', left: left ? left + \'px\' : \'auto\', right: right ? right + \'px\' : \'auto\' }" @mouseenter="clearTimer()" @mouseleave="startTimer()"><i class="vue-notification__icon" :class="[ typeClass, iconClass ]" v-if="type || iconClass"></i><div class="vue-notification__group" :class="{ \'is-with-icon\': typeClass || iconClass }"><h2 class="vue-notification__title" v-text="title"></h2><div class="vue-notification__content"><slot>{{ message }}</slot></div><div class="vue-notification__closeBtn vue-icon-close" @click="close"></div></div></div></transition>',
		data: function() {
			return {
				visible: false,
				title: '',
				message: '',
				duration: 3000,
				type: '',
				customClass: '',
				iconClass: '',
				onClose: null,
				closed: false,
				top: null,
				bottom: null,
				left: null,
				right: null,
				centerX: false,
				centerY: false,
				position: 'right-top',
				timer: null,
				isLeft: false,
				isTop: false,
				isBottom: false,
				isCenter: false
			};
		},
		computed: {
			typeClass: function() {
				return this.type && typeMap[this.type] ? 'vue-icon-' + typeMap[this.type] : '';
			}
		},
		watch: {
			closed: function(newVal) {
				if (newVal) {
					this.visible = false;
					this.$el.addEventListener('transitionend', this.destroyElement);
				}
			}
		},
		methods: {
			destroyElement: function() {
				this.$el.removeEventListener('transitionend', this.destroyElement);
				this.$destroy(true);
				this.$el.parentNode.removeChild(this.$el);
			},
			close: function() {
				this.closed = true;
				if (typeof this.onClose === 'function') {
					this.onClose();
				}
			},
			clearTimer: function() {
				clearTimeout(this.timer);
			},
			startTimer: function() {
				var self = this;
				if (self.duration > 0) {
					self.timer = setTimeout(function() {
						if (!self.closed) {
							self.close();
						}
					}, self.duration);
				}
			}
		},
		mounted: function() {
			var self = this;
			if (self.duration > 0) {
				self.timer = setTimeout(function() {
					if (!self.closed) {
						self.close();
					}
				}, self.duration);
			}
		}
	};
	var isVNode = function(node) {
		return typeof node === 'object' && Object.prototype.hasOwnProperty.call(node, 'componentOptions');
	};
	var NotificationConstructor = Vue.extend(VueNotification);
	var instance;
	var instances = [];
	var leftTopInstances = [];
	var leftBottomInstances = [];
	var rightTopInstances = [];
	var rightBottomInstances = [];
	var centerTopInstances = [];
	var centerBottomInstances = [];
	var seed = 1;
	var offHeight = 8;
	var Notification = function(options) {
		if (Vue.prototype.$isServer) return;
		options = options || {};
		var userOnClose = options.onClose;
		var id = 'notification_' + seed++;
		options.onClose = function() {
			Notification.close(id, userOnClose);
		};
		instance = new NotificationConstructor({
			data: options
		});
		if (isVNode(options.message)) {
			instance.$slots.default = [options.message];
			options.message = '';
		}
		instance.id = id;
		instance.vm = instance.$mount();
		document.body.appendChild(instance.vm.$el);
		instance.vm.visible = true;
		instance.dom = instance.vm.$el;
		instance.dom.style.zIndex = VuePopup().PopupManager.nextZIndex();
		var positionX = instance.position.split("-")[0];
		var positionY = instance.position.split("-")[1];
		if (!positionX || !positionY) {
			positionX = 'right';
			positionY = 'top'
		}
		var isLeft = positionX.indexOf('left')!==-1;
		var isCenterX = positionX.indexOf('center')!==-1;
		var isRight = positionX.indexOf('right')!==-1;
		var isTop = positionY.indexOf('top')!==-1;
		var isCenterY = positionY.indexOf('center')!==-1;
		var isBottom = positionY.indexOf('bottom')!==-1;
		instance.isLeft = false;
		instance.isBottom = false;
		instance.top = false;
		instance.isCenter = false;
		if (isCenterY) {
			instance.centerY = true;
		}
		if (isLeft) {
			instance.left = 0;
			instance.isLeft = true;
		}
		if (isCenterX) {
			instance.centerX = true;
			instance.isCenter = true;
		}
		if (isRight) {
			instance.right = 16;
		}
		if (isBottom) {
			if (isLeft) {
				var leftBottomDist = offHeight;
				for (var i = 0, len = leftBottomInstances.length; i < len; i++) {
					leftBottomDist += leftBottomInstances[i].$el.offsetHeight + offHeight;
				}
				instance.bottom = leftBottomDist;
				leftBottomInstances.push(instance);
			}
			if (isCenterX) {
				instance.isBottom = true;
				var centerBottomDist = offHeight;
				for (var i = 0, len = centerBottomInstances.length; i < len; i++) {
					centerBottomDist += centerBottomInstances[i].$el.offsetHeight + offHeight;
				}
				instance.bottom = centerBottomDist;
				centerBottomInstances.push(instance);
			}
			if (isRight) {
				var rightBottomDist = offHeight;
				for (var i = 0, len = rightBottomInstances.length; i < len; i++) {
					rightBottomDist += rightBottomInstances[i].$el.offsetHeight + offHeight;
				}
				instance.bottom = rightBottomDist;
				rightBottomInstances.push(instance);
			}
		}
		if (isTop) {
			if (isLeft) {
				var leftTopDist = offHeight;
				for (var i = 0, len = leftTopInstances.length; i < len; i++) {
					leftTopDist += leftTopInstances[i].$el.offsetHeight + offHeight;
				}
				instance.top = leftTopDist;
				leftTopInstances.push(instance);
			}
			if (isCenterX) {
				instance.isTop = true;
				var centerTopDist = offHeight;
				for (var i = 0, len = centerTopInstances.length; i < len; i++) {
					centerTopDist += centerTopInstances[i].$el.offsetHeight + offHeight;
				}
				instance.top = centerTopDist;
				centerTopInstances.push(instance);
			}
			if (isRight) {
				var rightTopDist = offHeight;
				for (var i = 0, len = rightTopInstances.length; i < len; i++) {
					rightTopDist += rightTopInstances[i].$el.offsetHeight + offHeight;
				}
				instance.top = rightTopDist;
				rightTopInstances.push(instance);
			}
		}
		instance.dom.style.display = "";
		instances.push(instance);
		return instance.vm;
	};
	['success', 'warning', 'info', 'error'].forEach(function(type) {
		Notification[type] = function(options) {
			if (typeof options === 'string' || isVNode(options)) {
				options = {
					message: options
				};
			}
			options.type = type;
			return Notification(options);
		};
	});
	Notification.close = function(id, userOnClose) {
		for (var i = 0, len = instances.length; i < len; i++) {
			if (id === instances[i].id) {
				if (typeof userOnClose === 'function') {
					userOnClose(instances[i]);
				}
				var removedHeight = instances[i].dom.offsetHeight + offHeight;
				var positionX = instances[i].position.split("-")[0]||"right";
				var positionY = instances[i].position.split("-")[1]||"top";
				var isLeft = positionX.indexOf('left')!==-1;
				var isCenterX = positionX.indexOf('center')!==-1;
				var isRight = positionX.indexOf('right')!==-1;
				var isTop = positionY.indexOf('top')!==-1;
				var isBottom = positionY.indexOf('bottom')!==-1;
				if (isBottom) {
					if (isLeft) {
						leftBottomInstances.splice(i, 1);
						for (var lbi = i, lbj = leftBottomInstances.length; lbi < lbj ; lbi++) {
							leftBottomInstances[lbi].dom.style.bottom = parseInt(leftBottomInstances[lbi].dom.style.bottom, 10) - removedHeight + 'px';
						}
					}
					if (isCenterX) {
						centerBottomInstances.splice(i, 1);
						for (var cbi = i, cbj = centerBottomInstances.length; cbi < cbj ; cbi++) {
							centerBottomInstances[cbi].dom.style.bottom = parseInt(centerBottomInstances[cbi].dom.style.bottom, 10) - removedHeight + 'px';
						}
					}
					if (isRight) {
						rightBottomInstances.splice(i, 1);
						for (var rbi = i, rbj = rightBottomInstances.length; rbi < rbj ; rbi++) {
							rightBottomInstances[rbi].dom.style.bottom = parseInt(rightBottomInstances[rbi].dom.style.bottom, 10) - removedHeight + 'px';
						}
					}
				}
				if (isTop) {
					if (isLeft) {
						leftTopInstances.splice(i, 1);
						for (var lti = i, ltj = leftTopInstances.length; lti < ltj ; lti++) {
							leftTopInstances[lti].dom.style.top = parseInt(leftTopInstances[lti].dom.style.top, 10) - removedHeight + 'px';
						}
					}
					if (isCenterX) {
						centerTopInstances.splice(i, 1);
						for (var cti = i, ctj = centerTopInstances.length; cti < ctj ; cti++) {
							centerTopInstances[cti].dom.style.top = parseInt(centerTopInstances[cti].dom.style.top, 10) - removedHeight + 'px';
						}
					
					}
					if (isRight) {
						rightTopInstances.splice(i, 1);
						for (var rti = i, rtj = rightTopInstances.length; rti < rtj ; rti++) {
							rightTopInstances[rti].dom.style.top = parseInt(rightTopInstances[rti].dom.style.top, 10) - removedHeight + 'px';
						}
					}
				}
				instances[i].dom.parentElement.removeChild(instances[i].dom);
				instances.splice(i, 1);
				break;
			}
		}
	};
	Vue.prototype.$notify = Notification;
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueSelect', 'VueOption'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueSelect'], context['VueOption']);
		delete context[name];
	}
})('VuePagination', this, function(Vue, VueSelect, VueOption) {
	'use strict';
	var VuePager = {
		template: '<ul @click="onPagerClick" class="vue-pager"><li :class="{ active: currentPage === 1 }" v-if="pageCount > 0" class="number">1</li><li class="vue-icon more btn-quickprev" :class="[quickprevIconClass]" v-if="showPrevMore" @mouseenter="quickprevIconClass = \'vue-icon-d-arrow-left\'" @mouseleave="quickprevIconClass = \'vue-icon-more\'"></li><li v-for="pager in pagers" :class="{ active: currentPage === pager }" class="number">{{ pager }}</li><li class="vue-icon more btn-quicknext" :class="[quicknextIconClass]" v-if="showNextMore" @mouseenter="quicknextIconClass = \'vue-icon-d-arrow-right\'" @mouseleave="quicknextIconClass = \'vue-icon-more\'"></li><li :class="{ active: currentPage === pageCount }" class="number" v-if="pageCount > 1">{{ pageCount }}</li></ul>',
		name: 'VuePager',
		props: {
			currentPage: Number,
			pageCount: Number
		},
		watch: {
			showPrevMore: function(val) {
				if (!val) this.quickprevIconClass = 'vue-icon-more';
			},
			showNextMore: function(val) {
				if (!val) this.quicknextIconClass = 'vue-icon-more';
			}
		},
		methods: {
			onPagerClick: function(event) {
				var target = event.target;
				if (target.tagName === 'UL') {
					return;
				}
				var newPage = Number(event.target.textContent);
				var pageCount = this.pageCount;
				var currentPage = this.currentPage;
				if (target.className.indexOf('more') !== -1) {
					if (target.className.indexOf('quickprev') !== -1) {
						newPage = currentPage - 5;
					} else if (target.className.indexOf('quicknext') !== -1) {
						newPage = currentPage + 5;
					}
				}
				if (!isNaN(newPage)) {
					if (newPage < 1) {
						newPage = 1;
					}
					if (newPage > pageCount) {
						newPage = pageCount;
					}
				}
				if (newPage !== currentPage) {
					this.$emit('change', newPage);
				}
			}
		},
		computed: {
			pagers: function() {
				var pagerCount = 7;
				var currentPage = Number(this.currentPage);
				var pageCount = Number(this.pageCount);
				var showPrevMore = false;
				var showNextMore = false;
				if (pageCount > pagerCount) {
					if (currentPage > pagerCount - 2) {
						showPrevMore = true;
					}
					if (currentPage < pageCount - 2) {
						showNextMore = true;
					}
				}
				var array = [];
				if (showPrevMore && !showNextMore) {
					var startPage = pageCount - (pagerCount - 2);
					for (var i = startPage; i < pageCount; i++) {
						array.push(i);
					}
				} else if (!showPrevMore && showNextMore) {
					for (var i = 2; i < pagerCount; i++) {
						array.push(i);
					}
				} else if (showPrevMore && showNextMore) {
					var offset = Math.floor(pagerCount / 2) - 1;
					for (var i = currentPage - offset ; i <= currentPage + offset; i++) {
						array.push(i);
					}
				} else {
					for (var i = 2; i < pageCount; i++) {
						array.push(i);
					}
				}
				this.showPrevMore = showPrevMore;
				this.showNextMore = showNextMore;
				return array;
			}
		},
		data: function() {
			return {
				current: null,
				showPrevMore: false,
				showNextMore: false,
				quicknextIconClass: 'vue-icon-more',
				quickprevIconClass: 'vue-icon-more'
			};
		}
	};
	var VuePagination = {
		name: 'VuePagination',
		props: {
			pageSize: {
				type: Number,
				default: 10
			},
			small: Boolean,
			total: Number,
			pageCount: Number,
			currentPage: {
				type: Number,
				default: 1
			},
			layout: {
				default: 'prev, pager, next, jumper, ->, total'
			},
			pageSizes: {
				type: Array,
				default: function() {
					return [10, 20, 30, 40, 50, 100];
				}
			}
		},
		data: function() {
			return {
				internalCurrentPage: 1,
				internalPageSize: 0
			};
		},
		render: function(createElement) {
			var self = this;
			var template = createElement('div', {class: 'vue-pagination'}, []);
			var layout = self.layout || '';
			if (!layout) return;
			var TEMPLATE_MAP = {
				prev: createElement('prev', null, []),
				jumper: createElement('jumper', null, []),
				pager: createElement('pager', {attrs: {currentPage: self.internalCurrentPage,pageCount: self.internalPageCount}, on: {change: self.handleCurrentChange}}, []),
				next: createElement('next', null, []),
				sizes: createElement('sizes', {attrs: {pageSizes: self.pageSizes}}, []),
				slot: createElement('my-slot', null, []),
				total: createElement('total', null, [])
			};
			var components = layout.split(',').map(function(item){return item.trim();});
			var rightWrapper = createElement('div', {class: 'vue-pagination__rightwrapper'}, []);
			var haveRightWrapper = false;
			if (self.small) {
				template.data.class += ' vue-pagination--small';
			}
			components.forEach(function(compo) {
				if (compo === '->') {
					haveRightWrapper = true;
					return;
				}
				if (!haveRightWrapper) {
					template.children.push(TEMPLATE_MAP[compo]);
				} else {
					rightWrapper.children.push(TEMPLATE_MAP[compo]);
				}
			});
			if (haveRightWrapper) {
				template.children.push(rightWrapper);
			}
			return template;
		},
		components: {
			MySlot: {
				render: function(createElement) {
					return this.$parent.$slots.default ? this.$parent.$slots.default[0] : '';
				}
			},
			Prev: {
				render: function(createElement) {
					return createElement('button',{ attrs: {type: 'button'}, class: ['btn-prev', {disabled: this.$parent.internalCurrentPage <= 1}], on: { click: this.$parent.prev} }, [createElement('i', {class: 'vue-icon vue-icon-arrow-left'}, [])]);
				}
			},
			Next: {
				render: function(createElement) {
					return createElement('button', {attrs: {type: 'button'}, class: ['btn-next', {disabled: this.$parent.internalCurrentPage === this.$parent.internalPageCount || 0 === this.$parent.internalPageCount}], on: {click: this.$parent.next}}, [createElement('i', {class: 'vue-icon vue-icon-arrow-right'}, [])]);
				}
			},
			Sizes: {
				props: {
					pageSizes: Array
				},
				watch: {
					pageSizes: {
						immediate: true,
						handler: function(value) {
							if (Array.isArray(value)) {
								this.$parent.internalPageSize = value.indexOf(this.$parent.pageSize) > -1 ? this.$parent.pageSize : this.pageSizes[0];
							}
						}
					}
				},
				render: function(createElement) {
					var self = this;
					return createElement('span', {class: 'vue-pagination__sizes'}, [createElement('vue-select', {attrs: {value: this.$parent.internalPageSize}, on: {input: this.handleChange}}, [this.pageSizes.map(function (item) {return createElement('vue-option', {attrs: {value: item, label: item + ' ' + self.$t('vue.pagination.pagesize')}}, [])})])]);
				},
				components: {
					VueSelect: VueSelect(),
					VueOption: VueOption()
				},
				methods: {
					handleChange: function(val) {
						if (val !== this.$parent.internalPageSize) {
							this.$parent.internalPageSize = val = parseInt(val, 10);
							this.$parent.$emit('size-change', val);
						}
					}
				}
			},
			Jumper: {
				data: function() {
					return {
						oldValue: null
					};
				},
				methods: {
					handleFocus: function(event) {
						this.oldValue = event.target.value;
					},
					handleChange: function(target) {
						this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(target.value);
						this.oldValue = null;
					}
				},
				render: function(createElement) {
					return createElement('span', {class: 'vue-pagination__jump'}, [this.$t('vue.pagination.goto'), createElement('input', {class: 'vue-pagination__editor', attrs: {type: 'number', min: 1, max: this.internalPageCount, number: !0}, domProps: {value: this.$parent.internalCurrentPage}, on: {change: this.handleChange, focus: this.handleFocus}, style: {width: '30px'}}, []), this.$t('vue.pagination.pageClassifier')]);
				}
			},
			Total: {
				render: function(createElement) {
					return 'number' == typeof this.$parent.total ? createElement('span', {class: 'vue-pagination__total'}, [this.$t('vue.pagination.total', {total: this.$parent.total})]) : '';
				}
			},
			Pager: VuePager
		},
		methods: {
			handleCurrentChange: function(val) {
				this.internalCurrentPage = this.getValidCurrentPage(val);
			},
			prev: function() {
				var newVal = this.internalCurrentPage - 1;
				this.internalCurrentPage = this.getValidCurrentPage(newVal);
			},
			next: function() {
				var newVal = this.internalCurrentPage + 1;
				this.internalCurrentPage = this.getValidCurrentPage(newVal);
			},
			getValidCurrentPage: function(value) {
				value = parseInt(value, 10);
				var havePageCount = typeof this.internalPageCount === 'number';
				var resetValue;
				if (!havePageCount) {
					if (isNaN(value) || value < 1) resetValue = 1;
				} else {
					if (value < 1) {
						resetValue = 1;
					} else if (value > this.internalPageCount) {
						resetValue = this.internalPageCount;
					}
				}
				if (resetValue === undefined && isNaN(value)) {
					resetValue = 1;
				} else if (resetValue === 0) {
					resetValue = 1;
				}
				return resetValue === undefined ? value : resetValue;
			}
		},
		computed: {
			internalPageCount: function() {
				if (typeof this.total === 'number') {
					return Math.ceil(this.total / this.internalPageSize);
				} else if (typeof this.pageCount === 'number') {
					return this.pageCount;
				}
				return null;
			}
		},
		watch: {
			currentPage: {
				immediate: true,
				handler: function(val) {
					this.internalCurrentPage = val;
				}
			},
			pageSize: {
				immediate: true,
				handler: function(val) {
					this.internalPageSize = val;
				}
			},
			internalCurrentPage: function(newVal, oldVal) {
				var self = this;
				newVal = parseInt(newVal, 10);
				if (isNaN(newVal)) {
					newVal = oldVal || 1;
				} else {
					newVal = self.getValidCurrentPage(newVal);
				}
				if (newVal !== undefined) {
					self.$nextTick(function() {
						self.internalCurrentPage = newVal;
						if (oldVal !== newVal) {
							self.$emit('current-change', self.internalCurrentPage);
						}
					});
				} else {
					self.$emit('current-change', self.internalCurrentPage);
				}
			},
			internalPageCount: function(newVal) {
				var oldPage = this.internalCurrentPage;
				if (newVal > 0 && oldPage === 0) {
					this.internalCurrentPage = 1;
				} else if (oldPage > newVal) {
					this.internalCurrentPage = newVal === 0 ? 1 : newVal;
				}
			}
		}
	};
	Vue.component(VuePagination.name, VuePagination);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
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
				required: true,
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
	return function() {
		return VueProgress;
	}
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VueTooltip'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VueTooltip']);
		delete context[name];
	}
})('VueSlider', this, function(Vue, VueUtil, VueTooltip) {
	'use strict';
	var VueSliderButton = {
		template: '<div class="vue-slider__button-wrapper" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @mousedown="onButtonDown" :class="{ \'hover\': hovering, \'dragging\': dragging }" :style="{ left: currentPosition }" ref="button"><vue-tooltip placement="top" ref="tooltip" :disabled="!showTooltip"><span slot="content">{{ formatValue }}</span><div class="vue-slider__button" :class="{ \'hover\': hovering, \'dragging\': dragging }"></div></vue-tooltip></div>',
		name: 'VueSliderButton',
		components: {
			VueTooltip: VueTooltip()
		},
		props: {
			value: {
				type: Number,
				default: 0
			}
		},
		data: function() {
			return {
				hovering: false,
				dragging: false,
				startX: 0,
				currentX: 0,
				startPosition: 0,
				newPosition: null,
				oldValue: this.value
			};
		},
		computed: {
			disabled: function() {
				return this.$parent.disabled;
			},
			max: function() {
				return this.$parent.max;
			},
			min: function() {
				return this.$parent.min;
			},
			step: function() {
				return this.$parent.step;
			},
			showTooltip: function() {
				return this.$parent.showTooltip;
			},
			precision: function() {
				return this.$parent.precision;
			},
			currentPosition: function() {
				return (this.value - this.min) / (this.max - this.min) * 100 + '%'
			},
			enableFormat: function() {
				return this.$parent.formatTooltip instanceof Function;
			},
			formatValue: function() {
				return this.enableFormat && this.$parent.formatTooltip(this.value) || this.value;
			}
		},
		watch: {
			dragging: function(val) {
				this.$parent.dragging = val;
			}
		},
		methods: {
			displayTooltip: function() {
				this.$refs.tooltip && (this.$refs.tooltip.showPopper = true);
			},
			hideTooltip: function() {
				this.$refs.tooltip && (this.$refs.tooltip.showPopper = false);
			},
			handleMouseEnter: function() {
				this.hovering = true;
				this.displayTooltip();
			},
			handleMouseLeave: function() {
				this.hovering = false;
				this.hideTooltip();
			},
			onButtonDown: function(event) {
				if (this.disabled) return;
				event.preventDefault();
				this.onDragStart(event);
				window.addEventListener('mousemove', this.onDragging);
				window.addEventListener('mouseup', this.onDragEnd);
				window.addEventListener('contextmenu', this.onDragEnd);
			},
			onDragStart: function(event) {
				this.dragging = true;
				this.startX = event.clientX;
				this.startPosition = parseFloat(this.currentPosition);
			},
			onDragging: function(event) {
				if (this.dragging) {
					this.displayTooltip();
					this.currentX = event.clientX;
					var diff = (this.currentX - this.startX) / this.$parent.$sliderWidth * 100;
					this.newPosition = this.startPosition + diff;
					this.setPosition(this.newPosition);
				}
			},
			onDragEnd: function() {
				var self = this;
				if (self.dragging) {
					setTimeout(function() {
						self.dragging = false;
						self.hideTooltip();
						self.setPosition(self.newPosition);
					}, 0);
					window.removeEventListener('mousemove', self.onDragging);
					window.removeEventListener('mouseup', self.onDragEnd);
					window.removeEventListener('contextmenu', self.onDragEnd);
				}
			},
			setPosition: function(newPosition) {
				if (newPosition < 0) {
					newPosition = 0;
				} else if (newPosition > 100) {
					newPosition = 100;
				}
				var lengthPerStep = 100 / ((this.max - this.min) / this.step);
				var steps = Math.round(newPosition / lengthPerStep);
				var value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min;
				value = parseFloat(value.toFixed(this.precision));
				this.$emit('input', value);
				this.$refs.tooltip && this.$refs.tooltip.updatePopper();
				if (!this.dragging && this.value !== this.oldValue) {
					this.oldValue = this.value;
				}
			}
		}
	};
	var VueSlider = {
		template: '<div class="vue-slider"><div class="vue-slider__runway" :class="{ \'disabled\': disabled }" @click="onSliderClick" ref="slider"><div class="vue-slider__bar" :style="{ width: barWidth, left: barLeft}"></div><slider-button v-model="firstValue" ref="button1"></slider-button><slider-button v-model="secondValue" ref="button2" v-if="range"></slider-button><div class="vue-slider__stop" v-for="item in stops" :style="{ \'left\': item + \'%\' }" v-if="showStops"></div></div></div>',
		name: 'VueSlider',
		mixins: [VueUtil.component.emitter],
		props: {
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			value: {
				type: [Number, Array],
				default: 0
			},
			showStops: {
				type: Boolean,
				default: false
			},
			showTooltip: {
				type: Boolean,
				default: true
			},
			formatTooltip: Function,
			disabled: {
				type: Boolean,
				default: false
			},
			range: {
				type: Boolean,
				default: false
			}
		},
		components: {
			SliderButton: VueSliderButton
		},
		data: function() {
			return {
				firstValue: null,
				secondValue: null,
				oldValue: null,
				dragging: false
			};
		},
		watch: {
			value: function(val, oldVal) {
				if (this.dragging ||
					Array.isArray(val) &&
					Array.isArray(oldVal) &&
					val.every(function(item, index) {return item === oldVal[index];})) {
					return;
				}
				this.setValues();
			},
			dragging: function(val) {
				if (!val) {
					this.setValues();
				}
			},
			firstValue: function(val) {
				if (this.range) {
					this.$emit('input', [this.minValue, this.maxValue]);
				} else {
					this.$emit('input', val);
				}
			},
			secondValue: function() {
				if (this.range) {
					this.$emit('input', [this.minValue, this.maxValue]);
				}
			},
			min: function() {
				this.setValues();
			},
			max: function() {
				this.setValues();
			}
		},
		methods: {
			valueChanged: function() {
				var self = this;
				if (self.range) {
					return ![self.minValue, self.maxValue]
						.every(function(item, index) {return item === self.oldValue[index];});
				} else {
					return self.value !== self.oldValue;
				}
			},
			setValues: function() {
				var val = this.value;
				if (this.range && Array.isArray(val)) {
					if (val[1] < this.min) {
						this.$emit('input', [this.min, this.min]);
					} else if (val[0] > this.max) {
						this.$emit('input', [this.max, this.max]);
					} else if (val[0] < this.min) {
						this.$emit('input', [this.min, val[1]]);
					} else if (val[1] > this.max) {
						this.$emit('input', [val[0], this.max]);
					} else {
						this.firstValue = val[0];
						this.secondValue = val[1];
						if (this.valueChanged()) {
							this.$emit('change', [this.minValue, this.maxValue]);
							this.dispatch('ElFormItem', 'el.form.change', [this.minValue, this.maxValue]);
							this.oldValue = val.slice();
						}
					}
				} else if (!this.range && typeof val === 'number' && !isNaN(val)) {
					if (val < this.min) {
						this.$emit('input', this.min);
					} else if (val > this.max) {
						this.$emit('input', this.max);
					} else {
						this.firstValue = val;
						if (this.valueChanged()) {
							this.$emit('change', val);
							this.dispatch('ElFormItem', 'el.form.change', val);
							this.oldValue = val;
						}
					}
				}
			},
			setPosition: function(percent) {
				var targetValue = this.min + percent * (this.max - this.min) / 100;
				if (!this.range) {
					this.$refs.button1.setPosition(percent);
					return;
				}
				var button;
				if (Math.abs(this.minValue - targetValue) < Math.abs(this.maxValue - targetValue)) {
					button = this.firstValue < this.secondValue ? 'button1' : 'button2';
				} else {
					button = this.firstValue > this.secondValue ? 'button1' : 'button2';
				}
				this.$refs[button].setPosition(percent);
			},
			onSliderClick: function(event) {
				if (this.disabled || this.dragging) return;
				var sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
				this.setPosition((event.clientX - sliderOffsetLeft) / this.$sliderWidth * 100);
			}
		},
		computed: {
			$sliderWidth: function() {
				return parseInt(VueUtil.getStyle(this.$refs.slider, 'width'), 10);
			},
			stops: function() {
				var self = this;
				var stopCount = (self.max - self.min) / self.step;
				var stepWidth = 100 * self.step / (self.max - self.min);
				var result = [];
				for (var i = 1; i < stopCount; i++) {
					result.push(i * stepWidth);
				}
				if (self.range) {
					return result.filter(function(step) {
						return step < 100 * (self.minValue - self.min) / (self.max - self.min) ||
							step > 100 * (self.maxValue - self.min) / (self.max - self.min);
					});
				} else {
					return result.filter(function(step) {return step > 100 * (self.firstValue - self.min) / (self.max - self.min);});
				}
			},
			minValue: function() {
				return Math.min(this.firstValue, this.secondValue);
			},
			maxValue: function() {
				return Math.max(this.firstValue, this.secondValue);
			},
			barWidth: function() {
				return this.range ? 100 * (this.maxValue - this.minValue) / (this.max - this.min) + '%' : 100 * (this.firstValue - this.min) / (this.max - this.min) + '%'
			},
			barLeft: function() {
				return this.range ? 100 * (this.minValue - this.min) / (this.max - this.min) + '%' : '0%'
			},
			precision: function() {
				var precisions = [this.min, this.max, this.step].map(function(item) {
					var decimal = ('' + item).split('.')[1];
					return decimal ? decimal.length : 0;
				});
				return Math.max.apply(null, precisions);
			}
		},
		mounted: function() {
			if (this.range) {
				if (Array.isArray(this.value)) {
					this.firstValue = Math.max(this.min, this.value[0]);
					this.secondValue = Math.min(this.max, this.value[1]);
				} else {
					this.firstValue = this.min;
					this.secondValue = this.max;
				}
				this.oldValue = [this.firstValue, this.secondValue];
			} else {
				if (typeof this.value !== 'number' || isNaN(this.value)) {
					this.firstValue = this.min;
				} else {
					this.firstValue = Math.min(this.max, Math.max(this.min, this.value));
				}
				this.oldValue = this.firstValue;
			}
		}
	};
	Vue.component(VueSlider.name, VueSlider);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueRate', this, function(Vue, VueUtil) {
	'use strict';
	var VueRate = {
		template: '<div class="vue-rate"><span v-for="item in max" class="vue-rate__item" @mousemove="setCurrentValue(item, $event)" @mouseleave="resetCurrentValue" @click="selectValue(item)" :style="{ cursor: disabled ? \'auto\' : \'pointer\' }"><i :class="[classes[item - 1], { \'hover\': hoverIndex === item }]" class="vue-rate__icon" :style="getIconStyle(item)"><i v-if="showDecimalIcon(item)" :class="decimalIconClass" :style="decimalStyle" class="vue-rate__decimal"></i></i></span><span v-if="showText" class="vue-rate__text" :style="{ color: textColor }">{{ text }}</span></div>',
			name: 'VueRate',
			data: function() {
				return {
					classMap: {},
					colorMap: {},
					pointerAtLeftHalf: false,
					currentValue: this.value,
					hoverIndex: -1
				};
			},
			props: {
				value: {
					type: Number,
					default: 0
				},
				lowThreshold: {
					type: Number,
					default: 2
				},
				highThreshold: {
					type: Number,
					default: 4
				},
				max: {
					type: Number,
					default: 5
				},
				colors: {
					type: Array,
					default: function() {
						return ['#F7BA2A', '#F7BA2A', '#F7BA2A'];
					}
				},
				voidColor: {
					type: String,
					default: '#C6D1DE'
				},
				disabledVoidColor: {
					type: String,
					default: '#EFF2F7'
				},
				iconClasses: {
					type: Array,
					default: function() {
						return ['vue-icon-star-on', 'vue-icon-star-on', 'vue-icon-star-on'];
					}
				},
				voidIconClass: {
					type: String,
					default: 'vue-icon-star-off'
				},
				disabledVoidIconClass: {
					type: String,
					default: 'vue-icon-star-on'
				},
				disabled: {
					type: Boolean,
					default: false
				},
				allowHalf: {
					type: Boolean,
					default: false
				},
				showText: {
					type: Boolean,
					default: false
				},
				textColor: {
					type: String,
					default: '1f2d3d'
				},
				texts: {
					type: Array,
					default: function() {
						return ['极差', '失望', '一般', '满意', '惊喜'];
					}
				},
				textTemplate: {
					type: String,
					default: '{value}'
				}
			},
			computed: {
				text: function() {
					var result = '';
					if (this.disabled) {
						result = this.textTemplate.replace(/\{\s*value\s*\}/, this.value);
					} else {
						result = this.texts[Math.ceil(this.currentValue) - 1];
					}
					return result;
				},
				decimalStyle: function() {
					var width = '';
					if (this.disabled) {
						width = (this.valueDecimal < 50 ? 0 : 50) + '%';
					}
					if (this.allowHalf) {
						width = '50%';
					}
					return {
						color: this.activeColor,
						width: width
					};
				},
				valueDecimal: function() {
					return this.value * 100 - Math.floor(this.value) * 100;
				},
				decimalIconClass: function() {
					return this.getValueFromMap(this.value, this.classMap);
				},
				voidClass: function() {
					return this.disabled ? this.classMap.disabledVoidClass : this.classMap.voidClass;
				},
				activeClass: function() {
					return this.getValueFromMap(this.currentValue, this.classMap);
				},
				activeColor: function() {
					return this.getValueFromMap(this.currentValue, this.colorMap);
				},
				classes: function() {
					var result = [];
					var i = 0;
					var threshold = this.currentValue;
					if (this.allowHalf && this.currentValue !== Math.floor(this.currentValue)) {
						threshold--;
					}
					for (; i < threshold; i++) {
						result.push(this.activeClass);
					}
					for (; i < this.max; i++) {
						result.push(this.voidClass);
					}
					return result;
				}
			},
			watch: {
				value: function(val) {
					this.$emit('change', val);
					this.currentValue = val;
				}
			},
			methods: {
				getValueFromMap: function(value, map) {
					var result = '';
					if (value <= this.lowThreshold) {
						result = map.lowColor || map.lowClass;
					} else if (value >= this.highThreshold) {
						result = map.highColor || map.highClass;
					} else {
						result = map.mediumColor || map.mediumClass;
					}
					return result;
				},
				showDecimalIcon: function(item) {
					var showWhenDisabled = this.disabled && this.valueDecimal > 0 && item - 1 < this.value && item > this.value;
					var showWhenAllowHalf = this.allowHalf && this.pointerAtLeftHalf && ((item - 0.5).toFixed(1) === this.currentValue.toFixed(1));
					return showWhenDisabled || showWhenAllowHalf;
				},
				getIconStyle: function(item) {
					var voidColor = this.disabled ? this.colorMap.disabledVoidColor : this.colorMap.voidColor;
					return {
						color: item <= this.currentValue ? this.activeColor : voidColor
					};
				},
				selectValue: function(value) {
					if (this.disabled) {
						return;
					}
					if (this.allowHalf && this.pointerAtLeftHalf) {
						this.$emit('input', this.currentValue);
					} else {
						this.$emit('input', value);
					}
				},
				setCurrentValue: function(value, event) {
					if (this.disabled) {
						return;
					}
					if (this.allowHalf) {
						var target = event.target;
						if (VueUtil.hasClass(target, 'vue-rate__item')) {
							target = target.querySelector('.vue-rate__icon');
						}
						if (VueUtil.hasClass(target, 'vue-rate__decimal')) {
							target = target.parentNode;
						}
						this.pointerAtLeftHalf = event.offsetX * 2 <= target.clientWidth;
						this.currentValue = this.pointerAtLeftHalf ? value - 0.5 : value;
					} else {
						this.currentValue = value;
					}
					this.hoverIndex = value;
				},
				resetCurrentValue: function() {
					if (this.disabled) {
						return;
					}
					if (this.allowHalf) {
						this.pointerAtLeftHalf = this.value !== Math.floor(this.value);
					}
					this.currentValue = this.value;
					this.hoverIndex = -1;
				}
			},
			created: function() {
				if (!this.value) {
					this.$emit('input', 0);
				}
				this.classMap = {
					lowClass: this.iconClasses[0],
					mediumClass: this.iconClasses[1],
					highClass: this.iconClasses[2],
					voidClass: this.voidIconClass,
					disabledVoidClass: this.disabledVoidIconClass
				};
				this.colorMap = {
					lowColor: this.colors[0],
					mediumColor: this.colors[1],
					highColor: this.colors[2],
					voidColor: this.voidColor,
					disabledVoidColor: this.disabledVoidColor
				};
			}
	};
	Vue.component(VueRate.name, VueRate);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueProgress', 'VueResource'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueProgress']);
		delete context[name];
	}
})('VueUpload', this, function(Vue, VueProgress) {
	'use strict';
	var ajax = function(option) {
		if (typeof this.$http === 'undefined') {
			return;
		}
		var httpOption = {};
		httpOption.headers = option.headers;
		httpOption.progress = function progress(e) {
			if (e.total > 0) {
				e.percent = e.loaded / e.total * 100;
			}
			option.onProgress(e);
		};
		if (option.withCredentials) {
			httpOption.emulateJSON = true
		}
		var formData = new FormData();
		if (option.data) {
			Object.keys(option.data).map(function(key) {
				formData.append(key, option.data[key]);
			});
		}
		formData.append(option.filename, option.file);
		this.$http.post(option.action, formData, httpOption).then(function(reqponse){
			option.onSuccess(reqponse);
		}, function(reqponse){
			option.onError(reqponse);
		});
	}
	var UploadDragger = {
		template: '<div class="vue-upload-dragger" :class="{ \'is-dragover\': dragover }" @drop.prevent="onDrop" @dragover.prevent="dragover = true" @dragleave.prevent="dragover = false"><slot></slot></div>', 
		name: 'VueUploadDrag',
		data: function() {
			return {
				dragover: false
			};
		},
		methods: {
			onDrop: function(e) {
				this.dragover = false;
				this.$emit('file', e.dataTransfer.files);
			}
		}
	};
	var UploadList = {
		template: '<transition-group tag="ul" :class="[\'vue-upload-list\', \'vue-upload-list--\' + listType]" name="list"><li v-for="file in files" :class="[\'vue-upload-list__item\', \'is-\' + file.status]" :key="file"><img class="vue-upload-list__item-thumbnail" v-if="[\'picture-card\', \'picture\'].indexOf(listType) > -1 && file.status === \'success\'" :src="file.url" alt=""><a class="vue-upload-list__item-name" @click="handleClick(file)"><i class="vue-icon-document"></i>{{file.name}}</a><label v-show="file.status === \'success\'" class="vue-upload-list__item-status-label"><i :class="{ \'vue-icon-circle-check\': listType === \'text\', \'vue-icon-check\': [\'picture-card\', \'picture\'].indexOf(listType) > -1}"></i><i class="vue-icon-close" @click="$emit(\'remove\', file)"></i></label><span class="vue-upload-list__item-actions" v-if=" listType === \'picture-card\' && file.status === \'success\' "><span v-if=" handlePreview && listType === \'picture-card\' " @click="handlePreview(file)" class="vue-upload-list__item-preview"><i class="vue-icon-view"></i></span><span class="vue-upload-list__item-delete" @click="$emit(\'remove\', file)"><i class="vue-icon-delete2"></i></span></span><vue-progress v-if="file.status === \'uploading\'" :type="listType === \'picture-card\' ? \'circle\' : \'line\'" :stroke-width="listType === \'picture-card\' ? 6 : 2" :percentage="parsePercentage(file.percentage)"></vue-progress></li></transition-group>',
		components: { VueProgress: VueProgress() },
		props: {
			files: {
				type: Array,
				default: function() {
					return [];
				}
			},
			handlePreview: Function,
			listType: String
		},
		methods: {
			parsePercentage: function(val) {
				return parseInt(val, 10);
			},
			handleClick: function(file) {
				this.handlePreview && this.handlePreview(file);
			}
		}
	};
	var Upload = {
		components: {
			UploadDragger: UploadDragger
		},
		props: {
			type: String,
			action: {
				type: String,
				default: window.location.href
			},
			name: {
				type: String,
				default: 'file'
			},
			data: Object,
			headers: Object,
			withCredentials: Boolean,
			multiple: Boolean,
			accept: String,
			onStart: Function,
			onProgress: Function,
			onSuccess: Function,
			onError: Function,
			beforeUpload: Function,
			drag: Boolean,
			onPreview: {
				type: Function,
				default: function() {}
			},
			onRemove: {
				type: Function,
				default: function() {}
			},
			fileList: Array,
			autoUpload: Boolean,
			listType: String,
			httpRequest: {
				type: Function,
				default: ajax
			}
		},
		data: function() {
			return {
				mouseover: false
			};
		},
		methods: {
			isImage: function(str) {
				return str.indexOf('image') !== -1;
			},
			handleChange: function(ev) {
				var files = ev.target.files;
				if (!files) return;
				this.uploadFiles(files);
				this.$refs.input.value = null;
			},
			uploadFiles: function(files) {
				var self = this;
				var postFiles = Array.prototype.slice.call(files);
				if (!self.multiple) { postFiles = postFiles.slice(0, 1); }
				if (postFiles.length === 0) { return; }
				postFiles.forEach(function(rawFile) {
					self.onStart(rawFile);
					if (self.autoUpload) self.upload(rawFile);
				});
			},
			upload: function(rawFile) {
				var self = this;
				if (!self.beforeUpload) {
					return self.post(rawFile);
				}
				var before = self.beforeUpload(rawFile);
				if (before && before.then) {
					before.then(function(processedFile) {
						if (Object.prototype.toString.call(processedFile) === '[object File]') {
							self.post(processedFile);
						} else {
							self.post(rawFile);
						}
					}, function() {
						self.onRemove(rawFile, true);
					});
				} else if (before !== false) {
					self.post(rawFile);
				} else {
					self.onRemove(rawFile, true);
				}
			},
			post: function(rawFile) {
				var self = this;
				var options = {
					headers: self.headers,
					withCredentials: self.withCredentials,
					file: rawFile,
					data: self.data,
					filename: self.name,
					action: self.action,
					onProgress: function(e) {
						self.onProgress(e, rawFile);
					},
					onSuccess: function(res) {
						self.onSuccess(res, rawFile);
					},
					onError: function(err) {
						self.onError(err, rawFile);
					}
				};
				var requestPromise = self.httpRequest(options);
				if (requestPromise && requestPromise.then) {
					requestPromise.then(options.onSuccess, options.onError);
				}
			},
			handleClick: function() {
				this.$refs.input.click();
			}
		},
		render: function(createElement) {
			var handleClick = this.handleClick,
				drag = this.drag,
				handleChange = this.handleChange,
				multiple = this.multiple,
				accept = this.accept,
				listType = this.listType,
				uploadFiles = this.uploadFiles;
			var data = {
				class: {
					'vue-upload': true
				},
				on: {
					click: handleClick
				}
			};
			data.class['vue-upload--' + listType] = true;
			return createElement('div', data, [drag ? createElement('upload-dragger', {on: {file: uploadFiles}}, [this.$slots.default]) : this.$slots.default, createElement('input', {class: 'vue-upload__input',attrs: {type: 'file', multiple: multiple, accept: accept}, ref: 'input', on: {change: handleChange}}, [])]);
		}
	};
	var IframeUpload = {
		components: {
			UploadDragger: UploadDragger
		},
		props: {
			type: String,
			data: {},
			action: {
				type: String,
				default: window.location.href
			},
			name: {
				type: String,
				default: 'file'
			},
			withCredentials: Boolean,
			accept: String,
			onStart: Function,
			onProgress: Function,
			onSuccess: Function,
			onError: Function,
			beforeUpload: Function,
			onPreview: {
				type: Function,
				default: function() {}
			},
			onRemove: {
				type: Function,
				default: function() {}
			},
			drag: Boolean,
			listType: String
		},
		data: function() {
			return {
				mouseover: false,
				domain: '',
				file: null,
				disabled: false
			};
		},
		methods: {
			isImage: function(str) {
				return str.indexOf('image') !== -1;
			},
			handleClick: function() {
				this.$refs.input.click();
			},
			handleChange: function(ev) {
				var file = ev.target.value;
				if (file) {
					this.uploadFiles(file);
				}
			},
			uploadFiles: function(file) {
				if (this.disabled) return;
				this.disabled = true;
				this.file = file;
				this.onStart(file);
				var formNode = this.getFormNode();
				var dataSpan = this.getFormDataNode();
				var data = this.data;
				if (typeof data === 'function') {
					data = data(file);
				}
				var inputs = [];
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						inputs.push('<input name="' + key + '" value="' + data[key] + '"/>');
					}
				}
				dataSpan.innerHTML = inputs.join('');
				formNode.submit();
				dataSpan.innerHTML = '';
			},
			getFormNode: function() {
				return this.$refs.form;
			},
			getFormDataNode: function() {
				return this.$refs.data;
			}
		},
		created: function() {
			this.frameName = 'frame-' + Date.now();
		},
		mounted: function() {
			var self = this;
			!this.$isServer && window.addEventListener('message', function(event) {
				if (!self.file) return;
				var targetOrigin = new URL(self.action).origin;
				if (event.origin !== targetOrigin) return;
				var response = event.data;
				if (response.result === 'success') {
					self.onSuccess(response, self.file);
				} else if (response.result === 'failed') {
					self.onError(response, self.file);
				}
				self.disabled = false;
				self.file = null;
			}, false);
		},
		render: function(createElement) {
			var drag = this.drag,
				uploadFiles = this.uploadFiles,
				listType = this.listType,
				frameName = this.frameName;
			var oClass = { 'vue-upload': true };
			oClass['vue-upload--' + listType] = true;
			return createElement('div', {class: oClass, on: {click: this.handleClick}, nativeOn: {drop: this.onDrop, dragover: this.handleDragover, dragleave: this.handleDragleave}}, [createElement('iframe', {on: {load: this.onload}, ref: 'iframe', attrs: {name: frameName}}, []), createElement('form', {ref: 'form', attrs: {action: this.action, target: frameName, enctype: 'multipart/form-data', method: 'POST'}}, [createElement('input', {class: 'vue-upload__input',attrs: {type: 'file', name: 'file', accept: this.accept}, ref: 'input', on: {change: this.handleChange}}, []), createElement('input', {attrs: {type: 'hidden', name: 'documentDomain', value: this.$isServer ? '' : document.domain}}, []), createElement('span', {ref: 'data'}, [])]), drag ? createElement('upload-dragger', {on: {file: uploadFiles}}, [this.$slots.default]) : this.$slots.default])
		}
	};
	var migrating = {
		mounted: function() {
			return
		},
		methods: {
			getMigratingConfig: function() {
				return {
					props: {},
					events: {}
				};
			}
		}
	};
	var VueUpload = {
		name: 'VueUpload',
		mixins: [migrating],
		components: {
			VueProgress: VueProgress(),
			UploadList: UploadList,
			Upload: Upload,
			IframeUpload: IframeUpload
		},
		props: {
			action: {
				type: String,
				default: window.location.href
			},
			headers: {
				type: Object,
				default: function() {
					return {};
				}
			},
			data: Object,
			multiple: Boolean,
			name: {
				type: String,
				default: 'file'
			},
			drag: Boolean,
			dragger: Boolean,
			withCredentials: Boolean,
			showFileList: {
				type: Boolean,
				default: true
			},
			accept: String,
			type: {
				type: String,
				default: 'select'
			},
			beforeUpload: Function,
			onRemove: {
				type: Function,
				default: function() {}
			},
			onChange: {
				type: Function,
				default: function() {}
			},
			onPreview: {
				type: Function
			},
			onSuccess: {
				type: Function,
				default: function() {}
			},
			onProgress: {
				type: Function,
				default: function() {}
			},
			onError: {
				type: Function,
				default: function() {}
			},
			fileList: {
				type: Array,
				default: function() {
					return [];
				}
			},
			autoUpload: {
				type: Boolean,
				default: true
			},
			listType: {
				type: String,
				default: 'text'
			}
		},
		data: function() {
			return {
				uploadFiles: [],
				dragOver: false,
				draging: false,
				tempIndex: 1
			};
		},
		watch: {
			fileList: {
				immediate: true,
				handler: function(fileList) {
					var self = this;
					self.uploadFiles = fileList.map(function(item) {
						item.uid = item.uid || (Date.now() + self.tempIndex++);
						item.status = 'success';
						return item;
					});
				}
			}
		},
		methods: {
			handleStart: function(rawFile) {
				rawFile.uid = Date.now() + this.tempIndex++;
				var file = {
					status: 'ready',
					name: rawFile.name,
					size: rawFile.size,
					percentage: 0,
					uid: rawFile.uid,
					raw: rawFile
				};
				try {
					file.url = URL.createObjectURL(rawFile);
				} catch (err) {
					console.error(err);
					return;
				}
				this.uploadFiles.push(file);
			},
			handleProgress: function(ev, rawFile) {
				var file = this.getFile(rawFile);
				this.onProgress(ev, file, this.uploadFiles);
				file.status = 'uploading';
				file.percentage = ev.percent || 0;
			},
			handleSuccess: function(res, rawFile) {
				var file = this.getFile(rawFile);
				if (file) {
					file.status = 'success';
					file.response = res;
					this.onSuccess(res, file, this.uploadFiles);
					this.onChange(file, this.uploadFiles);
				}
			},
			handleError: function(err, rawFile) {
				var file = this.getFile(rawFile);
				var fileList = this.uploadFiles;
				file.status = 'fail';
				fileList.splice(fileList.indexOf(file), 1);
				this.onError(err, file, this.uploadFiles);
				this.onChange(file, this.uploadFiles);
			},
			handleRemove: function(file) {
				var fileList = this.uploadFiles;
				fileList.splice(fileList.indexOf(file), 1);
				this.onRemove(file, fileList);
			},
			getFile: function(rawFile) {
				var fileList = this.uploadFiles;
				var target;
				fileList.every(function(item) {
					target = rawFile.uid === item.uid ? item : null;
					return !target;
				});
				return target;
			},
			clearFiles: function() {
				this.uploadFiles = [];
			},
			submit: function() {
				var self = this;
				self.uploadFiles
					.filter(function(file) {return file.status === 'ready';})
					.forEach(function(file) {
						self.$refs['upload-inner'].upload(file.raw, file);
					});
			},
			getMigratingConfig: function() {
				return {
					props: {
						'default-file-list': 'default-file-list is renamed to file-list.',
						'show-upload-list': 'show-file-list is renamed to show-file-list.'
					}
				};
			}
		},
		render: function(createElement) {
			var uploadList;
			if (this.showFileList) {
				uploadList = createElement('UploadList', {attrs: {listType: this.listType, files: this.uploadFiles, handlePreview: this.onPreview}, on: {remove: this.handleRemove}}, []);
			}
			var uploadData = {
				props: {
					type: this.type,
					drag: this.drag,
					action: this.action,
					multiple: this.multiple,
					'before-upload': this.beforeUpload,
					'with-credentials': this.withCredentials,
					headers: this.headers,
					name: this.name,
					data: this.data,
					accept: this.accept,
					fileList: this.uploadFiles,
					autoUpload: this.autoUpload,
					listType: this.listType,
					'on-start': this.handleStart,
					'on-progress': this.handleProgress,
					'on-success': this.handleSuccess,
					'on-error': this.handleError,
					'on-preview': this.onPreview,
					'on-remove': this.handleRemove
				},
				ref: 'upload-inner'
			};
			var trigger = this.$slots.trigger || this.$slots.default;
			var uploadComponent = (typeof FormData !== 'undefined' || this.$isServer)
					? createElement('upload', uploadData, [trigger])
					: createElement('iframeUpload', uploadData, [trigger]);
			return createElement('div', null, ['picture-card' === this.listType ? uploadList : '', this.$slots.trigger ? [uploadComponent, this.$slots.default]: uploadComponent, this.$slots.tip, 'picture-card' !== this.listType ? uploadList : '']);
		}
	};
	Vue.component(VueUpload.name, VueUpload);
});
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
		}, 800);
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
	Vue.Loading = VueLoadingBar;
	Vue.prototype.$Loading = VueLoadingBar;
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueNote', this, function(Vue) {
	'use strict';
	var VueNote = {
		template: '<transition name="vue-note-fade"><div class="vue-note" :class="[ typeClass, typeBox ]"><div class="vue-note__content"><span class="vue-note__title is-bold" v-if="title">{{ title }}</span><div class="vue-note__description"><slot></slot></div></div></div></transition>',
		name: 'VueNote',
		props: {
			title: {
				type: String,
				default: ''
			},
			type: {
				type: String,
				default: 'info'
			},
			box:  {
				type: Boolean,
				default: false
			}
		},
		computed: {
			typeClass: function() {
				return 'vue-note--' + this.type;
			},
			typeBox: function() {
				if (this.box) {
					return 'vue-note--box';
				}
			}
		}
	};
	Vue.component(VueNote.name, VueNote);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueList', this, function(Vue, VueUtil) {
	'use strict';
	var VueList = {
		name: 'VueList',
		componentName: 'VueList',
		data: function(){
			return {
				activedIndex: null,
				remain: 0,
				size: 0
			}
		},
		props: {
			height: {
				type: [Number, String],
				required: true
			},
			onScroll: Function
		},
		delta: {
			start: 0,
			end: 0,
			total: 0,
			keeps: 0,
			viewHeight: 0,
			allPadding: 0,
			paddingTop: 0
		},
		methods: {
			handleItemClick: function(itemObj) {
				var self = this;
				self.$slots.default.forEach(function(slot, index){
					if (slot.componentInstance === itemObj) {
						self.activedIndex = index;
					}
				});
				this.setItemActive();
			},
			setItemActive: function() {
				var self = this;
				self.$children.forEach(function(children) {
					children.isActive = false;
				});
				self.$slots.default.forEach(function(slot, index){
					if (slot.componentInstance && index === self.activedIndex) {
						slot.componentInstance.isActive = true;
					}
				});
			},
			handleScroll: function(e) {
				var scrollTop = this.$refs.container.scrollTop;
				this.updateZone(scrollTop);
				if (this.onScroll) {
					this.onScroll(e, scrollTop);
				}
			},
			updateZone: function(offset) {
				var delta = this.$options.delta;
				var overs = Math.floor(offset / this.size);
				if (!offset) {
					this.$emit('toTop');
				}
				var start = overs ? overs : 0;
				var end = overs ? (overs + delta.keeps) : delta.keeps;
				if (overs + this.remain >= delta.total) {
					end = delta.total;
					start = delta.total - delta.keeps;
					this.$emit('toBottom');
				}
				delta.end = end;
				delta.start = start;
				this.$forceUpdate();
				this.setItemActive();
			},
			filter: function(slots) {
				var delta = this.$options.delta;
				delta.total = slots.length;
				delta.paddingTop = this.size * delta.start;
				delta.allPadding = this.size * (slots.length - delta.keeps);
				delta.paddingTop < 0 ? delta.paddingTop = 0 : undefined;
				delta.allPadding < 0 ? delta.allPadding = 0 : undefined;
				delta.allPadding < delta.paddingTop ? delta.allPadding = delta.paddingTop : undefined;
				return slots.filter(function(slot, index) {
					return index >= delta.start && index <= delta.end;
				});
			}
		},
		render: function(createElement) {
			var delta = this.$options.delta;
			var showList = this.filter(this.$slots.default);
			var viewHeight = delta.viewHeight;
			var paddingTop = delta.paddingTop;
			var allPadding = delta.allPadding;
			return createElement('div', {
				'ref': 'container',
				'class': ['vue-list'],
				'style': {
					'height': viewHeight + 'px'
				},
				'on': {
					'scroll': this.handleScroll
				}
			}, [
				createElement('div', {
					'style': {
						'padding-top': paddingTop + 'px',
						'padding-bottom': allPadding - paddingTop + 'px'
					}
				}, showList)
			]);
		},
		mounted: function() {
			this.size=20;
			this.remain = Math.round(this.height*1 / this.size);
			var delta = this.$options.delta;
			delta.end = this.remain;
			delta.keeps = this.remain;
			delta.viewHeight = this.height*1;
			this.$on('item-click', this.handleItemClick);
		}
	};
	Vue.component(VueList.name, VueList);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueListItem', this, function(Vue, VueUtil) {
	'use strict';
	var VueListItem = {
		template: '<div class="vue-list-item" :class="{ \'is-active\': isActive }" @click="handleClick"><slot></slot></div>',
		name: 'VueListItem',
		mixins: [VueUtil.component.emitter],
		data: function(){
			return {
				isActive: false
			}
		},
		methods: {
			handleClick: function() {
				this.dispatch('VueList', 'item-click', this);
				this.$emit('select');
			}
		}
	};
	Vue.component(VueListItem.name, VueListItem);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue'], definition);
	} else {
		context[name] = definition(context['Vue']);
		delete context[name];
	}
})('VueDivider', this, function(Vue) {
	'use strict';
	var VueDivider = {
		template: '<div class="vue-divider"><legend class="vue-divider__content" v-if="$slots.default"><slot></slot></legend></div>',
		name: 'VueDivider'
	};
	Vue.component(VueDivider.name, VueDivider);
});
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
﻿(function (name, context, definition) {
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VueDatePicker'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil'], context['VueDatePicker']);
		delete context['VueDatePicker'];
		delete context[name];
	}
})('VueCalendar', this, function (Vue, VueUtil, VueDatePicker) {
	'use strict';
	var findEventsByDate = function(date, events){
		if (events && events.length>0) {
			var findEvents = [];
			events.forEach(function(event){
				if (event.date && VueUtil.formatDate(date) === VueUtil.formatDate(event.date)) {
					findEvents.push(event);
				}
			});
			return findEvents;
		}
	};
	var VueCalendar = VueUtil.merge({}, VueDatePicker().DatePanel, {
		template: '<div :style="{width: width + \'px\'}" class="vue-picker-panel vue-date-picker has-time"><div class="vue-picker-panel__body-wrapper"><div class="vue-picker-panel__body"><div class="vue-date-picker__header" v-show="currentView !== \'time\'"><button type="button" @click="prevYear" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-d-arrow-left"></button><button type="button" @click="prevMonth" v-show="currentView === \'date\'" class="vue-picker-panel__icon-btn vue-date-picker__prev-btn vue-icon-arrow-left"></button><span @click="showYearPicker" class="vue-date-picker__header-label">{{ yearLabel }}</span><span @click="showMonthPicker" v-show="currentView === \'date\'" class="vue-date-picker__header-label" :class="{ active: currentView === \'month\' }">{{ monthLabel }}</span><button type="button" @click="nextYear" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-d-arrow-right"></button><button type="button" @click="nextMonth" v-show="currentView === \'date\'" class="vue-picker-panel__icon-btn vue-date-picker__next-btn vue-icon-arrow-right"></button></div><div class="vue-picker-panel__content"><date-table v-show="currentView === \'date\'" @pick="handleDatePick" :year="year" :month="month" :date="date" :week="week" :selection-mode="selectionMode" :first-day-of-week="firstDayOfWeek" :disabled-date="disabledDate" :events="events"></date-table><year-table ref="yearTable" :year="year" :date="date" v-show="currentView === \'year\'" @pick="handleYearPick" :disabled-date="disabledDate"></year-table><month-table :month="month" :date="date" v-show="currentView === \'month\'" @pick="handleMonthPick" :disabled-date="disabledDate"></month-table></div></div></div><div class="vue-picker-panel__footer"><a href="JavaScript:" class="vue-picker-panel__link-btn" @click="changeToNow">{{ nowLabel }}</a></div></div>',
		data: function() {
			return {
				date: new Date(),
				selectionMode: 'day',
				currentView: 'date',
				disabledDate: {},
				firstDayOfWeek: 1,
				year: null,
				month: null,
				week: null,
				width: 0
			};
		},
		props: {
			events: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		computed: {
			yearLabel: function() {
				var year = this.year;
				if (!year)
					return '';
				var yearTranslation = this.$t('vue.datepicker.year');
				if (this.currentView === 'year') {
					var startYear = Math.floor(year / 10) * 10;
					if (yearTranslation) {
						return startYear + ' ' + yearTranslation + ' - ' + (startYear + 9) + ' ' + yearTranslation;
					}
					return startYear + ' - ' + (startYear + 9);
				}
				return this.year + ' ' + yearTranslation;
			},
			monthLabel: function() {
				return this.$t('vue.datepicker.month' + (this.month + 1));
			},
			nowLabel: function() {
				return this.$t('vue.datepicker.today');
			}
		},
		created: function() {
			this.$on('pick', function(date) {
				var dateEvents = findEventsByDate(date, this.events);
				this.$emit('dayclick', date, dateEvents);
			});
		}
	});
	Vue.component('VueCalendar', VueCalendar);
});
!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VuePin', this, function(Vue, VueUtil) {
	'use strict';
	var root = window;
	var getScroll = function(target, top) {
		var prop = top ? 'pageYOffset' : 'pageXOffset';
		var method = top ? 'scrollTop' : 'scrollLeft';
		var ret = target[prop];
		if (typeof ret !== 'number') {
			ret = root.document.documentElement[method];
		}
		return ret;
	};
	var getOffset = function(element) {
		var rect = element.getBoundingClientRect();
		var scrollTop = getScroll(root, true);
		var scrollLeft = getScroll(root);
		var docEl = root.document.body;
		var clientTop = docEl.clientTop || 0;
		var clientLeft = docEl.clientLeft || 0;
		return {
			top: rect.top + scrollTop - clientTop,
			left: rect.left + scrollLeft - clientLeft
		};
	};
	var getStyleComputedProperty = function(element, property) {
		var css = root.getComputedStyle(element, null);
		return css[property];
	};
	var getScrollParent = function(element) {
		var parent = element.parentNode;
		if (!parent) {
			return element;
		}
		if (parent === root.document) {
			if (root.document.body.scrollTop) {
				return root.document.body;
			} else {
				return root.document.documentElement;
			}
		}
		if (['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow')) !== -1 || ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-x')) !== -1 || ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-y')) !== -1) {
			return parent;
		}
		return getScrollParent(element.parentNode);
	};
	var VuePin = {
		template: '<div><div :style="styles"><slot></slot></div></div>',
		name: 'VuePin',
		props: {
			offsetTop: {
				type: Number,
				default: 0
			},
			offsetBottom: {
				type: Number
			},
			fixed: Boolean
		},
		data: function() {
			return {
				pin: false,
				scrollParent: null,
				styles: {}
			};
		},
		computed: {
			offsetType: function() {
				var type = 'top';
				if (this.offsetBottom >= 0) {
					type = 'bottom';
				}
				return type;
			}
		},
		mounted: function() {
			var self = this;
			self.$nextTick(function(){
				if (self.fixed) {
					self.pin = true;
					var elOffset = getOffset(self.$el);
					if (self.offsetType == 'bottom') {
						self.styles = {
							bottom: self.offsetBottom + 'px',
							left: elOffset.left + 'px',
							width: self.$el.offsetWidth + 'px',
							position: 'fixed'
						};
					} else {
						self.styles = {
							top: self.offsetTop + 'px',
							left: elOffset.left + 'px',
							width: self.$el.offsetWidth + 'px',
							position: 'fixed'
						};
					}
				} else {
					self.scrollParent = getScrollParent(self.$el);
					VueUtil.on(self.scrollParent,'scroll', self.handleScroll);
					VueUtil.addResizeListener(self.$el, self.handleScroll);
				}
			});
		},
		beforeDestroy: function() {
			if (!this.fixed) {
				VueUtil.off(this.scrollParent, 'scroll', this.handleScroll);
				VueUtil.removeResizeListener(this.$el, this.handleScroll);
			}
		},
		methods: {
			handleScroll: function() {
				var pin = this.pin;
				var scrollTop = getScroll(root, true);
				var elOffset = getOffset(this.$el);
				var windowHeight = root.innerHeight;
				var elHeight = this.$el.getElementsByTagName('div')[0].offsetHeight;
				if ((elOffset.top - this.offsetTop) < scrollTop && this.offsetType == 'top' && !pin) {
					this.pin = true;
					this.styles = {
						top: this.offsetTop + 'px',
						left: elOffset.left + 'px',
						width: this.$el.offsetWidth + 'px',
						position: 'fixed'
					};
					this.$emit('change', true);
				} else if ((elOffset.top - this.offsetTop) > scrollTop && this.offsetType == 'top' && pin) {
					this.pin = false;
					this.styles = null;
					this.$emit('change', false);
				}
				if ((elOffset.top + this.offsetBottom + elHeight) > (scrollTop + windowHeight) && this.offsetType == 'bottom' && !pin) {
					this.pin = true;
					this.styles = {
						bottom: this.offsetBottom + 'px',
						left: elOffset.left + 'px',
						width: this.$el.offsetWidth + 'px',
						position: 'fixed'
					};
					this.$emit('change', true);
				} else if ((elOffset.top + this.offsetBottom + elHeight) < (scrollTop + windowHeight) && this.offsetType == 'bottom' && pin) {
					this.pin = false;
					this.styles = null;
					this.$emit('change', false);
				}
			}
		}
	}
	Vue.component(VuePin.name, VuePin);
});
!(function(context) {
	'use strict';
	delete context.Cleave;
	delete context.DateUtil;
	delete context.Popper;
	delete context.Screenfull;
	delete context.Sortable;
	delete context.VueButton;
	delete context.VueButtonGroup;
	delete context.VueCheckbox;
	delete context.VueCheckboxGroup;
	delete context.VueCol;
	delete context.VueInput;
	delete context.VueOption;
	delete context.VuePicker;
	delete context.VuePopper;
	delete context.VuePopup;
	delete context.VueProgress;
	delete context.VueScrollbar;
	delete context.VueSelect;
	delete context.VueSelectDropdown;
	delete context.VueTag;
	delete context.VueTimePicker;
	delete context.VueTooltip;
	delete context.VueValidator;
	delete context.VueResource;
	delete context.VueI18n;
})(this)