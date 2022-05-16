import { Req } from '../../Req';
import { AxiosRequestConfig, Method } from 'axios';

export function SimplifyPlugin() {
  return {
    extends: {
      methodFactory(this: Req, method: Method) {
        return <T>(config: Omit<AxiosRequestConfig, 'method'>) =>
          this.request<T>({ ...config, method });
      },
      useConfig(this: Req, requestConfig: AxiosRequestConfig) {
        return <T>(config: AxiosRequestConfig) => {
          const cfg = { ...requestConfig, ...config };
          return this.request<T>(cfg);
        };
      },
      simplifyMethodFactory(this: Req, method: Method, urlPrefix = '') {
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
