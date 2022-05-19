import { routers, useMockAxios } from './mock-server';

useMockAxios(routers);

import { Req } from '../src/Req';
import { Hooks } from '../src/types';

describe('Req', () => {
  const req = new Req();
  test('use 1', () => {
    const r = req.use({
      extends: {
        test(s: string) {
          return s;
        },
      },
    });

    expect(r.test('hello')).toBe('hello');
    expect(typeof r.use).toBe('function');
    expect(typeof r.request).toBe('function');

    expect(Object.keys(r)).toEqual(['test']);
  });
  test('use 2', () => {
    const r = req
      .use({
        extends: {
          test(s: string) {
            return s;
          },
        },
      })
      .use({
        extends: {
          test2(s: string) {
            return s;
          },
        },
      });

    expect(r.test2('hello')).toBe('hello');
    expect(typeof r.use).toBe('function');
    expect(typeof r.request).toBe('function');
    expect(Object.keys(r)).toEqual(['test2']);
  });
  test('hooks calls', async () => {
    expect.assertions(5);
    const hooks: Hooks = {
      config: jest.fn(),
      beforeRequest: jest.fn(),
      onRequest: jest.fn(),
      afterRequest: jest.fn(),
      onRequestError: jest.fn(),
    };
    const r = req.use({ hooks });

    await r.request();

    for (const [, v] of Object.entries(hooks)) {
      expect(v.mock.calls.length).toBe(1);
    }
  });
  test('hooks call', async () => {
    const r = req
      .use({
        hooks: {
          config(config) {
            config.data = { p: 1 };
          },
        },
      })
      .use({
        hooks: {
          config(config) {
            config.params = { p: 1 };
          },
        },
      });

    const res = await r.request({ url: '/config' });
    expect(res).toEqual({
      data: {
        code: 1000,
        data: {
          data: {
            p: 1,
          },
          params: {
            p: 1,
          },
          url: '/config',
        },
        msg: 'success',
      },
      status: 200,
    });
  });
});
