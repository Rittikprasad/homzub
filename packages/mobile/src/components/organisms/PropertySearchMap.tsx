import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { Point } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { CustomMarker } from '@homzhub/common/src/components/atoms/CustomMarker';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { PropertyMapCard } from '@homzhub/mobile/src/components/molecules/PropertyMapCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { IFilter } from '@homzhub/common/src/domain/models/Search';

const {
  viewport: { width },
  DeviceDimensions: { SMALL },
} = theme;
const SLIDER_WIDTH = width <= SMALL.width ? 300 : width * 0.8;
const MAP_DELTA = 0.1;

interface IState {
  currentSlide: number;
}

interface IProps {
  searchLocation: Point;
  properties: Asset[];
  transaction_type: number;
  onSelectedProperty: (item: Asset) => void;
  getPropertiesListView: () => void;
  setFilter: (payload: IFilter) => void;
  filters: IFilter;
}
type Props = IProps & WithTranslation;

export class PropertySearchMap extends React.PureComponent<Props, IState> {
  private mapRef: MapView | null = null;
  private carouselRef = null;

  public state = {
    currentSlide: 0,
  };

  public componentDidUpdate = (prevProps: Props): void => {
    const {
      properties,
      searchLocation,
      filters: { offset },
    } = this.props;
    if (properties.length <= 0) {
      this.animateCamera(searchLocation.lat, searchLocation.lng);
      return;
    }

    if (prevProps.properties.length !== properties.length && offset === 0) {
      this.animateCamera(properties[0].latitude, properties[0].longitude);
      // @ts-ignore
      this.carouselRef.snapToItem(0);
    }
  };

  public render(): React.ReactNode {
    const { currentSlide } = this.state;
    const { properties, searchLocation } = this.props;
    let { lat: initLatitude, lng: initLongitude } = searchLocation;

    if (properties.length > 0) {
      initLatitude = properties[0].latitude;
      initLongitude = properties[0].longitude;
    }

    return (
      <>
        <MapView
          ref={(mapRef): void => {
            this.mapRef = mapRef;
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={{
            latitude: initLatitude,
            longitude: initLongitude,
            latitudeDelta: MAP_DELTA,
            longitudeDelta: MAP_DELTA,
          }}
        >
          {properties.map((property: Asset, index: number) => {
            const { latitude, longitude } = property;
            const onMarkerPress = (): void => {
              this.onMarkerPress(index);
            };
            return (
              <Marker key={`${property.id}${index}`} coordinate={{ latitude, longitude }} onPress={onMarkerPress}>
                <CustomMarker selected={index === currentSlide} />
              </Marker>
            );
          })}
        </MapView>
        <SnapCarousel
          containerStyle={styles.carouselStyle}
          carouselData={properties}
          activeIndex={currentSlide}
          itemWidth={SLIDER_WIDTH}
          carouselItem={this.renderCarouselItem}
          onSnapToItem={this.onSnapToItem}
          onLoadMore={this.loadMoreProperties}
          bubbleRef={(ref): void => {
            this.carouselRef = ref;
          }}
          testID="assetSnap"
        />
      </>
    );
  }

  private renderCarouselItem = (item: Asset): React.ReactElement => {
    const { transaction_type, onSelectedProperty } = this.props;
    const {
      attachments,
      projectName,
      furnishing,
      spaces,
      carpetAreaUnit,
      carpetArea,
      assetGroup: { code },
      leaseTerm,
      saleTerm,
      isAssetOwner,
    } = item;
    const price = this.getPrice(item);
    const amenities = PropertyUtils.getAmenities(spaces, furnishing, code, carpetArea, carpetAreaUnit?.title ?? '');
    const image = attachments.filter((currentImage: Attachment) => currentImage.isCoverImage);
    let currencyData = item.country.currencies[0];

    if (leaseTerm && leaseTerm.currency) {
      currencyData = leaseTerm.currency;
    }

    if (saleTerm && saleTerm.currency) {
      currencyData = saleTerm.currency;
    }

    const navigateToAssetDetails = (): void => {
      if (leaseTerm) {
        onSelectedProperty(item);
      }
      if (saleTerm) {
        onSelectedProperty(item);
      }
    };

    return (
      <PropertyMapCard
        source={image[0]?.link ?? null}
        name={projectName}
        currency={currencyData}
        price={price}
        leaseListingId={leaseTerm?.id}
        saleListingId={saleTerm?.id}
        priceUnit={transaction_type === 0 ? 'mo' : ''}
        amenitiesData={amenities}
        onSelectedProperty={navigateToAssetDetails}
        isAssetOwner={isAssetOwner}
      />
    );
  };

  public onSnapToItem = (currentSlide: number): void => {
    const { properties } = this.props;
    const { latitude, longitude } = properties[currentSlide];

    this.animateCamera(latitude, longitude);
    this.setState({ currentSlide });
  };

  private onMarkerPress = (index: number): void => {
    // @ts-ignore
    this.carouselRef.snapToItem(index);
  };

  private animateCamera = (latitude: number, longitude: number): void => {
    this.mapRef?.animateCamera({
      center: {
        longitude,
        latitude,
      },
    });
  };

  public getPrice = (item: Asset): number => {
    const { leaseTerm, saleTerm } = item;
    if (leaseTerm) {
      return Number(leaseTerm.expectedPrice);
    }
    if (saleTerm) {
      return Number(saleTerm.expectedPrice);
    }
    return 0;
  };

  public loadMoreProperties = (): void => {
    const {
      setFilter,
      getPropertiesListView,
      filters: { offset },
      properties,
    } = this.props;

    setFilter({ offset: (offset ?? 0) + properties.length, is_sorting: false });
    getPropertiesListView();
  };
}

export default withTranslation()(PropertySearchMap);
const styles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
  carouselStyle: {
    paddingBottom: 10,
    position: 'absolute',
    bottom: 14,
  },
});
