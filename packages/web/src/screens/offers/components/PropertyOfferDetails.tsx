import React, { FC } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { useDown, useIsIpadPro } from '@homzhub/common/src/utils/MediaQueryUtils';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { ShieldGroup } from '@homzhub/web/src/components/molecules/ShieldGroupHeader';
import YoutubeCard from '@homzhub/web/src/screens/portfolio/components/YoutubeCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { IAmenitiesIcons, IFilter } from '@homzhub/common/src/domain/models/Search';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IProps {
  property: Asset;
  isExpanded: boolean;
  containerStyles?: any;
}
interface IStateProps {
  filters: IFilter;
}
type IPropertyOfferDetails = IProps & IStateProps;
const PropertyOfferDetais: FC<IPropertyOfferDetails> = (props: IPropertyOfferDetails) => {
  const isTab = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isIPadPro = useIsIpadPro();
  const { property, filters, isExpanded, containerStyles } = props;
  const {
    projectName,
    unitNumber,
    blockNumber,
    address,
    country: { flag },
    carpetArea,
    carpetAreaUnit,
    furnishing,
    spaces,
    leaseTerm,
    saleTerm,
    country: { currencies },
    assetGroup: { code },
  } = property;

  const containerStyle = { marginVertical: 0 };

  const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
    spaces,
    furnishing,
    code,
    carpetArea,
    carpetAreaUnit?.title ?? '',
    true
  );

  let currencyData = currencies[0];

  if (leaseTerm && leaseTerm.currency) {
    currencyData = leaseTerm.currency;
  }

  if (saleTerm && saleTerm.currency) {
    currencyData = saleTerm.currency;
  }
  const salePrice = saleTerm && Number(saleTerm.expectedPrice) > 0 ? Number(saleTerm.expectedPrice) : 0;
  const price = leaseTerm && leaseTerm.expectedPrice > 0 ? leaseTerm.expectedPrice : salePrice;

  const renderAttachmentView = (attachments: Attachment[]): React.ReactNode => {
    const item = attachments[0];

    if (!item) {
      return (
        <ImagePlaceholder
          containerStyle={[
            styles.imgPlaceHolder,
            isTab && styles.imgPlaceHolderTab,
            isIPadPro && !isTab && styles.imagContainerIPadPro,
            isMobile && styles.mobImageContainer,
          ]}
        />
      );
    }

    const { link, mediaType } = item;

    return (
      <TouchableOpacity>
        {mediaType === 'IMAGE' && (
          <View
            style={[
              styles.imageContainer,
              isTab && styles.tabImageContainer,
              isMobile && styles.mobImageContainer,
              isIPadPro && !isTab && styles.imagContainerIPadPro,
            ]}
          >
            <Image
              source={{
                uri: link,
              }}
              style={styles.detailViewImage}
            />
          </View>
        )}
        {mediaType === 'VIDEO' && <YoutubeCard videoLink={link} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.containerAlign, isMobile && styles.containerMobile, containerStyles]}>
      {isExpanded && renderAttachmentView(property.attachments)}
      <View
        style={[
          styles.details,
          isTab && styles.detailsTab,
          isMobile && styles.detailMobile,
          isIPadPro && !isTab && styles.detailsIPadPro,
        ]}
      >
        {isExpanded && (
          <ShieldGroup
            propertyType={property.assetType.name}
            isInfoRequired
            containerStyle={containerStyle}
            textType="label"
            textSize="large"
          />
        )}
        <PropertyAddressCountry
          isIcon
          primaryAddress={projectName}
          countryFlag={flag}
          subAddress={address ?? `${unitNumber} ${blockNumber}`}
          containerStyle={styles.addressStyle}
          primaryAddressTextStyles={{ size: 'small' }}
          subAddressTextStyles={{ variant: 'label', size: 'large' }}
        />
        {isExpanded && (
          <PricePerUnit
            price={price}
            currency={currencyData}
            unit={filters.asset_transaction_type === 0 ? 'mo' : ''}
            textStyle={styles.pricing}
            textSizeType="regular"
          />
        )}
        {isExpanded && (
          <PropertyAmenities
            data={amenitiesData}
            direction="row"
            containerStyle={styles.amenitiesContainer}
            contentContainerStyle={styles.amenities}
          />
        )}
      </View>
    </View>
  );
};

const mapStateToProps = (state: IState): IStateProps => {
  return {
    filters: SearchSelector.getFilters(state),
  };
};

export default connect(mapStateToProps)(PropertyOfferDetais);

const styles = StyleSheet.create({
  imageContainer: {
    width: 220,
    height: 153,
  },
  imagContainerIPadPro: {
    width: 200,
  },
  detailViewImage: {
    borderRadius: 4,
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  addressStyle: {
    width: '100%',
    top: 6,
  },
  pricing: {
    marginTop: 6,
  },
  amenitiesContainer: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginVertical: 12,
  },
  amenities: {
    marginEnd: 16,
  },
  tabImageContainer: {
    width: 300,
  },
  mobImageContainer: {
    width: '100%',
  },
  details: { marginHorizontal: 12, width: 296 },
  detailsTab: {
    width: '52.5%',
  },
  detailsIPadPro: {
    width: 220,
  },
  detailMobile: {
    marginHorizontal: 0,
    marginVertical: 8,
    width: '100%',
  },
  imgPlaceHolder: {
    height: 153,
    width: 220,
  },
  imgPlaceHolderTab: {
    width: 300,
  },
  containerAlign: { flexDirection: 'row' },
  containerMobile: { flexDirection: 'column' },
});
