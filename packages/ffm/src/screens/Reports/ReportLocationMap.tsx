import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { WithShadowView } from '@homzhub/common/src/components/atoms/WithShadowView';
import FullHeaderScreen from '@homzhub/ffm/src/components/HOC/FullHeaderScreen';
import { ILocationParam, ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
import { LocationInstruction } from '@homzhub/common/src/constants/Location';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const ReportLocationMap = (): React.ReactElement => {
  const { goBack, navigate } = useNavigation();
  const { params } = useRoute();
  const { t } = useTranslation(LocaleConstants.namespacesKey.reports);
  const report = useSelector(FFMSelector.getCurrentReport);
  const [markerLatLng, setLatLng] = useState<LatLng>({
    latitude: 0,
    longitude: 0,
  });
  const [canStartInspection, setInspectionValue] = useState(false);

  const {
    placeData: {
      name,
      formatted_address,
      geometry: {
        location: { lat, lng },
      },
    },
  } = params as ILocationParam;

  useEffect(() => {
    setLatLng({ latitude: lat, longitude: lng });
  }, [lat, lng]);

  const onContinue = (): void => {
    navigate(ScreenKeys.Inspection);
  };

  const onStart = (): void => {
    if (report) {
      FFMRepository.outsetsCheck({
        reportId: report.id,
        body: {
          latitude: lat,
          longitude: lng,
        },
      })
        .then((res) => {
          setInspectionValue(res.canStartInspection);
          if (!res.canStartInspection) {
            AlertHelper.error({ message: t('needToBeAtProperty') });
          }
        })
        .catch((e) => {
          AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
        });
    }
  };

  return (
    <FullHeaderScreen
      onGoBack={goBack}
      pageTitle={name}
      pageSubTitle={formatted_address}
      screenTitle={t('common:location')}
    >
      <MapView
        provider={PROVIDER_GOOGLE}
        style={[styles.mapView, canStartInspection && styles.inspectionView]}
        initialRegion={{
          ...markerLatLng,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
      >
        <Marker coordinate={markerLatLng} />
      </MapView>
      {canStartInspection && (
        <View style={styles.content}>
          <Text type="small" textType="semiBold" style={styles.title}>
            {t('instructions')}
          </Text>
          {LocationInstruction.map((item, index) => {
            return (
              <Label key={index} type="large" style={styles.label}>
                {item}
              </Label>
            );
          })}
        </View>
      )}
      <WithShadowView isBottomShadow={false} outerViewStyle={styles.shadowView}>
        <Button
          type="primary"
          onPress={canStartInspection ? onContinue : onStart}
          title={canStartInspection ? t('common:continue') : t('startInspection')}
          containerStyle={styles.buttonContainer}
        />
      </WithShadowView>
    </FullHeaderScreen>
  );
};

export default ReportLocationMap;

const styles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
  content: {
    flex: 1,
    margin: 20,
  },
  title: {
    marginTop: 16,
  },
  label: {
    marginTop: 16,
    color: theme.colors.darkTint2,
  },
  shadowView: {
    backgroundColor: theme.colors.white,
    paddingBottom: 0,
  },
  buttonContainer: {
    flex: 0,
    height: 48,
    margin: 16,
  },
  inspectionView: {
    flex: 0,
    height: 300,
  },
});
