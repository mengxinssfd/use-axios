import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Lifecycle, PluginResult } from './types';

type Use<T = {}> = <P extends PluginResult>(
  plugin: P,
) => T & P['extends'] & { use: Use<T & P['extends']> };

type Request = (config: AxiosRequestConfig<any>) => Promise<AxiosResponse<any>>;

export function useAxios(config?: AxiosRequestConfig) {
  const axiosIns = axios.create(config);
  const plugins: Lifecycle[] = [];

  const res: {
    use: Use<{ request: Request }>;
    request: Request;
  } = {
    use<P extends PluginResult>(plugin: P) {
      plugin.lifecycle && plugins.push(plugin.lifecycle);
      return { ...res, ...plugin.extends };
    },
    async request(config: AxiosRequestConfig<any>): Promise<AxiosResponse<any>> {
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
const u = useAxios()
  .use({
    extends: {
      // TODO 怎么返回整个对象呢
      setCache() {
        console.log(111);
      },
    },
  })
  .use({
    extends: {
      test2() {
        console.log(111);
      },
    },
  });
u.setCache();
