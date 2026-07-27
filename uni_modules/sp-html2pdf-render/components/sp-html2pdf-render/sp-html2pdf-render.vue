<template>
	<!-- prop是自定义的数据字段名，要与chang后的保持一致，h2pRender是renderjs的module名称 -->
	<view class="sp-html2pdf-render" :prop="domId" :change:prop="h2pRender.watchDomId">
		<!-- 导出的PDF会撑满宽度，所以请事先规范好要渲染盒子的宽度，PDF以一般A4纸大小尺寸，会自动分页 -->
		<!-- 默认带有插槽，但是具体是否要将渲染的dom盒子放入插槽中由开发者自行决定，导出结果只与domId有关 -->
		<slot></slot>
		<text :prop="expOver" :change:prop="h2pRender.watchExpOver"></text>
	</view>
</template>

<script>
	import {
		base64ToPath
	} from '../../utils/index.js'
	export default {
		props: {
			// 要渲染dom的id
			domId: {
				type: String,
				default: '',
				require: true
			},
			// 是否显示导出loading
			showLoading: {
				type: Boolean,
				default: true
			},
			// 导出的pdf文件名，默认使用当前时间戳，已自动拼接后缀
			pdfFileName: {
				type: String,
				default: ''
			},
			// 是否自动打开文档
			autoOpen: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				expOver: 0,
				// #ifdef VUE2
				// #ifdef APP
				// 只有在Vue2的APP真机中需要先声明h2pRender，否则会报错，若未报错建议删除此处代码
				h2pRender: null
				// #endif
				// #endif
			}
		},
		methods: {
			renderOver(e) {
				// canvas渲染图片完成
				this.$emit('renderOver', e)
			},
			renderFail(err) {
				uni.hideLoading()
				uni.removeStorageSync('pdfreport')
				console.error('sp-html2pdf-render fail:', err)
				uni.showToast({
					title: this.$t ? this.$t('生成失败') : '生成失败',
					icon: 'none'
				})
				this.$emit('renderFail', err)
			},
			savePDF(e) {
				// pdf生成完成（base64）
				this.$emit('beforeSavePDF', e)
				this.openPDF(e)
			},
			/** App 端 renderjs 已落盘时，只传路径 */
			openSavedPDF(path) {
				this.$emit('beforeSavePDF', path)
				const openByUni = () => {
					uni.openDocument({
						filePath: path,
						showMenu: true,
						success: () => {
							uni.hideLoading()
							this.$emit('successSavePDF', path)
						},
						fail: (err) => {
							console.error('openDocument error', err)
							// App 兜底用 runtime.openFile
							// #ifdef APP-PLUS
							try {
								plus.runtime.openFile(path, {}, () => {
									uni.hideLoading()
									this.$emit('successSavePDF', path)
								}, (e) => {
									console.error('openFile error', e)
									uni.hideLoading()
									uni.showToast({
										title: '打开失败',
										icon: 'none'
									})
								})
								return
							} catch (e) {}
							// #endif
							uni.hideLoading()
							uni.showToast({
								title: '打开失败',
								icon: 'none'
							})
						}
					})
				}
				openByUni()
			},
			/**
			 * 手动打开pdf文档
			 * @param {Object} e pdf的base64字符串
			 */
			openPDF(e) {
				/**
				 * base64ToPath
				 * @param {Object} e base64字符串
				 * @param {String} name 导出的文件名（未命名则以当前时间戳命名，已自动拼接后缀）
				 */
				base64ToPath(e, this.pdfFileName)
					.then((path) => {
						uni.openDocument({
							filePath: path,
							success: () => {
								this.$emit('successSavePDF', path)
							},
							fail: (err) => {
								console.error('openDocument error', err)
								uni.hideLoading()
							}
						})
					})
					.catch((error) => {
						console.error('base64ToPath error', error)
						uni.hideLoading()
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						})
					})
			},
			// 渲染事件
			async h2pRenderDom() {
				uni.showLoading({
					title: this.$t("生成中"),
					mask: true
				})

				// #ifdef H5
				await this.renderDom()
				// #endif
				// #ifndef H5
				// 控制expOver变量改变以触发RenderJs中渲染方法。
				this.expOver++
				// 处理你自己的逻辑.....
				// #endif

				// uni.hideLoading()
			}
		}
	}
</script>

<!-- renderjs目前仅支持内联使用 -->
<script module="h2pRender" lang="renderjs">
	import html2canvas from 'html2canvas';
	import JsPDF from 'jspdf'

	export default {
		data() {
			return {
				domIdValue: ''
			}
		},
		methods: {
			/**
			 * App 本地 file:// 图片会污染 canvas，导致 toDataURL 抛 SecurityError。
			 * 导出前将 DOM 内非 base64 图片转成 dataURL。
			 */
			imgToDataUrl(img) {
				return new Promise((resolve) => {
					const src = img.currentSrc || img.src || img.getAttribute('src') || ''
					if (!src || src.indexOf('data:') === 0) {
						resolve()
						return
					}
					const applySrc = (dataUrl) => {
						if (!dataUrl) {
							resolve()
							return
						}
						const onDone = () => resolve()
						img.onload = onDone
						img.onerror = onDone
						img.setAttribute('src', dataUrl)
						img.src = dataUrl
						if (img.complete) onDone()
					}
					const readByPlus = (path) => {
						if (typeof plus !== 'object' || !plus.io) {
							resolve()
							return
						}
						plus.io.resolveLocalFileSystemURL(path, (entry) => {
							entry.file((file) => {
								const reader = new plus.io.FileReader()
								reader.onloadend = (e) => applySrc(e.target && e.target.result)
								reader.onerror = () => resolve()
								reader.readAsDataURL(file)
							}, () => resolve())
						}, () => resolve())
					}
					if (typeof plus === 'object' && plus.io && (src.indexOf('file://') === 0 || src.indexOf('_www') === 0)) {
						readByPlus(src)
						return
					}
					// H5 / 相对路径：XHR 读 blob 再转 base64，避免 canvas 污染
					try {
						const xhr = new XMLHttpRequest()
						xhr.open('GET', src, true)
						xhr.responseType = 'blob'
						xhr.onload = function() {
							if (this.status === 200 || this.status === 0) {
								const reader = new FileReader()
								reader.onloadend = () => applySrc(reader.result)
								reader.onerror = () => resolve()
								reader.readAsDataURL(this.response)
							} else if (typeof plus === 'object') {
								readByPlus(src)
							} else {
								resolve()
							}
						}
						xhr.onerror = () => {
							if (typeof plus === 'object') {
								readByPlus(src)
							} else {
								resolve()
							}
						}
						xhr.send()
					} catch (e) {
						if (typeof plus === 'object') {
							readByPlus(src)
						} else {
							resolve()
						}
					}
				})
			},
			async ensureImagesBase64(rootEl) {
				const imgs = rootEl.querySelectorAll('img')
				await Promise.all(Array.from(imgs).map((img) => this.imgToDataUrl(img)))
			},
			collectChartCanvases(rootEl) {
				const map = new Map()
				const add = (c) => {
					if (!c || typeof c.getContext !== 'function') return
					if (!c.width || !c.height) return
					map.set(c, c)
				}
				rootEl.querySelectorAll('canvas').forEach(add)
				// uni-app App 上 qiun 常把真实绘图 canvas 挂在组件壳子的 children[0]
				rootEl.querySelectorAll('[canvas-id], [canvasId], uni-canvas').forEach((host) => {
					if (host.tagName && host.tagName.toLowerCase() === 'canvas') add(host)
					if (host.children && host.children[0]) add(host.children[0])
					host.querySelectorAll && host.querySelectorAll('canvas').forEach(add)
				})
				const chartHost = document.getElementById('dtyulanChart')
				if (chartHost) {
					add(chartHost)
					if (chartHost.children && chartHost.children[0]) add(chartHost.children[0])
					chartHost.querySelectorAll && chartHost.querySelectorAll('canvas').forEach(add)
				}
				return Array.from(map.values())
			},
			async ensureCanvasesAsImages(rootEl) {
				// qiun/uCharts 画在 canvas 上，html2canvas 克隆时常丢像素：先在原 DOM 换成 img，截完再还原
				const canvases = this.collectChartCanvases(rootEl)
				const restores = []
				for (const c of canvases) {
					try {
						if (!c.width || !c.height) continue
						const dataUrl = c.toDataURL('image/png')
						if (!dataUrl || dataUrl.length < 100) continue
						const img = document.createElement('img')
						img.src = dataUrl
						const cssText = c.getAttribute('style') || ''
						if (cssText) img.style.cssText = cssText
						const w = c.offsetWidth || parseInt(c.style.width, 10) || c.width
						const h = c.offsetHeight || parseInt(c.style.height, 10) || c.height
						img.style.width = `${w}px`
						img.style.height = `${h}px`
						img.style.display = 'block'
						img.style.maxWidth = '100%'
						const parent = c.parentNode
						if (!parent) continue
						parent.replaceChild(img, c)
						restores.push(() => {
							try {
								if (img.parentNode === parent) parent.replaceChild(c, img)
							} catch (e) {}
						})
					} catch (e) {
						console.log('==== canvas snapshot fail :', e)
					}
				}
				console.log('==== canvas replaced :', restores.length, '/', canvases.length)
				if (restores.length) {
					await new Promise((r) => setTimeout(r, 80))
				}
				return () => {
					restores.forEach((fn) => fn())
				}
			},
			/**
			 * 收集不应被分页切断的区域（相对 root 顶部，CSS 像素）
			 */
			collectCutGuides(rootEl) {
				const rootRect = rootEl.getBoundingClientRect()
				const guides = []
				const add = (node) => {
					if (!node || !node.getBoundingClientRect) return
					const r = node.getBoundingClientRect()
					const start = r.top - rootRect.top
					const end = r.bottom - rootRect.top
					if (end <= start) return
					guides.push({
						start,
						end
					})
				}
				rootEl.querySelectorAll('.pdf-keep-together, .charts-box, .listitemall, .pdf-table-head').forEach(add)
				return guides
			},
			/**
			 * 若预定裁切线落在禁止切断区域内，则上移到该区域顶部之前
			 */
			adjustSliceHeight(position, pageCanvasHeight, leftHeight, cutGuides) {
				let sliceHeight = Math.min(leftHeight, pageCanvasHeight)
				if (leftHeight <= pageCanvasHeight || !cutGuides || !cutGuides.length) {
					return Math.max(1, Math.floor(sliceHeight))
				}
				const cutY = position + sliceHeight
				let adjustedCut = cutY
				for (let i = 0; i < cutGuides.length; i++) {
					const g = cutGuides[i]
					// 块本身超过一页，无法避免切断
					if (g.end - g.start >= pageCanvasHeight * 0.92) continue
					if (cutY > g.start + 1 && cutY < g.end - 1) {
						if (g.start > position + 8) {
							adjustedCut = Math.min(adjustedCut, g.start)
						}
					}
				}
				sliceHeight = adjustedCut - position
				// 裁切过短会导致几乎空白页，此时仍按原高度切，避免死循环
				if (!(sliceHeight > 0) || sliceHeight < pageCanvasHeight * 0.18) {
					sliceHeight = Math.min(leftHeight, pageCanvasHeight)
				}
				return Math.max(1, Math.floor(sliceHeight))
			},
			async renderDom() {
				// app无法通过传参获取domId,也无法直接获取到script中data或props数据
				// 必须通过特定的监听方式,与script通信,获取其data
				let restoreCanvases = null
				try {
					const el = document.getElementById(this.domIdValue);
					if (!el) {
						console.error('dom盒子未加载成功，请先确保dom渲染完成，再检查你的domId是否有误');
						this.$ownerInstance.callMethod('renderFail', 'dom not found')
						return
					}
					// 先转 base64，再截图，避免 file:// 污染 canvas
					await this.ensureImagesBase64(el)
					restoreCanvases = await this.ensureCanvasesAsImages(el)
					const cutGuidesCss = this.collectCutGuides(el)
					/**
					 * 配置说明
					 * 1. allowTaint:true和useCORS:true都是解决跨域问题的方式(不一定完全能解决跨域)，不同的是使用allowTaint会对canvas造成污染，导致无法使用canvas.toDataURL方法
					 * 2. 想要完美解决跨域，还得需要后端服务器设置access-control-allow-origin: *，允许资源跨域访问，前端设置useCORS:true
					 * 2. scale通过放大倍率来调整画质清晰度，但是只调整这一个参数可能不是最优解
					 * App 长报告用 scale:1.5，避免超大 canvas 在 toDataURL/jsPDF 阶段内存卡死
					 */
					const isApp = typeof plus === 'object'
					const scale = isApp ? 1.5 : 2
					const canvas = await html2canvas(el, {
						width: el.offsetWidth,
						height: el.offsetHeight,
						x: 0,
						y: 0,
						logging: false,
						useCORS: true,
						allowTaint: false,
						scale,
						backgroundColor: '#ffffff',
					});
					if (typeof restoreCanvases === 'function') restoreCanvases()
					restoreCanvases = null
					const ratio = canvas.width / Math.max(el.offsetWidth, 1)
					const cutGuides = cutGuidesCss.map((g) => ({
						start: g.start * ratio,
						end: g.end * ratio
					}))
					console.log('==== cut guides :', cutGuides.length)
					// 不再导出整图 PNG（长报告可达上百 MB，callMethod 会卡住）
					this.$ownerInstance.callMethod('renderOver', '')
					console.log('==== html2canvas done, size:', canvas.width, canvas.height)
					await this.createPDF(canvas, cutGuides)
				} catch (err) {
					if (typeof restoreCanvases === 'function') restoreCanvases()
					console.log('==== err :', err);
					this.$ownerInstance.callMethod('renderFail', String(err && err.message ? err.message : err))
				}
			},
			// 监听方式,与script通信,获取其data
			watchDomId(newValue, oldValue, ownerInstance, instance) {
				this.domIdValue = newValue
			},
			watchExpOver(newValue, oldValue, ownerInstance, instance) {
				if (newValue !== 0) {
					// 初始不做监听，避免默认第一次就自动渲染
					this.renderDom()
				}
			},
			/**
			 * 按页切片写入 PDF，避免整图 toDataURL + 每页重复嵌入导致 App 假死
			 */
			createPageSlice(sourceCanvas, sy, sliceHeight) {
				sy = Math.max(0, Math.floor(sy))
				sliceHeight = Math.max(1, Math.floor(sliceHeight))
				if (sy >= sourceCanvas.height) {
					sy = Math.max(0, sourceCanvas.height - 1)
					sliceHeight = 1
				}
				if (sy + sliceHeight > sourceCanvas.height) {
					sliceHeight = Math.max(1, sourceCanvas.height - sy)
				}
				const pageCanvas = document.createElement('canvas')
				pageCanvas.width = sourceCanvas.width
				pageCanvas.height = sliceHeight
				const ctx = pageCanvas.getContext('2d')
				ctx.fillStyle = '#ffffff'
				ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
				ctx.drawImage(
					sourceCanvas,
					0, sy, sourceCanvas.width, sliceHeight,
					0, 0, sourceCanvas.width, sliceHeight
				)
				const dataUrl = pageCanvas.toDataURL('image/jpeg', 0.72)
				pageCanvas.width = 0
				pageCanvas.height = 0
				return dataUrl
			},
			async createPDF(canvas, cutGuides) {
				try {
					const a4width = 592.28
					const a4height = 841.89
					const margin = 16
					const contentWidth = canvas.width
					const contentHeight = canvas.height
					const imgWidth = a4width - margin * 2
					const maxDrawHeight = a4height - margin * 2
					const pageCanvasHeight = Math.floor((contentWidth / imgWidth) * maxDrawHeight)
					const pdf = new JsPDF('', 'pt', 'a4')
					let leftHeight = contentHeight
					let position = 0
					let pageIndex = 0
					const guides = cutGuides || []
					const maxPages = Math.ceil(contentHeight / Math.max(pageCanvasHeight, 1)) + 5

					console.log('==== createPDF start, pages ~', Math.ceil(contentHeight / pageCanvasHeight))

					while (leftHeight > 0 && pageIndex < maxPages) {
						let sliceHeight = this.adjustSliceHeight(position, pageCanvasHeight, leftHeight, guides)
						sliceHeight = Math.min(sliceHeight, leftHeight, contentHeight - position)
						if (!(sliceHeight > 0)) break
						const pageData = this.createPageSlice(canvas, position, sliceHeight)
						let drawHeight = (imgWidth / contentWidth) * sliceHeight
						if (drawHeight > maxDrawHeight) drawHeight = maxDrawHeight
						if (pageIndex > 0) {
							pdf.addPage()
						}
						pdf.addImage(pageData, 'JPEG', margin, margin, imgWidth, drawHeight)
						leftHeight -= sliceHeight
						position += sliceHeight
						pageIndex++
						console.log('==== pdf page', pageIndex, 'slice', Math.round(sliceHeight), 'left', Math.round(leftHeight))
						await new Promise((r) => setTimeout(r, 30))
					}

					console.log('==== pdf output start, pages', pageIndex)
					if (typeof plus === 'object' && plus.io) {
						const path = await this.savePdfFileOnApp(pdf)
						console.log('==== pdf saved path', path)
						this.$ownerInstance.callMethod('openSavedPDF', path)
					} else {
						const base64Str = pdf.output('dataurlstring')
						console.log('==== pdf output done, len', base64Str && base64Str.length)
						this.$ownerInstance.callMethod('savePDF', base64Str)
					}
				} catch (err) {
					console.log('==== createPDF err :', err)
					this.$ownerInstance.callMethod('renderFail', String(err && err.message ? err.message : err))
				}
			},
			savePdfFileOnApp(pdf) {
				return new Promise((resolve, reject) => {
					let dataUri = ''
					try {
						dataUri = pdf.output('datauristring')
					} catch (e) {
						reject(e)
						return
					}
					const comma = dataUri.indexOf(',')
					const base64Data = comma >= 0 ? dataUri.substring(comma + 1) : dataUri
					if (!base64Data) {
						reject(new Error('empty pdf base64'))
						return
					}
					const fileName = 'report_' + Date.now() + '.pdf'
					const basePath = '_doc'
					const dirPath = 'uniapp_temp'
					const filePath = basePath + '/' + dirPath + '/' + fileName
					const chunkSize = 256 * 1024
					plus.io.resolveLocalFileSystemURL(basePath, (entry) => {
						entry.getDirectory(dirPath, {
							create: true,
							exclusive: false
						}, (dirEntry) => {
							dirEntry.getFile(fileName, {
								create: true,
								exclusive: false
							}, (fileEntry) => {
								fileEntry.createWriter((writer) => {
									let offset = 0
									let phase = 'truncate'
									writer.onerror = (e) => reject(e)
									writer.onwriteend = () => {
										if (phase === 'truncate') {
											phase = 'write'
											offset = 0
											writer.seek(0)
											const first = base64Data.substring(0, chunkSize)
											offset = first.length
											writer.writeAsBinary(first)
											return
										}
										if (offset < base64Data.length) {
											const chunk = base64Data.substring(offset, offset + chunkSize)
											offset += chunk.length
											writer.writeAsBinary(chunk)
											return
										}
										console.log('==== pdf write done, bytes~', base64Data.length)
										resolve(filePath)
									}
									try {
										writer.truncate(0)
									} catch (e) {
										phase = 'write'
										writer.seek(0)
										writer.writeAsBinary(base64Data)
									}
								}, reject)
							}, reject)
						}, reject)
					}, reject)
				})
			}
		}
	}
</script>

<style>
	.sp-html2pdf-render {
		position: relative;
	}
</style>