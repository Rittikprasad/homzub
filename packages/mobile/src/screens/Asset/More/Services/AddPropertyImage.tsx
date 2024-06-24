import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { ImageHelper } from '@homzhub/mobile/src/utils/ImageHelper';
import { ImageService } from '@homzhub/common/src/services/Property/ImageService';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { WithShadowView } from '@homzhub/common/src/components/atoms/WithShadowView';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import PropertyCard from '@homzhub/common/src/components/molecules/PropertyCard';
import { PropertyImages } from '@homzhub/common/src/components/organisms/PropertyImages';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { IPropertyImageParam } from '@homzhub/mobile/src/navigation/interfaces';

const AddPropertyImage = (): React.ReactElement => {
  const { params } = useRoute();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const { assetById } = useSelector(AssetSelectors.getAssetLoaders);
  const selectedImages = useSelector(RecordAssetSelectors.getSelectedImages);
  const asset: Asset | null = useSelector(AssetSelectors.getAssetById);
  const [videoData, setVideoData] = useState({ isVideoToggled: false, videoUrl: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonEnable, setButtonEnable] = useState(false);

  const param = params as IPropertyImageParam;

  useEffect(() => {
    dispatch(AssetActions.getAssetById(param.assetId));
  }, []);

  const onChangeVideo = (isVideoToggled?: boolean, videoUrl?: string): void => {
    setVideoData({
      ...videoData,
      ...(isVideoToggled !== undefined && { isVideoToggled }),
      ...(videoUrl && { videoUrl }),
    });
  };

  const onUploadImage = (): void => {
    ImageHelper.handlePhotosUpload({ assetId: param.assetId, selectedImages, toggleLoader, onCallback }).then();
  };

  const toggleLoader = (value?: boolean): void => {
    if (value !== undefined) {
      setIsLoading(value);
    }
  };

  const onCallback = (value: boolean): void => {
    setButtonEnable(value);
  };

  const updateImage = (payload: AssetGallery[]): void => {
    dispatch(RecordAssetActions.setSelectedImages(payload));
  };

  const onSave = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await ImageService.postAttachment({
        propertyId: param.assetId,
        selectedImages,
        isVideoToggled: videoData.isVideoToggled,
        videoUrl: videoData.videoUrl,
      });
      AlertHelper.success({ message: t('property:imageUploaded') });
      setIsLoading(false);
      goBack();
    } catch (e) {
      setIsLoading(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.detaills) });
    }
  };

  return (
    <>
      <Screen
        isLoading={isLoading || assetById}
        headerProps={{ title: t('property:addPropertyImages'), onIconPress: goBack }}
      >
        {asset ? (
          <>
            <PropertyCard asset={asset} isIcon={false} containerStyle={styles.propertyContainer} />
            <Text type="small" textType="semiBold">
              {t('property:gallery')}
            </Text>
            <PropertyImages
              propertyId={asset.id}
              selectedImages={selectedImages}
              isButtonVisible={false}
              onPressContinue={FunctionUtils.noop}
              onUploadImage={onUploadImage}
              setSelectedImages={updateImage}
              containerStyle={styles.imageContainer}
              onUpdateVideo={onChangeVideo}
              isAssetImage
              onUpdateCallback={onCallback}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </Screen>
      <WithShadowView isBottomShadow={false}>
        <Button
          disabled={!isButtonEnable}
          type="primary"
          title={t('common:save')}
          containerStyle={styles.buttonContainer}
          onPress={onSave}
        />
      </WithShadowView>
    </>
  );
};

export default AddPropertyImage;

const styles = StyleSheet.create({
  propertyContainer: {
    backgroundColor: theme.colors.white,
    padding: 16,
    marginVertical: 16,
  },
  imageContainer: {
    marginHorizontal: 0,
    marginTop: 12,
  },
  buttonContainer: {
    flex: 0,
    marginHorizontal: 16,
    marginVertical: 12,
  },
});
