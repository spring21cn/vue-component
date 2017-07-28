!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("IconDemo", this, function() {
    'use strict';
    var iconDemo = {
        path: '/icon',
        name: 'icon',
        head: {
            label: 'iconDemo.label',
            description: 'iconDemo.description'
        },
        samples: [{
            label: 'iconDemo.samples1.label',
            description: 'iconDemo.samples1.description',
            template: '<div class="source"><i class="vue-icon-edit"></i><i class="vue-icon-share"></i><i class="vue-icon-delete"></i><vue-button type="primary" icon="vue-icon-search">Search</vue-button></div>',
            code: '<i class="vue-icon-edit"></i>\n<i class="vue-icon-share"></i>\n<i class="vue-icon-delete"></i>\n<vue-button type="primary" icon="vue-icon-search">Search</vue-button>',
            id: 'icon1'
        }, {
            label: 'iconDemo.samples2.label',
            description: '',
            template: '<div class="source source-icon"><ul class="icon-list"><li v-for="(icon,index) in iconAry" :key="index"><span><i :class="icon"></i><span style="font-size: 11px;">{{icon}}</span></span></li></ul></div>',
            parameter: {
                data: function() {
                	return {
                		iconAry: ['vue-icon-arrow-down', 'vue-icon-arrow-left', 'vue-icon-arrow-right', 'vue-icon-arrow-up', 'vue-icon-caret-bottom', 'vue-icon-caret-left', 'vue-icon-caret-right', 'vue-icon-caret-top', 'vue-icon-check', 'vue-icon-circle-check', 'vue-icon-circle-close', 'vue-icon-circle-cross', 'vue-icon-close', 'vue-icon-upload', 'vue-icon-d-arrow-left', 'vue-icon-d-arrow-right', 'vue-icon-d-caret', 'vue-icon-date', 'vue-icon-delete', 'vue-icon-document', 'vue-icon-edit', 'vue-icon-information', 'vue-icon-loading', 'vue-icon-menu', 'vue-icon-message', 'vue-icon-minus', 'vue-icon-more', 'vue-icon-picture', 'vue-icon-plus', 'vue-icon-search', 'vue-icon-setting', 'vue-icon-share', 'vue-icon-star-off', 'vue-icon-star-on', 'vue-icon-time', 'vue-icon-warning', 'vue-icon-delete2', 'vue-icon-view', 'vue-icon-upload2', 'vue-icon-download', 'vue-icon-download2', 'vue-icon-print']
                	}
                }
            },
            id: 'icon2',
            notshowmeta: true
        }]
    };
    return iconDemo;
});