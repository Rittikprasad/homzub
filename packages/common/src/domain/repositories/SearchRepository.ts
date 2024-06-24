import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { FilterDetail } from '@homzhub/common/src/domain/models/FilterDetail';
import { IFilter, ISearchHistoryPayload } from '@homzhub/common/src/domain/models/Search';
import { ISearchRequirementPayload } from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  getFilterData: (): string => 'v1/asset-filters/',
  getPropertiesForLeaseListings: (): string => 'v1/lease-listings/search/',
  getPropertiesForSaleListings: (): string => 'v1/sale-listings/search/',
  addSearchHistory: (): string => 'v1/asset-filters/record-history/',
  addSearchRequirement: (): string => 'v1/custom-search/',
};

class SearchRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getFilterDetails = async (requestBody: IFilter): Promise<FilterDetail> => {
    const response = await this.apiClient.get(ENDPOINTS.getFilterData(), requestBody);
    return ObjectMapper.deserialize(FilterDetail, response);
  };

  public getPropertiesForLeaseListings = async (requestBody: any): Promise<AssetSearch> => {
    const response = await this.apiClient.get(ENDPOINTS.getPropertiesForLeaseListings(), requestBody);
    return ObjectMapper.deserialize(AssetSearch, response);
  };

  public getPropertiesForSaleListings = async (requestBody: any): Promise<AssetSearch> => {
    const response = await this.apiClient.get(ENDPOINTS.getPropertiesForSaleListings(), requestBody);
    return ObjectMapper.deserialize(AssetSearch, response);
  };

  public addSearchHistory = async (requestBody: ISearchHistoryPayload): Promise<void> => {
    await this.apiClient.post(ENDPOINTS.addSearchHistory(), requestBody);
  };

  public addSearchRequirement = async (requestBody: ISearchRequirementPayload): Promise<void> => {
    await this.apiClient.post(ENDPOINTS.addSearchRequirement(), requestBody);
  };
}

const searchRepository = new SearchRepository();
export { searchRepository as SearchRepository };
