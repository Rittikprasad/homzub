import React, { FC, useRef, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { GeolocationError, GeolocationResponse } from '@homzhub/common/src/services/Geolocation/interfaces';
import { PropertyRepository } from '@homzhub/common/src/domain/repositories/PropertyRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import AutoCompletionSearchBar, { IAddressComponent } from '@homzhub/web/src/components/atoms/AutoCompletionSearchBar';
import GoogleMapView from '@homzhub/web/src/components/atoms/GoogleMapView';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ProjectSelectionPopover from '@homzhub/web/src/screens/addPropertyLocation/components/ProjectSelectionPopover';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { ILatLng, IProjectDetails } from '@homzhub/common/src/modules/search/interface';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { AddPropertyStack } from '@homzhub/web/src/screens/addProperty';

interface IPropertyLocationProps {
  setUpdatedLatLng: (latLng: ILatLng) => void;
  hasScriptLoaded: boolean;
  navigateScreen: (screen: AddPropertyStack) => void;
  setProjectDetails: React.Dispatch<React.SetStateAction<IProjectDetails>>;
}

interface ISearchViewProps {
  setUpdatedLatLng: (latLng: ILatLng) => void;
  hasScriptLoaded: boolean;
  navigateScreen: (screen: AddPropertyStack) => void;
  setProjectDetails: React.Dispatch<React.SetStateAction<IProjectDetails>>;
  setProjects: (projects: Unit[]) => void;
  onOpenModal: () => void;
}

const AddPropertyLocation: FC<IPropertyLocationProps> = (props: IPropertyLocationProps) => {
  const { setUpdatedLatLng, hasScriptLoaded, navigateScreen, setProjectDetails } = props;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = AddPropertyLocationStyles;
  const [projects, setProjects] = useState([new Unit()]);
  const popupRef = useRef<PopupActions>(null);
  const onOpenModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };
  const onCloseModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };
  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      {hasScriptLoaded && <GoogleMapView />}
      <SearchView
        setUpdatedLatLng={setUpdatedLatLng}
        hasScriptLoaded={hasScriptLoaded}
        navigateScreen={navigateScreen}
        setProjectDetails={setProjectDetails}
        setProjects={setProjects}
        onOpenModal={onOpenModal}
      />
      <ProjectSelectionPopover
        popupRef={popupRef}
        onCloseModal={onCloseModal}
        projects={projects}
        setProjectDetails={setProjectDetails}
        navigateScreen={navigateScreen}
      />
    </View>
  );
};

const SearchView: FC<ISearchViewProps> = (props: ISearchViewProps) => {
  const { setUpdatedLatLng, hasScriptLoaded, navigateScreen, setProjectDetails, setProjects, onOpenModal } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.propertySearch);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = searchViewStyles();
  const blurBackgroundStyle = {
    position: 'absolute' as 'absolute',
    backgroundColor: theme.colors.carouselCardOpacity,
    backdropFilter: 'blur(8px)',
    width: '100%',
    height: !isMobile ? '100%' : 162,
    marginTop: isMobile ? '20%' : '',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const onPressAutoDetect = (): void => {
    GeolocationService.getCurrentPosition(onFetchSuccess, onFetchError);
  };
  const onFetchSuccess = (response: GeolocationResponse): void => {
    const { latitude, longitude } = response.coords;
    setUpdatedLatLng({ lat: latitude, lng: longitude });
    PropertyRepository.getProjects({ latitude, longitude, name: '' }).then((res) => {
      if (res.length > 0) {
        setProjects(res);
        onOpenModal();
        navigateScreen(AddPropertyStack.PropertyDetailsMapScreen);
      } else {
        navigateScreen(AddPropertyStack.PropertyDetailsMapScreen);
      }
    });
  };
  const onFetchError = (error: GeolocationError): void => {
    AlertHelper.error({ message: error.message, statusCode: error.code });
  };

  const onSuggestionPress = (place: IAddressComponent[], address: string, latLng: ILatLng): void => {
    const { lat, lng } = latLng;
    setUpdatedLatLng({ lat, lng });
    PropertyRepository.getProjects({ latitude: lat, longitude: lng, name: '' }).then((res) => {
      if (res.length > 0) {
        setProjects(res);
        onOpenModal();
      } else {
        navigateScreen(AddPropertyStack.PropertyDetailsMapScreen);
      }
    });
  };
  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <div style={blurBackgroundStyle} />
      <View style={[styles.innerContainer, isMobile && styles.innerContainerMobile]}>
        <Typography size="regular" style={styles.title}>
          {t('findProperty')}
        </Typography>
        <AutoCompletionSearchBar
          setUpdatedLatLng={setUpdatedLatLng}
          hasScriptLoaded={hasScriptLoaded}
          setProjectDetails={setProjectDetails}
          onSuggestionPress={onSuggestionPress}
        />
        <Button type="secondaryOutline" containerStyle={styles.buttonContainer} onPress={onPressAutoDetect}>
          <Icon name={icons.location} size={15} color={theme.colors.white} />
          <Typography variant="label" size="regular" style={styles.buttonTitle}>
            {t('property:autoDetectLocation')}
          </Typography>
        </Button>
      </View>
    </View>
  );
};
interface ISearchViewStyles {
  container: ViewStyle;
  containerMobile: ViewStyle;
  innerContainer: ViewStyle;
  title: ViewStyle;
  buttonTitle: ViewStyle;
  buttonContainer: ViewStyle;
  innerContainerMobile: ViewStyle;
}
const searchViewStyles = (): StyleSheet.NamedStyles<ISearchViewStyles> =>
  StyleSheet.create<ISearchViewStyles>({
    container: {
      position: 'absolute',
      marginTop: '10%',
      width: '60%',
      height: 'fit-content',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    containerMobile: {
      width: '90%',
    },
    innerContainer: {
      marginHorizontal: 24,
      alignSelf: 'stretch',
    },
    innerContainerMobile: {
      marginTop: '20%',
      marginHorizontal: 8,
    },

    title: {
      color: theme.colors.white,
      marginVertical: 24,
      textAlign: 'center',
    },
    buttonTitle: {
      color: theme.colors.white,
      marginLeft: 8,
      paddingVertical: 4,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 24,
      borderWidth: 0,
    },
  });

const AddPropertyLocationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    padding: 20,
    marginBottom: 48,
    borderRadius: 4,
    width: '100%',
    minHeight: 908,
    justifyContent: 'center',
  },
  containerMobile: {
    padding: 4,
    minHeight: 680,
  },
});

export default AddPropertyLocation;
