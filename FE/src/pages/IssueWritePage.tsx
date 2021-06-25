import LoadingSpinner from 'components/Common/LoadingSpinner';
import IssueWrite from 'components/IssueWrite';
import useRefreshAPIDataState from 'util/hooks/useRefreshAPIDataState';

const IssueWritePage = () => {
  const { data, isLoading } = useRefreshAPIDataState();

  return !isLoading ? (
    <IssueWrite data={data} />
  ) : (
    <LoadingSpinner>로딩 중...🤪</LoadingSpinner>
  );
};

export default IssueWritePage;
