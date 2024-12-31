//
//  DevicesListCell.swift
//  MDSDKDemo
//
//  Created by GJD on 2023/11/16.
//

import UIKit
import RealSDK
class DevicesListCell: UITableViewCell {

    @IBOutlet weak var nameLabel: UILabel!
    
    @IBOutlet weak var addressLabel: UILabel!
    
    
    @IBOutlet weak var rssiLabel: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    var  bleModel:WUBleModel?{
        didSet
        {
            nameLabel.text = bleModel?.name
            rssiLabel.text = bleModel?.rssi.description
            addressLabel.text = bleModel?.mac
            rssiLabel.isHidden = false
            addressLabel.isHidden = false
        }
    }
    var funcModel:MDFuncModel?{
        didSet{
            nameLabel.text = funcModel?.funcName
            rssiLabel.isHidden = true
            addressLabel.isHidden = true
        }
    }
}
