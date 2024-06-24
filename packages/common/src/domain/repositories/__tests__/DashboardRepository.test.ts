import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { AssetAdvertisementData, AssetMetricsData } from '@homzhub/common/src/mocks/AssetMetrics';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('DashboardRepository', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should get Asset Metrics', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(AssetMetricsData));
    const response = await DashboardRepository.getAssetMetrics();
    expect(response).toMatchSnapshot();
  });

  it('should get advertisements', async () => {
    jest
      .spyOn(BootstrapAppService.clientInstance, 'get')
      .mockImplementation(() => Promise.resolve(AssetAdvertisementData));
    const response = await DashboardRepository.getAdvertisements();
    expect(response).toMatchSnapshot();
  });
});
