import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { AssetDetailsImageCarousel } from '@homzhub/common/src/components/molecules/AssetDetailsImageCarousel';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { IGetServicesByIds } from '@homzhub/common/src/domain/models/ValueAddedService';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import ValueAddedServicesOverview from '@homzhub/web/src/components/molecules/ValueAddedServicesOverview';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
// TODO: (ShikhaRai): move from mobile to common interface
import { IBadgeInfo } from '@homzhub/mobile/src/navigation/interfaces';

interface IProps {
  navigateToService: (
    propertyId: number,
    assetType: string,
    projectName: string,
    address: string,
    flag: React.ReactElement,
    serviceByIds: IGetServicesByIds,
    badgeInfo: IBadgeInfo,
    amenities: IAmenitiesIcons[],
    attachments: Attachment[],
    assetCount?: number,
    iso2Code?: string
  ) => void;

  navigateToAddPropertyScreen: () => void;
  selectedCity?: string;
}

export const ValueAddedServiceCardList: FC<IProps> = (props: IProps) => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetMore);
  const { navigateToAddPropertyScreen, navigateToService, selectedCity, didLoad } = props;

  // Local States
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const styles = servicesStyle(isMobile, isTablet);

  useEffect(() => {
    try {
      setLoading(true);
      AssetRepository.getValueServicesAssetList().then((data: Asset[]) => {
        let filteredAsset = data;
        if (selectedCity) {
          filteredAsset = data.filter((item) => item.city === selectedCity);
        }
        setAssets(filteredAsset);
      });
      setLoading(false);
      didLoad();
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
      setLoading(false);
      didLoad();
    }
  }, []);

  const renderImages = (attachments: Attachment[]): React.ReactElement => {
    return (
      <>
        {attachments && attachments.length > 0 ? (
          <AssetDetailsImageCarousel
            enterFullScreen={onFullScreenToggle}
            data={attachments}
            activeSlide={activeSlide}
            updateSlide={updateSlide}
            containerStyles={styles.carouselStyle}
            fullScreen={false}
            favouriteIcon={false}
          />
        ) : (
          <ImagePlaceholder containerStyle={styles.imagePlaceHolder} />
        )}
      </>
    );
  };

  const [loading, setLoading] = useState(false);

  const updateSlide = (currentSlideNumber: number): void => {
    setActiveSlide(currentSlideNumber);
  };

  const onFullScreenToggle = (): void => {
    setIsFullScreen(!isFullScreen);
  };
  return (
    <>
      <Loader visible={loading} />
      {assets && assets.length > 0 ? (
        <>
          {!isMobile && <ValueAddedServicesOverview propertiesCount={assets.length} />}
          <Text
            style={[styles.textStyle, PlatformUtils.isWeb() && !isMobile && styles.textStyleWeb]}
            type="small"
            textType="semiBold"
          >
            {t('chooseAPropertyText')}
          </Text>
          <View style={!isMobile && styles.propertyViewContainer}>
            {assets.map((asset: Asset, index: number) => {
              const {
                id,
                attachments,
                assetStatusInfo,
                spaces,
                furnishing,
                carpetArea,
                carpetAreaUnit,
                assetGroupId,
                city,
                assetGroup: { code },
                assetType: { name: propertyType },
                country: { flag, id: countryId, iso2Code },
                formattedAddressWithCity,
                projectName,
              } = asset;
              const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
                spaces,
                furnishing,
                code,
                carpetArea,
                carpetAreaUnit?.title ?? ''
              );
              const badgeTitle = assetStatusInfo?.tag.label ?? '';
              const badgeColor = assetStatusInfo?.tag.color ?? '';
              const navigate = (): void => {
                navigateToService(
                  id,
                  propertyType,
                  projectName,
                  formattedAddressWithCity,
                  flag,
                  { assetGroupId, countryId, city },
                  { title: badgeTitle, color: badgeColor },
                  amenitiesData,
                  attachments,
                  assets.length,
                  iso2Code
                );
              };

              return (
                <View key={id} style={styles.cardView}>
                  <TouchableOpacity onPress={navigate} style={styles.cardContent}>
                    <Badge badgeStyle={styles.badgeStyle} title={badgeTitle} badgeColor={badgeColor} />
                    {renderImages(attachments)}
                    <View style={styles.cardDescription}>
                      <Text type="small" textType="regular" style={styles.propertyTypeText}>
                        {propertyType}
                      </Text>
                      <PropertyAddressCountry
                        primaryAddress={projectName}
                        countryFlag={flag}
                        subAddress={formattedAddressWithCity}
                      />
                      <PropertyAmenities
                        containerStyle={styles.amenities}
                        contentContainerStyle={styles.amenitiesContentStyle}
                        data={amenitiesData}
                        direction="row"
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </>
      ) : (
        <EmptyState
          title={t('valueServicesEmptyText')}
          buttonProps={{
            type: 'secondary',
            title: t('property:addProperty'),
            onPress: navigateToAddPropertyScreen,
          }}
          containerStyle={styles.emptyContainer}
        />
      )}
    </>
  );
};

interface IServicesStyle {
  propertyViewContainer: ViewStyle;
  cardView: ViewStyle;
  cardContent: ViewStyle;
  cardContentMargin: ViewStyle;
  cardDescription: ViewStyle;
  propertyTypeText: ViewStyle;
  textStyle: ViewStyle;
  carouselStyle: ViewStyle;
  imagePlaceHolder: ViewStyle;
  badgeStyle: ViewStyle;
  amenities: ViewStyle;
  amenitiesContentStyle: ViewStyle;
  emptyContainer: ViewStyle;
  textStyleWeb: ViewStyle;
}

const servicesStyle = (isMobile?: boolean, isTablet?: boolean): StyleSheet.NamedStyles<IServicesStyle> =>
  StyleSheet.create<IServicesStyle>({
    propertyViewContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      marginRight: !isMobile ? (isTablet ? -24 : -36) : 0,
    },
    cardView: {
      backgroundColor: isMobile ? theme.colors.white : theme.colors.transparent,
      paddingBottom: isMobile ? 12 : 0,
      paddingHorizontal: isMobile ? 10 : 0,
      width: isMobile ? '100%' : isTablet ? '50%' : '33%',
    },
    cardContent: {
      borderWidth: 1,
      borderColor: theme.colors.background,
      paddingHorizontal: 10,
      paddingBottom: 16,
      paddingTop: 10,
      backgroundColor: theme.colors.white,
      marginBottom: isMobile ? 0 : 24,
      marginRight: isMobile ? 0 : 24,
    },
    cardContentMargin: {
      marginRight: 24,
    },
    cardDescription: {
      paddingHorizontal: 6,
    },
    propertyTypeText: {
      color: theme.colors.primaryColor,
      marginTop: 12,
      marginBottom: 4,
    },
    textStyle: {
      backgroundColor: isMobile ? theme.colors.white : theme.colors.transparent,
      padding: 16,
      paddingTop: 8,
    },
    textStyleWeb: {
      paddingTop: 20,
      paddingLeft: 0,
      paddingBottom: 16,
    },
    carouselStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
      paddingHorizontal: 10,
    },
    imagePlaceHolder: {
      minHeight: 200,
      backgroundColor: theme.colors.disabled,
      paddingHorizontal: 10,
    },
    badgeStyle: {
      minWidth: 75,
      paddingHorizontal: 10,
      paddingVertical: 1,
      marginBottom: 10,
      alignSelf: 'flex-start',
    },
    amenities: {
      marginTop: 16,
      justifyContent: 'flex-start',
    },
    amenitiesContentStyle: {
      marginRight: 16,
    },
    emptyContainer: {
      paddingVertical: '50%',
    },
  });
