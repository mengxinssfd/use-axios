import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Hooks, HookFn } from './types';

export class Req {
  protected readonly fetch: AxiosInstance;
  private readonly hooks: Array<Hooks | HookFn> = [];
  constructor(config?: AxiosRequestConfig) {
    this.fetch = axios.create(config);
  }
  use<
    T extends { extends?: {}; hooks?: Hooks | HookFn },
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
    plugin.hook && _this.hooks.push(plugin.hook);
    return _this;
  }
  async request<T>(config: AxiosRequestConfig = {}): Promise<T> {
    config = { ...config };
    const hooks = this.hooks.map((lc) => (typeof lc === 'function' ? lc.call(this, config) : lc));
    try {
      for (const hook of hooks) {
        hook.config?.call(this, config);
      }

      // 流
      let fetchFn = () => this.fetch(config);
      for (const { onRequest } of hooks) {
        fetchFn = onRequest?.call(this, config, fetchFn) || fetchFn;
      }

      let res = await fetchFn();
      hooks.forEach(({ afterRequest }) => {
        res = afterRequest?.(res) ?? res;
      });
      return res as any;
    } catch (e: any) {
      try {
        let res = e;
        for (const { onRequestError } of hooks) {
          res = (await onRequestError?.call(this, res)) ?? res;
        }
        hooks.forEach(({ afterRequest }) => {
          res = afterRequest?.(res) || res;
        });
        return res;
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
}
