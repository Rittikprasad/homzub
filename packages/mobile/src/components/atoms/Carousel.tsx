import React from 'react';
import Carousel from 'react-native-snap-carousel';
import { StyleProp, ViewStyle } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';

interface ICarouselProps<T> {
  carouselData: T[];
  carouselItem: (item: T) => React.ReactElement;
  activeIndex: number;
  onSnapToItem: (index: number) => void;
  sliderWidth?: number;
  initialNumToRender?: number;
  itemWidth?: number;
  bubbleRef?: (ref: any) => void;
  contentStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
  extraData?: number[];
  onLoadMore?: () => void;
  hasParallaxImages?: boolean;
}

const ACTIVE_SLIDE_OFFSET = 20;

export class SnapCarousel<T> extends React.PureComponent<ICarouselProps<T>> {
  private carouselRef: Carousel<T> | null = null;

  public render = (): React.ReactElement => {
    const {
      carouselData,
      activeIndex,
      containerStyle,
      contentStyle,
      testID,
      onSnapToItem,
      initialNumToRender = 10,
      sliderWidth = theme.viewport.width,
      itemWidth = theme.viewport.width - 30,
      extraData,
      onLoadMore,
      hasParallaxImages = false,
    } = this.props;

    return (
      // @ts-ignore
      <Carousel
        testID={testID}
        data={carouselData}
        firstItem={activeIndex}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        renderItem={this.renderItem}
        hasParallaxImages={hasParallaxImages}
        initialNumToRender={initialNumToRender}
        activeSlideOffset={ACTIVE_SLIDE_OFFSET}
        contentContainerCustomStyle={contentStyle}
        containerCustomStyle={containerStyle}
        onLayout={this.updateRef}
        onEndReached={({ distanceFromEnd }: { distanceFromEnd: number }): void => {
          if (distanceFromEnd > 0 && onLoadMore) {
            onLoadMore();
          }
        }}
        onSnapToItem={onSnapToItem}
        extraData={extraData}
        removeClippedSubviews={PlatformUtils.isAndroid()}
        ref={(c): void => {
          this.carouselRef = c;
        }}
      />
    );
  };

  public renderItem = ({ item }: { item: T }): React.ReactElement => {
    const { carouselItem } = this.props;
    return carouselItem(item);
  };

  public updateRef = (): void => {
    const { bubbleRef } = this.props;
    if (bubbleRef) {
      bubbleRef(this.carouselRef);
    }
  };
}
