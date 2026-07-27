<template>
	<view class="agreement-detail-page">
		<view class="article-title">{{ articleTitle }}</view>
		<view class="article-content">
			<rich-text :nodes="articleContent"></rich-text>
		</view>
	</view>
</template>

<script>
	/**
	 * 协议详情页面
	 * 根据传入的ID显示不同的协议内容
	 */
	export default {
		name: 'AgreementDetail',
		data() {
			return {
				articleTitle: '', // 文章标题
				articleContent: '', // 文章内容
				articleId: '' // 文章ID
			}
		},
		onLoad(options) {
			this.articleId = options.id
		},
		onShow() {
			this.initPage()
		},
		methods: {
			/**
			 * 初始化页面
			 */
			initPage() {
				const config = this.getPageConfig()
				if (config) {
					this.setNavigationTitle(config.navTitle)
					this.loadArticle(config.articleId)
				}
			},

			/**
			 * 获取页面配置
			 * @returns {Object|null} 页面配置对象或null
			 */
			getPageConfig() {
				const configMap = {
					// 用户使用规范
					'1131': {
						navTitle: this.$t('JakobLife软件移动客户端用户使用规范'),
						articleId: 1131
					},
					// 隐私政策
					'1130': {
						navTitle: this.$t('JakobLife隐私政策1'),
						getArticleId: () => {
							const locale = uni.getLocale()
							return (locale === 'zh-Hans' || locale === 'zh-Hant') ? 1150 : 1130
						}
					},
					// 敏感个人信息处理说明
					'1135': {
						navTitle: this.$t('敏感个人信息处理情况的说明'),
						articleId: 1135
					},
					// 第三方信息提供说明
					'1111': {
						navTitle: this.$t('向第三方提供个人信息情况的说明'),
						articleId: 1111
					},
					// 服务协议
					'1': {
						navTitle: this.$t('服务协议1'),
						getArticleId: () => {
							const locale = uni.getLocale()
							return (locale === 'zh-Hans' || locale === 'zh-Hant') ? 1149 : 1
						}
					}
				}

				const config = configMap[this.articleId]
				if (!config) {
					console.warn('未知的文章ID:', this.articleId)
					return null
				}

				// 处理动态文章ID
				if (config.getArticleId) {
					return {
						navTitle: config.navTitle,
						articleId: config.getArticleId()
					}
				}

				return {
					navTitle: config.navTitle,
					articleId: config.articleId
				}
			},

			/**
			 * 设置导航栏标题
			 * @param {string} title 标题
			 */
			setNavigationTitle(title) {
				uni.setNavigationBarTitle({
					title
				})
			},

			/**
			 * 加载文章内容
			 * @param {number} articleId 文章ID
			 */
			loadArticle(articleId) {
				const requestUrl = `${this.$url_APP_IP}${this.$url_article}`
				const requestData = {
					articleId
				}
				// console.log('根据文章id获取内容详细信息:', requestUrl, requestData)
				this.$get(requestUrl, requestData, {
						'content-type': 'application/json'
					})
					.then(this.handleArticleSuccess)
					.catch(this.handleArticleError)
			},

			/**
			 * 处理文章请求成功
			 * @param {Object} response 响应数据
			 */
			handleArticleSuccess(response) {
				// console.log('根据文章id获取内容详细信息:', response)
				const {
					data
				} = response || {}
				this.articleTitle = data?.title || ''
				this.articleContent = data?.content || ''
			},

			/**
			 * 处理文章请求失败
			 * @param {Object} error 错误信息
			 */
			handleArticleError(error) {
				console.error('根据文章id获取内容详细信息失败:', error)
				uni.showToast({
					title: this.$t('加载失败，请稍后重试'),
					icon: 'none'
				})
			}
		}
	}
</script>

<style scoped>
	.agreement-detail-page {
		color: black;
		min-height: 100vh;
		background: #F7F7F7;
	}

	/* 文章标题样式 */
	.article-title {
		width: 100%;
		display: flex;
		justify-content: center;
		font-size: 20px;
		font-weight: 500;
		padding-top: 40px;
		text-align: center;
	}

	/* 文章内容样式 */
	.article-content {
		padding: 10px 20px 60px 20px;
		line-height: 1.6;
		font-size: 14px;
	}

	/* rich-text 内部样式优化 */
	.article-content :deep(img) {
		max-width: 100%;
		height: auto;
	}

	.article-content :deep(p) {
		margin: 0 0 10px 0;
	}

	.article-content :deep(h1),
	.article-content :deep(h2),
	.article-content :deep(h3) {
		margin: 15px 0 10px 0;
	}
</style>