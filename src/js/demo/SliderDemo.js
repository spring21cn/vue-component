!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("SliderDemo", this, function() {
    'use strict';
    var sliderDemo = {
        path: '/slider',
        name: 'slider',
        head: {
            label: 'Slider 滑块',
            description: '通过拖动滑块在一个固定区间内进行选择。'
        },
        samples: [{
            id: 'slider1',
            label: '基础用法',
            description: '通过设置绑定值自定义滑块的初始值。',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">默认</span></vue-col><vue-col :span="16"><vue-slider v-model="value1"></vue-slider></vue-col></vue-row><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">自定义初始值</span></vue-col><vue-col :span="16"><vue-slider v-model="value2"></vue-slider></vue-col></vue-row><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">隐藏 Tooltip</span></vue-col><vue-col :span="16"><vue-slider v-model="value3" :show-tooltip="false"></vue-slider></vue-col></vue-row><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">格式化 Tooltip</span></vue-col><vue-col :span="16"><vue-slider v-model="value4" :format-tooltip="formatTooltip"></vue-slider></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">禁用</span></vue-col><vue-col :span="16"><vue-slider v-model="value5" disabled></vue-slider></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        value1: 0,
                        value2: 50,
                        value3: 36,
                        value4: 48,
                        value5: 42
                    }
                },
                methods: {
                    formatTooltip: function(val) {
                      return val / 100;
                    }
                  }
            },
            code: '<span class="demonstration">默认</span>\n'+
            '<vue-slider v-model="value1"></vue-slider>\n'+
            '<span class="demonstration">自定义初始值</span>\n'+
            '<vue-slider v-model="value2"></vue-slider>\n'+
            '<span class="demonstration">隐藏 Tooltip</span>\n'+
            '<vue-slider v-model="value3" :show-tooltip="false"></vue-slider>\n'+
            '<span class="demonstration">格式化 Tooltip</span>\n'+
            '<vue-slider v-model="value4" :format-tooltip="formatTooltip"></vue-slider>\n'+
            '<span class="demonstration">禁用</span>\n'+
            '<vue-slider v-model="value5" disabled></vue-slider>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return: {\n'+
            '                value1: 0,\n'+
            '                value2: 50,\n'+
            '                value3: 36,\n'+
            '                value4: 48,\n'+
            '                value5: 42\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            formatTooltip: function(val) {\n'+
            '                return val / 100;\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return sliderDemo;
});

