/**
 * 获取验证码：先倒计时再调接口，倒计时期间禁点并置灰。
 * 页面需已有 data：yanzheng / codetime / msg
 */
export default {
	data() {
		return {
			codeCounting: false,
			_codeTimer: null
		}
	},
	beforeDestroy() {
		if (this._codeTimer) {
			clearInterval(this._codeTimer)
			this._codeTimer = null
		}
	},
	computed: {
		codeBtnStyle() {
			return {
				background: this.codeCounting ? '#BDBDBD' : '#3298F7',
				color: '#ffffff'
			}
		}
	},
	methods: {
		/** 点击后立刻启动读秒（禁止重复点击） */
		startCodeCountdown(seconds = 120) {
			if (this._codeTimer) {
				clearInterval(this._codeTimer)
				this._codeTimer = null
			}
			this.codeCounting = true
			this.yanzheng = 0
			this.codetime = seconds
			this.msg = this.$t('s后可重发')
			this._codeTimer = setInterval(() => {
				this.codetime--
				if (this.codetime < 1) {
					clearInterval(this._codeTimer)
					this._codeTimer = null
					this.codeCounting = false
					this.msg = ''
					this.codetime = this.$t('重新获取')
				}
			}, 1000)
		},
		/** 发送失败时复位，允许再次获取 */
		resetCodeCountdown() {
			if (this._codeTimer) {
				clearInterval(this._codeTimer)
				this._codeTimer = null
			}
			this.codeCounting = false
			this.yanzheng = 1
			this.codetime = 0
			this.msg = this.$t('s后可重发')
		}
	}
}
