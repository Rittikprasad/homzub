import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { FinancialsActions } from '@homzhub/web/src/screens/financials/FinancialsPopover';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

interface IProps {
  setFinancialsActionType: React.Dispatch<React.SetStateAction<FinancialsActions | null>>;
}

const PropertyList: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { setFinancialsActionType } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const asset = useSelector(AssetSelectors.getUserActiveAssets);
  const { activeAssets } = useSelector(AssetSelectors.getAssetLoaders);

  useEffect(() => {
    dispatch(AssetActions.getActiveAssets());
    dispatch(PropertyPaymentActions.clearSocietyFormData());
    dispatch(PropertyPaymentActions.clearSocietyDetail());
  }, []);

  const handleNavigation = (assetId: number): void => {
    dispatch(PropertyPaymentActions.setAssetId(assetId));
    setFinancialsActionType(FinancialsActions.PropertyPayment_PropertyServices);
  };

  const renderItem = ({ item }: { item: Asset }): React.ReactElement => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={(): void => handleNavigation(item.id)}>
        <PropertyAddressCountry
          primaryAddress={item.projectName}
          subAddress={item.assetAddress}
          propertyType={item.assetType.name}
          countryFlag={item.country.flag}
          // @ts-ignore
          primaryAddressTextStyles={{
            size: 'small',
          }}
        />
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item: Asset): string => item.id.toString();

  return (
    <View>
      <Loader visible={activeAssets} />
      <View style={styles.backTextWithIcon}>
        <Icon name={icons.leftArrow} size={20} color={theme.colors.primaryColor} />
        <Typography variant="text" size="small" fontWeight="semiBold" style={styles.contentTitle}>
          {t('common:properties')}
        </Typography>
      </View>
      <Typography variant="text" size="small" fontWeight="regular">
        {t('property:chooseProperty')}
      </Typography>
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
    </View>
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
    overflowY: 'auto',
  },
  itemContainer: {
    borderWidth: 2,
    borderColor: theme.colors.background,
    padding: 16,
    marginVertical: 4,
  },
  contentTitle: {
    marginLeft: 12,
  },
  backTextWithIcon: {
    flexDirection: 'row',
    marginBottom: 24,
  },
});
