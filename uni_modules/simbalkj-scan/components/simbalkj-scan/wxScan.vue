<template>
  <view class="wx-scan-content">
    <view class="scan-cameraCon">
      <camera class="scan-camera" device-position="back" flash="off" @error="error" mode="scanCode"   @scancode="cameraScan" :style="{ width: scanCameraWid, height: scanCameraHei }">
        <view class="cover-view-box">
          <!-- 左上角 -->
          <cover-view class="scan-border scan-left-top scan-verLine"></cover-view>
          <cover-view class="scan-border scan-left-top scan-horLine"></cover-view>
          <!-- 左下角 -->
          <cover-view class="scan-border scan-left-bottom scan-verLine"></cover-view>
          <cover-view class="scan-border scan-left-bottom scan-horLine"></cover-view>
          <!-- 右上角 -->
          <cover-view class="scan-border scan-right-top scan-verLine"></cover-view>
          <cover-view class="scan-border scan-right-top scan-horLine"></cover-view>
          <!-- 右下角 -->
          <cover-view class="scan-border scan-right-bottom scan-verLine"></cover-view>
          <cover-view class="scan-border scan-right-bottom scan-horLine"></cover-view>
          <!-- 上下移动的动画线 -->
          <cover-view class="scan-animation" :animation="scanAnimation"></cover-view>
        </view>
      </camera>
    </view>
  </view>

</template>

<script>
let animation = uni.createAnimation({});
export default {
  data() {
    return {
      src: '',
      timer: null,
      goodsCode: '',
      scanGoods: [],
      scanAnimation: null,
      scanFlag: true,
    };
  },
  props: {
    scanMode: {
      type: String,
      default: 'scanCode'
    },
    scanTip: {
      type: Number,
      default: 2
    },
    scanCameraWid: {
      type: String,
      default: '250px'
    },
    scanCameraHei: {
      type: String,
      default: '250px'
    }
  },
  created() {
    if (this.scanMode == 'scanCode') {
      	this.initAnimation();
    }
  },
  methods: {
    /*
    * toast提示
    * @param {string}
    * */
    showToasts(msg) {
        uni.showToast({
            title: msg,
            icon: 'none'
        })
    },
    /*
    * 扫码
    * @param {e}
    * */
    async cameraScan(e) {
		if(this.scanFlag) {
			if (!e) {
				this.showToasts('扫描失败，请稍后再试')
				return
			} 
			this.onScanSuccess(e.detail.result)
		}
    },
    /*
    * 扫码成功
    * @param {string}
    * */
    async onScanSuccess (barNumber) {
		console.log('onScanSuccess======'+barNumber)
		if(this.scanFlag){
			this.scanFlag = false;
			uni.vibrateLong({
				success: ()=> {}
			});
			this.$emit('getCode', barNumber)
			// 扫码间隔3秒
			setTimeout(() => {
				this.scanFlag = true;
			}, 3000)
		}
    },
    /*
    * 上下移动动画
    * */
    initAnimation() {
      let that = this;
      let m = true;
      setInterval(() => {
        if (m) {
          animation.translateY(140).step({
            duration: 3000
          });
          m = !m;
        } else {
          animation.translateY(10).step({
            duration: 3000
          });
          m = !m;
        }
        that.scanAnimation = animation.export();
      }, 3000);
    },
    /*
    * 动画
    * */
    onAnimation () {
      animation.translateY(140).step({
        duration: 3000
      });
      this.scanAnimation = animation.export();
    },
    /*
    * 摄像头授权设置
    * */
    error(e) {
      if (e) {
        let that = this;
        uni.getSetting({
          success(res) {
            if (!res.authSetting['scope.camera']) {
              //获取摄像头权限
              uni.authorize({
                scope: 'scope.camera',
                success() {
                  console.log('授权成功');
                },
                fail() {
                  uni.showModal({
                    title: '提示',
                    content: '您已禁止授权应用的相机权限，如需使用请在设置中授权',
                    showCancel: false,
                    success(res) {
                      that.openAuthor();
                    }
                  });
                }
              });
            }
          },
          fail(res) {}
        });
      }
    },
    /*
    * 摄像头授权权限
    * */
    openAuthor() {
      let that = this;
      uni.openSetting({
        //这里的方法是调到一个添加权限的页面，可以自己尝试
        success: res => {
          if (!res.authSetting['scope.camera']) {
            uni.showModal({
              title: '提示',
              content: '您已禁止授权应用的相机权限，如需使用请在设置中授权',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  that.openAuthor();
                }
              }
            });
          } 
        },
        fail: function() {
          console.log('授权摄像头权限失败');
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../lib/index";
</style>
