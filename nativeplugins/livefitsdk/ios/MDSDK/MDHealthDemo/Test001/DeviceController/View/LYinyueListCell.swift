//
//  LYinyueListCell.swift
//  LifeFit
//
//  Created by GJD on 2023/7/20.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit

class LYinyueListCell: UITableViewCell {

    var yinyueListCellBlock:((_ index:Int,_ audioModel:LFileModel) -> ())?
    @IBOutlet weak var sizeLabel: UILabel!
    @IBOutlet weak var indexLabel: UILabel!
    
    @IBOutlet weak var nameLabel: UILabel!
    
    @IBOutlet weak var selectButton: UIButton!
    var indexRow = 0
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    var audioModel:LFileModel?{
        didSet{
            indexLabel.text = (audioModel?.index ?? "")  + "."
            nameLabel.text = audioModel?.name
            print("audioModel?.size==\(audioModel?.size)")
            sizeLabel.text = audioModel?.size
            
            selectButton.isSelected = audioModel?.isSelect ?? false
        }
    }
    var fileModel:JLModel_File?{
        didSet{
//            indexLabel.text = (audioModel?.index ?? "")  + "."
            nameLabel.text = fileModel?.fileName
//            sizeLabel.text = audioModel?.size
        }
    }
    @IBAction func selectButtonAction(_ sender: UIButton) {
        audioModel?.isSelect = !(audioModel?.isSelect ?? false)
        yinyueListCellBlock?(indexRow, audioModel ?? LFileModel())
        
    }
    
    
}
