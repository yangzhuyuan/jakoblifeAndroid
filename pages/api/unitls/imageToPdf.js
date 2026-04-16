/**
 * imageToPdf.js - 5+ 环境终极兼容版
 */

import JsPDF from 'jspdf';

class ImageToPdfConverter {
	readLocalFile(filePath) {
		return new Promise((resolve, reject) => {
			const absolutePath = filePath.startsWith('file://') ? filePath : 'file://' + filePath;
			plus.io.resolveLocalFileSystemURL(absolutePath, (entry) => {
				entry.file((file) => {
					const reader = new plus.io.FileReader();
					reader.onloadend = (e) => resolve(e.target.result);
					reader.onerror = reject;
					reader.readAsDataURL(file);
				}, reject);
			}, reject);
		});
	}

	// ✅ 核心修复：ArrayBuffer → Base64 → 二进制写入
	arrayBufferToBase64(buffer) {
		const bytes = new Uint8Array(buffer);
		let binary = '';
		const len = bytes.byteLength;

		// 分块处理，避免栈溢出（一次处理 64KB）
		const chunkSize = 65536;
		for (let i = 0; i < len; i += chunkSize) {
			const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
			binary += String.fromCharCode.apply(null, chunk);
		}

		return btoa(binary);
	}

	savePdfFile(pdfData, fileName) {
		return new Promise((resolve, reject) => {
			const filePath = `_doc/${fileName}`;

			console.log('5.1 请求文件系统...');
			plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
				console.log('5.2 获取文件条目...');

				fs.root.getFile(filePath, {
					create: true
				}, (fileEntry) => {
					console.log('5.3 创建写入器...');

					fileEntry.createWriter((writer) => {
						console.log('5.4 写入器创建成功');

						writer.onwrite = () => {
							const fullPath = plus.io.convertLocalFileSystemURL(
								fileEntry.fullPath);
							console.log('5.6 PDF保存成功:', fullPath);
							resolve(fullPath);
						};

						writer.onerror = (e) => {
							console.error('5.6 写入失败:', JSON.stringify(e));
							reject(new Error('写入失败: ' + JSON.stringify(e)));
						};

						// ✅ 关键：转换为 Base64 后使用 writeAsBinary
						console.log('5.5 转换数据格式...');
						const base64Data = this.arrayBufferToBase64(pdfData);
						console.log('5.5 Base64长度:', base64Data.length);

						// 5+ 特有方法：将 base64 解码为二进制写入
						writer.writeAsBinary(base64Data);

					}, (e) => {
						console.error('创建Writer失败:', e);
						reject(new Error('创建Writer失败: ' + JSON.stringify(e)));
					});

				}, (e) => {
					console.error('获取文件失败:', e);
					reject(new Error('获取文件失败: ' + JSON.stringify(e)));
				});

			}, (e) => {
				console.error('请求文件系统失败:', e);
				reject(new Error('请求文件系统失败: ' + JSON.stringify(e)));
			});
		});
	}

	async convertAndSave(imagePath, pdfFileName) {
		try {
			console.log('1. 读取图片:', imagePath);
			const imageBase64 = await this.readLocalFile(imagePath);
			console.log('2. 图片读取完成, 长度:', imageBase64.length);

			console.log('3. 生成PDF...');
			const pdf = new JsPDF('p', 'pt', 'a4');
			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();
			console.log('PDF尺寸(pt):', pageWidth, 'x', pageHeight);

			// 白色背景
			pdf.setFillColor(255, 255, 255);
			pdf.rect(0, 0, pageWidth, pageHeight, 'F');

			// 自适应图片尺寸
			const imgProps = pdf.getImageProperties(imageBase64);
			const imgRatio = imgProps.width / imgProps.height;
			const pageRatio = pageWidth / pageHeight;

			let imgWidth, imgHeight, x, y;
			if (imgRatio > pageRatio) {
				imgWidth = pageWidth;
				imgHeight = pageWidth / imgRatio;
				x = 0;
				y = (pageHeight - imgHeight) / 2;
			} else {
				imgHeight = pageHeight;
				imgWidth = pageHeight * imgRatio;
				x = (pageWidth - imgWidth) / 2;
				y = 0;
			}

			const format = imageBase64.includes('image/png') ? 'PNG' : 'JPEG';
			pdf.addImage(imageBase64, format, x, y, imgWidth, imgHeight);

			const pdfData = pdf.output('arraybuffer');
			console.log('4. PDF生成完成, 长度:', pdfData.byteLength);

			// 验证头部
			const header = new Uint8Array(pdfData.slice(0, 5));
			const headerStr = String.fromCharCode(...header);
			console.log('PDF头部:', headerStr);

			if (headerStr !== '%PDF-') {
				throw new Error('PDF头部无效: ' + headerStr);
			}

			console.log('5. 开始保存...');
			return await this.savePdfFile(pdfData, pdfFileName);

		} catch (error) {
			console.error('转换失败:', error);
			throw error;
		}
	}
}

const converter = new ImageToPdfConverter();
export async function imageToPdfAndSave(imagePath, fileName = `report_${Date.now()}.pdf`) {
	return converter.convertAndSave(imagePath, fileName);
}
export default ImageToPdfConverter;