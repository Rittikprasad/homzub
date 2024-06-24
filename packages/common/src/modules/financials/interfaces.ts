import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IDues } from '@homzhub/common/src/domain/models/Dues';
import { IDueOrderSummary } from '@homzhub/common/src/domain/models/DueOrderSummary';
import { IFinancialTransaction } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { IGeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { IReminder } from '@homzhub/common/src/domain/models/Reminder';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';
import {
  IDueOrderSummaryAction,
  IPaymentPayload,
  IReminderPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';

export interface ILedgerMetrics {
  income: string;
  expense: string;
}
export interface ILedgers {
  selectedProperty: number;
  selectedCountry: number;
  selectedTimeRange: DateFilter;
  ledgerData: IGeneralLedgers[];
  ledgerMetrics: ILedgerMetrics;
}

export interface IFinancialState {
  transactions: null | IFinancialTransaction;
  dues: IDues | null;
  currentDueId: number;
  currentReminderId: number;
  ledgers: ILedgers;
  reminderCategories: IUnit[];
  reminderFrequencies: IUnit[];
  reminders: IReminder[];
  reminderAssets: IAsset[];
  reminderFormData: IReminderFormData;
  dueOrderSummary: IDueOrderSummary | null;
  loaders: {
    transactions: boolean;
    dues: boolean;
    payment: boolean;
    ledgers: boolean;
    reminder: boolean;
    reminderAsset: boolean;
    dueOrderSummary: boolean;
    deleteDue: boolean;
  };
}

export interface IProcessPaymentPayload {
  data: IPaymentPayload;
  onCallback?: (status: boolean) => void;
}

export interface IAddReminderPayload {
  data: IReminderPayload;
  onCallback?: (status: boolean) => void;
}

export interface IUpdateReminderPayload {
  id: number;
  data: IReminderPayload;
  onCallback?: (status: boolean) => void;
}

export interface IReminderFormData {
  title: string;
  property?: number;
  frequency: number;
  date: string;
  category: number;
  leaseUnit?: number;
  rent?: string;
  bankAccount?: number;
  owner?: number;
  tenant?: number;
  society?: number;
  paidBy?: number;
  maintenanceAmount?: string;
}

export interface IOrderSummaryPayload {
  id: number;
  onCallback?: (status: boolean) => void;
}

export interface IUpdateSummary extends IOrderSummaryPayload {
  payload: IDueOrderSummaryAction;
}
