import LoadingSpinner from '../components/Common/LoadingSpinner';
import IssueList from '../components/IssueList';
import useRefreshAPIDataState from 'util/hooks/useRefreshAPIDataState';

const IssuePage = () => {
  const { data, isLoading } = useRefreshAPIDataState();
  return !isLoading ? (
    <IssueList data={data} />
  ) : (
    <LoadingSpinner>로딩 중...🤪</LoadingSpinner>
  );
};

export default IssuePage;
