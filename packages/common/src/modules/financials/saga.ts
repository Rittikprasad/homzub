/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeLatest, select } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FinanceUtils, IFinancialYear, IGeneralLedgersParams } from '@homzhub/common/src/utils/FinanceUtil';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { PaymentRepository } from '@homzhub/common/src/domain/repositories/PaymentRepository';
import { FinancialActions, FinancialActionTypes } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { DataGroupBy, GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { Dues } from '@homzhub/common/src/domain/models/Dues';
import { DueOrderSummary } from '@homzhub/common/src/domain/models/DueOrderSummary';
import { FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { Reminder } from '@homzhub/common/src/domain/models/Reminder';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { ITransactionParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { IFluxStandardAction, IOnCallback, VoidGenerator } from '@homzhub/common/src/modules/interfaces';
import {
  IAddReminderPayload,
  ILedgerMetrics,
  IOrderSummaryPayload,
  IProcessPaymentPayload,
  IUpdateReminderPayload,
  IUpdateSummary,
} from '@homzhub/common/src/modules/financials/interfaces';
import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';

export function* getTransactions(action: IFluxStandardAction<ITransactionParams>): VoidGenerator {
  try {
    const response = yield call(LedgerRepository.getGeneralLedgers, action.payload as ITransactionParams);
    yield put(
      FinancialActions.getTransactionsSuccess({
        data: response as FinancialTransactions,
        isReset: action.payload?.offset === 0,
      })
    );
  } catch (e) {
    yield put(FinancialActions.getTransactionsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getAllDues(): VoidGenerator {
  try {
    const response = yield call(LedgerRepository.getDues);
    yield put(FinancialActions.getDuesSuccess(response as Dues));
  } catch (e) {
    yield put(FinancialActions.getDuesFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* processPayment(action: IFluxStandardAction<IProcessPaymentPayload>): VoidGenerator {
  if (!action.payload) return;
  const { data, onCallback } = action.payload;
  try {
    yield call(PaymentRepository.processPayment, data);
    yield put(FinancialActions.paymentSuccess());
    if (onCallback) {
      onCallback(true);
    }
  } catch (e) {
    if (onCallback) {
      onCallback(false);
    }
    yield put(FinancialActions.paymentFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

// Todo (Praharsh) : Refactor financeUtil logic
export function* getLedgers(): VoidGenerator {
  try {
    const selectedTimeRange = yield select(FinancialSelectors.getSelectedTimeRange);
    const financialYear = yield select(UserSelector.getUserFinancialYear);
    const selectedCountry = yield select(FinancialSelectors.getSelectedCountry);
    const selectedProperty = yield select(FinancialSelectors.getSelectedProperty);

    const params: IGeneralLedgersParams = {
      selectedTimeRange: selectedTimeRange as DateFilter,
      selectedCountry: selectedCountry as number,
      selectedProperty: selectedProperty as number,
      financialYear: financialYear as IFinancialYear,
    };

    const store = StoreProviderService.getStore();

    const successCallback = (response: GeneralLedgers[]): void => {
      store.dispatch(FinancialActions.getLedgersSuccess(response));
    };

    const failureCallback = (error: any): void => {
      store.dispatch(FinancialActions.getLedgersFailure());
      AlertHelper.error({ message: `${error}` });
    };

    yield call(FinanceUtils.getGeneralLedgers, params, successCallback, failureCallback);
  } catch (e) {
    yield put(FinancialActions.getLedgersFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getLedgerMetrics() {
  try {
    const payload = {
      transaction_date__gte: DateUtils.getCurrentYearStartDate(),
      transaction_date__lte: DateUtils.getCurrentYearLastDate(),
      transaction_date_group_by: DataGroupBy.year,
    };
    const ledgerData: GeneralLedgers[] = yield call(LedgerRepository.getLedgerPerformances, payload);
    const metricsData: ILedgerMetrics = {
      income: `${LedgerUtils.totalByType(LedgerTypes.credit, ledgerData)}`,
      expense: `${LedgerUtils.totalByType(LedgerTypes.debit, ledgerData)}`,
    };
    yield put(FinancialActions.getLedgerMetricsSuccess(metricsData));
  } catch (err) {
    yield put(FinancialActions.getLedgerMetricsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details), statusCode: err.details.statusCode });
  }
}

export function* getReminderCategories(): VoidGenerator {
  try {
    const response = yield call(LedgerRepository.getReminderCategories);
    yield put(FinancialActions.getReminderCategoriesSuccess(response as Unit[]));
  } catch (e) {
    yield put(FinancialActions.getReminderCategoriesFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getReminderFrequencies(): VoidGenerator {
  try {
    const response = yield call(LedgerRepository.getReminderFrequencies);
    yield put(FinancialActions.getReminderFrequenciesSuccess(response as Unit[]));
  } catch (e) {
    yield put(FinancialActions.getReminderFrequenciesFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* addReminder(action: IFluxStandardAction<IAddReminderPayload>): VoidGenerator {
  if (!action.payload) return;
  const { data, onCallback } = action.payload;
  try {
    yield call(LedgerRepository.addReminder, data);
    yield put(FinancialActions.addReminderSuccess());
    if (onCallback) {
      onCallback(true);
    }
  } catch (e) {
    if (onCallback) {
      onCallback(false);
    }
    yield put(FinancialActions.addReminderFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getReminders(): VoidGenerator {
  try {
    const response = yield call(LedgerRepository.getReminders);
    yield put(FinancialActions.getRemindersSuccess(response as Reminder[]));
  } catch (e) {
    yield put(FinancialActions.getRemindersFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getReminderAssets(): VoidGenerator {
  try {
    const response = yield call(LedgerRepository.getReminderAssets);
    yield put(FinancialActions.getReminderAssetsSuccess(response as Asset[]));
  } catch (e) {
    yield put(FinancialActions.getReminderAssetsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* updateReminder(action: IFluxStandardAction<IUpdateReminderPayload>): VoidGenerator {
  if (!action.payload) return;
  const { data, onCallback, id } = action.payload;
  try {
    yield call(LedgerRepository.updateReminder, id, data);
    yield put(FinancialActions.updateReminderSuccess());
    if (onCallback) {
      onCallback(true);
    }
  } catch (e) {
    if (onCallback) {
      onCallback(false);
    }
    yield put(FinancialActions.updateReminderFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getDueOrderSummary(action: IFluxStandardAction<IOrderSummaryPayload>): VoidGenerator {
  if (!action.payload) return;
  const { onCallback, id } = action.payload;
  try {
    const response = yield call(LedgerRepository.getDueOrderSummary, id);
    yield put(FinancialActions.getDueOderSummarySuccess(response as DueOrderSummary));
    if (onCallback) {
      onCallback(true);
    }
  } catch (e) {
    if (onCallback) {
      onCallback(false);
    }
    yield put(FinancialActions.getDueOderSummaryFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* updateDueOrderSummary(action: IFluxStandardAction<IUpdateSummary>): VoidGenerator {
  if (!action.payload) return;
  const { onCallback, id, payload } = action.payload;
  try {
    const response = yield call(LedgerRepository.dueOrderSummaryAction, id, payload);
    yield put(FinancialActions.updateOderSummarySuccess(response as DueOrderSummary));
    if (onCallback) {
      onCallback(true);
    }
  } catch (e) {
    if (onCallback) {
      onCallback(false);
    }
    yield put(FinancialActions.updateOderSummaryFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* deleteDue(action: IFluxStandardAction<IOnCallback>): VoidGenerator {
  if (!action.payload) return;
  const { onCallback } = action.payload;
  try {
    const dueId = yield select(FinancialSelectors.getCurrentDueId);
    yield call(LedgerRepository.deleteDue, dueId as number);
    yield put(FinancialActions.deleteDueSuccess());
    onCallback(true);
  } catch (e) {
    onCallback(false);
    yield put(FinancialActions.deleteDueFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* watchFinancials() {
  yield takeLatest(FinancialActionTypes.GET.TRANSACTIONS, getTransactions);
  yield takeLatest(FinancialActionTypes.GET.DUES, getAllDues);
  yield takeLatest(FinancialActionTypes.POST.PAYMENT, processPayment);
  yield takeLatest(FinancialActionTypes.GET.LEDGERS, getLedgers);
  yield takeLatest(FinancialActionTypes.GET.LEDGER_METRICS, getLedgerMetrics);
  yield takeLatest(FinancialActionTypes.GET.REMINDER_CATEGORIES, getReminderCategories);
  yield takeLatest(FinancialActionTypes.GET.REMINDER_FREQUENCIES, getReminderFrequencies);
  yield takeLatest(FinancialActionTypes.POST.REMINDER, addReminder);
  yield takeLatest(FinancialActionTypes.GET.REMINDERS, getReminders);
  yield takeLatest(FinancialActionTypes.GET.REMINDER_ASSETS, getReminderAssets);
  yield takeLatest(FinancialActionTypes.POST.UPDATE_REMINDER, updateReminder);
  yield takeLatest(FinancialActionTypes.GET.DUE_ORDER_SUMMARY, getDueOrderSummary);
  yield takeLatest(FinancialActionTypes.POST.UPDATE_ORDER_SUMMARY, updateDueOrderSummary);
  yield takeLatest(FinancialActionTypes.POST.DELETE_DUE, deleteDue);
}
