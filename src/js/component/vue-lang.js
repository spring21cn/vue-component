!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueLang', this, function(Vue, VueUtil) {
	'use strict';
	var VueLang = {
		zh: {
			vue: {
				colorpicker: {
					confirm: '确定',
					clear: '清空'
				},
				datepicker: {
					now: '此刻',
					today: '今天',
					cancel: '取消',
					clear: '清空',
					confirm: '确定',
					selectDate: '选择日期',
					selectTime: '选择时间',
					startDate: '开始日期',
					startTime: '开始时间',
					endDate: '结束日期',
					endTime: '结束时间',
					year: '年',
					month1: '1 月',
					month2: '2 月',
					month3: '3 月',
					month4: '4 月',
					month5: '5 月',
					month6: '6 月',
					month7: '7 月',
					month8: '8 月',
					month9: '9 月',
					month10: '10 月',
					month11: '11 月',
					month12: '12 月',
					weeks: {
						sun: '日',
						mon: '一',
						tue: '二',
						wed: '三',
						thu: '四',
						fri: '五',
						sat: '六'
					},
					months: {
						jan: '一月',
						feb: '二月',
						mar: '三月',
						apr: '四月',
						may: '五月',
						jun: '六月',
						jul: '七月',
						aug: '八月',
						sep: '九月',
						oct: '十月',
						nov: '十一月',
						dec: '十二月'
					}
				},
				select: {
					loading: '加载中',
					noMatch: '无匹配数据',
					noData: '无数据',
					placeholder: '请选择'
				},
				cascader: {
					noMatch: '无匹配数据',
					placeholder: '请选择'
				},
				pagination: {
					goto: '前往',
					pagesize: '条/页',
					total: '共 {total} 条',
					pageClassifier: '页'
				},
				messagebox: {
					title: '提示',
					confirm: '确定',
					cancel: '取消',
					error: '输入的数据不合法!'
				},
				upload: {
					delete: '删除',
					preview: '查看图片',
					continue: '继续上传'
				},
				table: {
					emptyText: '暂无数据',
					confirmFilter: '筛选',
					resetFilter: '重置',
					clearFilter: '全部',
					sumText: '合计'
				},
				tree: {
					emptyText: '暂无数据'
				},
				screenfull: {
					canot: '不兼容您的浏览器!'
				}
			}
		},
		ja: {
			vue: {
				colorpicker: {
					confirm: 'はい',
					clear: 'クリア'
				},
				datepicker: {
					now: '現在',
					today: '今日',
					cancel: 'キャンセル',
					clear: 'クリア',
					confirm: 'はい',
					selectDate: '日付を選択',
					selectTime: '時間を選択',
					startDate: '開始日',
					startTime: '開始時間',
					endDate: '終了日',
					endTime: '終了時間',
					year: '年',
					month1: '一月',
					month2: '二月',
					month3: '三月',
					month4: '四月',
					month5: '五月',
					month6: '六月',
					month7: '七月',
					month8: '八月',
					month9: '九月',
					month10: '十月',
					month11: '十一月',
					month12: '十二月',
					weeks: {
						sun: '日',
						mon: '月',
						tue: '火',
						wed: '水',
						thu: '木',
						fri: '金',
						sat: '土'
					},
					months: {
						jan: '一月',
						feb: '二月',
						mar: '三月',
						apr: '四月',
						may: '五月',
						jun: '六月',
						jul: '七月',
						aug: '八月',
						sep: '九月',
						oct: '十月',
						nov: '十一月',
						dec: '十二月'
					}
				},
				select: {
					loading: 'ロード中',
					noMatch: 'データなし',
					noData: 'データなし',
					placeholder: '選択してください'
				},
				cascader: {
					noMatch: 'データなし',
					placeholder: '選択してください'
				},
				pagination: {
					goto: '',
					pagesize: '件/ページ',
					total: '総計 {total} 件',
					pageClassifier: 'ページ目へ'
				},
				messagebox: {
					title: 'メッセージ',
					confirm: 'はい',
					cancel: 'キャンセル',
					error: '正しくない入力'
				},
				upload: {
					delete: '削除する',
					preview: 'プレビュー',
					continue: '続行する'
				},
				table: {
					emptyText: 'データなし',
					confirmFilter: '確認',
					resetFilter: '初期化',
					clearFilter: 'すべて',
					sumText: '合計'
				},
				tree: {
					emptyText: 'データなし'
				},
				screenfull: {
					canot: 'ブラウザは実行できません!'
				}
			}
		},
		en: {
			vue: {
				colorpicker: {
					confirm: 'OK',
					clear: 'Clear'
				},
				datepicker: {
					now: 'Now',
					today: 'Today',
					cancel: 'Cancel',
					clear: 'Clear',
					confirm: 'OK',
					selectDate: 'Select date',
					selectTime: 'Select time',
					startDate: 'Start Date',
					startTime: 'Start Time',
					endDate: 'End Date',
					endTime: 'End Time',
					year: '',
					month1: 'Jan',
					month2: 'Feb',
					month3: 'Mar',
					month4: 'Apr',
					month5: 'May',
					month6: 'Jun',
					month7: 'Jul',
					month8: 'Aug',
					month9: 'Sep',
					month10: 'Oct',
					month11: 'Nov',
					month12: 'Dec',
					weeks: {
						sun: 'Sun',
						mon: 'Mon',
						tue: 'Tue',
						wed: 'Wed',
						thu: 'Thu',
						fri: 'Fri',
						sat: 'Sat'
					},
					months: {
						jan: 'Jan',
						feb: 'Feb',
						mar: 'Mar',
						apr: 'Apr',
						may: 'May',
						jun: 'Jun',
						jul: 'Jul',
						aug: 'Aug',
						sep: 'Sep',
						oct: 'Oct',
						nov: 'Nov',
						dec: 'Dec'
					}
				},
				select: {
					loading: 'Loading',
					noMatch: 'No matching data',
					noData: 'No data',
					placeholder: 'Select'
				},
				cascader: {
					noMatch: 'No matching data',
					placeholder: 'Select'
				},
				pagination: {
					goto: 'Go to',
					pagesize: '/page',
					total: 'Total {total}',
					pageClassifier: ''
				},
				messagebox: {
					title: 'Message',
					confirm: 'OK',
					cancel: 'Cancel',
					error: 'Illegal input'
				},
				upload: {
					delete: 'Delete',
					preview: 'Preview',
					continue: 'Continue'
				},
				table: {
					emptyText: 'No Data',
					confirmFilter: 'Confirm',
					resetFilter: 'Reset',
					clearFilter: 'All',
					sumText: 'Sum'
				},
				tree: {
					emptyText: 'No Data'
				},
				screenfull: {
					canot: 'You browser can\'t work!'
				}
			}
		}
	}
	VueUtil.setLocale('zh', VueLang.zh);
	VueUtil.setLocale('ja', VueLang.ja);
	VueUtil.setLocale('en', VueLang.en);
	VueUtil.setLang('zh');
});