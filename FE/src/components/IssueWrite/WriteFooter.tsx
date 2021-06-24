import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import PrimaryButton from 'components/Common/PrimaryButton';

const WriteFooter = ({ ...props }) => {
  return (
    <WriteFooterLayout { ...props }>
      <Link to="/issues">
        <span>
          <FaTimes />
        </span>
        <span>작성 취소</span>
      </Link>
      <WriteButton>완료</WriteButton>
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
