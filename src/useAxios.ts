import axios, { AxiosRequestConfig } from 'axios';
import type { Lifecycle, UseAxios } from './types';

export function useAxios(config?: AxiosRequestConfig): UseAxios {
  const axiosIns = axios.create(config);
  const plugins: Lifecycle[] = [];

  const res: UseAxios = {
    use(plugin) {
      plugin.lifecycle && plugins.push(plugin.lifecycle);
      Object.assign(res, plugin.extends?.(res));
      return res as any;
    },
    async request(config) {
      plugins.forEach((p) => {
        p.beforeRequest?.(config);
      });
      const res = await axiosIns(config);
      plugins.forEach((p) => {
        p.afterRequest?.(res);
      });
      return res;
    },
  };
  return res;
}
