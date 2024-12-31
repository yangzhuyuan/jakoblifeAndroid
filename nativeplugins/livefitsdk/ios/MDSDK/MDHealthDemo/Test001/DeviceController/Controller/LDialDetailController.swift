//
//  LDialDetailController.swift
//  LifeFit
//
//  Created by GJD on 2023/6/1.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit
import SDWebImage
import RealSDK
class LDialDetailController: UIViewController {

   
    @IBOutlet weak var sizeLabel: UILabel!
    @IBOutlet weak var naviTitleLabel: UILabel!
    @IBOutlet weak var naviHeighConst: NSLayoutConstraint!
    
    @IBOutlet weak var watchoutLabel: UILabel!
    
    @IBOutlet weak var dialImageView: UIImageView!
    
    
    @IBOutlet weak var loadButton: UIButton!
    @IBOutlet weak var desLabel: UILabel!
    
    var dialmodel =  DialInfo()

    fileprivate lazy var dialPopView: DialPopView! = { [unowned self] in
        let popView = DialPopView.L_loadFromNib()
        popView.frame = CGRect(x: 0, y: 0, width: kScreenWidth, height: kScreenHeight)
        
        return popView
    }()
//    var dialmodel : DialInfo?{
//        didSet{
//            print("========")
//            print(dialmodel?.imageUrl)
//            guard let urlString : String = dialmodel?.imageUrl else {return}
//
//            dialImageView.sd_setImage(with:  URL(string: urlString), placeholderImage: UIImage() )
//        }
//    }
    override func viewDidLoad() {
        super.viewDidLoad()

        naviHeighConst.constant = 88
        naviTitleLabel.text = NSLocalizedString("表盘详情", comment: "")
        
        let urlString : String = dialmodel.imageUrl
    
        dialImageView.sd_setImage(with:  URL(string: urlString), placeholderImage: UIImage() )
        loadButton.layer.cornerRadius = 8
      
    }

 
    @IBAction func loadButtonAction(_ sender: UIButton) {
        
 
        dialPopView.model = dialmodel
        dialPopView.dialPopTransBlock = {[weak  self] (type) in
            SVProgressHUD.dismiss()
            if type == 0{
                self?.showHud("表盘安装成功", duration: 1.5)
            }else{
                self?.showHud("表盘安装失败", duration: 1.5)
                
            }
            
        }
        UIApplication.shared.keyWindow?.addSubview(dialPopView)
    }
    @IBAction func backAction(_ sender: Any) {
        self.navigationController?.popViewController(animated: false)
    }
}
