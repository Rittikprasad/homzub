import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { wp } from '@homzhub/common/src/styles/viewport';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { SpaceInspectionAttachment } from '@homzhub/common/src/domain/models/SpaceInspectionAttachment';

interface IProps {
  data: SpaceInspectionAttachment[];
  comment: string;
  onFullScreenToggle: () => void;
  containerStyle?: ViewStyle;
}

const entryBorderRadius = 8;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const slideHeight = theme.viewport.height * 0.36;
const itemWidth = slideWidth + itemHorizontalMargin * 5;

export const AttachmentCarousel = (props: IProps): React.ReactElement => {
  const { data, comment, onFullScreenToggle } = props;
  const [activeSlide, setActivesSlide] = useState(0);

  const renderItem = (item: SpaceInspectionAttachment): React.ReactElement => {
    const { attachmentUrl } = item;

    return (
      <View style={styles.slideInnerContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: attachmentUrl }} style={styles.carouselImage} resizeMode="cover" />
          <View style={styles.radiusMask} />
        </View>
        <View style={styles.textContainer}>
          <Text type="small" textType="semiBold" style={styles.title}>
            Comments
          </Text>
          <Label type="large" style={styles.subtitle} numberOfLines={2}>
            {comment}
          </Label>
        </View>
      </View>
    );
  };

  const renderImageAndVideo = (): React.ReactElement => {
    return (
      <SnapCarousel
        carouselData={data}
        carouselItem={renderItem}
        activeIndex={activeSlide}
        containerStyle={styles.carouselContainer}
        contentStyle={styles.content}
        onSnapToItem={setActivesSlide}
      />
    );
  };
  return (
    <View style={styles.fullscreen}>
      <TouchableOpacity style={styles.iconContainer} onPress={onFullScreenToggle}>
        <Icon name={icons.close} size={35} color={theme.colors.darkTint4} />
      </TouchableOpacity>
      {renderImageAndVideo()}
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 1,
  },
  carouselContainer: {
    overflow: 'visible',
    marginTop: 20,
  },
  content: {
    paddingVertical: 10,
  },
  carouselImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: PlatformUtils.isIOS() ? 8 : 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    marginTop: '50%',
  },
  imageContainer: {
    flex: 1,
    marginBottom: PlatformUtils.isIOS() ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: theme.colors.white,
  },
  textContainer: {
    justifyContent: 'center',
    padding: 12,
    backgroundColor: theme.colors.white,
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
  },
  title: {
    color: theme.colors.darkTint2,
  },
  subtitle: {
    marginTop: 10,
    color: theme.colors.darkTint2,
  },
  iconContainer: {
    alignSelf: 'flex-end',
    margin: 16,
  },
});
