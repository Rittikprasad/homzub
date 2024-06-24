import { ApiClientError, IApiClientError } from '@homzhub/common/src/network/ApiClientError';

const someMessage = 'Some error message';

describe.skip('ApiClientError', () => {
  it('should take a message as an argument', () => {
    const errorDetails = {} as IApiClientError;
    const error = new ApiClientError(someMessage, errorDetails);

    expect(error.message).toStrictEqual(someMessage);
  });

  it('should take optional error details along with the message', () => {
    const errorDetails: IApiClientError = {
      statusCode: 400,
      message: 'Detailed Error message',
      description: 'Error Description',
      errors: ['some other error'],
    };

    const error = new ApiClientError(someMessage, errorDetails);

    expect(error.message).toStrictEqual(someMessage);
    expect(error.details).toStrictEqual(errorDetails);
  });

  it('should return a serialized value for the error', () => {
    const expectedResponse = {
      message: someMessage,
      details: {},
    };
    const errorDetails = {} as IApiClientError;

    const error = new ApiClientError(someMessage, errorDetails);
    const actualResponse = error.toString();

    expect(actualResponse).toStrictEqual(JSON.stringify(expectedResponse));
  });

  it('should return a serialized value for the error including the error details, if available', () => {
    const errorDetails: IApiClientError = {
      statusCode: 400,
      message: 'Detailed Error message',
      description: 'Error Description',
      errors: ['some other error'],
    };
    const expectedResponse = {
      message: someMessage,
      details: errorDetails,
    };

    const error = new ApiClientError(someMessage, errorDetails);
    const actualResponse = error.toString();

    expect(actualResponse).toStrictEqual(JSON.stringify(expectedResponse));
  });
});
