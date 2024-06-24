import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ImageService } from '@homzhub/ffm/src/services/ImageService';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import {
  ILocalSpaceUnitPayload,
  ILocalSpaceUpdatePayload,
  ISpaceAttachment,
} from '@homzhub/common/src/modules/ffm/interface';

enum UploadType {
  CAMERA = 'CAMERA',
  GALLERY = 'GALLERY',
}

interface IProps {
  isUnit: boolean;
  isVisible: boolean;
  unitIndex: number;
  onClose: () => void;
}

const options = [
  { name: icons.camera, code: UploadType.CAMERA },
  { name: icons.attachment, code: UploadType.GALLERY },
];

const NUM_OF_ITEM = 2;
const SLIDER_WIDTH = theme.viewport.width - theme.layout.screenPadding * 2;
const UploadSheet = (props: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isVisible, onClose, isUnit, unitIndex } = props;
  const spaceData = useSelector(FFMSelector.getReportSpaceData);
  const [attachments, setAttachments] = useState<ISpaceAttachment[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (spaceData) {
      if (isUnit && spaceData.space_inspection_units) {
        setAttachments(spaceData.space_inspection_units[unitIndex].attachments ?? []);
        setComment(spaceData.space_inspection_units[unitIndex].comments ?? '');
      } else if (spaceData.attachments) {
        setAttachments(spaceData.attachments);
      }

      if (!isUnit && spaceData.comments) {
        setComment(spaceData.comments);
      }
    }
  }, [spaceData]);

  const splitData = useCallback((): ISpaceAttachment[][] => {
    const newArr = [];

    for (let i = 0; i < attachments.length; i += NUM_OF_ITEM) {
      newArr.push(attachments.slice(i, i + NUM_OF_ITEM));
    }

    return newArr;
  }, [attachments, NUM_OF_ITEM]);

  const onUpload = async (code: UploadType): Promise<void> => {
    switch (code) {
      case UploadType.CAMERA: {
        await ImageService.handleCameraUpload({
          selectedImages: attachments,
          onUploadImage: setAttachments,
          setLoading,
          onClose,
        });
        break;
      }
      case UploadType.GALLERY: {
        await ImageService.handleGalleryUpload({
          selectedImages: attachments,
          onUploadImage: setAttachments,
          setLoading,
          onClose,
        });
        break;
      }
      default:
    }
  };

  const onRemove = (imageId: number): void => {
    const images = attachments.filter((item) => item.id !== imageId);
    setAttachments(images);
  };

  const onNext = (): void => {
    const unitData: ILocalSpaceUnitPayload[] | undefined = spaceData.space_inspection_units;
    if (isUnit && unitData) {
      unitData[unitIndex].attachments = attachments;
      unitData[unitIndex].comments = comment;
    }
    const payload: ILocalSpaceUpdatePayload = {
      ...spaceData,
      ...(!isUnit && { attachments }),
      ...(!isUnit && { comments: comment }),
      ...(isUnit && { space_inspection_units: unitData }),
    };

    dispatch(FFMActions.setReportSpaceData(payload));
    onClose();
  };

  const onCloseSheet = (): void => {
    setAttachments([]);
    onClose();
  };

  const renderIcon = (name: string, style?: ViewStyle): React.ReactElement => {
    return (
      <View style={[styles.iconStyle, style]}>
        <Icon name={name} size={30} color={theme.colors.white} />
      </View>
    );
  };

  const renderRightNode = (): React.ReactElement => {
    return (
      <View style={styles.row}>
        {options.map((item, index) => {
          return (
            <TouchableOpacity key={index} activeOpacity={0.5} onPress={(): Promise<void> => onUpload(item.code)}>
              {renderIcon(item.name, { marginLeft: 20 })}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderAttachments = (item: ISpaceAttachment[]): React.ReactElement => {
    return (
      <View style={styles.row}>
        {item.map((image, index) => {
          return (
            <View key={index} style={styles.imageContainer}>
              <ImageBackground source={{ uri: image.attachmentUrl }} style={styles.image}>
                <TouchableOpacity style={styles.iconContainer} onPress={(): void => onRemove(image.id)}>
                  <Icon name={icons.close} color={theme.colors.white} size={24} />
                </TouchableOpacity>
              </ImageBackground>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <BottomSheet
      visible={isVisible}
      sheetHeight={600}
      onCloseSheet={onCloseSheet}
      renderRightNode={attachments.length > 0 ? renderRightNode() : undefined}
    >
      <View style={styles.content}>
        <Loader visible={isLoading} />
        {attachments.length < 1 && (
          <View style={styles.optionContainer}>
            {options.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.5}
                  style={styles.option}
                  onPress={(): Promise<void> => onUpload(item.code)}
                >
                  {renderIcon(item.name)}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <SnapCarousel
          activeIndex={activeSlide}
          carouselData={splitData()}
          carouselItem={renderAttachments}
          onSnapToItem={setActiveSlide}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={SLIDER_WIDTH}
        />
        <PaginationComponent
          dotsLength={splitData().length}
          activeSlide={activeSlide}
          containerStyle={styles.paginationContainer}
          activeDotStyle={[styles.dot, styles.activeDot]}
          inactiveDotStyle={[styles.dot, styles.inactiveDot]}
        />
        <TextArea
          value={comment}
          placeholder={t('reports:addNote')}
          textAreaStyle={styles.textArea}
          onMessageChange={setComment}
          containerStyle={styles.textAreaContainer}
        />
        <Button
          type="primary"
          title={t('next')}
          disabled={attachments.length < 1 || !comment}
          containerStyle={styles.nextButton}
          onPress={onNext}
        />
      </View>
    </BottomSheet>
  );
};

export default UploadSheet;

const styles = StyleSheet.create({
  imageContainer: {
    margin: 6,
  },
  image: {
    height: 150,
    width: 180,
  },
  iconContainer: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    margin: 6,
  },
  dot: {
    width: 8.5,
    height: 8.5,
  },
  activeDot: {
    borderWidth: 1.5,
  },
  inactiveDot: {
    backgroundColor: theme.colors.disabled,
    borderWidth: 0,
  },
  paginationContainer: {
    paddingVertical: 0,
    marginTop: 12,
  },
  nextButton: {
    flex: 0,
    marginVertical: 16,
    height: 48,
  },
  textArea: {
    height: 100,
  },
  textAreaContainer: {
    marginVertical: 16,
  },
  option: {
    backgroundColor: theme.colors.darkTint10,
    height: 120,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  content: {
    margin: 16,
  },
  row: {
    flexDirection: 'row',
  },
  iconStyle: {
    backgroundColor: theme.colors.primaryColor,
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
