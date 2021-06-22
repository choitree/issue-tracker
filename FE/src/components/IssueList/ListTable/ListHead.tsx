import styled, { css } from 'styled-components';
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { filterVisibleAtom, idOfCheckedIssuesAtom } from 'util/store';
import { TFilterTypes } from 'util/types';

import { IIssueListChildren } from '..';
import { Checkbox, Tabs, Tab, Button } from '@material-ui/core';
import { IconAlertCircle, IconArchive } from '../../Common/Icons';
import { MdKeyboardArrowDown } from 'react-icons/md';
import ListModal from '../../Common/ListModal';
import {
  TextIssueList,
  TIssueListFilterItem,
  TTextIssueListFilterItems,
} from 'util/reference';


type TIssueOpenOrClose = { open: number, close: number, issueIds: number[], length: number };

const ListHead = ({ data, handleFilterModalClick, ...props }: IIssueListChildren) => {
  // 1. 일반 (Recoil 등)
  const { table: { header: { left, right }, } } = TextIssueList;

  const [leftTabsState, setLeftTabsState] = useState(0);
  const [filterVisibleState, setFilterVisibleState] = useRecoilState(filterVisibleAtom);
  const [idOfCheckedIssuesState, setIdOfCheckedIssuesState] = useRecoilState(idOfCheckedIssuesAtom);

  const [issueOpenOrClose, setIssueOpenOrClose] = useState<TIssueOpenOrClose>({open: 0, close: 0, issueIds: [], length: 0});
  const [issueListFilterData, setIssueListFilterData] = useState<TTextIssueListFilterItems>();

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

  // 2) 필터 (ListModal)에 들어가는 데이터 생성 (함수 분리하고싶다.. 하지만 시간없다)
  useEffect(() => {
    if (!data) return;
    // assignee(담당자) & writer(작성자) ==> users 데이터
    const { milestones, labels, users } = data;
    if (!milestones || !labels || !users) return;

    const usersFilterItems: TIssueListFilterItem[] = users.users.map(
      ({ userId, userName, profileImage }) => ({
        id: userId,
        name: userName,
        imgUrl: profileImage,
        imgType: 'image',
      }),
    );
    const milestonesFilterItems: TIssueListFilterItem[] =
      milestones.milestones.map(({ milestoneId, title }) => ({
        id: milestoneId,
        name: title,
      }));
    const labelsFilterItems: TIssueListFilterItem[] = labels.labels.map(
      ({ labelId, title, bgColor }) => ({
        id: labelId,
        name: title,
        color: bgColor,
        imgType: 'color',
      }),
    );

    const fitlerData: TTextIssueListFilterItems = {
      assignee: {
        title: '담당자 필터',
        items: [
          { id: -1, name: 'noAssignee', text: '담당자가 없는 이슈' },
          ...usersFilterItems,
        ],
        type: 'assignee',
      },
      writer: {
        title: '작성자 필터',
        items: usersFilterItems,
        type: 'writer',
      },
      milestone: {
        title: '마일스톤 필터',
        items: [
          { id: -1, name: 'noMilestone', text: '마일스톤이 없는 이슈' },
          ...milestonesFilterItems,
        ],
        type: 'milestone',
      },
      label: {
        title: '레이블 필터',
        items: [
          { id: -1, name: 'noLabel', text: '레이블이 없는 이슈' },
          ...labelsFilterItems,
        ],
        type: 'label',
      },
    };

    setIssueListFilterData(fitlerData);
  }, [data?.milestones, data?.labels, data?.users]);

  // =========

  // 3. events

  // 1) 열린 / 닫힌 이슈 클릭 (미완)
  const handleLeftTabsState = (e: React.ChangeEvent<{}>, value: number) =>
    setLeftTabsState(value);

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
      {filterVisibleState[name] && issueListFilterData && (
        <RightRow>
          <ListModal rightPos="0" data={issueListFilterData[name]} />
        </RightRow>
      )}
    </RightLayout>
  ));

  // =========

  return (
    <ListHeadLayout {...props}>
      {/* 좌측 */}
      <ListHeadRow>
        {/* 아이템 중 하나라도 선택되어있을때 indeterminate checked 모두 true */}
        {/* 아이템 모두 선택되어 있을때 checked만 true */}
        {/* 아이템 선택X --> 모두 false */}
        <Checkbox
          color="primary"
          indeterminate={
            idOfCheckedIssuesState.length > 0 &&
            idOfCheckedIssuesState.length < issueOpenOrClose.length
          }
          checked={idOfCheckedIssuesState.length > 0}
          onClick={handleAllIssueCheckboxClick}
        />
        <LeftTabs value={leftTabsState} onChange={handleLeftTabsState}>
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
