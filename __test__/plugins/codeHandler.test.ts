import { routers, useMockAxios } from '../mock-server';

useMockAxios(routers);

import { Req, CodeHandlerPlugin } from '../../src';

describe('CodeHandler', () => {
  const r = new Req();
  test('not use CodeHandlerPlugin', async () => {
    const res = await r.request<{ username: string; id: number }>({ url: '/user' });
    expect(res).toEqual({
      data: { code: 200, data: { id: 1, username: 'get' }, msg: 'success' },
      status: 200,
    });
  });
  test('use CodeHandlerPlugin true', async () => {
    const req = r.use(CodeHandlerPlugin());
    const res = await req.request<{ username: string; id: number }>({ url: '/user' });
    expect(res).toEqual({
      data: { code: 200, data: { id: 1, username: 'get' }, msg: 'success' },
      status: 200,
    });
  });
  test('use CodeHandlerPlugin false', async () => {
    const req = r.use(CodeHandlerPlugin(false));
    const res = await req.request<{ username: string; id: number }>({ url: '/user' });
    expect(res).toEqual({ code: 200, data: { id: 1, username: 'get' }, msg: 'success' });
  });
  test('use CodeHandlerPlugin false setReturnRes', async () => {
    const req = r.use(CodeHandlerPlugin(false));
    // const res = await req.request<{ username: string; id: number }>({ url: '/user' });
    // expect(res).toEqual({ code: 200, data: { id: 1, username: 'get' }, msg: 'success' });

    const res2 = await req
      .setReturnRes(true)
      .request<{ username: string; id: number }>({ url: '/user' });
    expect(res2).toEqual({
      data: { code: 200, data: { id: 1, username: 'get' }, msg: 'success' },
      status: 200,
    });
  });
});
