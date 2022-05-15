import { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface Lifecycle {
  beforeRequest?: (config: AxiosRequestConfig) => void;
  onRequest?: (
    config: AxiosRequestConfig,
    fetch: () => AxiosPromise<any>,
  ) => void | (() => AxiosPromise<any>);
  afterRequest?: (res: AxiosResponse) => void;
  onRequestError?: (e: AxiosError) => void;
}

export type LifecycleFn = (config: AxiosRequestConfig) => Lifecycle;
export interface Plugin {
  extends?: {};
  lifecycle?: Lifecycle;
}

type Request = (config: AxiosRequestConfig<any>) => Promise<AxiosResponse<any>>;
export interface UseAxios {
  use(plugin: Plugin): UseAxios;
  request: Request;
}

export interface Plugin2 {
  extends?: any;
  lifecycle?: Lifecycle;
}
/*
export type Use<T = {}> = <P extends Plugin2, R extends T & P['extends']>(
  plugin: P,
) => R & { use: Use<R> };

export type TransformFnReturnType<P extends {}, R = void> = {
  [K in keyof P]: P[K] extends (...args: infer REST) => any ? (...args: REST) => R : P[K];
};

const p = {
  extends: {
    setCache<T>(): T {
      console.log(1);
      return test as any;
    },
  },
};
const p2 = {
  extends: {
    cancelCurrent() {
      console.log(1);
    },
  },
};
interface Origin {
  request: () => string;
  use: Use<Origin>;
}
const test: Origin = 1 as any;

test.use(p);
test.use(p2).cancelCurrent().request();*/
