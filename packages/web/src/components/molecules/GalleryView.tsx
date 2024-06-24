import React, { FC, useState, createRef } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Carousel from 'react-multi-carousel';
import { useDown, useIsIpadPro } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  attachments: Attachment[];
}

const GalleryView: FC<IProps> = (props: IProps) => {
  const { attachments } = props;
  const { link } = attachments[0];
  const [displayImage, setDisplayImage] = useState(link);
  const { length } = attachments;
  const imageCollection = new Array(length).fill(false);
  const [selected, setSelected] = useState(imageCollection);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [data, setData] = useState(attachments);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isIPadPro = useIsIpadPro();
  const moreImages = !isTablet ? (isIPadPro ? attachments.length - 2 : attachments.length - 3) : attachments.length - 1;
  const popOverContentStyle = {
    width: isTablet ? '100%' : '1000px',
    height: '520px',
    alignItems: 'center',
  };
  const popOverOverlayStyle = {
    background: theme.colors.darkOpacity,
  };

  const carouselRef = createRef<Carousel>();

  const selectedImage = (image: Attachment, index: number): void => {
    setDisplayImage(image.link);
    setSelectedIndex(index);
    const images = imageCollection;
    images[index] = true;
    setSelected(images);
  };

  const onClosePopover = (): void => {
    setIsPopoverVisible(false);
  };

  const renderPopOverContent = (): React.ReactElement => {
    const defaultResponsive = {
      allScreenSizes: {
        breakpoint: { max: 10000, min: 0 },
        items: 1,
        slidesToSlide: 1,
      },
    };
    const carouselProps = {
      arrows: true,
      draggable: true,
      focusOnSelect: true,
      infinite: true,
      responsive: defaultResponsive,
      showDots: false,
      children: undefined,
    };
    if (data.length === 1) {
      return (
        <View>
          <Image
            style={styles.imageCarousel}
            source={{
              uri: data[0].link,
            }}
            resizeMode="contain"
          />
        </View>
      );
    }
    return (
      <MultiCarousel forwardRef={carouselRef} passedProps={carouselProps}>
        {renderPropertyImages()}
      </MultiCarousel>
    );
  };

  const viewfullScreen = (): void => {
    if (selectedIndex && selectedIndex > 0) {
      const subArray1 = attachments.slice(0, selectedIndex && selectedIndex);
      const subArray2 = attachments.slice(selectedIndex, attachments.length);
      const newAttachments = subArray2.concat(subArray1);
      setData(newAttachments);
    } else setData(attachments);
    setIsPopoverVisible(true);
  };
  const renderPropertyImages = (): React.ReactNode => {
    return data.map((currentImage: Attachment, index: number) => {
      return (
        <View key={index}>
          <Image
            style={styles.imageCarousel}
            source={{
              uri: currentImage.link,
            }}
            resizeMode="contain"
          />
        </View>
      );
    });
  };

  return (
    <View>
      <TouchableOpacity onPress={viewfullScreen}>
        <View style={styles.displayImage}>
          <Image
            style={styles.image}
            source={{
              uri: displayImage,
            }}
          />
        </View>
      </TouchableOpacity>

      {attachments.length > 1 && (
        <View style={styles.bottomView}>
          {attachments.map((item: Attachment, index: number) => {
            if (!isTablet ? (isIPadPro ? index < 3 : index < 4) : index < 2) {
              return (
                <TouchableOpacity onPress={(): void => selectedImage(item, index)}>
                  <View
                    style={[
                      (!isTablet ? (isIPadPro ? index < 2 : index < 3) : index < 1) && styles.imageSpacing,
                      styles.imageContainer,
                      isTablet && styles.imageContainerTab,
                      isIPadPro && styles.imageIPadPro,
                    ]}
                  >
                    <Image
                      style={[styles.image, selected[index] && styles.selectedImage]}
                      source={{
                        uri: item.link,
                      }}
                    />
                  </View>

                  {(!isTablet ? (isIPadPro ? index === 2 : index === 3) : index === 1) && (
                    <View style={styles.thumbnailContainer}>
                      <TouchableOpacity onPress={viewfullScreen}>
                        <Text type="regular" textType="semiBold" style={styles.numberOfImages}>
                          + {moreImages}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }
            return null;
          })}
        </View>
      )}
      <Popover
        content={renderPopOverContent}
        popupProps={{
          open: isPopoverVisible,
          onClose: onClosePopover,
          modal: true,
          arrow: false,
          contentStyle: popOverContentStyle,
          overlayStyle: popOverOverlayStyle,
          closeOnDocumentClick: true,
          children: undefined,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    borderRadius: 4,
    width: '100%',
    height: '100%',
  },

  imageCarousel: {
    flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    width: '100%',
    height: 520,
  },
  displayImage: {
    width: '100%',
    height: 350,
  },

  selectedImage: {
    opacity: 0.36,
  },
  imageContainer: {
    height: 80,
    width: 150,
    flexDirection: 'row',
  },
  imageContainerTab: {
    width: 157,
  },
  imageIPadPro: {
    width: 160,
  },

  thumbnailContainer: {
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
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 12,
  },
  imageSpacing: {
    marginRight: 12,
  },
});

export default GalleryView;
