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


		onLoad(res) {
			if (res.id == "1") {
				uni.setNavigationBarTitle({
					title: this.$t('款体脂秤绑定教程')
				})
				this.article(1143)
			} else if (res.id == "2") {
				uni.setNavigationBarTitle({
					title: this.$t('款体脂秤绑定不了')
				})
				this.article(1144)
			} else if (res.id == "3") {
				uni.setNavigationBarTitle({
					title: this.$t('WIFI款体脂秤绑定教程')
				})
				this.article(1145)
			} else if (res.id == "4") {
				uni.setNavigationBarTitle({
					title: this.$t('WIFI款体脂秤绑定不了')
				})
				this.article(1146)
			}

		},


		methods: {
			Accept() {
				uni.navigateBack()
			},

			Turn_down() {
				uni.navigateTo({
					url: "/pages/tabBar/my/fankui"
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