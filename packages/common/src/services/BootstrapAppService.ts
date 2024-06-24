import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { ApiClient } from '@homzhub/common/src/network/ApiClient';
import ApiResponseHandler from '@homzhub/common/src/network/ApiResponseHandler';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';

class BootstrapAppService {
  private instance: IApiClient | undefined;

  get clientInstance(): IApiClient {
    if (!this.instance) {
      return this.initializeApiClient();
    }
    return this.instance;
  }

  public initializeApiClient = (): IApiClient => {
    this.instance = getApiClient();
    return this.instance;
  };
}

const getApiClient = (): IApiClient => {
  const baseUrl = ConfigHelper.getBaseUrl();
  const requestTimeout = 10000;
  const responseHandler = new ApiResponseHandler();

  return new ApiClient({
    baseUrl,
    requestTimeout,
    responseHandler,
    useDefaultHandler: false,
  });
};

const bootstrapAppService = new BootstrapAppService();
export { bootstrapAppService as BootstrapAppService };
