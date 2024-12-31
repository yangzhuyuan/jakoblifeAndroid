//
//  LFileManagerController.swift
//  Test001
//
//  Created by GJD on 2024/1/5.
//

import UIKit
import JL_BLEKit
enum JLDeviceMusicVCType{
    case  USB
    case  SDCard
    case  Unknown
}
let  LMCmdManage = LSingleTool.shared.jlCentralManager?.mAssist.mCmdManager

class LFileManagerController: UIViewController {
    fileprivate let kLFileManagerListCell = "LFileManagerListCell"
    
    @IBOutlet weak var tableView: UITableView!
    var reqNum = 0
    var type = JLDeviceMusicVCType.USB
    var devel = JLModel_Device()
    var itemArray = [LFileModel]()
    var    transgerFlag = false //传输音乐的标识
    
 
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(UINib(nibName: "LFileManagerListCell", bundle:nil), forCellReuseIdentifier: kLFileManagerListCell)
        
        devel = LMCmdManage?.outputDeviceModel() ?? JLModel_Device()
        self.type = JLDeviceMusicVCType.SDCard;
        DMusicHandler.shared.delegate = self
        DMusicHandler.shared.nowType = JL_CardType.SD_0
        DMusicHandler.shared.nowEntity =   LMCmdManage?.mEntity
        self.loadModeData()
        
    }
    
    
    
    
    @IBAction func addFileButtonAction(_ sender: Any) {
        if  LSingleTool.shared.readSDType == .music{
            let vc = LLocalYinYueController()
            vc.localYinYueTransBlock = {[weak self] in
                print("文件传输完成")
                LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_0)
                LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_1)
                self?.loadModeData()
                
            }
            self.navigationController?.pushViewController(vc, animated: false)
        }
//        if  LSingleTool.shared.readSDType == .music{
//            let filepath = Bundle.main.path(forResource: "七里香", ofType: "mp3")
//            let  fileModel = LFileModel()
//            fileModel.name = "七里香.mp3"
//            fileModel.path = filepath ?? ""
//            var array  = [LFileModel]()
//            array.append(fileModel)
//            self.sendDataToDevice(dataArray: array)
//        }else if LSingleTool.shared.readSDType == .record{
//            
//        }else if LSingleTool.shared.readSDType == .Ebook{
//            
//        }else if LSingleTool.shared.readSDType == .ePhotos{
//            
//        }

        
    }
    deinit {
        reqNum = 0
        
        
    }
}
extension LFileManagerController{
    
    fileprivate func deleteAudio(index:Int){
        var deleteArray = [JLModel_File]()
        deleteArray.append(self.itemArray[index].fileModel)
        
        JL_Tools.subTask {
            
            LMCmdManage?.mFileManager.cmdDelete(self.itemArray[index].fileModel, isLast: .isNotLast, result: { status, code, data in
                
                if status == .success{
                    JL_Tools.mainTask {
                        print("删除成功")
                        
                        LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_0)
                        LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_1)
                        //                        self.loadModeData()
                        self.itemArray.remove(at: index)
                        self.tableView.reloadData()
                    }
                }else{
                    
                    JL_Tools.mainTask {
                        print("删除失败")
                        
                        self.tableView.reloadData()
                    }
                }
            })
            //            LMCmdManage?.mFileManager.cmdDeleteFileModels(deleteArray)
            //            JL_Tools.mainTask {
            //                DFUITools.showText(NSLocalizedString("删除成功", comment: ""), on: self.view, delay: 2.0)
            //                LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_0)
            //                LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_1)
            //                self.loadModeData()
            //            }
        }
    }
    fileprivate func deleteAudio(){
        var  allIsUnSelect = true
        var deleteArray = [JLModel_File]()
        for model in self.itemArray {
            if model.isSelect == true{
                deleteArray.append(model.fileModel)
            }
        }
        if allIsUnSelect == true{
            print("请选中要删除的文件")
            
            return
        }
        JL_Tools.subTask {
            LMCmdManage?.mFileManager.cmdDeleteFileModels(deleteArray)
            JL_Tools.mainTask {
                print("删除成功")
                
                LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_0)
                LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_1)
                self.loadModeData()
            }
        }
        
    }
    fileprivate func handleFileMonitor(){
        
        LMCmdManage?.mFileManager.cmdBrowseMonitorResult({ array, reason in
            
            for i in 0..<(array?.count ?? 0) {
                let model:JLModel_File = array?[i] as! JLModel_File
                
                print("array\(i)===nae\(model.fileName)")
                if model.fileName.lowercased() == "download"{
                    JL_Tools.mainTask {
                        
                        LMCmdManage?.mFileManager.cmdBrowseModel(model, number: 10, result: nil)
                    }
                    
                }
                
            }
            
            
        })
    }
    
    fileprivate func  firstLoadData(){
        let mCmdManage = LMCmdManage
        let model = mCmdManage?.outputDeviceModel()
        let fileModel = JLModel_File()
        fileModel.fileType = .folder
        fileModel.cardType = .SD_0
        fileModel.fileName  = "SD Card"
        fileModel.folderName  = "SD Card"
        fileModel.fileHandle =   model?.handleSD_0 ?? ""
        fileModel.fileClus = 0
        
        requestWithFile(model: fileModel, number: 20)
        
    }
    
    fileprivate func requestWithFile(model:JLModel_File ,number:Int){
        if model.fileType == JL_BrowseType.file{
            LMCmdManage?.mFileManager.cmdBrowseModel(model, number: 1, result: nil)
            
        }else{
            print("requestWith======JL_BrowseTypeFile==,\(model.fileType)");
            if reqNum > 0{
                print("取消请求1111-----,==\(model.fileName)")
                return
            }
            reqNum = number
            self.requestWithFile(model: model)
            print("======\(model.fileName)")
            
        }
    }
    fileprivate func requestWithFile(model:JLModel_File){
        let mCmdManage = LMCmdManage
        mCmdManage?.mFileManager.cmdBrowseModel(model, number: 10, result: { status, sn, data in
            //            print("status===\(status)")
            //            print("sn===\(sn)")
            //            print("data===\(data)")
        })
    }
    //从设备获取文件
    fileprivate func  loadModeData(){
        
        
        let suportArray = self.devel.cardArray
        print("1111-----suportArray===\(suportArray)")
        if suportArray.count > 0{
            DMusicHandler.shared.loadModeData(JL_CardType.SD_0)
            //            switch self.type {
            //            case .USB:
            //                DMusicHandler.shared.loadModeData(.USB)
            //                break
            //            case .SDCard:
            //                if suportArray.contains(JL_CardType.SD_0){
            //
            //                    DMusicHandler.shared.loadModeData(JL_CardType.SD_0)
            //                }else if  suportArray.contains(JL_CardType.SD_1){
            //                    DMusicHandler.shared.loadModeData(JL_CardType.SD_1)
            //                }
            //                break
            //            default:
            //                DMusicHandler.shared.loadModeData(JL_CardType.SD_0)
            //            }
        }
        
    }
    
    
   
    fileprivate func sendDataToDevice(dataArray:[LFileModel]){
        let sendProgressPopView = LTransAudioPopView.L_loadFromNib()
        sendProgressPopView.frame = CGRectMake(0, 0, kScreenWidth, kScreenHeight)
        UIApplication.shared.keyWindow?.addSubview(sendProgressPopView)
        for i in 0..<dataArray.count {
            if(transgerFlag == true){
                return
            }
           
            let tempString = (i + 1).description + "/" + dataArray.count.description
            sendProgressPopView.titleLabel.text =  "正在传输"   + "(" + tempString + ")"
            
            transgerFlag = true
            let fileModel = dataArray[i]
             sendProgressPopView.nameLabel.text = fileModel.fileModel.fileName
            let path = fileModel.path
            
//            if  LSingleTool.shared.readSDType == .music{
//                let filepath = Bundle.main.path(forResource: "七里香", ofType: "mp3")
//            }else if LSingleTool.shared.readSDType == .record{
//                
//            }else if LSingleTool.shared.readSDType == .Ebook{
//                
//            }else if LSingleTool.shared.readSDType == .ePhotos{
//                
//            }
 
                
            
          
            guard let fManager = LMCmdManage?.mFileManager  else { return }
            
            fManager.setCurrentFileHandleType(.SD_0)
            fManager.cmdPreEnvironment( .bigFileTransmission) { status, sn, data in
                fManager.cmdBigFileData(path  , withFileName: fileModel.fileModel.fileName) { resultType, progress in
                    if resultType == .transferStart{//开始大文件数据传输
                        print("开始大文件数据传输")
                        sendProgressPopView.perLabel.text = "0.0%"
                        sendProgressPopView.progressView.setProgress( 0.0, animated: false)
                    }
                    if resultType == .transferDownload{//传输大文件有效数据
                        print("传输大文件有效数据")
//                        let floatValue: Float = 3.14159
                        
                        let formattedString = String(format: "%.1f", progress * 100.0)
                         
                        sendProgressPopView.perLabel.text = formattedString + "%"
                        print("传输progress==\(progress)")
                        let temp =  L_roundToSingleDigit(progress * 100.0)
                        print("传输progress=temp=\(temp)")
                        sendProgressPopView.progressView.setProgress(temp, animated: false)
                        
                    }
                    if  resultType == .transferEnd{//结束大文件数据传输
                        print("结束大文件数据传输")
                        self.transgerFlag = false
                        
                        var  tempArray = [LFileModel]()
                        tempArray = dataArray
                        tempArray.remove(at: i)
                        if tempArray.count > 0{
                            JL_Tools.delay(1) {
                                self.sendDataToDevice(dataArray: tempArray)
                            }
                        }else{
//                            self.localYinYueTransBlock?()
                                sendProgressPopView.removeFromSuperview()
                            print("传输完成")
//                            DFUITools.showText(NSLocalizedString("传输完成", comment: ""), on: self.view, delay: 2.0)
                            let delayInSeconds: Double = 2.0
                            let dispatchTime = DispatchTime.now() + delayInSeconds
                            self.navigationController?.popViewController(animated: false)
//                            DispatchQueue.global().asyncAfter(deadline: dispatchTime) {
//                                // 在这里执行你想要延迟执行的任务
//
//                            }
                          
                        }
                      
                    }
                    if  resultType == .transferOutOfRange{//文件传输数据越界
                         sendProgressPopView.removeFromSuperview()
                        print("文件传输数据越界")
                     
                    }
                    if  resultType == .transferFail{//文件传输失败
                         sendProgressPopView.removeFromSuperview()
                        
                        print("文件传输失败")
                    }
                    if  resultType == .crcError{//文件校验失败
                        sendProgressPopView.removeFromSuperview()
                        print("文件校验失败")
                        
                    }
                    if  resultType == .outOfMemory{//设备没有空间
                        sendProgressPopView.removeFromSuperview()
                        print("设备没有空间")
                        
                    }
                    if  resultType == .transferNoResponse{//设备响应超时
                        sendProgressPopView.removeFromSuperview()
                        print("设备响应超时")
                         
                    }
                    if  resultType == .transferCancel{//传输取消
                        sendProgressPopView.removeFromSuperview()
                        print("传输取消")
                      
                    }
                }
            }
        }
     
    }


}
extension LFileManagerController:DMHandlerDelegate{
    
    func dmHandle(withTabTitleArray modelA: [JLModel_File]) {
        //        for i in 0..<modelA.count {
        //            let model = modelA[i]
        //            print("modelA==\(i)==\(model.fileName)")
        //        }
        //        titleArray = modelA;
    }
    
    func dmHandle(withItemModelArray modelB: [JLModel_File]) {
        for i in 0..<modelB.count {
            let model = modelB[i]
            print("modelB==\(i)==\(model.fileName)")
            if LSingleTool.shared.readSDType == .record{
                if model.fileName  == "JL_REC" {
                    JL_Tools.mainTask {
                        DMusicHandler.shared.requestWith(model, number: 10086)
                    }
                }
                
                
            } else if LSingleTool.shared.readSDType == .music{
                if model.fileName.lowercased() == "download" {
                    JL_Tools.mainTask {
                        DMusicHandler.shared.requestWith(model, number: 10086)
                    }
                }
            }
            
        }
        JL_Tools.mainTask {
            var finalArray = [JLModel_File]()
            for i in 0..<modelB.count{
                let model  = modelB[i]
                print("model.fileName==\(model.fileName)")
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
            
            self.tableView.reloadData()
        }
    }
    
    func dmHandleWithPlayItemOK() {
        
    }
    
    func dmLoadFailed(_ err: DM_ERROR) {
        
    }
    
    func dmCardMessageDismiss(_ nowArray: [Any]) {
        for i in 0..<nowArray.count {
            
            
        }
    }
    
}
extension LFileManagerController:UITableViewDelegate,UITableViewDataSource{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return itemArray.count
    }
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: kLFileManagerListCell, for: indexPath) as! LFileManagerListCell
        let model = self.itemArray[indexPath.row]
        cell.fileNameLabel.text = model.fileModel.fileName
        return cell
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if LSingleTool.shared.readSDType == .record{
            let vc = LRecordDesController()
            vc.recordModel = self.itemArray[indexPath.row]
            self.navigationController?.pushViewController(vc, animated: false)
        }
    }
    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
 
 
        let  deleteAction = UIContextualAction(style: UIContextualAction.Style.destructive, title: "删除") { [weak self](acction:UIContextualAction, view:UIView, handle:@escaping (Bool) -> Void) in
            self?.deleteAudio(index: indexPath.row)
        }
        let configuration =  UISwipeActionsConfiguration(actions: [ deleteAction])
        configuration.performsFirstActionWithFullSwipe = false
        return configuration
    }
    
}
