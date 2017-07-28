!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(['Vue'], definition);
    } else {
        context[name] = definition(context['Vue']);
    }
})("InstallDemo", this, function(Vue) {
    'use strict';
    var installDemo = {
        path: '/install',
        name: 'install',
        head: {
            label: 'install.label',
            description: ''
        },
        samples: [{
            id: 'install1',
            label: 'install.samples1.label',
            description: 'install.samples1.description',
            collapse: ["item1"],
            notshowblock: true,
            code: '<!-- import css -->\n'+
            '<link rel="stylesheet" href="./css/component.min.css">\n'+
            '<!-- import Vue -->\n'+
            '<script src="./js/vue-all.min.js"></script>\n'+
            '<!-- import component -->\n'+
            '<script src="./js/vue-component-all.min.js"></script>\n'
        },{
            id: 'install2',
            label: 'Hello world',
            description: 'install.samples2.description',
            collapse:  ["item1"],
            notshowblock: true,
            code: '<!DOCTYPE html>\n'+
            '<html>\n'+
            '<head>\n'+
            '    <meta charset="UTF-8">\n'+
            '    <!-- import css -->\n'+
            '    <link rel="stylesheet" href="./css/component.min.css">\n'+
            '</head>\n'+
            '<body>\n'+
            '    <div id="app">\n'+
            '        <vue-button @click="visible = true">OK</vue-button>\n'+
            '        <vue-dialog v-model="visible" title="Hello world" show-close>\n'+
            '            <p>Welcome</p>\n'+
            '        </vue-dialog>\n'+
            '    </div>\n'+
            '</body>\n'+
            '<!-- import Vue -->\n'+
            '<script src="./js/vue-all.min.js"></script>\n'+
            '<!-- import component -->\n'+
            '<script src="./js/vue-component-all.min.js"></script>\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return { visible: false }\n'+
            '        }\n'+
            '    }).$mount("#app");\n'+
            '</script>\n'+
            '</html>'
        }, {
            id: 'install3',
            label: 'VueUtil',
            description: 'install.samples3.description',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.usage\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: ".on(element, events, handler)",
                        column2: "install.samples3.row1column2",
                        column3: "VueUtil.on(element,'click', fn)"
                    },{
                        column1: ".off(element, events, handler)",
                        column2: "install.samples3.row2column2",
                        column3: "VueUtil.off(element,'click', fn)"
                    },{
                        column1: ".once(element, events, handler)",
                        column2: "install.samples3.row3column2",
                        column3: "VueUtil.once(element,'click', fn)"
                    },{
                        column1: ".hasClass(element, className)",
                        column2: "install.samples3.row4column2",
                        column3: "VueUtil.hasClass(element, 'vue-class')"
                    },{
                        column1: ".addClass(element, className)",
                        column2: "install.samples3.row5column2",
                        column3: "VueUtil.addClass(element, 'vue-class')"
                    },{
                        column1: ".removeClass(element, className)",
                        column2: "install.samples3.row6column2",
                        column3: "VueUtil.removeClass(element, 'vue-class')"
                    },{
                        column1: ".getStyle(element, styleName)",
                        column2: "install.samples3.row7column2",
                        column3: "VueUtil.getStyle(element, 'display')"
                    },{
                        column1: ".setStyle(element, styleName, value)",
                        column2: "install.samples3.row8column2",
                        column3: "VueUtil.setStyle(element, 'display', 'none')"
                    },{
                        column1: ".merge(dest,src1,src2,src3...)",
                        column2: "install.samples3.row9column2",
                        column3: "VueUtil.merge({}, {name:'Tom',age:21},{name:'Jerry',sex:'Boy'}) //result={name:'Jerry',age:21,sex:'Boy'}"
                    },{
                        column1: ".addResizeListener(element, fn)",
                        column2: "install.samples3.row10column2",
                        column3: "VueUtil.addResizeListener(element, fn)"
                    },{
                        column1: ".removeResizeListener(element, fn)",
                        column2: "install.samples3.row11column2",
                        column3: "VueUtil.removeResizeListener(element, fn)"
                    },{
                        column1: ".parseDate(string, format)",
                        column2: "install.samples3.row12column2",
                        column3: "VueUtil.parseDate('31/01/2017', 'dd/MM/yyyy')"
                    },{
                        column1: ".formatDate(date, format)",
                        column2: "install.samples3.row13column2",
                        column3: "VueUtil.formatDate(new Date, 'dd/MM/yyyy')"
                    },{
                        column1: ".isDate(src)",
                        column2: "install.samples3.row14column2",
                        column3: "VueUtil.isDate('2017-01-01')"
                    },{
                        column1: ".toDate(src)",
                        column2: "install.samples3.row15column2",
                        column3: "VueUtil.toDate('2017-01-01')"
                    },{
                        column1: ".setLang(lang)",
                        column2: "install.samples3.row16column2",
                        column3: "VueUtil.setLang('zh')"
                    },{
                        column1: ".setLocale(lang)",
                        column2: "install.samples3.row17column2",
                        column3: "VueUtil.setLocale('en', {label1: \'English\'})"
                    },{
                        column1: ".removeNode(node)",
                        column2: "install.samples3.row18column2",
                        column3: "VueUtil.removeNode(element)"
                    },{
                        column1: ".insertNodeAt(fatherNode, node, position)",
                        column2: "install.samples3.row19column2",
                        column3: "VueUtil.insertNodeAt(body,element,3)"
                    },{
                        column1: ".arrayToObject(arr)",
                        column2: "install.samples3.row20column2",
                        column3: "VueUtil.arrayToObject([{name:'Tom',age:21},{name:'Jerry',sex:'Boy'}])"
                    },{
                        column1: ".screenfull()",
                        column2: "install.samples3.row21column2",
                        column3: "VueUtil.screenfull()"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return installDemo;
});
