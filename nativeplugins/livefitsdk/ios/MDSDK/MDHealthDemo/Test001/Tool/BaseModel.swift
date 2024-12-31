//
//  BaseModel.swift
//  LifeFit
//
//  Created by GJD on 2021/5/12.
//  Copyright © 2021 wujunjie All rights reserved.
//

import UIKit

@objcMembers
class BaseModel: NSObject {
    var status = false
    var code = 0
    var message = ""
    var data = JSON()
    
    init(fromJson a: JSON? = nil) {
        guard let json = a else {
            return
        }
        let temp = json["code"].intValue
        status = (temp == 200) ?true:false
        message = json["message"].stringValue.removingPercentEncoding ?? ""
        data = json["data"]
    }
}
