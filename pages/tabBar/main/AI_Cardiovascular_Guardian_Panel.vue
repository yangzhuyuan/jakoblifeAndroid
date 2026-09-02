<template>
	<view class="page">
		<!-- Hero -->
		<view class="hero">
			<text class="hero-tag">Jakoblife AI+</text>
			<text class="hero-title">AI 心血管守护者</text>
			<text class="hero-slogan">AI连接一切</text>
			<text class="hero-sub">血压 + 心律 + 睡眠 + 血氧饱和度</text>
			<text class="hero-promise">学习你的正常。检测有意义的变化。</text>
		</view>

		<!-- 1. 执行建议 -->
		<view class="section">
			<view class="section-head">
				<text class="section-num">01</text>
				<text class="section-title">执行建议</text>
			</view>
			<view class="card">
				<text class="card-title">Jakoblife AI 心血管守护者</text>
				<text class="para">这是一项个性化AI服务，通过学习每位用户的正常心血管模式，结合血压、心律、心率、HRV、血氧、睡眠和活动数据，检测有意义的生理变化。</text>
				<view class="quote">
					<text class="quote-label">核心客户承诺</text>
					<text class="quote-text">“AI学习你的正常状态，并在发生有意义变化时通知你。”</text>
				</view>
				<text class="para">为何比通用AI聊天机器人更强大：Jakoblife可以围绕自身的血压测量数据和长期可穿戴数据构建AI，使其价值主张更具差异化和防御性。</text>
			</view>
		</view>

		<!-- 2. 客户体验 -->
		<view class="section">
			<view class="section-head">
				<text class="section-num">02</text>
				<text class="section-title">客户体验</text>
			</view>
			<view class="card status-stable">
				<view class="status-badge stable">当前数据</view>
				<text class="status-main">今日心血管状态：稳定</text>
				<view class="metric-row">
					<text class="m-label">夜间平均血压</text>
					<text class="m-val">{{ nightBpDisplay }}</text>
				</view>
				<view class="metric-row">
					<text class="m-label">夜间平均心率</text>
					<text class="m-val">{{ nightHrDisplay }}</text>
				</view>
				<view class="metric-row">
					<text class="m-label">血氧饱和度</text>
					<text class="m-val">{{ spo2Display }}</text>
				</view>
				<view class="metric-row">
					<text class="m-label">睡眠</text>
					<text class="m-val">{{ sleepDisplay }}</text>
				</view>
				<text class="status-note">未发现与个人基线的显著变化。</text>
			</view>
			<view class="card status-alert">
				<view class="status-badge alert">变化检测示例</view>
				<text class="status-main warn">检测到重要变化</text>
				<text class="para">夜间收缩压已连续三晚比用户个人基线高出约12 mmHg，同时睡眠血氧也低于正常水平。</text>
				<view class="advice-box">
					<text class="advice-label">建议下一步</text>
					<text class="advice-text">起床后使用标准充气袖带式血压计测量血压，并继续监测。如模式持续，请生成报告并与医疗专业人员分享。</text>
				</view>
			</view>
		</view>
		<!-- 3. 跨指标事件分析 -->
		<view class="section">
			<view class="section-head">
				<text class="section-num">03</text>
				<text class="section-title">关键差异化：跨指标事件分析</text>
			</view>
			<view class="card">
				<text class="para">AI不应针对血压、血氧、睡眠和心律分别发出警报，而应在同一时间轴上识别联合事件。</text>
				<view class="table">
					<view class="tr th">
						<text class="td td1">联合信号</text>
						<text class="td td2">AI解读</text>
						<text class="td td3">面向客户的输出</text>
					</view>
					<view class="tr" v-for="(row, i) in eventRows" :key="i">
						<text class="td td1">{{ row.signal }}</text>
						<text class="td td2">{{ row.meaning }}</text>
						<text class="td td3">{{ row.output }}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 4. 六大功能 -->
		<view class="section">
			<view class="section-head">
				<text class="section-num">04</text>
				<text class="section-title">六大功能一体化服务</text>
			</view>
			<view class="feature-item" v-for="(f, i) in features" :key="i">
				<view class="feature-index">{{ i + 1 }}</view>
				<view class="feature-body">
					<text class="feature-name">{{ f.name }}</text>
					<text class="feature-desc">{{ f.desc }}</text>
				</view>
			</view>
		</view>
		<!-- 5. 家庭安心 -->
		<view class="section">
			<view class="section-head">
				<text class="section-num">05</text>
				<text class="section-title">最强销售场景：家庭安心</text>
			</view>
			<view class="card">
				<text class="para">对于老年市场，最有力的商业信息可能是家庭监护而非手表本身。成年子女往往是经济上的购买决策者，即使父母是佩戴者。</text>
				<view class="msg-demo ok">
					<text class="msg-title">日常家庭消息示例</text>
					<text class="msg-body">爸爸的健康更新 — 今日无明显心血管变化。</text>
					<text class="msg-tags">血压：稳定 | 睡眠：良好 | 心律：稳定</text>
				</view>
				<view class="msg-demo caution">
					<text class="msg-title">注意消息示例</text>
					<text class="msg-body">建议关注 — 爸爸的血压自昨晚起异常升高。建议重复测量血压。</text>
				</view>
			</view>
		</view>
		<!-- 6. 可解释AI -->
		<view class="section">
			<view class="section-head">
				<text class="section-num">06</text>
				<text class="section-title">个人正常值 + 可解释AI</text>
			</view>
			<view class="card">
				<text class="para">AI应学习每位用户的个性化基线。这比仅依赖通用阈值更有用，因为在达到固定警报阈值之前，临床相关变化可能已经发生。</text>
				<text class="card-subtitle">AI为何标记此事件？</text>
				<view class="explain-row" v-for="(e, i) in explanations" :key="i">
					<text class="explain-key">{{ e.key }}</text>
					<text class="explain-val">{{ e.val }}</text>
				</view>
			</view>
		</view>
		<!-- 7. 首页设计 -->
		<view class="section">
			<view class="section-head">
				<text class="section-num">07</text>
				<text class="section-title">推荐首页设计</text>
			</view>
			<view class="home-compare">
				<view class="home-col stable-col">
					<text class="home-state">稳定状态</text>
					<text class="home-main">今日健康：稳定</text>
					<text class="home-line">未检测到重要变化</text>
					<text class="home-line">夜间血压：{{ nightBpDisplay }}</text>
					<text class="home-line">夜间心率：{{ nightHrDisplay }}</text>
					<text class="home-line">血氧：{{ spo2Display }}</text>
					<text class="home-line">睡眠：{{ sleepDisplay }}</text>
					<text class="home-insight">AI洞察：与您30天个人模式一致</text>
				</view>
				<view class="home-col alert-col">
					<text class="home-state">关注状态</text>
					<text class="home-main warn">今日健康：检测到变化</text>
					<text class="home-line">夜间血压↑</text>
					<text class="home-line">心率↑</text>
					<text class="home-line">睡眠质量↓</text>
					<text class="home-insight">AI建议：今晨进行标准血压测量</text>
					<view class="btn-row">
						<text class="mini-btn">查看原因</text>
						<text class="mini-btn">分享给家人</text>
						<text class="mini-btn primary">生成医生报告</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 8. 盈利模式 -->
		<view class="section">
			<view class="section-head">
				<text class="section-num">08</text>
				<text class="section-title">盈利模式：Jakoblife AI+</text>
			</view>
			<view class="card">
				<text class="para">同一功能可支持经常性收入，同时保持核心设备功能可免费使用。</text>
				<view class="plan-row">
					<view class="plan free">
						<text class="plan-name">Jakoblife 免费版</text>
						<text class="plan-item" v-for="(p, i) in freePlan" :key="'f'+i">{{ p }}</text>
					</view>
					<view class="plan plus">
						<text class="plan-name">Jakoblife AI+</text>
						<text class="plan-item" v-for="(p, i) in plusPlan" :key="'p'+i">{{ p }}</text>
					</view>
				</view>
				<view class="price-tip">
					<text>建议定价测试：$5.99–$9.99/月</text>
					<text>精选手表购买附赠6–12个月服务</text>
				</view>
			</view>
		</view>

		<!-- 9. 监管定位 -->
		<view class="section">
			<view class="section-head">
				<text class="section-num">09</text>
				<text class="section-title">产品与监管定位</text>
			</view>
			<view class="card">
				<text class="para">在初始商业版本中，AI应强调有意义的变化、个人基线偏差、重复测量、家庭共享和报告生成，而非做出未经验证的疾病预测声明。</text>
				<view class="dos">
					<text class="do-title">✅ 推荐表述</text>
					<text class="do-item" v-for="(d, i) in doList" :key="'d'+i">{{ d }}</text>
				</view>
				<view class="donts">
					<text class="do-title">❌ 避免声明</text>
					<text class="do-item">避免未经验证的声明，如特定的中风或猝死概率。</text>
				</view>
			</view>
		</view>

		<!-- 10. 路线图 -->
		<view class="section">
			<view class="section-head">
				<text class="section-num">10</text>
				<text class="section-title">推荐开发路线图</text>
			</view>
			<view class="roadmap">
				<view class="road-item" v-for="(r, i) in roadmap" :key="i">
					<view class="road-dot"></view>
					<view class="road-content">
						<text class="road-phase">{{ r.phase }}</text>
						<text class="road-feat">{{ r.feat }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 11. 营销信息 -->
		<view class="section last">
			<view class="section-head">
				<text class="section-num">11</text>
				<text class="section-title">面向客户的营销信息</text>
			</view>
			<view class="marketing">
				<text class="mkt-title">AI连接一切</text>
				<text class="mkt-line">血压 + 心律 + 睡眠 + 血氧饱和度</text>
				<text class="mkt-cta">学习你的正常。检测有意义的变化。</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getChinaTimeAllJSON
	} from '@/pages/api/unitls/timezone.js'

	export default {
		data() {
			return {
				sleep: '--/--',
				spo2: '--',
				nightBp: {
					systolic: '-',
					diastolic: '-'
				},
				nightHr: '-',
				eventRows: [{
						signal: '血压↑ + 心率↑ + 心律不齐',
						meaning: '与基线相比的心血管变化',
						output: '检测到有临床意义的心血管变化'
					},
					{
						signal: '血压↑ + 睡眠差 + 血氧↓',
						meaning: '可能的睡眠相关心血管应激模式',
						output: '夜间模式与您的正常状态不同'
					},
					{
						signal: '心律事件 + 血压变化',
						meaning: '可能重要的同步事件',
						output: '查看事件，如有需要重复测量血压'
					},
					{
						signal: '连续数日血压持续升高',
						meaning: '持续偏离个人正常状态',
						output: '考虑分享趋势报告'
					}
				],
				features: [{
						name: '个人AI基线',
						desc: '学习每位用户的正常晨间、日间、夜间、睡眠、HRV、血氧、心率和心律模式。'
					},
					{
						name: '异常变化检测',
						desc: '标记偏离用户自身基线的有意义偏差，而非仅依赖固定的人群阈值。'
					},
					{
						name: '跨指标事件分析',
						desc: '在同一时间轴上综合血压、心律、心率、HRV、血氧、睡眠和活动数据。'
					},
					{
						name: '家庭/照护者警报',
						desc: '向授权的家庭成员或照护者发送简洁、可操作的更新。'
					},
					{
						name: 'AI每日健康简报',
						desc: '提供易于理解的晨间摘要，而非大量零散的指标数据。'
					},
					{
						name: '医生就绪事件报告',
						desc: '围绕重要事件、趋势和支持数据生成简洁报告。'
					}
				],
				explanations: [{
						key: '血压',
						val: '比30天夜间平均值高 +14 mmHg'
					},
					{
						key: '心率',
						val: '比平常睡眠心率高 +11 bpm'
					},
					{
						key: '睡眠',
						val: '比平时少 1小时43分钟'
					},
					{
						key: '血氧',
						val: '比用户通常夜间平均值低 2.8%'
					}
				],
				freePlan: ['血压测量', '心率', '血氧饱和度', '睡眠', '基础报告'],
				plusPlan: ['个人AI基线', '每日心血管简报', '跨指标分析', '智能变化警报', '家庭监护', '30/90天AI报告', '医生就绪事件报告'],
				doList: [
					'“检测到重大心血管变化。”',
					'“此模式与您的个人基线不同。”',
					'“建议重复测量血压。”',
					'“建议与医疗专业人员分享此报告。”'
				],
				roadmap: [{
						phase: '第一阶段',
						feat: '个人AI基线'
					},
					{
						phase: '第二阶段',
						feat: '每日心血管健康简报'
					},
					{
						phase: '第三阶段',
						feat: '多指标异常变化检测'
					},
					{
						phase: '第四阶段',
						feat: '家庭/照护者警报'
					},
					{
						phase: '第五阶段',
						feat: '一键生成医生事件报告'
					},
					{
						phase: '第六阶段',
						feat: '房颤/房早/室早 + 血压联合事件分析'
					},
					{
						phase: '后续',
						feat: '经验证的临床风险预测'
					}
				]
			};
		},
		computed: {
			nightBpDisplay() {
				const s = this.nightBp.systolic;
				const d = this.nightBp.diastolic;
				if (!this.isValidMetric(s) || !this.isValidMetric(d)) return '--/--';
				return `${s}/${d}`;
			},
			nightHrDisplay() {
				if (!this.isValidMetric(this.nightHr)) return '--/--';
				return `${this.nightHr} bpm`;
			},
			spo2Display() {
				if (!this.isValidMetric(this.spo2)) return '--/--';
				return `${this.spo2}%`;
			},
			sleepDisplay() {
				return this.formatSleepText(this.sleep);
			}
		},
		props: {
			/** 嵌入其他页面时传 true，不改导航栏标题 */
			embedded: {
				type: Boolean,
				default: false
			},
			/** 嵌入时是否自动拉数，默认 true */
			autoLoad: {
				type: Boolean,
				default: true
			}
		},
		mounted() {
			if (this.autoLoad) {
				this.refreshData();
			}
		},
		methods: {
			/** 供父页面 / 本页 onShow 主动刷新 */
			refreshData() {
				if (!this.embedded) {
					uni.setNavigationBarTitle({
						title: 'AI 心血管守护者'
					});
				}
				this.loadHomeSleepAndSpo2();
				this.loadNightBpAndHr();
			},
			isValidMetric(val) {
				if (val == null || val === '') return false;
				const s = String(val).trim();
				if (!s || s === '-' || s === '--' || s === '--/--' || s === '-/-' || s === 'NA') return false;
				const n = Number(s);
				if (Number.isFinite(n) && n >= 999999990) return false;
				return true;
			},
			findRegister(data, key) {
				if (!Array.isArray(data)) return null;
				for (let i = 0; i < data.length; i++) {
					if (data[i] && data[i].register === key) return data[i];
				}
				return null;
			},
			formatSleepText(sleepVal) {
				if (!this.isValidMetric(sleepVal) || sleepVal === '0H0M' || sleepVal === '0h0m') {
					return '--/--';
				}
				const raw = String(sleepVal).trim();
				const m = raw.match(/^(\d+)\s*[Hh时]\s*(\d+)\s*[Mm分]?/);
				if (m) {
					return `${m[1]}小时${m[2]}分钟`;
				}
				return raw;
			},
			checkAndAssign(value) {
				const n = Number(value);
				return Number.isFinite(n) && n >= 999999990 ? 'NA' : value;
			},
			/** 首页同源：list_recipe 睡眠 + 血氧（与 Main 一致） */
			loadHomeSleepAndSpo2() {
				const cachedSpo2 = uni.getStorageSync('xueyang');
				if (this.isValidMetric(cachedSpo2)) {
					this.spo2 = cachedSpo2;
				}
				const data = {
					userId: uni.getStorageSync('userid')
				};
				this.$post(this.$url_APP_IP + this.$url_list_recipe, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(res => {
					if (res.code != 200 || !res.data) return;
					const sleepEntry = this.findRegister(res.data, 'sleep');
					const sleepVal = sleepEntry && sleepEntry.registerVal != null ?
						String(sleepEntry.registerVal).trim() : '';
					if (!sleepVal || sleepVal === '-/-' || sleepVal === '--/--' || sleepVal === '0H0M') {
						this.sleep = '--/--';
					} else {
						this.sleep = sleepVal;
					}
					const o2Entry = this.findRegister(res.data, 'oxygen');
					const o2Val = o2Entry && o2Entry.registerVal != null ?
						String(o2Entry.registerVal).trim() : '';
					if (this.isValidMetric(o2Val)) {
						this.spo2 = o2Val;
					} else if (this.isValidMetric(uni.getStorageSync('xueyang'))) {
						this.spo2 = uni.getStorageSync('xueyang');
					}
				}).catch(() => {});
			},
			/**
			 * 24小时报告同源：get_finalRetVarList
			 * 夜间平均血压 [10]/[11]，对应夜间平均心率 [12]
			 */
			loadNightBpAndHr() {
				const chinaNow = getChinaTimeAllJSON();
				const chinaHour = Number(chinaNow.YMDHMS.slice(11, 13));
				const profYmd = chinaHour < 1 ?
					getChinaTimeAllJSON(new Date(Date.now() - 24 * 60 * 60 * 1000)).YMD :
					chinaNow.YMD;
				// 与 hour_monitoring_report_24.vue 的 finlretVarList1 前段一致，保证下标 [10]/[11]/[12]
				const finlretVarList1 =
					'BPvSBPvCNTv1WvCNTv0002,BPvSBPvCNTv1WvCNTv0003,BPvSBPvCNTv1WvCNTv0004,BPvSBPvCNTv1WvCNTv0001,JLvRULEv1WvDATACHECKv0001,JLvRULEv1WvDATACHECKv0002,JLvRULEv1WvDATACHECKv0003,BPvSBPvAVGv1WvAVGv0002,BPvDBPvAVGv1WvAVGv0002,BPvHRvAVGv1WvAVGv0002,BPvSBPvAVGv1WvAVGv0003,BPvDBPvAVGv1WvAVGv0003,BPvHRvAVGv1WvAVGv0003,BPvSBPvAVGv1WvAVGv0004,BPvDBPvAVGv1WvAVGv0004,BPvHRvAVGv1WvAVGv0004,BPvSBPvAVGv1WvAVGv0001,BPvDBPvAVGv1WvAVGv0001,BPvHRvAVGv1WvAVGv0001,JLvRULEv1WvBPCHECKv0004,JLvRULEv1WvBPCHECKv0005,JLvRULEv1WvBPCHECKv0007,JLvRULEv1WvBPCHECKv0008,JLvRULEv1WvBPCHECKv0010,JLvRULEv1WvBPCHECKv0011,JLvRULEv1WvBPCHECKv0001,JLvRULEv1WvBPCHECKv0002,BPvSBPvSTDv1WvSTDv0002,BPvDBPvSTDv1WvSTDv0002,BPvHRvSTDv1WvSTDv0002,BPvSBPvSTDv1WvSTDv0003,BPvDBPvSTDv1WvSTDv0003,BPvHRvSTDv1WvSTDv0003,BPvSBPvSTDv1WvSTDv0004,BPvDBPvSTDv1WvSTDv0004,BPvHRvSTDv1WvSTDv0004,BPvSBPvSTDv1WvSTDv0001,BPvDBPvSTDv1WvSTDv0001,BPvHRvSTDv1WvSTDv0001,BPvSBPvMAXv1WvMAXv0002,BPvDBPvMAXv1WvMAXv0002,BPvHRvMAXv1WvMAXv0002,BPvSBPvMAXv1WvMAXv0003,BPvDBPvMAXv1WvMAXv0003,BPvHRvMAXv1WvMAXv0003,BPvSBPvMAXv1WvMAXv0004,BPvDBPvMAXv1WvMAXv0004,BPvHRvMAXv1WvMAXv0004,BPvSBPvMAXv1WvMAXv0001,BPvDBPvMAXv1WvMAXv0001,BPvHRvMAXv1WvMAXv0001,BPvSBPvMEDv1WvMEDv0002,BPvDBPvMEDv1WvMEDv0002,BPvHRvMEDv1WvMEDv0002,BPvSBPvMEDv1WvMEDv0003,BPvDBPvMEDv1WvMEDv0003,BPvHRvMEDv1WvMEDv0003,BPvSBPvMEDv1WvMEDv0004,BPvDBPvMEDv1WvMEDv0004,BPvHRvMEDv1WvMEDv0004,BPvSBPvMEDv1WvMEDv0001,BPvDBPvMEDv1WvMEDv0001,BPvHRvMEDv1WvMEDv0001,BPvSBPvMINv1WvMINv0002,BPvDBPvMINv1WvMINv0002,BPvHRvMINv1WvMINv0002,BPvSBPvMINv1WvMINv0003,BPvDBPvMINv1WvMINv0003,BPvHRvMINv1WvMINv0003,BPvSBPvMINv1WvMINv0004,BPvDBPvMINv1WvMINv0004,BPvHRvMINv1WvMINv0004,BPvSBPvMINv1WvMINv0001,BPvDBPvMINv1WvMINv0001,BPvHRvMINv1WvMINv0001,BPvSBPvLOADv1WvRATIOv0002,BPvDBPvLOADv1WvRATIOv0002,BPvSBPvLOADv1WvRATIOv0003,BPvDBPvLOADv1WvRATIOv0003,BPvSBPvLOADv1WvRATIOv0004,BPvDBPvLOADv1WvRATIOv0004,BPvSBPvLOADv1WvRATIOv0001,BPvDBPvLOADv1WvRATIOv0001,JLvRULEv1WvBPCHECKv0022,JLvRULEv1WvBPCHECKv0027,JLvRULEv1WvBPCHECKv0023,JLvRULEv1WvBPCHECKv0028,JLvRULEv1WvBPCHECKv0024,JLvRULEv1WvBPCHECKv0029,JLvRULEv1WvBPCHECKv0021,JLvRULEv1WvBPCHECKv0026,BPvSBPvNBRv1WvRATIOv0001,BPvDBPvNBRv1WvRATIOv0001,JLvRULEv1WvBPCHECKv0013,JLvRULEv1WvBPCHECKv0014,JLvRULEv1WvBPCHECKv0015,JLvRULEv1WvBPCHECKv0016,JLvRULEv1WvBPCHECKv0017,JLvRULEv1WvBPCHECKv0018, JLvRULEv1WvBPCHECKv0019, JLvRULEv1WvBPCHECKv0020,BPvSBPvMBSv1WvMINUSv0001,BPvDBPvMBSv1WvMINUSv0001,JLvRULEv1WvBPCHECKv0031,BPvSBPvCVv1WvRATIO2v0002,BPvDBPvCVv1WvRATIO2v0002,BPvHRvCVv1WvRATIO2v0002,BPvSBPvCVv1WvRATIO2v0003,BPvDBPvCVv1WvRATIO2v0003,BPvHRvCVv1WvRATIO2v0003,BPvSBPvCVv1WvRATIO2v0004,BPvDBPvCVv1WvRATIO2v0004,BPvHRvCVv1WvRATIO2v0004,BPvSBPvCVv1WvRATIO2v0001,BPvDBPvCVv1WvRATIO2v0001,BPvHRvCVv1WvRATIO2v0001,BPvAASIv1W,JLvRULEv1WvBPCHECKv0032';
				const data = {
					userId: uni.getStorageSync('userid'),
					profDate: profYmd + ' 00:00:00',
					period: '1W',
					retVarList: finlretVarList1.toLowerCase()
				};
				this.$post(this.$url_APP_IP + '/prod-api/device_app/get_finalRetVarList', data, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					if (res.code !== 200 || !res.data || !res.data.retVarList) {
						this.loadNightBpAndHrFromDetail(profYmd);
						return;
					}
					const row = String(res.data.retVarList).split(';').filter(Boolean)[0];
					if (!row) {
						this.loadNightBpAndHrFromDetail(profYmd);
						return;
					}
					const parts = row.split(',');
					const sbp = this.checkAndAssign(parts[10]);
					const dbp = this.checkAndAssign(parts[11]);
					const hr = this.checkAndAssign(parts[12]);
					if (this.isValidMetric(sbp) && this.isValidMetric(dbp)) {
						this.nightBp = {
							systolic: Math.round(Number(sbp)),
							diastolic: Math.round(Number(dbp))
						};
					} else {
						this.nightBp = {
							systolic: '-',
							diastolic: '-'
						};
					}
					if (this.isValidMetric(hr)) {
						this.nightHr = Math.round(Number(hr));
					} else {
						this.nightHr = '-';
					}
					if (!this.isValidMetric(this.nightBp.systolic) || !this.isValidMetric(this.nightHr)) {
						this.loadNightBpAndHrFromDetail(profYmd);
					}
				}).catch(() => {
					this.loadNightBpAndHrFromDetail(profYmd);
				});
			},
			/** 兜底：24小时明细夜间血压均值 + 同批对应心率均值 */
			loadNightBpAndHrFromDetail(profYmd) {
				const data = {
					userId: uni.getStorageSync('userid'),
					profDate: (profYmd || getChinaTimeAllJSON().YMD) + ' 00:00:00',
					filterVarList: 'JLvFLGvJL01v1W',
					retVarList: 'TIME_MEASURE,JLvOPRvJL01vSBP,JLvOPRvJL01vDBP,JLvOPRvJL01vHR'
				};
				this.$post(this.$url_APP_IP + '/prod-api/device_app/get_retVarList', data, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					if (res.code !== 200 || !res.data || !res.data.retVarList) return;
					const nightRows = this.parseNightBpRows(res.data.retVarList);
					if (!nightRows.length) return;
					const needBp = !this.isValidMetric(this.nightBp.systolic) ||
						!this.isValidMetric(this.nightBp.diastolic);
					const needHr = !this.isValidMetric(this.nightHr);
					if (needBp) {
						const sysSum = nightRows.reduce((a, b) => a + b.systolic, 0);
						const diaSum = nightRows.reduce((a, b) => a + b.diastolic, 0);
						this.nightBp = {
							systolic: Math.round(sysSum / nightRows.length),
							diastolic: Math.round(diaSum / nightRows.length)
						};
					}
					if (needHr) {
						const hrRows = nightRows.filter(r => this.isValidMetric(r.heartRate));
						if (hrRows.length) {
							const hrSum = hrRows.reduce((a, b) => a + Number(b.heartRate), 0);
							this.nightHr = Math.round(hrSum / hrRows.length);
						}
					}
				}).catch(() => {});
			},
			parseNightBpRows(retVarListStr) {
				const rows = [];
				const isInvalid = (value) => {
					const v = String(value == null ? '' : value).trim();
					if (!v || v === 'NA') return true;
					const n = Number(v);
					return !Number.isFinite(n) || n >= 999999990;
				};
				String(retVarListStr).split(';').filter(Boolean).forEach(row => {
					const parts = row.split(',').map(item => item.trim());
					if (parts.length < 4) return;
					if (isInvalid(parts[1]) || isInvalid(parts[2])) return;
					const timeStr = (parts[0].split(' ')[1] || '');
					const hm = timeStr.split(':');
					const hour = parseInt(hm[0], 10);
					const minute = parseInt(hm[1], 10);
					if (Number.isNaN(hour) || Number.isNaN(minute)) return;
					const mins = hour * 60 + minute;
					// 与24小时报告一致：06:00–21:30 为白天，其余为夜间
					const isNight = !(mins >= 6 * 60 && mins < 21 * 60 + 30);
					if (!isNight) return;
					rows.push({
						systolic: Number(parts[1]),
						diastolic: Number(parts[2]),
						heartRate: isInvalid(parts[3]) ? null : Number(parts[3])
					});
				});
				return rows;
			}
		}
	};
</script>

<style scoped>
	.page {
		/* min-height: 100vh; */
		/* background: #F4F5F7; */
		/* padding-bottom: 48rpx; */
	}

	.hero {
		padding: 48rpx 40rpx 56rpx;
		background: linear-gradient(160deg, #0B3A5C 0%, #1296DB 55%, #4AB3F0 100%);
		display: flex;
		flex-direction: column;
	}

	.hero-tag {
		align-self: flex-start;
		font-size: 22rpx;
		color: #0B3A5C;
		background: rgba(255, 255, 255, 0.92);
		padding: 8rpx 20rpx;
		border-radius: 8rpx;
		font-weight: 600;
		margin-bottom: 24rpx;
	}

	.hero-title {
		font-size: 48rpx;
		font-weight: 700;
		color: #FFFFFF;
		margin-bottom: 16rpx;
	}

	.hero-slogan {
		font-size: 34rpx;
		font-weight: 600;
		color: #E8F6FF;
		margin-bottom: 8rpx;
	}

	.hero-sub {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.85);
		margin-bottom: 20rpx;
	}

	.hero-promise {
		font-size: 28rpx;
		color: #FFFFFF;
		font-weight: 500;
		line-height: 1.5;
	}

	.section {
		padding: 32rpx 28rpx 0;
	}

	.section.last {
		padding-bottom: 24rpx;
	}

	.section-head {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.section-num {
		font-size: 24rpx;
		font-weight: 700;
		color: #1296DB;
		margin-right: 16rpx;
		letter-spacing: 1rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: 700;
		color: #1A1A1A;
		flex: 1;
	}

	.card {
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 28rpx;
		margin-bottom: 20px;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.card-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #1A1A1A;
		margin-bottom: 16rpx;
		display: block;
	}

	.card-subtitle {
		font-size: 28rpx;
		font-weight: 600;
		color: #0B3A5C;
		margin: 24rpx 0 16rpx;
		display: block;
	}

	.para {
		font-size: 26rpx;
		color: #4A4A4A;
		line-height: 1.7;
		display: block;
		margin-bottom: 16rpx;
	}

	.quote {
		background: #F0F8FF;
		border-left: 6rpx solid #1296DB;
		padding: 20rpx 24rpx;
		margin: 16rpx 0 20rpx;
		border-radius: 0 12rpx 12rpx 0;
	}

	.quote-label {
		font-size: 22rpx;
		color: #1296DB;
		font-weight: 600;
		display: block;
		margin-bottom: 8rpx;
	}

	.quote-text {
		font-size: 28rpx;
		color: #1A1A1A;
		font-weight: 600;
		line-height: 1.5;
		display: block;
	}

	.status-badge {
		align-self: flex-start;
		font-size: 22rpx;
		padding: 6rpx 16rpx;
		border-radius: 8rpx;
		margin-bottom: 16rpx;
		display: inline-block;
		font-weight: 600;
	}

	.status-badge.stable {
		background: #E8F8EF;
		color: #1B8A4A;
	}

	.status-badge.alert {
		background: #FFF3E8;
		color: #D97706;
	}

	.status-main {
		font-size: 32rpx;
		font-weight: 700;
		color: #1B8A4A;
		display: block;
		margin-bottom: 20rpx;
	}

	.status-main.warn {
		color: #C2410C;
	}

	.metric-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 12rpx 0;
		border-bottom: 1rpx solid #F0F0F0;
	}

	.m-label {
		font-size: 26rpx;
		color: #666666;
	}

	.m-val {
		font-size: 26rpx;
		color: #1A1A1A;
		font-weight: 500;
	}

	.status-note {
		font-size: 24rpx;
		color: #1B8A4A;
		margin-top: 20rpx;
		display: block;
	}

	.advice-box {
		background: #FFF8F0;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-top: 8rpx;
	}

	.advice-label {
		font-size: 24rpx;
		font-weight: 700;
		color: #C2410C;
		display: block;
		margin-bottom: 8rpx;
	}

	.advice-text {
		font-size: 26rpx;
		color: #4A4A4A;
		line-height: 1.6;
		display: block;
	}

	.table {
		margin-top: 8rpx;
		border: 1rpx solid #E8EEF4;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.tr {
		display: flex;
		flex-direction: row;
		border-bottom: 1rpx solid #E8EEF4;
	}

	.tr:last-child {
		border-bottom: none;
	}

	.tr.th {
		background: #EBF5FC;
	}

	.td {
		font-size: 22rpx;
		color: #333333;
		padding: 16rpx 10rpx;
		line-height: 1.45;
	}

	.tr.th .td {
		font-weight: 700;
		color: #0B3A5C;
		font-size: 22rpx;
	}

	.td1 {
		flex: 1.2;
	}

	.td2 {
		flex: 1.1;
	}

	.td3 {
		flex: 1.2;
	}

	.feature-item {
		display: flex;
		flex-direction: row;
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 16rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.feature-index {
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		background: #1296DB;
		color: #FFFFFF;
		font-size: 24rpx;
		font-weight: 700;
		text-align: center;
		line-height: 48rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.feature-body {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.feature-name {
		font-size: 28rpx;
		font-weight: 700;
		color: #1A1A1A;
		margin-bottom: 8rpx;
	}

	.feature-desc {
		font-size: 24rpx;
		color: #666666;
		line-height: 1.55;
	}

	.msg-demo {
		border-radius: 14rpx;
		padding: 22rpx;
		margin-top: 16rpx;
	}

	.msg-demo.ok {
		background: #EEF9F2;
	}

	.msg-demo.caution {
		background: #FFF4EC;
	}

	.msg-title {
		font-size: 22rpx;
		font-weight: 600;
		color: #888888;
		display: block;
		margin-bottom: 10rpx;
	}

	.msg-body {
		font-size: 28rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: block;
		line-height: 1.5;
	}

	.msg-tags {
		font-size: 24rpx;
		color: #1B8A4A;
		margin-top: 10rpx;
		display: block;
	}

	.explain-row {
		display: flex;
		flex-direction: row;
		padding: 16rpx 0;
		border-bottom: 1rpx solid #F0F0F0;
	}

	.explain-key {
		width: 100rpx;
		font-size: 26rpx;
		font-weight: 600;
		color: #1296DB;
	}

	.explain-val {
		flex: 1;
		font-size: 26rpx;
		color: #4A4A4A;
	}

	.home-compare {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.home-col {
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 28rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.stable-col {
		border-top: 6rpx solid #22A35A;
	}

	.alert-col {
		border-top: 6rpx solid #E07A2F;
	}

	.home-state {
		font-size: 22rpx;
		font-weight: 600;
		color: #888888;
		display: block;
		margin-bottom: 12rpx;
	}

	.home-main {
		font-size: 30rpx;
		font-weight: 700;
		color: #1B8A4A;
		display: block;
		margin-bottom: 16rpx;
	}

	.home-main.warn {
		color: #C2410C;
	}

	.home-line {
		font-size: 26rpx;
		color: #4A4A4A;
		display: block;
		margin-bottom: 8rpx;
	}

	.home-insight {
		font-size: 24rpx;
		color: #1296DB;
		margin-top: 12rpx;
		display: block;
		line-height: 1.5;
	}

	.btn-row {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin-top: 20rpx;
		gap: 12rpx;
	}

	.mini-btn {
		font-size: 22rpx;
		padding: 12rpx 20rpx;
		border-radius: 32rpx;
		background: #F0F4F8;
		color: #333333;
	}

	.mini-btn.primary {
		background: #1296DB;
		color: #FFFFFF;
	}

	.plan-row {
		display: flex;
		flex-direction: row;
		gap: 16rpx;
		margin-top: 8rpx;
	}

	.plan {
		flex: 1;
		border-radius: 14rpx;
		padding: 20rpx 16rpx;
	}

	.plan.free {
		background: #F5F7FA;
	}

	.plan.plus {
		background: #EBF5FC;
		border: 2rpx solid #1296DB;
	}

	.plan-name {
		font-size: 24rpx;
		font-weight: 700;
		color: #0B3A5C;
		display: block;
		margin-bottom: 16rpx;
	}

	.plan-item {
		font-size: 22rpx;
		color: #4A4A4A;
		display: block;
		margin-bottom: 10rpx;
		line-height: 1.4;
	}

	.price-tip {
		margin-top: 20rpx;
		padding: 20rpx;
		background: #FFF8E8;
		border-radius: 12rpx;
		display: flex;
		flex-direction: column;
	}

	.price-tip text {
		font-size: 24rpx;
		color: #8A5A00;
		line-height: 1.6;
	}

	.dos {
		margin-top: 8rpx;
		padding: 20rpx;
		background: #EEF9F2;
		border-radius: 12rpx;
	}

	.donts {
		margin-top: 16rpx;
		padding: 20rpx;
		background: #FEF2F2;
		border-radius: 12rpx;
	}

	.do-title {
		font-size: 26rpx;
		font-weight: 700;
		color: #1A1A1A;
		display: block;
		margin-bottom: 12rpx;
	}

	.do-item {
		font-size: 24rpx;
		color: #4A4A4A;
		display: block;
		margin-bottom: 10rpx;
		line-height: 1.5;
	}

	.roadmap {
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 28rpx 28rpx 12rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.road-item {
		display: flex;
		flex-direction: row;
		padding-bottom: 28rpx;
		position: relative;
	}

	.road-dot {
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		background: #1296DB;
		margin-top: 8rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
		box-shadow: 0 0 0 6rpx rgba(18, 150, 219, 0.2);
	}

	.road-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.road-phase {
		font-size: 22rpx;
		color: #1296DB;
		font-weight: 600;
		margin-bottom: 4rpx;
	}

	.road-feat {
		font-size: 28rpx;
		color: #1A1A1A;
		font-weight: 500;
	}

	.marketing {
		background: linear-gradient(160deg, #0B3A5C 0%, #1296DB 100%);
		border-radius: 20rpx;
		padding: 48rpx 36rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.mkt-title {
		font-size: 40rpx;
		font-weight: 700;
		color: #FFFFFF;
		margin-bottom: 16rpx;
	}

	.mkt-line {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 24rpx;
	}

	.mkt-cta {
		font-size: 30rpx;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 1.5;
	}
</style>