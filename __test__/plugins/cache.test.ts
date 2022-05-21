import { routers, useMockAxios } from '../mock-server';

useMockAxios(routers);

import { Req } from '../../src/Req';
import { CachePlugin, PrivateKeys } from '../../src/plugins/cache/cache.plugin';

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
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true });
    ++mockCallTimes;

    await req.useCache({ enable: true }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true });
    ++mockCallTimes;
    expect(mock.mock.calls.length).toBe(mockCallTimes);

    await req.request({ url: '/user' });
    expect(mock.mock.calls.length).toBe(mockCallTimes);

    await req.noCache().request({ url: '/user' });
    expect(mock.mock.calls.length).toBe(mockCallTimes);

    await req.useCache({ enable: true }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true });
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
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true });
    ++mockCallTimes;

    await req.useCache({ enable: true }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true });
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
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true });
    ++mockCallTimes;

    await req.useCache({ enable: true }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true });
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
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true });
    ++mockCallTimes;

    await req.useCache({ enable: true }).request({ url: '/user' });
    expect(mock.mock.calls[mockCallTimes][2]).toEqual({ enable: true });
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
});
