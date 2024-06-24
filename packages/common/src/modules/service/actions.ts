import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

const actionTypePrefix = 'Services/';
export const ServiceActionTypes = {
  GET: {
    SERVICE_CITIES: `${actionTypePrefix}SERVICE_CITIES`,
    SERVICE_CITIES_SUCCESS: `${actionTypePrefix}SERVICE_CITIES_SUCCESS`,
    SERVICE_CITIES_FAILURE: `${actionTypePrefix}SERVICE_CITIES_FAILURE`,
    SERVICE_ASSETS: `${actionTypePrefix}SERVICE_ASSETS`,
    SERVICE_ASSETS_SUCCESS: `${actionTypePrefix}SERVICE_ASSETS_SUCCESS`,
    SERVICE_ASSETS_FAILURE: `${actionTypePrefix}SERVICE_ASSETS_FAILURE`,
  },
};

const getServiceCities = (): IFluxStandardAction => ({
  type: ServiceActionTypes.GET.SERVICE_CITIES,
});

const getServiceCitiesSuccess = (payload: Unit[]): IFluxStandardAction<IUnit[]> => ({
  type: ServiceActionTypes.GET.SERVICE_CITIES_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getServiceCitiesFailure = (): IFluxStandardAction => ({
  type: ServiceActionTypes.GET.SERVICE_CITIES_FAILURE,
});

const getServiceAssets = (): IFluxStandardAction => ({
  type: ServiceActionTypes.GET.SERVICE_ASSETS,
});

const getServiceAssetsSuccess = (payload: Asset[]): IFluxStandardAction<IAsset[]> => ({
  type: ServiceActionTypes.GET.SERVICE_ASSETS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getServiceAssetsFailure = (): IFluxStandardAction => ({
  type: ServiceActionTypes.GET.SERVICE_ASSETS_FAILURE,
});

export type ServiceActionPayloadTypes = IUnit[] | IAsset[];

export const ServiceActions = {
  getServiceCities,
  getServiceCitiesSuccess,
  getServiceCitiesFailure,
  getServiceAssets,
  getServiceAssetsSuccess,
  getServiceAssetsFailure,
};
