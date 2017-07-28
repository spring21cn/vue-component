!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(['VueUtil'], definition);
    } else {
        context[name] = definition(context["VueUtil"]);
    }
})("I18nDemo", this, function(VueUtil) {
    'use strict';
    var i18nDemo = {
        path: '/i18n',
        name: 'i18n',
        head: {
            label: 'i18n.label',
            description: ''
        },
        samples: [{
            id: 'i18n1',
            label: 'i18n.samples1.label',
            description: 'i18n.samples1.description',
            template: '<div class="source"><vue-row ><vue-col :span="6"><vue-button plain @click="clickHandle1">{{$t(\'button.label1\')}}</vue-button></vue-col><vue-col :span="6"><vue-button plain @click="clickHandle2">{{$t(\'button.label2\')}}</vue-button></vue-col></vue-row></div>',
            parameter: {
              mounted: function () {
                var locales = {
                        zh: {
                            button: {
                                label1: '中文',
                                label2: '日文',
                                label3: '英文'
                            }
                        },
                        ja: {
                            button: {
                                label1: '中国語',
                                label2: '日本語',
                                label3: '英語'
                            }
                        }
                    };
                VueUtil.setLocale('zh', locales.zh);
                VueUtil.setLocale('ja', locales.ja);
              },
                methods: {
                  clickHandle1: function () {
                      VueUtil.setLang('zh');
                  },
                  clickHandle2: function () {
                      VueUtil.setLang('ja');
                  }
                }
            },
            code: '<vue-button plain @click="clickHandle1">{{$t(\'button.label1\')}}</vue-button>\n'+
            '<vue-button plain @click="clickHandle2">{{$t(\'button.label2\')}}</vue-button>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        mounted: function() {\n'+
            '            var locales = {\n'+
            '                zh: {\n'+
            '                    button: {\n'+
            '                        label1: "中文",\n'+
            '                        label2: "日文"\n'+
            '                    }\n'+
            '                },\n'+
            '                ja: {\n'+
            '                    button: {\n'+
            '                        label1: "中国語",\n'+
            '                        label2: "日本語"\n'+
            '                    }\n'+
            '                }\n'+
            '            };\n'+
            '            VueUtil.setLocale("zh", locales.zh);\n'+
            '            VueUtil.setLocale("ja", locales.ja);\n'+
            '        },\n'+
            '        methods: {\n'+
            '            clickHandle1: function() {\n'+
            '                VueUtil.setLang("zh");\n'+
            '            },\n'+
            '            clickHandle2: function() {\n'+
            '                VueUtil.setLang("ja");\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return i18nDemo;
});

