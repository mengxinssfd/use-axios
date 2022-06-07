import { routers, useMockAxios } from '../mock-server';

useMockAxios(routers);

import { Req, CachePlugin, PrivateKeys } from '../../src';

describe('cache', () => {
  const r = new Req();
  test('empty global', async () => {
    const req = r.use(CachePlugin());
    const mock = jest.fn();
    (<any>req)[PrivateKeys.cache].set = mock;
    let mockCallTimes = 0;

    await req.useCache({ timeout: 20000 }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 20000 });
    ++mockCallTimes;

    await req.useCache({ timeout: 20000 }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 20000 });
    ++mockCallTimes;

    await req.useCache().request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 5000 });
    ++mockCallTimes;

    await req.useCache({ enable: true }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 5000 });
    ++mockCallTimes;
    expect(mock.mock.calls.length).toBe(mockCallTimes);

    await req.request({ url: '/user' });
    expect(mock.mock.calls.length).toBe(mockCallTimes);

    await req.noCache().request({ url: '/user' });
    expect(mock.mock.calls.length).toBe(mockCallTimes);

    await req.useCache({ enable: true }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 5000 });
    ++mockCallTimes;
    expect(mock.mock.calls.length).toBe(mockCallTimes);
  });
  test('global false', async () => {
    const req = r.use(CachePlugin(false));
    const mock = jest.fn();
    (<any>req)[PrivateKeys.cache].set = mock;
    let mockCallTimes = 0;

    await req.useCache({ timeout: 20000 }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 20000 });
    ++mockCallTimes;

    await req.useCache({ timeout: 20000 }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 20000 });
    ++mockCallTimes;

    await req.useCache().request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 5000 });
    ++mockCallTimes;

    await req.useCache({ enable: true }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 5000 });
    ++mockCallTimes;
    expect(mock.mock.calls.length).toBe(mockCallTimes);

    await req.request({ url: '/user' });
    expect(mock.mock.calls.length).toBe(mockCallTimes);

    await req.useCache(false).request({ url: '/user' });
    expect(mock.mock.calls.length).toBe(mockCallTimes);
  });
  test('global true', async () => {
    const req = r.use(CachePlugin(true));
    const mock = jest.fn();
    (<any>req)[PrivateKeys.cache].set = mock;
    let mockCallTimes = 0;

    await req.useCache({ timeout: 20000 }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 20000 });
    ++mockCallTimes;

    await req.useCache({ timeout: 20000 }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 20000 });
    ++mockCallTimes;

    await req.useCache(true).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 5000 });
    ++mockCallTimes;

    await req.useCache({ enable: true }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 5000 });
    ++mockCallTimes;
    expect(mock.mock.calls.length).toBe(mockCallTimes);

    await req.request({ url: '/user' });
    ++mockCallTimes;
    expect(mock.mock.calls.length).toBe(mockCallTimes);

    await req.useCache(false).request({ url: '/user' });
    expect(mock.mock.calls.length).toBe(mockCallTimes);
  });
  test('global object true', async () => {
    const req = r.use(CachePlugin({ enable: true }));
    const mock = jest.fn();
    (<any>req)[PrivateKeys.cache].set = mock;
    let mockCallTimes = 0;

    await req.useCache({ timeout: 20000 }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 20000 });
    ++mockCallTimes;

    await req.useCache({ timeout: 20000 }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 20000 });
    ++mockCallTimes;

    await req.request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 5000 });
    ++mockCallTimes;

    await req.useCache({ enable: true }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 5000 });
    ++mockCallTimes;
    expect(mock.mock.calls.length).toBe(mockCallTimes);

    await req.request({ url: '/user' });
    ++mockCallTimes;
    expect(mock.mock.calls.length).toBe(mockCallTimes);

    await req.useCache(false).request({ url: '/user' });
    expect(mock.mock.calls.length).toBe(mockCallTimes);
  });
  test('mixin', async () => {
    const req = r.use(CachePlugin({ enable: true, timeout: 20 }));
    const mock = jest.fn();
    (<any>req)[PrivateKeys.cache].set = mock;
    let mockCallTimes = 0;

    await req.useCache({ timeout: 20000 }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 20000 });
    ++mockCallTimes;

    await req.useCache({ timeout: 20000 }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 20000 });
    ++mockCallTimes;

    await req.useCache().request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 20 });
    ++mockCallTimes;

    await req.useCache(true).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 20 });
    ++mockCallTimes;
    expect(mock.mock.calls.length).toBe(mockCallTimes);

    await req.request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true, timeout: 20 });
    ++mockCallTimes;

    await req.noCache().request({ url: '/user' });
    expect(mock.mock.calls.length).toBe(mockCallTimes);
  });
  test('real', async () => {
    const req = r.use(CachePlugin({ enable: true, timeout: 20 }));

    const arr = [
      req.useCache({ timeout: 20000 }).request({ url: '/user' }),
      req.useCache({ timeout: 20000 }).request({ url: '/user' }),
      req.useCache().request({ url: '/user' }),
      req.useCache(true).request({ url: '/user' }),
      req.request({ url: '/user' }),
      // req.noCache().request({ url: '/user' }),
    ];

    const res = await Promise.all(arr);

    const first = res[0];
    res.forEach((item) => {
      expect(item).toBe(first);
    });
  });
});
