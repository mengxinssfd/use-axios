import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
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
    plugin.hooks && this.hooks.push(plugin.hooks);
    const _this = Object.create(this);
    Object.assign(_this, plugin.extends);
    return _this;
  }
  async request<T>(config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    config = { ...config };
    const hooks = this.hooks.map((lc) => (typeof lc === 'function' ? lc.call(this, config) : lc));
    try {
      // hook: config
      for (const hook of hooks) {
        hook.config?.call(this, config);
      }

      // hook: beforeRequest
      for (const hook of hooks) {
        hook.beforeRequest?.call(this, config);
      }

      // 流
      let fetchFn = () => this.fetch(config);
      // hook: onRequest
      for (const { onRequest } of hooks) {
        fetchFn = onRequest?.call(this, config, fetchFn) || fetchFn;
      }

      const response = await fetchFn();
      let res = response;
      // hook: afterRequest
      hooks.forEach(({ afterRequest }) => {
        res = afterRequest?.call(this, response, res) ?? res;
      });
      return res as any;
    } catch (e: any) {
      let res = Promise.reject(e);
      // hook: onRequestError
      for (const { onRequestError } of hooks) {
        res = (await onRequestError?.call(this, res)) ?? res;
      }
      // hook: afterRequest
      hooks.forEach(({ afterRequest }) => {
        res = afterRequest?.call(this, e, res as any) || res;
      });
      return res;
    }
  }
}
