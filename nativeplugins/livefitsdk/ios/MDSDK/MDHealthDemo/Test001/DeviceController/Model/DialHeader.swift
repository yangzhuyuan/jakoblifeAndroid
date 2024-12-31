//
//  DialHeader.swift
//  DialMake
//
//  Created by GJD on 2021/9/27.
//

import UIKit
import CoreFoundation

class DialHeader {
    // 4bytes
    var header = ""
    // 1bytes
    var type = 0
    // 1bytes
    var widgetNum = 0
    // 2bytes
    var refreshInterval = 0
    // 4bytes
    var widgetStartIndex = 0
    // 4bytes
    var dataStartIndex = 0
    
    // 1bytes
    var hasPreview = false
    var preview = PreviewImage()
    
    init() {
        
    }
    
    init(with data: Data) {
        if data.count < 32 {
            return
        }
        
        header = String.init(data: data[0..<4], encoding: .ascii)!
        
        type = data[4].toInt()
        widgetNum = data[5].toInt()
        
        refreshInterval = data[6..<8].toInt()
        widgetStartIndex = data[8..<12].toInt()
        dataStartIndex = data[12..<16].toInt()

        preview.size = CGSize.init(width: data[16..<18].toInt(), height: data[18..<20].toInt())
        preview.dataStartIndex = data[20..<24].toInt()
        preview.dataSize = data[24..<28].toInt()

        hasPreview = data[28..<29].toInt() == 1 ? true:false
        preview.imageType = ImageType.init(rawValue: data[29..<30].toInt()) ?? ImageType.bit1
    }
}

extension UInt8 {
    func toInt() -> Int {
        return Int.init(self)
    }
}

extension Data {
    func toInt() -> Int {
        let nsdata = NSData.init(data: self)
        var all: Int = 0
        for item in 0..<nsdata.count {
            all = all + Int(nsdata[item]) << (8 * item)
        }
        return all
    }
}

class PreviewImage {
    var size = CGSize.zero
    // 4bytes
    var dataStartIndex = 0
    // 4bytes
    var dataSize = 0
    // 1bytes
    var imageType = ImageType.bit1
}

class Widget {
    var widgetType = WidgetType.backgroundImage
    var displayNum = 0
    var totalNum = 0
    var imageType = ImageType.bit1
    var origin = CGPoint.zero
    var size = CGSize.zero
    
//    uint32_t bg;                        // 背景颜色时使用，argb8888
//    uint16_t color1bit_rgb565[2];        // widget_type 为 1bit 时使用
//    uint32_t color8bit_pallet_num;        // widget_type 为 8bit 时使用
    var colorBg = 0
    var color1bit = [Int]()
    var color8bit = 0
    
    var dataIndex = 0
    var dataSize = 0
    var pointerLength = 0
    var data = Data()
}
