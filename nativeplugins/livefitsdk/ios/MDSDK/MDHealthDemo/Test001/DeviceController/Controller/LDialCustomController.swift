//
//  LDialCustomController.swift
//  LifeFit
//
//  Created by GJD on 2023/6/3.
//  Copyright © 2023 wujunjie. All rights reserved.
//

import UIKit
import TZImagePickerController
import RealSDK
struct CustomDialData {
    var bgImage = ""
    var foreImage = ""
    var binName = ""
}
class LDialCustomController: UIViewController, UITableViewDelegate, UITableViewDataSource, UIImagePickerControllerDelegate, UINavigationControllerDelegate, TZImagePickerControllerDelegate  {
    
    fileprivate let kLDialCustomCell = "LDialCustomCell"
    @IBOutlet weak var naviTopView: UIView!
    @IBOutlet weak var naviTitleLabel: UILabel!
    @IBOutlet weak var naviHeighConst: NSLayoutConstraint!
    
    var header = DialHeader.init()
    var bgImage = UIImage.init(named: "131-1-bg")
    var foreImage = UIImage.init(named: "131-1")
    var defaultData = Data()
    
    @IBOutlet weak var table: UITableView!
    var widgetArray = [Widget]()
    var imagePicker: TZImagePickerController!
    var selectedIndex = 0
    var dialArray = [CustomDialData]()
    fileprivate lazy var dialPopView: DialPopView! = { [unowned self] in
        let popView = DialPopView.L_loadFromNib()
        popView.frame = CGRect(x: 0, y: 0, width: kScreenWidth, height: kScreenHeight)
        
        return popView
    }()
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        naviTitleLabel.text = NSLocalizedString("", comment: "")
        //
        //        imagePicker = TZImagePickerController.init(maxImagesCount: 1, delegate: self)
        //        //TODO: fixed bug
        //        imagePicker.sortAscendingByModificationDate = false
        //        imagePicker.allowPickingVideo = false
        //        imagePicker.allowPickingOriginalPhoto = false
        //
        //        imagePicker.modalPresentationStyle = .fullScreen
        
        table.delegate = self
        table.dataSource = self
        table.register(UINib(nibName: "LDialCustomCell", bundle: nil), forCellReuseIdentifier: kLDialCustomCell)
        NotificationCenter.default.addObserver(self, selector: #selector(handle(_:)), name: CommandType.deviceInfo.notify, object: nil)
        self.handleSet()
    }
    
    @IBAction func backAction(_ sender: Any) {
        self.navigationController?.popViewController(animated: false)
    }
    func handleSet() {
        dialArray = [CustomDialData.init(bgImage: "131-1-bg", foreImage: "131-1", binName: "131_1"),
                     CustomDialData.init(bgImage: "131-2-bg", foreImage: "131-2", binName: "131_2"),
                     CustomDialData.init(bgImage: "131-4-bg", foreImage: "131-4", binName: "131_4"),
                     CustomDialData.init(bgImage: "131-3-bg", foreImage: "131-3", binName: "131_3"),
                     
        ]
        bgImage = UIImage.init(named: "131-1-bg")
        foreImage = UIImage.init(named: "131-1")
        
        //TODO: -- 奉加微
        if bleSelf.bleModel.chip == "D", bleSelf.bleModel.productId.hasPrefix("132") {
            dialArray = [CustomDialData.init(bgImage: "131-1-bg", foreImage: "131-1", binName: "132_1"),
                         CustomDialData.init(bgImage: "131-2-bg", foreImage: "131-2", binName: "132_2"),
                         CustomDialData.init(bgImage: "131-4-bg", foreImage: "131-4", binName: "132_4"),
                         CustomDialData.init(bgImage: "131-3-bg", foreImage: "131-3", binName: "132_3"),
                         
            ]
            bgImage = UIImage.init(named: "131-1-bg")
            foreImage = UIImage.init(named: "131-1")
        }
        
        let model = self.dialArray[self.selectedIndex]
        setBinData(model.binName)
        bgImage = UIImage.init(named: model.bgImage)
        foreImage = nil
        if bleSelf.bleModel.chip == "D" {
            foreImage = UIImage.init(named: model.foreImage)
        }
        self.table.reloadData()
    }
    
    
    
    @objc func handle(_ notify: Notification) {
        //        if notify.name == imageAlartViewComplete {
        //            self.table.reloadData()
        //        }
        //
        //        if notify.name == CommandType.deviceInfo.notify {
        //            self.handleSet()
        //        }
    }
    
    
    // MARK: - TableView
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
       
        let cell = table.dequeueReusableCell(withIdentifier: kLDialCustomCell, for: indexPath) as! LDialCustomCell
        cell.dialCustomIndexBlock = {[weak self] (index) in
            print("index==\(index)")
            self?.selectedIndex = index
            if index == 4{
                self?.imagePicker = TZImagePickerController.init(maxImagesCount: 1, delegate: self)
                //TODO: fixed bug
                self?.imagePicker.sortAscendingByModificationDate = false
                self?.imagePicker.allowPickingVideo = false
                self?.imagePicker.allowPickingOriginalPhoto = false
                self?.imagePicker.allowCrop = true
                self?.imagePicker.cropRect = CGRect.init(x: kScreenWidth/2 - CGFloat(bleSelf.bleModel.width)/2, y: kScreenHeight/2 - CGFloat(bleSelf.bleModel.height)/2, width: CGFloat(bleSelf.bleModel.width), height: CGFloat(bleSelf.bleModel.height))
                self?.imagePicker.modalPresentationStyle = .fullScreen
                Async.main {
                    self?.present(self!.imagePicker, animated: true, completion: nil)
                }
            }
            
        }
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return kScreenHeight
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
    }
    
    func tz_imagePickerControllerDidCancel(_ picker: TZImagePickerController!) {
        picker.dismiss(animated: true, completion: nil)
    }
    
    func imagePickerController(_ picker: TZImagePickerController!, didFinishPickingPhotos photos: [UIImage]!, sourceAssets assets: [Any]!, isSelectOriginalPhoto: Bool, infos: [[AnyHashable : Any]]!) {
        picker.dismiss(animated: true, completion: nil)
        
        if photos.count > 0 {
            let image = photos[0]
            
            if let temp = scale(image: image, toSize: CGSize.init(width: bleSelf.bleModel.width, height: bleSelf.bleModel.height)) {
                print(temp.size)
 
                SVProgressHUD.show(withStatus: "表盘制作中")
                colorImage(image: temp)
            }
        }
    }
    
    func setBinData(_ name: String) {
        print(#function, name)
        let url = Bundle.main.url(forResource: name, withExtension: "bin")!
        let nsdata = NSData.init(contentsOf: url)!
        let data = Data(nsdata)
        defaultData = data
        //TODO: --
        if bleSelf.bleModel.chip == "D" {
            //TODO: do nothing
        } else {
            header = DialHeader.init(with: data)
            //            dump(header)
            
            //        let data = 读取模板文件数据
            //        let widgetStartIndex = data[8..<12].toInt()
            //        let dataStartIndex = data[12..<16].toInt()
            //        let startIndex = widgetStartIndex
            //        let dataIndex = data[(startIndex + 16)..<(startIndex + 20)].toInt()
            //        let image565Data = 图片.to565()
            //        let dataSend = data.replaceSubrange((dataStartIndex + dataIndex)..<(dataStartIndex + dataIndex + image565Data.size), with: image565Data)
            
            widgetArray.removeAll()
            for item in 0..<header.widgetNum {
                let model = Widget()
                let startIndex = header.widgetStartIndex + item * 32
                model.widgetType = WidgetType.init(rawValue: data[startIndex].toInt()) ?? WidgetType.backgroundImage
                model.displayNum = data[startIndex + 1].toInt()
                model.totalNum = data[startIndex + 2].toInt()
                model.imageType = ImageType.init(rawValue: data[startIndex + 3].toInt()) ?? ImageType.bit1
                
                model.origin = CGPoint.init(x: data[(startIndex + 4)..<(startIndex + 6)].toInt(), y: data[(startIndex + 6)..<(startIndex + 8)].toInt())
                model.size = CGSize.init(width: data[(startIndex + 8)..<(startIndex + 10)].toInt(), height: data[(startIndex + 10)..<(startIndex + 12)].toInt())
                model.colorBg = data[(startIndex + 12)..<(startIndex + 16)].toInt()
                model.dataIndex = data[(startIndex + 16)..<(startIndex + 20)].toInt()
                model.dataSize = data[(startIndex + 20)..<(startIndex + 24)].toInt()
                model.pointerLength = data[(startIndex + 24)..<(startIndex + 26)].toInt()
                model.data = Data.init(data[(header.dataStartIndex + model.dataIndex)..<(header.dataStartIndex + model.dataIndex + model.dataSize)])
                widgetArray.append(model)
                //            dump(model)
            }
        }
        
    }
    
    
    
    
    func colorImage(image: UIImage) {
        let array = XRGBTool.getRGBsArr(from: image)!
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
        let data = Data.init(byte)
        bgImage = image
        table.reloadData()
        let indexrow = IndexPath(row: 0, section: 0)
        let cell = table.cellForRow(at: indexrow) as! LDialCustomCell
        cell.dialShowImageView.image = bgImage
        //TODO: -- 奉加微
        if bleSelf.bleModel.chip == "D"{
            let model = DialInfo()
            let index = (64)..<(64 + data.count)
            self.defaultData.replaceSubrange(index, with: data)
            model.size = self.defaultData.count
            model.data = self.defaultData
            model.image = image
            model.customIndex = self.selectedIndex
            //            DialAlartView.showView(with: model)
        } else {
            if let widget = self.widgetArray.first(where: {$0.widgetType == .backgroundImage}) {
                let model = DialInfo()
                model.size = self.defaultData.count
                let index = (header.dataStartIndex + widget.dataIndex)..<(header.dataStartIndex + widget.dataIndex + widget.dataSize)
                self.defaultData.replaceSubrange(index, with: data)
                
                let index1 = (header.preview.dataStartIndex)..<(header.preview.dataStartIndex + header.preview.dataSize)
                
                if let temp = scale(image: image, toSize: header.preview.size) {
                    print("header.preview.size===\(header.preview.size)")
                    
                    let previewData = temp.cornerImage(with: 10)!.imageToBin()
                    self.defaultData.replaceSubrange(index1, with: previewData)
                }
                
                model.data = self.defaultData
                model.image = image
                model.customIndex = self.selectedIndex
                dialPopView.model = model
                dialPopView.dialPopTransBlock = {[weak  self] (type) in
                    SVProgressHUD.dismiss()
                    if type == 0{
                        self?.showHud("表盘安装成功", duration: 1.5)
                    }else{
                        self?.showHud("表盘安装失败", duration: 1.5)
                        
                    }
                    
                }
                SVProgressHUD.dismiss()
                UIApplication.shared.keyWindow?.addSubview(dialPopView)
                //                DialAlartView.showView(with: model)
            }
        }
        
    }
    
    func scale(image: UIImage, toSize: CGSize) -> UIImage? {
        UIGraphicsBeginImageContextWithOptions(toSize, false, 1)
        image.draw(in: CGRect.init(origin: .zero, size: toSize))
        let temp = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        return temp
    }
}


