import { ServiceActionPayloadTypes, ServiceActionTypes } from '@homzhub/common/src/modules/service/actions';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IServiceState } from '@homzhub/common/src/modules/service/interface';

export const initialServiceState: IServiceState = {
  serviceCities: [],
  serviceAssets: [],
  loaders: {
    serviceCities: false,
    serviceAssets: false,
  },
};

export const serviceReducer = (
  state: IServiceState = initialServiceState,
  action: IFluxStandardAction<ServiceActionPayloadTypes>
): IServiceState => {
  switch (action.type) {
    case ServiceActionTypes.GET.SERVICE_CITIES:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['serviceCities']: true },
      };
    case ServiceActionTypes.GET.SERVICE_CITIES_SUCCESS:
      return {
        ...state,
        ['serviceCities']: action.payload as IUnit[],
        ['loaders']: { ...state.loaders, ['serviceCities']: false },
      };
    case ServiceActionTypes.GET.SERVICE_CITIES_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['serviceCities']: false },
      };
    case ServiceActionTypes.GET.SERVICE_ASSETS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['serviceAssets']: true },
      };
    case ServiceActionTypes.GET.SERVICE_ASSETS_SUCCESS:
      return {
        ...state,
        ['serviceAssets']: action.payload as IAsset[],
        ['loaders']: { ...state.loaders, ['serviceAssets']: false },
      };
    case ServiceActionTypes.GET.SERVICE_ASSETS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['serviceAssets']: false },
      };
    default:
      return {
        ...state,
      };
  }
};
