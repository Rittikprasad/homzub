import React, { FC, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Script from 'react-load-script';
import { History } from 'history';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { useDispatch, useSelector } from 'react-redux';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { AddPropertyContext } from '@homzhub/web/src/screens/addProperty/AddPropertyContext';
import { AppLayoutContext } from '@homzhub/web/src/screens/appLayout/AppLayoutContext';
import { theme } from '@homzhub/common/src/styles/theme';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import AddPropertyLocation from '@homzhub/web/src/screens/addPropertyLocation';
import AddPropertyView from '@homzhub/common/src/components/organisms/AddPropertyView';
import PropertyDetailsMap from '@homzhub/web/src/screens/addProperty/components/PropertyDetailsMap';
import { ILatLng, IProjectDetails } from '@homzhub/common/src/modules/search/interface';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IPropertySelectedImages } from '@homzhub/common/src/domain/models/VerificationDocuments';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';

interface IComponentMap {
  component: AddPropertyStack;
}
interface IRouteProps {
  currentScreen: number;
}
interface IProps {
  history: History<IRouteProps>;
}

export enum AddPropertyStack {
  AddPropertyLocationScreen,
  PropertyDetailsMapScreen,
  AddPropertyViewScreen,
}

const AddProperty: FC<IProps> = (props: IProps) => {
  const { history } = props;
  const { location } = history;
  const dispatch = useDispatch();
  const assetId = useSelector(RecordAssetSelectors.getCurrentAssetId);
  const selectedImages = useSelector(RecordAssetSelectors.getSelectedImages);
  const { goBackClicked, setGoBackClicked } = useContext(AppLayoutContext);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const [hasScriptLoaded, setHasScriptLoaded] = useState(false);
  const [latLng, setLatLng] = useState({ lat: 0, lng: 0 } as ILatLng);
  const [placeData, setPlacesData] = useState({});
  const [addressDetails, setAddressDetails] = useState({});
  const [currentScreens, setCurrentScreens] = useState(location.state.currentScreen);
  const [projectDetails, setProjectDetails] = useState({ projectName: '' } as IProjectDetails);
  useEffect(() => {
    if (goBackClicked) {
      goBack();
      setGoBackClicked(false);
    }
  }, [goBackClicked]);
  const navigateScreen = (comp: AddPropertyStack): void => {
    setCurrentScreens(comp);
  };
  const goBack = (): void => {
    if (currentScreens === 0) {
      navigateToDashboard();
    }
    if (currentScreens !== AddPropertyStack.AddPropertyLocationScreen) {
      const activeIndex = compArray.findIndex((value) => value.component === currentScreens);
      setCurrentScreens(compArray[activeIndex - 1].component);
    }
  };

  const navigateToDashboard = (): void => {
    NavigationService.navigate(history, { path: RouteNames.protectedRoutes.DASHBOARD });
  };
  const handleEditSelection = (): void => {
    setCurrentScreens(AddPropertyStack.PropertyDetailsMapScreen);
  };

  const onImageSelection = async (files?: File[]): Promise<void> => {
    if (!files) {
      return;
    }
    try {
      const formData = new FormData();
      files.forEach((image: File) => {
        formData.append('files[]', image);
      });
      try {
        const response = await AttachmentService.uploadImage(formData, AttachmentType.ASSET_IMAGE);
        const { data } = response;
        const localSelectedImages: IPropertySelectedImages[] = [];
        data.forEach((item: any) => {
          localSelectedImages.push({
            id: null,
            description: '',
            is_cover_image: false,
            asset: assetId,
            attachment: item.id,
            link: item.link,
            file_name: 'localImage',
            isLocalImage: true,
          });
        });
        if (selectedImages.length === 0) {
          localSelectedImages[0].is_cover_image = true;
        }
        dispatch(
          RecordAssetActions.setSelectedImages(
            selectedImages.concat(ObjectMapper.deserializeArray(AssetGallery, localSelectedImages))
          )
        );
      }catch (e: any) {        AlertHelper.error({ message: e.message, statusCode: e.details.statusCode }); // TODOS: Lakshit - Require clarity on usage
      }
    }catch (e: any) {      AlertHelper.error({ message: e.message, statusCode: e.details.statusCode }); // TODOS Lakshit - Require clarity on usage
    }
  };
  const compArray: IComponentMap[] = [
    { component: AddPropertyStack.AddPropertyLocationScreen },
    { component: AddPropertyStack.PropertyDetailsMapScreen },
    { component: AddPropertyStack.AddPropertyViewScreen },
  ];
  const styles = AddPropertyStyles;
  const compProps = {
    wasRedirected: true,
  };
  const onNavigateToPlanSelection = (): void => {
    NavigationService.navigate(history, { path: RouteNames.protectedRoutes.ADD_LISTING, params: { ...compProps } });
  };
  const onNavigateToDetail = (): void => {
    NavigationService.navigate(history, { path: RouteNames.protectedRoutes.ADD_LISTING });
  };
  const renderScreen = (comp: AddPropertyStack): React.ReactElement => {
    const { AddPropertyLocationScreen, PropertyDetailsMapScreen, AddPropertyViewScreen } = AddPropertyStack;
    switch (comp) {
      case PropertyDetailsMapScreen:
        return <PropertyDetailsMap />;
      case AddPropertyViewScreen:
        return (
          <View style={styles.flexOne}>
            <AddPropertyView
              onUploadImage={onImageSelection}
              onEditPress={handleEditSelection}
              onNavigateToPlanSelection={onNavigateToPlanSelection}
              onNavigateToDetail={onNavigateToDetail}
            />
          </View>
        );
      case AddPropertyLocationScreen:
      default:
        return (
          <AddPropertyLocation
            setUpdatedLatLng={setLatLng}
            hasScriptLoaded={hasScriptLoaded}
            navigateScreen={navigateScreen}
            setProjectDetails={setProjectDetails}
          />
        );
    }
  };
  return (
    <AddPropertyContext.Provider
      value={{
        hasScriptLoaded,
        latLng,
        setUpdatedLatLng: setLatLng,
        navigateScreen,
        placeData,
        setPlacesData,
        addressDetails,
        setAddressDetails,
        goBack,
        projectDetails,
        setProjectDetails,
      }}
    >
      <View style={[styles.container, isTablet && styles.containerTablet]}>
        <Script
          url={`https://maps.googleapis.com/maps/api/js?key=${ConfigHelper.getPlacesApiKey()}&libraries=places`}
          onLoad={(): void => setHasScriptLoaded(true)}
        />
        {renderScreen(currentScreens)}
      </View>
    </AddPropertyContext.Provider>
  );
};
const AddPropertyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    marginBottom: 48,
    borderRadius: 4,
    width: '100%',
  },
  flexOne: {
    flex: 1,
  },
  containerTablet: {
    flexDirection: 'column',
  },
});
export default AddProperty;
