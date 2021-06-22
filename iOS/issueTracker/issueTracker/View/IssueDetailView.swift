//
//  SwiftUIView.swift
//  issueTracker
//
//  Created by 박정하 on 2021/06/17.
//

import SwiftUI

struct IssueDetailView: View {
    let navigationTitle: String?
    var body: some View {
        List {
            NavigationLink.init(
                destination: Mydestination(),
                label: {
                    IssueCell(cellNum: 0)
                })
            IssueCell(cellNum: 1)
        }
        .navigationTitle(self.navigationTitle ?? "")
    }
}

struct Mydestination: View {
    
    var body: some View {
        VStack {
            Text("우이")
        }
        .navigationTitle("아녕")
    }
}

struct IssueCell: View {
    var cellNum: Int
    var body: some View {
        HStack {
            Image(systemName: "tortoise.fill")
            Text("\(cellNum)")
        }
    }
}

#if DEBUG
struct SwiftUIView_Previews: PreviewProvider {
    static var previews: some View {
        IssueDetailView(navigationTitle: nil)
    }
}
#endif
