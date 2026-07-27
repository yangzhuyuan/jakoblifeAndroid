<template>
	<view class="country-picker">
		<!-- 触发按钮 - 显示选中的国家或"请选择" -->
		<view class="picker-trigger" @click="open">
			<view class="trigger-content">
				<text class="selected-name" :class="{ placeholder: !selectedCountry.name }">
					{{ displayName }}
				</text>
				<text class="selected-flag" v-if="selectedCountry.flag">{{ selectedCountry.flag }}</text>
			</view>
		</view>
		<!-- 弹窗遮罩 -->
		<view class="picker-mask" v-if="show" @click="close"></view>
		<!-- 选择器内容 -->
		<view class="picker-container" :class="{ show: show }">
			<!-- 头部 -->
			<view class="picker-header">
				<text class="title">{{$t('选择国家')}}</text>
				<text class="close-btn" @click="close">×</text>
			</view>

			<!-- 搜索框 -->
			<view class="search-box">
				<text class="search-icon">🔍</text>
				<input type="text" v-model="searchKeyword" :placeholder="searchPlaceholder"
					:placeholder-style="'color: #ccc'" />
				<text v-if="searchKeyword" class="clear-btn" @click="searchKeyword = ''">✕</text>
			</view>

			<!-- 国家列表 -->
			<scroll-view class="country-list" scroll-y :scroll-into-view="scrollToId">
				<view v-if="searchKeyword && filteredCountries.length === 0" class="empty-tip">
					{{$t('未找到匹配的国家')}}
				</view>

				<template v-else-if="!searchKeyword">
					<!-- 按字母分组显示全部国家 -->
					<view v-for="(group, letter) in groupedCountries" :key="letter">
						<view class="section-title" :id="'section-' + letter">{{ letter }}</view>
						<view class="country-item" v-for="item in group" :key="item.iso" @click="selectCountry(item)">
							<text class="country-flag">{{ item.flag }}</text>
							<text class="country-name">{{ getCountryName(item) }}</text>
						</view>
					</view>
				</template>

				<!-- 搜索结果 -->
				<template v-else>
					<view class="country-item" v-for="item in filteredCountries" :key="item.iso"
						@click="selectCountry(item)">
						<text class="country-flag">{{ item.flag }}</text>
						<text class="country-name">{{ getCountryName(item) }}</text>
					</view>
				</template>
			</scroll-view>

			<!-- 右侧字母索引（动态根据显示语言） -->
			<view class="alphabet-index" v-if="!searchKeyword">
				<view v-for="letter in alphabetList" :key="letter" class="index-letter" @click="scrollToLetter(letter)">
					{{ letter }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'CountryPicker',
		props: {
			// 默认选中的国家ISO代码（可选，不传则显示"请选择"）
			defaultIso: {
				type: String,
				default: ''
			},
			// 显示语言：'chinese' 或 'english'
			language: {
				type: String,
				default: 'chinese'
			},
			modename: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				show: false,
				searchKeyword: '',
				scrollToId: '',
				// 国家数据
				countries: [],
				// 选中的国家（初始为空）
				selectedCountry: {
					name: '',
					enName: '',
					code: '',
					iso: '',
					flag: ''
				}
			}
		},
		computed: {
			// 当前显示语言
			currentLanguage() {
				return this.language
			},

			// 选中国家显示的名称
			displayName() {
				if (!this.selectedCountry.name) return this.$t('请选择')
				return this.currentLanguage === 'chinese' ? this.selectedCountry.name : this.selectedCountry.enName
			},

			// 搜索框提示文字
			searchPlaceholder() {
				return this.currentLanguage === 'chinese' ? '搜索国家名称（中文/拼音）' : 'Search country name'
			},

			// 动态分组（根据显示语言）
			groupedCountries() {
				const groups = {}

				this.countries.forEach(country => {
					// 根据显示语言获取首字母
					let firstLetter
					if (this.currentLanguage === 'chinese') {
						// 中文模式：使用拼音首字母
						firstLetter = this.getPinyinInitial(country.name).charAt(0).toUpperCase()
					} else {
						// 英文模式：使用英文名首字母
						firstLetter = country.enName.charAt(0).toUpperCase()
					}

					if (!firstLetter) return

					if (!groups[firstLetter]) {
						groups[firstLetter] = []
					}
					groups[firstLetter].push(country)
				})

				// 字母排序
				const sortedGroups = {}
				Object.keys(groups).sort().forEach(key => {
					sortedGroups[key] = groups[key]
				})
				return sortedGroups
			},

			// 字母索引列表（动态）
			alphabetList() {
				return Object.keys(this.groupedCountries).sort()
			},

			// 智能搜索结果
			filteredCountries() {
				if (!this.searchKeyword.trim()) return []

				const keyword = this.searchKeyword.trim()

				if (this.currentLanguage === 'english') {
					// 英文模式：匹配英文名
					return this.countries.filter(country => {
						return country.enName.toLowerCase().includes(keyword.toLowerCase())
					})
				} else {
					// 中文模式：匹配中文名或拼音
					return this.countries.filter(country => {
						// 匹配中文名
						if (country.name.includes(keyword)) return true

						// 匹配拼音首字母（如输入"mg"匹配"美国"）
						const pinyinInitial = this.getPinyinInitial(country.name)
						if (pinyinInitial.toLowerCase().includes(keyword.toLowerCase())) return true

						// 匹配完整拼音
						const fullPinyin = this.getFullPinyin(country.name)
						if (fullPinyin.toLowerCase().includes(keyword.toLowerCase())) return true

						return false
					})
				}
			}
		},
		mounted() {
			this.initCountries()
			// 如果有默认ISO，则设置默认选中
			if (this.defaultIso) {
				const defaultCountry = this.countries.find(c => c.iso === this.defaultIso)
				if (defaultCountry) {
					this.selectedCountry = defaultCountry
				}
			}
		},
		methods: {
			// 获取国家显示名称
			getCountryName(country) {
				return this.currentLanguage === 'chinese' ? country.name : country.enName
			},

			// 获取中文拼音首字母（如"中国" -> "ZG"）
			getPinyinInitial(chinese) {
				const pinyinMap = {
					'中国': 'ZG',
					'美国': 'MG',
					'日本': 'RB',
					'韩国': 'HG',
					'英国': 'YG',
					'德国': 'DG',
					'法国': 'FG',
					'澳大利亚': 'ADLY',
					'加拿大': 'JND',
					'新加坡': 'XJP',
					'印度': 'YD',
					'俄罗斯': 'ELS',
					'巴西': 'BX',
					'意大利': 'YDL',
					'西班牙': 'XBY',
					'荷兰': 'HL',
					'瑞士': 'RS',
					'瑞典': 'RD',
					'挪威': 'NW',
					'丹麦': 'DM',
					'芬兰': 'FL',
					'比利时': 'BLS',
					'奥地利': 'ADL',
					'爱尔兰': 'AEL',
					'波兰': 'BL',
					'葡萄牙': 'PTY',
					'希腊': 'XL',
					'捷克': 'JK',
					'匈牙利': 'XYL',
					'土耳其': 'TEQ',
					'泰国': 'TG',
					'越南': 'YN',
					'马来西亚': 'MLXY',
					'菲律宾': 'FLB',
					'印度尼西亚': 'YDNXY',
					'南非': 'NF',
					'埃及': 'AJ',
					'沙特阿拉伯': 'STALB',
					'阿联酋': 'ALQ',
					'以色列': 'YSL',
					'新西兰': 'XXL',
					'墨西哥': 'MXG',
					'阿根廷': 'AGT',
					'智利': 'ZL',
					'秘鲁': 'ML',
					'哥伦比亚': 'GLBY',
					'巴基斯坦': 'BJST',
					'孟加拉国': 'MJLG',
					'尼日利亚': 'NRLY',
					'肯尼亚': 'KNY'
				}
				return pinyinMap[chinese] || chinese.charAt(0)
			},

			// 获取完整拼音
			getFullPinyin(chinese) {
				const pinyinFullMap = {
					'中国': 'zhongguo',
					'美国': 'meiguo',
					'日本': 'riben',
					'韩国': 'hanguo',
					'英国': 'yingguo',
					'德国': 'deguo',
					'法国': 'faguo',
					'澳大利亚': 'aodaliya',
					'加拿大': 'jianada',
					'新加坡': 'xinjiapo',
					'印度': 'yindu',
					'俄罗斯': 'eluosi',
					'巴西': 'baxi',
					'意大利': 'yidali',
					'西班牙': 'xibanya',
					'荷兰': 'helan',
					'瑞士': 'ruishi',
					'瑞典': 'ruidian',
					'挪威': 'nuowei',
					'丹麦': 'danmai',
					'芬兰': 'fenlan',
					'比利时': 'bilishi',
					'奥地利': 'aodili',
					'爱尔兰': 'aierlan',
					'波兰': 'bolan',
					'葡萄牙': 'putaoya',
					'希腊': 'xila',
					'捷克': 'jieke',
					'匈牙利': 'xiongyali',
					'土耳其': 'tuerqi',
					'泰国': 'taiguo',
					'越南': 'yuenan',
					'马来西亚': 'malaixiya',
					'菲律宾': 'feilvbin',
					'印度尼西亚': 'yindunixiya',
					'南非': 'nanfei',
					'埃及': 'aiji',
					'沙特阿拉伯': 'shatealabo',
					'阿联酋': 'alianqiu',
					'以色列': 'yiselie',
					'新西兰': 'xinxilan',
					'墨西哥': 'moxige',
					'阿根廷': 'agenting',
					'智利': 'zhili',
					'秘鲁': 'milu',
					'哥伦比亚': 'gelunbiya',
					'巴基斯坦': 'bajisitan',
					'孟加拉国': 'mengjialaguo',
					'尼日利亚': 'niriliya',
					'肯尼亚': 'keniya'
				}
				return pinyinFullMap[chinese] || ''
			},

			// 初始化国家数据
			initCountries() {
				this.countries = [{
						name: '中国',
						enName: 'China',
						code: '+86',
						iso: 'CN',
						flag: '🇨🇳'
					},
					{
						name: '美国',
						enName: 'United States',
						code: '+1',
						iso: 'US',
						flag: '🇺🇸'
					},
					{
						name: '日本',
						enName: 'Japan',
						code: '+81',
						iso: 'JP',
						flag: '🇯🇵'
					},
					{
						name: '韩国',
						enName: 'South Korea',
						code: '+82',
						iso: 'KR',
						flag: '🇰🇷'
					},
					{
						name: '英国',
						enName: 'United Kingdom',
						code: '+44',
						iso: 'GB',
						flag: '🇬🇧'
					},
					{
						name: '德国',
						enName: 'Germany',
						code: '+49',
						iso: 'DE',
						flag: '🇩🇪'
					},
					{
						name: '法国',
						enName: 'France',
						code: '+33',
						iso: 'FR',
						flag: '🇫🇷'
					},
					{
						name: '澳大利亚',
						enName: 'Australia',
						code: '+61',
						iso: 'AU',
						flag: '🇦🇺'
					},
					{
						name: '加拿大',
						enName: 'Canada',
						code: '+1',
						iso: 'CA',
						flag: '🇨🇦'
					},
					{
						name: '新加坡',
						enName: 'Singapore',
						code: '+65',
						iso: 'SG',
						flag: '🇸🇬'
					},
					{
						name: '印度',
						enName: 'India',
						code: '+91',
						iso: 'IN',
						flag: '🇮🇳'
					},
					{
						name: '俄罗斯',
						enName: 'Russia',
						code: '+7',
						iso: 'RU',
						flag: '🇷🇺'
					},
					{
						name: '巴西',
						enName: 'Brazil',
						code: '+55',
						iso: 'BR',
						flag: '🇧🇷'
					},
					{
						name: '意大利',
						enName: 'Italy',
						code: '+39',
						iso: 'IT',
						flag: '🇮🇹'
					},
					{
						name: '西班牙',
						enName: 'Spain',
						code: '+34',
						iso: 'ES',
						flag: '🇪🇸'
					},
					{
						name: '荷兰',
						enName: 'Netherlands',
						code: '+31',
						iso: 'NL',
						flag: '🇳🇱'
					},
					{
						name: '瑞士',
						enName: 'Switzerland',
						code: '+41',
						iso: 'CH',
						flag: '🇨🇭'
					},
					{
						name: '瑞典',
						enName: 'Sweden',
						code: '+46',
						iso: 'SE',
						flag: '🇸🇪'
					},
					{
						name: '挪威',
						enName: 'Norway',
						code: '+47',
						iso: 'NO',
						flag: '🇳🇴'
					},
					{
						name: '丹麦',
						enName: 'Denmark',
						code: '+45',
						iso: 'DK',
						flag: '🇩🇰'
					},
					{
						name: '芬兰',
						enName: 'Finland',
						code: '+358',
						iso: 'FI',
						flag: '🇫🇮'
					},
					{
						name: '比利时',
						enName: 'Belgium',
						code: '+32',
						iso: 'BE',
						flag: '🇧🇪'
					},
					{
						name: '奥地利',
						enName: 'Austria',
						code: '+43',
						iso: 'AT',
						flag: '🇦🇹'
					},
					{
						name: '爱尔兰',
						enName: 'Ireland',
						code: '+353',
						iso: 'IE',
						flag: '🇮🇪'
					},
					{
						name: '波兰',
						enName: 'Poland',
						code: '+48',
						iso: 'PL',
						flag: '🇵🇱'
					},
					{
						name: '葡萄牙',
						enName: 'Portugal',
						code: '+351',
						iso: 'PT',
						flag: '🇵🇹'
					},
					{
						name: '希腊',
						enName: 'Greece',
						code: '+30',
						iso: 'GR',
						flag: '🇬🇷'
					},
					{
						name: '捷克',
						enName: 'Czech Republic',
						code: '+420',
						iso: 'CZ',
						flag: '🇨🇿'
					},
					{
						name: '匈牙利',
						enName: 'Hungary',
						code: '+36',
						iso: 'HU',
						flag: '🇭🇺'
					},
					{
						name: '土耳其',
						enName: 'Turkey',
						code: '+90',
						iso: 'TR',
						flag: '🇹🇷'
					},
					{
						name: '泰国',
						enName: 'Thailand',
						code: '+66',
						iso: 'TH',
						flag: '🇹🇭'
					},
					{
						name: '越南',
						enName: 'Vietnam',
						code: '+84',
						iso: 'VN',
						flag: '🇻🇳'
					},
					{
						name: '马来西亚',
						enName: 'Malaysia',
						code: '+60',
						iso: 'MY',
						flag: '🇲🇾'
					},
					{
						name: '菲律宾',
						enName: 'Philippines',
						code: '+63',
						iso: 'PH',
						flag: '🇵🇭'
					},
					{
						name: '印度尼西亚',
						enName: 'Indonesia',
						code: '+62',
						iso: 'ID',
						flag: '🇮🇩'
					},
					{
						name: '南非',
						enName: 'South Africa',
						code: '+27',
						iso: 'ZA',
						flag: '🇿🇦'
					},
					{
						name: '埃及',
						enName: 'Egypt',
						code: '+20',
						iso: 'EG',
						flag: '🇪🇬'
					},
					{
						name: '沙特阿拉伯',
						enName: 'Saudi Arabia',
						code: '+966',
						iso: 'SA',
						flag: '🇸🇦'
					},
					{
						name: '阿联酋',
						enName: 'United Arab Emirates',
						code: '+971',
						iso: 'AE',
						flag: '🇦🇪'
					},
					{
						name: '以色列',
						enName: 'Israel',
						code: '+972',
						iso: 'IL',
						flag: '🇮🇱'
					},
					{
						name: '新西兰',
						enName: 'New Zealand',
						code: '+64',
						iso: 'NZ',
						flag: '🇳🇿'
					},
					{
						name: '墨西哥',
						enName: 'Mexico',
						code: '+52',
						iso: 'MX',
						flag: '🇲🇽'
					},
					{
						name: '阿根廷',
						enName: 'Argentina',
						code: '+54',
						iso: 'AR',
						flag: '🇦🇷'
					},
					{
						name: '智利',
						enName: 'Chile',
						code: '+56',
						iso: 'CL',
						flag: '🇨🇱'
					},
					{
						name: '秘鲁',
						enName: 'Peru',
						code: '+51',
						iso: 'PE',
						flag: '🇵🇪'
					},
					{
						name: '哥伦比亚',
						enName: 'Colombia',
						code: '+57',
						iso: 'CO',
						flag: '🇨🇴'
					},
					{
						name: '巴基斯坦',
						enName: 'Pakistan',
						code: '+92',
						iso: 'PK',
						flag: '🇵🇰'
					},
					{
						name: '孟加拉国',
						enName: 'Bangladesh',
						code: '+880',
						iso: 'BD',
						flag: '🇧🇩'
					},
					{
						name: '尼日利亚',
						enName: 'Nigeria',
						code: '+234',
						iso: 'NG',
						flag: '🇳🇬'
					},
					{
						name: '肯尼亚',
						enName: 'Kenya',
						code: '+254',
						iso: 'KE',
						flag: '🇰🇪'
					}
				]
			},

			open() {
				this.show = true
				this.searchKeyword = ''
			},

			close() {
				this.show = false
			},

			selectCountry(country) {
				this.selectedCountry = country
				this.close()
				this.$emit('change', country)
			},

			scrollToLetter(letter) {
				this.scrollToId = `section-${letter}`
			}
		}
	}
</script>

<style scoped>
	.country-picker {
		display: inline-block;
		width: 50%;
	}

	.picker-trigger {
		/* padding: 24rpx 30rpx; */
		/* background: #f5f5f5; */
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.trigger-content {
		display: flex;
		align-items: center;
		gap: 12rpx;
		flex: 1;
	}

	.selected-flag {
		font-size: 32rpx;
	}

	.selected-name {
		font-size: 28rpx;
		color: #333;
	}

	.selected-name.placeholder {
		color: #999;
	}

	.picker-trigger:active {
		/* background: #ebebeb; */
	}

	.picker-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}

	.picker-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 80vh;
		background: #fff;
		border-radius: 32rpx 32rpx 0 0;
		transform: translateY(100%);
		transition: transform 0.3s ease;
		z-index: 1001;
		display: flex;
		flex-direction: column;
	}

	.picker-container.show {
		transform: translateY(0);
	}

	.picker-header {
		padding: 30rpx;
		border-bottom: 1px solid #eee;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.picker-header .title {
		font-size: 34rpx;
		font-weight: bold;
		color: #333;
	}

	.close-btn {
		font-size: 48rpx;
		color: #999;
		padding: 0 20rpx;
	}

	.close-btn:active {
		color: #666;
	}

	.search-box {
		margin: 10px 15px 10px;
		padding: 20rpx 30rpx;
		background: #f5f5f5;
		border-radius: 60rpx;
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.search-icon {
		font-size: 32rpx;
	}

	.search-box input {
		flex: 1;
		font-size: 28rpx;
		background: transparent;
	}

	.clear-btn {
		font-size: 32rpx;
		color: #999;
		padding: 0 10rpx;
	}

	.clear-btn:active {
		color: #666;
	}

	.country-list {
		flex: 1;
		overflow-y: auto;
		padding-bottom: 40rpx;
	}

	.section-title {
		padding: 20rpx 30rpx;
		background: #f9f9f9;
		font-size: 26rpx;
		color: #999;
		font-weight: bold;
	}


	.country-item {
		padding: 28rpx 30rpx;
		display: flex;
		align-items: center;
		gap: 20rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.country-item:active {
		background: #f5f5f5;
	}

	.country-flag {
		font-size: 40rpx;
	}

	.country-name {
		flex: 1;
		font-size: 28rpx;
		color: #333;
	}

	.empty-tip {
		text-align: center;
		padding: 100rpx;
		color: #999;
		font-size: 28rpx;
	}

	.alphabet-index {
		position: fixed;
		right: 20rpx;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 8rpx;
		z-index: 1002;
	}

	.index-letter {
		width: 40rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #007aff;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 20rpx;
	}

	.index-letter:active {
		background: rgba(0, 122, 255, 0.2);
	}
</style>