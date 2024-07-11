import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import FlashMessage, {
  MessageComponentProps,
} from "react-native-flash-message";
import { configureStore } from "@homzhub/common/src/modules/store";
import { I18nService } from "@homzhub/common/src/services/Localization/i18nextService";
import { AnalyticsService } from "@homzhub/common/src/services/Analytics/AnalyticsService";
import { LinkingService } from "@homzhub/ffm/src/services/LinkingService";
import { NotificationService } from "@homzhub/ffm/src/services/NotificationService";
import { StoreProviderService } from "@homzhub/common/src/services/StoreProviderService";
import {
  IUserTokens,
  StorageKeys,
  StorageService,
} from "@homzhub/common/src/services/storage/StorageService";
import { CommonActions } from "@homzhub/common/src/modules/common/actions";
import { UserActions } from "@homzhub/common/src/modules/user/actions";
import ErrorBoundary from "@homzhub/mobile/src/components/HOC/ErrorBoundary";
import { Toast } from "@homzhub/common/src/components/molecules/Toast";
import { RootNavigator } from "@homzhub/ffm/src/navigation/RootNavigator";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";

StoreProviderService.init(configureStore);
const store = StoreProviderService.getStore();

const App: () => React.ReactElement = () => {
  const [booting, setBooting] = useState(true);
  useEffect(() => {
    bootUp().then();
  }, []);

  const bootUp = async (): Promise<void> => {
    store.dispatch(CommonActions.getCountries());
    await Promise.all([
      StorageService.get(StorageKeys.USER_SELECTED_LANGUAGE),
      StorageService.get<IUserTokens>(StorageKeys.USER),
      NotificationService.init(),
      LinkingService.firebaseInit(),
      AnalyticsService.initMixpanel(),
    ]).then((res: any) => {
      if (res[0] === null) {
        I18nService.init(LocaleConstants.fallback);
      } else {
        I18nService.init(res[0]);
      }

      if (res[1]) {
        store.dispatch(UserActions.loginSuccess(res[1]));
      }

      setBooting(false);
    });
  };

  const renderToast = (props: MessageComponentProps): React.ReactElement => (
    <Toast {...props} />
  );

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <RootNavigator booting={booting} />
        <FlashMessage position="bottom" MessageComponent={renderToast} />
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
