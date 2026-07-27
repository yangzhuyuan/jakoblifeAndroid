<template>
	<view style="background: #F7F7F7; color: black; height: 100vh;">
		<view class="titless">{{$t("绑定成功")}}</view>
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
						<uni-icons type="bottom" size="20" style="margin-left: 5px; margin-right: 15px;"></uni-icons>
					</view>
				</picker>
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
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import WeightConverter from '../../pages/api/unitls/weightConverter.js';
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
				Height_array: [this.$t("英寸"), this.$t("厘米")],
				Height_index: uni.getStorageSync("danwei1") !== "" ? uni.getStorageSync("danwei1") : 1,
				Width_array: [this.$t("千克"), this.$t("英镑")],
				Width_index: uni.getStorageSync("danwei2") !== "" ? uni.getStorageSync("danwei2") : 0,
			}
		},


		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("绑定成功")
			})
		},

		methods: {
			bindPickerChange_sex: function(e) {
				this.sex_index = e.detail.value
			},
			bindPickerChange_Height: function(e) {
				this.Height_index = e.detail.value
			},
			bindPickerChange_Width: function(e) {
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
			//更新个人信息
			update_info() {
				let that = this
				uni.request({
					url: that.$url_APP_IP + that.$url_update_info,
					method: 'POST',
					data: {
						nickName: that.unername,
						sex: that.sex_index,
						birthTime: that.date,
						height: that.Height_index === 0 ? WeightConverter.inchToCm(that.height) : that.height,
						weight: that.Width_index === 0 ? that.width : WeightConverter.lbToKg(that.width)

					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success(res) {
						console.log("更新个人信息", res)
						if (res.data.code == 200) {
							uni.showToast({
								title: that.$t("成功"),
								icon: 'none'
							})
							that.saveUnit(that.Height_index, that.Width_index)
							setTimeout(function() {
								uni.switchTab({
									url: '/pages/tabBar/main/Main'
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
			// 保存单位
			saveUnit(Height_index, Width_index) {
				const postData = {
					bloodUnit: uni.getStorageSync("Blood") === 0 || uni.getStorageSync("Blood") === "" ? "mmHg" :
						"kPa",
					heightUnit: Height_index === 0 || Height_index === "" ? this.$t("英寸") : this.$t("厘米"),
					weightUnit: Width_index === 0 || Width_index === "" ? this.$t("千克") : this.$t("英镑"),
					switchHER: uni.getStorageSync("yaliswitchHER") || true,
				}
				const editData = {
					dataType: 'Unitdata',
					data: this.formatDatacard([postData])
				}
				console.log(editData)
				this.$post(this.$url_APP_IP + '/prod-api/device/data/editData', editData, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json'
				}).then(res => {
					if (res.code === 200) {
						console.log(res)
						uni.setStorageSync("danwei1", Height_index)
						uni.setStorageSync("danwei2", Width_index)
					}
				})
			},
			// 格式化数据为接口格式
			formatDatacard(dataArray) {
				return dataArray.map(obj => JSON.stringify(obj).replace(/"/g, '')).join(',')
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
		margin: 20px 20px 68px 20px;
		background: #3298F7;
		color: white;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
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