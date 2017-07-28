!(function (name, context, definition) {
    'use strict';
    context[name] = definition();
}) ('OrgChart', this, function () {
    var removeNode = function (node) {
        node.parentElement.removeChild(node);
    };
    var merge = function (target) {
        for (var i = 1, j = arguments.length; i < j; i++) {
            var source = arguments[i] || {
            };
            for (var prop in source) {
                var value = source[prop];
                if (value !== undefined) {
                    target[prop] = value;
                }
            }
        }
        return target;
    };
    var Arrayfrom = function (arr) {
        var isCallable = function (fn) {
            return typeof fn === 'function' || Object.prototype.toString.call(fn) === '[object Function]';
        };
        var toInteger = function (value) {
            var number = Number(value);
            if (isNaN(number)) {
                return 0;
            }
            if (number === 0 || !isFinite(number)) {
                return number;
            }
            return (number > 0 ? 1 : - 1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };
        var from = function (arrayLike) {
            var C = this;
            var items = Object(arrayLike);
            if (arrayLike == null) {
                throw new TypeError('Arrayfrom requires an array-like object - not null or undefined');
            }
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined') {
                if (!isCallable(mapFn)) {
                    throw new TypeError('Arrayfrom: when provided, the second argument must be a function');
                }
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }
            var len = toLength(items.length);
            var A = isCallable(C) ? Object(new C(len))  : new Array(len);
            var k = 0;
            var kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k)  : mapFn.call(T, kValue, k);
                } else {
                    A[k] = kValue;
                }
                k += 1;
            }
            A.length = len;
            return A;
        }
        return from(arr);
    };
    var OrgChart = function (options) {
        this._name = 'OrgChart';
        Promise.prototype.finally = function (callback) {
            var P = this.constructor;
            return this.then(function (value) {
                return P.resolve(callback()).then(function () {
                    return value
                })
            }, function (reason) {
                return P.resolve(callback()).then(function () {
                    throw reason;
                })
            });
        }
        ;
        var that = this,
        defaultOptions = {
            'nodeTitle': 'name',
            'nodeId': 'id',
            'toggleSiblingsResp': false,
            'depth': 999,
            'chartClass': '',
            'exportButton': false,
            'exportFilename': 'OrgChart',
            'parentNodeSymbol': 'fa-users',
            'draggable': false,
            'direction': 't2b',
            'pan': false,
            'zoom': false
        },
        opts = merge(defaultOptions, options),
        data = opts.data,
        chart = document.createElement('div'),
        chartContainer = document.querySelector(opts.chartContainer);
        this.options = opts;
        delete this.options.data;
        this.chart = chart;
        this.chartContainer = chartContainer;
        chart.dataset.options = JSON.stringify(opts);
        chart.setAttribute('class', 'orgchart' + (opts.chartClass !== '' ? ' ' + opts.chartClass : '') + (opts.direction !== 't2b' ? ' ' + opts.direction : ''));
        if (typeof data === 'object') {
            this.buildHierarchy(chart, opts.ajaxURL ? data : this._attachRel(data, '00'), 0);
        } else if (typeof data === 'string' && data.startsWith('#')) {
            this.buildHierarchy(chart, this._buildJsonDS(document.querySelector(data).children[0]), 0);
        } else {
            var spinner = document.createElement('i');
            spinner.setAttribute('class', 'fa fa-circle-o-notch fa-spin spinner');
            chart.appendChild(spinner);
            this._getJSON(data).then(function (resp) {
                that.buildHierarchy(chart, opts.ajaxURL ? resp : that._attachRel(resp, '00'), 0);
            }).catch (function (err) {
                console.error('failed to fetch datasource for orgchart', err);
            }).finally (function () {
                var spinner = chart.querySelector('.spinner');
                removeNode(spinner);
            });
        }
        chart.addEventListener('click', this._clickChart.bind(this));
        if (opts.exportButton && !chartContainer.querySelector('.oc-export-btn')) {
            var exportBtn = document.createElement('button'),
            downloadBtn = document.createElement('a');
            exportBtn.setAttribute('class', 'oc-export-btn' + (opts.chartClass !== '' ? ' ' + opts.chartClass : ''));
            exportBtn.innerHTML = 'Export';
            exportBtn.addEventListener('click', this._clickExportButton.bind(this));
            downloadBtn.setAttribute('class', 'oc-download-btn' + (opts.chartClass !== '' ? ' ' + opts.chartClass : ''));
            downloadBtn.setAttribute('download', opts.exportFilename + '.png');
            chartContainer.appendChild(exportBtn);
            chartContainer.appendChild(downloadBtn);
        }
        if (opts.pan) {
            chartContainer.style.overflow = 'hidden';
            chart.addEventListener('mousedown', this._onPanStart.bind(this));
            chart.addEventListener('touchstart', this._onPanStart.bind(this));
            document.body.addEventListener('mouseup', this._onPanEnd.bind(this));
            document.body.addEventListener('touchend', this._onPanEnd.bind(this));
        }
        if (opts.zoom) {
            chartContainer.addEventListener('wheel', this._onWheeling.bind(this));
            chartContainer.addEventListener('touchstart', this._onTouchStart.bind(this));
            document.body.addEventListener('touchmove', this._onTouchMove.bind(this));
            document.body.addEventListener('touchend', this._onTouchEnd.bind(this));
        }
        chartContainer.appendChild(chart);
    };
    OrgChart.prototype.getName = function () {
        return this._name;
    }
    OrgChart.prototype._closest = function (el, fn) {
        return el && ((fn(el) && el !== this.chart) ? el : this._closest(el.parentNode, fn));
    }
    OrgChart.prototype._siblings = function (el, expr) {
        return Arrayfrom(el.parentNode.children).filter(function (child) {
            if (child !== el) {
                if (expr) {
                    return el.matches(expr);
                }
                return true;
            }
            return false;
        });
    }
    OrgChart.prototype._prevAll = function (el, expr) {
        var sibs = [
        ],
        prevSib = el.previousElementSibling;
        while (prevSib) {
            if (!expr || prevSib.matches(expr)) {
                sibs.push(prevSib);
            }
            prevSib = prevSib.previousElementSibling;
        }
        return sibs;
    }
    OrgChart.prototype._nextAll = function (el, expr) {
        var sibs = [
        ];
        var nextSib = el.nextElementSibling;
        while (nextSib) {
            if (!expr || nextSib.matches(expr)) {
                sibs.push(nextSib);
            }
            nextSib = nextSib.nextElementSibling;
        }
        return sibs;
    }
    OrgChart.prototype._isVisible = function (el) {
        return el.offsetParent !== null;
    }
    OrgChart.prototype._addClass = function (elements, classNames) {
        elements.forEach(function (el) {
            if (classNames.indexOf(' ') > 0) {
                classNames.split(' ').forEach(function (className) {
                    return el.classList.add(className)
                });
            } else {
                el.classList.add(classNames);
            }
        });
    }
    OrgChart.prototype._removeClass = function (elements, classNames) {
        elements.forEach(function (el) {
            if (classNames.indexOf(' ') > 0) {
                classNames.split(' ').forEach(function (className) {
                    return el.classList.remove(className)
                });
            } else {
                el.classList.remove(classNames);
            }
        });
    }
    OrgChart.prototype._css = function (elements, prop, val) {
        elements.forEach(function (el) {
            el.style[prop] = val;
        });
    }
    OrgChart.prototype._removeAttr = function (elements, attr) {
        elements.forEach(function (el) {
            el.removeAttribute(attr);
        });
    }
    OrgChart.prototype._one = function (el, type, listener, self) {
        var one = function (event) {
            try {
                listener.call(self, event);
            } finally {
                el.removeEventListener(type, one);
            }
        };
        el.addEventListener(type, one);
    }
    OrgChart.prototype._getDescElements = function (ancestors, selector) {
        var results = [
        ];
        ancestors.forEach(function (el) {
            results.push(el.querySelectorAll(selector))
        });
        return results;
    }
    OrgChart.prototype._getJSON = function (url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            function handler() {
                if (this.readyState !== 4) {
                    return;
                }
                if (this.status === 200) {
                    resolve(JSON.parse(this.response));
                } else {
                    reject(new Error(this.statusText));
                }
            }
            xhr.open('GET', url);
            xhr.onreadystatechange = handler;
            xhr.responseType = 'json';
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
        });
    }
    OrgChart.prototype._buildJsonDS = function (li) {
        var subObj = {
            'name': li.firstChild.textContent.trim(),
            'relationship': (li.parentNode.parentNode.nodeName === 'LI' ? '1' : '0') + (li.parentNode.children.length > 1 ? 1 : 0) + (li.children.length ? 1 : 0)
        };
        if (li.id) {
            subObj.id = li.id;
        }
        if (li.querySelector('ul')) {
            Arrayfrom(li.querySelector('ul').children).forEach(function (el) {
                if (!subObj.children) {
                    subObj.children = [
                    ];
                }
                subObj.children.push(this._buildJsonDS(el));
            });
        }
        return subObj;
    }
    OrgChart.prototype._attachRel = function (data, flags) {
        data.relationship = flags + (data.children && data.children.length > 0 ? 1 : 0);
        if (data.children) {
            for (var item in data.children) {
                this._attachRel(item, '1' + (data.children.length > 1 ? 1 : 0));
            }
        }
        return data;
    }
    OrgChart.prototype._repaint = function (node) {
        if (node) {
            node.style.offsetWidth = node.offsetWidth;
        }
    }
    OrgChart.prototype._isInAction = function (node) {
        return node.querySelector('.edge').className.indexOf('fa-') > - 1;
    }
    OrgChart.prototype._getNodeState = function (node, relation) {
        var criteria,
        state = {
            'exist': false,
            'visible': false
        };
        if (relation === 'parent') {
            criteria = this._closest(node, function (el) {
                return el.classList && el.classList.contains('nodes')
            });
            if (criteria) {
                state.exist = true;
            }
            if (state.exist && this._isVisible(criteria.parentNode.children[0])) {
                state.visible = true;
            }
        } else if (relation === 'children') {
            criteria = this._closest(node, function (el) {
                return el.nodeName === 'TR'
            }).nextElementSibling;
            if (criteria) {
                state.exist = true;
            }
            if (state.exist && this._isVisible(criteria)) {
                state.visible = true;
            }
        } else if (relation === 'siblings') {
            criteria = this._siblings(this._closest(node, function (el) {
                return el.nodeName === 'TABLE'
            }).parentNode);
            if (criteria.length) {
                state.exist = true;
            }
            var self = this;
            if (state.exist && criteria.some(function (el) {
                return self._isVisible(el)
            })) {
                state.visible = true;
            }
        }
        return state;
    }
    OrgChart.prototype.getRelatedNodes = function (node, relation) {
        if (relation === 'parent') {
            return this._closest(node, function (el) {
                return el.classList.contains('nodes')
            }).parentNode.children[0].querySelector('.node');
        } else if (relation === 'children') {
            return Arrayfrom(this._closest(node, function (el) {
                return el.nodeName === 'TABLE'
            }).lastChild.children).map(function (el) {
                return el.querySelector('.node')
            });
        } else if (relation === 'siblings') {
            return this._siblings(this._closest(node, function (el) {
                return el.nodeName === 'TABLE'
            }).parentNode).map(function (el) {
                return el.querySelector('.node')
            });
        }
        return [];
    }
    OrgChart.prototype._switchHorizontalArrow = function (node) {
        var opts = this.options,
        leftEdge = node.querySelector('.leftEdge'),
        rightEdge = node.querySelector('.rightEdge'),
        temp = this._closest(node, function (el) {
            return el.nodeName === 'TABLE'
        }).parentNode;
        if (opts.toggleSiblingsResp && (typeof opts.ajaxURL === 'undefined' || this._closest(node, function (el) {
            return el.classList.contains('.nodes')
        }).dataset.siblingsLoaded)) {
            var prevSib = temp.previousElementSibling,
            nextSib = temp.nextElementSibling;
            if (prevSib) {
                if (prevSib.classList.contains('hidden')) {
                    leftEdge.classList.add('fa-chevron-left');
                    leftEdge.classList.remove('fa-chevron-right');
                } else {
                    leftEdge.classList.add('fa-chevron-right');
                    leftEdge.classList.remove('fa-chevron-left');
                }
            }
            if (nextSib) {
                if (nextSib.classList.contains('hidden')) {
                    rightEdge.classList.add('fa-chevron-right');
                    rightEdge.classList.remove('fa-chevron-left');
                } else {
                    rightEdge.classList.add('fa-chevron-left');
                    rightEdge.classList.remove('fa-chevron-right');
                }
            }
        } else {
            var sibs = this._siblings(temp),
            sibsVisible = sibs.length ? !sibs.some(function (el) {
                return el.classList.contains('hidden')
            })  : false;
            leftEdge.classList.toggle('fa-chevron-right', sibsVisible);
            leftEdge.classList.toggle('fa-chevron-left', !sibsVisible);
            rightEdge.classList.toggle('fa-chevron-left', sibsVisible);
            rightEdge.classList.toggle('fa-chevron-right', !sibsVisible);
        }
    }
    OrgChart.prototype._hoverNode = function (event) {
        var node = event.target,
        flag = false,
        topEdge = node.querySelector('.topEdge'),
        bottomEdge = node.querySelector('.bottomEdge'),
        leftEdge = node.querySelector('.leftEdge');
        if (event.type === 'mouseenter') {
            if (topEdge) {
                flag = this._getNodeState(node, 'parent').visible;
                topEdge.classList.toggle('fa-chevron-up', !flag);
                topEdge.classList.toggle('fa-chevron-down', flag);
            }
            if (bottomEdge) {
                flag = this._getNodeState(node, 'children').visible;
                bottomEdge.classList.toggle('fa-chevron-down', !flag);
                bottomEdge.classList.toggle('fa-chevron-up', flag);
            }
            if (leftEdge) {
                this._switchHorizontalArrow(node);
            }
        } else {
            Arrayfrom(node.querySelectorAll('.edge')).forEach(function (el) {
                el.classList.remove('fa-chevron-up', 'fa-chevron-down', 'fa-chevron-right', 'fa-chevron-left');
            });
        }
    }
    OrgChart.prototype._clickNode = function (event) {
        var clickedNode = event.currentTarget,
        focusedNode = this.chart.querySelector('.focused');
        if (focusedNode) {
            focusedNode.classList.remove('focused');
        }
        clickedNode.classList.add('focused');
    }
    OrgChart.prototype._buildParentNode = function (currentRoot, nodeData, callback) {
        var that = this,
        table = document.createElement('table');
        nodeData.relationship = nodeData.relationship || '001';
        this._createNode(nodeData, 0).then(function (nodeDiv) {
            var chart = that.chart;
            nodeDiv.classList.remove('slide-up');
            nodeDiv.classList.add('slide-down');
            var parentTr = document.createElement('tr'),
            superiorLine = document.createElement('tr'),
            inferiorLine = document.createElement('tr'),
            childrenTr = document.createElement('tr');
            parentTr.setAttribute('class', 'hidden');
            parentTr.innerHTML = '<td colspan="2"></td>';
            table.appendChild(parentTr);
            superiorLine.setAttribute('class', 'lines hidden');
            superiorLine.innerHTML = '<td colspan="2"><div class="downLine"></div></td>';
            table.appendChild(superiorLine);
            inferiorLine.setAttribute('class', 'lines hidden');
            inferiorLine.innerHTML = '<td class="rightLine">&nbsp;</td><td class="leftLine">&nbsp;</td>';
            table.appendChild(inferiorLine);
            childrenTr.setAttribute('class', 'nodes');
            childrenTr.innerHTML = '<td colspan="2"></td>';
            table.appendChild(childrenTr);
            table.querySelector('td').appendChild(nodeDiv);
            chart.insertBefore(table, chart.children[0]);
            table.children[3].children[0].appendChild(chart.lastChild);
            callback();
        }).catch (function (err) {
            console.error('Failed to create parent node', err);
        });
    }
    OrgChart.prototype._switchVerticalArrow = function (arrow) {
        arrow.classList.toggle('fa-chevron-up');
        arrow.classList.toggle('fa-chevron-down');
    }
    OrgChart.prototype.showParent = function (node) {
        var temp = this._prevAll(this._closest(node, function (el) {
            return el.classList.contains('nodes')
        }));
        this._removeClass(temp, 'hidden');
        this._addClass(Array(temp[0].children).slice(1, - 1), 'hidden');
        var parent = temp[2].querySelector('.node');
        this._one(parent, 'transitionend', function () {
            parent.classList.remove('slide');
            if (this._isInAction(node)) {
                this._switchVerticalArrow(node.querySelector('.topEdge'));
            }
        }, this);
        this._repaint(parent);
        parent.classList.add('slide');
        parent.classList.remove('slide-down');
    }
    OrgChart.prototype.showSiblings = function (node, direction) {
        var siblings = [
        ],
        temp = this._closest(node, function (el) {
            return el.nodeName === 'TABLE'
        }).parentNode;
        if (direction) {
            siblings = direction === 'left' ? this._prevAll(temp)  : this._nextAll(temp);
        } else {
            siblings = this._siblings(temp);
        }
        this._removeClass(siblings, 'hidden');
        var upperLevel = this._prevAll(this._closest(node, function (el) {
            return el.classList.contains('nodes')
        }));
        temp = Arrayfrom(upperLevel[0].querySelectorAll('.hidden'));
        if (direction) {
            this._removeClass(temp.slice(0, siblings.length * 2), 'hidden');
        } else {
            this._removeClass(temp, 'hidden');
        }
        if (!this._getNodeState(node, 'parent').visible) {
            this._removeClass(upperLevel, 'hidden');
            var parent = upperLevel[2].querySelector('.node');
            this._one(parent, 'transitionend', function (event) {
                event.target.classList.remove('slide');
            }, this);
            this._repaint(parent);
            parent.classList.add('slide');
            parent.classList.remove('slide-down');
        }
        var self = this;
        siblings.forEach(function (sib) {
            Arrayfrom(sib.querySelectorAll('.node')).forEach(function (node) {
                if (self._isVisible(node)) {
                    node.classList.add('slide');
                    node.classList.remove('slide-left', 'slide-right');
                }
            });
        });
        this._one(siblings[0].querySelector('.slide'), 'transitionend', function () {
            siblings.forEach(function (sib) {
                self._removeClass(Arrayfrom(sib.querySelectorAll('.slide')), 'slide');
            });
            if (this._isInAction(node)) {
                this._switchHorizontalArrow(node);
                node.querySelector('.topEdge').classList.remove('fa-chevron-up');
                node.querySelector('.topEdge').classList.add('fa-chevron-down');
            }
        }, this);
    }
    OrgChart.prototype.hideSiblings = function (node, direction) {
        var nodeContainer = this._closest(node, function (el) {
            return el.nodeName === 'TABLE'
        }).parentNode,
        siblings = this._siblings(nodeContainer);
        var self = this;
        siblings.forEach(function (sib) {
            if (sib.querySelector('.spinner')) {
                self.chart.dataset.inAjax = false;
            }
        });
        if (!direction || (direction && direction === 'left')) {
            var preSibs = this._prevAll(nodeContainer);
            preSibs.forEach(function (sib) {
                Arrayfrom(sib.querySelectorAll('.node')).forEach(function (node) {
                    if (self._isVisible(node)) {
                        node.classList.add('slide', 'slide-right');
                    }
                });
            });
        }
        if (!direction || (direction && direction !== 'left')) {
            var nextSibs = this._nextAll(nodeContainer);
            nextSibs.forEach(function (sib) {
                Arrayfrom(sib.querySelectorAll('.node')).forEach(function (node) {
                    if (self._isVisible(node)) {
                        node.classList.add('slide', 'slide-left');
                    }
                });
            });
        }
        var animatedNodes = [
        ];
        this._siblings(nodeContainer).forEach(function (sib) {
            Array.prototype.push.apply(animatedNodes, Arrayfrom(sib.querySelectorAll('.slide')));
        });
        var lines = [
        ];
        for (var node in animatedNodes) {
            var temp = this._closest(node, function (el) {
                return el.classList.contains('nodes');
            }).previousElementSibling;
            lines.push(temp);
            lines.push(temp.previousElementSibling);
        }
        lines = lines.concat(new Set(lines));
        lines.forEach(function (line) {
            line.style.visibility = 'hidden';
        });
        this._one(animatedNodes[0], 'transitionend', function (event) {
            lines.forEach(function (line) {
                line.removeAttribute('style');
            });
            var sibs = [
            ];
            if (direction) {
                if (direction === 'left') {
                    sibs = self._prevAll(nodeContainer, ':not(.hidden)');
                } else {
                    sibs = self._nextAll(nodeContainer, ':not(.hidden)');
                }
            } else {
                sibs = self._siblings(nodeContainer);
            }
            var temp = Arrayfrom(self._closest(nodeContainer, function (el) {
                return el.classList.contains('nodes');
            }).previousElementSibling.querySelectorAll(':not(.hidden)'));
            var someLines = temp.slice(1, direction ? sibs.length * 2 + 1 : - 1);
            self._addClass(someLines, 'hidden');
            self._removeClass(animatedNodes, 'slide');
            sibs.forEach(function (sib) {
                Arrayfrom(sib.querySelectorAll('.node')).slice(1).forEach(function (node) {
                    if (self._isVisible(node)) {
                        node.classList.remove('slide-left', 'slide-right');
                        node.classList.add('slide-up');
                    }
                });
            });
            sibs.forEach(function (sib) {
                self._addClass(Arrayfrom(sib.querySelectorAll('.lines')), 'hidden');
                self._addClass(Arrayfrom(sib.querySelectorAll('.nodes')), 'hidden');
                self._addClass(Arrayfrom(sib.querySelectorAll('.verticalNodes')), 'hidden');
            });
            self._addClass(sibs, 'hidden');
            if (self._isInAction(node)) {
                self._switchHorizontalArrow(node);
            }
        }, this);
    }
    OrgChart.prototype.hideParent = function (node) {
        var temp = Arrayfrom(this._closest(node, function (el) {
            return el.classList.contains('nodes');
        }).parentNode.children).slice(0, 3);
        if (temp[0].querySelector('.spinner')) {
            this.chart.dataset.inAjax = false;
        }
        if (this._getNodeState(node, 'siblings').visible) {
            this.hideSiblings(node);
        }
        var lines = temp.slice(1);
        this._css(lines, 'visibility', 'hidden');
        var parent = temp[0].querySelector('.node'),
        grandfatherVisible = this._getNodeState(parent, 'parent').visible;
        if (parent && this._isVisible(parent)) {
            parent.classList.add('slide', 'slide-down');
            this._one(parent, 'transitionend', function () {
                parent.classList.remove('slide');
                this._removeAttr(lines, 'style');
                this._addClass(temp, 'hidden');
            }, this);
        }
        if (parent && grandfatherVisible) {
            this.hideParent(parent);
        }
    }
    OrgChart.prototype.addParent = function (currentRoot, data) {
        var that = this;
        this._buildParentNode(currentRoot, data, function () {
            if (!currentRoot.querySelector('.topEdge')) {
                var topEdge = document.createElement('i');
                topEdge.setAttribute('class', 'edge verticalEdge topEdge fa');
                currentRoot.appendChild(topEdge);
            }
            that.showParent(currentRoot);
        });
    }
    OrgChart.prototype._startLoading = function (arrow, node) {
        var opts = this.options,
        chart = this.chart;
        if (typeof chart.dataset.inAjax !== 'undefined' && chart.dataset.inAjax === 'true') {
            return false;
        }
        arrow.classList.add('hidden');
        var spinner = document.createElement('i');
        spinner.setAttribute('class', 'fa fa-circle-o-notch fa-spin spinner');
        node.appendChild(spinner);
        this._addClass(Arrayfrom(node.querySelectorAll('*:not(.spinner)')), 'hazy');
        chart.dataset.inAjax = true;
        var exportBtn = this.chartContainer.querySelector('.oc-export-btn' + (opts.chartClass !== '' ? '.' + opts.chartClass : ''));
        if (exportBtn) {
            exportBtn.disabled = true;
        }
        return true;
    }
    OrgChart.prototype._endLoading = function (arrow, node) {
        var opts = this.options;
        arrow.classList.remove('hidden');
        removeNode(node.querySelector('.spinner'));
        this._removeClass(Arrayfrom(node.querySelectorAll('.hazy')), 'hazy');
        this.chart.dataset.inAjax = false;
        var exportBtn = this.chartContainer.querySelector('.oc-export-btn' + (opts.chartClass !== '' ? '.' + opts.chartClass : ''));
        if (exportBtn) {
            exportBtn.disabled = false;
        }
    }
    OrgChart.prototype._clickTopEdge = function (event) {
        event.stopPropagation();
        var that = this,
        topEdge = event.target,
        node = topEdge.parentNode,
        parentState = this._getNodeState(node, 'parent'),
        opts = this.options;
        if (parentState.exist) {
            var temp = this._closest(node, function (el) {
                return el.classList.contains('nodes');
            });
            var parent = temp.parentNode.firstChild.querySelector('.node');
            if (parent.classList.contains('slide')) {
                return;
            }
            if (parentState.visible) {
                this.hideParent(node);
                this._one(parent, 'transitionend', function () {
                    if (this._isInAction(node)) {
                        this._switchVerticalArrow(topEdge);
                        this._switchHorizontalArrow(node);
                    }
                }, this);
            } else {
                this.showParent(node);
            }
        } else {
            var nodeId = topEdge.parentNode.id;
            if (this._startLoading(topEdge, node)) {
                this._getJSON(typeof opts.ajaxURL.parent === 'function' ? opts.ajaxURL.parent(node.dataset.source)  : opts.ajaxURL.parent + nodeId).then(function (resp) {
                    if (that.chart.dataset.inAjax === 'true') {
                        if (Object.keys(resp).length) {
                            that.addParent(node, resp);
                        }
                    }
                }).catch (function (err) {
                    console.error('Failed to get parent node data.', err);
                }).finally (function () {
                    that._endLoading(topEdge, node);
                });
            }
        }
    }
    OrgChart.prototype.hideChildren = function (node) {
        var that = this,
        temp = this._nextAll(node.parentNode.parentNode),
        lastItem = temp[temp.length - 1],
        lines = [
        ];
        if (lastItem.querySelector('.spinner')) {
            this.chart.dataset.inAjax = false;
        }
        var descendants = Arrayfrom(lastItem.querySelectorAll('.node')).filter(function (el) {
            return that._isVisible(el)
        }),
        isVerticalDesc = lastItem.classList.contains('verticalNodes');
        if (!isVerticalDesc) {
            descendants.forEach(function (desc) {
                Array.prototype.push.apply(lines, that._prevAll(that._closest(desc, function (el) {
                    return el.classList.contains('nodes')
                }), '.lines'));
            });
            lines = lines.concat(new Set(lines));
            this._css(lines, 'visibility', 'hidden');
        }
        this._one(descendants[0], 'transitionend', function (event) {
            this._removeClass(descendants, 'slide');
            if (isVerticalDesc) {
                that._addClass(temp, 'hidden');
            } else {
                lines.forEach(function (el) {
                    el.removeAttribute('style');
                    el.classList.add('hidden');
                    el.parentNode.lastChild.classList.add('hidden');
                });
                this._addClass(Arrayfrom(lastItem.querySelectorAll('.verticalNodes')), 'hidden');
            }
            if (this._isInAction(node)) {
                this._switchVerticalArrow(node.querySelector('.bottomEdge'));
            }
        }, this);
        this._addClass(descendants, 'slide slide-up');
    }
    OrgChart.prototype.showChildren = function (node) {
        var that = this,
        temp = this._nextAll(node.parentNode.parentNode),
        descendants = [
        ];
        this._removeClass(temp, 'hidden');
        if (temp.some(function (el) {
            return el.classList.contains('verticalNodes')
        })) {
            temp.forEach(function (el) {
                Array.prototype.push.apply(descendants, Arrayfrom(el.querySelectorAll('.node')).filter(function (el) {
                    return that._isVisible(el);
                }));
            });
        } else {
            Arrayfrom(temp[2].children).forEach(function (el) {
                Array.prototype.push.apply(descendants, Arrayfrom(el.querySelector('tr').querySelectorAll('.node')).filter(function (el) {
                    return that._isVisible(el);
                }));
            });
        }
        this._repaint(descendants[0]);
        this._one(descendants[0], 'transitionend', function (event) {
            that._removeClass(descendants, 'slide');
            if (that._isInAction(node)) {
                that._switchVerticalArrow(node.querySelector('.bottomEdge'));
            }
        }, this);
        this._addClass(descendants, 'slide');
        this._removeClass(descendants, 'slide-up');
    }
    OrgChart.prototype._buildChildNode = function (appendTo, nodeData, callback) {
        var data = nodeData.children || nodeData.siblings;
        appendTo.querySelector('td').setAttribute('colSpan', data.length * 2);
        this.buildHierarchy(appendTo, {
            'children': data
        }, 0, callback);
    }
    OrgChart.prototype.addChildren = function (node, data) {
        var that = this,
        opts = this.options,
        count = 0;
        this.chart.dataset.inEdit = 'addChildren';
        this._buildChildNode.call(this, this._closest(node, function (el) {
            return el.nodeName === 'TABLE'
        }), data, function () {
            if (++count === data.children.length) {
                if (!node.querySelector('.bottomEdge')) {
                    var bottomEdge = document.createElement('i');
                    bottomEdge.setAttribute('class', 'edge verticalEdge bottomEdge fa');
                    node.appendChild(bottomEdge);
                }
                if (!node.querySelector('.symbol')) {
                    var symbol = document.createElement('i');
                    symbol.setAttribute('class', 'fa ' + opts.parentNodeSymbol + ' symbol');
                    node.querySelector('.title').appendChild(symbol);
                }
                that.showChildren(node);
                that.chart.dataset.inEdit = '';
            }
        });
    }
    OrgChart.prototype._clickBottomEdge = function (event) {
        event.stopPropagation();
        var that = this,
        opts = this.options,
        bottomEdge = event.target,
        node = bottomEdge.parentNode,
        childrenState = this._getNodeState(node, 'children');
        if (childrenState.exist) {
            var temp = this._closest(node, function (el) {
                return el.nodeName === 'TR';
            }).parentNode.lastChild;
            if (Arrayfrom(temp.querySelectorAll('.node')).some(function (node) {
                return this._isVisible(node) && node.classList.contains('slide');
            })) {
                return;
            }
            if (childrenState.visible) {
                this.hideChildren(node);
            } else {
                this.showChildren(node);
            }
        } else {
            var nodeId = bottomEdge.parentNode.id;
            if (this._startLoading(bottomEdge, node)) {
                this._getJSON(typeof opts.ajaxURL.children === 'function' ? opts.ajaxURL.children(node.dataset.source)  : opts.ajaxURL.children + nodeId).then(function (resp) {
                    if (that.chart.dataset.inAjax === 'true') {
                        if (resp.children.length) {
                            that.addChildren(node, resp);
                        }
                    }
                }).catch (function (err) {
                    console.error('Failed to get children nodes data', err);
                }).finally (function () {
                    that._endLoading(bottomEdge, node);
                });
            }
        }
    }
    OrgChart.prototype._complementLine = function (oneSibling, siblingCount, existingSibligCount) {
        var temp = oneSibling.parentNode.parentNode.children;
        temp[0].children[0].setAttribute('colspan', siblingCount * 2);
        temp[1].children[0].setAttribute('colspan', siblingCount * 2);
        for (var i = 0; i < existingSibligCount; i++) {
            var rightLine = document.createElement('td'),
            leftLine = document.createElement('td');
            rightLine.setAttribute('class', 'rightLine topLine');
            rightLine.innerHTML = '&nbsp;';
            temp[2].insertBefore(rightLine, temp[2].children[1]);
            leftLine.setAttribute('class', 'leftLine topLine');
            leftLine.innerHTML = '&nbsp;';
            temp[2].insertBefore(leftLine, temp[2].children[1]);
        }
    }
    OrgChart.prototype._buildSiblingNode = function (nodeChart, nodeData, callback) {
        var that = this,
        newSiblingCount = nodeData.siblings ? nodeData.siblings.length : nodeData.children.length,
        existingSibligCount = nodeChart.parentNode.nodeName === 'TD' ? this._closest(nodeChart, function (el) {
            return el.nodeName === 'TR';
        }).children.length : 1,
        siblingCount = existingSibligCount + newSiblingCount,
        insertPostion = (siblingCount > 1) ? Math.floor(siblingCount / 2 - 1)  : 0;
        if (nodeChart.parentNode.nodeName === 'TD') {
            var temp = this._prevAll(nodeChart.parentNode.parentNode);
            removeNode(temp[0]);
            removeNode(temp[1]);
            var childCount = 0;
            that._buildChildNode.call(that, that._closest(nodeChart.parentNode, function (el) {
                return el.nodeName === 'TABLE'
            }), nodeData, function () {
                if (++childCount === newSiblingCount) {
                    var siblingTds = Arrayfrom(that._closest(nodeChart.parentNode, function (el) {
                        return el.nodeName === 'TABLE'
                    }).lastChild.children);
                    if (existingSibligCount > 1) {
                        var temp = nodeChart.parentNode.parentNode;
                        Arrayfrom(temp.children).forEach(function (el) {
                            siblingTds[0].parentNode.insertBefore(el, siblingTds[0]);
                        });
                        removeNode(temp);
                        that._complementLine(siblingTds[0], siblingCount, existingSibligCount);
                        that._addClass(siblingTds, 'hidden');
                        siblingTds.forEach(function (el) {
                            that._addClass(el.querySelectorAll('.node'), 'slide-left');
                        });
                    } else {
                        var temp = nodeChart.parentNode.parentNode;
                        siblingTds[insertPostion].parentNode.insertBefore(nodeChart.parentNode, siblingTds[insertPostion + 1]);
                        removeNode(temp);
                        that._complementLine(siblingTds[insertPostion], siblingCount, 1);
                        that._addClass(siblingTds, 'hidden');
                        that._addClass(that._getDescElements(siblingTds.slice(0, insertPostion + 1), '.node'), 'slide-right');
                        that._addClass(that._getDescElements(siblingTds.slice(insertPostion + 1), '.node'), 'slide-left');
                    }
                    callback();
                }
            });
        } else {
            var nodeCount = 0;
            that.buildHierarchy.call(that, that.chart, nodeData, 0, function () {
                if (++nodeCount === siblingCount) {
                    var temp = nodeChart.nextElementSibling.children[3].children[insertPostion],
                    td = document.createElement('td');
                    td.setAttribute('colspan', 2);
                    td.appendChild(nodeChart);
                    temp.parentNode.insertBefore(td, temp.nextElementSibling);
                    that._complementLine(temp, siblingCount, 1);
                    var temp2 = that._closest(nodeChart, function (el) {
                        return el.classList && el.classList.contains('nodes')
                    }).parentNode.children[0];
                    temp2.classList.add('hidden');
                    that._addClass(Arrayfrom(temp2.querySelectorAll('.node')), 'slide-down');
                    var temp3 = this._siblings(nodeChart.parentNode);
                    that._addClass(temp3, 'hidden');
                    that._addClass(that._getDescElements(temp3.slice(0, insertPostion), '.node'), 'slide-right');
                    that._addClass(that._getDescElements(temp3.slice(insertPostion), '.node'), 'slide-left');
                    callback();
                }
            });
        }
    }
    OrgChart.prototype.addSiblings = function (node, data) {
        var that = this;
        this.chart.dataset.inEdit = 'addSiblings';
        this._buildSiblingNode.call(this, this._closest(node, function (el) {
            return el.nodeName === 'TABLE'
        }), data, function () {
            that._closest(node, function (el) {
                return el.classList && el.classList.contains('nodes')
            }).dataset.siblingsLoaded = true;
            if (!node.querySelector('.leftEdge')) {
                var rightEdge = document.createElement('i'),
                leftEdge = document.createElement('i');
                rightEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
                node.appendChild(rightEdge);
                leftEdge.setAttribute('class', 'edge horizontalEdge leftEdge fa');
                node.appendChild(leftEdge);
            }
            that.showSiblings(node);
            that.chart.dataset.inEdit = '';
        });
    }
    OrgChart.prototype.removeNodes = function (node) {
        var parent = this._closest(node, function (el) {
            return el.nodeName === 'TABLE'
        }).parentNode,
        sibs = this._siblings(parent.parentNode);
        if (parent.nodeName === 'TD') {
            if (this._getNodeState(node, 'siblings').exist) {
                removeNode(sibs[2].querySelector('.topLine').nextElementSibling);
                removeNode(sibs[2].querySelector('.topLine'));
                sibs[0].children[0].setAttribute('colspan', sibs[2].children.length);
                sibs[1].children[0].setAttribute('colspan', sibs[2].children.length);
                removeNode(parent);
            } else {
                sibs[0].children[0].removeAttribute('colspan');
                removeNode(sibs[0].querySelector('.bottomEdge'));
                this._siblings(sibs[0]).forEach(function (el) {
                    removeNode(el)
                });
            }
        } else {
            Arrayfrom(parent.parentNode.children).forEach(function (el) {
                removeNode(el)
            });
        }
    }
    OrgChart.prototype._clickHorizontalEdge = function (event) {
        event.stopPropagation();
        var that = this,
        opts = this.options,
        hEdge = event.target,
        node = hEdge.parentNode,
        siblingsState = this._getNodeState(node, 'siblings');
        if (siblingsState.exist) {
            var temp = this._closest(node, function (el) {
                return el.nodeName === 'TABLE';
            }).parentNode,
            siblings = this._siblings(temp);
            if (siblings.some(function (el) {
                var node = el.querySelector('.node');
                return that._isVisible(node) && node.classList.contains('slide');
            })) {
                return;
            }
            if (opts.toggleSiblingsResp) {
                var prevSib = this._closest(node, function (el) {
                    return el.nodeName === 'TABLE'
                }).parentNode.previousElementSibling,
                nextSib = this._closest(node, function (el) {
                    return el.nodeName === 'TABLE'
                }).parentNode.nextElementSibling;
                if (hEdge.classList.contains('leftEdge')) {
                    if (prevSib.classList.contains('hidden')) {
                        this.showSiblings(node, 'left');
                    } else {
                        this.hideSiblings(node, 'left');
                    }
                } else {
                    if (nextSib.classList.contains('hidden')) {
                        this.showSiblings(node, 'right');
                    } else {
                        this.hideSiblings(node, 'right');
                    }
                }
            } else {
                if (siblingsState.visible) {
                    this.hideSiblings(node);
                } else {
                    this.showSiblings(node);
                }
            }
        } else {
            var nodeId = hEdge.parentNode.id,
            url = (this._getNodeState(node, 'parent').exist) ? (typeof opts.ajaxURL.siblings === 'function' ? opts.ajaxURL.siblings(JSON.parse(node.dataset.source))  : opts.ajaxURL.siblings + nodeId)  : (typeof opts.ajaxURL.families === 'function' ? opts.ajaxURL.families(JSON.parse(node.dataset.source))  : opts.ajaxURL.families + nodeId);
            if (this._startLoading(hEdge, node)) {
                this._getJSON(url).then(function (resp) {
                    if (that.chart.dataset.inAjax === 'true') {
                        if (resp.siblings || resp.children) {
                            that.addSiblings(node, resp);
                        }
                    }
                }).catch (function (err) {
                    console.error('Failed to get sibling nodes data', err);
                }).finally (function () {
                    that._endLoading(hEdge, node);
                });
            }
        }
    }
    OrgChart.prototype._clickToggleButton = function (event) {
        var that = this,
        toggleBtn = event.target,
        descWrapper = toggleBtn.parentNode.nextElementSibling,
        descendants = Arrayfrom(descWrapper.querySelectorAll('.node')),
        children = Arrayfrom(descWrapper.children).map(function (item) {
            return item.querySelector('.node')
        });
        if (children.some(function (item) {
            return item.classList.contains('slide')
        })) {
            return;
        }
        toggleBtn.classList.toggle('fa-plus-square');
        toggleBtn.classList.toggle('fa-minus-square');
        if (descendants[0].classList.contains('slide-up')) {
            descWrapper.classList.remove('hidden');
            this._repaint(children[0]);
            this._addClass(children, 'slide');
            this._removeClass(children, 'slide-up');
            this._one(children[0], 'transitionend', function () {
                that._removeClass(children, 'slide');
            });
        } else {
            this._addClass(descendants, 'slide slide-up');
            this._one(descendants[0], 'transitionend', function () {
                that._removeClass(descendants, 'slide');
                descendants.forEach(function (desc) {
                    var ul = that._closest(desc, function (el) {
                        return el.nodeName === 'UL';
                    });
                    ul.classList.add('hidden');
                });
            });
            descendants.forEach(function (desc) {
                var subTBs = Arrayfrom(desc.querySelectorAll('.toggleBtn'));
                that._removeClass(subTBs, 'fa-minus-square');
                that._addClass(subTBs, 'fa-plus-square');
            });
        }
    }
    OrgChart.prototype._dispatchClickEvent = function (event) {
        var classList = event.target.classList;
        if (classList.contains('topEdge')) {
            this._clickTopEdge(event);
        } else if (classList.contains('rightEdge') || classList.contains('leftEdge')) {
            this._clickHorizontalEdge(event);
        } else if (classList.contains('bottomEdge')) {
            this._clickBottomEdge(event);
        } else if (classList.contains('toggleBtn')) {
            this._clickToggleButton(event);
        } else {
            this._clickNode(event);
        }
    }
    OrgChart.prototype._onDragStart = function (event) {
        var nodeDiv = event.target,
        opts = this.options,
        isFirefox = /firefox/.test(window.navigator.userAgent.toLowerCase());
        if (isFirefox) {
            event.dataTransfer.setData('text/html', 'hack for firefox');
        }
        if (this.chart.style.transform) {
            var ghostNode,
            nodeCover;
            if (!document.querySelector('.ghost-node')) {
                ghostNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                ghostNode.classList.add('ghost-node');
                nodeCover = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                ghostNode.appendChild(nodeCover);
                this.chart.appendChild(ghostNode);
            } else {
                ghostNode = this.chart.querySelector('.ghost-node');
                nodeCover = ghostNode.children[0];
            }
            var transValues = this.chart.style.transform.split(','),
            scale = Math.abs(window.parseFloat((opts.direction === 't2b' || opts.direction === 'b2t') ? transValues[0].slice(transValues[0].indexOf('(') + 1)  : transValues[1]));
            ghostNode.setAttribute('width', nodeDiv.offsetWidth);
            ghostNode.setAttribute('height', nodeDiv.offsetHeight);
            nodeCover.setAttribute('x', 5 * scale);
            nodeCover.setAttribute('y', 5 * scale);
            nodeCover.setAttribute('width', 120 * scale);
            nodeCover.setAttribute('height', 40 * scale);
            nodeCover.setAttribute('rx', 4 * scale);
            nodeCover.setAttribute('ry', 4 * scale);
            nodeCover.setAttribute('stroke-width', 1 * scale);
            var xOffset = event.offsetX * scale,
            yOffset = event.offsetY * scale;
            if (opts.direction === 'l2r') {
                xOffset = event.offsetY * scale;
                yOffset = event.offsetX * scale;
            } else if (opts.direction === 'r2l') {
                xOffset = nodeDiv.offsetWidth - event.offsetY * scale;
                yOffset = event.offsetX * scale;
            } else if (opts.direction === 'b2t') {
                xOffset = nodeDiv.offsetWidth - event.offsetX * scale;
                yOffset = nodeDiv.offsetHeight - event.offsetY * scale;
            }
            if (isFirefox) {
                var ghostNodeWrapper = document.createElement('img');
                ghostNodeWrapper.src = 'data:image/svg+xml;utf8,' + (new XMLSerializer()).serializeToString(ghostNode);
                event.dataTransfer.setDragImage(ghostNodeWrapper, xOffset, yOffset);
                nodeCover.setAttribute('fill', 'rgb(255, 255, 255)');
                nodeCover.setAttribute('stroke', 'rgb(191, 0, 0)');
            } else {
                event.dataTransfer.setDragImage(ghostNode, xOffset, yOffset);
            }
        }
        var dragged = event.target;
        var dragZone = this._closest(dragged, function (el) {
            return el.classList && el.classList.contains('nodes');
        })
        if (dragZone && dragZone.parentNode)
        	dragZone = dragZone.parentNode.children[0].querySelector('.node');
        dragHier = Arrayfrom(this._closest(dragged, function (el) {
            return el.nodeName === 'TABLE';
        }).querySelectorAll('.node'));
        this.dragged = dragged;
        Arrayfrom(this.chart.querySelectorAll('.node')).forEach(function (node) {
            if (dragHier.indexOf(node) === - 1) {
                if (opts.dropCriteria) {
                    if (opts.dropCriteria(dragged, dragZone, node)) {
                        node.classList.add('allowedDrop');
                    }
                } else {
                    node.classList.add('allowedDrop');
                }
            }
        });
    }
    OrgChart.prototype._onDragOver = function (event) {
        var dropZone = event.currentTarget;
        if (dropZone.classList.contains('allowedDrop')) {
            event.preventDefault();
        }
    }
    OrgChart.prototype._onDragEnd = function (event) {
        Arrayfrom(this.chart.querySelectorAll('.allowedDrop')).forEach(function (el) {
            el.classList.remove('allowedDrop');
        });
    }
    OrgChart.prototype._onDrop = function (event) {
        var dropZone = event.currentTarget,
        chart = this.chart,
        dragged = this.dragged,
        dragZone = this._closest(dragged, function (el) {
            return el.classList && el.classList.contains('nodes');
        }).parentNode.children[0].children[0];
        this._removeClass(Arrayfrom(chart.querySelectorAll('.allowedDrop')), 'allowedDrop');
        if (!dropZone.parentNode.parentNode.nextElementSibling) {
            var bottomEdge = document.createElement('i');
            bottomEdge.setAttribute('class', 'edge verticalEdge bottomEdge fa');
            dropZone.appendChild(bottomEdge);
            dropZone.parentNode.setAttribute('colspan', 2);
            var table = this._closest(dropZone, function (el) {
                return el.nodeName === 'TABLE';
            }),
            upperTr = document.createElement('tr'),
            lowerTr = document.createElement('tr'),
            nodeTr = document.createElement('tr');
            upperTr.setAttribute('class', 'lines');
            upperTr.innerHTML = '<td colspan="2"><div class="downLine"></div></td>';
            table.appendChild(upperTr);
            lowerTr.setAttribute('class', 'lines');
            lowerTr.innerHTML = '<td class="rightLine">&nbsp;</td><td class="leftLine">&nbsp;</td>';
            table.appendChild(lowerTr);
            nodeTr.setAttribute('class', 'nodes');
            table.appendChild(nodeTr);
            Arrayfrom(dragged.querySelectorAll('.horizontalEdge')).forEach(function (hEdge) {
                dragged.removeChild(hEdge);
            });
            var draggedTd = this._closest(dragged, function (el) {
                return el.nodeName === 'TABLE'
            }).parentNode;
            nodeTr.appendChild(draggedTd);
        } else {
            var dropColspan = window.parseInt(dropZone.parentNode.colSpan) + 2;
            dropZone.parentNode.setAttribute('colspan', dropColspan);
            dropZone.parentNode.parentNode.nextElementSibling.children[0].setAttribute('colspan', dropColspan);
            if (!dragged.querySelector('.horizontalEdge')) {
                var rightEdge = document.createElement('i'),
                leftEdge = document.createElement('i');
                rightEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
                dragged.appendChild(rightEdge);
                leftEdge.setAttribute('class', 'edge horizontalEdge leftEdge fa');
                dragged.appendChild(leftEdge);
            }
            var temp = dropZone.parentNode.parentNode.nextElementSibling.nextElementSibling,
            leftline = document.createElement('td'),
            rightline = document.createElement('td');
            leftline.setAttribute('class', 'leftLine topLine');
            leftline.innerHTML = '&nbsp;';
            temp.insertBefore(leftline, temp.children[1]);
            rightline.setAttribute('class', 'rightLine topLine');
            rightline.innerHTML = '&nbsp;';
            temp.insertBefore(rightline, temp.children[2]);
            temp.nextElementSibling.appendChild(this._closest(dragged, function (el) {
                return el.nodeName === 'TABLE';
            }).parentNode);
            var dropSibs = this._siblings(this._closest(dragged, function (el) {
                return el.nodeName === 'TABLE';
            }).parentNode).map(function (el) {
                return el.querySelector('.node')
            });
            if (dropSibs.length === 1) {
                var rightEdge = document.createElement('i'),
                leftEdge = document.createElement('i');
                rightEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
                dropSibs[0].appendChild(rightEdge);
                leftEdge.setAttribute('class', 'edge horizontalEdge leftEdge fa');
                dropSibs[0].appendChild(leftEdge);
            }
        }
        var dragColSpan = window.parseInt(dragZone.colSpan);
        if (dragColSpan > 2) {
            dragZone.setAttribute('colspan', dragColSpan - 2);
            dragZone.parentNode.nextElementSibling.children[0].setAttribute('colspan', dragColSpan - 2);
            var temp = dragZone.parentNode.nextElementSibling.nextElementSibling;
            removeNode(temp.children[1]);
            removeNode(temp.children[1]);
            var dragSibs = Arrayfrom(dragZone.parentNode.parentNode.children[3].children).map(function (td) {
                return td.querySelector('.node');
            });
            if (dragSibs.length === 1) {
                removeNode(dragSibs[0].querySelector('.leftEdge'));
                removeNode(dragSibs[0].querySelector('.rightEdge'));
            }
        } else {
            dragZone.removeAttribute('colspan');
            dragZone.querySelector('.node').removeChild(dragZone.querySelector('.bottomEdge'));
            Arrayfrom(dragZone.parentNode.parentNode.children).slice(1).forEach(function (tr) {
                removeNode(tr)
            });
        }
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            var customE = document.createEvent('HTMLEvents');
            customE.initEvent('nodedropped.orgchart', {
                'detail': {
                    'draggedNode': dragged,
                    'dragZone': dragZone.children[0],
                    'dropZone': dropZone
                }
            }, void 0);
            chart.dispatchEvent(customE)
        } else {
            var customE = new CustomEvent('nodedropped.orgchart', {
                'detail': {
                    'draggedNode': dragged,
                    'dragZone': dragZone.children[0],
                    'dropZone': dropZone
                }
            });
            chart.dispatchEvent(customE);
        }
    }
    OrgChart.prototype._createNode = function (nodeData, level) {
        var that = this,
        opts = this.options;
        return new Promise(function (resolve, reject) {
            if (nodeData.children) {
                for (var child in nodeData.children) {
                    child.parentId = nodeData.id;
                }
            }
            var nodeDiv = document.createElement('div');
            delete nodeData.children;
            nodeDiv.dataset.source = JSON.stringify(nodeData);
            if (nodeData[opts.nodeId]) {
                nodeDiv.id = nodeData[opts.nodeId];
            }
            var inEdit = that.chart.dataset.inEdit,
            isHidden;
            if (inEdit) {
                isHidden = inEdit === 'addChildren' ? ' slide-up' : '';
            } else {
                isHidden = level >= opts.depth ? ' slide-up' : '';
            }
            nodeDiv.setAttribute('class', 'node ' + (nodeData.className || '') + isHidden);
            if (opts.draggable) {
                nodeDiv.setAttribute('draggable', true);
            }
            if (nodeData.parentId) {
                nodeDiv.setAttribute('data-parent', nodeData.parentId);
            }
            var _innerHTML = '<div class="title">' + nodeData[opts.nodeTitle] + '</div>';
            if (opts.nodeContent) {
                _innerHTML = _innerHTML + '<div class="content">' + nodeData[opts.nodeContent] + '</div>'
            }
            nodeDiv.innerHTML = _innerHTML;
            var flags = nodeData.relationship || '';
            if (typeof nodeData.relationship === 'object') {
                flags = nodeData.relationship.children_num.toString() + nodeData.relationship.parent_num.toString() + nodeData.relationship.sibling_num.toString();
            }
            if (opts.verticalDepth && (level + 2) > opts.verticalDepth) {
                if ((level + 1) >= opts.verticalDepth && Number(flags.substr(2, 1))) {
                    var toggleBtn = document.createElement('i'),
                    icon = level + 1 >= opts.depth ? 'plus' : 'minus';
                    toggleBtn.setAttribute('class', 'toggleBtn fa fa-' + icon + '-square');
                    nodeDiv.appendChild(toggleBtn);
                }
            } else {
                if (Number(flags.substr(0, 1))) {
                    var topEdge = document.createElement('i');
                    topEdge.setAttribute('class', 'edge verticalEdge topEdge fa');
                    nodeDiv.appendChild(topEdge);
                }
                if (Number(flags.substr(1, 1))) {
                    var rightEdge = document.createElement('i'),
                    leftEdge = document.createElement('i');
                    rightEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
                    nodeDiv.appendChild(rightEdge);
                    leftEdge.setAttribute('class', 'edge horizontalEdge leftEdge fa');
                    nodeDiv.appendChild(leftEdge);
                }
                if (Number(flags.substr(2, 1))) {
                    var bottomEdge = document.createElement('i'),
                    symbol = document.createElement('i'),
                    title = nodeDiv.querySelector('.title');
                    bottomEdge.setAttribute('class', 'edge verticalEdge bottomEdge fa');
                    nodeDiv.appendChild(bottomEdge);
                    symbol.setAttribute('class', 'fa ' + opts.parentNodeSymbol + ' symbol');
                    title.insertBefore(symbol, title.children[0]);
                }
            }
            nodeDiv.addEventListener('mouseenter', that._hoverNode.bind(that));
            nodeDiv.addEventListener('mouseleave', that._hoverNode.bind(that));
            nodeDiv.addEventListener('click', that._dispatchClickEvent.bind(that));
            if (opts.draggable) {
                nodeDiv.addEventListener('dragstart', that._onDragStart.bind(that));
                nodeDiv.addEventListener('dragover', that._onDragOver.bind(that));
                nodeDiv.addEventListener('dragend', that._onDragEnd.bind(that));
                nodeDiv.addEventListener('drop', that._onDrop.bind(that));
            }
            if (opts.createNode) {
                opts.createNode(nodeDiv, nodeData);
            }
            resolve(nodeDiv);
        }
        );
    }
    OrgChart.prototype.buildHierarchy = function (appendTo, nodeData, level, callback) {
        var that = this,
        opts = this.options,
        nodeWrapper,
        childNodes = nodeData.children,
        isVerticalNode = opts.verticalDepth && (level + 1) >= opts.verticalDepth;
        if (Object.keys(nodeData).length > 1) {
            nodeWrapper = isVerticalNode ? appendTo : document.createElement('table');
            if (!isVerticalNode) {
                appendTo.appendChild(nodeWrapper);
            }
            this._createNode(nodeData, level).then(function (nodeDiv) {
                if (isVerticalNode) {
                    nodeWrapper.insertBefore(nodeDiv, nodeWrapper.firstChild);
                } else {
                    var tr = document.createElement('tr');
                    var _innerHTML = '<td ';
                    if (childNodes) {
                        _innerHTML = _innerHTML + 'colspan=' + childNodes.length * 2 + '></td>'
                    } else {
                        _innerHTML = _innerHTML + '></td>'
                    }
                    tr.innerHTML = _innerHTML;
                    tr.children[0].appendChild(nodeDiv);
                    nodeWrapper.insertBefore(tr, nodeWrapper.children[0] ? nodeWrapper.children[0] : null);
                }
                if (callback) {
                    callback();
                }
            }).catch (function (err) {
                console.error('Failed to creat node', err);
            });
        }
        if (childNodes) {
            if (Object.keys(nodeData).length === 1) {
                nodeWrapper = appendTo;
            }
            var isHidden,
            isVerticalLayer = opts.verticalDepth && (level + 2) >= opts.verticalDepth,
            inEdit = that.chart.dataset.inEdit;
            if (inEdit) {
                isHidden = inEdit === 'addSiblings' ? '' : ' hidden';
            } else {
                isHidden = level + 1 >= opts.depth ? ' hidden' : '';
            }
            if (!isVerticalLayer) {
                var tr = document.createElement('tr');
                tr.setAttribute('class', 'lines' + isHidden);
                tr.innerHTML = '<td colspan="' + childNodes.length * 2 + '"><div class="downLine"></div></td>';
                nodeWrapper.appendChild(tr);
            }
            var lineLayer = document.createElement('tr');
            lineLayer.setAttribute('class', 'lines' + isHidden);
            var childNodesHTML = childNodes.slice(1).map(function () {
                return '<td class="leftLine topLine">&nbsp;</td><td class="rightLine topLine">&nbsp;</td>'
            }).join('');
            lineLayer.innerHTML = '<td class="rightLine">&nbsp;</td> ' + childNodesHTML + '<td class="leftLine">&nbsp;</td>';
            var nodeLayer;
            if (isVerticalLayer) {
                nodeLayer = document.createElement('ul');
                if (isHidden) {
                    nodeLayer.classList.add(isHidden.trim());
                }
                if (level + 2 === opts.verticalDepth) {
                    var tr = document.createElement('tr');
                    tr.setAttribute('class', 'verticalNodes' + isHidden);
                    tr.innerHTML = '<td></td>';
                    tr.firstChild.appendChild(nodeLayer);
                    nodeWrapper.appendChild(tr);
                } else {
                    nodeWrapper.appendChild(nodeLayer);
                }
            } else {
                nodeLayer = document.createElement('tr');
                nodeLayer.setAttribute('class', 'nodes' + isHidden);
                nodeWrapper.appendChild(lineLayer);
                nodeWrapper.appendChild(nodeLayer);
            }
            childNodes.forEach(function (child) {
                var nodeCell;
                if (isVerticalLayer) {
                    nodeCell = document.createElement('li');
                } else {
                    nodeCell = document.createElement('td');
                    nodeCell.setAttribute('colspan', 2);
                }
                nodeLayer.appendChild(nodeCell);
                that.buildHierarchy(nodeCell, child, level + 1, callback);
            });
        }
    }
    OrgChart.prototype._clickChart = function (event) {
        var closestNode = this._closest(event.target, function (el) {
            return el.classList && el.classList.contains('node');
        });
        if (!closestNode && this.chart.querySelector('.node.focused')) {
            this.chart.querySelector('.node.focused').classList.remove('focused');
        }
    }
    OrgChart.prototype._clickExportButton = function () {
        var opts = this.options,
        chartContainer = this.chartContainer,
        mask = chartContainer.querySelector('.mask'),
        sourceChart = chartContainer.querySelector('.orgchart:not(.hidden)'),
        flag = opts.direction === 'l2r' || opts.direction === 'r2l';
        if (!mask) {
            mask = document.createElement('div');
            mask.setAttribute('class', 'mask');
            mask.innerHTML = '<i class="fa fa-circle-o-notch fa-spin spinner"></i>';
            chartContainer.appendChild(mask);
        } else {
            mask.classList.remove('hidden');
        }
        chartContainer.classList.add('canvasContainer');
        window.html2canvas(sourceChart, {
            'width': flag ? sourceChart.clientHeight : sourceChart.clientWidth,
            'height': flag ? sourceChart.clientWidth : sourceChart.clientHeight,
            'onclone': function (cloneDoc) {
                var canvasContainer = cloneDoc.querySelector('.canvasContainer');
                canvasContainer.style.overflow = 'visible';
                canvasContainer.querySelector('.orgchart:not(.hidden)').transform = '';
            }
        }).then(function (canvas) {
            var downloadBtn = chartContainer.querySelector('.oc-download-btn');
            chartContainer.querySelector('.mask').classList.add('hidden');
            downloadBtn.setAttribute('href', canvas.toDataURL());
            downloadBtn.click();
        }).catch (function (err) {
            console.error('Failed to export the curent orgchart!', err);
        }).finally (function () {
            chartContainer.classList.remove('canvasContainer');
        });
    }
    OrgChart.prototype._loopChart = function (chart) {
        var subObj = {
            'id': chart.querySelector('.node').id
        };
        if (chart.children[3]) {
            Arrayfrom(chart.children[3].children).forEach(function (el) {
                if (!subObj.children) {
                    subObj.children = [
                    ];
                }
                subObj.children.push(this._loopChart(el.firstChild));
            });
        }
        return subObj;
    }
    OrgChart.prototype.getHierarchy = function () {
        if (!this.chart.querySelector('.node').id) {
            return 'Error: Nodes of orghcart to be exported must have id attribute!';
        }
        return this._loopChart(this.chart.querySelector('table'));
    }
    OrgChart.prototype._onPanStart = function (event) {
        var chart = event.currentTarget;
        if (this._closest(event.target, function (el) {
            return el.classList && el.classList.contains('node')
        }) || (event.touches && event.touches.length > 1)) {
            chart.dataset.panning = false;
            return;
        }
        chart.style.cursor = 'move';
        chart.dataset.panning = true;
        var lastX = 0,
        lastY = 0,
        lastTf = window.getComputedStyle(chart).transform;
        if (lastTf !== 'none') {
            var temp = lastTf.split(',');
            if (!lastTf.includes('3d')) {
                lastX = Number.parseInt(temp[4], 10);
                lastY = Number.parseInt(temp[5], 10);
            } else {
                lastX = Number.parseInt(temp[12], 10);
                lastY = Number.parseInt(temp[13], 10);
            }
        }
        var startX = 0,
        startY = 0;
        if (!event.targetTouches) {
            startX = event.pageX - lastX;
            startY = event.pageY - lastY;
        } else if (event.targetTouches.length === 1) {
            startX = event.targetTouches[0].pageX - lastX;
            startY = event.targetTouches[0].pageY - lastY;
        } else if (event.targetTouches.length > 1) {
            return;
        }
        chart.dataset.panStart = JSON.stringify({
            'startX': startX,
            'startY': startY
        });
        chart.addEventListener('mousemove', this._onPanning.bind(this));
        chart.addEventListener('touchmove', this._onPanning.bind(this));
    }
    OrgChart.prototype._onPanning = function (event) {
        var chart = event.currentTarget;
        if (chart.dataset.panning === 'false') {
            return;
        }
        var newX = 0,
        newY = 0,
        panStart = JSON.parse(chart.dataset.panStart),
        startX = panStart.startX,
        startY = panStart.startY;
        if (!event.targetTouches) {
            newX = event.pageX - startX;
            newY = event.pageY - startY;
        } else if (event.targetTouches.length === 1) {
            newX = event.targetTouches[0].pageX - startX;
            newY = event.targetTouches[0].pageY - startY;
        } else if (event.targetTouches.length > 1) {
            return;
        }
        var lastTf = window.getComputedStyle(chart).transform;
        if (lastTf === 'none') {
            if (!lastTf.includes('3d')) {
                chart.style.transform = 'matrix(1, 0, 0, 1, ' + newX + ', ' + newY + ')';
            } else {
                chart.style.transform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + newX + ', ' + newY + ', 0, 1)';
            }
        } else {
            var matrix = lastTf.split(',');
            if (!lastTf.includes('3d')) {
                matrix[4] = newX;
                matrix[5] = newY + ')';
            } else {
                matrix[12] = newX;
                matrix[13] = newY;
            }
            chart.style.transform = matrix.join(',');
        }
    }
    OrgChart.prototype._onPanEnd = function (event) {
        var chart = this.chart;
        if (chart.dataset.panning === 'true') {
            chart.dataset.panning = false;
            chart.style.cursor = 'default';
            document.body.removeEventListener('mousemove', this._onPanning);
            document.body.removeEventListener('touchmove', this._onPanning);
        }
    }
    OrgChart.prototype._setChartScale = function (chart, newScale) {
        var lastTf = window.getComputedStyle(chart).transform;
        if (lastTf === 'none') {
            chart.style.transform = 'scale(' + newScale + ',' + newScale + ')';
        } else {
            var matrix = lastTf.split(',');
            if (!lastTf.includes('3d')) {
                matrix[0] = 'matrix(' + newScale;
                matrix[3] = newScale;
                chart.style.transform = lastTf + ' scale(' + newScale + ',' + newScale + ')';
            } else {
                chart.style.transform = lastTf + ' scale3d(' + newScale + ',' + newScale + ', 1)';
            }
        }
        chart.dataset.scale = newScale;
    }
    OrgChart.prototype._onWheeling = function (event) {
        var newScale = event.deltaY > 0 ? 0.8 : 1.2;
        this._setChartScale(this.chart, newScale);
        event.preventDefault();
    }
    OrgChart.prototype._getPinchDist = function (event) {
        return Math.sqrt((event.touches[0].clientX - event.touches[1].clientX) * (event.touches[0].clientX - event.touches[1].clientX) + (event.touches[0].clientY - event.touches[1].clientY) * (event.touches[0].clientY - event.touches[1].clientY));
    }
    OrgChart.prototype._onTouchStart = function (event) {
        var chart = this.chart;
        if (event.touches && event.touches.length === 2) {
            var dist = this._getPinchDist(event);
            chart.dataset.pinching = true;
            chart.dataset.pinchDistStart = dist;
        }
    }
    OrgChart.prototype._onTouchMove = function (event) {
        var chart = this.chart;
        if (chart.dataset.pinching) {
            var dist = this._getPinchDist(event);
            chart.dataset.pinchDistEnd = dist;
        }
    }
    OrgChart.prototype._onTouchEnd = function (event) {
        var chart = this.chart;
        if (chart.dataset.pinching) {
            chart.dataset.pinching = false;
            var diff = chart.dataset.pinchDistEnd - chart.dataset.pinchDistStart;
            if (diff > 0) {
                this._setChartScale(chart, 1);
            } else if (diff < 0) {
                this._setChartScale(chart, - 1);
            }
        }
    }
    return OrgChart;
});
