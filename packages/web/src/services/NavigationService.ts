import { showMessage } from 'react-native-flash-message';
import { History, LocationState } from 'history';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { IUserTokens, StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { DynamicLinkTypes, IDynamicLinkParams, RouteTypes } from '@homzhub/web/src/services/constants';

interface INavigationOptions<S> {
  path: string;
  params?: S;
}
export interface IRedirectionDetailsWeb {
  dynamicLinks: IDynamicLinkParams;
  shouldRedirect: boolean;
}

interface IErrorMessageProps {
  message: string;
}

class NavigationService<T extends History> {
  private navigator: any;
  private history: any;
  public isNavReady: boolean;

  constructor() {
    this.isNavReady = false;
  }

  get navigation(): any {
    return this.navigator;
  }

  get appHistory(): any {
    return this.history;
  }

  public setTopLevelNavigator = (navigatorRef: any): void => {
    this.navigator = navigatorRef;
    this.history = navigatorRef.history;
    this.isNavReady = true;
  };

  public navigate<S = LocationState>(navigationProps: T, options: INavigationOptions<S>): void {
    const { path, params = undefined } = options;
    navigationProps.push(path, params);
  }

  public goBack(): void {
    this.appHistory.goBack();
  }

  public openNewTab<S = LocationState>(options: INavigationOptions<S>): void {
    const { path } = options;
    const newWindow = window.open(path, '_blank');
    if (newWindow) {
      newWindow.focus();
    }
  }

  public errorNavSwitch = (status: number, messageProps: IErrorMessageProps): void => {
    const statusCode = Number(status) >= 500 && Number(status) !== 504 ? 500 : Number(status);
    const { message } = messageProps;
    switch (statusCode) {
      case 504:
        this.navigate(this.history, { path: RouteNames.publicRoutes.ERROR504 });
        break;
      case 404:
        this.navigate(this.history, { path: RouteNames.publicRoutes.ERROR404 });
        break;
      case 500:
        this.navigate(this.history, { path: RouteNames.publicRoutes.ERROR });
        break;
      default:
        showMessage({
          duration: 5000,
          message,
          type: 'danger',
          backgroundColor: theme.colors.error,
        });
    }
  };

  public handleDynamicLinkNavigation = async (dynamicLinkParams: any): Promise<void> => {
    const userData = await StorageService.get<IUserTokens>(StorageKeys.USER);
    const store = StoreProviderService.getStore();
    const { routeType } = dynamicLinkParams;

    if (!this.navigator) {
      return;
    }

    // Handle public routes inside the below if statement
    if (!userData && routeType === RouteTypes.Public) {
      this.handlePublicRoutes(dynamicLinkParams);
      return;
    }

    // Handle private routes inside the below if statement
    if (userData && routeType === RouteTypes.Private) {
      const redirectionDetails = { dynamicLinks: { routeType: '', type: '', params: {} }, shouldRedirect: false };
      store.dispatch(CommonActions.setRedirectionDetails(redirectionDetails));
      this.handlePrivateRoutes(dynamicLinkParams);
      return;
    }
    // Handle dynamic routes inside the below if statement
    if (userData && routeType === RouteTypes.Public) {
      const redirectionDetails = { dynamicLinks: { routeType: '', type: '', params: {} }, shouldRedirect: false };
      store.dispatch(CommonActions.setRedirectionDetails(redirectionDetails));
      this.handlePublicProtectedRoutes(dynamicLinkParams);
      return;
    }

    // // Otherwise redirect user to the authentication screen which has login option too
    if (!userData && dynamicLinkParams) {
      const redirectionDetails = { dynamicLinks: dynamicLinkParams, shouldRedirect: true };
      store.dispatch(CommonActions.setRedirectionDetails(redirectionDetails));
      this.navigate(this.history, { path: RouteNames.publicRoutes.LOGIN });
    }
  };

  public handlePublicRoutes = (dynamicLinkParams: IDynamicLinkParams): void => {
    const { type, params } = dynamicLinkParams;
    const { asset_name, asset_transaction_type: assetTransactionType, propertyTermId } = params;
    const projectName = asset_name ? asset_name.replace('_', ' ') : 'Property';
    switch (type) {
      case DynamicLinkTypes.AssetDescription:
        this.navigate(this.history, {
          path: RouteNames.publicRoutes.PROPERTY_DETAIL.replace(':propertyName', `${projectName}`),
          params: { listingId: propertyTermId, assetTransactionType },
        });
        break;
      default:
        this.navigate(this.history, { path: RouteNames.publicRoutes.LOGIN });
    }
  };

  public handlePrivateRoutes = (dynamicLinkParams: IDynamicLinkParams): void => {
    const { type } = dynamicLinkParams;
    switch (type) {
      case DynamicLinkTypes.PrimaryEmailVerification:
      case DynamicLinkTypes.WorkEmailVerification:
        this.navigate(this.history, {
          path: RouteNames.protectedRoutes.PROFILE,
          params: { ...dynamicLinkParams.params },
        });
        break;
      default:
        this.navigate(this.history, { path: RouteNames.protectedRoutes.DASHBOARD });
    }
  };

  public handlePublicProtectedRoutes = (dynamicLinkParams: IDynamicLinkParams): void => {
    const { type, params } = dynamicLinkParams;
    const { asset_name, asset_transaction_type: assetTransactionType, propertyTermId, popupInitType } = params;
    const projectName = asset_name ? asset_name.replace('_', ' ') : 'Property';
    switch (type) {
      case DynamicLinkTypes.AssetDescription:
        this.navigate(this.history, {
          path: RouteNames.publicRoutes.PROPERTY_DETAIL.replace(':propertyName', `${projectName}`),
          params: { listingId: propertyTermId, assetTransactionType, popupInitType },
        });
        break;
      default:
        this.navigate(this.history, { path: RouteNames.protectedRoutes.DASHBOARD });
    }
  };
}

const navigationUtils = new NavigationService();
export { navigationUtils as NavigationService };
