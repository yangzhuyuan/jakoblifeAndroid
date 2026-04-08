// 导入文件
import App from './App'
import store from './store'
import VueI18n from 'vue-i18n';
import Messages from './pages/api/language.js'
import Vue from 'vue'
import GlobalPopup from '@/components/GlobalPopup.vue'
import {
	myRequest,
	getRequest,
	postRequest,
	putRequest,
} from './pages/api/request.js'
// 引入全局组件
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$myRequest = myRequest;
Vue.prototype.$get = getRequest;
Vue.prototype.$post = postRequest;
Vue.prototype.$put = putRequest;
// 全局定时任务管理器
Vue.prototype.$globalTimers = {
	heartbeatInterval: null
};
// 全局注册组件
Vue.component('GlobalPopup', GlobalPopup)
// 再挂到原型，方便任何页面 this.$popup 直接调用
Vue.prototype.$popup = function(opts = {}) {
	const pages = getCurrentPages()
	const cur = pages[pages.length - 1]
	const comp = cur.$vm.$refs.globalPopup
	if (!comp) {
		console.warn('GlobalPopup ref=globalPopup 未找到');
		return
	}
	return comp.show(opts)
}
/* 下载进度实时推送 */
Vue.prototype.$popupProgress = function(p) {
	const pages = getCurrentPages()
	const cur = pages[pages.length - 1]
	const comp = cur.$vm.$refs.globalPopup
	if (comp && comp.mode === 'download') comp.onProgress(p)
}
//测试域名
// const APP_IP_CN = "https://jakoblife-qa.jakob-techs.com"; //中国测试服务器
//正式域名
const APP_IP_CN = 'https://jakoblife.jakob-techs.com' //中国正式服务器
const APP_IP_US = 'https://jakoblife.us.jakob-techs.com' //美国正式服务器
Vue.prototype.$APP_IP1 = APP_IP_CN
Vue.prototype.$APP_IP2 = APP_IP_US
//获取用户信息
Vue.prototype.$url_getInfo = "/prod-api/app/user/profile/getInfo"
//获取图形验证码
Vue.prototype.$url_captchaImage = "/prod-api/captchaImage"
//发送手机登录验证码
Vue.prototype.$url_send_login_code = "/prod-api/app/send_login_code"
//发送重置密码短信
Vue.prototype.$url_send_phone_reset_code = "/prod-api/app/send_phone_reset_code"
//校验重置密码验证码
Vue.prototype.$url_check_reset_code = "/prod-api/app/check_reset_code"
//手机验证码后重置密码
Vue.prototype.$url_reset_password_by_phone = "/prod-api/app/user/profile/reset_password_by_phone"
//校验图形验证码
Vue.prototype.$url_check_code = "/prod-api/app/check_code"
//发送手机绑定验证码
Vue.prototype.$url_send_phone_register_code = "/prod-api/app/send_phone_register_code"
//发送换绑手机号原手机验证码
Vue.prototype.$url_send_phone_unbind_code = "/prod-api/app/user/profile/send_phone_unbind_code"
//校验换绑手机号原手机验证码
Vue.prototype.$url_check_phone_unbind_code = "/prod-api/app/user/profile/check_phone_unbind_code"
//发送换绑手机号新手机验证码
Vue.prototype.$url_send_phone_bind_code = "/prod-api/app/user/profile/send_phone_bind_code"
//校验换绑手机号新手机验证码
Vue.prototype.$url_check_phone_bind_code = "/prod-api/app/user/profile/check_phone_bind_code"
//第三方登录后用户绑定手机号
Vue.prototype.$url_bind_phone = "/prod-api/app/user/profile/bind_phone"
//更新个人信息
Vue.prototype.$url_update_info = "/prod-api/app/user/profile/update_info"
//设备绑定
Vue.prototype.$url_bind_device = "/prod-api/device_app/bind_device"
//获取体脂秤身体指数
Vue.prototype.$url_get_device_data = "/prod-api/device_app/get_device_data"
//获取设备基础信息
Vue.prototype.$url_get_device_info = "/prod-api/device_app/get_device_info"
//查询用户的绑定设备
Vue.prototype.$url_queryDevices = "/prod-api/device_app/queryDevices"
//获取设备型号列表
Vue.prototype.$url_list = "/prod-api/device/device_model/list"
//校验第三方账号是否已注册
Vue.prototype.$url_check_auth = "/prod-api/app/third_parts/oauth/check_auth"
//微信使用accessToken和openId登录
Vue.prototype.$url_wechat_login = "/prod-api/app/third_parts/oauth/wechat_login"
//qq使用accessToken和openId登录
Vue.prototype.$url_qq_login = "/prod-api/app/third_parts/oauth/qq_login"
//上传用户头像
Vue.prototype.$url_avatar = "/prod-api/app/user/profile/avatar"
//发送更换会员名验证码
Vue.prototype.$url_send_change_name_code = "/prod-api/app/user/profile/send_change_name_code"
//更换会员名称
Vue.prototype.$url_check_change_name_code = "/prod-api/app/user/profile/check_change_name_code"
//手机登陆后绑定第三方信息
Vue.prototype.$url_bind_third = "/prod-api/app/user/profile/bind_third"
//用户在app手动上报六围数据&&用户在app手动上报重量数据
Vue.prototype.$url_fat_scale = "/prod-api/device_app/fat_scale"
//解除绑定记录
Vue.prototype.$url_getunbind = "/prod-api/device_app/unbind"
//注销用户
Vue.prototype.$url_delete_self = "/prod-api/app/delete_self"
//设备数据概览
Vue.prototype.$url_list_recipe = "/prod-api/device_app/list_recipe"
//数据趋势
Vue.prototype.$url_get_trend_data = "/prod-api/device_app/get_trend_data"
//用户在app手动上报血压数据
Vue.prototype.$url_pressure_data = "/prod-api/device_app/pressure_data"
//历史记录
Vue.prototype.$url_query_log = "/prod-api/device_app/query_log"
//血压计统计每日平均值计算总最大最小值
Vue.prototype.$url_query_month_avg = "/prod-api/device_app/query_month_avg"
//血压计最高最低平均数值
Vue.prototype.$url_query_minmax = "/prod-api/device_app/query_minmax"
//体脂秤统计最近1周/月平均体重、bmi、变化速度
Vue.prototype.$url_query_weight_avg = "/prod-api/device_app/query_weight_avg"
//体脂秤计算当天最高/最低/平均体重和肥胖等级
Vue.prototype.$url_query_weight_day = "/prod-api/device_app/query_weight_day"
//历史记录V2 - 血压/重量
Vue.prototype.$url_query_log_v2 = "/prod-api/device_app/query_log_v2"
//根据文章id获取内容详细信息
Vue.prototype.$url_article = "/prod-api/cms/article/get"
//查看别人分享给我的数据点列表
Vue.prototype.$url_receiver_list = "/prod-api/share/data/receiver_list"
//查看我分享给别人的数据点列表
Vue.prototype.$url_share_list = "/prod-api/share/data/share_list"
//删除历史记录
Vue.prototype.$url_batch_del_data_log = "/prod-api/device_app/batch_del_data_log"
//上报体脂秤或血压计数据
Vue.prototype.$url_jakoblife_fat_scale = "/prod-api/jakoblife/fat_scale"
//获取待处理分享请求列表
Vue.prototype.$url_pending = "/prod-api/share/data/pending"
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
// Vue 实例并挂载应用
App.mpType = 'app' // 标记为应用类型（App）
const app = new Vue({ // 创建 Vue 根实例
	store, // 注入 Vuex 状态管理
	i18n, // 注入国际化插件
	...App // 展开 App.vue 的配置（data, methods, lifecycle等）
})
app.$mount() // 挂载应用到页面


import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App) // 创建 SSR 应用实例
	app.use(store) // 创建 SSR 应用实例
	app.config.globalProperties.$adpid = "1111111111" // 全局属性：广告ID
	app.config.globalProperties.$backgroundAudioData = { // 全局属性：背景音频数据
		playing: false,
		playTime: 0,
		formatedPlayTime: '00:00:00'
	}
	return {
		app
	}
}