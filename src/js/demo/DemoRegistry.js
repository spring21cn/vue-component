!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(["Vue", "VueUtil", "VueRouter", "DemoUtil", "LayoutDemo", "ButtonDemo", "IconDemo", "RadioDemo", "CheckboxDemo", "InputDemo", "SelectDemo", "CascaderDemo", "SwitchDemo", "FormDemo", "TableDemo", "TagDemo", "TreeDemo", "AlertDemo", "LoadingDemo", "NavMenuDemo", "TabsDemo", "DropdownDemo", "StepsDemo", "DialogDemo", "TooltipDemo", "PopoverDemo", "AsideDemo", "CardDemo", "CarouselDemo", "DateTimeDemo", "MessageBoxDemo", "NotificationDemo", "DateDemo", "TimeDemo", "I18nDemo", "CollapseDemo", "BadgeDemo", "InstallDemo", "BreadcrumbDemo", "PaginationDemo", "ProgressDemo", "SliderDemo", "RateDemo", "UploadDemo", "LoadingBarDemo", "NoteDemo", "SortableDemo", "AjaxDemo", "ListDemo", "ColorDemo", "CalendarDemo", "PinDemo"], definition);
    } else {
        Vue.config.keyCodes = {
            f1: 112
        }
        context[name] = definition(context["Vue"], context["VueUtil"], context["VueRouter"], context["DemoUtil"], context["LayoutDemo"], context["ButtonDemo"], context["IconDemo"], context["RadioDemo"], context["CheckboxDemo"], context["InputDemo"], context["SelectDemo"], context["CascaderDemo"], context["SwitchDemo"], context["FormDemo"], context["TableDemo"], context["TagDemo"], context["TreeDemo"], context["AlertDemo"], context["LoadingDemo"], context["NavMenuDemo"], context["TabsDemo"], context["DropdownDemo"], context["StepsDemo"], context["DialogDemo"], context["TooltipDemo"], context["PopoverDemo"], context["AsideDemo"], context["CardDemo"], context["CarouselDemo"], context["DateTimeDemo"], context["MessageBoxDemo"], context["NotificationDemo"], context["DateDemo"], context["TimeDemo"], context["I18nDemo"], context["CollapseDemo"], context["BadgeDemo"], context["InstallDemo"], context["BreadcrumbDemo"], context["PaginationDemo"], context["ProgressDemo"], context["SliderDemo"], context["RateDemo"], context["UploadDemo"], context["LoadingBarDemo"], context["NoteDemo"], context["SortableDemo"], context["AjaxDemo"], context["ListDemo"], context["ColorDemo"], context["CalendarDemo"], context["PinDemo"]);
        delete context["DemoUtil"];
        delete context["LayoutDemo"];
        delete context["ButtonDemo"];
        delete context["IconDemo"];
        delete context["RadioDemo"];
        delete context["CheckboxDemo"];
        delete context["InputDemo"];
        delete context["SelectDemo"];
        delete context["CascaderDemo"];
        delete context["SwitchDemo"];
        delete context["FormDemo"];
        delete context["TableDemo"];
        delete context["TagDemo"];
        delete context["TreeDemo"];
        delete context["AlertDemo"];
        delete context["LoadingDemo"];
        delete context["NavMenuDemo"];
        delete context["TabsDemo"];
        delete context["DropdownDemo"];
        delete context["StepsDemo"];
        delete context["DialogDemo"];
        delete context["TooltipDemo"];
        delete context["PopoverDemo"];
        delete context["AsideDemo"];
        delete context["CardDemo"];
        delete context["CarouselDemo"];
        delete context["DateTimeDemo"];
        delete context["MessageBoxDemo"];
        delete context["NotificationDemo"];
        delete context["DateDemo"];
        delete context["TimeDemo"];
        delete context["I18nDemo"];
        delete context["CollapseDemo"];
        delete context["BadgeDemo"];
        delete context["InstallDemo"];
        delete context["BreadcrumbDemo"];
        delete context["PaginationDemo"];
        delete context["ProgressDemo"];
        delete context["SliderDemo"];
        delete context["RateDemo"];
        delete context["UploadDemo"];
        delete context["LoadingBarDemo"];
        delete context["NoteDemo"];
        delete context["SortableDemo"];
        delete context["AjaxDemo"];
        delete context["ListDemo"];
        delete context["ColorDemo"];
        delete context["CalendarDemo"];
        delete context["PinDemo"]
        delete context[name];
        delete context["Vuex"];
        delete context["VueRouter"];
        delete context["Vue"];
    }
})("DemoRegistry", this, function(Vue, VueUtil, VueRouter, DemoUtil, LayoutDemo, ButtonDemo, IconDemo, RadioDemo, CheckboxDemo, InputDemo, SelectDemo, CascaderDemo, SwitchDemo, FormDemo, TableDemo, TagDemo, TreeDemo, AlertDemo, LoadingDemo, NavMenuDemo, TabsDemo, DropdownDemo, StepsDemo, DialogDemo, TooltipDemo, PopoverDemo, AsideDemo, CardDemo, CarouselDemo, DateTimeDemo, MessageBoxDemo, NotificationDemo, DateDemo, TimeDemo, I18nDemo, CollapseDemo, BadgeDemo, InstallDemo, BreadcrumbDemo, PaginationDemo, ProgressDemo, SliderDemo, RateDemo, UploadDemo, LoadingBarDemo, NoteDemo, SortableDemo, AjaxDemo, ListDemo, ColorDemo, CalendarDemo, PinDemo) {
    'use strict';
    Vue.http.interceptors.push(function(request, next) {
        Vue.Loading.start();
        next(function(response) {
            if (response.status === 200) {
                Vue.Loading.finish();
            } else {
                Vue.Loading.error();
            }
            return response;
        });
    });
    var MainTemplate = '<section class="content"><h2>{{$t($route.params.head.label)}}</h2><p>{{$t($route.params.head.description)}}</p><template v-for="sample in $route.params.samples"><h3>{{$t(sample.label)}}</h3><p>{{$t(sample.description)}}</p><div class="demo-block" :class="{\'no-bottom\': sample.notshowmeta!==true}" v-if="sample.notshowblock!==true"><div :id="sample.id"></div></div><vue-collapse v-if="sample.notshowmeta!==true" v-model="sample.collapse"><vue-collapse-item class="collapse-item-blue" name="item1"><template slot="title"><vue-button type="text" icon="vue-icon-document">{{$t("main.code")}}</vue-button></template><pre>{{sample.code}}</pre></vue-collapse-item></vue-collapse></template></section>';
    var routes = [];
    var menuItems1 = [InstallDemo, I18nDemo, AjaxDemo];
    var menuItems2 = [LayoutDemo, IconDemo, ButtonDemo, InputDemo, DateDemo, TimeDemo, DateTimeDemo, CalendarDemo, RadioDemo, CheckboxDemo, SwitchDemo, DropdownDemo, SelectDemo, CascaderDemo, FormDemo, TableDemo, PaginationDemo, TreeDemo, CollapseDemo, SortableDemo, MessageBoxDemo, DialogDemo, AsideDemo, NotificationDemo, TabsDemo, BadgeDemo, PopoverDemo, TooltipDemo, TagDemo, AlertDemo, NoteDemo, ListDemo, CardDemo, CarouselDemo, LoadingDemo, LoadingBarDemo, ProgressDemo, SliderDemo, BreadcrumbDemo, StepsDemo, RateDemo, PinDemo, UploadDemo, ColorDemo, NavMenuDemo];
    var menuItems3 = [{
        head: {
            label: 'KanBan'
        },
        path: '/demo_bar/yna2-vue/demo/kanban.vue',
        name: 'KanBan'
    }];
    var loadVueComponent = null;
    var demos = [].concat(menuItems1).concat(menuItems2).concat(menuItems3);
    demos.map(function(demo) {
        routes.push({
            path: demo.path,
            name: demo.name,
            component: {
                template: demo.samples ? MainTemplate : '<div id="customVue"></div>',
                mounted: function() {
                    if (demo.samples) {
                        for (var i = 0, j = demo.samples.length; i < j; i++) {
                            var demoSamples = demo.samples[i];
                            DemoUtil.componentToDom(demoSamples.id, demoSamples.template, demoSamples.parameter);
                        }
                    } else {
                        var callbackFn = function() {
                            loadVueComponent = arguments[1];
                        }
                        VueUtil.loadVue(demo.path, '#customVue', {}, callbackFn);
                    }
                    document.querySelector('.right-container').scrollTop = 0;
                }
            },
            beforeEnter: function(to, from, next) {
                loadVueComponent && loadVueComponent.$destroy();
                from.matched[0] && from.matched[0].instances.default.$destroy();
                if (demo.samples) {
                    to.params.head = demo.head;
                    to.params.samples = demo.samples;
                }
                next();
            }
        });
    });
    routes.push({
        path: '/',
        component: {
            template: '<section class="content root-content"><h2>{{$t(\'main.line1\')}}</h2><p></p><h3 class="imitation">{{txt}}{{h3}}</h3></section>',
            data: function() {
                return {
                    h3: '',
                    txt: '',
                }
            },
            mounted: function() {
                var self = this;
                var typeFlg = true;
                var msgFlg = 0;
                var typeWriter = {
                    msg: function(msg) {
                        return msg;
                    },
                    len: function() {
                        return this.msg.length;
                    },
                    seq: 0,
                    speed: 400,
                    witeTime: 1500,
                    backSpeed: 200,
                    backFlg: true,
                    typeInterval: null,
                    type: function() {
                        typeFlg = false;
                        var that = this;
                        that.typeInterval && clearInterval(that.typeInterval);
                        self.h3 = that.msg.substring(0, that.seq);
                        if (that.seq === that.len()) {
                            if (that.backFlg) {
                                setTimeout(function() {
                                    that.typeBack()
                                }, that.witeTime);
                            } else {
                                self.txt = self.h3;
                                self.h3 = "";
                                that.seq = 0;
                                typeFlg = true;
                            }
                        } else {
                            that.seq++;
                            setTimeout(function() {
                                that.type()
                            }, that.speed);
                        }
                    },
                    typeBack: function() {
                        var that = this;
                        self.h3 = that.msg.substring(that.seq, 0);
                        if (that.seq === 0) {
                            typeFlg = true;
                        } else {
                            that.seq--
                            setTimeout(function() {
                                that.typeBack()
                            }, that.backSpeed);
                        }
                    }
                }
                var startType = function(msg, speed, backSpeed, backFlg, typeInterval) {
                    typeWriter.msg = msg;
                    typeWriter.speed = speed;
                    typeWriter.backSpeed = backSpeed;
                    typeWriter.backFlg = backFlg;
                    typeWriter.typeInterval = typeInterval;
                    typeWriter.type();
                }
                setTimeout(function() {
                    startType(self.$t('main.line21'), 200, 100, true);
                    var type1 = setInterval(function() {
                        if (typeFlg) {
                            startType(self.$t('main.line22'), 200, 100, true, type1);
                            var type2 = setInterval(function() {
                                if (typeFlg) {
                                    startType(self.$t('main.line23'), 200, 0, false, type2);
                                    setInterval(function() {
                                        if (typeFlg) {
                                            switch (msgFlg) {
                                            case 0:
                                                msgFlg++
                                                startType(self.$t('main.line24'), 250, 150, true);
                                                break;
                                            case 1:
                                                msgFlg++
                                                startType(self.$t('main.line25'), 250, 150, true);
                                                break;
                                            case 2:
                                                msgFlg++
                                                startType(self.$t('main.line26'), 250, 150, true);
                                                break;
                                            case 3:
                                                msgFlg++
                                                startType(self.$t('main.line27'), 250, 150, true);
                                                break;
                                            case 4:
                                                msgFlg = 0;
                                                startType(self.$t('main.line28'), 250, 150, true);
                                                break;
                                            }
                                        }
                                    }, 1500);
                                }
                            }, 1500);
                        }
                    }, 1500);
                }, 1500);
            }
        }
    });
    var DemoRouter = new VueRouter({
        routes: routes
    });
    var vueDemo = new Vue({
        template: '<div><vue-menu theme="dark" class="head-container"><vue-row type="flex" justify="center"><vue-col :sm=\'2\' :xs=\'2\' class="menu-show"><vue-button icon="vue-icon-menu" @click="clickHandle" class="show-menu-btn" type="text"></vue-button></vue-col><vue-col :span="11" class="head-text">{{headText}}</vue-col><vue-col :span="11"><vue-radio-group v-model="radioLang" class="head-right" @change="changeHandle" size="small"><vue-radio-button label="1">{{$t(\'main.radiolabel1\')}}</vue-radio-button><vue-radio-button label="2">{{$t(\'main.radiolabel2\')}}</vue-radio-button></vue-radio-group><div class="head-right padding-right20">Version：<vue-button type="text">0.10</vue-button></div></vue-col></vue-row></vue-menu><vue-row class="main-container"><vue-col :lg=\'5\' :md=\'5\' :sm=\'8\' :xs=\'8\' :class="[\'left-container\',leftClass]"><vue-menu router class="container-color" :default-active="defaultActive" :default-openeds="defaultOpeneds" @select="selectHandle"><vue-submenu index="1"><template slot="title">{{$t(\'main.title1\')}}</template><vue-menu-item-group class="container-color"><vue-menu-item v-for="(menu, index) in menuItems1" :key="index" :index="menu.path">{{$t(menu.head.label)}}</vue-menu-item></vue-menu-item-group></vue-submenu><vue-submenu index="2"><template slot="title">{{$t(\'main.title2\')}}</template><vue-menu-item-group class="container-color"><vue-menu-item v-for="(menu, index) in menuItems2" :key="index" :index="menu.path">{{$t(menu.head.label)}}</vue-menu-item></vue-menu-item-group></vue-submenu><vue-submenu index="3" v-if="menuItems3.length>0"><template slot="title">{{$t(\'main.title3\')}}</template><vue-menu-item-group class="container-color"><vue-menu-item v-for="(menu, index) in menuItems3" :key="index" :index="menu.path">{{$t(menu.head.label)}}</vue-menu-item></vue-menu-item-group></vue-submenu></vue-menu></vue-col><vue-col :lg=\'19\' :md=\'19\' class="right-container"><router-view></router-view></vue-col></vue-row></div>',
        data: function() {
            return {
                defaultActive: null,
                defaultOpeneds: [],
                menuItems1: menuItems1,
                menuItems2: menuItems2,
                menuItems3: menuItems3,
                leftClass: "",
                headText: "Vue Components",
                radioLang: "1"
            }
        },
        methods: {
            changeHandle: function() {
                switch (this.radioLang) {
                case "1":
                    VueUtil.setLang("zh");
                    break;
                case "2":
                    VueUtil.setLang("ja");
                    break
                }
            },
            clickHandle: function() {
                if (this.leftClass === "show-left") {
                    this.leftClass = "";
                } else {
                    this.leftClass = "show-left";
                }
            },
            selectHandle: function() {
                var self = this;
                self.$nextTick(function() {
                    self.leftClass = "";
                });
            }
        },
        mounted: function() {
            var self = this;
            VueUtil.addResizeListener(document.body, function() {
                self.$nextTick(function() {
                    var containerHeight = document.body.clientHeight - self.$el.querySelector('.head-container').clientHeight + 'px';
                    self.$el.querySelector('.main-container').style.height = containerHeight;
                })
            });
            VueUtil.on(document.querySelector('.right-container'), 'click', function() {
                self.$nextTick(function() {
                    self.leftClass = "";
                });
            });
            var urlAry = document.location.href.split('#/');
            if (VueUtil.trim(urlAry[1]) !== '') {
                this.defaultActive = "/" + urlAry[1];
            } else {
                this.defaultOpeneds = ['1'];
            }
        },
        router: DemoRouter
    }).$mount('#main');
});
