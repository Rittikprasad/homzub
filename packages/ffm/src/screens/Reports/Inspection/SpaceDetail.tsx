import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, ImageBackground, TextInput, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';
import { CollapsibleSection } from '@homzhub/mobile/src/components/molecules/CollapsibleSection';
import UploadSheet from '@homzhub/ffm/src/screens/Reports/Inspection/UploadSheet';
import { ReportSpace } from '@homzhub/common/src/domain/models/ReportSpace';
import { ISpaceUnitUpdatePayload, IUpdateSpaceParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { ISpaceAttachment } from '@homzhub/common/src/modules/ffm/interface';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const faces = [
  { title: 'Good', icon: icons.happyFace, color: theme.colors.green, value: 5 },
  { title: 'Ok', icon: icons.neutralFace, color: theme.colors.redTint8, value: 3 },
  { title: 'Damaged', icon: icons.sadFace, color: theme.colors.redTint9, value: 1 },
];

interface IProps {
  spaceDetail: ReportSpace;
  onBack: () => void;
  onSuccess: () => void;
}

const NUM_OF_ITEM = 2;
const SLIDER_WIDTH = theme.viewport.width - theme.layout.screenPadding * 2;

const SpaceDetail = ({ onBack, onSuccess, spaceDetail }: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.reports);
  const spaceData = useSelector(FFMSelector.getReportSpaceData);
  const report = useSelector(FFMSelector.getCurrentReport);
  const [canUpload, setUploadSheetVisibility] = useState(false);
  const [canCreateSpace, setSpaceCreation] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [unitIndex, setUnitIndex] = useState(0);
  const [isUnit, setUnitValue] = useState(false);
  const [unitNames, setUnits] = useState(['']);

  useEffect(() => {
    if (report) {
      dispatch(FFMActions.getSpaceDetail({ reportId: report.id, spaceId: spaceDetail.id }));
    }
  }, []);

  const splitData = (attachments: ISpaceAttachment[]): ISpaceAttachment[][] => {
    const newArr = [];

    const data = [...attachments];
    data.push({ id: 0, attachmentUrl: '' });

    for (let i = 0; i < data.length; i += NUM_OF_ITEM) {
      newArr.push(data.slice(i, i + NUM_OF_ITEM));
    }

    return newArr;
  };

  const onPressFace = (value: number, unitFace?: boolean, index?: number): void => {
    if (unitFace && index !== undefined) {
      const updatedSpaceUnits = spaceData.space_inspection_units ?? [];
      updatedSpaceUnits[index].condition_of_space = value;
      dispatch(FFMActions.setReportSpaceData({ ...spaceData, space_inspection_units: updatedSpaceUnits }));
      return;
    }
    const updatedSpaces = { ...spaceData };
    updatedSpaces.condition_of_space = value;
    dispatch(FFMActions.setReportSpaceData(updatedSpaces));
  };

  const onChangeText = (text: string, index: number): void => {
    const unitData = [...unitNames];
    unitData[index] = text;
    setUnits(unitData);
  };

  const onPressPlus = (): void => {
    const newUnits = [...unitNames];
    newUnits.push('');
    setUnits(newUnits);
  };

  const onCloseSheet = (): void => {
    setSpaceCreation(false);
    setUnits(['']);
  };

  const onSave = (): void => {
    const previousUnits = spaceData.space_inspection_units ?? [];
    unitNames.forEach((item) => {
      previousUnits.push({
        name: item,
        attachments: [],
        comments: '',
        condition_of_space: 0,
      });
    });

    dispatch(FFMActions.setReportSpaceData({ ...spaceData, space_inspection_units: previousUnits }));
    setSpaceCreation(false);
  };

  const onSubmitDetail = (): void => {
    if (spaceData.space_inspection_units) {
      const filteredData = spaceData.space_inspection_units.filter(
        (item) => !!item.condition_of_space && !!item.comments && !!item.attachments && item.attachments.length > 0
      );

      if (filteredData.length !== spaceData.space_inspection_units.length) {
        AlertHelper.error({ message: t('fillUnitDetail') });
        return;
      }

      handleSubmit();
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = (): void => {
    const { condition_of_space, comments, attachments, space_inspection_units } = spaceData;
    if (!!comments && !!condition_of_space && !!attachments && attachments.length > 0 && report) {
      let units: ISpaceUnitUpdatePayload[] = [];
      if (space_inspection_units) {
        units = space_inspection_units.map((item) => {
          return {
            ...item,
            attachments: item.attachments ? item.attachments.map((image) => image.id) : [],
          };
        });
      }
      const payload: IUpdateSpaceParam = {
        reportId: report.id,
        spaceId: spaceDetail.id,
        body: {
          ...spaceData,
          attachments: attachments.map((item) => item.id),
          space_inspection_units: units,
        },
      };

      FFMRepository.updateSpaceDetail(payload)
        .then(() => {
          onSuccess();
        })
        .catch((e) => {
          AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
        });
    } else {
      AlertHelper.error({ message: t('fillSpaceDetail') });
    }
  };

  const handleSheetVisibility = (index: number, isUnitDetail?: boolean): void => {
    setUnitIndex(index);
    setUploadSheetVisibility(true);
    setUnitValue(isUnitDetail ?? false);
  };

  const getAddButtonVisibility = (): boolean => {
    const existingUnit = spaceData.space_inspection_units?.length ?? 0;
    return existingUnit + unitNames.length < 5;
  };

  const getFaceSelectedValue = (value: number, isFromUnit?: boolean, index?: number): boolean => {
    if (spaceData) {
      if (isFromUnit && spaceData.space_inspection_units && index !== undefined) {
        return spaceData.space_inspection_units[index].condition_of_space === value;
      }
      if (!isFromUnit) {
        return spaceData.condition_of_space === value;
      }

      return false;
    }
    return false;
  };

  const renderFaces = (isFromUnit?: boolean, unitIndexValue?: number): React.ReactElement => {
    return (
      <View style={styles.faceContainer}>
        {faces.map((item, index) => {
          const isSelected = getFaceSelectedValue(item.value, isFromUnit, unitIndexValue);
          return (
            <TouchableOpacity
              key={index}
              style={styles.center}
              onPress={(): void => onPressFace(item.value, isFromUnit, unitIndexValue)}
            >
              <Icon name={item.icon} color={isSelected ? item.color : theme.colors.disabled} size={35} />
              <Label>{item.title}</Label>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderUploadBox = (isUnitDetail?: boolean, index?: number, isCard?: boolean): React.ReactElement => {
    return (
      <UploadBox
        icon={icons.gallery}
        header={t('common:addPhoto')}
        subHeader={t('serviceTickets:uploadIssuePhotoHelperText')}
        onPress={(): void => handleSheetVisibility(index ?? 0, isUnitDetail)}
        iconStyle={isCard && styles.flexZero}
        containerStyle={isCard ? styles.uploadCardStyle : styles.uploadBox}
      />
    );
  };

  const renderDetailView = (
    attachments: ISpaceAttachment[],
    comment?: string,
    isUnitDetail?: boolean,
    index?: number
  ): React.ReactElement => {
    return (
      <View>
        <TouchableOpacity style={styles.edit} onPress={(): void => handleSheetVisibility(index ?? 0, isUnitDetail)}>
          <Icon name={icons.noteBook} size={22} color={theme.colors.primaryColor} />
        </TouchableOpacity>
        <SnapCarousel
          carouselData={splitData(attachments)}
          carouselItem={(item): React.ReactElement => renderAttachments(item, isUnitDetail, index)}
          activeIndex={0}
          onSnapToItem={setActiveSlide}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={SLIDER_WIDTH}
        />
        <PaginationComponent
          dotsLength={splitData(attachments).length}
          activeSlide={activeSlide}
          containerStyle={styles.paginationContainer}
          activeDotStyle={[styles.dot, styles.activeDot]}
          inactiveDotStyle={[styles.dot, styles.inactiveDot]}
        />
        {!!comment && (
          <>
            <Label type="large" textType="semiBold">
              {t('common:comments')}
            </Label>
            <Label>{comment}</Label>
          </>
        )}
      </View>
    );
  };

  const renderAttachments = (item: ISpaceAttachment[], isUnitDetail?: boolean, index?: number): React.ReactElement => {
    return (
      <View style={styles.row}>
        {item.map((image, imageIndex) => {
          return (
            <>
              {image.attachmentUrl ? (
                <ImageBackground key={imageIndex} source={{ uri: image.attachmentUrl }} style={styles.image} />
              ) : (
                renderUploadBox(isUnitDetail, index, true)
              )}
            </>
          );
        })}
      </View>
    );
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon name={icons.leftArrow} size={20} color={theme.colors.primaryColor} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <SVGUri uri={spaceDetail.iconUrl} height={20} width={20} />
          <Text type="small" textType="semiBold" style={styles.title}>
            {spaceDetail.name}
          </Text>
        </View>
      </View>
      <Label type="large" style={styles.heading}>
        {t('pleaseSelect')}
      </Label>
      {renderFaces()}
      {!spaceData.attachments?.length && renderUploadBox()}
      {!!spaceData.attachments?.length && renderDetailView(spaceData.attachments, spaceData.comments, false)}
      {spaceData.space_inspection_units?.map((item, index) => {
        return (
          <CollapsibleSection
            key={index}
            title={item.name ?? 'Unit'}
            expandIcon={icons.downArrow}
            collapseIcon={icons.upArrow}
          >
            <>
              {renderFaces(true, index)}
              {!item.attachments?.length && renderUploadBox(true, index)}
              {!!item.attachments?.length && renderDetailView(item.attachments ?? [], item.comments ?? '', true, index)}
            </>
          </CollapsibleSection>
        );
      })}
      {(spaceData?.space_inspection_units?.length ?? 0) < 5 && (
        <TouchableOpacity style={styles.plusStyle} onPress={(): void => setSpaceCreation(true)}>
          <Icon name={icons.circularPlus} size={40} color={theme.colors.primaryColor} />
        </TouchableOpacity>
      )}
      <Button type="primary" title="Next" onPress={onSubmitDetail} containerStyle={styles.uploadBox} />
      {canUpload && (
        <UploadSheet
          isVisible={canUpload}
          isUnit={isUnit}
          unitIndex={unitIndex}
          onClose={(): void => setUploadSheetVisibility(false)}
        />
      )}
      <BottomSheet sheetHeight={500} visible={canCreateSpace} onCloseSheet={onCloseSheet} headerTitle={t('addNewUnit')}>
        <View style={styles.sheetContent}>
          <Label type="large" style={styles.label}>
            {t('enterAreaName')}
          </Label>
          {unitNames.map((item, index) => {
            return (
              <TextInput
                key={index}
                value={item}
                style={styles.input}
                onChangeText={(text): void => onChangeText(text, index)}
                placeholder={t('area', { count: index + 1 })}
              />
            );
          })}
          {getAddButtonVisibility() && (
            <TouchableOpacity onPress={onPressPlus} style={styles.plus}>
              <Icon name={icons.plus} size={20} color={theme.colors.active} />
            </TouchableOpacity>
          )}
          <Button
            type="primary"
            title={t('common:save')}
            onPress={onSave}
            containerStyle={[styles.buttonContainer, styles.saveButton]}
          />
        </View>
      </BottomSheet>
    </>
  );
};

export default SpaceDetail;

const styles = StyleSheet.create({
  input: {
    flex: 0,
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    color: theme.colors.darkTint2,
    height: 36,
    marginVertical: 12,
    borderRadius: 4,
    padding: 10,
  },
  buttonContainer: {
    flex: 0,
    marginVertical: 16,
  },
  saveButton: {
    height: 42,
  },
  plus: {
    backgroundColor: theme.colors.blueOpacity,
    alignSelf: 'flex-end',
    padding: 8,
    borderRadius: 2,
  },
  sheetContent: {
    marginVertical: 16,
    marginHorizontal: 30,
    flex: 1,
  },
  label: {
    color: theme.colors.darkTint3,
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
  faceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
  },
  center: {
    alignItems: 'center',
  },
  uploadCardStyle: {
    width: 160,
    height: 100,
    margin: 6,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  uploadBox: {
    marginVertical: 16,
  },
  flexZero: {
    flex: 0,
  },
  edit: {
    alignSelf: 'flex-end',
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    height: 100,
    width: 160,
    margin: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 5,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    marginHorizontal: 10,
  },
  heading: {
    marginVertical: 16,
    textAlign: 'center',
    color: theme.colors.darkTint2,
  },
  plusStyle: {
    alignSelf: 'flex-end',
    marginVertical: 10,
  },
});
