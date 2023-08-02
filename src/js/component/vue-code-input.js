(function(context, definition) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
      define(['Vue'], definition);
    } else {
      context.VueCodeInput = definition(context.Vue);
      delete context.VueCodeInput;
    }
  })(this, function(Vue) {
    'use strict';
    var VueCodeInput = {
      name: 'VueCodeInput',
      mixins: [VueUtil.component.emitter],
      template: '<div \
                        ref="inputContainer" \
                        class="vue-code-input" \
                        :class="[{ \'end-active\': activeIndex === -1, \'not-select\': !selectRange, \'is-readonly\': readonly, \'is-disabled\': inputDisabled, \'has-icon\': hasIcon() }, sizeClass]" \
                        :tabindex="inputDisabled ? void 0 : tabindex" \
                        @keydown="handleKeydown" \
                        @click="inputContainerClick" \
                        @dblclick="inputContainerDblclick"\
                        @mousedown="handleMousedown" \
                        @paste="handlePaste" \
                        @copy="handleCopy" \
                        @cut="handleCut"\
                        @focus="handleFocus"\
                        @blur="handleBlur"\
                        @mouseenter="hovering = true"\
                        @mouseleave="hovering = false"\
                    >\
                        <div ref="inputContent" class="vue-code-input__content" :placeholder="placeholder">\
                            <span \
                                v-for="(al, index) in currentValue" :key="index" \
                                v-html="al === \' \' ? \'&nbsp;\' : al"\
                                :class="{ active: index === activeIndex }" \
                                @click="spanClick" \
                            >\
                            </span>\
                        </div>\
                        <span class="vue-code-input__suffix" v-if="hasIcon()">\
                            <i class="vue-code-input__icon" v-if="!!icon" :class="[icon, { \'is-clickable\': isIconClickable }]" @click="handleIconClick"/>\
                            <slot name="suffix"></slot>\
                            <i v-if="showClear" class="vue-code-input__icon vue-code-input__clear vue-icon-close" @click="clearValue"></i>\
                        </span>\
                </div>',
      props: {
        value: {
            type: [String, Number]
        },
        placeholder: {
            type: String
        },
        /**
         * format格式：
         * {
         *     uppercase
         *     numeral
         *     numeralIntegerScale
         *     numeralDecimalScale
         *     numeralPositiveOnly
         *     numeralDecimalMark
         *     delimiter
         *     customFormatter
         *     blocks
         * }
         */
        format: {
            type: Object
        },
        maxlength: Number,
        disabled: Boolean,
        readonly: Boolean,
        tabindex: {
            type: Number,
            default: 0
        },
        size: String,
        icon: String,
        clearable: Boolean
      },
      inject: {
        vueForm: {
          default: ''
        },
        vueFormItem: {
          default: ''
        },
      },
      data: function() {
        return {
            currentValue: '',
            rawValue: '',
            selectRange: false,
            activeIndex: -1,
            valueOnFocus: '',
            scrollLeftOffset: 0,
            fakeBlur: false, //For IE
            focused: false,
            hovering: false
        };
      },
      computed: {
        finalSize: function() {
            return this.size || (this.vueFormItem || {}).vueFormItemSize || (this.$VIY || {}).size;
        },
        sizeClass: function() {
            return this.finalSize ? ('vue-code-input--' + this.finalSize) : '';
        },
        isIconClickable: function(){
            return this.$listeners && VueUtil.isFunction(this.$listeners['icon-click']);
        },
        showClear: function() {
            return this.clearable && 
            !this.inputDisabled && 
            !this.readonly && 
            this.currentValue && 
            (this.focused || this.hovering);
        },
        inputDisabled: function() {
            return this.disabled || (this.vueForm || {}).disabled;
        },
      },
      watch: {
          value: {
              immediate: true,
              handler: function(val){
                  this.setCurrentValue(val, true);
              }
          }
      },
      created: function () {
        document.addEventListener('paste', this.handlePasteBeforeUserClick);
        this.$once('hook:beforeDestroy', function () {
            document.removeEventListener('paste', this.handlePasteBeforeUserClick);
        });
      },
      methods: {
        clearValue: function(){
            this.setCurrentValue('');
            this.$emit('clear');
        },
        hasIcon: function(){
            return this.$slots.suffix || this.icon || this.showClear;
        },
        getMaxLength: function () {
            var blocks = this.format && this.format.blocks || [];
            return blocks.length > 0 ? blocks.reduce(function (previous, current) {
                return previous + current;
            }, 0) : (this.maxlength);
        },
        formatWithBlocks: function (value) {
            // TODO 预留属性，先不实现
            var delimiters = [],
                delimiterLazyShow = false;

            var result = '',
                multipleDelimiters = delimiters.length > 0,
                currentDelimiter,
                format = this.format || {},
                delimiter = format.delimiter,
                blocks = (!VueUtil.isEmpty(format) && !VueUtil.isEmpty(format.blocks)) ? format.blocks : [],
                blocksLength = blocks.length;

            // no options, normal input
            if (blocksLength === 0 || !delimiter) {
                return value;
            }

            value = this.getRawValueWithBlocks(value);
            blocks.forEach(function (length, index) {
                if (value.length > 0) {
                    var sub = value.slice(0, length),
                        rest = value.slice(length);

                    if (multipleDelimiters) {
                        currentDelimiter = delimiters[delimiterLazyShow ? (index - 1) : index] || currentDelimiter;
                    } else {
                        currentDelimiter = delimiter;
                    }

                    if (delimiterLazyShow) {
                        if (index > 0) {
                            result += currentDelimiter;
                        }

                        result += sub;
                    } else {
                        result += sub;

                        if (sub.length === length && index < blocksLength - 1) {
                            result += currentDelimiter;
                        }
                    }

                    // update remaining string
                    value = rest;
                }
            });

            return result;
        },
        formatValue: function(value){
            if(!VueUtil.isDef(value) || !this.format){
                return value;
            }

            if(VueUtil.isFunction(this.format.customFormatter)){
                value = this.format.customFormatter(value);
            }

            if(this.format.numeral){
                var parts, partInteger, partDecimal = '';
                var numeralDecimalMark = this.format.numeralDecimalMark || '.';
                var numeralDecimalScale = this.format.numeralDecimalScale || 2;

                value = value.replace(/[A-Za-z]/g, '')
                // replace the first decimal mark with reserved placeholder
                .replace(numeralDecimalMark, 'M')

                // strip non numeric letters except minus and "M"
                // this is to ensure prefix has been stripped
                .replace(/[^\dM-]/g, '')

                // replace the leading minus with reserved placeholder
                .replace(/^\-/, 'N')

                // strip the other minus sign (if present)
                .replace(/\-/g, '')

                // replace the minus sign (if present)
                .replace('N', this.format.numeralPositiveOnly ? '' : '-')

                // replace decimal mark
                .replace('M', numeralDecimalMark);

                partInteger = value;
                if (value.indexOf(numeralDecimalMark) >= 0) {
                    parts = value.split(numeralDecimalMark);
                    partInteger = parts[0];
                    partDecimal = numeralDecimalMark + parts[1].slice(0, numeralDecimalScale);
                }

                if (this.format.numeralIntegerScale > 0) {
                    partInteger = partInteger.slice(0, this.format.numeralIntegerScale + (value.slice(0, 1) === '-' ? 1 : 0));
                }

                if(this.format.delimiter){
                    partInteger = partInteger.replace(/(\d)(?=(\d{3})+$)/g, '$1' + this.format.delimiter);
                }

                value = partInteger.toString() + (numeralDecimalScale > 0 ? partDecimal.toString() : '')
            } else {
                value = this.formatWithBlocks(value);
            }

            if(this.format.uppercase){
                value = VueUtil.isString(value) ? value.toUpperCase() : value;
            }

            return value;
        },
        getRawValueWithBlocks: function (formattedValue) {
            var format = this.format || {};
            var blocks = format.blocks;
            var delimiter = format.delimiter;
            if (VueUtil.isEmpty(blocks) || !delimiter ||!formattedValue) {
                return formattedValue;
            }

            // var result = '';
            // blocks.forEach(function (length) {
            //     if (formattedValue.length > 0) {
            //         var sub = formattedValue.slice(0, length),
            //             rest = formattedValue.slice(length);

            //         result += sub;

            //         if (rest.length > 0) {
            //             rest = rest.replace(delimiter, '');
            //         }

            //         formattedValue = rest;
            //     }
            // });

            return formattedValue.replace(new RegExp(delimiter,'g'), '');
        },
        getRawValue: function(formattedValue){
            if(!VueUtil.isDef(formattedValue) || !this.format){
                return formattedValue;
            }

            var rawValue = formattedValue;
            if(this.format.numeral){
                rawValue = formattedValue.replace(new RegExp(this.format.delimiter || '', 'g'), '')
                .replace(this.format.numeralDecimalMark || '.', '.');
                return rawValue;
            } else {
                rawValue = this.getRawValueWithBlocks(rawValue);
            }

            return rawValue;
        },
        getIndexOffset: function(inputValue, formattedValue, oldActiveIndex){
            if(oldActiveIndex === -1){
                return 0;
            }

            if(this.format && this.format.numeral){
                var numeralDecimalMark = this.format.numeralDecimalMark || '.';
                var numeralDecimalScale = this.format.numeralDecimalScale || 2;

                var parts, partInteger = inputValue, partDecimal = '';
                if(inputValue.indexOf(numeralDecimalMark) >= 0){
                    parts = inputValue.split(numeralDecimalMark);
                    if(parts.length > 2){
                        return 0;
                    }
                    partInteger = parts[0];
                    partDecimal = parts[1];
                }

                if(this.format.numeralIntegerScale > 0 && partInteger.length > this.format.numeralIntegerScale){
                    return 0;
                }

                if(partDecimal.length > numeralDecimalScale){
                    return 0;
                }

            }

            return formattedValue.length - inputValue.length;
        },
        setCurrentValue: function(value, watchFlg){
            if(watchFlg ? value === this.rawValue : value === this.currentValue){
                return;
            }

            var inputValue = VueUtil.isNumber(value) ? value + '' : value;//value could be number
            var formattedValue = this.formatValue(inputValue);
            var rawValue = this.getRawValue(formattedValue);

            if(this.format && this.format.numeral && VueUtil.isNumberStr(rawValue)){
                rawValue = parseFloat(rawValue);
            }

            // 旧值比当前输入框上的值多一个分割符，表示刚刚删除掉一个分割符，此时新值应该取输入框上的值
            // 此时如果取格式化后的值的话，删掉的分割符又会重新出现，造成分割符没法删除的问题
            var oldFormattedValue = this.currentValue;
            var format = this.format || {};
            var delimiter = format.delimiter;
            if (this.currentValue.length > inputValue.length && delimiter && this.currentValue.replace(inputValue, '') === delimiter) {
                this.currentValue = inputValue;
            } else {
                this.currentValue = formattedValue;
            } 

            this.$nextTick(function(){
                if(watchFlg || this.activeIndex >= this.currentValue.length){
                    this.activeIndex = -1;
                }else {
                    var indexOffset = 0;
                    if (oldFormattedValue.length === formattedValue.length && formattedValue.length - inputValue.length === delimiter.length) {
                        indexOffset = -(delimiter.length - 1);
                    } else {
                        indexOffset = this.getIndexOffset(inputValue, formattedValue, this.activeIndex);
                    }
                    this.activeIndex += indexOffset;

                    if (this.activeIndex !== -1 && delimiter && this.currentValue.endsWith(delimiter)) {
                        this.currentValue = this.currentValue.substring(0, this.currentValue.length - delimiter.length);
                    }
                }
            });

            if( (!watchFlg && this.rawValue !== rawValue) || (watchFlg && (this.rawValue !== rawValue || value !== rawValue)) ){
                this.rawValue = rawValue;
                this.$emit('input', rawValue);//TODO: defaultValue will also trigger input event
                this.dispatch('VueFormItem', 'vue.form.change', [rawValue]);
            }
        },
        handleFocus: function(event){
            if(this.fakeBlur){
                this.fakeBlur = false;
                return;
            }

            this.focused = true;
            this.updateValueOnFocus();
            this.$emit('focus', event);
        },
        updateValueOnFocus: function(){
            this.valueOnFocus = this.rawValue;
        },
        isValueChangeOnBlur: function(){
            return this.valueOnFocus !== this.rawValue;
        },
        handleBlur: function(event){

            //For IE, when click at inputContent, inputContainer will blur and activeElement is inputContent, don't know why
            //For IE, when execute setTextRange, inputContainer will blur and activeElement is inputContainer
            if(document.activeElement === this.$refs.inputContent || document.activeElement === this.$refs.inputContainer){
                this.fakeBlur = true;
                return;
            }
            
            this.focused = false;
            this.$emit('blur', event);
            this.dispatch('VueFormItem', 'vue.form.blur', [this.rawValue]);
            if(this.isValueChangeOnBlur()){
                this.$emit('change', this.rawValue, this.valueOnFocus);
            }
        },
        handleMousedown: function(event){
            this.selectRange = true;//隐藏光标
        },
        // 用户点击 div 之前，@paste 黏贴事件触发不了，但是通过 document.addEventListener('paste', ...) 添加的黏贴事件可以触发
        handlePasteBeforeUserClick: function(event) {
            if (document.activeElement === this.$refs.inputContainer && event.target === document.body) {
                this.handlePaste(event);
            }
        },
        handlePaste: function(event){
            if(this.inputDisabled || this.readonly){
                return;
            }

            var pasteText = event.clipboardData.getData('Text');
            
            var selection = window.getSelection();
            if(selection.isCollapsed){
                this.modifyTextAtActiveIndex('insert', pasteText);
            }else {
                this.modifySelectedText(pasteText);
            }
        },
        handleCopy: function(event){
            event.preventDefault();

            var selectedText = this.getSelectedText();

            if(selectedText){
                var clipboardData = event.clipboardData || window.clipboardData;
                var format = window.clipboardData ? 'Text' : 'text/plain';
                clipboardData.setData(format, selectedText);
            }
        },
        handleCut: function(event){
            if(this.inputDisabled || this.readonly){
                return;
            }

            var selectedText = this.getSelectedText();

            this.modifySelectedText('');

            event.preventDefault();

            var clipboardData = event.clipboardData;

            clipboardData.setData('text/plain', selectedText);
        },
        getSelectedText: function(){
            var selectionIndex = this.getSelectionIndex();
            var startIndex = selectionIndex.startIndex;
            var endIndex = selectionIndex.endIndex;
            
            if(startIndex === endIndex){
                return '';
            }
            
            return this.currentValue.slice(startIndex, endIndex === -1 ?  this.currentValue.length : endIndex);
        },
        setTextRange: function(obj){
            var selection = window.getSelection();
            selection.removeAllRanges();
            
            var startSpanEl = obj.startSpanEl;
            var endSpanEl = obj.endSpanEl;
            var startTextNode = startSpanEl.childNodes[0];
            var endTextNode = endSpanEl.childNodes[0];
            var startOffset = obj.startOffset ? obj.startOffset : 0;
            var endOffset = obj.startOffset ? obj.startOffset : 1;
            
            var range = document.createRange();//selection.getRangeAt(0);
            range.setStart(startTextNode, startOffset);
            range.setEnd(endTextNode, endOffset);
            selection.addRange(range);

            VueUtil.isIE && this.$refs.inputContainer.focus();
        },
        inputContainerDblclick: function(event){
            if (this.currentValue) {
                this.selectAll();
            }
        },
        inputContainerClick: function(event){
            if(window.getSelection().toString().length > 0){
                var anchorNode = window.getSelection().anchorNode;
                var focusNode = window.getSelection().focusNode;
                
                if(!this.$refs.inputContent.contains(anchorNode) || !this.$refs.inputContent.contains(focusNode)){
                    this.collapseToActiveText();
                }

                return;
            }
            
            VueUtil.isIE && this.$refs.inputContainer.focus();//In IE, inputContainer does not focus when click at inputContent
            this.selectRange = false;
            if(event.target === this.$refs.inputContainer || event.target === this.$refs.inputContent){
                var spans = this.$refs.inputContent.children;
                if( spans.length > 0 && event.pageX < spans[0].getBoundingClientRect().left ){
                    this.activeIndex = 0;
                }else {
                    this.activeIndex = -1;
                }
            }
        },
        spanClick: function(event){
            if(window.getSelection().toString().length > 0){
                return;
            }

            VueUtil.isIE && this.$refs.inputContainer.focus();//In IE, inputContainer does not focus when click at span
            this.selectRange = false;
            var spans = this.$refs.inputContent.children;
            var activeIndex = [].indexOf.call(spans, event.target);
            var activeSpanBoundingClientRect = event.target.getBoundingClientRect();
            var clickX = event.x;
            var distanceToActiveRightBorder = activeSpanBoundingClientRect.x + activeSpanBoundingClientRect.width - clickX;
            if(distanceToActiveRightBorder < activeSpanBoundingClientRect.width/2){
                if(activeIndex < spans.length - 1){
                    activeIndex++;
                }else {
                    activeIndex = -1;
                }
            }
                
            this.activeIndex = activeIndex;
        },
        handleIEvx: function(event){
            if(!VueUtil.isIE){
                return;
            }

            var isCollapsed = window.getSelection().isCollapsed;
            //ctrl+V
            if(event.ctrlKey && ( event.key === 'v' || event.key === 'V' )){
                var pasteText = window.clipboardData.getData('Text');
                isCollapsed ? this.modifyTextAtActiveIndex('insert', pasteText) : this.modifySelectedText(pasteText);
                return;
            }

            //ctrl+X
            if(event.ctrlKey && ( event.key === 'x' || event.key === 'X' ) && !isCollapsed){
                var selectedText = this.getSelectedText();

                this.modifySelectedText('');

                event.preventDefault();

                var clipboardData = window.clipboardData;

                clipboardData.setData('Text', selectedText);

                return;
            }
        },
        isInput: function(event, key){
            key = key || this.eventKeyToRealKey(event.key);
            return key.length === 1 && ( !event.ctrlKey && !event.altKey );
        },
        isBackspace: function(event){
            return event.keyCode === 8;
        },
        isDelete: function(event){
            return event.keyCode === 46;
        },
        //shift+left,right,up,down,home,end
        isTextSelect: function(event){
            return event.shiftKey && [37, 39, 38, 40, 36, 35].indexOf(event.keyCode) > -1;
        },
        //left,right,up,down,home,end
        isMouseMove: function(event){
            return [37, 39, 38, 40, 36, 35].indexOf(event.keyCode) > -1;
        },
        isCtrlA: function(event, key){
            key = key || this.eventKeyToRealKey(event.key);
            return event.ctrlKey && ( key === 'a' || key === 'A' );
        },
        isCtrlC: function(event, key){
            key = key || this.eventKeyToRealKey(event.key);
            return event.ctrlKey && ( key === 'c' || key === 'C' ) && !event.altKey && !event.shiftKey;
        },
        isCtrlV: function(event, key){
            key = key || this.eventKeyToRealKey(event.key);
            return event.ctrlKey && ( key === 'v' || key === 'V' ) && !event.altKey && !event.shiftKey;
        },
        isCtrlX: function(event, key){
            key = key || this.eventKeyToRealKey(event.key);
            return event.ctrlKey && ( key === 'x' || key === 'X' ) && !event.altKey && !event.shiftKey;
        },
        isTab: function(event){
            return event.keyCode === 9;
        },
        isRefresh: function(event, key){
            key = key || this.eventKeyToRealKey(event.key);
            return event.keyCode === 116 || ( event.ctrlKey && (key === 'r' || key === 'R') );
        },
        handleKeydown: function(event){
            var key = this.eventKeyToRealKey(event.key);

            if(this.isTab(event) || this.isRefresh(event, key)){
                return;
            }

            //readonly and disabled keydown control
            if( (this.readonly || this.inputDisabled) && ( this.isInput(event, key) || this.isBackspace(event) || this.isDelete(event) ) ){
                return;
            }

            if( !( this.isCtrlC(event, key) || this.isCtrlV(event, key) || this.isCtrlX(event, key) ) ){
                event.preventDefault();
                event.stopPropagation();
            }

            if(VueUtil.isIE){
                this.handleIEvx(event);
                return;
            }

            if(!window.getSelection().isCollapsed){
                //while selection exceed range of inputContent, disable text modify
                var anchorNode = window.getSelection().anchorNode;
                var focusNode = window.getSelection().focusNode;
                if(!this.$refs.inputContent.contains(anchorNode) || !this.$refs.inputContent.contains(focusNode)){
                    return;
                }

                this.handleKeydownWithSelection(event);
            }else {
                this.handleKeydownWithoutSelection(event);
            }
        },
        eventKeyToRealKey: function(eventKey){
            if(VueUtil.isIE){
                var keyMap = {
                    Spacebar: ' ',
                    Decimal: '.',
                    Add: '+',
                    Subtract: '-',
                    Multiply: '*',
                    Divide: '/'
                };
                
                eventKey = keyMap[eventKey] || eventKey;
            }

            return eventKey;
        },
        handleKeydownWithoutSelection: function(event){
            var key = event.key;
            key = this.eventKeyToRealKey(key);

            if(this.isInput(event, key)){
                var inputChar = key;
                this.modifyTextAtActiveIndex('insert', inputChar);
                return;
            }
            
            if(this.isCtrlA(event, key)){
                this.selectAll();
                return;
            }
            
            if(this.isBackspace(event)){
                this.modifyTextAtActiveIndex('backspace');
                return;
            }

            if(this.isDelete(event)){
                this.modifyTextAtActiveIndex('delete');
                return;
            }
            
            if(this.isTextSelect(event)){
                this.selectTextFromActiveIndex(event);
                return;
            }
            
            if(this.isMouseMove(event)){
                this.moveCursorWithoutSelection(event);
                return;
            }
        },
        moveCursorWithoutSelection: function(event){
            if(!this.currentValue){
                return;
            }
            
            var keyCode = event.keyCode;
            if(this.activeIndex == 0 && ([37, 38, 36].indexOf(keyCode) > -1) ){
                return;
            }
            
            if(this.activeIndex == -1 && ([39, 40, 35].indexOf(keyCode) > -1) ){
                return;
            }
            
            //up home
            if([38, 36].indexOf(keyCode) > -1){
                this.activeIndex = 0;
            }
            
            //down end
            if([40, 35].indexOf(keyCode) > -1){
                this.activeIndex = -1;
            }
            
            //left
            if(keyCode === 37){
                if(this.activeIndex === -1){
                    this.activeIndex = this.$refs.inputContent.children.length - 1;     
                }else {
                    this.activeIndex--;
                }
            }
            
            //right
            if(keyCode === 39){
                if(this.activeIndex === this.$refs.inputContent.children.length - 1){
                    this.activeIndex = -1;
                }else {
                    this.activeIndex++;
                }
            }
        },
        handleKeydownWithSelection: function(event){
            var keyCode = event.keyCode;

            var key = event.key;
            key = this.eventKeyToRealKey(key);

            //input or delete
            if( this.isInput(event, key) || this.isBackspace(event) || this.isDelete(event) ){
                var inputChar = ( keyCode === 8 || keyCode === 46 ) ? '' : key;
                this.modifySelectedText(inputChar);
                return;
            }
            
            if(this.isTextSelect(event)){
                this.selectTextWithSelection(event);
                return;
            }
            
            if(this.isMouseMove(event)){
                this.moveCursorWithSelection(event);
                return;
            }

            if(this.isCtrlA(event, key)){
                this.selectAll();
                return;
            }
        },
        moveCursorWithSelection: function(event){
            var keyCode = event.keyCode;

            if([37].indexOf(keyCode) > -1){//left
                this.activeIndex = this.getSelectionIndex().startIndex;
            }else if([39].indexOf(keyCode) > -1){//right
                this.activeIndex = this.getSelectionIndex().endIndex;
            }else if([38, 36].indexOf(keyCode) > -1){//up home
                this.activeIndex = 0;
            }else if([40, 35].indexOf(keyCode) > -1){//down end
                this.activeIndex = -1;
            }
            
            this.collapseToActiveText();
        },
        getSelectionIndex: function(){
            var selection = window.getSelection();
            
            var startIndex;
            var endIndex;
            if(selection.isCollapsed){
                startIndex = endIndex = this.activeIndex;
            }else {
                var spans = this.$refs.inputContent.children;
                
                var anchorNode = selection.anchorNode;
                var anchorSpan = this.getSpanWithinInput(anchorNode);
                var focusNode = selection.focusNode;
                var focusSpan = this.getSpanWithinInput(focusNode);
        
                startIndex = [].indexOf.call(spans, anchorSpan);
                endIndex = [].indexOf.call(spans, focusSpan);
                if(endIndex >= 0 && startIndex > endIndex){
                    var tempIndex = startIndex;
                    startIndex = endIndex;
                    endIndex = tempIndex;
                }
                endIndex = endIndex + 1;
                
                endIndex === spans.length && (endIndex = -1);
            }
            
            return {
                startIndex: startIndex,
                endIndex: endIndex
            };
        },
        getSpanWithinInput: function(node){
            var spans = this.$refs.inputContent.children;
            if(( this.$refs.inputContainer.nextSibling && this.$refs.inputContainer.nextSibling.contains && this.$refs.inputContainer.nextSibling.contains(node) )
              || ( this.$refs.inputContainer.nextElementSibling && this.$refs.inputContainer.nextElementSibling.contains && this.$refs.inputContainer.nextElementSibling.contains(node) )
            ){
                return spans[spans.length -  1];
            }
            
            if(( this.$refs.inputContainer.previousSibling && this.$refs.inputContainer.previousSibling.contains && this.$refs.inputContainer.previousSibling.contains(node) )
              || ( this.$refs.inputContainer.previousElementSibling && this.$refs.inputContainer.previousElementSibling.contains && this.$refs.inputContainer.previousElementSibling.contains(node) )
            ){
                return spans[0];
            }
            
            return node.nodeName === '#text' ? node.parentNode : node;
        },
        selectTextFromActiveIndex: function(event){//TODO: 与getNextRange类似，合并？
            if(!this.currentValue){
                return;
            }
            
            var keyCode = event.keyCode;
            
            if(this.activeIndex === 0 && [37, 38, 36].indexOf(keyCode) > -1){
                return;
            }
            
            if(this.activeIndex === -1 && [39, 40, 35].indexOf(keyCode) > -1){
                return;
            }
            
            var spans = this.$refs.inputContent.children;
            var startSpanEl;
            var endSpanEl;
            
            //left
            if(this.activeIndex !== 0 && [37].indexOf(keyCode) > -1){
                var endIndex = this.activeIndex === -1 ? ( spans.length - 1 ) : ( this.activeIndex - 1 );
                startSpanEl = spans[endIndex];
                endSpanEl = spans[endIndex];
            }
            
            //up home
            if(this.activeIndex !== 0 && [38, 36].indexOf(keyCode) > -1){
                var endIndex = this.activeIndex === -1 ? ( spans.length - 1 ) : ( this.activeIndex - 1 );

                startSpanEl = spans[0];
                endSpanEl = spans[endIndex];
            }
            
            //right
            if(this.activeIndex !== -1 && [39].indexOf(keyCode) > -1){
                startSpanEl = spans[this.activeIndex];
                endSpanEl = spans[this.activeIndex];
            }
            
            //down end
            if(this.activeIndex !== -1 && [40, 35].indexOf(keyCode) > -1){
                startSpanEl = spans[this.activeIndex];
                endSpanEl = spans[spans.length - 1];
            }

            if(startSpanEl){
                this.selectRange = true;
                this.setTextRange({
                    startSpanEl: startSpanEl,
                    startOffset: 0,
                    endSpanEl: endSpanEl,
                    endOffset: 1
                });
            }
        },
        selectTextWithSelection: function(event){
            var nextRange = this.getNextRange(event);
            if(!nextRange){
                this.collapseToActiveText();
            }else {
                this.setTextRange(nextRange);
            }
        },
        getNextRange: function(event){
            var selectionIndex = this.getSelectionIndex();
            
            var rangeDirection = this.activeIndex === selectionIndex.endIndex ? 'rtl' : 'ltr';
            var startSpanEl;
            var endSpanEl;
            
            var keyCode = event.keyCode;
            var spans = this.$refs.inputContent.children;
            
            //ltr: down end
            if(rangeDirection === 'ltr' && [40, 35].indexOf(keyCode) != -1){
                startSpanEl = spans[selectionIndex.startIndex];
                endSpanEl = spans[spans.length - 1];
            }
            
            //ltr: right
            if(rangeDirection === 'ltr' && [39].indexOf(keyCode) != -1){
                startSpanEl = spans[selectionIndex.startIndex];
                endSpanEl = spans[ selectionIndex.endIndex === -1 ? (spans.length - 1) : selectionIndex.endIndex ];
            }
            
            //ltr: left
            if(rangeDirection === 'ltr' && [37].indexOf(keyCode) != -1){
                var endIndex = ( selectionIndex.endIndex === -1 ) ? spans.length - 1 : ( selectionIndex.endIndex - 1 );
                if( endIndex - selectionIndex.startIndex === 0 ){
                    return null;
                }
                startSpanEl = spans[selectionIndex.startIndex];
                endSpanEl = spans[endIndex - 1];
            }
            
            //ltr: up home
            if(rangeDirection === 'ltr' && [38, 36].indexOf(keyCode) != -1){
                if( selectionIndex.startIndex === 0 ){
                    return null;
                }
                startSpanEl = spans[0];
                endSpanEl = spans[selectionIndex.startIndex - 1];
            }
            
        
            //rtl: up home
            if(rangeDirection === 'rtl' && [38, 36].indexOf(keyCode) != -1){
                var endIndex = ( selectionIndex.endIndex === -1 ) ? spans.length - 1 : ( selectionIndex.endIndex - 1 );
                startSpanEl = spans[0];
                endSpanEl = spans[endIndex];
            }
            
            //rtl: left
            if(rangeDirection === 'rtl' && [37].indexOf(keyCode) != -1){
                var endIndex = ( selectionIndex.endIndex === -1 ) ? spans.length - 1 : ( selectionIndex.endIndex - 1 );
                var startIndex = selectionIndex.startIndex === 0 ? 0 : ( selectionIndex.startIndex - 1 );
                startSpanEl = spans[startIndex];
                endSpanEl = spans[endIndex];
            }
            
            //rtl: right
            if(rangeDirection === 'rtl' && [39].indexOf(keyCode) != -1){
                var endIndex = ( selectionIndex.endIndex === -1 ) ? spans.length - 1 : ( selectionIndex.endIndex - 1 );
                if(endIndex - selectionIndex.startIndex === 0){
                    return null;
                }
                startSpanEl = spans[selectionIndex.startIndex + 1];
                endSpanEl = spans[endIndex];
            }
            
            //rtl: down end
            if(rangeDirection === 'rtl' && [40, 35].indexOf(keyCode) != -1){
                if(selectionIndex.endIndex === -1){
                    return null;
                }
                startSpanEl = spans[selectionIndex.endIndex];
                endSpanEl = spans[spans.length - 1];
            }
            
            return {
                startSpanEl: startSpanEl,
                startOffset: 0,
                endSpanEl: endSpanEl,
                endOffset: 1
            };
            
        },
        modifyTextAtActiveIndex: function(type, insertText){
            var maxlength = this.getMaxLength();
            if(VueUtil.isNumber(maxlength) && type === 'insert'){
                var rawValueString = (!VueUtil.isDef(this.rawValue) || (VueUtil.isNumber(this.rawValue && isNaN(this.rawValue)))) ? '' : (this.rawValue + '');
                if( rawValueString.length >= maxlength){
                    return;
                }else if(insertText.length > 1){
                    insertText = this.getRawValueWithBlocks(insertText);
                    insertText = insertText.substring(0, maxlength - rawValueString.length);
                }
            }

            if(this.activeIndex === -1){
                //insert
                ( type === 'insert' ) && this.setCurrentValue( ( this.currentValue ? this.currentValue : '' ) + insertText );

                //backspace
                ( type === 'backspace' ) && this.currentValue && this.setCurrentValue( this.currentValue.slice(0, this.currentValue.length - 1) );

                //delete: delete nothing while at the end of text
            }else {
                var modifiedText = '';
                var activeIndexOffset = 0;

                if(type === 'insert'){
                    modifiedText = this.currentValue.slice(0, this.activeIndex) + insertText + this.currentValue.slice(this.activeIndex);
                    activeIndexOffset = insertText.length;
                }

                if(type === 'backspace' || type === 'delete'){
                    var leftStr = this.currentValue.slice(0, this.activeIndex);
                    var rightStr = this.currentValue.slice(this.activeIndex);
                    modifiedText = type === 'backspace' ? ( leftStr.slice(0, leftStr.length - 1) + rightStr) : ( leftStr + rightStr.slice(1) );
                    activeIndexOffset = type === 'backspace' ? ( this.activeIndex === 0 ? 0 : -1 ) : ( this.activeIndex === modifiedText.length ? -(modifiedText.length + 1): 0 );
                }

                this.setCurrentValue(modifiedText);
                this.activeIndex = this.activeIndex + activeIndexOffset;
            }
        },
        modifySelectedText: function(insertText){
            var selectionIndex = this.getSelectionIndex();
            var startIndex = selectionIndex.startIndex;
            var endIndex = selectionIndex.endIndex;

            var currentLeftStr = this.currentValue.slice(0, startIndex);
            var currentRightStr = ( endIndex === -1 ? '' : this.currentValue.slice(endIndex) );

            var maxlength = this.getMaxLength();
            if(VueUtil.isNumber(maxlength) && VueUtil.isString(insertText) && insertText.length > 0){
                var rawValueString = this.getRawValue(currentLeftStr + currentRightStr);
                insertText = this.getRawValue( this.formatValue(insertText) );
                if(rawValueString.length >= maxlength){
                    return;
                }else if(insertText.length > 1){
                    insertText = this.getRawValueWithBlocks(insertText);
                    insertText = insertText.substring(0, maxlength - rawValueString.length);
                }
            }
            
            this.setCurrentValue( currentLeftStr + insertText + currentRightStr );
            this.activeIndex = endIndex === -1 ? -1 : ( startIndex + (insertText.length) );
    
            this.collapseToActiveText();
        },
        collapseToActiveText: function(){
            var selection = window.getSelection();
            if(!this.currentValue){
                selection.collapse(this.$refs.inputContainer, 0);
            }else {
                var spans = this.$refs.inputContent.children;
                var collapseSpan = this.activeIndex === -1 ? spans[spans.length - 1] : spans[this.activeIndex];
                var collapseText = collapseSpan.childNodes[0];
                var collapseOffset = this.activeIndex === -1 ? 1 : 0;
                selection.collapse(collapseText, collapseOffset);
            }

            this.selectRange = false;

            VueUtil.isIE && this.$refs.inputContainer.focus();
        },
        getInputContentRightX: function(){
            var rect = this.$refs.inputContent.getBoundingClientRect();
            var left = rect.left;
            
            var width = VueUtil.getStyle(this.$refs.inputContent, 'width');
            var paddingLeft = VueUtil.getStyle(this.$refs.inputContent, 'paddingLeft');
            var paddingRight = VueUtil.getStyle(this.$refs.inputContent, 'paddingRight');

            return left + parseInt(width) - parseInt(paddingLeft) - parseInt(paddingRight);
        },
        selectAll: function(){
            var spans = this.$refs.inputContent.children;
                
            if(!this.currentValue){
                return;
            }
            
            this.setTextRange({
                startSpanEl: spans[0],
                startOffset: 0,
                endSpanEl: spans[spans.length - 1],
                endOffset: 1
            });
            
            this.selectRange = true;
            this.activeIndex = 0;
        },
        focus: function(){
            this.$refs.inputContainer && this.$refs.inputContainer.focus();
        },
        handleIconClick: function(event){
            this.$emit('icon-click', event);
        }
      }
    };
    Vue.component(VueCodeInput.name, VueCodeInput);
  });