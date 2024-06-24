import React, { PureComponent } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { isEmpty } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src//utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/PortfolioStack';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { ListingService } from '@homzhub/common/src/services/Property/ListingService';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { FullScreenAssetDetailsCarousel } from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import Menu, { IMenu } from '@homzhub/common/src/components/molecules/Menu';
import PropertyConfirmationView from '@homzhub/mobile/src/components/molecules/PropertyConfirmationView';
import TabCard from '@homzhub/common/src/components/molecules/TabCard';
import { SocialMediaShare } from '@homzhub/mobile/src/components/molecules/SocialMediaShare';
import AssetCard from '@homzhub/mobile/src/components/organisms/AssetCard';
import { PropertyTabs } from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/PropertyTabs';
import { Asset, IData } from '@homzhub/common/src/domain/models/Asset';
import { ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import {
  ClosureReasonType,
  DetailType,
  IClosureReasonPayload,
  IListingParam,
  IPropertyDetailPayload,
  ListingType,
  SpaceAvailableTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { NavigationScreenProps, ScreensKeys, UpdatePropertyFormTypes } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Routes, Tabs, TenantRoutes } from '@homzhub/common/src/constants/Tabs';
import { IChatPayload } from '@homzhub/common/src/modules/common/interfaces';
import { ICurrentOffer, IOfferCompare } from '@homzhub/common/src/modules/offers/interfaces';
import { DynamicLinkParamKeys, DynamicLinkTypes, RouteTypes } from '@homzhub/mobile/src/services/constants';

enum MenuItems {
  EDIT_LISTING = 'EDIT_LISTING',
  EDIT_PROPERTY = 'EDIT_PROPERTY',
  DELETE_PROPERTY = 'DELETE_PROPERTY',
  MANAGE_TENANT = 'MANAGE_TENANT',
  EDIT_LEASE = 'EDIT_LEASE',
  ADD_IMAGE = 'ADD_IMAGE',
  SHARE_LISTING = 'SHARE_LISTING',
}

interface IStateProps {
  assetPayload: ISetAssetPayload;
  asset: Asset | null;
}

interface IDispatchProps {
  setAssetId: (payload: number) => void;
  setSelectedPlan: (payload: ISelectedAssetPlan) => void;
  getAssetById: () => void;
  clearAsset: () => void;
  clearChatDetail: () => void;
  clearMessages: () => void;
  clearState: () => void;
  setEditPropertyFlow: (payload: boolean) => void;
  toggleEditPropertyFlowBottomSheet: (payload: boolean) => void;
  setCurrentChatDetail: (payload: IChatPayload) => void;
  setCurrentOfferPayload: (payload: ICurrentOffer) => void;
  setFilter: (payload: IFilter) => void;
  setCompareDetail: (payload: IOfferCompare) => void;
  setCurrentProperty: (assetId: number) => void;
}

interface IDetailState {
  propertyData: Asset;
  attachments: Attachment[];
  isFullScreen: boolean;
  activeSlide: number;
  isLoading: boolean;
  isDeleteProperty: boolean;
  isFromTenancies: boolean | null;
  isShare: boolean;
  sharingMessage: string;
}

type libraryProps = NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.PropertyDetailScreen>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps;

export class PropertyDetailScreen extends PureComponent<Props, IDetailState> {
  public focusListener: any;

  constructor(props: Props) {
    super(props);
    const {
      route: { params },
    } = props;
    this.state = {
      propertyData: {} as Asset,
      isFullScreen: false,
      activeSlide: 0,
      attachments: [],
      isLoading: false,
      isDeleteProperty: false,
      isShare: false,
      isFromTenancies: params?.isFromTenancies ?? null,
      sharingMessage: I18nService.t('common:homzhub'),
    };
  }

  public componentDidMount = (): void => {
    const { navigation } = this.props;

    this.focusListener = navigation.addListener('focus', () => {
      this.getAssetDetail().then(() => {
        this.setSharingMessage().then();
      });
    });
  };

  public componentDidUpdate = (prevProps: Readonly<Props>): void => {
    const { asset, setCompareDetail } = this.props;
    if (JSON.stringify(asset) !== JSON.stringify(prevProps.asset)) {
      if (asset && asset.leaseTerm) {
        setCompareDetail({
          rent: asset.leaseTerm.expectedPrice,
          deposit: asset.leaseTerm.securityDeposit,
          incrementPercentage: asset.leaseTerm.annualRentIncrementPercentage ?? 0,
        });
      }

      if (asset && asset.saleTerm) {
        setCompareDetail({
          price: Number(asset.saleTerm.expectedPrice) ?? 0,
          bookingAmount: Number(asset.saleTerm.expectedBookingAmount) ?? 0,
        });
      }
    }
  };

  public componentWillUnmount(): void {
    const { clearAsset } = this.props;
    this.focusListener();
    clearAsset();
  }

  public render = (): React.ReactNode => {
    const {
      t,
      route: { params },
    } = this.props;
    const { propertyData, isLoading, isFromTenancies } = this.state;

    const { assetStatusInfo } = propertyData;
    const isListingApproved = (assetStatusInfo?.status === 'APPROVED' && assetStatusInfo?.isListingPresent) ?? false;
    const isOccupied = assetStatusInfo?.tag.code === Filters.OCCUPIED || assetStatusInfo?.tag.code === Filters.EXPIRING;
    const menuItems = this.getMenuList(assetStatusInfo?.isListingPresent ?? false, isOccupied, isListingApproved);
    const onPressAction = (payload: IClosureReasonPayload, param?: IListingParam): void =>
      this.handleAction(propertyData, payload, param);
    const title = params && params.isFromDashboard ? t('assetDashboard:dashboard') : t('portfolio');
    const isMenuIconVisible = menuItems.length > 0;

    return (
      <View style={styles.flexOne}>
        <UserScreen
          title={title}
          scrollEnabled
          pageTitle={t('propertyDetails')}
          backgroundColor={theme.colors.background}
          headerStyle={styles.background}
          loading={isLoading}
          onBackPress={this.handleIconPress}
          rightNode={isMenuIconVisible ? this.renderRightNode(menuItems, isListingApproved) : undefined}
          keyboardShouldPersistTaps
        >
          {!isEmpty(propertyData) ? (
            <>
              <AssetCard
                assetData={propertyData}
                isDetailView
                isFromTenancies={isFromTenancies ?? undefined}
                enterFullScreen={this.onFullScreenToggle}
                onCompleteDetails={this.onCompleteDetails}
                onHandleAction={onPressAction}
                containerStyle={styles.card}
                onResend={this.onResendInvite}
              />
              {this.renderTabView()}
            </>
          ) : (
            <EmptyState title={t('common:noDataAvailable')} icon={icons.portfolio} />
          )}
        </UserScreen>
        {this.renderFullscreenCarousel()}
      </View>
    );
  };

  private renderRightNode = (menuItems: IMenu[], isListingApproved: boolean): React.ReactElement => {
    const { t } = this.props;
    const { isDeleteProperty, isShare } = this.state;

    return (
      <Menu
        data={menuItems}
        onSelect={this.onSelectMenuItem}
        optionTitle={t('property:propertyOption')}
        extraNode={isShare ? this.renderShareView() : this.renderConfirmationView()}
        isExtraNode={isShare || isDeleteProperty}
        sheetHeight={isListingApproved ? 350 : 300}
      />
    );
  };

  private renderConfirmationView = (): React.ReactElement => {
    const { t } = this.props;
    const { propertyData, isDeleteProperty } = this.state;
    return (
      <BottomSheet
        visible={isDeleteProperty}
        headerTitle={t('property:deleteProperty')}
        sheetHeight={460}
        onCloseSheet={this.onCloseDeleteView}
      >
        <PropertyConfirmationView
          propertyData={propertyData}
          description={t('deletePropertyDescription')}
          message={t('deleteConfirmation')}
          onCancel={this.onCloseDeleteView}
          onContinue={(): Promise<void> => this.onDeleteProperty(propertyData.id)}
          secondaryButtonStyle={styles.deleteButtonContainer}
          secondaryTitleStyle={styles.deleteButtonText}
        />
      </BottomSheet>
    );
  };

  private renderShareView = (): React.ReactElement => {
    const { t } = this.props;
    const { isShare, sharingMessage, propertyData } = this.state;
    return (
      <SocialMediaShare
        visible={isShare}
        asset={propertyData}
        headerTitle={t('assetDescription:shareProperty')}
        sharingMessage={sharingMessage}
        onCloseSharing={(): void => this.onToggleSharing(false)}
      />
    );
  };

  private renderTabView = (): React.ReactElement | null => {
    const { isFromTenancies, propertyData } = this.state;

    if (!propertyData) {
      return null;
    }

    const routes = isFromTenancies ? TenantRoutes : Routes;

    const data = routes.map((item) => {
      if (item.key === Tabs.ALERT) {
        item = { ...item, count: propertyData.notifications.count };
      }
      if (item.key === Tabs.REQUESTS) {
        item = { ...item, count: propertyData.serviceTickets.count };
      }
      if (item.key === Tabs.CHAT) {
        item = { ...item, count: propertyData.messages.count };
      }
      return item;
    });

    return (
      <>
        <FlatList
          data={data}
          numColumns={3}
          renderItem={({ item, index }): React.ReactElement => {
            return (
              <TabCard
                title={item.title}
                icon={item.icon}
                iconColor={item.color}
                badge={item.count}
                // @ts-ignore
                image={PropertyTabs[item.key]}
                containerStyle={styles.tabView}
                onPressCard={(): void => this.handleTabAction(item.key)}
              />
            );
          }}
        />
      </>
    );
  };

  private renderFullscreenCarousel = (): React.ReactNode => {
    const { isFullScreen, activeSlide, attachments } = this.state;
    if (!isFullScreen) return null;
    return (
      <FullScreenAssetDetailsCarousel
        onFullScreenToggle={this.onFullScreenToggle}
        activeSlide={activeSlide}
        data={attachments}
        updateSlide={this.updateSlide}
      />
    );
  };

  private onFullScreenToggle = (attachments?: Attachment[]): void => {
    const { isFullScreen } = this.state;
    this.setState({ isFullScreen: !isFullScreen });
    if (attachments) {
      this.setState({ attachments });
    }
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

  private onCloseDeleteView = (): void => {
    this.setState({
      isDeleteProperty: false,
    });
  };

  private onDeleteProperty = async (id: number): Promise<void> => {
    const { t, navigation } = this.props;
    this.setState({ isLoading: true });
    try {
      await AssetRepository.deleteAsset(id);
      this.setState(
        {
          isDeleteProperty: false,
          isLoading: false,
        },
        () => {
          AlertHelper.success({ message: t('property:propertyDeleted') });
          navigation.goBack();
        }
      );
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      this.setState({ isDeleteProperty: false, isLoading: false });
    }
  };

  private onResendInvite = async (tenantId: number): Promise<void> => {
    await ListingService.resendInvite(tenantId);
    await this.getAssetDetail();
  };

  private onSelectMenuItem = (value: string): void => {
    const {
      navigation,
      setSelectedPlan,
      setAssetId,
      getAssetById,
      setEditPropertyFlow,
      toggleEditPropertyFlowBottomSheet,
    } = this.props;
    const {
      propertyData: {
        id,
        lastVisitedStep: {
          listing: { type },
        },
        assetStatusInfo,
        assetGroup,
      },
      propertyData,
    } = this.state;
    let params;
    setSelectedPlan({ id, selectedPlan: type });
    setAssetId(id);
    getAssetById();

    switch (value) {
      case MenuItems.EDIT_LISTING:
        // @ts-ignore
        navigation.navigate(ScreensKeys.PropertyPostStack, {
          screen: ScreensKeys.AssetListing,
          params: { previousScreen: ScreensKeys.Dashboard, isEditFlow: true },
        });
        break;
      case MenuItems.EDIT_PROPERTY:
        setEditPropertyFlow(true);
        if (assetStatusInfo && assetStatusInfo.status) {
          params = {
            status: assetStatusInfo.status,
          };
          if (assetStatusInfo.status === 'APPROVED') {
            toggleEditPropertyFlowBottomSheet(true);
          }
        }
        // @ts-ignore
        navigation.navigate(ScreensKeys.PropertyPostStack, {
          screen: ScreensKeys.PostAssetDetails,
          ...(params && { params }),
        });
        break;
      case MenuItems.DELETE_PROPERTY:
        this.setState({
          isDeleteProperty: true,
          isShare: false,
        });
        break;
      case MenuItems.MANAGE_TENANT:
        navigation.navigate(ScreensKeys.ManageTenantScreen, {
          assetDetail: propertyData,
        });
        break;
      case MenuItems.EDIT_LEASE:
        if (assetStatusInfo?.leaseTransaction) {
          navigation.navigate(ScreensKeys.UpdateLeaseScreen, {
            transactionId: assetStatusInfo.leaseTransaction.id,
            assetGroup: assetGroup.code,
            user: assetStatusInfo.leaseTenantInfo.user,
          });
        }
        break;
      case MenuItems.ADD_IMAGE:
        navigation.navigate(ScreensKeys.AddPropertyImage, {
          assetId: propertyData.id,
        });
        break;
      case MenuItems.SHARE_LISTING:
        this.onToggleSharing(true);
        break;
      default:
        FunctionUtils.noop();
    }
  };

  private onToggleSharing = (isVisible: boolean): void => {
    this.setState({
      isShare: isVisible,
    });
  };

  private setSharingMessage = async (): Promise<void> => {
    const { propertyData } = this.state;
    const url = await this.getDynamicUrl();
    const bhk = propertyData.spaces.filter((space: IData) => space.name === SpaceAvailableTypes.BEDROOM);
    const detail = `${bhk ? `${bhk.length} BHK, ` : ''}${propertyData.projectName}`;
    const sharingMessage = I18nService.t('common:shareMessage', { url, detail });

    this.setState({ sharingMessage });
  };

  private getDynamicUrl = async (): Promise<string> => {
    const {
      assetPayload: { listing_id, assetType },
    } = this.props;
    const { RouteType, PropertyTermId, AssetTransactionType } = DynamicLinkParamKeys;
    return LinkingService.buildShortLink(
      DynamicLinkTypes.AssetDescription,
      `${RouteType}=${RouteTypes.Public}&${PropertyTermId}=${listing_id}&${AssetTransactionType}=${
        assetType === DetailType.LEASE_LISTING ? 0 : 1
      }`
    );
  };

  private handleTabAction = (key: Tabs): void => {
    const { navigation, setCurrentProperty } = this.props;
    const { propertyData, isFromTenancies } = this.state;
    if (isEmpty(propertyData)) {
      return;
    }
    const { formattedProjectName, id, assetStatusInfo } = propertyData;

    const param = {
      isFromPortfolio: true,
      isFromTenancies: isFromTenancies ?? false,
      screenTitle: formattedProjectName,
      propertyId: id,
    };
    switch (key) {
      case Tabs.ALERT:
        navigation.navigate(ScreensKeys.AssetNotifications, {
          ...param,
          leaseListingId: assetStatusInfo?.leaseListingId ?? 0,
          saleListingId: assetStatusInfo?.saleListingId ?? 0,
          leaseTransaction: assetStatusInfo?.leaseTransaction.id,
        });
        break;
      case Tabs.REQUESTS:
        navigation.navigate(ScreensKeys.ServiceTicketScreen, param);
        break;
      case Tabs.OFFERS:
        navigation.navigate(ScreensKeys.OfferDetail, param);
        break;
      case Tabs.REVIEWS:
        navigation.navigate(ScreensKeys.AssetReviewScreen, {
          ...param,
          leaseListingId: assetStatusInfo?.leaseListingId ?? 0,
          saleListingId: assetStatusInfo?.saleListingId ?? 0,
        });
        break;
      case Tabs.SITE_VISITS:
        navigation.navigate(ScreensKeys.PropertyVisits, param);
        break;
      case Tabs.FINANCIALS:
        setCurrentProperty(id);
        navigation.navigate(ScreensKeys.AssetFinancialScreen, param);
        break;
      case Tabs.CHAT:
        navigation.navigate(ScreensKeys.ChatScreen, param);
        break;
      case Tabs.DOCUMENTS:
        navigation.navigate(ScreensKeys.DocumentScreen, param);
        break;
      case Tabs.TENANT_HISTORY:
        navigation.navigate(ScreensKeys.TenantHistoryScreen, param);
        break;
      case Tabs.DETAILS:
        navigation.navigate(ScreensKeys.AssetDetailScreen, { ...param, property: propertyData });
        break;
      default:
        navigation.navigate(ScreensKeys.ComingSoonScreen, { title: key, tabHeader: formattedProjectName });
    }
  };

  private getAssetDetail = async (): Promise<void> => {
    const {
      assetPayload: { asset_id, assetType, listing_id },
      setCurrentChatDetail,
      setCurrentOfferPayload,
      setFilter,
    } = this.props;

    if (!asset_id) {
      return;
    }

    const payload: IPropertyDetailPayload = {
      asset_id,
      id: listing_id,
      type: assetType,
    };
    this.setState({ isLoading: true });
    try {
      const response = await PortfolioRepository.getPropertyDetail(payload);
      const info = response.assetStatusInfo;
      this.clearStates();
      this.setState(
        {
          propertyData: response,
          isLoading: false,
          isFromTenancies: !response.isAssetOwner,
        },
        () => {
          if (info && info.leaseTransaction && info.leaseTransaction.id > 0) {
            setCurrentChatDetail({
              groupName: response.projectName,
              groupId: info.leaseTransaction.messageGroupId,
            });
          }

          if (info && (info.leaseListingId || info.saleListingId)) {
            setCurrentOfferPayload({
              type: info.leaseListingId ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
              listingId: info.leaseListingId || info.saleListingId || 0,
            });
            setFilter({ asset_transaction_type: info.leaseListingId && info.leaseListingId > 0 ? 0 : 1 });
          }
        }
      );
    } catch (e) {
      this.setState({ isLoading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private getMenuList = (isListingCreated: boolean, isOccupied: boolean, isListingApproved: boolean): IMenu[] => {
    const { t } = this.props;
    const { isFromTenancies } = this.state;
    let list;
    if (isFromTenancies) {
      return [];
    }
    const addImage = { label: t('property:addImage'), value: MenuItems.ADD_IMAGE };

    if (isOccupied) {
      list = [
        { label: t('property:editLease'), value: MenuItems.EDIT_LEASE },
        { label: t('property:manageTenants'), value: MenuItems.MANAGE_TENANT },
        addImage,
      ];
      return list;
    }

    list = [
      { label: t('property:editProperty'), value: MenuItems.EDIT_PROPERTY },
      {
        label: t('property:deleteProperty'),
        value: MenuItems.DELETE_PROPERTY,
        isExtraData: true,
        isExtraDataAllowed: true,
      },
      addImage,
    ];

    if (isListingCreated) {
      list.splice(1, 0, { label: t('property:editListing'), value: MenuItems.EDIT_LISTING });
    }

    if (isListingApproved) {
      list.push({
        label: t('shareListing'),
        value: MenuItems.SHARE_LISTING,
        isExtraData: true,
        isExtraDataAllowed: true,
      });
    }

    return list;
  };

  private handleAction = (asset: Asset, payload: IClosureReasonPayload, param?: IListingParam): void => {
    const { navigation, setAssetId } = this.props;
    const { CancelListing, TerminateListing } = UpdatePropertyFormTypes;
    const { LEASE_TRANSACTION_TERMINATION } = ClosureReasonType;
    const formType = payload.type === LEASE_TRANSACTION_TERMINATION ? TerminateListing : CancelListing;
    const { id, isSubleased, assetStatusInfo } = asset;
    const startDate = DateUtils.getUtcFormatted(assetStatusInfo?.leaseTransaction.leaseEndDate ?? '', 'DD/MM/YYYY');

    setAssetId(id);

    if (param && param.hasTakeAction) {
      navigation.navigate(ScreensKeys.AssetPlanSelection, {
        isFromPortfolio: true,
        isSubleased,
        leaseUnit: assetStatusInfo?.leaseUnitId ?? undefined,
        ...(!!assetStatusInfo?.leaseTransaction?.leaseEndDate && {
          startDate: DateUtils.getFutureDateByUnit(startDate, 1, 'days'),
        }),
      });
    } else {
      navigation.navigate(ScreensKeys.UpdatePropertyScreen, { formType, payload, param, assetDetail: asset });
    }
  };

  private updateSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
    this.clearStates();
  };

  private clearStates = (): void => {
    const { clearChatDetail, clearMessages, clearState } = this.props;
    clearChatDetail();
    clearMessages();
    clearState();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    assetPayload: PortfolioSelectors.getCurrentAssetPayload(state),
    asset: AssetSelectors.getAsset(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setAssetId, setSelectedPlan, getAssetById, setEditPropertyFlow, toggleEditPropertyFlowBottomSheet } =
    RecordAssetActions;
  const { clearAsset } = AssetActions;
  const { clearChatDetail, clearMessages, setCurrentChatDetail } = CommonActions;
  const { setCurrentOfferPayload, setCompareDetail, clearState } = OfferActions;
  const { setFilter } = SearchActions;
  const { setCurrentProperty } = FinancialActions;
  return bindActionCreators(
    {
      setAssetId,
      setSelectedPlan,
      getAssetById,
      setEditPropertyFlow,
      toggleEditPropertyFlowBottomSheet,
      clearAsset,
      clearChatDetail,
      clearMessages,
      setCurrentChatDetail,
      setCurrentOfferPayload,
      setFilter,
      setCompareDetail,
      clearState,
      setCurrentProperty,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(PropertyDetailScreen));

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  card: {
    borderRadius: 0,
  },
  background: {
    backgroundColor: theme.colors.white,
  },
  tabView: {
    marginHorizontal: 6,
  },
  deleteButtonContainer: {
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.error,
  },
  deleteButtonText: {
    color: theme.colors.white,
  },
});
