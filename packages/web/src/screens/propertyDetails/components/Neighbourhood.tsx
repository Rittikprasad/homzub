import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Script from 'react-load-script';
import { useSelector } from 'react-redux';
import { Marker } from '@react-google-maps/api';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { ResponseHelper } from '@homzhub/common/src/services/GooglePlaces/ResponseHelper';
import { useOnly, useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import GoogleMapView from '@homzhub/web/src/components/atoms/GoogleMapView';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { CustomMarker } from '@homzhub/web/src/components/molecules/CustomMarker';
import ExploreSections from '@homzhub/common/src/components/molecules/ExploreSections';
import { NeighborhoodTabs, PLACES_DATA } from '@homzhub/common/src/constants/AssetNeighbourhood';
import { PlaceTypes } from '@homzhub/common/src/services/GooglePlaces/constants';
import { PointOfInterest } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

type Props = {};

const Neighbourhood: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const [hasScriptLoaded, setHasScriptLoaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const asset = useSelector(AssetSelectors.getAsset);
  const metricSystem = useSelector(UserSelector.getMetricSystem);
  // TODO: (Lakshit) - Remove this comment once isApiActive is used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  const [isApiActive, setIsApiActive] = useState(false);
  const [selectedTab, setSelectedTab] = useState(NeighborhoodTabs.Nearby);

  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);
  const [selectedPlaceType, setSelectedPlaceType] = useState<PlaceTypes>(
    Object.values(PLACES_DATA[NeighborhoodTabs.Nearby])[0].key
  );
  // TODO: Selected Marker Will Work when places API will be functional
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('');
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);

  const onPoiPress = (poi: PointOfInterest): void => {
    const { placeId } = poi;
    setSelectedPlaceId(placeId);
  };

  useEffect(() => {
    getNearbySearch(selectedPlaceType);
  }, [map, selectedTab]);

  const handleOnMapLoad = (mapInstance: google.maps.Map): void => {
    setMap(mapInstance);
  };

  const getNearbySearch = (argSelectedPlaceType: PlaceTypes): void => {
    if (map) {
      const latlng = new google.maps.LatLng(LatLng);
      const request = {
        location: latlng,
        radius: 5000,
        type: argSelectedPlaceType,
      };
      const service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, (results, status) => {
        setSelectedPlaceType(argSelectedPlaceType);
        if (results) {
          nearbyCallback(results, status);
        }
      });
    }
  };

  const nearbyCallback = (
    results: google.maps.places.PlaceResult[],
    status: google.maps.places.PlacesServiceStatus
  ): void => {
    if (!asset) return;
    const { assetLocation } = asset;
    try {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setPointsOfInterest(ResponseHelper.transformPOIsWeb(results, assetLocation, metricSystem));
        setIsApiActive(false);
      } else {
        setPointsOfInterest([]);
      }
    } catch (e: any) {
      setIsApiActive(false);
      AlertHelper.error({ message: e.message, statusCode: e.details.statusCode });
    }
  };

  const onTabChange = (argSelectedTab: NeighborhoodTabs): void => {
    const oldTab = selectedTab;
    if (oldTab !== argSelectedTab) {
      setSelectedPlaceType(Object.values(PLACES_DATA[argSelectedTab])[0].key);
    }
    setSelectedTab(argSelectedTab);
  };

  const renderMarkers = (): React.ReactNode => {
    // const { pointsOfInterest, selectedPlaceId, selectedTab, selectedPlaceType } = this.state;
    // @ts-ignore
    const placeType = PLACES_DATA[selectedTab][selectedPlaceType];

    return pointsOfInterest.map((point: PointOfInterest) =>
      selectedPlaceId === point.placeId ? (
        <CustomMarker
          position={{ lat: point.latitude, lng: point.longitude }}
          key={point.placeId}
          iconName={placeType.mapMarker}
          iconColor={theme.colors.blue}
          iconSize={24}
        />
      ) : (
        <CustomMarker
          position={{ lat: point.latitude, lng: point.longitude }}
          key={point.placeId}
          iconName={placeType.mapMarker}
          iconColor={theme.colors.darkTint4}
          iconSize={24}
        />
      )
    );
  };

  if (!asset) return null;
  const {
    id,
    assetLocation: { latitude, longitude },
  } = asset;
  const LatLng = { lat: latitude, lng: longitude };
  return (
    <View style={[styles.flexOne, !isDesktop && styles.flexColumn]}>
      <View style={[styles.exploreSection, !isDesktop && styles.exploreSectionTablet]}>
        {isDesktop && (
          <Typography variant="text" size="regular" fontWeight="semiBold" style={styles.titleText}>
            {t('assetDescription:exploreNeighbourhood')}
          </Typography>
        )}
        <View style={[styles.box, !isDesktop && styles.boxTablet]}>
          {isDesktop && (
            <View style={styles.floatingTabWrapper}>
              <View style={styles.floatingTab}>
                <SelectionPicker
                  data={[
                    { title: t('assetDescription:nearby'), value: NeighborhoodTabs.Nearby },
                    { title: t('assetDescription:commute'), value: NeighborhoodTabs.Commute },
                  ]}
                  selectedItem={[selectedTab]}
                  onValueChange={onTabChange}
                />
              </View>
            </View>
          )}
          <ExploreSections
            placeTypes={Object.values(PLACES_DATA[selectedTab])}
            // @ts-ignore
            selectedPlaceType={PLACES_DATA[selectedTab][selectedPlaceType]}
            onPlaceTypePress={getNearbySearch}
            selectedPoiId={selectedPlaceId}
            pointsOfInterest={pointsOfInterest}
            onPoiPress={onPoiPress}
            metricSystem={metricSystem}
          />
        </View>
      </View>
      <View style={[styles.mapView, !isDesktop && styles.mapViewTablet]}>
        <Typography
          variant="text"
          size="regular"
          fontWeight="semiBold"
          style={[styles.titleText, !isDesktop && styles.titleTextTablet]}
        >
          {t('assetDescription:mapView')}
        </Typography>
        {!isDesktop && (
          <View style={styles.floatingTabWrapper}>
            <View style={[styles.selectionPickerMapTablet, isMobile && styles.selectionPickerMapMobile]}>
              <SelectionPicker
                data={[
                  { title: t('assetDescription:nearby'), value: NeighborhoodTabs.Nearby },
                  { title: t('assetDescription:commute'), value: NeighborhoodTabs.Commute },
                ]}
                selectedItem={[selectedTab]}
                onValueChange={onTabChange}
              />
            </View>
          </View>
        )}
        <Script
          url={`https://maps.googleapis.com/maps/api/js?key=${ConfigHelper.getPlacesApiKey()}&libraries=places`}
          onLoad={(): void => setHasScriptLoaded(true)}
        />
        {hasScriptLoaded && (
          <GoogleMapView center={LatLng} zoom={isMobile ? 12 : 13} onMapLoadCallBack={handleOnMapLoad}>
            <Marker
              position={LatLng}
              key={id}
              icon={{
                path: 'M31.64,58.24c0-0.97-0.79-1.76-1.76-1.76H8.79c-0.97,0-1.76,0.79-1.76,1.76S7.82,60,8.79,60h21.09C30.85,60,31.64,59.21,31.64,58.24z M19.34,0C8.67,0,0,8.67,0,19.34c0,14.62,17.35,32.38,18.09,33.12c0.34,0.34,0.79,0.52,1.24,0.52s0.9-0.17,1.24-0.52c0.74-0.74,18.09-18.5,18.09-33.12C38.67,8.67,30,0,19.34,0z M31.35,20.31c-0.53,0.8-1.62,1.03-2.44,0.49l-0.78-0.52v9.61c0,0.97-0.79,1.76-1.76,1.76H12.3c-0.97,0-1.76-0.79-1.76-1.76v-9.61L9.76,20.8c-0.81,0.53-1.9,0.32-2.44-0.49c-0.54-0.81-0.32-1.9,0.49-2.44l10.55-7.03c0.59-0.39,1.36-0.39,1.95,0l10.55,7.03C31.67,18.41,31.88,19.5,31.35,20.31L31.35,20.31zM14.06,17.93v10.19h10.55V17.93l-5.27-3.52L14.06,17.93z',
                fillColor: theme.colors.blue,
                fillOpacity: 1.0,
                strokeWeight: 0,
                scale: 1.0,
              }}
            />
            {renderMarkers()}
          </GoogleMapView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 24,
    marginBottom: 24,
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column-reverse',
  },
  floatingTabWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  floatingTab: {
    alignItems: 'center',
    left: 0,
    right: 0,
    marginHorizontal: 12,
    marginVertical: 18,
    width: '98%',
  },
  floatingTabMobile: {
    width: 200,
  },
  floatingTablet: {
    position: 'absolute',
    left: 50,
    marginTop: 100,
    width: 300,
  },
  titleText: {
    marginTop: 12,
    marginBottom: 12,
  },
  titleTextTablet: {
    marginBottom: 24,
  },
  exploreSection: {
    width: '39%',
    marginRight: 24,
  },
  exploreSectionTablet: {
    width: '98%',
  },
  box: {
    border: '1px solid',
    borderColor: theme.colors.disabled,
    padding: 12,
    marginTop: 6,
    height: 500,
  },
  boxTablet: {
    marginBottom: 12,
    border: 'none',
    height: 400,
  },
  mapView: {
    width: '60%',
  },
  mapViewTablet: {
    position: 'relative',
    width: '98%',
    height: 400,
  },
  selectionPickerMapMobile: {
    marginTop: 77,
    width: '96%',
  },
  selectionPickerMapTablet: {
    position: 'absolute',
    marginTop: 80,
    width: 350,
  },
});

export default Neighbourhood;
