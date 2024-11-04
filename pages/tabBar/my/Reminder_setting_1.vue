<template>
	<view style="padding: 15px;">
		<view style="padding: 10px;border-radius: 15px;background: white; ">
			<view style="font-weight: bold;margin-left: 10px;">{{$t('wodelist.txszitem.title_2')}}</view>
			<picker-view v-if="visible" indicator-class="picker-box" :value="value" @change="bindChange"
				class="picker-view">
				<picker-view-column class="view-column second" style="">
					<view class="item" v-for="(item,index) in hours" :key="index">{{item}}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item1" v-for="(item,index) in minutes" :key="index">{{item}}</view>
				</picker-view-column>
				<picker-view-column class="view-column first">
					<view class="item2" v-for="(item,index) in shangxias" :key="index">{{item}}</view>
				</picker-view-column>
			</picker-view>
		</view>

		<view style="background: white; border-radius: 15px; margin: 25px 0 0 0;">
			<view style="background: white; border-radius: 20px; margin-top: 10px;">
				<view class="bt_BG" @click="repeat()">
					<view class="text1">{{$t('wodelist.txszitem.title_3')}}</view>
					<view style="width: 60vw;  display: flex;flex-direction: row;align-items: center;">
						<view class="text_ct">{{weekly}}</view>
						<uni-icons type="forward" size="20" style="margin-left: 5px;"></uni-icons>
					</view>
				</view>
				<view style="width: 85%; height: 1px; background: gainsboro; margin-left:25px;"></view>
				<view class="bt_BG" @click="click_tag()">
					<view class="text1">{{$t('wodelist.txszitem.tx_title1')}}</view>
					<view style="width: 60vw; display: flex;flex-direction: row;align-items: center;">
						<view class="text_ct">{{tag}}</view>
						<uni-icons type="forward" size="20" style="margin-left: 5px;"></uni-icons>
					</view>
				</view>
				<view style="width: 85%; height: 1px; background: gainsboro; margin-left:25px;"></view>
				<view class="bt_BG" @click="Audio()">
					<view class="text1">{{$t('wodelist.txszitem.title_4')}}</view>
					<view style="width: 60vw; display: flex;flex-direction: row;align-items: center;">
						<view class="text_ct">{{Audios}}</view>
						<uni-icons type="forward" size="20" style="margin-left: 5px;"></uni-icons>
					</view>
				</view>
				<view style="width: 85%; height: 1px; background: gainsboro; margin-left:25px;"></view>
				<view class="btn_BG_1" @click="Vibration()">
					<view class="text">{{$t('wodelist.txszitem.title_5')}}</view>
					<switch style="transform:scale(0.6);margin-left: 5px;" :checked="chexk" color="#0686CC"></switch>
				</view>
				<view style="width: 85%; height: 1px; background: gainsboro; margin-left:25px;"></view>
				<view class="btn_BG_1" @click="Remind_later()">
					<view class="text">{{$t('wodelist.txszitem.title_6')}}</view>
					<switch style="transform:scale(0.6);margin-left: 5px;" :checked="chexk1" color="#0686CC"></switch>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			const date = new Date()
			const hours = []
			const hour = date.getHours() < 13 ? date.getHours() - 1 : (date.getHours() - 12) - 1
			const minutes = []
			const minute = date.getMinutes()
			const shangxias = []
			const shangxia = date.getHours() < 13 ? 0 : 1
			for (let i = 1; i <= 12; i++) {
				if (i < 10) {
					hours.push('0' + i)
				} else {
					hours.push(i)
				}
			}
			for (let i = 0; i <= 59; i++) {
				if (i < 10) {
					minutes.push("0" + i)
				} else {
					minutes.push(i)
				}
			}
			for (let i = 0; i <= 1; i++) {
				if (i < 1) {
					shangxias.push("AM")
				} else {
					shangxias.push("PM")
				}
			}
			return {
				weekly: "",
				title: 'picker-view',
				hours,
				hour: '',
				minutes,
				minute: '',
				shangxias,
				shangxia: '',
				value: [hour, minute, shangxia],
				times: (hour + 1) + ":" + (minute < 10 ? "0" + minute : minute) + (shangxia === 0 ? "AM" : "PM"),
				visible: true,
				indicatorStyle: "height: 50px; background-color: #82C2E5; z-index: 0;",
				chexk: false,
				chexk1: false,
				// Vibrations: "开",
				Audios: "",
				tag: '',
			}
		},





		onShow: function() {

			console.log(this.times)

			uni.setNavigationBarTitle({
				title: this.$t('wodelist.txsz')
			})

			let that = this

			//重复返回过来的数据
			uni.$once('repeat', function(data) {
				that.weekly = data.substr(0, data.lastIndexOf("、"))
			})

			//标签返回过来的数据
			uni.$once('input_tag', function(data) {
				that.tag = data
			})

			//震动返回过来的数据
			// uni.$once('Vibration', function(data) {
			// 	that.Vibrations = data
			// })

			//铃声返回过来的数据
			uni.$once('Audio', function(data) {
				that.Audios = data
			})
		},

		methods: {


			//时间
			bindChange: function(e) {
				const val = e.detail.value
				this.hour = this.hours[val[0]]
				this.minute = this.minutes[val[1]]
				if (this.shangxias[val[2]] === "AM") {
					this.shangxia = "AM"
				} else {
					this.shangxia = "PM"
				}
				this.times = this.hour + ":" + this.minute + this.shangxia
				console.log(this.times)
			},

			//重复
			repeat() {
				uni.navigateTo({
					url: "../my/repeat?data=" + this.weekly

				})
			},

			//标签
			click_tag() {
				uni.navigateTo({
					url: "../my/tag"
				})
			},

			//震动
			Vibration() {
				if (this.chexk == true) {
					this.chexk = false
					this.onFeedTap()
				} else {
					this.chexk = true
					this.onFeedTap()
				}
				// uni.navigateTo({
				// 	url: "../my/Vibration?data=" + this.Vibrations
				// })
			},

			onFeedTap() {
				let platform = uni.getSystemInfoSync().platform
				if (platform == "ios") {
					let UIImpactFeedbackGenerator = plus.ios.importClass('UIImpactFeedbackGenerator');
					let impact = new UIImpactFeedbackGenerator();
					impact.prepare();
					impact.init(1);
					impact.impactOccurred();
				}
				if (platform == "android") {
					let times = 5;
					let timerID = setInterval(() => {
						if (this.chexk === true) {
							times--
							// 震动
							plus.device.vibrate(1000);
							if (times < 1) {
								clearInterval(timerID)
							}
						} else {
							clearInterval(timerID)
						}
					}, 1000)


					// 震动
					// plus.device.vibrate(5000);
					// uni.vibrateLong({
					// 	success(res) {
					// 		console.log(res)
					// 	}
					// }, 5000)


					// this.codetime = 5
					// let timer = setInterval(() => {
					// 	this.codetime--
					// 	// 震动
					// 	plus.device.vibrate(500);
					// // 声音
					// let main = plus.android.runtimeMainActivity();
					// let RingtoneManager = plus.android.importClass("android.media.RingtoneManager");
					// let uri = RingtoneManager.getActualDefaultRingtoneUri(main, RingtoneManager
					// 	.TYPE_NOTIFICATION);
					// let MediaPlayer = plus.android.importClass("android.media.MediaPlayer");
					// let player = MediaPlayer.create(main, uri);
					// player.setLooping(false);
					// player.prepare();
					// player.start();
					// 	if (this.codetime < 1) {
					// 		this.cleask(timer);
					// 	}
					// }, 1000)

					//声音
					// let main = plus.android.runtimeMainActivity();
					// let RingtoneManager = plus.android.importClass("android.media.RingtoneManager");
					// let uri = RingtoneManager.getActualDefaultRingtoneUri(main, RingtoneManager.TYPE_NOTIFICATION);
					// let MediaPlayer = plus.android.importClass("android.media.MediaPlayer");
					// let player = MediaPlayer.create(main, uri);
					// player.setLooping(false);
					// player.prepare();
					// player.start();

				}
			},

			cleask(timer) {
				clearInterval(timer)
				clearTimeout(timer)

			},

			Remind_later() {
				if (this.chexk1 == true) {
					this.chexk1 = false
				} else {
					this.chexk1 = true
				}
			},
			//铃声
			Audio() {
				uni.navigateTo({
					url: "../my/Audio?data=" + this.Audios
				})
			},
		}
	}
</script>

<style>
	.select_bgss {
		color: black;
		width: 120px;
		text-align: center;
		background: white;
		border-radius: 20px;
	}

	.select_bgss_1 {
		color: white;
		width: 120px;
		text-align: center;
	}

	.picker-box {
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 40px;
		background: gray;
		opacity: 0.2;
		z-index: 2;
	}

	.view-column.second .picker-box {
		border-radius: 10px 0 0 10px;
	}

	.view-column.first .picker-box {
		border-radius: 0 10px 10px 0;
	}

	.picker-box::after {
		border-bottom: 0 solid #F4F4F5;

	}

	.picker-box::before {
		border-top: 0 solid #82C2E5;
	}

	.picker-view {
		margin-top: 10px;
		width: 80vw;
		margin-left: 10px;
		height: 180px;
		z-index: 1;
	}

	.item {
		margin-left: 80px;
		line-height: 35px;
		text-align: center;
		color: black;
		font-weight: bold;
	}

	.item1 {
		line-height: 35px;
		text-align: center;
		color: black;
		font-weight: bold;
	}

	.item2 {
		margin-right: 60px;
		line-height: 35px;
		text-align: center;
		color: black;
		font-weight: bold;
	}

	.bt_BG {
		display: flex;
		flex-direction: row;
		padding-top: 10px;
		padding-left: 10px;
		padding-bottom: 10px;

	}

	.btn_BG_1 {
		display: flex;
		align-items: center;
		display: flex;
		flex-direction: row;
		padding-top: 5px;
		padding-left: 10px;
		padding-bottom: 5px;

	}

	.text_ct {
		width: 48vw;
		color: grey;
		text-align: right;
		font-size: 14px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.text {
		width: 65vw;
		font-size: 16px;
		margin-left: 15px;
	}

	.text1 {
		width: 25vw;
		font-size: 16px;
		margin-left: 15px;
	}
</style>