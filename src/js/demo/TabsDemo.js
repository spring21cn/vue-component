!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("TabsDemo", this, function() {
    'use strict';
    var tabsDemo = {
        path: '/tabs',
        name: 'tabs',
        head: {
            label: 'Tabs 标签页',
            description: '分隔内容上有关联但属于不同类别的数据集合。'
        },
        samples: [{
            id: 'tabs1',
            label: '基础用法',
            description: 'Tabs 组件提供了选项卡功能，默认选中第一个标签页，你也可以通过 value 属性来指定当前选中的标签页',
            template: '<div class="source"><vue-tabs v-model="activeName" @tab-click="handleClick"><vue-tab-pane label="用户管理" name="first">用户管理</vue-tab-pane><vue-tab-pane label="配置管理" name="second">配置管理</vue-tab-pane><vue-tab-pane label="角色管理" name="third">角色管理</vue-tab-pane><vue-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</vue-tab-pane></vue-tabs></div>',
            parameter: {
                data: function() {
                    return {
                      activeName: "second"
                    }
                },
                methods: {
                  handleClick: function(tab, event) {
                    console.log(tab, event);
                  }
                }
            },
            code: '<vue-tabs v-model="activeName" @tab-click="handleClick">\n'+
            '    <vue-tab-pane label="用户管理" name="first">用户管理</vue-tab-pane>\n'+
            '    <vue-tab-pane label="配置管理" name="second">配置管理</vue-tab-pane>\n'+
            '    <vue-tab-pane label="角色管理" name="third">角色管理</vue-tab-pane>\n'+
            '    <vue-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</vue-tab-pane>\n'+
            '</vue-tabs>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return {\n'+
            '                activeName: "second"\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            handleClick: function(tab, event) {\n'+
            '                console.log(tab, event);\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return tabsDemo;
});

