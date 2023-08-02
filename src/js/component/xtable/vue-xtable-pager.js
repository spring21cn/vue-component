(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    context.VueXtablePager = definition(context.tools);
  }
})(this, function(tools) {
  var VueXtablePager = {
    name: 'VueXtablePager',
    props: {
      size: String,
      // 自定义布局
      layouts: {
        type: Array,
        default: function _default() {
          return GlobalConfig.pager.layouts || ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total'];
        }
      },
      // 当前页
      currentPage: {
        type: Number,
        default: 1
      },
      // 加载中
      loading: Boolean,
      // 每页大小
      pageSize: {
        type: Number,
        default: function _default() {
          return GlobalConfig.pager.pageSize || 10;
        }
      },
      // 总条数
      total: {
        type: Number,
        default: 0
      },
      // 显示页码按钮的数量
      pagerCount: {
        type: Number,
        default: function _default() {
          return GlobalConfig.pager.pagerCount || 7;
        }
      },
      // 每页大小选项列表
      pageSizes: {
        type: Array,
        default: function _default() {
          return GlobalConfig.pager.pageSizes || [10, 15, 20, 50, 100];
        }
      },
      // 列对其方式
      align: String,
      // 带边框
      border: {
        type: Boolean,
        default: function _default() {
          return GlobalConfig.pager.border;
        }
      },
      // 带背景颜色
      background: {
        type: Boolean,
        default: function _default() {
          return GlobalConfig.pager.background;
        }
      },
      // 默认的样式
      perfect: {
        type: Boolean,
        default: function _default() {
          return GlobalConfig.pager.perfect;
        }
      }
    },
    inject: {
      $grid: {
        default: null
      }
    },
    data: function data() {
      return {
        showSizes: false,
        panelStyle: null,
        panelIndex: 0
      };
    },
    computed: {
      vSize: function vSize() {
        return this.size || this.$parent.size || this.$parent.vSize;
      },
      isSizes: function isSizes() {
        return this.layouts.some(function (name) {
          return name === 'Sizes';
        });
      },
      pageCount: function pageCount() {
        return this.getPageCount(this.total, this.pageSize);
      },
      numList: function numList() {
        return VueUtil.values(new Array(this.pageCount > this.pagerCount ? this.pagerCount - 2 : this.pagerCount));
      },
      offsetNumber: function offsetNumber() {
        return Math.floor((this.pagerCount - 2) / 2);
      }
    },
    created: function created() {
      this.panelIndex = tools.UtilTools.nextZIndex();
  
      tools.GlobalEvent.on(this, 'mousedown', this.handleGlobalMousedownEvent);
    },
    destroyed: function destroyed() {
      tools.GlobalEvent.off(this, 'mousedown');
    },
    render: function render(h) {
      var _ref,
          _this = this;
  
      var layouts = this.layouts,
          loading = this.loading,
          vSize = this.vSize,
          align = this.align,
          border = this.border,
          background = this.background,
          perfect = this.perfect;
      return h('div', {
        class: ['vue-xtable-pager', (_ref = {}, tools.UtilTools.defineProperty(_ref, 'size--'.concat(vSize), vSize), tools.UtilTools.defineProperty(_ref, 'align--'.concat(align), align), tools.UtilTools.defineProperty(_ref, 'p--border', border), tools.UtilTools.defineProperty(_ref, 'p--background', background), tools.UtilTools.defineProperty(_ref, 'p--perfect', perfect), tools.UtilTools.defineProperty(_ref, 'is--loading', loading), _ref)]
      }, layouts.map(function (name) {
        return _this['render'.concat(name)](h);
      }));
    },
    methods: {
      // 上一页
      renderPrevPage: function renderPrevPage(h) {
        var currentPage = this.currentPage;
        return h('span', {
          class: ['vue-xtable-pager--prev-btn', {
            'is--disabled': currentPage <= 1
          }],
          on: {
            click: this.prevPage
          }
        }, [h('i', {
          class: ['vue-xtable-icon--page-icon', GlobalConfig.icon.prevPage]
        })]);
      },
      // 向上翻页
      renderPrevJump: function renderPrevJump(h, tagName) {
        return h(tagName || 'span', {
          class: ['vue-xtable-pager--jump-prev', {
            'is--fixed': !tagName,
            'is--disabled': this.currentPage <= 1
          }],
          on: {
            click: this.prevJump
          }
        }, [tagName ? h('i', {
          class: 'vue-xtable-pager--jump-more vue-xtable-icon--more'
        }) : null, h('i', {
          class: ['vue-xtable-pager--jump-icon', GlobalConfig.icon.jumpPrev]
        })]);
      },
      // number
      renderNumber: function renderNumber(h) {
        return h('ul', {
          class: 'vue-xtable-pager--btn-wrapper'
        }, this.renderPageBtn(h));
      },
      // jumpNumber
      renderJumpNumber: function renderJumpNumber(h) {
        return h('ul', {
          class: 'vue-xtable-pager--btn-wrapper'
        }, this.renderPageBtn(h, true));
      },
      // 向下翻页
      renderNextJump: function renderNextJump(h, tagName) {
        var currentPage = this.currentPage,
            pageCount = this.pageCount;
        return h(tagName || 'span', {
          class: ['vue-xtable-pager--jump-next', {
            'is--fixed': !tagName,
            'is--disabled': currentPage >= pageCount
          }],
          on: {
            click: this.nextJump
          }
        }, [tagName ? h('i', {
          class: 'vue-xtable-pager--jump-more vue-xtable-icon--more'
        }) : null, h('i', {
          class: ['vue-xtable-pager--jump-icon', GlobalConfig.icon.jumpNext]
        })]);
      },
      // 下一页
      renderNextPage: function renderNextPage(h) {
        var currentPage = this.currentPage,
            pageCount = this.pageCount;
        return h('span', {
          class: ['vue-xtable-pager--next-btn', {
            'is--disabled': currentPage >= pageCount
          }],
          on: {
            click: this.nextPage
          }
        }, [h('i', {
          class: ['vue-xtable-icon--page-icon', GlobalConfig.icon.nextPage]
        })]);
      },
      // sizes
      renderSizes: function renderSizes(h) {
        var _this2 = this;
  
        var pageSizes = this.pageSizes,
            showSizes = this.showSizes,
            pageSize = this.pageSize,
            panelStyle = this.panelStyle;
        return h('span', {
          class: ['vue-xtable-pager--sizes', {
            'is--active': showSizes
          }],
          ref: 'sizeBtn'
        }, [h('span', {
          class: 'size--content',
          on: {
            click: this.toggleSizePanel
          }
        }, [h('span', ''.concat(pageSize).concat(GlobalConfig.i18n('vue.xtable.pager.pagesize'))), h('i', {
          class: 'vue-xtable-pager--sizes-arrow '.concat(GlobalConfig.icon.caretBottom)
        })]), h('div', {
          class: 'vue-xtable-pager-size--select-wrapper',
          style: panelStyle,
          ref: 'sizePanel'
        }, [h('ul', {
          class: 'vue-xtable-pager-size--select'
        }, pageSizes.map(function (num) {
          return h('li', {
            class: ['size--option', {
              'is--active': num === pageSize
            }],
            on: {
              click: function click() {
                return _this2.changePageSize(num);
              }
            }
          }, ''.concat(num).concat(GlobalConfig.i18n('vue.xtable.pager.pagesize')));
        }))])]);
      },
      // FullJump
      renderFullJump: function renderFullJump(h) {
        return this.renderJump(h, true);
      },
      // Jump
      renderJump: function renderJump(h, isFull) {
        var _this3 = this;
  
        var currentPage = this.currentPage,
            pageCount = this.pageCount;
        return h('span', {
          class: 'vue-xtable-pager--jump'
        }, [isFull ? h('span', {
          class: 'vue-xtable-pager--goto-text'
        }, GlobalConfig.i18n('vue.xtable.pager.goto')) : null, h('input', {
          class: 'vue-xtable-pager--goto',
          domProps: {
            value: currentPage
          },
          attrs: {
            type: 'text',
            autocomplete: 'off'
          },
          on: {
            keydown: function keydown(evnt) {
              if (evnt.keyCode === 13) {
                var value = (parseFloat(evnt.target.value) || 0);
                var current = value <= 0 ? 1 : value >= pageCount ? pageCount : value;
                evnt.target.value = current;
  
                _this3.jumpPage(current);
              } else if (evnt.keyCode === 38) {
                evnt.preventDefault();
  
                _this3.nextPage();
              } else if (evnt.keyCode === 40) {
                evnt.preventDefault();
  
                _this3.prevPage();
              }
            }
          }
        }), isFull ? h('span', {
          class: 'vue-xtable-pager--classifier-text'
        }, GlobalConfig.i18n('vue.xtable.pager.pageClassifier')) : null]);
      },
      // PageCount
      renderPageCount: function renderPageCount(h) {
        var pageCount = this.pageCount;
        return h('span', {
          class: 'vue-xtable-pager--count'
        }, [h('span', {
          class: 'vue-xtable-pager--separator'
        }, '/'), h('span', pageCount)]);
      },
      // total
      renderTotal: function renderTotal(h) {
        var total = this.total;
        return h('span', {
          class: 'vue-xtable-pager--total'
        }, this.$t('vue.xtable.pager.total', {total: total}));
      },
      // number
      renderPageBtn: function renderPageBtn(h, showJump) {
        var _this4 = this;
  
        var numList = this.numList,
            currentPage = this.currentPage,
            pageCount = this.pageCount,
            pagerCount = this.pagerCount,
            offsetNumber = this.offsetNumber;
        var nums = [];
        var isOv = pageCount > pagerCount;
        var isLt = isOv && currentPage > offsetNumber + 1;
        var isGt = isOv && currentPage < pageCount - offsetNumber;
        var startNumber = 1;
  
        if (isOv) {
          if (currentPage >= pageCount - offsetNumber) {
            startNumber = Math.max(pageCount - numList.length + 1, 1);
          } else {
            startNumber = Math.max(currentPage - offsetNumber, 1);
          }
        }
  
        if (showJump && isLt) {
          nums.push(h('li', {
            class: 'vue-xtable-pager--num-btn',
            on: {
              click: function click() {
                return _this4.jumpPage(1);
              }
            }
          }, 1), this.renderPrevJump(h, 'li'));
        }
  
        numList.forEach(function (item, index) {
          var number = startNumber + index;
  
          if (number <= pageCount) {
            nums.push(h('li', {
              class: ['vue-xtable-pager--num-btn', {
                'is--active': currentPage === number
              }],
              on: {
                click: function click() {
                  return _this4.jumpPage(number);
                }
              },
              key: number
            }, number));
          }
        });
  
        if (showJump && isGt) {
          nums.push(this.renderNextJump(h, 'li'), h('li', {
            class: 'vue-xtable-pager--num-btn',
            on: {
              click: function click() {
                return _this4.jumpPage(pageCount);
              }
            }
          }, pageCount));
        }
  
        return nums;
      },
      getPageCount: function getPageCount(total, size) {
        return Math.max(Math.ceil(total / size), 1);
      },
      handleGlobalMousedownEvent: function handleGlobalMousedownEvent(evnt) {
        if (this.showSizes && !(tools.DomTools.getEventTargetNode(evnt, this.$refs.sizeBtn).flag || tools.DomTools.getEventTargetNode(evnt, this.$refs.sizePanel).flag)) {
          this.hideSizePanel();
        }
      },
      prevPage: function prevPage() {
        var currentPage = this.currentPage;
  
        if (currentPage > 1) {
          this.jumpPage(Math.max(currentPage - 1, 1));
        }
      },
      nextPage: function nextPage() {
        var currentPage = this.currentPage,
            pageCount = this.pageCount;
  
        if (currentPage < pageCount) {
          this.jumpPage(Math.min(currentPage + 1, pageCount));
        }
      },
      prevJump: function prevJump() {
        var numList = this.numList,
            currentPage = this.currentPage;
        this.jumpPage(Math.max(currentPage - numList.length, 1));
      },
      nextJump: function nextJump() {
        var numList = this.numList,
            currentPage = this.currentPage,
            pageCount = this.pageCount;
        this.jumpPage(Math.min(currentPage + numList.length, pageCount));
      },
      jumpPage: function jumpPage(currentPage) {
        var type = 'current-change';
  
        if (currentPage !== this.currentPage) {
          this.$emit('update:currentPage', currentPage);
  
          tools.UtilTools.emitEvent(this, type, [currentPage]);
  
          this.emitPageChange(type, this.pageSize, currentPage);
        }
      },
      changePageSize: function changePageSize(pageSize) {
        var type = 'size-change';
  
        if (pageSize !== this.pageSize) {
          this.$emit('update:pageSize', pageSize);
  
          tools.UtilTools.emitEvent(this, type, [pageSize]);
  
          this.emitPageChange(type, pageSize, Math.min(this.currentPage, this.getPageCount(this.total, pageSize)));
        }
  
        this.hideSizePanel();
      },
      emitPageChange: function emitPageChange(type, pageSize, currentPage) {
        tools.UtilTools.emitEvent(this, 'page-change', [{
          type: type,
          pageSize: pageSize,
          currentPage: currentPage
        }]);
      },
      toggleSizePanel: function toggleSizePanel() {
        this[this.showSizes ? 'hideSizePanel' : 'showSizePanel']();
      },
      updateZindex: function updateZindex() {
        if (this.panelIndex < tools.UtilTools.getLastZIndex()) {
          this.panelIndex = tools.UtilTools.nextZIndex();
        }
      },
      showSizePanel: function showSizePanel() {
        var _this5 = this;
  
        this.showSizes = true;
        this.updateZindex();
        this.$nextTick(function () {
          var $refs = _this5.$refs;
          var sizeBtn = $refs.sizeBtn,
              sizePanel = $refs.sizePanel;
          _this5.panelStyle = {
            zIndex: _this5.panelIndex,
            bottom: ''.concat(sizeBtn.clientHeight + 6, 'px'),
            left: '-'.concat(sizePanel.clientWidth / 2 - sizeBtn.clientWidth / 2, 'px')
          };
        });
      },
      hideSizePanel: function hideSizePanel() {
        this.showSizes = false;
      }
    }
  };
  return VueXtablePager;
});