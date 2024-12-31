//
//  CardManageController.swift
//  Test001
//
//  Created by GJD on 2023/11/21.
//

import UIKit
import CoreImage
import RealSDK
class CardManageController: UIViewController ,UITableViewDelegate,UITableViewDataSource{
    fileprivate let kDevicesListCell = "DevicesListCell"
    var isBusessCard = false
    @IBOutlet weak var deviceTable: UITableView!
    override func viewDidLoad() {
        super.viewDidLoad()
        self.fd_prefersNavigationBarHidden = true
        deviceTable.delegate = self
        deviceTable.dataSource = self
        deviceTable.register(UINib(nibName: "DevicesListCell", bundle: nil), forCellReuseIdentifier: kDevicesListCell)
    }
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if isBusessCard == true{
            return 2
        }
        return 2
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: kDevicesListCell, for: indexPath) as! DevicesListCell
        if isBusessCard == true{
            if indexPath.row == 0{
                cell.nameLabel.text = "微信"
            }else{
                cell.nameLabel.text = "qq"
            }
        }else{
            if indexPath.row == 0{
                cell.nameLabel.text = "微信支付"
            }else{
                cell.nameLabel.text = "支付宝支付"
            }
        }
        cell.rssiLabel.isHidden = true
        cell.addressLabel.isHidden = true
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        
        if isBusessCard == true{
            if indexPath.row == 0{//微信
                let wxImage =  UIImage(named: "weixinbusness.JPG")
                
                let  qrStrings =  self.detectQRCode(from:wxImage ?? UIImage() )
                if qrStrings.count == 1{
                    let resultString = qrStrings[0]
                    if resultString.contains("wechat"){
                        bindQRCodeString(qrCode: 1, qrString: resultString)
                    }else{
                        print("请使用正确的二维码")
                    }
                }
                
                
                
            }else{//qq
                let wxImage =  UIImage(named: "qqbusness.PNG")
                
                let  qrStrings =  self.detectQRCode(from:wxImage ?? UIImage() )
                if qrStrings.count == 1{
                    let resultString = qrStrings[0]
                    
                        bindQRCodeString(qrCode: 2, qrString: resultString)
                    
                }
                
                
            }
        }else{
            if indexPath.row == 0{//微信支付
                let wxImage =  UIImage(named: "wxWallet.JPG")
                
                let  qrStrings =  self.detectQRCode(from:wxImage ?? UIImage() )
                if qrStrings.count == 1{
                    let resultString = qrStrings[0]
                    if resultString.contains("wx"){
                        bindQRCodeString(qrCode: 6, qrString: resultString)
                    }else{
                        print("请使用正确的二维码")
                    }
                }
                
                
            }else{//支付宝支付
                let wxImage =  UIImage(named: "zfbWallet.PNG")
                
                let  qrStrings =  self.detectQRCode(from:wxImage ?? UIImage() )
                if qrStrings.count == 1{
                    let resultString = qrStrings[0]
                    if resultString.contains("ali"){
                        bindQRCodeString(qrCode: 8, qrString: resultString)
                    }else{
                        print("请使用正确的二维码")
                    }
                }
                
            }
        }
    }
    
    fileprivate func bindQRCodeString(qrCode:Int,qrString:String)   {
        MDBleManager.share.MD_setBusessCard(codeType: qrCode, codeString: qrString)
        
    }
    
    public func  detectQRCode(from image: UIImage) -> [String] {
        var qrCodeStrings: [String] = []
        
        guard let ciImage = CIImage(image: image) else {
            return qrCodeStrings
        }
        
        let options: [String: Any] = [
            CIDetectorAccuracy: CIDetectorAccuracyHigh
        ]
        
        guard let detector = CIDetector(ofType: CIDetectorTypeQRCode, context: nil, options: options) else {
            return qrCodeStrings
        }
        
        let features = detector.features(in: ciImage)
        
        for feature in features {
            if let qrCodeFeature = feature as? CIQRCodeFeature, let messageString = qrCodeFeature.messageString {
                qrCodeStrings.append(messageString)
            }
        }
        
        return qrCodeStrings
    }
}
