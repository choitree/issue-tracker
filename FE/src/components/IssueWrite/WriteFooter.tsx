import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authHeadersAtom, isDataSubmitAtom, isPossibleSubmitSelector, writeDataAtom, refetchAtom } from 'util/store';
import { createFetchOptions, IFetchOptions, useFetch } from 'util/hooks';
import { createRequestAddress } from 'util/API';

import { Link, useHistory } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import PrimaryButton from 'components/Common/PrimaryButton';

const WriteFooter = ({ ...props }) => {
  // 1. 일반
  const history = useHistory();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const isPossibleSubmit = useRecoilValue(isPossibleSubmitSelector);
  const writeDataState = useRecoilValue(writeDataAtom);
  const setIsDataSubmit = useSetRecoilState(isDataSubmitAtom);
  const authHeadersState = useRecoilValue(authHeadersAtom);
  const [issueWriteFetchOptions, setIssueWriteFetchOptions] = useState<IFetchOptions | undefined>();
  const setRefetchState = useSetRecoilState(refetchAtom);

  // 2. useFetch & useEffect
  const useFetchParams = useMemo(() => ({ options: issueWriteFetchOptions, deps: [isSubmit]}), [issueWriteFetchOptions]);
  const { result: writeResult } = useFetch<object>({...useFetchParams, url: createRequestAddress('issue')});

  useEffect(() => setIsSubmit(true), [issueWriteFetchOptions]);
  useEffect(() => {
    if (!writeResult) return;
    if (JSON.stringify(writeResult).indexOf("OK") <= -1) return;
    setIsSubmit(false);
    setIsDataSubmit(true);
    setRefetchState('issues');
    history.push('/issues');
  }, [writeResult]);

  // 3. events
  const handleWriteButtonClick = (e: React.MouseEvent | Event) => {
    if (!isPossibleSubmit || !authHeadersState || authHeadersState.isLoading) return;
    setIssueWriteFetchOptions( createFetchOptions({ method: 'POST', headers: authHeadersState.headers, body: writeDataState }) );
  }

  return (
    <WriteFooterLayout {...props}>
      <Link to="/issues">
        <span>
          <FaTimes />
        </span>
        <span>작성 취소</span>
      </Link>
      <WriteButton onClick={handleWriteButtonClick}>완료</WriteButton>
    </WriteFooterLayout>
  );
};

export default WriteFooter;

// --- Styled Components ---
const WriteFooterLayout = styled.div`
  margin-top: 2rem;
  text-align: right;
  a {
    color: ${({ theme }) => theme.colors.grayScale.label};
    padding: 0.5rem 1rem;
    margin-right: 1rem;
    cursor: pointer;
    text-decoration: none;
    span:first-child {
      vertical-align: middle;
      margin-right: 0.5rem;
    }
  }
`;
const WriteButton = styled(PrimaryButton)`
  padding: 0.75rem 0rem;
  width: 15rem;
  display: inline-block;
`;
