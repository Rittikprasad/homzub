import { IApiResponseHandler } from '@homzhub/common/src/network/Interfaces';

export class MockResponseHandler implements IApiResponseHandler {
  public success = jest.fn();
  public error = jest.fn();
}
