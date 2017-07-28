!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("ButtonDemo", this, function() {
    'use strict';
    var buttonDemo = {
        path: '/button',
        name: 'button',
        head: {
            label: 'buttonDemo.label',
            description: 'buttonDemo.description'
        },
        samples: [{
            label: 'buttonDemo.samples1.label',
            description: 'buttonDemo.samples1.description',
            template: '<div class="source"><vue-button>{{$t("buttonDemo.defaultButton")}}</vue-button><vue-button type="primary">{{$t("buttonDemo.mainButton")}}</vue-button><vue-button type="text">{{$t("buttonDemo.textButton")}}</vue-button><vue-button circle>{{$t("buttonDemo.circleButton")}}</vue-button></div>',
            code: '<vue-button>{{$t("buttonDemo.defaultButton")}}</vue-button>\n<vue-button type="primary">{{$t("buttonDemo.mainButton")}}</vue-button>\n<vue-button type="text">{{$t("buttonDemo.textButton")}}</vue-button>\n<vue-button circle>{{$t("buttonDemo.circleButton")}}</vue-button>',
            id: 'button1'
        }, {
            label: 'buttonDemo.samples2.label',
            description: 'buttonDemo.samples2.description',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t("buttonDemo.samples2.defaultLabel")}}</span></vue-col><vue-col :span="16"><vue-button type="success">{{$t("buttonDemo.successButton")}}</vue-button><vue-button type="warning">{{$t("buttonDemo.warningButton")}}</vue-button><vue-button type="danger">{{$t("buttonDemo.dangerButton")}}</vue-button><vue-button type="info">{{$t("buttonDemo.infoButton")}}</vue-button></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t("buttonDemo.samples2.hoverLabel")}}</span></vue-col><vue-col :span="16"><vue-button :plain="true" type="success">{{$t("buttonDemo.successButton")}}</vue-button><vue-button :plain="true" type="warning">{{$t("buttonDemo.warningButton")}}</vue-button><vue-button :plain="true" type="danger">{{$t("buttonDemo.dangerButton")}}</vue-button><vue-button :plain="true" type="info">{{$t("buttonDemo.infoButton")}}</vue-button></vue-col></vue-row></div>',
            code: '<span class="demonstration">{{$t("buttonDemo.samples2.defaultLabel")}}</span>\n<vue-button type="success">{{$t("buttonDemo.successButton")}}</vue-button>\n<vue-button type="warning">{{$t("buttonDemo.warningButton")}}</vue-button>\n<vue-button type="danger">{{$t("buttonDemo.dangerButton")}}</vue-button>\n<vue-button type="info">{{$t("buttonDemo.infoButton")}}</vue-button>\n<span class="demonstration">{{$t("buttonDemo.samples2.hoverLabel")}}</span>\n<vue-button :plain="true" type="success">{{$t("buttonDemo.successButton")}}</vue-button>\n<vue-button :plain="true" type="warning">{{$t("buttonDemo.warningButton")}}</vue-button>\n<vue-button :plain="true" type="danger">{{$t("buttonDemo.dangerButton")}}</vue-button>\n<vue-button :plain="true" type="info">{{$t("buttonDemo.infoButton")}}</vue-button>',
            id: 'button2'
        }, {
            label: 'buttonDemo.samples3.label',
            description: 'buttonDemo.samples3.description',
            template: '<div class="source"><vue-button :plain="true" :disabled="true">{{$t("buttonDemo.defaultButton")}}</vue-button><vue-button type="primary" :disabled="true">{{$t("buttonDemo.mainButton")}}</vue-button><vue-button type="text" :disabled="true">{{$t("buttonDemo.textButton")}}</vue-button></div>',
            code: '<vue-button :plain="true" :disabled="true">{{$t("buttonDemo.defaultButton")}}</vue-button>\n<vue-button type="primary" :disabled="true">{{$t("buttonDemo.mainButton")}}</vue-button>\n<vue-button type="text" :disabled="true">{{$t("buttonDemo.textButton")}}</vue-button>',
            id: 'button3'
        }, {
            label: 'buttonDemo.samples4.label',
            description: 'buttonDemo.samples3.description',
            template: '<div class="source"><vue-button type="primary" icon="vue-icon-edit"></vue-button><vue-button type="primary" icon="vue-icon-share" circle></vue-button><vue-button type="primary" icon="vue-icon-delete"></vue-button><vue-button type="primary" icon="vue-icon-search">Search</vue-button><vue-button type="primary">Upload<i class="vue-icon-upload vue-icon--right"></i></vue-button></div>',
            code: '<vue-button type="primary" icon="vue-icon-edit"></vue-button>\n<vue-button type="primary" icon="vue-icon-share" circle></vue-button>\n<vue-button type="primary" icon="vue-icon-delete"></vue-button>\n<vue-button type="primary" icon="vue-icon-search">Search</vue-button>\n<vue-button type="primary">Upload<i class="vue-icon-upload vue-icon--right"></i></vue-button>',
            id: 'button4'
        }, {
            label: 'buttonDemo.samples5.label',
            description: 'buttonDemo.samples5.description',
            template: '<div class="source"><vue-row><vue-col :span="8"><vue-button-group><vue-button type="primary" icon="vue-icon-arrow-left">Page up</vue-button><vue-button type="primary">Page down<i class="vue-icon-arrow-right vue-icon--right"></i></vue-button></vue-button-group></vue-col><vue-col :span="8"><vue-button-group><vue-button type="primary" icon="vue-icon-edit"></vue-button><vue-button type="primary" icon="vue-icon-share"></vue-button><vue-button type="primary" icon="vue-icon-delete"></vue-button></vue-button-group></vue-col></vue-row></div>',
            code: '<vue-button-group>\n    <vue-button type="primary" icon="vue-icon-arrow-left">Page up</vue-button>\n    <vue-button type="primary">Page down<i class="vue-icon-arrow-right vue-icon--right"></i></vue-button>\n</vue-button-group>\n<vue-button-group>\n    <vue-button type="primary" icon="vue-icon-edit"></vue-button>\n    <vue-button type="primary" icon="vue-icon-share"></vue-button>\n    <vue-button type="primary" icon="vue-icon-delete"></vue-button>\n</vue-button-group>',
            id: 'button5'
        }, {
            label: 'buttonDemo.samples6.label',
            description: 'buttonDemo.samples6.description',
            template: '<div class="source"><vue-button type="primary" :loading="true">Loading</vue-button></div>',
            code: '<vue-button type="primary" :loading="true">Loading</vue-button>',
            id: 'button6'
        }, {
            label: 'buttonDemo.samples7.label',
            description: 'buttonDemo.samples7.description',
            template: '<div class="source"><vue-button type="primary" size="large">Large Button</vue-button><vue-button type="primary">Normal Button</vue-button><vue-button type="primary" size="small">Small Button</vue-button><vue-button type="primary" size="mini">Mini Button</vue-button></div>',
            code: '<vue-button type="primary" size="large">Large Button</vue-button>\n<vue-button type="primary">Normal Button</vue-button>\n<vue-button type="primary" size="small">Small Button</vue-button>\n<vue-button type="primary" size="mini">Mini Button</vue-button>',
            id: 'button7'
        }, {
            id: 'button8',
            label: 'Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "size",
                        column2: "buttonDemo.samples8.row1column2",
                        column3: "string",
                        column4: "large,small,mini",
                        column5: "—"
                    },{
                        column1: "type",
                        column2: "buttonDemo.samples8.row2column2",
                        column3: "string",
                        column4: "primary,success,warning,danger,info,text",
                        column5: "—"
                    },{
                        column1: "circle",
                        column2: "buttonDemo.samples8.row3column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "plain",
                        column2: "buttonDemo.samples8.row4column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "loading",
                        column2: "buttonDemo.samples8.row5column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "disabled",
                        column2: "buttonDemo.samples8.row6column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "icon",
                        column2: "buttonDemo.samples8.row7column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "autofocus",
                        column2: "buttonDemo.samples8.row8column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "native-type",
                        column2: "buttonDemo.samples8.row9column2",
                        column3: "string",
                        column4: "button,submit,reset",
                        column5: "button"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return buttonDemo;
});