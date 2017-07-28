!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("AlertDemo", this, function() {
    'use strict';
    var alertDemo = {
        path: '/alert',
        name: 'alert',
        head: {
            label: 'Alert 警告',
            description: '用于页面中展示重要的提示信息。'
        },
        samples: [{
            id: 'alert1',
            label: '基础用法',
            description: '组件提供四种主题，由type属性指定，默认值为info。closable属性决定是否可关闭，可以设置close-text属性来代替右侧的关闭图标，设置close事件来设置关闭时的回调。设置show-icon属性来显示icon。设置dark属性来显示深色样式。',
            template: '<div class="source"><vue-alert title="成功提示的文案" type="success" description="文字说明..." show-icon :closable="false"></vue-alert><vue-alert title="消息提示的文案" type="info" description="文字说明..." show-icon></vue-alert><vue-alert title="警告提示的文案" type="warning" description="文字说明..." show-icon close-text="知道了"></vue-alert><vue-alert title="错误提示的文案" type="error" description="文字说明..." show-icon close-text="走你" @close="closeHandle"></vue-alert><vue-alert title="成功提示的文案" type="success" description="文字说明..." show-icon dark :closable="false"></vue-alert><vue-alert title="消息提示的文案" type="info" description="文字说明..." show-icon dark></vue-alert><vue-alert title="警告提示的文案" type="warning" description="文字说明..." show-icon dark close-text="知道了"></vue-alert><vue-alert title="错误提示的文案" type="error" description="文字说明..." show-icon dark close-text="走你" @close="closeHandle"></vue-alert></div>',
            parameter: {
                methods: {
                    closeHandle: function() {
                        this.$alert("我走了...");
                    }
                }
            },
            code: '<vue-alert title="成功提示的文案" type="success" description="文字说明..." show-icon :closable="false"></vue-alert>\n<vue-alert title="消息提示的文案" type="info" description="文字说明..." show-icon></vue-alert>\n<vue-alert title="警告提示的文案" type="warning" description="文字说明..." show-icon close-text="知道了"></vue-alert>\n<vue-alert title="错误提示的文案" type="error" description="文字说明..." show-icon close-text="走你" @close="closeHandle"></vue-alert>\n<vue-alert title="成功提示的文案" type="success" description="文字说明..." show-icon dark :closable="false"></vue-alert>\n<vue-alert title="消息提示的文案" type="info" description="文字说明..." show-icon dark></vue-alert>\n<vue-alert title="警告提示的文案" type="warning" description="文字说明..." show-icon dark close-text="知道了"></vue-alert>\n<vue-alert title="错误提示的文案" type="error" description="文字说明..." show-icon dark close-text="走你" @close="closeHandle"></vue-alert>\n\n<script>\n    new Vue({\n        methods: {\n            closeHandle: function() {\n                this.$alert("我走了...");\n            }\n        }\n    }).$mount();\n</script>'
        }]
    };
    return alertDemo;
});
