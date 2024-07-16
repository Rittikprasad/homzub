import React, { useCallback, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { icons } from '@homzhub/common/src/assets/icon';
import { Header } from '@homzhub/mobile/src/components';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type Props = NavigationScreenProps<AuthStackParamList, ScreensKeys.WebViewScreen>;

export const WebViewScreen = (props: Props): React.ReactElement => {
  const {
    navigation,
    route: {
      params: { url, trendId },
    },
  } = props;
  const { t } = useTranslation();

  useEffect(() => {
    if (!trendId) {
      return;
    }
    try {
      CommonRepository.updateMarketTrends(trendId).then();
    }catch (err: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
  }, []);

  const handleBackPress = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  const onShare = useCallback(async (): Promise<void> => {
    await Share.share({
      message: `${t('assetMore:shareTrend')} ${url}`,
    });
  }, [url, t]);

  const ActivityIndicatorLoadingView = useCallback((): React.ReactElement => <Loader visible />, []);

  return (
    <View style={styles.container}>
      <Header
        icon={icons.leftArrow}
        onIconPress={handleBackPress}
        iconRight={trendId ? icons.shareExternal : undefined}
        onIconRightPress={trendId ? onShare : undefined}
      />
      <WebView source={{ uri: url }} renderLoading={ActivityIndicatorLoadingView} startInLoadingState />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
