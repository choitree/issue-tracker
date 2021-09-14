import React, { useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';

import { IIssueList } from '..';
import { filterSelectionAtom, checkedIssueIdsAtom, userDataAtom, currentViewIssuesAtom } from 'util/store';
import {
  pipe,
  isZeroFilterSelection,
  getFilterLabelData,
  getFilterMilestoneData,
  getFilterAssigneeData,
  getFilterWriterData,
  getFilterSearchData,
  getIssueHistoryFlagText,

  RECOIL_OPEN_ISSUE,
  RECOIL_CLOSE_ISSUE,
  calcPastTime,
} from 'util/util';

import { Checkbox } from '@material-ui/core';
import { IconAlertCircle, IconArchive, IconMileStone } from '../../Common/Icons';
import { FaHashtag } from 'react-icons/fa';
import Label from '../../Common/Label';
import { IIssue } from 'util/types';

const ListBody = ({ data, ...props }: IIssueList) => {
  // 1. 일반
  const [filterSelectionState, setFilterSelectionState] = useRecoilState(filterSelectionAtom);
  const [checkedIssueIdsState, setCheckedIssueIdsState] = useRecoilState(checkedIssueIdsAtom);
  const [currentViewIssuesState, setCurrentViewIssuesState] = useRecoilState(currentViewIssuesAtom);
  const userDataState = useRecoilValue(userDataAtom);

  // 2. useEffect
  // 초기 렌더링엔 Open된 이슈만 보이게 (filterSelectionState 업뎃)
  useEffect(() => setFilterSelectionState({ ...filterSelectionState, search: [RECOIL_OPEN_ISSUE] }), []);

  // ListBody에서 필터링 실행함 (SearchBar 컴포넌트에서 필터버튼 눌러도 여기서!)
  useEffect(() => {
    if (!data || !data.issues) return;
    const arrIssues = data.issues.issues;
    const createCurrentViewIssuesInfo = (arrIssues : IIssue[]) => ({
      viewIssues: getFilterSearchData(filterSelectionState["search"], Number(userDataState.id))(arrIssues),
      openIssues: getFilterSearchData([RECOIL_OPEN_ISSUE], Number(userDataState.id))(arrIssues),
      closeIssues: getFilterSearchData([RECOIL_CLOSE_ISSUE], Number(userDataState.id))(arrIssues),
    });
    let currentViewIssuesInfo = createCurrentViewIssuesInfo(arrIssues);

    if (!isZeroFilterSelection(filterSelectionState)) {
      const arrFilterIssues = pipe(
        getFilterLabelData(filterSelectionState['label']),
        getFilterMilestoneData(filterSelectionState['milestone']),
        getFilterAssigneeData(filterSelectionState["assignee"]),
        getFilterWriterData(filterSelectionState["writer"]),
      )(arrIssues);
      currentViewIssuesInfo = createCurrentViewIssuesInfo(arrFilterIssues);
    }

    const { viewIssues, openIssues, closeIssues } = currentViewIssuesInfo;
    setCurrentViewIssuesState((state) => ({ ...state, viewIssues, openIssues, closeIssues }));
  }, [data?.issues, filterSelectionState]);

  // 3. Events
  const handleIssueCheckboxClick = useCallback((e : React.MouseEvent | Event) => {
    const target = e.target as HTMLInputElement;
    setCheckedIssueIdsState((state) => ({
      ...state,
      current: target.checked ? state.current.concat(Number(target.id)) : state.current.filter((id) => id !== Number(target.id)),
    }));
  }, [checkedIssueIdsState]);


  return (
    <ListBodyLayout {...props}>
      {currentViewIssuesState?.viewIssues.length > 0 ? (
        currentViewIssuesState.viewIssues.map((issue) => (
          <ListBodyRow key={issue.issueId}>
            {/* 좌측 */}
            <ListBodyBlock>
              <Checkbox
                color="primary"
                id={`${issue.issueId}`}
                onClick={handleIssueCheckboxClick}
                checked={checkedIssueIdsState.current.includes(issue.issueId)}
              />
              <TitleInfoBlock>
                <TitleBlock>
                  <span className="icon">
                    {issue.isOpen ? <IconAlertCircle /> : <IconArchive />}
                  </span>
                  <span className="subject">{issue.title}</span>
                  {issue.labels.map(({ color, bgColor, title, labelId }) => (
                    <Label key={labelId} color={color} bgColor={bgColor}>
                      {title}
                    </Label>
                  ))}
                </TitleBlock>
                <InfoBlock>
                  <span className="issue__id">
                    <FaHashtag />
                    {issue.issueId}
                  </span>
                  <span>
                    이 이슈가 {calcPastTime(issue.history.historyDateTime)},{' '}
                    {issue.history.userName}에 의해{' '}
                    {getIssueHistoryFlagText(issue.history.flag)}
                  </span>
                  <span>
                    <IconMileStone />
                    {issue.milestone.title}
                  </span>
                </InfoBlock>
              </TitleInfoBlock>
            </ListBodyBlock>

            {/* 우측 */}
            <ListBodyBlock>
              <WriterBlock>
                <WriterImageBlock imgUrl={issue.author.profileImage} />
              </WriterBlock>
            </ListBodyBlock>
          </ListBodyRow>
        ))
      ) : (
        <ListBodyRow isEmpty>
          <span>등록된 이슈가 없습니다.</span>
        </ListBodyRow>
      )}
    </ListBodyLayout>
  );
};
export default ListBody;

// --- Styled Components ---
type TListBodyRow = { isEmpty? : boolean };
type TWriterImageBlock = { imgUrl: string  };

// 1. 메인 (큰 틀)
const ListBodyLayout = styled.div`
  background-color: ${({ theme }) => theme.colors.grayScale.offWhite};
  border-radius: 0px 0px 0.5rem 0.5rem;
  width: inherit;

  display: flex;
  flex-direction: column-reverse;
`;

const ListBodyRow = styled.div<TListBodyRow>`
  display: flex;
  justify-content: ${({ isEmpty }) => isEmpty ? 'center' : 'space-between'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayScale.line};
  padding: 1.05rem 0;
  :first-child {
    // 부모 (ListBodyLayout)의 flex-direction이 column-reverse임
    // 그러므로 눈에 보이는 마지막은 last-child가 아닌 first-child
    border-bottom: none;
  }

  ${({ isEmpty, theme }) => isEmpty && 
    css`span { color: ${theme.colors.grayScale.label}; padding: 1rem 0; }`}
`;

const ListBodyBlock = styled.div`
  display: flex;
  column-gap: 0.8rem;
`;
// =====

// 2. 일반
const TitleInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.4rem;
`;

const TitleBlock = styled.div`
  display: flex;
  column-gap: 0.6rem;
  align-items: center;

  span {
    &.icon {
      color: ${({ theme }) => theme.colors.normal.blue};
    }
    &.subject {
      font-size: ${({ theme }) => theme.fontSize.M};
      font-weight: ${({ theme }) => theme.fontWeight.bold};
    }
  }
`;

const InfoBlock = styled.div`
  display: flex;
  column-gap: 1.2rem;
  align-items: center;

  span {
    font-size: ${({ theme }) => theme.fontSize.XS};
    color: ${({ theme }) => theme.colors.grayScale.label};
    display: flex;
    align-items: center;
    column-gap: 0.4rem;

    &.issue__id {
      column-gap: 0.1rem;
    }

    svg {
      fill: currentColor;
      stroke: currentColor;
    }
  }
`;

const WriterBlock = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.4rem;
  margin-right: 3.2rem;
`;

const WriterImageBlock = styled.div<TWriterImageBlock>`
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.grayScale.line};
  min-width: 1.2rem;
  min-height: 1.2rem;
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url(${({ imgUrl }) => imgUrl});
`;