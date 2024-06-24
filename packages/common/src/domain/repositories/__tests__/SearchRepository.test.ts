import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { SearchRepository } from '@homzhub/common/src/domain/repositories/SearchRepository';
import { FilterData } from '@homzhub/common/src/mocks/FilterData';
import { AssetSearchData } from '@homzhub/common/src/mocks/AssetDescription';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe.skip('SearchRepository', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should get filter details', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(FilterData));
    const response = await SearchRepository.getFilterDetails({ asset_group: 1 });
    expect(response).toMatchSnapshot();
  });

  it('should get properties for lease listings', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(AssetSearchData));
    const response = await SearchRepository.getPropertiesForLeaseListings({ asset_group: 1 });
    expect(response).toMatchSnapshot();
  });

  it('should get properties for sale listings', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(AssetSearchData));
    const response = await SearchRepository.getPropertiesForSaleListings({ asset_group: 1 });
    expect(response).toMatchSnapshot();
  });
});
