import React from 'react';
import { PickerItemProps } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { uniqBy } from 'lodash';
import { SvgProps } from 'react-native-svg';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import Accounting from '@homzhub/common/src/assets/images/accounting.svg';
import Bank from '@homzhub/common/src/assets/images/bank.svg';
import Payment from '@homzhub/common/src/assets/images/payment.svg';
import { AssetMetricsList, IMetricsData } from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import IconSheet, { ISheetData } from '@homzhub/mobile/src/components/molecules/IconSheet';
import { PropertyByCountryDropdown } from '@homzhub/common/src/components/molecules/PropertyByCountryDropdown';
import FinanceOverview from '@homzhub/mobile/src/components/organisms/FinanceOverview';
import DuesContainer from '@homzhub/mobile/src/components/organisms/DuesContainer';
import RemindersContainer from '@homzhub/mobile/src/components/organisms/RemindersContainer';
import TransactionsContainer from '@homzhub/mobile/src/components/organisms/TransactionsContainer';
import { FinancialsNavigatorParamList } from '@homzhub/mobile/src/navigation/FinancialStack';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { User } from '@homzhub/common/src/domain/models/User';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IFinancialState, ILedgerMetrics } from '@homzhub/common/src/modules/financials/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IOwnState {
  isLoading: boolean;
  showAddSheet: boolean;
}

interface IStateProps {
  assets: Asset[];
  financialLoaders: IFinancialState['loaders'];
  ledgerData: GeneralLedgers[];
  selectedProperty: number;
  selectedCountry: number;
  ledgerMetrics: ILedgerMetrics;
}

interface IDispatchProps {
  getLedgers: () => void;
  setCurrentCountry: (country: number) => void;
  setCurrentProperty: (property: number) => void;
  setTimeRange: (range: number) => void;
  getLedgerMetrics: () => void;
  resetLedgerFilters: () => void;
  setCurrentDueId: (dueId: number) => void;
  setCurrentReminderId: (id: number) => void;
  getAssetUsersSuccess: (payload: User[]) => void;
  clearReminderFormData: () => void;
  resetPaymentState: () => void;
}

type libraryProps = NavigationScreenProps<FinancialsNavigatorParamList, ScreensKeys.FinancialsLandingScreen>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps;

export class Financials extends React.PureComponent<Props, IOwnState> {
  private onFocusSubscription: any;

  public state = {
    isLoading: false,
    showAddSheet: false,
  };

  public componentDidMount(): void {
    const {
      navigation,
      getLedgerMetrics,
      resetLedgerFilters,
      setCurrentDueId,
      setCurrentReminderId,
      getAssetUsersSuccess,
      clearReminderFormData,
      resetPaymentState,
    } = this.props;

    this.onFocusSubscription = navigation.addListener('focus', (): void => {
      resetLedgerFilters();
      getLedgerMetrics();
      setCurrentDueId(-1);
      setCurrentReminderId(-1);
      getAssetUsersSuccess([]);
      clearReminderFormData();
      resetPaymentState();
    });
  }

  public render = (): React.ReactElement => {
    const {
      t,
      route: { params },
      financialLoaders: { dues, payment, reminder },
      selectedCountry,
      selectedProperty,
    } = this.props;
    const { isLoading } = this.state;

    const loading = isLoading || dues || payment || reminder;

    const toggleAddSheet = (): void => this.toggleAddSheet(true);

    return (
      <UserScreen loading={loading} isGradient title={t('financial')} onPlusIconClicked={toggleAddSheet}>
        <AssetMetricsList
          title={t('assetFinancial:summary')}
          numOfElements={2}
          showBackIcon={params?.isFromNavigation ?? false}
          isSubTextRequired={false}
          data={this.getHeaderData()}
        />
        <PropertyByCountryDropdown
          selectedProperty={selectedProperty}
          selectedCountry={selectedCountry}
          // @ts-ignore
          propertyList={this.getPropertyList()}
          countryList={this.getCountryList()}
          onPropertyChange={this.onPropertyChange}
          onCountryChange={this.onCountryChange}
        />
        <FinanceOverview />
        <DuesContainer />
        <RemindersContainer />
        <TransactionsContainer toggleLoader={this.toggleLoading} isFromPortfolio={false} />
        {this.renderAddSheet()}
      </UserScreen>
    );
  };

  private renderAddSheet = (): React.ReactElement => {
    const { showAddSheet } = this.state;
    const data = this.getAddSheetData();

    return (
      <IconSheet
        data={data}
        sheetHeight={350}
        isVisible={showAddSheet}
        onCloseSheet={(): void => this.toggleAddSheet(false)}
      />
    );
  };

  private onPropertyChange = (propertyId: number): void => {
    const { selectedProperty, setCurrentProperty } = this.props;
    if (selectedProperty === propertyId) {
      return;
    }
    setCurrentProperty(propertyId);
  };

  private onCountryChange = (countryId: number): void => {
    const { selectedCountry, setCurrentCountry } = this.props;
    if (selectedCountry === countryId) {
      return;
    }
    setCurrentCountry(countryId);
  };

  private onAddRecord = (): void => {
    const {
      assets,
      t,
      navigation: { navigate },
    } = this.props;

    if (assets.length <= 0) {
      AlertHelper.error({ message: t('addProperty') });
      return;
    }

    navigate(ScreensKeys.AddRecordScreen);
  };

  private onSetReminder = (): void => {
    const {
      navigation: { navigate },
    } = this.props;

    navigate(ScreensKeys.AddReminderScreen);
  };

  private getAddSheetData = (): ISheetData[] => {
    const {
      t,
      navigation: { navigate },
    } = this.props;
    const iconSize = 40;
    const ImageHOC = (Image: React.FC<SvgProps>): React.ReactElement => <Image width={iconSize} height={iconSize} />;
    const IconHOC = (name: string): React.ReactElement => (
      <Icon name={name} size={iconSize + 3} color={theme.colors.error} />
    );
    return [
      {
        icon: ImageHOC(Accounting),
        label: t('assetFinancial:addFinancials'),
        onPress: this.onAddRecord,
      },
      {
        icon: IconHOC(icons.reminder),
        label: t('assetFinancial:setReminders'),
        onPress: this.onSetReminder,
      },
      {
        icon: ImageHOC(Bank),
        label: t('assetFinancial:bankAccounts'),
        onPress: (): void => navigate(ScreensKeys.AddBankAccount),
      },
      {
        icon: ImageHOC(Payment),
        label: t('propertyPayment:propertyPayment'),
        onPress: (): void => navigate(ScreensKeys.PropertyPayment),
      },
    ];
  };

  private toggleAddSheet = (isVisible: boolean): void => {
    this.setState({ showAddSheet: isVisible });
  };

  private toggleLoading = (loading: boolean): void => {
    this.setState({ isLoading: loading });
  };

  private getHeaderData = (): IMetricsData[] => {
    const {
      t,
      ledgerMetrics: { income, expense },
    } = this.props;
    const currentYear = DateUtils.getCurrentYear();

    return [
      {
        name: t('assetFinancial:income', { year: currentYear }),
        count: income,
        isCurrency: true,
        colorCode: theme.colors.incomeGreen,
      },
      {
        name: t('assetFinancial:expense', { year: currentYear }),
        count: expense,
        isCurrency: true,
        colorCode: theme.colors.yellowTint2,
      },
    ];
  };

  private getCountryList = (): Country[] => {
    const { assets } = this.props;
    return uniqBy(
      assets.map((asset) => asset.country),
      'id'
    );
  };

  private getPropertyList = (): PickerItemProps[] => {
    const { assets, selectedCountry } = this.props;

    // @ts-ignore
    return (selectedCountry === 0 ? assets : assets.filter((asset) => selectedCountry === asset.country.id)).map(
      (asset) => ({
        label: asset.projectName,
        value: asset.id,
      })
    );
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserAssets } = UserSelector;
  const { getFinancialLoaders, getLedgerData, getSelectedCountry, getSelectedProperty, getLedgerMetrics } =
    FinancialSelectors;
  return {
    assets: getUserAssets(state),
    financialLoaders: getFinancialLoaders(state),
    ledgerData: getLedgerData(state),
    selectedProperty: getSelectedProperty(state),
    selectedCountry: getSelectedCountry(state),
    ledgerMetrics: getLedgerMetrics(state),
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
    clearReminderFormData,
  } = FinancialActions;
  const { getAssetUsersSuccess } = AssetActions;
  const { resetPaymentState } = PropertyPaymentActions;
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
      getAssetUsersSuccess,
      clearReminderFormData,
      resetPaymentState,
    },
    dispatch
  );
};

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetFinancial)(Financials));
export default connectedComponent;
