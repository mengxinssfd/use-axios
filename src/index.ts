import { Req } from './Req';
import { CachePlugin } from './plugins/cache/cache.plugin';
import { CancelPlugin } from './plugins/cancel/cancel.plugin';
import { RetryPlugin } from './plugins/retry/retry.plugin';
import { SimplifyPlugin } from './plugins/simplify/simplify.plugin';

const req = new Req({ baseURL: '' })
  .use(SimplifyPlugin())
  .use(CachePlugin())
  .use(CancelPlugin())
  .use(RetryPlugin());
const post = req.useRetry({ times: 4 }).useCache({ enable: true }).simplifyMethodFactory('post');
post<number>('10').then((res) => {
  console.log(res);
});
req.cancelCurrent();
