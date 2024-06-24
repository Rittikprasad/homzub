import { ICallback } from '@homzhub/common/src/modules/interfaces';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { IAssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { IAssetVisit } from '@homzhub/common/src/domain/models/AssetVisit';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

export interface IAssetState {
  asset: IAsset | null;
  reviews: IAssetReview | null;
  documents: AssetDocument[];
  visits: IAssetVisit[];
  visitIds: number[];
  visitType: Tabs;
  activeAssets: IAsset[];
  assetById: IAsset | null;
  assetUsers: IUser[];
  error: {
    asset: string;
    reviews: string;
    documents: string;
    visits: string;
  };
  loaders: {
    asset: boolean;
    reviews: boolean;
    documents: boolean;
    visits: boolean;
    activeAssets: boolean;
    assetById: boolean;
    assetUser: boolean;
  };
}

export interface IGetAssetPayload {
  propertyTermId: number;
  onCallback?: (params: ICallback) => void;
}

export interface IGetDocumentPayload {
  assetId: number;
  onCallback?: (params: ICallback) => void;
}

export interface IUpdateDocumentPayload extends IGetDocumentPayload {
  assetDocumentId: number;
  fileName: string;
}
