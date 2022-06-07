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

function mergeCacheConfig(cache: CacheConfig | boolean, base: CacheConfig = {}) {
  switch (typeof cache) {
    case 'boolean':
      base.enable = cache;
      break;
    case 'object':
      base = { ...base, ...cache };
      if (cache.enable === undefined) {
        base.enable = true;
      }
      break;
  }
  return base;
}

export const PrivateKeys = {
  cache: Symbol('cache'),
  cacheConfig: Symbol('config'),
};
export const CachePlugin = (config: CacheConfig | boolean = false) => {
  const cache = new Cache<AxiosPromise>();

  const generateCacheKey = (config: AxiosRequestConfig): string => {
    const { url, headers, method, params, data } = config;
    return JSON.stringify({ url, data, headers, method, params });
  };

  return {
    extends: {
      [PrivateKeys.cache]: cache,
      [PrivateKeys.cacheConfig]: mergeCacheConfig(config),
      useCache: function (this: Req, config: CacheConfig | boolean = true): Req {
        const _this = Object.create(this);
        _this[PrivateKeys.cacheConfig] = mergeCacheConfig(config, {
          ..._this[PrivateKeys.cacheConfig],
        });
        return _this;
      },
      noCache(this: Req): Req {
        const _this = Object.create(this);
        const c = { ..._this[PrivateKeys.cacheConfig] };
        c.enable = false;
        _this[PrivateKeys.cacheConfig] = c;
        return _this;
      },
    },
    hooks: {
      onRequest(config, fetch) {
        const cacheConfig = (this[PrivateKeys.cacheConfig] || {}) as CacheConfig;
        if (!cacheConfig.enable) return;
        const key = generateCacheKey(config);
        const cc = cache.get(key);
        if (cc) {
          return () => cc;
        }
        const promise = fetch();
        // 存储缓存
        cache.set(key, promise, { timeout: 5000, ...cacheConfig });
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
