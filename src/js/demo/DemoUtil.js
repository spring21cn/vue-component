!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(['Vue', 'VueComponentRegistry'], definition);
    } else {
        context[name] = definition(context['Vue']);
    }
})("DemoUtil", this, function(Vue) {
    'use strict';
    var componentToDom = function(elementId, template, parameter) {
        if (typeof template === 'undefined') return;
        var vueParameter = {
            template: template
        };
        if (parameter) {
            if (parameter.data)
                vueParameter.data = parameter.data;
            if (parameter.methods)
                vueParameter.methods = parameter.methods;
            if (parameter.mounted)
                vueParameter.mounted = parameter.mounted;
        }
        var vueDemo = new Vue(vueParameter).$mount();
        document.getElementById(elementId).appendChild(vueDemo.$el);
    };
    return {
        componentToDom: componentToDom
    }
});