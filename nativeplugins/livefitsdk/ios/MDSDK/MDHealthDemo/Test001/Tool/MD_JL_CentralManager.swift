//
//  MD_JL_CentralManager.swift
//  Test001
//
//  Created by GJD on 2023/12/29.
//

import UIKit
import CoreBluetooth
import RealSDK
class MD_JL_CentralManager: NSObject {
    static let FLT_BLE_SERVICE: String = "AE00"
    static let FLT_BLE_RCSP_W: String = "AE01"
    static let FLT_BLE_RCSP_R: String = "AE02"
    
    let mAssist: JL_Assist = JL_Assist()
    
    
    func initCentral()  {
        /*--- JLSDK ADD ---*/
//        mAssist = JL_Assist()
        mAssist.mNeedPaired = LSingleTool.shared.ismNeedPaired //_isPaired             //是否需要握手配对
       /*--- 自定义配对码(16个字节配对码) ---*/
       //char pairkey[16] = {0x01,0x02,0x03,0x04,
       //                    0x01,0x02,0x03,0x04,
       //                    0x01,0x02,0x03,0x04,
       //                    0x01,0x02,0x03,0x04};
       //NSData *pairData = [NSData dataWithBytes:pairkey length:16];
        mAssist.mPairKey    = nil             //配对秘钥（或者自定义配对码pairData）
        mAssist.mService    = MD_JL_CentralManager.FLT_BLE_SERVICE //服务号
        mAssist.mRcsp_W     = MD_JL_CentralManager.FLT_BLE_RCSP_W  //特征「写」
        mAssist.mRcsp_R     = MD_JL_CentralManager.FLT_BLE_RCSP_R  //特征「读」
    }
    
    func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?)  {
     
        if (error !=  nil){
            print("Err: Discovered Characteristics fail.");
            return;
            
        }

        /*--- JLSDK ADD ---*/
        self.mAssist.assistDiscoverCharacteristics(for: service, peripheral: peripheral)
    }
    
    func peripheral(_ peripheral: CBPeripheral, didUpdateNotificationStateFor characteristic: CBCharacteristic, error: Error?) {
      
        if (error != nil) {
            print("Err: Update NotificationState For Characteristic fail.");
            return;
        }

        /*--- JLSDK ADD ---*/
        self.mAssist.assistUpdate(characteristic, peripheral: peripheral) { isPaired in
//            if (isPaired) {
//                JL_Tools.post(T##name: String##String, object: <#T##Any?#>)
//            }
            
            if (isPaired) {
                let entity:JL_EntityM = JL_EntityM()
                entity.setBlePeripheral( peripheral)
                self.mAssist.mCmdManager.mEntity = entity
            
                JL_Tools.delay(0.5) {
                    self.getDeviceInfo()
                }
            }
        }
    }
    
    func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
       
        if (error != nil) {
            print("Err: receive data fail.");
            return;
        }
        guard let service = characteristic.service, service.uuid.uuidString == MD_JL_CentralManager.FLT_BLE_SERVICE else { return }
        /*--- JLSDK ADD ---*/
        self.mAssist.assistUpdateValue(for: characteristic)
    }

    
    func    centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?)  {
      
        print("BLE Disconnect ---> Device %@", peripheral.name ?? "");
        /*--- JLSDK ADD ---*/
        self.mAssist.assistDisconnectPeripheral(peripheral)
    }
    
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
   
        print("central.state\(central.state)")
        /*--- JLSDK ADD ---*/
        self.mAssist.assistUpdate(central.state)
    }
    
    func getDeviceInfo() {
       
        
        /*--- 关闭耳机信息推送 ---*/
        self.mAssist.mCmdManager.mTwsManager.cmdHeadsetAdvEnable(false)
        
        /*--- 同步时间戳 ---*/
        self.mAssist.mCmdManager.mSystemTime.cmdSetSystemTime(Date())
        
        /*--- 清理设备音乐缓存 ---*/
        self.mAssist.mCmdManager.mFileManager.cmdCleanCacheType(.USB )
        self.mAssist.mCmdManager.mFileManager.cmdCleanCacheType(.SD_0 )
        self.mAssist.mCmdManager.mFileManager.cmdCleanCacheType(.SD_1 )

        self.mAssist.mCmdManager.cmdTargetFeatureResult() { status, sn, data  in
            if (status == .success) {
                let model = self.mAssist.mCmdManager.outputDeviceModel()
                let upSt = model.otaStatus
                if (upSt == JL_OtaStatus.force) {
                    print("---> 进入强制升级.")
                    NotificationCenter.default.post(name: WUBleManagerNotifyKeys.jlOTAUpgrade, object: nil)
                }else{
                    print("---> 正常升级")
                }
//                JL_OtaStatus upSt = model.otaStatus;
//                if (upSt == JL_OtaStatusForce) {
//                    NSLog(@"---> 进入强制升级.");
//                    [DFUITools showText:@"需要强制升级！" onView:self.view delay:1.0];
//                    [JL_Tools post:@"kJL_OTA_CONNECT" Object:nil];
//
//                    return;
//                }else{
//                    if (model.otaHeadset == JL_OtaHeadsetYES) {
//                        NSLog(@"---> 进入强制升级: OTA另一只耳机.");
//                        [DFUITools showText:@"需要强制升级！" onView:self.view delay:1.0];
//                        [JL_Tools post:@"kJL_OTA_CONNECT" Object:nil];
//                        return;
//                    }
//                }
//                NSLog(@"---> 设备正常使用...");
//                [JL_Tools mainTask:^{
//                    [DFUITools showText:@"设备正常使用" onView:self.view delay:1.0];
                    
                    /*--- 获取公共信息 ---*/
//                    [self->mCmdManager cmdGetSystemInfo:JL_FunctionCodeCOMMON Result:nil];
                self.mAssist.mCmdManager.cmdGetSystemInfo(JL_FunctionCode.COMMON)
//                }];
            }else{
                print("---> ERROR：设备信息获取错误!");
            }
        }
        
        /*--- 获取公共信息 ---*/
//        self.mAssist.mCmdManager.cmdGetSystemInfo(JL_FunctionCode.COMMON)
//                  [weakSelf.mAssist.mCmdManager cmdGetSystemInfo:JL_FunctionCodeCOMMON Result:nil];
    }
    
    func openDialFileSystem() {
         
        /*--- 打开表盘文件系统 ---*/
              //@param manager 命令中心类
        DialManager.openDialFileSystem(withCmdManager: self.mAssist.mCmdManager) { type, progress in
            if (type == .unnecessary) {
                print("无需重复打开表盘文件系统");
                return;
            } else if (type == .fail) {
                print("--->打开表盘文件系统失败!");
                return;
            }
        }
    }
}
