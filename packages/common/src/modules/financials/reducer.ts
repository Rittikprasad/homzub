import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ReducerUtils } from '@homzhub/common/src/utils/ReducerUtils';
import { FinancialActionPayloadTypes, FinancialActionTypes } from '@homzhub/common/src/modules/financials/actions';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IDues } from '@homzhub/common/src/domain/models/Dues';
import { IDueOrderSummary } from '@homzhub/common/src/domain/models/DueOrderSummary';
import { IFinancialTransaction } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { IGeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { IReminder } from '@homzhub/common/src/domain/models/Reminder';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';
import { IFinancialState, ILedgerMetrics, IReminderFormData } from '@homzhub/common/src/modules/financials/interfaces';
import { IFluxStandardAction, IPaginationPayload } from '@homzhub/common/src/modules/interfaces';
import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';

const defaultLedgerFilters = {
  selectedProperty: 0,
  selectedCountry: 0,
  selectedTimeRange: DateFilter.thisYear,
};

export const initialFinancialsState: IFinancialState = {
  transactions: null,
  dues: null,
  currentDueId: -1,
  currentReminderId: -1,
  ledgers: {
    ...defaultLedgerFilters,
    ledgerData: [],
    ledgerMetrics: {
      income: '0',
      expense: '0',
    },
  },
  reminders: [],
  reminderCategories: [],
  reminderFrequencies: [],
  reminderAssets: [],
  dueOrderSummary: null,
  reminderFormData: {
    title: '',
    property: -1,
    category: 2,
    leaseUnit: -1,
    frequency: 4, // ONE_TIME id
    date: DateUtils.getNextDate(1),
    rent: '',
    bankAccount: -1,
    owner: -1,
    tenant: -1,
    society: -1,
    paidBy: -1,
    maintenanceAmount: '',
  },
  loaders: {
    transactions: false,
    dues: false,
    payment: false,
    ledgers: false,
    reminder: false,
    reminderAsset: false,
    dueOrderSummary: false,
    deleteDue: false,
  },
};

export const financialsReducer = (
  state: IFinancialState = initialFinancialsState,
  action: IFluxStandardAction<FinancialActionPayloadTypes>
): IFinancialState => {
  switch (action.type) {
    case FinancialActionTypes.GET.TRANSACTIONS:
      return { ...state, ['loaders']: { ...state.loaders, ['transactions']: true } };

    case FinancialActionTypes.GET.TRANSACTIONS_SUCCESS: {
      const payload = action.payload as IPaginationPayload<IFinancialTransaction>;
      const newData = ReducerUtils.formatFinancialTransactions(state.transactions, payload);
      return {
        ...state,
        ['transactions']: newData,
        ['loaders']: { ...state.loaders, ['transactions']: false },
      };
    }

    case FinancialActionTypes.GET.TRANSACTIONS_FAILURE:
      return { ...state, ['loaders']: { ...state.loaders, ['transactions']: false } };
    case FinancialActionTypes.GET.DUES:
      return { ...state, ['loaders']: { ...state.loaders, ['dues']: true } };
    case FinancialActionTypes.GET.DUES_SUCCESS:
      return { ...state, ['dues']: action.payload as IDues, ['loaders']: { ...state.loaders, ['dues']: false } };
    case FinancialActionTypes.GET.DUES_FAILURE:
      return { ...state, ['loaders']: { ...state.loaders, ['dues']: false } };
    case FinancialActionTypes.POST.PAYMENT:
      return { ...state, ['loaders']: { ...state.loaders, ['payment']: true } };
    case FinancialActionTypes.POST.PAYMENT_SUCCESS:
    case FinancialActionTypes.POST.PAYMENT_FAILURE:
      return { ...state, ['loaders']: { ...state.loaders, ['payment']: false } };
    case FinancialActionTypes.SET.SELECTED_COUNTRY:
      return { ...state, ['ledgers']: { ...state.ledgers, ['selectedCountry']: action.payload as number } };
    case FinancialActionTypes.SET.SELECTED_PROPERTY:
      return { ...state, ['ledgers']: { ...state.ledgers, ['selectedProperty']: action.payload as number } };
    case FinancialActionTypes.SET.SELECTED_TIME_RANGE:
      return { ...state, ['ledgers']: { ...state.ledgers, ['selectedTimeRange']: action.payload as number } };
    case FinancialActionTypes.GET.LEDGERS:
      return { ...state, ['loaders']: { ...state.loaders, ['ledgers']: true } };
    case FinancialActionTypes.GET.LEDGERS_SUCCESS:
      return {
        ...state,
        ['ledgers']: { ...state.ledgers, ['ledgerData']: action.payload as IGeneralLedgers[] },
        ['loaders']: { ...state.loaders, ['ledgers']: false },
      };
    case FinancialActionTypes.GET.LEDGER_METRICS:
      return { ...state, ['loaders']: { ...state.loaders, ['ledgers']: true } };
    case FinancialActionTypes.GET.LEDGER_METRICS_SUCCESS:
      return {
        ...state,
        ['ledgers']: { ...state.ledgers, ['ledgerMetrics']: action.payload as ILedgerMetrics },
        ['loaders']: { ...state.loaders, ['ledgers']: false },
      };
    case FinancialActionTypes.GET.LEDGERS_FAILURE:
    case FinancialActionTypes.GET.LEDGER_METRICS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['ledgers']: false },
      };
    case FinancialActionTypes.RESET_LEDGER_FILTERS:
      return {
        ...state,
        ['ledgers']: { ...state.ledgers, ...defaultLedgerFilters },
      };
    case FinancialActionTypes.GET.REMINDER_CATEGORIES:
    case FinancialActionTypes.GET.REMINDER_FREQUENCIES:
    case FinancialActionTypes.GET.REMINDER_CATEGORIES_FAILURE:
    case FinancialActionTypes.GET.REMINDER_FREQUENCIES_FAILURE:
      return state;
    case FinancialActionTypes.GET.REMINDER_CATEGORIES_SUCCESS:
      return {
        ...state,
        ['reminderCategories']: action.payload as IUnit[],
      };
    case FinancialActionTypes.GET.REMINDER_FREQUENCIES_SUCCESS:
      return {
        ...state,
        ['reminderFrequencies']: action.payload as IUnit[],
      };
    case FinancialActionTypes.POST.REMINDER:
    case FinancialActionTypes.POST.UPDATE_REMINDER:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reminder']: true },
      };
    case FinancialActionTypes.POST.REMINDER_SUCCESS:
    case FinancialActionTypes.POST.REMINDER_FAILURE:
    case FinancialActionTypes.POST.UPDATE_REMINDER_SUCCESS:
    case FinancialActionTypes.POST.UPDATE_REMINDER_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reminder']: false },
      };
    case FinancialActionTypes.GET.REMINDERS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reminder']: true },
      };
    case FinancialActionTypes.GET.REMINDERS_SUCCESS:
      return {
        ...state,
        ['reminders']: action.payload as IReminder[],
        ['loaders']: { ...state.loaders, ['reminder']: false },
      };
    case FinancialActionTypes.GET.REMINDERS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reminder']: false },
      };
    case FinancialActionTypes.GET.REMINDER_ASSETS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reminderAsset']: true },
      };
    case FinancialActionTypes.GET.REMINDER_ASSETS_SUCCESS:
      return {
        ...state,
        ['reminderAssets']: action.payload as IAsset[],
        ['loaders']: { ...state.loaders, ['reminderAsset']: false },
      };
    case FinancialActionTypes.GET.REMINDER_ASSETS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reminderAsset']: false },
      };
    case FinancialActionTypes.SET.CURRENT_DUE_ID:
      return {
        ...state,
        ['currentDueId']: action.payload as number,
      };
    case FinancialActionTypes.SET.CURRENT_REMINDER_ID:
      return {
        ...state,
        ['currentReminderId']: action.payload as number,
      };
    case FinancialActionTypes.SET.REMINDER_FORM_DATA:
      return {
        ...state,
        ['reminderFormData']: action.payload as IReminderFormData,
      };
    case FinancialActionTypes.CLEAR_REMINDER_FORM_DATA:
      return {
        ...state,
        ['reminderFormData']: initialFinancialsState.reminderFormData,
      };
    case FinancialActionTypes.GET.DUE_ORDER_SUMMARY:
    case FinancialActionTypes.POST.UPDATE_ORDER_SUMMARY:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['dueOrderSummary']: true },
      };
    case FinancialActionTypes.GET.DUE_ORDER_SUMMARY_SUCCESS:
    case FinancialActionTypes.POST.UPDATE_ORDER_SUMMARY_SUCCESS:
      return {
        ...state,
        ['dueOrderSummary']: action.payload as IDueOrderSummary,
        ['loaders']: { ...state.loaders, ['dueOrderSummary']: false },
      };
    case FinancialActionTypes.GET.DUE_ORDER_SUMMARY_FAILURE:
    case FinancialActionTypes.POST.UPDATE_ORDER_SUMMARY_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['dueOrderSummary']: false },
      };
    case FinancialActionTypes.CLEAR_ORDER_SUMMARY:
      return {
        ...state,
        ['dueOrderSummary']: initialFinancialsState.dueOrderSummary,
      };
    case FinancialActionTypes.POST.DELETE_DUE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['deleteDue']: true },
      };
    case FinancialActionTypes.POST.DELETE_DUE_SUCCESS:
    case FinancialActionTypes.POST.DELETE_DUE_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['deleteDue']: false },
      };
    case FinancialActionTypes.CLEAR_STATE:
      return initialFinancialsState;
    default:
      return {
        ...state,
      };
  }
};
