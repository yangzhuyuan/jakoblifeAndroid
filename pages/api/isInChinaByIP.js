export async function isInChinaByIP() {
	try {
		const [error, res] = await uni.request({
			url: 'http://ip-api.com/json/?fields=status,message,countryCode',
			method: 'GET'
		});

		if (res && res.data && res.data.status === 'success') {
			const countryCode = res.data.countryCode;
			return countryCode === 'CN' || countryCode === 'HK' || countryCode === 'MO' || countryCode === 'TW';
		}
		return false;
	} catch (err) {
		console.error('IP定位失败:', err);
		return false;
	}
}