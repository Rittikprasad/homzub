import React from 'react';
import { StyleSheet, View, ViewStyle, ImageStyle, TouchableOpacity } from 'react-native';
import { useHistory } from 'react-router';
import { AnalyticsHelper } from '@homzhub/common/src/utils/AnalyticsHelper';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { AmenitiesShieldIconGroup } from '@homzhub/common/src/components/molecules/AmenitiesShieldIconGroup';
import { PropertyAddress } from '@homzhub/common/src/components/molecules/PropertyAddress';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import CardImageCarousel from '@homzhub/web/src/screens/searchProperty/components/CardImageCarousel';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';

interface IProps {
  investmentData: Asset;
  containerStyleProp?: ViewStyle;
  cardImageCarouselStyle?: ViewStyle;
  cardImageStyle?: ImageStyle;
  priceUnit: string;
  isFooterRequired?: boolean;
  addressContainerStyleProp?: ViewStyle;
  subContainerStyleProp?: ViewStyle;
  propertyAddressContainerStyle?: ViewStyle;
}

const PropertySearchCard = (props: IProps): React.ReactElement => {
  const {
    investmentData,
    containerStyleProp,
    cardImageCarouselStyle = {},
    cardImageStyle = {},
    priceUnit,
    addressContainerStyleProp,
    subContainerStyleProp,
    propertyAddressContainerStyle,
  } = props;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const {
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
    attachments,
  } = investmentData;

  const history = useHistory();
  let currencyData = investmentData.country.currencies[0];

  if (leaseTerm && leaseTerm.currency) {
    currencyData = leaseTerm.currency;
  }

  if (saleTerm && saleTerm.currency) {
    currencyData = saleTerm.currency;
  }

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
  const primaryAddress = projectName;
  const subAddress = address ?? `${unitNumber ?? ''} ${blockNumber ?? ''}`;
  const propertyType = assetType?.name;
  const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
    spaces,
    furnishing,
    AssetGroupTypes.RES,
    carpetArea,
    carpetAreaUnit?.title ?? '',
    true
  );

  const badgeInfo = [
    { color: theme.colors.completed },
    { color: theme.colors.completed },
    { color: theme.colors.completed },
  ];
  const navigateToSearchView = (): void => {
    const {
      location: { pathname },
    } = history;
    if (pathname === '/home/propertyDetail') {
      if (investmentData) {
        const data = AnalyticsHelper.getPropertyTrackData(investmentData);
        AnalyticsService.track(EventType.ClickSimilarProperty, data);
      }
    }
    const assetTransactionType = leaseTerm ? 0 : 1;
    NavigationService.navigate(history, {
      path: RouteNames.publicRoutes.PROPERTY_DETAIL.replace(':propertyName', `${projectName}`),
      params: { listingId: leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0, assetTransactionType },
    });
  };
  return (
    <View style={[styles.card, isMobile && styles.cardMobile, containerStyleProp]}>
      <View style={styles.imageContainer}>
        <CardImageCarousel
          cardImageCarouselStyle={cardImageCarouselStyle}
          cardImageStyle={cardImageStyle}
          imagesArray={attachments}
          leaseId={leaseTerm?.id}
          saleId={saleTerm?.id}
          assetData={investmentData}
        />
      </View>
      <TouchableOpacity onPress={navigateToSearchView}>
        <View style={styles.mainBody}>
          <View style={[styles.subContainer, subContainerStyleProp]}>
            <View style={styles.propertyRating}>
              <Typography variant="label" size="large" fontWeight="regular" style={styles.propertyType}>
                {propertyType}
              </Typography>
              <AmenitiesShieldIconGroup onBadgePress={FunctionUtils.noop} iconSize={21} badgesInfo={badgeInfo} />
            </View>
            <PropertyAddress
              isIcon={false}
              primaryAddress={primaryAddress}
              primaryAddressStyle={styles.addressTextStyle}
              subAddressStyle={styles.subAddressTextStyle}
              subAddress={subAddress}
              containerStyle={[styles.propertyAddress, propertyAddressContainerStyle]}
            />
            <View style={[styles.addressContainer, addressContainerStyleProp]}>
              <View style={styles.propertyValueContainer}>
                <PricePerUnit price={price} unit={priceUnit} currency={currencyData} />
              </View>
              {amenitiesData.length > 0 && (
                <PropertyAmenities
                  data={amenitiesData}
                  direction="column"
                  containerStyle={styles.propertyInfoBox}
                  contentContainerStyle={styles.cardIcon}
                />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    marginRight: 16,
    marginBottom: 25,
    width: '100%',
  },

  cardMobile: {
    marginRight: undefined,
  },
  image: {
    flex: 1,
    minWidth: 'calc(100% - 24px)',
    maxWidth: 298,
    minHeight: 160,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    margin: 12,
  },
  propertyAddress: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    minHeight: 60,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  mainBody: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 16,
    marginHorizontal: 20,
    marginBottom: 0,
    minHeight: '200px',
  },
  subContainer: {
    flex: 0.7,
  },

  propertyRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyValue: {
    color: theme.colors.darkTint2,
    paddingBottom: 15,
  },
  propertyType: {
    color: theme.colors.primaryColor,
  },
  propertyInfo: {
    marginRight: 16,
    color: theme.colors.darkTint3,
  },
  propertyInfoBox: {
    justifyContent: 'space-around',
    marginRight: 16,
  },
  cardIcon: {
    marginRight: 8,
  },
  propertyBadge: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '2px 6px',
    position: 'absolute',
    height: 25,
    marginLeft: 24,
    marginTop: 24,
  },
  addressTextStyle: {
    flex: 0.5,
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 0,
  },
  subAddressTextStyle: {
    fontSize: 14,
    fontWeight: '400',
    marginVertical: 0,
  },
  imageContainer: {
    margin: 12,
  },
  addressContainer: {
    flexDirection: 'row',
  },
  propertyValueContainer: { width: '40%' },
  footerStyle: {
    paddingLeft: 0,
  },
});

export default PropertySearchCard;
