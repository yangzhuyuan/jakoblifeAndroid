//
//  DeviceListController.swift
//  MDSDKDemo
//
//  Created by GJD on 2023/11/16.
//

import UIKit
import RealSDK
class DeviceListController: UIViewController,UITableViewDelegate,UITableViewDataSource {
    
    fileprivate let kDevicesListCell = "DevicesListCell"
    var settingArray = [Async]()
    var timer: Timer?
    @IBOutlet weak var deviceTable: UITableView!
    var bleModels = [WUBleModel]()
    override func viewDidLoad() {
        super.viewDidLoad()
        self.fd_prefersNavigationBarHidden = true
        MDBleManager.share.MD_registerAuthorBle()
        
        deviceTable.delegate = self
        deviceTable.dataSource = self
        deviceTable.register(UINib(nibName: "DevicesListCell", bundle: nil), forCellReuseIdentifier: kDevicesListCell)
       
        timer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(timerAction), userInfo: nil, repeats: true)
        
       
        setupNotify()
       
      
        
    }
    func setupNotify() {
        //        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.getWeather, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.connected, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.disconnected, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.sleep, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.on, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.off, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.connected, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.disconnected, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.readyToWrite, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.deviceInfo.notify, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.time.notify, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.batteryLevel.notify, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.userInfo.notify, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.dataCurrent.notify, object: nil)
        //TODO: 睡眠
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.sleep.notify, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.dataHistory.notify, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.measureHistory.notify, object: nil)
       
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.findPhoneOrTakePic.notify, object: nil)
       
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.tiwen.notify, object: nil)
        
        
        
        ///测量
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.xueyang, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.xueya, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.xinlv, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.tiwenUpdata, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.xieTangUpdata, object: nil)
      
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.yali, object: nil)
       
      
        
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.screenTimePeriod.notify, object: nil)
        
        ///连接状态改变
        NotificationCenter.default.addObserver(self, selector:  #selector(handle(_:)), name: WUBleManagerNotifyKeys.stateChanged, object: nil)
        
    }
    
    @objc func timerAction() {
       
        self.deviceTable.reloadData()
    }
    
    ///停止定时器
    func stopTimer() {
        timer?.invalidate()
    }
    
    @IBAction func getDeviceList(_ sender: UIButton) {
        MDBleManager.share.MD_searchDevices()
    }
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 80
    }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return bleSelf.bleModels.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: kDevicesListCell, for: indexPath) as! DevicesListCell
        cell.bleModel = bleSelf.bleModels[indexPath.row]
        return cell
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        bleSelf.bleManager.jlLastBleMacAddress = ""
        let bleModel = bleSelf.bleModels[indexPath.row]
        print(" bleModel.deviceVersion==\( bleModel.deviceVersion)")
        print(" bleModel.productId==\( bleModel.productId)")
        MDBleManager.share.MD_connectBle(model: bleModel)
        bleSelf.bleModel.isFirstConnected = true
        self.stopTimer()
        let vc = MDDeviceController()
        self.navigationController?.pushViewController(vc, animated: false)
    }
    @objc func handle(_ notify: Notification) {
        
        if notify.name == WUBleManagerNotifyKeys.on {
            
            MDBleManager.share.MD_reConnectDevice()
        }
        if notify.name == CommandType.screenTimePeriod.notify{
            print("接收到数据CommandType.screenTimePeriod")
       
            
        }
        if notify.name == WUBleManagerNotifyKeys.connected {
            print("连接成功")
            stopTimer()
            self.navigationController?.pushViewController(MDDeviceController(), animated: false)
        }
        if notify.name == WUBleManagerNotifyKeys.deviceInfo {
            print("获取设备信息==\(bleSelf.bleModel.mac)")
        }
        
        if notify.name == WUBleManagerNotifyKeys.disconnected {
          
            print("断开连接")
  
 
        }
        if notify.name == WUBleManagerNotifyKeys.on {
            print(" WUBleManagerNotifyKeys.on")
           
            
        }
        if notify.name == WUBleManagerNotifyKeys.off {
            print(" WUBleManagerNotifyKeys.off")
            
        }
        if notify.name == WUBleManagerNotifyKeys.xueya {
            print("xueyaModle====\(notify.userInfo)")
            if let userInfo = notify.userInfo,  let xueyaModle = userInfo["xueya"] as? BloodModel {
                print("xueyaModle====\(xueyaModle.timeStamp)")
                print("xueyaModle====\(xueyaModle.min)")
                print("xueyaModle====\(xueyaModle.max)")
            }
            
        }
        if notify.name == WUBleManagerNotifyKeys.xueyang {
            if let userInfo = notify.userInfo,  let oxyModle = userInfo["xueyang"] as? OxygenModel {
                print("oxyModle====\(oxyModle.oxygen)")
            }
            
        }
        if notify.name == WUBleManagerNotifyKeys.xinlv {
            
            if let userInfo = notify.userInfo,  let xinLvModle = userInfo["xinlv"] as? HeartModel {
                print("xinlv====\(xinLvModle.heart)")
            }
        }
        if notify.name == WUBleManagerNotifyKeys.batteryLevel {
            print("batteryLevel==\(bleSelf.batteryInfo.value)")
            
        }
        if notify.name == WUBleManagerNotifyKeys.deviceList {
            
            
        }
        if notify.name == CommandType.time.notify {
            print("监听到数据同步===============")
            MDBleManager.share.MD_getCurrent()
            Async.main(after: 0.2) {
                MDBleManager.share.MD_getMeasureHistory()
                
            }
        }
        if notify.name == CommandType.dataHistory.notify {
            print("aa11获取运动数据----dataHistory")
            
        }
        if notify.name == CommandType.sportHistory.notify {
            print("aa13获取运动数据---sportHistory")
            
        }
    
        
        if notify.name == WUBleManagerNotifyKeys.sleep {
          
            if let userInfo = notify.userInfo,  let sleepDataArray = userInfo["sleepdata"] as? [SleepModel] {
                
            }
        }
        
        
        
        
        if notify.name == WUBleManagerNotifyKeys.xieTangUpdata {
           
            if let userInfo = notify.userInfo,  let xueTangModel = userInfo["xuetang"] as?  HuXiModel {
                print("获血糖数据==\(xueTangModel.oxygen)")
            }
        }
        if notify.name == WUBleManagerNotifyKeys.tiwenUpdata {
            print("获取体温数据==\(notify )")
            if let userInfo = notify.userInfo,  let tiwenModel = userInfo["tiwen"] as? HuXiModel {
                print("获取体温数据=\(tiwenModel.oxygen)")
            }
        }
        if notify.name == WUBleManagerNotifyKeys.sleep {
           
             
        }
   
        
        if notify.name == WUBleManagerNotifyKeys.sportDayData {
            print("获取StepModel数据==\(notify )")
            if let userInfo = notify.userInfo,  let stepModel = userInfo["sportdaydata"] as? StepModel {
                print("Received stepModel data: \(stepModel.distance)")
                
            }
        }
        if notify.name == WUBleManagerNotifyKeys.sportHistoryData {
            print("获取sportMode数据==\(notify )")
            if let userInfo = notify.userInfo,  let model = userInfo["sporthistorydata"] as?  SportModel  {
                
                print("Received sportMode data: \(model.sportMode)")
                
                
            }
        }
        if notify.name == CommandType.deleteData.notify {
            print("删除历史记录")
            
        }
        
        if  notify.name == CommandType.findPhoneOrTakePic.notify {
            
            guard let model = notify.object as? Int else {
                return
            }
            
            if model == 2 {//拍照
                print("拍照")
            }
        }
      
        
    }
   
}
