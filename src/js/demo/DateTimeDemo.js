!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("DateTimeDemo", this, function() {
    'use strict';
    var dateTimeDemo = {
        path: '/dateTime',
        name: 'dateTime',
        head: {
            label: 'datetimeDemo.label',
            description: 'datetimeDemo.description'
        },
        samples: [{
            id: 'dateTime1',
            label: 'datetimeDemo.samples1.label',
            description: 'datetimeDemo.samples1.description',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'datetimeDemo.samples1.defaultLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value1" type="datetime" :placeholder="$t(\'datetimeDemo.samples1.defaultPlaceholder\')"></vue-date-picker></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'datetimeDemo.samples1.optionsLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value2" align="right" type="datetime" :placeholder="$t(\'datetimeDemo.samples1.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                      pickerOptions1: {
                          shortcuts: [{
                              text: this.$t('datetimeDemo.samples1.todayLabel'),
                              onClick: function(picker) {
                                picker.$emit('pick', new Date());
                              }
                            }, {
                              text: this.$t('datetimeDemo.samples1.yesterdayLabel'),
                              onClick: function(picker) {
                                var date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24);
                                picker.$emit('pick', date);
                              }
                            }, {
                              text: this.$t('datetimeDemo.samples1.weekAgoLabel'),
                              onClick: function(picker) {
                                var date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', date);
                              }
                            }]
                          },
                      value1: "",
                      value2: ""
                  };
                }
            },
            code: '<span class="demonstration">{{$t(\'datetimeDemo.samples1.defaultLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value1" type="datetime" :placeholder="$t(\'datetimeDemo.samples1.defaultPlaceholder\')"></vue-date-picker>\n'+
            '<span class="demonstration">{{$t(\'datetimeDemo.samples1.optionsLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value2" align="right" type="datetime" :placeholder="$t(\'datetimeDemo.samples1.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                pickerOptions1: {\n'+
            '                    shortcuts: [{\n'+
            '                        text: this.$t("datetimeDemo.samples1.todayLabel"),\n'+
            '                        onClick: function(picker) {\n'+
            '                            picker.$emit("pick", new Date());\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t("datetimeDemo.samples1.yesterdayLabel"),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var date = new Date();\n'+
            '                            date.setTime(date.getTime() - 3600 * 1000 * 24);\n'+
            '                            picker.$emit("pick", date);\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t("datetimeDemo.samples1.weekAgoLabel"),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var date = new Date();\n'+
            '                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);\n'+
            '                            picker.$emit("pick", date);\n'+
            '                        }\n'+
            '                    }]\n'+
            '                },\n'+
            '                value1: "",\n'+
            '                value2: ""\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'dateTime2',
            label: 'datetimeDemo.samples2.label',
            description: 'datetimeDemo.samples2.description',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'datetimeDemo.samples2.defaultLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value1" type="datetimerange" :placeholder="$t(\'datetimeDemo.samples2.defaultPlaceholder\')"></vue-date-picker></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'datetimeDemo.samples2.optionsLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value2" align="right" type="datetimerange" :placeholder="$t(\'datetimeDemo.samples2.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                      pickerOptions1: {
                          shortcuts: [{
                              text: this.$t('datetimeDemo.samples2.lastWeekLabel'),
                              onClick: function(picker) {
                                  var end = new Date();
                                  var start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                  picker.$emit("pick", [start, end]);
                              }
                          }, {
                              text: this.$t('datetimeDemo.samples2.lastMonthLabel'),
                              onClick: function(picker) {
                                  var end = new Date();
                                  var start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                  picker.$emit("pick", [start, end]);
                              }
                          }, {
                              text: this.$t('datetimeDemo.samples2.last3MonthLabel'),
                              onClick: function(picker) {
                                  var end = new Date();
                                  var start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                  picker.$emit("pick", [start, end]);
                              }
                          }]
                      },
                      value1: [new Date(2017, 5, 10, 10, 10), new Date(2017, 6, 11, 10, 10)],
                      value2: ""
                  };
                }
            },
            code: '<span class="demonstration">{{$t(\'datetimeDemo.samples2.defaultLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value1" type="datetimerange" :placeholder="$t(\'datetimeDemo.samples2.defaultPlaceholder\')"></vue-date-picker>\n'+
            '<span class="demonstration">{{$t(\'datetimeDemo.samples2.optionsLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value2" align="right" type="datetimerange" :placeholder="$t(\'datetimeDemo.samples2.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                pickerOptions1: {\n'+
            '                    shortcuts: [{\n'+
            '                        text: this.$t(\'datetimeDemo.samples2.lastWeekLabel\'),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var end = new Date();\n'+
            '                            var start = new Date();\n'+
            '                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);\n'+
            '                            picker.$emit("pick", [start, end]);\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t(\'datetimeDemo.samples2.lastMonthLabel\'),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var end = new Date();\n'+
            '                            var start = new Date();\n'+
            '                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);\n'+
            '                            picker.$emit("pick", [start, end]);\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t(\'datetimeDemo.samples2.last3MonthLabel\'),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var end = new Date();\n'+
            '                            var start = new Date();\n'+
            '                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);\n'+
            '                            picker.$emit("pick", [start, end]);\n'+
            '                        }\n'+
            '                    }]\n'+
            '                },\n'+
            '                value1: [new Date(2017, 07, 10, 10, 10), new Date(2017, 07, 11, 10, 10)],\n'+
            '                value2: ""\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'dateTime3',
            label: 'Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "readonly",
                        column2: "datetimeDemo.samples3.row1column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "true"
                    },{
                        column1: "disabled",
                        column2: "datetimeDemo.samples3.row2column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "clearable",
                        column2: "datetimeDemo.samples3.row3column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "true"
                    },{
                        column1: "size",
                        column2: "datetimeDemo.samples3.row4column2",
                        column3: "string",
                        column4: "large, small, mini",
                        column5: "—"
                    },{
                        column1: "placeholder",
                        column2: "datetimeDemo.samples3.row5column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "type",
                        column2: "datetimeDemo.samples3.row6column2",
                        column3: "string",
                        column4: "year/month/date/week/datetime/datetimerange/daterange",
                        column5: "date"
                    },{
                        column1: "format",
                        column2: "datetimeDemo.samples3.row7column2",
                        column3: "string",
                        column4: "datetimeDemo.samples3.row7column4",
                        column5: "yyyy-MM-dd"
                    },{
                        column1: "align",
                        column2: "datetimeDemo.samples3.row8column2",
                        column3: "string",
                        column4: "left, center, right",
                        column5: "left"
                    },{
                        column1: "popper-class",
                        column2: "datetimeDemo.samples3.row9column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "range-separator",
                        column2: "datetimeDemo.samples3.row10column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "picker-options",
                        column2: "datetimeDemo.samples3.row11column2",
                        column3: "object",
                        column4: "—",
                        column5: "{}"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'dateTime4',
            label: 'Picker Options',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "shortcuts",
                        column2: "datetimeDemo.samples4.row1column2",
                        column3: "object/array",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "disabledDate",
                        column2: "datetimeDemo.samples4.row2column2",
                        column3: "Function",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'dateTime5',
            label: ' Shortcuts',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "text",
                        column2: "datetimeDemo.samples5.row1column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "onClick",
                        column2: "datetimeDemo.samples5.row2column2",
                        column3: "Function",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'dateTime6',
            label: 'Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left" width="150"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "change",
                        column2: "datetimeDemo.samples6.row1column2",
                        column3: "datetimeDemo.samples6.row1column3"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return dateTimeDemo;
});
