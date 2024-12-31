//
//  DMusicHandler.swift
//  LifeFit
//
//  Created by GJD on 2023/7/25.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit
import RealSDK
enum DM_ERROR: Int {
    case Max_Fold
    case Unknown
}
protocol DMHandlerDelegate: AnyObject {
    func dmHandle(withTabTitleArray modelA: [JLModel_File])
    func dmHandle(withItemModelArray modelB: [JLModel_File])
    func dmHandleWithPlayItemOK()
    func dmLoadFailed(_ err: DM_ERROR)
    func dmCardMessageDismiss(_ nowArray: [Any])
}

class DMusicHandler: NSObject {
    
    let USB_Card = "usb"
    let SD_0_Card = "SD0"
    let SD_1_Card = "SD1"
    let FLASH_Card = "Flash"
    let Linein_Card = "LineIn"
    let MaxFoldNum = 9
    
    var saveDict = [String: NSMutableDictionary]()
    var bleUuid: String?
    var nowType: JL_CardType?
    var reqNum: Int = 0
    var reqModel: JLModel_File?
    var playItem: Bool = false
    
    let kJL_BLE_Uuid = bleSelf.bleModel.uuidString

 
    
    
    
    
    static let shared = DMusicHandler()
    
    
    override init() {
        super.init()
        saveDict = [String: NSMutableDictionary]()
          handleFileMonitor()
          addNote()
          playItem = false
        bleUuid =   bleSelf.bleModel.uuidString
    }
 
    weak  var  delegate: DMHandlerDelegate?{
        didSet{
            self.handleFileMonitor()
        }
    }
    var nowEntity: JL_EntityM?{
        didSet{
            bleUuid = bleSelf.bleModel.uuidString
//            nowEntity?.mPeripheral.identifier.uuidString
            if saveDict[bleUuid ?? ""] == nil {
                let dict = NSMutableDictionary()
                saveDict[bleUuid ?? ""] = dict
            }
        }
    }
    
    func removeNowEntityCache(nowEntity: JL_EntityM) {
        let uuidString = nowEntity.mPeripheral.identifier.uuidString
        if let dict = saveDict[uuidString] {
            print("removeNowEntityCache...")
            dict.removeAllObjects()
        }
    }

    private func addNote() {
           JL_Tools.add(kJL_BLE_M_ENTITY_DISCONNECTED, action: #selector(bleDisconnectAction(_:)), own: self)
           JLModel_Device.observeModelProperty("currentClus", action: #selector(noteCurrentClus(_:)), own: self)
           JLModel_Device.observeModelProperty("cardArray", action: #selector(noteCardArray(_:)), own: self)
       }

    @objc private func bleDisconnectAction(_ note: Notification) {
        if let pl = note.object as? CBPeripheral {
            if var dict = saveDict[pl.identifier.uuidString] {
                dict.removeAllObjects()
            }
        }
    }
    @objc private func noteCardArray(_ note: Notification) {
        if let tmpDict = note.object as? [String: Any],
           let uuid = tmpDict[kJL_MANAGER_KEY_UUID] as? String,
           uuid == kJL_BLE_Uuid {
            if let array = tmpDict[kJL_MANAGER_KEY_OBJECT] as? [JL_CardType] {
                let tmpA: [JL_CardType] = [.USB, .SD_0, .SD_1, .FLASH, .lineIn]
                for type in tmpA {
                    if !array.contains(type) {
                        if let dict = saveDict[uuid] {
                            dict.removeObject(forKey: keyByType(type))
                        }
                    }
                }
//                if let delegate = _delegate {
                delegate?.dmCardMessageDismiss(array)
//                }
            }
        }
    }
    
    @objc func noteCurrentClus(_ note: Notification) {
        DispatchQueue.main.async {
            self.updatePlay()
        }
    }
     
    func keyByType(_ type: JL_CardType) -> String {
            switch type {
            case .USB:
                return USB_Card
            case .SD_0:
                return SD_0_Card
            case .SD_1:
                return SD_1_Card
            case .FLASH:
                return FLASH_Card
            case .lineIn:
                return Linein_Card
            default:
                return SD_0_Card;
            }
        }
        
    func checkoutArray(_ type: JL_CardType) -> NSMutableArray {
        let key = keyByType(type)
        if let dict = saveDict[bleUuid!] as? [String: Any], let array = dict[key] as? NSMutableArray {
            return array
        }
        return NSMutableArray()
    }
    func checkCaChe(_ type: JL_CardType) -> Bool {
          let sDict = saveDict[bleUuid!] as? [String: Any] ?? [:]
          let key = keyByType(type)
          return sDict[key] != nil
      }
    
    
    
    func addTabArray(_ model: JLModel_File) {
        var array : [JLModel_File] = checkoutArray(nowType!) as! [JLModel_File]
        if array.count == 10 {
            updateTitleData(array )
//            if let delegate = _delegate, delegate.responds(to: #selector(DMHandlerDelegate.dmLoadFailed(_:))) {
            self.delegate?.dmLoadFailed(.Max_Fold)
//            }
            return
        }
        guard let pathData = model.pathData else {
            updateTitleData(array )
            return
        }
        
        // Creating a new model to store the modified pathData as local storage
        let newModel = JLModel_File()
        newModel.fileHandle = model.fileHandle
        newModel.fileType = model.fileType
        newModel.cardType = model.cardType
        newModel.folderName = model.fileName
        newModel.fileName = model.fileName
        newModel.fileIndex = model.fileIndex
        newModel.fileClus = model.fileClus
        
        let newData = NSMutableData(data: pathData)
        let usData = JL_Tools.uInt32_data(model.fileClus, endian: true)
        newData.append(usData)
        
//        if let modelPathData = model.pathData  as? Data {
//            newModel.pathData = modelPathData
//        }
         
        let tempData: Data = newData as Data
        newModel.pathData = tempData
       
        
        for item in array {
            if item.pathData == newModel.pathData {
                updateTitleData(array)
                return
            }
        }
        
        array.append(newModel)
        updateTitleData(array)
    }

    func tabArraySelect(_ model: JLModel_File) {
        if reqNum > 0 {
            print("222--取消请求\(model.fileName)")
            return
        }
        if playItem {
            print("需要等待播放成功之后才可以继续操控")
            return
        }
        
        var array:[JLModel_File] = checkoutArray(nowType!) as! [JLModel_File]
        var newArray = [JLModel_File]()
        for fm in array {
            newArray.append(fm)
            if fm.pathData == model.pathData {
                break
            }
            if model.pathData == nil {
                break
            }
        }
        
        if let dict = saveDict[bleUuid ?? ""]  {
            let key = keyByType(nowType!)
            dict.setValue(newArray, forKey: key)
            
//            if self.delegate.responds(to: #selector(DMHandlerDelegate.dmHandleWithTabTitleArray(_:))) {
                self.delegate?.dmHandle(withItemModelArray: newArray)
//            }
        }
        
        guard let backModel = lastPathRequest() else { return  }
        reqNum = -1
        requestWith(backModel, number: 20)
    }

    func shouldBeUpdate(_ model: JLModel_File) -> Bool {
        let arr:[JLModel_File] = checkoutArray(nowType!) as! [JLModel_File]
        guard let item = arr.last else {
            return true
        }
        
        if item.pathData == nil {
            return true
        }
        
        return item.pathData == model.pathData
    }

    
    
    func lastPathRequest() -> JLModel_File? {
        let arr:[JLModel_File] = checkoutArray(nowType!) as! [JLModel_File]
        if arr.count < 2 {
            if arr.count > 0 {
                return arr[0]
            }
        }
        
        // This operation actually goes back to get the pathData of the previous layer and then pass it to the library to recombine it.
        if let model = arr.last, arr.count >= 2 {
            
          let model1 = arr[arr.count - 2]
            
            let newModel = JLModel_File()
            newModel.fileHandle = model.fileHandle
            newModel.fileType = model.fileType
            newModel.cardType = model.cardType
            newModel.folderName = model.fileName
            newModel.fileName = model.fileName
            newModel.fileIndex = model.fileIndex
            newModel.fileClus = model.fileClus
            
            if model1.pathData == nil {
                let firstData: [UInt8] = [0x00, 0x00, 0x00, 0x00]
                newModel.pathData = Data(bytes: firstData, count: 4)
            } else {
                newModel.pathData = model1.pathData
            }
            
            return newModel
        }
        
        return nil
    }


    //MARK: End -----请求数据
    func loadModeData(_ type: JL_CardType) {
        nowType = type
        let result = checkCaChe(type)
        firstLoadData()
//        if !result {
//            firstLoadData()
//        } else {
//
//            let array:[JLModel_File] = checkoutArray(type) as! [JLModel_File]
//            self.delegate?.dmHandle(withTabTitleArray: array)
//            guard let model  = lastPathRequest() else { return  }
//            request(model)
//
//        }
    }

    func firstLoadData() {
    print("=====firstLoadData")
        guard let model = LMCmdManage?.outputDeviceModel() else {
            return
        }
        let fileModel = JLModel_File()
        fileModel.fileType = .folder
        var mutbA = [JLModel_File]()
        
        print("====nowType==\(nowType)")
        if let sDict = saveDict[bleUuid ?? ""] {
            
            switch nowType {
            case .USB:
                fileModel.cardType = .USB
                fileModel.fileName = "USB"
                fileModel.folderName = "USB"
                fileModel.fileHandle = model.handleUSB
                fileModel.fileClus = 0
                mutbA.append(fileModel)
                sDict[USB_Card] = mutbA
                break
            case .SD_0:
                fileModel.cardType = .SD_0
                fileModel.fileName = "SD Card"
                fileModel.folderName = "SD Card"
                fileModel.fileHandle = model.handleSD_0
                fileModel.fileClus = 0
                mutbA.append(fileModel)
                sDict[SD_0_Card] = mutbA
                break
            case .SD_1:
                fileModel.cardType = .SD_1
                fileModel.fileName = "SD Card 2"
                fileModel.folderName = "SD Card 2"
                fileModel.fileHandle = model.handleSD_1
                fileModel.fileClus = 0
                mutbA.append(fileModel)
                sDict[SD_1_Card] = mutbA
                break
            case .FLASH:
                fileModel.cardType = .FLASH
                fileModel.fileName = "FLASH"
                fileModel.folderName = "FLASH"
                fileModel.fileHandle = model.handleFlash
                fileModel.fileClus = 0
                mutbA.append(fileModel)
                sDict[FLASH_Card] = mutbA
                break
            default:
                fileModel.cardType = .SD_0
                fileModel.fileName = "SD Card"
                fileModel.folderName = "SD Card"
                fileModel.fileHandle = model.handleSD_0
                fileModel.fileClus = 0
                mutbA.append(fileModel)
                sDict[SD_0_Card] = mutbA
                break
            }
            saveDict[bleUuid ?? ""] = sDict
            requestWith(fileModel, number: 20)
        }
    }

    func requestWith(_ model: JLModel_File, number n: Int) {
        reqModel = model
        if model.fileType == .file {
            playItem = true
            LMCmdManage?.mFileManager.cmdBrowseModel(model, number: 1, result: nil)
//            kJL_BLE_CmdManager.mFileManager.cmdBrowseModel(model, number: 1, result: nil)
        } else {
            if reqNum > 0 {
                print("333===取消请求\(model.fileName)")
                return
            }
            reqNum = n
            addTabArray(model)
            request(model)
            print("\(model.fileName)")
        }
    }

    func request(_ model: JLModel_File) {
        LMCmdManage?.mFileManager.cmdBrowseModel(model, number: 10, result: nil)
//        kJL_BLE_CmdManager.mFileManager.cmdBrowseModel(model, number: 10, result: nil)
    }

    func requestModelBy(_ num: Int) {
        if let fm = lastPathRequest() {
            requestWith(fm, number: num)
        }
    }

    func cleanCache() {
        saveDict = [String: NSMutableDictionary]()
    }

  
    //MARK: ---处理返回数组

    func handleFileMonitor() {
      
//        LMCmdManage?.mFileManager.cmdBrowseMonitorResult({ [weak self] array, reason in
//
//            if let tempArray = array as? [JLModel_File] {
//                switch reason {
//                case .reading:
//                    self?.updateData(tempArray)
//                    print("正在读取:\(tempArray.count)")
//                case .commandEnd:
//                    self?.updateData(tempArray)
//                    let shouldDown = (self?.reqNum ?? 0) - tempArray.count
//                    if shouldDown > 0 {
//                        self?.request(self?.reqModel ?? JLModel_File())
//                    } else {
//                        self?.reqNum = -1
//                    }
//                    print("读取命令结束:\(tempArray.count) delegate:\(self._delegate)")
//                case .folderEnd:
//                    self?.updateData(tempArray)
//                    if tempArray.count == 0 && self?.reqNum != -1 {
//                        if let tempArray = self?.filter(tempArray), let delegate = self._delegate {
//                            delegate.dmHandleWithItemModelArray(tempArray)
//                        }
//                    }
//                    self.reqNum = -1
//                    print("目录读取结束:\(tempArray.count) delegate:\(self._delegate)")
//                case .busy:
//                    print("设备在忙")
//                case .dataFail:
//                    print("数据读取失败")
//                case .playSuccess:
//                    self?.updatePlay()
//                    self.playItem = false
//                    print("播放成功")
//                case .unknown:
//                    print("未知错误")
//                    self.reqNum = -1
//                    self.playItem = false
//                    self.requestWith(self.reqModel, number: 10)
//                default:
//                    break
//                }
//            }
//
//
//        })
//
        
        LMCmdManage?.mFileManager.cmdBrowseMonitorResult({ [weak self] array, reason in
            if let tempArray = array as? [JLModel_File] {
                switch reason {
                case .reading:
                    self?.updateData(tempArray)
                    print("正在读取:\(tempArray.count)")
                case .commandEnd:
                    self?.updateData(tempArray)
                    let shouldDown = (self?.reqNum ?? 0) - tempArray.count
                    if shouldDown > 0 {
                        self?.request(self?.reqModel ?? JLModel_File())
                    } else {
                        self?.reqNum = -1
                    }
                    print("读取命令结束:\(tempArray.count) delegate:\(self?.delegate)")
                case .folderEnd:
                    self?.updateData(tempArray)
                    print("tempArray.count:\(tempArray.count)")
                    print("self?.reqNum:\(self?.reqNum)")
                    for model in tempArray{
                        print("model.fileNam:\(model.fileName)")
                    }
                    if tempArray.count == 0 && self?.reqNum != -1 {
                        self?.delegate?.dmHandle(withItemModelArray: tempArray)
                        
//                        if let filteredArray = self?.filter(tempArray), let delegate = self?._delegate {
//                            delegate.dmHandleWithItemModelArray(filteredArray)
//                        }
                    }
                    self?.reqNum = -1
                 
                    for model in tempArray {
                        print("目录读取结束:\(model.fileName)")
                    }
                 
                case .busy:
                    print("设备在忙")
                case .dataFail:
                    print("数据读取失败")
                case .playSuccess:
                    self?.updatePlay()
                    self?.playItem = false
                    print("播放成功")
                case .unknown:
                    print("未知错误")
                    self?.reqNum = -1
                    self?.playItem = false
                    self?.requestWith(self?.reqModel ?? JLModel_File(), number: 10)
                default:
                    break
                }
            }
        })

    }

    
    //MARK: ---- 过滤非音乐文件
    func filter(_ itemArray: [JLModel_File]) -> [JLModel_File] {
        
        
        
        var tempArr: [JLModel_File] = []
        if LSingleTool.shared.readSDType == .ePhotos{
            for modelFile in itemArray {
                let fileName = modelFile.fileName.lowercased()
                if modelFile.fileType != .file ||
                   
                   fileName.contains(".jpg") ||
                    fileName.contains(".JPG") {
                    tempArr.append(modelFile)
                }
            }
        }  else if LSingleTool.shared.readSDType == .music || LSingleTool.shared.readSDType == .record{
           
                for modelFile in itemArray {
                    let fileName = modelFile.fileName.lowercased()
                    if modelFile.fileType != .file ||
                       fileName.contains(".mp3") ||
                       fileName.contains(".wav") ||
                       fileName.contains(".wave") ||
                       fileName.contains(".aac") ||
                       fileName.contains(".ogg") ||
                       fileName.contains(".amr") ||
                       fileName.contains(".wma") ||
                       fileName.contains(".flac") ||
                       fileName.contains(".ape") {
                        tempArr.append(modelFile)
                    }
                }
         
        }else if LSingleTool.shared.readSDType == .Ebook{
            for modelFile in itemArray {
                let fileName = modelFile.fileName.lowercased()
                if modelFile.fileType != .file ||
                   
                   fileName.contains(".txt") {
                    tempArr.append(modelFile)
                }
            }
        }
       
       
        return tempArr
    }

    func updateData(_ array: [JLModel_File]) {
        guard let model = array.first, shouldBeUpdate(model) else {
            return
        }
//        if let delegate = _delegate, delegate.responds(to: #selector(dmHandleWithItemModelArray(_:))) {
            let tempArray = filter(array)
            delegate?.dmHandle(withItemModelArray: tempArray)
            
//        }
    }

    func updateTitleData(_ array: [JLModel_File]) {
//        if let delegate = _delegate, delegate.responds(to: #selector(dmHandleWithTabTitleArray(_:))) {
        delegate?.dmHandle(withTabTitleArray: array)
            
//        }
    }

    func updatePlay() {
//        if let delegate = _delegate, delegate.responds(to: #selector(dmHandleWithPlayItemOK)) {
            delegate?.dmHandleWithPlayItemOK()
//        }
    }

    
  
    
   
   
   
}
