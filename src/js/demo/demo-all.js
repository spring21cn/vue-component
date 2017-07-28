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
});!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("AlertDemo", this, function() {
    'use strict';
    var alertDemo = {
        path: '/alert',
        name: 'alert',
        head: {
            label: 'Alert 警告',
            description: '用于页面中展示重要的提示信息。'
        },
        samples: [{
            id: 'alert1',
            label: '基础用法',
            description: '组件提供四种主题，由type属性指定，默认值为info。closable属性决定是否可关闭，可以设置close-text属性来代替右侧的关闭图标，设置close事件来设置关闭时的回调。设置show-icon属性来显示icon。设置dark属性来显示深色样式。',
            template: '<div class="source"><vue-alert title="成功提示的文案" type="success" description="文字说明..." show-icon :closable="false"></vue-alert><vue-alert title="消息提示的文案" type="info" description="文字说明..." show-icon></vue-alert><vue-alert title="警告提示的文案" type="warning" description="文字说明..." show-icon close-text="知道了"></vue-alert><vue-alert title="错误提示的文案" type="error" description="文字说明..." show-icon close-text="走你" @close="closeHandle"></vue-alert><vue-alert title="成功提示的文案" type="success" description="文字说明..." show-icon dark :closable="false"></vue-alert><vue-alert title="消息提示的文案" type="info" description="文字说明..." show-icon dark></vue-alert><vue-alert title="警告提示的文案" type="warning" description="文字说明..." show-icon dark close-text="知道了"></vue-alert><vue-alert title="错误提示的文案" type="error" description="文字说明..." show-icon dark close-text="走你" @close="closeHandle"></vue-alert></div>',
            parameter: {
                methods: {
                    closeHandle: function() {
                        this.$alert("我走了...");
                    }
                }
            },
            code: '<vue-alert title="成功提示的文案" type="success" description="文字说明..." show-icon :closable="false"></vue-alert>\n<vue-alert title="消息提示的文案" type="info" description="文字说明..." show-icon></vue-alert>\n<vue-alert title="警告提示的文案" type="warning" description="文字说明..." show-icon close-text="知道了"></vue-alert>\n<vue-alert title="错误提示的文案" type="error" description="文字说明..." show-icon close-text="走你" @close="closeHandle"></vue-alert>\n<vue-alert title="成功提示的文案" type="success" description="文字说明..." show-icon dark :closable="false"></vue-alert>\n<vue-alert title="消息提示的文案" type="info" description="文字说明..." show-icon dark></vue-alert>\n<vue-alert title="警告提示的文案" type="warning" description="文字说明..." show-icon dark close-text="知道了"></vue-alert>\n<vue-alert title="错误提示的文案" type="error" description="文字说明..." show-icon dark close-text="走你" @close="closeHandle"></vue-alert>\n\n<script>\n    new Vue({\n        methods: {\n            closeHandle: function() {\n                this.$alert("我走了...");\n            }\n        }\n    }).$mount();\n</script>'
        }]
    };
    return alertDemo;
});
!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("AjaxDemo", this, function() {
    'use strict';
    var ajaxDemo = {
        path: '/ajax',
        name: 'ajax',
        head: {
            label: 'ajax.label',
            description: ''
        },
        samples: [{
            id: 'ajax1',
            label: 'ajax.samples1.label',
            description: 'ajax.samples1.description',
            collapse:  ["item1"],
            notshowblock: true,
            code: '//General Vue use http\n'+
            'Vue.http.get(\'/someUrl\', [options]).then(successCallback, errorCallback);\n'+
            'Vue.http.post(\'/someUrl\', [body], [options]).then(successCallback, errorCallback);\n\n'+
            '//Vue components use $http\n'+
            'this.$http.get(\'/someUrl\', [options]).then(successCallback, errorCallback);\n'+
            'this.$http.post(\'/someUrl\', [body], [options]).then(successCallback, errorCallback);'
        },{
            id: 'ajax2',
            label: 'ajax.samples2.label',
            description: 'ajax.samples2.description',
            collapse:  ["item1"],
            notshowblock: true,
            code: 'get(url, [options])\n'+
            'head(url, [options])\n'+
            'delete(url, [options])\n'+
            'jsonp(url, [options])\n'+
            'post(url, [body], [options])\n'+
            'put(url, [body], [options])\n'+
            'patch(url, [body], [options])'
        }, {
            id: 'ajax3',
            label: 'Options',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.description\')" header-align="left" width="320"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "url",
                        column2: "string",
                        column3: "ajax.samples3.row1column3"
                    },{
                        column1: "method",
                        column2: "string",
                        column3: "ajax.samples3.row2column3"
                    },{
                        column1: "body",
                        column2: "Object,FormDatastring",
                        column3: "request body"
                    },{
                        column1: "params",
                        column2: "Object",
                        column3: "ajax.samples3.row4column3"
                    },{
                        column1: "headers",
                        column2: "Object",
                        column3: "request header"
                    },{
                        column1: "timeout",
                        column2: "number",
                        column3: "ajax.samples3.row6column3"
                    },{
                        column1: "before",
                        column2: "function(request)",
                        column3: "ajax.samples3.row7column3"
                    },{
                        column1: "progress",
                        column2: "function(event)",
                        column3: "ajax.samples3.row8column3"
                    },{
                        column1: "credientials",
                        column2: "boolean",
                        column3: "ajax.samples3.row9column3"
                    },{
                        column1: "emulateHTTP",
                        column2: "boolean",
                        column3: "ajax.samples3.row10column3"
                    },{
                        column1: "emulateJSON",
                        column2: "boolean",
                        column3: "ajax.samples3.row11column3"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return ajaxDemo;
});
!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("AsideDemo", this, function() {
    'use strict';
    var asideDemo = {
        path: '/aside',
        name: 'aside',
        head: {
            label: 'Aside 侧边栏',
            description: '在保留当前页面状态的情况下，在侧边承载相关操作。'
        },
        samples: [{
            id: 'aside1',
            label: '基础用法',
            description: '需要设置v-model属性，它接收Boolean，设置left属性控制左右显示。Aside 分为三个部分：header,body和footer，header需要具名为header的slot, footer需要具名为footer的slot。title属性用于定义标题，它是可选的，默认值为空, 当header存在时title不显示。show-close属性显示关闭按钮,默认为false。本例通过显式改变v-model的值来打开 Aside，',
            template: '<div class="source"><vue-aside title="提示" v-model="asideVisible" :left="asideLeft" size="tiny"><span>这是内容</span><span slot="footer"><vue-button @click="asideVisible = false">取 消</vue-button><vue-button type="primary" @click="asideVisible = false">确 定</vue-button></span></vue-aside><vue-row><vue-col :span="6"><vue-button @click="openasideLeft">左边显示</vue-button></vue-col><vue-col :span="6"><vue-button @click="openasideRight">右边显示</vue-button></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        asideLeft: false,
                        asideVisible: false
                    }
                },
                methods: {
                    openasideLeft: function() {
                        this.asideLeft = true;
                        this.asideVisible = true;
                    },
                    openasideRight: function() {
                        this.asideLeft = false;
                        this.asideVisible = true;
                    }
                }
            },
            code: '<vue-aside v-model="asideVisible" :left="asideLeft" size="tiny" title="提示">\n'+
            '    <span>这是内容</span>\n'+
            '    <span slot="footer">\n'+
            '        <vue-button @click="asideVisible = false">取 消</vue-button>\n'+
            '        <vue-button type="primary" @click="asideVisible = false">确 定</vue-button>\n'+
            '    </span>\n'+
            '</vue-aside>\n'+
            '<vue-button @click="openasideLeft">左边显示Aside</vue-button>\n'+
            '<vue-button @click="openasideRight">右边显示Aside</vue-button>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: {\n'+
            '            return: function() {\n'+
            '                 asideLeft: false,\n'+
            '                 asideVisible: false\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            openasideLeft: function() {\n'+
            '                this.asideLeft = true;\n'+
            '                this.asideVisible = true;\n'+
            '            },\n'+
            '            openasideRight: function() {\n'+
            '                this.asideLeft = false;\n'+
            '                this.asideVisible = true;\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'aside2',
            label: '区域表示',
            description: '设置relative属性, 在父容器内展示',
            template: '<div class="source"><div class="phone-viewport"><vue-menu theme="dark" default-active="1" mode="horizontal" @select="asideVisible = true"><vue-menu-item index="1"><i class="vue-icon-setting"></i>设置</vue-menu-item></vue-menu><vue-aside v-model="asideVisible" relative left size="large" close-on-click-modal title="Aside content"><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi cupiditate esse necessitatibus beatae nobis, deserunt ut est fugit, tempora deleniti, eligendi commodi doloribus. Nemo, assumenda possimus, impedit inventore perferendis iusto!</span></vue-aside></div></div>',
            parameter: {
                data: function() {
                    return {
                        asideVisible: false
                    }
                }
            },
            code: '<div class="phone-viewport">\n'+
            '    <vue-menu theme="dark" default-active="1" mode="horizontal" @select="asideVisible = true">\n'+
            '        <vue-menu-item index="1">\n'+
            '            <i class="vue-icon-setting"></i>设置\n'+
            '        </vue-menu-item>\n'+
            '    </vue-menu>\n'+
            '    <vue-aside v-model="asideVisible" relative left size="large" close-on-click-modal title="Aside content">\n'+
            '        <span>\n'+
            '            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi cupiditate esse necessitatibus beatae nobis, deserunt ut est fugit, tempora deleniti, eligendi commodi doloribus. Nemo, assumenda possimus, impedit inventore perferendis iusto!\n'+
            '        </span>\n'+
            '    </vue-aside>\n'+
            '</div>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: {\n'+
            '            return: function() {\n'+
            '                 asideVisible: false\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return asideDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("ButtonDemo", this, function() {
    'use strict';
    var buttonDemo = {
        path: '/button',
        name: 'button',
        head: {
            label: 'buttonDemo.label',
            description: 'buttonDemo.description'
        },
        samples: [{
            label: 'buttonDemo.samples1.label',
            description: 'buttonDemo.samples1.description',
            template: '<div class="source"><vue-button>{{$t("buttonDemo.defaultButton")}}</vue-button><vue-button type="primary">{{$t("buttonDemo.mainButton")}}</vue-button><vue-button type="text">{{$t("buttonDemo.textButton")}}</vue-button><vue-button circle>{{$t("buttonDemo.circleButton")}}</vue-button></div>',
            code: '<vue-button>{{$t("buttonDemo.defaultButton")}}</vue-button>\n<vue-button type="primary">{{$t("buttonDemo.mainButton")}}</vue-button>\n<vue-button type="text">{{$t("buttonDemo.textButton")}}</vue-button>\n<vue-button circle>{{$t("buttonDemo.circleButton")}}</vue-button>',
            id: 'button1'
        }, {
            label: 'buttonDemo.samples2.label',
            description: 'buttonDemo.samples2.description',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t("buttonDemo.samples2.defaultLabel")}}</span></vue-col><vue-col :span="16"><vue-button type="success">{{$t("buttonDemo.successButton")}}</vue-button><vue-button type="warning">{{$t("buttonDemo.warningButton")}}</vue-button><vue-button type="danger">{{$t("buttonDemo.dangerButton")}}</vue-button><vue-button type="info">{{$t("buttonDemo.infoButton")}}</vue-button></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t("buttonDemo.samples2.hoverLabel")}}</span></vue-col><vue-col :span="16"><vue-button :plain="true" type="success">{{$t("buttonDemo.successButton")}}</vue-button><vue-button :plain="true" type="warning">{{$t("buttonDemo.warningButton")}}</vue-button><vue-button :plain="true" type="danger">{{$t("buttonDemo.dangerButton")}}</vue-button><vue-button :plain="true" type="info">{{$t("buttonDemo.infoButton")}}</vue-button></vue-col></vue-row></div>',
            code: '<span class="demonstration">{{$t("buttonDemo.samples2.defaultLabel")}}</span>\n<vue-button type="success">{{$t("buttonDemo.successButton")}}</vue-button>\n<vue-button type="warning">{{$t("buttonDemo.warningButton")}}</vue-button>\n<vue-button type="danger">{{$t("buttonDemo.dangerButton")}}</vue-button>\n<vue-button type="info">{{$t("buttonDemo.infoButton")}}</vue-button>\n<span class="demonstration">{{$t("buttonDemo.samples2.hoverLabel")}}</span>\n<vue-button :plain="true" type="success">{{$t("buttonDemo.successButton")}}</vue-button>\n<vue-button :plain="true" type="warning">{{$t("buttonDemo.warningButton")}}</vue-button>\n<vue-button :plain="true" type="danger">{{$t("buttonDemo.dangerButton")}}</vue-button>\n<vue-button :plain="true" type="info">{{$t("buttonDemo.infoButton")}}</vue-button>',
            id: 'button2'
        }, {
            label: 'buttonDemo.samples3.label',
            description: 'buttonDemo.samples3.description',
            template: '<div class="source"><vue-button :plain="true" :disabled="true">{{$t("buttonDemo.defaultButton")}}</vue-button><vue-button type="primary" :disabled="true">{{$t("buttonDemo.mainButton")}}</vue-button><vue-button type="text" :disabled="true">{{$t("buttonDemo.textButton")}}</vue-button></div>',
            code: '<vue-button :plain="true" :disabled="true">{{$t("buttonDemo.defaultButton")}}</vue-button>\n<vue-button type="primary" :disabled="true">{{$t("buttonDemo.mainButton")}}</vue-button>\n<vue-button type="text" :disabled="true">{{$t("buttonDemo.textButton")}}</vue-button>',
            id: 'button3'
        }, {
            label: 'buttonDemo.samples4.label',
            description: 'buttonDemo.samples3.description',
            template: '<div class="source"><vue-button type="primary" icon="vue-icon-edit"></vue-button><vue-button type="primary" icon="vue-icon-share" circle></vue-button><vue-button type="primary" icon="vue-icon-delete"></vue-button><vue-button type="primary" icon="vue-icon-search">Search</vue-button><vue-button type="primary">Upload<i class="vue-icon-upload vue-icon--right"></i></vue-button></div>',
            code: '<vue-button type="primary" icon="vue-icon-edit"></vue-button>\n<vue-button type="primary" icon="vue-icon-share" circle></vue-button>\n<vue-button type="primary" icon="vue-icon-delete"></vue-button>\n<vue-button type="primary" icon="vue-icon-search">Search</vue-button>\n<vue-button type="primary">Upload<i class="vue-icon-upload vue-icon--right"></i></vue-button>',
            id: 'button4'
        }, {
            label: 'buttonDemo.samples5.label',
            description: 'buttonDemo.samples5.description',
            template: '<div class="source"><vue-row><vue-col :span="8"><vue-button-group><vue-button type="primary" icon="vue-icon-arrow-left">Page up</vue-button><vue-button type="primary">Page down<i class="vue-icon-arrow-right vue-icon--right"></i></vue-button></vue-button-group></vue-col><vue-col :span="8"><vue-button-group><vue-button type="primary" icon="vue-icon-edit"></vue-button><vue-button type="primary" icon="vue-icon-share"></vue-button><vue-button type="primary" icon="vue-icon-delete"></vue-button></vue-button-group></vue-col></vue-row></div>',
            code: '<vue-button-group>\n    <vue-button type="primary" icon="vue-icon-arrow-left">Page up</vue-button>\n    <vue-button type="primary">Page down<i class="vue-icon-arrow-right vue-icon--right"></i></vue-button>\n</vue-button-group>\n<vue-button-group>\n    <vue-button type="primary" icon="vue-icon-edit"></vue-button>\n    <vue-button type="primary" icon="vue-icon-share"></vue-button>\n    <vue-button type="primary" icon="vue-icon-delete"></vue-button>\n</vue-button-group>',
            id: 'button5'
        }, {
            label: 'buttonDemo.samples6.label',
            description: 'buttonDemo.samples6.description',
            template: '<div class="source"><vue-button type="primary" :loading="true">Loading</vue-button></div>',
            code: '<vue-button type="primary" :loading="true">Loading</vue-button>',
            id: 'button6'
        }, {
            label: 'buttonDemo.samples7.label',
            description: 'buttonDemo.samples7.description',
            template: '<div class="source"><vue-button type="primary" size="large">Large Button</vue-button><vue-button type="primary">Normal Button</vue-button><vue-button type="primary" size="small">Small Button</vue-button><vue-button type="primary" size="mini">Mini Button</vue-button></div>',
            code: '<vue-button type="primary" size="large">Large Button</vue-button>\n<vue-button type="primary">Normal Button</vue-button>\n<vue-button type="primary" size="small">Small Button</vue-button>\n<vue-button type="primary" size="mini">Mini Button</vue-button>',
            id: 'button7'
        }, {
            id: 'button8',
            label: 'Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "size",
                        column2: "buttonDemo.samples8.row1column2",
                        column3: "string",
                        column4: "large,small,mini",
                        column5: "—"
                    },{
                        column1: "type",
                        column2: "buttonDemo.samples8.row2column2",
                        column3: "string",
                        column4: "primary,success,warning,danger,info,text",
                        column5: "—"
                    },{
                        column1: "circle",
                        column2: "buttonDemo.samples8.row3column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "plain",
                        column2: "buttonDemo.samples8.row4column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "loading",
                        column2: "buttonDemo.samples8.row5column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "disabled",
                        column2: "buttonDemo.samples8.row6column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "icon",
                        column2: "buttonDemo.samples8.row7column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "autofocus",
                        column2: "buttonDemo.samples8.row8column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "native-type",
                        column2: "buttonDemo.samples8.row9column2",
                        column3: "string",
                        column4: "button,submit,reset",
                        column5: "button"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return buttonDemo;
});!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("CardDemo", this, function() {
    'use strict';
    var cardDemo = {
        path: '/card',
        name: 'card',
        head: {
            label: 'Card 卡片',
            description: '将信息聚合在卡片容器中展示。'
        },
        samples: [{
            id: 'card1',
            label: '基础用法',
            description: 'Card 组件包括header和body部分，header部分需要有显式具名 slot 分发，同时也是可选的。',
            template: '<div class="source"><vue-card class="box"><div slot="header" ><span style="line-height: 36px;">卡片名称</span><vue-button style="float: right;" type="primary">操作按钮</vue-button></div><div v-for="o in 4" :key="o">{{"列表内容 " + o }}</div></vue-card></div>',
            code: '<vue-card class="box">\n'+
            '    <div slot="header" >\n'+
            '        <span style="line-height: 36px;">卡片名称</span>\n'+
            '        <vue-button style="float: right;" type="primary">操作按钮</vue-button>\n'+
            '    </div>\n'+
            '    <div v-for="o in 4" :key="o">\n'+
            '        {{"列表内容 " + o }}\n'+
            '    </div>\n'+
            '</vue-card>'
        }]
    };
    return cardDemo;
});

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

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("CascaderDemo", this, function() {
    'use strict';
    var cascaderDemo = {
        path: '/cascader',
        name: 'cascader',
        head: {
            label: 'Cascader 级联选择器',
            description: '当一个数据集合有清晰的层级结构时，可通过级联选择器逐级查看并选择。'
        },
        samples: [{
            id: 'cascader1',
            label: '基础用法',
            description: '只需为 Cascader 的options属性指定选项数组即可渲染出一个级联选择器。通过expand-trigger可以定义展开子级菜单的触发方式。 change事件的参数为 Cascader 的绑定值：一个由各级菜单的值所组成的数组。',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">默认 click 触发子菜单</span></vue-col><vue-col :span="16"><vue-cascader :options="options" v-model="selectedOptions1" @change="handleChange"></vue-cascader></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">hover 触发子菜单</span></vue-col><vue-col :span="16"><vue-cascader expand-trigger="hover" :options="options" v-model="selectedOptions2" @change="handleChange"></vue-cascader></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        options: [{
                            value: "fujian",
                            label: "福建省",
                            children: [{
                                value: "xiamen",
                                label: "厦门市",
                                children: [{
                                    value: "shimin",
                                    label: "思明区"
                                }, {
                                    value: "huli",
                                    label: "湖里区"
                                }, {
                                    value: "tongan",
                                    label: "同安区"
                                }, {
                                    value: "xiangan",
                                    label: "翔安区"
                                }, {
                                    value: "haichang",
                                    label: "海沧区"
                                }, {
                                    value: "jimei",
                                    label: "集美区"
                                }]
                            }]
                        }, {
                            value: "hainan",
                            label: "海南省",
                            children: [{
                                value: "haikou",
                                label: "海口市",
                                children: [{
                                    value: "xiuying",
                                    label: "秀英区"
                                }, {
                                    value: "qiongsan",
                                    label: "琼山区"
                                }, {
                                    value: "meilang",
                                    label: "美兰区"
                                }, {
                                    value: "longhua",
                                    label: "龙华区"
                                }]
                            }]
                        }],
                        selectedOptions1: [],
                        selectedOptions2: []
                    };
                },
                methods: {
                    handleChange: function(value) {
                        console.log(value);
                    }
                }
            },
            code: '<span class="demonstration">默认 click 触发子菜单</span>\n<vue-cascader :options="options" v-model="selectedOptions1" @change="handleChange"></vue-cascader>\n<span class="demonstration">hover 触发子菜单</span>\n<vue-cascader expand-trigger="hover" :options="options" v-model="selectedOptions2" @change="handleChange"></vue-cascader>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                options: [{\n                    value: "fujian",\n                    label: "福建省",\n                    children: [{\n                        value: "xiamen",\n                        label: "厦门市",\n                        children: [{\n                            value: "shimin",\n                            label: "思明区",\n                        }, {\n                            value: "huli",\n                            label: "湖里区",\n                        }, {\n                            value: "tongan",\n                            label: "同安区",\n                        }, {\n                            value: "xiangan",\n                            label: "翔安区",\n                        }, {\n                            value: "haichang",\n                            label: "海沧区",\n                        }, {\n                            value: "jimei",\n                            label: "集美区",\n                        }]\n                    }]\n                }, {\n                    value: "hainan",\n                    label: "海南省",\n                    children: [{\n                        value: "haikou",\n                        label: "海口市",\n                        children: [{\n                            value: "xiuying",\n                            label: "秀英区",\n                        }, {\n                            value: "qiongsan",\n                            label: "琼山区",\n                        }, {\n                            value: "meilang",\n                            label: "美兰区",\n                        }, {\n                            value: "longhua",\n                            label: "龙华区",\n                        }]\n                    }]\n                }],\n                selectedOptions1: [],\n                selectedOptions2: []\n            }\n        },\n        methods: {\n            handleChange: function(value) {\n                console.log(value);\n            }\n        }\n    }).$mount();\n</script>'
        }]
    };
    return cascaderDemo;
});
!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("CheckboxDemo", this, function() {
    'use strict';
    var checkboxDemo = {
        path: '/checkbox',
        name: 'checkbox',
        head: {
            label: 'checkboxDemo.label',
            description: 'checkboxDemo.description'
        },
        samples: [{
            id: 'checkbox1',
            label: 'checkboxDemo.samples1.label',
            description: 'checkboxDemo.samples1.description',
            template: '<div class="source"><vue-checkbox v-model="checked">Option</vue-checkbox></div>',
            parameter: {
                data: function() {
                    return {
                        checked: true
                    }
                }
            },
            code: '<vue-checkbox v-model="checked">Option</vue-checkbox>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                checked: true\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'checkbox2',
            label: 'checkboxDemo.samples2.label',
            description: 'checkboxDemo.samples2.description',
            template: '<div class="source"><vue-checkbox v-model="checked1" disabled>Option</vue-checkbox><vue-checkbox v-model="checked2" disabled>Option</vue-checkbox></div>',
            parameter: {
                data: function() {
                    return {
                        checked1: false,
                        checked2: true
                    }
                }
            },
            code: '<vue-checkbox v-model="checked1" disabled>Option</vue-checkbox>\n<vue-checkbox v-model="checked2" disabled>Option</vue-checkbox>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                checked1: false,\n                checked2: true\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'checkbox3',
            label: 'checkboxDemo.samples3.label',
            description: 'checkboxDemo.samples3.description',
            template: '<div class="source"><vue-checkbox-group v-model="checkList"><vue-checkbox label="Option A"></vue-checkbox><vue-checkbox label="Option B"></vue-checkbox><vue-checkbox label="Option C"></vue-checkbox><vue-checkbox label="Disabled" disabled></vue-checkbox><vue-checkbox label="Selected and Disabled" disabled></vue-checkbox></vue-checkbox-group></div>',
            parameter: {
                data: function() {
                    return {
                        checkList: ["Selected and Disabled", "Option A"]
                    }
                }
            },
            code: '<vue-checkbox-group v-model="checkList">\n    <vue-checkbox label="Option A"></vue-checkbox>\n    <vue-checkbox label="Option B"></vue-checkbox>\n    <vue-checkbox label="Option C"></vue-checkbox>\n    <vue-checkbox label="Disabled" disabled></vue-checkbox>\n    <vue-checkbox label="Selected and Disabled" disabled></vue-checkbox>\n</vue-checkbox-group>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                checkList: ["Selected and Disabled","Option A"]\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'checkbox4',
            label: 'checkboxDemo.samples4.label',
            description: 'checkboxDemo.samples4.description',
            template: '<div class="source"><vue-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Check All</vue-checkbox><div style="margin: 15px 0;"></div><vue-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange"><vue-checkbox v-for="city in cities" :key="city" :label="city">{{city}}</vue-checkbox></vue-checkbox-group></div>',
            parameter: {
                data: function() {
                    return {
                        checkAll: true,
                        checkedCities: ['New York', 'Chicago'],
                        cities: ['New York', 'Chicago', 'Los Angeles', 'Washington'],
                        isIndeterminate: true
                    }
                },
                methods: {
                    handleCheckAllChange: function(event) {
                        this.checkedCities = event.target.checked ? ['New York', 'Chicago', 'Los Angeles', 'Washington'] : [];
                        this.isIndeterminate = false;
                    },
                    handleCheckedCitiesChange: function(value) {
                        var checkedCount = value.length;
                        this.checkAll = checkedCount === this.cities.length;
                        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
                    }
                }
            },
            code: '<vue-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Check All</vue-checkbox>\n<vue-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">\n    <vue-checkbox v-for="city in cities" :key="city" :label="city">{{city}}</vue-checkbox>\n</vue-checkbox-group>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                checkAll: true,\n                checkedCities: [\'New York\', \'Chicago\'],\n                cities: [\'New York\', \'Chicago\', \'Los Angeles\', \'Washington\'],\n                isIndeterminate: true\n            }\n        },\n        methods: {\n            handleCheckAllChange: function(event) {\n                this.checkedCities = event.target.checked ? [\'New York\', \'Chicago\', \'Los Angeles\', \'Washington\'] : [];\n                this.isIndeterminate = false;\n            },\n            handleCheckedCitiesChange: function(value) {\n                var checkedCount = value.length;\n                this.checkAll = checkedCount === this.cities.length;\n                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'checkbox5',
            label: 'checkboxDemo.samples5.label',
            description: 'checkboxDemo.samples5.description',
            template: '<div class="source"><vue-checkbox-group v-model="checkboxGroup1" size="large" fill="#324057" text-color="#a4aebd" :min="1" :max="3"><vue-checkbox-button label="New York"></vue-checkbox-button><vue-checkbox-button label="Chicago"></vue-checkbox-button><vue-checkbox-button label="Los Angeles"></vue-checkbox-button><vue-checkbox-button label="Washington"></vue-checkbox-button></vue-checkbox-group><div style="margin: 15px 0;"></div><vue-checkbox-group v-model="checkboxGroup2"><vue-checkbox-button label="New York"></vue-checkbox-button><vue-checkbox-button label="Chicago" :disabled="true"></vue-checkbox-button><vue-checkbox-button label="Los Angeles"></vue-checkbox-button><vue-checkbox-button label="Washington"></vue-checkbox-button></vue-checkbox-group><div style="margin: 15px 0;"></div><vue-checkbox-group v-model="checkboxGroup3" :disabled="true"><vue-checkbox-button label="New York"></vue-checkbox-button><vue-checkbox-button label="Chicago"></vue-checkbox-button><vue-checkbox-button label="Los Angeles"></vue-checkbox-button><vue-checkbox-button label="Washington"></vue-checkbox-button></vue-checkbox-group></div>',
            parameter: {
                data: function() {
                    return {
                        checkboxGroup1: ['New York'],
                        checkboxGroup2: ['Washington'],
                        checkboxGroup3: ['Los Angeles']
                    }
                }
            },
            code: '<vue-checkbox-group v-model="checkboxGroup1" size="large" fill="#324057" text-color="#a4aebd" :min="1" :max="3">\n    <vue-checkbox-button label="New York"></vue-checkbox-button>\n    <vue-checkbox-button label="Chicago"></vue-checkbox-button>\n    <vue-checkbox-button label="Los Angeles"></vue-checkbox-button>\n    <vue-checkbox-button label="Washington"></vue-checkbox-button>\n</vue-checkbox-group>\n<vue-checkbox-group v-model="checkboxGroup2">\n    <vue-checkbox-button label="New York"></vue-checkbox-button>\n    <vue-checkbox-button label="Chicago" :disabled="true"></vue-checkbox-button>\n    <vue-checkbox-button label="Los Angeles"></vue-checkbox-button>\n    <vue-checkbox-button label="Washington"></vue-checkbox-button>\n</vue-checkbox-group>\n<vue-checkbox-group v-model="checkboxGroup3" :disabled="true">\n    <vue-checkbox-button label="New York"></vue-checkbox-button>\n    <vue-checkbox-button label="Chicago"></vue-checkbox-button>\n    <vue-checkbox-button label="Los Angeles"></vue-checkbox-button>\n    <vue-checkbox-button label="Washington"></vue-checkbox-button>\n</vue-checkbox-group>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                checkboxGroup1: ["New York"],\n                checkboxGroup2: ["Washington"],\n                checkboxGroup3: ["Los Angeles"]\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'checkbox6',
            label: 'Checkbox Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "label",
                        column2: "checkboxDemo.samples6.row1column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "true-label",
                        column2: "checkboxDemo.samples6.row2column2",
                        column3: "string, number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "false-label",
                        column2: "checkboxDemo.samples6.row3column2",
                        column3: "string, number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "name",
                        column2: "checkboxDemo.samples6.row4column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "disabled",
                        column2: "checkboxDemo.samples6.row5column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "checked",
                        column2: "checkboxDemo.samples6.row6column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "indeterminate",
                        column2: "checkboxDemo.samples6.row7column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'checkbox7',
            label: 'Checkbox-group Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "size",
                        column2: "checkboxDemo.samples7.row1column2",
                        column3: "string",
                        column4: "large, small, mini",
                        column5: "—"
                    },{
                        column1: "fill",
                        column2: "checkboxDemo.samples7.row2column2",
                        column3: "string",
                        column4: "—",
                        column5: "#20a0ff"
                    },{
                        column1: "text-color",
                        column2: "checkboxDemo.samples7.row3column2",
                        column3: "string",
                        column4: "—",
                        column5: "#ffffff"
                    },{
                        column1: "min",
                        column2: "checkboxDemo.samples7.row4column2",
                        column3: "number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "max",
                        column2: "checkboxDemo.samples7.row5column2",
                        column3: "number",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'checkbox8',
            label: 'Checkbox Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "change",
                        column2: "checkboxDemo.samples8.row1column2",
                        column3: "Event object"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return checkboxDemo;
});!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("DateDemo", this, function() {
    'use strict';
    var dateDemo = {
        path: '/date',
        name: 'date',
        head: {
            label: 'dateDemo.label',
            description: 'dateDemo.description'
        },
        samples: [{
            id: 'date1',
            label: 'dateDemo.samples1.label',
            description: 'dateDemo.samples1.description',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'dateDemo.samples1.defaultLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value1" type="date" :placeholder="$t(\'dateDemo.samples1.defaultPlaceholder\')" :picker-options="pickerOptions0"></vue-date-picker></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'dateDemo.samples1.optionsLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value2" align="right" type="date" :placeholder="$t(\'dateDemo.samples1.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                    pickerOptions0: {
                      disabledDate: function(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                      }
                    },
                    pickerOptions1: {
                        shortcuts: [{
                            text: this.$t('dateDemo.samples1.todayLabel'),
                            onClick: function(picker) {
                              picker.$emit('pick', new Date());
                            }
                          }, {
                            text: this.$t('dateDemo.samples1.yesterdayLabel'),
                            onClick: function(picker) {
                              var date = new Date();
                              date.setTime(date.getTime() - 3600 * 1000 * 24);
                              picker.$emit('pick', date);
                            }
                          }, {
                            text: this.$t('dateDemo.samples1.weekAgoLabel'),
                            onClick: function(picker) {
                              var date = new Date();
                              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                              picker.$emit('pick', date);
                            }
                          }]
                        },
                        value1: '',
                        value2: ''
                  };
                }
            },
            code: '<span class="demonstration">{{$t(\'dateDemo.samples1.defaultLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value1" type="date" :placeholder="$t(\'dateDemo.samples1.defaultPlaceholder\')" :picker-options="pickerOptions0"></vue-date-picker>\n'+
            '<span class="demonstration">{{$t(\'dateDemo.samples1.optionsLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value2" align="right" type="date" :placeholder="$t(\'dateDemo.samples1.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                pickerOptions0: {\n'+
            '                    disabledDate: function(time) {\n'+
            '                        return time.getTime() < Date.now() - 8.64e7;\n'+
            '                    }\n'+
            '                },\n'+
            '                pickerOptions1: {\n'+
            '                    shortcuts: [{\n'+
            '                        text: this.$t("dateDemo.samples1.todayLabel"),\n'+
            '                        onClick: function(picker) {\n'+
            '                            picker.$emit("pick", new Date());\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t("dateDemo.samples1.yesterdayLabel"),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var date = new Date();\n'+
            '                            date.setTime(date.getTime() - 3600 * 1000 * 24);\n'+
            '                            picker.$emit("pick", date);\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t("dateDemo.samples1.weekAgoLabel"),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var date = new Date();\n'+
            '                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);\n'+
            '                            picker.$emit("pick", date);\n'+
            '                        }\n'+
            '                    }]\n'+
            '                },\n'+
            '                value1: "",\n'+
            '                value2: ""\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'date2',
            label: 'dateDemo.samples2.label',
            description: 'dateDemo.samples2.description',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t("dateDemo.samples2.weekLabel")}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value1" type="week" :format="$t(\'dateDemo.samples2.weekFormat\')" :placeholder="$t(\'dateDemo.samples2.weekPlaceholder\')"></vue-date-picker></vue-col></vue-row><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t("dateDemo.samples2.monthLabel")}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value2" type="month" :placeholder="$t(\'dateDemo.samples2.monthPlaceholder\')"></vue-date-picker></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t("dateDemo.samples2.yearLabel")}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value3" type="year" :placeholder="$t(\'dateDemo.samples2.yearPlaceholder\')"></vue-date-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                        value1: '',
                        value2: '',
                        value3: ''
                  };
                }
            },
            code: '<span class="demonstration">{{$t("dateDemo.samples2.weekLabel")}}</span>\n'+
            '<vue-date-picker v-model="value1" type="week" :format="$t(\'dateDemo.samples2.weekFormat\')" :placeholder="$t(\'dateDemo.samples2.weekPlaceholder\')"></vue-date-picker>\n'+
            '<span class="demonstration">{{$t("dateDemo.samples2.monthLabel")}}</span>\n'+
            '<vue-date-picker v-model="value2" type="month" :placeholder="$t(\'dateDemo.samples2.monthPlaceholder\')"></vue-date-picker>\n'+
            '<span class="demonstration">{{$t("dateDemo.samples2.yearLabel")}}</span>\n'+
            '<vue-date-picker v-model="value3" type="year" :placeholder="$t(\'dateDemo.samples2.yearPlaceholder\')"></vue-date-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                value1: "",\n'+
            '                value2: "",\n'+
            '                value3: ""\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'date3',
            label: 'dateDemo.samples3.label',
            description: 'dateDemo.samples3.description',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'dateDemo.samples3.defaultLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value1" type="daterange" :placeholder="$t(\'dateDemo.samples3.defaultPlaceholder\')"></vue-date-picker></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'dateDemo.samples3.optionsLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value2" align="right" type="daterange" :placeholder="$t(\'dateDemo.samples3.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                      value1: '',
                      value2: '',
                      pickerOptions1: {
                          shortcuts: [{
                              text: this.$t('dateDemo.samples3.lastWeekLabel'),
                              onClick: function(picker) {
                                  var end = new Date();
                                  var start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                  picker.$emit("pick", [start, end]);
                              }
                          }, {
                              text: this.$t('dateDemo.samples3.lastMonthLabel'),
                              onClick: function(picker) {
                                  var end = new Date();
                                  var start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                  picker.$emit("pick", [start, end]);
                              }
                          }, {
                              text: this.$t('dateDemo.samples3.last3MonthLabel'),
                              onClick: function(picker) {
                                  var end = new Date();
                                  var start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                  picker.$emit("pick", [start, end]);
                              }
                          }]
                      }
                  };
                }
            },
            code: '<span class="demonstration">{{$t(\'dateDemo.samples3.defaultLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value1" type="daterange" :placeholder="$t(\'dateDemo.samples3.defaultPlaceholder\')"></vue-date-picker>\n'+
            '<span class="demonstration">{{$t(\'dateDemo.samples3.optionsLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value2" align="right" type="daterange" :placeholder="$t(\'dateDemo.samples3.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                value1: "",\n'+
            '                value2: "",\n'+
            '                pickerOptions1: {\n'+
            '                    shortcuts: [{\n'+
            '                        text: this.$t(\'dateDemo.samples3.lastWeekLabel\'),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var end = new Date();\n'+
            '                            var start = new Date();\n'+
            '                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);\n'+
            '                            picker.$emit("pick", [start, end]);\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t(\'dateDemo.samples3.lastMonthLabel\'),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var end = new Date();\n'+
            '                            var start = new Date();\n'+
            '                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);\n'+
            '                            picker.$emit("pick", [start, end]);\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t(\'dateDemo.samples3.last3MonthLabel\'),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var end = new Date();\n'+
            '                            var start = new Date();\n'+
            '                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);\n'+
            '                            picker.$emit("pick", [start, end]);\n'+
            '                        }\n'+
            '                    }]\n'+
            '                },\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'date4',
            label: 'Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "readonly",
                        column2: "dateDemo.samples4.row1column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "true"
                    },{
                        column1: "disabled",
                        column2: "dateDemo.samples4.row2column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "clearable",
                        column2: "dateDemo.samples4.row3column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "true"
                    },{
                        column1: "size",
                        column2: "dateDemo.samples4.row4column2",
                        column3: "string",
                        column4: "large, small, mini",
                        column5: "—"
                    },{
                        column1: "placeholder",
                        column2: "dateDemo.samples4.row5column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "type",
                        column2: "dateDemo.samples4.row6column2",
                        column3: "string",
                        column4: "year/month/date/week/datetime/datetimerange/daterange",
                        column5: "date"
                    },{
                        column1: "format",
                        column2: "dateDemo.samples4.row7column2",
                        column3: "string",
                        column4: "dateDemo.samples4.row7column4",
                        column5: "yyyy-MM-dd"
                    },{
                        column1: "align",
                        column2: "dateDemo.samples4.row8column2",
                        column3: "string",
                        column4: "left, center, right",
                        column5: "left"
                    },{
                        column1: "popper-class",
                        column2: "dateDemo.samples4.row9column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "range-separator",
                        column2: "dateDemo.samples4.row10column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "default-value",
                        column2: "dateDemo.samples4.row11column2",
                        column3: "Date",
                        column4: "dateDemo.samples4.row11column4",
                        column5: "—"
                    },{
                        column1: "picker-options",
                        column2: "dateDemo.samples4.row12column2",
                        column3: "object",
                        column4: "—",
                        column5: "{}"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'date5',
            label: 'Picker Options',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "shortcuts",
                        column2: "dateDemo.samples5.row1column2",
                        column3: "object/array",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "disabledDate",
                        column2: "dateDemo.samples5.row2column2",
                        column3: "Function",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "firstDayOfWeek",
                        column2: "dateDemo.samples5.row3column2",
                        column3: "Number",
                        column4: "1~7",
                        column5: "7"
                    },{
                        column1: "onPick",
                        column2: "dateDemo.samples5.row4column2",
                        column3: "Function({ maxDate, minDate })",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'date6',
            label: ' Shortcuts',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "text",
                        column2: "dateDemo.samples6.row1column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "onClick",
                        column2: "dateDemo.samples6.row2column2",
                        column3: "Function",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'date7',
            label: 'Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left" width="150"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "change",
                        column2: "dateDemo.samples7.row1column2",
                        column3: "dateDemo.samples7.row1column3"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return dateDemo;
});
!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("TimeDemo", this, function() {
    'use strict';
    var timeDemo = {
        path: '/time',
        name: 'time',
        head: {
            label: 'timeDemo.label',
            description: 'timeDemo.description'
        },
        samples: [{
            id: 'time1',
            label: 'timeDemo.samples1.label',
            description: 'timeDemo.samples1.description',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'timeDemo.samples1.timelabel1\')}}</span></vue-col><vue-col :span="16"><vue-time-select v-model="value1" :picker-options="{ start: \'08:30\', step: \'00:15\', end: \'18:30\'}" :placeholder="$t(\'timeDemo.samples1.timePlaceholder1\')"></vue-time-select></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'timeDemo.samples1.timelabel2\')}}</span></vue-col><vue-col :span="16"><vue-time-picker v-model="value2" :picker-options="{selectableRange: \'18:30:00 - 20:30:00\'}" :placeholder="$t(\'timeDemo.samples1.timePlaceholder2\')"></vue-time-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                        value1: '',
                        value2: new Date(2017, 7, 10, 9, 40)
                  };
                }
            },
            code: '<span class="demonstration">{{$t(\'timeDemo.samples1.timelabel1\')}}</span>\n'+
            '<vue-time-select v-model="value1" :picker-options="{ start: \'08:30\', step: \'00:15\', end: \'18:30\'}" :placeholder="$t(\'timeDemo.samples1.timePlaceholder1\')"></vue-time-select>\n'+
            '<span class="demonstration">{{$t(\'timeDemo.samples1.timelabel2\')}}</span>\n'+
            '<vue-time-picker v-model="value2" :picker-options="{selectableRange: \'18:30:00 - 20:30:00\'}" :placeholder="$t(\'timeDemo.samples1.timePlaceholder2\')"></vue-time-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                value1: "",\n'+
            '                value2: new Date(2017, 7, 10, 9, 40)\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'time2',
            label: '时间范围',
            description: '使用vue-time-select时,若先选择开始时间，则结束时间内备选项的状态会随之改变; 使用vue-time-picker时,添加is-range属性即可选择时间范围',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'timeDemo.samples2.timelabel1\')}}</span></vue-col><vue-col :span="16"><vue-time-select :placeholder="$t(\'timeDemo.samples2.timePlaceholder1\')" v-model="startTime" :picker-options="{ start: \'08:30\', step: \'00:15\', end: \'18:30\'}"></vue-time-select><vue-time-select :placeholder="$t(\'timeDemo.samples2.timePlaceholder2\')" v-model="endTime" :picker-options="{start: \'08:30\', step: \'00:15\', end: \'18:30\', minTime: startTime}"></vue-time-select></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'timeDemo.samples2.timelabel2\')}}</span></vue-col><vue-col :span="16"><vue-time-picker is-range v-model="time" :placeholder="$t(\'timeDemo.samples2.timePlaceholder3\')"></vue-time-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                      startTime: '',
                      endTime: '',
                      time: [new Date(2017, 7, 10, 8, 40), new Date(2017, 7, 10, 9, 40)]
                  };
                }
            },
            code: '<span class="demonstration">{{$t(\'timeDemo.samples2.timelabel1\')}}</span>\n'+
            '<vue-time-select :placeholder="$t(\'timeDemo.samples2.timePlaceholder1\')" v-model="startTime" :picker-options="{ start: \'08:30\', step: \'00:15\', end: \'18:30\'}"></vue-time-select><vue-time-select :placeholder="$t(\'timeDemo.samples2.timePlaceholder2\')" v-model="endTime" :picker-options="{start: \'08:30\', step: \'00:15\', end: \'18:30\', minTime: startTime}"></vue-time-select>\n'+
            '<span class="demonstration">{{$t(\'timeDemo.samples2.timelabel2\')}}</span>\n'+
            '<vue-time-picker is-range v-model="time" :placeholder="$t(\'timeDemo.samples2.timePlaceholder3\')"></vue-time-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                startTime: "",\n'+
            '                endTime: "",\n'+
            '                time: [new Date(2017, 7, 10, 8, 40), new Date(2017, 7, 10, 9, 40)]\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'time3',
            label: 'Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "readonly",
                        column2: "timeDemo.samples3.row1column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "true"
                    },{
                        column1: "disabled",
                        column2: "timeDemo.samples3.row2column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "clearable",
                        column2: "timeDemo.samples3.row3column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "true"
                    },{
                        column1: "size",
                        column2: "timeDemo.samples3.row4column2",
                        column3: "string",
                        column4: "large, small, mini",
                        column5: "—"
                    },{
                        column1: "placeholder",
                        column2: "timeDemo.samples3.row5column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "align",
                        column2: "timeDemo.samples3.row6column2",
                        column3: "string",
                        column4: "left, center, right",
                        column5: "left"
                    },{
                        column1: "popper-class",
                        column2: "timeDemo.samples3.row7column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "picker-options",
                        column2: "timeDemo.samples3.row8column2",
                        column3: "object",
                        column4: "—",
                        column5: "{}"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'time4',
            label: 'vue-time-select Picker Options',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "start",
                        column2: "timeDemo.samples4.row1column2",
                        column3: "string",
                        column4: "—",
                        column5: "09:00"
                    },{
                        column1: "end",
                        column2: "timeDemo.samples4.row2column2",
                        column3: "string",
                        column4: "—",
                        column5: "18:00"
                    },{
                        column1: "step",
                        column2: "timeDemo.samples4.row3column2",
                        column3: "string",
                        column4: "—",
                        column5: "00:30"
                    },{
                        column1: "minTime",
                        column2: "timeDemo.samples4.row4column2",
                        column3: "string",
                        column4: "—",
                        column5: "00:00"
                    },{
                        column1: "maxTime",
                        column2: "timeDemo.samples4.row5column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'time5',
            label: 'vue-time-picker Picker Options',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "selectableRange",
                        column2: "timeDemo.samples5.row1column2",
                        column3: "string/array",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "format",
                        column2: "timeDemo.samples5.row2column2",
                        column3: "string",
                        column4: "timeDemo.samples5.row2column4",
                        column5: "'HH:mm:ss'"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'time6',
            label: 'Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left" width="150"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "change",
                        column2: "timeDemo.samples6.row1column2",
                        column3: "timeDemo.samples6.row1column3"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return timeDemo;
});
!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("DateTimeDemo", this, function() {
    'use strict';
    var dateTimeDemo = {
        path: '/dateTime',
        name: 'dateTime',
        head: {
            label: 'datetimeDemo.label',
            description: 'datetimeDemo.description'
        },
        samples: [{
            id: 'dateTime1',
            label: 'datetimeDemo.samples1.label',
            description: 'datetimeDemo.samples1.description',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'datetimeDemo.samples1.defaultLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value1" type="datetime" :placeholder="$t(\'datetimeDemo.samples1.defaultPlaceholder\')"></vue-date-picker></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'datetimeDemo.samples1.optionsLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value2" align="right" type="datetime" :placeholder="$t(\'datetimeDemo.samples1.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                      pickerOptions1: {
                          shortcuts: [{
                              text: this.$t('datetimeDemo.samples1.todayLabel'),
                              onClick: function(picker) {
                                picker.$emit('pick', new Date());
                              }
                            }, {
                              text: this.$t('datetimeDemo.samples1.yesterdayLabel'),
                              onClick: function(picker) {
                                var date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24);
                                picker.$emit('pick', date);
                              }
                            }, {
                              text: this.$t('datetimeDemo.samples1.weekAgoLabel'),
                              onClick: function(picker) {
                                var date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', date);
                              }
                            }]
                          },
                      value1: "",
                      value2: ""
                  };
                }
            },
            code: '<span class="demonstration">{{$t(\'datetimeDemo.samples1.defaultLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value1" type="datetime" :placeholder="$t(\'datetimeDemo.samples1.defaultPlaceholder\')"></vue-date-picker>\n'+
            '<span class="demonstration">{{$t(\'datetimeDemo.samples1.optionsLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value2" align="right" type="datetime" :placeholder="$t(\'datetimeDemo.samples1.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                pickerOptions1: {\n'+
            '                    shortcuts: [{\n'+
            '                        text: this.$t("datetimeDemo.samples1.todayLabel"),\n'+
            '                        onClick: function(picker) {\n'+
            '                            picker.$emit("pick", new Date());\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t("datetimeDemo.samples1.yesterdayLabel"),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var date = new Date();\n'+
            '                            date.setTime(date.getTime() - 3600 * 1000 * 24);\n'+
            '                            picker.$emit("pick", date);\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t("datetimeDemo.samples1.weekAgoLabel"),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var date = new Date();\n'+
            '                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);\n'+
            '                            picker.$emit("pick", date);\n'+
            '                        }\n'+
            '                    }]\n'+
            '                },\n'+
            '                value1: "",\n'+
            '                value2: ""\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'dateTime2',
            label: 'datetimeDemo.samples2.label',
            description: 'datetimeDemo.samples2.description',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'datetimeDemo.samples2.defaultLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value1" type="datetimerange" :placeholder="$t(\'datetimeDemo.samples2.defaultPlaceholder\')"></vue-date-picker></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">{{$t(\'datetimeDemo.samples2.optionsLabel\')}}</span></vue-col><vue-col :span="16"><vue-date-picker v-model="value2" align="right" type="datetimerange" :placeholder="$t(\'datetimeDemo.samples2.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                      pickerOptions1: {
                          shortcuts: [{
                              text: this.$t('datetimeDemo.samples2.lastWeekLabel'),
                              onClick: function(picker) {
                                  var end = new Date();
                                  var start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                  picker.$emit("pick", [start, end]);
                              }
                          }, {
                              text: this.$t('datetimeDemo.samples2.lastMonthLabel'),
                              onClick: function(picker) {
                                  var end = new Date();
                                  var start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                  picker.$emit("pick", [start, end]);
                              }
                          }, {
                              text: this.$t('datetimeDemo.samples2.last3MonthLabel'),
                              onClick: function(picker) {
                                  var end = new Date();
                                  var start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                  picker.$emit("pick", [start, end]);
                              }
                          }]
                      },
                      value1: [new Date(2017, 5, 10, 10, 10), new Date(2017, 6, 11, 10, 10)],
                      value2: ""
                  };
                }
            },
            code: '<span class="demonstration">{{$t(\'datetimeDemo.samples2.defaultLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value1" type="datetimerange" :placeholder="$t(\'datetimeDemo.samples2.defaultPlaceholder\')"></vue-date-picker>\n'+
            '<span class="demonstration">{{$t(\'datetimeDemo.samples2.optionsLabel\')}}</span>\n'+
            '<vue-date-picker v-model="value2" align="right" type="datetimerange" :placeholder="$t(\'datetimeDemo.samples2.defaultPlaceholder\')" :picker-options="pickerOptions1"></vue-date-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                pickerOptions1: {\n'+
            '                    shortcuts: [{\n'+
            '                        text: this.$t(\'datetimeDemo.samples2.lastWeekLabel\'),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var end = new Date();\n'+
            '                            var start = new Date();\n'+
            '                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);\n'+
            '                            picker.$emit("pick", [start, end]);\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t(\'datetimeDemo.samples2.lastMonthLabel\'),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var end = new Date();\n'+
            '                            var start = new Date();\n'+
            '                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);\n'+
            '                            picker.$emit("pick", [start, end]);\n'+
            '                        }\n'+
            '                    },{\n'+
            '                        text: this.$t(\'datetimeDemo.samples2.last3MonthLabel\'),\n'+
            '                        onClick: function(picker) {\n'+
            '                            var end = new Date();\n'+
            '                            var start = new Date();\n'+
            '                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);\n'+
            '                            picker.$emit("pick", [start, end]);\n'+
            '                        }\n'+
            '                    }]\n'+
            '                },\n'+
            '                value1: [new Date(2017, 07, 10, 10, 10), new Date(2017, 07, 11, 10, 10)],\n'+
            '                value2: ""\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'dateTime3',
            label: 'Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "readonly",
                        column2: "datetimeDemo.samples3.row1column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "true"
                    },{
                        column1: "disabled",
                        column2: "datetimeDemo.samples3.row2column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "clearable",
                        column2: "datetimeDemo.samples3.row3column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "true"
                    },{
                        column1: "size",
                        column2: "datetimeDemo.samples3.row4column2",
                        column3: "string",
                        column4: "large, small, mini",
                        column5: "—"
                    },{
                        column1: "placeholder",
                        column2: "datetimeDemo.samples3.row5column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "type",
                        column2: "datetimeDemo.samples3.row6column2",
                        column3: "string",
                        column4: "year/month/date/week/datetime/datetimerange/daterange",
                        column5: "date"
                    },{
                        column1: "format",
                        column2: "datetimeDemo.samples3.row7column2",
                        column3: "string",
                        column4: "datetimeDemo.samples3.row7column4",
                        column5: "yyyy-MM-dd"
                    },{
                        column1: "align",
                        column2: "datetimeDemo.samples3.row8column2",
                        column3: "string",
                        column4: "left, center, right",
                        column5: "left"
                    },{
                        column1: "popper-class",
                        column2: "datetimeDemo.samples3.row9column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "range-separator",
                        column2: "datetimeDemo.samples3.row10column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "picker-options",
                        column2: "datetimeDemo.samples3.row11column2",
                        column3: "object",
                        column4: "—",
                        column5: "{}"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'dateTime4',
            label: 'Picker Options',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "shortcuts",
                        column2: "datetimeDemo.samples4.row1column2",
                        column3: "object/array",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "disabledDate",
                        column2: "datetimeDemo.samples4.row2column2",
                        column3: "Function",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'dateTime5',
            label: ' Shortcuts',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "text",
                        column2: "datetimeDemo.samples5.row1column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "onClick",
                        column2: "datetimeDemo.samples5.row2column2",
                        column3: "Function",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'dateTime6',
            label: 'Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left" width="150"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "change",
                        column2: "datetimeDemo.samples6.row1column2",
                        column3: "datetimeDemo.samples6.row1column3"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return dateTimeDemo;
});
!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("DialogDemo", this, function() {
    'use strict';
    var dialogDemo = {
        path: '/dialog',
        name: 'dialog',
        head: {
            label: 'Dialog 对话框',
            description: '在保留当前页面状态的情况下，告知用户并承载相关操作。'
        },
        samples: [{
            id: 'dialog1',
            label: '基础用法',
            description: '需要设置v-model属性，它接收Boolean，当为true时显示 Dialog。Dialog 分为三个部分：header,body和footer，header需要具名为header的slot, footer需要具名为footer的slot。title属性用于定义标题，它是可选的，默认值为空, 当header存在时title不显示。show-close属性显示关闭按钮,默认为false。本例通过显式改变v-model的值来打开 Dialog，',
            template: '<div class="source"><vue-button type="primary" @click="dialogVisible = true">点我</vue-button><vue-dialog title="提示" v-model="dialogVisible" size="tiny" show-close><span slot="header">这是提示</span><span>这是一段信息</span><span slot="footer"><vue-button @click="dialogVisible = false">取 消</vue-button><vue-button type="primary" @click="dialogVisible = false">确 定</vue-button></span></vue-dialog></div>',
            parameter: {
                data: function() {
                    return {
                        dialogVisible: false
                    }
                }
            },
            code: '<vue-button type="primary" @click="dialogVisible = true">点我</vue-button>\n'+
            '<vue-dialog title="提示" v-model="dialogVisible" size="tiny" show-close>\n'+
            '    <span slot="header">这是提示</span>\n'+
            '    <span>这是一段信息</span>\n'+
            '    <span slot="footer" class="dialog-footer">\n'+
            '        <vue-button @click="dialogVisible = false">取 消</vue-button>\n'+
            '        <vue-button type="primary" @click="dialogVisible = false">确 定</vue-button>\n'+
            '    </span>\n'+
            '</vue-dialog>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return {\n'+
            '                dialogVisible: false\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return dialogDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("DropdownDemo", this, function() {
    'use strict';
    var dropdownDemo = {
        path: '/dropdown',
        name: 'dropdown',
        head: {
            label: 'Dropdown 下拉菜单',
            description: '将动作或菜单折叠到下拉菜单中。'
        },
        samples: [{
            id: 'dropdown1',
            label: '基础用法',
            description: '通过组件slot来设置下拉触发的元素以及需要通过具名slot为dropdown 来设置下拉菜单。默认情况下，下拉按钮只要hover即可，无需点击也会显示下拉菜单。',
            template: '<div class="source"><vue-row><vue-col :span="6"><vue-dropdown><vue-button type="primary">下拉菜单<i class="vue-icon-caret-bottom vue-icon--right"></i></vue-button><vue-dropdown-menu slot="dropdown"><vue-dropdown-item>YAMAHA</vue-dropdown-item><vue-dropdown-item disabled>HONDA</vue-dropdown-item><vue-dropdown-item divided>TOYOTA</vue-dropdown-item></vue-dropdown-menu></vue-dropdown></vue-col><vue-col :span="6"><vue-dropdown split-button type="primary" @click="handleClick">更多菜单<vue-dropdown-menu slot="dropdown"><vue-dropdown-item>YAMAHA</vue-dropdown-item><vue-dropdown-item>HONDA</vue-dropdown-item><vue-dropdown-item>TOYOTA</vue-dropdown-item></vue-dropdown-menu></vue-dropdown></vue-col></vue-row></div>',
            parameter: {
                methods: {
                  handleClick: function() {
                    this.$alert("button click");
                  }
                }
            },
            code: '<vue-dropdown>\n'+
            '    <vue-button type="primary">\n'+
            '        下拉菜单<i class="vue-icon-caret-bottom vue-icon--right"></i>\n'+
            '    </vue-button>\n'+
            '    <vue-dropdown-menu slot="dropdown">\n'+
            '        <vue-dropdown-item>YAMAHA</vue-dropdown-item>\n'+
            '        <vue-dropdown-item disabled>HONDA</vue-dropdown-item>\n'+
            '        <vue-dropdown-item divided>TOYOTA</vue-dropdown-item>\n'+
            '    </vue-dropdown-menu>\n'+
            '</vue-dropdown>\n\n'+
            '<vue-dropdown split-button type="primary" @click="handleClick">\n'+
            '    更多菜单\n'+
            '    <vue-dropdown-menu slot="dropdown">\n'+
            '        <vue-dropdown-item>YAMAHA</vue-dropdown-item>\n'+
            '        <vue-dropdown-item>HONDA</vue-dropdown-item>\n'+
            '        <vue-dropdown-item>TOYOTA</vue-dropdown-item>\n'+
            '    </vue-dropdown-menu>\n'+
            '</vue-dropdown>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            handleClick: function() {\n'+
            '                this.$alert("button click");\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return dropdownDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("FormDemo", this, function() {
    'use strict';
    var formDemo = {
        path: '/form',
        name: 'form',
        head: {
            label: 'Form 表单',
            description: '由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据。'
        },
        samples: [{
            id: 'form1',
            label: '表单验证',
            description: '在防止用户犯错的前提下，尽可能让用户更早地发现并纠正错误。',
            template: '<div class="source"><vue-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"><vue-form-item label="活动名称" prop="name"><vue-input v-model="ruleForm.name"></vue-input></vue-form-item><vue-form-item label="活动区域" prop="region"><vue-select v-model="ruleForm.region" placeholder="请选择活动区域"><vue-option label="区域一" value="shanghai"></vue-option><vue-option label="区域二" value="beijing"></vue-option></vue-select></vue-form-item><vue-form-item label="活动性质" prop="type"><vue-checkbox-group v-model="ruleForm.type"><vue-checkbox label="美食" name="type"></vue-checkbox><vue-checkbox label="K歌" name="type"></vue-checkbox><vue-checkbox label="棋牌" name="type"></vue-checkbox></vue-checkbox-group></vue-form-item><vue-form-item label="特殊资源" prop="resource"><vue-radio-group v-model="ruleForm.resource"><vue-radio label="活动经费"></vue-radio><vue-radio label="场地免费"></vue-radio></vue-radio-group></vue-form-item><vue-form-item label="活动形式" prop="desc"><vue-input type="textarea" v-model="ruleForm.desc"></vue-input></vue-form-item><div style="margin: 50px 0;"></div><vue-form-item><vue-button type="primary" @click="submitForm(\'ruleForm\')">立即创建</vue-button><vue-button @click="resetForm(\'ruleForm\')">重置</vue-button></vue-form-item></vue-form></div>',
            parameter: {
                data: function() {
                    return {
                        ruleForm: {
                            name: "",
                            region: "",
                            type: [],
                            resource: "",
                            desc: ""
                        },
                        rules: {
                            name: [{
                                required: true,
                                message: "请输入活动名称"
                            }, {
                                min: 3,
                                max: 5,
                                message: "长度在 3 到 5 个字符"
                            }],
                            region: [{
                                required: true,
                                message: "请选择活动区域"
                            }],
                            type: [{
                                type: "array",
                                required: true,
                                message: "请至少选择一个活动性质"
                            }],
                            resource: [{
                                required: true,
                                message: "请选择活动资源"
                            }],
                            desc: [{
                                required: true,
                                message: "请填写活动形式"
                            }]
                        }
                    }
                },
                methods: {
                    submitForm: function(formName) {
                        var self = this;
                        self.$refs[formName].validate(function(valid) {
                            if (valid) {
                                self.$alert("submit!");
                            } else {
                                console.log("error submit!");
                                return false;
                            }
                        });
                    },
                    resetForm: function(formName) {
                        this.$refs[formName].resetFields();
                    }
                }
            },
            code: '<vue-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">\n    <vue-form-item label="活动名称" prop="name">\n        <vue-input v-model="ruleForm.name"></vue-input>\n    </vue-form-item>\n    <vue-form-item label="活动区域" prop="region">\n        <vue-select v-model="ruleForm.region" placeholder="请选择活动区域">\n            <vue-option label="区域一" value="shanghai"></vue-option>\n            <vue-option label="区域二" value="beijing"></vue-option>\n        </vue-select>\n    </vue-form-item>\n    <vue-form-item label="活动性质" prop="type">\n        <vue-checkbox-group v-model="ruleForm.type">\n            <vue-checkbox label="美食" name="type"></vue-checkbox>\n            <vue-checkbox label="K歌" name="type"></vue-checkbox>\n            <vue-checkbox label="棋牌" name="type"></vue-checkbox>\n        </vue-checkbox-group>\n    </vue-form-item>\n    <vue-form-item label="特殊资源" prop="resource">\n        <vue-radio-group v-model="ruleForm.resource">\n            <vue-radio label="活动经费"></vue-radio>\n            <vue-radio label="场地免费"></vue-radio>\n        </vue-radio-group>\n    </vue-form-item>\n    <vue-form-item label="活动形式" prop="desc">\n        <vue-input type="textarea" v-model="ruleForm.desc"></vue-input>\n    </vue-form-item>\n    <vue-form-item>\n        <vue-button type="primary" @click="submitForm(\'ruleForm\')">立即创建</vue-button>\n        <vue-button @click="resetForm(\'ruleForm\')">重置</vue-button>\n    </vue-form-item>\n</vue-form>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                ruleForm: {\n                    name: "",\n                    region: "",\n                    type: [],\n                    resource: "",\n                    desc: ""\n                },\n                rules: {\n                    name: [\n                        { required: true, message: "请输入活动名称", trigger: "change" },\n                        { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "change" },\n                    ],\n                    region: [\n                        { required: true, message: "请选择活动区域", trigger: "change" },\n                    ],\n                    type: [\n                        { type: "array", required: true, message: "请至少选择一个活动性质", trigger: "change" },\n                    ],\n                    resource: [\n                        { required: true, message: "请选择活动资源", trigger: "change" },\n                    ],\n                    desc: [\n                        { required: true, message: "请填写活动形式", trigger: "change" },\n                    ]\n                }\n            }\n        },\n        methods: {\n            submitForm: function(formName) {\n                var self = this;\n                self.$refs[formName].validate(function(valid) {\n                     if (valid) {\n                         self.$alert("submit!");\n                     } else {\n                         console.log("error submit!");\n                         return false;\n                     }\n                });\n            },\n            resetForm: function(formName) {\n                this.$refs[formName].resetFields();\n            }\n        }\n    }).$mount();\n</script>'
        }]
    };
    return formDemo;
});
!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("IconDemo", this, function() {
    'use strict';
    var iconDemo = {
        path: '/icon',
        name: 'icon',
        head: {
            label: 'iconDemo.label',
            description: 'iconDemo.description'
        },
        samples: [{
            label: 'iconDemo.samples1.label',
            description: 'iconDemo.samples1.description',
            template: '<div class="source"><i class="vue-icon-edit"></i><i class="vue-icon-share"></i><i class="vue-icon-delete"></i><vue-button type="primary" icon="vue-icon-search">Search</vue-button></div>',
            code: '<i class="vue-icon-edit"></i>\n<i class="vue-icon-share"></i>\n<i class="vue-icon-delete"></i>\n<vue-button type="primary" icon="vue-icon-search">Search</vue-button>',
            id: 'icon1'
        }, {
            label: 'iconDemo.samples2.label',
            description: '',
            template: '<div class="source source-icon"><ul class="icon-list"><li v-for="(icon,index) in iconAry" :key="index"><span><i :class="icon"></i><span style="font-size: 11px;">{{icon}}</span></span></li></ul></div>',
            parameter: {
                data: function() {
                	return {
                		iconAry: ['vue-icon-arrow-down', 'vue-icon-arrow-left', 'vue-icon-arrow-right', 'vue-icon-arrow-up', 'vue-icon-caret-bottom', 'vue-icon-caret-left', 'vue-icon-caret-right', 'vue-icon-caret-top', 'vue-icon-check', 'vue-icon-circle-check', 'vue-icon-circle-close', 'vue-icon-circle-cross', 'vue-icon-close', 'vue-icon-upload', 'vue-icon-d-arrow-left', 'vue-icon-d-arrow-right', 'vue-icon-d-caret', 'vue-icon-date', 'vue-icon-delete', 'vue-icon-document', 'vue-icon-edit', 'vue-icon-information', 'vue-icon-loading', 'vue-icon-menu', 'vue-icon-message', 'vue-icon-minus', 'vue-icon-more', 'vue-icon-picture', 'vue-icon-plus', 'vue-icon-search', 'vue-icon-setting', 'vue-icon-share', 'vue-icon-star-off', 'vue-icon-star-on', 'vue-icon-time', 'vue-icon-warning', 'vue-icon-delete2', 'vue-icon-view', 'vue-icon-upload2', 'vue-icon-download', 'vue-icon-download2', 'vue-icon-print']
                	}
                }
            },
            id: 'icon2',
            notshowmeta: true
        }]
    };
    return iconDemo;
});!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("InputDemo", this, function() {
    'use strict';
    var inputDemo = {
        path: '/input',
        name: 'input',
        head: {
            label: 'inputDemo.label',
            description: 'inputDemo.description'
        },
        samples: [{
            id: 'input1',
            label: 'inputDemo.samples1.label',
            description: '',
            template: '<div class="source"><vue-input v-model="input" :placeholder="$t(\'inputDemo.defaultPlaceholder\')"></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        input: ''
                    }
                }
            },
            code: '<vue-input v-model="input" :placeholder="$t(\'inputDemo.defaultPlaceholder\')"></vue-input>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                input: ""\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input9',
            label: 'inputDemo.samples9.label',
            description: 'inputDemo.samples9.description',
            template: '<div class="source"><vue-input v-model="input" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" :cleave="{delimiter: \'-\', blocks: [4, 3, 3, 4], uppercase: true}"></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        input: ''
                    }
                }
            },
            code: '<vue-input v-model="input" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" :cleave="{delimiter: \'-\', blocks: [4, 3, 3, 4], uppercase: true}">\n</vue-input>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                input: ""\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input2',
            label: 'inputDemo.samples2.label',
            description: 'inputDemo.samples2.description',
            template: '<div class="source"><vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input" :disabled="true"></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        input: ''
                    }
                }
            },
            code: '<vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input" :disabled="true"></vue-input>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                input: ""\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input3',
            label: 'inputDemo.samples3.label',
            description: 'inputDemo.samples3.description',
            template: '<div class="source"><vue-input :placeholder="$t(\'inputDemo.selectPlaceholder\')" icon="vue-icon-search" v-model="input" :on-icon-click="handleIconClick"></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        input: ""
                    }
                },
                methods: {
                    handleIconClick: function(ev) {
                        this.$alert(this.$t('inputDemo.selectPlaceholder'));
                    }
                }
            },
            code: '<vue-input :placeholder="$t(\'inputDemo.selectPlaceholder\')" icon="vue-icon-search" v-model="input" :on-icon-click="handleIconClick"></vue-input>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                input: "",\n            }\n        }\n        methods: {\n            handleIconClick: function(event) {\n                this.$alert(this.$t(\'inputDemo.selectPlaceholder\'));\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input4',
            label: 'inputDemo.samples4.label',
            description: 'inputDemo.samples4.description',
            template: '<div class="source"><vue-input type="textarea" :rows="2" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="textarea"></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        textarea: ''
                    }
                }
            },
            code: '<vue-input type="textarea" :rows="2" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="textarea"></vue-input>\n\n<script>\n  new Vue({\n    data: function(){\n      return {\n        textarea: ""\n      }\n    }\n  }).$mount();\n</script>'
        }, {
            id: 'input5',
            label: 'inputDemo.samples5.label',
            description: 'inputDemo.samples5.description',
            template: '<div class="source"><vue-input type="textarea" autosize :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="textarea1"></vue-input><div style="margin: 20px 0;"></div><vue-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="textarea2"></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        textarea1: '',
                        textarea2: ''
                    }
                }
            },
            code: '<vue-input type="textarea" autosize :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="textarea1"></vue-input>\n<vue-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="textarea2"></vue-input>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                textarea1: "",\n                textarea2: ""\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input6',
            label: 'inputDemo.samples6.label',
            description: 'inputDemo.samples6.description',
            template: '<div class="source"><vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input1"><template slot="prepend">Http://</template></vue-input><div style="margin-top: 15px;"></div><vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input2"><template slot="append">.com</template></vue-input><div style="margin-top: 15px;"></div><vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input3"><vue-select v-model="select" slot="prepend" :placeholder="$t(\'inputDemo.selectPlaceholder\')" style="width:120px"><vue-option :label="$t(\'inputDemo.samples6.selectLabel1\')" value="1"></vue-option><vue-option :label="$t(\'inputDemo.samples6.selectLabel2\')" value="2"></vue-option><vue-option :label="$t(\'inputDemo.samples6.selectLabel3\')" value="3"></vue-option></vue-select><vue-button slot="append" icon="vue-icon-search"></vue-button></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        input1: '',
                        input2: '',
                        input3: '',
                        select: ''
                    }
                }
            },
            code: '<vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input1">\n    <template slot="prepend">Http://</template>\n</vue-input>\n<vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input2">\n    <template slot="append">.com</template>\n</vue-input>\n<vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input3">\n    <vue-select v-model="select" slot="prepend" :placeholder="$t(\'inputDemo.selectPlaceholder\')" style="width:120px">\n        <vue-option :label="$t(\'inputDemo.samples6.selectLabel1\')" value="1"></vue-option>\n        <vue-option :label="$t(\'inputDemo.samples6.selectLabel2\')" value="2"></vue-option>\n        <vue-option :label="$t(\'inputDemo.samples6.selectLabel3\')" value="3"></vue-option>\n    </vue-select>\n    <vue-button slot="append" icon="vue-icon-search"></vue-button>\n</vue-input>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                input1: "",\n                input2: "",\n                input3: "",\n                select: ""\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input7',
            label: 'inputDemo.samples7.label',
            description: 'inputDemo.samples7.description',
            template: '<div class="source"><vue-input size="large" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input1"></vue-input><div style="margin-top: 15px;"></div><vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input2"></vue-input><div style="margin-top: 15px;"></div><vue-input size="small" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input3"></vue-input><div style="margin-top: 15px;"></div><vue-input size="mini" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input4"></vue-input></div>',
            parameter: {
                data: function() {
                    return {
                        input1: '',
                        input2: '',
                        input3: '',
                        input4: ''
                    }
                }
            },
            code: '<vue-input size="large" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input1"></vue-input>\n<vue-input :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input2"></vue-input>\n<vue-input size="small" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input3"></vue-input>\n<vue-input size="mini" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" v-model="input4"></vue-input>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                input1: "",\n                input2: "",\n                input3: "",\n                input4: ""\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input8',
            label: 'inputDemo.samples8.label',
            description: 'inputDemo.samples8.description',
            template: '<div class="source"><vue-row class="demo-autocomplete"><vue-col :span="12"><div class="sub-title">{{$t(\'inputDemo.samples8.label1\')}}</div><vue-autocomplete v-model="state1" :fetch-suggestions="querySearch" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" @select="handleSelect"></vue-autocomplete></vue-col><vue-col :span="12"><div class="sub-title">{{$t(\'inputDemo.samples8.label2\')}}</div><vue-autocomplete v-model="state2" :fetch-suggestions="querySearch" :placeholder="$t(\'inputDemo.defaultPlaceholder\')" :trigger-on-focus="false" @select="handleSelect"></vue-autocomplete></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        restaurants: [],
                        state1: '',
                        state2: ''
                    }
                },
                methods: {
                    querySearch: function(queryString, cb) {
                        var restaurants = this.restaurants;
                        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                        cb(results);
                    },
                    createFilter: function(queryString) {
                        return function(restaurant) {
                            return ( restaurant.value.indexOf(queryString.toLowerCase()) === 0) ;
                        }
                        ;
                    },
                    handleSelect: function(item) {
                        this.$alert(item.value);
                    },
                    loadAll: function() {
                        return [{
                            "value": "first"
                        }, {
                            "value": "second"
                        }, {
                            "value": "first and second"
                        }]
                    }
                },
                mounted: function() {
                    this.restaurants = this.loadAll();
                }
            },
            code: '<vue-row class="demo-autocomplete">\n    <vue-col :span="12">\n        <div class="sub-title"{{$t(\'inputDemo.samples8.label1\')}}</div>\n        <vue-autocomplete v-model="state1"\n                        :fetch-suggestions="querySearch"\n                        :placeholder="$t(\'inputDemo.defaultPlaceholder\')"\n                        @select="handleSelect">\n        </vue-autocomplete>\n    </vue-col>\n    <vue-col :span="12">\n        <div class="sub-title">{{$t(\'inputDemo.samples8.label2\')}}</div>\n        <vue-autocomplete v-model="state2"\n                        :fetch-suggestions="querySearch"\n                        :placeholder="$t(\'inputDemo.defaultPlaceholder\')"\n                        :trigger-on-focus="false"\n                        @select="handleSelect">\n        </vue-autocomplete>\n    </vue-col>\n</vue-row>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                restaurants: [],\n                state1: "",\n                state2: ""\n            }\n        },\n        methods: {\n            querySearch: function(queryString, cb) {\n                var restaurants = this.restaurants;\n                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;\n                cb(results);\n            },\n            createFilter: function(queryString) {\n                return function(restaurant) {\n                    return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);\n                };\n            },\n            handleSelect: function(item) {\n                this.$alert(item.value);\n            },\n            loadAll: function() {\n                return [\n                    { "value": "first" },\n                    { "value": "second" },\n                    { "value": "first and second" }\n                ]\n            }\n        },\n        mounted: function() {\n            this.restaurants = this.loadAll();\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'input10',
            label: 'Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="320"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "type",
                        column2: "inputDemo.samples10.row1column2",
                        column3: "string",
                        column4: "text,textarea",
                        column5: "text"
                    },{
                        column1: "value",
                        column2: "inputDemo.samples10.row2column2",
                        column3: "string, number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "maxlength",
                        column2: "inputDemo.samples10.row3column2",
                        column3: "number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "minlength",
                        column2: "inputDemo.samples10.row4column2",
                        column3: "number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "placeholder",
                        column2: "inputDemo.samples10.row5column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "disabled",
                        column2: "inputDemo.samples10.row6column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "size",
                        column2: "inputDemo.samples10.row7column2",
                        column3: "string",
                        column4: "large, small, mini",
                        column5: "—"
                    },{
                        column1: "icon",
                        column2: "inputDemo.samples10.row8column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "rows",
                        column2: "inputDemo.samples10.row9column2",
                        column3: "number",
                        column4: "—",
                        column5: "2"
                    },{
                        column1: "cleave",
                        column2: "inputDemo.samples10.row10column2",
                        column3: "object",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "autosize",
                        column2: "inputDemo.samples10.row11column2",
                        column3: "boolean/object",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "auto-complete",
                        column2: "inputDemo.samples10.row12column2",
                        column3: "string",
                        column4: "on, off",
                        column5: "off"
                    },{
                        column1: "name",
                        column2: "inputDemo.samples10.row13column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "readonly",
                        column2: "inputDemo.samples10.row14column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "max",
                        column2: "inputDemo.samples10.row15column2",
                        column3: "—",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "min",
                        column2: "inputDemo.samples10.row16column2",
                        column3: "—",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "step",
                        column2: "inputDemo.samples10.row17column2",
                        column3: "—",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "resize",
                        column2: "inputDemo.samples10.row18column2",
                        column3: "string",
                        column4: "none, both, horizontal, vertical",
                        column5: "—"
                    },{
                        column1: "autofocus",
                        column2: "inputDemo.samples10.row19column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "form",
                        column2: "inputDemo.samples10.row20column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "on-icon-click",
                        column2: "inputDemo.samples10.row21column2",
                        column3: "function",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'input11',
            label: 'Input Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "click",
                        column2: "inputDemo.samples11.row1column2",
                        column3: "(event: Event)"
                    },{
                        column1: "blur",
                        column2: "inputDemo.samples11.row2column2",
                        column3: "(event: Event)"
                    },{
                        column1: "focus",
                        column2: "inputDemo.samples11.row3column2",
                        column3: "(event: Event)"
                    },{
                        column1: "change",
                        column2: "inputDemo.samples11.row4column2",
                        column3: "(value: string | number)"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'input12',
            label: 'Autocomplete Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="250"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "placeholder",
                        column2: "inputDemo.samples12.row1column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "disabled",
                        column2: "inputDemo.samples12.row2column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "value",
                        column2: "inputDemo.samples12.row3column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "custom-item",
                        column2: "inputDemo.samples12.row4column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "fetch-suggestions",
                        column2: "inputDemo.samples12.row5column2",
                        column3: "Function(queryString, callback)",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "popper-class",
                        column2: "inputDemo.samples12.row6column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "trigger-on-focus",
                        column2: "inputDemo.samples12.row7column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "true"
                    },{
                        column1: "on-icon-click",
                        column2: "inputDemo.samples12.row8column2",
                        column3: "function",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "icon",
                        column2: "inputDemo.samples12.row9column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "props",
                        column2: "inputDemo.samples12.row10column2",
                        column3: "object",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'input13',
            label: 'Autocomplete props',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "value",
                        column2: "inputDemo.samples13.row1column2",
                        column3: "string",
                        column4: "—",
                        column5: "value"
                    },{
                        column1: "label",
                        column2: "inputDemo.samples13.row2column2",
                        column3: "string",
                        column4: "—",
                        column5: "value"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'input14',
            label: 'Autocomplete Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "select",
                        column2: "inputDemo.samples14.row1column2",
                        column3: "(selectItem: SelectItem)"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return inputDemo;
});!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("LayoutDemo", this, function() {
    'use strict';
    var layoutDemo = {
        path: '/layout',
        name: 'layout',
        head: {
            label: 'layoutDemo.label',
            description: 'layoutDemo.description'
        },
        samples: [{
            id: 'layout1',
            label: 'layoutDemo.samples1.label',
            description: 'layoutDemo.samples1.description',
            template: '<div class="source"><vue-row class="margin-bottom20"><vue-col :span="24"><div class="grid-content bg-purple-dark"></div></vue-col></vue-row><vue-row class="margin-bottom20"><vue-col :span="12"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="12"><div class="grid-content bg-purple-light"></div></vue-col></vue-row><vue-row class="margin-bottom20"><vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="8"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col></vue-row><vue-row class="margin-bottom20"><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col></vue-row><vue-row class="margin-bottom20"><vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple-light"></div></vue-col></vue-row></div>',
            code: '<vue-row>\n    <vue-col :span="24"><div class="grid-content bg-purple-dark"></div></vue-col>\n</vue-row>\n<vue-row>\n    <vue-col :span="12"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="12"><div class="grid-content bg-purple-light"></div></vue-col>\n    </vue-row>\n<vue-row>\n    <vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="8"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>\n<vue-row>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col>\n</vue-row>\n<vue-row>\n    <vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple-light"></div></vue-col>\n</vue-row>'
        }, {
            id: 'layout2',
            label: 'layoutDemo.samples2.label',
            description: 'layoutDemo.samples2.description',
            template: '<div class="source"><vue-row :gutter="20"><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col></vue-row></div>',
            code: '<vue-row :gutter="20">\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>'
        }, {
            id: 'layout3',
            label: 'layoutDemo.samples3.label',
            description: 'layoutDemo.samples3.description',
            template: '<div class="source"><vue-row class="margin-bottom20" :gutter="20"><vue-col :span="16"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col></vue-row><vue-row class="margin-bottom20" :gutter="20"><vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col></vue-row><vue-row class="margin-bottom20" :gutter="20"><vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="16"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col></vue-row></div>',
            code: '<vue-row :gutter="20">\n    <vue-col :span="16"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>\n<vue-row :gutter="20">\n    <vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="8"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>\n<vue-row :gutter="20">\n    <vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="16"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="4"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>'
        }, {
            id: 'layout4',
            label: 'layoutDemo.samples4.label',
            description: 'layoutDemo.samples4.description',
            template: '<div class="source"><vue-row class="margin-bottom20 row-bg" type="flex"><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col></vue-row><vue-row class="margin-bottom20 row-bg" type="flex" justify="center"><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col></vue-row><vue-row class="margin-bottom20 row-bg" type="flex" justify="end"><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col></vue-row><vue-row class="margin-bottom20 row-bg" type="flex" justify="space-between"><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col></vue-row><vue-row class="margin-bottom20 row-bg" type="flex" justify="space-around"><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col></vue-row></div>',
            code: '<vue-row class="row-bg" type="flex">\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>\n<vue-row class="row-bg" type="flex" justify="center">\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>\n<vue-row class="row-bg" type="flex" justify="end">\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>\n<vue-row class="row-bg" type="flex" justify="space-between">\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>\n<vue-row class="row-bg" type="flex" justify="space-around">\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :span="6"><div class="grid-content bg-purple"></div></vue-col>\n</vue-row>'
        }, {
            id: 'layout5',
            label: 'layoutDemo.samples5.label',
            description: 'layoutDemo.samples5.description',
            template: '<div class="source"><vue-row :gutter="10"><vue-col :xs="8" :sm="6" :md="4" :lg="3"><div class="grid-content bg-purple"></div></vue-col><vue-col :xs="4" :sm="6" :md="8" :lg="9"><div class="grid-content bg-purple-light"></div></vue-col><vue-col :xs="4" :sm="6" :md="8" :lg="9"><div class="grid-content bg-purple"></div></vue-col><vue-col :xs="8" :sm="6" :md="4" :lg="3"><div class="grid-content bg-purple-light"></div></vue-col></vue-row></div>',
            code: '<vue-row :gutter="10">\n    <vue-col :xs="8" :sm="6" :md="4" :lg="3"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :xs="4" :sm="6" :md="8" :lg="9"><div class="grid-content bg-purple-light"></div></vue-col>\n    <vue-col :xs="4" :sm="6" :md="8" :lg="9"><div class="grid-content bg-purple"></div></vue-col>\n    <vue-col :xs="8" :sm="6" :md="4" :lg="3"><div class="grid-content bg-purple-light"></div></vue-col>\n</vue-row>'
        }, {
            id: 'layout6',
            label: 'Row Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "gutter",
                        column2: "layoutDemo.samples6.row1column2",
                        column3: "number",
                        column4: "—",
                        column5: "0"
                    },{
                        column1: "type",
                        column2: "layoutDemo.samples6.row2column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "justify",
                        column2: "layoutDemo.samples6.row3column2",
                        column3: "string",
                        column4: "start/end/center/space-around/space-between",
                        column5: "start"
                    },{
                        column1: "align",
                        column2: "layoutDemo.samples6.row4column2",
                        column3: "string",
                        column4: "top/middle/bottom",
                        column5: "top"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'layout7',
            label: 'Col Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "span",
                        column2: "layoutDemo.samples7.row1column2",
                        column3: "number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "offset",
                        column2: "layoutDemo.samples7.row2column2",
                        column3: "number",
                        column4: "—",
                        column5: "0"
                    },{
                        column1: "push",
                        column2: "layoutDemo.samples7.row3column2",
                        column3: "number",
                        column4: "—",
                        column5: "0"
                    },{
                        column1: "pull",
                        column2: "layoutDemo.samples7.row4column2",
                        column3: "number",
                        column4: "—",
                        column5: "0"
                    },{
                        column1: "xs",
                        column2: "layoutDemo.samples7.row5column2",
                        column3: "layoutDemo.samples7.row5column3",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "sm",
                        column2: "layoutDemo.samples7.row6column2",
                        column3: "layoutDemo.samples7.row6column3",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "md",
                        column2: "layoutDemo.samples7.row7column2",
                        column3: "layoutDemo.samples7.row7column3",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "lg",
                        column2: "layoutDemo.samples7.row8column2",
                        column3: "layoutDemo.samples7.row8column3",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return layoutDemo;
});!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("LoadingDemo", this, function() {
    'use strict';
    var loadingDemo = {
        path: '/loading',
        name: 'loading',
        head: {
            label: 'Loading 加载',
            description: '加载数据时显示动效。'
        },
        samples: [{
            id: 'loading1',
            label: '基础用法',
            description: '使用自定义指令v-loading，在绑定了v-loading指令的元素上添加vue-loading-text属性，其值会被渲染为加载文案，并显示在加载图标的下方．当需要全屏遮罩时，可使用fullscreen修饰符。此时若需要锁定屏幕的滚动，可以使用lock修饰符。',
            template: '<div class="source"><vue-table v-loading="loading" vue-loading-text="拼命加载中" :data="tableData" border stripe style="width: 100%"><vue-table-column prop="date" label="日期" width="180"></vue-table-column><vue-table-column prop="name" label="姓名" width="180"></vue-table-column><vue-table-column prop="address" label="地址"></vue-table-column></vue-table><div style="margin-top:30px"></div><vue-button type="primary" @click="openFullScreen" v-loading.fullscreen.lock="fullscreenLoading">显示整页加载，3 秒后消失</vue-button></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: [{
                            date: "2015-01-02",
                            name: "张三",
                            address: "厦门市思明区"
                          }, {
                            date: "2016-04-05",
                            name: "李四",
                            address: "厦门市翔安区"
                          }, {
                            date: "2017-06-07",
                            name: "王二",
                            address: "厦门市湖里区"
                          }, {
                            date: "2018-10-22",
                            name: "龙五",
                            address: "厦门市海沧区"
                        }],
                        loading: true,
                        fullscreenLoading: false
                    };
                },
                methods: {
                    openFullScreen: function() {
                      var self = this;
                      self.fullscreenLoading = true;
                      setTimeout(function() {
                        self.fullscreenLoading = false;
                      }, 3000);
                    }
                  }
            },
            code: '<vue-table v-loading="loading" vue-loading-text="拼命加载中" :data="tableData" border stripe style="width: 100%">\n'+
            '    <vue-table-column prop="date" label="日期" width="180"></vue-table-column>\n'+
            '    <vue-table-column prop="name" label="姓名" width="180"></vue-table-column>\n'+
            '    <vue-table-column prop="address" label="地址"></vue-table-column>\n'+
            '</vue-table>\n'+
            '<vue-button type="primary" @click="openFullScreen" v-loading.fullscreen.lock="fullscreenLoading">\n    显示整页加载，3 秒后消失\n</vue-button>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: [{\n'+
            '                    date: "2015-01-02",\n'+
            '                    name: "张三",\n'+
            '                    address: "厦门市思明区"\n'+
            '                }, {\n'+
            '                    date: "2016-04-05",\n'+
            '                    name: "李四",\n'+
            '                    address: "厦门市翔安区"\n'+
            '                }, {\n'+
            '                    date: "2017-06-07",\n'+
            '                    name: "王二",\n'+
            '                    address: "厦门市湖里区"\n'+
            '                }, {\n'+
            '                    date: "2018-10-22",\n'+
            '                    name: "龙五",\n'+
            '                    address: "厦门市海沧区"\n'+
            '                }],\n'+
            '                loading: true,\n'+
            '                fullscreenLoading: false\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            openFullScreen: function() {\n'+
            '                var self = this;\n'+
            '                self.fullscreenLoading = true;\n'+
            '                setTimeout(function() {\n'+
            '                    self.fullscreenLoading = false;\n'+
            '                }, 3000);\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return loadingDemo;
});


!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("NavMenuDemo", this, function() {
    'use strict';
    var navMenuDemo = {
        path: '/navMenu',
        name: 'navMenu',
        head: {
            label: 'NavMenu 导航菜单',
            description: '为网站提供导航功能的菜单。'
        },
        samples: [{
            id: 'navMenu1',
            label: '顶栏',
            description: '导航菜单默认为垂直模式，通过 mode 属性可以使导航菜单变更为水平模式。另外，在菜单中通过 submenu 组件可以生成二级菜单。通过 theme 属性可以设置主题',
            template: '<div class="source"><vue-menu theme="dark" :default-active="activeIndex1" mode="horizontal" @select="handleSelect"><vue-menu-item index="1">处理中心</vue-menu-item><vue-submenu index="2"><template slot="title">我的工作台</template><vue-menu-item index="2-1">选项1</vue-menu-item><vue-menu-item index="2-2">选项2</vue-menu-item><vue-menu-item index="2-3">选项3</vue-menu-item></vue-submenu><vue-menu-item index="3">订单管理</vue-menu-item></vue-menu><div style="margin:30px"></div><vue-menu :default-active="activeIndex2" mode="horizontal" @select="handleSelect"><vue-menu-item index="1">处理中心</vue-menu-item><vue-submenu index="2"><template slot="title">我的工作台</template><vue-menu-item index="2-1">选项1</vue-menu-item><vue-menu-item index="2-2">选项2</vue-menu-item><vue-menu-item index="2-3">选项3</vue-menu-item></vue-submenu><vue-menu-item index="3">订单管理</vue-menu-item></vue-menu></div>',
            parameter: {
                data: function() {
                    return {
                      activeIndex1: '1',
                      activeIndex2: '3'
                    }
                },
                methods: {
                  handleSelect: function(key, keyPath) {
                    console.log(key, keyPath);
                  }
                }
            },
            code: '<vue-menu theme="dark" :default-active="activeIndex1" mode="horizontal" @select="handleSelect">\n'+
            '    <vue-menu-item index="1">处理中心</vue-menu-item>\n'+
            '    <vue-submenu index="2">\n'+
            '        <template slot="title">我的工作台</template>\n'+
            '        <vue-menu-item index="2-1">选项1</vue-menu-item>\n'+
            '        <vue-menu-item index="2-2">选项2</vue-menu-item>\n'+
            '        <vue-menu-item index="2-3">选项3</vue-menu-item>\n'+
            '    </vue-submenu>\n'+
            '    <vue-menu-item index="3">订单管理</vue-menu-item>\n'+
            '</vue-menu>\n'+
            '<vue-menu :default-active="activeIndex2" mode="horizontal" @select="handleSelect">\n'+
            '    <vue-menu-item index="1">处理中心</vue-menu-item>\n'+
            '    <vue-submenu index="2">\n'+
            '        <template slot="title">我的工作台</template>\n'+
            '        <vue-menu-item index="2-1">选项1</vue-menu-item>\n'+
            '        <vue-menu-item index="2-2">选项2</vue-menu-item>\n'+
            '        <vue-menu-item index="2-3">选项3</vue-menu-item>\n'+
            '    </vue-submenu>\n'+
            '    <vue-menu-item index="3">订单管理</vue-menu-item>\n'+
            '</vue-menu>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return {\n'+
            '                activeIndex1: "1",\n'+
            '                activeIndex2: "3"\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            handleSelect: function(key, keyPath) {\n'+
            '                console.log(key, keyPath);\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'navMenu2',
            label: '侧栏',
            description: '通过vue-menu-item-group 组件可以实现菜单进行分组，分组名可以通过 title 属性直接设定也可以通过具名 slot 来设定。',
            template: '<div class="source"><vue-row class="tac"><vue-col :span="8"><h4>带 icon</h4><vue-menu default-active="2" class="vue-menu-vertical-demo" @open="handleOpen" @close="handleClose"><vue-submenu index="1"><template slot="title"><i class="vue-icon-message"></i>导航一</template><vue-menu-item-group><template slot="title">分组一</template><vue-menu-item index="1-1">选项1</vue-menu-item><vue-menu-item index="1-2">选项2</vue-menu-item></vue-menu-item-group><vue-menu-item-group title="分组2"><vue-menu-item index="1-3">选项3</vue-menu-item></vue-menu-item-group><vue-submenu index="1-4"><template slot="title">选项4</template><vue-menu-item index="1-4-1">选项1</vue-menu-item></vue-submenu></vue-submenu><vue-menu-item index="2"><i class="vue-icon-menu"></i>导航二</vue-menu-item><vue-menu-item index="3"><i class="vue-icon-setting"></i>导航三</vue-menu-item></vue-menu></vue-col><vue-col :span="8"><h4>不带 icon</h4><vue-menu default-active="2" class="vue-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark"><vue-submenu index="1"><template slot="title">导航一</template><vue-menu-item-group title="分组一"><vue-menu-item index="1-1">选项1</vue-menu-item><vue-menu-item index="1-2">选项2</vue-menu-item></vue-menu-item-group><vue-menu-item-group title="分组2"><vue-menu-item index="1-3">选项3</vue-menu-item></vue-menu-item-group><vue-submenu index="1-4"><template slot="title">选项4</template><vue-menu-item index="1-4-1">选项1</vue-menu-item></vue-submenu></vue-submenu><vue-menu-item index="2">导航二</vue-menu-item><vue-menu-item index="3">导航三</vue-menu-item></vue-menu></vue-col><vue-col :span="8"><h4>分组</h4><vue-menu mode="vertical" default-active="1" class="vue-menu-vertical-demo"><vue-menu-item-group title="分组一"><vue-menu-item index="1"><i class="vue-icon-message"></i>导航一</vue-menu-item><vue-menu-item index="2"><i class="vue-icon-message"></i>导航二</vue-menu-item></vue-menu-item-group><vue-menu-item-group title="分组二"><vue-menu-item index="3"><i class="vue-icon-message"></i>导航三</vue-menu-item><vue-menu-item index="4"><i class="vue-icon-message"></i>导航四</vue-menu-item></vue-menu-item-group></vue-menu></vue-col></vue-row></div>',
            parameter: {
                methods: {
                  handleOpen: function(key, keyPath) {
                      console.log(key, keyPath);
                  },
                  handleClose: function(key, keyPath) {
                    console.log(key, keyPath);
                  }
                }
            },
            code: '<vue-row class="tac">\n'+
            '    <vue-col :span="8">\n'+
            '        <h4>带 icon</h4>\n'+
            '        <vue-menu default-active="2" class="vue-menu-vertical-demo" @open="handleOpen" @close="handleClose">\n'+
            '            <vue-submenu index="1">\n'+
            '                <template slot="title"><i class="vue-icon-message"></i>导航一</template>\n'+
            '                <vue-menu-item-group>\n'+
            '                    <template slot="title">分组一</template>\n'+
            '                    <vue-menu-item index="1-1">选项1</vue-menu-item>\n'+
            '                    <vue-menu-item index="1-2">选项2</vue-menu-item>\n'+
            '                </vue-menu-item-group>\n'+
            '                <vue-menu-item-group title="分组2">\n'+
            '                    <vue-menu-item index="1-3">选项3</vue-menu-item>\n'+
            '                </vue-menu-item-group>\n'+
            '                <vue-submenu index="1-4">\n'+
            '                    <template slot="title">选项4</template>\n'+
            '                    <vue-menu-item index="1-4-1">选项1</vue-menu-item>\n'+
            '                </vue-submenu>\n'+
            '            </vue-submenu>\n'+
            '            <vue-menu-item index="2"><i class="vue-icon-menu"></i>导航二</vue-menu-item>\n'+
            '            <vue-menu-item index="3"><i class="vue-icon-setting"></i>导航三</vue-menu-item>\n'+
            '        </vue-menu>\n'+
            '    </vue-col>\n'+
            '    <vue-col :span="8">\n'+
            '        <h4>不带 icon</h4>\n'+
            '        <vue-menu default-active="2" class="vue-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark">\n'+
            '            <vue-submenu index="1">\n'+
            '                <template slot="title">导航一</template>\n'+
            '                <vue-menu-item-group title="分组一">\n'+
            '                    <vue-menu-item index="1-1">选项1</vue-menu-item>\n'+
            '                    <vue-menu-item index="1-2">选项2</vue-menu-item>\n'+
            '                </vue-menu-item-group>\n'+
            '                <vue-menu-item-group title="分组2">\n'+
            '                    <vue-menu-item index="1-3">选项3</vue-menu-item>\n'+
            '                </vue-menu-item-group>\n'+
            '                <vue-submenu index="1-4">\n'+
            '                    <template slot="title">选项4</template>\n'+
            '                    <vue-menu-item index="1-4-1">选项1</vue-menu-item>\n'+
            '                </vue-submenu>\n'+
            '            </vue-submenu>\n'+
            '            <vue-menu-item index="2">导航二</vue-menu-item>\n'+
            '            <vue-menu-item index="3">导航三</vue-menu-item>\n'+
            '        </vue-menu>\n'+
            '    </vue-col>\n'+
            '    <vue-col :span="8">\n'+
            '        <h4>分组</h4>\n'+
            '        <vue-menu mode="vertical" default-active="1" class="vue-menu-vertical-demo">\n'+
            '            <vue-menu-item-group title="分组一">\n'+
            '                <vue-menu-item index="1"><i class="vue-icon-message"></i>导航一</vue-menu-item>\n'+
            '                <vue-menu-item index="2"><i class="vue-icon-message"></i>导航二</vue-menu-item>\n'+
            '            </vue-menu-item-group>\n'+
            '            <vue-menu-item-group title="分组二">\n'+
            '                <vue-menu-item index="3"><i class="vue-icon-message"></i>导航三</vue-menu-item>\n'+
            '                <vue-menu-item index="4"><i class="vue-icon-message"></i>导航四</vue-menu-item>\n'+
            '            </vue-menu-item-group>\n'+
            '        </vue-menu>\n'+
            '    </vue-col>\n'+
            '</vue-row>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            handleOpen: function(key, keyPath) {\n'+
            '                console.log(key, keyPath);\n'+
            '            },\n'+
            '            handleClose: function(key, keyPath) {\n'+
            '                console.log(key, keyPath);\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return navMenuDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("PopoverDemo", this, function(DemoUtil) {
    'use strict';
    var popoverDemo = {
        path: '/popover',
        name: 'popover',
        head: {
            label: 'Popover 弹出框',
            description: '用于展示小段信息。'
        },
        samples: [{
            id: 'popover1',
            label: '基础用法',
            description: '用法通过 slot 指定 reference。',
            template: '<div class="source"><vue-row><vue-col :span="4"><vue-popover ref="popover1" placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容。"></vue-popover><vue-popover ref="popover2" placement="bottom" title="标题" width="200" trigger="click" content="这是一段内容。"></vue-popover><vue-button v-popover:popover1>hover 激活</vue-button></vue-col><vue-col :span="4"><vue-button v-popover:popover2>click 激活</vue-button></vue-col><vue-col :span="4"><vue-popover placement="right" title="标题" width="200" trigger="focus" content="这是一段内容。"><vue-input slot="reference" placeholder="focus 激活"></vue-input></vue-popover></vue-col></vue-row></div>',
            code: '<vue-popover ref="popover1" placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容。"></vue-popover>\n'+
            '<vue-popover ref="popover2" placement="bottom" title="标题" width="200" trigger="click" content="这是一段内容。"></vue-popover>\n'+
            '<vue-button v-popover:popover1>hover 激活</vue-button>\n'+
            '<vue-button v-popover:popover2>click 激活</vue-button>\n'+
            '<vue-popover placement="right" title="标题" width="200" trigger="focus" content="这是一段内容。">\n'+
            '    <vue-input slot="reference" placeholder="focus 激活"></vue-input>\n'+
            '</vue-popover>'
        }]
    };
    return popoverDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("RadioDemo", this, function() {
    'use strict';
    var radioDemo = {
        path: '/radio',
        name: 'radio',
        head: {
            label: 'radioDemo.label',
            description: 'radioDemo.description'
        },
        samples: [{
            id: 'radio1',
            label: 'radioDemo.samples1.label',
            description: 'radioDemo.samples1.description',
            template: '<div class="source"><vue-radio class="radio" v-model="radio" label="1">Option 1</vue-radio><vue-radio class="radio" v-model="radio" label="2">Option 2</vue-radio></div>',
            parameter: {
                data: function() {
                    return {
                        radio: "1"
                    }
                }
            },
            code: '<vue-radio class="radio" v-model="radio" label="1">Option 1</vue-radio>\n<vue-radio class="radio" v-model="radio" label="2">Option 2</vue-radio>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                radio: "1"\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'radio2',
            label: 'radioDemo.samples2.label',
            description: 'radioDemo.samples2.description',
            template: '<div class="source"><vue-radio disabled v-model="radio" label="Disabled">Disabled</vue-radio><vue-radio disabled v-model="radio" label="Selected and Disabled">Selected and Disabled</vue-radio></div>',
            parameter: {
                data: function() {
                    return {
                        radio: "Selected and Disabled"
                    }
                }
            },
            code: '<vue-radio disabled v-model="radio" label="Disabled">Disabled</vue-radio>\n<vue-radio disabled v-model="radio" label="Selected and Disabled">Selected and Disabled</vue-radio>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                radio: "Selected and Disabled"\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'radio3',
            label: 'radioDemo.samples3.label',
            description: 'radioDemo.samples3.description',
            template: '<div class="source"><vue-radio-group v-model="radio"><vue-radio :label="3">Option A</vue-radio><vue-radio :label="6">Option B</vue-radio><vue-radio :label="9">Option C</vue-radio></vue-radio-group></div>',
            parameter: {
                data: function() {
                    return {
                        radio: 3
                    }
                }
            },
            code: '<vue-radio-group v-model="radio">\n    <vue-radio :label="3">Option A</vue-radio>\n    <vue-radio :label="6">Option B</vue-radio>\n    <vue-radio :label="9">Option C</vue-radio>\n</vue-radio-group>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                radio: "3"\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'radio4',
            label: 'radioDemo.samples4.label',
            description: 'radioDemo.samples4.description',
            template: '<div class="source"><vue-radio-group v-model="radio1" size="large" fill="#324057" text-color="#a4aebd"><vue-radio-button label="New York"></vue-radio-button><vue-radio-button label="Washington"></vue-radio-button><vue-radio-button label="Los Angeles"></vue-radio-button><vue-radio-button label="Chicago"></vue-radio-button></vue-radio-group><div style="margin: 15px 0;"></div><vue-radio-group v-model="radio2"><vue-radio-button label="New York"></vue-radio-button><vue-radio-button label="Washington" :disabled="true"></vue-radio-button><vue-radio-button label="Los Angeles"></vue-radio-button><vue-radio-button label="Chicago"></vue-radio-button></vue-radio-group><div style="margin: 15px 0;"></div><vue-radio-group v-model="radio3" :disabled="true"><vue-radio-button label="New York"></vue-radio-button><vue-radio-button label="Washington"></vue-radio-button><vue-radio-button label="Los Angeles"></vue-radio-button><vue-radio-button label="Chicago"></vue-radio-button></vue-radio-group></div>',
            parameter: {
                data: function() {
                    return {
                        radio1: 'New York',
                        radio2: 'New York',
                        radio3: 'New York'
                    }
                }
            },
            code: '<vue-radio-group v-model="radio1" size="large" fill="#324057" text-color="#a4aebd">\n    <vue-radio-button label="New York"></vue-radio-button>\n    <vue-radio-button label="Washington"></vue-radio-button>\n    <vue-radio-button label="Los Angeles"></vue-radio-button>\n    <vue-radio-button label="Chicago"></vue-radio-button>\n</vue-radio-group>\n<vue-radio-group v-model="radio2">\n    <vue-radio-button label="New York"></vue-radio-button>\n    <vue-radio-button label="Washington" :disabled="true"></vue-radio-button>\n    <vue-radio-button label="Los Angeles"></vue-radio-button>\n    <vue-radio-button label="Chicago"></vue-radio-button>\n</vue-radio-group>\n<vue-radio-group v-model="radio3" :disabled="true">\n    <vue-radio-button label="New York"></vue-radio-button>\n    <vue-radio-button label="Washington"></vue-radio-button>\n    <vue-radio-button label="Los Angeles"></vue-radio-button>\n    <vue-radio-button label="Chicago"></vue-radio-button>\n</vue-radio-group>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                radio1: "New York",\n                radio2: "New York",\n                radio3: "New York",\n            }\n        }\n    }).$mount();\n</script>',
        }, {
            id: 'radio5',
            label: 'Radio Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "label",
                        column2: "radioDemo.samples5.row1column2",
                        column3: "string,number,boolean",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "disabled",
                        column2: "radioDemo.samples5.row2column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "name",
                        column2: "radioDemo.samples5.row3column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'radio6',
            label: 'Radio-group Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "size",
                        column2: "radioDemo.samples6.row1column2",
                        column3: "string",
                        column4: "large, small, mini",
                        column5: "—"
                    },{
                        column1: "fill",
                        column2: "radioDemo.samples6.row2column2",
                        column3: "string",
                        column4: "—",
                        column5: "#20a0ff"
                    },{
                        column1: "text-color",
                        column2: "radioDemo.samples6.row3column2",
                        column3: "string",
                        column4: "—",
                        column5: "#ffffff"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'radio7',
            label: 'Radio-group Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "change",
                        column2: "radioDemo.samples7.row1column2",
                        column3: "radioDemo.samples7.row1column3"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'radio8',
            label: 'Radio-button Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "label",
                        column2: "radioDemo.samples8.row1column2",
                        column3: "string, number",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "disabled",
                        column2: "radioDemo.samples8.row2column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return radioDemo;
});!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("SelectDemo", this, function() {
    'use strict';
    var selectDemo = {
        path: '/select',
        name: 'select',
        head: {
            label: 'Select 选择器',
            description: '当选项过多时，使用下拉菜单展示并选择内容。'
        },
        samples: [{
            id: 'select1',
            label: '基础用法',
            description: 'v-model的值为当前被选中的vue-option的value属性值',
            template: '<div class="source"><vue-select v-model="value" placeholder="请选择" ><vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value"></vue-option></vue-select></div>',
            parameter: {
                data: function() {
                    return {
                        options: [{
                            value: '选项1',
                            label: 'YAMAHA'
                        }, {
                            value: '选项2',
                            label: 'HONDA'
                        }, {
                            value: '选项3',
                            label: 'TOYOTA'
                        }],
                        value: ''
                    }
                }
            },
            code: '<vue-select v-model="value" placeholder="请选择">\n    <vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value">\n    </vue-option>\n</vue-select>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                options: [{\n                    value: \'选项1\',\n                    label: \'YAMAHA\'\n                },{\n                    value: \'选项2\',\n                    label: \'HONDA\'\n                },{\n                    value: \'选项3\',\n                    label: \'TOYOTA\'\n                }],\n                value: \'\'\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'select2',
            label: '有禁用选项',
            description: '在vue-option中，设定disabled值为 true，即可禁用该选项',
            template: '<div class="source"><vue-select v-model="value" placeholder="请选择"><vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value" :disabled="item.disabled"></vue-option></vue-select></div>',
            parameter: {
                data: function() {
                    return {
                        options: [{
                            value: '选项1',
                            label: 'YAMAHA'
                        }, {
                            value: '选项2',
                            label: 'HONDA',
                            disabled: true
                        }, {
                            value: '选项3',
                            label: 'TOYOTA'
                        }],
                        value: ''
                    }
                }
            },
            code: '<vue-select v-model="value" placeholder="请选择">\n    <vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value" :disabled="item.disabled">\n    </vue-option>\n</vue-select>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                options: [{\n                    value: \'选项1\',\n                    label: \'YAMAHA\'\n                },{\n                    value: \'选项2\',\n                    label: \'HONDA\'\n                    disabled: true\n                },{\n                    value: \'选项3\',\n                    label: \'TOYOTA\'\n                }],\n                value: \'\'\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'select3',
            label: '禁用状态',
            description: '设置disabled属性即可，它接受一个Boolean，true为禁用。',
            template: '<div class="source"><vue-select v-model="value" disabled placeholder="请选择"><vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value"></vue-option></vue-select></div>',
            parameter: {
                data: function() {
                    return {
                        options: [{
                            value: '选项1',
                            label: 'YAMAHA'
                        }, {
                            value: '选项2',
                            label: 'HONDA'
                        }, {
                            value: '选项3',
                            label: 'TOYOTA'
                        }],
                        value: ''
                    }
                }
            },
            code: '<vue-select v-model="value" disabled placeholder="请选择">\n    <vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value">\n    </vue-option>\n</vue-select>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                options: [{\n                    value: \'选项1\',\n                    label: \'YAMAHA\'\n                },{\n                    value: \'选项2\',\n                    label: \'HONDA\'\n                },{\n                    value: \'选项3\',\n                    label: \'TOYOTA\'\n                }],\n                value: \'\'\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'select4',
            label: '可清空单选',
            description: '设置clearable属性，则可将选择器清空。需要注意的是，clearable属性仅适用于单选',
            template: '<div class="source"><vue-select v-model="value" clearable placeholder="请选择"><vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value"></vue-option></vue-select></div>',
            parameter: {
                data: function() {
                    return {
                        options: [{
                            value: '选项1',
                            label: 'YAMAHA'
                        }, {
                            value: '选项2',
                            label: 'HONDA'
                        }, {
                            value: '选项3',
                            label: 'TOYOTA'
                        }],
                        value: ''
                    }
                }
            },
            code: '<vue-select v-model="value" clearable placeholder="请选择">\n    <vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value">\n    </vue-option>\n</vue-select>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                options: [{\n                    value: \'选项1\',\n                    label: \'YAMAHA\'\n                },{\n                    value: \'选项2\',\n                    label: \'HONDA\'\n                },{\n                    value: \'选项3\',\n                    label: \'TOYOTA\'\n                }],\n                value: \'\'\n            }\n        }\n    }).$mount();\n</script>'
        }, {
            id: 'select5',
            label: '基础多选',
            description: '设置multiple属性即可启用多选，此时v-model的值为当前选中值所组成的数组',
            template: '<div class="source"><vue-select v-model="value" multiple placeholder="请选择"><vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value"></vue-option></vue-select></div>',
            parameter: {
                data: function() {
                    return {
                        options: [{
                            value: '选项1',
                            label: 'YAMAHA'
                        }, {
                            value: '选项2',
                            label: 'HONDA'
                        }, {
                            value: '选项3',
                            label: 'TOYOTA'
                        }],
                        value: ''
                    }
                }
            },
            code: '<vue-select v-model="value" multiple placeholder="请选择">\n    <vue-option v-for="item in options" :key="item" :label="item.label" :value="item.value">\n    </vue-option>\n</vue-select>\n\n<script>\n    new Vue({\n        data: function(){\n            return {\n                options: [{\n                    value: \'选项1\',\n                    label: \'YAMAHA\'\n                },{\n                    value: \'选项2\',\n                    label: \'HONDA\'\n                },{\n                    value: \'选项3\',\n                    label: \'TOYOTA\'\n                }],\n                value: \'\'\n            }\n        }\n    }).$mount();\n</script>'
        }]
    };
    return selectDemo;
});!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("StepsDemo", this, function() {
    'use strict';
    var stepsDemo = {
        path: '/steps',
        name: 'steps',
        head: {
            label: 'Steps 步骤条',
            description: '引导用户按照流程完成任务的分步导航条，可根据实际应用场景设定步骤，步骤不得少于 2 步。'
        },
        samples: [{
            id: 'steps1',
            label: '基础用法',
            description: '设置active属性，接受一个Number，表明步骤的 index，从 0 开始。需要定宽的步骤条时，设置space属性即可，单位为px，如果不设置，则为自适应。设置finish-status属性可以改变已经完成的步骤的状态。',
            template: '<div class="source"><vue-steps :space="200" :active="active" finish-status="success"><vue-step title="步骤 1"></vue-step><vue-step title="步骤 2"></vue-step><vue-step title="步骤 3"></vue-step></vue-steps><vue-button style="margin-top: 12px;" @click="next">下一步</vue-button></div>',
            parameter: {
                data: function() {
                    return {
                        active: 0
                    }
                },
                methods: {
                  next: function(tab, event) {
                    if (this.active++ > 2) this.active = 0;
                  }
                }
            },
            code: '<vue-steps :space="200" :active="active" finish-status="success">\n'+
            '    <vue-step title="步骤 1"></vue-step>\n'+
            '    <vue-step title="步骤 2"></vue-step>\n'+
            '    <vue-step title="步骤 3"></vue-step>\n'+
            '</vue-steps>\n'+
            '<vue-button style="margin-top: 12px;" @click="next">下一步</vue-button>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return {\n'+
            '                active: 0\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            next: function() {\n'+
            '                if (this.active++ > 2) this.active = 0;\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'steps2',
            label: '有描述的步骤条',
            description: '每个步骤有其对应的步骤状态描述。用slot的方式来设置',
            template: '<div class="source"><vue-steps :space="250" :active="1"><vue-step title="步骤 1"><span slot="description">这是一段很长很长很长的描述性文字</span></vue-step><vue-step title="步骤 2"><vue-button slot="description">这是按钮</vue-button></vue-step><vue-step title="步骤 3" description="这是一段很长很长很长的描述性文字"><vue-button slot="description" type="primary" icon="vue-icon-search">搜索</vue-button></vue-step></vue-steps></div>',
            code:'<vue-steps :space="250" :active="1">\n'+
            '    <vue-step title="步骤 1">\n'+
            '        <span slot="description">这是一段很长很长很长的描述性文字</span>\n'+
            '    </vue-step>\n'+
            '    <vue-step title="步骤 2">\n'+
            '        <vue-button slot="description">这是按钮</vue-button>\n'+
            '    </vue-step>\n'+
            '    <vue-step title="步骤 3" description="这是一段很长很长很长的描述性文字">\n'+
            '        <vue-button slot="description" type="primary" icon="vue-icon-search">搜索</vue-button>\n'+
            '    </vue-step>\n'+
            '</vue-steps>'
        }]
    };
    return stepsDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("SwitchDemo", this, function() {
    'use strict';
    var switchDemo = {
        path: '/switch',
        name: 'switch',
        head: {
            label: 'switchDemo.label',
            description: 'switchDemo.description'
        },
        samples: [{
            id: 'switch1',
            label: 'switchDemo.samples1.label',
            description: 'switchDemo.samples1.description',
            template: '<div class="source"><vue-row><vue-col :span="4"><vue-switch v-model="value1" on-text="Open" off-text="" width="65"></vue-switch></vue-col><vue-col :span="4"><vue-switch v-model="value2" on-color="#13ce66" off-color="#ff4949"></vue-switch></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        value1: true,
                        value2: false
                    };
                }
            },
            code: '<vue-switch v-model="value1" on-text="Open" off-text="" width="65"></vue-switch>\n'+
            '<vue-switch v-model="value2" on-color="#13ce66" off-color="#ff4949"></vue-switch>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                value1: true,\n'+
            '                value2: false\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'switch2',
            label: 'switchDemo.samples2.label',
            description: 'switchDemo.samples2.description',
            template: '<div class="source"><vue-row><vue-col :span="4"><vue-switch v-model="value1" disabled></vue-switch></vue-col><vue-col :span="4"><vue-switch v-model="value2" disabled></vue-switch></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        value1: true,
                        value2: false
                    };
                }
            },
            code: '<vue-switch v-model="value1" disabled></vue-switch>\n'+
            '<vue-switch v-model="value2" disabled></vue-switch>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                value1: true,\n'+
            '                value2: false\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'switch3',
            label: 'Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "disabled",
                        column2: "switchDemo.samples3.row1column2",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    },{
                        column1: "width",
                        column2: "switchDemo.samples3.row2column2",
                        column3: "number",
                        column4: "—",
                        column5: "switchDemo.samples3.row2column5"
                    },{
                        column1: "on-icon-class",
                        column2: "switchDemo.samples3.row3column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "off-icon-class",
                        column2: "switchDemo.samples3.row4column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    },{
                        column1: "on-text",
                        column2: "switchDemo.samples3.row5column2",
                        column3: "string",
                        column4: "—",
                        column5: "ON"
                    },{
                        column1: "off-text",
                        column2: "switchDemo.samples3.row6column2",
                        column3: "string",
                        column4: "—",
                        column5: "OFF"
                    },{
                        column1: "on-color",
                        column2: "switchDemo.samples3.row7column2",
                        column3: "string",
                        column4: "—",
                        column5: "#20A0FF"
                    },{
                        column1: "off-color",
                        column2: "switchDemo.samples3.row8column2",
                        column3: "string",
                        column4: "—",
                        column5: "#C0CCDA"
                    },{
                        column1: "name",
                        column2: "switchDemo.samples3.row9column2",
                        column3: "string",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'switch4',
            label: 'Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "change",
                        column2: "switchDemo.samples4.row1column2",
                        column3: "value after changing"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return switchDemo;
});
!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(['Vue', 'VueUtil'], definition);
    } else {
        context[name] = definition(context['Vue'], context['VueUtil']);
    }
})("TableDemo", this, function(Vue, VueUtil) {
    'use strict';
    var tableDemo = {
        path: '/table',
        name: 'table',
        head: {
            label: 'Table 表格',
            description: '用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。'
        },
        samples: [{
            id: 'table1',
            label: '基础用法',
            description: '当vue-table元素中注入data对象数组后，在vue-table-column中用prop属性来对应对象中的键名即可填入数据，用label属性来定义表格的列名，可以使用width属性来定义列宽；设置stripe属性为true可以创建带斑马纹的表格，它默认为false；设置border属性为true可以具有竖直方向的边框的。它默认为false．',
            template: '<div class="source"><vue-table :data="tableData" border stripe style="width: 100%"><vue-table-column prop="date" label="日期" width="180"></vue-table-column><vue-table-column prop="name" label="姓名" width="180"></vue-table-column><vue-table-column prop="address" label="地址"></vue-table-column></vue-table></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: [{
                            date: "2015-01-02",
                            name: "张三",
                            province: '厦门',
                            address: "厦门市思明区",
                            zip: 361000
                          }, {
                            date: "2016-04-05",
                            name: "李四",
                            province: '厦门',
                            address: "厦门市翔安区",
                            zip: 361100
                          }, {
                            date: "2017-06-07",
                            name: "王二",
                            province: '厦门',
                            address: "厦门市湖里区",
                            zip: 361000
                          }, {
                            date: "2018-10-22",
                            name: "龙五",
                            province: '厦门',
                            address: "厦门市海沧区",
                            zip: 361000
                          }]
                    };
                }
            },
            code: '<vue-table :data="tableData" border stripe style="width: 100%">\n'+
            '    <vue-table-column prop="date" label="日期" width="180"></vue-table-column>\n'+
            '    <vue-table-column prop="name" label="姓名" width="180"></vue-table-column>\n'+
            '    <vue-table-column prop="address" label="地址"></vue-table-column>\n'+
            '</vue-table>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: [{\n'+
            '                    date: "2015-01-02",\n'+
            '                    name: "张三",\n'+
            '                    address: "厦门市思明区"\n'+
            '                }, {\n'+
            '                    date: "2016-04-05",\n'+
            '                    name: "李四",\n'+
            '                    address: "厦门市翔安区"\n'+
            '                }, {\n'+
            '                    date: "2017-06-07",\n'+
            '                    name: "王二",\n'+
            '                    address: "厦门市湖里区"\n'+
            '                }, {\n'+
            '                    date: "2018-10-22",\n'+
            '                    name: "龙五",\n'+
            '                    address: "厦门市海沧区"\n'+
            '                }]\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'table2',
            label: '固定列',
            description: '固定列需要使用fixed属性，它接受 Boolean 值或者left, right，表示左边固定还是右边固定。',
            template: '<div class="source"><vue-table :data="tableData" border style="width: 100%"><vue-table-column fixed prop="date" label="日期" width="150"></vue-table-column><vue-table-column prop="name" label="姓名" width="120"></vue-table-column><vue-table-column prop="province" label="省份" width="120"></vue-table-column><vue-table-column prop="city" label="市区" width="120"></vue-table-column><vue-table-column prop="address" label="地址" width="300"></vue-table-column><vue-table-column prop="zip" label="邮编" width="120"></vue-table-column><vue-table-column fixed="right" label="操作" width="120"><template scope="scope"><vue-button @click="handleClick" type="text" size="small">查看</vue-button><vue-button type="text" size="small">编辑</vue-button></template></vue-table-column></vue-table></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: [{
                            date: "2015-01-02",
                            name: "张三",
                            province: '福建',
                            city: '厦门',
                            address: "厦门市思明区",
                            zip: 361000
                          }, {
                            date: "2016-04-05",
                            name: "李四",
                            province: '福建',
                            city: '厦门',
                            address: "厦门市翔安区",
                            zip: 361100
                          }, {
                            date: "2017-06-07",
                            name: "王二",
                            province: '福建',
                            city: '厦门',
                            address: "厦门市湖里区",
                            zip: 361000
                          }, {
                            date: "2018-10-22",
                            name: "龙五",
                            province: '福建',
                            city: '厦门',
                            address: "厦门市海沧区",
                            zip: 361000
                          }]
                    }
                },
                methods: {
                  handleClick: function() {
                    console.log(1);
                  }
                }
            },
            code: '<vue-table :data="tableData" border style="width: 100%">\n'+
            '    <vue-table-column fixed prop="date" label="日期" width="150">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="name" label="姓名" width="120">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="province" label="省份" width="120">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="city" label="市区" width="120">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="address" label="地址" width="300">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="zip" label="邮编" width="120">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column fixed="right" label="操作" width="120">\n'+
            '        <template scope="scope">\n'+
            '            <vue-button @click="handleClick" type="text" size="small">查看</vue-button>\n'+
            '            <vue-button type="text" size="small">编辑</vue-button>\n'+
            '        </template>\n'+
            '    </vue-table-column>\n'+
            '</vue-table>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: [{\n'+
            '                    date: "2015-01-02",\n'+
            '                    name: "张三",\n'+
            '                    province: "福建",\n'+
            '                    city: "厦门",\n'+
            '                    address: "厦门市思明区"\n'+
            '                    zip: 361000\n'+
            '                }, {\n'+
            '                    date: "2016-04-05",\n'+
            '                    name: "李四",\n'+
            '                    province: "福建",\n'+
            '                    city: "厦门",\n'+
            '                    address: "厦门市翔安区"\n'+
            '                    zip: 361100\n'+
            '                }, {\n'+
            '                    date: "2017-06-07",\n'+
            '                    name: "王二",\n'+
            '                    province: "福建",\n'+
            '                    city: "厦门",\n'+
            '                    address: "厦门市湖里区"\n'+
            '                    zip: 361000\n'+
            '                }, {\n'+
            '                    date: "2018-10-22",\n'+
            '                    name: "龙五",\n'+
            '                    province: "福建",\n'+
            '                    city: "厦门",\n'+
            '                    address: "厦门市海沧区"\n'+
            '                    zip: 361000\n'+
            '                }]\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'table3',
            label: '自定义模板',
            description: '通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据, 可组合其他组件自定义显示的内容',
            template: '<div class="source"><vue-table :data="tableData" border stripe style="width: 100%"><vue-table-column label="商品信息"><vue-table-column prop="id" label="商品ID" width="200"></vue-table-column><vue-table-column prop="name" label="商品名称" width="200"></vue-table-column></vue-table-column><vue-table-column label="店铺信息"><template scope="props"><vue-row><vue-col :span="12"><span>{{ props.row.shopId }}</span></vue-col><vue-col :span="12"><span>{{ props.row.shopName }}</span></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="24"><span>{{ props.row.shopAddr }}</span></vue-col></vue-row></template></vue-table-column></vue-table></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: [{
                            id: "12987122",
                            name: "商品2",
                            shopName: "店铺2",
                            shopId: "10332",
                            shopAddr: "福建厦门"
                        }, {
                            id: "12987123",
                            name: "商品3",
                            shopName: "店铺3",
                            shopId: "10333",
                            shopAddr: "广东广州"
                        }, {
                            id: "12987125",
                            name: "商品5",
                            shopName: "店铺1",
                            shopId: "10331",
                            shopAddr: "上海"
                        }]
                    }
                }
            },
            code: '<vue-table :data="tableData" border stripe style="width: 100%">\n'+
            '    <vue-table-column label="商品信息">\n'+
            '        <vue-table-column prop="id" label="商品ID" width="200">\n'+
            '        </vue-table-column>\n'+
            '        <vue-table-column prop="name" label="商品名称" width="200">\n'+
            '        </vue-table-column>\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column label="店铺信息">\n'+
            '    <template scope="props">\n'+
            '        <vue-row>\n'+
            '            <vue-col :span="12">\n'+
            '                <span>{{ props.row.shopId }}</span>\n'+
            '            </vue-col>\n'+
            '            <vue-col :span="12">\n'+
            '                <span>{{ props.row.shopName }}</span>\n'+
            '            </vue-col>\n'+
            '        </vue-row>\n'+
            '        <vue-row>\n'+
            '            <vue-col :span="24">\n'+
            '                <span>{{ props.row.shopAddr }}</span>\n'+
            '            </vue-col>\n'+
            '        </vue-row>\n'+
            '    </template>\n'+
            '    </vue-table-column>\n'+
            '</vue-table>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: [{\n'+
            '                    id: "12987122",\n'+
            '                    name: "商品2",\n'+
            '                    shopName: "店铺2",\n'+
            '                    shopId: "10332",\n'+
            '                    shopAddr: "福建厦门"\n'+
            '                }, {\n'+
            '                    id: "12987123",\n'+
            '                    name: "商品3",\n'+
            '                    shopName: "店铺3",\n'+
            '                    shopId: "10332",\n'+
            '                    shopAddr: "广东广州"\n'+
            '                }, {\n'+
            '                    id: "12987125",\n'+
            '                    name: "商品5",\n'+
            '                    shopName: "店铺1",\n'+
            '                    shopId: "10331",\n'+
            '                    shopAddr: "上海"\n'+
            '                }]\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'table4',
            label: '增删改',
            description: '',
            template: '<div class="source"><vue-table :data="tableData" border style="width: 100%"><vue-table-column label="操作" width="160"><template scope="props"><vue-button @click="editHandle(props.row)" type="primary" icon="vue-icon-edit"></vue-button><vue-button @click="delHandle(props.row)" type="primary" icon="vue-icon-delete"></vue-button></template></vue-table-column><vue-table-column prop="city" label="城市" width="150"></vue-table-column><vue-table-column prop="name" label="姓名" width="120"></vue-table-column><vue-table-column prop="address" label="地址" ></vue-table-column></vue-table><vue-button @click="addHandle" >行追加</vue-button><vue-dialog  v-model="dialogVisible"><vue-form :model="currentData" label-width="100px" ><vue-form-item label="城市" prop="city"><vue-input v-model="currentData.city"></vue-input></vue-form-item><vue-form-item label="姓名" prop="name"><vue-input v-model="currentData.name"></vue-input></vue-form-item><vue-form-item label="地址" prop="address"><vue-input v-model="currentData.address"></vue-input></vue-form-item></vue-form><span slot="footer" class="dialog-footer"><vue-button @click="dialogVisible = false">取 消</vue-button><vue-button type="primary" @click="saveHandle">确 定</vue-button></span></vue-dialog></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: [{
                            city: '厦门',
                            name: "张三",
                            address: "厦门市思明区"
                          }, {
                              city: '厦门',
                            name: "李四",
                            address: "厦门市翔安区"
                          }, {
                              city: '厦门',
                            name: "王二",
                            address: "厦门市湖里区"
                          }, {
                              city: '厦门',
                            name: "龙五",
                            address: "厦门市海沧区"
                          }],
                          currentIndex:-1,
                          currentData:{},
                          dialogVisible: false
                    }
                },
                methods: {
                  addHandle: function() {
                    this.currentData = {};
                    this.currentIndex = this.tableData.length;
                    this.dialogVisible = true;
                  },
                  editHandle: function(rowData) {
                    this.currentData = VueUtil.merge({}, rowData);
                    this.currentIndex = this.tableData.indexOf(rowData);
                    this.dialogVisible = true;
                  },
                  delHandle: function(rowData) {
                    var index = this.tableData.indexOf(rowData);
                    this.tableData.splice(index, 1);
                  },
                  saveHandle: function() {
                      Vue.set(this.tableData, this.currentIndex, this.currentData);
                      this.dialogVisible = false;
                    
                  }
                }
            },
            code: '<vue-table :data="tableData" border style="width: 100%">\n'+
            '    <vue-table-column label="操作" width="160">\n'+
            '        <template scope="props">\n'+
            '            <vue-button @click="editHandle(props.row)" type="primary" icon="vue-icon-edit"></vue-button>\n'+
            '            <vue-button @click="delHandle(props.row)" type="primary" icon="vue-icon-delete"></vue-button>\n'+
            '        </template>\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="date" label="日期" width="150">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="name" label="姓名" width="120">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="address" label="地址" width="300">\n'+
            '    </vue-table-column>\n'+
            '</vue-table>\n'+
            '<vue-button @click="addHandle" >行追加</vue-button>\n'+
            '<vue-dialog    v-model="dialogVisible">\n'+
            '    <vue-form :model="currentData" label-width="100px" >\n'+
            '        <vue-form-item label="城市" prop="city">\n'+
            '            <vue-input v-model="currentData.city"></vue-input>\n'+
            '        </vue-form-item>\n'+
            '        <vue-form-item label="姓名" prop="name">\n'+
            '            <vue-input v-model="currentData.name"></vue-input>\n'+
            '        </vue-form-item>\n'+
            '        <vue-form-item label="地址" prop="address">\n'+
            '            <vue-input v-model="currentData.address"></vue-input>\n'+
            '        </vue-form-item>\n'+
            '    </vue-form>\n'+
            '    <span slot="footer" class="dialog-footer">\n'+
            '        <vue-button @click="dialogVisible = false">取 消</vue-button>\n'+
            '        <vue-button type="primary" @click="saveHandle">确 定</vue-button>\n'+
            '    </span>\n'+
            '</vue-dialog>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: [{\n'+
            '                    name: "张三",\n'+
            '                    city: "厦门",\n'+
            '                    address: "厦门市思明区"\n'+
            '                }, {\n'+
            '                    name: "李四",\n'+
            '                    city: "厦门",\n'+
            '                    address: "厦门市翔安区"\n'+
            '                }, {\n'+
            '                    name: "王二",\n'+
            '                    city: "厦门",\n'+
            '                    address: "厦门市湖里区"\n'+
            '                }, {\n'+
            '                    city: "厦门",\n'+
            '                    name: "龙五",\n'+
            '                    address: "厦门市海沧区"\n'+
            '                }],\n'+
            '                currentIndex:-1,\n'+
            '                currentData:{},\n'+
            '                dialogVisible: false\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            addHandle: function() {\n'+
            '                this.currentData = {};\n'+
            '                this.currentIndex = this.tableData.length;\n'+
            '                this.dialogVisible = true;\n'+
            '            },\n'+
            '            editHandle: function(rowData) {\n'+
            '                this.currentData = VueUtil.merge({}, rowData);\n'+
            '                this.currentIndex = this.tableData.indexOf(rowData);\n'+
            '                this.dialogVisible = true;\n'+
            '            },\n'+
            '            delHandle: function(rowData) {\n'+
            '                var index = this.tableData.indexOf(rowData);\n'+
            '                this.tableData.splice(index, 1);\n'+
            '            },\n'+
            '            saveHandle: function() {\n'+
            '                Vue.set(this.tableData, this.currentIndex, this.currentData);\n'+
            '                this.dialogVisible = false;\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'table5',
            label: '排序',
            description: '通过表的default-sort属性设置默认的排序列和排序顺序。在列中设置sortable属性即可实现以该列为基准的排序',
            template: '<div class="source"><vue-table :data="tableData" border stripe style="width: 751px" :default-sort = "{prop: \'column1\', order: \'descending\'}"><vue-table-column v-for="item in 5" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" sortable ></vue-table-column></vue-table></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: null
                    }
                },
                mounted: function() {
                    var tableData = [];
                    for (var i = 0; i < 5; i++) {
                        var DateOption = {};
                        for (var j = 1; j < 6; j++) {  
                            DateOption['column'+j] = "value-"+j+"—"+(i+1);
                        }
                        tableData[i] = DateOption; 
                    }
                    this.tableData = tableData;
                }
            },
            code: '<vue-table :data="tableData" border stripe style="width: 751px" :default-sort = "{prop: \'column1\', order: \'descending\'}">\n'+
            '    <vue-table-column v-for="item in 5" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" sortable >\n'+
            '    </vue-table-column>\n'+
            '</vue-table>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: null\n'+
            '            }\n'+
            '        },\n'+
            '        mounted: function() {\n'+
            '            var tableData = [];\n'+
            '            for (var i = 0; i < 5; i++) {\n'+
            '                var DateOption = {};\n'+
            '                for (var j = 1; j < 6; j++) {\n'+
            '                    DateOption[\'column\'+j] = "value-"+j+"—"+(i+1);\n'+
            '                }\n'+
            '                tableData[i] = DateOption;\n'+
            '            }\n'+
            '            this.tableData = tableData;\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'table6',
            label: '筛选',
            description: '在列中设置filters属性即可开启该列的筛选。',
            template: '<div class="source"><vue-table :data="tableData" border stripe style="width: 751px"><vue-table-column v-for="item in 4" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" ></vue-table-column><vue-table-column prop="column5" label="column5" width="150" :filters="[{ text: \'value1\', value: \'value-5-1\' }, { text: \'value3\', value: \'value-5-3\' }]"></vue-table-column></vue-table></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: null
                    }
                },
                mounted: function() {
                    var tableData = [];
                    for (var i = 0; i < 5; i++) {
                        var DateOption = {};
                        for (var j = 1; j < 6; j++) {  
                            DateOption['column'+j] = "value-"+j+"—"+(i+1);
                        }
                        tableData[i] = DateOption; 
                    }
                    this.tableData = tableData;
                }
            },
            code: '<vue-table :data="tableData" border stripe style="width: 751px">\n'+
            '    <vue-table-column v-for="item in 4" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" >\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="column5" label="column5" width="150" :filters="[{ text: \'value1\', value: \'value-5-1\' }, { text: \'value3\', value: \'value-5-3\' }]">\n'+
            '    </vue-table-column>\n'+
            '</vue-table>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: null\n'+
            '            }\n'+
            '        },\n'+
            '        mounted: function() {\n'+
            '            var tableData = [];\n'+
            '            for (var i = 0; i < 5; i++) {\n'+
            '                var DateOption = {};\n'+
            '                for (var j = 1; j < 6; j++) {\n'+
            '                    DateOption[\'column\'+j] = "value-"+j+"—"+(i+1);\n'+
            '                }\n'+
            '                tableData[i] = DateOption;\n'+
            '            }\n'+
            '            this.tableData = tableData;\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'table7',
            label: '自定义样式',
            description: '通过table的属性 row-class-name 可以给行指定样式, 通过table-column的属性 className 可以给列指定样式, 通过table-column的属性labelClassName 可以给label的指定样式',
            template: '<div class="source"><vue-table :data="tableData" border stripe style="width: 751px" :row-class-name=\'getRowClass\'><vue-table-column v-for="item in 4" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" :class-name=\'getCellClass\'></vue-table-column><vue-table-column prop="column5" label="column5" width="150"></vue-table-column></vue-table><br/><vue-table :data="tableData" border stripe style="width: 751px" row-class-name="rowClass1"><vue-table-column v-for="item in 4" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" class-name="cellClass" label-class-name="rowClass cellClass1"></vue-table-column><vue-table-column prop="column5" label="column5" width="150"></vue-table-column></vue-table></div>',
            parameter: {
                data: function() {
                    return {
                        tableData: null
                    }
                },
                methods: {
                    getRowClass: function(rowData, rowIndex) {
                        if (rowIndex%2 === 0) {
                            return 'rowClass1'
                        }
                        return 'rowClass'
                    },
                    getCellClass: function(rowIndex, cellIndex, rowData) {
                        if (rowIndex%2 === 0 && cellIndex%2 === 0) {
                            return 'cellClass1'
                        }
                        if (rowIndex%2 !== 0 && cellIndex%2 !== 0) {
                            return 'cellClass'
                        }
                    }
                },
                mounted: function() {
                    var tableData = [];
                    for (var i = 0; i < 5; i++) {
                        var DateOption = {};
                        for (var j = 1; j < 6; j++) {  
                            DateOption['column'+j] = "value-"+j+"—"+(i+1);
                        }
                        tableData[i] = DateOption; 
                    }
                    this.tableData = tableData;
                }
            },
            code: '<vue-table :data="tableData" border stripe style="width: 751px" :row-class-name="getRowClass">\n'+
            '    <vue-table-column v-for="item in 4" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" :class-name="getCellClass">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="column5" label="column5" width="150">\n'+
            '    </vue-table-column>\n'+
            '</vue-table>\n\n'+
            '<vue-table :data="tableData" border stripe style="width: 751px" row-class-name="rowClass1">\n'+
            '    <vue-table-column v-for="item in 4" :key="item" :prop="\'column\'+item" :label="\'column\'+item" width="150" class-name="cellClass" label-class-name="rowClass cellClass1">\n'+
            '    </vue-table-column>\n'+
            '    <vue-table-column prop="column5" label="column5" width="150">\n'+
            '    </vue-table-column>\n'+
            '</vue-table>\n\n'+
            '<style>\n'+
            '    .rowClass{\n'+
            '        color: #f00 !important;\n'+
            '    }\n'+
            '    .rowClass1{\n'+
            '        color: #00f !important;\n'+
            '    }\n'+
            '    .cellClass{\n'+
            '        background-color: #ff0 !important;\n'+
            '    }\n'+
            '    .cellClass1{\n'+
            '        background-color: #0ff !important;\n'+
            '    }\n'+
            '</style>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: null\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            getRowClass: function(rowData, rowIndex) {\n'+
            '                if (rowIndex%2 === 0) {\n'+
            '                    return "rowClass1"\n'+
            '                }\n'+
            '                return "rowClass"\n'+
            '            },\n'+
            '            getCellClass: function(rowIndex, cellIndex, rowData) {\n'+
            '                if (rowIndex%2 === 0 && cellIndex%2 === 0) {\n'+
            '                    return "cellClass1"\n'+
            '                }\n'+
            '                if (rowIndex%2 !== 0 && cellIndex%2 !== 0) {\n'+
            '                    return "cellClass"\n'+
            '                }\n'+
            '            }\n'+
            '        },\n'+
            '        mounted: function() {\n'+
            '            var tableData = [];\n'+
            '            for (var i = 0; i < 5; i++) {\n'+
            '                var DateOption = {};\n'+
            '                for (var j = 1; j < 6; j++) {\n'+
            '                    DateOption[\'column\'+j] = "value-"+j+"—"+(i+1);\n'+
            '                }\n'+
            '                tableData[i] = DateOption;\n'+
            '            }\n'+
            '            this.tableData = tableData;\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'table8',
            label: '展开行',
            description: '设置 type="expand" 和 Scoped slot 可以开启展开行功能，vue-table-column 的模板会被渲染成为展开行的内容，展开行可访问的属性与使用自定义列模板时的 Scoped slot 相同。设置table的 expand-class-name属性 可以给展开行指定样式',
            template: '<div class="source"><vue-table :data="tableData" style="width: 100%" expand-class-name="test" :expand-class-name="getExpandClass"><vue-table-column type="expand"><template scope="props"><p>State: {{ props.row.state }}</p><p>City: {{ props.row.city }}</p><p>Address: {{ props.row.address }}</p><p>Zip: {{ props.row.zip }}</p></template></vue-table-column><vue-table-column label="Date" prop="date" header-align="left"></vue-table-column><vue-table-column label="Name" prop="name" header-align="left"></vue-table-column></vue-table></div>',
            parameter: {
                data: function() {
                    return {
	                    tableData: [{
	                        date: "2017-05-03",
	                        name: "Tom",
	                        state: "California",
	                        city: "Los Angeles",
	                        address: "No. 189, Grove St, Los Angeles",
	                        zip: "CA 90036"
	                      }, {
	                        date: "2017-06-02",
	                        name: "Tom",
	                        state: "California",
	                        city: "Los Angeles",
	                        address: "No. 189, Grove St, Los Angeles",
	                        zip: "CA 90036"
	                      }, {
	                        date: "2017-07-04",
	                        name: "Tom",
	                        state: "California",
	                        city: "Los Angeles",
	                        address: "No. 189, Grove St, Los Angeles",
	                        zip: "CA 90036"
	                      }]
                    }
                },
                methods: {
                	getExpandClass: function(rowData, rowIndex) {
                        if (rowIndex%2 === 0) {
                            return 'rowClass1'
                        }
                        return 'rowClass'
                    }
                }
            },
            code: '<vue-table :data="tableData" style="width: 100%" :expand-class-name="getExpandClass">\n'+
            	'    <vue-table-column type="expand">\n'+
            	'        <template scope="props">\n'+
            	'            <p>State: {{ props.row.state }}</p>\n'+
            	'            <p>City: {{ props.row.city }}</p>\n'+
            	'            <p>Address: {{ props.row.address }}</p>\n'+
            	'            <p>Zip: {{ props.row.zip }}</p>\n'+
            	'        </template>\n'+
            	'    </vue-table-column>\n'+
            	'    <vue-table-column label="Date" prop="date" header-align="left"></vue-table-column>\n'+
            	'    <vue-table-column label="Name" prop="name" header-align="left"></vue-table-column>\n'+
            	'</vue-table>\n\n'+
                '<style>\n'+
                '    .rowClass{\n'+
                '        color: #f00 !important;\n'+
                '    }\n'+
                '    .rowClass1{\n'+
                '        color: #00f !important;\n'+
                '    }\n'+
                '</style>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                tableData: [{\n'+
            '                    date: "2017-05-03",\n'+
            '                    name: "Tom",\n'+
            '                    state: "California",\n'+
            '                    city: "Los Angeles",\n'+
            '                    address: "No. 189, Grove St, Los Angeles",\n'+
            '                    zip: "CA 90036",\n'+
            '                }, {\n'+
            '                    date: "2017-06-02",\n'+
            '                    name: "Tom",\n'+
            '                    state: "California",\n'+
            '                    city: "Los Angeles",\n'+
            '                    address: "No. 189, Grove St, Los Angeles",\n'+
            '                    zip: "CA 90036",\n'+
            '                }, {\n'+
            '                    date: "2017-07-04",\n'+
            '                    name: "Tom",\n'+
            '                    state: "California",\n'+
            '                    city: "Los Angeles",\n'+
            '                    address: "No. 189, Grove St, Los Angeles",\n'+
            '                    zip: "CA 90036",\n'+
            '                }]\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            getExpandClass: function(rowData, rowIndex) {\n'+
            '                if (rowIndex%2 === 0) {\n'+
            '                    return "rowClass1"\n'+
            '                }\n'+
            '                return "rowClass"\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return tableDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("TabsDemo", this, function() {
    'use strict';
    var tabsDemo = {
        path: '/tabs',
        name: 'tabs',
        head: {
            label: 'Tabs 标签页',
            description: '分隔内容上有关联但属于不同类别的数据集合。'
        },
        samples: [{
            id: 'tabs1',
            label: '基础用法',
            description: 'Tabs 组件提供了选项卡功能，默认选中第一个标签页，你也可以通过 value 属性来指定当前选中的标签页',
            template: '<div class="source"><vue-tabs v-model="activeName" @tab-click="handleClick"><vue-tab-pane label="用户管理" name="first">用户管理</vue-tab-pane><vue-tab-pane label="配置管理" name="second">配置管理</vue-tab-pane><vue-tab-pane label="角色管理" name="third">角色管理</vue-tab-pane><vue-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</vue-tab-pane></vue-tabs></div>',
            parameter: {
                data: function() {
                    return {
                      activeName: "second"
                    }
                },
                methods: {
                  handleClick: function(tab, event) {
                    console.log(tab, event);
                  }
                }
            },
            code: '<vue-tabs v-model="activeName" @tab-click="handleClick">\n'+
            '    <vue-tab-pane label="用户管理" name="first">用户管理</vue-tab-pane>\n'+
            '    <vue-tab-pane label="配置管理" name="second">配置管理</vue-tab-pane>\n'+
            '    <vue-tab-pane label="角色管理" name="third">角色管理</vue-tab-pane>\n'+
            '    <vue-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</vue-tab-pane>\n'+
            '</vue-tabs>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return {\n'+
            '                activeName: "second"\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            handleClick: function(tab, event) {\n'+
            '                console.log(tab, event);\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return tabsDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("TagDemo", this, function() {
    'use strict';
    var tagDemo = {
        path: '/tag',
        name: 'tag',
        head: {
            label: 'Tag 标签',
            description: '用于标记和选择。'
        },
        samples: [{
            id: 'tag1',
            label: '基础用法',
            description: '用type属性来选择tag的类型，也可以通过color属性来自定义背景色；设置closable属性可以定义一个标签是否可移除，默认的标签移除时会附带渐变动画，可以设置transition属性为true来打开渐变动画．',
            template: '<div class="source"><vue-tag class="tags" v-for="tag in tags" :key="tag" :closable="tag.closable" :type="tag.type" :transition="tag.transition" @close="closeHandle(tag)">{{tag.name}}</vue-tag></div>',
            parameter: {
                data: function() {
                  return {
                    tags: [
                      { name: "标签一", type: "" , closable: false, transition: false},
                      { name: "标签二", type: "gray", closable: true, transition: false },
                      { name: "标签三", type: "primary", closable: false, transition: false },
                      { name: "标签四", type: "success", closable: true, transition: true },
                      { name: "标签五", type: "warning", closable: true, transition: false },
                      { name: "标签六", type: "danger", closable: true, transition: true }
                    ]
                  };
                },
                methods: {
                  closeHandle: function(tag) {
                    this.tags.splice(this.tags.indexOf(tag), 1);
                  }
                }
            },
            code: '<vue-tag v-for="tag in tags"\n'+
                  '         :key="tag"\n'+
                  '         :closable="tag.closable"\n'+
                  '         :type="tag.type"\n'+
                  '         :transition="tag.transition"\n'+
                  '         @close="closeHandle(tag)">\n'+
                  '    {{tag.name}}\n'+
                  '</vue-tag>\n\n'+
                  '<script>\n'+
                  '    new Vue({\n'+
                  '        data: function(){\n'+
                  '            return {\n'+
                  '                tags: [\n'+
                  '                    { name: "标签一", type: "" , closable: false, transition: false},\n'+
                  '                    { name: "标签二", type: "gray", closable: true, transition: false },\n'+
                  '                    { name: "标签三", type: "primary", closable: false, transition: false },\n'+
                  '                    { name: "标签四", type: "success", closable: true, transition: true },\n'+
                  '                    { name: "标签五", type: "warning", closable: true, transition: false },\n'+
                  '                    { name: "标签六", type: "danger", closable: true, transition: true }\n'+
                  '                ]\n'+
                  '            }\n'+
                  '        },\n'+
                  '        methods: {\n'+
                  '            closeHandle: function(tag) {\n'+
                  '                this.tags.splice(this.tags.indexOf(tag), 1);\n'+
                  '            }\n'+
                  '        }\n'+
                  '    }).$mount();\n'+
                  '</script>'
        }]
    };
    return tagDemo;
});
!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("TooltipDemo", this, function() {
    'use strict';
    var tooltipDemo = {
        path: '/tooltip',
        name: 'tooltip',
        head: {
            label: 'Tooltip 文字提示',
            description: '常用于展示鼠标 hover 时的提示信息。'
        },
        samples: [{
            id: 'tooltip1',
            label: '基础用法',
            description: '使用content属性来决定hover时的提示信息。由placement属性决定展示效果：placement属性值为：方向-对齐位置；四个方向：top、left、right、bottom；三种对齐位置：start, end，默认为空。如placement="left-end"，则提示信息出现在目标元素的左侧，且提示信息的底部与目标元素的底部对齐。',
            template: '<div class="source"><div class="box"><div class="top"><vue-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start"><vue-button>上左</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top"><vue-button>上边</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end"><vue-button>上右</vue-button></vue-tooltip></div><div class="left"><vue-tooltip class="item" effect="dark" content="Left Top 提示文字" placement="left-start"><vue-button>左上</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Left Center 提示文字" placement="left"><vue-button>左边</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Left Bottom 提示文字" placement="left-end"><vue-button>左下</vue-button></vue-tooltip></div><div class="right"><vue-tooltip class="item" effect="dark" content="Right Top 提示文字" placement="right-start"><vue-button>右上</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Right Center 提示文字" placement="right"><vue-button>右边</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Right Bottom 提示文字" placement="right-end"><vue-button>右下</vue-button></vue-tooltip></div><div class="bottom"><vue-tooltip class="item" effect="dark" content="Bottom Left 提示文字" placement="bottom-start"><vue-button>下左</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Bottom Center 提示文字" placement="bottom"><vue-button>下边</vue-button></vue-tooltip><vue-tooltip class="item" effect="dark" content="Bottom Right 提示文字" placement="bottom-end"><vue-button>下右</vue-button></vue-tooltip></div></div></div>',
            code: '<div class="box">\n'+
            '    <div class="top">\n'+
            '        <vue-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">\n'+
            '            <vue-button>上左</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top">\n'+
            '            <vue-button>上边</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">\n'+
            '            <vue-button>上右</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '    </div>\n'+
            '    <div class="left">\n'+
            '        <vue-tooltip class="item" effect="dark" content="Left Top 提示文字" placement="left-start">\n'+
            '            <vue-button>左上</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Left Center 提示文字" placement="left">\n'+
            '            <vue-button>左边</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Left Bottom 提示文字" placement="left-end">\n'+
            '            <vue-button>左下</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '    </div>\n'+
            '    <div class="right">\n'+
            '        <vue-tooltip class="item" effect="dark" content="Right Top 提示文字" placement="right-start">\n'+
            '            <vue-button>右上</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Right Center 提示文字" placement="right">\n'+
            '            <vue-button>右边</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Right Bottom 提示文字" placement="right-end">\n'+
            '            <vue-button>右下</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '    </div>\n'+
            '    <div class="bottom">\n'+
            '        <vue-tooltip class="item" effect="dark" content="Bottom Left 提示文字" placement="bottom-start">\n'+
            '            <vue-button>下左</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Bottom Center 提示文字" placement="bottom">\n'+
            '            <vue-button>下边</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '        <vue-tooltip class="item" effect="dark" content="Bottom Right 提示文字" placement="bottom-end">\n'+
            '            <vue-button>下右</vue-button>\n'+
            '        </vue-tooltip>\n'+
            '    </div>\n'+
            '</div>'
        }]
    };
    return tooltipDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(['Vue'], definition);
    } else {
        context[name] = definition(context['Vue']);
    }
})("TreeDemo", this, function(Vue) {
    'use strict';
    var treeDemo = {
        path: '/tree',
        name: 'tree',
        head: {
            label: 'Tree 树形控件',
            description: '用清晰的层级结构展示信息，可展开或折叠。'
        },
        samples: [{
            id: 'tree1',
            label: '基础用法',
            description: '基础的树形结构展示．',
            template: '<div class="source"><vue-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></vue-tree></div>',
            parameter: {
                data: function() {
                  return {
                    data: [{
                      label: "一级 1",
                      children: [{
                        label: "二级 1-1",
                        children: [{
                          label: "三级 1-1-1"
                        }]
                      }]
                    }, {
                     label: "一级 2",
                      children: [{
                        label: "二级 2-1",
                        children: [{
                          label: "三级 2-1-1"
                        }]
                      }, {
                        label: "二级 2-2",
                        children: [{
                          label: "三级 2-2-1"
                        }]
                      }]
                    }, {
                      label: "一级 3",
                      children: [{
                        label: "二级 3-1",
                        children: [{
                          label: "三级 3-1-1"
                        }]
                      }, {
                        label: "二级 3-2",
                        children: [{
                          label: "三级 3-2-1"
                        }]
                      }]
                    }],
                    defaultProps: {
                      children: "children",
                      label: "label"
                    }
                  }
                },
                methods: {
                  handleNodeClick: function(data) {
                    console.log(data);
                  }
                }
            },
            code: '<vue-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></vue-tree>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                data: [{\n'+
            '                    label: "一级 1",\n'+
            '                    children: [{\n'+
            '                        label: "二级 1-1",\n'+
            '                        children: [{\n'+
            '                            label: "三级 1-1-1"\n'+
            '                        }]\n'+
            '                    }]\n'+
            '                }, {\n'+
            '                    label: "一级 2",\n'+
            '                    children: [{\n'+
            '                        label: "二级 2-1",\n'+
            '                        children: [{\n'+
            '                            label: "三级 2-1-1"\n'+
            '                        }]\n'+
            '                    }, {\n'+
            '                        label: "二级 2-2",\n'+
            '                        children: [{\n'+
            '                            label: "三级 2-2-1"\n'+
            '                        }]\n'+
            '                    }]\n'+
            '                }, {\n'+
            '                    label: "一级 3",\n'+
            '                    children: [{\n'+
            '                        label: "二级 3-1",\n'+
            '                        children: [{\n'+
            '                            label: "三级 3-1-1"\n'+
            '                        }]\n'+
            '                    }, {\n'+
            '                        label: "二级 3-2",\n'+
            '                        children: [{\n'+
            '                            label: "三级 3-2-1"\n'+
            '                        }]\n'+
            '                    }]\n'+
            '                }],\n'+
            '                defaultProps: {\n'+
            '                    children: "children",\n'+
            '                    label: "label"\n'+
            '                }\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            handleNodeClick: function(data) {\n'+
            '                console.log(data);\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return treeDemo;
});
!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("MessageBoxDemo", this, function() {
    'use strict';
    var messageBoxDemo = {
        path: '/messageBox',
        name: 'messageBox',
        head: {
            label: 'MessageBox 弹框',
            description: '模拟系统的消息提示框而实现的一套模态对话框组件。'
        },
        samples: [{
            id: 'messageBox1',
            label: '消息提示',
            description: '调用$alert方法即可打开消息提示，它模拟了系统的 alert，',
            template: '<div class="source"><vue-button type="text" @click="open">点击打开 Message Box</vue-button></div>',
            parameter: {
                methods: {
                  open: function() {
                    this.$alert("这是一段内容", "标题名称", {
                      confirmButtonText: "确定",
                      callback: function(action) {
                        console.log(action);
                      }
                    });
                  }
                }
            },
            code: '<vue-button type="text" @click="open">点击打开 Message Box</vue-button>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            open: function() {\n'+
            '                this.$alert("这是一段内容", "标题名称", {\n'+
            '                    confirmButtonText: "确定",\n'+
            '                    callback: function(action) {\n'+
            '                        console.log(action);\n'+
            '                    }\n'+
            '                });\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'messageBox2',
            label: '确认消息',
            description: '调用$confirm方法即可打开消息提示，它模拟了系统的 confirm。',
            template: '<div class="source"><vue-button type="text" @click="open">点击打开 Message Box</vue-button></div>',
            parameter: {
                methods: {
                  open: function() {
                    var self = this;
                    self.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning"
                    }).then(function() {
                      self.$alert("删除成功!");
                    }).catch(function() {
                      self.$alert("已取消删除!");
                    });
                  }
                }
            },
            code: '<vue-button type="text" @click="open">点击打开 Message Box</vue-button>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            open: function() {\n'+
            '                this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {\n'+
            '                    confirmButtonText: "确定",\n'+
            '                    cancelButtonText: "取消",\n'+
            '                    type: "warning",\n'+
            '                }).then(function() {\n'+
            '                        self.$alert("删除成功!");\n'+
            '                    });\n'+
            '                }).catch(function() {\n'+
            '                        self.$alert("已取消删除!");\n'+
            '                    });\n'+
            '                });\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return messageBoxDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("NotificationDemo", this, function() {
    'use strict';
    var notificationDemo = {
        path: '/notification',
        name: 'notification',
        head: {
            label: 'Notification 通知',
            description: '悬浮出现在页面右上角，显示全局的通知提醒消息。'
        },
        samples: [{
            id: 'notification1',
            label: '消息提示',
            description: '可以设置title字段和message字段，用于设置通知的标题和正文。默认情况下，经过一段时间后 Notification 组件会自动关闭，但是通过设置duration，可以控制关闭的时间间隔，如果设置为0，则不会自动关闭。有四种通知类型：success, warning, info, error。通过type字段来设置',
            template: '<div class="source"><vue-row class="margin-bottom20"><vue-col :span="6"><vue-button plain @click="open1">自动关闭</vue-button></vue-col><vue-col :span="6"><vue-button plain @click="open2">不自动关闭</vue-button></vue-col></vue-row><vue-row><vue-col :span="3"><vue-button plain @click="open3">成功</vue-button></vue-col><vue-col :span="3"><vue-button plain @click="open4">警告</vue-button></vue-col><vue-col :span="3"><vue-button plain @click="open5">信息</vue-button></vue-col><vue-col :span="3"><vue-button plain @click="open6">错误</vue-button></vue-col></vue-row></div>',
            parameter: {
                methods: {
                  open1: function () {
                    var h = this.$createElement;
                    this.$notify({
                      title : '关闭',
                      message : h('p', {
                        style : 'color: red'
                      }, '我会自动关闭')
                    });
                  },
                  open2: function () {
                    this.$notify({
                      title : '不关闭',
                      message : '我不会自动关闭',
                      duration : 0
                    });
                  },
                  open3: function () {
                    this.$notify({
                      title: '成功',
                      message: '我是成功消息',
                      type: 'success'
                    });
                  },
                  open4: function () {
                    this.$notify({
                        title: '警告',
                        message: '我是警告消息',
                        type: 'warning'
                    });
                  },
                  open5: function () {
                    this.$notify.info({
                        title: '信息',
                        message: '我是信息消息'
                    });
                  },
                  open6: function () {
                    this.$notify.error({
                        title: '错误',
                        message: '我是错误消息'
                    });
                  }
                }
            },
            code: '<vue-button plain @click="open1">自动关闭</vue-button>\n'+
            '<vue-button plain @click="open2">不自动关闭</vue-button>\n'+
            '<vue-button plain @click="open3">成功</vue-button>\n'+
            '<vue-button plain @click="open4">警告</vue-button>\n'+
            '<vue-button plain @click="open5">信息</vue-button>\n'+
            '<vue-button plain @click="open6">错误</vue-button>\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            open1: function() {\n'+
            '                var h = this.$createElement;\n'+
            '                this.$notify({\n'+
            '                    title : "关闭",\n'+
            '                    message: h("p", { style: "color: red"}, "我会自动关闭")\n'+
            '                });\n'+
            '            },\n'+
            '            open2: function() {\n'+
            '                this.$notify({\n'+
            '                    title : "不关闭",\n'+
            '                    message : "我不会自动关闭",\n'+
            '                    duration : 0\n'+
            '                });\n'+
            '            },\n'+
            '            open3: function() {\n'+
            '                this.$notify({\n'+
            '                    title : "成功",\n'+
            '                    message : "我是成功消息",\n'+
            '                    type : "success"\n'+
            '                });\n'+
            '            },\n'+
            '            open4: function() {\n'+
            '                this.$notify({\n'+
            '                    title : "警告",\n'+
            '                    message : "我是警告消息",\n'+
            '                    type : "warning"\n'+
            '                });\n'+
            '            },\n'+
            '            open5: function() {\n'+
            '                this.$notify.info({\n'+
            '                    title : "信息",\n'+
            '                    message : "我是信息消息",\n'+
            '                });\n'+
            '            },\n'+
            '            open6: function() {\n'+
            '                this.$notify.error({\n'+
            '                    title : "错误",\n'+
            '                    message : "我是错误消息",\n'+
            '                });\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'notification2',
            label: '消息位置',
            description: '可以设置position属性来定位，默认为"right-top"',
            template: '<div class="source"><vue-row class="margin-bottom20"><vue-col :span="8"><vue-button plain @click="open1">左上</vue-button></vue-col><vue-col :span="8"><vue-button plain @click="open2">上面</vue-button></vue-col><vue-col :span="8"><vue-button plain @click="open3">右上</vue-button></vue-col></vue-row><vue-row class="margin-bottom20"><vue-col :span="8"><vue-button plain @click="open4">左边</vue-button></vue-col><vue-col :span="8"><vue-button plain @click="open5">中间</vue-button></vue-col><vue-col :span="8"><vue-button plain @click="open6">右边</vue-button></vue-col></vue-row><vue-row><vue-col :span="8"><vue-button plain @click="open7">左下</vue-button></vue-col><vue-col :span="8"><vue-button plain @click="open8">下面</vue-button></vue-col><vue-col :span="8"><vue-button plain @click="open9">右下</vue-button></vue-col></vue-row></div>',
            parameter: {
                methods: {
                    open1: function() {
                        this.$notify.info({
                            message: '我在左上',
                            position: "left-top"
                        });
                    },
                    open2: function() {
                        this.$notify.info({
                            message: '我在上面',
                            position: "center-top"
                        });
                    },
                    open3: function() {
                        this.$notify.info({
                            message: '我在右上',
                            position: "right-top"
                        });
                    },
                    open4: function() {
                        this.$notify.info({
                            message: '我在左边',
                            position: "left-center"
                        });
                    },
                    open5: function() {
                        this.$notify.info({
                            message: '我在中间',
                            position: "center-center"
                        });
                    },
                    open6: function() {
                        this.$notify.info({
                            message: '我在右边',
                            position: "right-center"
                        });
                    },
                    open7: function() {
                        this.$notify.info({
                            message: '我在左下',
                            position: "left-bottom"
                        });
                    },
                    open8: function() {
                        this.$notify.info({
                            title: '信息',
                            message: '我在下面',
                            position: "center-bottom"
                        });
                    },
                    open9: function() {
                        this.$notify.info({
                            title: '信息',
                            message: '我在右下',
                            position: "right-bottom"
                        });
                    }
                }
            },
            code: '<vue-button plain @click="open1">左上</vue-button>\n'+
            '<vue-button plain @click="open2">上面</vue-button>\n'+
            '<vue-button plain @click="open3">右上</vue-button>\n'+
            '<vue-button plain @click="open4">左边</vue-button>\n'+
            '<vue-button plain @click="open5">中间</vue-button>\n'+
            '<vue-button plain @click="open6">右边</vue-button>\n'+
            '<vue-button plain @click="open7">左下</vue-button>\n'+
            '<vue-button plain @click="open8">下面</vue-button>\n'+
            '<vue-button plain @click="open9">右下</vue-button>\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            open1: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在左上",\n'+
            '                    position: "left-top"\n'+
            '                });\n'+
            '            },\n'+
            '            open2: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在上面",\n'+
            '                    position: "center-top"\n'+
            '                });\n'+
            '            },\n'+
            '            open3: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在右上",\n'+
            '                    position: "right-top"\n'+
            '                });\n'+
            '            },\n'+
            '            open4: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在左边",\n'+
            '                    position: "left-center"\n'+
            '                });\n'+
            '            },\n'+
            '            open5: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在中间",\n'+
            '                    position: "center-center"\n'+
            '                });\n'+
            '            },\n'+
            '            open6: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在右边",\n'+
            '                    position: "right-center"\n'+
            '                });\n'+
            '            },\n'+
            '            open7: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在左下",\n'+
            '                    position: "left-bottom"\n'+
            '                });\n'+
            '            },\n'+
            '            open8: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在下面",\n'+
            '                    position: "center-bottom"\n'+
            '                });\n'+
            '            },\n'+
            '            open9: function() {\n'+
            '                this.$notify.info({\n'+
            '                    message : "我在右下",\n'+
            '                    position: "right-bottom"\n'+
            '                });\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return notificationDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(['VueUtil'], definition);
    } else {
        context[name] = definition(context["VueUtil"]);
    }
})("I18nDemo", this, function(VueUtil) {
    'use strict';
    var i18nDemo = {
        path: '/i18n',
        name: 'i18n',
        head: {
            label: 'i18n.label',
            description: ''
        },
        samples: [{
            id: 'i18n1',
            label: 'i18n.samples1.label',
            description: 'i18n.samples1.description',
            template: '<div class="source"><vue-row ><vue-col :span="6"><vue-button plain @click="clickHandle1">{{$t(\'button.label1\')}}</vue-button></vue-col><vue-col :span="6"><vue-button plain @click="clickHandle2">{{$t(\'button.label2\')}}</vue-button></vue-col></vue-row></div>',
            parameter: {
              mounted: function () {
                var locales = {
                        zh: {
                            button: {
                                label1: '中文',
                                label2: '日文',
                                label3: '英文'
                            }
                        },
                        ja: {
                            button: {
                                label1: '中国語',
                                label2: '日本語',
                                label3: '英語'
                            }
                        }
                    };
                VueUtil.setLocale('zh', locales.zh);
                VueUtil.setLocale('ja', locales.ja);
              },
                methods: {
                  clickHandle1: function () {
                      VueUtil.setLang('zh');
                  },
                  clickHandle2: function () {
                      VueUtil.setLang('ja');
                  }
                }
            },
            code: '<vue-button plain @click="clickHandle1">{{$t(\'button.label1\')}}</vue-button>\n'+
            '<vue-button plain @click="clickHandle2">{{$t(\'button.label2\')}}</vue-button>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        mounted: function() {\n'+
            '            var locales = {\n'+
            '                zh: {\n'+
            '                    button: {\n'+
            '                        label1: "中文",\n'+
            '                        label2: "日文"\n'+
            '                    }\n'+
            '                },\n'+
            '                ja: {\n'+
            '                    button: {\n'+
            '                        label1: "中国語",\n'+
            '                        label2: "日本語"\n'+
            '                    }\n'+
            '                }\n'+
            '            };\n'+
            '            VueUtil.setLocale("zh", locales.zh);\n'+
            '            VueUtil.setLocale("ja", locales.ja);\n'+
            '        },\n'+
            '        methods: {\n'+
            '            clickHandle1: function() {\n'+
            '                VueUtil.setLang("zh");\n'+
            '            },\n'+
            '            clickHandle2: function() {\n'+
            '                VueUtil.setLang("ja");\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return i18nDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("CollapseDemo", this, function() {
    'use strict';
    var collapseDemo = {
        path: '/collapse',
        name: 'collapse',
        head: {
            label: 'Collapse 折叠面板',
            description: '通过折叠面板收纳内容区域'
        },
        samples: [{
            id: 'collapse1',
            label: '基本用法',
            description: '可同时展开多个面板，面板之间不影响',
            template: '<div class="source"><vue-collapse v-model="activeNames"><vue-collapse-item title="一致性 Consistency" name="1"><div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div><div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div></vue-collapse-item><vue-collapse-item title="反馈 Feedback" name="2"><div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div><div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div></vue-collapse-item><vue-collapse-item title="效率 Efficiency" name="3"><div>简化流程：设计简洁直观的操作流程；</div><div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div><div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div></vue-collapse-item><vue-collapse-item title="可控 Controllability" name="4"><div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div><div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div></vue-collapse-item></vue-collapse></div>',
            parameter: {
                data: function() {
                  return {
                    activeNames: ['1']
                  }
                }
            },
            code: '<vue-collapse v-model="activeNames">\n'+
            '    <vue-collapse-item title="一致性 Consistency" name="1">\n'+
            '        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>\n'+
            '        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>\n'+
            '    </vue-collapse-item>\n'+
            '    <vue-collapse-item title="反馈 Feedback" name="2">\n'+
            '        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>\n'+
            '        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>\n'+
            '    </vue-collapse-item>\n'+
            '    <vue-collapse-item title="效率 Efficiency" name="3">\n'+
            '        <div>简化流程：设计简洁直观的操作流程；</div>\n'+
            '        <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>\n'+
            '        <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>\n'+
            '    </vue-collapse-item>\n'+
            '    <vue-collapse-item title="可控 Controllability" name="4">\n'+
            '        <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>\n'+
            '        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>\n'+
            '    </vue-collapse-item>\n'+
            '</vue-collapse>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return: {\n'+
            '                activeNames: [\'1\']\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'collapse2',
            label: '手风琴效果',
            description: '每次只能展开一个面板, 通过 accordion 属性来设置是否以手风琴模式显示',
            template: '<div class="source"><vue-collapse v-model="activeNames" accordion><vue-collapse-item title="一致性 Consistency" name="1"><div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div><div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div></vue-collapse-item><vue-collapse-item title="反馈 Feedback" name="2"><div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div><div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div></vue-collapse-item><vue-collapse-item title="效率 Efficiency" name="3"><div>简化流程：设计简洁直观的操作流程；</div><div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div><div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div></vue-collapse-item><vue-collapse-item title="可控 Controllability" name="4"><div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div><div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div></vue-collapse-item></vue-collapse></div>',
            parameter: {
                data: function() {
                  return {
                    activeNames: ['1']
                  }
                }
            },
            code: '<vue-collapse v-model="activeNames" accordion>\n'+
            '    <vue-collapse-item title="一致性 Consistency" name="1">\n'+
            '        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>\n'+
            '        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>\n'+
            '    </vue-collapse-item>\n'+
            '    <vue-collapse-item title="反馈 Feedback" name="2">\n'+
            '        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>\n'+
            '        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>\n'+
            '    </vue-collapse-item>\n'+
            '    <vue-collapse-item title="效率 Efficiency" name="3">\n'+
            '        <div>简化流程：设计简洁直观的操作流程；</div>\n'+
            '        <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>\n'+
            '        <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>\n'+
            '    </vue-collapse-item>\n'+
            '    <vue-collapse-item title="可控 Controllability" name="4">\n'+
            '        <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>\n'+
            '        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>\n'+
            '    </vue-collapse-item>\n'+
            '</vue-collapse>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return: {\n'+
            '                activeNames: [\'1\']\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return collapseDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("BadgeDemo", this, function() {
    'use strict';
    var badgeDemo = {
        path: '/badge',
        name: 'badge',
        head: {
            label: 'Badge 标记',
            description: '出现在按钮、图标旁的数字或状态标记。'
        },
        samples: [{
            id: 'badge1',
            label: '基础用法',
            description: '定义value属性，它接受Number或者String。最大值由max属性定义，它接受一个Number，只有当value为Number时，它才会生效。设置is-dot属性以红点的形式标注',
            template: '<div class="source"><vue-row><vue-col :span="4"><vue-badge :value="12"><vue-button size="small">评论</vue-button></vue-badge></vue-col><vue-col :span="4"><vue-badge :value="100" :max="99"><vue-button size="small">查看</vue-button></vue-badge></vue-col><vue-col :span="4"><vue-badge value="new"><vue-button size="small">新闻</vue-button></vue-badge></vue-col><vue-col :span="4"><vue-badge is-dot><vue-button size="small">消息</vue-button></vue-badge></vue-col><vue-col :span="4"><vue-badge :value="12"></vue-badge></vue-col></vue-row></div>',
            code: '<vue-badge :value="12">\n'+
            '    <vue-button size="small">评论</vue-button>\n'+
            '</vue-badge>\n'+
            '<vue-badge :value="100" :max="99">\n'+
            '    <vue-button size="small">查看</vue-button>\n'+
            '</vue-badge>\n'+
            '<vue-badge value="new">\n'+
            '    <vue-button size="small">新闻</vue-button>\n'+
            '</vue-badge>\n'+
            '<vue-badge is-dot>\n'+
            '    <vue-button size="small">消息</vue-button>\n'+
            '</vue-badge>\n'+
            '<vue-badge :value="12">\n'+
            '</vue-badge>'
        }]
    };
    return badgeDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(['Vue'], definition);
    } else {
        context[name] = definition(context['Vue']);
    }
})("InstallDemo", this, function(Vue) {
    'use strict';
    var installDemo = {
        path: '/install',
        name: 'install',
        head: {
            label: 'install.label',
            description: ''
        },
        samples: [{
            id: 'install1',
            label: 'install.samples1.label',
            description: 'install.samples1.description',
            collapse: ["item1"],
            notshowblock: true,
            code: '<!-- import css -->\n'+
            '<link rel="stylesheet" href="./css/component.min.css">\n'+
            '<!-- import Vue -->\n'+
            '<script src="./js/vue-all.min.js"></script>\n'+
            '<!-- import component -->\n'+
            '<script src="./js/vue-component-all.min.js"></script>\n'
        },{
            id: 'install2',
            label: 'Hello world',
            description: 'install.samples2.description',
            collapse:  ["item1"],
            notshowblock: true,
            code: '<!DOCTYPE html>\n'+
            '<html>\n'+
            '<head>\n'+
            '    <meta charset="UTF-8">\n'+
            '    <!-- import css -->\n'+
            '    <link rel="stylesheet" href="./css/component.min.css">\n'+
            '</head>\n'+
            '<body>\n'+
            '    <div id="app">\n'+
            '        <vue-button @click="visible = true">OK</vue-button>\n'+
            '        <vue-dialog v-model="visible" title="Hello world" show-close>\n'+
            '            <p>Welcome</p>\n'+
            '        </vue-dialog>\n'+
            '    </div>\n'+
            '</body>\n'+
            '<!-- import Vue -->\n'+
            '<script src="./js/vue-all.min.js"></script>\n'+
            '<!-- import component -->\n'+
            '<script src="./js/vue-component-all.min.js"></script>\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return { visible: false }\n'+
            '        }\n'+
            '    }).$mount("#app");\n'+
            '</script>\n'+
            '</html>'
        }, {
            id: 'install3',
            label: 'VueUtil',
            description: 'install.samples3.description',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.usage\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: ".on(element, events, handler)",
                        column2: "install.samples3.row1column2",
                        column3: "VueUtil.on(element,'click', fn)"
                    },{
                        column1: ".off(element, events, handler)",
                        column2: "install.samples3.row2column2",
                        column3: "VueUtil.off(element,'click', fn)"
                    },{
                        column1: ".once(element, events, handler)",
                        column2: "install.samples3.row3column2",
                        column3: "VueUtil.once(element,'click', fn)"
                    },{
                        column1: ".hasClass(element, className)",
                        column2: "install.samples3.row4column2",
                        column3: "VueUtil.hasClass(element, 'vue-class')"
                    },{
                        column1: ".addClass(element, className)",
                        column2: "install.samples3.row5column2",
                        column3: "VueUtil.addClass(element, 'vue-class')"
                    },{
                        column1: ".removeClass(element, className)",
                        column2: "install.samples3.row6column2",
                        column3: "VueUtil.removeClass(element, 'vue-class')"
                    },{
                        column1: ".getStyle(element, styleName)",
                        column2: "install.samples3.row7column2",
                        column3: "VueUtil.getStyle(element, 'display')"
                    },{
                        column1: ".setStyle(element, styleName, value)",
                        column2: "install.samples3.row8column2",
                        column3: "VueUtil.setStyle(element, 'display', 'none')"
                    },{
                        column1: ".merge(dest,src1,src2,src3...)",
                        column2: "install.samples3.row9column2",
                        column3: "VueUtil.merge({}, {name:'Tom',age:21},{name:'Jerry',sex:'Boy'}) //result={name:'Jerry',age:21,sex:'Boy'}"
                    },{
                        column1: ".addResizeListener(element, fn)",
                        column2: "install.samples3.row10column2",
                        column3: "VueUtil.addResizeListener(element, fn)"
                    },{
                        column1: ".removeResizeListener(element, fn)",
                        column2: "install.samples3.row11column2",
                        column3: "VueUtil.removeResizeListener(element, fn)"
                    },{
                        column1: ".parseDate(string, format)",
                        column2: "install.samples3.row12column2",
                        column3: "VueUtil.parseDate('31/01/2017', 'dd/MM/yyyy')"
                    },{
                        column1: ".formatDate(date, format)",
                        column2: "install.samples3.row13column2",
                        column3: "VueUtil.formatDate(new Date, 'dd/MM/yyyy')"
                    },{
                        column1: ".isDate(src)",
                        column2: "install.samples3.row14column2",
                        column3: "VueUtil.isDate('2017-01-01')"
                    },{
                        column1: ".toDate(src)",
                        column2: "install.samples3.row15column2",
                        column3: "VueUtil.toDate('2017-01-01')"
                    },{
                        column1: ".setLang(lang)",
                        column2: "install.samples3.row16column2",
                        column3: "VueUtil.setLang('zh')"
                    },{
                        column1: ".setLocale(lang)",
                        column2: "install.samples3.row17column2",
                        column3: "VueUtil.setLocale('en', {label1: \'English\'})"
                    },{
                        column1: ".removeNode(node)",
                        column2: "install.samples3.row18column2",
                        column3: "VueUtil.removeNode(element)"
                    },{
                        column1: ".insertNodeAt(fatherNode, node, position)",
                        column2: "install.samples3.row19column2",
                        column3: "VueUtil.insertNodeAt(body,element,3)"
                    },{
                        column1: ".arrayToObject(arr)",
                        column2: "install.samples3.row20column2",
                        column3: "VueUtil.arrayToObject([{name:'Tom',age:21},{name:'Jerry',sex:'Boy'}])"
                    },{
                        column1: ".screenfull()",
                        column2: "install.samples3.row21column2",
                        column3: "VueUtil.screenfull()"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return installDemo;
});
!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("BreadcrumbDemo", this, function() {
    'use strict';
    var breadcrumbDemo = {
        path: '/breadcrumb',
        name: 'breadcrumb',
        head: {
            label: 'Breadcrumb 面包屑',
            description: '显示当前页面的路径，快速返回之前的任意页面。'
        },
        samples: [{
            id: 'breadcrumb1',
            label: '基础用法',
            description: '设置 separator 属性，来改变分隔符,默认为斜杠\'/\'',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">默认分隔符</span></vue-col><vue-col :span="16"><vue-breadcrumb class="demonstration"><vue-breadcrumb-item>组件列表</vue-breadcrumb-item><vue-breadcrumb-item>Breadcrumb</vue-breadcrumb-item></vue-breadcrumb></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">设置分隔符</span></vue-col><vue-col :span="16"><vue-breadcrumb separator="—" class="demonstration"><vue-breadcrumb-item>开发指南</vue-breadcrumb-item><vue-breadcrumb-item>快速上手</vue-breadcrumb-item></vue-breadcrumb></vue-col></vue-row></div>',
            code: '<span class="demonstration">默认分隔符</span>\n'+
            '<vue-breadcrumb>\n'+
            '    <vue-breadcrumb-item>组件列表</vue-breadcrumb-item>\n'+
            '    <vue-breadcrumb-item>Breadcrumb</vue-breadcrumb-item>\n'+
            '</vue-breadcrumb>\n'+
            '<span class="demonstration">设置分隔符</span>\n'+
            '<vue-breadcrumb separator="—">\n'+
            '    <vue-breadcrumb-item>开发指南</vue-breadcrumb-item>\n'+
            '    <vue-breadcrumb-item>快速上手</vue-breadcrumb-item>\n'+
            '</vue-breadcrumb>'
        }]
    };
    return breadcrumbDemo;
});

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

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("ProgressDemo", this, function() {
    'use strict';
    var progressDemo = {
        path: '/progress',
        name: 'progress',
        head: {
            label: 'Progress 进度条',
            description: '用于展示操作进度，告知用户当前状态和预期。'
        },
        samples: [{
            id: 'progress1',
            label: '基础用法',
            description: '设置percentage属性即可，表示进度条对应的百分比, 可通过 stroke-width 属性更改进度条的高度，并可通过 text-inside 属性来将进度条描述置于进度条内部。可通过 type 属性来指定使用环形进度条，在环形进度条中，还可以通过 width 属性来设置其大小。',
            template: '<div class="source"><vue-row class="margin-bottom20"><vue-progress :percentage="0"></vue-progress></vue-row><vue-row class="margin-bottom20"><vue-progress :percentage="50" status="exception"></vue-progress></vue-row><vue-row class="margin-bottom20"><vue-progress :text-inside="true" :stroke-width="18" :percentage="70"></vue-progress></vue-row><vue-row><vue-progress type="circle" :percentage="100" status="success"></vue-progress></vue-row></div>',
            code: '<vue-progress :percentage="0"></vue-progress>\n'+
            '<vue-progress :percentage="50" status="exception"></vue-progress>\n'+
            '<vue-progress :text-inside="true" :stroke-width="18" :percentage="70"></vue-progress>\n'+
            '<vue-progress type="circle" :percentage="100" status="success"></vue-progress>\n'
        }]
    };
    return progressDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("SliderDemo", this, function() {
    'use strict';
    var sliderDemo = {
        path: '/slider',
        name: 'slider',
        head: {
            label: 'Slider 滑块',
            description: '通过拖动滑块在一个固定区间内进行选择。'
        },
        samples: [{
            id: 'slider1',
            label: '基础用法',
            description: '通过设置绑定值自定义滑块的初始值。',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">默认</span></vue-col><vue-col :span="16"><vue-slider v-model="value1"></vue-slider></vue-col></vue-row><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">自定义初始值</span></vue-col><vue-col :span="16"><vue-slider v-model="value2"></vue-slider></vue-col></vue-row><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">隐藏 Tooltip</span></vue-col><vue-col :span="16"><vue-slider v-model="value3" :show-tooltip="false"></vue-slider></vue-col></vue-row><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">格式化 Tooltip</span></vue-col><vue-col :span="16"><vue-slider v-model="value4" :format-tooltip="formatTooltip"></vue-slider></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">禁用</span></vue-col><vue-col :span="16"><vue-slider v-model="value5" disabled></vue-slider></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        value1: 0,
                        value2: 50,
                        value3: 36,
                        value4: 48,
                        value5: 42
                    }
                },
                methods: {
                    formatTooltip: function(val) {
                      return val / 100;
                    }
                  }
            },
            code: '<span class="demonstration">默认</span>\n'+
            '<vue-slider v-model="value1"></vue-slider>\n'+
            '<span class="demonstration">自定义初始值</span>\n'+
            '<vue-slider v-model="value2"></vue-slider>\n'+
            '<span class="demonstration">隐藏 Tooltip</span>\n'+
            '<vue-slider v-model="value3" :show-tooltip="false"></vue-slider>\n'+
            '<span class="demonstration">格式化 Tooltip</span>\n'+
            '<vue-slider v-model="value4" :format-tooltip="formatTooltip"></vue-slider>\n'+
            '<span class="demonstration">禁用</span>\n'+
            '<vue-slider v-model="value5" disabled></vue-slider>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return: {\n'+
            '                value1: 0,\n'+
            '                value2: 50,\n'+
            '                value3: 36,\n'+
            '                value4: 48,\n'+
            '                value5: 42\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            formatTooltip: function(val) {\n'+
            '                return val / 100;\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return sliderDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("RateDemo", this, function() {
    'use strict';
    var rateDemo = {
        path: '/rate',
        name: 'rate',
        head: {
            label: 'Rate 评分',
            description: '出现在按钮、图标旁的数字或状态标记。'
        },
        samples: [{
            id: 'rate1',
            label: '基础用法',
            description: '评分被分为三个等级，可以利用颜色对分数及情感倾向进行分级（默认情况下不区分颜色）。三个等级所对应的颜色用过colors属性设置',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">默认不区分颜色</span></vue-col><vue-col :span="16"><vue-rate v-model="value1" class="demonstration"></vue-rate></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">区分颜色</span></vue-col><vue-col :span="16"><vue-rate v-model="value2" class="demonstration" :colors="[\'#99A9BF\', \'#F7BA2A\', \'#FF99FF\']"></vue-rate></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        value1: 0,
                        value2: 0
                    }
                }
            },
            code: '<span class="demonstration">默认不区分颜色</span>\n'+
            '<vue-rate v-model="value1"></vue-rate>\n'+
            '<span class="demonstration">区分颜色</span>\n'+
            '<vue-rate v-model="value2" :colors="[\'#99A9BF\', \'#F7BA2A\', \'#FF99FF\']"></vue-rate>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return: {\n'+
            '                value1: 0,\n'+
            '                value2: 0\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return rateDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("UploadDemo", this, function() {
    'use strict';
    var uploadDemo = {
        path: '/upload',
        name: 'upload',
        head: {
            label: 'Upload 上传',
            description: '通过点击或者拖拽上传文件。'
        },
        samples: [{
            id: 'upload1',
            label: '点击上传',
            description: '通过 slot 你可以传入自定义的上传按钮类型和文字提示。',
            template: '<div class="source"><vue-upload :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" ><vue-button size="small" type="primary">点击上传</vue-button><div slot="tip" class="vue-upload__tip">只能上传txt文件，且不超过2MB</div></vue-upload></div>',
            parameter: {
                methods: {
                    handleRemove: function(file, fileList) {
                        console.log(file);
                        console.log(fileList);
                    },
                    handlePreview: function(file) {
                        console.log(file);
                    },
                    beforeAvatarUpload: function(file) {
                        var isTXT = file.type === 'text/plain';
                        var isLt2M = file.size / 1024 / 1024 < 2;
                        if (!isTXT) {
                          this.$notify.error('上传文件只能是 txt 格式!');
                        }
                        if (!isLt2M) {
                          this.$notify.error('上传文件大小不能超过 2MB!');
                        }
                        return isTXT && isLt2M;
                      }
                  }
            },
            code: '<vue-upload :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload">\n'+
            '    <vue-button size="small" type="primary">点击上传</vue-button>\n'+
            '    <div slot="tip" class="vue-upload__tip">只能上传txt文件，且不超过2MB</div>\n'+
            '</vue-upload>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return: {\n'+
            '                dialogImageUrl: "",\n'+
            '                dialogVisible: false\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            handleRemove: function(file, fileList) {\n'+
            '                console.log(file);\n'+
            '                console.log(fileList);\n'+
            '            },\n'+
            '            handlePreview: function(file) {\n'+
            '                console.log(file);\n'+
            '            },\n'+
            '            beforeAvatarUpload: function(file, fileList) {\n'+
            '                var isTXT = file.type === "text/plain";\n'+
            '                var isLt2M = file.size / 1024 / 1024 < 2;\n'+
            '                if (!isTXT) {\n'+
            '                    this.$notify.error(\'上传文件只能是 txt 格式!\');\n'+
            '                }\n'+
            '                if (!isLt2M) {\n'+
            '                    this.$notify.error(\'上传文件大小不能超过 2MB!\');\n'+
            '                }\n'+
            '                return isTXT && isLt2M;\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'upload2',
            label: '照片墙',
            description: '使用 list-type 属性来设置文件列表的样式。',
            template: '<div class="source"><vue-upload list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload"><i class="vue-icon-plus"></i></vue-upload><vue-dialog v-model="dialogVisible" show-close><img width="100%" :src="dialogImageUrl" alt=""></vue-dialog></div>',
            parameter: {
                data: function() {
                    return {
                      dialogImageUrl: '',
                      dialogVisible: false
                    }
                },
                methods: {
                    handleRemove: function(file, fileList) {
                        console.log(file);
                        console.log(fileList);
                    },
                    handlePictureCardPreview: function(file) {
                        this.dialogImageUrl = file.url;
                        this.dialogVisible = true;
                    },
                    beforeAvatarUpload: function(file) {
                        var isJPG = file.type === 'image/jpeg';
                        if (!isJPG) {
                          this.$notify.error('上传文件只能是 JPG 格式!');
                        }
                        return isJPG;
                      }
                  }
            },
            code: '<vue-upload list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload">\n'+
            '    <i class="vue-icon-plus"></i>\n'+
            '</vue-upload>\n'+
            '<vue-dialog v-model="dialogVisible" show-close>\n'+
            '    <img width="100%" :src="dialogImageUrl" alt="">\n'+
            '</vue-dialog>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function() {\n'+
            '            return: {\n'+
            '                dialogImageUrl: "",\n'+
            '                dialogVisible: false\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            handleRemove: function(file, fileList) {\n'+
            '                console.log(file);\n'+
            '                console.log(fileList);\n'+
            '            },\n'+
            '            handlePictureCardPreview: function(file) {\n'+
            '                this.dialogImageUrl = file.url;\n'+
            '                this.dialogVisible = true;\n'+
            '            },\n'+
            '            beforeAvatarUpload: function(file, fileList) {\n'+
            '                var isJPG = file.type === "image/jpeg";\n'+
            '                if (!isJPG) {\n'+
            '                    this.$notify.error(\'上传文件只能是 JPG 格式!\');\n'+
            '                }\n'+
            '                return isJPG;\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return uploadDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("LoadingBarDemo", this, function() {
    'use strict';
    var loadingBarDemo = {
        path: '/loadingBar',
        name: 'loadingBar',
        head: {
            label: 'LoadingBar 加载进度条',
            description: '全局创建一个显示页面加载、异步请求、文件上传等的加载进度条。'
        },
        samples: [{
            id: 'loadingBar1',
            label: '基础用法',
            description: '点击 Start 开始进度，点击 Finish 结束。在调用start()方法后，组件会自动模拟进度，当调用finish()或error()时，补全进度并自动消失。',
            template: '<div class="source"><vue-button @click="start">Start</vue-button><vue-button @click="finish">Finish</vue-button><vue-button @click="error">Error</vue-button></div>',
            parameter: {
                methods: {
                    start: function() {
                        this.$Loading.start();
                    },
                    finish: function() {
                        this.$Loading.finish();
                    },
                    error: function() {
                        this.$Loading.error();
                    }
                }
            },
            code: '<vue-button @click="start">Start</vue-button>\n'+
            '<vue-button @click="finish">Finish</vue-button>\n'+
            '<vue-button @click="error">Error</vue-button>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            start: function() {\n'+
            '                this.$Loading.start();\n'+
            '            },\n'+
            '            finish: function() {\n'+
            '                this.$Loading.finish();\n'+
            '            },\n'+
            '            error: function() {\n'+
            '                this.$Loading.error();\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return loadingBarDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("NoteDemo", this, function() {
    'use strict';
    var noteDemo = {
        path: '/note',
        name: 'note',
        head: {
            label: 'Note 笔记',
            description: '用于页面中展示信息。'
        },
        samples: [{
            id: 'note1',
            label: '基础用法',
            description: '组件提供四种主题，由type属性指定，默认值为info。',
            template: '<div class="source"><vue-note title="成功提示的文案" type="success">文字说明...</vue-note><vue-note title="消息提示的文案">文字说明...</vue-note><vue-note title="警告提示的文案" type="warning">文字说明...</vue-note><vue-note title="错误提示的文案" type="error">文字说明...</vue-note><vue-note box title="成功提示的文案" type="success">文字说明...</vue-note><vue-note box title="消息提示的文案">文字说明...</vue-note><vue-note box title="警告提示的文案" type="warning">文字说明...</vue-note><vue-note box title="错误提示的文案" type="error">文字说明...</vue-note></div>',
            code: '<vue-note title="成功提示的文案" type="success" title="成功提示的文案">文字说明...</vue-note>\n<vue-note title="消息提示的文案">文字说明...</vue-note>\n<vue-note title="警告提示的文案" type="warning">文字说明...</vue-note>\n<vue-note title="错误提示的文案" type="error">文字说明...</vue-note>\n<vue-note box title="成功提示的文案" type="success">文字说明...</vue-note>\n<vue-note box title="消息提示的文案">文字说明...</vue-note>\n<vue-note box title="警告提示的文案" type="warning">文字说明...</vue-note>\n<vue-note box title="错误提示的文案" type="error">文字说明...</vue-note>'
        }]
    };
    return noteDemo;
});
!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("SortableDemo", this, function() {
    'use strict';
    var sortableDemo = {
        path: '/sortable',
        name: 'sortable',
        head: {
            label: 'Sortable 拖拽排序',
            description: '使用鼠标调整列表中或者网格中元素的排序。'
        },
        samples: [{
            id: 'sortable1',
            label: '基础用法',
            description: '属性element设置sortable的容器, 可以绑定事件"start", "end", "add", "remove", "update"',
            template: '<div class="source"><vue-row><vue-col :span="8"><vue-sortable element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions" @end="endHandle" @start="startHandle"><vue-note type="error" >list1-test1</vue-note><vue-note type="error" style="margin: 0 0 5px 0;">list1-test2</vue-note></vue-sortable></vue-col><vue-col :span="8"><vue-sortable element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions" @end="endHandle" @start="startHandle"><vue-note style="margin: 0 0 5px 0;">list2-test1</vue-note></vue-sortable></vue-col><vue-col :span="8"><vue-sortable element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions" @end="endHandle" @start="startHandle"></vue-sortable></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        sortOptions: {
                            group: 'mysortable'
                        }
                    }
                },
                methods: {
                    endHandle: function(e) {
                        console.log('end');
                    },
                    startHandle: function(e) {
                        console.log('start');
                    }
                }
            },
            code: '<vue-sortable element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions" @end="endHandle" @start="startHandle">\n'+
            '    <vue-note type="error">list1-test1</vue-note>\n'+
            '    <vue-note type="error">list1-test2</vue-note>\n'+
            '</vue-sortable>\n'+
            '<vue-sortable element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions" @end="endHandle" @start="startHandle">\n'+
            '    <vue-note>list2-test1</vue-note>\n'+
            '</vue-sortable>\n'+
            '<vue-sortable element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions" @end="endHandle" @start="startHandle">\n'+
            '</vue-sortable>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                sortOptions: {group: \'mysortable\'}\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            endHandle: function(e) {\n'+
            '                console.log("end");\n'+
            '            },\n'+
            '            startHandle: function(e) {\n'+
            '                console.log("start");\n'+
            '            }\n'+
            '    }).$mount();\n'+
            '</script>'
        },{
            id: 'sortable2',
            label: '绑定数据',
            description: '绑定数据后根据数据进行拖动, 可设置"move"属性来绑定事件',
            template: '<div class="source"><vue-row><vue-col :span="8"><vue-sortable v-model="list1" element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;"  :move="moveHandle" :options="sortOptions"><vue-note type="error" v-for="(element, index) in list1" :key="index" >{{element.name}}</vue-note></vue-sortable></vue-col><vue-col :span="8"><vue-sortable v-model="list2" element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions"><vue-note v-for="(element, index) in list2" :key="index" >{{element.name}}</vue-note></vue-sortable></vue-col><vue-col :span="8"><vue-sortable v-model="list3" element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions"><vue-note type="success" v-for="(element, index) in list3" :key="index" >{{element.name}}</vue-note></vue-sortable></vue-col></vue-row><vue-row>list1: {{list1}}</vue-row><vue-row>list2: {{list2}}</vue-row><vue-row>list3: {{list3}}</vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        sortOptions: {
                            group: 'mysortable'
                        },
                        list1: [
                          { id: 11, name: 'list1-test1'},
                          { id: 12, name: 'list1-test2'}
                        ],
                        list2: [
                          { id: 21, name: 'list2-test1'}
                        ],
                        list3: [
                        ],
                        moveHandle: function(e) {
                            console.log('move')
                        }
                    }
                }
            },
            code: '<vue-sortable v-model="list1" element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions">\n'+
            '    <vue-note type="error" v-for="(element, index) in list1" :key="index">{{element.name}}</vue-note>\n'+
            '</vue-sortable>\n'+
            '<vue-sortable v-model="list2" element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions">\n'+
            '    <vue-note v-for="(element, index) in list2" :key="index">{{element.name}}</vue-note>\n'+
            '</vue-sortable>\n'+
            '<vue-sortable v-model="list3" element="div" style="border: 1px solid;border-radius: 1px; min-height:180px;" :options="sortOptions">\n'+
            '    <vue-note type="success" v-for="(element, index) in list3" :key="index">{{element.name}}</vue-note>\n'+
            '</vue-sortable>\n'+
            '<vue-row>list1: {{list1}}</vue-row>\n'+
            '<vue-row>list2: {{list2}}</vue-row>\n'+
            '<vue-row>list3: {{list3}}</vue-row>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                sortOptions: {group: \'mysortable\'},\n'+
            '                list1: [{ id: 11, name: \'list1-test1\'}, { id: 12, name: \'list1-test2\'}]\n'+
            '                list2: [{ id: 21, name: \'list2-test1\'}]\n'+
            '                list3: [],\n'+
            '                moveHandle: function(e) {\n'+
            '                    console.log("move")\n'+
            '                }\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }]
    };
    return sortableDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("ListDemo", this, function() {
    'use strict';
    var listDemo = {
        path: '/list',
        name: 'list',
        head: {
            label: 'List 列表',
            description: '用于相似元素信息的展示。'
        },
        samples: [{
            id: 'list1',
            label: '基础用法',
            description: '通过height属性设置list高度, 通过<vue-divider>控件来追加item间的分隔线',
            template: '<div class="source"><vue-list height="300"><vue-list-item v-for="index of 100" :index="index" :key="index" @select="selectHandle(index)"><div>第{{index}}行 文字说明...</div><vue-divider v-if="index!==100"></vue-divider></vue-list-item></vue-list></div>',
            parameter: {
                methods: {
                    selectHandle: function(index) {
                        console.log(index);
                    }
                }
            },
            code: '<vue-list height="300">\n    <vue-list-item v-for="index of 100" :index="index" :key="index" @select="selectHandle(index)">\n        <div>第{{index}}行 文字说明...</div>\n        <vue-divider v-if="index!==100"></vue-divider>\n    </vue-list-item>\n</vue-list>\n\n<script>\n    new Vue({\n        methods: {\n            selectHandle: function(index) {\n                console.log(index);\n            }\n        }\n    }).$mount();\n</script>'
        }]
    };
    return listDemo;
});
!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("ColorDemo", this, function() {
    'use strict';
    var colorDemo = {
        path: '/color',
        name: 'color',
        head: {
            label: 'ColorPicker 颜色选择器',
            description: '用于颜色选择，支持多种格式。'
        },
        samples: [{
            id: 'color1',
            label: '基础用法',
            description: '使用 v-model 与 Vue 实例中的一个变量进行双向绑定，绑定的变量需要是字符串类型。',
            template: '<div class="source"><vue-row class="margin-bottom20" type="flex" justify="center"><vue-col :span="6"><span class="demonstration">有默认值</span></vue-col><vue-col :span="16"><vue-color-picker v-model="color1"></vue-color-picker></vue-col></vue-row><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">无默认值</span></vue-col><vue-col :span="16"><vue-color-picker v-model="color2"></vue-color-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                      color1: '#20a0ff',
                      color2: null
                  }
                }
            },
            code: '<span class="demonstration">有默认值</span>\n'+
            '<vue-date-picker v-model="color1"></vue-date-picker>\n'+
            '<span class="demonstration">无默认值</span>\n'+
            '<vue-date-picker v-model="color2"></vue-date-picker>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                color1: "20a0ff",\n'+
            '                color2: null\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'color2',
            label: '选择透明度',
            description: 'ColorPicker 支持普通颜色，也支持带 Alpha 通道的颜色，通过show-alpha属性即可控制是否支持透明度的选择。',
            template: '<div class="source"><vue-row type="flex" justify="center"><vue-col :span="6"><span class="demonstration">持透明度的选择</span></vue-col><vue-col :span="16"><vue-color-picker v-model="color1" show-alpha></vue-color-picker></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                  return {
                      color1: 'rgba(19, 206, 102, 0.8)'
                  }
                }
            },
            code: '<span class="demonstration">持透明度的选择</span>\n'+
            '<vue-date-picker v-model="color1" show-alpha></vue-date-picker>\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                color1: "rgba(19, 206, 102, 0.8)"\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'color3',
            label: 'Attributes',
            template: '<vue-table class="api" :data="tableData" border stripe style="width: 100%"><vue-table-column prop="column1" label="参数"></vue-table-column><vue-table-column prop="column2" label="说明"></vue-table-column><vue-table-column prop="column3" label="类型"></vue-table-column><vue-table-column prop="column4" label="可选值"></vue-table-column><vue-table-column prop="column5" label="默认值"></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "show-alpha",
                        column2: "是否支持透明度选择",
                        column3: "boolean",
                        column4: "—",
                        column5: "false"
                    }, {
                        column1: "color-format",
                        column2: "写入 v-model 的颜色的格式",
                        column3: "string",
                        column4: "hsl / hsv / hex / rgb",
                        column5: "hex（show-alpha 为 false）/ rgb（show-alpha 为 true）"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'color4',
            label: ' Events',
            template: '<vue-table class="api" :data="tableData" border stripe style="width: 100%"><vue-table-column prop="column1" label="事件名称"></vue-table-column><vue-table-column prop="column2" label="说明"></vue-table-column><vue-table-column prop="column3" label="回调参数"></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "change",
                        column2: "当绑定值变化时触发",
                        column3: "当前值"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return colorDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("CalendarDemo", this, function() {
    'use strict';
    var calendarDemo = {
        path: '/calendar',
        name: 'calendar',
        head: {
            label: 'calendarDemo.label',
            description: 'calendarDemo.description'
        },
        samples: [{
            id: 'calendar1',
            label: 'calendarDemo.samples1.label',
            description: 'calendarDemo.samples1.description',
            template: '<div class="source"><vue-row type="flex" justify="center" :gutter="20"><vue-col :span="12"><vue-calendar @dayclick="clickHandle" :events="vcevents"></vue-calendar></vue-col><vue-col :span="12"><vue-note box title="Event List" style="height:100%"><div v-for="(event, index) in noteEvents" style="width:100%" :key="index">Date: {{event.date}}<br/>Description: {{event.title}}<vue-divider></vue-divider></div></vue-note></vue-col></vue-row></div>',
            parameter: {
                data: function() {
                    return {
                        vcevents: [{
                            date: '2017-09-02 10:22',
                            title: 'Event 1'
                        }, {
                            date: '2017/08/10',
                            title: 'Event 2'
                        }, {
                            date: '07/31/2017',
                            title: 'Event 3'
                        }, {
                            date: new Date(),
                            title: 'Event 4'
                        },{
                            date: '2017-09-02',
                            title: 'Event 5'
                        }, {
                            date: '2017/08/10',
                            title: 'Event 6'
                        }, {
                            date: '07/31/2017',
                            title: 'Event 7'
                        }, {
                            date: new Date(),
                            title: 'Event 8'
                        }],
                        noteEvents: []
                    }
                },
                methods: {
                    clickHandle: function(date, events) {
                        this.noteEvents = events;
                    }
                }
            },
            code: '<vue-calendar @dayclick="clickHandle" :events="vcevents"></vue-calendar>\n'+
            '<vue-note box title="Event List" style="height:100%">\n'+
            '    <div v-for="(event, index) in noteEvents" style="width:100%" :key="index">\n'+
            '        Date: {{event.date}}\n'+
            '        <br/>\n'+
            '        Description: {{event.title}}\n'+
            '        <vue-divider></vue-divider>\n'+
            '    </div>\n'+
            '</vue-note>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        data: function(){\n'+
            '            return {\n'+
            '                vcevents: [{\n'+
            '                    date: "2017-09-02 10:22",\n'+
            '                    title: "Event 1"\n'+
            '                }, {\n'+
            '                    date: "2017/08/10",\n'+
            '                    title: "Event 2"\n'+
            '                }, {\n'+
            '                    date: "07/31/2017",\n'+
            '                    title: "Event 3"\n'+
            '                }, {\n'+
            '                    date: new Date(),\n'+
            '                    title: "Event 4"\n'+
            '                }, {\n'+
            '                    date: "2017-09-02",\n'+
            '                    title: "Event 5"\n'+
            '                }, {\n'+
            '                    date: "2017/08/10",\n'+
            '                    title: "Event 6"\n'+
            '                }, {\n'+
            '                    date: "07/31/2017",\n'+
            '                    title: "Event 7"\n'+
            '                }, {\n'+
            '                    date: new Date(),\n'+
            '                    title: "Event 8"\n'+
            '                }],\n'+
            '                noteEvents: []\n'+
            '            }\n'+
            '        },\n'+
            '        methods: {\n'+
            '            clickHandle: function(date, events) {\n'+
            '                this.noteEvents = events;\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'calendar2',
            label: ' Attributes',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left" width="300"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.type\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column><vue-table-column prop="column4" :label="$t(\'main.table.acceptedValues\')" header-align="left"><template scope="scope">{{$t(scope.row.column4)}}</template></vue-table-column><vue-table-column prop="column5" :label="$t(\'main.table.defaultValue\')" header-align="left"><template scope="scope">{{$t(scope.row.column5)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "events",
                        column2: "calendarDemo.samples2.row1column2",
                        column3: "array/object",
                        column4: "—",
                        column5: "—"
                    }]
                  }
                }
            },
            notshowmeta: true
        }, {
            id: 'calendar3',
            label: 'Events',
            template: '<vue-table class="api" :data="tableData" style="width: 100%"><vue-table-column prop="column1" :label="$t(\'main.table.method\')" header-align="left" width="150"><template scope="scope">{{$t(scope.row.column1)}}</template></vue-table-column><vue-table-column prop="column2" :label="$t(\'main.table.description\')" header-align="left"><template scope="scope">{{$t(scope.row.column2)}}</template></vue-table-column><vue-table-column prop="column3" :label="$t(\'main.table.parameters\')" header-align="left"><template scope="scope">{{$t(scope.row.column3)}}</template></vue-table-column></vue-table>',
            parameter: {
                data: function() {
                  return {
                    tableData: [{
                        column1: "dayclick",
                        column2: "calendarDemo.samples3.row1column2",
                        column3: "(date: date, events: array)"
                    }]
                  }
                }
            },
            notshowmeta: true
        }]
    };
    return calendarDemo;
});

!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})("PinDemo", this, function() {
    'use strict';
    var pinDemo = {
        path: '/pin',
        name: 'pin',
        head: {
            label: 'Pin 图钉',
            description: '使用图钉，可以将内容固定在屏幕上，并且不随页面的滚动而滚动。常用于侧边菜单等。可以通过调整浏览器窗口高度来查看效果'
        },
        samples: [{
            id: 'pin1',
            label: '基础用法',
            description: '简单使用，当元素不可见时，直接固定在最顶端。',
            template: '<div class="source"><vue-pin><vue-button type="primary">固定在最顶部</vue-button></vue-pin></div>',
            code: '<vue-pin>\n    <vue-button type="primary">固定在最顶部</vue-button>\n</vue-pin>'
        }, {
            id: 'pin4',
            label: '偏移&固定状态改变时的回调',
            description: '设置offset-top或offset-bottom可当滚动到一定距离时再固定。当固定状态发生改变时，会触发change事件。',
            template: '<div class="source"><vue-pin :offset-top="50" @change="change"><vue-button type="primary">固定在距离顶部 50px 的位置</vue-button></vue-pin></div>',
            parameter: {
                methods: {
                    change: function(status) {
                        this.$notify({title:'当前状态：' + status});
                    }
                }
            },
            code: '<vue-pin :offset-top="50" @change="change">\n    <vue-button type="primary">固定在距离顶部 50px 的位置</vue-button>\n</vue-pin>\n\n'+
            '<script>\n'+
            '    new Vue({\n'+
            '        methods: {\n'+
            '            change: function(status) {\n'+
            '                this.$notify({title:"当前状态：" + status});\n'+
            '            }\n'+
            '        }\n'+
            '    }).$mount();\n'+
            '</script>'
        }, {
            id: 'pin3',
            label: '固定在底部',
            description: '在屏幕下方固定。注意，offset-top和offset-bottom只可以设置一个，如果都设置，会使用offset-top。',
            template: '<div class="source"><vue-pin :offset-bottom="20"><vue-button type="primary">固定在距离底部 20px 的位置</vue-button></vue-pin></div>',
            code: '<vue-pin :offset-bottom="20">\n    <vue-button type="primary">固定在距离底部 20px 的位置</vue-button>\n</vue-pin>'
        }, {
            id: 'pin5',
            label: '始终固定',
            description: '设置fixed属性可始终固定在一个位置',
            template: '<div class="source"><vue-row type="flex" justify="center"><vue-col :span="6"><vue-pin :offset-bottom="0" fixed><vue-button type="primary">始终固定在距离底部位置</vue-button></vue-pin></vue-col></vue-row></div>',
            code: '<vue-pin :offset-bottom="0" fixed>\n    <vue-button type="primary">始终固定在距离底部 位置</vue-button>\n</vue-pin>'
        }]
    };
    return pinDemo;
});
!(function(name, context, definition) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        define(['Vue', 'VueComponentRegistry'], definition);
    } else {
        context[name] = definition(context['Vue']);
    }
})("DemoUtil", this, function(Vue) {
    'use strict';
    var componentToDom = function(elementId, template, parameter) {
        if (typeof template === 'undefined') return;
        var vueParameter = {
            template: template
        };
        if (parameter) {
            if (parameter.data)
                vueParameter.data = parameter.data;
            if (parameter.methods)
                vueParameter.methods = parameter.methods;
            if (parameter.mounted)
                vueParameter.mounted = parameter.mounted;
        }
        var vueDemo = new Vue(vueParameter).$mount();
        document.getElementById(elementId).appendChild(vueDemo.$el);
    };
    return {
        componentToDom: componentToDom
    }
});!(function(name, context, definition) {
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
