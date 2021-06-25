import { useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { writeOptionsVisibleAtom } from 'util/store';
import { IAllGetRequestDatas } from 'util/types';

import WriteBody from './WriteBody';
import WriteFooter from './WriteFooter';
import WriteHeader from './WriteHeader';

export interface IIssueWrite { data?: IAllGetRequestDatas }
// IssueWrite를 구성하는 다른 부품에서 쓰임.
export interface IIssueWriteChildren extends IIssueWrite { 
  handleWriteOptionsModalClick: (strType: 'assignee' | 'label' | 'milestone') => void;
}

const IssueWrite = ({ data, ...props }: IIssueWrite) => {
  // 1. 일반
  const setWriteOptionsVisibleState = useSetRecoilState(writeOptionsVisibleAtom);

  // 2. useEffect
  // add body event : IssueWrite
  useEffect(() => {
    document.body.addEventListener('click', handleBodyClick);
    return () => document.body.removeEventListener('click', handleBodyClick);
  }, []);

  // 3. events
  // body event : IssueWrite
  const handleBodyClick = (e: React.MouseEvent | Event) => {
    const target = e.target as HTMLElement;
    const closestTarget: HTMLElement | null = target.closest('#modal');
    const closestModalBtn: HTMLElement | null = target.closest('#modalBtn');

    if ((closestTarget && closestTarget.contains(target)) || closestModalBtn) return;
    setWriteOptionsVisibleState((writeOptionsState) => ({
      ...writeOptionsState,
      assignee: false,
      label: false,
      milestone: false,
    }));
  };

  // issueWrite의 모든 modal
  const handleWriteOptionsModalClick = useCallback(
    (strType: 'assignee' | 'label' | 'milestone') => {
      setWriteOptionsVisibleState((writeOptionsState) => ({
        ...writeOptionsState,
        [strType]: !writeOptionsState[strType],
      }));
    },
    [],
  );

  return (
    <IssueWriteLayout {...props}>
      <WriteHeader />
      <WriteBody {...{data, handleWriteOptionsModalClick}} />
      <WriteFooter />
    </IssueWriteLayout>
  );
};

export default IssueWrite;

// --- Styled Components ---
const IssueWriteLayout = styled.div``;
