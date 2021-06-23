import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { userDataAtom } from 'util/store';
import useRefreshUserState from 'util/hooks/useRefreshUserState';

import Logo from './Logo';
import UserMenu from './UserMenu';
import { TextHeader } from '../../util/reference';

export interface IHeaderUser {
  profileImage?: string | null;
  username?: string | null;
}

const Header = () => {
  const { logo } = TextHeader;
  const [userInfo, setUserInfo] = useState<IHeaderUser>({ profileImage: '', username: '' });

  const { refreshUserDataState } = useRefreshUserState();

  useEffect(() => {
    setUserInfo({
      ...userInfo,
      profileImage: refreshUserDataState.profileImage,
      username: refreshUserDataState.name,
    });
  }, [refreshUserDataState]);

  return (
    <HeaderLayout>
      <Logo>{logo}</Logo>
      <UserMenu {...userInfo} />
    </HeaderLayout>
  );
};

export default Header;

// --- Styled Components ---
const HeaderLayout = styled.div`
  padding: 2.3rem 0;
  display: flex;
  justify-content: space-between;
`;