import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';

describe('ErrorUtils', () => {
  it('should return error when original present', () => {
    const error = {
      statusCode: 500,
      message: 'message',
      original: {
        status: 'Status',
        error: [
          {
            message: 'Internal Server Error',
          },
        ],
      },
    };
    const message = ErrorUtils.getErrorMessage(error);
    expect(message).toStrictEqual('Internal Server Error');
  });
});
