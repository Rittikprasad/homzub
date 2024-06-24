import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { CarpetArea } from '@homzhub/common/src/domain/models/CarpetArea';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { DeepLink } from '@homzhub/common/src/domain/models/DeepLink';
import { MarketTrends } from '@homzhub/common/src/domain/models/MarketTrends';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { Pillar, PillarTypes } from '@homzhub/common/src/domain/models/Pillar';
import { SocialAuthProvider } from '@homzhub/common/src/domain/models/SocialAuthProvider';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { CaseLog } from '@homzhub/common/src/domain/models/CaseLog';
import { User } from '@homzhub/common/src/domain/models/User';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IMarketTrendParams,
  ISubscribeToNewsletterPayload,
  ISupportPayload,
  IDeviceTokenPayload,
  ILimitedOfferPayload,
  IDeepLinkBody,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { SocialAuthProviders } from '@homzhub/common/src/constants/SocialAuthProviders';

const ENDPOINTS = {
  getCountryCodes: 'v1/countries/',
  getCurrencyCodes: 'v1/currency-codes/',
  carpetAreaUnits: 'v1/carpet-area-units/',
  maintenanceUnits: 'v1/list-of-values/maintenance-units/',
  onBoarding: 'v3/onboardings/',
  supportCategories: 'v1/list-of-values/client-support-categories/',
  supportContact: 'v1/client-support/contacts/',
  clientSupport: 'v1/client-support/',
  getMarketTrends: 'v1/market-trends/',
  getPillars: 'v1/pillars/',
  subscribeToNewsLetter: 'v1/newslettters/subscriptions/',
  updateMarketTrends: (id: number): string => `v1/market-trends/${id}/`,
  postDeviceToken: (): string => 'v1/devices/',
  deepLinks: 'v1/deep-links',
};

class CommonRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getCountryCodes = async (): Promise<Country[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getCountryCodes);
    return ObjectMapper.deserializeArray(Country, response);
  };

  public getCurrencyCodes = async (): Promise<Currency[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getCurrencyCodes);
    return ObjectMapper.deserializeArray(Currency, response);
  };

  public getCarpetAreaUnits = async (): Promise<CarpetArea[]> => {
    const response = await this.apiClient.get(ENDPOINTS.carpetAreaUnits);
    return ObjectMapper.deserializeArray(CarpetArea, response);
  };

  public getOnBoarding = async (): Promise<OnBoarding[]> => {
    const response = await this.apiClient.get(ENDPOINTS.onBoarding);
    return ObjectMapper.deserializeArray(OnBoarding, response);
  };

  public getSocialMedia = (): SocialAuthProvider[] => {
    return ObjectMapper.deserializeArray(SocialAuthProvider, SocialAuthProviders);
  };

  public getMaintenanceUnits = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.maintenanceUnits);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getSupportCategories = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.supportCategories);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getSupportContacts = async (): Promise<User> => {
    const response = await this.apiClient.get(ENDPOINTS.supportContact);
    return ObjectMapper.deserialize(User, response);
  };

  public getClientSupport = async (): Promise<CaseLog[]> => {
    const response = await this.apiClient.get(ENDPOINTS.clientSupport);
    return ObjectMapper.deserializeArray(CaseLog, response);
  };

  public subscribeToNewsLetter = async (
    payload: ISubscribeToNewsletterPayload | ILimitedOfferPayload
  ): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.subscribeToNewsLetter, payload);
  };

  public postClientSupport = async (payload: ISupportPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.clientSupport, payload);
  };

  public getMarketTrends = async (params: IMarketTrendParams): Promise<MarketTrends> => {
    const response = await this.apiClient.get(ENDPOINTS.getMarketTrends, params);
    return ObjectMapper.deserialize(MarketTrends, response);
  };

  public updateMarketTrends = async (id: number): Promise<void> => {
    await this.apiClient.patch(ENDPOINTS.updateMarketTrends(id));
  };

  public getPillars = async (reviewType: PillarTypes): Promise<Pillar[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getPillars, {
      review_type: reviewType,
    });
    return ObjectMapper.deserializeArray(Pillar, response);
  };

  public postDeviceToken = async (requestBody: IDeviceTokenPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.postDeviceToken(), requestBody);
  };

  public getDeepLink = async (requestBody: IDeepLinkBody): Promise<DeepLink> => {
    const response = await this.apiClient.post(ENDPOINTS.deepLinks, requestBody);
    return ObjectMapper.deserialize(DeepLink, response);
  };
}

const commonRepository = new CommonRepository();
export { commonRepository as CommonRepository };
