//
//  LRecommendController.swift
//  LifeFit
//
//  Created by GJD on 2023/6/1.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit
import RealSDK
class LRecommendController: UIViewController {
    
    @IBOutlet weak var ndbTableView: UITableView!
    var naviController:UINavigationController?
    fileprivate let kLRecommendCell = "LRecommendCell"
    var loadedIndex = 0
    
    private let imageArray = ["paihang", "zuixin","dongtai",  "jijian", "katong", "fashion", "shangwu",]
    private let titleArray = [NSLocalizedString("排行", comment: ""), NSLocalizedString("最新", comment: ""),NSLocalizedString("动态", comment: ""),  NSLocalizedString("极简", comment: ""), NSLocalizedString("卡通", comment: ""), NSLocalizedString("时尚", comment: ""),NSLocalizedString("商务", comment: ""),  NSLocalizedString("自定义", comment: "")]
    var totalArray=[LDialTypeModel]()
    
    var headerView : LDialTableHeaderView?
    override func viewDidLoad() {
        super.viewDidLoad()
        ndbTableView.delegate = self
        ndbTableView.dataSource = self
        ndbTableView.estimatedRowHeight = 200
        //        ndbTableView.estimatedSectionHeaderHeight = 0
        //        ndbTableView.sectionFooterHeight = 0
        ndbTableView.rowHeight  = UITableView.automaticDimension
        //        ndbTableView.sectionHeaderHeight = UITableView.automaticDimension
        ndbTableView.separatorColor = UIColor.clear
        ndbTableView.backgroundColor = UIColor.white
        ndbTableView.register(UINib(nibName: "LRecommendCell", bundle: nil), forCellReuseIdentifier: kLRecommendCell)
        
        let  headerBackView   = UIView()
        headerBackView.frame = CGRectMake(0, 0, kScreenWidth, 100)
        headerView = LDialTableHeaderView.L_loadFromNib()
        headerView?.frame = CGRectMake(0, 0, kScreenWidth, 100)
        headerView?.dialTableHeaderViewBlock = {[weak self ](typeModel) in
            //            let vc = LMoreDialController()
            //            vc.typeModel = typeModel
            //            self?.parent?.navigationController?.pushViewController(vc, animated:  false)
            
        }
        headerBackView.addSubview(headerView!)
        ndbTableView.tableHeaderView = headerBackView
        getDailListData()
    }
    @IBAction func backAction(_ sender: Any) {
        self.navigationController?.popViewController(animated: false)
    }
    
}

extension LRecommendController:UITableViewDelegate,UITableViewDataSource,LRecommendCellDelegate{
    
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return totalArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: kLRecommendCell, for: indexPath) as! LRecommendCell
        //            let model = self.listArray[indexPath.section]
        //        cell.delegate  = self
        cell.sectionIndex = indexPath.row
        cell.frame = tableView.bounds
        cell.layoutIfNeeded()
        
        cell.dialTypeModel = totalArray[indexPath.row]
        cell.delegate = self
        return cell
    }
    
    func L_RecommendCellLoad(withModel dailModel: DialInfo) {
        
        if dailModel.type1 == 8{
            let vc = LDialCustomController()
            //            vc.typeModel = typeModel
            self.parent?.navigationController?.pushViewController(vc, animated: false)
            
        }else{
            let vc = LDialDetailController()
            vc.dialmodel = dailModel
            print("self.naviController=\(self.parent?.navigationController)")
            self.navigationController?.pushViewController(vc, animated: false)
        }
        
        
    }
    func L_RecommendGetModel(withSection sectionIndex: Int) {
        
        //        let typeModel = self.totalArray[sectionIndex]
        ////        if typeModel.type == 8{
        //            let vc = LMoreDialController()
        //            vc.typeModel = typeModel
        //            self.naviController?.pushViewController(vc, animated: false)
        ////        }else{
        ////            let vc = DialSelectViewController()
        //////            vc.typeModel = typeModel
        ////            self.naviController?.pushViewController(vc, animated: false)
        ////        }
        
    }
    
}
extension LRecommendController{
    
    fileprivate func getDailListData()  {
        loadedIndex = 0
        
        let model = bleSelf.bleModel
        
        let paramet  = ["width":model.width,"height":model.height]
        
        
        NDBNetworkTool.getRequest(pathUrl: "dial/getInfo?width=\(model.width)&height=\(model.height)&productId=\(model.productId)", parameters: paramet) { resModel in
            let tempArray:[DialInfo] = DialInfo.mj_objectArray(withKeyValuesArray: resModel.data) as! [DialInfo]
            
            
            let groupedBytype1 = Dictionary(grouping: tempArray, by: { $0.type1 })
            
            let groupedArray = groupedBytype1.values.map { $0 }
            
            
            for i in 0..<groupedArray.count {
                let array = groupedArray[i]
                let mdoel = array[0]
                switch mdoel.type1 {
                case 6:
                    let typeMdoel = LDialTypeModel()
                    typeMdoel.typeName = NSLocalizedString("热门", comment: "")
                    typeMdoel.index = 0
                    typeMdoel.type = 6
                    typeMdoel.array = array
                    typeMdoel.typeImageName = "paihang"
                    self.totalArray.append(typeMdoel)
                case 0:
                    let typeMdoel = LDialTypeModel()
                    typeMdoel.typeName = NSLocalizedString("最新", comment: "")
                    typeMdoel.index = 1
                    typeMdoel.type = 0
                    typeMdoel.array = array
                    typeMdoel.typeImageName = "zuixin"
                    self.totalArray.append(typeMdoel)
                case 1:
                    let typeMdoel = LDialTypeModel()
                    typeMdoel.typeName = NSLocalizedString("数据", comment: "")
                    
                    typeMdoel.index = 2
                    typeMdoel.type = 1
                    typeMdoel.typeImageName = "dongtai"
                    typeMdoel.array = array
                    self.totalArray.append(typeMdoel)
                case 2:
                    let typeMdoel = LDialTypeModel()
                    typeMdoel.typeName = NSLocalizedString("简约", comment: "")
                    typeMdoel.index = 3
                    typeMdoel.type = 2
                    typeMdoel.array = array
                    typeMdoel.typeImageName = "jijian"
                    self.totalArray.append(typeMdoel)
                case 3:
                    let typeMdoel = LDialTypeModel()
                    typeMdoel.typeName = NSLocalizedString("卡通", comment: "")
                    typeMdoel.index = 4
                    typeMdoel.type = 3
                    typeMdoel.array = array
                    typeMdoel.typeImageName = "katong"
                    self.totalArray.append(typeMdoel)
                case 4:
                    let typeMdoel = LDialTypeModel()
                    typeMdoel.typeName = NSLocalizedString("色彩", comment: "")
                    typeMdoel.index = 5
                    typeMdoel.type = 4
                    typeMdoel.array = array
                    typeMdoel.typeImageName = "fashion"
                    self.totalArray.append(typeMdoel)
                case 5:
                    let typeMdoel = LDialTypeModel()
                    typeMdoel.typeName = NSLocalizedString("商务", comment: "")
                    typeMdoel.index = 6
                    typeMdoel.type = 5
                    typeMdoel.array = array
                    typeMdoel.typeImageName = "shangwu"
                    self.totalArray.append(typeMdoel)
                default:
                    print("===")
                    var typeMdoel = LDialTypeModel()
                    typeMdoel.typeName = NSLocalizedString("其它", comment: "")
                    typeMdoel.index = 7
                    typeMdoel.type = mdoel.type1
                    typeMdoel.array = array
                    typeMdoel.typeImageName = "fashion"
                    self.totalArray.append(typeMdoel)
                    
                }
            }
            
            self.totalArray.sort { $0.index < $1.index }
            
            let dialModel = DialInfo()
            dialModel.type1 = 8
            let typeMdoel = LDialTypeModel()
            typeMdoel.typeName = NSLocalizedString("自定义", comment: "")
            
            typeMdoel.index =  self.totalArray.count
            typeMdoel.type = 8
            typeMdoel.typeImageName = "shangwu"
            typeMdoel.array.append(dialModel)
            
            self.totalArray.append(typeMdoel)
            
            
            self.ndbTableView.reloadData()
            
            self.headerView!.dialTypeModelArray =  self.totalArray
            
            
            
        } failture: { error in
            
            
            print("热门==self.loadedIndex = \(self.loadedIndex )")
            
        }
        
    }
    //重装数据
    fileprivate func resetData(){
        if self.loadedIndex  == 7{
            self.ndbTableView.reloadData()
        }
    }
}
