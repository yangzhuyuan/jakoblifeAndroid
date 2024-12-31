//
//  NDBNetworkTool.swift
//  LifeFit
//
//  Created by GJD on 2023/5/30.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
class NDBNetworkTool: NSObject {

    /**
     Alamofire请求选项设置
     */
    static let shared: Alamofire.Session = {
        let configuration = URLSessionConfiguration.af.default;
        configuration.timeoutIntervalForRequest = TimeInterval(15);//15秒超时
//        let manager  = ServerTrustPolicyManager(policies: [Api_vpn_baseURL : .disableEvaluation])
        let manager = ServerTrustManager(evaluators: ["www.m-livefit.com": DisabledTrustEvaluator(), ])
//////
//////    let configuration = URLSessionConfiguration.af.default
//////    return Session(configuration: configuration, serverTrustManager: manager)
//////
////
////
//////        let urlString = Api_vpn_baseURL
//////        let serverTrustPolicies: [String: ServerTrustPolicy] = [
//////                   urlString: .pinCertificates(
//////                       certificates: ServerTrustPolicy.certificates(),
//////                       validateCertificateChain: true,
//////                       validateHost: true
//////               )
//////           ]
//////       let sessionManager = SessionManager(serverTrustPolicyManager: ServerTrustPolicyManager(policies: serverTrustPolicies))
////////       sessionManager.request(urlString).response { (responseString) in
////////           print(responseString)
////////
////////       }
//////
////
//        let acceptableContentTypes: Set<String> = ["text/html", "text/plain", "text/json", "application/json", "application/octet-stream", "text/javascript"]
        
        let  session =  Session(configuration: configuration,
                                delegate:  SessionDelegate(),
                                rootQueue: DispatchQueue(label: "org.alamofire.session.rootQueue"),
                                startRequestsImmediately: true,
                                requestQueue:  nil,
                                serializationQueue: nil,
                                interceptor: nil,
                                serverTrustManager: manager,
                                redirectHandler: nil,
                                cachedResponseHandler: nil,
                                eventMonitors:  [EventMonitor]())
//        session.sessionConfiguration = configuration

//
////
//
//
        let sessionManager = Alamofire.Session(configuration: configuration);
//
//        let sessionManager = Alamofire.SessionManager(configuration: configuration,  serverTrustPolicyManager: manager)
//         let configuration = URLSessionConfiguration.default
//        configuration.timeoutIntervalForRequest = 15
//        let session = Session(configuration: configuration)
        return session;
    }();
    
}

extension NDBNetworkTool {
    
    static func getRequest(pathUrl:String,parameters:Parameters, completionHandler: @escaping (_ resModel:BaseResModel) -> (),failture: @escaping ( _ error : NSError) -> ()){
        
        let url = baseUrl + pathUrl
        print("Get请求：😄😄😄\(url)")
//     
        
        let headers: HTTPHeaders = ["Content-Type": "application/json"]
            
        shared.request(url, method: .get,  encoding: JSONEncoding.default, headers: headers).responseJSON { response in
            print("请求对象--response.request--\(String(describing: response.request))")  // 请求对象
            print(" 服务端返回的数据--response.data--\(String(describing: response.data))")     // 服务端返回的数据
            
            let headerString  =  response.request?.allHTTPHeaderFields
            print("请求头---- \( String(describing: headerString))")
            let bodtString = String(data:response.request?.httpBody ?? Data(), encoding: .utf8)
            print("请求体---- \( bodtString)")
            print("-----\(response)")
    
            print("httpBody---\(response.request?.httpBody?.description)")
            print("\(url)---\(JSON(response))")
            
            switch response.result {
            case .success(let json):
                let model =  BaseResModel.mj_object(withKeyValues: json)
                if model?.code == 200{
                    completionHandler(model ?? BaseResModel())
                    
                }else {
                    
                    
                }
             
            case .failure(let error):
                failture(error as NSError)
                
                
            }
        }
    }
    
    
    
    
    @objc  static func postRequest(  pathUrl:String,params:[String:Any]?,completionHandler: @escaping (_ responseModel:BaseResModel) -> () ,failed: @escaping () -> ()){
        
        
        
        let headers: HTTPHeaders = ["Content-Type": "application/json",
                                    //                                    "Content-Length":
                                    //                                    "token": "",
        ];
        
        var url = ""
        print("😄😄😄Post请求：\(url)")
        
        url = baseUrl + pathUrl
        
        print("POST请求：😄😄😄\(url)")
        
        shared.request(url, method:.post, parameters: params,  headers:  headers).responseString { response in
            print("responseString \(response)")
        }
        shared.request(url, method:.post, parameters: params,  headers:  headers).responseJSON { (response) in
            
            let headerString  =  response.request?.allHTTPHeaderFields
            print("请求头---- \( String(describing: headerString))")
            let bodtString = String(data:response.request?.httpBody ?? Data(), encoding: .utf8)
            print("请求体---- \( String(describing: bodtString))")
            print("返回数据：\(pathUrl)🍎🍎\(response)🍎🍎")
            
            guard let dict = response.value as? [String:Any] else{
                failed()
                print("json格式有问题")
                return
            }
            print("dict==\(dict)")
            let model =  BaseResModel.mj_object(withKeyValues: dict)
            
            
            completionHandler(model ?? BaseResModel())
            
        }
        
    }
    
  @objc  static  func downLoadSourceWithUrl(loadUrl:String){
        let destination = DownloadRequest.suggestedDownloadDestination(for: .documentDirectory)
      
        shared.download(loadUrl, to: destination).response { response in
            debugPrint(response)
            
            if response.error == nil, let imagePath = response.fileURL?.path {
                let image = UIImage(contentsOfFile: imagePath)
            }
        }
    }
    
    
    
}
