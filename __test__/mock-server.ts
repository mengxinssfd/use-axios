import axios, { AxiosRequestConfig } from 'axios';

function buildRes(res: { code: number; data?: any; msg: string }) {
  return Promise.resolve({ data: res, status: 200 });
}

export const routers = {
  '/config'(data, config) {
    return buildRes({ code: 1000, data: config, msg: 'success' });
  },
  '/user'(data: any, { method }) {
    if (method === 'post') {
      return buildRes({ code: 200, data: { username: 'post', id: 2 }, msg: 'success' });
    }
    return buildRes({ code: 200, data: { username: 'get', id: 1 }, msg: 'success' });
  },
  '/login'(data: any) {
    if (data.username === 'foo' && data.password === 'bar') {
      return buildRes({ code: 200, msg: 'success' });
    }
    return Promise.reject({ code: 0, msg: '账号或密码错误' });
  },
  '404'(d: any = {}) {
    if (d.returnRes === 1) {
      return Promise.reject({ status: 404, response: { data: { code: 200 } } });
    }
    if (d.returnRes === 2) {
      return Promise.reject({ status: 404, response: { data: { code: 300 } } });
    }
    if (d.returnRes === 'obj') {
      return Promise.reject({ test: 1 });
    }
    return Promise.reject('404');
  },
  '/nocode'() {
    return Promise.resolve({ status: 200, data: '1' });
  },
};
jest.mock('axios');
export function useMockAxios(routers: any) {
  const mockCreate = (/*config: AxiosRequestConfig*/) => {
    type InterceptorCB = (config: AxiosRequestConfig) => AxiosRequestConfig | void;
    const interceptors = {
      request: [] as InterceptorCB[],
    };
    function AxiosIns(config) {
      const { url, data, params } = config;
      const cfg = interceptors.request.reduce((prev, cur) => {
        return cur(config) || config;
      }, config);
      if (cfg) Object.assign(config, cfg);
      return (routers[url] || routers['404'])(data || params, config);
    }
    AxiosIns.interceptors = {
      request: {
        use: (cb: InterceptorCB) => {
          interceptors.request.push(cb);
        },
      },
    };
    return AxiosIns;
  };

  (axios as any).create.mockImplementation(mockCreate);
  (axios.CancelToken.source as any).mockReturnValue({});
}
