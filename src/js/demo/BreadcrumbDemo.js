!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("BreadcrumbDemo", this, function() {
    'use strict';
    var breadcrumbDemo = {
        path: '/breadcrumb',
        name: 'breadcrumb',
        head: {
            label: 'Breadcrumb 面包屑',
            description: '显示当前页面的路径，快速返回之前的任意页面。'
        },
        samples: [{
            id: 'breadcrumb1',
            label: '基础用法',
            description: '设置 separator 属性，来改变分隔符,默认为斜杠\'/\'',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">默认分隔符</span></vue-col><vue-col :span="16"><vue-breadcrumb class="demonstration"><vue-breadcrumb-item>组件列表</vue-breadcrumb-item><vue-breadcrumb-item>Breadcrumb</vue-breadcrumb-item></vue-breadcrumb></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">设置分隔符</span></vue-col><vue-col :span="16"><vue-breadcrumb separator="—" class="demonstration"><vue-breadcrumb-item>开发指南</vue-breadcrumb-item><vue-breadcrumb-item>快速上手</vue-breadcrumb-item></vue-breadcrumb></vue-col></vue-row></div>',
            code: '<span class="demonstration">默认分隔符</span>\n'+
            '<vue-breadcrumb>\n'+
            '    <vue-breadcrumb-item>组件列表</vue-breadcrumb-item>\n'+
            '    <vue-breadcrumb-item>Breadcrumb</vue-breadcrumb-item>\n'+
            '</vue-breadcrumb>\n'+
            '<span class="demonstration">设置分隔符</span>\n'+
            '<vue-breadcrumb separator="—">\n'+
            '    <vue-breadcrumb-item>开发指南</vue-breadcrumb-item>\n'+
            '    <vue-breadcrumb-item>快速上手</vue-breadcrumb-item>\n'+
            '</vue-breadcrumb>'
        }]
    };
    return breadcrumbDemo;
});

