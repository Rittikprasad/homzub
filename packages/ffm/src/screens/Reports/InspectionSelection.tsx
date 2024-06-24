import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { PermissionsService } from '@homzhub/common/src/services/Permissions/PermissionService';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import {
  GooglePlaceDetail,
  GooglePlaceData,
  GoogleGeocodeData,
} from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
import { GeolocationResponse } from '@homzhub/common/src/services/Geolocation/interfaces';
import { PERMISSION_TYPE } from '@homzhub/common/src/constants/PermissionTypes';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

enum ButtonCode {
  IN_PROPERTY = 'IN_PROPERTY',
  NOT_IN_PROPERTY = 'NOT_IN_PROPERTY',
}

interface IButton {
  title: string;
  code: ButtonCode;
  icon?: string;
}

const InspectionSelection = (): React.ReactElement => {
  const { goBack, navigate } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.reports);
  const report = useSelector(FFMSelector.getCurrentReport);
  const [isLoading, setLoading] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const [isContinueEnable, setContinueVisibility] = useState(false);

  const handleButtonSelection = (item: IButton): void => {
    setSelectedCode(item.code);
    if (item.code === ButtonCode.NOT_IN_PROPERTY) {
      setContinueVisibility(false);
      AlertHelper.error({ message: t('needToBeAtProperty') });
      return;
    }

    setContinueVisibility(true);
  };

  const onContinue = async (): Promise<void> => {
    const isLocationEnabled = await PermissionsService.checkPermission(PERMISSION_TYPE.location);

    if (!isLocationEnabled) {
      AlertHelper.error({ message: t('common:enableLocationPermission') });
      return;
    }

    GeolocationService.getCurrentPosition(onGetCurrentPositionSuccess, (error) => {
      AlertHelper.error({ message: t('common:errorFetchingLocation') });
    });
  };

  const onGetCurrentPositionSuccess = (data: GeolocationResponse): void => {
    const {
      coords: { latitude, longitude },
    } = data;
    setLoading(true);
    GooglePlacesService.getLocationData({ lng: longitude, lat: latitude })
      .then((locData) => {
        onGetLocation(locData);
      })
      .catch((e) => {
        setLoading(false);
        AlertHelper.error({ message: e.message });
      });
  };

  const onGetLocation = (place: GooglePlaceData | GoogleGeocodeData): void => {
    GooglePlacesService.getPlaceDetail(place.place_id)
      .then((placeData: GooglePlaceDetail) => {
        setLoading(false);
        navigate(ScreenKeys.ReportLocationMap, { placeData });
      })
      .catch((e) => {
        setLoading(false);
        AlertHelper.error({ message: e.message });
      });
  };

  const getButtonData = (): IButton[] => {
    return [
      {
        title: t('iAmAtProperty'),
        code: ButtonCode.IN_PROPERTY,
      },
      {
        title: t('notIAmAtProperty'),
        code: ButtonCode.NOT_IN_PROPERTY,
        icon: icons.homeOutline,
      },
    ];
  };
  return (
    <GradientScreen
      isUserHeader
      onGoBack={goBack}
      loading={isLoading}
      screenTitle={t('reports')}
      pageTitle={t('selectionProcess')}
    >
      {report ? (
        <>
          <PropertyAddressCountry
            primaryAddress={report.asset.projectName}
            subAddress={report.asset.address}
            countryFlag={report.asset.country.flag}
          />
          <View style={styles.container}>
            <Text type="small" style={styles.title}>
              {t('physicalInspection')}
            </Text>
            {getButtonData().map((item, index) => {
              const isSelected = selectedCode === item.code;
              return (
                <Button
                  key={index}
                  iconSize={20}
                  icon={item.icon}
                  title={item.title}
                  type={isSelected ? 'primary' : 'secondary'}
                  onPress={(): void => handleButtonSelection(item)}
                  containerStyle={styles.buttonContainer}
                  iconColor={isSelected ? theme.colors.white : theme.colors.disabled}
                  titleStyle={[styles.buttonTitle, { color: isSelected ? theme.colors.white : theme.colors.darkTint5 }]}
                />
              );
            })}
          </View>
          <Button
            disabled={!isContinueEnable}
            onPress={onContinue}
            type="primary"
            title={t('common:continue')}
            containerStyle={styles.continue}
          />
        </>
      ) : (
        <EmptyState />
      )}
    </GradientScreen>
  );
};

export default InspectionSelection;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    flex: 1,
  },
  title: {
    color: theme.colors.darkTint5,
    marginBottom: 16,
  },
  buttonTitle: {
    marginHorizontal: 8,
  },
  buttonContainer: {
    flex: 0,
    marginTop: 20,
    flexDirection: 'row-reverse',
    borderColor: theme.colors.disabled,
  },
  continue: {
    flex: 0,
  },
});
