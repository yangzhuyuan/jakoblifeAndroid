//
//  PHYBLEModel.h
//  OTASDK
//
//  Created by 陈双超 on 2022/6/10.
//  Copyright © 2022 phy. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, OTAType) {
    None = 0,
    /*蓝牙状态*/
    BLENOTActive,           //未检测到蓝牙开启!
    BLEActive,              //成功检测到蓝牙开启!
    LastTaskNotEnd,         //上次升级任务还未完成！
    UnexpectedConnection,   //存在意料之外的BLE连接！
    ChangeFileFail,         //升级途中不能修改OTA文件！
    UnbelievableError,      //理论上不会触发的错误！
    OTAEnd,                 //本轮OTA结束
    RESCANStart,            //二次扫描开始
    RESCANDevice,           //二次扫描找到设备

    DeviceConnecting,       //连接中...
    DeviceConnectFail,      //设备建立连接失败！
    DeviceDisconnected,     //设备连接已经断开！
    
    ServicesDiscovering,    //连接成功，发现服务中...
    SLBServiceFound,        //SLB服务获取成功！发现特性中！
    SBHServiceFound,        //SBH服务获取成功,发现特性中！
    
    SLBOTAConfirm,          //特性确认,SLB升级模式！
    SBHAppConfirm,          //特性确认,SBH App模式！
    SBHOTAConfirm,          //特性确认,SBH OTA模式！
    
    SLBDeviceReady,         //特性Enable成功，SLB设备已准备好！
    SBHOTADeviceReady,      //特性Enable成功，SBH OTA已准备好！
    
    ProgressCallBack,       //进度值返回
    OTADataOver,            //数据发送完毕，确认升级数据中...
    OTACheckFail,           //数据传输完成后，CRC校验失败！
    
    OTAComplete = 99,       //升级成功，可以主动断开或者超时断开！
    
    // 寻找下一个设备时，不需要再连接
    SBHAppOver = 100,       //App模式结束，等待二次扫描
    
    // 无法进行OTA的错误类型
    OTAServiceNotFound,     //设备缺少OTA的蓝牙服务！
    OTAServiceConfuse,      //同时存在两种升级服务！
    CharacteristicError,    //特性异常!
    MTUConflict,            //不支持该设备:MTUSize不一致！
    NOMACAddress,
    
};


@interface SLBContext : NSObject
@property (nonatomic, assign) int mMesgNumb;//封装数据时添加的帧号
@property (nonatomic, assign) NSUInteger dataIndex;//发送数据时的游标

@end

@interface SBHContext : NSObject 
@property (nonatomic, assign) NSUInteger partitionIndex;
@property (nonatomic, assign) NSUInteger blockIndex;//单个Partition中数据游标
@property (nonatomic, assign) NSUInteger flash_addr;
@end

@interface PHYBLEModel : NSObject

@property (nonatomic, strong) CBPeripheral *peripheral;
@property (nonatomic, strong) NSDictionary *advertisementData;
@property (nonatomic, strong) NSNumber     *RSSI;
@property (nonatomic, strong) NSString     *realName;
@property (nonatomic, strong) NSString     *adverMacAddr;
@property (nonatomic, strong) NSDate       *lastUpdateDate;

@property (nonatomic, assign) NSInteger    OTAType;
@property (nonatomic, strong) NSString     *OTAMessage;
@property (nonatomic, assign) int          disconnectTimes;

@property (nonatomic, strong) SLBContext   *mSLBContext;
@property (nonatomic, strong) SBHContext   *mSBHContext;
@property (nonatomic, strong, nullable) NSTimer      *myTimer;
@property (nonatomic, strong) NSMutableArray *bufferArray;

@end


NS_ASSUME_NONNULL_END
