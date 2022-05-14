import { Plugin } from '../types';

export interface CacheParams {
  enable?: boolean;
  timeout?: number;
  // 是否缓存失败的请求 false时清理
  failedReq?: boolean;
}

export const CachePlugin = (config: CacheParams): Plugin => {
  const finalConfig = { ...config };
  const cache = new Cache();
  return {
    extends(ctx) {
      return {
        useCache(config: CacheParams) {
          console.log(Object.assign(finalConfig, config));
          return ctx;
        },
      };
    },
    lifecycle: {
      beforeRequest() {
        console.log(finalConfig);
      },
    },
  };
};
