!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("DropdownDemo", this, function() {
    'use strict';
    var dropdownDemo = {
        path: '/dropdown',
        name: 'dropdown',
        head: {
            label: 'Dropdown 下拉菜单',
            description: '将动作或菜单折叠到下拉菜单中。'
        },
        samples: [{
            id: 'dropdown1',
            label: '基础用法',
            description: '通过组件slot来设置下拉触发的元素以及需要通过具名slot为dropdown 来设置下拉菜单。默认情况下，下拉按钮只要hover即可，无需点击也会显示下拉菜单。',
            template: '<div class="source"><vue-row><vue-col :span="6"><vue-dropdown><vue-button type="primary">下拉菜单<i class="vue-icon-caret-bottom vue-icon--right"></i></vue-button><vue-dropdown-menu slot="dropdown"><vue-dropdown-item>YAMAHA</vue-dropdown-item><vue-dropdown-item disabled>HONDA</vue-dropdown-item><vue-dropdown-item divided>TOYOTA</vue-dropdown-item></vue-dropdown-menu></vue-dropdown></vue-col><vue-col :span="6"><vue-dropdown split-button type="primary" @click="handleClick">更多菜单<vue-dropdown-menu slot="dropdown"><vue-dropdown-item>YAMAHA</vue-dropdown-item><vue-dropdown-item>HONDA</vue-dropdown-item><vue-dropdown-item>TOYOTA</vue-dropdown-item></vue-dropdown-menu></vue-dropdown></vue-col></vue-row></div>',
            parameter: {
                methods: {
                  handleClick: function() {
                    this.$alert("button click");
                  }
                }
            },
            code: '<vue-dropdown>\n'+
            '    <vue-button type="primary">\n'+
            '        下拉菜单<i class="vue-icon-caret-bottom vue-icon--right"></i>\n'+
            '    </vue-button>\n'+
            '    <vue-dropdown-menu slot="dropdown">\n'+
            '        <vue-dropdown-item>YAMAHA</vue-dropdown-item>\n'+
            '        <vue-dropdown-item disabled>HONDA</vue-dropdown-item>\n'+
            '        <vue-dropdown-item divided>TOYOTA</vue-dropdown-item>\n'+
            '    </vue-dropdown-menu>\n'+
            '</vue-dropdown>\n\n'+
            '<vue-dropdown split-button type="primary" @click="handleClick">\n'+
            '    更多菜单\n'+
            '    <vue-dropdown-menu slot="dropdown">\n'+
            '        <vue-dropdown-item>YAMAHA</vue-dropdown-item>\n'+
            '        <vue-dropdown-item>HONDA</vue-dropdown-item>\n'+
            '        <vue-dropdown-item>TOYOTA</vue-dropdown-item>\n'+
            '    </vue-dropdown-menu>\n'+
            '</vue-dropdown>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            handleClick: function() {\n'+
            '                this.$alert("button click");\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return dropdownDemo;
});

