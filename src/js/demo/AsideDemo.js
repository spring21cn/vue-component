!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("AsideDemo", this, function() {
    'use strict';
    var asideDemo = {
        path: '/aside',
        name: 'aside',
        head: {
            label: 'Aside 侧边栏',
            description: '在保留当前页面状态的情况下，在侧边承载相关操作。'
        },
        samples: [{
            id: 'aside1',
            label: '基础用法',
            description: '需要设置v-model属性，它接收Boolean，设置left属性控制左右显示。Aside 分为三个部分：header,body和footer，header需要具名为header的slot, footer需要具名为footer的slot。title属性用于定义标题，它是可选的，默认值为空, 当header存在时title不显示。show-close属性显示关闭按钮,默认为false。本例通过显式改变v-model的值来打开 Aside，',
            template: '<div class="source"><vue-aside title="提示" v-model="asideVisible" :left="asideLeft" size="tiny"><span>这是内容</span><span slot="footer"><vue-button @click="asideVisible = false">取 消</vue-button><vue-button type="primary" @click="asideVisible = false">确 定</vue-button></span></vue-aside><vue-row><vue-col :span="6"><vue-button @click="openasideLeft">左边显示</vue-button></vue-col><vue-col :span="6"><vue-button @click="openasideRight">右边显示</vue-button></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        asideLeft: false,
                        asideVisible: false
                    }
                },
                methods: {
                    openasideLeft: function() {
                        this.asideLeft = true;
                        this.asideVisible = true;
                    },
                    openasideRight: function() {
                        this.asideLeft = false;
                        this.asideVisible = true;
                    }
                }
            },
            code: '<vue-aside v-model="asideVisible" :left="asideLeft" size="tiny" title="提示">\n'+
            '    <span>这是内容</span>\n'+
            '    <span slot="footer">\n'+
            '        <vue-button @click="asideVisible = false">取 消</vue-button>\n'+
            '        <vue-button type="primary" @click="asideVisible = false">确 定</vue-button>\n'+
            '    </span>\n'+
            '</vue-aside>\n'+
            '<vue-button @click="openasideLeft">左边显示Aside</vue-button>\n'+
            '<vue-button @click="openasideRight">右边显示Aside</vue-button>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: {\n'+
            '            return: function() {\n'+
            '                 asideLeft: false,\n'+
            '                 asideVisible: false\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            openasideLeft: function() {\n'+
            '                this.asideLeft = true;\n'+
            '                this.asideVisible = true;\n'+
            '            },\n'+
            '            openasideRight: function() {\n'+
            '                this.asideLeft = false;\n'+
            '                this.asideVisible = true;\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'aside2',
            label: '区域表示',
            description: '设置relative属性, 在父容器内展示',
            template: '<div class="source"><div class="phone-viewport"><vue-menu theme="dark" default-active="1" mode="horizontal" @select="asideVisible = true"><vue-menu-item index="1"><i class="vue-icon-setting"></i>设置</vue-menu-item></vue-menu><vue-aside v-model="asideVisible" relative left size="large" close-on-click-modal title="Aside content"><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi cupiditate esse necessitatibus beatae nobis, deserunt ut est fugit, tempora deleniti, eligendi commodi doloribus. Nemo, assumenda possimus, impedit inventore perferendis iusto!</span></vue-aside></div></div>',
            parameter: {
                data: function() {
                    return {
                        asideVisible: false
                    }
                }
            },
            code: '<div class="phone-viewport">\n'+
            '    <vue-menu theme="dark" default-active="1" mode="horizontal" @select="asideVisible = true">\n'+
            '        <vue-menu-item index="1">\n'+
            '            <i class="vue-icon-setting"></i>设置\n'+
            '        </vue-menu-item>\n'+
            '    </vue-menu>\n'+
            '    <vue-aside v-model="asideVisible" relative left size="large" close-on-click-modal title="Aside content">\n'+
            '        <span>\n'+
            '            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi cupiditate esse necessitatibus beatae nobis, deserunt ut est fugit, tempora deleniti, eligendi commodi doloribus. Nemo, assumenda possimus, impedit inventore perferendis iusto!\n'+
            '        </span>\n'+
            '    </vue-aside>\n'+
            '</div>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: {\n'+
            '            return: function() {\n'+
            '                 asideVisible: false\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return asideDemo;
});

