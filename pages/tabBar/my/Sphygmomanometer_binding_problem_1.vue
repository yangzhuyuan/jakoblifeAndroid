<template>
	<view style="padding: 20px;color: black;height: 100vh;">
		<view style="margin-bottom: 160px;">
			<view style="font-weight: bold;">{{title}}</view>
			<view>
				<rich-text :nodes="content"></rich-text>
			</view>
		</view>
		<view class="bt_bg">
			<view style="display: flex; flex-direction: column; ">
				<button class="bt_Accept" @click="Accept()">{{$t('wodelist.bzzxitem.title_7')}}</button>
				<button class="bt_Turn_down" @click="Turn_down()">{{$t('wodelist.bzzxitem.title_8')}}</button>

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
					title: this.$t('wodelist.bzzxitem.title_3')
				})
				this.article(1139)
			} else if (res.id == "2") {
				uni.setNavigationBarTitle({
					title: this.$t('wodelist.bzzxitem.title_4')
				})
				this.article(1140)
			} else if (res.id == "3") {
				uni.setNavigationBarTitle({
					title: this.$t('wodelist.bzzxitem.title_5')
				})
				this.article(1141)
			} else if (res.id == "4") {
				uni.setNavigationBarTitle({
					title: this.$t('wodelist.bzzxitem.title_6')
				})
				this.article(1142)
			}
		},



		methods: {
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
		/* background: #F5F5F5; */
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100vw;
	}

	.bt_Accept {
		margin-top: 20px;
		background: #3298F7;
		border-radius: 40px;
		width: 90vw;
		color: white;
	}

	.bt_Turn_down {
		margin-top: 20px;
		margin-bottom: 20px;
		background: #DBDBDB;
		border-radius: 40px;
		width: 90vw;
		color: white;
	}
</style>