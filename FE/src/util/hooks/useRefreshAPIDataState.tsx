import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { createGetRequestAddress } from "util/API";
import { authHeadersAtom, isInitIssuesAllDataSelector, issuesAllDataAtom } from "util/store";
import { IIssuesInfo, ILabelsInfo, IMilestonesInfo, IUsersInfo } from "util/types";
import useFetch, { createFetchOptions, IFetchOptions } from "./useFetch";

function useRefreshAPIDataState () {
  // 1. 일반
  const [issuesAllDataState, setIssuesAllDataState] = useRecoilState(issuesAllDataAtom);
  const isInitIssuesAllDataState = useRecoilValue(isInitIssuesAllDataSelector);
  const authHeadersState = useRecoilValue(authHeadersAtom);
  const [issuePagefetchOptions, setIssuePageFetchOptions] = useState<IFetchOptions | undefined>();

  // useFetch에 들어갈 options을 만드는 부분, authHeadersState.isLoading이 false여야 fetch 작동
  useEffect(() => {
    if (!authHeadersState || authHeadersState.isLoading) return;
    setIssuePageFetchOptions(
      createFetchOptions({ method: 'GET', headers: authHeadersState.headers }),
    );
  }, [authHeadersState]);

  const useFetchParams = useMemo(
    () => ({
      options: issuePagefetchOptions,
      deps: [issuePagefetchOptions, isInitIssuesAllDataState],  // dependency
    }),
    [issuePagefetchOptions, isInitIssuesAllDataState],
  );

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


  return issuesAllDataState;
}

export default useRefreshAPIDataState;
