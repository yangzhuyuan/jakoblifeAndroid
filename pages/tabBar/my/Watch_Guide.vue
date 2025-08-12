<template>
	<view style="padding: 20px;background: #F7F7F7; color: black;height: 100vh;">
		<view style="font-weight: bold;">{{title}}</view>
		<view>
			<rich-text :nodes="content"></rich-text>
		</view>
		<view class="bt_bg">
			<view style="display: flex; flex-direction: column; ">
				<button class="bt_Accept" @click="Accept()">{{$t('已解决')}}</button>
				<button plain="true" class="bt_Turn_down" @click="Turn_down()">{{$t('继续反馈')}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "",
				content: ""

			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('血压手表绑定问题')
			})
			const lan = uni.getLocale();
			if (lan == 'zh-Hans') {
				this.article(1151)
			} else {
				this.article(1152)
			}

		},



		methods: {
			Accept() {
				uni.navigateBack()
			},
			Turn_down() {
				uni.showToast({
					title: "这里是未结局要去后台留言",
					icon: 'none'
				})
			},
			article(id) {
				let that = this
				uni.request({
					url: that.$url_article,
					method: 'GET',
					data: {
						articleId: id
					},
					header: {
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						console.log("根据文章id获取内容详细信息", res)
						that.title = res.data.data.title
						that.content = res.data.data.content
					}
				})
			},

		}
	}
</script>

<style>
	.bt_bg {
		background: #F5F5F5;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100vw;
	}

	.bt_Accept {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 20px 0 20px;
		height: 48px;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
		width: auto;
		color: white;
		background: #3298F7;

	}

	.bt_Turn_down {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20px;
		height: 48px;
		background: #DBDBDB !important;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
		width: auto;
		color: white !important;
		border: none !important;
	}
</style>