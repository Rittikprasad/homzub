import { IUserTokens } from '@homzhub/common/src/services/storage/StorageService';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IBankInfo } from '@homzhub/common/src/domain/models/BankInfo';
import { ICoinTransaction } from '@homzhub/common/src/domain/models/CoinTransaction';
import { IUserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { IUserPreferences } from '@homzhub/common/src/domain/models/UserPreferences';
import { IUserSubscription } from '@homzhub/common/src/domain/models/UserSubscription';

export interface IUserState {
  tokens: IUserTokens | null;
  userProfile: IUserProfile | null;
  userPreferences: IUserPreferences | null;
  assets: IAsset[];
  isOnBoardingCompleted: boolean;
  isChangeStack: boolean;
  isAddPropertyFlow: boolean;
  userCountryCode: number;
  favouriteProperties: IAsset[];
  userSubscriptions: IUserSubscription | null;
  userServices: IAsset[];
  userTransaction: ICoinTransaction[];
  bankInfo: IBankInfo[];
  currentBankAccountId: number;
  error: {
    user: string;
  };
  loaders: {
    user: boolean;
    userProfile: boolean;
    userPreferences: boolean;
    userSubscriptions: boolean;
    whileAssets: boolean;
    whileFavouriteProperties: boolean;
    userService: boolean;
    userTransaction: boolean;
    bankInfo: boolean;
  };
}

export interface IAuthCallback {
  callback?: (status: boolean) => void;
}
