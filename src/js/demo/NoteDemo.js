!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("NoteDemo", this, function() {
    'use strict';
    var noteDemo = {
        path: '/note',
        name: 'note',
        head: {
            label: 'Note 笔记',
            description: '用于页面中展示信息。'
        },
        samples: [{
            id: 'note1',
            label: '基础用法',
            description: '组件提供四种主题，由type属性指定，默认值为info。',
            template: '<div class="source"><vue-note title="成功提示的文案" type="success">文字说明...</vue-note><vue-note title="消息提示的文案">文字说明...</vue-note><vue-note title="警告提示的文案" type="warning">文字说明...</vue-note><vue-note title="错误提示的文案" type="error">文字说明...</vue-note><vue-note box title="成功提示的文案" type="success">文字说明...</vue-note><vue-note box title="消息提示的文案">文字说明...</vue-note><vue-note box title="警告提示的文案" type="warning">文字说明...</vue-note><vue-note box title="错误提示的文案" type="error">文字说明...</vue-note></div>',
            code: '<vue-note title="成功提示的文案" type="success" title="成功提示的文案">文字说明...</vue-note>\n<vue-note title="消息提示的文案">文字说明...</vue-note>\n<vue-note title="警告提示的文案" type="warning">文字说明...</vue-note>\n<vue-note title="错误提示的文案" type="error">文字说明...</vue-note>\n<vue-note box title="成功提示的文案" type="success">文字说明...</vue-note>\n<vue-note box title="消息提示的文案">文字说明...</vue-note>\n<vue-note box title="警告提示的文案" type="warning">文字说明...</vue-note>\n<vue-note box title="错误提示的文案" type="error">文字说明...</vue-note>'
        }]
    };
    return noteDemo;
});
