!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("PinDemo", this, function() {
    'use strict';
    var pinDemo = {
        path: '/pin',
        name: 'pin',
        head: {
            label: 'Pin 图钉',
            description: '使用图钉，可以将内容固定在屏幕上，并且不随页面的滚动而滚动。常用于侧边菜单等。可以通过调整浏览器窗口高度来查看效果'
        },
        samples: [{
            id: 'pin1',
            label: '基础用法',
            description: '简单使用，当元素不可见时，直接固定在最顶端。',
            template: '<div class="source"><vue-pin><vue-button type="primary">固定在最顶部</vue-button></vue-pin></div>',
            code: '<vue-pin>\n    <vue-button type="primary">固定在最顶部</vue-button>\n</vue-pin>'
        }, {
            id: 'pin4',
            label: '偏移&固定状态改变时的回调',
            description: '设置offset-top或offset-bottom可当滚动到一定距离时再固定。当固定状态发生改变时，会触发change事件。',
            template: '<div class="source"><vue-pin :offset-top="50" @change="change"><vue-button type="primary">固定在距离顶部 50px 的位置</vue-button></vue-pin></div>',
            parameter: {
                methods: {
                    change: function(status) {
                        this.$notify({title:'当前状态：' + status});
                    }
                }
            },
            code: '<vue-pin :offset-top="50" @change="change">\n    <vue-button type="primary">固定在距离顶部 50px 的位置</vue-button>\n</vue-pin>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            change: function(status) {\n'+
            '                this.$notify({title:"当前状态：" + status});\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'pin3',
            label: '固定在底部',
            description: '在屏幕下方固定。注意，offset-top和offset-bottom只可以设置一个，如果都设置，会使用offset-top。',
            template: '<div class="source"><vue-pin :offset-bottom="20"><vue-button type="primary">固定在距离底部 20px 的位置</vue-button></vue-pin></div>',
            code: '<vue-pin :offset-bottom="20">\n    <vue-button type="primary">固定在距离底部 20px 的位置</vue-button>\n</vue-pin>'
        }, {
            id: 'pin5',
            label: '始终固定',
            description: '设置fixed属性可始终固定在一个位置',
            template: '<div class="source"><vue-row type="flex" justify="center"><vue-col :span="6"><vue-pin :offset-bottom="0" fixed><vue-button type="primary">始终固定在距离底部位置</vue-button></vue-pin></vue-col></vue-row></div>',
            code: '<vue-pin :offset-bottom="0" fixed>\n    <vue-button type="primary">始终固定在距离底部 位置</vue-button>\n</vue-pin>'
        }]
    };
    return pinDemo;
});
