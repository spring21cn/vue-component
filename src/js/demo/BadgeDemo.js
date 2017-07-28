!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("BadgeDemo", this, function() {
    'use strict';
    var badgeDemo = {
        path: '/badge',
        name: 'badge',
        head: {
            label: 'Badge 标记',
            description: '出现在按钮、图标旁的数字或状态标记。'
        },
        samples: [{
            id: 'badge1',
            label: '基础用法',
            description: '定义value属性，它接受Number或者String。最大值由max属性定义，它接受一个Number，只有当value为Number时，它才会生效。设置is-dot属性以红点的形式标注',
            template: '<div class="source"><vue-row><vue-col :span="4"><vue-badge :value="12"><vue-button size="small">评论</vue-button></vue-badge></vue-col><vue-col :span="4"><vue-badge :value="100" :max="99"><vue-button size="small">查看</vue-button></vue-badge></vue-col><vue-col :span="4"><vue-badge value="new"><vue-button size="small">新闻</vue-button></vue-badge></vue-col><vue-col :span="4"><vue-badge is-dot><vue-button size="small">消息</vue-button></vue-badge></vue-col><vue-col :span="4"><vue-badge :value="12"></vue-badge></vue-col></vue-row></div>',
            code: '<vue-badge :value="12">\n'+
            '    <vue-button size="small">评论</vue-button>\n'+
            '</vue-badge>\n'+
            '<vue-badge :value="100" :max="99">\n'+
            '    <vue-button size="small">查看</vue-button>\n'+
            '</vue-badge>\n'+
            '<vue-badge value="new">\n'+
            '    <vue-button size="small">新闻</vue-button>\n'+
            '</vue-badge>\n'+
            '<vue-badge is-dot>\n'+
            '    <vue-button size="small">消息</vue-button>\n'+
            '</vue-badge>\n'+
            '<vue-badge :value="12">\n'+
            '</vue-badge>'
        }]
    };
    return badgeDemo;
});

