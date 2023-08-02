/***************************************************************************************
 *
 *  attachmen view image - layout 上下 布局
 *  
****************************************************************************************/
        
Vue.component('VueAttachmentView', {
    template: '<div :class="[\'vue-attachment-view\',isScreenFull?\'is-fullscreen\':\'\']" :style="{height:isScreenFull?\'100vh\':height}" \
                    v-bind="$attrs" \
                    v-on="$listeners" \
                    >\
                <vue-row class="tools v-flex">\
                    <vue-col class="left-tools v-flex">\
                        <vue-button type="text" icon="vue-icon-menu" class="v-button" @click="showFlyout"></vue-button>\
                        <div class="file-name text-ellipsis" :title="fileName">{{fileName}}</div>\
                    </vue-col>\
                    <vue-col class="center-tools v-flex">\
                        <div class="tools-buttons v-flex">\
                            <vue-button type="text" icon="vue-icon-zoom-out" class="v-button" @click="zoomOut"></vue-button>\
                            <vue-button type="text" icon="vue-icon-zoom-in" class="v-button" @click="zoomIn"></vue-button>\
                            <vue-button type="text" icon="vue-icon-sort" class="v-button" @click="maxSize"></vue-button>\
                            <vue-button type="text" icon="vue-icon-document" class="v-button" @click="zoomReset"></vue-button>\
                           <div class="v-hr"></div>\
                        </div>\
                        <div class="pageselector-container v-flex">\
                            <vue-input class="page-no" type="text" width="20" v-model="currentPageNo" @change="currentPageNoChange"></vue-input>\
                            <p class="page-length">/&nbsp;{{filePageSize}}</p>\
                        </div>\
                        <div class="v-flex">\
                            <vue-button type="text" icon="vue-icon-arrow-left" class="v-button" @click="prePageNo"></vue-button>\
                            <vue-button type="text" icon="vue-icon-arrow-right" class="v-button" @click="nextPageNo"></vue-button>\
                            <vue-button type="text" icon="vue-icon-refresh" class="v-button" @click="rotateItem"></vue-button>\
                        </div>\
                      </vue-col>\
                    <vue-col class="right-tools v-flex">\
                        <div class="tools-buttons v-flex">\
                            <vue-button type="text" icon="vue-icon-enlarge" class="v-button" @click="screenFull"></vue-button>\
                        </div>\
                    </vue-col>\
                </vue-row>\
                <vue-row class="file-body">\
                    <div size="tiny" :class="[\'contents-flyout\', showFlyoutVisible ? \'is-display\':\'\']">\
                        <vue-row type="flex" justify="space-between" class="flyout-title">\
                            <span class="text-ellipsis" :title="$t(\'vue.attachment.view.directory\')">{{$t(\'vue.attachment.view.directory\')}}</span>\
                            <vue-button type="text" icon="vue-icon-close" @click="showFlyout"></vue-button>\
                        </vue-row>\
                        <div class="flyout-view tiny-scrollbar" ref="flyoutView">\
                           <div class="item" v-for="(item,index) in imageList">\
                               <vue-image :class="[index+1 === currentPageNo?\'is-selected\':\'\']" :src="item" :page-no="index+1" @click="flyImgClick">\
                                    <div slot="placeholder" class="image-slot">\
                                         {{$t("vue.attachment.view.loading")}}<span class="dot">...</span>\
                                    </div>\
                                </vue-image>\
                               <div class="page-no">{{index+1}}</div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="contents tiny-scrollbar" ref="contents" @scroll="handleScroll">\
                       <div class="content-view" ref="contentView" :style="contentStyle">\
                           <div :class="[\'item\',isMaxSizeItem?\'is-width\':\'\',imgConfig[index].img.rotate?\'is-rotate\':\'\', isAutoItemConten?\'is-content\':\'\']" v-for="(item,index) in imageList" :id="\'content-view-item_\'+(index+1)" :style="imgConfig[index].item">\
                               <vue-image :src="item" lazy @load="imgConfig[index].img.onload(item,index)" :text-svg="textSvg" \
                                    v-bind="$attrs" \
                                    v-on="$listeners" \
                                    :scroll-container="$refs.contents"\
                                    >\
                                    <div slot="placeholder" class="image-slot">\
                                          {{$t("vue.attachment.view.loading")}}<span class="dot">...</span>\
                                     </div>\
                               </vue-image>\
                            </div>\
                       </div>\
                    </div>\
                </vue-row>\
                </div>',
    props: {
        height: String,
        imageList: {
            'type': Array,
            'default': function () {
                return [];
            }
        },
        fileName: String,
        textSvg: Boolean
    },
    data: function () {
        return {
            currentPageNo: 1,
            showFlyoutVisible: false,
            flyoutPages: [],
            isScreenFull: false,
            contentStyle: {
                zoom: 1,
                width: null
            },
            itemStyle: {
                width: ''
            },
            itemStyleDefaultWidth: '60%',
            changeFlyView: true,
            //自动宽度
            isMaxSizeItem: false,
            //自动适应内容
            isAutoItemConten: true,
            // itemAutoStyle: {},
            //图片展示配置
            imgConfig: []
        };
    },
    computed: {
        filePageSize: function () {
            return this.imageList ? Math.max(this.imageList.length, 0) : 0;
        }
    },
    watch: {
        imageList: function (val) {
            this.setImageConfig();
        }
    },
    mounted: function () {
        this.setImageConfig();
    },
    methods: {
        currentPageNoChange: function () {
            var self = this;
            self.changeContentView();
            if (self.changeFlyView) {
                self.changeFlyoutView();
            }
            self.changeFlyView = true;
        },
        getItemConfig: function () {
            var self = this;
            return {
                item: {
                    width: null,
                    height: null
                },
                img: {
                    naturalWidth: 0,
                    naturalHeight: 0,
                    rotate: '',
                    onload: function (src, index) {
                        self.autoContentItem(index + 1, self.isMaxSizeItem, self.isAutoItemConten);
                    }
                }
            };
        },
        setImageConfig: function () {
            var self = this;
            var data = self.imageList;
            self.imgConfig.splice(0);
            for (var i = 0; i < data.length; i++) {
                var item = VueUtil.merge({
                    img: {
                        url: data[i]
                    }
                }, self.getItemConfig());
                self.imgConfig.push(item);
            }
        },
        showFlyout: function () {
            this.showFlyoutVisible = !this.showFlyoutVisible;
        },
        prePageNo: function () {
            this.currentPageNo = Math.max(Number(this.currentPageNo) - 1, 1);
            this.currentPageNoChange();
        },
        nextPageNo: function () {
            this.currentPageNo = Math.min(Number(this.currentPageNo) + 1, this.filePageSize);
            this.currentPageNoChange();
        },
        flyImgClick: function (evt) {
            this.changeFlyView = false;
            this.currentPageNo = Number(evt.target.getAttribute('page-no'));
            this.currentPageNoChange();
        },
        changeFlyoutView: function () {
            var pageNo = this.currentPageNo;
            var flyoutImg = this.$refs.flyoutView.querySelector('img[page-no=\'' + pageNo + '\']');
            if (flyoutImg) {
                flyoutImg.scrollIntoView(false);
            }
        },
        getContentView: function (pageNo) {
            var self = this;
            return self.$refs.contentView.querySelector('div[id=\'content-view-item_' + pageNo + '\']');
        },
        getCurrentContentView: function () {
            var self = this;
            return self.getContentView(self.currentPageNo);
        },
        changeContentView: function () {
            var img = this.getCurrentContentView();
            if (img) {
                this.$nextTick(function () {
                    img.scrollIntoView(false);
                });
            }
        },
        //适应容器宽度
        maxSize: function () {
            var self = this;
            self.resetContent();
            self.isMaxSizeItem = true;
            self.isAutoItemConten = false;
            self.autoContentAllItem();
            self.changeContentView();
        },
        screenFull: function () {
            this.isScreenFull = !this.isScreenFull;
        },
        changeContenViewWidth: function (changeNum) {
            var self = this;
            var style = self.contentStyle;
            var zoom = style.zoom + changeNum;
            if(zoom){
              style.zoom = zoom;
            }
        },
        zoomIn: function () {
            this.changeContenViewWidth(0.1);
        },
        zoomOut: function () {
            this.changeContenViewWidth(-0.1);
        },
        autoContentAllItem: function () {
            var self = this;
            var imgConfig = self.imgConfig;
            for (var i in imgConfig) {
                self.autoContentItem(Number(i) + 1, self.isMaxSizeItem, self.isAutoItemConten);
            }
        },
        autoContentItem: function (pageNo, isMaxSizeItem, isAutoItemConten) {
            var self = this;
            var contentsDom = self.$refs.contentView;
            var contentWidth = contentsDom.clientWidth;
            var contentHeight = contentsDom.clientHeight;
            var targetPageNo = pageNo ? pageNo : self.currentPageNo;
            var img = self.getContentView(targetPageNo).getElementsByTagName('img')[0];
            if (img) {
                var itemConfig = self.imgConfig[targetPageNo - 1].item;
                var imgConfig = self.imgConfig[targetPageNo - 1].img;
                var contentPer = contentWidth / contentHeight;
                var imgPer = img.naturalWidth / img.naturalHeight;
                var isWidthBigger = imgPer > contentPer || isMaxSizeItem;
                img.style.objectFit = isAutoItemConten ? 'contain' : null;

                imgConfig.naturalWidth = img.naturalWidth;
                imgConfig.naturalHeight = img.naturalHeight;
                imgConfig.objectFit = img.style.objectFit;

                if(['rotate(90deg)', 'rotate(270deg)'].indexOf(imgConfig.rotate) > -1){
                    //旋转
                    if(isWidthBigger){ //宽>高
                        itemConfig.width = contentWidth + 'px';
                        itemConfig.height = contentHeight + 'px';
                        imgConfig.width = contentHeight - 16 + 'px';
                        imgConfig.height = (contentHeight - 16) * imgPer + 'px';
                    }else{
                        itemConfig.width = contentWidth + 'px';
                        itemConfig.height = (contentWidth - 16) * imgPer + 16 + 'px';
                        imgConfig.width = (contentWidth - 16) * imgPer + 'px';
                        imgConfig.height = contentWidth - 16 + 'px';
                    }
                }else{
                    if(isWidthBigger){ //宽>高
                        itemConfig.width = contentWidth + 'px';
                        itemConfig.height = 'auto';
                        imgConfig.width = contentWidth - 16 + 'px';
                        imgConfig.height = 'auto';
                    }else{
                        itemConfig.width = contentWidth + 'px';
                        itemConfig.height = contentHeight + 'px';
                        imgConfig.width = 'auto';
                        imgConfig.height = contentHeight - 16 + 'px';
                    }
                }
                img.style.width = imgConfig.width;
                img.style.height = imgConfig.height;
            }
        },
        //重置内容缩放
        resetContent: function () {
            var self = this;
            self.contentStyle.zoom = 1;
        },
        //自适应内容大小
        zoomReset: function () {
            var self = this;
            self.resetContent();
            self.isAutoItemConten = true;
            self.isMaxSizeItem = false;
            self.autoContentAllItem();
            self.changeContentView();
        },
        rotateItem: function () {
            var self = this;
            var img = this.getCurrentContentView().getElementsByTagName('img')[0];
            var rotate = img.style.transform;
            switch (rotate) {
                case 'rotate(90deg)':
                    rotate = 'rotate(180deg)';
                    break;
                case 'rotate(180deg)':
                    rotate = 'rotate(270deg)';
                    break;
                case 'rotate(270deg)':
                    rotate = '';
                    break;
                case '':
                    rotate = 'rotate(90deg)';
            }
            img.style.transform = rotate;
            self.imgConfig[self.currentPageNo - 1].img.rotate = rotate;
            self.autoContentItem(self.currentPageNo, false, true);
        },
        handleScroll: VueUtil.debounce(100, function (event) {
            var currentEl;
            var els = Array.from(this.$refs.contentView.querySelectorAll('.item'));

            for (var index = 0; index < els.length; index++) {
                var el = els[index];
                var container = el.parentElement.parentElement;
                currentEl = el;

                if (el.offsetTop + el.offsetHeight > container.scrollTop + 300) {
                    break;
                }
            }
            this.currentPageNo = els.indexOf(currentEl) + 1;
        })
    }
});
