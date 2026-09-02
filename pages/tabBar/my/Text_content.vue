<template>
	<view class="page-container">
		<view class="title_bg">{{ title }}</view>
		<view class="content-wrapper">
			<rich-text :nodes="content"></rich-text>
		</view>
	</view>
</template>

<script>
	const lan = uni.getLocale();

	export default {
		data() {
			return {
				title: '',
				content: ''
			};
		},
		onLoad(res) {
			const {
				id
			} = res;
			const titleConfig = this.getTitleConfig(id);
			if (titleConfig) {
				this.title = titleConfig.title;
				const articleId = this.getArticleId(id, titleConfig.useLangCheck);
				this.fetchArticle(articleId);
			} else {
				this.title = this.$t('帮助中心');
			}
			uni.setNavigationBarTitle({
				title: this.title
			});
		},
		methods: {
			// 配置化管理文章标题和ID映射
			getTitleConfig(id) {
				const configMap = {
					'1134': {
						title: this.$t('给JakobLife好评'),
						articleId: 1134
					},
					'1131': {
						title: this.$t('JakobLife软件移动客户端用户使用规范1'),
						articleId: 1131
					},
					'1130': {
						title: this.$t('JakobLife隐私政策1'),
						articleId: 1130,
						useLangCheck: true,
						langMap: {
							'1150': ['zh-Hans', 'zh-Hant']
						}
					},
					'1': {
						title: this.$t('JakobLife软件移动客户端用户使用规范1'),
						articleId: 1,
						useLangCheck: true,
						langMap: {
							'1149': ['zh-Hans', 'zh-Hant']
						}
					},
					'1135': {
						title: this.$t('敏感个人信息处理情况说明1'),
						articleId: 1135
					},
					'1111': {
						title: this.$t('向第三方提供个人信息情况的说明1'),
						articleId: 1111
					},
					'1136': {
						title: this.$t('已收集个人信息清单1'),
						articleId: 1136
					},
					'1137': {
						title: this.$t('第三方共享个人清单1'),
						articleId: 1137
					},
					'1138': {
						title: this.$t('医疗器械使用安全提示1'),
						articleId: 1138
					},
					'1151': {
						title: this.$t('血压手表使用指南'),
						articleId: 1151,
						useLangCheck: true,
						langMap: {
							'1155': ['en']
						}
					},
					'1156': {
						title: this.$t('血压手表问题解答'),
						articleId: 1156,
						useLangCheck: true,
						langMap: {
							'1157': ['en']
						}
					},
					'1158': {
						title: this.$t('臂式电子血压计问题解答'),
						articleId: 1158,
						useLangCheck: true,
						langMap: {
							'1159': ['en']
						}
					},
					'1160': {
						title: this.$t('体脂秤问题解答'),
						articleId: 1160,
						useLangCheck: true,
						langMap: {
							'1161': ['en']
						}
					}
				};

				return configMap[id];
			},

			// 获取实际的文章ID（考虑语言版本）
			getArticleId(id, useLangCheck) {
				if (!useLangCheck) return parseInt(id);

				const config = this.getTitleConfig(id);
				if (!config || !config.langMap) return parseInt(id);

				const isChinese = lan === 'zh-Hans' || lan === 'zh-Hant';

				for (const [articleId, langArray] of Object.entries(config.langMap)) {
					if ((isChinese && langArray.includes('zh-Hans')) ||
						(!isChinese && langArray.includes('en'))) {
						return parseInt(articleId);
					}
				}

				return config.articleId || parseInt(id);
			},

			// 获取文章内容
			fetchArticle(articleId) {
				uni.request({
					url: this.$url_APP_IP + this.$url_article,
					method: 'GET',
					data: {
						articleId
					},
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						if (res.data && res.data.data) {
							this.content = this.formatContent(res.data.data.content);
						}
					},
					fail: (err) => {
						console.error("获取文章失败", err);
					}
				});
			},

			// 完整的图片处理方法
			formatContent(html) {
				if (!html) return '';
				let formattedHtml = html;
				// 移除 <url> 标签包裹层，提取真实地址
				formattedHtml = formattedHtml.replace(/<url[^>]*>(https?:\/\/[^<]+)<\/url>/gi, '$1');
				// 修复 img 标签的 src 属性
				formattedHtml = formattedHtml.replace(/<img([^>]*)src=["']([^"']+)["']([^>]*)>/gi, (match, before, src,
					after) => {
					let newSrc = src.trim();
					if (newSrc.startsWith('//')) {
						newSrc = 'https:' + newSrc;
					} else if (newSrc.startsWith('/')) {
						newSrc = this.$url_APP_IP + newSrc;
					} else if (!newSrc.startsWith('http')) {
						newSrc = `${this.$url_APP_IP}/${newSrc}`;
					}
					return `<img${before}src="${newSrc}"${after} style="max-width: 100%; height: auto; display: block;" />`;
				});
				return formattedHtml;
			}
		}
	};
</script>

<style>
	.page-container {
		padding: 10px;
		display: flex;
		background: #EFEFF4;
		color: black;
		height: 100vh;
		flex-direction: column;
	}

	.title_bg {
		display: flex;
		justify-content: center;
		font-size: 16px;
		font-weight: bold;
		padding-top: 20px;
		padding-bottom: 20px;
	}

	.content-wrapper {
		padding: 10px 10px 60px 10px;
	}
</style>