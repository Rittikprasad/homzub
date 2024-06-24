import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { IInvoiceSummary } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { ITicket } from '@homzhub/common/src/domain/models/Ticket';
import { ITicketAction } from '@homzhub/common/src/domain/models/TicketAction';
import { IQuoteCategory } from '@homzhub/common/src/domain/models/QuoteCategory';
import { IRequestedQuote } from '@homzhub/common/src/domain/models/RequestedQuote';
import { IOnCallback } from '@homzhub/common/src/modules/interfaces';
import { IDocumentSource, IImageSource } from '@homzhub/common/src/services/AttachmentService/interfaces';
import {
  IQuoteApprovePayload,
  IQuoteRequestParam,
  IQuoteSubmitPayload,
  IReassignTicketParam,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IFile } from '@homzhub/common/src/constants/AttachmentTypes';
import { IQuoteGroup } from '@homzhub/common/src/constants/ServiceTickets';

export interface ITicketState {
  proofAttachment: IImageSource[] | IFile[];
  proofAttachmentWeb: File[];
  currentTicket: ICurrentTicket | null;
  tickets: ITicket[];
  ticketDetail: ITicket | null;
  invoiceSummary: IInvoiceSummary | null;
  quoteAttachment: IDocumentSource[] | File[];
  quotes: IQuoteGroup[];
  quotesCategory: IQuoteCategory[];
  ticketActions: ITicketAction[];
  quoteRequests: IRequestedQuote[];
  loaders: {
    tickets: boolean;
    ticketDetail: boolean;
    invoiceSummary: boolean;
    closeTicket: boolean;
    ticketReminder: boolean;
    reassignTicket: boolean;
    requestQuote: boolean;
    quotesCategory: boolean;
    submitQuote: boolean;
    ticketActions: boolean;
    quoteRequests: boolean;
    approveQuote: boolean;
    moreQuote: boolean;
  };
}

export interface ICurrentTicket {
  ticketId: number;
  quoteRequestId?: number;
  propertyName?: string;
  currency?: Currency;
  assetId?: number;
  assignedUserId?: number;
}

export interface IReassignTicket extends IOnCallback {
  ticketId: number;
  payload: IReassignTicketParam;
}

export interface IRequestQuote extends IOnCallback {
  ticketId: number;
  payload: IQuoteRequestParam;
}

export interface ISubmitQuote extends IOnCallback {
  data: IQuoteSubmitPayload;
}

export interface IApproveQuote extends IOnCallback {
  data: IQuoteApprovePayload;
}
