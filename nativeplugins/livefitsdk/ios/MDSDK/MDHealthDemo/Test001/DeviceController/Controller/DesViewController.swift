//
//  DesViewController.swift
//  Test001
//
//  Created by GJD on 2023/11/24.
//

import UIKit
import RealSDK
public enum NotiType: Int {
    case  disonnnect
    case  battery
    case  deviceInfo
    case  sleep
    case  dataHistory
    case  sportHistrry
    case  bloodPressure
    case  heartRate
    case  bloodOxygen
    case  bloodSugar
    
    case  pressure
    case  breath
    case  bodyTemperature
    case physiological
    case findDevice
    case camera
    case  notDisturb
    case  alarmClock
    case  sedentaryReminde
    case healthReminder
    
    case  message
    case  screent
    case  timeUnit
    case  vibration
    case automaticSynchronization
    case automaticMeasurement
    case  factoryReset
    
    
    case  setCity
    
    case  setCurrentWeather
    case  setFutureWeather
    
    case  setLan
    
}
class DesViewController: UIViewController {
    
    @IBOutlet weak var desLabel: UILabel!
    var currentType = NotiType.disonnnect
    
    var  sleepString = ""
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        
        setupNotify()
        switch currentType {
        case .deviceInfo:
            let nameString = "name: " +  bleSelf.bleModel.name
            let macString = "mac: " +  bleSelf.bleModel.mac
            let uuIdString = "uuid:" +  bleSelf.bleModel.uuidString
            
            
            desLabel.text = nameString + "\n" + macString  + "\n" + uuIdString
            
            print("bleSelf.bleModel.productID===\(bleSelf.bleModel.productId)")
            print("bleSelf.bleModel.deviceVersion===\(bleSelf.bleModel.deviceVersion)")
        case .screent:
            let lightLevelString = bleSelf.screenTimeModel.lightLevel.description
            let lightDurationString = bleSelf.screenTimeModel.lightDuration.description
            var isOpenString = ""
            if bleSelf.screenTimeModel.isOn == true{
                isOpenString = "打开了抬手息屏"
            }else{
                isOpenString = "关闭了抬手息屏"
            }
            desLabel.text = "亮度等级改为" + lightLevelString  + "\n" +   "息屏时长改为" + lightDurationString + "\n" + isOpenString
            
        case .bloodOxygen:
            desLabel.text = "请打开手表开始测量血氧"
        case .bloodPressure:
            desLabel.text = "请打开手表开始测量血压"
        case .heartRate:
            desLabel.text = "请打开手表开始测量心率"
            
        case .bloodSugar:
            desLabel.text = "请打开手表开始测量血糖"
        case .pressure:
            desLabel.text = "请打开手表开始测量压力"
        case .breath:
            desLabel.text = "请打开手表开始测量呼吸"
            
        case .bodyTemperature:
            desLabel.text = "请打开手表开始测量体温"
            
            
        default:
            print("")
        }
        
    }
    
    func setupNotify() {
        
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.readyToWrite, object: nil)
        switch currentType {
        case .disonnnect:
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.disconnected, object: nil)
        case .battery:
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.batteryLevel, object: nil)
        case .deviceInfo:
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.deviceInfo.notify, object: nil)
        case .sleep:
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.sleep, object: nil)
        case .dataHistory:
            //            datacurrent
            
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.datacurrent, object: nil)
        case .heartRate:
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.xinlv, object: nil)
        case .bloodPressure:
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.xueya, object: nil)
        case .bloodOxygen:
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.xueyang, object: nil)
        case .pressure:
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.yali, object: nil)
        case .bloodSugar  :
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.xieTangUpdata, object: nil)
            
            
        case .bodyTemperature:
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.tiwenUpdata, object: nil)
            
            
        case .findDevice:
            print("physiological")
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.findPhoneOrTakePic.notify, object: nil)
        case .camera:
            print("physiological")
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.findPhoneOrTakePic.notify, object: nil)
        case .notDisturb:
            print("notDisturb")
            
        case .sedentaryReminde:
            print("sedentaryReminde")
            
        case .healthReminder:
            print("healthReminder")
            
        case .screent:
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name:CommandType.screenTimePeriod.notify, object: nil)
        case .timeUnit:
            print("timeUnit")
        case .vibration:
            print("vibration")
        case .automaticSynchronization:
            print("automaticSynchronization")
        case .automaticMeasurement:
            print("automaticMeasurement")
        case .factoryReset:
            print("factoryReset")
            
            
            
            
        case .sportHistrry:
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.sportHistoryData, object: nil)
            NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.dataHistory.notify, object: nil)
        default:
            print("=========")
        }
        
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.dataCurrent.notify, object: nil)
        
        
    }
    
    @objc func handle(_ notify: Notification) {
        if notify.name == WUBleManagerNotifyKeys.disconnected {
            
            
        }
        if notify.name == WUBleManagerNotifyKeys.datacurrent {
            let  stepString = "当前步数是:" + bleSelf.stepInfo.step.description
            let  distanceString = "当前行走路程是:" + bleSelf.stepInfo.distance.description
            let  calString = "当前消耗卡路里是:" + bleSelf.stepInfo.cal.description
            
            Async.main(after: 0.2) {
                self.desLabel.text = stepString + "\n" + distanceString  + "\n" + calString
            }
            
        }
        if notify.name == WUBleManagerNotifyKeys.disconnected {
            print("断开连接")
            desLabel.text = "断开了连接"
        }
        if notify.name == WUBleManagerNotifyKeys.batteryLevel {
            print("batteryLevel==\(bleSelf.batteryInfo.value)")
            let  batteryInfoString = "当前电量是:" + bleSelf.batteryInfo.value.description
            
            Async.main(after: 0.2) {
                self.desLabel.text = batteryInfoString
            }
        }
        //接收到屏幕数据改变
        if notify.name == CommandType.screenTimePeriod.notify{
            print("接收到数据CommandType.screenTimePeriod")
            let lightLevelString = bleSelf.screenTimeModel.lightLevel.description
            let lightDurationString = bleSelf.screenTimeModel.lightDuration.description
            var isOpenString = ""
            if bleSelf.screenTimeModel.isOn == true{
                isOpenString = "打开了抬手息屏"
            }else{
                isOpenString = "关闭了抬手息屏"
            }
            desLabel.text = "亮度等级改为" + lightLevelString  + "\n" +   "息屏时长改为" + lightDurationString + "\n" + isOpenString
            
        }
        if notify.name == WUBleManagerNotifyKeys.xueyang {
            if let userInfo = notify.userInfo,  let oxyModle = userInfo["xueyang"] as? OxygenModel {
                print("oxyModle====\(oxyModle.oxygen)")
                let  xueyangString = "当前血氧是:" + oxyModle.oxygen.description
                Async.main(after: 0.2) {
                    self.desLabel.text = xueyangString
                }
                
            }
            
        }
        if notify.name == WUBleManagerNotifyKeys.step{
            if let userInfo = notify.userInfo,  let stepModle = userInfo["step"] as? StepModel {
                print("step====\(stepModle.step)")
                print("xinlv====\(stepModle.distance)")
            }
        }
        if notify.name == WUBleManagerNotifyKeys.xinlv {
            
            if let userInfo = notify.userInfo,  let xinLvModle = userInfo["xinlv"] as? HeartModel {
                print("xinlv====\(xinLvModle.heart)")
                print("xinlv====\(xinLvModle.timeStamp)")
                let  xinlvString = "当前心率是:" + xinLvModle.heart.description
                
                Async.main(after: 0.2) {
                    self.desLabel.text = xinlvString
                }
            }
        }
        if notify.name == WUBleManagerNotifyKeys.xueya {
            if let userInfo = notify.userInfo,  let xueyaModle = userInfo["xueya"] as? BloodModel {
                
                let maxString = "高压是:" + xueyaModle.max.description
                let minString = "低压是:" + xueyaModle.min.description
                Async.main(after: 0.2) {
                    
                    self.desLabel.text = maxString + "\n" + minString
                }
            }
            
        }
        if notify.name == WUBleManagerNotifyKeys.sportDayData {
            
            if let userInfo = notify.userInfo,  let sporModle = userInfo["sportdaydata"] as? StepModel {
                print("sporModle====\(sporModle.step)")
            }
        }
        
        if notify.name == WUBleManagerNotifyKeys.deviceList {
            
            
        }
        if notify.name == CommandType.timeUnit.notify {
            print("监听到数据同步===============")
            MDBleManager.share.MD_getCurrent()
            Async.main(after: 0.2) {
                MDBleManager.share.MD_getMeasureHistory()
                
            }
        }
        
        if notify.name == CommandType.dataHistory.notify {
            print("aa11获取运动数据----dataHistory")
            print("aa11获取运动数据----\( notify.userInfo)")
            if let userInfo = notify.userInfo,  let model = userInfo["sportdaydata"] as?  SportModel  {
                
                print("Received sportMode data: \(model.sportMode)")
                Async.main(after: 0.2) {
                    let  stepString = "当前step是:" + model.step.description
                    self.desLabel.text = stepString
                }
                
                
            }
        }
        
        
        
        if notify.name == WUBleManagerNotifyKeys.sleep {
            
            if let userInfo = notify.userInfo,  let sleepDataArray = userInfo["sleepdata"] as? [SleepModel] {
                print("sleepString=\(sleepString )")
                for model  in sleepDataArray {
                    
                    print("model=\(model.hour )")
                    print("model=\(model.min )")
                }
                
            }
        }
        
        
        if notify.name == WUBleManagerNotifyKeys.xieTangUpdata {
            print("获取血糖数据==\(notify )")
            if let userInfo = notify.userInfo,  let xueTangModel = userInfo["xuetang"] as?  XueTangModel {
                let  xuetangString = "当前血糖是:" + xueTangModel.xtValue.description
                
                Async.main(after: 0.2) {
                    self.desLabel.text = xuetangString
                }
                
            }
        }
        if notify.name == WUBleManagerNotifyKeys.tiwenUpdata {
            print("获取体温数据==\(notify )")
            if let userInfo = notify.userInfo,  let tiwenModel = userInfo["tiwen"] as? TiWenModel {
                let tiwenString = "当前体温是:\(tiwenModel.tiWenValue)"
                Async.main(after: 0.2) {
                    self.desLabel.text = tiwenString
                }
            }
        }
        if notify.name == WUBleManagerNotifyKeys.yali {
            print("获取压力数据==\(notify )")
            if let userInfo = notify.userInfo,  let yaliModel = userInfo["yali"] as? HuXiModel {
                let yaliString = "当前压力是:" + yaliModel.oxygen.description
                
                Async.main(after: 0.2) {
                    self.desLabel.text = yaliString
                }
                
            }
        }
        
        
        if notify.name == WUBleManagerNotifyKeys.sportDayData {
            print("获取StepModel数据==\(notify )")
            if let userInfo = notify.userInfo,  let stepModel = userInfo["sportdaydata"] as? StepModel {
                print("Received stepModel data: \(stepModel.distance)")
                
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
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}
