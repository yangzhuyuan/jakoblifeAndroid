//
//  NDBNetworkManager.swift
//  LifeFit
//
//  Created by GJD on 2023/6/27.
//  Copyright © 2023 wujunjie. All rights reserved.
//  

import UIKit
import Alamofire
 
enum NetworkError: Error {
    case invalidURL
    case invalidResponse
}

class NDBNetworkManager: NSObject {
    static let shared = NDBNetworkManager()
 

    func request(url: String, method: HTTPMethod = .get, parameters: [String: Any]? = nil, success : @escaping (_ responseObject : BaseResModel) -> (),serviceFailture : @escaping ( _ faileModel: BaseResModel) -> (),  failture : @escaping ( _ error : NSError) -> ()) {
      
        var headers:HTTPHeaders
         headers = ["Content-Type": "application/json"]
   
 

        AF.request( "modelBaseUrl" + url, method: method, parameters: parameters, encoding: JSONEncoding.default,
                    headers:headers).response { response in
            print("请求对象--response.request--\(String(describing: response.request))")  // 请求对象
            print(" 服务端返回的数据--response.data--\(String(describing: response.data))")     // 服务端返回的数据
            
            let headerString  =  response.request?.allHTTPHeaderFields
            print("请求头---- \( headerString)")
            let bodtString = String(data:response.request?.httpBody ?? Data(), encoding: .utf8)
            print("请求体---- \( bodtString)")
            print("-----\(response)")
           
         
            switch response.result {
            case .success(let data):
                do {
                    let json = try JSONSerialization.jsonObject(with: data ?? Data(), options: [])
//                    debugPrint("json==\(json)")
                    if let jsonDictionary = json as? [String: Any] {
//                        debugPrint("jsonDictionary==\(jsonDictionary.toJSonString())")
                        let model = BaseResModel.mj_object(withKeyValues: jsonDictionary)
                        if model?.code == 200{
                            success(model ?? BaseResModel())
                        }else{
                            serviceFailture(model ?? BaseResModel())
                        }
                    }
                } catch {
                    print("JSON serialization failed: \(error)")
                }
                break
            case .failure(let data):
                failture(data as NSError)
                break
            default:
                print("未知错误")
            }
        }

    }
    
    func loadRequest(url: String, method: HTTPMethod = .get, parameters: [String: String]? = nil, success : @escaping (_ responseObject : BaseResModel) -> (),serviceFailture : @escaping ( _ faileModel: BaseResModel) -> (),  failture : @escaping ( _ error : NSError) -> ()) {
        AF.request(  url, method: method, parameters: parameters, encoder: JSONParameterEncoder.default,
                    headers: ["Content-Type": "application/json"]).response { response in
            print("请求对象--response.request--\(String(describing: response.request))")  // 请求对象
            print(" 服务端返回的数据--response.data--\(String(describing: response.data))")     // 服务端返回的数据
            
            let headerString  =  response.request?.allHTTPHeaderFields
            print("请求头---- \( headerString)")
            let bodtString = String(data:response.request?.httpBody ?? Data(), encoding: .utf8)
            print("请求体---- \( bodtString)")
            print("-----\(response)")
           
            print("==httpBody---\(response.request?.httpBody?.description)")
            switch response.result {
            case .success(let data):
                do {
                    let json = try JSONSerialization.jsonObject(with: data ?? Data(), options: [])
//                    debugPrint("json==\(json)")
                    if let jsonDictionary = json as? [String: Any] {
                        debugPrint("jsonDictionary==\(jsonDictionary)")
                        let model = BaseResModel.mj_object(withKeyValues: jsonDictionary)
                        if model?.code == 200{
                            success(model ?? BaseResModel())
                        }else{
                            serviceFailture(model ?? BaseResModel())
                        }
                    }
                } catch {
                    print("JSON serialization failed: \(error)")
                }
                break
            case .failure(let data):
                failture(data as NSError)
                break
            default:
                print("未知错误")
            }
        }

    }
    
    
//    func L_uploadImage(url: String,image:UIImage, fileName:String,imageName:String ,success : @escaping (_ responseObject : BaseResModel) -> (),serviceFailture : @escaping ( _ faileModel: BaseResModel) -> (),  failture : @escaping ( _ error : NSError) -> ()) {
//        let urlString = modelBaseUrl + url
//        var headers:HTTPHeaders
//        if appSelf.login.isLogin == true{
//            headers = ["Content-Type":"application/json", "Authorization":appSelf.login.token]
//        }else{
//            headers = ["Content-Type": "application/json"]
//
//        }
//        let imageData : Data = image.jpegData(compressionQuality: 0.5)!
//        //        let imageName: Int = 8888
//        AF.upload(multipartFormData: { multiPart in
//            multiPart.append(imageData, withName:fileName, fileName: imageName + ".jpg", mimeType: "image/jpg")
//        }, to: urlString, method: .post, headers: headers).uploadProgress(queue: .main) { progress in
//
//
//        }.responseJSON { response in
//         print("response==\(response)")
//
//            guard let dict = response.value  as? [String:Any] else{
//                failture(NSError())
//                print("json格式有问题")
//                return
//            }
//            print("dict==\(dict)")
//            let model =  BaseResModel.mj_object(withKeyValues: dict)
//
//            success(model ?? BaseResModel())
//
//        }
//    }
    
//    func L_downLoad(url:String,){
//
//    }
 
}
 
