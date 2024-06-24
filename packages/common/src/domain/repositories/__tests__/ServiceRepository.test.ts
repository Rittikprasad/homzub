/*eslint-disable*/
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { AssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { AssetPlanData } from '@homzhub/common/src/mocks/AssetPlanData';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('ServiceRepository', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should fetch a list of rent services', async () => {
    const data = ObjectMapper.deserializeArray(AssetPlan, AssetPlanData);
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(data));
    const response = await ServiceRepository.getAssetPlans();
    expect(response).toStrictEqual(data);
  });
});
