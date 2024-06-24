import { IState } from '@homzhub/common/src/modules/interfaces';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialRecordAssetState } from '@homzhub/common/src/modules/recordAsset/reducer';
import { initialAssetState } from '@homzhub/common/src/modules/asset/reducer';
import { initialSearchState } from '@homzhub/common/src/modules/search/reducer';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';

const state: IState = {
  user: {
    ...initialUserState,
    tokens: {
      access_token: 'access_token',
      refresh_token: 'refresh_token',
    },
    isOnBoardingCompleted: false,
    isChangeStack: false,
    loaders: {
      user: true,
    },
  },
  recordAsset: {
    ...initialRecordAssetState,
  },
  asset: {
    ...initialAssetState,
  },
  search: {
    ...initialSearchState,
  },
};

describe('User Selector', () => {
  it('should verify isLogged in', () => {
    expect(UserSelector.isLoggedIn(state)).toBe(true);
  });

  it('should verify onBoarding completed', () => {
    expect(UserSelector.hasOnBoardingCompleted(state)).toBe(false);
  });

  it('should return logged in state', () => {
    expect(UserSelector.getLoadingState(state)).toEqual(true);
  });

  it('should return value of change stack', () => {
    expect(UserSelector.getIsChangeStack(state)).toEqual(false);
  });
});
