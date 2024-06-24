import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import AssetMarketTrends from '@homzhub/mobile/src/components/molecules/AssetMarketTrends';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type libraryProps = NavigationScreenProps<CommonParamList, ScreensKeys.MarketTrends>;
type Props = WithTranslation & libraryProps;

export class MarketTrends extends React.PureComponent<Props> {
  public render = (): React.ReactElement => {
    const { t, navigation, route } = this.props;
    const title = route.params && route.params.isFromDashboard ? t('assetDashboard:dashboard') : t('assetMore:more');

    return (
      <UserScreen
        title={title}
        pageTitle={t('assetMore:marketTrends')}
        onBackPress={navigation.goBack}
        scrollEnabled={false}
      >
        <AssetMarketTrends onTrendPress={this.openWebView} />
      </UserScreen>
    );
  };

  private openWebView = (url: string, trendId: number): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.WebViewScreen, { url, trendId });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(MarketTrends);
