import { CommonActions } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { IUserTokens, StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { CommonActions as StoreCommonActions } from '@homzhub/common/src/modules/common/actions';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import {
  DynamicLinkParamKeys,
  DynamicLinkTypes,
  NotificationScreens,
  RouteTypes,
} from '@homzhub/mobile/src/services/constants';
import { DetailType, ListingType } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICurrentOffer } from '@homzhub/common/src/modules/offers/interfaces';

class NavigationService {
  private navigator: any;

  get navigation(): any {
    return this.navigator;
  }

  public setTopLevelNavigator = (navigatorRef: any): void => {
    this.navigator = navigatorRef;
  };

  // This method is an entry point to handle dynamic links
  public handleDynamicLinkNavigation = async (redirectionDetails: IRedirectionDetails): Promise<void> => {
    const userData = await StorageService.get<IUserTokens>(StorageKeys.USER);
    const { redirectionLink, shouldRedirect } = redirectionDetails;
    const routeType = this.getValueOfParamFromUrl(DynamicLinkParamKeys.RouteType, redirectionLink);

    if (!this.navigator) {
      return;
    }

    // Handle public routes inside the below if statement
    if (!userData && routeType === RouteTypes.Public && redirectionLink && shouldRedirect) {
      this.handlePublicRoutes(redirectionLink);
      return;
    }

    // Handle private routes inside the below if statement
    if (userData && redirectionLink && shouldRedirect) {
      this.handlePrivateRoutes(redirectionLink);
      return;
    }

    // Otherwise redirect user to the signup screen which has login option too
    if (redirectionLink && shouldRedirect) {
      this.navigator.navigate(ScreensKeys.AuthStack, {
        screen: ScreensKeys.SignUp,
      });
    }
  };

  public handlePrivateRoutes = (url: string): void => {
    const type = this.getValueOfParamFromUrl(DynamicLinkParamKeys.Type, url);
    const screen = this.getValueOfParamFromUrl(DynamicLinkParamKeys.Screen, url);
    const store = StoreProviderService.getStore();

    switch (type) {
      case DynamicLinkTypes.AssetDescription:
        store.dispatch(
          SearchActions.setFilter({
            asset_transaction_type:
              Number(this.getValueOfParamFromUrl(DynamicLinkParamKeys.AssetTransactionType, url)) || 0,
          })
        );
        this.navigateTo(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.More,
          params: {
            screen: ScreensKeys.PropertyAssetDescription,
            initial: false,
            params: {
              propertyTermId: this.getValueOfParamFromUrl(DynamicLinkParamKeys.PropertyTermId, url) || 0,
            },
          },
        });
        break;
      case DynamicLinkTypes.ResetPassword:
        this.navigateTo(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.More,
          params: {
            screen: ScreensKeys.ResetPassword,
            initial: false,
            params: {
              verification_id: this.getValueOfParamFromUrl(DynamicLinkParamKeys.VerificationId, url),
            },
          },
        });
        break;
      case DynamicLinkTypes.PrimaryEmailVerification:
      case DynamicLinkTypes.WorkEmailVerification:
        this.navigateTo(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.More,
          params: {
            screen: ScreensKeys.UserProfileScreen,
            initial: false,
            params: {
              verification_id: this.getValueOfParamFromUrl(DynamicLinkParamKeys.VerificationId, url),
            },
          },
        });
        break;
      case DynamicLinkTypes.Referral:
        AlertHelper.error({ message: I18nService.t('auth:loggedInReferralCodeError') });
        break;
      case DynamicLinkTypes.PropertyVisitReview:
        this.navigateTo(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.More,
          params: {
            screen: ScreensKeys.PropertyVisits,
            initial: false,
            params: {
              reviewVisitId: parseInt(this.getValueOfParamFromUrl(DynamicLinkParamKeys.VisitId, url), 10),
            },
          },
        });
        break;
      case DynamicLinkTypes.TenantInvitation:
        this.navigateTo(ScreensKeys.Portfolio, {
          screen: ScreensKeys.PortfolioLandingScreen,
          params: {
            inviteId: this.getValueOfParamFromUrl(DynamicLinkParamKeys.InviteId, url),
          },
        });
        break;
      case DynamicLinkTypes.ServiceTicket:
        store.dispatch(
          TicketActions.setCurrentTicket({
            ticketId: parseInt(this.getValueOfParamFromUrl(DynamicLinkParamKeys.TicketId, url), 10),
          })
        );
        this.navigateTo(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.More,
          params: {
            screen: ScreensKeys.ServiceTicketDetail,
            initial: false,
          },
        });
        break;
      case DynamicLinkTypes.Offer:
        store.dispatch(OfferActions.setCurrentOfferPayload(this.getOfferRedirectionPayload(url)));
        switch (screen) {
          case NotificationScreens.OffersReceived || NotificationScreens.OffersMade:
            this.navigateTo(ScreensKeys.BottomTabs, {
              screen: ScreensKeys.More,
              params: {
                screen: ScreensKeys.PropertyOfferList,
                initial: false,
                params: {
                  isReceivedFlow: screen === NotificationScreens.OffersReceived,
                },
              },
            });
            break;
          case NotificationScreens.OfferChats:
            this.navigateTo(ScreensKeys.BottomTabs, {
              screen: ScreensKeys.More,
              params: {
                screen: ScreensKeys.ChatScreen,
                initial: false,
                params: {
                  isFromOffers: true,
                  isFromNotifications: true,
                },
              },
            });
            break;
          default:
            this.navigateTo(ScreensKeys.BottomTabs, {
              screen: ScreensKeys.More,
              params: {
                screen: ScreensKeys.OfferDetail,
                initial: false,
              },
            });
            break;
        }
        break;
      case DynamicLinkTypes.Asset:
        store.dispatch(
          PortfolioActions.setCurrentAsset({
            asset_id: Number(this.getValueOfParamFromUrl(DynamicLinkParamKeys.AssetId, url)),
            listing_id: Number(this.getValueOfParamFromUrl(DynamicLinkParamKeys.LeaseUnitId, url)),
            assetType: DetailType.LEASE_UNIT,
          })
        );
        this.navigateTo(ScreensKeys.Portfolio, {
          screen: ScreensKeys.PropertyDetailScreen,
          initial: false,
        });
        break;
      case DynamicLinkTypes.Due:
        this.navigateTo(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.Financials,
          initial: false,
        });
        break;
      case DynamicLinkTypes.UserProfile:
        this.navigateTo(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.More,
          params: {
            screen: ScreensKeys.UserProfileScreen,
            initial: false,
          },
        });
        break;
      default:
        AlertHelper.error({ message: I18nService.t('common:invalidLink') });
        break;
    }
  };

  public handlePublicRoutes = (url: string): void => {
    const type = this.getValueOfParamFromUrl(DynamicLinkParamKeys.Type, url);
    const inviteId = this.getValueOfParamFromUrl(DynamicLinkParamKeys.InviteId, url);
    switch (type) {
      case DynamicLinkTypes.AssetDescription:
        this.navigateTo(ScreensKeys.SearchStack, {
          screen: ScreensKeys.Search,
          params: {
            screen: ScreensKeys.PropertyAssetDescription,
            initial: false,
            params: {
              propertyTermId: this.getValueOfParamFromUrl(DynamicLinkParamKeys.PropertyTermId, url) || 0,
            },
          },
        });
        break;
      case DynamicLinkTypes.ResetPassword:
        this.navigateTo(ScreensKeys.AuthStack, {
          screen: ScreensKeys.ResetPassword,
          initial: false,
          params: {
            verification_id: this.getValueOfParamFromUrl(DynamicLinkParamKeys.VerificationId, url),
            ...(inviteId && { invite_id: inviteId }),
          },
        });
        break;
      case DynamicLinkTypes.Referral:
        this.navigateTo(ScreensKeys.AuthStack, {
          screen: ScreensKeys.SignUp,
          params: {
            referralCode: this.getValueOfParamFromUrl(DynamicLinkParamKeys.ReferralCode, url),
          },
        });
        break;
      default:
        AlertHelper.error({ message: I18nService.t('common:invalidLinkError') });
        break;
    }
  };

  private navigateTo = (stackName: string, params: any): void => {
    const store = StoreProviderService.getStore();
    this.navigator.navigate(stackName, params);
    store.dispatch(StoreCommonActions.setRedirectionDetails({ redirectionLink: '', shouldRedirect: false }));
  };

  public setParams = (params: any): void => {
    this.navigator.setParams(params);
  };

  private goBack = (): void => {
    if (this.navigator) {
      if (this.navigator.canGoBack()) {
        this.navigator.goBack();
        return;
      }

      this.navigator.dispatch(
        CommonActions.navigate({
          name: ScreensKeys.Dashboard,
        })
      );
    }
  };

  private getValueOfParamFromUrl = (param: string, url: string): string => {
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    const match = url.match(`A?${param}=[^&]+`);

    if (!match) {
      return '';
    }

    return match[0].split('=')[1];
  };

  private getOfferRedirectionPayload = (url: string): ICurrentOffer => {
    const messageGroupId = this.getValueOfParamFromUrl(DynamicLinkParamKeys.MessageGroupId, url);
    if (url.includes(DynamicLinkParamKeys.LeaseListingId)) {
      return {
        type: ListingType.LEASE_LISTING,
        listingId: Number(this.getValueOfParamFromUrl(DynamicLinkParamKeys.LeaseListingId, url)),
        ...(messageGroupId.length > 0 && { threadId: messageGroupId }),
      };
    }
    return {
      type: ListingType.SALE_LISTING,
      listingId: Number(this.getValueOfParamFromUrl(DynamicLinkParamKeys.SaleListingId, url)),
      ...(messageGroupId.length > 0 && { threadId: messageGroupId }),
    };
  };

  public notificationNavigation = (routeName: string, params: any = {}, tabName?: string): void => {
    if (this.navigator) {
      if (tabName) {
        this.navigator.navigate(ScreensKeys.BottomTabs, {
          screen: tabName,
          params: {
            screen: routeName,
            initial: false,
            params,
          },
        });

        return;
      }
      this.navigator.navigate(routeName, params);
    }
  };

  public navigateToTermsCondition = (): void => {
    this.navigator.navigate(ScreensKeys.WebViewScreen, { url: 'https://www.homzhub.com/terms&Condition' });
  };
}

const navigationService = new NavigationService();
export { navigationService as NavigationService };
