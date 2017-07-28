!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("InputDemo", this, function() {
    'use strict';
    var inputDemo = {
        path: '/input',
        name: 'input',
        head: {
            label: 'inputDemo.label',
            description: 'inputDemo.description'
        },
        samples: [{
            id: 'input1',
            label: 'inputDemo.samples1.label',
            description: '',
            template: '<div class="source"><vue-input v-model="input" :placeholder="$t(\'inputDemo.defaultPlaceholder\')"></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        input: ''
                    }
                }
            },
            code: '<vue-input v-model="input" :placeholder="$t(\'inputDemo.defaultPlaceholder\')"></vue-input>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                input: ""\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input9',
            label: 'inputDemo.samples9.label',
            description: 'inputDemo.samples9.description',
            template: '<div class="source"><vue-input v-model="input" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" :cleave="{delimiter: \'-\', blocks: [4, 3, 3, 4], uppercase: true}"></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        input: ''
                    }
                }
            },
            code: '<vue-input v-model="input" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" :cleave="{delimiter: \'-\', blocks: [4, 3, 3, 4], uppercase: true}">\n</vue-input>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                input: ""\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input2',
            label: 'inputDemo.samples2.label',
            description: 'inputDemo.samples2.description',
            template: '<div class="source"><vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input" :disabled="true"></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        input: ''
                    }
                }
            },
            code: '<vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input" :disabled="true"></vue-input>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                input: ""\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input3',
            label: 'inputDemo.samples3.label',
            description: 'inputDemo.samples3.description',
            template: '<div class="source"><vue-input :placeholder="$t(\'inputDemo.selectPlaceholder\')" icon="vue-icon-search" v-model="input" :on-icon-click="handleIconClick"></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        input: ""
                    }
                },
                methods: {
                    handleIconClick: function(ev) {
                        this.$alert(this.$t('inputDemo.selectPlaceholder'));
                    }
                }
            },
            code: '<vue-input :placeholder="$t(\'inputDemo.selectPlaceholder\')" icon="vue-icon-search" v-model="input" :on-icon-click="handleIconClick"></vue-input>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                input: "",\n            }\n        }\n        methods: {\n            handleIconClick: function(event) {\n                this.$alert(this.$t(\'inputDemo.selectPlaceholder\'));\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input4',
            label: 'inputDemo.samples4.label',
            description: 'inputDemo.samples4.description',
            template: '<div class="source"><vue-input type="textarea" :rows="2" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="textarea"></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        textarea: ''
                    }
                }
            },
            code: '<vue-input type="textarea" :rows="2" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="textarea"></vue-input>\n\n<script>\n  new Vue({\n    data: function(){\n      return {\n        textarea: ""\n      }\n    }\n  }).$mount();\n</script>'
        }, {
            id: 'input5',
            label: 'inputDemo.samples5.label',
            description: 'inputDemo.samples5.description',
            template: '<div class="source"><vue-input type="textarea" autosize :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="textarea1"></vue-input><div style="margin: 20px 0;"></div><vue-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="textarea2"></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        textarea1: '',
                        textarea2: ''
                    }
                }
            },
            code: '<vue-input type="textarea" autosize :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="textarea1"></vue-input>\n<vue-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="textarea2"></vue-input>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                textarea1: "",\n                textarea2: ""\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input6',
            label: 'inputDemo.samples6.label',
            description: 'inputDemo.samples6.description',
            template: '<div class="source"><vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input1"><template slot="prepend">Http://</template></vue-input><div style="margin-top: 15px;"></div><vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input2"><template slot="append">.com</template></vue-input><div style="margin-top: 15px;"></div><vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input3"><vue-select v-model="select" slot="prepend" :placeholder="$t(\'inputDemo.selectPlaceholder\')" style="width:120px"><vue-option :label="$t(\'inputDemo.samples6.selectLabel1\')" value="1"></vue-option><vue-option :label="$t(\'inputDemo.samples6.selectLabel2\')" value="2"></vue-option><vue-option :label="$t(\'inputDemo.samples6.selectLabel3\')" value="3"></vue-option></vue-select><vue-button slot="append" icon="vue-icon-search"></vue-button></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        input1: '',
                        input2: '',
                        input3: '',
                        select: ''
                    }
                }
            },
            code: '<vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input1">\n    <template slot="prepend">Http://</template>\n</vue-input>\n<vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input2">\n    <template slot="append">.com</template>\n</vue-input>\n<vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input3">\n    <vue-select v-model="select" slot="prepend" :placeholder="$t(\'inputDemo.selectPlaceholder\')" style="width:120px">\n        <vue-option :label="$t(\'inputDemo.samples6.selectLabel1\')" value="1"></vue-option>\n        <vue-option :label="$t(\'inputDemo.samples6.selectLabel2\')" value="2"></vue-option>\n        <vue-option :label="$t(\'inputDemo.samples6.selectLabel3\')" value="3"></vue-option>\n    </vue-select>\n    <vue-button slot="append" icon="vue-icon-search"></vue-button>\n</vue-input>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                input1: "",\n                input2: "",\n                input3: "",\n                select: ""\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input7',
            label: 'inputDemo.samples7.label',
            description: 'inputDemo.samples7.description',
            template: '<div class="source"><vue-input size="large" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input1"></vue-input><div style="margin-top: 15px;"></div><vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input2"></vue-input><div style="margin-top: 15px;"></div><vue-input size="small" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input3"></vue-input><div style="margin-top: 15px;"></div><vue-input size="mini" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input4"></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        input1: '',
                        input2: '',
                        input3: '',
                        input4: ''
                    }
                }
            },
            code: '<vue-input size="large" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input1"></vue-input>\n<vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input2"></vue-input>\n<vue-input size="small" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input3"></vue-input>\n<vue-input size="mini" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input4"></vue-input>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                input1: "",\n                input2: "",\n                input3: "",\n                input4: ""\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input8',
            label: 'inputDemo.samples8.label',
            description: 'inputDemo.samples8.description',
            template: '<div class="source"><vue-row class="demo-autocomplete"><vue-col :span="12"><div class="sub-title">{{$t(\'inputDemo.samples8.label1\')}}</div><vue-autocomplete v-model="state1" :fetch-suggestions="querySearch" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" @select="handleSelect"></vue-autocomplete></vue-col><vue-col :span="12"><div class="sub-title">{{$t(\'inputDemo.samples8.label2\')}}</div><vue-autocomplete v-model="state2" :fetch-suggestions="querySearch" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" :trigger-on-focus="false" @select="handleSelect"></vue-autocomplete></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        restaurants: [],
                        state1: '',
                        state2: ''
                    }
                },
                methods: {
                    querySearch: function(queryString, cb) {
                        var restaurants = this.restaurants;
                        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                        cb(results);
                    },
                    createFilter: function(queryString) {
                        return function(restaurant) {
                            return ( restaurant.value.indexOf(queryString.toLowerCase()) === 0) ;
                        }
                        ;
                    },
                    handleSelect: function(item) {
                        this.$alert(item.value);
                    },
                    loadAll: function() {
                        return [{
                            "value": "first"
                        }, {
                            "value": "second"
                        }, {
                            "value": "first and second"
                        }]
                    }
                },
                mounted: function() {
                    this.restaurants = this.loadAll();
                }
            },
            code: '<vue-row class="demo-autocomplete">\n    <vue-col :span="12">\n        <div class="sub-title"{{$t(\'inputDemo.samples8.label1\')}}</div>\n        <vue-autocomplete v-model="state1"\n                        :fetch-suggestions="querySearch"\n                        :placeholder="$t(\'inputDemo.defaultPlaceholder\')"\n                        @select="handleSelect">\n        </vue-autocomplete>\n    </vue-col>\n    <vue-col :span="12">\n        <div class="sub-title">{{$t(\'inputDemo.samples8.label2\')}}</div>\n        <vue-autocomplete v-model="state2"\n                        :fetch-suggestions="querySearch"\n                        :placeholder="$t(\'inputDemo.defaultPlaceholder\')"\n                        :trigger-on-focus="false"\n                        @select="handleSelect">\n        </vue-autocomplete>\n    </vue-col>\n</vue-row>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                restaurants: [],\n                state1: "",\n                state2: ""\n            }\n        },\n        methods: {\n            querySearch: function(queryString, cb) {\n                var restaurants = this.restaurants;\n                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;\n                cb(results);\n            },\n            createFilter: function(queryString) {\n                return function(restaurant) {\n                    return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);\n                };\n            },\n            handleSelect: function(item) {\n                this.$alert(item.value);\n            },\n            loadAll: function() {\n                return [\n                    { "value": "first" },\n                    { "value": "second" },\n                    { "value": "first and second" }\n                ]\n            }\n        },\n        mounted: function() {\n            this.restaurants = this.loadAll();\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input10',
            label: 'Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="320"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "type",
                        column2: "inputDemo.samples10.row1column2",
                        column3: "string",
                        column4: "text,textarea",
                        column5: "text"
                    },{
                        column1: "value",
                        column2: "inputDemo.samples10.row2column2",
                        column3: "string, number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "maxlength",
                        column2: "inputDemo.samples10.row3column2",
                        column3: "number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "minlength",
                        column2: "inputDemo.samples10.row4column2",
                        column3: "number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "placeholder",
                        column2: "inputDemo.samples10.row5column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "disabled",
                        column2: "inputDemo.samples10.row6column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "size",
                        column2: "inputDemo.samples10.row7column2",
                        column3: "string",
                        column4: "large, small, mini",
                        column5: "—"
                    },{
                        column1: "icon",
                        column2: "inputDemo.samples10.row8column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "rows",
                        column2: "inputDemo.samples10.row9column2",
                        column3: "number",
                        column4: "—",
                        column5: "2"
                    },{
                        column1: "cleave",
                        column2: "inputDemo.samples10.row10column2",
                        column3: "object",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "autosize",
                        column2: "inputDemo.samples10.row11column2",
                        column3: "boolean/object",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "auto-complete",
                        column2: "inputDemo.samples10.row12column2",
                        column3: "string",
                        column4: "on, off",
                        column5: "off"
                    },{
                        column1: "name",
                        column2: "inputDemo.samples10.row13column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "readonly",
                        column2: "inputDemo.samples10.row14column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "max",
                        column2: "inputDemo.samples10.row15column2",
                        column3: "—",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "min",
                        column2: "inputDemo.samples10.row16column2",
                        column3: "—",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "step",
                        column2: "inputDemo.samples10.row17column2",
                        column3: "—",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "resize",
                        column2: "inputDemo.samples10.row18column2",
                        column3: "string",
                        column4: "none, both, horizontal, vertical",
                        column5: "—"
                    },{
                        column1: "autofocus",
                        column2: "inputDemo.samples10.row19column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "form",
                        column2: "inputDemo.samples10.row20column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "on-icon-click",
                        column2: "inputDemo.samples10.row21column2",
                        column3: "function",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'input11',
            label: 'Input Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "click",
                        column2: "inputDemo.samples11.row1column2",
                        column3: "(event: Event)"
                    },{
                        column1: "blur",
                        column2: "inputDemo.samples11.row2column2",
                        column3: "(event: Event)"
                    },{
                        column1: "focus",
                        column2: "inputDemo.samples11.row3column2",
                        column3: "(event: Event)"
                    },{
                        column1: "change",
                        column2: "inputDemo.samples11.row4column2",
                        column3: "(value: string | number)"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'input12',
            label: 'Autocomplete Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="250"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "placeholder",
                        column2: "inputDemo.samples12.row1column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "disabled",
                        column2: "inputDemo.samples12.row2column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "value",
                        column2: "inputDemo.samples12.row3column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "custom-item",
                        column2: "inputDemo.samples12.row4column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "fetch-suggestions",
                        column2: "inputDemo.samples12.row5column2",
                        column3: "Function(queryString, callback)",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "popper-class",
                        column2: "inputDemo.samples12.row6column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "trigger-on-focus",
                        column2: "inputDemo.samples12.row7column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "true"
                    },{
                        column1: "on-icon-click",
                        column2: "inputDemo.samples12.row8column2",
                        column3: "function",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "icon",
                        column2: "inputDemo.samples12.row9column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "props",
                        column2: "inputDemo.samples12.row10column2",
                        column3: "object",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'input13',
            label: 'Autocomplete props',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "value",
                        column2: "inputDemo.samples13.row1column2",
                        column3: "string",
                        column4: "—",
                        column5: "value"
                    },{
                        column1: "label",
                        column2: "inputDemo.samples13.row2column2",
                        column3: "string",
                        column4: "—",
                        column5: "value"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'input14',
            label: 'Autocomplete Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "select",
                        column2: "inputDemo.samples14.row1column2",
                        column3: "(selectItem: SelectItem)"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return inputDemo;
});