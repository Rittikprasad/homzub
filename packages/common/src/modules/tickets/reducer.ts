import { ReducerUtils } from '@homzhub/common/src/utils/ReducerUtils';
import { TicketActionPayloadTypes, TicketActionTypes } from '@homzhub/common/src//modules/tickets/actions';
import { IInvoiceSummary } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { ITicket } from '@homzhub/common/src/domain/models/Ticket';
import { ITicketAction } from '@homzhub/common/src/domain/models/TicketAction';
import { IQuoteCategory } from '@homzhub/common/src/domain/models/QuoteCategory';
import { IRequestedQuote } from '@homzhub/common/src/domain/models/RequestedQuote';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ICurrentTicket, ITicketState } from '@homzhub/common/src/modules/tickets/interface';
import { IDocumentSource } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { IQuoteGroup } from '@homzhub/common/src/constants/ServiceTickets';

export const initialTicketState: ITicketState = {
  proofAttachment: [],
  proofAttachmentWeb: [],
  currentTicket: null,
  tickets: [],
  ticketDetail: null,
  invoiceSummary: null,
  quoteAttachment: [],
  quotes: [],
  quotesCategory: [],
  ticketActions: [],
  quoteRequests: [],
  loaders: {
    tickets: false,
    ticketDetail: false,
    invoiceSummary: false,
    closeTicket: false,
    ticketReminder: false,
    reassignTicket: false,
    requestQuote: false,
    quotesCategory: false,
    submitQuote: false,
    ticketActions: false,
    quoteRequests: false,
    approveQuote: false,
    moreQuote: false,
  },
};

export const ticketReducer = (
  state: ITicketState = initialTicketState,
  action: IFluxStandardAction<TicketActionPayloadTypes>
): ITicketState => {
  switch (action.type) {
    case TicketActionTypes.SET.PROOF_ATTACHMENT:
      return {
        ...state,
        ['proofAttachment']: [...state.proofAttachment, ...(action.payload as any)],
      };
    case TicketActionTypes.SET.PROOF_ATTACHMENT_WEB:
      return {
        ...state,
        ['proofAttachmentWeb']: [...state.proofAttachmentWeb, ...(action.payload as File[])],
      };
    case TicketActionTypes.REMOVE_ATTACHMENT:
      return {
        ...state,
        ['proofAttachment']: ReducerUtils.removeAttachment(action.payload as string, state.proofAttachment),
      };
    case TicketActionTypes.GET.TICKETS:
      return {
        ...state,
        ['tickets']: [],
        ['loaders']: { ...state.loaders, ['tickets']: true },
      };
    case TicketActionTypes.GET.TICKETS_SUCCESS:
      return {
        ...state,
        ['tickets']: [...(action.payload as ITicket[])],
        ['loaders']: { ...state.loaders, ['tickets']: false },
      };
    case TicketActionTypes.GET.TICKETS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['tickets']: false },
      };
    case TicketActionTypes.SET.CURRENT_TICKET:
      return {
        ...state,
        ['currentTicket']: action.payload as ICurrentTicket,
      };
    case TicketActionTypes.GET.TICKET_DETAIL:
      return {
        ...state,
        ['ticketDetail']: initialTicketState.ticketDetail,
        ['currentTicket']: initialTicketState.currentTicket,
        ['loaders']: { ...state.loaders, ['ticketDetail']: true },
      };
    case TicketActionTypes.GET.TICKET_DETAIL_SUCCESS:
      return {
        ...state,
        ['ticketDetail']: action.payload as ITicket,
        ['loaders']: { ...state.loaders, ['ticketDetail']: false },
      };
    case TicketActionTypes.GET.TICKET_DETAIL_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['ticketDetail']: false },
      };
    case TicketActionTypes.POST.INVOICE_SUMMARY:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['invoiceSummary']: true },
      };
    case TicketActionTypes.POST.INVOICE_SUMMARY_SUCCESS:
      return {
        ...state,
        ['invoiceSummary']: action.payload as IInvoiceSummary,
        ['loaders']: { ...state.loaders, ['invoiceSummary']: false },
      };
    case TicketActionTypes.POST.INVOICE_SUMMARY_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['invoiceSummary']: false },
      };
    case TicketActionTypes.CLOSE_TICKET:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['closeTicket']: true },
      };
    case TicketActionTypes.CLOSE_TICKET_SUCCESS:
    case TicketActionTypes.CLOSE_TICKET_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['closeTicket']: false },
      };
    case TicketActionTypes.SEND_TICKET_REMINDER:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['ticketReminder']: true },
      };
    case TicketActionTypes.HANDLE_TICKET_REMINDER_SENT:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['ticketReminder']: false },
      };
    case TicketActionTypes.POST.REASSIGN_TICKET:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reassignTicket']: true },
      };
    case TicketActionTypes.POST.REASSIGN_TICKET_SUCCESS:
    case TicketActionTypes.POST.REASSIGN_TICKET_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reassignTicket']: false },
      };
    case TicketActionTypes.POST.REQUEST_QUOTE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['requestQuote']: true },
      };
    case TicketActionTypes.POST.REQUEST_QUOTE_SUCCESS:
    case TicketActionTypes.POST.REQUEST_QUOTE_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['requestQuote']: false },
      };
    case TicketActionTypes.SET.QUOTE_ATTACHMENT:
      return {
        ...state,
        ['quoteAttachment']: action.payload as IDocumentSource[] | File[],
      };
    case TicketActionTypes.SET.QUOTE:
      return {
        ...state,
        ['quotes']: action.payload as IQuoteGroup[],
      };
    case TicketActionTypes.GET.QUOTES_CATEGORY:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['quotesCategory']: true },
      };
    case TicketActionTypes.GET.QUOTES_CATEGORY_SUCCESS:
      return {
        ...state,
        ['quotesCategory']: action.payload as IQuoteCategory[],
        ['loaders']: { ...state.loaders, ['quotesCategory']: false },
      };
    case TicketActionTypes.GET.QUOTES_CATEGORY_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['quotesCategory']: false },
      };
    case TicketActionTypes.POST.SUBMIT_QUOTE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['submitQuote']: true },
      };
    case TicketActionTypes.POST.SUBMIT_QUOTE_SUCCESS:
    case TicketActionTypes.POST.SUBMIT_QUOTE_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['submitQuote']: false },
      };
    case TicketActionTypes.GET.TICKET_ACTIONS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['ticketActions']: true },
      };
    case TicketActionTypes.GET.TICKET_ACTIONS_SUCCESS:
      return {
        ...state,
        ['ticketActions']: action.payload as ITicketAction[],
        ['loaders']: { ...state.loaders, ['ticketActions']: false },
      };
    case TicketActionTypes.GET.TICKET_ACTIONS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['ticketActions']: false },
      };
    case TicketActionTypes.CLEAR_STATE:
      return {
        ...state,
        proofAttachment: initialTicketState.proofAttachment,
        currentTicket: initialTicketState.currentTicket,
        ticketActions: initialTicketState.ticketActions,
      };
    case TicketActionTypes.GET.QUOTES_REQUEST:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['quoteRequests']: true },
      };
    case TicketActionTypes.GET.QUOTES_REQUEST_SUCCESS:
      return {
        ...state,
        ['quoteRequests']: action.payload as IRequestedQuote[],
        ['loaders']: { ...state.loaders, ['quoteRequests']: false },
      };
    case TicketActionTypes.GET.QUOTES_REQUEST_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['quoteRequests']: false },
      };
    case TicketActionTypes.POST.APPROVE_QUOTE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['approveQuote']: true },
      };
    case TicketActionTypes.POST.APPROVE_QUOTE_SUCCESS:
    case TicketActionTypes.POST.APPROVE_QUOTE_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['approveQuote']: false },
      };
    case TicketActionTypes.POST.REQUEST_MORE_QUOTE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['moreQuote']: true },
      };
    case TicketActionTypes.POST.REQUEST_MORE_QUOTE_SUCCESS:
    case TicketActionTypes.POST.REQUEST_MORE_QUOTE_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['moreQuote']: false },
      };
    default:
      return {
        ...state,
      };
  }
};
