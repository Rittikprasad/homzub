import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, TouchableOpacity, Image } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Favorite } from '@homzhub/common/src/components/atoms/Favorite';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { PropertyAddress } from '@homzhub/common/src/components/molecules/PropertyAddress';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { ShieldGroup } from '@homzhub/mobile/src/components/molecules/ShieldGroup';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';

interface IProps {
  property: Asset;
  transaction_type: number;
  containerStyle?: StyleProp<ViewStyle>;
  isCarousel: boolean;
  textSizeType?: TextSizeType;
  onSelectedProperty: () => void;
  testID?: string;
  isAssetOwner: boolean;
}

type libraryProps = WithTranslation;
type Props = libraryProps & IProps;

interface IState {
  ref: any;
  activeSlide: number;
}

const ITEM_WIDTH = theme.viewport.width - 56;
export class PropertyListCard extends React.PureComponent<Props, IState> {
  public state = {
    activeSlide: 0,
    ref: null,
  };

  public render(): React.ReactElement {
    const {
      property: { projectName, unitNumber, blockNumber, address },
      containerStyle,
      onSelectedProperty,
    } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        {this.renderCarousel()}
        {this.renderPropertyTypeAndBadges()}
        <TouchableOpacity onPress={onSelectedProperty}>
          <PropertyAddress
            isIcon
            primaryAddress={projectName}
            subAddress={address || `${blockNumber ?? ''} ${unitNumber ?? ''}`}
          />
          <Divider containerStyles={styles.divider} />
          {this.renderPriceAndAmenities()}
        </TouchableOpacity>
      </View>
    );
  }

  private renderPropertyTypeAndBadges = (): React.ReactElement => {
    const {
      property: {
        assetType: { name },
      },
    } = this.props;
    return <ShieldGroup propertyType={name} />;
  };

  private renderCarousel = (): React.ReactNode => {
    const { activeSlide } = this.state;
    const {
      isCarousel,
      property: { leaseTerm, saleTerm, sortedImages },
      isAssetOwner,
    } = this.props;

    return (
      <View style={styles.carouselContainer}>
        {!isCarousel ? (
          this.renderCarouselItem(sortedImages[0])
        ) : sortedImages.length > 0 ? (
          <SnapCarousel
            bubbleRef={this.updateRef}
            carouselData={sortedImages}
            carouselItem={this.renderCarouselItem}
            activeIndex={activeSlide}
            itemWidth={ITEM_WIDTH}
            sliderWidth={ITEM_WIDTH}
            onSnapToItem={this.onSnapToItem}
            testID="snapCarousel"
          />
        ) : (
          <ImagePlaceholder height="100%" />
        )}
        <View style={styles.overlay}>
          <View style={styles.favoriteContainer}>
            {!isAssetOwner && <Favorite leaseId={leaseTerm?.id} saleId={saleTerm?.id} iconColor={theme.colors.white} />}
          </View>
          {isCarousel && (
            <View style={styles.arrowContainer}>
              <Icon
                name={icons.leftArrow}
                size={25}
                color={activeSlide === 0 ? theme.colors.disabledPreference : theme.colors.white}
                onPress={this.previousSlide}
              />
              <Icon
                name={icons.rightArrow}
                size={25}
                color={activeSlide === sortedImages.length - 1 ? theme.colors.disabledPreference : theme.colors.white}
                onPress={this.nextSlide}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  private renderPriceAndAmenities = (): React.ReactElement => {
    const { transaction_type, property, textSizeType = 'regular' } = this.props;
    const {
      carpetArea,
      carpetAreaUnit,
      spaces,
      furnishing,
      country: { currencies },
      assetGroup: { code },
      saleTerm,
      leaseTerm,
    } = property;
    const price: number = this.getPrice();
    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      spaces,
      furnishing,
      code,
      carpetArea,
      carpetAreaUnit?.title ?? ''
    );
    let currencyData = currencies[0];

    if (leaseTerm && leaseTerm.currency) {
      currencyData = leaseTerm.currency;
    }

    if (saleTerm && saleTerm.currency) {
      currencyData = saleTerm.currency;
    }

    return (
      <View style={styles.amenities}>
        <PricePerUnit
          price={price}
          currency={currencyData}
          unit={transaction_type === 0 ? 'mo' : ''}
          textSizeType={textSizeType}
        />
        <PropertyAmenities data={amenitiesData} direction="row" contentContainerStyle={styles.amenitiesContainer} />
      </View>
    );
  };

  private renderCarouselItem = (item: Attachment): React.ReactElement => {
    if (!item) {
      return <ImagePlaceholder height="100%" />;
    }

    return (
      <Image
        source={{
          uri: item.link,
        }}
        style={styles.carouselImage}
        resizeMode="contain"
      />
    );
  };

  private onSnapToItem = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private updateRef = (ref: any): void => {
    this.setState({ ref });
  };

  private previousSlide = (): void => {
    const { ref } = this.state;
    // @ts-ignore
    ref.snapToPrev();
  };

  private nextSlide = (): void => {
    const { ref } = this.state;
    // @ts-ignore
    ref.snapToNext();
  };

  private getPrice = (): number => {
    const {
      property: { leaseTerm, saleTerm },
    } = this.props;
    if (leaseTerm) {
      return Number(leaseTerm.expectedPrice);
    }
    if (saleTerm) {
      return Number(saleTerm.expectedPrice);
    }
    return 0;
  };
}

export default withTranslation()(PropertyListCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 12,
    borderRadius: 4,
    marginVertical: 10,
  },
  divider: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.disabled,
    marginVertical: 6,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amenitiesContainer: {
    marginTop: 8,
  },
  carouselContainer: {
    borderRadius: 4,
    height: 210,
    overflow: 'hidden',
  },
  arrowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8,
    marginVertical: 40,
  },
  overlay: {
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.carouselCardOpacity,
  },
  carouselImage: {
    height: '100%',
    width: '100%',
  },
  favoriteContainer: {
    flexDirection: 'row-reverse',
    margin: 15,
  },
});
