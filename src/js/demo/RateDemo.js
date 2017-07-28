!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("RateDemo", this, function() {
    'use strict';
    var rateDemo = {
        path: '/rate',
        name: 'rate',
        head: {
            label: 'Rate 评分',
            description: '出现在按钮、图标旁的数字或状态标记。'
        },
        samples: [{
            id: 'rate1',
            label: '基础用法',
            description: '评分被分为三个等级，可以利用颜色对分数及情感倾向进行分级（默认情况下不区分颜色）。三个等级所对应的颜色用过colors属性设置',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">默认不区分颜色</span></vue-col><vue-col :span="16"><vue-rate v-model="value1" class="demonstration"></vue-rate></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">区分颜色</span></vue-col><vue-col :span="16"><vue-rate v-model="value2" class="demonstration" :colors="[\'#99A9BF\', \'#F7BA2A\', \'#FF99FF\']"></vue-rate></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        value1: 0,
                        value2: 0
                    }
                }
            },
            code: '<span class="demonstration">默认不区分颜色</span>\n'+
            '<vue-rate v-model="value1"></vue-rate>\n'+
            '<span class="demonstration">区分颜色</span>\n'+
            '<vue-rate v-model="value2" :colors="[\'#99A9BF\', \'#F7BA2A\', \'#FF99FF\']"></vue-rate>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return: {\n'+
            '                value1: 0,\n'+
            '                value2: 0\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return rateDemo;
});

