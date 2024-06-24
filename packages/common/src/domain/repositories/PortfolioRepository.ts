import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetFilter } from '@homzhub/common/src/domain/models/AssetFilter';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { TenantInfo } from '@homzhub/common/src/domain/models/TenantInfo';
import { DetailType, IPropertyDetailPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IGetHistoryPayload } from '@homzhub/common/src/modules/portfolio/interfaces';

const ENDPOINTS = {
  getAssetMetrics: (): string => 'v1/portfolio/management-tab/',
  getAssetFilter: (): string => 'v3/portfolio/asset-filters/',
  getTenancies: (): string => 'v1/portfolio/tenancies/',
  getAssetDetails: (): string => 'v2/portfolio/asset-details/',
  getTenantHistory: (id: number): string => `v1/assets/${id}/lease-tenants/`,
  getPropertyDetailById: (id: number): string => `v2/assets/${id}/detail/`,
  getPropertyDetailByListing: (id: number, listingType: string, listingId: number): string =>
    `v2/assets/${id}/${listingType}/${listingId}/`,
  getPortfolioAsset: 'v1/assets/portfolio/listings',
};

class PortfolioRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getAssetMetrics = async (): Promise<AssetMetrics> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetMetrics());
    return ObjectMapper.deserialize(AssetMetrics, response);
  };

  public getAssetFilters = async (): Promise<AssetFilter> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetFilter());
    return ObjectMapper.deserialize(AssetFilter, response);
  };

  public getUserTenancies = async (): Promise<Asset[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getTenancies());
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public getUserAssetDetails = async (status: string): Promise<Asset[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetDetails(), { status });
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public getTenantHistory = async (id: number, data?: IGetHistoryPayload): Promise<TenantInfo[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getTenantHistory(id), data);
    return ObjectMapper.deserializeArray(TenantInfo, response);
  };

  public getPropertyDetail = async (payload: IPropertyDetailPayload): Promise<Asset> => {
    const { id, type, asset_id } = payload;
    const url =
      type === DetailType.ASSET
        ? ENDPOINTS.getPropertyDetailById(asset_id)
        : ENDPOINTS.getPropertyDetailByListing(asset_id, type, id);
    const response = await this.apiClient.get(url);
    return ObjectMapper.deserialize(Asset, response);
  };

  public getPortfolioAssets = async (): Promise<Asset[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getPortfolioAsset);
    return ObjectMapper.deserializeArray(Asset, response);
  };
}

const portfolioRepository = new PortfolioRepository();
export { portfolioRepository as PortfolioRepository };
