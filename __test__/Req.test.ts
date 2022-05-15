import { Req } from '../src/Req';

describe('Req', () => {
  const req = new Req();
  test('base', () => {
    req.request({ url: '' });
  });
});
