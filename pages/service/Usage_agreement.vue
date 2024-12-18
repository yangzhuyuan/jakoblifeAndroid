<template>
	<view style="color: black;height: 100vh; padding: 15px;">
		<view class="title_bg">{{title}}</view>
		<view style="padding: 20px; background: #F1F1F1;">
			<rich-text :nodes="content"></rich-text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				content: ''
			}
		},
		onLoad(opt) {
			console.log(opt)
			if (opt.id == "1131") {
				uni.setNavigationBarTitle({
					title: this.$t('SYXYitem.pos_2')
				})
				this.article(1131)
			} else if (opt.id == "1130") {
				uni.setNavigationBarTitle({
					title: this.$t('SYXYitem.pos_3')
				})
				this.article(1130)
			} else if (opt.id == "1135") {
				uni.setNavigationBarTitle({
					title: this.$t('SYXYitem.pos_4')
				})
				this.article(1135)
			} else if (opt.id == "1111") {
				uni.setNavigationBarTitle({
					title: this.$t('SYXYitem.pos_5')
				})
				this.article(1111)
			} else if (opt.id == "1") {
				uni.setNavigationBarTitle({
					title: "服务协议"
				})
				this.article(1)
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
		display: flex;
		justify-content: left;
		font-size: 16px;
		font-weight: bold;
		padding-top: 40px;
	}
</style>