!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("CalendarDemo", this, function() {
    'use strict';
    var calendarDemo = {
        path: '/calendar',
        name: 'calendar',
        head: {
            label: 'calendarDemo.label',
            description: 'calendarDemo.description'
        },
        samples: [{
            id: 'calendar1',
            label: 'calendarDemo.samples1.label',
            description: 'calendarDemo.samples1.description',
            template: '<div class="source"><vue-row type="flex" justify="center" :gutter="20"><vue-col :span="12"><vue-calendar @dayclick="clickHandle" :events="vcevents"></vue-calendar></vue-col><vue-col :span="12"><vue-note box title="Event List" style="height:100%"><div v-for="(event, index) in noteEvents" style="width:100%" :key="index">Date: {{event.date}}<br/>Description: {{event.title}}<vue-divider></vue-divider></div></vue-note></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        vcevents: [{
                            date: '2017-09-02 10:22',
                            title: 'Event 1'
                        }, {
                            date: '2017/08/10',
                            title: 'Event 2'
                        }, {
                            date: '07/31/2017',
                            title: 'Event 3'
                        }, {
                            date: new Date(),
                            title: 'Event 4'
                        },{
                            date: '2017-09-02',
                            title: 'Event 5'
                        }, {
                            date: '2017/08/10',
                            title: 'Event 6'
                        }, {
                            date: '07/31/2017',
                            title: 'Event 7'
                        }, {
                            date: new Date(),
                            title: 'Event 8'
                        }],
                        noteEvents: []
                    }
                },
                methods: {
                    clickHandle: function(date, events) {
                        this.noteEvents = events;
                    }
                }
            },
            code: '<vue-calendar @dayclick="clickHandle" :events="vcevents"></vue-calendar>\n'+
            '<vue-note box title="Event List" style="height:100%">\n'+
            '    <div v-for="(event, index) in noteEvents" style="width:100%" :key="index">\n'+
            '        Date: {{event.date}}\n'+
            '        <br/>\n'+
            '        Description: {{event.title}}\n'+
            '        <vue-divider></vue-divider>\n'+
            '    </div>\n'+
            '</vue-note>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                vcevents: [{\n'+
            '                    date: "2017-09-02 10:22",\n'+
            '                    title: "Event 1"\n'+
            '                }, {\n'+
            '                    date: "2017/08/10",\n'+
            '                    title: "Event 2"\n'+
            '                }, {\n'+
            '                    date: "07/31/2017",\n'+
            '                    title: "Event 3"\n'+
            '                }, {\n'+
            '                    date: new Date(),\n'+
            '                    title: "Event 4"\n'+
            '                }, {\n'+
            '                    date: "2017-09-02",\n'+
            '                    title: "Event 5"\n'+
            '                }, {\n'+
            '                    date: "2017/08/10",\n'+
            '                    title: "Event 6"\n'+
            '                }, {\n'+
            '                    date: "07/31/2017",\n'+
            '                    title: "Event 7"\n'+
            '                }, {\n'+
            '                    date: new Date(),\n'+
            '                    title: "Event 8"\n'+
            '                }],\n'+
            '                noteEvents: []\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            clickHandle: function(date, events) {\n'+
            '                this.noteEvents = events;\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'calendar2',
            label: ' Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "events",
                        column2: "calendarDemo.samples2.row1column2",
                        column3: "array/object",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'calendar3',
            label: 'Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left" width="150"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "dayclick",
                        column2: "calendarDemo.samples3.row1column2",
                        column3: "(date: date, events: array)"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return calendarDemo;
});

