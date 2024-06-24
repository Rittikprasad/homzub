import { IApiClient, IApiInterceptor } from '@homzhub/common/src/network/Interfaces';

const handler = (apiClient: IApiClient): any => {
  const onFulfilled = jest.fn();
  const onRejected = jest.fn();

  return { onFulfilled, onRejected };
};

export class MockApiInterceptor implements IApiInterceptor {
  public request = handler;

  public response = handler;
}
