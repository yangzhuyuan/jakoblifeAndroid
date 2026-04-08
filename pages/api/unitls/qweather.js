// 你的专属API域名
const API_HOST = 'mq78m2chqu.yun.qweatherapi.com';
const QWEATHER_KEY = 'd56a57841a7c432f944ea37f799e446d';

// 用专属域名构建URL
const GEO_URL = 'https://' + API_HOST + '/geo/v2';
const WEATHER_URL = 'https://' + API_HOST + '/v7';
const BASE_URL = 'https://' + API_HOST;

/**
 * 获取空气质量数据 - 适配新版API返回格式
 * @param {number} latitude - 纬度
 * @param {number} longitude - 经度
 * @returns {Promise<Object>} 空气质量数据
 */
export async function getAirQuality(latitude, longitude) {
	try {
		// console.log('获取空气质量 - 纬度:', latitude, '经度:', longitude);

		const url = `${BASE_URL}/airquality/v1/current/${latitude}/${longitude}`;
		// console.log('请求URL:', url);

		const [err, res] = await uni.request({
			url: url,
			method: 'GET',
			header: {
				'X-QW-Api-Key': QWEATHER_KEY
			}
		});

		if (err) {
			console.error('空气质量请求错误:', err);
			return {
				success: false,
				error: '网络请求失败'
			};
		}

		// console.log('空气质量API返回:', res.data);

		// 检查返回数据 - 适配新的数据格式
		if (res.statusCode === 200 && res.data && res.data.indexes) {
			// 获取主要空气质量指数（默认使用第一个index）
			const mainIndex = res.data.indexes?.[0] || {};

			// 构建简化的now对象，保持与原代码兼容
			const now = {
				aqi: mainIndex.aqi,
				category: mainIndex.category,
				level: mainIndex.level,
				primary: mainIndex.primaryPollutant?.name,
				// 从pollutants中提取污染物数据
				pm2p5: null,
				pm10: null,
				o3: null,
				no2: null,
				so2: null,
				co: null
			};

			// 填充污染物数据
			if (res.data.pollutants) {
				res.data.pollutants.forEach(p => {
					switch (p.code) {
						case 'pm2p5':
							now.pm2p5 = p.concentration?.value;
							break;
						case 'pm10':
							now.pm10 = p.concentration?.value;
							break;
						case 'o3':
							now.o3 = p.concentration?.value;
							break;
						case 'no2':
							now.no2 = p.concentration?.value;
							break;
						case 'so2':
							now.so2 = p.concentration?.value;
							break;
						case 'co':
							now.co = p.concentration?.value;
							break;
					}
				});
			}

			return {
				success: true,
				data: now,
				protocolCode: mapAirQuality(mainIndex.level, mainIndex.aqi),
				details: {
					aqi: mainIndex.aqi,
					aqiDisplay: mainIndex.aqiDisplay,
					level: mainIndex.level,
					category: mainIndex.category,
					primaryPollutant: mainIndex.primaryPollutant,
					health: mainIndex.health,
					color: mainIndex.color,
					pollutants: now,
					stations: res.data.stations || []
				},
				raw: res.data // 保留原始数据
			};
		} else {
			console.error('空气质量API错误:', res.statusCode);
			return {
				success: false,
				error: '获取空气质量失败',
				protocolCode: 0x01 // 默认良
			};
		}
	} catch (e) {
		console.error('空气质量异常:', e);
		return {
			success: false,
			error: e.message,
			protocolCode: 0x01 // 默认良
		};
	}
}

/**
 * 根据空气质量等级和AQI映射到协议码
 * @param {string|number} level - 等级 (1-6)
 * @param {string|number} aqi - 空气质量指数
 * @returns {number} 协议码
 */
function mapAirQuality(level, aqi) {
	// 优先使用等级
	if (level) {
		const levelNum = Number(level);
		switch (levelNum) {
			case 1:
				return 0x00; // 优
			case 2:
				return 0x01; // 良
			case 3:
				return 0x02; // 轻度污染
			case 4:
				return 0x03; // 中度污染
			case 5:
				return 0x04; // 重度污染
			case 6:
				return 0x05; // 严重污染
		}
	}

	// 如果没有等级，使用AQI值
	if (aqi) {
		const aqiNum = Number(aqi);
		if (aqiNum <= 50) return 0x00; // 优
		if (aqiNum <= 100) return 0x01; // 良
		if (aqiNum <= 150) return 0x02; // 轻度污染
		if (aqiNum <= 200) return 0x03; // 中度污染
		if (aqiNum <= 300) return 0x04; // 重度污染
		return 0x05; // 严重污染
	}

	return 0x01; // 默认良
}

/**
 * 搜索城市
 */
export async function searchCity(cityName, adm) {
	try {
		// console.log('搜索城市:', cityName);
		// console.log('搜索城市:', adm);
		const [err, res] = await uni.request({
			url: GEO_URL + '/city/lookup',
			method: 'GET',
			header: {
				'X-QW-Api-Key': QWEATHER_KEY
			},
			data: {
				location: cityName,
				range: 'world',
				number: 10,
				adm: adm
			}
		});

		if (err) {
			console.error('请求错误:', err);
			return {
				success: false,
				error: '网络请求失败'
			};
		}

		if (res.statusCode === 200) {
			if (res.data && res.data.code === '200') {
				return {
					success: true,
					data: res.data.location || []
				};
			} else {
				return {
					success: false,
					error: res.data?.message || '搜索失败'
				};
			}
		} else {
			return {
				success: false,
				error: 'API服务错误: ' + res.statusCode
			};
		}
	} catch (e) {
		console.error('搜索异常:', e);
		return {
			success: false,
			error: e.message
		};
	}
}

/**
 * 通过城市名获取完整天气（包含空气质量）
 */
export async function searchCityWeather(cityName, adm) {
	try {
		// 1. 搜索城市
		const cityResult = await searchCity(cityName, adm);
		if (!cityResult.success || !cityResult.data || !cityResult.data.length) {
			return {
				success: false,
				error: cityResult.error || '未找到城市'
			};
		}

		const city = cityResult.data[0];
		// console.log('找到城市:', city);

		// 2. 获取实时天气
		const [weatherErr, weatherRes] = await uni.request({
			url: WEATHER_URL + '/weather/now',
			method: 'GET',
			header: {
				'X-QW-Api-Key': QWEATHER_KEY
			},
			data: {
				location: city.id
			}
		});

		if (weatherErr) {
			console.error('天气请求错误:', weatherErr);
			return {
				success: false,
				error: '网络请求失败'
			};
		}

		if (weatherRes.statusCode !== 200 || weatherRes.data?.code !== '200') {
			console.error('天气API错误:', weatherRes);
			return {
				success: false,
				error: '获取实时天气失败: ' + (weatherRes.data?.code || weatherRes.statusCode)
			};
		}

		// 3. 获取7天预报
		const [forecastErr, forecastRes] = await uni.request({
			url: WEATHER_URL + '/weather/7d',
			method: 'GET',
			header: {
				'X-QW-Api-Key': QWEATHER_KEY
			},
			data: {
				location: city.id
			}
		});

		if (forecastErr) {
			console.error('预报请求错误:', forecastErr);
			return {
				success: false,
				error: '网络请求失败'
			};
		}

		if (forecastRes.statusCode !== 200 || forecastRes.data?.code !== '200') {
			console.error('预报API错误:', forecastRes);
			return {
				success: false,
				error: '获取预报失败: ' + (forecastRes.data?.code || forecastRes.statusCode)
			};
		}

		// 4. 获取空气质量（使用经纬度）
		const airQualityResult = await getAirQuality(city.lat, city.lon);
		// console.log('空气质量结果:', airQualityResult);

		// 5. 格式化数据（整合空气质量）
		const weatherData = {
			location: {
				id: city.id,
				name: city.name,
				country: city.country,
				adm1: city.adm1,
				adm2: city.adm2,
				lat: city.lat,
				lon: city.lon,
				timezone: city.tz
			},
			current: {
				temp: weatherRes.data.now.temp,
				feelsLike: weatherRes.data.now.feelsLike,
				weather: weatherRes.data.now.text,
				icon: weatherRes.data.now.icon,
				windDir: weatherRes.data.now.windDir,
				windScale: weatherRes.data.now.windScale,
				humidity: weatherRes.data.now.humidity,
				pressure: weatherRes.data.now.pressure,
				// 空气质量字段
				aqi: airQualityResult.success ? airQualityResult.data.aqi : null,
				aqiCategory: airQualityResult.success ? airQualityResult.data.category : null,
				aqiLevel: airQualityResult.success ? airQualityResult.data.level : null,
				aqiProtocolCode: airQualityResult.protocolCode || 0x01,
				// 详细污染物数据
				pm25: airQualityResult.success ? airQualityResult.data.pm2p5 : null,
				pm10: airQualityResult.success ? airQualityResult.data.pm10 : null,
				o3: airQualityResult.success ? airQualityResult.data.o3 : null,
				no2: airQualityResult.success ? airQualityResult.data.no2 : null,
				so2: airQualityResult.success ? airQualityResult.data.so2 : null,
				co: airQualityResult.success ? airQualityResult.data.co : null,
				primaryPollutant: airQualityResult.success ? airQualityResult.data.primary : null
			},
			forecast: forecastRes.data.daily.map(day => ({
				date: day.fxDate,
				tempMax: day.tempMax,
				tempMin: day.tempMin,
				weatherDay: day.textDay,
				iconDay: day.iconDay,
				uvIndex: day.uvIndex
			})),
			// 空气质量详情（可选）
			airQuality: airQualityResult.success ? airQualityResult.details : null
		};

		// 缓存数据
		cacheWeather(weatherData);

		return {
			success: true,
			data: weatherData
		};

	} catch (e) {
		console.error('获取天气错误:', e);
		return {
			success: false,
			error: e.message
		};
	}
}

/**
 * 获取本地天气（包含空气质量）
 */
export async function getGlobalLocalWeather() {
	return new Promise((resolve) => {
		// 先尝试读取缓存
		// const cached = getCachedWeather();
		// if (cached) {
		// 	console.log('使用缓存数据');
		// 	resolve({
		// 		success: true,
		// 		data: cached,
		// 		fromCache: true
		// 	});
		// 	return;
		// }
		// 使用 ip-api.com（无需Key，免费）

		// 使用高德IP定位API
		uni.request({
			url: 'http://ip-api.com/json/?lang=zh-CN',
			success: async (res) => {
				try {
					// console.log('IP定位结果：', res.data);
					if (res.data.status === 'success') {
						const {
							lat,
							lon,
							city,
							regionName,
							country
						} = res.data;
						// console.log('定位成功:', {
						// 	latitude: lat,
						// 	longitude: lon,
						// 	regionName,
						// 	city
						// });
						// 通过坐标获取城市信息（如果需要更精确的城市编码）
						const geoRes = await uni.request({
							url: GEO_URL + '/city/lookup',
							method: 'GET',
							header: {
								'X-QW-Api-Key': QWEATHER_KEY
							},
							data: {
								location: `${lon},${lat}`,
								range: 'world',
								number: 10,
								adm: regionName
							}
						});
						if (geoRes.statusCode === 200 && geoRes.data?.code === '200' && geoRes
							.data.location) {
							const cityInfo = geoRes.data.location[0];
							const result = await searchCityWeather(cityInfo.name, cityInfo
								.adm1);
							resolve(result);
						} else {
							const result = await searchCityWeather(city, regionName);
							resolve(result);
						}
					} else {
						reject(new Error(res.data.message || 'IP定位失败'));
					}
				} catch (error) {
					console.error('定位处理错误:', error);
					reject(error);
				}
			},
			fail: (err) => {
				console.error('IP定位请求失败:', err);
				reject(err);
			}
		});




	});
}

/**
 * 获取分钟级降水
 */
export async function getMinutelyRain(lat, lon) {
	try {
		const [err, res] = await uni.request({
			url: WEATHER_URL + '/minutely/5m',
			method: 'GET',
			header: {
				'X-QW-Api-Key': QWEATHER_KEY
			},
			data: {
				location: lon + ',' + lat
			}
		});

		if (!err && res.statusCode === 200 && res.data?.code === '200') {
			return res.data.minutely;
		}
		return null;
	} catch (e) {
		console.log('分钟级降水获取失败:', e);
		return null;
	}
}

// 缓存管理
function cacheWeather(data) {
	try {
		uni.setStorageSync('qweather_cache', {
			data: data,
			expire: Date.now() + 30 * 60 * 1000 // 30分钟
		});
	} catch (e) {
		console.log('缓存失败:', e);
	}
}

function getCachedWeather() {
	try {
		const cache = uni.getStorageSync('qweather_cache');
		if (cache && cache.expire > Date.now()) {
			return cache.data;
		}
		return null;
	} catch (e) {
		return null;
	}
}