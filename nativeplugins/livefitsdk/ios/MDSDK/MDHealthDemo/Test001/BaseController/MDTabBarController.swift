//
//  MDTabBarController.swift
//  RealDemo
//
//  Created by GJD on 2023/11/15.
//

import UIKit

class MDTabBarController: UITabBarController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        addChildViewControllers()
    }
    
    
    fileprivate func  addChildViewControllers(){
        setupChildVc(vc: DeviceListController(), title: "首页", image: "tabbar_home_unselect", selectedImage: "tabbar_home_select", isHiddenNavgationBar: false, tabBarIndex: 0)
//        let imageArray = ["DHL-icon-zhuye", "DHL-icon-yundong", "DHL-icon-shebei", "DHL-icon-zhuyewode"]
        setupChildVc(vc: DeviceListController(), title: "设备", image: "tabbar_device_unselect", selectedImage: "tabbar_device_select", isHiddenNavgationBar: false, tabBarIndex: 1)
  
    }
  
}
//MARK:-- 初始化控制器
extension MDTabBarController{
    fileprivate func setupChildVc(vc:UIViewController,title:String,image:String,selectedImage:String,isHiddenNavgationBar:Bool,tabBarIndex:NSInteger){
        
        vc.title = title
        vc.tabBarItem.title = title
        vc.tabBarItem.image =  UIImage(named: image)?.withRenderingMode(UIImage.RenderingMode.alwaysOriginal)
        vc.tabBarItem.selectedImage =   UIImage(named: selectedImage)?.withRenderingMode(UIImage.RenderingMode.alwaysOriginal)
        
        let navi:MDNavigationController = MDNavigationController.init(rootViewController: vc)
        
        let beforeColor = NSDictionary(object: UIColor.blue, forKey: NSAttributedString.Key.foregroundColor as NSCopying)
        navi.tabBarItem.setTitleTextAttributes(beforeColor as? [NSAttributedString.Key : AnyObject], for:UIControl.State.selected)
        addChild(navi)
    }
}
