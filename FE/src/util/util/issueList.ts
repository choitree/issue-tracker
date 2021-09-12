import { TTextIssueListFilterItems as TFilterAllItems } from 'util/reference';
import { TFilterSelection } from 'util/store';
import { IIssue, ILabel, IMilestone, IUser } from 'util/types';

// 1. IssuesPage Filter 관련 (IssueList -> ListBody 컴포넌트에서 사용)
// 1) 레이블
const getFilterLabelData = 
  (arrLabelValue: number[]) => (arrIssues: IIssue[]) =>
    arrLabelValue.length > 0
      ? arrIssues.filter((issue) => {
          let count = 0;
          for (let i = 0; i < issue.labels.length; i++) {
            const isInclude = arrLabelValue.includes(issue.labels[i].labelId);
            count += Number(isInclude);
          };
          return count === arrLabelValue.length;
        })
      : arrIssues;

// 2) 마일스톤
const getFilterMilestoneData =
  (arrMilestoneValue: number[]) => (arrIssues: IIssue[]) =>
    arrMilestoneValue.length > 0
      ? arrIssues.filter((issue) =>
          arrMilestoneValue.includes(issue.milestone.milestoneId),
        )
      : arrIssues;

// 3) 담당자
// let initNewIssues: IIssue[] = [];
const getFilterAssigneeData =
  (arrAssigneeValue: number[]) => (arrIssues: IIssue[]) =>
    arrAssigneeValue.length > 0
      ? arrIssues.filter((issue) => {
          let count = 0;
          for (let i = 0; i < issue.assignees.length; i++) {
            const isInclude = arrAssigneeValue.includes(issue.assignees[i].userId);
            count += Number(isInclude);
          };
          return count === arrAssigneeValue.length;
        })
      : arrIssues;

// 4) 작성자
const getFilterWriterData =
  (arrWriterValue: number[]) => (arrIssues: IIssue[]) =>
    arrWriterValue.length > 0
      ? arrIssues.filter((issue) =>
          arrWriterValue.includes(issue.author.userId),
        )
      : arrIssues;

// 5) 검색바
const getFilterSearchData =
  (arrSearchValue: number[], currUserId : number) => (arrIssues: IIssue[]) =>
    (arrSearchValue.length > 0 && currUserId && currUserId > 0)
      ? arrIssues.filter((issue) => {
          const nSearchId = arrSearchValue[0];
          let returnValue = false;
          switch (nSearchId) {
            // 열린 이슈 (open)
            case 1: returnValue = issue.isOpen; break;
            // 내가 작성한 이슈 (write)
            case 2: returnValue = (issue.author.userId === currUserId); break;
            // 나에게 할당된 이슈 (assign)
            case 3: {
              const assigneeIds = issue.assignees.map((assignee) => assignee.userId);
              returnValue = assigneeIds.includes(currUserId);
              break;
            }
            // 내가 댓글을 남긴 이슈 (comment)
            case 4: {
              const commentsAuthorIdsSet = new Set(issue.comments.map((comment) => comment.author.userId));
              returnValue = commentsAuthorIdsSet.has(currUserId);
              break;
            }
            // 닫힌 이슈 (close)
            case 5: returnValue = !(issue.isOpen); break;
            default: break;
          }

          return returnValue;
        })
      : arrIssues;

// 6) Recoil의 filterSelectionState가 비어있는지 체크
const isZeroFilterSelection = (
  filterSelectionState: TFilterSelection,
): boolean => {
  for (const type in filterSelectionState) {
    //@ts-ignore
    const arrFilter = filterSelectionState[type];
    if (arrFilter.length > 0) return false;
  }
  return true;
};


// 2. IssuesPage : ListBody 관련
// 1) issue의 history.flag에 따른 Text 반환
type THistoryFlag = 'open' | 'closed' | 'write' | 'update' | 'delete';
const getIssueHistoryFlagText = (flag: THistoryFlag) => {
  let resultText = '';
  switch (flag) {
    case 'open': resultText = '열렸습니다.'; break;
    case 'closed': resultText = '닫혔습니다.'; break;
    case 'write': resultText = '작성되었습니다.'; break;
    case 'update': resultText = '수정되었습니다.'; break;
    case 'delete': resultText = '삭제되었습니다.'; break;
    default: break;
  }
  return resultText;
};

// 3. IssuesPage : ListHead 관련
// 1) ListHead의 ListModal에 들어가는 아이템(FilterItem) 생성
interface IUserFilterItem {
  id: number;
  name: string;
  imgUrl: string;
  imgType: 'image';
}
interface IMilestonesFilterItem {
  id: number;
  name: string;
}
interface ILabelsFilterItem {
  id: number,
  name: string,
  color: string,
  imgType: 'color',
}
interface ICreateAllFilterItemsProps {
  usersFilterItems: IUserFilterItem[];
  milestonesFilterItems: IMilestonesFilterItem[];
  labelsFilterItems: ILabelsFilterItem[];
}

const createUsersFilterItems = (usersData: IUser[]) : IUserFilterItem[] =>
  usersData.map(({ userId, userName, profileImage }) => ({
    id: userId,
    name: userName,
    imgUrl: profileImage,
    imgType: 'image',
  }));

const createMilestonesFilterItems = (milestonesData: IMilestone[]) : IMilestonesFilterItem[] =>
  milestonesData.map(({ milestoneId, title }) => ({
    id: milestoneId,
    name: title,
  }));

const createLabelsFilterItems = (labelsData: ILabel[]) : ILabelsFilterItem[] =>
  labelsData.map(({ labelId, title, bgColor }) => ({
    id: labelId,
    name: title,
    color: bgColor,
    imgType: 'color',
  }));

const createAllFilterItems = (
  {
    usersFilterItems,
    labelsFilterItems,
    milestonesFilterItems,
  }: ICreateAllFilterItemsProps,
  filterType: 'filter' | 'writeOptions' = 'filter',
): TFilterAllItems => ({
  assignee: {
    title: `담당자${filterType === 'filter' ? ' 필터' : ''}`,
    items:
      filterType === 'filter'
        ? [
            { id: -1, name: 'noAssignee', text: '담당자가 없는 이슈' },
            ...usersFilterItems,
          ]
        : [...usersFilterItems],
    type: 'assignee',
  },
  writer: {
    title: `작성자${filterType === 'filter' ? ' 필터' : ''}`,
    items: usersFilterItems,
    type: 'writer',
  },
  milestone: {
    title: `마일스톤${filterType === 'filter' ? ' 필터' : ''}`,
    items:
      filterType === 'filter'
        ? [
            { id: -1, name: 'noMilestone', text: '마일스톤이 없는 이슈' },
            ...milestonesFilterItems,
          ]
        : [...milestonesFilterItems],
    type: 'milestone',
  },
  label: {
    title: `레이블${filterType === 'filter' ? ' 필터' : ''}`,
    items:
      filterType === 'filter'
        ? [
            { id: -1, name: 'noLabel', text: '레이블이 없는 이슈' },
            ...labelsFilterItems,
          ]
        : [...labelsFilterItems],
    type: 'label',
  },
});


export {
  // 1. IssuesPage Filter 관련 (IssueList -> ListBody 컴포넌트에서 사용)
  getFilterLabelData,
  getFilterMilestoneData,
  getFilterAssigneeData,
  getFilterWriterData,
  getFilterSearchData,
  isZeroFilterSelection,
  // 2. IssuesPage : ListBody 관련
  getIssueHistoryFlagText,
  // 3. IssuesPage : ListHead 관련
  createUsersFilterItems,
  createMilestonesFilterItems,
  createLabelsFilterItems,
  createAllFilterItems,
};

