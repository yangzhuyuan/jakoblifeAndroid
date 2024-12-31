//
//  MDDeviceController.swift
//  RealDemo
//
//  Created by GJD on 2023/11/15.
//

import UIKit
import RealSDK
import Alamofire
 
class MDDeviceController: UIViewController,UITableViewDelegate,UITableViewDataSource {
    var dspUrl = ""
    var hasNewVersion = false
    var filePath:String?
    var progress: MBProgressHUD!
    var funcModelList = [MDFuncModel]()
    @IBOutlet weak var deviceTable: UITableView!
    fileprivate let kDevicesListCell = "DevicesListCell"
    
    var binData = Data()
    // 总包数
    var total = 0
    
    let frMaxSendLength = 200
    
    var upAsync: Async?
    var progressAsync: Async?
    override func viewDidLoad() {
        super.viewDidLoad()
        self.fd_prefersNavigationBarHidden = true
        deviceTable.delegate = self
        deviceTable.dataSource = self
        deviceTable.register(UINib(nibName: "DevicesListCell", bundle: nil), forCellReuseIdentifier: kDevicesListCell)
        let model0 = MDFuncModel()
        model0.funcName = "0.断开连接"
        
        let model1 = MDFuncModel()
        model1.funcName = "1.获取电量"
        
        let model2 = MDFuncModel()
        model2.funcName = "2.获取设备信息"
        
        
        let model3 = MDFuncModel()
        model3.funcName = "3.获取睡眠数据"
        
        let model4 = MDFuncModel()
        model4.funcName = "4.获取当前运动数据"
        
         
        
        let model5 = MDFuncModel()
        model5.funcName = "5.获取心率,血压,血氧,步数历史数据"
        
        let model6 = MDFuncModel()
        model6.funcName = "6.获取实测血压信息"
        
        let model7 = MDFuncModel()
        model7.funcName = "7.获取实测心率信息"
        let model8 = MDFuncModel()
        model8.funcName = "8.获取实测血氧信息"
        
        
        let model9 = MDFuncModel()
        model9.funcName = "9.获取血糖信息"
        
        let model10 = MDFuncModel()
        model10.funcName = "10.获取压力信息"
        
        
        let model11 = MDFuncModel()
        model11.funcName = "******************"
        
        let model12 = MDFuncModel()
        model12.funcName = "12.获取体温信息"
  
        
        let model13 = MDFuncModel()
        model13.funcName = "*************"
        
        
        let model14 = MDFuncModel()
        model14.funcName = "14.查找设备"
        let model15 = MDFuncModel()
        model15.funcName = "15.设置拍照模式"
        let model16 = MDFuncModel()
        model16.funcName = "16.勿扰模式"
        
        let model17 = MDFuncModel()
        model17.funcName = "17.设置闹钟"
        
        let model18 = MDFuncModel()
        model18.funcName = "18.久坐提醒"
        let model19 = MDFuncModel()
        model19.funcName = "19.健康提醒"
        let model20 = MDFuncModel()
        model20.funcName = "20.消息提醒"
        let model21 = MDFuncModel()
        model21.funcName = "21.屏幕设置"
        
        let model22 = MDFuncModel()
        model22.funcName = "22.时间制 "
        
        
        let model23 = MDFuncModel()
        model23.funcName = "23.振动次数设置"
        
        let model24 = MDFuncModel()
        model24.funcName = "24.自动同步设置"
        let model25 = MDFuncModel()
        model25.funcName = "25.设置手环定时自动测量"
        
        let model26 = MDFuncModel()
        model26.funcName = "26.恢复出厂设置"
        
        let model27 = MDFuncModel()
        model27.funcName = "27.设置城市"
        
        
        let model28 = MDFuncModel()
        model28.funcName = "28.设置城市当前天气"
        
        let model29 = MDFuncModel()
        model29.funcName = "29.设置城市未来天气"
        
        let model30 = MDFuncModel()
        model30.funcName = "***************"
        
        
        let model31 = MDFuncModel()
        model31.funcName = "31.名片"
        
        let model32 = MDFuncModel()
        model32.funcName = "32.钱包"
        
        
        let model33 = MDFuncModel()
        model33.funcName = "33.在线表盘"
        
        let model34 = MDFuncModel()
        model34.funcName = "34.自定义表盘"
        
        let model35 = MDFuncModel()
        model35.funcName = "35.OTA升级"
        
        let model36 = MDFuncModel()
        model36.funcName = "36.音乐"
        
        let model37 = MDFuncModel()
        model37.funcName = "37.录音"
        
        let model38 = MDFuncModel()
        model38.funcName = "38.电子书"
        
        let model39 = MDFuncModel()
        model39.funcName = "38.电子相册"
        
        funcModelList.append(model0)
        funcModelList.append(model1)
        funcModelList.append(model2)
        funcModelList.append(model3)
        funcModelList.append(model4)
       
        
        
        funcModelList.append(model5)
        funcModelList.append(model6)
        funcModelList.append(model7)
        funcModelList.append(model8)
        funcModelList.append(model9)
        
        
        funcModelList.append(model10)
        funcModelList.append(model11)
        funcModelList.append(model12)
        funcModelList.append(model13)
      
        funcModelList.append(model14)
        
        funcModelList.append(model15)
        funcModelList.append(model16)
        funcModelList.append(model17)
        funcModelList.append(model18)
        funcModelList.append(model19)
        
        
        funcModelList.append(model20)
      
        
        funcModelList.append(model21)
        funcModelList.append(model22)
        funcModelList.append(model23)
        funcModelList.append(model24)
        
        funcModelList.append(model25)
        funcModelList.append(model26)
        
        funcModelList.append(model27)
        funcModelList.append(model28)
        funcModelList.append(model29)
        
        funcModelList.append(model30)
        funcModelList.append(model31)
        funcModelList.append(model32)
        
        funcModelList.append(model33)
        funcModelList.append(model34)
        funcModelList.append(model35)
        
        funcModelList.append(model36)
        funcModelList.append(model37)
        funcModelList.append(model38)
        funcModelList.append(model39)
        
        self.deviceTable.reloadData()
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.jlOTAUpgrade, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.disconnected, object: nil)
    }
    @objc func handle(_ notify: Notification) {
        if notify.name == WUBleManagerNotifyKeys.disconnected {
            print("handle==断开连接")
            self.navigationController?.popViewController(animated: false)
  
 
        }
        if notify.name == WUBleManagerNotifyKeys.jlOTAUpgrade {
            self.hideHudForever(with: self.view)
            self.progress = MBProgressHUD.showAdded(to: self.view, animated: true)
            self.progress.mode = .determinate
            self.progress.backgroundView.style = MBProgressHUDBackgroundStyle.solidColor
            self.progress.backgroundView.color = UIColor.colorWithHex(hex: "000000", alpha: 0.35)
            self.progress.label.text = String.init(format: "%.1f%%", self.progress.progress * 100)
            //
            let cachePath2 = NSHomeDirectory() + "/Library/Caches"
            print("cachePath2====\(cachePath2)")
            guard let fileName = UserDefaults.standard.string(forKey: "OTA_FILENAME") else {
                print("000====fileName====是空的")
                return
                
            }
            
            
            let filePath =  cachePath2 + "/" + fileName
            
            
            
            let lastZip = filePath.replacingOccurrences(of: ".zip", with: "")
            
            if !FileManager.default.fileExists(atPath: lastZip) {
                FileManager.default.createFile(atPath: lastZip, contents: nil, attributes: nil)
            }
            
            
            
            let zipArr = FatfsObject.unzipFile(atPath: filePath, toDestination: lastZip)
            
            
            print("zipArr====\(zipArr)")
            
            Async.main(after: 10) { [unowned self] in
                
                if zipArr.count > 0{
                    print("zipArr====\(zipArr)")
                    guard zipArr.count > 0 else { return }
                    print(" zipArr.count ====\( zipArr.count )")
                    
                    guard let zipArray = JL_Tools.subPaths(lastZip) as? [String] else { return }
                    print(" 22222zipArray ====\( zipArray)")
                    guard let name = zipArray.first(where: {$0.hasSuffix(".ufw")}) else { return }
                    print(" name ====\( name)")
                    let dataPath = lastZip + "/" + name
                    print(" dataPath ====\( dataPath)")
                    
                    guard let data = FileManager.default.contents(atPath: dataPath), data.count > 0 else { return }
                    print(" data ====\( data)")
                    self.binData = data
                    self.jlCmdOTAData()
                    
                    
                }else{
                    self.progress.hide(animated: true)
                    self.progress.progress = 0
                    self.showHud(NSLocalizedString("升级失败!", comment: ""))
                }
                
            }
     
        }
    }
    @IBAction func backAction(_ sender: Any) {
        self.navigationController?.popViewController(animated: false)
    }
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 80
    }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return funcModelList.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: kDevicesListCell, for: indexPath) as! DevicesListCell
        cell.funcModel = funcModelList[indexPath.row]
        return cell
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let vc = DesViewController()
        if  indexPath.row == 0{
            
            
            MDBleManager.share.MD_dicconnectBle()
        }
        else  if  indexPath.row == 1{
            MDBleManager.share.MD_getBatteryData()
            vc.currentType = .battery
            self.navigationController?.pushViewController(vc, animated: false)
        }else if indexPath.row == 2{//获取设备信息
//            MDBleManager.share.getd
            print(bleSelf.bleModel.mac)
            vc.currentType = .deviceInfo
            self.navigationController?.pushViewController(vc, animated: false)
            
        }else if indexPath.row == 3{//获取睡眠数据
            vc.currentType = .sleep
            MDBleManager.share.MD_getSleepData()
            self.navigationController?.pushViewController(vc, animated: false)
        }else if indexPath.row == 4{//4获取步数运动信息 "
            vc.currentType = .dataHistory
            MDBleManager.share.MD_getCurrent()
            self.navigationController?.pushViewController(vc, animated:    false)
        }else if indexPath.row == 5{
//            vc.currentType = .dataHistory
            MDBleManager.share.MD_getTodaySportData()
            self.navigationController?.pushViewController(vc, animated:    false)
        }else if indexPath.row == 6{//获取血压信息
            vc.currentType = .bloodPressure
            self.navigationController?.pushViewController(vc, animated: false)
            
        }else if indexPath.row == 7{//获取心率信息
            vc.currentType = .heartRate
            self.navigationController?.pushViewController(vc, animated: false)
            //被动获取
        }else if indexPath.row == 8{//血氧
            vc.currentType = .bloodOxygen
            self.navigationController?.pushViewController(vc, animated: false)
         
            //被动获取
        }else if indexPath.row == 9{//获取血糖
//            MDBleManager.share.MD_getBloodSugarData()
            vc.currentType = .bloodSugar
            self.navigationController?.pushViewController(vc, animated: false)
        }else if indexPath.row == 10{//获取压力历史记录
            
  
            vc.currentType = .pressure
            self.navigationController?.pushViewController(vc, animated: false)
        }else if indexPath.row == 11{
      
            
        }else if indexPath.row == 12{//获取温度历史记录
            vc.currentType = .bodyTemperature
            self.navigationController?.pushViewController(vc, animated: false)
        }else if indexPath.row == 13{//获取生理
            
         
        }else if indexPath.row == 14{//查找设备
            
            MDBleManager.share.MD_findDevice()
            
        }else if indexPath.row == 15{//设置拍照模式
            MDBleManager.share.MD_setCamaraMode(isOpen: true)
             
        }else if indexPath.row == 16{//设置勿扰模式
            bleSelf.noDisturbModel.startTime = dateStringToDate(dateString: "12:34", dateFormat: "HH:mm") ?? Date()
            bleSelf.noDisturbModel.endTime = dateStringToDate(dateString: "16:34", dateFormat: "HH:mm") ?? Date()
            bleSelf.noDisturbModel.isOn = true
 
             MDBleManager.share.MD_Donotdisturb(noDisturbModel: bleSelf.noDisturbModel)
            
        }else if indexPath.row == 17{//设置闹钟
            var alarmArray = [AlarmClock]()
            var alarmClock0 = AlarmClock()
            alarmClock0.timeStamp = 1700490660
            alarmClock0.isOn = true
            alarmClock0 =   MDBleManager.share.MD_setAlarmWeek(alarmClock: alarmClock0, index: 1)
             
            var alarmClock1 = AlarmClock()
            alarmClock1.timeStamp = 1700490660
            alarmClock1.isOn = true
            alarmClock1 =   MDBleManager.share.MD_setAlarmWeek(alarmClock: alarmClock1, index: 0)
            alarmClock1 =   MDBleManager.share.MD_setAlarmWeek(alarmClock: alarmClock1, index: 1)
            alarmClock1 =   MDBleManager.share.MD_setAlarmWeek(alarmClock: alarmClock1, index: 2)
            
            alarmArray.append(alarmClock0)
            alarmArray.append(alarmClock1)
            MDBleManager.share.MD_alarmReminder(array: alarmArray)
            
            
        }else if indexPath.row == 18{//久坐提醒
            let sitModel = LongSitModel.getModel() as!  LongSitModel
            sitModel.isOn = true
            sitModel.startTime = dateStringToDate(dateString: "14:34", dateFormat: "HH:mm") ?? Date()
            sitModel.endTime = dateStringToDate(dateString: "22:34", dateFormat: "HH:mm") ?? Date()
            sitModel.interval = 10
            MDBleManager.share.MD_longSitRemind(sitModel: bleSelf.longSitModel)
            
        }else if indexPath.row == 19{//健康提醒
      
            let vc = HealthReminderViewController()
            self.navigationController?.pushViewController(vc, animated:   false)
            
            
        }else if indexPath.row == 20{//ancs
            
            MDBleManager.share.MD_setANCS(tag: 0, isOn: true)
        }else if indexPath.row == 21{//.屏幕设置"
            
            bleSelf.screenTimeModel.lightDuration = 10 //设置亮度
            bleSelf.screenTimeModel.lightLevel = 3  //设置息屏时长
            bleSelf.screenTimeModel.isOn = true   //设置抬手亮屏
            MDBleManager.share.MD_setScreenTime(screenTimeModel: bleSelf.screenTimeModel)
            vc.currentType = .screent
            self.navigationController?.pushViewController(vc, animated: false)
            
        }else if indexPath.row == 22{//.时间制设置
//            MDBleManager.share.md_sett
          //设置时间制  0 24小时制，1 12小时制
            MDBleManager.share.MD_chargeTimeUnit(timeUnit: 0)
            //设置时间
            MDBleManager.share.MD_setTime()
        }else if indexPath.row == 23{//.振动次数 1-10
            
            MDBleManager.share.MD_vibrationCount(count: 5)
        }else if indexPath.row == 24{//.自动同步
            MDBleManager.share.MD_setAutoSync(isOpen: true)
        }else if indexPath.row == 25{//.心率自动测量
                                           
            bleSelf.autoMeasureModel.startTime = dateStringToDate(dateString: "09:00", dateFormat: "HH:mm") ?? Date()
            bleSelf.autoMeasureModel.startTime = dateStringToDate(dateString: "21:00", dateFormat: "HH:mm") ?? Date()
            bleSelf.autoMeasureModel.interval = 50
            AutoMeasureModel.setModel(bleSelf.autoMeasureModel)
 
            MDBleManager.share.MD_openUploadData(autoMeasureModel: bleSelf.autoMeasureModel)
        
            
        }else if indexPath.row == 26{//.恢复出厂设置
            MDBleManager.share.MD_RestoreFactorySettings()
        }else if indexPath.row == 27{//设置城市
            
            let model = WeatherModel()
            model.timeStamp = 1700467481 + TimeZone.current.secondsFromGMT()
            model.temperature = 20.0
            model.highT = 29
            model.lowT =  14
            model.windSpeed = 4
            model.humidity = 48
            model.visibility = 10
            model.weather = "Clear"
            model.city = "深圳"
            
            MDBleManager.share.MD_setWeatherCity(weatherModel: model)
        }else if indexPath.row == 28{//.设置当前天气
//            bleSelf.setWeatherCity(model.city)
//            bleSelf.setWeatherCurrent(model)
            let model = WeatherModel()
            model.timeStamp = 1700467481 + TimeZone.current.secondsFromGMT()
            model.temperature = 20.0
            model.highT = 29
            model.lowT =  14
            model.windSpeed = 4
            model.humidity = 48
            model.visibility = 10
            model.weather = "Clear"
            model.city = "深圳"
            
            MDBleManager.share.MD_setWeather(weatherModel: model)
           
            self.navigationController?.pushViewController(vc, animated: false)
        }else if indexPath.row == 29{//.设置未来天气 
            var dataArray = [WeatherModel]()
            let model0 = WeatherModel()
            model0.timeStamp = 1700467481 + TimeZone.current.secondsFromGMT()
            model0.temperature = 20.0
            model0.highT = 29
            model0.lowT =  14
            model0.windSpeed = 4
            model0.humidity = 48
            model0.visibility = 10
            model0.weather = "Clear"
            model0.city = "深圳"
            dataArray.append(model0)
            MDBleManager.share.MD_setFutureWeatherCity(dataArray: dataArray)
            self.navigationController?.pushViewController(vc, animated: false)
        }else if indexPath.row == 30{
            
        }else if indexPath.row == 31{//.设置名片
            let vc = CardManageController()
            vc.isBusessCard = true
            self.navigationController?.pushViewController(vc, animated: false)
        }else if indexPath.row == 32{//.设置钱包
            let vc = CardManageController()
            vc.isBusessCard = false
            self.navigationController?.pushViewController(vc, animated: false)
        }else if indexPath.row == 33{//.在线表盘
            let vc = LRecommendController()
           
            self.navigationController?.pushViewController(vc, animated: false)
        }
        else if indexPath.row == 34{//.本地表盘
            let vc = LDialCustomController()
         
            self.navigationController?.pushViewController(vc, animated: false)
        }
        else if indexPath.row == 35{//.OTA
             
            self.getNewFirmware()
            
        }    else if indexPath.row == 36{// 音乐
            let  vc =      LFileManagerController()
            LSingleTool.shared.readSDType = .music
            self.navigationController?.pushViewController(vc, animated: false)
        }    else if indexPath.row == 37{//录音
            let  vc =      LRecordController()
            LSingleTool.shared.readSDType = .record
            self.navigationController?.pushViewController(vc, animated: false)
        }    else if indexPath.row == 38{//电子书
 
            LSingleTool.shared.readSDType = .Ebook
 
            
            let vc = LYinyueController()
            vc.isEbook = true
 
            self.navigationController?.pushViewController(vc, animated: false)
            
        }    else if indexPath.row == 39{//电子相册
//            let  vc =      LFileManagerController()
            LSingleTool.shared.readSDType = .ePhotos
//            self.navigationController?.pushViewController(vc, animated: false)
            let vc = LYinyueController()
//            bleSelf.readSDType = .ePhotos
            vc.isEbook = false
            vc.fileType = .ePhotos
//            LGlobalSingle.shared.isEbook = false
//            bleSelf.isMusic = false
//            bleSelf.readSDType = .ePhotos
            self.navigationController?.pushViewController(vc, animated: false)
        }
        
        
        
    }
    
    
    
    fileprivate func dateStringToDate(dateString:String,dateFormat:String)->Date?{
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = dateFormat

        if let date = dateFormatter.date(from: dateString) {
            print("转换后的日期：\(date)")
            return date
        } else {
            print("日期转换失败")
            return nil
          
        }
       
    }
 
    
    func getNewFirmware() {
        
        
        self.hasNewVersion = false
       
        print("bleSelf.bleModel==\(bleSelf.bleModel.productId)")
        
     
        httpSelf.firmware(bleSelf.bleModel, success: { (result) in
          
            let dic = JSON(result)
          
            let base = BaseModel.init(fromJson: dic)
            if base.status {
                //
                let url = base.data["url"].stringValue
         
                
                let dspUrl = base.data["dspUrl"].stringValue
                self.dspUrl = dspUrl
                if url.count == 0 {
                    print("未发现新固件")
                   
                    return
                }
                //
                
                self.showHudForever(with: self.view, NSLocalizedString("下载中", comment: ""))
           
                
                
                
                
                httpSelf.getWith(url: url, parameters: nil, success: { (data) in
                    
                  
                    let hehe = data as! Data
                    print("data", hehe.count)
                    if hehe.count > 0 {
                        self.hasNewVersion = true
                        let fileName = (NSString.init(string: url).lastPathComponent as String)
                         
                        let tpath = NSSearchPathForDirectoriesInDomains(.cachesDirectory, .userDomainMask, true).first! + "/" + fileName
                        if !FileManager.default.fileExists(atPath: tpath) {
                            FileManager.default.createFile(atPath: tpath, contents: nil, attributes: nil)
                        }
                        
                        self.filePath = tpath
                        let url = URL.init(fileURLWithPath: tpath)
                        try! hehe.write(to: url)
                        if bleSelf.bleModel.chip.contains("C") {
//                            bleSelf.otaType = .m3
                        }
                        
                      
                        
                        UserDefaults.standard.setValue(fileName, forKey: "OTA_FILENAME")
                        self.updateFirmware()
                    }
                    
                }, failure: { (error) in
                    print(error)
                  
                   
                }, progess: { (progress) in
                    print(progress)
                })
            }
            
        }) { (error) in
            print(error)
           
        }
    }
    
    //MARK: updateFirmware
    func updateFirmware() {
        
//        guard bleSelf.judgeCanSend() else { return }
        
        let alert = UIAlertController.init(title: NSLocalizedString("请确保设备电量高于20%", comment: ""), message: nil, preferredStyle: .alert)
        let action = UIAlertAction.init(title: NSLocalizedString("取消", comment: ""), style: .default, handler: { (_) in
            self.dismiss(animated: true, completion: nil)
        })
        alert.addAction(action)
        let action1 = UIAlertAction.init(title: NSLocalizedString("确定", comment: ""), style: .default, handler: { (_) in
            self.dismiss(animated: true, completion: nil)
            self.updateFirmworking()
        })
        alert.addAction(action1)
        self.present(alert, animated: true, completion: nil)
        
    }
    func updateFirmworking(){
        guard let path = self.filePath else { return }
        bleSelf.isEnterOTA = true
        self.progress = MBProgressHUD.showAdded(to: self.view, animated: true)
        self.progress.mode = .determinate
        self.progress.backgroundView.style = MBProgressHUDBackgroundStyle.solidColor
        self.progress.backgroundView.color = UIColor.lightGray
        self.progress.label.text = String.init(format: "%.1f%%", self.progress.progress * 100)
        print(" bleSelf.bleModel.chip\( bleSelf.bleModel)")
        print(" bleSelf.bleModel.chip\( bleSelf.bleModel.chip)")
//        if bleSelf.bleModel.chip.contains("C") {
//            if bleSelf.otaType == .m3 {
//                print("leSelf.otaType == .m3")
//                self.binData = FileManager.default.contents(atPath: path)!
//                self.total = Int(ceil(Double(self.binData.count)/Double(frMaxSendLength)))
//                bleSelf.frOtaType()
//            }
//            if bleSelf.otaType == .dsp {
//                print("leSelf.otaType == .dsp")
//                self.binData = FileManager.default.contents(atPath: path)!
//                self.total = Int(ceil(Double(self.binData.count)/Double(frMaxSendLength)))
//                bleSelf.frDialType()
//            }
//        }
        //TODO: 奉加微
//        if bleSelf.bleModel.chip == "D" {
//            print("leSelf.otaType == 奉加微.D")
//            bleSelf.isEnterOTA = false
//            self.bluetoothManager = PHYBLEManager.shareInstance()
//            self.bluetoothManager.myCentralManager = bleSelf.bleManager.myCentralManager!
//            self.bluetoothManager.delegate = self
//            print("奉佳微升级MAC地址：" + bleSelf.bleModel.macAdvertisementData)
//            print("奉佳微升级MAC地址_反转：" + bleSelf.bleModel.mac)
//            
//            self.bluetoothManager.initOTA()
//            self.bluetoothManager.selectFilePath(path)
//            self.bluetoothManager.connectedDeviceOTA(bleSelf.bleManager.myPeripheral!, mac: bleSelf.bleModel.macAdvertisementData)
//            
//        }
          if bleSelf.bleModel.chip == "F" {
            print("leSelf.otaType == 杰里.F")
            let fileName = NSString.init(string:path).lastPathComponent
            let lastZip = fileName.replacingOccurrences(of: ".zip", with: "")
            let lastPath = JL_Tools.listPath(.cachesDirectory, middlePath: lastZip, file: "")
            let zipArr = FatfsObject.unzipFile(atPath: path, toDestination: lastPath)
            //            let cachePath2 = NSHomeDirectory() + "/Library/Caches"
            //           print("cachePath2====\(cachePath2)")
            //           guard let fileName = UserDefaults.standard.string(forKey: "OTA_FILENAME") else {
            //               print("000====fileName====是空的")
            //               return
            //
            //           }
            //
            //
            //           let filePath =  cachePath2 + "/" + fileName
            //            print("000====filePath====filePath==\(filePath)")
            //           let result = LTools.L_getContentOfFile(atPath: filePath)
            //            print("000====result====result==\(String(describing: result))")
            //           let lastZip = filePath.replacingOccurrences(of: ".zip", with: "")
            //            print("000====lastZip====lastZip==\(lastZip)")
            //           if !FileManager.default.fileExists(atPath: lastZip) {
            //               FileManager.default.createFile(atPath: lastZip, contents: nil, attributes: nil)
            //           }
            //
            //
            //
            //           let zipArr = FatfsObject.unzipFile(atPath: filePath, toDestination: lastZip)
        
            Async.main(after: 10) { [unowned self] in
                guard zipArr.count > 0 else { return }
               
                guard let zipArray = JL_Tools.subPaths(lastPath) as? [String] else { return }
                
                
                
                guard let name = zipArray.first(where: {$0.hasSuffix(".ufw")}) else {
                    
                    return
                    
                }
               
                let dataPath = lastPath + "/" + name
                
                guard let data = FileManager.default.contents(atPath: dataPath), data.count > 0 else { return }
                
                self.binData = data
                self.jlCmdOTAData()
            }
        }
//        else {
//            print("leSelf.otaType == RTKOTAProfile")
//            self.otaProfile = RTKOTAProfile()
//            self.otaProfile.delegate = self
//        }
        
        self.upAsync = Async.main(after: 30) { [unowned self] in
            self.progress.hide(animated: true)
            self.progress.progress = 0
             print("升级失败")
            self.hasNewVersion = false
        }
    }
    
    func jlCmdOTAData(){
        
        guard let otaManager = LSingleTool.shared.jlCentralManager?.mAssist.mCmdManager.mOTAManager else { return }
              
        
        otaManager.cmdOTAData(self.binData) {
            result, p in
            print("cmdOTAData", result.rawValue, p)
            if (result == JL_OTAResult.preparing || result == JL_OTAResult.upgrading) {
                self.upAsync?.cancel()
                self.progress.progress = p
                self.progress.label.text = String.init(format: "%.1f%%", p * 100)
            }
            else if (result == JL_OTAResult.prepared) {
                print("---> 检验文件【完成】")
            }
            else if (result == JL_OTAResult.reconnect) {
                print("---> OTA正在回连设备... %@", bleSelf.bleModel.mac)
            }
            else if (result == JL_OTAResult.reconnectWithMacAddr) {
                self.progress.hide(animated: true)
                self.showHudForever(with: self.view,  "OTA正在回连设备......" )
                
                guard let model = LSingleTool.shared.jlCentralManager?.mAssist.mCmdManager.outputDeviceModel() else { return }
                bleSelf.bleManager.jlLastBleMacAddress = model.bleAddr
                print("---> OTA正在通过Mac Addr方式回连设备... %@    %@", bleSelf.bleModel.mac, bleSelf.bleManager.jlLastBleMacAddress)
                
                //TODO:--- 记录原mac地址
                UserDefaults.standard.setValue(bleSelf.bleManager.jlLastBleMacAddress, forKey: "ndbmacaddress")
                
                //TODO: 记录ota状态
                UserDefaults.standard.setValue(1, forKey: kisOTAing)
                
                bleSelf.bleModels.removeAll()
                bleSelf.bleManager.startFindBleDevices()
            }
            else if (result == JL_OTAResult.success) {
                bleSelf.bleManager.stopFindBleDevices()
                bleSelf.isEnterOTA = false
                self.hasNewVersion = false
//                self.table.reloadData()
                self.showHud( "升级成功!" )
                self.progress.hide(animated: false)
              
              
                UserDefaults.standard.removeObject(forKey: "ndbmacaddress")
                UserDefaults.standard.setValue(0, forKey: kisOTAing)
                
            }
            else if (result == JL_OTAResult.reboot) {
                self.progress.hide(animated: false)
                Async.main(after: 2) {
                    bleSelf.reConnectDevice()
                }
                Async.main(after: 3) { [unowned self] in
                    
                }
            } else if (result == JL_OTAResult.fail) {
                bleSelf.isEnterOTA = false
                self.progress.hide(animated: false)
                
                if result.rawValue == 6{
                    print("设备电量低")
                 
                }else{
                    print("升级失败")
                  
                }
                Async.main(after: 2) {
                    bleSelf.reConnectDevice()
                }
                Async.main(after: 3) { [unowned self] in
                  
                }
            }
        }
    }
}
