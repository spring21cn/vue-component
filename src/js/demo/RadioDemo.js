!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("RadioDemo", this, function() {
    'use strict';
    var radioDemo = {
        path: '/radio',
        name: 'radio',
        head: {
            label: 'radioDemo.label',
            description: 'radioDemo.description'
        },
        samples: [{
            id: 'radio1',
            label: 'radioDemo.samples1.label',
            description: 'radioDemo.samples1.description',
            template: '<div class="source"><vue-radio class="radio" v-model="radio" label="1">Option 1</vue-radio><vue-radio class="radio" v-model="radio" label="2">Option 2</vue-radio></div>',
            parameter: {
                data: function() {
                    return {
                        radio: "1"
                    }
                }
            },
            code: '<vue-radio class="radio" v-model="radio" label="1">Option 1</vue-radio>\n<vue-radio class="radio" v-model="radio" label="2">Option 2</vue-radio>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                radio: "1"\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'radio2',
            label: 'radioDemo.samples2.label',
            description: 'radioDemo.samples2.description',
            template: '<div class="source"><vue-radio disabled v-model="radio" label="Disabled">Disabled</vue-radio><vue-radio disabled v-model="radio" label="Selected and Disabled">Selected and Disabled</vue-radio></div>',
            parameter: {
                data: function() {
                    return {
                        radio: "Selected and Disabled"
                    }
                }
            },
            code: '<vue-radio disabled v-model="radio" label="Disabled">Disabled</vue-radio>\n<vue-radio disabled v-model="radio" label="Selected and Disabled">Selected and Disabled</vue-radio>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                radio: "Selected and Disabled"\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'radio3',
            label: 'radioDemo.samples3.label',
            description: 'radioDemo.samples3.description',
            template: '<div class="source"><vue-radio-group v-model="radio"><vue-radio :label="3">Option A</vue-radio><vue-radio :label="6">Option B</vue-radio><vue-radio :label="9">Option C</vue-radio></vue-radio-group></div>',
            parameter: {
                data: function() {
                    return {
                        radio: 3
                    }
                }
            },
            code: '<vue-radio-group v-model="radio">\n    <vue-radio :label="3">Option A</vue-radio>\n    <vue-radio :label="6">Option B</vue-radio>\n    <vue-radio :label="9">Option C</vue-radio>\n</vue-radio-group>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                radio: "3"\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'radio4',
            label: 'radioDemo.samples4.label',
            description: 'radioDemo.samples4.description',
            template: '<div class="source"><vue-radio-group v-model="radio1" size="large" fill="#324057" text-color="#a4aebd"><vue-radio-button label="New York"></vue-radio-button><vue-radio-button label="Washington"></vue-radio-button><vue-radio-button label="Los Angeles"></vue-radio-button><vue-radio-button label="Chicago"></vue-radio-button></vue-radio-group><div style="margin: 15px 0;"></div><vue-radio-group v-model="radio2"><vue-radio-button label="New York"></vue-radio-button><vue-radio-button label="Washington" :disabled="true"></vue-radio-button><vue-radio-button label="Los Angeles"></vue-radio-button><vue-radio-button label="Chicago"></vue-radio-button></vue-radio-group><div style="margin: 15px 0;"></div><vue-radio-group v-model="radio3" :disabled="true"><vue-radio-button label="New York"></vue-radio-button><vue-radio-button label="Washington"></vue-radio-button><vue-radio-button label="Los Angeles"></vue-radio-button><vue-radio-button label="Chicago"></vue-radio-button></vue-radio-group></div>',
            parameter: {
                data: function() {
                    return {
                        radio1: 'New York',
                        radio2: 'New York',
                        radio3: 'New York'
                    }
                }
            },
            code: '<vue-radio-group v-model="radio1" size="large" fill="#324057" text-color="#a4aebd">\n    <vue-radio-button label="New York"></vue-radio-button>\n    <vue-radio-button label="Washington"></vue-radio-button>\n    <vue-radio-button label="Los Angeles"></vue-radio-button>\n    <vue-radio-button label="Chicago"></vue-radio-button>\n</vue-radio-group>\n<vue-radio-group v-model="radio2">\n    <vue-radio-button label="New York"></vue-radio-button>\n    <vue-radio-button label="Washington" :disabled="true"></vue-radio-button>\n    <vue-radio-button label="Los Angeles"></vue-radio-button>\n    <vue-radio-button label="Chicago"></vue-radio-button>\n</vue-radio-group>\n<vue-radio-group v-model="radio3" :disabled="true">\n    <vue-radio-button label="New York"></vue-radio-button>\n    <vue-radio-button label="Washington"></vue-radio-button>\n    <vue-radio-button label="Los Angeles"></vue-radio-button>\n    <vue-radio-button label="Chicago"></vue-radio-button>\n</vue-radio-group>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                radio1: "New York",\n                radio2: "New York",\n                radio3: "New York",\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'radio5',
            label: 'Radio Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "label",
                        column2: "radioDemo.samples5.row1column2",
                        column3: "string,number,boolean",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "disabled",
                        column2: "radioDemo.samples5.row2column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "name",
                        column2: "radioDemo.samples5.row3column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'radio6',
            label: 'Radio-group Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "size",
                        column2: "radioDemo.samples6.row1column2",
                        column3: "string",
                        column4: "large, small, mini",
                        column5: "—"
                    },{
                        column1: "fill",
                        column2: "radioDemo.samples6.row2column2",
                        column3: "string",
                        column4: "—",
                        column5: "#20a0ff"
                    },{
                        column1: "text-color",
                        column2: "radioDemo.samples6.row3column2",
                        column3: "string",
                        column4: "—",
                        column5: "#ffffff"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'radio7',
            label: 'Radio-group Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "change",
                        column2: "radioDemo.samples7.row1column2",
                        column3: "radioDemo.samples7.row1column3"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'radio8',
            label: 'Radio-button Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "label",
                        column2: "radioDemo.samples8.row1column2",
                        column3: "string, number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "disabled",
                        column2: "radioDemo.samples8.row2column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return radioDemo;
});