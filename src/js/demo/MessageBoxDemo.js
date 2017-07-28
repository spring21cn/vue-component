!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("MessageBoxDemo", this, function() {
    'use strict';
    var messageBoxDemo = {
        path: '/messageBox',
        name: 'messageBox',
        head: {
            label: 'MessageBox 弹框',
            description: '模拟系统的消息提示框而实现的一套模态对话框组件。'
        },
        samples: [{
            id: 'messageBox1',
            label: '消息提示',
            description: '调用$alert方法即可打开消息提示，它模拟了系统的 alert，',
            template: '<div class="source"><vue-button type="text" @click="open">点击打开 Message Box</vue-button></div>',
            parameter: {
                methods: {
                  open: function() {
                    this.$alert("这是一段内容", "标题名称", {
                      confirmButtonText: "确定",
                      callback: function(action) {
                        console.log(action);
                      }
                    });
                  }
                }
            },
            code: '<vue-button type="text" @click="open">点击打开 Message Box</vue-button>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            open: function() {\n'+
            '                this.$alert("这是一段内容", "标题名称", {\n'+
            '                    confirmButtonText: "确定",\n'+
            '                    callback: function(action) {\n'+
            '                        console.log(action);\n'+
            '                    }\n'+
            '                });\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'messageBox2',
            label: '确认消息',
            description: '调用$confirm方法即可打开消息提示，它模拟了系统的 confirm。',
            template: '<div class="source"><vue-button type="text" @click="open">点击打开 Message Box</vue-button></div>',
            parameter: {
                methods: {
                  open: function() {
                    var self = this;
                    self.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning"
                    }).then(function() {
                      self.$alert("删除成功!");
                    }).catch(function() {
                      self.$alert("已取消删除!");
                    });
                  }
                }
            },
            code: '<vue-button type="text" @click="open">点击打开 Message Box</vue-button>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            open: function() {\n'+
            '                this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {\n'+
            '                    confirmButtonText: "确定",\n'+
            '                    cancelButtonText: "取消",\n'+
            '                    type: "warning",\n'+
            '                }).then(function() {\n'+
            '                        self.$alert("删除成功!");\n'+
            '                    });\n'+
            '                }).catch(function() {\n'+
            '                        self.$alert("已取消删除!");\n'+
            '                    });\n'+
            '                });\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return messageBoxDemo;
});

