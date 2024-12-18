import App from './App'
import store from './store'

import VueI18n from 'vue-i18n';
import Messages from './pages/api/language.js'
import Vue from 'vue'


import htmlToPdf from './store/htmlToPdf'
Vue.use(htmlToPdf)






Vue.config.productionTip = false
Vue.prototype.$store = store



//接口名字
const APP_IP = 'https://jakoblife.jakob-techs.com/prod-api/app/'

Vue.prototype.$url_APP_IP = 'https://jakoblife.jakob-techs.com'

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
//获取体脂秤身体指数
Vue.prototype.$url_get_device_data = "https://jakoblife.jakob-techs.com/prod-api/device_app/get_device_data"
//获取设备基础信息
Vue.prototype.$url_get_device_info = "https://jakoblife.jakob-techs.com/prod-api/device_app/get_device_info"
//查询用户的绑定设备
Vue.prototype.$url_queryDevices = "https://jakoblife.jakob-techs.com/prod-api/device_app/queryDevices"
//获取设备型号列表
Vue.prototype.$url_list = "https://jakoblife.jakob-techs.com/prod-api/device/device_model/list"
//校验第三方账号是否已注册
Vue.prototype.$url_check_auth = "https://jakoblife.jakob-techs.com/prod-api/app/third_parts/oauth/check_auth"
//微信使用accessToken和openId登录
Vue.prototype.$url_wechat_login = "https://jakoblife.jakob-techs.com/prod-api/app/third_parts/oauth/wechat_login"
//qq使用accessToken和openId登录
Vue.prototype.$url_qq_login = "https://jakoblife.jakob-techs.com/prod-api/app/third_parts/oauth/qq_login"
//上传用户头像
Vue.prototype.$url_avatar = "https://jakoblife.jakob-techs.com/prod-api/app/user/profile/avatar"
//发送更换会员名验证码
Vue.prototype.$url_send_change_name_code =
	"https://jakoblife.jakob-techs.com/prod-api/app/user/profile/send_change_name_code"
//更换会员名称
Vue.prototype.$url_check_change_name_code =
	"https://jakoblife.jakob-techs.com/prod-api/app/user/profile/check_change_name_code"
//手机登陆后绑定第三方信息
Vue.prototype.$url_bind_third = "https://jakoblife.jakob-techs.com/prod-api/app/user/profile/bind_third"
//用户在app手动上报六围数据&&用户在app手动上报重量数据
Vue.prototype.$url_fat_scale = "https://jakoblife.jakob-techs.com/prod-api/device_app/fat_scale"
//解除绑定记录
Vue.prototype.$url_getunbind = "https://jakoblife.jakob-techs.com/prod-api/device_app/unbind"
//注销用户
Vue.prototype.$url_delete_self = "https://jakoblife.jakob-techs.com/prod-api/app/delete_self"
//设备数据概览
Vue.prototype.$url_list_recipe = "https://jakoblife.jakob-techs.com/prod-api/device_app/list_recipe"
//数据趋势
Vue.prototype.$url_get_trend_data = "https://jakoblife.jakob-techs.com/prod-api/device_app/get_trend_data"
//用户在app手动上报血压数据
Vue.prototype.$url_pressure_data = "https://jakoblife.jakob-techs.com/prod-api/device_app/pressure_data"
//历史记录
Vue.prototype.$url_query_log = "https://jakoblife.jakob-techs.com/prod-api/device_app/query_log"
//血压计统计每日平均值计算总最大最小值
Vue.prototype.$url_query_month_avg = "https://jakoblife.jakob-techs.com/prod-api/device_app/query_month_avg"
//血压计最高最低平均数值
Vue.prototype.$url_query_minmax = "https://jakoblife.jakob-techs.com/prod-api/device_app/query_minmax"
//体脂秤统计最近1周/月平均体重、bmi、变化速度
Vue.prototype.$url_query_weight_avg = "https://jakoblife.jakob-techs.com/prod-api/device_app/query_weight_avg"
//体脂秤计算当天最高/最低/平均体重和肥胖等级
Vue.prototype.$url_query_weight_day = "https://jakoblife.jakob-techs.com/prod-api/device_app/query_weight_day"
//历史记录V2 - 血压/重量
Vue.prototype.$url_query_log_v2 = "https://jakoblife.jakob-techs.com/prod-api/device_app/query_log_v2"
//根据文章id获取内容详细信息
Vue.prototype.$url_article = "https://jakoblife.jakob-techs.com/prod-api/cms/article/get"





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