//
//  HealthReminderViewController.swift
//  Test001
//
//  Created by GJD on 2023/11/20.
//

import UIKit
import RealSDK
class HealthReminderViewController: UIViewController,UITableViewDelegate,UITableViewDataSource {
  
    
    fileprivate let kDevicesListCell = "DevicesListCell"
    @IBOutlet weak var healthTable: UITableView!
    override func viewDidLoad() {
        super.viewDidLoad()
        healthTable.delegate = self
        healthTable.dataSource = self
        healthTable.register(UINib(nibName: "DevicesListCell", bundle: nil), forCellReuseIdentifier: kDevicesListCell)
        
    }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 4
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: kDevicesListCell, for: indexPath) as! DevicesListCell
        if  indexPath.row == 0{
            cell.nameLabel.text = "喝水提醒"
        }else if  indexPath.row == 1{
            cell.nameLabel.text = "运动提醒"
        }else if  indexPath.row == 2{
            cell.nameLabel.text = "入睡提醒"
        }else if  indexPath.row == 3{
            cell.nameLabel.text = "出门提醒"
        }
        cell.rssiLabel.isHidden = true
        cell.addressLabel.isHidden = true
        return cell
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        var dataArray = DeviceReminderType.allCases
        let type = dataArray[indexPath.row]
        if  indexPath.row == 0{//喝水提醒
            let model = DeviceReminderModel.getModel("a喝水提醒") as! DeviceReminderModel
            model.startTime = dateStringToDate(dateString: "14:34", dateFormat: "HH:mm") ?? Date()
            model.endTime = dateStringToDate(dateString: "22:34", dateFormat: "HH:mm") ?? Date()
            model.isOn = true
            MDBleManager.share.MD_deviceRemind(reminderModel: model)
        }else if  indexPath.row == 1{//运动提醒
            var model = DeviceReminderModel.getModel("a运动提醒") as! DeviceReminderModel
            model.startTime = dateStringToDate(dateString: "14:34", dateFormat: "HH:mm") ?? Date()
            
            model.isOn = true
            
            model = repeatCountSet(alarmClock: model, index: 1, className: "a运动提醒")
            model = repeatCountSet(alarmClock: model, index: 2, className: "a运动提醒")
            MDBleManager.share.MD_deviceRemind(reminderModel: model)
        }else if  indexPath.row == 2{//入睡提醒
            var model = DeviceReminderModel.getModel("a入睡提醒") as! DeviceReminderModel
            model.startTime = dateStringToDate(dateString: "14:34", dateFormat: "HH:mm") ?? Date()
            
            model.isOn = true
            
            model = repeatCountSet(alarmClock: model, index: 1, className: "a入睡提醒")
            model = repeatCountSet(alarmClock: model, index: 2, className: "a入睡提醒")
            MDBleManager.share.MD_deviceRemind(reminderModel: model)
        }else if  indexPath.row == 3{//出门提醒
            var model = DeviceReminderModel.getModel("a出门提醒") as! DeviceReminderModel
            model.startTime = dateStringToDate(dateString: "14:34", dateFormat: "HH:mm") ?? Date()
            
            model.isOn = true
            
            model = repeatCountSet(alarmClock: model, index: 1, className: "a出门提醒")
            model = repeatCountSet(alarmClock: model, index: 2, className: "a出门提醒")
            MDBleManager.share.MD_deviceRemind(reminderModel: model)
        }
        
    }
    fileprivate func dateStringToDate(dateString:String,dateFormat:String)->Date?{
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = dateFormat

        if let date = dateFormatter.date(from: dateString) {
            print("转换后的日期：\(date)")
            return date
        } else {
            return nil
            print("日期转换失败")
        }
       
    }
 
    fileprivate func repeatCountSet(alarmClock :DeviceReminderModel ,index:Int,className:String) ->DeviceReminderModel {
       
        
        let ret = (alarmClock.weekday >> index) & (0x01)
        if ret == 1 {
            alarmClock.weekday = alarmClock.weekday - (1 << index)
        }
        else {
            alarmClock.weekday = alarmClock.weekday + (1 << index)
        }
        
//        DeviceReminderModel.setModel(alarmClock, className: className)
      return alarmClock
    }
}
