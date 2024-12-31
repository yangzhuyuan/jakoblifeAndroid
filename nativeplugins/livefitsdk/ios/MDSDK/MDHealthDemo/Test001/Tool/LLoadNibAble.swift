//
//  LLoadNibAble.swift
//  LifeFit
//
//  Created by GJD on 2023/5/11.
//  Copyright © 2023 wujunjie. All rights reserved.
// 加载xib协议

import UIKit

protocol LLoadNibAble {
    //    func test()
}

extension LLoadNibAble where Self : UIView {
    static func L_loadFromNib(_ nibname : String? = nil) -> Self {
        let loadName = nibname == nil ? "\(self)" : nibname!
        return Bundle.main.loadNibNamed(loadName, owner: nil, options: nil)?.first as! Self
    }
}
