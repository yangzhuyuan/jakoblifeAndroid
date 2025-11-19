# Lt-ECG 使用说明

## 〇、简介

- 这是一个 H5 端、小程序端的展示ECG心电图的组件

## 一、使用说明

- 右侧点击使用 ``HBuilderX 导入插件``

- 引用组件

```javascript
<Lt-ECG :ecgArr="ecgArr" :pageNum="0"></Lt-ECG>
```

- Demo体验 ：[点此跳转](http://lovetwelve.fun/ecg/index.html)

- 如果这个插件帮到了您的项目，请麻烦来给个评分谢谢。提出宝贵的意见当然更好！

## 二、参数说明

- props

|  参数名	| 类型	| 说明					| 必填	| 默认值|
|  ----		| ----	|  ----					|  ----	|  ----	|
| ecgArr	| Array	|  心电数据			| 是		|[]			|
| pageNum	| Number|  当前为第几页<sup>[1]</sup>	| 是		|0			|

## 三、事件说明

- events

|  事件名称	|   说明| 传参	|  说明	|回调参数	|
|  ----			|  ----	|  ----	|  ----	|  ----		|
| --				| --		| --		|  --		|   --		|


## 四、示例代码

```html
<template>
	<view class="content">
		<text class="unit-text">1mV</text>
		<Lt-ECG :ecgArr="ecgArr" :pageNum="0"></Lt-ECG>
		<text class="unit-time-text">10s</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ecgArr: []
			}
		},
		onLoad() {
			this.getData();
		},
		methods: {
			getData() {
				uni.request({ // 仅为示例
					url: 'https://www.fastmock.site/mock/795a674f2fae747b20f110e572ccc16a/sleepValue/ECG',
					success: (res) => {
						if (res.data.state === 200) {
							if (res.data.data.type === 1) {
								this.ecgArr = JSON.parse(res.data.data.data1);
							} else if (res.data.data.type === 2) {
								this.ecgArr = [JSON.parse(res.data.data.data1), JSON.parse(res.data.data
									.data2), JSON
									.parse(res.data.data.data3)
								]
							}
							// else if (res.data.data.type === 3) {
							// 	console.log("十二导心电");
							// }
						}
					}
				});
			}
		}
	}
</script>

<style>
	.unit-text {
		position: absolute;
		top: 50rpx;
		left: 0;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.unit-time-text {
		position: absolute;
		left: 0;
	}
</style>

```

## 五、其他说明

- [1]：做类似分页的功能主要是为了兼容微信小程序，其 canvas 最多画10s左右，心电数据一般都是30s

- 数据演示

```javascript
uni.request({ // 仅为示例
	url: 'https://www.fastmock.site/mock/795a674f2fae747b20f110e572ccc16a/sleepValue/ECG',
	success: (res) => {
		if (res.data.state === 200) {
			this.ecgArr = JSON.parse(res.data.data.data1); // 数据量过大，故采取JSON格式的数组
		}
	}
});
```