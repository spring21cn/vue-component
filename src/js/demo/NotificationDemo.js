!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("NotificationDemo", this, function() {
    'use strict';
    var notificationDemo = {
        path: '/notification',
        name: 'notification',
        head: {
            label: 'Notification 通知',
            description: '悬浮出现在页面右上角，显示全局的通知提醒消息。'
        },
        samples: [{
            id: 'notification1',
            label: '消息提示',
            description: '可以设置title字段和message字段，用于设置通知的标题和正文。默认情况下，经过一段时间后 Notification 组件会自动关闭，但是通过设置duration，可以控制关闭的时间间隔，如果设置为0，则不会自动关闭。有四种通知类型：success, warning, info, error。通过type字段来设置',
            template: '<div class="source"><vue-row class="margin-bottom20"><vue-col :span="6"><vue-button plain @click="open1">自动关闭</vue-button></vue-col><vue-col :span="6"><vue-button plain @click="open2">不自动关闭</vue-button></vue-col></vue-row><vue-row><vue-col :span="3"><vue-button plain @click="open3">成功</vue-button></vue-col><vue-col :span="3"><vue-button plain @click="open4">警告</vue-button></vue-col><vue-col :span="3"><vue-button plain @click="open5">信息</vue-button></vue-col><vue-col :span="3"><vue-button plain @click="open6">错误</vue-button></vue-col></vue-row></div>',
            parameter: {
                methods: {
                  open1: function () {
                    var h = this.$createElement;
                    this.$notify({
                      title : '关闭',
                      message : h('p', {
                        style : 'color: red'
                      }, '我会自动关闭')
                    });
                  },
                  open2: function () {
                    this.$notify({
                      title : '不关闭',
                      message : '我不会自动关闭',
                      duration : 0
                    });
                  },
                  open3: function () {
                    this.$notify({
                      title: '成功',
                      message: '我是成功消息',
                      type: 'success'
                    });
                  },
                  open4: function () {
                    this.$notify({
                        title: '警告',
                        message: '我是警告消息',
                        type: 'warning'
                    });
                  },
                  open5: function () {
                    this.$notify.info({
                        title: '信息',
                        message: '我是信息消息'
                    });
                  },
                  open6: function () {
                    this.$notify.error({
                        title: '错误',
                        message: '我是错误消息'
                    });
                  }
                }
            },
            code: '<vue-button plain @click="open1">自动关闭</vue-button>\n'+
            '<vue-button plain @click="open2">不自动关闭</vue-button>\n'+
            '<vue-button plain @click="open3">成功</vue-button>\n'+
            '<vue-button plain @click="open4">警告</vue-button>\n'+
            '<vue-button plain @click="open5">信息</vue-button>\n'+
            '<vue-button plain @click="open6">错误</vue-button>\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            open1: function() {\n'+
            '                var h = this.$createElement;\n'+
            '                this.$notify({\n'+
            '                    title : "关闭",\n'+
            '                    message: h("p", { style: "color: red"}, "我会自动关闭")\n'+
            '                });\n'+
            '            },\n'+
            '            open2: function() {\n'+
            '                this.$notify({\n'+
            '                    title : "不关闭",\n'+
            '                    message : "我不会自动关闭",\n'+
            '                    duration : 0\n'+
            '                });\n'+
            '            },\n'+
            '            open3: function() {\n'+
            '                this.$notify({\n'+
            '                    title : "成功",\n'+
            '                    message : "我是成功消息",\n'+
            '                    type : "success"\n'+
            '                });\n'+
            '            },\n'+
            '            open4: function() {\n'+
            '                this.$notify({\n'+
            '                    title : "警告",\n'+
            '                    message : "我是警告消息",\n'+
            '                    type : "warning"\n'+
            '                });\n'+
            '            },\n'+
            '            open5: function() {\n'+
            '                this.$notify.info({\n'+
            '                    title : "信息",\n'+
            '                    message : "我是信息消息",\n'+
            '                });\n'+
            '            },\n'+
            '            open6: function() {\n'+
            '                this.$notify.error({\n'+
            '                    title : "错误",\n'+
            '                    message : "我是错误消息",\n'+
            '                });\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'notification2',
            label: '消息位置',
            description: '可以设置position属性来定位，默认为"right-top"',
            template: '<div class="source"><vue-row class="margin-bottom20"><vue-col :span="8"><vue-button plain @click="open1">左上</vue-button></vue-col><vue-col :span="8"><vue-button plain @click="open2">上面</vue-button></vue-col><vue-col :span="8"><vue-button plain @click="open3">右上</vue-button></vue-col></vue-row><vue-row class="margin-bottom20"><vue-col :span="8"><vue-button plain @click="open4">左边</vue-button></vue-col><vue-col :span="8"><vue-button plain @click="open5">中间</vue-button></vue-col><vue-col :span="8"><vue-button plain @click="open6">右边</vue-button></vue-col></vue-row><vue-row><vue-col :span="8"><vue-button plain @click="open7">左下</vue-button></vue-col><vue-col :span="8"><vue-button plain @click="open8">下面</vue-button></vue-col><vue-col :span="8"><vue-button plain @click="open9">右下</vue-button></vue-col></vue-row></div>',
            parameter: {
                methods: {
                    open1: function() {
                        this.$notify.info({
                            message: '我在左上',
                            position: "left-top"
                        });
                    },
                    open2: function() {
                        this.$notify.info({
                            message: '我在上面',
                            position: "center-top"
                        });
                    },
                    open3: function() {
                        this.$notify.info({
                            message: '我在右上',
                            position: "right-top"
                        });
                    },
                    open4: function() {
                        this.$notify.info({
                            message: '我在左边',
                            position: "left-center"
                        });
                    },
                    open5: function() {
                        this.$notify.info({
                            message: '我在中间',
                            position: "center-center"
                        });
                    },
                    open6: function() {
                        this.$notify.info({
                            message: '我在右边',
                            position: "right-center"
                        });
                    },
                    open7: function() {
                        this.$notify.info({
                            message: '我在左下',
                            position: "left-bottom"
                        });
                    },
                    open8: function() {
                        this.$notify.info({
                            title: '信息',
                            message: '我在下面',
                            position: "center-bottom"
                        });
                    },
                    open9: function() {
                        this.$notify.info({
                            title: '信息',
                            message: '我在右下',
                            position: "right-bottom"
                        });
                    }
                }
            },
            code: '<vue-button plain @click="open1">左上</vue-button>\n'+
            '<vue-button plain @click="open2">上面</vue-button>\n'+
            '<vue-button plain @click="open3">右上</vue-button>\n'+
            '<vue-button plain @click="open4">左边</vue-button>\n'+
            '<vue-button plain @click="open5">中间</vue-button>\n'+
            '<vue-button plain @click="open6">右边</vue-button>\n'+
            '<vue-button plain @click="open7">左下</vue-button>\n'+
            '<vue-button plain @click="open8">下面</vue-button>\n'+
            '<vue-button plain @click="open9">右下</vue-button>\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            open1: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在左上",\n'+
            '                    position: "left-top"\n'+
            '                });\n'+
            '            },\n'+
            '            open2: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在上面",\n'+
            '                    position: "center-top"\n'+
            '                });\n'+
            '            },\n'+
            '            open3: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在右上",\n'+
            '                    position: "right-top"\n'+
            '                });\n'+
            '            },\n'+
            '            open4: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在左边",\n'+
            '                    position: "left-center"\n'+
            '                });\n'+
            '            },\n'+
            '            open5: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在中间",\n'+
            '                    position: "center-center"\n'+
            '                });\n'+
            '            },\n'+
            '            open6: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在右边",\n'+
            '                    position: "right-center"\n'+
            '                });\n'+
            '            },\n'+
            '            open7: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在左下",\n'+
            '                    position: "left-bottom"\n'+
            '                });\n'+
            '            },\n'+
            '            open8: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在下面",\n'+
            '                    position: "center-bottom"\n'+
            '                });\n'+
            '            },\n'+
            '            open9: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在右下",\n'+
            '                    position: "right-bottom"\n'+
            '                });\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return notificationDemo;
});

