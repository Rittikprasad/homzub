import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { Dues, IDues } from '@homzhub/common/src/domain/models/Dues';
import { DueOrderSummary, IDueOrderSummary } from '@homzhub/common/src/domain/models/DueOrderSummary';
import { FinancialTransactions, IFinancialTransaction } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { GeneralLedgers, IGeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { IReminder, Reminder } from '@homzhub/common/src/domain/models/Reminder';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { IFluxStandardAction, IOnCallback, IPaginationPayload } from '@homzhub/common/src/modules/interfaces';
import { ITransactionParams } from '@homzhub/common/src/domain/repositories/interfaces';
import {
  IAddReminderPayload,
  ILedgerMetrics,
  IOrderSummaryPayload,
  IProcessPaymentPayload,
  IReminderFormData,
  IUpdateReminderPayload,
  IUpdateSummary,
} from '@homzhub/common/src/modules/financials/interfaces';
import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';

const actionTypePrefix = 'Financials/';

export const FinancialActionTypes = {
  GET: {
    // Transactions
    TRANSACTIONS: `${actionTypePrefix}TRANSACTIONS`,
    TRANSACTIONS_SUCCESS: `${actionTypePrefix}TRANSACTIONS_SUCCESS`,
    TRANSACTIONS_FAILURE: `${actionTypePrefix}TRANSACTIONS_FAILURE`,
    // Dues
    DUES: `${actionTypePrefix}DUES`,
    DUES_SUCCESS: `${actionTypePrefix}DUES_SUCCESS`,
    DUES_FAILURE: `${actionTypePrefix}DUES_FAILURE`,
    // LedgerData
    LEDGERS: `${actionTypePrefix}LEDGERS`,
    LEDGERS_SUCCESS: `${actionTypePrefix}LEDGERS_SUCCESS`,
    LEDGERS_FAILURE: `${actionTypePrefix}LEDGERS_FAILURE`,
    // LedgerMetrics
    LEDGER_METRICS: `${actionTypePrefix}LEDGER_METRICS`,
    LEDGER_METRICS_SUCCESS: `${actionTypePrefix}LEDGER_METRICS_SUCCESS`,
    LEDGER_METRICS_FAILURE: `${actionTypePrefix}LEDGER_METRICS_FAILURE`,
    // Reminders
    REMINDERS: `${actionTypePrefix}REMINDERS`,
    REMINDERS_SUCCESS: `${actionTypePrefix}REMINDERS_SUCCESS`,
    REMINDERS_FAILURE: `${actionTypePrefix}REMINDERS_FAILURE`,
    REMINDER_CATEGORIES: `${actionTypePrefix}REMINDER_CATEGORIES`,
    REMINDER_CATEGORIES_SUCCESS: `${actionTypePrefix}REMINDER_CATEGORIES_SUCCESS`,
    REMINDER_CATEGORIES_FAILURE: `${actionTypePrefix}REMINDER_CATEGORIES_FAILURE`,
    REMINDER_FREQUENCIES: `${actionTypePrefix}REMINDER_FREQUENCIES`,
    REMINDER_FREQUENCIES_SUCCESS: `${actionTypePrefix}REMINDER_FREQUENCIES_SUCCESS`,
    REMINDER_FREQUENCIES_FAILURE: `${actionTypePrefix}REMINDER_FREQUENCIES_FAILURE`,
    REMINDER_ASSETS: `${actionTypePrefix}REMINDER_ASSETS`,
    REMINDER_ASSETS_SUCCESS: `${actionTypePrefix}REMINDER_ASSETS_SUCCESS`,
    REMINDER_ASSETS_FAILURE: `${actionTypePrefix}REMINDER_ASSETS_FAILURE`,
    // Orders
    DUE_ORDER_SUMMARY: `${actionTypePrefix}DUE_ORDER_SUMMARY`,
    DUE_ORDER_SUMMARY_SUCCESS: `${actionTypePrefix}DUE_ORDER_SUMMARY_SUCCESS`,
    DUE_ORDER_SUMMARY_FAILURE: `${actionTypePrefix}DUE_ORDER_SUMMARY_FAILURE`,
  },
  SET: {
    SELECTED_PROPERTY: `${actionTypePrefix}SELECTED_PROPERTY`,
    SELECTED_COUNTRY: `${actionTypePrefix}SELECTED_COUNTRY`,
    SELECTED_TIME_RANGE: `${actionTypePrefix}SELECTED_TIME_RANGE`,
    CURRENT_DUE_ID: `${actionTypePrefix}CURRENT_DUE_ID`,
    CURRENT_REMINDER_ID: `${actionTypePrefix}CURRENT_REMINDER_ID`,
    REMINDER_FORM_DATA: `${actionTypePrefix}REMINDER_FORM_DATA`,
  },
  POST: {
    PAYMENT: `${actionTypePrefix}PAYMENT`,
    PAYMENT_SUCCESS: `${actionTypePrefix}PAYMENT_SUCCESS`,
    PAYMENT_FAILURE: `${actionTypePrefix}PAYMENT_FAILURE`,
    // Reminders
    REMINDER: `${actionTypePrefix}REMINDER`,
    REMINDER_SUCCESS: `${actionTypePrefix}REMINDER_SUCCESS`,
    REMINDER_FAILURE: `${actionTypePrefix}REMINDER_FAILURE`,
    UPDATE_REMINDER: `${actionTypePrefix}UPDATE_REMINDER`,
    UPDATE_REMINDER_SUCCESS: `${actionTypePrefix}UPDATE_REMINDER_SUCCESS`,
    UPDATE_REMINDER_FAILURE: `${actionTypePrefix}UPDATE_REMINDER_FAILURE`,
    // Orders
    UPDATE_ORDER_SUMMARY: `${actionTypePrefix}UPDATE_ORDER_SUMMARY`,
    UPDATE_ORDER_SUMMARY_SUCCESS: `${actionTypePrefix}UPDATE_ORDER_SUMMARY_SUCCESS`,
    UPDATE_ORDER_SUMMARY_FAILURE: `${actionTypePrefix}UPDATE_ORDER_SUMMARY_FAILURE`,

    // Due
    DELETE_DUE: `${actionTypePrefix}DELETE_DUE`,
    DELETE_DUE_SUCCESS: `${actionTypePrefix}DELETE_DUE_SUCCESS`,
    DELETE_DUE_FAILURE: `${actionTypePrefix}DELETE_DUE_FAILURE`,
  },
  CLEAR_STATE: `${actionTypePrefix}CLEAR_STATE`,
  RESET_LEDGER_FILTERS: `${actionTypePrefix}RESET_LEDGER_FILTERS`,
  CLEAR_REMINDER_FORM_DATA: `${actionTypePrefix}CLEAR_REMINDER_FORM_DATA`,
  CLEAR_ORDER_SUMMARY: `${actionTypePrefix}CLEAR_ORDER_SUMMARY`,
};

const getTransactions = (payload: ITransactionParams): IFluxStandardAction<ITransactionParams> => ({
  type: FinancialActionTypes.GET.TRANSACTIONS,
  payload,
});

const getTransactionsSuccess = (
  payload: IPaginationPayload<FinancialTransactions>
): IFluxStandardAction<IPaginationPayload<IFinancialTransaction>> => ({
  type: FinancialActionTypes.GET.TRANSACTIONS_SUCCESS,
  payload: { data: ObjectMapper.serialize(payload.data), isReset: payload.isReset },
});

const getTransactionsFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.TRANSACTIONS_FAILURE,
});

const getDues = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.DUES,
});

const getDuesSuccess = (payload: Dues): IFluxStandardAction<IDues> => ({
  type: FinancialActionTypes.GET.DUES_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getDuesFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.DUES_FAILURE,
});

const processPayment = (payload: IProcessPaymentPayload): IFluxStandardAction<IProcessPaymentPayload> => ({
  type: FinancialActionTypes.POST.PAYMENT,
  payload,
});

const paymentSuccess = (): IFluxStandardAction => ({
  type: FinancialActionTypes.POST.PAYMENT_SUCCESS,
});

const paymentFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.POST.PAYMENT_FAILURE,
});

const clearFinancials = (): IFluxStandardAction => ({
  type: FinancialActionTypes.CLEAR_STATE,
});

const setCurrentProperty = (payload: number): IFluxStandardAction<number> => ({
  type: FinancialActionTypes.SET.SELECTED_PROPERTY,
  payload,
});

const setCurrentCountry = (payload: number): IFluxStandardAction<number> => ({
  type: FinancialActionTypes.SET.SELECTED_COUNTRY,
  payload,
});

const setTimeRange = (payload: DateFilter): IFluxStandardAction<DateFilter> => ({
  type: FinancialActionTypes.SET.SELECTED_TIME_RANGE,
  payload,
});

const getLedgers = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.LEDGERS,
});

const getLedgersSuccess = (payload: GeneralLedgers[]): IFluxStandardAction<IGeneralLedgers[]> => ({
  type: FinancialActionTypes.GET.LEDGERS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getLedgersFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.LEDGERS_FAILURE,
});

const getLedgerMetrics = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.LEDGER_METRICS,
});

const getLedgerMetricsSuccess = (payload: ILedgerMetrics): IFluxStandardAction<ILedgerMetrics> => ({
  type: FinancialActionTypes.GET.LEDGER_METRICS_SUCCESS,
  payload,
});

const getLedgerMetricsFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.LEDGER_METRICS_FAILURE,
});

const resetLedgerFilters = (): IFluxStandardAction => ({
  type: FinancialActionTypes.RESET_LEDGER_FILTERS,
});

const getReminderCategories = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.REMINDER_CATEGORIES,
});

const getReminderCategoriesSuccess = (data: Unit[]): IFluxStandardAction<IUnit[]> => ({
  type: FinancialActionTypes.GET.REMINDER_CATEGORIES_SUCCESS,
  payload: ObjectMapper.serializeArray(data),
});

const getReminderCategoriesFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.REMINDER_CATEGORIES_FAILURE,
});

const getReminderFrequencies = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.REMINDER_FREQUENCIES,
});

const getReminderFrequenciesSuccess = (data: Unit[]): IFluxStandardAction<IUnit[]> => ({
  type: FinancialActionTypes.GET.REMINDER_FREQUENCIES_SUCCESS,
  payload: ObjectMapper.serializeArray(data),
});

const getReminderFrequenciesFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.REMINDER_FREQUENCIES_FAILURE,
});

const addReminder = (payload: IAddReminderPayload): IFluxStandardAction<IAddReminderPayload> => ({
  type: FinancialActionTypes.POST.REMINDER,
  payload,
});

const addReminderSuccess = (): IFluxStandardAction => ({
  type: FinancialActionTypes.POST.REMINDER_SUCCESS,
});

const addReminderFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.POST.REMINDER_FAILURE,
});

const getReminders = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.REMINDERS,
});

const getRemindersSuccess = (payload: Reminder[]): IFluxStandardAction<IReminder[]> => ({
  type: FinancialActionTypes.GET.REMINDERS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getRemindersFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.REMINDERS_FAILURE,
});

const getReminderAssets = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.REMINDER_ASSETS,
});

const getReminderAssetsSuccess = (data: Asset[]): IFluxStandardAction<IAsset[]> => ({
  type: FinancialActionTypes.GET.REMINDER_ASSETS_SUCCESS,
  payload: ObjectMapper.serializeArray(data),
});

const getReminderAssetsFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.REMINDER_ASSETS_FAILURE,
});

const setCurrentDueId = (dueId: number): IFluxStandardAction<number> => ({
  type: FinancialActionTypes.SET.CURRENT_DUE_ID,
  payload: dueId,
});

const setCurrentReminderId = (id: number): IFluxStandardAction<number> => ({
  type: FinancialActionTypes.SET.CURRENT_REMINDER_ID,
  payload: id,
});

const updateReminder = (payload: IUpdateReminderPayload): IFluxStandardAction<IUpdateReminderPayload> => ({
  type: FinancialActionTypes.POST.UPDATE_REMINDER,
  payload,
});

const updateReminderSuccess = (): IFluxStandardAction => ({
  type: FinancialActionTypes.POST.UPDATE_REMINDER_SUCCESS,
});

const updateReminderFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.POST.UPDATE_REMINDER_FAILURE,
});

const setReminderFormData = (payload: IReminderFormData): IFluxStandardAction<IReminderFormData> => ({
  type: FinancialActionTypes.SET.REMINDER_FORM_DATA,
  payload,
});

const clearReminderFormData = (): IFluxStandardAction => ({
  type: FinancialActionTypes.CLEAR_REMINDER_FORM_DATA,
});

const getDueOderSummary = (payload: IOrderSummaryPayload): IFluxStandardAction<IOrderSummaryPayload> => ({
  type: FinancialActionTypes.GET.DUE_ORDER_SUMMARY,
  payload,
});

const getDueOderSummarySuccess = (data: DueOrderSummary): IFluxStandardAction<IDueOrderSummary> => ({
  type: FinancialActionTypes.GET.DUE_ORDER_SUMMARY_SUCCESS,
  payload: ObjectMapper.serialize(data),
});

const getDueOderSummaryFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.DUE_ORDER_SUMMARY_FAILURE,
});

const updateOderSummary = (payload: IUpdateSummary): IFluxStandardAction<IUpdateSummary> => ({
  type: FinancialActionTypes.POST.UPDATE_ORDER_SUMMARY,
  payload,
});

const updateOderSummarySuccess = (data: DueOrderSummary): IFluxStandardAction<IDueOrderSummary> => ({
  type: FinancialActionTypes.POST.UPDATE_ORDER_SUMMARY_SUCCESS,
  payload: ObjectMapper.serialize(data),
});

const updateOderSummaryFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.POST.UPDATE_ORDER_SUMMARY_FAILURE,
});

const clearOrderSummary = (): IFluxStandardAction => ({
  type: FinancialActionTypes.CLEAR_ORDER_SUMMARY,
});

const deleteDue = (payload: IOnCallback): IFluxStandardAction<IOnCallback> => ({
  type: FinancialActionTypes.POST.DELETE_DUE,
  payload,
});

const deleteDueSuccess = (): IFluxStandardAction => ({
  type: FinancialActionTypes.POST.DELETE_DUE_SUCCESS,
});

const deleteDueFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.POST.DELETE_DUE_FAILURE,
});

export type FinancialActionPayloadTypes =
  | IPaginationPayload<FinancialTransactions>
  | IDues
  | IProcessPaymentPayload
  | IGeneralLedgers[]
  | number
  | DateFilter
  | ILedgerMetrics
  | IUnit[]
  | IAddReminderPayload
  | IReminder[]
  | IAsset[]
  | IUpdateReminderPayload
  | IReminderFormData
  | IDueOrderSummary
  | IOrderSummaryPayload
  | IUpdateSummary
  | IOnCallback;

export const FinancialActions = {
  getTransactions,
  getTransactionsFailure,
  getTransactionsSuccess,
  getDues,
  getDuesFailure,
  getDuesSuccess,
  processPayment,
  paymentSuccess,
  paymentFailure,
  clearFinancials,
  getLedgers,
  getLedgersSuccess,
  getLedgersFailure,
  setCurrentProperty,
  setCurrentCountry,
  setTimeRange,
  getLedgerMetrics,
  getLedgerMetricsSuccess,
  getLedgerMetricsFailure,
  resetLedgerFilters,
  getReminderCategories,
  getReminderCategoriesSuccess,
  getReminderCategoriesFailure,
  getReminderFrequencies,
  getReminderFrequenciesSuccess,
  getReminderFrequenciesFailure,
  addReminder,
  addReminderSuccess,
  addReminderFailure,
  getReminders,
  getRemindersSuccess,
  getRemindersFailure,
  getReminderAssets,
  getReminderAssetsSuccess,
  getReminderAssetsFailure,
  setCurrentDueId,
  setCurrentReminderId,
  updateReminder,
  updateReminderSuccess,
  updateReminderFailure,
  setReminderFormData,
  clearReminderFormData,
  getDueOderSummary,
  getDueOderSummarySuccess,
  getDueOderSummaryFailure,
  updateOderSummary,
  updateOderSummarySuccess,
  updateOderSummaryFailure,
  clearOrderSummary,
  deleteDue,
  deleteDueSuccess,
  deleteDueFailure,
};
