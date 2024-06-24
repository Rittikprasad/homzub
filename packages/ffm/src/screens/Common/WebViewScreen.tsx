import React, { useCallback, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import { icons } from '@homzhub/common/src/assets/icon';
import { Header } from '@homzhub/mobile/src/components';
import { AuthStackParamList } from '@homzhub/ffm/src/navigation/AuthStack';
import { NavigationScreenProps, ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type Props = NavigationScreenProps<AuthStackParamList, ScreenKeys.WebViewScreen>;

export const WebViewScreen = (props: Props): React.ReactElement => {
  const {
    navigation,
    route: {
      params: { url },
    },
  } = props;
  const { t } = useTranslation();

  const handleBackPress = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  const onShare = useCallback(async (): Promise<void> => {
    await Share.share({
      message: `${t('assetMore:shareTrend')} ${url}`,
    });
  }, [url, t]);

  return (
    <View style={styles.container}>
      <Header icon={icons.leftArrow} onIconPress={handleBackPress} />
      <WebView source={{ uri: url }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
