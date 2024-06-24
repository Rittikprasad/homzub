/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiClientError } from '@homzhub/common/src/network/ApiClientError';

export interface IApiClientOptions {
  apiName: string;
}

export interface IApiClient {
  request(config: AxiosRequestConfig): Promise<any>;

  get(url: string, params?: {}, options?: IApiClientOptions): Promise<any>;

  post(url: string, data?: {}, params?: {}, options?: IApiClientOptions): Promise<any>;

  put(url: string, data?: {}, params?: {}, options?: IApiClientOptions): Promise<any>;

  patch(url: string, data?: {}, params?: {}, options?: IApiClientOptions): Promise<any>;

  delete(url: string, params?: {}, options?: IApiClientOptions): Promise<any>;

  getBaseUrl(): string;

  getRequestTimeout?(): number;

  getInterceptor(): IApiInterceptor | undefined;
}

export interface IApiResponseHandler {
  success?(response: IApiResponse): any;

  error?(error: IApiError | ApiClientError): any;
}

export interface IApiInterceptor {
  request(apiClient: IApiClient): IApiRequestInterceptor;
  response(apiClient: IApiClient): IApiResponseInterceptor;
}

export interface IApiRequestInterceptor {
  onFulfilled: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  onRejected: (error: AxiosError) => any;
}

export interface IApiResponseInterceptor {
  onFulfilled: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onRejected: (error: AxiosError) => any;
}

export interface IApiClientConfig {
  baseUrl: string;
  requestTimeout?: number;
  interceptor?: IApiInterceptor;
  responseHandler?: IApiResponseHandler;
  useDefaultHandler?: boolean;
}

export interface IApiResponse<T = any> extends AxiosResponse<T> {
  config: IApiRequestConfig;
}

export interface IApiError<T = any> {
  config: IApiRequestConfig;
  response?: IApiResponse<T>;
}

export interface IApiRequestConfig extends AxiosRequestConfig {
  options?: IApiClientOptions;
}
