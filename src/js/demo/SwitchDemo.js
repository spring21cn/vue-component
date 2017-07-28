!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("SwitchDemo", this, function() {
    'use strict';
    var switchDemo = {
        path: '/switch',
        name: 'switch',
        head: {
            label: 'switchDemo.label',
            description: 'switchDemo.description'
        },
        samples: [{
            id: 'switch1',
            label: 'switchDemo.samples1.label',
            description: 'switchDemo.samples1.description',
            template: '<div class="source"><vue-row><vue-col :span="4"><vue-switch v-model="value1" on-text="Open" off-text="" width="65"></vue-switch></vue-col><vue-col :span="4"><vue-switch v-model="value2" on-color="#13ce66" off-color="#ff4949"></vue-switch></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        value1: true,
                        value2: false
                    };
                }
            },
            code: '<vue-switch v-model="value1" on-text="Open" off-text="" width="65"></vue-switch>\n'+
            '<vue-switch v-model="value2" on-color="#13ce66" off-color="#ff4949"></vue-switch>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                value1: true,\n'+
            '                value2: false\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'switch2',
            label: 'switchDemo.samples2.label',
            description: 'switchDemo.samples2.description',
            template: '<div class="source"><vue-row><vue-col :span="4"><vue-switch v-model="value1" disabled></vue-switch></vue-col><vue-col :span="4"><vue-switch v-model="value2" disabled></vue-switch></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        value1: true,
                        value2: false
                    };
                }
            },
            code: '<vue-switch v-model="value1" disabled></vue-switch>\n'+
            '<vue-switch v-model="value2" disabled></vue-switch>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                value1: true,\n'+
            '                value2: false\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'switch3',
            label: 'Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "disabled",
                        column2: "switchDemo.samples3.row1column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "width",
                        column2: "switchDemo.samples3.row2column2",
                        column3: "number",
                        column4: "—",
                        column5: "switchDemo.samples3.row2column5"
                    },{
                        column1: "on-icon-class",
                        column2: "switchDemo.samples3.row3column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "off-icon-class",
                        column2: "switchDemo.samples3.row4column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "on-text",
                        column2: "switchDemo.samples3.row5column2",
                        column3: "string",
                        column4: "—",
                        column5: "ON"
                    },{
                        column1: "off-text",
                        column2: "switchDemo.samples3.row6column2",
                        column3: "string",
                        column4: "—",
                        column5: "OFF"
                    },{
                        column1: "on-color",
                        column2: "switchDemo.samples3.row7column2",
                        column3: "string",
                        column4: "—",
                        column5: "#20A0FF"
                    },{
                        column1: "off-color",
                        column2: "switchDemo.samples3.row8column2",
                        column3: "string",
                        column4: "—",
                        column5: "#C0CCDA"
                    },{
                        column1: "name",
                        column2: "switchDemo.samples3.row9column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'switch4',
            label: 'Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "change",
                        column2: "switchDemo.samples4.row1column2",
                        column3: "value after changing"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return switchDemo;
});
