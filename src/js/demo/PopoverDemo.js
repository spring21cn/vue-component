!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("PopoverDemo", this, function(DemoUtil) {
    'use strict';
    var popoverDemo = {
        path: '/popover',
        name: 'popover',
        head: {
            label: 'Popover 弹出框',
            description: '用于展示小段信息。'
        },
        samples: [{
            id: 'popover1',
            label: '基础用法',
            description: '用法通过 slot 指定 reference。',
            template: '<div class="source"><vue-row><vue-col :span="4"><vue-popover ref="popover1" placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容。"></vue-popover><vue-popover ref="popover2" placement="bottom" title="标题" width="200" trigger="click" content="这是一段内容。"></vue-popover><vue-button v-popover:popover1>hover 激活</vue-button></vue-col><vue-col :span="4"><vue-button v-popover:popover2>click 激活</vue-button></vue-col><vue-col :span="4"><vue-popover placement="right" title="标题" width="200" trigger="focus" content="这是一段内容。"><vue-input slot="reference" placeholder="focus 激活"></vue-input></vue-popover></vue-col></vue-row></div>',
            code: '<vue-popover ref="popover1" placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容。"></vue-popover>\n'+
            '<vue-popover ref="popover2" placement="bottom" title="标题" width="200" trigger="click" content="这是一段内容。"></vue-popover>\n'+
            '<vue-button v-popover:popover1>hover 激活</vue-button>\n'+
            '<vue-button v-popover:popover2>click 激活</vue-button>\n'+
            '<vue-popover placement="right" title="标题" width="200" trigger="focus" content="这是一段内容。">\n'+
            '    <vue-input slot="reference" placeholder="focus 激活"></vue-input>\n'+
            '</vue-popover>'
        }]
    };
    return popoverDemo;
});

