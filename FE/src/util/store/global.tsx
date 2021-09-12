// global (전역적으로 쓰임)
import { atom } from 'recoil';
import { TFetchHeaders } from 'util/hooks/useFetch';

// 1. OAuth 로그인 후 유저의 정보를 가지고 있을 Atom
interface IUserData {
  token: string;
  id: string;
  name: string;
  email: string;
  profileImage: string;
}

const userDataAtom = atom<IUserData>({
  key: 'userDataAtom',
  default: {
    token: '',
    id: '',
    name: '',
    email: '',
    profileImage: '',
  },
});

// 2. 로그인 후 API 요청할 때 쓰여질 fetchAPI의 headers
interface IAuthHeaders {
  headers: TFetchHeaders;
  isLoading: boolean;
}

const authHeadersAtom = atom<IAuthHeaders>({
  key: 'authHeadersAtom',
  default: {
    headers: {
      'Content-Type': 'application/json',
      Authorization: '',
    },
    isLoading: true,
  },
});

export { userDataAtom, authHeadersAtom };
export type { IUserData };
