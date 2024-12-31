//
//  APPConst.swift
//  Test001
//
//  Created by GJD on 2023/12/27.
//
enum ReadSDCardType: Int {
   case music
   case Ebook
   case record
   case ePhotos

}
let kisOTAing = "isOTAing"
let baseUrl: String = "https://www.m-livefit.com/tp_livefit/public/index.php/api/"
let kScreenWidth = UIScreen.main.bounds.width
let kScreenHeight = UIScreen.main.bounds.height
///文件大小转换为字符串
func L_convertFileSize(_ fileSize: CGFloat) -> String {
    let kb: CGFloat = 1024
    let mb: CGFloat = kb * 1024
    let gb: CGFloat = mb * 1024
    
    if fileSize >= gb {
        return String(format: "%.1fGB", fileSize / gb)
    } else if fileSize >= mb {
        let f = fileSize / mb
        if f > 100 {
            return String(format: "%.0fMB", f)
        } else {
            return String(format: "%.1fMB", f)
        }
    } else if fileSize >= kb {
        let f = fileSize / kb
        if f > 100 {
            return String(format: "%.0fKB", f)
        } else {
            return String(format: "%.1fKB", f)
        }
    } else {
        return String(format: "%.1fB", fileSize)
    }
}
/// float 保留一位小数
/// - Parameter value: float
/// - Returns: 保留一位后的float
func L_roundToSingleDigit(_ value: Float) -> Float {
    let multiplier = pow(10.0, Float(1 - Int(log10f(fabs(value)))))
    return round(value * multiplier) / multiplier
}
