import React, { FC } from 'react';
import { View, StyleSheet, ImageStyle, ViewStyle, TouchableOpacity } from 'react-native';
import { useHistory } from 'react-router';
import { AnalyticsHelper } from '@homzhub/common/src/utils/AnalyticsHelper';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { AmenitiesShieldIconGroup } from '@homzhub/common/src/components/molecules/AmenitiesShieldIconGroup';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import CardImageCarousel from '@homzhub/web/src/screens/searchProperty/components/CardImageCarousel';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';

interface IProps {
  containerStyle: ViewStyle[];
  cardImageCarouselStyle: ViewStyle;
  cardImageStyle: ImageStyle;
  priceAndAmenitiesStyle: ViewStyle;
  investmentData: Asset;
  priceUnit: string;
  propertyAmenitiesStyle: ViewStyle;
  addressStyle: ViewStyle[];
  propertyTypeAndBadgesStyle: ViewStyle;
  detailsStyle: ViewStyle[];
  iconStyle: ViewStyle;
  detailContainerStyle: ViewStyle;
  isListView: boolean;
}
const PropertyCard: FC<IProps> = (props: IProps) => {
  const {
    cardImageCarouselStyle = {},
    cardImageStyle = {},
    investmentData,
    priceUnit,
    containerStyle,
    priceAndAmenitiesStyle,
    propertyAmenitiesStyle,
    addressStyle,
    propertyTypeAndBadgesStyle,
    detailsStyle,
    iconStyle,
    detailContainerStyle,
    isListView,
  } = props;
  const history = useHistory();
  const {
    attachments,
    address,
    assetType,
    furnishing,
    spaces,
    projectName,
    carpetArea,
    carpetAreaUnit,
    unitNumber,
    blockNumber,
    leaseTerm,
    saleTerm,
  } = investmentData;
  const primaryAddress = projectName;
  const subAddress = address ?? `${unitNumber ?? ''} ${blockNumber ?? ''}`;
  const propertyType = assetType?.name;
  const badgeInfo = [
    { color: theme.colors.completed },
    { color: theme.colors.completed },
    { color: theme.colors.completed },
  ];
  const navigateToSearchView = (): void => {
    const trackData = AnalyticsHelper.getPropertyTrackData(investmentData);
    AnalyticsService.track(EventType.SearchPropertyOpen, trackData);
    const listingId = leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0;
    const assetTransactionType = leaseTerm ? 0 : 1;
    NavigationService.navigate(history, {
      path: RouteNames.publicRoutes.PROPERTY_DETAIL.replace(':propertyName', `${projectName}`),
      params: { listingId, assetTransactionType },
    });
  };

  const getPrice = (): number => {
    if (leaseTerm) {
      return Number(leaseTerm.expectedPrice);
    }
    if (saleTerm) {
      return Number(saleTerm.expectedPrice);
    }
    return 0;
  };
  const price = getPrice();
  const currencyData = investmentData.country.currencies[0];

  const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
    spaces,
    furnishing,
    AssetGroupTypes.RES,
    carpetArea,
    carpetAreaUnit?.title ?? '',
    true
  );
  return (
    <View style={containerStyle}>
      <CardImageCarousel
        cardImageCarouselStyle={cardImageCarouselStyle}
        cardImageStyle={cardImageStyle}
        imagesArray={attachments}
        leaseId={leaseTerm?.id}
        saleId={saleTerm?.id}
        isListView={isListView}
        assetData={investmentData}
      />
      <View style={detailContainerStyle}>
        <TouchableOpacity onPress={navigateToSearchView}>
          <View style={detailsStyle}>
            <View style={propertyTypeAndBadgesStyle}>
              <Typography variant="label" size="large" fontWeight="regular" style={styles.propertyType}>
                {`${propertyType}`}
              </Typography>
              <AmenitiesShieldIconGroup onBadgePress={FunctionUtils.noop} iconSize={21} badgesInfo={badgeInfo} />
            </View>
            <View style={addressStyle}>
              <Typography variant="text" size="small" fontWeight="semiBold" numberOfLines={1}>
                {primaryAddress}
              </Typography>
              <Typography variant="label" size="large" numberOfLines={3}>
                {subAddress}
              </Typography>
            </View>
            <View style={priceAndAmenitiesStyle}>
              <PricePerUnit price={price} unit={priceUnit} currency={currencyData} />
              {amenitiesData.length > 0 && (
                <PropertyAmenities
                  data={amenitiesData}
                  direction="column"
                  containerStyle={propertyAmenitiesStyle}
                  contentContainerStyle={iconStyle}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PropertyCard;

const styles = StyleSheet.create({
  propertyType: {
    color: theme.colors.primaryColor,
  },
});
