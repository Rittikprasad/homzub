import React, { FC, useState } from 'react';
import { ImageStyle, StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ImageSquare } from '@homzhub/common/src/components/atoms/Image';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { NextPrevBtn } from '@homzhub/web/src/components';
import LatestUpdates from '@homzhub/web/src/screens/dashboard/components/VacantProperties/LatestUpdates';
import PropertyDetails from '@homzhub/web/src/screens/dashboard/components/VacantProperties/PropertyDetails';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { AssetListingVisits } from '@homzhub/common/src/domain/models/AssetListingVisits';
import { AssetOfferSummary } from '@homzhub/common/src/domain/models/AssetOfferSummary';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  data: Asset[];
}

const VacantProperties: FC<IProps> = ({ data }: IProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const styles = vacantPropertyStyle(isMobile, isTablet);
  const total = data?.length ?? 0;
  if (total <= 0) {
    return null;
  }

  const coverImage =
    data[currentAssetIndex]?.attachments?.filter((currentImage: Attachment) => currentImage.isCoverImage)[0]?.link ??
    null;
  const updateCurrentAssetIndex = (updateIndexBy: number): void => {
    const nextIndex = currentAssetIndex + updateIndexBy;
    if (nextIndex > data.length - 1 || nextIndex < 0) {
      setCurrentAssetIndex(0);
    } else {
      setCurrentAssetIndex(nextIndex);
    }
  };

  const navigateToDetailView = (): void => {
    const { id, leaseTerm, saleTerm } = data[currentAssetIndex];
    NavigationService.navigate(history, {
      path: RouteNames.protectedRoutes.PROPERTY_SELECTED,
      params: {
        isFromTenancies: false,
        asset_id: id,
        assetType: 'detail',
        listing_id: leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Icon name={icons.vacantProperty} size={30} color={theme.colors.darkTint3} style={styles.headerIcon} />
          <Text type="small" textType="regular">
            {t('assetDashboard:vacantProperties', { total })}
          </Text>
        </View>
        <View style={styles.nextPrevBtn}>
          <NextPrevBtn onBtnClick={updateCurrentAssetIndex} />
        </View>
      </View>
      {!isMobile && <Divider />}
      <TouchableOpacity style={styles.mainContent} onPress={navigateToDetailView}>
        <View style={styles.propertyInfo}>
          {coverImage ? (
            <ImageSquare
              style={styles.image}
              source={{
                uri: coverImage,
              }}
            />
          ) : (
            <ImagePlaceholder width="100%" containerStyle={styles.image} />
          )}
          <PropertyDetails assetData={data[currentAssetIndex] ?? ({} as Asset)} />
        </View>
        {!isTablet && <Divider containerStyles={styles.divider} />}
        <View style={styles.latestUpdates}>
          <LatestUpdates
            propertyVisitsData={data[currentAssetIndex]?.listingVisits ?? ({} as AssetListingVisits)}
            propertyOffersData={data[currentAssetIndex]?.listingOffers ?? ({} as AssetOfferSummary)}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

interface IStyle {
  container: ViewStyle;
  header: ViewStyle;
  headerText: ViewStyle;
  headerIcon: ViewStyle;
  icon: ViewStyle;
  mainContent: ViewStyle;
  propertyInfo: ViewStyle;
  nextPrevBtn: ViewStyle;
  image: ImageStyle;
  latestUpdates: ViewStyle;
  divider: ViewStyle;
}

const vacantPropertyStyle = (isMobile: boolean, isTablet: boolean): IStyle =>
  StyleSheet.create<IStyle>({
    container: {
      marginTop: 24,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 16,
      backgroundColor: theme.colors.white,
      borderRadius: 4,
    },
    header: {
      marginBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerText: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    headerIcon: {
      marginRight: 8,
    },
    nextPrevBtn: {
      flexDirection: 'row',
    },
    icon: {
      color: theme.colors.blue,
    },
    mainContent: {
      flexDirection: isTablet ? 'column' : 'row',
    },
    propertyInfo: {
      flex: isTablet ? 1 : 2,
      flexDirection: isMobile ? 'column' : 'row',
    },
    image: {
      flex: 1,
      minWidth: isMobile ? '100%' : undefined,
      minHeight: isMobile ? 210 : 'calc(100% - 16px)',
      alignSelf: 'flex-start',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      marginTop: 16,
      marginRight: isMobile ? 0 : 12,
    },
    latestUpdates: {
      flex: 1,
      marginTop: 16,
      marginLeft: isMobile ? 0 : 20,
    },
    divider: {
      width: 1,
      height: 250,
    },
  });

export default VacantProperties;
