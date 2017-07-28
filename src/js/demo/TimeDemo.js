!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("TimeDemo", this, function() {
    'use strict';
    var timeDemo = {
        path: '/time',
        name: 'time',
        head: {
            label: 'timeDemo.label',
            description: 'timeDemo.description'
        },
        samples: [{
            id: 'time1',
            label: 'timeDemo.samples1.label',
            description: 'timeDemo.samples1.description',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'timeDemo.samples1.timelabel1\')}}</span></vue-col><vue-col :span="16"><vue-time-select v-model="value1" :picker-options="{ start: \'08:30\', step: \'00:15\', end: \'18:30\'}" :placeholder="$t(\'timeDemo.samples1.timePlaceholder1\')"></vue-time-select></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'timeDemo.samples1.timelabel2\')}}</span></vue-col><vue-col :span="16"><vue-time-picker v-model="value2" :picker-options="{selectableRange: \'18:30:00 - 20:30:00\'}" :placeholder="$t(\'timeDemo.samples1.timePlaceholder2\')"></vue-time-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                        value1: '',
                        value2: new Date(2017, 7, 10, 9, 40)
                  };
                }
            },
            code: '<span class="demonstration">{{$t(\'timeDemo.samples1.timelabel1\')}}</span>\n'+
            '<vue-time-select v-model="value1" :picker-options="{ start: \'08:30\', step: \'00:15\', end: \'18:30\'}" :placeholder="$t(\'timeDemo.samples1.timePlaceholder1\')"></vue-time-select>\n'+
            '<span class="demonstration">{{$t(\'timeDemo.samples1.timelabel2\')}}</span>\n'+
            '<vue-time-picker v-model="value2" :picker-options="{selectableRange: \'18:30:00 - 20:30:00\'}" :placeholder="$t(\'timeDemo.samples1.timePlaceholder2\')"></vue-time-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                value1: "",\n'+
            '                value2: new Date(2017, 7, 10, 9, 40)\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'time2',
            label: '时间范围',
            description: '使用vue-time-select时,若先选择开始时间，则结束时间内备选项的状态会随之改变; 使用vue-time-picker时,添加is-range属性即可选择时间范围',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'timeDemo.samples2.timelabel1\')}}</span></vue-col><vue-col :span="16"><vue-time-select :placeholder="$t(\'timeDemo.samples2.timePlaceholder1\')" v-model="startTime" :picker-options="{ start: \'08:30\', step: \'00:15\', end: \'18:30\'}"></vue-time-select><vue-time-select :placeholder="$t(\'timeDemo.samples2.timePlaceholder2\')" v-model="endTime" :picker-options="{start: \'08:30\', step: \'00:15\', end: \'18:30\', minTime: startTime}"></vue-time-select></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'timeDemo.samples2.timelabel2\')}}</span></vue-col><vue-col :span="16"><vue-time-picker is-range v-model="time" :placeholder="$t(\'timeDemo.samples2.timePlaceholder3\')"></vue-time-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                      startTime: '',
                      endTime: '',
                      time: [new Date(2017, 7, 10, 8, 40), new Date(2017, 7, 10, 9, 40)]
                  };
                }
            },
            code: '<span class="demonstration">{{$t(\'timeDemo.samples2.timelabel1\')}}</span>\n'+
            '<vue-time-select :placeholder="$t(\'timeDemo.samples2.timePlaceholder1\')" v-model="startTime" :picker-options="{ start: \'08:30\', step: \'00:15\', end: \'18:30\'}"></vue-time-select><vue-time-select :placeholder="$t(\'timeDemo.samples2.timePlaceholder2\')" v-model="endTime" :picker-options="{start: \'08:30\', step: \'00:15\', end: \'18:30\', minTime: startTime}"></vue-time-select>\n'+
            '<span class="demonstration">{{$t(\'timeDemo.samples2.timelabel2\')}}</span>\n'+
            '<vue-time-picker is-range v-model="time" :placeholder="$t(\'timeDemo.samples2.timePlaceholder3\')"></vue-time-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                startTime: "",\n'+
            '                endTime: "",\n'+
            '                time: [new Date(2017, 7, 10, 8, 40), new Date(2017, 7, 10, 9, 40)]\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'time3',
            label: 'Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "readonly",
                        column2: "timeDemo.samples3.row1column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "true"
                    },{
                        column1: "disabled",
                        column2: "timeDemo.samples3.row2column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "clearable",
                        column2: "timeDemo.samples3.row3column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "true"
                    },{
                        column1: "size",
                        column2: "timeDemo.samples3.row4column2",
                        column3: "string",
                        column4: "large, small, mini",
                        column5: "—"
                    },{
                        column1: "placeholder",
                        column2: "timeDemo.samples3.row5column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "align",
                        column2: "timeDemo.samples3.row6column2",
                        column3: "string",
                        column4: "left, center, right",
                        column5: "left"
                    },{
                        column1: "popper-class",
                        column2: "timeDemo.samples3.row7column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "picker-options",
                        column2: "timeDemo.samples3.row8column2",
                        column3: "object",
                        column4: "—",
                        column5: "{}"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'time4',
            label: 'vue-time-select Picker Options',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "start",
                        column2: "timeDemo.samples4.row1column2",
                        column3: "string",
                        column4: "—",
                        column5: "09:00"
                    },{
                        column1: "end",
                        column2: "timeDemo.samples4.row2column2",
                        column3: "string",
                        column4: "—",
                        column5: "18:00"
                    },{
                        column1: "step",
                        column2: "timeDemo.samples4.row3column2",
                        column3: "string",
                        column4: "—",
                        column5: "00:30"
                    },{
                        column1: "minTime",
                        column2: "timeDemo.samples4.row4column2",
                        column3: "string",
                        column4: "—",
                        column5: "00:00"
                    },{
                        column1: "maxTime",
                        column2: "timeDemo.samples4.row5column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'time5',
            label: 'vue-time-picker Picker Options',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "selectableRange",
                        column2: "timeDemo.samples5.row1column2",
                        column3: "string/array",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "format",
                        column2: "timeDemo.samples5.row2column2",
                        column3: "string",
                        column4: "timeDemo.samples5.row2column4",
                        column5: "'HH:mm:ss'"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'time6',
            label: 'Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left" width="150"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "change",
                        column2: "timeDemo.samples6.row1column2",
                        column3: "timeDemo.samples6.row1column3"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return timeDemo;
});
