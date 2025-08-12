// request.js
function request(url, method, data = {}, header = {}) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: url,
			method: method,
			data: data,
			header: header,
			success: (res) => {
				// 这里可以根据你的需要处理响应结果
				if (res.statusCode === 200) {
					resolve(res.data);
				} else {
					reject(res.data);
				}
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}

export const myRequest = (url, method, data = {}, header = {}) => {
	return request(url, method, data, header);
};


// 导出封装的请求方法
export const getRequest = (url, data = {}, header = {}) => {
	return request(url, 'GET', data, header);
};

export const postRequest = (url, data = {}, header = {}) => {
	return request(url, 'POST', data, header);
};

export const putRequest = (url, data = {}, header = {}) => {
	return request(url, 'PUT', data, header);
};


// 可以根据需要继续添加其他 HTTP 方法的封装，如 putRequest, deleteRequest 等。