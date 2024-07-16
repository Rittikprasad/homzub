import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import ConfirmationSheet from '@homzhub/mobile/src/components/molecules/ConfirmationSheet';
import VerificationSheet from '@homzhub/mobile/src/components/molecules/VerificationSheet';
import ReminderForm from '@homzhub/common/src/components/organisms/ReminderForm';
import { IAddReminder, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const AddReminderScreen = (): React.ReactElement => {
  const { goBack, navigate } = useNavigation();
  const { params } = useRoute();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loaders = useSelector(FinancialSelectors.getFinancialLoaders);
  const { societyCharges } = useSelector(PropertyPaymentSelector.getPropertyPaymentLoaders);
  const [isLoading, setLoading] = useState(false);
  const [isSheetVisible, setSheetVisibility] = useState(false);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [flags, setFlagValues] = useState({
    showConfirmationSheet: false,
    isCheckboxSelected: false,
    isConfirmed: false,
  });
  const selectedReminderId = useSelector(FinancialSelectors.getCurrentReminderId);

  const param = params as IAddReminder;

  const onPressIcon = (visible: boolean): void => {
    setSheetVisibility(visible);
  };

  const onPressDelete = async (): Promise<void> => {
    try {
      await LedgerRepository.deleteReminderById(selectedReminderId);
      goBack();
      onPressIcon(false);
      AlertHelper.success({ message: t('assetFinancial:reminderDeleteMsg') });
    }catch (e: any) {      onPressIcon(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  const handleAddAccount = (id?: number): void => {
    navigate(ScreensKeys.AddBankAccount, { id });
  };

  const handleConfirmationSheet = (value: boolean): void => {
    setFlagValues({ ...flags, showConfirmationSheet: value });
    if (!value) {
      setFlagValues({ ...flags, isCheckboxSelected: false });
    }
  };

  const handleCheckBox = (): void => {
    setFlagValues({ ...flags, isCheckboxSelected: !flags.isCheckboxSelected });
  };

  const onProceed = (): void => {
    setFlagValues({ ...flags, isConfirmed: true, showConfirmationSheet: false });
  };

  const handleError = (isConfirm: boolean): void => {
    setFlagValues({ ...flags, isConfirmed: isConfirm, isCheckboxSelected: false });
  };

  const onAddSociety = (): void => {
    navigate(ScreensKeys.SocietyController, { fromReminder: true });
  };

  const onSubmitSuccess = (isEdit: boolean): void => {
    goBack();
    if (!isEdit) {
      dispatch(
        CommonActions.setReviewReferData({ message: t('assetFinancial:reminderSuccessMsg'), isSheetVisible: true })
      );
    }
  };

  return (
    <>
      <Screen
        backgroundColor={theme.colors.white}
        isLoading={loaders.reminder || isLoading || societyCharges}
        keyboardShouldPersistTaps
        headerProps={{
          title: param?.isEdit ? t('assetFinancial:editReminder') : t('assetFinancial:addReminders'),
          type: 'secondary',
          onIconPress: goBack,
          ...(showDeleteIcon && { iconRight: icons.trash, onIconRightPress: (): void => onPressIcon(true) }),
        }}
      >
        <ReminderForm
          onSubmit={onSubmitSuccess}
          isEdit={param?.isEdit ?? false}
          isFromDues={param?.isFromDues ?? false}
          setLoading={setLoading}
          onAddSociety={onAddSociety}
          onAddAccount={handleAddAccount}
          setShowDeleteIcon={setShowDeleteIcon}
          isConfirmed={flags.isConfirmed}
          handleConfirmation={(): void => handleConfirmationSheet(true)}
          onError={handleError}
        />
      </Screen>
      <ConfirmationSheet
        isVisible={isSheetVisible}
        sheetTitle={t('common:delete')}
        message={t('property:deleteConfirmation', { name: t('assetFinancial:thisReminder') })}
        onCloseSheet={(): void => onPressIcon(false)}
        onPressDelete={onPressDelete}
      />
      <VerificationSheet
        isVisible={flags.showConfirmationSheet}
        isCheckboxSelected={flags.isCheckboxSelected}
        onCloseSheet={(): void => handleConfirmationSheet(false)}
        handleCheckBox={handleCheckBox}
        onProceed={onProceed}
      />
    </>
  );
};

export default AddReminderScreen;
