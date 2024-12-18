## 自定义日历，可切换周/月日历展示，支持手势切换
## 理论上全端支持，App端未经测试
### Props
| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| :---: | :---: | :---: | :---: | :---: |
| dots | 日历数据点 | Array | [ ] | - |
| keyName | 渲染日历数据点的key | String | value | - |
| defaultViewType | 日历视图 | String | month | week |
| allowFuture | 允许选择未来日期 | Boolean | false | true |
| minDate | 限制过去日期 | String | - | yyyy-mm-dd |
| showLunarCalendar | 显示农历 | Boolean | false | true |
| showSolarTerm | 显示24节气 | Boolean | false | true |
| showFestival | 显示节日 | Boolean | false | true |
| customStyle | 自定义默认样式 | Object | { } | - |
| activeBgColor | 选中日期背景色 | String | #3c9cff | - |
| activeColor | 选中日期颜色 | String | #fff | - |
### Event
| 事件 | 说明 | 返回值类型 |
| :---: | :---: | :---: |
| inited | 日历初始化完成回调 | Array |
| change | 获取选中的日期数据 | Object |
### Case
```vue
<template>
	<view>
		<view class="text">—— 显示农历、24节气 ——</view>
		<week-fold-calendar @change="change" @inited="init" show-lunar-calendar show-solar-term show-festival :dots="dots" />

		<view class="text">—— 允许选择未来日期，默认展示周日历 ——</view>
		<week-fold-calendar @change="change" :dots="dots" allow-future default-view-type="week" />

		<view class="text">—— 渲染数据点key ——</view>
		<week-fold-calendar @change="change" @inited="init" :dots="dots" key-name="aa" />

		<view class="text">—— 限制过去的日期，默认展示月日历 ——</view>
		<week-fold-calendar @change="change" @inited="init" :dots="dots" min-date="2024-08-10" />

		<view class="text">—— 自定义样式 ——</view>
		<week-fold-calendar @change="change" :dots="dots" :custom-style="customStyle" active-color="black" />

		<view class="text">—— 默认日历 ——</view>
		<week-fold-calendar @change="change" :dots="dots" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dots: [
					{ date: '2024-07-10', value: 1 },
					{ date: '2024-07-12', value: 1 },
					{ date: '2024-07-20', value: 1 },
					{ date: '2024-08-02', value: 3 },
					{ date: '2024-08-03', value: 7 },
					{ date: '2024-08-04', value: 5 },
					{ date: '2024-08-05', value: 2 },
					{ date: '2024-08-10', value: 4 },
					{ date: '2024-08-20', aa: 1 },
					{ date: '2024-08-21', aa: 2 },
				],
				customStyle: {
					fontSize:'38rpx',
					color:'red', 
					fontWeight: 'normal',
					background:'#eee',
				}
			}
		},
		methods: {
			init(a) {
				console.log(a);
			},
			change(data) {
				console.log(data);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.text {
		text-align: center;
		margin: 40rpx 0;
		font-size: 24rpx;
		color: #aaa;
	}
</style>
```

# 赞赏-> 如果你觉得本插件解决了你的问题，赠人玫瑰，手留余香~
# 开源是目的，赞赏是动力~
