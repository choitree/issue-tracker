// ** API 관련 Interface & Type 정의

type THistoryFlag = 'open' | 'closed' | 'write' | 'update' | 'delete';
interface IHistory {
  flag: THistoryFlag;
  historyDateTime: Date;
  userName: string;
}

interface ILabel {
  bgColor: string;
  color: string;
  description: string;
  labelId: number;
  title: string;
}

interface IMilestone {
  deadLineDate: Date;
  description: string;
  issueCount: {
    closed: number;
    open: number;
  };
  milestoneId: number;
  title: string;
}

interface IUser {
  userId: number;
  userName: string;
  profileImage: string;
}

interface IAssignees extends IUser {};
interface IAuthor extends IUser {};

interface IComments {
  author: IAuthor;
  commentId: number;
  contents: string;
  createDateTime: Date;
}

type TIssueTypes = 'assignees' | 'author' | 'comments' 
  | 'contents' | 'history' | 'isOpen'
  | 'issueId' | 'labels' | 'milestone' | 'title';
interface IIssue {
  assignees: IAssignees[];
  author: IAuthor;
  comments: IComments[];
  contents: string;
  history: IHistory;
  isOpen: boolean;
  issueId: number;
  labels: ILabel[];
  milestone: IMilestone;
  title: string;
}

// -----
interface ILabelsInfo {
  labels: ILabel[];
}

interface IMilestonesInfo {
  milestones: IMilestone[];
}

interface IUsersInfo {
  users: IUser[];
}

interface IIssuesInfo {
  issues: IIssue[];
}

interface IAllGetRequestDatas {
  labels?: ILabelsInfo;
  milestones?: IMilestonesInfo;
  users?: IUsersInfo;
  issues?: IIssuesInfo;
}

export type {
  ILabel, ILabelsInfo,
  IMilestone, IMilestonesInfo,
  IUser,
  IAssignees, IAuthor, // 이 2개. IUser와 같음
  IUsersInfo,
  IComments,
  IIssue, IIssuesInfo,
  IAllGetRequestDatas,
  TIssueTypes
};
