//
//  LDialCustomCell.swift
//  Test001
//
//  Created by GJD on 2024/1/4.
//

import UIKit

class LDialCustomCell: UITableViewCell {

    var  dialCustomIndexBlock :((_ index:Int) -> ())?
    
    @IBOutlet weak var dialShowImageView: UIImageView!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

       
    }
    
    @IBAction func dialSetButtonAction(_ sender: UIButton) {
        self.dialCustomIndexBlock?(4)
      
    }
    
    @IBAction func firstButtonAction(_ sender: UIButton) {
        dialShowImageView.image = UIImage(named: "131-1-bg")
        self.dialCustomIndexBlock?(0)
    }
    
    @IBAction func secondButtonAction(_ sender: UIButton) {
        dialShowImageView.image = UIImage(named: "131-2-bg")
        self.dialCustomIndexBlock?(1)
    }
    
    
    @IBAction func fhirdButtonAction(_ sender: UIButton) {
        dialShowImageView.image = UIImage(named: "131-3-bg")
        self.dialCustomIndexBlock?(2)
        
    }
    
    
    @IBAction func forthButtonAction(_ sender: UIButton) {
        dialShowImageView.image = UIImage(named: "131-4-bg")
        self.dialCustomIndexBlock?(3)
        
    }
}
