//
//  PHYBLEManager.h
//  OTASDK
//
//  Created by 陈双超 on 2022/6/9.
//  Copyright © 2022 phy. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import <OTASDK/PHYBLEModel.h>


NS_ASSUME_NONNULL_BEGIN

/**
 *  蓝牙管理器中心协议
 */
@protocol PHYBLEManagerDelegate <NSObject>

@required

- (void)centerMessage:(NSString *)message code:(NSUInteger)code;

- (void)deviceFound:(NSArray *)devicesArray;

- (void)listenNotify:(CBPeripheral *)peripheral message:(NSString *)message code:(NSUInteger)code;

@end

@interface PHYBLEManager : NSObject

@property (nonatomic, weak, nullable) id <PHYBLEManagerDelegate> delegate;

@property (nonatomic, strong) NSMutableArray *deviceArray;//待升级设备列表

@property (nonatomic, strong) CBCentralManager *myCentralManager;

+ (instancetype)shareInstance;

- (void)startScan;
- (void)stopScan;
- (BOOL)isScanning;

/**
 otaDevices是由UUIDString为元素构成的数组
 */
- (BOOL)addDevices:(NSArray *)otaDevices;

//
- (void)connectedDeviceOTA:(CBPeripheral *)peripheral mac:(NSString *)address;

- (void)selectFilePath:(NSString *)filePath;

- (void)initOTA;

- (void)tryStartOTA;

- (void)setAESKey:(NSString *)key;

@end

NS_ASSUME_NONNULL_END
