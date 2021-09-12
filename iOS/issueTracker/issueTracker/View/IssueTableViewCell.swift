//
//  IssueListTableViewCell.swift
//  issueTracker
//
//  Created by 박정하 on 2021/06/09.
//

import UIKit

class IssueTableViewCell: UITableViewCell {
    static var cellIdentity: String = "issueCell"
    @IBOutlet weak var issueTitle: UILabel!
    @IBOutlet weak var issueDescription: UILabel!
    @IBOutlet weak var milestoneTitle: UILabel!
    @IBOutlet weak var labelTitle: UILabel!
    
    func 업데이트(이슈제목: String, 이슈설명: String, 마일스톤제목: String, 레이블제목: String) {
        self.issueTitle.text = 이슈제목
        self.issueDescription.text = 이슈설명
        self.milestoneTitle.text = 마일스톤제목
        self.labelTitle.text = 레이블제목
        
        if labelTitle.text == "" {
            self.labelTitle.isHidden = true
        }
    }
}
