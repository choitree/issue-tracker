// issueList (IssuePage)
import { atom } from 'recoil';
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
  }
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
    labels?: ILabelsInfo,
    milestones?: IMilestonesInfo,
    users?: IUsersInfo,
    issues?: IIssuesInfo
  };
};

const issuePageDataAtom = atom<TIssuePageData>({
  key: 'issuePageDataAtom',
  default: {
    isLoading: true,
    data: {
      issues: undefined,
      milestones: undefined,
      labels: undefined
    }
  }
});



export { filterVisibleAtom, issuePageDataAtom, filterSelectionAtom, idOfCheckedIssuesAtom };
export type { IFilterVisible, TFilterSelection };
