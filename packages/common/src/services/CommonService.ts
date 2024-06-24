import axios from 'axios';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';

class CommonService {
  public getMarkdownData = async (isFrom: string): Promise<string> => {
    const baseUrl = ConfigHelper.getBaseUrl();
    const urlEndpoint = isFrom === 'verification' ? 'VERIFICATION_DOCUMENT' : 'VISIT_PROPERTY_LOCATION';

    const token = StoreProviderService.getUserToken();

    const response = await axios.get(`${baseUrl}v1/markdown/${urlEndpoint}/`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
}

const commonService = new CommonService();
export { commonService as CommonService };
