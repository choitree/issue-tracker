import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { createGetRequestAddress } from 'util/API';
import { authHeadersAtom, issuesAllDataAtom, refetchAtom } from 'util/store';
import { IIssuesInfo, ILabelsInfo, IMilestonesInfo, IUsersInfo } from "util/types";
import useFetch, { createFetchOptions, IFetchOptions } from './useFetch';

function useRefreshAPIDataState() {
  // 1. 일반
  const [issuesAllDataState, setIssuesAllDataState] = useRecoilState(issuesAllDataAtom);
  const [refetchState, setRefetchState] = useRecoilState(refetchAtom);
  const authHeadersState = useRecoilValue(authHeadersAtom);
  const [issuePagefetchOptions, setIssuePageFetchOptions] = useState<IFetchOptions | undefined>();

  // useFetch에 들어갈 options을 만드는 부분, authHeadersState.isLoading이 false여야 fetch 작동
  useEffect(() => {
    if (!authHeadersState || authHeadersState.isLoading) return;
    setIssuePageFetchOptions(
      createFetchOptions({ method: 'GET', headers: authHeadersState.headers }),
    );
  }, [authHeadersState]);

  // 데이터 재요청이 발생하면 이미 저장되어 있던 데이터 중 요청 데이터만 초기화 -> 이후엔 useFetch에서 다시 불러옴
  useEffect(() => {
    if (!refetchState) return;
    setIssuesAllDataState((state) => ({ ...state, data: { ...state.data, [refetchState]: undefined } }));
    setRefetchState("");
  }, [refetchState]);

  const useFetchParams = useMemo(() => {
    const isSomeDataNull = (Object.values(issuesAllDataState.data).some((v) => !v));
    return {
      options: issuePagefetchOptions,
      deps: [issuePagefetchOptions, isSomeDataNull], // dependency
    };
  }, [issuePagefetchOptions, issuesAllDataState]);

  const { result: labelsResult, fetchState: { isLoading: labelsIsLoading } }
    = useFetch<ILabelsInfo>({...useFetchParams, url: createGetRequestAddress('labels')});
  const { result: milestonesResult, fetchState: { isLoading: milestonesIsLoading } }
    = useFetch<IMilestonesInfo>({ ...useFetchParams, url: createGetRequestAddress('milestones')});
  const { result: usersResult, fetchState: { isLoading: usersIsLoading } }
    = useFetch<IUsersInfo>({ ...useFetchParams, url: createGetRequestAddress('users') });
  const { result: issuesResult, fetchState: { isLoading: issuesIsLoading } }
    = useFetch<IIssuesInfo>({ ...useFetchParams, url: createGetRequestAddress('issues')});

  useEffect(() => {
    const arrLoading = [ issuesIsLoading, milestonesIsLoading, labelsIsLoading, usersIsLoading ];
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

  return issuesAllDataState;
}

export default useRefreshAPIDataState;
