// 创建 pdf.js
// 引入依赖
import Vue from 'vue'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

const PDF = {}
PDF.install = function(Vue, options) {
	/**
	 * targetDom: 需要打印的dom对象
	 * name:pdf的名字
	 * callback: 回调函数
	 */
	Vue.prototype.$createPdf = function(targetDom, name, callback) {
		console.log(window.devicePixelRatio * 4)
		// a4纸的尺寸[592.28,841.89]
		uni.showLoading({
			title: '导出中'
		})
		const A4_WIDTH = 592.28
		const A4_HEIGHT = 841.89
		// 每页pdf 相对于A4纸张的页面所对应的高度
		let pageHeight = targetDom.scrollWidth / A4_WIDTH * A4_HEIGHT
		//将dom对象复制一份出来，我们要对dom对象的大小进行调整，不能影响原页面dom对象的样式
		let cloneDom = targetDom.cloneNode(true)
		cloneDom.style.width = targetDom.scrollWidth + 'px'
		cloneDom.style.background = '#FFFFFF'
		// cloneDom.style.display = 'none'
		document.body.appendChild(cloneDom)
		//这里划重点，将页面中的预计生成一页的div设置一个单独的class，然后根据class获取到所有的节点，即可大致知道将要生成多少页的PDF
		let pages = cloneDom.childNodes
		//遍历一次这些节点
		for (let i = 0; i < pages.length; i++) {
			//判断每个页面的节点对象，高度是否大于或小于实际的PDF的高度，如果大于PDF每页的高度，那这个节点最少也要生成2页的PDF，切不能影响下面的节点的，用节点对象的高度/PDF每页的高度，向上取整获取到倍数，然后设置该节点的高度为：PDF每页的高度*倍数，如果节点高度小于PDF每页的高度，直接将该节点高度设置成PDF每页的高度即可
			if (pages[i].offsetHeight > pageHeight) {
				let num = Math.ceil(pages[i].offsetHeight / pageHeight)
				pages[i].style.height = pageHeight * num + 'px'
			} else {
				pages[i].style.height = pageHeight + 'px'
			}
			//页面中每页的div之间有间隔，将这个间隔去掉
			pages[i].style.marginBottom = 0 + 'px'
		}
		html2canvas(cloneDom, {
			scale: 4, // 提升画面质量，但是会增加文件大小
			useCORS: true, // 允许跨域图片 当图片是链接地址时，需加该属性，否组无法显示图片
			imageTimeout: 0, // 图片加载延迟，默认延迟为0，单位毫秒
			height: cloneDom
			.scrollHeight, // canvas的高度设定，这里的宽高要用复制出来的dom对象的宽高，不能用原dom对象，因为我们已经将dom的高度整体拉高了
			width: cloneDom.scrollWidth, // canvas的宽度设定
			windowWidth: document.body.scrollWidth,
			windowHeight: document.body.scrollHeight,
			dpi: 172, // 将分辨率提高到特定的DPI
			logging: false,
			allowTaint: false,
		}).then(canvas => {
			document.body.removeChild(cloneDom) // 移除节点否者会多出一份
			const _this = this;
			//未生成pdf的html页面高度
			var leftHeight = canvas.height;
			var a4Width = 555.28 // 原A4宽 592 因为要设置边距 20 ,这里要减掉 40
			var a4Height = 801.89 // 原A4高   841 因为要设置边距 20 ,这里要减掉 40
			//一页pdf显示html页面生成的canvas高度;
			var a4HeightRef = Math.floor(canvas.width / a4Width * a4Height);

			//pdf页面偏移
			var position = 0;

			var pageData = canvas.toDataURL('image/jpeg', 1.0);

			var pdf = new JsPDF('x', 'pt', 'a4');
			var index = 1,
				canvas1 = document.createElement('canvas'),
				height;
			pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen');

			function createImpl(canvas) {
				if (leftHeight > 0) {
					index++;
					var checkCount = 0;
					if (leftHeight > a4HeightRef) {
						var i = position + a4HeightRef;
						for (i = position + a4HeightRef; i >= position; i--) {
							var isWrite = true
							for (var j = 0; j < canvas.width; j++) {
								var c = canvas.getContext('2d').getImageData(j, i, 1, 1).data

								if (c[0] != 0xff || c[1] != 0xff || c[2] != 0xff) {
									isWrite = false
									break
								}
							}
							if (isWrite) {
								checkCount++
								if (checkCount >= 10) {
									break
								}
							} else {
								checkCount = 0
							}
						}
						height = Math.round(i - position) || Math.min(leftHeight, a4HeightRef);
						if (height <= 0) {
							height = a4HeightRef;
						}
					} else {
						height = leftHeight;
					}

					canvas1.width = canvas.width;
					canvas1.height = height;

					// console.log(index, 'height:', height, 'pos', position);

					var ctx = canvas1.getContext('2d');
					ctx.drawImage(canvas, 0, position, canvas.width, height, 0, 0, canvas.width,
					height); // 边距这里设置0，不然又黑边

					var pageHeight = Math.round(a4Width / canvas.width * height);
					// pdf.setPageSize(null, pageHeight)
					if (position != 0) {
						pdf.addPage();
					}
					// 设置 20px 边距
					pdf.addImage(canvas1.toDataURL('image/jpeg', 1.0), 'JPEG', 20, 20, a4Width,
						a4Width / canvas1.width * height);
					leftHeight -= height;
					position += height;
					// $('.pdfProgress').text(index + 1);
					// $('.pdfTotal').text(index + Math.ceil(leftHeight / a4HeightRef));
					if (leftHeight > 0) {
						//添加全屏水印
						const base64 =
							'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAArCAYAAADIWo5HAAACLUlEQVR42u2Zy2sCMRDGV9tbtVJKrQ/0JBWLvbgsaOttQQqreO5R6GHP/v+HZiEDQ9i8k33YDHyXbcxufpN8maRRFCJEiBAhQoTgRIfoh+hKNBe0G9I2GVG3om9bEl2I9rcIoE/77Cq8Myd6sn2ZSBgAr80YARhI+gOwCdGW6EB/d6R9XDUGFrsAf2Fe7Fswk1JBmzMd1DNKgI2EywQyUKYjkxFeOwwxkwgAvBJNqEa0DzaTHcn3qWrXdA/ocQD8m11ABUDfQF0fpujjI2QAeoZetdYdfOzB9HgGNEF6owM8Ec3Q8wEDgP07T6ktgNyB8YgAqGZ0b+gRsS2AtQP/iAUAHlAdsEW7TY6eFVrVNQN8A2AjlZho5R5wYjJhoqMiADy4DFWLPJMcKBhv3AYThFi4yJyrAAAfDrY/1SVQVhLDOWDowIwzSQ1TqwfA1P5CU3yJlsPY8fmjcTMgptmeIwB3aFbsLCvM2BRAFR4AZXYxuEdmn38hmjoosY0B5IonxLNhIYTNby0odMoAJJL1/k10bwpgQztZKaxb2YXFRnAUhexDHzoAUsGxu3j+awNA5+RmcxW1UCx1eQB4SyI1AaBrbiMEYGrwexgYBlgrgGtU/ZUY3AlGhgByTvV5MQGgW1SomqBOUWLiATy1wgNsABQz51PzWHxTALzWAW0F0EM+MKPmnLj6x0lbAPDuC5zfNPsCcChZ25DZd4VBJCW7wrRp1+whQoQIESJEg+IPRa38G55TPkQAAAAASUVORK5CYII='
						for (let i = 0; i < 6; i++) {
							for (let j = 0; j < 5; j++) {
								const left = (j * 120) + 20;
								// pdf.addImage(base64,'JPEG', left, i*150, 20, 30); // 关掉水印
							}
						}
						setTimeout(createImpl, 500, canvas);
					} else {
						pdf.save('下载pdf文件名' + '.pdf');
						uni.hideLoading()
					}
				}
			}

			//当内容未超过pdf一页显示的范围，无需分页
			if (leftHeight < a4HeightRef) {
				pdf.addImage(pageData, 'JPEG', 20, 20, a4Width, a4Width / canvas.width * leftHeight);
				pdf.save('下载pdf文件名' + '.pdf')
				uni.hideLoading()
			} else {
				try {
					pdf.deletePage(0);
					setTimeout(createImpl, 500, canvas);

				} catch (err) {
					console.log(err);
				}
			}
		})
	}
}
Vue.use(PDF)
export default PDF