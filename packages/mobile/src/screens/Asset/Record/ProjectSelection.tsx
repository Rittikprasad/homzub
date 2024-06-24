import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ResponseHelper } from '@homzhub/common/src/services/GooglePlaces/ResponseHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IProjectSelectionProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const ProjectSelection = (): React.ReactElement => {
  const { params } = useRoute();
  const { navigate, goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const { projects, options } = params as IProjectSelectionProps;

  const onContinue = (): void => {
    navigate(ScreensKeys.AssetLocationMap, options);
  };

  const onSelectProject = (projectId: number): void => {
    const {
      name,
      formatted_address,
      geometry: {
        location: { lat, lng },
      },
    } = options.placeData;
    const { state, city, country, pincode, countryIsoCode } = ResponseHelper.getLocationDetails(options.placeData);
    navigate(ScreensKeys.PostAssetDetails, {
      latitude: lat,
      longitude: lng,
      name,
      address: formatted_address,
      city,
      pincode,
      country,
      countryIsoCode,
      state,
      projectId,
    });
  };

  return (
    <Screen
      backgroundColor={theme.colors.white}
      headerProps={{ title: t('projects'), onIconPress: goBack }}
      containerStyle={styles.container}
    >
      <Text type="small" style={styles.heading}>
        {t('belongToProject')}
      </Text>
      {projects.map((item: Unit) => {
        return (
          <TouchableOpacity key={item.id} onPress={(): void => onSelectProject(item.id)} style={styles.card}>
            <Text type="small" style={styles.label}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
      <Button type="primary" title={t('propertyNotInProject')} containerStyle={styles.button} onPress={onContinue} />
    </Screen>
  );
};

export default ProjectSelection;

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  heading: {
    marginVertical: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.darkTint10,
    padding: 14,
    marginTop: 20,
  },
  label: {
    color: theme.colors.primaryColor,
  },
  button: {
    marginVertical: 30,
  },
});
