import React, { useEffect, useState, useRef, ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { UploadBoxComponent } from '@homzhub/web/src/components/molecules/UploadBoxComponent';
import AddRecordForm, { IUploadCompProps } from '@homzhub/common/src/components/organisms/AddRecordForm';
import Transactions from '@homzhub/web/src/screens/financials/Transactions';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  assetId: number;
}

const FinancialsTab: React.FC<IProps> = (props: IProps) => {
  const { assetId } = props;
  const popupRef = useRef<PopupActions>(null);
  const { t } = useTranslation();
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);
  const [clearForm, setClearForm] = useState(0);
  const [isEditRecord, setIsEditRecord] = useState(false);
  const [transactionId, setTransactionId] = useState(-1);
  const dispatch = useDispatch();
  const { getTransactions, getLedgerMetrics } = FinancialActions;
  const isDesktop = useOnly(deviceBreakpoint.DESKTOP);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const currency = useSelector((state: IState) => UserSelector.getCurrency(state));
  const assets = useSelector((state: IState) => UserSelector.getUserAssets(state));
  const transactionsData = useSelector((state: IState) => FinancialSelectors.getTransactionRecords(state));

  useEffect(() => {
    dispatch(UserActions.getAssets());
  }, []);
  const onOpenModal = (isEdit: boolean, argTransactionId = -1): void => {
    if (isEdit) {
      setIsEditRecord(isEdit);
      setTransactionId(argTransactionId);
    }
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };
  const onCloseModal = (): void => {
    if (popupRef && popupRef.current) {
      setIsEditRecord(false);
      popupRef.current.close();
    }
  };
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

  const getGeneralLedgers = (reset = false): void => {
    dispatch(
      getTransactions({
        offset: reset ? 0 : transactionsData.length,
        limit: 10,
        asset_id: assetId,
      })
    );
  };

  const onSubmitFormSuccess = (): void => {
    onCloseModal();
    setIsEditRecord(false);
    getGeneralLedgers(true);
    AlertHelper.success({
      message: t(isEditRecord ? 'assetFinancial:editedSuccessfullyMessage' : 'assetFinancial:addedSuccessfullyMessage'),
    });
  };

  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
            {t('assetFinancial:addRecords')}
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
        <View style={styles.modalContent}>
          <AddRecordForm
            assetId={assetId}
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
            isFromDues={false}
          />
        </View>
      </View>
    );
  };
  const onDeleteRecord = async (currentTransactionId: number): Promise<void> => {
    if (currentTransactionId > -1) {
      try {
        await LedgerRepository.deleteLedger(currentTransactionId);
        getGeneralLedgers(true);
        setTransactionId(-1);
        dispatch(getLedgerMetrics());
        AlertHelper.success({ message: t('assetFinancial:deletedSuccessfullyMessage') });
      } catch (e: any) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
  };
  return (
    <View>
      <Transactions onOpenModal={onOpenModal} isAddRecord onDeleteRecord={onDeleteRecord} />
      <Popover
        content={renderPopoverContent()}
        popupProps={{
          closeOnDocumentClick: false,
          arrow: false,
          contentStyle: {
            height: '480px',
            width: isDesktop ? '75%' : isTablet ? '60%' : '90%',
            maxHeight: '100%',
            borderRadius: 8,
          },
          children: undefined,
          modal: true,
          position: 'center center',
          onClose: onCloseModal,
        }}
        forwardedRef={popupRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addFormContainer: {
    marginTop: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  modalContent: {
    padding: 24,
    height: 400,
    overflowY: 'scroll',
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
});

export default FinancialsTab;
