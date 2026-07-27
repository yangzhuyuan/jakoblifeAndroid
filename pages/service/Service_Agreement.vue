<template>
	<view class="agreement-page">
		<!-- 文章标题 -->
		<view class="article-title">{{ articleTitle }}</view>

		<!-- 文章内容区域 -->
		<view class="article-content">
			<rich-text :nodes="articleContent"></rich-text>
		</view>

		<!-- 底部协议确认区域 -->
		<view class="footer-section">
			<view class="agreement-checkbox">
				<checkbox class="round-checkbox" color="#ffffff" activeBorderColor="#D2D2D2"
					activeBackgroundColor="#3298F7" :checked="isChecked" @click="toggleCheckbox">
					{{ $t('我确认已满14周岁') }}
				</checkbox>
				<view class="agreement-links">
					<text class="agreement-text">{{ $t('勾选表示已阅读并同意') }}</text>
					<text class="agreement-link" @click="navigateToAgreement(1)">
						{{ $t('JakobLife软件移动客户端用户使用规范') }}
					</text>
					<text class="agreement-link" @click="navigateToAgreement(1130)">
						{{ $t('JakobLife隐私政策') }}
					</text>
				</view>
			</view>

			<button class="confirm-button" plain="true" :style="confirmButtonStyle" @tap="confirmAgreement">
				{{ $t('我已阅读并同意') }}
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'AgreementPage',
		data() {
			return {
				articleTitle: '', // 文章标题
				articleContent: '', // 文章内容（HTML格式）
				isChecked: false, // 是否勾选确认
				apiUrl: '' // API基础地址
			}
		},
		computed: {
			// 确认按钮样式
			confirmButtonStyle() {
				return {
					background: this.isChecked ? "#3298F7" : "#DBDBDB"
				}
			}
		},
		onLoad(options) {
			// 初始化API地址
			this.apiUrl = this.$url_APP_IP
			// 处理传入的勾选状态
			this.isChecked = options.CB === "true"
		},
		onShow() {
			this.initPage()
		},
		methods: {
			// 初始化页面
			initPage() {
				this.setNavigationTitle()
				this.loadArticle()
			},

			// 设置导航栏标题
			setNavigationTitle() {
				uni.setNavigationBarTitle({
					title: this.$t('使用协议')
				})
			},

			// 根据语言加载对应的文章
			loadArticle() {
				const currentLocale = uni.getLocale()
				// 简体或繁体中文使用1199，其他语言使用1
				const articleId = (currentLocale === 'zh-Hans' || currentLocale === 'zh-Hant') ? 1149 : 1
				this.fetchArticle(articleId)
			},

			// 请求文章内容
			fetchArticle(articleId) {
				const requestUrl = `${this.apiUrl}${this.$url_article}`

				uni.request({
					url: requestUrl,
					method: 'GET',
					data: {
						articleId
					},
					header: {
						'content-type': 'application/json'
					},
					success: this.handleArticleSuccess,
					fail: this.handleArticleError
				})
			},

			// 处理文章请求成功
			handleArticleSuccess(response) {
				const {
					data
				} = response.data || {}
				if (data) {
					this.articleTitle = data.title || ''
					this.articleContent = data.content || ''
				}
			},

			// 处理文章请求失败
			handleArticleError(error) {
				console.error('加载文章失败:', error)
				uni.showToast({
					title: this.$t('加载失败，请稍后重试'),
					icon: 'none'
				})
			},

			// 跳转到其他协议页面
			navigateToAgreement(agreementId) {
				uni.navigateTo({
					url: `../service/Usage_agreement?id=${agreementId}`
				})
			},

			// 切换复选框状态
			toggleCheckbox() {
				this.isChecked = !this.isChecked
			},

			// 确认同意协议
			confirmAgreement() {
				// 校验是否已勾选
				if (!this.isChecked) {
					uni.showToast({
						title: this.$t("请同意使用协议"),
						icon: "none"
					})
					return
				}

				// 发送勾选状态事件
				uni.$emit('checked', this.isChecked)

				// 返回上一页
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	.agreement-page {
		background: #F5F5F5;
		min-height: 100vh;
		color: black;
	}

	/* 文章标题 */
	.article-title {
		width: 100%;
		padding-top: 40px;
		display: flex;
		justify-content: center;
		font-size: 20px;
		font-weight: 500;
		text-align: center;
	}

	/* 文章内容区域 */
	.article-content {
		padding: 40px 20px 280px 20px;
		background: #F5F5F5;
		font-size: 12px;
		line-height: 1.6;
	}

	/* 底部区域 */
	.footer-section {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #F5F5F5;
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* 协议复选框区域 */
	.agreement-checkbox {
		margin: 40px 40px 0 40px;
		display: flex;
		flex-direction: column;
		font-size: 12px;
		color: #333333;
	}

	.round-checkbox {
		transform: scale(0.9);
	}

	/* 协议链接区域 */
	.agreement-links {
		display: flex;
		flex-direction: column;
		margin-top: 10px;
	}

	.agreement-text {
		margin-top: 5px;
	}

	.agreement-link {
		margin-top: 5px;
		color: #3298F7;
		text-decoration: underline;
	}

	/* 确认按钮 */
	.confirm-button {
		width: auto;
		height: 48px;
		border-radius: 30px;
		color: #FFFFFF !important;
		border: none !important;
		margin: 20px 20px 40px 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
	}
</style>