//
//  testingController.swift
//  issueTracker
//
//  Created by 박정하 on 2021/06/22.
//

import SwiftUI

final class LabelController: UIHostingController<LabelListView> {
    
    override init(rootView: LabelListView) {
        super.init(rootView: rootView)
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder, rootView: LabelListView())
    }
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        self.navigationController?.navigationBar.prefersLargeTitles = true
        self.navigationController?.navigationBar.backgroundColor = .white
        self.view.backgroundColor = .blue
        self.navigationController?.navigationBar.standardAppearance.backgroundColor = .brown
        changeNavigationBarColor(background: .white, titleColor: .black, scrollEdgeTitleColor: .black)
        
    }
    
    private func changeNavigationBarColor(background: UIColor, titleColor: UIColor, scrollEdgeTitleColor: UIColor) {
        let coloredAppearance = UINavigationBarAppearance()
        coloredAppearance.configureWithTransparentBackground()
        coloredAppearance.backgroundColor = background
        coloredAppearance.titleTextAttributes = [.foregroundColor: titleColor]
        coloredAppearance.largeTitleTextAttributes = [.foregroundColor: titleColor]
        UINavigationBar.appearance().standardAppearance = coloredAppearance
        UINavigationBar.appearance().compactAppearance = coloredAppearance
        UINavigationBar.appearance().scrollEdgeAppearance = coloredAppearance
    }
}
