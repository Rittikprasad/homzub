import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { SvgProps } from 'react-native-svg';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import AddProperty from '@homzhub/common/src/assets/images/addProperty.svg';
import Alert from '@homzhub/common/src/assets/images/alert.svg';
import CustomSearch from '@homzhub/common/src/assets/images/customSearch.svg';
import Finance from '@homzhub/common/src/assets/images/finance.svg';
import Help from '@homzhub/common/src/assets/images/headphone.svg';
import ServiceRequest from '@homzhub/common/src/assets/images/serviceRequest.svg';
import {
  AssetAdvertisementBanner,
  AssetMetricsList,
  AssetSummary,
  FullScreenAssetDetailsCarousel,
} from '@homzhub/mobile/src/components';
import AssetMarketTrends from '@homzhub/mobile/src/components/molecules/AssetMarketTrends';
import IconSheet, { ISheetData } from '@homzhub/mobile/src/components/molecules/IconSheet';
import UserSubscriptionPlan from '@homzhub/common/src/components/molecules/UserSubscriptionPlan';
import WelcomeCard from '@homzhub/common/src/components/molecules/WelcomeCard';
import FinanceOverview from '@homzhub/mobile/src/components/organisms/FinanceOverview';
import LeasePropertyList from '@homzhub/mobile/src/components/organisms/LeasePropertyList';
import PendingPropertyListCard from '@homzhub/mobile/src/components/organisms/PendingPropertyListCard';
import VisitListCard from '@homzhub/mobile/src/components/organisms/VisitListCard';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Asset, PropertyStatus } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { IActions, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { IMetricsData } from '@homzhub/common/src/domain/models/AssetMetrics';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DashboardNavigatorParamList } from '@homzhub/mobile/src/navigation/DashboardStack';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { IAssetVisitPayload, VisitStatus } from '@homzhub/common/src/domain/repositories/interfaces';
import { IApiClientError } from '@homzhub/common/src/network/ApiClientError';

interface IDispatchProps {
  setCurrentFilter: (payload: Filters) => void;
  setAssetId: (payload: number) => void;
  setSelectedPlan: (payload: ISelectedAssetPlan) => void;
  setAddPropertyFlow: (payload: boolean) => void;
  setCurrentAsset: (payload: ISetAssetPayload) => void;
  getAssetVisit: (payload: IAssetVisitPayload) => void;
  setInitialState: () => void;
  getTenanciesDetails: () => void;
  getFilterDetails: (payload: IFilter) => void;
  setFilter: (payload: IFilter) => void;
  setEditPropertyFlow: (payload: boolean) => void;
  toggleEditPropertyFlowBottomSheet: (payload: boolean) => void;
}

interface IReduxStateProps {
  assets: Asset[];
  filters: IFilter;
  defaultCurrency: Currency;
}

type libraryProps = NavigationScreenProps<DashboardNavigatorParamList, ScreensKeys.DashboardLandingScreen>;
type Props = WithTranslation & libraryProps & IDispatchProps & IReduxStateProps;

interface IDashboardState {
  metrics: IMetricsData;
  pendingProperties: Asset[];
  isLoading: boolean;
  showBottomSheet: boolean;
}

enum MetricType {
  OFFER = 'OFFER',
  SITE_VISITS = 'SITE_VISIT',
  SHORTLISTED = 'SHORTLISTED',
}

const ShowInMvpRelease = false;

export class Dashboard extends React.PureComponent<Props, IDashboardState> {
  public focusListener: any;
  public blurListener: any;

  public state = {
    metrics: {} as IMetricsData,
    pendingProperties: [],
    isLoading: false,
    showBottomSheet: false,
  };

  public componentDidMount = (): void => {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.getScreenData().then();
    });
    this.blurListener = navigation.addListener('blur', () => {
      this.handleScreenBlur();
    });
  };

  public componentWillUnmount(): void {
    this.focusListener();
    this.blurListener();
  }

  public render = (): React.ReactElement => {
    const { t, route } = this.props;
    const { isLoading, pendingProperties, metrics } = this.state;

    return (
      <>
        <UserScreen loading={isLoading} isGradient title={t('dashboard')} onPlusIconClicked={this.openBottomSheet}>
          {this.renderAssetMetricsAndUpdates()}
          {pendingProperties.length > 0 && (
            <PendingPropertyListCard
              data={pendingProperties}
              onPressComplete={this.onCompleteDetails}
              onSelectAction={this.handleActionSelection}
              onViewProperty={this.onViewProperty}
            />
          )}
          {!metrics?.metricValues?.assets?.count && <WelcomeCard handlePress={this.handleAddProperty} />}
          {metrics?.isTenant && <LeasePropertyList />}
          {metrics?.isTenant && <VisitListCard />}
          {!metrics?.isTenant && <FinanceOverview />}
          <AssetMarketTrends isDashboard onViewAll={this.onViewAll} onTrendPress={this.onTrendPress} />
          <AssetAdvertisementBanner />
          {ShowInMvpRelease && <UserSubscriptionPlan onApiFailure={this.onAssetSubscriptionApiFailure} />}
          {this.renderBottomSheet()}
        </UserScreen>
        {Boolean(route?.params?.imageLink && route?.params?.imageLink?.length > 0) && this.renderFullImageView()}
      </>
    );
  };

  public renderAssetMetricsAndUpdates = (): React.ReactElement => {
    const { t } = this.props;
    const { metrics } = this.state;
    return (
      <>
        <AssetMetricsList
          title={`${metrics?.metricValues?.assets?.count ?? 0}`}
          data={metrics?.metricValues?.miscellaneous ?? []}
          subscription={metrics?.metricValues?.userServicePlan?.label}
          onMetricsClicked={this.handleMetricsNavigation}
          subTitleText={metrics?.isTenant ? t('assetPortfolio:tenancies') : t('common:properties')}
        />
        <AssetSummary
          notification={metrics?.updates?.notifications?.count ?? 0}
          serviceTickets={metrics?.updates?.tickets?.open?.count ?? 0}
          dues={metrics?.updates?.dues?.count ?? 0}
          messages={metrics?.updates?.messages?.unread?.count ?? 0}
          containerStyle={styles.assetCards()}
          onPressServiceTickets={this.handleServiceTickets}
          onPressNotification={this.handleNotification}
          onPressMessages={this.handleMessages}
        />
      </>
    );
  };

  public renderBottomSheet = (): React.ReactElement => {
    const { showBottomSheet } = this.state;
    const data = this.formatBottomSheetData();

    return <IconSheet data={data} onCloseSheet={this.closeBottomSheet} isVisible={showBottomSheet} numOfColumns={3} />;
  };

  public renderFullImageView = (): React.ReactElement | null => {
    const { route } = this.props;

    if (route?.params?.imageLink) {
      const imageLink = ObjectMapper.deserialize(Attachment, { link: route?.params?.imageLink });

      const onPressCross = (): void => {
        this.handleScreenBlur();
      };

      return (
        <>
          <FullScreenAssetDetailsCarousel
            data={[imageLink]}
            activeSlide={0}
            onFullScreenToggle={onPressCross}
            hasOnlyImages
          />
        </>
      );
    }

    return null;
  };

  // HANDLERS
  private onAssetSubscriptionApiFailure = (err: IApiClientError): void => {
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(err) });
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

  private onViewAll = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.MarketTrends, { isFromDashboard: true });
  };

  private onTrendPress = (url: string, trendId: number): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.WebViewScreen, { url, trendId });
  };

  private onViewProperty = (data: ISetAssetPayload): void => {
    const { setCurrentAsset, navigation } = this.props;
    setCurrentAsset(data);
    navigation.navigate(ScreensKeys.PropertyDetailScreen);
  };

  private handleScreenBlur = (): void => {
    const { navigation } = this.props;
    navigation.setParams({ imageLink: undefined });
  };

  private handleMessages = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.Messages, { isFromDashboard: true });
  };

  private handleServiceTickets = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.ServiceTicketScreen, { isFromDashboard: true });
  };

  private handleAddProperty = (): void => {
    const { navigation } = this.props;
    // @ts-ignore
    navigation.navigate(ScreensKeys.PropertyPostStack, { screen: ScreensKeys.AssetLocationSearch });
    AnalyticsService.track(EventType.AddPropertyInitiation);
  };

  private handleNotification = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.AssetNotifications, { isFromDashboard: true });
  };

  private handleMetricsNavigation = (name: string): void => {
    const { navigation, setCurrentFilter, t } = this.props;

    const handleNavigation = (): void => {
      const callNavigation = (screen: ScreensKeys): void =>
        // @ts-ignore
        navigation.navigate(screen, { screenTitle: t('assetDashboard:dashboard') });

      switch (name) {
        case MetricType.OFFER:
          callNavigation(ScreensKeys.PropertyOfferList);
          break;
        case MetricType.SHORTLISTED:
          callNavigation(ScreensKeys.SavedPropertiesScreen);
          break;
        case MetricType.SITE_VISITS:
          callNavigation(ScreensKeys.PropertyVisits);
          break;
        default:
          FunctionUtils.noop();
      }
    };

    if ([MetricType.OFFER, MetricType.SHORTLISTED, MetricType.SITE_VISITS].includes(name as MetricType)) {
      handleNavigation();
      return;
    }
    setCurrentFilter(name as Filters);
    // @ts-ignore
    navigation.navigate(ScreensKeys.Portfolio, {
      screen: ScreensKeys.PortfolioLandingScreen,
      params: {
        isFromNavigation: true,
      },
    });
  };

  private handleActionSelection = (item: IActions, assetId: number): void => {
    const { navigation, setSelectedPlan, setAssetId } = this.props;
    setSelectedPlan({ id: item.id, selectedPlan: item.type });
    setAssetId(assetId);
    // @ts-ignore
    navigation.navigate(ScreensKeys.PropertyPostStack, {
      screen: ScreensKeys.AssetListing,
      params: { previousScreen: ScreensKeys.Dashboard },
    });
  };

  private openBottomSheet = (): void => this.setState({ showBottomSheet: true });

  private closeBottomSheet = (): void => {
    const { setInitialState } = this.props;
    setInitialState();
    this.setState({ showBottomSheet: false });
  };

  private formatBottomSheetData = (): ISheetData[] => {
    const { t, navigation, assets, getFilterDetails, filters, setFilter, defaultCurrency } = this.props;
    const iconSize = 38;

    const handleAddFinancialRecord = (): void => {
      if (assets.length <= 0) {
        AlertHelper.error({ message: t('assetFinancial:addProperty') });
        return;
      }
      navigation.navigate(ScreensKeys.AddRecordScreen, { isFromDashboard: true });
    };

    const handleAddServiceTicket = (): void => {
      if (assets.length <= 0) {
        AlertHelper.error({ message: t('assetDashboard:addPropertyForTicket') });
        return;
      }
      navigation.navigate(ScreensKeys.AddServiceTicket, { isFromDashboard: true });
    };

    const handleAddSupportTicket = (isBugReport?: boolean): void => {
      navigation.navigate(ScreensKeys.SupportScreen, {
        isFromDashboard: true,
        ...(isBugReport && { categoryId: 41 }), // For Bug Report hard-coding the bug category id
      });
    };

    const handleCustomSearch = (): void => {
      getFilterDetails({ asset_group: filters.asset_group });
      setFilter({ currency_code: defaultCurrency.currencyCode });
      navigation.navigate(ScreensKeys.SearchRequirement, { isFromAuth: false });
    };

    const ImageHOC = (Image: React.FC<SvgProps>): React.ReactElement => <Image width={iconSize} height={iconSize} />;

    return [
      {
        icon: ImageHOC(AddProperty),
        label: t('property:addProperty'),
        onPress: this.handleAddProperty,
      },
      {
        icon: ImageHOC(Finance),
        label: t('assetFinancial:addFinancials'),
        onPress: handleAddFinancialRecord,
      },
      {
        icon: ImageHOC(ServiceRequest),
        label: t('assetDashboard:serviceTicket'),
        onPress: handleAddServiceTicket,
      },
      {
        icon: ImageHOC(CustomSearch),
        label: t('propertySearch:shareRequirement'),
        onPress: handleCustomSearch,
      },
      {
        icon: ImageHOC(Help),
        label: t('common:askHelp'),
        onPress: handleAddSupportTicket,
      },
      {
        icon: ImageHOC(Alert),
        label: t('common:bugReport'),
        onPress: (): void => handleAddSupportTicket(true),
      },
    ];
  };

  // HANDLERS end

  // APIs
  private getScreenData = async (): Promise<void> => {
    const { getTenanciesDetails } = this.props;
    await this.getAssetMetrics();
    await this.getPendingProperties();
    this.getVisitData();
    getTenanciesDetails();
  };

  private getAssetMetrics = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const { metricsData } = await DashboardRepository.getAssetMetrics('v4');
      this.setState({ metrics: metricsData, isLoading: false });
    }catch (e: any) {      this.setState({ isLoading: false });
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getPendingProperties = async (): Promise<void> => {
    try {
      const response: Asset[] = await AssetRepository.getPropertiesByStatus(PropertyStatus.PENDING);
      this.setState({ pendingProperties: response });
    }catch (e: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private getVisitData = (): void => {
    const { getAssetVisit } = this.props;
    getAssetVisit({
      start_date__gte: new Date().toISOString(),
      status__in: `${VisitStatus.APPROVED},${VisitStatus.PENDING}`,
    });
  };
  // APIs end
}

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setCurrentFilter, setCurrentAsset, setInitialState, getTenanciesDetails } = PortfolioActions;
  const { setAddPropertyFlow } = UserActions;
  const { setAssetId, setSelectedPlan, setEditPropertyFlow, toggleEditPropertyFlowBottomSheet } = RecordAssetActions;
  const { getAssetVisit } = AssetActions;
  const { getFilterDetails, setFilter } = SearchActions;
  return bindActionCreators(
    {
      setCurrentFilter,
      setAssetId,
      setSelectedPlan,
      setAddPropertyFlow,
      setCurrentAsset,
      setInitialState,
      getAssetVisit,
      getTenanciesDetails,
      getFilterDetails,
      setFilter,
      setEditPropertyFlow,
      toggleEditPropertyFlowBottomSheet,
    },
    dispatch
  );
};

const mapStateToProps = (state: IState): IReduxStateProps => {
  const { getUserAssets } = UserSelector;
  const { getFilters } = SearchSelector;
  const { getDefaultCurrency } = CommonSelectors;
  return {
    assets: getUserAssets(state),
    filters: getFilters(state),
    defaultCurrency: getDefaultCurrency(state),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetDashboard)(Dashboard));

const styles = {
  assetCards: (): StyleProp<ViewStyle> => ({
    marginVertical: 12,
  }),
  evenItem: (): StyleProp<ViewStyle> => ({
    marginEnd: 17,
  }),
};
