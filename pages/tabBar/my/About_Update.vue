<template>
	<view style="padding: 20px; background: #F7F7F7; color: black;height: 100vh;background: #EFEFF4;">
		<view style="display: flex;align-items: center; flex-direction: column; margin-top: 40px;">
			<image src="../../../static/icons/96x96.png" style="width: 80px; height: 80px;"></image>
			<text style="margin-top: 20px;font-size: 18px; font-weight: bold;">JakobLife</text>
			<text style="margin-top: 10px;font-size: 12px; color: gray;">{{version}}</text>
			<text style="font-size: 12px; color: gray;">{{Record_number}}</text>
		</view>
		<view class="bg">

			<view class="bt_BG" @click="Text_content1()">
				<view class="text">{{$t('wodelist.gygxitem.title_2')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content2()">
				<view class="text">{{$t('wodelist.gygxitem.title_3')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content3()">
				<view class="text">{{$t('wodelist.gygxitem.title_4')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content4()">
				<view class="text">{{$t('wodelist.gygxitem.title_5')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content5()">
				<view class="text">{{$t('wodelist.gygxitem.title_6')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content6()">
				<view class="text">{{$t('wodelist.gygxitem.title_7')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content7()">
				<view class="text">{{$t('wodelist.gygxitem.title_8')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content8()">
				<view class="text">{{$t('wodelist.gygxitem.title_9')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			const systemInfo = uni.getSystemInfoSync();
			return {
				version: this.$t('wodelist.gygxitem.title_0') + systemInfo.appVersion,
				Record_number: this.$t('wodelist.gygxitem.title_1'),
			}
		},


		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.gygx')
			})
		},

		methods: {
			Text_content1() {
				uni.navigateTo({
					url: "../my/Text_content?id=1134"
				})
			},
			Text_content2() {
				uni.navigateTo({
					url: "../my/Text_content?id=1131"
				})
			},
			Text_content3() {
				uni.navigateTo({
					url: "../my/Text_content?id=1130"
				})
			},
			Text_content4() {
				uni.navigateTo({
					url: "../my/Text_content?id=1135"
				})
			},
			Text_content5() {
				uni.navigateTo({
					url: "../my/Text_content?id=1111"
				})
			},
			Text_content6() {
				uni.navigateTo({
					url: "../my/Text_content?id=1136"
				})
			},
			Text_content7() {
				uni.navigateTo({
					url: "../my/Text_content?id=1137"
				})
			},
			Text_content8() {
				uni.navigateTo({
					url: "../my/Text_content?id=1138"
				})
			},

		}
	}
</script>

<style>
	.bg {
		display: flex;
		flex-direction: column;
		margin-top: 40px;
		background: white;
		border-radius: 10px;
		padding-bottom: 10px;
		margin-bottom: 50px;
	}

	.bt_BG {
		display: flex;
		flex-direction: row;
		padding-top: 15px;
		padding-bottom: 5px;
		padding-left: 10px;
		align-items: center;

	}

	.text {
		width: 90%;
		font-size: 14px;
		margin-left: 10px;
	}
</style>