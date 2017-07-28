!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("DateDemo", this, function() {
    'use strict';
    var dateDemo = {
        path: '/date',
        name: 'date',
        head: {
            label: 'dateDemo.label',
            description: 'dateDemo.description'
        },
        samples: [{
            id: 'date1',
            label: 'dateDemo.samples1.label',
            description: 'dateDemo.samples1.description',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'dateDemo.samples1.defaultLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value1" type="date" :placeholder="$t(\'dateDemo.samples1.defaultPlaceholder\')" :picker-options="pickerOptions0"></vue-date-picker></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'dateDemo.samples1.optionsLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value2" align="right" type="date" :placeholder="$t(\'dateDemo.samples1.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                    pickerOptions0: {
                      disabledDate: function(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                      }
                    },
                    pickerOptions1: {
                        shortcuts: [{
                            text: this.$t('dateDemo.samples1.todayLabel'),
                            onClick: function(picker) {
                              picker.$emit('pick', new Date());
                            }
                          }, {
                            text: this.$t('dateDemo.samples1.yesterdayLabel'),
                            onClick: function(picker) {
                              var date = new Date();
                              date.setTime(date.getTime() - 3600 * 1000 * 24);
                              picker.$emit('pick', date);
                            }
                          }, {
                            text: this.$t('dateDemo.samples1.weekAgoLabel'),
                            onClick: function(picker) {
                              var date = new Date();
                              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                              picker.$emit('pick', date);
                            }
                          }]
                        },
                        value1: '',
                        value2: ''
                  };
                }
            },
            code: '<span class="demonstration">{{$t(\'dateDemo.samples1.defaultLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value1" type="date" :placeholder="$t(\'dateDemo.samples1.defaultPlaceholder\')" :picker-options="pickerOptions0"></vue-date-picker>\n'+
            '<span class="demonstration">{{$t(\'dateDemo.samples1.optionsLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value2" align="right" type="date" :placeholder="$t(\'dateDemo.samples1.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                pickerOptions0: {\n'+
            '                    disabledDate: function(time) {\n'+
            '                        return time.getTime() < Date.now() - 8.64e7;\n'+
            '                    }\n'+
            '                },\n'+
            '                pickerOptions1: {\n'+
            '                    shortcuts: [{\n'+
            '                        text: this.$t("dateDemo.samples1.todayLabel"),\n'+
            '                        onClick: function(picker) {\n'+
            '                            picker.$emit("pick", new Date());\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t("dateDemo.samples1.yesterdayLabel"),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var date = new Date();\n'+
            '                            date.setTime(date.getTime() - 3600 * 1000 * 24);\n'+
            '                            picker.$emit("pick", date);\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t("dateDemo.samples1.weekAgoLabel"),\n'+
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
            id: 'date2',
            label: 'dateDemo.samples2.label',
            description: 'dateDemo.samples2.description',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t("dateDemo.samples2.weekLabel")}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value1" type="week" :format="$t(\'dateDemo.samples2.weekFormat\')" :placeholder="$t(\'dateDemo.samples2.weekPlaceholder\')"></vue-date-picker></vue-col></vue-row><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t("dateDemo.samples2.monthLabel")}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value2" type="month" :placeholder="$t(\'dateDemo.samples2.monthPlaceholder\')"></vue-date-picker></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t("dateDemo.samples2.yearLabel")}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value3" type="year" :placeholder="$t(\'dateDemo.samples2.yearPlaceholder\')"></vue-date-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                        value1: '',
                        value2: '',
                        value3: ''
                  };
                }
            },
            code: '<span class="demonstration">{{$t("dateDemo.samples2.weekLabel")}}</span>\n'+
            '<vue-date-picker v-model="value1" type="week" :format="$t(\'dateDemo.samples2.weekFormat\')" :placeholder="$t(\'dateDemo.samples2.weekPlaceholder\')"></vue-date-picker>\n'+
            '<span class="demonstration">{{$t("dateDemo.samples2.monthLabel")}}</span>\n'+
            '<vue-date-picker v-model="value2" type="month" :placeholder="$t(\'dateDemo.samples2.monthPlaceholder\')"></vue-date-picker>\n'+
            '<span class="demonstration">{{$t("dateDemo.samples2.yearLabel")}}</span>\n'+
            '<vue-date-picker v-model="value3" type="year" :placeholder="$t(\'dateDemo.samples2.yearPlaceholder\')"></vue-date-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                value1: "",\n'+
            '                value2: "",\n'+
            '                value3: ""\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'date3',
            label: 'dateDemo.samples3.label',
            description: 'dateDemo.samples3.description',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'dateDemo.samples3.defaultLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value1" type="daterange" :placeholder="$t(\'dateDemo.samples3.defaultPlaceholder\')"></vue-date-picker></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'dateDemo.samples3.optionsLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value2" align="right" type="daterange" :placeholder="$t(\'dateDemo.samples3.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                      value1: '',
                      value2: '',
                      pickerOptions1: {
                          shortcuts: [{
                              text: this.$t('dateDemo.samples3.lastWeekLabel'),
                              onClick: function(picker) {
                                  var end = new Date();
                                  var start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                  picker.$emit("pick", [start, end]);
                              }
                          }, {
                              text: this.$t('dateDemo.samples3.lastMonthLabel'),
                              onClick: function(picker) {
                                  var end = new Date();
                                  var start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                  picker.$emit("pick", [start, end]);
                              }
                          }, {
                              text: this.$t('dateDemo.samples3.last3MonthLabel'),
                              onClick: function(picker) {
                                  var end = new Date();
                                  var start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                  picker.$emit("pick", [start, end]);
                              }
                          }]
                      }
                  };
                }
            },
            code: '<span class="demonstration">{{$t(\'dateDemo.samples3.defaultLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value1" type="daterange" :placeholder="$t(\'dateDemo.samples3.defaultPlaceholder\')"></vue-date-picker>\n'+
            '<span class="demonstration">{{$t(\'dateDemo.samples3.optionsLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value2" align="right" type="daterange" :placeholder="$t(\'dateDemo.samples3.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                value1: "",\n'+
            '                value2: "",\n'+
            '                pickerOptions1: {\n'+
            '                    shortcuts: [{\n'+
            '                        text: this.$t(\'dateDemo.samples3.lastWeekLabel\'),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var end = new Date();\n'+
            '                            var start = new Date();\n'+
            '                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);\n'+
            '                            picker.$emit("pick", [start, end]);\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t(\'dateDemo.samples3.lastMonthLabel\'),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var end = new Date();\n'+
            '                            var start = new Date();\n'+
            '                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);\n'+
            '                            picker.$emit("pick", [start, end]);\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t(\'dateDemo.samples3.last3MonthLabel\'),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var end = new Date();\n'+
            '                            var start = new Date();\n'+
            '                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);\n'+
            '                            picker.$emit("pick", [start, end]);\n'+
            '                        }\n'+
            '                    }]\n'+
            '                },\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'date4',
            label: 'Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "readonly",
                        column2: "dateDemo.samples4.row1column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "true"
                    },{
                        column1: "disabled",
                        column2: "dateDemo.samples4.row2column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "clearable",
                        column2: "dateDemo.samples4.row3column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "true"
                    },{
                        column1: "size",
                        column2: "dateDemo.samples4.row4column2",
                        column3: "string",
                        column4: "large, small, mini",
                        column5: "—"
                    },{
                        column1: "placeholder",
                        column2: "dateDemo.samples4.row5column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "type",
                        column2: "dateDemo.samples4.row6column2",
                        column3: "string",
                        column4: "year/month/date/week/datetime/datetimerange/daterange",
                        column5: "date"
                    },{
                        column1: "format",
                        column2: "dateDemo.samples4.row7column2",
                        column3: "string",
                        column4: "dateDemo.samples4.row7column4",
                        column5: "yyyy-MM-dd"
                    },{
                        column1: "align",
                        column2: "dateDemo.samples4.row8column2",
                        column3: "string",
                        column4: "left, center, right",
                        column5: "left"
                    },{
                        column1: "popper-class",
                        column2: "dateDemo.samples4.row9column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "range-separator",
                        column2: "dateDemo.samples4.row10column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "default-value",
                        column2: "dateDemo.samples4.row11column2",
                        column3: "Date",
                        column4: "dateDemo.samples4.row11column4",
                        column5: "—"
                    },{
                        column1: "picker-options",
                        column2: "dateDemo.samples4.row12column2",
                        column3: "object",
                        column4: "—",
                        column5: "{}"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'date5',
            label: 'Picker Options',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "shortcuts",
                        column2: "dateDemo.samples5.row1column2",
                        column3: "object/array",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "disabledDate",
                        column2: "dateDemo.samples5.row2column2",
                        column3: "Function",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "firstDayOfWeek",
                        column2: "dateDemo.samples5.row3column2",
                        column3: "Number",
                        column4: "1~7",
                        column5: "7"
                    },{
                        column1: "onPick",
                        column2: "dateDemo.samples5.row4column2",
                        column3: "Function({ maxDate, minDate })",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'date6',
            label: ' Shortcuts',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "text",
                        column2: "dateDemo.samples6.row1column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "onClick",
                        column2: "dateDemo.samples6.row2column2",
                        column3: "Function",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'date7',
            label: 'Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left" width="150"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "change",
                        column2: "dateDemo.samples7.row1column2",
                        column3: "dateDemo.samples7.row1column3"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return dateDemo;
});
