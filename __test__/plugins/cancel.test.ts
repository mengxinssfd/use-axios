import { routers, useMockAxios } from '../mock-server';

useMockAxios(routers);

import { Req } from '../../src/Req';
import { CancelPlugin } from '../../src/plugins/cancel/cancel.plugin';

describe('Req', () => {
  const r = new Req();
  test('cancel all', async () => {
    const req = r.use(CancelPlugin());
    const reqList = [
      req.request({ url: '/user' }),
      req.request({ url: '/user' }),
      req.request({ url: '/user' }),
    ];
    req.cancelAll('test');

    const res = await Promise.allSettled(reqList);

    expect(res).toEqual([
      { status: 'rejected', reason: 'test' },
      { status: 'rejected', reason: 'test' },
      { status: 'rejected', reason: 'test' },
    ]);
  });
  test('cancel current', async () => {
    const req = r.use(CancelPlugin());
    const res1 = req.request({ url: '/user' });
    req.cancelCurrent?.('cancel1');
    const res2 = req.request({ url: '/user' });
    req.cancelCurrent?.('cancel2');
    const res3 = req.request({ url: '/user' });
    req.cancelCurrent?.('cancel3');

    const res = await Promise.allSettled([res1, res2, res3]);

    expect(res).toEqual([
      { status: 'rejected', reason: 'cancel1' },
      { status: 'rejected', reason: 'cancel2' },
      { status: 'rejected', reason: 'cancel3' },
    ]);
  });
});
