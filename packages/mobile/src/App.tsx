import "react-native-gesture-handler";
import React from "react";
import { Provider } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import FlashMessage, {
  MessageComponentProps,
} from "react-native-flash-message";
import { AlertHelper } from "@homzhub/common/src/utils/AlertHelper";
import { AnalyticsService } from "@homzhub/common/src/services/Analytics/AnalyticsService";
import { LinkingService } from "./services/LinkingService";
import { I18nService } from "@homzhub/common/src/services/Localization/i18nextService";
import { NotificationService } from "./services/NotificationService";
import { StoreProviderService } from "@homzhub/common/src/services/StoreProviderService";
import {
  IUserTokens,
  StorageKeys,
  StorageService,
} from "@homzhub/common/src/services/storage/StorageService";
import { configureStore } from "@homzhub/common/src/modules/store";
import { CommonActions } from "@homzhub/common/src/modules/common/actions";
import { UserActions } from "@homzhub/common/src/modules/user/actions";
import { RootNavigator } from "@homzhub/mobile/src/navigation/RootNavigator";

import ErrorBoundary from "./components/HOC/ErrorBoundary";
import { Toast } from "@homzhub/common/src/components/molecules/Toast";
import AppUpdate from "./components/organisms/AppUpdate";
import ReviewAndRefer from "./components/organisms/ReviewAndRefer";
import { SupportedLanguages } from "@homzhub/common/src/services/Localization/constants";

interface IState {
  booting: boolean;
}

StoreProviderService.init(configureStore);
const store = StoreProviderService.getStore();

export default class App extends React.PureComponent<{}, IState> {
  public listener: any;
  public state = {
    booting: true,
  };

  public componentDidMount = async (): Promise<void> => {
    this.listener = NetInfo.addEventListener((state) => {
      this.handleConnectivityChange(state.isConnected);
    });
    await LinkingService.firebaseInit();
    await this.bootUp();
    await AnalyticsService.initMixpanel();
    await NotificationService.init();
  };

  public componentWillUnmount(): void {
    this.listener();
  }

  public render = (): React.ReactNode => {
    const { booting } = this.state;

    return (
      <ErrorBoundary>
        <Provider store={store}>
          <RootNavigator booting={booting} />
          <FlashMessage position="bottom" MessageComponent={this.renderToast} />
          <AppUpdate />
          <ReviewAndRefer />
        </Provider>
      </ErrorBoundary>
    );
  };

  private renderToast = (props: MessageComponentProps): React.ReactElement => (
    <Toast {...props} />
  );

  private handleConnectivityChange = (isConnected: boolean): void => {
    if (!isConnected) {
      AlertHelper.error({
        message: I18nService.t("common:serverError"),
      });
    }
  };

  private bootUp = async (): Promise<void> => {
    // FETCH COUNTRY OF THE DEVICE

    const isOnBoardingCompleted =
      (await StorageService.get<boolean>(
        StorageKeys.IS_ONBOARDING_COMPLETED
      )) ?? false;
    store.dispatch(CommonActions.getCountries());
    store.dispatch(UserActions.updateOnBoarding(isOnBoardingCompleted));

    const userData = await StorageService.get<IUserTokens>(StorageKeys.USER);

    if (userData) {
      store.dispatch(UserActions.loginSuccess(userData));
    }

    const selectedLanguage: SupportedLanguages | null =
      await StorageService.get(StorageKeys.USER_SELECTED_LANGUAGE);
    await I18nService.init(selectedLanguage || undefined);

    this.setState({ booting: false });
  };
}
