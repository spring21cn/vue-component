(function (context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue'], definition);
  } else {
    context.VueSplitPanes = definition(context.Vue);
    delete context.VueSplitPanes;
  }
})(this, function (Vue) {
  'use strict';

  function _objectWithoutProperties(obj, keys) {
    var target = {};
    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }
    return target;
  }

  var VueSplitPanes = {
    name: 'VueSplitPanes',
    props: {
      horizontal: {
        type: Boolean
      },
      pushOtherPanes: {
        type: Boolean,
        default: true
      },
      dblClickSplitter: {
        type: Boolean,
        default: true
      },
      rtl: {
        type: Boolean,
        default: false
      },
      // Right to left direction.
      firstSplitter: {
        type: Boolean
      },
      theme: {
        type: [String, Boolean],
        default: 'default'
      }
    },
    provide: function () {
      return {
        requestUpdate: this.requestUpdate,
        onPaneAdd: this.onPaneAdd,
        onPaneRemove: this.onPaneRemove,
        onPaneClick: this.onPaneClick
      };
    },
    data: function () {
      return {
        container: null,
        ready: false,
        panes: [],
        touch: {
          mouseDown: false,
          dragging: false,
          activeSplitter: null
        },
        splitterTaps: {
          // Used to detect double click on touch devices.
          splitter: null,
          timeoutId: null
        }
      };
    },
    computed: {
      panesCount: function () {
        return this.panes.length;
      },
      // Indexed panes by `_uid` of Pane components for fast lookup.
      // Every time a pane is destroyed this index is recomputed.
      indexedPanes: function () {
        return this.panes.reduce(function (obj, pane) {
          return (obj[pane.id] = pane) && obj;
        }, {});
      }
    },
    methods: {
      updatePaneComponents: function () {
        var _this = this;

        // On update refresh the size of each pane through the registered `update` method (in onPaneAdd).
        this.panes.forEach(function (pane) {
          var upd = {};
          upd[_this.horizontal ? 'height' : 'width'] = ''.concat(_this.indexedPanes[pane.id].size, '%');
          pane.update && pane.update(upd);
        });
      },
      bindEvents: function () {
        document.addEventListener('mousemove', this.onMouseMove, {
          passive: false
        });
        document.addEventListener('mouseup', this.onMouseUp); // Passive: false to prevent scrolling while touch dragging.

        if ('ontouchstart' in window) {
          document.addEventListener('touchmove', this.onMouseMove, {
            passive: false
          });
          document.addEventListener('touchend', this.onMouseUp);
        }
      },
      unbindEvents: function () {
        document.removeEventListener('mousemove', this.onMouseMove, {
          passive: false
        });
        document.removeEventListener('mouseup', this.onMouseUp);

        if ('ontouchstart' in window) {
          document.removeEventListener('touchmove', this.onMouseMove, {
            passive: false
          });
          document.removeEventListener('touchend', this.onMouseUp);
        }
      },
      onMouseDown: function (event, splitterIndex) {
        this.bindEvents();
        this.touch.mouseDown = true;
        this.touch.activeSplitter = splitterIndex;
      },
      onMouseMove: function (event) {
        if (this.touch.mouseDown) {
          // Prevent scrolling while touch dragging (only works with an active event, eg. passive: false).
          event.preventDefault();
          this.touch.dragging = true;
          this.calculatePanesSize(this.getCurrentMouseDrag(event));
          this.$emit('resize', this.panes.map(function (pane) {
            return {
              min: pane.min,
              max: pane.max,
              size: pane.size
            };
          }));
        }
      },
      onMouseUp: function () {
        var _this2 = this;

        if (this.touch.dragging) {
          this.$emit('resized', this.panes.map(function (pane) {
            return {
              min: pane.min,
              max: pane.max,
              size: pane.size
            };
          }));
        }

        this.touch.mouseDown = false; // Keep dragging flag until click event is finished (click happens immediately after mouseup)
        // in order to prevent emitting `splitter-click` event if splitter was dragged.

        setTimeout(function () {
          _this2.touch.dragging = false;

          _this2.unbindEvents();
        }, 100);
      },
      // If touch device, detect double tap manually (2 taps separated by less than 500ms).
      onSplitterClick: function (event, splitterIndex) {
        var _this3 = this;

        if ('ontouchstart' in window) {
          event.preventDefault(); // Detect splitter double taps if the option is on.

          if (this.dblClickSplitter) {
            if (this.splitterTaps.splitter === splitterIndex) {
              clearTimeout(this.splitterTaps.timeoutId);
              this.splitterTaps.timeoutId = null;
              this.onSplitterDblClick(event, splitterIndex);
              this.splitterTaps.splitter = null; // Reset for the next tap check.
            } else {
              this.splitterTaps.splitter = splitterIndex;
              this.splitterTaps.timeoutId = setTimeout(function () {
                _this3.splitterTaps.splitter = null;
              }, 500);
            }
          }
        }

        if (!this.touch.dragging) this.$emit('splitter-click', this.panes[splitterIndex]);
      },
      // On splitter dbl click or dbl tap maximize this pane.
      onSplitterDblClick: function (event, splitterIndex) {
        var totalMinSizes = 0;

        var targetSplitter = this.panes[splitterIndex];

        if (targetSplitter.maximized) {
          this.panes.map(function(pane) {
            pane.size = pane.originSize || pane.size;
          });
          targetSplitter.maximized = false;
          this.$emit('pane-restore', targetSplitter);
        } else {
          this.panes = this.panes.map(function (pane, i) {
            pane.originSize = pane.size;
            pane.size = i === splitterIndex ? pane.max : pane.min;
            if (i !== splitterIndex) totalMinSizes += pane.min;
            return pane;
          });
          targetSplitter.maximized = true;
          targetSplitter.size -= totalMinSizes;
          this.$emit('pane-maximize', targetSplitter);
        }
      },
      onPaneClick: function (event, paneId) {
        this.$emit('pane-click', this.indexedPanes[paneId]);
      },
      // Get the cursor position relative to the splitpane container.
      getCurrentMouseDrag: function (event) {
        var rect = this.container.getBoundingClientRect();

        var _ref = 'ontouchstart' in window && event.touches ? event.touches[0] : event,
          clientX = _ref.clientX,
          clientY = _ref.clientY;

        return {
          x: clientX - rect.left,
          y: clientY - rect.top
        };
      },
      // Returns the drag percentage of the splitter relative to the 2 panes it's inbetween.
      // if the sum of size of the 2 cells is 60%, the dragPercentage range will be 0 to 100% of this 60%.
      getCurrentDragPercentage: function (drag) {
        drag = drag[this.horizontal ? 'y' : 'x']; // In the code bellow 'size' refers to 'width' for vertical and 'height' for horizontal layout.

        var containerSize = this.container[this.horizontal ? 'clientHeight' : 'clientWidth'];
        if (this.rtl && !this.horizontal) drag = containerSize - drag;
        return drag * 100 / containerSize;
      },
      calculatePanesSize: function (drag) {
        var splitterIndex = this.touch.activeSplitter;
        var sums = {
          prevPanesSize: this.sumPrevPanesSize(splitterIndex),
          nextPanesSize: this.sumNextPanesSize(splitterIndex),
          prevReachedMinPanes: 0,
          nextReachedMinPanes: 0
        };
        var minDrag = 0 + (this.pushOtherPanes ? 0 : sums.prevPanesSize);
        var maxDrag = 100 - (this.pushOtherPanes ? 0 : sums.nextPanesSize);
        var dragPercentage = Math.max(Math.min(this.getCurrentDragPercentage(drag), maxDrag), minDrag); // If not pushing other panes, panes to resize are right before and right after splitter.

        var panesToResize = [splitterIndex, splitterIndex + 1];
        var paneBefore = this.panes[panesToResize[0]] || null;
        var paneAfter = this.panes[panesToResize[1]] || null;
        var paneBeforeMaxReached = paneBefore.max < 100 && dragPercentage >= paneBefore.max + sums.prevPanesSize;
        var paneAfterMaxReached = paneAfter.max < 100 && dragPercentage <= 100 - (paneAfter.max + this.sumNextPanesSize(splitterIndex + 1)); // Prevent dragging beyond pane max.

        if (paneBeforeMaxReached || paneAfterMaxReached) {
          if (paneBeforeMaxReached) {
            paneBefore.size = paneBefore.max;
            paneAfter.size = Math.max(100 - paneBefore.max - sums.prevPanesSize - sums.nextPanesSize, 0);
          } else {
            paneBefore.size = Math.max(100 - paneAfter.max - sums.prevPanesSize - this.sumNextPanesSize(splitterIndex + 1), 0);
            paneAfter.size = paneAfter.max;
          }

          return;
        } // When pushOtherPanes = true, find the closest expanded pane on each side of the splitter.


        if (this.pushOtherPanes) {
          var vars = this.doPushOtherPanes(sums, dragPercentage);
          if (!vars) return; // Prevent other calculation.

          sums = vars.sums;
          panesToResize = vars.panesToResize;
          paneBefore = this.panes[panesToResize[0]] || null;
          paneAfter = this.panes[panesToResize[1]] || null;
        }

        if (paneBefore !== null) {
          paneBefore.size = Math.min(Math.max(dragPercentage - sums.prevPanesSize - sums.prevReachedMinPanes, paneBefore.min), paneBefore.max);
        }

        if (paneAfter !== null) {
          paneAfter.size = Math.min(Math.max(100 - dragPercentage - sums.nextPanesSize - sums.nextReachedMinPanes, paneAfter.min), paneAfter.max);
        }
      },
      doPushOtherPanes: function (sums, dragPercentage) {
        var _this4 = this;

        var splitterIndex = this.touch.activeSplitter;
        var panesToResize = [splitterIndex, splitterIndex + 1]; // Pushing Down.
        // Going smaller than the current pane min size: take the previous expanded pane.

        if (dragPercentage < sums.prevPanesSize + this.panes[panesToResize[0]].min) {
          panesToResize[0] = this.findPrevExpandedPane(splitterIndex).index;
          sums.prevReachedMinPanes = 0; // If pushing a n-2 or less pane, from splitter, then make sure all in between is at min size.

          if (panesToResize[0] < splitterIndex) {
            this.panes.forEach(function (pane, i) {
              if (i > panesToResize[0] && i <= splitterIndex) {
                pane.size = pane.min;
                sums.prevReachedMinPanes += pane.min;
              }
            });
          }

          sums.prevPanesSize = this.sumPrevPanesSize(panesToResize[0]); // If nothing else to push down, cancel dragging.

          if (panesToResize[0] === undefined) {
            sums.prevReachedMinPanes = 0;
            this.panes[0].size = this.panes[0].min;
            this.panes.forEach(function (pane, i) {
              if (i > 0 && i <= splitterIndex) {
                pane.size = pane.min;
                sums.prevReachedMinPanes += pane.min;
              }
            });
            this.panes[panesToResize[1]].size = 100 - sums.prevReachedMinPanes - this.panes[0].min - sums.prevPanesSize - sums.nextPanesSize;
            return null;
          }
        } // Pushing Up.
        // Pushing up beyond min size is reached: take the next expanded pane.


        if (dragPercentage > 100 - sums.nextPanesSize - this.panes[panesToResize[1]].min) {
          panesToResize[1] = this.findNextExpandedPane(splitterIndex).index;
          sums.nextReachedMinPanes = 0; // If pushing a n+2 or more pane, from splitter, then make sure all in between is at min size.

          if (panesToResize[1] > splitterIndex + 1) {
            this.panes.forEach(function (pane, i) {
              if (i > splitterIndex && i < panesToResize[1]) {
                pane.size = pane.min;
                sums.nextReachedMinPanes += pane.min;
              }
            });
          }

          sums.nextPanesSize = this.sumNextPanesSize(panesToResize[1] - 1); // If nothing else to push up, cancel dragging.

          if (panesToResize[1] === undefined) {
            sums.nextReachedMinPanes = 0;
            this.panes[this.panesCount - 1].size = this.panes[this.panesCount - 1].min;
            this.panes.forEach(function (pane, i) {
              if (i < _this4.panesCount - 1 && i >= splitterIndex + 1) {
                pane.size = pane.min;
                sums.nextReachedMinPanes += pane.min;
              }
            });
            this.panes[panesToResize[0]].size = 100 - sums.prevPanesSize - sums.nextReachedMinPanes - this.panes[this.panesCount - 1].min - sums.nextPanesSize;
            return null;
          }
        }

        return {
          sums: sums,
          panesToResize: panesToResize
        };
      },
      sumPrevPanesSize: function (splitterIndex) {
        return this.panes.reduce(function (total, pane, i) {
          return total + (i < splitterIndex ? pane.size : 0);
        }, 0);
      },
      sumNextPanesSize: function (splitterIndex) {
        return this.panes.reduce(function (total, pane, i) {
          return total + (i > splitterIndex + 1 ? pane.size : 0);
        }, 0);
      },
      // Return the previous pane from siblings which has a size (width for vert or height for horz) of more than 0.
      findPrevExpandedPane: function (splitterIndex) {
        var pane = VueUtil.find(VueUtil.clone(this.panes).reverse(), function (p) {
          return p.index < splitterIndex && p.size > p.min;
        });

        return pane || {};
      },
      // Return the next pane from siblings which has a size (width for vert or height for horz) of more than 0.
      findNextExpandedPane: function (splitterIndex) {
        var pane = VueUtil.find(this.panes, function (p) {
          return p.index > splitterIndex + 1 && p.size > p.min;
        });
        return pane || {};
      },
      checkSplitpanesNodes: function () {
        VueUtil.forEach(this.container.children, function (child) {
          var isPane = child.classList.contains('vue-split-panes__pane');
          var isSplitter = child.classList.contains('vue-split-panes__splitter'); // Node is not a Pane or a splitter: remove it.

          if (!isPane && !isSplitter) {
            child.parentNode.removeChild(child); // el.remove() doesn't work on IE11.
            // eslint-disable-next-line no-console

            console.warn('vue-split-panes: Only <vue-split-pane> elements are allowed at the root of <vue-split-panes>. One of your DOM nodes was removed.');
            return;
          }
        });
      },
      addSplitter: function (paneIndex, nextPaneNode) {
        var _this5 = this;

        var isVeryFirst = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var splitterIndex = paneIndex - 1;
        var elm = document.createElement('div');
        elm.classList.add('vue-split-panes__splitter');

        if (!isVeryFirst) {
          elm.onmousedown = function (event) {
            return _this5.onMouseDown(event, splitterIndex);
          };

          if (typeof window !== 'undefined' && 'ontouchstart' in window) {
            elm.ontouchstart = function (event) {
              return _this5.onMouseDown(event, splitterIndex);
            };
          }

          elm.onclick = function (event) {
            return _this5.onSplitterClick(event, splitterIndex + 1);
          };
        }

        if (this.dblClickSplitter) {
          elm.ondblclick = function (event) {
            return _this5.onSplitterDblClick(event, splitterIndex + 1);
          };
        }

        nextPaneNode.parentNode.insertBefore(elm, nextPaneNode);
      },
      removeSplitter: function (node) {
        node.onmousedown = undefined;
        node.onclick = undefined;
        node.ondblclick = undefined;
        node.parentNode.removeChild(node); // el.remove() doesn't work on IE11.
      },
      redoSplitters: function () {
        var _this6 = this;

        var children = Array.prototype.slice.call(this.container.children);
        children.forEach(function (el) {
          if (VueUtil.hasClass(el, 'vue-split-panes__splitter')) _this6.removeSplitter(el);
        });
        var paneIndex = 0;
        children.forEach(function (el) {
          if (VueUtil.hasClass(el, 'vue-split-panes__pane')) {
            if (!paneIndex && _this6.firstSplitter) _this6.addSplitter(paneIndex, el, true); else if (paneIndex) _this6.addSplitter(paneIndex, el);
            paneIndex++;
          }
        });
      },
      // Called by Pane component on programmatic resize.
      requestUpdate: function (_ref2) {
        var target = _ref2.target,
          args = _objectWithoutProperties(_ref2, ['target']);

        var pane = this.indexedPanes[target._uid];
        Object.entries(args).forEach(function (arg) {
          var key = arg[0];
          var value = arg[1];

          return pane[key] = value;
        });
      },
      onPaneAdd: function (pane) {
        var _this7 = this;

        // 1. Add pane to array at the same index it was inserted in the <vue-split-panes> tag.
        var index = -1;
        VueUtil.some(pane.$el.parentNode.children, function (el) {
          if (VueUtil.hasClass(el, 'vue-split-panes__pane')) index++;
          return el === pane.$el;
        });
        var min = parseFloat(pane.minSize);
        var max = parseFloat(pane.maxSize);
        this.panes.splice(index, 0, {
          id: pane._uid,
          index: index,
          min: isNaN(min) ? 0 : min,
          max: isNaN(max) ? 100 : max,
          size: pane.size === null ? null : parseFloat(pane.size),
          givenSize: pane.size,
          update: pane.update
        }); // Redo indexes after insertion for other shifted panes.

        this.panes.forEach(function (p, i) {
          return p.index = i;
        });

        if (this.ready) {
          this.$nextTick(function () {
            // 2. Add the splitter.
            _this7.redoSplitters(); // 3. Resize the panes.


            _this7.resetPaneSizes({
              addedPane: _this7.panes[index]
            }); // 4. Fire `pane-add` event.


            _this7.$emit('pane-add', {
              index: index,
              panes: _this7.panes.map(function (pane) {
                return {
                  min: pane.min,
                  max: pane.max,
                  size: pane.size
                };
              })
            });
          });
        }
      },
      onPaneRemove: function (pane) {
        var _this8 = this;

        // 1. Remove the pane from array and redo indexes.
        var index = VueUtil.findIndex(this.panes, function (p) {
          return p.id === pane._uid;
        });
        var removed = this.panes.splice(index, 1)[0];
        this.panes.forEach(function (p, i) {
          return p.index = i;
        });
        this.$nextTick(function () {
          // 2. Remove the splitter.
          _this8.redoSplitters(); // 3. Resize the panes.


          var r = VueUtil.clone(removed) || {};
          r.index = index;

          _this8.resetPaneSizes({
            removedPane: r
          }); // 4. Fire `pane-remove` event.


          _this8.$emit('pane-remove', {
            removed: removed,
            panes: _this8.panes.map(function (pane) {
              return {
                min: pane.min,
                max: pane.max,
                size: pane.size
              };
            })
          });
        });
      },
      resetPaneSizes: function () {
        var changedPanes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        if (!changedPanes.addedPane && !changedPanes.removedPane) this.initialPanesSizing(); else if (this.panes.some(function (pane) {
          return pane.givenSize !== null || pane.min || pane.max < 100;
        })) this.equalizeAfterAddOrRemove(changedPanes); else this.equalize();
        if (this.ready) this.$emit('resized', this.panes.map(function (pane) {
          return {
            min: pane.min,
            max: pane.max,
            size: pane.size
          };
        }));
      },
      equalize: function () {
        var equalSpace = 100 / this.panesCount;
        var leftToAllocate = 0;
        var ungrowable = [];
        var unshrinkable = [];
        this.panes.forEach(function (pane) {
          pane.size = Math.max(Math.min(equalSpace, pane.max), pane.min);
          leftToAllocate -= pane.size;
          if (pane.size >= pane.max) ungrowable.push(pane.id);
          if (pane.size <= pane.min) unshrinkable.push(pane.id);
        });
        if (leftToAllocate > 0.1) this.readjustSizes(leftToAllocate, ungrowable, unshrinkable);
      },
      initialPanesSizing: function () {
        var _this9 = this;

        var equalSpace = 100 / this.panesCount;
        var leftToAllocate = 100;
        var ungrowable = [];
        var unshrinkable = [];
        var definedSizes = 0; // Check if pre-allocated space is 100%.

        this.panes.forEach(function (pane) {
          leftToAllocate -= pane.size;
          if (pane.size !== null) definedSizes++;
          if (pane.size >= pane.max) ungrowable.push(pane.id);
          if (pane.size <= pane.min) unshrinkable.push(pane.id);
        }); // set pane sizes if not set.

        var leftToAllocate2 = 100;

        if (leftToAllocate > 0.1) {
          this.panes.forEach(function (pane) {
            if (pane.size === null) {
              pane.size = Math.max(Math.min(leftToAllocate / (_this9.panesCount - definedSizes), pane.max), pane.min);
            }

            leftToAllocate2 -= pane.size;
          });
          if (leftToAllocate2 > 0.1) this.readjustSizes(leftToAllocate, ungrowable, unshrinkable);
        }
      },
      equalizeAfterAddOrRemove: function () {
        var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          addedPane = _ref5.addedPane,
          removedPane = _ref5.removedPane;

        var equalSpace = 100 / this.panesCount;
        var leftToAllocate = 0;
        var ungrowable = [];
        var unshrinkable = [];

        if (addedPane && addedPane.givenSize !== null) {
          equalSpace = (100 - addedPane.givenSize) / (this.panesCount - 1);
        } // Check if pre-allocated space is 100%.


        this.panes.forEach(function (pane) {
          leftToAllocate -= pane.size;
          if (pane.size >= pane.max) ungrowable.push(pane.id);
          if (pane.size <= pane.min) unshrinkable.push(pane.id);
        });
        if (Math.abs(leftToAllocate) < 0.1) return; // Ok.

        this.panes.forEach(function (pane) {
          if (addedPane && addedPane.givenSize !== null && addedPane.id === pane.id) { } else pane.size = Math.max(Math.min(equalSpace, pane.max), pane.min);

          leftToAllocate -= pane.size;
          if (pane.size >= pane.max) ungrowable.push(pane.id);
          if (pane.size <= pane.min) unshrinkable.push(pane.id);
        });
        if (leftToAllocate > 0.1) this.readjustSizes(leftToAllocate, ungrowable, unshrinkable);
      },

      /* recalculatePaneSizes ({ addedPane, removedPane } = {}) {
        let leftToAllocate = 100
        let equalSpaceToAllocate = leftToAllocate / this.panesCount
        let ungrowable = []
        let unshrinkable = []
        // When adding a pane with no size, apply min-size if defined otherwise divide another pane
        // (next or prev) in 2.
        // if (addedPane && addedPane.size === null) {
        //   if (addedPane.min) addedPane.size = addedPane.min
        //   else {
        //     const paneToDivide = this.panes[addedPane.index + 1] || this.panes[addedPane.index - 1]
        //     if (paneToDivide) {
        //       // @todo: Dividing that pane in 2 could be incorrect if becoming lower than its min size.
        //       addedPane.size = paneToDivide.size / 2
        //       paneToDivide.size /= 2
        //     }
        //   }
        // }
        this.panes.forEach((pane, i) => {
          // Added pane - reduce the size of the next pane.
          if (addedPane && addedPane.index + 1 === i) {
            pane.size = Math.max(Math.min(100 - this.sumPrevPanesSize(i) - this.sumNextPanesSize(i + 1), pane.max), pane.min)
            // @todo: if could not allocate correctly, try to allocate in the next pane straight away,
            // then still do the second loop if not correct.
          }
          // Removed pane - increase the size of the next pane.
          else if (removedPane && removedPane.index === i) {
            pane.size = Math.max(Math.min(100 - this.sumPrevPanesSize(i) - this.sumNextPanesSize(i + 1), pane.max), pane.min)
            // @todo: if could not allocate correctly, try to allocate in the next pane straight away,
            // then still do the second loop if not correct.
          }
          // Initial load and on demand recalculation.
          else if (!addedPane && !removedPane && pane.size === null) {
            pane.size = Math.max(Math.min(equalSpaceToAllocate, pane.max), pane.min)
          }
          leftToAllocate -= pane.size
          if (pane.size >= pane.max) ungrowable.push(pane.id)
          if (pane.size <= pane.min) unshrinkable.push(pane.id)
        })
        // Do one more loop to adjust sizes if still wrong.
        // > 0.1: Prevent maths rounding issues due to bytes.
        if (Math.abs(leftToAllocate) > 0.1) this.readjustSizes(leftToAllocate, ungrowable, unshrinkable)
      }, */
      // Second loop to adjust sizes now that we know more about the panes constraints.
      readjustSizes: function (leftToAllocate, ungrowable, unshrinkable) {
        var _this10 = this;

        var equalSpaceToAllocate;
        if (leftToAllocate > 0) equalSpaceToAllocate = leftToAllocate / (this.panesCount - ungrowable.length); else equalSpaceToAllocate = leftToAllocate / (this.panesCount - unshrinkable.length);
        this.panes.forEach(function (pane, i) {
          if (leftToAllocate > 0 && !VueUtil.includes(ungrowable, pane.id)) {
            // Need to diff the size before and after to get the exact allocated space.
            var newPaneSize = Math.max(Math.min(pane.size + equalSpaceToAllocate, pane.max), pane.min);
            var allocated = newPaneSize - pane.size;
            leftToAllocate -= allocated;
            pane.size = newPaneSize;
          } else if (!VueUtil.includes(unshrinkable, pane.id)) {
            // Need to diff the size before and after to get the exact allocated space.
            var _newPaneSize = Math.max(Math.min(pane.size + equalSpaceToAllocate, pane.max), pane.min);

            var _allocated = _newPaneSize - pane.size;

            leftToAllocate -= _allocated;
            pane.size = _newPaneSize;
          } // Update each pane through the registered `update` method.

          var upd = {};
          upd[_this10.horizontal ? 'height' : 'width'] = ''.concat(_this10.indexedPanes[pane.id].size, '%');
          pane.update(upd);
        });

        if (Math.abs(leftToAllocate) > 0.1) {
          // > 0.1: Prevent maths rounding issues due to bytes.
          // Don't emit on hot reload when Vue destroys panes.
          this.$nextTick(function () {
            if (_this10.ready) {
              // eslint-disable-next-line no-console
              console.warn('vue-split-panes: Could not resize panes correctly due to their constraints.');
            }
          });
        }
      }
      /* distributeEmptySpace () {
        let growablePanes = []
        let collapsedPanesCount = 0
        let growableAmount = 0 // Total of how much the current panes can grow to fill blank space.
        let spaceToDistribute = 100 - this.panes.reduce((sum, pane) => (sum += pane.size) && sum, 0)
        // Do a first loop to determine if we can distribute the new blank space between all the
        // expandedPanes, without expanding the collapsed ones.
        this.panes.forEach(pane => {
          if (pane.size < pane.max) growablePanes.push(pane)
          if (!pane.size) collapsedPanesCount++
          else growableAmount += pane.max - pane.size
        })
        // If the blank space to distribute is too great for the expanded panes, also expand collapsed ones.
        let expandCollapsedPanes = growableAmount < spaceToDistribute
        // New space to distribute equally.
        let growablePanesCount = (growablePanes.length - (expandCollapsedPanes ? 0 : collapsedPanesCount))
        let equalSpaceToDistribute = spaceToDistribute / growablePanesCount
        // if (growablePanesCount === 1) equalSpace = 100 / this.panesCount
        let spaceLeftToDistribute = spaceToDistribute
        // Now add the equalSpaceToDistribute to each pane size accordingly.
        growablePanes.forEach(pane => {
          if (pane.size < pane.max && (pane.size || (!pane.size && expandCollapsedPanes))) {
            const newSize = Math.min(pane.size + equalSpaceToDistribute, pane.max)
            let allocatedSpace = (newSize - pane.size)
            spaceLeftToDistribute -= allocatedSpace
            pane.size = newSize
            // If the equalSpaceToDistribute is not fully added to the current pane, distribute the remainder
            // to the next panes.
            // Also fix decimal issue due to bites - E.g. calculating 8.33 and getting 8.3299999999999
            if (equalSpaceToDistribute - allocatedSpace > 0.1) equalSpaceToDistribute = spaceLeftToDistribute / (--growablePanesCount)
          }
        })
        /* Disabled otherwise will show up on hot reload.
        // if there is still space to allocate show warning message.
        if (this.panesCount && ~~spaceLeftToDistribute) {
          // eslint-disable-next-line no-console
          console.warn('vue-split-panes: Could not distribute all the empty space between panes due to their constraints.')
        } *\/
        this.$emit('resized', this.panes.map(pane => ({ min: pane.min, max: pane.max, size: pane.size })))
      } */

    },
    watch: {
      panes: {
        // Every time a pane is updated, update the panes accordingly.
        deep: true,
        immediate: false,
        handler: function () {
          this.updatePaneComponents();
        }
      },
      horizontal: function () {
        this.updatePaneComponents();
      },
      firstSplitter: function () {
        this.redoSplitters();
      },
      dblClickSplitter: function (enable) {
        var _this11 = this;

        var splitters = Array.prototype.slice.call(this.container.querySelectorAll('.vue-split-panes__splitter'));

        splitters.forEach(function (splitter, i) {
          splitter.ondblclick = enable ? function (event) {
            return _this11.onSplitterDblClick(event, i);
          } : undefined;
        });
      }
    },
    beforeDestroy: function () {
      // Prevent emitting console warnings on hot reloading.
      this.ready = false;
    },
    mounted: function () {
      this.container = this.$refs.container;
      this.checkSplitpanesNodes();
      this.redoSplitters();
      this.resetPaneSizes();
      this.$emit('ready');
      this.ready = true;
    },
    render: function (h) {
      return h('div', {
        ref: 'container',
        class: ['vue-split-panes', 'vue-split-panes--'.concat(this.horizontal ? 'horizontal' : 'vertical'), {
          'vue-split-panes--dragging': this.touch.dragging
        }, this.theme ? this.theme + '-theme' : '']
      }, this.$slots.default);
    }

  };
  Vue.component(VueSplitPanes.name, VueSplitPanes);
});
