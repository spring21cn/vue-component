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
			plain:  {
				type: Boolean,
				default: false
			}
		},
		computed: {
			typeClass: function() {
				return 'vue-note--' + this.type;
			},
			typeBox: function() {
				if (this.plain) {
					return 'vue-note--plain';
				}
			}
		}
	};
	Vue.component(VueNote.name, VueNote);
});
