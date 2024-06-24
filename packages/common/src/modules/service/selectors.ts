import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IServiceState } from '@homzhub/common/src/modules/service/interface';

const getServiceLoaders = (state: IState): IServiceState['loaders'] => {
  return state.service.loaders;
};

const getServiceCities = (state: IState): Unit[] => {
  const {
    service: { serviceCities },
  } = state;
  return ObjectMapper.deserializeArray(Unit, serviceCities);
};

const getServiceAssets = (state: IState): Asset[] => {
  const {
    service: { serviceAssets },
  } = state;
  return ObjectMapper.deserializeArray(Asset, serviceAssets);
};

export const ServiceSelector = {
  getServiceLoaders,
  getServiceCities,
  getServiceAssets,
};
