import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import PropertyDetail from '@homzhub/mobile/src/components/organisms/PropertyDetail';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { IDetailNavParam } from '@homzhub/mobile/src/navigation/interfaces';

const AssetDetail = (): React.ReactElement => {
  let detail = useSelector(AssetSelectors.getAsset);
  const { params } = useRoute();
  const { goBack } = useNavigation();
  const { t } = useTranslation();
  const param = params as IDetailNavParam;

  if (!detail) {
    detail = param.property;
  }
  return (
    <UserScreen
      title={param?.screenTitle ?? t('assetPortfolio:portfolio')}
      pageTitle={t('assetFinancial:details')}
      onBackPress={goBack}
    >
      <View style={styles.container}>
        <PropertyDetail detail={detail} isCollapsible={false} isFromPortfolio />
      </View>
    </UserScreen>
  );
};

export default AssetDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
  },
});
