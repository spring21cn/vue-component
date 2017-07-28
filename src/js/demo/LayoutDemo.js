!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("LayoutDemo", this, function() {
    'use strict';
    var layoutDemo = {
        path: '/layout',
        name: 'layout',
        head: {
            label: 'layoutDemo.label',
            description: 'layoutDemo.description'
        },
        samples: [{
            id: 'layout1',
            label: 'layoutDemo.samples1.label',
            description: 'layoutDemo.samples1.description',
            template: '<div class="source"><vue-row class="margin-bottom20"><vue-col :span="24"><div class="grid-content bg-purple-dark"></div></vue-col></vue-row><vue-row class="margin-bottom20"><vue-col :span="12"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="12"><div class="grid-content bg-purple-light"></div></vue-col></vue-row><vue-row class="margin-bottom20"><vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="8"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col></vue-row><vue-row class="margin-bottom20"><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col></vue-row><vue-row class="margin-bottom20"><vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple-light"></div></vue-col></vue-row></div>',
            code: '<vue-row>\n    <vue-col :span="24"><div class="grid-content bg-purple-dark"></div></vue-col>\n</vue-row>\n<vue-row>\n    <vue-col :span="12"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="12"><div class="grid-content bg-purple-light"></div></vue-col>\n    </vue-row>\n<vue-row>\n    <vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="8"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>\n<vue-row>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col>\n</vue-row>\n<vue-row>\n    <vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple-light"></div></vue-col>\n</vue-row>'
        }, {
            id: 'layout2',
            label: 'layoutDemo.samples2.label',
            description: 'layoutDemo.samples2.description',
            template: '<div class="source"><vue-row :gutter="20"><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col></vue-row></div>',
            code: '<vue-row :gutter="20">\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>'
        }, {
            id: 'layout3',
            label: 'layoutDemo.samples3.label',
            description: 'layoutDemo.samples3.description',
            template: '<div class="source"><vue-row class="margin-bottom20" :gutter="20"><vue-col :span="16"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col></vue-row><vue-row class="margin-bottom20" :gutter="20"><vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col></vue-row><vue-row class="margin-bottom20" :gutter="20"><vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="16"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col></vue-row></div>',
            code: '<vue-row :gutter="20">\n    <vue-col :span="16"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>\n<vue-row :gutter="20">\n    <vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>\n<vue-row :gutter="20">\n    <vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="16"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>'
        }, {
            id: 'layout4',
            label: 'layoutDemo.samples4.label',
            description: 'layoutDemo.samples4.description',
            template: '<div class="source"><vue-row class="margin-bottom20 row-bg" type="flex"><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col></vue-row><vue-row class="margin-bottom20 row-bg" type="flex" justify="center"><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col></vue-row><vue-row class="margin-bottom20 row-bg" type="flex" justify="end"><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col></vue-row><vue-row class="margin-bottom20 row-bg" type="flex" justify="space-between"><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col></vue-row><vue-row class="margin-bottom20 row-bg" type="flex" justify="space-around"><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col></vue-row></div>',
            code: '<vue-row class="row-bg" type="flex">\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>\n<vue-row class="row-bg" type="flex" justify="center">\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>\n<vue-row class="row-bg" type="flex" justify="end">\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>\n<vue-row class="row-bg" type="flex" justify="space-between">\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>\n<vue-row class="row-bg" type="flex" justify="space-around">\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>'
        }, {
            id: 'layout5',
            label: 'layoutDemo.samples5.label',
            description: 'layoutDemo.samples5.description',
            template: '<div class="source"><vue-row :gutter="10"><vue-col :xs="8" :sm="6" :md="4" :lg="3"><div class="grid-content bg-purple"></div></vue-col><vue-col :xs="4" :sm="6" :md="8" :lg="9"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :xs="4" :sm="6" :md="8" :lg="9"><div class="grid-content bg-purple"></div></vue-col><vue-col :xs="8" :sm="6" :md="4" :lg="3"><div class="grid-content bg-purple-light"></div></vue-col></vue-row></div>',
            code: '<vue-row :gutter="10">\n    <vue-col :xs="8" :sm="6" :md="4" :lg="3"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :xs="4" :sm="6" :md="8" :lg="9"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :xs="4" :sm="6" :md="8" :lg="9"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :xs="8" :sm="6" :md="4" :lg="3"><div class="grid-content bg-purple-light"></div></vue-col>\n</vue-row>'
        }, {
            id: 'layout6',
            label: 'Row Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "gutter",
                        column2: "layoutDemo.samples6.row1column2",
                        column3: "number",
                        column4: "—",
                        column5: "0"
                    },{
                        column1: "type",
                        column2: "layoutDemo.samples6.row2column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "justify",
                        column2: "layoutDemo.samples6.row3column2",
                        column3: "string",
                        column4: "start/end/center/space-around/space-between",
                        column5: "start"
                    },{
                        column1: "align",
                        column2: "layoutDemo.samples6.row4column2",
                        column3: "string",
                        column4: "top/middle/bottom",
                        column5: "top"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'layout7',
            label: 'Col Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "span",
                        column2: "layoutDemo.samples7.row1column2",
                        column3: "number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "offset",
                        column2: "layoutDemo.samples7.row2column2",
                        column3: "number",
                        column4: "—",
                        column5: "0"
                    },{
                        column1: "push",
                        column2: "layoutDemo.samples7.row3column2",
                        column3: "number",
                        column4: "—",
                        column5: "0"
                    },{
                        column1: "pull",
                        column2: "layoutDemo.samples7.row4column2",
                        column3: "number",
                        column4: "—",
                        column5: "0"
                    },{
                        column1: "xs",
                        column2: "layoutDemo.samples7.row5column2",
                        column3: "layoutDemo.samples7.row5column3",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "sm",
                        column2: "layoutDemo.samples7.row6column2",
                        column3: "layoutDemo.samples7.row6column3",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "md",
                        column2: "layoutDemo.samples7.row7column2",
                        column3: "layoutDemo.samples7.row7column3",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "lg",
                        column2: "layoutDemo.samples7.row8column2",
                        column3: "layoutDemo.samples7.row8column3",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return layoutDemo;
});