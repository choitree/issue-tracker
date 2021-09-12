//
//  Comment.swift
//  issueTracker
//
//  Created by 박정하 on 2021/06/13.
//

import Foundation

struct Comment: Codable, Equatable {
    var author: User
    var commentId: Int
    var contents: String
    var createDateTime: String
    
    static let empty = Self()
    
    init() {
        author = User.empty
        commentId = 0
        contents = ""
        createDateTime = ""
    }
}
