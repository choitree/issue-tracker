import { useState, useEffect } from 'react';

type HTTP_METHODS = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS';
type TFetchHeaders = {
  'Content-Type': 'application/json' | 'application/x-www-form-urlencoded';
  Authorization?: string,
};

interface IFetchOptions {
  method: HTTP_METHODS;
  headers?: TFetchHeaders;
  body?: object | string;
}

interface IFetchState {
  endpoint: string;
  query: IFetchQuery[] | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}

interface IFetchQuery {
  [key: string]: string;
}

const initFetchOptionHeaders : TFetchHeaders = { 'Content-Type': 'application/json' };

const createFetchOptions = ({ method, headers, body }: IFetchOptions) : IFetchOptions =>  {
  const arrMethod: string[] = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'];
  const isMethod: boolean = arrMethod.findIndex((v) => method === v) > -1;

  let result : IFetchOptions = {
    method: isMethod ? method : 'GET',
    headers: headers || initFetchOptionHeaders,
  };
  return !body ? result : { ...result, body: JSON.stringify(body) };
};

const queryMaker = (url: URL) =>
  url.search
    .substring(1)
    .split('&')
    .map((query) => {
      const [key, value] = query.split('=');
      return { [key]: value };
    });

// useFetch
interface IuseFetch {
  url: string;
  options?: IFetchOptions;
  deps?: any[];  // DependencyList
  checkBeforeFetchExecute?: () => boolean;
}

function useFetch<T>({ url, options, deps = [], checkBeforeFetchExecute } : IuseFetch) {
  const urlObjects = new URL(url);
  const initialFetchState: IFetchState = {
    endpoint: urlObjects.host,
    query: null,
    isLoading: true,
    isError: false,
    errorMessage: '',
  };

  if (urlObjects.search) initialFetchState.query = queryMaker(urlObjects);

  const [fetchState, setFetchState] = useState<IFetchState>(initialFetchState);
  const [result, setResult] = useState<T | undefined>();
  const [prevDeps, setPrevDeps] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(url, options as RequestInit);
      const data = await res.json();
      setResult(data);
      setFetchState({ ...fetchState, isLoading: false });
    } catch (e) {
      const { message } = e as Error;
      setFetchState({ ...fetchState, isLoading: false, isError: true, errorMessage: message });
    }
  };

  useEffect(() => {
    if (deps.length > 0) {
      let isExecute = deps.findIndex((dep) => !dep) <= -1;

      if (prevDeps.length === 0) setPrevDeps(deps);
      else isExecute = isExecute && deps.some((dep, idx) => prevDeps[idx] !== dep);

      if (!isExecute) return;
    } else
      (prevDeps.length > 0) && setPrevDeps([]);

    checkBeforeFetchExecute
      ? checkBeforeFetchExecute() && fetchData()
      : fetchData();
  }, deps);

  return { result, fetchState };
}

export { createFetchOptions, initFetchOptionHeaders };
export type { TFetchHeaders, IFetchOptions };
export default useFetch;
