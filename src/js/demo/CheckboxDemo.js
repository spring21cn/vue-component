!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("CheckboxDemo", this, function() {
    'use strict';
    var checkboxDemo = {
        path: '/checkbox',
        name: 'checkbox',
        head: {
            label: 'checkboxDemo.label',
            description: 'checkboxDemo.description'
        },
        samples: [{
            id: 'checkbox1',
            label: 'checkboxDemo.samples1.label',
            description: 'checkboxDemo.samples1.description',
            template: '<div class="source"><vue-checkbox v-model="checked">Option</vue-checkbox></div>',
            parameter: {
                data: function() {
                    return {
                        checked: true
                    }
                }
            },
            code: '<vue-checkbox v-model="checked">Option</vue-checkbox>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                checked: true\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'checkbox2',
            label: 'checkboxDemo.samples2.label',
            description: 'checkboxDemo.samples2.description',
            template: '<div class="source"><vue-checkbox v-model="checked1" disabled>Option</vue-checkbox><vue-checkbox v-model="checked2" disabled>Option</vue-checkbox></div>',
            parameter: {
                data: function() {
                    return {
                        checked1: false,
                        checked2: true
                    }
                }
            },
            code: '<vue-checkbox v-model="checked1" disabled>Option</vue-checkbox>\n<vue-checkbox v-model="checked2" disabled>Option</vue-checkbox>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                checked1: false,\n                checked2: true\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'checkbox3',
            label: 'checkboxDemo.samples3.label',
            description: 'checkboxDemo.samples3.description',
            template: '<div class="source"><vue-checkbox-group v-model="checkList"><vue-checkbox label="Option A"></vue-checkbox><vue-checkbox label="Option B"></vue-checkbox><vue-checkbox label="Option C"></vue-checkbox><vue-checkbox label="Disabled" disabled></vue-checkbox><vue-checkbox label="Selected and Disabled" disabled></vue-checkbox></vue-checkbox-group></div>',
            parameter: {
                data: function() {
                    return {
                        checkList: ["Selected and Disabled", "Option A"]
                    }
                }
            },
            code: '<vue-checkbox-group v-model="checkList">\n    <vue-checkbox label="Option A"></vue-checkbox>\n    <vue-checkbox label="Option B"></vue-checkbox>\n    <vue-checkbox label="Option C"></vue-checkbox>\n    <vue-checkbox label="Disabled" disabled></vue-checkbox>\n    <vue-checkbox label="Selected and Disabled" disabled></vue-checkbox>\n</vue-checkbox-group>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                checkList: ["Selected and Disabled","Option A"]\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'checkbox4',
            label: 'checkboxDemo.samples4.label',
            description: 'checkboxDemo.samples4.description',
            template: '<div class="source"><vue-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Check All</vue-checkbox><div style="margin: 15px 0;"></div><vue-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange"><vue-checkbox v-for="city in cities" :key="city" :label="city">{{city}}</vue-checkbox></vue-checkbox-group></div>',
            parameter: {
                data: function() {
                    return {
                        checkAll: true,
                        checkedCities: ['New York', 'Chicago'],
                        cities: ['New York', 'Chicago', 'Los Angeles', 'Washington'],
                        isIndeterminate: true
                    }
                },
                methods: {
                    handleCheckAllChange: function(event) {
                        this.checkedCities = event.target.checked ? ['New York', 'Chicago', 'Los Angeles', 'Washington'] : [];
                        this.isIndeterminate = false;
                    },
                    handleCheckedCitiesChange: function(value) {
                        var checkedCount = value.length;
                        this.checkAll = checkedCount === this.cities.length;
                        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
                    }
                }
            },
            code: '<vue-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Check All</vue-checkbox>\n<vue-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">\n    <vue-checkbox v-for="city in cities" :key="city" :label="city">{{city}}</vue-checkbox>\n</vue-checkbox-group>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                checkAll: true,\n                checkedCities: [\'New York\', \'Chicago\'],\n                cities: [\'New York\', \'Chicago\', \'Los Angeles\', \'Washington\'],\n                isIndeterminate: true\n            }\n        },\n        methods: {\n            handleCheckAllChange: function(event) {\n                this.checkedCities = event.target.checked ? [\'New York\', \'Chicago\', \'Los Angeles\', \'Washington\'] : [];\n                this.isIndeterminate = false;\n            },\n            handleCheckedCitiesChange: function(value) {\n                var checkedCount = value.length;\n                this.checkAll = checkedCount === this.cities.length;\n                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'checkbox5',
            label: 'checkboxDemo.samples5.label',
            description: 'checkboxDemo.samples5.description',
            template: '<div class="source"><vue-checkbox-group v-model="checkboxGroup1" size="large" fill="#324057" text-color="#a4aebd" :min="1" :max="3"><vue-checkbox-button label="New York"></vue-checkbox-button><vue-checkbox-button label="Chicago"></vue-checkbox-button><vue-checkbox-button label="Los Angeles"></vue-checkbox-button><vue-checkbox-button label="Washington"></vue-checkbox-button></vue-checkbox-group><div style="margin: 15px 0;"></div><vue-checkbox-group v-model="checkboxGroup2"><vue-checkbox-button label="New York"></vue-checkbox-button><vue-checkbox-button label="Chicago" :disabled="true"></vue-checkbox-button><vue-checkbox-button label="Los Angeles"></vue-checkbox-button><vue-checkbox-button label="Washington"></vue-checkbox-button></vue-checkbox-group><div style="margin: 15px 0;"></div><vue-checkbox-group v-model="checkboxGroup3" :disabled="true"><vue-checkbox-button label="New York"></vue-checkbox-button><vue-checkbox-button label="Chicago"></vue-checkbox-button><vue-checkbox-button label="Los Angeles"></vue-checkbox-button><vue-checkbox-button label="Washington"></vue-checkbox-button></vue-checkbox-group></div>',
            parameter: {
                data: function() {
                    return {
                        checkboxGroup1: ['New York'],
                        checkboxGroup2: ['Washington'],
                        checkboxGroup3: ['Los Angeles']
                    }
                }
            },
            code: '<vue-checkbox-group v-model="checkboxGroup1" size="large" fill="#324057" text-color="#a4aebd" :min="1" :max="3">\n    <vue-checkbox-button label="New York"></vue-checkbox-button>\n    <vue-checkbox-button label="Chicago"></vue-checkbox-button>\n    <vue-checkbox-button label="Los Angeles"></vue-checkbox-button>\n    <vue-checkbox-button label="Washington"></vue-checkbox-button>\n</vue-checkbox-group>\n<vue-checkbox-group v-model="checkboxGroup2">\n    <vue-checkbox-button label="New York"></vue-checkbox-button>\n    <vue-checkbox-button label="Chicago" :disabled="true"></vue-checkbox-button>\n    <vue-checkbox-button label="Los Angeles"></vue-checkbox-button>\n    <vue-checkbox-button label="Washington"></vue-checkbox-button>\n</vue-checkbox-group>\n<vue-checkbox-group v-model="checkboxGroup3" :disabled="true">\n    <vue-checkbox-button label="New York"></vue-checkbox-button>\n    <vue-checkbox-button label="Chicago"></vue-checkbox-button>\n    <vue-checkbox-button label="Los Angeles"></vue-checkbox-button>\n    <vue-checkbox-button label="Washington"></vue-checkbox-button>\n</vue-checkbox-group>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                checkboxGroup1: ["New York"],\n                checkboxGroup2: ["Washington"],\n                checkboxGroup3: ["Los Angeles"]\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'checkbox6',
            label: 'Checkbox Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "label",
                        column2: "checkboxDemo.samples6.row1column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "true-label",
                        column2: "checkboxDemo.samples6.row2column2",
                        column3: "string, number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "false-label",
                        column2: "checkboxDemo.samples6.row3column2",
                        column3: "string, number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "name",
                        column2: "checkboxDemo.samples6.row4column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "disabled",
                        column2: "checkboxDemo.samples6.row5column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "checked",
                        column2: "checkboxDemo.samples6.row6column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "indeterminate",
                        column2: "checkboxDemo.samples6.row7column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'checkbox7',
            label: 'Checkbox-group Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "size",
                        column2: "checkboxDemo.samples7.row1column2",
                        column3: "string",
                        column4: "large, small, mini",
                        column5: "—"
                    },{
                        column1: "fill",
                        column2: "checkboxDemo.samples7.row2column2",
                        column3: "string",
                        column4: "—",
                        column5: "#20a0ff"
                    },{
                        column1: "text-color",
                        column2: "checkboxDemo.samples7.row3column2",
                        column3: "string",
                        column4: "—",
                        column5: "#ffffff"
                    },{
                        column1: "min",
                        column2: "checkboxDemo.samples7.row4column2",
                        column3: "number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "max",
                        column2: "checkboxDemo.samples7.row5column2",
                        column3: "number",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'checkbox8',
            label: 'Checkbox Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "change",
                        column2: "checkboxDemo.samples8.row1column2",
                        column3: "Event object"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return checkboxDemo;
});