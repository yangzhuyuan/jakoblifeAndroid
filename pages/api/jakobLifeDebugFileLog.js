/**
 * 写入 App 私有目录 jakoblife调试日志.txt，与 Main.vue jakobLifeDebugFileLog 行为一致。
 */

function appendJakobLifeDebugLogLine(line) {
	// #ifdef APP-PLUS
	if (typeof plus === 'undefined' || !plus.io) return
	const name = 'jakoblife调试日志.txt'
	const text = `[${new Date().toLocaleString('zh-CN')}] ${line}\n`
	plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
		fs.root.getFile(name, {
			create: true
		}, (fileEntry) => {
			fileEntry.createWriter((writer) => {
				writer.onerror = function() {}
				writer.seek(writer.length)
				writer.write(text)
			})
		})
	})
	// #endif
}

/** YYYY-MM-DD hh:mm:ss，与 Main.vue getCurrentTime 一致 */
export function getCurrentTime() {
	const now = new Date()
	const year = now.getFullYear()
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')
	const hours = String(now.getHours()).padStart(2, '0')
	const minutes = String(now.getMinutes()).padStart(2, '0')
	const seconds = String(now.getSeconds()).padStart(2, '0')
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/** @param {...*} parts 多个参数用 | 拼接后落盘 */
export function jakobLifeDebugFileLog(...parts) {
	if (!parts.length) return
	const line = parts.map((a) => {
		if (a === null) return 'null'
		if (typeof a === 'undefined') return 'undefined'
		if (typeof a === 'object') {
			try {
				return JSON.stringify(a)
			} catch (e) {
				return '[Object]'
			}
		}
		return String(a)
	}).join(' | ')
	appendJakobLifeDebugLogLine(line)
}
