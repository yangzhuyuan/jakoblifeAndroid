//
//  LRecordController.swift
//  LifeFit
//
//  Created by GJD on 2023/8/7.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit
import DFUnits
class LRecordController: UIViewController {
    fileprivate let kLFileManagerListCell = "LFileManagerListCell"
    @IBOutlet weak var naviHeightConst: NSLayoutConstraint!
    
    
    @IBOutlet weak var ndbTableView: UITableView!
    
    @IBOutlet weak var naviTitleLabel: UILabel!
    
    @IBOutlet weak var deleteButton: UIButton!
    var reqNum = 0
    var type = JLDeviceMusicVCType.USB
    var devel = JLModel_Device()
    var itemArray = [LFileModel]()
     
    var isAllIsSelect = false
    
    var  lastAllCount = -1
    override func viewDidLoad() {
        super.viewDidLoad()
        self.fd_prefersNavigationBarHidden = true
        
        naviTitleLabel.text = NSLocalizedString("录音", comment: "")
        self.deleteButton.setTitle(NSLocalizedString("删除", comment: ""), for: .normal)
        self.deleteButton.isHidden = true
        ndbTableView.delegate = self
        ndbTableView.dataSource = self
        ndbTableView.sectionHeaderHeight = 50
        ndbTableView.rowHeight = kScreenHeight
 
        ndbTableView.register(UINib(nibName: "LFileManagerListCell", bundle: nil), forCellReuseIdentifier: kLFileManagerListCell)
        
        ndbTableView.showsVerticalScrollIndicator = false
        ndbTableView.separatorStyle = .none
        
        devel = LMCmdManage?.outputDeviceModel() ?? JLModel_Device()
        self.type = JLDeviceMusicVCType.SDCard;
        DMusicHandler.shared.delegate = self
        DMusicHandler.shared.nowType = JL_CardType.SD_0
        DMusicHandler.shared.nowEntity =   LMCmdManage?.mEntity
        
        //        self.itemArray.removeAll()
        
        loadModeData()
        
    }
    
    
    
    @IBAction func backAction(_ sender: Any) {
        self.navigationController?.popViewController(animated: false)
        
    }
    @IBAction func deleteButtonAction(_ sender: UIButton) {
        self.deleteAudio()
    }
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        //        DMusicHandler.shared.delegate = nil
    }
    deinit{
        print("=======================================LRecordController释放了")
    }
}
//MARK:数据
extension LRecordController{
    //从设备获取音乐
    fileprivate func  loadModeData(){
        print("1111-----suportArray===\(self.devel.cardArray)")
        
        self.showHudForever()
        let suportArray = self.devel.cardArray
        if suportArray.count > 0{
            DMusicHandler.shared.loadModeData(JL_CardType.SD_0)
 
        }
        
    }
}
extension LRecordController:DMHandlerDelegate{
    
    func dmHandle(withTabTitleArray modelA: [JLModel_File]) {
        print("modelA== ==\(modelA)")
        for i in 0..<modelA.count {
            let model = modelA[i]
            print("modelA==\(i)==\(model.fileName)")
        }
        // titleArray = modelA;
    }
    
    func dmHandle(withItemModelArray modelB: [JLModel_File]) {
        print("modelB== ==\(modelB)")
        for i in 0..<modelB.count {
            let model = modelB[i]
            print("modelB==\(i)==\(model.fileName)")
            //
            if model.fileName  == "JL_REC" {
                JL_Tools.mainTask {
                    DMusicHandler.shared.requestWith(model, number: 10086)
                }
            }
            
            
        }
        JL_Tools.mainTask {
            var finalArray = [JLModel_File]()
            for i in 0..<modelB.count{
                let model  = modelB[i]
                if model.fileType == .file{
                    finalArray.append(model)
                }
            }
            self.itemArray.removeAll()
            for  tempModel in finalArray{
                let model = LFileModel()
                model.fileModel = tempModel
                self.itemArray.append(model)
            }
            
            //            self.itemArray  = finalArray
            self.hideHud()
            self.ndbTableView.reloadData()
 
            
        }
    }
    
    func dmHandleWithPlayItemOK() {
        
    }
    
    func dmLoadFailed(_ err: DM_ERROR) {
        
    }
    
    func dmCardMessageDismiss(_ nowArray: [Any]) {
        print("nowArray===\(nowArray)")
        //        for i in 0..<nowArray.count {
        //            let model = nowArray[i]
        //            print("nowArray==\(i)==\(model.fileName)")
        //        }
    }
}
extension LRecordController:UITableViewDelegate,UITableViewDataSource{
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return    itemArray.count
    }
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return  itemArray.count == 0 ? kScreenHeight :  50
    }
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 50
    }
  
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
     
            let cell  = tableView.dequeueReusableCell(withIdentifier: kLFileManagerListCell, for: indexPath) as!  LFileManagerListCell
            
            let model = self.itemArray[indexPath.row]
            
            cell.fileNameLabel.text = model.fileModel.fileName
            return cell
      
        
        
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let vc = LRecordDesController()
        vc.recordModel = self.itemArray[indexPath.row]
        self.navigationController?.pushViewController(vc, animated: false)
    }
    fileprivate func  checkOutIsAllIsSelect() ->Bool{
        for model in self.itemArray {
            if model.isSelect == false{
                return false
            }
        }
        return true
    }
    //尾部滑动事件按钮（左滑按钮）
    
    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        
        
        //destructive图片
        let  destructiveImageAction = UIContextualAction(style: UIContextualAction.Style.destructive, title: nil) { [weak self](acction:UIContextualAction, view:UIView, handle:@escaping (Bool) -> Void) in
            self?.deleteAudio(index: indexPath.row)
            
        }
        //        destructiveImageAction.backgroundColor = UIColor
        if let ima = UIImage.init(named: "yinyue_icon_delete"){
            ///设置图片
            destructiveImageAction.image = ima
            ///和cell背景色一样就可以
            destructiveImageAction.backgroundColor  = UIColor.init(red: 195, green: 76, blue: 93, alpha: 1)
            
        }
        
        let configuration =  UISwipeActionsConfiguration(actions: [ destructiveImageAction])
        configuration.performsFirstActionWithFullSwipe = false
        return configuration
    }
    fileprivate func deleteAudio(index:Int){
        var deleteArray = [JLModel_File]()
         
        deleteArray.append(self.itemArray[index].fileModel)
 
        
        JL_Tools.subTask {
            LMCmdManage?.mFileManager.cmdDelete(self.itemArray[index].fileModel, isLast: .isNotLast, result: { status, code, data in
                JL_Tools.mainTask {
               
                    DFUITools.showText(NSLocalizedString("删除成功", comment: ""), on: self.view, delay: 2.0)
                    LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_0)
                    LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_1)
                    //                        self.loadModeData()
                    self.itemArray.remove(at: index)
                    self.ndbTableView.reloadData()
                }
 
            })
            
        }
    }
    fileprivate func deleteAudio(){
        var  allIsUnSelect = true
        var deleteArray = [JLModel_File]()
        for model in self.itemArray {
            if model.isSelect == true{
                deleteArray.append(model.fileModel)
                allIsUnSelect = false
            }
        }
        if allIsUnSelect == true{
            self.showHud(NSLocalizedString("请选中要删除的文件", comment: ""), duration: 1)
            return
        }
        self.showHudForever()
        JL_Tools.subTask {
            LMCmdManage?.mFileManager.cmdDeleteFileModels(deleteArray)
            JL_Tools.mainTask {
                DFUITools.showText(NSLocalizedString("删除成功", comment: ""), on: self.view, delay: 2.0)
                LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_0)
                LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_1)
                self.hideHud()
                self.loadModeData()
            }
        }
        
    }
}

