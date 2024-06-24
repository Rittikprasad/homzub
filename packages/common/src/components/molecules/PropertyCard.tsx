import React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';

interface IProps {
  asset: Asset;
  isExpanded?: boolean;
  isIcon?: boolean;
  showAddress?: boolean;
  isPriceVisible?: boolean;
  isShieldVisible?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  renderShieldGroup?: (compProps: IShieldProps) => React.ReactElement;
}

export interface IShieldProps {
  propertyType: string;
  text: string;
  isInfoRequired: boolean;
  isShieldVisible: boolean;
}

const PropertyCard = (props: IProps): React.ReactElement => {
  const {
    asset: {
      images,
      assetType: { name: assetType },
      projectName,
      country: { flag },
      verifications: { description },
      currencyData,
      pricePerUnit,
      maintenancePaymentSchedule,
      carpetArea,
      carpetAreaUnit,
      furnishing,
      spaces,
      assetGroup: { code },
      formattedAddressWithCity,
    },
    isExpanded,
    containerStyle,
    isPriceVisible = true,
    isShieldVisible = true,
    isIcon = true,
    showAddress = true,
    renderShieldGroup,
  } = props;

  const isAttachmentPresent = images && images.length > 0;

  const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
    spaces,
    furnishing,
    code,
    carpetArea,
    carpetAreaUnit?.title ?? '',
    true
  );
  const showAmenities = isExpanded && amenitiesData && amenitiesData.length > 0;
  const compProps = {
    propertyType: assetType,
    text: description,
    isInfoRequired: true,
    isShieldVisible,
  };
  const isShiledGroup = isExpanded && renderShieldGroup;
  return (
    <View style={containerStyle}>
      <View>
        {isExpanded && (
          <View style={styles.imageContainer}>
            {isAttachmentPresent ? (
              <Image
                source={{
                  uri: images[0].link,
                }}
                style={styles.carouselImage}
              />
            ) : (
              <ImagePlaceholder containerStyle={styles.placeholder} />
            )}
          </View>
        )}
      </View>
      <View style={[PlatformUtils.isWeb() && styles.leftChild]}>
        {!PlatformUtils.isWeb() && isShiledGroup && renderShieldGroup(compProps)}
        <PropertyAddressCountry
          primaryAddress={projectName}
          countryFlag={flag}
          subAddress={formattedAddressWithCity}
          isIcon={isIcon}
          showAddress={showAddress}
        />
        {isExpanded && isPriceVisible && (
          <PricePerUnit
            price={pricePerUnit}
            currency={currencyData}
            unit={maintenancePaymentSchedule}
            textStyle={styles.emptyView}
          />
        )}
        {showAmenities && (
          <>
            <PropertyAmenities
              data={amenitiesData}
              direction="row"
              containerStyle={styles.amenitiesContainer}
              contentContainerStyle={styles.amenities}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default PropertyCard;

const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: 8,
  },
  placeholder: {
    backgroundColor: theme.colors.darkTint5,
  },
  carouselImage: {
    height: 200,
    width: '100%',
  },
  amenitiesContainer: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  amenities: {
    marginEnd: 16,
  },
  emptyView: {
    marginTop: 10,
  },
  leftChild: {
    marginLeft: 16,
  },
});
