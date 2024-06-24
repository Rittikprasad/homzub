import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { TicketAction } from '@homzhub/common/src/domain/models/TicketAction';
import { TicketCategory } from '@homzhub/common/src/domain/models/TicketCategory';
import { QuoteCategory } from '@homzhub/common/src/domain/models/QuoteCategory';
import { RequestedQuote } from '@homzhub/common/src/domain/models/RequestedQuote';
import {
  ICompleteTicketPayload,
  IGetTicketParam,
  IPostTicket,
  IPostTicketPayload,
  IQuoteApprovePayload,
  IQuoteParam,
  IQuoteRequestParam,
  IQuoteSubmitPayload,
  IReassignTicketParam,
  IRequestMorePayload,
  ISubmitReview,
  IUpdateTicketWorkStatus,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';

const ENDPOINTS = {
  ticket: 'v1/tickets/',
  ticketCategories: 'v1/ticket-categories/',
  quoteRequestById: (param: IQuoteParam): string =>
    `v1/tickets/${param.ticketId}/quote-requests/${param.quoteRequestId}/`,
  quoteRequestCategory: (param: IQuoteParam): string =>
    `v1/tickets/${param.ticketId}/quote-requests/${param.quoteRequestId}/quote-request-categories/`,
  quoteSubmit: (param: IQuoteParam): string =>
    `v1/tickets/${param.ticketId}/quote-requests/${param.quoteRequestId}/quote-submit-group/`,
  reviewSubmit: (ticketId: number): string => `v1/tickets/${ticketId}/reviews/`,
  quoteApprove: (param: IQuoteParam): string => `v1/tickets/${param.ticketId}/quote-approved-group/`,
  ticketById: (ticketId: number): string => `v1/tickets/${ticketId}/`,
  reassignTicket: (ticketId: number): string => `v1/tickets/${ticketId}/ticket-users/`,
  quoteRequest: (ticketId: number): string => `v1/tickets/${ticketId}/quote-requests/`,
  reviewById: (ticketId: number, reviewId?: number): string => `v1/tickets/${ticketId}/reviews/${reviewId}/`,
  ticketActions: (ticketId: number): string => `v1/tickets/${ticketId}/actions/`,
  requestedQuote: (param: IQuoteParam): string =>
    `v1/tickets/${param.ticketId}/quote-requests/${param.quoteRequestId}/quotes/`,
};

class TicketRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public postTicket = async (requestPayload: IPostTicketPayload): Promise<IPostTicket> => {
    return await this.apiClient.post(ENDPOINTS.ticket, requestPayload);
  };

  public getTicketCategories = async (): Promise<TicketCategory[]> => {
    const response = await this.apiClient.get(ENDPOINTS.ticketCategories);
    return ObjectMapper.deserializeArray(TicketCategory, response);
  };

  public getTickets = async (param?: IGetTicketParam): Promise<Ticket[]> => {
    const response = await this.apiClient.get(ENDPOINTS.ticket, param);
    return ObjectMapper.deserializeArray(Ticket, response);
  };

  public getTicketDetail = async (payload: number): Promise<Ticket> => {
    const response = await this.apiClient.get(ENDPOINTS.ticketById(payload));
    return ObjectMapper.deserialize(Ticket, response);
  };

  public getQuoteRequestCategory = async (param: IQuoteParam): Promise<QuoteCategory[]> => {
    const response = await this.apiClient.get(ENDPOINTS.quoteRequestCategory(param));
    return ObjectMapper.deserializeArray(QuoteCategory, response);
  };

  public quoteSubmit = async (payload: IQuoteSubmitPayload): Promise<void> => {
    const { param, data } = payload;
    return await this.apiClient.post(ENDPOINTS.quoteSubmit(param), data);
  };

  public reviewSubmit = async (payload: ISubmitReview): Promise<void> => {
    const { param, data } = payload;
    return await this.apiClient.post(ENDPOINTS.reviewSubmit(param.ticketId), data);
  };

  public getRequestedQuote = async (param: IQuoteParam): Promise<RequestedQuote[]> => {
    const response = await this.apiClient.get(ENDPOINTS.requestedQuote(param));
    return ObjectMapper.deserializeArray(RequestedQuote, response);
  };

  public quoteApprove = async (payload: IQuoteApprovePayload): Promise<void> => {
    const { param, data } = payload;
    return await this.apiClient.post(ENDPOINTS.quoteApprove(param), data);
  };

  public completeTicket = async (payload: ICompleteTicketPayload): Promise<void> => {
    const { param, data } = payload;
    return await this.apiClient.patch(ENDPOINTS.ticketById(param.ticketId), data);
  };

  public reassignTicket = async (ticketId: number, payload: IReassignTicketParam): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.reassignTicket(ticketId), payload);
  };

  public requestQuote = async (ticketId: number, payload: IQuoteRequestParam): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.quoteRequest(ticketId), payload);
  };

  public updateTicketStatusById = async (ticketId: number, payload: IUpdateTicketWorkStatus): Promise<void> => {
    return await this.apiClient.patch(ENDPOINTS.ticketById(ticketId), payload);
  };

  public updateReviewById = async (payload: ISubmitReview): Promise<void> => {
    const {
      param: { ticketId, reviewId },
      data,
    } = payload;
    return await this.apiClient.put(ENDPOINTS.reviewById(ticketId, reviewId), data);
  };

  public getTicketReview = async (ticketId: number, reviewId: number): Promise<AssetReview> => {
    const response = await this.apiClient.get(ENDPOINTS.reviewById(ticketId, reviewId));
    return ObjectMapper.deserialize(AssetReview, response);
  };

  public getTicketActions = async (ticketId: number): Promise<TicketAction[]> => {
    const response = await this.apiClient.get(ENDPOINTS.ticketActions(ticketId));
    return ObjectMapper.deserializeArray(TicketAction, response);
  };

  public requestMoreQuote = async (payload: IRequestMorePayload): Promise<void> => {
    const { data, param } = payload;
    return await this.apiClient.patch(ENDPOINTS.quoteRequestById(param), data);
  };
}

const ticketRepository = new TicketRepository();
export { ticketRepository as TicketRepository };
