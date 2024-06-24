import React, { ReactElement, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { UploadBoxComponent } from '@homzhub/web/src/components/molecules/UploadBoxComponent';
import AddBankAccountPopover from '@homzhub/web/src/components/organisms/AddBankAccountPopover';
import AddRecordForm, { IUploadCompProps } from '@homzhub/common/src/components/organisms/AddRecordForm';
import ReminderForm from '@homzhub/common/src/components/organisms/ReminderForm';
import PropertyList from '@homzhub/web/src/screens/financials/components/PropertyList';
import PropertyServices from '@homzhub/web/src/screens/financials/components/PropertyServices';
import SocietyController from '@homzhub/web/src/screens/financials/components/SocietyController';
import SocietyOrderSummary from '@homzhub/web/src/screens/financials/components/SocietyOrderSummary';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  popupRef: React.RefObject<PopupActions>;
  onCloseModal: () => void;
  financialsActionType: FinancialsActions | null;
  setFinancialsActionType: React.Dispatch<React.SetStateAction<FinancialsActions | null>>;
  handleFinancialsAction?: (value: FinancialsActions) => void;
  currency: Currency;
  assets: Asset[];
  isEditRecord: boolean;
  setIsEditRecord: (isEdit: boolean) => void;
  transactionId: number;
  getGeneralLedgers: (reset: boolean) => void;
  isFromDues: boolean;
  setIsFromDues: (isFromDues: boolean) => void;
}

export enum FinancialsActions {
  AddReminder = 'Add Reminder',
  AddRecord = 'Add Record',
  EditReminder = 'Edit Reminder',
  PropertyPayment_SelectProperties = 'Property Payment Select Properties',
  PropertyPayment_PropertyServices = 'Property Payment Property Services',
  PropertyPayment_SocietyController = 'Property Payment Society Controller',
  PropertyPayment_PayNow = 'Property Payment Pay Now',
}

export interface INavProps {
  isFromSummary: boolean;
}

const FinancialsPopover: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);
  const [propsPropertyServices, setPropsPropertyServices] = useState<INavProps>({
    isFromSummary: false,
  });
  const [ownerId, setOwnerId] = useState(0);
  const [clearForm, setClearForm] = useState(0);
  const dispatch = useDispatch();
  const {
    popupRef,
    onCloseModal,
    financialsActionType,
    setFinancialsActionType,
    currency,
    assets,
    isEditRecord,
    setIsEditRecord,
    transactionId,
    getGeneralLedgers,
    isFromDues,
    setIsFromDues,
  } = props;
  const isDesktop = useOnly(deviceBreakpoint.DESKTOP);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const onPressLink = (link: string): void => {
    const options = {
      path: link,
    };
    NavigationService.openNewTab(options);
  };
  const onClearPress = (): void => {
    setClearForm((prevstate) => prevstate + 1);
  };

  const toggleLoading = (loading: boolean): void => {
    setIsLoading(loading);
  };

  const renderUploadBoxComponent = (
    renderAttachements: () => React.ReactNode,
    uploadProps: IUploadCompProps
  ): ReactElement => {
    return <UploadBoxComponent {...uploadProps}>{renderAttachements()}</UploadBoxComponent>;
  };

  const onSubmitFormSuccess = (): void => {
    onCloseModal();
    setIsEditRecord(false);
    if (isFromDues) {
      setIsFromDues(false);
      dispatch(FinancialActions.getDues());
    }
    getGeneralLedgers(true);
    AlertHelper.success({
      message: t(isEditRecord ? 'assetFinancial:editedSuccessfullyMessage' : 'assetFinancial:addedSuccessfullyMessage'),
    });
  };

  const onSubmitReminder = (): void => {
    onCloseModal();
    dispatch(FinancialActions.getReminders());
  };

  const popupRefBank = useRef<PopupActions>(null);

  const onOpenBankModal = (): void => {
    if (popupRefBank && popupRefBank.current) {
      popupRefBank.current.open();
    }
  };
  const onCloseBankModal = (): void => {
    if (popupRefBank && popupRefBank.current) {
      popupRefBank.current.close();
    }
  };

  const onAddBankAccount = (id?: number): void => {
    if (id) {
      setOwnerId(id);
    }
    onOpenBankModal();
  };

  const renderActionsPopover = (): React.ReactNode | null => {
    switch (financialsActionType) {
      case FinancialsActions.AddReminder:
        return (
          <ReminderForm onSubmit={onSubmitReminder} onAddSociety={FunctionUtils.noop} onAddAccount={onAddBankAccount} />
        );
      case FinancialsActions.EditReminder:
        return (
          <ReminderForm
            onSubmit={onSubmitReminder}
            onAddSociety={FunctionUtils.noop}
            onAddAccount={onAddBankAccount}
            isEdit
          />
        );
      case FinancialsActions.AddRecord:
        return (
          <AddRecordForm
            properties={assets}
            clear={clearForm}
            defaultCurrency={currency}
            onFormClear={onClearPress}
            toggleLoading={toggleLoading}
            onSubmitFormSuccess={onSubmitFormSuccess}
            transactionId={transactionId}
            renderUploadBoxComponent={renderUploadBoxComponent}
            onPressLink={onPressLink}
            containerStyles={styles.addFormContainer}
            isEditFlow={isEditRecord}
            isDesktopWeb={isDesktop}
            isFromDues={isFromDues}
          />
        );
      case FinancialsActions.PropertyPayment_SelectProperties:
        return <PropertyList setFinancialsActionType={setFinancialsActionType} />;
      case FinancialsActions.PropertyPayment_PropertyServices:
        return <PropertyServices setFinancialsActionType={setFinancialsActionType} {...propsPropertyServices} />;
      case FinancialsActions.PropertyPayment_SocietyController:
        return <SocietyController setFinancialsActionType={setFinancialsActionType} />;
      case FinancialsActions.PropertyPayment_PayNow:
        return (
          <SocietyOrderSummary
            setFinancialsActionType={setFinancialsActionType}
            setPropsPropertyServices={setPropsPropertyServices}
          />
        );
      default:
        return null;
    }
  };

  const financialsPopoverTypes = {
    [FinancialsActions.AddReminder.toString()]: {
      title: t('assetFinancial:addReminder'),
      styles: {
        height: '500px',
        width: isDesktop ? '480px' : isTablet ? '480px' : '90%',
      },
    },
    [FinancialsActions.EditReminder.toString()]: {
      title: t('assetFinancial:editReminder'),
      styles: {
        height: '500px',
        width: isDesktop ? '480px' : isTablet ? '480px' : '90%',
      },
    },
    [FinancialsActions.AddRecord.toString()]: {
      title: t('assetFinancial:addRecords'),
      styles: {
        height: '480px',
        width: isDesktop ? '75%' : isTablet ? '60%' : '90%',
      },
    },
    [FinancialsActions.PropertyPayment_SelectProperties.toString()]: {
      title: t('propertyPayment:propertyPayment'),
    },
    [FinancialsActions.PropertyPayment_PropertyServices.toString()]: {
      title: t('propertyPayment:propertyPayment'),
    },
    [FinancialsActions.PropertyPayment_SocietyController.toString()]: {
      title: t('propertyPayment:propertyPayment'),
    },
    [FinancialsActions.PropertyPayment_PayNow.toString()]: {
      title: t('property:orderSummary'),
    },
  };
  const financialPopoverType = financialsActionType && financialsPopoverTypes[financialsActionType?.toString()];
  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
            {financialPopoverType?.title}
          </Typography>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint7}
            onPress={onCloseModal}
            containerStyle={styles.closeButton}
          />
        </View>
        <Divider containerStyles={styles.verticalStyle} />
        <View style={styles.modalContent}>{renderActionsPopover()}</View>
      </View>
    );
  };
  return (
    <View>
      <Popover
        content={renderPopoverContent}
        popupProps={{
          closeOnDocumentClick: false,
          arrow: false,
          contentStyle: {
            maxHeight: '100%',
            borderRadius: 8,
            height: 600,
            width: isDesktop ? '480px' : isTablet ? '480px' : '90%',
            overflow: 'auto',
            ...financialPopoverType?.styles,
          },
          children: undefined,
          modal: true,
          position: 'center center',
          onClose: onCloseModal,
        }}
        forwardedRef={popupRef}
      />
      <Loader visible={isLoading} />
      <AddBankAccountPopover popupRef={popupRefBank} onCloseModal={onCloseBankModal} id={ownerId} />
    </View>
  );
};

export default FinancialsPopover;

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  modalContent: {
    padding: 24,
  },
  verticalStyle: {
    marginTop: 20,
  },
  closeButton: {
    zIndex: 1,
    position: 'absolute',
    right: 12,
    cursor: 'pointer',
    color: theme.colors.darkTint7,
  },
  addFormContainer: {
    marginTop: 24,
  },
  uploadBox: {
    marginTop: 20,
    marginBottom: 32,
  },
});
