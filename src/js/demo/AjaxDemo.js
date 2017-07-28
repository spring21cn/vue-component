!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("AjaxDemo", this, function() {
    'use strict';
    var ajaxDemo = {
        path: '/ajax',
        name: 'ajax',
        head: {
            label: 'ajax.label',
            description: ''
        },
        samples: [{
            id: 'ajax1',
            label: 'ajax.samples1.label',
            description: 'ajax.samples1.description',
            collapse:  ["item1"],
            notshowblock: true,
            code: '//General Vue use http\n'+
            'Vue.http.get(\'/someUrl\', [options]).then(successCallback, errorCallback);\n'+
            'Vue.http.post(\'/someUrl\', [body], [options]).then(successCallback, errorCallback);\n\n'+
            '//Vue components use $http\n'+
            'this.$http.get(\'/someUrl\', [options]).then(successCallback, errorCallback);\n'+
            'this.$http.post(\'/someUrl\', [body], [options]).then(successCallback, errorCallback);'
        },{
            id: 'ajax2',
            label: 'ajax.samples2.label',
            description: 'ajax.samples2.description',
            collapse:  ["item1"],
            notshowblock: true,
            code: 'get(url, [options])\n'+
            'head(url, [options])\n'+
            'delete(url, [options])\n'+
            'jsonp(url, [options])\n'+
            'post(url, [body], [options])\n'+
            'put(url, [body], [options])\n'+
            'patch(url, [body], [options])'
        }, {
            id: 'ajax3',
            label: 'Options',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.description\')" header-align="left" width="320"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "url",
                        column2: "string",
                        column3: "ajax.samples3.row1column3"
                    },{
                        column1: "method",
                        column2: "string",
                        column3: "ajax.samples3.row2column3"
                    },{
                        column1: "body",
                        column2: "Object,FormDatastring",
                        column3: "request body"
                    },{
                        column1: "params",
                        column2: "Object",
                        column3: "ajax.samples3.row4column3"
                    },{
                        column1: "headers",
                        column2: "Object",
                        column3: "request header"
                    },{
                        column1: "timeout",
                        column2: "number",
                        column3: "ajax.samples3.row6column3"
                    },{
                        column1: "before",
                        column2: "function(request)",
                        column3: "ajax.samples3.row7column3"
                    },{
                        column1: "progress",
                        column2: "function(event)",
                        column3: "ajax.samples3.row8column3"
                    },{
                        column1: "credientials",
                        column2: "boolean",
                        column3: "ajax.samples3.row9column3"
                    },{
                        column1: "emulateHTTP",
                        column2: "boolean",
                        column3: "ajax.samples3.row10column3"
                    },{
                        column1: "emulateJSON",
                        column2: "boolean",
                        column3: "ajax.samples3.row11column3"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return ajaxDemo;
});
