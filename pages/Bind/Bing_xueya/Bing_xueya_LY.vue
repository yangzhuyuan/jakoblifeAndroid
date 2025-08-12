<template>
	<view class="pagestyls">
		<view v-if="modelnametrue" class="modestys">
			<view class="shebeistyle">
				<image lazy-load class="imagestylsd" mode="aspectFit" :src="SELECT_TYPE === '0' ? imagess : imagess1" />
			</view>
			<view v-if="SELECT_TYPE === '0'">
				<view class="title_text_style">{{$t("设备配对说明")}}：</view>
				<view class="title_text_style">{{$t("设备上电")}}</view>
				<view class="title_text_style_1">{{$t("打开设备")}}</view>
				<view class="title_text_style">{{$t("准备配对")}}</view>
				<view class="title_text_style_1">{{$t("确保设备靠近你的手机")}}</view>
				<view class="title_text_style">{{$t("开始配对")}}</view>
				<view class="title_text_style_1">{{$t("导航到下一个屏幕以开始配对过程")}}</view>
				<view class="title_text_style_2">{{$t("在可用蓝牙设备列表中")}}<text class="textstyle">Jakoblife872B</text>。
				</view>
				<view class="title_text_style_3">
					{{$t("如果没有出现")}}<text class="textstyle">Jakoblife872B</text>，{{$t("点击屏幕顶部的刷新按钮")}}
				</view>
			</view>
			<view v-else>
				<view class="title_text_style">{{$t("设备配对说明")}}：</view>
				<view class="title_text_style">{{$t("请确认蓄电池已正确安装")}}</view>
				<view class="title_text_style">{{$t("走到体重计上")}}</view>
				<view class="title_text_style">{{$t("保持在天平上")}}</view>
				<view class="title_text_style">{{$t("开始配对体脂称")}}</view>
				<view class="title_text_style_1">{{$t("导航到下一个屏幕以开始配对过程")}}</view>
				<view class="title_text_style_2">
					{{$t("在可用蓝牙设备列表中")}}<text class="textstyle">EL2</text>。
				</view>
				<view class="title_text_style_3">{{$t("如果没有出现")}}
					<text class="textstyle">EL2</text>，{{$t("点击屏幕顶部的刷新按钮")}}
				</view>
			</view>
		</view>
		<view v-else class="modestys">
			<view class="shebeistyle">
				<image lazy-load class="imagsest_1" mode="aspectFit" :src="SELECT_TYPE === '0' ? imagess2 : imagess1" />
			</view>
			<view v-if="SELECT_TYPE === '0'">
				<view class="title_text_style">{{$t("手表配对说明")}}：</view>
				<view class="title_text_style">{{$t("打开设备1")}}</view>
				<view class="title_text_style_1">{{$t("接通手表电源")}}</view>
				<view class="title_text_style">{{$t("准备配对")}}</view>
				<view class="title_text_style_1">{{$t("确保手表靠近你的手机")}}</view>
				<view class="title_text_style">{{$t("开始配对")}}</view>
				<view class="title_text_style_1">{{$t("导航到下一个屏幕以开始配对过程")}}</view>
				<view class="title_text_style_2">
					{{$t("在可用蓝牙设备列表中")}}<text class="textstyle">BPW1</text>。
				</view>
				<view class="title_text_style_3">
					{{$t("如果没有出现")}}<text class="textstyle">BPW1</text>，{{$t("点击屏幕顶部的刷新按钮")}}
				</view>
			</view>
			<view v-else>
				<view class="title_text_style">{{$t("设备配对说明")}}：</view>
				<view class="title_text_style">{{$t("请确认蓄电池已正确安装")}}</view>
				<view class="title_text_style">{{$t("走到体重计上")}}</view>
				<view class="title_text_style">{{$t("保持在天平上")}}</view>
				<view class="title_text_style">{{$t("开始配对体脂称")}}</view>
				<view class="title_text_style_1">{{$t("导航到下一个屏幕以开始配对过程")}}</view>
				<view class="title_text_style_2">
					{{$t("在可用蓝牙设备列表中")}}<text class="textstyle">EL2</text>。
				</view>
				<view class="title_text_style_3">
					{{$t("如果没有出现")}}<text class="textstyle">EL2</text>，{{$t("点击屏幕顶部的刷新按钮")}}
				</view>
			</view>
		</view>
		<view>
			<view class="clesda">
				<checkbox style="font-size: 12px; margin-right:10px;" color="#ffffff" class="round"
					activeBackgroundColor="#3298F7" active-border-color="#D5D5D5" :checked="cb" @click="checked">
					{{$t('准备就绪')}}
				</checkbox>
			</view>
			<button plain class="btn" :style="{ background: cb ? '#3298F7' : '#DBDBDB' }"
				@click="btn_next()">{{$t('下一步')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cb: false,
				sn: '',
				serviceId: '',
				SELECT_TYPE: '',
				imagess: '../../../static/image/2.png',
				imagess1: '/static/image/tizhi1.jpg',
				imagess2: '../../../static/image/111.png',
				modelname: '',
				modelnametrue: true,
				modelId: '',
			}
		},

		onLoad(opt) {
			this.sn = opt.sn;
			this.SELECT_TYPE = opt.SELECT_TYPE;
			this.modelname = opt.modelname;
			this.modelnametrue = !this.modelname.includes("BPW");
			this.modelId = opt.modelId;
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("绑定设备")
			})
		},

		methods: {
			checked() {
				this.cb = !this.cb;
			},
			btn_next() {
				if (!this.cb) {
					uni.showToast({
						title: this.$t("是否准备就绪"),
						icon: 'none'
					});
					return;
				} else {
					uni.navigateTo({
						url: "../Bing_xueya/lanyashebe?SELECT_TYPE=" + this.SELECT_TYPE + "&sn=" + this.sn +
							"&modelId=" + this.modelId
					})
				}
			},
		}
	}
</script>

<style>
	.pagestyls {
		display: flex;
		color: black;
		flex-direction: column;
	}

	.modestys {
		display: flex;
		justify-self: center;
		flex-direction: column;
		width: 100vw;
	}

	.clesda {
		flex-direction: row;
		display: flex;
		margin-top: 100px;
		justify-content: center;
	}

	.shebeistyle {
		display: flex;
		width: auto;
		height: 301px;
		margin: 20px;
		align-items: center;
		justify-content: center;
		background: white;
		border-radius: 20px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.imagsest_1 {
		object-fit: contain;
		padding: 0 20px;
	}

	.imagestylsd {
		object-fit: contain;
		padding: 20px;
	}

	.title_text_style {
		margin: 5px 20px 0 20px;
		font-weight: 600;
		font-size: 14px;
	}

	.title_text_style_1 {
		margin: 5px 20px 0 30px;
		font-weight: 400;
		font-size: 12px;
	}

	.title_text_style_2 {
		margin: 5px 20px 0 20px;
		font-weight: 400;
		font-size: 12px;
	}

	.title_text_style_3 {
		margin: 0 20px 0 20px;
		font-weight: 400;
		font-size: 12px;
	}

	.textstyle {
		color: black;
		font-weight: 600;
		margin-left: 2px;
	}



	.btn {
		width: auto;
		margin: 20px 20px 88px 20px;
		border-radius: 100px;
		height: 48px;
		font-size: 16px;
		font-weight: 600;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #3298F7;
		color: white !important;
		border: none !important;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}
</style>