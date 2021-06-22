import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';

import { IIssueList } from '..';
import { IIssuesInfo } from 'util/types';
import { filterSelectionAtom, idOfCheckedIssuesAtom } from 'util/store/issueList';
import { isZeroFilterSelection, getFilterLabelData, getFilterMilestoneData, pipe } from 'util/util';

import { Checkbox } from '@material-ui/core';
import { IconAlertCircle, IconMileStone } from '../../Common/Icons';
import { FaHashtag } from 'react-icons/fa';
import Label from '../../Common/Label';


const ListBody = ({ data, ...props }: IIssueList) => {
  // 1. 일반
  const filterSelectionState = useRecoilValue(filterSelectionAtom);
  const [idOfCheckedIssuesState, setIdOfCheckedIssuesState] = useRecoilState(idOfCheckedIssuesAtom);
  const [issues, setIssues] = useState<IIssuesInfo>();

  // 2. useEffect
  useEffect(() => {
    if (!data || !data.issues) return;
    let arrIssues = data.issues.issues;
    if (!isZeroFilterSelection(filterSelectionState)) {
      arrIssues = pipe(
        getFilterLabelData(filterSelectionState['label']),
        getFilterMilestoneData(filterSelectionState['milestone']),
      )(arrIssues);
    }

    setIssues({ issues: arrIssues });
  }, [data?.issues, filterSelectionState]);

  // 3. Events
  const handleIssueCheckboxClick = useCallback((e : React.MouseEvent | Event) => {
    const target = e.target as HTMLInputElement;
    target.checked
      ? setIdOfCheckedIssuesState(idOfCheckedIssuesState.concat(Number(target.id)))
      : setIdOfCheckedIssuesState(idOfCheckedIssuesState.filter((id) => id !== Number(target.id)));
  }, [idOfCheckedIssuesState]);


  return (
    <ListBodyLayout {...props}>
      {issues &&
        issues.issues.map((issue) => (
          <ListBodyRow key={issue.issueId}>
            {/* 좌측 */}
            <ListBodyBlock>
              <Checkbox
                color="primary"
                id={`${issue.issueId}`}
                onClick={handleIssueCheckboxClick}
                checked={idOfCheckedIssuesState.includes(issue.issueId)}
              />
              <TitleInfoBlock>
                <TitleBlock>
                  <span className="icon">
                    <IconAlertCircle />
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
                  {/* 이 이슈가 8분 전, Oni님에 의해 작성되었습니다 */}
                  <span>
                    이 이슈가 {'몇 초/분 전'}, {issue.history.userName}에 의해
                    작성되었습니다.
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
              <AssigneeProfileBlock>
                <IconAlertCircle /> {/* 유저 이미지 어디갔어.. */}
              </AssigneeProfileBlock>
            </ListBodyBlock>
          </ListBodyRow>
        ))}
    </ListBodyLayout>
  );
};
export default ListBody;

// --- Styled Components ---
// 1. 메인 (큰 틀)
const ListBodyLayout = styled.div`
  background-color: ${({ theme }) => theme.colors.grayScale.offWhite};
  border-radius: 0px 0px 0.5rem 0.5rem;
  width: inherit;
`;

const ListBodyRow = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayScale.line};
  padding: 1.05rem 0;
  :last-child {
    border-bottom: none;
  }
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

const AssigneeProfileBlock = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.4rem;
  margin-right: 3.2rem;
`;
