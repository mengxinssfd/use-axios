import axios from 'axios';
import { mockAxiosResponse, sleep } from '../utils';
import { Req } from '../../src/Req';
import { RetryPlugin } from '../../src/plugins/retry/retry.plugin';

jest.mock('axios');
const map = new Map<string, Function>();
const timesMap = new Map<string, number>();
const mockCreate = () => {
  return function (requestConfig) {
    const { cancelToken, url, method, data, headers, params } = requestConfig;
    const key = JSON.stringify({ url, method, params, data, headers });
    const times = timesMap.get(key) || 0;
    return new Promise((res, rej) => {
      timesMap.set(key, times + 1);
      map.set(cancelToken, (msg?: string) => {
        rej({ message: msg });
      });
      if (url === '/config') {
        if (times === 3) {
          setTimeout(() => res(mockAxiosResponse(requestConfig, requestConfig)));
          return;
        }
      }
      if (url === '3') {
        if (times === 3) {
          setTimeout(() => {
            res(mockAxiosResponse(requestConfig, { code: 200, data: {}, msg: 'success' }));
          });
          return;
        }
      }
      setTimeout(() => {
        if (times > 0) {
          rej('times * ' + times);
          return;
        }
        rej('404');
      });
    });
  };
};
(axios.CancelToken.source as any).mockImplementation(() => {
  const token = Math.floor(Math.random() * 0xffffffffff).toString(16);
  return {
    token,
    cancel(msg?: string) {
      map.get(token)?.(msg);
    },
  };
});

(axios as any).create.mockImplementation(mockCreate);
(axios as any).isCancel = (value: any) => typeof value === 'object' && 'message' in value;

describe('retry', () => {
  const req = new Req().use(RetryPlugin());
  test('base', async () => {
    expect.assertions(4);
    const list = [
      req.request<{ username: string; id: number }>({ url: '/user', data: { key: 1 } }),
      req
        .useRetry({ times: 2 })
        .request<{ username: string; id: number }>({ url: '/user', data: { key: 2 } }),
      req
        .useRetry({ times: 10 })
        .request<{ username: string; id: number }>({ url: '/user', data: { key: 3 } }),
    ];
    const res = await Promise.allSettled(list);
    expect(res).toEqual([
      {
        reason: '404',
        status: 'rejected',
      },
      {
        reason: 'times * 2',
        status: 'rejected',
      },
      {
        reason: 'times * 10',
        status: 'rejected',
      },
    ]);

    try {
      await req.request<{ username: string; id: number }>({ url: '/user', data: { key: 4 } });
    } catch (e) {
      expect(e).toBe('404');
    }

    try {
      await req
        .useRetry({ times: 2 })
        .request<{ username: string; id: number }>({ url: '/user', data: { key: 5 } });
    } catch (e) {
      expect(e).toBe('times * 2');
    }
    try {
      await req
        .useRetry({ times: 10 })
        .request<{ username: string; id: number }>({ url: '/user', data: { key: 6 } });
    } catch (e) {
      expect(e).toBe('times * 10');
    }
  });
  test('第3次成功', async () => {
    expect.assertions(2);
    try {
      await req.useRetry({ times: 2 }).request<{ username: string; id: number }>({
        url: '3',
        data: { code: 200, data: {}, msg: 'success' },
      });
    } catch (e) {
      expect(e).toBe('times * 2');
    }
    const res = await req
      .useRetry({ times: 3 })
      .request<{ username: string; id: number }>({ url: '3' });
    expect(res).toEqual({
      config: {
        url: '3',
      },
      data: {
        code: 200,
        data: {},
        msg: 'success',
      },
      status: 200,
    });
  });

  describe('immediate', () => {
    test('use', async () => {
      let res: any;
      const p = req
        .useRetry({ times: 1, immediate: true, interval: 1000 })
        .request({ url: '/user', data: { use: 1 } });
      p.catch((r) => (res = r));

      await sleep(0);
      expect(res).toBeUndefined();

      await sleep(10);
      expect(res).toBe('times * 1');
    });
    test('unused', async () => {
      let res: any;
      const p = req
        .useRetry({ times: 1, immediate: false, interval: 50 })
        .request({ url: '/user', data: { use: 2 } });
      p.catch((r) => (res = r));

      await sleep(20);
      expect(res).toBeUndefined();

      await sleep(50);
      expect(res).toBe('times * 1');
    });
  });
});
