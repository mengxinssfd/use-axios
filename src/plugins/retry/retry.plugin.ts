import { HookFn } from '../../types';
import { Req } from '../../Req';
import axios, { AxiosResponse } from 'axios';

export interface RetryConfig {
  times?: number;
  interval?: number;
  immediate?: boolean;
}

export function RetryPlugin(retryConfig: RetryConfig = {}) {
  return {
    retryConfig: retryConfig,
    extends: {
      useRetry(this: Req, cfg: RetryConfig = {}): Req {
        const _this = Object.create(this);
        _this.retryConfig = { ...retryConfig, ...cfg };
        return _this;
      },
    },
    hooks: function (config) {
      return {
        async onRequestError(this: Req, e) {
          if (axios.isCancel(e)) return;
          const maxTimex = retryConfig.times as number;
          let times = 0;
          let timer: NodeJS.Timer;
          let reject = (): any => undefined;
          const stop = () => {
            clearTimeout(timer);
            reject();
          };
          return new Promise((res, rej) => {
            // retry期间取消，则返回上一次的结果
            reject = () => rej(e);
            const startRetry = (timeout?: number) => {
              if (times >= maxTimex) {
                stop();
                return;
              }
              // 立即执行时，间隔为undefined；否则为interval
              timer = setTimeout(retry, timeout);
            };
            const retry = () => {
              times++;
              this.fetch({ ...config }).then(
                (data) => res(data as AxiosResponse),
                (error) => {
                  e = error;
                  startRetry(retryConfig.interval);
                },
              );
            };
            startRetry(retryConfig.immediate ? undefined : retryConfig.interval);
          });
        },
      };
    } as HookFn,
  };
}
