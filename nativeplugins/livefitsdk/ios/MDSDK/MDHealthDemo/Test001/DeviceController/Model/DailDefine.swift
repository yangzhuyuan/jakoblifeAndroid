//
//  DailDefine.swift
//  DialMake
//
//  Created by GJD on 2021/9/23.
//

import Foundation

enum ImageType: Int {
    case bit1
    case bit2
    case bit4
    case bit8
    case rgb565
    case rgb1555
    case rgb4444
    case rgb8888
}

enum DailType {
    case normal
    case pointer
}

enum WidgetType: Int {
    case backgroundImage = 0
    case backgroundColor = 1
    case temperature = 2
    case step = 3
    case calories = 4
    case distance = 5
    case hr = 6
    case bp = 7
    case time = 8
    case hourFirst = 9
    case hourLast = 10
    case hour = 11
    case minuteFirst = 12
    case minuteLast = 13
    case minute = 14
    case second = 15
    case colon = 16
    case date = 17
    case other = 18
    case weekdays = 19
    case animotion = 20
    case bleState = 21
    case btState = 22
    case battery = 23
    case weather = 24
    case normalIcon = 25
    case pointerHour = 26
    case pointerMinute = 27
    case pointerSecond = 28
    case dateYear = 29
    case dateMonth = 30
    case dateDay = 31
    case monthStr = 32
    case ampm = 33
    case temperUnit = 34
}

