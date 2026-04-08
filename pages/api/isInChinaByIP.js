export async function isInChinaByIP() {
	// 第一个请求：ip-api.com
	try {
		const [error, res] = await uni.request({
			url: 'http://ip-api.com/json/?fields=status,message,countryCode',
			timeout: 3000,
			method: 'GET'
		});
		// 处理 uni.request 的错误（网络层面）
		if (error) {
			throw new Error('ip-api 网络错误'); // 进入 catch，触发备用
		}
		if (res?.data?.status === 'success') {
			const countryCode = res.data.countryCode;
			console.log('国家代码:', countryCode);
			return ['CN', 'HK', 'MO', 'TW'].includes(countryCode);
		}

		// API 返回 fail，也走备用
		throw new Error(res?.data?.message || 'ip-api 服务异常');

	} catch (err) {
		console.log('ip-api 失败，启用备用:', err.message || err);
		// 第二个请求：ipinfo.io（备用）
		try {
			const [error2, res2] = await uni.request({
				url: 'https://ipinfo.io/json',
				method: 'GET',
				timeout: 3000
			});

			if (error2) {
				console.error('ipinfo.io 网络错误:', error2);
				return false;
			}
			if (res2?.statusCode === 200 && res2?.data?.country) {
				const countryCode = res2.data.country;
				console.log('备用API成功，国家代码:', countryCode);
				return ['CN', 'HK', 'MO', 'TW'].includes(countryCode);
			}
			return false;
		} catch (err2) {
			console.error('备用API也失败:', err2);
			return false;
		}
	}
}

//判断国外服务器是否有该账号
export async function ISgetUserInfoUS(appurl) {
	try {
		const [error, res] = await uni.request({
			url: appurl + "/prod-api/app/user/profile/getInfo",
			method: 'GET',
			header: {
				'Authorization': 'Bearer ' + uni.getStorageSync("token"),
				'content-type': 'application/json;charset=UTF-8'
			},
		});
		console.log('国外获取用户信息成功:' + appurl, res);
		if (res && res.data && res.data.code === 200) {
			return true;
		}
		return false;
	} catch (err) {
		console.error('获取用户信息失败:', err);
		return false;
	}
}

//判断国内服务器是否有该账号
export async function ISgetUserInfoChina(appurl) {
	try {
		const [error, res] = await uni.request({
			url: appurl + "/prod-api/app/user/profile/getInfo",
			method: 'GET',
			header: {
				'Authorization': 'Bearer ' + uni.getStorageSync("token"),
				'content-type': 'application/json;charset=UTF-8'
			},
		});
		console.log('国内获取用户信息成功:' + appurl, res);
		if (res && res.data && res.data.code === 200) {
			return true;
		}
		return false;
	} catch (err) {
		console.error('获取用户信息失败:', err);
		return false;
	}
}

//判断国内服务器是否有该账号
export async function ISUSERID(ISUSERIDtoken, appurl) {
	try {
		const [error, res] = await uni.request({
			url: appurl + "/prod-api/app/user/profile/getInfo",
			method: 'GET',
			header: {
				'Authorization': 'Bearer ' + ISUSERIDtoken,
				'content-type': 'application/json;charset=UTF-8'
			},
		});
		console.log('ISUSERID获取用户信息成功:' + appurl, res);
		if (res && res.data && res.data.code === 200) {
			return res.data.data.userId;
		}
		return false;
	} catch (err) {
		console.error('获取用户信息失败:', err);
		return false;
	}
}


//判断国外服务器是否有该账号
export async function ISgetUserInfoUS2(unername, type, passward, appurl) {
	if (type === "密码") {
		try {
			const [error, res] = await uni.request({
				url: appurl + "/prod-api/app/user_login",
				method: 'POST',
				data: {
					username: unername,
					password: passward,
				},
				header: {
					'content-type': 'application/json;charset=UTF-8'
				},
			});
			console.log('获取用户手机验证码登录信息:' + appurl, res);
			if (res && res.data && res.data.code === 200) {
				uni.setStorageSync("IStokenUS2", res.data.token);
				return true
			}
			return false;
		} catch (err) {
			console.error('获取用户信息失败:', err);
			return false;
		}
	} else {
		try {
			const [error, res] = await uni.request({
				url: appurl + "/prod-api/app/app_login",
				method: 'POST',
				data: {
					smsCode: "888888",
					phoneNum: unername
				},
				header: {
					'content-type': 'application/json;charset=UTF-8'
				},
			});
			console.log('获取用户手机验证码登录信息:' + appurl, res);
			if (res && res.data && res.data.code === 200) {
				uni.setStorageSync("IStokenUS2", res.data.token);
				return true
			}
			return false;
		} catch (err) {
			console.error('获取用户信息失败:', err);
			return false;
		}

	}


}

//判断国内服务器是否有该账号
export async function ISgetUserInfoChina2(unername, type, passward, appurl) {
	if (type === "密码") {
		try {
			const [error, res] = await uni.request({
				url: appurl + "/prod-api/app/user_login",
				method: 'POST',
				data: {
					username: unername,
					password: passward,
				},
				header: {
					'content-type': 'application/json;charset=UTF-8'
				},
			});
			console.log(type + '获取用户信息成功:' + appurl, res);
			if (res && res.data && res.data.code === 200) {
				uni.setStorageSync("IStokenChina2", res.data.token);
				return true;
			}
			return false;
		} catch (err) {
			console.error('获取用户信息失败:', err);
			return false;
		}
	} else {
		try {
			const [error, res] = await uni.request({
				url: appurl + "/prod-api/app/app_login",
				method: 'POST',
				data: {
					smsCode: "888888",
					phoneNum: unername
				},
				header: {
					'content-type': 'application/json;charset=UTF-8'
				},
			});
			console.log('获取用户信息成功:' + appurl, res);
			if (res && res.data && res.data.code === 200) {
				uni.setStorageSync("IStokenChina2", res.data.token);
				return true;
			}
			return false;
		} catch (err) {
			console.error('获取用户信息失败:', err);
			return false;
		}
	}

}



//查询邮箱在中美服务器的注册情况

export async function check_email_register(unername, appurl) {
	try {
		const [error, res] = await uni.request({
			url: appurl + "/prod-api/app/check_email_register",
			method: 'POST',
			data: {
				identifier: unername,
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded;'
			},
		});
		console.log('查询邮箱在中美服务器的注册情况:' + appurl, res);
		if (res && res.data && res.data.code === 200) {
			if (res.data.chinaRegistered && !res.data.usRegistered) {
				return "Chinese_server";
			} else if (!res.data.chinaRegistered && res.data.usRegistered) {
				return "American_server";
			} else if (res.data.chinaRegistered && res.data.usRegistered) {
				return "Chinese_American_servers";
			} else {
				return false;
			}
		}
		return false;
	} catch (err) {
		console.error('获取用户信息失败:', err);
		return false;
	}
}