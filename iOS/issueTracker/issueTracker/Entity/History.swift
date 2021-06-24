//
//  History.swift
//  issueTracker
//
//  Created by 박정하 on 2021/06/13.
//

import Foundation

struct Histroy: Codable, Equatable {
    
    var userName: String
    var historyDateTime: String
    var flag: String
    
    static let empty = Self()
    
    init() {
        self.userName = ""
        self.historyDateTime = ""
        self.flag = ""
    }
}
