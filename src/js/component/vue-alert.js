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
