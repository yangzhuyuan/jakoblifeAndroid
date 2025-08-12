// 简单的使用示例  
'use strict';
const uniPush = uniCloud.getPushManager({
	appId: "__UNI__F833FCF"
})
exports.main = async (event) => {
	const res = await uniPush.sendMessage({
		"push_clientid": event.cids, // 设备id，支持多个以数组的形式指定多个设备，如["cid-1","cid-2"]，数组长度不大于1000  
		"title": event.title, // 标题  
		"content": event.content, // 内容  
		"payload": {}, // 数据  
		"force_notification": true, // 服务端推送 需要加这一句  
		"request_id": event.request_id, //请求唯一标识号，10-32位之间；如果request_id重复，会导致消息丢失  
		"category": {
			//HarmonyOS NEXT系统（纯血鸿蒙、非安卓鸿蒙）的消息分类，要给鸿蒙设备推送时才必传  
			"harmony": "MARKETING"
		},
		// "options":{  
		//            "HW": {      
		//                 // 值为int 类型。1 表示华为测试消息，华为每个应用每日可发送该测试消息500条。此 target_user_type 参数请勿发布至线上。      
		//                  "/message/android/target_user_type":1      
		//              } ,    
		//            "HO": {      
		//                 //值为int 类型。1 表示测试推送，不填默认为0。荣耀每个应用每日可发送该测试消息1000条。此测试参数请勿发布至线上。  
		//                  "/android/targetUserType": 1   
		//              } ,  
		//            "VV": {      
		//                 //值为int 类型。0 表示正式推送；1 表示测试推送，不填默认为0。此 pushMode 参数请勿发布至线上。  
		//                  "/pushMode":1      
		//              } ,    
		//            "XM": {      
		//                 //新小米消息分类下，私信公信id都必须要传，否则请求小米厂商接口会被拦截  
		//                  "/extra.channel_id": "填写小米平台申请的渠道id"   
		//              }    
		//        }  
		"options": {
			// "huawei": {
			// 	"extra": {
			// 		"callback.id": "huawei_callback_id" // 华为回执id
			// 	}
			// },
			// "xiaomi": {
			// 	"extra": {
			// 		"callback.id": "填写小米平台申请的渠道id" // 小米回执id
			// 	}
			// },
			// "oppo": {
			// 	"extra": {
			// 		"callback.id": "oppo_callback_id" // OPPO回执id
			// 	}
			// },
			"vivo": {
				"extra": {
					"callback.id": "7145" // VIVO回执id
				}
			},
			// "meizu": {
			// 	"extra": {
			// 		"callback.id": "meizu_callback_id" // 魅族回执id
			// 	}
			// },
			// "fcm": {
			// 	"extra": {
			// 		"callback.id": "fcm_callback_id" // FCM回执id
			// 	}
			// }
		}
	})
	return res //一定要return回去
};