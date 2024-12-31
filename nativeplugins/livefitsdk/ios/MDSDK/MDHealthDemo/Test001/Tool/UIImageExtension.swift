//
//  UIImageExtension.swift
//  Test001
//
//  Created by GJD on 2024/1/4.
//

import Foundation
import UIKit
extension UIImage {
    func add(_ color: UIColor) -> UIImage? {
        UIGraphicsBeginImageContextWithOptions(self.size, false, self.scale)
        if let context = UIGraphicsGetCurrentContext() {
            context.translateBy(x: 0, y: self.size.height)
            context.scaleBy(x: 1, y: -1)
            context.setBlendMode(.normal)
            
            let rect = CGRect.init(origin: .zero, size: self.size)
            context.clip(to: rect, mask: self.cgImage!)
            color.setFill()
            context.fill(rect)
            let newImage = UIGraphicsGetImageFromCurrentImageContext()
            UIGraphicsEndImageContext()
            return newImage
        }
        return self
    }
    
    func add(_ size: CGSize) -> UIImage? {
        UIGraphicsBeginImageContextWithOptions(size, false, self.scale)
        self.draw(in: CGRect.init(origin: .zero, size: size))
        let image = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        return image
    }
    
    func add(_ rect: CGRect) -> UIImage? {
        UIGraphicsBeginImageContextWithOptions(rect.size, false, self.scale)
        if let _ = UIGraphicsGetCurrentContext() {
            let x = rect.width/2 - self.size.width/2
            let y = rect.height/2 - self.size.height/2
            self.draw(at: CGPoint.init(x: x, y: y))
            let newImage = UIGraphicsGetImageFromCurrentImageContext()
            UIGraphicsEndImageContext()
            return newImage
        }
        return self
    }
    
    func circleImage() -> UIImage? {
        UIGraphicsBeginImageContextWithOptions(self.size, false, self.scale)
        if let context = UIGraphicsGetCurrentContext() {
            let rect = CGRect.init(origin: .zero, size: size)
            context.addEllipse(in: rect)
            context.clip()
            self.draw(in: rect)
            let newImage = UIGraphicsGetImageFromCurrentImageContext()
            UIGraphicsEndImageContext()
            return newImage
        }
        return self
    }
    
    func cornerImage(with radius: CGFloat) -> UIImage? {
        //1.建立上下文
        UIGraphicsBeginImageContextWithOptions(self.size, false, self.scale)
        if let context = UIGraphicsGetCurrentContext() {
            let rect = CGRect.init(origin: .zero, size: size)
            //2.创建椭圆path,宽、高一致返回的就是圆形路径
            let path = UIBezierPath.init(roundedRect: rect, cornerRadius: radius)
            context.addPath(path.cgPath)
            context.clip()
            self.draw(in: rect)
            let newImage = UIGraphicsGetImageFromCurrentImageContext()
            UIGraphicsEndImageContext()
            return newImage
        }
        return self
    }
    
    func cornerImage(with radius: CGFloat, insets: UIEdgeInsets) -> UIImage? {
        //1.建立上下文
        UIGraphicsBeginImageContextWithOptions(self.size, false, self.scale)
        if let context = UIGraphicsGetCurrentContext() {
            let rect = CGRect.init(origin: .zero, size: size)
            //2.创建椭圆path,宽、高一致返回的就是圆形路径
            let path = UIBezierPath.init(roundedRect: rect.inset(by: insets), cornerRadius: radius)
            context.addPath(path.cgPath)
            context.clip()
            self.draw(in: rect)
            let newImage = UIGraphicsGetImageFromCurrentImageContext()
            UIGraphicsEndImageContext()
            return newImage
        }
        return self
    }
    
    func imageToBin() -> Data {
        let array = XRGBTool.getRGBsArr(from: self)!
        var byte = Array.init(repeating: UInt8(0), count: array.count * 2)
        for i in 0..<array.count {
            let item = array[i] as! XPixelItem
            let red = (item.red >> 3) << 11
            let green = (item.green >> 2) << 5
            let blue = item.blue >> 3
            let all = red + green + blue
            let one = all/256
            let two = all%256
            byte[2 * i] = UInt8(one)
            byte[2 * i + 1] = UInt8(two)
        }
        return Data.init(byte)
    }
}

