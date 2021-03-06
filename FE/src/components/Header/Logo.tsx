import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { TChildren } from '../../util/types';

interface ILogo {
  children?: TChildren;
}

const Logo = ({ children, ...props }: ILogo) => {
  return (
    <LogoLayout {...props}>
      <Link to="/issues">{children}</Link>
    </LogoLayout>
  );
};

export default Logo;

// --- Styled Components ---
const LogoLayout = styled.span`
  font-size: ${({ theme }) => theme.fontSize.XL};
  font-family: ${({ theme }) => theme.fontFamily.logo};
  font-weight: ${({ theme }) => theme.fontWeight.middle};
  font-style: italic;
  a {
    text-decoration: none;
    color: inherit;
  }
`;
