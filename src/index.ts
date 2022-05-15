import { Req } from './Req';
import { CachePlugin } from './plugins/cache/cache.plugin';
import { CancelPlugin } from './plugins/cancel/cancel.plugin';
import { RetryPlugin } from './plugins/retry/retry.plugin';

const req = new Req({ baseURL: '' }).use(CachePlugin()).use(CancelPlugin()).use(RetryPlugin());
req.useRetry({ times: 4 }).useCache({ enable: true }).request({});
req.cancelCurrent();
