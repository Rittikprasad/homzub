import { InvoiceId } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { ISociety } from '@homzhub/common/src/domain/models/Society';
import { ISocietyCharge } from '@homzhub/common/src/domain/models/SocietyCharge';
import { ISocietyReminder } from '@homzhub/common/src/domain/models/SocietyReminder';
import {
  IBankInfoPayload,
  IInvoiceSummaryPayload,
  ISocietyInvoicePayload,
  ISocietyPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { MenuEnum } from '@homzhub/common/src/constants/Society';

export interface IPropertyPaymentState {
  selectedAssetId: number;
  selectedSocietyId: number;
  societyFormData: ISocietyFormData;
  societyBankData: IBankInfoPayload | null;
  societies: ISociety[];
  societyDetail: ISociety | null;
  societyCharges: ISocietyCharge | null;
  userInvoice: InvoiceId;
  paymentData: IPaymentData;
  societyReminders: ISocietyReminder | null;
  loaders: {
    getSocieties: boolean;
    society: boolean;
    societyCharges: boolean;
    userInvoice: boolean;
    societyReminders: boolean;
  };
}

export interface ISocietyFormData {
  projectName: string;
  propertyName: string;
  societyName: string;
  name: string;
  contactNumber: string;
  email: string;
}

export interface IUpdateSociety {
  action: MenuEnum;
  societyId: number;
  payload?: ISocietyPayload;
  onCallback?: (status: boolean) => void;
}

export interface ICreateSociety {
  payload: ISocietyPayload;
  onCallback?: (status: boolean) => void;
}

export interface IGetSocietyPayload {
  societyId: number;
  isForUpdate?: boolean;
}

export interface IPaymentData extends ISocietyInvoicePayload {
  month: string;
  is_notify: boolean;
  society: number;
}

export interface IInvoicePayload {
  data: IInvoiceSummaryPayload;
  onCallback?: (status: boolean) => void;
}

export interface ISocietyDataPayload {
  id: number;
  onCallback?: (status: boolean, data?: number) => void;
}
