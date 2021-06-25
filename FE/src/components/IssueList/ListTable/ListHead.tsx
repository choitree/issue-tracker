import styled, { css } from 'styled-components';
import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterSelectionAtom, filterVisibleAtom, idOfCheckedIssuesAtom, isInitFilterSelectionSelector } from 'util/store';

import { createAllFilterItems, createLabelsFilterItems, createMilestonesFilterItems, createUsersFilterItems, RECOIL_CLOSE_ISSUE, RECOIL_OPEN_ISSUE } from 'util/util';
import { TFilterTypes } from 'util/types';
import {
  TextIssueList,
  TTextIssueListFilterItems,
} from 'util/reference';
import { IIssueListChildren } from '..';

import { Checkbox, Tabs, Tab, Button } from '@material-ui/core';
import { IconAlertCircle, IconArchive } from '../../Common/Icons';
import { MdKeyboardArrowDown } from 'react-icons/md';
import ListFilterModal from '../ListFilterModal';
import useCreateFilterItems from 'util/hooks/useCreateFilterItems';

type TIssueOpenOrClose = { open: number, close: number, issueIds: number[], length: number };

const ListHead = ({ data, handleFilterModalClick, ...props }: IIssueListChildren) => {
  // 1. 일반 (Recoil 등)
  const { table: { header: { left, right }, } } = TextIssueList;

  const [filterVisibleState, setFilterVisibleState] = useRecoilState(filterVisibleAtom);
  const [idOfCheckedIssuesState, setIdOfCheckedIssuesState] = useRecoilState(idOfCheckedIssuesAtom);
  const [filterSelectionState, setFilterSelectionState] = useRecoilState(filterSelectionAtom);
  const isInitFilterSelection = useRecoilValue(isInitFilterSelectionSelector);

  const [leftTabsState, setLeftTabsState] = useState<number | boolean>(0);
  const [issueOpenOrClose, setIssueOpenOrClose] = useState<TIssueOpenOrClose>({open: 0, close: 0, issueIds: [], length: 0});

  const issueListFilterItems = useCreateFilterItems(data);  // 필터 (ListFilterModal)에 들어가는 데이터 생성
  // =========

  // 2. useEffect
  // 1) 이슈 데이터 갯수 정보
  useEffect(() => {
    if (!data || !data.issues) return;
    const arrIssues = data.issues.issues;
    const openCnt = arrIssues.reduce((result, issue) => (result += Number(issue.isOpen)), 0);
    const issueIds = arrIssues.map((issue) => issue.issueId);
    const length = issueIds.length;

    setIssueOpenOrClose({
      ...issueOpenOrClose,
      open: openCnt,
      close: (length - openCnt),
      issueIds,
      length
    });

  }, [data?.issues]);

  // 3) filterSelectionState의 상태가 열린이슈 / 닫힌이슈를 포함하고 있지 않다면
    // LeftTabs 컴포넌트의 value는 false (비활성)
  useEffect(() => {
    let leftTabsTempValue : number | boolean = false;
    if (isInitFilterSelection) {
      if (filterSelectionState["search"].includes(RECOIL_OPEN_ISSUE))
        leftTabsTempValue = 0;
      else if (filterSelectionState["search"].includes(RECOIL_CLOSE_ISSUE))
        leftTabsTempValue = 1;
    }

    setLeftTabsState(leftTabsTempValue);
  }, [filterSelectionState]);

  // =========

  // 3. events

  // 1) 열린 / 닫힌 이슈 클릭
  const handleLeftTabsState = (e: React.ChangeEvent<{}>, value: number) => {
    setLeftTabsState(value);
    const isOpen = value === 0; // value: 0(open) | 1(close) : LeftTabs의 Tab의 고유번호

    // [참고] Recoil의 filterSelectionState["search"]를 업데이트해주면 
      // issue들을 렌더링하는 ListBody 컴포넌트의 pipe에서 필터링함!
    isOpen
      ? setFilterSelectionState({ ...filterSelectionState, search: [RECOIL_OPEN_ISSUE] })
      : setFilterSelectionState({ ...filterSelectionState, search: [RECOIL_CLOSE_ISSUE] });
  }

  // 2) 우측 필터버튼들 (담당자 / 레이블 / 마일스톤 / 작성자 필터) 클릭
  const handleRightBtnsClick = (name: TFilterTypes) => {
    setFilterVisibleState((filterVisibleState) => ({
      ...filterVisibleState,
      assignee: false,
      label: false,
      milestone: false,
      search: false,
      writer: false,
    }));
    handleFilterModalClick(name);
  };

  // 3) 전체 선택 체크박스
  const handleAllIssueCheckboxClick = (e: React.MouseEvent | Event) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    const isAllSelect = idOfCheckedIssuesState.length === issueOpenOrClose.length;
    isAllSelect
      ? setIdOfCheckedIssuesState([])
      : setIdOfCheckedIssuesState(issueOpenOrClose.issueIds);
  }

  // =========

  // 4. render
  const renderLeftTabItems = () =>
    left.map(({ name, value: label }, idx) => (
      <LeftTab
        key={idx}
        label={
          <IconBlock>
            {name === 'open' ? <IconAlertCircle /> : <IconArchive />}
            {label}(
            {name === 'open' ? issueOpenOrClose.open : issueOpenOrClose.close})
          </IconBlock>
        }
      />
    ));
  const rightButtonItems = () => right.map(({ name, value }, idx) => (
    <RightLayout key={idx}>
      <RightRow>
        <RightButton
          id="modalBtn"
          name={name}
          onClick={() => handleRightBtnsClick(name)}
        >
          <span>{value}</span>
          <MdKeyboardArrowDown />
        </RightButton>
      </RightRow>
      {filterVisibleState[name] && issueListFilterItems && (
        <RightRow>
          <ListFilterModal rightPos="0" data={issueListFilterItems[name]} />
        </RightRow>
      )}
    </RightLayout>
  ));

  // =========

  return (
    <ListHeadLayout {...props}>
      {/* 좌측 */}
      <ListHeadRow>
        <Checkbox
          color="primary"
          indeterminate={
            idOfCheckedIssuesState.length > 0 &&
            idOfCheckedIssuesState.length < issueOpenOrClose.length
          }
          checked={idOfCheckedIssuesState.length > 0}
          onClick={handleAllIssueCheckboxClick}
        />
        <LeftTabs value={leftTabsState} onChange={handleLeftTabsState} >
          {renderLeftTabItems()}
        </LeftTabs>
      </ListHeadRow>

      {/* 우측 */}
      <ListHeadRow>{rightButtonItems()}</ListHeadRow>
    </ListHeadLayout>
  );
};
export default ListHead;

// --- Styled Components ---

// 1. 메인 (큰 틀)
const ListHeadLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: inherit;

  background-color: ${({ theme }) => theme.colors.grayScale.bgColor};
  border-radius: 0.5rem 0.5rem 0px 0px;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.grayScale.line}`};
  padding: 0.75rem 0;
`;

const ListHeadRow = styled.div`
  display: flex;
  align-items: center;
`;
// =====

// 2. 일반
const IconBlock = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.4rem;
`;

// 2-1) RightButton(필터) 전용 Wrapper
const RightLayout = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const RightRow = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
`;
// =====

// 3. Material-UI 커스터마이징
const cssMuiTabStyle = css`
  min-height: 2.4rem;
  height: 2.4rem;
  min-width: 3.2rem;
`;

const LeftTabs = styled(Tabs)`
  ${cssMuiTabStyle};

  .MuiTabs-indicator {
    background-color: transparent;
  }
  .Mui-selected {
    font-weight: ${({ theme }) => theme.fontWeight.bold};
  }
`;

const LeftTab = styled(Tab)`
  ${cssMuiTabStyle};
`;

const RightButton = styled(Button)`
  display: flex;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.grayScale.label};

  span {
    margin-right: 0.4rem;
  }
`;
