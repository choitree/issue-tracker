import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authHeadersAtom, IUserData, userDataAtom } from 'util/store';

const useRefreshUserState = (deps = []) => {

  const history = useHistory();
  const [authHeadersState, setAuthHeadersState] =
    useRecoilState(authHeadersAtom);
  const [userDataState, setUserDataState] = useRecoilState(userDataAtom);

  const updateUserAndAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const profileImage = localStorage.getItem('profileImage');

    const userData: IUserData = {
      token: token || '',
      email: email || '',
      id: id || '',
      name: name || '',
      profileImage: profileImage || '',
    };

    if (Object.values(userData).some((v) => !v)) history.push('/');
    else {
      setUserDataState(userData);
      setAuthHeadersState((authHeadersState) => ({
        ...authHeadersState,
        headers: {
          ...authHeadersState.headers,
          Authorization: `Bearer ${userData.token}`,
        },
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    if (deps.length > 0 && deps.some((v) => !v)) return;
    updateUserAndAuthHeaders();
  }, deps);

  return {
    refreshUserDataState: userDataState,
    refreshAuthHeadersState: authHeadersState,
  };
};

export default useRefreshUserState;
