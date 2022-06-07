import { Hooks } from '../../types';
import { Req } from '../../Req';
import { AxiosRequestConfig } from 'axios';

export function CodeHandlerPlugin() {
  const codeHandlerPluginConfig = { returnRes: false };
  return {
    extends: {
      codeHandlerPluginConfig,
      request<T>(this: Req, config: AxiosRequestConfig): Promise<T> {
        const _super = (this as any).__proto__;
        return _super.request(config);
      },
    },
    hooks: {
      afterRequest(res) {
        return res.data;
      },
    } as Hooks,
  };
}
