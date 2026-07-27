/** 华为/荣耀定时测量操作示例图（static/dingshi） */

const ZH_GROUPS = [

	// 方案一：手动打开手机「设置」

	{

		titleKey: '定时测量示例图分组方案一',

		steps: [{

				src: '/static/dingshi/HW_ZH_1.jpg',

				captionKey: '定时测量示例图手动提示1'

			},

			{

				src: '/static/dingshi/HW_ZH_2.jpg',

				captionKey: '定时测量示例图手动提示2'

			},

			{

				src: '/static/dingshi/HW_ZH_3.jpg',

				captionKey: '定时测量示例图手动提示3'

			},

			{

				src: '/static/dingshi/HW_ZH_4.jpg',

				captionKey: '定时测量示例图手动提示4'

			}

		]

	},

	// 方案二：直接点击「去设置」按钮

	{

		titleKey: '定时测量示例图分组去设置',

		steps: [{

				src: '/static/dingshi/HW_ZH_NAV_1.jpg',

				captionKey: '定时测量示例图去设置提示1'

			},

			{

				src: '/static/dingshi/HW_ZH_NAV_2.jpg',

				captionKey: '定时测量示例图去设置提示2'

			},

			{

				src: '/static/dingshi/HW_ZH_NAV_3.jpg',

				captionKey: '定时测量示例图去设置提示3'

			}

		]

	}

]



const EN_GROUPS = [{

		titleKey: '定时测量示例图分组方案一',

		steps: [{

				src: '/static/dingshi/HW_EN_1.jpg',

				captionKey: '定时测量示例图手动提示1'

			},

			{

				src: '/static/dingshi/HW_EN_2.jpg',

				captionKey: '定时测量示例图手动提示2'

			},

			{

				src: '/static/dingshi/HW_EN_3.jpg',

				captionKey: '定时测量示例图手动提示3'

			},

			{

				src: '/static/dingshi/HW_EN_4.jpg',

				captionKey: '定时测量示例图手动提示4'

			}

		]

	},

	{

		titleKey: '定时测量示例图分组去设置',

		steps: [{

				src: '/static/dingshi/HW_EN_NAV_1.jpg',

				captionKey: '定时测量示例图去设置提示1'

			},

			{

				src: '/static/dingshi/HW_EN_NAV_2.jpg',

				captionKey: '定时测量示例图去设置提示2'

			},

			{

				src: '/static/dingshi/HW_EN_NAV_3.jpg',

				captionKey: '定时测量示例图去设置提示3'

			}

		]

	}

]



export function isQxDingshiZhLocale() {

	const Language = uni.getLocale()

	return Language === 'zh-Hans' || Language === 'zh-Hant'

}



export function getQxDingshiExampleGroups() {

	return isQxDingshiZhLocale() ? ZH_GROUPS : EN_GROUPS

}



/** 扁平列表，供 previewImage 使用 */

export function flattenQxDingshiExampleSteps(groups) {

	return (groups || []).reduce((list, group) => list.concat(group.steps || []), [])

}

