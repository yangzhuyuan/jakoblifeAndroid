import Vue from 'vue';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';

const PDF = {};
PDF.install = function(Vue, options) {
	Vue.prototype.$createPdf = function(targetDom, name, callback) {
		const A4_WIDTH = 592.28; // A4纸的宽度
		const A4_HEIGHT = 841.89; // A4纸的高度
		const MARGIN = 20; // 页面边距
		const A4_WIDTH_WITH_MARGIN = A4_WIDTH - MARGIN * 2;
		const A4_HEIGHT_WITH_MARGIN = A4_HEIGHT - MARGIN * 2;

		uni.showLoading({
			title: '导出中'
		});

		// 克隆 DOM 元素
		let cloneDom = targetDom.cloneNode(true);
		cloneDom.style.width = targetDom.scrollWidth + 'px';
		cloneDom.style.background = '#FFFFFF';
		document.body.appendChild(cloneDom);

		// 调整页面高度
		let pages = cloneDom.childNodes;
		pages.forEach(page => {
			if (page.offsetHeight > A4_HEIGHT) {
				const num = Math.ceil(page.offsetHeight / A4_HEIGHT);
				page.style.height = A4_HEIGHT * num + 'px';
			} else {
				page.style.height = A4_HEIGHT + 'px';
			}
			page.style.marginBottom = '0px';
		});

		html2canvas(cloneDom, {
			scale: 4, // 提升画面质量
			useCORS: true, // 允许跨域图片
			imageTimeout: 5000, // 图片加载延迟
			height: cloneDom.scrollHeight,
			width: cloneDom.scrollWidth,
			windowWidth: document.body.scrollWidth,
			windowHeight: document.body.scrollHeight,
			dpi: 172, // 提高分辨率
			logging: false,
			allowTaint: false,
		}).then(canvas => {
			document.body.removeChild(cloneDom); // 移除克隆的 DOM 元素

			const pdf = new JsPDF('p', 'pt', 'a4');
			const pageHeight = Math.floor(canvas.width / A4_WIDTH_WITH_MARGIN * A4_HEIGHT_WITH_MARGIN);
			let leftHeight = canvas.height;
			let position = 0;

			function createPage() {
				if (leftHeight <= 0) {
					pdf.save(name + '.pdf');
					uni.hideLoading();
					return;
				}

				const height = Math.min(leftHeight, pageHeight);
				const pageCanvas = document.createElement('canvas');
				pageCanvas.width = canvas.width;
				pageCanvas.height = height;

				const ctx = pageCanvas.getContext('2d', {
					willReadFrequently: true
				});
				ctx.drawImage(canvas, 0, position, canvas.width, height, 0, 0, canvas.width, height);

				pdf.addImage(pageCanvas.toDataURL('image/jpeg', 1.0), 'JPEG', MARGIN, MARGIN,
					A4_WIDTH_WITH_MARGIN, A4_WIDTH_WITH_MARGIN / canvas.width * height);

				leftHeight -= height;
				position += height;

				if (leftHeight > 0) {
					pdf.addPage();
					setTimeout(createPage, 500);
				} else {
					pdf.save(name + '.pdf');
					uni.hideLoading();
				}
			}

			createPage();
		}).catch(err => {
			console.error('生成 PDF 失败', err);
			uni.hideLoading();
			uni.showToast({
				title: '生成 PDF 失败',
				icon: 'none'
			});
		});
	};
};

Vue.use(PDF);
export default PDF;