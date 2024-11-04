<template>
	<view>
		<view style="margin-bottom: 280rpx;">
			<view style="padding:20px 20px 0 20px;color: black;font-weight: bold;">请选择血压计型号</view>
			<view class="list-container">
				<view class="list-item" v-for="(item, index) in list" :key="index">
					<view style="display: flex;flex-direction:column;" @click="check_click(index)">
						<image style="width: 100%; height: 200rpx;display: flex; justify-content: center;"
							:src="item.imageurl"></image>
						<view style="text-align: center; margin-top: 40rpx;">{{item.title}}</view>
					</view>
				</view>
			</view>
		</view>
		<view
			style="background: white; width:100vw;height: 200rpx;  display: flex;position: fixed;bottom: 0; flex-direction: column; padding-top: 40rpx; padding-bottom: 50rpx;">
			<button style="width: 80%; background: skyblue; color: white; border-radius: 50rpx;" @tap="True">确定</button>
			<button style="margin-top: 40rpx; width: 80%; background: gray; color: white; border-radius: 50rpx;"
				@tap="True">暂不绑定</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						imageurl: '../../../static/image.png',
						title: '型号1'
					},
					{
						imageurl: '../../../static/image.png',
						title: '型号2'
					},
					{
						imageurl: '../../../static/image.png',
						title: '型号3'
					},
					{
						imageurl: '../../../static/image.png',
						title: '型号3'
					},
					{
						imageurl: '../../../static/image.png',
						title: '型号3'
					},
				]
			}
		},
		methods: {
			check_click(index) {
				console.log("dsajgdsa", index)

			},

		}
	}
</script>

<style>
	.list-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		padding: 5px;
		justify-content: space-between;
	}
	.list-item {
		/* 两列宽度分配比例 */
		/* 列表项间距 */
		background-color: #f3f3f3;
		background: white;
		border-radius: 10px;
		/* 背景色 */
		margin: 5px;
		padding: 5px;
		/* 内边距 */
		box-sizing: border-box;
		/* 盒模型 */
	}

	.even {
		margin-left: 4%;
		/* 偶数列表项左边距 */
	}
</style>