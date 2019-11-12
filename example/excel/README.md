# Excel导入导出插件

导出excel功能基于 XLSX.js，下载功能基于 FileSaver，读取文件基于 H5的 FileReader。

> 浏览器兼容性：支持IE11+、Firefox、chrome

> 特别注意：**Vue项目调用方式为：VueUtil.Excel，非Vue项目为全局变量Excel, 不能直接在IFRAME里边直接调用导出方法，因为浏览器会限制这种导出行为，如有遇到此类情况，可使用 parent.Excel.exportExcel() 的方式调用父级页面函数以避免这个问题（父页面需要先加载插件）**


## 功能演示：

##### 在线演示：


![功能演示](https://raw.githubusercontent.com/wangerzi/layui-excel/master/ExcelHeart.png)

![功能演示](https://raw.githubusercontent.com/wangerzi/layui-excel/master/ScreenToGif.gif)



## 依赖的开源项目

| 开源项目名称                                             | 地址                                                         | 用于                           |
| -------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------ |
| [SheetJS / js-xlsx](https://github.com/SheetJS/js-xlsx)  | [https://github.com/SheetJS/js-xlsx](https://github.com/SheetJS/js-xlsx) | 导出的基础逻辑                 |
| [protobi / js-xlsx](https://github.com/protobi/js-xlsx)  | [https://github.com/protobi/js-xlsx](https://github.com/protobi/js-xlsx) | 可以设置样式，用于补全样式功能 |
| [FileSaver.js](https://github.com/eligrey/FileSaver.js/) | [https://github.com/eligrey/FileSaver.js/](https://github.com/eligrey/FileSaver.js/) | 前端用于保存文件的JS功能组件   |
| [Blob.js](https://github.com/eligrey/Blob.js/)           | [https://github.com/eligrey/Blob.js/](https://github.com/eligrey/Blob.js/) | Blob在IE10中的hack实现         |
| [polyfill.js](https://github.com/philipwalton/polyfill/) | [https://github.com/philipwalton/polyfill/](https://github.com/philipwalton/polyfill/) | 有名的IE兼容插件               |
| [shim.js](https://github.com/es-shims/es5-shim)          | [https://github.com/es-shims/es5-shim](https://github.com/es-shims/es5-shim) | xlsx.js内置的兼容组件，支持ES5 |



## 快速上手

> 由于插件规模扩大和功能的增加，导致插件上手难度有一定的增加。但如果只使用核心功能，其实没有必要去研究插件的所有方法，故在此把此插件解决核心需求的方法展示出来。

```html
<!--先加载viy-->
<script src="http://10.191.6.26:8080/viy/js/vue-all.min.js"></script>
<script src="http://10.191.6.26:8080/viy/js/vue-component-all.min.js"></script>

<!--再加载插件-->
<script src="../excel.min.js"></script>
<!--直接调用函数即可-->
<script>
    VueUtil.Excel.exportExcel([[1, 2, 3]], '表格导出.xlsx', 'xlsx')
</script>
```

#### 第三步：手工添加一个表头，并调用导出excel的内部函数


```javascript

    var excel = VueUtil.Excel;
    $.ajax({
        url: '/path/to/get/data',
        dataType: 'json',
        success: function(res) {
            // 假如返回的 res.data 是需要导出的列表数据
            console.log(res.data);// [{name: 'wang', age: 18, sex: '男'}, {name: 'asd', age: 3, sex: '女'}]
            // 1. 数组头部新增表头
            res.data.unshift({name: '用户名',sex: '男', age: '年龄'});
            // 2. 如果需要调整顺序，请执行梳理函数
            var data = excel.filterExportData(res.data, [
                'name',
                'sex',
                'age',
            ]);
            // 3. 执行导出函数，系统会弹出弹框
            excel.exportExcel({
                sheet1: data
            }, '导出接口数据.xlsx', 'xlsx');
        }
    });

```



## 函数列表

> 仅做函数用途介绍，具体使用方法请见 『重要函数参数配置』

| 函数名                                          | 描述                                                        | 索引                                                         |
| ----------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ |
| **exportExcel(data, filename, type, opt)**      | 导出数据，并弹出指定文件名的下载框                          | [exportExcel参数配置](#exportexcel%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE) |
| downloadExl(data, filename, type)               | 快速导出excel，无需指定 sheet_name 和文件后缀               | [downloadExl参数配置](#downloadexl%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE) |
| **filterExportData(data, fields)**              | 梳理导出的数据，包括字段排序和多余数据                      | [filterExportData参数配置](#filterexportdata%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE) |
| **importExcel(files, opt, callback)**           | 读取Excel，支持多文件多表格读取                             | [importExcel参数配置](#importexcel%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE) |
| **makeMergeConfig(origin)**                     | 生成合并的配置参数，返回结果需放置于opt.extend['!merges']中 | [makeMergeConfig参数配置](#makemergeconfig%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE) |
| setExportCellStyle(data, range, config, filter) | 为sheet级别数据批量设置单元格属性                           | [setExportCellStyle参数配置](#setExportCellStyle%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE) |
| makeColConfig(data, defaultNum)                 | 生成列宽配置，返回结果需放置于opt.extend['!cols']中         | [makeColConfig参数配置](#makecolconfig%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE) |
| makeRowConfig(data, defaultNum)                 | 生成行高配置，返回结果需放置于opt.extend['!rows']           | [makeRowConfig参数配置](#makerowconfig%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE) |
| tableToJson(dom)                                | 将原生table转换为JSON格式                                   | [tableToJson参数配置](#tabletojson%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE) |
| setRoundBorder(data, range ,config)             | 设置范围环绕的边框                                          | [setRoundBorder参数配置](#setRoundBorder%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE) |
| filterDataToAoaData(sheet_data)                 | 将单个sheet的映射数组数据转换为加速导出效率的aoa数据        | 无                                                           |
| filterImportData(data, fields)                  | 梳理导入的数据，字段含义与 filterExportData 类似            | 无                                                           |
| numToTitle(num)                                 | 将1/2/3...转换为A/B/C/D.../AA/AB/.../ZZ/AAA形式             | 无                                                           |
| titleToNum(title)                               | 将A、B、AA、ABC转换为 1、2、3形式的数字                     | 无                                                           |
| splitPosition(pos)                              | 将A1分离成 {c: 0, r: 1} 格式的数据                          | 无                                                           |

## 重要函数参数配置

#### exportExcel参数配置

> 核心方法，用于将 data 数据依次导出，如果需要调整导出后的文件字段顺序或者过滤多余数据，请查看 filterExportData 方法

| 参数名称 | 描述                                             | 默认值 |
| -------- | ------------------------------------------------ | ------ |
| data     | 数据列表（需要指定表名）                         | 必填   |
| filename | 文件名称（带后缀）                               | 必填   |
| type     | 导出类型，支持 xlsx、csv、ods、xlsb、fods、biff2 | xlsx   |
| opt      | 其他可选配置                                     | null   |

##### data样例：

```javascript
{
    "sheet1": [
        {name: '111', sex: 'male'},
        {name: '222', sex: 'female'},
    ]
}
```

##### opt支持的配置项

| 参数名称        | 描述                                                         | 默认值 |
| --------------- | ------------------------------------------------------------ | ------ |
| opt.Props       | 配置文档基础属性，支持Title、Subject、Author、Manager、Company、Category、Keywords、Comments、LastAuthor、CreatedData | null   |
| opt.extend      | 表格配置参数，支持 `!merge` (合并单元格信息)、`!cols`(行数)、`!protect`(写保护)等，[原生配置请参考](https://github.com/SheetJS/js-xlsx#worksheet-object)，其中 `!merge` 配置支持辅助方法生成，详见 `makeMergeConfig(origin)`！ | null   |
| opt.compression | 是否压缩，压缩效果比较明显，建议开启（9列9w行有较多重复的数据，从 30M 缩小到 3M） | true   |

> 如果想指定某个 sheet 的opt.extend，请按照 'sheet名称' => {单独配置}，如：

```javascript
excel.exportExcel({
    sheet1: data,
    sheet2: data
}, '测试导出复杂表头.xlsx', 'xlsx', {
    extend: {
        // extend 中可以指定某个 sheet 的属性，如果不指定 sheet 则所有 sheet 套用同一套属性
        sheet1: {
            // 以下配置仅 sheet1 有效
            '!merges': mergeConf
            ,'!cols': colConf
            ,'!rows': rowConf
        }
    }
});
```

#### downloadExl参数配置

> 兼容旧用法，用于快速导出数据，无需指定 sheet_name，无需指定后缀名，其余跟 `exportExcel` 用法相同。

| 参数名称 | 描述                             | 默认值 |
| -------- | -------------------------------- | ------ |
| data     | 导出的数据                       |        |
| filename | 不带后缀名的文件名               |        |
| type     | 导出类型（自动拼接在filename后） |        |

#### filterExportData参数配置

> 辅助方法，梳理导出的数据，包括字段排序和多余数据过滤

| 参数名称 | 描述                                             | 默认值 |
| -------- | ------------------------------------------------ | ------ |
| data     | 需要梳理的数据                                   | 必填   |
| fields   | 支持数组、对象和回调函数，用于映射关系和字段排序 | 必填   |

> fields参数设计

在实际使用的过程中，后端给的参数多了，或者字段数据不符合导出要求，这都是很常见的情况。为了导出数据的顺序正确和数据映射正确，于是新增了这个方法。

fields 用于表示对象中的属性顺序和映射关系，支持『数组』和『对象』两种方式

假如后台给出了这样的数据：

```json
{
    "code":0,
    "msg":"",
    "count":3,
    "data":[
        {
            "id":10000,
            "username":"user-0",
            "sex":"女",
            "city":"城市-0",
            "sign":"签名-0",
            "experience":255,
            "logins":24,
            "wealth":82830700,
            "classify":"作家",
            "score":57,
            "start": "2018-12-29",
            "end": "2018-12-30"
        }
    ]
}
```

**数组方式：**

仅用于排序、字段过滤，比如我希望的导出顺序和字段是：

`id`、`sex`、`username`、`city`

那么，我可以这样写：

```javascript
var data = [];// 假设的后台的数据
data = excel.filterExportData(data, ['id', 'sex', 'username', 'city']);
excel.exportExcel(data, '导出测试.xlsx', 'xlsx');
```

**对象方式：**

> 巧记：对象左侧是新名称，右侧是老名称或者回调函数（左新右旧）

可以用于排序、重命名字段、字段过滤，比如我希望 `username` 字段重命名为 `name`，保留 `sex` 和 `city` 字段

那么，我可以这样写：

```javascript
var data = [];// 假设的后台的数据
data = excel.filterExportData(data, {
    name: 'username',
    sex:'sex',
    city: 'city'
});
excel.exportExcel(data, '导出测试.xlsx', 'xlsx');
```

##### 回调方式：

> 口诀：左新右旧

可以用于排序、重命名字段、字段过滤、自定义列、批量渲染样式，比如我希望 `range` 由 `start` `end` 聚合并以 `~` 分割；修改 `score` 为原有值的 10倍，并且 `username` 字段重命名为 `name`，保留 `sex` 和 `city`  字段，`city` 所有单元格变为**加粗+居中+红底白字**（可用样式请参见『样式设置专区』）。

那么，我可以这样写：

```javascript
var data = [];// 假设的后台的数据
data = VueUtil.Excel.filterExportData(data, {
    name: 'username',
    sex:'sex',
    city: function(value, line, data) {
        return {
            v: value,// v 代表单元格的值
            s:{// s 代表样式
                alignment: {
                    horizontal: 'center',
                    vertical: 'center',
                },
                font: { sz: 14, bold: true, color: { rgb: "FFFFFF" } },
                fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FF0000" }}
            },
        };
    },
    range: function(value, line, data) {
        return line['start'] + '~' + line['end'];
    },
    score: function(value, line, data) {
        return value * 10;
    }
});
excel.exportExcel(data, '导出测试.xlsx', 'xlsx');
```

##### 单元格属性含义

| Key  | Description                                                  |
| ---- | ------------------------------------------------------------ |
| `v`  | 单元格的值                                                   |
| `w`  | 格式化文本（如果适用）                                       |
| `t`  | 单元格类型: `b` 布尔值, `n` 数字, `e` 错误, `s` 字符, `d` 日期 |
| `f`  | 单元格公式（如果适用）                                       |
| `r`  | 富文本编码（如果适用）                                       |
| `h`  | 富文本的HTML呈现（如果适用）                                 |
| `c`  | 与单元格相关的注释                                           |
| `z`  | 与单元格关联的数字格式字符串（如果需要）                     |
| `l`  | 单元格超链接对象（目标链接，.tooltip是提示）                 |
| `s`  | 单元格的样式/主题（如果适用）                                |

##### 公式设置样例：

> 注意：网页导出的xlsx，在 Microsoft Excel 呈保护模式打开，导致公式的值不显示，此时将受保护模式关掉即可！

对于复杂的公式，楼主也不甚了解，以普通公式 `=SUM(A1, A10)`  为例，在插件中只需要将单元格的属性设置为：`{t: 'n', f: 'SUM(A1:A10)'}`，比如我想加一个总览行就可以这样追加数据：

```javascript
// 4. 公式的用法
data.push({
    id: '',
    username: '总年龄',
    age: {t: 'n', f: 'SUM(C4:C10)'},
    sex: '总分',
    score: {t: 'n', f: 'SUM(E4:E10)'},
    classify: ''
});
```

官方公式相关文档：[https://github.com/SheetJS/js-xlsx#formulae](https://github.com/SheetJS/js-xlsx#formulae)

#### setExportCellStyle参数配置

> 辅助方法：为 sheet 级别的数据批量设置单元格属性

| 参数名称 | 描述                                                         | 默认值                   |
| -------- | ------------------------------------------------------------ | ------------------------ |
| data     | sheet级别的数据                                              |                          |
| range    | 范围字符串，比如`" A1:C12"`表示开始位置默认 A1，结束位置C12  | 数据范围内左上角到右下角 |
| config   | 批量设置的单元格属性，会与之前的样式合并                     |                          |
| filter   | 回调函数，传递函数生效，返回值作为新的值（可用于过滤、规则替换样式等骚操作）**『非必填参数』** |                          |

##### filter入参列表

> 此参数选填，如果不传入则直接按照规则覆盖

| 参数名称   | 描述                                     |
| ---------- | ---------------------------------------- |
| cell       | 原有单元格数据                           |
| newCell    | 根据批量设置规则自动生成样式的单元格数据 |
| row        | 所在行数据                               |
| config     | 传入的配置                               |
| currentCol | 当前列索引                               |
| fieldKey   | 当前字段key                              |

##### 调用样例(更多用法可参考 index.js 中的样例)

```javascript
// 1. 假设的梳理后的后台的数据(省略filter函数梳理)
var data = [
    { username: '520',sex: '男', city: 'J', 'score': 100, 'start': '2019-03-11' },
    { username: '520',sex: '女', city: 'X', 'score': 100, 'start': '2019-03-11' },
    { username: '520',sex: '男', city: '上海', 'score': 100, 'start': '2019-03-11' }
];
// 2. 调用设置样式的函数，传入设置的范围，支持回调
excel.setExportCellStyle(data, 'A1:C3', {
    s: {
        fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FF0000" } },
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        }
    }
}, function(cell, newCell, row, config, currentRow, currentCol, fieldKey) {
    // 回调参数，cell:原有数据，newCell:根据批量设置规则自动生成的样式，row:所在行数据，config:传入的配置,currentRow:当前行索引,currentCol:当前列索引，fieldKey:当前字段索引
    return ((currentRow + currentCol) % 2 === 0) ? newCell : cell;// 隔行隔列上色
} );
// 3. 导出数据
excel.exportExcel(data, '批量设置样式.xlsx', 'xlsx');
```

#### makeMergeConfig参数配置

> 辅助方法：用于生成合并表格的配置项，注意需要传入到 exportExcel 的 opt.extend['!merge'] 中

| 参数名称 | 描述     | 默认值 |
| -------- | -------- | ------ |
| origin   | 二维数组 | null   |

##### origin数据样例

> 表示合并 A1~E1 行，并且合并 A2~D4行

```javascript
var mergeConf = excel.makeMergeConfig([
    ['A1', 'E1'],
    ['A2', 'D4']
]);
excel.exportExcel({
    sheet1: data
}, '测试导出复杂表头.xlsx', 'xlsx', {
    extend: {
        // 复杂表头合并[A1,E1][A2, D4]
        '!merges': mergeConf
    }
});
```

##### 调用样例

请见下方『使用方法』

#### makeColConfig参数配置

> 辅助方法：生成列宽配置，返回结果需放置于opt.extend['!cols']中

| 参数名称   | 描述                                                  | 默认值 |
| ---------- | ----------------------------------------------------- | ------ |
| data       | 一个对象，对象的key代表列（如：ABCDE），value代表宽度 | null   |
| defaultNum | 渲染过程中未指定单元格的默认宽度                      | 60     |

##### 使用样例

> key表示列，value表示宽，剩余宽度取默认值，特别注意要放在 opt.extend['!cols'] 中

```javascript
// 意思是：A列40px，B列60px(默认)，C列120px，D、E、F等均未定义
var colConf = excel.makeColConfig({
    'A': 40,
    'C': 120
}, 80);
excel.exportExcel({
    sheet1: data
}, '测试导出复杂表头.xlsx', 'xlsx', {
    extend: {
        '!cols': colConf
    }
});
```

#### makeRowConfig参数配置

> 辅助方法：生成列宽配置，返回结果需放置于opt.extend['!rows']中

| 参数名称   | 描述                                                         | 默认值 |
| ---------- | ------------------------------------------------------------ | ------ |
| data       | 一个对象，对象的key代表从1开始的行（如：1234），value代表高度 | null   |
| defaultNum | 渲染过程中未指定单元格的默认宽度                             | 60     |

##### 使用样例

> key表示行，value表示高度，剩余高度取默认值，特别注意要放在 opt.extend['!rows'] 中

```javascript
// 意思是：1行40px，2行60px(默认)，3行120px，4/5/6/7等行均未定义
var rowConf = excel.makeRowConfig({
    1: 40,
    3: 120
}, 80);
excel.exportExcel({
    sheet1: data
}, '测试导出复杂表头.xlsx', 'xlsx', {
    extend: {
        '!rows': rowConf
    }
});
```

#### importExcel参数配置

> 核心方法，用于读取用户选择的Excel信息，文件读取基于 FileReader，所以对浏览器版本要求较高

| 参数名称 | 描述                                                         | 默认值    |
| -------- | ------------------------------------------------------------ | --------- |
| files    | 上传文件DOM对象的 files 属性                                 | undefined |
| opt      | 导出参数配置，详见下方描述                                   | undefined |
| callback | 完全读取完毕的回调函数，传入一个参数「data」表示所有数据的集合 | undefined |

##### opt参数配置

| 参数名称 | 描述                                                         | 默认值 |
| -------- | ------------------------------------------------------------ | ------ |
| header   | 导入参数的headers，支持"A"、1等，[详见XLSX官方文档](https://github.com/SheetJS/js-xlsx#json) | A      |
| range    | 读取的范围，支持数字、字符等，[详见XLSX官方文档](https://github.com/SheetJS/js-xlsx#json) | null   |
| fields   | 可以在读取的过程中进行数据梳理，参数意义请参见「filterExportData参数配置」 | null   |

> 由于处理过程中会抛出一些异常，所以请使用 try{}catch(e){}接收并提示用户！
>
> 如果对导出数据格式的键不满意，可以有两种方式梳理：
>
>  	1. 调用 filterImportData(data, fields)
>  	2. 直接在 importExcel() 的 opt 配置中进行数据梳理

##### 调用样例

```javascript

        var files = e.target.files;
        try {
            // 方式一：先读取数据，后梳理数据
            excel.importExcel(files, {}, function(data) {
                console.log(data);
                data = excel.filterImportData(data, {
                    'id': 'A'
                    ,'username': 'B'
                    ,'experience': 'C'
                    ,'sex': 'D'
                    ,'score': 'E'
                    ,'city': 'F'
                    ,'classify': 'G'
                    ,'wealth': 'H'
                    ,'sign': 'I'
                })
                console.log(data);
            });
            // 方式二：可以在读取过程中梳理数据
            excel.importExcel(files, {
                fields: {
                    'id': 'A'
                    ,'username': 'B'
                    ,'experience': 'C'
                    ,'sex': 'D'
                    ,'score': 'E'
                    ,'city': 'F'
                    ,'classify': 'G'
                    ,'wealth': 'H'
                    ,'sign': 'I'
                }
            }, function(data) {
                console.log(data);
            });
        } catch (e) {
            layer.alert(e.message);
        }


```


## 样式设置专区：

#### s属性支持的单元格样式

| 样式属性 | 子属性 | 取值 |
| :-------------- | :------------- | :------------- |
| fill            | patternType    |  `"solid"` or `"none"`|
|                 | fgColor        |  `COLOR_SPEC` |
|                 | bgColor        |  `COLOR_SPEC`|
| font            | name           | `"Calibri"` // 默认字体 |
|                 | sz             | `"11"` // 字体大小 |
|                 | color          |  `COLOR_SPEC`|
|                 | bold           |  `true` or `false`|
|                 | underline      |  `true` or `false`|
|                 | italic         |  `true` or `false`|
|                 | strike         |  `true` or `false`|
|                 | outline        |  `true` or `false`|
|                 | shadow         |  `true` or `false`|
|                 | vertAlign      |  `true` or `false`|
| numFmt          |                | `"0"`  // 内置格式的整数索引，请参见StyleBuilder.SSF属性 |
|                 |                | `"0.00%"` // 匹配内置格式的字符串，请参阅StyleBuilder.SSF |
|                 |                | `"0.0%"`  // 指定自定义格式的字符串 |
|                 |                | `"0.00%;\\(0.00%\\);\\-;@"` // 指定自定义格式的字符串，转义特殊字符 |
|                 |                | `"m/dd/yy"` // 使用Excel的格式表示法字符串日期格式 |
| alignment       | vertical       | `"bottom"` or `"center"` or `"top"`|
|                 | horizontal     | `"bottom"` or `"center"` or `"top"`|
|                 | wrapText       | `true ` or ` false` // 自动换行 |
|                 | readingOrder   | `2` // 从右到左 |
|                 | textRotation   | 从 `0` 到 `180` 或者 `255` (默认为 `0`) |
|                 |                | `90` 旋转90度 |
|                 |                | `45` 旋转45度 |
|                 |                | `135` 反向旋转45度 |
|                 |                | `180` 旋转180度 |
|                 |                | `255` 特殊：垂直对齐 |
| border          | top            | `{ style: BORDER_STYLE, color: COLOR_SPEC }`|
|                 | bottom         | `{ style: BORDER_STYLE, color: COLOR_SPEC }`|
|                 | left           | `{ style: BORDER_STYLE, color: COLOR_SPEC }`|
|                 | right          | `{ style: BORDER_STYLE, color: COLOR_SPEC }`|
|                 | diagonal       | `{ style: BORDER_STYLE, color: COLOR_SPEC }`|
|                 | diagonalUp     | `true` or `false`|
|                 | diagonalDown   | `true` or `false`|

**COLOR_SPEC**: 可以设置在 `fill`, `font`, 和 `border` 属性中，是一个对象:

* `{ auto: 1}` 指定自动值（楼主认为，应该是默认为白色的意思）
* `{ rgb: "FFFFAA00" }` 指定16进制 ARGB 的值（PS:ARGB，前两个16进制是透明度，比如不透明红色：FFFF0000）
* `{ theme: "1", tint: "-0.25"}` 指定主题颜色和色调值的整数索引（默认值为0）（PS：楼主也明白嘛意思）
* `{ indexed: 64}` 是 `fill.bgColor`属性的默认值，看着应该像索引之类的

**BORDER_STYLE**: 边框支持以下几种样式:

 * `thin`(细边框)
 * `medium`(中等)
 * `thick`(厚)
 * `dotted`(点线)
 * `hair`(毛)
 * `dashed`(虚线)
 * `mediumDashed`(中等宽度虚线)
 * `dashDot`( 点)
 * `mediumDashDot`(中等宽度点)
 * `dashDotDot`(虚线带点)
 * `mediumDashDotDot`(中等虚线带点)
 * `slantDashDot`(倾斜虚线点--楼主也没明白啥意思╮(╯▽╰)╭)

##### 合并区域边框

合并区域的边框是为合并区域内的每个单元格指定的。因此，要将框边框应用于3x3单元格的合并区域，需要为八个不同的单元格指定边框样式：

* 左边三个单元格的左边框,
* 右侧三个单元格的右边框
* 顶部单元格的顶部边框
* 左侧单元格的底部边框

## 提效建议：

> 数据规模：前端导出**纯数据 9列10w** 的数据量需要 **7秒左右**的时间，**30W数据占用1.8G，耗时24秒**，普通电脑**最多能导出50w数据，耗时45秒**，提示内存超限

- 如果数据量比较大，**并且不涉及样式**，最好直接转换为纯数组+CSV的导出，可以省去 filterExportData 和 组装样式的时间和内存（PS：效率提升不算太大，30W数据能提速2s左右，资源主要消耗在调用 XLSX.js之后）
- 一般 exportExcel 会放在 $.ajax() 等异步调用中，如果有需要在点击后纯前端生成Excel，可以使用 async、setTimeout等方式实现异步导出，否则会阻塞主进程。

## 功能概览：

- 支持梳理导出的数据并导出多种格式数据
- 支持IE、火狐、chrome等主流浏览器
- 普通工作电脑最多支持9列45W行数据规模的导出
- 支持 xlx、xlsx、csv格式的前端数据读取以及数据梳理
- 支持单个文件多个 sheet 的导出
- 提供方便的列合并辅助方法
- 支持单元格样式设置
- 支持设置单元格宽度和高度并提供辅助方法方便使用
- 支持公式、链接等单元格属性设置
- 支持压缩，支持设置边距

