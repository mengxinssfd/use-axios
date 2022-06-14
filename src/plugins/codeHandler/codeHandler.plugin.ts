import { Hooks } from '../../types';
import { Req } from '../../Req';
import { AxiosRequestConfig } from 'axios';

export function CodeHandlerPlugin(returnRes = true, codeHandlers = {}) {
  return {
    extends: {
      returnRes,
      codeHandlers,
      setReturnRes(value): Req {
        const _this = Object.create(this);
        _this.returnRes = value;
        return _this;
      },
      request<T>(this: Req, config: AxiosRequestConfig): Promise<T> {
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
