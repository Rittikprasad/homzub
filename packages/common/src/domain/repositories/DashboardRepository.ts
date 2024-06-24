import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { INotificationsPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { AssetAdvertisement } from '@homzhub/common/src/domain/models/AssetAdvertisement';
import { AssetNotifications } from '@homzhub/common/src/domain/models/AssetNotifications';

const ENDPOINTS = {
  getAssetMetrics: (version: string): string => `${version}/dashboard/management-tab/`,
  getAdvertisements: (): string => 'v1/advertisements/',
  getGeneralLedgers: (): string => 'v1/general-ledgers/overall-performances/',
  getAssetNotifications: (): string => 'v1/notifications/',
  updateNotifications: (id: number): string => `v1/notifications/${id}/`,
  markAllNotificationsRead: (): string => 'v1/notifications/mark-as-read/',
};

class DashboardRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  // Todo (Praharsh) : Remove argument when web dashboard is updated with v3.
  public getAssetMetrics = async (version = 'v2'): Promise<AssetMetrics> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetMetrics(version));
    return ObjectMapper.deserialize(AssetMetrics, response);
  };

  public getAdvertisements = async (payload?: { category: string }): Promise<AssetAdvertisement> => {
    const response = await this.apiClient.get(ENDPOINTS.getAdvertisements(), payload || {});
    return ObjectMapper.deserialize(AssetAdvertisement, response);
  };

  public getAssetNotifications = async (requestPayload: INotificationsPayload): Promise<AssetNotifications> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetNotifications(), requestPayload);
    return ObjectMapper.deserialize(AssetNotifications, response);
  };

  public updateNotificationStatus = async (id: number): Promise<void> => {
    return await this.apiClient.patch(ENDPOINTS.updateNotifications(id));
  };

  public markAllNotificationsRead = async (latestCreatedAt: string): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.markAllNotificationsRead(), { created_at: latestCreatedAt });
  };
}

const dashboardRepository = new DashboardRepository();
export { dashboardRepository as DashboardRepository };
