import { Asset, DataType } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { TenantInfo } from '@homzhub/common/src/domain/models/TenantInfo';
import { DetailType } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICallback } from '@homzhub/common/src/modules/interfaces';

export interface IDataObject {
  [id: number]: Asset;
}

export interface IPortfolioState {
  tenancies: Asset[];
  properties: Asset[];
  currentAsset: ISetAssetPayload;
  tenantHistory: TenantInfo[];
  currentFilter: Filters;
  error: {
    tenancies: string;
    properties: string;
    history: string;
  };
  loaders: {
    tenancies: boolean;
    properties: boolean;
    history: boolean;
  };
}

export interface IGetPropertiesPayload {
  onCallback: (params: ICallback) => void;
}

export interface IGetTenanciesPayload {
  onCallback: (params: ICallback) => void;
}

export interface IGetHistoryParam {
  id: number;
  onCallback: (params: ICallback) => void;
  data?: IGetHistoryPayload;
}

export interface IGetHistoryPayload {
  sort_by?: string;
  lease_transaction_id?: number;
  active?: boolean;
}

export interface ISetAssetPayload {
  asset_id: number;
  listing_id: number;
  assetType: DetailType;
  dataType?: DataType;
  lease_listing_id?: number | null;
  sale_listing_id?: number | null;
}
