//
//  LDialTableHeaderView.swift
//  LifeFit
//
//  Created by GJD on 2023/6/2.
//  Copyright © 2023 wujunjie. All rights reserved.
// 

import UIKit

 

class LDialTableHeaderView: UIView , LLoadNibAble, UICollectionViewDataSource, UICollectionViewDelegate{
    fileprivate let kLDialTypeCollectionCell = "LDialTypeCollectionCell"
    
    var dialTableHeaderViewBlock:((_ dialTypeModel:LDialTypeModel) -> ())?
    @IBOutlet weak var collectionView: UICollectionView!
    private let imageArray = ["paihang", "zuixin","dongtai",  "jijian", "katong", "fashion", "shangwu",]
    private let titleArray = [NSLocalizedString("排行", comment: ""), NSLocalizedString("最新", comment: ""),NSLocalizedString("动态", comment: ""),  NSLocalizedString("极简", comment: ""), NSLocalizedString("卡通", comment: ""), NSLocalizedString("时尚", comment: ""),NSLocalizedString("商务", comment: ""),  NSLocalizedString("自定义", comment: "")]
    
    
    override  func awakeFromNib() {
        super.awakeFromNib()
        let layout = UICollectionViewFlowLayout()
        
         
        layout.itemSize = CGSize(width: 100, height: 100)
                layout.scrollDirection = .horizontal
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
        self.collectionView!.register(UINib(nibName:"LDialTypeCollectionCell", bundle:nil),
                                      forCellWithReuseIdentifier: kLDialTypeCollectionCell)
    }
    var dialTypeModelArray:[LDialTypeModel]?{
        didSet{
            
          
            
//            self.topTitleLabel.text = dialTypeModel?.typeName
            self.collectionView.reloadData()
            
//            //更新collectionView的高度约束
//            let contentSize = self.collectionView.collectionViewLayout.collectionViewContentSize
//            collectionViewHeight.constant = contentSize.height
//
//            self.collectionView.collectionViewLayout.invalidateLayout()
        }
    }
    //返回collectionView的单元格数量
    func collectionView(_ collectionView: UICollectionView,
                        numberOfItemsInSection section: Int) -> Int {
//        if((dialTypeModel?.array.count ?? 0) > 6){
//            return 7
//        }
        return ((self.dialTypeModelArray?.count ?? 0) - 1)  
    }
    
    //返回对应的单元格
    func collectionView(_ collectionView: UICollectionView,
                        cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        
        
        let cell  = collectionView.dequeueReusableCell(withReuseIdentifier: kLDialTypeCollectionCell,
                                                       for: indexPath) as! LDialTypeCollectionCell
        let typeModel = self.dialTypeModelArray?[indexPath.item]
        cell.typeImageView.image = UIImage(named: typeModel?.typeImageName ?? "") 
 
        cell.typeNameLabel.text =   typeModel?.typeName
        return cell
    }
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        self.dialTableHeaderViewBlock?(self.dialTypeModelArray?[indexPath.item] ?? LDialTypeModel())
    }
    
    
}
