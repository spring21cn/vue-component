!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("SelectDemo", this, function() {
    'use strict';
    var selectDemo = {
        path: '/select',
        name: 'select',
        head: {
            label: 'Select 选择器',
            description: '当选项过多时，使用下拉菜单展示并选择内容。'
        },
        samples: [{
            id: 'select1',
            label: '基础用法',
            description: 'v-model的值为当前被选中的vue-option的value属性值',
            template: '<div class="source"><vue-select v-model="value" placeholder="请选择" ><vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value"></vue-option></vue-select></div>',
            parameter: {
                data: function() {
                    return {
                        options: [{
                            value: '选项1',
                            label: 'YAMAHA'
                        }, {
                            value: '选项2',
                            label: 'HONDA'
                        }, {
                            value: '选项3',
                            label: 'TOYOTA'
                        }],
                        value: ''
                    }
                }
            },
            code: '<vue-select v-model="value" placeholder="请选择">\n    <vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value">\n    </vue-option>\n</vue-select>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                options: [{\n                    value: \'选项1\',\n                    label: \'YAMAHA\'\n                },{\n                    value: \'选项2\',\n                    label: \'HONDA\'\n                },{\n                    value: \'选项3\',\n                    label: \'TOYOTA\'\n                }],\n                value: \'\'\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'select2',
            label: '有禁用选项',
            description: '在vue-option中，设定disabled值为 true，即可禁用该选项',
            template: '<div class="source"><vue-select v-model="value" placeholder="请选择"><vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value" :disabled="item.disabled"></vue-option></vue-select></div>',
            parameter: {
                data: function() {
                    return {
                        options: [{
                            value: '选项1',
                            label: 'YAMAHA'
                        }, {
                            value: '选项2',
                            label: 'HONDA',
                            disabled: true
                        }, {
                            value: '选项3',
                            label: 'TOYOTA'
                        }],
                        value: ''
                    }
                }
            },
            code: '<vue-select v-model="value" placeholder="请选择">\n    <vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value" :disabled="item.disabled">\n    </vue-option>\n</vue-select>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                options: [{\n                    value: \'选项1\',\n                    label: \'YAMAHA\'\n                },{\n                    value: \'选项2\',\n                    label: \'HONDA\'\n                    disabled: true\n                },{\n                    value: \'选项3\',\n                    label: \'TOYOTA\'\n                }],\n                value: \'\'\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'select3',
            label: '禁用状态',
            description: '设置disabled属性即可，它接受一个Boolean，true为禁用。',
            template: '<div class="source"><vue-select v-model="value" disabled placeholder="请选择"><vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value"></vue-option></vue-select></div>',
            parameter: {
                data: function() {
                    return {
                        options: [{
                            value: '选项1',
                            label: 'YAMAHA'
                        }, {
                            value: '选项2',
                            label: 'HONDA'
                        }, {
                            value: '选项3',
                            label: 'TOYOTA'
                        }],
                        value: ''
                    }
                }
            },
            code: '<vue-select v-model="value" disabled placeholder="请选择">\n    <vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value">\n    </vue-option>\n</vue-select>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                options: [{\n                    value: \'选项1\',\n                    label: \'YAMAHA\'\n                },{\n                    value: \'选项2\',\n                    label: \'HONDA\'\n                },{\n                    value: \'选项3\',\n                    label: \'TOYOTA\'\n                }],\n                value: \'\'\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'select4',
            label: '可清空单选',
            description: '设置clearable属性，则可将选择器清空。需要注意的是，clearable属性仅适用于单选',
            template: '<div class="source"><vue-select v-model="value" clearable placeholder="请选择"><vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value"></vue-option></vue-select></div>',
            parameter: {
                data: function() {
                    return {
                        options: [{
                            value: '选项1',
                            label: 'YAMAHA'
                        }, {
                            value: '选项2',
                            label: 'HONDA'
                        }, {
                            value: '选项3',
                            label: 'TOYOTA'
                        }],
                        value: ''
                    }
                }
            },
            code: '<vue-select v-model="value" clearable placeholder="请选择">\n    <vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value">\n    </vue-option>\n</vue-select>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                options: [{\n                    value: \'选项1\',\n                    label: \'YAMAHA\'\n                },{\n                    value: \'选项2\',\n                    label: \'HONDA\'\n                },{\n                    value: \'选项3\',\n                    label: \'TOYOTA\'\n                }],\n                value: \'\'\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'select5',
            label: '基础多选',
            description: '设置multiple属性即可启用多选，此时v-model的值为当前选中值所组成的数组',
            template: '<div class="source"><vue-select v-model="value" multiple placeholder="请选择"><vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value"></vue-option></vue-select></div>',
            parameter: {
                data: function() {
                    return {
                        options: [{
                            value: '选项1',
                            label: 'YAMAHA'
                        }, {
                            value: '选项2',
                            label: 'HONDA'
                        }, {
                            value: '选项3',
                            label: 'TOYOTA'
                        }],
                        value: ''
                    }
                }
            },
            code: '<vue-select v-model="value" multiple placeholder="请选择">\n    <vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value">\n    </vue-option>\n</vue-select>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                options: [{\n                    value: \'选项1\',\n                    label: \'YAMAHA\'\n                },{\n                    value: \'选项2\',\n                    label: \'HONDA\'\n                },{\n                    value: \'选项3\',\n                    label: \'TOYOTA\'\n                }],\n                value: \'\'\n            }\n        }\n    }).$mount();\n</script>'
        }]
    };
    return selectDemo;
});