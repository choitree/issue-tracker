//
//  testingController.swift
//  issueTracker
//
//  Created by 박정하 on 2021/06/22.
//

import SwiftUI

final class TestingController: UIHostingController<IssueDetailView> {
    
    override init(rootView: IssueDetailView) {
        super.init(rootView: rootView)
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder, rootView: IssueDetailView(navigationTitle: "홍칰홍칰22"))
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
}

final class testing2: UIHostingController<IssueDetailView> {
    
}
