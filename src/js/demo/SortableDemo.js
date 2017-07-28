!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("SortableDemo", this, function() {
    'use strict';
    var sortableDemo = {
        path: '/sortable',
        name: 'sortable',
        head: {
            label: 'Sortable 拖拽排序',
            description: '使用鼠标调整列表中或者网格中元素的排序。'
        },
        samples: [{
            id: 'sortable1',
            label: '基础用法',
            description: '属性element设置sortable的容器, 可以绑定事件"start", "end", "add", "remove", "update"',
            template: '<div class="source"><vue-row><vue-col :span="8"><vue-sortable element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions" @end="endHandle" @start="startHandle"><vue-note type="error" >list1-test1</vue-note><vue-note type="error" style="margin: 0 0 5px 0;">list1-test2</vue-note></vue-sortable></vue-col><vue-col :span="8"><vue-sortable element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions" @end="endHandle" @start="startHandle"><vue-note style="margin: 0 0 5px 0;">list2-test1</vue-note></vue-sortable></vue-col><vue-col :span="8"><vue-sortable element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions" @end="endHandle" @start="startHandle"></vue-sortable></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        sortOptions: {
                            group: 'mysortable'
                        }
                    }
                },
                methods: {
                    endHandle: function(e) {
                        console.log('end');
                    },
                    startHandle: function(e) {
                        console.log('start');
                    }
                }
            },
            code: '<vue-sortable element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions" @end="endHandle" @start="startHandle">\n'+
            '    <vue-note type="error">list1-test1</vue-note>\n'+
            '    <vue-note type="error">list1-test2</vue-note>\n'+
            '</vue-sortable>\n'+
            '<vue-sortable element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions" @end="endHandle" @start="startHandle">\n'+
            '    <vue-note>list2-test1</vue-note>\n'+
            '</vue-sortable>\n'+
            '<vue-sortable element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions" @end="endHandle" @start="startHandle">\n'+
            '</vue-sortable>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                sortOptions: {group: \'mysortable\'}\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            endHandle: function(e) {\n'+
            '                console.log("end");\n'+
            '            },\n'+
            '            startHandle: function(e) {\n'+
            '                console.log("start");\n'+
            '            }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'sortable2',
            label: '绑定数据',
            description: '绑定数据后根据数据进行拖动, 可设置"move"属性来绑定事件',
            template: '<div class="source"><vue-row><vue-col :span="8"><vue-sortable v-model="list1" element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;"  :move="moveHandle" :options="sortOptions"><vue-note type="error" v-for="(element, index) in list1" :key="index" >{{element.name}}</vue-note></vue-sortable></vue-col><vue-col :span="8"><vue-sortable v-model="list2" element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions"><vue-note v-for="(element, index) in list2" :key="index" >{{element.name}}</vue-note></vue-sortable></vue-col><vue-col :span="8"><vue-sortable v-model="list3" element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions"><vue-note type="success" v-for="(element, index) in list3" :key="index" >{{element.name}}</vue-note></vue-sortable></vue-col></vue-row><vue-row>list1: {{list1}}</vue-row><vue-row>list2: {{list2}}</vue-row><vue-row>list3: {{list3}}</vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        sortOptions: {
                            group: 'mysortable'
                        },
                        list1: [
                          { id: 11, name: 'list1-test1'},
                          { id: 12, name: 'list1-test2'}
                        ],
                        list2: [
                          { id: 21, name: 'list2-test1'}
                        ],
                        list3: [
                        ],
                        moveHandle: function(e) {
                            console.log('move')
                        }
                    }
                }
            },
            code: '<vue-sortable v-model="list1" element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions">\n'+
            '    <vue-note type="error" v-for="(element, index) in list1" :key="index">{{element.name}}</vue-note>\n'+
            '</vue-sortable>\n'+
            '<vue-sortable v-model="list2" element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions">\n'+
            '    <vue-note v-for="(element, index) in list2" :key="index">{{element.name}}</vue-note>\n'+
            '</vue-sortable>\n'+
            '<vue-sortable v-model="list3" element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions">\n'+
            '    <vue-note type="success" v-for="(element, index) in list3" :key="index">{{element.name}}</vue-note>\n'+
            '</vue-sortable>\n'+
            '<vue-row>list1: {{list1}}</vue-row>\n'+
            '<vue-row>list2: {{list2}}</vue-row>\n'+
            '<vue-row>list3: {{list3}}</vue-row>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                sortOptions: {group: \'mysortable\'},\n'+
            '                list1: [{ id: 11, name: \'list1-test1\'}, { id: 12, name: \'list1-test2\'}]\n'+
            '                list2: [{ id: 21, name: \'list2-test1\'}]\n'+
            '                list3: [],\n'+
            '                moveHandle: function(e) {\n'+
            '                    console.log("move")\n'+
            '                }\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return sortableDemo;
});

