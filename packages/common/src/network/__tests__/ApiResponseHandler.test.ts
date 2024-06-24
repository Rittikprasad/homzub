// @ts-nocheck
import { Logger } from '@homzhub/common/src/utils/Logger';
import ApiResponseHandler from '@homzhub/common/src/network/ApiResponseHandler';
import { IApiError, IApiResponse } from '@homzhub/common/src/network/Interfaces';
import { ApiClientError } from '@homzhub/common/src/network/ApiClientError';
import { DEFAULT_ERROR_MESSAGE } from '@homzhub/common/src/network/Constants';

// As Logger is used by ApiResponseHandler, we want to mock it
jest.mock('@homzhub/common/src/utils/Logger');
const apiResponseHandler = new ApiResponseHandler();
const jsonHeader = {
  'content-type': 'application/json',
};

describe.skip('ApiResponseHandler', () => {
  describe('success', () => {
    it('should return the data of the API response', () => {
      const apiResponse: IApiResponse = {
        data: {},
        status: 200,
        headers: {
          ...jsonHeader,
        },
      };

      const actualResponse = apiResponseHandler.success(apiResponse);

      expect(actualResponse).toStrictEqual(apiResponse.data);
    });

    it('should return the data of the API response and log a warning if the data is not a JSON', () => {
      const apiResponse: IApiResponse = {
        data: {},
        status: 200,
        headers: {
          ...jsonHeader,
        },
      };

      const actualResponse = apiResponseHandler.success(apiResponse);

      expect(actualResponse).toStrictEqual(apiResponse.data);
      expect(Logger.warn).toHaveBeenCalled();
    });

    it('should return an empty object if the API response has no data and log a warning', () => {
      const apiResponse: IApiResponse = {
        data: null,
        status: 200,
        headers: {},
      };

      const actualResponse = apiResponseHandler.success(apiResponse);

      expect(actualResponse).toStrictEqual({});
      expect(Logger.warn).toHaveBeenCalled();
    });

    it('should return an empty object if the API response has no data but should not log a warning, when HTTP status code is 204', () => {
      const apiResponse: IApiResponse = {
        data: null,
        status: 204,
        headers: {},
      };

      const actualResponse = apiResponseHandler.success(apiResponse);

      expect(actualResponse).toStrictEqual({});
    });
  });

  describe.skip('error', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should log the API error', () => {
      const apiError: IApiError = {
        config: {},
      };

      const error = apiResponseHandler.error(apiError);
      expect(error).toBeInstanceOf(ApiClientError);
      expect(Logger.warn).toBeCalledTimes(2);
    });

    it('should return ApiClientError', () => {
      const apiError: IApiError = {
        config: {},
      };

      const error = apiResponseHandler.error(apiError);
      expect(error).toBeInstanceOf(ApiClientError);
      expect(error.message).toBe(DEFAULT_ERROR_MESSAGE);
    });

    it('should return ApiClientError with the response body, and should log a warning if the response is null', () => {
      const apiError: IApiError = {
        config: {},
        response: {
          data: null,
          status: 400,
          headers: null,
        },
      };

      const error = apiResponseHandler.error(apiError);
      expect(Logger.warn).toBeCalledTimes(2);
      expect(error.details.original).toStrictEqual(apiError.response.data);
    });

    it('should return ApiClientError with the response body, and should log a warning if the response is not a JSON', () => {
      const apiError: IApiError = {
        config: {},
        response: {
          data: 'Bad Request',
          status: 400,
          headers: {
            ...jsonHeader,
          },
        },
      };

      const error = apiResponseHandler.error(apiError);
      expect(error.details.original).toStrictEqual(apiError.response.data);
      expect(Logger.warn).toBeCalledTimes(2);
    });

    it('should return ApiClientError with the response body, which is a JSON', () => {
      const apiError: IApiError = {
        config: {},
        response: {
          data: {
            error: 'Some error',
          },
          status: 400,
          headers: {
            ...jsonHeader,
          },
        },
      };

      const error = apiResponseHandler.error(apiError);
      expect(error.details.original).toStrictEqual(apiError.response.data);
      expect(Logger.warn).toBeCalledTimes(1);
    });

    it('should return ApiClientError with the response body and log a warning, for missing JSON response header', () => {
      const apiError: IApiError = {
        config: {},
        response: {
          data: [
            {
              field: 'field1',
              error: 'Field 1 error',
            },
            {
              field: 'field2',
              error: 'Field 2 error',
            },
          ],
          status: 422,
          headers: {},
        },
      };

      const error = apiResponseHandler.error(apiError);
      expect(error.details.original).toStrictEqual(apiError.response.data);
      expect(Logger.warn).toBeCalledTimes(2);
    });
  });
});
