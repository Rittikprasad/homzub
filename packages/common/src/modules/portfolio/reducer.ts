import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { PortfolioActionTypes, PortfolioPayloadTypes } from '@homzhub/common/src/modules/portfolio/actions';
import { IPortfolioState, ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { TenantInfo } from '@homzhub/common/src/domain/models/TenantInfo';

export const initialPortfolioState: IPortfolioState = {
  error: {
    tenancies: '',
    properties: '',
    history: '',
  },
  loaders: {
    tenancies: false,
    properties: false,
    history: false,
  },
  properties: [],
  tenancies: [],
  currentAsset: {} as ISetAssetPayload,
  tenantHistory: [],
  currentFilter: Filters.ALL,
};

export const portfolioReducer = (
  state: IPortfolioState = initialPortfolioState,
  action: IFluxStandardAction<PortfolioPayloadTypes>
): IPortfolioState => {
  switch (action.type) {
    case PortfolioActionTypes.GET.TENANCIES_DETAILS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['tenancies']: true },
        ['error']: { ...state.error, ['tenancies']: '' },
      };
    case PortfolioActionTypes.GET.TENANCIES_DETAILS_SUCCESS:
      return {
        ...state,
        ['tenancies']: action.payload as Asset[],
        ['loaders']: { ...state.loaders, ['tenancies']: false },
      };
    case PortfolioActionTypes.GET.TENANCIES_DETAILS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['tenancies']: false },
        ['error']: { ...state.error, ['tenancies']: action.error as string },
      };
    case PortfolioActionTypes.GET.PROPERTY_DETAILS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['properties']: true },
        ['error']: { ...state.error, ['properties']: '' },
      };
    case PortfolioActionTypes.GET.PROPERTY_DETAILS_SUCCESS:
      return {
        ...state,
        ['properties']: action.payload as Asset[],
        ['loaders']: { ...state.loaders, ['properties']: false },
      };
    case PortfolioActionTypes.GET.PROPERTY_DETAILS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['properties']: false },
        ['error']: { ...state.error, ['properties']: action.error as string },
      };
    case PortfolioActionTypes.SET.CURRENT_ASSET:
      return { ...state, ['currentAsset']: action.payload as ISetAssetPayload };
    case PortfolioActionTypes.GET.TENANT_HISTORY:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['history']: true },
        ['error']: { ...state.error, ['history']: '' },
      };
    case PortfolioActionTypes.GET.TENANT_HISTORY_SUCCESS:
      return {
        ...state,
        ['tenantHistory']: action.payload as TenantInfo[],
        ['loaders']: { ...state.loaders, ['history']: false },
      };
    case PortfolioActionTypes.GET.TENANT_HISTORY_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['history']: false },
        ['error']: { ...state.error, ['history']: action.error as string },
      };
    case PortfolioActionTypes.SET.CURRENT_FILTER:
      return { ...state, ['currentFilter']: action.payload as Filters };
    case PortfolioActionTypes.SET.INITIAL_STATE:
      return { ...initialPortfolioState, ['currentAsset']: state.currentAsset };
    default:
      return state;
  }
};
