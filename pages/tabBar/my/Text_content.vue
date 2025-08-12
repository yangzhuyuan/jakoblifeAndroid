<template>
	<view style="padding: 10px; display: flex;background: #EFEFF4;color: black;height: 100vh;flex-direction: column;">
		<view class="title_bg">{{title}}</view>
		<view style="padding: 10px 10px 60px 10px">
			<rich-text :nodes="content"></rich-text>
		</view>
	</view>
</template>

<script>
	const lan = uni.getLocale();
	export default {
		data() {
			return {
				titles: "关于&更新",
				title: '',
				content: ''
			}
		},
		onLoad(res) {
			let that = this
			switch (res.id) {
				case "1134":
					that.titles = that.$t('给JakobLife好评')
					that.article(1134)
					break
				case "1131":
					that.titles = that.$t('JakobLife软件移动客户端用户使用规范1')
					that.article(1131)
					break
				case "1130":
					that.titles = that.$t('JakobLife隐私政策1')
					if (lan == 'zh-Hans') {
						that.article(1150)
					} else {
						that.article(1130)
					}
					break
				case "1":
					that.titles = that.$t('JakobLife软件移动客户端用户使用规范1')
					if (lan == 'zh-Hans') {
						that.article(1149)
					} else {
						that.article(1)
					}
					break
				case "1135":
					that.titles = that.$t('敏感个人信息处理情况说明1')
					that.article(1135)
					break
				case "1111":
					that.titles = that.$t('向第三方提供个人信息情况的说明1')
					that.article(1111)
					break
				case "1136":
					that.titles = that.$t('已收集个人信息清单1')
					that.article(1136)
					break
				case "1137":
					that.titles = that.$t('第三方共享个人清单1')
					that.article(1137)
					break
				case "1138":
					that.titles = that.$t('医疗器械使用安全提示1')
					that.article(1138)
					break
				case "1151":
					that.titles = that.$t('血压手表使用指南')
					if (lan == 'zh-Hans') {
						that.article(1151)
					} else {
						that.article(1155)
					}
					break
				case "1156":
					that.titles = that.$t('血压手表问题解答')
					if (lan == 'zh-Hans') {
						that.article(1156)
					} else {
						that.article(1157)
					}
					break
				case "1158":
					that.titles = that.$t('血压手表问题解答')
					if (lan == 'zh-Hans') {
						that.article(1158)
					} else {
						that.article(1159)
					}
					break
				case "1160":
					that.titles = that.$t('体脂秤问题解答')
					if (lan == 'zh-Hans') {
						that.article(1160)
					} else {
						that.article(1161)
					}
					break
				default:
					that.titles = that.$t('关于更新')
					break
			}
			uni.setNavigationBarTitle({
				title: that.titles
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
		justify-content: center;
		font-size: 16px;
		font-weight: bold;
		padding-top: 20px;
		padding-bottom: 20px;
	}
</style>