import React from 'react';
import { PickerItemProps, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { ListingService } from '@homzhub/common/src/services/Property/ListingService';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { AssetMetricsList } from '@homzhub/mobile/src/components';
import AssetCard from '@homzhub/mobile/src/components/organisms/AssetCard';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Asset, DataType } from '@homzhub/common/src/domain/models/Asset';
import { AssetFilter, Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/PortfolioStack';
import { NavigationScreenProps, ScreensKeys, UpdatePropertyFormTypes } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  IGetPropertiesPayload,
  IGetTenanciesPayload,
  IPortfolioState,
  ISetAssetPayload,
} from '@homzhub/common/src/modules/portfolio/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';
import {
  ClosureReasonType,
  IClosureReasonPayload,
  IListingParam,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { IChatPayload } from '@homzhub/common/src/modules/common/interfaces';

interface IStateProps {
  tenancies: Asset[];
  properties: Asset[];
  propertiesById: Asset[];
  tenanciesById: Asset[];
  currentFilter: Filters;
  loaders: IPortfolioState['loaders'];
}

interface IDispatchProps {
  getTenanciesDetails: (payload: IGetTenanciesPayload) => void;
  getPropertyDetails: (payload: IGetPropertiesPayload) => void;
  setCurrentAsset: (payload: ISetAssetPayload) => void;
  setCurrentFilter: (payload: Filters) => void;
  setEditPropertyFlow: (payload: boolean) => void;
  setAssetId: (payload: number) => void;
  clearMessages: () => void;
  clearAssetData: () => void;
  setCurrentChatDetail: (payload: IChatPayload) => void;
  toggleEditPropertyFlowBottomSheet: (payload: boolean) => void;
}

interface IScreenState {
  metrics: AssetMetrics;
  filters: PickerItemProps[];
  expandedTenanciesId: number;
  expandedAssetId: number;
  assetType: string;
}

type libraryProps = NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.PortfolioLandingScreen>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps;

export class Portfolio extends React.PureComponent<Props, IScreenState> {
  public focusListener: any;

  public state = {
    metrics: {} as AssetMetrics,
    filters: [],
    expandedTenanciesId: 0,
    expandedAssetId: 0,
    assetType: '',
  };

  public componentDidMount = (): void => {
    const {
      navigation,
      clearMessages,
      setAssetId,
      route: { params },
    } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      if (params && params.inviteId) {
        this.acceptInvite().then();
      }
      this.getScreenData().then();
      clearMessages();
      setAssetId(-1);
      this.setState({
        assetType: '',
      });
    });
  };

  public componentWillUnmount(): void {
    this.focusListener();
  }

  public render = (): React.ReactElement => {
    const {
      t,
      tenancies,
      tenanciesById,
      loaders,
      route: { params },
    } = this.props;
    const { metrics, assetType } = this.state;
    const tenanciesData = assetType ? tenancies : tenanciesById;
    return (
      <UserScreen
        isGradient
        loading={loaders.tenancies || loaders.properties}
        title={t('portfolio')}
        onPlusIconClicked={this.handleAddProperty}
      >
        <AssetMetricsList
          showBackIcon={params?.isFromNavigation ?? false}
          title={`${metrics?.assetMetrics?.assets?.count ?? 0}`}
          data={metrics?.assetMetrics?.assetGroups ?? []}
          subscription={metrics?.userServicePlan?.label}
          onMetricsClicked={this.onMetricsClicked}
          selectedAssetType={assetType}
          numOfElements={2}
        />
        {tenanciesData.length > 0 && this.renderTenancies(tenanciesData)}
        {this.renderPortfolio()}
      </UserScreen>
    );
  };

  private renderTenancies = (tenancies: Asset[]): React.ReactElement | null => {
    const { t } = this.props;
    const { assetType } = this.state;
    const filteredData = tenancies.filter((item) => item.assetGroup.name === assetType);

    if (assetType && filteredData.length < 1) {
      return null;
    }

    return (
      <>
        <Text type="small" textType="semiBold" style={styles.title}>
          {t('tenancies')}
        </Text>
        {(assetType ? filteredData : tenancies).map((tenancy, index) =>
          this.renderList(tenancy, index, DataType.TENANCIES)
        )}
      </>
    );
  };

  private renderPortfolio = (): React.ReactElement => {
    const { t, currentFilter, properties, propertiesById } = this.props;
    const { assetType, filters } = this.state;
    const title = currentFilter === Filters.ALL ? t('noPropertiesAdded') : t('noFilterProperties');
    const finalData = currentFilter !== Filters.ALL ? properties : propertiesById;
    const data = assetType ? (finalData ?? []).filter((item) => item.assetGroup.name === assetType) : finalData;
    const filteredData =
      currentFilter === Filters.ALL ? data : data?.filter((item) => item.assetStatusInfo?.tag.code === currentFilter);

    const isEmpty = !filteredData || filteredData.length <= 0;

    return (
      <>
        <View style={[styles.headingView, isEmpty && styles.headerMargin]}>
          <Text type="small" textType="semiBold" style={styles.title}>
            {t('propertyPortfolio')}
          </Text>
          <Dropdown
            data={filters}
            value={currentFilter}
            onDonePress={this.onSelectFilter}
            textStyle={styles.placeholder}
            listHeight={500}
            listTitle={t('propertySearch:filters')}
            backgroundColor={theme.colors.white}
            iconColor={theme.colors.blue}
            iconStyle={styles.dropdownIcon}
            icon={icons.downArrow}
            containerStyle={styles.dropdownContainer}
            fontSize="large"
            fontWeight="semiBold"
            isOutline
          />
        </View>
        {isEmpty ? (
          <EmptyState title={title} icon={icons.home} containerStyle={styles.emptyView} />
        ) : (
          filteredData?.map((property, index) => this.renderList(property, index, DataType.PROPERTIES))
        )}
      </>
    );
  };

  private renderList = (item: Asset, index: number, type: DataType): React.ReactElement => {
    const { expandedAssetId, expandedTenanciesId } = this.state;
    const { currentFilter } = this.props;
    const handleViewProperty = (data: ISetAssetPayload, assetData: Asset, key?: Tabs): void =>
      this.onViewProperty({ ...data, dataType: type }, assetData, key);
    const handleArrowPress = (id: number): void => this.handleExpandCollapse(id, type, index);
    const onPressAction = (payload: IClosureReasonPayload, param?: IListingParam): void => {
      this.handleActions(item, payload, param);
    };
    return (
      <AssetCard
        assetData={item}
        key={index}
        isFilteredApplied={currentFilter !== Filters.ALL}
        isExpanded={type === DataType.PROPERTIES ? expandedAssetId === index : expandedTenanciesId === index}
        isFromTenancies={type === DataType.TENANCIES}
        onViewProperty={handleViewProperty}
        onPressArrow={handleArrowPress}
        onCompleteDetails={this.onCompleteDetails}
        onHandleAction={onPressAction}
        onResend={this.onResendInvite}
      />
    );
  };

  private onSelectFilter = (value: Filters): void => {
    const { setCurrentFilter } = this.props;
    setCurrentFilter(value);
    this.setState({ expandedAssetId: 0 });
  };

  private onViewProperty = (data: ISetAssetPayload, asset: Asset, key?: Tabs): void => {
    const { navigation, setCurrentAsset, setCurrentChatDetail } = this.props;
    const { formattedProjectName, assetStatusInfo, projectName } = asset;
    setCurrentAsset(data);

    const param = {
      isFromPortfolio: true,
      isFromTenancies: data.dataType === DataType.TENANCIES,
      screenTitle: formattedProjectName,
      propertyId: data.asset_id,
    };

    const handleNavigation = (): void => {
      switch (key) {
        case Tabs.TICKETS:
          navigation.navigate(ScreensKeys.ServiceTicketScreen, param);
          break;

        case Tabs.MESSAGES:
          setCurrentChatDetail({
            groupName: projectName,
            groupId:
              assetStatusInfo?.leaseTransaction?.id && assetStatusInfo?.leaseTransaction?.id > 0
                ? assetStatusInfo?.leaseTransaction?.messageGroupId
                : 0,
          });
          navigation.navigate(ScreensKeys.ChatScreen, param);
          break;
        case Tabs.NOTIFICATIONS:
          navigation.navigate(ScreensKeys.AssetNotifications, {
            ...param,
            leaseListingId: assetStatusInfo?.leaseListingId ?? 0,
            saleListingId: assetStatusInfo?.saleListingId ?? 0,
            leaseTransaction: assetStatusInfo?.leaseTransaction.id,
          });
          break;
        default:
          navigation.navigate(ScreensKeys.PropertyDetailScreen);
      }
    };

    handleNavigation();
  };

  private onResendInvite = async (tenantId: number): Promise<void> => {
    await ListingService.resendInvite(tenantId);
    this.getPortfolioProperty();
  };

  private onMetricsClicked = (name: string): void => {
    const { assetType } = this.state;
    if (assetType === name) {
      name = '';
    }
    this.setState({ assetType: name });
  };

  private onPropertiesCallback = (): void => {
    this.verifyData();
  };

  private onTenanciesCallback = (): void => {
    this.verifyData();
  };

  private onCompleteDetails = (assetId: number): void => {
    const { navigation, setAssetId, setEditPropertyFlow, toggleEditPropertyFlowBottomSheet } = this.props;
    setAssetId(assetId);
    setEditPropertyFlow(true);
    toggleEditPropertyFlowBottomSheet(true);
    // @ts-ignore
    navigation.navigate(ScreensKeys.PropertyPostStack, {
      screen: ScreensKeys.AddProperty,
      params: { previousScreen: ScreensKeys.Dashboard },
    });
  };

  private acceptInvite = async (): Promise<void> => {
    const {
      route: { params },
    } = this.props;
    try {
      await AssetRepository.acceptInvite(params);
      AnalyticsService.track(EventType.TenantInviteAccepted);
    } catch (error) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(error.details) });
    }
  };

  private getScreenData = async (): Promise<void> => {
    this.getTenancies();
    this.getPortfolioProperty();
    await this.getAssetMetrics();
    await this.getAssetFilters();
  };

  private handleExpandCollapse = (id: number, type: DataType, index: number): void => {
    const { expandedAssetId, expandedTenanciesId } = this.state;
    if (type === DataType.PROPERTIES) {
      this.setState({ expandedAssetId: expandedAssetId === index ? -1 : index });
    } else {
      this.setState({ expandedTenanciesId: expandedTenanciesId === index ? -1 : index });
    }
  };

  private getAssetMetrics = async (): Promise<void> => {
    try {
      const response: AssetMetrics = await PortfolioRepository.getAssetMetrics();
      this.setState({ metrics: response });
    }catch (e: any) {      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getAssetFilters = async (): Promise<void> => {
    try {
      const response: AssetFilter = await PortfolioRepository.getAssetFilters();
      this.setState({ filters: response.statusDropdown });
    }catch (e: any) {      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getTenancies = (): void => {
    const { getTenanciesDetails } = this.props;
    getTenanciesDetails({ onCallback: this.onTenanciesCallback });
  };

  private getPortfolioProperty = (): void => {
    const { getPropertyDetails } = this.props;
    getPropertyDetails({ onCallback: this.onPropertiesCallback });
  };

  private handleActions = (asset: Asset, payload: IClosureReasonPayload, param?: IListingParam): void => {
    const { navigation, setAssetId } = this.props;
    const { id, isSubleased, assetStatusInfo } = asset;
    setAssetId(id);
    const { CancelListing, TerminateListing } = UpdatePropertyFormTypes;
    const { LEASE_TRANSACTION_TERMINATION } = ClosureReasonType;
    const formType = payload.type === LEASE_TRANSACTION_TERMINATION ? TerminateListing : CancelListing;
    const startDate = DateUtils.getUtcFormatted(assetStatusInfo?.leaseTransaction.leaseEndDate ?? '', 'DD/MM/YYYY');

    if (param && param.hasTakeAction) {
      navigation.navigate(ScreensKeys.AssetPlanSelection, {
        isFromPortfolio: true,
        isSubleased,
        leaseUnit: assetStatusInfo?.leaseUnitId ?? undefined,
        ...(!!assetStatusInfo?.leaseTransaction?.leaseEndDate && {
          startDate: DateUtils.getFutureDateByUnit(startDate, 1, 'days'),
        }),
        isFromPortfolioList: true,
      });
    } else {
      navigation.navigate(ScreensKeys.UpdatePropertyScreen, { formType, payload, param, assetDetail: asset });
    }
  };

  private handleAddProperty = (): void => {
    const { navigation, clearAssetData } = this.props;
    clearAssetData();
    // @ts-ignore
    navigation.navigate(ScreensKeys.PropertyPostStack, { screen: ScreensKeys.AssetLocationSearch });
    AnalyticsService.track(EventType.AddPropertyInitiation);
  };

  private verifyData = (): void => {
    const { propertiesById, tenanciesById } = this.props;

    if ((tenanciesById && tenanciesById.length > 0) || (propertiesById && propertiesById.length > 0)) {
      if (tenanciesById && tenanciesById.length > 0) {
        this.setState({
          expandedTenanciesId: 0,
        });
      }

      if (propertiesById && propertiesById.length > 0) {
        this.setState({
          expandedAssetId: 0,
        });
      }
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    tenancies: PortfolioSelectors.getTenancies(state),
    properties: PortfolioSelectors.getProperties(state),
    propertiesById: PortfolioSelectors.getPropertiesById(state),
    tenanciesById: PortfolioSelectors.getTenanciesById(state),
    currentFilter: PortfolioSelectors.getCurrentFilter(state),
    loaders: PortfolioSelectors.getPortfolioLoaders(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getTenanciesDetails, getPropertyDetails, setCurrentAsset, setCurrentFilter } = PortfolioActions;
  const { setAssetId, setEditPropertyFlow, clearAssetData, toggleEditPropertyFlowBottomSheet } = RecordAssetActions;
  const { clearMessages, setCurrentChatDetail } = CommonActions;
  return bindActionCreators(
    {
      getTenanciesDetails,
      getPropertyDetails,
      setCurrentAsset,
      setCurrentFilter,
      setAssetId,
      setEditPropertyFlow,
      clearMessages,
      clearAssetData,
      setCurrentChatDetail,
      toggleEditPropertyFlowBottomSheet,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(Portfolio));

const styles = StyleSheet.create({
  title: {
    color: theme.colors.darkTint1,
    marginBottom: 16,
    marginTop: 4,
  },
  headingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  headerMargin: {
    marginTop: 12,
  },
  emptyView: {
    minHeight: 200,
  },
  placeholder: {
    color: theme.colors.blue,
  },
  dropdownIcon: {
    marginStart: 12,
  },
  dropdownContainer: {
    backgroundColor: theme.colors.white,
    borderWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    width: 125,
  },
});
