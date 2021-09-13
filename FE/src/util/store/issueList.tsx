// issueList (IssuePage)
import { atom, selector } from 'recoil';
import { ILabelsInfo, IMilestonesInfo, IUsersInfo, IIssuesInfo, TFilterTypes } from 'util/types';

// 1. Modal 관련
// 1) ListModal(Filter 모달) Visible 상태
interface IFilterVisible {
  search: boolean;
  assignee: boolean;
  label: boolean;
  milestone: boolean;
  writer: boolean;
}

const filterVisibleAtom = atom<IFilterVisible>({
  key: 'filterVisibleAtom',
  default: {
    search: false,
    assignee: false,
    label: false,
    milestone: false,
    writer: false,
  },
});

// 2) 필터 옵션 선택 상태
type TFilterSelection = {
  [filterType in TFilterTypes]: number[];
};
const filterSelectionAtom = atom<TFilterSelection>({
  key: 'filterSelectionAtom',
  default: {
    assignee: [],
    search: [],
    label: [],
    milestone: [],
    writer: [],
  },
});

// 2-1) filterSelectionAtom - search: 열린 이슈(id: 1) or 닫힌 이슈(id: 5) 만 있다면 초기 상태 판정.
const isInitFilterSelectionSelector = selector({
  key: 'isInitFilterSelectionSelector',
  get: ({ get }) => {
    const RECOIL_OPEN_ISSUE = 1;
    const RECOIL_CLOSE_ISSUE = 5;
    const filterSelectionState = get(filterSelectionAtom);
    const { assignee, label, milestone, search, writer } = filterSelectionState;

    const isOpenOrClose = search.includes(RECOIL_OPEN_ISSUE) || search.includes(RECOIL_CLOSE_ISSUE);
    if (!assignee.length && !label.length && !milestone.length && !writer.length && isOpenOrClose) 
      return true;

    return false;
  },
});

// 3) 체크된 이슈의 id 저장용
const idOfCheckedIssuesAtom = atom<number[]>({
  key: 'idOfCheckedIssuesAtom',
  default: [],
});

// ===========

// 2. API 관련

// IssuePage 데이터 (IssuePage 컴포넌트에서 최초로 불러옴)
type TIssuePageData = {
  isLoading: boolean;
  data: {
    labels?: ILabelsInfo;
    milestones?: IMilestonesInfo;
    users?: IUsersInfo;
    issues?: IIssuesInfo;
  };
};

const issuesAllDataAtom = atom<TIssuePageData>({
  key: 'issuesAllDataAtom',
  default: {
    isLoading: true,
    data: {
      issues: undefined,
      milestones: undefined,
      labels: undefined,
      users: undefined,
    },
  },
});

// issuesAllDataAtom이 초기 상태인지 확인 (사용안함)
const isInitIssuesAllDataSelector = selector({
  key: 'isInitIssuesAllDataSelector',
  get: ({ get }) => {
    const issuesAllDataState = get(issuesAllDataAtom);
    const isIssuesAllDataEmpty = Object.values(issuesAllDataState.data).every((v) => !v);
    const result = issuesAllDataState.isLoading && isIssuesAllDataEmpty;
    return result;
  },
});

export {
  filterVisibleAtom,
  filterSelectionAtom,
  isInitFilterSelectionSelector,
  idOfCheckedIssuesAtom,
  issuesAllDataAtom,
};
export type { IFilterVisible, TFilterSelection };
