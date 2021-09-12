import styled from 'styled-components';

const WriteHeader = ({ ...props }) => {
  return (
    <WriteHeaderLayout {...props}>
      <h2>새로운 이슈 작성</h2>
    </WriteHeaderLayout>
  );
};

export default WriteHeader;

// --- Styled Components ---
const WriteHeaderLayout = styled.div`
  margin-top: 4rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayScale.line};
  h2 {
    font-size: 2rem;
    font-weight: 400;
    margin-bottom: 2rem;
  }
`;
