import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Lifecycle, LifecycleFn } from './types';

export class Req {
  private readonly fetch: AxiosInstance;
  private readonly lifecycles: Array<Lifecycle | LifecycleFn> = [];
  constructor(config?: AxiosRequestConfig) {
    this.fetch = axios.create(config);
  }
  use<
    T extends { extends?: {}; lifecycle?: Lifecycle | LifecycleFn },
    ET extends T['extends'],
    M extends this & ET,
    R extends {
      [K in keyof ET]: ET[K] extends (...args: infer R) => infer RT
        ? (...args: R) => RT extends Req ? Omit<M, K | 'use'> : RT
        : ET[K];
    },
  >(plugin: T): R & this;
  use(plugin) {
    const _this = Object.create(this);
    Object.assign(_this, plugin.extends);
    plugin.lifecycle && _this.lifecycles.push(plugin.lifecycle);
    return _this;
  }
  async request(config: AxiosRequestConfig = {}) {
    const lifecycles = this.lifecycles.map((lc) =>
      typeof lc === 'function' ? lc.call(this, config) : lc,
    );
    try {
      for (const { beforeRequest } of lifecycles) {
        beforeRequest?.call(this, config);
      }

      let fetchFn = () => this.fetch(config);
      for (const { onRequest } of lifecycles) {
        fetchFn = onRequest?.call(this, config, fetchFn) || fetchFn;
      }

      const res = await fetchFn();

      lifecycles.forEach(({ afterRequest }) => {
        afterRequest?.(res);
      });
      return res;
    } catch (e: any) {
      lifecycles.forEach(({ onRequestError }) => {
        onRequestError?.call(this, e);
      });
      return Promise.reject(e);
    }
  }
}
