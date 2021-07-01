import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { IHeaderUser } from '.';
import { cssDefault, cssImageAuto } from 'util/styles/CommonStyledCSS';


const UserMenu = ({ username, profileImage, ...props }: IHeaderUser) => {
  const history = useHistory();
  const [headerMenuVisible, setHeaderMenuVisible] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const handleMenuButtonClick = (e: React.MouseEvent | Event) => setHeaderMenuVisible(!headerMenuVisible);
  const handleLogoutClick = (e: React.MouseEvent | Event) => {
    localStorage.clear();
    history.push('/');
  }
  const handleBodyClick = (e: React.MouseEvent | Event) => {
    const target = e.target as HTMLElement;

    if (!userMenuRef.current) return;
    if (!userMenuRef.current.contains(target)) setHeaderMenuVisible(false);
  };

  useEffect(() => {
    document.body.addEventListener('click', handleBodyClick);
    return () => document.body.removeEventListener('click', handleBodyClick);
  }, []);

  return (
    <UserMenuLayout ref={userMenuRef}>
      <UserMenuRow>
        <MenuButton {...props} onClick={handleMenuButtonClick}>
          <img
            src={profileImage || './image/profile.png'}
            alt={username || ''}
          />
        </MenuButton>
      </UserMenuRow>
      {headerMenuVisible && (
        <UserMenuRow>
          <MenuBlock>
            <Button onClick={handleLogoutClick}>로그아웃</Button>
          </MenuBlock>
        </UserMenuRow>
      )}
    </UserMenuLayout>
  );
};

export default UserMenu;

// --- Styled Components ---
const UserMenuLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserMenuRow = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  ${cssDefault};
  ${cssImageAuto};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.grayScale.line};
  :hover {
    border: 1px solid ${({ theme }) => theme.colors.grayScale.placeHolder};
  }

  img {
    max-width: ${({ theme }) => theme.fontSize.XL};
  }
`;

const MenuBlock = styled.div`
  position: absolute;
  right: 0;
  top: 0.3rem;
  border-radius: 7%;
  border: 1px solid ${({ theme }) => theme.colors.grayScale.inputBgColor};
  background-color: ${({ theme }) => theme.colors.grayScale.offWhite};

  display: flex;
  z-index: 999;

  button {
    min-width: 120px;
    padding: 0.5rem 1.3rem;
  }
`;
