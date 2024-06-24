import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { ITypographyProps } from '@homzhub/common/src/components/atoms/Typography';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { Asset, Data } from '@homzhub/common/src/domain/models/Asset';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';

interface IProps {
  assetData: Asset;
}

const PropertyDetails = ({ assetData }: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const {
    address,
    assetGroup,
    furnishing,
    spaces,
    projectName,
    carpetArea,
    carpetAreaUnit,
    country,
    unitNumber,
    blockNumber,
  } = assetData;
  const primaryAddress = projectName;
  const subAddress = address ?? `${unitNumber ?? ''} ${blockNumber ?? ''}`;
  const countryIconUrl = country?.flag;
  const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
    spaces ?? ([] as Data[]),
    furnishing,
    assetGroup.code,
    carpetArea,
    carpetAreaUnit?.title ?? '',
    true
  );
  const addressTextStyle: ITypographyProps = {
    size: 'small',
    fontWeight: 'semiBold',
    variant: 'text',
  };
  const subAddressTextStyle: ITypographyProps = {
    size: 'regular',
    fontWeight: 'regular',
    variant: 'label',
  };
  return (
    <View style={styles.container}>
      <Badge title={t('assetDashboard:vacant')} badgeColor={theme.colors.highPriority} badgeStyle={styles.badge} />
      <PropertyAddressCountry
        primaryAddress={primaryAddress}
        countryFlag={countryIconUrl}
        primaryAddressTextStyles={addressTextStyle}
        subAddressTextStyles={subAddressTextStyle}
        subAddress={subAddress}
        containerStyle={styles.containerStyle}
      />
      {amenitiesData.length > 0 && (
        <PropertyAmenities
          data={amenitiesData}
          direction="row"
          containerStyle={styles.propertyInfoBox}
          contentContainerStyle={styles.cardIcon}
        />
      )}
      <View style={styles.warningWrapper}>
        <Icon name={icons.filledWarning} size={17} style={styles.Icon} />
        <Label type="large" style={styles.warningText} textType="regular">
          Vacant since two weeks
        </Label>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
    marginRight: 16,
  },
  badge: {
    width: 88,
  },
  subAddress: {},
  addressContainer: {
    width: 300,
  },
  propertyNameWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },
  propertyInfoBox: {
    justifyContent: undefined,
    marginRight: 16,
  },
  cardIcon: {
    marginRight: 8,
  },
  addressCountry: {
    marginTop: 8,
    marginBottom: 16,
  },
  propertyName: {
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: theme.colors.gray2,
  },
  location: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: theme.colors.darkTint3,
  },
  Icon: { color: theme.colors.danger },
  amenitiesWrapper: {
    flex: 4,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 0,
    marginRight: 20,
  },
  warningWrapper: {
    marginTop: 24,
    flexDirection: 'row',
    backgroundColor: 'rgba(242, 60, 6, 0.1)',
    width: 205,
    height: 23,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  warningText: {
    marginLeft: 8,
    color: theme.colors.danger,
  },
  containerStyle: {
    marginTop: 12,
    marginBottom: 20,
  },
});

export default PropertyDetails;
