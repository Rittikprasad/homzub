import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { InvoiceId } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { ISociety, Society } from '@homzhub/common/src/domain/models/Society';
import { ISocietyCharge, SocietyCharge } from '@homzhub/common/src/domain/models/SocietyCharge';
import { ISocietyReminder, SocietyReminder } from '@homzhub/common/src/domain/models/SocietyReminder';
import {
  IAssetSocietyPayload,
  IBankInfoPayload,
  ISocietyParam,
  ISocietyPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import {
  ICreateSociety,
  IGetSocietyPayload,
  IInvoicePayload,
  IPaymentData,
  ISocietyDataPayload,
  ISocietyFormData,
  IUpdateSociety,
} from '@homzhub/common/src/modules/propertyPayment/interfaces';

const actionTypePrefix = 'PropertyPayment/';
export const PropertyPaymentActionTypes = {
  SET: {
    SELECTED_ASSET_ID: `${actionTypePrefix}SELECTED_ASSET_ID`,
    SOCIETY_FORM_DATA: `${actionTypePrefix}SOCIETY_FORM_DATA`,
    SOCIETY_BANK_DATA: `${actionTypePrefix}SOCIETY_BANK_DATA`,
    SELECTED_SOCIETY_ID: `${actionTypePrefix}SELECTED_SOCIETY_ID`,
    PAYMENT_DATA: `${actionTypePrefix}PAYMENT_DATA`,
  },
  GET: {
    SOCIETIES: `${actionTypePrefix}SOCIETIES`,
    SOCIETIES_SUCCESS: `${actionTypePrefix}SOCIETIES_SUCCESS`,
    SOCIETIES_FAILURE: `${actionTypePrefix}SOCIETIES_FAILURE`,
    SOCIETY_DETAIL: `${actionTypePrefix}SOCIETY_DETAIL`,
    SOCIETY_DETAIL_SUCCESS: `${actionTypePrefix}SOCIETY_DETAIL_SUCCESS`,
    SOCIETY_DETAIL_FAILURE: `${actionTypePrefix}SOCIETY_DETAIL_FAILURE`,
    SOCIETY_CHARGES: `${actionTypePrefix}SOCIETY_CHARGES`,
    SOCIETY_CHARGES_SUCCESS: `${actionTypePrefix}SOCIETY_CHARGES_SUCCESS`,
    SOCIETY_CHARGES_FAILURE: `${actionTypePrefix}SOCIETY_CHARGES_FAILURE`,
    SOCIETY_REMINDERS: `${actionTypePrefix}SOCIETY_REMINDERS`,
    SOCIETY_REMINDERS_SUCCESS: `${actionTypePrefix}SOCIETY_REMINDERS_SUCCESS`,
    SOCIETY_REMINDERS_FAILURE: `${actionTypePrefix}SOCIETY_REMINDERS_FAILURE`,
  },
  POST: {
    SOCIETY: `${actionTypePrefix}SOCIETY`,
    SOCIETY_SUCCESS: `${actionTypePrefix}SOCIETY_SUCCESS`,
    SOCIETY_FAILURE: `${actionTypePrefix}SOCIETY_FAILURE`,
    UPDATE_SOCIETY: `${actionTypePrefix}UPDATE_SOCIETY`,
    UPDATE_SOCIETY_SUCCESS: `${actionTypePrefix}UPDATE_SOCIETY_SUCCESS`,
    UPDATE_SOCIETY_FAILURE: `${actionTypePrefix}UPDATE_SOCIETY_FAILURE`,
    ASSET_SOCIETY: `${actionTypePrefix}ASSET_SOCIETY`,
    ASSET_SOCIETY_SUCCESS: `${actionTypePrefix}ASSET_SOCIETY_SUCCESS`,
    ASSET_SOCIETY_FAILURE: `${actionTypePrefix}ASSET_SOCIETY_FAILURE`,
    USER_INVOICE: `${actionTypePrefix}USER_INVOICE`,
    USER_INVOICE_SUCCESS: `${actionTypePrefix}USER_INVOICE_SUCCESS`,
    USER_INVOICE_FAILURE: `${actionTypePrefix}USER_INVOICE_FAILURE`,
  },
  CLEAR_SOCIETY_FORM_DATA: `${actionTypePrefix}CLEAR_SOCIETY_FORM_DATA`,
  CLEAR_SOCIETY_DETAIL: `${actionTypePrefix}CLEAR_SOCIETY_DETAIL`,
  CLEAR_PAYMENT_DATA: `${actionTypePrefix}CLEAR_PAYMENT_DATA`,
  RESET_PAYMENT_STATE: `${actionTypePrefix}REST_PAYMENT_STATE`,
};

const setAssetId = (assetId: number): IFluxStandardAction<number> => ({
  type: PropertyPaymentActionTypes.SET.SELECTED_ASSET_ID,
  payload: assetId,
});

const getSocieties = (payload?: ISocietyParam): IFluxStandardAction<ISocietyParam> => ({
  type: PropertyPaymentActionTypes.GET.SOCIETIES,
  payload,
});

const getSocietiesSuccess = (payload: Society[]): IFluxStandardAction<ISociety[]> => ({
  type: PropertyPaymentActionTypes.GET.SOCIETIES_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getSocietiesFailure = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.GET.SOCIETIES_FAILURE,
});

const setSocietyFormData = (payload: ISocietyFormData): IFluxStandardAction<ISocietyFormData> => ({
  type: PropertyPaymentActionTypes.SET.SOCIETY_FORM_DATA,
  payload,
});

const clearSocietyFormData = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.CLEAR_SOCIETY_FORM_DATA,
});

const createSociety = (payload: ICreateSociety): IFluxStandardAction<ICreateSociety> => ({
  type: PropertyPaymentActionTypes.POST.SOCIETY,
  payload,
});

const createSocietySuccess = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.POST.SOCIETY_SUCCESS,
});

const createSocietyFailure = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.POST.SOCIETY_FAILURE,
});

const setSocietyBankData = (payload: IBankInfoPayload): IFluxStandardAction<IBankInfoPayload> => ({
  type: PropertyPaymentActionTypes.SET.SOCIETY_BANK_DATA,
  payload,
});

const getSocietyDetail = (payload: IGetSocietyPayload): IFluxStandardAction<IGetSocietyPayload> => ({
  type: PropertyPaymentActionTypes.GET.SOCIETY_DETAIL,
  payload,
});

const getSocietyDetailSuccess = (payload: Society): IFluxStandardAction<ISociety> => ({
  type: PropertyPaymentActionTypes.GET.SOCIETY_DETAIL_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getSocietyDetailFailure = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.GET.SOCIETY_DETAIL_FAILURE,
});

const updateSociety = (payload: IUpdateSociety): IFluxStandardAction<IUpdateSociety> => ({
  type: PropertyPaymentActionTypes.POST.UPDATE_SOCIETY,
  payload,
});

const updateSocietySuccess = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.POST.UPDATE_SOCIETY_SUCCESS,
});

const updateSocietyFailure = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.POST.UPDATE_SOCIETY_FAILURE,
});

const setSocietyId = (societyId: number): IFluxStandardAction<number> => ({
  type: PropertyPaymentActionTypes.SET.SELECTED_SOCIETY_ID,
  payload: societyId,
});

const clearSocietyDetail = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.CLEAR_SOCIETY_DETAIL,
});

const addAssetSociety = (payload: IAssetSocietyPayload): IFluxStandardAction<IAssetSocietyPayload> => ({
  type: PropertyPaymentActionTypes.POST.ASSET_SOCIETY,
  payload,
});

const addAssetSocietySuccess = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.POST.ASSET_SOCIETY_SUCCESS,
});

const addAssetSocietyFailure = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.POST.ASSET_SOCIETY_FAILURE,
});

const getSocietyCharges = (payload: ISocietyDataPayload): IFluxStandardAction<ISocietyDataPayload> => ({
  type: PropertyPaymentActionTypes.GET.SOCIETY_CHARGES,
  payload,
});

const getSocietyChargesSuccess = (payload: SocietyCharge): IFluxStandardAction<ISocietyCharge> => ({
  type: PropertyPaymentActionTypes.GET.SOCIETY_CHARGES_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getSocietyChargesFailure = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.GET.SOCIETY_CHARGES_FAILURE,
});

const getUserInvoice = (payload: IInvoicePayload): IFluxStandardAction<IInvoicePayload> => ({
  type: PropertyPaymentActionTypes.POST.USER_INVOICE,
  payload,
});

const getUserInvoiceSuccess = (payload: InvoiceId): IFluxStandardAction<InvoiceId> => ({
  type: PropertyPaymentActionTypes.POST.USER_INVOICE_SUCCESS,
  payload,
});

const getUserInvoiceFailure = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.POST.USER_INVOICE_FAILURE,
});

const setPaymentData = (payload: IPaymentData): IFluxStandardAction<IPaymentData> => ({
  type: PropertyPaymentActionTypes.SET.PAYMENT_DATA,
  payload,
});

const clearPaymentData = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.CLEAR_PAYMENT_DATA,
});

const resetPaymentState = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.RESET_PAYMENT_STATE,
});

const getSocietyReminders = (payload: ISocietyDataPayload): IFluxStandardAction<ISocietyDataPayload> => ({
  type: PropertyPaymentActionTypes.GET.SOCIETY_REMINDERS,
  payload,
});

const getSocietyRemindersSuccess = (payload: SocietyReminder): IFluxStandardAction<ISocietyReminder> => ({
  type: PropertyPaymentActionTypes.GET.SOCIETY_REMINDERS_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getSocietyRemindersFailure = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.GET.SOCIETY_REMINDERS_FAILURE,
});

export type ActionPayloadTypes =
  | number
  | ISocietyParam
  | ISociety[]
  | ISocietyFormData
  | ISocietyPayload
  | IBankInfoPayload
  | ISociety
  | IUpdateSociety
  | IGetSocietyPayload
  | ICreateSociety
  | IAssetSocietyPayload
  | ISocietyCharge
  | IInvoicePayload
  | InvoiceId
  | IPaymentData
  | ISocietyDataPayload
  | ISocietyReminder;

export const PropertyPaymentActions = {
  setAssetId,
  getSocieties,
  getSocietiesSuccess,
  getSocietiesFailure,
  setSocietyFormData,
  clearSocietyFormData,
  createSociety,
  createSocietySuccess,
  createSocietyFailure,
  setSocietyBankData,
  getSocietyDetail,
  getSocietyDetailSuccess,
  getSocietyDetailFailure,
  updateSociety,
  updateSocietySuccess,
  updateSocietyFailure,
  setSocietyId,
  clearSocietyDetail,
  addAssetSociety,
  addAssetSocietySuccess,
  addAssetSocietyFailure,
  getSocietyCharges,
  getSocietyChargesSuccess,
  getSocietyChargesFailure,
  getUserInvoice,
  getUserInvoiceSuccess,
  getUserInvoiceFailure,
  setPaymentData,
  clearPaymentData,
  resetPaymentState,
  getSocietyReminders,
  getSocietyRemindersSuccess,
  getSocietyRemindersFailure,
};
