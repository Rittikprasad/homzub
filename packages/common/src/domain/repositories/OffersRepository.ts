import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { ProspectProfile } from '@homzhub/common/src/domain/models/ProspectProfile';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import { OfferManagement } from '@homzhub/common/src/domain/models/OfferManagement';
import { OfferFilter } from '@homzhub/common/src/domain/models/OfferFilter';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { Message } from '@homzhub/common/src/domain/models/Message';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { ICurrentOffer } from '@homzhub/common/src/modules/offers/interfaces';
import {
  ICounterOffer,
  ICounterParam,
  ICreateLeasePayload,
  INegotiation,
  INegotiationParam,
  INegotiationPayload,
  IOfferManagementParam,
  IPostOfferLease,
  IPostOfferSell,
  IPropertyNegotiationParam,
  ISubmitOffer,
  IUpdateProspectProfile,
  NegotiationOfferType,
  OfferFilterType,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';

const ENDPOINTS = {
  prospects: 'v1/prospects/',
  offerManagement: 'v1/offers/management-tab/',
  tenantTypes: 'v1/list-of-values/prospect-tenant-types/',
  jobTypes: 'v1/list-of-values/user-employer-job-types/',
  negotiations: (param: INegotiationParam): string =>
    `v1/${param.listingType}/${param.listingId}/${param.negotiationType}/`,
  listingNegotiations: (param: INegotiationParam): string =>
    `v1/${param.listingType}/${param.listingId}/${param.negotiationType}/${param.negotiationId}/`,
  negotiationOffers: (type: NegotiationOfferType): string => `v1/listings-negotiations/${type}/`,
  offerFilters: (type: OfferFilterType): string => `v1/filters/${type}/`,
  counter: (param: ICounterParam): string => `v1/${param.negotiationType}/${param.negotiationId}/counter-negotiations/`,
  createLease: (negotiationId: number): string => `v1/lease-negotiations/${negotiationId}/lease-transactions/`,
  offerCommentThread: (param: ICurrentOffer, key?: string): string =>
    `v1/${param.type}/${param.listingId}/negotiation-comment-thread-groups/${param.threadId}/${key ?? ''}`,
};

class OffersRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getProspectsInfo = async (): Promise<ProspectProfile> => {
    const response = await this.apiClient.get(ENDPOINTS.prospects);
    return ObjectMapper.deserialize(ProspectProfile, response);
  };

  public getTenantTypes = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.tenantTypes);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getJobType = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.jobTypes);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public updateProspects = async (body: IUpdateProspectProfile): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.prospects, body);
  };

  public postOffer = async (payload: ISubmitOffer): Promise<IPostOfferLease | IPostOfferSell> => {
    const { param, data } = payload;
    return await this.apiClient.post(ENDPOINTS.negotiations(param), data);
  };

  public updateNegotiation = async (payload: INegotiationPayload): Promise<void> => {
    const { param, data } = payload;
    return await this.apiClient.patch(ENDPOINTS.listingNegotiations(param), data);
  };

  public getOffers = async (payload: IPropertyNegotiationParam): Promise<Asset[]> => {
    const { type, params } = payload;
    const response = await this.apiClient.get(ENDPOINTS.negotiationOffers(type), params);
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public getOfferData = async (params?: IOfferManagementParam): Promise<OfferManagement> => {
    const response = await this.apiClient.get(ENDPOINTS.offerManagement, params);
    return ObjectMapper.deserialize(OfferManagement, response);
  };

  public getOfferFilters = async (type: OfferFilterType): Promise<OfferFilter> => {
    const response = await this.apiClient.get(ENDPOINTS.offerFilters(type));
    return ObjectMapper.deserialize(OfferFilter, response);
  };

  public getNegotiations = async (payload: INegotiation): Promise<Offer[]> => {
    const { param, filter_by } = payload;
    const response = await this.apiClient.get(ENDPOINTS.negotiations(param), filter_by && { filter_by });
    return ObjectMapper.deserializeArray(Offer, response);
  };

  public counterOffer = async (payload: ICounterOffer): Promise<IPostOfferLease | IPostOfferSell> => {
    const { param, data } = payload;
    return await this.apiClient.post(ENDPOINTS.counter(param), data);
  };

  public getCounterOffer = async (param: ICounterParam): Promise<Offer[]> => {
    const response = await this.apiClient.get(ENDPOINTS.counter(param));
    return ObjectMapper.deserializeArray(Offer, response);
  };

  public createLease = async (payload: ICreateLeasePayload): Promise<void> => {
    const { negotiationId, body } = payload;
    return await this.apiClient.post(ENDPOINTS.createLease(negotiationId), body);
  };

  public getUsersInOfferThread = async (payload: ICurrentOffer): Promise<GroupMessage> => {
    const response = await this.apiClient.get(ENDPOINTS.offerCommentThread(payload));
    return ObjectMapper.deserialize(GroupMessage, response);
  };

  public getNegotiationComments = async (payload: ICurrentOffer): Promise<Message[]> => {
    const response = await this.apiClient.get(ENDPOINTS.offerCommentThread(payload, 'comments/'));
    return ObjectMapper.deserializeArray(Message, response);
  };

  public postNegotiationComments = async (payload: ICurrentOffer, comment: string): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.offerCommentThread(payload, 'comments/'), { comment });
  };
}

const offersRepository = new OffersRepository();
export { offersRepository as OffersRepository };
