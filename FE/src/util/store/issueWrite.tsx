// issueWrite (IssueWritePage)
import { atom, selector } from 'recoil';

// 1. 작성 폼
interface IWriteDataAtom {
  assignees: number[];
  authorId: number;
  contents: string;
  labels: number[];
  milestone: number;
  title: string;
}

const initWriteData = {
  assignees: [],
  authorId: -1,
  contents: '',
  labels: [],
  milestone: -1,
  title: '',
};

// 1) WriteDataState
const writeDataAtom = atom<IWriteDataAtom>({
  key: 'writeDataAtom',
  default: initWriteData,
});

// WriteDataState가 완전비어있는지 체크
const isInitWriteDataSelector = selector({
  key: 'isInitWriteDataSelector',
  get: ({ get }) => {
    const writeDataState = get(writeDataAtom);
    if (JSON.stringify(writeDataState) === JSON.stringify(initWriteData))
      return true;
    return false;
  },
});

// 서버로 전송가능한 WriteData인지 확인
const isPossibleSubmitSelector = selector({
  key: 'isPossibleSubmitSelector',
  get: ({ get }) => {
    const { title, authorId, milestone } = get(writeDataAtom);
    if (!title || authorId < 0 || milestone < 0) return false;
    return true;
  },
});

// 2) 서버로 전송되었는지 확인
const isDataSubmitAtom = atom<boolean>({
  key: 'isDataSubmitAtom',
  default: false,
});

// 2. 작성 폼 Modal
interface IWriteOptionsVisible {
  assignee: boolean;
  label: boolean;
  milestone: boolean;
}

const writeOptionsVisibleAtom = atom<IWriteOptionsVisible>({
  key: 'writeOptionsVisibleAtom',
  default: {
    assignee: false,
    label: false,
    milestone: false,
  },
});

export {
  writeDataAtom,
  isInitWriteDataSelector,
  isPossibleSubmitSelector,
  isDataSubmitAtom,
  writeOptionsVisibleAtom,
};
export type { IWriteDataAtom };
