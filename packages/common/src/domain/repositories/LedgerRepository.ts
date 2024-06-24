import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Dues } from '@homzhub/common/src/domain/models/Dues';
import { DueOrderSummary } from '@homzhub/common/src/domain/models/DueOrderSummary';
import { FinancialRecords, FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { LedgerCategory } from '@homzhub/common/src/domain/models/LedgerCategory';
import { Reminder } from '@homzhub/common/src/domain/models/Reminder';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IAddGeneralLedgerPayload,
  ICreateLedgerResult,
  IDueOrderSummaryAction,
  IGeneralLedgerPayload,
  IReminderPayload,
  ITransactionParams,
} from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  getGeneralLedgers: 'v1/general-ledgers/overall-performances/',
  getLedgerCategories: 'v1/general-ledger-categories/',
  genLedgers: 'v1/general-ledgers/',
  ledger: (id: number): string => `v1/general-ledgers/${id}/`,
  getDues: (): string => 'v1/user-invoices/dues/',
  duesById: (id: number): string => `v1/user-invoices/dues/${id}/`,
  dueOrderPayment: (id: number): string => `v1/user-invoices/dues/${id}/razorpay-orders/`,
  reminders: 'v1/reminders/',
  reminderCategories: 'v1/reminders/reminder-categories/',
  reminderFrequencies: 'v1/reminders/reminder-frequencies/',
  reminderAssets: 'v1/reminders/assets/',
  offlinePaymentModes: 'v1/list-of-values/offline-modes-of-payment/',
  reminderById: (id: number): string => `v1/reminders/${id}/`,
};

class LedgerRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getLedgerPerformances = async (requestPayload: IGeneralLedgerPayload): Promise<GeneralLedgers[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getGeneralLedgers, requestPayload);
    return ObjectMapper.deserializeArray(GeneralLedgers, response);
  };

  public getLedgerCategories = async (): Promise<LedgerCategory[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getLedgerCategories);
    return ObjectMapper.deserializeArray(LedgerCategory, response);
  };

  public postGeneralLedgers = async (payload: IAddGeneralLedgerPayload): Promise<ICreateLedgerResult> => {
    return await this.apiClient.post(ENDPOINTS.genLedgers, payload);
  };

  public updateGeneralLedgers = async (
    payload: IAddGeneralLedgerPayload,
    ledgerId: number
  ): Promise<ICreateLedgerResult> => {
    return await this.apiClient.put(ENDPOINTS.ledger(ledgerId), payload);
  };

  public getGeneralLedgers = async (params: ITransactionParams): Promise<FinancialTransactions> => {
    const response = await this.apiClient.get(ENDPOINTS.genLedgers, params);
    return ObjectMapper.deserialize(FinancialTransactions, response);
  };

  public getLedgerDetails = async (ledgerId: number): Promise<FinancialRecords> => {
    const response = await this.apiClient.get(ENDPOINTS.ledger(ledgerId));
    return ObjectMapper.deserialize(FinancialRecords, response);
  };

  public deleteLedger = async (ledgerId: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.ledger(ledgerId));
  };

  public getDues = async (): Promise<Dues> => {
    const response = await this.apiClient.get(ENDPOINTS.getDues());
    return ObjectMapper.deserialize(Dues, response);
  };

  public getReminderCategories = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.reminderCategories);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getReminderFrequencies = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.reminderFrequencies);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public addReminder = async (payload: IReminderPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.reminders, payload);
  };

  public getReminders = async (): Promise<Reminder[]> => {
    const response = await this.apiClient.get(ENDPOINTS.reminders);
    return ObjectMapper.deserializeArray(Reminder, response);
  };

  public getReminderAssets = async (): Promise<Asset[]> => {
    const response = await this.apiClient.get(ENDPOINTS.reminderAssets);
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public getOfflinePaymentModes = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.offlinePaymentModes);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getReminderById = async (id: number): Promise<Reminder> => {
    const response = await this.apiClient.get(ENDPOINTS.reminderById(id));
    return ObjectMapper.deserialize(Reminder, response);
  };

  public deleteReminderById = async (id: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.reminderById(id));
  };

  public updateReminder = async (id: number, payload: IReminderPayload): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.reminderById(id), payload);
  };

  public getDueOrderSummary = async (id: number): Promise<DueOrderSummary> => {
    const response = await this.apiClient.get(ENDPOINTS.duesById(id));
    return ObjectMapper.deserialize(DueOrderSummary, response);
  };

  public dueOrderSummaryAction = async (id: number, payload: IDueOrderSummaryAction): Promise<DueOrderSummary> => {
    const response = await this.apiClient.put(ENDPOINTS.dueOrderPayment(id), payload);
    return ObjectMapper.deserialize(DueOrderSummary, response);
  };

  public deleteDue = async (id: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.duesById(id));
  };
}

const ledgerRepository = new LedgerRepository();
export { ledgerRepository as LedgerRepository };
