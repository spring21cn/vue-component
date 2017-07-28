!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(['Vue'], definition);
    } else {
        context[name] = definition(context['Vue']);
    }
})("TreeDemo", this, function(Vue) {
    'use strict';
    var treeDemo = {
        path: '/tree',
        name: 'tree',
        head: {
            label: 'Tree 树形控件',
            description: '用清晰的层级结构展示信息，可展开或折叠。'
        },
        samples: [{
            id: 'tree1',
            label: '基础用法',
            description: '基础的树形结构展示．',
            template: '<div class="source"><vue-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></vue-tree></div>',
            parameter: {
                data: function() {
                  return {
                    data: [{
                      label: "一级 1",
                      children: [{
                        label: "二级 1-1",
                        children: [{
                          label: "三级 1-1-1"
                        }]
                      }]
                    }, {
                     label: "一级 2",
                      children: [{
                        label: "二级 2-1",
                        children: [{
                          label: "三级 2-1-1"
                        }]
                      }, {
                        label: "二级 2-2",
                        children: [{
                          label: "三级 2-2-1"
                        }]
                      }]
                    }, {
                      label: "一级 3",
                      children: [{
                        label: "二级 3-1",
                        children: [{
                          label: "三级 3-1-1"
                        }]
                      }, {
                        label: "二级 3-2",
                        children: [{
                          label: "三级 3-2-1"
                        }]
                      }]
                    }],
                    defaultProps: {
                      children: "children",
                      label: "label"
                    }
                  }
                },
                methods: {
                  handleNodeClick: function(data) {
                    console.log(data);
                  }
                }
            },
            code: '<vue-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></vue-tree>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                data: [{\n'+
            '                    label: "一级 1",\n'+
            '                    children: [{\n'+
            '                        label: "二级 1-1",\n'+
            '                        children: [{\n'+
            '                            label: "三级 1-1-1"\n'+
            '                        }]\n'+
            '                    }]\n'+
            '                }, {\n'+
            '                    label: "一级 2",\n'+
            '                    children: [{\n'+
            '                        label: "二级 2-1",\n'+
            '                        children: [{\n'+
            '                            label: "三级 2-1-1"\n'+
            '                        }]\n'+
            '                    }, {\n'+
            '                        label: "二级 2-2",\n'+
            '                        children: [{\n'+
            '                            label: "三级 2-2-1"\n'+
            '                        }]\n'+
            '                    }]\n'+
            '                }, {\n'+
            '                    label: "一级 3",\n'+
            '                    children: [{\n'+
            '                        label: "二级 3-1",\n'+
            '                        children: [{\n'+
            '                            label: "三级 3-1-1"\n'+
            '                        }]\n'+
            '                    }, {\n'+
            '                        label: "二级 3-2",\n'+
            '                        children: [{\n'+
            '                            label: "三级 3-2-1"\n'+
            '                        }]\n'+
            '                    }]\n'+
            '                }],\n'+
            '                defaultProps: {\n'+
            '                    children: "children",\n'+
            '                    label: "label"\n'+
            '                }\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            handleNodeClick: function(data) {\n'+
            '                console.log(data);\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return treeDemo;
});
