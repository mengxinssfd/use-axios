import { Hooks } from '../../types';
import { Req } from '../../Req';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export function CodeHandlerPlugin(returnRes = true, codeHandlers = {}) {
  return {
    extends: {
      returnRes,
      codeHandlers,
      // fixme extends的函数如果有泛型会丢失泛型，返回值的泛型不会丢失
      setReturnRes(value): {
        request<T = never, R extends boolean = true>(
          config: AxiosRequestConfig,
        ): Promise<R extends true ? AxiosResponse<T> : T>;
      } {
        const _this = Object.create(this);
        _this.returnRes = value;
        return _this;
      },
      request(this: Req, config: AxiosRequestConfig) {
        let _super = this as any;

        while (_super.setReturnRes) _super = _super.__proto__;

        return _super.request.call(this, config);
      },
    },
    hooks: {
      afterRequest(res) {
        return this.returnRes ? res : res.data;
      },
    } as Hooks,
  };
}
