import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Lifecycle, LifecycleFn } from './types';

export class Req {
  protected readonly fetch: AxiosInstance;
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
  async request<T>(config: AxiosRequestConfig = {}): Promise<T> {
    config = { ...config };
    const lifecycles = this.lifecycles.map((lc) =>
      typeof lc === 'function' ? lc.call(this, config) : lc,
    );
    try {
      for (const { beforeRequest } of lifecycles) {
        beforeRequest?.call(this, config);
      }

      // 流
      let fetchFn = () => this.fetch(config);
      for (const { onRequest } of lifecycles) {
        fetchFn = onRequest?.call(this, config, fetchFn) || fetchFn;
      }

      let res = await fetchFn();
      lifecycles.forEach(({ afterRequest }) => {
        res = afterRequest?.(res) ?? res;
      });
      return res as any;
    } catch (e: any) {
      try {
        let res = e;
        for (const { onRequestError } of lifecycles) {
          res = (await onRequestError?.call(this, res)) ?? res;
        }
        lifecycles.forEach(({ afterRequest }) => {
          res = afterRequest?.(res) || res;
        });
        return res;
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
}
