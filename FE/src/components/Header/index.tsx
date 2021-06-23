import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Logo from './Logo';
import UserMenu from './UserMenu';
import { TextHeader } from '../../util/reference';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authHeadersAtom, userDataAtom } from 'util/store';


export interface IHeaderUser {
  profileImage?: string | null;
  username?: string | null;
}

const Header = () => {
  const { logo } = TextHeader;
  const [userInfo, setUserInfo] = useState<IHeaderUser>({ profileImage: '', username: '' });

  // 이 구간은 커스텀 훅..? 으로 만들어도 될지도? ------------- START

      // 만약 Recoil : userDataState에 값이 없다면 (값이 없을 경우는 새로고침..)
      // localStorage 확인 후 있다면 Recoil : userDataState & authHeadersState 업데이트

  const history = useHistory();
  const setAuthHeadersState = useSetRecoilState(authHeadersAtom);
  const [userDataState, setUserDataState] = useRecoilState(userDataAtom);

  useEffect(() => {
    // 이것들도 그냥 처음만들때 객체화하면 안되나..? 나중에 리팩
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const profileImage = localStorage.getItem('profileImage');

    const values = [token, id, name, email, profileImage];
    if (values.some((v) => !v)) history.push('/')
    else {
      setUserDataState({ token: token!, id: id!, name: name!, email: email!, profileImage: profileImage! });
      setAuthHeadersState((authHeadersState) => ({
        ...authHeadersState,
        headers: {
          ...authHeadersState.headers,
          Authorization: `Bearer ${token}`,
        },
        isLoading: false,
      }));
    }
  }, []);

  // ------------- END

  useEffect(
    () =>
      setUserInfo({
        ...userInfo,
        profileImage: userDataState.profileImage,
        username: userDataState.name,
      }),
    [userDataState],
  );

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
