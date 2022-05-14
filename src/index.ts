import { useAxios } from './useAxios';
import { CachePlugin } from './plugins/cache.plugin';

useAxios()
  .use(CachePlugin({ enable: true }))
  .request({});
