import styled from 'styled-components';
import DefaultButton from 'components/Common/DefaultButton';
import CloseIcon from '@material-ui/icons/Close';

const InitFilterButton = ( {...props} ) => {
  return (
    <InitFilterButtonLayout {...props}>
      <CloseIcon/>
      <span>현재의 검색 필터 및 정렬 지우기</span>
    </InitFilterButtonLayout>
  );
};

export default InitFilterButton;

// --- Styled Components ---
const InitFilterButtonLayout = styled(DefaultButton)`
  display: flex;
  align-items: center;
  column-gap: 0.3rem;

  color: ${({ theme }) => theme.colors.grayScale.label};
  font-weight: ${({ theme }) => theme.fontWeight.bold};

  :hover {
    color: ${({ theme }) => theme.colors.grayScale.placeHolder};
  }
`;
