!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("PaginationDemo", this, function() {
    'use strict';
    var paginationDemo = {
        path: '/pagination',
        name: 'pagination',
        head: {
            label: 'Pagination 分页',
            description: '当数据量过多时，使用分页分解数据。'
        },
        samples: [{
            id: 'pagination1',
            label: '基础用法',
            description: '设置layout，表示需要显示的内容，用逗号分隔，布局元素会依次显示。prev表示上一页，next为上一页，pager表示页码列表，page-sizes接受一个整型数组，数组元素为展示的选择每页显示个数的选项,total表示显示页码总数',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">页数较少时的效果</span></vue-col><vue-col :span="16"><vue-pagination layout="prev, pager, next" :page-size="10" :total="50"></vue-pagination></vue-col></vue-row><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">页数较多时的效果</span></vue-col><vue-col :span="16"><vue-pagination layout="prev, pager, next" :page-size="1" :total="50"></vue-pagination></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">小型分页</span></vue-col><vue-col :span="16"><vue-pagination layout="prev, pager, next" :page-size="10" :total="50" small></vue-pagination></vue-col></vue-row></div>',
            code: '<span class="demonstration">页数较少时的效果</span>\n'+
            '<vue-pagination layout="prev, pager, next" :page-size="10" :total="50">\n'+
            '</vue-pagination>\n'+
            '<span class="demonstration">页数较多时的效果</span>\n'+
            '<vue-pagination layout="prev, pager, next" :page-size="1" :total="50">\n'+
            '</vue-pagination>\n'+
            '<span class="demonstration">小型分页</span>\n'+
            '<vue-pagination layout="prev, pager, next" :page-size="10" :total="50" small>\n'+
            '</vue-pagination>'
        }]
    };
    return paginationDemo;
});

