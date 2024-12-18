'use strict';
// 云函数
exports.main = async function(event, context) {
	console.log("yunhanshu", event)
	const res = await uniCloud.getPhoneNumber({
			appid: "__UNI__F833FCF", // 客户端callFunction时携带的AppId信息
			provider: 'univerify',
			access_token: event.access_token,
			openid: event.openid
		})
		// 执行入库等操作，正常情况下不要把完整手机号返回给前端
		return res
}