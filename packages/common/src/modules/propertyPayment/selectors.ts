import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { InvoiceId } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { Society } from '@homzhub/common/src/domain/models/Society';
import { SocietyCharge } from '@homzhub/common/src/domain/models/SocietyCharge';
import { SocietyReminder } from '@homzhub/common/src/domain/models/SocietyReminder';
import { IBankInfoPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  IPaymentData,
  IPropertyPaymentState,
  ISocietyFormData,
} from '@homzhub/common/src/modules/propertyPayment/interfaces';

const getSelectedAssetId = (state: IState): number => {
  const {
    propertyPayment: { selectedAssetId },
  } = state;
  return selectedAssetId;
};

const getSelectedAsset = (state: IState): Asset => {
  const assetId = getSelectedAssetId(state);
  const activeAssets = AssetSelectors.getUserActiveAssets(state);
  if (!assetId) return new Asset();
  const selectedAsset = activeAssets.find((item) => item.id === assetId);
  if (!selectedAsset) return new Asset();

  return selectedAsset;
};

const getSocieties = (state: IState): Society[] => {
  const {
    propertyPayment: { societies },
  } = state;
  if (societies.length < 1) return [];
  return ObjectMapper.deserializeArray(Society, societies);
};

const getPropertyPaymentLoaders = (state: IState): IPropertyPaymentState['loaders'] => {
  return state.propertyPayment.loaders;
};

const getSocietyFormData = (state: IState): ISocietyFormData => {
  const {
    propertyPayment: { societyFormData },
  } = state;

  const asset = getSelectedAsset(state);

  return {
    ...societyFormData,
    projectName: asset.project?.name ?? '',
    propertyName: asset.projectName,
  };
};

const getSocietyBankData = (state: IState): IBankInfoPayload | null => {
  const {
    propertyPayment: { societyBankData },
  } = state;

  return societyBankData;
};

const getSocietyDetails = (state: IState): Society | null => {
  const {
    propertyPayment: { societyDetail },
  } = state;

  if (!societyDetail) return null;

  return ObjectMapper.deserialize(Society, societyDetail);
};

const getSelectedSocietyId = (state: IState): number => {
  const {
    propertyPayment: { selectedSocietyId },
  } = state;
  return selectedSocietyId;
};

const getSocietyCharges = (state: IState): SocietyCharge | null => {
  const {
    propertyPayment: { societyCharges },
  } = state;

  if (!societyCharges) return null;

  return ObjectMapper.deserialize(SocietyCharge, societyCharges);
};

const getUserInvoice = (state: IState): InvoiceId => {
  const {
    propertyPayment: { userInvoice },
  } = state;

  if (!userInvoice) return new InvoiceId();

  return userInvoice;
};

const getPaymentData = (state: IState): IPaymentData => {
  const {
    propertyPayment: { paymentData },
  } = state;
  const asset = getSelectedAsset(state);
  const user = UserSelector.getUserProfile(state);
  const society = getSocietyCharges(state);

  return {
    ...paymentData,
    asset: asset.id,
    ...(paymentData.paid_by < 1 && { paid_by: user.id }),
    ...(paymentData.amount < 1 && society && society.maintenance.amount && { amount: society.maintenance.amount }),
    ...(asset.society && { society: asset.society.id }),
  };
};

const getSocietyReminders = (state: IState): SocietyReminder | null => {
  const {
    propertyPayment: { societyReminders },
  } = state;

  if (!societyReminders) return null;

  return ObjectMapper.deserialize(SocietyReminder, societyReminders);
};

export const PropertyPaymentSelector = {
  getSelectedAssetId,
  getSelectedAsset,
  getSocieties,
  getPropertyPaymentLoaders,
  getSocietyFormData,
  getSocietyBankData,
  getSocietyDetails,
  getSelectedSocietyId,
  getSocietyCharges,
  getUserInvoice,
  getPaymentData,
  getSocietyReminders,
};
