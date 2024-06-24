import React, { FC, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from '@react-google-maps/api';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { getPlaceDetailsFromPlaceID } from '@homzhub/web/src/utils/MapsUtils';
import { AddPropertyContext } from '@homzhub/web/src/screens/addProperty/AddPropertyContext';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { theme } from '@homzhub/common/src/styles/theme';
import GoogleMapView from '@homzhub/web/src/components/atoms/GoogleMapView';
import PropertyDetailsForm from '@homzhub/web/src/screens/addProperty/components/PropertyDetailsForm';
import { ILatLng } from '@homzhub/common/src/modules/search/interface';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const PropertyDetailsMap: FC = () => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [placeDetails, setPlaceDetails] = useState<google.maps.places.PlaceResult | undefined>(undefined);
  const { hasScriptLoaded, latLng, setUpdatedLatLng, projectDetails } = useContext(AddPropertyContext);
  const { projectName, projectId } = projectDetails;
  useEffect(() => {
    if (hasScriptLoaded && map !== null) {
      GooglePlacesService.getLocationData(latLng).then((r) => {
        getPlaceDetailsFromPlaceID(r.place_id, map, (result) => {
          if (projectName) {
            result.name = projectName;
          }

          setPlaceDetails(result);
        });
      });
    }
  }, [map, latLng, hasScriptLoaded]);

  const handleOnMapLoad = (mapInstance: google.maps.Map): void => {
    setMap(mapInstance);
  };
  const onDragEnd = (event: google.maps.MapMouseEvent): void => {
    const newCenter = { lat: event.latLng?.lat(), lng: event.latLng?.lng() } as ILatLng;
    setUpdatedLatLng(newCenter);
  };
  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      <View style={styles.subContainer}>
        {hasScriptLoaded && (
          <GoogleMapView center={latLng} onMapLoadCallBack={handleOnMapLoad}>
            <Marker position={latLng} draggable animation={google.maps.Animation.DROP} onDragEnd={onDragEnd} />
          </GoogleMapView>
        )}
      </View>
      <View style={[styles.subContainer, isTablet && styles.formTablet]}>
        <PropertyDetailsForm data={placeDetails} projectId={projectId} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    padding: 20,
    borderRadius: 4,
    width: '100%',
  },
  containerTablet: {
    flex: 1,
    flexDirection: 'column',
    minHeight: 'fit-content',
    paddingBottom: 265,
    height: 'auto',
  },
  subContainer: { flex: 1 },
  formTablet: { flex: 3 },
});
export default PropertyDetailsMap;
