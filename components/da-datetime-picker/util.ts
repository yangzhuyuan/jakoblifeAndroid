/**
 * 格式化时间
 * @param date 时间对象
 * @param format 格式
 * @author: crlang
 */
export function formatTime(date: Date | String | Number, format = ''): string | null {
  if (!date) return null

  let daDate = null
  if (typeof date === 'number') {
    daDate = new Date(date.toString().length < 11 ? date * 1000 : date)
  } else if (typeof date === 'string') {
    daDate = new Date(date.replace(/-/, '/'))
  } else if (typeof date === 'object') {
    daDate = date
  }

  if (!daDate?.getTime()) {
    return null
  }

  const fromatsRule = ['y', 'm', 'd', 'h', 'i', 's']
  let tmp = []
  const year = daDate.getFullYear()
  const month = daDate.getMonth() + 1
  const day = daDate.getDate()
  const hour = daDate.getHours()
  const minute = daDate.getMinutes()
  const second = daDate.getSeconds()

  if (format) {
    tmp.push(year, month, day, hour, minute, second)
    tmp = tmp.map(formatNumber)
    for (let i = 0; i < tmp.length; i++) {
      format = format.toLowerCase().replace(fromatsRule[i], tmp[i])
    }
    return format
  }

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

/**
 * 格式化数值-个位数补零
 * @param n 数值
 */
export function formatNumber(n: number | string) {
  let s = parseInt(n)
  if (isNaN(s)) {
    s = '0'
  } else {
    s = s.toString()
  }
  return s[1] ? s : `0${s}`
}
