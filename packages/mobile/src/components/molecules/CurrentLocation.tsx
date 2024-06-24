import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { GeolocationResponse } from '@homzhub/common/src/services/Geolocation/interfaces';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { PermissionsService } from '@homzhub/common/src/services/Permissions/PermissionService';
import { PERMISSION_TYPE } from '@homzhub/common/src/constants/PermissionTypes';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  onGetCurrentPositionSuccess: (data: GeolocationResponse) => void;
  testID?: string;
  textToShow?: string;
}

const CurrentLocation = (props: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const { onGetCurrentPositionSuccess, textToShow = t('common:nearMe') } = props;

  const onAutoDetectPress = async (): Promise<void> => {
    const isLocationEnabled = await PermissionsService.checkPermission(PERMISSION_TYPE.location);

    if (!isLocationEnabled) {
      AlertHelper.error({ message: t('enableLocationPermission') });
      return;
    }

    GeolocationService.getCurrentPosition(onGetCurrentPositionSuccess, (error) => {
      AlertHelper.error({ message: t('errorFetchingLocation') });
    });
  };

  return (
    <TouchableOpacity onPress={onAutoDetectPress} style={styles.autoDetectTextContainer} testID="touchableNearMe">
      <Icon name={icons.location} size={16} color={theme.colors.primaryColor} />
      <Label type="large" textType="semiBold" style={styles.autoDetectText}>
        {textToShow}
      </Label>
    </TouchableOpacity>
  );
};

const memoizedComponent = React.memo(CurrentLocation);
export { memoizedComponent as CurrentLocation };

const styles = StyleSheet.create({
  autoDetectTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,

    elevation: 1,
  },
  autoDetectText: {
    marginStart: 8,
    color: theme.colors.primaryColor,
  },
});
