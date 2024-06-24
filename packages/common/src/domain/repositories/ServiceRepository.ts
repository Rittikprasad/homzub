import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { PlatformPlans } from '@homzhub/common/src/domain/models/PlatformPlan';
import { ServiceManagement } from '@homzhub/common/src/domain/models/ServiceManagement';
import { ServicePlans } from '@homzhub/common/src/domain/models/ServicePlans';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';

const ENDPOINTS = {
  getAssetPlan: (): string => 'v2/service-category-actions/',
  getServiceValueBundles: (): string => 'v1/value-bundles/',
  getServicePlatformPlans: (): string => 'v1/service-plans/',
  managementTab: 'v1/value-added-services/management-tab/',
  services: 'v2/value-added-services/user-services/',
  serviceCities: 'v1/value-bundles/cities/',
};

class ServiceRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getAssetPlans = async (): Promise<AssetPlan[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetPlan());
    return ObjectMapper.deserializeArray(AssetPlan, response);
  };

  public getServicePlans = async (): Promise<ServicePlans[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getServiceValueBundles());
    return ObjectMapper.deserializeArray(ServicePlans, response);
  };

  public getPlatformPlans = async (): Promise<PlatformPlans[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getServicePlatformPlans());
    return ObjectMapper.deserializeArray(PlatformPlans, response);
  };

  public getServiceManagementTab = async (): Promise<ServiceManagement> => {
    const response = await this.apiClient.get(ENDPOINTS.managementTab);
    return ObjectMapper.deserialize(ServiceManagement, response);
  };

  public getUserServices = async (): Promise<Asset[]> => {
    const response = await this.apiClient.get(ENDPOINTS.services);
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public getServiceCities = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.serviceCities);
    return ObjectMapper.deserializeArray(Unit, response);
  };
}

const serviceRepository = new ServiceRepository();
export { serviceRepository as ServiceRepository };
