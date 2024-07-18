import { ObjectMapper } from "@homzhub/common/src/utils/ObjectMapper";
import {
  IInvoiceSummary,
  InvoiceSummary,
} from "@homzhub/common/src/domain/models/InvoiceSummary";
import { ITicket, Ticket } from "@homzhub/common/src/domain/models/Ticket";
import {
  ITicketAction,
  TicketAction,
} from "@homzhub/common/src/domain/models/TicketAction";
import {
  IQuoteCategory,
  QuoteCategory,
} from "@homzhub/common/src/domain/models/QuoteCategory";
import {
  IRequestedQuote,
  RequestedQuote,
} from "@homzhub/common/src/domain/models/RequestedQuote";
import { IFluxStandardAction } from "@homzhub/common/src/modules/interfaces";
import {
  IGetTicketParam,
  IInvoiceSummaryPayload,
  IQuoteParam,
  IRequestMorePayload,
} from "@homzhub/common/src/domain/repositories/interfaces";
import {
  IApproveQuote,
  ICurrentTicket,
  IReassignTicket,
  IRequestQuote,
  ISubmitQuote,
} from "@homzhub/common/src/modules/tickets/interface";
import {
  IDocumentSource,
  IImageSource,
} from "@homzhub/common/src/services/AttachmentService/interfaces";
import { IFile } from "@homzhub/common/src/constants/AttachmentTypes";
import { IQuoteGroup } from "@homzhub/common/src/constants/ServiceTickets";

const actionTypePrefix = "Ticket/";
export const TicketActionTypes = {
  GET: {
    TICKETS: `${actionTypePrefix}TICKETS`,
    TICKETS_SUCCESS: `${actionTypePrefix}TICKETS_SUCCESS`,
    TICKETS_FAILURE: `${actionTypePrefix}TICKETS_FAILURE`,
    TICKET_DETAIL: `${actionTypePrefix}TICKET_DETAIL`,
    TICKET_DETAIL_SUCCESS: `${actionTypePrefix}TICKET_DETAIL_SUCCESS`,
    TICKET_DETAIL_FAILURE: `${actionTypePrefix}TICKET_DETAIL_FAILURE`,
    QUOTES_CATEGORY: `${actionTypePrefix}QUOTES_CATEGORY`,
    QUOTES_CATEGORY_SUCCESS: `${actionTypePrefix}QUOTES_CATEGORY_SUCCESS`,
    QUOTES_CATEGORY_FAILURE: `${actionTypePrefix}QUOTES_CATEGORY_FAILURE`,
    TICKET_ACTIONS: `${actionTypePrefix}TICKET_ACTIONS`,
    TICKET_ACTIONS_SUCCESS: `${actionTypePrefix}TICKET_ACTIONS_SUCCESS`,
    TICKET_ACTIONS_FAILURE: `${actionTypePrefix}TICKET_ACTIONS_FAILURE`,
    QUOTES_REQUEST: `${actionTypePrefix}QUOTES_REQUEST`,
    QUOTES_REQUEST_SUCCESS: `${actionTypePrefix}QUOTES_REQUEST_SUCCESS`,
    QUOTES_REQUEST_FAILURE: `${actionTypePrefix}QUOTES_REQUEST_FAILURE`,
  },
  POST: {
    INVOICE_SUMMARY: `${actionTypePrefix}INVOICE_SUMMARY`,
    INVOICE_SUMMARY_SUCCESS: `${actionTypePrefix}INVOICE_SUMMARY_SUCCESS`,
    INVOICE_SUMMARY_FAILURE: `${actionTypePrefix}INVOICE_SUMMARY_FAILURE`,
    REASSIGN_TICKET: `${actionTypePrefix}REASSIGN_TICKET`,
    REASSIGN_TICKET_SUCCESS: `${actionTypePrefix}REASSIGN_TICKET_SUCCESS`,
    REASSIGN_TICKET_FAILURE: `${actionTypePrefix}REASSIGN_TICKET_FAILURE`,
    REQUEST_QUOTE: `${actionTypePrefix}REQUEST_QUOTE`,
    REQUEST_QUOTE_SUCCESS: `${actionTypePrefix}REQUEST_QUOTE_SUCCESS`,
    REQUEST_QUOTE_FAILURE: `${actionTypePrefix}REQUEST_QUOTE_FAILURE`,
    SUBMIT_QUOTE: `${actionTypePrefix}SUBMIT_QUOTE`,
    SUBMIT_QUOTE_SUCCESS: `${actionTypePrefix}SUBMIT_QUOTE_SUCCESS`,
    SUBMIT_QUOTE_FAILURE: `${actionTypePrefix}SUBMIT_QUOTE_FAILURE`,
    APPROVE_QUOTE: `${actionTypePrefix}APPROVE_QUOTE`,
    APPROVE_QUOTE_SUCCESS: `${actionTypePrefix}APPROVE_QUOTE_SUCCESS`,
    APPROVE_QUOTE_FAILURE: `${actionTypePrefix}APPROVE_QUOTE_FAILURE`,
    REQUEST_MORE_QUOTE: `${actionTypePrefix}REQUEST_MORE_QUOTE`,
    REQUEST_MORE_QUOTE_SUCCESS: `${actionTypePrefix}REQUEST_MORE_QUOTE_SUCCESS`,
    REQUEST_MORE_QUOTE_FAILURE: `${actionTypePrefix}REQUEST_MORE_QUOTE_FAILURE`,
  },
  SET: {
    PROOF_ATTACHMENT: `${actionTypePrefix}PROOF_ATTACHMENT`,
    PROOF_ATTACHMENT_WEB: `${actionTypePrefix}PROOF_ATTACHMENT_WEB`,
    CURRENT_TICKET: `${actionTypePrefix}CURRENT_TICKET`,
    QUOTE_ATTACHMENT: `${actionTypePrefix}QUOTE_ATTACHMENT`,
    QUOTE: `${actionTypePrefix}QUOTE`,
  },
  CLOSE_TICKET: `${actionTypePrefix}CLOSE_TICKET`,
  CLOSE_TICKET_SUCCESS: `${actionTypePrefix}CLOSE_TICKET_SUCCESS`,
  CLOSE_TICKET_FAILURE: `${actionTypePrefix}CLOSE_TICKET_FAILURE`,
  REMOVE_ATTACHMENT: `${actionTypePrefix}REMOVE_ATTACHMENT`,
  SEND_TICKET_REMINDER: `${actionTypePrefix}SEND_TICKET_REMINDER`,
  HANDLE_TICKET_REMINDER_SENT: `${actionTypePrefix}HANDLE_TICKET_REMINDER_SENT`,
  CLEAR_STATE: `${actionTypePrefix}CLEAR_STATE`,
};

const setAttachment = (
  payload: IImageSource[] | IFile[]
): IFluxStandardAction<IImageSource[] | IFile[]> => ({
  type: TicketActionTypes.SET.PROOF_ATTACHMENT,
  payload,
});

const setAttachmentWeb = (payload: File[]): IFluxStandardAction<File[]> => ({
  type: TicketActionTypes.SET.PROOF_ATTACHMENT_WEB,
  payload,
});

const removeAttachment = (key: string): IFluxStandardAction<string> => ({
  type: TicketActionTypes.REMOVE_ATTACHMENT,
  payload: key,
});

const clearState = (): IFluxStandardAction => ({
  type: TicketActionTypes.CLEAR_STATE,
});

const getTickets = (
  payload?: IGetTicketParam
): IFluxStandardAction<IGetTicketParam> => ({
  type: TicketActionTypes.GET.TICKETS,
  payload,
});

const getTicketsSuccess = (
  payload: Ticket[]
): IFluxStandardAction<ITicket[]> => ({
  type: TicketActionTypes.GET.TICKETS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getTicketsFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.GET.TICKETS_FAILURE,
});

const setCurrentTicket = (
  payload: ICurrentTicket
): IFluxStandardAction<ICurrentTicket> => ({
  type: TicketActionTypes.SET.CURRENT_TICKET,
  payload,
});

const getTicketDetail = (payload: number): IFluxStandardAction<number> => ({
  type: TicketActionTypes.GET.TICKET_DETAIL,
  payload,
});

const getTicketDetailSuccess = (
  payload: Ticket
): IFluxStandardAction<ITicket> => ({
  type: TicketActionTypes.GET.TICKET_DETAIL_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getTicketDetailFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.GET.TICKET_DETAIL_FAILURE,
});

const getInvoiceSummary = (
  payload: IInvoiceSummaryPayload
): IFluxStandardAction<IInvoiceSummaryPayload> => ({
  type: TicketActionTypes.POST.INVOICE_SUMMARY,
  payload,
});

const getInvoiceSummarySuccess = (
  payload: InvoiceSummary
): IFluxStandardAction<IInvoiceSummary> => ({
  type: TicketActionTypes.POST.INVOICE_SUMMARY_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getInvoiceSummaryFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.POST.INVOICE_SUMMARY_FAILURE,
});

const closeTicket = (payload?: boolean): IFluxStandardAction<boolean> => ({
  type: TicketActionTypes.CLOSE_TICKET,
  payload,
});

const closeTicketSuccess = (): IFluxStandardAction => ({
  type: TicketActionTypes.CLOSE_TICKET_SUCCESS,
});

const closeTicketFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.CLOSE_TICKET_FAILURE,
});

const sendTicketReminder = (): IFluxStandardAction => ({
  type: TicketActionTypes.SEND_TICKET_REMINDER,
});

const handleTicketReminderSent = (): IFluxStandardAction => ({
  type: TicketActionTypes.HANDLE_TICKET_REMINDER_SENT,
});

const reassignTicket = (
  payload: IReassignTicket
): IFluxStandardAction<IReassignTicket> => ({
  type: TicketActionTypes.POST.REASSIGN_TICKET,
  payload,
});

const reassignTicketSuccess = (): IFluxStandardAction => ({
  type: TicketActionTypes.POST.REASSIGN_TICKET_SUCCESS,
});

const reassignTicketFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.POST.REASSIGN_TICKET_FAILURE,
});

const requestQuote = (
  payload: IRequestQuote
): IFluxStandardAction<IRequestQuote> => ({
  type: TicketActionTypes.POST.REQUEST_QUOTE,
  payload,
});

const requestQuoteSuccess = (): IFluxStandardAction => ({
  type: TicketActionTypes.POST.REQUEST_QUOTE_SUCCESS,
});

const requestQuoteFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.POST.REQUEST_QUOTE_FAILURE,
});

const setQuoteAttachment = (
  payload: any
): IFluxStandardAction<IDocumentSource[] | File[]> => ({
  type: TicketActionTypes.SET.QUOTE_ATTACHMENT,
  payload,
});

const setQuotes = (
  payload: IQuoteGroup[]
): IFluxStandardAction<IQuoteGroup[]> => ({
  type: TicketActionTypes.SET.QUOTE,
  payload,
});

const getQuoteCategory = (
  payload: IQuoteParam
): IFluxStandardAction<IQuoteParam> => ({
  type: TicketActionTypes.GET.QUOTES_CATEGORY,
  payload,
});

const getQuoteCategorySuccess = (
  payload: QuoteCategory[]
): IFluxStandardAction<IQuoteCategory[]> => ({
  type: TicketActionTypes.GET.QUOTES_CATEGORY_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getQuoteCategoryFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.GET.QUOTES_CATEGORY_FAILURE,
});

const submitQuote = (
  payload: ISubmitQuote
): IFluxStandardAction<ISubmitQuote> => ({
  type: TicketActionTypes.POST.SUBMIT_QUOTE,
  payload,
});

const submitQuoteSuccess = (): IFluxStandardAction => ({
  type: TicketActionTypes.POST.SUBMIT_QUOTE_SUCCESS,
});

const submitQuoteFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.POST.SUBMIT_QUOTE_FAILURE,
});

const getTicketActions = (payload: number): IFluxStandardAction<number> => ({
  type: TicketActionTypes.GET.TICKET_ACTIONS,
  payload,
});

const getTicketActionsSuccess = (
  payload: TicketAction[]
): IFluxStandardAction<ITicketAction[]> => ({
  type: TicketActionTypes.GET.TICKET_ACTIONS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getTicketActionsFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.GET.TICKET_ACTIONS_FAILURE,
});

const getQuoteRequests = (
  payload: IQuoteParam
): IFluxStandardAction<IQuoteParam> => ({
  type: TicketActionTypes.GET.QUOTES_REQUEST,
  payload,
});

const getQuoteRequestsSuccess = (
  payload: RequestedQuote[]
): IFluxStandardAction<IRequestedQuote[]> => ({
  type: TicketActionTypes.GET.QUOTES_REQUEST_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getQuoteRequestsFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.GET.QUOTES_REQUEST_FAILURE,
});

const approveQuote = (
  payload: IApproveQuote
): IFluxStandardAction<IApproveQuote> => ({
  type: TicketActionTypes.POST.APPROVE_QUOTE,
  payload,
});

const approveQuoteSuccess = (): IFluxStandardAction => ({
  type: TicketActionTypes.POST.APPROVE_QUOTE_SUCCESS,
});

const approveQuoteFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.POST.APPROVE_QUOTE_FAILURE,
});

const requestMoreQuote = (
  payload: IRequestMorePayload
): IFluxStandardAction<IRequestMorePayload> => ({
  type: TicketActionTypes.POST.REQUEST_MORE_QUOTE,
  payload,
});

const requestMoreQuoteSuccess = (): IFluxStandardAction => ({
  type: TicketActionTypes.POST.REQUEST_MORE_QUOTE_SUCCESS,
});

const requestMoreQuoteFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.POST.REQUEST_MORE_QUOTE_FAILURE,
});

export type TicketActionPayloadTypes =
  | string[]
  | string
  | number
  | ITicket[]
  | ICurrentTicket
  | ITicket
  | IGetTicketParam
  | IImageSource[]
  | IInvoiceSummaryPayload
  | IInvoiceSummary
  | IReassignTicket
  | IRequestQuote
  | IDocumentSource[]
  | IQuoteGroup[]
  | IQuoteParam
  | IQuoteCategory[]
  | ISubmitQuote
  | ITicketAction[]
  | IApproveQuote
  | IRequestMorePayload
  | RequestedQuote[]
  | IRequestedQuote[]
  | File[]
  | IFile[];

export const TicketActions = {
  setAttachment,
  setAttachmentWeb,
  removeAttachment,
  clearState,
  getTickets,
  getTicketsSuccess,
  getTicketDetail,
  getTicketDetailSuccess,
  getTicketDetailFailure,
  setCurrentTicket,
  getTicketsFailure,
  getInvoiceSummary,
  getInvoiceSummarySuccess,
  getInvoiceSummaryFailure,
  closeTicket,
  closeTicketSuccess,
  closeTicketFailure,
  sendTicketReminder,
  handleTicketReminderSent,
  reassignTicket,
  reassignTicketSuccess,
  reassignTicketFailure,
  requestQuote,
  requestQuoteSuccess,
  requestQuoteFailure,
  setQuoteAttachment,
  setQuotes,
  getQuoteCategory,
  getQuoteCategorySuccess,
  getQuoteCategoryFailure,
  submitQuote,
  submitQuoteSuccess,
  submitQuoteFailure,
  getTicketActions,
  getTicketActionsSuccess,
  getTicketActionsFailure,
  getQuoteRequests,
  getQuoteRequestsSuccess,
  getQuoteRequestsFailure,
  approveQuote,
  approveQuoteSuccess,
  approveQuoteFailure,
  requestMoreQuote,
  requestMoreQuoteSuccess,
  requestMoreQuoteFailure,
};
