//
//  LRecordDesController.swift
//  LifeFit
//
//  Created by GJD on 2023/8/8.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit
import DFUnits
import AVFoundation

class LRecordDesController: UIViewController{
    fileprivate let kLRecordDesTextCell = "LRecordDesTextCell"
    fileprivate let kLRecordDesCell = "LRecordDesCell"
    @IBOutlet weak var naviHeightConst: NSLayoutConstraint!
    
    
    @IBOutlet weak var ndbTableView: UITableView!
    
    @IBOutlet weak var naviTitleLabel: UILabel!
    
    //0 : 未获取到文件 1:已经下载,但是没有转码 2: 已经下载,而且转码了,可以直接播放
    var  fileType = 0
    
    var timer : Timer!
    
    ///录音文件url
    var recordPath = ""
    //转码后的路径url
    var transRecordPath = ""
    
    var  recordModel =  LFileModel()
    
    
    var audioPlayer: AVAudioPlayer?
    //文件名,不带包含格式类型
    var  fileNameString  = ""
    override func viewDidLoad() {
        super.viewDidLoad()
        //        naviHeightConst.constant = kNaviHeight
        naviTitleLabel.text = NSLocalizedString("录音", comment: "")
        
        ndbTableView.delegate = self
        ndbTableView.dataSource = self
        ndbTableView.sectionHeaderHeight = 50
        ndbTableView.rowHeight = kScreenHeight
        
        ndbTableView.register(UINib(nibName: "LRecordDesCell", bundle: nil), forCellReuseIdentifier: kLRecordDesCell)
        ndbTableView.register(UINib(nibName: "LRecordDesTextCell", bundle: nil), forCellReuseIdentifier: kLRecordDesTextCell)
        
        ndbTableView.showsVerticalScrollIndicator = false
        ndbTableView.separatorStyle = .none
        
        let nameArray =  self.recordModel.fileModel.fileName.components(separatedBy: ".")
        if nameArray.count > 0{
            self.fileNameString = nameArray[0]
            
        }
        
        let transResult =  DFFile.findPath(.documentDirectory, middlePath: "JL_REC", file: self.fileNameString + ".mp3")
        
        if transResult == nil{//未获取到可以播放的文件
            let loadResult =  DFFile.findPath(.documentDirectory, middlePath: "JL_REC", file: self.recordModel.fileModel.fileName)
            if loadResult == nil{//未下载,也没有转码,准备下载
                fileType = 0
                dealRecordData()
            }else{//已经下载,但是没有转码
                fileType = 1
            }
            
        }else{///已经下载,而且转码了,可以直接播放
            fileType = 2
            transRecordPath = transResult!
            print("transRecordPath==\(transRecordPath)")
            self.prepareAction()
            
        }
    }
    fileprivate func prepareAction(){
        
        let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let playName = self.fileNameString + ".mp3"
        let audioFileURL = documentsDirectory.appendingPathComponent("JL_REC").appendingPathComponent(playName)
        print("audioFileURL==\(audioFileURL)")
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: audioFileURL)
            audioPlayer?.delegate = self
            print("audioPlayer设置了delegate")
            audioPlayer?.prepareToPlay()
        } catch {
            print("Error initializing audio player: \(error)")
        }
        
        
        
    }
    fileprivate func dealRecordData(){
        var mData = Data();
        LMCmdManage?.mFileManager.setCurrentFileHandleType(.SD_0)
        LMCmdManage?.mFileManager.cmdFileReadContent(withFileClus: self.recordModel.fileModel.fileClus, result: { result, size, data, progress in
            
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
                if (  mData.count < 40) {
                    return;
                }
                
                
                let path =  DFFile.create(on: .documentDirectory, middlePath: "JL_REC", file: self.recordModel.fileModel.fileName)
                let isSuccess = self.saveNSDataToMP3File(data: mData as NSData, filePath: path ?? "")
                if isSuccess == true{
                    print("存入成功")
                    self.fileType = 1
                    //进行转码
                    if let inputUrlString = path{
                        
                        let outputUrlString   = self.getFilePathInDocumentDirectory(fileName: self.fileNameString + ".mp3")
                        print("准备播放音频文件")
                        
                        
                    }
                    
                    
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
    func saveNSDataToMP3File(data: NSData, filePath: String) -> Bool {
        do {
            try data.write(toFile: filePath, options: .atomic)
            return true
        } catch {
            print("Error saving NSData to file: \(error.localizedDescription)")
            return false
        }
    }
    
    
    
    @IBAction func shareButtonAction(_ sender: UIButton) {
        // 你要分享的文件的 URL
        guard let   filePath =   DFFile.findPath(.documentDirectory, middlePath: "JL_REC", file: self.recordModel.fileModel.fileName) else {
            
            return  }
        
        let fileURL = URL(fileURLWithPath: filePath)
        
        let activityViewController = UIActivityViewController(activityItems: [fileURL], applicationActivities: nil)
        
        // 在 iPad 上，必须设置 popoverPresentationController 来指定弹出的位置
        activityViewController.popoverPresentationController?.sourceView = sender
        
        // 排除一些不希望在分享列表中显示的选项
        activityViewController.excludedActivityTypes = [
            //            .airDrop,
            //            .addToReadingList,
            //            .assignToContact,
            //            .saveToCameraRoll
        ]
        
        // 显示分享面板
        present(activityViewController, animated: true, completion: nil)
    }
    
    @IBAction func backAction(_ sender: Any) {
        self.navigationController?.popViewController(animated: false)
    }
    //    @IBAction func cleanAction(_ sender: Any) {
    //        let result =  DFFile.findPath(.documentDirectory, middlePath: "JL_REC", file:"")
    //        DFFile.removePath(result)
    //    }
}
//MARK:--音频转码处理
extension LRecordDesController{
    func getFilePathInDocumentDirectory(fileName: String) -> String {
        let documentDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let subString = "JL_REC/" + fileName
        let fileURL = documentDirectory.appendingPathComponent(subString)
        return fileURL.path
    }
    
    
    
}
//MARK:tableView
extension LRecordDesController:UITableViewDelegate,UITableViewDataSource{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if indexPath.row == 0{
            let cell = tableView.dequeueReusableCell(withIdentifier: kLRecordDesCell, for: indexPath) as!  LRecordDesCell
            cell.titleLabel.text = self.recordModel.fileModel.fileName
            
            cell.playButton.addTarget(self, action: #selector(playButtonAction(_:)), for: .touchUpInside)
            
            return cell
        }else{
            let cell = tableView.dequeueReusableCell(withIdentifier: kLRecordDesTextCell, for: indexPath) as!  LRecordDesTextCell
            return cell
        }
        
    }
    @objc func playButtonAction(_ button:UIButton){
        
        if  self.audioPlayer?.isPlaying == true{
            self.audioPlayer?.pause()
            stopTimer()
            button.setImage(UIImage(named: "icon_zanting"), for: .normal)
            
        }else{
            if  fileType == 2{
                self.prepareAction()
                self.audioPlayer?.play()
                startTimer()
                button.setImage(UIImage(named: "icon_bofang"), for: .normal)
            }
            
        }
    }
    fileprivate func startTimer() {
        if timer == nil {
            timer = Timer.scheduledTimer(timeInterval: 0.01, target: self, selector: #selector(updateProgress), userInfo: nil, repeats: true)
        }
    }
    fileprivate  func stopTimer() {
        timer?.invalidate()
        timer = nil
    }
    
    @objc func updateProgress() {
        let currentTime = audioPlayer?.currentTime
        let duration = audioPlayer?.duration
        let progress = Float(currentTime ?? 0) / Float(duration ?? 0)
        let index = IndexPath(row: 0, section: 0 )
        let cell = ndbTableView.cellForRow(at: index) as! LRecordDesCell
        cell.playProgress.value = progress
 
        
        
    }
}

extension LRecordDesController: AVAudioPlayerDelegate{
    func audioPlayerDecodeErrorDidOccur(_ player: AVAudioPlayer, error: Error?) {
        print("error==\(error?.localizedDescription)")
    }
    func audioPlayerBeginInterruption(_ player: AVAudioPlayer) {
        print("音频播放暂停")
    }
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        print("音频播放完成")
        self.stopTimer()
        let index = IndexPath(row: 0, section: 0 )
        let cell = ndbTableView.cellForRow(at: index) as! LRecordDesCell
        //        cell.playButton
        self.audioPlayer?.stop()
        self.stopTimer()
        cell.playButton.setImage(UIImage(named: "icon_zanting"), for: .normal)
        
    }
    func audioPlayerEndInterruption(_ player: AVAudioPlayer, withOptions flags: Int) {
        print("flags==\(flags)")
    }
    
    
}
