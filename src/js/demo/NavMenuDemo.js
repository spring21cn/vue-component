!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("NavMenuDemo", this, function() {
    'use strict';
    var navMenuDemo = {
        path: '/navMenu',
        name: 'navMenu',
        head: {
            label: 'NavMenu 导航菜单',
            description: '为网站提供导航功能的菜单。'
        },
        samples: [{
            id: 'navMenu1',
            label: '顶栏',
            description: '导航菜单默认为垂直模式，通过 mode 属性可以使导航菜单变更为水平模式。另外，在菜单中通过 submenu 组件可以生成二级菜单。通过 theme 属性可以设置主题',
            template: '<div class="source"><vue-menu theme="dark" :default-active="activeIndex1" mode="horizontal" @select="handleSelect"><vue-menu-item index="1">处理中心</vue-menu-item><vue-submenu index="2"><template slot="title">我的工作台</template><vue-menu-item index="2-1">选项1</vue-menu-item><vue-menu-item index="2-2">选项2</vue-menu-item><vue-menu-item index="2-3">选项3</vue-menu-item></vue-submenu><vue-menu-item index="3">订单管理</vue-menu-item></vue-menu><div style="margin:30px"></div><vue-menu :default-active="activeIndex2" mode="horizontal" @select="handleSelect"><vue-menu-item index="1">处理中心</vue-menu-item><vue-submenu index="2"><template slot="title">我的工作台</template><vue-menu-item index="2-1">选项1</vue-menu-item><vue-menu-item index="2-2">选项2</vue-menu-item><vue-menu-item index="2-3">选项3</vue-menu-item></vue-submenu><vue-menu-item index="3">订单管理</vue-menu-item></vue-menu></div>',
            parameter: {
                data: function() {
                    return {
                      activeIndex1: '1',
                      activeIndex2: '3'
                    }
                },
                methods: {
                  handleSelect: function(key, keyPath) {
                    console.log(key, keyPath);
                  }
                }
            },
            code: '<vue-menu theme="dark" :default-active="activeIndex1" mode="horizontal" @select="handleSelect">\n'+
            '    <vue-menu-item index="1">处理中心</vue-menu-item>\n'+
            '    <vue-submenu index="2">\n'+
            '        <template slot="title">我的工作台</template>\n'+
            '        <vue-menu-item index="2-1">选项1</vue-menu-item>\n'+
            '        <vue-menu-item index="2-2">选项2</vue-menu-item>\n'+
            '        <vue-menu-item index="2-3">选项3</vue-menu-item>\n'+
            '    </vue-submenu>\n'+
            '    <vue-menu-item index="3">订单管理</vue-menu-item>\n'+
            '</vue-menu>\n'+
            '<vue-menu :default-active="activeIndex2" mode="horizontal" @select="handleSelect">\n'+
            '    <vue-menu-item index="1">处理中心</vue-menu-item>\n'+
            '    <vue-submenu index="2">\n'+
            '        <template slot="title">我的工作台</template>\n'+
            '        <vue-menu-item index="2-1">选项1</vue-menu-item>\n'+
            '        <vue-menu-item index="2-2">选项2</vue-menu-item>\n'+
            '        <vue-menu-item index="2-3">选项3</vue-menu-item>\n'+
            '    </vue-submenu>\n'+
            '    <vue-menu-item index="3">订单管理</vue-menu-item>\n'+
            '</vue-menu>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return {\n'+
            '                activeIndex1: "1",\n'+
            '                activeIndex2: "3"\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            handleSelect: function(key, keyPath) {\n'+
            '                console.log(key, keyPath);\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'navMenu2',
            label: '侧栏',
            description: '通过vue-menu-item-group 组件可以实现菜单进行分组，分组名可以通过 title 属性直接设定也可以通过具名 slot 来设定。',
            template: '<div class="source"><vue-row class="tac"><vue-col :span="8"><h4>带 icon</h4><vue-menu default-active="2" class="vue-menu-vertical-demo" @open="handleOpen" @close="handleClose"><vue-submenu index="1"><template slot="title"><i class="vue-icon-message"></i>导航一</template><vue-menu-item-group><template slot="title">分组一</template><vue-menu-item index="1-1">选项1</vue-menu-item><vue-menu-item index="1-2">选项2</vue-menu-item></vue-menu-item-group><vue-menu-item-group title="分组2"><vue-menu-item index="1-3">选项3</vue-menu-item></vue-menu-item-group><vue-submenu index="1-4"><template slot="title">选项4</template><vue-menu-item index="1-4-1">选项1</vue-menu-item></vue-submenu></vue-submenu><vue-menu-item index="2"><i class="vue-icon-menu"></i>导航二</vue-menu-item><vue-menu-item index="3"><i class="vue-icon-setting"></i>导航三</vue-menu-item></vue-menu></vue-col><vue-col :span="8"><h4>不带 icon</h4><vue-menu default-active="2" class="vue-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark"><vue-submenu index="1"><template slot="title">导航一</template><vue-menu-item-group title="分组一"><vue-menu-item index="1-1">选项1</vue-menu-item><vue-menu-item index="1-2">选项2</vue-menu-item></vue-menu-item-group><vue-menu-item-group title="分组2"><vue-menu-item index="1-3">选项3</vue-menu-item></vue-menu-item-group><vue-submenu index="1-4"><template slot="title">选项4</template><vue-menu-item index="1-4-1">选项1</vue-menu-item></vue-submenu></vue-submenu><vue-menu-item index="2">导航二</vue-menu-item><vue-menu-item index="3">导航三</vue-menu-item></vue-menu></vue-col><vue-col :span="8"><h4>分组</h4><vue-menu mode="vertical" default-active="1" class="vue-menu-vertical-demo"><vue-menu-item-group title="分组一"><vue-menu-item index="1"><i class="vue-icon-message"></i>导航一</vue-menu-item><vue-menu-item index="2"><i class="vue-icon-message"></i>导航二</vue-menu-item></vue-menu-item-group><vue-menu-item-group title="分组二"><vue-menu-item index="3"><i class="vue-icon-message"></i>导航三</vue-menu-item><vue-menu-item index="4"><i class="vue-icon-message"></i>导航四</vue-menu-item></vue-menu-item-group></vue-menu></vue-col></vue-row></div>',
            parameter: {
                methods: {
                  handleOpen: function(key, keyPath) {
                      console.log(key, keyPath);
                  },
                  handleClose: function(key, keyPath) {
                    console.log(key, keyPath);
                  }
                }
            },
            code: '<vue-row class="tac">\n'+
            '    <vue-col :span="8">\n'+
            '        <h4>带 icon</h4>\n'+
            '        <vue-menu default-active="2" class="vue-menu-vertical-demo" @open="handleOpen" @close="handleClose">\n'+
            '            <vue-submenu index="1">\n'+
            '                <template slot="title"><i class="vue-icon-message"></i>导航一</template>\n'+
            '                <vue-menu-item-group>\n'+
            '                    <template slot="title">分组一</template>\n'+
            '                    <vue-menu-item index="1-1">选项1</vue-menu-item>\n'+
            '                    <vue-menu-item index="1-2">选项2</vue-menu-item>\n'+
            '                </vue-menu-item-group>\n'+
            '                <vue-menu-item-group title="分组2">\n'+
            '                    <vue-menu-item index="1-3">选项3</vue-menu-item>\n'+
            '                </vue-menu-item-group>\n'+
            '                <vue-submenu index="1-4">\n'+
            '                    <template slot="title">选项4</template>\n'+
            '                    <vue-menu-item index="1-4-1">选项1</vue-menu-item>\n'+
            '                </vue-submenu>\n'+
            '            </vue-submenu>\n'+
            '            <vue-menu-item index="2"><i class="vue-icon-menu"></i>导航二</vue-menu-item>\n'+
            '            <vue-menu-item index="3"><i class="vue-icon-setting"></i>导航三</vue-menu-item>\n'+
            '        </vue-menu>\n'+
            '    </vue-col>\n'+
            '    <vue-col :span="8">\n'+
            '        <h4>不带 icon</h4>\n'+
            '        <vue-menu default-active="2" class="vue-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark">\n'+
            '            <vue-submenu index="1">\n'+
            '                <template slot="title">导航一</template>\n'+
            '                <vue-menu-item-group title="分组一">\n'+
            '                    <vue-menu-item index="1-1">选项1</vue-menu-item>\n'+
            '                    <vue-menu-item index="1-2">选项2</vue-menu-item>\n'+
            '                </vue-menu-item-group>\n'+
            '                <vue-menu-item-group title="分组2">\n'+
            '                    <vue-menu-item index="1-3">选项3</vue-menu-item>\n'+
            '                </vue-menu-item-group>\n'+
            '                <vue-submenu index="1-4">\n'+
            '                    <template slot="title">选项4</template>\n'+
            '                    <vue-menu-item index="1-4-1">选项1</vue-menu-item>\n'+
            '                </vue-submenu>\n'+
            '            </vue-submenu>\n'+
            '            <vue-menu-item index="2">导航二</vue-menu-item>\n'+
            '            <vue-menu-item index="3">导航三</vue-menu-item>\n'+
            '        </vue-menu>\n'+
            '    </vue-col>\n'+
            '    <vue-col :span="8">\n'+
            '        <h4>分组</h4>\n'+
            '        <vue-menu mode="vertical" default-active="1" class="vue-menu-vertical-demo">\n'+
            '            <vue-menu-item-group title="分组一">\n'+
            '                <vue-menu-item index="1"><i class="vue-icon-message"></i>导航一</vue-menu-item>\n'+
            '                <vue-menu-item index="2"><i class="vue-icon-message"></i>导航二</vue-menu-item>\n'+
            '            </vue-menu-item-group>\n'+
            '            <vue-menu-item-group title="分组二">\n'+
            '                <vue-menu-item index="3"><i class="vue-icon-message"></i>导航三</vue-menu-item>\n'+
            '                <vue-menu-item index="4"><i class="vue-icon-message"></i>导航四</vue-menu-item>\n'+
            '            </vue-menu-item-group>\n'+
            '        </vue-menu>\n'+
            '    </vue-col>\n'+
            '</vue-row>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            handleOpen: function(key, keyPath) {\n'+
            '                console.log(key, keyPath);\n'+
            '            },\n'+
            '            handleClose: function(key, keyPath) {\n'+
            '                console.log(key, keyPath);\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return navMenuDemo;
});

