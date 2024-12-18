### 注意事项
样式上使用了scss，结构简单，动画使用纯css3实现，vue2&vue3都可使用。后续会持续更新新的加载效果。文件大小不大，对文件大小有要求的可选择想要的加载效果提取出来，每种加载效果都是一个独立小组件

### 使用方法
`<yi-loading type="audio" color="#ffaa00" center ></yi-loading>`

### 参数
| 属性     | 类型      | 说明                                               | 默认值     |
|--------|---------|--------------------------------------------------|---------|
| type   | string  | 支持point-line、ring、ring-double、audio、garden、ripple | ring    |
| size   | number  | 单位px,调节加载效果的大小                                   | 45      |
| color  | string  | css颜色值                                           | #1e9fff |
| center | boolean | 基于父级元素自动居中                                       | false   |
| mask   | boolean | 是否开启遮罩蒙版，前提center为true时才会生效                      | false   |
| maskColor   | string  | css颜色值                         | rgba(0, 0, 0, .2)   |


### 简单示例文件
符合uni_modules标准，所以我这里属于自动引入了，js中没import  
vue2版本遇到uni_modules自动导入找不到文件的直接复制yi-loading/components/yi-loading 文件夹到自己的组件库再自行引入即可。  
只需引入yi-loading.vue的主组件，配置对应参数即可获得对应效果  
![image](https://masteryi-localhost.oss-cn-hangzhou.aliyuncs.com/uni-app/loading.gif)  

```
<template>
	<view class="page">
		<view class="card">
			<view class="title">ring</view>
			<view class="content">
				<yi-loading center></yi-loading>
			</view>
		</view>
		<view class="card">
			<view class="title">ripple</view>
			<view class="content">
				<yi-loading type="ripple" color="red" center mask></yi-loading>
			</view>
		</view>
		<view class="card">
			<view class="title">ring-double</view>
			<view class="content">
				<yi-loading type="ring-double" color="red" center></yi-loading>
			</view>
		</view>
		<view class="card">
			<view class="title">point</view>
			<view class="content">
				<yi-loading type="point" color="#ffaa00" center :size="20"></yi-loading>
			</view>
		</view>
		<view class="card">
			<view class="title">graden</view>
			<view class="content">
				<yi-loading type="graden" color="#ffaa00" center ></yi-loading>
			</view>
		</view>
		<view class="card">
			<view class="title">audio</view>
			<view class="content">
				<yi-loading type="audio" color="#ffaa00" center ></yi-loading>
			</view>
		</view>
		<view class="card">
			<view class="title">point-ring</view>
			<view class="content">
				<yi-loading type="point-ring" color="#ffaa00" center ></yi-loading>
			</view>
		</view>
		<view class="card">
			<view class="title">block</view>
			<view class="content">
				<yi-loading type="block" color="#ffaa00" center></yi-loading>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {
		},
		methods: {
		}
	}
</script>

<style lang="scss">
	.page {
		display: flex;
		flex-wrap: wrap;
		.card{
			width: 375rpx;
			.title{
				font-size: 16px;
				text-align: center;
				line-height: 30px;
			}
			.content{
				height: 100px;
			}
		}
	}
</style>
```

### 个人博客
博客地址：[http://www.masteryi.cn](http://www.masteryi.cn) (近期忙着自己的事业打理的少，稳定后会持续更新各类插件与文章上去，求关注)


