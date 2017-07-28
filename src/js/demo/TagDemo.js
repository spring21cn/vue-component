!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("TagDemo", this, function() {
    'use strict';
    var tagDemo = {
        path: '/tag',
        name: 'tag',
        head: {
            label: 'Tag 标签',
            description: '用于标记和选择。'
        },
        samples: [{
            id: 'tag1',
            label: '基础用法',
            description: '用type属性来选择tag的类型，也可以通过color属性来自定义背景色；设置closable属性可以定义一个标签是否可移除，默认的标签移除时会附带渐变动画，可以设置transition属性为true来打开渐变动画．',
            template: '<div class="source"><vue-tag class="tags" v-for="tag in tags" :key="tag" :closable="tag.closable" :type="tag.type" :transition="tag.transition" @close="closeHandle(tag)">{{tag.name}}</vue-tag></div>',
            parameter: {
                data: function() {
                  return {
                    tags: [
                      { name: "标签一", type: "" , closable: false, transition: false},
                      { name: "标签二", type: "gray", closable: true, transition: false },
                      { name: "标签三", type: "primary", closable: false, transition: false },
                      { name: "标签四", type: "success", closable: true, transition: true },
                      { name: "标签五", type: "warning", closable: true, transition: false },
                      { name: "标签六", type: "danger", closable: true, transition: true }
                    ]
                  };
                },
                methods: {
                  closeHandle: function(tag) {
                    this.tags.splice(this.tags.indexOf(tag), 1);
                  }
                }
            },
            code: '<vue-tag v-for="tag in tags"\n'+
                  '         :key="tag"\n'+
                  '         :closable="tag.closable"\n'+
                  '         :type="tag.type"\n'+
                  '         :transition="tag.transition"\n'+
                  '         @close="closeHandle(tag)">\n'+
                  '    {{tag.name}}\n'+
                  '</vue-tag>\n\n'+
                  '<script>\n'+
                  '    new Vue({\n'+
                  '        data: function(){\n'+
                  '            return {\n'+
                  '                tags: [\n'+
                  '                    { name: "标签一", type: "" , closable: false, transition: false},\n'+
                  '                    { name: "标签二", type: "gray", closable: true, transition: false },\n'+
                  '                    { name: "标签三", type: "primary", closable: false, transition: false },\n'+
                  '                    { name: "标签四", type: "success", closable: true, transition: true },\n'+
                  '                    { name: "标签五", type: "warning", closable: true, transition: false },\n'+
                  '                    { name: "标签六", type: "danger", closable: true, transition: true }\n'+
                  '                ]\n'+
                  '            }\n'+
                  '        },\n'+
                  '        methods: {\n'+
                  '            closeHandle: function(tag) {\n'+
                  '                this.tags.splice(this.tags.indexOf(tag), 1);\n'+
                  '            }\n'+
                  '        }\n'+
                  '    }).$mount();\n'+
                  '</script>'
        }]
    };
    return tagDemo;
});
