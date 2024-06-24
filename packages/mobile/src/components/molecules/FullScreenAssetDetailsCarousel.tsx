import React from 'react';
import { View, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, FlatList, ViewStyle } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { Logger } from '@homzhub/common/src/utils/Logger';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { ImageVideoPagination } from '@homzhub/common/src/components/atoms/ImageVideoPagination';
import { YoutubeVideo } from '@homzhub/mobile/src/components/atoms/YoutubeVideo';
import Menu, { IMenu } from '@homzhub/common/src/components/molecules/Menu';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';

interface IProps {
  activeSlide: number;
  data: Attachment[];
  onFullScreenToggle: () => void;
  updateSlide?: (index: number) => void;
  onShare?: () => void;
  hasOnlyImages?: boolean;
  containerStyle?: ViewStyle;
  menuOptions?: IMenu[];
  onSelectMenu?: (value: string) => void;
  optionTitle?: string;
}

const heightValue = PlatformUtils.isIOS() ? (theme.viewport.width > 400 ? 3 : 2) : 2;

export class FullScreenAssetDetailsCarousel extends React.PureComponent<IProps> {
  public render(): React.ReactElement {
    return (
      <View style={styles.fullscreen}>
        {this.renderListHeader()}
        {this.renderImageAndVideo()}
      </View>
    );
  }

  public renderListHeader = (): React.ReactElement => {
    const {
      activeSlide,
      data,
      onFullScreenToggle,
      onShare,
      hasOnlyImages = false,
      containerStyle = {},
      menuOptions,
      onSelectMenu,
      optionTitle,
    } = this.props;
    return (
      <View style={[styles.fullscreenContainer, containerStyle]}>
        <Icon name={icons.close} size={20} color={theme.colors.white} onPress={onFullScreenToggle} />
        <ImageVideoPagination
          currentSlide={activeSlide}
          totalSlides={data.length}
          // @ts-ignore
          type={data[activeSlide].mediaType}
          hasOnlyImages={hasOnlyImages}
        />
        {onShare && <Icon name={icons.share} size={23} color={theme.colors.white} onPress={onShare} />}
        {menuOptions && onSelectMenu && <Menu data={menuOptions} optionTitle={optionTitle} onSelect={onSelectMenu} />}
      </View>
    );
  };

  public renderImageAndVideo = (): React.ReactElement => {
    const { activeSlide, data, updateSlide } = this.props;
    const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
      if (updateSlide) {
        const pageNumber =
          Math.min(
            Math.max(Math.floor(e.nativeEvent.contentOffset.x / theme.viewport.width + 0.5) + 1, 0),
            data.length
          ) - 1;
        updateSlide(pageNumber);
      }
    };

    return (
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={this.renderItem}
        onMomentumScrollEnd={onScrollEnd}
        keyExtractor={this.renderKeyExtractor}
        removeClippedSubviews
        initialScrollIndex={activeSlide}
        testID="attachmentFlatList"
        onScrollToIndexFailed={(info): void => Logger.warn(info.index)}
      />
    );
  };

  public renderItem = ({ item }: { item: Attachment }): React.ReactElement => {
    const { onFullScreenToggle } = this.props;
    const {
      link,
      mediaType,
      mediaAttributes: { videoId },
    } = item;
    if (mediaType === 'IMAGE') {
      return (
        <ImageZoom
          cropWidth={theme.viewport.width}
          cropHeight={theme.viewport.height}
          imageWidth={theme.viewport.width}
          imageHeight={500}
          enableSwipeDown
          pinchToZoom
          panToMove
          onSwipeDown={onFullScreenToggle}
          useHardwareTextureAndroid={false}
          key={link}
        >
          <Image source={{ uri: link }} style={styles.carouselImage} resizeMode="contain" />
        </ImageZoom>
      );
    }
    // For now it is recommended to re-mount a new <YouTube /> instance each time. That's why used Math.random()
    return <YoutubeVideo videoId={videoId} play key={Math.random()} />;
  };

  private renderKeyExtractor = (item: any, index: number): string => {
    return `${item}-${index}`;
  };
}

const styles = StyleSheet.create({
  fullscreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: theme.colors.darkTint1,
  },
  fullscreenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.viewport.width > 400 ? 30 : 10,
    margin: theme.layout.screenPadding,
  },
  carouselImage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: theme.viewport.height / heightValue,
    width: theme.viewport.width,
  },
});
