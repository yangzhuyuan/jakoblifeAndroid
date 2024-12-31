//
//  ViewController.swift
//  Test001
//
//  Created by GJD on 2023/11/16.
//

import UIKit
import RealSDK
import CoreBluetooth
class ViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupNotify()
//        let dict = [
//          "name": "Jack",
//          "age": "30",
//          "gender": "male"
//        ]
//        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:yourDictionary
//                                                           options:NSJSONWritingPrettyPrinted
//                                                             error:&error];
//
//
//        let str = JSON.stringify(dict);
//        console.log(str); // {"name":"Jack","age":30,"gender":"male"}
    }
    func setupNotify() {
//        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.getWeather, object: nil)
        
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
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.sportHistory.notify, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.findPhoneOrTakePic.notify, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.huxiHistory.notify, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.huxiHistory.notify, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.tiwen.notify, object: nil)
        
        
        
        //        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.physiologicalCycle.notify, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: WUBleManagerNotifyKeys.jlOTAUpgrade, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.screenTimePeriod.notify, object: nil)
    }
    @objc func handle(_ notify: Notification) {
        
        if notify.name == CommandType.batteryLevel.notify {
            print("获取到电量")
            print(bleSelf.batteryInfo.value)
            
        }
    }
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        
        MDBleManager.share.MD_registerAuthorBle()
        
    }
    
    
}
