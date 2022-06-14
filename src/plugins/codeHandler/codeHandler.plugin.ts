import { Hooks } from '../../types';
import { Req } from '../../Req';
import { AxiosRequestConfig } from 'axios';

export function CodeHandlerPlugin(returnRes = true) {
  return {
    extends: {
      returnRes,
      setReturnRes(value): Req {
        // 锁住this
        // this.request = this.request.bind(this);
        const _this = Object.create(this);
        _this.returnRes = value;
        return _this;
      },
      request<T>(this: Req, config: AxiosRequestConfig): Promise<T> {
        let root = this as any;

        while (!Object.prototype.hasOwnProperty.call(root, 'use')) root = root.__proto__;

        return root.request.call(this, config);
      },
    },
    hooks: {
      afterRequest(res) {
        return this.returnRes ? res : res.data;
      },
    } as Hooks,
  };
}
