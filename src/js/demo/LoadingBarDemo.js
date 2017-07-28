!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("LoadingBarDemo", this, function() {
    'use strict';
    var loadingBarDemo = {
        path: '/loadingBar',
        name: 'loadingBar',
        head: {
            label: 'LoadingBar 加载进度条',
            description: '全局创建一个显示页面加载、异步请求、文件上传等的加载进度条。'
        },
        samples: [{
            id: 'loadingBar1',
            label: '基础用法',
            description: '点击 Start 开始进度，点击 Finish 结束。在调用start()方法后，组件会自动模拟进度，当调用finish()或error()时，补全进度并自动消失。',
            template: '<div class="source"><vue-button @click="start">Start</vue-button><vue-button @click="finish">Finish</vue-button><vue-button @click="error">Error</vue-button></div>',
            parameter: {
                methods: {
                    start: function() {
                        this.$Loading.start();
                    },
                    finish: function() {
                        this.$Loading.finish();
                    },
                    error: function() {
                        this.$Loading.error();
                    }
                }
            },
            code: '<vue-button @click="start">Start</vue-button>\n'+
            '<vue-button @click="finish">Finish</vue-button>\n'+
            '<vue-button @click="error">Error</vue-button>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            start: function() {\n'+
            '                this.$Loading.start();\n'+
            '            },\n'+
            '            finish: function() {\n'+
            '                this.$Loading.finish();\n'+
            '            },\n'+
            '            error: function() {\n'+
            '                this.$Loading.error();\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return loadingBarDemo;
});

