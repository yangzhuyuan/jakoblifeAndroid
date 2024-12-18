<template>
	<view style="padding: 20px; background: #F7F7F7; color: black; height: 100vh;">
		<view class="titless">绑定成功</view>
		<view class="title_ct">{{$t('zhuceitem.title_2')}}</view>
		<view class="bt_BG">
			<view class="text">{{$t('zhuceitem.title_3')}}</view>
			<view
				style="width: 70vw; display: flex;justify-content: flex-end; flex-direction: row;align-items: center;">
				<view class="select_bg" :style="getStatusColor(select)" @click="select_click()">
					{{select}}
				</view>
				<uni-icons type="bottom" size="20" style="margin-right: 15px;" @click="select_click()"></uni-icons>
			</view>
		</view>
		<view class="bt_BG">
			<view class="text">{{$t('zhuceitem.title_4')}}</view>
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
			<view class="text">{{$t('zhuceitem.title_5')}}</view>
			<view
				style="width: 70vw; display: flex; justify-content: flex-end;flex-direction: row; align-items: center;">
				<input type="number" :placeholder="$t('zhuceitem.title_8')" v-model="height"
					style="width: 100vw;color: black; text-align: right; font-size: 14px;" maxlength="5" />
				<view type="bottom" size="20" style="margin-left: 5px;margin-right: 30px;">cm</view>
			</view>
		</view>
		<view class="bt_BG">
			<view class="text">{{$t('zhuceitem.title_6')}}</view>
			<view
				style="width: 70vw; display: flex; justify-content: flex-end; flex-direction: row; align-items: center;">
				<input type="number" :placeholder="$t('zhuceitem.title_8')" v-model="width"
					style="width: 100vw;color: black; text-align: right; font-size: 14px;" maxlength="5" />
				<view type="bottom" size="20" style="margin-left: 5px;margin-right: 35px;">kg</view>
			</view>
		</view>
		<button class="btn_BG" @click="btn_success()">{{$t('zhuceitem.btn_1')}}</button>
		<view>
			<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" :mask-click="false">
				<view class="popup_bg">
					<view class="select_text" @click="sex_nan()">{{$t('zhuceitem.select_0')}}</view>
					<view style="border-top: 1px solid gainsboro;"></view>
					<view class="select_text" @click="sex_nv()">{{$t('zhuceitem.select_1')}}</view>
				</view>
			</uni-popup>
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
				sex: true,
				select: this.$t('zhuceitem.title_7'),
				height: '',
				width: '',
				date: this.$t('zhuceitem.title_7')
			}
		},

		methods: {
			

			select_click() {
				this.$refs.popup.open("bottom")
			},
			sex_nan() {
				this.sex = false
				this.select = this.$t('zhuceitem.select_0')
				this.$refs.popup.close()
			},
			sex_nv() {
				this.sex = false
				this.select = this.$t('zhuceitem.select_1')
				this.$refs.popup.close()
			},
			bindDateChange(e) {
				// let str = e.detail.value;
				// let t = str.replace("-", "年").replace("-", "月") + "日";
				// console.log(t);
				this.date = e.detail.value
			},
			btn_success() {
				if (this.select === '' || this.select === undefined || this.select === this.$t('zhuceitem.title_7')) {
					uni.showToast({
						title: this.$t('zhuceitem.toast_6'),
						icon: 'none'
					})
					return
				} else if (this.date === '' || this.date === undefined || this.date === this.$t('zhuceitem.title_7')) {
					uni.showToast({
						title: this.$t('zhuceitem.toast_7'),
						icon: 'none'
					})
					return
				} else if (this.height === '' || this.height === undefined) {
					uni.showToast({
						title: this.$t('zhuceitem.toast_8'),
						icon: 'none'
					})
					return
				} else if (this.width === '' || this.width === undefined) {
					uni.showToast({
						title: this.$t('zhuceitem.toast_9'),
						icon: 'none'
					})
					return
				}

				this.update_info()
			},
			//更新个人信息
			update_info() {
				uni.request({
					url: this.$url_update_info,
					method: 'POST',
					data: {
						nickName: this.unername,
						sex: this.select === this.$t('zhuceitem.select_0') ? "0" : "1",
						birthTime: this.date,
						height: this.height,
						weight: this.width
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},

					success(res) {
						console.log("更新个人信息", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
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
					color: status === this.$t('zhuceitem.title_7') ? 'gray' : 'black'
				};
			}


		}
	}
</script>

<style>
	.titless {
		font-size: 28px;
		margin-left: 20px;
		padding-top: 40px;
		line-height: 45px;
		font-weight: bold;
	}

	.title_ct {
		margin-left: 20px;
		margin-top: 20px;
		font-size: 12px;
		color: gray;
	}

	.bt_BG {
		display: flex;
		flex-direction: row;
		padding: 10px;
		background: white;
		margin: 20px 0 0 0;
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
		text-align: center;
		padding: 10px;
		font-size: 16px;
		font-weight: bold;
	}

	.btn_BG {
		font-weight: bold;
		margin-top: 80px;
		border-radius: 50px;
		background: #3298F7;
		color: white;
	}

	.btn_BG_1 {
		font-weight: bold;
		margin-top: 20px;
		border-radius: 50px;
		background: #DBDBDB;
		color: white;
	}


	.select_bg {
		width: 100vw;
		text-align: right;
		margin-right: 5px;
		font-size: 14px;
	}

	.date_bg {
		text-align: center;
		font-size: 14px;
	}
</style>