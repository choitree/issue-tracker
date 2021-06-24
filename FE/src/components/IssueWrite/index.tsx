import styled from 'styled-components';
import WriteBody from './WriteBody';
import WriteFooter from './WriteFooter';
import WriteHeader from './WriteHeader';

const IssueWrite = () => {
  return (
    <IssueWriteLayout>
      <WriteHeader />
      <WriteBody />
      <WriteFooter />
    </IssueWriteLayout>
  );
};

export default IssueWrite;

// --- Styled Components ---
const IssueWriteLayout = styled.div``;
