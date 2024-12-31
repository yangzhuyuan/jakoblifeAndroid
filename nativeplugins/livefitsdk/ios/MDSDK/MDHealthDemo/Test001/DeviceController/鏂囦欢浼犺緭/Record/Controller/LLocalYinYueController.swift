//
//  LLocalYinYueController.swift
//  LifeFit
//
//  Created by GJD on 2023/7/21.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit
import RealSDK
import DFUnits
import MobileCoreServices
class LLocalYinYueController: UIViewController {
    
    fileprivate let kLYinyueListCell = "LYinyueListCell"
    
    @IBOutlet weak var naviHeightConst: NSLayoutConstraint!
    
    
    @IBOutlet weak var ndbTableView: UITableView!
    
    @IBOutlet weak var naviTitleLabel: UILabel!
    
    @IBOutlet weak var addButton: UIButton!
    
    @IBOutlet weak var deletaButton: UIButton!
    
    @IBOutlet weak var bottomToolView: UIView!
    var dataArray = [LFileModel]()
    var    transgerFlag = false //传输音乐的标识
    // 选中数据的数组
    var selectArray = [LFileModel]()
    
    
    var  localYinYueTransBlock:(() -> ())?
 
    fileprivate lazy var sendProgressPopView : LTransAudioPopView = {
        let view = LTransAudioPopView.L_loadFromNib()
        view.frame = CGRectMake(0, 0, kScreenWidth, kScreenHeight)
        
        
        return view
    }()
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        
        
        ndbTableView.delegate = self
        ndbTableView.dataSource = self
        ndbTableView.sectionHeaderHeight = 50
        
        
        ndbTableView.register(UINib(nibName: "LYinyueListCell", bundle: nil), forCellReuseIdentifier: kLYinyueListCell)
        
        ndbTableView.showsVerticalScrollIndicator = false
        ndbTableView.separatorStyle = .none
        
        addButton.setTitle(NSLocalizedString("添加", comment: ""), for: .normal)
        deletaButton.setTitle(NSLocalizedString("删除", comment: ""), for: .normal)
        self.getMusicList()
        
    }
    
    @IBAction func deletaButtonAction(_ sender: UIButton) {
        var isHasSelect = false
        for model in self.dataArray.reversed() {
            if model.isSelect == true{
                isHasSelect = true
                break
            }
            
        }
        
        
        
    }
    
    @IBAction func addButtonAction(_ sender: UIButton) {
        
        self.selectArray.removeAll()
        for model in self.dataArray {
            if model.isSelect == true{
                self.selectArray.append(model)
            }
        }
        if  self.selectArray.count == 0{
            self.showHud("请选择要添加的文件", duration: 2.0)
        }else{
            UIApplication.shared.keyWindow?.addSubview(sendProgressPopView)
            let tempString = "1/" + self.selectArray.count.description
            sendProgressPopView.titleLabel.text = NSLocalizedString("正在传输", comment: "")  + "(" + tempString + ")"
            self.sendDataToDevice(dataArray: self.selectArray)
        }
        
        
    }
    
    
    fileprivate func sendDataToDevice(dataArray:[LFileModel]){
        for i in 0..<dataArray.count {
            if(transgerFlag == true){
                return
            }
            let tempString = (self.selectArray.count - dataArray.count + 1).description + "/" + self.selectArray.count.description
            sendProgressPopView.titleLabel.text = NSLocalizedString("正在传输", comment: "")  + "(" + tempString + ")"
            
            transgerFlag = true
            let audioModel = dataArray[i]
            self.sendProgressPopView.nameLabel.text = audioModel.name
            var path = ""
            if  LSingleTool.shared.readSDType == .Ebook{
                path = DFFile.listPath(.documentDirectory, middlePath: "music", file: audioModel.path)
            }else if  LSingleTool.shared.readSDType == .music{
                path = DFFile.listPath(.documentDirectory, middlePath: "music", file: audioModel.path)
            }
            
            print("path=====\(path)")
            guard let fManager = LMCmdManage?.mFileManager  else { return }
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
                        let temp = self.L_roundToSingleDigit(progress * 100.0)
                        print("传输progress=temp=\(temp)")
                        //                        self.sendProgressPopView.progressView.setProgress(L_roundToSingleDigit(progress ), animated: false)
                        
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
                            self.localYinYueTransBlock?()
                            self.sendProgressPopView.removeFromSuperview()
                            DFUITools.showText(NSLocalizedString("传输完成", comment: ""), on: self.view, delay: 2.0)
                            let delayInSeconds: Double = 2.0
                            let dispatchTime = DispatchTime.now() + delayInSeconds
                            self.navigationController?.popViewController(animated: false)
                         
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
    @IBAction func loadYinYueFromFileAction(_ sender: UIButton) {
        if  LSingleTool.shared.readSDType == .Ebook{
            //                let documentTypes = [String(kUTTypeAudio)]
            let documentPicker = UIDocumentPickerViewController(documentTypes: ["public.text"], in: .import)
            documentPicker.delegate = self
            documentPicker.modalPresentationStyle = .fullScreen
            self.present(documentPicker, animated: true, completion: nil)
            
        }else{
            let documentTypes = [String(kUTTypeAudio)]
            let documentPicker = UIDocumentPickerViewController(documentTypes: documentTypes, in: .import)
            documentPicker.delegate = self
            documentPicker.modalPresentationStyle = .fullScreen
            self.present(documentPicker, animated: true, completion: nil)
            
        }
        
        
    }
    @IBAction func backAction(_ sender: Any) {
        self.navigationController?.popViewController(animated: false)
    }
    fileprivate func cancelTransAction(){
        if transgerFlag == true{
            transgerFlag = false
            LMCmdManage?.mFileManager.cmdStopBigFileData()
        }
        
    }
    
    
    func getMusicList() {
        if  LSingleTool.shared.readSDType == .Ebook{
            
            guard let docPath = DFFile.listPath(.documentDirectory, middlePath: "music", file: nil) else {
                print("Error getting document path.")
                return
            }
            
            print("docPath==\(docPath)")
            var tempArray = [String]()
            tempArray = DFFile.subPaths(docPath) as? [String] ?? [String]()
            self.dataArray.removeAll()
            for i in 0..<tempArray.count {
                let indexString = tempArray[i]
                let array = indexString.components(separatedBy: "-")
                let audioModel = LFileModel()
                if array.count > 1 {
                    audioModel.name = array[1]
                    
                } else {
                    audioModel.name = indexString
                }
                var fileSize: CGFloat = 0
                if let path = DFFile.listPath(.documentDirectory, middlePath: "music", file: indexString) {
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
                audioModel.index = (i + 1).description
                audioModel.path = indexString
                audioModel.isSelect = false
                dataArray.append(audioModel)
            }
            dataArray = dataArray.filter { $0.name.hasSuffix(".txt") }
            if dataArray.count > 0 {
                ndbTableView.reloadData()
                self.bottomToolView.isHidden = false
            }else{
                ndbTableView.reloadData()
                self.bottomToolView.isHidden = true
                
                
            }
        }else{
            
            guard let docPath = DFFile.listPath(.documentDirectory, middlePath: "music", file: nil) else {
                print("Error getting document path.")
                return
            }
            
            print("docPath==\(docPath)")
            var tempArray = [String]()
            tempArray = DFFile.subPaths(docPath) as? [String] ?? [String]()
            
            
            
            self.dataArray.removeAll()
            for i in 0..<tempArray.count {
                let indexString = tempArray[i]
                //                print("indexString==\(indexString)")
                //                let array = indexString.components(separatedBy: "-")
                let audioModel = LFileModel()
                //                if array.count > 1 {
                //                    audioModel.name = array[1]
                //
                //                } else {
                //                    audioModel.name = indexString
                //                }
                audioModel.name = indexString
                var fileSize: CGFloat = 0
                if let path = DFFile.listPath(.documentDirectory, middlePath: "music", file: indexString) {
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
                audioModel.index = (i + 1).description
                audioModel.path = indexString
                audioModel.isSelect = false
                dataArray.append(audioModel)
            }
            
            
            dataArray = dataArray.filter { $0.name.hasSuffix(".mp3") }
            
            if dataArray.count > 0 {
                ndbTableView.reloadData()
                self.bottomToolView.isHidden = false
            }else{
                ndbTableView.reloadData()
                self.bottomToolView.isHidden = true
                
                
            }
        }
        
        
        
        
    }
    fileprivate func deleteAudio(){
        
        if  LSingleTool.shared.readSDType == .Ebook{
            for model in self.dataArray.reversed() {//
                if model.isSelect == true{
                    if let path = DFFile.listPath(.documentDirectory, middlePath: "music", file: model.path){
                        let result =  DFFile.removePath(path)
                        if result == true{
                            
                        }else{
                            
                        }
                        
                    }
                }
                
            }
        }else{
            for model in self.dataArray.reversed() {
                if model.isSelect == true{
                    if let path = DFFile.listPath(.documentDirectory, middlePath: "music", file: model.path){
                        let result =  DFFile.removePath(path)
                        if result == true{
                            
                        }else{
                            
                        }
                        
                    }
                }
                
            }
        }
        
        self.getMusicList()
    }
}
extension LLocalYinYueController:UITableViewDataSource,UITableViewDelegate,UIDocumentPickerDelegate{
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return  dataArray.count == 0 ? kScreenHeight :  50
    }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return    dataArray.count
    }
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell  = tableView.dequeueReusableCell(withIdentifier: kLYinyueListCell, for: indexPath) as!  LYinyueListCell
        
        let model = self.dataArray[indexPath.row]
        cell.indexRow = indexPath.row
        cell.audioModel = model
        cell.yinyueListCellBlock = {[weak self](indexRow,audioModel) in
            self?.dataArray[indexRow] = audioModel
            self?.ndbTableView.reloadData()
        }
        return cell
        
        
        
    }
    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        print("urls==\(urls)")
        
        if  LSingleTool.shared.readSDType == .Ebook{
            let fileManager = FileManager.default
            
            guard let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first else {
                print("Documents directory not found.")
                return
            }
            
            
            let folderURL = documentsDirectory.appendingPathComponent("music")
            
            // Check if the folder already exists
            var isDirectory: ObjCBool = false
            if fileManager.fileExists(atPath: folderURL.path, isDirectory: &isDirectory) {
                if isDirectory.boolValue {
                    print("Target folder already exists.")
                } else {
                    print("A file with the same name as the target folder exists.")
                }
            } else {
                // Create the folder if it doesn't exist
                do {
                    try fileManager.createDirectory(at: folderURL, withIntermediateDirectories: true, attributes: nil)
                    print("Target folder created successfully.")
                } catch {
                    print("Error creating target folder: \(error.localizedDescription)")
                }
            }
            
            for fileURL in urls {
                let relativePath = fileURL.path.replacingOccurrences(of: "/private", with: "")
                print("relativePath==\(relativePath)")
                
                let destinationPath = folderURL.appendingPathComponent(fileURL.lastPathComponent)
                print("Destination path=\(destinationPath.path)")
                //                do {
                //                    try fileManager.moveItem(atPath: relativePath, toPath: destinationPath.path)
                //                    print("File moved successfully.")
                //                } catch {
                //                    print("Failed to move file: \(error.localizedDescription)")
                //                }
                if let data = FileManager.default.contents(atPath: relativePath) {
                    // 2. 判断文本编码
                    let encoding = NSString.stringEncoding(for: data, encodingOptions: nil, convertedString: nil, usedLossyConversion: nil)
                    
                    if encoding == String.Encoding.utf8.rawValue {
                        print("文件已经是UTF-8编码")
                        do {
                            try fileManager.moveItem(atPath: relativePath, toPath: destinationPath.path)
                            print("File moved successfully.")
                            self.getMusicList()
                        } catch {
                            print("Failed to move file: \(error.localizedDescription)")
                        }
                    } else {
                        // 3. 将文本转换为UTF-8编码
                        if let utf8String = String(data: data, encoding: String.Encoding(rawValue: encoding)) {
                            if let utf8Data = utf8String.data(using: .utf8) {
                                do {
                                    // 4. 将转换后的数据写回文件
                                    try utf8Data.write(to: URL(fileURLWithPath: relativePath))
                                    print("文件已转换为UTF-8编码")
                                    do {
                                        try fileManager.moveItem(atPath: relativePath, toPath: destinationPath.path)
                                        print("File moved successfully.")
                                        self.getMusicList()
                                    } catch {
                                        print("Failed to move file: \(error.localizedDescription)")
                                    }
                                } catch {
                                    print("无法写入文件：\(error)")
                                }
                            }
                        }
                    }
                } else {
                    print("文件不存在或无法读取")
                }
                
                
                
            }
        }else{
            let fileManager = FileManager.default
            
            guard let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first else {
                print("Documents directory not found.")
                return
            }
            
            
            let folderURL = documentsDirectory.appendingPathComponent("music")
            
            // Check if the folder already exists
            var isDirectory: ObjCBool = false
            if fileManager.fileExists(atPath: folderURL.path, isDirectory: &isDirectory) {
                if isDirectory.boolValue {
                    print("Target folder already exists.")
                } else {
                    print("A file with the same name as the target folder exists.")
                }
            } else {
                // Create the folder if it doesn't exist
                do {
                    try fileManager.createDirectory(at: folderURL, withIntermediateDirectories: true, attributes: nil)
                    print("Target folder created successfully.")
                } catch {
                    print("Error creating target folder: \(error.localizedDescription)")
                }
            }
            
            for fileURL in urls {
                let relativePath = fileURL.path.replacingOccurrences(of: "/private", with: "")
             
                let destinationPath = folderURL.appendingPathComponent(fileURL.lastPathComponent)
               
                
                do {
                    try fileManager.moveItem(atPath: relativePath, toPath: destinationPath.path)
                    print("File moved successfully.")
                    self.getMusicList()
                } catch {
                    print("Failed to move file: \(error.localizedDescription)")
                }
            }
        }
        
        
        
        
        
    }
    // Delegate method to handle the document picker dismissal
    func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
        // Handle the cancellation here
        print("Document picker was cancelled.")
    }
    /// float 保留一位小数
    /// - Parameter value: float
    /// - Returns: 保留一位后的float
    func L_roundToSingleDigit(_ value: Float) -> Float {
        let multiplier = pow(10.0, Float(1 - Int(log10f(fabs(value)))))
        return round(value * multiplier) / multiplier
    }
    
}

