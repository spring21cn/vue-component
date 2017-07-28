!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("UploadDemo", this, function() {
    'use strict';
    var uploadDemo = {
        path: '/upload',
        name: 'upload',
        head: {
            label: 'Upload 上传',
            description: '通过点击或者拖拽上传文件。'
        },
        samples: [{
            id: 'upload1',
            label: '点击上传',
            description: '通过 slot 你可以传入自定义的上传按钮类型和文字提示。',
            template: '<div class="source"><vue-upload :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" ><vue-button size="small" type="primary">点击上传</vue-button><div slot="tip" class="vue-upload__tip">只能上传txt文件，且不超过2MB</div></vue-upload></div>',
            parameter: {
                methods: {
                    handleRemove: function(file, fileList) {
                        console.log(file);
                        console.log(fileList);
                    },
                    handlePreview: function(file) {
                        console.log(file);
                    },
                    beforeAvatarUpload: function(file) {
                        var isTXT = file.type === 'text/plain';
                        var isLt2M = file.size / 1024 / 1024 < 2;
                        if (!isTXT) {
                          this.$notify.error('上传文件只能是 txt 格式!');
                        }
                        if (!isLt2M) {
                          this.$notify.error('上传文件大小不能超过 2MB!');
                        }
                        return isTXT && isLt2M;
                      }
                  }
            },
            code: '<vue-upload :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload">\n'+
            '    <vue-button size="small" type="primary">点击上传</vue-button>\n'+
            '    <div slot="tip" class="vue-upload__tip">只能上传txt文件，且不超过2MB</div>\n'+
            '</vue-upload>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return: {\n'+
            '                dialogImageUrl: "",\n'+
            '                dialogVisible: false\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            handleRemove: function(file, fileList) {\n'+
            '                console.log(file);\n'+
            '                console.log(fileList);\n'+
            '            },\n'+
            '            handlePreview: function(file) {\n'+
            '                console.log(file);\n'+
            '            },\n'+
            '            beforeAvatarUpload: function(file, fileList) {\n'+
            '                var isTXT = file.type === "text/plain";\n'+
            '                var isLt2M = file.size / 1024 / 1024 < 2;\n'+
            '                if (!isTXT) {\n'+
            '                    this.$notify.error(\'上传文件只能是 txt 格式!\');\n'+
            '                }\n'+
            '                if (!isLt2M) {\n'+
            '                    this.$notify.error(\'上传文件大小不能超过 2MB!\');\n'+
            '                }\n'+
            '                return isTXT && isLt2M;\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'upload2',
            label: '照片墙',
            description: '使用 list-type 属性来设置文件列表的样式。',
            template: '<div class="source"><vue-upload list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload"><i class="vue-icon-plus"></i></vue-upload><vue-dialog v-model="dialogVisible" show-close><img width="100%" :src="dialogImageUrl" alt=""></vue-dialog></div>',
            parameter: {
                data: function() {
                    return {
                      dialogImageUrl: '',
                      dialogVisible: false
                    }
                },
                methods: {
                    handleRemove: function(file, fileList) {
                        console.log(file);
                        console.log(fileList);
                    },
                    handlePictureCardPreview: function(file) {
                        this.dialogImageUrl = file.url;
                        this.dialogVisible = true;
                    },
                    beforeAvatarUpload: function(file) {
                        var isJPG = file.type === 'image/jpeg';
                        if (!isJPG) {
                          this.$notify.error('上传文件只能是 JPG 格式!');
                        }
                        return isJPG;
                      }
                  }
            },
            code: '<vue-upload list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload">\n'+
            '    <i class="vue-icon-plus"></i>\n'+
            '</vue-upload>\n'+
            '<vue-dialog v-model="dialogVisible" show-close>\n'+
            '    <img width="100%" :src="dialogImageUrl" alt="">\n'+
            '</vue-dialog>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return: {\n'+
            '                dialogImageUrl: "",\n'+
            '                dialogVisible: false\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            handleRemove: function(file, fileList) {\n'+
            '                console.log(file);\n'+
            '                console.log(fileList);\n'+
            '            },\n'+
            '            handlePictureCardPreview: function(file) {\n'+
            '                this.dialogImageUrl = file.url;\n'+
            '                this.dialogVisible = true;\n'+
            '            },\n'+
            '            beforeAvatarUpload: function(file, fileList) {\n'+
            '                var isJPG = file.type === "image/jpeg";\n'+
            '                if (!isJPG) {\n'+
            '                    this.$notify.error(\'上传文件只能是 JPG 格式!\');\n'+
            '                }\n'+
            '                return isJPG;\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return uploadDemo;
});

