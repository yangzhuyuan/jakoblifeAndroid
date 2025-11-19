import {
	byte2IntLR,
	getDateBean
} from '../unitls/bleUtils.js';
import {
	SleepCwmBean,
	SleepPartData
} from '../unitls/sleep.js';

export function receive5610SleepData(data) {
	let offset = 0;

	const devDate = getDateBean([data[offset++], data[offset++]]);
	const bean = new SleepCwmBean();
	bean.date = devDate.formatDate;

	const zkLength = data[offset++];
	const zkShortLength = data[offset++];

	const partList = [];
	let totalSleep = 0,
		totalDeep = 0,
		totalLight = 0,
		totalRem = 0,
		totalWake = 0;

	/* 正式睡眠段 5 字节/段 */
	for (let i = 0; i < zkLength; i++) {
		const p = new SleepPartData();
		p.startTime = byte2IntLR(data[offset++], data[offset++]);
		p.endTime = byte2IntLR(data[offset++], data[offset++]);
		p.type = data[offset++];
		p.time = p.endTime >= p.startTime ? p.endTime - p.startTime : 1440 + p.endTime - p.startTime;

		if (p.type !== 10000 && p.type !== 4 && p.type > 0) {
			partList.push(p);
			switch (p.type) {
				case 1:
					totalLight += p.time;
					break;
				case 2:
					totalDeep += p.time;
					break;
				case 3:
					totalRem += p.time;
					break;
				case 5:
					totalWake += p.time;
					break;
			}
		}
	}
	totalSleep = totalLight + totalDeep + totalRem;

	/* 小睡段 4 字节/段 */
	for (let j = 0; j < zkShortLength; j++) {
		const p = new SleepPartData();
		p.startTime = byte2IntLR(data[offset++], data[offset++]);
		p.endTime = byte2IntLR(data[offset++], data[offset++]);
		p.time = p.endTime >= p.startTime ? p.endTime - p.startTime : 1440 + p.endTime - p.startTime;
		p.type = 10000;
		partList.push(p);
	}

	bean.partList = partList;
	bean.totalSleep = totalSleep;
	bean.totalDeep = totalDeep;
	bean.totalLight = totalLight;
	bean.totalRem = totalRem;
	bean.totalWake = totalWake;

	return bean;
}