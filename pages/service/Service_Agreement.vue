<template>
	<view style="background: #F5F5F5;height: 100vh;color: black;">
		<view class="title_bg">{{title}}</view>
		<view style="padding: 40px 20px 280px 20px; background: #F5F5F5; font-size: 12px;">
			<rich-text :nodes="content"></rich-text>
		</view>
		<view style="width:100vw;position:fixed;bottom: 0; background: #F5F5F5;">
			<view class="pos_title">
				<checkbox color="#ffffff" class="round" activeBorderColor="#D2D2D2" activeBackgroundColor="#3298F7"
					:checked="cb" @click="checked()">{{$t('我确认已满14周岁')}}
				</checkbox>
				<view style="margin-top: 5px; ">{{$t('勾选表示已阅读并同意')}}</view>
				<view style="margin-top: 5px;" @click="click_button(1)">{{$t('JakobLife软件移动客户端用户使用规范')}}
				</view>
				<view style="margin-top: 5px;" @click="click_button(1130)">{{$t('JakobLife隐私政策')}}
				</view>
			<!-- 	<view style="margin-top: 5px;" @click="click_button(1135)">{{$t('敏感个人信息处理情况的说明')}}
				</view>
				<view style=" margin-top: 5px;" @click="click_button(1111)">{{$t('向第三方提供个人信息情况的说明')}}
				</view> -->
			</view>
			<button class="button_back" plain="true" :style="getback(cb)"
				@tap="btn_agree">{{$t('我已阅读并同意')}}</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				content: '',
				cb: false,
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('使用协议')
			})
			const lan = uni.getLocale();
			if (lan == 'zh-Hans') {
				this.article(1149)
			} else {
				this.article(1)
			}
			
		},

		onLoad(res) {
			console.log(res)
			if (res.CB == "false") {
				this.cb = false
			} else {
				this.cb = true
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
						that.title = res.data.data.title
						that.content = res.data.data.content
					}
				})
			},


			getback(id) {
				return {
					background: id == false ? "#DBDBDB" : "#3298F7"
				}
			},

			click_button(id) {
				uni.navigateTo({
					url: '../service/Usage_agreement?id=' + id
				})
			},

			checked() {
				if (this.cb == true) {
					this.cb = false;
				} else {
					this.cb = true;
				}
			},

			btn_agree() {
				if (this.cb == false) {
					uni.showToast({
						title: this.$t("请同意使用协议"),
						icon: "none"
					})
					return
				}
				uni.$emit('checked', this.cb)
				uni.navigateBack(function() {
					delta: 1
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

	.pos_title {
		width: auto;
		margin: 40px 40px 0 40px;
		display: flex;
		font-size: 12px;
		color: #333333;
		flex-direction: column;
		margin-bottom: 10px;
	}

	.button_back {
		width: auto;
		height: 48px;
		background: #3298F7;
		border-radius: 30px;
		color: #FFFFFF !important;
		border: none !important;
		margin: 20px 20px 40px 20px
	}
</style>