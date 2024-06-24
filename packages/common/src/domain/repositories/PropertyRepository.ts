import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { Amenity } from '@homzhub/common/src/domain/models/Amenity';
import { Society } from '@homzhub/common/src/domain/models/Society';
import { SocietyCharge } from '@homzhub/common/src/domain/models/SocietyCharge';
import { SocietyReminder } from '@homzhub/common/src/domain/models/SocietyReminder';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import {
  IAssetSocietyPayload,
  IProjectSearchPayload,
  ISocietyParam,
  ISocietyPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';

const ENDPOINTS = {
  societies: 'v1/societies/',
  societyById: (id: number): string => `v1/societies/${id}/`,
  assetSociety: (id: number): string => `v1/societies/${id}/assets/`,
  societyCharges: (id: number): string => `v1/assets/${id}/society-charges/`,
  projectSearch: 'v1/projects/search/',
  projectAmenities: (id: number): string => `v1/projects/${id}/amenities/`,
  societyReminders: (id: number): string => `v1/assets/${id}/society-reminders/`,
};

class PropertyRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getSocieties = async (param?: ISocietyParam): Promise<Society[]> => {
    const response = await this.apiClient.get(ENDPOINTS.societies, param);
    return ObjectMapper.deserializeArray(Society, response);
  };

  public createSociety = async (payload: ISocietyPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.societies, payload);
  };

  public deleteSociety = async (societyId: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.societyById(societyId));
  };

  public updateSociety = async (societyId: number, body: ISocietyPayload): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.societyById(societyId), body);
  };

  public getSociety = async (societyId: number): Promise<Society> => {
    const response = await this.apiClient.get(ENDPOINTS.societyById(societyId));
    return ObjectMapper.deserialize(Society, response);
  };

  public addAssetSociety = async (payload: IAssetSocietyPayload): Promise<void> => {
    const { societyId, body } = payload;
    return await this.apiClient.post(ENDPOINTS.assetSociety(societyId), body);
  };

  public getSocietyCharges = async (assetId: number): Promise<SocietyCharge> => {
    const response = await this.apiClient.get(ENDPOINTS.societyCharges(assetId));
    return ObjectMapper.deserialize(SocietyCharge, response);
  };

  public getProjects = async (payload: IProjectSearchPayload): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.projectSearch, payload);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getProjectAmenities = async (id: number): Promise<Amenity[]> => {
    const response = await this.apiClient.get(ENDPOINTS.projectAmenities(id));
    return ObjectMapper.deserializeArray(Amenity, response);
  };

  public getSocietyReminders = async (id: number): Promise<SocietyReminder> => {
    const response = await this.apiClient.get(ENDPOINTS.societyReminders(id));
    return ObjectMapper.deserialize(SocietyReminder, response);
  };
}

const propertyRepository = new PropertyRepository();
export { propertyRepository as PropertyRepository };
