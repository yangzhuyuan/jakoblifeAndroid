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
			if (this.id == "1131") {
				uni.setNavigationBarTitle({
					title: this.$t('JakobLife软件移动客户端用户使用规范')
				})
				this.article(1131)
			} else if (this.id == "1130") {
				uni.setNavigationBarTitle({
					title: this.$t('JakobLife隐私政策1')
				})
				const lan = uni.getLocale();
				if (lan == 'zh-Hans') {
					this.article(1150)
				} else {
					this.article(1130)
				}
			} else if (this.id == "1135") {
				uni.setNavigationBarTitle({
					title: this.$t('敏感个人信息处理情况的说明')
				})
				this.article(1135)
			} else if (this.id == "1111") {
				uni.setNavigationBarTitle({
					title: this.$t('向第三方提供个人信息情况的说明')
				})
				this.article(1111)
			} else if (this.id == "1") {
				uni.setNavigationBarTitle({
					title: this.$t('服务协议1')
				})
				const lan = uni.getLocale();
				if (lan == 'zh-Hans') {
					this.article(1149)
				} else {
					this.article(1)
				}
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