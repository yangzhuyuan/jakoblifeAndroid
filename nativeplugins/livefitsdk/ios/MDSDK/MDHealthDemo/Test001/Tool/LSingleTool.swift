//
//  LSingleTool.swift
//  Test001
//
//  Created by GJD on 2023/12/29.
//

import UIKit
 
class LSingleTool: NSObject   {
    
    var readSDType = ReadSDCardType.music
    
    static let shared = LSingleTool()
    var jlCentralManager: MD_JL_CentralManager?
   

    var ismNeedPaired = false
    func setupManager() {
         
       
        jlCentralManager = MD_JL_CentralManager()
        jlCentralManager?.initCentral()
    }
   
}
