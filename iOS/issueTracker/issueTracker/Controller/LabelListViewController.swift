//
//  testingController.swift
//  issueTracker
//
//  Created by 박정하 on 2021/06/22.
//

import SwiftUI

final class LabelController: UIHostingController<LabelListView> {
    private var labelListView = LabelListView(labelData: LabelData())
 
    override init(rootView: LabelListView) {
        super.init(rootView: rootView)
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder, rootView: labelListView)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationController?.navigationBar.prefersLargeTitles = true
        self.navigationController?.navigationBar.backgroundColor = .white
        self.view.backgroundColor = .blue
        self.navigationController?.navigationBar.standardAppearance.backgroundColor = .brown
        changeNavigationBarColor(background: .white, titleColor: .black, scrollEdgeTitleColor: .black)
        let requestable: Requestable = APIEndPoint.init(path: "/api/labels", httpMethod: .get, decodingStrategy: .convertFromSnakeCase)
        NetworkManager.request(with: requestable, type: Labels.self, completion: { data in
            print(data)
            switch data {
            case .success(let data):
  
                self.labelListView.labelData.labelData.removeAll()
                for datum in data.labels {
                
                    let oneOfLabelData = OneOfLabelData(id: datum.labelId!, labelTitle: datum.title, description: datum.description, labelColor: UIColor(hex: datum.bgColor))
                self.labelListView.labelData.labelData.append(oneOfLabelData)
                    
                }
                print(self.labelListView.labelData)
            case .failure(let error):
                print(error)
            }
            
        })
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
