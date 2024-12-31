//
//  DialInfo.swift
//  TaskLive
//
//  Created by apple on 2020/6/8.
//  Copyright © 2020 wujunjie All rights reserved.
//

import UIKit
import SwiftyJSON
@objcMembers
open class DialInfo: NSObject {
    var uuidString = ""
    open var productId = ""
    open var name = "dial"
    /*0 方形, 1圆形*/
    open var type = 0
    open var type1 = 0
    open var width = 240
    open var height = 296
    open var imageUrl = ""
    open var dialUrl = ""
    open var size = 0
    open var data = Data()
    open var image = UIImage()
    open var customIndex = 0
    open var dialData  =  Data()
    override public init() {
        super.init()
    }
    
    public init(fromJson haha: JSON? = nil) {
        super.init()
        guard let json = haha else {
            return
        }
//        .addingPercentEncoding(withAllowedCharacters: .urlPathAllowed)!
        productId = json["imageUrl"].stringValue
        type = json["type"].intValue
        width = json["width"].intValue
        height = json["height"].intValue
        imageUrl = json["imageUrl"].stringValue
        dialUrl = json["dialUrl"].stringValue
        size = json["size"].intValue
    }
}
