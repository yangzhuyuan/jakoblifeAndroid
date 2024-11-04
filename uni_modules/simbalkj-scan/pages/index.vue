<template>
    <view class="scan"> 
        <view class="codeScan">
			<!-- #ifdef MP-WEIXIN -->
            <wx-scan ref="scanOrder" @getCode="getCode" />
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<app-scan ref="appScan" @getCode="getCode"></app-scan>
			<!-- #endif -->
        </view>
		<view class="proBox">
			您的扫码结果是：{{code}}
		</view>
    </view>
</template>

<script>

import wxScan from '../components/simbalkj-scan/wxScan.vue';
import appScan from '../components/simbalkj-scan/appScan.vue';
import cameraAuthMixin from '../components/simbalkj-scan/authMixins';


export default {
	mixins: [cameraAuthMixin],
	components:{
		wxScan,
		appScan
	},
    data(){
        return{
            code:''
        }
    },
    // 第一次缓存是否进行过相机请求状态
    async onShow() {
        /* #ifdef APP-PLUS */
        if(!uni.getStorageSync('iosCameraAuth')&&this.isIos){
            uni.setStorageSync('iosCameraAuth',true)    
        }else{
            let bol = await this.getCameraAuth()
			if(!bol){
				this.refusedCameraAuth()
				return
			}
        }
		/* #endif */
    },
	methods:{
		// 扫码code
		getCode(barNumber){
			console.log(barNumber)
            this.code = barNumber.trim();
		},
	}
};
</script>

<style lang='scss' scoped>
.codeScan{
    height: 290px; // app-ios wx
}
.proBox{
	margin-top: 20rpx;
	height: calc(100vh - 290px );
	overflow-y: auto;
    padding: 30rpx;
    font-size: 30rpx;
}

</style>