!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("CardDemo", this, function() {
    'use strict';
    var cardDemo = {
        path: '/card',
        name: 'card',
        head: {
            label: 'Card 卡片',
            description: '将信息聚合在卡片容器中展示。'
        },
        samples: [{
            id: 'card1',
            label: '基础用法',
            description: 'Card 组件包括header和body部分，header部分需要有显式具名 slot 分发，同时也是可选的。',
            template: '<div class="source"><vue-card class="box"><div slot="header" ><span style="line-height: 36px;">卡片名称</span><vue-button style="float: right;" type="primary">操作按钮</vue-button></div><div v-for="o in 4" :key="o">{{"列表内容 " + o }}</div></vue-card></div>',
            code: '<vue-card class="box">\n'+
            '    <div slot="header" >\n'+
            '        <span style="line-height: 36px;">卡片名称</span>\n'+
            '        <vue-button style="float: right;" type="primary">操作按钮</vue-button>\n'+
            '    </div>\n'+
            '    <div v-for="o in 4" :key="o">\n'+
            '        {{"列表内容 " + o }}\n'+
            '    </div>\n'+
            '</vue-card>'
        }]
    };
    return cardDemo;
});

