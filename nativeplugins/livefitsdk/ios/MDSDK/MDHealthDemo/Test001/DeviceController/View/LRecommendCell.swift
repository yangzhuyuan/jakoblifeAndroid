//
//  LRecommendCell.swift
//  LifeFit
//
//  Created by GJD on 2023/6/1.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit

protocol LRecommendCellDelegate {
    func L_RecommendCellLoad(withModel dailModel: DialInfo)
    
    func L_RecommendGetModel(withSection sectionIndex: Int)
}
class LRecommendCell: UITableViewCell , UICollectionViewDataSource, UICollectionViewDelegate,LDialCollectionCellDelegate{
  
    
fileprivate let kLRecommendCollectionCell = "LRecommendCollectionCell"
    @IBOutlet weak var topTitleLabel: UILabel!
    
    @IBOutlet weak var moreButton: UIButton!
    @IBOutlet weak var collectionView: UICollectionView!
    
    @IBOutlet weak var moreLabel: UILabel!
    
    @IBOutlet weak var collectionViewHeight: NSLayoutConstraint!
    
    
    @IBOutlet weak var moreBackView: UIView!
    var sectionIndex = 0
    var delegate:LRecommendCellDelegate?
    override func awakeFromNib() {
        super.awakeFromNib()
//        moreBackView.layer.cornerRadius = 12.5
//        moreBackView.layer.borderWidth = 1
        moreLabel.text = NSLocalizedString("更多", comment: "")
        
        
        let layout = UICollectionViewFlowLayout()
        
         
        layout.itemSize = CGSize(width: (kScreenWidth - 30 - 30)/3, height: (kScreenWidth - 36 - 30)/3 + 35)
        //        layout.scrollDirection = .horizontal
        layout.minimumLineSpacing = 0
        layout.minimumInteritemSpacing = 0
        layout.sectionInset = UIEdgeInsets.init(top: 0, left: 0, bottom: 0, right: 0)
        layout.minimumInteritemSpacing = 10
        layout.minimumLineSpacing = 10
        //        collectionView = UICollectionView(frame: CGRect.init(x: 0, y: 0, width: UIScreen.main.bounds.width, height: (UIScreen.main.bounds.width / CGFloat(countCol) + 8.0) * CGFloat(countRow)), collectionViewLayout: layout)
        collectionView.setCollectionViewLayout(layout, animated: true)
        collectionView.backgroundColor = UIColor.white
        collectionView.dataSource = self
        collectionView.delegate = self
        
        //        collectionView.isPagingEnabled = true
        collectionView.showsVerticalScrollIndicator = false
        collectionView.showsHorizontalScrollIndicator = false
        collectionView.contentInset = UIEdgeInsets(top: 0.0, left: 0, bottom: 0.0, right: 0)
        
        // 注册CollectionViewCell
        self.collectionView!.register(UINib(nibName:"LRecommendCollectionCell", bundle:nil),
                                      forCellWithReuseIdentifier: kLRecommendCollectionCell)
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    
    @IBAction func moreButtonAction(_ sender: UIButton) {
        print("self.sectionIndex==\(self.sectionIndex)")
        self.delegate?.L_RecommendGetModel(withSection: self.sectionIndex)
    }
    var dialTypeModel:LDialTypeModel?{
        didSet{
            
            if (dialTypeModel?.array.count ?? 0) > 6{
                moreBackView.isHidden = false
            }else{
                moreBackView.isHidden = true
            }
            
            self.topTitleLabel.text = dialTypeModel?.typeName
            self.collectionView.reloadData()
            
            //更新collectionView的高度约束
            let contentSize = self.collectionView.collectionViewLayout.collectionViewContentSize
            collectionViewHeight.constant = contentSize.height
            
            self.collectionView.collectionViewLayout.invalidateLayout()
        }
    }
    //返回collectionView的单元格数量
    func collectionView(_ collectionView: UICollectionView,
                        numberOfItemsInSection section: Int) -> Int {
        if((dialTypeModel?.array.count ?? 0) > 6){
            return 6
        }
        return dialTypeModel?.array.count ?? 0
    }
    
    //返回对应的单元格
    func collectionView(_ collectionView: UICollectionView,
                        cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        
        
        let cell  = collectionView.dequeueReusableCell(withReuseIdentifier: kLRecommendCollectionCell,
                                                       for: indexPath) as! LRecommendCollectionCell
         
        cell.dialModel = self.dialTypeModel?.array[indexPath.item]
 
        cell.delegate = self
        
        return cell
    }
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        //        let dialModel = self.dialTypeModel?.array[indexPath.item]
        if self.dialTypeModel?.type == 8{
            guard let dialModel = self.dialTypeModel?.array[indexPath.item] else { return  }
            self.delegate?.L_RecommendCellLoad(withModel: dialModel)
        }
    }
    func L_dialLoad(withModel dailModel: DialInfo) {
        self.delegate?.L_RecommendCellLoad(withModel: dailModel)
    }
}
