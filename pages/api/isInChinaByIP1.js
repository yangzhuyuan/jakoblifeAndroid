import countryListRaw from '../api/unitls/country-data.js'; // 你的国家列表
export async function isInChinaByIP1() {
	try {
		const [error, res] = await uni.request({
			url: 'http://ip-api.com/json/?fields=status,message,countryCode',
			method: 'GET'
		});
		if (res && res.data && res.data.status === 'success') {
			let dial_code
			countryListRaw.forEach((data) => {
				if (res.data.countryCode === data.code) {
					dial_code = data.dial_code
				}
			});
			const countryCode = res.data.countryCode;
			return {
				countryCode: countryCode,
				dial_code: dial_code
			};
		}
		return false;
	} catch (err) {
		console.error('IP定位失败:', err);
		return false;
	}
}