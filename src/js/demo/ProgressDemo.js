!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("ProgressDemo", this, function() {
    'use strict';
    var progressDemo = {
        path: '/progress',
        name: 'progress',
        head: {
            label: 'Progress 进度条',
            description: '用于展示操作进度，告知用户当前状态和预期。'
        },
        samples: [{
            id: 'progress1',
            label: '基础用法',
            description: '设置percentage属性即可，表示进度条对应的百分比, 可通过 stroke-width 属性更改进度条的高度，并可通过 text-inside 属性来将进度条描述置于进度条内部。可通过 type 属性来指定使用环形进度条，在环形进度条中，还可以通过 width 属性来设置其大小。',
            template: '<div class="source"><vue-row class="margin-bottom20"><vue-progress :percentage="0"></vue-progress></vue-row><vue-row class="margin-bottom20"><vue-progress :percentage="50" status="exception"></vue-progress></vue-row><vue-row class="margin-bottom20"><vue-progress :text-inside="true" :stroke-width="18" :percentage="70"></vue-progress></vue-row><vue-row><vue-progress type="circle" :percentage="100" status="success"></vue-progress></vue-row></div>',
            code: '<vue-progress :percentage="0"></vue-progress>\n'+
            '<vue-progress :percentage="50" status="exception"></vue-progress>\n'+
            '<vue-progress :text-inside="true" :stroke-width="18" :percentage="70"></vue-progress>\n'+
            '<vue-progress type="circle" :percentage="100" status="success"></vue-progress>\n'
        }]
    };
    return progressDemo;
});

