//
//  LYinyueController.swift
//  LifeFit
//
//  Created by GJD on 2023/7/20.
//  Copyright © 2023 wujunjie. All rights reserved.
//


enum YinYueListStatusType{
    case  normal
    case  deleteSelect
    
}

import UIKit
import TZImagePickerController
import Photos
import DFUnits
import RealSDK
//let  LMCmdManage = LSingleTool.shared.jlCentralManager?.mAssist.mCmdManager

class LYinyueController: UIViewController,DMHandlerDelegate {
    fileprivate let kLFileManagerListCell = "LFileManagerListCell"
    ///判断是录音文件还是音频文件
    var isRec = false
    var isEbook = false
    
    var fileType = ReadSDCardType.music
    fileprivate let kLYinyueListHeaderView = "LYinyueListHeaderView"
    fileprivate let kLYinyueEmptyCell = "LYinyueEmptyCell"
    fileprivate let kLYinyueDevicesCell = "LYinyueDevicesCell"
    @IBOutlet weak var naviHeightConst: NSLayoutConstraint!
    
    
    @IBOutlet weak var ndbTableView: UITableView!
    
    @IBOutlet weak var naviTitleLabel: UILabel!
    
    @IBOutlet weak var addButton: UIButton!
    var reqNum = 0
    var type = JLDeviceMusicVCType.USB
    var devel = JLModel_Device()
    var itemArray = [LFileModel]()
    var statusType = YinYueListStatusType.normal
    var isAllIsSelect = false
    
    
    var    transgerFlag = false //传输音乐的标识
    var imagePicker: TZImagePickerController!
    var maxNumNameString = ""
    
    fileprivate lazy var sendProgressPopView : LTransAudioPopView = {
        let view = LTransAudioPopView.L_loadFromNib()
        view.frame = CGRectMake(0, 0, kScreenWidth, kScreenHeight)
        //        view.deleteAudioPopViewBlock = {  [weak self] in
        //            self?.deleteAudio()
        //        }
        view.transAudioPopViewCancelBlcok = {[weak self] in
            
            LMCmdManage?.mFileManager.cmdStopBigFileData()
            
        }
        return view
    }()
    fileprivate lazy var popImageView : BigImageView = {
        let view = BigImageView.L_loadFromNib()
        view.frame = CGRectMake(0, 0, kScreenWidth, kScreenHeight)
        
        
        return view
    }()
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        if self.fileType == .ePhotos {
            naviTitleLabel.text = NSLocalizedString("电子相册", comment: "")
        }else{
            if self.isEbook == true{
                naviTitleLabel.text = NSLocalizedString("电子书", comment: "")
            }else{
                naviTitleLabel.text = NSLocalizedString("音乐", comment: "")
            }
        }
        
        ndbTableView.delegate = self
        ndbTableView.dataSource = self
        ndbTableView.sectionHeaderHeight = 50
        ndbTableView.rowHeight = kScreenHeight
        
        ndbTableView.register(UINib(nibName: "LFileManagerListCell", bundle: nil), forCellReuseIdentifier: kLFileManagerListCell)
        
        
        ndbTableView.showsVerticalScrollIndicator = false
        ndbTableView.separatorStyle = .none
        
        addButton.layer.cornerRadius = 10
        
        
        if self.fileType == .ePhotos {
            addButton.setTitle(NSLocalizedString("添加照片", comment: ""), for: .normal)
        }else{
            if self.isEbook == true{
                addButton.setTitle(NSLocalizedString("添加电子书", comment: ""), for: .normal)
            }else{
                addButton.setTitle(NSLocalizedString("添加音乐", comment: ""), for: .normal)
            }
        }
        
        
        //
        //        handleFileMonitor()
        //        firstLoadData()
        devel = LMCmdManage?.outputDeviceModel() ?? JLModel_Device()
        self.type = JLDeviceMusicVCType.SDCard;
        DMusicHandler.shared.delegate = self
        DMusicHandler.shared.nowType = JL_CardType.SD_0
        DMusicHandler.shared.nowEntity =   LMCmdManage?.mEntity
        
        
        
        loadModeData()
        
        if self.fileType == .ePhotos{
            createPhotoFolderIfNotExists()
        }
        
    }
    
    
    
    @IBAction func backAction(_ sender: Any) {
        self.navigationController?.popViewController(animated: false)
    }
    
    @IBAction func addButtonAction(_ sender: UIButton) {
        if self.fileType == .ePhotos{
            if self.statusType == .deleteSelect{
                self.deleteAudio()
            }else{
                
                self.setUpPhotos()
                
            }
        }else{
            let vc = LLocalYinYueController()
            vc.localYinYueTransBlock = {[weak self] in
                print("文件传输完成")
                LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_0)
                LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_1)
                self?.loadModeData()
                
            }
            self.navigationController?.pushViewController(vc, animated: false)
            //            if self.statusType == .deleteSelect{
            //                self.deleteAudio()
            //            }else{
            //
            //
            ////                let vc = LLocalYinYueController()
            ////                vc.isEbook = self.isEbook
            ////                vc.localYinYueTransBlock = {[weak self] in
            ////                    print("文件传输完成")
            ////                    LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_0)
            ////                    LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_1)
            ////                    self?.loadModeData()
            ////
            ////                }
            ////                self.navigationController?.pushViewController(vc, animated: false)
            //
            //            }
        }
        
        
        
        
        
    }
    
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
            if self.isRec == true{
                if model.fileName  == "JL_REC" {
                    JL_Tools.mainTask {
                        DMusicHandler.shared.requestWith(model, number: 10086)
                    }
                }
                
                
            }else{
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
            
            self.ndbTableView.reloadData()
        }
    }
    
    func dmHandleWithPlayItemOK() {
        
    }
    
    func dmLoadFailed(_ err: DM_ERROR) {
        
    }
    
    func dmCardMessageDismiss(_ nowArray: [Any]) {
        for i in 0..<nowArray.count {
            
            //            let model = nowArray[i]
            //            print("nowArray==\(i)==\(model.fileName)")
        }
    }
    deinit {
        reqNum = 0
        print("LYinyueController释放了")
        
        //        self.recognitionTask.cancel()
        //        self.recognitionTask = nil
    }
}


extension LYinyueController:UITableViewDataSource,UITableViewDelegate{
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return    itemArray.count
    }
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return     50
    }
    
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell  = tableView.dequeueReusableCell(withIdentifier: kLFileManagerListCell, for: indexPath) as!  LFileManagerListCell
        
        let model = self.itemArray[indexPath.row]
        //            if self.isRec == true{
        //                cell.transButton.isHidden = false
        //            }else{
        //                cell.transButton.isHidden = true
        //            }
        //            cell.indexRow = indexPath.row
        //            cell.statusType = self.statusType
        //            cell.audioModel = model
        //            cell.yinyueDevicesCellBlock = {[weak self](indexRow,audioModel) in
        //                self?.itemArray[indexRow] = audioModel
        //
        //                let result = self?.checkOutIsAllIsSelect()
        //                if result == true{ //全部选中
        //                    self?.isAllIsSelect = true
        //                }else{//不是全选
        //                    self?.isAllIsSelect = false
        //                }
        //                self?.ndbTableView.reloadData()
        //            }
        cell.fileNameLabel.text = model.fileModel.fileName
        return cell
        
        
        
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if self.fileType == .ePhotos{
            let model = self.itemArray[indexPath.item]
            redImageFromDocument(fileModel: model)
        }
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
            //            self?.deleteOrder(by: indexPath.section)
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
}
extension LYinyueController{
    
    fileprivate func deleteAudio(index:Int){
        var deleteArray = [JLModel_File]()
        deleteArray.append(self.itemArray[index].fileModel)
        
        JL_Tools.subTask {
            
            LMCmdManage?.mFileManager.cmdDelete(self.itemArray[index].fileModel, isLast: .isNotLast, result: { status, code, data in
                
                if status == .success{
                    JL_Tools.mainTask {
                        
                        DFUITools.showText(NSLocalizedString("删除成功", comment: ""), on: self.view, delay: 2.0)
                        LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_0)
                        LMCmdManage?.mFileManager.cmdCleanCacheType(.SD_1)
                        //                        self.loadModeData()
                        self.itemArray.remove(at: index)
                        self.ndbTableView.reloadData()
                    }
                }else{
                    
                    JL_Tools.mainTask {
                        DFUITools.showText(NSLocalizedString("删除失败", comment: ""), on: self.view, delay: 2.0)
                        self.ndbTableView.reloadData()
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
            self.showHud(NSLocalizedString("请选中要删除的文件", comment: ""), duration: 1)
            return
        }
        JL_Tools.subTask {
            LMCmdManage?.mFileManager.cmdDeleteFileModels(deleteArray)
            JL_Tools.mainTask {
                DFUITools.showText(NSLocalizedString("删除成功", comment: ""), on: self.view, delay: 2.0)
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
        
        let mCmdManage = LSingleTool.shared.jlCentralManager?.mAssist.mCmdManager
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
    //从设备获取音乐
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
}

///相册
extension LYinyueController:UIImagePickerControllerDelegate, UINavigationControllerDelegate, TZImagePickerControllerDelegate{
    
    fileprivate func setUpPhotos(){
        getMaxNumberName()
        imagePicker = TZImagePickerController.init(maxImagesCount: 1, delegate: self)
        //TODO: fixed bug
        imagePicker.sortAscendingByModificationDate = false
        imagePicker.allowPickingVideo = false
        imagePicker.allowPickingOriginalPhoto = false
        imagePicker.delegate = self
        //        [imagePicker.navigationBar setBackgroundImage:[UIImage createImageWithColor:LAUIMainColor] forBarMetrics:UIBarMetricsDefault]
        imagePicker.modalPresentationStyle = .fullScreen
        
        imagePicker.allowCrop = true
        
        imagePicker.cropRect = CGRect.init(x: kScreenWidth/2 - CGFloat(bleSelf.bleModel.width)/2, y: kScreenHeight/2 - CGFloat(bleSelf.bleModel.height)/2, width: CGFloat(bleSelf.bleModel.width), height: CGFloat(bleSelf.bleModel.height))
        self.present(self.imagePicker, animated: true, completion: nil)
    }
    ///创建相册文件夹
    func createPhotoFolderIfNotExists() {
        let fileManager = FileManager.default
        let documentsDirectory = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
        let photoFolderURL = documentsDirectory.appendingPathComponent("photo")
        
        if !fileManager.fileExists(atPath: photoFolderURL.path) {
            do {
                try fileManager.createDirectory(at: photoFolderURL, withIntermediateDirectories: true, attributes: nil)
            } catch {
                print("Error creating 'photo' folder: \(error)")
            }
        }
    }
    func tz_imagePickerControllerDidCancel(_ picker: TZImagePickerController!) {
        picker.dismiss(animated: true, completion: nil)
    }
    
    func imagePickerController(_ picker: TZImagePickerController!, didFinishPickingPhotos photos: [UIImage]!, sourceAssets assets: [Any]!, isSelectOriginalPhoto: Bool, infos: [[AnyHashable : Any]]!) {
        picker.dismiss(animated: true, completion: nil)
        print("photos==\(photos)")
        
        var audioArray = [LFileModel]()
        
        guard let  image =  self.resizeImage(image: photos[0], targetSize: CGSize(width: 128, height: 160)) else { return  }
        
        let  fileName =   saveImageToLocal(image: image)
        let audioModel = LFileModel()
        audioModel.name = fileName ?? ""
        var fileSize: CGFloat = 0
        if let path = DFFile.listPath(.documentDirectory, middlePath: "photo", file: fileName) {
            print("path==\(path)")
            do {
                let fileAttributes = try FileManager.default.attributesOfItem(atPath: path)
                if let fileSizeNumber = fileAttributes[.size] as? NSNumber {
                    fileSize = CGFloat(fileSizeNumber.floatValue)
                }
            } catch {
                print("Error getting file attributes: \(error.localizedDescription)")
            }
        }
        audioModel.size =  L_convertFileSize(fileSize)
        audioModel.index = "0"
        audioModel.path = fileName ?? ""
        print("audioModel.path==\(audioModel.path)")
        audioArray.append(audioModel)
        self.sendDataToDevice(dataArray: audioArray)
    }
    //存储数据到本地
    func saveImageToLocal(image: UIImage) -> String? {
        guard let data = image.jpegData(compressionQuality: 0.8) else {
            return nil
        }
        
        let fileManager = FileManager.default
        let documentsDirectory = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
        
        let photoFolderURL = documentsDirectory.appendingPathComponent("photo")
        print("maxNumNameString==\(maxNumNameString)")
        let fileName = maxNumNameString
        let fileURL =  photoFolderURL.appendingPathComponent("\(fileName).jpg")
        
        do {
            try data.write(to: fileURL)
            
            return fileURL.lastPathComponent
        } catch {
            
            return nil
        }
    }
    //压缩图片到指定的尺寸
    func resizeImage(image: UIImage, targetSize: CGSize) -> UIImage? {
        let size = image.size
        
        // 计算缩小比例
        let widthRatio  = targetSize.width  / size.width
        let heightRatio = targetSize.height / size.height
        let scaleFactor = min(widthRatio, heightRatio)
        
        // 计算缩小后的大小
        let scaledWidth  = size.width * scaleFactor
        let scaledHeight = size.height * scaleFactor
        
        // 创建一个新的图形上下文
        UIGraphicsBeginImageContextWithOptions(CGSize(width: scaledWidth, height: scaledHeight), false, 0.0)
        
        // 在新的图形上下文中绘制缩小后的图像
        image.draw(in: CGRect(x: 0, y: 0, width: scaledWidth, height: scaledHeight))
        
        // 从图形上下文中获取缩小后的图像
        let scaledImage = UIGraphicsGetImageFromCurrentImageContext()
        
        // 关闭图形上下文
        UIGraphicsEndImageContext()
        
        return scaledImage
    }
    fileprivate func sendDataToDevice(dataArray:[LFileModel]){
        for i in 0..<dataArray.count {
            if(transgerFlag == true){
                return
            }
            //            let tempString = (self.selectArray.count - dataArray.count + 1).description + "/" + self.selectArray.count.description
            let tempString = "1/1"
            sendProgressPopView.titleLabel.text = NSLocalizedString("正在传输", comment: "")  + "(" + tempString + ")"
            
            transgerFlag = true
            let audioModel = dataArray[i]
            self.sendProgressPopView.nameLabel.text = audioModel.name
            var path = ""
            
            path = DFFile.listPath(.documentDirectory, middlePath: "photo", file: audioModel.path)
            
            
            
            
            guard let fManager = LSingleTool.shared.jlCentralManager?.mAssist.mCmdManager.mFileManager else { return }
            fManager.setCurrentFileHandleType(.SD_0)
            fManager.cmdPreEnvironment( .bigFileTransmission) { status, sn, data in
                fManager.cmdBigFileData(path  , withFileName: audioModel.name) { resultType, progress in
                    if resultType == .transferStart{//开始大文件数据传输
                        print("开始大文件数据传输")
                        self.sendProgressPopView.perLabel.text = "0.0%"
                        self.sendProgressPopView.progressView.setProgress( 0.0, animated: false)
                    }
                    if resultType == .transferDownload{//传输大文件有效数据
                        print("传输大文件有效数据")
                        //                        let floatValue: Float = 3.14159
                        
                        let formattedString = String(format: "%.1f", progress * 100.0)
                        
                        self.sendProgressPopView.perLabel.text = formattedString + "%"
                        print("传输progress==\(progress)")
                        let temp = L_roundToSingleDigit(progress * 100.0)
                        print("传输progress=temp=\(temp)")
                        self.sendProgressPopView.progressView.setProgress(L_roundToSingleDigit(progress ), animated: false)
                        
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
                            self.sendProgressPopView.removeFromSuperview()
                            DFUITools.showText(NSLocalizedString("传输完成", comment: ""), on: self.view, delay: 2.0)
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
                        self.sendProgressPopView.removeFromSuperview()
                        print("文件传输数据越界")
                        DFUITools.showText(NSLocalizedString("文件传输数据越界", comment: ""), on: self.view, delay: 2.0)
                    }
                    if  resultType == .transferFail{//文件传输失败
                        self.sendProgressPopView.removeFromSuperview()
                        DFUITools.showText(NSLocalizedString("文件传输失败", comment: ""), on: self.view, delay: 2.0)
                        print("文件传输失败")
                    }
                    if  resultType == .crcError{//文件校验失败
                        self.sendProgressPopView.removeFromSuperview()
                        print("文件校验失败")
                        DFUITools.showText(NSLocalizedString("文件校验失败", comment: ""), on: self.view, delay: 2.0)
                    }
                    if  resultType == .outOfMemory{//设备没有空间
                        self.sendProgressPopView.removeFromSuperview()
                        print("设备没有空间")
                        DFUITools.showText(NSLocalizedString("设备没有空间", comment: ""), on: self.view, delay: 2.0)
                    }
                    if  resultType == .transferNoResponse{//设备响应超时
                        self.sendProgressPopView.removeFromSuperview()
                        print("设备响应超时")
                        DFUITools.showText(NSLocalizedString("设备响应超时", comment: ""), on: self.view, delay: 2.0)
                    }
                    if  resultType == .transferCancel{//传输取消
                        self.sendProgressPopView.removeFromSuperview()
                        print("传输取消")
                        DFUITools.showText(NSLocalizedString("传输取消", comment: ""), on: self.view, delay: 2.0)
                    }
                }
            }
        }
        
    }
    fileprivate func getMaxNumberName() {
        
        
        let stringArray = itemArray.map { $0.fileModel.fileName }
        print(stringArray)
        // 使用正则表达式提取每个字符串中的三位数
        
        // 去掉前三个字符和后四个字符，转换为整数
        if stringArray.count > 0{
            let numbersArray = stringArray.compactMap { str -> Int? in
                let startIndex = str.index(str.startIndex, offsetBy: 3)
                let endIndex = str.index(str.endIndex, offsetBy: -4)
                
                let trimmedStr = str[startIndex..<endIndex]
                
                return Int(trimmedStr)
            }
            
            // 获取最大值
            if let maxNumber = numbersArray.max() {
                print("最大的数字是: \(maxNumber)")
                if maxNumber < 8{
                    maxNumNameString = "pre00" +  (maxNumber + 1).description
                }else if  maxNumber > 98{
                    maxNumNameString =  "pre"  + (maxNumber + 1).description
                }else{
                    maxNumNameString = "pre0" +  (maxNumber + 1).description
                }
            } else {
                print("没有找到数字")
            }
        }else{
            maxNumNameString = "pre001"
        }
        
    }
    
    
    
}


extension LYinyueController{
    fileprivate func redImageFromDocument(fileModel:LFileModel){
        
        let lowercaseString = fileModel.fileModel.fileName.lowercased()
        let path = DFFile.listPath(.documentDirectory, middlePath: "photo", file: lowercaseString)
        print("path==\(path)")
        
        //        let documentFolder = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        //        let photosFolder = documentFolder.appendingPathComponent("photos")
        //        let imageName = "pre001.jpg"
        //        let imagePath = photosFolder.appendingPathComponent(imageName)
        //
        if FileManager.default.fileExists(atPath: path ?? "") {
            
            if let image = UIImage(contentsOfFile: path ?? "") {
                
                let imageView = UIImageView(image: image)
                
                popImageView.bigImage = image
                UIApplication.shared.keyWindow?.addSubview(popImageView)
                
            }
        } else {
            
            self.dealRecordData(fileModel:fileModel)
        }
        
        
    }
    
    fileprivate func dealRecordData(fileModel:LFileModel){
        var mData = Data();
        LMCmdManage?.mFileManager.setCurrentFileHandleType(.SD_0)
        LMCmdManage?.mFileManager.cmdFileReadContent(withFileClus: fileModel.fileModel.fileClus, result: { result, size, data, progress in
            
            if result == .start{
                self.showHudForever()
                print("读取文件开始")
            }else if result == .reading{
                print("读取文件Reading==\(progress)")
                if (data?.count ?? 0) > 0{
                    mData.append(data ?? Data())
                }
            }else if result == .end{
                print("读取文件结束")
                self.hideHud()
                if (  mData.count < 40) {
                    return;
                }
                
                
                let path =  DFFile.create(on: .documentDirectory, middlePath: "photo", file: fileModel.fileModel.fileName.lowercased())
                let isSuccess = self.saveNSDataToFile(data: mData as NSData, filePath: path ?? "")
                if isSuccess == true{
                    print("存入成功")
                    
                }else{
                    print("存入失败")
                    self.showHud(NSLocalizedString("失败", comment: ""), duration: 2.0)
                }
            }else if result == .cancel{
                print("读取文件取消")
                self.showHud(NSLocalizedString("已取消", comment: ""), duration: 2.0)
            }else if result == .fail{
                print("读取文件失败")
                self.showHud(NSLocalizedString("失败", comment: ""), duration: 2.0)
            }else if result == .null{
                print("读取文件文件为空")
                self.showHud(NSLocalizedString("失败", comment: ""), duration: 2.0)
            }else if result == .dataError{
                print("读取文件 数据出错")
                self.showHud(NSLocalizedString("失败", comment: ""), duration: 2.0)
            }
        })
    }
    
    func saveNSDataToFile(data: NSData, filePath: String) -> Bool {
        do {
            try data.write(toFile: filePath, options: .atomic)
            return true
        } catch {
            print("Error saving NSData to file: \(error.localizedDescription)")
            return false
        }
    }
    
}
