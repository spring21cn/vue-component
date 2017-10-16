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
			target.phoneRegionCode = opts.phoneRegionCode || 'CN';
			target.phoneFormatter = {};
			target.date = !!opts.date;
			target.datePattern = opts.datePattern || ['Y', 'm', 'd'];
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
