import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { NotificationService } from '@homzhub/common/src/services/NotificationService';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { NotificationBox } from '@homzhub/common/src/components/molecules/NotificationBox';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import {
  AssetNotifications,
  Notifications as NotificationModel,
} from '@homzhub/common/src/domain/models/AssetNotifications';
import { NotificationType } from '@homzhub/common/src/domain/models/DeeplinkMetaData';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DetailType, ListingType } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICurrentOffer } from '@homzhub/common/src/modules/offers/interfaces';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { ICurrentTicket } from '@homzhub/common/src/modules/tickets/interface';
import { NotificationScreens } from '@homzhub/mobile/src/services/constants';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IDispatchProps {
  setCurrentAsset: (payload: ISetAssetPayload) => void;
  setFilter: (payload: IFilter) => void;
  setCurrentTicket: (payload: ICurrentTicket) => void;
  setCurrentOfferPayload: (payload: ICurrentOffer) => void;
}

type libraryProps = NavigationScreenProps<CommonParamList, ScreensKeys.AssetNotifications>;
type Props = WithTranslation & libraryProps & IDispatchProps;

interface IAssetNotificationsState {
  notifications: AssetNotifications;
  searchText: string;
  limit: number;
  offset: number;
  scrollEnabled: boolean;
}

export class Notifications extends React.PureComponent<Props, IAssetNotificationsState> {
  public state = {
    notifications: {} as AssetNotifications,
    searchText: '',
    limit: 50,
    offset: 0,
    scrollEnabled: true,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAssetNotifications();
  };

  public render(): React.ReactNode {
    const {
      t,
      route: { params },
    } = this.props;
    const { scrollEnabled, notifications, searchText } = this.state;
    const getTitle = (): string => {
      if (params) {
        return params.isFromDashboard ? t('dashboard') : params.screenTitle ?? t('assetMore:more');
      }
      return t('assetMore:more');
    };

    const markAsReadIcon = (): React.ReactElement => {
      const isDisabled = notifications?.unreadCount === 0;
      return (
        <TouchableOpacity disabled={isDisabled} onPress={this.handleMarkAsRead}>
          <Icon name={icons.tickWithCircle} size={20} color={isDisabled ? theme.colors.disabled : theme.colors.blue} />
        </TouchableOpacity>
      );
    };

    return (
      <UserScreen
        isOuterScrollEnabled={scrollEnabled}
        title={getTitle()}
        onBackPress={this.handleIconPress}
        pageTitle={t('notification')}
        rightNode={!searchText ? markAsReadIcon() : undefined}
      >
        {this.renderNotifications()}
      </UserScreen>
    );
  }

  public renderNotifications = (): React.ReactElement => {
    const {
      t,
      route: { params },
    } = this.props;
    const { notifications, searchText } = this.state;
    const showSearch = !params || (params && !params.isFromPortfolio);
    let containerStyle = {
      height: 800,
    };
    if (notifications?.results && notifications?.results.length === 0) {
      containerStyle = {
        height: 200,
      };
    }
    return (
      <View style={[styles.searchBarContainer, containerStyle]}>
        {showSearch && (
          <SearchBar
            placeholder={t('searchByKeyword')}
            value={searchText}
            updateValue={this.onUpdateSearchText}
            containerStyle={styles.searchbar}
          />
        )}
        {notifications?.results && notifications?.results.length === 0 && <EmptyState />}
        {notifications?.results && notifications?.results.length > 0 && (
          <NotificationBox
            data={notifications?.results}
            onPress={this.onNotificationClicked}
            unreadCount={notifications?.unreadCount ?? 0}
            shouldEnableOuterScroll={this.toggleScroll}
            onLoadMore={this.onLoadMore}
          />
        )}
      </View>
    );
  };

  // TODO:(Shikha) - Refactor Notification navigation logic.
  public onNotificationClicked = async (data: NotificationModel): Promise<void> => {
    const { notifications } = this.state;
    const { navigation, setFilter, setCurrentTicket, setCurrentOfferPayload, setCurrentAsset } = this.props;
    const {
      id,
      deeplinkMetadata: {
        objectId,
        type,
        assetId,
        leaseListingId,
        saleListingId,
        screen,
        leaseUnitId,
        messageGroupId,
        imageLink,
      },
      isRead,
    } = data;

    if (!isRead) {
      await DashboardRepository.updateNotificationStatus(id);
      this.setState({ notifications: NotificationService.getUpdatedNotifications(id, notifications) });
    }

    if (type === NotificationType.SITE_VISIT) {
      navigation.navigate(ScreensKeys.PropertyVisits, { visitId: objectId });
    } else if (type === NotificationType.REVIEW_AND_RATING) {
      navigation.navigate(ScreensKeys.PropertyVisits, { reviewVisitId: objectId });
    } else if (type === NotificationType.PROPERTY_DETAIL || type === NotificationType.PROPERTY_PREVIEW) {
      setFilter({ asset_transaction_type: leaseListingId > 0 ? 0 : 1 });

      // @ts-ignore
      navigation.navigate(ScreensKeys.PropertyAssetDescription, {
        propertyTermId: leaseListingId > 0 ? leaseListingId : saleListingId,
        propertyId: assetId,
      });
    } else if (type === NotificationType.SERVICE_TICKET) {
      setCurrentTicket({ ticketId: objectId });
      navigation.navigate(ScreensKeys.ServiceTicketDetail);
    } else if (type === NotificationType.OFFER) {
      setCurrentOfferPayload({
        type: leaseListingId === -1 ? ListingType.SALE_LISTING : ListingType.LEASE_LISTING,
        listingId: leaseListingId === -1 ? saleListingId : leaseListingId,
        ...(Boolean(messageGroupId.length) && { threadId: messageGroupId }),
      });

      if (screen === NotificationScreens.OffersReceived) {
        // @ts-ignore
        navigation.navigate(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.More,
          params: {
            screen: ScreensKeys.PropertyOfferList,
            initial: false,
            params: { isReceivedFlow: true },
          },
        });
        return;
      }
      if (screen === NotificationScreens.OffersMade) {
        // @ts-ignore
        navigation.navigate(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.More,
          params: {
            screen: ScreensKeys.PropertyOfferList,
            initial: false,
            params: { isReceivedFlow: false },
          },
        });
        return;
      }

      if (screen === NotificationScreens.OfferChats) {
        navigation.navigate(ScreensKeys.ChatScreen, { isFromOffers: true });
        return;
      }
      // @ts-ignore
      navigation.navigate(ScreensKeys.BottomTabs, {
        screen: ScreensKeys.More,
        params: {
          screen: ScreensKeys.OfferDetail,
          initial: false,
        },
      });
    } else if (type === NotificationType.ASSET) {
      setCurrentAsset({
        asset_id: assetId,
        listing_id: leaseUnitId,
        assetType: DetailType.LEASE_UNIT,
      });
      // @ts-ignore
      navigation.navigate(ScreensKeys.BottomTabs, {
        screen: ScreensKeys.Portfolio,
        params: {
          screen: ScreensKeys.PropertyDetailScreen,
          initial: false,
        },
      });
    } else if (type === NotificationType.CAMPAIGN) {
      if (imageLink.length <= 0 || imageLink.split('.').reverse()[0] === 'svg') return;

      // @ts-ignore
      navigation.navigate(ScreensKeys.BottomTabs, {
        screen: ScreensKeys.Dashboard,
        params: {
          screen: ScreensKeys.DashboardLandingScreen,
          initial: false,
          params: { imageLink },
        },
      });
    } else if (type === NotificationType.VALUE_ADDED_SERVICE) {
      // @ts-ignore
      navigation.navigate(ScreensKeys.Service);
    } else if (type === NotificationType.ASSET_DOCUMENT) {
      navigation.navigate(ScreensKeys.DocumentScreen, { isFromDashboard: true, propertyId: assetId });
    } else if (type === NotificationType.REFER_AND_EARN) {
      navigation.navigate(ScreensKeys.ReferEarn);
    } else if (type === NotificationType.DUE) {
      // @ts-ignore
      navigation.navigate(ScreensKeys.DuesScreen);
    }
  };

  public onLoadMore = (): void => {
    const { notifications } = this.state;
    if (notifications.results && notifications.results.length !== notifications.count) {
      this.setState({ offset: notifications.results.length }, () => {
        this.getAssetNotifications(true).then();
      });
    }
  };

  public onUpdateSearchText = (value: string): void => {
    // Set offset to 0 everytime user searches for a string
    this.setState({ searchText: value, limit: 50, offset: 0 }, () => {
      this.getAssetNotifications().then();
    });
  };

  private toggleScroll = (scrollEnabled: boolean): void => {
    this.setState({ scrollEnabled });
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  public handleMarkAsRead = async (): Promise<void> => {
    const { notifications } = this.state;
    const { t } = this.props;
    if (notifications?.results?.length > 0) {
      try {
        const latestCreatedAt = notifications.results[0].createdAt;
        await DashboardRepository.markAllNotificationsRead(latestCreatedAt);
        await this.getAssetNotifications();
        AlertHelper.success({ message: t('assetDashboard:allNotificationsAreRead') });
      }catch (e: any) {        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
  };

  public getAssetNotifications = async (loadMore = false): Promise<void> => {
    const { searchText, limit, offset, notifications } = this.state;
    const {
      route: { params },
    } = this.props;
    let requestPayload = {
      limit,
      offset,
      ...((!params || (params && !params.isFromPortfolio)) && searchText.length > 0 ? { q: searchText } : {}),
    };

    if (params && !params.isFromDashboard) {
      const { saleListingId, leaseListingId, leaseTransaction, propertyId } = params;
      const isTransaction = leaseTransaction && leaseTransaction > 0;
      const isAsset = !isTransaction && !leaseListingId && !saleListingId;

      requestPayload = {
        ...requestPayload,
        ...(isTransaction && { lease_transaction_id: leaseTransaction }),
        ...(!isTransaction && leaseListingId && { lease_listing_id: leaseListingId }),
        ...(!isTransaction && saleListingId && { sale_listing_id: saleListingId }),
        ...(isAsset && { asset_id: propertyId }),
      };
    }

    try {
      const response = await DashboardRepository.getAssetNotifications(requestPayload);
      if (loadMore) {
        this.setState({
          notifications: NotificationService.transformNotificationsData(response, notifications),
        });
      } else {
        this.setState({
          notifications: response,
        });
      }
    }catch (e: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setCurrentAsset } = PortfolioActions;
  const { setFilter } = SearchActions;
  const { setCurrentTicket } = TicketActions;
  const { setCurrentOfferPayload } = OfferActions;
  return bindActionCreators({ setCurrentAsset, setFilter, setCurrentTicket, setCurrentOfferPayload }, dispatch);
};

export default connect(
  null,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetDashboard)(Notifications));

const styles = StyleSheet.create({
  searchbar: {
    margin: theme.layout.screenPadding,
  },
  searchBarContainer: {
    backgroundColor: theme.colors.white,
  },
});
