//
//  LRecordDesCell.swift
//  LifeFit
//
//  Created by GJD on 2023/8/8.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit

class LRecordDesCell: UITableViewCell {

    
    @IBOutlet weak var playProgress: UISlider!
    @IBOutlet weak var playButton: UIButton!
    
    @IBOutlet weak var titleLabel: UILabel!
    
    var  recordDesBlock :((_ isPlay:Bool) -> ())?
    
    override func awakeFromNib() {
        super.awakeFromNib()
        self.playProgress.minimumValue = 0
        self.playProgress.maximumValue = 1
        self.playProgress.value = 0
        
        self.playProgress.minimumTrackTintColor = UIColor.colorWithHex(hex: "#23CC96")
        self.playProgress.maximumTrackTintColor = UIColor.colorWithHex(hex: "#f9f9f9")
        self.playProgress.thumbTintColor  = UIColor.colorWithHex(hex: "#23CC96")
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
 
    }
    
    @IBAction func playButtonAction(_ sender: UIButton) {
//        sender.isSelected = !sender.isSelected
        
    }
}
