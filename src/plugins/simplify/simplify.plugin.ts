import { Req } from '../../Req';
import { AxiosRequestConfig, Method } from 'axios';

/**
 * 合并两层对象, 也就是说如果对象属性还是对象的话就再次合并，只会合并两层，不需要递归合并所有
 * @template {{}} A
 * @template {{}} B
 * @param {A} a
 * @param {B} b
 * @return {A & B}
 */
export function mergeObj<A extends object, B extends Object>(a: A, b: B): A & B {
  const result = { ...a, ...b };
  for (const k in result) {
    const v = result[k];
    if (Array.isArray(v) && a[k] !== undefined) {
      result[k] = a[k].concat(b[k]);
    } else if (typeof v === 'object') {
      result[k] = { ...a[k], ...b[k] };
    }
  }
  return result;
}

export function SimplifyPlugin() {
  return {
    extends: {
      useMethod(this: Req, method: Method) {
        return <T>(config: Omit<AxiosRequestConfig, 'method'>) =>
          this.request<T>({ ...config, method });
      },
      useConfig(this: Req, requestConfig: AxiosRequestConfig) {
        return <T>(config: AxiosRequestConfig) => {
          const cfg = mergeObj(requestConfig, config);
          cfg.url = `${requestConfig.url || ''}${config.url}`;
          cfg.method = cfg.method || 'get';
          return this.request<T>(cfg);
        };
      },
      simplifyUseMethod(this: Req, method: Method, urlPrefix = '') {
        return <T>(url: string, data: {} = {}) => {
          const requestConfig: AxiosRequestConfig = { method };
          if (method === 'get') {
            requestConfig.params = data;
          } else {
            requestConfig.data = data;
          }
          requestConfig.url = urlPrefix + url;
          return this.request<T>(requestConfig);
        };
      },
    },
  };
}
