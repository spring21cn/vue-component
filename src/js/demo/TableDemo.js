!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(['Vue', 'VueUtil'], definition);
    } else {
        context[name] = definition(context['Vue'], context['VueUtil']);
    }
})("TableDemo", this, function(Vue, VueUtil) {
    'use strict';
    var tableDemo = {
        path: '/table',
        name: 'table',
        head: {
            label: 'Table 表格',
            description: '用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。'
        },
        samples: [{
            id: 'table1',
            label: '基础用法',
            description: '当vue-table元素中注入data对象数组后，在vue-table-column中用prop属性来对应对象中的键名即可填入数据，用label属性来定义表格的列名，可以使用width属性来定义列宽；设置stripe属性为true可以创建带斑马纹的表格，它默认为false；设置border属性为true可以具有竖直方向的边框的。它默认为false．',
            template: '<div class="source"><vue-table :data="tableData" border stripe style="width: 100%"><vue-table-column prop="date" label="日期" width="180"></vue-table-column><vue-table-column prop="name" label="姓名" width="180"></vue-table-column><vue-table-column prop="address" label="地址"></vue-table-column></vue-table></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: [{
                            date: "2015-01-02",
                            name: "张三",
                            province: '厦门',
                            address: "厦门市思明区",
                            zip: 361000
                          }, {
                            date: "2016-04-05",
                            name: "李四",
                            province: '厦门',
                            address: "厦门市翔安区",
                            zip: 361100
                          }, {
                            date: "2017-06-07",
                            name: "王二",
                            province: '厦门',
                            address: "厦门市湖里区",
                            zip: 361000
                          }, {
                            date: "2018-10-22",
                            name: "龙五",
                            province: '厦门',
                            address: "厦门市海沧区",
                            zip: 361000
                          }]
                    };
                }
            },
            code: '<vue-table :data="tableData" border stripe style="width: 100%">\n'+
            '    <vue-table-column prop="date" label="日期" width="180"></vue-table-column>\n'+
            '    <vue-table-column prop="name" label="姓名" width="180"></vue-table-column>\n'+
            '    <vue-table-column prop="address" label="地址"></vue-table-column>\n'+
            '</vue-table>\n\n'+
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
            '                }]\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'table2',
            label: '固定列',
            description: '固定列需要使用fixed属性，它接受 Boolean 值或者left, right，表示左边固定还是右边固定。',
            template: '<div class="source"><vue-table :data="tableData" border style="width: 100%"><vue-table-column fixed prop="date" label="日期" width="150"></vue-table-column><vue-table-column prop="name" label="姓名" width="120"></vue-table-column><vue-table-column prop="province" label="省份" width="120"></vue-table-column><vue-table-column prop="city" label="市区" width="120"></vue-table-column><vue-table-column prop="address" label="地址" width="300"></vue-table-column><vue-table-column prop="zip" label="邮编" width="120"></vue-table-column><vue-table-column fixed="right" label="操作" width="120"><template scope="scope"><vue-button @click="handleClick" type="text" size="small">查看</vue-button><vue-button type="text" size="small">编辑</vue-button></template></vue-table-column></vue-table></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: [{
                            date: "2015-01-02",
                            name: "张三",
                            province: '福建',
                            city: '厦门',
                            address: "厦门市思明区",
                            zip: 361000
                          }, {
                            date: "2016-04-05",
                            name: "李四",
                            province: '福建',
                            city: '厦门',
                            address: "厦门市翔安区",
                            zip: 361100
                          }, {
                            date: "2017-06-07",
                            name: "王二",
                            province: '福建',
                            city: '厦门',
                            address: "厦门市湖里区",
                            zip: 361000
                          }, {
                            date: "2018-10-22",
                            name: "龙五",
                            province: '福建',
                            city: '厦门',
                            address: "厦门市海沧区",
                            zip: 361000
                          }]
                    }
                },
                methods: {
                  handleClick: function() {
                    console.log(1);
                  }
                }
            },
            code: '<vue-table :data="tableData" border style="width: 100%">\n'+
            '    <vue-table-column fixed prop="date" label="日期" width="150">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="name" label="姓名" width="120">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="province" label="省份" width="120">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="city" label="市区" width="120">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="address" label="地址" width="300">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="zip" label="邮编" width="120">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column fixed="right" label="操作" width="120">\n'+
            '        <template scope="scope">\n'+
            '            <vue-button @click="handleClick" type="text" size="small">查看</vue-button>\n'+
            '            <vue-button type="text" size="small">编辑</vue-button>\n'+
            '        </template>\n'+
            '    </vue-table-column>\n'+
            '</vue-table>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: [{\n'+
            '                    date: "2015-01-02",\n'+
            '                    name: "张三",\n'+
            '                    province: "福建",\n'+
            '                    city: "厦门",\n'+
            '                    address: "厦门市思明区"\n'+
            '                    zip: 361000\n'+
            '                }, {\n'+
            '                    date: "2016-04-05",\n'+
            '                    name: "李四",\n'+
            '                    province: "福建",\n'+
            '                    city: "厦门",\n'+
            '                    address: "厦门市翔安区"\n'+
            '                    zip: 361100\n'+
            '                }, {\n'+
            '                    date: "2017-06-07",\n'+
            '                    name: "王二",\n'+
            '                    province: "福建",\n'+
            '                    city: "厦门",\n'+
            '                    address: "厦门市湖里区"\n'+
            '                    zip: 361000\n'+
            '                }, {\n'+
            '                    date: "2018-10-22",\n'+
            '                    name: "龙五",\n'+
            '                    province: "福建",\n'+
            '                    city: "厦门",\n'+
            '                    address: "厦门市海沧区"\n'+
            '                    zip: 361000\n'+
            '                }]\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'table3',
            label: '自定义模板',
            description: '通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据, 可组合其他组件自定义显示的内容',
            template: '<div class="source"><vue-table :data="tableData" border stripe style="width: 100%"><vue-table-column label="商品信息"><vue-table-column prop="id" label="商品ID" width="200"></vue-table-column><vue-table-column prop="name" label="商品名称" width="200"></vue-table-column></vue-table-column><vue-table-column label="店铺信息"><template scope="props"><vue-row><vue-col :span="12"><span>{{ props.row.shopId }}</span></vue-col><vue-col :span="12"><span>{{ props.row.shopName }}</span></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="24"><span>{{ props.row.shopAddr }}</span></vue-col></vue-row></template></vue-table-column></vue-table></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: [{
                            id: "12987122",
                            name: "商品2",
                            shopName: "店铺2",
                            shopId: "10332",
                            shopAddr: "福建厦门"
                        }, {
                            id: "12987123",
                            name: "商品3",
                            shopName: "店铺3",
                            shopId: "10333",
                            shopAddr: "广东广州"
                        }, {
                            id: "12987125",
                            name: "商品5",
                            shopName: "店铺1",
                            shopId: "10331",
                            shopAddr: "上海"
                        }]
                    }
                }
            },
            code: '<vue-table :data="tableData" border stripe style="width: 100%">\n'+
            '    <vue-table-column label="商品信息">\n'+
            '        <vue-table-column prop="id" label="商品ID" width="200">\n'+
            '        </vue-table-column>\n'+
            '        <vue-table-column prop="name" label="商品名称" width="200">\n'+
            '        </vue-table-column>\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column label="店铺信息">\n'+
            '    <template scope="props">\n'+
            '        <vue-row>\n'+
            '            <vue-col :span="12">\n'+
            '                <span>{{ props.row.shopId }}</span>\n'+
            '            </vue-col>\n'+
            '            <vue-col :span="12">\n'+
            '                <span>{{ props.row.shopName }}</span>\n'+
            '            </vue-col>\n'+
            '        </vue-row>\n'+
            '        <vue-row>\n'+
            '            <vue-col :span="24">\n'+
            '                <span>{{ props.row.shopAddr }}</span>\n'+
            '            </vue-col>\n'+
            '        </vue-row>\n'+
            '    </template>\n'+
            '    </vue-table-column>\n'+
            '</vue-table>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: [{\n'+
            '                    id: "12987122",\n'+
            '                    name: "商品2",\n'+
            '                    shopName: "店铺2",\n'+
            '                    shopId: "10332",\n'+
            '                    shopAddr: "福建厦门"\n'+
            '                }, {\n'+
            '                    id: "12987123",\n'+
            '                    name: "商品3",\n'+
            '                    shopName: "店铺3",\n'+
            '                    shopId: "10332",\n'+
            '                    shopAddr: "广东广州"\n'+
            '                }, {\n'+
            '                    id: "12987125",\n'+
            '                    name: "商品5",\n'+
            '                    shopName: "店铺1",\n'+
            '                    shopId: "10331",\n'+
            '                    shopAddr: "上海"\n'+
            '                }]\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'table4',
            label: '增删改',
            description: '',
            template: '<div class="source"><vue-table :data="tableData" border style="width: 100%"><vue-table-column label="操作" width="160"><template scope="props"><vue-button @click="editHandle(props.row)" type="primary" icon="vue-icon-edit"></vue-button><vue-button @click="delHandle(props.row)" type="primary" icon="vue-icon-delete"></vue-button></template></vue-table-column><vue-table-column prop="city" label="城市" width="150"></vue-table-column><vue-table-column prop="name" label="姓名" width="120"></vue-table-column><vue-table-column prop="address" label="地址" ></vue-table-column></vue-table><vue-button @click="addHandle" >行追加</vue-button><vue-dialog  v-model="dialogVisible"><vue-form :model="currentData" label-width="100px" ><vue-form-item label="城市" prop="city"><vue-input v-model="currentData.city"></vue-input></vue-form-item><vue-form-item label="姓名" prop="name"><vue-input v-model="currentData.name"></vue-input></vue-form-item><vue-form-item label="地址" prop="address"><vue-input v-model="currentData.address"></vue-input></vue-form-item></vue-form><span slot="footer" class="dialog-footer"><vue-button @click="dialogVisible = false">取 消</vue-button><vue-button type="primary" @click="saveHandle">确 定</vue-button></span></vue-dialog></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: [{
                            city: '厦门',
                            name: "张三",
                            address: "厦门市思明区"
                          }, {
                              city: '厦门',
                            name: "李四",
                            address: "厦门市翔安区"
                          }, {
                              city: '厦门',
                            name: "王二",
                            address: "厦门市湖里区"
                          }, {
                              city: '厦门',
                            name: "龙五",
                            address: "厦门市海沧区"
                          }],
                          currentIndex:-1,
                          currentData:{},
                          dialogVisible: false
                    }
                },
                methods: {
                  addHandle: function() {
                    this.currentData = {};
                    this.currentIndex = this.tableData.length;
                    this.dialogVisible = true;
                  },
                  editHandle: function(rowData) {
                    this.currentData = VueUtil.merge({}, rowData);
                    this.currentIndex = this.tableData.indexOf(rowData);
                    this.dialogVisible = true;
                  },
                  delHandle: function(rowData) {
                    var index = this.tableData.indexOf(rowData);
                    this.tableData.splice(index, 1);
                  },
                  saveHandle: function() {
                      Vue.set(this.tableData, this.currentIndex, this.currentData);
                      this.dialogVisible = false;
                    
                  }
                }
            },
            code: '<vue-table :data="tableData" border style="width: 100%">\n'+
            '    <vue-table-column label="操作" width="160">\n'+
            '        <template scope="props">\n'+
            '            <vue-button @click="editHandle(props.row)" type="primary" icon="vue-icon-edit"></vue-button>\n'+
            '            <vue-button @click="delHandle(props.row)" type="primary" icon="vue-icon-delete"></vue-button>\n'+
            '        </template>\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="date" label="日期" width="150">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="name" label="姓名" width="120">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="address" label="地址" width="300">\n'+
            '    </vue-table-column>\n'+
            '</vue-table>\n'+
            '<vue-button @click="addHandle" >行追加</vue-button>\n'+
            '<vue-dialog    v-model="dialogVisible">\n'+
            '    <vue-form :model="currentData" label-width="100px" >\n'+
            '        <vue-form-item label="城市" prop="city">\n'+
            '            <vue-input v-model="currentData.city"></vue-input>\n'+
            '        </vue-form-item>\n'+
            '        <vue-form-item label="姓名" prop="name">\n'+
            '            <vue-input v-model="currentData.name"></vue-input>\n'+
            '        </vue-form-item>\n'+
            '        <vue-form-item label="地址" prop="address">\n'+
            '            <vue-input v-model="currentData.address"></vue-input>\n'+
            '        </vue-form-item>\n'+
            '    </vue-form>\n'+
            '    <span slot="footer" class="dialog-footer">\n'+
            '        <vue-button @click="dialogVisible = false">取 消</vue-button>\n'+
            '        <vue-button type="primary" @click="saveHandle">确 定</vue-button>\n'+
            '    </span>\n'+
            '</vue-dialog>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: [{\n'+
            '                    name: "张三",\n'+
            '                    city: "厦门",\n'+
            '                    address: "厦门市思明区"\n'+
            '                }, {\n'+
            '                    name: "李四",\n'+
            '                    city: "厦门",\n'+
            '                    address: "厦门市翔安区"\n'+
            '                }, {\n'+
            '                    name: "王二",\n'+
            '                    city: "厦门",\n'+
            '                    address: "厦门市湖里区"\n'+
            '                }, {\n'+
            '                    city: "厦门",\n'+
            '                    name: "龙五",\n'+
            '                    address: "厦门市海沧区"\n'+
            '                }],\n'+
            '                currentIndex:-1,\n'+
            '                currentData:{},\n'+
            '                dialogVisible: false\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            addHandle: function() {\n'+
            '                this.currentData = {};\n'+
            '                this.currentIndex = this.tableData.length;\n'+
            '                this.dialogVisible = true;\n'+
            '            },\n'+
            '            editHandle: function(rowData) {\n'+
            '                this.currentData = VueUtil.merge({}, rowData);\n'+
            '                this.currentIndex = this.tableData.indexOf(rowData);\n'+
            '                this.dialogVisible = true;\n'+
            '            },\n'+
            '            delHandle: function(rowData) {\n'+
            '                var index = this.tableData.indexOf(rowData);\n'+
            '                this.tableData.splice(index, 1);\n'+
            '            },\n'+
            '            saveHandle: function() {\n'+
            '                Vue.set(this.tableData, this.currentIndex, this.currentData);\n'+
            '                this.dialogVisible = false;\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'table5',
            label: '排序',
            description: '通过表的default-sort属性设置默认的排序列和排序顺序。在列中设置sortable属性即可实现以该列为基准的排序',
            template: '<div class="source"><vue-table :data="tableData" border stripe style="width: 751px" :default-sort = "{prop: \'column1\', order: \'descending\'}"><vue-table-column v-for="item in 5" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" sortable ></vue-table-column></vue-table></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: null
                    }
                },
                mounted: function() {
                    var tableData = [];
                    for (var i = 0; i < 5; i++) {
                        var DateOption = {};
                        for (var j = 1; j < 6; j++) {  
                            DateOption['column'+j] = "value-"+j+"—"+(i+1);
                        }
                        tableData[i] = DateOption; 
                    }
                    this.tableData = tableData;
                }
            },
            code: '<vue-table :data="tableData" border stripe style="width: 751px" :default-sort = "{prop: \'column1\', order: \'descending\'}">\n'+
            '    <vue-table-column v-for="item in 5" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" sortable >\n'+
            '    </vue-table-column>\n'+
            '</vue-table>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: null\n'+
            '            }\n'+
            '        },\n'+
            '        mounted: function() {\n'+
            '            var tableData = [];\n'+
            '            for (var i = 0; i < 5; i++) {\n'+
            '                var DateOption = {};\n'+
            '                for (var j = 1; j < 6; j++) {\n'+
            '                    DateOption[\'column\'+j] = "value-"+j+"—"+(i+1);\n'+
            '                }\n'+
            '                tableData[i] = DateOption;\n'+
            '            }\n'+
            '            this.tableData = tableData;\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'table6',
            label: '筛选',
            description: '在列中设置filters属性即可开启该列的筛选。',
            template: '<div class="source"><vue-table :data="tableData" border stripe style="width: 751px"><vue-table-column v-for="item in 4" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" ></vue-table-column><vue-table-column prop="column5" label="column5" width="150" :filters="[{ text: \'value1\', value: \'value-5-1\' }, { text: \'value3\', value: \'value-5-3\' }]"></vue-table-column></vue-table></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: null
                    }
                },
                mounted: function() {
                    var tableData = [];
                    for (var i = 0; i < 5; i++) {
                        var DateOption = {};
                        for (var j = 1; j < 6; j++) {  
                            DateOption['column'+j] = "value-"+j+"—"+(i+1);
                        }
                        tableData[i] = DateOption; 
                    }
                    this.tableData = tableData;
                }
            },
            code: '<vue-table :data="tableData" border stripe style="width: 751px">\n'+
            '    <vue-table-column v-for="item in 4" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" >\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="column5" label="column5" width="150" :filters="[{ text: \'value1\', value: \'value-5-1\' }, { text: \'value3\', value: \'value-5-3\' }]">\n'+
            '    </vue-table-column>\n'+
            '</vue-table>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: null\n'+
            '            }\n'+
            '        },\n'+
            '        mounted: function() {\n'+
            '            var tableData = [];\n'+
            '            for (var i = 0; i < 5; i++) {\n'+
            '                var DateOption = {};\n'+
            '                for (var j = 1; j < 6; j++) {\n'+
            '                    DateOption[\'column\'+j] = "value-"+j+"—"+(i+1);\n'+
            '                }\n'+
            '                tableData[i] = DateOption;\n'+
            '            }\n'+
            '            this.tableData = tableData;\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'table7',
            label: '自定义样式',
            description: '通过table的属性 row-class-name 可以给行指定样式, 通过table-column的属性 className 可以给列指定样式, 通过table-column的属性labelClassName 可以给label的指定样式',
            template: '<div class="source"><vue-table :data="tableData" border stripe style="width: 751px" :row-class-name=\'getRowClass\'><vue-table-column v-for="item in 4" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" :class-name=\'getCellClass\'></vue-table-column><vue-table-column prop="column5" label="column5" width="150"></vue-table-column></vue-table><br/><vue-table :data="tableData" border stripe style="width: 751px" row-class-name="rowClass1"><vue-table-column v-for="item in 4" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" class-name="cellClass" label-class-name="rowClass cellClass1"></vue-table-column><vue-table-column prop="column5" label="column5" width="150"></vue-table-column></vue-table></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: null
                    }
                },
                methods: {
                    getRowClass: function(rowData, rowIndex) {
                        if (rowIndex%2 === 0) {
                            return 'rowClass1'
                        }
                        return 'rowClass'
                    },
                    getCellClass: function(rowIndex, cellIndex, rowData) {
                        if (rowIndex%2 === 0 && cellIndex%2 === 0) {
                            return 'cellClass1'
                        }
                        if (rowIndex%2 !== 0 && cellIndex%2 !== 0) {
                            return 'cellClass'
                        }
                    }
                },
                mounted: function() {
                    var tableData = [];
                    for (var i = 0; i < 5; i++) {
                        var DateOption = {};
                        for (var j = 1; j < 6; j++) {  
                            DateOption['column'+j] = "value-"+j+"—"+(i+1);
                        }
                        tableData[i] = DateOption; 
                    }
                    this.tableData = tableData;
                }
            },
            code: '<vue-table :data="tableData" border stripe style="width: 751px" :row-class-name="getRowClass">\n'+
            '    <vue-table-column v-for="item in 4" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" :class-name="getCellClass">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="column5" label="column5" width="150">\n'+
            '    </vue-table-column>\n'+
            '</vue-table>\n\n'+
            '<vue-table :data="tableData" border stripe style="width: 751px" row-class-name="rowClass1">\n'+
            '    <vue-table-column v-for="item in 4" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" class-name="cellClass" label-class-name="rowClass cellClass1">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="column5" label="column5" width="150">\n'+
            '    </vue-table-column>\n'+
            '</vue-table>\n\n'+
            '<style>\n'+
            '    .rowClass{\n'+
            '        color: #f00 !important;\n'+
            '    }\n'+
            '    .rowClass1{\n'+
            '        color: #00f !important;\n'+
            '    }\n'+
            '    .cellClass{\n'+
            '        background-color: #ff0 !important;\n'+
            '    }\n'+
            '    .cellClass1{\n'+
            '        background-color: #0ff !important;\n'+
            '    }\n'+
            '</style>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: null\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            getRowClass: function(rowData, rowIndex) {\n'+
            '                if (rowIndex%2 === 0) {\n'+
            '                    return "rowClass1"\n'+
            '                }\n'+
            '                return "rowClass"\n'+
            '            },\n'+
            '            getCellClass: function(rowIndex, cellIndex, rowData) {\n'+
            '                if (rowIndex%2 === 0 && cellIndex%2 === 0) {\n'+
            '                    return "cellClass1"\n'+
            '                }\n'+
            '                if (rowIndex%2 !== 0 && cellIndex%2 !== 0) {\n'+
            '                    return "cellClass"\n'+
            '                }\n'+
            '            }\n'+
            '        },\n'+
            '        mounted: function() {\n'+
            '            var tableData = [];\n'+
            '            for (var i = 0; i < 5; i++) {\n'+
            '                var DateOption = {};\n'+
            '                for (var j = 1; j < 6; j++) {\n'+
            '                    DateOption[\'column\'+j] = "value-"+j+"—"+(i+1);\n'+
            '                }\n'+
            '                tableData[i] = DateOption;\n'+
            '            }\n'+
            '            this.tableData = tableData;\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'table8',
            label: '展开行',
            description: '设置 type="expand" 和 Scoped slot 可以开启展开行功能，vue-table-column 的模板会被渲染成为展开行的内容，展开行可访问的属性与使用自定义列模板时的 Scoped slot 相同。设置table的 expand-class-name属性 可以给展开行指定样式',
            template: '<div class="source"><vue-table :data="tableData" style="width: 100%" expand-class-name="test" :expand-class-name="getExpandClass"><vue-table-column type="expand"><template scope="props"><p>State: {{ props.row.state }}</p><p>City: {{ props.row.city }}</p><p>Address: {{ props.row.address }}</p><p>Zip: {{ props.row.zip }}</p></template></vue-table-column><vue-table-column label="Date" prop="date" header-align="left"></vue-table-column><vue-table-column label="Name" prop="name" header-align="left"></vue-table-column></vue-table></div>',
            parameter: {
                data: function() {
                    return {
	                    tableData: [{
	                        date: "2017-05-03",
	                        name: "Tom",
	                        state: "California",
	                        city: "Los Angeles",
	                        address: "No. 189, Grove St, Los Angeles",
	                        zip: "CA 90036"
	                      }, {
	                        date: "2017-06-02",
	                        name: "Tom",
	                        state: "California",
	                        city: "Los Angeles",
	                        address: "No. 189, Grove St, Los Angeles",
	                        zip: "CA 90036"
	                      }, {
	                        date: "2017-07-04",
	                        name: "Tom",
	                        state: "California",
	                        city: "Los Angeles",
	                        address: "No. 189, Grove St, Los Angeles",
	                        zip: "CA 90036"
	                      }]
                    }
                },
                methods: {
                	getExpandClass: function(rowData, rowIndex) {
                        if (rowIndex%2 === 0) {
                            return 'rowClass1'
                        }
                        return 'rowClass'
                    }
                }
            },
            code: '<vue-table :data="tableData" style="width: 100%" :expand-class-name="getExpandClass">\n'+
            	'    <vue-table-column type="expand">\n'+
            	'        <template scope="props">\n'+
            	'            <p>State: {{ props.row.state }}</p>\n'+
            	'            <p>City: {{ props.row.city }}</p>\n'+
            	'            <p>Address: {{ props.row.address }}</p>\n'+
            	'            <p>Zip: {{ props.row.zip }}</p>\n'+
            	'        </template>\n'+
            	'    </vue-table-column>\n'+
            	'    <vue-table-column label="Date" prop="date" header-align="left"></vue-table-column>\n'+
            	'    <vue-table-column label="Name" prop="name" header-align="left"></vue-table-column>\n'+
            	'</vue-table>\n\n'+
                '<style>\n'+
                '    .rowClass{\n'+
                '        color: #f00 !important;\n'+
                '    }\n'+
                '    .rowClass1{\n'+
                '        color: #00f !important;\n'+
                '    }\n'+
                '</style>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: [{\n'+
            '                    date: "2017-05-03",\n'+
            '                    name: "Tom",\n'+
            '                    state: "California",\n'+
            '                    city: "Los Angeles",\n'+
            '                    address: "No. 189, Grove St, Los Angeles",\n'+
            '                    zip: "CA 90036",\n'+
            '                }, {\n'+
            '                    date: "2017-06-02",\n'+
            '                    name: "Tom",\n'+
            '                    state: "California",\n'+
            '                    city: "Los Angeles",\n'+
            '                    address: "No. 189, Grove St, Los Angeles",\n'+
            '                    zip: "CA 90036",\n'+
            '                }, {\n'+
            '                    date: "2017-07-04",\n'+
            '                    name: "Tom",\n'+
            '                    state: "California",\n'+
            '                    city: "Los Angeles",\n'+
            '                    address: "No. 189, Grove St, Los Angeles",\n'+
            '                    zip: "CA 90036",\n'+
            '                }]\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            getExpandClass: function(rowData, rowIndex) {\n'+
            '                if (rowIndex%2 === 0) {\n'+
            '                    return "rowClass1"\n'+
            '                }\n'+
            '                return "rowClass"\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return tableDemo;
});

