import { all } from 'redux-saga/effects';
import rootSaga from '@homzhub/common/src/modules/sagas';
import { watchUser } from '@homzhub/common/src/modules/user/saga';
import { watchSearch } from '@homzhub/common/src/modules/search/saga';
import { watchAsset } from '@homzhub/common/src/modules/asset/saga';
import { watchCommonActions } from '@homzhub/common/src/modules/common/saga';
import { watchPortfolio } from '@homzhub/common/src/modules/portfolio/saga';
import { watchRecordAsset } from '@homzhub/common/src/modules/recordAsset/saga';
import { watchTicket } from '@homzhub/common/src/modules/tickets/saga';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

it.skip('The root saga should react to actions', () => {
  const generator = rootSaga();
  expect(generator.next().value).toEqual(
    all([
      watchUser(),
      watchSearch(),
      watchAsset(),
      watchPortfolio(),
      watchRecordAsset(),
      watchCommonActions(),
      watchTicket(),
    ])
  );
  expect(generator.next().done).toBeTruthy();
});
