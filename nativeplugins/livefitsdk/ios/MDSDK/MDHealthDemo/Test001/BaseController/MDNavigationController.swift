//
//  MDNavigationController.swift
//  RealDemo
//
//  Created by GJD on 2023/11/15.
//

import UIKit
import RealSDK
class MDNavigationController: UINavigationController {

    override func viewDidLoad() {
        super.viewDidLoad()

         
    }
    
    override func pushViewController(_ viewController: UIViewController, animated: Bool) {
        
//        // 如果不是栈底控制器才需要隐藏，根控制器不需要处理
//        if children.count > 0 {
//
//
//            let button = UIButton(type: .custom)
//            button.setImage(UIImage(named: "Return-1"), for: .normal)
//            button.size = CGSize(width: 50, height: 30)
//            button.contentHorizontalAlignment = .left
//            button.contentEdgeInsets = UIEdgeInsets(top: 0, left: 10, bottom: 0, right: 0)
//            button.addTarget(self, action: #selector(popToParent), for: .touchUpInside)
//            viewController.navigationItem.leftBarButtonItem = UIBarButtonItem(customView: button)
//            // 隐藏底部的 TabBar
//            viewController.hidesBottomBarWhenPushed = true
//
//
//        }
        
        super.pushViewController(viewController, animated: true)
    }
    /// POP 返回到上一级控制器
    @objc private func popToParent() {
        popViewController(animated: true)
    }
}
