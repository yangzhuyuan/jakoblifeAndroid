//
//  AppDelegate.swift
//  Test001
//
//  Created by GJD on 2023/11/16.
//

import UIKit
import RealSDK

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
   
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        self.window? =  UIWindow(frame: UIScreen.main.bounds)
        self.window?.backgroundColor = UIColor.white
     
        self.window?.rootViewController = UINavigationController(rootViewController: DeviceListController())
        NotificationCenter.default.addObserver(self, selector: #selector(notiHandle(_:)), name: Notification.Name.init(rawValue: "centralManagerDidUpdateState"), object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(notiHandle(_:)), name: Notification.Name.init(rawValue: "didDisconnectPeripheral"), object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(notiHandle(_:)), name: Notification.Name.init(rawValue: "didDiscoverCharacteristicsFor"), object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(notiHandle(_:)), name: Notification.Name.init(rawValue: "didUpdateNotificationStateFor"), object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(notiHandle(_:)), name: Notification.Name.init(rawValue: "didUpdateValueFor"), object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(notiHandle(_:)), name: Notification.Name.init(rawValue: "md_needReConnect"), object: nil)
        LSingleTool.shared.setupManager()
        //        wuCentertManager.delegate = self
        self.window?.makeKeyAndVisible()
        return true
    }
    @objc func notiHandle(_ notify: Notification) {
        
        if  notify.name.rawValue == "centralManagerDidUpdateState"{
            if let userInfo = notify.userInfo,
               let centralManager = userInfo["central"] as? CBCentralManager {
                // 在这里使用 centralManager 对象
                print("11-----centralManagerDidUpdateStateReceived central manager update. State: \(centralManager.state)")
                LSingleTool.shared.jlCentralManager?.centralManagerDidUpdateState(centralManager)
            }
            
        }else if notify.name.rawValue == "didDisconnectPeripheral"{
            if let userInfo = notify.userInfo {
                // 获取 central、peripheral、error 对象
                if let central = userInfo["central"] as? CBCentralManager,
                   let peripheral = userInfo["peripheral"] as? CBPeripheral {
                    // 在这里使用 central、peripheral、error 对象
                    print("2------didDisconnectPeripheralDisconnected peripheral: \(peripheral.identifier.uuidString)  ")
                    LSingleTool.shared.jlCentralManager?.centralManager(central, didDisconnectPeripheral: peripheral, error: nil)
                }
            }
            
        }else if notify.name.rawValue == "didDiscoverCharacteristicsFor"{
            // 从userInfo中获取对象
            if let userInfo = notify.userInfo {
                // 获取 peripheral、service、error 对象
                if let peripheral = userInfo["peripheral"] as? CBPeripheral,
                   let service = userInfo["service"] as? CBService  {
                    // 在这里使用 peripheral、service、error 对象
                    print("3-------didDiscoverCharacteristicsForDiscovered characteristics for service: \(service.uuid.uuidString) on peripheral: \(peripheral.identifier.uuidString) ")
                    
                    LSingleTool.shared.jlCentralManager?.peripheral(peripheral, didDiscoverCharacteristicsFor: service, error: nil)
                }
            }
            
        }else if notify.name.rawValue == "didUpdateNotificationStateFor"{
            if let userInfo = notify.userInfo {
                // 获取 peripheral、characteristic、error 对象
                if let peripheral = userInfo["peripheral"] as? CBPeripheral,
                   let characteristic = userInfo["characteristic"] as? CBCharacteristic {
                    // 在这里使用 peripheral、characteristic、error 对象
                    print("44-----didUpdateNotificationStateForNotification state updated for characteristic: \(characteristic.uuid.uuidString) on peripheral: \(peripheral.identifier.uuidString) ")
                    LSingleTool.shared.jlCentralManager?.peripheral(peripheral, didUpdateNotificationStateFor: characteristic, error: nil
                    )
                }
            }
        }else if notify.name.rawValue == "didUpdateValueFor"{
            if let userInfo = notify.userInfo {
                // 获取 peripheral、characteristic、error 对象
                if let peripheral = userInfo["peripheral"] as? CBPeripheral,
                   let characteristic = userInfo["characteristic"] as? CBCharacteristic  {
                    // 在这里使用 peripheral、characteristic、error 对象
                   
                    
                    LSingleTool.shared.jlCentralManager?.peripheral(peripheral, didUpdateValueFor: characteristic, error: nil)
                }
            }
        }else if notify.name.rawValue == "md_needReConnect"{
            if let userInfo = notify.userInfo {
                // 获取 peripheral、characteristic、error 对象
                if let data = userInfo["data"] as? Data,
                   let jlLastBleMacAddress = userInfo["jlLastBleMacAddress"] as? String  {
                    // 在这里使用 data、jlLastBleMacAddress 对象
                    let needReConnect = JL_BLEAction.otaBleMacAddress(jlLastBleMacAddress, isEqualToCBAdvDataManufacturerData: data)
                    if (needReConnect) {
                        bleSelf.bleManager.jlLastBleMacAddress = ""
                        //                        self.jlLastBleMacAddress = ""
                        if let peripheral = userInfo["peripheral"] as? CBPeripheral{
                            MDBleManager.share.MD_reConnectDeviceWithperipheral(peripheral: peripheral)
                        }
                        
                        //                        self.connectBleDevice(peripheral)
                    }
                }
            }
        }
        
    }
    
    
    func applicationWillEnterForeground(_ application: UIApplication) {
        
        MDBleManager.share.MD_reConnectDevice()
    }
}

