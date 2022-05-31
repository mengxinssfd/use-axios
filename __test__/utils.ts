import { AxiosRequestConfig, AxiosResponse } from 'axios';

export async function sleep(delay: number) {
  return new Promise<void>((res) => {
    setTimeout(() => res(), delay);
  });
}
export function mockAxiosResponse(
  requestConfig: AxiosRequestConfig,
  data: any,
  status = 200,
): Partial<AxiosResponse> {
  return {
    config: requestConfig,
    data,
    status,
  };
}
/*export function mockAxiosError(
  requestConfig: AxiosRequestConfig,
  data: any,
): { response: Partial<AxiosResponse> } & Partial<Omit<AxiosError, 'response'>> {
  return {
    config: requestConfig,
    response: mockAxiosResponse(requestConfig, data, 500),
    isAxiosError: true,
  };
}*/
