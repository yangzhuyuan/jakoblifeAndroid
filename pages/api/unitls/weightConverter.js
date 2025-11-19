// 在 utils/weightConverter.js 中
class WeightConverter {
	/**
	 * 将英石和磅转换为千克
	 * @param {number} stone - 英石
	 * @param {number} pounds - 磅
	 * @returns {number} 千克
	 */


	static KG_TO_LB = 2.20462262185;
	static LB_TO_KG = 0.45359237;

	static INCH_TO_CM = 2.54;
	static CM_TO_INCH = 0.393700787;


	static stoneToKg(stone, pounds = 0) {
		// 1英石 = 14磅，1磅 ≈ 0.45359237千克
		const totalPounds = (stone * 14) + pounds;
		return totalPounds * 0.45359237;
	}

	/**
	 * 解析 "7:9.1" 格式的字符串并转换为千克
	 * @param {string} weightStr - 重量字符串 "stone:pounds"
	 * @returns {number} 千克
	 */
	static parseStoneString(weightStr) {
		if (!weightStr || !weightStr.includes(':')) {
			console.error('Invalid weight format');
			return 0;
		}

		const parts = weightStr.split(':');
		const stone = parseFloat(parts[0]) || 0;
		const pounds = parseFloat(parts[1]) || 0;

		return this.stoneToKg(stone, pounds);
	}

	/**
	 * 将千克转换为英石和磅
	 * @param {number} kg - 千克
	 * @returns {Object} {stone, pounds}
	 */
	static kgToStone(kg) {
		const totalPounds = kg / 0.45359237;
		const stone = Math.floor(totalPounds / 14);
		const pounds = totalPounds % 14;

		return {
			stone: stone,
			pounds: parseFloat(pounds.toFixed(1))
		};
	}

	// kg 转 lb
	static kgToLb(kg, decimalPlaces = 2) {
		if (kg === null || kg === undefined || isNaN(kg)) {
			return null;
		}
		const result = kg * this.KG_TO_LB;
		return Number(result.toFixed(decimalPlaces));
	}

	// lb 转 kg
	static lbToKg(lb, decimalPlaces = 2) {
		if (lb === null || lb === undefined || isNaN(lb)) {
			return null;
		}
		const result = lb * this.LB_TO_KG;
		return Number(result.toFixed(decimalPlaces));
	}

	// 自动识别并转换（根据单位参数）
	static convert(value, fromUnit, toUnit, decimalPlaces = 2) {
		if (fromUnit === toUnit) return value;

		if (fromUnit === 'kg' && toUnit === 'lb') {
			return this.kgToLb(value, decimalPlaces);
		} else if (fromUnit === 'lb' && toUnit === 'kg') {
			return this.lbToKg(value, decimalPlaces);
		}

		throw new Error('不支持的转换类型');
	}


	// inch 转 cm
	static inchToCm(inch, decimalPlaces = 2) {
		if (inch === null || inch === undefined || isNaN(inch)) {
			return null;
		}
		const result = inch * this.INCH_TO_CM;
		return Number(result.toFixed(1));
	}

	// cm 转 inch
	static cmToInch(cm, decimalPlaces = 2) {
		if (cm === null || cm === undefined || isNaN(cm)) {
			return null;
		}
		const result = cm * this.CM_TO_INCH;
		return Number(result.toFixed(1));
	}

	// 自动识别并转换
	static convert1(value, fromUnit, toUnit, decimalPlaces = 2) {
		if (fromUnit === toUnit) return value;

		if (fromUnit === 'inch' && toUnit === 'cm') {
			return this.inchToCm(value, decimalPlaces);
		} else if (fromUnit === 'cm' && toUnit === 'inch') {
			return this.cmToInch(value, decimalPlaces);
		}

		throw new Error('不支持的转换类型');
	}

}

export default WeightConverter;