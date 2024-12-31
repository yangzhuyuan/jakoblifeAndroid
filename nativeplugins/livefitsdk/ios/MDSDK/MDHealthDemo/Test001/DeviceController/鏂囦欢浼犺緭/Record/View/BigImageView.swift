//
//  BigImageView.swift
//  LifeFit
//
//  Created by GJD on 2023/11/25.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit

class BigImageView: UIView,LLoadNibAble {

    @IBOutlet weak var bigImageView: UIImageView!
    override   func awakeFromNib() {
        super.awakeFromNib()
        
    }
    var bigImage:UIImage?{
        didSet{
            bigImageView.image = bigImage
            
        }
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        self.removeFromSuperview()
    }
    @IBAction func cancelButtonAction(_ sender: UIButton) {
        self.removeFromSuperview()
    }
    
}
