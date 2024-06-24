import React from 'react';
import { ImageBackground, ImageStyle, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';

export interface IOwnProps {
  imageUrl: null | string;
  onIconPress?: () => void;
  dataLength?: number;
  iconSize?: number;
  iconColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ImageStyle>;
  imageWrapperStyle?: StyleProp<ImageStyle>;
  isIconVisible?: boolean;
  isCoverPhotoContainer?: boolean;
  coverPhotoTitle?: string;
  isLastThumbnail?: boolean;
  onPressLastThumbnail?: () => void;
  isFavorite?: boolean;
  markFavorite?: () => void;
  galleryView?: boolean;
  onPressImage?: () => void;
}

type IProps = WithTranslation & IOwnProps;

class ImageThumbnail extends React.PureComponent<IProps> {
  public render(): React.ReactElement {
    const {
      imageUrl,
      iconSize,
      iconColor,
      imageContainerStyle,
      imageWrapperStyle,
      containerStyle,
      isIconVisible = true,
      isCoverPhotoContainer = false,
      isLastThumbnail = false,
      onPressLastThumbnail,
      dataLength,
      isFavorite = false,
      coverPhotoTitle = 'Cover Photo',
      markFavorite,
      t,
      galleryView,
      onPressImage,
    } = this.props;

    const { handleIconPress } = this;
    const Content = React.memo(
      (): React.ReactElement => (
        <>
          {!!imageUrl && (
            <ImageBackground
              resizeMode={PlatformUtils.isWeb() && galleryView ? 'contain' : 'cover'}
              source={{ uri: imageUrl }}
              imageStyle={[styles.imageStyle, imageContainerStyle]}
              style={[styles.imageWrapper, imageWrapperStyle]}
            >
              {isIconVisible && (
                <TouchableOpacity
                  style={
                    PlatformUtils.isWeb() && isCoverPhotoContainer ? styles.iconContainerWeb : styles.iconContainer
                  }
                  onPress={handleIconPress}
                >
                  <Icon name={icons.close} size={iconSize || 22} color={iconColor || theme.colors.white} />
                  {PlatformUtils.isWeb() && isCoverPhotoContainer && (
                    <Typography variant="label" size="large" style={styles.removeTxt}>
                      {t('remove')}
                    </Typography>
                  )}
                </TouchableOpacity>
              )}
              {isCoverPhotoContainer && (
                <TouchableOpacity style={styles.touchableContainer} onPress={markFavorite}>
                  <View style={styles.coverPhotoContainer}>
                    <Text type="small" textType="regular" style={styles.coverPhoto}>
                      {coverPhotoTitle}
                    </Text>
                    <Icon
                      name={isFavorite ? icons.starFilled : icons.starUnfilled}
                      size={20}
                      color={theme.colors.white}
                      style={styles.starIcon}
                    />
                  </View>
                </TouchableOpacity>
              )}
              {isLastThumbnail && (
                <View style={styles.lastThumbnailContainer}>
                  <TouchableOpacity onPress={onPressLastThumbnail}>
                    <Text type="regular" textType="semiBold" style={styles.numberOfImages}>
                      + {dataLength}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ImageBackground>
          )}
        </>
      )
    );

    if (onPressImage) {
      return (
        <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPressImage}>
          <Content />
        </TouchableOpacity>
      );
    }
    return (
      <View style={[styles.container, containerStyle]}>
        <Content />
      </View>
    );
  }

  public handleIconPress = (): void => {
    const { onIconPress } = this.props;
    if (onIconPress) {
      onIconPress();
    }
  };
}

export default withTranslation()(ImageThumbnail);

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  imageStyle: {
    borderRadius: 4,
  },
  imageWrapper: {
    height: 200,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
    bottom: 0,
    backgroundColor: theme.colors.crossIconContainer,
  },
  iconContainerWeb: {
    width: 'fit-content',
    height: 30,
    flexDirection: 'row',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    paddingHorizontal: 8,
    top: 10,
    right: 10,
    bottom: 0,
    backgroundColor: theme.colors.crossIconContainerWeb,
  },
  removeTxt: {
    color: 'white',
  },
  touchableContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  coverPhotoContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.imageThumbnailBackground,
    opacity: 0.8,
    height: 35,
    alignItems: 'center',
    paddingLeft: 10,
    borderRadius: 4,
  },
  coverPhoto: { color: theme.colors.white, opacity: 1, flex: 7 },
  lastThumbnailContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.darkTint1,
    opacity: 0.75,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  numberOfImages: {
    color: theme.colors.white,
    opacity: 1,
    justifyContent: 'center',
    padding: 30,
  },
  starIcon: {
    flex: 1,
  },
});
