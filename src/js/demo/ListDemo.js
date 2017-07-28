!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("ListDemo", this, function() {
    'use strict';
    var listDemo = {
        path: '/list',
        name: 'list',
        head: {
            label: 'List 列表',
            description: '用于相似元素信息的展示。'
        },
        samples: [{
            id: 'list1',
            label: '基础用法',
            description: '通过height属性设置list高度, 通过<vue-divider>控件来追加item间的分隔线',
            template: '<div class="source"><vue-list height="300"><vue-list-item v-for="index of 100" :index="index" :key="index" @select="selectHandle(index)"><div>第{{index}}行 文字说明...</div><vue-divider v-if="index!==100"></vue-divider></vue-list-item></vue-list></div>',
            parameter: {
                methods: {
                    selectHandle: function(index) {
                        console.log(index);
                    }
                }
            },
            code: '<vue-list height="300">\n    <vue-list-item v-for="index of 100" :index="index" :key="index" @select="selectHandle(index)">\n        <div>第{{index}}行 文字说明...</div>\n        <vue-divider v-if="index!==100"></vue-divider>\n    </vue-list-item>\n</vue-list>\n\n<script>\n    new Vue({\n        methods: {\n            selectHandle: function(index) {\n                console.log(index);\n            }\n        }\n    }).$mount();\n</script>'
        }]
    };
    return listDemo;
});
