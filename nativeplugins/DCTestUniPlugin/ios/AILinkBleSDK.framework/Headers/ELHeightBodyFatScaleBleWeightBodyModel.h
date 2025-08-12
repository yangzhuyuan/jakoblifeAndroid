//
//  ELHeightBodyFatScaleBleWeightBodyModel.h
//  AILinkBleSDK
//
//  Created by cliCk on 2021/3/25.
//  Copyright © 2021 IOT. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/** 体脂数据对象模型 */
@interface ELHeightBodyFatScaleBleWeightBodyModel : NSObject

///Body fat rate, need / 10(体脂率,需要/10)
@property (nonatomic, assign) NSUInteger bfr;
///Subcutaneous fat rate, need / 10(皮下脂肪率,需要/10)
@property (nonatomic, assign) NSUInteger sfr;
///Visceral fat rate with an accuracy of 1(内脏脂肪率,精度为1)
@property (nonatomic, assign) NSUInteger uvi;
///Muscle rate, need / 10(肌肉率,需要/10)
@property (nonatomic, assign) NSUInteger rom;
///Basal metabolic rate with an accuracy of 1(基础代谢率,精度为1)
@property (nonatomic, assign) NSUInteger bmr;
///Body age with an accuracy of 1(身体年龄,精度为1)
@property (nonatomic, assign) NSUInteger bodyAge;
///Bone quality, need / 10(骨骼质量,需要/10)
@property (nonatomic, assign) NSUInteger bm;
///Water content, need / 10(水含量,需要/10)
@property (nonatomic, assign) NSUInteger vwc;
///Protein rate, need / 10(蛋白率,需要/10)
@property (nonatomic, assign) NSUInteger pp;
///BMI 需要/10
@property (nonatomic, assign) NSUInteger BMI;
///Heart rate with an accuracy of 1(心率,精度为1)
@property (nonatomic, assign) NSUInteger heartRate;
///肥胖等级
@property (nonatomic, assign) NSUInteger obesityGrade;


@end

NS_ASSUME_NONNULL_END
