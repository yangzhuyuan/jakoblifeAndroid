import permision from "../lib/permisionCameraAuth.js";

export default {
	data() {
		return {
			isIos: false,
		}
	},
	onLoad() {
        // #ifdef APP-PLUS
        this.isIos = (plus.os.name == "iOS")
        // #endif
	},
	methods: {
		// 查询相机权限
		async getCameraAuth() {
			let bol = false
			if (this.isIos) {
				bol = permision.judgeIosPermissionCamera()
			} else {
				var result = await permision.requestAndroidPermission('android.permission.CAMERA')
				if (result == 1) {
					bol = true
				}
			}
			return bol
		},
		// app拒绝授权相机
		refusedCameraAuth() {
			uni.showModal({
				title: "",
				content: "您已禁止授权应用相机权限，如需使用请在设置中授权",
				cancelText: "取消",
				confirmText: "前往授权",
				confirmColor: "#02A8E6",
				showCancel: true,
				success: (res) => {
					if (res.confirm) {
						this.openCameraAuth()
					}
				},
			});
		},
		// app去授权
		openCameraAuth() {
			permision.gotoAppPermissionSetting()
		},
	},

}