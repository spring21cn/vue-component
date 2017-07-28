!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("DialogDemo", this, function() {
    'use strict';
    var dialogDemo = {
        path: '/dialog',
        name: 'dialog',
        head: {
            label: 'Dialog 对话框',
            description: '在保留当前页面状态的情况下，告知用户并承载相关操作。'
        },
        samples: [{
            id: 'dialog1',
            label: '基础用法',
            description: '需要设置v-model属性，它接收Boolean，当为true时显示 Dialog。Dialog 分为三个部分：header,body和footer，header需要具名为header的slot, footer需要具名为footer的slot。title属性用于定义标题，它是可选的，默认值为空, 当header存在时title不显示。show-close属性显示关闭按钮,默认为false。本例通过显式改变v-model的值来打开 Dialog，',
            template: '<div class="source"><vue-button type="primary" @click="dialogVisible = true">点我</vue-button><vue-dialog title="提示" v-model="dialogVisible" size="tiny" show-close><span slot="header">这是提示</span><span>这是一段信息</span><span slot="footer"><vue-button @click="dialogVisible = false">取 消</vue-button><vue-button type="primary" @click="dialogVisible = false">确 定</vue-button></span></vue-dialog></div>',
            parameter: {
                data: function() {
                    return {
                        dialogVisible: false
                    }
                }
            },
            code: '<vue-button type="primary" @click="dialogVisible = true">点我</vue-button>\n'+
            '<vue-dialog title="提示" v-model="dialogVisible" size="tiny" show-close>\n'+
            '    <span slot="header">这是提示</span>\n'+
            '    <span>这是一段信息</span>\n'+
            '    <span slot="footer" class="dialog-footer">\n'+
            '        <vue-button @click="dialogVisible = false">取 消</vue-button>\n'+
            '        <vue-button type="primary" @click="dialogVisible = false">确 定</vue-button>\n'+
            '    </span>\n'+
            '</vue-dialog>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return {\n'+
            '                dialogVisible: false\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return dialogDemo;
});

