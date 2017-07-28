!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("ColorDemo", this, function() {
    'use strict';
    var colorDemo = {
        path: '/color',
        name: 'color',
        head: {
            label: 'ColorPicker 颜色选择器',
            description: '用于颜色选择，支持多种格式。'
        },
        samples: [{
            id: 'color1',
            label: '基础用法',
            description: '使用 v-model 与 Vue 实例中的一个变量进行双向绑定，绑定的变量需要是字符串类型。',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">有默认值</span></vue-col><vue-col :span="16"><vue-color-picker v-model="color1"></vue-color-picker></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">无默认值</span></vue-col><vue-col :span="16"><vue-color-picker v-model="color2"></vue-color-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                      color1: '#20a0ff',
                      color2: null
                  }
                }
            },
            code: '<span class="demonstration">有默认值</span>\n'+
            '<vue-date-picker v-model="color1"></vue-date-picker>\n'+
            '<span class="demonstration">无默认值</span>\n'+
            '<vue-date-picker v-model="color2"></vue-date-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                color1: "20a0ff",\n'+
            '                color2: null\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'color2',
            label: '选择透明度',
            description: 'ColorPicker 支持普通颜色，也支持带 Alpha 通道的颜色，通过show-alpha属性即可控制是否支持透明度的选择。',
            template: '<div class="source"><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">持透明度的选择</span></vue-col><vue-col :span="16"><vue-color-picker v-model="color1" show-alpha></vue-color-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                      color1: 'rgba(19, 206, 102, 0.8)'
                  }
                }
            },
            code: '<span class="demonstration">持透明度的选择</span>\n'+
            '<vue-date-picker v-model="color1" show-alpha></vue-date-picker>\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                color1: "rgba(19, 206, 102, 0.8)"\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'color3',
            label: 'Attributes',
            template: '<vue-table class="api" :data="tableData" border stripe style="width: 100%"><vue-table-column prop="column1" label="参数"></vue-table-column><vue-table-column prop="column2" label="说明"></vue-table-column><vue-table-column prop="column3" label="类型"></vue-table-column><vue-table-column prop="column4" label="可选值"></vue-table-column><vue-table-column prop="column5" label="默认值"></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "show-alpha",
                        column2: "是否支持透明度选择",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    }, {
                        column1: "color-format",
                        column2: "写入 v-model 的颜色的格式",
                        column3: "string",
                        column4: "hsl / hsv / hex / rgb",
                        column5: "hex（show-alpha 为 false）/ rgb（show-alpha 为 true）"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'color4',
            label: ' Events',
            template: '<vue-table class="api" :data="tableData" border stripe style="width: 100%"><vue-table-column prop="column1" label="事件名称"></vue-table-column><vue-table-column prop="column2" label="说明"></vue-table-column><vue-table-column prop="column3" label="回调参数"></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "change",
                        column2: "当绑定值变化时触发",
                        column3: "当前值"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return colorDemo;
});

