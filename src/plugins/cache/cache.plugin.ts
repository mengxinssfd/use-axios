import { Req } from '../../Req';
import { Cache } from './Cache';
import { Hooks } from '../../types';
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

export interface CacheConfig {
  enable?: boolean;
  timeout?: number;
  // 是否缓存失败的请求 false时清理
  failedReq?: boolean;
}

export const CachePlugin = (config: CacheConfig = {}) => {
  const cache = new Cache<AxiosPromise>();

  const generateCacheKey = (config: AxiosRequestConfig): string => {
    const { url, headers, method, params, data } = config;
    return JSON.stringify({ url, data, headers, method, params });
  };

  return {
    cacheConfig: config,
    extends: {
      cache,
      useCache(this: Req, config: CacheConfig): Req {
        const _this = Object.create(this);
        _this.cacheConfig = { ..._this.cacheConfig, ...config };
        return _this;
      },
      noCache(this: Req): Req {
        const _this = Object.create(this);
        _this.cacheConfig.enable = false;
        return _this;
      },
    },
    hooks: {
      onRequest(config, fetch) {
        const cacheConfig = (this.cacheConfig || {}) as CacheConfig;
        if (!cacheConfig.enable) return;
        const key = generateCacheKey(config);
        const cc = cache.get(key);
        if (cc) {
          return () => cc;
        }
        const promise = fetch();
        // 存储缓存
        cache.set(key, promise, cacheConfig);
        // 如果该请求是被取消的话，就清理掉该缓存
        promise.catch((reason) => {
          if (!cacheConfig.failedReq || axios.isCancel(reason)) {
            cache.delete(key);
          }
        });
        return () => promise;
      },
    } as Hooks,
  };
};
