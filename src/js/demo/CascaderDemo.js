!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("CascaderDemo", this, function() {
    'use strict';
    var cascaderDemo = {
        path: '/cascader',
        name: 'cascader',
        head: {
            label: 'Cascader 级联选择器',
            description: '当一个数据集合有清晰的层级结构时，可通过级联选择器逐级查看并选择。'
        },
        samples: [{
            id: 'cascader1',
            label: '基础用法',
            description: '只需为 Cascader 的options属性指定选项数组即可渲染出一个级联选择器。通过expand-trigger可以定义展开子级菜单的触发方式。 change事件的参数为 Cascader 的绑定值：一个由各级菜单的值所组成的数组。',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">默认 click 触发子菜单</span></vue-col><vue-col :span="16"><vue-cascader :options="options" v-model="selectedOptions1" @change="handleChange"></vue-cascader></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">hover 触发子菜单</span></vue-col><vue-col :span="16"><vue-cascader expand-trigger="hover" :options="options" v-model="selectedOptions2" @change="handleChange"></vue-cascader></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        options: [{
                            value: "fujian",
                            label: "福建省",
                            children: [{
                                value: "xiamen",
                                label: "厦门市",
                                children: [{
                                    value: "shimin",
                                    label: "思明区"
                                }, {
                                    value: "huli",
                                    label: "湖里区"
                                }, {
                                    value: "tongan",
                                    label: "同安区"
                                }, {
                                    value: "xiangan",
                                    label: "翔安区"
                                }, {
                                    value: "haichang",
                                    label: "海沧区"
                                }, {
                                    value: "jimei",
                                    label: "集美区"
                                }]
                            }]
                        }, {
                            value: "hainan",
                            label: "海南省",
                            children: [{
                                value: "haikou",
                                label: "海口市",
                                children: [{
                                    value: "xiuying",
                                    label: "秀英区"
                                }, {
                                    value: "qiongsan",
                                    label: "琼山区"
                                }, {
                                    value: "meilang",
                                    label: "美兰区"
                                }, {
                                    value: "longhua",
                                    label: "龙华区"
                                }]
                            }]
                        }],
                        selectedOptions1: [],
                        selectedOptions2: []
                    };
                },
                methods: {
                    handleChange: function(value) {
                        console.log(value);
                    }
                }
            },
            code: '<span class="demonstration">默认 click 触发子菜单</span>\n<vue-cascader :options="options" v-model="selectedOptions1" @change="handleChange"></vue-cascader>\n<span class="demonstration">hover 触发子菜单</span>\n<vue-cascader expand-trigger="hover" :options="options" v-model="selectedOptions2" @change="handleChange"></vue-cascader>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                options: [{\n                    value: "fujian",\n                    label: "福建省",\n                    children: [{\n                        value: "xiamen",\n                        label: "厦门市",\n                        children: [{\n                            value: "shimin",\n                            label: "思明区",\n                        }, {\n                            value: "huli",\n                            label: "湖里区",\n                        }, {\n                            value: "tongan",\n                            label: "同安区",\n                        }, {\n                            value: "xiangan",\n                            label: "翔安区",\n                        }, {\n                            value: "haichang",\n                            label: "海沧区",\n                        }, {\n                            value: "jimei",\n                            label: "集美区",\n                        }]\n                    }]\n                }, {\n                    value: "hainan",\n                    label: "海南省",\n                    children: [{\n                        value: "haikou",\n                        label: "海口市",\n                        children: [{\n                            value: "xiuying",\n                            label: "秀英区",\n                        }, {\n                            value: "qiongsan",\n                            label: "琼山区",\n                        }, {\n                            value: "meilang",\n                            label: "美兰区",\n                        }, {\n                            value: "longhua",\n                            label: "龙华区",\n                        }]\n                    }]\n                }],\n                selectedOptions1: [],\n                selectedOptions2: []\n            }\n        },\n        methods: {\n            handleChange: function(value) {\n                console.log(value);\n            }\n        }\n    }).$mount();\n</script>'
        }]
    };
    return cascaderDemo;
});
