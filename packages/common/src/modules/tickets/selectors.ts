import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { InvoiceSummary } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { TicketAction } from '@homzhub/common/src/domain/models/TicketAction';
import { QuoteCategory } from '@homzhub/common/src/domain/models/QuoteCategory';
import { RequestedQuote } from '@homzhub/common/src/domain/models/RequestedQuote';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ICurrentTicket, ITicketState } from '@homzhub/common/src/modules/tickets/interface';
import { IDocumentSource, IImageSource } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { IQuoteGroup } from '@homzhub/common/src/constants/ServiceTickets';
import { IFile } from '@homzhub/common/src/constants/AttachmentTypes';

const getProofAttachment = (state: IState): IImageSource[] | IFile[] => {
  const {
    ticket: { proofAttachment },
  } = state;
  return proofAttachment;
};

const getProofAttachmentWeb = (state: IState): File[] => {
  const {
    ticket: { proofAttachmentWeb },
  } = state;
  return proofAttachmentWeb;
};

const getTickets = (state: IState): Ticket[] => {
  const {
    ticket: { tickets },
  } = state;
  return ObjectMapper.deserializeArray(Ticket, tickets);
};

const getCurrentTicket = (state: IState): ICurrentTicket | null => {
  const {
    ticket: { currentTicket },
  } = state;
  return currentTicket;
};

const getTicketDetail = (state: IState): Ticket | null => {
  const {
    ticket: { ticketDetail },
  } = state;
  return ObjectMapper.deserialize(Ticket, ticketDetail);
};

const getTicketLoader = (state: IState): boolean => {
  const {
    ticket: { loaders },
  } = state;
  return loaders.tickets;
};

const getTicketDetailLoader = (state: IState): boolean => {
  const {
    ticket: { loaders },
  } = state;
  return loaders.ticketDetail;
};

const getTicketLoaders = (state: IState): ITicketState['loaders'] => {
  return state.ticket.loaders;
};

const getInvoiceSummary = (state: IState): InvoiceSummary | null => {
  const {
    ticket: { invoiceSummary },
  } = state;
  if (!invoiceSummary) return null;
  return ObjectMapper.deserialize(InvoiceSummary, invoiceSummary);
};

const getQuoteAttachment = (state: IState): IDocumentSource[] | File[] => {
  const {
    ticket: { quoteAttachment },
  } = state;
  if (!quoteAttachment) return [];
  return quoteAttachment;
};

const getQuotes = (state: IState): IQuoteGroup[] => {
  const {
    ticket: { quotes },
  } = state;
  if (!quotes) return [];
  return quotes;
};

const getQuotesCategory = (state: IState): QuoteCategory[] => {
  const {
    ticket: { quotesCategory },
  } = state;
  if (!quotesCategory) return [];
  return ObjectMapper.deserializeArray(QuoteCategory, quotesCategory);
};

const getTicketActions = (state: IState): TicketAction[] => {
  const {
    ticket: { ticketActions },
  } = state;
  if (!ticketActions) return [];
  return ObjectMapper.deserializeArray(TicketAction, ticketActions);
};

const getQuoteRequests = (state: IState): RequestedQuote[] => {
  const {
    ticket: { quoteRequests },
  } = state;
  if (!quoteRequests) return [];
  return ObjectMapper.deserializeArray(RequestedQuote, quoteRequests);
};

export const TicketSelectors = {
  getProofAttachment,
  getProofAttachmentWeb,
  getTickets,
  getCurrentTicket,
  getTicketDetail,
  getTicketLoader,
  getTicketDetailLoader,
  getTicketLoaders,
  getInvoiceSummary,
  getQuoteAttachment,
  getQuotes,
  getQuotesCategory,
  getTicketActions,
  getQuoteRequests,
};
