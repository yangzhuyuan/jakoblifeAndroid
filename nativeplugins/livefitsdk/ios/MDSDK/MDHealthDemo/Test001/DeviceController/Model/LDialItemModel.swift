//
//  LDialItemModel.swift
//  LifeFit
//
//  Created by GJD on 2023/6/1.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit

class LDialItemModel: NSObject {
    
    @objc var productId = "133FA2"
    @objc var name = "dial"
    /*0 方形, 1圆形*/
    @objc var type = 0
    @objc var width = 240
    @objc var height = 296
    @objc var imageUrl = ""
    @objc var dialUrl = ""
    @objc var size = 0
    @objc var data = Data()
    @objc var image = UIImage()
    @objc var customIndex = 0
    
}

class LDialTypeModel: NSObject {
    @objc var index = 0
    @objc var type =  0
    @objc var typeName = ""
    @objc var typeImageName = ""
    @objc var array = [DialInfo]()
}
