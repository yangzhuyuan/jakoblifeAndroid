<template>
	<view style="padding: 10px; display: flex;justify-content: center;background: #EFEFF4;color: black;height: 100vh;">
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
				titles: "关于&更新",
				title: '',
				content: ''
			}
		},


		onLoad(res) {
			if (res.id == "1134") {
				this.titles = this.$t('wodelist.gygxitem.title_2')
				this.article(1134)
			} else if (res.id == "1131") {
				this.titles = this.$t('wodelist.gygxitem.title_3')
				this.article(1131)
			} else if (res.id == "1130") {
				this.titles = this.$t('wodelist.gygxitem.title_4')
				this.article(1130)
			} else if (res.id == "1135") {
				this.titles = this.$t('wodelist.gygxitem.title_5')
				this.article(1135)
			} else if (res.id == "1111") {
				this.titles = this.$t('wodelist.gygxitem.title_6')
				this.article(1111)
			} else if (res.id == "1136") {
				this.titles = this.$t('wodelist.gygxitem.title_7')
				this.article(1136)
			} else if (res.id == "1137") {
				this.titles = this.$t('wodelist.gygxitem.title_8')
				this.article(1137)
			} else if (res.id == "1138") {
				this.titles = this.$t('wodelist.gygxitem.title_9')
				this.article(1138)
			} else {
				this.titles = this.$t('wodelist.gygx')
			}
			uni.setNavigationBarTitle({
				title: this.titles
			})
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