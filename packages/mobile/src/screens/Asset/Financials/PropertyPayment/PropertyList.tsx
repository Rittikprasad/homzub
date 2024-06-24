import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const PropertyList = (): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goBack, navigate } = useNavigation();
  const asset = useSelector(AssetSelectors.getUserActiveAssets);
  const { activeAssets } = useSelector(AssetSelectors.getAssetLoaders);

  useEffect(() => {
    dispatch(AssetActions.getActiveAssets());
    dispatch(PropertyPaymentActions.clearSocietyFormData());
    dispatch(PropertyPaymentActions.clearSocietyDetail());
  }, []);

  const handleNavigation = (assetId: number): void => {
    dispatch(PropertyPaymentActions.setAssetId(assetId));
    navigate(ScreensKeys.PaymentServices);
  };

  const renderItem = ({ item }: { item: Asset }): React.ReactElement => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={(): void => handleNavigation(item.id)}>
        <PropertyAddressCountry
          primaryAddress={item.projectName}
          subAddress={item.assetAddress}
          propertyType={item.assetType.name}
          countryFlag={item.country.flag}
          // eslint-disable-next-line react-native/no-inline-styles
          primaryAddressTextStyles={{
            size: 'small',
          }}
        />
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item: Asset): string => item.id.toString();

  return (
    <UserScreen
      title={t('propertyPayment:propertyPayment')}
      pageTitle={t('properties')}
      isGradient
      isBackgroundRequired
      onBackPress={goBack}
      loading={activeAssets}
      contentContainerStyle={styles.container}
    >
      <Text type="small" textType="semiBold">
        {t('property:chooseProperty')}
      </Text>
      {asset.length > 0 ? (
        <FlatList
          data={asset}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <EmptyState icon={icons.portfolio} />
      )}
    </UserScreen>
  );
};

export default PropertyList;

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: theme.colors.white,
  },
  listContainer: {
    marginVertical: 16,
  },
  itemContainer: {
    borderWidth: 2,
    borderColor: theme.colors.background,
    padding: 16,
    marginVertical: 4,
  },
});
