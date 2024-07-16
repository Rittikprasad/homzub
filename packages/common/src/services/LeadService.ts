import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { LeadRepository } from '@homzhub/common/src/domain/repositories/LeadRepository';
import { ILeadPayload } from '@homzhub/common/src/domain/repositories/interfaces';

class LeadService {
  public postLeadDetail = async (transaction_type: number, payload: ILeadPayload): Promise<void> => {
    try {
      if (transaction_type === 0) {
        // RENT FLOW
        await LeadRepository.postLeaseLeadDetail(payload);
      } else {
        // SALE FLOW
        await LeadRepository.postSaleLeadDetail(payload);
      }
    }catch (e: any) {      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };
}

const leadService = new LeadService();
export { leadService as LeadService };
