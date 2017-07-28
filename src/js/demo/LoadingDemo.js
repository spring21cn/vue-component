!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("LoadingDemo", this, function() {
    'use strict';
    var loadingDemo = {
        path: '/loading',
        name: 'loading',
        head: {
            label: 'Loading 加载',
            description: '加载数据时显示动效。'
        },
        samples: [{
            id: 'loading1',
            label: '基础用法',
            description: '使用自定义指令v-loading，在绑定了v-loading指令的元素上添加vue-loading-text属性，其值会被渲染为加载文案，并显示在加载图标的下方．当需要全屏遮罩时，可使用fullscreen修饰符。此时若需要锁定屏幕的滚动，可以使用lock修饰符。',
            template: '<div class="source"><vue-table v-loading="loading" vue-loading-text="拼命加载中" :data="tableData" border stripe style="width: 100%"><vue-table-column prop="date" label="日期" width="180"></vue-table-column><vue-table-column prop="name" label="姓名" width="180"></vue-table-column><vue-table-column prop="address" label="地址"></vue-table-column></vue-table><div style="margin-top:30px"></div><vue-button type="primary" @click="openFullScreen" v-loading.fullscreen.lock="fullscreenLoading">显示整页加载，3 秒后消失</vue-button></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: [{
                            date: "2015-01-02",
                            name: "张三",
                            address: "厦门市思明区"
                          }, {
                            date: "2016-04-05",
                            name: "李四",
                            address: "厦门市翔安区"
                          }, {
                            date: "2017-06-07",
                            name: "王二",
                            address: "厦门市湖里区"
                          }, {
                            date: "2018-10-22",
                            name: "龙五",
                            address: "厦门市海沧区"
                        }],
                        loading: true,
                        fullscreenLoading: false
                    };
                },
                methods: {
                    openFullScreen: function() {
                      var self = this;
                      self.fullscreenLoading = true;
                      setTimeout(function() {
                        self.fullscreenLoading = false;
                      }, 3000);
                    }
                  }
            },
            code: '<vue-table v-loading="loading" vue-loading-text="拼命加载中" :data="tableData" border stripe style="width: 100%">\n'+
            '    <vue-table-column prop="date" label="日期" width="180"></vue-table-column>\n'+
            '    <vue-table-column prop="name" label="姓名" width="180"></vue-table-column>\n'+
            '    <vue-table-column prop="address" label="地址"></vue-table-column>\n'+
            '</vue-table>\n'+
            '<vue-button type="primary" @click="openFullScreen" v-loading.fullscreen.lock="fullscreenLoading">\n    显示整页加载，3 秒后消失\n</vue-button>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: [{\n'+
            '                    date: "2015-01-02",\n'+
            '                    name: "张三",\n'+
            '                    address: "厦门市思明区"\n'+
            '                }, {\n'+
            '                    date: "2016-04-05",\n'+
            '                    name: "李四",\n'+
            '                    address: "厦门市翔安区"\n'+
            '                }, {\n'+
            '                    date: "2017-06-07",\n'+
            '                    name: "王二",\n'+
            '                    address: "厦门市湖里区"\n'+
            '                }, {\n'+
            '                    date: "2018-10-22",\n'+
            '                    name: "龙五",\n'+
            '                    address: "厦门市海沧区"\n'+
            '                }],\n'+
            '                loading: true,\n'+
            '                fullscreenLoading: false\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            openFullScreen: function() {\n'+
            '                var self = this;\n'+
            '                self.fullscreenLoading = true;\n'+
            '                setTimeout(function() {\n'+
            '                    self.fullscreenLoading = false;\n'+
            '                }, 3000);\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return loadingDemo;
});


