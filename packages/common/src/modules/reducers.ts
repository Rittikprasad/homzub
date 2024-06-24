import { combineReducers } from 'redux';
import { assetReducer } from '@homzhub/common/src/modules/asset/reducer';
import { commonReducer } from '@homzhub/common/src/modules/common/reducer';
import { ffmReducer } from '@homzhub/common/src/modules/ffm/reducer';
import { financialsReducer } from '@homzhub/common/src/modules/financials/reducer';
import { offerReducer } from '@homzhub/common/src/modules/offers/reducer';
import { portfolioReducer } from '@homzhub/common/src/modules/portfolio/reducer';
import { propertyPaymentReducer } from '@homzhub/common/src/modules/propertyPayment/reducer';
import { recordAssetReducer } from '@homzhub/common/src/modules/recordAsset/reducer';
import { searchReducer } from '@homzhub/common/src/modules/search/reducer';
import { serviceReducer } from '@homzhub/common/src/modules/service/reducer';
import { ticketReducer } from '@homzhub/common/src/modules/tickets/reducer';
import { userReducer } from '@homzhub/common/src/modules/user/reducer';

export default combineReducers({
  asset: assetReducer,
  common: commonReducer,
  financials: financialsReducer,
  offer: offerReducer,
  portfolio: portfolioReducer,
  recordAsset: recordAssetReducer,
  search: searchReducer,
  ticket: ticketReducer,
  user: userReducer,
  propertyPayment: propertyPaymentReducer,
  service: serviceReducer,
  ffm: ffmReducer,
});
