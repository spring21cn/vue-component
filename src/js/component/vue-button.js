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
