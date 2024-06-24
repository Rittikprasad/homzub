import React, { FC, useRef, useState, useContext, useEffect } from 'react';
import { PickerItemProps, StyleSheet, View } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useTranslation } from 'react-i18next';
import { uniqBy } from 'lodash';
import { bindActionCreators, Dispatch } from 'redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { AppLayoutContext } from '@homzhub/web/src/screens/appLayout/AppLayoutContext';
import { theme } from '@homzhub/common/src/styles/theme';
import { PropertyByCountryDropdown } from '@homzhub/common/src/components/molecules/PropertyByCountryDropdown';
import { PropertyVisualsEstimates } from '@homzhub/web/src/screens/dashboard/components/PropertyVisualEstimates';
import DueList from '@homzhub/web/src/screens/financials/Dues';
import Transactions from '@homzhub/web/src/screens/financials/Transactions';
import FinancialsPopover, { FinancialsActions } from '@homzhub/web/src/screens/financials/FinancialsPopover';
import ReminderList from '@homzhub/web/src/screens/financials/Reminders/ReminderList';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { FinancialRecords } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ITransactionParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IStateToProps {
  currency: Currency;
  assets: Asset[];
  selectedProperty: number;
  selectedCountry: number;
  transactionsData: FinancialRecords[];
}

interface IDispatchProps {
  setCurrentCountry: (country: number) => void;
  setCurrentProperty: (property: number) => void;
  getTransactions: (payload: ITransactionParams) => void;
  getLedgerMetrics: () => void;
}

type IProps = IStateToProps & IDispatchProps;

const Financials: FC<IProps> = (props: IProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isEditRecord, setIsEditRecord] = useState(false);
  const [isFromDues, setIsFromDues] = useState(false);
  const [transactionId, setTransactionId] = useState(-1);
  const {
    currency,
    assets,
    selectedCountry,
    selectedProperty,
    setCurrentCountry,
    setCurrentProperty,
    getLedgerMetrics,
  } = props;
  const { financialsActions, setFinancialsActions } = useContext(AppLayoutContext);
  const [financialsActionType, setFinancialsActionType] = useState<FinancialsActions | null>(null);
  const { isOpen } = financialsActions;
  useEffect(() => {
    if (isOpen) {
      setFinancialsActionType(financialsActions.financialsActionType);
      onOpenModal();
    }
    dispatch(UserActions.getAssets());
  }, [isOpen]);
  const popupRef = useRef<PopupActions>(null);
  const onOpenModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };
  const onCloseModal = (): void => {
    if (popupRef && popupRef.current) {
      setIsEditRecord(false);
      popupRef.current.close();
      setFinancialsActions({
        financialsActionType: financialsActions.financialsActionType,
        isOpen: false,
      });
    }
  };
  const onPropertyChange = (propertyId: number): void => {
    if (selectedProperty === propertyId) {
      return;
    }
    setCurrentProperty(propertyId);
  };

  const onCountryChange = (countryId: number): void => {
    if (selectedCountry === countryId) {
      return;
    }
    setCurrentCountry(countryId);
  };

  const getCountryList = (): Country[] => {
    return uniqBy(
      assets.map((asset) => asset.country),
      'id'
    );
  };

  const getPropertyList = (): PickerItemProps[] => {
    // @ts-ignore
    return (selectedCountry === 0 ? assets : assets.filter((asset) => selectedCountry === asset.country.id)).map(
      (asset) => ({
        label: asset.projectName,
        value: asset.id,
      })
    );
  };

  const onAddRecord = (isEdit: boolean, argTransactionId = -1): void => {
    if (isEdit) {
      setIsEditRecord(isEdit);
      setTransactionId(argTransactionId);
    }
    setFinancialsActions({
      financialsActionType: FinancialsActions.AddRecord,
      isOpen: true,
    });
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };

  const getGeneralLedgers = (reset = false): void => {
    const { getTransactions, transactionsData } = props;
    getTransactions({
      offset: reset ? 0 : transactionsData.length,
      limit: 10,
      asset_id: undefined,
      country_id: undefined,
    });
  };

  const onDeleteRecord = async (currentTransactionId: number): Promise<void> => {
    if (currentTransactionId > -1) {
      try {
        await LedgerRepository.deleteLedger(currentTransactionId);
        getGeneralLedgers(true);
        setTransactionId(-1);
        getLedgerMetrics();
        AlertHelper.success({ message: t('assetFinancial:deletedSuccessfullyMessage') });
      } catch (e) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
  };

  const onPressDueActions = (actionType: FinancialsActions): void => {
    setIsFromDues(true);
    setFinancialsActions({
      financialsActionType: actionType,
      isOpen: true,
    });
  };

  const isTabUp = useUp(deviceBreakpoint.TABLET);

  return (
    <View style={styles.container}>
      <View style={[styles.containerFilters, isTabUp && styles.containerFiltersTabUp]}>
        <PropertyByCountryDropdown
          selectedProperty={selectedProperty}
          selectedCountry={selectedCountry}
          propertyList={getPropertyList()}
          countryList={getCountryList()}
          onPropertyChange={onPropertyChange}
          onCountryChange={onCountryChange}
          containerStyle={styles.dropdownContainerStyle}
          propertyContainerStyle={styles.propertyContainerStyle}
        />
      </View>
      <View style={styles.container}>
        <PropertyVisualsEstimates selectedCountry={selectedCountry} selectedProperty={selectedProperty} />
        <DueList onPressDueActions={onPressDueActions} />
        <Transactions isAddRecord={false} onOpenModal={onAddRecord} onDeleteRecord={onDeleteRecord} />
        <ReminderList />
        <FinancialsPopover
          popupRef={popupRef}
          onCloseModal={onCloseModal}
          financialsActionType={financialsActionType}
          setFinancialsActionType={setFinancialsActionType}
          currency={currency}
          assets={assets}
          isEditRecord={isEditRecord}
          setIsEditRecord={setIsEditRecord}
          transactionId={transactionId}
          getGeneralLedgers={getGeneralLedgers}
          isFromDues={isFromDues}
          setIsFromDues={setIsFromDues}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state: IState): IStateToProps => {
  const { getSelectedCountry, getSelectedProperty } = FinancialSelectors;
  return {
    currency: UserSelector.getCurrency(state),
    assets: UserSelector.getUserAssets(state),
    selectedProperty: getSelectedProperty(state),
    selectedCountry: getSelectedCountry(state),
    transactionsData: FinancialSelectors.getTransactionRecords(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const {
    getLedgers,
    setCurrentCountry,
    setCurrentProperty,
    setTimeRange,
    getLedgerMetrics,
    resetLedgerFilters,
    setCurrentDueId,
    setCurrentReminderId,
    getTransactions,
  } = FinancialActions;
  return bindActionCreators(
    {
      getLedgers,
      setCurrentCountry,
      setCurrentProperty,
      setTimeRange,
      getLedgerMetrics,
      resetLedgerFilters,
      setCurrentDueId,
      setCurrentReminderId,
      getTransactions,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Financials);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  containerFilters: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    paddingBottom: 20,
    minHeight: 40,
  },
  containerFiltersTabUp: {
    minHeight: 70,
  },
  dropdownContainerStyle: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  propertyContainerStyle: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 16,
    minWidth: 180,
  },
});
