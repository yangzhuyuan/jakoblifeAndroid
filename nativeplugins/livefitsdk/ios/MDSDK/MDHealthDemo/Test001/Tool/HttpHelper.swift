//
//  HttpHelper.swift
//  WearfitPlus
//  
//  Created by WuJunjie on 2017/2/22.
//  Copyright © 2017年 WuJunjie. All rights reserved.
//

import UIKit
import AFNetworking
import RealSDK
let isPrintEnable = !false
let httpSelf = HttpHelper.shared

typealias Success = (Any) -> ()
typealias Failure = (Error) -> ()
typealias progressBlock = (Progress) -> ()
typealias downloadBlock = (Data) -> ()

enum LoginPlatformType: String {
    case winxin
    case QQ
    case facebook
    case twitter
    case linkedin
    case kakaoTalk
}

let kWuDocumentDirectory: String! = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).last
let kAppName = "lefun"
let kTimeOutDuration = 10.0

class HttpHelper: NSObject {
    static let shared = HttpHelper()
    var token = ""
    
    func checkNetwork() -> Bool  {
        if !AFNetworkReachabilityManager.shared().isReachable {
            print("请检查网络状态")
         
        }
        return AFNetworkReachabilityManager.shared().isReachable
    }
    
    class func OTAHomePath() -> String {
        let path = kWuDocumentDirectory + "/com.wu.adorone.ota"
        if !FileManager.default.fileExists(atPath: path) {
            try! FileManager.default.createDirectory(atPath: path, withIntermediateDirectories: true, attributes: nil)
        }
        return path
    }
    
    class func OTAPath(name: String) -> String {
        return OTAHomePath() + "/" + name
    }
    
    class func HaveOTA(name:String) -> Bool {
        let path = OTAPath(name: name)
        return FileManager.default.fileExists(atPath: path)
    }
    
    class func saveOTA(name:String, data:Data) -> Bool {
        let path = OTAPath(name: name)
        let value = NSData.init(data: data)
        return value.write(toFile: path, atomically: true)
    }
    
  
    
   
    

    
    //登录
    func login(_ username: String, password: String, success: @escaping Success, failure: @escaping Failure) {
        let parameters = ["username": username, "password": password]
        let url = baseUrl + "user/login"
        postWith(url: url, parameters: parameters, success: success, failure: failure)
    }
    
    //登出
    func logout(success: @escaping Success, failure: @escaping Failure) {
        let parameters = [String : Any]()
        let url = baseUrl + "user/logout"
        postWith(url: url, parameters: parameters, success: success, failure: failure)
    }
    func firmware(_ model: WUBleModel, success: @escaping Success, failure:@escaping Failure) {
        let parameters = ["version": model.deviceVersion, "productId": model.productId] as [String : Any]
        let url = baseUrl + "firmware/getInfo"
        getWith(url: url, parameters: parameters, success: success, failure: failure)
    }
    
    //app活跃统计
    func userLogin(_ userActiveId: Int, success: @escaping Success, failure: @escaping Failure) {
        let parameters = ["userActiveId": userActiveId]
        let url = baseUrl + "user/setUserLogin"
        postWith(url: url, parameters: parameters, success: success, failure: failure)
    }
    
    //修改头像
    func modifyAvatar(_ avatar:Data, userId: Int, success: @escaping Success, failure:@escaping Failure) {
        let url = baseUrl + "user/setAvatar"
        let manager = AFHTTPSessionManager()
        manager.responseSerializer = AFHTTPResponseSerializer()
        manager.responseSerializer.acceptableContentTypes = ["text/html", "application/json", "text/json", "application/json", "image/jpeg", "image/png", "application/octet-stream"]
        let parameters = ["id": userId.description]
        manager.post(url, parameters: parameters, headers: nil, constructingBodyWith: { (formData:AFMultipartFormData?) in
            print(url)
            formData?.appendPart(withFileData: avatar, name:"avatar", fileName:"avatar.jpg", mimeType: "image/jpeg")
        }, progress: nil, success: { (_, result:Any?) in
            if let value = result {
                print(value)
                success(value)
            }
        }) { (_, error: Error) in
            failure(error)
            print(error.localizedDescription)
        }
    }
 
    func friendFind(_ userId: Int, success: @escaping Success, failure: @escaping Failure) {
        let parameters = ["id": userId]
        let url = baseUrl + "friend/find"
        postWith(url: url, parameters: parameters, success: success, failure: failure)
    }
    
    func friendAdd(_ userId: Int, friendId: Int, success: @escaping Success, failure: @escaping Failure) {
        let parameters = ["userId": userId, "friendId": friendId]
        let url = baseUrl + "friend/add"
        postWith(url: url, parameters: parameters, success: success, failure: failure)
    }
    
    func friendAddList(_ userId: Int, success: @escaping Success, failure: @escaping Failure) {
        let parameters = ["userId": userId]
        let url = baseUrl + "friend/addList"
        postWith(url: url, parameters: parameters, success: success, failure: failure)
    }
    
    func friendAddResponse(_ userId: Int, success: @escaping Success, failure: @escaping Failure) {
        let parameters = ["userId": userId]
        let url = baseUrl + "friend/addResponse"
        postWith(url: url, parameters: parameters, success: success, failure: failure)
    }
    
 
    
 
 
    func getSteps(_ userId: Int, mac: String, startTime: Int, endTime: Int, success: @escaping Success, failure: @escaping Failure) {
        let parameters = ["userId": userId, "mac": mac, "startTime": startTime, "endTime": endTime] as [String : Any]
        let url = baseUrl + "data/getSteps"
        getWith(url: url, parameters: parameters, success: success, failure: failure)
    }
    
    func getHearts(_ userId: Int, mac: String, startTime: Int, endTime: Int, success: @escaping Success, failure: @escaping Failure) {
        let parameters = ["userId": userId, "mac": mac, "startTime": startTime, "endTime": endTime] as [String : Any]
        let url = baseUrl + "data/getHearts"
        getWith(url: url, parameters: parameters, success: success, failure: failure)
    }
    
    func getSleeps(_ userId: Int, mac: String, startTime: Int, endTime: Int, success: @escaping Success, failure: @escaping Failure) {
        let parameters = ["userId": userId, "mac": mac, "startTime": startTime, "endTime": endTime] as [String : Any]
        let url = baseUrl + "data/getSleeps"
        getWith(url: url, parameters: parameters, success: success, failure: failure)
    }
    
    func weather(_ latitude: Double, longitude: Double, success: @escaping Success, failure:@escaping Failure) {
        let identifierStr = "afa57b16fb12a8fea69bc78fb228def2"
        let str = String.init(format: "http://api.openweathermap.org/data/2.5/weather?lat=%@&lon=%@&appid=%@", latitude.description,longitude.description,identifierStr)
        let newStr = str.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)
        postWith(url: newStr!, parameters: nil, success: success, failure: failure)
    }
    
    func weathers(_ latitude: Double, longitude: Double, success: @escaping Success, failure:@escaping Failure) {
        let identifierStr = "afa57b16fb12a8fea69bc78fb228def2"
        let str = String.init(format: "http://api.openweathermap.org/data/2.5/forecast/daily?lat=%@&lon=%@&appid=%@&cnt=4", latitude.description,longitude.description,identifierStr)
        let newStr = str.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)
        postWith(url: newStr!, parameters: nil, success: success, failure: failure)
    }
    
    func app(_ version: Int, versionName: String, success: @escaping Success, failure:@escaping Failure) {
        let parameters = ["versionName": versionName, "version": version, "appName": "LiveFit", "platform": "android"] as [String : Any]
        let url = baseUrl + "app/getInfo"
        getWith(url: url, parameters: parameters, success: success, failure: failure)
    }
    
  
    
   
    
    func checkVersion(success: @escaping Success, failure:@escaping Failure) {
        let url = "https://itunes.apple.com/lookup?id=1582399355"
        postWith(url: url, parameters: nil, success: success, failure: failure)
    }
    
    func getWith(url:String, parameters:[String: Any]?, success:@escaping Success, failure: @escaping Failure) {
        let manager = AFHTTPSessionManager()
        manager.responseSerializer = AFHTTPResponseSerializer()
        manager.requestSerializer = AFHTTPRequestSerializer()
        manager.responseSerializer.acceptableContentTypes = ["text/html", "text/plain", "text/json", "application/json", "application/octet-stream", "text/javascript" ]
        manager.requestSerializer.timeoutInterval = kTimeOutDuration
        manager.get(url, parameters: parameters, headers: nil, progress: nil, success: { (_, result:Any?) in
            if isPrintEnable {
                print("get", JSON(parameters as Any))
                print(url, JSON(result as Any))
            }
            
            if let value = result {
                success(value)
            }
        }) { (_, error: Error) in
            failure(error)
            if isPrintEnable {
                print(url, error)
            }
        }
    }
    
    func getWith(url:String, parameters:[String: Any]?, success:@escaping Success, failure: @escaping Failure, progess: @escaping progressBlock) {
        let manager = AFHTTPSessionManager()
        
        manager.responseSerializer = AFHTTPResponseSerializer()
        manager.requestSerializer = AFHTTPRequestSerializer()
        manager.requestSerializer.timeoutInterval = 30
        manager.responseSerializer.acceptableContentTypes = ["text/html", "text/plain", "text/json", "application/json", "application/octet-stream", "text/javascript"]
      
        manager.get(url, parameters: parameters, headers: nil, progress: { (value) in
        }, success: { (_, result:Any?) in
            if isPrintEnable {
                print("progressBlock", JSON(parameters as Any))
                print(url, JSON(result as Any))
            }
            
            if let value = result {
                success(value)
            }
        }) { (_, error: Error) in
            failure(error)
            if isPrintEnable {
                print(url, error)
            }
        }
    }
    
    func postWith(url:String, parameters: [String: Any]?, success:@escaping Success, failure:@escaping Failure) {
        let manager = AFHTTPSessionManager()
        manager.requestSerializer.timeoutInterval = kTimeOutDuration
        manager.responseSerializer.acceptableContentTypes = ["text/html", "text/plain", "text/json", "application/json", "application/octet-stream", "text/javascript"]
        manager.post(url, parameters: parameters, headers: nil, progress: nil, success: { (_, result:Any?) in
//            print("success======\(result)")
            if isPrintEnable, url.contains(baseUrl + "") {
                print("post", JSON(parameters as Any))
                print(url, JSON(result as Any))
            }
            if let value = result {
                success(value)
            }
        }) { (_, error: Error) in
//            print("error======\(error)")
            failure(error)
            if isPrintEnable {
                print(url, error)
            }
        }
    }
    
    
}
