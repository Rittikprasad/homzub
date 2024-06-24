import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ServiceHelper } from '@homzhub/mobile/src/utils/ServiceHelper';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { AssetMetricsList, FullScreenAssetDetailsCarousel, IMetricsData } from '@homzhub/mobile/src/components';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import PropertyServiceCard from '@homzhub/mobile/src/screens/Asset/More/Services/PropertyServiceCard';
import { Attachment, MediaType } from '@homzhub/common/src/domain/models/Attachment';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { ServiceOption } from '@homzhub/common/src/constants/Services';

const ServicesDashboard = (): React.ReactElement => {
  // STATES
  const [imageView, setImageView] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [currentAsset, setCurrentAsset] = useState(0);
  const [openServiceCount, setOpenServiceCount] = useState(0);
  const [attachmentListView, setAttachmentListView] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [metricsData, setMetricsData] = useState<IMetricsData[]>([]);

  // HOOKS
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { params } = useRoute();
  const dispatch = useDispatch();
  const services = useSelector(UserSelector.getUserServices);
  const { userService } = useSelector(UserSelector.getUserLoaders);
  const userAsset = useSelector(UserSelector.getUserAssets);

  useFocusEffect(
    useCallback(() => {
      getManagementData();
      dispatch(UserActions.getUserServices());
    }, [])
  );

  useEffect(() => {
    AnalyticsService.track(EventType.VASPageVisits);
  }, []);

  const getManagementData = (): void => {
    ServiceRepository.getServiceManagementTab()
      .then((res) => {
        const { valueAddedService } = res;
        const data = [
          {
            name: t('property:openServices'),
            count: valueAddedService.open.count,
            colorCode: theme.colors.completed,
          },
          {
            name: t('property:totalServices'),
            count: valueAddedService.count,
            colorCode: theme.colors.orange,
          },
        ];
        setMetricsData(data);
        setOpenServiceCount(valueAddedService.open.count);
      })
      .catch((e) => AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) }));
  };

  const onSelectMenu = (value: string): void => {
    ServiceHelper.handleServiceActions(value, currentAsset, attachments);
  };

  const handleAttachmentPress = (attachment: Attachment[], assetId: number): void => {
    setAttachments(attachment);
    setCurrentAsset(assetId);
    const isImage = attachment[0].mediaType === MediaType.image;
    if (isImage) {
      setImageView(!imageView);
      return;
    }
    if (!isImage && attachment.length > 1) {
      setAttachmentListView(true);
      return;
    }
    openAttachment(attachment[0]).then();
  };

  const openAttachment = async (attachment: Attachment): Promise<void> => {
    await LinkingService.canOpenURL(attachment.link);
  };

  const toggleFullScreen = (): void => {
    setImageView(!imageView);
    setSlideIndex(0);
  };

  const onBuyService = (): void => {
    navigate(ScreensKeys.ServiceSelection);
  };

  return (
    <>
      <UserScreen
        title={t('common:marketPlace')}
        backgroundColor={userAsset.length > 0 ? theme.colors.background : theme.colors.white}
        loading={userService}
        isGradient
      >
        <View>
          <AssetMetricsList
            // @ts-ignore
            showBackIcon={params?.isFromNavigation ?? false}
            data={metricsData}
            numOfElements={2}
            title={userAsset.length.toString()}
          />
          <Button
            type="secondary"
            iconSize={20}
            title={t('property:buyNewService')}
            icon={icons.portfolioFilled}
            iconColor={theme.colors.primaryColor}
            textStyle={styles.buttonText}
            containerStyle={styles.newServiceButton}
            onPress={onBuyService}
          />
          {openServiceCount > 0 && services.length > 0 ? (
            <>
              {services.map((item, index) => {
                const attachmentPress = (attachment: Attachment[]): void => {
                  handleAttachmentPress(attachment, item.id);
                };
                return <PropertyServiceCard data={item} key={index} onAttachmentPress={attachmentPress} />;
              })}
            </>
          ) : (
            <EmptyState title={t('property:noServiceAdded')} containerStyle={styles.emptyContainer} />
          )}
        </View>
      </UserScreen>
      {imageView && (
        <FullScreenAssetDetailsCarousel
          data={attachments}
          onFullScreenToggle={toggleFullScreen}
          updateSlide={setSlideIndex}
          activeSlide={slideIndex}
          onSelectMenu={onSelectMenu}
          optionTitle={t('property:propertyOption')}
          menuOptions={[
            { label: t('property:addImageToProperty'), value: ServiceOption.ADD_IMAGE },
            { label: t('property:downloadToDevice'), value: ServiceOption.DOWNLOAD_TO_DEVICE },
          ]}
        />
      )}
      <BottomSheet
        visible={attachmentListView}
        headerTitle={t('property:attachmentList')}
        onCloseSheet={(): void => setAttachmentListView(false)}
      >
        <View style={styles.attachmentContainer}>
          {attachments.map((item, index) => {
            return (
              <TouchableOpacity style={styles.content} key={index} onPress={(): Promise<void> => openAttachment(item)}>
                <Icon name={icons.roundFilled} color={theme.colors.primaryColor} size={12} />
                <Text type="small" style={styles.attachment}>
                  {item.fileName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheet>
    </>
  );
};

export default ServicesDashboard;

const styles = StyleSheet.create({
  emptyContainer: {
    paddingVertical: '50%',
    paddingHorizontal: 20,
  },
  newServiceButton: {
    marginVertical: 16,
    borderColor: theme.colors.white,
    flexDirection: 'row-reverse',
  },
  buttonText: {
    marginHorizontal: 10,
  },
  attachmentContainer: {
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachment: {
    color: theme.colors.primaryColor,
    marginHorizontal: 6,
    marginBottom: 4,
  },
});
