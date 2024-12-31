//
//  LRecommendCollectionCell.swift
//  LifeFit
//
//  Created by GJD on 2023/6/1.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit

protocol LDialCollectionCellDelegate {
    func L_dialLoad(withModel dailModel: DialInfo)
}
 
class LRecommendCollectionCell: UICollectionViewCell {
 
    @IBOutlet weak var centerImageView: UIImageView!
    @IBOutlet weak var buttonBackView: UIView!
    
    @IBOutlet weak var loadButton: UIButton!
    @IBOutlet weak var dialImageView: UIImageView!
     var delegate: LDialCollectionCellDelegate?
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        dialImageView.layer.cornerRadius = 10
        buttonBackView.layer.cornerRadius = 7.0
        centerImageView.image = UIImage(named: "dial_add")
    }

    var dialModel:DialInfo?{
        didSet{
            if dialModel?.type1 != 8{
                let urlString : String = dialModel?.imageUrl ?? ""
                dialImageView.sd_setImage(with:  URL(string: urlString), placeholderImage: UIImage() )
                
                buttonBackView.layer.borderWidth = 1.0  // 设置边框宽度
                buttonBackView.layer.borderColor = UIColor.colorWithHex(hex: "D3834F").cgColor  // 设置边框颜色
    //            设置圆角：
               
                loadButton.setTitle(NSLocalizedString("下载", comment: ""), for: .normal)
                buttonBackView.isHidden = false
                centerImageView.isHidden = true
              
            }else{
//                let urlString : String = dialModel?.imageUrl ?? ""
//                dialImageView.sd_setImage(with:  URL(string: urlString), placeholderImage: UIImage() )
                dialImageView.image = UIImage(named: "dial_add_corner")
//                buttonBackView.layer.borderWidth = 1.0  // 设置边框宽度
//                buttonBackView.layer.borderColor = UIColor.colorWithHex(hex: "D3834F").cgColor  // 设置边框颜色
    //            设置圆角：
                
                loadButton.setTitle(NSLocalizedString("下载", comment: ""), for: .normal)
                buttonBackView.isHidden = true
                 
                centerImageView.isHidden = false
            }

            
        }
    }
    
    @IBAction func loadButtonAction(_ sender: UIButton) {
        self.delegate?.L_dialLoad(withModel: self.dialModel ?? DialInfo())
        
    }
    
    
    
}
