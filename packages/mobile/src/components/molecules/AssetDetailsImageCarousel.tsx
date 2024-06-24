import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { ImageVideoPagination } from '@homzhub/common/src/components/atoms/ImageVideoPagination';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';

interface IProps {
  data: Attachment[];
  enterFullScreen: () => void;
  updateSlide: (index: number) => void;
  activeSlide: number;
  containerStyles?: StyleProp<ViewStyle>;
  hasOnlyImages?: boolean;
}

export class AssetDetailsImageCarousel extends React.PureComponent<IProps> {
  public render(): React.ReactElement {
    const { activeSlide, data, containerStyles, hasOnlyImages } = this.props;
    const currentSlide: Attachment = data[activeSlide];
    return (
      <View style={[styles.carouselContainer, containerStyles]}>
        <SnapCarousel
          carouselData={data}
          carouselItem={this.renderCarouselItem}
          activeIndex={activeSlide}
          sliderWidth={theme.viewport.width}
          itemWidth={theme.viewport.width}
          onSnapToItem={this.onSnapToItem}
          testID="assetSnap"
        />
        <View style={styles.overlay}>
          <ImageVideoPagination
            currentSlide={activeSlide}
            totalSlides={data.length}
            type={currentSlide?.mediaType ?? 'IMAGE'}
            hasOnlyImages={hasOnlyImages}
          />
        </View>
      </View>
    );
  }

  private renderCarouselItem = (item: Attachment): React.ReactElement => {
    const { enterFullScreen } = this.props;
    const { mediaType } = item;
    return (
      <TouchableOpacity onPress={enterFullScreen}>
        {mediaType === 'IMAGE' && (
          <Image
            source={{
              uri: item.link,
            }}
            style={styles.carouselImage}
            resizeMode="contain"
          />
        )}
        {mediaType === 'VIDEO' && (
          <>
            <Image
              source={{ uri: item.mediaAttributes.thumbnailHD ?? item.mediaAttributes.thumbnail }}
              style={styles.carouselImage}
              resizeMode="contain"
            />
            <View style={styles.playButton}>
              <Icon name={icons.play} size={60} color={theme.colors.white} />
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  };

  public onSnapToItem = (slideNumber: number): void => {
    const { updateSlide } = this.props;
    updateSlide(slideNumber);
  };
}

const styles = StyleSheet.create({
  carouselContainer: {
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: theme.colors.darkTint1,
  },
  overlay: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 15,
    backgroundColor: theme.colors.carouselCardOpacity,
  },
  carouselImage: {
    height: '100%',
    width: '100%',
  },
  playButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.carouselCardOpacity,
  },
});
