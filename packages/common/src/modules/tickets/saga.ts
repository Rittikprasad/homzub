/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery, takeLatest } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PaymentRepository } from '@homzhub/common/src/domain/repositories/PaymentRepository';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { TicketActions, TicketActionTypes } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { QuoteCategory } from '@homzhub/common/src/domain/models/QuoteCategory';
import {
  IApproveQuote,
  ICurrentTicket,
  IReassignTicket,
  IRequestQuote,
  ISubmitQuote,
} from '@homzhub/common/src/modules/tickets/interface';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import {
  IGetTicketParam,
  IInvoiceSummaryPayload,
  IQuoteParam,
  IRequestMorePayload,
  IUpdateTicketWorkStatus,
  TicketAction,
} from '@homzhub/common/src/domain/repositories/interfaces';

export function* getUserTickets(action: IFluxStandardAction<IGetTicketParam>) {
  try {
    const response = yield call(TicketRepository.getTickets, action.payload as IGetTicketParam);
    yield put(TicketActions.getTicketsSuccess(response));
  } catch (e) {
    yield put(TicketActions.getTicketsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getTicketDetails(action: IFluxStandardAction<number>) {
  const { payload } = action;
  try {
    const response: Ticket = yield call(TicketRepository.getTicketDetail, payload as number);
    const {
      id,
      quoteRequestId,
      assignedTo: { id: assignedUserId },
      asset: {
        projectName,
        country: { currencies },
        id: assetId,
      },
    } = response;
    yield put(TicketActions.getTicketDetailSuccess(response));
    yield put(TicketActions.getTicketActions(id));
    yield put(
      TicketActions.setCurrentTicket({
        ticketId: id,
        quoteRequestId,
        propertyName: projectName,
        currency: currencies[0],
        assetId,
        assignedUserId,
      })
    );
  } catch (e) {
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    yield put(TicketActions.getTicketDetailFailure());
  }
}

export function* getInvoiceSummary(action: IFluxStandardAction<IInvoiceSummaryPayload>) {
  try {
    const response = yield call(PaymentRepository.getInvoiceSummary, action.payload as IInvoiceSummaryPayload);
    yield put(TicketActions.getInvoiceSummarySuccess(response));
  } catch (e) {
    yield put(TicketActions.getInvoiceSummaryFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* closeTicket(action: IFluxStandardAction<boolean>) {
  try {
    const currentTicket: ICurrentTicket = yield select(TicketSelectors.getCurrentTicket);
    const requestBody: IUpdateTicketWorkStatus = {
      action: TicketAction.CLOSE_TICKET,
      payload: {},
    };
    yield call(TicketRepository.updateTicketStatusById, currentTicket.ticketId, requestBody);
    yield put(TicketActions.closeTicketSuccess());
    if (action.payload) {
      yield put(FFMActions.getTicketDetail(currentTicket.ticketId));
    } else {
      yield put(TicketActions.getTicketDetail(currentTicket.ticketId));
    }
    AlertHelper.success({ message: I18nService.t('serviceTickets:closeTicketSuccess') });
  } catch (e) {
    yield put(TicketActions.closeTicketFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* sendTicketReminder() {
  try {
    const currentTicket: ICurrentTicket = yield select(TicketSelectors.getCurrentTicket);
    // Todo (Praharsh) : Call actual API here
    yield call(FunctionUtils.noopAsync);
    yield put(TicketActions.handleTicketReminderSent());
    yield put(TicketActions.getTicketDetail(currentTicket.ticketId));
    AlertHelper.success({ message: I18nService.t('assetFinancial:reminderSuccessMsg') });
  } catch (e) {
    yield put(TicketActions.handleTicketReminderSent());
    AlertHelper.error({ message: e.details.message, statusCode: e.details.statusCode });
  }
}

export function* reassignTicket(action: IFluxStandardAction<IReassignTicket>) {
  if (!action.payload) return;
  const { ticketId, payload, onCallback } = action.payload;
  try {
    yield call(TicketRepository.reassignTicket, ticketId, payload);
    yield put(TicketActions.reassignTicketSuccess());
    AlertHelper.success({ message: I18nService.t('serviceTickets:requestReassignedSuccessfully') });
    onCallback(true);
  } catch (e) {
    onCallback(false);
    yield put(TicketActions.reassignTicketFailure());
    AlertHelper.error({ message: e.details.message, statusCode: e.details.statusCode });
  }
}

export function* requestQuote(action: IFluxStandardAction<IRequestQuote>) {
  if (!action.payload) return;
  const { ticketId, payload, onCallback } = action.payload;
  try {
    yield call(TicketRepository.requestQuote, ticketId, payload);
    yield put(TicketActions.requestQuoteSuccess());
    AlertHelper.success({ message: I18nService.t('serviceTickets:quoteRequestSuccess') });
    onCallback(true);
  } catch (e) {
    onCallback(false);
    yield put(TicketActions.requestQuoteFailure());
    AlertHelper.error({ message: e.details.message, statusCode: e.details.statusCode });
  }
}

export function* getQuoteCategory(action: IFluxStandardAction<IQuoteParam>) {
  if (!action.payload) return;
  try {
    const response: QuoteCategory[] = yield call(TicketRepository.getQuoteRequestCategory, action.payload);
    yield put(TicketActions.getQuoteCategorySuccess(response));
    // Creating initial set of quotes
    const initialGroup = response.map((item) => {
      return {
        groupId: item.id,
        groupName: item.name,
        data: [
          {
            quoteNumber: 1,
            title: 'serviceTickets:quote1',
            price: '',
            document: null,
          },
          {
            quoteNumber: 2,
            title: 'serviceTickets:quote2',
            price: '',
            document: null,
          },
          {
            quoteNumber: 3,
            title: 'serviceTickets:quote3',
            price: '',
            document: null,
          },
        ],
      };
    });
    yield put(TicketActions.setQuotes(initialGroup));
  } catch (e) {
    yield put(TicketActions.requestQuoteFailure());
    AlertHelper.error({ message: e.details.message, statusCode: e.details.statusCode });
  }
}

export function* submitQuote(action: IFluxStandardAction<ISubmitQuote>) {
  if (!action.payload) return;
  const { data, onCallback } = action.payload;
  try {
    yield call(TicketRepository.quoteSubmit, data);
    yield put(TicketActions.submitQuoteSuccess());
    yield put(TicketActions.setQuotes([]));
    AlertHelper.success({ message: I18nService.t('serviceTickets:quoteSubmission') });
    onCallback(true);
  } catch (e) {
    onCallback(false);
    yield put(TicketActions.submitQuoteFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getTicketActions(action: IFluxStandardAction<number>) {
  try {
    const response = yield call(TicketRepository.getTicketActions, action.payload as number);
    yield put(TicketActions.getTicketActionsSuccess(response));
  } catch (e) {
    yield put(TicketActions.getTicketActionsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getQuoteRequests(action: IFluxStandardAction<IQuoteParam>) {
  if (!action.payload) return;
  try {
    const res = yield call(TicketRepository.getRequestedQuote, action.payload);
    yield put(TicketActions.getQuoteRequestsSuccess(res));
  } catch (e) {
    yield put(TicketActions.getQuoteRequestsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* quoteApprove(action: IFluxStandardAction<IApproveQuote>) {
  if (!action.payload) return;
  const { data, onCallback } = action.payload;
  try {
    yield call(TicketRepository.quoteApprove, data);
    yield put(TicketActions.approveQuoteSuccess());
    AlertHelper.success({ message: I18nService.t('serviceTickets:quoteApproved') });
    onCallback(true);
  } catch (e) {
    onCallback(false);
    yield put(TicketActions.approveQuoteFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* requestMoreQuote(action: IFluxStandardAction<IRequestMorePayload>) {
  if (!action.payload) return;
  const { onCallback } = action.payload;
  try {
    yield call(TicketRepository.requestMoreQuote, action.payload);
    yield put(TicketActions.requestMoreQuoteSuccess());
    if (onCallback) {
      onCallback(true);
    }
  } catch (e) {
    if (onCallback) {
      onCallback(false);
    }
    yield put(TicketActions.requestMoreQuoteFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* watchTicket() {
  yield takeLatest(TicketActionTypes.GET.TICKETS, getUserTickets);
  yield takeEvery(TicketActionTypes.GET.TICKET_DETAIL, getTicketDetails);
  yield takeEvery(TicketActionTypes.POST.INVOICE_SUMMARY, getInvoiceSummary);
  yield takeEvery(TicketActionTypes.CLOSE_TICKET, closeTicket);
  yield takeEvery(TicketActionTypes.SEND_TICKET_REMINDER, sendTicketReminder);
  yield takeEvery(TicketActionTypes.POST.REASSIGN_TICKET, reassignTicket);
  yield takeEvery(TicketActionTypes.POST.REQUEST_QUOTE, requestQuote);
  yield takeEvery(TicketActionTypes.GET.QUOTES_CATEGORY, getQuoteCategory);
  yield takeEvery(TicketActionTypes.POST.SUBMIT_QUOTE, submitQuote);
  yield takeEvery(TicketActionTypes.GET.TICKET_ACTIONS, getTicketActions);
  yield takeEvery(TicketActionTypes.GET.QUOTES_REQUEST, getQuoteRequests);
  yield takeEvery(TicketActionTypes.POST.APPROVE_QUOTE, quoteApprove);
  yield takeEvery(TicketActionTypes.POST.REQUEST_MORE_QUOTE, requestMoreQuote);
}
