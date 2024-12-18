<template>
	<view style="background: #F1F1F1;height: 100vh;color: black;width: 100vw;">
		<view class="title_bg">{{title}}</view>
		<view style="padding: 20px 20px 260px 20px; background: #F1F1F1;">
			<rich-text :nodes="content"></rich-text>
		</view>
		<view style="width:100vw;position:fixed;bottom: 0; background: #F1F1F1;">
			<view class="pos_title">
				<checkbox style="font-size: 14px;" color="#ffffff" class="round" activeBorderColor="#D2D2D2"
					activeBackgroundColor="#3298F7" :checked="cb" @click="checked()">{{$t('SYXYitem.pos_0')}}
				</checkbox>
				<view style="margin-left: 32px; margin-top: 5px;">{{$t('SYXYitem.pos_1')}}</view>
				<view style="margin-left: 35px; margin-top: 5px;" @click="click_button(1131)">{{$t('SYXYitem.pos_2')}}
				</view>
				<view style="margin-left: 35px; margin-top: 5px;" @click="click_button(1130)">{{$t('SYXYitem.pos_3')}}
				</view>
				<view style="margin-left: 35px; margin-top: 5px;" @click="click_button(1135)">{{$t('SYXYitem.pos_4')}}
				</view>
				<view style="margin-left: 35px; margin-top: 5px;" @click="click_button(1111)">{{$t('SYXYitem.pos_5')}}
				</view>
			</view>
			<button class="button_back" :style="getback(cb)" @tap="btn_agree">{{$t('SYXYitem.button')}}</button>
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
				title: this.$t('SYXY_title')
			})
			this.article(1)
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
						console.log("根据文章id获取内容详细信息", res)
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

	.button_back {
		background: #3298F7;
		color: white;
		border-radius: 30px;
		margin: 20px
	}
</style>