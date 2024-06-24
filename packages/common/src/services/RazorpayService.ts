import axios from 'axios';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { IfscDetail } from '@homzhub/common/src/domain/models/IfscDetail';

interface ICallback {
  onError: (error: string) => void;
}

class RazorpayService {
  private axiosInstance = axios.create({
    baseURL: 'https://ifsc.razorpay.com/',
  });

  public validateIfsc = async (input: string, payload: ICallback): Promise<void> => {
    try {
      const res = await this.axiosInstance.get(`${input}`);
      const finalResponse = ObjectMapper.deserialize(IfscDetail, res.data);
      StoreProviderService.getStore().dispatch(CommonActions.setIfscDetail(finalResponse));
    } catch (e) {
      const error = this.errorValidation(e);
      payload.onError(error);
    }
  };

  private errorValidation = (e: Error): string => {
    if (e.message.includes('404')) {
      return I18nService.t('ifscNotFound');
    }

    return e.message;
  };
}

const razorpayService = new RazorpayService();
export { razorpayService as RazorpayService };
