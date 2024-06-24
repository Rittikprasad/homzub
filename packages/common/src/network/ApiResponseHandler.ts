import { Logger } from '@homzhub/common/src/utils/Logger';
import { ObjectUtils } from '@homzhub/common/src/utils/ObjectUtils';
import { ApiClientError, IApiClientError } from '@homzhub/common/src/network/ApiClientError';
import {
  TOKEN_NOT_VALID,
  HttpStatusCode,
  DEFAULT_ERROR_MESSAGE,
  NO_INTERNET_ERROR_MESSAGE,
  SESSION_EXPIRED_MESSAGE,
} from '@homzhub/common/src/network/Constants';
import { IApiError, IApiResponse, IApiResponseHandler } from '@homzhub/common/src/network/Interfaces';

export default class ApiResponseHandler implements IApiResponseHandler {
  public netInfoErrorMessage = (): string => {
    return NO_INTERNET_ERROR_MESSAGE;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public success = (response: IApiResponse): any => {
    const responseBody = response.data;
    if (!responseBody) {
      if (HttpStatusCode.NoContent !== response.status) {
        Logger.warn(`Empty response body. Response: ${response}`);
      }

      return {};
    }

    if (!responseBody.data) {
      Logger.warn(`Empty data. Data: ${responseBody.data}`);
      return {};
    }

    if (!this.isJsonResponse(response)) {
      Logger.warn(`Response is not a JSON. ${responseBody}`);
    }

    if (!this.isDataJson(responseBody.data)) {
      Logger.warn(`Data is not a JSON. ${responseBody.data}`);
    }

    return responseBody.data;
  };

  public error = (error: IApiError): ApiClientError => {
    Logger.warn(`API error. Content: ${JSON.stringify(error)}`);

    const errorCode = error.response?.data?.error?.error_code ?? '';
    let errorDetails: IApiClientError = {
      message: errorCode === TOKEN_NOT_VALID ? SESSION_EXPIRED_MESSAGE : DEFAULT_ERROR_MESSAGE,
    } as IApiClientError;

    const netInfoErrorMessage = this.netInfoErrorMessage();
    const errorResponse = error.response;
    if (!errorResponse) {
      Logger.warn(`No response in error. Error: ${JSON.stringify(error)}`);
      if (!navigator.onLine) {
        errorDetails.message = netInfoErrorMessage;
        errorDetails.statusCode = HttpStatusCode.ServiceUnavailable;
        return new ApiClientError(netInfoErrorMessage, errorDetails);
      }
      return new ApiClientError(DEFAULT_ERROR_MESSAGE, errorDetails);
    }

    if (!this.isJsonResponse(errorResponse)) {
      Logger.warn(`Response is not a JSON. Response content: ${JSON.stringify(errorResponse)}`);
    }

    errorDetails = {
      statusCode: errorResponse.status,
      message: errorDetails.message,
      description: errorResponse.data ? JSON.stringify(errorResponse.data) : '',
      errors: errorDetails.errors || [],
      original: errorResponse.data,
      url: `${errorResponse.config?.baseURL ?? ''}${errorResponse.config?.url ?? ''}`,
      method: errorResponse.config?.method ?? '',
    } as IApiClientError;
    return new ApiClientError(errorDetails.message, errorDetails);
  };

  private isJsonResponse = (response: IApiResponse): boolean => {
    const headers = response.headers || {};
    const responseBody = response.data || '';
    const contentType = headers['content-type'] || '';

    return contentType.indexOf('application/json') > -1 && this.isDataJson(responseBody);
  };

  private isDataJson = (data: any): boolean => {
    return ObjectUtils.isOfType('array', data) || ObjectUtils.isOfType('object', data);
  };
}
