import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IAssetListingParam } from '@homzhub/common/src/domain/repositories/interfaces';

// TODO : (Shikha) - Add all listing endpoints here

const ENDPOINTS = {
  listing: (param: IAssetListingParam): string => `v1/${param.listingType}/${param.listingId}`,
};

class ListingRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getListing = async (params: IAssetListingParam): Promise<Asset> => {
    const response = await this.apiClient.get(ENDPOINTS.listing(params));
    return ObjectMapper.deserialize(Asset, response);
  };
}

const listingRepository = new ListingRepository();
export { listingRepository as ListingRepository };
