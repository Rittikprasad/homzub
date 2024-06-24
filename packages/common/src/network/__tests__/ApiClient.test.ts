import mockAxios from 'axios';
import ApiResponseHandler from '@homzhub/common/src/network/ApiResponseHandler';
import { ApiClient } from '@homzhub/common/src/network/ApiClient';
import { DEFAULT_API_TIMEOUT, HttpMethod } from '@homzhub/common/src/network/Constants';
import { MockApiInterceptor } from '@homzhub/common/src/network/__mocks__/ApiInterceptor';
import { MockResponseHandler } from '@homzhub/common/src/network/__mocks__/ApiResponseHandler';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

// As ApiResponseHandler is used by ApiClient, we want to mock it
const mockSuccessHandler = jest.fn();
const mockErrorHandler = jest.fn();
jest.mock('../ApiResponseHandler', () => {
  return jest.fn().mockImplementation(() => {
    return {
      success: mockSuccessHandler,
      error: mockErrorHandler,
    };
  });
});

describe('ApiClient', () => {
  const baseUrl = 'http://example.com';

  describe('Configuration', () => {
    it('should take a base url for the server', () => {
      const apiClient = new ApiClient({ baseUrl });

      const actualBaseUrl = apiClient.getBaseUrl();

      expect(actualBaseUrl).toStrictEqual(baseUrl);
    });

    it('should throw an error if the baseUrl is invalid', () => {
      const invalidUrls = [null, '', '123', 'http:://example.com', 'htt:///example.com'];
      expect.assertions(invalidUrls.length);

      invalidUrls.forEach((url) => {
        try {
          // @ts-ignore
          // eslint-disable-next-line no-new
          new ApiClient({ baseUrl: url });
        } catch (e) {
          expect(e).toBeInstanceOf(Error);
        }
      });
    });

    it('should take a request timeout value for all requests', () => {
      const requestTimeout = 3000;
      const apiClient = new ApiClient({ baseUrl, requestTimeout });

      const actualRequestTimeout = apiClient.getRequestTimeout();

      expect(actualRequestTimeout).toStrictEqual(requestTimeout);
    });

    it('should have a default request timeout, if not specified', () => {
      const apiClient = new ApiClient({ baseUrl });

      const actualRequestTimeout = apiClient.getRequestTimeout();

      expect(actualRequestTimeout).toBeDefined();
      expect(actualRequestTimeout).toStrictEqual(DEFAULT_API_TIMEOUT);
    });

    it('should take a interceptor for all requests', () => {
      const interceptor = new MockApiInterceptor();
      const apiClient = new ApiClient({ baseUrl, interceptor });

      const actualInterceptor = apiClient.getInterceptor();

      expect(actualInterceptor).toBe(interceptor);
    });
  });

  describe('Requests', () => {
    beforeEach(() => {
      // @ts-ignore
      mockAxios.request.mockImplementationOnce(() => {
        return Promise.resolve({});
      });
    });

    it('should be able to make a GET call', () => {
      const apiClient = new ApiClient({ baseUrl });
      const url = '/some-uri';
      const params = { id: 1 };

      apiClient.get(url, params);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockAxios.request).toBeCalledWith({
        method: HttpMethod.GET,
        url,
        params,
      });
    });

    it('should be able to make a POST call', () => {
      const apiClient = new ApiClient({ baseUrl });
      const url = '/some-uri';
      const data = {
        id: 1,
        name: 'nameless',
      };
      const params = { flag: true };

      apiClient.post(url, data, params);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockAxios.request).toBeCalledWith({
        method: HttpMethod.POST,
        url,
        data,
        params,
      });
    });

    it('should be able to make a PATCH call', () => {
      const apiClient = new ApiClient({ baseUrl });
      const url = '/some-uri';
      const data = {
        id: 1,
        name: 'nameless',
      };
      const params = { flag: true };

      apiClient.patch(url, data, params);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockAxios.request).toBeCalledWith({
        method: HttpMethod.PATCH,
        url,
        data,
        params,
      });
    });

    it('should be able to make a DELETE call', () => {
      const apiClient = new ApiClient({ baseUrl });
      const url = '/some-uri';
      const params = { flag: true };

      apiClient.delete(url, params);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockAxios.request).toBeCalledWith({
        method: HttpMethod.DELETE,
        url,
        params,
      });
    });

    it('should be able to make a request', () => {
      const apiClient = new ApiClient({ baseUrl });
      const requestPayload = {
        method: HttpMethod.GET,
        url: '/some-uri',
        params: { flag: true },
      };

      // @ts-ignore
      apiClient.request(requestPayload);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockAxios.request).toBeCalledWith(requestPayload);
    });
  });

  describe('Response handling - success', () => {
    beforeEach(() => {
      // @ts-ignore
      mockAxios.request.mockImplementationOnce(() => {
        return Promise.resolve({});
      });

      jest.clearAllMocks();
    });

    it('should use the default response handler for success', async () => {
      const interceptor = new MockApiInterceptor();
      const apiClient = new ApiClient({ baseUrl, interceptor });
      const handleSuccessSpy = jest.spyOn(apiClient, 'handleSuccess');
      const url = '/some-uri';
      const params = { id: 1 };

      await apiClient.get(url, params);

      expect(ApiResponseHandler).toHaveBeenCalledTimes(1);
      expect(handleSuccessSpy).toHaveBeenCalled();
      expect(ApiResponseHandler).toHaveBeenCalled();
    });

    it('should also call custom Response handler if used', async () => {
      const responseHandler = new MockResponseHandler();
      const apiClient = new ApiClient({ baseUrl, responseHandler });
      const handleSuccessSpy = jest.spyOn(apiClient, 'handleSuccess');
      const responseHandlerSpy = jest.spyOn(responseHandler, 'success');
      const url = '/some-uri';
      const params = { id: 1 };

      await apiClient.get(url, params);

      expect(ApiResponseHandler).toHaveBeenCalledTimes(1);
      expect(handleSuccessSpy).toHaveBeenCalled();
      expect(mockSuccessHandler).toHaveBeenCalled();
      expect(responseHandlerSpy).toHaveBeenCalled();
    });

    it('should only call custom Response handler if used and useDefaultHandler is false', async () => {
      const responseHandler = new MockResponseHandler();
      const apiClient = new ApiClient({ baseUrl, responseHandler, useDefaultHandler: false });
      const handleSuccessSpy = jest.spyOn(apiClient, 'handleSuccess');
      const responseHandlerSpy = jest.spyOn(responseHandler, 'success');
      const url = '/some-uri';
      const params = { id: 1 };

      await apiClient.get(url, params);

      expect(ApiResponseHandler).toHaveBeenCalledTimes(0);
      expect(handleSuccessSpy).toHaveBeenCalled();
      expect(mockSuccessHandler).not.toHaveBeenCalled();
      expect(responseHandlerSpy).toHaveBeenCalled();
    });
  });

  describe('Response handling - error', () => {
    beforeEach(() => {
      // @ts-ignore
      mockAxios.request.mockImplementationOnce(() => {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({});
      });

      jest.clearAllMocks();
    });

    it('should use the default response handler for error', async () => {
      const apiClient = new ApiClient({ baseUrl });
      const handleErrorSpy = jest.spyOn(apiClient, 'handleError');
      const url = '/some-uri';
      const params = { id: 1 };

      try {
        await apiClient.get(url, params);
      } catch (e) {
        // do nothing
      }

      expect(ApiResponseHandler).toHaveBeenCalledTimes(1);
      expect(handleErrorSpy).toHaveBeenCalled();
      expect(mockErrorHandler).toHaveBeenCalled();
    });

    it('should also call custom Response handler if used', async () => {
      const responseHandler = new MockResponseHandler();
      const apiClient = new ApiClient({ baseUrl, responseHandler });
      const handleErrorSpy = jest.spyOn(apiClient, 'handleError');
      const responseHandlerSpy = jest.spyOn(responseHandler, 'error');
      const url = '/some-uri';
      const params = { id: 1 };

      try {
        await apiClient.get(url, params);
      } catch (e) {
        // do nothing
      }

      expect(ApiResponseHandler).toHaveBeenCalledTimes(1);
      expect(handleErrorSpy).toHaveBeenCalled();
      expect(mockErrorHandler).toHaveBeenCalled();
      expect(responseHandlerSpy).toHaveBeenCalled();
    });

    it('should only call custom Response handler if used and useDefaultHandler is false', async () => {
      const responseHandler = new MockResponseHandler();
      const apiClient = new ApiClient({ baseUrl, responseHandler, useDefaultHandler: false });
      const handleErrorSpy = jest.spyOn(apiClient, 'handleError');
      const responseHandlerSpy = jest.spyOn(responseHandler, 'error');
      const url = '/some-uri';
      const params = { id: 1 };

      try {
        await apiClient.get(url, params);
      } catch (e) {
        // do nothing
      }

      expect(ApiResponseHandler).toHaveBeenCalledTimes(0);
      expect(handleErrorSpy).toHaveBeenCalled();
      expect(mockErrorHandler).not.toHaveBeenCalled();
      expect(responseHandlerSpy).toHaveBeenCalled();
    });
  });
});
