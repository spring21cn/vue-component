!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("FormDemo", this, function() {
    'use strict';
    var formDemo = {
        path: '/form',
        name: 'form',
        head: {
            label: 'Form 表单',
            description: '由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据。'
        },
        samples: [{
            id: 'form1',
            label: '表单验证',
            description: '在防止用户犯错的前提下，尽可能让用户更早地发现并纠正错误。',
            template: '<div class="source"><vue-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"><vue-form-item label="活动名称" prop="name"><vue-input v-model="ruleForm.name"></vue-input></vue-form-item><vue-form-item label="活动区域" prop="region"><vue-select v-model="ruleForm.region" placeholder="请选择活动区域"><vue-option label="区域一" value="shanghai"></vue-option><vue-option label="区域二" value="beijing"></vue-option></vue-select></vue-form-item><vue-form-item label="活动性质" prop="type"><vue-checkbox-group v-model="ruleForm.type"><vue-checkbox label="美食" name="type"></vue-checkbox><vue-checkbox label="K歌" name="type"></vue-checkbox><vue-checkbox label="棋牌" name="type"></vue-checkbox></vue-checkbox-group></vue-form-item><vue-form-item label="特殊资源" prop="resource"><vue-radio-group v-model="ruleForm.resource"><vue-radio label="活动经费"></vue-radio><vue-radio label="场地免费"></vue-radio></vue-radio-group></vue-form-item><vue-form-item label="活动形式" prop="desc"><vue-input type="textarea" v-model="ruleForm.desc"></vue-input></vue-form-item><div style="margin: 50px 0;"></div><vue-form-item><vue-button type="primary" @click="submitForm(\'ruleForm\')">立即创建</vue-button><vue-button @click="resetForm(\'ruleForm\')">重置</vue-button></vue-form-item></vue-form></div>',
            parameter: {
                data: function() {
                    return {
                        ruleForm: {
                            name: "",
                            region: "",
                            type: [],
                            resource: "",
                            desc: ""
                        },
                        rules: {
                            name: [{
                                required: true,
                                message: "请输入活动名称"
                            }, {
                                min: 3,
                                max: 5,
                                message: "长度在 3 到 5 个字符"
                            }],
                            region: [{
                                required: true,
                                message: "请选择活动区域"
                            }],
                            type: [{
                                type: "array",
                                required: true,
                                message: "请至少选择一个活动性质"
                            }],
                            resource: [{
                                required: true,
                                message: "请选择活动资源"
                            }],
                            desc: [{
                                required: true,
                                message: "请填写活动形式"
                            }]
                        }
                    }
                },
                methods: {
                    submitForm: function(formName) {
                        var self = this;
                        self.$refs[formName].validate(function(valid) {
                            if (valid) {
                                self.$alert("submit!");
                            } else {
                                console.log("error submit!");
                                return false;
                            }
                        });
                    },
                    resetForm: function(formName) {
                        this.$refs[formName].resetFields();
                    }
                }
            },
            code: '<vue-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">\n    <vue-form-item label="活动名称" prop="name">\n        <vue-input v-model="ruleForm.name"></vue-input>\n    </vue-form-item>\n    <vue-form-item label="活动区域" prop="region">\n        <vue-select v-model="ruleForm.region" placeholder="请选择活动区域">\n            <vue-option label="区域一" value="shanghai"></vue-option>\n            <vue-option label="区域二" value="beijing"></vue-option>\n        </vue-select>\n    </vue-form-item>\n    <vue-form-item label="活动性质" prop="type">\n        <vue-checkbox-group v-model="ruleForm.type">\n            <vue-checkbox label="美食" name="type"></vue-checkbox>\n            <vue-checkbox label="K歌" name="type"></vue-checkbox>\n            <vue-checkbox label="棋牌" name="type"></vue-checkbox>\n        </vue-checkbox-group>\n    </vue-form-item>\n    <vue-form-item label="特殊资源" prop="resource">\n        <vue-radio-group v-model="ruleForm.resource">\n            <vue-radio label="活动经费"></vue-radio>\n            <vue-radio label="场地免费"></vue-radio>\n        </vue-radio-group>\n    </vue-form-item>\n    <vue-form-item label="活动形式" prop="desc">\n        <vue-input type="textarea" v-model="ruleForm.desc"></vue-input>\n    </vue-form-item>\n    <vue-form-item>\n        <vue-button type="primary" @click="submitForm(\'ruleForm\')">立即创建</vue-button>\n        <vue-button @click="resetForm(\'ruleForm\')">重置</vue-button>\n    </vue-form-item>\n</vue-form>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                ruleForm: {\n                    name: "",\n                    region: "",\n                    type: [],\n                    resource: "",\n                    desc: ""\n                },\n                rules: {\n                    name: [\n                        { required: true, message: "请输入活动名称", trigger: "change" },\n                        { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "change" },\n                    ],\n                    region: [\n                        { required: true, message: "请选择活动区域", trigger: "change" },\n                    ],\n                    type: [\n                        { type: "array", required: true, message: "请至少选择一个活动性质", trigger: "change" },\n                    ],\n                    resource: [\n                        { required: true, message: "请选择活动资源", trigger: "change" },\n                    ],\n                    desc: [\n                        { required: true, message: "请填写活动形式", trigger: "change" },\n                    ]\n                }\n            }\n        },\n        methods: {\n            submitForm: function(formName) {\n                var self = this;\n                self.$refs[formName].validate(function(valid) {\n                     if (valid) {\n                         self.$alert("submit!");\n                     } else {\n                         console.log("error submit!");\n                         return false;\n                     }\n                });\n            },\n            resetForm: function(formName) {\n                this.$refs[formName].resetFields();\n            }\n        }\n    }).$mount();\n</script>'
        }]
    };
    return formDemo;
});
