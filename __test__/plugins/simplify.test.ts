import { routers, useMockAxios } from '../mock-server';

useMockAxios(routers);

import { Req, SimplifyPlugin } from '../../src';

describe('simplify', () => {
  const r = new Req();
  test('methodFactory', async () => {
    const req = r.use(SimplifyPlugin());
    const get = req.useMethod('get');
    const post = req.useMethod('post');
    expect.assertions(5);
    // console.log((axios.create({ url: 'test' }) as any)(1, 2, 3), Req);
    const res = await get<{ username: string; id: number }>({ url: '/user' });
    expect(res).toEqual({
      data: { code: 200, data: { id: 1, username: 'get' }, msg: 'success' },
      status: 200,
    });

    const res2 = await post<{ username: string; id: number }>({ url: '/user' });
    expect(res2).toEqual({
      status: 200,
      data: { code: 200, data: { username: 'post', id: 2 }, msg: 'success' },
    });

    const res3 = await post({ url: '/login', data: { username: 'foo', password: 'bar' } });
    expect(res3).toEqual({ data: { code: 200, msg: 'success' }, status: 200 });

    try {
      await post({ url: '/login', data: { username: 'foo' } });
    } catch (e) {
      expect(e).toEqual({ code: 0, msg: '账号或密码错误' });
    }

    const res5 = await post({ url: '/user' });

    expect(res5).toEqual({
      data: { code: 200, data: { id: 2, username: 'post' }, msg: 'success' },
      status: 200,
    });
  });
  test('simplifyMethodFactory', async () => {
    const req = r.use(SimplifyPlugin());
    const get = req.simplifyUseMethod('get');
    const post = req.simplifyUseMethod('post');
    expect.assertions(5);
    // console.log((axios.create({ url: 'test' }) as any)(1, 2, 3), Req);
    const res = await get<{ username: string; id: number }>('/user');
    expect(res).toEqual({
      data: { code: 200, data: { id: 1, username: 'get' }, msg: 'success' },
      status: 200,
    });

    const res2 = await post<{ username: string; id: number }>('/user', {});
    expect(res2).toEqual({
      status: 200,
      data: { code: 200, data: { username: 'post', id: 2 }, msg: 'success' },
    });

    const res3 = await post('/login', { username: 'foo', password: 'bar' });
    expect(res3).toEqual({ data: { code: 200, msg: 'success' }, status: 200 });

    try {
      await post('/login', { username: 'foo' });
    } catch (e) {
      expect(e).toEqual({ code: 0, msg: '账号或密码错误' });
    }

    const res5 = await post('/user');

    expect(res5).toEqual({
      data: { code: 200, data: { id: 2, username: 'post' }, msg: 'success' },
      status: 200,
    });
  });
  describe('useConfig', () => {
    const req = r.use(SimplifyPlugin());
    test('empty', async () => {
      const request = req.useConfig({});
      const res = await request<any>({ url: '/config' });
      expect(res.data.data.url).toBe('/config');
      expect(res.data.data.method).toBe('get');
    });
    test('url', async () => {
      const post = req.useConfig({ url: '/config/', method: 'post' });
      const res = await post<any>({ url: 'test' });
      expect(res.data.data.url).toBe('/config/test');
      expect(res.data.data.method).toBe('post');
      const res2 = await post<any>({ url: 'test2' });
      expect(res2.data.data.url).toBe('/config/test2');
      expect(res2.data.data.method).toBe('post');
    });
    test('data', async () => {
      const post = req.useConfig({ url: '/config/', method: 'post', data: { a: 1 } });
      const res = await post<any>({ url: 'test' });
      expect(res.data.data.data).toEqual({ a: 1 });
      const res2 = await post<any>({ url: 'test', data: { b: 2 } });
      expect(res2.data.data.data).toEqual({ a: 1, b: 2 });
    });
  });
});
