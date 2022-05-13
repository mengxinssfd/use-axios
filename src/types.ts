import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface Lifecycle {
  beforeRequest?: (config: AxiosRequestConfig) => void;
  onRequest?: () => void;
  afterRequest?: (res: AxiosResponse) => void;
}
export interface PluginResult {
  extends?: any;
  lifecycle?: Lifecycle;
}
