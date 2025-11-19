class ChainContext2d {
	constructor(canvas) {
		this.ctx = canvas.getContext("2d");
	}

	lineWidth(val) {
		this.ctx.lineWidth = val;
		return this;
	}
	strokeStyle(val) {
		this.ctx.strokeStyle = val;
		return this;
	}
	font(val) {
		this.ctx.font = val;
		return this;
	}
	textAlign(val) {
		this.ctx.textAlign = val;
		return this;
	}

	beginPath() {
		this.ctx.beginPath();
		return this;
	}
	closePath() {
		this.ctx.closePath();
		return this;
	}
	moveTo(x, y) {
		this.ctx.moveTo(x, y);
		return this;
	}
	lineTo(x, y) {
		this.ctx.lineTo(x, y);
		return this;
	}
	fillText(text, x, y, maxWidth) {
		this.ctx.strokeText(text, x, y, maxWidth);
		return this;
	}
	stroke() {
		this.ctx.stroke();
		return this;
	}
}

/**
 * 实例化参数：
 *      query: canvas DOM对象
 *      bigGridX: 横向25x25的格子数
 *      bigGridY: 纵向25x25的格子数
 *      direction：心电图方向 x为横向 y为竖向
 */
export default class EGC {
	static SMALL_INTERVAL = 10;

	constructor(query, bigGridX, bigGridY, dpx, direction, index) {
		if (EGC.SMALL_INTERVAL % 5 !== 0) {
			console.warn("最小格子的宽高不能被5整除，将会出现误差");
		}
		// #ifdef MP
		query.exec(res => {
			this.canvas = res[0].node;
			this.ctx = new ChainContext2d(this.canvas);
			this.bigGridX = bigGridX;
			this.bigGridY = bigGridY;
			this.direction = direction;
			this.canvas.width = bigGridX * EGC.SMALL_INTERVAL * 25;
			this.canvas.height = bigGridY * EGC.SMALL_INTERVAL * 25;
			this.grid(index);
		})
		// #endif
		// #ifdef H5
		query.firstChild.width = bigGridX * EGC.SMALL_INTERVAL * 25;
		query.firstChild.height = bigGridY * EGC.SMALL_INTERVAL * 25;

		this.canvas = query.firstChild;
		this.ctx = new ChainContext2d(query.firstChild);
		this.bigGridX = bigGridX;
		this.bigGridY = bigGridY;
		this.direction = direction;
		setTimeout(() => {
			this.grid(index, 2);
		}, 500)
		// #endif
	}

	static isArray(val) {
		return Object.prototype.toString.call(val) === '[object Array]';
	}

	//绘制格子
	grid(index, dpx) {
		const d = dpx ? dpx : 1;
		/* 1 x 1 区域分割线 start */
		for (let i = 0; i <= 25 * this.bigGridX; i++) {
			this.ctx.beginPath()
				.strokeStyle("#FAD2F0")
				.lineWidth(1 / d)
				.moveTo(i * EGC.SMALL_INTERVAL / d, 0)
				.lineTo(i * EGC.SMALL_INTERVAL / d, this.canvas.height)
				.stroke()
				.closePath();
		}
		for (let i = 0; i <= 25 * this.bigGridY; i++) {
			this.ctx.beginPath()
				.strokeStyle("#FAD2F0")
				.lineWidth(1 / d)
				.moveTo(0, i * EGC.SMALL_INTERVAL / d)
				.lineTo(this.canvas.width, i * EGC.SMALL_INTERVAL / d)
				.stroke()
				.closePath();
		}
		/* 1 x 1 区域分割线 end */

		/* 5 x 5 区域分割线 start */
		for (let i = 0, len = 25 * this.bigGridX; i <= len; i += 5) {
			this.ctx.beginPath()
				.strokeStyle("#FFC0CB")
				.lineWidth(2 / d)
				.moveTo(i * EGC.SMALL_INTERVAL / d, 0)
				.lineTo(i * EGC.SMALL_INTERVAL / d, this.canvas.height)
				.stroke()
				.closePath();
		}
		for (let i = 0, len = 25 * this.bigGridY; i <= len; i += 5) {
			this.ctx.beginPath()
				.strokeStyle("#FFC0CB")
				.lineWidth(1 / d)
				.moveTo(0, i * EGC.SMALL_INTERVAL / d)
				.lineTo(this.canvas.width, i * EGC.SMALL_INTERVAL / d)
				.stroke()
				.closePath()
		}
		/* 5 x 5 区域分割线 end */

		/* 25 x 25 区域分割线 start */
		for (let i = 0, len = 25 * this.bigGridX; i <= len; i += 25) {
			this.ctx.beginPath()
				.strokeStyle("#FF7A7A")
				.lineWidth(3 / d)
				.moveTo(i * EGC.SMALL_INTERVAL / d, 0)
				.lineTo(i * EGC.SMALL_INTERVAL / d, this.canvas.height)
				.stroke()
				.closePath();
		}
		for (let i = 0, len = 25 * this.bigGridY; i <= len; i += 25) {
			this.ctx.beginPath()
				.strokeStyle("#FF7A7A")
				.lineWidth(3 / d)
				.moveTo(0, i * EGC.SMALL_INTERVAL / d)
				.lineTo(this.canvas.width, i * EGC.SMALL_INTERVAL / d)
				.stroke()
				.closePath()
		}
		/* 25 x 25 区域分割线 end */

		/* 125 x 125 纵向分割线 start */
		if (this.direction == 'y') {
			for (let i = 0, len = 25 * this.bigGridY; i <= len; i += 125) {
				this.ctx.beginPath()
					.strokeStyle("#FF7A7A")
					.lineWidth(5 / d)
					.moveTo(0, i * EGC.SMALL_INTERVAL / d)
					.lineTo(this.canvas.height, i * EGC.SMALL_INTERVAL / d)
					.stroke()
					.closePath();
			}
		} else {
			for (let i = 0, len = 25 * this.bigGridX; i <= len; i += 125) {
				this.ctx.beginPath()
					.strokeStyle("#FF7A7A")
					.lineWidth(5 / d)
					.moveTo(i * EGC.SMALL_INTERVAL / d, 0)
					.lineTo(i * EGC.SMALL_INTERVAL / d, this.canvas.height)
					.stroke()
					.closePath();
			}
		}
		/* 125 x 125 纵向分割线 end */
		
		/* 绘制标注 start */
		if (index === 0) {
			this.ctx.beginPath()
				.lineWidth(2 / d) // 线宽
				.strokeStyle("#000000") // 颜色取值
				.moveTo(0 * 10 / d, 5 * 10 / d)
				.lineTo(1 * 10 / d, 5 * 10 / d) // 先向右画1单位的横线
				.lineTo(1 * 10 / d, 2 * 10 / d) // 再向上画8单位的竖线
				.lineTo(4 * 10 / d, 2 * 10 / d) // 再向右画3单位的横线
				.lineTo(4 * 10 / d, 5 * 10 / d) // 再向下画8单位的竖线
				.lineTo(5 * 10 / d, 5 * 10 / d) // 再向右画1单位的横线
				.stroke()
				.closePath();
		}
		/* 绘制标注 end */
	}

	//绘制心电图

	curveChart(data, dpx) {
		const d = dpx ? 2 : 1;
		if (!EGC.isArray(data)) {
			console.error("数据类型必须为Array类型");
			return;
		}

		data = EGC.isArray(data[0]) ? data : [data];
		let len = data.length;

		if (this.direction == "y") { // 竖向心电
			if (len > this.bigGridX) {
				console.warn("心电组数超出轨道数，超出部分已被裁掉。");
				len = this.bigGridX;
			}
			if (data.some(item => item.length / 125 > this.bigGridY)) {
				console.warn("单组心电数据超出绘图区域，超出部分已被裁掉。");
			}
			let indicate = (this.bigGridX - len) % 2 === 0 ? 25 / 2 : 0;

			for (let k = 0; k < len; k++) {
				let startX = 0,
					startY = (25 * (this.bigGridX - len) / 2 + indicate + 25 * k) * EGC.SMALL_INTERVAL / d
				let temp = startY;
				for (let i = 0; i < data[k].length; i++) {
					this.ctx.beginPath()
						.strokeStyle("#000000")
						.lineWidth(1 / d)
						.moveTo(startY, startX)
						.lineTo(startY = temp - data[k][i] / d, startX = i * EGC.SMALL_INTERVAL / 5 / d)
						.stroke()
						.closePath()
				}
			}
		} else {
			if (len > this.bigGridY) {
				console.warn("心电组数超出轨道数，超出部分已被裁掉。");
				len = this.bigGridY;
			}
			if (data.some(item => item.length / 125 > this.bigGridX)) {
				console.warn("单组心电数据超出绘图区域，超出部分已被裁掉。");
			}
			let indicate = (this.bigGridY - len) % 2 === 0 ? 25 / 2 : 0;
			for (let k = 0; k < len; k++) {
				let startX = 0,
					startY = (25 * (this.bigGridY - len) / 2 + indicate + 25 * k) * EGC.SMALL_INTERVAL
				let temp = startY;
				for (let i = 0; i < data[k].length; i++) {
					this.ctx.beginPath()
						.strokeStyle("#000000")
						.lineWidth(1)
						.moveTo(startX, startY)
						.lineTo(startX = i * EGC.SMALL_INTERVAL / 5, startY = temp - data[k][i])
						.stroke()
						.closePath()
				}
			}
		}

		uni.hideLoading()
	}
}
