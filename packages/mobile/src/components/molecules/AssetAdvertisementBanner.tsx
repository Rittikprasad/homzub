import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { AssetAdvertisement, AssetAdvertisementResults } from '@homzhub/common/src/domain/models/AssetAdvertisement';

interface IAssetAdvertisementBannerState {
  banners: AssetAdvertisement;
  activeSlide: number;
}

const ITEM_WIDTH = theme.viewport.width - theme.layout.screenPadding * 2;
export class AssetAdvertisementBanner extends React.PureComponent<{}, IAssetAdvertisementBannerState> {
  public state = {
    banners: {} as AssetAdvertisement,
    activeSlide: 0,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.fetchAdvertisementBanners();
  };

  public render(): React.ReactNode {
    const { banners, activeSlide } = this.state;

    if (banners?.results?.length <= 0 || !banners) {
      return null;
    }

    return (
      <View style={styles.container}>
        <SnapCarousel
          carouselData={banners?.results ?? []}
          carouselItem={this.renderCarouselItem}
          sliderWidth={ITEM_WIDTH}
          itemWidth={ITEM_WIDTH}
          activeIndex={activeSlide}
          containerStyle={styles.radius}
          onSnapToItem={this.onSnapToItem}
          testID="bannerSnap"
        />
        <PaginationComponent
          dotsLength={banners?.results?.length ?? 0}
          activeSlide={activeSlide}
          containerStyle={styles.overlay}
          activeDotStyle={styles.activeDotStyle}
          inactiveDotStyle={styles.inactiveDotStyle}
        />
      </View>
    );
  }

  private renderCarouselItem = (item: AssetAdvertisementResults): React.ReactElement => {
    return <SVGUri uri={item.attachment.link} />;
  };

  public onSnapToItem = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  public fetchAdvertisementBanners = async (): Promise<void> => {
    const response: AssetAdvertisement = await DashboardRepository.getAdvertisements({ category: 'general' });
    this.setState({ banners: response });
  };
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    height: 200,
    backgroundColor: theme.colors.white,
  },
  radius: {
    borderRadius: 4,
  },
  overlay: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    paddingVertical: 10,
  },
  activeDotStyle: {
    borderWidth: 1,
  },
  inactiveDotStyle: {
    backgroundColor: theme.colors.darkTint6,
    borderColor: theme.colors.transparent,
  },
});
