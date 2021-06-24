import styled from 'styled-components';
import { useState, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import LoadingSpinner from '../components/Common/LoadingSpinner';
import IssueList from '../components/IssueList';
import { createGetRequestAddress } from '../util/API';
import useFetch, { createFetchOptions, IFetchOptions } from '../util/hooks/useFetch';
import { IIssuesInfo, ILabelsInfo, IMilestonesInfo, IUsersInfo } from '../util/types/api';
import { authHeadersAtom, issuesAllDataAtom } from 'util/store';


const IssuePage = () => {
  // 1. 일반
  const [issuesAllDataState, setIssuesAllDataState] = useRecoilState(issuesAllDataAtom);
  const authHeadersState = useRecoilValue(authHeadersAtom);
  const [issuePagefetchOptions, setIssuePageFetchOptions] = useState<IFetchOptions | undefined>();

  // 2021.06.24 ------------------ 모든 데이터를 가져오는 이부분.. Header로 옮겨야하나? 아니면 커스텀?
  // 2. useEffect & useFetch
  // useFetch에 들어갈 options을 만드는 부분, authHeadersState.isLoading이 false여야 fetch 작동
  useEffect(() => {
    if (!authHeadersState || authHeadersState.isLoading) return;
    setIssuePageFetchOptions(
      createFetchOptions({ method: 'GET', headers: authHeadersState.headers }),
    );
  }, [authHeadersState]);

  const useFetchParams = useMemo(() => ({
      options: issuePagefetchOptions,
      checkStates: [issuePagefetchOptions],
    }), [issuePagefetchOptions]);

  const { result: labelsResult, fetchState: { isLoading: labelsIsLoading } }
    = useFetch<ILabelsInfo>({...useFetchParams, url: createGetRequestAddress("labels")});
  const { result: milestonesResult, fetchState: { isLoading: milestonesIsLoading } }
    = useFetch<IMilestonesInfo>({...useFetchParams, url: createGetRequestAddress("milestones")});
  const { result: usersResult, fetchState: { isLoading: usersIsLoading } }
    = useFetch<IUsersInfo>({...useFetchParams, url: createGetRequestAddress("users")});
  const { result: issuesResult, fetchState: { isLoading: issuesIsLoading } }
    = useFetch<IIssuesInfo>({...useFetchParams, url: createGetRequestAddress("issues")});

  useEffect(() => {
    const arrLoading = [issuesIsLoading, milestonesIsLoading, labelsIsLoading, usersIsLoading];
    if (arrLoading.some((loading) => loading)) return;

    setIssuesAllDataState({
      isLoading: false,
      data: {
        labels: labelsResult,
        milestones: milestonesResult,
        users: usersResult,
        issues: issuesResult,
      },
    });
  }, [issuesIsLoading, milestonesIsLoading, labelsIsLoading, usersIsLoading]);

  // ----

  return !issuesAllDataState.isLoading ? (
    <IssueList data={issuesAllDataState.data} />
  ) : (
    <LoadingSpinner>
      <IssuePageLoadingText>로딩 중...🤪</IssuePageLoadingText>
    </LoadingSpinner>
  );
};

export default IssuePage;

// --- Styled Components ---
const IssuePageLoadingText = styled.p`
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.grayScale.title};
`;
