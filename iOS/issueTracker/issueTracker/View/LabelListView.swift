//
//  LabelListView.swift
//  issueTracker
//
//  Created by 오킹 on 2021/06/22.
//

import SwiftUI

struct LabelListView: View {
    let colors: [Color] = [.red, .green, .blue, .red, .green, .blue]
    
    var body: some View {
        
            List {
                CustomCell(labelText: "레이블 이름", description: "레이블에 대한 설명(한줄만 보인다.) 한줄만 보이도록 하려면 어떻게 해야할까요?", labelColor: .brown)
                CustomCell(labelText: "레이블 이름", description: "레이블에 대한 설명(한줄만 보인다.) 한줄만 보이도록 하려면 어떻게 해야할까요?", labelColor: .cyan)
                CustomCell(labelText: "레이블 이름", description: "레이블에 대한 설명(한줄만 보인다.) 한줄만 보이도록 하려면 어떻게 해야할까요?", labelColor: .green)
                CustomCell(labelText: "레이블 이름", description: "레이블에 대한 설명(한줄만 보인다.) 한줄만 보이도록 하려면 어떻게 해야할까요?", labelColor: .orange)
                
                ForEach(colors, id: \.self) { color in CustomCell(labelText: "레이블 이름", description: "레이블에 대한 설명(한줄만 보인다.) 한줄만 보이도록 하려면 어떻게 해야할까요?", labelColor: UIColor(color))
                }
              
            }
            .listStyle(GroupedListStyle())
            .navigationTitle("레이블")
            
            .navigationBarItems(trailing:
                                    NavigationLink(
                                        destination: Text("Destination")) {
                                        Text("추가 +")
                                    }
            )
       
    }
}

extension View {
    func navigationBarColor(_ backgroundColor: UIColor, titleColor: UIColor, navigationItemColor: UIColor) -> some View {
        self.modifier(NavigationBarModifier(backgroundColor: backgroundColor, titleColor: titleColor, navigationItemColor: navigationItemColor))
  }
}

extension View {
    var chaningNavigationBarColor: some View {
        self.navigationBarColor(UIColor.white, titleColor: UIColor.black, navigationItemColor: UIColor.systemBlue)
    }
}

struct NavigationBarModifier: ViewModifier {
    
    var backgroundColor: UIColor
    var titleColor: UIColor
    var navigationItemColor: UIColor
    
    init(backgroundColor: UIColor, titleColor: UIColor, navigationItemColor: UIColor) {
        self.backgroundColor = backgroundColor
        self.titleColor = titleColor
        self.navigationItemColor = navigationItemColor
        
        let coloredAppearance = UINavigationBarAppearance()
            coloredAppearance.configureWithTransparentBackground()
            coloredAppearance.backgroundColor = .clear
        coloredAppearance.titleTextAttributes = [.foregroundColor: titleColor]
            coloredAppearance.largeTitleTextAttributes = [.foregroundColor: titleColor]

            UINavigationBar.appearance().standardAppearance = coloredAppearance
            UINavigationBar.appearance().compactAppearance = coloredAppearance
            UINavigationBar.appearance().scrollEdgeAppearance = coloredAppearance
        
        UINavigationBar.appearance().backgroundColor = backgroundColor
        UINavigationBar.appearance().tintColor = navigationItemColor
    }
    
    func body(content: Content) -> some View {
        ZStack {
            content
            VStack {
                GeometryReader { geometry in
                    Color(self.backgroundColor)
                        .frame(height: geometry.safeAreaInsets.top)
                        .edgesIgnoringSafeArea(.top)
                    Spacer()
                }
            }
        }
    }
}

struct CustomCell: View {
    var labelText: String
    var labelColor: UIColor
    var description: String
    
    init(labelText: String, description: String, labelColor: UIColor) {
        self.labelText = labelText
        self.labelColor = labelColor
        self.description = description
    }
    
    var body: some View {
        VStack(alignment: .leading) {
            Spacer()
            Text(labelText)
                .padding(EdgeInsets(top: 10, leading: 10, bottom: 10, trailing: 10))
                .background(Color(labelColor))
                .cornerRadius(20.0)
                
            Spacer()
            Spacer()
            Text(description)
                .foregroundColor(.gray)
                .lineLimit(1)
            Spacer()
            
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            LabelListView()
        }
    }
}
