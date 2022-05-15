import { LifecycleFn } from '../../types';
import axios, { Canceler } from 'axios';

export function CancelPlugin() {
  let cancelers: Canceler[] = [];
  let cancelCurrent: void | Canceler;
  return {
    extends: {
      cancelCurrent(msg?: string) {
        cancelCurrent?.(msg);
      },
      cancelAll(msg?: string) {
        cancelers.forEach((c) => c(msg));
        cancelers = [];
      },
    },
    lifecycle: function () {
      let clear: Canceler;
      return {
        beforeRequest(config) {
          const { cancel, token } = axios.CancelToken.source();
          config.cancelToken = token;
          cancelers.push(cancel);
          clear = () => {
            const index = cancelers.findIndex((c) => c === cancel);
            cancelers.splice(index, 1);
          };
          cancelCurrent = (msg) => {
            clear();
            cancel(msg);
          };
        },
        afterRequest() {
          clear();
        },
      };
    } as LifecycleFn,
  };
}
