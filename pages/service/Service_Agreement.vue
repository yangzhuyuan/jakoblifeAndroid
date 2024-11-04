<template>
	<view style="background: #F1F1F1;height: 100vh;">
		<view class="title_bg">《JakobLife软件服务使用协议》</view>
		<view style="padding: 20px; background: #F1F1F1;">
			<view>JakobLife为您提供与部分JakobLife健康产品配套的相关健康管理服务（包括健康数据管理等）。</view>
			<view style="margin-top: 20px;padding-bottom: 400px;">{{context}}</view>
		</view>
		<view style="width:100vw;position:fixed;bottom: 0; background: #F1F1F1;">
			<view class="pos_title">
				<checkbox style="font-size: 14px;" color="#ffffff" class="round" activeBorderColor="#D2D2D2"
					activeBackgroundColor="#3298F7" :checked="cb" @click="checked()">{{$t('SYXYitem.pos_0')}}
				</checkbox>
				<view style="margin-left: 32px; margin-top: 5px;">{{$t('SYXYitem.pos_1')}}</view>
				<view style="margin-left: 35px; margin-top: 5px;">{{$t('SYXYitem.pos_2')}}</view>
				<view style="margin-left: 35px; margin-top: 5px;">{{$t('SYXYitem.pos_3')}}</view>
				<view style="margin-left: 35px; margin-top: 5px;">{{$t('SYXYitem.pos_4')}}</view>
				<view style="margin-left: 35px; margin-top: 5px;">{{$t('SYXYitem.pos_5')}}</view>
			</view>
			<button style="background: #3298F7; color: white; border-radius: 30px; margin: 20px"
				@tap="btn_agree">{{$t('SYXYitem.button')}}</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				context: '若要继续,请确保已经阅读并充分理解的前提下勾选并同意以下的必要协议。《JakobLife软件移动客户端用户使用规范》、《JakobLife隐私政策》、《敏感个人信息处理情况的说明》、《向第三方提供个人信息情况的说明》，可让您知道我们如何处理您的个人信息以及您享有的相关权力。',
				cb: false,
			}
		},
		
		onShow() {
			uni.setNavigationBarTitle({
				title:this.$t('SYXY_title')
			})
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
						title: "请同意使用协议",
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
		display: flex;
		justify-content: center;
		font-size: 22px;
		font-weight: bold;
		padding-top: 40px;
	}

	.pos_title {

		margin: 20px 20px 0 20px;
		display: flex;
		flex-direction: column;
		margin-bottom: 10px;
	}
</style>