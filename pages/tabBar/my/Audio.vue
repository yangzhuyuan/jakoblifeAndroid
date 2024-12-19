<template>
	<view style="padding: 20px 10px 10px 10px;background: #F7F7F7; color: black; height: 100vh;">
		<view style="background: white; padding: 10px;border-radius: 15px;">
			<view style="display: flex;flex-direction: row; padding:5px 0" @click="Select_a_song()">
				<view style="width: 80vw; margin-left: 5px;">{{$t('wodelist.txszitem.title_14')}}</view>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
		</view>
		<view style="background: white; padding: 0 10px;border-radius: 15px; margin-top: 20px;">
			<view class="audio_title_bg" @click="radar()">
				<view style="width: 80vw; margin-left: 5px;">{{$t('wodelist.txszitem.title_15')}}</view>
				<uni-icons v-show="radar_show" type="checkmarkempty" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view class="audio_title_bg" @click="wavy()">
				<view style="width: 80vw; margin-left: 5px;">{{$t('wodelist.txszitem.title_16')}}</view>
				<uni-icons v-show="wavy_show" type="checkmarkempty" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view class="audio_title_bg" @click="Inverted_reflection()">
				<view style="width: 80vw; margin-left: 5px;">{{$t('wodelist.txszitem.title_17')}}</view>
				<uni-icons v-show="Inverted_reflection_show" type="checkmarkempty" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view class="audio_title_bg" @click="Lighthouse()">
				<view style="width: 80vw; margin-left: 5px;">{{$t('wodelist.txszitem.title_18')}}</view>
				<uni-icons v-show="Lighthouse_show" type="checkmarkempty" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view class="audio_title_bg" @click="hilltop()">
				<view style="width: 80vw; margin-left: 5px;">{{$t('wodelist.txszitem.title_19')}}</view>
				<uni-icons v-show="hilltop_show" type="checkmarkempty" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view class="audio_title_bg" @click="Crystal()">
				<view style="width: 80vw; margin-left: 5px;">{{$t('wodelist.txszitem.title_20')}}</view>
				<uni-icons v-show="Crystal_show" type="checkmarkempty" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view class="audio_title_bg" @click="There_is_no()">
				<view style="width: 80vw; margin-left: 5px;">{{$t('wodelist.txszitem.title_21')}}</view>
				<uni-icons v-show="There_is_no_show" type="checkmarkempty" size="16"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	export default {
		data() {
			return {
				radar_show: true,
				wavy_show: false,
				Inverted_reflection_show: false,
				Lighthouse_show: false,
				hilltop_show: false,
				Crystal_show: false,
				There_is_no_show: false,
				Audios: "",

			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.txszitem.title_4')
			})
		},

		onLoad(res) {
			if (res.data == this.$t('wodelist.txszitem.title_15')) {
				this.radar_show = true
				this.wavy_show = false
				this.Inverted_reflection_show = false
				this.Lighthouse_show = false
				this.hilltop_show = false
				this.Crystal_show = false
				this.There_is_no_show = false
			} else if (res.data == this.$t('wodelist.txszitem.title_16')) {
				this.radar_show = false
				this.wavy_show = true
				this.Inverted_reflection_show = false
				this.Lighthouse_show = false
				this.hilltop_show = false
				this.Crystal_show = false
				this.There_is_no_show = false
			} else if (res.data == this.$t('wodelist.txszitem.title_17')) {
				this.radar_show = false
				this.wavy_show = false
				this.Inverted_reflection_show = true
				this.Lighthouse_show = false
				this.hilltop_show = false
				this.Crystal_show = false
				this.There_is_no_show = false
			} else if (res.data == this.$t('wodelist.txszitem.title_18')) {
				this.radar_show = false
				this.wavy_show = false
				this.Inverted_reflection_show = false
				this.Lighthouse_show = true
				this.hilltop_show = false
				this.Crystal_show = false
				this.There_is_no_show = false
			} else if (res.data == this.$t('wodelist.txszitem.title_19')) {
				this.radar_show = false
				this.wavy_show = false
				this.Inverted_reflection_show = false
				this.Lighthouse_show = false
				this.hilltop_show = true
				this.Crystal_show = false
				this.There_is_no_show = false
			} else if (res.data == this.$t('wodelist.txszitem.title_20')) {
				this.radar_show = false
				this.wavy_show = false
				this.Inverted_reflection_show = false
				this.Lighthouse_show = false
				this.hilltop_show = false
				this.Crystal_show = true
				this.There_is_no_show = false
			} else if (res.data == this.$t('wodelist.txszitem.title_21')) {
				this.radar_show = false
				this.wavy_show = false
				this.Inverted_reflection_show = false
				this.Lighthouse_show = false
				this.hilltop_show = false
				this.Crystal_show = false
				this.There_is_no_show = true
			} else if (res.data == this.$t('wodelist.txszitem.title_14')) {
				this.radar_show = false
				this.wavy_show = false
				this.Inverted_reflection_show = false
				this.Lighthouse_show = false
				this.hilltop_show = false
				this.Crystal_show = false
				this.There_is_no_show = false
			} else {
				this.radar_show = true
				this.wavy_show = false
				this.Inverted_reflection_show = false
				this.Lighthouse_show = false
				this.hilltop_show = false
				this.Crystal_show = false
				this.There_is_no_show = false
			}
		},

		onBackPress() {
			if (this.radar_show == true) {
				this.Audios = this.$t('wodelist.txszitem.title_15')
			} else if (this.wavy_show == true) {
				this.Audios = this.$t('wodelist.txszitem.title_16')
			} else if (this.Inverted_reflection_show == true) {
				this.Audios = this.$t('wodelist.txszitem.title_17')
			} else if (this.Lighthouse_show == true) {
				this.Audios = this.$t('wodelist.txszitem.title_18')
			} else if (this.hilltop_show == true) {
				this.Audios = this.$t('wodelist.txszitem.title_19')
			} else if (this.Crystal_show == true) {
				this.Audios = this.$t('wodelist.txszitem.title_20')
			} else if (this.There_is_no_show == true) {
				this.Audios = this.$t('wodelist.txszitem.title_21')
			} else {
				this.Audios = this.$t('wodelist.txszitem.title_14')
			}
			uni.$emit('Audio', this.Audios)
			delta: 1
		},

		methods: {

			Select_a_song() {
				this.radar_show = false
				this.wavy_show = false
				this.Inverted_reflection_show = false
				this.Lighthouse_show = false
				this.hilltop_show = false
				this.Crystal_show = false
				this.There_is_no_show = false
			},

			//雷达
			radar() {
				this.radar_show = true
				this.wavy_show = false
				this.Inverted_reflection_show = false
				this.Lighthouse_show = false
				this.hilltop_show = false
				this.Crystal_show = false
				this.There_is_no_show = false
				if (uni.getSystemInfoSync().platform === "android") {
					innerAudioContext.src = 'http://localhost:8080/static/autio/lieda.mp3';
					innerAudioContext.onPlay(() => {
						console.log('开始播放');
					});
					innerAudioContext.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});
				} else {
					const innerAudioContext = uni.createInnerAudioContext();
					innerAudioContext.autoplay = true;
					innerAudioContext.src = '/static/autio/lieda.mp3'; //铃声文件的路径
					innerAudioContext.onPlay(() => {
						console.log('开始播放');
					});
					innerAudioContext.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});
				}


			},




			//波浪
			wavy() {
				this.radar_show = false
				this.wavy_show = true
				this.Inverted_reflection_show = false
				this.Lighthouse_show = false
				this.hilltop_show = false
				this.Crystal_show = false
				this.There_is_no_show = false
				if (uni.getSystemInfoSync().platform === "android") {
					innerAudioContext.src = 'http://localhost:8080/static/autio/bolang.mp3';
					innerAudioContext.onPlay(() => {
						console.log('开始播放');
					});
					innerAudioContext.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});
				} else {
					innerAudioContext.src = '/static/autio/bolang.mp3';
					innerAudioContext.onPlay(() => {
						console.log('开始播放');
					});
					innerAudioContext.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});
				}
			},
			//倒影
			Inverted_reflection() {
				this.radar_show = false
				this.wavy_show = false
				this.Inverted_reflection_show = true
				this.Lighthouse_show = false
				this.hilltop_show = false
				this.Crystal_show = false
				this.There_is_no_show = false
				if (uni.getSystemInfoSync().platform === "android") {
					innerAudioContext.src = 'http://localhost:8080/static/autio/daoying.mp3';
					innerAudioContext.onPlay(() => {
						console.log('开始播放');
					});
					innerAudioContext.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});
				} else {
					innerAudioContext.src = '/static/autio/daoying.mp3';
					innerAudioContext.onPlay(() => {
						console.log('开始播放');
					});
					innerAudioContext.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});
				}
			},
			//灯塔
			Lighthouse() {
				this.radar_show = false
				this.wavy_show = false
				this.Inverted_reflection_show = false
				this.Lighthouse_show = true
				this.hilltop_show = false
				this.Crystal_show = false
				this.There_is_no_show = false
				if (uni.getSystemInfoSync().platform === "android") {
					innerAudioContext.src = 'http://localhost:8080/static/autio/dengta.mp3';
					innerAudioContext.onPlay(() => {
						console.log('开始播放');
					});
					innerAudioContext.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});

				} else {
					innerAudioContext.src = '/static/autio/dengta.mp3';
					innerAudioContext.onPlay(() => {
						console.log('开始播放');
					});
					innerAudioContext.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});
				}
			},
			//山顶
			hilltop() {
				this.radar_show = false
				this.wavy_show = false
				this.Inverted_reflection_show = false
				this.Lighthouse_show = false
				this.hilltop_show = true
				this.Crystal_show = false
				this.There_is_no_show = false
				if (uni.getSystemInfoSync().platform === "android") {
					innerAudioContext.src = 'http://localhost:8080/static/autio/shanding.mp3';
					innerAudioContext.onPlay(() => {
						console.log('开始播放');
					});
					innerAudioContext.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});

				} else {
					innerAudioContext.src = '/static/autio/shanding.mp3';
					innerAudioContext.onPlay(() => {
						console.log('开始播放');
					});
					innerAudioContext.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});
				}
			},

			//水晶
			Crystal() {
				this.radar_show = false
				this.wavy_show = false
				this.Inverted_reflection_show = false
				this.Lighthouse_show = false
				this.hilltop_show = false
				this.Crystal_show = true
				this.There_is_no_show = false
				if (uni.getSystemInfoSync().platform === "android") {
					innerAudioContext.src = 'http://localhost:8080/static/autio/shuijing.mp3';
					innerAudioContext.onPlay(() => {
						console.log('开始播放');
					});
					innerAudioContext.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});
				} else {
					innerAudioContext.src = '/static/autio/shuijing.mp3';
					innerAudioContext.onPlay(() => {
						console.log('开始播放');
					});
					innerAudioContext.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});
				}
			},
			There_is_no() {
				this.radar_show = false
				this.wavy_show = false
				this.Inverted_reflection_show = false
				this.Lighthouse_show = false
				this.hilltop_show = false
				this.Crystal_show = false
				this.There_is_no_show = true
				innerAudioContext.stop(() => {
					console.log('停止播放');
				});
				innerAudioContext.onError((res) => {
					console.log(res.errMsg);
					console.log(res.errCode);
				});
			},
		}
	}
</script>

<style>
	.audio_title_bg {
		display: flex;
		align-items: center;
		flex-direction: row;
		padding: 10px 0;
	}
</style>