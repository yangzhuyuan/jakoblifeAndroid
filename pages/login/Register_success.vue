<template>
	<view style="background: #F7F7F7; color: black; height: 100vh;">
		<view class="titless">{{$t('恭喜您')}}</view>
		<view class="title_ct">{{$t('建议您完善以下信息')}}</view>
		<view class="bt_BG">
			<view class="text">{{$t('性别')}}</view>
			<view
				style="width: 70vw; display: flex;justify-content: flex-end; flex-direction: row;align-items: center;">
				<view class="uni-list-cell-db"
					style="width: 70vw; display: flex;justify-content: flex-end; flex-direction: row;margin-left: 15px;">
					<picker @change="bindPickerChange_sex" :value="sex_index" :range="sex_array">
						<view style="display: flex; flex-direction: row;align-items: center;">
							<view class="date_bg" :style="getStatusColor1(sex_index)">
								{{sex_index === "" ? $t('请选择') : sex_array[sex_index]}}
							</view>
						</view>
					</picker>
					<uni-icons type="bottom" size="20" style="margin-left: 5px; margin-right: 15px;"></uni-icons>
				</view>
			</view>
		</view>
		<view class="bt_BG">
			<view class="text">{{$t('出生日期')}}</view>
			<view class="uni-list-cell-db"
				style="width: 70vw; display: flex;justify-content: flex-end; flex-direction: row;margin-left: 15px;">
				<picker fields="day" mode="date" :value="date" @change="bindDateChange">
					<view style="display: flex; flex-direction: row;align-items: center;">
						<view class="date_bg" :style="getStatusColor(date)">{{date}}</view>
					</view>
				</picker>
				<uni-icons type="bottom" size="20" style="margin-left: 5px;margin-right: 15px;"></uni-icons>
			</view>
		</view>
		<view class="bt_BG">
			<view class="text">{{$t('身高')}}</view>
			<view style="display: flex; justify-content: flex-end;flex-direction: row; align-items: center;">
				<input type="number" :placeholder="$t('请输入')" v-model="height"
					style="color: black; text-align: right; font-size: 16px;" maxlength="5" />
				<view type="bottom" size="20" style="width: 60px; margin-right: 20px;font-size: 17px;">
					<picker @change="bindPickerChange_Height" :value="Height_index" :range="Height_array">
						<view class="uni-input" style="text-align: right;background: none;">
							{{Height_array[Height_index]}}
						</view>
					</picker>
				</view>
			</view>
		</view>
		<view class="bt_BG">
			<view class="text">{{$t('体重')}}</view>
			<view style=" display: flex; justify-content: flex-end; flex-direction: row; align-items: center;">
				<input type="number" :placeholder="$t('请输入')" v-model="width"
					style="color: black; text-align: right; font-size: 16px;" maxlength="5" />
				<view type="bottom" size="20" style="width: 60px; margin-right: 20px; font-size: 17px;">
					<picker @change="bindPickerChange_Width" :value="Width_index" :range="Width_array">
						<view class="uni-input" style="text-align: right;background: none;">{{Width_array[Width_index]}}
						</view>
					</picker>
				</view>
			</view>
		</view>
		<view style="position: fixed; bottom: 0;left: 0; width: 100vw;">
			<button class="btn_BG" @click="btn_success()">{{$t('完成')}}</button>
			<button class="btn_BG_1" @click="btn_skip()">{{$t('跳过')}}</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed: {
			...mapState(['tokens', 'unername'])
		},
		data() {
			return {
				sex_array: [this.$t("男"), this.$t("女")],
				sex_index: "",
				height: '',
				width: '',
				date: this.$t('请选择'),
				Height_array: ["inch", 'cm'],
				Height_index: uni.getStorageSync("danwei1") !== "" ? uni.getStorageSync("danwei1") : 1,
				Width_array: ["kg", "lb"],
				Width_index: uni.getStorageSync("danwei2") !== "" ? uni.getStorageSync("danwei2") : 0,
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("注册")
			})
		},

		methods: {
			bindPickerChange_sex: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.sex_index = e.detail.value
			},
			bindPickerChange_Height: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.Height_index = e.detail.value
			},
			bindPickerChange_Width: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.Width_index = e.detail.value
			},
			bindDateChange(e) {
				this.date = e.detail.value
			},
			btn_success() {
				if (this.sex_index === '' || this.sex_index === undefined) {
					uni.showToast({
						title: this.$t('请选择性别'),
						icon: 'none'
					})
					return
				} else if (this.date === '' || this.date === undefined || this.date === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('请选择出生日期'),
						icon: 'none'
					})
					return
				} else if (this.height === '' || this.height === undefined) {
					uni.showToast({
						title: this.$t('请输入身高'),
						icon: 'none'
					})
					return
				} else if (this.width === '' || this.width === undefined) {
					uni.showToast({
						title: this.$t('请输入体重'),
						icon: 'none'
					})
					return
				}
				this.update_info()
			},
			btn_skip() {
				if (this.tokens !== "0") {
					uni.setStorageSync("token", this.tokens)
					uni.switchTab({
						url: '/pages/tabBar/main/Main'
					})
				} else if (uni.getStorageSync("token")) {
					uni.switchTab({
						url: '/pages/tabBar/main/Main'
					})
				}
			},
			//更新个人信息
			update_info() {
				let that = this
				uni.request({
					url: that.$url_update_info,
					method: 'POST',
					data: {
						nickName: that.unername,
						sex: that.sex_index,
						birthTime: that.date,
						height: that.height,
						weight: that.width
					},
					header: {
						'Authorization': 'Bearer ' + (that.tokens === "0" ? uni.getStorageSync("token") : that
							.tokens),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success(res) {
						console.log("更新个人信息", res)
						if (res.data.code == 200) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							if (that.tokens !== "0") {
								uni.setStorageSync("token", that.tokens)
							}
							uni.setStorageSync("danwei1", that.Height_index)
							uni.setStorageSync("danwei2", that.Width_index)
							setTimeout(function() {
								uni.reLaunch({
									url: "../Bind/cs_manage?SHEBEI=0"
								})
							}, 300)
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			getStatusColor(status) {
				// 根据状态值返回不同的样式对象
				return {
					color: status === this.$t('请选择') ? 'gray' : 'black'
				};
			},
			getStatusColor1(status) {
				// 根据状态值返回不同的样式对象
				return {
					color: status === "" ? 'gray' : 'black'
				};
			}


		}
	}
</script>

<style>
	.titless {
		width: auto;
		font-size: 32px;
		margin-left: 40px;
		margin-right: 40px;
		padding-top: 33px;
		line-height: 45px;
		font-weight: bold;
	}

	.title_ct {
		margin-top: 20px;
		width: auto;
		height: 20px;
		margin-left: 40px;
		margin-right: 40px;
		font-size: 12px;
		color: gray;
	}

	.bt_BG {
		width: auto;
		height: 54px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		margin-left: 20px;
		margin-right: 20px;
		margin-top: 20px;
		background: white;
		border-radius: 50px;
	}

	.text {
		width: 30vw;
		font-size: 16px;
		margin-left: 15px;
		font-weight: bold;
	}

	.popup_bg {
		background: white;
		border-radius: 20px;
		margin-left: 20px;
		margin-right: 20px;
		margin-bottom: 10px;
	}

	.select_text {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 10px;
		height: 48px;
		font-size: 16px;
		font-weight: bold;
	}

	.btn_BG {
		width: auto;
		margin: 0 20px 24px 20px;
		color: white;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
		background: #3298F7;

	}

	.btn_BG_1 {
		width: auto;
		margin: 20px 20px 68px 20px;
		background: #3298F7;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
		color: #FFFFFF;
	}


	.select_bg {
		width: 100vw;
		text-align: right;
		margin-right: 5px;
		font-size: 16px;
	}

	.date_bg {
		text-align: center;
		font-size: 16px;
	}
</style>