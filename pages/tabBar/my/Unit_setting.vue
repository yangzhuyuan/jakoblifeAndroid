<template>
	<view style="padding:20px;color:#000;height:100vh">
		<view class="view_bg">
			<unit-row v-for="(item, index) in rows" :key="index" :title="$t(item.title)" :array="item.array"
				:storage-key="item.key" :current-index="indexMap[item.key] || 0" @unit-change="collectUnit" />
		</view>
		<button type="primary" style="margin:50px 20px 0 20px;border-radius: 100px;" @tap="saveUnit">
			{{ $t("保存") }}
		</button>
	</view>
</template>
<script>
	import unitRow from '@/components/unit-row.vue'
	export default {
		components: {
			unitRow
		},
		data() {
			return {
				rows: [{
						title: '血压',
						key: 'Blood',
						array: ['mmHg', 'kPa']
					},
					{
						title: '身高',
						key: 'danwei1',
						array: ['inch', 'cm']
					},
					{
						title: '体重',
						key: 'danwei2',
						array: ['kg', 'lb']
					}
				],
				unitMap: {}, // 保存单位值
				indexMap: {} // 保存索引
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('单位设置')
			})
			this.cardlist()
		},
		methods: {
			// 接口获取单位配置
			cardlist() {
				const data = {
					dataType: 'Unitdata'
				};
				this.$get(this.$url_APP_IP + '/prod-api/device/data/list', data, {
					Authorization: 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then(res => {
					if (res.code === 200 && res.rows.length > 0 && res.rows[0].data) {
						const parsed = this.robustParseData(res.rows[0].data);
						if (!parsed.length) return;
						const unitData = parsed[0];
						/* ① 字段映射：key ↔ 接口返回字段 */
						const keyMap = {
							Blood: 'bloodUnit',
							danwei1: 'heightUnit',
							danwei2: 'weightUnit'
						};
						/* ② 统一循环：值 → 索引 → 缓存 */
						Object.keys(keyMap).forEach(key => {
							const value = unitData[keyMap[key]];
							const row = this.rows.find(r => r.key === key);
							if (!row) return;
							const idx = row.array.indexOf(value);
							const safe = idx !== -1 ? idx : 0;
							this.$set(this.unitMap, key, value);
							this.$set(this.indexMap, key, safe);
							uni.setStorageSync(key, safe); // 直接存索引
						});
						// console.log('[cardlist] 单位映射完成', this.unitMap, this.indexMap);
					}
				});
			},
			// 子组件变更
			collectUnit(e) {
				this.unitMap[e.key] = e.value
				this.$set(this.indexMap, e.key, e.index)
			},
			// 保存单位
			saveUnit() {
				const postData = {
					bloodUnit: this.unitMap.Blood,
					heightUnit: this.unitMap.danwei1,
					weightUnit: this.unitMap.danwei2
				}
				const editData = {
					dataType: 'Unitdata',
					data: this.formatDatacard([postData])
				}
				console.log("postData", postData)
				console.log("editData", editData)
				this.$post(this.$url_APP_IP + '/prod-api/device/data/editData', editData, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: this.$t('保存成功'),
							icon: 'icon'
						})
						this.cardlist()
					}
				})
			},
			// 格式化数据为接口格式
			formatDatacard(dataArray) {
				return dataArray.map(obj => JSON.stringify(obj).replace(/"/g, '')).join(',')
			},
			// 解析接口返回的字符串
			robustParseData(dataStr) {
				try {
					const objects = dataStr.split('},{')
					const result = []
					for (let i = 0; i < objects.length; i++) {
						let objStr = objects[i]
						if (i === 0) objStr += '}'
						else if (i === objects.length - 1) objStr = '{' + objStr
						else objStr = '{' + objStr + '}'
						objStr = objStr.replace(/^{{/, '{').replace(/}}$/, '}')
						const fixed = objStr.replace(/([a-zA-Z_][a-zA-Z0-9_]*):([^,}]+)/g, (m, k, v) => {
							v = v.trim()
							if (v === 'true' || v === 'false') return `"${k}":${v}`
							if (!isNaN(v) && v !== '' && !v.includes('/')) return `"${k}":${v}`
							return `"${k}":"${v}"`
						})
						result.push(JSON.parse(fixed))
					}
					return result
				} catch (e) {
					console.error('解析失败:', e)
					return []
				}
			}
		}
	}
</script>

<style>
	.view_bg {
		padding: 0 20px;
		background: #fff;
		line-height: 48px;
		border-radius: 10px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}
</style>