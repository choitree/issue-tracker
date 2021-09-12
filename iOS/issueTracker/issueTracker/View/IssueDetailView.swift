//
//  SwiftUIView.swift
//  issueTracker
//
//  Created by 박정하 on 2021/06/17.
//

import SwiftUI

struct IssueDetailView: View {
    let items: [IssueTextPart]
    let navigationTitle: String?
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            IssueText()
            List(items) { item in
                createDetailView(title: item.title, content: item.content, minuteAgo: item.minuteAgo)
            }
            .navigationTitle(self.navigationTitle ?? "")
        }
    }
    
    func createDetailView(title: String, content: String, minuteAgo: String) -> CellElement {
        let cellElement: CellElement = CellElement(issueTextPart: IssueTextPart(title: title, minuteAgo: content, content: minuteAgo))
        return cellElement
    }
}

struct CellElement: View {
    var id = Int()
    var issueTextPart: IssueTextPart
    var body: some View {
        HStack {
            Image(systemName: "tortoise.fill")
            IssueTextPart(title: issueTextPart.title, minuteAgo: issueTextPart.minuteAgo, content: issueTextPart.content)
        }
    }
}

struct IssueTextPart: View, Identifiable {
    var id = Int()
    var title: String
    var minuteAgo: String
    var content: String
    var body: some View {
        VStack(alignment: .leading, spacing: nil, content: {
            Text(title)
                .multilineTextAlignment(.leading)
            Text(minuteAgo)
                .multilineTextAlignment(.leading)
            Text(content)
                .multilineTextAlignment(.leading)
        })
    }
}

struct IssueText: View {
    var body: some View {
        HStack {
            Image(systemName: "exclamationmark.circle")
            Text("열림")
        }.background(Color(.blue))
        .cornerRadius(20.0)
    }
}

#if DEBUG
struct SwiftUIView_Previews: PreviewProvider {
    static var previews: some View {
        IssueDetailView(items: [IssueTextPart(title: "abcd", minuteAgo: "abcde", content: "abcdefg")], navigationTitle: nil)
    }
}
#endif
