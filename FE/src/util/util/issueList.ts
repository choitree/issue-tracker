import { TFilterSelection } from "util/store";
import { IIssue } from "util/types";

// 1. IssuesPage Filter 관련 (IssueList -> ListBody 컴포넌트에서 사용)
// 1) 레이블
const getFilterLabelData = (arrLabelState: number[]) => (arrIssues: IIssue[]) =>
  arrLabelState.length > 0
    ? arrIssues.filter(
        (issue) =>
          issue.labels.findIndex((label) =>
            arrLabelState.includes(label.labelId),
          ) > -1,
      )
    : arrIssues;
// 2) 마일스톤
const getFilterMilestoneData =
  (arrMilestoneState: number[]) => (arrIssues: IIssue[]) =>
    arrMilestoneState.length > 0
      ? arrIssues.filter((issue) =>
          arrMilestoneState.includes(issue.milestone.milestoneId),
        )
      : arrIssues;

// [보류] --------------------- START
// 담당자 / 작성자 관련 데이터, GET - issues에서 찾기 어려움 ====
// 3) 담당자 --  / 담당자들에 관련한 데이터 어디있는거지?
const getFilterAssigneeData =
  (arrIssues: IIssue[]) => (arrAssigneeValue: number[]) => {};

// 4) 작성자
const getFilterWriterData =
  (arrIssues: IIssue[]) => (arrWriterValue: number[]) =>
    arrIssues.filter(
      (issue) => arrWriterValue.includes(-1), // 보류 (-1 아님. 바꿔야함)
    );

// 5) 검색바
const getFilterSearchData = (arrIssues: IIssue[]) => {};
// [보류] --------------------- END

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

export {
  getFilterLabelData,
  getFilterMilestoneData,
  /* getFilterAssigneeData, 
    getFilterWriterData, 
    getFilterSearchData, */
  isZeroFilterSelection,
};
