import App from './App'
import store from './store'
import VueI18n from 'vue-i18n';
import Messages from './pages/api/language.js'
import Vue from 'vue'

Vue.config.productionTip = false
Vue.prototype.$store = store



//接口名字
const APP_IP = 'https://jakoblife.jakob-techs.com/prod-api/app/'
//App用户名密码注册
Vue.prototype.$url_register = APP_IP + "register"
//用户名登录
Vue.prototype.$url_user_login = APP_IP + "user_login"
//手机验证码登录
Vue.prototype.$url_app_login = APP_IP + "app_login"
//获取用户信息
Vue.prototype.$url_getInfo = APP_IP + "user/profile/getInfo"
//获取图形验证码
Vue.prototype.$url_captchaImage = "https://jakoblife.jakob-techs.com/prod-api/captchaImage"
//发送手机登录验证码
Vue.prototype.$url_send_login_code = APP_IP + "send_login_code"
//发送重置密码短信
Vue.prototype.$url_send_phone_reset_code = APP_IP + "send_phone_reset_code"
//校验重置密码验证码
Vue.prototype.$url_check_reset_code = APP_IP + "check_reset_code"
//手机验证码后重置密码
Vue.prototype.$url_reset_password_by_phone = APP_IP + "user/profile/reset_password_by_phone"
//校验图形验证码
Vue.prototype.$url_check_code = APP_IP + "check_code"
//发送手机绑定验证码
Vue.prototype.$url_send_phone_register_code = APP_IP + "send_phone_register_code"
//发送换绑手机号原手机验证码
Vue.prototype.$url_send_phone_unbind_code = APP_IP + "user/profile/send_phone_unbind_code"
//校验换绑手机号原手机验证码
Vue.prototype.$url_check_phone_unbind_code = APP_IP + "user/profile/check_phone_unbind_code"
//发送换绑手机号新手机验证码
Vue.prototype.$url_send_phone_bind_code = APP_IP + "user/profile/send_phone_bind_code"
//校验换绑手机号新手机验证码
Vue.prototype.$url_check_phone_bind_code = APP_IP + "user/profile/check_phone_bind_code"
//第三方登录后用户绑定手机号
Vue.prototype.$url_bind_phone = APP_IP + "user/profile/bind_phone"
//更新个人信息
Vue.prototype.$url_update_info = APP_IP + "user/profile/update_info"
//设备绑定
Vue.prototype.$url_bind_device = "https://jakoblife.jakob-techs.com/prod-api/device_app/bind_device"

Vue.prototype.$backgroundAudioData = {
	playing: false,
	playTime: 0,
	formatedPlayTime: '00:00:00'
}

Vue.use(VueI18n);

Vue.config.productionTip = false;
const i18n = new VueI18n({
	locale: 'zh-CN', //zh-CN en-US
	messages: Messages //language中的语言包
})
Vue.prototype._i18n = i18n;
App.mpType = 'app'
const app = new Vue({
	store,
	i18n,
	...App
})
app.$mount()

import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.config.globalProperties.$adpid = "1111111111"
	app.config.globalProperties.$backgroundAudioData = {
		playing: false,
		playTime: 0,
		formatedPlayTime: '00:00:00'
	}
	return {
		app
	}
}