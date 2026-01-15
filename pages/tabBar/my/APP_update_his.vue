<template>
	<view style="padding: 10px; display: flex;background: #EFEFF4;color: black;height: 100vh;flex-direction: column;">
		<view style="padding: 10px 10px 60px 10px">
			<rich-text :nodes="content"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				titles: this.$t('APP历史版本'),
				content: ''
			}
		},


		onLoad(res) {
			if (res.id == "1166") {
				this.titles = this.$t('APP历史版本')
				const lan = uni.getLocale();
				if (lan == 'zh-Hans' || lan == 'zh-Hant') {
					this.article(1166)
				} else {
					this.article(1167)
				}
			} else {
				this.titles = this.$t('APP历史版本')
			}
			uni.setNavigationBarTitle({
				title: this.titles
			})
		},




		methods: {
			article(id) {
				let that = this
				uni.request({
					url: that.$url_APP_IP + that.$url_article,
					method: 'GET',
					data: {
						articleId: id
					},
					header: {
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						// 在赋值前处理内容
						that.content = that.formatContent(res.data.data.content)
					}
				})
			},
			// 完整的图片处理方法
			formatContent(html) {
				if (!html) return '';
				// 修复图片路径并添加样式
				const processedHtml = html.replace(/<img[^>]*src=['"]([^'"]+)['"][^>]*>/gi, (match, src) => {
					let newSrc = src;
					// 处理各种情况
					if (src.startsWith('//')) {
						// 双斜杠开头，添加 https:
						newSrc = 'https:' + src;
					} else if (src.startsWith('/')) {
						// 绝对路径，添加完整域名
						newSrc = this.$url_APP_IP + src;
					} else if (!src.startsWith('http')) {
						// 相对路径，添加基础URL
						newSrc = `${this.$url_APP_IP}/${src}`;
					}
					return `<img src="${newSrc}" style="max-width: 100%; height: auto; display: block;" />`;
				});
				return processedHtml;
			}
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