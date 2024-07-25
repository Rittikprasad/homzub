import { groupBy } from 'lodash';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { AssetVisit, IVisitByKey } from '@homzhub/common/src/domain/models/AssetVisit';
import { IAssetUser, User } from '@homzhub/common/src/domain/models/User';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IAssetState } from '@homzhub/common/src/modules/asset/interfaces';
import { VisitStatus } from '@homzhub/common/src/domain/repositories/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

const getAssetReviews = (state: IState): AssetReview | null => {
  const {
    asset: { reviews },
  } = state;

  if (!reviews) return null;

  return ObjectMapper.deserialize(AssetReview, reviews);
};

const getAsset = (state: IState): Asset | null => {
  const {
    asset: { asset },
  } = state;

  if (!asset) return null;
  return ObjectMapper.deserialize(Asset, asset);
};

const getAssetListingType = (state: IState): number => {
  const asset = getAsset(state);
  if (asset?.saleTerm) return 1;
  return 0;
};

const getLoadingState = (state: IState): boolean => {
  const {
    asset: {
      loaders: { asset },
    },
  } = state;
  return asset;
};

const getAssetDocuments = (state: IState): AssetDocument[] => {
  const {
    asset: { documents },
  } = state;
  if (documents.length <= 0) return [];
  return documents;
};

const getAssetVisits = (state: IState): AssetVisit[] => {
  const {
    asset: { visits },
  } = state;
  if (visits.length <= 0) return [];

  return ObjectMapper.deserializeArray(AssetVisit, visits);
};

const getAssetVisitsByDate = (state: IState): IVisitByKey[] => {
  const {
    asset: { visits, visitType },
  } = state;
  if (visits.length <= 0) return [];
  const data = ObjectMapper.deserializeArray(AssetVisit, visits);

  if (visitType === Tabs.MISSED) {
    data.forEach((item) => {
      const formattedDate = DateUtils.getDisplayDate(item.startDate, DateFormats.ISO24Format);
      const currentDate = DateUtils.getDisplayDate(new Date().toISOString(), DateFormats.ISO24Format);
      const dateDiff = DateUtils.getDateDiff(formattedDate, currentDate);

      if (item.status === VisitStatus.PENDING && dateDiff >= 0) {
        data.splice(
          data.findIndex((visit) => visit.id === item.id),
          1
        );
      }
    });
  }

  const groupData = groupBy(data, (results) => {
    return DateUtils.getUtcFormattedDate(results.startDate, 'DD-MMM-YYYY');
  });

  return Object.keys(groupData).map((date) => {
    const results = groupData[date];
    return {
      key: DateUtils.getUtcFormattedDate(date, 'DD, MMM YYYY'),
      results,
      totalVisits: data.length,
    };
  });
};

const getVisitsByAsset = (state: IState): IVisitByKey[][] => {
  const {
    asset: { visits },
  } = state;
  if (visits.length <= 0) return [];
  const data = ObjectMapper.deserializeArray(AssetVisit, visits);
  const groupData = groupBy(data, (results) => {
    const {
      asset: { projectName },
    } = results;
    return projectName;
  });

  return Object.keys(groupData).map((projectName) => {
    const results = groupBy(groupData[projectName], 'startDate');
    return Object.keys(results).map((key) => {
      const formattedData = results[key];
      return {
        key: projectName,
        results: formattedData,
      };
    });
  });
};

const getVisitIds = (state: IState): number[] => {
  const {
    asset: { visitIds },
  } = state;

  return visitIds;
};

const getVisitById = (state: IState): AssetVisit => {
  const {
    asset: { visitIds },
  } = state;

  const visits = getAssetVisits(state);

  let visitData = new AssetVisit();

  visits.forEach((visit) => {
    visitIds.forEach((id) => {
      if (id === visit.id) {
        visitData = visit;
      }
    });
  });

  return visitData;
};

const getVisitLoadingState = (state: IState): boolean => {
  const {
    asset: {
      loaders: { visits },
    },
  } = state;
  return visits;
};

const getUserActiveAssets = (state: IState): Asset[] => {
  const {
    asset: { activeAssets },
  } = state;

  if (activeAssets.length <= 0) return [];

  return ObjectMapper.deserializeArray(Asset, activeAssets);
};

const isActiveAssetsLoading = (state: IState): boolean => {
  const {
    asset: {
      loaders: { activeAssets },
    },
  } = state;

  return activeAssets;
};

const getAssetById = (state: IState): Asset | null => {
  const {
    asset: { assetById },
  } = state;

  if (!assetById) return null;

  return ObjectMapper.deserialize(Asset, assetById);
};

const getAssetLoaders = (state: IState): IAssetState['loaders'] => {
  return state.asset.loaders;
};

const getAssetUser = (state: IState): IAssetUser | null => {
  const {
    asset: { assetUsers },
  } = state;

  if (assetUsers.length <= 0) return null;
  const users = ObjectMapper.deserializeArray(User, assetUsers);
  console.log(users,'udgtfjhsafhjsfdjghfgfhdgsdhfggfgfgfgfggfgfgffgfgfg')
  const owners = users
    .filter((item) => item.isAssetOwner)
    .map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  const tenants = users
    .filter((item) => !item.isAssetOwner)
    .map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });

  return {
    owners,
    tenants,
  };
};

const getAssetUserEmails = (state: IState): string[] => {
  const {
    asset: { assetUsers },
  } = state;

  if (assetUsers.length <= 0) return [];
  const users = ObjectMapper.deserializeArray(User, assetUsers);
  return users.map((item) => item.email);
};

export const AssetSelectors = {
  getAssetReviews,
  getAsset,
  getAssetListingType,
  getLoadingState,
  getAssetDocuments,
  getAssetVisits,
  getAssetVisitsByDate,
  getVisitsByAsset,
  getVisitById,
  getVisitIds,
  getVisitLoadingState,
  getUserActiveAssets,
  isActiveAssetsLoading,
  getAssetLoaders,
  getAssetById,
  getAssetUser,
  getAssetUserEmails,
};
