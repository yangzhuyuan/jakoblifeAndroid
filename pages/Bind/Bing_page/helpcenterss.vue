<template>
	<view style="color: black;height: 100vh;background: #F7F7F7;">
		<view class="title_bg">{{title}}</view>
		<view style="padding: 10px 20px 60px 20px">
			<rich-text :nodes="content"></rich-text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				content: '',
				id: '',
			}
		},
		onLoad(opt) {
			console.log(opt)
			this.id = opt.id

		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('帮助')
			})
			if (this.id == "1153") {
				this.article(1153)
			} else if (this.id == "1154") {
				this.article(1154)
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
	.title_bg {
		width: auto;
		height: 28px;
		display: flex;
		justify-content: center;
		font-size: 20px;
		font-weight: 500;
		padding-top: 40px;
	}
</style>