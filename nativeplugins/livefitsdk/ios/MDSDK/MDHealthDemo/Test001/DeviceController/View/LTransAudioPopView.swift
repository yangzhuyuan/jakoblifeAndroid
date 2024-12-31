//
//  LTransAudioPopView.swift
//  LifeFit
//
//  Created by GJD on 2023/7/26.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit

class LTransAudioPopView: UIView,LLoadNibAble {

    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var cancelButton: UIButton!
    
    @IBOutlet weak var contentBackView: UIView!
    
    @IBOutlet weak var perLabel: UILabel!
    
    @IBOutlet weak var nameLabel: UILabel!
    
    @IBOutlet weak var progressView: UIProgressView!
    
    
    @IBOutlet weak var invicateLabel: UILabel!
    
    var transAudioPopViewCancelBlcok:(() -> ())?
    override func awakeFromNib() {
        super.awakeFromNib()
        self.backgroundColor = UIColor.colorWithHex(hex: "000000", alpha: 0.24)
        contentBackView.layer.cornerRadius = 15
        titleLabel.text = NSLocalizedString("正在传输", comment: "")
        progressView.setProgress(0.0, animated: false)
        invicateLabel.text = "（" +  NSLocalizedString(" 文件传输中请保持手机与手表的蓝牙连接", comment: "") + "）"
        cancelButton.setTitle(NSLocalizedString("取消", comment: ""), for: .normal)
    }
 
   
    var sendValue:Float?{
        didSet{
            progressView.setProgress(sendValue ?? 0.0, animated: true)
        }
    }
    
    @IBAction func cancelButtonAction(_ sender: UIButton) {
        self.removeFromSuperview()
        transAudioPopViewCancelBlcok?()
    }
    
}
