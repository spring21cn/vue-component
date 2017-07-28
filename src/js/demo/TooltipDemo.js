!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("TooltipDemo", this, function() {
    'use strict';
    var tooltipDemo = {
        path: '/tooltip',
        name: 'tooltip',
        head: {
            label: 'Tooltip 文字提示',
            description: '常用于展示鼠标 hover 时的提示信息。'
        },
        samples: [{
            id: 'tooltip1',
            label: '基础用法',
            description: '使用content属性来决定hover时的提示信息。由placement属性决定展示效果：placement属性值为：方向-对齐位置；四个方向：top、left、right、bottom；三种对齐位置：start, end，默认为空。如placement="left-end"，则提示信息出现在目标元素的左侧，且提示信息的底部与目标元素的底部对齐。',
            template: '<div class="source"><div class="box"><div class="top"><vue-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start"><vue-button>上左</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top"><vue-button>上边</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end"><vue-button>上右</vue-button></vue-tooltip></div><div class="left"><vue-tooltip class="item" effect="dark" content="Left Top 提示文字" placement="left-start"><vue-button>左上</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Left Center 提示文字" placement="left"><vue-button>左边</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Left Bottom 提示文字" placement="left-end"><vue-button>左下</vue-button></vue-tooltip></div><div class="right"><vue-tooltip class="item" effect="dark" content="Right Top 提示文字" placement="right-start"><vue-button>右上</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Right Center 提示文字" placement="right"><vue-button>右边</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Right Bottom 提示文字" placement="right-end"><vue-button>右下</vue-button></vue-tooltip></div><div class="bottom"><vue-tooltip class="item" effect="dark" content="Bottom Left 提示文字" placement="bottom-start"><vue-button>下左</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Bottom Center 提示文字" placement="bottom"><vue-button>下边</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Bottom Right 提示文字" placement="bottom-end"><vue-button>下右</vue-button></vue-tooltip></div></div></div>',
            code: '<div class="box">\n'+
            '    <div class="top">\n'+
            '        <vue-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">\n'+
            '            <vue-button>上左</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top">\n'+
            '            <vue-button>上边</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">\n'+
            '            <vue-button>上右</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '    </div>\n'+
            '    <div class="left">\n'+
            '        <vue-tooltip class="item" effect="dark" content="Left Top 提示文字" placement="left-start">\n'+
            '            <vue-button>左上</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Left Center 提示文字" placement="left">\n'+
            '            <vue-button>左边</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Left Bottom 提示文字" placement="left-end">\n'+
            '            <vue-button>左下</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '    </div>\n'+
            '    <div class="right">\n'+
            '        <vue-tooltip class="item" effect="dark" content="Right Top 提示文字" placement="right-start">\n'+
            '            <vue-button>右上</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Right Center 提示文字" placement="right">\n'+
            '            <vue-button>右边</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Right Bottom 提示文字" placement="right-end">\n'+
            '            <vue-button>右下</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '    </div>\n'+
            '    <div class="bottom">\n'+
            '        <vue-tooltip class="item" effect="dark" content="Bottom Left 提示文字" placement="bottom-start">\n'+
            '            <vue-button>下左</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Bottom Center 提示文字" placement="bottom">\n'+
            '            <vue-button>下边</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Bottom Right 提示文字" placement="bottom-end">\n'+
            '            <vue-button>下右</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '    </div>\n'+
            '</div>'
        }]
    };
    return tooltipDemo;
});

