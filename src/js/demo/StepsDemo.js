!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("StepsDemo", this, function() {
    'use strict';
    var stepsDemo = {
        path: '/steps',
        name: 'steps',
        head: {
            label: 'Steps 步骤条',
            description: '引导用户按照流程完成任务的分步导航条，可根据实际应用场景设定步骤，步骤不得少于 2 步。'
        },
        samples: [{
            id: 'steps1',
            label: '基础用法',
            description: '设置active属性，接受一个Number，表明步骤的 index，从 0 开始。需要定宽的步骤条时，设置space属性即可，单位为px，如果不设置，则为自适应。设置finish-status属性可以改变已经完成的步骤的状态。',
            template: '<div class="source"><vue-steps :space="200" :active="active" finish-status="success"><vue-step title="步骤 1"></vue-step><vue-step title="步骤 2"></vue-step><vue-step title="步骤 3"></vue-step></vue-steps><vue-button style="margin-top: 12px;" @click="next">下一步</vue-button></div>',
            parameter: {
                data: function() {
                    return {
                        active: 0
                    }
                },
                methods: {
                  next: function(tab, event) {
                    if (this.active++ > 2) this.active = 0;
                  }
                }
            },
            code: '<vue-steps :space="200" :active="active" finish-status="success">\n'+
            '    <vue-step title="步骤 1"></vue-step>\n'+
            '    <vue-step title="步骤 2"></vue-step>\n'+
            '    <vue-step title="步骤 3"></vue-step>\n'+
            '</vue-steps>\n'+
            '<vue-button style="margin-top: 12px;" @click="next">下一步</vue-button>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return {\n'+
            '                active: 0\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            next: function() {\n'+
            '                if (this.active++ > 2) this.active = 0;\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'steps2',
            label: '有描述的步骤条',
            description: '每个步骤有其对应的步骤状态描述。用slot的方式来设置',
            template: '<div class="source"><vue-steps :space="250" :active="1"><vue-step title="步骤 1"><span slot="description">这是一段很长很长很长的描述性文字</span></vue-step><vue-step title="步骤 2"><vue-button slot="description">这是按钮</vue-button></vue-step><vue-step title="步骤 3" description="这是一段很长很长很长的描述性文字"><vue-button slot="description" type="primary" icon="vue-icon-search">搜索</vue-button></vue-step></vue-steps></div>',
            code:'<vue-steps :space="250" :active="1">\n'+
            '    <vue-step title="步骤 1">\n'+
            '        <span slot="description">这是一段很长很长很长的描述性文字</span>\n'+
            '    </vue-step>\n'+
            '    <vue-step title="步骤 2">\n'+
            '        <vue-button slot="description">这是按钮</vue-button>\n'+
            '    </vue-step>\n'+
            '    <vue-step title="步骤 3" description="这是一段很长很长很长的描述性文字">\n'+
            '        <vue-button slot="description" type="primary" icon="vue-icon-search">搜索</vue-button>\n'+
            '    </vue-step>\n'+
            '</vue-steps>'
        }]
    };
    return stepsDemo;
});

