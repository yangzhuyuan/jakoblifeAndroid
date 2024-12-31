//
//  DialPopView.swift
//  Test001
//
//  Created by GJD on 2023/12/29.
//

import UIKit
import RealSDK
import Alamofire
class DialPopView: UIView,LLoadNibAble {
    
    @IBOutlet weak var dialImageView: UIImageView!
    
    @IBOutlet weak var dialButton: UIButton!
    
    let kDataHead: UInt8 = 0xaa
    let maximumWriteValueLength = 132
    let frMaxSendLength = 200
    
    var binData = Data()
    // 总包数
    var total = 0
    //当前发的包序号
    var current = 0
 
    var timer: Timer?
    var startAsync: Async?
    var startTime = Date()
    var frAddress = 0
    
    var frEraseTotal = 0
    var frEraseIndex = 0
    
    var dataArray = [String]()
    var model = DialInfo()
    /**--自定义表盘数据--**/
    //表盘名称
    var mWatchName = ""
    //表盘背景名字
    var watchBinName = ""
    
    
    var  dialPopTransBlock:((_ type:Int) -> ())?
    override func awakeFromNib() {
        super.awakeFromNib()
        self.backgroundColor = UIColor.colorWithHex(hex: "000000", alpha: 0.5)
        dialButton.backgroundColor = UIColor.green
        dialButton.setTitle("开始", for: .normal)
    }
    
    
    
    @IBAction func dialButtonAction(_ sender: UIButton) {
        SVProgressHUD.show()
        let str = model.dialUrl
        if str.count > 0{
            let fileURLString = str
            let destination: DownloadRequest.Destination = { _, _ in
                let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
                let fileURL = documentsURL.appendingPathComponent("yourfile.zip")
                return (fileURL, [.removePreviousFile, .createIntermediateDirectories])
            }
            
            AF.download(fileURLString, to: destination)
                .downloadProgress { progress in
                    print("Download Progress: \(progress.fractionCompleted)")
                }
                .responseData { response in
                    switch response.result {
                    case .success(let data):
                        print("File downloaded successfully. File size: \(data.count) bytes")
                        // Handle the downloaded file here
                        
                        self.binData = data
                        self.dialInstallAction()
                    case .failure(let error):
                        print("Error downloading file: \(error.localizedDescription)")
                    }
                }
        }else{
            if bleSelf.bleModel.chip.contains("F") {
                
                
                self.total = Int(ceil(Double(self.binData.count)/Double(frMaxSendLength)))
                DialManager.openDialFileSystem(withCmdManager: (LSingleTool.shared.jlCentralManager?.mAssist.mCmdManager)!) { type, progress in
                    if (type == .fail) {
                        print("--->打开表盘文件系统失败!");
                        //                                return;
                    } else if (type == .success || type == .unnecessary) {
                        
                        self.getListFile()
                    } else {
                        print(type)
                        print("升级失败");
                        
                    }
                }
            }
            
        }
        
        
    }
    
    
    
    fileprivate func dialInstallAction(){
        //TODO: 杰理
        print("bleSelf.bleModel.chip==\(bleSelf.bleModel.chip)");
        if bleSelf.bleModel.chip.contains("F"){
            
            //            bleSelf.otaType = .dial
            self.total = Int(ceil(Double(self.binData.count)/Double(frMaxSendLength)))
            
            
            print("self.binData.count. File size: \(self.binData.count) bytes")
            DialManager.openDialFileSystem(withCmdManager: (LSingleTool.shared.jlCentralManager?.mAssist.mCmdManager)!) { type, progress in
                print("type==\(type)");
                print("progress==\(progress)");
                if (type == .fail) {
                    print("--->打开表盘文件系统失败!");
                } else if (type == .success || type == .unnecessary) {
                    print("--->打开表盘文件系统成功!");
                    let subdata = self.binData.subdata(in: 0x50..<0x82)
                    let firstIndex = subdata.firstIndex(where: {$0 == 46}) ?? 6
                    let nameData = subdata.subdata(in: 0..<firstIndex)
                    let name = String(data: nameData, encoding: .ascii)
                    let name2 = "/" + (name ?? "")
                    print("name2==\(name2)")
                    DialManager.addFile(name2, content: self.binData) { type, progress in
                        //                        self.startUpdateContraints(Double(progress))
                        if type == .success || type == .fail || type == .cmdFail{
                            //                            self.doEnd()
                            if type == .fail || type == .cmdFail{
                                print("失败");
                                self.dialPopTransBlock?(1)
                                self.removeFromSuperview()
                            }else{
                                print("添加文件成功");
                                self.dialPopTransBlock?(0)
                                self.removeFromSuperview()
                            }
                        } 
                    }
                } else {
                    print("表盘安装失败");
                    self.dialPopTransBlock?(2)
                    self.removeFromSuperview()
                }
            }
        }
    }
    
    fileprivate func getListFile(){
        DialManager.listFile() { type, array in
            if type == .success {
                self.dataArray = array as! [String]
                print( #function, self.dataArray)
                self.getWatchFace()
            }
            else {
               
            }
        }
    }
    func getWatchFace() {
        LSingleTool.shared.jlCentralManager?.mAssist.mCmdManager.mFlashManager.cmdWatchFlashPath("", flag: .readCurrentDial, result: { flag, size, path, describe in
            if flag == 0 {
                print("path==\(path)")
                self.mWatchName = path ?? ""
                self.getWatchBgName()
            }  else {
                
            }
        })
    }
    func getWatchBgName() {
        self.model.customIndex = 0
        self.watchBinName = "BGP_W90\(self.model.customIndex)"
        self.changeImageToBin()
        if self.dataArray.contains(self.watchBinName) {
            self.replaceCustomWatch()
        }
        else {
            self.addCustomWatch()
        }
        
    }
    func replaceCustomWatch() {
        let wName = "/\(watchBinName)"
        let binPath = JL_Tools.listPath(.libraryDirectory, middlePath: "", file: watchBinName)
        guard let pathData = NSData(contentsOfFile: binPath) as? Data else { return }
        DialManager.repaceFile(wName, content: pathData) { type, progress in
            if type == .doing {
              
                print("progress===\(progress)")
            }
            else if type == .success {
                self.activeCustomWatch()
            }
            else {
                //                self.doEnd()
            }
        }
    }
    func activeCustomWatch() {
        let wName = "/\(watchBinName)"
        LSingleTool.shared.jlCentralManager?.mAssist.mCmdManager.mFlashManager.cmdWatchFlashPath(wName, flag: .activateCustomDial, result: { flag, size, path, describe in
            SVProgressHUD.dismiss()
            self.removeFromSuperview()
         })
    }
    func addCustomWatch() {
        let wName = "/\(watchBinName)"
        let binPath = JL_Tools.listPath(.libraryDirectory, middlePath: "", file: watchBinName)
        guard let pathData = NSData(contentsOfFile: binPath) as? Data else { return }
        DialManager.addFile(wName, content: pathData) { type, progress in
            if type == .doing {
                //                self.startUpdateContraints(Double(progress))
                print("progress===\(progress)")
            }
            else if type == .success {
                self.activeCustomWatch()
            }
            else {
                //                self.doEnd()
            }
        }
    }
    func changeImageToBin() {
        let bmpPath = JL_Tools.listPath(.libraryDirectory, middlePath: "", file: "ios_test.bmp")
        let binPath = JL_Tools.listPath(.libraryDirectory, middlePath: "", file: watchBinName)
        JL_Tools.removePath(bmpPath)
        JL_Tools.removePath(binPath)
        JL_Tools.create(on:.libraryDirectory, middlePath: "", file: "ios_test.bmp")
        JL_Tools.create(on:.libraryDirectory, middlePath: "", file: watchBinName)
        let bitmap = BitmapTool.convert_B_G_R_A_Bytes(from: self.model.image)
        JL_Tools.write(bitmap, fillFile: bmpPath)
        
        guard let array = bmpPath.cString(using: .utf8) else { return }
        let pointer = UnsafeMutablePointer<CChar>.allocate(capacity: array.count)
        for i in array.indices {
            pointer[i] = array[i]
        }
        guard let array1 = binPath.cString(using: .utf8) else { return }
        let pointer1 = UnsafeMutablePointer<CChar>.allocate(capacity: array1.count)
        for i in array1.indices {
            pointer1[i] = array1[i]
        }
        guard let model = LSingleTool.shared.jlCentralManager?.mAssist.mCmdManager.outputDeviceModel() else { return }
        
        if model.sdkType == JL_SDKType.type701xWATCH {
          
            br28_btm_to_res_path_with_alpha(pointer, Int32(bleSelf.bleModel.width), Int32(bleSelf.bleModel.height), pointer1)
        }
        else {
           
            br23_btm_to_res_path(pointer, Int32(bleSelf.bleModel.width), Int32(bleSelf.bleModel.height), pointer1)
        }
    }
}
