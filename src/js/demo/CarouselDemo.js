!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("CarouselDemo", this, function() {
    'use strict';
    var carouselDemo = {
        path: '/carousel',
        name: 'carousel',
        head: {
            label: 'Carousel 走马灯',
            description: '在有限空间内，循环播放同一类型的图片、文字等内容。'
        },
        samples: [{
            id: 'carousel1',
            label: '基础用法',
            description: '结合使用vue-carousel和vue-carousel-item标签就得到了一个走马灯。幻灯片的内容是任意的，需要放在vue-carousel-item标签中。默认情况下，在鼠标 hover 底部的指示器时就会触发切换。通过设置trigger属性为click，可以达到点击触发的效果。将type属性设置为card即可启用卡片模式。',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration" style="position: relative;top: 60px;">默认  Hover 触发指示器</span></vue-col><vue-col :span="16"><vue-carousel height="150px"><vue-carousel-item v-for="item in 4" :key="item"><h3>{{ item }}</h3></vue-carousel-item></vue-carousel></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration" style="position: relative;top: 60px;">卡片化  Click 触发指示器</span></vue-col><vue-col :span="16"><vue-carousel type="card" trigger="click" height="150px"><vue-carousel-item v-for="item in 4" :key="item"><h3>{{ item }}</h3></vue-carousel-item></vue-carousel></vue-col></vue-row></div>',
            code: '<span class="demonstration">默认 Hover 触发指示器</span>\n'+
            '<vue-carousel height="150px">\n'+
            '    <vue-carousel-item v-for="item in 4">\n'+
            '        <h3>{{ item }}</h3>\n'+
            '    </vue-carousel-item>\n'+
            '</vue-carousel>\n'+
            '<span class="demonstration">卡片化 Click 触发指示器</span>\n'+
            '<vue-carousel type="card" trigger="click" height="150px">\n'+
            '    <vue-carousel-item v-for="item in 4">\n'+
            '        <h3>{{ item }}</h3>\n'+
            '    </vue-carousel-item>\n'+
            '</vue-carousel>'
        }]
    };
    return carouselDemo;
});

