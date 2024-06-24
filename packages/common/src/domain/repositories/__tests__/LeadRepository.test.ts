import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { LeadRepository } from '@homzhub/common/src/domain/repositories/LeadRepository';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

const leadPayload = {
  propertyTermId: 1,
  data: {
    contact_person_type: 'person type',
    lead_type: 'lead',
    message: 'message',
    person_contacted: 1,
    preferred_contact_time: '12pm',
  },
};

describe('LeadRepository', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should post lease lead', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => Promise.resolve({}));
    const response = await LeadRepository.postLeaseLeadDetail(leadPayload);
    expect(response).toMatchSnapshot();
  });

  it('should post sale lead', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => Promise.resolve({}));
    const response = await LeadRepository.postSaleLeadDetail(leadPayload);
    expect(response).toMatchSnapshot();
  });
});
