//
//  Label.swift
//  issueTracker
//
//  Created by 박정하 on 2021/06/13.
//

import Foundation

struct Labels: Codable {
    let labels: [Label]
}

struct Label: Codable, Equatable {
    var labelId: Int?
    var title: String
    var description: String
    var color: String
    var bgColor: String
}
