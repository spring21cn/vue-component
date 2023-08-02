(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    definition(context.Vue);
  }
})(this, function(Vue) {
  'use strict';
  var VueCardListItem = {
    template: '<div class="vue-card-list-item" :class="itemClass"\
    @click.capture="handleClickCapture" @click="handleClick" v-clickoutside="closeEditState"\
    @touchstart="handleTouchstart" @touchmove="handleTouchmove" @touchend="handleTouchend">\
      <div v-if="showIndex" class="vue-card-list-item-pre-wrapper">\
        <span  class="vue-card-list-item-index"> {{index + 1}}</span> \
      </div>\
      <div class="vue-card-list-item-wrapper">\
        <slot></slot>\
      </div>\
      <div class="vue-card-list-item-action" :class="{\'bottom-action\': bottomAction}" v-if="itemButton && itemButton.length > 0">\
        <i v-for="button in itemButton" :class="[button.icon].concat(button.class)" @click.stop="callClickFunc(button, $event)" @touchstart="iconTouchstart($event, button)"></i>\
      </div>\
      <div class="vue-card-list-item-overlay" v-if="isPlaceholder" @mousedown.stop @touchstart.stop @touchmove.stop @touchend.stop @dblclick.stop @click.stop="addData"><i class="vue-icon-plus"></i></div>\
    </div>',
    directives: {
      Clickoutside: VueUtil.component.clickoutside(),
    },
    props: {
      data: Object,
      readonly: Boolean,
      index: Number,
      isPlaceholder: Boolean,
      itemButton: Array,
    },
    data: function() {
      return {
        itemControl: {
          disabled: true,
        },
        isCurrent: false,
        isNewRow: false,
        showIndex: this.$parent.showIndex,
        listMode: this.$parent.listMode,
        bottomAction: false,
      };
    },
    provide: function() {
      return {
        vueForm: this.itemControl
      };
    },
    watch: {
      isCurrentVal: function() {
        this.isCurrent = this.isCurrentVal;
        if (this.isCurrent) {
          this.$parent.currentNode = this;
        }
      },
      index: function() {
        this.resetActionPosition(true);
      }
    },
    created: function() {
      var isNewRow = this.$parent.insertRows.indexOf(this.data) > -1;
      this.isNewRow = isNewRow;

      if (!isNewRow) {
        this.originData = VueUtil.cloneDeep(this.data);
      }
    },
    computed: {
      itemClass: function() {
        return {
          'editing': this.itemControl.disabled === false,
          'not-editing': this.itemControl.disabled !== false,
          'current': this.isCurrent,
        };
      },
      isCurrentVal: function() {
        return this.$parent.currentRowId === this.data._rowId;
      }
    },
    methods: {
      startEditState: function() {
        if (!this.readonly) {
          this.itemControl.disabled = false;
        }
      },
      closeEditState: function(mouseup, mousedown) {
        if (mousedown.target && !mousedown.target.closest('.vue-popper') && !mousedown.target.closest('.vue-select-dropdown')) {
          this.itemControl.disabled = true;
        }
      },
      setCurrentRow: function() {
        this.$parent.currentNode = this;
        this.$parent.currentRowId = this.data._rowId;
        this.resetActionPosition(true);
      },
      focus: function() {
        this.$nextTick(function() {
          var focusableElms = this.$el.querySelector('input:not([disabled]):not([tabindex=\'-1\']),select:not([disabled]):not([tabindex=\'-1\']),textarea:not([disabled]):not([tabindex=\'-1\']),button:not([disabled]):not([tabindex=\'-1\']),[tabindex]:not([tabindex=\'-1\'])');
          focusableElms && focusableElms.focus();
        });
      },
      handleTouchstart: function(e) {
        this.setCurrentRow();

        if (this.itemControl.disabled) {
          this.touchData = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        }
      },
      handleTouchmove: function(e) {
        if (!this.touchData) {
          return;
        } else {
          var deltaY = e.changedTouches[0].clientY - this.touchData.y;
          if (Math.abs(deltaY) > 50) {
            this.touchData = null;
          }
        }
      },
      handleTouchend: function(e) {
        if (!e.changedTouches[0] || !this.touchData) {
          return;
        }
        var deltaX = e.changedTouches[0].clientX - this.touchData.x;
        var deltaY = e.changedTouches[0].clientY - this.touchData.y;

        this.touchData = null;
  
        if (deltaX < -100 && Math.abs(deltaY) < 50) {
          this.$emit('drag-left');
          return;
        } else if (deltaX > 100 && Math.abs(deltaY) < 50) {
          this.$emit('drag-right');
          return;
        }

        var self = this;

        // if (this.waitForSecondTouch) {
          if (this.itemControl.disabled) {
            setTimeout(function() {
              self.startEditState();
              self.focus();
            }, 100);
          }
        // } else {
        //   this.waitForSecondTouch = true;
        //   setTimeout(function() {
        //     self.waitForSecondTouch = false;
        //   }, 500);
        // }
      },
      handleClickCapture: function() {
        if (!this.isPlaceholder) {
          this.setCurrentRow();
        }
      },
      handleClick: function() {
        if (this.itemControl.disabled) {
          this.startEditState();
          this.focus();
        }
      },
      addData: function() {
        if(!this.$parent.readonly) {
          this.$parent.addData();
        }
        this.$emit('placeholder-click');
      },
      forceResetLabel: function() {
        var broadcast = function() {
          VueUtil.loop(this.$children, function(child) {
            var name = child.$options.name;
            if (name === 'VueFormItem') {
              child.resetLabelWidth();
            } else {
              broadcast.apply(child);
            }
          });
        };
        broadcast.call(this);
      },
      resetActionPosition: function(forceShow) {
        var self = this;
        var actionBtn = self.$el.querySelector('.vue-card-list-item-action'); 
        if (!actionBtn) return;


        var el = this.$el;
        var container = el.parentElement;
        var containerHeight = container.offsetHeight;
        var buttonHeight = 56; //button容器高

        var elRect = el.getBoundingClientRect();

        var elToContainerTop = el.offsetTop - container.scrollTop;
        var elToContainerBottom = container.offsetHeight - elToContainerTop - elRect.height;

        var top;
        var right = window.innerWidth - elRect.right + 20;

        if (actionBtn.actionHidden !== 1) {
          if (elToContainerBottom > containerHeight || elToContainerTop > containerHeight) {
            actionBtn.style.display = 'none';
          } else {
            actionBtn.style.display = null;
          }
        }

        if (elToContainerBottom < buttonHeight && elToContainerTop >= buttonHeight) {
          top = elRect.top - buttonHeight;
          this.bottomAction = false;
        } else {
          this.bottomAction = true;
          top = elRect.top + elRect.height + 10;
        }

        if (forceShow) {
          setTimeout(function() {
            actionBtn.actionHidden = null;
            actionBtn.style.display = null;
          }, 100);
        }
        
        actionBtn.style.top = top + 'px';
        actionBtn.style.right = right + 'px';
      },
      callClickFunc: function(button, event) {
        if (typeof button.click === 'function') {
          button.click(this.data, event);
        } else if (button.click) {
          if (button.click === 'edit') {
            this.handleClick();
          }
          this.$emit(button.click);
        }
      },
      iconTouchstart: function(event, button) {
        if (button.click !== 'drag') {
          event.stopPropagation();
        }
      }
    },
  };

  var VueCardList = {
    template: '<div class="vue-card-list" :class="{\'list-mode\': listMode, readonly: readonly, draggable:canDrag, \'label-responsive\': labelResponsive}" :style="{height: height, flex: flex}" v-clickoutside="hideActionPanel">\
      <div class="vue-card-list-header" v-if="showHeader && $slots.header">\
        <div class="vue-card-list-item-pre-wrapper" v-if="showIndex">\
        </div>\
        <div class="vue-card-list-item-wrapper">\
          <slot name="header"></slot>\
        </div>\
        <div class="vue-card-list-gutter" ref="gutter"></div>\
      </div>\
      <div class="vue-card-list-content" :class="contentClass" ref="content" @scroll="handleScroll">\
        <vue-card-list-item v-if="placeholderItemShow" :data="defaultData || {}" :index="0" :readonly="true" is-placeholder @placeholder-click="$emit(\'placeholder-click\')">\
            <slot v-bind="{data:defaultData || {}, index:1}"></slot>\
        </vue-card-list-item>\
        <vue-card-list-item ref="items" v-for="(d, i) in renderData" :key="d._rowId" :data="d" :index="i" :readonly="readonly" :item-button="itemButton" @drag-left="handleDragLeft(d)" @drag-right="handleDragRight(d)" @edit="handleEdit(d)" @delete="handleDelete(d)" @click.native="handleClick(d)">\
            <slot v-bind="{data:d, index:i + 1}"></slot>\
        </vue-card-list-item>\
        <div v-if="!placeholderRow && renderData.length === 0" class="vue-card-list-empty-wrapper"><slot name="empty-content">{{emptyLabel || $t(\'vue.cardList.noData\')}}</slot></div>\
      </div>\
      <div class="vue-card-list-footer" v-if="!readonly && !placeholderItemShow">\
        <vue-button size="large" type="text" @click="addData()">\
          <i class="vue-icon-plus"></i> \
          {{$t(\'vue.cardList.addButton\')}} \
        </vue-button>\
      </div> \
    </div>',
    name: 'VueCardList',
    components: {
      VueCardListItem: VueCardListItem,
    },
    directives: {
      Clickoutside: VueUtil.component.clickoutside(),
      Scrolling: VueUtil.component.scrolling
    },
    props: {
      data: {
        type: Array,
      },
      draggable: {
        type: Boolean,
        default: false,
      },
      showHeader: {
        type: Boolean,
        default: false,
      },
      listMode: {
        type: Boolean,
        default: false,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
      showIndex: {
        type: Boolean,
        default: true,
      },
      defaultData: {
        type: Object,
      },
      beforeDelete: {
        type: Function,
      },
      placeholderRow: {
        type: Boolean,
        default: false,
      },
      height: {
        type: String,
        default: null
      },
      buttons: {
        type: Array,
        default: null
      },
      labelResponsive: {
        type: Boolean,
        default: false,
      },
      fitContent: {
        type: Boolean,
        default: false,
      },
      xs: {
        type: Number
      },
      sm: {
        type: Number
      },
      md: {
        type: Number
      },
      lg: {
        type: Number
      },
      xl: {
        type: Number
      },
      emptyLabel: {
        type: String,
        default: null
      },
    },
    data: function() {
      return {
        fullData: [],
        currentRowId: null,
        insertRows: [],
        removedRows: [],
        filters: null,
        sorts: null,
        isMobile: VueUtil.getSystemInfo().device == 'Mobile',
      };
    },
    created: function() {
      this.loadData(this.data);
    },
    computed: {
      flex: function() {
        return this.fitContent ? '0 0 auto': '1';
      },
      canDrag: function() {
        return !this.readonly && this.draggable;
      },
      contentClass: function() {
        if (this.listMode) {return null;}

        var contentClass = [];
        var self = this;

        if (this.fullData.length > 0 || this.placeholderItemShow) {
          ['xs', 'sm', 'md', 'lg', 'xl'].forEach(function(size) {
            if (self[size] != null && self[size] > 0) {
              contentClass.push(size + '-' + self[size]);
            }
          });
        }

        return contentClass;
      },
      placeholderItemShow: function() {
        return this.placeholderRow && this.fullData.length === 0;
      },
      itemButton: function() {
        var buttonConfig = [];

        if (this.buttons == null && !this.readonly) {
          buttonConfig = (this.draggable ? ['drag'] : []).concat(['edit', 'delete']);
        } else {
          buttonConfig = this.buttons || [];
        }

        return buttonConfig.map(function(button) {
          if (typeof button === 'string') {
            return {
              drag: {
                icon: 'vue-icon-enlarge',
                class: ['vue-card-list-item-drag'],
              },
              edit: {
                icon: 'vue-icon-edit2',
                class: ['vue-card-list-item-edit'],
                click: 'edit',
              },
              delete: {
                icon: 'vue-icon-delete',
                class: ['vue-card-list-item-delete'],
                click: 'delete'
              }
            }[button];
          } else {
            return button;
          }
        });
      },
      afterFullData: function() {
        var filteredData = VueUtil._filter(this.fullData, this.filters);
        var sortedData = (this.sorts && this.sorts[0]) ? VueUtil.orderBy.call(this, filteredData, this.sorts[0], this.sorts[1]) : filteredData;
        return sortedData;
      },
      renderData: function() {
        return this.afterFullData;
      },
    },
    watch: {
      data: function(val) {
        if (val != this.fullData) {
          this.loadData(val);
        }
      },
      fullData: function(data) {
        var self = this;
        data.forEach(function(item, index) {
          if (self.draggable) {
            if (item._order !== index) {
              item._order = index;
            }
          }

          if (!item._rowId) {
            item._rowId = VueUtil.createUuid();
          }
        });
      },
      currentRowId: function(newVal, oldVal) {
        this.$emit('current-change', this.getRowByRowId(newVal), this.getRowByRowId(oldVal));
      }
    },
    methods: {
      initDrag: function() {

        if (this.sortable) {
          this.sortable.destroy();
        }

        var el = this.$el.querySelector('.vue-card-list-content');
        var self = this;

        this.sortable = Sortable.create(el, {
          handle: '.vue-card-list-item-drag',
          scroll: true,
          group: {
            put: false
          },
          animation: 200,
          onEnd: function (obj) {
            var newIndex = obj.newIndex,
            oldIndex = obj.oldIndex;

            var element = self.fullData.splice(oldIndex, 1)[0];
            if (element) {
              self.fullData.splice(newIndex, 0, element);
              self.$emit('drag', obj);
            }
          }
        });
      },
      addData: function(data) {
        var dataToAdd;
        if (data) {
          dataToAdd = VueUtil.cloneDeep(data);
        } else if (this.defaultData) {
          dataToAdd = VueUtil.cloneDeep(this.defaultData);
        } else if (this.fullData.length > 0) {
          var newData = VueUtil.cloneDeep(this.fullData[0]);
          Object.keys(newData).forEach(function(key) {
            var field = newData[key];
            if (typeof field === 'string') {
              newData[key] = '';
            } else if (typeof field === 'number') {
              newData[key] = 0;
            } else if (typeof field === 'boolean') {
              newData[key] = false;
            } else if (Array.isArray(field)) {
              newData[key] = [];
            } else {
              newData[key] = null;
            }
          });

          dataToAdd = newData;
        } else {
          dataToAdd = {};
        }

        dataToAdd._rowId = VueUtil.createUuid();

        this.fullData.push(dataToAdd);
        this.insertRows.push(dataToAdd);

        this.$nextTick(function() {
          var last = VueUtil.last(this.$refs.items);
          if (last && last.startEditState) {
            last.startEditState();
            last.setCurrentRow();
            last.focus();
            last.forceResetLabel();
          }
        });

      },
      handleDelete: function(d) {
        if (!this.readonly) {
          this.deleteData();
        }

        this.$emit('delete', d);
      },
      deleteData: function(row) {
        var self = this;
        var rowIdToDel = row ? row._rowId : self.currentRowId;

        if (!rowIdToDel) return;

        var delIndex = VueUtil.findIndex(this.fullData, function(dataItem) {
          return dataItem._rowId === rowIdToDel;
        });

        if (this.beforeDelete) {
          var result = this.beforeDelete(this.fullData[delIndex]);
          if (result && result.then) {
            result.then(function() {
              self.doDelete(delIndex);
            }, function() {
              // 删除取消
            });
          } else if (result !== false) {
            this.doDelete(delIndex);
          }
        } else {
          this.doDelete(delIndex);
        }
      },
      doDelete: function(delIndex) {
        if (delIndex != null && delIndex > -1) {
          var removedRow = this.fullData.splice(delIndex, 1)[0];
          var insertIndex = this.insertRows.indexOf(removedRow);

          if (insertIndex > -1) {
            this.insertRows.splice(insertIndex, 1);
          } else {
            this.removedRows.push(removedRow);
          }

          var nextCurrentRow = this.fullData[delIndex] ? this.fullData[delIndex] : VueUtil.last(this.fullData);
          this.currentRowId = nextCurrentRow ? nextCurrentRow._rowId : null;
        }
      },
      handleEdit: function(row) {
        this.$emit('edit', row);
      },
      handleDragLeft: function(data) {
        if (!this.readonly && this.isMobile) {
          this.deleteData();
        }
        this.$emit('drag-left', data);
      },
      handleDragRight: function(data) {
        this.$emit('drag-right', data);
      },
      handleClick: function(data) {
        this.$emit('click', data);
      },
      getRowByRowId: function(id) {
        return VueUtil.find(this.fullData, function(item) {
          return item._rowId === id;
        } );
      },
      getCurrentRow: function() {
        return this.getRowByRowId(this.currentRowId);
      },
      setCurrentRow: function(row) {
        if (typeof row === 'string') {
          this.currentRowId = row;
        } else {
          this.currentRowId = row._rowId;
        }
      },
      getInsertRows: function() {
        return this.insertRows;
      },
      getRemovedRows: function() {
        return this.removedRows;
      },
      getUpdateRows: function() {

        if (!this.$refs.items || this.$refs.items.length === 0) {
          return [];
        }

        var updateRows = this.$refs.items.filter(function(item) {
          return !item.isNewRow && !VueUtil.isEqual(item.data, item.originData);
        }).map(function(item) {
          return item.data;
        });
        return updateRows;
      },
      getChangedData: function() {
        return {
          insertRows: this.getInsertRows(),
          updateRows: this.getUpdateRows(),
          removedRows: this.getRemovedRows(),
        };
      },
      loadData: function(data) {
        if (!Array.isArray(data)) return;
        
        // 先把传入的数据按照_order字段进行排序
        if(this.draggable) {
          data.sort(VueUtil.firstBy(function(item) { return (item._order == undefined ? 99999999 : item._order);}, 'desc'));
        }

        //创建 rowid
        data.forEach(function(item) {
          if (!item._rowId) {
            item._rowId = VueUtil.createUuid();
          }
        });

        // 赋值给fullData 触发视图更新
        this.fullData = data;

        // 重置默认状态，如选中行等等
        this.reset();

        // 恢复changedData数据
        this.resetChangedStatus();
      },
      resetChangedStatus: function() {
        this.$nextTick(function() {
          this.insertRows = [];
          this.removedRows = [];
        });
      },
      resetGutter: function() {
        var contentEl = this.$refs.content;
        if (!contentEl) return;

        var overflowY = contentEl.scrollHeight > contentEl.clientHeight;
        var gutter = this.$refs.gutter;

        if (!gutter) return;

        if (overflowY) {
          if (this.scrollWidth == null) {
            this.scrollWidth = (contentEl.offsetWidth - contentEl.clientWidth - 2) || 0;
          }
          gutter.style.width = this.scrollWidth + 'px';
        } else {
          gutter.style.width = 0;
        }
      },
      reset: function() {
        this.currentRowId = null;
        this.filters = null;
        this.sorts = null;

        this.$nextTick(function() {
          this.resetGutter();
        });
      },
      handleScroll: VueUtil._debounce(function() {
        if (this.isListenerScrollEnd) {
          var content = this.$refs.content;
          var isEnd = content.offsetHeight + content.scrollTop >= content.scrollHeight;
          if (isEnd) {
            this.$emit('scroll-end');
          }
        }
      }, 300),
      handleGlobalScroll: function() {
        if (!this.currentNode) return;
        this.currentNode.resetActionPosition();
      },
      hideActionPanel: function() {
        var actionBtn = this.$el.querySelector('.current .vue-card-list-item-action');
        if (actionBtn) {
          actionBtn.style.display = 'none';
          actionBtn.actionHidden = 1;
        }
      },
      doFilter: function(filters) {
        this.filters = filters;
      },
      doSort: function() {
        this.sorts = arguments;
      }
    },
    mounted: function() {
      this.initDrag();
      document.addEventListener('scroll', this.handleGlobalScroll, true);

      var self = this;

      if (this.$listeners['scroll-end']) {
        this.isListenerScrollEnd = true;
      }
      if (window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(function() {
          self.resetGutter();
        });
        this.resizeObserver.observe(this.$refs.content);
      } else {
        VueUtil.addResizeListener(this.$refs.content, self.resetGutter);
      }
    },
    beforeDestroy: function() {
      if (this.sortable) {
        this.sortable.destroy();
      }
      document.removeEventListener('scroll', this.handleGlobalScroll);

      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      } else {
        VueUtil.removeResizeListener(this.$refs.content, self.resetGutter);
      }
    },
  };
  Vue.component(VueCardList.name, VueCardList);
});
