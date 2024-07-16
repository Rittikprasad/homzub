/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeLatest } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PaymentRepository } from '@homzhub/common/src/domain/repositories/PaymentRepository';
import { PropertyRepository } from '@homzhub/common/src/domain/repositories/PropertyRepository';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import {
  PropertyPaymentActions,
  PropertyPaymentActionTypes,
} from '@homzhub/common/src/modules/propertyPayment/actions';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { InvoiceId } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { Society } from '@homzhub/common/src/domain/models/Society';
import { SocietyCharge } from '@homzhub/common/src/domain/models/SocietyCharge';
import { SocietyReminder } from '@homzhub/common/src/domain/models/SocietyReminder';
import { IAssetSocietyPayload, ISocietyParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { IFluxStandardAction, VoidGenerator } from '@homzhub/common/src/modules/interfaces';
import {
  ICreateSociety,
  IGetSocietyPayload,
  IInvoicePayload,
  ISocietyDataPayload,
  IUpdateSociety,
} from '@homzhub/common/src/modules/propertyPayment/interfaces';
import { MenuEnum } from '@homzhub/common/src/constants/Society';

export function* getSocieties(action: IFluxStandardAction<ISocietyParam>): VoidGenerator {
  try {
    const response = yield call(PropertyRepository.getSocieties, action.payload as ISocietyParam);
    yield put(PropertyPaymentActions.getSocietiesSuccess(response as Society[]));
  }catch (e: any) {    yield put(PropertyPaymentActions.getSocietiesFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* createSociety(action: IFluxStandardAction<ICreateSociety>): VoidGenerator {
  if (!action.payload) return;
  const { payload, onCallback } = action.payload;
  try {
    yield call(PropertyRepository.createSociety, payload);
    yield put(AssetActions.getActiveAssets());
    yield put(PropertyPaymentActions.createSocietySuccess());
    if (onCallback) {
      onCallback(true);
    }
  }catch (e: any) {    if (onCallback) {
      onCallback(false);
    }
    yield put(PropertyPaymentActions.createSocietyFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getSocietyDetail(action: IFluxStandardAction<IGetSocietyPayload>): VoidGenerator {
  if (!action.payload) return;
  const { societyId, isForUpdate } = action.payload;
  try {
    const response = yield call(PropertyRepository.getSociety, societyId);
    yield put(PropertyPaymentActions.getSocietyDetailSuccess(response as Society));
    if (isForUpdate && response) {
      // @ts-ignore
      const { projectName } = yield select(PropertyPaymentSelector.getSelectedAsset);
      const {
        project,
        contactName,
        contactEmail,
        contactNumber,
        name,
        societyBankInfo: { beneficiaryName, bankName, accountNumber, ifscCode },
      } = response as Society;
      // Updating Society form Data
      yield put(
        PropertyPaymentActions.setSocietyFormData({
          projectName: project.name,
          propertyName: projectName,
          societyName: name,
          contactNumber,
          email: contactEmail,
          name: contactName,
        })
      );
      // Updating Bank form Data
      yield put(
        PropertyPaymentActions.setSocietyBankData({
          beneficiary_name: beneficiaryName,
          bank_name: bankName,
          account_number: accountNumber,
          ifsc_code: ifscCode,
        })
      );
    }
  }catch (e: any) {    yield put(PropertyPaymentActions.getSocietyDetailFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* updateSociety(action: IFluxStandardAction<IUpdateSociety>): VoidGenerator {
  if (!action.payload) return;
  const { action: updateAction, societyId, onCallback, payload } = action.payload;
  try {
    if (updateAction === MenuEnum.EDIT && payload) {
      yield call(PropertyRepository.updateSociety, societyId, payload);
      AlertHelper.success({ message: I18nService.t('propertyPayment:societyUpdated') });
    } else {
      yield call(PropertyRepository.deleteSociety, societyId);
      AlertHelper.success({ message: I18nService.t('propertyPayment:societyDeleted') });
    }
    yield put(PropertyPaymentActions.updateSocietySuccess());
    if (onCallback) {
      onCallback(true);
    }
  }catch (e: any) {    if (onCallback) {
      onCallback(false);
    }
    yield put(PropertyPaymentActions.updateSocietyFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* addAssetSociety(action: IFluxStandardAction<IAssetSocietyPayload>): VoidGenerator {
  try {
    yield call(PropertyRepository.addAssetSociety, action.payload as IAssetSocietyPayload);
    yield put(PropertyPaymentActions.addAssetSocietySuccess());
    yield put(AssetActions.getActiveAssets());
  }catch (e: any) {    yield put(PropertyPaymentActions.addAssetSocietyFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getSocietyCharges(action: IFluxStandardAction<ISocietyDataPayload>): VoidGenerator {
  if (!action.payload) return;
  const { id, onCallback } = action.payload;
  try {
    const response = yield call(PropertyRepository.getSocietyCharges, id);
    yield put(PropertyPaymentActions.getSocietyChargesSuccess(response as SocietyCharge));
    if (onCallback && response) {
      const data = response as SocietyCharge;
      if (data.maintenance.amount) {
        onCallback(true, data.maintenance.amount);
      }
    }
  }catch (e: any) {    if (onCallback) {
      onCallback(false);
    }
    yield put(PropertyPaymentActions.getSocietyChargesFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getUserInvoice(action: IFluxStandardAction<IInvoicePayload>): VoidGenerator {
  if (!action.payload) return;
  const { data, onCallback } = action.payload;
  try {
    const response = yield call(PaymentRepository.getInvoice, data);
    yield put(PropertyPaymentActions.getUserInvoiceSuccess(response as InvoiceId));
    if (onCallback) {
      onCallback(true);
    }
  }catch (e: any) {    if (onCallback) {
      onCallback(false);
    }
    yield put(PropertyPaymentActions.getUserInvoiceFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getSocietyReminders(action: IFluxStandardAction<ISocietyDataPayload>): VoidGenerator {
  if (!action.payload) return;
  const { id, onCallback } = action.payload;
  try {
    const response = yield call(PropertyRepository.getSocietyReminders, id);
    yield put(PropertyPaymentActions.getSocietyRemindersSuccess(response as SocietyReminder));
    if (onCallback && response) {
      const data = response as SocietyReminder;
      onCallback(true, data.reminders.length);
    }
  }catch (e: any) {    if (onCallback) {
      onCallback(false);
    }
    yield put(PropertyPaymentActions.getSocietyRemindersFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* watchPropertyPayment() {
  yield takeLatest(PropertyPaymentActionTypes.GET.SOCIETIES, getSocieties);
  yield takeLatest(PropertyPaymentActionTypes.POST.SOCIETY, createSociety);
  yield takeLatest(PropertyPaymentActionTypes.GET.SOCIETY_DETAIL, getSocietyDetail);
  yield takeLatest(PropertyPaymentActionTypes.POST.UPDATE_SOCIETY, updateSociety);
  yield takeLatest(PropertyPaymentActionTypes.POST.ASSET_SOCIETY, addAssetSociety);
  yield takeLatest(PropertyPaymentActionTypes.GET.SOCIETY_CHARGES, getSocietyCharges);
  yield takeLatest(PropertyPaymentActionTypes.POST.USER_INVOICE, getUserInvoice);
  yield takeLatest(PropertyPaymentActionTypes.GET.SOCIETY_REMINDERS, getSocietyReminders);
}
