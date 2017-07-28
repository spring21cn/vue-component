!(function(name, context, definition) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['VueUtil'], definition);
    } else {
        definition(context['VueUtil']);
    }
})('DemoLang', this, function(VueUtil) {
    'use strict';
    var DemoLang = {
        zh: {
            main: {
                title1: '开发指南',
                title2: '组件列表',
                title3: '综合示例',
                radiolabel1: '中',
                radiolabel2: '日',
                radiolabel3: '英',
                install: '快速上手',
                i18n: '国际化',
                ajax: '异步数据传输',
                code: '代码',
                line1: '网站快速成型工具',
                line21: '只为守护世界和平!',
                line22: '只为让你少加班!',
                line23: '只为成就这样的你: ',
                line24: '产品设计师',
                line25: '交互设计师',
                line26: '视觉设计师',
                line27: '产品经理',
                line28: '前端工程师',
                table:{
                    method: '函数名',
                    description: '概述',
                    usage: '用法',
                    parameters: '参数',
                    type: '类型',
                    acceptedValues: '可选值',
                    defaultValue: '默认值'
                }
            },
            install: {
                label: '快速上手',
                samples1: {
                    label: '安装',
                    description: '在页面上引入 js 和 css 文件即可开始使用。'
                },
                samples2: {
                    description: '通过 vue 组件可以很容易地写出一个 Hello world 页面。'
                },
                samples3: {
                    description: '组件内封装的一些常用方法, 可以打开调试工具试试。',
                    row1column2: '事件绑定',
                    row2column2: '事件解除',
                    row3column2: '绑定只触发一次的事件',
                    row4column2: '判断是否存在class',
                    row5column2: '追加class',
                    row6column2: '移除class',
                    row7column2: '获取style值',
                    row8column2: '设置style值',
                    row9column2: '将src1,src2,src3...合并到dest中,返回值为合并后的dest',
                    row10column2: '绑定元素尺寸变动时的事件',
                    row11column2: '移除元素尺寸变动时的事件',
                    row12column2: '将string按format转换为date型,转换失败返回false, format默认为"yyyy-MM-dd"',
                    row13column2: '将date按format转换为string型,转换失败返回"", format默认为"yyyy-MM-dd"',
                    row14column2: '判断src是否可以转换为date型, 返回true/false',
                    row15column2: '将src转换为date型, 失败返回null',
                    row16column2: '设置组件要显示的语言',
                    row17column2: '设置组件多语言(可参看"I18n 国际化")',
                    row18column2: '从DOM上移除node',
                    row19column2: '把node元素插入fatherNode元素的第position个位置',
                    row20column2: '把数组arr转换为Object型',
                    row21column2: '使页面全屏(效果类似F11, 必须使用事件触发)'
                }
            },
            i18n: {
                label: 'I18n 国际化',
                samples1: {
                    label: '基本用法',
                    description: '使用 VueUtil.setLocale() 来设置多语言, 使用 VueUtil.setLang() 来设置显示的语言, 在Vue组件内部可以使用 $t() 来获取多语言的值, 在Vue组件外部可以使用 Vue.t() 来获取多语言的值;'
                }
            },
            ajax: {
                label: '异步数据传输',
                samples1: {
                    label: '基本用法',
                    description: '可以基于全局的Vue对象使用http，也可以基于某个控件使用http。'
                },
                samples2: {
                    label: '支持的HTTP方法',
                    description: '请求API是按照REST风格设计的，它提供了7种请求API'
                },
                samples3: {
                    row1column3: '请求的URL',
                    row2column3: '请求的HTTP方法，例如："GET", "POST"或其他HTTP方法',
                    row4column3: '请求的URL参数对象',
                    row6column3: '单位为毫秒的请求超时时间 (0 表示无超时时间)',
                    row7column3: '请求发送前的处理函数，类似于jQuery的beforeSend函数',
                    row8column3: 'ProgressEvent回调处理函数',
                    row9column3: '表示跨域请求时是否需要使用凭证',
                    row10column3: '发送PUT, PATCH, DELETE请求时以HTTP POST的方式发送，并设置请求头的X-HTTP-Method-Override',
                    row11column3: '将request body以application/x-www-form-urlencoded content type发送'
                }
            },
            layoutDemo: {
                label: 'Layout 布局',
                description: '通过基础的 24 分栏，迅速简便地创建布局。',
                samples1: {
                    label: '基础布局',
                    description: '通过 row 和 col 组件，并通过 col 组件的 span 属性我们就可以自由地组合布局。'
                },
                samples2: {
                    label: '分栏间隔',
                    description: 'row 组件 提供 gutter 属性来指定每一栏之间的间隔，默认间隔为 0。'
                },
                samples3: {
                    label: '混合布局',
                    description: '通过基础的 1/24 分栏任意扩展组合形成较为复杂的混合布局。'
                },
                samples4: {
                    label: '对齐方式',
                    description: '将 type 属性赋值为 \'flex\'，可以启用 flex 布局，并可通过 justify 属性来指定 start, center, end, space-between, space-around 其中的值来定义子元素的排版方式。'
                },
                samples5: {
                    label: '响应式布局',
                    description: '参照了 Bootstrap 的 响应式设计，预设了四个响应尺寸：xs、sm、md 和 lg。'
                },
                samples6: {
                    row1column2: '栅格间隔',
                    row2column2: '布局模式，可选 flex',
                    row3column2: 'flex 布局下的水平排列方式',
                    row4column2: 'flex 布局下的垂直排列方式'
                },
                samples7: {
                    row1column2: '栅格占据的列数',
                    row2column2: '栅格左侧的间隔格数',
                    row3column2: '栅格向右移动格数',
                    row4column2: '栅格向左移动格数',
                    row5column2: '\'<768px\' 响应式栅格数或者栅格属性对象',
                    row6column2: '\'≥768px\' 响应式栅格数或者栅格属性对象',
                    row7column2: '\'≥992px\' 响应式栅格数或者栅格属性对象',
                    row8column2: '\'≥1200px\' 响应式栅格数或者栅格属性对象',
                    row5column3: 'number/object (例如： {span: 4, offset: 4})',
                    row6column3: 'number/object (例如： {span: 4, offset: 4})',
                    row7column3: 'number/object (例如： {span: 4, offset: 4})',
                    row8column3: 'number/object (例如： {span: 4, offset: 4})'
                }
            },
            iconDemo: {
                label:'Icon 图标',
                description: '常用的图标集合',
                samples1: {
                    label: '使用方法',
                    description: '直接通过设置类名为 vue-icon-iconName 来使用即可。'
                },
                samples2: {
                    label: '图标集合'
                }
            },
            buttonDemo: {
                label:'Button 按钮',
                description: '常用的操作按钮。',
                defaultButton: '默认按钮',
                mainButton: '主要按钮',
                textButton: '文字按钮',
                circleButton: '圆角按钮',
                successButton: '成功按钮',
                warningButton: '警告按钮',
                dangerButton: '危险按钮',
                infoButton: '信息按钮',
                samples1: {
                    label: '基础用法',
                    description: 'Button 组件默认提供7种主题，由type属性来定义，默认为default。'
                },
                samples2: {
                    label: '有颜色倾向',
                    description: '设置了不同的type属性对应的样式。设置plain属性，它接受一个Boolean。注意，在该情况下，type虽然可以为text，但是是没有意义的，会显示为text button的样式。',
                    defaultLabel: '默认显示颜色',
                    hoverLabel: 'hover 显示颜色'
                },
                samples3: {
                    label: '禁用状态',
                    description: '设置disabled属性即可，它接受一个Boolean，true为禁用。'
                },
                samples4: {
                    label: '图标按钮',
                    description: '设置icon属性即可，也可以设置在文字右边的 icon ，只要使用i标签即可，可以使用自定义图标。'
                },
                samples5: {
                    label: '按钮组',
                    description: '使用<vue-button-group>标签来嵌套你的按钮'
                },
                samples6: {
                    label: '加载中',
                    description: '设置loading属性为true即可。'
                },
                samples7: {
                    label: '不同尺寸',
                    description: '通过设置size属性来配置它们。'
                },
                samples8: {
                    row1column2: '尺寸',
                    row2column2: '类型',
                    row3column2: '是否圆角按钮',
                    row4column2: '是否朴素按钮',
                    row5column2: '是否加载中状态',
                    row6column2: '是否禁用状态',
                    row7column2: '图标',
                    row8column2: '是否默认聚焦',
                    row9column2: '原生type属性'
                }
            },
            inputDemo: {
                label:'Input 输入框',
                description: '通过鼠标或键盘输入字符。',
                defaultPlaceholder: '请输入内容',
                selectPlaceholder: '请选择',
                samples1: {
                    label: '基础用法'
                },
                samples2: {
                    label: '禁用状态',
                    description: '设置disabled属性即可，它接受一个Boolean，true为禁用。'
                },
                samples3: {
                    label: '带icon的输入框',
                    description: '可以通过icon属性在input组件尾部增加显示图标，可以通过on-icon-click钩子函数来在点击图标后执行需要的逻辑。'
                },
                samples4: {
                    label: '文本域',
                    description: '通过将type属性的值指定为textarea。文本域高度可通过rows属性控制，'
                },
                samples5: {
                    label: '可自适应文本高度的文本域',
                    description: '通过设置 autosize 属性可以使得文本域的高度能够根据文本内容自动进行调整，并且 autosize 还可以设定为一个对象，指定最小行数和最大行数。'
                },
                samples6: {
                    label: '复合型输入框',
                    description: '可前置或后置元素，一般为标签或按钮。可通过slot来指定在input中前置或者后置内容。',
                    selectLabel1: '餐厅名',
                    selectLabel2: '订单号',
                    selectLabel3: '用户电话'
                },
                samples7: {
                    label: '尺寸',
                    description: '可通过size属性指定输入框的尺寸，除了默认的大小外，还提供了large、small和 mini三种尺寸。'
                },
                samples8: {
                    label: '带输入建议',
                    description: 'autocomplete是一个可带输入建议的输入框组件，fetch-suggestions是一个返回输入建议的方法属性，如 querySearch(queryString,cb)，在该方法中你可以在你的输入建议数据准备好时通过cb(data)返回到 autocomplete组件中。',
                    label1: '激活即列出输入建议',
                    label2: '输入后匹配输入建议'
                },
                samples9: {
                    label: '自定义格式',
                    description: '设置cleave属性即可，它接受一个Object。'
                },
                samples10: {
                    row1column2: '类型',
                    row2column2: '绑定值',
                    row3column2: '最大输入长度',
                    row4column2: '最小输入长度',
                    row5column2: '输入框占位文本',
                    row6column2: '禁用',
                    row7column2: '输入框尺寸，只在 type!="textarea"时有效',
                    row8column2: '输入框尾部图标',
                    row9column2: '输入框行数，只对 type="textarea"有效',
                    row10column2: '自定义格式，只对 type!="extarea"有效，更多格式请参考 http://nosir.github.io/cleave.js/',
                    row11column2: '自适应内容高度，只对 type="textarea"有效，可传入对象，如，{ minRows: 2, maxRows: 6 }',
                    row12column2: '原生属性，自动补全',
                    row13column2: '原生属性',
                    row14column2: '原生属性，是否只读',
                    row15column2: '原生属性，设置最大值',
                    row16column2: '原生属性，设置最小值',
                    row17column2: '原生属性，设置输入字段的合法数字间隔',
                    row18column2: '控制是否能被用户缩放, 只对 type="textarea" 有效',
                    row19column2: '原生属性，自动获取焦点',
                    row20column2: '原生属性，',
                    row21column2: '点击 Input内的图标的钩子函数'
                },
                samples11: {
                    row1column2: '点击Input内的图标时触发',
                    row2column2: '在Input失去焦点时触发',
                    row3column2: '在Input获得焦点时触发',
                    row4column2: '在Input值改变时触发'
                },
                samples12: {
                    row1column2: '输入框占位文本',
                    row2column2: '禁用',
                    row3column2: '必填值输入绑定值',
                    row4column2: '通过该参数指定自定义的输入建议列表项的组件名',
                    row5column2: '返回输入建议的方法，仅当你的输入建议数据resolve时，通过调用callback(data:[])来返回它"',
                    row6column2: 'Autocomplete下拉列表的类名',
                    row7column2: '是否在输入框focus时显示建议列表',
                    row8column2: '点击图标的回调函数',
                    row9column2: '输入框尾部图标',
                    row10column2: '配置选项，具体见下表'
                },
                samples13: {
                    row1column2: '指定选项的值为选项对象的某个属性值',
                    row2column2: '指定选项标签为选项对象的某个属性值'
                },
                samples14: {
                    row1column2: '点击选中建议项时触发'
                }
            },
            dateDemo: {
                label:'DatePicker 日期选择器',
                description: '用于选择或输入日期',
                samples1: {
                    label: '基础用法',
                    description: '快捷选项需配置picker-options对象中的shortcuts, 禁用日期通过disabledDate设置.',
                    defaultLabel: '默认',
                    optionsLabel: '带快捷选项',
                    defaultPlaceholder: '选择日期',
                    todayLabel: '今天',
                    yesterdayLabel: '昨天',
                    weekAgoLabel: '上周'
                },
                samples2: {
                    label: '其他日期单位',
                    description: '基本单位由type属性指定',
                    weekLabel: '周',
                    weekPlaceholder: '选择周',
                    weekFormat: 'yyyy 第 WW 周',
                    monthLabel: '月',
                    monthPlaceholder: '选择月',
                    yearLabel: '年',
                    yearPlaceholder: '选择年'
                },
                samples3: {
                    label: '选择日期范围',
                    description: '可在一个选择器中便捷地选择一个时间范围。',
                    defaultLabel: '默认',
                    optionsLabel: '带快捷选项',
                    defaultPlaceholder: '选择日期范围',
                    lastWeekLabel: '最近一周',
                    lastMonthLabel: '最近一个月',
                    last3MonthLabel: '最近三个月'
                },
                samples4: {
                    row1column2: '是否只读',
                    row2column2: '是否禁用',
                    row3column2: '是否显示清除按钮',
                    row4column2: '输入框尺寸',
                    row5column2: '占位文本',
                    row6column2: '显示类型',
                    row7column2: '显示时间日期格式',
                    row7column4: '年:yyyy, 月:MM, 日:dd, 时:HH, 分:mm, 秒:ss, 周:WW',
                    row8column2: '下拉框的对齐方式',
                    row9column2: '下拉框的类名',
                    row10column2: '选择范围时的分隔符',
                    row11column2: '下拉框打开时默认选中的日期',
                    row11column4: '会被new Date()解析',
                    row12column2: '当前选择器特有的选项,参考下表'
                },
                samples5: {
                    row1column2: '设置快捷选项，需要传入 { text, onClick } 对象用法参考 demo 或下表',
                    row2column2: '设置禁用状态，参数为当前日期，要求返回 Boolean',
                    row3column2: '周起始日',
                    row4column2: '选中日期后会执行的回调，只有当 daterange 或 datetimerange 才生效'
                },
                samples6: {
                    row1column2: '标题文本',
                    row2column2: '选中后的回调函数，参数是 vm，可通过触发 "pick" 事件设置选择器的值。例如 vm.$emit("pick", new Date())'
                },
                samples7: {
                    row1column2: '当input的值改变时触发，返回值和文本框一致',
                    row1column3: '格式化后的值'
                }
            },
            timeDemo: {
                label:'TimePicker 时间选择器',
                description: '用于选择或输入时间。',
                samples1: {
                    label: '基础用法',
                    description: '使用vue-time-select时,通过star、end和step指定可选的起始时间、结束时间和步长; 使用vue-time-picker时,通过selectableRange限制可选时间范围',
                    timelabel1: '固定时间点',
                    timelabel2: '任意时间点',
                    timePlaceholder1: '选择时间',
                    timePlaceholder2: '任意时间点',
                    
                },
                samples2: {
                    label: '时间范围',
                    description: '使用vue-time-select时,若先选择开始时间，则结束时间内备选项的状态会随之改变; 使用vue-time-picker时,添加is-range属性即可选择时间范围',
                    timelabel1: '固定时间范围',
                    timelabel2: '任意时间范围',
                    timePlaceholder1: '起始时间',
                    timePlaceholder2: '结束时间',
                    timePlaceholder3: '选择时间范围'
                    
                },
                samples3: {
                    row1column2: '是否只读',
                    row2column2: '是否禁用',
                    row3column2: '是否显示清除按钮',
                    row4column2: '输入框尺寸',
                    row5column2: '占位文本',
                    row6column2: '下拉框的对齐方式',
                    row7column2: '下拉框的类名',
                    row8column2: '当前选择器特有的选项,参考下表'
                },
                samples4: {
                    row1column2: '开始时间',
                    row2column2: '结束时间',
                    row3column2: '间隔时间',
                    row4column2: '最小时间，小于该时间的时间段将被禁用',
                    row5column2: '最大时间，大于该时间的时间段将被禁用'
                },
                samples5: {
                    row1column2: '可选时间段，例如"18:30:00 - 20:30:00"或者传入数组["09:30:00 - 12:00:00", "14:30:00 - 18:30:00"]',
                    row2column2: '时间格式化(TimePicker)',
                    row2column4: '时:HH, 分:mm, 秒:ss'
                },
                samples6: {
                    row1column2: '当 input 的值改变时触发，返回值和文本框一致',
                    row1column3: '格式化后的值'
                }
            },
            datetimeDemo: {
                label:'DateTimePicker 日期时间选择器',
                description: '用于选择或输入日期时间',
                samples1: {
                    label: '基础用法',
                    description: '通过设置type属性为datetime，即可在同一个选择器里同时进行日期和时间的选择。快捷选项的使用方法与Date Picker相同。',
                    defaultLabel: '默认',
                    optionsLabel: '带快捷选项',
                    defaultPlaceholder: '选择日期时间',
                    todayLabel: '今天',
                    yesterdayLabel: '昨天',
                    weekAgoLabel: '上周'
                },
                samples2: {
                    label: '日期和时间范围',
                    description: '设置type为datetimerange即可选择日期和时间范围',
                    defaultLabel: '默认',
                    optionsLabel: '带快捷选项',
                    defaultPlaceholder: '选择时间范围',
                    lastWeekLabel: '最近一周',
                    lastMonthLabel: '最近一个月',
                    last3MonthLabel: '最近三个月'
                },
                samples3: {
                    row1column2: '是否只读',
                    row2column2: '是否禁用',
                    row3column2: '是否显示清除按钮',
                    row4column2: '输入框尺寸',
                    row5column2: '占位文本',
                    row6column2: '显示类型',
                    row7column2: '显示时间日期格式',
                    row7column4: '年:yyyy, 月:MM, 日:dd, 时:HH, 分:mm, 秒:ss, 周:WW',
                    row8column2: '下拉框的对齐方式',
                    row9column2: '下拉框的类名',
                    row10column2: '选择范围时的分隔符',
                    row11column2: '当前选择器特有的选项,参考下表'
                },
                samples4: {
                    row1column2: '设置快捷选项，需要传入 { text, onClick } 对象用法参考 demo 或下表',
                    row2column2: '设置禁用状态，参数为当前日期，要求返回 Boolean'
                },
                samples5: {
                    row1column2: '标题文本',
                    row2column2: '选中后的回调函数，参数是 vm，可通过触发 "pick" 事件设置选择器的值。例如 vm.$emit("pick", new Date())'
                },
                samples6: {
                    row1column2: '当input的值改变时触发，返回值和文本框一致',
                    row1column3: '格式化后的值'
                }
            },
            calendarDemo: {
                label:'Calendar 日历',
                description: '用于查看或选择日期和事件。',
                samples1: {
                    label: '基础用法',
                    description: '通过绑定events来绑定事件,绑定数据为数组且每个元素需包含"date"属性, 通过dayclick事件可获取选择日的日期和事件'
                },
                samples2: {
                    row1column2: '要绑定的事件集合'
                },
                samples3: {
                    row1column2: '获取选择日的日期和事件'
                }
            },
            checkboxDemo: {
                label:'Checkbox 多选框',
                description: '在一组备选项中进行多选。',
                samples1: {
                    label: '基础用法',
                    description: '在vue-checkbox元素中定义v-model绑定变量，单一的checkbox中，默认绑定变量的值会是Boolean，选中为true。'
                },
                samples2: {
                    label: '禁用状态',
                    description: '设置disabled属性即可，它接受一个Boolean，true为禁用。'
                },
                samples3: {
                    label: '多选框组',
                    description: 'checkbox-group元素能把多个checkbox管理为一组，只需要在Group中使用v-model绑定Array类型的变量即可。 vue-checkbox的label属性是该checkbox对应的值，若该标签中无内容，则该属性也充当checkbox按钮后的介绍。label与数组中的元素值相对应，如果存在指定的值则为选中状态，否则为不选中。'
                },
                samples4: {
                    label: 'indeterminate 状态',
                    description: 'indeterminate属性用以表示checkbox的不确定状态，一般用于实现全选的效果'
                },
                samples5: {
                    label: '按钮样式',
                    description: '只需要把vue-checkbox元素换成vue-checkbox-button元素即可。'
                },
                samples6: {
                    row1column2: '选中状态的值(只有在checkbox-group或者绑定对象类型为array时有效)',
                    row2column2: '选中时的值',
                    row3column2: '没有选中时的值',
                    row4column2: '原生属性',
                    row5column2: '按钮禁用',
                    row6column2: '当前是否勾选',
                    row7column2: '设置indeterminate状态，只负责样式控制'
                },
                samples7: {
                    row1column2: '按钮组尺寸',
                    row2column2: '按钮激活时的填充色和边框色',
                    row3column2: '按钮激活时的文本颜色',
                    row4column2: '可被勾选的最小数量',
                    row5column2: '可被勾选的最大数量'
                },
                samples8: {
                    row1column2: '当绑定值变化时触发的事件'
                }
            },
            radioDemo: {
                label:'Radio 单选框',
                description: '在一组Option中进行单选。',
                samples1: {
                    label: '基础用法',
                    description: '选中的条件是绑定的变量值等于label中的值。只需要设置v-model绑定变量，选中意味着变量的值为相应 Radio label属性的值，label可以是String或者Number。'
                },
                samples2: {
                    label: '禁用状态',
                    description: '设置disabled属性即可，它接受一个Boolean，true为禁用。'
                },
                samples3: {
                    label: '单选框组',
                    description: '结合vue-radio-group元素和子元素vue-radio可以实现单选组，在vue-radio-group中绑定v-model，在vue-radio中设置好label即可，无需再给每一个vue-radio绑定变量，'
                },
                samples4: {
                    label: '按钮样式',
                    description: '只需要把vue-radio元素换成vue-radio-button元素即可，'
                },
                samples5: {
                    row1column2: 'Radio的value',
                    row2column2: '是否禁用',
                    row3column2: '原生属性'
                },
                samples6: {
                    row1column2: '按钮组尺寸',
                    row2column2: '按钮激活时的填充色和边框色',
                    row3column2: '按钮激活时的文本颜色'
                },
                samples7: {
                    row1column2: '当绑定值变化时触发的事件',
                    row1column3: '选中的Radio label值'
                },
                samples8: {
                    row1column2: 'Radio的value',
                    row2column2: '是否禁用'
                }
            },
            switchDemo: {
                label:'Switch 开关',
                description: '表示两种相互对立的状态间的切换，多用于触发「开/关」。',
                samples1: {
                    label: '基础用法',
                    description: '绑定v-model到一个Boolean类型的变量。可以使用on-text属性与off-text属性来设置开关的文字描述，使用on-color属性与off-color属性来设置开关的背景色'
                },
                samples2: {
                    label: '禁用状态',
                    description: '设置disabled属性即可，它接受一个Boolean，true为禁用。'
                },
                samples3: {
                    row1column2: '是否禁用',
                    row2column2: 'switch的宽度(像素)',
                    row2column5: '58(有文字)/46(无文字)',
                    row3column2: 'switch打开时所显示图标的类名，设置此项会忽略 on-text',
                    row4column2: 'switch关闭时所显示图标的类名，设置此项会忽略 off-text',
                    row5column2: 'switch打开时的文字',
                    row6column2: 'switch关闭时的文字',
                    row7column2: 'switch打开时的背景色',
                    row8column2: 'switch关闭时的背景色',
                    row9column2: 'switch对应的name属性'
                },
                samples4: {
                    row1column2: 'switch状态发生变化时的回调函数'
                }
            }
        },
        ja: { 
            main: {
                title1: '開発マニュアル',
                title2: 'コンポーネント',
                radiolabel1: '中',
                radiolabel2: '日',
                radiolabel3: '英',
                install: 'クリックスタート',
                i18n: '国際化',
                ajax: '非同期データ送信',
                code: 'コード'
            },
            install: {
                label: 'クリックスタート',
                samples1: {
                    label: 'インストール',
                    description: 'ページ上に js と css ファイルを導入すれば、使用可になる。'
                },
                samples2: {
                    description: 'vue コンポーネントでHello worldページを簡単に出来上がる。'
                }
            },
            i18n: {
                label: 'I18n 国際化',
                samples1: {
                    label: '基本使い方',
                    description: 'VueUtil.setLocale() で多言語を設定し、VueUtil.setLang() で表示言語を設定する。Vueコンポーネント内部に $t() で、多言語の値を取得できる。Vueコンポーネント外部に Vue.t() で、多言語の値を取得できる;'
                }
            },
        }
    }
    VueUtil.setLocale('zh', DemoLang.zh);
    VueUtil.setLocale('ja', DemoLang.ja);
});